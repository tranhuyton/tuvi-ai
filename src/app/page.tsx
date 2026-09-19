'use client';

import React, { useState } from 'react';
import { DuLieuDuongSo, LaSoData, ChatMessage, ServiceTier } from '@/types/tuvi';
import { lapLaSoTuVi } from '@/lib/tuvi/anSao';
import TuViForm from '@/components/TuViForm';
import LaSoBanCo from '@/components/LaSoBanCo';
import LuanGiaiAI from '@/components/LuanGiaiAI';
import ChatThayTon from '@/components/ChatThayTon';
import AuthModal from '@/components/AuthModal';
import SavedChartsModal from '@/components/SavedChartsModal';
import PaymentModal, { PaymentPurpose } from '@/components/PaymentModal';
import UserNav from '@/components/UserNav';
import FloatingContact from '@/components/FloatingContact';
import { useAuth } from '@/context/AuthContext';
import {
  saveOrUpdateChart,
  getChartDetails,
  updateChartReading,
  saveChatMessage,
} from '@/lib/tuviService';
import { Bookmark, Check, Sparkles, Crown, PhoneCall } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  const [laSo, setLaSo] = useState<LaSoData | null>(null);
  const [currentDuongSo, setCurrentDuongSo] = useState<DuLieuDuongSo | null>(null);
  const [currentChartId, setCurrentChartId] = useState<string | null>(null);
  const [currentTier, setCurrentTier] = useState<ServiceTier>('free');

  const [readingHtml, setReadingHtml] = useState<string | undefined>(undefined);
  const [readingError, setReadingError] = useState<string | undefined>(undefined);
  const [isLoadingReading, setIsLoadingReading] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [questionsAllowed, setQuestionsAllowed] = useState<number>(0);

  // Modals & Payment
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSavedChartsModalOpen, setIsSavedChartsModalOpen] = useState(false);
  const [paymentModalConfig, setPaymentModalConfig] = useState<{
    isOpen: boolean;
    type: PaymentPurpose;
    price: number;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'reading_vip',
    price: 119000,
  });

  // Lưu trữ status
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Hàm gọi tạo bài bình giải (API Route hoặc Supabase Edge direct fallback)
  const generateReading = async (
    calculatedLaSo: LaSoData,
    duongSoData: DuLieuDuongSo,
    tier: ServiceTier
  ): Promise<string | null> => {
    const selectedModel = tier === 'pro' ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash';
    let readingResult: string | null = null;
    let lastErrMsg: string | null = null;

    // Bước 1: Gọi qua Next.js API Route
    try {
      const res = await fetch('/api/tuvi/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laSo: calculatedLaSo,
          tier,
          thongTinThem: duongSoData.thongTinThem,
          chieuCao: duongSoData.chieuCao,
          canNang: duongSoData.canNang,
          anhMat: duongSoData.anhMat,
          anhTay: duongSoData.anhTay,
          model: selectedModel,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.reading) {
          readingResult = json.reading;
        } else if (json.error) {
          lastErrMsg = json.error;
        }
      } else {
        const rawText = await res.text().catch(() => '');
        let parsedError = rawText;
        try {
          const parsed = JSON.parse(rawText);
          if (parsed.error) parsedError = parsed.error;
        } catch {
          // ignore
        }
        if (res.status === 413 || parsedError.includes('Request Entity Too Large')) {
          parsedError = 'Kích thước ảnh gửi lên quá lớn. Vui lòng chọn ảnh có dung lượng nhỏ hơn để Thầy xem tướng nhé!';
        }
        lastErrMsg = parsedError || `Lỗi máy chủ (HTTP ${res.status})`;
      }
    } catch (fetchErr) {
      console.warn('API route gặp sự cố mạng hoặc timeout, chuyển sang cổng trực tiếp Supabase Edge...', fetchErr);
    }

    // Bước 2: Fallback trực tiếp Supabase Edge Function từ trình duyệt nếu Vercel bị timeout
    if (!readingResult) {
      try {
        const { callGeminiVision, buildReadingParts } = await import('@/lib/gemini');
        const parts = buildReadingParts({
          laSo: calculatedLaSo,
          tier,
          thongTinThem: duongSoData.thongTinThem,
          chieuCao: duongSoData.chieuCao,
          canNang: duongSoData.canNang,
          anhMat: duongSoData.anhMat,
          anhTay: duongSoData.anhTay,
        });

        const directRes = await callGeminiVision(parts, undefined, selectedModel);
        if (directRes.text) {
          readingResult = directRes.text;
          lastErrMsg = null;
        } else if (directRes.error) {
          lastErrMsg = directRes.error;
        }
      } catch (directErr) {
        console.error('Lỗi cổng trực tiếp:', directErr);
        const msg = directErr instanceof Error ? directErr.message : String(directErr);
        lastErrMsg = `Không thể kết nối đến máy chủ: ${msg}`;
      }
    }

    if (!readingResult && lastErrMsg) {
      setReadingError(lastErrMsg);
    }

    return readingResult;
  };

  // Xử lý khi nộp form lập lá số mới (chọn Free hoặc Pro)
  const handleFormSubmit = async (data: DuLieuDuongSo, tier: ServiceTier) => {
    setCurrentTier(tier);

    // Tách riêng dữ liệu cơ bản của đương số (loại bỏ base64 ảnh khỏi lá số lưu trữ)
    const cleanDuongSo: DuLieuDuongSo = {
      ...data,
      tier,
      anhMat: undefined,
      anhTay: undefined,
    };

    const calculatedLaSo = lapLaSoTuVi(cleanDuongSo, 2026);
    calculatedLaSo.tier = tier;

    setLaSo(calculatedLaSo);
    setCurrentDuongSo(data);
    setCurrentChartId(null);
    setReadingHtml(undefined);
    setReadingError(undefined);
    setChatHistory([]);
    setQuestionsAllowed(tier === 'pro' ? 2 : 0);
    setIsLoadingReading(true);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    let createdChartId: string | null = null;

    // Nếu người dùng đã đăng nhập, tự động lưu lá số vào database
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

    // Gọi AI Thầy Tôn bình giải
    try {
      const readingResult = await generateReading(calculatedLaSo, data, tier);
      if (readingResult) {
        setReadingHtml(readingResult);
        if (createdChartId) {
          updateChartReading(createdChartId, readingResult);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setReadingError(`Không thể kết nối đến máy chủ: ${msg}`);
    } finally {
      setIsLoadingReading(false);
    }
  };

  // Xử lý nâng cấp lên Bản Pro Chuyên Sâu cho lá số đang xem
  const handleConfirmUpgradeToPro = async () => {
    if (!laSo || !currentDuongSo) return;

    setCurrentTier('pro');
    setQuestionsAllowed((prev) => Math.max(prev, 2));
    setIsUpgrading(true);
    setIsLoadingReading(true);
    setReadingError(undefined);

    const updatedCleanDuongSo: DuLieuDuongSo = {
      ...currentDuongSo,
      tier: 'pro',
      anhMat: undefined,
      anhTay: undefined,
    };

    const updatedLaSo = { ...laSo, tier: 'pro' as ServiceTier };
    setLaSo(updatedLaSo);

    try {
      const readingResult = await generateReading(updatedLaSo, currentDuongSo, 'pro');
      if (readingResult) {
        setReadingHtml(readingResult);
        if (currentChartId) {
          // Cập nhật cả bài bình giải và tier mới vào database
          await updateChartReading(currentChartId, readingResult);
          await saveOrUpdateChart({
            id: currentChartId,
            title: `${currentDuongSo.hoTen} (${currentDuongSo.gioiTinh} - ${currentDuongSo.namDuong})`,
            duongSoData: updatedCleanDuongSo,
            lasoData: updatedLaSo,
            readingHtml: readingResult,
          });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setReadingError(`Lỗi khi nâng cấp Bản Pro: ${msg}`);
    } finally {
      setIsLoadingReading(false);
      setIsUpgrading(false);
    }
  };

  // Mở modal thanh toán nâng cấp Bản Pro
  const openUpgradeModal = () => {
    setPaymentModalConfig({
      isOpen: true,
      type: 'reading_vip',
      price: 119000,
      onConfirm: () => {
        handleConfirmUpgradeToPro();
      },
    });
  };

  // Mở modal thanh toán thỉnh giáo Thầy Tôn (hỏi đáp)
  const handleUnlockQuestions = () => {
    if (currentTier === 'pro') {
      setPaymentModalConfig({
        isOpen: true,
        type: 'chat_vip',
        price: 99000,
        onConfirm: () => {
          setQuestionsAllowed((prev) => prev + 2);
        },
      });
    } else {
      setPaymentModalConfig({
        isOpen: true,
        type: 'chat_free',
        price: 49000,
        onConfirm: () => {
          setQuestionsAllowed((prev) => prev + 2);
        },
      });
    }
  };

  // Xử lý gửi tin nhắn hỏi đáp với Thầy Tôn
  const handleSendMessage = async (userQuestion: string) => {
    if (!laSo) return;
    setIsLoadingChat(true);

    try {
      const selectedModel = currentTier === 'pro' ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash';
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
          model: selectedModel,
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

      const detectedTier: ServiceTier =
        chart.duong_so_data?.tier ||
        chart.laso_data?.tier ||
        (chart.reading_html?.includes('Bản Pro') || chart.reading_html?.includes('CHUYÊN SÂU PRO')
          ? 'pro'
          : 'free');

      setCurrentTier(detectedTier);
      setLaSo(chart.laso_data);
      setCurrentDuongSo(chart.duong_so_data);
      setCurrentChartId(chart.id);
      setReadingHtml(chart.reading_html || undefined);
      setReadingError(undefined);
      setChatHistory(chatMessages || []);
      const msgCount = (chatMessages || []).filter((c) => !c.isError).length;
      if (detectedTier === 'pro') {
        setQuestionsAllowed(Math.max(2, msgCount));
      } else {
        setQuestionsAllowed(msgCount);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      alert('Lỗi tải dữ liệu lá số: ' + e.message);
    } finally {
      setIsLoadingReading(false);
    }
  };

  // Nút bấm lưu lá số thủ công
  const handleManualSave = async () => {
    if (!laSo || !currentDuongSo) return;
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsSaving(true);
    const cleanDuongSo: DuLieuDuongSo = {
      ...currentDuongSo,
      tier: currentTier,
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
    setCurrentTier('free');
    setQuestionsAllowed(0);
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

              {/* Huy hiệu gói dịch vụ & Nút Nâng cấp Pro */}
              <div className="flex items-center gap-2">
                {currentTier === 'pro' ? (
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-sm">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bản Chuyên Sâu Pro</span>
                  </span>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/90 border border-slate-700 text-slate-300">
                      <span>📜 Bản Miễn Phí</span>
                    </span>
                    <button
                      type="button"
                      onClick={openUpgradeModal}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                      <span>⚡ Nâng Cấp Pro (119.000đ)</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bàn Cờ Lá Số Tử Vi */}
            <LaSoBanCo laSo={laSo} onReset={handleReset} />

            {/* Bài Bình Giải Chuyên Sâu */}
            <LuanGiaiAI
              readingHtml={readingHtml}
              isLoading={isLoadingReading}
              error={readingError}
              tier={currentTier}
              onUpgrade={openUpgradeModal}
              isUpgrading={isUpgrading}
            />

            {/* Khung Hỏi Đáp Trực Tiếp Với Thầy Tôn */}
            <ChatThayTon
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChat}
              tier={currentTier}
              questionsAllowed={questionsAllowed}
              onUnlockQuestions={handleUnlockQuestions}
            />
          </div>
        )}
      </div>

      {/* Modal Thanh Toán Đa Mục Đích */}
      <PaymentModal
        isOpen={paymentModalConfig.isOpen}
        onClose={() => setPaymentModalConfig((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={() => {
          if (paymentModalConfig.onConfirm) {
            paymentModalConfig.onConfirm();
          }
          setPaymentModalConfig((prev) => ({ ...prev, isOpen: false }));
        }}
        hoTen={currentDuongSo?.hoTen || 'Đương số'}
        paymentType={paymentModalConfig.type}
        price={paymentModalConfig.price}
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
        onUpgradeChart={(chartId) => {
          handleSelectSavedChart(chartId);
          openUpgradeModal();
        }}
        activeChartId={currentChartId}
      />

      {/* Nút Liên Hệ Nhanh (Zalo & Gọi Điện Đặt Lịch Offline) */}
      <FloatingContact />

      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-800/60 print:hidden mt-8 space-y-2.5">
        <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap text-slate-300 font-medium text-xs sm:text-sm">
          <a
            href="tel:0935058688"
            className="hover:text-amber-300 transition inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-amber-500/30 rounded-xl"
            title="Gọi điện trực tiếp đặt lịch xem offline"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
            <span>Đặt lịch xem offline: <strong className="text-amber-400 font-bold">0935.058.688</strong></span>
          </a>

          <a
            href="https://zalo.me/0935058688"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-300 transition inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-blue-500/30 rounded-xl"
            title="Nhắn Zalo Thầy Tôn (0935.058.688)"
          >
            <span className="w-4 h-4 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-[9px] font-black">Z</span>
            <span>Zalo Thầy Tôn: <strong className="text-blue-400 font-bold">0935.058.688</strong></span>
          </a>
        </div>
        <p className="text-slate-500 text-[11px] sm:text-xs">
          © {new Date().getFullYear()} Tử Vi Thầy Tôn. Kế thừa tinh hoa Dịch học &amp; Cổ thuật ngàn năm — Soi sáng căn duyên, hanh thông bản mệnh.
        </p>
      </footer>
    </main>
  );
}
