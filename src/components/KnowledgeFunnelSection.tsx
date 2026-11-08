'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, ArrowRight, Sparkles, Clock } from 'lucide-react';
import { SEO_ARTICLES, FunnelStage } from '@/lib/seoArticles';
import { useLanguage } from '@/context/LanguageContext';
import {
  EXTERNAL_PAGE_UI,
  getLocalizedStageMeta,
  getLocalizedSeoArticle,
} from '@/lib/i18n/externalPagesI18n';

const STAGES: FunnelStage[] = ['TOFU', 'MOFU', 'USP_GEO', 'BOFU'];

export default function KnowledgeFunnelSection() {
  const { language } = useLanguage();
  const ui = EXTERNAL_PAGE_UI[language];

  return (
    <section
      id="cam-nang-tu-vi"
      className="w-full max-w-[1060px] mx-auto mt-10 sm:mt-14 scroll-mt-6"
    >
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-slate-900/85 border border-amber-500/30 p-6 sm:p-10 shadow-2xl shadow-amber-950/20 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{ui.kfBadge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-400">
              {ui.kfTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {ui.kfDesc}
            </p>
          </div>

          <Link
            href="/bai-viet"
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs sm:text-sm font-bold transition"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{ui.kfViewAllBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 4 Nhóm bài viết theo 4 Tầng Phễu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {STAGES.map((stageKey) => {
            const meta = getLocalizedStageMeta(stageKey, language);
            const articles = SEO_ARTICLES.filter((a) => a.funnelStage === stageKey);

            const badgeColor =
              meta.color === 'emerald'
                ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/35'
                : meta.color === 'amber'
                ? 'text-amber-300 bg-amber-500/15 border-amber-500/35'
                : meta.color === 'purple'
                ? 'text-purple-200 bg-purple-500/15 border-purple-500/35'
                : 'text-blue-300 bg-blue-500/15 border-blue-500/35';

            return (
              <div
                key={stageKey}
                className="rounded-2xl bg-slate-950/75 border border-slate-800/90 p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${badgeColor}`}>
                    {meta.shortLabel}
                  </span>

                  <div className="space-y-2.5 pt-1">
                    {articles.map((rawArt) => {
                      const art = getLocalizedSeoArticle(rawArt, language);
                      return (
                        <Link
                          key={art.slug}
                          href={`/bai-viet/${art.slug}`}
                          className="block p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 transition group"
                        >
                          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mb-1">
                            <span className="text-amber-400 font-semibold">{art.category}</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {art.readTime}
                            </span>
                          </div>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-amber-300 transition leading-snug">
                            {art.title}
                          </h3>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
