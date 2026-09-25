import { NextRequest, NextResponse } from 'next/server';
import { requestWithdrawal } from '@/lib/affiliateStore';
import { sendWithdrawalNotificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, amount } = body;

    if (!code || !amount || Number(amount) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Thiếu thông tin hoặc số tiền rút không hợp lệ' },
        { status: 400 }
      );
    }

    const numAmount = Number(amount);
    const result = await requestWithdrawal(code, numAmount);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || 'Không thể tạo yêu cầu rút tiền' },
        { status: 400 }
      );
    }

    // Gửi email thông báo cho Thầy Tôn (và CTV nếu có email)
    if (result.affiliate) {
      try {
        const remaining =
          (result.affiliate.totalCommission || 0) - (result.affiliate.paidCommission || 0);

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
          remainingBalance: remaining,
          requestedAt: new Date().toISOString(),
        });
      } catch (emailErr) {
        console.warn('[WITHDRAW API] Lỗi gửi email thông báo rút tiền:', emailErr);
      }
    }

    return NextResponse.json({ success: true, affiliate: result.affiliate });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Lỗi gửi yêu cầu rút tiền' },
      { status: 500 }
    );
  }
}
