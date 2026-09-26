'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n/translations';

// SVG Lá Cờ Việt Nam chuẩn xác, sắc nét trên mọi hệ điều hành
export function FlagVN({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#DA251D" rx="2" />
      <polygon
        points="15,4 16.5,8.8 21.5,8.8 17.5,11.8 19,16.5 15,13.5 11,16.5 12.5,11.8 8.5,8.8 13.5,8.8"
        fill="#FFFF00"
      />
    </svg>
  );
}

// SVG Lá Cờ Vương Quốc Anh (Union Jack) chuẩn xác
export function FlagGB({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <clipPath id="gb-flag-clip-nav">
        <rect width="30" height="20" rx="2" />
      </clipPath>
      <g clipPath="url(#gb-flag-clip-nav)">
        <rect width="30" height="20" fill="#012169" />
        <path d="M0,0 L30,20 M30,0 L0,20" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="2" />
        <path d="M15,0 V20 M0,10 H30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M15,0 V20 M0,10 H30" stroke="#C8102E" strokeWidth="3.6" />
      </g>
    </svg>
  );
}

// SVG Lá Cờ Trung Quốc (Ngũ Tinh Hồng Kỳ) chuẩn xác
export function FlagCN({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#DE2910" rx="2" />
      {/* Ngôi sao lớn */}
      <polygon
        points="5,3 5.9,5.8 8.8,5.8 6.4,7.5 7.3,10.2 5,8.5 2.7,10.2 3.6,7.5 1.2,5.8 4.1,5.8"
        fill="#FFDE00"
      />
      {/* 4 ngôi sao nhỏ */}
      <circle cx="10" cy="3" r="0.85" fill="#FFDE00" />
      <circle cx="12" cy="5" r="0.85" fill="#FFDE00" />
      <circle cx="12" cy="8" r="0.85" fill="#FFDE00" />
      <circle cx="10" cy="10" r="0.85" fill="#FFDE00" />
    </svg>
  );
}

// SVG Lá Cờ Hàn Quốc (Thái Cực Kỳ) chuẩn xác
export function FlagKR({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#FFFFFF" rx="2" />
      {/* Thái cực âm dương (Đỏ trên - Xanh dưới) */}
      <g transform="rotate(-33.7 15 10)">
        <path d="M11,10 A4,4 0 0,1 19,10 A2,2 0 0,1 15,10 A2,2 0 0,0 11,10 Z" fill="#CD2E3A" />
        <path d="M19,10 A4,4 0 0,1 11,10 A2,2 0 0,1 15,10 A2,2 0 0,0 19,10 Z" fill="#0047A0" />
      </g>
      {/* 4 quẻ bát quái ở 4 góc */}
      <g stroke="#000000" strokeWidth="0.8" strokeLinecap="round">
        {/* Góc trên trái: Càn */}
        <line x1="5.5" y1="5.2" x2="8.2" y2="7" />
        <line x1="4.8" y1="6.3" x2="7.5" y2="8.1" />
        <line x1="4.1" y1="7.4" x2="6.8" y2="9.2" />
        {/* Góc trên phải: Khảm */}
        <line x1="24.5" y1="5.2" x2="21.8" y2="7" />
        <line x1="25.2" y1="6.3" x2="22.5" y2="8.1" />
        <line x1="25.9" y1="7.4" x2="23.2" y2="9.2" />
        {/* Góc dưới trái: Ly */}
        <line x1="4.1" y1="12.6" x2="6.8" y2="10.8" />
        <line x1="4.8" y1="13.7" x2="7.5" y2="11.9" />
        <line x1="5.5" y1="14.8" x2="8.2" y2="13" />
        {/* Góc dưới phải: Khôn */}
        <line x1="25.9" y1="12.6" x2="23.2" y2="10.8" />
        <line x1="25.2" y1="13.7" x2="22.5" y2="11.9" />
        <line x1="24.5" y1="14.8" x2="21.8" y2="13" />
      </g>
    </svg>
  );
}

const LANG_ITEMS: {
  code: Language;
  label: string;
  name: string;
  Flag: React.FC<{ className?: string }>;
}[] = [
  { code: 'vi', label: 'VI', name: 'Tiếng Việt', Flag: FlagVN },
  { code: 'en', label: 'EN', name: 'English', Flag: FlagGB },
  { code: 'zh', label: '中文', name: '中文 (简体)', Flag: FlagCN },
  { code: 'ko', label: '한국어', name: '한국어', Flag: FlagKR },
];

export default function LanguageSelector({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center p-1 rounded-xl bg-slate-950/70 border border-slate-700/80 shadow-inner backdrop-blur-sm gap-1 ${className}`}
      role="group"
      aria-label="Chọn ngôn ngữ"
    >
      {LANG_ITEMS.map((item) => {
        const isSelected = item.code === language;
        const FlagComponent = item.Flag;
        return (
          <button
            key={item.code}
            type="button"
            onClick={() => setLanguage(item.code)}
            title={item.name}
            className={`flex items-center gap-1.5 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isSelected
                ? 'bg-gradient-to-r from-amber-500/25 to-amber-600/25 text-amber-300 border border-amber-400/70 shadow-sm shadow-amber-500/20 scale-[1.03]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            <span className="drop-shadow-sm flex items-center justify-center shrink-0">
              <FlagComponent className="w-5 h-3.5 rounded-[2px] shadow-sm" />
            </span>
            <span className="hidden sm:inline text-[11px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
