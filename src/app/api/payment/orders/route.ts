import { NextResponse } from 'next/server';
import { getAllOrders, updateOrderStatusSafe } from '@/lib/orderStore';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { adminSupabase } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi tải đơn hàng';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { orderCode, status } = await req.json();
    if (!orderCode || !['PENDING', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error:
            status === 'PAID'
              ? 'Không chuyển trực tiếp sang PAID qua PATCH. Vui lòng dùng nút Duyệt Đơn để kích hoạt đủ quyền lợi.'
              : 'Thiếu mã đơn hoặc trạng thái không hợp lệ',
        },
        { status: 400 }
      );
    }

    const res = await updateOrderStatusSafe(String(orderCode), status as 'PENDING' | 'CANCELLED');
    if (res.error || !res.order) {
      return NextResponse.json({ success: false, error: res.error || 'Không tìm thấy đơn' }, { status: 400 });
    }

    // Nếu Admin hủy một đơn đã PAID có cộng hoa hồng CTV -> tự động hoàn trừ hoa hồng nguyên tử
    if (
      res.previousStatus === 'PAID' &&
      status === 'CANCELLED' &&
      res.order.affiliateCode &&
      (res.order.commissionAmount || 0) > 0 &&
      !res.order.commissionReversedAt
    ) {
      try {
        const { reverseAffiliateCommission } = await import('@/lib/affiliateStore');
        await reverseAffiliateCommission(
          res.order.affiliateCode,
          res.order.amount,
          res.order.commissionAmount || 0
        );
        await adminSupabase
          .from('tuvi_orders')
          .update({ commission_reversed_at: new Date().toISOString() })
          .eq('order_code', res.order.orderCode);
      } catch (revErr) {
        console.warn('[ORDERS PATCH] Lỗi hoàn trừ hoa hồng CTV khi hủy đơn:', revErr);
      }
    }

    return NextResponse.json({ success: true, order: res.order });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi cập nhật trạng thái đơn';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
