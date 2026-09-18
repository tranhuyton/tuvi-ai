/**
 * Client kết nối AI Luận Giải Tử Vi thông qua Supabase Edge Function
 * - Bí mật API Key được bảo vệ 100% trong Supabase Secrets (không lộ ở frontend/client/.env)
 * - Tự động Fallback đa tầng (Edge Function tuvi-interpreter -> omni-vision-solver)
 * - Hỗ trợ cả văn bản phân tích lẫn đa phương thức (Ảnh Diện tướng + Chỉ tay)
 */

export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string; // base64 without prefix
  };
}

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubkvzgwespfvrlpjuxkp.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia3Z6Z3dlc3BmdnJscGp1eGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTYzNTEsImV4cCI6MjA5MjY5MjM1MX0.ZEgXs3LfI9diL9aji56N9HIxPOl0e1sMeRxbMfSM2qw';

function formatTuViHtml(rawText: string): string {
  let cleaned = rawText.replace(/```html|```markdown|```/gi, '');
  cleaned = cleaned.replace(
    /### (.*?)(\r\n|\n)/g,
    '<h4 class="font-bold text-amber-700 text-lg mt-4 mb-2">$1</h4>'
  );
  cleaned = cleaned.replace(
    /## (.*?)(\r\n|\n)/g,
    '<h3 class="font-bold text-red-700 text-xl mt-6 mb-3 border-b border-red-200 pb-1">$1</h3>'
  );
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '<b class="text-red-700 font-semibold">$1</b>');
  cleaned = cleaned.replace(/\*(.*?)\*/g, '<i class="italic text-slate-700">$1</i>');
  return cleaned.trim();
}

/**
 * Tạo parts hoàn chỉnh cho bài bình giải Tử Vi Thầy Tôn
 */
export function buildReadingParts(options: {
  laSo: import('@/types/tuvi').LaSoData;
  thongTinThem?: string;
  chieuCao?: number;
  canNang?: number;
  anhMat?: string;
  anhTay?: string;
}): GeminiPart[] {
  const { laSo, thongTinThem, chieuCao, canNang, anhMat, anhTay } = options;
  const { duongSo, namCanChi, banMenh, tenCuc, sinhKhac, namXemCanChi, namXem, tuoiAmXem, cungs } = laSo;
  const { buildCungDataPrompt } = require('./tuvi/anSao');
  const cungDataStr = buildCungDataPrompt(laSo);

  // 1. Tính toán chính xác 100% Cung Đại Vận hiện tại theo Tuổi Âm
  const cungDaiVanHienTai = cungs.find(
    (c) => c.daiVan <= tuoiAmXem && tuoiAmXem < c.daiVan + 10
  );

  let daiVanPromptStr = '';
  let daiVanInstruction = '3. Phân tích Đại Vận đang chạy.';
  if (cungDaiVanHienTai) {
    const startAge = cungDaiVanHienTai.daiVan;
    const endAge = startAge + 9;
    daiVanPromptStr = `\nĐẠI VẬN HIỆN TẠI (CHÍNH XÁC): Đang ở Đại vận ${startAge} - ${endAge} tuổi tại Cung ${cungDaiVanHienTai.chi} (${cungDaiVanHienTai.cungName}).
LƯU Ý QUAN TRỌNG: Hiện tại năm ${namXem} đương số đúng ${tuoiAmXem} tuổi Âm, nằm trong khoảng ${startAge} - ${endAge} tuổi (Ví dụ: 42 tuổi nằm trong khoảng 35 - 44 tuổi tại Cung ${cungDaiVanHienTai.chi}). TUYỆT ĐỐI KHÔNG LUẬN NHẦM sang đại vận khác như 45-54 tuổi!\n`;
    daiVanInstruction = `3. Phân tích Đại Vận hiện tại: BẮT BUỘC luận giải đúng Đại Vận ${startAge} - ${endAge} tuổi tại Cung ${cungDaiVanHienTai.chi} (${cungDaiVanHienTai.cungName}). Phân tích kỹ đương số đang ở tuổi ${tuoiAmXem} thì cơ hội, vận hạn và biến chuyển trong đại vận ${startAge}-${endAge} này ra sao.`;
  }

  // 2. Tìm Cung Lưu Niên / Tiểu Vận năm xem
  const chiNamXem = (namXemCanChi.split(' ')[1] || '').trim();
  const cungLuuNien = cungs.find((c) => c.chi === chiNamXem);
  let tieuVanPromptStr = '';
  if (cungLuuNien) {
    tieuVanPromptStr = `\nTIỂU VẬN / LƯU NIÊN NĂM ${namXem} (${namXemCanChi}): Đóng tại Cung ${cungLuuNien.chi} (${cungLuuNien.cungName}).\n`;
  }

  let promptText = `Đại sư Tử Vi Thầy Tôn uyên bác. Khách hàng: ${duongSo.hoTen}, ${duongSo.gioiTinh}. KHÔNG xưng AI, KHÔNG dùng bát tự. Xưng là 'Thầy Tôn'.
KHÔNG dùng Markdown (**). Dùng HTML chuẩn (<b>, <h3>, <h4>, <p>, <ul>, <li>).
LÁ SỐ: Năm Âm ${namCanChi}. Mệnh ${banMenh}, Cục ${tenCuc}. Sinh khắc: ${sinhKhac}. Xem hạn năm ${namXemCanChi} (${namXem}), ${tuoiAmXem} tuổi.
${daiVanPromptStr}${tieuVanPromptStr}CÁC SAO: \n${cungDataStr}\n`;

  if (thongTinThem && thongTinThem.trim()) {
    promptText += `Hoàn cảnh thực tế của đương số: ${thongTinThem.trim()}.\n`;
  }
  if (chieuCao && canNang && chieuCao > 0 && canNang > 0) {
    promptText += `Hình thể: Chiều cao ${chieuCao} cm, Cân nặng ${canNang} kg.\n`;
  }

  promptText += `YÊU CẦU CẤU TRÚC BÀI LUẬN:
1. Tổng quan Bản Mệnh, tính cách & tiềm năng (kết hợp phân tích sự bù trừ của Hình Tướng và hoàn cảnh thực tế nếu có).
2. Điểm nhấn các cung trọng yếu: Mệnh/Thân, Quan Lộc, Tài Bạch, Phu Thê (Nếu có ảnh khuôn mặt hoặc chỉ tay đính kèm, hãy quan sát kỹ Diện tướng và Thủ tướng để luận giải bổ trợ).
${daiVanInstruction}
4. Đánh giá Tiểu Vận năm ${namXem} và 4 mùa trọng tâm (Xuân - Hạ - Thu - Đông), định hướng hành động đắc thời và tu dưỡng hóa giải vận hạn. (Nhắc nhở đương số có thể đàm đạo thêm với Thầy ở khung Chat bên dưới).
Văn phong uyên thâm, thấu tỏ huyền cơ, súc tích, mạch lạc. Trình bày HTML đẹp mắt.`;

  const parts: GeminiPart[] = [{ text: promptText }];

  if (anhMat && anhMat.includes(';base64,')) {
    const [header, base64Data] = anhMat.split(';base64,');
    const mimeType = header.replace('data:', '') || 'image/jpeg';
    parts.push({
      inlineData: { mimeType, data: base64Data },
    });
  }

  if (anhTay && anhTay.includes(';base64,')) {
    const [header, base64Data] = anhTay.split(';base64,');
    const mimeType = header.replace('data:', '') || 'image/jpeg';
    parts.push({
      inlineData: { mimeType, data: base64Data },
    });
  }

  return parts;
}

/**
 * Gọi AI luận giải Tử Vi
 * Ưu tiên gọi qua Supabase Edge Function (dùng key bí mật trong Supabase Secret)
 * Nếu người dùng có tự nhập key cá nhân thì gọi trực tiếp với key đó.
 */
export async function callGeminiVision(
  parts: GeminiPart[],
  customApiKey?: string,
  modelName = 'gemini-3.1-pro-preview'
): Promise<{ text?: string; error?: string }> {
  const isPro = modelName.includes('3.1') || modelName.includes('pro');
  const targetBudget = isPro ? 1024 : 0;

  // 1. Trường hợp người dùng có nhập key riêng trong modal cài đặt
  if (customApiKey && customApiKey.trim()) {
    try {
      const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        modelName
      )}:generateContent?key=${encodeURIComponent(customApiKey.trim())}`;
      const res = await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 3500,
            thinkingConfig: { thinkingBudget: targetBudget },
          },
        }),
        signal: AbortSignal.timeout(120000),
      });

      if (!res.ok) {
        const errText = await res.text();
        return { error: `Lỗi kết nối với Key cá nhân: ${errText}` };
      }

      const data = await res.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        return { text: formatTuViHtml(rawText) };
      }
    } catch (e: any) {
      console.warn('Custom API Key failed, fallback sang Supabase Edge Function:', e.message);
    }
  }

  // 2. Mặc định: Gọi qua Supabase Edge Function (Key được bảo mật trong Supabase Secrets)
  const edgeEndpoints = [
    {
      url: `${SUPABASE_URL}/functions/v1/tuvi-interpreter`,
      label: 'Supabase tuvi-interpreter',
      body: {
        parts,
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 3500,
          thinkingConfig: { thinkingBudget: targetBudget },
        },
      },
    },
    {
      url: `${SUPABASE_URL}/functions/v1/omni-vision-solver`,
      label: 'Supabase omni-vision-solver (dự phòng)',
      body: {
        prompt: parts.find((p) => p.text)?.text || '',
        content: 'Luận giải chi tiết lá số theo dữ liệu được cung cấp.',
      },
    },
  ];

  let lastError = 'Không thể kết nối đến máy chủ AI';

  for (const { url, label, body } of edgeEndpoints) {
    try {
      console.log(`[callGeminiVision] Gửi yêu cầu qua ${label}...`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(120000),
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = `[${label}] Lỗi HTTP ${response.status}: ${errText}`;
        console.warn(lastError, '- Thử cổng dự phòng...');
        continue;
      }

      const data = await response.json();
      const rawText = data.result || data.text;

      if (!rawText) {
        lastError = `[${label}] Không nhận được phản hồi từ AI`;
        continue;
      }

      return { text: formatTuViHtml(rawText) };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      lastError = `[${label}] ${message}`;
      console.warn(`Lỗi khi gọi qua ${label}:`, message);
    }
  }

  return {
    error: `❌ Thầy đang bận luận giải cho người khác. ${lastError}`,
  };
}

/**
 * Kiểm tra kết nối AI / API Key
 */
export async function testGeminiApiKey(
  apiKey?: string
): Promise<{ success: boolean; latencyMs: number; model: string; message: string }> {
  const start = Date.now();

  // Nếu người dùng nhập key riêng
  if (apiKey && apiKey.trim()) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        apiKey.trim()
      )}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Kiểm tra tín hiệu kết nối.' }] }],
        }),
        signal: AbortSignal.timeout(15000),
      });

      const elapsed = Date.now() - start;
      if (!res.ok) {
        const errText = await res.text();
        return {
          success: false,
          latencyMs: elapsed,
          model: 'gemini-2.5-flash',
          message: errText,
        };
      }
      return {
        success: true,
        latencyMs: elapsed,
        model: 'gemini-2.5-flash',
        message: 'Kết nối thành công! Key cá nhân hoạt động bình thường.',
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        model: 'gemini-2.5-flash',
        message: err.message,
      };
    }
  }

  // Mặc định: Kiểm tra kết nối tới Supabase Edge Function
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/tuvi-interpreter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        prompt: 'Bạn là Thầy Tôn. Hãy chào ngắn gọn 1 câu để kiểm tra kết nối.',
        content: 'ping',
      }),
      signal: AbortSignal.timeout(15000),
    });

    const elapsed = Date.now() - start;
    if (res.ok) {
      return {
        success: true,
        latencyMs: elapsed,
        model: 'Supabase Edge Secret (Gemini)',
        message: 'Hệ thống Thầy Tôn AI kết nối hoàn hảo qua Supabase Edge Function!',
      };
    }

    const errText = await res.text();
    return {
      success: false,
      latencyMs: elapsed,
      model: 'Supabase Edge Secret (Gemini)',
      message: errText,
    };
  } catch (err: any) {
    return {
      success: false,
      latencyMs: Date.now() - start,
      model: 'Supabase Edge Secret (Gemini)',
      message: err.message,
    };
  }
}
