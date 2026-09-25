import { NextRequest, NextResponse } from 'next/server';
import { LaSoData, ChatMessage } from '@/types/tuvi';
import { buildCungDataPrompt } from '@/lib/tuvi/anSao';
import { callGeminiVision } from '@/lib/gemini';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userQuestion, laSo, thongTinThem, chieuCao, canNang, chatHistory, apiKey, mode, questionType } = body as {
      userQuestion: string;
      laSo: LaSoData;
      thongTinThem?: string;
      chieuCao?: number;
      canNang?: number;
      chatHistory?: ChatMessage[];
      apiKey?: string;
      mode?: 'basic' | 'vip';
      questionType?: 'basic' | 'vip';
    };

    const activeMode: 'basic' | 'vip' = mode || questionType || 'vip';

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
        const tag = c.type === 'vip' ? '[VIP Pro]' : '[Cơ Bản]';
        historyText += `Lượt ${idx + 1} ${tag}:\n- Khách: ${c.q}\n- Thầy Tôn: ${c.a}\n`;
      });
      historyText += '\n';
    }

    const requirementText =
      activeMode === 'vip'
        ? `YÊU CẦU LUẬN GIẢI CHUYÊN SÂU VIP PRO: Trả lời uyên bác, thấu đáo 400-600 chữ. Phân tích cặn kẽ tương quan 14 Chính tinh, các phụ tinh đắc hãm, Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ), Tuần/Triệt ảnh hưởng, Đại Vận 10 năm hiện tại và lưu niên năm nay. Đưa ra sách lược cụ thể, chỉ dẫn hóa giải điều hung đón điều cát. Xưng là Thầy Tôn. Định dạng bằng HTML chuẩn (<p>, <b>, <ul>, <li>). KHÔNG dùng markdown **.`
        : `YÊU CẦU LUẬN GIẢI CƠ BẢN: Trả lời 250-350 chữ cô đọng, dễ hiểu, ân cần, giải đáp thẳng thắn và chính xác vào trọng tâm câu hỏi của khách (về công danh, tài lộc, tình cảm hoặc gia đạo) dựa trên cung vị liên quan. Xưng là Thầy Tôn. Định dạng bằng HTML chuẩn (<p>, <b>). KHÔNG dùng markdown **.`;

    const chatPrompt = `${historyText}Khách hỏi câu mới (${activeMode === 'vip' ? 'Gói Chuyên Sâu VIP Pro' : 'Gói Cơ Bản'}): '${userQuestion.trim()}'
Mệnh ${banMenh}. Năm nay ${namXemCanChi}, ${tuoiAmXem} tuổi Âm. ${daiVanInfo}${contextChat}
12 CUNG & NGUYỆT VẬN:
${cungDataStr}

QUY TẮC BẮT BUỘC VỀ NGUYỆT VẬN (LƯU NGUYỆT / THÁNG ÂM LỊCH):
- Nếu câu hỏi của khách có nhắc đến tháng nào trong năm (ví dụ tháng Giêng, tháng 5, tháng 8, tháng 10...), bạn BẮT BUỘC phải tra cứu chính xác theo 'BẢNG TRA CỨU NGUYỆT VẬN' ở trên để biết tháng đó rơi vào cung nào, có các chính tinh, phụ tinh và đặc biệt là các SAO LƯU nào thủ hoặc chiếu (L.Thái Tuế, L.Tang Môn, L.Bạch Hổ, L.Kình Dương, L.Đà La, L.Thiên Mã, L.Lộc Tồn, L.Thiên Khốc, L.Thiên Hư, L.Đẩu Quân, L.Hóa Lộc, L.Hóa Quyền, L.Hóa Khoa, L.Hóa Kị...). Dựa vào đó để chỉ rõ hung cát, tháng nào phát tài, tháng nào có biến chuyển đi lại, tháng nào cần phòng tai tiếng, thị phi. Tuyệt đối KHÔNG được tự suy đoán hay nói nhầm sang cung khác.
${requirementText}`;

    const modelToUse = activeMode === 'vip' ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash';
    const result = await callGeminiVision([{ text: chatPrompt }], apiKey, modelToUse);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ answer: result.text, mode: activeMode });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ';
    return NextResponse.json({ error: `Lỗi: ${msg}` }, { status: 500 });
  }
}
