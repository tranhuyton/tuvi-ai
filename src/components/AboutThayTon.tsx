'use client';

import React from 'react';
import {
  GraduationCap,
  Briefcase,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  PhoneCall,
  Compass,
  CheckCircle2,
  MapPin,
  Mail,
  Gift,
  Crown,
  Gem,
  Users,
  HelpCircle,
  ArrowUpRight,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ABOUT_DATA } from '@/lib/i18n/aboutData';

const SERVICE_HIGHLIGHTS_VI = [
  {
    badge: 'Trải Nghiệm Ngay • 0đ',
    title: 'An Sao & Bình Giải Miễn Phí',
    price: 'Miễn Phí 100%',
    color: 'emerald',
    icon: Gift,
    desc: 'Lập lá số Tử Vi trọn đời chuẩn xác 110+ chính phụ tinh theo giờ sinh và nhận ngay bài Bình Giải Khởi Nguyên (~1.000 từ).',
    bullets: [
      'Giải mã Cốt cách Bản Mệnh, Cục & Âm Dương Thuận/Nghịch lý',
      'Phân tích Tam Hợp Mệnh - Tài Bạch - Quan Lộc & cung Thân',
      'Dự báo tổng quan Đại Vận 10 năm & Tiểu Vận năm xem hạn',
      'Lưu lá số vào Sổ Tay Cá Nhân & Tải ảnh lá số / PDF miễn phí',
    ],
    ctaText: 'Lập Lá Số Miễn Phí Ngay',
    ctaAction: 'scrollTop',
  },
  {
    badge: 'Đông Khách Nhất',
    title: 'Bản Chuyên Sâu VIP Pro',
    price: '119.000 VNĐ',
    color: 'amber',
    icon: Crown,
    desc: 'Đại pháp bí truyền chuyên sâu (~2.500 từ), kết hợp Tử Vi Đẩu Số, Bát Bộ Thần Sát cùng Diện Tướng & Chỉ Tay thực chứng.',
    bullets: [
      'Luận sâu 14 Chính tinh, Tứ Hóa & các bộ sao Đắc/Hãm địa',
      'Kết hợp AI Thị Giác soi Diện Tướng (mặt) & Thủ Tướng (chỉ tay)',
      'Luận giải chi tiết vận hạn 4 mùa Xuân - Hạ - Thu - Đông',
      '🎁 Tặng kèm 02 câu hỏi VIP Chuyên Sâu (trị giá 99.000đ)',
    ],
    ctaText: 'Chọn Gói VIP Pro Trên Form',
    ctaAction: 'scrollTop',
  },
  {
    badge: 'Đỉnh Cao Toàn Diện',
    title: 'Bản Chuyên Gia Đại Tông Sư (Expert)',
    price: '269.000 VNĐ',
    color: 'purple',
    icon: Gem,
    desc: 'Ấn phẩm luận giải Đại Tông Sư đồ sộ nhất (~4.500 – 6.000 từ), khảo sát không sót bất kỳ góc khuất nào trên lá số.',
    bullets: [
      'Bình giải chi tiết trọn vẹn TẤT CẢ 12 CUNG trên bàn cờ Tử Vi',
      'Luận giải chi tiết TỪNG THÁNG (Tháng 1 đến Tháng 12 Âm lịch)',
      'Đối chiếu chuyên sâu Tướng Mặt, Chỉ Tay & Phong Thủy Cải Vận',
      '🎁 Tặng kèm 02 câu hỏi Chuyên Gia (Soi 12 cung & tháng hạn)',
    ],
    ctaText: 'Chọn Gói Expert Trên Form',
    ctaAction: 'scrollTop',
  },
  {
    badge: 'Tham Vấn Trực Tiếp 1-1',
    title: 'Đặt Lịch Xem Tử Vi & Phong Thủy Cùng Thầy Tôn',
    price: 'Online / Offline',
    color: 'blue',
    icon: Users,
    desc: 'Đàm đạo riêng 1-1 trực tiếp cùng Thầy Tôn (Trần Huy Tôn) tại Royal City (Hà Nội), khảo sát thực địa hoặc qua Video Call Quốc tế.',
    bullets: [
      'Thẩm định giờ sinh, luận sâu Lá Số Tử Vi, Diện Tướng, Chỉ Tay & Quẻ Dịch',
      'Khảo sát & bố cục Phong Thủy Nhà Ở, Biệt Thự, Chung Cư, Văn Phòng, Cửa Hàng',
      'Xem ngày giờ tốt Động thổ, Xây dựng, Nhập trạch, Khai trương & Cưới hỏi',
      'Hoạch định chiến lược Kinh doanh, Đầu tư, Sự nghiệp & Phong thủy cải vận',
    ],
    ctaText: 'Nhắn Zalo Đặt Lịch: 0935.058.688',
    ctaHref: 'https://zalo.me/0935058688',
  },
];

const FENG_SHUI_SERVICES_VI = [
  {
    badge: 'Dương Trạch Gia Cư',
    title: 'Phong Thủy Nhà Ở, Biệt Thự & Chung Cư',
    sub: 'Khảo Sát Thực Địa Hoặc Qua Bản Vẽ Kiến Trúc',
    points: [
      'Đo đạc độ số la kinh, phân tích Loan Đầu (ngoại cục) & Lý Khí (Huyền Không Phi Tinh, Bát Trạch Minh Cảnh).',
      'Tối ưu vị trí và hướng Cổng/Cửa chính, Phòng khách, Bếp nấu (Táo vị), Phòng ngủ và Bàn thờ Gia tiên hợp mệnh chủ.',
      'Hóa giải triệt để các thế phạm: đường đâm, góc nhọn xung chiếu, xà ngang压đỉnh, cửa đối cửa, khuyết góc cung vị.',
    ],
  },
  {
    badge: 'Thương Mại & Doanh Nghiệp',
    title: 'Phong Thủy Văn Phòng, Cửa Hàng & Trụ Sở',
    sub: 'Kích Hoạt Tài Lộc — Vượng Khí Kinh Doanh',
    points: [
      'Quy hoạch vị trí phòng Chủ tịch/Giám đốc, bàn làm việc lãnh đạo, két sắt, quầy thu ngân và ban Thần Tài - Thổ Địa.',
      'Kích hoạt cung Tài vị, Quý nhân và Lộc mã theo vận 9 Hạ Nguyên giúp doanh nghiệp thu hút dòng tiền và nhân sự giỏi.',
      'Tư vấn chọn mặt bằng kinh doanh, hướng tòa nhà và bố cục dòng khí nội cục hanh thông,聚khí sinh tài.',
    ],
  },
  {
    badge: 'Thiên Địa Nhân Hợp Nhất',
    title: 'Phong Thủy Cải Vận Kết Hợp Lá Số Tử Vi',
    sub: 'Cá Nhân Hóa Theo Dụng Thần & Cung Điền Trạch',
    points: [
      'Đối chiếu trực tiếp cung Mệnh, Điền Trạch, Tài Bạch, Quan Lộc trên lá số Tử Vi để tìm đúng Ngũ hành Dụng thần.',
      'Tư vấn phương vị lập nghiệp, hướng xuất hành, màu sắc bản mệnh, biển số xe, số tài khoản và vật phẩm hộ thân.',
      'Chủ động hóa giải hạn Thái Tuế, Tam Tai, Kim Lâu, Hoang Ốc và các bộ hung sát tinh xâm phạm trong Đại vận / Lưu niên.',
    ],
  },
  {
    badge: 'Trạch Nhật Cát Khánh',
    title: 'Xem Ngày Giờ Tốt — Động Thổ, Nhập Trạch, Khai Trương',
    sub: 'Chuẩn Hiệp Kỷ Biện Phương Thư & Mệnh Chủ',
    points: [
      'Chọn ngày giờ hoàng đạo đại cát cho các đại sự: Động thổ làm nhà, Đổ mái, Nhập trạch về nhà mới, Khai trương cửa hàng/công ty.',
      'Xem tuổi làm nhà, mượn tuổi động thổ và hướng dẫn chi tiết quy trình lễ nghi chuẩn cổ truyền, trang nghiêm, giản dị.',
      'Tư vấn chọn ngày giờ Ký kết hợp đồng lớn, Nhậm chức, Xuất hành đi xa và Xem tuổi kết hôn — Cưới hỏi trăm năm.',
    ],
  },
];

const FAQ_ITEMS_VI = [
  {
    q: '1. An sao và bình giải Tử Vi tại Tử Vi & Phong Thủy Thầy Tôn có thực sự miễn phí không?',
    a: 'Hoàn toàn miễn phí! Quý đương số chỉ cần nhập Họ tên, Ngày tháng năm sinh (Dương lịch hoặc Âm lịch), Giờ sinh và Năm muốn xem hạn rồi chọn "Bản Khởi Nguyên (Miễn Phí - 0đ)". Hệ thống sẽ lập lá số Tử Vi chuẩn xác 110+ sao kèm bài bình giải tổng quan (~1.000 từ) hoàn toàn miễn phí, hỗ trợ lưu lá số và tải ảnh/PDF tiện lợi.',
  },
  {
    q: '2. Thầy Tôn (Trần Huy Tôn) là ai? Vì sao phương pháp Tử Vi & Phong Thủy của Thầy được đánh giá cao?',
    a: 'Thầy Tôn (Trần Huy Tôn) là cựu học sinh Chuyên Toán - Tin Đại học Tổng Hợp Hà Nội, tốt nghiệp Cử nhân Tài chính - Kế toán tại Đại học Lancaster (Top 5 Vương Quốc Anh) với hơn 7 năm học tập, làm việc tại Anh Quốc và hơn 18 năm nghiên cứu Tử Vi Đẩu Số, Bát Bộ Thần Sát, Phong Thủy Dương Trạch & Tướng Pháp thực chứng. Phương pháp của Thầy kết hợp tư duy logic Toán học, nhãn quan Kinh tế vĩ mô và Dịch học chính tông — giúp luận giải Tử Vi và bố cục Phong Thủy chuẩn xác, thực tế, khoa học và tuyệt đối không mê tín dị đoan.',
  },
  {
    q: '3. Sự khác biệt giữa Bản Miễn Phí (0đ), Bản VIP Pro (119k) và Bản Chuyên Gia Expert (269k) là gì?',
    a: '• Bản Miễn Phí (0đ): Luận tổng quan (~1.000 từ) về Bản Mệnh, Tam Hợp Mệnh - Tài - Quan, Đại Vận & Tiểu Vận năm xem.\n• Bản VIP Pro (119.000đ): Luận sâu gấp đôi (~2.500 từ), kết hợp phân tích ảnh Khuôn mặt (Diện tướng) & Chỉ tay (Thủ tướng), vận hạn 4 mùa Xuân - Hạ - Thu - Đông, tặng kèm 02 câu hỏi VIP.\n• Bản Chuyên Gia Đại Tông Sư Expert (269.000đ): Luận giải đồ sộ nhất (~4.500 - 6.000 từ), khảo sát toàn diện TẤT CẢ 12 CUNG, Phi Tinh Tứ Hóa, dự báo chi tiết TỪNG THÁNG từ tháng 1 đến tháng 12 Âm lịch, kết hợp Tướng pháp & Phong thủy cải vận, tặng kèm 02 câu hỏi Chuyên Gia.',
  },
  {
    q: '4. Thầy Tôn tư vấn những hạng mục Phong Thủy nào? Có khảo sát thực địa và tư vấn từ xa không?',
    a: 'Thầy Tôn trực tiếp tư vấn toàn diện các hạng mục Phong Thủy Dương Trạch: Nhà phố, Biệt thự, Căn hộ chung cư, Văn phòng công ty, Cửa hàng kinh doanh; Bố cục bàn thờ, bếp, phòng ngủ, bàn làm việc lãnh đạo; Kích hoạt Tài vị và Xem ngày giờ tốt (Động thổ, Nhập trạch, Khai trương, Cưới hỏi). Thầy nhận khảo sát thực địa trực tiếp tại Hà Nội & các tỉnh lân cận, đồng thời tư vấn Phong Thủy từ xa qua Bản vẽ mặt bằng + Video thực tế + Toạ độ vệ tinh cho khách hàng trên toàn quốc và kiều bào Quốc tế.',
  },
  {
    q: '5. Vì sao nên kết hợp đồng thời Lá Số Tử Vi và Phong Thủy khi xây sửa nhà hoặc mở văn phòng kinh doanh?',
    a: 'Trong cổ học phương Đông, "Nhất Mệnh, Nhì Vận, Tam Phong Thủy". Lá số Tử Vi cho biết Thiên Thời (vận hạn thịnh suy, cung Điền Trạch, Tài Bạch và Ngũ hành Dụng thần của gia chủ), còn Phong Thủy chính là Địa Lợi (khí trường không gian sống và làm việc). Khi kết hợp cả hai, Thầy Tôn sẽ giúp gia chủ chọn đúng thời điểm đại cát để mua đất/xây nhà/mở công ty và bố cục không gian chuẩn Dụng thần của chính lá số đó — tạo sự cộng hưởng mạnh mẽ nhất về Tài lộc, Sức khỏe và Gia đạo.',
  },
  {
    q: '6. Làm thế nào để đặt lịch xem Tử Vi & Tư vấn Phong Thủy trực tiếp 1-1 cùng Thầy Tôn?',
    a: 'Quý khách có thể đặt lịch xem trực tiếp 1-1 cùng Thầy Tôn tại phòng khách R2B 2219, Khu đô thị Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội; đặt lịch mời Thầy khảo sát Phong Thủy thực địa; hoặc xem Online 1-1 qua Video Call bằng cách gọi/nhắn Zalo số 0935.058.688.',
  },
];

export default function AboutThayTon() {
  const { language } = useLanguage();
  const data = ABOUT_DATA[language] || ABOUT_DATA.vi;

  const scrollToForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="gioi-thieu-thay-ton"
      className="w-full max-w-[1060px] mx-auto mt-10 sm:mt-14 scroll-mt-6 space-y-8 sm:space-y-10"
    >
      {/* Khung chính 1: Giới thiệu Thầy Tôn phong cách Cosmic Gold sang trọng */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-slate-900/85 border border-amber-500/30 p-6 sm:p-10 shadow-2xl shadow-amber-950/20">
        {/* Hào quang nền trang trí */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Phần đầu: Tiêu đề & Giới thiệu ngắn */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{data.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-amber-400 tracking-wide mb-3">
            {data.name}
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            {data.bio}
          </p>
        </div>

        {/* 4 Thẻ Số Liệu Nổi Bật (Stats Grid) */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {data.stats.map((s, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-amber-500/20 text-center hover:border-amber-500/40 transition"
            >
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">{s.val}</div>
              <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* 3 Cột Trụ Nền Tảng (3 Pillars Grid) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-8 sm:mb-12">
          {/* Cột 1: Học vấn */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-amber-300 font-serif">
                {data.pillar1.title}
              </h3>
              <ul className="text-sm sm:text-base text-slate-200 space-y-2.5 leading-relaxed">
                {data.pillar1.points.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                    <span>{p}</span>
                  </li>
                ))}
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
                {data.pillar2.title}
              </h3>
              <ul className="text-sm sm:text-base text-slate-200 space-y-2.5 leading-relaxed">
                {data.pillar2.points.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-1" />
                    <span>
                      {typeof p === 'string' ? (
                        p
                      ) : (
                        <>
                          {p.text}
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline inline-flex items-center gap-0.5 font-semibold"
                          >
                            {p.linkText} <ExternalLink className="w-3.5 h-3.5 inline" />
                          </a>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cột 3: Kinh nghiệm Tử Vi */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/30 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-purple-300 font-serif">
                {data.pillar3.title}
              </h3>
              <ul className="text-sm sm:text-base text-slate-200 space-y-2.5 leading-relaxed">
                {data.pillar3.points.map((p, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-1" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Khối Triết Lý Luận Giải */}
        <div className="relative z-10 bg-gradient-to-r from-amber-500/10 via-slate-900/90 to-amber-500/10 p-5 sm:p-7 rounded-2xl border border-amber-500/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-amber-400 font-serif font-bold text-lg sm:text-xl">
                <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{data.philosophy.title}</span>
              </div>
              <p className="text-sm sm:text-base text-slate-200 max-w-2xl leading-relaxed">
                {data.philosophy.desc}
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
                <span>{data.philosophy.websiteBtn}</span>
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
                <span>{data.philosophy.contactBtn}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Thông tin liên hệ & Địa chỉ đàm đạo trực tiếp */}
        <div className="relative z-10 mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-sm sm:text-base text-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>{data.addressLabel}</strong> {data.addressValue}
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>{data.contactLabel}</strong>{' '}
                <a href="tel:0935058688" className="text-amber-400 hover:text-amber-300 font-bold transition">
                  0935.058.688
                </a>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href="mailto:tranhuyton@gmail.com" className="text-slate-300 hover:text-white transition">
                tranhuyton@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Khung 2: Hệ Sinh Thái Dịch Vụ An Sao & Bình Giải Tử Vi Thầy Tôn (Tối ưu Quảng cáo, SEO & GEO) */}
      <div
        id="dich-vu-tu-vi-thay-ton"
        className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-slate-900/85 border border-amber-500/30 p-6 sm:p-10 shadow-2xl shadow-amber-950/20"
      >
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Hệ Sinh Thái Dịch Vụ Uy Tín • Minh Bạch • Thực Chứng</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-400 tracking-wide mb-2.5">
            Các Gói An Sao, Bình Giải Tử Vi & Tư Vấn Phong Thủy Cùng Thầy Tôn
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Từ trải nghiệm <strong className="text-emerald-300">An Sao & Bình Giải Miễn Phí (0đ)</strong> đến các gói{' '}
            <strong className="text-amber-300">Luận Giải Chuyên Sâu VIP Pro</strong>,{' '}
            <strong className="text-purple-300">Đại Tông Sư 12 Cung & 12 Tháng</strong> và{' '}
            <strong className="text-blue-300">Xem Tử Vi & Phong Thủy Trực Tiếp 1-1 Cùng Thầy Tôn</strong>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {SERVICE_HIGHLIGHTS_VI.map((srv, idx) => {
            const IconComp = srv.icon;
            const borderCls =
              srv.color === 'emerald'
                ? 'border-emerald-500/35 hover:border-emerald-400/60 bg-emerald-950/15'
                : srv.color === 'amber'
                ? 'border-amber-500/40 hover:border-amber-400/70 bg-amber-950/15'
                : srv.color === 'purple'
                ? 'border-purple-500/40 hover:border-purple-400/70 bg-purple-950/15'
                : 'border-blue-500/35 hover:border-blue-400/60 bg-blue-950/15';

            const badgeCls =
              srv.color === 'emerald'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : srv.color === 'amber'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : srv.color === 'purple'
                ? 'bg-purple-500/20 text-purple-200 border-purple-500/40'
                : 'bg-blue-500/20 text-blue-300 border-blue-500/40';

            const titleCls =
              srv.color === 'emerald'
                ? 'text-emerald-300'
                : srv.color === 'amber'
                ? 'text-amber-300'
                : srv.color === 'purple'
                ? 'text-purple-200'
                : 'text-blue-300';

            const btnCls =
              srv.color === 'emerald'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : srv.color === 'amber'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950'
                : srv.color === 'purple'
                ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white';

            return (
              <div
                key={idx}
                className={`p-5 sm:p-6 rounded-2xl border transition flex flex-col justify-between space-y-4 ${borderCls}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeCls}`}>
                      <IconComp className="w-3.5 h-3.5" />
                      <span>{srv.badge}</span>
                    </span>
                    <span className="text-sm sm:text-base font-black text-white bg-slate-900/90 px-3 py-1 rounded-lg border border-slate-700">
                      {srv.price}
                    </span>
                  </div>

                  <h3 className={`text-lg sm:text-xl font-bold font-serif ${titleCls}`}>
                    {srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {srv.desc}
                  </p>

                  <ul className="space-y-2 pt-1 text-xs sm:text-sm text-slate-200">
                    {srv.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  {srv.ctaHref ? (
                    <a
                      href={srv.ctaHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition ${btnCls}`}
                    >
                      <span>{srv.ctaText}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={scrollToForm}
                      className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition cursor-pointer ${btnCls}`}
                    >
                      <span>{srv.ctaText}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Chuyên mục chuyên sâu: Các Hạng Mục Tư Vấn Phong Thủy Thực Chứng & Cải Vận */}
        <div id="dich-vu-phong-thuy" className="mt-8 sm:mt-10 pt-8 border-t border-slate-800/80 scroll-mt-6">
          <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Phong Thủy Chính Tông • Huyền Không Phi Tinh • Bát Trạch & Loan Đầu</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-amber-400">
              Chuyên Môn Tư Vấn Phong Thủy Thực Chứng & Cải Vận
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              Thầy Tôn trực tiếp khảo sát thực địa hoặc tư vấn từ xa qua bản vẽ kiến trúc & tọa độ vệ tinh — kết hợp chặt chẽ giữa <strong className="text-amber-300">Khí trường Phong Thủy (Địa Lợi)</strong> và <strong className="text-amber-300">Lá Số Tử Vi Gia Chủ (Thiên Thời)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {FENG_SHUI_SERVICES_VI.map((fs, fIdx) => (
              <div
                key={fIdx}
                className="p-5 sm:p-6 rounded-2xl bg-slate-950/75 border border-amber-500/25 hover:border-amber-400/50 transition space-y-3"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35">
                    <Compass className="w-3 h-3 text-amber-400" />
                    <span>{fs.badge}</span>
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">{fs.sub}</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold font-serif text-amber-300">
                  {fs.title}
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {fs.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Khung 3: Câu Hỏi Thường Gặp (FAQ — Chuẩn SEO & GEO cho công cụ tìm kiếm & AI) */}
      <div
        id="cau-hoi-thuong-gap"
        className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-slate-900/85 border border-slate-800 p-6 sm:p-10 shadow-xl"
      >
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Giải Đáp Thắc Mắc Nhanh</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-amber-400">
            Câu Hỏi Thường Gặp Về Tử Vi & Phong Thủy Thầy Tôn
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {FAQ_ITEMS_VI.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-slate-800/90 hover:border-amber-500/30 transition space-y-2"
            >
              <h3 className="text-sm sm:text-base font-bold text-amber-300 leading-snug">
                {item.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
