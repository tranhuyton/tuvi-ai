'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AdminTestStudio from '@/components/admin/AdminTestStudio';
import AdminUsersTable, { AdminUser } from '@/components/admin/AdminUsersTable';
import AdminTransactionsTable, { AdminChartItem, AdminOrderItem, AdminStats } from '@/components/admin/AdminTransactionsTable';
import { Sparkles, Crown, Users, BookOpen, KeyRound, LogOut, ArrowLeft, ShieldCheck, Database, RefreshCw } from 'lucide-react';

type AdminTab = 'studio' | 'users' | 'transactions' | 'setup';

export default function AdminPage() {
  const { user } = useAuth();
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('studio');

  // Dữ liệu Admin
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [charts, setCharts] = useState<AdminChartItem[]>([]);
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    total_charts: 0,
    total_pro: 0,
    total_free: 0,
    total_messages: 0,
    estimated_revenue: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Kiểm tra lưu phiên PIN
  useEffect(() => {
    const savedPin = localStorage.getItem('tuvi_admin_pin');
    const validPins = ['thayton2026', '0935058688'];

    if (savedPin && validPins.includes(savedPin)) {
      setIsAuthenticated(true);
      fetchAdminData(savedPin);
    } else if (user?.email && (user.email.includes('tranhuyton') || user.email.includes('thayton'))) {
      // Tự động cho phép nếu đăng nhập tài khoản Thầy Tôn
      setIsAuthenticated(true);
      localStorage.setItem('tuvi_admin_pin', 'thayton2026');
      fetchAdminData('thayton2026');
    }
  }, [user]);

  const handleLoginPin = (e: React.FormEvent) => {
    e.preventDefault();
    const pin = pinInput.trim();
    const validPins = ['thayton2026', '0935058688'];

    if (validPins.includes(pin)) {
      setIsAuthenticated(true);
      setPinError('');
      localStorage.setItem('tuvi_admin_pin', pin);
      fetchAdminData(pin);
    } else {
      setPinError('Mã PIN bảo mật không chính xác. Xin vui lòng thử lại!');
    }
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem('tuvi_admin_pin');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const fetchAdminData = async (pin?: string) => {
    const activePin = pin || localStorage.getItem('tuvi_admin_pin') || 'thayton2026';
    setIsLoadingData(true);
    try {
      const res = await fetch(`/api/admin/data?pin=${encodeURIComponent(activePin)}`, {
        headers: { 'x-admin-pin': activePin },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setCharts(data.charts || []);
        if (data.orders) setOrders(data.orders);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.warn('Lỗi tải dữ liệu admin:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  // MÀN HÌNH NHẬP MÃ PIN NẾU CHƯA XÁC THỰC
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen cosmic-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900/90 border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-slate-100 text-center space-y-5">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
            <KeyRound className="w-7 h-7" />
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-amber-400">
              Cổng Quản Trị Thầy Tôn
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Nhập mã định danh bảo mật để truy cập bảng điều khiển Admin.
            </p>
          </div>

          <form onSubmit={handleLoginPin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                Mã PIN Quản Trị:
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Nhập mã PIN..."
                className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 text-center text-lg tracking-widest focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 text-center">{pinError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              Mở Khóa Quản Trị
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-500 border-t border-slate-800">
            Mã PIN mặc định: <code className="text-amber-400 font-mono">thayton2026</code> hoặc số điện thoại <code className="text-amber-400 font-mono">0935058688</code>
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-400 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại trang chủ Tử Vi</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // MÀN HÌNH CHÍNH CỦA ADMIN DASHBOARD
  return (
    <main className="min-h-screen cosmic-bg py-6 px-3 sm:px-6 md:px-8 flex flex-col justify-between">
      <div className="w-full max-w-[1280px] mx-auto space-y-6">
        {/* Header Quản Trị */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 backdrop-blur-md shadow-xl text-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Crown className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold font-serif text-amber-400 tracking-wide flex items-center gap-2">
                <span>TỬ VI THẦY TÔN • TRUNG TÂM QUẢN TRỊ</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  ADMIN PORTAL
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Thử nghiệm an sao, kiểm thử mô hình AI &amp; Quản lý khách hàng toàn diện
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>Xem Trang Khách Hàng</span>
            </Link>

            <button
              type="button"
              onClick={handleLogoutAdmin}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-500/40 rounded-xl text-xs transition"
              title="Khóa quản trị"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Khóa</span>
            </button>
          </div>
        </header>

        {/* Thanh Chuyển Tab */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'studio'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>🔮 Studio An Sao &amp; Test Luận Giải</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('transactions');
              fetchAdminData();
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>💰 Lịch Sử Giao Dịch &amp; Lá Số ({charts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('users');
              fetchAdminData();
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>👥 Quản Lý Khách Hàng ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'setup'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>⚙️ Hướng Dẫn Cấu Hình SQL</span>
          </button>
        </div>

        {/* Nội Dung Từng Tab */}
        {activeTab === 'studio' && <AdminTestStudio />}

        {activeTab === 'transactions' && (
          <AdminTransactionsTable
            charts={charts}
            orders={orders}
            stats={stats}
            isLoading={isLoadingData}
            onRefresh={() => fetchAdminData()}
          />
        )}

        {activeTab === 'users' && (
          <AdminUsersTable
            users={users}
            isLoading={isLoadingData}
            onRefresh={() => fetchAdminData()}
          />
        )}

        {activeTab === 'setup' && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-slate-300">
            <h3 className="font-bold text-lg text-amber-400 font-serif flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span>Thiết Lập Quyền Truy Vấn Dữ Liệu Toàn Hệ Thống (Supabase RPC)</span>
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
              Do hệ thống áp dụng cơ chế bảo mật nghiêm ngặt <strong>Row Level Security (RLS)</strong>, người dùng thông thường chỉ xem được lá số của chính mình. Để xem được đầy đủ danh sách tài khoản và lá số của tất cả khách hàng trên trang Admin này, anh chỉ cần copy đoạn script SQL bên dưới và dán vào <strong>Supabase SQL Editor</strong> rồi bấm <strong>Run</strong>:
            </p>

            <div className="p-4 rounded-xl bg-black/80 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
{`-- Tạo hàm bảo mật RPC lấy dữ liệu tổng quan cho Admin
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_data()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSONB;
    v_users JSONB;
    v_charts JSONB;
    v_total_users INT;
    v_total_charts INT;
    v_total_pro INT;
    v_total_free INT;
    v_total_messages INT;
BEGIN
    SELECT jsonb_agg(u) INTO v_users FROM (
        SELECT p.id, p.email, p.full_name, p.created_at,
               COUNT(DISTINCT c.id) AS charts_count,
               COUNT(DISTINCT m.id) AS messages_count
        FROM public.tuvi_profiles p
        LEFT JOIN public.tuvi_charts c ON c.user_id = p.id
        LEFT JOIN public.tuvi_chat_messages m ON m.user_id = p.id
        GROUP BY p.id, p.email, p.full_name, p.created_at
        ORDER BY p.created_at DESC
    ) u;

    SELECT jsonb_agg(ch) INTO v_charts FROM (
        SELECT c.id, c.user_id, c.title, c.duong_so_data, c.laso_data, c.created_at, c.updated_at,
               p.full_name AS user_name, p.email AS user_email,
               (c.reading_html IS NOT NULL AND length(c.reading_html) > 50) AS has_reading,
               COUNT(m.id) AS message_count
        FROM public.tuvi_charts c
        LEFT JOIN public.tuvi_profiles p ON p.id = c.user_id
        LEFT JOIN public.tuvi_chat_messages m ON m.chart_id = c.id
        GROUP BY c.id, c.user_id, c.title, c.duong_so_data, c.laso_data, c.created_at, c.updated_at, p.full_name, p.email, c.reading_html
        ORDER BY c.created_at DESC
    ) ch;

    SELECT COUNT(*) INTO v_total_users FROM public.tuvi_profiles;
    SELECT COUNT(*) INTO v_total_charts FROM public.tuvi_charts;
    SELECT COUNT(*) INTO v_total_messages FROM public.tuvi_chat_messages;
    SELECT COUNT(*) INTO v_total_pro FROM public.tuvi_charts WHERE (duong_so_data->>'tier' = 'pro' OR laso_data->>'tier' = 'pro');
    v_total_free := v_total_charts - v_total_pro;

    result := jsonb_build_object(
        'users', COALESCE(v_users, '[]'::jsonb),
        'charts', COALESCE(v_charts, '[]'::jsonb),
        'stats', jsonb_build_object(
            'total_users', COALESCE(v_total_users, 0),
            'total_charts', COALESCE(v_total_charts, 0),
            'total_pro', COALESCE(v_total_pro, 0),
            'total_free', COALESCE(v_total_free, 0),
            'total_messages', COALESCE(v_total_messages, 0),
            'estimated_revenue', (COALESCE(v_total_pro, 0) * 119000)
        )
    );
    RETURN result;
END;
$$;`}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <h4 className="font-bold text-sm text-amber-400 font-serif mb-2">
                2. Khởi tạo Bảng Đơn Hàng &amp; Thanh Toán Quét QR (tuvi_orders)
              </h4>
              <p className="text-xs text-slate-300 mb-2">
                Nếu muốn lưu trữ vĩnh viễn các đơn hàng VietQR trên Supabase, anh có thể chạy thêm script này:
              </p>
              <div className="p-4 rounded-xl bg-black/80 border border-slate-800 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
{`-- Tạo bảng lưu trữ đơn hàng & thanh toán QR
CREATE TABLE IF NOT EXISTS public.tuvi_orders (
    id TEXT PRIMARY KEY,
    order_code VARCHAR(20) UNIQUE NOT NULL,
    payment_type VARCHAR(50) NOT NULL,
    amount NUMERIC NOT NULL,
    ho_ten VARCHAR(255),
    email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    transaction_id VARCHAR(255),
    chart_id UUID,
    user_id UUID
);

-- Index tra cứu nhanh mã đơn
CREATE INDEX IF NOT EXISTS idx_tuvi_orders_code ON public.tuvi_orders (order_code);
CREATE INDEX IF NOT EXISTS idx_tuvi_orders_status ON public.tuvi_orders (status);`}
              </div>
            </div>

            <p className="text-xs text-slate-400">
              * Tệp script này cũng đã được lưu sẵn trong dự án tại: <code className="text-amber-400 font-mono">supabase/migrations/20260919_admin_access.sql</code>.
            </p>
          </div>
        )}
      </div>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800/60 mt-8">
        <p>© {new Date().getFullYear()} Tử Vi Thầy Tôn • Cổng Quản Trị Nghiên Cứu &amp; Quản Lý Dịch Vụ</p>
      </footer>
    </main>
  );
}
