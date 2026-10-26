'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Lock,
  Unlock,
  CheckCircle2,
  BookOpen,
  Headphones,
  Sparkles,
  Search,
  QrCode,
  ShieldCheck,
  Compass,
  Award,
  FileText,
  ChevronRight,
  KeyRound,
  Loader2,
  PhoneCall,
  UserCheck,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import {
  COURSE_INFO,
  COURSE_MODULES,
  COURSE_LESSONS,
  type CourseLesson,
} from '@/lib/courseData';
import PaymentModal from '@/components/PaymentModal';
import GuideMenuDropdown from '@/components/GuideMenuDropdown';
import {
  CourseVisualShowcase,
  CourseLessonIllustration,
} from '@/components/MetaphysicalIllustration';
import { useAuth } from '@/context/AuthContext';
import type { LaSoData } from '@/types/tuvi';

interface StarMatchOnChart {
  starName: string;
  cungName: string;
  diaChi: string;
  dacTinh?: string;
  coStars: string[];
}

export default function CoursePlayerClient() {
  const { user, profile, testerInfo } = useAuth();

  // Trạng thái mở khóa khóa học
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [unlockedCode, setUnlockedCode] = useState<string>('');
  const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);

  // Khôi phục bằng Mã đơn TVxxxxx hoặc Email
  const [showRestoreBox, setShowRestoreBox] = useState<boolean>(false);
  const [restoreInput, setRestoreInput] = useState<string>('');
  const [restoreLoading, setRestoreLoading] = useState<boolean>(false);
  const [restoreMessage, setRestoreMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Bài học đang chọn & Bộ lọc
  const [activeLessonId, setActiveLessonId] = useState<string>('bai-1');
  const [selectedModule, setSelectedModule] = useState<number>(0); // 0 = Tất cả
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');

  // Tiến độ học & Ghi chú cá nhân
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [lessonNotes, setLessonNotes] = useState<Record<string, string>>({});
  const [noteSavedToast, setNoteSavedToast] = useState<boolean>(false);

  // Lá số cá nhân của học viên (nếu đã lập trên trang chủ) để đối chiếu sao trực tiếp
  const [userLaSo, setUserLaSo] = useState<LaSoData | null>(null);
  const [userHoTen, setUserHoTen] = useState<string>('');

  // Trạng thái Podcast Player (Hỗ trợ cả file MP3 và giọng đọc Podcast từng chương)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [chapterProgress, setChapterProgress] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lessonTopRef = useRef<HTMLDivElement | null>(null);

  const activeLesson: CourseLesson = useMemo(() => {
    return COURSE_LESSONS.find((l) => l.id === activeLessonId) || COURSE_LESSONS[0];
  }, [activeLessonId]);

  const canAccessActiveLesson = isUnlocked || activeLesson.isFreePreview;

  // 1. Khởi tạo dữ liệu từ localStorage & kiểm tra quyền truy cập từ Server
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedCompleted = localStorage.getItem('tuvi_course_completed');
      if (savedCompleted) setCompletedLessons(JSON.parse(savedCompleted));

      const savedNotes = localStorage.getItem('tuvi_course_notes');
      if (savedNotes) setLessonNotes(JSON.parse(savedNotes));

      // Đọc lá số cá nhân đang lưu trong phiên làm việc để đối chiếu sao
      const sessionStr = localStorage.getItem('tuvi_active_session');
      if (sessionStr) {
        const parsed = JSON.parse(sessionStr);
        if (parsed?.laSo) {
          setUserLaSo(parsed.laSo);
          setUserHoTen(parsed?.duongSo?.hoTen || 'Bạn');
        }
      }

      const localUnlocked = localStorage.getItem('tuvi_course_unlocked') === 'true';
      const savedOrderCode = localStorage.getItem('tuvi_course_order_code') || '';
      if (localUnlocked) {
        setIsUnlocked(true);
        setUnlockedCode(savedOrderCode || 'ĐÃ KÍCH HOẠT');
      }
    } catch {
      // ignore
    }
  }, []);

  // Kiểm tra quyền truy cập tự động với API khi có user hoặc mã đơn lưu trong máy
  useEffect(() => {
    const verifyAccess = async () => {
      setIsCheckingAccess(true);
      try {
        if (testerInfo?.isTester) {
          setIsUnlocked(true);
          setUnlockedCode('VIP-TESTER');
          setIsCheckingAccess(false);
          return;
        }

        const savedOrderCode =
          typeof window !== 'undefined'
            ? localStorage.getItem('tuvi_course_order_code') ||
              localStorage.getItem('tuvi_last_paid_code') ||
              ''
            : '';
        const savedEmail =
          user?.email ||
          profile?.email ||
          (typeof window !== 'undefined' ? localStorage.getItem('tuvi_customer_email') || '' : '');

        if (!user?.id && !savedEmail && !savedOrderCode) {
          setIsCheckingAccess(false);
          return;
        }

        const res = await fetch('/api/course/check-access', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user?.id,
            email: savedEmail,
            orderCode: savedOrderCode,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.unlocked) {
            setIsUnlocked(true);
            setUnlockedCode(data.orderCode || 'ĐÃ KÍCH HOẠT');
            if (typeof window !== 'undefined') {
              localStorage.setItem('tuvi_course_unlocked', 'true');
              if (data.orderCode) localStorage.setItem('tuvi_course_order_code', data.orderCode);
            }
          }
        }
      } catch {
        // giữ nguyên trạng thái local
      } finally {
        setIsCheckingAccess(false);
      }
    };

    verifyAccess();
  }, [user?.id, user?.email, profile?.email, testerInfo?.isTester]);

  // 2. Đối chiếu các sao trong bài học hiện tại với Lá Số Cá Nhân của học viên
  const personalStarMatches: StarMatchOnChart[] = useMemo(() => {
    if (!userLaSo || !Array.isArray(userLaSo.cungs) || !activeLesson.relatedStars?.length) {
      return [];
    }

    const matches: StarMatchOnChart[] = [];
    for (const targetStar of activeLesson.relatedStars) {
      const normalizedTarget = targetStar.trim().toLowerCase();
      for (const cung of userLaSo.cungs) {
        const allStarsInCung = [
          ...(cung.chinhTinh || []),
          ...(cung.phuTinhTot || []),
          ...(cung.phuTinhXau || []),
        ];
        const found = allStarsInCung.find(
          (s) => s.ten.trim().toLowerCase() === normalizedTarget
        );
        if (found) {
          const coStars = (cung.chinhTinh || [])
            .map((s) => s.ten)
            .filter((n) => n.trim().toLowerCase() !== normalizedTarget);
          matches.push({
            starName: found.ten,
            cungName: cung.cungName,
            diaChi: cung.chi,
            dacTinh: found.dacHam,
            coStars,
          });
          break;
        }
      }
    }
    return matches;
  }, [userLaSo, activeLesson.relatedStars]);

  // 3. Quản lý Podcast Player (Web Speech Synthesis + Audio MP3)
  const stopPodcastPlayback = () => {
    setIsPlaying(false);
    setChapterProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  useEffect(() => {
    // Dừng phát khi đổi bài học
    stopPodcastPlayback();
    setActiveChapterIdx(0);
    return () => {
      stopPodcastPlayback();
    };
  }, [activeLessonId]);

  const speakChapter = (chapterIndex: number, rate: number) => {
    if (typeof window === 'undefined') return;
    const chapters = activeLesson.podcastChapters;
    if (!chapters || chapterIndex < 0 || chapterIndex >= chapters.length) {
      stopPodcastPlayback();
      return;
    }

    setActiveChapterIdx(chapterIndex);
    setChapterProgress(0);

    // Nếu bài học có file MP3 riêng được gán vào audioUrl thì ưu tiên phát MP3
    if (activeLesson.audioUrl && audioRef.current) {
      audioRef.current.playbackRate = rate;
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
      return;
    }

    // Phát bằng giọng đọc Podcast tiếng Việt tích hợp sẵn
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const chapter = chapters[chapterIndex];
      const utterance = new SpeechSynthesisUtterance(
        `${chapter.title}. ${chapter.transcript}`
      );
      utterance.lang = 'vi-VN';
      utterance.rate = rate;
      utterance.pitch = 0.98;

      const voices = window.speechSynthesis.getVoices();
      const viVoice = voices.find(
        (v) => v.lang.toLowerCase().includes('vi') || v.name.toLowerCase().includes('viet')
      );
      if (viVoice) utterance.voice = viVoice;

      // Ước lượng thời gian đọc để chạy thanh progress mượt mà
      const estimatedSeconds = Math.max(
        15,
        Math.round(chapter.transcript.split(/\s+/).length / (2.6 * rate))
      );
      let elapsed = 0;
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = setInterval(() => {
        elapsed += 0.5;
        setChapterProgress(Math.min(98, Math.round((elapsed / estimatedSeconds) * 100)));
      }, 500);

      utterance.onend = () => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setChapterProgress(100);
        if (chapterIndex + 1 < chapters.length) {
          setTimeout(() => {
            speakChapter(chapterIndex + 1, rate);
          }, 600);
        } else {
          setIsPlaying(false);
        }
      };

      utterance.onerror = () => {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setIsPlaying(false);
      };

      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleTogglePlay = () => {
    if (!canAccessActiveLesson) {
      setIsPaymentModalOpen(true);
      return;
    }
    if (isPlaying) {
      stopPodcastPlayback();
    } else {
      speakChapter(activeChapterIdx, playbackRate);
    }
  };

  const handleChangeSpeed = () => {
    const nextRate = playbackRate === 1.0 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1.0;
    setPlaybackRate(nextRate);
    if (isPlaying) {
      speakChapter(activeChapterIdx, nextRate);
    }
  };

  // 4. Đánh dấu hoàn thành bài học & Lưu ghi chú
  const toggleCompleteLesson = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('tuvi_course_completed', JSON.stringify(next));
      }
      return next;
    });
  };

  const handleSaveNote = (val: string) => {
    const updated = { ...lessonNotes, [activeLesson.id]: val };
    setLessonNotes(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('tuvi_course_notes', JSON.stringify(updated));
    }
  };

  // 5. Khôi phục khóa học bằng Mã đơn TVxxxxx hoặc Email
  const handleRestoreCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = restoreInput.trim();
    if (!cleaned) return;

    setRestoreLoading(true);
    setRestoreMessage(null);
    try {
      const isEmail = cleaned.includes('@');
      const res = await fetch('/api/course/check-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderCode: isEmail ? undefined : cleaned.toUpperCase(),
          email: isEmail ? cleaned.toLowerCase() : undefined,
          userId: user?.id,
        }),
      });
      const data = await res.json();
      if (data.unlocked) {
        setIsUnlocked(true);
        setUnlockedCode(data.orderCode || cleaned.toUpperCase());
        if (typeof window !== 'undefined') {
          localStorage.setItem('tuvi_course_unlocked', 'true');
          if (data.orderCode) localStorage.setItem('tuvi_course_order_code', data.orderCode);
        }
        setRestoreMessage({
          type: 'ok',
          text: `Đã kích hoạt thành công khóa học (Mã: ${data.orderCode || cleaned.toUpperCase()})!`,
        });
        setTimeout(() => setShowRestoreBox(false), 1500);
      } else {
        setRestoreMessage({
          type: 'err',
          text:
            data.message ||
            'Không tìm thấy đơn hàng Khóa học (699.000đ) đã thanh toán với mã/email này.',
        });
      }
    } catch {
      setRestoreMessage({
        type: 'err',
        text: 'Lỗi kết nối máy chủ. Vui lòng thử lại.',
      });
    } finally {
      setRestoreLoading(false);
    }
  };

  // Lọc danh sách bài học theo Học phần & Từ khóa
  const filteredLessons = useMemo(() => {
    return COURSE_LESSONS.filter((l) => {
      if (selectedModule !== 0 && l.moduleId !== selectedModule) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.relatedStars.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [selectedModule, searchQuery]);

  // Chặn phím tắt Copy / Print khi đang đọc bài học
  const handleProtectedKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && ['c', 'p', 's', 'u'].includes(e.key.toLowerCase())) {
      e.preventDefault();
    }
  };

  const watermarkLabel =
    user?.email ||
    profile?.email ||
    unlockedCode ||
    'Học Viện Tử Vi Thầy Tôn • tuvithayton.vn';

  return (
    <div
      className="min-h-screen bg-[#070a14] text-slate-100 pb-28 print:hidden"
      onKeyDown={handleProtectedKeyDown}
    >
      {activeLesson.audioUrl && (
        <audio
          ref={audioRef}
          src={activeLesson.audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      <div className="max-w-[1220px] mx-auto px-3.5 sm:px-6 pt-5 sm:pt-8 space-y-6">
        {/* Thanh Điều Hướng Trên Cùng (z-40 để menu dropdown không bị Hero banner đè lên) */}
        <nav className="relative z-40 flex flex-wrap items-center justify-between gap-3 bg-slate-900/85 border border-amber-500/25 rounded-2xl px-4 py-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-serif font-bold text-sm sm:text-base transition"
            >
              <Compass className="w-5 h-5 shrink-0" />
              <span>TỬ VI &amp; PHONG THỦY THẦY TÔN</span>
            </Link>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-xs sm:text-sm font-semibold text-amber-200 hidden sm:inline">
              🎓 Học Viện Tử Vi Thực Chiến
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <GuideMenuDropdown />
            <Link
              href="/#lap-la-so"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lập Lá Số Miễn Phí</span>
            </Link>
            {!isUnlocked ? (
              <button
                type="button"
                onClick={() => setIsPaymentModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Mở Khóa 699.000đ</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Học Viên Chính Thức ({unlockedCode})</span>
              </span>
            )}
          </div>
        </nav>

        {/* HERO BANNER KHÓA HỌC & NÚT QUÉT QR MỞ KHÓA */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0f152a] to-amber-950/30 border border-amber-500/35 p-5 sm:p-8 shadow-2xl">
          {/* Ảnh nền nghệ thuật Học Viện Tinh Đẩu & Podcast */}
          <img
            src="/images/course-hero-podcast.png"
            alt="Học Viện Tử Vi Đẩu Số Thực Chiến & Podcast Thầy Tôn"
            className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/70 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  <span>Podcast Audio + Giáo Trình Tương Tác</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Mở khóa tự động 24/7 ngay khi quét QR</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-white leading-tight">
                {COURSE_INFO.title}
              </h1>

              {/* Khung ảnh minh họa nổi bật phân biệt Học Viện Podcast với các trang bài viết */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-400/40 bg-slate-950/90 shadow-xl">
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                  <div className="sm:col-span-5 relative h-44 sm:h-full min-h-[165px] overflow-hidden">
                    <img
                      src="/images/course-hero-podcast.png"
                      alt="Minh họa Khóa học Tử Vi & Podcast Audio Thầy Tôn"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/85 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950/90 border border-amber-400/50 backdrop-blur-md">
                      <img
                        src="/avatar-thay-ton.jpg"
                        alt="Thầy Tôn"
                        className="w-7 h-7 rounded-full object-cover border border-amber-400"
                      />
                      <div className="text-[11px] leading-tight">
                        <div className="font-bold text-amber-300">Thầy Tôn giảng dạy</div>
                        <div className="text-[10px] text-slate-300">18+ năm nghiên cứu</div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-7 p-4 space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Trải Nghiệm Học Tử Vi Thế Hệ Mới</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      Hệ thống hóa trọn bộ <strong>14 Chính Tinh, Lục Cát, Lục Sát, Tứ Hóa, 4 Đại Cách Cục &amp; Quy Trình 5 Bước Chấm Hạn Năm</strong> qua giọng giảng Podcast kết hợp giáo trình tương tác và công cụ <strong>Soi Sao Tự Động</strong> trên lá số của bạn.
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                        🎧 Nghe Podcast mọi lúc
                      </span>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold">
                        🃏 Flashcard 14 Chính Tinh
                      </span>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                        🧭 Khớp thẳng lá số cá nhân
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-amber-400 font-bold text-base sm:text-lg">24 Bài Giảng</div>
                  <div className="text-xs text-slate-400">4 Học phần thực chiến</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-amber-400 font-bold text-base sm:text-lg">Podcast + Web</div>
                  <div className="text-xs text-slate-400">Vừa nghe vừa đọc mượt mà</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-emerald-400 font-bold text-base sm:text-lg">Soi Lá Số Riêng</div>
                  <div className="text-xs text-slate-400">Tự động tìm sao trên lá số</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-purple-300 font-bold text-base sm:text-lg">
                    Đã học {completedLessons.length}/24
                  </div>
                  <div className="text-xs text-slate-400">Lưu tiến độ &amp; ghi chú</div>
                </div>
              </div>
            </div>

            {/* Thẻ Giá & Kích Hoạt Nhanh Bên Phải */}
            <div className="lg:col-span-4 bg-slate-950/85 border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
              {isUnlocked ? (
                <div className="space-y-3 text-center py-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <Unlock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                      Đã Mở Khóa Trọn Bộ 24 Bài
                    </div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      Quyền Truy Cập Trọn Đời
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Mã kích hoạt: <span className="text-amber-300 font-mono font-bold">{unlockedCode}</span>
                    </p>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-300"
                      style={{ width: `${Math.round((completedLessons.length / 24) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-300">
                    Tiến độ hoàn thành: <strong>{completedLessons.length}/24 bài học</strong>
                  </p>
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
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Tiết kiệm 53%
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-200">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Mở khóa ngay lập tức toàn bộ <strong>24 tập Podcast &amp; Chuyên khảo</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Tự động đối chiếu vị trí từng sao trên <strong>Lá số của chính bạn</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Học trọn đời trên cả Điện thoại &amp; Máy tính, cập nhật bài mới miễn phí</span>
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 shrink-0" />
                    <span>Quét Mã QR Mở Khóa Ngay (699.000đ)</span>
                  </button>

                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={() => setShowRestoreBox(!showRestoreBox)}
                      className="text-xs text-amber-300 hover:text-amber-200 underline underline-offset-4 cursor-pointer"
                    >
                      Đã thanh toán trước đó? Nhập Mã đơn / Email để mở khóa →
                    </button>
                  </div>
                </>
              )}

              {/* Hộp khôi phục quyền truy cập bằng Mã đơn TVxxxxx hoặc Email */}
              {showRestoreBox && !isUnlocked && (
                <form
                  onSubmit={handleRestoreCourse}
                  className="pt-3 border-t border-slate-800 space-y-2 animate-fade-in"
                >
                  <label className="block text-xs text-slate-300 font-medium">
                    Nhập Mã giao dịch (VD: <code className="text-amber-300">TV12345</code>) hoặc Email đã mua:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={restoreInput}
                      onChange={(e) => setRestoreInput(e.target.value)}
                      placeholder="TVxxxxx hoặc email@..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      disabled={restoreLoading}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                    >
                      {restoreLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Kích hoạt'}
                    </button>
                  </div>
                  {restoreMessage && (
                    <p
                      className={`text-xs ${
                        restoreMessage.type === 'ok' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {restoreMessage.text}
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>
        </header>

        {/* BẢN ĐỒ 4 HỌC PHẦN CÓ ẢNH MINH HỌA TRỰC QUAN */}
        <CourseVisualShowcase
          selectedModule={selectedModule}
          onSelectModule={(modId) => setSelectedModule(modId)}
        />

        {/* BỐ CỤC PHÒNG HỌC CHÍNH: CỘT TRÁI (DANH SÁCH 24 BÀI) & CỘT PHẢI (TRÌNH PHÁT PODCAST + BÀI ĐỌC) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" ref={lessonTopRef}>
          {/* CỘT TRÁI (4/12): DANH MỤC HỌC PHẦN & TÌM KIẾM NHANH */}
          <aside className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl lg:sticky lg:top-4 max-h-[85vh] flex flex-col">
            <div className="space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-amber-300 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>Giáo Trình 24 Bài Học</span>
                </h2>
                <span className="text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Học thử 2 bài đầu
                </span>
              </div>

              {/* Ô tìm kiếm tên sao / cách cục */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm nhanh sao: Tử Vi, Thái Âm, Hóa Kỵ..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Bộ lọc Học phần */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedModule(0)}
                  className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedModule === 0
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  Tất cả (24)
                </button>
                {COURSE_MODULES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModule(m.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedModule === m.id
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    Phần {m.id}
                  </button>
                ))}
              </div>
            </div>

            {/* Danh sách bài học cuộn mượt */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {filteredLessons.map((lesson) => {
                const isCurrent = lesson.id === activeLesson.id;
                const isDone = completedLessons.includes(lesson.id);
                const lessonUnlocked = isUnlocked || lesson.isFreePreview;

                return (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                        lessonTopRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className={`w-full text-left p-3 rounded-2xl border transition flex items-start gap-3 cursor-pointer ${
                      isCurrent
                        ? 'bg-gradient-to-r from-amber-500/20 to-slate-900 border-amber-400/70 shadow-md'
                        : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800/90'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {isDone ? '✓' : lesson.number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5 mb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                          Bài {lesson.number} • {lesson.duration}
                        </span>
                        {lesson.isFreePreview ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Học thử
                          </span>
                        ) : lessonUnlocked ? (
                          <Unlock className="w-3 h-3 text-emerald-400 shrink-0" />
                        ) : (
                          <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                        )}
                      </div>
                      <div
                        className={`text-xs sm:text-sm font-semibold line-clamp-2 leading-snug ${
                          isCurrent ? 'text-amber-200' : 'text-slate-200'
                        }`}
                      >
                        {lesson.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* CỘT PHẢI (8/12): KHUNG NGHE PODCAST + FLASHCARD + BÀI ĐỌC CHỐNG COPY */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
              {/* Tiêu đề Bài học đang chọn */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
                    Bài {activeLesson.number} / 24 • Học phần {activeLesson.moduleId}
                  </span>
                  {activeLesson.isFreePreview && !isUnlocked && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      Bài học thử miễn phí
                    </span>
                  )}
                </div>

                {/* Chỉnh cỡ chữ A- / A / A+ & Đánh dấu hoàn thành */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center rounded-xl bg-slate-950 border border-slate-800 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setFontSize('sm')}
                      className={`px-2 py-1 rounded-lg cursor-pointer ${
                        fontSize === 'sm' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('base')}
                      className={`px-2 py-1 rounded-lg cursor-pointer ${
                        fontSize === 'base' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      A
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontSize('lg')}
                      className={`px-2 py-1 rounded-lg cursor-pointer ${
                        fontSize === 'lg' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                      }`}
                    >
                      A+
                    </button>
                  </div>

                  {canAccessActiveLesson && (
                    <button
                      type="button"
                      onClick={() => toggleCompleteLesson(activeLesson.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        completedLessons.includes(activeLesson.id)
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-500/40'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {completedLessons.includes(activeLesson.id) ? 'Đã học xong' : 'Đánh dấu đã học'}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                  {activeLesson.title}
                </h2>
                <p className="text-sm sm:text-base text-slate-300 mt-2">{activeLesson.subtitle}</p>
              </div>

              {/* Ảnh minh họa Chòm sao & Podcast riêng cho từng bài giảng */}
              <CourseLessonIllustration
                lessonOrder={activeLesson.number}
                moduleId={activeLesson.moduleId}
                moduleTitle={
                  COURSE_MODULES.find((m) => m.id === activeLesson.moduleId)?.title ||
                  `Học phần ${activeLesson.moduleId}`
                }
                title={activeLesson.title}
                relatedStars={activeLesson.relatedStars}
                durationLabel={activeLesson.duration}
                isPlaying={isPlaying}
              />

              {/* NẾU BÀI HỌC ĐANG KHÓA (Bài 3..24 khi chưa mua): HIỆN KHUNG MỞ KHÓA QR NGAY */}
              {!canAccessActiveLesson ? (
                <div className="rounded-3xl bg-gradient-to-br from-amber-950/40 via-slate-950 to-indigo-950/40 border-2 border-amber-500/50 p-6 sm:p-10 text-center space-y-5 shadow-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div className="space-y-2 max-w-xl mx-auto">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      Nội dung dành riêng cho Học viên chính thức
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                      Mở Khóa Bài Giảng Podcast &amp; Chuyên Khảo Này Chỉ Trong 3 Giây
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Quét mã VietQR <strong>699.000đ</strong> để hệ thống tự động mở khóa ngay lập tức trọn bộ <strong>24 bài giảng Podcast + Giáo trình 14 Chính Tinh, Phụ Tinh, Cách Cục &amp; Vận Hạn</strong> của Thầy Tôn.
                    </p>
                  </div>

                  {/* Xem trước Thẻ Flashcard tóm tắt của bài để kích thích chuyển đổi */}
                  <div className="text-left rounded-2xl bg-slate-900/90 border border-slate-800 p-4 max-w-xl mx-auto space-y-2">
                    <div className="text-xs font-bold text-amber-300 uppercase">
                      ✦ Tóm tắt nội dung có trong Bài {activeLesson.number}:
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      • <strong>Ngũ hành &amp; Hóa khí:</strong> {activeLesson.flashcard.nguHanh} — {activeLesson.flashcard.hoaKhi}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300">
                      • <strong>Các chương Podcast ({activeLesson.duration}):</strong>{' '}
                      {activeLesson.podcastChapters.map((c) => c.title).join(' • ')}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <QrCode className="w-5 h-5" />
                      <span>Quét Mã QR Mở Khóa Trọn Bộ (699.000đ)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLessonId('bai-1')}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-sm border border-amber-500/30 transition cursor-pointer"
                    >
                      Nghe Học Thử Bài 1 &amp; Bài 2 Miễn Phí
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* 1. TRÌNH PHÁT PODCAST TƯƠNG TÁC THEO CHƯƠNG (CHAPTERS) */}
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-950 to-amber-950/30 border border-amber-500/40 p-4 sm:p-6 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleTogglePlay}
                          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 transition cursor-pointer shrink-0"
                          title={isPlaying ? 'Tạm dừng Podcast' : 'Phát Podcast bài giảng'}
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                              <Headphones className="w-3.5 h-3.5" />
                              Podcast Bài Giảng Thầy Tôn
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              ({activeLesson.duration})
                            </span>
                          </div>
                          <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                            Phần {activeChapterIdx + 1}: {activeLesson.podcastChapters[activeChapterIdx]?.title}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            speakChapter(Math.max(0, activeChapterIdx - 1), playbackRate)
                          }
                          disabled={activeChapterIdx === 0}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 disabled:opacity-40 cursor-pointer"
                          title="Phần trước"
                        >
                          <SkipBack className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            speakChapter(
                              Math.min(
                                activeLesson.podcastChapters.length - 1,
                                activeChapterIdx + 1
                              ),
                              playbackRate
                            )
                          }
                          disabled={activeChapterIdx >= activeLesson.podcastChapters.length - 1}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 disabled:opacity-40 cursor-pointer"
                          title="Phần tiếp theo"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleChangeSpeed}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs cursor-pointer"
                          title="Đổi tốc độ nghe Podcast"
                        >
                          {playbackRate}x
                        </button>
                      </div>
                    </div>

                    {/* Thanh tiến trình chương đang phát */}
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full transition-all duration-300"
                        style={{ width: `${isPlaying ? Math.max(8, chapterProgress) : chapterProgress}%` }}
                      />
                    </div>

                    {/* Danh sách Mốc thời gian (Timestamps) & Lời giảng đồng bộ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {activeLesson.podcastChapters.map((chap, idx) => {
                        const isActiveChap = idx === activeChapterIdx;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => speakChapter(idx, playbackRate)}
                            className={`text-left p-2.5 rounded-xl border text-xs transition flex items-start gap-2 cursor-pointer ${
                              isActiveChap
                                ? 'bg-amber-500/15 border-amber-400/60 text-amber-200 font-semibold'
                                : 'bg-slate-900/70 hover:bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className="font-mono text-amber-400 font-bold shrink-0">
                              {chap.time}
                            </span>
                            <span className="line-clamp-1">{chap.title}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Lời thoại Podcast (Audio Transcript) của chương đang chọn */}
                    <div className="p-4 rounded-xl bg-slate-950/85 border border-slate-800/90 text-xs sm:text-sm text-slate-200 leading-relaxed select-none">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Nội dung lời giảng Podcast ({activeLesson.podcastChapters[activeChapterIdx]?.time}):</span>
                      </div>
                      <p>{activeLesson.podcastChapters[activeChapterIdx]?.transcript}</p>
                    </div>
                  </div>

                  {/* 2. ĐỐI CHIẾU TRỰC TIẾP LÊN LÁ SỐ CÁ NHÂN CỦA HỌC VIÊN (ĐỘC QUYỀN) */}
                  <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-950 to-amber-950/30 border border-emerald-500/40 p-4 sm:p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-300">
                        <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>
                          Đối Chiếu Trực Tiếp Các Sao Trong Bài Học Lên Lá Số Của{' '}
                          {userHoTen ? userHoTen : 'Bạn'}
                        </span>
                      </div>
                      <Link
                        href="/#lap-la-so"
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4"
                      >
                        {userLaSo ? 'Đổi lá số khác →' : 'Lập lá số của bạn để tự động đối chiếu →'}
                      </Link>
                    </div>

                    {userLaSo && personalStarMatches.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {personalStarMatches.map((m, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-amber-300 text-sm">
                                ★ Sao {m.starName}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                                Cung {m.cungName} ({m.diaChi})
                              </span>
                            </div>
                            <p className="text-slate-300">
                              • Trạng thái:{' '}
                              <strong className="text-white">
                                {m.dacTinh ? `(${m.dacTinh})` : 'Phụ tinh trọng điểm'}
                              </strong>
                              {m.coStars.length > 0 && (
                                <>
                                  {' '}
                                  • Đồng cung với: <strong className="text-amber-200">{m.coStars.join(', ')}</strong>
                                </>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300">
                        💡 Khi bạn lập lá số miễn phí tại Trang chủ, hệ thống sẽ tự động tìm xem sao{' '}
                        <strong className="text-amber-300">
                          {activeLesson.relatedStars.join(', ')}
                        </strong>{' '}
                        đang đóng ở cung nào trên lá số của bạn ngay tại khung này!
                      </p>
                    )}
                  </div>

                  {/* 3. THẺ TÓM TẮT TINH ĐẨU (STAR FLASHCARD) */}
                  <div className="rounded-2xl bg-slate-950/90 border border-amber-500/35 p-4 sm:p-5 space-y-3 select-none">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>Flashcard Tóm Tắt Nhanh Tinh Đẩu &amp; Khẩu Quyết</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Ngũ hành &amp; Hóa khí:</span>
                        <span className="font-semibold text-amber-200">
                          {activeLesson.flashcard.nguHanh} • {activeLesson.flashcard.hoaKhi}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">Chủ sự trọng tâm:</span>
                        <span className="font-semibold text-slate-100">
                          {activeLesson.flashcard.chuSu}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 sm:col-span-2">
                        <span className="text-slate-400 block text-[11px]">Vị trí Miếu / Vượng / Đắc / Hãm:</span>
                        <span className="font-semibold text-emerald-300">
                          {activeLesson.flashcard.dacHam}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 sm:col-span-2">
                        <span className="text-amber-400 block text-[11px] font-bold">
                          Câu phú kinh điển &amp; Nguyên tắc cốt lõi:
                        </span>
                        <p className="text-slate-100 italic mt-0.5">
                          &ldquo;{activeLesson.flashcard.cauPhu}&rdquo;
                        </p>
                        <p className="text-amber-200 font-medium mt-1">
                          👉 {activeLesson.flashcard.cotLoi}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 4. NỘI DUNG BÀI ĐỌC CHUYÊN SÂU (CHỐNG COPY + DYNAMIC WATERMARK) */}
                  <div
                    className="relative rounded-2xl bg-slate-950/75 border border-slate-800 p-5 sm:p-7 select-none overflow-hidden"
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    {/* Lớp đóng dấu chìm bảo vệ bản quyền (Dynamic Watermark) */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 flex flex-col justify-around items-center opacity-[0.045] -rotate-12 select-none overflow-hidden"
                    >
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="text-sm sm:text-lg font-mono font-bold text-amber-300 whitespace-nowrap"
                        >
                          {watermarkLabel} • BẢN QUYỀN TỬ VI THẦY TÔN • CẤM SAO CHÉP
                        </div>
                      ))}
                    </div>

                    <div
                      className={`prose prose-invert max-w-none leading-relaxed relative z-10 ${
                        fontSize === 'sm'
                          ? 'text-sm'
                          : fontSize === 'lg'
                          ? 'text-lg'
                          : 'text-base'
                      }`}
                      dangerouslySetInnerHTML={{ __html: activeLesson.contentHtml }}
                    />
                  </div>

                  {/* 5. SỔ TAY GHI CHÚ CÁ NHÂN CỦA HỌC VIÊN CHO BÀI NÀY */}
                  <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-4 sm:p-5 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-amber-400" />
                        <span>Ghi chú cá nhân của bạn cho Bài {activeLesson.number}:</span>
                      </label>
                      {noteSavedToast && (
                        <span className="text-xs text-emerald-400">✓ Đã tự động lưu vào máy</span>
                      )}
                    </div>
                    <textarea
                      rows={3}
                      value={lessonNotes[activeLesson.id] || ''}
                      onChange={(e) => {
                        handleSaveNote(e.target.value);
                        setNoteSavedToast(true);
                        setTimeout(() => setNoteSavedToast(false), 1800);
                      }}
                      placeholder="Ghi lại những điểm nghiệm lý đúng với lá số của bạn hoặc người thân tại đây..."
                      className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Nút Chuyển Bài Tiếp Theo */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={activeLesson.number <= 1}
                      onClick={() => setActiveLessonId(`bai-${activeLesson.number - 1}`)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold disabled:opacity-40 transition cursor-pointer"
                    >
                      ← Bài trước
                    </button>
                    <button
                      type="button"
                      disabled={activeLesson.number >= 24}
                      onClick={() => setActiveLessonId(`bai-${activeLesson.number + 1}`)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md disabled:opacity-40 transition cursor-pointer"
                    >
                      <span>Bài tiếp theo (Bài {Math.min(24, activeLesson.number + 1)})</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* THANH MINI-PLAYER GHIM NỔI DƯỚI ĐÁY MÀN HÌNH KHI ĐANG NGHE PODCAST */}
      {canAccessActiveLesson && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-amber-500/40 backdrop-blur-xl px-3.5 py-2.5 shadow-2xl">
          <div className="max-w-[1220px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="min-w-0">
                <div className="text-xs font-bold text-amber-300 truncate">
                  Bài {activeLesson.number}: {activeLesson.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Podcast Chương {activeChapterIdx + 1}/{activeLesson.podcastChapters.length}:{' '}
                  {activeLesson.podcastChapters[activeChapterIdx]?.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleChangeSpeed}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono text-xs font-bold cursor-pointer"
              >
                {playbackRate}x
              </button>
              {!isUnlocked && (
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Mở Khóa 24 Bài (699k)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL QUÉT MÃ VIETQR MỞ KHÓA TỰ ĐỘNG 699.000Đ */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={() => {
          setIsUnlocked(true);
          const paidCode =
            typeof window !== 'undefined'
              ? localStorage.getItem('tuvi_last_paid_code') || 'ĐÃ KÍCH HOẠT'
              : 'ĐÃ KÍCH HOẠT';
          setUnlockedCode(paidCode);
          if (typeof window !== 'undefined') {
            localStorage.setItem('tuvi_course_unlocked', 'true');
            localStorage.setItem('tuvi_course_order_code', paidCode);
          }
        }}
        hoTen={
          userHoTen ||
          profile?.full_name ||
          user?.email?.split('@')[0] ||
          'Học viên Tử Vi'
        }
        paymentType="course_tuvi"
        price={699000}
      />
    </div>
  );
}
