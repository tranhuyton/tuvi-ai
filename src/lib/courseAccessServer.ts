import { adminSupabase } from '@/lib/supabaseAdmin';
import { getAuthenticatedUser, verifyAdminRequest } from '@/lib/adminAuth';
import { getOrderByCode } from '@/lib/orderStore';
import type { CourseLesson } from '@/lib/courseData';

export const COURSE_AUDIO_BUCKET = 'course-audio';
const SIGNED_URL_TTL_SECONDS = 1800; // 30 phút

export interface CourseAccessResolution {
  unlocked: boolean;
  isAdmin: boolean;
  isTester: boolean;
  orderCode?: string;
  email?: string;
  hoTen?: string;
  paidAt?: string;
  message?: string;
}

/**
 * Xác minh quyền sở hữu khóa học 699k hoàn toàn phía server:
 * 1. Admin JWT / env PIN -> toàn quyền
 * 2. Active Tester -> toàn quyền
 * 3. User JWT có đơn PAID `course_tuvi` (hoặc >= 699.000đ) theo user_id hoặc exact email lowercase
 * 4. Mã đơn TVxxxxx (chỉ chấp nhận nếu đơn KHÔNG gắn userId khác, và nếu đơn gắn userId -> BẮT BUỘC JWT khớp userId đó!)
 */
export async function resolveCourseAccess(
  req: Request,
  orderCodeInput?: string
): Promise<CourseAccessResolution> {
  const adminAuth = await verifyAdminRequest(req);
  if (adminAuth.authorized) {
    return {
      unlocked: true,
      isAdmin: true,
      isTester: false,
      orderCode: 'VIP-ADMIN',
      email: adminAuth.user?.email || 'tonhuytran@gmail.com',
      hoTen: 'Thầy Tôn (Quản trị viên)',
    };
  }

  const authUser = await getAuthenticatedUser(req);
  const authEmail = (authUser?.email || '').trim().toLowerCase();

  // Kiểm tra Active Tester theo JWT
  if (authUser?.id) {
    const { data: tester } = await adminSupabase
      .from('tuvi_testers')
      .select('is_active')
      .or(authEmail ? `user_id.eq.${authUser.id},email.eq.${authEmail}` : `user_id.eq.${authUser.id}`)
      .limit(1)
      .maybeSingle();

    if (tester && tester.is_active !== false) {
      return {
        unlocked: true,
        isAdmin: false,
        isTester: true,
        orderCode: 'VIP-TESTER',
        email: authUser.email,
      };
    }
  }

  // Kiểm tra bằng mã đơn hàng TVxxxxx (chống lấy mã người khác mở khóa ẩn danh!)
  const rawOrderCode = (orderCodeInput || '').trim().toUpperCase();
  if (rawOrderCode) {
    const cleanCode = rawOrderCode.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    if (!/^TV\d{4,8}$/i.test(cleanCode)) {
      return {
        unlocked: false,
        isAdmin: false,
        isTester: false,
        message: 'Mã giao dịch không đúng định dạng (VD: TV123456).',
      };
    }

    const order = await getOrderByCode(cleanCode);
    const isCourseOrder = Boolean(
      order &&
        order.status === 'PAID' &&
        (order.paymentType === 'course_tuvi' || Number(order.amount || 0) >= 699000)
    );

    if (order && isCourseOrder) {
      // Nếu đơn thuộc về một userId cụ thể -> BẮT BUỘC đăng nhập đúng tài khoản đó (chống anonymous unlock!)
      if (order.userId) {
        if (!authUser) {
          return {
            unlocked: false,
            isAdmin: false,
            isTester: false,
            message:
              'Mã giao dịch này đã gắn với tài khoản mua hàng. Quý khách vui lòng đăng nhập đúng email đã đăng ký để mở khóa.',
          };
        }
        if (order.userId !== authUser.id) {
          return {
            unlocked: false,
            isAdmin: false,
            isTester: false,
            message:
              'Mã giao dịch này thuộc về một tài khoản khác. Quý khách vui lòng đăng nhập đúng email đã thanh toán.',
          };
        }
      } else if (!authUser) {
        return {
          unlocked: false,
          isAdmin: false,
          isTester: false,
          message: 'Quý khách vui lòng đăng nhập để khôi phục quyền truy cập khóa học.',
        };
      }

      return {
        unlocked: true,
        isAdmin: false,
        isTester: false,
        orderCode: order.orderCode,
        email: order.email || authUser.email,
        hoTen: order.hoTen,
        paidAt: order.paidAt,
      };
    }
  }

  // Kiểm tra tự động theo tài khoản đang đăng nhập (exact lowercase email, KHÔNG dùng .ilike wildcard!)
  if (authUser?.id) {
    const [byUserRes, byEmailRes] = await Promise.all([
      adminSupabase
        .from('tuvi_orders')
        .select('order_code, email, ho_ten, paid_at, payment_type, amount')
        .eq('status', 'PAID')
        .eq('user_id', authUser.id),
      authEmail
        ? adminSupabase
            .from('tuvi_orders')
            .select('order_code, email, ho_ten, paid_at, payment_type, amount')
            .eq('status', 'PAID')
            .eq('email', authEmail)
        : Promise.resolve({ data: [] as Array<Record<string, unknown>> }),
    ]);

    const candidates = [
      ...((byUserRes.data as Array<Record<string, unknown>>) || []),
      ...((byEmailRes.data as Array<Record<string, unknown>>) || []),
    ];

    const matched = candidates.find(
      (o) => o.payment_type === 'course_tuvi' || Number(o.amount || 0) >= 699000
    );

    if (matched) {
      return {
        unlocked: true,
        isAdmin: false,
        isTester: false,
        orderCode: String(matched.order_code || ''),
        email: String(matched.email || authUser.email || ''),
        hoTen: typeof matched.ho_ten === 'string' ? matched.ho_ten : undefined,
        paidAt: typeof matched.paid_at === 'string' ? matched.paid_at : undefined,
      };
    }
  }

  return {
    unlocked: false,
    isAdmin: false,
    isTester: false,
    message: rawOrderCode
      ? 'Mã giao dịch chưa thanh toán hoặc không phải đơn Khóa học Tử Vi (699.000đ).'
      : 'Tài khoản chưa kích hoạt khóa học.',
  };
}

/**
 * Gắn Signed URL (hạn 30 phút) từ Supabase Storage Private Bucket `course-audio`
 * cho tất cả các chương MP3 của bài học trả phí (Bài 3–24). Bài 1–2 giữ nguyên public URL.
 */
export async function signLessonAudioUrls(lesson: CourseLesson): Promise<CourseLesson> {
  if (lesson.isFreePreview) {
    return lesson;
  }

  const signedChapters = await Promise.all(
    lesson.podcastChapters.map(async (chap, idx) => {
      const rawUrl = chap.audioUrl || `/audio/course/bai-${lesson.number}-chap-${idx + 1}.mp3`;
      const fileName = rawUrl.split('/').pop() || `bai-${lesson.number}-chap-${idx + 1}.mp3`;

      try {
        const { data, error } = await adminSupabase.storage
          .from(COURSE_AUDIO_BUCKET)
          .createSignedUrl(fileName, SIGNED_URL_TTL_SECONDS);

        if (!error && data?.signedUrl) {
          return { ...chap, audioUrl: data.signedUrl };
        }
      } catch (err) {
        console.warn(`[COURSE AUDIO] Không thể ký URL cho ${fileName}:`, err);
      }

      return { ...chap, audioUrl: undefined };
    })
  );

  return {
    ...lesson,
    podcastChapters: signedChapters,
  };
}
