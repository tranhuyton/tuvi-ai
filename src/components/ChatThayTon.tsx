'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ServiceTier, QuestionsQuota } from '@/types/tuvi';
import { MessageSquare, Send, Crown, Sparkles, Lock, CheckCircle2, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ChatThayTonProps {
  chatHistory: ChatMessage[];
  onSendMessage: (question: string, mode: 'basic' | 'vip') => Promise<void>;
  isLoading: boolean;
  tier?: ServiceTier;
  quota?: QuestionsQuota;
  questionsAllowed?: number; // fallback backward compatible
  onUnlockQuestions: (mode?: 'basic' | 'vip') => void;
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
  const { t } = useLanguage();
  const [question, setQuestion] = useState('');
  const isPro = tier === 'pro';

  // 1. Phân loại hạn mức câu hỏi được cấp theo gói:
  const basicAllowed = quota !== undefined ? quota.basicAllowed : (!isPro ? questionsAllowed : 0);
  const proAllowed = quota !== undefined ? quota.proAllowed : (isPro ? (questionsAllowed > 0 ? questionsAllowed : 2) : 0);
  const totalAllowed = basicAllowed + proAllowed;

  // 2. Thống kê số lượng câu hỏi đã dùng:
  const validMessages = chatHistory.filter((c) => !c.isError);
  const totalAsked = validMessages.length;

  // Tổng số câu còn lại TUYỆT ĐỐI không bao giờ vượt quá (totalAllowed - totalAsked):
  const totalRemaining = Math.max(0, totalAllowed - totalAsked);

  // Nhận diện câu hỏi Chuyên Sâu VIP Pro vs Cơ bản (hỗ trợ tin nhắn cũ)
  const isMessageVip = (c: ChatMessage) => {
    if (c.type === 'vip') return true;
    if (c.type === 'basic') return false;
    // Nếu tin nhắn cũ chưa gắn nhãn: Trên lá số VIP Pro, mặc định là câu VIP của khách
    if (isPro) return true;
    const a = c.a || '';
    return (
      a.includes('Chuyên Sâu') ||
      a.includes('VIP Pro') ||
      a.includes('sách lược') ||
      a.includes('Tứ Hóa')
    );
  };

  // Phân bổ số câu còn lại theo từng loại:
  const proAsked = validMessages.filter((c) => isMessageVip(c)).length;
  const proRemaining = totalRemaining === 0 ? 0 : Math.min(totalRemaining, Math.max(0, proAllowed - proAsked));
  const basicRemaining = totalRemaining === 0 ? 0 : Math.max(0, totalRemaining - proRemaining);

  // 3. Chế độ câu hỏi đang chọn (mặc định ưu tiên VIP Pro nếu còn):
  const [selectedMode, setSelectedMode] = useState<'basic' | 'vip'>(() => {
    if (proRemaining > 0) return 'vip';
    return 'basic';
  });

  // Tự động chuyển mode nếu loại hiện tại hết lượt và loại kia còn lượt
  useEffect(() => {
    if (basicRemaining > 0 && selectedMode === 'vip' && proRemaining === 0) {
      setSelectedMode('basic');
    } else if (proRemaining > 0 && selectedMode === 'basic' && basicRemaining === 0) {
      setSelectedMode('vip');
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

  // Lắng nghe khi được cộng thêm lượt hỏi mới hoặc khi đã dùng hết câu hỏi
  useEffect(() => {
    if (totalAllowed > prevAllowedRef.current || totalRemaining > prevRemainingRef.current) {
      if (totalRemaining > 0) {
        if (validMessages.length === 0) {
          setFlowStep('paid_success');
        } else {
          setFlowStep('chatting');
        }
      }
    } else if (totalRemaining === 0 && totalAllowed > 0) {
      setFlowStep('exhausted');
    }
    prevRemainingRef.current = totalRemaining;
    prevAllowedRef.current = totalAllowed;
  }, [totalAllowed, totalRemaining, validMessages.length]);

  // Xử lý gửi câu hỏi
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading || flowStep !== 'chatting' || totalRemaining <= 0) return;

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
                <span>{t('chat.headerTitle', 'Hỏi Đáp Luận Giải Cùng AI Thầy Tôn')}</span>
                {isPro ? (
                  <span className="text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-sans font-semibold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('chat.vipClientBadge', 'Khách VIP Pro')}</span>
                  </span>
                ) : (
                  <span className="text-xs sm:text-sm px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-sans">
                    {t('chat.freeClientBadge', '📜 Bản Cơ Bản')}
                  </span>
                )}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {t('chat.headerDesc', 'Trí tuệ nhân tạo kế thừa tri thức & pháp số Tử Vi Đẩu Số bí truyền từ Thầy Tôn')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Huy hiệu hiển thị chi tiết số lượt theo từng loại */}
            {flowStep === 'unpaid' ? (
              <div className="text-xs sm:text-sm px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-amber-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>{t('chat.lockedBadge', 'Chưa mở khóa')}</span>
              </div>
            ) : flowStep === 'exhausted' ? (
              <div className="text-xs sm:text-sm px-3 py-1 rounded-full bg-amber-950/40 border border-amber-500/40 text-amber-400 font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>{t('chat.exhaustedBadge', `Đã dùng hết (${totalAllowed} lượt)`)}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                {/* Lượt Chuyên Sâu */}
                {proRemaining > 0 && (
                  <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-semibold flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('chat.proRemaining', `Chuyên Sâu: Còn ${proRemaining} câu`, { count: proRemaining })}</span>
                  </span>
                )}
                {/* Lượt Cơ Bản */}
                {basicRemaining > 0 && (
                  <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 font-medium flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t('chat.basicRemaining', `Cơ Bản: Còn ${basicRemaining} câu`, { count: basicRemaining })}</span>
                  </span>
                )}
                {/* Tổng lượt */}
                <span className="text-xs sm:text-sm px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                  {t('chat.totalRemaining', `Tổng: ${totalRemaining} lượt`, { count: totalRemaining })}
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
                {t('chat.introQuota', `Quý khách đang có ${totalRemaining} lượt thỉnh giáo cùng AI Thầy Tôn.`, {
                  count: totalRemaining,
                })}
              </p>
              <p className="text-sm text-slate-300 italic max-w-md mx-auto leading-relaxed">
                {t(
                  'chat.introGuide',
                  'Hãy nhập câu hỏi chi tiết về công danh, sự nghiệp, tài lộc, tình duyên hoặc hạn vận để Thầy Tôn soi chiếu lá số.'
                )}
              </p>
            </div>
          )}

          {chatHistory.map((item, idx) => (
            <div key={idx} className="space-y-3">
              {/* Khách hỏi */}
              <div className="flex justify-end">
                <div className="max-w-[90%] sm:max-w-[75%] bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-3 text-base sm:text-base shadow-md">
                  <div className="text-xs sm:text-sm font-semibold text-blue-200 mb-1 flex items-center justify-between gap-2">
                    <span>{t('chat.userPrefix', 'Khách hỏi:')}</span>
                    {isMessageVip(item) ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-semibold border border-amber-400/40">
                        ⭐ {t('chat.badgeVip', 'Chuyên Sâu')}
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-400/20 text-blue-200 font-medium border border-blue-400/30">
                        📜 {t('chat.badgeBasic', 'Cơ Bản')}
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
                      : isMessageVip(item)
                      ? 'bg-slate-100 text-slate-900 border-2 border-amber-400/70 shadow-amber-500/10'
                      : 'bg-slate-100 text-slate-900 border border-slate-200'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-bold text-amber-950 uppercase tracking-wider mb-2 flex items-center justify-between gap-2 border-b border-slate-200/80 pb-1.5">
                    <span className="flex items-center gap-1 text-amber-800">
                      <span>{t('chat.masterPrefix', '🧙‍♂️ AI Thầy Tôn:')}</span>
                    </span>
                    {isMessageVip(item) ? (
                      <span className="text-xs normal-case font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-700" />
                        <span>{t('chat.badgeVip', 'Chuyên Sâu')}</span>
                      </span>
                    ) : (
                      <span className="text-xs normal-case font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {t('chat.badgeBasic', 'Cơ Bản')}
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
                <span>{t('chat.masterThinking', 'AI Thầy Tôn đang xem thiên cơ và biên lời giải đáp...')}</span>
              </div>
            </div>
          )}
        </div>

        {/* 1. CHƯA THANH TOÁN */}
        {flowStep === 'unpaid' && (
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-5 sm:p-6 text-center space-y-3 shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg sm:text-xl text-amber-300 font-serif">
                {t('chat.unpaidTitle', 'Thỉnh Giáo Luận Giải Cùng AI Thầy Tôn')}
              </h4>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                {t(
                  'chat.unpaidDesc',
                  'Hệ thống AI soi chiếu lá số giúp giải khai khúc mắc cụ thể về công việc, tiền tài, nhân duyên hay vận hạn (gồm 02 câu hỏi).'
                )}
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center">
              <button
                type="button"
                onClick={() => onUnlockQuestions()}
                className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>
                  {t('chat.unpaidBtn', `⚡ Quét Mã Thanh Toán (${isPro ? '99.000đ' : '49.000đ'} / 2 câu hỏi)`, {
                    price: isPro ? '99.000đ' : '49.000đ',
                  })}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 2. ĐÃ THANH TOÁN THÀNH CÔNG */}
        {flowStep === 'paid_success' && (
          <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-2xl p-5 sm:p-6 text-center space-y-3 shadow-xl animate-fade-in">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-lg sm:text-xl text-emerald-300 font-serif">
                {t('chat.paidSuccessTitle', 'Khai Mở Đàm Đạo Cùng Thầy Tôn!')}
              </h4>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                {proRemaining > 0 && basicRemaining > 0 ? (
                  <>
                    {t(
                      'chat.paidSuccessDescBoth',
                      `Hệ thống đã kích hoạt tổng cộng ${totalRemaining} lượt đàm đạo: gồm ${proRemaining} lượt Chuyên Sâu và ${basicRemaining} lượt Cơ Bản.`,
                      { total: totalRemaining, pro: proRemaining, basic: basicRemaining }
                    )}
                  </>
                ) : proRemaining > 0 ? (
                  <>
                    {t(
                      'chat.paidSuccessDescPro',
                      `Hệ thống đã kích hoạt ${proRemaining} câu hỏi Chuyên Sâu trực tiếp cùng AI Thầy Tôn theo gói quyền lợi của bạn.`,
                      { count: proRemaining }
                    )}
                  </>
                ) : (
                  <>
                    {t(
                      'chat.paidSuccessDescFree',
                      `Hệ thống đã ghi nhận thanh toán. Quý khách có ${basicRemaining} câu hỏi Cơ Bản trực tiếp cùng AI Thầy Tôn.`,
                      { count: basicRemaining }
                    )}
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
                <span>
                  {t('chat.paidSuccessBtn', `✅ Bấm Vào Đây Để Mở Ô Hỏi (${totalRemaining} câu còn lại)`, {
                    count: totalRemaining,
                  })}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* 3. ĐANG HỎI: Ô NHẬP CÂU HỎI */}
        {flowStep === 'chatting' && (
          <div className="space-y-3 animate-fade-in">
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-xs text-slate-300 font-medium">
                  {t('chat.modeLabel', 'Chế độ hỏi:')}
                </span>
                <div className="inline-flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                  {/* Nút Chuyên Sâu */}
                  <button
                    type="button"
                    onClick={() => {
                      if (proRemaining > 0) {
                        setSelectedMode('vip');
                      } else {
                        onUnlockQuestions('vip');
                      }
                    }}
                    className={`px-3.5 py-2 rounded-md text-sm sm:text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      selectedMode === 'vip'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                        : proRemaining > 0
                        ? 'text-slate-300 hover:text-slate-100'
                        : 'text-amber-400/80 hover:text-amber-300'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {t('chat.modeProBtn', 'Chuyên Sâu')}{' '}
                      {proRemaining > 0 ? `(${proRemaining})` : '(99k)'}
                    </span>
                  </button>

                  {/* Nút Cơ Bản */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMode('basic');
                    }}
                    className={`px-3.5 py-2 rounded-md text-sm sm:text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                      selectedMode === 'basic'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                        : basicRemaining > 0
                        ? 'text-slate-300 hover:text-slate-100'
                        : 'text-blue-300/80 hover:text-blue-200'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    <span>
                      {t('chat.modeBasicBtn', 'Cơ Bản')}{' '}
                      {basicRemaining > 0 ? `(${basicRemaining})` : proRemaining > 0 ? `(VIP)` : '(49k)'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Nhãn trạng thái bên phải & Nút mua thêm câu hỏi */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-xs sm:text-[11px] text-slate-300 px-1 flex items-center gap-1.5">
                  {selectedMode === 'vip' ? (
                    <span className="text-amber-300 font-medium">
                      <b>{t('chat.activeModePro', 'Đang chọn: Chuyên Sâu')}</b>
                    </span>
                  ) : (
                    <span className="text-blue-300 font-medium flex items-center gap-1">
                      <span>
                        <b>{t('chat.activeModeBasic', 'Đang chọn: Cơ Bản')}</b>
                      </span>
                      {basicRemaining === 0 && proRemaining > 0 && (
                        <span className="text-amber-300 font-normal text-[11px]">
                          {t('chat.deductProHint', '(Trừ 1 câu VIP Pro)')}
                        </span>
                      )}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => onUnlockQuestions('basic')}
                  className="text-xs px-2.5 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 transition flex items-center gap-1 cursor-pointer font-medium"
                  title="Mua thêm câu hỏi Cơ Bản"
                >
                  <Sparkles className="w-3 h-3 text-blue-400" />
                  <span>{t('chat.buyMoreBasicBtn', '+ Mua 2 câu Cơ Bản (49k)')}</span>
                </button>
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
                    ? t('chat.inputPlaceholderVip', 'Nhập câu hỏi chuyên sâu...')
                    : t('chat.inputPlaceholderBasic', 'Nhập câu hỏi cơ bản...')
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
                <span>{t('chat.sendBtn', 'Gửi Thầy')}</span>
              </button>
            </form>
          </div>
        )}

        {/* 4. ĐÃ HỎI XONG TẤT CẢ CÁC CÂU */}
        {flowStep === 'exhausted' && (
          <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-5 sm:p-6 text-center space-y-3 shadow-xl animate-fade-in">
            <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-lg sm:text-xl text-amber-300 font-serif">
                {t('chat.exhaustedTitle', 'Quý khách có muốn thỉnh giáo thêm câu hỏi không?')}
              </h4>
              <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-lg mx-auto leading-relaxed">
                {isPro
                  ? t(
                      'chat.exhaustedDescPro',
                      `Quý khách đã sử dụng hết toàn bộ ${totalAllowed} lượt câu hỏi. Quý khách có thể gia hạn thêm câu hỏi chuyên sâu hoặc câu hỏi cơ bản.`
                    )
                  : t(
                      'chat.exhaustedDescFree',
                      `Quý khách đã sử dụng hết toàn bộ ${totalAllowed} lượt câu hỏi. Quý khách có thể mua thêm câu hỏi cơ bản hoặc nâng cấp lên Bản Pro.`
                    )}
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {isPro ? (
                <>
                  <button
                    type="button"
                    onClick={() => onUnlockQuestions('vip')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Crown className="w-4 h-4" />
                    <span>{t('chat.buyProMoreBtn', '⚡ Nạp Tiếp (99.000đ / 2 câu chuyên sâu)')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onUnlockQuestions('basic')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm sm:text-base border border-slate-600 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>{t('chat.buyBasicMoreBtn', '⚡ Mua 2 Câu Cơ Bản (49.000đ)')}</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onUnlockQuestions('basic')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-sm sm:text-base border border-slate-600 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{t('chat.buyBasicMoreBtn', '⚡ Mua Thêm 2 Câu Cơ Bản (49.000đ)')}</span>
                  </button>

                  {onUpgradeToPro && (
                    <button
                      type="button"
                      onClick={onUpgradeToPro}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Crown className="w-4 h-4" />
                      <span>{t('chat.upgradeProChatBtn', '👑 Nâng Cấp Luận Giải Pro (119.000đ - Tặng 2 câu chuyên sâu)')}</span>
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
