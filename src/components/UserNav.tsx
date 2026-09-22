'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, LogIn } from 'lucide-react';

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
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full shadow-md shadow-amber-500/25 group-hover:scale-105 transition shrink-0"
        />
        <div>
          <h1 className="text-base sm:text-lg md:text-xl font-bold font-serif text-amber-400 tracking-wide leading-tight">
            TỬ VI THẦY TÔN
          </h1>
          <p className="text-xs text-slate-400 font-sans hidden sm:block">
            Bát Bộ Thần Sát &amp; Tướng Pháp Bí Truyền
          </p>
        </div>
      </div>

      {/* Account actions */}
      <div className="flex items-center gap-2 sm:gap-2.5 flex-nowrap">
        {/* Link Về Thầy Tôn trên màn hình lớn */}
        <a
          href="#gioi-thieu-thay-ton"
          className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-amber-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 transition"
          title="Xem thông tin &amp; tiểu sử Thầy Tôn"
        >
          <span>Về Thầy Tôn</span>
        </a>
        {isLoading ? (
          <div className="w-20 h-7 bg-slate-800 animate-pulse rounded-xl" />
        ) : !user ? (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2 flex-nowrap">
            {/* Tên First Name (ví dụ: Tôn) */}
            <div className="flex items-center gap-1.5 text-sm text-slate-200 font-semibold px-2.5 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl whitespace-nowrap">
              <User className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{displayName}</span>
            </div>

            {/* Nút Log out */}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/60 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-slate-700/60 hover:border-red-500/40 rounded-xl text-sm font-medium transition whitespace-nowrap cursor-pointer"
              title="Đăng xuất tài khoản"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log out</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
