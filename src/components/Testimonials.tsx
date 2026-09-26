'use client';

import React, { useState, useMemo } from 'react';
import {
  Star,
  Quote,
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap,
  Compass,
  Clapperboard,
  BadgeCheck,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import {
  TESTIMONIALS_HEADERS,
  TESTIMONIALS_BY_LANG,
} from '@/lib/i18n/testimonialsData';

type CategoryFilter = 'all' | 'expert' | 'business' | 'artist' | 'student';

export default function Testimonials() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<CategoryFilter>('all');

  const header = TESTIMONIALS_HEADERS[language] || TESTIMONIALS_HEADERS.vi;
  const testimonialsData = TESTIMONIALS_BY_LANG[language] || TESTIMONIALS_BY_LANG.vi;

  const filteredTestimonials = useMemo(() => {
    if (activeTab === 'all') return testimonialsData;
    return testimonialsData.filter((item) => item.category === activeTab);
  }, [activeTab, testimonialsData]);

  return (
    <section
      id="cam-nhan-chuyen-gia"
      className="w-full max-w-[1060px] mx-auto mt-10 sm:mt-14 scroll-mt-6"
    >
      {/* Khung chứa phong cách Cosmic sang trọng */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-slate-900/85 border border-amber-500/30 p-6 sm:p-10 shadow-2xl shadow-amber-950/20">
        {/* Ánh sáng trang trí nền */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tiêu đề & Giới thiệu */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{header.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-amber-400 tracking-wide mb-3">
            {header.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {header.desc}
          </p>
        </div>

        {/* 4 Chỉ Số Uy Tín (Trust Badges Strip) */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          {header.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-amber-500/25 text-center"
            >
              <div
                className={`text-2xl sm:text-3xl font-black font-serif ${
                  stat.isEmerald ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {stat.val}
              </div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Bộ Lọc Tabs Theo Nhóm Đối Tượng */}
        <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {header.tabAll} ({testimonialsData.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('expert')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'expert'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{header.tabExpert}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'business'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{header.tabBusiness}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('artist')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'artist'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>{header.tabArtist}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{header.tabStudent}</span>
          </button>
        </div>

        {/* Lưới Danh Sách Các Lời Nhận Xét (Testimonial Grid) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-950/75 border border-slate-800/90 hover:border-amber-500/40 transition flex flex-col justify-between space-y-4 shadow-lg hover:shadow-amber-500/5 relative group"
            >
              {/* Biểu tượng Quote mờ nghệ thuật phía sau */}
              <Quote className="w-12 h-12 text-amber-400/5 absolute top-4 right-4 pointer-events-none group-hover:text-amber-400/10 transition" />

              <div className="space-y-3 relative z-10">
                {/* Đánh giá sao & Huy hiệu phân loại */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm"
                      />
                    ))}
                  </div>

                  <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/25">
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Tiêu đề nhận xét nổi bật */}
                <h3 className="text-base sm:text-lg font-bold font-serif text-amber-300 leading-snug">
                  &ldquo;{item.highlight}&rdquo;
                </h3>

                {/* Đoạn trích nhận xét chi tiết */}
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed text-justify">
                  {item.content}
                </p>

                {/* Các thẻ Hashtag */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-amber-400/80 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Thông tin tác giả */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  {/* Avatar dạng Monogram chữ cái đầu sắc nét */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500/25 via-amber-600/20 to-slate-900 border border-amber-400/50 flex items-center justify-center text-amber-300 font-serif font-bold text-sm sm:text-base shadow-sm shrink-0">
                    {item.avatarText}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-100 text-sm sm:text-base leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                      {item.role}
                    </p>
                  </div>
                </div>

                {item.verifiedDate && (
                  <div
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full shrink-0"
                    title={header.verifiedLabel}
                  >
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>{item.verifiedDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Khối Ghi Chú Cam Kết Cuối Mục Testimonials */}
        <div className="relative z-10 mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950/80 to-amber-500/10 border border-amber-500/25 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-300 text-sm sm:text-base font-serif">
                {header.privacyTitle}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {header.privacyDesc}
              </p>
            </div>
          </div>

          <a
            href="#tuvi-form"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>{header.ctaBtn}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
