'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AdminTestStudio from '@/components/admin/AdminTestStudio';
import AdminUsersTable, { AdminUser } from '@/components/admin/AdminUsersTable';
import AdminTransactionsTable, { AdminChartItem, AdminOrderItem, AdminStats } from '@/components/admin/AdminTransactionsTable';
import { Sparkles, Crown, Users, BookOpen, KeyRound, LogOut, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';

type AdminTab = 'studio' | 'users' | 'transactions';

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
      </div>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800/60 mt-8">
        <p>© {new Date().getFullYear()} Tử Vi Thầy Tôn • Cổng Quản Trị Nghiên Cứu &amp; Quản Lý Dịch Vụ</p>
      </footer>
    </main>
  );
}
