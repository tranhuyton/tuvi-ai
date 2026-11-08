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
import { useLanguage } from '@/context/LanguageContext';

const HERO_I18N = {
  vi: {
    badge1: 'Luận Giải Vận Hạn 2026 – 2027 Chuẩn 3 Tầng',
    badge2: 'Mở khóa tự động 24/7 ngay khi quét QR',
    h1Part1: 'Giải Mã Vận Hạn Năm ',
    h1Part2: ' Qua 3 Cung Hạn: Tiểu Hạn • LN.Đại Hạn • Lưu Thái Tuế',
    introHtml:
      'Xem vận hạn một năm mà chỉ nhìn 1 cung là bỏ sót mất 2/3 bức tranh. Hệ thống của <strong class="text-amber-300">Thầy Tôn</strong> đối chiếu đồng thời cả <strong class="text-white">3 cung hạn riêng biệt</strong> trên lá số 108+ sao kết hợp <strong class="text-white">Nhân Tướng Học</strong> để chỉ rõ thời điểm tiến – thoái về Tài chính, Công danh, Đất đai và Gia đạo:',
    c1Title: 'Cung Tiểu Hạn',
    c1Sub: 'Nội tâm & Mong muốn',
    c1Desc: 'Đọc vị suy nghĩ, trăn trở hay khát vọng bứt phá đang khởi lên từ bên trong bạn trong năm xem.',
    c2Title: 'Cung LN.Đại Hạn',
    c2Sub: 'Điểm rơi Đại vận 10 năm',
    c2Desc: 'Chỉ thẳng lĩnh vực trọng tâm (Tài bạch, Điền trạch, Quan lộc, Gia đạo...) chịu tác động lớn nhất.',
    c3Title: 'Cung Lưu Thái Tuế',
    c3Sub: 'Hoàn cảnh & Kết quả',
    c3Desc: 'Xét dàn Sao Lưu để chốt kết quả thực tế về dòng tiền, hợp đồng, quý nhân và sức khỏe.',
    ctaBtn: 'Nhập Ngày Giờ Sinh Để Giải Mã Ngay',
    ctaNote: '✓ Logic, thực chứng, không mê tín • Lưu Sổ Tay & xuất PDF trọn đời',
    authorLabel: 'Biên Soạn & Thẩm Định Thuật Toán',
    authorName: 'Thầy Tôn (Trần Huy Tôn)',
    authorExp: '18+ năm nghiên cứu Tử Vi, Tướng Pháp & Phong Thủy',
    bio1Html: 'Cựu học sinh khối <strong>Chuyên Toán - Tin</strong>, Đại học Tổng hợp Hà Nội.',
    bio2Html: 'Cử nhân & Thạc sĩ chuyên ngành Tài chính Kế toán tại <strong>Đại học Lancaster (Top 5 Vương Quốc Anh)</strong>.',
    bio3Html: 'Luận giải mạch lạc theo tổ hợp sao & dòng thời gian — <strong>tuyệt đối không hù dọa mê tín</strong>.',
    proTitle: 'Bản Chuyên Sâu VIP Pro',
    proPrice: '119.000đ',
    proDesc: 'Luận chi tiết 3 cung Vận Hạn & 4 mùa (~2.500 từ) + Soi Mặt & Chỉ tay + 🎁 Tặng 02 câu hỏi VIP.',
    expTitle: 'Bản Đại Tông Sư Expert (12 Cung)',
    expPrice: '269.000đ',
    expDesc: 'Tuyệt phẩm ~5.000 từ mổ xẻ đủ 12 Cung + Bản đồ chi tiết từng tháng (Tháng 1–12 Âm lịch) + 🎁 Tặng 02 câu hỏi Chuyên Gia.',
  },
  en: {
    badge1: '3-Layer Annual Transit Decoding (2026 – 2027)',
    badge2: 'Instant 24/7 Automated Unlock via VietQR',
    h1Part1: 'Decode Your ',
    h1Part2: ' Annual Transits Across 3 Key Palaces: Minor Limit • Annual Major Limit • Annual Tai Sui',
    introHtml:
      'Checking only a single palace for an entire year misses two-thirds of the picture. <strong class="text-amber-300">Master Ton’s</strong> system cross-references <strong class="text-white">3 distinct annual transit palaces</strong> across 108+ stars combined with <strong class="text-white">Physiognomy</strong> to pinpoint exact timing for Finance, Career, Real Estate, and Family:',
    c1Title: 'Minor Limit Palace',
    c1Sub: 'Inner Mindset & Desires',
    c1Desc: 'Reveals the internal thoughts, concerns, and ambitions arising within you during the target year.',
    c2Title: 'Annual Major Limit',
    c2Sub: '10-Year Cycle Focal Point',
    c2Desc: 'Pinpoints the exact life domain (Wealth, Property, Career, Family...) experiencing the strongest impact.',
    c3Title: 'Annual Tai Sui Palace',
    c3Sub: 'External Reality & Outcome',
    c3Desc: 'Analyzes Annual Transit Stars to determine concrete outcomes for cashflow, contracts, benefactors, and health.',
    ctaBtn: 'Enter Birth Details to Decode Now',
    ctaNote: '✓ Logical, empirical, zero superstition • Lifetime Notebook & PDF export',
    authorLabel: 'Algorithm Author & Reviewer',
    authorName: 'Master Ton (Tran Huy Ton)',
    authorExp: '18+ Years Researching Zi Wei Dou Shu, Physiognomy & Feng Shui',
    bio1Html: 'Alumnus of the <strong>Specialized Mathematics & Informatics</strong> High School, Hanoi University.',
    bio2Html: 'Bachelor’s & Master’s Degrees in Accounting & Finance from <strong>Lancaster University (Top 5 UK)</strong>.',
    bio3Html: 'Clear, structured analysis by star formations and timelines — <strong>strictly zero fear-mongering</strong>.',
    proTitle: 'VIP Pro Deep Reading',
    proPrice: '119,000 VND',
    proDesc: 'Detailed 3-Palace Annual Transit & 4-Season forecast (~2,500 words) + Face & Palm analysis + 🎁 02 VIP AI questions.',
    expTitle: 'Grandmaster Expert Reading (12 Palaces)',
    expPrice: '269,000 VND',
    expDesc: 'Comprehensive ~5,000-word breakdown of all 12 Palaces + Month-by-month roadmap (Lunar Months 1–12) + 🎁 02 Expert AI questions.',
  },
  zh: {
    badge1: '2026 – 2027 三重流年运限精批',
    badge2: 'VietQR 扫码 24/7 全自动解锁',
    h1Part1: '全方位解码 ',
    h1Part2: ' 流年运限三大核心宫位：小限 • 流年大限 • 流太岁',
    introHtml:
      '推算流年若只看单一宫位，便会遗漏三分之二的命局信息。<strong class="text-amber-300">孙老师 (Thầy Tôn)</strong> 系统在 108+ 星曜命盘上同步参看<strong class="text-white">三大独立运限宫位</strong>并结合<strong class="text-white">面相手相学</strong>，为您精准指明财运、事业、置业与家道的进退时机：',
    c1Title: '小限宫',
    c1Sub: '内心动向与诉求',
    c1Desc: '洞察您在流年中发自内心的思考、焦虑或寻求突破的渴望。',
    c2Title: '流年大限宫',
    c2Sub: '十年大运落点',
    c2Desc: '直指本年度受十年大运影响最核心的领域（财帛、田宅、官禄或家庭）。',
    c3Title: '流太岁宫',
    c3Sub: '客观环境与结果',
    c3Desc: '综合流年飞星，锁定现金流、商业合同、贵人助力与健康的最终结果。',
    ctaBtn: '立即输入生辰八字解码运限',
    ctaNote: '✓ 逻辑实证，拒绝迷信恐吓 • 永久保存命盘手帐与导出 PDF',
    authorLabel: '算法研发与学术审定',
    authorName: '孙老师 (Trần Huy Tôn)',
    authorExp: '18+ 年紫微斗数、相法与实战风水研究经验',
    bio1Html: '河内综合大学<strong>数学与信息学特长班</strong>校友。',
    bio2Html: '<strong>英国兰卡斯特大学 (Lancaster University，全英前五)</strong> 会计与金融学士及硕士。',
    bio3Html: '按星曜格局与时间轴条理剖析 — <strong>绝不恐吓迷信</strong>。',
    proTitle: 'VIP Pro 深度精批版',
    proPrice: '119,000 VND',
    proDesc: '详解三大流年运限宫位与四季吉凶（约 2,500 字）+ 面相手相合参 + 🎁 赠送 02 次 VIP 问答。',
    expTitle: '大宗师 Expert 十二宫全解版',
    expPrice: '269,000 VND',
    expDesc: '约 5,000 字深度剖析全部十二宫位 + 农历一至十二月逐月运势指南 + 🎁 赠送 02 次专家级问答。',
  },
  ko: {
    badge1: '2026 – 2027 3중 유년 운한 정밀 해독',
    badge2: 'VietQR 스캔 즉시 24/7 자동 잠금 해제',
    h1Part1: '소한 • 유년대한 • 유태세 3대 궁위로 해독하는 ',
    h1Part2: ' 한 해 운세',
    introHtml:
      '한 해의 운세를 볼 때 단 하나의 궁만 보면 전체 그림의 2/3를 놓치게 됩니다. <strong class="text-amber-300">선생 톤(Thầy Tôn)</strong> 시스템은 108개 이상의 성요 명반에서 <strong class="text-white">3가지 독립 운한 궁위</strong>를 동시에 대조하고 <strong class="text-white">인상학(관상·수상)</strong>을 결합해 재물, 직업, 부동산, 가정의 진퇴 시기를 명확히 짚어냅니다:',
    c1Title: '소한궁 (小限宮)',
    c1Sub: '내면의 심리 & 욕구',
    c1Desc: '해당 연도에 내면에서 일어나는 생각, 고민, 돌파를 향한 열망을 읽어냅니다.',
    c2Title: '유년대한궁',
    c2Sub: '10년 대운의 핵심 낙점',
    c2Desc: '재백, 전택, 관록, 가도 등 올해 가장 큰 영향을 받는 핵심 영역을 정확히 지목합니다.',
    c3Title: '유태세궁 (流太歲)',
    c3Sub: '외부 환경 & 실제 결과',
    c3Desc: '유년 성요를 분석해 현금 흐름, 계약, 귀인, 건강에 대한 실질적인 결과를 도출합니다.',
    ctaBtn: '생년월일시 입력하고 지금 바로 해독하기',
    ctaNote: '✓ 논리적·실증적 분석, 미신 배제 • 평생 수첩 저장 및 PDF 내보내기',
    authorLabel: '알고리즘 설계 및 학술 감수',
    authorName: '선생 톤 (Trần Huy Tôn)',
    authorExp: '18년 이상 자미두수, 관상·수상 및 실전 풍수 연구',
    bio1Html: '하노이 종합대학교 <strong>수학·정보 영재반</strong> 출신.',
    bio2Html: '<strong>영국 랭커스터 대학교(Lancaster University, 영국 Top 5)</strong> 회계·재무학 학사 및 석사.',
    bio3Html: '성요 조합과 시간 흐름에 따른 체계적 풀이 — <strong>미신적 공포 조장 절대 배제</strong>.',
    proTitle: 'VIP Pro 심층 풀이본',
    proPrice: '119,000 VND',
    proDesc: '3대 운한 궁위 및 사계절 상세 풀이(약 2,500단어) + 관상·수상 결합 + 🎁 VIP AI 질문 2회 제공.',
    expTitle: '대종사 Expert 12궁 마스터본',
    expPrice: '269,000 VND',
    expDesc: '약 5,000단어 분량의 12궁 전체 정밀 분석 + 음력 1~12월 월별 상세 로드맵 + 🎁 전문가 AI 질문 2회 제공.',
  },
  ja: {
    badge1: '2026 – 2027年 三重流年運限の精密解読',
    badge2: 'VietQRスキャンで24時間365日即時ロック解除',
    h1Part1: '小限・流年大限・流太歳の3つの宮で解き明かす ',
    h1Part2: ' の年運',
    introHtml:
      '1年の運勢を見る際に1つの宮だけを見ると、全体の3分の2を見落とすことになります。<strong class="text-amber-300">トン先生 (Thầy Tôn)</strong> のシステムは、108以上の星曜命盤上の<strong class="text-white">3つの独立した運限宮</strong>を同時に照合し、<strong class="text-white">人相・手相学</strong>と組み合わせて財運・キャリア・不動産・家庭の進退時期を明確に示します：',
    c1Title: '小限宮',
    c1Sub: '内面の心理と願望',
    c1Desc: '対象年にあなたの内面から湧き上がる思考、悩み、飛躍への渇望を読み解きます。',
    c2Title: '流年大限宮',
    c2Sub: '10年大運の焦点',
    c2Desc: '財帛・田宅・官禄・家庭など、今年最も強い影響を受ける中核分野を的確に特定します。',
    c3Title: '流太歳宮',
    c3Sub: '外部環境と実際の結果',
    c3Desc: '流年星を分析し、キャッシュフロー、契約、貴人、健康に関する現実的な結果を導き出します。',
    ctaBtn: '生年月日・出生時刻を入力して今すぐ解読',
    ctaNote: '✓ 論理的・実証的、迷信なし • 命盤手帳への永久保存＆PDF出力対応',
    authorLabel: 'アルゴリズム設計・学術監修',
    authorName: 'トン先生 (Trần Huy Tôn)',
    authorExp: '紫微斗数・相法・実践風水の研究歴18年以上',
    bio1Html: 'ハノイ総合大学付属 <strong>数学・情報特進クラス</strong> 出身。',
    bio2Html: '<strong>英国ランカスター大学 (Lancaster University・英国トップ5)</strong> 会計・ファイナンス学士および修士。',
    bio3Html: '星の組み合わせと時間軸に基づく明快な鑑定 — <strong>迷信的な脅しは一切なし</strong>。',
    proTitle: 'VIP Pro 深層鑑定版',
    proPrice: '119,000 VND',
    proDesc: '3大運限宮と四季の詳細鑑定（約2,500語）＋顔相・手相分析＋🎁 VIP AI質問2回付き。',
    expTitle: '大宗師 Expert 12宮完全版',
    expPrice: '269,000 VND',
    expDesc: '約5,000語で全12宮を徹底解剖＋旧暦1〜12月の月別詳細ロードマップ＋🎁 専門AI質問2回付き。',
  },
};

export default function VanHanLandingHero() {
  const { language } = useLanguage();
  const c = HERO_I18N[language] || HERO_I18N.vi;

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
                  <span>{c.badge1}</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{c.badge2}</span>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold font-serif text-white leading-snug">
                {c.h1Part1}
                <span className="text-amber-400">2026 – 2027</span>
                {c.h1Part2}
              </h1>

              <p
                className="text-sm sm:text-base text-slate-200 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: c.introHtml }}
              />

              {/* 3 Thẻ Giải Mã Tam Hạn Dễ Hiểu */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="rounded-2xl bg-slate-950/75 border border-amber-500/30 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-300">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-[11px] text-amber-300">
                      1
                    </span>
                    <span>{c.c1Title}</span>
                  </div>
                  <div className="text-xs font-semibold text-white">{c.c1Sub}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.c1Desc}</p>
                </div>

                <div className="rounded-2xl bg-slate-950/75 border border-cyan-500/30 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-cyan-300">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-[11px] text-cyan-300">
                      2
                    </span>
                    <span>{c.c2Title}</span>
                  </div>
                  <div className="text-xs font-semibold text-white">{c.c2Sub}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.c2Desc}</p>
                </div>

                <div className="rounded-2xl bg-slate-950/75 border border-purple-500/30 p-3.5 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-purple-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-[11px] text-purple-300">
                      3
                    </span>
                    <span>{c.c3Title}</span>
                  </div>
                  <div className="text-xs font-semibold text-white">{c.c3Sub}</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.c3Desc}</p>
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
                <span>{c.ctaBtn}</span>
                <ArrowDown className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-300">{c.ctaNote}</span>
            </div>
          </div>

          {/* Cột Phải: Chân dung & Uy tín Học Thuật Thầy Tôn (Đồng bộ 100% ảnh Bài Ads 04) */}
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-2xl bg-slate-950/85 border border-amber-400/35 p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-xl">
              <div className="flex items-center gap-3.5">
                <img
                  src="/thay-ton.png"
                  alt={c.authorName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-amber-400/70 shadow-lg shrink-0"
                />
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                    {c.authorLabel}
                  </div>
                  <div className="text-lg sm:text-xl font-extrabold font-serif text-white">
                    {c.authorName}
                  </div>
                  <div className="text-xs text-emerald-300 font-semibold">
                    {c.authorExp}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-200 border-t border-slate-800/90 pt-3">
                <div className="flex items-start gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span dangerouslySetInnerHTML={{ __html: c.bio1Html }} />
                </div>
                <div className="flex items-start gap-2">
                  <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span dangerouslySetInnerHTML={{ __html: c.bio2Html }} />
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span dangerouslySetInnerHTML={{ __html: c.bio3Html }} />
                </div>
              </div>

              {/* Tóm tắt nhanh 2 Gói Chuyên Sâu */}
              <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-bold text-amber-300">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>{c.proTitle}</span>
                  </span>
                  <span className="font-extrabold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full">
                    {c.proPrice}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{c.proDesc}</p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-bold text-purple-300">
                    <Gem className="w-3.5 h-3.5 text-purple-400" />
                    <span>{c.expTitle}</span>
                  </span>
                  <span className="font-extrabold text-purple-200 bg-purple-500/20 border border-purple-400/35 px-2 py-0.5 rounded-full">
                    {c.expPrice}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">{c.expDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
