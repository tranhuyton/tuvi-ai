import { NextRequest, NextResponse } from 'next/server';
import { updateAffiliateBank } from '@/lib/affiliateStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, bankCode, bankName, bankAccountNumber, bankAccountName } = body;

    if (!code || !bankName || !bankAccountNumber || !bankAccountName) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ Tên ngân hàng, Số tài khoản và Tên chủ thẻ' },
        { status: 400 }
      );
    }

    const updated = await updateAffiliateBank(code, {
      bankCode,
      bankName,
      bankAccountNumber,
      bankAccountName,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy thông tin CTV' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, affiliate: updated });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Lỗi cập nhật tài khoản' },
      { status: 500 }
    );
  }
}
