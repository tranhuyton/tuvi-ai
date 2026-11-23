import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabaseAdmin';
import { verifyAdminRequest } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

async function fetchTonyEnglishIdsForUserIds(userIds: string[]): Promise<Set<string>> {
  const result = new Set<string>();
  const uniqueIds = Array.from(new Set(userIds.filter(Boolean)));
  const CHUNK_SIZE = 200;
  for (let i = 0; i < uniqueIds.length; i += CHUNK_SIZE) {
    const chunk = uniqueIds.slice(i, i + CHUNK_SIZE);
    const { data, error } = await adminSupabase
      .from('profiles')
      .select('id')
      .in('id', chunk);
    if (!error && data) {
      for (const row of data as Array<{ id: string }>) {
        if (row.id) result.add(row.id);
      }
    }
  }
  return result;
}

async function fetchAllRows<T>(
  buildQuery: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>,
  pageSize = 1000,
  maxRows = 10000
): Promise<T[]> {
  const all: T[] = [];
  for (let offset = 0; offset < maxRows; offset += pageSize) {
    const { data, error } = await buildQuery(offset, offset + pageSize - 1);
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < pageSize) break;
  }
  return all;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Không có quyền truy cập quản trị' }, { status: 401 });
    }

    const { getAllOrders } = await import('@/lib/orderStore');

    // Truy vấn song song có phân trang thực (tránh PostgREST mặc định cắt ở 1.000 dòng)
    const [
      profiles,
      rawCharts,
      readingIds,
      anhMatIds,
      anhTayIds,
      messages,
      orders,
    ] = await Promise.all([
      fetchAllRows<{ id: string; email: string | null; full_name: string | null; phone: string | null; created_at: string }>(
        (from, to) =>
          adminSupabase
            .from('tuvi_profiles')
            .select('id, email, full_name, phone, created_at')
            .order('created_at', { ascending: false })
            .range(from, to)
      ),
      fetchAllRows<Record<string, unknown>>((from, to) =>
        adminSupabase
          .from('tuvi_charts')
          .select(
            'id, user_id, title, created_at, updated_at, hoTen:duong_so_data->>hoTen, gioiTinh:duong_so_data->>gioiTinh, ngayDuong:duong_so_data->ngayDuong, thangDuong:duong_so_data->thangDuong, namDuong:duong_so_data->namDuong, gioSinhVal:duong_so_data->>gioSinhVal, namXem:duong_so_data->namXem, tier:duong_so_data->>tier, chieuCao:duong_so_data->chieuCao, canNang:duong_so_data->canNang, thongTinThem:duong_so_data->>thongTinThem, lasoTier:laso_data->>tier'
          )
          .order('created_at', { ascending: false })
          .range(from, to)
      ),
      fetchAllRows<{ id: string }>((from, to) =>
        adminSupabase
          .from('tuvi_charts')
          .select('id')
          .not('reading_html', 'is', null)
          .neq('reading_html', '')
          .range(from, to)
      ),
      fetchAllRows<{ id: string }>((from, to) =>
        adminSupabase
          .from('tuvi_charts')
          .select('id')
          .not('duong_so_data->>anhMat', 'is', null)
          .neq('duong_so_data->>anhMat', '')
          .range(from, to)
      ),
      fetchAllRows<{ id: string }>((from, to) =>
        adminSupabase
          .from('tuvi_charts')
          .select('id')
          .not('duong_so_data->>anhTay', 'is', null)
          .neq('duong_so_data->>anhTay', '')
          .range(from, to)
      ),
      fetchAllRows<{
        id: string;
        chart_id: string | null;
        user_id: string | null;
        question: string;
        answer: string;
        created_at: string;
      }>((from, to) =>
        adminSupabase
          .from('tuvi_chat_messages')
          .select('id, chart_id, user_id, question, answer, created_at')
          .order('created_at', { ascending: false })
          .range(from, to)
      ),
      getAllOrders(),
    ]);

    // Lọc chính xác học viên TonyEnglish theo từng chunk 200 ID (không bao giờ bị cắt ở 1.000 dòng!)
    const tonyProfileIdSet = await fetchTonyEnglishIdsForUserIds(profiles.map((p) => p.id));

    const readingIdSet = new Set(readingIds.map((r) => r.id));
    const anhMatIdSet = new Set(anhMatIds.map((r) => r.id));
    const anhTayIdSet = new Set(anhTayIds.map((r) => r.id));

    const profileMap = new Map<string, { email?: string; full_name?: string }>();
    for (const u of profiles) {
      profileMap.set(u.id, { email: u.email || undefined, full_name: u.full_name || undefined });
    }

    const chartCountByUser = new Map<string, number>();
    const chartTitleMap = new Map<string, string>();
    for (const c of rawCharts) {
      const uid = typeof c.user_id === 'string' ? c.user_id : '';
      const cid = String(c.id || '');
      if (uid) {
        chartCountByUser.set(uid, (chartCountByUser.get(uid) || 0) + 1);
      }
      chartTitleMap.set(cid, String(c.title || c.hoTen || ''));
    }

    const msgCountByUser = new Map<string, number>();
    const msgCountByChart = new Map<string, number>();
    for (const m of messages) {
      if (m.user_id) {
        msgCountByUser.set(m.user_id, (msgCountByUser.get(m.user_id) || 0) + 1);
      }
      if (m.chart_id) {
        msgCountByChart.set(m.chart_id, (msgCountByChart.get(m.chart_id) || 0) + 1);
      }
    }

    const formattedUsers = profiles
      .filter((u) => !tonyProfileIdSet.has(u.id) || (chartCountByUser.get(u.id) || 0) > 0)
      .map((u) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        phone: u.phone || '',
        created_at: u.created_at,
        charts_count: chartCountByUser.get(u.id) || 0,
        messages_count: msgCountByUser.get(u.id) || 0,
      }));

    const formattedCharts = rawCharts.map((c) => {
      const cid = String(c.id || '');
      const uid = typeof c.user_id === 'string' ? c.user_id : '';
      const resolvedTier = String(c.tier || c.lasoTier || 'free');
      const userInfo = uid ? profileMap.get(uid) : undefined;
      return {
        id: cid,
        user_id: uid,
        title: String(c.title || ''),
        duong_so_data: {
          hoTen: String(c.hoTen || c.title || ''),
          gioiTinh: String(c.gioiTinh || 'Nam'),
          ngayDuong: Number(c.ngayDuong) || 1,
          thangDuong: Number(c.thangDuong) || 1,
          namDuong: Number(c.namDuong) || 1990,
          gioSinhVal: String(c.gioSinhVal ?? '0'),
          namXem: c.namXem ? Number(c.namXem) : undefined,
          tier: resolvedTier,
          chieuCao: c.chieuCao ? Number(c.chieuCao) : undefined,
          canNang: c.canNang ? Number(c.canNang) : undefined,
          thongTinThem: c.thongTinThem ? String(c.thongTinThem) : undefined,
          anhMat: anhMatIdSet.has(cid) ? '__HAS_IMAGE__' : undefined,
          anhTay: anhTayIdSet.has(cid) ? '__HAS_IMAGE__' : undefined,
        },
        laso_data: { tier: resolvedTier },
        created_at: String(c.created_at || ''),
        updated_at: String(c.updated_at || ''),
        has_reading: readingIdSet.has(cid),
        message_count: msgCountByChart.get(cid) || 0,
        user_name: userInfo?.full_name || '',
        user_email: userInfo?.email || '',
      };
    });

    const formattedMessages = messages.map((m) => {
      const userInfo = m.user_id ? profileMap.get(m.user_id) : undefined;
      return {
        ...m,
        user_name: userInfo?.full_name || '',
        user_email: userInfo?.email || '',
        chart_title: m.chart_id ? chartTitleMap.get(m.chart_id) || '' : '',
      };
    });

    const totalCharts = formattedCharts.length;
    const totalUsers = formattedUsers.length;
    const totalMessages = formattedMessages.length;
    const totalPro = formattedCharts.filter(
      (c) => c.duong_so_data.tier === 'pro' || c.duong_so_data.tier === 'expert'
    ).length;
    const totalFree = totalCharts - totalPro;

    const paidOrders = orders.filter((o) => o.status === 'PAID');
    const paidProOrders = paidOrders.filter(
      (o) =>
        o.paymentType === 'reading_vip' ||
        o.paymentType === 'reading_expert' ||
        o.paymentType === 'upgrade_expert'
    ).length;
    const actualRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    return NextResponse.json({
      source: 'service_role_light',
      users: formattedUsers,
      charts: formattedCharts,
      messages: formattedMessages,
      orders,
      stats: {
        total_users: totalUsers,
        total_charts: totalCharts,
        total_pro: paidProOrders,
        total_free: totalFree,
        total_messages: totalMessages,
        total_orders: orders.length,
        paid_orders: paidOrders.length,
        estimated_revenue: actualRevenue,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Lỗi máy chủ admin: ${msg}` }, { status: 500 });
  }
}
