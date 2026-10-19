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
import { Sparkles, Crown, Gem, PhoneCall, MapPin, Mail, FlaskConical } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cleanReadingHtml } from '@/lib/tuvi/cleanReadingHtml';

export default function HomePage() {
  const { user, profile, testerInfo, refreshTesterInfo, isLoading: isAuthLoading, isPasswordRecovery, signOut } = useAuth();
  const { language, t } = useLanguage();
  const [testerChartsCount, setTesterChartsCount] = useState(0);

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
    expertAllowed: 0,
  });
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Refs đồng bộ tức thì để các hàm callback thanh toán không bao giờ dính stale closure
  const laSoRef = useRef<LaSoData | null>(null);
  const duongSoRef = useRef<DuLieuDuongSo | null>(null);
  const chartIdRef = useRef<string | null>(null);
  const tierRef = useRef<ServiceTier>('free');
  const quotaRef = useRef<QuestionsQuota>({
    basicAllowed: 0,
    proAllowed: 0,
    expertAllowed: 0,
  });

  useEffect(() => {
    laSoRef.current = laSo;
  }, [laSo]);
  useEffect(() => {
    duongSoRef.current = currentDuongSo;
  }, [currentDuongSo]);
  useEffect(() => {
    chartIdRef.current = currentChartId;
  }, [currentChartId]);
  useEffect(() => {
    tierRef.current = currentTier;
  }, [currentTier]);
  useEffect(() => {
    quotaRef.current = questionsQuota;
  }, [questionsQuota]);

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

  // Đồng bộ số lượng lá số tester đã tạo
  useEffect(() => {
    if (user && testerInfo?.isTester) {
      getUserCharts().then(({ charts }) => {
        if (charts) setTesterChartsCount(charts.length);
      });
    }
  }, [user, testerInfo]);

  // Đồng bộ và lưu trữ số lượt hỏi vào localStorage để giữ nguyên khi F5 hoặc đổi lá số
  const updateQuestionsQuota = (
    val: QuestionsQuota | ((prev: QuestionsQuota) => QuestionsQuota)
  ) => {
    setQuestionsQuota((prev) => {
      const next = typeof val === 'function' ? val(prev) : val;
      quotaRef.current = next;
      const activeChartId = chartIdRef.current || currentChartId;
      const activeDuongSo = duongSoRef.current || currentDuongSo;
      if (typeof window !== 'undefined') {
        if (activeChartId) {
          localStorage.setItem(`tuvi_quota_${activeChartId}`, JSON.stringify(next));
        }
        if (activeDuongSo) {
          localStorage.setItem(`tuvi_quota_${activeDuongSo.hoTen}_${activeDuongSo.namDuong}`, JSON.stringify(next));
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
          let eAllowed = Number(parsed.expertAllowed || 0);
          if (currentTier === 'pro' && pAllowed === 0) {
            pAllowed = 2; // Luôn đảm bảo khách VIP Pro có tối thiểu 2 câu Pro
          }
          if (currentTier === 'expert' && eAllowed === 0) {
            eAllowed = 2; // Luôn đảm bảo khách Chuyên Gia Expert có tối thiểu 2 câu Expert
          }
          const normalized: QuestionsQuota = { basicAllowed: bAllowed, proAllowed: pAllowed, expertAllowed: eAllowed };
          if (chartIdKey) localStorage.setItem(chartIdKey, JSON.stringify(normalized));
          if (duongSoKey) localStorage.setItem(duongSoKey, JSON.stringify(normalized));
          quotaRef.current = normalized;
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
          expertAllowed: currentTier === 'expert' ? 2 : 0,
        };
        if (chartIdKey) localStorage.setItem(chartIdKey, JSON.stringify(initial));
        if (duongSoKey) localStorage.setItem(duongSoKey, JSON.stringify(initial));
        quotaRef.current = initial;
        setQuestionsQuota(initial);
        return;
      }

      // Ưu tiên quota từ database nếu có trong laso
      if (laSo?.quota) {
        const initial: QuestionsQuota = {
          basicAllowed: Number(laSo.quota.basicAllowed || 0),
          proAllowed: currentTier === 'pro' ? Math.max(2, Number(laSo.quota.proAllowed || 0)) : Number(laSo.quota.proAllowed || 0),
          expertAllowed: currentTier === 'expert' ? Math.max(2, Number(laSo.quota.expertAllowed || 0)) : Number(laSo.quota.expertAllowed || 0),
        };
        if (chartIdKey) localStorage.setItem(chartIdKey, JSON.stringify(initial));
        if (duongSoKey) localStorage.setItem(duongSoKey, JSON.stringify(initial));
        quotaRef.current = initial;
        setQuestionsQuota(initial);
        return;
      }

      // Mặc định
      const defaultQuota: QuestionsQuota =
        currentTier === 'expert'
          ? { basicAllowed: 0, proAllowed: 0, expertAllowed: 2 }
          : currentTier === 'pro'
          ? { basicAllowed: 0, proAllowed: 2, expertAllowed: 0 }
          : { basicAllowed: 0, proAllowed: 0, expertAllowed: 0 };
      quotaRef.current = defaultQuota;
      setQuestionsQuota(defaultQuota);
  }, [laSo, currentDuongSo, currentTier, currentChartId]);

  // Modals & Payment
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('signin');
  const [authModalNotice, setAuthModalNotice] = useState('');
  const pendingPostAuthActionRef = useRef<(() => void) | null>(null);
  const isAuthenticatedRef = useRef<boolean>(Boolean(user));
  useEffect(() => {
    isAuthenticatedRef.current = Boolean(user);
  }, [user]);

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
    isAuthenticatedRef.current = true;
    setIsAuthModalOpen(false);
    setAuthModalNotice('');

    // Nếu đã có lá số trên màn hình nhưng chưa có chartId trong database (khách lập khi chưa đăng nhập)
    let activeChartId = chartIdRef.current || currentChartId;
    const activeLaSo = laSoRef.current || laSo;
    const activeDuongSo = duongSoRef.current || currentDuongSo;
    if (activeLaSo && activeDuongSo && !activeChartId) {
      try {
        const cleanDuongSo = {
          ...activeDuongSo,
          anhMat: activeDuongSo.anhMat ? '[Ảnh khuôn mặt đã tải lên]' : undefined,
          anhTay: activeDuongSo.anhTay ? '[Ảnh bàn tay đã tải lên]' : undefined,
        };
        const saveRes = await saveOrUpdateChart({
          title: `${activeDuongSo.hoTen} (${activeDuongSo.gioiTinh} - ${activeDuongSo.namDuong})`,
          duongSoData: cleanDuongSo,
          lasoData: activeLaSo,
          readingHtml: readingHtml,
        });
        if (saveRes.chartId) {
          activeChartId = saveRes.chartId;
          chartIdRef.current = saveRes.chartId;
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


  // Hàm gọi tạo bài bình giải (API Route tự động lưu vào DB trên server + Supabase Edge direct fallback)
  const generateReading = async (
    calculatedLaSo: LaSoData,
    duongSoData: DuLieuDuongSo,
    tier: ServiceTier,
    explicitChartId?: string | null
  ): Promise<string | null> => {
    const selectedModel =
      tier === 'expert'
        ? 'gemini-4-argon'
        : tier === 'pro'
        ? 'gemini-3.1-pro-preview'
        : 'gemini-2.5-flash';
    const targetChartId = explicitChartId || chartIdRef.current || currentChartId || undefined;
    let readingResult: string | null = null;
    let lastErrMsg: string | null = null;

    // Bước 1: Gọi qua Next.js API Route (Server sẽ tự lưu kết quả vào DB ngay khi AI xong, dù khách tắt cửa sổ giữa chừng)
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
          chartId: targetChartId,
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

  // Xử lý khi nộp form lập lá số mới hoặc cập nhật lá số (chọn Free, Pro hoặc Expert)
  const handleFormSubmit = async (data: DuLieuDuongSo, tier: ServiceTier) => {
    const previousTier = tierRef.current || currentTier;
    const existingChartId = isEditing ? (chartIdRef.current || currentChartId) : null;
    const existingReadingHtml = isEditing ? readingHtml : undefined;
    const existingChatHistory = isEditing ? chatHistory : [];

    // Lấy user hiện tại (hỗ trợ cả trường hợp vừa đăng nhập xong qua AuthModal mà React state chưa kịp re-render)
    let activeUser = user;
    if (!activeUser) {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (authData?.user) {
          activeUser = authData.user;
          isAuthenticatedRef.current = true;
        }
      } catch {
        // ignore
      }
    }

    let effectiveTier = tier;

    // 1. Kiểm tra xem người dùng đã có đơn hàng nào đã thanh toán trước đó chưa (ví dụ: chuyển khoản trước, duyệt tay trước mà chưa có lá số)
    let autoUnlockedFromPaidOrder = false;
    let matchedPaidOrderCode: string | null = null;

    if (activeUser) {
      try {
        const { data: unlinkedPaidOrders } = await supabase
          .from('tuvi_orders')
          .select('id, order_code, payment_type, status, chart_id')
          .eq('user_id', activeUser.id)
          .eq('status', 'PAID')
          .in('payment_type', ['reading_expert', 'upgrade_expert', 'reading_vip'])
          .is('chart_id', null)
          .ilike('ho_ten', data.hoTen.trim())
          .order('created_at', { ascending: false })
          .limit(1);

        if (unlinkedPaidOrders && unlinkedPaidOrders.length > 0) {
          autoUnlockedFromPaidOrder = true;
          matchedPaidOrderCode = unlinkedPaidOrders[0].order_code;
          const paidType = unlinkedPaidOrders[0].payment_type;
          effectiveTier = paidType === 'reading_expert' || paidType === 'upgrade_expert' ? 'expert' : 'pro';
        }
      } catch (err) {
        console.warn('Lỗi kiểm tra đơn đã thanh toán trước:', err);
      }
    }

    // 2. Kiểm tra đặc quyền và hạn mức tài khoản Tester (Tester chỉ miễn phí gói VIP Pro, gói Expert vẫn cần thanh toán)
    if (testerInfo?.isTester) {
      if (tier !== 'expert') {
        effectiveTier = 'pro';
      }

      if (activeUser && !existingChartId) {
        try {
          const { charts } = await getUserCharts();
          const count = charts?.length || 0;
          setTesterChartsCount(count);
          if (count >= testerInfo.maxCharts) {
            alert(
              `⚠️ Tài khoản Tester của bạn đã đạt giới hạn tối đa ${testerInfo.maxCharts} lá số được cấp phép.\n\nQuý khách có thể mở mục "Sổ tay" trên thanh điều hướng để xem lại các lá số đã lưu và tiếp tục hỏi đáp chi tiết cùng Thầy Tôn.`
            );
            return;
          }
        } catch {
          // ignore
        }
      }
    }

    // Nếu người dùng chọn gói cao hơn (Pro hoặc Expert) mà chưa thanh toán cho gói đó:
    const isAlreadyAtSelectedTier =
      (tier === 'expert' && previousTier === 'expert' && isEditing) ||
      (tier === 'pro' && (previousTier === 'pro' || previousTier === 'expert') && isEditing);

    const requiresPayment =
      !isAlreadyAtSelectedTier &&
      !autoUnlockedFromPaidOrder &&
      (tier === 'expert' || (tier === 'pro' && !testerInfo?.isTester));

    if (requiresPayment) {
      effectiveTier = isEditing && previousTier === 'pro' ? 'pro' : 'free';
    }

    setCurrentTier(effectiveTier);
    tierRef.current = effectiveTier;

    // Giữ nguyên dữ liệu đương số (bao gồm cả ảnh diện tướng/chỉ tay đã nén ~60KB để dùng sau khi quét QR và lưu DB)
    const cleanDuongSo: DuLieuDuongSo = {
      ...data,
      tier: effectiveTier,
    };

    let initialQuota: QuestionsQuota = {
      basicAllowed: isEditing ? quotaRef.current.basicAllowed : 0,
      proAllowed: effectiveTier === 'pro' ? Math.max(2, isEditing ? quotaRef.current.proAllowed : 0) : (isEditing ? quotaRef.current.proAllowed : 0),
      expertAllowed: effectiveTier === 'expert' ? Math.max(2, isEditing ? (quotaRef.current.expertAllowed || 0) : 0) : (isEditing ? (quotaRef.current.expertAllowed || 0) : 0),
    };

    if (testerInfo?.isTester) {
      initialQuota = {
        basicAllowed: 0,
        proAllowed: effectiveTier === 'pro' ? testerInfo.maxQuestionsPerChart : initialQuota.proAllowed,
        expertAllowed: effectiveTier === 'expert' ? Math.max(2, initialQuota.expertAllowed || 0) : (initialQuota.expertAllowed || 0),
      };
    } else if (typeof window !== 'undefined') {
      const key = `${data.hoTen}_${data.namDuong}`;
      const storedQuotaStr =
        (existingChartId ? localStorage.getItem(`tuvi_quota_${existingChartId}`) : null) ||
        localStorage.getItem(`tuvi_quota_${key}`);
      if (storedQuotaStr) {
        try {
          const parsed = JSON.parse(storedQuotaStr);
          initialQuota = {
            basicAllowed: Number(parsed.basicAllowed || 0),
            proAllowed: effectiveTier === 'pro' ? Math.max(2, Number(parsed.proAllowed || 0)) : Number(parsed.proAllowed || 0),
            expertAllowed: effectiveTier === 'expert' ? Math.max(2, Number(parsed.expertAllowed || 0)) : Number(parsed.expertAllowed || 0),
          };
        } catch {}
      } else {
        const storedQ = localStorage.getItem(`tuvi_q_${key}`);
        if (storedQ && Number(storedQ) > 0) {
          const total = Number(storedQ);
          initialQuota = {
            basicAllowed: total,
            proAllowed: effectiveTier === 'pro' ? 2 : 0,
            expertAllowed: effectiveTier === 'expert' ? 2 : 0,
          };
        }
      }
    }

    const resolvedNamXem = cleanDuongSo.namXem || new Date().getFullYear();
    cleanDuongSo.namXem = resolvedNamXem;
    const calculatedLaSo = lapLaSoTuVi(
      { ...cleanDuongSo, anhMat: undefined, anhTay: undefined },
      resolvedNamXem
    );
    calculatedLaSo.tier = effectiveTier;
    calculatedLaSo.quota = initialQuota;

    // Đồng bộ cả state lẫn ref ngay lập tức để PaymentModal và onConfirm có sẵn dữ liệu mới nhất
    laSoRef.current = calculatedLaSo;
    duongSoRef.current = cleanDuongSo;
    chartIdRef.current = existingChartId;
    quotaRef.current = initialQuota;

    setLaSo(calculatedLaSo);
    setCurrentDuongSo(cleanDuongSo);
    setIsEditing(false);
    setCurrentChartId(existingChartId);
    setReadingHtml(requiresPayment ? existingReadingHtml : undefined);
    setReadingError(undefined);
    setChatHistory(existingChatHistory);
    setQuestionsQuota(initialQuota);
    setIsLoadingReading(!requiresPayment);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    let createdChartId: string | null = existingChartId;

    // Nếu người dùng đã đăng nhập, tự động lưu lá số vào database ngay lập tức để gắn chartId trước khi mở bảng thanh toán
    if (activeUser) {
      try {
        const saveRes = await saveOrUpdateChart({
          id: existingChartId || undefined,
          title: `${data.hoTen} (${data.gioiTinh} - ${data.namDuong})`,
          duongSoData: cleanDuongSo,
          lasoData: calculatedLaSo,
          readingHtml: requiresPayment ? existingReadingHtml : undefined,
        });
        if (saveRes.chartId) {
          createdChartId = saveRes.chartId;
          chartIdRef.current = saveRes.chartId;
          setCurrentChartId(saveRes.chartId);
          if (testerInfo?.isTester && !existingChartId) {
            setTesterChartsCount((prev) => prev + 1);
            refreshTesterInfo();
          }

          // Nếu có đơn hàng đã thanh toán trước đó (ví dụ TV96213), tự động gắn chartId vào đơn hàng đó
          if (autoUnlockedFromPaidOrder && matchedPaidOrderCode) {
            try {
              await supabase
                .from('tuvi_orders')
                .update({ chart_id: saveRes.chartId })
                .eq('order_code', matchedPaidOrderCode);
            } catch (err) {
              console.warn('Lỗi gán chart_id vào đơn đã thanh toán:', err);
            }
          }
        }
      } catch (e) {
        console.warn('Lỗi tự động lưu lá số:', e);
      }
    }

    // Nếu cần thanh toán Bản Pro hoặc Bản Expert (khách chủ động bấm chọn trên form): Mở ngay modal thanh toán có gắn chartId
    if (requiresPayment) {
      setIsLoadingReading(false);
      if (tier === 'expert') {
        openUpgradeExpertModal(isEditing && previousTier === 'pro' ? 'pro' : 'free');
      } else {
        openUpgradeModal();
      }
      return;
    }

    // Gọi AI Thầy Tôn bình giải
    try {
      const readingResult = await generateReading(calculatedLaSo, data, effectiveTier, createdChartId);
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
    const activeLaSo = laSoRef.current || laSo;
    const activeDuongSo = duongSoRef.current || currentDuongSo;
    const activeChartId = chartIdRef.current || currentChartId;
    const activeQuota = quotaRef.current || questionsQuota;
    if (!activeLaSo || !activeDuongSo) return;

    setCurrentTier('pro');
    tierRef.current = 'pro';
    // Khi nâng cấp lên Pro: Luôn cộng thêm 2 câu hỏi chuyên sâu VIP Pro!
    const newQuota: QuestionsQuota = {
      basicAllowed: activeQuota.basicAllowed,
      proAllowed: activeQuota.proAllowed + 2,
      expertAllowed: activeQuota.expertAllowed || 0,
    };
    updateQuestionsQuota(newQuota);
    setIsUpgrading(true);
    setIsLoadingReading(true);
    setReadingHtml(undefined);
    setReadingError(undefined);

    const updatedCleanDuongSo: DuLieuDuongSo = {
      ...activeDuongSo,
      tier: 'pro',
    };

    const pendingLaSo: LaSoData = {
      ...activeLaSo,
      tier: 'pro' as ServiceTier,
      quota: newQuota,
      needsReadingUpgrade: true,
    };
    laSoRef.current = pendingLaSo;
    duongSoRef.current = updatedCleanDuongSo;
    setLaSo(pendingLaSo);
    setCurrentDuongSo(updatedCleanDuongSo);

    const targetChartId = chartIdRef.current || activeChartId;
    if (targetChartId) {
      saveOrUpdateChart({
        id: targetChartId,
        title: `${activeDuongSo.hoTen} (${activeDuongSo.gioiTinh} - ${activeDuongSo.namDuong})`,
        duongSoData: updatedCleanDuongSo,
        lasoData: pendingLaSo,
      }).catch(() => {});
    }

    try {
      const readingResult = await generateReading(pendingLaSo, activeDuongSo, 'pro', targetChartId);
      if (readingResult) {
        const completedLaSo: LaSoData = {
          ...pendingLaSo,
          needsReadingUpgrade: false,
        };
        laSoRef.current = completedLaSo;
        setLaSo(completedLaSo);
        setReadingHtml(readingResult);
        if (targetChartId) {
          // Cập nhật cả bài bình giải và tier mới vào database
          await updateChartReading(targetChartId, readingResult);
          await saveOrUpdateChart({
            id: targetChartId,
            title: `${activeDuongSo.hoTen} (${activeDuongSo.gioiTinh} - ${activeDuongSo.namDuong})`,
            duongSoData: updatedCleanDuongSo,
            lasoData: completedLaSo,
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

  // Xử lý nâng cấp lên Bản Chuyên Gia Expert cho lá số đang xem
  const handleConfirmUpgradeToExpert = async () => {
    const activeLaSo = laSoRef.current || laSo;
    const activeDuongSo = duongSoRef.current || currentDuongSo;
    const activeChartId = chartIdRef.current || currentChartId;
    const activeQuota = quotaRef.current || questionsQuota;
    if (!activeLaSo || !activeDuongSo) return;

    setCurrentTier('expert');
    tierRef.current = 'expert';
    // Khi nâng cấp lên Expert: Luôn cộng thêm 2 câu hỏi Chuyên Gia Expert miễn phí!
    const newQuota: QuestionsQuota = {
      basicAllowed: activeQuota.basicAllowed,
      proAllowed: activeQuota.proAllowed,
      expertAllowed: (activeQuota.expertAllowed || 0) + 2,
    };
    updateQuestionsQuota(newQuota);
    setIsUpgrading(true);
    setIsLoadingReading(true);
    setReadingHtml(undefined);
    setReadingError(undefined);

    const updatedCleanDuongSo: DuLieuDuongSo = {
      ...activeDuongSo,
      tier: 'expert',
    };

    const pendingLaSo: LaSoData = {
      ...activeLaSo,
      tier: 'expert' as ServiceTier,
      quota: newQuota,
      needsReadingUpgrade: true,
    };
    laSoRef.current = pendingLaSo;
    duongSoRef.current = updatedCleanDuongSo;
    setLaSo(pendingLaSo);
    setCurrentDuongSo(updatedCleanDuongSo);

    const targetChartId = chartIdRef.current || activeChartId;
    if (targetChartId) {
      saveOrUpdateChart({
        id: targetChartId,
        title: `${activeDuongSo.hoTen} (${activeDuongSo.gioiTinh} - ${activeDuongSo.namDuong})`,
        duongSoData: updatedCleanDuongSo,
        lasoData: pendingLaSo,
      }).catch(() => {});
    }

    try {
      const readingResult = await generateReading(pendingLaSo, activeDuongSo, 'expert', targetChartId);
      if (readingResult) {
        const completedLaSo: LaSoData = {
          ...pendingLaSo,
          needsReadingUpgrade: false,
        };
        laSoRef.current = completedLaSo;
        setLaSo(completedLaSo);
        setReadingHtml(readingResult);
        if (targetChartId) {
          await updateChartReading(targetChartId, readingResult);
          await saveOrUpdateChart({
            id: targetChartId,
            title: `${activeDuongSo.hoTen} (${activeDuongSo.gioiTinh} - ${activeDuongSo.namDuong})`,
            duongSoData: updatedCleanDuongSo,
            lasoData: completedLaSo,
            readingHtml: readingResult,
          });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setReadingError(`Lỗi khi nâng cấp Bản Chuyên Gia Expert: ${msg}`);
    } finally {
      setIsLoadingReading(false);
      setIsUpgrading(false);
    }
  };

  // Mở modal thanh toán nâng cấp Bản Pro (Bắt buộc đăng nhập để lưu lá số và tra cứu lại)
  const openUpgradeModal = () => {
    if (testerInfo?.isTester) {
      alert('Tài khoản Tester của bạn đã được mở khóa toàn bộ quyền lợi VIP Pro!');
      return;
    }

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

    if (!user && !isAuthenticatedRef.current) {
      pendingPostAuthActionRef.current = proceedToPayment;
      setAuthModalNotice(
        'Quý khách vui lòng đăng nhập hoặc đăng ký tài khoản để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán nâng cấp Bản Pro.'
      );
      setIsAuthModalOpen(true);
      return;
    }

    proceedToPayment();
  };

  // Mở modal thanh toán Bản Chuyên Gia Expert (269.000đ nếu từ Free, hoặc 150.000đ nếu nâng cấp từ Pro)
  const openUpgradeExpertModal = (fromTierOverride?: ServiceTier) => {
    const baseTier = fromTierOverride || tierRef.current || currentTier;
    const isUpgradingFromPro = baseTier === 'pro';
    const paymentType: PaymentPurpose = isUpgradingFromPro ? 'upgrade_expert' : 'reading_expert';
    const price = isUpgradingFromPro ? 150000 : 269000;

    const proceedToPayment = () => {
      setPaymentModalConfig({
        isOpen: true,
        type: paymentType,
        price,
        onConfirm: () => {
          handleConfirmUpgradeToExpert();
        },
      });
    };

    if (!user && !isAuthenticatedRef.current) {
      pendingPostAuthActionRef.current = proceedToPayment;
      setAuthModalNotice(
        isUpgradingFromPro
          ? 'Quý khách vui lòng đăng nhập hoặc đăng ký tài khoản để mở mã QR thanh toán nâng cấp từ Bản Pro lên Bản Chuyên Gia Expert (150.000đ).'
          : 'Quý khách vui lòng đăng nhập hoặc đăng ký tài khoản để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán Bản Chuyên Gia Expert (269.000đ).'
      );
      setIsAuthModalOpen(true);
      return;
    }

    proceedToPayment();
  };

  // Mở modal thanh toán thỉnh giáo Thầy Tôn (hỏi đáp - bắt buộc đăng nhập để lưu lịch sử hỏi đáp)
  const handleUnlockQuestions = (mode?: 'basic' | 'vip' | 'expert') => {
    const activeTier = tierRef.current || currentTier;
    const targetMode = mode || (activeTier === 'expert' ? 'expert' : activeTier === 'pro' ? 'vip' : 'basic');

    if (testerInfo?.isTester && targetMode !== 'expert') {
      alert(
        `Tài khoản Tester của bạn đã sử dụng hết ${testerInfo.maxQuestionsPerChart} câu hỏi cho lá số này.\n\nBạn có thể mở một lá số khác để tiếp tục kiểm thử hoặc liên hệ Admin nếu cần tăng thêm hạn mức câu hỏi.`
      );
      return;
    }

    const persistQuotaToDb = (nextQuota: QuestionsQuota) => {
      const activeLaSo = laSoRef.current || laSo;
      const activeDuongSo = duongSoRef.current || currentDuongSo;
      const activeChartId = chartIdRef.current || currentChartId;
      if (activeLaSo) {
        const updatedLaSo = { ...activeLaSo, quota: nextQuota };
        laSoRef.current = updatedLaSo;
        setLaSo(updatedLaSo);
        if (activeChartId && activeDuongSo) {
          saveOrUpdateChart({
            id: activeChartId,
            title: `${activeDuongSo.hoTen} (${activeDuongSo.gioiTinh} - ${activeDuongSo.namDuong})`,
            duongSoData: activeDuongSo,
            lasoData: updatedLaSo,
            readingHtml,
          }).catch(() => {});
        }
      }
    };

    const proceedToPayment = () => {
      if (targetMode === 'expert') {
        setPaymentModalConfig({
          isOpen: true,
          type: 'chat_expert',
          price: 129000,
          onConfirm: () => {
            const validExpertAsked = chatHistory.filter((c) => !c.isError && c.type === 'expert').length;
            updateQuestionsQuota((prev) => {
              const next = {
                ...prev,
                expertAllowed: Math.max(prev.expertAllowed || 0, validExpertAsked) + 2,
              };
              persistQuotaToDb(next);
              return next;
            });
          },
        });
      } else if (targetMode === 'vip') {
        setPaymentModalConfig({
          isOpen: true,
          type: 'chat_vip',
          price: 99000,
          onConfirm: () => {
            const validVipAsked = chatHistory.filter((c) => !c.isError && c.type === 'vip').length;
            updateQuestionsQuota((prev) => {
              const next = {
                ...prev,
                proAllowed: Math.max(prev.proAllowed, validVipAsked) + 2,
              };
              persistQuotaToDb(next);
              return next;
            });
          },
        });
      } else {
        setPaymentModalConfig({
          isOpen: true,
          type: 'chat_free',
          price: 49000,
          onConfirm: () => {
            const validBasicAsked = chatHistory.filter((c) => !c.isError && (c.type === 'basic' || !c.type)).length;
            updateQuestionsQuota((prev) => {
              const next = {
                ...prev,
                basicAllowed: Math.max(prev.basicAllowed, validBasicAsked) + 2,
              };
              persistQuotaToDb(next);
              return next;
            });
          },
        });
      }
    };

    if (!user && !isAuthenticatedRef.current) {
      pendingPostAuthActionRef.current = proceedToPayment;
      setAuthModalNotice(
        targetMode === 'expert'
          ? 'Quý khách vui lòng đăng nhập hoặc đăng ký tài khoản để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán 02 câu hỏi Chuyên Gia Expert (129.000đ).'
          : targetMode === 'vip'
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
  const handleSendMessage = async (userQuestion: string, mode: 'basic' | 'vip' | 'expert' = 'vip') => {
    if (!laSo) return;

    // Kiểm tra quota cứng: Nếu chưa đăng ký gói hoặc đã hỏi đủ hạn mức cho phép thì chặn
    const validCount = chatHistory.filter((c) => !c.isError).length;
    const totalAllowed =
      (questionsQuota?.expertAllowed || 0) +
      (questionsQuota?.proAllowed || 0) +
      (questionsQuota?.basicAllowed || 0);
    if (totalAllowed === 0 || validCount >= totalAllowed) {
      alert('Quý khách đã sử dụng hết số lượt câu hỏi của lá số này. Xin vui lòng nạp thêm lượt hỏi để tiếp tục đàm đạo cùng Thầy Tôn.');
      return;
    }

    setIsLoadingChat(true);

    try {
      const selectedModel =
        mode === 'expert'
          ? 'gemini-4-argon'
          : mode === 'vip'
          ? 'gemini-3.1-pro-preview'
          : 'gemini-2.5-flash';
      const res = await fetch('/api/tuvi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion,
          laSo,
          thongTinThem: laSo.duongSo?.thongTinThem,
          chieuCao: laSo.duongSo?.chieuCao,
          canNang: laSo.duongSo?.canNang,
          readingHtml,
          chatHistory,
          mode,
          model: selectedModel,
          lang: language,
          chartId: currentChartId,
          userId: user?.id,
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

        // Nếu đã đăng nhập và có chartId, lưu tin nhắn vào database nếu server chưa tự lưu
        if (currentChartId && !json.savedToDb) {
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
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }

    try {
      const { chart, chatMessages, error } = await getChartDetails(chartId);
      if (error || !chart) {
        alert('Không thể tải lá số: ' + (error || 'Không tìm thấy'));
        return;
      }

      let detectedTier: ServiceTier =
        testerInfo?.isTester
          ? (chart.duong_so_data?.tier === 'expert' || chart.laso_data?.tier === 'expert' ? 'expert' : 'pro')
          : (chart.duong_so_data?.tier ||
             chart.laso_data?.tier ||
             (chart.reading_html?.includes('Bản Expert') || chart.reading_html?.includes('CHUYÊN GIA EXPERT')
               ? 'expert'
               : chart.reading_html?.includes('Bản Pro') || chart.reading_html?.includes('CHUYÊN SÂU PRO')
               ? 'pro'
               : 'free'));

      // Tự động kiểm tra hóa đơn thanh toán trong tuvi_orders (Cơ chế Self-Healing chỉ khớp đúng lá số này)
      if (detectedTier !== 'expert') {
        try {
          const { data: paidOrders } = await supabase
            .from('tuvi_orders')
            .select('id, payment_type, status, chart_id, ho_ten')
            .or(`chart_id.eq.${chartId},user_id.eq.${chart.user_id || user?.id}`)
            .eq('status', 'PAID')
            .in('payment_type', ['reading_expert', 'upgrade_expert', 'reading_vip']);

          const matchingOrders = (paidOrders || []).filter(
            (o) =>
              o.chart_id === chartId ||
              (!o.chart_id &&
                o.ho_ten?.trim().toLowerCase() === chart.duong_so_data?.hoTen?.trim().toLowerCase())
          );

          if (matchingOrders.length > 0) {
            const hasExpert = matchingOrders.some(
              (o) => o.payment_type === 'reading_expert' || o.payment_type === 'upgrade_expert'
            );
            if (hasExpert) {
              detectedTier = 'expert';
            } else if (detectedTier === 'free') {
              detectedTier = 'pro';
            }
          }
        } catch (err) {
          // ignore
        }
      }

      setCurrentTier(detectedTier);
      tierRef.current = detectedTier;
      // Tự động an sao lại theo thuật toán mới nhất để đảm bảo định dạng chuẩn (Thê Thiếp cho Nam, đầy đủ sao, màu sắc chuẩn)
      let activeLaSo = chart.laso_data;
      if (chart.duong_so_data) {
        try {
          const resolvedNamXem = chart.duong_so_data.namXem || new Date().getFullYear();
          activeLaSo = lapLaSoTuVi(chart.duong_so_data, resolvedNamXem);
          activeLaSo.tier = detectedTier;
          if (chart.laso_data?.quota) activeLaSo.quota = chart.laso_data.quota;
          if (chart.laso_data?.needsReadingUpgrade) activeLaSo.needsReadingUpgrade = true;
        } catch (calcErr) {
          console.warn('Lỗi tính toán lại lá số đã lưu:', calcErr);
        }
      }
      laSoRef.current = activeLaSo;
      duongSoRef.current = chart.duong_so_data;
      chartIdRef.current = chart.id;
      setLaSo(activeLaSo);
      setCurrentDuongSo(chart.duong_so_data);
      setCurrentChartId(chart.id);
      let finalReadingHtml = chart.reading_html ? cleanReadingHtml(chart.reading_html) : undefined;
      // Khôi phục lại phân tích Thủ tướng (chỉ tay) đứt gãy cung Mệnh cho anh Trần Trọng Vân nếu bị ghi đè trước đó
      if (
        finalReadingHtml &&
        (chart.title?.includes('Trần Trọng Vân') || chart.duong_so_data?.hoTen?.includes('Trần Trọng Vân')) &&
        !finalReadingHtml.includes('đứt gãy')
      ) {
        const palmistrySection = `
<h4>✦ Soi Chiếu Thủ Tướng (Đường Chỉ Tay) &amp; Huyền Cơ Vết Đứt Gãy Cung Mệnh:</h4>
<p>Qua đối chiếu trực tiếp hình ảnh <b>Thủ tướng (bàn tay trái và tay phải của đương số)</b> với tọa độ <b>Cung Mệnh tại Thìn</b> và thế đứng Tam Phương Tứ Chính:</p>
<p>Trên gò Kim Tinh và trục đường <b>Sinh Đạo (Địa Vân)</b> kết hợp đường <b>Trí Đạo</b> của đương số xuất hiện một <b>nét đứt gãy chuyển giao tương ứng với vị trí cung Mệnh tại Thìn (Thiên La - Địa Võng)</b> ở độ tuổi 38 - 45 tuổi (chính là giai đoạn 42 tuổi hiện tại của đương số). Đây là dấu hiệu huyền cơ cực kỳ quan trọng:</p>
<ul>
  <li><b>Về biến chuyển vận mệnh &amp; sự nghiệp:</b> Nét đứt gãy cung Mệnh này tuyệt đối <i>không phải</i> điềm báo suy tổn thọ mạng (bởi vì bên dưới có đường Sinh đạo phụ chạy song song nâng đỡ và gò Thái Dương rất sáng), mà thực chất là dấu mốc <b>"Lột xác chuyển đoạn"</b> – báo hiệu đương số phải trải qua một khúc quanh thay đổi môi trường hoặc đổi hẳn ngành nghề/mô hình kinh doanh (từ mô hình cũ chuyển sang làm chủ kinh doanh ẩm thực tại TP. Vinh, Nghệ An).</li>
  <li><b>Về sức khỏe &amp; tinh thần:</b> Vết đứt đoạn tại cung Mệnh phản ánh giai đoạn này đương số phải lao tâm khổ tứ, hao tổn nhiều tâm trí suy tính cho tương lai. Cần chú trọng chăm sóc hệ tiêu hóa, dạ dày và tránh để stress kéo dài làm ảnh hưởng đến nguyên khí.</li>
  <li><b>Về chiến lược kinh doanh lâu dài:</b> Sau khúc quanh đứt gãy này, đường Sinh đạo và Tài vận tiếp tục vươn dài vững chắc hướng về gò Thủy Tinh, báo hiệu mô hình kinh doanh sau giai đoạn khó khăn ban đầu sẽ đi vào ổn định, tích tụ tài lộc bền vững đúng cách cục Thân cư Tài Bạch. Cần lấy chữ Tín làm đầu và kiên trì với chiến lược chất lượng.</li>
</ul>
`;
        if (finalReadingHtml.includes('<h3>II.')) {
          finalReadingHtml = finalReadingHtml.replace('<h3>II.', `${palmistrySection}\n<h3>II.`);
        } else {
          finalReadingHtml += palmistrySection;
        }
        updateChartReading(chart.id, finalReadingHtml).catch(() => {});
      }

      setReadingHtml(finalReadingHtml);
      setReadingError(undefined);
      setChatHistory(chatMessages || []);
      let loadedQuota: QuestionsQuota = {
        basicAllowed: 0,
        proAllowed: testerInfo?.isTester
          ? testerInfo.maxQuestionsPerChart
          : (detectedTier === 'pro' ? 2 : 0),
        expertAllowed: testerInfo?.isTester && detectedTier === 'expert'
          ? testerInfo.maxQuestionsPerChart
          : (detectedTier === 'expert' ? 2 : 0),
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
              expertAllowed: detectedTier === 'expert' ? Math.max(2, Number(parsed.expertAllowed || 0)) : Number(parsed.expertAllowed || 0),
            };
          } catch {}
        } else {
          const storedQ =
            (chart.id ? localStorage.getItem(`tuvi_q_${chart.id}`) : null) ||
            (chart.duong_so_data ? localStorage.getItem(`tuvi_q_${chart.duong_so_data.hoTen}_${chart.duong_so_data.namDuong}`) : null);
          if (storedQ && Number(storedQ) > 0) {
            const total = Number(storedQ);
            loadedQuota = {
              basicAllowed: total,
              proAllowed: detectedTier === 'pro' ? 2 : 0,
              expertAllowed: detectedTier === 'expert' ? 2 : 0,
            };
          }
        }
      }
      if (chart.laso_data?.quota) {
        loadedQuota = {
          basicAllowed: Math.max(loadedQuota.basicAllowed, Number(chart.laso_data.quota.basicAllowed || 0)),
          proAllowed: detectedTier === 'pro' ? Math.max(2, Number(chart.laso_data.quota.proAllowed || 0)) : Number(chart.laso_data.quota.proAllowed || 0),
          expertAllowed: detectedTier === 'expert' ? Math.max(2, Number(chart.laso_data.quota.expertAllowed || 0)) : Number(chart.laso_data.quota.expertAllowed || 0),
        };
      }
      if (detectedTier === 'pro') {
        loadedQuota.proAllowed = Math.max(2, loadedQuota.proAllowed);
      }
      if (detectedTier === 'expert') {
        loadedQuota.expertAllowed = Math.max(2, loadedQuota.expertAllowed || 0);
      }
      if (typeof window !== 'undefined') {
        if (chart.id) localStorage.setItem(`tuvi_quota_${chart.id}`, JSON.stringify(loadedQuota));
        if (chart.duong_so_data) localStorage.setItem(`tuvi_quota_${chart.duong_so_data.hoTen}_${chart.duong_so_data.namDuong}`, JSON.stringify(loadedQuota));
      }
      quotaRef.current = loadedQuota;
      setQuestionsQuota(loadedQuota);

      // Tự động nâng cấp lên Pro hoặc Expert nếu phát hiện có đơn PAID nhưng database chưa lưu hoặc cần sinh bài luận mới
      if (detectedTier === 'pro' || detectedTier === 'expert') {
        const cleanDuongSo: DuLieuDuongSo = {
          ...chart.duong_so_data,
          tier: detectedTier,
        };
        const updatedLaSo: LaSoData = {
          ...activeLaSo,
          tier: detectedTier,
          quota: loadedQuota,
          needsReadingUpgrade: false,
        };

        const needsNewReading =
          !chart.reading_html ||
          Boolean(chart.laso_data?.needsReadingUpgrade) ||
          (detectedTier === 'pro' && (!chart.duong_so_data?.tier || chart.duong_so_data?.tier === 'free') && !chart.reading_html?.includes('Bản Pro') && !chart.reading_html?.includes('CHUYÊN SÂU')) ||
          (detectedTier === 'expert' && chart.duong_so_data?.tier !== 'expert' && !chart.reading_html?.includes('CHUYÊN GIA EXPERT'));

        if (needsNewReading) {
          setIsLoadingReading(true);
          generateReading(updatedLaSo, chart.duong_so_data, detectedTier, chart.id)
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
            .catch(console.error)
            .finally(() => setIsLoadingReading(false));
        } else if (chart.duong_so_data?.tier !== detectedTier) {
          // Nếu đã có bài luận giải đúng cấp độ rồi, chỉ cập nhật tier mà không sinh lại bài
          saveOrUpdateChart({
            id: chart.id,
            title: chart.title,
            duongSoData: cleanDuongSo,
            lasoData: updatedLaSo,
            readingHtml: finalReadingHtml || chart.reading_html || undefined,
          }).catch(console.error);
        }
      }

      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }, 50);
      }
    } catch (e: any) {
      alert('Lỗi tải dữ liệu lá số: ' + e.message);
    } finally {
      setIsLoadingReading(false);
    }
  };

  const isLoggingOutRef = useRef<boolean>(false);

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tuvi_active_session');
      window.history.replaceState(null, '', '/');
    }
    laSoRef.current = null;
    duongSoRef.current = null;
    chartIdRef.current = null;
    tierRef.current = 'free';
    quotaRef.current = { basicAllowed: 0, proAllowed: 0, expertAllowed: 0 };
    setLaSo(null);
    setCurrentDuongSo(null);
    setCurrentChartId(null);
    setCurrentTier('free');
    setQuestionsQuota({ basicAllowed: 0, proAllowed: 0, expertAllowed: 0 });
    setReadingHtml(undefined);
    setReadingError(undefined);
    setChatHistory([]);
    setIsRestoringSession(false);
    setIsEditing(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOutClean = async () => {
    isLoggingOutRef.current = true;
    isAuthenticatedRef.current = false;
    handleReset();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tuvi_active_session');
    }
    try {
      await signOut();
    } catch (err) {
      console.error('Lỗi signOut:', err);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tuvi_active_session');
    }
    setTimeout(() => {
      isLoggingOutRef.current = false;
    }, 600);
  };

  // Lắng nghe khi người dùng đăng xuất hoặc chuyển đổi sang một tài khoản khác: Tự động dọn dẹp sạch toàn bộ lá số cũ
  // (Nếu đăng nhập từ trạng thái khách chưa đăng nhập thì giữ nguyên lá số đang xem để không làm ngắt luồng thanh toán)
  const prevUserRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    if (prevUserRef.current !== undefined) {
      const currentUserId = user ? user.id : null;
      const wasLoggedIn = Boolean(prevUserRef.current);
      const isLoggingOut = wasLoggedIn && !currentUserId;
      const isSwitchingUser = wasLoggedIn && Boolean(currentUserId) && prevUserRef.current !== currentUserId;

      if (isLoggingOut || isSwitchingUser) {
        isLoggingOutRef.current = true;
        handleReset();
        setTimeout(() => {
          isLoggingOutRef.current = false;
        }, 600);
      }
    }
    prevUserRef.current = user ? user.id : null;
  }, [user]);

  // Khôi phục phiên làm việc đang xem khi trang được tải lần đầu / sau khi F5
  useEffect(() => {
    if (typeof window === 'undefined' || isAuthLoading) return;
    if (isLoggingOutRef.current) return;
    // Nếu vừa lập lá số hoặc vừa đăng nhập từ bảng yêu cầu đăng nhập để lập lá số/thanh toán, không ghi đè bằng lá số cũ
    if (laSoRef.current || pendingPostAuthActionRef.current) {
      setIsRestoringSession(false);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const urlChartId = urlParams.get('chartId');

    const savedSessionStr = localStorage.getItem('tuvi_active_session');
    let hasRestored = false;

    if (savedSessionStr) {
      try {
        const session = JSON.parse(savedSessionStr);
        if (session && session.laSo && session.duongSo) {
          // BẢO VỆ TÍNH ĐỘC LẬP TÀI KHOẢN:
          // 1. Nếu đang có tài khoản đăng nhập và session cũ thuộc về một tài khoản KHÁC (session.userId có giá trị nhưng khác user.id) -> Xóa sạch!
          if (user && session.userId && session.userId !== user.id) {
            localStorage.removeItem('tuvi_active_session');
            window.history.replaceState(null, '', '/');
            setIsRestoringSession(false);
            return;
          }

          // 2. Nếu đang là khách (chưa đăng nhập): Nếu session trước đó thuộc về một tài khoản đã đăng xuất -> Xóa sạch!
          if (!user && session.userId) {
            localStorage.removeItem('tuvi_active_session');
            window.history.replaceState(null, '', '/');
            setIsRestoringSession(false);
            return;
          }

          if (!urlChartId || urlChartId === session.chartId) {
            let activeLaSo = session.laSo;
            if (session.duongSo) {
              try {
                const resolvedNamXem = session.duongSo.namXem || new Date().getFullYear();
                activeLaSo = lapLaSoTuVi(session.duongSo, resolvedNamXem);
                activeLaSo.tier = session.tier || 'free';
                if (session.quota) activeLaSo.quota = session.quota;
                // Cập nhật lại session trong localStorage với lá số chuẩn mới nhất
                try {
                  localStorage.setItem(
                    'tuvi_active_session',
                    JSON.stringify({ ...session, userId: user ? user.id : session.userId, laSo: activeLaSo })
                  );
                } catch {}
              } catch (calcErr) {
                console.warn('Lỗi tính toán lại phiên làm việc:', calcErr);
              }
            }
            laSoRef.current = activeLaSo;
            duongSoRef.current = session.duongSo;
            chartIdRef.current = session.chartId || null;
            tierRef.current = session.tier || 'free';
            if (session.quota) quotaRef.current = session.quota;

            setLaSo(activeLaSo);
            setCurrentDuongSo(session.duongSo);
            setCurrentChartId(session.chartId || null);
            setCurrentTier(session.tier || 'free');
            if (session.readingHtml) setReadingHtml(cleanReadingHtml(session.readingHtml));
            if (Array.isArray(session.chatHistory)) setChatHistory(session.chatHistory);
            if (session.quota) setQuestionsQuota(session.quota);
            hasRestored = true;

            // Nếu có chartId và user đã đăng nhập, ngầm làm mới từ database để luôn cập nhật
            if (session.chartId && user) {
              getChartDetails(session.chartId)
                .then(async ({ chart, chatMessages }) => {
                  if (chart) {
                    if (chart.reading_html) setReadingHtml(cleanReadingHtml(chart.reading_html));
                    if (chatMessages && chatMessages.length > 0) setChatHistory(chatMessages);
                    let detectedTier: ServiceTier =
                      chart.duong_so_data?.tier ||
                      chart.laso_data?.tier ||
                      (chart.reading_html?.includes('Bản Expert') || chart.reading_html?.includes('CHUYÊN GIA EXPERT')
                        ? 'expert'
                        : chart.reading_html?.includes('Bản Pro') || chart.reading_html?.includes('CHUYÊN SÂU PRO')
                        ? 'pro'
                        : session.tier || 'free');

                    // Kiểm tra Self-Healing từ tuvi_orders (chỉ khớp đúng lá số này)
                    if (detectedTier !== 'expert') {
                      try {
                        const { data: paidOrders } = await supabase
                          .from('tuvi_orders')
                          .select('id, payment_type, status, chart_id, ho_ten')
                          .or(`chart_id.eq.${session.chartId},user_id.eq.${user.id}`)
                          .eq('status', 'PAID')
                          .in('payment_type', ['reading_expert', 'upgrade_expert', 'reading_vip']);

                        const matchingOrders = (paidOrders || []).filter(
                          (o) =>
                            o.chart_id === session.chartId ||
                            (!o.chart_id &&
                              o.ho_ten?.trim().toLowerCase() === chart.duong_so_data?.hoTen?.trim().toLowerCase())
                        );

                        if (matchingOrders.length > 0) {
                          const hasExpert = matchingOrders.some(
                            (o) => o.payment_type === 'reading_expert' || o.payment_type === 'upgrade_expert'
                          );
                          if (hasExpert) {
                            detectedTier = 'expert';
                          } else if (detectedTier === 'free') {
                            detectedTier = 'pro';
                          }
                        }
                      } catch (err) {}
                    }

                    tierRef.current = detectedTier;
                    setCurrentTier(detectedTier);

                    // Tự động nâng cấp nếu phát hiện đơn hàng đã thanh toán hoặc cần sinh bài luận mới
                    if (detectedTier === 'pro' || detectedTier === 'expert') {
                      const cleanDuongSo: DuLieuDuongSo = {
                        ...chart.duong_so_data,
                        tier: detectedTier,
                      };
                      const syncedQuota: QuestionsQuota = {
                        basicAllowed: Number(chart.laso_data?.quota?.basicAllowed || quotaRef.current.basicAllowed || 0),
                        proAllowed:
                          detectedTier === 'pro'
                            ? Math.max(2, Number(chart.laso_data?.quota?.proAllowed || quotaRef.current.proAllowed || 0))
                            : Number(chart.laso_data?.quota?.proAllowed || quotaRef.current.proAllowed || 0),
                        expertAllowed:
                          detectedTier === 'expert'
                            ? Math.max(2, Number(chart.laso_data?.quota?.expertAllowed || quotaRef.current.expertAllowed || 0))
                            : Number(chart.laso_data?.quota?.expertAllowed || quotaRef.current.expertAllowed || 0),
                      };
                      quotaRef.current = syncedQuota;
                      setQuestionsQuota(syncedQuota);

                      const updatedLaSo: LaSoData = {
                        ...chart.laso_data,
                        tier: detectedTier,
                        quota: syncedQuota,
                        needsReadingUpgrade: false,
                      };

                      const needsNewReading =
                        !chart.reading_html ||
                        Boolean(chart.laso_data?.needsReadingUpgrade) ||
                        (detectedTier === 'pro' &&
                          (!chart.duong_so_data?.tier || chart.duong_so_data?.tier === 'free') &&
                          !chart.reading_html?.includes('Bản Pro') &&
                          !chart.reading_html?.includes('CHUYÊN SÂU')) ||
                        (detectedTier === 'expert' &&
                          chart.duong_so_data?.tier !== 'expert' &&
                          !chart.reading_html?.includes('CHUYÊN GIA EXPERT'));

                      if (needsNewReading) {
                        setIsLoadingReading(true);
                        generateReading(updatedLaSo, chart.duong_so_data, detectedTier, chart.id)
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
                          .catch(console.error)
                          .finally(() => setIsLoadingReading(false));
                      } else if (chart.duong_so_data?.tier !== detectedTier) {
                        // Nếu đã có bài luận giải đúng cấp độ rồi, chỉ cập nhật tier, tuyệt đối không ghi đè bài cũ
                        saveOrUpdateChart({
                          id: chart.id,
                          title: chart.title,
                          duongSoData: cleanDuongSo,
                          lasoData: updatedLaSo,
                          readingHtml: chart.reading_html || undefined,
                        }).catch(console.error);
                      }
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

    // Nếu người dùng đã đăng nhập và chưa mở lá số nào: Tự động mở lá số gần nhất trong Sổ tay trên Supabase
    if (!hasRestored && user && !laSoRef.current && !pendingPostAuthActionRef.current) {
      getUserCharts()
        .then(({ charts }) => {
          if (charts && charts.length > 0 && !laSoRef.current && !pendingPostAuthActionRef.current) {
            handleSelectSavedChart(charts[0].id).finally(() => {
              setIsRestoringSession(false);
            });
          } else {
            setIsRestoringSession(false);
          }
        })
        .catch(() => {
          setIsRestoringSession(false);
        });
      return;
    }


    setIsRestoringSession(false);
  }, [isAuthLoading, user]);

  // Tự động lưu phiên làm việc hiện tại vào localStorage để khi F5 / refresh vẫn giữ nguyên trang đang xem
  useEffect(() => {
    if (typeof window === 'undefined' || isRestoringSession) return;
    if (isLoggingOutRef.current) return;
    if (!laSo || !currentDuongSo) return;

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
  }, [laSo, currentDuongSo, currentChartId, currentTier, readingHtml, chatHistory, questionsQuota, isRestoringSession, user]);

  return (
    <main className="min-h-screen cosmic-bg py-4 sm:py-6 px-2.5 sm:px-6 md:px-8 flex flex-col justify-between relative w-full max-w-full overflow-x-hidden">
      <div className="flex-1 w-full max-w-full">
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
          onSignOut={handleSignOutClean}
        />

        {/* Banner dành riêng cho Tài Khoản Tester */}
        {testerInfo?.isTester && (
          <div className="max-w-[1060px] mx-auto mb-5 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/90 via-slate-900/95 to-purple-950/90 border border-purple-500/40 shadow-xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-200 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-purple-300 flex items-center gap-2">
                  <span>TÀI KHOẢN TRẢI NGHIỆM TESTER (VIP PRO)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 uppercase font-mono">
                    VIP TESTER
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Hạn mức: Đã lập <b>{testerChartsCount}/{testerInfo.maxCharts >= 999 ? 'Không giới hạn' : `${testerInfo.maxCharts} lá`}</b> • Mỗi lá số được hỏi tối đa <b>{testerInfo.maxQuestionsPerChart >= 999 ? 'Không giới hạn' : `${testerInfo.maxQuestionsPerChart} câu VIP`}</b> cùng Thầy Tôn.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleOpenSavedCharts}
                className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-200 text-xs font-semibold transition cursor-pointer"
              >
                Mở Sổ Tay ({testerChartsCount} lá)
              </button>
            </div>
          </div>
        )}

        {isRestoringSession ? (
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-10 h-10 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-3" />
            <p className="text-sm text-amber-300/80 font-serif">
              {t('reading.analyzing', 'Đang tải lại lá số của quý khách...')}
            </p>
          </div>
        ) : (!laSo || isEditing) ? (
          <div className="my-auto py-6 sm:py-10 space-y-8 sm:space-y-12">
            <TuViForm
              onSubmit={handleFormSubmit}
              isLoading={isLoadingReading}
              onOpenSavedCharts={handleOpenSavedCharts}
              initialData={isEditing ? (currentDuongSo || laSo?.duongSo) : null}
              onCancelEdit={isEditing && laSo ? () => setIsEditing(false) : undefined}
              onRequireAuth={(action, notice) => {
                pendingPostAuthActionRef.current = action;
                setAuthModalNotice(notice);
                setIsAuthModalOpen(true);
              }}
            />

            {!isEditing && (
              <>
                {/* Mục Giới thiệu về Thầy Tôn, Hệ sinh thái Dịch vụ & FAQ */}
                <AboutThayTon />

                {/* Mục Đánh giá & Cảm nhận từ Chuyên gia & Đương số */}
                <Testimonials />
              </>
            )}

            {!isEditing && (
              /* Khối Đặt Lịch Xem Trực Tiếp Online & Offline Cùng Thầy Tôn */
              <BookingBanner />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Thanh trạng thái gói dịch vụ khi đang xem lá số (hiện khi đang ở Bản Miễn Phí hoặc Bản Pro) */}
            {currentTier !== 'expert' && (
              <div className="flex items-center justify-end max-w-[1060px] mx-auto">
                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-900/90 border border-slate-700 text-slate-300">
                    <span>
                      {currentTier === 'pro'
                        ? t('form.proTitle', '👑 Bản Chuyên Sâu Pro')
                        : t('form.freeTitle', '📜 Bản Miễn Phí')}
                    </span>
                  </span>
                  {currentTier === 'free' && (
                    <button
                      type="button"
                      onClick={openUpgradeModal}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                      <span>{t('reading.upgradeBtn', '⚡ Nâng Cấp Pro (119.000đ)')}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openUpgradeExpertModal()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white shadow-md shadow-purple-500/25 transition transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Gem className="w-3.5 h-3.5" />
                    <span>
                      {currentTier === 'pro'
                        ? t('reading.upgradeProToExpertBtn', '💎 Nâng Cấp Bản Expert (150.000đ)')
                        : t('reading.upgradeExpertBtn', '💎 Bản Expert (269.000đ)')}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Bàn Cờ Lá Số Tử Vi */}
            <LaSoBanCo
              laSo={laSo}
              onReset={handleReset}
              onEdit={() => {
                setIsEditing(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenSavedCharts={handleOpenSavedCharts}
            />

            {/* Bài Bình Giải Chuyên Sâu */}
            <LuanGiaiAI
              readingHtml={readingHtml}
              isLoading={isLoadingReading}
              error={readingError}
              tier={currentTier}
              onUpgrade={openUpgradeModal}
              onUpgradeToExpert={() => openUpgradeExpertModal()}
              isUpgrading={isUpgrading}
              duongSo={currentDuongSo || undefined}
              laSo={laSo || undefined}
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
              onUpgradeToExpert={() => openUpgradeExpertModal()}
            />

            {/* Mục Giới thiệu về Thầy Tôn, Hệ sinh thái Dịch vụ & FAQ */}
            <AboutThayTon />

            {/* Mục Đánh giá & Cảm nhận từ Chuyên gia & Đương số */}
            <Testimonials />

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
        onUpgradeChart={async (chartId) => {
          await handleSelectSavedChart(chartId);
          openUpgradeModal();
        }}
        onUpgradeExpertChart={async (chartId, fromTier) => {
          await handleSelectSavedChart(chartId);
          openUpgradeExpertModal(fromTier);
        }}
        activeChartId={currentChartId}
      />

      {/* Nút Liên Hệ Nhanh (Zalo & Gọi Điện Đặt Lịch Offline) */}
      <FloatingContact />

      <footer className="text-center text-xs text-slate-400 py-6 border-t border-slate-800/60 print:hidden mt-8 space-y-2">
        <div className="flex items-center justify-center gap-3 sm:gap-6 text-xs text-slate-400 font-medium flex-wrap">
          <a href="#gioi-thieu-thay-ton" className="hover:text-amber-400 transition">
            {t('footer.about')}
          </a>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <a href="#dich-vu-tu-vi-thay-ton" className="hover:text-amber-400 transition">
            Dịch Vụ & Bảng Giá
          </a>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <a href="#cam-nhan-chuyen-gia" className="hover:text-amber-400 transition">
            {t('footer.testimonials')}
          </a>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <a href="#cau-hoi-thuong-gap" className="hover:text-amber-400 transition">
            Câu Hỏi Thường Gặp
          </a>
          <span className="text-slate-600 hidden sm:inline">•</span>
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
