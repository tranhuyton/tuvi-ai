'use client';

import React, { useState } from 'react';
import { ChatMessage, ServiceTier } from '@/types/tuvi';
import { MessageSquare, Send, Crown, Sparkles, Lock } from 'lucide-react';

interface ChatThayTonProps {
  chatHistory: ChatMessage[];
  onSendMessage: (question: string) => Promise<void>;
  isLoading: boolean;
  tier?: ServiceTier;
  questionsAllowed?: number;
  onUnlockQuestions: () => void;
}

export default function ChatThayTon({
  chatHistory,
  onSendMessage,
  isLoading,
  tier = 'free',
  questionsAllowed = 0,
  onUnlockQuestions,
}: ChatThayTonProps) {
  const [question, setQuestion] = useState('');
  const count = chatHistory.filter((c) => !c.isError).length;
  const isPro = tier === 'pro';

  const isLocked = questionsAllowed === 0;
  const isExhausted = count >= questionsAllowed && questionsAllowed > 0;
  const canAsk = count < questionsAllowed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading || !canAsk) return;

    const q = question.trim();
    setQuestion('');
    await onSendMessage(q);
  };

  return (
    <div className="w-full max-w-[1060px] mx-auto mt-10 mb-16 print:hidden">
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md text-slate-100">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base sm:text-lg text-blue-400 font-serif flex items-center gap-2">
                <span>Hỏi Đáp Trực Tiếp Với Thầy Tôn</span>
                {isPro ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-sans font-semibold">
                    👑 Khách VIP Pro
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-sans">
                    📜 Bản Cơ Bản
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div
              className={`text-xs px-3 py-1 rounded-full border font-medium ${
                isPro
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              }`}
            >
              {isPro
                ? 'Hỏi thêm chuyên sâu: 99.000đ / 2 câu'
                : 'Phí thỉnh giáo: 49.000đ / 2 câu'}
            </div>

            <div className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {isLocked ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Chưa mở khóa
                </span>
              ) : (
                <span>
                  Lượt hỏi: <span className="font-bold text-amber-400">{count}</span> / {questionsAllowed}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lịch sử tin nhắn */}
        <div className="space-y-4 mb-5 max-h-[500px] overflow-y-auto pr-1">
          {chatHistory.length === 0 && !isLocked && (
            <p className="text-sm text-slate-400 italic text-center py-4">
              Quý khách có {questionsAllowed} lượt thỉnh giáo. Hãy nhập câu hỏi cụ thể về công danh, tài lộc, tình duyên hoặc gia đạo để Thầy Tôn giải đáp.
            </p>
          )}

          {chatHistory.map((item, idx) => (
            <div key={idx} className="space-y-3">
              {/* Khách hỏi */}
              <div className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[75%] bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-2.5 text-sm shadow-md">
                  <div className="text-[11px] font-semibold text-blue-200 mb-0.5">Khách hỏi:</div>
                  <div>{item.q}</div>
                </div>
              </div>

              {/* Thầy Tôn trả lời */}
              <div className="flex justify-start">
                <div
                  className={`max-w-[90%] sm:max-w-[85%] rounded-2xl rounded-tl-none px-5 py-3 text-sm leading-relaxed shadow-md ${
                    item.isError
                      ? 'bg-red-950/80 border border-red-500/50 text-red-200'
                      : 'bg-slate-100 text-slate-900 border border-slate-200'
                  }`}
                >
                  <div className="text-[11px] font-bold text-red-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span>🧙‍♂️ Thầy Tôn:</span>
                  </div>
                  <div
                    className="space-y-2 text-justify"
                    dangerouslySetInnerHTML={{ __html: item.a }}
                  />
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 text-slate-300 rounded-2xl rounded-tl-none px-4 py-3 text-sm flex items-center gap-2 border border-slate-700">
                <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                <span>Thầy Tôn đang xem thiên cơ và biên lời giải đáp...</span>
              </div>
            </div>
          )}
        </div>

        {/* Khung tương tác / Thanh toán */}
        {isLocked ? (
          /* TRẠNG THÁI 1: BẢN FREE CHƯA THANH TOÁN HỎI ĐÁP */
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-5 sm:p-6 text-center space-y-3 shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg text-amber-300 font-serif">
                Thỉnh Giáo Trực Tiếp Cùng Thầy Tôn
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                Bản Miễn Phí chưa bao gồm lượt hỏi đáp. Quý khách có thể thỉnh giáo riêng Thầy Tôn để được giải khai khúc mắc cụ thể về công việc, tiền tài, nhân duyên hay vận hạn.
              </p>
            </div>
            <div className="pt-2 flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={onUnlockQuestions}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>⚡ Thanh Toán Thỉnh Giáo Thầy Tôn (49.000đ / 2 câu)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('tuvi_global_q', '2');
                    window.location.reload();
                  }
                }}
                className="text-xs text-amber-400/90 hover:text-amber-300 underline transition cursor-pointer mt-1"
              >
                Đã chuyển khoản thành công? Bấm vào đây để mở khóa ngay
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Thanh toán tự động qua mã VietQR chỉ mất vài giây
            </p>
          </div>
        ) : canAsk ? (
          /* TRẠNG THÁI 2: ĐANG CÒN LƯỢT HỎI */
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              required
              disabled={isLoading}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ví dụ: Công việc kinh doanh của tôi năm nay có thuận lợi không? Cần chú ý điều gì?"
              className="flex-grow px-4 py-3 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5 shadow-lg shadow-blue-900/30 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Gửi Thầy</span>
            </button>
          </form>
        ) : isExhausted ? (
          /* TRẠNG THÁI 3: ĐÃ HỎI XONG 2 CÂU -> HIỆN PROMPT HỎI CÓ MUỐN HỎI THÊM KHÔNG */
          <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-5 sm:p-6 text-center space-y-3 shadow-xl animate-fade-in">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg text-amber-300 font-serif">
                Quý khách có muốn thỉnh giáo thêm câu hỏi không?
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                {isPro
                  ? `Quý khách đã sử dụng hết ${questionsAllowed} lượt đàm đạo chuyên sâu. Để Thầy Tôn tiếp tục soi chiếu các phương diện khác, quý khách có thể mua thêm 02 câu hỏi chuyên sâu.`
                  : `Quý khách đã sử dụng hết ${questionsAllowed} lượt thỉnh giáo. Quý khách có thể mua thêm 02 câu hỏi để Thầy Tôn tiếp tục phân tích.`}
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={onUnlockQuestions}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5"
              >
                {isPro ? (
                  <>
                    <Crown className="w-4 h-4" />
                    <span>Thỉnh Giáo Thêm 2 Câu Chuyên Sâu (99.000đ)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Thỉnh Giáo Thêm 2 Câu (49.000đ)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
