'use client';

import React, { useState } from 'react';
import { DuLieuDuongSo, LaSoData, ChatMessage, ServiceTier } from '@/types/tuvi';
import { lapLaSoTuVi, buildCungDataPrompt } from '@/lib/tuvi/anSao';
import LaSoBanCo from '@/components/LaSoBanCo';
import LuanGiaiAI from '@/components/LuanGiaiAI';
import ChatThayTon from '@/components/ChatThayTon';
import { Sparkles, Crown, Play, RefreshCw, Code2, Clock, FileText, User, Zap, ChevronRight } from 'lucide-react';

interface PresetOption {
  label: string;
  desc: string;
  data: DuLieuDuongSo;
}

const PRESETS: PresetOption[] = [
  {
    label: '👑 Lá Số Mẫu Thầy Tôn (1985)',
    desc: 'Nam Mệnh Ất Sửu, xem vận hạn năm Bính Ngọ 2026',
    data: {
      hoTen: 'Trần Huy Tôn',
      gioiTinh: 'Nam',
      ngayDuong: 15,
      thangDuong: 8,
      namDuong: 1985,
      gioSinhVal: 'Thìn (07h-09h)',
      thongTinThem: 'Nghiên cứu dịch học, kinh doanh tư vấn chiến lược.',
      chieuCao: 172,
      canNang: 68,
      tier: 'pro',
    },
  },
  {
    label: '📜 Mẫu Nam Mệnh Kim (1995)',
    desc: 'Ất Hợi, Sinh giờ Dần, muốn hỏi về công danh khởi nghiệp',
    data: {
      hoTen: 'Nguyễn Văn An',
      gioiTinh: 'Nam',
      ngayDuong: 10,
      thangDuong: 4,
      namDuong: 1995,
      gioSinhVal: 'Dần (03h-05h)',
      thongTinThem: 'Kỹ sư phần mềm, đang chuẩn bị khởi nghiệp công nghệ.',
      chieuCao: 170,
      canNang: 65,
      tier: 'free',
    },
  },
  {
    label: '✨ Mẫu Nữ Mệnh Thủy (1998)',
    desc: 'Mậu Dần, Sinh giờ Ngọ, xem tình duyên và tài lộc',
    data: {
      hoTen: 'Lê Thùy Dương',
      gioiTinh: 'Nữ',
      ngayDuong: 22,
      thangDuong: 11,
      namDuong: 1998,
      gioSinhVal: 'Ngọ (11h-13h)',
      thongTinThem: 'Làm việc trong lĩnh vực tài chính ngân hàng, quan tâm gia đạo.',
      chieuCao: 160,
      canNang: 48,
      tier: 'pro',
    },
  },
];

export default function AdminTestStudio() {
  const [formData, setFormData] = useState<DuLieuDuongSo>(PRESETS[0].data);
  const [testTier, setTestTier] = useState<ServiceTier>('pro');
  const [testModel, setTestModel] = useState<string>('gemini-3.1-pro-preview');

  // Lá số và kết quả
  const [laSo, setLaSo] = useState<LaSoData | null>(null);
  const [readingHtml, setReadingHtml] = useState<string | undefined>(undefined);
  const [readingError, setReadingError] = useState<string | undefined>(undefined);
  const [isLoadingReading, setIsLoadingReading] = useState(false);
  const [generationTimeMs, setGenerationTimeMs] = useState<number | null>(null);
  const [wordCount, setWordCount] = useState<number | null>(null);

  // Chat hỏi đáp
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Debug prompt
  const [showPromptDebug, setShowPromptDebug] = useState(false);
  const [rawPromptText, setRawPromptText] = useState<string>('');

  // Hàm chọn preset
  const handleSelectPreset = (preset: PresetOption) => {
    setFormData(preset.data);
    setTestTier(preset.data.tier || 'pro');
    setTestModel(preset.data.tier === 'pro' ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash');
  };

  // Hàm An sao & Luận giải
  const handleExecuteTest = async () => {
    setIsLoadingReading(true);
    setReadingHtml(undefined);
    setReadingError(undefined);
    setGenerationTimeMs(null);
    setWordCount(null);
    setChatHistory([]);

    const cleanData: DuLieuDuongSo = {
      ...formData,
      tier: testTier,
    };

    const calculated = lapLaSoTuVi(cleanData, 2026);
    calculated.tier = testTier;
    setLaSo(calculated);

    // Chuẩn bị raw prompt để debug
    const cungDataStr = buildCungDataPrompt(calculated);
    setRawPromptText(
      `[MODEL TEST]: ${testModel} | [TIER]: ${testTier}\nĐương số: ${calculated.duongSo.hoTen} (${calculated.duongSo.gioiTinh} - ${calculated.namCanChi})\nMệnh: ${calculated.banMenh} | Cục: ${calculated.tenCuc}\n12 CUNG DỮ LIỆU:\n${cungDataStr}`
    );

    const startTime = Date.now();

    try {
      const res = await fetch('/api/tuvi/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laSo: calculated,
          tier: testTier,
          thongTinThem: cleanData.thongTinThem,
          chieuCao: cleanData.chieuCao,
          canNang: cleanData.canNang,
          model: testModel,
        }),
      });

      const elapsed = Date.now() - startTime;
      setGenerationTimeMs(elapsed);

      if (res.ok) {
        const json = await res.json();
        if (json.reading) {
          setReadingHtml(json.reading);
          // Đếm số từ
          const textOnly = json.reading.replace(/<[^>]*>/g, ' ');
          const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
          setWordCount(words);
        } else {
          setReadingError(json.error || 'Không nhận được bài luận giải.');
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        setReadingError(errJson.error || `HTTP ${res.status}`);
      }
    } catch (e: any) {
      setReadingError(e.message || 'Lỗi kết nối tới máy chủ');
    } finally {
      setIsLoadingReading(false);
    }
  };

  // Hỏi đáp trực tiếp không giới hạn lượt (Admin mode)
  const handleAdminSendMessage = async (userQuestion: string) => {
    if (!laSo) return;
    setIsLoadingChat(true);

    try {
      const res = await fetch('/api/tuvi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion,
          laSo,
          thongTinThem: laSo.duongSo.thongTinThem,
          chieuCao: laSo.duongSo.chieuCao,
          canNang: laSo.duongSo.canNang,
          chatHistory,
          model: testModel,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setChatHistory((prev) => [
          ...prev,
          { q: userQuestion, a: json.answer || 'Không nhận được câu trả lời.' },
        ]);
      } else {
        const errJson = await res.json().catch(() => ({}));
        setChatHistory((prev) => [
          ...prev,
          { q: userQuestion, a: errJson.error || 'Lỗi kết nối Thầy Tôn', isError: true },
        ]);
      }
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        { q: userQuestion, a: `Lỗi: ${err.message}`, isError: true },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Bảng chọn Preset & Cấu hình Test */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800 flex-wrap">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-amber-400 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Studio An Sao &amp; Kiểm Thử Luận Giải (Admin Bypass)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Toàn quyền thử nghiệm cả 2 bản Free &amp; Pro, tự do đổi mô hình AI và kiểm tra hỏi đáp không giới hạn.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPromptDebug(!showPromptDebug)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{showPromptDebug ? 'Ẩn Raw Prompt' : 'Xem Raw Prompt'}</span>
            </button>
          </div>
        </div>

        {/* Nút chọn nhanh lá số mẫu */}
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Chọn nhanh lá số mẫu:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {PRESETS.map((p, idx) => {
              const isSelected = formData.hoTen === p.data.hoTen && formData.namDuong === p.data.namDuong;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className={`text-left p-3 rounded-xl border transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-200'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs sm:text-sm">{p.label}</div>
                  <div className="text-[11px] text-slate-400 mt-1">{p.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form nhập thông tin kiểm thử */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Họ tên đương số:</label>
            <input
              type="text"
              value={formData.hoTen}
              onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs sm:text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Giới tính:</label>
            <select
              value={formData.gioiTinh}
              onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs sm:text-sm text-slate-100"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Ngày / Tháng / Năm sinh:</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={formData.ngayDuong}
                onChange={(e) => setFormData({ ...formData, ngayDuong: Number(e.target.value) })}
                className="w-14 px-2 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-center text-slate-100"
                placeholder="Ngày"
              />
              <input
                type="number"
                value={formData.thangDuong}
                onChange={(e) => setFormData({ ...formData, thangDuong: Number(e.target.value) })}
                className="w-14 px-2 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-center text-slate-100"
                placeholder="Tháng"
              />
              <input
                type="number"
                value={formData.namDuong}
                onChange={(e) => setFormData({ ...formData, namDuong: Number(e.target.value) })}
                className="w-full px-2 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-center text-slate-100"
                placeholder="Năm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Giờ sinh:</label>
            <input
              type="text"
              value={formData.gioSinhVal}
              onChange={(e) => setFormData({ ...formData, gioSinhVal: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs sm:text-sm text-slate-100"
            />
          </div>
        </div>

        {/* Tùy chọn Gói & Model kiểm thử */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-slate-300">Gói kiểm thử:</span>
            <div className="flex rounded-lg overflow-hidden border border-slate-700 p-0.5 bg-slate-900">
              <button
                type="button"
                onClick={() => {
                  setTestTier('free');
                  setTestModel('gemini-2.5-flash');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  testTier === 'free'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📜 Bản Free (Flash)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTestTier('pro');
                  setTestModel('gemini-3.1-pro-preview');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  testTier === 'pro'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👑 Bản Pro VIP (3.1 Pro)
              </button>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
              <span className="text-xs text-slate-400">Model:</span>
              <select
                value={testModel}
                onChange={(e) => setTestModel(e.target.value)}
                className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200"
              >
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Mạnh nhất)</option>
                <option value="gemini-2.5-flash">gemini-2.5-flash (Nhanh &amp; chuẩn)</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExecuteTest}
            disabled={isLoadingReading}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isLoadingReading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Đang Bình Giải AI...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Chạy An Sao &amp; Bình Giải Ngay</span>
              </>
            )}
          </button>
        </div>

        {/* Khung Raw Prompt Debug */}
        {showPromptDebug && (
          <div className="mt-4 p-4 rounded-xl bg-black/80 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-60 whitespace-pre-wrap">
            <div className="text-amber-400 font-bold mb-1">Dữ liệu Prompt gửi lên Gemini:</div>
            {rawPromptText || 'Chưa chạy an sao. Bấm "Chạy An Sao & Bình Giải Ngay" để xem prompt.'}
          </div>
        )}
      </div>

      {/* Thông tin Benchmark tốc độ & Độ dài bài luận */}
      {(generationTimeMs !== null || wordCount !== null) && (
        <div className="flex items-center gap-4 flex-wrap p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
          {generationTimeMs !== null && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Thời gian sinh bài luận: <strong className="text-emerald-300 font-bold">{(generationTimeMs / 1000).toFixed(2)} giây</strong></span>
            </div>
          )}
          {wordCount !== null && (
            <div className="flex items-center gap-1.5 pl-4 border-l border-slate-700">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Độ dài bài bình: <strong className="text-sky-300 font-bold">{wordCount.toLocaleString()} từ</strong></span>
            </div>
          )}
          <div className="flex items-center gap-1.5 pl-4 border-l border-slate-700">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Mô hình: <strong className="text-amber-300 font-bold">{testModel}</strong> ({testTier === 'pro' ? 'Bản Pro' : 'Bản Free'})</span>
          </div>
        </div>
      )}

      {/* Kết quả An Sao & Bàn Cờ Lá Số */}
      {laSo && (
        <div className="space-y-6">
          <LaSoBanCo laSo={laSo} onReset={() => setLaSo(null)} />

          {/* Bài bình giải AI */}
          <LuanGiaiAI
            readingHtml={readingHtml}
            isLoading={isLoadingReading}
            error={readingError}
            tier={testTier}
          />

          {/* Khung Hỏi Đáp Thầy Tôn (Admin mode: Unlimited questions) */}
          <div className="relative">
            <div className="mb-2 flex items-center justify-between text-xs text-amber-400/90 font-semibold px-1">
              <span>🛡️ Chế độ Admin: Hỏi đáp trực tiếp không giới hạn lượt (Bypass 100% thanh toán)</span>
              <span>Đã hỏi: {chatHistory.length} câu</span>
            </div>
            <ChatThayTon
              chatHistory={chatHistory}
              onSendMessage={handleAdminSendMessage}
              isLoading={isLoadingChat}
              tier={testTier}
              questionsAllowed={999}
              onUnlockQuestions={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
