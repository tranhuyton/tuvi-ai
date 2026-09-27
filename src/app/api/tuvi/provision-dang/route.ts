import { NextRequest, NextResponse } from 'next/server';
import { DANG_DUONG_SO, DANG_LA_SO, DANG_READING_HTML } from '@/lib/dangData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      duongSo: DANG_DUONG_SO,
      laSo: DANG_LA_SO,
      readingHtml: DANG_READING_HTML,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
