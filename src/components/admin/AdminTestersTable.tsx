'use client';

import React, { useState } from 'react';
import { TesterAccount } from '@/types/tester';
import {
  FlaskConical,
  Plus,
  Search,
  RefreshCw,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  BookOpen,
  MessageSquare,
  AlertCircle,
  X,
  Sparkles,
} from 'lucide-react';

interface AdminTestersTableProps {
  testers: TesterAccount[];
  isLoading: boolean;
  onRefresh: () => void;
  adminPin: string;
}

export default function AdminTestersTable({
  testers,
  isLoading,
  onRefresh,
  adminPin,
}: AdminTestersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal Thêm mới
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [createFullName, setCreateFullName] = useState('');
  const [createMaxCharts, setCreateMaxCharts] = useState(5);
  const [createMaxQuestions, setCreateMaxQuestions] = useState(5);
  const [createNotes, setCreateNotes] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');

  // Modal Chỉnh sửa
  const [editingTester, setEditingTester] = useState<TesterAccount | null>(null);
  const [editMaxCharts, setEditMaxCharts] = useState(5);
  const [editMaxQuestions, setEditMaxQuestions] = useState(5);
  const [editFullName, setEditFullName] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Lọc tester
  const filteredTesters = testers.filter((t) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      t.email.toLowerCase().includes(term) ||
      t.fullName.toLowerCase().includes(term) ||
      (t.notes && t.notes.toLowerCase().includes(term))
    );
  });

  // Thống kê tổng quan
  const totalTesters = testers.length;
  const activeTesters = testers.filter((t) => t.isActive).length;
  const totalChartsUsed = testers.reduce((sum, t) => sum + (t.chartsUsed || 0), 0);
  const totalQuestionsUsed = testers.reduce((sum, t) => sum + (t.questionsUsed || 0), 0);

  // Sinh mật khẩu ngẫu nhiên
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pass = 'TuVi2026';
    for (let i = 0; i < 4; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Copy thông điệp gửi Tester
  const copyTesterInvite = (tester: TesterAccount) => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://www.tuvithayton.vn';
    const text = `🌟 THÔNG TIN TÀI KHOẢN TRẢI NGHIỆM TỬ VI THẦY TÔN AI:
------------------------------------------
🌐 Địa chỉ website: ${siteUrl}
👤 Email đăng nhập: ${tester.email}
🔑 Mật khẩu: ${tester.passwordPlain || '(Mật khẩu bạn đã thiết lập)'}

🎯 QUYỀN LỢI ĐẶC QUYỀN CỦA TESTER:
- Được lập tối đa: ${tester.maxCharts >= 999 ? 'Không giới hạn' : `${tester.maxCharts} lá số`} VIP Pro trọn đời
- Mỗi lá số được hỏi: ${tester.maxQuestionsPerChart >= 999 ? 'Không giới hạn' : `${tester.maxQuestionsPerChart} câu hỏi Chuyên Sâu`} cùng Thầy Tôn
- Mở khóa trọn bộ Luận giải AI, Tứ Hóa, xem hạn các năm

👉 Anh/chị vào trang web bấm nút "Đăng Nhập" ở góc trên cùng để bắt đầu trải nghiệm nhé!`;

    navigator.clipboard.writeText(text);
    setCopiedId(tester.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Xử lý tạo mới Tester
  const handleCreateTester = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');
    setCreateLoading(true);

    try {
      const res = await fetch('/api/admin/testers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
        body: JSON.stringify({
          action: 'create',
          email: createEmail,
          password: createPassword,
          fullName: createFullName,
          maxCharts: createMaxCharts,
          maxQuestionsPerChart: createMaxQuestions,
          notes: createNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setCreateError(data.error || 'Lỗi khi tạo tài khoản tester');
      } else {
        setIsCreateOpen(false);
        setCreateEmail('');
        setCreatePassword('');
        setCreateFullName('');
        setCreateNotes('');
        onRefresh();
      }
    } catch (err: any) {
      setCreateError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setCreateLoading(false);
    }
  };

  // Mở modal sửa
  const openEditModal = (t: TesterAccount) => {
    setEditingTester(t);
    setEditFullName(t.fullName);
    setEditPassword(t.passwordPlain || '');
    setEditMaxCharts(t.maxCharts);
    setEditMaxQuestions(t.maxQuestionsPerChart);
    setEditNotes(t.notes || '');
    setEditError('');
  };

  // Xử lý cập nhật Tester
  const handleUpdateTester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTester) return;
    setEditError('');
    setEditLoading(true);

    try {
      const res = await fetch('/api/admin/testers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
        body: JSON.stringify({
          action: 'update',
          id: editingTester.id,
          email: editingTester.email,
          fullName: editFullName,
          passwordPlain: editPassword,
          maxCharts: editMaxCharts,
          maxQuestionsPerChart: editMaxQuestions,
          notes: editNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setEditError(data.error || 'Lỗi khi cập nhật tester');
      } else {
        setEditingTester(null);
        onRefresh();
      }
    } catch (err: any) {
      setEditError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setEditLoading(false);
    }
  };

  // Bật/tắt trạng thái
  const handleToggleActive = async (tester: TesterAccount) => {
    try {
      const res = await fetch('/api/admin/testers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
        body: JSON.stringify({
          action: 'toggle',
          id: tester.id,
          isActive: !tester.isActive,
        }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.warn('Lỗi bật/tắt tester:', err);
    }
  };

  // Xóa tester
  const handleDeleteTester = async (tester: TesterAccount) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản tester "${tester.email}" không?`)) return;

    try {
      const res = await fetch('/api/admin/testers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
        body: JSON.stringify({
          action: 'delete',
          id: tester.id,
        }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.warn('Lỗi xóa tester:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Thẻ Thống Kê Tổng Quan */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">Tổng Tester</div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-amber-400 mt-1">
            {totalTesters}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Tài khoản được cấp quyền</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">Đang Hoạt Động</div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-emerald-400 mt-1">
            {activeTesters}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Sẵn sàng trải nghiệm</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">Lá Số Đã Lập</div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-blue-400 mt-1 flex items-center gap-1.5">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span>{totalChartsUsed}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Do các tester khởi tạo</div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="text-xs text-slate-400">Câu Hỏi Đã Hỏi</div>
          <div className="text-xl sm:text-2xl font-bold font-serif text-purple-400 mt-1 flex items-center gap-1.5">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span>{totalQuestionsUsed}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Đàm đạo cùng Thầy Tôn</div>
        </div>
      </div>

      {/* Bảng Dữ Liệu Tester */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
        {/* Header & Công cụ */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-100 font-serif flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-amber-400" />
              <span>Quản Lý Tài Khoản Tester ({testers.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Cấp tài khoản trải nghiệm, chỉnh số lượng lá số tối đa và số câu hỏi tối đa cho mỗi lá số.
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm email, họ tên..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950/70 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Làm mới"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => {
                setCreatePassword(generateRandomPassword());
                setIsCreateOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Tester Mới</span>
            </button>
          </div>
        </div>

        {/* Nội dung bảng */}
        {isLoading ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
            <span className="text-sm">Đang tải danh sách tài khoản tester...</span>
          </div>
        ) : filteredTesters.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm italic space-y-3">
            <p>{searchTerm ? 'Không tìm thấy tester phù hợp từ khóa.' : 'Chưa có tài khoản tester nào được tạo.'}</p>
            {!searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setCreatePassword(generateRandomPassword());
                  setIsCreateOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                <span>Bấm vào đây để tạo tài khoản Tester đầu tiên</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tester / Ghi chú</th>
                  <th className="py-3 px-4">Email &amp; Mật khẩu</th>
                  <th className="py-3 px-4 text-center">Hạn mức Lá số</th>
                  <th className="py-3 px-4 text-center">Câu hỏi / Lá</th>
                  <th className="py-3 px-4 text-center">Đã hỏi</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTesters.map((t) => {
                  const chartsRatio = `${t.chartsUsed || 0} / ${t.maxCharts >= 999 ? '∞' : t.maxCharts}`;
                  const isChartsMaxed = (t.chartsUsed || 0) >= t.maxCharts;

                  return (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition">
                      {/* Tester / Tên */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-700/20 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-xs">
                            {t.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                              <span>{t.fullName}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Tester
                              </span>
                            </div>
                            {t.notes && <div className="text-[11px] text-slate-400 italic">{t.notes}</div>}
                          </div>
                        </div>
                      </td>

                      {/* Email & Mật khẩu */}
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 font-mono text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-slate-500" />
                            <span>{t.email}</span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-xs text-amber-300">
                            <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                            <span>
                              {visiblePasswords[t.id]
                                ? t.passwordPlain || '••••••••'
                                : '••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(t.id)}
                              className="text-slate-500 hover:text-slate-300 transition"
                              title={visiblePasswords[t.id] ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            >
                              {visiblePasswords[t.id] ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Hạn mức Lá số */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                              isChartsMaxed
                                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            }`}
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{chartsRatio} lá</span>
                          </span>
                          <span className="text-[10px] text-slate-500 mt-0.5">
                            {isChartsMaxed ? 'Đã hết lượt tạo' : 'Còn lượt tạo'}
                          </span>
                        </div>
                      </td>

                      {/* Số câu hỏi tối đa / lá */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                          <Sparkles className="w-3 h-3" />
                          <span>{t.maxQuestionsPerChart >= 999 ? 'Không giới hạn' : `${t.maxQuestionsPerChart} câu / lá`}</span>
                        </span>
                      </td>

                      {/* Đã hỏi thực tế */}
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                          <MessageSquare className="w-3 h-3 text-purple-400" />
                          <span>{t.questionsUsed || 0} câu</span>
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(t)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
                            t.isActive
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-slate-800 text-slate-500 border-slate-700 hover:bg-slate-700'
                          }`}
                          title="Bấm để Khóa / Mở khóa"
                        >
                          {t.isActive ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          <span>{t.isActive ? 'Hoạt động' : 'Tạm khóa'}</span>
                        </button>
                      </td>

                      {/* Thao tác */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Nút Copy thông tin gửi Tester */}
                          <button
                            type="button"
                            onClick={() => copyTesterInvite(t)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 transition"
                            title="Sao chép tin nhắn kèm mật khẩu gửi cho Tester"
                          >
                            {copiedId === t.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Nút Chỉnh sửa */}
                          <button
                            type="button"
                            onClick={() => openEditModal(t)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-500/20 text-slate-300 hover:text-blue-300 border border-slate-700 transition"
                            title="Chỉnh sửa hạn mức & thông tin"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Nút Xóa */}
                          <button
                            type="button"
                            onClick={() => handleDeleteTester(t)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-700 transition"
                            title="Xóa tài khoản tester"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* MODAL TẠO TÀI KHOẢN TESTER MỚI */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-slate-100 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base font-serif text-amber-400">
                    Thêm Tài Khoản Tester Mới
                  </h4>
                  <p className="text-xs text-slate-400">
                    Cấp quyền VIP Pro và thiết lập hạn mức riêng cho tester.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {createError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{createError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTester} className="space-y-4 text-xs sm:text-sm">
              {/* Email */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Email đăng nhập <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="ví dụ: tester1@tuvi.vn hoặc email của tester"
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Mật khẩu */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">
                    Mật khẩu khởi tạo <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCreatePassword(generateRandomPassword())}
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                  >
                    🎲 Tạo ngẫu nhiên
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  placeholder="Mật khẩu tối thiểu 6 ký tự"
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Họ tên / Ghi chú */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Họ và tên / Ghi chú Tester
                </label>
                <input
                  type="text"
                  value={createFullName}
                  onChange={(e) => setCreateFullName(e.target.value)}
                  placeholder="ví dụ: Tester Nguyễn Văn A - Nhóm Hà Nội"
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Hạn mức số lá số tối đa */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">
                    Số lá số tối đa được tạo: <b className="text-amber-400">{createMaxCharts >= 999 ? 'Không giới hạn' : `${createMaxCharts} lá`}</b>
                  </label>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {[1, 3, 5, 10, 999].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCreateMaxCharts(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                        createMaxCharts === val
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {val === 999 ? 'Không giới hạn' : `${val} lá`}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={createMaxCharts}
                  onChange={(e) => setCreateMaxCharts(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Hạn mức số câu hỏi tối đa cho MỖI LÁ SỐ */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">
                    Số câu hỏi tối đa cho MỖI lá số: <b className="text-amber-400">{createMaxQuestions >= 999 ? 'Không giới hạn' : `${createMaxQuestions} câu VIP`}</b>
                  </label>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {[2, 5, 10, 20, 999].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setCreateMaxQuestions(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                        createMaxQuestions === val
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {val === 999 ? 'Không giới hạn' : `${val} câu`}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={createMaxQuestions}
                  onChange={(e) => setCreateMaxQuestions(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Nút submit */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
                >
                  {createLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  <span>{createLoading ? 'Đang tạo...' : 'Tạo Tài Khoản Tester'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CHỈNH SỬA HẠN MỨC TESTER */}
      {editingTester && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-slate-100 space-y-5 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-base font-serif text-amber-400">
                    Chỉnh Sửa Hạn Mức Tester
                  </h4>
                  <p className="text-xs text-slate-400 font-mono">{editingTester.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingTester(null)}
                className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateTester} className="space-y-4 text-xs sm:text-sm">
              {/* Họ tên */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Họ và tên Tester
                </label>
                <input
                  type="text"
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Mật khẩu */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Mật khẩu hiển thị / ghi nhớ
                </label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl font-mono text-amber-300 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Hạn mức số lá số tối đa */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">
                    Số lá số tối đa: <b className="text-amber-400">{editMaxCharts >= 999 ? 'Không giới hạn' : `${editMaxCharts} lá`}</b>
                  </label>
                  <span className="text-[11px] text-slate-400">Đã tạo: {editingTester.chartsUsed || 0} lá</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {[1, 3, 5, 10, 20, 999].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEditMaxCharts(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                        editMaxCharts === val
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {val === 999 ? 'Không giới hạn' : `${val} lá`}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={editMaxCharts}
                  onChange={(e) => setEditMaxCharts(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Hạn mức số câu hỏi tối đa cho MỖI LÁ SỐ */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-300 font-semibold">
                    Số câu hỏi tối đa cho MỖI lá: <b className="text-amber-400">{editMaxQuestions >= 999 ? 'Không giới hạn' : `${editMaxQuestions} câu VIP`}</b>
                  </label>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  {[2, 5, 10, 20, 50, 999].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setEditMaxQuestions(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                        editMaxQuestions === val
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {val === 999 ? 'Không giới hạn' : `${val} câu`}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={editMaxQuestions}
                  onChange={(e) => setEditMaxQuestions(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Ghi chú phân loại tester
                </label>
                <input
                  type="text"
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Ghi chú riêng của Thầy Tôn..."
                  className="w-full px-3.5 py-2 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Nút lưu */}
              <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTester(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold transition"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
                >
                  {editLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>{editLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
