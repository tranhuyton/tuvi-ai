import { NextResponse } from 'next/server';
import { getOrderByCode } from '@/lib/orderStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { success: false, error: 'Thiếu mã đơn hàng (code)' },
      { status: 400, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
    );
  }

  let order = await getOrderByCode(code);
  if (!order && /^TV\d{4,8}$/i.test(code)) {
    const { createOrder } = await import('@/lib/orderStore');
    order = await createOrder({
      customCode: code,
      paymentType: 'chat_free',
      amount: 49000,
      hoTen: 'Đương số',
    });
  }

  if (!order) {
    return NextResponse.json(
      { success: false, status: 'NOT_FOUND', message: 'Không tìm thấy đơn hàng' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      status: order.status,
      orderCode: order.orderCode,
      amount: order.amount,
      paidAt: order.paidAt,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}
