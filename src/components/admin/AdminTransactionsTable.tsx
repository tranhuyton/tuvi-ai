'use client';

import React, { useState } from 'react';
import { DuLieuDuongSo, LaSoData } from '@/types/tuvi';
import {
  DollarSign,
  BookOpen,
  Crown,
  Sparkles,
  MessageSquare,
  Search,
  Eye,
  Calendar,
  RefreshCw,
  X,
  QrCode,
  Mail,
  Zap,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import LaSoBanCo from '@/components/LaSoBanCo';
import { GIO_ARR } from '@/lib/tuvi/constants';

export interface AdminChartItem {
  id: string;
  user_id: string;
  title: string;
  duong_so_data: DuLieuDuongSo;
  laso_data: LaSoData;
  created_at: string;
  updated_at: string;
  has_reading: boolean;
  message_count: number;
  user_name?: string;
  user_email?: string;
}

export interface AdminOrderItem {
  id: string;
  orderCode: string;
  paymentType: string;
  amount: number;
  hoTen: string;
  email?: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  createdAt: string;
  paidAt?: string;
  transactionId?: string;
  chartId?: string;
  userId?: string;
}

export interface AdminStats {
  total_users: number;
  total_charts: number;
  total_pro: number;
  total_free: number;
  total_messages: number;
  total_orders?: number;
  paid_orders?: number;
  estimated_revenue: number;
}

interface AdminTransactionsTableProps {
  charts: AdminChartItem[];
  orders?: AdminOrderItem[];
  stats: AdminStats;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function AdminTransactionsTable({
  charts,
  orders = [],
  stats,
  isLoading,
  onRefresh,
}: AdminTransactionsTableProps) {
  const [subTab, setSubTab] = useState<'orders' | 'charts'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'free' | 'pro'>('all');
  const [filterOrderStatus, setFilterOrderStatus] = useState<'all' | 'PAID' | 'PENDING' | 'CANCELLED'>('all');
  const [previewChart, setPreviewChart] = useState<AdminChartItem | null>(null);
  const [approvingCode, setApprovingCode] = useState<string | null>(null);

  // Lọc danh sách lá số
  const filteredCharts = charts.filter((c) => {
    const isPro = c.duong_so_data?.tier === 'pro' || c.laso_data?.tier === 'pro';
    if (filterTier === 'free' && isPro) return false;
    if (filterTier === 'pro' && !isPro) return false;

    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      c.title.toLowerCase().includes(term) ||
      (c.duong_so_data?.hoTen && c.duong_so_data.hoTen.toLowerCase().includes(term)) ||
      (c.user_email && c.user_email.toLowerCase().includes(term)) ||
      c.id.toLowerCase().includes(term)
    );
  });

  // Lọc danh sách đơn hàng VietQR (Tìm thông minh theo mã đơn, số tiền, tên, email, txId)
  const filteredOrders = orders.filter((o) => {
    if (filterOrderStatus !== 'all' && o.status !== filterOrderStatus) return false;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;

    // Chuẩn hóa tìm kiếm: tìm theo mã TVxxxxx, tìm số không có chữ TV, tên, email, txId, số tiền
    const normalizedTerm = term.replace(/[\s\-_]/g, '');
    const normalizedCode = (o.orderCode || '').toLowerCase().replace(/[\s\-_]/g, '');

    return (
      normalizedCode.includes(normalizedTerm) ||
      o.orderCode.toLowerCase().includes(term) ||
      o.hoTen.toLowerCase().includes(term) ||
      (o.email && o.email.toLowerCase().includes(term)) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(term)) ||
      String(o.amount).includes(term) ||
      (term === '119k' && o.amount === 119000) ||
      (term === '49k' && o.amount === 49000) ||
      (term === '99k' && o.amount === 99000) ||
      (term.includes('vip') && (o.paymentType.includes('vip') || o.paymentType === 'reading_vip'))
    );
  });

  // Xử lý duyệt thanh toán thủ công từ Admin
  const handleApproveOrder = async (orderCode: string) => {
    const confirmApprove = window.confirm(
      `Xác nhận DUYỆT THỦ CÔNG cho đơn hàng ${orderCode}?\n\nLưu ý: Chỉ duyệt khi bạn đã kiểm tra tài khoản ngân hàng và thấy khách đã chuyển tiền thực tế.`
    );
    if (!confirmApprove) return;

    setApprovingCode(orderCode);
    try {
      const res = await fetch('/api/payment/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Đã duyệt đơn hàng ${orderCode} thành công và gửi email thông báo!`);
        onRefresh();
      } else {
        alert(`Lỗi: ${data.error || 'Không thể duyệt đơn'}`);
      }
    } catch (err: any) {
      alert(`Lỗi: ${err?.message || err}`);
    } finally {
      setApprovingCode(null);
    }
  };

  // Xử lý đổi trạng thái đơn hàng (Hủy đơn / Khôi phục) từ Admin
  const handleUpdateOrderStatus = async (orderCode: string, newStatus: 'PENDING' | 'CANCELLED') => {
    const isCancel = newStatus === 'CANCELLED';
    const msg = isCancel
      ? `Xác nhận HỦY ĐƠN / ĐÁNH DẤU TRÙNG LẶP cho đơn hàng ${orderCode}?`
      : `Xác nhận KHÔI PHỤC đơn hàng ${orderCode} về trạng thái Chờ quét QR?`;
    if (!window.confirm(msg)) return;

    try {
      const res = await fetch('/api/payment/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Đã cập nhật trạng thái đơn ${orderCode} thành công!`);
        onRefresh();
      } else {
        alert(`Lỗi: ${data.error || 'Không thể cập nhật'}`);
      }
    } catch (err: any) {
      alert(`Lỗi: ${err?.message || err}`);
    }
  };

  const paidOrdersCount = orders.filter((o) => o.status === 'PAID').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING').length;
  const cancelledOrdersCount = orders.filter((o) => o.status === 'CANCELLED').length;
  const actualOrdersRevenue = orders
    .filter((o) => o.status === 'PAID')
    .reduce((sum, o) => sum + (o.amount || 0), 0);
  const totalRevenue = actualOrdersRevenue > 0 ? actualOrdersRevenue : (stats.estimated_revenue || 0);

  return (
    <div className="space-y-6">
      {/* Thẻ Thống Kê Tổng Quan (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Doanh thu ước tính */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/30 border border-amber-500/40 shadow-lg text-slate-100 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
              Tổng doanh thu
            </span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-2">
            {totalRevenue.toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Từ các giao dịch quét VietQR</div>
        </div>

        {/* Đơn hàng VietQR */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-md text-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              Đơn hàng QR
            </span>
            <QrCode className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-100 mt-2">
            {orders.length}{' '}
            <span className="text-xs font-normal text-emerald-400">
              ({paidOrdersCount} đã thanh toán)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {pendingOrdersCount} đơn đang chờ quét
          </div>
        </div>

        {/* Tổng số lá số */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md text-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Tổng số lá số
            </span>
            <BookOpen className="w-5 h-5 text-sky-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-100 mt-2">
            {stats.total_charts}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Lập trên toàn hệ thống</div>
        </div>

        {/* Bản Pro VIP */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-md text-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              Bản Pro VIP
            </span>
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-2">
            {stats.total_pro}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Gói Luận giải chuyên sâu</div>
        </div>

        {/* Tin nhắn hỏi đáp */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md text-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Tin nhắn đàm đạo
            </span>
            <MessageSquare className="w-5 h-5 text-violet-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-100 mt-2">
            {stats.total_messages}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Tương tác cùng Thầy Tôn</div>
        </div>
      </div>

      {/* Box cấu hình Webhook tự động cho SePay / Casso */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold">
            <QrCode className="w-4 h-4 text-amber-400" />
            <span>Thông Tin Webhook Nhận Chuyển Khoản Tự Động:</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Hỗ trợ kết nối SePay, Casso, PayOS hoặc Webhook ngân hàng
          </span>
        </div>
        <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-slate-200 flex items-center justify-between gap-2 overflow-x-auto">
          <span>Webhook URL: <strong>https://tuvithayton.vn/api/payment/webhook</strong></span>
          <span className="text-[11px] text-emerald-400 shrink-0">Method: POST (JSON)</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Cú pháp nội dung chuyển khoản tự động có dạng <code className="text-amber-300">TVxxxxx</code> (Ví dụ: <strong>TV83921</strong>). Ngay khi khách quét QR chuyển khoản, hệ thống sẽ tự động bắt khớp mã đơn, mở khóa giao diện của khách ngay lập tức và gửi email biên lai kích hoạt!
        </p>
      </div>

      {/* Sub-tabs: Đơn Hàng VietQR vs Danh Sách Lá Số */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSubTab('orders')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              subTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Đơn Hàng VietQR ({orders.length})</span>
            {paidOrdersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-bold">
                {paidOrdersCount} đã thanh toán
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSubTab('charts')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              subTab === 'charts'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lịch Sử Lá Số ({charts.length})</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
          <span>Làm mới</span>
        </button>
      </div>

      {/* Khung tìm kiếm & Bộ lọc */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              subTab === 'orders'
                ? 'Tìm mã đơn TVxxxxx, tên khách, email, số tiền...'
                : 'Tìm theo họ tên đương số, email, tiêu đề...'
            }
            className="w-full pl-9 pr-8 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition"
              title="Xóa từ khóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {subTab === 'orders' ? (
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs flex-wrap">
            <button
              type="button"
              onClick={() => setFilterOrderStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                filterOrderStatus === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Tất cả ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterOrderStatus('PAID')}
              className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1 ${
                filterOrderStatus === 'PAID'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/30'
              }`}
            >
              <span>Đã thanh toán ({paidOrdersCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterOrderStatus('PENDING')}
              className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1 ${
                filterOrderStatus === 'PENDING'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/50 shadow-sm'
                  : 'text-amber-400/80 hover:text-amber-300 hover:bg-amber-950/30'
              }`}
            >
              <span>Chờ quét QR ({pendingOrdersCount})</span>
            </button>
            {cancelledOrdersCount > 0 && (
              <button
                type="button"
                onClick={() => setFilterOrderStatus('CANCELLED')}
                className={`px-3 py-1.5 rounded-lg transition font-medium flex items-center gap-1 ${
                  filterOrderStatus === 'CANCELLED'
                    ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-rose-300 hover:bg-rose-950/20'
                }`}
              >
                <span>Đã hủy / Trùng ({cancelledOrdersCount})</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setFilterTier('all')}
              className={`px-3 py-1 rounded-lg transition ${
                filterTier === 'all'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất cả
            </button>
            <button
              type="button"
              onClick={() => setFilterTier('pro')}
              className={`px-3 py-1 rounded-lg transition ${
                filterTier === 'pro'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              👑 Bản VIP Pro
            </button>
            <button
              type="button"
              onClick={() => setFilterTier('free')}
              className={`px-3 py-1 rounded-lg transition ${
                filterTier === 'free'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📜 Bản Miễn Phí
            </button>
          </div>
        )}
      </div>

      {/* BẢNG 1: DANH SÁCH ĐƠN HÀNG VIETQR */}
      {subTab === 'orders' && (
        <div className="space-y-3">
          {/* Hướng dẫn cơ chế đơn hàng cho Admin */}
          <div className="p-3 bg-slate-900/80 border border-slate-800/80 rounded-xl text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cơ chế thanh toán &amp; duyệt đơn tự động:</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px] sm:text-xs">
              <span className="text-emerald-400 font-semibold">• Đã thanh toán:</span> Tiền đã vào tài khoản ngân hàng thực tế, hệ thống SePay tự động khớp mã đơn <code className="text-amber-300 font-mono">TVxxxxx</code>, mở khóa gói dịch vụ và gửi email biên lai tự động 100%. Admin <strong>không cần làm gì</strong>.<br />
              <span className="text-amber-300/80 font-semibold">• Chờ quét QR:</span> Khách vừa bấm nút thanh toán để mở mã QR nhưng chưa chuyển khoản hoặc đã hủy bỏ. Khách <strong>chưa bị trừ tiền</strong> và đơn ở trạng thái chờ.<br />
              <span className="text-sky-400 font-semibold">• Nút [Duyệt tay]:</span> Chỉ dùng để dự phòng khi khách báo đã chuyển khoản thành công nhưng ngân hàng bị trễ webhook. Admin sau khi kiểm tra tài khoản thực tế mới bấm nút này.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {isLoading ? (
              <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                <span className="text-sm">Đang tải danh sách đơn hàng...</span>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm italic">
                {searchTerm ? 'Không tìm thấy đơn hàng phù hợp.' : 'Chưa có đơn hàng nào được tạo.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                  <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Mã Đơn / Nội dung</th>
                      <th className="py-3 px-4">Khách Hàng / Email</th>
                      <th className="py-3 px-4">Gói Dịch Vụ</th>
                      <th className="py-3 px-4 text-right">Số Tiền</th>
                      <th className="py-3 px-4 text-center">Trạng Thái</th>
                      <th className="py-3 px-4">Thời Gian</th>
                      <th className="py-3 px-4 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredOrders.map((ord) => {
                      const isPaid = ord.status === 'PAID';
                      const dateStr = ord.createdAt
                        ? new Date(ord.createdAt).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—';

                      let serviceLabel = 'Luận Giải VIP (119k)';
                      if (ord.paymentType === 'chat_vip') serviceLabel = 'Hỏi Thầy VIP (99k)';
                      else if (ord.paymentType === 'chat_free') serviceLabel = 'Hỏi Thầy Thường (49k)';

                      return (
                        <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4">
                            <span className="font-mono font-bold text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30 text-xs">
                              {ord.orderCode}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-200">{ord.hoTen}</div>
                            {ord.email ? (
                              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 shrink-0" />
                                <span>{ord.email}</span>
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-500 italic">Chưa nhập email</div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-slate-200 text-xs">
                              {serviceLabel}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <span className="font-bold text-emerald-400 font-mono">
                              {ord.amount.toLocaleString('vi-VN')} đ
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center">
                            {ord.status === 'PAID' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Đã thanh toán</span>
                              </span>
                            ) : ord.status === 'CANCELLED' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-medium">
                                <X className="w-3.5 h-3.5 text-rose-400" />
                                <span>Đã hủy / Bị trùng</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-medium">
                                <Clock className="w-3.5 h-3.5 text-amber-400" />
                                <span>Chờ quét QR</span>
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-xs text-slate-400">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-500" />
                              <span>{dateStr}</span>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {ord.status === 'PAID' ? (
                                <>
                                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Tự động xong</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateOrderStatus(ord.orderCode, 'CANCELLED')}
                                    className="p-1 text-slate-500 hover:text-rose-400 transition rounded"
                                    title="Hủy / Đánh dấu trùng lặp đơn này"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </>
                              ) : ord.status === 'CANCELLED' ? (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateOrderStatus(ord.orderCode, 'PENDING')}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 text-xs font-medium rounded-lg border border-slate-700/60 transition"
                                  title="Khôi phục lại đơn hàng này về trạng thái Chờ quét QR"
                                >
                                  <RefreshCw className="w-3 h-3 text-amber-400" />
                                  <span>Khôi phục</span>
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleApproveOrder(ord.orderCode)}
                                    disabled={approvingCode === ord.orderCode}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 hover:text-amber-300 text-slate-300 text-xs font-medium rounded-lg border border-slate-700/60 shadow-sm transition disabled:opacity-50"
                                    title="Duyệt tay thủ công nếu khách đã chuyển khoản mà webhook bị trễ"
                                  >
                                    <Zap className="w-3 h-3 text-amber-400" />
                                    <span>
                                      {approvingCode === ord.orderCode ? 'Đang duyệt...' : 'Duyệt tay'}
                                    </span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateOrderStatus(ord.orderCode, 'CANCELLED')}
                                    className="p-1 text-slate-500 hover:text-rose-400 transition rounded"
                                    title="Hủy đơn hoặc đánh dấu trùng lặp"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* BẢNG 2: DANH SÁCH LÁ SỐ */}
      {subTab === 'charts' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
              <span className="text-sm">Đang tải lịch sử lá số...</span>
            </div>
          ) : filteredCharts.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm italic">
              {searchTerm ? 'Không tìm thấy lá số phù hợp từ khóa.' : 'Chưa có dữ liệu lá số nào.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-300">
                <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Đương số</th>
                    <th className="py-3 px-4">Gói dịch vụ</th>
                    <th className="py-3 px-4 text-center">Bình giải</th>
                    <th className="py-3 px-4 text-center">Hỏi đáp</th>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredCharts.map((c) => {
                    const ds = c.duong_so_data || ({} as any);
                    const isPro = ds.tier === 'pro' || c.laso_data?.tier === 'pro';
                    const dateStr = c.created_at
                      ? new Date(c.created_at).toLocaleDateString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '—';

                    return (
                      <tr key={c.id} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-200">
                            {ds.hoTen || c.title}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {ds.gioiTinh} • Sinh {ds.ngayDuong}/{ds.thangDuong}/{ds.namDuong} (
                            {GIO_ARR[ds.gioSinhVal]?.label || ds.gioSinhVal || '—'})
                          </div>
                          {c.user_email && (
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                              Khách: {c.user_email}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {isPro ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-sm">
                              <Crown className="w-3.5 h-3.5 text-amber-400" />
                              <span>Bản Pro VIP (119k)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium">
                              <span>📜 Bản Free (0đ)</span>
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          {c.has_reading ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Đã luận giải</span>
                            </span>
                          ) : (
                            <span className="text-slate-500 text-xs">Chưa tạo</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-semibold">
                            <MessageSquare className="w-3 h-3" />
                            <span>{c.message_count} câu</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 text-xs text-slate-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>{dateStr}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setPreviewChart(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold border border-slate-700 transition"
                            title="Xem chi tiết lá số này"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Xem lá số</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Xem Nhanh Lá Số Khách Hàng */}
      {previewChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col text-slate-200 overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-amber-400 font-serif">
                    Xem Lá Số Khách Hàng: {previewChart.duong_so_data?.hoTen || previewChart.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Gói:{' '}
                    {previewChart.duong_so_data?.tier === 'pro'
                      ? '👑 Bản Chuyên Sâu Pro (119.000đ)'
                      : '📜 Bản Miễn Phí'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewChart(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
              {previewChart.laso_data ? (
                <LaSoBanCo laSo={previewChart.laso_data} onReset={() => setPreviewChart(null)} />
              ) : (
                <p className="text-slate-400 italic">Không có dữ liệu bàn cờ lá số.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
