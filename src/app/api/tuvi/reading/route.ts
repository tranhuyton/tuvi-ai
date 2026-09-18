import { NextRequest, NextResponse } from 'next/server';
import { LaSoData } from '@/types/tuvi';
import { callGeminiVision, buildReadingParts } from '@/lib/gemini';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { laSo, tier, thongTinThem, chieuCao, canNang, anhMat, anhTay, apiKey, model } = body as {
      laSo: LaSoData;
      tier?: 'free' | 'pro';
      thongTinThem?: string;
      chieuCao?: number;
      canNang?: number;
      anhMat?: string; // base64 data url: data:image/...;base64,...
      anhTay?: string; // base64 data url: data:image/...;base64,...
      apiKey?: string;
      model?: string;
    };

    if (!laSo || !laSo.duongSo) {
      return NextResponse.json({ error: 'Dữ liệu lá số không hợp lệ' }, { status: 400 });
    }

    const currentTier = tier || laSo.tier || 'free';
    const targetModel = model || (currentTier === 'pro' ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash');

    const parts = buildReadingParts({
      laSo,
      tier: currentTier,
      thongTinThem,
      chieuCao,
      canNang,
      anhMat,
      anhTay,
    });

    const result = await callGeminiVision(parts, apiKey, targetModel);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ reading: result.text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ';
    return NextResponse.json({ error: `Lỗi: ${msg}` }, { status: 500 });
  }
}
