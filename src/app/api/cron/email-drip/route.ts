import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase, signEmailToken } from '@/lib/supabaseAdmin';
import { createPersonalVoucher, DripStage } from '@/lib/voucherStore';
import { sendDripFunnelEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Mốc bắt đầu kích hoạt tự động chăm sóc cho các tài khoản đăng ký mới (từ đợt chạy Meta Ads 31/10/2026)
const RECENT_ENROLLMENT_CUTOFF = '2026-10-31T00:00:00Z';
const MAX_EMAILS_PER_RUN = 12;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tuvithayton.vn';

const EXCLUDED_ADMIN_EMAILS = new Set([
  'tranhuyton@gmail.com',
  'tonhuytran@gmail.com',
  'diep.anh.12135@gmail.com',
]);

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET || 'tuvi_drip_cron_2026_thayton';
  const headerSecret = req.headers.get('x-cron-secret');
  const authHeader = req.headers.get('authorization');
  const pin = req.headers.get('x-admin-pin') || req.nextUrl.searchParams.get('pin');
  const validPins = [process.env.ADMIN_PIN || 'thayton2026', '0935058688', 'thayton2026'];

  if (headerSecret && headerSecret === cronSecret) return true;
  if (authHeader && authHeader === `Bearer ${cronSecret}`) return true;
  if (pin && validPins.includes(pin)) return true;
  return false;
}

function getVietnamHourDecimal(date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date);
  const hour = Number(parts.find((p) => p.type === 'hour')?.value || 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value || 0);
  return hour + minute / 60;
}

function extractChartSummary(chart: any) {
  if (!chart) return null;
  const ds = chart.duong_so_data || {};
  const ls = chart.laso_data || {};
  let chinhTinhMenh = '';
  if (Array.isArray(ls.cungs) && typeof ls.menhCungIdx === 'number') {
    const menhCung = ls.cungs[ls.menhCungIdx];
    if (menhCung && Array.isArray(menhCung.chinhTinh)) {
      const stars = menhCung.chinhTinh.map((s: any) => s.ten).filter(Boolean);
      chinhTinhMenh = stars.length > 0 ? stars.join(', ') : 'Vô Chính Diệu';
    }
  }
  return {
    hoTen: ds.hoTen || '',
    namDuong: ds.namDuong ? Number(ds.namDuong) : undefined,
    gioiTinh: ds.gioiTinh || '',
    namCanChi: ls.namCanChi || '',
    banMenh: ls.banMenh || '',
    chinhTinhMenh,
    namXem: ls.namXem || ds.namXem || new Date().getFullYear(),
  };
}

async function runDripJob(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dryRun = req.nextUrl.searchParams.get('dryRun') === 'true';
  const testEmail = req.nextUrl.searchParams.get('testEmail')?.trim();
  const testStage = (req.nextUrl.searchParams.get('testStage') || 'voucher_20_24h') as DripStage;

  // Chế độ gửi thử nghiệm 1 email mẫu cho Admin kiểm tra giao diện thật
  if (testEmail && testEmail.includes('@')) {
    const mockUid = '00000000-0000-0000-0000-000000000000';
    const unsubSig = signEmailToken(`unsub:${mockUid}`);
    const sampleCode =
      testStage === 'voucher_20_24h'
        ? 'TV20-DEMO88'
        : testStage === 'reminder_1h'
        ? null
        : 'TV30-DEMO99';
    const qs = sampleCode ? `?voucher=${sampleCode}` : '';
    const res = await sendDripFunnelEmail({
      stage: testStage,
      recipientEmail: testEmail,
      customerName: 'Quý khách Thử Nghiệm',
      chartSummary: {
        hoTen: 'Nguyễn Văn An',
        namDuong: 1988,
        gioiTinh: 'Nam',
        namCanChi: 'Mậu Thìn',
        banMenh: 'Đại Lâm Mộc',
        chinhTinhMenh: 'Tử Vi, Thiên Phủ',
        namXem: new Date().getFullYear(),
      },
      voucherCode: sampleCode,
      ctaBaseUrl: `${SITE_URL}/${qs}`,
      ctaProUrl: `${SITE_URL}/${qs ? `${qs}&pkg=pro` : '?pkg=pro'}`,
      ctaExpertUrl: `${SITE_URL}/${qs ? `${qs}&pkg=expert` : '?pkg=expert'}`,
      unsubscribeUrl: `${SITE_URL}/api/email/unsubscribe?uid=${mockUid}&sig=${unsubSig}`,
    });
    return NextResponse.json({ success: true, mode: 'test_email', testStage, testEmail, result: res });
  }

  const now = new Date();
  const nowMs = now.getTime();
  const vnHour = getVietnamHourDecimal(now);
  // Chỉ gửi các email tặng Voucher (24h, 72h, 6m) trong khung giờ thức (07:30 -> 22:30 giờ VN)
  const isWakingHours = vnHour >= 7.5 && vnHour <= 22.5;

  const oneHourAgoIso = new Date(nowMs - 3600 * 1000).toISOString();
  const sixMonthsStartIso = new Date(nowMs - 210 * 24 * 3600 * 1000).toISOString();
  const sixMonthsEndIso = new Date(nowMs - 180 * 24 * 3600 * 1000).toISOString();

  // 1. Lấy danh sách user mới (từ 31/10/2026 đến cách đây >= 1 giờ) & user mốc 6 tháng (180-210 ngày)
  const [{ data: recentProfiles }, { data: sixMonthProfiles }] = await Promise.all([
    adminSupabase
      .from('tuvi_profiles')
      .select('id, email, full_name, created_at, email_unsubscribed, role')
      .gte('created_at', RECENT_ENROLLMENT_CUTOFF)
      .lte('created_at', oneHourAgoIso)
      .order('created_at', { ascending: true }),
    adminSupabase
      .from('tuvi_profiles')
      .select('id, email, full_name, created_at, email_unsubscribed, role')
      .gte('created_at', sixMonthsStartIso)
      .lte('created_at', sixMonthsEndIso)
      .order('created_at', { ascending: true }),
  ]);

  const profileMap = new Map<string, any>();
  for (const p of [...(recentProfiles || []), ...(sixMonthProfiles || [])]) {
    if (!p?.id || !p?.email || !p.email.includes('@')) continue;
    if (p.email_unsubscribed === true) continue;
    if (p.role === 'admin') continue;
    if (EXCLUDED_ADMIN_EMAILS.has(p.email.trim().toLowerCase())) continue;
    profileMap.set(p.id, p);
  }

  const candidateIds = Array.from(profileMap.keys());
  if (candidateIds.length === 0) {
    return NextResponse.json({
      success: true,
      vnHour: Number(vnHour.toFixed(2)),
      isWakingHours,
      candidates: 0,
      sent: 0,
      details: [],
    });
  }

  // 2. Lấy toàn bộ đơn hàng PAID & PENDING, danh sách Tester, lịch sử Email đã gửi, và Lá số của các ứng viên
  const [
    { data: paidOrders },
    { data: pendingOrders },
    { data: testers },
    { data: emailLogs },
    { data: candidateCharts },
  ] = await Promise.all([
    adminSupabase.from('tuvi_orders').select('user_id, email, chart_id').eq('status', 'PAID'),
    adminSupabase
      .from('tuvi_orders')
      .select('user_id, chart_id, created_at')
      .eq('status', 'PENDING')
      .in('payment_type', ['reading_vip', 'reading_expert'])
      .in('user_id', candidateIds)
      .order('created_at', { ascending: true }),
    adminSupabase.from('tuvi_testers').select('email'),
    adminSupabase
      .from('tuvi_email_logs')
      .select('user_id, stage, sent_at, status')
      .in('user_id', candidateIds),
    adminSupabase
      .from('tuvi_charts')
      .select('id, user_id, title, duong_so_data, laso_data, created_at')
      .in('user_id', candidateIds)
      .order('created_at', { ascending: false }),
  ]);

  const paidUserIds = new Set<string>();
  const paidEmails = new Set<string>();
  const paidChartIds = new Set<string>();
  for (const o of paidOrders || []) {
    if (o.user_id) paidUserIds.add(o.user_id);
    if (o.email) paidEmails.add(o.email.trim().toLowerCase());
    if (o.chart_id) paidChartIds.add(o.chart_id);
  }

  const testerEmails = new Set<string>(
    (testers || []).map((t: any) => (t.email || '').trim().toLowerCase()).filter(Boolean)
  );

  const logsByUser = new Map<string, { stages: Set<string>; lastSentMs: number }>();
  for (const log of emailLogs || []) {
    if (!logsByUser.has(log.user_id)) {
      logsByUser.set(log.user_id, { stages: new Set(), lastSentMs: 0 });
    }
    const entry = logsByUser.get(log.user_id)!;
    entry.stages.add(log.stage);
    const sentMs = log.sent_at ? new Date(log.sent_at).getTime() : 0;
    if (sentMs > entry.lastSentMs) entry.lastSentMs = sentMs;
  }

  const usersWithUpgradedChart = new Set<string>();
  const upgradedNamesByUser = new Map<string, Set<string>>();
  const latestFreeChartByUser = new Map<string, any>();
  const freeChartById = new Map<string, any>();
  for (const c of candidateCharts || []) {
    const tier = c.duong_so_data?.tier || c.laso_data?.tier || 'free';
    const normName = (c.duong_so_data?.hoTen || '').trim().toLowerCase();
    if (tier === 'pro' || tier === 'expert' || paidChartIds.has(c.id)) {
      usersWithUpgradedChart.add(c.user_id);
      if (normName) {
        if (!upgradedNamesByUser.has(c.user_id)) {
          upgradedNamesByUser.set(c.user_id, new Set());
        }
        upgradedNamesByUser.get(c.user_id)!.add(normName);
      }
    } else {
      freeChartById.set(c.id, c);
      if (!latestFreeChartByUser.has(c.user_id)) {
        latestFreeChartByUser.set(c.user_id, c);
      }
    }
  }

  // Nếu khách đã mua 1 lá số nhưng sau đó lập thêm lá số người thân (Bản Miễn Phí) và từng bấm mở QR (PENDING) mà chưa thanh toán (ví dụ: Trần Đức Thọ) -> Vẫn gửi mã ưu đãi cho lá số đang chờ đó!
  const unpaidPendingFreeChartByUser = new Map<string, any>();
  for (const po of pendingOrders || []) {
    if (po.user_id && po.chart_id && freeChartById.has(po.chart_id)) {
      const candChart = freeChartById.get(po.chart_id);
      const candName = (candChart?.duong_so_data?.hoTen || '').trim().toLowerCase();
      const alreadyUpgradedNames = upgradedNamesByUser.get(po.user_id);
      if (candName && alreadyUpgradedNames && alreadyUpgradedNames.has(candName)) {
        continue;
      }
      if (!unpaidPendingFreeChartByUser.has(po.user_id)) {
        unpaidPendingFreeChartByUser.set(po.user_id, candChart);
      }
    }
  }

  // 3. Phân loại từng khách hàng chưa mua vào đúng mốc thời gian
  interface QueuedTask {
    profile: any;
    stage: DripStage;
    ageHours: number;
    chart: any | null;
  }

  const queue: QueuedTask[] = [];

  for (const profile of profileMap.values()) {
    const cleanEmail = profile.email.trim().toLowerCase();
    if (testerEmails.has(cleanEmail)) continue;

    const unpaidPendingChart = unpaidPendingFreeChartByUser.get(profile.id) || null;
    const hasBoughtBefore =
      paidUserIds.has(profile.id) ||
      paidEmails.has(cleanEmail) ||
      usersWithUpgradedChart.has(profile.id);

    // Chốt chặn Stop-on-Purchase: Nếu đã mua rồi và KHÔNG có lá số Miễn Phí nào khác đang chờ thanh toán QR (PENDING) -> Bỏ qua
    if (hasBoughtBefore && !unpaidPendingChart) continue;

    const createdMs = new Date(profile.created_at).getTime();
    if (isNaN(createdMs)) continue;

    const ageHours = (nowMs - createdMs) / 3600000;
    const logInfo = logsByUser.get(profile.id) || { stages: new Set<string>(), lastSentMs: 0 };
    const hoursSinceLastEmail = logInfo.lastSentMs
      ? (nowMs - logInfo.lastSentMs) / 3600000
      : Infinity;

    let targetStage: DripStage | null = null;

    if (
      ageHours >= 180 * 24 &&
      ageHours < 210 * 24 &&
      isWakingHours &&
      !logInfo.stages.has('voucher_30_6m') &&
      hoursSinceLastEmail >= 72
    ) {
      targetStage = 'voucher_30_6m';
    } else if (
      ageHours >= 72 &&
      ageHours < 14 * 24 &&
      isWakingHours &&
      !logInfo.stages.has('voucher_30_72h') &&
      hoursSinceLastEmail >= 24
    ) {
      targetStage = 'voucher_30_72h';
    } else if (
      ageHours >= 24 &&
      ageHours < 68 &&
      isWakingHours &&
      !logInfo.stages.has('voucher_20_24h') &&
      !logInfo.stages.has('voucher_30_72h') &&
      hoursSinceLastEmail >= 12
    ) {
      targetStage = 'voucher_20_24h';
    } else if (
      ageHours >= 1 &&
      ageHours < 20 &&
      logInfo.stages.size === 0
    ) {
      targetStage = 'reminder_1h';
    }

    if (targetStage) {
      queue.push({
        profile,
        stage: targetStage,
        ageHours: Number(ageHours.toFixed(2)),
        chart: unpaidPendingChart || latestFreeChartByUser.get(profile.id) || null,
      });
    }
  }

  const batch = queue.slice(0, MAX_EMAILS_PER_RUN);

  if (dryRun) {
    return NextResponse.json({
      success: true,
      dryRun: true,
      vnHour: Number(vnHour.toFixed(2)),
      isWakingHours,
      totalCandidatesChecked: candidateIds.length,
      eligibleCount: queue.length,
      batchCount: batch.length,
      preview: batch.map((item) => ({
        userId: item.profile.id,
        email: item.profile.email,
        fullName: item.profile.full_name,
        stage: item.stage,
        ageHours: item.ageHours,
        chartTitle: item.chart?.title || null,
      })),
    });
  }

  // 4. Thực thi gửi Email và cấp Voucher (có khóa chống gửi trùng bằng UNIQUE(user_id, stage))
  const results: any[] = [];

  for (const item of batch) {
    const { profile, stage, chart } = item;
    const chartId: string | null = chart?.id || null;

    // Khóa bản ghi trước trong tuvi_email_logs (nếu cron khác đã chạy song song thì lệnh insert sẽ báo trùng và bỏ qua an toàn)
    const { data: lockRow, error: lockErr } = await adminSupabase
      .from('tuvi_email_logs')
      .insert({
        user_id: profile.id,
        email: profile.email.trim().toLowerCase(),
        stage,
        chart_id: chartId,
        status: 'SENDING',
      })
      .select('id')
      .maybeSingle();

    if (lockErr || !lockRow) {
      results.push({
        email: profile.email,
        stage,
        skipped: true,
        reason: lockErr?.message || 'Already locked/sent',
      });
      continue;
    }

    let voucherCode: string | null = null;
    if (stage === 'voucher_20_24h') {
      const created = await createPersonalVoucher({
        userId: profile.id,
        email: profile.email,
        chartId,
        stage: 'voucher_20_24h',
        discountPercent: 20,
        durationHours: 12,
        hardCeilingHours: 48,
      });
      voucherCode = created?.code || null;
    } else if (stage === 'voucher_30_72h') {
      const created = await createPersonalVoucher({
        userId: profile.id,
        email: profile.email,
        chartId,
        stage: 'voucher_30_72h',
        discountPercent: 30,
        durationHours: 6,
        hardCeilingHours: 48,
      });
      voucherCode = created?.code || null;
    } else if (stage === 'voucher_30_6m') {
      const created = await createPersonalVoucher({
        userId: profile.id,
        email: profile.email,
        chartId,
        stage: 'voucher_30_6m',
        discountPercent: 30,
        durationHours: 6,
        hardCeilingHours: 72,
      });
      voucherCode = created?.code || null;
    }

    // Nếu là mốc cần voucher mà không sinh được mã thì hoàn tác khóa để lần sau thử lại
    if (stage !== 'reminder_1h' && !voucherCode) {
      await adminSupabase.from('tuvi_email_logs').delete().eq('id', lockRow.id);
      results.push({ email: profile.email, stage, success: false, error: 'Voucher creation failed' });
      continue;
    }

    // Xây dựng link 1-chạm mở thẳng lá số + tự áp mã giảm giá
    const queryParts: string[] = [];
    if (chartId) {
      queryParts.push(`chartId=${encodeURIComponent(chartId)}`);
      if (!voucherCode) {
        const etoken = signEmailToken(`chart:${chartId}`);
        queryParts.push(`etoken=${etoken}`);
      }
    }
    if (voucherCode) {
      queryParts.push(`voucher=${encodeURIComponent(voucherCode)}`);
    }

    const baseQuery = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
    const ctaBaseUrl = `${SITE_URL}/${baseQuery}`;
    const ctaProUrl = `${SITE_URL}/${baseQuery ? `${baseQuery}&pkg=pro` : '?pkg=pro'}`;
    const ctaExpertUrl = `${SITE_URL}/${baseQuery ? `${baseQuery}&pkg=expert` : '?pkg=expert'}`;
    const unsubSig = signEmailToken(`unsub:${profile.id}`);
    const unsubscribeUrl = `${SITE_URL}/api/email/unsubscribe?uid=${profile.id}&sig=${unsubSig}`;

    const mailRes = await sendDripFunnelEmail({
      stage,
      recipientEmail: profile.email,
      customerName: profile.full_name || 'Quý khách',
      chartId,
      chartSummary: extractChartSummary(chart),
      voucherCode,
      ctaBaseUrl,
      ctaProUrl,
      ctaExpertUrl,
      unsubscribeUrl,
    });

    if (mailRes.success && !mailRes.simulated) {
      await adminSupabase
        .from('tuvi_email_logs')
        .update({
          status: 'SENT',
          voucher_code: voucherCode,
          message_id: mailRes.messageId || null,
        })
        .eq('id', lockRow.id);

      results.push({
        email: profile.email,
        stage,
        voucherCode,
        status: 'SENT',
        messageId: mailRes.messageId,
      });
    } else if (mailRes.simulated) {
      // Nếu môi trường chưa cấu hình SMTP thật, xóa khóa để không đánh dấu giả là đã gửi thật
      await adminSupabase.from('tuvi_email_logs').delete().eq('id', lockRow.id);
      if (voucherCode) {
        await adminSupabase.from('tuvi_vouchers').delete().eq('code', voucherCode);
      }
      results.push({
        email: profile.email,
        stage,
        status: 'SIMULATED_SKIPPED',
        note: 'Chưa cấu hình GMAIL_APP_PASS / RESEND_API_KEY trên môi trường hiện tại',
      });
    } else {
      await adminSupabase.from('tuvi_email_logs').delete().eq('id', lockRow.id);
      if (voucherCode) {
        await adminSupabase.from('tuvi_vouchers').delete().eq('code', voucherCode);
      }
      results.push({
        email: profile.email,
        stage,
        status: 'FAILED',
        error: mailRes.error || 'Unknown send error',
      });
    }
  }

  return NextResponse.json({
    success: true,
    vnHour: Number(vnHour.toFixed(2)),
    isWakingHours,
    eligibleTotal: queue.length,
    processedCount: results.length,
    results,
  });
}

export async function GET(req: NextRequest) {
  return runDripJob(req);
}

export async function POST(req: NextRequest) {
  return runDripJob(req);
}
