import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase, verifyEmailToken } from '@/lib/supabaseAdmin';
import { isValidUuid } from '@/lib/adminAuth';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';
import { escapeHtml } from '@/lib/tuvi/cleanReadingHtml';

export const dynamic = 'force-dynamic';

function renderUnsubPage(title: string, bodyHtml: string, isError = false): string {
  const titleColor = isError ? '#f87171' : '#fbbf24';
  return `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)} - Tử Vi Thầy Tôn</title></head>
  <body style="background:#0b0f19;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:16px;">
    <div style="max-width:460px;width:100%;background:#111827;border:1px solid rgba(245,158,11,0.35);border-radius:16px;padding:32px 24px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
      <h2 style="color:${titleColor};margin:0 0 12px 0;font-family:Georgia,serif;">${escapeHtml(title)}</h2>
      ${bodyHtml}
    </div>
  </body></html>`;
}

/**
 * GET: Hiển thị nút xác nhận hủy nhận email (KHÔNG thay đổi DB ở GET để chống bộ quét link chống spam của email client tự ý hủy đăng ký!)
 */
export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = await checkRateLimitDistributed({
    key: `email_unsub:${ip}`,
    limit: 20,
    windowMs: 5 * 60_000,
  });
  if (!rl.allowed) {
    return new NextResponse(
      renderUnsubPage('Quá nhiều yêu cầu', '<p style="color:#cbd5e1;font-size:14px;">Vui lòng thử lại sau ít phút.</p>', true),
      { status: 429, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const uid = (req.nextUrl.searchParams.get('uid') || '').trim();
  const sig = (req.nextUrl.searchParams.get('sig') || '').trim();

  if (!isValidUuid(uid) || !verifyEmailToken(`unsub:${uid}`, sig)) {
    return new NextResponse(
      renderUnsubPage(
        'Liên kết không hợp lệ',
        '<p style="color:#cbd5e1;font-size:14px;line-height:1.6;">Đường dẫn xác nhận không chính xác hoặc đã hết hạn.</p><a href="https://www.tuvithayton.vn" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#f59e0b;color:#0f172a;font-weight:bold;border-radius:10px;text-decoration:none;">Về Trang Chủ</a>',
        true
      ),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  const formHtml = `
    <p style="color:#cbd5e1;font-size:14px;line-height:1.6;margin:0 0 20px 0;">
      Quý khách muốn ngừng nhận các email nhắc nhở và mã ưu đãi tự động từ Tử Vi Thầy Tôn?
    </p>
    <form method="POST" action="/api/email/unsubscribe" style="margin:0;">
      <input type="hidden" name="uid" value="${escapeHtml(uid)}" />
      <input type="hidden" name="sig" value="${escapeHtml(sig)}" />
      <button type="submit" style="width:100%;padding:12px 24px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#0f172a;font-weight:bold;border:none;border-radius:10px;font-size:14px;cursor:pointer;">
        Xác Nhận Hủy Nhận Email Nhắc Nhở
      </button>
    </form>
  `;

  return new NextResponse(
    renderUnsubPage('Xác Nhận Hủy Nhận Email', formHtml, false),
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

/**
 * POST: Thực thi hủy nhận email (hỗ trợ cả nút bấm trên trang GET lẫn RFC 8058 List-Unsubscribe-Post One-Click của Gmail/Yahoo)
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const rl = await checkRateLimitDistributed({
    key: `email_unsub_post:${ip}`,
    limit: 20,
    windowMs: 5 * 60_000,
  });
  if (!rl.allowed) {
    return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
  }

  let uid = (req.nextUrl.searchParams.get('uid') || '').trim();
  let sig = (req.nextUrl.searchParams.get('sig') || '').trim();

  if (!uid || !sig) {
    try {
      const ct = req.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        const body = await req.json();
        uid = String(body.uid || uid).trim();
        sig = String(body.sig || sig).trim();
      } else {
        const form = await req.formData();
        uid = String(form.get('uid') || uid).trim();
        sig = String(form.get('sig') || sig).trim();
      }
    } catch {
      // ignore body parse errors for RFC 8058 query-only POST
    }
  }

  if (!isValidUuid(uid) || !verifyEmailToken(`unsub:${uid}`, sig)) {
    return new NextResponse(
      renderUnsubPage(
        'Liên kết không hợp lệ',
        '<p style="color:#cbd5e1;font-size:14px;line-height:1.6;">Đường dẫn xác nhận không chính xác hoặc đã hết hạn.</p>',
        true
      ),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }

  try {
    await adminSupabase
      .from('tuvi_profiles')
      .update({ email_unsubscribed: true })
      .eq('id', uid);
  } catch (err) {
    console.warn('[UNSUBSCRIBE] Lỗi cập nhật hủy nhận mail:', err);
  }

  return new NextResponse(
    renderUnsubPage(
      'Đã Hủy Nhận Email Nhắc Nhở',
      `<div style="font-size:36px;margin-bottom:10px;">✅</div>
       <p style="color:#cbd5e1;font-size:14px;line-height:1.6;margin:0 0 20px 0;">
         Hệ thống Tử Vi Thầy Tôn đã ghi nhận yêu cầu và ngừng gửi các email nhắc nhở/ưu đãi tự động tới hộp thư của quý khách. Tài khoản và các lá số đã lưu của quý khách vẫn hoạt động bình thường.
       </p>
       <a href="https://www.tuvithayton.vn" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#0f172a;font-weight:bold;border-radius:10px;text-decoration:none;font-size:14px;">
         Quay Lại Tử Vi Thầy Tôn
       </a>`,
      false
    ),
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
