'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import { User, LogOut, LogIn, KeyRound } from 'lucide-react';

interface UserNavProps {
  onOpenAuthModal: () => void;
  onOpenSavedCharts: () => void;
  onNewChart: () => void;
  onSignOut?: () => void | Promise<void>;
  onOpenChangePassword?: () => void;
}

export default function UserNav({
  onOpenAuthModal,
  onOpenSavedCharts,
  onNewChart,
  onSignOut,
  onOpenChangePassword,
}: UserNavProps) {
  const { user, profile, testerInfo, signOut, isLoading } = useAuth();
  const { t } = useLanguage();

  const handleSignOut = async () => {
    try {
      if (onSignOut) {
        await onSignOut();
      } else {
        await signOut();
      }
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err);
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
    <header className="w-full max-w-[1060px] mx-auto mb-4 sm:mb-6 p-2.5 sm:p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-md shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 overflow-hidden">
      {/* Hàng 1 (Mobile) / Khối bên trái (Desktop): Logo & Tài khoản */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-2">
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
            <h1 className="text-sm sm:text-lg md:text-xl font-bold font-serif text-amber-400 tracking-wide leading-tight whitespace-nowrap">
              {t('brand.title', 'TỬ VI THẦY TÔN')}
            </h1>
            <p className="text-xs text-slate-400 font-sans hidden sm:block">
              {t('brand.subtitle', 'Bát Bộ Thần Sát & Tướng Pháp Bí Truyền')}
            </p>
          </div>
        </div>

        {/* Khối tài khoản trên Mobile (Góc phải hàng 1) */}
        <div className="flex items-center gap-1.5 sm:hidden shrink-0">
          {isLoading ? (
            <div className="w-16 h-7 bg-slate-800 animate-pulse rounded-xl" />
          ) : !user ? (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('nav.login', 'Đăng Nhập')}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              {/* Tên First Name */}
              <div className="flex items-center gap-1 text-xs text-slate-200 font-semibold px-2 py-1 bg-slate-800/80 border border-slate-700/80 rounded-xl max-w-[85px] truncate">
                <User className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">{displayName}</span>
              </div>

              {/* Nút Đổi MK */}
              {onOpenChangePassword && (
                <button
                  type="button"
                  onClick={onOpenChangePassword}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700/80 rounded-xl text-xs font-medium transition cursor-pointer"
                  title="Thay đổi mật khẩu tài khoản"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden min-[380px]:inline">Đổi MK</span>
                </button>
              )}

              {/* Nút Đăng Xuất */}
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 px-2 py-1 bg-slate-800/60 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-slate-700/60 hover:border-red-500/40 rounded-xl text-xs font-medium transition cursor-pointer"
                title="Đăng xuất tài khoản"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden min-[380px]:inline">Thoát</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dòng dưới trên Mobile (Cờ nằm ở đây) / Bên phải trên Desktop */}
      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-2 sm:gap-2.5 w-full sm:w-auto pt-2 sm:pt-0 border-t border-slate-800/70 sm:border-none">
        {/* Bộ chọn ngôn ngữ Quốc Tế: Trên mobile căn giữa dòng dưới */}
        <LanguageSelector />

        {/* Khối tài khoản trên Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          {isLoading ? (
            <div className="w-20 h-7 bg-slate-800 animate-pulse rounded-xl" />
          ) : !user ? (
            <>
              <a
                href="#gioi-thieu-thay-ton"
                className="hidden md:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 hover:text-amber-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/70 transition"
                title="Xem thông tin & tiểu sử Thầy Tôn"
              >
                <span>{t('nav.about', 'Về Thầy Tôn')}</span>
              </a>
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('nav.login', 'Đăng Nhập')}</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-sm text-slate-200 font-semibold px-2.5 py-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl whitespace-nowrap max-w-[180px] truncate">
                <User className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{displayName}</span>
                {testerInfo?.isTester && (
                  <span className="ml-1 px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                    🧪 Tester
                  </span>
                )}
              </div>

              {onOpenChangePassword && (
                <button
                  type="button"
                  onClick={onOpenChangePassword}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700/80 rounded-xl text-sm font-medium transition whitespace-nowrap cursor-pointer"
                  title="Thay đổi mật khẩu tài khoản"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{t('nav.changePassword', 'Đổi MK')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800/60 hover:bg-red-950/40 text-slate-300 hover:text-red-400 border border-slate-700/60 hover:border-red-500/40 rounded-xl text-sm font-medium transition whitespace-nowrap cursor-pointer"
                title="Đăng xuất tài khoản"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span>{t('nav.logout', 'Log out')}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
