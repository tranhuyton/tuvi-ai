'use client';

import React, { useState, useEffect } from 'react';
import { DuLieuDuongSo, LaSoData, ChatMessage } from '@/types/tuvi';
import { lapLaSoTuVi } from '@/lib/tuvi/anSao';
import TuViForm from '@/components/TuViForm';
import LaSoBanCo from '@/components/LaSoBanCo';
import LuanGiaiAI from '@/components/LuanGiaiAI';
import ChatThayTon from '@/components/ChatThayTon';
import ApiKeyModal from '@/components/ApiKeyModal';
import { Key } from 'lucide-react';

export default function HomePage() {
  const [laSo, setLaSo] = useState<LaSoData | null>(null);
  const [readingHtml, setReadingHtml] = useState<string | undefined>(undefined);
  const [readingError, setReadingError] = useState<string | undefined>(undefined);
  const [isLoadingReading, setIsLoadingReading] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const [customApiKey, setCustomApiKey] = useState('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('user_gemini_api_key') || '';
      setCustomApiKey(savedKey);
    }
  }, []);

  const handleFormSubmit = async (data: DuLieuDuongSo) => {
    // 1. Tính toán lá số ngay tức khắc
    const calculatedLaSo = lapLaSoTuVi(data, 2026);
    setLaSo(calculatedLaSo);
    setReadingHtml(undefined);
    setReadingError(undefined);
    setChatHistory([]);
    setIsLoadingReading(true);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 2. Gọi API để AI Thầy Tôn bình giải chuyên sâu kết hợp tướng pháp
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

      const json = await res.json();
      if (!res.ok || json.error) {
        setReadingError(json.error || 'Có lỗi xảy ra khi kết nối tới Thầy Tôn');
      } else {
        setReadingHtml(json.reading);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setReadingError(`Không thể kết nối đến máy chủ: ${msg}`);
    } finally {
      setIsLoadingReading(false);
    }
  };

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

      const json = await res.json();
      if (!res.ok || json.error) {
        setChatHistory((prev) => [
          ...prev,
          {
            q: userQuestion,
            a: json.error || 'Thầy đang bận, xin quý khách thử lại sau ít phút.',
            isError: true,
          },
        ]);
      } else {
        setChatHistory((prev) => [
          ...prev,
          {
            q: userQuestion,
            a: json.answer,
          },
        ]);
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

  const handleReset = () => {
    setLaSo(null);
    setReadingHtml(undefined);
    setReadingError(undefined);
    setChatHistory([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen cosmic-bg py-8 px-3 sm:px-6 md:px-8 flex flex-col justify-between relative">
      <div className="flex-1">
        {!laSo ? (
          <div className="my-auto py-6 sm:py-12">
            <TuViForm
              onSubmit={handleFormSubmit}
              isLoading={isLoadingReading}
              onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
              hasCustomKey={!!customApiKey}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end max-w-[1060px] mx-auto">
              <button
                type="button"
                onClick={() => setIsApiKeyModalOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  customApiKey
                    ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 hover:bg-amber-500/30'
                    : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                }`}
                title="Cài đặt và kiểm tra Gemini API Key"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>{customApiKey ? 'API Key riêng: Bật' : '⚙️ Cài đặt API Key'}</span>
              </button>
            </div>
            <LaSoBanCo laSo={laSo} onReset={handleReset} />
            <LuanGiaiAI
              readingHtml={readingHtml}
              isLoading={isLoadingReading}
              error={readingError}
            />
            <ChatThayTon
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChat}
              maxQuestions={2}
            />
          </div>
        )}
      </div>

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(key) => setCustomApiKey(key)}
      />

      <footer className="text-center text-xs text-slate-500 py-6 border-t border-slate-800/60 print:hidden mt-8">
        <p>© {new Date().getFullYear()} Tử Vi Thầy Tôn AI. Hệ thống phát triển độc lập trên Next.js &amp; Gemini AI.</p>
      </footer>
    </main>
  );
}
