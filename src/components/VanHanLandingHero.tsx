'use client';

import React from 'react';
import {
  Compass,
  Crown,
  Gem,
  ShieldCheck,
  Sparkles,
  ArrowDown,
  GraduationCap,
  Award,
  CheckCircle2,
} from 'lucide-react';

export default function VanHanLandingHero() {
  const scrollToForm = () => {
    const el = document.getElementById('lap-la-so');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="max-w-[1120px] mx-auto mb-7 sm:mb-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0d1326] to-amber-950/35 border border-amber-500/40 p-5 sm:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
          {/* Cột Trái: Thông điệp Giải mã 3 Tầng Vận Hạn 2026 - 2027 */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Luận Giải Vận Hạn 2026 – 2027 Chuẩn 3 Tầng</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Mở khóa tự động 24/7 ngay khi quét QR</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold font-serif text-white leading-snug">
                Giải Mã Vận Hạn Năm <span className="text-amber-400">2026 – 2027</span> Qua 3 Cung Hạn: Tiểu Hạn • LN.Đại Hạn • Lưu Thái Tuế
              </h1>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                Xem vận hạn một năm mà chỉ nhìn 1 cung là bỏ sót mất 2/3 bức tranh. Hệ thống của{' '}
                <strong className="text-amber-300">Thầy Tôn</strong> đối chiếu đồng thời cả{' '}
                <strong className="text-white">3 cung hạn riêng biệt</strong> trên lá số 108+ sao kết hợp{' '}
                <strong className="text-white">Nhân Tướng Học</strong> để chỉ rõ thời điểm tiến – thoái về Tài chính, Công danh, Đất đai và Gia đạo:
              </p>

              {/* 3 Thẻ Giải Mã Tam Hạn Dễ Hiểu */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="rounded-2xl bg-slate-950/75 border border-amber-500/30 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-[11px] text-amber-300">
                      1
                    </span>
                    <span>Cung Tiểu Hạn</span>
                  </div>
                  <div className="text-xs font-semibold text-white">Nội tâm &amp; Mong muốn</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Đọc vị suy nghĩ, trăn trở hay khát vọng bứt phá đang khởi lên từ bên trong bạn trong năm xem.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950/75 border border-cyan-500/30 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-cyan-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-[11px] text-cyan-300">
                      2
                    </span>
                    <span>Cung LN.Đại Hạn</span>
                  </div>
                  <div className="text-xs font-semibold text-white">Điểm rơi Đại vận 10 năm</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Chỉ thẳng lĩnh vực trọng tâm (Tài bạch, Điền trạch, Quan lộc, Gia đạo...) chịu tác động lớn nhất.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950/75 border border-purple-500/30 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-[11px] text-purple-300">
                      3
                    </span>
                    <span>Cung Lưu Thái Tuế</span>
                  </div>
                  <div className="text-xs font-semibold text-white">Hoàn cảnh &amp; Kết quả</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Xét dàn Sao Lưu để chốt kết quả thực tế về dòng tiền, hợp đồng, quý nhân và sức khỏe.
                  </p>
                </div>
              </div>
            </div>

            {/* Nút nhảy thẳng xuống Form cho điện thoại */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={scrollToForm}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Nhập Ngày Giờ Sinh Để Giải Mã Ngay</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-300">
                ✓ Logic, thực chứng, không mê tín • Lưu Sổ Tay &amp; xuất PDF trọn đời
              </span>
            </div>
          </div>

          {/* Cột Phải: Chân dung & Uy tín Học Thuật Thầy Tôn (Đồng bộ 100% ảnh Bài Ads 04) */}
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-2xl bg-slate-950/85 border border-amber-400/35 p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <img
                  src="/thay-ton.png"
                  alt="Thầy Tôn - Chuyên gia Tử Vi Đẩu Số & Phong Thủy"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400/70 shadow-lg shrink-0"
                />
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    Biên Soạn &amp; Thẩm Định Thuật Toán
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold font-serif text-white">
                    Thầy Tôn (Trần Huy Tôn)
                  </div>
                  <div className="text-xs text-emerald-300 font-semibold">
                    18+ năm nghiên cứu Tử Vi, Tướng Pháp &amp; Phong Thủy
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-200 border-t border-slate-800/90 pt-3">
                <div className="flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Cựu học sinh khối <strong>Chuyên Toán - Tin</strong>, Đại học Tổng hợp Hà Nội.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Thạc sĩ Quản lý Tài chính &amp; Kế toán tại <strong>Đại học Lancaster (Top 5 Vương Quốc Anh)</strong>.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    Luận giải mạch lạc theo tổ hợp sao &amp; dòng thời gian — <strong>tuyệt đối không hù dọa mê tín</strong>.
                  </span>
                </div>
              </div>

              {/* Tóm tắt nhanh 2 Gói Chuyên Sâu */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-bold text-amber-300">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bản Chuyên Sâu VIP Pro</span>
                  </span>
                  <span className="font-extrabold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    119.000đ
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Luận chi tiết 3 cung Vận Hạn &amp; 4 mùa (~2.500 từ) + Soi Mặt &amp; Chỉ tay + 🎁 Tặng 02 câu hỏi VIP.
                </p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-bold text-purple-300">
                    <Gem className="w-3.5 h-3.5 text-purple-400" />
                    <span>Bản Đại Tông Sư Expert (12 Cung)</span>
                  </span>
                  <span className="font-extrabold text-purple-200 bg-purple-500/20 border border-purple-400/35 px-2 py-0.5 rounded-full">
                    269.000đ
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tuyệt phẩm ~5.000 từ mổ xẻ đủ 12 Cung + Bản đồ chi tiết từng tháng (Tháng 1–12 Âm lịch) + 🎁 Tặng 02 câu hỏi Chuyên Gia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
