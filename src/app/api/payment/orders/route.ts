import { NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/orderStore';

export async function GET() {
  try {
    const orders = await getAllOrders(100);
    return NextResponse.json({ success: true, orders });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { orderCode, status } = await req.json();
    if (!orderCode || !status) {
      return NextResponse.json({ success: false, error: 'Thiếu mã đơn hoặc trạng thái' }, { status: 400 });
    }
    const { updateOrderStatus } = await import('@/lib/orderStore');
    const updated = await updateOrderStatus(orderCode, status);
    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message }, { status: 500 });
  }
}
