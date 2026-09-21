'use client';

import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Award,
  Sparkles,
  ExternalLink,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Building2,
  PhoneCall,
  Compass,
  CheckCircle2,
  MapPin,
  Mail,
} from 'lucide-react';

export default function AboutThayTon() {
  return (
    <section
      id="gioi-thieu-thay-ton"
      className="w-full max-w-[1060px] mx-auto mt-10 sm:mt-14 scroll-mt-6"
    >
      {/* Khung chính phong cách Cosmic Gold sang trọng */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-slate-900/85 border border-amber-500/30 p-6 sm:p-10 shadow-2xl shadow-amber-950/20">
        {/* Hào quang nền trang trí */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Phần đầu: Tiêu đề & Giới thiệu ngắn */}
        <div className="relative z-10 text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chân Dung Người Sáng Lập &amp; Luận Giải</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-amber-400 tracking-wide mb-3">
            Thầy Tôn (Trần Huy Tôn)
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Nhà nghiên cứu Mệnh lý học Dịch học cổ truyền, cựu chuyên gia Tài chính — Kiểm toán Quốc tế.
            Người tiên phong kết hợp <strong className="text-amber-300 font-semibold">Tư duy logic Toán học</strong>,{' '}
            <strong className="text-amber-300 font-semibold">Nhãn quan kinh tế thực chứng</strong> cùng{' '}
            <strong className="text-amber-300 font-semibold">Bát Bộ Thần Sát &amp; Tướng Pháp Bí Truyền</strong>.
          </p>
        </div>

        {/* 4 Thẻ Số Liệu Nổi Bật (Stats Grid) */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center hover:border-amber-500/40 transition">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">18+ Năm</div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              Nghiên cứu Tử Vi &amp; Cổ thuật
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center hover:border-amber-500/40 transition">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">7+ Năm</div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              Học tập &amp; làm việc tại Anh Quốc
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center hover:border-amber-500/40 transition">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">Top 5 UK</div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              Đại học Lancaster (Tài chính)
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center hover:border-amber-500/40 transition">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">15+ Năm</div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              Giảng dạy &amp; Nghiên cứu kinh tế
            </div>
          </div>
        </div>

        {/* 3 Cột Trụ Nền Tảng (3 Pillars Grid) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-12">
          {/* Cột 1: Học vấn & Du học */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-amber-300 font-serif">
                Học Vấn &amp; Vương Quốc Anh
              </h3>
              <ul className="text-sm sm:text-base text-slate-200 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <span>
                    Cựu học sinh cấp ba lớp <strong>Toán - Tin</strong>, Trường Đại học Tổng Hợp Hà Nội.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <span>
                    Hơn <strong>7 năm du học và làm việc tại Anh Quốc</strong> từ năm 16 tuổi.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <span>
                    Tốt nghiệp khoa Quản lý Tài chính Kế toán trường <strong>Đại học Lancaster</strong> — Top 5 trường đứng đầu về Accounting &amp; Finance tại Vương Quốc Anh (UK).
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cột 2: Kinh nghiệm Tài chính & Nghiên cứu */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-blue-300 font-serif">
                Kiểm Toán &amp; Kinh Tế Thực Chứng
              </h3>
              <ul className="text-sm sm:text-base text-slate-200 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                  <span>
                    Kinh nghiệm làm việc thực chiến tại các <strong>công ty kiểm toán Quốc tế</strong> và các tổ chức tài chính doanh nghiệp.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                  <span>
                    Thâm niên <strong>hơn 15 năm</strong> nghiên cứu chuyên sâu và giảng dạy bộ môn ngôn ngữ Anh cùng các môn khoa học tài chính kinh tế cho các trường Quốc tế.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                  <span>
                    Chủ sáng lập nền tảng giáo dục học thuật{' '}
                    <a
                      href="https://tonyenglish.vn/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline inline-flex items-center gap-0.5 font-semibold"
                    >
                      TonyEnglish.vn <ExternalLink className="w-3.5 h-3.5 inline" />
                    </a>.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                  <span>
                    Tiếp tục tham gia nghiên cứu chuyên sâu về các lĩnh vực kinh tế thương mại, chu kỳ đầu tư tại Việt Nam.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Cột 3: Kinh nghiệm Tử Vi & Đối tượng tư vấn */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-purple-300 font-serif">
                18 Năm Tử Vi &amp; Cố Vấn Đương Số
              </h3>
              <ul className="text-sm sm:text-base text-slate-200 space-y-2.5 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                  <span>
                    <strong>Gần 18 năm</strong> nghiên cứu, khảo chứng và thực hành Tử Vi Đẩu Số, kết hợp Bát Bộ Thần Sát và Diện Tướng, Thủ Tướng.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                  <span>
                    Trực tiếp tham vấn và định hướng thời vận cho <strong>rất nhiều đối tượng</strong>: từ các nghệ sĩ, diễn viên tên tuổi, lãnh đạo tập đoàn, chủ doanh nghiệp lớn đến các nhà đầu tư tài chính.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                  <span>
                    Đồng hành cùng <strong>các bạn trẻ</strong> định hướng học tập, du học, chọn ngành nghề phù hợp bản mệnh, hóa giải trắc trở tình duyên và kiến tạo sự nghiệp.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Khối Triết Lý Luận Giải: Logic Khoa Học x Huyền Học Chân Truyền */}
        <div className="relative z-10 bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-amber-500/10 p-5 sm:p-7 rounded-2xl border border-amber-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-amber-400 font-serif font-bold text-lg sm:text-xl">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Triết Lý Luận Giải: Khoa Học — Thực Chứng — Không Mê Tín Dị Đoan</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                Khác biệt lớn nhất trong các bài bình giải của Thầy Tôn nằm ở <strong>tính hệ thống, logic khoa học chặt chẽ và sự tỉ mỉ</strong>. 
                Dưới lăng kính của người làm toán học và tài chính quốc tế, Tử Vi là bản đồ phân tích chu kỳ nhân sinh và quản trị rủi ro cuộc đời — 
                biến những điển tích cổ tự phức tạp thành những định hướng sắc bén, gần gũi, giúp quý đương số <em>&quot;Tri mệnh để thuận mệnh, nắm bắt thời cơ và hanh thông bản mệnh&quot;</em>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <a
                href="https://tonyenglish.vn/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-sm sm:text-base font-semibold transition"
                title="Ghé thăm trang web học thuật cá nhân của Thầy Tôn"
              >
                <span>Xem Website TonyEnglish</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <a
                href="https://zalo.me/0935058688"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm sm:text-base font-bold shadow-md shadow-amber-500/20 transition"
                title="Tư vấn hoặc đặt lịch luận giải trực tiếp"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Liên Hệ Đàm Đạo</span>
              </a>
            </div>
          </div>
        </div>

        {/* Thông tin liên hệ & Địa chỉ đàm đạo trực tiếp */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-sm sm:text-base text-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Địa chỉ:</strong> R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Liên hệ:</strong>{' '}
                <a href="tel:0935058688" className="text-amber-300 hover:underline font-bold">
                  +84 93 505 8688
                </a>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Email:</strong>{' '}
                <a href="mailto:tranhuyton@gmail.com" className="text-slate-200 hover:text-amber-300 hover:underline">
                  tranhuyton@gmail.com
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
