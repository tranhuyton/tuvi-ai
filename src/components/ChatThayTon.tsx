'use client';

import React, { useState } from 'react';
import { ChatMessage, ServiceTier } from '@/types/tuvi';
import { MessageSquare, Send, CheckCircle2, Crown, Sparkles } from 'lucide-react';

interface ChatThayTonProps {
  chatHistory: ChatMessage[];
  onSendMessage: (question: string) => Promise<void>;
  isLoading: boolean;
  maxQuestions?: number;
  tier?: ServiceTier;
}

export default function ChatThayTon({
  chatHistory,
  onSendMessage,
  isLoading,
  maxQuestions = 2,
  tier = 'free',
}: ChatThayTonProps) {
  const [question, setQuestion] = useState('');
  const count = chatHistory.filter((c) => !c.isError).length;
  const isExhausted = count >= maxQuestions;
  const isPro = tier === 'pro';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading || isExhausted) return;

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
              {isPro ? 'Phí thỉnh giáo VIP: 10.000đ / câu' : 'Phí thỉnh giáo: 20.000đ / câu'}
            </div>

            <div className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              Lượt hỏi: <span className="font-bold text-amber-400">{count}</span> / {maxQuestions}
            </div>
          </div>
        </div>

        {/* Thông báo chính sách phí tượng trưng */}
        <div className="mb-4 text-xs text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between flex-wrap gap-2">
          <span>
            {isPro
              ? '✨ Quý khách sở hữu Bản Pro được hưởng đặc quyền thỉnh giáo Thầy Tôn với mức phí ưu đãi 10.000đ/câu hỏi.'
              : '💡 Bản Miễn Phí có mức phí thỉnh giáo Thầy Tôn là 20.000đ/câu hỏi. Quý khách có thể nâng cấp Bản Pro để nhận ưu đãi VIP 10.000đ/câu.'}
          </span>
        </div>

        {/* Lịch sử tin nhắn */}
        <div className="space-y-4 mb-5 max-h-[500px] overflow-y-auto pr-1">
          {chatHistory.length === 0 && (
            <p className="text-sm text-slate-400 italic text-center py-4">
              Sau khi xem bài luận, quý khách có thể thỉnh giáo thêm tối đa {maxQuestions} câu hỏi
              chi tiết về công danh, tài lộc, tình duyên hoặc gia đạo.
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
                <span>Thầy Tôn đang xem thiên cơ và gõ lời giải đáp...</span>
              </div>
            </div>
          )}
        </div>

        {/* Khung nhập câu hỏi */}
        {!isExhausted ? (
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
        ) : (
          <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-sm font-medium text-center">
            <CheckCircle2 className="w-4 h-4" />
            <span>Quý khách đã thỉnh Thầy đủ {maxQuestions} lượt cho lá số này. Chúc quý khách vạn sự hanh thông!</span>
          </div>
        )}
      </div>
    </div>
  );
}
