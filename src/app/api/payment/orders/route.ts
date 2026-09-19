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
