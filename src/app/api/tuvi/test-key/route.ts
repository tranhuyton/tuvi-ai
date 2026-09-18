import { NextRequest, NextResponse } from 'next/server';
import { testGeminiApiKey } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const targetKey = body.apiKey && body.apiKey.trim() ? body.apiKey.trim() : undefined;
    const result = await testGeminiApiKey(targetKey);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
