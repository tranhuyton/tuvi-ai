import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase, signEmailToken } from '@/lib/supabaseAdmin';
import { createPersonalVoucher, DripStage } from '@/lib/voucherStore';
import { sendDripFunnelEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// Mốc bắt đầu kích hoạt tự động chăm sóc cho các tài khoản đăng ký mới (từ đợt chạy Meta Ads 31/10/2026)
const RECENT_ENROLLMENT_CUTOFF = '2026-10-31T00:00:00Z';
const MAX_EMAILS_PER_RUN = 12;
const MAX_CROSS_SELL_PER_RUN = 4;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tuvithayton.vn';

const EXCLUDED_ADMIN_EMAILS = new Set([
  'tranhuyton@gmail.com',
  'tonhuytran@gmail.com',
  'diep.anh.12135@gmail.com',
  'diep.anh1205@gmail.com',
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
        : testStage === 'reminder_1h' || testStage === 'course_cross_sell_36h'
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
      ctaCourseUrl: `${SITE_URL}/khoa-hoc?utm_source=email_drip&utm_medium=email&utm_campaign=course_cross_sell_36h`,
      extraFamilyChartNames:
        testStage === 'course_cross_sell_36h' ? ['Nguyễn Minh Khôi', 'Trần Thu Hà'] : undefined,
      unsubscribeUrl: `${SITE_URL}/api/email/unsubscribe?uid=${mockUid}&sig=${unsubSig}`,
    });
    return NextResponse.json({ success: true, mode: 'test_email', testStage, testEmail, result: res });
  }

  const now = new Date();
  const nowMs = now.getTime();
  const vnHour = getVietnamHourDecimal(now);
  // Chỉ gửi các email tặng Voucher (24h, 72h, 6m) và Cross-sell Khóa học trong khung giờ thức (07:30 -> 22:30 giờ VN)
  const isWakingHours = vnHour >= 7.5 && vnHour <= 22.5;

  const oneHourAgoIso = new Date(nowMs - 3600 * 1000).toISOString();
  const sixMonthsStartIso = new Date(nowMs - 210 * 24 * 3600 * 1000).toISOString();
  const sixMonthsEndIso = new Date(nowMs - 180 * 24 * 3600 * 1000).toISOString();

  // 1. Lấy danh sách user mới (từ 31/10/2026 đến cách đây >= 1 giờ), user mốc 6 tháng, đơn PAID và auth.users
  const [
    { data: recentProfiles },
    { data: sixMonthProfiles },
    { data: paidOrders },
    authUsersRes,
  ] = await Promise.all([
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
    adminSupabase
      .from('tuvi_orders')
      .select('user_id, email, chart_id, payment_type, paid_at, created_at')
      .eq('status', 'PAID'),
    adminSupabase.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);

  const seenProfileIds = new Set<string>();
  const profileMap = new Map<string, any>();

  const registerCandidateProfile = (p: any) => {
    if (!p?.id) return;
    seenProfileIds.add(p.id);
    if (!p.email || !p.email.includes('@')) return;
    if (p.email_unsubscribed === true) return;
    if (p.role === 'admin') return;
    if (EXCLUDED_ADMIN_EMAILS.has(p.email.trim().toLowerCase())) return;
    profileMap.set(p.id, p);
  };

  for (const p of [...(recentProfiles || []), ...(sixMonthProfiles || [])]) {
    registerCandidateProfile(p);
  }

  // 1b. Đồng bộ các tài khoản auth.users đăng ký mới nhưng bị thiếu bản ghi trong tuvi_profiles (ví dụ Google OAuth gián đoạn)
  const recentMissingAuthUsers = (authUsersRes?.data?.users || []).filter(
    (u) =>
      u?.id &&
      u?.email &&
      u.created_at >= RECENT_ENROLLMENT_CUTOFF &&
      u.created_at <= oneHourAgoIso &&
      !seenProfileIds.has(u.id)
  );

  if (recentMissingAuthUsers.length > 0) {
    const checkIds = recentMissingAuthUsers.map((u) => u.id);
    const { data: existingRows } = await adminSupabase
      .from('tuvi_profiles')
      .select('id, email, full_name, created_at, email_unsubscribed, role')
      .in('id', checkIds);

    const existingIdSet = new Set<string>();
    for (const row of existingRows || []) {
      existingIdSet.add(row.id);
      registerCandidateProfile(row);
    }

    const trulyMissing = recentMissingAuthUsers.filter((u) => !existingIdSet.has(u.id));
    if (trulyMissing.length > 0) {
      const toUpsert = trulyMissing.map((u) => ({
        id: u.id,
        email: u.email!,
        full_name: u.user_metadata?.full_name || u.user_metadata?.name || null,
        created_at: u.created_at,
        email_unsubscribed: false,
      }));
      if (!dryRun) {
        await adminSupabase.from('tuvi_profiles').upsert(toUpsert, { onConflict: 'id' });
      }
      for (const synth of toUpsert) {
        registerCandidateProfile(synth);
      }
    }
  }

  // 1c. Bổ sung hồ sơ của các khách hàng đã từng thanh toán (kể cả đăng ký trước 31/10/2026) để chăm sóc Cross-sell Khóa Học 699K
  const olderPaidOnlyIds = new Set<string>();
  const missingPaidUserIds = Array.from(
    new Set(
      (paidOrders || [])
        .map((o: any) => o.user_id)
        .filter((uid: any) => Boolean(uid) && !seenProfileIds.has(uid))
    )
  );

  if (missingPaidUserIds.length > 0) {
    const { data: paidProfiles } = await adminSupabase
      .from('tuvi_profiles')
      .select('id, email, full_name, created_at, email_unsubscribed, role')
      .in('id', missingPaidUserIds);

    for (const pp of paidProfiles || []) {
      olderPaidOnlyIds.add(pp.id);
      registerCandidateProfile(pp);
    }
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

  // 2. Lấy đơn hàng PENDING, danh sách Tester, lịch sử Email đã gửi, và Lá số của các ứng viên
  const [
    { data: pendingOrders },
    { data: testers },
    { data: emailLogs },
    { data: candidateCharts },
  ] = await Promise.all([
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
  const paidCourseUserIds = new Set<string>();
  const paidCourseEmails = new Set<string>();
  const latestPaidMsByUser = new Map<string, number>();
  const latestPaidMsByEmail = new Map<string, number>();

  for (const o of paidOrders || []) {
    const cleanOrdEmail = o.email ? o.email.trim().toLowerCase() : '';
    const paidMs = new Date(o.paid_at || o.created_at).getTime();

    if (o.user_id) {
      paidUserIds.add(o.user_id);
      if (!isNaN(paidMs)) {
        const prev = latestPaidMsByUser.get(o.user_id) || 0;
        if (paidMs > prev) latestPaidMsByUser.set(o.user_id, paidMs);
      }
    }
    if (cleanOrdEmail) {
      paidEmails.add(cleanOrdEmail);
      if (!isNaN(paidMs)) {
        const prev = latestPaidMsByEmail.get(cleanOrdEmail) || 0;
        if (paidMs > prev) latestPaidMsByEmail.set(cleanOrdEmail, paidMs);
      }
    }
    if (o.chart_id) paidChartIds.add(o.chart_id);

    if (o.payment_type === 'course_tuvi') {
      if (o.user_id) paidCourseUserIds.add(o.user_id);
      if (cleanOrdEmail) paidCourseEmails.add(cleanOrdEmail);
    }
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
  const latestUpgradedChartByUser = new Map<string, any>();
  const latestFreeChartByUser = new Map<string, any>();
  const freeChartById = new Map<string, any>();
  const rawFreeChartsByUser = new Map<string, any[]>();

  for (const c of candidateCharts || []) {
    const tier = c.duong_so_data?.tier || c.laso_data?.tier || 'free';
    const normName = (c.duong_so_data?.hoTen || '').trim().toLowerCase();
    if (tier === 'pro' || tier === 'expert' || paidChartIds.has(c.id)) {
      usersWithUpgradedChart.add(c.user_id);
      if (!latestUpgradedChartByUser.has(c.user_id)) {
        latestUpgradedChartByUser.set(c.user_id, c);
      }
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
      if (!rawFreeChartsByUser.has(c.user_id)) {
        rawFreeChartsByUser.set(c.user_id, []);
      }
      rawFreeChartsByUser.get(c.user_id)!.push(c);
    }
  }

  // Lọc danh sách tên các lá số người thân (Bản Miễn Phí) chưa nâng cấp của từng user
  const extraFreeChartNamesByUser = new Map<string, string[]>();
  for (const [uid, freeList] of rawFreeChartsByUser.entries()) {
    const upgradedNames = upgradedNamesByUser.get(uid) || new Set<string>();
    const seenLower = new Set<string>();
    const names: string[] = [];
    for (const fc of freeList) {
      const display = (fc.duong_so_data?.hoTen || '').trim();
      const lower = display.toLowerCase();
      if (!display || upgradedNames.has(lower) || seenLower.has(lower)) continue;
      seenLower.add(lower);
      names.push(display);
    }
    if (names.length > 0) {
      extraFreeChartNamesByUser.set(uid, names);
    }
  }

  // Nếu khách đã mua 1 lá số nhưng sau đó lập thêm lá số người thân (Bản Miễn Phí) và từng bấm mở QR (PENDING) mà chưa thanh toán -> Vẫn gửi mã ưu đãi cho lá số đang chờ đó
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

  // 3. Phân loại từng khách hàng vào đúng mốc chăm sóc
  interface QueuedTask {
    profile: any;
    stage: DripStage;
    ageHours: number;
    chart: any | null;
    extraFamilyChartNames?: string[];
    sortPriority: number;
    paidAnchorMs: number;
  }

  const queue: QueuedTask[] = [];

  for (const profile of profileMap.values()) {
    const cleanEmail = profile.email.trim().toLowerCase();
    if (testerEmails.has(cleanEmail)) continue;

    const createdMs = new Date(profile.created_at).getTime();
    if (isNaN(createdMs)) continue;

    const ageHours = (nowMs - createdMs) / 3600000;
    const logInfo = logsByUser.get(profile.id) || { stages: new Set<string>(), lastSentMs: 0 };
    const hoursSinceLastEmail = logInfo.lastSentMs
      ? (nowMs - logInfo.lastSentMs) / 3600000
      : Infinity;

    const unpaidPendingChart = unpaidPendingFreeChartByUser.get(profile.id) || null;
    const hasBoughtBefore =
      paidUserIds.has(profile.id) ||
      paidEmails.has(cleanEmail) ||
      usersWithUpgradedChart.has(profile.id);
    const hasBoughtCourse =
      paidCourseUserIds.has(profile.id) || paidCourseEmails.has(cleanEmail);

    // Nhánh A: Khách ĐÃ MUA Luận Giải / Câu Hỏi
    if (hasBoughtBefore) {
      let paidUserStage: DripStage | null = null;
      let targetChart: any | null = null;

      // A1. Nếu khách mới (từ 31/10) đang có lá số người thân bấm mở QR dở dang (PENDING) thì ưu tiên tặng mã giảm cho lá số đó trước
      if (!olderPaidOnlyIds.has(profile.id) && unpaidPendingChart) {
        if (
          ageHours >= 72 &&
          ageHours < 14 * 24 &&
          isWakingHours &&
          !logInfo.stages.has('voucher_30_72h') &&
          hoursSinceLastEmail >= 24
        ) {
          paidUserStage = 'voucher_30_72h';
          targetChart = unpaidPendingChart;
        } else if (
          ageHours >= 24 &&
          ageHours < 68 &&
          isWakingHours &&
          !logInfo.stages.has('voucher_20_24h') &&
          !logInfo.stages.has('voucher_30_72h') &&
          hoursSinceLastEmail >= 12
        ) {
          paidUserStage = 'voucher_20_24h';
          targetChart = unpaidPendingChart;
        }
      }

      // A2. Nếu chưa mua Khóa Học 699K và đã qua tối thiểu 36 giờ kể từ lúc thanh toán bài luận -> Gửi thư ngỏ Khóa Học Tử Vi Thực Chiến (1 lần duy nhất)
      const paidAnchorMs =
        latestPaidMsByUser.get(profile.id) ||
        latestPaidMsByEmail.get(cleanEmail) ||
        createdMs;
      const hoursSincePaid = (nowMs - paidAnchorMs) / 3600000;

      if (
        !paidUserStage &&
        !hasBoughtCourse &&
        isWakingHours &&
        !logInfo.stages.has('course_cross_sell_36h') &&
        hoursSinceLastEmail >= 24 &&
        hoursSincePaid >= 36 &&
        hoursSincePaid < 180 * 24
      ) {
        paidUserStage = 'course_cross_sell_36h';
        targetChart =
          latestUpgradedChartByUser.get(profile.id) ||
          latestFreeChartByUser.get(profile.id) ||
          null;
      }

      if (paidUserStage) {
        queue.push({
          profile,
          stage: paidUserStage,
          ageHours: Number(ageHours.toFixed(2)),
          chart: targetChart,
          extraFamilyChartNames: extraFreeChartNamesByUser.get(profile.id),
          sortPriority: paidUserStage === 'course_cross_sell_36h' ? 2 : 1,
          paidAnchorMs,
        });
      }
      continue;
    }

    // Nhánh B: Khách CHƯA MUA bất kỳ gói nào (Lead mới từ 31/10 hoặc hội ngộ 6 tháng)
    if (olderPaidOnlyIds.has(profile.id)) continue;

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
        chart: latestFreeChartByUser.get(profile.id) || null,
        sortPriority: 1,
        paidAnchorMs: 0,
      });
    }
  }

  // Ưu tiên tuyệt đối cho Lead mới (sortPriority = 1), sau đó mới tới Cross-sell Khóa Học (ưu tiên khách mua gần nhất trước)
  queue.sort((a, b) => {
    if (a.sortPriority !== b.sortPriority) return a.sortPriority - b.sortPriority;
    if (a.stage === 'course_cross_sell_36h' && b.stage === 'course_cross_sell_36h') {
      return b.paidAnchorMs - a.paidAnchorMs;
    }
    return 0;
  });

  const batch: QueuedTask[] = [];
  let crossSellInBatch = 0;
  for (const task of queue) {
    if (batch.length >= MAX_EMAILS_PER_RUN) break;
    if (task.stage === 'course_cross_sell_36h') {
      if (crossSellInBatch >= MAX_CROSS_SELL_PER_RUN) continue;
      crossSellInBatch++;
    }
    batch.push(task);
  }

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
        extraFamilyCharts: item.extraFamilyChartNames || [],
      })),
    });
  }

  // 4. Thực thi gửi Email và cấp Voucher (có khóa chống gửi trùng bằng UNIQUE(user_id, stage))
  const results: any[] = [];

  for (const item of batch) {
    const { profile, stage, chart, extraFamilyChartNames } = item;
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
    if (stage !== 'reminder_1h' && stage !== 'course_cross_sell_36h' && !voucherCode) {
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
    const ctaCourseUrl = `${SITE_URL}/khoa-hoc?utm_source=email_drip&utm_medium=email&utm_campaign=course_cross_sell_36h`;
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
      ctaCourseUrl,
      extraFamilyChartNames,
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
