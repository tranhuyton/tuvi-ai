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
  COURSE_MODULES,
  COURSE_LESSONS_META,
  type CourseLesson,
} from '@/lib/courseMeta';
import PaymentModal from '@/components/PaymentModal';
import AuthModal from '@/components/AuthModal';
import GuideMenuDropdown from '@/components/GuideMenuDropdown';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeSelector from '@/components/ThemeSelector';
import {
  CourseVisualShowcase,
  CourseLessonIllustration,
} from '@/components/MetaphysicalIllustration';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  EXTERNAL_PAGE_UI,
  getLocalizedCourseTitle,
  getLocalizedCourseLesson,
  getLocalizedCourseShowcaseModules,
} from '@/lib/i18n/externalPagesI18n';
import { supabase } from '@/lib/supabase';
import { getAdminAuthHeaders, getBearerAuthHeaders } from '@/lib/adminClientAuth';
import { getUserCharts } from '@/lib/tuviService';
import { trackViewCourse, trackPlayCourseLesson } from '@/lib/metaPixel';
import type { LaSoData } from '@/types/tuvi';

interface StarMatchOnChart {
  starName: string;
  cungName: string;
  diaChi: string;
  dacTinh?: string;
  coStars: string[];
}

interface CoursePlayerClientProps {
  forceUnlock?: boolean;
  embeddedInAdmin?: boolean;
}

export default function CoursePlayerClient({
  forceUnlock = false,
  embeddedInAdmin = false,
}: CoursePlayerClientProps = {}) {
  const { user, profile, testerInfo } = useAuth();
  const { language } = useLanguage();
  const ui = EXTERNAL_PAGE_UI[language];
  const localizedShowcaseMods = useMemo(
    () => getLocalizedCourseShowcaseModules(language),
    [language]
  );

  // Cache bài giảng đã mở khóa nạp từ server (chứa nội dung đầy đủ & signed audio URLs 30 phút)
  const [loadedLessonsMap, setLoadedLessonsMap] = useState<
    Record<string, { lesson: CourseLesson; loadedAt: number }>
  >({});
  const [isLoadingLesson, setIsLoadingLesson] = useState<boolean>(false);
  const [lessonLoadError, setLessonLoadError] = useState<string | null>(null);

  const localizedLessons: CourseLesson[] = useMemo(
    () =>
      COURSE_LESSONS_META.map((metaLesson) => {
        const merged = loadedLessonsMap[metaLesson.id]?.lesson || metaLesson;
        return getLocalizedCourseLesson(merged, language);
      }),
    [language, loadedLessonsMap]
  );

  // Trạng thái mở khóa khóa học
  const [isUnlocked, setIsUnlocked] = useState<boolean>(forceUnlock);
  const [unlockedCode, setUnlockedCode] = useState<string>(forceUnlock ? 'VIP-ADMIN' : '');
  const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(!forceUnlock);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const pendingOpenPaymentRef = useRef<boolean>(false);

  // Bắt buộc tạo tài khoản / đăng nhập trước khi mở bảng QR thanh toán Khóa học 699.000đ
  const openCoursePayment = async () => {
    if (user?.id) {
      setIsPaymentModalOpen(true);
      return;
    }
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.id) {
        setIsPaymentModalOpen(true);
        return;
      }
    } catch {
      // ignore
    }
    pendingOpenPaymentRef.current = true;
    setIsAuthModalOpen(true);
  };

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

  // Trạng thái Podcast Player (Phát file MP3 giọng đọc Thầy Tôn chuẩn phòng thu cho từng chương)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeChapterIdx, setActiveChapterIdx] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [chapterProgress, setChapterProgress] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lessonTopRef = useRef<HTMLDivElement | null>(null);

  const activeLesson: CourseLesson = useMemo(() => {
    return localizedLessons.find((l) => l.id === activeLessonId) || localizedLessons[0];
  }, [activeLessonId, localizedLessons]);

  const canAccessActiveLesson = isUnlocked || activeLesson.isFreePreview;

  // Chỉ cung cấp URL audio khi học viên thực sự có quyền truy cập bài đó (bài 3-24 dùng Signed URL từ private bucket!)
  const currentChapterAudioUrl = useMemo(() => {
    if (!canAccessActiveLesson) return '';
    const chap = activeLesson.podcastChapters[activeChapterIdx];
    if (chap?.audioUrl) return chap.audioUrl;
    if (activeLesson.isFreePreview) {
      return activeLesson.audioUrl || `/audio/course/bai-${activeLesson.number}-chap-${activeChapterIdx + 1}.mp3`;
    }
    return '';
  }, [activeLesson, activeChapterIdx, canAccessActiveLesson]);

  // Nạp nội dung đầy đủ + Signed Audio URL từ server API khi mở Bài 3–24 đã mở khóa (tự gia hạn signed URL sau 20 phút)
  useEffect(() => {
    if (activeLesson.isFreePreview || !isUnlocked) return;
    const cached = loadedLessonsMap[activeLesson.id];
    const TWENTY_MINUTES_MS = 20 * 60 * 1000;
    if (cached && Date.now() - cached.loadedAt < TWENTY_MINUTES_MS) {
      return;
    }

    let cancelled = false;
    const fetchProtectedLesson = async () => {
      setIsLoadingLesson(true);
      setLessonLoadError(null);
      try {
        const headers =
          embeddedInAdmin || forceUnlock
            ? await getAdminAuthHeaders()
            : await getBearerAuthHeaders();
        const res = await fetch(`/api/course/lesson/${encodeURIComponent(activeLesson.id)}`, {
          headers,
          cache: 'no-store',
        });
        const data = await res.json().catch(() => ({}));
        if (!cancelled) {
          if (res.ok && data.success && data.lesson) {
            setLoadedLessonsMap((prev) => ({
              ...prev,
              [activeLesson.id]: { lesson: data.lesson as CourseLesson, loadedAt: Date.now() },
            }));
          } else {
            setLessonLoadError(
              data.error || 'Không thể tải nội dung bài giảng. Vui lòng đăng nhập đúng tài khoản đã mua khóa học.'
            );
          }
        }
      } catch {
        if (!cancelled) {
          setLessonLoadError('Lỗi kết nối khi tải bài giảng. Vui lòng thử lại.');
        }
      } finally {
        if (!cancelled) setIsLoadingLesson(false);
      }
    };

    void fetchProtectedLesson();
    return () => {
      cancelled = true;
    };
  }, [activeLesson.id, activeLesson.isFreePreview, isUnlocked, embeddedInAdmin, forceUnlock, loadedLessonsMap]);

  const formatAudioTime = (sec: number) => {
    if (!sec || !Number.isFinite(sec) || sec < 0) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

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

      // Dọn cờ VIP-ADMIN cũ từng lưu vào localStorage để khách/Admin khi đăng xuất thấy đúng giao diện chưa mua
      const rawSavedCode = localStorage.getItem('tuvi_course_order_code') || '';
      if (rawSavedCode === 'VIP-ADMIN' || rawSavedCode === 'VIP-TESTER') {
        localStorage.removeItem('tuvi_course_order_code');
        localStorage.removeItem('tuvi_course_unlocked');
      }

      if (forceUnlock) {
        setIsUnlocked(true);
        setUnlockedCode('VIP-ADMIN');
      }

      if (!embeddedInAdmin) {
        trackViewCourse();
      }
    } catch {
      // ignore
    }
  }, [forceUnlock, embeddedInAdmin]);

  // Kiểm tra quyền truy cập tự động với API khi có user hoặc mã đơn thực tế (TVxxxxx) lưu trong máy
  useEffect(() => {
    const verifyAccess = async () => {
      setIsCheckingAccess(true);
      try {
        if (forceUnlock) {
          setIsUnlocked(true);
          setUnlockedCode('VIP-ADMIN');
          setIsCheckingAccess(false);
          return;
        }

        if (embeddedInAdmin) {
          setIsUnlocked(true);
          setUnlockedCode('VIP-ADMIN');
          setIsCheckingAccess(false);
          return;
        }

        if (user && testerInfo?.isTester) {
          setIsUnlocked(true);
          setUnlockedCode('VIP-TESTER');
          setIsCheckingAccess(false);
          return;
        }

        const rawOrderCode =
          typeof window !== 'undefined'
            ? localStorage.getItem('tuvi_course_order_code') || ''
            : '';
        const validSavedOrderCode = /^TV[A-Z0-9]{4,}$/i.test(rawOrderCode.trim())
          ? rawOrderCode.trim().toUpperCase()
          : '';

        if (!user?.id && !validSavedOrderCode) {
          setIsUnlocked(false);
          setUnlockedCode('');
          setIsCheckingAccess(false);
          return;
        }

        const authHeaders = await getBearerAuthHeaders();
        const res = await fetch('/api/course/check-access', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders,
          },
          body: JSON.stringify({
            orderCode: validSavedOrderCode || undefined,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.unlocked) {
            setIsUnlocked(true);
            setUnlockedCode(data.orderCode || 'ĐÃ KÍCH HOẠT');
            if (typeof window !== 'undefined' && data.orderCode && data.orderCode !== 'VIP-ADMIN') {
              localStorage.setItem('tuvi_course_unlocked', 'true');
              localStorage.setItem('tuvi_course_order_code', data.orderCode);
            }
          } else {
            setIsUnlocked(false);
            setUnlockedCode('');
          }
        }
      } catch {
        // giữ nguyên trạng thái local
      } finally {
        setIsCheckingAccess(false);
      }
    };

    verifyAccess();
  }, [user, profile?.email, testerInfo?.isTester, forceUnlock, embeddedInAdmin]);

  // Nếu trên thiết bị mới chưa có lá số trong localStorage nhưng học viên đã đăng nhập, tự nạp lá số gần nhất từ Sổ Tay
  useEffect(() => {
    if (userLaSo || !user?.id) return;
    let cancelled = false;
    getUserCharts()
      .then(({ charts }) => {
        if (cancelled || !charts?.length) return;
        const latest = charts.find((c) => c.laso_data?.cungs?.length);
        if (latest?.laso_data) {
          setUserLaSo(latest.laso_data);
          setUserHoTen(latest.duong_so_data?.hoTen || latest.title || 'Bạn');
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user?.id, userLaSo]);

  // Tự động mở bảng thanh toán QR nếu khách bấm nút "Đăng Ký & Mở Khóa Ngay" từ Trang Chủ (?buy=1)
  useEffect(() => {
    if (typeof window === 'undefined' || isCheckingAccess) return;
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('buy') === '1') {
        if (!isUnlocked) {
          openCoursePayment();
        }
        window.history.replaceState(null, '', '/khoa-hoc');
      }
    } catch {
      // ignore
    }
  }, [isCheckingAccess, isUnlocked]);

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

  // 3. Quản lý Podcast Player (Phát trực tiếp file MP3 chuẩn phòng thu từng chương)
  const stopPodcastPlayback = () => {
    setIsPlaying(false);
    setChapterProgress(0);
    setCurrentTimeSec(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    // Dừng phát khi đổi bài học
    stopPodcastPlayback();
    setActiveChapterIdx(0);
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeLessonId]);

  const speakChapter = (chapterIndex: number, rate: number = playbackRate) => {
    const chapters = activeLesson.podcastChapters;
    if (!chapters || chapterIndex < 0 || chapterIndex >= chapters.length) {
      stopPodcastPlayback();
      return;
    }

    const chap = chapters[chapterIndex];
    const targetSrc =
      chap?.audioUrl ||
      activeLesson.audioUrl ||
      `/audio/course/bai-${activeLesson.number}-chap-${chapterIndex + 1}.mp3`;

    setActiveChapterIdx(chapterIndex);
    setChapterProgress(0);
    setCurrentTimeSec(0);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = targetSrc;
      audioRef.current.playbackRate = rate;
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          if (!embeddedInAdmin && chapterIndex === 0) {
            trackPlayCourseLesson(activeLesson.id, Boolean(activeLesson.isFreePreview));
          }
        })
        .catch(() => {
          setIsPlaying(false);
        });
    }
  };

  const handleTogglePlay = () => {
    if (!canAccessActiveLesson) {
      openCoursePayment();
      return;
    }
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Nếu đã load sẵn đúng chương hiện tại và đang tạm dừng giữa chừng thì phát tiếp
      if (audioRef.current.src && audioRef.current.currentTime > 0 && !audioRef.current.ended) {
        audioRef.current.playbackRate = playbackRate;
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => speakChapter(activeChapterIdx, playbackRate));
      } else {
        speakChapter(activeChapterIdx, playbackRate);
      }
    }
  };

  const handleSeekAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pct = Number(e.target.value);
    setChapterProgress(pct);
    if (audioRef.current && durationSec > 0) {
      const nextTime = (pct / 100) * durationSec;
      audioRef.current.currentTime = nextTime;
      setCurrentTimeSec(nextTime);
    }
  };

  const handleChangeSpeed = () => {
    const nextRate = playbackRate === 1.0 ? 1.25 : playbackRate === 1.25 ? 1.5 : 1.0;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
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
      if (!user?.id) {
        setRestoreMessage({
          type: 'err',
          text: isEmail
            ? 'Để bảo vệ tài khoản, quý khách vui lòng đăng nhập bằng đúng email đã thanh toán để hệ thống tự động mở khóa!'
            : 'Quý khách vui lòng đăng nhập tài khoản trước khi đối chiếu mã giao dịch.',
        });
        setIsAuthModalOpen(true);
        return;
      }
      const authHeaders = await getBearerAuthHeaders();
      const res = await fetch('/api/course/check-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          orderCode: isEmail ? undefined : cleaned.toUpperCase(),
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
    return localizedLessons.filter((l) => {
      if (selectedModule !== 0 && l.moduleId !== selectedModule) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        l.title.toLowerCase().includes(q) ||
        l.subtitle.toLowerCase().includes(q) ||
        l.relatedStars.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [selectedModule, searchQuery, localizedLessons]);

  // Chặn phím tắt Copy / Print khi đang đọc bài học (Bỏ qua nếu đang ở trong Admin)
  const handleProtectedKeyDown = (e: React.KeyboardEvent) => {
    if (embeddedInAdmin || forceUnlock) return;
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
      className={`${
        embeddedInAdmin ? 'bg-transparent pb-16' : 'min-h-screen cosmic-bg pb-28 print:hidden'
      } text-slate-100`}
      onKeyDown={handleProtectedKeyDown}
    >
      <audio
        ref={audioRef}
        src={canAccessActiveLesson && currentChapterAudioUrl ? currentChapterAudioUrl : undefined}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const dur = e.currentTarget.duration;
          if (Number.isFinite(dur) && dur > 0) {
            setDurationSec(dur);
          }
        }}
        onTimeUpdate={(e) => {
          const cur = e.currentTarget.currentTime;
          const dur = e.currentTarget.duration;
          setCurrentTimeSec(cur);
          if (Number.isFinite(dur) && dur > 0) {
            setDurationSec(dur);
            setChapterProgress(Math.min(100, Math.round((cur / dur) * 100)));
          }
        }}
        onEnded={() => {
          setChapterProgress(100);
          if (activeChapterIdx + 1 < activeLesson.podcastChapters.length) {
            speakChapter(activeChapterIdx + 1, playbackRate);
          } else {
            setIsPlaying(false);
          }
        }}
        className="hidden"
      />

      <div
        className={`${
          embeddedInAdmin ? 'w-full space-y-6' : 'max-w-[1220px] mx-auto px-3.5 sm:px-6 pt-5 sm:pt-8 space-y-6'
        }`}
      >
        {/* Thanh Điều Hướng Trên Cùng (z-40 để menu dropdown không bị Hero banner đè lên) */}
        {!embeddedInAdmin && (
          <nav className="relative z-40 flex flex-wrap items-center justify-between gap-2 sm:gap-3 bg-slate-900/90 border border-amber-500/30 rounded-2xl px-3 sm:px-4 py-2.5 shadow-xl backdrop-blur-md">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-serif font-bold text-xs sm:text-sm md:text-base transition truncate"
              >
                <Compass className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                <span className="truncate">{ui.brandName}</span>
              </Link>
              <span className="text-slate-600 hidden lg:inline">/</span>
              <span className="text-xs sm:text-sm font-semibold text-amber-200 hidden lg:inline whitespace-nowrap">
                {ui.courseNavSub}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
              <LanguageSelector />
              <ThemeSelector className="hidden sm:inline-block" />
              <div className="hidden md:inline-block">
                <GuideMenuDropdown />
              </div>
              <Link
                href="/#lap-la-so"
                className="hidden sm:inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold transition whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{ui.freeChartBtn}</span>
              </Link>
              {!isUnlocked ? (
                <button
                  type="button"
                  onClick={() => openCoursePayment()}
                  className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-[11px] sm:text-xs shadow-md shadow-amber-500/20 transition cursor-pointer whitespace-nowrap"
                >
                  <QrCode className="w-3.5 h-3.5 shrink-0" />
                  <span>{ui.courseUnlockBtn}</span>
                </button>
              ) : (
                <span className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] sm:text-xs whitespace-nowrap">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {unlockedCode === 'VIP-ADMIN'
                      ? ui.courseAdminBadge
                      : unlockedCode === 'VIP-TESTER'
                      ? ui.courseTesterBadge
                      : ui.courseStudentBadge.replace('{code}', unlockedCode)}
                  </span>
                </span>
              )}
            </div>
          </nav>
        )}

        {/* HERO BANNER KHÓA HỌC & NÚT QUÉT QR MỞ KHÓA */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0f152a] to-amber-950/30 border border-amber-500/35 p-5 sm:p-8 shadow-2xl">
          {/* Ảnh nền nghệ thuật Học Viện Tinh Đẩu & Podcast */}
          <img
            src="/images/course-hero-podcast.png"
            alt={getLocalizedCourseTitle(language)}
            className="absolute inset-0 w-full h-full object-cover opacity-25 pointer-events-none select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/70 pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Headphones className="w-3.5 h-3.5 text-amber-400" />
                  <span>{ui.courseHeroBadge1}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>
                    {isUnlocked ? ui.courseHeroUnlockedBadge : ui.courseHeroAutoBadge}
                  </span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-serif text-white leading-tight">
                {getLocalizedCourseTitle(language)}
              </h1>

              {/* Khung ảnh minh họa nổi bật phân biệt Học Viện Podcast với các trang bài viết */}
              <div className="relative rounded-2xl overflow-hidden border border-amber-400/40 bg-slate-950/90 shadow-xl">
                <div className="grid grid-cols-1 sm:grid-cols-12 items-center">
                  <div className="sm:col-span-5 relative h-44 sm:h-full min-h-[165px] overflow-hidden">
                    <img
                      src="/images/course-hero-podcast.png"
                      alt={getLocalizedCourseTitle(language)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-950/85 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950/90 border border-amber-400/50 backdrop-blur-md">
                      <img
                        src="/avatar-thay-ton.jpg"
                        alt={ui.courseInstructorTitle}
                        className="w-7 h-7 rounded-full object-cover border border-amber-400"
                      />
                      <div className="text-[11px] leading-tight">
                        <div className="font-bold text-amber-300">{ui.courseInstructorTitle}</div>
                        <div className="text-[10px] text-slate-300">{ui.courseInstructorSub}</div>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-7 p-4 space-y-2.5">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ui.courseNextGenBadge}</span>
                    </div>
                    <p
                      className="text-xs sm:text-sm text-slate-200 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: ui.courseNextGenDescHtml }}
                    />
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold">
                        {ui.coursePill1}
                      </span>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-semibold">
                        {ui.coursePill2}
                      </span>
                      <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                        {ui.coursePill3}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-amber-400 font-bold text-base sm:text-lg">{ui.courseStat1Title}</div>
                  <div className="text-xs text-slate-400">{ui.courseStat1Sub}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-amber-400 font-bold text-base sm:text-lg">{ui.courseStat2Title}</div>
                  <div className="text-xs text-slate-400">{ui.courseStat2Sub}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-emerald-400 font-bold text-base sm:text-lg">{ui.courseStat3Title}</div>
                  <div className="text-xs text-slate-400">{ui.courseStat3Sub}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-purple-300 font-bold text-base sm:text-lg">
                    {ui.courseStat4Title.replace('{done}', String(completedLessons.length))}
                  </div>
                  <div className="text-xs text-slate-400">{ui.courseStat4Sub}</div>
                </div>
              </div>
            </div>

            {/* Thẻ Giá & Kích Hoạt Nhanh Bên Phải */}
            <div className="lg:col-span-4 bg-slate-950/85 border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-xl">
              {isUnlocked ? (
                <div className="space-y-3 text-center py-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">
                      {ui.courseUnlockedTitle}
                    </div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      {ui.courseLifetimeTitle}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {unlockedCode === 'VIP-ADMIN' ? (
                        <span className="text-amber-300 font-bold">{ui.courseAdminBadge}</span>
                      ) : unlockedCode === 'VIP-TESTER' ? (
                        <span className="text-amber-300 font-bold">{ui.courseTesterBadge}</span>
                      ) : (
                        <span className="text-amber-300 font-mono font-bold">{unlockedCode}</span>
                      )}
                    </p>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-amber-400 h-full transition-all duration-300"
                      style={{ width: `${Math.round((completedLessons.length / 24) * 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-300">
                    {ui.courseProgressLabel} <strong>{completedLessons.length}/24</strong>
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline justify-between border-b border-slate-800 pb-3">
                    <div>
                      <span className="text-xs text-slate-400 block">{ui.courseTuitionLabel}</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                        699.000đ
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-500 line-through block">1.490.000đ</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {ui.courseSave53}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2 text-xs text-slate-200">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span dangerouslySetInnerHTML={{ __html: ui.courseBullet1Html }} />
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span dangerouslySetInnerHTML={{ __html: ui.courseBullet2Html }} />
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span dangerouslySetInnerHTML={{ __html: ui.courseBullet3Html }} />
                    </li>
                  </ul>

                  <button
                    type="button"
                    onClick={() => openCoursePayment()}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <QrCode className="w-4 h-4 shrink-0" />
                    <span>{ui.courseQrBtn}</span>
                  </button>

                  <div className="pt-1 text-center">
                    <button
                      type="button"
                      onClick={() => setShowRestoreBox(!showRestoreBox)}
                      className="text-xs text-amber-300 hover:text-amber-200 underline underline-offset-4 cursor-pointer"
                    >
                      {ui.courseRestoreLink}
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
                    {ui.courseRestoreLabel}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={restoreInput}
                      onChange={(e) => setRestoreInput(e.target.value)}
                      placeholder={ui.courseRestorePlaceholder}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="submit"
                      disabled={restoreLoading}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer disabled:opacity-50"
                    >
                      {restoreLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        ui.courseRestoreBtn
                      )}
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
                  <span>{ui.courseSidebarTitle}</span>
                </h2>
                {isUnlocked ? (
                  <span className="text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                    {ui.courseSidebarUnlocked}
                  </span>
                ) : (
                  <span className="text-[11px] text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    {ui.courseSidebarPreview}
                  </span>
                )}
              </div>

              {/* Ô tìm kiếm tên sao / cách cục */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={ui.courseSearchPlaceholder}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Bộ lọc Học phần (Tự động xuống dòng gọn, không lộ thanh cuộn ngang) */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedModule(0)}
                  className={`px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedModule === 0
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {ui.courseFilterAll}
                </button>
                {COURSE_MODULES.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedModule(m.id)}
                    className={`px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap transition cursor-pointer ${
                      selectedModule === m.id
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {ui.courseFilterModule.replace('{id}', String(m.id))}
                  </button>
                ))}
              </div>
            </div>

            {/* Danh sách bài học cuộn mượt */}
            <div className="overflow-y-auto space-y-2 pr-1 flex-1">
              {filteredLessons.map((lesson) => {
                const isCurrent = lesson.id === activeLesson.id;
                const isDone = completedLessons.includes(lesson.id);

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
                          {ui.courseLessonPrefix} {lesson.number} • {lesson.duration}
                        </span>
                        {isUnlocked ? (
                          isDone ? (
                            <span className="text-[10px] font-bold text-emerald-400">
                              {ui.courseDoneBadge}
                            </span>
                          ) : null
                        ) : lesson.isFreePreview ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {ui.coursePreviewBadge}
                          </span>
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
                    {ui.courseLessonPrefix} {activeLesson.number} / 24 •{' '}
                    {ui.courseFilterModule.replace('{id}', String(activeLesson.moduleId))}
                  </span>
                  {activeLesson.isFreePreview && !isUnlocked && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                      {ui.courseFreePreviewLesson}
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
                        {completedLessons.includes(activeLesson.id)
                          ? ui.courseMarkedDone
                          : ui.courseMarkDone}
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
                  localizedShowcaseMods.find((m) => m.id === activeLesson.moduleId)?.title ||
                  ui.courseFilterModule.replace('{id}', String(activeLesson.moduleId))
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
                      {ui.courseLockedBadge}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                      {ui.courseLockedTitle}
                    </h3>
                    <p
                      className="text-sm text-slate-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: ui.courseLockedDescHtml }}
                    />
                  </div>

                  {/* Xem trước Thẻ Flashcard tóm tắt của bài để kích thích chuyển đổi */}
                  <div className="text-left rounded-2xl bg-slate-900/90 border border-slate-800 p-4 max-w-xl mx-auto space-y-2">
                    <div className="text-xs font-bold text-amber-300 uppercase">
                      {ui.courseLockedSummaryLabel.replace('{num}', String(activeLesson.number))}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300">
                      • <strong>{ui.courseLockedElementsLabel}</strong> {activeLesson.flashcard.nguHanh} —{' '}
                      {activeLesson.flashcard.hoaKhi}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300">
                      • <strong>{ui.courseLockedChaptersLabel.replace('{dur}', activeLesson.duration)}</strong>{' '}
                      {activeLesson.podcastChapters.map((c) => c.title).join(' • ')}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => openCoursePayment()}
                      className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <QrCode className="w-5 h-5" />
                      <span>{ui.courseLockedQrBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveLessonId('bai-1')}
                      className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-sm border border-amber-500/30 transition cursor-pointer"
                    >
                      {ui.courseLockedPreviewBtn}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {isLoadingLesson && !activeLesson.contentHtml && (
                    <div className="rounded-2xl bg-slate-900/90 border border-amber-500/35 p-6 text-center space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-400 mx-auto" />
                      <p className="text-sm text-amber-200 font-semibold">
                        Đang tải giáo trình &amp; luồng Podcast bảo mật...
                      </p>
                    </div>
                  )}
                  {lessonLoadError && (
                    <div className="rounded-2xl bg-red-950/50 border border-red-500/40 p-4 text-sm text-red-200">
                      {lessonLoadError}
                    </div>
                  )}
                  {/* 1. TRÌNH PHÁT PODCAST TƯƠNG TÁC THEO CHƯƠNG (CHAPTERS) */}
                  <div className="rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-950 to-amber-950/30 border border-amber-500/40 p-4 sm:p-6 space-y-4 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleTogglePlay}
                          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 transition cursor-pointer shrink-0"
                        >
                          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                              <Headphones className="w-3.5 h-3.5" />
                              {ui.coursePlayerTitle}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">
                              ({activeLesson.duration})
                            </span>
                          </div>
                          <div className="text-sm sm:text-base font-bold text-white mt-0.5">
                            {ui.coursePartLabel} {activeChapterIdx + 1}:{' '}
                            {activeLesson.podcastChapters[activeChapterIdx]?.title}
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
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleChangeSpeed}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-mono font-bold text-xs cursor-pointer"
                        >
                          {playbackRate}x
                        </button>
                      </div>
                    </div>

                    {/* Thanh tiến trình chương đang phát (Có thể kéo tua trực tiếp) */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="text-amber-300 font-semibold">
                          {formatAudioTime(currentTimeSec)}
                        </span>
                        <span>
                          {ui.courseChapterLabel} {activeChapterIdx + 1}/
                          {activeLesson.podcastChapters.length} •{' '}
                          {durationSec > 0 ? formatAudioTime(durationSec) : activeLesson.duration}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={chapterProgress}
                        onChange={handleSeekAudio}
                        className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400"
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
                        <span>
                          {ui.courseTranscriptLabel} (
                          {activeLesson.podcastChapters[activeChapterIdx]?.time}):
                        </span>
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
                          {ui.courseStarMatchTitle} {userHoTen ? userHoTen : ui.courseStarMatchYou}
                        </span>
                      </div>
                      <Link
                        href="/#lap-la-so"
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4"
                      >
                        {userLaSo ? ui.courseChangeChart : ui.courseCreateChartToMatch}
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
                                ★ {ui.courseStarLabel} {m.starName}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                                {ui.coursePalaceLabel} {m.cungName} ({m.diaChi})
                              </span>
                            </div>
                            <p className="text-slate-300">
                              • {ui.courseStatusLabel}{' '}
                              <strong className="text-white">
                                {m.dacTinh ? `(${m.dacTinh})` : ui.courseMajorAux}
                              </strong>
                              {m.coStars.length > 0 && (
                                <>
                                  {' '}
                                  • {ui.courseCoStarsLabel}{' '}
                                  <strong className="text-amber-200">{m.coStars.join(', ')}</strong>
                                </>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300">
                        {ui.courseNoChartHint1}{' '}
                        <strong className="text-amber-300">
                          {activeLesson.relatedStars.join(', ')}
                        </strong>{' '}
                        {ui.courseNoChartHint2}
                      </p>
                    )}
                  </div>

                  {/* 3. THẺ TÓM TẮT TINH ĐẨU (STAR FLASHCARD) */}
                  <div className="rounded-2xl bg-slate-950/90 border border-amber-500/35 p-4 sm:p-5 space-y-3 select-none">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      <span>{ui.courseFlashcardTitle}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">
                          {ui.courseFcElements}
                        </span>
                        <span className="font-semibold text-amber-200">
                          {activeLesson.flashcard.nguHanh} • {activeLesson.flashcard.hoaKhi}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">
                          {ui.courseFcDomain}
                        </span>
                        <span className="font-semibold text-slate-100">
                          {activeLesson.flashcard.chuSu}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 sm:col-span-2">
                        <span className="text-slate-400 block text-[11px]">
                          {ui.courseFcBrightness}
                        </span>
                        <span className="font-semibold text-emerald-300">
                          {activeLesson.flashcard.dacHam}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 sm:col-span-2">
                        <span className="text-amber-400 block text-[11px] font-bold">
                          {ui.courseFcClassicVerse}
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
                    className={`relative rounded-2xl bg-slate-950/75 border border-slate-800 p-5 sm:p-7 ${
                      embeddedInAdmin || forceUnlock ? 'select-text' : 'select-none'
                    } overflow-hidden`}
                    onCopy={(e) => {
                      if (!embeddedInAdmin && !forceUnlock) e.preventDefault();
                    }}
                    onCut={(e) => {
                      if (!embeddedInAdmin && !forceUnlock) e.preventDefault();
                    }}
                    onContextMenu={(e) => {
                      if (!embeddedInAdmin && !forceUnlock) e.preventDefault();
                    }}
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
                        <span>
                          {ui.courseNotesLabel.replace('{num}', String(activeLesson.number))}
                        </span>
                      </label>
                      {noteSavedToast && (
                        <span className="text-xs text-emerald-400">{ui.courseNotesSaved}</span>
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
                      placeholder={ui.courseNotesPlaceholder}
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
                      {ui.coursePrevLesson}
                    </button>
                    <button
                      type="button"
                      disabled={activeLesson.number >= 24}
                      onClick={() => setActiveLessonId(`bai-${activeLesson.number + 1}`)}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md disabled:opacity-40 transition cursor-pointer"
                    >
                      <span>
                        {ui.courseNextLesson.replace('{num}', String(Math.min(24, activeLesson.number + 1)))}
                      </span>
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
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-amber-500/40 backdrop-blur-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xl">
          <div className="max-w-[1220px] mx-auto flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0 cursor-pointer shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-amber-300 truncate">
                  {ui.courseLessonPrefix} {activeLesson.number}: {activeLesson.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  Podcast {ui.courseChapterLabel} {activeChapterIdx + 1}/
                  {activeLesson.podcastChapters.length}:{' '}
                  {activeLesson.podcastChapters[activeChapterIdx]?.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <button
                type="button"
                onClick={handleChangeSpeed}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono text-[11px] sm:text-xs font-bold cursor-pointer"
              >
                {playbackRate}x
              </button>
              {!isUnlocked && (
                <button
                  type="button"
                  onClick={() => openCoursePayment()}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-[11px] sm:text-xs cursor-pointer whitespace-nowrap shadow-sm"
                >
                  <span className="sm:hidden">699K</span>
                  <span className="hidden sm:inline">{ui.courseMiniUnlockBtn}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL ĐĂNG KÝ / ĐĂNG NHẬP TÀI KHOẢN TRƯỚC KHI THANH TOÁN KHÓA HỌC */}
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultTab="signup"
        onClose={() => {
          setIsAuthModalOpen(false);
          pendingOpenPaymentRef.current = false;
        }}
        customNotice={ui.courseAuthNotice}
        onSuccess={async () => {
          setIsAuthModalOpen(false);
          if (pendingOpenPaymentRef.current) {
            pendingOpenPaymentRef.current = false;
            try {
              const { data } = await supabase.auth.getUser();
              if (data?.user?.id) {
                setIsPaymentModalOpen(true);
              }
            } catch {
              // ignore
            }
          }
        }}
      />

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
