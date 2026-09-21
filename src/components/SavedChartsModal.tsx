'use client';

import React, { useState, useEffect } from 'react';
import { SavedChart, getUserCharts, deleteChart } from '@/lib/tuviService';
import { X, BookOpen, Trash2, Calendar, MessageSquare, Sparkles, Search, PlusCircle } from 'lucide-react';

interface SavedChartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectChart: (chartId: string) => void;
  onNewChart: () => void;
  onUpgradeChart?: (chartId: string) => void;
  activeChartId?: string | null;
}

export default function SavedChartsModal({
  isOpen,
  onClose,
  onSelectChart,
  onNewChart,
  onUpgradeChart,
  activeChartId,
}: SavedChartsModalProps) {
  const [charts, setCharts] = useState<SavedChart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCharts = async () => {
    setIsLoading(true);
    const res = await getUserCharts();
    setCharts(res.charts);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchCharts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (e: React.MouseEvent, chartId: string, title: string) => {
    e.stopPropagation();
    if (!confirm(`Bạn có chắc chắn muốn xóa lá số "${title}" khỏi sổ tay không?`)) return;

    setDeletingId(chartId);
    const res = await deleteChart(chartId);
    if (res.success) {
      setCharts((prev) => prev.filter((c) => c.id !== chartId));
    } else {
      alert('Không thể xóa lá số: ' + res.error);
    }
    setDeletingId(null);
  };

  const filteredCharts = charts.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.duong_so_data?.hoTen?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[88vh] bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl flex flex-col text-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-400 flex items-center gap-2">
                Sổ Tay Mệnh Số Của Bạn
              </h2>
              <p className="text-sm sm:text-xs text-slate-300">
                {charts.length} lá số đã lưu kèm trọn bộ lời bình giải &amp; lịch sử hỏi đáp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar & Nút thêm mới */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800/80 bg-slate-950/40 flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên đương số..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-base sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400/80"
            />
          </div>
          <button
            onClick={() => {
              onClose();
              onNewChart();
            }}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Lập Lá Số Mới</span>
          </button>
        </div>

        {/* Danh sách lá số */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
              <p className="text-sm sm:text-xs">Đang mở sổ tay mệnh số...</p>
            </div>
          ) : filteredCharts.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-500">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-base sm:text-sm font-medium">Chưa có lá số nào trong sổ tay</p>
              <p className="text-sm sm:text-xs text-slate-400 mt-1">
                Lập một lá số mới để Thầy Tôn bình giải và tự động lưu vào đây nhé!
              </p>
            </div>
          ) : (
            filteredCharts.map((chart) => {
              const isActive = chart.id === activeChartId;
              const hasReading = !!chart.reading_html;
              const msgCount = chart.message_count || 0;
              const ds = chart.duong_so_data;
              const tier = ds?.tier || chart.laso_data?.tier || (chart.reading_html?.includes('Bản Pro') || chart.reading_html?.includes('CHUYÊN SÂU PRO') ? 'pro' : 'free');
              const isPro = tier === 'pro';

              return (
                <div
                  key={chart.id}
                  onClick={() => onSelectChart(chart.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-center justify-between gap-4 group ${
                    isActive
                      ? 'bg-amber-500/15 border-amber-500/60 shadow-md shadow-amber-500/10'
                      : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/40 hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <h3 className="font-bold text-base sm:text-base text-slate-100 group-hover:text-amber-300 transition truncate">
                        {ds?.hoTen || chart.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          ds?.gioiTinh === 'Nữ'
                            ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                            : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        }`}
                      >
                        {ds?.gioiTinh || 'Nam'}
                      </span>
                      {hasReading && (
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                            isPro
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {isPro ? '👑 Bản Pro' : '📜 Bản Miễn Phí'}
                        </span>
                      )}
                      {isActive && (
                        <span className="text-xs bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                          Đang xem
                        </span>
                      )}
                    </div>

                    <div className="text-sm sm:text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Sinh: {ds?.ngayDuong}/{ds?.thangDuong}/{ds?.namDuong}
                      </span>

                      {hasReading ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <Sparkles className="w-3.5 h-3.5" />
                          Đã có bình giải
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Chưa bình giải</span>
                      )}

                      {msgCount > 0 && (
                        <span className="flex items-center gap-1 text-sky-400">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {msgCount} lượt hỏi đáp
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {hasReading && !isPro && onUpgradeChart && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpgradeChart(chart.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg text-xs shadow transition transform hover:-translate-y-0.5"
                        title="Nâng cấp lên Bản Pro Chuyên Sâu"
                      >
                        <Sparkles className="w-3 h-3 fill-slate-950" />
                        <span className="hidden sm:inline">Nâng cấp Pro</span>
                        <span className="sm:hidden">Pro</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, chart.id, ds?.hoTen || chart.title)}
                      disabled={deletingId === chart.id}
                      className="p-2 text-slate-500 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                      title="Xóa lá số này"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
