import { NextResponse } from 'next/server';
import { createOrder, updateOrderEmail } from '@/lib/orderStore';

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

    const { paymentType = 'reading_vip', price, hoTen = 'Đương số', email, chartId, userId } = body;

    let finalAmount = Number(price);
    if (!finalAmount || isNaN(finalAmount)) {
      if (paymentType === 'reading_vip') finalAmount = 119000;
      else if (paymentType === 'chat_vip') finalAmount = 99000;
      else finalAmount = 49000;
    }

    const order = await createOrder({
      paymentType,
      amount: finalAmount,
      hoTen,
      email,
      chartId,
      userId,
    });

    // Tạo URL VietQR với mã đơn hàng TVxxxxx
    const qrUrl = `https://img.vietqr.io/image/${BANK_CODE}-${STK}-compact2.png?amount=${order.amount}&addInfo=${encodeURIComponent(
      order.orderCode
    )}&accountName=${encodeURIComponent(CHU_TK)}`;

    return NextResponse.json({
      success: true,
      order,
      qrUrl,
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
