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
  ChevronDown,
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
  const [showAll, setShowAll] = useState(false);

  const header = TESTIMONIALS_HEADERS[language] || TESTIMONIALS_HEADERS.vi;
  const testimonialsData = TESTIMONIALS_BY_LANG[language] || TESTIMONIALS_BY_LANG.vi;

  const filteredTestimonials = useMemo(() => {
    if (activeTab === 'all') return testimonialsData;
    return testimonialsData.filter((item) => item.category === activeTab);
  }, [activeTab, testimonialsData]);

  const displayedTestimonials = showAll
    ? filteredTestimonials
    : filteredTestimonials.slice(0, 4);

  return (
    <section
      id="cam-nhan-chuyen-gia"
      className="w-full max-w-[1060px] mx-auto scroll-mt-6 print:hidden"
    >
      {/* Khung chứa phong cách Imperial Gold đồng bộ */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl imperial-card border border-amber-500/40 p-5 sm:p-8 before:pointer-events-none before:absolute before:inset-x-12 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-amber-300/80 before:to-transparent">
        {/* Ánh sáng trang trí nền */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tiêu đề & Giới thiệu */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold uppercase tracking-widest mb-2.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{header.badge}</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-serif text-gold-gradient tracking-wide mb-2.5 drop-shadow-sm">
            {header.title}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed">
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
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {displayedTestimonials.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-950/75 border border-slate-800/90 hover:border-amber-500/40 transition flex flex-col justify-between space-y-3.5 shadow-lg hover:shadow-amber-500/5 relative group"
            >
              {/* Biểu tượng Quote mờ nghệ thuật phía sau */}
              <Quote className="w-10 h-10 text-amber-400/5 absolute top-4 right-4 pointer-events-none group-hover:text-amber-400/10 transition" />

              <div className="space-y-2.5 relative z-10">
                {/* Đánh giá sao & Huy hiệu phân loại */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400 drop-shadow-sm"
                      />
                    ))}
                  </div>

                  <span className="text-[10.5px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/25">
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Tiêu đề nhận xét nổi bật */}
                <h3 className="text-sm sm:text-base font-bold font-serif text-amber-300 leading-snug">
                  &ldquo;{item.highlight}&rdquo;
                </h3>

                {/* Đoạn trích nhận xét chi tiết */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed text-justify">
                  {item.content}
                </p>

                {/* Các thẻ Hashtag */}
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] text-amber-400/85 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Thông tin tác giả */}
              <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  {/* Avatar dạng Monogram chữ cái đầu sắc nét */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/25 via-amber-600/20 to-slate-900 border border-amber-400/50 flex items-center justify-center text-amber-300 font-serif font-bold text-sm shadow-sm shrink-0">
                    {item.avatarText}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-100 text-xs sm:text-sm leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 leading-snug">
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

        {filteredTestimonials.length > 4 && (
          <div className="relative z-10 mt-5 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-500/35 text-xs font-bold transition cursor-pointer"
            >
              <span>
                {showAll
                  ? language === 'vi'
                    ? 'Thu gọn bớt nhận xét'
                    : 'Show fewer reviews'
                  : language === 'vi'
                  ? `Xem thêm ${filteredTestimonials.length - 4} nhận xét thực tế khác`
                  : `View ${filteredTestimonials.length - 4} more verified reviews`}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showAll ? 'rotate-180' : ''
                }`}
              />
            </button>
          </div>
        )}

        {/* Khối Ghi Chú Cam Kết Cuối Mục Testimonials */}
        <div className="relative z-10 mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950/80 to-amber-500/10 border border-amber-500/25 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
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
            href="#lap-la-so"
            className="btn-shimmer inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold text-xs sm:text-sm shadow-md transition shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>{header.ctaBtn}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
