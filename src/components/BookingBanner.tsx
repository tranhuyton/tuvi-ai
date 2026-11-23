'use client';

import React from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  MapPin,
  Sparkles,
  Video,
  Compass,
  Building2,
  ArrowRight,
  QrCode,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { trackContact } from '@/lib/metaPixel';
import type { ServiceTier } from '@/types/tuvi';

export default function BookingBanner({
  tier,
  onBookOffline1on1,
}: {
  tier?: ServiceTier;
  onBookOffline1on1?: () => void;
} = {}) {
  const { t, language } = useLanguage();
  const isExpertCustomer = tier === 'expert';

  return (
    <section className="mt-8 sm:mt-10 w-full max-w-[1060px] mx-auto relative overflow-hidden rounded-3xl imperial-card p-6 sm:p-8 border border-amber-500/40 text-slate-100 print:hidden before:pointer-events-none before:absolute before:inset-x-12 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-amber-300/80 before:to-transparent">
      {/* Hào quang trang trí */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/12 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Phần Đầu: Tiêu đề & Mô tả trải rộng cân đối */}
        <div className="space-y-2.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('booking.badge', 'Tham Vấn Mệnh Lý & Phong Thủy 1-1')}</span>
          </div>

          <h2 className="font-extrabold text-gold-gradient text-xl sm:text-2xl md:text-3xl font-serif leading-snug drop-shadow-sm">
            {t('booking.title', 'Đặt Lịch Xem Tử Vi & Tư Vấn Phong Thủy Trực Tiếp 1-1 Cùng Thầy Tôn')}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed">
            {t(
              'booking.desc',
              'Dành cho đương số, gia chủ hoặc chủ doanh nghiệp cần trao đổi trực tiếp hai chiều cùng Thầy Tôn để thẩm định giờ sinh qua Diện tướng & Chỉ tay, luận sâu lá số cho quyết định lớn và tư vấn Phong thủy nhà ở, văn phòng, xem ngày giờ tốt.'
            )}
          </p>

          {isExpertCustomer && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/15 to-purple-500/20 border border-amber-400/50 text-amber-100 text-xs sm:text-sm leading-relaxed text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                {language === 'vi' ? (
                  <>
                    💎 <strong className="text-amber-300">Đặc quyền khách đã mở Bản Expert (269.000đ):</strong> Quý khách được khấu trừ trực tiếp phí bản Expert khi đặt lịch xem trực tiếp 1-1 cùng Thầy Tôn (Offline tại Hà Nội hoặc Video Call) — <strong className="text-emerald-300">chỉ cần đóng thêm 1.730.000đ</strong> (giá gốc 2.000.000đ).
                  </>
                ) : (
                  <>
                    💎 <strong className="text-amber-300">Expert Reading (269K) Privilege:</strong> Deduct your full 269,000 VND fee toward a private 1-on-1 session with Master Ton (Royal City Hanoi or Global Video Call) — <strong className="text-emerald-300">pay only +1,730,000 VND</strong> (regularly 2,000,000 VND).
                  </>
                )}
              </div>
              {onBookOffline1on1 && (
                <button
                  type="button"
                  onClick={onBookOffline1on1}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition cursor-pointer shrink-0 whitespace-nowrap"
                >
                  <QrCode className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {language === 'vi' ? 'Đặt Lịch VietQR (1.730k)' : 'Book via VietQR (1,730k)'}
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 3 Khung Hình Thức Tham Vấn Cân Đối */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-950/75 border border-slate-800/90 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-300">
                {t('booking.card1Title', '1. Đàm Đạo Riêng 1-1 Tại Hà Nội')}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {t(
                  'booking.card1Desc',
                  'Khu đô thị Royal City, Thanh Xuân, Hà Nội (Chỉ tiếp khách hẹn trước — địa chỉ chi tiết gửi riêng qua Zalo).'
                )}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/75 border border-slate-800/90 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0 mt-0.5">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-blue-300">
                {t('booking.card2Title', '2. Xem Online Qua Video Call')}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {t(
                  'booking.card2Desc',
                  'Thuận tiện cho khách ở các tỉnh thành khác và kiều bào đang sinh sống tại nước ngoài.'
                )}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/75 border border-slate-800/90 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-emerald-300">
                {t('booking.card3Title', '3. Khảo Sát Phong Thủy & Trạch Nhật')}
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {t(
                  'booking.card3Desc',
                  'Tư vấn mặt bằng Nhà ở, Chung cư, Văn phòng, Cửa hàng & Chọn ngày giờ khởi sự.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Thanh Địa Chỉ & Nút Hành Động Dưới Cùng */}
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <div className="flex items-start sm:items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-amber-300/95 text-center sm:text-left">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              {t('booking.addressLabel', 'Khu vực tham vấn trực tiếp:')}{' '}
              <strong className="text-slate-100">
                {t('booking.addressValue', 'Khu đô thị Royal City, Thanh Xuân, Hà Nội (Đặt lịch hẹn trước qua Zalo)')}
              </strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <Link
              href="/dat-lich-xem-tu-vi"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-amber-300 border border-slate-700 text-xs sm:text-sm font-semibold transition whitespace-nowrap"
            >
              <span>{t('booking.processBtn', 'Quy Trình Xem 1-1')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </Link>

            <a
              href="tel:0935058688"
              onClick={() =>
                trackContact('phone', isExpertCustomer ? 'booking_banner_expert' : 'booking_banner', {
                  value: isExpertCustomer ? 1730000 : 2000000,
                })
              }
              className="btn-shimmer inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4 fill-slate-950 shrink-0" />
              <span>{t('booking.callBtn', 'Gọi Đặt Lịch: 0935.058.688')}</span>
            </a>

            <a
              href="https://zalo.me/0935058688"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackContact('zalo', isExpertCustomer ? 'booking_banner_expert' : 'booking_banner', {
                  value: isExpertCustomer ? 1730000 : 2000000,
                })
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#0068FF] hover:bg-[#0054cc] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              <span className="w-4 h-4 rounded-full bg-white text-[#0068FF] flex items-center justify-center text-[9px] font-black shrink-0">
                Z
              </span>
              <span>{t('booking.zaloBtn', 'Nhắn Zalo: 0935.058.688')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
