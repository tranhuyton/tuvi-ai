import { NextRequest, NextResponse } from 'next/server';
import {
  getAllOfflineCharts,
  saveOfflineChart,
  deleteOfflineChart,
  OfflineChartItem,
} from '@/lib/offlineChartStore';

export const dynamic = 'force-dynamic';

function verifyPin(req: NextRequest): boolean {
  const pin = req.headers.get('x-admin-pin') || req.nextUrl.searchParams.get('pin');
  const validPins = [
    process.env.ADMIN_PIN || 'thayton2026',
    '0935058688',
    'thayton2026',
  ];
  return Boolean(pin && validPins.includes(pin));
}

export async function GET(req: NextRequest) {
  try {
    if (!verifyPin(req)) {
      return NextResponse.json({ error: 'Mã PIN bảo mật không chính xác' }, { status: 401 });
    }

    const charts = await getAllOfflineCharts();
    return NextResponse.json({ success: true, charts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi lấy danh sách lá số' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!verifyPin(req)) {
      return NextResponse.json({ error: 'Mã PIN bảo mật không chính xác' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.hoTen || !body.duongSoData) {
      return NextResponse.json({ error: 'Thiếu thông tin họ tên hoặc dữ liệu đương số' }, { status: 400 });
    }

    const saved = await saveOfflineChart(body);
    return NextResponse.json({ success: true, chart: saved });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi lưu lá số' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!verifyPin(req)) {
      return NextResponse.json({ error: 'Mã PIN bảo mật không chính xác' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Thiếu ID lá số cần xóa' }, { status: 400 });
    }

    const success = await deleteOfflineChart(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi xóa lá số' }, { status: 500 });
  }
}
