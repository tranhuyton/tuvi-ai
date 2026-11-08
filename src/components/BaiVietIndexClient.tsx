'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Compass,
  Crown,
  Gem,
  PhoneCall,
  CheckCircle2,
  Layers,
  Clock,
} from 'lucide-react';
import { SEO_ARTICLES, FunnelStage } from '@/lib/seoArticles';
import { FUNNEL_PAGES } from '@/lib/funnelPages';
import { useLanguage } from '@/context/LanguageContext';
import {
  EXTERNAL_PAGE_UI,
  getLocalizedFunnelGroups,
  getLocalizedFunnelPage,
  getLocalizedStageMeta,
  getLocalizedSeoArticle,
} from '@/lib/i18n/externalPagesI18n';
import GuideMenuDropdown from '@/components/GuideMenuDropdown';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeSelector from '@/components/ThemeSelector';
import { ArticleCardThumbnail } from '@/components/MetaphysicalIllustration';

const STAGES_ORDER: FunnelStage[] = ['TOFU', 'MOFU', 'USP_GEO', 'BOFU'];

export default function BaiVietIndexClient() {
  const { language } = useLanguage();
  const ui = EXTERNAL_PAGE_UI[language];
  const funnelGroups = getLocalizedFunnelGroups(language);

  return (
    <div className="max-w-[1080px] mx-auto space-y-10">
      {/* Thanh điều hướng quay lại Trang chủ An Sao */}
      <div className="relative z-40 flex items-center justify-between gap-4 flex-wrap bg-slate-900/80 border border-amber-500/25 rounded-2xl px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-serif font-bold text-base sm:text-lg transition"
        >
          <Compass className="w-5 h-5" />
          <span>{ui.brandName}</span>
        </Link>

        <div className="flex items-center gap-2.5 flex-wrap">
          <LanguageSelector />
          <ThemeSelector />
          <GuideMenuDropdown />
          <Link
            href="/#lap-la-so"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{ui.freeChartZeroBtn}</span>
          </Link>
          <a
            href="https://zalo.me/0935058688"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>{ui.book1on1Short}</span>
          </a>
        </div>
      </div>

      {/* Hero Header */}
      <header className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-amber-500/35 p-6 sm:p-10 text-center space-y-4 shadow-2xl">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>{ui.libHeroBadge.replace('{count}', String(FUNNEL_PAGES.length))}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold font-serif text-amber-400 tracking-wide leading-tight">
          {ui.libHeroTitle}
        </h1>

        <p
          className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed"
          dangerouslySetInnerHTML={{ __html: ui.libHeroDescHtml }}
        />

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/#lap-la-so"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>{ui.libHeroCta}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* 38 Chuyên Đề Trọng Tâm Theo 3 Nhánh Phễu */}
      <div className="space-y-10">
        {funnelGroups.map((grp) => {
          const pages = FUNNEL_PAGES.filter((p) => p.groupNum === grp.groupNum);
          const borderCls =
            grp.color === 'amber'
              ? 'border-amber-500/35'
              : grp.color === 'emerald'
              ? 'border-emerald-500/35'
              : 'border-indigo-500/35';
          const badgeCls =
            grp.color === 'amber'
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/35'
              : grp.color === 'emerald'
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
              : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35';

          return (
            <section
              key={grp.groupNum}
              className={`rounded-3xl bg-slate-900/75 border ${borderCls} p-6 sm:p-8 space-y-6 shadow-xl`}
            >
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeCls}`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>{grp.badge}</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    {ui.libPagesCount.replace('{count}', String(pages.length))}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                  {grp.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {grp.desc}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {pages.map((rawP) => {
                  const p = getLocalizedFunnelPage(rawP, language);
                  return (
                    <article
                      key={p.code}
                      className="rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 p-5 flex flex-col justify-between space-y-4 transition group"
                    >
                      <div className="space-y-2.5">
                        <Link href={p.url} className="block">
                          <ArticleCardThumbnail
                            code={p.code}
                            title={p.h1}
                            groupNum={p.groupNum}
                          />
                        </Link>
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                          <span className="font-semibold text-amber-400">
                            {p.groupNum === 1
                              ? ui.libCat1
                              : p.groupNum === 2
                              ? ui.libCat2
                              : ui.libCat3}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {p.url}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold font-serif text-slate-100 group-hover:text-amber-300 transition leading-snug">
                          <Link href={p.url}>{p.h1}</Link>
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                          {p.quickSummaryText}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                        <Link
                          href={p.url}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition"
                        >
                          <span>{ui.libViewDetail}</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Chuyên khảo mở rộng (Các bài viết chuyên sâu bổ trợ) */}
      <div className="space-y-10 pt-6 border-t border-slate-800">
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-300 text-center">
          {ui.libExtendedHeading}
        </h2>
        {STAGES_ORDER.map((stageKey) => {
          const stageMeta = getLocalizedStageMeta(stageKey, language);
          const stageArticles = SEO_ARTICLES.filter((a) => a.funnelStage === stageKey);

          return (
            <section
              key={stageKey}
              className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-6"
            >
              <div className="space-y-1 border-b border-slate-800 pb-3">
                <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                  {stageMeta.name}
                </h3>
                <p className="text-xs text-slate-400">{stageMeta.goal}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {stageArticles.map((rawArticle) => {
                  const article = getLocalizedSeoArticle(rawArticle, language);
                  return (
                    <article
                      key={article.slug}
                      className="rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 p-5 flex flex-col justify-between space-y-3 transition group"
                    >
                      <div className="space-y-2">
                        <Link href={`/bai-viet/${article.slug}`} className="block">
                          <ArticleCardThumbnail
                            code={article.slug}
                            title={article.shortTitle}
                          />
                        </Link>
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                          <span className="font-semibold text-amber-400">{article.category}</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime}
                          </span>
                        </div>
                        <h4 className="text-base font-bold font-serif text-slate-100 group-hover:text-amber-300 transition leading-snug">
                          <Link href={`/bai-viet/${article.slug}`}>{article.title}</Link>
                        </h4>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {article.geoSummary}
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link
                          href={`/bai-viet/${article.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
                        >
                          <span>{ui.libReadMore}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Khối Chốt Chuyển Đổi Cuối Trang (Bottom Funnel CTA) */}
      <section className="rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-purple-900/20 border border-amber-500/40 p-6 sm:p-10 text-center space-y-5 shadow-2xl">
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-400">
          {ui.libBottomTitle}
        </h2>
        <p
          className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed"
          dangerouslySetInnerHTML={{ __html: ui.libBottomDescHtml }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left text-xs sm:text-sm">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span dangerouslySetInnerHTML={{ __html: ui.libTier1Html }} />
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 flex items-start gap-2">
            <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span dangerouslySetInnerHTML={{ __html: ui.libTier2Html }} />
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/30 flex items-start gap-2">
            <Gem className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span dangerouslySetInnerHTML={{ __html: ui.libTier3Html }} />
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/#lap-la-so"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 transition"
          >
            <Sparkles className="w-5 h-5" />
            <span>{ui.freeChartBtn}</span>
          </Link>
          <a
            href="https://zalo.me/0935058688"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 font-bold text-sm sm:text-base transition"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{ui.libBookZaloBtn}</span>
          </a>
        </div>
      </section>

      <footer className="pt-5 border-t border-slate-800/60 text-center text-[11px] text-slate-500 leading-relaxed max-w-3xl mx-auto">
        {ui.disclaimer}
      </footer>
    </div>
  );
}
