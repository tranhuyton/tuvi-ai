import { NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { adminSupabase as supabase } from '@/lib/supabaseAdmin';
import { createOrder, getOrderByCode, markOrderPaidAtomic } from '@/lib/orderStore';
import { decodeOrderCapiMeta, sendMetaCapiEvent, type OrderCapiMeta } from '@/lib/metaCapi';
import { sendGa4ServerPurchase } from '@/lib/ga4Mp';
import { sendPaymentSuccessEmail } from '@/lib/email';

/**
 * API dành riêng cho Admin: Ghi nhận đơn Xem Trực Tiếp 1-1 chốt qua Zalo / chuyển khoản tay
 * (`upgrade_offline_1on1` 1.730.000đ cho khách đã mua Expert 269k, hoặc `offline_1on1` 2.000.000đ)
 * đồng thời kế thừa `fbp`/`fbc`/`email`/`phone` từ đơn cũ để bắn Offline Purchase lên Meta CAPI & GA4 MP!
 */
export async function POST(req: Request) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: 'Chỉ quản trị viên mới được ghi nhận đơn Offline 1-1' },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const sourceOrderCode =
      typeof body.sourceOrderCode === 'string' ? body.sourceOrderCode.trim().toUpperCase() : '';
    const paymentType: 'upgrade_offline_1on1' | 'offline_1on1' =
      body.paymentType === 'offline_1on1' ? 'offline_1on1' : 'upgrade_offline_1on1';
    const rawAmount = Number(body.amount);
    const amount =
      Number.isFinite(rawAmount) && rawAmount > 0
        ? Math.round(rawAmount)
        : paymentType === 'offline_1on1'
        ? 2000000
        : 1730000;
    const sendCustomerEmail = body.sendCustomerEmail !== false;
    const forceDuplicate = body.force === true;

    let hoTen = typeof body.hoTen === 'string' && body.hoTen.trim() ? body.hoTen.trim() : '';
    let email =
      typeof body.email === 'string' && body.email.trim()
        ? body.email.trim().toLowerCase()
        : undefined;
    let phone = typeof body.phone === 'string' && body.phone.trim() ? body.phone.trim() : undefined;
    let userId = typeof body.userId === 'string' && body.userId.trim() ? body.userId.trim() : undefined;
    let chartId =
      typeof body.chartId === 'string' && body.chartId.trim() ? body.chartId.trim() : undefined;
    let inheritedCapiMeta: OrderCapiMeta | null = null;

    if (sourceOrderCode) {
      const sourceOrder = await getOrderByCode(sourceOrderCode);
      if (!sourceOrder) {
        return NextResponse.json(
          { success: false, error: `Không tìm thấy đơn gốc ${sourceOrderCode}` },
          { status: 404 }
        );
      }

      if (!hoTen) hoTen = sourceOrder.hoTen;
      if (!email) email = sourceOrder.email;
      if (!userId) userId = sourceOrder.userId;
      if (!chartId) chartId = sourceOrder.chartId;
      inheritedCapiMeta = sourceOrder.capiMeta || decodeOrderCapiMeta(sourceOrder.transactionId);

      // Chống bấm nhầm ghi nhận trùng 2 lần cho cùng 1 đơn Expert gốc
      if (!forceDuplicate) {
        const { data: existingDup } = await supabase
          .from('tuvi_orders')
          .select('order_code, amount, paid_at')
          .eq('payment_type', paymentType)
          .eq('status', 'PAID')
          .ilike('transaction_id', `%from_${sourceOrderCode}%`)
          .limit(1);

        if (existingDup && existingDup.length > 0) {
          return NextResponse.json(
            {
              success: false,
              alreadyRecorded: true,
              existingOrderCode: existingDup[0].order_code,
              error: `Đơn gốc ${sourceOrderCode} đã từng được ghi nhận chốt 1-1 trước đó (mã ${existingDup[0].order_code}).`,
            },
            { status: 409 }
          );
        }
      }
    }

    if (!hoTen) {
      hoTen = email ? email.split('@')[0] : 'Khách Xem 1-1';
    }

    // Lấy bổ sung email / phone từ tuvi_profiles & auth.users (tuyệt đối không đọc bảng public.profiles của TonyEnglish)
    if (userId && (!phone || !email)) {
      const [userRes, profRes] = await Promise.all([
        supabase.auth.admin.getUserById(userId).catch(() => ({ data: { user: null } })),
        supabase.from('tuvi_profiles').select('phone, email, full_name').eq('id', userId).maybeSingle(),
      ]);
      const authUser = userRes?.data?.user;
      if (!email && authUser?.email) email = authUser.email.trim().toLowerCase();
      if (!email && profRes?.data?.email) email = String(profRes.data.email).trim().toLowerCase();
      if (!phone && profRes?.data?.phone) phone = String(profRes.data.phone).trim();
      if (!phone && authUser) {
        const metaPhone =
          authUser.phone ||
          authUser.user_metadata?.phone ||
          authUser.user_metadata?.so_dien_thoai ||
          authUser.user_metadata?.phoneNumber;
        if (metaPhone && typeof metaPhone === 'string') phone = metaPhone.trim();
      }
      if (hoTen === 'Khách Xem 1-1' && profRes?.data?.full_name) {
        hoTen = String(profRes.data.full_name).trim();
      }
    }

    // Nếu chưa có capiMeta từ sourceOrderCode, thử tìm capiMeta gần nhất của user này để giữ mạch fbp/fbc
    if (!inheritedCapiMeta && (userId || email)) {
      let metaQuery = supabase
        .from('tuvi_orders')
        .select('capi_meta, transaction_id')
        .order('created_at', { ascending: false })
        .limit(5);
      if (userId) metaQuery = metaQuery.eq('user_id', userId);
      else if (email) metaQuery = metaQuery.eq('email', email);
      const { data: recentOrders } = await metaQuery;
      for (const row of recentOrders || []) {
        const found =
          (row.capi_meta as OrderCapiMeta | null) || decodeOrderCapiMeta(row.transaction_id);
        if (found && (found.fbc || found.fbp || found.gaCid)) {
          inheritedCapiMeta = found;
          break;
        }
      }
    }

    const created = await createOrder({
      paymentType,
      amount,
      hoTen,
      email,
      chartId,
      userId,
      capiMeta: inheritedCapiMeta || undefined,
    });

    const txRef = sourceOrderCode
      ? `offline_1on1_from_${sourceOrderCode}_${Date.now()}`
      : `offline_1on1_admin_${Date.now()}`;
    const { order: paidOrder } = await markOrderPaidAtomic(created.orderCode, txRef);
    const finalOrder = paidOrder || created;

    const [capiSent, ga4Sent] = await Promise.all([
      sendMetaCapiEvent({
        eventName: 'Purchase',
        eventId: finalOrder.orderCode,
        value: amount,
        currency: 'VND',
        paymentType,
        orderCode: finalOrder.orderCode,
        email: email || null,
        phone: phone || null,
        fullName: hoTen,
        userId: userId || null,
        meta: inheritedCapiMeta,
        actionSource: inheritedCapiMeta?.fbc || inheritedCapiMeta?.fbp ? 'website' : 'other',
      }),
      sendGa4ServerPurchase({
        orderCode: finalOrder.orderCode,
        paymentType,
        amount,
        gaClientId: inheritedCapiMeta?.gaCid,
        gaSessionId: inheritedCapiMeta?.gaSessionId,
        userId: userId || null,
      }),
    ]);

    let emailSent = false;
    if (sendCustomerEmail && email) {
      const emailRes = await sendPaymentSuccessEmail({
        customerName: hoTen,
        customerEmail: email,
        orderCode: finalOrder.orderCode,
        amount,
        paymentType,
        paidAt: new Date().toISOString(),
      });
      emailSent = Boolean(emailRes?.success);
    }

    return NextResponse.json({
      success: true,
      order: finalOrder,
      capiSent,
      ga4Sent,
      emailSent,
      matchedAttribution: {
        hasFbc: Boolean(inheritedCapiMeta?.fbc),
        hasFbp: Boolean(inheritedCapiMeta?.fbp),
        hasEmail: Boolean(email),
        hasPhone: Boolean(phone),
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi ghi nhận đơn Offline 1-1';
    console.error('[ADMIN RECORD OFFLINE 1-1] Lỗi:', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
