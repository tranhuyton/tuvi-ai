import { NextResponse } from 'next/server';
import { createOrder, updateOrderEmail } from '@/lib/orderStore';
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
import { adminSupabase } from '@/lib/supabaseAdmin';

const BANK_CODE = 'VPB';
const STK = 'AGBSPVUONG2026';
const CHU_TK = 'TRAN THI DIEP';
const BANK_NAME = 'VPBank (Ngân hàng Việt Nam Thịnh Vượng)';

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

function getStandardPrice(paymentType: string, customFallback?: number): number {
  if (paymentType === 'course_tuvi') return 699000;
  if (paymentType === 'reading_expert') return 269000;
  if (paymentType === 'upgrade_expert') return 150000;
  if (paymentType === 'chat_expert') return 129000;
  if (paymentType === 'reading_vip') return 119000;
  if (paymentType === 'chat_vip') return 99000;
  if (paymentType === 'chat_free') return 49000;
  return customFallback && !isNaN(customFallback) && customFallback > 0
    ? customFallback
    : 49000;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Nếu là yêu cầu cập nhật email của đơn hàng đã tạo
    if (body.action === 'update_email' && body.orderCode && body.email) {
      const updated = await updateOrderEmail(body.orderCode, body.email);
      return NextResponse.json({ success: true, order: updated });
    }

    const {
      paymentType = 'reading_vip',
      price,
      hoTen = 'Đương số',
      email,
      chartId,
      userId,
      affiliateCode,
      voucherCode,
    } = body;

    let finalAmount = getStandardPrice(paymentType, Number(price));
    const originalAmount = finalAmount;
    let appliedVoucherCode: string | undefined;
    let discountAmount = 0;
    let effectiveUserId: string | undefined =
      typeof userId === 'string' && userId.trim() ? userId.trim() : undefined;
    let effectiveEmail: string | undefined =
      typeof email === 'string' && email.trim() ? email.trim() : undefined;
    let effectiveChartId: string | undefined =
      typeof chartId === 'string' && chartId.trim() ? chartId.trim() : undefined;
    let effectiveHoTen: string =
      typeof hoTen === 'string' && hoTen.trim() ? hoTen.trim() : 'Đương số';

    // 1. Ưu tiên xác thực Bearer Access Token từ phiên đăng nhập trực tiếp (nếu có)
    let verifiedAuthUser: {
      id: string;
      email?: string;
      user_metadata?: Record<string, any>;
    } | null = null;

    const authHeader = req.headers.get('authorization') || '';
    if (authHeader.toLowerCase().startsWith('bearer ')) {
      const token = authHeader.slice(7).trim();
      if (token) {
        try {
          const { data: tokenData } = await adminSupabase.auth.getUser(token);
          if (tokenData?.user) {
            verifiedAuthUser = tokenData.user;
            effectiveUserId = tokenData.user.id;
          }
        } catch {
          // fallback sang xác thực userId bên dưới
        }
      }
    }

    // 2. Xác thực mã giảm giá (Chỉ áp dụng cho 2 gói mở khóa Luận Giải: reading_vip 119k & reading_expert 269k)
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

      const discounted = getDiscountedReadingPrice(
        paymentType,
        check.voucher.discountPercent
      );
      if (discounted) {
        finalAmount = discounted.finalPrice;
        discountAmount = discounted.discountAmount;
        appliedVoucherCode = check.voucher.code;
        if (!effectiveUserId && check.voucher.userId) {
          effectiveUserId = check.voucher.userId;
        }
        if (!effectiveEmail && check.voucher.email) {
          effectiveEmail = check.voucher.email;
        }
        if (!effectiveChartId && check.voucher.chartId) {
          effectiveChartId = check.voucher.chartId;
        }
      }
    }

    // 3. CHỐT CHẶN BẮT BUỘC SERVER-SIDE: Không cho phép tạo mã thanh toán nếu chưa có tài khoản hợp lệ trong auth.users
    if (!verifiedAuthUser && effectiveUserId) {
      try {
        const { data: adminUserData } = await adminSupabase.auth.admin.getUserById(
          effectiveUserId
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
    effectiveEmail = verifiedAuthUser.email.trim();

    // 4. Tự động đồng bộ chartId & họ tên thật từ hồ sơ / lá số của tài khoản để không bao giờ bị "Đương số / Chưa nhập email"
    if (effectiveChartId) {
      try {
        const { data: chartRow } = await adminSupabase
          .from('tuvi_charts')
          .select('id, user_id, duong_so_data')
          .eq('id', effectiveChartId)
          .maybeSingle();

        if (chartRow) {
          if (isGenericCustomerName(effectiveHoTen) && chartRow.duong_so_data?.hoTen) {
            effectiveHoTen = String(chartRow.duong_so_data.hoTen).trim();
          }
        }
      } catch {
        // ignore
      }
    } else if (paymentType !== 'course_tuvi') {
      // Nếu là gói gắn với lá số (reading / chat) nhưng client chưa kịp gửi chartId, tự gắn lá số mới nhất của tài khoản
      try {
        const { data: latestCharts } = await adminSupabase
          .from('tuvi_charts')
          .select('id, duong_so_data')
          .eq('user_id', effectiveUserId)
          .order('created_at', { ascending: false })
          .limit(1);

        if (latestCharts && latestCharts.length > 0) {
          effectiveChartId = latestCharts[0].id;
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

    if (isGenericCustomerName(effectiveHoTen)) {
      let profileName = String(verifiedAuthUser.user_metadata?.full_name || '').trim();
      if (!profileName) {
        try {
          const { data: prof } = await adminSupabase
            .from('tuvi_profiles')
            .select('full_name')
            .eq('id', effectiveUserId)
            .maybeSingle();
          if (prof?.full_name) {
            profileName = String(prof.full_name).trim();
          }
        } catch {
          // ignore
        }
      }
      effectiveHoTen =
        profileName || effectiveEmail.split('@')[0] || 'Khách thành viên';
    }

    const cleanAffCode = affiliateCode ? String(affiliateCode).trim().toLowerCase() : undefined;
    let expectedCommission = 0;
    if (cleanAffCode) {
      try {
        const { getAffiliateByCode, calculateAffiliateCommission } = await import('@/lib/affiliateStore');
        const aff = await getAffiliateByCode(cleanAffCode);
        if (aff && aff.status === 'ACTIVE') {
          expectedCommission = calculateAffiliateCommission(aff, finalAmount, paymentType);
        }
      } catch {
        // ignore
      }
    }

    const capiMeta = extractRequestCapiMeta(req, {
      fbp: typeof body.fbp === 'string' ? body.fbp : undefined,
      fbc: typeof body.fbc === 'string' ? body.fbc : undefined,
      fbclid: typeof body.fbclid === 'string' ? body.fbclid : undefined,
      sourceUrl: typeof body.sourceUrl === 'string' ? body.sourceUrl : undefined,
    });

    const order = await createOrder({
      paymentType,
      amount: finalAmount,
      hoTen: effectiveHoTen,
      email: effectiveEmail,
      chartId: effectiveChartId,
      userId: effectiveUserId,
      affiliateCode: cleanAffCode,
      commissionAmount: expectedCommission,
      voucherCode: appliedVoucherCode,
      discountAmount,
      initialTransactionMeta: encodeOrderCapiMeta(capiMeta),
    });

    // 1. Tạo Data URL tức thì song song với bắn Server-Side CAPI InitiateCheckout
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
        fullName: order.hoTen,
        userId: order.userId,
        meta: capiMeta,
        timeoutMs: 1800,
      }),
    ]);

    // 2. URL VietQR fallback truyền thống
    const qrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${STK}-compact2.png?amount=${order.amount}&addInfo=${encodeURIComponent(
      order.orderCode
    )}&accountName=${encodeURIComponent(CHU_TK)}`;

    // 3. SePay QR CDN fallback tốc độ cao
    const sepayQrUrl = `https://qr.sepay.vn/img?bank=VPBank&acc=${STK}&template=compact&amount=${order.amount}&des=${encodeURIComponent(
      order.orderCode
    )}`;

    return NextResponse.json({
      success: true,
      order,
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
  } catch (err: any) {
    console.error('[API CREATE-ORDER] Lỗi tạo đơn hàng:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Không thể khởi tạo giao dịch' },
      { status: 500 }
    );
  }
}
