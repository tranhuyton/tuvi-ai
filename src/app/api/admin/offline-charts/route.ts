import { NextRequest, NextResponse } from 'next/server';
import {
  getAllOfflineCharts,
  saveOfflineChart,
  saveMultipleOfflineCharts,
  deleteOfflineChart,
  OfflineChartItem,
} from '@/lib/offlineChartStore';
import { verifyAdminRequest } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Không có quyền truy cập quản trị' }, { status: 401 });
    }

    const charts = await getAllOfflineCharts();
    return NextResponse.json({ success: true, charts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Lỗi lấy danh sách lá số' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Không có quyền truy cập quản trị' }, { status: 401 });
    }

    const body = await req.json();

    // Hỗ trợ đồng bộ hàng loạt (Batch Sync từ trình duyệt máy tính)
    if (Array.isArray(body)) {
      const savedList = await saveMultipleOfflineCharts(body);
      return NextResponse.json({ success: true, count: savedList.length, charts: savedList });
    }

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
    const auth = await verifyAdminRequest(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: 'Không có quyền truy cập quản trị' }, { status: 401 });
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
