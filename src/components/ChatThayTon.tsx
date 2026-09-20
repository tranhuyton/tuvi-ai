'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ServiceTier } from '@/types/tuvi';
import { MessageSquare, Send, Crown, Sparkles, Lock, CheckCircle2 } from 'lucide-react';

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
  const isPro = tier === 'pro';
  const askedCount = chatHistory.filter((c) => !c.isError).length;

  // Giới hạn lượt hỏi được phép
  const [allowedLimit, setAllowedLimit] = useState<number>(questionsAllowed);

  // 4 Trạng thái của luồng hỏi đáp:
  // 1. 'unpaid': Chưa thanh toán -> Có nút màu VÀNG 49.000đ (ô nhập câu hỏi chưa mở)
  // 2. 'paid_success': Đã thanh toán -> Nút màu vàng mất đi, hiện NÚT MÀU XANH "Chuyển khoản thành công"
  // 3. 'chatting': Đã bấm nút xanh -> Mở ô nhập câu hỏi (tối đa 2 câu)
  // 4. 'exhausted': Đã hỏi xong 2 câu -> Hiện prompt nút màu VÀNG để thanh toán xem tiếp
  const [flowStep, setFlowStep] = useState<'unpaid' | 'paid_success' | 'chatting' | 'exhausted'>(() => {
    if (questionsAllowed > 0) {
      if (askedCount >= questionsAllowed) return 'exhausted';
      if (askedCount > 0) return 'chatting';
      return 'paid_success';
    }
    return 'unpaid';
  });

  const prevAllowedRef = useRef(questionsAllowed);

  // Lắng nghe khi questionsAllowed tăng từ bên ngoài (ví dụ sau khi quét mã QR thanh toán thành công)
  useEffect(() => {
    if (questionsAllowed > prevAllowedRef.current) {
      setAllowedLimit(questionsAllowed);
      // Nút vàng thanh toán mất đi, hiện lên nút xanh chuyển khoản thành công
      setFlowStep('paid_success');
    } else if (questionsAllowed > 0 && allowedLimit === 0) {
      setAllowedLimit(questionsAllowed);
    }
    prevAllowedRef.current = questionsAllowed;
  }, [questionsAllowed, allowedLimit]);

  // Khi khách hỏi xong 2 câu (askedCount >= allowedLimit) -> Chuyển sang exhausted
  useEffect(() => {
    const currentAsked = chatHistory.filter((c) => !c.isError).length;
    const currentLimit = allowedLimit > 0 ? allowedLimit : (questionsAllowed > 0 ? questionsAllowed : 2);
    if (flowStep === 'chatting' && currentAsked >= currentLimit) {
      setFlowStep('exhausted');
    }
  }, [chatHistory, allowedLimit, questionsAllowed, flowStep]);

  // Xử lý gửi câu hỏi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading || flowStep !== 'chatting') return;

    const q = question.trim();
    setQuestion('');
    await onSendMessage(q);
  };

  // Khách bấm vào NÚT MÀU XANH để mở ô hỏi
  const handleOpenChat = () => {
    const newLimit = Math.max(allowedLimit, askedCount + 2);
    setAllowedLimit(newLimit);
    setFlowStep('chatting');
  };

  const remainingQuestions = Math.max(0, (allowedLimit > 0 ? allowedLimit : 2) - askedCount);

  return (
    <div className="w-full max-w-[1060px] mx-auto mt-10 mb-16 print:hidden">
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md text-slate-100">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base sm:text-lg text-blue-400 font-serif flex items-center gap-2">
                <span>Hỏi Đáp Luận Giải Cùng AI Thầy Tôn</span>
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
              <p className="text-[11px] text-slate-400 mt-0.5">
                Trí tuệ nhân tạo kế thừa tri thức &amp; pháp số Tử Vi Đẩu Số bí truyền từ Thầy Tôn
              </p>
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
                ? 'Phí đàm đạo VIP: 99.000đ / 2 câu'
                : 'Phí thỉnh giáo: 49.000đ / 2 câu'}
            </div>

            <div className="text-xs px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
              {flowStep === 'unpaid' ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Chưa mở khóa
                </span>
              ) : flowStep === 'paid_success' ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Đã thanh toán (02 lượt)
                </span>
              ) : flowStep === 'exhausted' ? (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Hết lượt hỏi (0/2)
                </span>
              ) : (
                <span>
                  Lượt hỏi còn lại: <span className="font-bold text-emerald-400">{remainingQuestions}</span> / 2
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lịch sử tin nhắn */}
        <div className="space-y-4 mb-5 max-h-[500px] overflow-y-auto pr-1">
          {chatHistory.length === 0 && flowStep === 'chatting' && (
            <p className="text-sm text-slate-400 italic text-center py-4">
              Quý khách có {remainingQuestions} lượt thỉnh giáo. Hãy nhập câu hỏi cụ thể về công danh, tài lộc, tình duyên hoặc gia đạo để AI Thầy Tôn giải đáp.
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
                  <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <span>🧙‍♂️ AI Thầy Tôn:</span>
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
                <span>AI Thầy Tôn đang xem thiên cơ và biên lời giải đáp...</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================== */}
        {/* KHU VỰC TƯƠNG TÁC / THANH TOÁN THEO 4 TRẠNG THÁI */}
        {/* ========================================================== */}

        {/* 1. CHƯA THANH TOÁN: CÓ NÚT MÀU VÀNG THANH TOÁN 49.000đ (CHƯA MỞ Ô HỎI) */}
        {flowStep === 'unpaid' && (
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-5 sm:p-6 text-center space-y-3 shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg text-amber-300 font-serif">
                Thỉnh Giáo Luận Giải Cùng AI Thầy Tôn
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                Hệ thống AI soi chiếu lá số giúp giải khai khúc mắc cụ thể về công việc, tiền tài, nhân duyên hay vận hạn (gồm 02 câu hỏi).
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center gap-2.5">
              {/* NÚT MÀU VÀNG THANH TOÁN */}
              <button
                type="button"
                onClick={onUnlockQuestions}
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>⚡ Quét Mã Thanh Toán ({isPro ? '99.000đ' : '49.000đ'} / 2 câu hỏi)</span>
              </button>

              {/* Nút xác nhận chuyển khoản bên ngoài */}
              <button
                type="button"
                onClick={() => setFlowStep('paid_success')}
                className="text-xs text-slate-400 hover:text-emerald-400 transition cursor-pointer"
              >
                Đã chuyển khoản xong? <span className="underline text-emerald-400 font-semibold">Bấm vào đây để xác nhận</span>
              </button>
            </div>
          </div>
        )}

        {/* 2. ĐÃ THANH TOÁN: Ô VÀNG MẤT ĐI, HIỆN LÊN NÚT MÀU XANH ĐÃ CHUYỂN KHOẢN THÀNH CÔNG */}
        {flowStep === 'paid_success' && (
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-5 sm:p-6 text-center space-y-3 shadow-xl animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base sm:text-lg text-emerald-300 font-serif">
                Chuyển Khoản Thành Công!
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                Hệ thống đã ghi nhận thanh toán. Quý khách có 02 câu hỏi đàm đạo trực tiếp cùng AI Thầy Tôn.
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center">
              {/* NÚT MÀU XANH LÁ: BẤM VÀO ĐÂY ĐỂ MỞ Ô HỎI */}
              <button
                type="button"
                onClick={handleOpenChat}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>✅ Chuyển Khoản Thành Công - Bấm Vào Đây Để Mở Ô Hỏi</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. ĐANG HỎI: Ô NHẬP CÂU HỎI ĐÃ MỞ RA (TỐI ĐA 2 CÂU) */}
        {flowStep === 'chatting' && (
          <form onSubmit={handleSubmit} className="flex gap-2 animate-fade-in">
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
        )}

        {/* 4. ĐÃ HỎI XONG 2 CÂU: Ô HỎI ĐÓNG LẠI, HIỆN PROMPT VỚI NÚT MÀU VÀNG THANH TOÁN TIẾP */}
        {flowStep === 'exhausted' && (
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
                  ? 'Quý khách đã sử dụng hết 02 lượt đàm đạo chuyên sâu. Để Thầy Tôn tiếp tục soi chiếu các phương diện khác, quý khách có thể thanh toán tiếp để nhận thêm 02 câu hỏi chuyên sâu mới.'
                  : 'Quý khách đã sử dụng hết 02 lượt thỉnh giáo. Quý khách có thể thanh toán tiếp để nhận thêm 02 câu hỏi mới giúp Thầy Tôn phân tích chi tiết hơn.'}
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {/* NÚT MÀU VÀNG THANH TOÁN TIẾP */}
              <button
                type="button"
                onClick={onUnlockQuestions}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                {isPro ? (
                  <>
                    <Crown className="w-4 h-4" />
                    <span>⚡ Thanh Toán Tiếp (99.000đ / 2 câu chuyên sâu)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>⚡ Thanh Toán Tiếp (49.000đ / 2 câu hỏi)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFlowStep('paid_success')}
                className="text-xs text-slate-400 hover:text-emerald-400 transition cursor-pointer"
              >
                Đã chuyển khoản thêm? <span className="underline text-emerald-400 font-semibold">Bấm vào đây để xác nhận</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
