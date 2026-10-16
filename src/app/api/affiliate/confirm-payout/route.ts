import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAffiliateByCode, payoutAffiliate } from '@/lib/affiliateStore';

export const dynamic = 'force-dynamic';

export function generatePayoutSign(code: string, amount: number, reqId: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'tuvi_thay_ton_payout_secret';
  return crypto
    .createHmac('sha256', secret)
    .update(`${code.toLowerCase()}:${amount}:${reqId}`)
    .digest('hex')
    .slice(0, 20);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = (searchParams.get('code') || '').trim().toLowerCase();
    const amount = Number(searchParams.get('amount') || 0);
    const reqId = (searchParams.get('reqId') || '').trim();
    const sig = (searchParams.get('sig') || '').trim();

    if (!code || !amount || amount <= 0 || !reqId || !sig) {
      return new NextResponse(
        renderHtmlPage('Thiếu thông tin xác nhận', 'Đường dẫn xác nhận chi trả không hợp lệ.', false),
        { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const expectedSig = generatePayoutSign(code, amount, reqId);
    if (sig !== expectedSig) {
      return new NextResponse(
        renderHtmlPage('Chữ ký bảo mật không hợp lệ', 'Không thể xác thực yêu cầu xác nhận chi trả này.', false),
        { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const aff = await getAffiliateByCode(code);
    if (!aff) {
      return new NextResponse(
        renderHtmlPage('Không tìm thấy CTV', `Không tìm thấy Cộng tác viên có mã "${code}".`, false),
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const marker = `req#${reqId}`;
    if (aff.notes && aff.notes.includes(marker)) {
      const remaining = (aff.totalCommission || 0) - (aff.paidCommission || 0);
      return new NextResponse(
        renderHtmlPage(
          'Giao dịch này đã được xác nhận trước đó!',
          `Yêu cầu rút <b>${amount.toLocaleString('vi-VN')}đ</b> của CTV <b>${aff.name} (${aff.code})</b> đã được trừ số dư trước đó.<br/>Số dư khả dụng hiện tại của CTV: <b>${remaining.toLocaleString('vi-VN')}đ</b>.`,
          true
        ),
        { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const updated = await payoutAffiliate(aff.id, amount, `Xác nhận 1-Click từ Email (${marker})`);
    const newRemaining = updated ? (updated.totalCommission || 0) - (updated.paidCommission || 0) : 0;

    return new NextResponse(
      renderHtmlPage(
        'Đã trừ số dư hoa hồng CTV thành công!',
        `Hệ thống đã ghi nhận chi trả <b>${amount.toLocaleString('vi-VN')}đ</b> cho CTV <b>${aff.name} (${aff.code})</b>.<br/><br/>
        • Tổng hoa hồng đã nhận: <b>${(updated?.paidCommission || 0).toLocaleString('vi-VN')}đ</b><br/>
        • Số dư còn lại của CTV: <b>${newRemaining.toLocaleString('vi-VN')}đ</b>`,
        true
      ),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (err: any) {
    return new NextResponse(
      renderHtmlPage('Lỗi hệ thống', err?.message || 'Không thể xử lý yêu cầu', false),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

function renderHtmlPage(title: string, message: string, isSuccess: boolean): string {
  const color = isSuccess ? '#34d399' : '#f87171';
  const icon = isSuccess ? '✅' : '⚠️';
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} - Tử Vi Thầy Tôn</title>
  <style>
    body { background: #0b0f19; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { max-width: 460px; width: 100%; background: #111827; border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 18px; padding: 28px 24px; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.6); }
    .icon { font-size: 44px; margin-bottom: 12px; }
    h1 { font-size: 20px; color: ${color}; margin: 0 0 14px 0; }
    p { font-size: 14px; color: #cbd5e1; line-height: 1.6; margin: 0 0 24px 0; }
    a.btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0b0f19; font-weight: bold; font-size: 14px; border-radius: 10px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <a href="/admin" class="btn">Về Trang Quản Trị Admin ➜</a>
  </div>
</body>
</html>`;
}
