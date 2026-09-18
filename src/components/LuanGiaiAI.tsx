'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, AlertCircle } from 'lucide-react';

interface LuanGiaiAIProps {
  readingHtml?: string;
  isLoading: boolean;
  error?: string;
}

export default function LuanGiaiAI({ readingHtml, isLoading, error }: LuanGiaiAIProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!readingHtml) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = readingHtml;
    navigator.clipboard.writeText(tempDiv.innerText || tempDiv.textContent || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[1060px] mx-auto mt-10">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-red-600 flex items-center justify-center gap-2 font-serif">
          <span>🔮</span>
          <span>Bình Giải Chuyên Sâu Từ Thầy Tôn</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Kết hợp Tử Vi Cổ Truyền, Bát Bộ Thần Sát, Tướng Pháp &amp; Vận Khí Hiện Thời
        </p>
      </div>

      {isLoading && (
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center shadow-xl backdrop-blur-sm">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
            <Sparkles className="w-6 h-6 text-amber-400 absolute inset-0 m-auto animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-amber-400 tracking-wider uppercase font-serif">
            Thầy Đang Quán Tưởng...
          </h3>
          <p className="text-sm text-slate-400 mt-2 max-w-md">
            Hệ thống đang kết hợp xem Tử Vi, Diện tướng khuôn mặt và Thủ tướng chỉ tay.
            Vui lòng kiên nhẫn đợi trong giây lát!
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
          <div className="flex justify-end mb-4 print:hidden">
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

          <div
            className="prose max-w-none text-justify text-sm sm:text-base leading-relaxed space-y-4 font-sans"
            dangerouslySetInnerHTML={{ __html: readingHtml }}
          />
        </div>
      )}
    </div>
  );
}
