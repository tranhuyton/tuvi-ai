'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, X, Sparkles, Clock, CheckCircle2, Volume2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { trackMetaCustomEvent } from '@/lib/metaPixel';
import { trackGa4Event } from '@/lib/googleAnalytics';

export const GUIDE_VIDEO_URL =
  'https://ubkvzgwespfvrlpjuxkp.supabase.co/storage/v1/object/public/tuvi-media/tuvi-guide-16x9.mp4';
export const GUIDE_VIDEO_POSTER = '/video-guide-poster.jpg';

function trackWatchGuideVideo(placement: string) {
  trackMetaCustomEvent('WatchGuideVideo', {
    placement,
    duration_sec: 55,
    content_name: 'Huong Dan Lap La So Tu Vi Thay Ton 55s',
  });
  trackGa4Event('watch_guide_video', {
    placement,
    duration_sec: 55,
  });
}

export function VideoGuideModal({
  isOpen,
  onClose,
  source = 'form_header_btn',
}: {
  isOpen: boolean;
  onClose: () => void;
  source?: string;
}) {
  const { language } = useLanguage();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      hasTrackedRef.current = false;
      return;
    }
    if (!hasTrackedRef.current) {
      hasTrackedRef.current = true;
      trackWatchGuideVideo(source);
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose, source]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={language === 'vi' ? 'Video hướng dẫn lập lá số Tử Vi 55 giây' : '55s Quick Guide Video'}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl rounded-2xl sm:rounded-3xl bg-slate-950 border border-amber-500/45 shadow-2xl overflow-hidden text-slate-100"
      >
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-950">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/45 text-amber-300 shrink-0">
              <Play className="w-3.5 h-3.5 fill-amber-300 ml-0.5" />
            </span>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold font-serif text-amber-300 truncate">
                {language === 'vi'
                  ? 'Hướng Dẫn Lập Lá Số & Xem Bình Giải Chỉ Trong 55 Giây'
                  : 'How to Generate Your Zi Wei Chart & Reading in 55 Seconds'}
              </h3>
              <p className="text-[11px] text-slate-400 truncate">
                {language === 'vi'
                  ? 'An sao 108 tinh đẩu 0đ • Soi Mặt & Chỉ tay • Xuất PDF trọn đời'
                  : 'Free 108-Star Chart • Face & Palm Insights • Lifetime PDF Export'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng video"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative w-full aspect-video bg-black">
          <video
            src={GUIDE_VIDEO_URL}
            poster={GUIDE_VIDEO_POSTER}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="w-full h-full object-contain"
          />
        </div>

        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-t border-slate-800/90 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Volume2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {language === 'vi'
                ? 'Bật âm thanh để nghe hướng dẫn đầy đủ 3 bước sử dụng hệ thống.'
                : 'Turn on audio to hear the full 3-step walkthrough.'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              const formEl = document.getElementById('lap-la-so');
              if (formEl) formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Bắt Đầu Lập Lá Số Ngay →' : 'Start Free Chart Now →'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VideoGuideSection({
  placement = 'home',
}: {
  placement?: 'home' | 'van-han';
}) {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
    trackWatchGuideVideo(`inline_${placement}`);
  };

  return (
    <section
      id="huong-dan-video"
      className="w-full max-w-[1060px] mx-auto relative overflow-hidden rounded-3xl imperial-card p-5 sm:p-7 border border-amber-500/35 text-slate-100 print:hidden"
    >
      <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
              <Play className="w-3 h-3 fill-amber-300" />
              <span>
                {language === 'vi' ? 'Video Hướng Dẫn Nhanh • 55 Giây' : '55-Second Quick Walkthrough'}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-extrabold font-serif text-gold-gradient leading-snug">
              {language === 'vi'
                ? 'Xem Trước 3 Bước Lập Lá Số, Soi Tướng Pháp & Mở Khóa Bình Giải'
                : 'Preview the 3 Steps to Generate Your Chart, Face/Palm Analysis & Reading'}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-wrap text-[11px] font-semibold">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Bản 0đ miễn phí' : 'Free 0 VND Tier'}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200">
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? '55 giây trực quan' : '55s Visual Demo'}</span>
            </span>
          </div>
        </div>

        {/* 16:9 Facade Player (0 bytes video loaded until user clicks Play!) */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-amber-500/40 bg-slate-950 shadow-2xl">
          {isPlaying ? (
            <video
              src={GUIDE_VIDEO_URL}
              poster={GUIDE_VIDEO_POSTER}
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="w-full h-full object-contain bg-black"
            />
          ) : (
            <button
              type="button"
              onClick={handlePlay}
              aria-label={
                language === 'vi'
                  ? 'Phát video hướng dẫn xem Tử Vi Thầy Tôn trong 55 giây'
                  : 'Play 55-second guide video'
              }
              className="group relative w-full h-full block cursor-pointer focus:outline-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={GUIDE_VIDEO_POSTER}
                alt="Video hướng dẫn lập lá số Tử Vi 108 sao và bình giải cùng Thầy Tôn chỉ trong 55 giây"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.02] brightness-95 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent transition group-hover:from-slate-950/55" />

              {/* Center Glowing Play Button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5">
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-amber-400/25 animate-ping" />
                  <span className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 text-slate-950 flex items-center justify-center shadow-2xl shadow-amber-500/50 ring-4 ring-amber-200/40 transition transform group-hover:scale-110">
                    <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-slate-950 ml-1" />
                  </span>
                </div>
                <span className="px-3.5 py-1 rounded-full bg-slate-950/85 border border-amber-400/55 text-amber-200 text-xs sm:text-sm font-bold shadow-lg backdrop-blur-sm">
                  {language === 'vi' ? 'Bấm để xem hướng dẫn (0:55)' : 'Click to Watch Walkthrough (0:55)'}
                </span>
              </div>

              {/* Duration Corner Pill */}
              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-slate-700/80 text-slate-100 font-mono text-xs font-bold">
                0:55
              </span>
            </button>
          )}
        </div>

        {/* 3 Step Summary Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div>
              <div className="font-bold text-slate-100">
                {language === 'vi' ? 'Nhập ngày giờ sinh (30s)' : 'Enter Birth Details (30s)'}
              </div>
              <p className="text-slate-400 mt-0.5">
                {language === 'vi'
                  ? 'Tự quy đổi Dương – Âm lịch & an chuẩn 108 sao trên bàn cờ 12 cung.'
                  : 'Auto Solar/Lunar conversion & full 108-star 12-palace chart.'}
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div>
              <div className="font-bold text-slate-100">
                {language === 'vi' ? 'Soi Diện Tướng & Chỉ Tay' : 'Face & Palm Verification'}
              </div>
              <p className="text-slate-400 mt-0.5">
                {language === 'vi'
                  ? 'Trải nghiệm bản 0đ ngay hoặc nâng cấp Pro/Expert tự động qua VietQR 24/7.'
                  : 'Read the 0 VND summary or unlock Pro/Expert automatically 24/7.'}
              </p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div>
              <div className="font-bold text-slate-100">
                {language === 'vi' ? 'Hỏi đáp, Lưu Sổ & Xuất PDF' : 'Q&A, Save & Export PDF'}
              </div>
              <p className="text-slate-400 mt-0.5">
                {language === 'vi'
                  ? 'Đàm đạo riêng với Thầy Tôn, tải PDF sắc nét & giữ đặc quyền trừ 269k xem 1-1.'
                  : 'Ask follow-up questions, download PDF & keep full 269k credit for 1-on-1.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
