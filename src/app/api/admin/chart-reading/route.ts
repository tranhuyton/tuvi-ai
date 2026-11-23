import { NextRequest, NextResponse } from 'next/server';
import { adminSupabase } from '@/lib/supabaseAdmin';
import { verifyAdminRequest, isValidUuid } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Không có quyền truy cập quản trị' }, { status: 401 });
    }

    const chartId = req.nextUrl.searchParams.get('id');
    if (!chartId || !isValidUuid(chartId)) {
      return NextResponse.json({ error: 'Mã ID lá số không hợp lệ' }, { status: 400 });
    }

    const [chartRes, chatRes] = await Promise.all([
      adminSupabase
        .from('tuvi_charts')
        .select('id, title, reading_html, duong_so_data, laso_data, created_at, updated_at')
        .eq('id', chartId)
        .single(),
      adminSupabase
        .from('tuvi_chat_messages')
        .select('id, question, answer, message_type, created_at')
        .eq('chart_id', chartId)
        .order('created_at', { ascending: true }),
    ]);

    const { data, error } = chartRes;
    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Không tìm thấy lá số' }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      reading_html: data.reading_html || null,
      duong_so_data: data.duong_so_data,
      laso_data: data.laso_data,
      chat_messages: chatRes.error ? [] : (chatRes.data || []),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Lỗi máy chủ' }, { status: 500 });
  }
}
