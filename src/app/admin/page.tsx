'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import type { AdminUser, AdminChatMessage } from '@/components/admin/AdminUsersTable';
import type { AdminChartItem, AdminOrderItem, AdminStats } from '@/components/admin/AdminTransactionsTable';
import { AffiliateItem } from '@/types/affiliate';
import { TesterAccount } from '@/types/tester';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeSelector from '@/components/ThemeSelector';
import { getAdminAuthHeaders } from '@/lib/adminClientAuth';
import { Sparkles, Crown, Users, BookOpen, KeyRound, LogOut, ArrowLeft, Share2, FlaskConical, GraduationCap, Loader2 } from 'lucide-react';

const AdminTestStudio = dynamic(() => import('@/components/admin/AdminTestStudio'), { ssr: false });
const AdminCourseViewer = dynamic(() => import('@/components/admin/AdminCourseViewer'), { ssr: false });
const AdminUsersTable = dynamic(() => import('@/components/admin/AdminUsersTable'), { ssr: false });
const AdminTransactionsTable = dynamic(() => import('@/components/admin/AdminTransactionsTable'), { ssr: false });
const AdminAffiliatesTable = dynamic(() => import('@/components/admin/AdminAffiliatesTable'), { ssr: false });
const AdminTestersTable = dynamic(() => import('@/components/admin/AdminTestersTable'), { ssr: false });

const EXACT_ADMIN_EMAILS = new Set([
  'tranhuyton@gmail.com',
  'tonhuytran@gmail.com',
  'diep.anh.12135@gmail.com',
  'diep.anh1205@gmail.com',
]);

type AdminTab = 'studio' | 'course' | 'transactions' | 'affiliates' | 'testers' | 'users';

export default function AdminPage() {
  const { user, signIn, signOut, isLoading: isAuthLoading } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('studio');

  // Dữ liệu Admin
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [charts, setCharts] = useState<AdminChartItem[]>([]);
  const [orders, setOrders] = useState<AdminOrderItem[]>([]);
  const [messages, setMessages] = useState<AdminChatMessage[]>([]);
  const [affiliates, setAffiliates] = useState<AffiliateItem[]>([]);
  const [affiliateOrders, setAffiliateOrders] = useState<AdminOrderItem[]>([]);
  const [testers, setTesters] = useState<TesterAccount[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    total_users: 0,
    total_charts: 0,
    total_pro: 0,
    total_free: 0,
    total_messages: 0,
    estimated_revenue: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState(false);

  const fetchAffiliatesData = useCallback(async () => {
    try {
      const headers = await getAdminAuthHeaders();
      const res = await fetch('/api/admin/affiliates', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.affiliates) setAffiliates(data.affiliates);
        if (data.orders) setAffiliateOrders(data.orders);
      }
    } catch (err) {
      console.warn('Lỗi tải dữ liệu affiliate:', err);
    }
  }, []);

  const fetchTestersData = useCallback(async () => {
    try {
      const headers = await getAdminAuthHeaders();
      const res = await fetch('/api/admin/testers', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.testers) setTesters(data.testers);
      }
    } catch (err) {
      console.warn('Lỗi tải dữ liệu testers:', err);
    }
  }, []);

  const fetchAdminData = useCallback(async () => {
    setIsLoadingData(true);
    try {
      const headers = await getAdminAuthHeaders();
      const res = await fetch('/api/admin/data', { headers });
      if (res.status === 401) {
        setIsAuthenticated(false);
        setPinError('Phiên đăng nhập quản trị không hợp lệ hoặc không có quyền Admin.');
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setCharts(data.charts || []);
        if (data.messages) setMessages(data.messages);
        if (data.orders) setOrders(data.orders);
        if (data.stats) setStats(data.stats);
      }
      fetchAffiliatesData();
      fetchTestersData();
    } catch (err) {
      console.warn('Lỗi tải dữ liệu admin:', err);
    } finally {
      setIsLoadingData(false);
    }
  }, [fetchAffiliatesData, fetchTestersData]);

  // Tự động xác thực bằng Supabase JWT nếu user có quyền admin hoặc email Quản Trị viên
  const isCurrentUserAdmin = Boolean(
    user && (user.app_metadata?.role === 'admin' || EXACT_ADMIN_EMAILS.has((user.email || '').trim().toLowerCase()))
  );

  useEffect(() => {
    if (isAuthLoading) return;
    if (isCurrentUserAdmin) {
      setIsAuthenticated(true);
      setPinError('');
      fetchAdminData();
    } else {
      setIsAuthenticated(false);
    }
  }, [isCurrentUserAdmin, isAuthLoading, fetchAdminData]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    if (!cleanEmail || !passwordInput) {
      setPinError('Vui lòng nhập đầy đủ Email và Mật khẩu quản trị.');
      return;
    }
    setIsLoggingIn(true);
    setPinError('');
    try {
      const { error } = await signIn(cleanEmail, passwordInput);
      if (error) {
        setPinError('Email hoặc mật khẩu không chính xác. Vui lòng thử lại.');
        return;
      }
      // Kiểm tra quyền Admin ngay với server (/api/admin/data) thay vì chỉ so cứng danh sách email client
      const headers = await getAdminAuthHeaders();
      const verifyRes = await fetch('/api/admin/data', { headers });
      if (verifyRes.status === 401 || verifyRes.status === 403) {
        setPinError('Tài khoản này không có quyền Quản trị viên được cấp phép.');
        await signOut();
        return;
      }
      setPasswordInput('');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogoutAdmin = async () => {
    localStorage.removeItem('tuvi_admin_pin');
    sessionStorage.removeItem('tuvi_admin_env_pin');
    setIsAuthenticated(false);
    await signOut();
  };

  // MÀN HÌNH ĐĂNG NHẬP TÀI KHOẢN QUẢN TRỊ (BẢO MẬT BẰNG SUPABASE JWT)
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
              Đăng nhập bằng tài khoản Quản trị viên đã được cấp quyền.
            </p>
          </div>

          {user && !isCurrentUserAdmin && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-200 space-y-2">
              <p>Tài khoản <b>{user.email}</b> không có quyền Quản trị viên.</p>
              <button
                type="button"
                onClick={handleLogoutAdmin}
                className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white font-semibold"
              >
                Đăng xuất để đổi tài khoản
              </button>
            </div>
          )}

          <form onSubmit={handleAdminSignIn} className="space-y-4 text-left">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                Email Quản Trị:
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@..."
                className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                Mật Khẩu:
              </label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Nhập mật khẩu tài khoản..."
                className="w-full px-4 py-3 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {pinError && (
              <p className="text-xs text-red-400 text-center">{pinError}</p>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || isAuthLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              {(isLoggingIn || isAuthLoading) && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Đăng Nhập Quản Trị</span>
            </button>
          </form>

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
            <div className="flex items-center gap-1.5 mr-1" title="Chuyển ngôn ngữ kiểm thử cho An sao, Luận giải & Hỏi đáp">
              <span className="text-[11px] text-amber-300 font-medium hidden md:inline">Ngôn ngữ test:</span>
              <LanguageSelector />
            </div>

            <ThemeSelector />

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
        <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('studio')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>🔮 Studio An Sao &amp; Test Luận Giải</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('transactions');
              fetchAdminData();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span>💰 Lịch Sử Giao Dịch &amp; Lá Số ({charts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('users');
              fetchAdminData();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5 shrink-0" />
            <span>👥 Quản Lý Khách Hàng ({users.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('affiliates');
              fetchAffiliatesData();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'affiliates'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 shrink-0" />
            <span>🤝 Cộng Tác Viên / Affiliate ({affiliates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('testers');
              fetchTestersData();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'testers'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 shrink-0" />
            <span>🧪 Tài Khoản Tester ({testers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('course')}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-[13px] font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'course'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span>🎓 Khóa Học 699k (Đủ 24 Bài)</span>
          </button>
        </div>

        {/* Nội Dung Từng Tab */}
        {activeTab === 'studio' && <AdminTestStudio />}

        {activeTab === 'course' && <AdminCourseViewer />}

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
            messages={messages}
            isLoading={isLoadingData}
            onRefresh={() => fetchAdminData()}
          />
        )}

        {activeTab === 'affiliates' && (
          <AdminAffiliatesTable
            affiliates={affiliates}
            orders={affiliateOrders.length > 0 ? affiliateOrders : orders.filter((o) => !!o.affiliateCode)}
            onRefresh={() => fetchAffiliatesData()}
          />
        )}

        {activeTab === 'testers' && (
          <AdminTestersTable
            testers={testers}
            isLoading={isLoadingData}
            onRefresh={() => fetchTestersData()}
          />
        )}
      </div>

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800/60 mt-8">
        <p>© {new Date().getFullYear()} Tử Vi Thầy Tôn • Cổng Quản Trị Nghiên Cứu &amp; Quản Lý Dịch Vụ</p>
      </footer>
    </main>
  );
}
