import { NextRequest, NextResponse } from 'next/server';
import { getTesterByEmail } from '@/lib/testerStore';
import { adminSupabase } from '@/lib/supabaseAdmin';
import { getAuthenticatedUser } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Chỉ cho phép user đã đăng nhập (Bearer JWT) kiểm tra quyền Tester của chính mình (chống lộ danh sách email Tester!)
    const authUser = await getAuthenticatedUser(req);
    if (!authUser?.email) {
      return NextResponse.json({ isTester: false }, { status: 401 });
    }

    const cleanEmail = authUser.email.toLowerCase().trim();
    const tester = await getTesterByEmail(cleanEmail);

    if (!tester || !tester.isActive) {
      return NextResponse.json({ isTester: false });
    }

    let chartsUsed = tester.chartsUsed || 0;
    try {
      const targetUserId = tester.userId || authUser.id;
      if (targetUserId) {
        const { count } = await adminSupabase
          .from('tuvi_charts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', targetUserId);
        if (count !== null) chartsUsed = count;
      }
    } catch {
      // ignore
    }

    return NextResponse.json({
      isTester: true,
      maxCharts: tester.maxCharts,
      maxQuestionsPerChart: tester.maxQuestionsPerChart,
      chartsUsed,
      fullName: tester.fullName,
    });
  } catch (err: any) {
    return NextResponse.json({ isTester: false, error: err?.message }, { status: 500 });
  }
}
