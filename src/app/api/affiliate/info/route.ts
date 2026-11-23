import { NextRequest, NextResponse } from 'next/server';
import { maskBankAccount, verifyAffiliateByPhone } from '@/lib/affiliateStore';
import { getOrdersByAffiliateCode } from '@/lib/orderStore';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `aff_info:${ip}`,
      limit: 15,
      windowMs: 5 * 60_000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: 'Quá nhiều lần tra cứu. Vui lòng thử lại sau ít phút.' },
        { status: 429 }
      );
    }

    const phone = req.nextUrl.searchParams.get('phone') || req.nextUrl.searchParams.get('q') || '';
    const code = req.nextUrl.searchParams.get('code') || '';

    if (!phone.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập Số điện thoại đã đăng ký để tra cứu thông tin Cộng tác viên' },
        { status: 400 }
      );
    }

    const { affiliate: aff, error } = await verifyAffiliateByPhone(phone.trim(), code.trim() || undefined);
    if (error || !aff) {
      return NextResponse.json(
        { error: error || 'Không tìm thấy thông tin Cộng Tác Viên tương ứng' },
        { status: 404 }
      );
    }

    // Truy vấn đúng đơn hàng của riêng CTV này (KHÔNG quét toàn bảng tuvi_orders!)
    const affOrders = await getOrdersByAffiliateCode(aff.code, 30);
    const myOrders = affOrders.map((o) => ({
      orderCode: o.orderCode,
      paymentType: o.paymentType,
      amount: o.amount,
      status: o.status,
      createdAt: o.createdAt,
      paidAt: o.paidAt,
      commissionAmount: o.commissionAmount,
    }));

    const pendingWithdrawal = aff.pendingWithdrawal || 0;
    const unpaidCommission = Math.max(0, aff.totalCommission - aff.paidCommission);
    const availableCommission = Math.max(0, unpaidCommission - pendingWithdrawal);

    return NextResponse.json({
      success: true,
      affiliate: {
        code: aff.code,
        name: aff.name,
        commissionMode: aff.commissionMode,
        commissionRate: aff.commissionRate,
        commissionFixed: aff.commissionFixed,
        commissionTiers: aff.commissionTiers,
        totalClicks: aff.totalClicks,
        totalOrders: aff.totalOrders,
        totalRevenue: aff.totalRevenue,
        totalCommission: aff.totalCommission,
        paidCommission: aff.paidCommission,
        // Trả về số dư khả dụng đã trừ khoản đang chờ duyệt để giao diện /ctv hiển thị chuẩn xác
        remainingCommission: availableCommission,
        unpaidCommission,
        pendingWithdrawal,
        bankName: aff.bankName,
        bankCode: aff.bankCode,
        bankAccountNumber: maskBankAccount(aff.bankAccountNumber),
        hasBankAccount: Boolean(aff.bankAccountNumber),
        bankAccountName: aff.bankAccountName,
        createdAt: aff.createdAt,
      },
      recentOrders: myOrders.slice(0, 20),
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi tra cứu thông tin';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
