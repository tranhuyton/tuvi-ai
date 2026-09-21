'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, BookOpen, LogOut, PlusCircle, LogIn, Sparkles } from 'lucide-react';

interface UserNavProps {
  onOpenAuthModal: () => void;
  onOpenSavedCharts: () => void;
  onNewChart: () => void;
  onSignOut?: () => void;
}

export default function UserNav({
  onOpenAuthModal,
  onOpenSavedCharts,
  onNewChart,
  onSignOut,
}: UserNavProps) {
  const { user, profile, signOut, isLoading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      if (onSignOut) {
        onSignOut();
      }
    }
  };

  const getFirstName = (fullName?: string | null, email?: string | null) => {
    if (fullName && fullName.trim()) {
      const parts = fullName.trim().split(/\s+/);
      return parts[parts.length - 1]; // "Trần Huy Tôn" -> "Tôn"
    }
    if (email) {
      return email.split('@')[0];
    }
    return 'Bạn';
  };

  const displayName = getFirstName(profile?.full_name, user?.email);

  return (
    <header className="w-full max-w-[1060px] mx-auto mb-4 sm:mb-6 flex flex-row items-center justify-between gap-2 p-2.5 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-md shadow-xl">
      {/* Logo & Brand */}
      <div
        onClick={onNewChart}
        className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
      >
        <img
          src="/icon.svg"
          alt="Tử Vi Thầy Tôn"
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shadow-md shadow-amber-500/25 group-hover:scale-105 transition shrink-0"
        />
        <div>
          <h1 className="text-sm sm:text-base md:text-lg font-bold font-serif text-amber-400 tracking-wide leading-tight">
            TỬ VI THẦY TÔN
          </h1>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans hidden sm:block">
            Bát Bộ Thần Sát &amp; Tướng Pháp Bí Truyền
          </p>
        </div>
      </div>

      {/* Account actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 flex-nowrap">
        {isLoading ? (
          <div className="w-20 h-7 bg-slate-800 animate-pulse rounded-xl" />
        ) : !user ? (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-amber-500/20 whitespace-nowrap"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
            {/* Nút Sổ tay lá số */}
            <button
              type="button"
              onClick={onOpenSavedCharts}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold rounded-xl transition shadow-sm whitespace-nowrap cursor-pointer"
              title="Xem danh sách các lá số đã lưu"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden xs:inline sm:inline">Sổ Tay</span>
            </button>

            {/* Tên First Name (ví dụ: Tôn) */}
            <div className="flex items-center gap-1 text-xs sm:text-sm text-slate-200 font-semibold px-2 py-1 bg-slate-800/80 border border-slate-700/80 rounded-xl whitespace-nowrap">
              <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{displayName}</span>
            </div>

            {/* Nút Log out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1 bg-slate-800/60 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700/60 hover:border-red-500/40 rounded-xl text-xs sm:text-sm font-medium transition whitespace-nowrap cursor-pointer"
              title="Đăng xuất tài khoản"
            >
              <LogOut className="w-3.5 h-3.5 shrink-0" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
