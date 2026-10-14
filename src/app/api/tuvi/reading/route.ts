import { NextRequest, NextResponse } from 'next/server';
import { LaSoData } from '@/types/tuvi';
import { callGeminiVision, buildReadingParts } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 180;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubkvzgwespfvrlpjuxkp.supabase.co';
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia3Z6Z3dlc3BmdnJscGp1eGtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzExNjM1MSwiZXhwIjoyMDkyNjkyMzUxfQ.Ubmws-Yg0pJKaCaXy7aO8rbt6bw4O3PGgM6GzPR0PLk';

const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { laSo, tier, thongTinThem, chieuCao, canNang, anhMat, anhTay, apiKey, model, lang, language, chartId } = body as {
      laSo: LaSoData;
      tier?: 'free' | 'pro' | 'expert';
      thongTinThem?: string;
      chieuCao?: number;
      canNang?: number;
      anhMat?: string; // base64 data url: data:image/...;base64,...
      anhTay?: string; // base64 data url: data:image/...;base64,...
      apiKey?: string;
      model?: string;
      lang?: 'vi' | 'en' | 'zh' | 'ko' | 'ja';
      language?: 'vi' | 'en' | 'zh' | 'ko' | 'ja';
      chartId?: string;
    };

    if (!laSo || !laSo.duongSo) {
      return NextResponse.json({ error: 'Dữ liệu lá số không hợp lệ' }, { status: 400 });
    }

    const currentTier = tier || laSo.tier || 'free';
    const targetModel =
      model ||
      (currentTier === 'expert'
        ? 'gemini-4-argon'
        : currentTier === 'pro'
        ? 'gemini-3.1-pro-preview'
        : 'gemini-2.5-flash');
    const targetLang = lang || language || 'vi';

    const parts = buildReadingParts({
      laSo,
      tier: currentTier,
      thongTinThem,
      chieuCao,
      canNang,
      anhMat,
      anhTay,
      lang: targetLang,
    });

    const result = await callGeminiVision(parts, apiKey, targetModel);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Tự động lưu kết quả luận giải trực tiếp vào database từ máy chủ
    // (Đảm bảo dù khách hàng có tắt trình duyệt giữa chừng khi đang chờ luận giải thì mở lại vẫn có đủ kết quả)
    if (chartId && result.text) {
      try {
        const { data: existingChart } = await adminSupabase
          .from('tuvi_charts')
          .select('duong_so_data, laso_data')
          .eq('id', chartId)
          .maybeSingle();

        const updatedDuongSo = existingChart?.duong_so_data
          ? { ...existingChart.duong_so_data, tier: currentTier }
          : undefined;
        const updatedLaSo = existingChart?.laso_data
          ? { ...existingChart.laso_data, tier: currentTier, needsReadingUpgrade: false }
          : undefined;

        await adminSupabase
          .from('tuvi_charts')
          .update({
            reading_html: result.text,
            ...(updatedDuongSo ? { duong_so_data: updatedDuongSo } : {}),
            ...(updatedLaSo ? { laso_data: updatedLaSo } : {}),
            updated_at: new Date().toISOString(),
          })
          .eq('id', chartId);
      } catch (saveErr) {
        console.warn('[READING API] Không thể tự động lưu reading_html từ server:', saveErr);
      }
    }

    return NextResponse.json({ reading: result.text, savedToDb: Boolean(chartId) });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ';
    return NextResponse.json({ error: `Lỗi: ${msg}` }, { status: 500 });
  }
}
