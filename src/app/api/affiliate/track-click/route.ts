import { NextRequest, NextResponse } from 'next/server';
import { recordAffiliateClick } from '@/lib/affiliateStore';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { ref } = await req.json();
    if (!ref) {
      return NextResponse.json({ success: false, message: 'Thiếu mã ref' }, { status: 400 });
    }

    await recordAffiliateClick(String(ref));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Lỗi track click' },
      { status: 500 }
    );
  }
}
