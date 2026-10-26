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
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function BookingBanner() {
  const { t } = useLanguage();

  return (
    <section className="mt-8 sm:mt-10 w-full max-w-[1060px] mx-auto relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900/95 to-indigo-950/30 p-6 sm:p-8 border border-amber-500/35 text-slate-100 print:hidden shadow-2xl">
      {/* Hào quang trang trí */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Phần Đầu: Tiêu đề & Mô tả trải rộng cân đối */}
        <div className="space-y-2.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tham Vấn Mệnh Lý &amp; Phong Thủy 1-1</span>
          </div>

          <h2 className="font-bold text-amber-300 text-xl sm:text-2xl font-serif leading-snug">
            {t('booking.title', 'Đặt Lịch Xem Tử Vi & Tư Vấn Phong Thủy Trực Tiếp 1-1 Cùng Thầy Tôn')}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-slate-200 leading-relaxed">
            {t(
              'booking.desc',
              'Dành cho đương số, gia chủ hoặc chủ doanh nghiệp cần trao đổi trực tiếp hai chiều cùng Thầy Tôn để thẩm định giờ sinh qua Diện tướng & Chỉ tay, luận sâu lá số cho quyết định lớn và tư vấn Phong thủy nhà ở, văn phòng, xem ngày giờ tốt.'
            )}
          </p>
        </div>

        {/* 3 Khung Hình Thức Tham Vấn Cân Đối */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-950/75 border border-slate-800/90 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-amber-300">
                1. Gặp Trực Tiếp Tại Văn Phòng
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội (Đặt lịch hẹn trước).
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/75 border border-slate-800/90 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 shrink-0 mt-0.5">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-blue-300">
                2. Xem Online Qua Video Call
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Thuận tiện cho khách ở các tỉnh thành khác và kiều bào đang sinh sống tại nước ngoài.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/75 border border-slate-800/90 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0 mt-0.5">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-emerald-300">
                3. Khảo Sát Phong Thủy &amp; Trạch Nhật
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Tư vấn mặt bằng Nhà ở, Chung cư, Văn phòng, Cửa hàng &amp; Chọn ngày giờ khởi sự.
              </p>
            </div>
          </div>
        </div>

        {/* Thanh Địa Chỉ & Nút Hành Động Dưới Cùng */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-center lg:justify-start gap-2 text-xs sm:text-sm text-amber-300/95 text-center lg:text-left">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {t('booking.addressLabel', 'Phòng xem trực tiếp:')}{' '}
              <strong className="text-slate-100">
                {t('booking.addressValue', 'R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội')}
              </strong>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0">
            <Link
              href="/dat-lich-xem-tu-vi"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-amber-300 border border-slate-700 text-xs sm:text-sm font-semibold transition"
            >
              <span>Quy Trình Xem 1-1</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>

            <a
              href="tel:0935058688"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 fill-slate-950 shrink-0" />
              <span>{t('booking.callBtn', 'Gọi Đặt Lịch: 0935.058.688')}</span>
            </a>

            <a
              href="https://zalo.me/0935058688"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0068FF] hover:bg-[#0054cc] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
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
