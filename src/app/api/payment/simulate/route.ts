import { NextResponse } from 'next/server';
import { getOrderByCode, markOrderPaidAtomic } from '@/lib/orderStore';
import { sendPaymentSuccessEmail } from '@/lib/email';
import { adminSupabase as supabase } from '@/lib/supabaseAdmin';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { markVoucherUsedAndCancelAllForUser } from '@/lib/voucherStore';
import { decodeOrderCapiMeta, sendMetaCapiEvent } from '@/lib/metaCapi';
import { sendGa4ServerPurchase } from '@/lib/ga4Mp';

/**
 * API duyệt thanh toán thủ công / Duyệt Tặng (0đ) — CHỈ DÀNH CHO ADMIN ĐÃ XÁC THỰC
 */
export async function POST(req: Request) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: 'Chỉ quản trị viên đã xác thực mới được duyệt thanh toán thủ công' },
      { status: 401 }
    );
  }

  try {
    const { orderCode, isGift } = await req.json();

    if (!orderCode) {
      return NextResponse.json({ success: false, error: 'Thiếu mã đơn hàng' }, { status: 400 });
    }

    let order = await getOrderByCode(orderCode);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Không tìm thấy đơn hàng ${orderCode}` },
        { status: 404 }
      );
    }

    if (order.status === 'CANCELLED') {
      return NextResponse.json(
        { success: false, error: 'Không thể duyệt đơn hàng đã hủy (CANCELLED).' },
        { status: 400 }
      );
    }

    const savedCapiMeta = order.capiMeta || decodeOrderCapiMeta(order.transactionId);
    const txPrefix = isGift ? 'gift' : 'admin';
    const { order: paidOrder, transitioned } = await markOrderPaidAtomic(
      order.orderCode,
      `${txPrefix}_${Date.now()}`
    );

    if (!paidOrder) {
      return NextResponse.json(
        { success: false, error: 'Không thể cập nhật trạng thái đơn hàng' },
        { status: 500 }
      );
    }

    if (!transitioned) {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        message: 'Đơn hàng này đã được thanh toán trước đó',
        order: paidOrder,
      });
    }

    order = paidOrder;

    // Tiêu thụ & hủy các voucher còn lại của khách hàng (Stop-on-Purchase)
    await markVoucherUsedAndCancelAllForUser({
      voucherCode: order.voucherCode,
      orderCode: order.orderCode,
      userId: order.userId,
      email: order.email,
    });

    const isDiscountedOrder = Boolean(order.voucherCode) || Number(order.discountAmount || 0) > 0;

    if (isGift) {
      // Đơn Duyệt Tặng (0đ): đặt amount = 0, xóa hoa hồng & affiliate
      order.amount = 0;
      order.affiliateCode = undefined;
      order.commissionAmount = 0;
      try {
        await supabase
          .from('tuvi_orders')
          .update({ amount: 0, commission_amount: 0, affiliate_code: null })
          .eq('order_code', order.orderCode);
      } catch (e) {
        console.warn('[SIMULATE GIFT] Lỗi cập nhật amount=0:', e);
      }
    } else if (order.affiliateCode && !isDiscountedOrder && !order.commissionRecordedAt) {
      // Ghi nhận hoa hồng CTV chỉ khi đơn thu tiền thật VÀ không áp mã giảm giá
      try {
        const { recordAffiliateCommission } = await import('@/lib/affiliateStore');
        const comm = await recordAffiliateCommission(
          order.affiliateCode,
          order.amount,
          order.orderCode,
          order.paymentType,
          order.email
        );
        if (comm > 0) {
          await supabase
            .from('tuvi_orders')
            .update({
              commission_amount: comm,
              commission_recorded_at: new Date().toISOString(),
            })
            .eq('order_code', order.orderCode);
        }
      } catch (affErr) {
        console.warn('[SIMULATE] Lỗi ghi nhận hoa hồng CTV:', affErr);
      }
    }

    // Nâng cấp chart & cập nhật quota câu hỏi
    try {
      let targetChartId = order.chartId;

      if (!targetChartId && order.userId && order.hoTen) {
        const { data: userCharts } = await supabase
          .from('tuvi_charts')
          .select('id, duong_so_data, laso_data')
          .eq('user_id', order.userId);
        const matched = (userCharts || []).find(
          (c) =>
            String(c.duong_so_data?.hoTen || '').trim().toLowerCase() ===
            order.hoTen.trim().toLowerCase()
        );
        if (matched) {
          targetChartId = matched.id;
          order.chartId = matched.id;
          await supabase
            .from('tuvi_orders')
            .update({ chart_id: matched.id })
            .eq('order_code', order.orderCode);
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
            if (targetTier !== 'expert') needsReadingUpgrade = true;
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

          await supabase
            .from('tuvi_charts')
            .update({
              duong_so_data: { ...chartData.duong_so_data, tier: targetTier },
              laso_data: {
                ...chartData.laso_data,
                tier: targetTier,
                quota: nextQuota,
                needsReadingUpgrade,
              },
            })
            .eq('id', targetChartId);
        }
      }
    } catch (e) {
      console.warn('[SIMULATE] Không thể cập nhật chart:', e);
    }

    // Khi Admin duyệt tay chuyển khoản thật (!isGift && amount > 0) -> đồng bộ bắn Meta CAPI & GA4 MP Purchase
    let capiSent = false;
    let ga4Sent = false;
    if (!isGift && order.amount > 0) {
      try {
        let resolvedPhone: string | null = null;
        if (order.userId) {
          const { data: prof } = await supabase
            .from('tuvi_profiles')
            .select('phone')
            .eq('id', order.userId)
            .maybeSingle();
          if (prof?.phone) resolvedPhone = String(prof.phone);
        }
        const [capiOk, ga4Ok] = await Promise.all([
          sendMetaCapiEvent({
            eventName: 'Purchase',
            eventId: order.orderCode,
            value: order.amount,
            currency: 'VND',
            paymentType: order.paymentType,
            orderCode: order.orderCode,
            email: order.email || null,
            phone: resolvedPhone,
            fullName: order.hoTen,
            userId: order.userId,
            meta: savedCapiMeta,
          }),
          sendGa4ServerPurchase({
            orderCode: order.orderCode,
            paymentType: order.paymentType,
            amount: order.amount,
            gaClientId: savedCapiMeta?.gaCid,
            gaSessionId: savedCapiMeta?.gaSessionId,
            userId: order.userId,
          }),
        ]);
        capiSent = capiOk;
        ga4Sent = ga4Ok;
      } catch (capiErr) {
        console.warn('[SIMULATE] Lỗi gửi Server-Side Purchase:', capiErr);
      }
    }

    // Gửi email xác nhận cho khách nếu có (kèm đề xuất nâng cấp phù hợp theo lịch sử mua)
    let emailResult = null;
    if (order.email) {
      let hasExpertReading = false;
      if (order.paymentType === 'course_tuvi') {
        const { checkUserHasExpertReading } = await import('@/lib/courseAccessServer');
        hasExpertReading = await checkUserHasExpertReading({
          userId: order.userId,
          email: order.email,
        });
      }
      emailResult = await sendPaymentSuccessEmail({
        customerName: order.hoTen,
        customerEmail: order.email,
        orderCode: order.orderCode,
        amount: order.amount,
        paymentType: order.paymentType,
        paidAt: new Date().toISOString(),
        hasExpertReading,
      });
    }

    return NextResponse.json({
      success: true,
      message: isGift ? 'Đã duyệt tặng 0đ thành công' : 'Đã duyệt thanh toán thành công',
      order,
      capiSent,
      ga4Sent,
      emailResult,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi server';
    console.error('[SIMULATE PAYMENT] Lỗi:', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
