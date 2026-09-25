import { NextRequest, NextResponse } from 'next/server';
import { getAffiliateByPhoneOrCode } from '@/lib/affiliateStore';
import { getAllOrders } from '@/lib/orderStore';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q');
    if (!q || !q.trim()) {
      return NextResponse.json({ error: 'Vui lòng cung cấp mã giới thiệu hoặc số điện thoại' }, { status: 400 });
    }

    const aff = await getAffiliateByPhoneOrCode(q.trim());
    if (!aff) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin Cộng Tác Viên tương ứng' }, { status: 404 });
    }

    // Lấy các đơn hàng gần đây của riêng CTV này
    const allOrders = await getAllOrders(100);
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
        commissionRate: aff.commissionRate,
        commissionFixed: aff.commissionFixed,
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
