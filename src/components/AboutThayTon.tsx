'use client';

import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  Compass,
  CheckCircle2,
  MapPin,
  Mail,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ABOUT_DATA } from '@/lib/i18n/aboutData';

export default function AboutThayTon() {
  const { language } = useLanguage();
  const data = ABOUT_DATA[language] || ABOUT_DATA.vi;

  return (
    <section
      id="gioi-thieu-thay-ton"
      className="w-full max-w-[1060px] mx-auto mt-10 sm:mt-14 scroll-mt-6"
    >
      {/* Khung chính phong cách Cosmic Gold sang trọng */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-slate-900/85 border border-amber-500/30 p-6 sm:p-10 shadow-2xl shadow-amber-950/20">
        {/* Hào quang nền trang trí */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Phần đầu: Tiêu đề & Giới thiệu ngắn */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{data.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-amber-400 tracking-wide mb-3">
            {data.name}
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {data.bio}
          </p>
        </div>

        {/* 4 Thẻ Số Liệu Nổi Bật (Stats Grid) */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {data.stats.map((s, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center hover:border-amber-500/40 transition"
            >
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">{s.val}</div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 3 Cột Trụ Nền Tảng (3 Pillars Grid) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-12">
          {/* Cột 1: Học vấn */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-amber-300 font-serif">
                {data.pillar1.title}
              </h3>
              <ul className="text-sm sm:text-base text-slate-200 space-y-2.5 leading-relaxed">
                {data.pillar1.points.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cột 2: Kinh nghiệm Tài chính & Nghiên cứu */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-300 font-serif">
                {data.pillar2.title}
              </h3>
              <ul className="text-sm sm:text-base text-slate-200 space-y-2.5 leading-relaxed">
                {data.pillar2.points.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                    <span>
                      {typeof p === 'string' ? (
                        p
                      ) : (
                        <>
                          {p.text}
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline inline-flex items-center gap-0.5 font-semibold"
                          >
                            {p.linkText} <ExternalLink className="w-3.5 h-3.5 inline" />
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cột 3: Kinh nghiệm Tử Vi */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-purple-300 font-serif">
                {data.pillar3.title}
              </h3>
              <ul className="text-sm sm:text-base text-slate-200 space-y-2.5 leading-relaxed">
                {data.pillar3.points.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Khối Triết Lý Luận Giải */}
        <div className="relative z-10 bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-amber-500/10 p-5 sm:p-7 rounded-2xl border border-amber-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-amber-400 font-serif font-bold text-lg sm:text-xl">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{data.philosophy.title}</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                {data.philosophy.desc}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href="https://tonyenglish.vn/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-sm sm:text-base font-semibold transition"
                title="Ghé thăm trang web học thuật cá nhân của Thầy Tôn"
              >
                <span>{data.philosophy.websiteBtn}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="https://zalo.me/0935058688"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm sm:text-base font-bold shadow-md shadow-amber-500/20 transition"
                title="Tư vấn hoặc đặt lịch luận giải trực tiếp"
              >
                <PhoneCall className="w-4 h-4" />
                <span>{data.philosophy.contactBtn}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Thông tin liên hệ & Địa chỉ đàm đạo trực tiếp */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-sm sm:text-base text-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>{data.addressLabel}</strong> {data.addressValue}
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{data.contactLabel}</strong>{' '}
                <a href="tel:0935058688" className="text-amber-400 hover:text-amber-300 font-bold transition">
                  0935.058.688
                </a>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="mailto:tranhuyton@gmail.com" className="text-slate-300 hover:text-white transition">
                tranhuyton@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
