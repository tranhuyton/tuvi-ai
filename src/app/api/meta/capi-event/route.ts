import { NextResponse } from 'next/server';
import { extractRequestCapiMeta, sendMetaCapiEvent } from '@/lib/metaCapi';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';

const ALLOWED_CLIENT_CAPI_EVENTS = new Set(['CompleteRegistration', 'Lead', 'Contact']);

/**
 * Endpoint nhẹ để trình duyệt gửi gương Server-Side CAPI cho các sự kiện đầu phễu
 * (`CompleteRegistration`, `Lead`, `Contact`) kèm `event_id` khử trùng lặp 100% với Meta Pixel.
 * Giúp chống rớt 25–40% tín hiệu trên iOS Safari / Facebook In-App Browser & tăng điểm EMQ.
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `meta_capi_beacon:${ip}`,
      limit: 30,
      windowMs: 60_000,
    });
    if (!rl.allowed) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const eventName = String(body.eventName || '').trim();
    const eventId = String(body.eventId || '').trim().slice(0, 120);

    if (!ALLOWED_CLIENT_CAPI_EVENTS.has(eventName) || !eventId) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const meta = extractRequestCapiMeta(req, {
      fbp: typeof body.fbp === 'string' ? body.fbp : undefined,
      fbc: typeof body.fbc === 'string' ? body.fbc : undefined,
      fbclid: typeof body.fbclid === 'string' ? body.fbclid : undefined,
      sourceUrl: typeof body.sourceUrl === 'string' ? body.sourceUrl : undefined,
    });

    const rawValue = Number(body.value);
    const value = Number.isFinite(rawValue) && rawValue > 0 ? rawValue : undefined;

    const sent = await sendMetaCapiEvent({
      eventName: eventName as 'CompleteRegistration' | 'Lead' | 'Contact',
      eventId,
      value,
      currency: value ? String(body.currency || 'VND') : undefined,
      contentName: typeof body.contentName === 'string' ? body.contentName.slice(0, 140) : undefined,
      contentCategory:
        typeof body.contentCategory === 'string' ? body.contentCategory.slice(0, 80) : undefined,
      email: typeof body.email === 'string' ? body.email : undefined,
      phone: typeof body.phone === 'string' ? body.phone : undefined,
      fullName: typeof body.fullName === 'string' ? body.fullName : undefined,
      userId: typeof body.userId === 'string' ? body.userId : undefined,
      meta,
      timeoutMs: 3500,
    });

    return NextResponse.json({ ok: true, sent });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
