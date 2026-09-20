import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

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

    // Cách 1: Thử gọi hàm RPC bảo mật SECURITY DEFINER từ Supabase
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc('get_admin_dashboard_data');
      if (!rpcErr && rpcData) {
        const { getAllOrders } = await import('@/lib/orderStore');
        const orders = await getAllOrders(100);
        const paidOrders = orders.filter((o) => o.status === 'PAID');
        const actualRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

        const updatedStats = {
          ...(rpcData.stats || {}),
          total_orders: orders.length,
          paid_orders: paidOrders.length,
          estimated_revenue: actualRevenue > 0 ? actualRevenue : (rpcData.stats?.estimated_revenue || 0),
        };

        return NextResponse.json({
          source: 'rpc',
          ...rpcData,
          orders: orders,
          stats: updatedStats,
        });
      }
    } catch (e) {
      console.warn('Hàm RPC chưa được tạo trong Supabase, chuyển sang truy vấn trực tiếp:', e);
    }

    // Cách 2: Truy vấn trực tiếp các bảng
    const { data: profiles } = await supabase
      .from('tuvi_profiles')
      .select('id, email, full_name, created_at')
      .order('created_at', { ascending: false });

    const { data: charts } = await supabase
      .from('tuvi_charts')
      .select('id, user_id, title, duong_so_data, laso_data, reading_html, created_at, updated_at')
      .order('created_at', { ascending: false });

    const { data: messages } = await supabase
      .from('tuvi_chat_messages')
      .select('id, chart_id, user_id, created_at');

    const totalCharts = charts?.length || 0;
    const totalUsers = profiles?.length || 0;
    const totalMessages = messages?.length || 0;
    const totalPro = charts?.filter((c) => c.duong_so_data?.tier === 'pro' || c.laso_data?.tier === 'pro').length || 0;
    const totalFree = totalCharts - totalPro;

    const formattedUsers = (profiles || []).map((u) => ({
      id: u.id,
      email: u.email,
      full_name: u.full_name,
      created_at: u.created_at,
      charts_count: charts?.filter((c) => c.user_id === u.id).length || 0,
      messages_count: messages?.filter((m) => m.user_id === u.id).length || 0,
    }));

    const formattedCharts = (charts || []).map((c) => ({
      id: c.id,
      user_id: c.user_id,
      title: c.title,
      duong_so_data: c.duong_so_data,
      laso_data: c.laso_data,
      created_at: c.created_at,
      updated_at: c.updated_at,
      has_reading: Boolean(c.reading_html && c.reading_html.length > 50),
      message_count: messages?.filter((m) => m.chart_id === c.id).length || 0,
    }));

    // Lấy danh sách đơn hàng quét QR
    const { getAllOrders } = await import('@/lib/orderStore');
    const orders = await getAllOrders(100);
    const paidOrders = orders.filter((o) => o.status === 'PAID');
    const actualRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);

    return NextResponse.json({
      source: 'direct',
      users: formattedUsers,
      charts: formattedCharts,
      orders: orders,
      stats: {
        total_users: totalUsers,
        total_charts: totalCharts,
        total_pro: totalPro,
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
