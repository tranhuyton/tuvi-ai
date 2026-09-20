'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, AlertCircle, Crown, PhoneCall, MessageCircle } from 'lucide-react';
import { ServiceTier } from '@/types/tuvi';

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
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-red-600 flex items-center justify-center gap-2 font-serif">
          {isPro ? (
            <>
              <Crown className="w-6 h-6 text-amber-500 inline" />
              <span>Bình Giải Chuyên Sâu Từ Thầy Tôn (Bản Pro)</span>
            </>
          ) : (
            <>
              <span>🔮</span>
              <span>Bình Giải Tử Vi Thầy Tôn (Bản Cơ Bản)</span>
            </>
          )}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-1.5">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              isPro
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
          >
            {isPro ? '👑 Bản Chuyên Sâu Bí Truyền' : '📜 Bản Luận Giải Khởi Nguyên'}
          </span>
          <p className="text-xs sm:text-sm text-slate-400">
            {isPro
              ? 'Toàn diện Tử Vi Cổ Truyền, Tứ Hóa, Tướng Pháp & Hóa Giải 4 Mùa'
              : 'Tổng quan Mệnh Cục, Tam Hợp Mệnh-Tài-Quan, Đại Vận & Tiểu Vận'}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-sm">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-amber-400 tracking-wider uppercase font-serif">
            {isUpgrading ? 'Thầy Đang Nâng Cấp Luận Giải Pro...' : 'Thầy Đang Quán Tưởng...'}
          </h3>
          <p className="text-sm text-slate-400 mt-2 max-w-md">
            {isPro || isUpgrading
              ? 'Thầy Tôn đang định tâm quán tưởng thâm sâu, soi rọi 14 Chính tinh, đối chiếu Tướng pháp và luận giải vận khí 4 mùa. Quý khách vui lòng tịnh tâm đợi trong giây lát!'
              : 'Thầy Tôn đang định tâm chắt lọc huyền cơ lá số tử vi và bản mệnh. Quý khách vui lòng kiên nhẫn đợi trong giây lát!'}
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-950/70 border border-red-500/40 rounded-xl p-5 text-red-200 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-300">Thông báo từ Thầy Tôn:</h4>
            <p className="text-sm mt-1 whitespace-pre-wrap">{error}</p>
          </div>
        </div>
      )}

      {readingHtml && !isLoading && (
        <div className="relative bg-white text-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl border border-slate-300 print:shadow-none print:p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 print:hidden border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                  isPro
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}
              >
                {isPro ? '👑 Bản Chuyên Sâu Pro' : '📜 Bản Miễn Phí'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isPro && onUpgrade && (
                <button
                  type="button"
                  onClick={onUpgrade}
                  disabled={isUpgrading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg text-xs font-bold shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50"
                  title="Nâng cấp xem luận giải chuyên sâu chi tiết gấp 2 lần"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                  <span>⚡ Nâng Cấp Xem Luận Giải Chuyên Sâu (Bản Pro)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Sao chép lời bình</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            className="prose max-w-none text-justify text-sm sm:text-base leading-relaxed space-y-4 font-sans"
            dangerouslySetInnerHTML={{ __html: readingHtml }}
          />

          {!isPro && onUpgrade && (
            <div className="mt-8 pt-6 border-t border-slate-200 bg-amber-50/70 p-4 sm:p-5 rounded-xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div>
                <h4 className="font-bold text-amber-900 text-sm sm:text-base font-serif flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-600" />
                  Bạn muốn tìm hiểu sâu sắc hơn về lá số này?
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  Bản Chuyên Sâu mở ra đại pháp bí truyền luận giải chi tiết gấp 2 lần, soi chiếu toàn diện Diện tướng/Chỉ tay, biến chuyển 4 mùa hạn vận và giải pháp hóa giải hung sát tinh.
                </p>
              </div>
              <button
                type="button"
                onClick={onUpgrade}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition whitespace-nowrap"
              >
                Nâng Cấp Bản Pro (119.000đ)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
