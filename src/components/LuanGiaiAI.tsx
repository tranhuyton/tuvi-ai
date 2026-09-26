'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, AlertCircle, Crown } from 'lucide-react';
import { ServiceTier } from '@/types/tuvi';
import { useLanguage } from '@/context/LanguageContext';

interface LuanGiaiAIProps {
  readingHtml?: string;
  isLoading: boolean;
  error?: string;
  tier?: ServiceTier;
  onUpgrade?: () => void;
  isUpgrading?: boolean;
}

export default function LuanGiaiAI({
  readingHtml,
  isLoading,
  error,
  tier = 'free',
  onUpgrade,
  isUpgrading,
}: LuanGiaiAIProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!readingHtml) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = readingHtml;
    navigator.clipboard.writeText(tempDiv.innerText || tempDiv.textContent || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPro = tier === 'pro';

  return (
    <div className="w-full max-w-[1060px] mx-auto mt-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-wider text-red-600 flex items-center justify-center gap-2 font-serif">
          {isPro ? (
            <>
              <Crown className="w-6 h-6 text-amber-500 inline" />
              <span>{t('reading.proTitle', 'Bình Giải Chuyên Sâu Từ Thầy Tôn (Bản Pro)')}</span>
            </>
          ) : (
            <>
              <span>🔮</span>
              <span>{t('reading.freeTitle', 'Bình Giải Tử Vi Thầy Tôn (Bản Cơ Bản)')}</span>
            </>
          )}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
          <span
            className={`text-xs sm:text-sm px-3 py-1 rounded-full font-semibold border ${
              isPro
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isPro
              ? t('reading.proBadge', '👑 Bản Chuyên Sâu Bí Truyền')
              : t('reading.freeBadge', '📜 Bản Luận Giải Khởi Nguyên')}
          </span>
          <p className="text-sm sm:text-base text-slate-300">
            {isPro
              ? t('reading.proSubtitle', 'Toàn diện Tử Vi Cổ Truyền, Tứ Hóa, Tướng Pháp & Hóa Giải 4 Mùa')
              : t('reading.freeSubtitle', 'Tổng quan Mệnh Cục, Tam Hợp Mệnh-Tài-Quan, Đại Vận & Tiểu Vận')}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-8 sm:p-10 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-sm">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-amber-400 tracking-wider uppercase font-serif">
            {isUpgrading
              ? t('reading.loadingUpgrading', 'Thầy Đang Nâng Cấp Luận Giải Pro...')
              : t('reading.loadingNormal', 'Thầy Đang Quán Tưởng...')}
          </h3>
          <p className="text-base text-slate-300 mt-2 max-w-lg leading-relaxed">
            {isPro || isUpgrading
              ? t(
                  'reading.loadingProDesc',
                  'Thầy Tôn đang định tâm quán tưởng thâm sâu, soi rọi 14 Chính tinh, đối chiếu Tướng pháp và luận giải vận khí 4 mùa. Quý khách vui lòng tịnh tâm đợi trong giây lát!'
                )
              : t(
                  'reading.loadingFreeDesc',
                  'Thầy Tôn đang định tâm chắt lọc huyền cơ lá số tử vi và bản mệnh. Quý khách vui lòng kiên nhẫn đợi trong giây lát!'
                )}
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-950/70 border border-red-500/40 rounded-xl p-5 text-red-200 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-300 text-base">{t('reading.errorTitle', 'Thông báo từ Thầy Tôn:')}</h4>
            <p className="text-base sm:text-sm mt-1 whitespace-pre-wrap leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {readingHtml && !isLoading && (
        <div className="relative bg-white text-slate-800 rounded-2xl p-5 sm:p-10 shadow-2xl border border-slate-300 print:shadow-none print:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 print:hidden border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs sm:text-sm px-3 py-1 rounded-md font-bold ${
                  isPro
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                {isPro ? t('form.proTitle', 'Bản Chuyên Sâu Pro') : t('form.freeTitle', '📜 Bản Miễn Phí')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isPro && onUpgrade && (
                <button
                  type="button"
                  onClick={onUpgrade}
                  disabled={isUpgrading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg text-sm sm:text-xs font-bold shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50"
                  title="Nâng cấp xem luận giải chuyên sâu chi tiết gấp 2 lần"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>{t('reading.topUpgradeBtn', '⚡ Nâng Cấp Bản Pro')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm sm:text-xs font-semibold transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{t('reading.copied', 'Đã sao chép')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>{t('reading.copyBtn', 'Sao chép lời bình')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            className="prose max-w-none text-justify text-base sm:text-lg leading-relaxed sm:leading-loose space-y-4 font-sans"
            dangerouslySetInnerHTML={{ __html: readingHtml }}
          />

          {!isPro && onUpgrade && (
            <div className="mt-8 pt-6 border-t border-slate-200 bg-amber-50/70 p-4 sm:p-5 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div>
                <h4 className="font-bold text-amber-900 text-base sm:text-lg font-serif flex items-center gap-1.5">
                  <Crown className="w-5 h-5 text-amber-600" />
                  {t('reading.upgradePromptTitle', 'Bạn muốn tìm hiểu sâu sắc hơn về lá số này?')}
                </h4>
                <p className="text-sm sm:text-sm text-slate-700 mt-1 max-w-xl leading-relaxed">
                  {t(
                    'reading.upgradePromptDesc',
                    'Bản Chuyên Sâu mở ra đại pháp bí truyền luận giải chi tiết gấp 2 lần, soi chiếu toàn diện Diện tướng/Chỉ tay, biến chuyển 4 mùa hạn vận và giải pháp hóa giải hung sát tinh.'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={onUpgrade}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-sm sm:text-base shadow-md transition whitespace-nowrap cursor-pointer"
              >
                {t('reading.upgradeBtn', 'Nâng Cấp Bản Pro (119.000đ)')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
