import { NextResponse } from 'next/server';
import { createOrder, updateOrderEmail } from '@/lib/orderStore';
import { generateVietQrDataUrl } from '@/lib/vietqr';
import {
  activateAndValidateVoucher,
  getDiscountedReadingPrice,
} from '@/lib/voucherStore';

const BANK_CODE = 'VPB';
const STK = 'AGBSPVUONG2026';
const CHU_TK = 'TRAN THI DIEP';
const BANK_NAME = 'VPBank (Ngân hàng Việt Nam Thịnh Vượng)';

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
    let effectiveUserId: string | undefined = userId || undefined;
    let effectiveEmail: string | undefined = email || undefined;

    // Xác thực mã giảm giá (Chỉ áp dụng cho 2 gói mở khóa Luận Giải: reading_vip 119k & reading_expert 269k)
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
      }
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

    const order = await createOrder({
      paymentType,
      amount: finalAmount,
      hoTen,
      email: effectiveEmail,
      chartId,
      userId: effectiveUserId,
      affiliateCode: cleanAffCode,
      commissionAmount: expectedCommission,
      voucherCode: appliedVoucherCode,
      discountAmount,
    });

    // 1. Tạo Data URL tức thì (0ms, không phụ thuộc vào máy chủ ngoài img.vietqr.io)
    let qrDataUrl = '';
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
