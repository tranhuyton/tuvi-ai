'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  CheckCircle,
  ShieldCheck,
  Copy,
  Check,
  QrCode,
  Loader2,
  Mail,
  Zap,
  CheckCircle2,
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
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<'PENDING' | 'PAID' | 'IDLE'>('IDLE');

  // Email nhận thông báo
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [emailSaved, setEmailSaved] = useState<boolean>(false);

  // Trạng thái copy
  const [copiedStk, setCopiedStk] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  // Trạng thái đang mô phỏng thanh toán
  const [isSimulating, setIsSimulating] = useState(false);

  // Polling ref
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const bankName = 'VPBank (Ngân hàng Việt Nam Thịnh Vượng)';
  const stk = '3386386';
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
        user?.email ||
        profile?.email ||
        (typeof window !== 'undefined' ? localStorage.getItem('tuvi_customer_email') || '' : '');
      if (email) setCustomerEmail(email);
    }
  }, [isOpen, user, profile]);

  // Tạo đơn hàng khi modal mở ra
  useEffect(() => {
    if (!isOpen) {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
      setOrderStatus('IDLE');
      return;
    }

    let isMounted = true;

    async function initOrder() {
      setIsCreatingOrder(true);
      try {
        const initialEmail =
          user?.email ||
          profile?.email ||
          (typeof window !== 'undefined' ? localStorage.getItem('tuvi_customer_email') || '' : '');

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
          }),
        });

        const data = await res.json();
        if (isMounted && data.success && data.order) {
          setOrderCode(data.order.orderCode);
          setQrUrl(data.qrUrl);
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
  }, [isOpen, paymentType, finalPrice, hoTen, chartId, user, profile]);

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

    // Lưu email và quyền lợi mở khóa vào localStorage để bền vững qua các lần F5
    if (typeof window !== 'undefined') {
      if (customerEmail) localStorage.setItem('tuvi_customer_email', customerEmail);
      localStorage.setItem('tuvi_global_q', '2');
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

  // Nút giả lập thanh toán (dành cho kiểm thử)
  const handleSimulatePayment = async () => {
    if (!orderCode) return;
    setIsSimulating(true);
    try {
      const res = await fetch('/api/payment/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode }),
      });
      const data = await res.json();
      if (data.success) {
        handlePaymentSuccess();
      }
    } catch (err) {
      console.error('Lỗi khi duyệt giả lập:', err);
    } finally {
      setIsSimulating(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-serif text-amber-400 flex items-center gap-1.5">
                {title}
              </h3>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
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
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
                  Giao dịch <span className="text-amber-400 font-mono font-bold">{orderCode}</span> đã được xác nhận tự động. Đang kích hoạt quyền lợi và gửi email thông báo...
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/50 px-3 py-1.5 rounded-full border border-amber-500/30">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Đang chuyển hướng tới nội dung của bạn...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Đặc quyền gói */}
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-3 sm:p-4 text-xs sm:text-sm text-amber-200 space-y-1.5">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  Đặc quyền ({finalPrice.toLocaleString('vi-VN')} đ):
                </div>
                <ul className="list-disc list-inside space-y-1 pl-1 text-slate-300 text-xs">
                  {benefits.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>

              {/* Email Nhận Thông Báo & Kích Hoạt */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-medium flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>Email nhận xác nhận &amp; biên lai kích hoạt:</span>
                  </label>
                  {emailSaved && (
                    <span className="text-[11px] text-emerald-400 font-medium animate-fade-in flex items-center gap-1">
                      <Check className="w-3 h-3" /> Đã lưu
                    </span>
                  )}
                </div>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => handleUpdateEmail(e.target.value)}
                  placeholder="Ví dụ: hoten@gmail.com (để nhận email khi hoàn tất)"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-amber-400 placeholder:text-slate-500"
                />
              </div>

              {/* QR Code Chuyển Khoản Tự Động */}
              <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center text-slate-900 shadow-inner">
                <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-700">
                  <QrCode className="w-4 h-4 text-slate-700" />
                  Quét mã VietQR (Tự động điền STK + Số tiền + Nội dung):
                </div>

                <div className="w-52 h-52 bg-slate-100 rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center relative">
                  {isCreatingOrder || !qrUrl ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500 text-xs">
                      <Loader2 className="w-7 h-7 animate-spin text-amber-600" />
                      <span>Đang tạo mã thanh toán...</span>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={qrUrl}
                      alt={`VietQR ${orderCode}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://img.vietqr.io/image/VPB-3386386-compact2.png';
                      }}
                    />
                  )}
                </div>

                {/* Radar quét tự động */}
                <div className="mt-2.5 flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-[11px] text-amber-800">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>Hệ thống tự động mở khóa ngay khi nhận chuyển khoản</span>
                </div>
              </div>

              {/* Thông tin tài khoản thủ công */}
              <div className="space-y-2 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
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
                    <span className="font-mono font-bold text-amber-400 text-sm">{stk}</span>
                    <button
                      type="button"
                      onClick={handleCopyStk}
                      className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition"
                      title="Sao chép số tài khoản"
                    >
                      {copiedStk ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Số tiền:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 text-sm">
                      {finalPrice.toLocaleString('vi-VN')} VNĐ
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyAmount}
                      className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition"
                      title="Sao chép số tiền"
                    >
                      {copiedAmount ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Nội dung chuyển khoản (Bắt buộc):</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                      {orderCode || 'Đang tạo...'}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyContent}
                      className="p-1 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700 transition"
                      title="Sao chép nội dung"
                    >
                      {copiedContent ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 text-center text-[11px] text-slate-400">
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
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => {
                // Khách xác nhận thủ công nếu không muốn chờ polling
                handlePaymentSuccess();
              }}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Tôi Đã Chuyển Khoản Thành Công</span>
            </button>

            {/* Nút Giả lập duyệt nhanh dành cho kiểm thử / test */}
            <button
              type="button"
              onClick={handleSimulatePayment}
              disabled={isSimulating || !orderCode}
              className="py-3 px-3.5 bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
              title="Mô phỏng khách quét QR và chuyển khoản thành công"
            >
              {isSimulating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              )}
              <span>Test Tự Động Duyệt</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs sm:text-sm font-medium transition"
            >
              Để sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
