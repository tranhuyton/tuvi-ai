import { NextResponse } from 'next/server';
import { getOrderByCode, markOrderPaid } from '@/lib/orderStore';
import { sendPaymentSuccessEmail } from '@/lib/email';
import { supabase } from '@/lib/supabase';

/**
 * API mô phỏng / duyệt thanh toán thủ công từ Admin hoặc Test Button
 */
export async function POST(req: Request) {
  try {
    const { orderCode, isGift } = await req.json();

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
        amount: isGift ? 0 : 49000,
        hoTen: 'Đương số',
      });
    }

    const txPrefix = isGift ? 'gift' : 'sim';
    const paidOrder = await markOrderPaid(order.orderCode, `${txPrefix}_${Date.now()}`);

    if (isGift) {
      // Nếu là đơn Duyệt Tặng (0đ): đặt amount = 0, commission_amount = 0 để không cộng vào doanh thu hay hoa hồng CTV
      order.amount = 0;
      if (paidOrder) {
        paidOrder.amount = 0;
      }
      try {
        await supabase
          .from('tuvi_orders')
          .update({ amount: 0, commission_amount: 0, affiliate_code: null })
          .eq('order_code', order.orderCode);
      } catch (e) {
        console.warn('[SIMULATE GIFT] Lỗi cập nhật amount=0:', e);
      }
    } else if (order.affiliateCode) {
      // Ghi nhận hoa hồng cho CTV chỉ khi đây là đơn thu tiền thật (không phải đơn tặng 0đ)
      try {
        const { recordAffiliateCommission } = await import('@/lib/affiliateStore');
        await recordAffiliateCommission(
          order.affiliateCode,
          order.amount,
          order.orderCode,
          order.paymentType
        );
      } catch (affErr) {
        console.warn('[SIMULATE] Lỗi ghi nhận hoa hồng CTV:', affErr);
      }
    }

    // Nâng cấp chart & cập nhật quota câu hỏi nếu có
    try {
      let targetChartId = order.chartId;

      // Nếu order chưa có chartId, thử tìm lá số trùng tên của user để liên kết tự động
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
        }
      }
    } catch (e) {
      console.warn('[SIMULATE] Không thể cập nhật chart:', e);
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
