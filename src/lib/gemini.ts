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
 * Gọi AI luận giải Tử Vi
 * Ưu tiên gọi qua Supabase Edge Function (dùng key bí mật trong Supabase Secret)
 * Nếu người dùng có tự nhập key cá nhân thì gọi trực tiếp với key đó.
 */
export async function callGeminiVision(
  parts: GeminiPart[],
  customApiKey?: string
): Promise<{ text?: string; error?: string }> {
  // 1. Trường hợp người dùng có nhập key riêng trong modal cài đặt
  if (customApiKey && customApiKey.trim()) {
    try {
      const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        customApiKey.trim()
      )}`;
      const res = await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ role: 'user', parts }] }),
        signal: AbortSignal.timeout(60000),
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
      body: { parts },
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
        signal: AbortSignal.timeout(60000),
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
