'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ServiceTier, QuestionsQuota } from '@/types/tuvi';
import { MessageSquare, Send, Crown, Sparkles, Lock, CheckCircle2, BookOpen } from 'lucide-react';

interface ChatThayTonProps {
  chatHistory: ChatMessage[];
  onSendMessage: (question: string, mode: 'basic' | 'vip') => Promise<void>;
  isLoading: boolean;
  tier?: ServiceTier;
  quota?: QuestionsQuota;
  questionsAllowed?: number; // fallback backward compatible
  onUnlockQuestions: () => void;
  onUpgradeToPro?: () => void;
}

export default function ChatThayTon({
  chatHistory,
  onSendMessage,
  isLoading,
  tier = 'free',
  quota,
  questionsAllowed = 0,
  onUnlockQuestions,
  onUpgradeToPro,
}: ChatThayTonProps) {
  const [question, setQuestion] = useState('');
  const isPro = tier === 'pro';

  // 1. Phân loại lượt hỏi được cấp:
  const rawBasicAllowed = quota !== undefined ? quota.basicAllowed : (!isPro ? questionsAllowed : 0);
  const proAllowed = quota !== undefined ? quota.proAllowed : (isPro ? (questionsAllowed > 0 ? questionsAllowed : 2) : 0);

  // 2. Tính số lượng câu hỏi đã dùng theo từng loại:
  const validMessages = chatHistory.filter((c) => !c.isError);
  const explicitProAsked = validMessages.filter((c) => c.type === 'vip').length;
  const explicitBasicAsked = validMessages.filter((c) => c.type === 'basic').length;
  const untypedMessages = validMessages.filter((c) => !c.type).length;

  // Tin nhắn cũ/chưa gắn nhãn (untyped) 100% thuộc lượt Cơ Bản, TUYỆT ĐỐI không trừ vào lượt Chuyên Sâu của khách!
  const basicAsked = explicitBasicAsked + untypedMessages;
  const basicAllowed = Math.max(rawBasicAllowed, basicAsked);
  const proAsked = explicitProAsked;

  const basicRemaining = Math.max(0, basicAllowed - basicAsked);
  const proRemaining = Math.max(0, proAllowed - proAsked);
  const totalRemaining = basicRemaining + proRemaining;
  const totalAllowed = basicAllowed + proAllowed;

  // 3. Chế độ câu hỏi đang chọn (mặc định ưu tiên VIP Pro nếu còn):
  const [selectedMode, setSelectedMode] = useState<'basic' | 'vip'>(() => {
    if (proRemaining > 0) return 'vip';
    return 'basic';
  });

  // Tự động chuyển mode nếu loại hiện tại hết lượt
  useEffect(() => {
    if (proRemaining > 0 && selectedMode === 'basic' && basicRemaining === 0) {
      setSelectedMode('vip');
    } else if (basicRemaining > 0 && selectedMode === 'vip' && proRemaining === 0) {
      setSelectedMode('basic');
    }
  }, [proRemaining, basicRemaining, selectedMode]);

  // 4. Trạng thái giao diện luồng hỏi đáp:
  const [flowStep, setFlowStep] = useState<'unpaid' | 'paid_success' | 'chatting' | 'exhausted'>(() => {
    if (totalAllowed === 0) return 'unpaid';
    if (totalRemaining === 0) return 'exhausted';
    if (validMessages.length > 0) return 'chatting';
    return 'paid_success';
  });

  const prevRemainingRef = useRef(totalRemaining);
  const prevAllowedRef = useRef(totalAllowed);

  // Lắng nghe khi được cộng thêm lượt hỏi mới
  useEffect(() => {
    if (totalAllowed > prevAllowedRef.current || totalRemaining > prevRemainingRef.current) {
      if (totalRemaining > 0) {
        if (validMessages.length === 0) {
          setFlowStep('paid_success');
        } else {
          setFlowStep('chatting');
        }
      }
    } else if (totalRemaining === 0 && totalAllowed > 0 && flowStep === 'chatting') {
      setFlowStep('exhausted');
    }
    prevRemainingRef.current = totalRemaining;
    prevAllowedRef.current = totalAllowed;
  }, [totalAllowed, totalRemaining, validMessages.length, flowStep]);

  // Xử lý gửi câu hỏi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading || flowStep !== 'chatting') return;

    // Chọn mode gửi: nếu mode đang chọn đã hết, dùng mode còn lại
    let modeToUse = selectedMode;
    if (modeToUse === 'vip' && proRemaining <= 0 && basicRemaining > 0) {
      modeToUse = 'basic';
    } else if (modeToUse === 'basic' && basicRemaining <= 0 && proRemaining > 0) {
      modeToUse = 'vip';
    }

    const q = question.trim();
    setQuestion('');
    await onSendMessage(q, modeToUse);
  };

  // Khách bấm vào NÚT MÀU XANH để mở ô hỏi
  const handleOpenChat = () => {
    setFlowStep('chatting');
  };

  return (
    <div className="w-full max-w-[1060px] mx-auto mt-10 mb-16 print:hidden">
      <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl backdrop-blur-md text-slate-100">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400 shrink-0" />
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-blue-400 font-serif flex items-center gap-2 flex-wrap">
                <span>Hỏi Đáp Luận Giải Cùng AI Thầy Tôn</span>
                {isPro ? (
                  <span className="text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-sans font-semibold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Khách VIP Pro</span>
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-sans">
                    📜 Bản Cơ Bản
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Trí tuệ nhân tạo kế thừa tri thức &amp; pháp số Tử Vi Đẩu Số bí truyền từ Thầy Tôn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Huy hiệu hiển thị chi tiết số lượt theo từng loại */}
            {flowStep === 'unpaid' ? (
              <div className="text-xs sm:text-sm px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Chưa mở khóa</span>
              </div>
            ) : flowStep === 'exhausted' ? (
              <div className="text-xs sm:text-sm px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Đã dùng hết ({totalAllowed}/{totalAllowed} lượt)</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Lượt Chuyên Sâu */}
                {proAllowed > 0 && (
                  <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Chuyên Sâu: {proRemaining}/{proAllowed}</span>
                  </span>
                )}
                {/* Lượt Cơ Bản */}
                {basicAllowed > 0 && (
                  <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-medium flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>Cơ Bản: {basicRemaining}/{basicAllowed}</span>
                  </span>
                )}
                {/* Tổng lượt */}
                <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                  Tổng: <b className="text-emerald-400 font-bold">{totalRemaining}</b> lượt
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Lịch sử tin nhắn */}
        <div className="space-y-4 mb-5 max-h-[500px] overflow-y-auto pr-1">
          {chatHistory.length === 0 && flowStep === 'chatting' && (
            <div className="text-center py-6 space-y-1.5">
              <p className="text-base text-slate-200 font-medium">
                Quý khách đang có <b className="text-emerald-400 font-bold">{totalRemaining}</b> lượt thỉnh giáo cùng AI Thầy Tôn.
              </p>
              <p className="text-sm text-slate-300 italic max-w-md mx-auto leading-relaxed">
                Hãy nhập câu hỏi chi tiết về công danh, sự nghiệp, tài lộc, tình duyên hoặc hạn vận để Thầy Tôn soi chiếu lá số.
              </p>
            </div>
          )}

          {chatHistory.map((item, idx) => (
            <div key={idx} className="space-y-3">
              {/* Khách hỏi */}
              <div className="flex justify-end">
                <div className="max-w-[90%] sm:max-w-[75%] bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-base sm:text-base shadow-md">
                  <div className="text-xs sm:text-sm font-semibold text-blue-200 mb-1 flex items-center justify-between gap-2">
                    <span>Khách hỏi:</span>
                    {item.type === 'vip' ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/40">
                        ⭐ Chuyên Sâu
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-400/20 text-blue-200 font-medium border border-blue-400/30">
                        📜 Cơ Bản
                      </span>
                    )}
                  </div>
                  <div>{item.q}</div>
                </div>
              </div>

              {/* Thầy Tôn trả lời */}
              <div className="flex justify-start">
                <div
                  className={`max-w-[95%] sm:max-w-[85%] rounded-2xl rounded-tl-none px-5 py-4 text-base sm:text-base leading-relaxed sm:leading-loose shadow-md ${
                    item.isError
                      ? 'bg-red-950/80 border border-red-500/50 text-red-200'
                      : item.type === 'vip'
                      ? 'bg-slate-100 text-slate-900 border-2 border-amber-400/70 shadow-amber-500/10'
                      : 'bg-slate-100 text-slate-900 border border-slate-200'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-wider mb-2 flex items-center justify-between gap-2 border-b border-slate-200/80 pb-1.5">
                    <span className="flex items-center gap-1 text-amber-800">
                      <span>🧙‍♂️ AI Thầy Tôn:</span>
                    </span>
                    {item.type === 'vip' ? (
                      <span className="text-xs normal-case font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-700" />
                        <span>Chuyên Sâu</span>
                      </span>
                    ) : (
                      <span className="text-xs normal-case font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        Cơ Bản
                      </span>
                    )}
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
              <div className="bg-slate-800 text-slate-300 rounded-2xl rounded-tl-none px-4 py-3 text-sm sm:text-base flex items-center gap-2.5 border border-slate-700 shadow-lg">
                <div className="w-4 h-4 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin shrink-0" />
                <span>AI Thầy Tôn đang xem thiên cơ và biên lời giải đáp...</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================== */}
        {/* KHU VỰC TƯƠNG TÁC / THANH TOÁN THEO 4 TRẠNG THÁI */}
        {/* ========================================================== */}

        {/* 1. CHƯA THANH TOÁN: CÓ NÚT MÀU VÀNG THANH TOÁN 49.000đ */}
        {flowStep === 'unpaid' && (
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-5 sm:p-6 text-center space-y-3 shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg sm:text-xl text-amber-300 font-serif">
                Thỉnh Giáo Luận Giải Cùng AI Thầy Tôn
              </h4>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                Hệ thống AI soi chiếu lá số giúp giải khai khúc mắc cụ thể về công việc, tiền tài, nhân duyên hay vận hạn (gồm 02 câu hỏi).
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center">
              <button
                type="button"
                onClick={onUnlockQuestions}
                className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>⚡ Quét Mã Thanh Toán ({isPro ? '99.000đ' : '49.000đ'} / 2 câu hỏi)</span>
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
              <h4 className="font-bold text-lg sm:text-xl text-emerald-300 font-serif">
                {proAllowed > 0 && isPro ? 'Khai Mở Đàm Đạo Cùng Thầy Tôn!' : 'Chuyển Khoản Thành Công!'}
              </h4>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                {proRemaining > 0 && basicRemaining > 0 ? (
                  <>
                    Hệ thống đã kích hoạt tổng cộng <b className="text-emerald-400 font-bold">{totalRemaining} lượt đàm đạo</b>: gồm{' '}
                    <span className="text-amber-300 font-bold">{proRemaining} lượt Chuyên Sâu</span> và{' '}
                    <span className="text-blue-300 font-bold">{basicRemaining} lượt Cơ Bản</span>.
                  </>
                ) : proRemaining > 0 ? (
                  <>
                    Hệ thống đã kích hoạt <b className="text-amber-300 font-bold">{proRemaining} câu hỏi Chuyên Sâu</b> trực tiếp cùng AI Thầy Tôn theo gói quyền lợi của bạn.
                  </>
                ) : (
                  <>
                    Hệ thống đã ghi nhận thanh toán. Quý khách có <b className="text-emerald-400 font-bold">{basicRemaining} câu hỏi Cơ Bản</b> trực tiếp cùng AI Thầy Tôn.
                  </>
                )}
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center">
              <button
                type="button"
                onClick={handleOpenChat}
                className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-emerald-500/30 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>✅ Bấm Vào Đây Để Mở Ô Hỏi ({totalRemaining} câu còn lại)</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. ĐANG HỎI: Ô NHẬP CÂU HỎI ĐÃ MỞ RA (CÓ BỘ CHUYỂN MODE NẾU CÓ CẢ 2 LOẠI) */}
        {flowStep === 'chatting' && (
          <div className="space-y-3 animate-fade-in">
            {/* BỘ CHUYỂN ĐỔI CHẾ ĐỘ CÂU HỎI (LUÔN HIỂN THỊ TRỰC QUAN ĐẦY ĐỦ CẢ 2 NÚT) */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-xs text-slate-300 font-medium">Chế độ hỏi:</span>
                <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                  {/* Nút Chuyên Sâu */}
                  <button
                    type="button"
                    onClick={() => proRemaining > 0 && setSelectedMode('vip')}
                    disabled={proRemaining <= 0}
                    className={`px-3.5 py-2 rounded-md text-sm sm:text-xs font-semibold transition flex items-center gap-1.5 ${
                      selectedMode === 'vip' && proRemaining > 0
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer'
                        : proRemaining > 0
                        ? 'text-slate-300 hover:text-slate-100 cursor-pointer'
                        : 'text-slate-600 cursor-not-allowed opacity-40'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Chuyên Sâu ({proRemaining} câu)</span>
                  </button>

                  {/* Nút Cơ Bản */}
                  <button
                    type="button"
                    onClick={() => basicRemaining > 0 && setSelectedMode('basic')}
                    disabled={basicRemaining <= 0}
                    className={`px-3.5 py-2 rounded-md text-sm sm:text-xs font-semibold transition flex items-center gap-1.5 ${
                      selectedMode === 'basic' && basicRemaining > 0
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 cursor-pointer'
                        : basicRemaining > 0
                        ? 'text-slate-300 hover:text-slate-100 cursor-pointer'
                        : 'text-slate-600 cursor-not-allowed opacity-40'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Cơ Bản ({basicRemaining} câu)</span>
                  </button>
                </div>
              </div>

              {/* Nhãn trạng thái bên phải */}
              <div className="text-xs sm:text-[11px] text-slate-300 px-1 flex items-center gap-1.5">
                {selectedMode === 'vip' ? (
                  <span className="text-amber-300 font-medium">Đang chọn: <b>Chuyên Sâu</b></span>
                ) : (
                  <span className="text-blue-300 font-medium">Đang chọn: <b>Cơ Bản</b></span>
                )}
                {basicRemaining === 0 && proRemaining > 0 && (
                  <span className="text-slate-500">(Cơ bản: 0 câu)</span>
                )}
                {proRemaining === 0 && basicRemaining > 0 && (
                  <span className="text-slate-500">(Chuyên sâu: 0 câu)</span>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                required
                disabled={isLoading}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={
                  selectedMode === 'vip'
                    ? 'Nhập câu hỏi chuyên sâu...'
                    : 'Nhập câu hỏi cơ bản...'
                }
                className="flex-grow px-4 py-3.5 bg-slate-950/70 border border-slate-700 rounded-xl text-slate-100 text-base sm:text-base focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className={`px-5 py-3.5 font-bold rounded-xl text-base sm:text-base transition disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1.5 shadow-lg shrink-0 cursor-pointer ${
                  selectedMode === 'vip'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Gửi Thầy</span>
              </button>
            </form>
          </div>
        )}

        {/* 4. ĐÃ HỎI XONG TẤT CẢ CÁC CÂU: Ô HỎI ĐÓNG LẠI, HIỆN PROMPT VỚI NÚT THANH TOÁN TIẾP */}
        {flowStep === 'exhausted' && (
          <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-5 sm:p-6 text-center space-y-3 shadow-xl animate-fade-in">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-lg sm:text-xl text-amber-300 font-serif">
                Quý khách có muốn thỉnh giáo thêm câu hỏi không?
              </h4>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                {isPro
                  ? `Quý khách đã sử dụng hết toàn bộ ${totalAllowed} lượt câu hỏi. Quý khách có thể gia hạn thêm 02 câu hỏi chuyên sâu.`
                  : `Quý khách đã sử dụng hết toàn bộ ${totalAllowed} lượt câu hỏi. Quý khách có thể mua thêm câu hỏi cơ bản hoặc nâng cấp lên Bản Pro.`}
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isPro ? (
                <button
                  type="button"
                  onClick={onUnlockQuestions}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Crown className="w-4 h-4" />
                  <span>⚡ Thanh Toán Tiếp (99.000đ / 2 câu chuyên sâu)</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onUnlockQuestions}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm sm:text-base border border-slate-600 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>⚡ Mua Thêm 2 Câu Cơ Bản (49.000đ)</span>
                  </button>

                  {onUpgradeToPro && (
                    <button
                      type="button"
                      onClick={onUpgradeToPro}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Crown className="w-4 h-4" />
                      <span>👑 Nâng Cấp Luận Giải Pro (119.000đ - Tặng 2 câu chuyên sâu)</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
