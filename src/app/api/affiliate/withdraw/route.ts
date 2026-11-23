import { NextRequest, NextResponse } from 'next/server';
import { requestWithdrawal } from '@/lib/affiliateStore';
import { sendWithdrawalNotificationEmail } from '@/lib/email';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `aff_withdraw:${ip}`,
      limit: 6,
      windowMs: 10 * 60_000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: 'Quá nhiều yêu cầu rút tiền liên tiếp. Vui lòng thử lại sau ít phút.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { code, phone, amount } = body;
    const numAmount = Number(amount);

    if (!code || !phone || !Number.isFinite(numAmount) || !Number.isInteger(numAmount) || numAmount < 50000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vui lòng cung cấp đầy đủ mã CTV, SĐT xác thực và số tiền rút nguyên dương tối thiểu 50.000đ.',
        },
        { status: 400 }
      );
    }

    const result = await requestWithdrawal(code, numAmount, phone);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || 'Không thể tạo yêu cầu rút tiền' },
        { status: 400 }
      );
    }

    if (result.affiliate) {
      try {
        const availableAfter = Math.max(
          0,
          (result.affiliate.totalCommission || 0) -
            (result.affiliate.paidCommission || 0) -
            (result.affiliate.pendingWithdrawal || 0)
        );

        await sendWithdrawalNotificationEmail({
          affiliateName: result.affiliate.name,
          affiliateCode: result.affiliate.code,
          phone: result.affiliate.phone,
          email: result.affiliate.email,
          amount: numAmount,
          bankName: result.affiliate.bankName || 'Ngân hàng',
          bankCode: result.affiliate.bankCode || 'MB',
          bankAccountNumber: result.affiliate.bankAccountNumber || '',
          bankAccountName: result.affiliate.bankAccountName || '',
          remainingBalance: availableAfter,
          requestedAt: new Date().toISOString(),
          reqId: result.reqId,
        });
      } catch (emailErr) {
        console.warn('[WITHDRAW API] Lỗi gửi email thông báo rút tiền:', emailErr);
      }
    }

    const aff = result.affiliate;
    const availableCommission = aff
      ? Math.max(0, aff.totalCommission - aff.paidCommission - (aff.pendingWithdrawal || 0))
      : 0;
    return NextResponse.json({
      success: true,
      affiliate: aff
        ? {
            code: aff.code,
            name: aff.name,
            totalCommission: aff.totalCommission,
            paidCommission: aff.paidCommission,
            remainingCommission: availableCommission,
            pendingWithdrawal: aff.pendingWithdrawal || 0,
          }
        : null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi gửi yêu cầu rút tiền';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
