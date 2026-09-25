'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Users,
  Copy,
  Check,
  Search,
  TrendingUp,
  MousePointerClick,
  ShoppingBag,
  CreditCard,
  ArrowLeft,
  DollarSign,
  Share2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AffiliateInfo {
  code: string;
  name: string;
  commissionRate: number;
  commissionFixed?: number;
  totalClicks: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  paidCommission: number;
  remainingCommission: number;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  createdAt: string;
}

interface RecentOrder {
  orderCode: string;
  paymentType: string;
  amount: number;
  status: string;
  createdAt: string;
  paidAt?: string;
  commissionAmount?: number;
}

export default function CTVPortalPage() {
  const [searchInput, setSearchInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [affInfo, setAffInfo] = useState<AffiliateInfo | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/affiliate/info?q=${encodeURIComponent(searchInput.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Không tìm thấy thông tin CTV');
        setAffInfo(null);
        setRecentOrders([]);
      } else {
        setAffInfo(data.affiliate);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối máy chủ: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!affInfo) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tuvithayton.vn';
    const link = `${origin}/?ref=${affInfo.code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Trang Chủ Tử Vi</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5" />
              <span>Cổng Cộng Tác Viên (Affiliate)</span>
            </span>
          </div>
        </div>
      </header>

      {/* HERO & SEARCH */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 font-serif">
            Tra Cứu Doanh Thu &amp; Hoa Hồng CTV
          </h1>
          <p className="text-slate-400 text-sm">
            Nhập Mã giới thiệu hoặc Số điện thoại của bạn để xem số lượt click, số đơn hàng thành công và số dư hoa hồng tích lũy.
          </p>

          <form onSubmit={handleSearch} className="pt-2 flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Nhập Mã CTV (vd: diep93) hoặc SĐT..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-4 pr-3 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="px-5 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-amber-900/30 disabled:opacity-50 flex items-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{isLoading ? 'Đang tra...' : 'Tra Cứu'}</span>
            </button>
          </form>

          {errorMsg && (
            <div className="p-3 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-xs flex items-center justify-center gap-2 max-w-md mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* THÔNG TIN CTV SAU KHI TRA CỨU */}
        {affInfo && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* THẺ CHÀO & LINK CHIA SẺ */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-800/80 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{affInfo.name}</h2>
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                      Đang Hoạt Động
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Mã CTV: <b className="text-amber-400 font-mono">{affInfo.code}</b> | Mức hoa hồng:{' '}
                    <b className="text-amber-300">
                      {affInfo.commissionFixed ? `${affInfo.commissionFixed.toLocaleString('vi-VN')}đ / đơn` : `${affInfo.commissionRate}%`}
                    </b>
                  </p>
                </div>

                <div className="bg-slate-900/80 border border-slate-700 p-2.5 rounded-xl flex items-center gap-3">
                  <div className="text-xs font-mono text-amber-200 truncate max-w-xs sm:max-w-md">
                    {typeof window !== 'undefined' ? window.location.origin : 'https://tuvithayton.vn'}/?ref={affInfo.code}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow shrink-0"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Đã Copy</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* THẺ THỐNG KÊ DOANH THU & HOA HỒNG */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase mb-1">
                  <MousePointerClick className="w-3.5 h-3.5 text-purple-400" />
                  <span>Lượt Click</span>
                </div>
                <div className="text-2xl font-bold text-white">{affInfo.totalClicks}</div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase mb-1">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                  <span>Đơn Thành Công</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">{affInfo.totalOrders}</div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  <span>Doanh Thu</span>
                </div>
                <div className="text-2xl font-bold text-amber-400">
                  {affInfo.totalRevenue.toLocaleString('vi-VN')}đ
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tổng Hoa Hồng</span>
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                  {affInfo.totalCommission.toLocaleString('vi-VN')}đ
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Đã Nhận</span>
                </div>
                <div className="text-2xl font-bold text-slate-300">
                  {affInfo.paidCommission.toLocaleString('vi-VN')}đ
                </div>
              </div>

              <div className="bg-amber-950/40 border border-amber-500/40 p-4 rounded-xl">
                <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase mb-1">
                  <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Chờ Thanh Toán</span>
                </div>
                <div className="text-2xl font-bold text-amber-400">
                  {affInfo.remainingCommission.toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>

            {/* DANH SÁCH ĐƠN HÀNG GẦN ĐÂY */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/90">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>Lịch Sử Đơn Hàng Gần Đây Của Bạn ({recentOrders.length})</span>
                </h3>
                <span className="text-xs text-slate-400">Tự động cập nhật tức thì</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Mã Đơn</th>
                      <th className="py-3 px-4">Gói Luận Giải</th>
                      <th className="py-3 px-4">Thời Gian</th>
                      <th className="py-3 px-4 text-right">Giá Trị Đơn</th>
                      <th className="py-3 px-4 text-right">Hoa Hồng Nhận Được</th>
                      <th className="py-3 px-4 text-center">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50 text-slate-300">
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-slate-500">
                          Chưa có đơn hàng nào phát sinh. Hãy chia sẻ link của bạn lên Facebook, Zalo, TikTok để nhận hoa hồng!
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((o) => (
                        <tr key={o.orderCode} className="hover:bg-slate-700/30">
                          <td className="py-3 px-4 font-mono font-bold text-white">{o.orderCode}</td>
                          <td className="py-3 px-4 text-xs">
                            {o.paymentType === 'reading_vip'
                              ? 'Bản VIP 119.000đ'
                              : o.paymentType === 'chat_vip'
                              ? 'Chat VIP 99.000đ'
                              : 'Chat Cơ Bản 49.000đ'}
                          </td>
                          <td className="py-3 px-4 text-xs text-slate-400">
                            {new Date(o.createdAt).toLocaleString('vi-VN')}
                          </td>
                          <td className="py-3 px-4 text-right font-medium text-white">
                            {o.amount.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-400">
                            +{(o.commissionAmount || 0).toLocaleString('vi-VN')}đ
                          </td>
                          <td className="py-3 px-4 text-center">
                            {o.status === 'PAID' ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Thành Công
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full">
                                Chờ Thanh Toán
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* HƯỚNG DẪN CHIA SẺ & QUY ĐỊNH */}
        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-amber-300 text-base flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>Mẹo Chia Sẻ &amp; Tối Ưu Hoa Hồng Dành Cho CTV</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-4 text-xs text-slate-300 leading-relaxed">
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
              <b className="text-white text-sm">1. Chia sẻ lên Mạng Xã Hội</b>
              <p className="text-slate-400">
                Đăng bài lên Facebook cá nhân, story Instagram hoặc gắn link vào Bio TikTok với caption tò mò về vận hạn năm 2026.
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
              <b className="text-white text-sm">2. Lưu Vết Thông Minh 30 Ngày</b>
              <p className="text-slate-400">
                Chỉ cần bạn bè click vào link 1 lần, dù hôm nay họ chỉ xem miễn phí thì trong vòng 30 ngày họ nâng cấp bạn vẫn được tính hoa hồng!
              </p>
            </div>

            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
              <b className="text-white text-sm">3. Nhận Tiền Nhanh Chóng</b>
              <p className="text-slate-400">
                Hoa hồng được thống kê tự động ngay khi khách chuyển khoản qua ngân hàng. Thầy Tôn sẽ đối soát và chuyển khoản trực tiếp về STK của bạn.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
