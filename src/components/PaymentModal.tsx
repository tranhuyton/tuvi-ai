'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  CheckCircle,
  Copy,
  Check,
  QrCode,
  Loader2,
  Mail,
  CheckCircle2,
  Download,
  Smartphone,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<'PENDING' | 'PAID' | 'IDLE'>('IDLE');

  // Email nhận thông báo
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [emailSaved, setEmailSaved] = useState<boolean>(false);

  // Trạng thái copy
  const [copiedStk, setCopiedStk] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Polling ref & Active Order Key ref
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
    }
  }, [isOpen, user, profile, customerEmail]);

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

    activeOrderKeyRef.current = targetKey;
    let isMounted = true;

    async function initOrder() {
      setIsCreatingOrder(true);
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

        const data = await res.json();
        if (isMounted && data.success && data.order) {
          setOrderCode(data.order.orderCode);
          setQrUrl(data.qrUrl || '');
          setQrDataUrl(data.qrDataUrl || '');
          setOrderStatus('PENDING');
        }
      } catch (err) {
        console.error('Lỗi khởi tạo đơn thanh toán:', err);
      } finally {
        if (isMounted) setIsCreatingOrder(false);
      }
    }

    initOrder();

    return () => {
      isMounted = false;
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, [isOpen, paymentType, finalPrice, hoTen, chartId, orderCode, orderStatus]);

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

  // Tải ảnh mã QR về máy (hỗ trợ đặc biệt khách dùng điện thoại quét từ thư viện ảnh)
  const handleDownloadQr = () => {
    const src = qrDataUrl || qrUrl;
    if (!src) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = `VietQR_${orderCode || 'ThanhToan'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Làm mới / Tạo mã đơn hàng mới nếu khách muốn
  const handleRefreshOrder = async () => {
    activeOrderKeyRef.current = null;
    setOrderCode('');
    setQrUrl('');
    setQrDataUrl('');
    setIsCreatingOrder(true);
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

      const data = await res.json();
      if (data.success && data.order) {
        activeOrderKeyRef.current = `${paymentType}_${finalPrice}_${chartId || 'default'}_${hoTen}`;
        setOrderCode(data.order.orderCode);
        setQrUrl(data.qrUrl || '');
        setQrDataUrl(data.qrDataUrl || '');
        setOrderStatus('PENDING');
      }
    } catch (err) {
      console.error('Lỗi tạo mã mới:', err);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-serif text-amber-400 flex items-center gap-1.5">
                {title}
              </h3>
              <p className="text-sm sm:text-xs text-slate-300">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nội dung thanh toán */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
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
              {/* Đặc quyền gói */}
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5 sm:p-4 text-sm sm:text-sm text-amber-200 space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-base sm:text-sm">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  Đặc quyền ({finalPrice.toLocaleString('vi-VN')} đ):
                </div>
                <ul className="list-disc list-inside space-y-1.5 pl-1 text-slate-200 text-sm sm:text-xs leading-relaxed">
                  {benefits.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              {/* Email Nhận Thông Báo & Kích Hoạt */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-sm sm:text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Email nhận xác nhận &amp; biên lai kích hoạt:</span>
                  </label>
                  {emailSaved && (
                    <span className="text-xs text-emerald-400 font-medium animate-fade-in flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Đã lưu
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => handleUpdateEmail(e.target.value)}
                  placeholder="Ví dụ: hoten@gmail.com (để nhận email khi hoàn tất)"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                />
                {user?.email && (
                  <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 pt-1">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    Đã liên kết tài khoản: <span className="font-mono text-amber-300 font-bold">{user.email}</span>
                  </p>
                )}
              </div>

              {/* QR Code Chuyển Khoản Tự Động */}
              <div className="bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-slate-900 shadow-xl border border-slate-200">
                {/* Header VietQR & NAPAS */}
                <div className="w-full flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200 px-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-blue-700 tracking-wider text-xs sm:text-sm">
                      VIET<span className="text-red-500">QR</span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="font-bold text-slate-700 text-xs tracking-wide">NAPAS 247</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ⚡ Chuyển Nhanh 24/7
                  </span>
                </div>

                {/* Khung hiển thị QR */}
                <div className="w-56 h-56 sm:w-60 sm:h-60 bg-white rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative p-1 shadow-inner">
                  {isCreatingOrder || (!qrDataUrl && !qrUrl) ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500 text-xs sm:text-sm">
                      <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                      <span className="font-medium">Đang tạo mã QR thanh toán...</span>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrDataUrl || qrUrl}
                      alt={`VietQR ${orderCode}`}
                      className="w-full h-full object-contain select-none"
                      onError={(e) => {
                        if (qrDataUrl) {
                          (e.target as HTMLImageElement).src = qrDataUrl;
                        }
                      }}
                    />
                  )}
                </div>

                {/* Các nút hỗ trợ nhanh trên mobile & desktop */}
                <div className="w-full mt-3 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadQr}
                    disabled={!qrDataUrl && !qrUrl}
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

                {/* Gợi ý cho khách dùng điện thoại */}
                <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-600 text-center leading-normal px-1">
                  <Smartphone className="w-4 h-4 text-amber-600 shrink-0 hidden sm:inline" />
                  <span>
                    Dùng điện thoại: Bấm <strong>&quot;Lưu ảnh QR&quot;</strong> rồi vào App Ngân Hàng quét từ ảnh, hoặc sao chép thông tin bên dưới.
                  </span>
                </div>

                {/* Radar quét tự động */}
                <div className="mt-2.5 w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-medium text-xs">
                    Hệ thống SePay tự động mở khóa ngay sau khi tiền vào tài khoản
                  </span>
                </div>
              </div>

              {/* Thông tin tài khoản thủ công */}
              <div className="space-y-2.5 text-sm sm:text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Ngân hàng:</span>
                  <span className="font-semibold text-slate-200">{bankName}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Chủ tài khoản:</span>
                  <span className="font-semibold text-amber-300">{chuTk}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Số tài khoản:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400 text-base sm:text-sm">{stk}</span>
                    <button
                      type="button"
                      onClick={handleCopyStk}
                      className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                      title="Sao chép số tài khoản"
                    >
                      {copiedStk ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Số tiền:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 text-base sm:text-sm">
                      {finalPrice.toLocaleString('vi-VN')} VNĐ
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAmount}
                      className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                      title="Sao chép số tiền"
                    >
                      {copiedAmount ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1.5">
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
                    <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-500/40 text-base sm:text-sm">
                      {orderCode || 'Đang tạo...'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyContent}
                      className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                      title="Sao chép nội dung"
                    >
                      {copiedContent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-center text-xs text-slate-400">
                  Cần hỗ trợ hoặc kiểm tra trực tiếp? Hotline / Zalo Thầy Tôn:{' '}
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
            </>
          )}
        </div>

        {/* Footer Actions */}
        {orderStatus !== 'PAID' && (
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
              <span>Đang chờ chuyển khoản... Hệ thống tự động kích hoạt ngay khi nhận tiền</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-sm font-medium transition shrink-0 cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
