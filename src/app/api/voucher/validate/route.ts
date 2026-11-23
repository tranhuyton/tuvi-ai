import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase, verifyEmailToken } from '@/lib/supabaseAdmin';
import { getAuthenticatedUser, isValidUuid } from '@/lib/adminAuth';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';
import {
  activateAndValidateVoucher,
  findActiveClickedVoucherForUser,
} from '@/lib/voucherStore';

export const dynamic = 'force-dynamic';

async function loadChartAndMessages(chartId: string, includePrivateOwnerData: boolean) {
  if (!isValidUuid(chartId)) return null;

  const { data: chart } = await adminSupabase
    .from('tuvi_charts')
    .select('*')
    .eq('id', chartId)
    .maybeSingle();

  if (!chart) return null;

  // Chỉ tải tin nhắn hội thoại riêng tư & ảnh sinh trắc khi caller đã xác thực JWT là chủ sở hữu
  let messages: Array<Record<string, unknown>> = [];
  if (includePrivateOwnerData) {
    const { data: dbMessages } = await adminSupabase
      .from('tuvi_chat_messages')
      .select('*')
      .eq('chart_id', chartId)
      .neq('answer', '__PENDING__')
      .order('created_at', { ascending: true });
    messages = (dbMessages as Array<Record<string, unknown>>) || [];
  }

  let ownerEmail: string | null = null;
  if (includePrivateOwnerData && chart.user_id) {
    const { data: ownerProfile } = await adminSupabase
      .from('tuvi_profiles')
      .select('email')
      .eq('id', chart.user_id)
      .maybeSingle();
    ownerEmail = ownerProfile?.email || null;
  }

  const sanitizedChart = includePrivateOwnerData
    ? chart
    : {
        ...chart,
        user_id: undefined,
        duong_so_data: chart.duong_so_data
          ? {
              ...chart.duong_so_data,
              anhMat: undefined,
              anhTay: undefined,
            }
          : chart.duong_so_data,
      };

  return {
    chart: sanitizedChart,
    messages,
    ownerEmail,
    ownerUserId: includePrivateOwnerData ? chart.user_id || null : null,
    _internalOwnerUserId: chart.user_id || null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `voucher_validate:${ip}`,
      limit: 30,
      windowMs: 60_000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, valid: false, error: 'Quá nhiều yêu cầu kiểm tra ưu đãi.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { code, chartId, etoken } = body as {
      code?: string;
      chartId?: string;
      etoken?: string;
    };

    const authUser = await getAuthenticatedUser(req);
    const safeChartId = isValidUuid(chartId) ? chartId.trim() : null;

    // 1. Nếu có mã Voucher từ link Email hoặc từ localStorage
    if (code && code.trim()) {
      const result = await activateAndValidateVoucher(code, { activateTimer: true });

      let chartBundle = null;
      const targetChartId =
        safeChartId ||
        (result.voucher?.chartId && isValidUuid(result.voucher.chartId)
          ? result.voucher.chartId
          : null);

      const hasValidEtoken = Boolean(
        targetChartId && etoken && verifyEmailToken(`chart:${targetChartId}`, etoken)
      );

      const isOwnerJwt = Boolean(
        authUser && result.voucher?.userId && authUser.id === result.voucher.userId
      );

      if (targetChartId) {
        if (result.valid && result.voucher?.userId) {
          const loaded = await loadChartAndMessages(targetChartId, isOwnerJwt);
          if (loaded && loaded._internalOwnerUserId === result.voucher.userId) {
            const { _internalOwnerUserId: _, ...publicBundle } = loaded;
            void _;
            chartBundle = publicBundle;
          }
        } else if (hasValidEtoken) {
          const loaded = await loadChartAndMessages(targetChartId, isOwnerJwt);
          if (loaded) {
            const { _internalOwnerUserId: _, ...publicBundle } = loaded;
            void _;
            chartBundle = publicBundle;
          }
        }
      }

      // Lọc ẩn cả email lẫn userId khỏi voucher trả về nếu chưa xác thực JWT khớp chủ sở hữu
      const safeVoucher = result.voucher
        ? isOwnerJwt
          ? result.voucher
          : {
              ...result.voucher,
              email: undefined,
              userId: undefined,
            }
        : null;

      return NextResponse.json({
        success: true,
        valid: result.valid,
        reason: result.reason,
        voucher: safeVoucher,
        chartBundle,
      });
    }

    // 2. Nếu khách bấm từ Email nhắc nhở +1h (xác thực bằng etoken chữ ký HMAC có hạn)
    if (safeChartId && etoken && verifyEmailToken(`chart:${safeChartId}`, etoken)) {
      const preCheck = await loadChartAndMessages(safeChartId, false);
      const isOwnerJwt = Boolean(
        authUser && preCheck?._internalOwnerUserId && authUser.id === preCheck._internalOwnerUserId
      );
      const loaded = isOwnerJwt
        ? await loadChartAndMessages(safeChartId, true)
        : preCheck;

      const activeVoucher = loaded?._internalOwnerUserId
        ? await findActiveClickedVoucherForUser(loaded._internalOwnerUserId)
        : null;

      let publicBundle = null;
      if (loaded) {
        const { _internalOwnerUserId: _, ...rest } = loaded;
        void _;
        publicBundle = rest;
      }

      return NextResponse.json({
        success: true,
        valid: Boolean(activeVoucher),
        voucher: activeVoucher
          ? isOwnerJwt
            ? activeVoucher
            : { ...activeVoucher, email: undefined, userId: undefined }
          : null,
        chartBundle: publicBundle,
      });
    }

    // 3. User đang đăng nhập mở lại web trực tiếp -> khôi phục voucher của chính authUser (từ JWT)
    if (authUser?.id) {
      const activeVoucher = await findActiveClickedVoucherForUser(authUser.id);
      return NextResponse.json({
        success: true,
        valid: Boolean(activeVoucher),
        voucher: activeVoucher,
        chartBundle: null,
      });
    }

    return NextResponse.json({
      success: true,
      valid: false,
      voucher: null,
      chartBundle: null,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi kiểm tra mã ưu đãi';
    console.error('[API VOUCHER VALIDATE] Lỗi:', err);
    return NextResponse.json({ success: false, valid: false, error: msg }, { status: 500 });
  }
}
