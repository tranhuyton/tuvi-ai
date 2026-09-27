import { NextRequest, NextResponse } from 'next/server';
import { LaSoData, ChatMessage } from '@/types/tuvi';
import { buildCungDataPrompt } from '@/lib/tuvi/anSao';
import { callGeminiVision } from '@/lib/gemini';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userQuestion, laSo, thongTinThem, chieuCao, canNang, readingHtml, chatHistory, apiKey, mode, questionType, lang, language } = body as {
      userQuestion: string;
      laSo: LaSoData;
      thongTinThem?: string;
      chieuCao?: number;
      canNang?: number;
      readingHtml?: string;
      chatHistory?: ChatMessage[];
      apiKey?: string;
      mode?: 'basic' | 'vip';
      questionType?: 'basic' | 'vip';
      lang?: 'vi' | 'en' | 'zh' | 'ko' | 'ja';
      language?: 'vi' | 'en' | 'zh' | 'ko' | 'ja';
    };

    const targetLang = lang || language || 'vi';
    const activeMode: 'basic' | 'vip' = mode || questionType || 'vip';

    if (!userQuestion || !userQuestion.trim()) {
      return NextResponse.json({ error: 'Câu hỏi không được để trống' }, { status: 400 });
    }

    if (!laSo) {
      return NextResponse.json({ error: 'Thiếu thông tin lá số' }, { status: 400 });
    }

    // Kiểm tra quota cứng từ phía máy chủ: Nếu lá số đã dùng hết câu hỏi cho phép thì từ chối xử lý
    if (laSo && laSo.quota) {
      const allowedPro = Number(laSo.quota.proAllowed || 0);
      const allowedBasic = Number(laSo.quota.basicAllowed || 0);
      const totalAllowed = allowedPro + allowedBasic;
      const askedCount = (chatHistory || []).filter((c) => !c.isError).length;
      if (totalAllowed > 0 && askedCount >= totalAllowed) {
        return NextResponse.json(
          { error: 'Lá số này đã sử dụng hết số lượt hỏi cho phép. Quý khách vui lòng nạp thêm lượt hỏi để tiếp tục đàm đạo cùng Thầy Tôn.' },
          { status: 403 }
        );
      }
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

    let readingContext = '';
    if (readingHtml && readingHtml.trim()) {
      const cleanReading = readingHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      readingContext = `\nBÀI BÌNH GIẢI ĐÃ ĐƯỢC THẦY TÔN LUẬN GIẢI CHO ĐƯƠNG SỐ TRƯỚC ĐÓ (Bao gồm cả các dấu ấn Tướng pháp, Diện tướng, Chỉ tay nếu có):\n"${cleanReading.slice(0, 4500)}"\n(QUY TẮC: Khi khách hỏi về những nội dung liên quan đến bài bình giải cũ, đặc biệt là tướng mạo, đường chỉ tay, vết đứt gãy cung mệnh hay những lời khuyên đã dặn trước đó, bạn hãy bám sát và kế thừa chuẩn xác những gì đã luận giải ở trên để trả lời nhất quán và sâu sắc).\n`;
    }

    const requirementText =
      activeMode === 'vip'
        ? `YÊU CẦU LUẬN GIẢI CHUYÊN SÂU VIP PRO: Trả lời uyên bác, thấu đáo 400-600 chữ. Phân tích cặn kẽ tương quan 14 Chính tinh, các phụ tinh đắc hãm, Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ), Tuần/Triệt ảnh hưởng, Đại Vận 10 năm hiện tại và lưu niên năm nay. Đưa ra sách lược cụ thể, chỉ dẫn hóa giải điều hung đón điều cát. Xưng là Thầy Tôn. Định dạng bằng HTML chuẩn (<p>, <b>, <ul>, <li>). KHÔNG dùng markdown **.`
        : `YÊU CẦU LUẬN GIẢI CƠ BẢN: Trả lời 250-350 chữ cô đọng, dễ hiểu, ân cần, giải đáp thẳng thắn và chính xác vào trọng tâm câu hỏi của khách (về công danh, tài lộc, tình cảm hoặc gia đạo) dựa trên cung vị liên quan. Xưng là Thầy Tôn. Định dạng bằng HTML chuẩn (<p>, <b>). KHÔNG dùng markdown **.`;

    let langInstruction = '';
    if (targetLang === 'ja') {
      langInstruction = '\n\n【言語最高指令】：回答は100%美しく格調高い【日本語（丁寧語・敬語）】で記述してください！自称は「トン先生」または「当方」、相談者への呼称は「ご相談者様」としてください。正統派紫微斗数の専門用語を使用し、標準HTMLタグ（<p>, <b>, <ul>, <li>）を用いてください。Markdown太字（**）は使用禁止です。';
    } else if (targetLang === 'zh') {
      langInstruction = '\n\n【语言最高指令】：全文必须100%使用中文（规范中文）作答！自称“顿师”或“为师”，称呼求测者为“居士”或“缘主”。使用标准紫微斗数术语。使用标准HTML标签（<p>, <b>, <ul>, <li>），严禁使用Markdown粗体（**）。';
    } else if (targetLang === 'ko') {
      langInstruction = '\n\n【언어 필수 지침】：답변은 100% 품격 있는 한국어(존댓말)로 작성하십시오! 자칭은 \'톤 대사\' 혹은 \'이 사람\', 호칭은 \'귀하\' 혹은 \'의뢰인 님\'이라 칭하십시오. 자미두수 정통 한글 용어를 사용하십시오. 표준 HTML 태그(<p>, <b>, <ul>, <li>)를 사용하고 마크다운 **은 쓰지 마십시오.';
    } else if (targetLang === 'en') {
      langInstruction = '\n\n【LANGUAGE DIRECTIVE】：Answer 100% in refined and eloquent English! Refer to yourself as "Master Ton" and address the seeker respectfully. Use standard Western Zi Wei Dou Shu astrology terminology and valid HTML tags (<p>, <b>, <ul>, <li>). Do NOT use markdown **.';
    }

    const chatPrompt = `${readingContext}${historyText}Khách hỏi câu mới (${activeMode === 'vip' ? 'Gói Chuyên Sâu VIP Pro' : 'Gói Cơ Bản'}): '${userQuestion.trim()}'
Mệnh ${banMenh}. Năm nay ${namXemCanChi}, ${tuoiAmXem} tuổi Âm. ${daiVanInfo}${contextChat}
12 CUNG & NGUYỆT VẬN:
${cungDataStr}

QUY TẮC BẮT BUỘC VỀ NGUYỆT VẬN (LƯU NGUYỆT / THÁNG ÂM LỊCH):
- Nếu câu hỏi của khách có nhắc đến tháng nào trong năm (ví dụ tháng Giêng, tháng 5, tháng 8, tháng 10...), bạn BẮT BUỘC phải tra cứu chính xác theo 'BẢNG TRA CỨU NGUYỆT VẬN' ở trên để biết tháng đó rơi vào cung nào, có các chính tinh, phụ tinh và đặc biệt là các SAO LƯU nào thủ hoặc chiếu (L.Thái Tuế, L.Tang Môn, L.Bạch Hổ, L.Kình Dương, L.Đà La, L.Thiên Mã, L.Lộc Tồn, L.Thiên Khốc, L.Thiên Hư, L.Đẩu Quân, L.Hóa Lộc, L.Hóa Quyền, L.Hóa Khoa, L.Hóa Kị...). Dựa vào đó để chỉ rõ hung cát, tháng nào phát tài, tháng nào có biến chuyển đi lại, tháng nào cần phòng tai tiếng, thị phi. Tuyệt đối KHÔNG được tự suy đoán hay nói nhầm sang cung khác.
${requirementText}${langInstruction}`;


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
