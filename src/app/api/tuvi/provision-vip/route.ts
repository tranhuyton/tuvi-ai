import { NextRequest, NextResponse } from 'next/server';
import { HIEN_DUONG_SO, HIEN_LA_SO, HIEN_READING_HTML } from '@/lib/hienData';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      duongSo: HIEN_DUONG_SO,
      laSo: HIEN_LA_SO,
      readingHtml: HIEN_READING_HTML,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
