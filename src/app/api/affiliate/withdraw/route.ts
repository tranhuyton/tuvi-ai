import { NextRequest, NextResponse } from 'next/server';
import { requestWithdrawal } from '@/lib/affiliateStore';

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

    const result = await requestWithdrawal(code, Number(amount));

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || 'Không thể tạo yêu cầu rút tiền' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, affiliate: result.affiliate });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Lỗi gửi yêu cầu rút tiền' },
      { status: 500 }
    );
  }
}
