import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

const TARGET_ADMIN_EMAIL = 'tranhuyton@gmail.com';
const recentNotifiedKeys = new Map<string, number>();

function escapeHtml(raw: string): string {
  return String(raw || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export async function POST(req: NextRequest) {
  try {
    const relayHeader = req.headers.get('x-tony-lead-relay');
    if (relayHeader !== 'tonyenglish-v1') {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const contactId = String(body?.contactId || '').trim();
    const name = String(body?.name || 'Phụ huynh / Học viên').trim().slice(0, 120);
    const phone = String(body?.phone || '').trim().slice(0, 30);
    const email = String(body?.email || '').trim().slice(0, 120);
    const course = String(body?.course || 'Tư vấn khóa học TonyEnglish').trim().slice(0, 160);
    const note = String(body?.note || '').trim().slice(0, 1000);
    const pageUrl = String(body?.pageUrl || 'https://tonyenglish.vn/courses').trim().slice(0, 400);
    const sourceType = String(body?.sourceType || 'CallbackForm').trim();

    if (!phone) {
      return NextResponse.json({ ok: false, error: 'Missing phone' }, { status: 400 });
    }

    // Deduplicate within 10 minutes
    const now = Date.now();
    for (const [k, ts] of recentNotifiedKeys.entries()) {
      if (now - ts > 10 * 60 * 1000) recentNotifiedKeys.delete(k);
    }
    const dedupKey = `${contactId}:${phone}`;
    if (contactId && recentNotifiedKeys.has(dedupKey)) {
      return NextResponse.json({ ok: true, deduplicated: true });
    }
    if (contactId) {
      recentNotifiedKeys.set(dedupKey, now);
    }

    const cleanDigits = phone.replace(/[^\d+]/g, '');
    const zaloDigits = cleanDigits.replace(/^\+84/, '0').replace(/^84(?=\d{9}$)/, '0');
    const timeStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    const subject =
      sourceType === 'ContactPage'
        ? `📩 [Liên hệ TonyEnglish] ${phone} - ${name}`
        : `🔔 [Học Thử TonyEnglish] ${phone} - ${name} (${course})`;

    const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:16px;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#0f172a;">
  <div style="max-width:580px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #cbd5e1;box-shadow:0 8px 24px rgba(15,23,42,0.08);">
    <div style="background:linear-gradient(135deg,#0a5482 0%,#0f172a 100%);padding:22px 24px;color:#ffffff;">
      <div style="display:inline-block;background:#2ab4e8;color:#0f172a;font-weight:800;font-size:11px;padding:4px 12px;border-radius:999px;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:8px;">
        TONYENGLISH.VN • ĐĂNG KÝ MỚI
      </div>
      <h1 style="margin:0;font-size:20px;line-height:1.35;font-weight:800;color:#ffffff;">
        Phụ huynh / Học viên vừa để lại Số điện thoại!
      </h1>
      <p style="margin:6px 0 0 0;font-size:13px;color:#bae6fd;">
        Thời gian nhận: <strong>${escapeHtml(timeStr)}</strong>
      </p>
    </div>

    <div style="padding:22px 24px;">
      <div style="background:#f0f9ff;border:2px dashed #0284c7;border-radius:14px;padding:16px;text-align:center;margin-bottom:20px;">
        <div style="font-size:12px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">
          Số Điện Thoại / Zalo Khách Hàng
        </div>
        <div style="font-size:28px;font-weight:900;color:#0a5482;letter-spacing:1px;">
          <a href="tel:${escapeHtml(cleanDigits)}" style="color:#0a5482;text-decoration:none;">${escapeHtml(phone)}</a>
        </div>
      </div>

      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;width:36%;font-weight:600;">Họ tên</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:700;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Khóa quan tâm</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0a5482;font-weight:800;">${escapeHtml(course)}</td>
        </tr>
        ${
          note
            ? `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Lớp / Môn / Ghi chú</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;font-weight:600;white-space:pre-line;">${escapeHtml(note)}</td>
        </tr>`
            : ''
        }
        ${
          email
            ? `<tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Email khách</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#0f172a;">${escapeHtml(email)}</td>
        </tr>`
            : ''
        }
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;font-weight:600;">Link nguồn</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-size:12px;"><a href="${escapeHtml(pageUrl)}" style="color:#0284c7;word-break:break-all;">${escapeHtml(pageUrl)}</a></td>
        </tr>
      </table>

      <div style="text-align:center;margin:22px 0 12px 0;">
        <a href="tel:${escapeHtml(cleanDigits)}" style="display:inline-block;background:#059669;color:#ffffff;font-weight:800;font-size:14px;padding:12px 20px;border-radius:10px;text-decoration:none;margin:4px 6px;">
          📞 Gọi Ngay: ${escapeHtml(phone)}
        </a>
        <a href="https://zalo.me/${escapeHtml(zaloDigits)}" style="display:inline-block;background:#0068ff;color:#ffffff;font-weight:800;font-size:14px;padding:12px 20px;border-radius:10px;text-decoration:none;margin:4px 6px;">
          💬 Mở Zalo Khách Hàng
        </a>
      </div>

      <div style="text-align:center;margin-top:14px;padding-top:14px;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;">
        Đã tự động lưu vào bảng <strong>Khách đăng ký tư vấn</strong> •
        <a href="https://tonyenglish.vn/admincp" style="color:#0a5482;font-weight:700;text-decoration:none;">Mở Quản Trị TonyEnglish →</a>
      </div>
    </div>
  </div>
</body>
</html>`;

    const result = await sendEmail({
      to: TARGET_ADMIN_EMAIL,
      from: 'TonyEnglish Tuyển Sinh <thayton@tuvithayton.vn>',
      replyTo: email && email.includes('@') ? email : TARGET_ADMIN_EMAIL,
      subject,
      html,
    });

    return NextResponse.json({
      ok: result.success,
      messageId: result.messageId,
      simulated: Boolean(result.simulated),
      error: result.error,
    });
  } catch (err: any) {
    console.error('[TONYENGLISH LEAD EMAIL ERROR]', err?.message || err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Internal error' },
      { status: 500 }
    );
  }
}
