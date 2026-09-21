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
    }

    const txList: IncomingTx[] = [];

    // 1. Trường hợp payload trực tiếp từ Casso: { data: [ { description, amount, id, ... } ] }
    if (Array.isArray(payload.data)) {
      for (const item of payload.data) {
        txList.push({
          codeCandidate: item.description || '',
          amount: Number(item.amount || 0),
          txId: String(item.id || item.tid || ''),
          rawContent: item.description || '',
        });
      }
    }
    // 2. Trường hợp SePay: { content, description, transferAmount, code, id, ... }
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
      });
    }
    // 4. Trường hợp payload tùy chỉnh / Manual test: { orderCode, amount, transactionId }
    else if (payload.orderCode) {
      txList.push({
        codeCandidate: String(payload.orderCode),
        amount: Number(payload.amount || 0),
        txId: String(payload.transactionId || `tx_${Date.now()}`),
        rawContent: payload.orderCode,
      });
    }

    if (txList.length === 0) {
      return NextResponse.json({ success: false, message: 'Payload không chứa giao dịch nhận diện được' }, { status: 400 });
    }

    const results = [];

    for (const tx of txList) {
      // Tìm mã đơn TVxxxxx (hỗ trợ có khoảng trắng, gạch nối: TV49354, TV 49354, TV-49354, TV: 49354)
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
        const pType = tx.amount >= 119000 ? 'reading_vip' : (tx.amount >= 99000 ? 'chat_vip' : 'chat_free');
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

      // Nếu đơn hàng có chartId, cập nhật luôn sang tier 'pro' trong Supabase nếu là reading_vip
      if (order.chartId && order.paymentType === 'reading_vip') {
        try {
          // Lấy chart hiện tại
          const { data: chartData } = await supabase
            .from('tuvi_charts')
            .select('duong_so_data, laso_data')
            .eq('id', order.chartId)
            .maybeSingle();

          if (chartData) {
            const updatedDuongSo = { ...chartData.duong_so_data, tier: 'pro' };
            const updatedLaSo = { ...chartData.laso_data, tier: 'pro' };
            await supabase
              .from('tuvi_charts')
              .update({ duong_so_data: updatedDuongSo, laso_data: updatedLaSo })
              .eq('id', order.chartId);
            console.log(`[PAYMENT WEBHOOK] Đã nâng cấp chart ${order.chartId} sang VIP Pro`);
          }
        } catch (e) {
          console.warn('[PAYMENT WEBHOOK] Không thể cập nhật chart:', e);
        }
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
