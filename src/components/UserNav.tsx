'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeSelector from '@/components/ThemeSelector';
import { User, LogOut, LogIn, KeyRound, ChevronDown, BookOpen } from 'lucide-react';

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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Đóng menu tài khoản khi click ra ngoài hoặc bấm phím Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen]);

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
  const fullDisplayName = profile?.full_name?.trim() || user?.email?.split('@')[0] || 'Tài khoản';
  const initialLetter = (displayName || 'U').charAt(0).toUpperCase();

  return (
    <header className="w-full max-w-[1060px] mx-auto mb-3 sm:mb-5 px-2.5 py-2 sm:px-4 sm:py-2 rounded-2xl bg-slate-900/85 border border-amber-500/20 backdrop-blur-md shadow-xl flex items-center justify-between gap-2 relative z-30">
      {/* Khối bên trái: Logo & Brand */}
      <div
        onClick={onNewChart}
        className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
        title="Lập lá số mới"
      >
        <img
          src="/icon.svg"
          alt="Tử Vi Thầy Tôn"
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full shadow-md shadow-amber-500/25 group-hover:scale-105 transition shrink-0"
        />
        <div className="flex flex-col">
          <h1 className="text-xs sm:text-base md:text-lg font-bold font-serif text-amber-400 tracking-wide leading-tight whitespace-nowrap">
            {t('brand.title', 'TỬ VI THẦY TÔN')}
          </h1>
          <p className="text-[10.5px] text-slate-400 font-sans hidden xl:flex items-center gap-1.5 whitespace-nowrap tracking-tight">
            <span>{t('brand.subtitle', 'Bát Bộ Thần Sát & Tướng Pháp Bí Truyền')}</span>
            <span className="text-slate-600 font-light">•</span>
            <span className="text-amber-300/85 font-medium">{t('brand.multilingual', 'Luận Giải Đa Ngôn Ngữ')}</span>
          </p>
        </div>
      </div>

      {/* Khối bên phải: Ngôn ngữ + Theme + Tài khoản (Đồng bộ 1 dòng trên cả PC & Mobile) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Bộ chọn ngôn ngữ Quốc Tế dạng Dropdown */}
        <LanguageSelector />

        {/* Bộ chọn màu nền giao diện */}
        <ThemeSelector />

        {/* Khối tài khoản */}
        {isLoading ? (
          <div className="w-16 sm:w-20 h-8 sm:h-9 bg-slate-800 animate-pulse rounded-xl" />
        ) : !user ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="#gioi-thieu-thay-ton"
              className="hidden lg:inline-flex items-center gap-1 h-8 sm:h-9 px-2.5 rounded-xl text-xs font-medium text-slate-300 hover:text-amber-300 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-700/80 transition shadow-inner"
              title="Xem thông tin & tiểu sử Thầy Tôn"
            >
              <span>{t('nav.about', 'Về Thầy Tôn')}</span>
            </a>
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1 sm:gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{t('nav.login', 'Đăng Nhập')}</span>
            </button>
          </div>
        ) : (
          /* Dropdown Menu Tài Khoản Người Dùng */
          <div className="relative inline-block" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border max-w-[120px] sm:max-w-[160px] ${
                isUserMenuOpen
                  ? 'bg-slate-800 text-amber-300 border-amber-400/80 shadow-md shadow-amber-500/15'
                  : 'bg-slate-950/70 hover:bg-slate-800/80 text-slate-200 hover:text-white border-slate-700/80 shadow-inner'
              }`}
              aria-expanded={isUserMenuOpen}
              title={user?.email || displayName}
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500/40 to-amber-700/40 text-amber-300 flex items-center justify-center text-[10px] font-bold border border-amber-400/40 shrink-0">
                {initialLetter}
              </div>
              <span className="truncate text-[11px] sm:text-xs font-medium">{displayName}</span>
              {testerInfo?.isTester && (
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 animate-pulse" title="Tester" />
              )}
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
                  isUserMenuOpen ? 'rotate-180 text-amber-400' : ''
                }`}
              />
            </button>

            {/* Menu xổ xuống tài khoản */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 sm:w-64 p-2 rounded-2xl bg-slate-900/98 border border-amber-500/40 shadow-2xl backdrop-blur-xl z-50 text-slate-100 animate-fade-in divide-y divide-slate-800">
                {/* Thông tin người dùng */}
                <div className="p-2.5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-amber-300 font-bold text-sm shrink-0 shadow-inner">
                    {initialLetter}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs sm:text-sm text-slate-200 truncate">{fullDisplayName}</span>
                      {testerInfo?.isTester && (
                        <span className="px-1.5 py-0.5 rounded bg-purple-500/25 text-purple-300 border border-purple-500/40 text-[9px] font-bold shrink-0">
                          Tester
                        </span>
                      )}
                    </div>
                    {user?.email && (
                      <p className="text-[10.5px] text-slate-400 truncate leading-tight mt-0.5">{user.email}</p>
                    )}
                  </div>
                </div>

                {/* Các thao tác nhanh */}
                <div className="py-1.5 space-y-0.5">
                  {/* Lá Số Đã Lưu */}
                  {onOpenSavedCharts && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenSavedCharts();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 transition cursor-pointer text-left"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{t('nav.savedCharts', 'Lá Số Đã Lưu')}</span>
                    </button>
                  )}

                  {/* Đổi Mật Khẩu */}
                  {onOpenChangePassword && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onOpenChangePassword();
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-slate-300 hover:text-amber-300 hover:bg-slate-800/80 transition cursor-pointer text-left"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{t('nav.changePassword', 'Đổi Mật Khẩu')}</span>
                    </button>
                  )}
                </div>

                {/* Đăng Xuất */}
                <div className="pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      handleSignOut();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 transition cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5 shrink-0" />
                    <span>{t('nav.logout', 'Đăng Xuất')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
