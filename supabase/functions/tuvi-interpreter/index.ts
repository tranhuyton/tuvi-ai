import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ALLOWED_MODELS = new Set([
  'gemini-2.5-flash',
  'gemini-3.1-pro-preview',
  'gemini-4-argon',
  'gemini-4-carbon',
]);

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://www.tuvithayton.vn',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-edge-internal-secret',
};

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Fail-closed: Chấp nhận gọi nội bộ từ server Vercel qua:
    //  (1) x-edge-internal-secret khớp EDGE_INTERNAL_SECRET (nếu đã cấu hình), HOẶC
    //  (2) Authorization: Bearer khớp SUPABASE_SERVICE_ROLE_KEY (có sẵn mặc định trên cả Vercel & Supabase)
    // Mọi request từ trình duyệt / người lạ (kể cả có ANON_KEY) đều bị chặn 401!
    const expectedInternalSecret = (Deno.env.get('EDGE_INTERNAL_SECRET') || '').trim();
    const expectedServiceRoleKey = (Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '').trim();

    if (!expectedInternalSecret && !expectedServiceRoleKey) {
      console.error('[tuvi-interpreter] CRITICAL: Thiếu cả EDGE_INTERNAL_SECRET lẫn SUPABASE_SERVICE_ROLE_KEY!');
      return new Response(JSON.stringify({ error: 'Edge internal authentication is not configured' }), {
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const providedSecret = (req.headers.get('x-edge-internal-secret') || '').trim();
    const authHeader = (req.headers.get('authorization') || '').trim();
    const bearerToken = authHeader.toLowerCase().startsWith('bearer ')
      ? authHeader.slice(7).trim()
      : '';

    const secretValid = Boolean(
      expectedInternalSecret &&
        providedSecret &&
        timingSafeEqualStr(providedSecret, expectedInternalSecret)
    );
    const serviceRoleValid = Boolean(
      expectedServiceRoleKey &&
        bearerToken &&
        timingSafeEqualStr(bearerToken, expectedServiceRoleKey)
    );

    if (!secretValid && !serviceRoleValid) {
      return new Response(JSON.stringify({ error: 'Unauthorized Edge Function call' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { parts, contents, prompt, content, imageUrls, model, generationConfig } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in Supabase Secrets.');
    }

    const requestedModel = typeof model === 'string' ? model.trim() : 'gemini-2.5-flash';
    if (!ALLOWED_MODELS.has(requestedModel)) {
      return new Response(JSON.stringify({ error: `Unsupported model: ${requestedModel}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let requestContents: Array<Record<string, unknown>> = [];

    if (contents && Array.isArray(contents)) {
      requestContents = contents;
    } else if (parts && Array.isArray(parts)) {
      requestContents = [{ role: 'user', parts }];
    } else {
      const currentParts: Array<Record<string, unknown>> = [];
      if (prompt) currentParts.push({ text: prompt });
      if (content) currentParts.push({ text: content });
      if (imageUrls && Array.isArray(imageUrls)) {
        for (const url of imageUrls) {
          if (typeof url === 'string' && /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(url)) {
            const commaIndex = url.indexOf(',');
            if (commaIndex !== -1) {
              const header = url.substring(0, commaIndex);
              const match = header.match(/data:(.*?);base64/i);
              const mimeType = match && match[1] ? match[1] : 'image/jpeg';
              const base64Data = url.substring(commaIndex + 1);
              currentParts.push({
                inlineData: { mimeType, data: base64Data },
              });
            }
          }
        }
      }
      requestContents = [{ role: 'user', parts: currentParts }];
    }

    const targetModel = requestedModel;
    console.log(`[tuvi-interpreter] Calling model: ${targetModel}`);

    const isCarbon = targetModel.includes('carbon');
    const isExpertModel = isCarbon || targetModel.includes('argon') || targetModel.includes('4');
    const isProPreview = isExpertModel || targetModel.includes('3.1') || targetModel.includes('pro');
    const defaultBudget = isCarbon ? 1536 : isExpertModel ? 1024 : isProPreview ? 1024 : 0;

    const finalGenConfig = generationConfig
      ? {
          ...generationConfig,
          maxOutputTokens: Math.min(Number(generationConfig.maxOutputTokens || 14000), 30000),
        }
      : {
          temperature: 0.7,
          maxOutputTokens: isExpertModel ? 28000 : isProPreview ? 12000 : 6000,
          thinkingConfig: {
            thinkingBudget: defaultBudget,
          },
        };

    if (finalGenConfig.thinkingConfig && isProPreview && finalGenConfig.thinkingConfig.thinkingBudget === 0) {
      finalGenConfig.thinkingConfig.thinkingBudget = defaultBudget;
    }

    // Truyền API key qua header x-goog-api-key thay vì query string ?key=
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(targetModel)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: requestContents,
          generationConfig: finalGenConfig,
        }),
        signal: AbortSignal.timeout(55000),
      }
    );

    const rawBody = await response.text();
    let data: Record<string, unknown> = {};
    try {
      data = rawBody ? (JSON.parse(rawBody) as Record<string, unknown>) : {};
    } catch {
      console.error('[tuvi-interpreter] Non-JSON upstream response:', response.status, rawBody.slice(0, 200));
      return new Response(
        JSON.stringify({ error: `Upstream Gemini HTTP ${response.status} (invalid JSON)` }),
        {
          status: response.status >= 400 ? response.status : 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!response.ok || data?.error) {
      const errObj = data?.error as { message?: string } | undefined;
      console.error('[tuvi-interpreter] Gemini API error:', errObj || response.status);
      return new Response(
        JSON.stringify({ error: errObj?.message || `Gemini API HTTP ${response.status}` }),
        {
          status: response.status >= 400 ? response.status : 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const candidates = (data?.candidates as Array<{
      finishReason?: string;
      content?: { parts?: Array<{ thought?: boolean; text?: string }> };
    }>) || [];
    const firstCandidate = candidates[0];
    const finishReason = firstCandidate?.finishReason || 'STOP';
    const resParts = firstCandidate?.content?.parts || [];
    const aiText =
      resParts
        .filter((p) => !p?.thought && typeof p?.text === 'string')
        .map((p) => p.text)
        .join('') ||
      resParts[0]?.text ||
      '';

    if (finishReason === 'SAFETY' || finishReason === 'RECITATION' || finishReason === 'MAX_TOKENS') {
      console.warn(`[tuvi-interpreter] Model ${targetModel} finishReason=${finishReason}, len=${aiText.length}`);
    }

    return new Response(
      JSON.stringify({ result: aiText, model: targetModel, finishReason }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error('[tuvi-interpreter] Server error:', msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
