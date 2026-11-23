import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Compass, Sparkles, BookOpen, PhoneCall } from 'lucide-react';

export const metadata: Metadata = {
  title: {
    absolute: '404 — Không Tìm Thấy Trang | Tử Vi & Phong Thủy Thầy Tôn',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#070a14] text-slate-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full rounded-3xl bg-slate-900/80 border border-amber-500/35 p-8 sm:p-10 text-center shadow-2xl space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-400 mx-auto">
          <Compass className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Mã lỗi 404 • Lạc Cung Vị
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-white">
            Trang Bạn Tìm Không Tồn Tại
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Đường dẫn có thể đã thay đổi hoặc nhập chưa chính xác. Bạn có thể quay về trang chủ để lập lá số Tử Vi 108 sao miễn phí hoặc tham khảo thư viện chuyên đề của Thầy Tôn.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Lập Lá Số Miễn Phí</span>
          </Link>
          <Link
            href="/bai-viet"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-semibold text-sm transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Thư Viện Cẩm Nang</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400">
          Cần hỗ trợ? Nhắn Zalo{' '}
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
