'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Copy,
  Check,
  Plus,
  Search,
  DollarSign,
  TrendingUp,
  MousePointerClick,
  ShoppingBag,
  CreditCard,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  X,
  RefreshCw,
  QrCode,
  AlertCircle,
} from 'lucide-react';
import {
  AffiliateItem,
  AffiliateTierCommissions,
  CommissionMode,
  DEFAULT_TIER_COMMISSIONS,
  inferBankCode,
} from '@/types/affiliate';
import { AdminOrderItem } from './AdminTransactionsTable';
import { getAdminAuthHeaders } from '@/lib/adminClientAuth';

interface AdminAffiliatesTableProps {
  affiliates: AffiliateItem[];
  orders: AdminOrderItem[];
  onRefresh: () => void;
}

function getOrderTypeLabel(paymentType: string): string {
  switch (paymentType) {
    case 'course_tuvi':
      return 'Khóa Học Tử Vi 699k';
    case 'reading_expert':
      return 'Bản Expert 269k';
    case 'upgrade_expert':
      return 'Nâng Cấp Expert 150k';
    case 'chat_expert':
      return 'Chat Expert 129k';
    case 'reading_vip':
      return 'Bản Pro 119k';
    case 'chat_vip':
      return 'Chat Pro 99k';
    default:
      return 'Chat Cơ Bản 49k';
  }
}

export default function AdminAffiliatesTable({
  affiliates,
  orders,
  onRefresh,
}: AdminAffiliatesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal thêm / sửa CTV
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliateItem | null>(null);
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    phone: string;
    email: string;
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
    commissionMode: CommissionMode;
    commissionRate: number;
    commissionFixed: string;
    commissionTiers: AffiliateTierCommissions;
    notes: string;
  }>({
    code: '',
    name: '',
    phone: '',
    email: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
    commissionMode: 'tier',
    commissionRate: 25,
    commissionFixed: '',
    commissionTiers: { ...DEFAULT_TIER_COMMISSIONS },
    notes: '',
  });

  // Modal thanh toán hoa hồng (Payout)
  const [payoutModalAff, setPayoutModalAff] = useState<AffiliateItem | null>(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNote, setPayoutNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isFormModalOpen && !payoutModalAff) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFormModalOpen(false);
        setPayoutModalAff(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFormModalOpen, payoutModalAff]);

  // Thống kê tổng hợp
  const totalAffiliates = affiliates.length;
  const totalClicks = affiliates.reduce((sum, a) => sum + (a.totalClicks || 0), 0);
  const totalOrders = affiliates.reduce((sum, a) => sum + (a.totalOrders || 0), 0);
  const totalRevenue = affiliates.reduce((sum, a) => sum + (a.totalRevenue || 0), 0);
  const totalCommission = affiliates.reduce((sum, a) => sum + (a.totalCommission || 0), 0);
  const paidCommission = affiliates.reduce((sum, a) => sum + (a.paidCommission || 0), 0);
  const remainingCommission = totalCommission - paidCommission;

  // Lọc theo từ khóa
  const filteredAffiliates = affiliates.filter((a) => {
    const q = searchTerm.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      (a.phone && a.phone.includes(q)) ||
      (a.bankAccountNumber && a.bankAccountNumber.includes(q))
    );
  });

  // Copy link giới thiệu
  const handleCopyLink = (code: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.tuvithayton.vn';
    const link = `${origin}/?ref=${code}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }).catch(() => {});
  };

  // Mở modal tạo mới
  const handleOpenCreateModal = () => {
    setEditingAffiliate(null);
    setFormData({
      code: '',
      name: '',
      phone: '',
      email: '',
      bankName: '',
      bankAccountNumber: '',
      bankAccountName: '',
      commissionMode: 'tier',
      commissionRate: 25,
      commissionFixed: '',
      commissionTiers: { ...DEFAULT_TIER_COMMISSIONS },
      notes: '',
    });
    setIsFormModalOpen(true);
  };

  // Mở modal sửa
  const handleOpenEditModal = (aff: AffiliateItem) => {
    setEditingAffiliate(aff);
    const inferredMode: CommissionMode =
      aff.commissionMode ||
      (aff.commissionTiers ? 'tier' : aff.commissionFixed && aff.commissionFixed > 0 ? 'fixed' : 'percent');

    setFormData({
      code: aff.code,
      name: aff.name,
      phone: aff.phone || '',
      email: aff.email || '',
      bankName: aff.bankName || '',
      bankAccountNumber: aff.bankAccountNumber || '',
      bankAccountName: aff.bankAccountName || '',
      commissionMode: inferredMode,
      commissionRate: aff.commissionRate ?? 25,
      commissionFixed: aff.commissionFixed ? String(aff.commissionFixed) : '',
      commissionTiers: {
        ...DEFAULT_TIER_COMMISSIONS,
        ...(aff.commissionTiers || {}),
      },
      notes: aff.notes || '',
    });
    setIsFormModalOpen(true);
  };

  // Lưu thông tin CTV (Tạo hoặc Sửa)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) {
      alert('Vui lòng nhập Mã giới thiệu và Tên CTV');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        action: editingAffiliate ? 'update' : 'create',
        code: formData.code.trim().toLowerCase(),
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        bankName: formData.bankName.trim() || undefined,
        bankAccountNumber: formData.bankAccountNumber.trim() || undefined,
        bankAccountName: formData.bankAccountName.trim() || undefined,
        commissionMode: formData.commissionMode,
        commissionRate: Number(formData.commissionRate || 25),
        commissionFixed:
          formData.commissionMode === 'fixed' && formData.commissionFixed
            ? Number(formData.commissionFixed)
            : null,
        commissionTiers:
          formData.commissionMode === 'tier'
            ? {
                reading_vip: Number(formData.commissionTiers.reading_vip || 0),
                reading_expert: Number(formData.commissionTiers.reading_expert || 0),
                upgrade_expert: Number(formData.commissionTiers.upgrade_expert || 0),
                chat_free: Number(formData.commissionTiers.chat_free || 0),
                chat_vip: Number(formData.commissionTiers.chat_vip || 0),
                chat_expert: Number(formData.commissionTiers.chat_expert || 0),
                course_tuvi: Number(formData.commissionTiers.course_tuvi ?? DEFAULT_TIER_COMMISSIONS.course_tuvi ?? 200000),
              }
            : null,
        notes: formData.notes.trim() || undefined,
      };

      if (editingAffiliate) {
        payload.id = editingAffiliate.id;
      }

      const headers = await getAdminAuthHeaders({ 'Content-Type': 'application/json' });
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Thao tác không thành công');
        return;
      }

      setIsFormModalOpen(false);
      onRefresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      alert('Lỗi: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa CTV
  const handleDeleteAffiliate = async (aff: AffiliateItem) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa CTV "${aff.name}" (Mã: ${aff.code})?`)) return;

    try {
      const headers = await getAdminAuthHeaders({ 'Content-Type': 'application/json' });
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'delete', id: aff.id }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onRefresh();
      } else {
        alert(data.error || 'Không thể xóa');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert('Lỗi: ' + msg);
    }
  };

  // Xác nhận đối soát / Thanh toán hoa hồng
  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutModalAff || !payoutAmount || Number(payoutAmount) <= 0) {
      alert('Vui lòng nhập số tiền thanh toán hợp lệ');
      return;
    }

    setIsSubmitting(true);
    try {
      const headers = await getAdminAuthHeaders({ 'Content-Type': 'application/json' });
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'payout',
          id: payoutModalAff.id,
          amount: Number(payoutAmount),
          note: payoutNote.trim() || 'Chuyển khoản qua ngân hàng',
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPayoutModalAff(null);
        setPayoutAmount('');
        setPayoutNote('');
        onRefresh();
        alert('Đã cập nhật trạng thái thanh toán hoa hồng thành công!');
      } else {
        alert(data.error || 'Lỗi cập nhật thanh toán');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      alert('Lỗi: ' + msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pendingRequests = affiliates.filter((a) => (a.pendingWithdrawal || 0) > 0);

  return (
    <div className="space-y-6 text-slate-100">
      {/* 0. THÔNG BÁO YÊU CẦU RÚT TIỀN TỪ CTV (NẾU CÓ) */}
      {pendingRequests.length > 0 && (
        <div className="bg-amber-950/60 border border-amber-500/45 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <div className="text-sm">
              <span className="font-bold text-amber-300">
                Có {pendingRequests.length} yêu cầu rút tiền từ CTV:
              </span>{' '}
              <span className="text-amber-100">
                {pendingRequests
                  .map((a) => `${a.name} (${(a.pendingWithdrawal || 0).toLocaleString('vi-VN')}đ)`)
                  .join(', ')}
              </span>
            </div>
          </div>
          <span className="text-xs text-amber-200 bg-amber-500/15 border border-amber-500/35 px-2.5 py-1 rounded-lg font-medium shrink-0">
            👉 Bấm nút <b>&quot;Duyệt Rút&quot;</b> ở dòng CTV để quét mã VietQR tự động
          </span>
        </div>
      )}

      {/* 1. THẺ THỐNG KÊ TỔNG QUAN AFFILIATE (DARK THEME ĐỒNG BỘ /admin) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
            <Users className="w-4 h-4 text-sky-400" />
            <span>Tổng CTV</span>
          </div>
          <div className="text-2xl font-bold text-white">{totalAffiliates}</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
            <MousePointerClick className="w-4 h-4 text-purple-400" />
            <span>Lượt Click</span>
          </div>
          <div className="text-2xl font-bold text-purple-300">{totalClicks.toLocaleString('vi-VN')}</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            <span>Đơn Thành Công</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">{totalOrders}</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Doanh Thu CTV</span>
          </div>
          <div className="text-2xl font-bold text-amber-300">
            {totalRevenue.toLocaleString('vi-VN')}đ
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
            <DollarSign className="w-4 h-4 text-indigo-400" />
            <span>Tổng Hoa Hồng</span>
          </div>
          <div className="text-2xl font-bold text-indigo-300">
            {totalCommission.toLocaleString('vi-VN')}đ
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-950/60 to-rose-950/40 p-4 rounded-2xl border border-amber-500/40 shadow-md">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase mb-1">
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Chờ Thanh Toán</span>
          </div>
          <div className="text-2xl font-bold text-rose-400">
            {remainingCommission > 0 ? remainingCommission.toLocaleString('vi-VN') + 'đ' : '0đ'}
          </div>
        </div>
      </div>

      {/* 2. THANH CÔNG CỤ & TÌM KIẾM */}
      <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, mã ref, SĐT, STK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onRefresh}
            className="px-3 py-2 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-200 text-sm font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tải lại</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm CTV Mới</span>
          </button>
        </div>
      </div>

      {/* 3. BẢNG DANH SÁCH CỘNG TÁC VIÊN */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 bg-slate-950/60">
          <h3 className="font-bold text-amber-300 text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            <span>Danh Sách Cộng Tác Viên ({filteredAffiliates.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Link chuẩn:{' '}
            <code className="bg-slate-800 px-2 py-0.5 rounded text-amber-300 font-mono">
              https://www.tuvithayton.vn/?ref=MÃ_CTV
            </code>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">CTV / Liên hệ</th>
                <th className="py-3 px-4">Mã Ref &amp; Link Chia Sẻ</th>
                <th className="py-3 px-4">Tài Khoản Ngân Hàng</th>
                <th className="py-3 px-4 text-center">Hoa Hồng</th>
                <th className="py-3 px-4 text-center">Hiệu Suất</th>
                <th className="py-3 px-4 text-right">Tài Chính</th>
                <th className="py-3 px-4 text-center">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredAffiliates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Chưa có Cộng Tác Viên nào. Bấm <b>&quot;Thêm CTV Mới&quot;</b> để tạo CTV đầu tiên!
                  </td>
                </tr>
              ) : (
                filteredAffiliates.map((aff) => {
                  const remaining = (aff.totalCommission || 0) - (aff.paidCommission || 0);
                  const isCopied = copiedCode === aff.code;

                  return (
                    <tr key={aff.id} className="hover:bg-slate-800/50 transition-colors">
                      {/* Cột 1: CTV & Liên hệ */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-white">{aff.name}</div>
                        <div className="text-xs text-slate-400 space-y-0.5 mt-0.5">
                          {aff.phone && (
                            <div>
                              SĐT/Zalo: <b className="text-slate-200">{aff.phone}</b>
                            </div>
                          )}
                          {aff.email && <div>Email: {aff.email}</div>}
                        </div>
                      </td>

                      {/* Cột 2: Mã Ref & Link */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/35 px-2 py-0.5 rounded text-xs">
                            {aff.code}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(aff.code)}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded transition-colors cursor-pointer"
                            title="Copy link giới thiệu"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-300 font-medium">Đã copy</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 font-mono truncate max-w-[200px]">
                          ?ref={aff.code}
                        </div>
                      </td>

                      {/* Cột 3: STK Ngân Hàng */}
                      <td className="py-3 px-4">
                        {aff.bankAccountNumber ? (
                          <div className="text-xs">
                            <div className="font-bold text-amber-300 font-mono">{aff.bankAccountNumber}</div>
                            <div className="text-slate-300">{aff.bankName || 'Ngân hàng'}</div>
                            {aff.bankAccountName && (
                              <div className="text-[11px] text-slate-400 uppercase">{aff.bankAccountName}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Chưa nhập STK</span>
                        )}
                      </td>

                      {/* Cột 4: Mức Hoa Hồng */}
                      <td className="py-3 px-4 text-center">
                        {aff.commissionMode === 'tier' || (!aff.commissionMode && aff.commissionTiers) ? (
                          <div className="inline-block text-left bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg text-[11px] space-y-0.5">
                            <div className="font-bold text-emerald-300 uppercase text-[10px] tracking-wide">
                              Theo Từng Gói
                            </div>
                            <div className="text-slate-200">
                              Khóa học:{' '}
                              <b className="text-amber-300">
                                {((aff.commissionTiers?.course_tuvi ?? DEFAULT_TIER_COMMISSIONS.course_tuvi ?? 200000) / 1000).toFixed(0)}k
                              </b>{' '}
                              • Pro:{' '}
                              <b className="text-emerald-300">
                                {((aff.commissionTiers?.reading_vip ?? DEFAULT_TIER_COMMISSIONS.reading_vip) / 1000).toFixed(0)}k
                              </b>{' '}
                              • Expert:{' '}
                              <b className="text-purple-300">
                                {((aff.commissionTiers?.reading_expert ?? DEFAULT_TIER_COMMISSIONS.reading_expert) / 1000).toFixed(0)}k
                              </b>
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              Hỏi: <b>{((aff.commissionTiers?.chat_free ?? DEFAULT_TIER_COMMISSIONS.chat_free) / 1000).toFixed(0)}k</b> /{' '}
                              <b>{((aff.commissionTiers?.chat_vip ?? DEFAULT_TIER_COMMISSIONS.chat_vip) / 1000).toFixed(0)}k</b> /{' '}
                              <b>{((aff.commissionTiers?.chat_expert ?? DEFAULT_TIER_COMMISSIONS.chat_expert) / 1000).toFixed(0)}k</b>
                            </div>
                          </div>
                        ) : aff.commissionMode === 'fixed' || (!aff.commissionMode && aff.commissionFixed && aff.commissionFixed > 0) ? (
                          <span className="font-bold text-amber-300 text-xs bg-amber-500/15 border border-amber-500/35 px-2 py-1 rounded">
                            {(aff.commissionFixed || 0).toLocaleString('vi-VN')}đ / đơn
                          </span>
                        ) : (
                          <span className="font-bold text-indigo-300 text-xs bg-indigo-500/15 border border-indigo-500/35 px-2.5 py-1 rounded">
                            {aff.commissionRate}% doanh thu
                          </span>
                        )}
                      </td>

                      {/* Cột 5: Hiệu Suất */}
                      <td className="py-3 px-4 text-center">
                        <div className="text-xs space-y-0.5">
                          <div>
                            <span className="text-slate-400">Clicks: </span>
                            <b className="text-purple-300 font-semibold">{aff.totalClicks || 0}</b>
                          </div>
                          <div>
                            <span className="text-slate-400">Đơn: </span>
                            <b className="text-emerald-400 font-bold">{aff.totalOrders || 0}</b>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Doanh thu: <b className="text-slate-200">{(aff.totalRevenue || 0).toLocaleString('vi-VN')}đ</b>
                          </div>
                        </div>
                      </td>

                      {/* Cột 6: Tài Chính */}
                      <td className="py-3 px-4 text-right">
                        <div className="text-xs space-y-0.5">
                          <div>
                            <span className="text-slate-400">Tích lũy: </span>
                            <b className="text-white font-bold">
                              {(aff.totalCommission || 0).toLocaleString('vi-VN')}đ
                            </b>
                          </div>
                          <div>
                            <span className="text-slate-400">Đã trả: </span>
                            <span className="text-emerald-400">
                              {(aff.paidCommission || 0).toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                          <div className="pt-0.5 border-t border-slate-800">
                            <span className="text-slate-400">Còn nợ: </span>
                            <b className={remaining > 0 ? 'text-rose-400 font-bold' : 'text-slate-500'}>
                              {remaining.toLocaleString('vi-VN')}đ
                            </b>
                          </div>
                          {aff.pendingWithdrawal && aff.pendingWithdrawal > 0 ? (
                            <div className="pt-1">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-200 bg-amber-500/20 px-1.5 py-0.5 rounded-full border border-amber-400/40 animate-pulse">
                                <Clock className="w-3 h-3 text-amber-300" />
                                Y/C rút: {aff.pendingWithdrawal.toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </td>

                      {/* Cột 7: Thao Tác */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {remaining > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                setPayoutModalAff(aff);
                                setPayoutAmount(String(aff.pendingWithdrawal || remaining));
                                setPayoutNote(
                                  aff.pendingWithdrawal ? 'Chuyển khoản theo yêu cầu rút tiền' : 'Chuyển khoản đối soát'
                                );
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                              title="Đối soát & Đánh dấu đã thanh toán hoa hồng"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>{aff.pendingWithdrawal ? 'Duyệt Rút' : 'Chi Trả'}</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(aff)}
                            aria-label={`Sửa thông tin CTV ${aff.name}`}
                            className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteAffiliate(aff)}
                            aria-label={`Xóa CTV ${aff.name}`}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Xóa CTV"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. BẢNG DANH SÁCH ĐƠN HÀNG TỪ CỘNG TÁC VIÊN */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2 bg-slate-950/60">
          <h3 className="font-bold text-emerald-300 text-base flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <span>Lịch Sử Đơn Hàng Qua Affiliate ({orders.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Tự động ghi nhận khi khách chuyển khoản nguyên giá qua SePay (đơn voucher giảm giá = 0đ hoa hồng)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold text-xs uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Mã Đơn / Thời Gian</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Gói Dịch Vụ</th>
                <th className="py-3 px-4">CTV Giới Thiệu</th>
                <th className="py-3 px-4 text-right">Số Tiền Khách Trả</th>
                <th className="py-3 px-4 text-right">Hoa Hồng CTV</th>
                <th className="py-3 px-4 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">
                    Chưa có đơn hàng nào phát sinh qua mã giới thiệu.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-800/50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white font-mono">{o.orderCode}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(o.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-white">{o.hoTen || 'Đương số'}</div>
                      {o.email && <div className="text-xs text-slate-400">{o.email}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200">
                        {getOrderTypeLabel(o.paymentType)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded text-xs">
                        {o.affiliateCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-white">
                      {o.amount?.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400">
                      {(o.commissionAmount || 0).toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3 px-4 text-center">
                      {o.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Đã Trả Tiền
                        </span>
                      ) : o.status === 'CANCELLED' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-300 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded-full">
                          Đã Hủy
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" /> Chờ Quét QR
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

      {/* 5. MODAL THÊM / SỬA CỘNG TÁC VIÊN */}
      {isFormModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-aff-form-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFormModalOpen(false);
          }}
        >
          <div className="bg-slate-900 rounded-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-6 shadow-2xl relative border border-amber-500/35 text-slate-100">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              aria-label="Đóng hộp thoại cộng tác viên"
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 id="admin-aff-form-title" className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>{editingAffiliate ? 'Cập Nhật Cộng Tác Viên' : 'Thêm Cộng Tác Viên Mới'}</span>
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Mã Giới Thiệu (Ref Code) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingAffiliate)}
                    placeholder="ví dụ: diep93, nam88"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/\s/g, '') })}
                    className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm font-mono font-bold text-white placeholder:text-slate-500 placeholder:font-normal bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:outline-none disabled:opacity-60"
                  />
                  <span className="text-[10px] text-slate-400">Viết liền không dấu</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Tên CTV / Đối Tác <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Trần Thị Điệp"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm font-medium text-white placeholder:text-slate-500 bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Số Điện Thoại / Zalo <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0912..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm font-medium text-white placeholder:text-slate-500 bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Dùng để CTV tra cứu tại /ctv</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email (nếu có)</label>
                  <input
                    type="email"
                    placeholder="ctv@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm font-medium text-white placeholder:text-slate-500 bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-sky-300 uppercase flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-sky-400" />
                  <span>Thông Tin Nhận Hoa Hồng (Ngân Hàng)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Tên Ngân Hàng</label>
                    <input
                      type="text"
                      placeholder="MB, VCB, VPBank..."
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm font-medium text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Số Tài Khoản (STK)</label>
                    <input
                      type="text"
                      placeholder="0123456789..."
                      value={formData.bankAccountNumber}
                      onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm font-mono font-bold text-amber-300 placeholder:text-slate-500 placeholder:font-normal focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tên Chủ Tài Khoản</label>
                  <input
                    type="text"
                    placeholder="TRAN THI DIEP (viết hoa không dấu)"
                    value={formData.bankAccountName}
                    onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm font-semibold text-white placeholder:text-slate-500 placeholder:font-normal uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-900"
                  />
                </div>
              </div>

              {/* CHẾ ĐỘ TÍNH HOA HỒNG */}
              <div className="p-3.5 bg-amber-950/30 rounded-xl border border-amber-500/35 space-y-3">
                <div className="text-xs font-bold text-amber-300 uppercase flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <span>Chính Sách Trả Hoa Hồng</span>
                  </div>
                </div>

                {/* Bộ chọn 3 chế độ */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, commissionMode: 'tier' })}
                    className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      formData.commissionMode === 'tier'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Theo Từng Gói
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, commissionMode: 'percent' })}
                    className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      formData.commissionMode === 'percent'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Theo % Đơn
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, commissionMode: 'fixed' })}
                    className={`py-1.5 px-2 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      formData.commissionMode === 'fixed'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    Đồng Giá / Đơn
                  </button>
                </div>

                {/* 1. Chế độ: Cố định theo từng gói */}
                {formData.commissionMode === 'tier' && (
                  <div className="space-y-2.5 pt-1">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="col-span-2">
                        <label className="block text-[11px] font-bold text-amber-300 mb-1">
                          Khóa Học Tử Vi Thực Chiến <span className="text-slate-400 font-normal">(699k)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="1000"
                            min="0"
                            value={formData.commissionTiers.course_tuvi ?? DEFAULT_TIER_COMMISSIONS.course_tuvi ?? 200000}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                commissionTiers: { ...formData.commissionTiers, course_tuvi: Number(e.target.value) },
                              })
                            }
                            className="w-full pl-2.5 pr-7 py-1.5 border border-amber-500/40 rounded-lg text-sm font-bold text-amber-300 bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">đ</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Gói Pro Chuyên Sâu <span className="text-slate-400 font-normal">(119k)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="1000"
                            min="0"
                            value={formData.commissionTiers.reading_vip}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                commissionTiers: { ...formData.commissionTiers, reading_vip: Number(e.target.value) },
                              })
                            }
                            className="w-full pl-2.5 pr-7 py-1.5 border border-slate-700 rounded-lg text-sm font-bold text-emerald-300 bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">đ</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Gói Expert Chuyên Gia <span className="text-slate-400 font-normal">(269k)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="1000"
                            min="0"
                            value={formData.commissionTiers.reading_expert}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                commissionTiers: { ...formData.commissionTiers, reading_expert: Number(e.target.value) },
                              })
                            }
                            className="w-full pl-2.5 pr-7 py-1.5 border border-slate-700 rounded-lg text-sm font-bold text-emerald-300 bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">đ</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Hỏi 2 Câu Cơ Bản <span className="text-slate-400 font-normal">(49k)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="1000"
                            min="0"
                            value={formData.commissionTiers.chat_free}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                commissionTiers: { ...formData.commissionTiers, chat_free: Number(e.target.value) },
                              })
                            }
                            className="w-full pl-2.5 pr-7 py-1.5 border border-slate-700 rounded-lg text-sm font-bold text-white bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">đ</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 mb-1">
                          Nâng Cấp Pro &rarr; Expert <span className="text-slate-400 font-normal">(150k)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="1000"
                            min="0"
                            value={formData.commissionTiers.upgrade_expert}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                commissionTiers: { ...formData.commissionTiers, upgrade_expert: Number(e.target.value) },
                              })
                            }
                            className="w-full pl-2.5 pr-7 py-1.5 border border-slate-700 rounded-lg text-sm font-bold text-white bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">đ</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Hỏi 2 Câu Pro <span className="text-slate-400 font-normal">(99k)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="1000"
                            min="0"
                            value={formData.commissionTiers.chat_vip}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                commissionTiers: { ...formData.commissionTiers, chat_vip: Number(e.target.value) },
                              })
                            }
                            className="w-full pl-2.5 pr-7 py-1.5 border border-slate-700 rounded-lg text-sm font-bold text-white bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">đ</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-300 mb-1">
                          Hỏi 2 Câu Expert <span className="text-slate-400 font-normal">(129k)</span>
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="1000"
                            min="0"
                            value={formData.commissionTiers.chat_expert}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                commissionTiers: { ...formData.commissionTiers, chat_expert: Number(e.target.value) },
                              })
                            }
                            className="w-full pl-2.5 pr-7 py-1.5 border border-slate-700 rounded-lg text-sm font-bold text-white bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">đ</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-[11px] text-emerald-300/90 font-medium">
                      💡 Hệ thống sẽ tự động cộng đúng số tiền tương ứng với gói nguyên giá (trần tối đa 50% giá trị đơn, 0đ cho đơn giảm giá voucher).
                    </p>
                  </div>
                )}

                {/* 2. Chế độ: Theo % Doanh Thu */}
                {formData.commissionMode === 'percent' && (
                  <div className="pt-1">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Tỷ Lệ Hoa Hồng (% Doanh Thu)</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="50"
                        value={formData.commissionRate}
                        onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm font-bold text-indigo-300 bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                    </div>
                    <span className="text-[11px] text-slate-400">Mặc định 25% – 30% giá trị mọi đơn hàng nguyên giá (tối đa 50%)</span>
                  </div>
                )}

                {/* 3. Chế độ: Đồng giá cố định mọi đơn */}
                {formData.commissionMode === 'fixed' && (
                  <div className="pt-1">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Số Tiền Cố Định Cho Mọi Đơn (VND/đơn)</label>
                    <input
                      type="number"
                      step="1000"
                      placeholder="ví dụ: 50000"
                      value={formData.commissionFixed}
                      onChange={(e) => setFormData({ ...formData, commissionFixed: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm font-bold text-amber-300 placeholder:text-slate-500 placeholder:font-normal bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="text-[11px] text-slate-400">Mọi đơn nguyên giá đều cộng số tiền này (tối đa 50% giá trị đơn)</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Ghi Chú</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú thêm về CTV này..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm font-medium text-white placeholder:text-slate-500 bg-slate-950 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-sm font-bold shadow transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Đang lưu...' : editingAffiliate ? 'Cập Nhật' : 'Tạo CTV'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL CHI TRẢ HOA HỒNG (PAYOUT) */}
      {payoutModalAff && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-aff-payout-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPayoutModalAff(null);
          }}
        >
          <div className="bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-emerald-500/35 text-slate-100">
            <button
              type="button"
              onClick={() => setPayoutModalAff(null)}
              aria-label="Đóng hộp thoại chi trả hoa hồng"
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 id="admin-aff-payout-title" className="text-lg font-bold text-emerald-300 mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>Đối Soát &amp; Thanh Toán Hoa Hồng</span>
            </h3>

            <p className="text-xs text-slate-400 mb-4">
              Xác nhận bạn đã chuyển khoản hoa hồng cho CTV <b className="text-white">{payoutModalAff.name}</b> (Mã: {payoutModalAff.code}).
            </p>

            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Ngân hàng:</span>
                  <b className="text-white">{payoutModalAff.bankName || 'Chưa cung cấp'}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <b className="text-amber-300 font-mono font-bold text-sm">{payoutModalAff.bankAccountNumber || 'Chưa có'}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <b className="text-white uppercase">{payoutModalAff.bankAccountName || 'Chưa có'}</b>
                </div>
              </div>

              {/* TỰ ĐỘNG SINH MÃ VIETQR ĐỂ QUÉT BẰNG APP NGÂN HÀNG */}
              {payoutModalAff.bankAccountNumber ? (
                <div className="bg-amber-950/35 p-3.5 rounded-xl border border-amber-500/35 text-center space-y-2">
                  <div className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
                    <QrCode className="w-4 h-4 text-amber-400" />
                    <span>MÃ VIETQR TỰ ĐỘNG - QUÉT ĐỂ CHUYỂN KHOẢN TRONG 3 GIÂY</span>
                  </div>
                  <div className="flex justify-center py-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://img.vietqr.io/image/${payoutModalAff.bankCode || inferBankCode(payoutModalAff.bankName)}-${payoutModalAff.bankAccountNumber}-compact2.png?amount=${Number(payoutAmount || 0)}&addInfo=${encodeURIComponent(`HOA HONG ${payoutModalAff.code.toUpperCase()}`)}&accountName=${encodeURIComponent(payoutModalAff.bankAccountName || payoutModalAff.name)}`}
                      alt="VietQR Payout"
                      className="max-w-[210px] h-auto rounded-xl shadow-md border border-amber-400/40 bg-white p-2"
                    />
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Mở App ngân hàng trên điện thoại quét mã trên: Hệ thống <b>tự điền đúng STK, đúng Tên và đúng {Number(payoutAmount || 0).toLocaleString('vi-VN')}đ</b>.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>CTV này chưa cung cấp số tài khoản ngân hàng.</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Số Tiền Đã Chuyển Khoản (VND)</label>
                <input
                  type="number"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-700 rounded-lg text-lg font-bold text-emerald-400 bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Ghi Chú Chuyển Khoản</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Chuyển khoản ngày 26/09"
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-700 rounded-lg text-sm font-medium text-white placeholder:text-slate-500 bg-slate-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setPayoutModalAff(null)}
                  className="px-4 py-2 border border-slate-700 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmitting ? 'Đang lưu...' : 'Xác Nhận Đã Thanh Toán'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
