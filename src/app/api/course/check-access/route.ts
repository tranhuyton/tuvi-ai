import { NextResponse } from 'next/server';
import { getOrderByCode, getAllOrders } from '@/lib/orderStore';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS = ['tranhuyton@gmail.com', 'diep.anh.12135@gmail.com'];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderCode = body.orderCode ? String(body.orderCode).trim().toUpperCase() : '';
    const email = body.email ? String(body.email).trim().toLowerCase() : '';
    const userId = body.userId ? String(body.userId).trim() : '';

    // 1. Admin luôn có toàn quyền truy cập khóa học
    if (email && ADMIN_EMAILS.includes(email)) {
      return NextResponse.json({
        success: true,
        unlocked: true,
        orderCode: 'VIP-ADMIN',
        email,
        hoTen: 'Thầy Tôn (Quản trị viên)',
      });
    }

    // 2. Kiểm tra trực tiếp bằng Mã đơn hàng (TVxxxxx)
    if (orderCode) {
      const cleanCode = orderCode.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      const order = await getOrderByCode(cleanCode);
      if (
        order &&
        order.status === 'PAID' &&
        (order.paymentType === 'course_tuvi' || order.amount >= 600000)
      ) {
        return NextResponse.json({
          success: true,
          unlocked: true,
          orderCode: order.orderCode,
          email: order.email || email,
          hoTen: order.hoTen,
          paidAt: order.paidAt,
        });
      }
    }

    // 3. Kiểm tra theo userId hoặc Email trong danh sách đơn hàng đã thanh toán
    if (userId || email) {
      const allOrders = await getAllOrders(2000);
      const matchedOrder = allOrders.find(
        (o) =>
          o.status === 'PAID' &&
          (o.paymentType === 'course_tuvi' || o.amount >= 600000) &&
          ((userId && o.userId === userId) ||
            (email && o.email && o.email.trim().toLowerCase() === email))
      );

      if (matchedOrder) {
        return NextResponse.json({
          success: true,
          unlocked: true,
          orderCode: matchedOrder.orderCode,
          email: matchedOrder.email || email,
          hoTen: matchedOrder.hoTen,
          paidAt: matchedOrder.paidAt,
        });
      }
    }

    return NextResponse.json({
      success: true,
      unlocked: false,
      message: orderCode
        ? 'Mã giao dịch chưa thanh toán hoặc không phải đơn Khóa học Tử Vi (699.000đ).'
        : 'Tài khoản chưa kích hoạt khóa học.',
    });
  } catch (err: any) {
    console.error('[COURSE CHECK-ACCESS] Lỗi:', err);
    return NextResponse.json(
      { success: false, unlocked: false, error: err?.message || 'Lỗi kiểm tra quyền truy cập' },
      { status: 500 }
    );
  }
}
