import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase, verifyEmailToken } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const uid = req.nextUrl.searchParams.get('uid') || '';
  const sig = req.nextUrl.searchParams.get('sig') || '';

  const isValid = uid && verifyEmailToken(`unsub:${uid}`, sig);

  if (!isValid) {
    return new NextResponse(
      `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Liên kết không hợp lệ</title></head>
      <body style="background:#0b0f19;color:#e2e8f0;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:16px;">
        <div style="max-width:440px;background:#111827;border:1px solid #334155;border-radius:16px;padding:28px;text-align:center;">
          <h2 style="color:#f87171;margin-top:0;">Liên kết không hợp lệ</h2>
          <p style="color:#cbd5e1;font-size:14px;line-height:1.6;">Đường dẫn xác nhận không chính xác hoặc đã bị cắt ngắn.</p>
          <a href="https://www.tuvithayton.vn" style="display:inline-block;margin-top:12px;padding:10px 20px;background:#f59e0b;color:#0f172a;font-weight:bold;border-radius:10px;text-decoration:none;">Về Trang Chủ</a>
        </div>
      </body></html>`,
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
    `<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Đã hủy nhận email nhắc nhở - Tử Vi Thầy Tôn</title></head>
    <body style="background:#0b0f19;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:16px;">
      <div style="max-width:460px;background:#111827;border:1px solid rgba(245,158,11,0.35);border-radius:16px;padding:32px 24px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
        <div style="font-size:36px;margin-bottom:10px;">✅</div>
        <h2 style="color:#fbbf24;margin:0 0 10px 0;font-family:Georgia,serif;">Đã Hủy Nhận Email Nhắc Nhở</h2>
        <p style="color:#cbd5e1;font-size:14px;line-height:1.6;margin:0 0 20px 0;">
          Hệ thống Tử Vi Thầy Tôn đã ghi nhận yêu cầu và ngừng gửi các email nhắc nhở/ưu đãi tự động tới hộp thư của quý khách. Tài khoản và các lá số đã lưu của quý khách vẫn hoạt động bình thường.
        </p>
        <a href="https://www.tuvithayton.vn" style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#0f172a;font-weight:bold;border-radius:10px;text-decoration:none;font-size:14px;">
          Quay Lại Tử Vi Thầy Tôn
        </a>
      </div>
    </body></html>`,
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
