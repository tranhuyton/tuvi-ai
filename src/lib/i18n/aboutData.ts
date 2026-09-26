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
    badge: 'Chân Dung Người Sáng Lập & Luận Giải',
    name: 'Thầy Tôn (Trần Huy Tôn)',
    bio: 'Nhà nghiên cứu Mệnh lý học Dịch học cổ truyền, cựu chuyên gia Tài chính — Kiểm toán Quốc tế. Người tiên phong kết hợp Tư duy logic Toán học, Nhãn quan kinh tế thực chứng cùng Bát Bộ Thần Sát & Tướng Pháp Bí Truyền.',
    stats: [
      { val: '18+ Năm', label: 'Nghiên cứu Tử Vi & Cổ thuật' },
      { val: '7+ Năm', label: 'Học tập & làm việc tại Anh Quốc' },
      { val: 'Top 5 UK', label: 'Đại học Lancaster (Tài chính)' },
      { val: '15+ Năm', label: 'Giảng dạy & Nghiên cứu kinh tế' },
    ],
    pillar1: {
      title: 'Học Vấn & Vương Quốc Anh',
      points: [
        'Cựu học sinh cấp ba lớp Toán - Tin, Trường Đại học Tổng Hợp Hà Nội.',
        'Hơn 7 năm du học và làm việc tại Anh Quốc từ năm 16 tuổi.',
        'Tốt nghiệp khoa Quản lý Tài chính Kế toán trường Đại học Lancaster — Top 5 trường đứng đầu về Accounting & Finance tại Vương Quốc Anh (UK).',
      ],
    },
    pillar2: {
      title: 'Kiểm Toán & Kinh Tế Thực Chứng',
      points: [
        'Kinh nghiệm làm việc thực chiến tại các công ty kiểm toán Quốc tế và các tổ chức tài chính doanh nghiệp.',
        'Thâm niên hơn 15 năm nghiên cứu chuyên sâu và giảng dạy bộ môn ngôn ngữ Anh cùng các môn khoa học tài chính kinh tế cho các trường Quốc tế.',
        {
          text: 'Chủ sáng lập nền tảng giáo dục học thuật ',
          linkText: 'TonyEnglish.vn',
          url: 'https://tonyenglish.vn/',
        },
        'Tiếp tục tham gia nghiên cứu chuyên sâu về các lĩnh vực kinh tế thương mại, chu kỳ đầu tư tại Việt Nam.',
      ],
    },
    pillar3: {
      title: '18 Năm Tử Vi & Cố Vấn Đương Số',
      points: [
        'Gần 18 năm nghiên cứu, khảo chứng và thực hành Tử Vi Đẩu Số, kết hợp Bát Bộ Thần Sát và Diện Tướng, Thủ Tướng.',
        'Trực tiếp tham vấn và định hướng thời vận cho rất nhiều đối tượng: từ các nghệ sĩ, diễn viên tên tuổi, lãnh đạo tập đoàn, chủ doanh nghiệp lớn đến các nhà đầu tư tài chính.',
        'Đồng hành cùng các bạn trẻ định hướng học tập, du học, chọn ngành nghề phù hợp bản mệnh, hóa giải trắc trở tình duyên và kiến tạo sự nghiệp.',
      ],
    },
    philosophy: {
      title: 'Triết Lý Luận Giải: Khoa Học — Thực Chứng — Không Mê Tín Dị Đoan',
      desc: 'Khác biệt lớn nhất trong các bài bình giải của Thầy Tôn nằm ở tính hệ thống, logic khoa học chặt chẽ và sự tỉ mỉ. Dưới lăng kính của người làm toán học và tài chính quốc tế, Tử Vi là bản đồ phân tích chu kỳ nhân sinh và quản trị rủi ro cuộc đời — biến những điển tích cổ tự phức tạp thành những định hướng sắc bén, gần gũi, giúp quý đương số "Tri mệnh để thuận mệnh, nắm bắt thời cơ và hanh thông bản mệnh".',
      websiteBtn: 'Xem Website TonyEnglish',
      contactBtn: 'Liên Hệ Đàm Đạo',
    },
    addressLabel: 'Địa chỉ:',
    addressValue: 'R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    contactLabel: 'Liên hệ:',
  },

  en: {
    badge: 'Founder & Master Astrologer Profile',
    name: 'Master Ton (Tran Huy Ton)',
    bio: 'Researcher of Classical I-Ching & Zi Wei Dou Shu Metaphysics, former International Finance & Audit Specialist. Pioneer in integrating Mathematical Logic, Empirical Economics, and Esoteric Physiognomy & Palmistry.',
    stats: [
      { val: '18+ Years', label: 'Zi Wei & Metaphysics Research' },
      { val: '7+ Years', label: 'Studied & Worked in the UK' },
      { val: 'Top 5 UK', label: 'Lancaster University (Finance)' },
      { val: '15+ Years', label: 'Teaching & Economic Research' },
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
      title: 'Audit & Empirical Economics',
      points: [
        'Hands-on professional experience at international audit firms and corporate financial institutions.',
        'Over 15 years conducting deep research and lecturing English language, economics, and finance for international institutions.',
        {
          text: 'Founder of the academic education platform ',
          linkText: 'TonyEnglish.vn',
          url: 'https://tonyenglish.vn/',
        },
        'Ongoing in-depth analysis of macroeconomic trends and investment cycles.',
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
      title: '国际审计与实证经济学',
      points: [
        '具备国际权威会计师事务所及跨国金融机构实操实战底蕴。',
        '逾15年致力于为国际学校研习教授高等英语语言学与经济金融学科。',
        {
          text: '学术教育品牌创始人：',
          linkText: 'TonyEnglish.vn',
          url: 'https://tonyenglish.vn/',
        },
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
      title: '회계 감사 & 실증 경제학',
      points: [
        '글로벌 국제 회계법인 및 기업 금융기관에서의 풍부한 실무 경험.',
        '15년 이상 국제학교 대상 고급 영어학 및 경제·금융 학술 강의 진행.',
        {
          text: '학술 교육 플랫폼 창립: ',
          linkText: 'TonyEnglish.vn',
          url: 'https://tonyenglish.vn/',
        },
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
};
