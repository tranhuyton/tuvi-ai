'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Headphones,
  CheckCircle2,
  QrCode,
  Play,
  Compass,
  BookOpen,
  ShieldCheck,
  Unlock,
  ArrowRight,
} from 'lucide-react';
import { COURSE_INFO, COURSE_MODULES } from '@/lib/courseData';
import { useAuth } from '@/context/AuthContext';

export default function CoursePromoBanner() {
  const { user, profile, testerInfo } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dọn cờ VIP-ADMIN cũ từng lưu nhầm trong localStorage của trình duyệt
    try {
      if (localStorage.getItem('tuvi_course_order_code') === 'VIP-ADMIN') {
        localStorage.removeItem('tuvi_course_order_code');
        localStorage.removeItem('tuvi_course_unlocked');
      }
    } catch {
      // ignore
    }

    // Chưa đăng nhập: luôn hiển thị bảng giá 699.000đ & nút mua / học thử trên trang chủ
    if (!user) {
      setIsUnlocked(false);
      setCompletedCount(0);
      return;
    }

    try {
      const savedCompleted = localStorage.getItem('tuvi_course_completed');
      if (savedCompleted) {
        const parsed = JSON.parse(savedCompleted);
        if (Array.isArray(parsed)) setCompletedCount(parsed.length);
      }
    } catch {
      // ignore
    }

    const emailLower = (user.email || profile?.email || '').toLowerCase();
    const isEmailAdmin =
      emailLower.includes('tranhuyton') ||
      emailLower.includes('tonhuytran') ||
      emailLower.includes('thayton') ||
      emailLower === 'diep.anh.12135@gmail.com';

    if (isEmailAdmin || testerInfo?.isTester) {
      setIsUnlocked(true);
      return;
    }

    let cancelled = false;
    fetch('/api/course/check-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        email: emailLower || undefined,
      }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) return;
        setIsUnlocked(Boolean(data?.unlocked));
      })
      .catch(() => {
        if (!cancelled) setIsUnlocked(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user, profile?.email, testerInfo?.isTester]);

  return (
    <section
      id="khoa-hoc-tu-vi"
      aria-label="Khóa Học Tử Vi Đẩu Số Thực Chiến Cùng Thầy Tôn"
      className="w-full max-w-[1060px] mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#0e152b] to-amber-950/35 p-5 sm:p-8 border border-amber-500/45 text-slate-100 print:hidden shadow-2xl shadow-amber-950/25"
    >
      {/* Ảnh nền nghệ thuật Học Viện Tinh Đẩu & Podcast */}
      <img
        src="/images/course-hero-podcast.png"
        alt="Khóa Học Tử Vi Đẩu Số Thực Chiến Cùng Thầy Tôn"
        className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/88 to-slate-950/80 pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* CỘT TRÁI (8 CỘT): GIỚI THIỆU KHÓA HỌC & 4 HỌC PHẦN */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Học Viện Tử Vi Thực Chiến Online</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/15 border border-purple-400/35 text-purple-200 text-xs font-semibold">
              <Headphones className="w-3.5 h-3.5 text-purple-300 shrink-0" />
              <span>24 Podcast Audio + Giáo Trình Tương Tác</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-semibold">
              <Play className="w-3 h-3 fill-emerald-300 shrink-0" />
              <span>Học thử miễn phí 2 bài đầu</span>
            </span>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-serif text-amber-300 leading-snug">
              <Link href="/khoa-hoc" className="hover:text-amber-200 transition-colors">
                {COURSE_INFO.title}
              </Link>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed">
              Tự tay đọc hiểu bản mệnh &amp; vận hạn của chính mình và người thân: Hệ thống hóa trọn bộ{' '}
              <strong className="text-amber-200">
                14 Chính Tinh, Lục Cát, Lục Sát, Tứ Hóa, 4 Đại Cách Cục &amp; Quy Trình 5 Bước Chấm Hạn Năm
              </strong>{' '}
              qua giọng giảng Podcast của Thầy Tôn, tích hợp công cụ{' '}
              <strong className="text-emerald-300">Soi Sao Tự Động khớp trực tiếp lên Lá Số cá nhân</strong>.
            </p>
          </div>

          {/* Khung Preview Hình ảnh + Thầy Tôn */}
          <Link
            href="/khoa-hoc"
            className="group block rounded-2xl overflow-hidden border border-amber-500/35 bg-slate-950/85 hover:border-amber-400/70 transition shadow-lg"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
              <div className="sm:col-span-5 relative h-36 sm:h-full min-h-[132px] overflow-hidden">
                <img
                  src="/images/course-hero-podcast.png"
                  alt="Podcast & Giáo Trình Tử Vi Đẩu Số Thầy Tôn"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-amber-500/95 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/40 group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 left-2.5 flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950/90 border border-amber-400/45 backdrop-blur-md">
                  <img
                    src="/avatar-thay-ton.jpg"
                    alt="Thầy Tôn"
                    className="w-6 h-6 rounded-full object-cover border border-amber-400"
                  />
                  <span className="text-[11px] font-bold text-amber-300">Thầy Tôn giảng dạy</span>
                </div>
              </div>

              <div className="sm:col-span-7 p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {COURSE_MODULES.map((mod) => (
                  <div
                    key={mod.id}
                    className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/90 group-hover:border-slate-700 transition"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Học phần {mod.id}
                    </div>
                    <div className="text-xs font-semibold text-slate-100 line-clamp-2 mt-0.5 leading-snug">
                      {mod.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Link>

          {/* 3 Điểm Khác Biệt Nhanh */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-amber-200 font-medium">
              <Headphones className="w-3.5 h-3.5 text-amber-400" />
              <span>8+ giờ Podcast chuẩn phòng thu</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-emerald-200 font-medium">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tự động tìm sao trên Lá Số của bạn</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-purple-200 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              <span>Flashcard 14 Chính Tinh &amp; Ghi chú riêng</span>
            </span>
          </div>
        </div>

        {/* CỘT PHẢI (4 CỘT): THẺ HỌC PHÍ & NÚT MUA / HỌC THỬ */}
        <div className="lg:col-span-4 bg-slate-950/90 border border-amber-500/45 rounded-2xl p-5 space-y-4 shadow-xl">
          {user && isUnlocked ? (
            <div className="space-y-3.5 text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <Unlock className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                  Bạn Đã Sở Hữu Khóa Học Này
                </div>
                <div className="text-lg font-bold text-white mt-0.5">
                  Trọn Bộ 24 Bài Giảng Thực Chiến
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Tiến độ hiện tại: <strong className="text-amber-300">{completedCount}/24 bài học</strong>
                </p>
              </div>
              <Link
                href="/khoa-hoc"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition"
              >
                <Headphones className="w-4 h-4 shrink-0" />
                <span>Vào Lớp Học Tiếp Ngay</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-baseline justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs text-slate-400 block">Học phí trọn gói (1 lần):</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                    699.000đ
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 line-through block">1.490.000đ</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/35">
                    Ưu đãi -53%
                  </span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Mở khóa ngay toàn bộ <strong>24 bài Podcast &amp; Giáo trình chuyên sâu</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Đối chiếu trực tiếp từng sao lên <strong>Lá số của chính bạn</strong>
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Sở hữu <strong>trọn đời</strong> trên cả Điện thoại &amp; Máy tính
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Thanh toán VietQR tự động kích hoạt 24/7 trong 5 giây</span>
                </li>
              </ul>

              <div className="space-y-2.5 pt-1">
                <Link
                  href="/khoa-hoc?buy=1"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                >
                  <QrCode className="w-4 h-4 shrink-0" />
                  <span>Đăng Ký &amp; Mở Khóa Ngay (699.000đ)</span>
                </Link>

                <Link
                  href="/khoa-hoc"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/35 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-300 shrink-0" />
                  <span>Nghe Thử Miễn Phí 2 Bài Đầu &amp; Xem Giáo Trình</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
