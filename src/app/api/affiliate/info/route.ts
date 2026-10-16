import { NextRequest, NextResponse } from 'next/server';
import { verifyAffiliateByPhone } from '@/lib/affiliateStore';
import { getAllOrders } from '@/lib/orderStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
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

    // Lấy các đơn hàng của riêng CTV này
    const allOrders = await getAllOrders();
    const myOrders = allOrders
      .filter((o) => (o.affiliateCode || '').toLowerCase() === aff.code.toLowerCase())
      .map((o) => ({
        orderCode: o.orderCode,
        paymentType: o.paymentType,
        amount: o.amount,
        status: o.status,
        createdAt: o.createdAt,
        paidAt: o.paidAt,
        commissionAmount: o.commissionAmount,
      }));

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
        remainingCommission: aff.totalCommission - aff.paidCommission,
        pendingWithdrawal: aff.pendingWithdrawal || 0,
        bankName: aff.bankName,
        bankCode: aff.bankCode,
        bankAccountNumber: aff.bankAccountNumber,
        bankAccountName: aff.bankAccountName,
        createdAt: aff.createdAt,
      },
      recentOrders: myOrders.slice(0, 20),
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Lỗi tra cứu thông tin' },
      { status: 500 }
    );
  }
}
