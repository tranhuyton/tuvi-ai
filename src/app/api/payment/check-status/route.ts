import { NextResponse } from 'next/server';
import { getOrderByCode } from '@/lib/orderStore';
import { getAuthenticatedUser, verifyAdminRequest } from '@/lib/adminAuth';
import { verifyExpiringToken } from '@/lib/supabaseAdmin';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
};

export async function GET(req: Request) {
  const ip = getClientIp(req);
  const rl = await checkRateLimitDistributed({
    key: `check_status:${ip}`,
    limit: 90,
    windowMs: 60_000,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Quá nhiều yêu cầu kiểm tra đơn hàng' },
      { status: 429, headers: NO_CACHE_HEADERS }
    );
  }

  const { searchParams } = new URL(req.url);
  const code = (searchParams.get('code') || '').trim().toUpperCase();
  const statusToken = (searchParams.get('token') || '').trim();

  if (!code || !/^TV\d{4,8}$/i.test(code)) {
    return NextResponse.json(
      { success: false, error: 'Mã đơn hàng không hợp lệ' },
      { status: 400, headers: NO_CACHE_HEADERS }
    );
  }

  const order = await getOrderByCode(code);
  if (!order) {
    return NextResponse.json(
      { success: false, status: 'NOT_FOUND', message: 'Không tìm thấy đơn hàng' },
      { status: 404, headers: NO_CACHE_HEADERS }
    );
  }

  // Bảo vệ chống quét hàng loạt mã đơn hàng TVxxxxxx:
  // Chấp nhận nếu (1) có statusToken HMAC hợp lệ do create-order cấp, (2) là chủ đơn (JWT), hoặc (3) là Admin
  const hasValidStatusToken = Boolean(
    statusToken && verifyExpiringToken('order_status', order.orderCode, statusToken)
  );
  if (!hasValidStatusToken) {
    const adminAuth = await verifyAdminRequest(req);
    const authUser = adminAuth.user || (await getAuthenticatedUser(req));
    const isOwner = Boolean(authUser && order.userId && authUser.id === order.userId);
    if (!adminAuth.authorized && !isOwner) {
      return NextResponse.json(
        { success: false, error: 'Không có quyền kiểm tra trạng thái đơn hàng này' },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }
  }

  return NextResponse.json(
    {
      success: true,
      status: order.status,
      orderCode: order.orderCode,
      paymentType: order.paymentType,
      amount: order.amount,
      paidAt: order.paidAt,
    },
    { headers: NO_CACHE_HEADERS }
  );
}
