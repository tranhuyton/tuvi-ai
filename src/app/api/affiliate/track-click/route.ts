import { NextRequest, NextResponse } from 'next/server';
import { recordAffiliateClick } from '@/lib/affiliateStore';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const ref = String(body?.ref || '').trim().toLowerCase();
    if (!ref || !/^[a-z0-9_-]{2,40}$/i.test(ref)) {
      return NextResponse.json({ success: false, message: 'Mã ref không hợp lệ' }, { status: 400 });
    }

    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `aff_click:${ip}:${ref}`,
      limit: 5,
      windowMs: 10 * 60_000,
    });
    if (!rl.allowed) {
      return NextResponse.json({ success: true, deduplicated: true });
    }

    await recordAffiliateClick(ref);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi track click';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
