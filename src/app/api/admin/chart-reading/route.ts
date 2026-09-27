import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubkvzgwespfvrlpjuxkp.supabase.co';
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia3Z6Z3dlc3BmdnJscGp1eGtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzExNjM1MSwiZXhwIjoyMDkyNjkyMzUxfQ.Ubmws-Yg0pJKaCaXy7aO8rbt6bw4O3PGgM6GzPR0PLk';

const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const chartId = req.nextUrl.searchParams.get('id');
    if (!chartId) {
      return NextResponse.json({ error: 'Thiếu mã ID lá số' }, { status: 400 });
    }

    const { data, error } = await adminSupabase
      .from('tuvi_charts')
      .select('id, title, reading_html, duong_so_data, laso_data, created_at, updated_at')
      .eq('id', chartId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Không tìm thấy lá số' }, { status: 404 });
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      reading_html: data.reading_html || null,
      duong_so_data: data.duong_so_data,
      laso_data: data.laso_data,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
