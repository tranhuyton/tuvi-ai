import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase, verifyEmailToken } from '@/lib/supabaseAdmin';
import {
  activateAndValidateVoucher,
  findActiveClickedVoucherForUser,
} from '@/lib/voucherStore';

export const dynamic = 'force-dynamic';

async function loadChartAndMessages(chartId: string) {
  const { data: chart } = await adminSupabase
    .from('tuvi_charts')
    .select('*')
    .eq('id', chartId)
    .maybeSingle();

  if (!chart) return null;

  const { data: messages } = await adminSupabase
    .from('tuvi_chat_messages')
    .select('*')
    .eq('chart_id', chartId)
    .order('created_at', { ascending: true });

  const { data: ownerProfile } = await adminSupabase
    .from('tuvi_profiles')
    .select('email, full_name')
    .eq('id', chart.user_id)
    .maybeSingle();

  return {
    chart,
    messages: messages || [],
    ownerEmail: ownerProfile?.email || null,
    ownerUserId: chart.user_id || null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, chartId, etoken, userId } = body as {
      code?: string;
      chartId?: string;
      etoken?: string;
      userId?: string;
    };

    // 1. Nếu có mã Voucher từ link Email hoặc từ localStorage
    if (code && code.trim()) {
      const result = await activateAndValidateVoucher(code, { activateTimer: true });

      let chartBundle = null;
      const targetChartId = chartId || result.voucher?.chartId || null;

      if (targetChartId) {
        // Cho phép tải lá số nếu mã voucher hợp lệ hoặc thuộc về chủ lá số đó
        if (result.valid) {
          const loaded = await loadChartAndMessages(targetChartId);
          if (
            loaded &&
            (!result.voucher?.userId || loaded.ownerUserId === result.voucher.userId)
          ) {
            chartBundle = loaded;
          }
        } else if (etoken && verifyEmailToken(`chart:${targetChartId}`, etoken)) {
          chartBundle = await loadChartAndMessages(targetChartId);
        }
      }

      return NextResponse.json({
        success: true,
        valid: result.valid,
        reason: result.reason,
        voucher: result.voucher || null,
        chartBundle,
      });
    }

    // 2. Nếu khách bấm từ Email nhắc nhở +1h (chưa có voucher, xác thực bằng etoken chữ ký HMAC)
    if (chartId && etoken && verifyEmailToken(`chart:${chartId}`, etoken)) {
      const chartBundle = await loadChartAndMessages(chartId);
      const activeVoucher = chartBundle?.ownerUserId
        ? await findActiveClickedVoucherForUser(chartBundle.ownerUserId)
        : null;

      return NextResponse.json({
        success: true,
        valid: Boolean(activeVoucher),
        voucher: activeVoucher,
        chartBundle,
      });
    }

    // 3. Nếu user đang đăng nhập mở lại web trực tiếp -> tự khôi phục voucher đang đếm ngược (nếu còn hạn)
    if (userId) {
      const activeVoucher = await findActiveClickedVoucherForUser(userId);
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
  } catch (err: any) {
    console.error('[API VOUCHER VALIDATE] Lỗi:', err);
    return NextResponse.json(
      { success: false, valid: false, error: err?.message || 'Lỗi kiểm tra mã ưu đãi' },
      { status: 500 }
    );
  }
}
