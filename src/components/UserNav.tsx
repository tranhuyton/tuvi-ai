'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeSelector from '@/components/ThemeSelector';
import GuideMenuDropdown from '@/components/GuideMenuDropdown';
import {
  User,
  LogOut,
  LogIn,
  KeyRound,
  ChevronDown,
  BookOpen,
  GraduationCap,
  Menu,
  X,
  Compass,
  PhoneCall,
  Sparkles,
} from 'lucide-react';

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Đóng menu tài khoản & menu mobile khi click ra ngoài hoặc bấm phím Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    }
    if (isUserMenuOpen || isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isUserMenuOpen, isMobileMenuOpen]);

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
    <header
      ref={mobileMenuRef}
      className="w-full max-w-[1060px] mx-auto mb-4 sm:mb-6 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl imperial-card border border-amber-500/35 backdrop-blur-xl flex items-center justify-between gap-2 relative z-30 before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-amber-300/75 before:to-transparent"
    >
      {/* Khối bên trái: Logo & Brand (Hiển thị đầy đủ cả Mobile lẫn Desktop, không cắt chữ) */}
      <div
        onClick={onNewChart}
        className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group min-w-0 shrink sm:flex-1"
        title="Lập lá số mới"
      >
        <div className="relative shrink-0">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600 opacity-60 blur-[2px] group-hover:opacity-100 transition duration-300" />
          <Image
            src="/favicon.svg"
            alt="Tử Vi & Phong Thủy Thầy Tôn"
            width={36}
            height={36}
            unoptimized
            className="relative w-8 h-8 md:w-9 md:h-9 rounded-full ring-1 ring-amber-300/60 shadow-md shadow-amber-500/30 group-hover:scale-105 transition"
          />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="sm:hidden text-[12.5px] font-extrabold font-serif text-gold-gradient tracking-tight leading-tight whitespace-nowrap drop-shadow-sm">
            {t('brand.shortTitle', 'Tử Vi Thầy Tôn')}
          </span>
          <span className="hidden sm:block text-[13.5px] md:text-[15px] lg:text-[16px] font-extrabold font-serif text-gold-gradient tracking-wide leading-tight whitespace-nowrap drop-shadow-sm">
            {t('brand.title', 'TỬ VI & PHONG THỦY THẦY TÔN')}
          </span>
          <p className="text-[10px] text-slate-300/90 font-sans hidden lg:block truncate tracking-tight">
            <span>{t('brand.subtitle', 'An Sao & Bình Giải Miễn Phí • Phong Thủy Thực Chứng')}</span>
          </p>
        </div>
      </div>

      {/* Khối bên phải: Mobile gọn (VI + Đăng Nhập + ☰), Desktop đầy đủ 1 hàng thoáng */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Bộ chọn ngôn ngữ Quốc Tế dạng Dropdown */}
        <LanguageSelector />

        {/* Bộ chọn màu nền giao diện (Desktop hiển thị trực tiếp, Mobile nằm trong Menu ☰) */}
        <ThemeSelector className="hidden sm:inline-block" />

        {/* Nút tắt nhanh Về Thầy Tôn, Khóa Học & Menu Cẩm Nang (Desktop >= sm / lg) */}
        <Link
          href="/thay-ton"
          className="hidden lg:inline-flex items-center gap-1 h-9 px-2.5 rounded-xl text-xs font-medium text-slate-200 hover:text-amber-300 bg-slate-950/70 hover:bg-slate-800/80 border border-slate-700/80 transition shadow-inner whitespace-nowrap"
          title="Hồ sơ chuyên gia Thầy Tôn (Trần Huy Tôn)"
        >
          <span>{t('nav.about', 'Về Thầy Tôn')}</span>
        </Link>

        <Link
          href="/khoa-hoc"
          className="hidden sm:inline-flex items-center gap-1.5 h-9 px-2.5 md:px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-purple-600/20 hover:from-amber-500/30 hover:to-purple-500/30 text-amber-300 hover:text-amber-200 border border-amber-400/50 transition shadow-sm shadow-amber-500/10 whitespace-nowrap"
          title={t('nav.courseFull', 'Khóa Học Tử Vi Thực Chiến')}
        >
          <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{t('nav.course', 'Khóa Học')}</span>
        </Link>

        <div className="hidden sm:inline-block">
          <GuideMenuDropdown />
        </div>

        {/* Khối tài khoản */}
        {isLoading ? (
          <div className="w-16 sm:w-20 h-8 sm:h-9 bg-slate-800 animate-pulse rounded-xl" />
        ) : !user ? (
          <div className="flex items-center">
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="inline-flex items-center gap-1 sm:gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-[11px] sm:text-xs rounded-xl transition shadow-md shadow-amber-500/20 whitespace-nowrap cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span>{t('nav.login', 'Đăng Nhập')}</span>
            </button>
          </div>
        ) : (
          /* Dropdown Menu Tài Khoản Người Dùng */
          <div className="relative inline-block" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              className={`flex items-center gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border max-w-[105px] sm:max-w-[155px] ${
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
                    {profile?.phone && (
                      <p className="text-[10.5px] text-amber-300/80 truncate leading-tight mt-0.5">📞 {profile.phone}</p>
                    )}
                  </div>
                </div>

                {/* Các thao tác nhanh */}
                <div className="py-1.5 space-y-0.5">
                  {/* Khóa Học Tử Vi Online */}
                  <Link
                    href="/khoa-hoc"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs text-amber-300 font-semibold hover:text-amber-200 hover:bg-slate-800/80 transition"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{t('nav.courseFull', 'Khóa Học Tử Vi Thực Chiến')}</span>
                  </Link>

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

                  {/* Thông Tin & Đổi Mật Khẩu */}
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
                      <span>{t('nav.changePassword', 'Thông Tin & Đổi Mật Khẩu')}</span>
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

        {/* Nút Menu gọn cho Mobile (< sm) để không bao giờ tràn viền */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className={`sm:hidden inline-flex items-center justify-center w-8 h-8 rounded-xl border transition cursor-pointer ${
            isMobileMenuOpen
              ? 'bg-amber-500/20 text-amber-300 border-amber-400/70'
              : 'bg-slate-950/70 text-slate-200 border-slate-700/80 hover:border-amber-500/40'
          }`}
          aria-label="Mở menu điều hướng"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Menu xổ xuống gọn gàng trên Mobile */}
      {isMobileMenuOpen && (
        <div className="sm:hidden absolute left-0 right-0 top-[calc(100%+8px)] p-3 rounded-2xl bg-slate-900/98 border border-amber-500/40 shadow-2xl backdrop-blur-xl z-50 text-slate-100 space-y-2 animate-fade-in">
          <div className="grid grid-cols-1 gap-1.5">
            <Link
              href="/khoa-hoc"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-600/15 to-purple-600/20 border border-amber-400/45 text-amber-300 font-bold text-xs"
            >
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t('nav.courseFull', 'Khóa Học Tử Vi Thực Chiến (699K)')}</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                24 bài
              </span>
            </Link>

            <Link
              href="/thay-ton"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-slate-200 font-semibold text-xs"
            >
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t('nav.about', 'Hồ Sơ Chuyên Gia Thầy Tôn')}</span>
            </Link>

            <Link
              href="/bai-viet"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-slate-200 font-semibold text-xs"
            >
              <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t('nav.guide', 'Cẩm Nang Tử Vi & Phong Thủy (38 chuyên đề)')}</span>
            </Link>

            <div className="grid grid-cols-2 gap-1.5">
              <Link
                href="/phong-thuy"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-slate-200 font-medium text-xs"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{t('about.btnFengShui', 'Phong Thủy')}</span>
              </Link>
              <Link
                href="/dat-lich-xem-tu-vi"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 text-slate-200 font-medium text-xs"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t('booking.processBtn', 'Xem 1-1')}</span>
              </Link>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-medium">
              {t('theme.btnTitle', 'Đổi màu nền giao diện:')}
            </span>
            <ThemeSelector />
          </div>
        </div>
      )}
    </header>
  );
}
