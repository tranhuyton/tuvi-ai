'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  COURSE_INFO,
  COURSE_MODULES,
  COURSE_LESSONS,
  type CourseLesson,
} from '@/lib/courseData';
import CoursePlayerClient from '@/components/CoursePlayerClient';
import { CourseLessonIllustration } from '@/components/MetaphysicalIllustration';
import {
  BookOpen,
  Headphones,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
  Award,
  Volume2,
  CheckCircle2,
  Sparkles,
  Layers,
  FileText,
} from 'lucide-react';

export default function AdminCourseViewer() {
  const [viewMode, setViewMode] = useState<'interactive' | 'full_curriculum'>('full_curriculum');
  const [selectedModule, setSelectedModule] = useState<number>(0); // 0 = Tất cả 4 học phần
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLessonIds, setExpandedLessonIds] = useState<string[]>(
    COURSE_LESSONS.map((l) => l.id) // Mặc định mở sẵn toàn bộ 24 bài để Admin kéo đọc liền mạch
  );

  const filteredLessons = useMemo(() => {
    return COURSE_LESSONS.filter((lesson) => {
      if (selectedModule !== 0 && lesson.moduleId !== selectedModule) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        lesson.title.toLowerCase().includes(q) ||
        lesson.subtitle.toLowerCase().includes(q) ||
        lesson.relatedStars.some((s) => s.toLowerCase().includes(q)) ||
        lesson.contentHtml.toLowerCase().includes(q) ||
        lesson.podcastChapters.some(
          (c) => c.title.toLowerCase().includes(q) || c.transcript.toLowerCase().includes(q)
        )
      );
    });
  }, [selectedModule, searchQuery]);

  const toggleLessonExpand = (id: string) => {
    setExpandedLessonIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const expandAll = () => {
    setExpandedLessonIds(COURSE_LESSONS.map((l) => l.id));
  };

  const collapseAll = () => {
    setExpandedLessonIds([]);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Banner Quản Trị Khóa Học 699.000đ */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#10172d] to-amber-950/35 border border-amber-500/40 p-5 sm:p-7 shadow-2xl space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>QUYỀN ADMIN: ĐÃ MỞ KHÓA 100% (24/24 BÀI HỌC)</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <span>Học phí niêm yết: {COURSE_INFO.price.toLocaleString('vi-VN')}đ</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-400">
              🎓 {COURSE_INFO.title} — {COURSE_INFO.subtitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Tại đây anh có thể duyệt đọc <strong>toàn bộ nội dung chữ, Flashcard khẩu quyết và kịch bản Podcast của cả 24 bài học cùng lúc</strong>, hoặc chuyển sang <strong>Trình phát Học viên VIP</strong> để nghe thử giọng đọc Podcast và trải nghiệm đúng giao diện khách hàng sau khi mua khóa học.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/khoa-hoc"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold transition shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Mở Trang /khoa-hoc (Tab Mới)</span>
            </Link>
          </div>
        </div>

        {/* Nút Chuyển 2 Chế Độ Xem */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setViewMode('full_curriculum')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer border ${
              viewMode === 'full_curriculum'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>📚 Chế độ 1: Đọc Toàn Bộ Giáo Trình 24 Bài (Trải dài 1 trang)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            className={`flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl font-bold text-xs sm:text-sm transition cursor-pointer border ${
              viewMode === 'interactive'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Headphones className="w-4 h-4 shrink-0" />
            <span>🎧 Chế độ 2: Trình Phát Podcast &amp; Giao Diện Học Viên VIP</span>
          </button>
        </div>
      </div>

      {/* CHẾ ĐỘ 2: GIAO DIỆN HỌC VIÊN VIP (TƯƠNG TÁC & NGHE PODCAST) */}
      {viewMode === 'interactive' && (
        <div className="rounded-3xl border border-amber-500/30 bg-[#070a14] p-3 sm:p-5 shadow-2xl">
          <CoursePlayerClient forceUnlock={true} embeddedInAdmin={true} />
        </div>
      )}

      {/* CHẾ ĐỘ 1: ĐỌC TOÀN BỘ 24 BÀI HỌC TRẢI DÀI */}
      {viewMode === 'full_curriculum' && (
        <div className="space-y-6">
          {/* Thanh Công Cụ Lọc Học Phần, Tìm Kiếm & Mở Rộng/Thu Gọn */}
          <div className="sticky top-2 z-30 rounded-2xl bg-slate-900/95 border border-amber-500/30 p-4 shadow-xl backdrop-blur-md space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Lọc theo 4 Học phần */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                <button
                  type="button"
                  onClick={() => setSelectedModule(0)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedModule === 0
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Tất cả ({COURSE_LESSONS.length} bài)
                </button>
                {COURSE_MODULES.map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => setSelectedModule(mod.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedModule === mod.id
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    Học phần {mod.id} ({COURSE_LESSONS.filter((l) => l.moduleId === mod.id).length} bài)
                  </button>
                ))}
              </div>

              {/* Tìm kiếm & Mở rộng/Thu gọn */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên sao, bài học, nội dung..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={expandAll}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  Mở hết 24 bài
                </button>
                <button
                  type="button"
                  onClick={collapseAll}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  Thu gọn
                </button>
              </div>
            </div>

            {/* Mục lục nhảy nhanh tới từng bài (Bài 1 -> Bài 24) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-800/80">
              <span className="text-[11px] font-bold text-amber-400 shrink-0 mr-1">
                Nhảy nhanh:
              </span>
              {filteredLessons.map((l) => (
                <a
                  key={l.id}
                  href={`#admin-lesson-${l.id}`}
                  onClick={() => {
                    if (!expandedLessonIds.includes(l.id)) {
                      setExpandedLessonIds((prev) => [...prev, l.id]);
                    }
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-amber-500 hover:text-slate-950 text-slate-300 text-[11px] font-mono font-bold transition shrink-0"
                  title={l.title}
                >
                  Bài {l.number}
                </a>
              ))}
            </div>
          </div>

          {/* Danh sách tổng quan 4 Học phần */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {COURSE_MODULES.map((mod) => (
              <div
                key={mod.id}
                onClick={() => setSelectedModule(selectedModule === mod.id ? 0 : mod.id)}
                className={`p-4 rounded-2xl border transition cursor-pointer ${
                  selectedModule === mod.id
                    ? 'bg-amber-500/15 border-amber-400'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-1">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    HỌC PHẦN {mod.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                    {COURSE_LESSONS.filter((l) => l.moduleId === mod.id).length} bài
                  </span>
                </div>
                <div className="text-sm font-bold text-white line-clamp-2">
                  {mod.title.replace(/^Học Phần \d+:\s*/i, '')}
                </div>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{mod.description}</p>
              </div>
            ))}
          </div>

          {/* Danh sách chi tiết từng Bài Học */}
          <div className="space-y-6">
            {filteredLessons.map((lesson: CourseLesson) => {
              const isExpanded = expandedLessonIds.includes(lesson.id);
              const moduleObj = COURSE_MODULES.find((m) => m.id === lesson.moduleId);

              return (
                <section
                  key={lesson.id}
                  id={`admin-lesson-${lesson.id}`}
                  className="scroll-mt-36 rounded-3xl bg-slate-900/90 border border-amber-500/30 overflow-hidden shadow-xl"
                >
                  {/* Tiêu đề Bài Học (Bấm để Đóng/Mở) */}
                  <div
                    onClick={() => toggleLessonExpand(lesson.id)}
                    className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border-b border-slate-800/80 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-800/60 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-xs">
                          BÀI {lesson.number} / 24
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-amber-300 text-xs font-semibold">
                          {moduleObj?.title || `Học phần ${lesson.moduleId}`}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                          🎧 Thời lượng: {lesson.duration}
                        </span>
                        {lesson.isFreePreview && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                            Học thử miễn phí
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-extrabold text-white">
                        {lesson.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300">{lesson.subtitle}</p>

                      {lesson.relatedStars?.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-slate-400">Tinh đẩu trọng tâm:</span>
                          {lesson.relatedStars.map((star, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px] font-semibold"
                            >
                              ★ {star}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="p-2 rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 shrink-0"
                      title={isExpanded ? 'Thu gọn bài này' : 'Mở rộng bài này'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Nội dung toàn diện của Bài Học */}
                  {isExpanded && (
                    <div className="p-5 sm:p-7 space-y-6 bg-[#090d1a]">
                      {/* Minh họa bài học */}
                      <CourseLessonIllustration
                        lessonOrder={lesson.number}
                        moduleId={lesson.moduleId}
                        moduleTitle={moduleObj?.title || `Học phần ${lesson.moduleId}`}
                        title={lesson.title}
                        relatedStars={lesson.relatedStars}
                        durationLabel={lesson.duration}
                        isPlaying={false}
                      />

                      {/* 1. THẺ TÓM TẮT TINH ĐẨU & KHẨU QUYẾT (FLASHCARD) */}
                      <div className="rounded-2xl bg-slate-950/90 border border-amber-500/35 p-4 sm:p-5 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                          <Award className="w-4 h-4" />
                          <span>1. Flashcard Tinh Đẩu &amp; Khẩu Quyết Bí Truyền (Bài {lesson.number})</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                            <span className="text-slate-400 block text-[11px]">
                              Ngũ hành &amp; Hóa khí:
                            </span>
                            <span className="font-semibold text-amber-200">
                              {lesson.flashcard.nguHanh} • {lesson.flashcard.hoaKhi}
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                            <span className="text-slate-400 block text-[11px]">
                              Chủ sự trọng tâm:
                            </span>
                            <span className="font-semibold text-slate-100">
                              {lesson.flashcard.chuSu}
                            </span>
                          </div>
                          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 sm:col-span-2">
                            <span className="text-slate-400 block text-[11px]">
                              Vị trí Miếu / Vượng / Đắc / Hãm:
                            </span>
                            <span className="font-semibold text-emerald-300">
                              {lesson.flashcard.dacHam}
                            </span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 sm:col-span-2 space-y-1">
                            <span className="text-amber-400 block text-[11px] font-bold">
                              Câu phú kinh điển &amp; Nguyên tắc cốt lõi:
                            </span>
                            <p className="text-slate-100 italic">
                              &ldquo;{lesson.flashcard.cauPhu}&rdquo;
                            </p>
                            <p className="text-amber-200 font-medium pt-0.5">
                              👉 {lesson.flashcard.cotLoi}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* 2. TOÀN BỘ KỊCH BẢN LỜI GIẢNG PODCAST CỦA CÁC CHƯƠNG */}
                      <div className="rounded-2xl bg-indigo-950/25 border border-indigo-500/30 p-4 sm:p-5 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                          <Volume2 className="w-4 h-4 text-indigo-400" />
                          <span>
                            2. Kịch Bản Lời Giảng Podcast Audio ({lesson.podcastChapters.length}{' '}
                            chương • {lesson.duration})
                          </span>
                        </div>
                        <div className="space-y-2.5">
                          {lesson.podcastChapters.map((chap, cIdx) => (
                            <div
                              key={cIdx}
                              className="p-3.5 rounded-xl bg-slate-950/85 border border-slate-800 space-y-1"
                            >
                              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-300">
                                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 font-mono text-xs text-amber-400">
                                  {chap.time}
                                </span>
                                <span>
                                  Chương {cIdx + 1}: {chap.title}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed pl-1">
                                {chap.transcript}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 3. NỘI DUNG GIÁO TRÌNH CHUYÊN SÂU ĐẦY ĐỦ */}
                      <div className="rounded-2xl bg-slate-950 border border-slate-800 p-5 sm:p-7 space-y-3">
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 pb-2 border-b border-slate-800">
                          <FileText className="w-4 h-4" />
                          <span>3. Nội Dung Giáo Trình Chuyên Khảo Chi Tiết — Bài {lesson.number}</span>
                        </div>
                        <div
                          className="prose prose-invert max-w-none text-base leading-relaxed select-text"
                          dangerouslySetInnerHTML={{ __html: lesson.contentHtml }}
                        />
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
