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
  Edit2,
  X,
  Clock,
  Landmark,
} from 'lucide-react';
import { VIETNAMESE_BANKS, AffiliateItem as AffiliateInfo } from '@/types/affiliate';

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

  // Modal cập nhật tài khoản ngân hàng
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankFormData, setBankFormData] = useState({
    bankCode: 'MB',
    bankName: 'MBBank (Quân Đội)',
    bankAccountNumber: '',
    bankAccountName: '',
  });
  const [isSavingBank, setIsSavingBank] = useState(false);

  // Modal yêu cầu rút tiền
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isRequestingWithdraw, setIsRequestingWithdraw] = useState(false);

  const remainingCommission = affInfo
    ? (affInfo.remainingCommission ?? (affInfo.totalCommission - affInfo.paidCommission))
    : 0;

  const fetchAffiliateDetails = async (identifier: string) => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch(`/api/affiliate/info?q=${encodeURIComponent(identifier.trim())}`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Không tìm thấy thông tin CTV');
        setAffInfo(null);
        setRecentOrders([]);
      } else {
        setAffInfo(data.affiliate);
        setRecentOrders(data.recentOrders || []);
        // Đồng bộ form ngân hàng
        if (data.affiliate.bankName) {
          const matched = VIETNAMESE_BANKS.find(
            (b) => b.code === data.affiliate.bankCode || b.name === data.affiliate.bankName
          );
          setBankFormData({
            bankCode: data.affiliate.bankCode || matched?.code || 'MB',
            bankName: data.affiliate.bankName || matched?.name || 'MBBank (Quân Đội)',
            bankAccountNumber: data.affiliate.bankAccountNumber || '',
            bankAccountName: data.affiliate.bankAccountName || '',
          });
        }
      }
    } catch (err: any) {
      setErrorMsg('Lỗi kết nối máy chủ: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    await fetchAffiliateDetails(searchInput.trim());
  };

  const handleCopyLink = () => {
    if (!affInfo) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tuvithayton.vn';
    const link = `${origin}/?ref=${affInfo.code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Lưu thông tin ngân hàng
  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affInfo) return;

    if (!bankFormData.bankAccountNumber.trim() || !bankFormData.bankAccountName.trim()) {
      alert('Vui lòng nhập Số tài khoản và Tên chủ tài khoản');
      return;
    }

    setIsSavingBank(true);
    try {
      const res = await fetch('/api/affiliate/update-bank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: affInfo.code,
          bankCode: bankFormData.bankCode,
          bankName: bankFormData.bankName,
          bankAccountNumber: bankFormData.bankAccountNumber.trim(),
          bankAccountName: bankFormData.bankAccountName.trim().toUpperCase(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsBankModalOpen(false);
        await fetchAffiliateDetails(affInfo.code);
        alert('Cập nhật tài khoản ngân hàng thành công!');
      } else {
        alert(data.error || 'Lỗi cập nhật');
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSavingBank(false);
    }
  };

  // Gửi yêu cầu rút tiền
  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!affInfo) return;

    const amount = Number(withdrawAmount);
    if (!amount || amount < 50000) {
      alert('Số tiền rút tối thiểu là 50.000đ');
      return;
    }

    const remaining = affInfo.remainingCommission ?? (affInfo.totalCommission - affInfo.paidCommission);
    if (amount > remaining) {
      alert(`Số dư khả dụng của bạn chỉ còn ${remaining.toLocaleString('vi-VN')}đ`);
      return;
    }

    setIsRequestingWithdraw(true);
    try {
      const res = await fetch('/api/affiliate/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: affInfo.code,
          amount,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsWithdrawModalOpen(false);
        setWithdrawAmount('');
        await fetchAffiliateDetails(affInfo.code);
        alert('Đã gửi yêu cầu rút tiền thành công! Thầy Tôn sẽ quét mã VietQR và chuyển tiền cho bạn trong thời gian sớm nhất.');
      } else {
        alert(data.error || 'Lỗi gửi yêu cầu rút tiền');
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsRequestingWithdraw(false);
    }
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
            Tra Cứu Doanh Thu &amp; Rút Hoa Hồng
          </h1>
          <p className="text-slate-400 text-sm">
            Nhập Mã giới thiệu hoặc Số điện thoại để theo dõi đơn hàng, cập nhật tài khoản ngân hàng nhận tiền và yêu cầu rút hoa hồng.
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
                  <span>Số Dư Khả Dụng</span>
                </div>
                <div className="text-2xl font-bold text-amber-400">
                  {remainingCommission.toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>

            {/* THÔNG TIN TÀI KHOẢN NGÂN HÀNG & NÚT RÚT TIỀN */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-sm text-white">Tài Khoản Nhận Hoa Hồng (VietQR)</span>
                </div>
                {affInfo.bankAccountNumber ? (
                  <div className="text-xs text-slate-300 space-x-2">
                    <span>Ngân hàng: <b className="text-white">{affInfo.bankName}</b></span>
                    <span>•</span>
                    <span>STK: <b className="font-mono text-amber-300 text-sm">{affInfo.bankAccountNumber}</b></span>
                    <span>•</span>
                    <span>Chủ TK: <b className="text-white uppercase">{affInfo.bankAccountName}</b></span>
                  </div>
                ) : (
                  <div className="text-xs text-amber-300 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Bạn chưa cập nhật tài khoản ngân hàng. Hãy bấm nút bên cạnh để thêm STK nhận tiền.</span>
                  </div>
                )}

                {affInfo.pendingWithdrawal && affInfo.pendingWithdrawal > 0 ? (
                  <div className="pt-1 flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang có yêu cầu rút {affInfo.pendingWithdrawal.toLocaleString('vi-VN')}đ đang chờ Thầy Tôn chuyển khoản.</span>
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
                <button
                  onClick={() => setIsBankModalOpen(true)}
                  className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{affInfo.bankAccountNumber ? 'Đổi STK' : 'Thêm STK Ngân Hàng'}</span>
                </button>

                <button
                  disabled={remainingCommission < 50000 || !affInfo.bankAccountNumber}
                  onClick={() => {
                    setWithdrawAmount(String(remainingCommission));
                    setIsWithdrawModalOpen(true);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow disabled:opacity-40 disabled:cursor-not-allowed"
                  title={
                    !affInfo.bankAccountNumber
                      ? 'Vui lòng thêm STK ngân hàng trước'
                      : remainingCommission < 50000
                      ? 'Số dư tối thiểu để rút là 50.000đ'
                      : 'Bấm để yêu cầu rút hoa hồng'
                  }
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Yêu Cầu Rút Tiền</span>
                </button>
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
                Hoa hồng từ 50.000đ trở lên có thể bấm rút ngay. Thầy Tôn quét mã VietQR tự động để bắn tiền về tài khoản ngân hàng của bạn.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL CẬP NHẬT TÀI KHOẢN NGÂN HÀNG */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-850 bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsBankModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Landmark className="w-5 h-5 text-amber-400" />
              <span>Cập Nhật Tài Khoản Nhận Hoa Hồng</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Hệ thống sẽ tự động tạo mã VietQR chuyển khoản chính xác tới tài khoản này khi bạn rút tiền.
            </p>

            <form onSubmit={handleSaveBank} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Chọn Ngân Hàng</label>
                <select
                  value={bankFormData.bankCode}
                  onChange={(e) => {
                    const sel = VIETNAMESE_BANKS.find((b) => b.code === e.target.value);
                    setBankFormData({
                      ...bankFormData,
                      bankCode: e.target.value,
                      bankName: sel ? sel.name : e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {VIETNAMESE_BANKS.map((b) => (
                    <option key={b.code} value={b.code}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Số Tài Khoản (STK)</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập số tài khoản..."
                  value={bankFormData.bankAccountNumber}
                  onChange={(e) => setBankFormData({ ...bankFormData, bankAccountNumber: e.target.value.replace(/\s/g, '') })}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tên Chủ Tài Khoản</label>
                <input
                  type="text"
                  required
                  placeholder="NGUYEN VAN A (viết hoa không dấu)"
                  value={bankFormData.bankAccountName}
                  onChange={(e) => setBankFormData({ ...bankFormData, bankAccountName: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBankModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSavingBank}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-sm font-bold shadow transition-all disabled:opacity-50"
                >
                  {isSavingBank ? 'Đang lưu...' : 'Lưu Thông Tin'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL YÊU CẦU RÚT TIỀN */}
      {isWithdrawModalOpen && affInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsWithdrawModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>Yêu Cầu Rút Tiền Hoa Hồng</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Số dư hoa hồng khả dụng: <b className="text-emerald-400">{remainingCommission.toLocaleString('vi-VN')}đ</b>
            </p>

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngân hàng thụ hưởng:</span>
                  <b className="text-white">{affInfo.bankName}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <b className="text-amber-300 font-mono text-sm">{affInfo.bankAccountNumber}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <b className="text-white uppercase">{affInfo.bankAccountName}</b>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Số Tiền Muốn Rút (VND)</label>
                <div className="relative">
                  <input
                    type="number"
                    min="50000"
                    max={remainingCommission}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-emerald-400 text-lg font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(String(remainingCommission))}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-1 rounded"
                  >
                    Rút Hết
                  </button>
                </div>
                <span className="text-[10px] text-slate-500">Tối thiểu 50.000đ</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-sm text-slate-300 hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isRequestingWithdraw}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isRequestingWithdraw ? 'Đang gửi...' : 'Xác Nhận Rút Tiền'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
