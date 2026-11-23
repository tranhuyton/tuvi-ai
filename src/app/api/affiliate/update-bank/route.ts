import { NextRequest, NextResponse } from 'next/server';
import { maskBankAccount, updateAffiliateBank } from '@/lib/affiliateStore';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `aff_bank:${ip}`,
      limit: 10,
      windowMs: 5 * 60_000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: 'Quá nhiều yêu cầu cập nhật, vui lòng thử lại sau ít phút.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { code, phone, bankCode, bankName, bankAccountNumber, bankAccountName } = body;

    if (!code || !phone || !bankName || !bankAccountNumber || !bankAccountName) {
      return NextResponse.json(
        {
          success: false,
          error: 'Vui lòng điền đầy đủ Mã CTV, Số điện thoại xác thực, Tên ngân hàng, Số tài khoản và Tên chủ thẻ',
        },
        { status: 400 }
      );
    }

    const updated = await updateAffiliateBank(code, {
      bankCode,
      bankName,
      bankAccountNumber,
      bankAccountName,
      phone,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy thông tin CTV' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      affiliate: {
        code: updated.code,
        name: updated.name,
        bankName: updated.bankName,
        bankCode: updated.bankCode,
        bankAccountNumber: maskBankAccount(updated.bankAccountNumber),
        hasBankAccount: true,
        bankAccountName: updated.bankAccountName,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi cập nhật tài khoản';
    return NextResponse.json({ success: false, error: msg }, { status: 403 });
  }
}
