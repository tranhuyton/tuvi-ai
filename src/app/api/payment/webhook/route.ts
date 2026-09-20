import { NextResponse } from 'next/server';
import { getOrderByCode, markOrderPaid } from '@/lib/orderStore';
import { sendPaymentSuccessEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';

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
    // 2. Trường hợp SePay: { content, transferAmount, id, ... }
    else if (payload.content || payload.transferAmount) {
      txList.push({
        codeCandidate: payload.content || '',
        amount: Number(payload.transferAmount || 0),
        txId: String(payload.id || payload.referenceCode || ''),
        rawContent: payload.content || '',
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
      // Tìm mã đơn TVxxxxx trong chuỗi nội dung (Ví dụ: "MBVCB.123... TV83921 TRAN THI DIEP")
      const match = tx.codeCandidate.match(/TV\d{4,8}/i);
      const matchedCode = match ? match[0].toUpperCase() : tx.codeCandidate.trim().toUpperCase();

      let order = await getOrderByCode(matchedCode);

      if (!order) {
        console.warn(`[PAYMENT WEBHOOK] Đơn ${matchedCode} chưa có trong bộ nhớ, tự động khởi tạo để duyệt`);
        const { createOrder } = await import('@/lib/orderStore');
        const pType = tx.amount >= 119000 ? 'reading_vip' : (tx.amount >= 99000 ? 'chat_vip' : 'chat_free');
        order = await createOrder({
          customCode: matchedCode,
          paymentType: pType,
          amount: tx.amount || 49000,
          hoTen: 'Đương số',
        });
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
