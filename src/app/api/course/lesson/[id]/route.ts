import { NextRequest, NextResponse } from 'next/server';
import { COURSE_LESSONS } from '@/lib/courseData';
import { resolveCourseAccess, signLessonAudioUrls } from '@/lib/courseAccessServer';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `course_lesson:${ip}`,
      limit: 60,
      windowMs: 60_000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: 'Quá nhiều yêu cầu tải bài học, vui lòng thử lại sau giây lát.' },
        { status: 429 }
      );
    }

    const { id } = await context.params;
    const cleanId = String(id || '').trim().toLowerCase();
    const lesson = COURSE_LESSONS.find((l) => l.id === cleanId);

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy bài giảng này.' },
        { status: 404 }
      );
    }

    // Bài 1 & 2 học thử miễn phí -> trả trực tiếp
    if (lesson.isFreePreview) {
      return NextResponse.json(
        { success: true, lesson },
        { headers: { 'Cache-Control': 'private, max-age=300' } }
      );
    }

    // Bài 3–24: BẮT BUỘC xác thực quyền sở hữu khóa học phía server
    const access = await resolveCourseAccess(req);
    if (!access.unlocked) {
      return NextResponse.json(
        {
          success: false,
          locked: true,
          error: 'Bài giảng này dành riêng cho học viên đã mở khóa Khóa học Tử Vi Thực Chiến (699.000đ).',
        },
        { status: 403 }
      );
    }

    const signedLesson = await signLessonAudioUrls(lesson);
    return NextResponse.json(
      {
        success: true,
        lesson: signedLesson,
        signedAt: Date.now(),
        expiresInSec: 1800,
      },
      { headers: { 'Cache-Control': 'no-store, private' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi tải bài giảng';
    console.error('[COURSE LESSON API] Lỗi:', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
