import { NextRequest, NextResponse } from 'next/server';
import { testGeminiApiKey } from '@/lib/gemini';
import { verifyAdminRequest } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

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
