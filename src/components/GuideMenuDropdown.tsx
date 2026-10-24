'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ChevronDown,
  Crown,
  Compass,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function GuideMenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border whitespace-nowrap ${
          isOpen
            ? 'bg-slate-800 text-amber-300 border-amber-400/80 shadow-md shadow-amber-500/15'
            : 'bg-slate-950/70 hover:bg-slate-800/80 text-amber-300/95 hover:text-amber-300 border-amber-500/35 shadow-inner'
        }`}
        aria-expanded={isOpen}
        title="Danh mục 20 chuyên đề Tử Vi Đẩu Số & Phong Thủy Thầy Tôn"
      >
        <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="hidden sm:inline">Cẩm Nang</span>
        <ChevronDown
          className={`w-3 h-3 text-amber-400/80 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-amber-300' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="fixed sm:absolute left-2.5 right-2.5 sm:left-auto sm:right-0 mt-2 sm:w-[680px] md:w-[760px] max-h-[82vh] overflow-y-auto p-4 sm:p-5 rounded-2xl bg-slate-900/98 border border-amber-500/40 shadow-2xl backdrop-blur-xl z-50 text-slate-100 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {/* Cột 1: Luận Mệnh & Tham Vấn */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400 pb-1.5 border-b border-slate-800">
                <Crown className="w-3.5 h-3.5 shrink-0" />
                <span>Luận Mệnh &amp; Tham Vấn</span>
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link
                    href="/thay-ton"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-amber-200 hover:text-amber-300 hover:bg-slate-800/80 font-semibold transition"
                  >
                    ✦ Hồ Sơ Chuyên Gia Thầy Tôn
                  </Link>
                </li>
                <li>
                  <Link
                    href="/luan-giai-tu-vi-chuyen-sau"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-amber-300 hover:bg-slate-800/80 transition"
                  >
                    • Bản Chuyên Sâu Pro (119.000đ)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/luan-giai-tu-vi-chuyen-gia"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-amber-300 hover:bg-slate-800/80 transition"
                  >
                    • Bản Chuyên Gia 12 Cung (269.000đ)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hoi-dap-tu-vi-ai"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-amber-300 hover:bg-slate-800/80 transition"
                  >
                    • Hỏi Đáp Tử Vi Cùng AI Thầy Tôn
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dat-lich-xem-tu-vi"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-amber-300 hover:bg-slate-800/80 transition"
                  >
                    • Đặt Lịch Xem Trực Tiếp 1-1
                  </Link>
                </li>
                <li>
                  <Link
                    href="/lien-he"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-amber-300 hover:bg-slate-800/80 transition"
                  >
                    • Liên Hệ &amp; Hướng Dẫn Đặt Lịch
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 2: Phong Thủy & Trạch Nhật */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400 pb-1.5 border-b border-slate-800">
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Phong Thủy &amp; Trạch Nhật</span>
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link
                    href="/phong-thuy"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-emerald-200 hover:text-emerald-300 hover:bg-slate-800/80 font-semibold transition"
                  >
                    ✦ Tư Vấn Phong Thủy Theo Lá Số
                  </Link>
                </li>
                <li>
                  <Link
                    href="/phong-thuy-nha-o"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-emerald-300 hover:bg-slate-800/80 transition"
                  >
                    • Phong Thủy Nhà Ở, Chung Cư
                  </Link>
                </li>
                <li>
                  <Link
                    href="/phong-thuy-van-phong"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-emerald-300 hover:bg-slate-800/80 transition"
                  >
                    • Phong Thủy Văn Phòng, Cửa Hàng
                  </Link>
                </li>
                <li>
                  <Link
                    href="/phong-thuy-cai-van"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-emerald-300 hover:bg-slate-800/80 transition"
                  >
                    • Phong Thủy Cải Vận Hợp Mệnh
                  </Link>
                </li>
                <li>
                  <Link
                    href="/xem-ngay-tot"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-emerald-300 hover:bg-slate-800/80 transition"
                  >
                    • Xem Ngày Tốt Động Thổ, Khai Trương
                  </Link>
                </li>
                <li>
                  <Link
                    href="/xem-tuoi-lam-nha-2027"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-emerald-300 hover:bg-slate-800/80 transition"
                  >
                    • Xem Tuổi Làm Nhà Năm 2027
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tu-vi-va-phong-thuy"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-emerald-300 hover:bg-slate-800/80 transition"
                  >
                    • Tử Vi &amp; Phong Thủy Kết Hợp Ra Sao?
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 3: Tinh Đẩu & Vận Hạn */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-indigo-400 pb-1.5 border-b border-slate-800">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Tinh Đẩu &amp; Vận Hạn</span>
              </div>
              <ul className="space-y-1 text-xs">
                <li>
                  <Link
                    href="/cach-xem-la-so-tu-vi"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-indigo-200 hover:text-indigo-300 hover:bg-slate-800/80 font-semibold transition"
                  >
                    ✦ Cách Xem Lá Số Tử Vi Cho Người Mới
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tu-vi-2027"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-indigo-300 hover:bg-slate-800/80 transition"
                  >
                    • Tử Vi Năm 2027 Đinh Mùi (12 Tuổi)
                  </Link>
                </li>
                <li>
                  <Link
                    href="/14-chinh-tinh-tu-vi"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-indigo-300 hover:bg-slate-800/80 transition"
                  >
                    • 14 Chính Tinh: Ý Nghĩa &amp; Đắc, Hãm
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tu-hoa-trong-tu-vi"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-indigo-300 hover:bg-slate-800/80 transition"
                  >
                    • Tứ Hóa: Lộc, Quyền, Khoa, Kỵ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/menh-vo-chinh-dieu"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-indigo-300 hover:bg-slate-800/80 transition"
                  >
                    • Mệnh Vô Chính Diệu Tốt Hay Xấu?
                  </Link>
                </li>
                <li>
                  <Link
                    href="/khong-nho-gio-sinh"
                    onClick={() => setIsOpen(false)}
                    className="block px-2 py-1.5 rounded-lg text-slate-200 hover:text-indigo-300 hover:bg-slate-800/80 transition"
                  >
                    • Không Nhớ Giờ Sinh Lập Lá Số Thế Nào?
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Thanh điều hướng dưới cùng của Dropdown */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <Link
              href="/bai-viet"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Xem Toàn Bộ Thư Viện Chuyên Đề</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/#lap-la-so"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-bold text-xs shadow-sm hover:from-amber-400 hover:to-yellow-500 transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lập Lá Số Miễn Phí (0đ)</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
