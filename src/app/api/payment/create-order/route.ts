import { NextResponse } from 'next/server';
import { createOrder, getOrderByCode, updateOrderEmail } from '@/lib/orderStore';
import { generateVietQrDataUrl } from '@/lib/vietqr';
import {
  activateAndValidateVoucher,
  getDiscountedReadingPrice,
} from '@/lib/voucherStore';
import {
  encodeOrderCapiMeta,
  extractRequestCapiMeta,
  sendMetaCapiEvent,
} from '@/lib/metaCapi';
import { adminSupabase, signExpiringToken } from '@/lib/supabaseAdmin';
import { getAuthenticatedUser, isValidUuid } from '@/lib/adminAuth';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';
import { PAYMENT_BANK_CONFIG } from '@/lib/bankConfig';

const BANK_CODE = PAYMENT_BANK_CONFIG.bankCode;
const STK = PAYMENT_BANK_CONFIG.accountNumber;
const CHU_TK = PAYMENT_BANK_CONFIG.accountName;
const BANK_NAME = PAYMENT_BANK_CONFIG.bankName;

const STANDARD_PRICES: Record<string, number> = {
  course_tuvi: 699000,
  reading_expert: 269000,
  upgrade_expert: 150000,
  chat_expert: 129000,
  reading_vip: 119000,
  chat_vip: 99000,
  chat_free: 49000,
};

const MAX_AFFILIATE_COMMISSION_RATIO = 0.5;

const GENERIC_CUSTOMER_NAMES = new Set([
  '',
  'đương số',
  'duong so',
  'học viên tử vi',
  'hoc vien tu vi',
  'khách hàng',
  'khach hang',
]);

function isGenericCustomerName(name?: string | null): boolean {
  if (!name) return true;
  return GENERIC_CUSTOMER_NAMES.has(name.trim().toLowerCase());
}

function normalizePhoneDigits(phone?: string | null): string {
  return String(phone || '')
    .replace(/\D/g, '')
    .replace(/^84(?=\d{9}$)/, '0');
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `create_order:${ip}`,
      limit: 25,
      windowMs: 60_000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: 'Quá nhiều yêu cầu tạo đơn, vui lòng thử lại sau giây lát.' },
        { status: 429 }
      );
    }

    const body = await req.json();

    // 1. Xác thực Bearer Access Token từ phiên đăng nhập trực tiếp
    const jwtAuthUser = await getAuthenticatedUser(req);
    let verifiedAuthUser: {
      id: string;
      email?: string;
      phone?: string;
      user_metadata?: Record<string, unknown>;
    } | null = jwtAuthUser;

    // Nếu là yêu cầu cập nhật email của đơn hàng PENDING đã tạo (chỉ chủ đơn có JWT hợp lệ mới được sửa!)
    if (body.action === 'update_email' && body.orderCode && body.email) {
      const targetCode = String(body.orderCode).trim().toUpperCase();
      const cleanEmail = String(body.email).trim().toLowerCase();
      if (!cleanEmail.includes('@') || cleanEmail.length > 180) {
        return NextResponse.json({ success: false, error: 'Email không hợp lệ' }, { status: 400 });
      }
      const existingOrder = await getOrderByCode(targetCode);
      if (!existingOrder) {
        return NextResponse.json({ success: false, error: 'Không tìm thấy đơn hàng' }, { status: 404 });
      }
      if (existingOrder.status !== 'PENDING') {
        return NextResponse.json(
          { success: false, error: 'Chỉ được cập nhật email cho đơn hàng đang chờ thanh toán' },
          { status: 403 }
        );
      }
      if (!jwtAuthUser || !existingOrder.userId || existingOrder.userId !== jwtAuthUser.id) {
        return NextResponse.json(
          { success: false, error: 'Không có quyền cập nhật email đơn hàng này' },
          { status: 403 }
        );
      }
      const updated = await updateOrderEmail(targetCode, cleanEmail);
      return NextResponse.json({ success: true, order: updated });
    }

    const {
      paymentType = 'reading_vip',
      hoTen = 'Đương số',
      email,
      chartId,
      affiliateCode,
      voucherCode,
    } = body;

    if (!Object.prototype.hasOwnProperty.call(STANDARD_PRICES, paymentType)) {
      return NextResponse.json(
        { success: false, error: 'Loại gói thanh toán không hợp lệ' },
        { status: 400 }
      );
    }

    let finalAmount = STANDARD_PRICES[paymentType];
    const originalAmount = finalAmount;
    let appliedVoucherCode: string | undefined;
    let discountAmount = 0;
    let orderExpiresAt: string | undefined;
    let effectiveUserId: string | undefined = verifiedAuthUser?.id;
    let effectiveEmail: string | undefined =
      typeof email === 'string' && email.trim() ? email.trim().toLowerCase() : undefined;
    let effectiveChartId: string | undefined =
      typeof chartId === 'string' && isValidUuid(chartId) ? chartId.trim() : undefined;
    let effectiveHoTen: string =
      typeof hoTen === 'string' && hoTen.trim() ? hoTen.trim() : 'Đương số';

    // 2. Xác thực mã giảm giá (Chỉ áp dụng cho 2 gói mở khóa Luận Giải: reading_vip 119k & reading_expert 269k)
    let voucherOwnerUserId: string | undefined;
    if (
      voucherCode &&
      typeof voucherCode === 'string' &&
      voucherCode.trim() &&
      (paymentType === 'reading_vip' || paymentType === 'reading_expert')
    ) {
      const check = await activateAndValidateVoucher(voucherCode, { activateTimer: true });
      if (!check.valid || !check.voucher) {
        return NextResponse.json(
          {
            success: false,
            voucherExpired: true,
            error:
              'Mã ưu đãi này đã hết thời hạn hiệu lực hoặc đã được sử dụng. Hệ thống sẽ cập nhật lại mức phí tiêu chuẩn.',
          },
          { status: 400 }
        );
      }

      // Kiểm tra chủ sở hữu voucher nếu đã đăng nhập
      if (
        jwtAuthUser &&
        check.voucher.userId &&
        check.voucher.userId !== jwtAuthUser.id
      ) {
        return NextResponse.json(
          {
            success: false,
            voucherExpired: true,
            error: 'Mã ưu đãi này thuộc về tài khoản khác.',
          },
          { status: 403 }
        );
      }

      // Nếu voucher được cấp riêng cho 1 lá số cụ thể -> bắt buộc áp đúng lá số đó (chống đem áp cho lá số người khác)
      if (
        check.voucher.chartId &&
        isValidUuid(check.voucher.chartId) &&
        effectiveChartId &&
        effectiveChartId !== check.voucher.chartId
      ) {
        return NextResponse.json(
          {
            success: false,
            error: 'Mã ưu đãi này chỉ áp dụng cho lá số đã được hệ thống gửi tặng.',
          },
          { status: 403 }
        );
      }

      const discounted = getDiscountedReadingPrice(
        paymentType,
        check.voucher.discountPercent
      );
      if (discounted) {
        finalAmount = discounted.finalPrice;
        discountAmount = discounted.discountAmount;
        appliedVoucherCode = check.voucher.code;
        // Đơn giảm giá có hạn thanh toán = voucher.expiresAt + 15 phút ân hạn chuyển khoản
        const voucherExpMs = new Date(check.voucher.expiresAt).getTime();
        if (Number.isFinite(voucherExpMs)) {
          orderExpiresAt = new Date(voucherExpMs + 15 * 60 * 1000).toISOString();
        }
        if (check.voucher.userId) {
          voucherOwnerUserId = check.voucher.userId;
        }
        if (!effectiveUserId && check.voucher.userId) {
          effectiveUserId = check.voucher.userId;
        }
        if (!effectiveEmail && check.voucher.email) {
          effectiveEmail = check.voucher.email.trim().toLowerCase();
        }
        if (!effectiveChartId && check.voucher.chartId && isValidUuid(check.voucher.chartId)) {
          effectiveChartId = check.voucher.chartId;
        }
      }
    }

    // 3. CHỐT CHẶN BẮT BUỘC SERVER-SIDE:
    // Chỉ chấp nhận user đã xác thực Bearer JWT, HOẶC user đến từ mã Voucher cá nhân hợp lệ (xuyên trình duyệt từ Email Drip).
    if (!verifiedAuthUser && voucherOwnerUserId) {
      try {
        const { data: adminUserData } = await adminSupabase.auth.admin.getUserById(
          voucherOwnerUserId
        );
        if (adminUserData?.user) {
          verifiedAuthUser = adminUserData.user;
        }
      } catch {
        verifiedAuthUser = null;
      }
    }

    if (!verifiedAuthUser || !verifiedAuthUser.id || !verifiedAuthUser.email) {
      return NextResponse.json(
        {
          success: false,
          requireAuth: true,
          error:
            'Quý khách vui lòng đăng ký hoặc đăng nhập tài khoản trước khi mở mã QR thanh toán để hệ thống lưu giữ quyền lợi trọn đời.',
        },
        { status: 401 }
      );
    }

    effectiveUserId = verifiedAuthUser.id;
    effectiveEmail = verifiedAuthUser.email.trim().toLowerCase();
    const isJwtVerifiedCaller = Boolean(jwtAuthUser && jwtAuthUser.id === effectiveUserId);

    // 4. Đồng bộ chartId & xác minh quyền sở hữu lá số (không chấp nhận chart mồ côi user_id IS NULL hoặc của user khác)
    let resolvedChartTier = 'free';
    if (effectiveChartId) {
      try {
        const { data: chartRow } = await adminSupabase
          .from('tuvi_charts')
          .select('id, user_id, duong_so_data, laso_data')
          .eq('id', effectiveChartId)
          .maybeSingle();

        if (chartRow && chartRow.user_id === effectiveUserId) {
          resolvedChartTier = String(
            chartRow.duong_so_data?.tier || chartRow.laso_data?.tier || 'free'
          );
          if (isGenericCustomerName(effectiveHoTen) && chartRow.duong_so_data?.hoTen) {
            effectiveHoTen = String(chartRow.duong_so_data.hoTen).trim();
          }
        } else {
          effectiveChartId = undefined;
        }
      } catch {
        effectiveChartId = undefined;
      }
    } else if (paymentType !== 'course_tuvi') {
      try {
        const { data: latestCharts } = await adminSupabase
          .from('tuvi_charts')
          .select('id, duong_so_data, laso_data')
          .eq('user_id', effectiveUserId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (latestCharts && latestCharts.length > 0) {
          effectiveChartId = latestCharts[0].id;
          resolvedChartTier = String(
            latestCharts[0].duong_so_data?.tier || latestCharts[0].laso_data?.tier || 'free'
          );
          if (
            isGenericCustomerName(effectiveHoTen) &&
            latestCharts[0].duong_so_data?.hoTen
          ) {
            effectiveHoTen = String(latestCharts[0].duong_so_data.hoTen).trim();
          }
        }
      } catch {
        // ignore
      }
    }

    // 5. CHỐT CHẶN GIAN LẬN GIÁ `upgrade_expert` (150k):
    // Bắt buộc lá số đó PHẢI đã có đơn PAID `reading_vip` (119k) hoặc đang ở hạng `pro` (không cho mua thẳng từ Free!)
    if (paymentType === 'upgrade_expert') {
      if (!effectiveChartId) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Gói nâng cấp 150.000đ chỉ áp dụng cho lá số đã mở khóa Bản Chuyên Sâu Pro. Vui lòng chọn Bản Chuyên Gia Expert (269.000đ).',
          },
          { status: 400 }
        );
      }
      const { data: proOrders } = await adminSupabase
        .from('tuvi_orders')
        .select('id')
        .eq('user_id', effectiveUserId)
        .eq('chart_id', effectiveChartId)
        .eq('payment_type', 'reading_vip')
        .eq('status', 'PAID')
        .limit(1);

      const hasPaidProForChart = (proOrders && proOrders.length > 0) || resolvedChartTier === 'pro';
      if (!hasPaidProForChart) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Lá số này chưa sở hữu Bản Chuyên Sâu Pro nên không áp dụng mức nâng cấp 150.000đ. Vui lòng đăng ký gói Chuyên Gia Expert (269.000đ).',
          },
          { status: 403 }
        );
      }
    }

    // Tải thêm thông tin profile (tên & SĐT cho CAPI EMQ + kiểm tra self-referral CTV)
    let profileName = String(verifiedAuthUser.user_metadata?.full_name || '').trim();
    let profilePhone =
      verifiedAuthUser.phone ||
      (typeof verifiedAuthUser.user_metadata?.phone === 'string'
        ? verifiedAuthUser.user_metadata.phone
        : '');

    try {
      const { data: prof } = await adminSupabase
        .from('tuvi_profiles')
        .select('full_name, phone')
        .eq('id', effectiveUserId)
        .maybeSingle();
      if (!profileName && prof?.full_name) profileName = String(prof.full_name).trim();
      if (!profilePhone && prof?.phone) profilePhone = String(prof.phone).trim();
    } catch {
      // ignore
    }

    if (isGenericCustomerName(effectiveHoTen)) {
      effectiveHoTen = profileName || effectiveEmail.split('@')[0] || 'Khách thành viên';
    }

    // 6. CHÍNH SÁCH HOA HỒNG CTV:
    // - Đơn có mã giảm giá (voucher / discountAmount > 0) => KHÔNG TRẢ HOA HỒNG CTV!
    // - Chỉ chấp nhận CTV đang ACTIVE
    // - Chặn tuyệt đối Self-Referral (email hoặc SĐT trùng CTV)
    // - Áp trần hoa hồng tối đa <= 50% số tiền thực thu (chống âm biên lợi nhuận / lỗ hổng fixed > 49k)
    let validAffiliateCode: string | undefined;
    let expectedCommission = 0;

    if (!appliedVoucherCode && discountAmount === 0 && affiliateCode) {
      const candidateAffCode = String(affiliateCode).trim().toLowerCase();
      if (candidateAffCode) {
        try {
          const { getAffiliateByCode, calculateAffiliateCommission } = await import('@/lib/affiliateStore');
          const aff = await getAffiliateByCode(candidateAffCode);
          if (aff && aff.status === 'ACTIVE') {
            const buyerEmailNorm = effectiveEmail.toLowerCase();
            const buyerPhoneNorm = normalizePhoneDigits(profilePhone);
            const affEmailNorm = (aff.email || '').trim().toLowerCase();
            const affPhoneNorm = normalizePhoneDigits(aff.phone);
            const isSelfReferral =
              (affEmailNorm && affEmailNorm === buyerEmailNorm) ||
              (affPhoneNorm && buyerPhoneNorm && affPhoneNorm === buyerPhoneNorm);

            if (!isSelfReferral) {
              const rawComm = calculateAffiliateCommission(aff, finalAmount, paymentType);
              const cappedComm = Math.min(
                rawComm,
                Math.floor(finalAmount * MAX_AFFILIATE_COMMISSION_RATIO)
              );
              if (cappedComm > 0) {
                validAffiliateCode = aff.code;
                expectedCommission = cappedComm;
              }
            }
          }
        } catch {
          // ignore
        }
      }
    }

    const capiMeta = extractRequestCapiMeta(req, {
      fbp: typeof body.fbp === 'string' ? body.fbp : undefined,
      fbc: typeof body.fbc === 'string' ? body.fbc : undefined,
      fbclid: typeof body.fbclid === 'string' ? body.fbclid : undefined,
      gaCid: typeof body.gaCid === 'string' ? body.gaCid : undefined,
      gaSessionId: typeof body.gaSessionId === 'string' ? body.gaSessionId : undefined,
      sourceUrl: typeof body.sourceUrl === 'string' ? body.sourceUrl : undefined,
    });

    // Helper ẩn PII nếu caller không có JWT (luồng voucher xuyên trình duyệt)
    const sanitizeOrderForResponse = <T extends { email?: string; userId?: string }>(ord: T): T =>
      isJwtVerifiedCaller
        ? ord
        : {
            ...ord,
            email: undefined,
            userId: undefined,
          };

    // 7. Chống sinh đúp đơn PENDING & đúp CAPI InitiateCheckout trong 10 phút gần nhất
    if (!body.forceNew && effectiveUserId) {
      try {
        const recentWindowIso = new Date(Date.now() - 10 * 60 * 1000).toISOString();
        let dupQuery = adminSupabase
          .from('tuvi_orders')
          .select('*')
          .eq('user_id', effectiveUserId)
          .eq('payment_type', paymentType)
          .eq('amount', finalAmount)
          .eq('status', 'PENDING')
          .gte('created_at', recentWindowIso)
          .order('created_at', { ascending: false })
          .limit(1);

        if (effectiveChartId) {
          dupQuery = dupQuery.eq('chart_id', effectiveChartId);
        } else {
          dupQuery = dupQuery.is('chart_id', null);
        }
        if (appliedVoucherCode) {
          dupQuery = dupQuery.eq('voucher_code', appliedVoucherCode.toUpperCase());
        } else {
          dupQuery = dupQuery.is('voucher_code', null);
        }

        const { data: existingRows } = await dupQuery;
        if (existingRows && existingRows.length > 0) {
          const row = existingRows[0];
          const reusedOrder = {
            id: row.id,
            orderCode: row.order_code,
            paymentType: row.payment_type,
            amount: Number(row.amount),
            hoTen: row.ho_ten || effectiveHoTen,
            email: row.email || effectiveEmail,
            status: 'PENDING' as const,
            createdAt: row.created_at,
            chartId: row.chart_id || undefined,
            userId: row.user_id || undefined,
            affiliateCode: row.affiliate_code || undefined,
            commissionAmount: Number(row.commission_amount || 0),
            voucherCode: row.voucher_code || undefined,
            discountAmount: Number(row.discount_amount || 0),
          };

          let reusedQrDataUrl = '';
          try {
            reusedQrDataUrl = await generateVietQrDataUrl({
              bankBinOrCode: BANK_CODE,
              accountNumber: STK,
              amount: reusedOrder.amount,
              memo: reusedOrder.orderCode,
              accountName: CHU_TK,
            });
          } catch {
            // ignore
          }

          const reusedQrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${STK}-compact2.png?amount=${reusedOrder.amount}&addInfo=${encodeURIComponent(
            reusedOrder.orderCode
          )}&accountName=${encodeURIComponent(CHU_TK)}`;
          const reusedSepayQrUrl = `https://qr.sepay.vn/img?bank=VPBank&acc=${STK}&template=compact&amount=${reusedOrder.amount}&des=${encodeURIComponent(
            reusedOrder.orderCode
          )}`;

          return NextResponse.json({
            success: true,
            reused: true,
            order: sanitizeOrderForResponse(reusedOrder),
            statusToken: signExpiringToken('order_status', reusedOrder.orderCode, 48 * 3600),
            originalAmount,
            discountAmount,
            appliedVoucherCode: appliedVoucherCode || null,
            qrUrl: reusedQrUrl,
            qrDataUrl: reusedQrDataUrl,
            sepayQrUrl: reusedSepayQrUrl,
            syntax: reusedOrder.orderCode,
            bankInfo: {
              bankName: BANK_NAME,
              stk: STK,
              chuTk: CHU_TK,
            },
          });
        }
      } catch (dupErr) {
        console.warn('[API CREATE-ORDER] Bỏ qua kiểm tra trùng đơn:', dupErr);
      }
    }

    // 8. Chống Multi-Order Replay cho Voucher cá nhân: hủy mọi đơn PENDING cũ đang giữ mã voucher này trước khi tạo đơn mới
    if (appliedVoucherCode) {
      await adminSupabase
        .from('tuvi_orders')
        .update({ status: 'CANCELLED' })
        .eq('voucher_code', appliedVoucherCode.toUpperCase())
        .eq('status', 'PENDING');
    }

    const order = await createOrder({
      paymentType,
      amount: finalAmount,
      hoTen: effectiveHoTen,
      email: effectiveEmail,
      chartId: effectiveChartId,
      userId: effectiveUserId,
      affiliateCode: validAffiliateCode,
      commissionAmount: expectedCommission,
      voucherCode: appliedVoucherCode,
      discountAmount,
      expiresAt: orderExpiresAt,
      initialTransactionMeta: encodeOrderCapiMeta(capiMeta),
      capiMeta,
    });

    const resolvedPhone = profilePhone || null;

    let qrDataUrl = '';
    await Promise.all([
      (async () => {
        try {
          qrDataUrl = await generateVietQrDataUrl({
            bankBinOrCode: BANK_CODE,
            accountNumber: STK,
            amount: order.amount,
            memo: order.orderCode,
            accountName: CHU_TK,
          });
        } catch (qrErr) {
          console.warn('[API CREATE-ORDER] Không thể tạo local QR DataURL:', qrErr);
        }
      })(),
      sendMetaCapiEvent({
        eventName: 'InitiateCheckout',
        eventId: `ic_${order.orderCode}`,
        value: order.amount,
        paymentType: order.paymentType,
        orderCode: order.orderCode,
        email: order.email,
        phone: resolvedPhone,
        fullName: order.hoTen,
        userId: order.userId,
        meta: capiMeta,
        timeoutMs: 1800,
      }),
    ]);

    const qrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${STK}-compact2.png?amount=${order.amount}&addInfo=${encodeURIComponent(
      order.orderCode
    )}&accountName=${encodeURIComponent(CHU_TK)}`;

    const sepayQrUrl = `https://qr.sepay.vn/img?bank=VPBank&acc=${STK}&template=compact&amount=${order.amount}&des=${encodeURIComponent(
      order.orderCode
    )}`;

    return NextResponse.json({
      success: true,
      order: sanitizeOrderForResponse(order),
      statusToken: signExpiringToken('order_status', order.orderCode, 48 * 3600),
      originalAmount,
      discountAmount,
      appliedVoucherCode: appliedVoucherCode || null,
      qrUrl,
      qrDataUrl,
      sepayQrUrl,
      syntax: order.orderCode,
      bankInfo: {
        bankName: BANK_NAME,
        stk: STK,
        chuTk: CHU_TK,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Không thể khởi tạo giao dịch';
    console.error('[API CREATE-ORDER] Lỗi tạo đơn hàng:', err);
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
