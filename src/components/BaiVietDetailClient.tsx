'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Compass,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  HelpCircle,
  BookOpen,
  Crown,
  Gem,
} from 'lucide-react';
import { getArticleBySlug, type SeoArticle } from '@/lib/seoArticles';
import { useLanguage } from '@/context/LanguageContext';
import {
  EXTERNAL_PAGE_UI,
  getLocalizedStageMeta,
  getLocalizedSeoArticle,
} from '@/lib/i18n/externalPagesI18n';
import GuideMenuDropdown from '@/components/GuideMenuDropdown';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeSelector from '@/components/ThemeSelector';
import { ArticleHeroIllustration } from '@/components/MetaphysicalIllustration';

export default function BaiVietDetailClient({ article: rawArticle }: { article: SeoArticle }) {
  const { language } = useLanguage();
  const ui = EXTERNAL_PAGE_UI[language];
  const article = getLocalizedSeoArticle(rawArticle, language);
  const stageMeta = getLocalizedStageMeta(rawArticle.funnelStage, language);

  const relatedArticles = rawArticle.relatedSlugs
    .map((s) => getArticleBySlug(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a))
    .map((a) => getLocalizedSeoArticle(a, language));

  return (
    <div className="max-w-[920px] mx-auto space-y-8">
      {/* Thanh Breadcrumb & CTA Nhanh */}
      <nav
        aria-label="Breadcrumb"
        className="relative z-40 flex items-center justify-between gap-3 flex-wrap bg-slate-900/80 border border-amber-500/25 rounded-2xl px-4 py-3 text-xs sm:text-sm"
      >
        <div className="flex items-center gap-2 text-slate-300 flex-wrap">
          <Link href="/" className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1">
            <Compass className="w-4 h-4" />
            <span>{ui.homeChart}</span>
          </Link>
          <span className="text-slate-600">/</span>
          <Link href="/bai-viet" className="hover:text-amber-300 transition">
            {ui.guideLibrary}
          </Link>
          <span className="text-slate-600 hidden sm:inline">/</span>
          <span className="text-slate-400 hidden sm:inline truncate max-w-[220px]">
            {article.shortTitle}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <LanguageSelector />
          <ThemeSelector />
          <GuideMenuDropdown />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{ui.freeChartZeroBtn}</span>
          </Link>
        </div>
      </nav>

      {/* Nội dung chính của bài viết */}
      <article className="rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 sm:p-10 space-y-8 shadow-2xl">
        {/* Header Bài viết */}
        <header className="space-y-4 border-b border-slate-800 pb-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-bold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{article.category}</span>
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                {article.readTime}
              </span>
              <span>•</span>
              <span>{ui.artUpdatedLabel} {article.updatedAt}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-amber-400 leading-tight">
            {article.title}
          </h1>

          {/* Thông tin tác giả E-E-A-T */}
          <div className="flex items-center justify-between gap-4 flex-wrap pt-2 text-xs sm:text-sm text-slate-300 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-base shrink-0">
                Tôn
              </div>
              <div>
                <div className="font-bold text-white">
                  {ui.artAuthorLabel}{' '}
                  <span className="text-amber-300">
                    {language === 'vi' ? 'Thầy Tôn (Trần Huy Tôn)' : 'Master Ton (Tran Huy Ton)'}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {ui.authorBioLine}
                </div>
              </div>
            </div>
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
              {ui.artVerifiedBadge} ({stageMeta.code})
            </span>
          </div>
        </header>

        {/* KHỐI GEO ANSWER-FIRST */}
        <section
          aria-label={ui.artGeoTitle}
          className="rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-950/90 to-emerald-500/10 border border-amber-500/40 p-5 sm:p-6 space-y-3"
        >
          <div className="inline-flex items-center gap-2 text-amber-300 font-serif font-bold text-sm sm:text-base">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{ui.artGeoTitle}</span>
          </div>

          <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
            {article.geoSummary}
          </p>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {ui.artKeyTakeawaysLabel}
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
              {article.keyTakeaways.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Ảnh Minh Họa & Sơ Đồ Chuyên Đề */}
        <ArticleHeroIllustration
          code={article.slug}
          title={article.shortTitle}
        />

        {/* Khối Nội dung chi tiết từng phần */}
        <div className="space-y-8">
          {article.sections.map((sec, idx) => (
            <React.Fragment key={sec.id}>
              <section id={sec.id} className="space-y-3.5">
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-300 leading-snug">
                  {sec.heading}
                </h2>
                <div
                  className="prose prose-invert max-w-none text-sm sm:text-base text-slate-200 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_strong]:text-amber-200"
                  dangerouslySetInnerHTML={{ __html: sec.contentHtml }}
                />
              </section>

              {/* Cầu nối Phễu Chuyển Đổi Giữa Bài (Mid-Article Funnel Bridge) sau phần 1 */}
              {idx === 0 && (
                <div className="my-6 rounded-2xl bg-slate-950/90 border border-emerald-500/35 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="space-y-1 text-center sm:text-left">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {ui.artMidBannerBadge}
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white">
                      {article.primaryCtaText}
                    </div>
                    <div className="text-xs text-slate-400">{article.primaryCtaSubtext}</div>
                  </div>
                  <Link
                    href="/"
                    className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{ui.freeChartZeroBtn}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Khối Câu Hỏi Thường Gặp (FAQ Schema) của riêng bài viết */}
        {article.faqs.length > 0 && (
          <section className="pt-6 border-t border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-lg sm:text-xl">
              <HelpCircle className="w-5 h-5" />
              <h2>{ui.artFaqTitle}</h2>
            </div>
            <div className="space-y-3">
              {article.faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-950/75 border border-slate-800 space-y-1.5"
                >
                  <h3 className="text-sm sm:text-base font-bold text-amber-300">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Khối Chốt Phễu Cuối Bài (Bottom Conversion Funnel Block) */}
        <section className="rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-950 to-purple-900/25 border border-amber-500/40 p-6 sm:p-8 space-y-5 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{ui.artBottomBadge}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
            {ui.artBottomTitle}
          </h2>

          <p
            className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed"
            dangerouslySetInnerHTML={{ __html: ui.artBottomDescHtml }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30">
              <span dangerouslySetInnerHTML={{ __html: ui.libTier1Html }} />
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30">
              <span dangerouslySetInnerHTML={{ __html: ui.libTier2Html }} />
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/30">
              <span dangerouslySetInnerHTML={{ __html: ui.libTier3Html }} />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{article.primaryCtaText}</span>
            </Link>
            <a
              href="https://zalo.me/0935058688"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-sm transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{ui.book1on1Short}</span>
            </a>
          </div>
        </section>
      </article>

      {/* Liên kết nội bộ sang các bài tiếp theo trong Phễu */}
      {relatedArticles.length > 0 && (
        <section className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-400">
              {ui.artNextArticlesTitle}
            </h2>
            <Link
              href="/bai-viet"
              className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
            >
              <span>{ui.artViewAll10}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedArticles.map((rel) => (
              <Link
                key={rel.slug}
                href={`/bai-viet/${rel.slug}`}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between space-y-2 group"
              >
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-amber-400">{rel.category}</span>
                  <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition leading-snug">
                    {rel.shortTitle}
                  </h3>
                </div>
                <span className="text-xs text-slate-400 group-hover:text-amber-300 inline-flex items-center gap-1 pt-1">
                  {ui.libReadMore} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="text-center">
        <Link
          href="/bai-viet"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{ui.artBackToLibrary}</span>
        </Link>
      </div>

      <footer className="pt-5 border-t border-slate-800/60 text-center text-[11px] text-slate-500 leading-relaxed max-w-3xl mx-auto">
        {ui.disclaimer}
      </footer>
    </div>
  );
}
