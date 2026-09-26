import { NextRequest, NextResponse } from 'next/server';
import {
  getAllTesters,
  createTester,
  updateTester,
  deleteTester,
  toggleTesterActive,
} from '@/lib/testerStore';

export const dynamic = 'force-dynamic';

function checkAdminAuth(req: NextRequest): boolean {
  const pin =
    req.headers.get('x-admin-pin') ||
    req.nextUrl.searchParams.get('pin');
  const validPins = [
    process.env.ADMIN_PIN || 'thayton2026',
    '0935058688',
    'thayton2026',
  ];
  return Boolean(pin && validPins.includes(pin));
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Mã PIN bảo mật không chính xác' }, { status: 401 });
  }

  try {
    const testers = await getAllTesters();
    return NextResponse.json({ success: true, testers });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: 'Mã PIN bảo mật không chính xác' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'create') {
      const { email, password, fullName, maxCharts, maxQuestionsPerChart, notes } = body;
      const res = await createTester({
        email,
        password,
        fullName,
        maxCharts: Number(maxCharts) || 3,
        maxQuestionsPerChart: Number(maxQuestionsPerChart) || 5,
        notes,
      });

      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, tester: res.tester });
    }

    if (action === 'update') {
      const { id, fullName, maxCharts, maxQuestionsPerChart, passwordPlain, notes } = body;
      if (!id) return NextResponse.json({ error: 'Thiếu ID tester' }, { status: 400 });

      const res = await updateTester(id, {
        fullName,
        maxCharts: Number(maxCharts),
        maxQuestionsPerChart: Number(maxQuestionsPerChart),
        passwordPlain,
        notes,
      });

      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true, tester: res.tester });
    }

    if (action === 'toggle') {
      const { id, isActive } = body;
      if (!id) return NextResponse.json({ error: 'Thiếu ID tester' }, { status: 400 });

      const res = await toggleTesterActive(id, Boolean(isActive));
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'delete') {
      const { id } = body;
      if (!id) return NextResponse.json({ error: 'Thiếu ID tester' }, { status: 400 });

      const res = await deleteTester(id);
      if (!res.success) {
        return NextResponse.json({ error: res.error }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
