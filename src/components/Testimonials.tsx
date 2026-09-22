'use client';

import React, { useState, useMemo } from 'react';
import {
  Star,
  Quote,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Award,
  Building2,
  GraduationCap,
  HeartHandshake,
  Compass,
  Stethoscope,
  Clapperboard,
  BadgeCheck,
} from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  category: 'expert' | 'business' | 'artist' | 'student';
  categoryLabel: string;
  avatarText: string;
  rating: number;
  highlight: string;
  content: string;
  tags: string[];
  verifiedDate?: string;
}

const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'expert-1',
    name: 'TS. Nguyễn Minh Khang',
    role: 'Viện phó Viện Nghiên cứu Dịch học & Phong thủy Ứng dụng',
    category: 'expert',
    categoryLabel: 'Chuyên Gia Mệnh Lý',
    avatarText: 'MK',
    rating: 5,
    highlight: 'Dung hòa cội nguồn Dịch học với tư duy lượng hóa xác suất phương Tây',
    content:
      'Nghiên cứu Mệnh lý hơn 30 năm, tôi hiếm khi gặp một người dung hòa được cội nguồn huyền học Á Đông với tư duy phân tích định lượng xuất sắc như Thầy Tôn. Cách Thầy luận giải Tử Vi không sa đà vào suy diễn thần bí, mà bóc tách cấu trúc 14 Chính tinh và Bát Bộ Thần Sát mạch lạc như một ma trận xác suất thống kê. Đây chính là chuẩn mực mà Dịch học hiện đại cần hướng tới.',
    tags: ['#ChuyênGiaDịchLý', '#KhoaHọcThựcChứng', '#MaTrậnSốMệnh'],
    verifiedDate: 'Đồng nghiệp Dịch học',
  },
  {
    id: 'business-1',
    name: 'Doanh nhân Lê Hoàng Nam',
    role: 'Chủ tịch HĐQT Tập đoàn Xuất Nhập Khẩu & Bất Động Sản',
    category: 'business',
    categoryLabel: 'Doanh Nhân & Đầu Tư',
    avatarText: 'HN',
    rating: 5,
    highlight: 'Cảnh báo đúng năm hạn dòng tiền, cứu doanh nghiệp tôi thoát hiểm trong gang tấc',
    content:
      'Làm kinh doanh với hàng trăm nhân sự, tôi chỉ tin vào dữ liệu thực tế. Năm 2022, khi thị trường đang hưng phấn đỉnh điểm, Thầy Tôn xem đại vận và cảnh báo năm 2023 cung Huynh Đệ ngộ Kiếp Sát, dòng vốn sẽ tắc nghẽn nghiêm trọng, khuyên tôi hoãn dự án 50ha và thu hồi công nợ gấp. Nhờ nghe Thầy, tập đoàn của tôi bảo toàn được dòng tiền qua cơn bão. Thầy không chỉ xem Tử Vi, Thầy đang tư vấn quản trị rủi ro chiến lược.',
    tags: ['#DoanhNhân', '#QuảnTrịRủiRo', '#ChuKỳKinhDoanh'],
    verifiedDate: 'Đã đàm đạo 1-1',
  },
  {
    id: 'expert-2',
    name: 'Thầy Thích Tuệ Minh (Nguyễn Đăng Quang)',
    role: 'Chủ nhiệm CLB Phong Thủy & Cổ Thuật Đông Phương',
    category: 'expert',
    categoryLabel: 'Chuyên Gia Mệnh Lý',
    avatarText: 'TM',
    rating: 5,
    highlight: 'Phối hợp chuẩn xác Thiên Bàn Tử Vi cùng Diện Tướng & Thủ Tướng bí truyền',
    content:
      'Điểm độc đáo nhất ở Thầy Tôn là khả năng đối chiếu Thiên bàn Tử Vi với Diện Tướng và Thủ Tướng (chỉ tay). Nhiều trường hợp lá số giờ sinh sai lệch vài khắc, nhưng Thầy soi tướng mạo và vân tay là hiệu chỉnh được ngay. Luận giải sắc sảo, có tâm có tầm, luôn định hướng người xem tu tâm tích đức, nắm bắt thời cơ chứ tuyệt đối không dọa nạt cúng bái mê tín.',
    tags: ['#PhongThủyĐôngPhương', '#SoiTướngChỉTay', '#ChínhPhápMệnhLý'],
    verifiedDate: 'Hội đồng Khảo chứng',
  },
  {
    id: 'artist-1',
    name: 'NSƯT / Đạo diễn Vũ Thanh Vân',
    role: 'Đạo diễn điện ảnh & Nhà sản xuất phim truyền hình',
    category: 'artist',
    categoryLabel: 'Nghệ Sĩ & Văn Hóa',
    avatarText: 'TV',
    rating: 5,
    highlight: 'Hóa giải thị phi chốn nghệ thuật, nắm bắt đúng thời điểm vàng để bùng nổ',
    content:
      'Chốn nghệ thuật vốn nhiều thị phi và biến động khó lường. Gặp được Thầy Tôn lúc tôi bế tắc nhất về dự án phim lớn, Thầy bấm quẻ Kỳ Môn Độn Giáp và chỉ rõ tháng 8 âm sẽ có quý nhân nâng đỡ ở phương Nam, đồng thời chỉ cách phòng ngừa tiểu nhân đố kỵ từ cung Nô Bộc. Dự án sau đó đã thắng lớn tại liên hoan phim. Thầy luận giải ấm áp, thông tuệ và truyền cho tôi nguồn năng lượng an định phi thường.',
    tags: ['#NghệSĩĐiệnẢnh', '#QuẻKỳMôn', '#HóaGiảiThịPhi'],
    verifiedDate: 'Đã đàm đạo 1-1',
  },
  {
    id: 'business-2',
    name: 'Trần Đăng Khoa, CFA',
    role: 'Giám đốc Quản lý Quỹ Đầu tư Tài chính Mạo hiểm (TP.HCM)',
    category: 'business',
    categoryLabel: 'Doanh Nhân & Đầu Tư',
    avatarText: 'ĐK',
    rating: 5,
    highlight: 'Nhãn quan tài chính quốc tế kết hợp chu kỳ vận hạn sắc bén đến kinh ngạc',
    content:
      'Tôi tìm đến Thầy Tôn vì Thầy tốt nghiệp Tài chính Đại học Lancaster (Top 5 UK) và có thâm niên kiểm toán quốc tế. Thầy phân tích tương quan cung Tài Bạch, Điền Trạch với chu kỳ kinh tế vĩ mô cực kỳ thuyết phục. Từng chặng 5 năm trong đại vận 10 năm được bóc tách như một bản báo cáo phân tích chiến lược cuộc đời độc bản.',
    tags: ['#ChuyênGiaCFA', '#TàiChínhVĩMô', '#ĐạiVận10Năm'],
    verifiedDate: 'Đã đàm đạo 1-1',
  },
  {
    id: 'student-1',
    name: 'Chị Hoàng Mai Lan & Cháu Minh Đức',
    role: 'Phụ huynh & Du học sinh Đại học Manchester (UK)',
    category: 'student',
    categoryLabel: 'Phụ Huynh & Giới Trẻ',
    avatarText: 'ML',
    rating: 5,
    highlight: 'Định hướng ngành học theo đúng căn cốt Mệnh — Thân, giành học bổng Anh Quốc',
    content:
      'Khi con đứng trước ngã rẽ chọn ngành du học Anh, gia đình rất phân vân giữa Kinh tế và Trí tuệ Nhân tạo. Nhờ Thầy Tôn soi lá số thấy cung Mệnh có Cự Cơ miếu địa, khuyên con theo hướng Khoa học Dữ liệu. Từng du học Anh từ năm 16 tuổi, Thầy còn chỉ dẫn tận tình kỹ năng sống và hòa nhập văn hóa UK. Nay con đã giành học bổng xuất sắc tại Manchester!',
    tags: ['#DuHọcAnhQuốc', '#ChọnNgànhĐúngMệnh', '#ĐịnhHướngTươngLai'],
    verifiedDate: 'Đã xem bản Chuyên Sâu',
  },
  {
    id: 'expert-3',
    name: 'BS. CKI Phạm Quốc Bảo',
    role: 'Bác sĩ chuyên khoa Nội tiết - Y học thực nghiệm',
    category: 'expert',
    categoryLabel: 'Y Học & Chuyên Gia',
    avatarText: 'QB',
    rating: 5,
    highlight: 'Soi cung Tật Ách và thể chất di truyền tương đồng chuẩn xác với y lý khoa học',
    content:
      'Là bác sĩ y khoa, ban đầu tôi rất thận trọng với các môn bói toán. Nhưng khi đọc bài bình giải của Thầy Tôn về cung Tật Ách và Phụ Mẫu, tôi thật sự bất ngờ. Thầy chỉ ra đúng các điểm yếu về gan mật và cột sống di truyền nhiều đời trong dòng tộc tôi. Các lời khuyên dưỡng sinh theo mùa tiết khí của Thầy hoàn toàn phù hợp với chu kỳ sinh học y khoa.',
    tags: ['#YKhoaThựcNghiệm', '#CungTậtÁch', '#DưỡngSinhTheoMệnh'],
    verifiedDate: 'Đã xem bản Chuyên Sâu',
  },
  {
    id: 'student-2',
    name: 'Đặng Quỳnh Anh',
    role: 'Founder & CEO Startup Công nghệ Giáo dục (Top 30 Under 30)',
    category: 'student',
    categoryLabel: 'Khởi Nghiệp & Giới Trẻ',
    avatarText: 'QA',
    rating: 5,
    highlight: 'Tháo gỡ bế tắc chọn cộng sự đồng hành và chọn đúng thời điểm gọi vốn Series A',
    content:
      'Là một founder trẻ nhiều lúc cảm thấy cô độc và chông chênh, trải nghiệm hỏi đáp cùng AI Thầy Tôn và sau đó gặp Thầy đàm đạo trực tiếp tại Royal City đã giúp mình tháo gỡ hoàn toàn các khúc mắc về cộng sự (cung Nô Bộc) và nhịp gọi vốn. Bài bình giải sâu sắc, chi tiết từng ngóc ngách, đọc đi đọc lại nhiều lần vẫn thấy thấm thía!',
    tags: ['#StartupFounder', '#ChọnCộngSự', '#HỏiĐápThầyTôn'],
    verifiedDate: 'Đã đàm đạo 1-1',
  },
];

type CategoryFilter = 'all' | 'expert' | 'business' | 'artist' | 'student';

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState<CategoryFilter>('all');

  const filteredTestimonials = useMemo(() => {
    if (activeTab === 'all') return TESTIMONIALS_DATA;
    return TESTIMONIALS_DATA.filter((item) => item.category === activeTab);
  }, [activeTab]);

  return (
    <section
      id="cam-nhan-chuyen-gia"
      className="w-full max-w-[1060px] mx-auto mt-10 sm:mt-14 scroll-mt-6"
    >
      {/* Khung chứa phong cách Cosmic sang trọng */}
      <div className="relative overflow-hidden rounded-3xl backdrop-blur-xl bg-slate-900/85 border border-amber-500/30 p-6 sm:p-10 shadow-2xl shadow-amber-950/20">
        {/* Ánh sáng trang trí nền */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Tiêu đề & Giới thiệu */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tiếng Nói Khách Quan Từ Người Thực Việc Thực</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-amber-400 tracking-wide mb-3">
            Đánh Giá Của Chuyên Gia &amp; Đương Số
          </h2>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Hơn <strong>10.000+ đương số</strong>, các nhà nghiên cứu Dịch học cổ truyền, lãnh đạo tập đoàn, nghệ sĩ và các bạn trẻ đã khảo chứng và đồng hành cùng phương pháp luận giải Tử Vi kết hợp{' '}
            <strong className="text-amber-300 font-semibold">Tư duy Toán học</strong>,{' '}
            <strong className="text-amber-300 font-semibold">Tài chính thực chứng</strong> và{' '}
            <strong className="text-amber-300 font-semibold">Tướng pháp cổ truyền</strong> của Thầy Tôn.
          </p>
        </div>

        {/* 4 Chỉ Số Uy Tín (Trust Badges Strip) */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-amber-500/25 text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">99.2%</div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              Đánh giá chuẩn xác &amp; sâu sắc
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-amber-500/25 text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">10.000+</div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              Lá số &amp; Cuộc đàm đạo vận mệnh
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-amber-500/25 text-center">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">18+ Năm</div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              Nghiên cứu &amp; Cố vấn thực tế
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-amber-500/25 text-center">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-serif">100%</div>
            <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
              Khoa học — Không mê tín dị đoan
            </div>
          </div>
        </div>

        {/* Bộ Lọc Tabs Theo Nhóm Đối Tượng */}
        <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            Tất Cả ({TESTIMONIALS_DATA.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('expert')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'expert'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Chuyên Gia Dịch Lý &amp; Y Học</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('business')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'business'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Doanh Nhân &amp; Tài Chính</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('artist')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'artist'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Nghệ Sĩ &amp; Văn Hóa</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('student')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                : 'bg-slate-950/70 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Phụ Huynh &amp; Khởi Nghiệp</span>
          </button>
        </div>

        {/* Lưới Danh Sách Các Lời Nhận Xét (Testimonial Grid) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filteredTestimonials.map((item) => (
            <div
              key={item.id}
              className="p-5 sm:p-6 rounded-2xl bg-slate-950/75 border border-slate-800/90 hover:border-amber-500/40 transition flex flex-col justify-between space-y-4 shadow-lg hover:shadow-amber-500/5 relative group"
            >
              {/* Biểu tượng Quote mờ nghệ thuật phía sau */}
              <Quote className="w-12 h-12 text-amber-400/5 absolute top-4 right-4 pointer-events-none group-hover:text-amber-400/10 transition" />

              <div className="space-y-3 relative z-10">
                {/* Đánh giá sao & Huy hiệu phân loại */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-sm"
                      />
                    ))}
                  </div>

                  <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/25">
                    {item.categoryLabel}
                  </span>
                </div>

                {/* Tiêu đề nhận xét nổi bật */}
                <h3 className="text-base sm:text-lg font-bold font-serif text-amber-300 leading-snug">
                  &ldquo;{item.highlight}&rdquo;
                </h3>

                {/* Đoạn trích nhận xét chi tiết */}
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed text-justify">
                  {item.content}
                </p>

                {/* Các thẻ Hashtag */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {item.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs text-amber-400/80 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Thông tin tác giả */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  {/* Avatar dạng Monogram chữ cái đầu sắc nét */}
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500/25 via-amber-600/20 to-slate-900 border border-amber-400/50 flex items-center justify-center text-amber-300 font-serif font-bold text-sm sm:text-base shadow-sm shrink-0">
                    {item.avatarText}
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-100 text-sm sm:text-base leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 mt-0.5 leading-snug">
                      {item.role}
                    </p>
                  </div>
                </div>

                {item.verifiedDate && (
                  <div
                    className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-1 rounded-full shrink-0"
                    title="Đương số đã có trải nghiệm thực tế cùng Thầy Tôn"
                  >
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>{item.verifiedDate}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Khối Ghi Chú Cam Kết Cuối Mục Testimonials */}
        <div className="relative z-10 mt-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950/80 to-amber-500/10 border border-amber-500/25 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-amber-300 text-sm sm:text-base font-serif">
                Cam Kết Bảo Mật Tuyệt Đối Danh Tính Đương Số
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                Mọi thông tin lá số, hình ảnh diện tướng, thủ tướng và nội dung đàm đạo của quý khách đều được bảo mật an toàn 100%.
              </p>
            </div>
          </div>

          <a
            href="#tuvi-form"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Trải Nghiệm Luận Giải Ngay</span>
          </a>
        </div>
      </div>
    </section>
  );
}
