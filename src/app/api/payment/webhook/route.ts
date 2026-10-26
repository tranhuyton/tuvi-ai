import { NextResponse } from 'next/server';
import { getOrderByCode, markOrderPaid } from '@/lib/orderStore';
import { sendPaymentSuccessEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

/**
 * Endpoint Webhook nhận thông báo chuyển khoản ngân hàng (SePay / Casso / PayOS / Custom)
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('[PAYMENT WEBHOOK] Nhận dữ liệu webhook:', JSON.stringify(payload));

    // Thu thập các giao dịch cần xử lý
    interface IncomingTx {
      codeCandidate: string;
      amount: number;
      txId: string;
      rawContent: string;
      transferType?: 'in' | 'out';
    }

    const txList: IncomingTx[] = [];

    // 1. Trường hợp payload trực tiếp từ Casso: { data: [ { description, amount, id, ... } ] }
    if (Array.isArray(payload.data)) {
      for (const item of payload.data) {
        txList.push({
          codeCandidate: item.description || '',
          amount: Math.abs(Number(item.amount || 0)),
          txId: String(item.id || item.tid || ''),
          rawContent: item.description || '',
          transferType: Number(item.amount || 0) < 0 ? 'out' : 'in',
        });
      }
    }
    // 2. Trường hợp SePay: { content, description, transferAmount, transferType, code, id, ... }
    else if (
      payload.transferAmount !== undefined ||
      payload.amount !== undefined ||
      payload.content !== undefined ||
      payload.description !== undefined ||
      payload.code !== undefined
    ) {
      const fullContent = [
        payload.code,
        payload.content,
        payload.description,
        payload.subAccount,
        payload.referenceCode,
      ]
        .filter(Boolean)
        .join(' ');

      txList.push({
        codeCandidate: fullContent,
        amount: Number(payload.transferAmount || payload.amount || 0),
        txId: String(payload.id || payload.referenceCode || payload.tid || `sepay_${Date.now()}`),
        rawContent: fullContent,
        transferType: payload.transferType === 'out' ? 'out' : 'in',
      });
    }
    // 3. Trường hợp PayOS: { data: { orderCode, amount, description, ... } }
    else if (payload.data && typeof payload.data === 'object') {
      const pData = payload.data;
      txList.push({
        codeCandidate: String(pData.orderCode || pData.description || ''),
        amount: Number(pData.amount || 0),
        txId: String(pData.paymentLinkId || pData.reference || ''),
        rawContent: pData.description || '',
        transferType: 'in',
      });
    }
    // 4. Trường hợp payload tùy chỉnh / Manual test: { orderCode, amount, transactionId }
    else if (payload.orderCode) {
      txList.push({
        codeCandidate: String(payload.orderCode),
        amount: Number(payload.amount || 0),
        txId: String(payload.transactionId || `tx_${Date.now()}`),
        rawContent: payload.orderCode,
        transferType: 'in',
      });
    }

    if (txList.length === 0) {
      return NextResponse.json({ success: false, message: 'Payload không chứa giao dịch nhận diện được' }, { status: 400 });
    }

    const results = [];

    for (const tx of txList) {
      // 0. Kiểm tra nếu đây là giao dịch Admin quét QR trả hoa hồng cho CTV (Nội dung: HOA HONG <MÃ_CTV>)
      const payoutMatch = tx.codeCandidate.match(/HOA\s*HONG\s*[:\-_]?\s*([A-Z0-9_-]{2,25})/i);
      if (payoutMatch && tx.amount > 0) {
        const affCode = payoutMatch[1].toLowerCase();
        const { getAffiliateByCode, payoutAffiliate } = await import('@/lib/affiliateStore');
        const aff = await getAffiliateByCode(affCode);
        if (aff) {
          const txMarker = `tx#${tx.txId}`;
          if (aff.notes && aff.notes.includes(txMarker)) {
            console.log(`[PAYMENT WEBHOOK] Giao dịch chi trả hoa hồng ${txMarker} cho CTV ${affCode} đã được xử lý trước đó.`);
            results.push({ code: `PAYOUT_${affCode.toUpperCase()}`, status: 'ALREADY_PROCESSED' });
            continue;
          }

          await payoutAffiliate(aff.id, tx.amount, `Tự động trừ số dư qua VietQR (${txMarker})`);
          console.log(`[PAYMENT WEBHOOK] ĐÃ TỰ ĐỘNG TRỪ SỐ DƯ RÚT TIỀN ${tx.amount.toLocaleString('vi-VN')}đ CHO CTV ${affCode}`);
          results.push({
            code: `PAYOUT_${affCode.toUpperCase()}`,
            affiliateCode: affCode,
            amount: tx.amount,
            status: 'PAYOUT_CONFIRMED',
          });
          continue;
        }
      }

      // Nếu là giao dịch Tiền Ra (out) thông thường (không phải trả hoa hồng CTV), bỏ qua an toàn để không kích hoạt nhầm đơn hàng của khách
      if (tx.transferType === 'out') {
        console.log('[PAYMENT WEBHOOK] Bỏ qua giao dịch tiền ra thông thường:', tx.rawContent);
        results.push({ code: tx.txId, status: 'IGNORED_OUTGOING_TX' });
        continue;
      }

      // 1. Tìm mã đơn TVxxxxx (hỗ trợ có khoảng trắng, gạch nối: TV49354, TV 49354, TV-49354, TV: 49354)
      const match = tx.codeCandidate.match(/TV\s*[:\-_]?\s*(\d{4,8})/i);
      const matchedCode = match ? `TV${match[1]}`.toUpperCase() : null;

      let order = null;
      if (matchedCode) {
        order = await getOrderByCode(matchedCode);
      }

      // Fallback thông minh: Nếu không tìm thấy mã trong nội dung,
      // tìm đơn hàng PENDING gần nhất (trong 30 phút qua) có đúng số tiền khớp
      if (!order && tx.amount > 0) {
        try {
          const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
          const { data: candidateOrders } = await supabase
            .from('tuvi_orders')
            .select('*')
            .eq('status', 'PENDING')
            .eq('amount', tx.amount)
            .gte('created_at', thirtyMinsAgo)
            .order('created_at', { ascending: false })
            .limit(1);

          if (candidateOrders && candidateOrders.length > 0) {
            const cand = candidateOrders[0];
            console.log(`[PAYMENT WEBHOOK] Khớp fallback đơn PENDING gần nhất: ${cand.order_code}`);
            order = await getOrderByCode(cand.order_code);
          }
        } catch (e) {
          console.warn('[PAYMENT WEBHOOK] Lỗi fallback khớp theo số tiền:', e);
        }
      }

      if (!order && matchedCode) {
        console.warn(`[PAYMENT WEBHOOK] Đơn ${matchedCode} chưa có trong DB, tự động khởi tạo để duyệt`);
        const { createOrder } = await import('@/lib/orderStore');
        const pType =
          tx.amount >= 600000
            ? 'course_tuvi'
            : tx.amount >= 269000
            ? 'reading_expert'
            : tx.amount === 150000
            ? 'upgrade_expert'
            : tx.amount === 129000
            ? 'chat_expert'
            : tx.amount >= 119000
            ? 'reading_vip'
            : tx.amount >= 99000
            ? 'chat_vip'
            : 'chat_free';
        order = await createOrder({
          customCode: matchedCode,
          paymentType: pType,
          amount: tx.amount || 49000,
          hoTen: 'Đương số',
        });
      }

      if (!order) {
        console.warn('[PAYMENT WEBHOOK] Không thể xác định đơn hàng cho giao dịch:', tx);
        continue;
      }

      if (order.status === 'PAID') {
        console.log(`[PAYMENT WEBHOOK] Đơn hàng ${order.orderCode} đã thanh toán trước đó.`);
        results.push({ code: order.orderCode, status: 'ALREADY_PAID' });
        continue;
      }

      // Đánh dấu đơn hàng là đã thanh toán
      await markOrderPaid(order.orderCode, tx.txId);
      console.log(`[PAYMENT WEBHOOK] ĐÃ KÍCH HOẠT ĐƠN HÀNG THÀNH CÔNG: ${order.orderCode}`);

      // Ghi nhận hoa hồng cho CTV nếu đơn hàng có mã Affiliate
      if (order.affiliateCode) {
        try {
          const { recordAffiliateCommission } = await import('@/lib/affiliateStore');
          const comm = await recordAffiliateCommission(
            order.affiliateCode,
            order.amount,
            order.orderCode,
            order.paymentType
          );
          console.log(`[PAYMENT WEBHOOK] Đã cộng hoa hồng ${comm.toLocaleString('vi-VN')}đ cho CTV ${order.affiliateCode}`);
        } catch (affErr) {
          console.warn('[PAYMENT WEBHOOK] Lỗi ghi nhận hoa hồng CTV:', affErr);
        }
      }

      // Nếu đơn hàng có chartId (hoặc tìm thấy lá số trùng tên của user), cập nhật tier & quota trong Supabase
      try {
        let targetChartId = order.chartId;
        if (!targetChartId && (order.userId || order.email)) {
          let query = supabase.from('tuvi_charts').select('id, duong_so_data, laso_data');
          if (order.userId) {
            query = query.eq('user_id', order.userId);
          }
          const { data: userCharts } = await query;
          const matched = (userCharts || []).find(
            (c: any) => c.duong_so_data?.hoTen?.trim().toLowerCase() === order.hoTen?.trim().toLowerCase()
          );
          if (matched) {
            targetChartId = matched.id;
            order.chartId = matched.id;
            await supabase.from('tuvi_orders').update({ chart_id: matched.id }).eq('order_code', order.orderCode);
          }
        }

        if (targetChartId) {
          const { data: chartData } = await supabase
            .from('tuvi_charts')
            .select('duong_so_data, laso_data')
            .eq('id', targetChartId)
            .maybeSingle();

          if (chartData) {
            const prevQuota = chartData.laso_data?.quota || {
              basicAllowed: 0,
              proAllowed: 0,
              expertAllowed: 0,
            };
            const nextQuota = {
              basicAllowed: Number(prevQuota.basicAllowed || 0),
              proAllowed: Number(prevQuota.proAllowed || 0),
              expertAllowed: Number(prevQuota.expertAllowed || 0),
            };

            let targetTier = chartData.duong_so_data?.tier || chartData.laso_data?.tier || 'free';
            let needsReadingUpgrade = Boolean(chartData.laso_data?.needsReadingUpgrade);

            if (order.paymentType === 'reading_expert' || order.paymentType === 'upgrade_expert') {
              if (targetTier !== 'expert') {
                needsReadingUpgrade = true;
              }
              targetTier = 'expert';
              nextQuota.expertAllowed += 2;
            } else if (order.paymentType === 'reading_vip') {
              if (targetTier === 'free') {
                targetTier = 'pro';
                needsReadingUpgrade = true;
              }
              nextQuota.proAllowed += 2;
            } else if (order.paymentType === 'chat_expert') {
              nextQuota.expertAllowed += 2;
            } else if (order.paymentType === 'chat_vip') {
              nextQuota.proAllowed += 2;
            } else if (order.paymentType === 'chat_free') {
              nextQuota.basicAllowed += 2;
            }

            const updatedDuongSo = { ...chartData.duong_so_data, tier: targetTier };
            const updatedLaSo = {
              ...chartData.laso_data,
              tier: targetTier,
              quota: nextQuota,
              needsReadingUpgrade,
            };
            await supabase
              .from('tuvi_charts')
              .update({ duong_so_data: updatedDuongSo, laso_data: updatedLaSo })
              .eq('id', targetChartId);
            console.log(`[PAYMENT WEBHOOK] Đã cập nhật chart ${targetChartId}: tier=${targetTier}, quota=`, nextQuota);
          }
        }
      } catch (e) {
        console.warn('[PAYMENT WEBHOOK] Không thể cập nhật chart:', e);
      }

      // Gửi email thông báo cho khách hàng nếu có email
      let emailResult = null;
      if (order.email) {
        emailResult = await sendPaymentSuccessEmail({
          customerName: order.hoTen,
          customerEmail: order.email,
          orderCode: order.orderCode,
          amount: order.amount,
          paymentType: order.paymentType,
          paidAt: new Date().toISOString(),
        });
      }

      results.push({
        code: order.orderCode,
        status: 'PAID',
        emailSent: emailResult?.success ?? false,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Xử lý webhook thành công',
      results,
    });
  } catch (err: any) {
    console.error('[PAYMENT WEBHOOK] Lỗi xử lý webhook:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Lỗi xử lý webhook' },
      { status: 500 }
    );
  }
}
