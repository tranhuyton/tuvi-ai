import { NextRequest, NextResponse } from 'next/server';
import {
  getAllAffiliates,
  createAffiliate,
  updateAffiliate,
  deleteAffiliate,
  payoutAffiliate,
} from '@/lib/affiliateStore';
import { getAllOrders } from '@/lib/orderStore';

export const dynamic = 'force-dynamic';

function isAuthorized(req: NextRequest): boolean {
  const pin = req.headers.get('x-admin-pin') || req.nextUrl.searchParams.get('pin');
  const validPins = [
    process.env.ADMIN_PIN || 'thayton2026',
    '0935058688',
    'thayton2026',
  ];
  return !!pin && validPins.includes(pin);
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Mã PIN bảo mật không chính xác' }, { status: 401 });
  }

  try {
    const affiliates = await getAllAffiliates();
    const allOrders = await getAllOrders(200);
    const affiliateOrders = allOrders.filter((o) => !!o.affiliateCode);

    return NextResponse.json({
      success: true,
      affiliates,
      orders: affiliateOrders,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Lỗi lấy dữ liệu affiliate' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Mã PIN bảo mật không chính xác' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create') {
      const { code, name, phone, email, bankName, bankAccountNumber, bankAccountName, commissionRate, commissionFixed, notes } = body;
      if (!code || !name) {
        return NextResponse.json({ error: 'Mã giới thiệu và Tên CTV là bắt buộc' }, { status: 400 });
      }

      const created = await createAffiliate({
        code,
        name,
        phone,
        email,
        bankName,
        bankAccountNumber,
        bankAccountName,
        commissionRate: commissionRate !== undefined ? Number(commissionRate) : 25,
        commissionFixed: commissionFixed ? Number(commissionFixed) : undefined,
        notes,
      });

      return NextResponse.json({ success: true, affiliate: created });
    }

    if (action === 'update') {
      const { id, ...data } = body;
      if (!id) return NextResponse.json({ error: 'Thiếu ID CTV' }, { status: 400 });

      const updated = await updateAffiliate(id, data);
      return NextResponse.json({ success: true, affiliate: updated });
    }

    if (action === 'delete') {
      const { id } = body;
      if (!id) return NextResponse.json({ error: 'Thiếu ID CTV' }, { status: 400 });

      const ok = await deleteAffiliate(id);
      return NextResponse.json({ success: ok });
    }

    if (action === 'payout') {
      const { id, amount, note } = body;
      if (!id || !amount) {
        return NextResponse.json({ error: 'Thiếu ID CTV hoặc số tiền' }, { status: 400 });
      }

      const updated = await payoutAffiliate(id, Number(amount), note);

      // Nếu CTV có email, gửi email xác nhận đã chi trả hoa hồng thành công
      if (updated && updated.email && updated.email.includes('@')) {
        try {
          const { sendEmail } = await import('@/lib/email');
          const formattedAmount = Number(amount).toLocaleString('vi-VN') + ' đ';
          await sendEmail({
            to: updated.email,
            subject: `[Tử Vi Thầy Tôn] Đã chi trả thành công hoa hồng: ${formattedAmount}`,
            html: `
<div style="background-color: #0b0f19; padding: 25px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div style="background: linear-gradient(135deg, #064e3b 0%, #022c22 100%); padding: 24px; text-align: center;">
      <h2 style="color: #34d399; margin: 0; font-size: 18px;">✔ CHI TRẢ HOA HỒNG THÀNH CÔNG</h2>
    </div>
    <div style="padding: 24px; color: #cbd5e1; line-height: 1.6; font-size: 14px;">
      <p>Xin chào <strong>${updated.name}</strong>,</p>
      <p>Thầy Tôn đã hoàn tất chuyển khoản tiền hoa hồng cho bạn với số tiền: <b style="color: #34d399; font-size: 18px;">${formattedAmount}</b>.</p>
      <div style="background: #0f172a; padding: 14px; border-radius: 8px; margin: 16px 0; border: 1px solid #1f2937;">
        • Tài khoản nhận: <b>${updated.bankName || ''}</b> - <b>${updated.bankAccountNumber || ''}</b> (${updated.bankAccountName || ''})<br/>
        • Ghi chú: <b>${note || `HOA HONG ${updated.code.toUpperCase()}`}</b>
      </div>
      <p>Bạn có thể đăng nhập vào cổng <a href="https://tuvithayton.vn/ctv" style="color: #fbbf24; font-weight: bold;">tuvithayton.vn/ctv</a> để kiểm tra lịch sử chi trả và số dư ví mới nhất.</p>
      <p>Chúc bạn thật nhiều may mắn và tiếp tục lan tỏa năng lượng tích cực cùng Tử Vi Thầy Tôn!</p>
    </div>
  </div>
</div>
            `,
          });
        } catch (mailErr) {
          console.warn('[ADMIN AFFILIATE PAYOUT] Lỗi gửi email cho CTV:', mailErr);
        }
      }

      return NextResponse.json({ success: true, affiliate: updated });
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Lỗi xử lý yêu cầu' },
      { status: 500 }
    );
  }
}
