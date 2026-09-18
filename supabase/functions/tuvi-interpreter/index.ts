import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { parts, contents, prompt, content, imageUrls, model } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in Supabase Secrets.');
    }

    let requestContents: any[] = [];

    // Nếu đã gửi sẵn contents chuẩn của Gemini
    if (contents && Array.isArray(contents)) {
      requestContents = contents;
    } 
    // Nếu gửi mảng parts chuẩn
    else if (parts && Array.isArray(parts)) {
      requestContents = [{ role: 'user', parts }];
    } 
    // Nếu gửi text prompt + content + images
    else {
      const currentParts: any[] = [];
      if (prompt) {
        currentParts.push({ text: prompt });
      }
      if (content) {
        currentParts.push({ text: content });
      }
      if (imageUrls && Array.isArray(imageUrls)) {
        for (const url of imageUrls) {
          if (typeof url === 'string' && url.startsWith('data:image/')) {
            const commaIndex = url.indexOf(',');
            if (commaIndex !== -1) {
              const header = url.substring(0, commaIndex);
              const match = header.match(/data:(.*?);base64/);
              const mimeType = match && match[1] ? match[1] : 'image/jpeg';
              const base64Data = url.substring(commaIndex + 1);
              currentParts.push({
                inlineData: { mimeType, data: base64Data }
              });
            }
          }
        }
      }
      requestContents = [{ role: 'user', parts: currentParts }];
    }

    const targetModel = model || 'gemini-2.5-flash';
    console.log(`[tuvi-interpreter] Calling model: ${targetModel}`);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: requestContents })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error('[tuvi-interpreter] Gemini API error:', data.error);
      return new Response(JSON.stringify({ error: data.error.message || 'Gemini API error' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return new Response(JSON.stringify({ result: aiText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[tuvi-interpreter] Server error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
