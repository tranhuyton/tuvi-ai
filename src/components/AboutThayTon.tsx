'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Compass,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ABOUT_DATA } from '@/lib/i18n/aboutData';

export default function AboutThayTon() {
  const { language } = useLanguage();
  const data = ABOUT_DATA[language] || ABOUT_DATA.vi;

  return (
    <section
      id="gioi-thieu-thay-ton"
      className="w-full max-w-[1060px] mx-auto mt-8 sm:mt-10 scroll-mt-6 print:hidden"
    >
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-slate-900/85 border border-amber-500/30 p-6 sm:p-8 shadow-2xl shadow-amber-950/20">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 mb-6">
          <img
            src="/avatar-thay-ton.jpg"
            alt="Thầy Tôn - Chuyên Gia Tử Vi Đẩu Số và Phong Thủy"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-amber-400/80 shadow-xl shadow-amber-950/40 shrink-0"
          />
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{data.badge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-amber-400 tracking-wide mb-2">
              <Link href="/thay-ton" className="hover:text-amber-300 transition-colors">
                {data.name}
              </Link>
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {data.bio}
            </p>
          </div>
        </div>

        {/* 4 Thẻ Số Liệu Nổi Bật (Stats Grid) */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {data.stats.map((s, idx) => (
            <Link
              key={idx}
              href="/thay-ton"
              className="p-3 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center hover:border-amber-500/50 transition group"
            >
              <div className="text-xl sm:text-2xl font-black text-amber-400 font-serif group-hover:scale-105 transition-transform">
                {s.val}
              </div>
              <div className="text-[11px] sm:text-xs text-slate-300 mt-1 font-medium">{s.label}</div>
            </Link>
          ))}
        </div>

        {/* Nút điều hướng sang Trang Hồ Sơ Chuyên Gia (/thay-ton) & Trang Phong Thủy (/phong-thuy) */}
        <div className="relative z-10 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
            <Link
              href="/thay-ton"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Xem Hồ Sơ &amp; Phương Pháp Luận Giải Của Thầy Tôn</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>

            <Link
              href="/phong-thuy"
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-semibold text-xs sm:text-sm border border-amber-500/30 transition"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Tư Vấn Phong Thủy Theo Lá Số</span>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="hidden lg:inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Royal City, 72 Nguyễn Trãi, Hà Nội
            </span>
            <a
              href="https://zalo.me/0935058688"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Zalo: 0935 058 688
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
