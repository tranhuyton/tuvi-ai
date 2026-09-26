import { NextRequest, NextResponse } from 'next/server';
import { getTesterByEmail } from '@/lib/testerStore';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) {
      return NextResponse.json({ isTester: false });
    }

    const cleanEmail = email.toLowerCase().trim();
    const tester = await getTesterByEmail(cleanEmail);

    if (!tester || !tester.isActive) {
      return NextResponse.json({ isTester: false });
    }

    // Lấy số lượng lá số thực tế đã tạo
    let chartsUsed = tester.chartsUsed || 0;
    try {
      if (tester.userId) {
        const { count } = await supabase
          .from('tuvi_charts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', tester.userId);
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
      notes: tester.notes,
    });
  } catch (err: any) {
    return NextResponse.json({ isTester: false, error: err.message }, { status: 500 });
  }
}
