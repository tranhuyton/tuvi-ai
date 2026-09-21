'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PhoneCall, X, Sparkles, Headphones } from 'lucide-react';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const phoneNumber = '0935058688';
  const displayPhone = '0935.058.688';
  const zaloUrl = `https://zalo.me/${phoneNumber}`;
  const telUrl = `tel:${phoneNumber}`;

  // Đóng khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50 print:hidden select-none"
    >
      {/* Menu xổ ra khi bấm mở */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 sm:w-80 bg-slate-900/95 border border-amber-500/40 rounded-2xl shadow-2xl backdrop-blur-xl p-3.5 space-y-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200 text-slate-100">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tư vấn CSKH hoặc Đặt lịch Online &amp; Offline</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Đóng menu"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Nút Gọi Điện Đặt Lịch */}
          <a
            href={telUrl}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/10 hover:from-amber-500/25 hover:to-amber-600/20 border border-amber-500/30 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow-md group-hover:scale-105 transition">
              <PhoneCall className="w-4 h-4 fill-slate-950" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[11px] text-amber-400/90 font-medium">Đặt lịch xem Online &amp; Offline</div>
              <div className="text-sm font-bold text-amber-300 tracking-wide">{displayPhone}</div>
            </div>
          </a>

          {/* Nút Zalo Tư Vấn CSKH */}
          <a
            href={zaloUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0068FF] text-white flex items-center justify-center font-black shrink-0 shadow-md group-hover:scale-105 transition text-xs">
              Zalo
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-[11px] text-blue-300 font-medium">Tư vấn CSKH qua Zalo</div>
              <div className="text-xs font-bold text-white">Nhắn Zalo Thầy Tôn</div>
            </div>
          </a>
        </div>
      )}

      {/* Nút tròn chính (chỉ 1 nút nhỏ gọn, không che chắn nội dung trên mobile) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 shadow-2xl shadow-amber-500/40 hover:from-amber-400 hover:to-amber-500 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-amber-300/40"
        title={isOpen ? 'Đóng menu' : 'Tư vấn CSKH hoặc Đặt lịch xem Online & Offline'}
        aria-expanded={isOpen}
      >
        {/* Ripple ping effect khi đóng */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400 border-2 border-slate-950"></span>
          </span>
        )}

        {isOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        ) : (
          <>
            <Headphones className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
            <span className="hidden sm:inline font-bold text-xs tracking-tight pr-0.5">
              Hỗ Trợ &amp; Đặt Lịch
            </span>
          </>
        )}
      </button>
    </div>
  );
}
