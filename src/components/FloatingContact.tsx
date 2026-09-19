'use client';

import React from 'react';
import { PhoneCall, Sparkles } from 'lucide-react';

export default function FloatingContact() {
  const phoneNumber = '0935058688';
  const displayPhone = '0935.058.688';
  const zaloUrl = `https://zalo.me/${phoneNumber}`;
  const telUrl = `tel:${phoneNumber}`;

  return (
    <aside
      aria-label="Tư vấn CSKH hoặc Đặt lịch xem offline"
      className="fixed bottom-5 right-3 sm:bottom-7 sm:right-6 z-50 flex flex-col items-end gap-2.5 print:hidden select-none"
    >
      {/* Tiêu đề cụm liên hệ */}
      <div className="flex items-center gap-1.5 px-3.5 py-1 bg-slate-950/95 border border-amber-500/50 rounded-full shadow-2xl backdrop-blur-md text-[11px] sm:text-xs font-bold text-amber-300">
        <Sparkles className="w-3 h-3 text-amber-400 shrink-0 animate-pulse" />
        <span>Tư vấn CSKH hoặc Đặt lịch xem offline</span>
      </div>

      {/* Nút Chat Zalo */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 p-1 sm:p-1.5 bg-slate-900/95 hover:bg-slate-900 border border-blue-500/50 hover:border-blue-400 rounded-full shadow-2xl shadow-blue-500/30 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        title={`Tư vấn CSKH qua Zalo Thầy Tôn (${displayPhone})`}
      >
        <div className="flex flex-col text-right pl-3 pr-1">
          <span className="text-[10px] text-blue-300/90 font-medium leading-tight">
            Tư vấn CSKH
          </span>
          <span className="text-xs sm:text-sm font-bold text-blue-100 group-hover:text-blue-200 transition leading-tight">
            Nhắn Zalo Thầy Tôn
          </span>
        </div>
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0068FF] text-white flex items-center justify-center shadow-md shrink-0">
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
          </span>
          <span className="font-extrabold text-xs sm:text-sm tracking-tighter">Zalo</span>
        </div>
      </a>

      {/* Nút Gọi Điện Đặt Lịch Xem Offline */}
      <a
        href={telUrl}
        className="group flex items-center gap-2 p-1 sm:p-1.5 bg-slate-900/95 hover:bg-slate-900 border border-amber-500/60 hover:border-amber-400 rounded-full shadow-2xl shadow-amber-500/30 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        title={`Đặt lịch xem offline / Gọi điện Thầy Tôn (${displayPhone})`}
      >
        <div className="flex flex-col text-right pl-3 pr-1">
          <span className="text-[10px] text-amber-400/90 font-medium leading-tight">
            Đặt lịch xem offline
          </span>
          <span className="text-xs sm:text-sm font-bold text-amber-300 tracking-wide group-hover:text-amber-200 transition leading-tight">
            {displayPhone}
          </span>
        </div>
        <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
          <PhoneCall className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950 animate-pulse" />
        </div>
      </a>
    </aside>
  );
}
