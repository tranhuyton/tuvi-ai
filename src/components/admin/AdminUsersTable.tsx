'use client';

import React, { useState } from 'react';
import { User, Search, Calendar, BookOpen, MessageSquare, Mail, RefreshCw } from 'lucide-react';

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
  charts_count: number;
  messages_count: number;
}

interface AdminUsersTableProps {
  users: AdminUser[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function AdminUsersTable({ users, isLoading, onRefresh }: AdminUsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      (u.full_name && u.full_name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term)) ||
      u.id.toLowerCase().includes(term)
    );
  });

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md space-y-4">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-100 font-serif flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <span>Danh Sách Tài Khoản Người Dùng ({users.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Quản lý toàn bộ khách hàng đã đăng ký tài khoản trên hệ thống Tử Vi Thầy Tôn.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên hoặc email..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950/70 border border-slate-700 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Bảng dữ liệu người dùng */}
      {isLoading ? (
        <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
          <span className="text-sm">Đang tải danh sách tài khoản...</span>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-sm italic">
          {searchTerm ? 'Không tìm thấy người dùng phù hợp với từ khóa.' : 'Chưa có tài khoản người dùng nào được ghi nhận.'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4 text-center">Lá số đã lưu</th>
                <th className="py-3 px-4 text-center">Lượt hỏi đáp</th>
                <th className="py-3 px-4 text-right">Ngày tham gia</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => {
                const joinDate = u.created_at
                  ? new Date(u.created_at).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '—';

                return (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/40 text-amber-300 flex items-center justify-center font-bold text-xs">
                          {(u.full_name || u.email || 'K').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200">{u.full_name || 'Khách vãng lai'}</div>
                          <div className="text-[10px] text-slate-500 font-mono">ID: {u.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400">
                      <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{u.email || '—'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 text-xs font-semibold">
                        <BookOpen className="w-3 h-3 text-amber-400" />
                        {u.charts_count}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-xs font-semibold">
                        <MessageSquare className="w-3 h-3" />
                        {u.messages_count}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right text-xs text-slate-400">
                      <div className="flex items-center justify-end gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        <span>{joinDate}</span>
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
  );
}
