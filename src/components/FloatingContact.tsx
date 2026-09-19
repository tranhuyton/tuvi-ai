'use client';

import React from 'react';
import { PhoneCall, Calendar } from 'lucide-react';

export default function FloatingContact() {
  const phoneNumber = '0935058688';
  const displayPhone = '0935.058.688';
  const zaloUrl = `https://zalo.me/${phoneNumber}`;
  const telUrl = `tel:${phoneNumber}`;

  return (
    <aside
      aria-label="Liên hệ và đặt lịch xem trực tiếp"
      className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 flex flex-col items-end gap-3 print:hidden select-none"
    >
      {/* Nút Chat Zalo */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 p-1.5 sm:p-2 bg-slate-900/95 hover:bg-slate-900 border border-blue-500/50 hover:border-blue-400 rounded-full shadow-2xl shadow-blue-500/30 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        title={`Nhắn tin Zalo với Thầy Tôn (${displayPhone})`}
      >
        <span className="text-xs font-semibold text-blue-300 px-2 group-hover:text-blue-200 transition">
          Nhắn Zalo Thầy Tôn
        </span>
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0068FF] text-white flex items-center justify-center shadow-md">
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <span className="font-extrabold text-sm sm:text-base tracking-tighter">Zalo</span>
        </div>
      </a>

      {/* Nút Gọi Điện Đặt Lịch Xem Offline */}
      <a
        href={telUrl}
        className="group flex items-center gap-2 p-1.5 sm:p-2 bg-slate-900/95 hover:bg-slate-900 border border-amber-500/60 hover:border-amber-400 rounded-full shadow-2xl shadow-amber-500/30 backdrop-blur-md transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
        title={`Gọi điện đặt lịch xem trực tiếp offline với Thầy Tôn (${displayPhone})`}
      >
        <span className="text-xs font-bold text-amber-300 px-2 group-hover:text-amber-200 transition">
          <span className="text-[11px] text-amber-400/80 mr-1 hidden xs:inline">⚡ Đặt lịch:</span>
          {displayPhone}
        </span>
        <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 flex items-center justify-center shadow-lg">
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>
          <PhoneCall className="w-5 h-5 fill-slate-950 animate-pulse" />
        </div>
      </a>
    </aside>
  );
}
