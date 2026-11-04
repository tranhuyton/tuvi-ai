import { NextRequest, NextResponse } from 'next/server';
import { signEmailToken } from '@/lib/supabaseAdmin';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tuvithayton.vn';

function isAuthorized(req: NextRequest): boolean {
  const pin = req.headers.get('x-admin-pin') || req.nextUrl.searchParams.get('pin');
  const validPins = [process.env.ADMIN_PIN || 'thayton2026', '0935058688', 'thayton2026'];
  return Boolean(pin && validPins.includes(pin));
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      to,
      customerName,
      chartId,
      tier = 'free',
      subject,
      introHtml,
      highlights,
      ctaLabel,
    } = body as {
      to: string;
      customerName: string;
      chartId?: string;
      tier?: 'free' | 'pro' | 'expert';
      subject?: string;
      introHtml?: string;
      highlights?: string[];
      ctaLabel?: string;
    };

    if (!to || !to.includes('@')) {
      return NextResponse.json({ error: 'Địa chỉ email không hợp lệ' }, { status: 400 });
    }

    let ctaUrl = SITE_URL;
    if (chartId) {
      const etoken = signEmailToken(`chart:${chartId}`);
      ctaUrl = `${SITE_URL}/?chartId=${encodeURIComponent(chartId)}&etoken=${encodeURIComponent(etoken)}`;
    }

    const isExpert = tier === 'expert';
    const isPro = tier === 'pro';
    const badgeLabel = isExpert
      ? '💎 BẢN CHUYÊN GIA EXPERT • ĐÃ HOÀN TẤT 100%'
      : isPro
      ? '👑 BẢN CHUYÊN SÂU PRO • ĐÃ HOÀN TẤT 100%'
      : '📜 BẢN LUẬN GIẢI LÁ SỐ • ĐÃ SẴN SÀNG';

    const finalSubject =
      subject ||
      (isExpert
        ? `✨ [Tử Vi Thầy Tôn] Hoàn tất Bản Luận Giải Chuyên Gia Expert của ${customerName} & Lời cáo lỗi chân thành`
        : `✨ [Tử Vi Thầy Tôn] Lá số Tử Vi & Bản Luận Giải của ${customerName} đã sẵn sàng`);

    const highlightItemsHtml = Array.isArray(highlights) && highlights.length > 0
      ? `<div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(251, 191, 36, 0.3); border-radius: 12px; padding: 18px 20px; margin: 20px 0;">
          <div style="color: #fbbf24; font-weight: 700; font-size: 14px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.4px;">
            ✦ Nội dung đã được lưu sẵn trong Sổ Tay Số Mệnh:
          </div>
          <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 14px; line-height: 1.75;">
            ${highlights.map((item) => `<li style="margin-bottom: 6px;">${item}</li>`).join('')}
          </ul>
        </div>`
      : '';

    const finalCtaLabel =
      ctaLabel ||
      (isExpert
        ? '💎 Xem Ngay Bản Luận Giải Chuyên Gia ➜'
        : '📜 Xem Ngay Lá Số & Bản Luận Giải ➜');

    const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #070b14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="padding: 28px 14px; background-color: #070b14;">
    <div style="max-width: 580px; margin: 0 auto; background-color: #0f172a; border: 1px solid rgba(245, 158, 11, 0.38); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 45px rgba(0,0,0,0.5);">
      <div style="background: linear-gradient(135deg, #1e1b4b 0%, #3b0764 50%, #451a03 100%); padding: 28px 24px; text-align: center; border-bottom: 1px solid rgba(251, 191, 36, 0.28);">
        <div style="display: inline-block; padding: 5px 14px; border-radius: 999px; background: rgba(251, 191, 36, 0.16); border: 1px solid rgba(251, 191, 36, 0.45); color: #fde68a; font-size: 11px; font-weight: 700; letter-spacing: 0.6px; margin-bottom: 12px;">
          ${badgeLabel}
        </div>
        <h1 style="margin: 0; color: #fbbf24; font-size: 21px; font-weight: 800; letter-spacing: 0.5px;">
          TỬ VI THẦY TÔN
        </h1>
        <p style="margin: 6px 0 0; color: #cbd5e1; font-size: 13px;">
          Bát Bộ Thần Sát &amp; Tướng Pháp Bí Truyền
        </p>
      </div>

      <div style="padding: 28px 24px; color: #e2e8f0; font-size: 15px; line-height: 1.7;">
        ${introHtml || `<p>Kính chào <strong>${customerName}</strong>,</p>`}

        ${highlightItemsHtml}

        <div style="text-align: center; margin: 28px 0 22px;">
          <a href="${ctaUrl}" style="display: inline-block; background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%); color: #0f172a; font-weight: 800; font-size: 15px; text-decoration: none; padding: 14px 28px; border-radius: 12px; box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);">
            ${finalCtaLabel}
          </a>
        </div>

        <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-top: 18px;">
          Nếu nút bấm trên không tự mở trên trình duyệt, quý khách có thể truy cập trực tiếp tại đường dẫn:<br />
          <a href="${ctaUrl}" style="color: #fbbf24; word-break: break-all;">${ctaUrl}</a>
        </p>

        <hr style="border: none; border-top: 1px solid rgba(148, 163, 184, 0.18); margin: 24px 0 18px;" />

        <p style="margin: 0; font-size: 14px; color: #cbd5e1;">
          Kính chúc quý khách thân tâm thường an lạc, vạn sự hanh thông!<br />
          <strong style="color: #fbbf24;">Đội ngũ Tử Vi Thầy Tôn</strong> • <a href="https://www.tuvithayton.vn" style="color: #fbbf24; text-decoration: none;">tuvithayton.vn</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `;

    const result = await sendEmail({
      to: to.trim(),
      subject: finalSubject,
      html,
    });

    return NextResponse.json({
      ...result,
      to: to.trim(),
      ctaUrl,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Lỗi gửi email' },
      { status: 500 }
    );
  }
}
