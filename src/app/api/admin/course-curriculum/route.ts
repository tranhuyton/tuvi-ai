import { NextRequest, NextResponse } from 'next/server';
import { COURSE_LESSONS } from '@/lib/courseData';
import { verifyAdminRequest } from '@/lib/adminAuth';
import { signLessonAudioUrls } from '@/lib/courseAccessServer';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await verifyAdminRequest(req);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const signedLessons = await Promise.all(COURSE_LESSONS.map((l) => signLessonAudioUrls(l)));
    return NextResponse.json(
      { success: true, lessons: signedLessons },
      { headers: { 'Cache-Control': 'no-store, private' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi tải giáo trình Admin';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
