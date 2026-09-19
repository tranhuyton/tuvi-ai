'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle, ShieldCheck, Copy, Check, QrCode } from 'lucide-react';

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
}: PaymentModalProps) {
  const [copiedStk, setCopiedStk] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  if (!isOpen) return null;

  const bankName = 'VPBank (Ngân hàng Việt Nam Thịnh Vượng)';
  const stk = '3386386';
  const chuTk = 'TRAN THI DIEP';
  const cleanName = hoTen
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 10);

  let finalPrice = customPrice;
  let title = customTitle;
  let subtitle = customDescription;
  let syntax = '';
  let buttonLabel = '';
  let benefits: string[] = [];

  if (paymentType === 'reading_vip') {
    finalPrice = finalPrice ?? 119000;
    title = title || 'Kích Hoạt Luận Giải Chuyên Sâu (Bản VIP)';
    subtitle = subtitle || 'Khai mở Đại Pháp Luận Giải Bí Truyền chuyên sâu đa tầng từ Thầy Tôn';
    syntax = `TUVI VIP ${cleanName || 'KHACH'}`;
    buttonLabel = 'Tôi Đã Chuyển Khoản - Kích Hoạt Bản VIP';
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
    syntax = `HOI VIP ${cleanName || 'KHACH'}`;
    buttonLabel = 'Tôi Đã Chuyển Khoản - Mở Khóa 2 Câu Hỏi VIP';
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
    syntax = `HOI TUVI ${cleanName || 'KHACH'}`;
    buttonLabel = 'Tôi Đã Chuyển Khoản - Mở Khóa 2 Câu Hỏi';
    benefits = [
      '02 lượt hỏi đáp trực tiếp và nhận lời chỉ dẫn riêng biệt từ Thầy Tôn.',
      'Thầy soi chiếu lá số, phân tích căn duyên khúc mắc của quý khách.',
      'Lời khuyên hành động thực tế, giúp an tâm định hướng con đường phía trước.',
    ];
  }

  const qrUrl = `https://img.vietqr.io/image/VPB-${stk}-compact2.png?amount=${finalPrice}&addInfo=${encodeURIComponent(
    syntax
  )}&accountName=${encodeURIComponent(chuTk)}`;

  const handleCopyStk = () => {
    navigator.clipboard.writeText(stk);
    setCopiedStk(true);
    setTimeout(() => setCopiedStk(false), 2000);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(syntax);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
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
              <p className="text-xs text-slate-400">
                {subtitle}
              </p>
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

          {/* QR Code Chuyển Khoản */}
          <div className="bg-white rounded-xl p-4 flex flex-col items-center justify-center text-slate-900 shadow-inner">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-600">
              <QrCode className="w-4 h-4 text-slate-700" />
              Quét mã VietQR để thanh toán tự động:
            </div>
            <div className="w-48 h-48 bg-slate-100 rounded-lg overflow-hidden border border-slate-300 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="VietQR Thanh toán Tử Vi Thầy Tôn"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/payment/vpbank-qr.png';
                }}
              />
            </div>
            <div className="text-[11px] text-slate-500 mt-1.5">
              Mở app ngân hàng bất kỳ để quét QR
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
              <span className="font-bold text-emerald-400 text-sm">
                {finalPrice.toLocaleString('vi-VN')} VNĐ
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Nội dung chuyển khoản:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-300">{syntax}</span>
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

            <div className="pt-2 text-center text-xs text-slate-400">
              Cần hỗ trợ hoặc đặt lịch xem trực tiếp offline cùng Thầy Tôn?{' '}
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
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{buttonLabel}</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs sm:text-sm font-medium transition"
          >
            Để sau
          </button>
        </div>
      </div>
    </div>
  );
}
