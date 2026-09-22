'use client';

import React from 'react';
import { PhoneCall, MapPin } from 'lucide-react';

export default function BookingBanner() {
  return (
    <div className="mt-8 sm:mt-10 w-full max-w-[1060px] mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-5 sm:p-7 rounded-2xl border border-amber-500/30 text-slate-100 flex flex-col md:flex-row items-center justify-between gap-5 print:hidden shadow-xl">
      <div className="space-y-2 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
            <PhoneCall className="w-5 h-5" />
          </span>
          <h4 className="font-bold text-amber-300 text-lg sm:text-xl font-serif">
            Đặt Lịch Luận Giải Cùng Thầy Tôn (Xem Online &amp; Offline 1-1)
          </h4>
        </div>
        <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed">
          Quý khách mong muốn được đàm đạo trực tiếp cùng Thầy Tôn (Xem Offline tại Hà Nội hoặc Luận giải Online 1-1 qua Video Call) để soi diện tướng, thủ tướng (chỉ tay), bấm quẻ Kỳ Môn Độn Giáp và đàm đạo chi tiết vận mệnh? Xin vui lòng liên hệ đặt lịch trước.
        </p>
        <div className="flex items-center justify-center md:justify-start gap-1.5 text-sm sm:text-xs text-amber-300/90 pt-1">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Địa chỉ xem Offline: <strong>R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội</strong>
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
        <a
          href="tel:0935058688"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm sm:text-base shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5 cursor-pointer"
        >
          <PhoneCall className="w-4 h-4 fill-slate-950" />
          <span>Gọi Đặt Lịch: 0935.058.688</span>
        </a>

        <a
          href="https://zalo.me/0935058688"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0068FF] hover:bg-[#0054cc] text-white font-bold rounded-xl text-sm sm:text-base shadow-md transition transform hover:-translate-y-0.5 cursor-pointer"
        >
          <span className="w-4 h-4 rounded-full bg-white text-[#0068FF] flex items-center justify-center text-[9px] font-black">
            Z
          </span>
          <span>Nhắn Zalo: 0935.058.688</span>
        </a>
      </div>
    </div>
  );
}
