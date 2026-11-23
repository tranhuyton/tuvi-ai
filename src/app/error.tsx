'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home, PhoneCall } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[App Error Boundary]', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#070a14] text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full rounded-3xl bg-slate-900/85 border border-rose-500/35 p-8 sm:p-10 text-center shadow-2xl space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-400 mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-rose-400">
            Sự Cố Tạm Thời
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Hệ Thống Gặp Trục Trặc Nhỏ
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Rất xin lỗi quý khách vì sự bất tiện này. Dữ liệu lá số và đơn hàng của bạn vẫn hoàn toàn an toàn — vui lòng tải lại trang hoặc quay về trang chủ.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Thử Tải Lại</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-semibold text-sm transition"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          Nếu lỗi lặp lại, vui lòng nhắn Zalo{' '}
          <a
            href="https://zalo.me/0935058688"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-semibold"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            0935 058 688
          </a>
        </div>
      </div>
    </main>
  );
}
