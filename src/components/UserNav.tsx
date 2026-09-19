'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, BookOpen, LogOut, PlusCircle, LogIn, Sparkles, PhoneCall } from 'lucide-react';

interface UserNavProps {
  onOpenAuthModal: () => void;
  onOpenSavedCharts: () => void;
  onNewChart: () => void;
}

export default function UserNav({
  onOpenAuthModal,
  onOpenSavedCharts,
  onNewChart,
}: UserNavProps) {
  const { user, profile, signOut, isLoading } = useAuth();

  return (
    <header className="w-full max-w-[1060px] mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-3 sm:p-4 rounded-2xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-md shadow-xl">
      {/* Logo & Brand */}
      <div
        onClick={onNewChart}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition">
          <Sparkles className="w-5 h-5 text-slate-950 fill-slate-950" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold font-serif text-amber-400 tracking-wide">
            TỬ VI THẦY TÔN
          </h1>
          <p className="text-[11px] text-slate-400 font-sans">
            Bát Bộ Thần Sát &amp; Tướng Pháp Bí Truyền
          </p>
        </div>
      </div>

      {/* Contact & Hotline Quick Link */}
      <div className="hidden sm:flex items-center gap-2">
        <a
          href="tel:0935058688"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition shadow-sm"
          title="Gọi điện đặt lịch xem trực tiếp offline cùng Thầy Tôn"
        >
          <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
          <span>Đặt Lịch Offline: <strong className="font-bold text-amber-400">0935.058.688</strong></span>
        </a>
        <a
          href="https://zalo.me/0935058688"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#0068FF]/15 hover:bg-[#0068FF]/25 text-blue-300 border border-blue-500/30 transition shadow-sm"
          title="Nhắn tin Zalo với Thầy Tôn (0935.058.688)"
        >
          <span className="w-3.5 h-3.5 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-[8px] font-black">Z</span>
          <span>Zalo Thầy</span>
        </a>
      </div>

      {/* Account actions */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        {isLoading ? (
          <div className="w-24 h-8 bg-slate-800 animate-pulse rounded-xl" />
        ) : !user ? (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-amber-500/20"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập / Đăng Ký</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            {/* Nút Lập lá số mới */}
            <button
              type="button"
              onClick={onNewChart}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-medium rounded-xl transition"
              title="Lập lá số mới"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lập Lá Số Mới</span>
              <span className="sm:hidden">Mới</span>
            </button>

            {/* Nút Sổ tay lá số */}
            <button
              type="button"
              onClick={onOpenSavedCharts}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold rounded-xl transition shadow-sm"
              title="Xem danh sách các lá số đã lưu"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Sổ Tay Mệnh Số</span>
            </button>

            {/* Tên người dùng & Đăng xuất */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700/80">
              <div className="flex items-center gap-1 text-xs text-slate-300 font-medium px-2 py-1 bg-slate-800/60 rounded-lg">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span className="max-w-[100px] truncate" title={profile?.full_name || user.email}>
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
              </div>
              <button
                type="button"
                onClick={signOut}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition"
                title="Đăng xuất tài khoản"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
