'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { DuLieuDuongSo, LaSoData, ChatMessage, ServiceTier, QuestionsQuota } from '@/types/tuvi';
import { lapLaSoTuVi, computeTamHanAnalysis, getCurrentVietnamTimeInfo } from '@/lib/tuvi/anSao';
import TuViForm from '@/components/TuViForm';
import LaSoBanCo from '@/components/LaSoBanCo';
import LuanGiaiAI from '@/components/LuanGiaiAI';
import ChatThayTon from '@/components/ChatThayTon';
import type { AuthModalTab } from '@/components/AuthModal';
import type { PaymentPurpose } from '@/components/PaymentModal';
import VoucherCountdownBanner, { ClientVoucherInfo } from '@/components/VoucherCountdownBanner';
import UserNav from '@/components/UserNav';
import FloatingContact from '@/components/FloatingContact';
import AboutThayTon from '@/components/AboutThayTon';
import HomeFunnelContent from '@/components/HomeFunnelContent';
import BookingBanner from '@/components/BookingBanner';
import CoursePromoBanner from '@/components/CoursePromoBanner';
import Testimonials from '@/components/Testimonials';
import VanHanLandingHero from '@/components/VanHanLandingHero';
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
import { trackLeadChart, trackMetaEvent } from '@/lib/metaPixel';
import { trackGa4ViewVanHan } from '@/lib/googleAnalytics';
import { getBearerAuthHeaders } from '@/lib/adminClientAuth';

const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });
const SavedChartsModal = dynamic(() => import('@/components/SavedChartsModal'), { ssr: false });
const PaymentModal = dynamic(() => import('@/components/PaymentModal'), { ssr: false });
const BiometricSupplementPanel = dynamic(() => import('@/components/BiometricSupplementPanel'), { ssr: false });

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function isValidUuidClient(val?: string | null): val is string {
  return typeof val === 'string' && UUID_REGEX.test(val.trim());
}

export interface TuViWorkspaceProps {
  landingMode?: 'default' | 'van-han';
}

export default function TuViWorkspaceClient({ landingMode = 'default' }: TuViWorkspaceProps) {
  const isVanHanLanding = landingMode === 'van-han';
  const basePath = isVanHanLanding ? '/van-han' : '/';
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
  const [isRestoringSession, setIsRestoringSession] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [adAngle, setAdAngle] = useState<'default' | 'dien-trach-quan-loc'>('default');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const utmContent = (params.get('utm_content') || '').toLowerCase();
      const utmCampaign = (params.get('utm_campaign') || '').toLowerCase();
      if (
        utmContent.includes('ad06') ||
        utmContent.includes('dientrach') ||
        utmCampaign.includes('dientrach')
      ) {
        setAdAngle('dien-trach-quan-loc');
        sessionStorage.setItem('tuvi_ad_angle', 'dien-trach-quan-loc');
      } else if (sessionStorage.getItem('tuvi_ad_angle') === 'dien-trach-quan-loc') {
        setAdAngle('dien-trach-quan-loc');
      }
    } catch {
      // ignore
    }
  }, []);

  // Trạng thái Mã ưu đãi đếm ngược (Drip Email Funnel) & chủ sở hữu lá số mở từ Email
  const [activeVoucher, setActiveVoucher] = useState<ClientVoucherInfo | null>(null);
  const activeVoucherRef = useRef<ClientVoucherInfo | null>(null);
  const [emailLinkOwner, setEmailLinkOwner] = useState<{
    userId?: string | null;
    email?: string | null;
  } | null>(null);
  const emailLinkOwnerRef = useRef<{
    userId?: string | null;
    email?: string | null;
  } | null>(null);
  const isHydratingEmailLinkRef = useRef<boolean>(false);

  const clearActiveVoucher = useCallback(() => {
    activeVoucherRef.current = null;
    setActiveVoucher(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tuvi_active_voucher');
    }
  }, []);

  const handlePaymentVoucherExpired = useCallback(() => {
    clearActiveVoucher();
    setPaymentModalConfig((prev) => ({
      ...prev,
      price:
        prev.type === 'reading_expert'
          ? 269000
          : prev.type === 'reading_vip'
          ? 119000
          : prev.price,
      originalPrice: undefined,
      voucherCode: undefined,
      discountPercent: undefined,
    }));
  }, [clearActiveVoucher]);

  useEffect(() => {
    activeVoucherRef.current = activeVoucher;
  }, [activeVoucher]);

  useEffect(() => {
    emailLinkOwnerRef.current = emailLinkOwner;
  }, [emailLinkOwner]);

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

  // Ghi nhận ViewContent (Meta + GA4) cho Landing Page Giải Mã Vận Hạn 2026 - 2027 (/van-han)
  useEffect(() => {
    if (!isVanHanLanding || typeof window === 'undefined') return;
    trackMetaEvent('ViewContent', {
      content_name: 'Landing Page Giai Ma Tam Han 2026-2027',
      content_category: 'Van Han VIP Pro & Expert',
      value: 119000,
      currency: 'VND',
    });
    trackGa4ViewVanHan();
  }, [isVanHanLanding]);

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

  // Khôi phục chủ sở hữu email link từ sessionStorage (giúp giữ mạch thanh toán không cần đăng nhập lại khi F5)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedOwner = sessionStorage.getItem('tuvi_email_link_owner');
      if (savedOwner) {
        const parsed = JSON.parse(savedOwner);
        if (parsed && (parsed.userId || parsed.email)) {
          emailLinkOwnerRef.current = parsed;
          setEmailLinkOwner(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Bắt mã Voucher đếm ngược & mở trực tiếp Lá Số từ Email tự động (hỗ trợ xuyên trình duyệt FB -> Gmail -> Safari/Chrome)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const urlVoucher = (params.get('voucher') || '').trim().toUpperCase();
    const rawUrlChartId = (params.get('chartId') || '').trim();
    const urlChartId = isValidUuidClient(rawUrlChartId) ? rawUrlChartId : '';
    const urlEtoken = (params.get('etoken') || '').trim();
    const urlPkg = (params.get('pkg') || '').trim().toLowerCase(); // 'pro' | 'expert'
    const savedVoucher = (localStorage.getItem('tuvi_active_voucher') || '').trim().toUpperCase();

    const codeToValidate = urlVoucher || savedVoucher;
    const hasEmailChartToken = Boolean(urlChartId && (urlVoucher || urlEtoken));

    if (!codeToValidate && !hasEmailChartToken && !user?.id) {
      return;
    }

    if (hasEmailChartToken) {
      isHydratingEmailLinkRef.current = true;
      setIsRestoringSession(true);
    }

    let cancelled = false;

    getBearerAuthHeaders({ 'Content-Type': 'application/json' })
      .then((headers) =>
        fetch('/api/voucher/validate', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            code: codeToValidate || undefined,
            chartId: urlChartId || undefined,
            etoken: urlEtoken || undefined,
            userId: user?.id || undefined,
          }),
        })
      )
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        let validatedVoucher: ClientVoucherInfo | null = null;

        if (data?.valid && data?.voucher) {
          validatedVoucher = data.voucher as ClientVoucherInfo;
          activeVoucherRef.current = validatedVoucher;
          setActiveVoucher(validatedVoucher);
          try {
            localStorage.setItem('tuvi_active_voucher', validatedVoucher.code);
          } catch {}

          if (validatedVoucher.userId || validatedVoucher.email) {
            const ownerObj = {
              userId: validatedVoucher.userId || null,
              email: validatedVoucher.email || null,
            };
            emailLinkOwnerRef.current = ownerObj;
            setEmailLinkOwner(ownerObj);
            try {
              sessionStorage.setItem('tuvi_email_link_owner', JSON.stringify(ownerObj));
            } catch {}
          }
        } else if (codeToValidate) {
          clearActiveVoucher();
        }

        // Nếu link email trả kèm dữ liệu lá số đã lưu của khách: tự động nạp lên màn hình ngay lập tức
        if (data?.chartBundle?.chart && (hasEmailChartToken || !laSoRef.current)) {
          const chart = data.chartBundle.chart;
          const rawMessages = data.chartBundle.messages || [];

          if (data.chartBundle.ownerUserId || data.chartBundle.ownerEmail) {
            const ownerObj = {
              userId: data.chartBundle.ownerUserId || null,
              email: data.chartBundle.ownerEmail || null,
            };
            emailLinkOwnerRef.current = ownerObj;
            setEmailLinkOwner(ownerObj);
            try {
              sessionStorage.setItem('tuvi_email_link_owner', JSON.stringify(ownerObj));
              if (ownerObj.email) {
                localStorage.setItem('tuvi_customer_email', ownerObj.email);
              }
            } catch {}
          }

          const detectedTier: ServiceTier =
            chart.duong_so_data?.tier ||
            chart.laso_data?.tier ||
            (chart.reading_html?.includes('Bản Expert') || chart.reading_html?.includes('CHUYÊN GIA EXPERT')
              ? 'expert'
              : chart.reading_html?.includes('Bản Pro') || chart.reading_html?.includes('CHUYÊN SÂU PRO')
              ? 'pro'
              : 'free');

          let hydratedLaSo = chart.laso_data;
          if (chart.duong_so_data) {
            try {
              const resolvedNamXem = chart.duong_so_data.namXem || getCurrentVietnamTimeInfo().namAm;
              hydratedLaSo = lapLaSoTuVi(chart.duong_so_data, resolvedNamXem);
              hydratedLaSo.tier = detectedTier;
              if (chart.laso_data?.quota) hydratedLaSo.quota = chart.laso_data.quota;
            } catch {}
          }

          const mappedChat: ChatMessage[] = rawMessages.map((m: any) => ({
            q: m.question,
            a: m.answer,
            type:
              (m.message_type as 'basic' | 'vip' | 'expert') ||
              (m.answer?.includes('Chuyên Gia') || m.answer?.includes('Expert')
                ? 'expert'
                : m.answer?.includes('Chuyên Sâu') || m.answer?.includes('VIP Pro')
                ? 'vip'
                : 'basic'),
          }));

          laSoRef.current = hydratedLaSo;
          duongSoRef.current = chart.duong_so_data;
          chartIdRef.current = chart.id;
          tierRef.current = detectedTier;

          setLaSo(hydratedLaSo);
          setCurrentDuongSo(chart.duong_so_data);
          setCurrentChartId(chart.id);
          setCurrentTier(detectedTier);
          setReadingHtml(chart.reading_html ? cleanReadingHtml(chart.reading_html) : undefined);
          setReadingError(undefined);
          setChatHistory(mappedChat);

          if (detectedTier !== 'free') {
            clearActiveVoucher();
          } else if (urlPkg === 'pro' || urlPkg === 'expert') {
            const hasVerifiedAccountOwner = Boolean(
              (user?.id && user?.email) ||
                (data?.chartBundle?.ownerUserId && data?.chartBundle?.ownerEmail) ||
                (validatedVoucher?.userId && validatedVoucher?.email)
            );
            const openUrlPkgPayment = () => {
              if (urlPkg === 'expert') {
                setPaymentModalConfig({
                  isOpen: true,
                  type: 'reading_expert',
                  price: validatedVoucher ? validatedVoucher.prices.reading_expert : 269000,
                  originalPrice: validatedVoucher ? 269000 : undefined,
                  voucherCode: validatedVoucher?.code,
                  discountPercent: validatedVoucher?.discountPercent,
                  onConfirm: () => {
                    clearActiveVoucher();
                    handleConfirmUpgradeToExpert();
                  },
                });
              } else {
                setPaymentModalConfig({
                  isOpen: true,
                  type: 'reading_vip',
                  price: validatedVoucher ? validatedVoucher.prices.reading_vip : 119000,
                  originalPrice: validatedVoucher ? 119000 : undefined,
                  voucherCode: validatedVoucher?.code,
                  discountPercent: validatedVoucher?.discountPercent,
                  onConfirm: () => {
                    clearActiveVoucher();
                    handleConfirmUpgradeToPro();
                  },
                });
              }
            };

            // Chỉ mở thẳng bảng QR Thanh Toán khi lá số đã gắn với tài khoản hợp lệ; nếu chưa có tài khoản thì bắt buộc Đăng ký / Đăng nhập trước
            setTimeout(() => {
              if (hasVerifiedAccountOwner) {
                openUrlPkgPayment();
              } else {
                pendingPostAuthActionRef.current = openUrlPkgPayment;
                setAuthModalTab('signup');
                setAuthModalNotice(
                  'Quý khách vui lòng đăng ký tài khoản (hoặc đăng nhập) để hệ thống lưu giữ lá số và mở mã QR thanh toán.'
                );
                setIsAuthModalOpen(true);
              }
            }, 150);
          }

          // Làm sạch URL để khi F5 không tự bật lại modal thanh toán nhưng vẫn giữ chartId
          try {
            const cleanUrl = chart.id ? `${basePath}?chartId=${chart.id}` : basePath;
            window.history.replaceState(null, '', cleanUrl);
          } catch {}
        } else if (urlPkg === 'pro' || urlPkg === 'expert') {
          try {
            const cleanUrl = urlChartId ? `${basePath}?chartId=${urlChartId}` : basePath;
            window.history.replaceState(null, '', cleanUrl);
          } catch {}
        }
      })
      .catch((err) => {
        console.warn('[VOUCHER] Không thể kiểm tra mã ưu đãi:', err);
      })
      .finally(() => {
        if (!cancelled && hasEmailChartToken) {
          isHydratingEmailLinkRef.current = false;
          setIsRestoringSession(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

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
          let pAllowed = currentTier === 'free' ? 0 : Number(parsed.proAllowed || 0);
          let eAllowed = currentTier === 'free' ? 0 : Number(parsed.expertAllowed || 0);
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
  const [authModalTab, setAuthModalTab] = useState<AuthModalTab>('signup');
  const [authModalNotice, setAuthModalNotice] = useState('');
  const pendingPostAuthActionRef = useRef<(() => void) | null>(null);
  const isAuthenticatedRef = useRef<boolean>(Boolean(user?.id && user?.email));
  const [verifiedAuthUser, setVerifiedAuthUser] = useState<{
    id: string;
    email: string;
    fullName?: string;
  } | null>(null);
  const verifiedAuthUserRef = useRef<{
    id: string;
    email: string;
    fullName?: string;
  } | null>(null);

  useEffect(() => {
    const hasValidUser = Boolean(user?.id && user?.email);
    isAuthenticatedRef.current = hasValidUser;
    if (user?.id && user?.email) {
      const nextVerified = {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name || undefined,
      };
      verifiedAuthUserRef.current = nextVerified;
      setVerifiedAuthUser(nextVerified);
    } else if (!user) {
      verifiedAuthUserRef.current = null;
      setVerifiedAuthUser(null);
    }
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
    originalPrice?: number;
    voucherCode?: string;
    discountPercent?: number;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'reading_vip',
    price: 119000,
  });

  // Xử lý khi đăng nhập / đăng ký tài khoản thành công
  const handleAuthSuccess = async () => {
    // Xác minh phiên đăng nhập thực tế từ Supabase trước khi cho phép mở thanh toán
    let confirmedUser: { id: string; email: string; fullName?: string } | null = null;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user?.id && sessionData.session.user.email) {
        confirmedUser = {
          id: sessionData.session.user.id,
          email: sessionData.session.user.email,
          fullName: sessionData.session.user.user_metadata?.full_name || undefined,
        };
      } else {
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.id && userData.user.email) {
          confirmedUser = {
            id: userData.user.id,
            email: userData.user.email,
            fullName: userData.user.user_metadata?.full_name || undefined,
          };
        }
      }
    } catch (err) {
      console.warn('Không thể xác minh phiên đăng nhập sau AuthModal:', err);
    }

    if (!confirmedUser) {
      isAuthenticatedRef.current = false;
      setAuthModalNotice('Phiên tài khoản chưa được kích hoạt. Quý khách vui lòng đăng nhập lại để tiếp tục.');
      setAuthModalTab('signin');
      setIsAuthModalOpen(true);
      return;
    }

    isAuthenticatedRef.current = true;
    verifiedAuthUserRef.current = confirmedUser;
    setVerifiedAuthUser(confirmedUser);
    setIsAuthModalOpen(false);
    setAuthModalNotice('');

    // Nếu đã có lá số trên màn hình nhưng chưa có chartId trong database, lưu ngay để gắn chartId trước khi mở QR
    let activeChartId = chartIdRef.current || currentChartId;
    const activeLaSo = laSoRef.current || laSo;
    const activeDuongSo = duongSoRef.current || currentDuongSo;
    if (activeLaSo && activeDuongSo && !activeChartId) {
      try {
        const saveRes = await saveOrUpdateChart({
          title: `${activeDuongSo.hoTen} (${activeDuongSo.gioiTinh} - ${activeDuongSo.namDuong})`,
          duongSoData: activeDuongSo,
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

    // Kích hoạt hành động đang chờ sau khi đã có đầy đủ userId, email và chartId
    if (pendingPostAuthActionRef.current) {
      const action = pendingPostAuthActionRef.current;
      pendingPostAuthActionRef.current = null;
      setTimeout(() => {
        action();
      }, 80);
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
        ? 'gemini-4-carbon'
        : tier === 'pro'
        ? 'gemini-3.1-pro-preview'
        : 'gemini-2.5-flash';
    const targetChartId = explicitChartId || chartIdRef.current || currentChartId || undefined;
    let readingResult: string | null = null;
    let lastErrMsg: string | null = null;

    // Gọi qua Next.js API Route (xác thực JWT + kiểm tra gói thanh toán + tự lưu DB từ server)
    try {
      const authHeaders = await getBearerAuthHeaders({ 'Content-Type': 'application/json' });
      const res = await fetch('/api/tuvi/reading', {
        method: 'POST',
        headers: authHeaders,
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
      const msg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      lastErrMsg = `Không thể kết nối đến máy chủ: ${msg}`;
    }

    if (!readingResult && lastErrMsg) {
      setReadingError(lastErrMsg);
    }

    return readingResult;
  };

  // Xử lý khi nộp form lập lá số mới hoặc cập nhật lá số (chọn Free, Pro hoặc Expert)
  const handleFormSubmit = async (data: DuLieuDuongSo, tier: ServiceTier) => {
    const previousTier = tierRef.current || currentTier;
    const matchesCurrentSavedChart =
      !isEditing &&
      Boolean(chartIdRef.current || currentChartId) &&
      duongSoRef.current?.hoTen?.trim() === data.hoTen.trim() &&
      duongSoRef.current?.ngayDuong === data.ngayDuong &&
      duongSoRef.current?.thangDuong === data.thangDuong &&
      duongSoRef.current?.namDuong === data.namDuong &&
      duongSoRef.current?.gioSinhVal === data.gioSinhVal;
    const existingChartId = isEditing || matchesCurrentSavedChart ? (chartIdRef.current || currentChartId) : null;
    const existingReadingHtml = isEditing || matchesCurrentSavedChart ? readingHtml : undefined;
    const existingChatHistory = isEditing || matchesCurrentSavedChart ? chatHistory : [];

    // Lấy user hiện tại (hỗ trợ cả trường hợp vừa đăng nhập xong qua AuthModal mà React state chưa kịp re-render)
    let activeUser = user;
    if (!activeUser) {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          activeUser = sessionData.session.user;
        } else {
          const { data: authData } = await supabase.auth.getUser();
          if (authData?.user) {
            activeUser = authData.user;
          }
        }
        if (activeUser?.id && activeUser.email) {
          isAuthenticatedRef.current = true;
          const nextVerified = {
            id: activeUser.id,
            email: activeUser.email,
            fullName: activeUser.user_metadata?.full_name || undefined,
          };
          verifiedAuthUserRef.current = nextVerified;
          setVerifiedAuthUser(nextVerified);
        }
      } catch {
        // ignore
      }
    }

    // Gói Trả Phí (Pro / Expert): Yêu cầu có tài khoản trước khi mở QR để gắn quyền lợi trọn đời.
    // Gói Miễn Phí (Free): Cho hiển thị NGAY Lá Số 12 Cung không cần đăng nhập (giảm 45-65% rớt khách lạnh!),
    // rồi mời đăng ký miễn phí ngay bên dưới lá số để nhận bài Bình Giải AI ~1.000 từ & lưu Sổ Tay.
    const isGuestPreviewMode = (!activeUser?.id || !activeUser.email) && tier === 'free';
    if ((!activeUser?.id || !activeUser.email) && tier !== 'free') {
      pendingPostAuthActionRef.current = () => {
        handleFormSubmit(data, tier);
      };
      setAuthModalTab('signup');
      setAuthModalNotice(
        tier === 'expert'
          ? 'Quý khách vui lòng đăng ký tài khoản (hoặc đăng nhập) để lưu giữ lá số vào sổ tay và mở mã QR thanh toán Bản Chuyên Gia Expert (269.000đ).'
          : 'Quý khách vui lòng đăng ký tài khoản (hoặc đăng nhập) để lưu giữ lá số vào sổ tay và mở mã QR thanh toán Bản Chuyên Sâu Pro.'
      );
      setIsAuthModalOpen(true);
      return;
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

    const resolvedNamXem = cleanDuongSo.namXem || getCurrentVietnamTimeInfo().namAm;
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
    setIsLoadingReading(!requiresPayment && !isGuestPreviewMode);

    // Ghi nhận sự kiện Lead & AnSaoLapLaSo về Meta Pixel khi khách tạo lá số
    if (!isEditing) {
      trackLeadChart(data.hoTen, tier, data.namDuong, data.gioiTinh);
    }

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
          // Server (/api/tuvi/reading) sẽ tự động gắn chart_id vào đơn PAID chưa liên kết nếu khớp chủ sở hữu + họ tên
          void autoUnlockedFromPaidOrder;
          void matchedPaidOrderCode;
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

    // Nếu là khách vãng lai xem bản Miễn Phí: Đã hiện ngay Lá Số 12 Cung ở trên -> dừng ở đây để hiển thị hộp CTA đăng ký mở bài bình giải AI
    if (isGuestPreviewMode) {
      setIsLoadingReading(false);
      return;
    }

    // Gọi AI Thầy Tôn bình giải
    const expectedChartId = createdChartId;
    try {
      const readingResult = await generateReading(calculatedLaSo, data, effectiveTier, createdChartId);
      if (readingResult) {
        if (chartIdRef.current === expectedChartId) {
          setReadingHtml(readingResult);
        }
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

  // Mở modal thanh toán nâng cấp Bản Pro (Bắt buộc đăng nhập để lưu lá số, trừ khi mở từ link Email đã định danh)
  const openUpgradeModal = () => {
    if (testerInfo?.isTester) {
      alert('Tài khoản Tester của bạn đã được mở khóa toàn bộ quyền lợi VIP Pro!');
      return;
    }

    const currentVoucher = activeVoucherRef.current || activeVoucher;
    const vipPrice = currentVoucher ? currentVoucher.prices.reading_vip : 119000;

    const proceedToPayment = () => {
      const latestVoucher = activeVoucherRef.current || activeVoucher;
      setPaymentModalConfig({
        isOpen: true,
        type: 'reading_vip',
        price: latestVoucher ? latestVoucher.prices.reading_vip : 119000,
        originalPrice: latestVoucher ? 119000 : undefined,
        voucherCode: latestVoucher?.code,
        discountPercent: latestVoucher?.discountPercent,
        onConfirm: () => {
          clearActiveVoucher();
          handleConfirmUpgradeToPro();
        },
      });
    };

    const hasVerifiedEmailChart = Boolean(
      (chartIdRef.current || currentChartId) &&
        ((emailLinkOwnerRef.current?.userId && emailLinkOwnerRef.current?.email) ||
          (emailLinkOwner?.userId && emailLinkOwner?.email) ||
          (currentVoucher?.userId && currentVoucher?.email))
    );

    if (!user && !isAuthenticatedRef.current && !hasVerifiedEmailChart) {
      pendingPostAuthActionRef.current = proceedToPayment;
      setAuthModalTab('signup');
      setAuthModalNotice(
        `Quý khách vui lòng đăng ký tài khoản (hoặc đăng nhập) để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán nâng cấp Bản Pro (${vipPrice.toLocaleString('vi-VN')}đ).`
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
    const currentVoucher = !isUpgradingFromPro ? (activeVoucherRef.current || activeVoucher) : null;
    const price = isUpgradingFromPro
      ? 150000
      : currentVoucher
      ? currentVoucher.prices.reading_expert
      : 269000;

    const proceedToPayment = () => {
      const latestVoucher = !isUpgradingFromPro ? (activeVoucherRef.current || activeVoucher) : null;
      setPaymentModalConfig({
        isOpen: true,
        type: paymentType,
        price: isUpgradingFromPro
          ? 150000
          : latestVoucher
          ? latestVoucher.prices.reading_expert
          : 269000,
        originalPrice: latestVoucher ? 269000 : undefined,
        voucherCode: latestVoucher?.code,
        discountPercent: latestVoucher?.discountPercent,
        onConfirm: () => {
          clearActiveVoucher();
          handleConfirmUpgradeToExpert();
        },
      });
    };

    const hasVerifiedEmailChart = Boolean(
      (chartIdRef.current || currentChartId) &&
        ((emailLinkOwnerRef.current?.userId && emailLinkOwnerRef.current?.email) ||
          (emailLinkOwner?.userId && emailLinkOwner?.email) ||
          (currentVoucher?.userId && currentVoucher?.email))
    );

    if (!user && !isAuthenticatedRef.current && !hasVerifiedEmailChart) {
      pendingPostAuthActionRef.current = proceedToPayment;
      setAuthModalTab('signup');
      setAuthModalNotice(
        isUpgradingFromPro
          ? 'Quý khách vui lòng đăng ký tài khoản (hoặc đăng nhập) để mở mã QR thanh toán nâng cấp từ Bản Pro lên Bản Chuyên Gia Expert (150.000đ).'
          : `Quý khách vui lòng đăng ký tài khoản (hoặc đăng nhập) để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán Bản Chuyên Gia Expert (${price.toLocaleString('vi-VN')}đ).`
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

    const proceedToPayment = async () => {
      // Đảm bảo lá số đã được lưu vào DB để luôn có chartId trước khi tạo đơn hỏi đáp
      const activeLaSo = laSoRef.current || laSo;
      const activeDuongSo = duongSoRef.current || currentDuongSo;
      if (activeLaSo && activeDuongSo && !(chartIdRef.current || currentChartId)) {
        try {
          const saveRes = await saveOrUpdateChart({
            title: `${activeDuongSo.hoTen} (${activeDuongSo.gioiTinh} - ${activeDuongSo.namDuong})`,
            duongSoData: activeDuongSo,
            lasoData: activeLaSo,
            readingHtml,
          });
          if (saveRes.chartId) {
            chartIdRef.current = saveRes.chartId;
            setCurrentChartId(saveRes.chartId);
          }
        } catch {}
      }

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
      pendingPostAuthActionRef.current = () => {
        void proceedToPayment();
      };
      setAuthModalTab('signup');
      setAuthModalNotice(
        targetMode === 'expert'
          ? 'Quý khách vui lòng đăng ký tài khoản (hoặc đăng nhập) để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán 02 câu hỏi Chuyên Gia Expert (129.000đ).'
          : targetMode === 'vip'
          ? 'Quý khách vui lòng đăng ký tài khoản (hoặc đăng nhập) để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán 02 câu hỏi Chuyên Sâu.'
          : 'Quý khách vui lòng đăng ký tài khoản (hoặc đăng nhập) để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán 02 câu hỏi cùng Thầy Tôn.'
      );
      setIsAuthModalOpen(true);
      return;
    }

    void proceedToPayment();
  };

  // Mở modal Sổ tay số mệnh (danh sách lá số đã lưu)
  const handleOpenSavedCharts = () => {
    if (!user) {
      setAuthModalTab('signin');
      setAuthModalNotice('Quý khách vui lòng đăng nhập hoặc tạo tài khoản để xem Sổ tay danh sách lá số đã lưu.');
      pendingPostAuthActionRef.current = () => {
        setIsSavedChartsModalOpen(true);
      };
      setIsAuthModalOpen(true);
    } else {
      setIsSavedChartsModalOpen(true);
    }
  };

  // Xử lý gửi tin nhắn hỏi đáp với Thầy Tôn (trả về true nếu thành công để ChatThayTon chỉ xóa input khi gửi thành công)
  const handleSendMessage = async (
    userQuestion: string,
    mode: 'basic' | 'vip' | 'expert' = 'vip'
  ): Promise<boolean> => {
    if (!laSo) return false;

    // Kiểm tra quota cứng: Nếu chưa đăng ký gói hoặc đã hỏi đủ hạn mức cho phép thì chặn
    const validCount = chatHistory.filter((c) => !c.isError).length;
    const totalAllowed =
      (questionsQuota?.expertAllowed || 0) +
      (questionsQuota?.proAllowed || 0) +
      (questionsQuota?.basicAllowed || 0);
    if (totalAllowed === 0 || validCount >= totalAllowed) {
      alert('Quý khách đã sử dụng hết số lượt câu hỏi của lá số này. Xin vui lòng nạp thêm lượt hỏi để tiếp tục đàm đạo cùng Thầy Tôn.');
      return false;
    }

    const requestChartId = currentChartId;
    setIsLoadingChat(true);

    try {
      const selectedModel =
        mode === 'expert'
          ? 'gemini-4-carbon'
          : mode === 'vip'
          ? 'gemini-3.1-pro-preview'
          : 'gemini-2.5-flash';
      const chatHeaders = await getBearerAuthHeaders({ 'Content-Type': 'application/json' });
      const res = await fetch('/api/tuvi/chat', {
        method: 'POST',
        headers: chatHeaders,
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
          chartId: requestChartId,
          userId: user?.id,
        }),
      });

      const isStillSameChart = chartIdRef.current === requestChartId;

      if (!res.ok) {
        const rawText = await res.text().catch(() => '');
        let errMsg = rawText;
        try {
          const parsed = JSON.parse(rawText);
          if (parsed.error) errMsg = parsed.error;
        } catch {
          // ignore
        }
        if (isStillSameChart) {
          setChatHistory((prev) => [
            ...prev,
            {
              q: userQuestion,
              a: errMsg || 'Thầy đang bận, xin quý khách thử lại sau ít phút.',
              isError: true,
              type: mode,
            },
          ]);
        }
        return false;
      } else {
        const json = await res.json();
        const answer = json.answer || 'Không nhận được câu trả lời từ Thầy Tôn.';
        if (isStillSameChart) {
          setChatHistory((prev) => [
            ...prev,
            {
              q: userQuestion,
              a: answer,
              isError: false,
              type: mode,
            },
          ]);
        }

        // Nếu đã đăng nhập và có chartId, lưu tin nhắn vào database nếu server chưa tự lưu
        if (requestChartId && !json.savedToDb) {
          saveChatMessage(requestChartId, userQuestion, answer, mode);
        }
        return true;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (chartIdRef.current === requestChartId) {
        setChatHistory((prev) => [
          ...prev,
          {
            q: userQuestion,
            a: `Lỗi kết nối máy chủ: ${msg}`,
            isError: true,
            type: mode,
          },
        ]);
      }
      return false;
    } finally {
      if (chartIdRef.current === requestChartId) {
        setIsLoadingChat(false);
      }
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
        if (user) {
          const { charts } = await getUserCharts();
          if (charts && charts.length > 0 && charts[0].id !== chartId) {
            await handleSelectSavedChart(charts[0].id);
            return;
          }
        }
        try {
          localStorage.removeItem('tuvi_active_session');
          window.history.replaceState(null, '', basePath);
        } catch {}
        alert('Lá số này đã được xóa hoặc không còn tồn tại.');
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

      // Tự động kiểm tra hóa đơn thanh toán trong tuvi_orders (tách query an toàn thay cho .or())
      if (detectedTier !== 'expert') {
        try {
          const ownerUid = chart.user_id || user?.id;
          const [byChartRes, byUserRes] = await Promise.all([
            isValidUuidClient(chartId)
              ? supabase
                  .from('tuvi_orders')
                  .select('id, payment_type, status, chart_id, ho_ten')
                  .eq('chart_id', chartId)
                  .eq('status', 'PAID')
                  .in('payment_type', ['reading_expert', 'upgrade_expert', 'reading_vip'])
              : Promise.resolve({ data: [] as Array<{ id: string; payment_type: string; status: string; chart_id: string | null; ho_ten: string | null }> }),
            isValidUuidClient(ownerUid)
              ? supabase
                  .from('tuvi_orders')
                  .select('id, payment_type, status, chart_id, ho_ten')
                  .eq('user_id', ownerUid)
                  .is('chart_id', null)
                  .eq('status', 'PAID')
                  .in('payment_type', ['reading_expert', 'upgrade_expert', 'reading_vip'])
              : Promise.resolve({ data: [] as Array<{ id: string; payment_type: string; status: string; chart_id: string | null; ho_ten: string | null }> }),
          ]);

          const combinedOrders = [...(byChartRes.data || []), ...(byUserRes.data || [])];
          const matchingOrders = combinedOrders.filter(
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
        } catch {
          // ignore
        }
      }

      setCurrentTier(detectedTier);
      tierRef.current = detectedTier;
      // Tự động an sao lại theo thuật toán mới nhất để đảm bảo định dạng chuẩn (Thê Thiếp cho Nam, đầy đủ sao, màu sắc chuẩn)
      let activeLaSo = chart.laso_data;
      if (chart.duong_so_data) {
        try {
          const resolvedNamXem = chart.duong_so_data.namXem || getCurrentVietnamTimeInfo().namAm;
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

      const isBrokenReading =
        !chart.reading_html ||
        chart.reading_html.trim().length < 400 ||
        chart.reading_html.includes('gửi lại đề bài') ||
        chart.reading_html.includes('thầy đang bận chút xíu');

      setReadingHtml(isBrokenReading ? undefined : finalReadingHtml);
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
              proAllowed: detectedTier === 'pro' ? Math.max(2, Number(parsed.proAllowed || 0)) : detectedTier === 'free' ? 0 : Number(parsed.proAllowed || 0),
              expertAllowed: detectedTier === 'expert' ? Math.max(2, Number(parsed.expertAllowed || 0)) : detectedTier === 'free' ? 0 : Number(parsed.expertAllowed || 0),
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
          proAllowed: detectedTier === 'pro' ? Math.max(2, Number(chart.laso_data.quota.proAllowed || 0)) : detectedTier === 'free' ? 0 : Number(chart.laso_data.quota.proAllowed || 0),
          expertAllowed: detectedTier === 'expert' ? Math.max(2, Number(chart.laso_data.quota.expertAllowed || 0)) : detectedTier === 'free' ? 0 : Number(chart.laso_data.quota.expertAllowed || 0),
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

      // Tự động nâng cấp lên Pro hoặc Expert (hoặc tự phục hồi bài luận nếu trước đó bị gián đoạn API)
      if (detectedTier === 'pro' || detectedTier === 'expert' || isBrokenReading) {
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
          isBrokenReading ||
          Boolean(chart.laso_data?.needsReadingUpgrade) ||
          (detectedTier === 'pro' && (!chart.duong_so_data?.tier || chart.duong_so_data?.tier === 'free') && !chart.reading_html?.includes('Bản Pro') && !chart.reading_html?.includes('CHUYÊN SÂU')) ||
          (detectedTier === 'expert' && chart.duong_so_data?.tier !== 'expert' && !chart.reading_html?.includes('CHUYÊN GIA EXPERT'));

        if (needsNewReading) {
          setIsLoadingReading(true);
          try {
            const readingResult = await generateReading(updatedLaSo, chart.duong_so_data, detectedTier, chart.id);
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
          } catch (genErr) {
            console.error(genErr);
          }
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

  const getCleanBaseUrlKeepingUtm = () => {
    if (typeof window === 'undefined') return basePath;
    try {
      const params = new URLSearchParams(window.location.search);
      params.delete('chartId');
      const qs = params.toString();
      return qs ? `${basePath}?${qs}` : basePath;
    } catch {
      return basePath;
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tuvi_active_session');
      window.history.replaceState(null, '', getCleanBaseUrlKeepingUtm());
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
    clearActiveVoucher();
    emailLinkOwnerRef.current = null;
    setEmailLinkOwner(null);

    const wipeLocalUserState = () => {
      if (typeof window === 'undefined') return;
      try {
        localStorage.removeItem('tuvi_active_session');
        localStorage.removeItem('tuvi_active_voucher');
        localStorage.removeItem('tuvi_customer_email');
        const keysToDelete: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('tuvi_quota_') || k.startsWith('tuvi_q_'))) {
            keysToDelete.push(k);
          }
        }
        keysToDelete.forEach((k) => localStorage.removeItem(k));
        sessionStorage.removeItem('tuvi_email_link_owner');
      } catch {
        // ignore storage errors
      }
    };

    wipeLocalUserState();
    try {
      await signOut();
    } catch (err) {
      console.error('Lỗi signOut:', err);
    }
    wipeLocalUserState();
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
    if (isHydratingEmailLinkRef.current) return;
    // Nếu đang mở từ link Email có chứa voucher hoặc etoken thì ưu tiên luồng nạp lá số từ Email
    const initParams = new URLSearchParams(window.location.search);
    if (initParams.get('voucher') || initParams.get('etoken')) {
      return;
    }
    // Nếu vừa lập lá số hoặc vừa đăng nhập từ bảng yêu cầu đăng nhập để lập lá số/thanh toán, không ghi đè bằng lá số cũ
    if (laSoRef.current || pendingPostAuthActionRef.current) {
      setIsRestoringSession(false);
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const rawUrlChartId = (urlParams.get('chartId') || '').trim();
    const urlChartId = isValidUuidClient(rawUrlChartId) ? rawUrlChartId : null;

    // Trên trang đích quảng cáo /van-han: Nếu URL không chỉ định sẵn chartId cụ thể, luôn hiển thị ngay Landing Page + Form lập lá số mới (không tự bung lá số cũ làm che mất trang đích)
    if (isVanHanLanding && !urlChartId) {
      setIsRestoringSession(false);
      return;
    }

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
            window.history.replaceState(null, '', getCleanBaseUrlKeepingUtm());
            setIsRestoringSession(false);
            return;
          }

          // 2. Nếu đang là khách (chưa đăng nhập): KHÔNG khôi phục lá số ẩn danh từ localStorage — bắt buộc đăng nhập / tạo tài khoản!
          if (!user) {
            localStorage.removeItem('tuvi_active_session');
            window.history.replaceState(null, '', getCleanBaseUrlKeepingUtm());
            setIsRestoringSession(false);
            return;
          }

          if (!urlChartId || urlChartId === session.chartId) {
            let activeLaSo = session.laSo;
            if (session.duongSo) {
              try {
                const resolvedNamXem = session.duongSo.namXem || getCurrentVietnamTimeInfo().namAm;
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
                    // Khôi phục lại đầy đủ duong_so_data (bao gồm ảnh khuôn mặt & chỉ tay từ DB sau khi F5)
                    if (chart.duong_so_data) {
                      duongSoRef.current = chart.duong_so_data;
                      setCurrentDuongSo(chart.duong_so_data);
                    }
                    const isBrokenDbReading =
                      !chart.reading_html ||
                      chart.reading_html.trim().length < 400 ||
                      chart.reading_html.includes('gửi lại đề bài') ||
                      chart.reading_html.includes('thầy đang bận chút xíu');

                    if (!isBrokenDbReading && chart.reading_html) {
                      const cleanedDbReading = cleanReadingHtml(chart.reading_html);
                      setReadingHtml(cleanedDbReading);
                      try {
                        localStorage.setItem(
                          'tuvi_active_session',
                          JSON.stringify({
                            ...session,
                            userId: user.id,
                            laSo: activeLaSo,
                            readingHtml: cleanedDbReading,
                          })
                        );
                      } catch {}
                    } else if (isBrokenDbReading) {
                      setReadingHtml(undefined);
                    }
                    if (Array.isArray(chatMessages)) setChatHistory(chatMessages);
                    let detectedTier: ServiceTier =
                      chart.duong_so_data?.tier ||
                      chart.laso_data?.tier ||
                      (chart.reading_html?.includes('Bản Expert') || chart.reading_html?.includes('CHUYÊN GIA EXPERT')
                        ? 'expert'
                        : chart.reading_html?.includes('Bản Pro') || chart.reading_html?.includes('CHUYÊN SÂU PRO')
                        ? 'pro'
                        : session.tier || 'free');

                    // Kiểm tra Self-Healing từ tuvi_orders (tách query an toàn thay cho .or())
                    if (detectedTier !== 'expert') {
                      try {
                        const [byChartRes, byUserRes] = await Promise.all([
                          isValidUuidClient(session.chartId)
                            ? supabase
                                .from('tuvi_orders')
                                .select('id, payment_type, status, chart_id, ho_ten')
                                .eq('chart_id', session.chartId)
                                .eq('status', 'PAID')
                                .in('payment_type', ['reading_expert', 'upgrade_expert', 'reading_vip'])
                            : Promise.resolve({ data: [] as Array<{ id: string; payment_type: string; status: string; chart_id: string | null; ho_ten: string | null }> }),
                          isValidUuidClient(user.id)
                            ? supabase
                                .from('tuvi_orders')
                                .select('id, payment_type, status, chart_id, ho_ten')
                                .eq('user_id', user.id)
                                .is('chart_id', null)
                                .eq('status', 'PAID')
                                .in('payment_type', ['reading_expert', 'upgrade_expert', 'reading_vip'])
                            : Promise.resolve({ data: [] as Array<{ id: string; payment_type: string; status: string; chart_id: string | null; ho_ten: string | null }> }),
                        ]);

                        const combinedOrders = [...(byChartRes.data || []), ...(byUserRes.data || [])];
                        const matchingOrders = combinedOrders.filter(
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
                      } catch {}
                    }

                    tierRef.current = detectedTier;
                    setCurrentTier(detectedTier);
                    if (detectedTier === 'free') {
                      const freeQuota: QuestionsQuota = {
                        basicAllowed: Number(chart.laso_data?.quota?.basicAllowed || 0),
                        proAllowed: 0,
                        expertAllowed: 0,
                      };
                      quotaRef.current = freeQuota;
                      setQuestionsQuota(freeQuota);
                    }

                    // Tự động nâng cấp nếu phát hiện đơn hàng đã thanh toán hoặc cần sinh bài luận mới (kể cả khi bài cũ bị lỗi API)
                    if (detectedTier === 'pro' || detectedTier === 'expert' || isBrokenDbReading) {
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
                        isBrokenDbReading ||
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
                  } else {
                    // Lá số trong phiên lưu cũ đã bị xóa trên DB -> tự động chuyển sang lá số hiện có mới nhất
                    try {
                      localStorage.removeItem('tuvi_active_session');
                    } catch {}
                    const { charts } = await getUserCharts();
                    if (charts && charts.length > 0) {
                      await handleSelectSavedChart(charts[0].id);
                    } else {
                      handleReset();
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
      setIsRestoringSession(true);
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
    const effectiveOwnerId =
      user?.id || verifiedAuthUserRef.current?.id || emailLinkOwnerRef.current?.userId || null;
    if (!effectiveOwnerId) return;

    const sessionData = {
      userId: effectiveOwnerId,
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
        window.history.replaceState(null, '', `${basePath}?chartId=${currentChartId}`);
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

        {/* Banner Mã Giảm Giá Đếm Ngược Tự Động (Chỉ hiện khi mã còn hạn & khách đang ở gói Free) */}
        {activeVoucher && currentTier === 'free' && (
          <div className="max-w-[1060px] mx-auto">
            <VoucherCountdownBanner
              voucher={activeVoucher}
              hasChart={Boolean(laSo && !isEditing)}
              onSelectPro={openUpgradeModal}
              onSelectExpert={() => openUpgradeExpertModal('free')}
              onExpire={clearActiveVoucher}
            />
          </div>
        )}

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
          <div className="my-auto py-3 sm:py-8 space-y-8 sm:space-y-12">
            {/* Đưa Form nhập Ngày Giờ Sinh lên ngay màn hình đầu tiên trên di động để triệt tiêu thoát trang sớm */}
            <TuViForm
              onSubmit={handleFormSubmit}
              isLoading={isLoadingReading}
              onOpenSavedCharts={handleOpenSavedCharts}
              initialData={isEditing ? (currentDuongSo || laSo?.duongSo) : null}
              onCancelEdit={isEditing && laSo ? () => setIsEditing(false) : undefined}
              activeVoucher={currentTier === 'free' ? activeVoucher : null}
              variant={
                isVanHanLanding
                  ? adAngle === 'dien-trach-quan-loc'
                    ? 'dien-trach-quan-loc'
                    : 'van-han'
                  : 'default'
              }
              defaultTier="free"
              onRequireAuth={(action, notice) => {
                pendingPostAuthActionRef.current = action;
                setAuthModalTab('signup');
                setAuthModalNotice(notice);
                setIsAuthModalOpen(true);
              }}
            />

            {isVanHanLanding && !isEditing && <VanHanLandingHero />}

            {!isEditing && (
              <>
                {isVanHanLanding ? (
                  <>
                    {/* Trên Landing Page /van-han: Ưu tiên khối Uy tín Thầy Tôn ngay dưới Form để tăng niềm tin chốt đơn */}
                    <AboutThayTon />
                    <CoursePromoBanner />
                  </>
                ) : (
                  <>
                    {/* 1. Uy tín Chuyên gia Thầy Tôn ngay dưới Form để tăng niềm tin sớm */}
                    <AboutThayTon />

                    {/* 2. Khối Khóa Học Tử Vi Đẩu Số Thực Chiến Online (Podcast + Giáo trình tương tác 699K) */}
                    <CoursePromoBanner />

                    {/* 3. Cảm nhận thực tế từ Chuyên gia, Doanh nhân & Học viên (Đa ngôn ngữ) */}
                    <Testimonials />

                    {/* 4. Khối Đặt Lịch Xem Trực Tiếp Online & Offline Cùng Thầy Tôn */}
                    <BookingBanner />

                    {/* 5. Khối Nội dung Trang chủ Chuẩn SEO & GEO (Thu gọn mượt, giữ 100% DOM SEO) */}
                    <HomeFunnelContent />
                  </>
                )}
              </>
            )}

            {!isEditing && isVanHanLanding && (
              /* Khối Đặt Lịch Xem Trực Tiếp Online & Offline Cùng Thầy Tôn trên trang /van-han */
              <BookingBanner />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <h1 className="sr-only">
              Lập Lá Số Tử Vi Miễn Phí và Bình Giải Trọn Đời Cùng Thầy Tôn — Lá Số {laSo.duongSo.hoTen}
            </h1>
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
                      <span>
                        {activeVoucher
                          ? `⚡ Nâng Cấp Pro (${activeVoucher.prices.reading_vip.toLocaleString('vi-VN')}đ • -${activeVoucher.discountPercent}%)`
                          : t('reading.upgradeBtn', '⚡ Nâng Cấp Pro (119.000đ)')}
                      </span>
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
                        : activeVoucher
                        ? `💎 Bản Expert (${activeVoucher.prices.reading_expert.toLocaleString('vi-VN')}đ • -${activeVoucher.discountPercent}%)`
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

            {/* Khung bổ sung Ảnh Diện Tướng & Chỉ Tay miễn phí cho khách đã mở gói Pro / Expert */}
            {(currentTier === 'pro' || currentTier === 'expert') && currentDuongSo && (
              <BiometricSupplementPanel
                duongSo={currentDuongSo}
                tier={currentTier}
                isLoadingReading={isLoadingReading}
                onSaveAndRegenerate={async (updates) => {
                  const activeLaSo = laSoRef.current || laSo;
                  const activeDuongSo = duongSoRef.current || currentDuongSo;
                  const activeChartId = chartIdRef.current || currentChartId;
                  if (!activeLaSo || !activeDuongSo) return;

                  const mergedDuongSo: DuLieuDuongSo = {
                    ...activeDuongSo,
                    tier: currentTier,
                    anhMat: updates.anhMat,
                    anhTay: updates.anhTay,
                    thongTinThem: updates.thongTinThem,
                    chieuCao: updates.chieuCao,
                    canNang: updates.canNang,
                  };

                  duongSoRef.current = mergedDuongSo;
                  setCurrentDuongSo(mergedDuongSo);

                  if (activeChartId && user) {
                    try {
                      await saveOrUpdateChart({
                        id: activeChartId,
                        title: `${mergedDuongSo.hoTen} (${mergedDuongSo.gioiTinh} - ${mergedDuongSo.namDuong})`,
                        duongSoData: mergedDuongSo,
                        lasoData: activeLaSo,
                        readingHtml: readingHtml,
                      });
                    } catch (e) {
                      console.warn('Lỗi lưu ảnh bổ sung từ client (server sẽ đồng bộ tiếp):', e);
                    }
                  }

                  setReadingError(undefined);
                  setIsLoadingReading(true);
                  try {
                    const resText = await generateReading(activeLaSo, mergedDuongSo, currentTier, activeChartId);
                    if (resText) {
                      setReadingHtml(resText);
                      if (activeChartId) updateChartReading(activeChartId, resText);
                    }
                  } finally {
                    setIsLoadingReading(false);
                  }
                }}
              />
            )}

            {/* Bài Bình Giải Chuyên Sâu (Hoặc hộp mời đăng ký miễn phí nhận bình giải cho khách vừa lập lá số vãng lai) */}
            {!user && !readingHtml && !isLoadingReading && !readingError && laSo && currentDuongSo ? (
              <div className="w-full max-w-[1060px] mx-auto imperial-card border-2 border-amber-500/50 rounded-3xl p-5 sm:p-7 text-slate-100 shadow-2xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                      ✨ Đã An Sao Chuẩn Xác 108 Tinh Đẩu
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold font-serif text-gold-gradient">
                      Nhận Ngay Bản Bình Giải Miễn Phí (~1.000 từ) cho {currentDuongSo.hoTen}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Lá số <strong className="text-amber-300">{laSo.banMenh} • {laSo.tenCuc} • {laSo.thuanNghichLy}</strong> đã hiển thị đầy đủ phía trên. Tạo tài khoản miễn phí trong 5 giây để Thầy Tôn bình giải trọn vẹn Mệnh – Tài – Quan, Đại Vận 10 năm &amp; 3 Cung Hạn năm {laSo.namXem}, đồng thời lưu vĩnh viễn vào Sổ Tay Số Mệnh!
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        pendingPostAuthActionRef.current = () => {
                          handleFormSubmit(currentDuongSo, 'free');
                        };
                        setAuthModalTab('signup');
                        setAuthModalNotice(
                          `Tạo tài khoản miễn phí (5 giây) để nhận ngay Bản Bình Giải Tử Vi ~1.000 từ cho ${currentDuongSo.hoTen} & lưu trọn đời vào Sổ Tay!`
                        );
                        setIsAuthModalOpen(true);
                      }}
                      className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/30 transition transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
                    >
                      ✨ Nhận Bình Giải Miễn Phí Ngay →
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        pendingPostAuthActionRef.current = () => {
                          handleFormSubmit(currentDuongSo, 'free');
                        };
                        setAuthModalTab('signin');
                        setAuthModalNotice('');
                        setIsAuthModalOpen(true);
                      }}
                      className="px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold text-xs sm:text-sm transition cursor-pointer whitespace-nowrap"
                    >
                      Đã có tài khoản? Đăng nhập
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <LuanGiaiAI
                readingHtml={readingHtml}
                isLoading={isLoadingReading}
                error={readingError}
                tier={currentTier}
                onUpgrade={openUpgradeModal}
                onUpgradeToExpert={() => openUpgradeExpertModal()}
                onRetry={async () => {
                  const activeLaSo = laSoRef.current || laSo;
                  const activeDuongSo = duongSoRef.current || currentDuongSo;
                  const activeChartId = chartIdRef.current || currentChartId;
                  if (!activeLaSo || !activeDuongSo) return;
                  setReadingError(undefined);
                  setIsLoadingReading(true);
                  try {
                    const resText = await generateReading(activeLaSo, activeDuongSo, currentTier, activeChartId);
                    if (resText) {
                      setReadingHtml(resText);
                      if (activeChartId) updateChartReading(activeChartId, resText);
                    }
                  } finally {
                    setIsLoadingReading(false);
                  }
                }}
                isUpgrading={isUpgrading}
                duongSo={currentDuongSo || undefined}
                laSo={laSo || undefined}
                activeVoucher={currentTier === 'free' ? activeVoucher : null}
              />
            )}

            {/* Khung Hỏi Đáp Luận Giải Cùng AI Thầy Tôn */}
            <ChatThayTon
              key={currentChartId || 'guest'}
              chatHistory={chatHistory}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChat}
              tier={currentTier}
              quota={questionsQuota}
              onUnlockQuestions={handleUnlockQuestions}
              onUpgradeToPro={openUpgradeModal}
              onUpgradeToExpert={() => openUpgradeExpertModal()}
              laSo={laSo}
            />

            {/* Khối Khóa Học Tử Vi Đẩu Số Thực Chiến Online (Podcast + Giáo trình tương tác 699K) */}
            <CoursePromoBanner />

            {/* Mục Giới thiệu về Thầy Tôn */}
            <AboutThayTon />

            {/* Khối Đặt Lịch Xem Trực Tiếp Online & Offline Cùng Thầy Tôn (Nằm dưới phần Hỏi Đáp) */}
            <BookingBanner />
          </div>
        )}
      </div>

      {/* Modal Thanh Toán Đa Mục Đích */}
      {paymentModalConfig.isOpen && (
        <PaymentModal
          isOpen={paymentModalConfig.isOpen}
          onClose={() => setPaymentModalConfig((prev) => ({ ...prev, isOpen: false }))}
          onConfirm={() => {
            if (paymentModalConfig.onConfirm) {
              paymentModalConfig.onConfirm();
            }
            setPaymentModalConfig((prev) => ({ ...prev, isOpen: false }));
          }}
          hoTen={
            currentDuongSo?.hoTen ||
            duongSoRef.current?.hoTen ||
            profile?.full_name ||
            verifiedAuthUser?.fullName ||
            user?.user_metadata?.full_name ||
            'Đương số'
          }
          paymentType={paymentModalConfig.type}
          price={paymentModalConfig.price}
          originalPrice={paymentModalConfig.originalPrice}
          voucherCode={paymentModalConfig.voucherCode}
          discountPercent={paymentModalConfig.discountPercent}
          fallbackUserId={
            user?.id ||
            verifiedAuthUser?.id ||
            emailLinkOwner?.userId ||
            activeVoucher?.userId ||
            undefined
          }
          fallbackEmail={
            user?.email ||
            verifiedAuthUser?.email ||
            emailLinkOwner?.email ||
            activeVoucher?.email ||
            undefined
          }
          onVoucherExpired={handlePaymentVoucherExpired}
          chartId={currentChartId || chartIdRef.current || undefined}
        />
      )}

      {/* Modal Đăng Nhập / Đăng Ký / Quên MK */}
      <AuthModal
        isOpen={isAuthModalOpen}
        defaultTab={authModalTab}
        initialName={currentDuongSo?.hoTen || duongSoRef.current?.hoTen || undefined}
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
        onDeleteActiveChart={() => handleReset()}
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

      <footer className="max-w-[1060px] w-full mx-auto text-center text-xs text-slate-400 pt-5 pb-24 sm:pb-20 border-t border-slate-800/60 print:hidden mt-8 space-y-2">
        <div className="flex items-center justify-center gap-3 sm:gap-5 text-xs text-slate-400 font-medium flex-wrap">
          <Link href="/khoa-hoc" className="text-amber-300 hover:text-amber-200 font-semibold transition">
            {t('nav.course', 'Khóa Học Tử Vi')}
          </Link>
          <span className="text-slate-600">•</span>
          <Link href="/thay-ton" className="hover:text-amber-400 transition">
            {t('nav.about', 'Hồ Sơ Thầy Tôn')}
          </Link>
          <span className="text-slate-600">•</span>
          <Link href="/phong-thuy" className="hover:text-amber-400 transition">
            {t('about.btnFengShui', 'Phong Thủy Cải Vận')}
          </Link>
          <span className="text-slate-600">•</span>
          <Link href="/bai-viet" className="hover:text-amber-400 transition">
            {t('nav.guide', 'Cẩm Nang Tử Vi')}
          </Link>
          <span className="text-slate-600">•</span>
          <a
            href="https://tonyenglish.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
            TonyEnglish.vn
          </a>
          <span className="text-slate-600">•</span>
          <a href="mailto:tranhuyton@gmail.com" className="hover:text-amber-300 transition">
            Email: tranhuyton@gmail.com
          </a>
        </div>
        <p className="text-slate-400 text-[11px] sm:text-xs">
          {t('footer.copyright', undefined, { year: getCurrentVietnamTimeInfo().namDuong })}
        </p>
        <p className="text-slate-400/90 text-[11px] leading-relaxed max-w-3xl mx-auto px-3 pt-1">
          {t(
            'footer.disclaimer',
            'Miễn trừ trách nhiệm: Toàn bộ nội dung luận giải Tử Vi, Tướng Pháp, Phong Thủy và Hỏi đáp AI trên hệ thống mang tính chất nghiên cứu văn hóa Á Đông, chiêm nghiệm tâm lý và định hướng tham khảo — hoàn toàn không phải bói toán mê tín dị đoan và không thay thế cho tư vấn y tế, pháp lý hay tài chính chuyên ngành. Mọi quyết định thực tế thuộc quyền tự chủ của quý độc giả.'
          )}
        </p>
      </footer>
    </main>
  );
}
