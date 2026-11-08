'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  PhoneCall,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  HelpCircle,
  Crown,
  CheckCircle2,
  MapPin,
  GraduationCap,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { FUNNEL_PAGES, type FunnelPageData } from '@/lib/funnelPages';
import { ABOUT_DATA } from '@/lib/i18n/aboutData';
import { useLanguage } from '@/context/LanguageContext';
import { translateFunnelPageTitle } from '@/lib/i18n/homeFunnelData';
import {
  EXTERNAL_PAGE_UI,
  getLocalizedMetaphysicalBadge,
  getLocalizedFunnelPage,
} from '@/lib/i18n/externalPagesI18n';
import GuideMenuDropdown from '@/components/GuideMenuDropdown';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeSelector from '@/components/ThemeSelector';
import { ArticleHeroIllustration } from '@/components/MetaphysicalIllustration';

export default function FunnelSlugClient({ page: rawPage }: { page: FunnelPageData }) {
  const { language } = useLanguage();
  const ui = EXTERNAL_PAGE_UI[language];
  const page = getLocalizedFunnelPage(rawPage, language);
  const about = ABOUT_DATA[language] || ABOUT_DATA.vi;

  const group1Pages = FUNNEL_PAGES.filter((p) => p.groupNum === 1 && p.code !== rawPage.code);
  const group2Pages = FUNNEL_PAGES.filter((p) => p.groupNum === 2 && p.code !== rawPage.code);
  const group3Pages = FUNNEL_PAGES.filter((p) => p.groupNum === 3 && p.code !== rawPage.code);

  const isExternalPrimary =
    page.primaryCta.href.startsWith('http') || page.primaryCta.href.startsWith('tel:');
  const isExternalSecondary =
    page.secondaryCta.href.startsWith('http') || page.secondaryCta.href.startsWith('tel:');

  return (
    <div className="max-w-4xl mx-auto relative z-10">
      {/* Top Navigation Bar */}
      <nav
        aria-label={ui.homeChart}
        className="relative z-40 flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80"
      >
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400">
          <Link
            href="/"
            className="hover:text-amber-300 transition-colors flex items-center gap-1 font-medium text-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            {ui.homeChart}
          </Link>
          <span>/</span>
          {page.groupNum === 2 && page.code !== 'C1' && (
            <>
              <Link href="/phong-thuy" className="hover:text-amber-300 transition-colors">
                {ui.fengShui}
              </Link>
              <span>/</span>
            </>
          )}
          {page.groupNum === 3 && page.code !== 'B1' && (
            <>
              <Link href="/cach-xem-la-so-tu-vi" className="hover:text-amber-300 transition-colors">
                {ui.ziWeiKnowledge}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-amber-300 font-medium line-clamp-1 max-w-[200px] sm:max-w-[320px]">
            {page.h1}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <LanguageSelector />
          <ThemeSelector />
          <GuideMenuDropdown />
          <Link
            href="/#lap-la-so"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 hover:from-amber-400 hover:to-yellow-500 transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {ui.freeChartBtn}
          </Link>
        </div>
      </nav>

      {/* Main Article Container */}
      <article className="bg-slate-900/65 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Role & Branch Badge */}
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border text-amber-300 bg-amber-950/60 border-amber-500/40">
            <Crown className="w-3.5 h-3.5" />
            {getLocalizedMetaphysicalBadge(page.code, language)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            {ui.badge2Standard}
          </span>
        </div>

        {/* H1 Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
          {page.h1}
        </h1>

        {/* Author & Expert Verification Line */}
        <div className="flex flex-wrap items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 mb-8 text-xs sm:text-sm text-slate-300">
          <img
            src="/avatar-thay-ton.jpg"
            alt={about.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/60 shadow-md shrink-0"
          />
          <div className="flex-1 min-w-[200px]">
            <p className="font-semibold text-amber-300">{page.authorLine}</p>
            <p className="text-xs text-slate-400 mt-0.5">{ui.authorBioLine}</p>
          </div>
          {page.code !== 'TR' ? (
            <Link
              href="/thay-ton"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 shrink-0"
            >
              {ui.viewProfileLink}
            </Link>
          ) : (
            <Link
              href="/#lap-la-so"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 shrink-0"
            >
              {ui.backToChartLink}
            </Link>
          )}
        </div>

        {/* Tóm tắt nhanh (H2) — GEO Answer-First Highlight Block */}
        <section
          aria-label={ui.quickSummaryLabel}
          className="mb-8 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-indigo-950/30 border border-amber-500/40 p-5 sm:p-6 shadow-lg"
        >
          <h2 className="text-base sm:text-lg font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 mb-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            {ui.quickSummaryLabel}
          </h2>
          <p
            className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: page.quickSummaryHtml }}
          />
        </section>

        {/* Ảnh Minh Họa & Sơ Đồ Chuyên Đề Trực Quan Cho Từng Bài Cẩm Nang */}
        <ArticleHeroIllustration
          code={page.code}
          title={page.h1}
          groupNum={page.groupNum}
        />

        {/* Khối Visual Hồ Sơ Chuyên Gia Dành Riêng Cho Trang /thay-ton (Mã TR) */}
        {page.code === 'TR' && (
          <section className="mb-10 space-y-6 rounded-3xl bg-slate-950/75 border border-amber-500/35 p-5 sm:p-8 shadow-xl">
            {/* Chân dung & Giới thiệu Chuyên Gia */}
            <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-800/80">
              <img
                src="/avatar-thay-ton.jpg"
                alt={about.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-amber-400/80 shadow-xl shadow-amber-950/50 shrink-0"
              />
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{about.badge}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-400 mb-2">
                  {about.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {about.bio}
                </p>
              </div>
            </div>

            {/* 4 Thẻ Số Liệu Nổi Bật */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {about.stats.map((s, idx) => (
                <div
                  key={idx}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/25 text-center"
                >
                  <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">
                    {s.val}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* 3 Cột Trụ Nền Tảng Học Thuật & Thực Chứng */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif">
                  {about.pillar1.title}
                </h3>
                <ul className="text-xs sm:text-sm text-slate-200 space-y-2 leading-relaxed">
                  {about.pillar1.points.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-blue-300 font-serif">
                  {about.pillar2.title}
                </h3>
                <ul className="text-xs sm:text-sm text-slate-200 space-y-2 leading-relaxed">
                  {about.pillar2.points.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
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

              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-purple-300 font-serif">
                  {about.pillar3.title}
                </h3>
                <ul className="text-xs sm:text-sm text-slate-200 space-y-2 leading-relaxed">
                  {about.pillar3.points.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Thanh điều hướng quay lại Lập Lá Số / Mua Gói ngay sau khi đọc tổng quan hồ sơ */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
              <span className="text-xs sm:text-sm text-amber-200 font-medium">
                {ui.trReadyPrompt}
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/#lap-la-so"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{ui.trBackToUnlockBtn}</span>
                </Link>
                <a
                  href="https://tonyenglish.vn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
                >
                  <span>TonyEnglish.vn</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Introductory Context Paragraph */}
        {page.introHtml && (
          <p
            className="text-slate-200 leading-relaxed text-base sm:text-lg mb-6 pb-4 border-b border-slate-800/80"
            dangerouslySetInnerHTML={{ __html: page.introHtml }}
          />
        )}

        {/* Main Body Content (H2, H3, Lists, Tables, Internal Links) */}
        <div
          className="prose prose-invert max-w-none text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
        />

        {/* Câu hỏi thường gặp (H2) */}
        {page.faqs.length > 0 && (
          <section className="mt-12 pt-8 border-t border-slate-800">
            <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mb-6 flex items-center gap-2.5">
              <HelpCircle className="w-6 h-6 text-amber-400 shrink-0" />
              {ui.faqHeading}
            </h2>
            <div className="space-y-4">
              {page.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-950/70 border border-slate-800/90 p-5 hover:border-amber-500/30 transition-colors"
                >
                  <h3 className="text-base sm:text-lg font-bold text-amber-200 mb-2 flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{faq.question}</span>
                  </h3>
                  <p
                    className="text-sm sm:text-base text-slate-300 leading-relaxed pl-7"
                    dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Closing Section + Primary & Secondary CTA Buttons */}
        <section className="mt-10 pt-6 border-t border-slate-800/80">
          {page.closingHtml && (
            <div
              className="mb-6"
              dangerouslySetInnerHTML={{ __html: page.closingHtml }}
            />
          )}

          <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/40 p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5">
              {isExternalPrimary ? (
                <a
                  href={page.primaryCta.href}
                  target={page.primaryCta.href.startsWith('http') ? '_blank' : undefined}
                  rel={page.primaryCta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{page.primaryCta.label}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </a>
              ) : (
                <Link
                  href={page.primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all"
                >
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>{page.primaryCta.label}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>
              )}

              {isExternalSecondary ? (
                <a
                  href={page.secondaryCta.href}
                  target={page.secondaryCta.href.startsWith('http') ? '_blank' : undefined}
                  rel={page.secondaryCta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-semibold text-sm sm:text-base border border-amber-500/30 transition-all"
                >
                  <PhoneCall className="w-4 h-4 shrink-0" />
                  <span>{page.secondaryCta.label}</span>
                </a>
              ) : (
                <Link
                  href={page.secondaryCta.href}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-semibold text-sm sm:text-base border border-amber-500/30 transition-all"
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>{page.secondaryCta.label}</span>
                </Link>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {ui.locationNote}
              </span>
              <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
                <PhoneCall className="w-3.5 h-3.5" />
                {ui.hotlineNote}
              </span>
            </div>
          </div>
        </section>
      </article>

      {/* Funnel Cluster Navigation (3 Branches) */}
      <section
        aria-label={ui.dirHeading}
        className="mt-10 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            {ui.dirHeading}
          </h2>
          <Link
            href="/"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4"
          >
            {ui.dirBackHome}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Nhánh 1 */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 pb-2 border-b border-slate-800">
              {ui.dirBranch1}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="text-slate-300 hover:text-amber-300 transition-colors block py-0.5">
                  • {ui.dirHomeItem}
                </Link>
              </li>
              {group1Pages
                .filter((p) => p.code !== 'H')
                .map((p) => (
                  <li key={p.code}>
                    <Link
                      href={p.url}
                      className="text-slate-300 hover:text-amber-300 transition-colors block py-0.5"
                    >
                      • {translateFunnelPageTitle(p.url, p.h1, language)}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Nhánh 2 */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 pb-2 border-b border-slate-800">
              {ui.dirBranch2}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {group2Pages.map((p) => (
                <li key={p.code}>
                  <Link
                    href={p.url}
                    className="text-slate-300 hover:text-emerald-300 transition-colors block py-0.5"
                  >
                    • {translateFunnelPageTitle(p.url, p.h1, language)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nhánh 3 */}
          <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 pb-2 border-b border-slate-800">
              {ui.dirBranch3}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {group3Pages.map((p) => (
                <li key={p.code}>
                  <Link
                    href={p.url}
                    className="text-slate-300 hover:text-indigo-300 transition-colors block py-0.5"
                  >
                    • {translateFunnelPageTitle(p.url, p.h1, language)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="mt-8 pt-5 border-t border-slate-800/60 text-center text-[11px] text-slate-500 leading-relaxed max-w-3xl mx-auto">
        {ui.disclaimer}
      </footer>
    </div>
  );
}
