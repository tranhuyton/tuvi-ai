import { NextResponse } from 'next/server';
import { getOrderByCode, markOrderPaid } from '@/lib/orderStore';
import { sendPaymentSuccessEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';

/**
 * API mô phỏng / duyệt thanh toán thủ công từ Admin hoặc Test Button
 */
export async function POST(req: Request) {
  try {
    const { orderCode } = await req.json();

    if (!orderCode) {
      return NextResponse.json(
        { success: false, error: 'Thiếu mã đơn hàng' },
        { status: 400 }
      );
    }

    let order = await getOrderByCode(orderCode);
    if (!order) {
      const { createOrder } = await import('@/lib/orderStore');
      order = await createOrder({
        customCode: orderCode,
        paymentType: 'chat_free',
        amount: 49000,
        hoTen: 'Đương số',
      });
    }

    const paidOrder = await markOrderPaid(order.orderCode, `sim_${Date.now()}`);

    // Ghi nhận hoa hồng cho CTV nếu đơn hàng có mã Affiliate
    if (order.affiliateCode) {
      try {
        const { recordAffiliateCommission } = await import('@/lib/affiliateStore');
        await recordAffiliateCommission(order.affiliateCode, order.amount, order.orderCode);
      } catch (affErr) {
        console.warn('[SIMULATE] Lỗi ghi nhận hoa hồng CTV:', affErr);
      }
    }

    // Nâng cấp chart nếu có
    if (order.chartId && order.paymentType === 'reading_vip') {
      try {
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
        }
      } catch (e) {
        console.warn('[SIMULATE] Không thể cập nhật chart:', e);
      }
    }

    // Gửi email nếu có
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

    return NextResponse.json({
      success: true,
      message: 'Mô phỏng thanh toán thành công',
      order: paidOrder,
      emailResult,
    });
  } catch (err: any) {
    console.error('[SIMULATE PAYMENT] Lỗi:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Lỗi server' },
      { status: 500 }
    );
  }
}
