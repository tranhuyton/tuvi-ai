'use client';

import React, { useState } from 'react';
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
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  X,
  RefreshCw,
} from 'lucide-react';
import { AffiliateItem } from '@/lib/affiliateStore';
import { AdminOrderItem } from './AdminTransactionsTable';

interface AdminAffiliatesTableProps {
  affiliates: AffiliateItem[];
  orders: AdminOrderItem[];
  onRefresh: () => void;
  adminPin: string;
}

export default function AdminAffiliatesTable({
  affiliates,
  orders,
  onRefresh,
  adminPin,
}: AdminAffiliatesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modal thêm / sửa CTV
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingAffiliate, setEditingAffiliate] = useState<AffiliateItem | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    phone: '',
    email: '',
    bankName: '',
    bankAccountNumber: '',
    bankAccountName: '',
    commissionRate: 25,
    commissionFixed: '',
    notes: '',
  });

  // Modal thanh toán hoa hồng (Payout)
  const [payoutModalAff, setPayoutModalAff] = useState<AffiliateItem | null>(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutNote, setPayoutNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://tuvithayton.vn';
    const link = `${origin}/?ref=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
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
      commissionRate: 25,
      commissionFixed: '',
      notes: '',
    });
    setIsFormModalOpen(true);
  };

  // Mở modal sửa
  const handleOpenEditModal = (aff: AffiliateItem) => {
    setEditingAffiliate(aff);
    setFormData({
      code: aff.code,
      name: aff.name,
      phone: aff.phone || '',
      email: aff.email || '',
      bankName: aff.bankName || '',
      bankAccountNumber: aff.bankAccountNumber || '',
      bankAccountName: aff.bankAccountName || '',
      commissionRate: aff.commissionRate ?? 25,
      commissionFixed: aff.commissionFixed ? String(aff.commissionFixed) : '',
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
      const payload: any = {
        action: editingAffiliate ? 'update' : 'create',
        code: formData.code.trim().toLowerCase(),
        name: formData.name.trim(),
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        bankName: formData.bankName.trim() || undefined,
        bankAccountNumber: formData.bankAccountNumber.trim() || undefined,
        bankAccountName: formData.bankAccountName.trim() || undefined,
        commissionRate: Number(formData.commissionRate || 25),
        commissionFixed: formData.commissionFixed ? Number(formData.commissionFixed) : undefined,
        notes: formData.notes.trim() || undefined,
      };

      if (editingAffiliate) {
        payload.id = editingAffiliate.id;
      }

      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.error || 'Thao tác không thành công');
        return;
      }

      setIsFormModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert('Lỗi: ' + (err?.message || 'Có lỗi xảy ra'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xóa CTV
  const handleDeleteAffiliate = async (aff: AffiliateItem) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa CTV "${aff.name}" (Mã: ${aff.code})?`)) return;

    try {
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
        body: JSON.stringify({ action: 'delete', id: aff.id }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onRefresh();
      } else {
        alert(data.error || 'Không thể xóa');
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
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
      const res = await fetch('/api/admin/affiliates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': adminPin,
        },
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
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. THẺ THỐNG KÊ TỔNG QUAN AFFILIATE */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
            <Users className="w-4 h-4 text-blue-600" />
            <span>Tổng CTV</span>
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalAffiliates}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
            <MousePointerClick className="w-4 h-4 text-purple-600" />
            <span>Lượt Click</span>
          </div>
          <div className="text-2xl font-bold text-purple-700">{totalClicks.toLocaleString('vi-VN')}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Đơn Thành Công</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700">{totalOrders}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            <span>Doanh Thu CTV</span>
          </div>
          <div className="text-2xl font-bold text-amber-700">
            {totalRevenue.toLocaleString('vi-VN')}đ
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase mb-1">
            <DollarSign className="w-4 h-4 text-indigo-600" />
            <span>Tổng Hoa Hồng</span>
          </div>
          <div className="text-2xl font-bold text-indigo-700">
            {totalCommission.toLocaleString('vi-VN')}đ
          </div>
        </div>

        <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase mb-1">
            <CreditCard className="w-4 h-4 text-amber-700" />
            <span>Chờ Thanh Toán</span>
          </div>
          <div className="text-2xl font-bold text-red-600">
            {remainingCommission > 0 ? remainingCommission.toLocaleString('vi-VN') + 'đ' : '0đ'}
          </div>
        </div>
      </div>

      {/* 2. THANH CÔNG CỤ & TÌM KIẾM */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên, mã ref, SĐT, STK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onRefresh}
            className="px-3 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 text-sm font-medium flex items-center gap-1.5 transition-all"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Tải lại</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm CTV Mới</span>
          </button>
        </div>
      </div>

      {/* 3. BẢNG DANH SÁCH CỘNG TÁC VIÊN */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-600" />
            <span>Danh Sách Cộng Tác Viên ({filteredAffiliates.length})</span>
          </h3>
          <span className="text-xs text-slate-500">
            Link chuẩn: <code className="bg-slate-100 px-2 py-0.5 rounded text-amber-800 font-mono">tuvithayton.vn/?ref=MÃ_CTV</code>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-xs uppercase border-b border-slate-200">
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
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {filteredAffiliates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Chưa có Cộng Tác Viên nào. Bấm <b>"Thêm CTV Mới"</b> để tạo CTV đầu tiên!
                  </td>
                </tr>
              ) : (
                filteredAffiliates.map((aff) => {
                  const remaining = (aff.totalCommission || 0) - (aff.paidCommission || 0);
                  const isCopied = copiedCode === aff.code;

                  return (
                    <tr key={aff.id} className="hover:bg-slate-50 transition-colors">
                      {/* Cột 1: CTV & Liên hệ */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{aff.name}</div>
                        <div className="text-xs text-slate-500 space-y-0.5 mt-0.5">
                          {aff.phone && <div>SĐT/Zalo: <b className="text-slate-700">{aff.phone}</b></div>}
                          {aff.email && <div>Email: {aff.email}</div>}
                        </div>
                      </td>

                      {/* Cột 2: Mã Ref & Link */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-xs">
                            {aff.code}
                          </span>
                          <button
                            onClick={() => handleCopyLink(aff.code)}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                            title="Copy link giới thiệu"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700 font-medium">Đã copy</span>
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
                            <div className="font-bold text-slate-900">{aff.bankAccountNumber}</div>
                            <div className="text-slate-600">{aff.bankName || 'Ngân hàng'}</div>
                            {aff.bankAccountName && (
                              <div className="text-[11px] text-slate-500 uppercase">{aff.bankAccountName}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Chưa nhập STK</span>
                        )}
                      </td>

                      {/* Cột 4: Mức Hoa Hồng */}
                      <td className="py-3 px-4 text-center">
                        {aff.commissionFixed && aff.commissionFixed > 0 ? (
                          <span className="font-bold text-amber-700 text-xs bg-amber-50 px-2 py-1 rounded">
                            {aff.commissionFixed.toLocaleString('vi-VN')}đ / đơn
                          </span>
                        ) : (
                          <span className="font-bold text-indigo-700 text-xs bg-indigo-50 px-2.5 py-1 rounded">
                            {aff.commissionRate}%
                          </span>
                        )}
                      </td>

                      {/* Cột 5: Hiệu Suất */}
                      <td className="py-3 px-4 text-center">
                        <div className="text-xs space-y-0.5">
                          <div>
                            <span className="text-slate-500">Clicks: </span>
                            <b className="text-purple-700 font-semibold">{aff.totalClicks || 0}</b>
                          </div>
                          <div>
                            <span className="text-slate-500">Đơn: </span>
                            <b className="text-emerald-700 font-bold">{aff.totalOrders || 0}</b>
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Doanh thu: <b>{(aff.totalRevenue || 0).toLocaleString('vi-VN')}đ</b>
                          </div>
                        </div>
                      </td>

                      {/* Cột 6: Tài Chính */}
                      <td className="py-3 px-4 text-right">
                        <div className="text-xs space-y-0.5">
                          <div>
                            <span className="text-slate-500">Tích lũy: </span>
                            <b className="text-slate-900 font-bold">
                              {(aff.totalCommission || 0).toLocaleString('vi-VN')}đ
                            </b>
                          </div>
                          <div>
                            <span className="text-slate-500">Đã trả: </span>
                            <span className="text-emerald-600">
                              {(aff.paidCommission || 0).toLocaleString('vi-VN')}đ
                            </span>
                          </div>
                          <div className="pt-0.5 border-t border-slate-100">
                            <span className="text-slate-500">Còn nợ: </span>
                            <b className={remaining > 0 ? 'text-red-600 font-bold' : 'text-slate-400'}>
                              {remaining.toLocaleString('vi-VN')}đ
                            </b>
                          </div>
                        </div>
                      </td>

                      {/* Cột 7: Thao Tác */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {remaining > 0 && (
                            <button
                              onClick={() => {
                                setPayoutModalAff(aff);
                                setPayoutAmount(String(remaining));
                                setPayoutNote('Chuyển khoản đối soát');
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                              title="Đối soát & Đánh dấu đã thanh toán hoa hồng"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Chi Trả</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenEditModal(aff)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                            title="Sửa thông tin"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDeleteAffiliate(aff)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition-colors"
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
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <span>Lịch Sử Đơn Hàng Qua Affiliate ({orders.length})</span>
          </h3>
          <span className="text-xs text-slate-500">Tự động ghi nhận khi khách chuyển khoản qua SePay</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 font-semibold text-xs uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mã Đơn / Thời Gian</th>
                <th className="py-3 px-4">Khách Hàng</th>
                <th className="py-3 px-4">Gói Luận Giải</th>
                <th className="py-3 px-4">CTV Giới Thiệu</th>
                <th className="py-3 px-4 text-right">Số Tiền Khách Trả</th>
                <th className="py-3 px-4 text-right">Hoa Hồng CTV</th>
                <th className="py-3 px-4 text-center">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400">
                    Chưa có đơn hàng nào phát sinh qua mã giới thiệu.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 font-mono">{o.orderCode}</div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(o.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900">{o.hoTen || 'Đương số'}</div>
                      {o.email && <div className="text-xs text-slate-500">{o.email}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {o.paymentType === 'reading_vip'
                          ? 'Bản VIP 119k'
                          : o.paymentType === 'chat_vip'
                          ? 'Chat VIP 99k'
                          : 'Chat Cơ Bản 49k'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-xs">
                        {o.affiliateCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {o.amount?.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">
                      {(o.commissionAmount || 0).toLocaleString('vi-VN')}đ
                    </td>
                    <td className="py-3 px-4 text-center">
                      {o.status === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" /> Đã Trả Tiền
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative border border-slate-200">
            <button
              onClick={() => setIsFormModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-600" />
              <span>{editingAffiliate ? 'Cập Nhật Cộng Tác Viên' : 'Thêm Cộng Tác Viên Mới'}</span>
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mã Giới Thiệu (Ref Code) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: diep93, nam88"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/\s/g, '') })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Viết liền không dấu</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên CTV / Đối Tác <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ví dụ: Trần Thị Điệp"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Số Điện Thoại / Zalo</label>
                  <input
                    type="text"
                    placeholder="0912..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email (nếu có)</label>
                  <input
                    type="email"
                    placeholder="ctv@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                  <span>Thông Tin Nhận Hoa Hồng (Ngân Hàng)</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Tên Ngân Hàng</label>
                    <input
                      type="text"
                      placeholder="MB, VCB, VPBank..."
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Số Tài Khoản (STK)</label>
                    <input
                      type="text"
                      placeholder="0123456789..."
                      value={formData.bankAccountNumber}
                      onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Tên Chủ Tài Khoản</label>
                  <input
                    type="text"
                    placeholder="TRAN THI DIEP (viết hoa không dấu)"
                    value={formData.bankAccountName}
                    onChange={(e) => setFormData({ ...formData, bankAccountName: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tỷ Lệ Hoa Hồng (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-indigo-700 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Mặc định 25% - 30%</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Hoặc Cố Định (VND/đơn)</label>
                  <input
                    type="number"
                    placeholder="ví dụ: 35000"
                    value={formData.commissionFixed}
                    onChange={(e) => setFormData({ ...formData, commissionFixed: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500">Nếu nhập, sẽ ưu tiên tính tiền cố định</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ghi Chú</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú thêm về CTV này..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold shadow transition-all disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative border border-slate-200">
            <button
              onClick={() => setPayoutModalAff(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Đối Soát &amp; Thanh Toán Hoa Hồng</span>
            </h3>

            <p className="text-xs text-slate-500 mb-4">
              Xác nhận bạn đã chuyển khoản hoa hồng cho CTV <b>{payoutModalAff.name}</b> (Mã: {payoutModalAff.code}).
            </p>

            <form onSubmit={handlePayoutSubmit} className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Ngân hàng:</span>
                  <b className="text-slate-800">{payoutModalAff.bankName || 'Chưa cung cấp'}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Số tài khoản:</span>
                  <b className="text-slate-900 font-mono font-bold text-sm">{payoutModalAff.bankAccountNumber || 'Chưa có'}</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chủ tài khoản:</span>
                  <b className="text-slate-800 uppercase">{payoutModalAff.bankAccountName || 'Chưa có'}</b>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Số Tiền Đã Chuyển Khoản (VND)</label>
                <input
                  type="number"
                  required
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-lg font-bold text-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Ghi Chú Chuyển Khoản</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Chuyển khoản ngày 26/09"
                  value={payoutNote}
                  onChange={(e) => setPayoutNote(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPayoutModalAff(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
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
