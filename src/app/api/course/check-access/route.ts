import { NextResponse } from 'next/server';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';
import { resolveCourseAccess } from '@/lib/courseAccessServer';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `course_access:${ip}`,
      limit: 25,
      windowMs: 60_000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, unlocked: false, error: 'Quá nhiều yêu cầu, vui lòng thử lại sau giây lát.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const orderCode = body.orderCode ? String(body.orderCode).trim().toUpperCase() : '';

    const access = await resolveCourseAccess(req, orderCode);

    return NextResponse.json({
      success: true,
      unlocked: access.unlocked,
      isAdmin: access.isAdmin,
      isTester: access.isTester,
      orderCode: access.orderCode,
      email: access.email,
      hoTen: access.hoTen,
      paidAt: access.paidAt,
      message: access.message,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi kiểm tra quyền truy cập';
    console.error('[COURSE CHECK-ACCESS] Lỗi:', err);
    return NextResponse.json({ success: false, unlocked: false, error: msg }, { status: 500 });
  }
}
