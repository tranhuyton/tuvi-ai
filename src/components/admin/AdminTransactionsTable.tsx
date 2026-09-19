'use client';

import React, { useState } from 'react';
import { DuLieuDuongSo, LaSoData } from '@/types/tuvi';
import { DollarSign, BookOpen, Crown, Sparkles, MessageSquare, Search, Eye, Calendar, RefreshCw, X } from 'lucide-react';
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

export interface AdminStats {
  total_users: number;
  total_charts: number;
  total_pro: number;
  total_free: number;
  total_messages: number;
  estimated_revenue: number;
}

interface AdminTransactionsTableProps {
  charts: AdminChartItem[];
  stats: AdminStats;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function AdminTransactionsTable({
  charts,
  stats,
  isLoading,
  onRefresh,
}: AdminTransactionsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTier, setFilterTier] = useState<'all' | 'free' | 'pro'>('all');
  const [previewChart, setPreviewChart] = useState<AdminChartItem | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Thẻ Thống Kê Tổng Quan (KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Doanh thu ước tính */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-900/30 border border-amber-500/40 shadow-lg text-slate-100 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Ước tính doanh thu</span>
            <DollarSign className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-2">
            {(stats.estimated_revenue || 0).toLocaleString('vi-VN')} đ
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Từ các gói Luận giải VIP 119k</div>
        </div>

        {/* Tổng số lá số */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md text-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tổng số lá số</span>
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
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Bản Pro VIP (119k)</span>
            <Crown className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-300 mt-2">
            {stats.total_pro}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Tỷ lệ {stats.total_charts > 0 ? Math.round((stats.total_pro / stats.total_charts) * 100) : 0}%
          </div>
        </div>

        {/* Bản Free */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md text-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Bản Miễn Phí</span>
            <Sparkles className="w-5 h-5 text-slate-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-200 mt-2">
            {stats.total_free}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Gói cơ bản khởi nguyên</div>
        </div>

        {/* Lượt hỏi đáp */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md text-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Lượt hỏi đáp</span>
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-300 mt-2">
            {stats.total_messages}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Câu đàm đạo Thầy Tôn</div>
        </div>
      </div>

      {/* Bảng Danh Sách Lá Số & Giao Dịch */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-100 font-serif flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span>Lịch Sử Giao Dịch &amp; Quản Lý Lá Số ({charts.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Toàn bộ lá số được khách hàng tạo và lưu trữ trên hệ thống.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            {/* Bộ lọc Gói */}
            <div className="flex rounded-lg overflow-hidden border border-slate-700 bg-slate-950/60 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setFilterTier('all')}
                className={`px-2.5 py-1 rounded transition ${
                  filterTier === 'all' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setFilterTier('pro')}
                className={`px-2.5 py-1 rounded transition ${
                  filterTier === 'pro' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Chỉ Pro VIP
              </button>
              <button
                type="button"
                onClick={() => setFilterTier('free')}
                className={`px-2.5 py-1 rounded transition ${
                  filterTier === 'free' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Bản Free
              </button>
            </div>

            {/* Ô tìm kiếm */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm tên hoặc mã..."
                className="w-full pl-9 pr-3 py-1 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table */}
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
                          {ds.gioiTinh} • Sinh {ds.ngayDuong}/{ds.thangDuong}/{ds.namDuong} ({GIO_ARR[ds.gioSinhVal]?.label || ds.gioSinhVal || '—'})
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
                    Gói: {previewChart.duong_so_data?.tier === 'pro' ? '👑 Bản Chuyên Sâu Pro (119.000đ)' : '📜 Bản Miễn Phí'}
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
