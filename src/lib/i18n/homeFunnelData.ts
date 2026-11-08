import { Language } from './translations';

export interface HomeFunnelTranslated {
  badge1: string;
  badge2: string;
  h1: string;
  authorLine: string;
  profileLinkText: string;
  quickSummaryLabel: string;
  quickSummaryHtml: string;
  introHtml: string;
  bodyHtml: string;
  faqHeading: string;
  faqs: {
    question: string;
    answerHtml: string;
  }[];
  closingHtml: string;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
  dirBadge: string;
  dirHeading: string;
  dirViewAll: string;
  dirBranch1: string;
  dirBranch2: string;
  dirBranch3: string;
}

export const FUNNEL_PAGE_TITLES_I18N: Record<string, Record<Language, string>> = {
  '/khoa-hoc': {
    vi: 'Khóa Học Tử Vi Thực Chiến (699K)',
    en: 'Practical Zi Wei Online Course (699K)',
    zh: '紫微斗数实战线上课程 (699K)',
    ko: '실전 자미두수 온라인 강좌 (699K)',
    ja: '紫微斗数実戦オンライン講座 (699K)',
  },
  '/thay-ton': {
    vi: 'Hồ Sơ Chuyên Gia Tử Vi & Phong Thủy Thầy Tôn',
    en: 'Master Ton — Zi Wei & Feng Shui Expert Profile',
    zh: '顿师（陈辉顿）— 紫微斗数与风水专家简介',
    ko: '톤 대사 — 자미두수 및 풍수지리 전문가 약력',
    ja: 'トン先生 — 紫微斗数＆風水専門家プロフィール',
  },
  '/luan-giai-tu-vi-chuyen-sau': {
    vi: 'Bản Chuyên Sâu Pro — Luận Giải Lá Số Chi Tiết (119.000đ)',
    en: 'VIP Pro Edition — Deep Natal Chart Reading (119,000 VND)',
    zh: 'VIP大师精批版 — 紫微命盘深度详批 (119,000 VND)',
    ko: 'VIP 프로판 — 자미두수 명반 심층 감명 (119,000 VND)',
    ja: 'VIPプロ深層版 — 紫微命盤詳細鑑定 (119,000 VND)',
  },
  '/luan-giai-tu-vi-chuyen-gia': {
    vi: 'Bản Chuyên Gia 12 Cung & 12 Tháng Âm Lịch (269.000đ)',
    en: 'Grandmaster Expert Edition — All 12 Palaces & 12 Months (269,000 VND)',
    zh: '宗师专家版 — 全十二宫与十二流月精批 (269,000 VND)',
    ko: '전문가 마스터판 — 12궁 전체 및 12개월 월운 감명 (269,000 VND)',
    ja: '宗師エキスパート版 — 全12宮＆12ヶ月流月完全鑑定 (269,000 VND)',
  },
  '/hoi-dap-tu-vi-ai': {
    vi: 'Hỏi Đáp Tử Vi Cùng AI Thầy Tôn',
    en: '1-on-1 Q&A Consultation with AI Master Ton',
    zh: '与 AI 顿师 1对1 紫微命理问答请教',
    ko: 'AI 톤 대사와의 1:1 자미두수 문답 상담',
    ja: 'AIトン先生との1対1紫微斗数Q&A相談',
  },
  '/dat-lich-xem-tu-vi': {
    vi: 'Đặt Lịch Xem Tử Vi Trực Tiếp 1-1 Cùng Thầy Tôn',
    en: 'Book a Direct 1-on-1 Session with Master Ton',
    zh: '预约顿师线下/线上 1对1 亲测详批',
    ko: '톤 대사 1:1 오프라인 대면 및 화상 상담 예약',
    ja: 'トン先生との1対1対面・オンライン鑑定予約',
  },
  '/dinh-huong-hoc-tap-nghe-nghiep-cho-con': {
    vi: 'Định Hướng Học Tập, Chọn Ngành & Nghề Nghiệp Cho Con',
    en: 'Academic Major & Career Path Guidance for Children',
    zh: '子女升学择校、留学与本命职业规划指引',
    ko: '자녀 학업, 전공 선택 및 진로 적성 명리 자문',
    ja: 'お子様の進学・留学・適職キャリア命理診断',
  },
  '/dien-tuong-chi-tay-tu-vi': {
    vi: 'Kết Hợp Diện Tướng, Chỉ Tay & Lá Số Tử Vi',
    en: 'Integrating Face Reading, Palmistry & Zi Wei Natal Chart',
    zh: '面相、手相掌纹与紫微命盘三合参实证法',
    ko: '얼굴 관상, 손금(수상) 및 자미두수 명반 합참 기법',
    ja: '面相・手相と紫微斗数命盤の統合実証鑑定法',
  },
  '/lien-he': {
    vi: 'Liên Hệ & Hướng Dẫn Đặt Lịch Tham Vấn',
    en: 'Contact & Consultation Booking Guide',
    zh: '联系方式与 1对1 预约指南',
    ko: '연락처 및 1:1 상담 예약 안내',
    ja: 'お問い合わせ＆1対1鑑定予約ガイド',
  },
  '/phong-thuy': {
    vi: 'Tư Vấn Phong Thủy Thực Chứng Theo Lá Số Tử Vi',
    en: 'Empirical Feng Shui Consultation Based on Your Natal Chart',
    zh: '结合紫微命盘的实证阳宅与商业风水咨询',
    ko: '자미두수 명반 기반 실증 풍수지리 종합 자문',
    ja: '紫微斗数命盤に基づく実証風水コンサルティング',
  },
  '/phong-thuy-nha-o': {
    vi: 'Phong Thủy Nhà Ở, Biệt Thự & Chung Cư Hợp Mệnh',
    en: 'Residential, Villa & Apartment Feng Shui Alignment',
    zh: '住宅、别墅与公寓风水布局及催吉指南',
    ko: '주택, 빌라 및 아파트 맞춤형 양택 풍수 배치',
    ja: '住居・ヴィラ・マンションの開運風水レイアウト',
  },
  '/phong-thuy-van-phong': {
    vi: 'Phong Thủy Văn Phòng, Cửa Hàng & Doanh Nghiệp',
    en: 'Corporate Office, Retail Store & Business Feng Shui',
    zh: '企业办公室、商铺与公司招财风水布局',
    ko: '사무실, 매장 및 기업 번영을 위한 상업 풍수',
    ja: 'オフィス・店舗・企業の商売繁盛風水レイアウト',
  },
  '/phong-thuy-cai-van': {
    vi: 'Phong Thủy Cải Vận: Kích Tài Lộc & Hóa Giải Sát Tinh',
    en: 'Fate-Enhancing Feng Shui: Wealth Activation & Malefic Remedies',
    zh: '改运风水秘法：催旺财位与化煞解厄布局',
    ko: '개운 풍수 비법: 재물운 활성화 및 살성 화해책',
    ja: '開運風水秘法：財位の活性化と凶殺星の解消処方',
  },
  '/hanh-dung-than-ngu-hanh': {
    vi: 'Cách Tìm Hành Dụng Thần & Ngũ Hành Bổ Khuyết',
    en: 'Finding Your Favorable Five Elements (Yong Shen)',
    zh: '如何精准寻找五行用神与喜忌补缺',
    ko: '오행 용신(用神) 찾기 및 부족한 기운 보완법',
    ja: '五行用神の見つけ方と開運カラー・方位補完法',
  },
  '/xem-ngay-tot': {
    vi: 'Xem Ngày Giờ Tốt Động Thổ, Nhập Trạch, Khai Trương',
    en: 'Auspicious Date Selection for Construction, Moving & Grand Opening',
    zh: '动土、入宅、开业与嫁娶择日择吉指南',
    ko: '착공, 이사(입택), 개업 및 혼인 길일 택일법',
    ja: '着工・引越し・開業・結婚の吉日吉時選定（択日）',
  },
  '/xem-tuoi-lam-nha-2027': {
    vi: 'Xem Tuổi Làm Nhà, Xây Sửa Nhà Năm 2027 Đinh Mùi',
    en: 'Auspicious Birth Years for Building or Renovating a Home in 2027',
    zh: '2027丁未年建房、买房与装修改造生肖吉凶',
    ko: '2027년 정미년 주택 건축·리모델링 길흉 나이',
    ja: '2027年（丁未）の住宅建築・リフォーム吉凶年齢',
  },
  '/xem-tuoi-khai-truong-2027': {
    vi: 'Xem Tuổi Mở Hàng & Khai Trương Đầu Năm 2027',
    en: 'First-Foot & Grand Opening Auspicious Ages for 2027',
    zh: '2027丁未年新春开市、开业与贵人合岁指南',
    ko: '2027년 정미년 새해 개업 및 첫 손님맞이 길한 나이',
    ja: '2027年（丁未）の仕事始め・開業に吉となる干支年齢',
  },
  '/tu-vi-va-phong-thuy': {
    vi: 'Tử Vi & Phong Thủy Kết Hợp Thế Nào Để Đắc Thiên Thời Địa Lợi?',
    en: 'How Zi Wei Astrology & Feng Shui Work Together (Heaven & Earth)',
    zh: '紫微斗数（天时）与阳宅风水（地利）如何相辅相成？',
    ko: '자미두수(천시)와 풍수지리(지리)의 완벽한 결합 원리',
    ja: '紫微斗数（天の時）と風水（地の利）を統合する秘訣',
  },
  '/cach-xem-la-so-tu-vi': {
    vi: 'Cách Xem Lá Số Tử Vi Đẩu Số Chuẩn Xác Cho Người Mới',
    en: 'Beginner’s Step-by-Step Guide to Reading a Zi Wei Natal Chart',
    zh: '零基础入门：如何看懂紫微斗数命盘与三方四正',
    ko: '초보자를 위한 자미두수 명반 해독 5단계 완벽 가이드',
    ja: '初心者のための紫微斗数命盤の読み方ステップガイド',
  },
  '/14-chinh-tinh-tu-vi': {
    vi: '14 Chính Tinh Trong Tử Vi: Tính Chất, Đắc Hãm & Cách Đọc',
    en: 'The 14 Major Stars in Zi Wei Dou Shu: Traits & Brightness',
    zh: '紫微斗数十四正曜详解：庙旺利陷与心性财官',
    ko: '자미두수 14주성 완벽 해설: 묘왕리함 및 성정·재관',
    ja: '紫微斗数14主星完全解説：廟旺利陥と性格・適職・財運',
  },
  '/cac-cach-cuc-trong-tu-vi': {
    vi: '4 Cách Cục Lớn: Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Cự Nhật',
    en: 'The 4 Grand Star Formations: Zi-Fu-Wu-Xiang, Sha-Po-Lang & More',
    zh: '紫微四大格局：紫府武相、杀破狼、机月同梁、巨日同临',
    ko: '자미두수 4대 격국: 자부무상, 살파랑, 기월동량, 거일격',
    ja: '紫微四大格局：紫府武相・殺破狼・機月同梁・巨日格',
  },
  '/tu-hoa-trong-tu-vi': {
    vi: 'Tứ Hóa Trong Tử Vi: Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ',
    en: 'The Four Transformations (Si Hua): Lu, Quan, Ke & Ji Explained',
    zh: '紫微四化飞星：化禄、化权、化科、化忌深度解析',
    ko: '자미두수 사화(四化): 화록, 화권, 화과, 화기 핵심 풀이',
    ja: '紫微斗数の四化星：化禄・化権・化科・化忌の深層解読',
  },
  '/luc-sat-tinh-trong-tu-vi': {
    vi: 'Lục Sát Tinh: Kình Dương, Đà La, Không Kiếp, Hỏa Tinh, Linh Tinh',
    en: 'The Six Malefic Stars: Qing Yang, Tuo Luo, Kong Jie, Huo & Ling',
    zh: '六煞星详解：擎羊、陀罗、地空地劫、火星、铃星与制化之法',
    ko: '육살성 해설: 경양, 타라, 지공·지겁, 화성, 영성 및 제화법',
    ja: '六殺星の詳解：擎羊・陀羅・地空地劫・火星・鈴星と制化法',
  },
  '/dao-hoa-hong-loan-luc-cat-tinh': {
    vi: 'Đào Hoa, Hồng Loan & Lục Cát Tinh (Tả Hữu, Xương Khúc, Khôi Việt)',
    en: 'Peach Blossom, Red鸞 & Six Auspicious Stars (Fu Bi, Chang Qu, Kui Yue)',
    zh: '桃花红鸾与六吉星（左辅右弼、文昌文曲、天魁天钺）详解',
    ko: '도화·홍란 및 육길성(좌보우필, 문창문곡, 천괴천월) 해설',
    ja: '桃花・紅鸞と六吉星（左輔右弼・文昌文曲・天魁天鉞）の解説',
  },
  '/vong-thai-tue-loc-ton': {
    vi: 'Vòng Thái Tuế, Vòng Lộc Tồn & Vòng Trường Sinh Trên Lá Số',
    en: 'Tai Sui Ring, Lu Cun Ring & 12 Life Stages in Zi Wei Dou Shu',
    zh: '太岁十二神煞、禄存博士十二神与长生十二神合参',
    ko: '태세 12신, 록존 박사 12신 및 장생 12신 순환 원리',
    ja: '太歳十二神・禄存十二神・長生十二神の循環と読み方',
  },
  '/tuan-triet-trong-tu-vi': {
    vi: 'Tuần Trung Không Vong & Triệt Lộ Không Vong Tốt Hay Xấu?',
    en: 'Void (Tuan) & Break (Triet) in Zi Wei Dou Shu: Good or Bad?',
    zh: '旬中空亡与截路空亡（旬空·截空）究竟是吉是凶？',
    ko: '순중공망(순공)과 절로공망(절공)의 길흉 작용 완벽 분석',
    ja: '旬中空亡（旬空）と截路空亡（截空）の吉凶作用と転換期',
  },
  '/menh-vo-chinh-dieu': {
    vi: 'Mệnh Vô Chính Diệu Là Gì? Cách Mượn Sao Xung Chiếu & Đắc Tam Không',
    en: 'Empty Palace (No Major Star): Borrowing Opposite Stars & Three Voids',
    zh: '命无正曜（空宫）如何借对宫星曜与论“得三空”格局？',
    ko: '명무정요(공궁) 해독법: 대궁 차성(借星) 및 삼공(三空) 격국',
    ja: '命無正曜（無主星宮）の読み方：対宮借星と三空の格局',
  },
  '/khong-nho-gio-sinh': {
    vi: 'Không Nhớ Chính Xác Giờ Sinh Lập Lá Số Tử Vi Thế Nào?',
    en: 'Uncertain Birth Time? How to Verify Your Birth Hour via Face & Palm',
    zh: '不记得准确出生时辰，如何通过面相手相与往事定盘？',
    ko: '정확한 출생시를 모를 때 관상·손금과 과거사로 생시 찾는 법',
    ja: '出生時間が不明な場合の定盤法（面相・手相と過去の出来事照合）',
  },
  '/tu-vi-2027': {
    vi: 'Tử Vi Năm 2027 Đinh Mùi Cho 12 Con Giáp: Vận Hạn & Sao Lưu',
    en: '2027 Ding Wei Annual Zi Wei Forecast for All 12 Zodiac Signs',
    zh: '2027丁未年十二生肖紫微流年运势与流年飞星详批',
    ko: '2027년 정미년 12띠별 자미두수 세운 및 유년성 총운',
    ja: '2027年（丁未）十二支別・紫微斗数流年運勢と流年飛星予測',
  },
  '/cach-xem-dai-van-tieu-van': {
    vi: 'Cách Xem Đại Vận 10 Năm, Tiểu Hạn & Lưu Niên Thái Tuế (Tam Hạn)',
    en: 'How to Read 10-Year Major Decans, Minor Limits & Annual Tai Sui',
    zh: '十年大运、小限宫、流年大限与流年太岁（三限合参法）',
    ko: '10년 대운, 소한궁, 유년대운 및 유년태세(삼한 합참법) 해독',
    ja: '十年大運・小限・流年大限・流年太歳（三限合参法）の読み方',
  },
  '/xem-han-ket-hon-sinh-con': {
    vi: 'Cách Xem Hạn Kết Hôn (Cưới Hỏi) & Hạn Sinh Con Trên Lá Số',
    en: 'Predicting Marriage Timing & Childbirth Years on Your Natal Chart',
    zh: '如何从紫微命盘看红鸾天喜婚期与添丁生子之年？',
    ko: '자미두수 명반으로 결혼운(혼기) 및 자녀 출산 시기 보는 법',
    ja: '紫微命盤で結婚の時期（婚期）と子宝・出産年を読み解く方法',
  },
  '/xem-tuoi-hop-vo-chong-lam-an': {
    vi: 'Xem Tuổi Hợp Vợ Chồng & Chọn Đối Tác Làm Ăn Theo Tử Vi',
    en: 'Spouse Compatibility & Business Partner Matching via Zi Wei Charts',
    zh: '夫妻合婚与商业合伙人紫微命盘合参法',
    ko: '부부 궁합 및 동업자·비즈니스 파트너 자미두수 합참법',
    ja: '夫婦の相性診断（合婚）とビジネスパートナーの命盤相性法',
  },
  '/cung-phu-the-trong-tu-vi': {
    vi: 'Cung Phu Thê Trong Tử Vi: Duyên Phận Hôn Nhân & Chân Dung Bạn Đời',
    en: 'Spouse Palace (Fu Qi): Marriage Karma & Partner Characteristics',
    zh: '夫妻宫详解：婚姻宿缘、配偶特征与相处之道',
    ko: '부처궁 심층 해설: 배우자 인연, 성향 및 화목한 결혼 생활',
    ja: '夫妻宮の深層解説：結婚の宿縁・配偶者の特徴と円満の秘訣',
  },
  '/cung-tai-bach-trong-tu-vi': {
    vi: 'Cung Tài Bạch Trong Tử Vi: Nguồn Tiền, Cách Tụ Tài & Đầu Tư',
    en: 'Wealth Palace (Cai Bo): Income Sources, Wealth Accumulation & Investing',
    zh: '财帛宫详解：财源格局、聚财之道与投资风险控制',
    ko: '재백궁 심층 해설: 재물 그릇, 돈 모으는 법 및 투자 전략',
    ja: '財帛宮の深層解説：財運の器・蓄財パターンと投資リスク管理',
  },
  '/cung-quan-loc-trong-tu-vi': {
    vi: 'Cung Quan Lộc Trong Tử Vi: Định Hướng Sự Nghiệp & Bứt Phá Công Danh',
    en: 'Career Palace (Guan Lu): Vocation, Leadership & Career Breakthroughs',
    zh: '官禄宫详解：事业方向、创业或就职抉择与升迁机遇',
    ko: '관록궁 심층 해설: 직업 적성, 창업·취업 선택 및 승진운',
    ja: '官禄宮の深層解説：天職の方向性・独立と組織の選択・昇進運',
  },
  '/cung-dien-trach-trong-tu-vi': {
    vi: 'Cung Điền Trạch Trong Tử Vi: Vận Mua Nhà Đất & Tích Lũy Điền Sản',
    en: 'Property Palace (Tian Zhai): Real Estate Luck & Asset Accumulation',
    zh: '田宅宫详解：不动产运势、置业买房时机与家宅根基',
    ko: '전택궁 심층 해설: 부동산 운세, 내 집 마련 시기 및 가택 기운',
    ja: '田宅宮の深層解説：不動産運・マイホーム購入時期と家運の基盤',
  },
  '/cung-tu-tuc-va-phuc-duc': {
    vi: 'Cung Tử Tức & Cung Phúc Đức: Đường Con Cái, Âm Phúc & Hậu Vận',
    en: 'Children (Zi Nu) & Karma/Spirit (Fu De) Palaces: Offspring & Ancestral Blessings',
    zh: '子女宫与福德宫：后代缘分、祖荫福泽与精神境界',
    ko: '자녀궁 및 복덕궁: 자녀복, 조상 음덕과 정신적 평안',
    ja: '子女宮と福徳宮：子宝の縁・先祖の陰徳と精神的な豊かさ',
  },
  '/cung-than-va-thien-di': {
    vi: 'Cung An Thân & Cung Thiên Di: Vận Mệnh Sau Tuổi 30 & Xuất Ngoại',
    en: 'Body Palace (Shen) & Travel Palace (Qian Yi): Destiny After 30 & Abroad Luck',
    zh: '身宫与迁移宫：三十岁后的人生下半场与外出贵人运',
    ko: '신궁(身宮) 및 천이궁: 30대 이후의 후천 운명과 해외·외부 활동운',
    ja: '身宮と遷移宮：30歳以降の後半生運勢と海外・対外発展運',
  },
};

export function translateFunnelPageTitle(url: string, fallbackVi: string, lang: Language): string {
  if (lang === 'vi') return fallbackVi;
  return FUNNEL_PAGE_TITLES_I18N[url]?.[lang] || fallbackVi;
}

export const HOME_FUNNEL_I18N: Record<Exclude<Language, 'vi'>, HomeFunnelTranslated> = {
  en: {
    badge1: 'Natal Chart Guide & Reading Ecosystem',
    badge2: 'Authentic Zi Wei Dou Shu & Empirical Feng Shui',
    h1: 'Free Zi Wei Dou Shu Natal Chart & Lifelong Destiny Reading with Master Ton',
    authorLine: 'Compiled & verified by Master Ton (Tran Huy Ton) — Zi Wei Dou Shu & Feng Shui Specialist | Updated: 24/10/2026',
    profileLinkText: 'Master Ton’s Expert Profile →',
    quickSummaryLabel: 'Quick Summary',
    quickSummaryHtml:
      'Master Ton Astrology &amp; Feng Shui is a free classical Zi Wei Dou Shu natal chart generator: enter your name, birth date/hour, and viewing year to plot 110+ stars across all 12 palaces and receive a ~1,000-word Foundational Reading covering your Core Destiny, Life–Wealth–Career Triad, 10-Year Major Decan, and Annual Fortune. Deep readings start at 119,000 VND; when upgrading to a higher tier, you only pay the price difference.',
    introHtml:
      'A Zi Wei Dou Shu natal chart is a 12-palace map constructed from your lunar birth hour, day, month, and year, revealing your innate strengths and the rhythm of life’s ups and downs across every decade. A chart is only accurate when stars are plotted properly and interpreted as complete star formations rather than isolated stars. Beginners can start with our <a href="/cach-xem-la-so-tu-vi" class="text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors">step-by-step guide to reading a Zi Wei chart</a>.',
    bodyHtml: `
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">How does generating a Zi Wei chart with Master Ton work?</h2>
<p class="text-slate-300 leading-relaxed my-4">Generating your natal chart takes less than one minute across four simple steps. The system converts your solar birth details into Lunar Stem-Branch coordinates, determines Yin-Yang, Life Element, and Five-Element Bureau, and plots 110+ stars across the 12 palaces:</p>
<ol class="list-decimal pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed">
  <li class="pl-1"><strong class="text-slate-100 font-semibold">Enter birth details:</strong> full name, gender, solar birth date, birth double-hour, and target viewing year.</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">Automated star plotting:</strong> lunar conversion, Bureau &amp; Life Element calculation, and placement of 14 Major Stars plus 100+ auxiliary stars.</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">Receive your chart &amp; Free Foundational Reading:</strong> ~1,000 words analyzing your Life Bureau, Life–Wealth–Career Triad, 10-Year Major Decan, and 3 Annual Fortune Palaces; save to your notebook or export as an image/PDF.</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">Explore deeper when needed:</strong> upgrade to VIP Pro or Grandmaster Expert, ask AI Master Ton specific questions, or book a 1-on-1 consultation.</li>
</ol>

<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">How do the Free Foundational, VIP Pro, and Grandmaster Expert editions differ?</h2>
<p class="text-slate-300 leading-relaxed my-4">Master Ton’s three reading editions differ in analytical depth and temporal resolution. The Foundational Edition (Free, ~1,000 words) gives a clear overview; VIP Pro (119,000 VND, ~2,500 words) examines the 14 Major Stars, Four Transformations, Physiognomy &amp; 4-Season roadmap; Grandmaster Expert (269,000 VND, ~4,500–6,000 words) dissects all 12 Palaces individually and maps all 12 Lunar Months:</p>
<div class="my-6 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-lg">
  <table class="w-full text-left border-collapse text-sm">
    <thead>
      <tr class="bg-slate-800/90 border-b border-slate-700 text-amber-300">
        <th class="py-3.5 px-4 font-bold">Criteria</th>
        <th class="py-3.5 px-4 font-bold">Foundational Edition</th>
        <th class="py-3.5 px-4 font-bold">VIP Pro Edition</th>
        <th class="py-3.5 px-4 font-bold">Grandmaster Expert</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-800/80">
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">Price</td><td class="py-3 px-4 text-slate-300">Free (0 VND)</td><td class="py-3 px-4 text-slate-300">119,000 VND</td><td class="py-3 px-4 text-slate-300">269,000 VND</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">Reading Length</td><td class="py-3 px-4 text-slate-300">~1,000 words</td><td class="py-3 px-4 text-slate-300">~2,500 words</td><td class="py-3 px-4 text-slate-300">~4,500 - 6,000 words</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">Analytical Scope</td><td class="py-3 px-4 text-slate-300">Life Bureau, Life–Wealth–Career Triad, Body Palace</td><td class="py-3 px-4 text-slate-300">14 Major Stars, Four Transformations, Face &amp; Palm synthesis</td><td class="py-3 px-4 text-slate-300">Exhaustive Palace-by-Palace analysis of all 12 Palaces</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">Timing Forecast</td><td class="py-3 px-4 text-slate-300">10-Year Decan &amp; Annual Overview</td><td class="py-3 px-4 text-slate-300">3 Annual Palaces &amp; 4 Seasons (Spring–Winter)</td><td class="py-3 px-4 text-slate-300">3 Annual Palaces + All 12 Lunar Months (Months 1–12)</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">Included Bonus</td><td class="py-3 px-4 text-slate-300">Save Chart, Image &amp; PDF Export</td><td class="py-3 px-4 text-slate-300">2 Free VIP Pro Q&amp;A Credits (worth 99k)</td><td class="py-3 px-4 text-slate-300">2 Free Expert Q&amp;A Credits (worth 149k)</td></tr>
    </tbody>
  </table>
</div>

<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">How much does it cost to upgrade to a higher edition?</h2>
<p class="text-slate-300 leading-relaxed my-4">Upgrading a chart on Master Ton’s platform only charges the exact price difference between tiers—you never pay twice. If you already unlocked VIP Pro (119,000 VND) and wish to upgrade that same chart to Grandmaster Expert (269,000 VND), you only pay <strong>150,000 VND</strong>.</p>

<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">Who is Master Ton &amp; what makes his methodology unique?</h2>
<p class="text-slate-300 leading-relaxed my-4">Master Ton (Tran Huy Ton) is a Zi Wei Dou Shu and Empirical Feng Shui specialist with 18+ years of research. An alumnus of the Mathematics &amp; Computer Science Gifted Program (Hanoi University) who spent over 7 years studying and working in the UK, he holds both Bachelor’s and Master’s degrees in Accounting &amp; Finance from <strong class="text-amber-300">Lancaster University (Top 5 UK)</strong> and has over 15 years of experience teaching IELTS and Cambridge IGCSE subjects. His readings strictly follow four principles: reading complete star formations, anchoring every forecast in the 3-level time hierarchy (Decan, Minor Limit, Tai Sui), cross-verifying with Face &amp; Palm physiognomy, and remaining 100% free of superstition.</p>`,
    faqHeading: 'Frequently Asked Questions on Natal Charts & Reading Upgrades',
    faqs: [
      {
        question: 'Is generating a Zi Wei chart and Foundational Reading really 100% free?',
        answerHtml:
          'Yes. Plotting your 12-palace natal chart and receiving the ~1,000-word Foundational Reading is completely free with no credit card required. You only pay if you choose to unlock VIP Pro (119,000 VND), Grandmaster Expert (269,000 VND), or extra Q&amp;A credits.',
      },
      {
        question: 'If I already bought VIP Pro, how much is the upgrade to Grandmaster Expert?',
        answerHtml:
          'You only pay the 150,000 VND difference (269,000 VND − 119,000 VND) for the same chart, and you also receive 2 additional Expert Q&amp;A credits.',
      },
      {
        question: 'What if I do not remember my exact birth hour?',
        answerHtml:
          'Because each 2-hour double-hour shifts the Life Palace, you can generate charts for the two closest hours to compare against past life milestones, or book a 1-on-1 session where Master Ton verifies your birth hour via Face &amp; Palm reading.',
      },
      {
        question: 'Should I choose VIP Pro or Grandmaster Expert?',
        answerHtml:
          'Choose VIP Pro (119,000 VND) for a focused analysis of your Life–Wealth–Career–Marriage pillars and 4-Season forecast. Choose Grandmaster Expert (269,000 VND) for an exhaustive 12-Palace breakdown and month-by-month lunar roadmap.',
      },
    ],
    closingHtml: `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">Next Step: Decode Your Natal Chart Today</h2><p class="text-slate-300 leading-relaxed my-4">Your natal chart is ready in 30 seconds. Start with the Free Foundational Edition, unlock VIP Pro or Grandmaster Expert whenever you face an important life or career decision, or schedule a private 1-on-1 session with Master Ton.</p>`,
    primaryCtaLabel: 'Generate Free Natal Chart',
    secondaryCtaLabel: 'Book 1-on-1 Consultation (Zalo 0935 058 688)',
    dirBadge: 'Knowledge & Service Directory',
    dirHeading: 'Complete Library of 38 Zi Wei Dou Shu & Feng Shui Guides by Master Ton',
    dirViewAll: 'View Full Library →',
    dirBranch1: 'Readings & Consultation • Flagship Editions',
    dirBranch2: 'Empirical Feng Shui & Auspicious Dates',
    dirBranch3: 'Stars, Palaces & Annual Fortune Secrets',
  },

  zh: {
    badge1: '紫微排盘指南与命理生态体系',
    badge2: '正统紫微斗数 & 实证阳宅风水',
    h1: '免费排定紫微斗数命盘 • 跟随顿师洞悉一生运势与流年玄机',
    authorLine: '专业编撰与审定：顿师（陈辉顿）— 紫微斗数与实证风水专家 | 更新时间：2026/10/24',
    profileLinkText: '查看顿师专家简介 →',
    quickSummaryLabel: '核心提要',
    quickSummaryHtml:
      '顿师紫微斗数与风水是免费的正统紫微斗数排盘与详批系统：输入姓名、出生年月日时与推算年份，系统即刻在十二宫安放110余颗星曜，并生成约1,000字的《基础断盘》，涵盖本命局、命财官三方四正、十年大运与当年流年三限。深度精批版仅需119,000越南盾起；从Pro升级至宗师专家版仅需补差价150,000越南盾。',
    introHtml:
      '紫微斗数命盘是以农历出生年、月、日、时构建的十二宫人生全息图谱，展现先天禀赋与各个十年大运的起伏节奏。唯有精准安星并结合三方四正星群格局综合推演，方能断事如神。初学者可先阅读<a href="/cach-xem-la-so-tu-vi" class="text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors">《零基础看懂紫微斗数命盘指南》</a>。',
    bodyHtml: `
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">在顿师系统排盘批命包含哪四个步骤？</h2>
<ol class="list-decimal pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed">
  <li class="pl-1"><strong class="text-slate-100 font-semibold">输入生辰信息：</strong>姓名、性别、公历出生日期、出生时辰及所断流年年份。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">系统精准安星：</strong>自动换算干支农历，定阴阳、本命纳音与五行局，安放十四正曜与百余颗辅佐杂曜、流年星曜。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">获取命盘与免费基础断盘：</strong>立即生成约1,000字详批（本命、命财官、大运及小限·流年大限·流年太岁三宫合参），支持永久保存与导出高清图片/PDF。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">按需深度进阶：</strong>随时一键升级VIP大师版或宗师全十二宫专家版、向AI顿师提问，或预约线下/线上1对1亲测。</li>
</ol>

<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">基础免费版、VIP大师版与宗师专家版有何区别？</h2>
<div class="my-6 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-lg">
  <table class="w-full text-left border-collapse text-sm">
    <thead>
      <tr class="bg-slate-800/90 border-b border-slate-700 text-amber-300">
        <th class="py-3.5 px-4 font-bold">对比维度</th>
        <th class="py-3.5 px-4 font-bold">基础免费版</th>
        <th class="py-3.5 px-4 font-bold">VIP 大师精批版</th>
        <th class="py-3.5 px-4 font-bold">宗师专家十二宫版</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-800/80">
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">费用</td><td class="py-3 px-4 text-slate-300">免费 (0 VND)</td><td class="py-3 px-4 text-slate-300">119,000 VND</td><td class="py-3 px-4 text-slate-300">269,000 VND（从Pro升级仅需补150k）</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">批命篇幅</td><td class="py-3 px-4 text-slate-300">约 1,000 字</td><td class="py-3 px-4 text-slate-300">约 2,500 字</td><td class="py-3 px-4 text-slate-300">约 4,500 - 6,000 字</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">批命范围</td><td class="py-3 px-4 text-slate-300">本命局、命财官三方四正、身宫</td><td class="py-3 px-4 text-slate-300">十四正曜、四化飞星、面相手相合参</td><td class="py-3 px-4 text-slate-300">逐宫深度剖析全部十二宫与身宫</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">大运与流年</td><td class="py-3 px-4 text-slate-300">当前大运与流年三宫综述</td><td class="py-3 px-4 text-slate-300">流年三宫详析 + 春夏秋冬四季运势</td><td class="py-3 px-4 text-slate-300">流年三宫详析 + 农历一至十二月逐月详图</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">尊享赠礼</td><td class="py-3 px-4 text-slate-300">保存命盘、导出图片与PDF</td><td class="py-3 px-4 text-slate-300">赠送 2 次 VIP 深度提问（价值99k）</td><td class="py-3 px-4 text-slate-300">赠送 2 次专家级全盘提问（价值149k）</td></tr>
    </tbody>
  </table>
</div>

<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">顿师是谁？其批命体系有何独特之处？</h2>
<p class="text-slate-300 leading-relaxed my-4">顿师（陈辉顿）深耕紫微斗数与实证风水逾18年。早年就读于河内综合大学数学与信息特长班，16岁赴英国留学并执业逾7年，获全英金融会计排名前五名校——<strong class="text-amber-300">英国兰卡斯特大学（Lancaster University）会计与金融学士及硕士学位</strong>，并拥有15年以上雅思（IELTS）及剑桥国际课程（IGCSE）教学经验。顿师批命坚持科学严谨、格局合参、面相手相实证互验，绝不搞封建迷信恐吓。</p>`,
    faqHeading: '关于排盘与升级批命的常见问题 (FAQ)',
    faqs: [
      {
        question: '在顿师网站排盘和看基础断盘真的完全免费吗？',
        answerHtml:
          '完全免费。排定十二宫命盘并获取约1,000字的基础推演无需付费。仅在您需要解锁VIP大师版（119,000 VND）、宗师全十二宫专家版（269,000 VND）或加购AI顿师问答时才需扫码支付。',
      },
      {
        question: '已经购买了VIP大师版，升级到宗师专家版需要付多少钱？',
        answerHtml:
          '同一张命盘从VIP大师版（119,000 VND）升级至宗师专家版（269,000 VND）仅需补差价 150,000 VND，并额外获赠 2 次专家级提问。',
      },
      {
        question: '如果不记得准确的出生时辰怎么办？',
        answerHtml:
          '由于每个时辰（两小时）命宫位置不同，您可以先排相邻两个时辰的命盘对照过往大事，或预约1对1会诊由顿师通过面相与手相为您精准定盘。',
      },
      {
        question: '如何预约顿师线下或线上 1对1 亲测？',
        answerHtml:
          '请致电或通过 Zalo 0935 058 688 提前预约。顿师于河内皇家城（Royal City）接待线下约谈，并为各地及海外缘主提供线上视频会诊。',
      },
    ],
    closingHtml: `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">下一步：立即排定您的专属紫微命盘</h2><p class="text-slate-300 leading-relaxed my-4">只需30秒输入生辰，即可开启本命推演。先看免费基础断盘把握全局，遇到重要抉择再按需升级VIP大师版或宗师专家版。</p>`,
    primaryCtaLabel: '免费排定紫微命盘',
    secondaryCtaLabel: '预约顿师 1对1 亲测 (Zalo 0935 058 688)',
    dirBadge: '命理文库与服务导航',
    dirHeading: '顿师紫微斗数与实证风水 38 篇核心专题总览',
    dirViewAll: '查看全部文库 →',
    dirBranch1: '批命与咨询 • 深度命书',
    dirBranch2: '阳宅风水与择吉 • 地利改运',
    dirBranch3: '星曜格局与十二宫 • 岁运玄机',
  },

  ko: {
    badge1: '명반 작성 가이드 및 명리 생태계',
    badge2: '정통 자미두수 & 실증 풍수지리',
    h1: '톤 대사와 함께하는 무료 자미두수 명반 산출 및 평생 운명 감명',
    authorLine: '집필 및 감수: 톤 대사 (쩐 후이 톤) — 자미두수 및 풍수지리 전문가 | 업데이트: 2026/10/24',
    profileLinkText: '톤 대사 전문가 약력 보기 →',
    quickSummaryLabel: '핵심 요약',
    quickSummaryHtml:
      '톤 대사 자미두수 &amp; 풍수지리는 무료 정통 자미두수 명반 산출 도구입니다. 성함, 생년월일시, 조회 연도를 입력하면 12궁에 110여 개의 별을 배치하고 본명국, 명·재·관 삼방사정, 10년 대운 및 당해 세운 3궁을 풀이한 약 1,000단어 분량의 《기초 무료 감명서》를 즉시 제공합니다. 심층 프로판은 119,000 VND부터 시작하며 상위 버전 승급 시 차액만 결제하시면 됩니다.',
    introHtml:
      '자미두수 명반은 음력 생년월일시를 바탕으로 세워진 12궁의 인생 지도이며, 타고난 강점과 대운별 흐름을 보여줍니다. 개별 별 하나만 보는 것이 아니라 삼방사정의 성요 조합과 격국을 함께 읽어야 정확합니다. 입문자는 <a href="/cach-xem-la-so-tu-vi" class="text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors">《초보자를 위한 자미두수 명반 보는 법》</a>부터 확인해 보세요.',
    bodyHtml: `
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">톤 대사 시스템의 명반 산출 및 감명 4단계</h2>
<ol class="list-decimal pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed">
  <li class="pl-1"><strong class="text-slate-100 font-semibold">출생 정보 입력:</strong> 성함, 성별, 양력 생년월일, 출생시(12간지), 운세 조회 연도 입력.</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">자동 명반 포국:</strong> 음력 간지 변환, 본명 오행 및 오행국 산출, 14주성과 100여 개 보좌성·유년성 정밀 배치.</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">명반 및 기초 무료 감명 확인:</strong> 약 1,000단어의 기초 감명서 즉시 확인, 개인 보관함 저장 및 고화질 이미지/PDF 다운로드.</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">심층 감명 및 1:1 문답:</strong> 필요시 VIP 프로판 또는 전문가 12궁판으로 승급하거나 AI 톤 대사 질문 및 1:1 대면/화상 상담 예약.</li>
</ol>

<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">기초 무료판, VIP 프로판, 전문가 12궁판 비교</h2>
<div class="my-6 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-lg">
  <table class="w-full text-left border-collapse text-sm">
    <thead>
      <tr class="bg-slate-800/90 border-b border-slate-700 text-amber-300">
        <th class="py-3.5 px-4 font-bold">구분</th>
        <th class="py-3.5 px-4 font-bold">기초 무료판</th>
        <th class="py-3.5 px-4 font-bold">VIP 프로 심층판</th>
        <th class="py-3.5 px-4 font-bold">전문가 12궁 마스터판</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-800/80">
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">비용</td><td class="py-3 px-4 text-slate-300">무료 (0 VND)</td><td class="py-3 px-4 text-slate-300">119,000 VND</td><td class="py-3 px-4 text-slate-300">269,000 VND (프로에서 승급 시 차액 150k)</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">감명 분량</td><td class="py-3 px-4 text-slate-300">약 1,000 단어</td><td class="py-3 px-4 text-slate-300">약 2,500 단어</td><td class="py-3 px-4 text-slate-300">약 4,500 - 6,000 단어</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">해독 범위</td><td class="py-3 px-4 text-slate-300">본명국, 명·재·관 삼방사정, 신궁</td><td class="py-3 px-4 text-slate-300">14주성, 사화비성, 관상·손금 대조</td><td class="py-3 px-4 text-slate-300">12궁 전체 및 신궁 개별 완전 해독</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">대운 및 세운</td><td class="py-3 px-4 text-slate-300">10년 대운 및 당해 3궁 요약</td><td class="py-3 px-4 text-slate-300">당해 세운 3궁 + 사계절(봄~겨울) 운기</td><td class="py-3 px-4 text-slate-300">당해 세운 3궁 + 음력 1~12월 월별 상세 운세</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">무료 혜택</td><td class="py-3 px-4 text-slate-300">명반 저장, 이미지/PDF 다운로드</td><td class="py-3 px-4 text-slate-300">VIP 심층 질문 2회 증정 (99k 상당)</td><td class="py-3 px-4 text-slate-300">전문가 질문 2회 증정 (149k 상당)</td></tr>
    </tbody>
  </table>
</div>

<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">톤 대사 소개 및 실증 감명 철학</h2>
<p class="text-slate-300 leading-relaxed my-4">톤 대사(쩐 후이 톤)는 18년 이상 자미두수와 실증 풍수지리를 연구한 전문가입니다. 하노이 종합대학교 수학·정보 영재과정 출신으로 영국에서 7년 이상 유학 및 근무했으며, 영국 회계·금융 톱5 명문인 <strong class="text-amber-300">랭커스터 대학교(Lancaster University)에서 재무회계학 학사 및 석사 학위</strong>를 취득하고 15년 이상 IELTS 및 캠브리지 IGCSE 과목을 강의해 왔습니다. 미신적 공포 조장 없이 논리적 근거와 관상·손금 교차 검증으로 명쾌한 인생 전략을 제시합니다.</p>`,
    faqHeading: '명반 산출 및 감명 승급 관련 자주 묻는 질문 (FAQ)',
    faqs: [
      {
        question: '자미두수 명반 작성과 기초 감명은 정말 무료인가요?',
        answerHtml:
          '네, 100% 무료입니다. 12궁 명반 산출과 약 1,000단어 분량의 기초 감명서는 별도 결제 없이 즉시 열람 및 PDF 저장이 가능합니다.',
      },
      {
        question: 'VIP 프로판을 구매한 뒤 전문가 12궁판으로 올리려면 얼마를 내야 하나요?',
        answerHtml:
          '동일한 명반에 대해 차액인 150,000 VND(269,000 − 119,000)만 결제하시면 전문가 12궁 전체 감명서와 전문가 질문 2회가 추가 제공됩니다.',
      },
      {
        question: '정확한 출생 시간을 모르면 어떻게 하나요?',
        answerHtml:
          '인접한 두 시진의 명반을 각각 산출하여 과거 주요 사건과 대조해 보시거나, 1:1 상담을 통해 관상과 손금으로 정확한 생시를 감정받으실 수 있습니다.',
      },
      {
        question: '톤 대사와의 1:1 대면 또는 화상 상담은 어떻게 예약하나요?',
        answerHtml:
          '전화 또는 Zalo(0935 058 688)로 사전 예약하실 수 있습니다. 하노이 로얄시티 오프라인 대면 상담 및 해외/타 지역 고객을 위한 화상 상담을 진행합니다.',
      },
    ],
    closingHtml: `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">다음 단계: 지금 바로 내 명반 확인하기</h2><p class="text-slate-300 leading-relaxed my-4">30초면 정통 자미두수 명반과 무료 기초 감명서가 완성됩니다. 중요한 결정을 앞두고 계신다면 VIP 프로판 또는 전문가 12궁판으로 명쾌한 해답을 얻으세요.</p>`,
    primaryCtaLabel: '무료 명반 작성하기',
    secondaryCtaLabel: '1:1 상담 예약 (Zalo 0935 058 688)',
    dirBadge: '명리 지식 및 서비스 아카이브',
    dirHeading: '톤 대사의 자미두수 & 풍수지리 38대 핵심 칼럼 총람',
    dirViewAll: '라이브러리 전체 보기 →',
    dirBranch1: '감명 및 상담 • 프리미엄 명서',
    dirBranch2: '풍수지리 및 택일 • 개운 비법',
    dirBranch3: '성요·격국 및 12궁 • 대운·세운 해독',
  },

  ja: {
    badge1: '命盤作成ガイド＆命理エコシステム',
    badge2: '正統派紫微斗数＆実証風水',
    h1: 'トン先生と読み解く無料紫微斗数命盤作成＆生涯運勢鑑定',
    authorLine: '執筆・監修：トン先生（チャン・フイ・トン）— 紫微斗数・風水専門家 | 更新日：2026/10/24',
    profileLinkText: 'トン先生の専門家プロフィール →',
    quickSummaryLabel: 'クイック要約',
    quickSummaryHtml:
      'トン先生の紫微斗数＆風水は、無料の正統派紫微斗数命盤作成システムです。お名前・生年月日・出生時間・鑑定年を入力すると、十二宮に110以上の星を配置し、本命局・命財官三方四正・10年大運・当年流年三限を解説する約1,000語相当の『基礎無料鑑定書』を即座に生成します。深層プロ版は119,000 VNDから、上位版へのアップグレードは差額のみのお支払いです。',
    introHtml:
      '紫微斗数の命盤は、旧暦の生年月日時から構築される十二宮の人生設計図であり、生まれ持った強みと10年ごとの運気の波を映し出します。単独の星だけでなく三方四正の星の組み合わせ（格局）として読むことで真価を発揮します。初めての方は<a href="/cach-xem-la-so-tu-vi" class="text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors">『初心者のための紫微斗数命盤の読み方』</a>からご覧ください。',
    bodyHtml: `
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">トン先生の紫微斗数命盤作成・鑑定の4ステップ</h2>
<ol class="list-decimal pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed">
  <li class="pl-1"><strong class="text-slate-100 font-semibold">生年月日時を入力：</strong>お名前、性別、西暦生年月日、出生時間（十二支）、鑑定したい年を入力します。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">自動安星（命盤作成）：</strong>旧暦干支への変換、陰陽・本命五行・五行局の算出、14主星と100以上の副星・流年星を十二宮へ精密配置します。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">命盤と無料基礎鑑定を取得：</strong>本命局、三方四正、10年大運、流年三限を分析した基礎鑑定書を即座に表示。保存や画像・PDF出力も可能です。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">さらに深い鑑定へ：</strong>VIPプロ版や宗師エキスパート全12宮版への昇格、AIトン先生への個別質問、1対1対面・オンライン鑑定予約が可能です。</li>
</ol>

<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">基礎無料版・VIPプロ版・宗師エキスパート版の違い</h2>
<div class="my-6 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-lg">
  <table class="w-full text-left border-collapse text-sm">
    <thead>
      <tr class="bg-slate-800/90 border-b border-slate-700 text-amber-300">
        <th class="py-3.5 px-4 font-bold">比較項目</th>
        <th class="py-3.5 px-4 font-bold">基礎無料版</th>
        <th class="py-3.5 px-4 font-bold">VIPプロ深層版</th>
        <th class="py-3.5 px-4 font-bold">宗師エキスパート全12宮版</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-800/80">
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">料金</td><td class="py-3 px-4 text-slate-300">無料 (0 VND)</td><td class="py-3 px-4 text-slate-300">119,000 VND</td><td class="py-3 px-4 text-slate-300">269,000 VND（プロからの昇格は差額150k）</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">鑑定文量</td><td class="py-3 px-4 text-slate-300">約 1,000 語相当</td><td class="py-3 px-4 text-slate-300">約 2,500 語相当</td><td class="py-3 px-4 text-slate-300">約 4,500〜6,000 語相当</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">鑑定範囲</td><td class="py-3 px-4 text-slate-300">本命局・命財官三方四正・身宮</td><td class="py-3 px-4 text-slate-300">14主星・四化飛星・面相手相照合</td><td class="py-3 px-4 text-slate-300">全12宮および身宮を一つ残らず個別徹底解剖</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">時期・運勢</td><td class="py-3 px-4 text-slate-300">10年大運＆当年流年三限の総括</td><td class="py-3 px-4 text-slate-300">流年三限＋春夏秋冬の四季運勢マップ</td><td class="py-3 px-4 text-slate-300">流年三限＋旧暦1月〜12月の月別詳細運勢</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">特典</td><td class="py-3 px-4 text-slate-300">命盤保存・画像/PDF出力</td><td class="py-3 px-4 text-slate-300">VIP深層質問 2回無料進呈（99k相当）</td><td class="py-3 px-4 text-slate-300">専門質問 2回無料進呈（149k相当）</td></tr>
    </tbody>
  </table>
</div>

<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">トン先生の経歴と実証的鑑定メソッド</h2>
<p class="text-slate-300 leading-relaxed my-4">トン先生（チャン・フイ・トン）は紫微斗数と実証風水の研究歴18年以上の専門家です。ハノイ総合大学数学・情報英才クラス出身で、16歳より7年以上にわたり英国に留学・勤務し、英国会計・金融分野トップ5の名門<strong class="text-amber-300">ランカスター大学（Lancaster University）にて財務会計学の学士号および修士号</strong>を取得。さらに15年以上にわたりIELTSやケンブリッジ国際カリキュラム（IGCSE）を指導してきました。迷信的な脅しを一切排し、数理的論理と面相・手相の照合による実践的な人生戦略を提示します。</p>`,
    faqHeading: '命盤作成およびアップグレードに関するよくある質問 (FAQ)',
    faqs: [
      {
        question: '紫微斗数の命盤作成と基礎鑑定は本当に無料ですか？',
        answerHtml:
          'はい、完全無料です。十二宮の命盤作成と約1,000語相当の基礎鑑定書は登録不要・無料で閲覧でき、PDF保存も可能です。',
      },
      {
        question: 'VIPプロ版を購入後、宗師エキスパート版へ昇格する場合の料金は？',
        answerHtml:
          '同じ命盤であれば差額の 150,000 VND（269,000 − 119,000）のみのお支払いで宗師エキスパート全12宮版へ昇格でき、専門質問2回分も追加付与されます。',
      },
      {
        question: '正確な出生時間がわからない場合はどうすればよいですか？',
        answerHtml:
          '前後2つの時間帯で命盤を作成して過去の出来事と照らし合わせるか、1対1鑑定にて面相・手相から正確な出生時間を特定することができます。',
      },
      {
        question: 'トン先生との1対1対面・オンライン鑑定の予約方法は？',
        answerHtml:
          'お電話またはZalo（0935 058 688）にて事前予約を承っております。ハノイ・ロイヤルシティでの対面鑑定およびオンラインビデオ通話鑑定に対応しています。',
      },
    ],
    closingHtml: `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">次のステップ：今すぐあなたの命盤を作成する</h2><p class="text-slate-300 leading-relaxed my-4">わずか30秒の入力であなたの命盤が完成します。まずは無料基礎版で全体像を把握し、重要な決断の際にはVIPプロ版や宗師エキスパート版をご活用ください。</p>`,
    primaryCtaLabel: '無料で命盤を作成する',
    secondaryCtaLabel: '1対1鑑定を予約する (Zalo 0935 058 688)',
    dirBadge: '命理ライブラリ＆サービス一覧',
    dirHeading: 'トン先生の紫微斗数＆実証風水 全38特集ガイド体系',
    dirViewAll: 'ライブラリ一覧を見る →',
    dirBranch1: '鑑定＆ご相談 • 深層鑑定書',
    dirBranch2: '実証風水＆吉日選定 • 開運処方',
    dirBranch3: '星曜・格局・十二宮 • 大運と流年運',
  },
};
