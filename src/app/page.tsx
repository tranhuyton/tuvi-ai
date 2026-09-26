'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DuLieuDuongSo, LaSoData, ChatMessage, ServiceTier, QuestionsQuota } from '@/types/tuvi';
import { lapLaSoTuVi } from '@/lib/tuvi/anSao';
import TuViForm from '@/components/TuViForm';
import LaSoBanCo from '@/components/LaSoBanCo';
import LuanGiaiAI from '@/components/LuanGiaiAI';
import ChatThayTon from '@/components/ChatThayTon';
import AuthModal, { AuthModalTab } from '@/components/AuthModal';
import SavedChartsModal from '@/components/SavedChartsModal';
import PaymentModal, { PaymentPurpose } from '@/components/PaymentModal';
import UserNav from '@/components/UserNav';
import FloatingContact from '@/components/FloatingContact';
import AboutThayTon from '@/components/AboutThayTon';
import Testimonials from '@/components/Testimonials';
import BookingBanner from '@/components/BookingBanner';
import { useAuth } from '@/context/AuthContext';
import {
  saveOrUpdateChart,
  getChartDetails,
  updateChartReading,
  saveChatMessage,
  getUserCharts,
  SavedChart,
} from '@/lib/tuviService';
import { supabase } from '@/lib/supabase';
import { Sparkles, Crown, PhoneCall, MapPin, Mail } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { user, isLoading: isAuthLoading, isPasswordRecovery } = useAuth();
  const { language, t } = useLanguage();

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
  const [questionsQuota, setQuestionsQuota] = useState<QuestionsQuota>({
    basicAllowed: 0,
    proAllowed: 0,
  });
  const [isRestoringSession, setIsRestoringSession] = useState(true);

  const getChartStorageKey = (duongSo?: DuLieuDuongSo | null, chartId?: string | null) =>
    chartId || (duongSo ? `${duongSo.hoTen}_${duongSo.namDuong}` : 'default');

  // Bắt mã giới thiệu Affiliate (Ví dụ: tuvithayton.vn/?ref=diep93 hoặc ?aff=diep93)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const refCode = params.get('ref') || params.get('aff');
      if (refCode && refCode.trim()) {
        const cleanRef = refCode.trim().toLowerCase();
        localStorage.setItem('tuvi_affiliate_ref', cleanRef);
        localStorage.setItem('tuvi_affiliate_time', Date.now().toString());

        // Ghi nhận lượt click
        fetch('/api/affiliate/track-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ref: cleanRef }),
        }).catch(() => {});
      }
    } catch {
      // ignore
    }
  }, []);

  // Đồng bộ và lưu trữ số lượt hỏi vào localStorage để giữ nguyên khi F5 hoặc đổi lá số
  const updateQuestionsQuota = (
    val: QuestionsQuota | ((prev: QuestionsQuota) => QuestionsQuota)
  ) => {
    setQuestionsQuota((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      if (typeof window !== 'undefined') {
        if (currentChartId) {
          localStorage.setItem(`tuvi_quota_${currentChartId}`, JSON.stringify(next));
        }
        if (currentDuongSo) {
          localStorage.setItem(`tuvi_quota_${currentDuongSo.hoTen}_${currentDuongSo.namDuong}`, JSON.stringify(next));
        }
      }
      return next;
    });
  };

  useEffect(() => {
    if (typeof window === 'undefined' || isRestoringSession || !laSo) return;
    localStorage.removeItem('tuvi_global_q');
      const chartIdKey = currentChartId ? `tuvi_quota_${currentChartId}` : null;
      const duongSoKey = currentDuongSo ? `tuvi_quota_${currentDuongSo.hoTen}_${currentDuongSo.namDuong}` : null;
      const storedQuotaStr =
        (chartIdKey ? localStorage.getItem(chartIdKey) : null) ||
        (duongSoKey ? localStorage.getItem(duongSoKey) : null);

      if (storedQuotaStr) {
        try {
          const parsed = JSON.parse(storedQuotaStr);
          let bAllowed = Number(parsed.basicAllowed || 0);
          let pAllowed = Number(parsed.proAllowed || 0);
          if (currentTier === 'pro' && pAllowed === 0) {
            pAllowed = 2; // Luôn đảm bảo khách VIP Pro có tối thiểu 2 câu Pro
          }
          const normalized: QuestionsQuota = { basicAllowed: bAllowed, proAllowed: pAllowed };
          if (chartIdKey) localStorage.setItem(chartIdKey, JSON.stringify(normalized));
          if (duongSoKey) localStorage.setItem(duongSoKey, JSON.stringify(normalized));
          setQuestionsQuota(normalized);
          return;
        } catch {
          // ignore
        }
      }

      // Migration từ legacy tuvi_q
      const legacyQ =
        (chartIdKey ? localStorage.getItem(`tuvi_q_${currentChartId}`) : null) ||
        (duongSoKey ? localStorage.getItem(`tuvi_q_${currentDuongSo?.hoTen}_${currentDuongSo?.namDuong}`) : null);

      if (legacyQ && Number(legacyQ) > 0) {
        const total = Number(legacyQ);
        const initial: QuestionsQuota = {
          basicAllowed: total,
          proAllowed: currentTier === 'pro' ? 2 : 0,
        };
        if (chartIdKey) localStorage.setItem(chartIdKey, JSON.stringify(initial));
        if (duongSoKey) localStorage.setItem(duongSoKey, JSON.stringify(initial));
        setQuestionsQuota(initial);
        return;
      }

      // Ưu tiên quota từ database nếu có trong laso
      if (laSo?.quota) {
        const initial: QuestionsQuota = {
          basicAllowed: Number(laSo.quota.basicAllowed || 0),
          proAllowed: currentTier === 'pro' ? Math.max(2, Number(laSo.quota.proAllowed || 0)) : Number(laSo.quota.proAllowed || 0),
        };
        if (chartIdKey) localStorage.setItem(chartIdKey, JSON.stringify(initial));
        if (duongSoKey) localStorage.setItem(duongSoKey, JSON.stringify(initial));
        setQuestionsQuota(initial);
        return;
      }

      // Mặc định
      if (currentTier === 'pro') {
        setQuestionsQuota({ basicAllowed: 0, proAllowed: 2 });
      } else {
        setQuestionsQuota({ basicAllowed: 0, proAllowed: 0 });
      }
  }, [laSo, currentDuongSo, currentTier, currentChartId]);

  // Modals & Payment
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('signin');
  const [authModalNotice, setAuthModalNotice] = useState('');
  const pendingPostAuthActionRef = useRef<(() => void) | null>(null);

  // Lắng nghe khi người dùng bấm vào link khôi phục mật khẩu từ email
  useEffect(() => {
    if (isPasswordRecovery) {
      setAuthModalTab('update_password');
      setAuthModalNotice('Tài khoản của quý khách đang trong tiến trình khôi phục. Vui lòng nhập mật khẩu mới.');
      setIsAuthModalOpen(true);
    }
  }, [isPasswordRecovery]);
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

  // Xử lý khi đăng nhập / đăng ký tài khoản thành công
  const handleAuthSuccess = async () => {
    setIsAuthModalOpen(false);
    setAuthModalNotice('');

    // Nếu đã có lá số trên màn hình nhưng chưa có chartId trong database (khách lập khi chưa đăng nhập)
    let activeChartId = currentChartId;
    if (laSo && currentDuongSo && !activeChartId) {
      try {
        const cleanDuongSo = {
          ...currentDuongSo,
          anhMat: currentDuongSo.anhMat ? '[Ảnh khuôn mặt đã tải lên]' : undefined,
          anhTay: currentDuongSo.anhTay ? '[Ảnh bàn tay đã tải lên]' : undefined,
        };
        const saveRes = await saveOrUpdateChart({
          title: `${currentDuongSo.hoTen} (${currentDuongSo.gioiTinh} - ${currentDuongSo.namDuong})`,
          duongSoData: cleanDuongSo,
          lasoData: laSo,
          readingHtml: readingHtml,
        });
        if (saveRes.chartId) {
          activeChartId = saveRes.chartId;
          setCurrentChartId(saveRes.chartId);
        }
      } catch (err) {
        console.warn('Lỗi tự động lưu lá số sau khi đăng nhập:', err);
      }
    }

    // Kích hoạt hành động thanh toán đang chờ (nếu có)
    if (pendingPostAuthActionRef.current) {
      const action = pendingPostAuthActionRef.current;
      pendingPostAuthActionRef.current = null;
      setTimeout(() => {
        action();
      }, 120);
    }
  };


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
          lang: language,
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
          lang: language,
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
    let initialQuota: QuestionsQuota = {
      basicAllowed: 0,
      proAllowed: tier === 'pro' ? 2 : 0,
    };
    if (typeof window !== 'undefined') {
      const key = `${data.hoTen}_${data.namDuong}`;
      const storedQuotaStr = localStorage.getItem(`tuvi_quota_${key}`);
      if (storedQuotaStr) {
        try {
          const parsed = JSON.parse(storedQuotaStr);
          initialQuota = {
            basicAllowed: Number(parsed.basicAllowed || 0),
            proAllowed: tier === 'pro' ? Math.max(2, Number(parsed.proAllowed || 0)) : Number(parsed.proAllowed || 0),
          };
        } catch {}
      } else {
        const storedQ = localStorage.getItem(`tuvi_q_${key}`);
        if (storedQ && Number(storedQ) > 0) {
          const total = Number(storedQ);
          initialQuota = {
            basicAllowed: total,
            proAllowed: tier === 'pro' ? 2 : 0,
          };
        }
      }
    }
    setQuestionsQuota(initialQuota);
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
    // Khi nâng cấp lên Pro: Luôn cộng thêm 2 câu hỏi chuyên sâu VIP Pro!
    const newQuota: QuestionsQuota = {
      basicAllowed: questionsQuota.basicAllowed,
      proAllowed: questionsQuota.proAllowed + 2,
    };
    updateQuestionsQuota(newQuota);
    setIsUpgrading(true);
    setIsLoadingReading(true);
    setReadingError(undefined);

    const updatedCleanDuongSo: DuLieuDuongSo = {
      ...currentDuongSo,
      tier: 'pro',
      anhMat: undefined,
      anhTay: undefined,
    };

    const updatedLaSo = { ...laSo, tier: 'pro' as ServiceTier, quota: newQuota };
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
    const proceedToPayment = () => {
      setPaymentModalConfig({
        isOpen: true,
        type: 'reading_vip',
        price: 119000,
        onConfirm: () => {
          handleConfirmUpgradeToPro();
        },
      });
    };

    if (!user) {
      pendingPostAuthActionRef.current = proceedToPayment;
      setAuthModalNotice(
        'Quý khách vui lòng đăng nhập hoặc đăng ký tài khoản để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán nâng cấp Bản Pro.'
      );
      setIsAuthModalOpen(true);
      return;
    }

    proceedToPayment();
  };

  // Mở modal thanh toán thỉnh giáo Thầy Tôn (hỏi đáp)
  const handleUnlockQuestions = (mode?: 'basic' | 'vip') => {
    const targetMode = mode || (currentTier === 'pro' ? 'vip' : 'basic');
    const proceedToPayment = () => {
      if (targetMode === 'vip') {
        setPaymentModalConfig({
          isOpen: true,
          type: 'chat_vip',
          price: 99000,
          onConfirm: () => {
            const validVipAsked = chatHistory.filter((c) => !c.isError && c.type === 'vip').length;
            updateQuestionsQuota((prev) => ({
              ...prev,
              proAllowed: Math.max(prev.proAllowed, validVipAsked) + 2,
            }));
          },
        });
      } else {
        setPaymentModalConfig({
          isOpen: true,
          type: 'chat_free',
          price: 49000,
          onConfirm: () => {
            const validBasicAsked = chatHistory.filter((c) => !c.isError && (c.type === 'basic' || !c.type)).length;
            updateQuestionsQuota((prev) => ({
              ...prev,
              basicAllowed: Math.max(prev.basicAllowed, validBasicAsked) + 2,
            }));
          },
        });
      }
    };

    if (!user) {
      pendingPostAuthActionRef.current = proceedToPayment;
      setAuthModalNotice(
        targetMode === 'vip'
          ? 'Quý khách vui lòng đăng nhập hoặc đăng ký tài khoản để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán 02 câu hỏi Chuyên Sâu.'
          : 'Quý khách vui lòng đăng nhập hoặc đăng ký tài khoản để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán 02 câu hỏi cùng Thầy Tôn.'
      );
      setIsAuthModalOpen(true);
      return;
    }

    proceedToPayment();
  };

  // Mở modal Sổ tay số mệnh (danh sách lá số đã lưu)
  const handleOpenSavedCharts = () => {
    if (!user) {
      setAuthModalNotice('Quý khách vui lòng đăng nhập hoặc tạo tài khoản để xem Sổ tay danh sách lá số đã lưu.');
      pendingPostAuthActionRef.current = () => {
        setIsSavedChartsModalOpen(true);
      };
      setIsAuthModalOpen(true);
    } else {
      setIsSavedChartsModalOpen(true);
    }
  };

  // Xử lý gửi tin nhắn hỏi đáp với Thầy Tôn
  const handleSendMessage = async (userQuestion: string, mode: 'basic' | 'vip' = 'vip') => {
    if (!laSo) return;

    // Kiểm tra quota cứng: Nếu đã hỏi đủ hạn mức cho phép thì chặn
    const validCount = chatHistory.filter((c) => !c.isError).length;
    const totalAllowed = (questionsQuota?.proAllowed || 0) + (questionsQuota?.basicAllowed || 0);
    if (totalAllowed > 0 && validCount >= totalAllowed) {
      alert('Quý khách đã sử dụng hết số lượt câu hỏi của lá số này. Xin vui lòng nạp thêm lượt hỏi để tiếp tục đàm đạo cùng Thầy Tôn.');
      return;
    }

    setIsLoadingChat(true);

    try {
      const selectedModel = mode === 'vip' ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash';
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
          mode,
          model: selectedModel,
          lang: language,
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
            type: mode,
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
            isError: false,
            type: mode,
          },
        ]);

        // Nếu đã đăng nhập và có chartId, lưu tin nhắn vào database
        if (currentChartId) {
          saveChatMessage(currentChartId, userQuestion, answer, mode);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setChatHistory((prev) => [
        ...prev,
        {
          q: userQuestion,
          a: `Lỗi kết nối máy chủ: ${msg}`,
          isError: true,
          type: mode,
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

      let detectedTier: ServiceTier =
        chart.duong_so_data?.tier ||
        chart.laso_data?.tier ||
        (chart.reading_html?.includes('Bản Pro') || chart.reading_html?.includes('CHUYÊN SÂU PRO')
          ? 'pro'
          : 'free');

      // Tự động kiểm tra hóa đơn thanh toán trong tuvi_orders (Cơ chế Self-Healing)
      let isPaidPro = detectedTier === 'pro';
      if (!isPaidPro) {
        try {
          const { data: paidOrders } = await supabase
            .from('tuvi_orders')
            .select('id, payment_type, status')
            .or(`chart_id.eq.${chartId},user_id.eq.${chart.user_id || user?.id}`)
            .eq('status', 'PAID')
            .eq('payment_type', 'reading_vip')
            .limit(1);

          if (paidOrders && paidOrders.length > 0) {
            isPaidPro = true;
            detectedTier = 'pro';
          }
        } catch (err) {
          // ignore
        }
      }

      setCurrentTier(detectedTier);
      // Tự động an sao lại theo thuật toán mới nhất để đảm bảo định dạng chuẩn (Thê Thiếp cho Nam, đầy đủ sao, màu sắc chuẩn)
      let activeLaSo = chart.laso_data;
      if (chart.duong_so_data) {
        try {
          activeLaSo = lapLaSoTuVi(chart.duong_so_data, 2026);
          activeLaSo.tier = detectedTier;
          if (chart.laso_data?.quota) activeLaSo.quota = chart.laso_data.quota;
        } catch (calcErr) {
          console.warn('Lỗi tính toán lại lá số đã lưu:', calcErr);
        }
      }
      setLaSo(activeLaSo);
      setCurrentDuongSo(chart.duong_so_data);
      setCurrentChartId(chart.id);
      setReadingHtml(chart.reading_html || undefined);
      setReadingError(undefined);
      setChatHistory(chatMessages || []);
      let loadedQuota: QuestionsQuota = {
        basicAllowed: 0,
        proAllowed: detectedTier === 'pro' ? 2 : 0,
      };
      if (typeof window !== 'undefined') {
        const storedQuotaStr =
          (chart.id ? localStorage.getItem(`tuvi_quota_${chart.id}`) : null) ||
          (chart.duong_so_data ? localStorage.getItem(`tuvi_quota_${chart.duong_so_data.hoTen}_${chart.duong_so_data.namDuong}`) : null);

        if (storedQuotaStr) {
          try {
            const parsed = JSON.parse(storedQuotaStr);
            loadedQuota = {
              basicAllowed: Number(parsed.basicAllowed || 0),
              proAllowed: detectedTier === 'pro' ? Math.max(2, Number(parsed.proAllowed || 0)) : Number(parsed.proAllowed || 0),
            };
          } catch {}
        } else {
          const storedQ =
            (chart.id ? localStorage.getItem(`tuvi_q_${chart.id}`) : null) ||
            (chart.duong_so_data ? localStorage.getItem(`tuvi_q_${chart.duong_so_data.hoTen}_${chart.duong_so_data.namDuong}`) : null);
          if (storedQ && Number(storedQ) > 0) {
            const total = Number(storedQ);
            if (detectedTier === 'pro') {
              loadedQuota = {
                basicAllowed: total,
                proAllowed: 2,
              };
            } else {
              loadedQuota = {
                basicAllowed: total,
                proAllowed: 0,
              };
            }
          }
        }
      }
      if (chart.laso_data?.quota) {
        loadedQuota = {
          basicAllowed: Math.max(loadedQuota.basicAllowed, Number(chart.laso_data.quota.basicAllowed || 0)),
          proAllowed: detectedTier === 'pro' ? Math.max(2, Number(chart.laso_data.quota.proAllowed || 0)) : Number(chart.laso_data.quota.proAllowed || 0),
        };
      }
      if (typeof window !== 'undefined') {
        if (chart.id) localStorage.setItem(`tuvi_quota_${chart.id}`, JSON.stringify(loadedQuota));
        if (chart.duong_so_data) localStorage.setItem(`tuvi_quota_${chart.duong_so_data.hoTen}_${chart.duong_so_data.namDuong}`, JSON.stringify(loadedQuota));
      }
      if (detectedTier === 'pro') {
        loadedQuota.proAllowed = Math.max(2, loadedQuota.proAllowed);
      }
      setQuestionsQuota(loadedQuota);

      // Tự động nâng cấp lên Pro nếu phát hiện có đơn PAID nhưng database chưa lưu Pro hoặc chưa có bài luận
      if (detectedTier === 'pro' && (chart.duong_so_data?.tier !== 'pro' || !chart.reading_html)) {
        const cleanDuongSo: DuLieuDuongSo = {
          ...chart.duong_so_data,
          tier: 'pro',
          anhMat: undefined,
          anhTay: undefined,
        };
        const updatedLaSo = { ...chart.laso_data, tier: 'pro' as ServiceTier, quota: loadedQuota };
        
        generateReading(updatedLaSo, chart.duong_so_data, 'pro')
          .then(async (readingResult) => {
            if (readingResult) {
              setReadingHtml(readingResult);
              await updateChartReading(chart.id, readingResult);
              await saveOrUpdateChart({
                id: chart.id,
                title: chart.title,
                duongSoData: cleanDuongSo,
                lasoData: updatedLaSo,
                readingHtml: readingResult,
              });
            }
          })
          .catch(console.error);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e: any) {
      alert('Lỗi tải dữ liệu lá số: ' + e.message);
    } finally {
      setIsLoadingReading(false);
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tuvi_active_session');
      window.history.replaceState(null, '', '/');
    }
    setLaSo(null);
    setCurrentDuongSo(null);
    setCurrentChartId(null);
    setCurrentTier('free');
    setQuestionsQuota({ basicAllowed: 0, proAllowed: 0 });
    setReadingHtml(undefined);
    setReadingError(undefined);
    setChatHistory([]);
    setIsRestoringSession(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Lắng nghe khi người dùng đăng xuất: Tự động dọn dẹp sạch toàn bộ lá số và bình giải cũ
  const prevUserRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (prevUserRef.current && !user) {
      handleReset();
    }
    prevUserRef.current = user ? user.id : null;
  }, [user]);

  // Khôi phục phiên làm việc đang xem khi trang được tải lần đầu / sau khi F5
  useEffect(() => {
    if (typeof window === 'undefined' || isAuthLoading) return;

    const urlParams = new URLSearchParams(window.location.search);
    const urlChartId = urlParams.get('chartId');

    const savedSessionStr = localStorage.getItem('tuvi_active_session');
    let hasRestored = false;

    if (savedSessionStr) {
      try {
        const session = JSON.parse(savedSessionStr);
        if (session && session.laSo && session.duongSo) {
          // Kiểm tra xem session có phải của tài khoản người dùng đã đăng xuất hay không
          const isUserAccountSession = Boolean(session.chartId || session.userId || session.tier === 'pro');

          if (!user && isUserAccountSession) {
            // Hiện tại chưa đăng nhập nhưng phiên lưu là của tài khoản đã đăng xuất -> Dọn dẹp sạch
            localStorage.removeItem('tuvi_active_session');
            window.history.replaceState(null, '', '/');
          } else if (user && session.userId && session.userId !== user.id) {
            // Đăng nhập tài khoản khác tài khoản trong session cũ -> Dọn sạch session
            localStorage.removeItem('tuvi_active_session');
            window.history.replaceState(null, '', '/');
          } else if (!urlChartId || urlChartId === session.chartId) {
            let activeLaSo = session.laSo;
            if (session.duongSo) {
              try {
                activeLaSo = lapLaSoTuVi(session.duongSo, 2026);
                activeLaSo.tier = session.tier || 'free';
                if (session.quota) activeLaSo.quota = session.quota;
                // Cập nhật lại session trong localStorage với lá số chuẩn mới nhất
                try {
                  localStorage.setItem(
                    'tuvi_active_session',
                    JSON.stringify({ ...session, laSo: activeLaSo })
                  );
                } catch {}
              } catch (calcErr) {
                console.warn('Lỗi tính toán lại phiên làm việc:', calcErr);
              }
            }
            setLaSo(activeLaSo);
            setCurrentDuongSo(session.duongSo);
            setCurrentChartId(session.chartId || null);
            setCurrentTier(session.tier || 'free');
            if (session.readingHtml) setReadingHtml(session.readingHtml);
            if (Array.isArray(session.chatHistory)) setChatHistory(session.chatHistory);
            if (session.quota) setQuestionsQuota(session.quota);
            hasRestored = true;

            // Nếu có chartId và user đã đăng nhập, ngầm làm mới từ database để luôn cập nhật
            if (session.chartId && user) {
              getChartDetails(session.chartId)
                .then(async ({ chart, chatMessages }) => {
                  if (chart) {
                    if (chart.reading_html) setReadingHtml(chart.reading_html);
                    if (chatMessages && chatMessages.length > 0) setChatHistory(chatMessages);
                    let detectedTier: ServiceTier =
                      chart.duong_so_data?.tier ||
                      chart.laso_data?.tier ||
                      (chart.reading_html?.includes('Bản Pro') || chart.reading_html?.includes('CHUYÊN SÂU PRO')
                        ? 'pro'
                        : session.tier || 'free');

                    // Kiểm tra Self-Healing từ tuvi_orders
                    if (detectedTier !== 'pro') {
                      try {
                        const { data: paidOrders } = await supabase
                          .from('tuvi_orders')
                          .select('id, payment_type, status')
                          .or(`chart_id.eq.${session.chartId},user_id.eq.${user.id}`)
                          .eq('status', 'PAID')
                          .eq('payment_type', 'reading_vip')
                          .limit(1);

                        if (paidOrders && paidOrders.length > 0) {
                          detectedTier = 'pro';
                        }
                      } catch (err) {}
                    }

                    setCurrentTier(detectedTier);

                    // Tự động nâng cấp nếu phát hiện đơn hàng đã thanh toán
                    if (detectedTier === 'pro' && (chart.duong_so_data?.tier !== 'pro' || !chart.reading_html)) {
                      const cleanDuongSo: DuLieuDuongSo = {
                        ...chart.duong_so_data,
                        tier: 'pro',
                        anhMat: undefined,
                        anhTay: undefined,
                      };
                      const updatedLaSo = { ...chart.laso_data, tier: 'pro' as ServiceTier, quota: { basicAllowed: 0, proAllowed: 2 } };

                      generateReading(updatedLaSo, chart.duong_so_data, 'pro')
                        .then(async (readingResult) => {
                          if (readingResult) {
                            setReadingHtml(readingResult);
                            await updateChartReading(chart.id, readingResult);
                            await saveOrUpdateChart({
                              id: chart.id,
                              title: chart.title,
                              duongSoData: cleanDuongSo,
                              lasoData: updatedLaSo,
                              readingHtml: readingResult,
                            });
                          }
                        })
                        .catch(console.error);
                    }
                  }
                })
                .catch(() => {});
            }
          }
        }
      } catch (err) {
        console.error('Lỗi khi khôi phục tuvi_active_session:', err);
      }
    }

    if (!hasRestored && urlChartId && user) {
      handleSelectSavedChart(urlChartId).finally(() => {
        setIsRestoringSession(false);
      });
      return;
    }

    // Tự động kích hoạt cho khách hàng VIP Trần Thị Hiên hoặc đơn hàng TV90948/TV86309
    const orderParam = urlParams.get('order');
    const isHienAccount = Boolean(
      user?.email?.toLowerCase().includes('tyhonbo') || user?.email?.toLowerCase().includes('tyhonbon')
    );
    const isHienOrder =
      orderParam === 'TV90948' ||
      orderParam === 'TV86309' ||
      urlParams.get('vip') === 'hien';

    if (!hasRestored && (isHienAccount || isHienOrder)) {
      fetch('/api/tuvi/provision-vip')
        .then((res) => res.json())
        .then(async (data) => {
          if (data.success && data.laSo && data.duongSo) {
            let activeLaSo = data.laSo;
            try {
              activeLaSo = lapLaSoTuVi(data.duongSo, 2026);
              activeLaSo.tier = 'pro';
              activeLaSo.quota = { basicAllowed: 0, proAllowed: 2 };
            } catch {}
            setLaSo(activeLaSo);
            setCurrentDuongSo(data.duongSo);
            setReadingHtml(data.readingHtml);
            setCurrentTier('pro');
            setQuestionsQuota({ basicAllowed: 0, proAllowed: 2 });

            // Nếu người dùng đã đăng nhập, tự động lưu vào Sổ tay trên Supabase nếu chưa có
            if (user) {
              const { charts } = await getUserCharts();
              const existingHienChart = (charts || []).find((c: SavedChart) => c.title.includes('Hiên'));
              if (existingHienChart) {
                setCurrentChartId(existingHienChart.id);
              } else {
                const saveRes = await saveOrUpdateChart({
                  title: `${data.duongSo.hoTen} (${data.duongSo.gioiTinh} - ${data.duongSo.namDuong})`,
                  duongSoData: data.duongSo,
                  lasoData: data.laSo,
                  readingHtml: data.readingHtml,
                });
                if (saveRes.chartId) {
                  setCurrentChartId(saveRes.chartId);
                }
              }
            }
          }
        })
        .catch(console.error)
        .finally(() => {
          setIsRestoringSession(false);
        });
      return;
    }

    setIsRestoringSession(false);
  }, [isAuthLoading, user]);

  // Tự động lưu phiên làm việc hiện tại vào localStorage để khi F5 / refresh vẫn giữ nguyên trang đang xem
  useEffect(() => {
    if (typeof window === 'undefined' || isRestoringSession) return;

    if (laSo && currentDuongSo) {
      const cleanDuongSo: DuLieuDuongSo = {
        ...currentDuongSo,
        anhMat: undefined,
        anhTay: undefined,
      };
      const cleanLaSo: LaSoData = {
        ...laSo,
        duongSo: cleanDuongSo,
      };
      const sessionData = {
        userId: user ? user.id : null,
        chartId: currentChartId,
        laSo: cleanLaSo,
        duongSo: cleanDuongSo,
        tier: currentTier,
        readingHtml,
        chatHistory,
        quota: questionsQuota,
        updatedAt: Date.now(),
      };
      try {
        localStorage.setItem('tuvi_active_session', JSON.stringify(sessionData));
        if (currentChartId) {
          window.history.replaceState(null, '', `/?chartId=${currentChartId}`);
        }
      } catch (err) {
        console.warn('Không thể lưu tuvi_active_session vào localStorage:', err);
      }
    }
  }, [laSo, currentDuongSo, currentChartId, currentTier, readingHtml, chatHistory, questionsQuota, isRestoringSession, user]);

  return (
    <main className="min-h-screen cosmic-bg py-6 px-3 sm:px-6 md:px-8 flex flex-col justify-between relative">
      <div className="flex-1">
        {/* Navigation Bar Header */}
        <UserNav
          onOpenAuthModal={() => {
            setAuthModalTab('signin');
            setAuthModalNotice('');
            pendingPostAuthActionRef.current = null;
            setIsAuthModalOpen(true);
          }}
          onOpenChangePassword={() => {
            setAuthModalTab('update_password');
            setAuthModalNotice('');
            setIsAuthModalOpen(true);
          }}
          onOpenSavedCharts={handleOpenSavedCharts}
          onNewChart={handleReset}
          onSignOut={handleReset}
        />

        {isRestoringSession ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-3" />
            <p className="text-sm text-amber-300/80 font-serif">
              {t('reading.analyzing', 'Đang tải lại lá số của quý khách...')}
            </p>
          </div>
        ) : !laSo ? (
          <div className="my-auto py-6 sm:py-10 space-y-8 sm:space-y-12">
            <TuViForm
              onSubmit={handleFormSubmit}
              isLoading={isLoadingReading}
              onOpenSavedCharts={handleOpenSavedCharts}
              onRequireAuth={(action, notice) => {
                pendingPostAuthActionRef.current = action;
                setAuthModalNotice(notice);
                setIsAuthModalOpen(true);
              }}
            />

            {!user && (
              <>
                {/* Mục Giới thiệu về Thầy Tôn */}
                <AboutThayTon />

                {/* Mục Đánh giá & Cảm nhận từ Chuyên gia & Đương số */}
                <Testimonials />
              </>
            )}

            {/* Khối Đặt Lịch Xem Trực Tiếp Online & Offline Cùng Thầy Tôn */}
            <BookingBanner />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Thanh trạng thái gói dịch vụ khi đang xem lá số (chỉ hiện khi đang ở Bản Miễn Phí) */}
            {currentTier !== 'pro' && (
              <div className="flex items-center justify-end max-w-[1060px] mx-auto">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-900/90 border border-slate-700 text-slate-300">
                    <span>{t('form.freeTitle', '📜 Bản Miễn Phí')}</span>
                  </span>
                  <button
                    type="button"
                    onClick={openUpgradeModal}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                    <span>{t('reading.upgradeBtn', '⚡ Nâng Cấp Pro (119.000đ)')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bàn Cờ Lá Số Tử Vi */}
            <LaSoBanCo
              laSo={laSo}
              onReset={handleReset}
              onOpenSavedCharts={handleOpenSavedCharts}
            />

            {/* Bài Bình Giải Chuyên Sâu */}
            <LuanGiaiAI
              readingHtml={readingHtml}
              isLoading={isLoadingReading}
              error={readingError}
              tier={currentTier}
              onUpgrade={openUpgradeModal}
              isUpgrading={isUpgrading}
            />

            {/* Khung Hỏi Đáp Luận Giải Cùng AI Thầy Tôn */}
            <ChatThayTon
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChat}
              tier={currentTier}
              quota={questionsQuota}
              onUnlockQuestions={handleUnlockQuestions}
              onUpgradeToPro={openUpgradeModal}
            />

            {!user && (
              <>
                {/* Mục Giới thiệu về Thầy Tôn */}
                <AboutThayTon />

                {/* Mục Đánh giá & Cảm nhận từ Chuyên gia & Đương số */}
                <Testimonials />
              </>
            )}

            {/* Khối Đặt Lịch Xem Trực Tiếp Online & Offline Cùng Thầy Tôn (Nằm dưới phần Hỏi Đáp) */}
            <BookingBanner />
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
        chartId={currentChartId || undefined}
      />

      {/* Modal Đăng Nhập / Đăng Ký / Quên MK */}
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultTab={authModalTab}
        onClose={() => {
          setIsAuthModalOpen(false);
          setAuthModalNotice('');
          setAuthModalTab('signin');
          pendingPostAuthActionRef.current = null;
        }}
        customNotice={authModalNotice}
        onSuccess={handleAuthSuccess}
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

      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-800/60 print:hidden mt-8 space-y-2">
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 font-medium flex-wrap">
          {!user && (
            <>
              <a href="#gioi-thieu-thay-ton" className="hover:text-amber-400 transition">
                {t('footer.about')}
              </a>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <a href="#cam-nhan-chuyen-gia" className="hover:text-amber-400 transition">
                {t('footer.testimonials')}
              </a>
              <span className="text-slate-600 hidden sm:inline">•</span>
            </>
          )}
          <a
            href="https://tonyenglish.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            TonyEnglish.vn
          </a>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <a href="tel:0935058688" className="hover:text-amber-400 transition">
            {t('footer.contact')}{' '}
            <strong className="text-amber-400">+84 93 505 8688</strong>
          </a>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <a href="mailto:tranhuyton@gmail.com" className="hover:text-amber-300 transition">
            {t('footer.email')} tranhuyton@gmail.com
          </a>
        </div>
        <p className="text-slate-400 text-xs flex items-center justify-center gap-1.5 flex-wrap">
          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {t('footer.addressLabel')}{' '}
            <strong>{t('footer.addressValue')}</strong>
          </span>
        </p>
        <p className="text-slate-500 text-[11px] sm:text-xs">
          {t('footer.copyright', undefined, { year: new Date().getFullYear() })}{' '}
          <a href="/admin" className="text-slate-600 hover:text-slate-400 transition ml-1" title="Cổng quản trị Thầy Tôn">
            {t('footer.admin')}
          </a>
        </p>
      </footer>
    </main>
  );
}
