'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  BookOpen,
  Crown,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { FUNNEL_PAGES, getFunnelPageByCode } from '@/lib/funnelPages';
import { useLanguage } from '@/context/LanguageContext';
import { HOME_FUNNEL_I18N, translateFunnelPageTitle } from '@/lib/i18n/homeFunnelData';

export default function HomeFunnelContent() {
  const { language } = useLanguage();
  const homePage = getFunnelPageByCode('H');
  if (!homePage) return null;

  const isVi = language === 'vi';
  const i18nData = !isVi ? HOME_FUNNEL_I18N[language] : null;

  const group1Pages = FUNNEL_PAGES.filter((p) => p.groupNum === 1 && p.code !== 'H');
  const group2Pages = FUNNEL_PAGES.filter((p) => p.groupNum === 2);
  const group3Pages = FUNNEL_PAGES.filter((p) => p.groupNum === 3);

  const badge1 = i18nData ? i18nData.badge1 : 'Cẩm Nang Lập Lá Số & Hệ Sinh Thái Luận Giải';
  const badge2 = i18nData ? i18nData.badge2 : 'Chuẩn Tử Vi Đẩu Số & Phong Thủy Thực Chiến';
  const heading = i18nData ? i18nData.h1 : homePage.h1;
  const authorLine = i18nData ? i18nData.authorLine : homePage.authorLine;
  const profileLinkText = i18nData ? i18nData.profileLinkText : 'Hồ sơ chuyên gia Thầy Tôn →';
  const quickSummaryLabel = i18nData ? i18nData.quickSummaryLabel : 'Tóm tắt nhanh';
  const quickSummaryHtml = i18nData ? i18nData.quickSummaryHtml : homePage.quickSummaryHtml;
  const introHtml = i18nData ? i18nData.introHtml : homePage.introHtml;
  const bodyHtml = i18nData ? i18nData.bodyHtml : homePage.bodyHtml;
  const faqHeading = i18nData ? i18nData.faqHeading : 'Câu hỏi thường gặp khi lập lá số & nâng cấp bản luận giải';
  const faqs = i18nData ? i18nData.faqs : homePage.faqs;
  const closingHtml = i18nData ? i18nData.closingHtml : homePage.closingHtml;
  const primaryCtaLabel = i18nData ? i18nData.primaryCtaLabel : homePage.primaryCta.label;
  const secondaryCtaLabel = i18nData ? i18nData.secondaryCtaLabel : homePage.secondaryCta.label;
  const dirBadge = i18nData ? i18nData.dirBadge : 'Sơ Đồ Tri Thức & Dịch Vụ';
  const dirHeading = i18nData
    ? i18nData.dirHeading.replace('{count}', String(FUNNEL_PAGES.length))
    : `Hệ Thống ${FUNNEL_PAGES.length} Chuyên Đề Tử Vi Đẩu Số & Phong Thủy Thầy Tôn`;
  const dirViewAll = i18nData ? i18nData.dirViewAll : 'Xem Toàn Bộ Thư Viện →';
  const dirBranch1 = i18nData ? i18nData.dirBranch1 : 'Luận Mệnh & Tham Vấn • Ấn Phẩm Chuyên Sâu';
  const dirBranch2 = i18nData ? i18nData.dirBranch2 : 'Phong Thủy & Trạch Nhật • Địa Lợi Cải Vận';
  const dirBranch3 = i18nData ? i18nData.dirBranch3 : 'Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số';

  return (
    <section
      id="huong-dan-lap-la-so-va-bang-gia"
      aria-label={heading}
      className="max-w-[1060px] mx-auto px-1 sm:px-0 space-y-8 print:hidden"
    >
      {/* Main Homepage SEO & GEO Guide Card (Bài 1 - Mã H) */}
      <div className="bg-slate-900/75 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-wrap items-center gap-2.5 mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border text-amber-300 bg-amber-950/60 border-amber-500/40">
            <Crown className="w-3.5 h-3.5" />
            {badge1}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            {badge2}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
          {heading}
        </h2>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-amber-300/90 mb-6 pb-4 border-b border-slate-800">
          <span>{authorLine}</span>
          <Link
            href="/thay-ton"
            className="text-amber-400 hover:text-amber-300 underline underline-offset-4 font-semibold"
          >
            {profileLinkText}
          </Link>
        </div>

        {/* Tóm tắt nhanh (Answer-First GEO Block) */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-indigo-950/30 border border-amber-500/40 p-5 sm:p-6 shadow-lg">
          <h2 className="text-base sm:text-lg font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            {quickSummaryLabel}
          </h2>
          <p
            className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: quickSummaryHtml }}
          />
        </div>

        {/* Intro Paragraph */}
        {introHtml && (
          <p
            className="text-slate-200 leading-relaxed text-base mb-6"
            dangerouslySetInnerHTML={{ __html: introHtml }}
          />
        )}

        {/* Main Body (Steps, Package Comparison Table, Upgrade Difference Table, AI Q&A, Method, Phong Thuy, Payment) */}
        <div
          className="prose prose-invert max-w-none text-sm sm:text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {/* Câu hỏi thường gặp (5 FAQs of Bài 1) */}
        <div className="mt-10 pt-8 border-t border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mb-5 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-400 shrink-0" />
            {faqHeading}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-950/70 border border-slate-800/90 p-5 hover:border-amber-500/30 transition-colors"
              >
                <h3 className="text-sm sm:text-base font-bold text-amber-200 mb-2 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <span>{faq.question}</span>
                </h3>
                <p
                  className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6"
                  dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Chủ đề tử vi và phong thủy liên quan & Bước tiếp theo */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div
            className="text-sm sm:text-base"
            dangerouslySetInnerHTML={{ __html: closingHtml }}
          />

          <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5">
            <a
              href="#lap-la-so"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all"
            >
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>{primaryCtaLabel}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </a>
            <a
              href={homePage.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-semibold text-sm sm:text-base border border-amber-500/30 transition-all"
            >
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>{secondaryCtaLabel}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3-Branch 20-Page Funnel Directory */}
      <div className="bg-slate-900/65 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
              {dirBadge}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400 shrink-0" />
              {dirHeading}
            </h2>
          </div>
          <Link
            href="/bai-viet"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-all"
          >
            <BookOpen className="w-4 h-4" />
            {dirViewAll}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Nhánh 1 */}
          <div className="bg-slate-950/70 border border-amber-500/25 rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>{dirBranch1}</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {group1Pages.map((p) => (
                <li key={p.code}>
                  <Link
                    href={p.url}
                    className="text-slate-300 hover:text-amber-300 transition-colors flex items-start gap-1.5"
                  >
                    <span className="text-amber-400 font-bold">›</span>
                    <span>{translateFunnelPageTitle(p.url, p.h1, language)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nhánh 2 */}
          <div className="bg-slate-950/70 border border-emerald-500/25 rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>{dirBranch2}</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {group2Pages.map((p) => (
                <li key={p.code}>
                  <Link
                    href={p.url}
                    className="text-slate-300 hover:text-emerald-300 transition-colors flex items-start gap-1.5"
                  >
                    <span className="text-emerald-400 font-bold">›</span>
                    <span>{translateFunnelPageTitle(p.url, p.h1, language)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nhánh 3 */}
          <div className="bg-slate-950/70 border border-indigo-500/25 rounded-2xl p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
              <span>{dirBranch3}</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {group3Pages.map((p) => (
                <li key={p.code}>
                  <Link
                    href={p.url}
                    className="text-slate-300 hover:text-indigo-300 transition-colors flex items-start gap-1.5"
                  >
                    <span className="text-indigo-400 font-bold">›</span>
                    <span>{translateFunnelPageTitle(p.url, p.h1, language)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
