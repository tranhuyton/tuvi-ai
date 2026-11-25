'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  MessageCircleHeart,
  ShieldCheck,
  ZoomIn,
  X,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface FeedbackSlide {
  id: string;
  image: string;
  badgeVi: string;
  badgeEn: string;
  captionVi: string;
  captionEn: string;
  sourceVi: string;
  sourceEn: string;
}

const FEEDBACK_SLIDES: FeedbackSlide[] = [
  {
    id: 'fb-1',
    image: '/images/feedback/fb-1.jpg',
    badgeVi: 'Bản Chuyên Sâu Pro',
    badgeEn: 'VIP Pro Reading',
    captionVi: '“Luận giải rất hay và khác biệt so với các chỗ tớ từng xem. Khi nào đủ duyên sẽ đặt lịch”',
    captionEn: '“Very insightful and completely different from other places I’ve tried. Will book 1-on-1 soon.”',
    sourceVi: 'Bình luận Facebook thực tế',
    sourceEn: 'Verified Facebook Comment',
  },
  {
    id: 'fb-2',
    image: '/images/feedback/fb-2.jpg',
    badgeVi: 'Sâu Sắc & Chi Tiết',
    badgeEn: 'Deep & Clear Analysis',
    captionVi: '“Đang nghe lại tử vi thầy Tôn, hay và rõ quá ấy! Thầy như nhìn bản đồ sao ngay trước mặt”',
    captionEn: '“Re-reading Master Ton’s analysis — so clear and deep, like looking straight at a star map!”',
    sourceVi: 'Bình luận Facebook thực tế',
    sourceEn: 'Verified Facebook Comment',
  },
  {
    id: 'fb-3',
    image: '/images/feedback/fb-3.jpg',
    badgeVi: 'Khách Lên Gói VIP',
    badgeEn: 'Upgraded to VIP',
    captionVi: '“Chị đã thử, lên hẳn gói VIP rồi, rất xứng đáng • Công nhận cách xem của anh Tôn rất riêng”',
    captionEn: '“Tried it and immediately upgraded to VIP, totally worth it • Master Ton’s approach is truly unique.”',
    sourceVi: '3 bình luận thực tế từ đương số',
    sourceEn: '3 Real Customer Comments',
  },
  {
    id: 'fb-4',
    image: '/images/feedback/fb-4.jpg',
    badgeVi: 'Khách Kiều Bào • Zalo',
    badgeEn: 'Overseas Client • Zalo',
    captionVi: 'Khách hỏi xem thêm cho con sinh ở nước ngoài (giờ địa phương & khí thổ) và giới thiệu bạn bè',
    captionEn: 'Overseas client inquiring for a child born abroad (local birth time & geography) & referring friends',
    sourceVi: 'Tin nhắn Zalo trực tiếp',
    sourceEn: 'Direct Zalo Conversation',
  },
  {
    id: 'fb-5',
    image: '/images/feedback/fb-5.jpg',
    badgeVi: 'Giới Thiệu Bạn Bè',
    badgeEn: 'Word-of-Mouth Referral',
    captionVi: '“Chị cũng vào xem và thấy thật bất ngờ đấy. Rất chuẩn” — Khách tự nhắn giới thiệu bạn bè',
    captionEn: '“I tried it myself and was genuinely surprised. Spot-on!” — Clients organically referring friends',
    sourceVi: 'Phản hồi & bình luận thực tế',
    sourceEn: 'Real Referral & Comment',
  },
  {
    id: 'fb-6',
    image: '/images/feedback/fb-6.jpg',
    badgeVi: 'Tổng Hợp Phản Hồi',
    badgeEn: 'Highlights Summary',
    captionVi: 'Tổng hợp nhận xét thực tế từ các đương số sau khi trải nghiệm hệ thống Tử Vi Thầy Tôn',
    captionEn: 'Summary of real customer impressions after experiencing Master Ton’s Zi Wei platform',
    sourceVi: 'Ảnh tổng hợp (đã ẩn danh)',
    sourceEn: 'Anonymized Summary Card',
  },
];

export default function RealFeedbackSlider() {
  const { language } = useLanguage();
  const isVi = language === 'vi';
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const scrollByCard = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = Math.min(el.clientWidth * 0.85, 360);
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  const scrollToSlide = (idx: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[idx] as HTMLElement | undefined;
    if (child) {
      el.scrollTo({ left: child.offsetLeft - 4, behavior: 'smooth' });
    }
    setActiveIdx(idx);
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollCenter = el.scrollLeft + el.clientWidth / 3;
    let closest = 0;
    let minDiff = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const node = child as HTMLElement;
      const diff = Math.abs(node.offsetLeft - scrollCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });
    setActiveIdx(closest);
  };

  useEffect(() => {
    if (lightboxIdx === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIdx(null);
      if (e.key === 'ArrowLeft') {
        setLightboxIdx((prev) =>
          prev === null ? null : (prev - 1 + FEEDBACK_SLIDES.length) % FEEDBACK_SLIDES.length
        );
      }
      if (e.key === 'ArrowRight') {
        setLightboxIdx((prev) => (prev === null ? null : (prev + 1) % FEEDBACK_SLIDES.length));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIdx]);

  return (
    <section
      id="phan-hoi-thuc-te"
      className="w-full max-w-[1060px] mx-auto scroll-mt-6 print:hidden"
    >
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl imperial-card border border-amber-500/35 p-5 sm:p-7 before:pointer-events-none before:absolute before:inset-x-12 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-amber-300/80 before:to-transparent">
        <div className="pointer-events-none absolute -top-24 -left-24 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-[11px] font-extrabold uppercase tracking-wider">
              <MessageCircleHeart className="w-3.5 h-3.5 shrink-0" />
              <span>
                {isVi ? 'Phản Hồi Thực Tế Từ Đương Số' : 'Real Customer Screenshots'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-serif text-gold-gradient leading-snug">
              {isVi
                ? 'Nhận Xét Nguyên Bản Sau Khi Trải Nghiệm Tử Vi Thầy Tôn'
                : 'Authentic Feedback From Clients Who Experienced Master Ton'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {isVi
                ? 'Ảnh chụp bình luận Facebook & tin nhắn Zalo thực tế — giữ nguyên câu chữ tự nhiên của khách hàng, chỉ làm mờ tên và ảnh đại diện để tôn trọng quyền riêng tư.'
                : 'Original Facebook comments & Zalo chats from real clients — names and profile photos are blurred to protect privacy. Tap any slide to zoom in.'}
            </p>
          </div>

          {/* Desktop Prev / Next Controls */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-end">
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300/90 bg-slate-950/75 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{isVi ? 'Đã ẩn danh bảo mật' : 'Privacy Blurred'}</span>
            </span>
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label={isVi ? 'Xem slide trước' : 'Previous slide'}
              className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-400/50 text-slate-200 hover:text-amber-300 flex items-center justify-center transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label={isVi ? 'Xem slide tiếp theo' : 'Next slide'}
              className="w-9 h-9 rounded-xl bg-slate-900/90 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-400/50 text-slate-200 hover:text-amber-300 flex items-center justify-center transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Swipeable Slider */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="relative z-10 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 -mx-1 px-1 [scrollbar-width:thin] [scrollbar-color:rgba(245,158,11,0.35)_transparent]"
        >
          {FEEDBACK_SLIDES.map((slide, idx) => (
            <article
              key={slide.id}
              className="snap-start shrink-0 w-[82vw] max-w-[320px] sm:w-[310px] md:w-[320px] rounded-2xl bg-slate-950/85 border border-slate-800 hover:border-amber-400/55 transition-all duration-200 overflow-hidden flex flex-col shadow-xl group"
            >
              {/* Card Top Badge */}
              <div className="px-3.5 py-2.5 border-b border-slate-800/90 flex items-center justify-between gap-2 bg-slate-900/70">
                <span className="text-[11px] font-bold text-amber-300 bg-amber-500/15 border border-amber-400/35 px-2.5 py-0.5 rounded-full truncate">
                  {isVi ? slide.badgeVi : slide.badgeEn}
                </span>
                <span className="text-[10.5px] text-slate-400 truncate">
                  {isVi ? slide.sourceVi : slide.sourceEn}
                </span>
              </div>

              {/* Screenshot Preview (Click to Zoom Lightbox) */}
              <button
                type="button"
                onClick={() => setLightboxIdx(idx)}
                className="relative w-full aspect-[4/5] bg-slate-900/95 overflow-hidden flex items-center justify-center p-2.5 cursor-zoom-in focus:outline-none"
                aria-label={isVi ? `Phóng to ảnh phản hồi ${idx + 1}` : `Zoom feedback ${idx + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={isVi ? slide.captionVi : slide.captionEn}
                  loading="lazy"
                  decoding="async"
                  className="max-w-full max-h-full w-auto h-auto object-contain rounded-xl shadow-lg transition duration-300 group-hover:scale-[1.02]"
                />
                <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/85 border border-amber-400/50 text-amber-200 text-[11px] font-bold shadow-md backdrop-blur-sm opacity-90 group-hover:opacity-100 transition">
                  <ZoomIn className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Phóng to' : 'Zoom'}</span>
                </span>
              </button>

              {/* Short Authentic Highlight Quote */}
              <div className="px-3.5 py-3 border-t border-slate-800/80 bg-slate-950/95 flex-1 flex items-center">
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {isVi ? slide.captionVi : slide.captionEn}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Dot Indicators & Hint */}
        <div className="relative z-10 mt-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            {FEEDBACK_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activeIdx === idx
                    ? 'w-7 bg-amber-400'
                    : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] text-slate-400">
            {isVi
              ? 'Vuốt ngang để xem thêm • Bấm vào ảnh để phóng to đọc chi tiết'
              : 'Swipe to browse • Tap any screenshot to read full size'}
          </span>
        </div>
      </div>

      {/* Lightbox Modal Phóng To Ảnh */}
      {lightboxIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isVi ? 'Xem ảnh phản hồi phóng to' : 'Feedback screenshot preview'}
          onClick={() => setLightboxIdx(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl max-h-[92vh] rounded-2xl bg-slate-950 border border-amber-500/45 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/90">
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-amber-300 truncate">
                  {isVi
                    ? FEEDBACK_SLIDES[lightboxIdx].badgeVi
                    : FEEDBACK_SLIDES[lightboxIdx].badgeEn}{' '}
                  <span className="text-slate-400 font-normal">
                    ({lightboxIdx + 1}/{FEEDBACK_SLIDES.length})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">
                  {isVi
                    ? FEEDBACK_SLIDES[lightboxIdx].sourceVi
                    : FEEDBACK_SLIDES[lightboxIdx].sourceEn}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setLightboxIdx(null)}
                aria-label="Đóng"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-3 sm:p-5">
              <button
                type="button"
                onClick={() =>
                  setLightboxIdx(
                    (lightboxIdx - 1 + FEEDBACK_SLIDES.length) % FEEDBACK_SLIDES.length
                  )
                }
                aria-label="Ảnh trước"
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700 flex items-center justify-center shadow-lg transition cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={FEEDBACK_SLIDES[lightboxIdx].image}
                alt={
                  isVi
                    ? FEEDBACK_SLIDES[lightboxIdx].captionVi
                    : FEEDBACK_SLIDES[lightboxIdx].captionEn
                }
                className="max-h-[72vh] max-w-full w-auto h-auto object-contain rounded-xl shadow-2xl"
              />

              <button
                type="button"
                onClick={() => setLightboxIdx((lightboxIdx + 1) % FEEDBACK_SLIDES.length)}
                aria-label="Ảnh tiếp theo"
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-900/90 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-700 flex items-center justify-center shadow-lg transition cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="px-4 py-3 border-t border-slate-800 bg-slate-900/80 text-center text-xs sm:text-sm text-slate-200">
              {isVi
                ? FEEDBACK_SLIDES[lightboxIdx].captionVi
                : FEEDBACK_SLIDES[lightboxIdx].captionEn}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
