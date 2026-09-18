'use client';

import React, { useState, useEffect } from 'react';
import { DuLieuDuongSo, LaSoData, ChatMessage } from '@/types/tuvi';
import { lapLaSoTuVi } from '@/lib/tuvi/anSao';
import TuViForm from '@/components/TuViForm';
import LaSoBanCo from '@/components/LaSoBanCo';
import LuanGiaiAI from '@/components/LuanGiaiAI';
import ChatThayTon from '@/components/ChatThayTon';
import ApiKeyModal from '@/components/ApiKeyModal';
import AuthModal from '@/components/AuthModal';
import SavedChartsModal from '@/components/SavedChartsModal';
import UserNav from '@/components/UserNav';
import { useAuth } from '@/context/AuthContext';
import {
  saveOrUpdateChart,
  getChartDetails,
  updateChartReading,
  saveChatMessage,
} from '@/lib/tuviService';
import { Key, Bookmark, Check, Sparkles } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  const [laSo, setLaSo] = useState<LaSoData | null>(null);
  const [currentDuongSo, setCurrentDuongSo] = useState<DuLieuDuongSo | null>(null);
  const [currentChartId, setCurrentChartId] = useState<string | null>(null);

  const [readingHtml, setReadingHtml] = useState<string | undefined>(undefined);
  const [readingError, setReadingError] = useState<string | undefined>(undefined);
  const [isLoadingReading, setIsLoadingReading] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Modals
  const [customApiKey, setCustomApiKey] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSavedChartsModalOpen, setIsSavedChartsModalOpen] = useState(false);

  // Lưu trữ status
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('user_gemini_api_key') || '';
      setCustomApiKey(savedKey);
    }
  }, []);

  // Xử lý khi nộp form lập lá số mới
  const handleFormSubmit = async (data: DuLieuDuongSo) => {
    // Tách riêng dữ liệu cơ bản của đương số (loại bỏ base64 ảnh khỏi lá số lưu trữ)
    const cleanDuongSo: DuLieuDuongSo = {
      ...data,
      anhMat: undefined,
      anhTay: undefined,
    };

    const calculatedLaSo = lapLaSoTuVi(cleanDuongSo, 2026);
    setLaSo(calculatedLaSo);
    setCurrentDuongSo(data);
    setCurrentChartId(null);
    setReadingHtml(undefined);
    setReadingError(undefined);
    setChatHistory([]);
    setIsLoadingReading(true);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    let createdChartId: string | null = null;

    // Nếu người dùng đã đăng nhập, tự động lưu lá số vào database (bản nhẹ không chứa ảnh base64)
    if (user) {
      try {
        const saveRes = await saveOrUpdateChart({
          title: `${data.hoTen} (${data.gioiTinh} - ${data.namDuong})`,
          duongSoData: cleanDuongSo,
          lasoData: calculatedLaSo,
        });
        if (saveRes.chartId) {
          createdChartId = saveRes.chartId;
          setCurrentChartId(saveRes.chartId);
        }
      } catch (e) {
        console.warn('Lỗi tự động lưu lá số:', e);
      }
    }

    // Gọi AI Thầy Tôn bình giải (ảnh đã được nén siêu nhẹ ~60KB)
    try {
      const res = await fetch('/api/tuvi/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laSo: calculatedLaSo,
          thongTinThem: data.thongTinThem,
          chieuCao: data.chieuCao,
          canNang: data.canNang,
          anhMat: data.anhMat,
          anhTay: data.anhTay,
          apiKey: customApiKey || undefined,
        }),
      });

      if (!res.ok) {
        const rawText = await res.text().catch(() => '');
        let errMsg = rawText;
        try {
          const parsed = JSON.parse(rawText);
          if (parsed.error) errMsg = parsed.error;
        } catch {
          // ignore
        }
        if (res.status === 413 || errMsg.includes('Request Entity Too Large')) {
          errMsg = 'Kích thước ảnh gửi lên quá lớn. Vui lòng chọn ảnh có dung lượng nhỏ hơn để Thầy xem tướng nhé!';
        }
        setReadingError(errMsg || `Lỗi máy chủ (HTTP ${res.status})`);
      } else {
        const json = await res.json();
        if (json.error) {
          setReadingError(json.error);
        } else {
          setReadingHtml(json.reading);

          // Nếu đã lưu lá số, tự động cập nhật bài bình giải vào database
          if (createdChartId && json.reading) {
            updateChartReading(createdChartId, json.reading);
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setReadingError(`Không thể kết nối đến máy chủ: ${msg}`);
    } finally {
      setIsLoadingReading(false);
    }
  };

  // Xử lý gửi tin nhắn hỏi đáp với Thầy Tôn
  const handleSendMessage = async (userQuestion: string) => {
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
          apiKey: customApiKey || undefined,
        }),
      });

      if (!res.ok) {
        const rawText = await res.text().catch(() => '');
        let errMsg = rawText;
        try {
          const parsed = JSON.parse(rawText);
          if (parsed.error) errMsg = parsed.error;
        } catch {
          // ignore
        }
        setChatHistory((prev) => [
          ...prev,
          {
            q: userQuestion,
            a: errMsg || 'Thầy đang bận, xin quý khách thử lại sau ít phút.',
            isError: true,
          },
        ]);
      } else {
        const json = await res.json();
        const answer = json.answer || 'Không nhận được câu trả lời từ Thầy Tôn.';
        setChatHistory((prev) => [
          ...prev,
          {
            q: userQuestion,
            a: answer,
          },
        ]);

        // Nếu đã đăng nhập và có chartId, lưu tin nhắn vào database
        if (currentChartId) {
          saveChatMessage(currentChartId, userQuestion, answer);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setChatHistory((prev) => [
        ...prev,
        {
          q: userQuestion,
          a: `Lỗi kết nối: ${msg}`,
          isError: true,
        },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Mở lá số đã lưu từ Sổ tay
  const handleSelectSavedChart = async (chartId: string) => {
    setIsSavedChartsModalOpen(false);
    setIsLoadingReading(true);

    try {
      const { chart, chatMessages, error } = await getChartDetails(chartId);
      if (error || !chart) {
        alert('Không thể tải lá số: ' + (error || 'Không tìm thấy'));
        return;
      }

      setLaSo(chart.laso_data);
      setCurrentDuongSo(chart.duong_so_data);
      setCurrentChartId(chart.id);
      setReadingHtml(chart.reading_html || undefined);
      setReadingError(undefined);
      setChatHistory(chatMessages || []);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      alert('Lỗi tải dữ liệu lá số: ' + e.message);
    } finally {
      setIsLoadingReading(false);
    }
  };

  // Nút bấm lưu lá số thủ công (nếu người dùng muốn lưu hoặc lúc tạo chưa đăng nhập)
  const handleManualSave = async () => {
    if (!laSo || !currentDuongSo) return;
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSaving(true);
    const cleanDuongSo: DuLieuDuongSo = {
      ...currentDuongSo,
      anhMat: undefined,
      anhTay: undefined,
    };
    const title = `${currentDuongSo.hoTen} (${currentDuongSo.gioiTinh} - ${currentDuongSo.namDuong})`;
    const res = await saveOrUpdateChart({
      id: currentChartId || undefined,
      title,
      duongSoData: cleanDuongSo,
      lasoData: laSo,
      readingHtml,
    });

    if (res.chartId) {
      setCurrentChartId(res.chartId);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } else {
      alert('Không thể lưu lá số: ' + res.error);
    }
    setIsSaving(false);
  };

  const handleReset = () => {
    setLaSo(null);
    setCurrentDuongSo(null);
    setCurrentChartId(null);
    setReadingHtml(undefined);
    setReadingError(undefined);
    setChatHistory([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen cosmic-bg py-6 px-3 sm:px-6 md:px-8 flex flex-col justify-between relative">
      <div className="flex-1">
        {/* Navigation Bar Header */}
        <UserNav
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onOpenSavedCharts={() => {
            if (!user) {
              setIsAuthModalOpen(true);
            } else {
              setIsSavedChartsModalOpen(true);
            }
          }}
          onNewChart={handleReset}
        />

        {!laSo ? (
          <div className="my-auto py-6 sm:py-10">
            <TuViForm
              onSubmit={handleFormSubmit}
              isLoading={isLoadingReading}
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              hasCustomKey={!!customApiKey}
            />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Thanh công cụ phụ khi đang xem lá số */}
            <div className="flex items-center justify-between max-w-[1060px] mx-auto flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualSave}
                  disabled={isSaving}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border transition shadow-sm ${
                    saveSuccess
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300'
                      : currentChartId
                      ? 'bg-slate-900/90 hover:bg-slate-800 border-amber-500/40 text-amber-300'
                      : 'bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold'
                  }`}
                  title={currentChartId ? 'Lá số đã được lưu trong sổ tay' : 'Lưu lá số này vào tài khoản'}
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Đã Lưu Thành Công</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>{currentChartId ? 'Đã Lưu Vào Sổ Tay' : '💾 Lưu Vào Sổ Tay'}</span>
                    </>
                  )}
                </button>

                {!user && (
                  <span className="text-[11px] text-amber-300/80 italic hidden sm:inline">
                    (Đăng nhập để tự động lưu trọn đời)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsApiKeyModalOpen(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                    customApiKey
                      ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 hover:bg-amber-500/30'
                      : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                  }`}
                  title="Cài đặt và kiểm tra Gemini API Key"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>{customApiKey ? 'Key riêng: Bật' : '⚙️ API Key'}</span>
                </button>
              </div>
            </div>

            {/* Bàn Cờ Lá Số Tử Vi */}
            <LaSoBanCo laSo={laSo} onReset={handleReset} />

            {/* Bài Bình Giải Chuyên Sâu */}
            <LuanGiaiAI
              readingHtml={readingHtml}
              isLoading={isLoadingReading}
              error={readingError}
            />

            {/* Khung Hỏi Đáp Trực Tiếp Với Thầy Tôn */}
            <ChatThayTon
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChat}
              maxQuestions={2}
            />
          </div>
        )}
      </div>

      {/* Modal Cài Đặt API Key */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(key) => setCustomApiKey(key)}
      />

      {/* Modal Đăng Nhập / Đăng Ký */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Sổ Tay Danh Sách Lá Số Đã Lưu */}
      <SavedChartsModal
        isOpen={isSavedChartsModalOpen}
        onClose={() => setIsSavedChartsModalOpen(false)}
        onSelectChart={handleSelectSavedChart}
        onNewChart={handleReset}
        activeChartId={currentChartId}
      />

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800/60 print:hidden mt-8">
        <p>© {new Date().getFullYear()} Tử Vi Thầy Tôn AI. Hệ thống phát triển độc lập trên Next.js &amp; Gemini AI.</p>
      </footer>
    </main>
  );
}
