import { NextRequest, NextResponse } from 'next/server';
import { getAffiliateByCode, maskBankAccount, settleAffiliatePayout } from '@/lib/affiliateStore';
import { signExpiringToken, verifyExpiringToken } from '@/lib/supabaseAdmin';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';
import { escapeHtml } from '@/lib/tuvi/cleanReadingHtml';

export const dynamic = 'force-dynamic';

/**
 * Ký token HMAC có hạn 72 giờ (tách miền 'payout' riêng biệt) cho nút xác nhận chi trả trong Email Admin
 */
export function generatePayoutSign(code: string, amount: number, reqId: string): string {
  return signExpiringToken('payout', `${code.toLowerCase()}:${amount}:${reqId}`, 72 * 3600);
}

function verifyPayoutSign(code: string, amount: number, reqId: string, sig: string): boolean {
  if (!sig) return false;
  return verifyExpiringToken('payout', `${code.toLowerCase()}:${amount}:${reqId}`, sig);
}

/**
 * GET: Chỉ hiển thị trang xác nhận an toàn có nút bấm POST (chống bộ quét link tự động của Gmail/Anti-spam)
 */
export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `aff_confirm_payout:${ip}`,
      limit: 20,
      windowMs: 5 * 60_000,
    });
    if (!rl.allowed) {
      return new NextResponse(
        renderHtmlPage('Quá nhiều yêu cầu', 'Vui lòng thử lại sau ít phút.', false),
        { status: 429, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const { searchParams } = new URL(req.url);
    const code = (searchParams.get('code') || '').trim().toLowerCase();
    const amount = Number(searchParams.get('amount') || 0);
    const reqId = (searchParams.get('reqId') || '').trim();
    const sig = (searchParams.get('sig') || '').trim();

    if (!code || !Number.isInteger(amount) || amount <= 0 || !reqId || !sig) {
      return new NextResponse(
        renderHtmlPage('Thiếu thông tin xác nhận', 'Đường dẫn xác nhận chi trả không hợp lệ.', false),
        { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    if (!verifyPayoutSign(code, amount, reqId, sig)) {
      return new NextResponse(
        renderHtmlPage(
          'Liên kết xác nhận không hợp lệ hoặc đã hết hạn',
          'Chữ ký bảo mật không khớp hoặc đường dẫn đã quá thời hạn 72 giờ. Anh vui lòng vào trực tiếp trang Quản trị Admin để quyết toán.',
          false
        ),
        { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const aff = await getAffiliateByCode(code);
    if (!aff) {
      return new NextResponse(
        renderHtmlPage('Không tìm thấy CTV', `Không tìm thấy Cộng tác viên có mã "${escapeHtml(code)}".`, false),
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const maskedStk = maskBankAccount(aff.bankAccountNumber) || '(chưa cập nhật)';
    const confirmForm = `
      <form method="POST" action="/api/affiliate/confirm-payout" style="margin-top: 18px;">
        <input type="hidden" name="code" value="${escapeHtml(code)}" />
        <input type="hidden" name="amount" value="${escapeHtml(amount)}" />
        <input type="hidden" name="reqId" value="${escapeHtml(reqId)}" />
        <input type="hidden" name="sig" value="${escapeHtml(sig)}" />
        <button type="submit" style="width:100%;padding:13px 20px;background:linear-gradient(135deg,#10b981 0%,#059669 100%);color:#ffffff;font-weight:bold;font-size:15px;border:none;border-radius:10px;cursor:pointer;">
          ✅ Xác Nhận Đã Chuyển ${escapeHtml(amount.toLocaleString('vi-VN'))}đ &amp; Trừ Số Dư
        </button>
      </form>
    `;

    return new NextResponse(
      renderHtmlPage(
        'Xác Nhận Chi Trả Hoa Hồng CTV',
        `Xác nhận đã chuyển khoản <b>${escapeHtml(amount.toLocaleString('vi-VN'))}đ</b> cho CTV <b>${escapeHtml(aff.name)} (${escapeHtml(aff.code)})</b>?<br/><br/>
        • Ngân hàng: <b>${escapeHtml(aff.bankName || '')}</b> - <b>${escapeHtml(maskedStk)}</b> (${escapeHtml(aff.bankAccountName || '')})${confirmForm}`,
        true,
        false
      ),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Không thể xử lý yêu cầu';
    return new NextResponse(
      renderHtmlPage('Lỗi hệ thống', escapeHtml(msg), false),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

/**
 * POST: Thực hiện trừ số dư nguyên tử sau khi Admin bấm nút xác nhận (chống trùng giữa Email & SePay Webhook!)
 */
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `aff_confirm_payout_post:${ip}`,
      limit: 15,
      windowMs: 5 * 60_000,
    });
    if (!rl.allowed) {
      return new NextResponse(
        renderHtmlPage('Quá nhiều yêu cầu', 'Vui lòng thử lại sau ít phút.', false),
        { status: 429, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const contentType = req.headers.get('content-type') || '';
    let code = '';
    let amount = 0;
    let reqId = '';
    let sig = '';

    if (contentType.includes('application/json')) {
      const body = await req.json();
      code = String(body.code || '').trim().toLowerCase();
      amount = Number(body.amount || 0);
      reqId = String(body.reqId || '').trim();
      sig = String(body.sig || '').trim();
    } else {
      const form = await req.formData();
      code = String(form.get('code') || '').trim().toLowerCase();
      amount = Number(form.get('amount') || 0);
      reqId = String(form.get('reqId') || '').trim();
      sig = String(form.get('sig') || '').trim();
    }

    if (!code || !Number.isInteger(amount) || amount <= 0 || !reqId || !sig) {
      return new NextResponse(
        renderHtmlPage('Thiếu thông tin xác nhận', 'Yêu cầu xác nhận chi trả không hợp lệ.', false),
        { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    if (!verifyPayoutSign(code, amount, reqId, sig)) {
      return new NextResponse(
        renderHtmlPage(
          'Liên kết xác nhận không hợp lệ hoặc đã hết hạn',
          'Không thể xác thực yêu cầu xác nhận chi trả này.',
          false
        ),
        { status: 403, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const aff = await getAffiliateByCode(code);
    if (!aff) {
      return new NextResponse(
        renderHtmlPage('Không tìm thấy CTV', `Không tìm thấy Cộng tác viên có mã "${escapeHtml(code)}".`, false),
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const settleRes = await settleAffiliatePayout({
      affiliateId: aff.id,
      amount,
      reqId,
      note: `Xác nhận từ Email (req#${reqId})`,
    });

    if (!settleRes.ok) {
      return new NextResponse(
        renderHtmlPage('Không thể quyết toán', escapeHtml(settleRes.error || 'Lỗi quyết toán'), false),
        { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const updated = settleRes.affiliate || aff;
    const newRemaining = Math.max(0, (updated.totalCommission || 0) - (updated.paidCommission || 0));

    if (settleRes.alreadyProcessed) {
      return new NextResponse(
        renderHtmlPage(
          'Giao dịch này đã được quyết toán trước đó!',
          `Yêu cầu rút <b>${escapeHtml(amount.toLocaleString('vi-VN'))}đ</b> của CTV <b>${escapeHtml(aff.name)} (${escapeHtml(aff.code)})</b> đã được hệ thống trừ số dư trước đó (từ Email hoặc tự động qua SePay).<br/>Số dư chưa chi trả còn lại: <b>${escapeHtml(newRemaining.toLocaleString('vi-VN'))}đ</b>.`,
          true
        ),
        { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    return new NextResponse(
      renderHtmlPage(
        'Đã trừ số dư hoa hồng CTV thành công!',
        `Hệ thống đã ghi nhận chi trả <b>${escapeHtml(amount.toLocaleString('vi-VN'))}đ</b> cho CTV <b>${escapeHtml(aff.name)} (${escapeHtml(aff.code)})</b>.<br/><br/>
        • Tổng hoa hồng đã nhận: <b>${escapeHtml((updated.paidCommission || 0).toLocaleString('vi-VN'))}đ</b><br/>
        • Số dư còn lại của CTV: <b>${escapeHtml(newRemaining.toLocaleString('vi-VN'))}đ</b>`,
        true
      ),
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Không thể xử lý yêu cầu';
    return new NextResponse(
      renderHtmlPage('Lỗi hệ thống', escapeHtml(msg), false),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

function renderHtmlPage(title: string, message: string, isSuccess: boolean, showAdminBtn = true): string {
  const color = isSuccess ? '#34d399' : '#f87171';
  const icon = isSuccess ? '✅' : '⚠️';
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} - Tử Vi Thầy Tôn</title>
  <style>
    body { background: #0b0f19; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { max-width: 460px; width: 100%; background: #111827; border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 18px; padding: 28px 24px; text-align: center; box-shadow: 0 15px 35px rgba(0,0,0,0.6); }
    .icon { font-size: 44px; margin-bottom: 12px; }
    h1 { font-size: 20px; color: ${color}; margin: 0 0 14px 0; }
    p { font-size: 14px; color: #cbd5e1; line-height: 1.6; margin: 0 0 24px 0; }
    a.btn { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0b0f19; font-weight: bold; font-size: 14px; border-radius: 10px; text-decoration: none; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${icon}</div>
    <h1>${escapeHtml(title)}</h1>
    <p>${message}</p>
    ${showAdminBtn ? '<a href="/admin" class="btn">Về Trang Quản Trị Admin ➜</a>' : ''}
  </div>
</body>
</html>`;
}
