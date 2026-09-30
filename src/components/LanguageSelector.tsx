'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/i18n/translations';
import { ChevronDown, Check } from 'lucide-react';

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
      <polygon
        points="5,3 5.9,5.8 8.8,5.8 6.4,7.5 7.3,10.2 5,8.5 2.7,10.2 3.6,7.5 1.2,5.8 4.1,5.8"
        fill="#FFDE00"
      />
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
      <g transform="rotate(-33.7 15 10)">
        <path d="M11,10 A4,4 0 0,1 19,10 A2,2 0 0,1 15,10 A2,2 0 0,0 11,10 Z" fill="#CD2E3A" />
        <path d="M19,10 A4,4 0 0,1 11,10 A2,2 0 0,1 15,10 A2,2 0 0,0 19,10 Z" fill="#0047A0" />
      </g>
      <g stroke="#000000" strokeWidth="0.8" strokeLinecap="round">
        <line x1="5.5" y1="5.2" x2="8.2" y2="7" />
        <line x1="4.8" y1="6.3" x2="7.5" y2="8.1" />
        <line x1="4.1" y1="7.4" x2="6.8" y2="9.2" />
        <line x1="24.5" y1="5.2" x2="21.8" y2="7" />
        <line x1="25.2" y1="6.3" x2="22.5" y2="8.1" />
        <line x1="25.9" y1="7.4" x2="23.2" y2="9.2" />
        <line x1="4.1" y1="12.6" x2="6.8" y2="10.8" />
        <line x1="4.8" y1="13.7" x2="7.5" y2="11.9" />
        <line x1="5.5" y1="14.8" x2="8.2" y2="13" />
        <line x1="25.9" y1="12.6" x2="23.2" y2="10.8" />
        <line x1="25.2" y1="13.7" x2="22.5" y2="11.9" />
        <line x1="24.5" y1="14.8" x2="21.8" y2="13" />
      </g>
    </svg>
  );
}

// SVG Lá Cờ Nhật Bản (Hinomaru) chuẩn xác
export function FlagJP({ className = 'w-5 h-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#FFFFFF" rx="2" />
      <circle cx="15" cy="10" r="5.5" fill="#BC002D" />
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
  { code: 'zh', label: 'ZH', name: '中文 (简体)', Flag: FlagCN },
  { code: 'ko', label: 'KO', name: '한국어', Flag: FlagKR },
  { code: 'ja', label: 'JA', name: '日本語', Flag: FlagJP },
];

export default function LanguageSelector({ className = '' }: { className?: string }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng khi click bên ngoài hoặc bấm Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const currentLang = LANG_ITEMS.find((l) => l.code === language) || LANG_ITEMS[0];

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Nút bấm gọn gàng */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 h-8 sm:h-9 px-2 sm:px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
          isOpen
            ? 'bg-slate-800 text-amber-300 border-amber-400/80 shadow-md shadow-amber-500/15'
            : 'bg-slate-950/70 hover:bg-slate-800/80 text-slate-300 hover:text-white border-slate-700/80 shadow-inner'
        }`}
        title="Chọn ngôn ngữ / Select Language"
        aria-label="Chọn ngôn ngữ"
        aria-expanded={isOpen}
      >
        <span className="drop-shadow-sm flex items-center justify-center shrink-0">
          <currentLang.Flag className="w-4 h-3 sm:w-4.5 sm:h-3 rounded-[2px] shadow-sm" />
        </span>
        <span className="text-[11px] font-bold tracking-tight">{currentLang.label}</span>
        <ChevronDown
          className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-amber-400' : ''
          }`}
        />
      </button>

      {/* Menu xổ xuống lựa chọn ngôn ngữ */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 sm:w-52 p-1.5 rounded-2xl bg-slate-900/98 border border-amber-500/40 shadow-2xl backdrop-blur-xl z-50 text-slate-100 animate-fade-in divide-y divide-slate-800/70">
          <div className="px-2.5 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Ngôn ngữ / Language
          </div>
          <div className="pt-1 space-y-0.5">
            {LANG_ITEMS.map((item) => {
              const isSelected = item.code === language;
              const FlagComponent = item.Flag;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLanguage(item.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FlagComponent className="w-5 h-3.5 rounded-[2px] shadow-sm shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 stroke-[2.5]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
