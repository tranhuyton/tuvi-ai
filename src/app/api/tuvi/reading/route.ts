import { NextRequest, NextResponse } from 'next/server';
import { LaSoData } from '@/types/tuvi';
import { buildCungDataPrompt } from '@/lib/tuvi/anSao';
import { callGeminiVision, GeminiPart } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { laSo, thongTinThem, chieuCao, canNang, anhMat, anhTay, apiKey } = body as {
      laSo: LaSoData;
      thongTinThem?: string;
      chieuCao?: number;
      canNang?: number;
      anhMat?: string; // base64 data url: data:image/...;base64,...
      anhTay?: string; // base64 data url: data:image/...;base64,...
      apiKey?: string;
    };

    if (!laSo || !laSo.duongSo) {
      return NextResponse.json({ error: 'Dữ liệu lá số không hợp lệ' }, { status: 400 });
    }

    const { duongSo, namCanChi, banMenh, tenCuc, sinhKhac, namXemCanChi, namXem, tuoiAmXem } = laSo;
    const cungDataStr = buildCungDataPrompt(laSo);

    let promptText = `Đại sư Tử Vi Thầy Tôn uyên bác. Khách hàng: ${duongSo.hoTen}, ${duongSo.gioiTinh}. KHÔNG xưng AI, KHÔNG dùng bát tự. Xưng là 'Thầy Tôn'.
KHÔNG dùng Markdown (**). Dùng HTML chuẩn (<b>, <h3>, <h4>, <p>, <ul>, <li>).
LÁ SỐ: Năm Âm ${namCanChi}. Mệnh ${banMenh}, Cục ${tenCuc}. Sinh khắc: ${sinhKhac}. Xem hạn năm ${namXemCanChi} (${namXem}), ${tuoiAmXem} tuổi.
CÁC SAO: \n${cungDataStr}\n`;

    if (thongTinThem && thongTinThem.trim()) {
      promptText += `Hoàn cảnh thực tế của đương số: ${thongTinThem.trim()}.\n`;
    }
    if (chieuCao && canNang && chieuCao > 0 && canNang > 0) {
      promptText += `Hình thể: Chiều cao ${chieuCao} cm, Cân nặng ${canNang} kg.\n`;
    }

    promptText += `YÊU CẦU CẤU TRÚC BÀI LUẬN:
1. Tổng quan Bản Mệnh, thành tựu (Nếu có thông tin hoàn cảnh hoặc Hình thể, hãy kết hợp phân tích sự bù trừ của Hình Tướng và hoàn cảnh thực tế với lá số).
2. Điểm nhấn 12 cung (Nếu có ảnh khuôn mặt hoặc chỉ tay đính kèm, hãy phân tích Diện tướng và Thủ tướng ở mục này để bổ trợ cho các cung quan trọng như Quan Lộc, Tài Bạch, Phu Thê).
3. Phân tích Đại Vận đang chạy.
4. Đánh giá Tiểu Vận năm ${namXem} và Nguyệt Vận 12 tháng.`;

    const parts: GeminiPart[] = [{ text: promptText }];

    // Xử lý ảnh Diện tướng
    if (anhMat && anhMat.includes(';base64,')) {
      const [header, base64Data] = anhMat.split(';base64,');
      const mimeType = header.replace('data:', '') || 'image/jpeg';
      parts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    // Xử lý ảnh Chỉ tay
    if (anhTay && anhTay.includes(';base64,')) {
      const [header, base64Data] = anhTay.split(';base64,');
      const mimeType = header.replace('data:', '') || 'image/jpeg';
      parts.push({
        inlineData: {
          mimeType,
          data: base64Data,
        },
      });
    }

    const result = await callGeminiVision(parts, apiKey);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ reading: result.text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ';
    return NextResponse.json({ error: `Lỗi: ${msg}` }, { status: 500 });
  }
}
