import { Language } from './translations';

export interface TestimonialItem {
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

export interface TestimonialsHeader {
  badge: string;
  title: string;
  desc: string;
  stats: {
    val: string;
    label: string;
    isEmerald?: boolean;
  }[];
  tabAll: string;
  tabExpert: string;
  tabBusiness: string;
  tabArtist: string;
  tabStudent: string;
  verifiedLabel: string;
  privacyTitle: string;
  privacyDesc: string;
  ctaBtn: string;
}

export const TESTIMONIALS_HEADERS: Record<Language, TestimonialsHeader> = {
  vi: {
    badge: 'Tiếng Nói Khách Quan Từ Người Thực Việc Thực',
    title: 'Đánh Giá Của Chuyên Gia & Đương Số',
    desc: 'Hơn 10.000+ đương số, các nhà nghiên cứu Dịch học cổ truyền, lãnh đạo tập đoàn, nghệ sĩ và các bạn trẻ đã khảo chứng và đồng hành cùng phương pháp luận giải Tử Vi kết hợp Tư duy Toán học, Tài chính thực chứng và Tướng pháp cổ truyền của Thầy Tôn.',
    stats: [
      { val: '99.2%', label: 'Đánh giá chuẩn xác & sâu sắc' },
      { val: '10.000+', label: 'Lá số & Cuộc đàm đạo vận mệnh' },
      { val: '18+ Năm', label: 'Nghiên cứu & Cố vấn thực tế' },
      { val: '100%', label: 'Khoa học — Không mê tín dị đoan', isEmerald: true },
    ],
    tabAll: 'Tất Cả',
    tabExpert: 'Chuyên Gia Dịch Lý & Y Học',
    tabBusiness: 'Doanh Nhân & Đầu Tư',
    tabArtist: 'Nghệ Sĩ & Văn Hóa',
    tabStudent: 'Phụ Huynh & Giới Trẻ',
    verifiedLabel: 'Khảo chứng',
    privacyTitle: 'Cam Kết Bảo Mật Tuyệt Đối Danh Tính Đương Số',
    privacyDesc: 'Mọi thông tin lá số, hình ảnh diện tướng, thủ tướng và nội dung đàm đạo của quý khách đều được bảo mật an toàn 100%.',
    ctaBtn: 'Trải Nghiệm Luận Giải Ngay',
  },

  en: {
    badge: 'Objective Voices from Real Seekers & Scholars',
    title: 'Expert & Seeker Testimonials',
    desc: 'Over 10,000+ seekers, traditional I-Ching scholars, corporate executives, artists, and young professionals have verified Master Ton’s unique synthesis of Mathematical Logic, Empirical Finance, and Esoteric Physiognomy.',
    stats: [
      { val: '99.2%', label: 'Rated accurate & profound' },
      { val: '10,000+', label: 'Natal charts & life consultations' },
      { val: '18+ Years', label: 'Research & strategic advisory' },
      { val: '100%', label: 'Scientific — Free of superstition', isEmerald: true },
    ],
    tabAll: 'All Reviews',
    tabExpert: 'I-Ching & Medical Scholars',
    tabBusiness: 'Business & Investors',
    tabArtist: 'Artists & Cultural Figures',
    tabStudent: 'Parents & Young Seekers',
    verifiedLabel: 'Verified Session',
    privacyTitle: 'Strict Privacy & Identity Protection Guarantee',
    privacyDesc: 'All natal charts, physiognomy/palmistry photos, and consultation records are 100% confidential and securely protected.',
    ctaBtn: 'Experience Reading Now',
  },

  zh: {
    badge: '各界名家与真实缘主的客观心声',
    title: '名家学者与求测缘主好评',
    desc: '逾10,000+位缘主、传统易学学者、跨国集团高管、知名艺术家与年轻创业者，共同亲身验证顿师独步易坛之“数学逻辑、实证金融眼界与相法秘传”综合批命法。',
    stats: [
      { val: '99.2%', label: '高度认可其精准透彻' },
      { val: '10,000+', label: '详批命盘与运势对话' },
      { val: '18+ 年', label: '深厚实战与运势顾问' },
      { val: '100%', label: '求真崇理 — 绝无封建迷信', isEmerald: true },
    ],
    tabAll: '全部评价',
    tabExpert: '易学与医学名家',
    tabBusiness: '企业家与投资人',
    tabArtist: '文化艺术界名人',
    tabStudent: '家长与青年创业者',
    verifiedLabel: '真实实测',
    privacyTitle: '求测缘主隐私与命盘信息绝对保密承诺',
    privacyDesc: '您的所有八字命盘、面相掌纹影像及 đàm đạo/批命对话记录，均获得100%严格保密与安全防护。',
    ctaBtn: '即刻体验专业命理详批',
  },

  ko: {
    badge: '각계 전문가와 의뢰인의 실제 증언',
    title: '전문가 및 의뢰인 감명 후기',
    desc: '10,000명 이상의 의뢰인, 전통 주역 연구가, 대기업 임원, 예술인, 청년 창업가들이 톤 대사의 "수학적 논리, 실증 금융 혜안, 전통 관상 비전" 융합 감명을 직접 경험하고 추천합니다.',
    stats: [
      { val: '99.2%', label: '정확하고 심도 있는 감명 평가' },
      { val: '10,000+', label: '명반 감명 및 운명 대담' },
      { val: '18+ 년', label: '실증 연구 및 운명 자문' },
      { val: '100%', label: '과학적 분석 — 미신 배격', isEmerald: true },
    ],
    tabAll: '전체 후기',
    tabExpert: '주역 및 의학 전문가',
    tabBusiness: '기업인 & 투자자',
    tabArtist: '문화 예술인',
    tabStudent: '학부모 & 청년 창업가',
    verifiedLabel: '공식 자문 완료',
    privacyTitle: '의뢰인 신원 및 명반 정보 100% 절대 비밀 보장',
    privacyDesc: '모든 사주 명반 정보, 관상 및 손금 사진, 상담 내용은 철저하게 100% 안전하게 비밀이 보장됩니다.',
    ctaBtn: '지금 바로 명반 감명 체험하기',
  },
};

export const TESTIMONIALS_BY_LANG: Record<Language, TestimonialItem[]> = {
  vi: [
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
  ],

  en: [
    {
      id: 'expert-1',
      name: 'Dr. Nguyen Minh Khang',
      role: 'Vice Director, Institute of Applied I-Ching & Metaphysics',
      category: 'expert',
      categoryLabel: 'Metaphysics Scholar',
      avatarText: 'MK',
      rating: 5,
      highlight: 'Harmonizing ancient I-Ching wisdom with Western quantitative probabilistic logic',
      content:
        'Having researched metaphysics for over 30 years, I rarely encounter anyone who blends Eastern wisdom with rigorous quantitative thinking as Master Ton does. His Zi Wei readings never drift into superstition; instead, he dissects the 14 Major Stars and auxiliary stars like a systemic statistical probability matrix. This is the gold standard for contemporary metaphysics.',
      tags: ['#IChingScholar', '#EmpiricalScience', '#DestinyMatrix'],
      verifiedDate: 'Academic Colleague',
    },
    {
      id: 'business-1',
      name: 'Le Hoang Nam',
      role: 'Chairman of the Board, Import-Export & Real Estate Group',
      category: 'business',
      categoryLabel: 'Business & Investor',
      avatarText: 'HN',
      rating: 5,
      highlight: 'Accurately warned of a cash-flow bottleneck, saving my enterprise from peril',
      content:
        'Running a company with hundreds of employees, I only rely on solid data. In 2022, during the market euphoria, Master Ton examined my 10-year decan and cautioned that in 2023 capital liquidity would seize up severely, advising me to postpone a major project and recall debts immediately. Thanks to his counsel, our corporate liquidity was fully preserved through the downturn.',
      tags: ['#Executive', '#RiskManagement', '#EconomicCycles'],
      verifiedDate: '1-on-1 Consultation',
    },
    {
      id: 'expert-2',
      name: 'Venerable Thich Tue Minh',
      role: 'Head of Eastern Metaphysics & Feng Shui Association',
      category: 'expert',
      categoryLabel: 'Metaphysics Scholar',
      avatarText: 'TM',
      rating: 5,
      highlight: 'Flawless synthesis of Zi Wei Chart with Physiognomy and Palmistry',
      content:
        'What distinguishes Master Ton is his ability to cross-examine celestial natal charts with facial features and palmistry. When birth hours are slightly ambiguous, his reading of the palm lines and facial contours rectifies the chart with uncanny precision. His readings are deeply compassionate, always inspiring virtue and proactive initiative.',
      tags: ['#EasternMetaphysics', '#Physiognomy', '#EthicalAstrology'],
      verifiedDate: 'Review Panel',
    },
    {
      id: 'artist-1',
      name: 'Vu Thanh Van',
      role: 'Distinguished Artist & Television Drama Producer',
      category: 'artist',
      categoryLabel: 'Artist & Culture',
      avatarText: 'TV',
      rating: 5,
      highlight: 'Dispersing creative gossip, pinpointing the golden moment for a premiere',
      content:
        'The entertainment industry is notoriously volatile. When I was deeply blocked on a premier production, Master Ton cast a Qi Men Dun Jia divination and identified the exact auspicious month and direction for benefactors, while showing how to defuse rivalry. The film went on to win prestigious accolades. His wisdom brings profound clarity and peace.',
      tags: ['#CinemaDirector', '#QiMenDunJia', '#CreativeHarmony'],
      verifiedDate: '1-on-1 Consultation',
    },
    {
      id: 'business-2',
      name: 'Tran Dang Khoa, CFA',
      role: 'Managing Director, Venture Capital Fund (HCMC)',
      category: 'business',
      categoryLabel: 'Business & Investor',
      avatarText: 'DK',
      rating: 5,
      highlight: 'International financial vision paired with astonishingly acute cyclical timing',
      content:
        'I sought out Master Ton because of his Finance degree from Lancaster University (Top 5 UK) and extensive audit background. His analysis connecting the Wealth and Property Palaces to macroeconomic cycles was intensely compelling. Each 5-year phase within the 10-year major decan read like an exquisite, personalized strategic report.',
      tags: ['#CFACharterholder', '#MacroEconomics', '#10YearDecan'],
      verifiedDate: '1-on-1 Consultation',
    },
    {
      id: 'student-1',
      name: 'Hoang Mai Lan & Son Minh Duc',
      role: 'Parent & Scholar at University of Manchester (UK)',
      category: 'student',
      categoryLabel: 'Parents & Youth',
      avatarText: 'ML',
      rating: 5,
      highlight: 'Targeting academic majors according to innate destiny, securing a UK scholarship',
      content:
        'When our son faced the choice between Economics and AI in the UK, we were indecisive. Master Ton reviewed his Life Palace and recommended Data Science. Having lived in the UK since age 16, Master Ton also mentored him on life skills and cultural adaptation. Our son has now secured a distinguished scholarship at Manchester!',
      tags: ['#StudyInUK', '#DestinyAlignedCareer', '#FutureGuidance'],
      verifiedDate: 'VIP Pro Analysis',
    },
    {
      id: 'expert-3',
      name: 'Dr. Pham Quoc Bao, MD',
      role: 'Specialist in Endocrinology & Clinical Medicine',
      category: 'expert',
      categoryLabel: 'Medical Specialist',
      avatarText: 'QB',
      rating: 5,
      highlight: 'Health Palace evaluation aligned remarkably with medical genetic science',
      content:
        'As a medical physician, I was initially skeptical of astrology. But reading Master Ton’s analysis of my Health and Parents Palaces left me astonished. He identified familial liver and spinal vulnerabilities passed down generations in my family. His seasonal wellness advice mirrors medical biorhythms perfectly.',
      tags: ['#ClinicalMedicine', '#HealthPalace', '#SeasonalWellness'],
      verifiedDate: 'VIP Pro Analysis',
    },
    {
      id: 'student-2',
      name: 'Dang Quynh Anh',
      role: 'Founder & CEO, EdTech Startup (Forbes 30 Under 30)',
      category: 'student',
      categoryLabel: 'Startup & Youth',
      avatarText: 'QA',
      rating: 5,
      highlight: 'Navigating co-founder selection and timing our Series A fundraising round',
      content:
        'As a young founder, leadership can often feel lonely and turbulent. Consulting with AI Master Ton and later meeting him in person at Royal City resolved all my dilemmas regarding partners (Colleagues Palace) and fundraising cadence. The reading is exceptionally detailed, providing continuous insight upon every re-reading.',
      tags: ['#StartupFounder', '#CoFounderSelection', '#ConsultMasterTon'],
      verifiedDate: '1-on-1 Consultation',
    },
  ],

  zh: [
    {
      id: 'expert-1',
      name: '阮明康 博士',
      role: '越南应用易学与风水研究院 副院长',
      category: 'expert',
      categoryLabel: '易理名家',
      avatarText: '明康',
      rating: 5,
      highlight: '融通东方传统易数与西方定量统计概率思维',
      content:
        '研易三十余载，极少见能将东方玄学底蕴与现代数理定量分析融会贯通如顿师之人。顿师断盘不涉玄虚怪诞之辞，而是将十四正曜与八部神煞如统计学概率矩阵般抽丝剥茧。这正是现代易学研究所当尊崇之典范。',
      tags: ['#易学名家', '#实证科学', '#命理矩阵'],
      verifiedDate: '学术同道认证',
    },
    {
      id: 'business-1',
      name: '黎黄南 董事长',
      role: '进出口与房地产集团 董事局主席',
      category: 'business',
      categoryLabel: '实业与投资',
      avatarText: '黄南',
      rating: 5,
      highlight: '精准预警资金链危局，挽救企业于惊涛骇浪之中',
      content:
        '执掌数百人企业，我唯重实证。2022年市场最狂热之际，顿师推演大运，断言2023年兄弟宫逢劫煞，资金流必遇巨震，劝我暂停50公顷新项目并全力清收应收账款。正是信从顿师之谋，集团安稳渡过行业寒冬。顿师不仅推演紫微，实乃顶级战略风险顾问。',
      tags: ['#企业董事长', '#战略风控', '#宏观商业周期'],
      verifiedDate: '曾当面1对1详批',
    },
    {
      id: 'expert-2',
      name: '释慧明 师傅 (阮登光)',
      role: '东方风水与古术俱乐部 理事长',
      category: 'expert',
      categoryLabel: '易理名家',
      avatarText: '慧明',
      rating: 5,
      highlight: '天盘星系与面相、手相掌纹三盘合参，极其神验',
      content:
        '顿师断命最绝之处，在于天盘星系与求测者面相、掌相之无缝互证。常有缘主生辰时辰略存偏差，顿师一观印堂与掌丘纹理便能瞬间正盘。其言恳切，其心慈悲，导人向善修身以顺应天道，绝无恐吓化煞之弊。',
      tags: ['#相法秘传', '#面相手相合参', '#正道命理'],
      verifiedDate: '学术考核委员会',
    },
    {
      id: 'artist-1',
      name: '武青云 导演',
      role: '功勋艺术家 / 著名影视导演与制片人',
      category: 'artist',
      categoryLabel: '文化与艺术',
      avatarText: '青云',
      rating: 5,
      highlight: '化解文艺界是非纷扰，精准捕捉流年黄金破局契机',
      content:
        '艺坛是非起伏莫测。在我大戏攻坚受阻之关口，得遇顿师推演奇门与流月气运，指点农历八月南方贵人引路，并早作防备化解奴仆宫小人之嫌。影片上映后果获大奖。顿师开示温润睿智，令人如沐春风。',
      tags: ['#影视导演', '#奇门神数', '#化解是非'],
      verifiedDate: '曾当面1对1详批',
    },
    {
      id: 'business-2',
      name: '陈登科, CFA',
      role: '风险投资基金 董事总经理 (胡志明市)',
      category: 'business',
      categoryLabel: '实业与投资',
      avatarText: '登科',
      rating: 5,
      highlight: '国际金融顶尖学术视野，结合命局大运推演，令人击节赞叹',
      content:
        '我拜会顿师，因其同具英国兰卡斯特大学（全英前5）金融学府背景及国际审计资历。顿师将财帛、田宅宫与宏观经济大周期的合参分析极为精辟，十年大运之分段推演堪称量身定制的顶级人生战略白皮书。',
      tags: ['#CFA特许分析师', '#宏观经济', '#十年大运'],
      verifiedDate: '曾当面1对1详批',
    },
    {
      id: 'student-1',
      name: '黄梅兰 女士 & 儿子明德',
      role: '家长 & 英国曼彻斯特大学优秀留学生',
      category: 'student',
      categoryLabel: '学业与才俊',
      avatarText: '梅兰',
      rating: 5,
      highlight: '依命身根基定向专业赛道，成功斩获英国名校奖学金',
      content:
        '孩子面临留英专业抉择，全家在经济与AI之间摇摆。顿师推演孩子命宫巨门天机得地，力荐投身数据科学。顿师自身16岁起深耕英伦，更悉心指导在英生活交际之法。如今孩子在曼大荣获优等奖学金！',
      tags: ['#英伦深造', '#因命择业', '#前程指引'],
      verifiedDate: '曾获VIP大师精批',
    },
    {
      id: 'expert-3',
      name: '范国宝 主任医师',
      role: '内分泌专科专家 / 实验医学会委员',
      category: 'expert',
      categoryLabel: '医学专家',
      avatarText: '国宝',
      rating: 5,
      highlight: '推算疾厄宫与家族体质遗传，与现代临床医学理论严密契合',
      content:
        '身为临床医生，初时我对算命心存警惕。但细读顿师批复之疾厄宫与父母宫，深感震撼 —— 顿师准确指出我家族世代相传的肝胆及脊柱薄弱之处，其四季节气调养之法与现代生物钟医学原理高度统一。',
      tags: ['#实验医学', '#疾厄宫研析', '#节气顺养'],
      verifiedDate: '曾获VIP大师精批',
    },
    {
      id: 'student-2',
      name: '邓琼英',
      role: '教育科技独角兽 创始人兼CEO (30 Under 30榜单)',
      category: 'student',
      categoryLabel: '青年创业',
      avatarText: '琼英',
      rating: 5,
      highlight: '破局核心合伙人选拔难题，把握住A轮融资的最佳时间窗口',
      content:
        '青年创业常觉孤独与迷茫。在AI顿师系统请教并有幸前往皇家城与师父当面长谈后，彻底解开了我对于合伙人团队（奴仆宫）与融资节奏的全部症结。批命文书辞章华美、条理透彻，常读常新！',
      tags: ['#科技创业者', '#合伙人合参', '#问道顿师'],
      verifiedDate: '曾当面1对1详批',
    },
  ],

  ko: [
    {
      id: 'expert-1',
      name: '응우옌 민 캉 박사',
      role: '응용주역 및 풍수연구원 부원장',
      category: 'expert',
      categoryLabel: '명리학 전문가',
      avatarText: '민캉',
      rating: 5,
      highlight: '동양 주역의 깊은 지혜와 서구 확률 통계적 논리의 완벽한 융합',
      content:
        '명리학을 30년 넘게 연구하면서 동양 비전의 심오함과 서양의 계량적 분석력을 톤 대사처럼 정밀하게 융합한 분은 본 적이 없습니다. 톤 대사의 자미두수는 막연한 미신이 아닌, 14주성과 신살 배치를 정교한 확률 통계 매트릭스처럼 분석합니다. 현대 명리학이 나아가야 할 모범입니다.',
      tags: ['#주역명가', '#실증과학', '#운명매트릭스'],
      verifiedDate: '학술 동료 인증',
    },
    {
      id: 'business-1',
      name: '레 황 남 회장',
      role: '수출입 및 부동산 개발그룹 이사회 의장',
      category: 'business',
      categoryLabel: '기업인 & 투자',
      avatarText: '황남',
      rating: 5,
      highlight: '기업의 현금 흐름 위기 연도를 정확히 예견하여 수천억 자산을 지켜냄',
      content:
        '수백 명의 직원을 거느린 사업가로서 저는 오직 실증 데이터만 신뢰합니다. 2022년 시장이 최고조로 과열되었을 때, 톤 대사께서 10년 대운을 보시고 2023년 자금 유동성에 거대한 경색이 올 것을 경고하며 50ha 신규 프로젝트 연기를 권하셨습니다. 그 조언을 따른 덕분에 회사는 위기를 무사히 넘겼습니다. 단순한 역학이 아니라 최고의 리스크 관리 전략이었습니다.',
      tags: ['#기업회장', '#리스크관리', '#경제사이클'],
      verifiedDate: '1:1 대면 상담 완료',
    },
    {
      id: 'expert-2',
      name: '틱 뚜에 민 대사 (응우옌 당 꽝)',
      role: '동방풍수 및 전통비전협회 협회장',
      category: 'expert',
      categoryLabel: '명리학 전문가',
      avatarText: '뚜에민',
      rating: 5,
      highlight: '자미두수 천반과 얼굴 관상, 손금(수상)의 놀라운 합참 정밀도',
      content:
        '톤 대사의 가장 독보적인 능력은 자미두수 명반과 얼굴 관상, 손금(수상)을 하나로 대조하는 통찰력에 있습니다. 태어난 시간이 다소 모호한 경우라도 관상과 손금의 구릉을 살피면 즉시 명반을 바로잡습니다. 공포를 조장하지 않고 언제나 덕을 쌓고 때를 분별하도록 이끄는 진정한 대사입니다.',
      tags: ['#관상손금비전', '#정통자미두수', '#명리정법'],
      verifiedDate: '공식 고증 검증',
    },
    {
      id: 'artist-1',
      name: '부 타인 번 감독',
      role: '공훈예술가 / 영화감독 및 방송 드라마 제작자',
      category: 'artist',
      categoryLabel: '문화 & 예술',
      avatarText: '타인번',
      rating: 5,
      highlight: '예술계의 구설과 시련을 극복하고 황금 개봉 시기를 포착함',
      content:
        '예술계는 시기와 변동이 끊이지 않는 곳입니다. 대작 영화 준비 중 심각한 난관에 부딪혔을 때 톤 대사님께서 기문둔갑을 짚어 음력 8월 남방 귀인의 조력을 예언하시고 대인관계의 구설을 피하는 법을 일러주셨습니다. 그 작품은 국제 영화제에서 큰 상을 받았습니다. 대사님의 깊은 혜안에 감사드립니다.',
      tags: ['#영화감독', '#기문둔갑', '#구설수해소'],
      verifiedDate: '1:1 대면 상담 완료',
    },
    {
      id: 'business-2',
      name: '쩐 당 코아, CFA',
      role: '벤처캐피털(VC) 펀드 대표이사 (호치민시)',
      category: 'business',
      categoryLabel: '기업인 & 투자',
      avatarText: '당코아',
      rating: 5,
      highlight: '영국 명문대 금융학 배경과 거시 경제 사이클을 꿰뚫는 명쾌한 통찰',
      content:
        '영국 랭커스터 대학교(영국 톱 5) 금융학 출신에 글로벌 회계 감사 경력을 지닌 톤 대사님의 이력에 끌려 상담을 요청했습니다. 재백궁, 전택궁과 거시 경제 흐름을 연결한 설명은 그 어떤 전략 컨설팅 보고서보다 설득력이 넘쳤습니다. 10년 대운의 5년 단위 분석은 경이로웠습니다.',
      tags: ['#CFA자격보유', '#거시경제학', '#10년대운'],
      verifiedDate: '1:1 대면 상담 완료',
    },
    {
      id: 'student-1',
      name: '호앙 마이 란 여사 & 아들 민 득',
      role: '학부모 & 영국 맨체스터 대학교 장학생',
      category: 'student',
      categoryLabel: '학부모 & 유학',
      avatarText: '마이란',
      rating: 5,
      highlight: '타고난 명국에 맞는 전공 선택으로 영국 명문대 장학금 수여',
      content:
        '영국 유학 전공을 두고 경제학과 인공지능 사이에서 고민이 많았습니다. 톤 대사님께서 아이의 명궁을 보시고 데이터 과학 분야를 적극 추천해 주셨습니다. 대사님 본인이 16세부터 영국에서 공부하셨기에 영국 현지 적응법까지 자상하게 멘토링해 주셨고, 아이는 맨체스터대에서 우수한 성적으로 장학금을 받았습니다.',
      tags: ['#영국유학성공', '#적성전공선택', '#미래진로설계'],
      verifiedDate: 'VIP 심층 감명 완료',
    },
    {
      id: 'expert-3',
      name: '팜 꾸옥 바오 전문의',
      role: '내분비내과 전문의 / 임상의학회 정회원',
      category: 'expert',
      categoryLabel: '의학 전문의',
      avatarText: '꾸옥바오',
      rating: 5,
      highlight: '질액궁의 체질 유전 분석이 현대 의학의 임상 유전학적 진단과 일치',
      content:
        '의사로서 사주팔자에 늘 회의적이었습니다. 그러나 톤 대사님의 질액궁과 부모궁 감명서를 읽고 놀라움을 금치 못했습니다. 저희 가문 대대로 내려온 간담과 척추의 취약점을 정확히 짚어내셨고, 계절별 섭생법은 생체 리듬 의학과 완벽하게 부합했습니다.',
      tags: ['#임상의학일치', '#질액궁정밀분석', '#체질맞춤양생'],
      verifiedDate: 'VIP 심층 감명 완료',
    },
    {
      id: 'student-2',
      name: '당 꾸인 안 대표',
      role: '에듀테크 스타트업 창업자 겸 CEO (포브스 30 Under 30)',
      category: 'student',
      categoryLabel: '청년 창업',
      avatarText: '꾸인안',
      rating: 5,
      highlight: '핵심 동업자 선발 고민 해결 및 시리즈 A 투자 유치 타이밍 결정',
      content:
        '젊은 창업자로서 팀 빌딩과 투자 유치 타이밍에 심신이 지쳐 있었습니다. AI 톤 대사 질의응답을 거쳐 로얄시티에서 대사님을 직접 뵈었을 때 노복궁(동업자)과 투자 유치 시기에 대한 모든 실마리가 풀렸습니다. 감명서의 모든 문장이 삶의 깊은 나침반이 되어주고 있습니다.',
      tags: ['#스타트업대표', '#동업자궁합', '#톤대사자문'],
      verifiedDate: '1:1 대면 상담 완료',
    },
  ],
};
