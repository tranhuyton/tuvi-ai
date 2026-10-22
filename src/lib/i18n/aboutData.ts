import { Language } from './translations';

export interface AboutContent {
  badge: string;
  name: string;
  bio: string;
  stats: {
    val: string;
    label: string;
  }[];
  pillar1: {
    title: string;
    points: string[];
  };
  pillar2: {
    title: string;
    points: (string | { text: string; linkText: string; url: string })[];
  };
  pillar3: {
    title: string;
    points: string[];
  };
  philosophy: {
    title: string;
    desc: string;
    websiteBtn: string;
    contactBtn: string;
  };
  addressLabel: string;
  addressValue: string;
  contactLabel: string;
}

export const ABOUT_DATA: Record<Language, AboutContent> = {
  vi: {
    badge: 'Chân Dung Chuyên Gia Tử Vi & Phong Thủy — Người Sáng Lập Hệ Thống',
    name: 'Thầy Tôn (Trần Huy Tôn)',
    bio: 'Chuyên gia Tử Vi Đẩu Số, Phong Thủy Thực Chứng & Dịch học cổ truyền; Cựu Chuyên gia Tài chính — Kiểm toán Quốc tế tại Vương Quốc Anh; Giáo viên Tiếng Anh chuyên luyện thi IELTS, Giao tiếp và các môn Toán, Khoa học, Kinh tế, Kinh doanh, Địa lý chương trình Quốc tế IGCSE hơn 15 năm. Người tiên phong ứng dụng Tư duy Toán học xác suất, Nhãn quan Kinh tế vĩ mô kết hợp Tử Vi Đẩu Số, Bát Bộ Thần Sát, Phong Thủy Dương Trạch & Tướng Pháp thực chứng.',
    stats: [
      { val: '18+ Năm', label: 'Nghiên cứu Tử Vi & Phong Thủy' },
      { val: '7+ Năm', label: 'Du học & Làm việc tại Anh Quốc' },
      { val: 'Top 5 UK', label: 'ĐH Lancaster (Tài chính - Kế toán)' },
      { val: '15+ Năm', label: 'Giảng dạy IELTS & IGCSE Quốc tế' },
    ],
    pillar1: {
      title: 'Nền Tảng Toán Học & Tinh Hoa Anh Quốc',
      points: [
        'Cựu học sinh Chuyên Toán - Tin, Khối Chuyên Trường Đại học Tổng Hợp Hà Nội (nay là ĐH Khoa học Tự nhiên - ĐHQGHN) với nền tảng tư duy logic và cấu trúc hệ thống sắc bén.',
        'Hơn 7 năm du học và làm việc chuyên nghiệp tại Vương Quốc Anh (UK) từ năm 16 tuổi.',
        'Tốt nghiệp Cử nhân Quản lý Tài chính & Kế toán tại Đại học Lancaster (Lancaster University) — Top 5 trường đại học hàng đầu Vương Quốc Anh về Tài chính, Kế toán & Quản trị.',
      ],
    },
    pillar2: {
      title: 'Giáo Dục Quốc Tế (IELTS, IGCSE) & Kiểm Toán',
      points: [
        'Hơn 15 năm trực tiếp giảng dạy Tiếng Anh chuyên luyện thi IELTS, Tiếng Anh Giao tiếp và các môn học thuật chương trình Quốc tế Cambridge IGCSE: Toán (Mathematics), Khoa học (Sciences), Kinh tế (Economics), Kinh doanh (Business Studies) & Địa lý (Geography).',
        {
          text: 'Nhà sáng lập nền tảng giáo dục học thuật Quốc tế uy tín ',
          linkText: 'TonyEnglish.vn',
          url: 'https://tonyenglish.vn/',
        },
        'Kinh nghiệm thực chiến tại các hãng Kiểm toán Quốc tế và định chế Tài chính — Đầu tư doanh nghiệp tại Anh Quốc và Việt Nam.',
        'Thường xuyên phân tích chuyên sâu về chu kỳ kinh tế vĩ mô, bất động sản, chứng khoán và quản trị rủi ro tài chính cá nhân.',
      ],
    },
    pillar3: {
      title: '18+ Năm Tử Vi, Phong Thủy Thực Chứng & Cố Vấn',
      points: [
        'Hơn 18 năm nghiên cứu, khảo chứng hàng chục ngàn lá số Tử Vi Đẩu Số thực tế, kết hợp Bát Bộ Thần Sát, Phi Tinh Tứ Hóa cùng Diện Tướng (khuôn mặt) và Thủ Tướng (chỉ tay).',
        'Trực tiếp tư vấn, khảo sát và bố cục Phong Thủy Dương Trạch (nhà ở, biệt thự, chung cư, văn phòng, trụ sở doanh nghiệp), kích hoạt Tài vị — Văn xương và Trạch nhật (xem ngày giờ động thổ, nhập trạch, khai trương) chuẩn Huyền Không Phi Tinh & Bát Trạch.',
        'Cố vấn định hướng thời vận, kinh doanh và phong thủy cải vận 1-1 cho đông đảo chủ doanh nghiệp, lãnh đạo tập đoàn, nhà đầu tư, bác sĩ, kỹ sư và các nghệ sĩ, diễn viên tên tuổi.',
      ],
    },
    philosophy: {
      title: 'Triết Lý Tử Vi & Phong Thủy: Khoa Học — Thực Chứng — Không Mê Tín Dị Đoan',
      desc: 'Khác biệt cốt lõi làm nên uy tín của Thầy Tôn nằm ở phương pháp luận giải Tử Vi và tư vấn Phong Thủy khoa học, logic chặt chẽ, tuyệt đối không hù dọa hay bày vẽ cúng bái mê tín dị đoan. Dưới lăng kính Toán học xác suất, Quy luật Khí trường tự nhiên và Quản trị rủi ro Tài chính Quốc tế, sự kết hợp giữa Lá Số Tử Vi (Thiên thời) và Phong Thủy Thực Chứng (Địa lợi) chính là "bản đồ chiến lược nhân sinh" — giúp gia chủ và doanh nghiệp kích hoạt vượng khí, chiêu tài tụ lộc và chủ động hóa giải tai ương.',
      websiteBtn: 'Xem Website TonyEnglish',
      contactBtn: 'Đặt Lịch Tử Vi & Phong Thủy',
    },
    addressLabel: 'Địa chỉ phòng xem trực tiếp:',
    addressValue: 'R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    contactLabel: 'Hotline / Zalo đặt lịch:',
  },

  en: {
    badge: 'Founder & Master Astrologer Profile',
    name: 'Master Ton (Tran Huy Ton)',
    bio: 'Expert in Zi Wei Dou Shu, Empirical Feng Shui & Classical I-Ching; former International Finance & Audit Specialist in the UK; Senior Educator with 15+ years teaching IELTS, English Communication, and IGCSE Mathematics, Sciences, Economics, Business Studies, and Geography.',
    stats: [
      { val: '18+ Years', label: 'Zi Wei & Feng Shui Research' },
      { val: '7+ Years', label: 'Studied & Worked in the UK' },
      { val: 'Top 5 UK', label: 'Lancaster University (Finance)' },
      { val: '15+ Years', label: 'IELTS & IGCSE International Educator' },
    ],
    pillar1: {
      title: 'Academics & United Kingdom',
      points: [
        'Alumni of Hanoi University High School for the Gifted (Mathematics & Computer Science).',
        'Over 7 years living, studying, and working in the United Kingdom from the age of 16.',
        'Graduated in Accounting and Finance from Lancaster University — Top 5 premier institution in Accounting & Finance in the United Kingdom.',
      ],
    },
    pillar2: {
      title: 'International Education (IELTS, IGCSE) & Audit',
      points: [
        'Over 15 years teaching intensive IELTS preparation, English Communication, and Cambridge IGCSE subjects: Mathematics, Sciences, Economics, Business Studies, and Geography.',
        {
          text: 'Founder of the academic education platform ',
          linkText: 'TonyEnglish.vn',
          url: 'https://tonyenglish.vn/',
        },
        'Hands-on professional experience at international audit firms and corporate financial institutions in the UK and Vietnam.',
        'Ongoing in-depth analysis of macroeconomic trends, real estate, and investment cycles.',
      ],
    },
    pillar3: {
      title: '18 Years in Zi Wei & Life Mentoring',
      points: [
        'Nearly 18 years researching, verifying, and practicing Zi Wei Dou Shu, integrated with Physiognomy and Palmistry.',
        'Personal strategic advisor to prominent artists, corporate executives, enterprise founders, and financial investors.',
        'Mentoring young seekers on academic majors, studying abroad, career paths aligned with innate destiny, and relationship balance.',
      ],
    },
    philosophy: {
      title: 'Guiding Philosophy: Scientific — Empirical — Free of Superstition',
      desc: 'Master Ton’s signature strength lies in rigorous systemic logic, mathematical clarity, and empirical depth. Through the lens of international finance and probability mathematics, Zi Wei Dou Shu is a sophisticated roadmap of human life cycles and strategic risk management — transforming ancient esoteric texts into actionable, inspiring life strategies.',
      websiteBtn: 'Visit TonyEnglish.vn',
      contactBtn: 'Book Consultation',
    },
    addressLabel: 'Address:',
    addressValue: 'R2B 2219, Royal City, 72 Nguyen Trai, Thanh Xuan, Hanoi, Vietnam',
    contactLabel: 'Contact:',
  },

  zh: {
    badge: '创始人与总顾问宗师风采',
    name: '顿师 (陈辉顿 / Master Ton)',
    bio: '传统东方易学与紫微斗数资深学者，前国际金融与审计专家。开创性融合现代数学逻辑、实证经济学敏锐眼界与八部神煞面相掌相秘传。',
    stats: [
      { val: '18+ 年', label: '精研紫微与传统古术' },
      { val: '7+ 年', label: '赴英国深造与执业' },
      { val: '英国前五', label: '兰卡斯特大学 (金融学)' },
      { val: '15+ 年', label: '学术讲学与经济研究' },
    ],
    pillar1: {
      title: '学术渊源与英伦历练',
      points: [
        '毕业于河内综合大学数学与信息特长班。',
        '16岁起赴英国留学深造并执业，深耕英伦逾7年。',
        '毕业于全英会计金融常年稳居前5之顶尖学府 —— 兰卡斯特大学 (Lancaster University) 会计金融系。',
      ],
    },
    pillar2: {
      title: '国际教育 (IELTS/IGCSE) 与国际审计',
      points: [
        '逾15年深耕雅思 (IELTS) 备考、英语口语交际及剑桥国际课程 (IGCSE) 全英文学科教学：数学、科学、经济学、商业研究与地理。',
        {
          text: '学术教育品牌创始人：',
          linkText: 'TonyEnglish.vn',
          url: 'https://tonyenglish.vn/',
        },
        '具备英国及越南国际权威会计师事务所及跨国金融机构实操实战底蕴。',
        '长期跟踪宏观商业经济变迁与产业投资大周期。',
      ],
    },
    pillar3: {
      title: '18载紫微推演与命理顾问',
      points: [
        '近18年系统考证、推演与践行紫微斗数，合参八部神煞、面相相法与手相掌纹。',
        '长期亲自为著名艺术家、大型集团董事长、知名企业家与金融投资大鳄把脉时运。',
        '倾力指导青年才俊之学业择校、出国深造、契合本命之职业生涯规划与姻缘指引。',
      ],
    },
    philosophy: {
      title: '批命法旨：科学严谨 — 实证洞察 — 绝无封建迷信',
      desc: '顿师批命之精髓在于系统化结构、严谨数学逻辑与鞭辟入里的推断。以国际金融与数理概率之视野，紫微斗数乃人生运律与风险控制之精准全息图谱 —— 化繁奥晦涩之古籍为切中时弊、直指核心之人生大智慧，助缘主“知天命而顺天时，驭大运以拓乾坤”。',
      websiteBtn: '访问 TonyEnglish 官网',
      contactBtn: '联系顿师当面问道',
    },
    addressLabel: '看盘会客室：',
    addressValue: '越南河内市青春郡阮廌路72号皇家城 (Royal City) R2B 2219室',
    contactLabel: '联系电话：',
  },

  ko: {
    badge: '창립자 및 감명 총괄 대사 소개',
    name: '톤 대사 (Tran Huy Ton / 쩐 후이 톤)',
    bio: '동양 정통 주역 및 명리학 연구가이자 전 국제 금융·회계 감사 전문가. 수학적 논리 구조, 실증 경제학적 거시 안목, 팔부신살 및 관상·손금 비전을 융합한 현대 자미두수의 선구자.',
    stats: [
      { val: '18+ 년', label: '자미두수 및 고대 비전 연구' },
      { val: '7+ 년', label: '영국 유학 및 현지 근무' },
      { val: '영국 톱 5', label: '랭커스터 대학교 (재무회계)' },
      { val: '15+ 년', label: '경제 강의 및 학술 연구' },
    ],
    pillar1: {
      title: '학문적 배경 & 영국 유학',
      points: [
        '하노이 종합대학교 수학·정보 과학 영재과정 출신.',
        '16세부터 7년 이상 영국에서 유학 및 현지 전문직 근무.',
        '영국 내 회계·금융 분야 최상위 5위권 명문인 랭커스터 대학교(Lancaster University) 재무회계학과 졸업.',
      ],
    },
    pillar2: {
      title: '국제 교육 (IELTS·IGCSE) & 회계 감사',
      points: [
        '15년 이상 IELTS 시험 대비, 영어 회화 및 캠브리지 국제 교육과정(IGCSE) 수학, 과학, 경제학, 경영학(비즈니스), 지리학 전문 강의.',
        {
          text: '학술 교육 플랫폼 창립: ',
          linkText: 'TonyEnglish.vn',
          url: 'https://tonyenglish.vn/',
        },
        '글로벌 국제 회계법인 및 기업 금융기관에서의 풍부한 실무 경험.',
        '거시 경제 동향 및 투자 사이클에 관한 전문적 심층 연구 지속.',
      ],
    },
    pillar3: {
      title: '18년간의 자미두수 & 운명 자문',
      points: [
        '18년 가까이 자미두수 정통 고증, 팔부신살, 얼굴 관상 및 손금(수상) 종합 실증 감명.',
        '유명 예술인, 대기업 임원진, 사업가, 금융 투자자들의 운세와 인생 전략 1:1 심층 자문.',
        '청년 세대를 위한 학업, 해외 유학, 본명에 맞는 진로 선택 및 혼인 인연 지도.',
      ],
    },
    philosophy: {
      title: '감명 철학: 과학적 체계 — 실증적 분석 — 미신 타파',
      desc: '톤 대사 감명의 가장 큰 차별점은 철저한 논리적 체계와 정밀성에 있습니다. 수학과 국제 금융 전문가의 시각으로 바라본 자미두수는 인생 주기와 리스크 관리의 정밀 지도입니다. 복잡한 고대 비결을 명쾌하고 실천적인 지침으로 전환하여 "운명을 알고 순응하며, 때를 잡아 형통함을 이루도록" 돕습니다.',
      websiteBtn: 'TonyEnglish 웹사이트 방문',
      contactBtn: '톤 대사 대면 상담 문의',
    },
    addressLabel: '상담실 주소:',
    addressValue: '베트남 하노이시 타인쑤언구 응우옌짜이로 72 로얄시티 (Royal City) R2B 2219호',
    contactLabel: '상담 문의:',
  },

  ja: {
    badge: '創業者および鑑定総括紹介',
    name: 'トン先生（Tran Huy Ton / チャン・フイ・トン）',
    bio: '東洋伝統易学・命理学研究家、元国際金融・会計監査専門家。数学的論理思考、実証経済の先見眼、そして八部神殺と面相・手相の秘伝を融合させた現代紫微斗数の第一人者。',
    stats: [
      { val: '18+ 年', label: '紫微斗数および古術研究' },
      { val: '7+ 年', label: '英国留学および現地勤務' },
      { val: '英国トップ5', label: 'ランカスター大学（財務会計）' },
      { val: '15+ 年', label: '経済学講義および学術研究' },
    ],
    pillar1: {
      title: '学術的背景＆イギリス留学',
      points: [
        'ハノイ総合大学 数学・情報英才クラス出身。',
        '16歳より7年以上にわたりイギリスへ留学し現地で勤務。',
        'イギリス国内の会計・金融分野でトップ5に入る名門ランカスター大学（Lancaster University）財務会計学部を卒業。',
      ],
    },
    pillar2: {
      title: '国際教育 (IELTS・IGCSE) ＆会計監査',
      points: [
        '15年以上にわたりIELTS対策、英会話、およびケンブリッジ国際カリキュラム（IGCSE）の数学、科学、経済学、ビジネス学、地理学を専門指導。',
        {
          text: '学術教育プラットフォーム創設: ',
          linkText: 'TonyEnglish.vn',
          url: 'https://tonyenglish.vn/',
        },
        '国際監査法人およびグローバル金融機関における豊富な実務経験。',
        'マクロ経済動向や投資サイクルに関する専門的分析を継続。',
      ],
    },
    pillar3: {
      title: '18年間の紫微斗数・運命鑑定実績',
      points: [
        '18年近くにわたり紫微斗数の古義、八部神殺、面相・手相を統合した実証鑑定を研究。',
        '著名な芸術家、大企業経営層、投資家、起業家の運命戦略を1対1で指南。',
        '若年層の学業、海外留学、本命に適した進路選択や良縁指南。',
      ],
    },
    philosophy: {
      title: '鑑定哲学：科学的体系 — 実証的分析 — 迷信の打破',
      desc: 'トン先生の鑑定が際立っているのは、徹底した論理的体系と精密さにあります。数学と国際金融の視点から捉えた紫微斗数は、人生の周期とリスク管理の精密な羅針盤です。難解な古代の口訣を明快で実践的な指針へと昇華させ、「天命を弁え、時流に乗って吉祥を掴む」生き方を後押しします。',
      websiteBtn: 'TonyEnglish公式サイトへ',
      contactBtn: 'トン先生への面談相談予約',
    },
    addressLabel: '対面鑑定室所在地:',
    addressValue: 'ベトナム ハノイ市タインスアン区グエンチャイ72 ロイヤルシティ (Royal City) R2B 2219号',
    contactLabel: 'お問い合わせ:',
  },
};
