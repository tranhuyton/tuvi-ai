import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubkvzgwespfvrlpjuxkp.supabase.co';
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia3Z6Z3dlc3BmdnJscGp1eGtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzExNjM1MSwiZXhwIjoyMDkyNjkyMzUxfQ.Ubmws-Yg0pJKaCaXy7aO8rbt6bw4O3PGgM6GzPR0PLk';

const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

export async function GET(req: NextRequest) {
  try {
    const pin = req.headers.get('x-admin-pin') || req.nextUrl.searchParams.get('pin');
    const validPins = [
      process.env.ADMIN_PIN || 'thayton2026',
      '0935058688',
      'thayton2026',
    ];

    if (!pin || !validPins.includes(pin)) {
      return NextResponse.json({ error: 'Mã PIN bảo mật không chính xác' }, { status: 401 });
    }

    const { getAllOrders } = await import('@/lib/orderStore');

    // Truy vấn song song siêu nhẹ bằng Service Role (loại bỏ hoàn toàn ảnh Base64 hàng chục MB gây nghẽn/timeout)
    const [
      profilesRes,
      chartsRes,
      readingIdsRes,
      anhMatIdsRes,
      anhTayIdsRes,
      messagesRes,
      orders,
    ] = await Promise.all([
      adminSupabase
        .from('tuvi_profiles')
        .select('id, email, full_name, phone, created_at')
        .order('created_at', { ascending: false })
        .limit(5000),
      adminSupabase
        .from('tuvi_charts')
        .select(
          'id, user_id, title, created_at, updated_at, hoTen:duong_so_data->>hoTen, gioiTinh:duong_so_data->>gioiTinh, ngayDuong:duong_so_data->ngayDuong, thangDuong:duong_so_data->thangDuong, namDuong:duong_so_data->namDuong, gioSinhVal:duong_so_data->>gioSinhVal, namXem:duong_so_data->namXem, tier:duong_so_data->>tier, chieuCao:duong_so_data->chieuCao, canNang:duong_so_data->canNang, thongTinThem:duong_so_data->>thongTinThem, lasoTier:laso_data->>tier'
        )
        .order('created_at', { ascending: false })
        .limit(5000),
      adminSupabase
        .from('tuvi_charts')
        .select('id')
        .not('reading_html', 'is', null)
        .neq('reading_html', '')
        .limit(5000),
      adminSupabase
        .from('tuvi_charts')
        .select('id')
        .not('duong_so_data->>anhMat', 'is', null)
        .neq('duong_so_data->>anhMat', '')
        .limit(5000),
      adminSupabase
        .from('tuvi_charts')
        .select('id')
        .not('duong_so_data->>anhTay', 'is', null)
        .neq('duong_so_data->>anhTay', '')
        .limit(5000),
      adminSupabase
        .from('tuvi_chat_messages')
        .select('id, chart_id, user_id, question, answer, created_at')
        .order('created_at', { ascending: false })
        .limit(5000),
      getAllOrders(),
    ]);

    if (chartsRes.error) {
      throw new Error(`Lỗi truy vấn tuvi_charts: ${chartsRes.error.message}`);
    }

    const profiles = profilesRes.data || [];
    const rawCharts = (chartsRes.data || []) as Array<Record<string, any>>;
    const messages = messagesRes.data || [];

    const readingIdSet = new Set((readingIdsRes.data || []).map((r: any) => r.id));
    const anhMatIdSet = new Set((anhMatIdsRes.data || []).map((r: any) => r.id));
    const anhTayIdSet = new Set((anhTayIdsRes.data || []).map((r: any) => r.id));

    const profileMap = new Map<string, { email?: string; full_name?: string }>();
    for (const u of profiles) {
      profileMap.set(u.id, { email: u.email, full_name: u.full_name });
    }

    const chartCountByUser = new Map<string, number>();
    const chartTitleMap = new Map<string, string>();
    for (const c of rawCharts) {
      if (c.user_id) {
        chartCountByUser.set(c.user_id, (chartCountByUser.get(c.user_id) || 0) + 1);
      }
      chartTitleMap.set(c.id, c.title || c.hoTen || '');
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

    const formattedUsers = profiles.map((u) => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      phone: u.phone || '',
      created_at: u.created_at,
      charts_count: chartCountByUser.get(u.id) || 0,
      messages_count: msgCountByUser.get(u.id) || 0,
    }));

    const formattedCharts = rawCharts.map((c) => {
      const resolvedTier = c.tier || c.lasoTier || 'free';
      const userInfo = c.user_id ? profileMap.get(c.user_id) : undefined;
      return {
        id: c.id,
        user_id: c.user_id,
        title: c.title,
        duong_so_data: {
          hoTen: c.hoTen || c.title || '',
          gioiTinh: c.gioiTinh || 'Nam',
          ngayDuong: Number(c.ngayDuong) || 1,
          thangDuong: Number(c.thangDuong) || 1,
          namDuong: Number(c.namDuong) || 1990,
          gioSinhVal: c.gioSinhVal ?? '0',
          namXem: c.namXem ? Number(c.namXem) : undefined,
          tier: resolvedTier,
          chieuCao: c.chieuCao ? Number(c.chieuCao) : undefined,
          canNang: c.canNang ? Number(c.canNang) : undefined,
          thongTinThem: c.thongTinThem || undefined,
          anhMat: anhMatIdSet.has(c.id) ? '__HAS_IMAGE__' : undefined,
          anhTay: anhTayIdSet.has(c.id) ? '__HAS_IMAGE__' : undefined,
        },
        laso_data: { tier: resolvedTier },
        created_at: c.created_at,
        updated_at: c.updated_at,
        has_reading: readingIdSet.has(c.id),
        message_count: msgCountByChart.get(c.id) || 0,
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
        total_pro: paidProOrders > 0 ? paidProOrders : totalPro,
        total_free: totalFree,
        total_messages: totalMessages,
        total_orders: orders.length,
        paid_orders: paidOrders.length,
        estimated_revenue: actualRevenue > 0 ? actualRevenue : totalPro * 119000,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: `Lỗi máy chủ admin: ${msg}` }, { status: 500 });
  }
}
