'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  X,
  Sparkles,
  CheckCircle,
  Copy,
  Check,
  Loader2,
  Mail,
  CheckCircle2,
  Download,
  Smartphone,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { generateVietQrDataUrl, buildVietQrString } from '@/lib/vietqr';
import QRCode from 'qrcode';

export type PaymentPurpose = 'reading_vip' | 'chat_free' | 'chat_vip';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hoTen?: string;
  paymentType?: PaymentPurpose;
  price?: number;
  customTitle?: string;
  customDescription?: string;
  chartId?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
  hoTen = 'Đương số',
  paymentType = 'reading_vip',
  price: customPrice,
  customTitle,
  customDescription,
  chartId,
}: PaymentModalProps) {
  const { user, profile } = useAuth();

  // Trạng thái đơn hàng
  const [orderCode, setOrderCode] = useState<string>('');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [sepayQrUrl, setSepayQrUrl] = useState<string>('');
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<'PENDING' | 'PAID' | 'IDLE'>('IDLE');

  // Đa tầng dự phòng QR:
  // 0: Local Base64 DataURL (cực nhanh 0ms, không phụ thuộc mạng)
  // 1: SePay CDN (https://qr.sepay.vn/img?...)
  // 2: VietQR CDN (https://img.vietqr.io/image/...)
  // 3: Canvas HTML5 vẽ trực tiếp bằng thư viện qrcode (miễn nhiễm 100% lỗi mạng/CDN)
  const [qrFallbackStage, setQrFallbackStage] = useState<number>(0);

  // Email nhận thông báo
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [emailSaved, setEmailSaved] = useState<boolean>(false);

  // Toggle xem đặc quyền gói (thu gọn để nhường chỗ cho mã QR xuất hiện đầu tiên trên mobile)
  const [showBenefits, setShowBenefits] = useState<boolean>(false);

  // Trạng thái copy
  const [copiedStk, setCopiedStk] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modalBodyRef = useRef<HTMLDivElement | null>(null);
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeOrderKeyRef = useRef<string | null>(null);

  const bankName = 'VPBank (Ngân hàng Việt Nam Thịnh Vượng)';
  const stk = 'AGBSPVUONG2026';
  const chuTk = 'TRAN THI DIEP';

  let finalPrice = customPrice;
  let title = customTitle;
  let subtitle = customDescription;
  let benefits: string[] = [];

  if (paymentType === 'reading_vip') {
    finalPrice = finalPrice ?? 119000;
    title = title || 'Kích Hoạt Luận Giải Chuyên Sâu (Bản VIP)';
    subtitle = subtitle || 'Khai mở Đại Pháp Luận Giải Bí Truyền chuyên sâu đa tầng từ Thầy Tôn';
    benefits = [
      'Bài luận sâu gấp 2 lần (~1800 - 2500 từ) sắc bén, tỉ mỉ từng cung vị.',
      'Khảo sát 14 Chính tinh, đối chiếu Diện Tướng (khuôn mặt) & Thủ Tướng (chỉ tay).',
      'Chi tiết Đại Vận 10 năm từng chặng 5 năm & 4 mùa Xuân - Hạ - Thu - Đông.',
      'Tặng kèm 02 câu hỏi đàm đạo chuyên sâu trực tiếp cùng Thầy Tôn.',
    ];
  } else if (paymentType === 'chat_vip') {
    finalPrice = finalPrice ?? 99000;
    title = title || 'Thỉnh Giáo Chuyên Sâu Cùng Thầy Tôn (Bản VIP)';
    subtitle = subtitle || 'Đặc quyền thỉnh giáo chuyên sâu đa tầng, giải khai mọi khúc mắc';
    benefits = [
      '02 lượt thỉnh giáo chuyên sâu trực tiếp cùng Thầy Tôn.',
      'Phân tích cặn kẽ tương quan các cung vị, cách cục và hạn vận liên quan.',
      'Định hướng sách lược ứng biến, hóa giải vận rủi, đón lành tránh dữ.',
    ];
  } else {
    // chat_free
    finalPrice = finalPrice ?? 49000;
    title = title || 'Thỉnh Giáo Trực Tiếp Cùng Thầy Tôn (Bản Cơ Bản)';
    subtitle = subtitle || 'Khai mở lời giải đáp riêng về công danh, sự nghiệp, tình duyên, gia đạo';
    benefits = [
      '02 lượt hỏi đáp trực tiếp và nhận lời chỉ dẫn riêng biệt từ Thầy Tôn.',
      'Thầy soi chiếu lá số, phân tích căn duyên khúc mắc của quý khách.',
      'Lời khuyên hành động thực tế, giúp an tâm định hướng con đường phía trước.',
    ];
  }

  // Khởi tạo email từ tài khoản hoặc localStorage khi mở modal
  useEffect(() => {
    if (isOpen) {
      const email =
        customerEmail ||
        user?.email ||
        profile?.email ||
        (typeof window !== 'undefined' ? localStorage.getItem('tuvi_customer_email') || '' : '');
      if (email && !customerEmail) setCustomerEmail(email);

      // Đảm bảo cuộn lên đầu để thấy ngay mã QR mà không bị đẩy xuống dưới
      setTimeout(() => {
        if (modalBodyRef.current) {
          modalBodyRef.current.scrollTop = 0;
        }
      }, 50);
    }
  }, [isOpen, user, profile, customerEmail]);

  // Hàm tạo hoặc lấy lại đơn hàng
  const createOrFetchOrder = useCallback(async (isRefresh = false) => {
    setIsCreatingOrder(true);
    setOrderError(null);
    setQrFallbackStage(0);

    try {
      const initialEmail =
        customerEmail ||
        user?.email ||
        profile?.email ||
        (typeof window !== 'undefined' ? localStorage.getItem('tuvi_customer_email') || '' : '');

      const affiliateCode =
        (typeof window !== 'undefined' ? localStorage.getItem('tuvi_affiliate_ref') || '' : '').trim().toLowerCase();

      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentType,
          price: finalPrice,
          hoTen,
          email: initialEmail,
          chartId,
          userId: user?.id,
          affiliateCode: affiliateCode || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`Máy chủ phản hồi mã lỗi ${res.status}`);
      }

      const data = await res.json();
      if (data.success && data.order) {
        const code = data.order.orderCode;
        activeOrderKeyRef.current = `${paymentType}_${finalPrice}_${chartId || 'default'}_${hoTen}`;
        setOrderCode(code);
        setQrUrl(data.qrUrl || `https://img.vietqr.io/image/VPB-${stk}-compact2.png?amount=${finalPrice}&addInfo=${encodeURIComponent(code)}&accountName=${encodeURIComponent(chuTk)}`);
        setSepayQrUrl(data.sepayQrUrl || `https://qr.sepay.vn/img?bank=VPBank&acc=${stk}&template=compact&amount=${finalPrice}&des=${encodeURIComponent(code)}`);

        // Ưu tiên dữ liệu QR DataURL do server sinh hoặc client sinh ngay tức thì
        if (data.qrDataUrl) {
          setQrDataUrl(data.qrDataUrl);
        } else {
          try {
            const clientDataUrl = await generateVietQrDataUrl({
              bankBinOrCode: 'VPB',
              accountNumber: stk,
              amount: finalPrice,
              memo: code,
              accountName: chuTk,
            });
            setQrDataUrl(clientDataUrl);
          } catch (qrErr) {
            console.warn('[PaymentModal] Lỗi sinh client QR DataURL:', qrErr);
          }
        }
        setOrderStatus('PENDING');
      } else {
        throw new Error(data.error || 'Không thể tạo đơn hàng');
      }
    } catch (err: any) {
      console.error('[PaymentModal] Lỗi tạo đơn thanh toán:', err);
      setOrderError(err?.message || 'Không thể tạo mã giao dịch. Vui lòng bấm thử lại.');
    } finally {
      setIsCreatingOrder(false);
    }
  }, [customerEmail, user, profile, paymentType, finalPrice, hoTen, chartId, stk, chuTk]);

  // Tạo đơn hàng khi modal mở ra (tái sử dụng đơn pending nếu cùng gói để không sinh mã rác và hiện QR tức thì)
  useEffect(() => {
    if (!isOpen) {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
      if (orderStatus !== 'PENDING') {
        setOrderStatus('IDLE');
        activeOrderKeyRef.current = null;
      }
      return;
    }

    const targetKey = `${paymentType}_${finalPrice}_${chartId || 'default'}_${hoTen}`;
    // Nếu modal đang mở và đã có đơn pending cho gói này rồi thì không tạo lại để hiện mã ngay lập tức 0ms
    if (activeOrderKeyRef.current === targetKey && orderCode && orderStatus === 'PENDING') {
      return;
    }

    createOrFetchOrder();

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [isOpen, paymentType, finalPrice, hoTen, chartId, orderCode, orderStatus, createOrFetchOrder]);

  // Bắt đầu chu trình Polling kiểm tra trạng thái thanh toán (mỗi 2.5s)
  useEffect(() => {
    if (!isOpen || !orderCode || orderStatus === 'PAID') return;

    const checkPaymentStatus = async () => {
      try {
        const res = await fetch(`/api/payment/check-status?code=${orderCode}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'PAID') {
            handlePaymentSuccess();
          }
        }
      } catch (err) {
        // Tiếp tục polling
      }
    };

    pollingTimerRef.current = setInterval(checkPaymentStatus, 2500);

    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [isOpen, orderCode, orderStatus]);

  // Xử lý khi phát hiện thanh toán thành công
  const handlePaymentSuccess = () => {
    if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    setOrderStatus('PAID');
    activeOrderKeyRef.current = null;

    // Lưu email và quyền lợi mở khóa vào localStorage để bền vững qua các lần F5
    if (typeof window !== 'undefined') {
      if (customerEmail) localStorage.setItem('tuvi_customer_email', customerEmail);
      if (orderCode) localStorage.setItem('tuvi_last_paid_code', orderCode);
    }

    // Tự động mở khóa và đóng modal sau 1.8 giây hiển thị chúc mừng
    setTimeout(() => {
      onConfirm();
      onClose();
    }, 1800);
  };

  // Vẽ Canvas dự phòng (khi stage === 3 hoặc khi canvas mount)
  useEffect(() => {
    if (orderCode && canvasRef.current && (qrFallbackStage === 3 || !qrDataUrl)) {
      try {
        const qrString = buildVietQrString({
          bankBinOrCode: 'VPB',
          accountNumber: stk,
          amount: finalPrice,
          memo: orderCode,
          accountName: chuTk,
        });

        QRCode.toCanvas(canvasRef.current, qrString, {
          width: 240,
          margin: 1,
          errorCorrectionLevel: 'M',
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
        }).catch((err) => {
          console.warn('[PaymentModal] Lỗi render Canvas QR:', err);
        });
      } catch (err) {
        console.warn('[PaymentModal] Lỗi tạo chuỗi VietQR cho Canvas:', err);
      }
    }
  }, [orderCode, qrFallbackStage, qrDataUrl, finalPrice, stk, chuTk]);

  // Xử lý chuyển đổi tầng QR dự phòng khi ảnh bị lỗi (onError)
  const handleImgError = () => {
    setQrFallbackStage((prev) => {
      const nextStage = prev + 1;
      console.warn(`[PaymentModal] QR ảnh tầng ${prev} không tải được, tự động chuyển tầng ${nextStage}`);
      return nextStage <= 3 ? nextStage : 3;
    });
  };

  // Nguồn ảnh QR hiện tại dựa theo tầng fallback
  const currentQrSrc = useMemo(() => {
    if (qrFallbackStage === 0) {
      return qrDataUrl || sepayQrUrl || qrUrl;
    }
    if (qrFallbackStage === 1) {
      return sepayQrUrl || qrUrl || qrDataUrl;
    }
    if (qrFallbackStage === 2) {
      return qrUrl || sepayQrUrl || qrDataUrl;
    }
    return '';
  }, [qrFallbackStage, qrDataUrl, sepayQrUrl, qrUrl]);

  // Cập nhật email cho đơn hàng
  const handleUpdateEmail = async (newEmail: string) => {
    setCustomerEmail(newEmail);
    if (newEmail.includes('@') && orderCode) {
      try {
        await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_email',
            orderCode,
            email: newEmail,
          }),
        });
        setEmailSaved(true);
        setTimeout(() => setEmailSaved(false), 2500);
      } catch (err) {
        // ignore
      }
    }
  };

  const handleCopyStk = () => {
    navigator.clipboard.writeText(stk);
    setCopiedStk(true);
    setTimeout(() => setCopiedStk(false), 2000);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(orderCode || 'TUVI');
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(String(finalPrice));
    setCopiedAmount(true);
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  // Sao chép toàn bộ thông tin thanh toán (1-click thuận tiện)
  const handleCopyAll = () => {
    const text = `Ngân hàng: VPBank\nSố TK: ${stk}\nChủ TK: ${chuTk}\nSố tiền: ${finalPrice.toLocaleString('vi-VN')} đ\nNội dung CK: ${orderCode}`;
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  // Tải ảnh mã QR về máy (hỗ trợ lưu ảnh quét trong App Ngân Hàng)
  const handleDownloadQr = () => {
    try {
      let downloadSrc = '';
      if (qrFallbackStage === 3 && canvasRef.current) {
        downloadSrc = canvasRef.current.toDataURL('image/png');
      } else {
        downloadSrc = currentQrSrc;
      }

      if (!downloadSrc) return;

      if (downloadSrc.startsWith('data:')) {
        const link = document.createElement('a');
        link.href = downloadSrc;
        link.download = `VietQR_${orderCode || 'ThanhToan'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Ảnh từ CDN ngoài (SePay / VietQR)
        fetch(downloadSrc)
          .then((res) => res.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `VietQR_${orderCode || 'ThanhToan'}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
          })
          .catch(() => {
            window.open(downloadSrc, '_blank');
          });
      }
    } catch (err) {
      console.error('Lỗi tải mã QR:', err);
    }
  };

  // Làm mới / Tạo mã đơn hàng mới
  const handleRefreshOrder = () => {
    activeOrderKeyRef.current = null;
    setOrderCode('');
    setQrUrl('');
    setQrDataUrl('');
    setSepayQrUrl('');
    setOrderError(null);
    createOrFetchOrder(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col text-slate-100 overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-amber-400 leading-snug">
                {title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung thanh toán (Cuộn mượt mà, ưu tiên hiển thị mã QR ngay trên cùng) */}
        <div
          ref={modalBodyRef}
          className="p-3.5 sm:p-5 space-y-3.5 overflow-y-auto flex-1 overscroll-contain"
        >
          {/* Màn hình Chúc Mừng nếu ĐÃ THANH TOÁN (Auto-Unlocked) */}
          {orderStatus === 'PAID' ? (
            <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold font-serif text-emerald-400">
                  Thanh Toán Thành Công!
                </h4>
                <p className="text-sm sm:text-base text-slate-300 mt-1 max-w-md">
                  Giao dịch <span className="text-amber-400 font-mono font-bold">{orderCode}</span> đã được xác nhận tự động. Đang kích hoạt quyền lợi và gửi email thông báo...
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-amber-300 bg-amber-950/50 px-3.5 py-2 rounded-full border border-amber-500/30">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang chuyển hướng tới nội dung của bạn...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Dải thông tin tóm tắt số tiền & bảo mật */}
              <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-medium">Số tiền thanh toán:</span>
                  <span className="font-bold text-amber-400 text-base sm:text-lg font-mono">
                    {finalPrice.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Tự động duyệt 24/7
                </span>
              </div>

              {/* KHUNG MÃ QR VIETQR - ƯU TIÊN HÀNG ĐẦU, HIỂN THỊ NGAY LẬP TỨC */}
              <div className="bg-white rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center text-slate-900 shadow-xl border border-slate-200">
                {/* Header VietQR & NAPAS */}
                <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-slate-200 px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-blue-700 tracking-wider text-xs sm:text-sm">
                      VIET<span className="text-red-500">QR</span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="font-bold text-slate-700 text-xs tracking-wide">NAPAS 247</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    ⚡ Quét là nhận diện ngay
                  </span>
                </div>

                {/* Khung hiển thị QR - Đa tầng dự phòng đảm bảo luôn hiện */}
                <div className="w-52 h-52 sm:w-60 sm:h-60 bg-white rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative p-1 shadow-inner">
                  {isCreatingOrder ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500 text-xs sm:text-sm p-4 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                      <span className="font-medium">Đang tạo mã QR thanh toán...</span>
                    </div>
                  ) : orderError ? (
                    <div className="flex flex-col items-center gap-2 text-rose-600 text-xs sm:text-sm p-4 text-center">
                      <AlertCircle className="w-8 h-8 text-rose-500" />
                      <span className="font-medium text-slate-700">{orderError}</span>
                      <button
                        type="button"
                        onClick={handleRefreshOrder}
                        className="mt-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition shadow cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Thử lại</span>
                      </button>
                    </div>
                  ) : qrFallbackStage === 3 ? (
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full object-contain"
                      title={`VietQR Canvas ${orderCode}`}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentQrSrc}
                      alt={`VietQR ${orderCode}`}
                      className="w-full h-full object-contain select-none"
                      onError={handleImgError}
                    />
                  )}
                </div>

                {/* Các nút hỗ trợ nhanh trên mobile & desktop */}
                <div className="w-full mt-3 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    disabled={isCreatingOrder || !orderCode}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 transition cursor-pointer disabled:opacity-50"
                    title="Tải ảnh mã QR về máy để mở trong App Ngân Hàng"
                  >
                    <Download className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Lưu ảnh QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyAll}
                    disabled={!orderCode}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs sm:text-sm font-semibold border border-amber-300 transition cursor-pointer disabled:opacity-50"
                    title="Sao chép toàn bộ thông tin chuyển khoản"
                  >
                    {copiedAll ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700">Đã sao chép!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Sao chép tất cả</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Hướng dẫn ngắn gọn */}
                <div className="mt-2 text-center text-xs text-slate-500">
                  💡 Dùng App Ngân hàng quét QR để tự điền đúng nội dung và số tiền.
                </div>
              </div>

              {/* Thông tin tài khoản thủ công (Sao chép 1 chạm) */}
              <div className="space-y-2 text-xs sm:text-sm bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Ngân hàng:</span>
                  <span className="font-semibold text-slate-200">{bankName}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <span className="font-semibold text-amber-300">{chuTk}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-sm sm:text-base">{stk}</span>
                    <button
                      type="button"
                      onClick={handleCopyStk}
                      className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                      title="Sao chép số tài khoản"
                    >
                      {copiedStk ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Số tiền:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 text-sm sm:text-base">
                      {finalPrice.toLocaleString('vi-VN')} VNĐ
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAmount}
                      className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                      title="Sao chép số tiền"
                    >
                      {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">Nội dung CK:</span>
                    <button
                      type="button"
                      onClick={handleRefreshOrder}
                      disabled={isCreatingOrder}
                      className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition cursor-pointer"
                      title="Tạo mã giao dịch mới nếu cần"
                    >
                      <RefreshCw className={`w-3 h-3 ${isCreatingOrder ? 'animate-spin' : ''}`} />
                      <span>Đổi mã</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-500/40 text-sm sm:text-base">
                      {orderCode || 'Đang tạo...'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyContent}
                      className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                      title="Sao chép nội dung"
                    >
                      {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-slate-400 border-t border-slate-800/80">
                  Hỗ trợ kiểm tra trực tiếp qua Hotline / Zalo Thầy Tôn:{' '}
                  <a href="tel:0935058688" className="text-amber-400 font-bold hover:underline">
                    0935.058.688
                  </a>{' '}
                  (
                  <a
                    href="https://zalo.me/0935058688"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 font-bold hover:underline"
                  >
                    Nhắn Zalo
                  </a>
                  )
                </div>
              </div>

              {/* Email Nhận Thông Báo & Kích Hoạt */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email nhận xác nhận &amp; biên lai kích hoạt:</span>
                  </label>
                  {emailSaved && (
                    <span className="text-xs text-emerald-400 font-medium animate-fade-in flex items-center gap-1">
                      <Check className="w-3 h-3" /> Đã lưu
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => handleUpdateEmail(e.target.value)}
                  placeholder="Ví dụ: hoten@gmail.com (để nhận email khi hoàn tất)"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs sm:text-sm focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                />
                {user?.email && (
                  <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                    <CheckCircle className="w-3 h-3 shrink-0" />
                    Đã liên kết tài khoản: <span className="font-mono text-amber-300 font-bold">{user.email}</span>
                  </p>
                )}
              </div>

              {/* Đặc quyền gói (Có thể mở rộng / thu gọn để không cản trở mã QR) */}
              <div className="border border-amber-500/20 rounded-xl overflow-hidden bg-amber-950/20">
                <button
                  type="button"
                  onClick={() => setShowBenefits(!showBenefits)}
                  className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs text-amber-300 hover:text-amber-200 transition cursor-pointer bg-amber-950/30"
                >
                  <span className="font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Chi tiết quyền lợi gói ({benefits.length} đặc quyền)
                  </span>
                  {showBenefits ? (
                    <ChevronUp className="w-4 h-4 text-amber-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-amber-400" />
                  )}
                </button>
                {showBenefits && (
                  <div className="p-3 text-xs text-slate-200 space-y-1.5 border-t border-amber-500/20 animate-fade-in">
                    <ul className="list-disc list-inside space-y-1.5 pl-1 leading-relaxed text-slate-300">
                      {benefits.map((b, idx) => (
                        <li key={idx}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {orderStatus !== 'PAID' && (
          <div className="p-3.5 sm:p-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400 shrink-0" />
              <span>Đang chờ chuyển khoản... Tự động mở khóa ngay</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="py-1.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs sm:text-sm font-medium transition shrink-0 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
