import { NextResponse } from 'next/server';
import { createOrder, updateOrderEmail } from '@/lib/orderStore';
import { generateVietQrDataUrl } from '@/lib/vietqr';

const BANK_CODE = 'VPB';
const STK = 'AGBSPVUONG2026';
const CHU_TK = 'TRAN THI DIEP';
const BANK_NAME = 'VPBank (Ngân hàng Việt Nam Thịnh Vượng)';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Nếu là yêu cầu cập nhật email của đơn hàng đã tạo
    if (body.action === 'update_email' && body.orderCode && body.email) {
      const updated = await updateOrderEmail(body.orderCode, body.email);
      return NextResponse.json({ success: true, order: updated });
    }

    const { paymentType = 'reading_vip', price, hoTen = 'Đương số', email, chartId, userId, affiliateCode } = body;

    let finalAmount = Number(price);
    if (!finalAmount || isNaN(finalAmount)) {
      if (paymentType === 'reading_expert') finalAmount = 269000;
      else if (paymentType === 'upgrade_expert') finalAmount = 150000;
      else if (paymentType === 'chat_expert') finalAmount = 129000;
      else if (paymentType === 'reading_vip') finalAmount = 119000;
      else if (paymentType === 'chat_vip') finalAmount = 99000;
      else finalAmount = 49000;
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
      email,
      chartId,
      userId,
      affiliateCode: cleanAffCode,
      commissionAmount: expectedCommission,
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
