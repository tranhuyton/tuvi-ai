import { NextRequest, NextResponse } from 'next/server';
import { LaSoData, ChatMessage } from '@/types/tuvi';
import { buildCungDataPrompt } from '@/lib/tuvi/anSao';
import { callGeminiVision } from '@/lib/gemini';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userQuestion, laSo, thongTinThem, chieuCao, canNang, chatHistory, apiKey } = body as {
      userQuestion: string;
      laSo: LaSoData;
      thongTinThem?: string;
      chieuCao?: number;
      canNang?: number;
      chatHistory?: ChatMessage[];
      apiKey?: string;
    };

    if (!userQuestion || !userQuestion.trim()) {
      return NextResponse.json({ error: 'Câu hỏi không được để trống' }, { status: 400 });
    }

    if (!laSo) {
      return NextResponse.json({ error: 'Thiếu thông tin lá số' }, { status: 400 });
    }

    const { banMenh, namXemCanChi, tuoiAmXem, cungs } = laSo;
    const cungDataStr = buildCungDataPrompt(laSo);

    // Tính chính xác Đại Vận hiện tại
    const cungDaiVan = cungs.find(
      (c) => c.daiVan <= tuoiAmXem && tuoiAmXem < c.daiVan + 10
    );
    let daiVanInfo = '';
    if (cungDaiVan) {
      daiVanInfo = `Đại vận hiện tại: ${cungDaiVan.daiVan} - ${cungDaiVan.daiVan + 9} tuổi tại Cung ${cungDaiVan.chi} (${cungDaiVan.cungName}). (Hiện ${tuoiAmXem} tuổi Âm, không được nhầm đại vận). `;
    }

    let contextChat = '';
    if (thongTinThem && thongTinThem.trim()) {
      contextChat += `Hoàn cảnh: ${thongTinThem.trim()}. `;
    }
    if (chieuCao && canNang && chieuCao > 0 && canNang > 0) {
      contextChat += `Hình thể: ${chieuCao} cm, ${canNang} kg. `;
    }

    let historyText = '';
    if (chatHistory && chatHistory.length > 0) {
      historyText = 'LỊCH SỬ ĐÀM ĐẠO TRƯỚC ĐÓ:\n';
      chatHistory.forEach((c, idx) => {
        historyText += `Lượt ${idx + 1}:\n- Khách: ${c.q}\n- Thầy Tôn: ${c.a}\n`;
      });
      historyText += '\n';
    }

    const chatPrompt = `${historyText}Khách hỏi câu mới: '${userQuestion.trim()}'
Mệnh ${banMenh}. Năm nay ${namXemCanChi}, ${tuoiAmXem} tuổi Âm. ${daiVanInfo}${contextChat}
12 CUNG:
${cungDataStr}
YÊU CẦU: Trả lời khách 300-500 chữ uyên bác, ân cần, chỉ rõ căn nguyên lá số. Xưng là Thầy Tôn. KHÔNG dùng Markdown **, dùng HTML <b>, <p>.`;

    const result = await callGeminiVision([{ text: chatPrompt }], apiKey, 'gemini-3.1-pro-preview');

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ answer: result.text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ';
    return NextResponse.json({ error: `Lỗi: ${msg}` }, { status: 500 });
  }
}
