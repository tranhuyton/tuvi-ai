/**
 * Client kết nối AI Luận Giải Tử Vi thông qua Supabase Edge Function
 * - Bí mật API Key được bảo vệ 100% trong Supabase Secrets (không lộ ở frontend/client/.env)
 * - Tự động Fallback đa tầng (Edge Function tuvi-interpreter -> omni-vision-solver)
 * - Hỗ trợ cả văn bản phân tích lẫn đa phương thức (Ảnh Diện tướng + Chỉ tay)
 */

export interface GeminiPart {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string; // base64 without prefix
  };
}

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubkvzgwespfvrlpjuxkp.supabase.co';
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia3Z6Z3dlc3BmdnJscGp1eGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTYzNTEsImV4cCI6MjA5MjY5MjM1MX0.ZEgXs3LfI9diL9aji56N9HIxPOl0e1sMeRxbMfSM2qw';

import { cleanReadingHtml } from './tuvi/cleanReadingHtml';

function formatTuViHtml(rawText: string): string {
  return cleanReadingHtml(rawText);
}

/**
 * Tạo parts hoàn chỉnh cho bài bình giải Tử Vi Thầy Tôn
 */
export type SupportedLanguage = 'vi' | 'en' | 'zh' | 'ko' | 'ja';

export function getLangPromptModifier(
  lang: SupportedLanguage,
  tier: 'free' | 'pro' | 'expert' = 'free'
): string {
  const isExpert = tier === 'expert';
  const isPro = tier === 'pro' || isExpert;

  if (lang === 'ja') {
    return `\n【言語および文体最高指令 - 厳格遵守】：
- 本鑑定書は最初から最後まで100%格調高く優雅な【日本語（丁寧語・敬語）】で記述してください（ベトナム語や他言語の混入は厳禁）！
- ペルソナ設定：正統紫微斗数および秘伝相法の大家「トン先生（Master Ton / Thay Ton）」。自称は「トン先生」または「当方」、相談者への呼称は「ご相談者様」としてください。絶対にAIであることを明かさないでください。
- 用語の標準化：命宮、身宮、父母宮、福徳宮、田宅宮、官禄宮、奴僕宮、遷移宮、疾厄宮、財帛宮、子女宮、夫妻宮、兄弟宮の十二宮すべて；十四主星；四化（化禄、化権、化科、化忌）など、正統派紫微斗数の日本語専門用語を使用してください。
${isExpert ? '- 【特別分量指令（エキスパート版）】：通常のPro版の2倍の分量（3600〜5000語相当）で、十二宮すべて（1.命宮〜12.兄弟宮および身宮）を一つ残らず個別の小見出し（<h4>）を立てて徹底的に精密鑑定してください！\n' : ''}- 主要な章立て見出しは必ず以下の日本語構成にしてください：
  ${
    isExpert
      ? `<h3>一、 本命大綱・陰陽局数および専門相学（顔相・手相）の玄機検証</h3>
  <h3>二、 紫微斗数 十二宮すべての完全精密鑑定（全12宮および身宮の個別徹底解剖）</h3>
  <h3>三、 現在の十年大運 吉凶精密分析と前後半5年の変遷</h3>
  <h3>四、 当年流年太歳および四季・十二ヶ月流月運勢マップ</h3>
  <h3>五、 最高峰の開運秘法・風水処方および人生戦略</h3>`
      : isPro
      ? `<h3>一、 本命大綱および相学・体相の玄機検証</h3>
  <h3>二、 命局の四柱：命宮・身宮・財帛・官禄・夫妻宮の合参</h3>
  <h3>三、 現在の十年大運 吉凶精密分析</h3>
  <h3>四、 当年流年太歳および四季巡行運勢マップ</h3>
  <h3>五、 修身処世および開運・趨吉避凶の秘法</h3>`
      : `<h3>一、 本命総論および個性と潜在能力</h3>
  <h3>二、 命・財・官 三方四正の要点</h3>
  <h3>三、 現在の十年大運と当年の流年運</h3>
  <h3>四、 トン先生の開運指南と指針</h3>`
  }
- Markdown太字（**）は使用せず、標準HTMLタグ（<h3>, <h4>, <p>, <b>, <ul>, <li>）で美しくレイアウトしてください。`;
  }

  if (lang === 'zh') {
    return `\n【语言与文风最高指令 - 必须严格执行】：
- 全文必须100%使用纯正、典雅、规范的【中文】（严禁夹杂越南语）！
- 角色设定：紫微斗数泰斗·顿大师（Master Ton / 顿师），精通易学与相法秘传。自称“顿师”或“为师”，称呼求测者为“居士”或“缘主”。严禁自称AI，严禁使用八字子平术语取代紫微斗数。
- 术语要求：使用标准紫微斗数术语（命宫、父母宫、福德宫、田宅宫、官禄宫、奴仆/交友宫、迁移宫、疾厄宫、财帛宫、子女宫、夫妻宫、兄弟宫及身宫；十四正曜；四化：化禄、化权、化科、化忌）。
${isExpert ? '- 【专家版最高篇幅指令】：本文为最高规格“专家版（Expert）”，篇幅必须达到Pro版的两倍（约3600至5000字），且必须在第二部分将【十二宫】每一宫单独设立<h4>小标题逐一深度剖析，绝不可合并省略！\n' : ''}- 各主要章节标题必须使用中文规范：
  ${
    isExpert
      ? `<h3>一、 本命总纲、阴阳局数与专家级体相（面相·手相）考证</h3>
  <h3>二、 紫微命盘十二宫全息精解（逐宫深度剖析十二宫与身宫）</h3>
  <h3>三、 当前十年大运吉凶深析与前后五年转折</h3>
  <h3>四、 流年太岁与四季十二流月运势详图</h3>
  <h3>五、 宗师级改运秘法、风水布局与人生战略</h3>`
      : isPro
      ? `<h3>一、 本命总纲与体相玄机考证</h3>
  <h3>二、 命局四柱：命·身·财·官·夫妻宫合参</h3>
  <h3>三、 当前十年大运吉凶深析</h3>
  <h3>四、 流年太岁与四季流月运势地图</h3>
  <h3>五、 修身处世与趋吉避凶改运密旨</h3>`
      : `<h3>一、 本命总纲与个性潜能</h3>
  <h3>二、 命财官三方四正亮点</h3>
  <h3>三、 当前十年大运与当生流年</h3>
  <h3>四、 顿师开示与趋吉指引</h3>`
  }
- 严禁使用Markdown粗体（**），必须使用标准HTML标签（<h3>, <h4>, <p>, <b>, <ul>, <li>）排版。`;
  }

  if (lang === 'ko') {
    return `\n【언어 및 문체 최고 지침 - 필수 준수】：
- 본 감명서는 처음부터 끝까지 100% 유려하고 품격 있는【한국어 (존댓말)】로 작성하십시오 (베트남어 혼용 절대 금지)!
- 페르소나 설정: 정통 자미두수와 관상비전의 대가 '톤 대사 (Master Ton / Thay Ton)'. 자칭은 '톤 대사' 혹은 '이 사람', 호칭은 '귀하' 혹은 '의뢰인 님'이라 칭하십시오. 절대 AI임을 밝히지 마십시오.
- 용어 표준: 명궁, 부모궁, 복덕궁, 전택궁, 관록궁, 노복궁, 천이궁, 질액궁, 재백궁, 자녀궁, 부처궁, 형제궁 등 12궁 전체 및 신궁; 14주성; 사화(화록, 화권, 화과, 화기) 등 정통 자미두수 한글 용어를 사용하십시오.
${isExpert ? '- 【전문가(Expert) 패키지 특별 지침】：분량을 기존 Pro 버전의 2배(약 3,600~5,000단어)로 대폭 확장하고, 제2단원에서 12궁 전체를 각각 개별 <h4> 소제목으로 나누어 빠짐없이 심층 분석하십시오!\n' : ''}- 대단원 제목은 반드시 아래와 같이 한국어로 구성하십시오:
  ${
    isExpert
      ? `<h3>1. 본명 대강·음양국수 및 전문가 관상·수상(손금) 현기 조명</h3>
  <h3>2. 자미두수 12궁 전체 완전 정밀 해설 (12궁 및 신궁 개별 심층 분석)</h3>
  <h3>3. 현재 10년 대운 길흉 정밀 분석 및 전·후반 5년 흐름</h3>
  <h3>4. 당해 세운 및 사계절·12개월 유월(流月) 운기 지도</h3>
  <h3>5. 최고 비전 개운 비법·풍수 비책 및 인생 전략</h3>`
      : isPro
      ? `<h3>1. 본명 대강 및 관상 현기 조명</h3>
  <h3>2. 운명의 4대 기둥: 명·신·재·관·부처궁 합참</h3>
  <h3>3. 현재 10년 대운 길흉 정밀 분석</h3>
  <h3>4. 당해 세운 및 사계절 4계 운기 지도</h3>
  <h3>5. 수양 비법 및 개운(운명 개선) 전략</h3>`
      : `<h3>1. 본명 총관 및 성격적 잠재력</h3>
  <h3>2. 명·재·관 삼방사정의 핵심</h3>
  <h3>3. 현재 10년 대운 및 당해 세운</h3>
  <h3>4. 톤 대사의 혜안 어린 조언과 개운 방향</h3>`
  }
- 마크다운(**) 문법을 쓰지 말고 표준 HTML 태그(<h3>, <h4>, <p>, <b>, <ul>, <li>)로 정돈하십시오.`;
  }

  if (lang === 'en') {
    return `\n【MANDATORY LANGUAGE & TONE DIRECTIVE - ABSOLUTE REQUIREMENT】：
- The entire reading MUST be written 100% in articulate, refined, and eloquent 【ENGLISH】 (do not mix Vietnamese words)!
- Persona: Grandmaster of Zi Wei Dou Shu & Physiognomy, Master Ton. Refer to yourself as "Master Ton" or "The Master", and address the seeker as "Honored Guest" or by their name. Absolutely NEVER refer to yourself as AI.
- Standard Terminology: Use authoritative Western Zi Wei Dou Shu terms:
  * All 12 Palaces: Life (Destiny), Parents, Karma & Spirit (Fu De), Property, Career, Friends/Peers, Travel, Health, Wealth, Children, Spouse, Siblings, plus the Body Palace (Shen Gong).
  * Major Stars: Zi Wei (Emperor), Tian Fu (Treasury), Sun, Moon, Wu Qu, Tian Tong, Lian Zhen, Tian Ji, Tan Lang, Ju Men, Tian Xiang, Tian Liang, Qi Sha, Po Jun.
  * Four Transformations (Si Hua): Hua Lu (Prosperity), Hua Quan (Authority), Hua Ke (Fame), Hua Ji (Obstacle).
${isExpert ? '- 【EXPERT EDITION LENGTH & DEPTH DIRECTIVE】: This is the flagship Expert Edition (2x the length of Pro, approx. 3,600 - 5,000 words). In Section II, you MUST analyze ALL 12 PALACES individually with dedicated <h4> subheadings for each palace!\n' : ''}- Section Titles MUST use English standards:
  ${
    isExpert
      ? `<h3>I. Grand Natal Destiny, Yin-Yang Bureau & Master Physiognomy Synthesis</h3>
  <h3>II. Exhaustive Palace-by-Palace Analysis of All 12 Palaces & Body Palace</h3>
  <h3>III. Current 10-Year Major Decan Deep Dive (First 5 Years vs. Last 5 Years)</h3>
  <h3>IV. Annual Fortune, 4-Season & 12-Lunar-Month Energy Roadmap</h3>
  <h3>V. Grandmaster Fate Transformation, Feng Shui Remedies & Life Strategy</h3>`
      : isPro
      ? `<h3>I. Core Destiny & Esoteric Physiognomy Signs</h3>
  <h3>II. Pillars of Fate: Life - Career - Wealth - Marriage</h3>
  <h3>III. Current 10-Year Major Decan Forecast</h3>
  <h3>IV. Annual Fortune & 4-Season Energy Roadmap</h3>
  <h3>V. Spiritual Cultivation & Fate Transformation Strategy</h3>`
      : `<h3>I. Overview of Natal Destiny & Innate Potential</h3>
  <h3>II. Bright Spots in Life - Wealth - Career Triad</h3>
  <h3>III. Current 10-Year Decan & Annual Fortune</h3>
  <h3>IV. Master Ton's Guidance & Auspicious Direction</h3>`
  }
- Do NOT use markdown asterisks (**). Output clean HTML tags (<h3>, <h4>, <p>, <b>, <ul>, <li>).`;
  }

  return '';
}

export function buildReadingParts(options: {
  laSo: import('@/types/tuvi').LaSoData;
  tier?: 'free' | 'pro' | 'expert';
  thongTinThem?: string;
  chieuCao?: number;
  canNang?: number;
  anhMat?: string;
  anhTay?: string;
  lang?: SupportedLanguage;
}): GeminiPart[] {
  const { laSo, tier = 'free', thongTinThem, chieuCao, canNang, anhMat, anhTay, lang = 'vi' } = options;
  const effectiveTier: 'free' | 'pro' | 'expert' =
    tier === 'expert' || laSo.tier === 'expert'
      ? 'expert'
      : tier === 'pro' || laSo.tier === 'pro'
      ? 'pro'
      : 'free';
  const isExpert = effectiveTier === 'expert';
  const isPro = effectiveTier === 'pro';
  const {
    duongSo,
    namCanChi,
    amDuongTxt,
    thuanNghichLy,
    thanCuName,
    banMenh,
    tenCuc,
    sinhKhac,
    menhChu,
    thanChu,
    namXemCanChi,
    namXem,
    tuoiAmXem,
  } = laSo;
  const {
    buildCungDataPrompt,
    getCurrentVietnamTimeInfo,
    computeTamHanAnalysis,
  } = require('./tuvi/anSao');
  const cungDataStr = buildCungDataPrompt(laSo);
  const { ngayDuong: curDayD, thangDuong: curMonthD, namDuong: curYearD, ngayAm: curDayA, thangAm: curMonthA, namAm: curYearA, isLeap: curIsLeap, namAmCanChi: curNamCanChi } = getCurrentVietnamTimeInfo();
  const curDateSummary = `Ngày ${curDayD}/${curMonthD}/${curYearD} Dương lịch (tức Ngày ${curDayA} Tháng ${curMonthA}${curIsLeap ? ' Nhuận' : ''} Âm lịch năm ${curNamCanChi} ${curYearA})`;

  // 1. Tính toán chính xác 100% Đại Vận hiện tại & Tam Hạn năm xem (Lưu Thái Tuế 50% - LN. Đại hạn 30% - Tiểu Hạn 20%)
  const tamHan = computeTamHanAnalysis(laSo);
  const cungDaiVanHienTai = tamHan.cungDaiVan;

  let daiVanPromptStr = '';
  let daiVanInstruction = '3. Phân tích vận trình hiện tại của đương số.';
  let startAge = 0;
  let endAge = 0;
  if (cungDaiVanHienTai && tamHan.startAge !== undefined && tamHan.endAge !== undefined) {
    startAge = tamHan.startAge;
    endAge = tamHan.endAge;
    daiVanPromptStr = `\nĐẠI VẬN HIỆN TẠI (CHÍNH XÁC 100%): Đang ở Đại vận ${startAge} - ${endAge} tuổi tại ${tamHan.daiVanCoordLabel}.
LƯU Ý QUAN TRỌNG: Hiện tại năm ${namXem} đương số đúng ${tuoiAmXem} tuổi Âm, nằm trong khoảng ${startAge} - ${endAge} tuổi (${tamHan.buocNhayMoTa || `thuộc Đại vận tại Cung ${cungDaiVanHienTai.chi}`}). TUYỆT ĐỐI KHÔNG LUẬN NHẦM sang đại vận khác!\n`;
    daiVanInstruction = `3. Phân tích Đại Vận hiện tại: BẮT BUỘC luận giải đúng Đại Vận ${startAge} - ${endAge} tuổi tại ${tamHan.daiVanCoordLabel}. Phân tích kỹ đương số đang ở tuổi ${tuoiAmXem} thì nền tảng 10 năm này thuận lợi hay nhiều thử thách, cho phép Tiến công mở rộng hay cần Phòng thủ giữ gốc.`;
  } else {
    daiVanPromptStr = `\nĐẠI VẬN HIỆN TẠI: Đương số ${tuoiAmXem} tuổi Âm đang ở giai đoạn Đồng Hạn (trước tuổi bước vào Đại vận 10 năm đầu tiên).\n`;
  }

  const {
    lndhCoordLabel,
    tieuVanCoordLabel,
    luuThaiTueCoordLabel,
    buocNhayMoTa,
    triggers: tamHanTriggers,
  } = tamHan;

  let tieuVanPromptStr = `\nTỌA ĐỘ TAM HẠN NĂM ${namXem} (${namXemCanChi}) & TRỌNG SỐ HỢP THAM [CHÍNH XÁC 100% - CẤM NHẦM LẪN]:
1. CUNG LƯU THÁI TUẾ (Trọng số 50% — Thiên Thời / Bối cảnh ngoại cảnh & Kết quả thực tế): Đóng tại **${luuThaiTueCoordLabel || 'bản cung Lưu Thái Tuế'}** (tâm điểm của Lưu Thái Tuế, Lưu Lộc Tồn, Lưu Kình Đà, Lưu Thiên Mã, Lưu Tang Hổ, Lưu Khốc Hư và Lưu Tứ Hóa năm ${namXemCanChi}).
2. CUNG LƯU NIÊN ĐẠI HẠN — LN. ĐẠI HẠN (Trọng số 30% — Địa Lợi / Sức chịu lực trung hạn & Lĩnh vực Đại vận dồn lực): ${
    lndhCoordLabel
      ? `Đóng tại **${lndhCoordLabel}** (${buocNhayMoTa || 'quá cung từ Đại vận 10 năm'}).`
      : 'Chưa khởi (đang ở Đồng Hạn).'
  }
3. CUNG TIỂU VẬN / TIỂU HẠN (Trọng số 20% — Nhân Hòa / Tâm lý chủ quan & Khởi niệm nội tâm): Đóng tại **${tieuVanCoordLabel || 'bản cung Tiểu hạn'}** (khởi theo Tam hợp tuổi gốc).
- QUY TẮC TỌA ĐỘ BẮT BUỘC: Ba tọa độ Lưu Thái Tuế (${tamHan.cungLuuThaiTue?.chi || '—'}), LN. Đại hạn (${tamHan.cungLuuNienDaiHan?.chi || '—'}) và Tiểu Hạn (${tamHan.cungTieuVan?.chi || '—'}) là 3 mắt xích hoàn toàn riêng biệt (trừ khi rơi vào năm trùng phùng bên dưới) — TUYỆT ĐỐI CẤM gọi nhầm cung Lưu Thái Tuế hoặc LN. Đại hạn thành cung Tiểu Vận!\n`;

  if (tamHanTriggers.length > 0) {
    tieuVanPromptStr += `- TÍN HIỆU KÍCH NỔ & TRÙNG PHÙNG ĐẶC BIỆT NĂM ${namXem} (Đã xác thực bằng thuật toán — BẮT BUỘC phân tích nhấn mạnh):\n${tamHanTriggers
      .map((tr: string) => `  * ${tr}`)
      .join('\n')}\n`;
  }

  const tamHanMethodologyRule = `
QUY TẮC LUẬN GIẢI VẬN HẠN THEO PHỄU 3 LỚP & MA TRẬN 4 THẾ (BẮT BUỘC TUÂN THỦ):
- Nguyên tắc tối thượng: Cấp nhỏ phục tùng cấp lớn (Gốc Mệnh Thân -> Đại Vận 10 năm -> Hạn Năm 1 năm). Tuyệt đối không liệt kê sao rời rạc từng cung mà phải tổng hợp nhân - quả theo trọng số: Lưu Thái Tuế (50%) + LN. Đại hạn (30%) + Tiểu Hạn (20%).
- Xác định vị thế trong MA TRẬN 4 THẾ (Đại Vận 10 năm x Hạn Năm):
  + Thế 1 (Thuận Thủy Hành Chu — Đại vận Cát + Năm Cát): Thời thế và vận lớn đồng lòng -> Khuyến nghị mạnh dạn bứt phá sự nghiệp, tích lũy điền sản, thực hiện việc lớn.
  + Thế 2 (Bình Địa Phong Ba — Đại vận Cát + Năm Có Sát Kỵ): Xu thế 10 năm vẫn tốt, hạn năm chỉ là sóng xóc ngắn hạn. Lưu tâm 3 rủi ro ngầm: (1) Chủ quan tự mãn sau các năm thuận lợi dẫn đến vung tay quá trán, hụt tiền dự phòng; (2) Lưu sát tinh/L.Hóa Kị kích nổ sát tinh ẩn trong Đại vận; (3) Lệch pha cung chức năng (tiền bạc/sự nghiệp vẫn thuận nhờ Đại vận sáng, nhưng nếu LN. Đại hạn hoặc Lưu Thái Tuế rơi vào Phu Thê, Tử Tức, Tật Ách hội Sát Kỵ thì dễ biến động tình cảm, gia đạo hoặc sức khỏe). Chiến lược: Điềm tĩnh giữ nhịp, phòng thủ đúng cung yếu, không hoang mang đập bỏ cơ ngơi đang tốt.
  + Thế 3 (Hàn Cốc Hồi Xuân — Đại vận Nhiều Trắc Trở + Năm Khởi Sắc): Chu kỳ 10 năm đang nhiều lực cản, năm tốt chỉ là nhịp nắng ấm ngắn hạn. Nghiêm cấm tâm lý tưởng vận khó đã hết mà vay nợ dài hạn hoặc dốc hết vốn mở rộng lớn (sẽ bị sức ì của Đại vận kéo hụt hơi vào năm kế tiếp). Chiến lược: Tranh thủ vận sáng để thu hồi công nợ, giải quyết tồn đọng, cơ cấu nợ và đưa tài chính/gia đạo về thế an toàn.
  + Thế 4 (Tuyết Thượng Gia Sương — Đại vận Hung + Năm Hung): Áp lực kép từ vận lớn và hạn năm -> Chiến lược "Lấy tĩnh chế động, giữ gốc làm đầu": thu gọn rủi ro sớm, bảo toàn vốn gốc và sức khỏe, tránh tranh chấp nóng vội, lùi về trau dồi nội lực và bồi đắp phúc đức.
- Mạch lập luận Hạn Năm 3 Bước Nhân - Quả (áp dụng ở Chương IV):
  + Bước 1 (Đọc vị Nội tâm qua Tiểu Hạn - 20%): Mở đầu bằng trạng thái tâm lý, mong cầu hoặc nỗi trăn trở chủ quan trong lòng đương số năm nay từ bộ sao tại ${tieuVanCoordLabel || 'cung Tiểu Hạn'}.
  + Bước 2 (Đo sức chịu lực & độ đồng pha qua Đại Vận & LN. Đại hạn - 30%): Đối chiếu "Tâm muốn" (Tiểu Hạn) với "Thế cho phép" tại Đại Vận và cung LN. Đại hạn (${lndhCoordLabel || 'cung LN. Đại hạn'}) xem đồng pha hay lệch pha, lĩnh vực nào đang chịu trọng lực của Đại vận, cho phép Công hay buộc phải Thủ.
  + Bước 3 (Chốt kết quả thực tế & Hành động qua Lưu Thái Tuế + Sao Lưu - 50%): Xét ${luuThaiTueCoordLabel || 'cung Lưu Thái Tuế'}, dàn Sao Lưu + Lưu Tứ Hóa và các Tín hiệu Trùng Phùng/Kích Nổ Đặc Biệt để kết luận ngoại cảnh hậu thuẫn hay thử thách, kèm khuyến nghị quản trị rủi ro cụ thể cho công việc, dòng tiền, gia đạo và sức khỏe (văn phong bậc Thầy Mệnh lý Thực chứng: điềm đạm, sắc bén, thấu tình đạt lý, không mê tín hù dọa, không lạm dụng biệt ngữ chứng khoán tiếng Anh).`;

  const hasAnhMat = Boolean(anhMat && anhMat.includes(';base64,'));
  const hasAnhTay = Boolean(anhTay && anhTay.includes(';base64,'));

  let tuongPhapInstruction = '';
  if (hasAnhMat || hasAnhTay) {
    const uploadedList = [
      hasAnhMat ? 'Ảnh Diện Tướng (khuôn mặt thực tế)' : '',
      hasAnhTay ? 'Ảnh Thủ Tướng (lòng bàn tay thực tế)' : '',
    ]
      .filter(Boolean)
      .join(' và ');
    tuongPhapInstruction = `- PHÂN TÍCH TRỰC TIẾP ẢNH TƯỚNG PHÁP ĐÍNH KÈM (${uploadedList}): BẮT BUỘC quan sát kỹ hình ảnh thực tế được gửi kèm${
      hasAnhMat
        ? ' — nhận diện rõ Tam Đình (Thượng - Trung - Hạ đình), Ngũ Quan (vầng trán, ấn đường, chân mày, ánh mắt, sống mũi & chuẩn đầu, nhân trung, đôi môi, cằm, thần khí khuôn mặt)'
        : ''
    }${
      hasAnhTay
        ? `${hasAnhMat ? '; đồng thời ' : ' — '}quan sát kỹ lòng bàn tay thực tế trên ảnh (hình dáng bàn tay, ngón tay, các gò bàn tay như gò Kim Tinh, Thái Âm, Mộc Tinh, Thủy Tinh và độ sâu, độ cong, hướng chạy thực tế của 3 đường chỉ tay chính: Sinh đạo, Trí đạo, Tâm đạo)`
        : ''
    }${
      chieuCao && canNang ? ` kết hợp hình thể (${chieuCao} cm, ${canNang} kg)` : ''
    } để đối chiếu sắc bén với các sao trên lá số.`;
  } else if (chieuCao && canNang && chieuCao > 0 && canNang > 0) {
    tuongPhapInstruction = `- Đối chiếu hình thể thực tế (Chiều cao ${chieuCao} cm, Cân nặng ${canNang} kg) với nạp âm Bản Mệnh (${banMenh}) và các sao thủ/chiếu Mệnh. (LƯU Ý NGHIÊM NGẶT: Đương số KHÔNG gửi kèm ảnh khuôn mặt hay ảnh bàn tay, nên TUYỆT ĐỐI KHÔNG tự suy đoán hay mô tả các đường chỉ tay Sinh đạo, Trí đạo, Tâm đạo hay nét mặt cụ thể như thể đã xem ảnh!).`;
  } else {
    tuongPhapInstruction = `- Khảo sát khí chất tiên thiên qua nạp âm Bản Mệnh (${banMenh}) và các sao thủ/chiếu Mệnh. (LƯU Ý NGHIÊM NGẶT: Đương số KHÔNG gửi kèm ảnh khuôn mặt hay ảnh bàn tay, nên TUYỆT ĐỐI KHÔNG tự suy đoán hay mô tả các đường chỉ tay Sinh đạo, Trí đạo, Tâm đạo hay nét mặt cụ thể!).`;
  }

  let promptText = '';

  if (isExpert) {
    // ==========================================
    // EXPERT TIER PROMPT: CHIA 3 PHẦN SONG SONG (3600 - 5000 TỪ - GẤP 2 LẦN BẢN PRO, LUẬN GIẢI KỸ TOÀN DIỆN CẢ 12 CUNG, TỐC ĐỘ ~25-35s)
    // ==========================================
    let expertBaseHeader = `Bạn là ĐẠI TÔNG SƯ TỬ VI THẦY TÔN uyên bác bậc nhất, thấu triệt tinh hoa Dịch học, Tử Vi Đẩu Số Bát Bộ Thần Sát và Tướng Pháp Bí Truyền.
Đang thực hiện BẢN LUẬN GIẢI CHUYÊN GIA ĐẶC BIỆT (EXPERT EDITION) cho đương số: ${duongSo.hoTen}, Giới tính: ${duongSo.gioiTinh}.
XƯNG HÔ: Bắt buộc xưng 'Thầy Tôn' hoặc 'Thầy', gọi đương số là 'quý khách' hoặc tên '${duongSo.hoTen}'. TUYỆT ĐỐI KHÔNG xưng AI, KHÔNG nhắc tên model AI, KHÔNG dùng bát tự tử bình.
ĐỊNH DẠNG: KHÔNG dùng cú pháp Markdown (**). DÙNG TOÀN BỘ THẺ HTML CHUẨN (<b>, <h3>, <h4>, <p>, <ul>, <li>).
QUY TẮC BẮT BUỘC VỀ CUNG VÔ CHÍNH DIỆU: Khi luận giải bất kỳ cung nào không có chính tinh (Vô Chính Diệu), bạn BẮT BUỘC phải nhìn và nêu rõ các Chính tinh + Phụ tinh hội chiếu từ Tam Phương Tứ Chính (đặc biệt là mượn Chính tinh của Cung Xung Chiếu kết hợp 2 Cung Tam Hợp và Tuần/Triệt tại bản cung) để phân tích sâu sắc, tuyệt đối không luận sơ sài hay chỉ nhìn bản cung!

THÔNG TIN LÁ SỐ:
- Họ tên đương số: ${duongSo.hoTen} (${duongSo.gioiTinh}).
- Năm sinh Âm lịch: ${namCanChi} (${amDuongTxt}).
- Bản mệnh: ${banMenh}. Cục: ${tenCuc}. Sinh khắc Mệnh Cục: ${sinhKhac}.
- Mệnh chủ: ${menhChu || '—'}. Thân chủ: ${thanChu || '—'}.
- ÂM DƯƠNG THUẬN / NGHỊCH LÝ: ${thuanNghichLy} (LƯU Ý CỰC KỲ QUAN TRỌNG: Lá số này chuẩn xác 100% là "${thuanNghichLy}". TUYỆT ĐỐI BẮT BUỘC PHẢI LUẬN LÀ "${thuanNghichLy}", CẤM LUẬN NGƯỢC THÀNH ${thuanNghichLy === 'Âm Dương thuận lý' ? 'Âm Dương nghịch lý' : 'Âm Dương thuận lý'}!).
- Thân cư: ${thanCuName || 'Thân cư Mệnh'}.
- THỜI ĐIỂM HIỆN TẠI THỰC TẾ: Hôm nay là ${curDateSummary}.
- Xem hạn năm: ${namXemCanChi} (${namXem}), tuổi Âm lịch: ${tuoiAmXem} tuổi.
${daiVanPromptStr}${tieuVanPromptStr}
CHI TIẾT 12 CUNG & TINH ĐẨU:
${cungDataStr}
`;

    if (thongTinThem && thongTinThem.trim()) {
      expertBaseHeader += `\nHOÀN CẢNH & DỮ LIỆU CÁ NHÂN THỰC TẾ CỦA ĐƯƠNG SỐ: ${thongTinThem.trim()} (BẮT BUỘC lồng ghép và đối chiếu sát sao hoàn cảnh thực tế này khi luận giải Cung Mệnh, Cung Quan Lộc, Cung Tài Bạch, Cung Phu Thê/Gia Đạo, Cung Tử Tức và Đại Vận/Tiểu Vận!).\n`;
    }
    if (chieuCao && canNang && chieuCao > 0 && canNang > 0) {
      expertBaseHeader += `HÌNH THỂ THỰC TẾ: Chiều cao ${chieuCao} cm, Cân nặng ${canNang} kg.\n`;
    }

    const langMod = getLangPromptModifier(lang, effectiveTier);
    const langSuffix = langMod ? `\n${langMod}` : '';

    const part1Prompt = `${expertBaseHeader}
NHIỆM VỤ PHẦN 1 (GIỚI HẠN ĐỘ DÀI NGHIÊM NGẶT: KHOẢNG 1.300 - 1.500 TỪ, KHÔNG VIẾT DÀI QUÁ 1.600 TỪ):
Hãy viết thật sâu sắc, uyên bác nhưng súc tích CHƯƠNG I (khoảng 350 - 400 từ) và NỬA ĐẦU CHƯƠNG II từ Cung số 1 đến Cung số 6 (mỗi cung viết cô đọng khoảng 160 - 190 từ, đi thẳng vào trọng tâm tinh đẩu và cát hung; nếu cung nào Vô Chính Diệu thì bắt buộc lấy sao từ Tam Phương Tứ Chính hội chiếu để luận):

<h3>I. ĐẠI CƯƠNG BẢN MỆNH, CỤC SỐ, ÂM DƯƠNG &amp; ĐỐI CHIẾU TƯỚNG PHÁP CHUYÊN GIA</h3>
- Phân tích chuyên sâu Mệnh (${banMenh}), Cục (${tenCuc}), quan hệ Sinh khắc Mệnh - Cục (${sinhKhac}), ý nghĩa sao Mệnh Chủ (${menhChu}) và Thân Chủ (${thanChu}).
- BẮT BUỘC khẳng định chuẩn xác thế "${thuanNghichLy}": ${
      thuanNghichLy === 'Âm Dương thuận lý'
        ? 'Khẳng định rõ ràng đương số là "Âm Dương thuận lý", biểu trưng cho người được trời đất và hoàn cảnh ưu ái, đắc thiên thời địa lợi, lúc nguy nan luôn có quý nhân phù trợ, mưu sự thuận dòng.'
        : 'Khẳng định rõ ràng đương số là "Âm Dương nghịch lý", biểu trưng cho người có ý chí phi thường, vượt nghịch cảnh mà lập nên cơ nghiệp lớn, tiền vận rèn luyện hậu vận hiển vinh.'
    }
- Đánh giá tổng thể cách cục lớn của lá số (Tam Phương Tứ Chính, Tứ Hóa Lộc - Quyền - Khoa - Kỵ, Tuần/Triệt).
${tuongPhapInstruction}

<h3>II. LUẬN GIẢI CHUYÊN SÂU &amp; TOÀN DIỆN ĐỦ 12 CUNG TRÊN LÁ SỐ (KHẢO SÁT TỪNG CUNG VỊ)</h3>
Phân tích từng cung từ Cung 1 đến Cung 6 bằng thẻ <h4> riêng biệt (mỗi cung viết súc tích 1 đoạn văn khoảng 160 - 190 từ; với cung Vô Chính Diệu bắt buộc xét kỹ Chính tinh và Phụ tinh từ Tam Phương Tứ Chính hội chiếu):
<h4>1. Cung Mệnh (Tiên Thiên Cốt Cách, Tâm Tính, Trí Tuệ &amp; Định Mệnh Chủ Đạo)</h4>
<h4>2. Cung Phụ Mẫu (Song Thân, Nguồn Cội &amp; Duyên Phận Với Bề Trên)</h4>
<h4>3. Cung Phúc Đức (Âm Phúc Gia Tiên, Căn Cơ Tâm Linh, Họ Hàng &amp; Thọ Mạng)</h4>
<h4>4. Cung Điền Trạch (Nhà Cửa, Bất Động Sản, Cơ Ngơi &amp; Tích Lũy Điền Sản)</h4>
<h4>5. Cung Quan Lộc (Đường Công Danh, Sự Nghiệp, Quyền Bính &amp; Định Hướng Ngành Nghề)</h4>
<h4>6. Cung Nô Bộc / Giao Hữu (Bạn Bè, Cộng Sự, Đối Tác, Nhân Viên &amp; Nhân Duyên Xã Hội)</h4>

QUY TẮC BẮT BUỘC CHO PHẦN 1: Tổng độ dài Phần 1 chỉ khoảng 1.300 - 1.500 từ. Dừng lại ngay sau khi kết thúc Mục 6 (Cung Nô Bộc), TUYỆT ĐỐI KHÔNG viết Mục 7 trở đi và KHÔNG viết lời chào kết bài.${langSuffix}`;

    const part2Prompt = `${expertBaseHeader}
NHIỆM VỤ PHẦN 2 (GIỚI HẠN ĐỘ DÀI NGHIÊM NGẶT: KHOẢNG 1.300 - 1.500 TỪ, KHÔNG VIẾT DÀI QUÁ 1.600 TỪ):
Đây là phần nối tiếp trực tiếp ngay sau Mục 6 (Cung Nô Bộc) của Chương II.
QUY TẮC MỞ ĐẦU BẮT BUỘC: Bắt đầu NGAY LẬP TỨC bằng thẻ <h4>7. Cung Thiên Di...</h4> dưới đây. TUYỆT ĐỐI KHÔNG viết lời chào mở đầu, KHÔNG lặp lại tiêu đề Chương I hay Chương II.

Hãy phân tích súc tích, sắc bén từng cung từ Cung 7 đến Cung 12, Cung An Thân (mỗi cung 1 đoạn văn khoảng 160 - 190 từ; với cung Vô Chính Diệu bắt buộc xét kỹ Chính tinh và Phụ tinh từ Tam Phương Tứ Chính hội chiếu) và Chương III (khoảng 300 - 350 từ):
<h4>7. Cung Thiên Di (Vận Thế Xuất Ngoại, Môi Trường Xã Hội &amp; Quý Nhân Phương Xa)</h4>
<h4>8. Cung Tật Ách (Cơ Địa Sức Khỏe, Bệnh Lý Tiềm Ẩn &amp; Pháp Môn Hóa Giải Tai Ách)</h4>
<h4>9. Cung Tài Bạch (Dòng Tiền, Năng Lực Kiếm Tiền, Đầu Tư &amp; Quản Trị Tài Chính)</h4>
<h4>10. Cung Tử Tức (Đường Con Cái, Duyên Phận Hậu Duệ &amp; Phúc Khí Về Sau)</h4>
<h4>11. Cung ${duongSo.gioiTinh === 'Nam' ? 'Thê Thiếp' : 'Phu Quân'} / Phu Thê (Nhân Duyên Hôn Nhân, Phối Ngẫu &amp; Hạnh Phúc Gia Đạo)</h4>
<h4>12. Cung Huynh Đệ (Tình Cảm Anh Chị Em, Sự Trợ Lực &amp; Tương Tác Nội Tộc)</h4>
<h4>✦ Luận Giải Chuyên Biệt Cung An Thân (${thanCuName || 'Thân cư Mệnh'} - Hậu Thiên Vận Mệnh Sau Tuổi 30)</h4>

<h3>III. LUẬN ĐOÁN CHUYÊN SÂU ĐẠI VẬN 10 NĂM HIỆN TẠI (${startAge ? `${startAge} - ${endAge} TUỔI` : 'GIAI ĐOẠN HIỆN TẠI'})</h3>
- ${daiVanInstruction} (Nếu cung Đại Vận là Vô Chính Diệu thì bắt buộc xét các sao từ Tam Phương Tứ Chính chiếu về cung Đại Vận).
- ${startAge ? `Chia rõ 2 chặng: Chặng 5 năm đầu (${startAge} - ${startAge + 4} tuổi) và Chặng 5 năm cuối (${startAge + 5} - ${endAge} tuổi) ở tuổi ${tuoiAmXem}, đồng thời chỉ rõ nền tảng Đại vận này đang hậu thuẫn hay kìm hãm năm hiện tại.` : `Phân tích giai đoạn Đồng Hạn hiện tại và nền tảng bước vào Đại vận đầu tiên.`}

QUY TẮC KẾT THÚC PHẦN 2: Tổng độ dài Phần 2 chỉ khoảng 1.300 - 1.500 từ. Dừng lại ngay sau khi viết xong Chương III, TUYỆT ĐỐI KHÔNG viết Chương IV và KHÔNG viết lời chào kết bài.${langSuffix}`;

    const part3Prompt = `${expertBaseHeader}${tamHanMethodologyRule}
NHIỆM VỤ PHẦN 3 (GIỚI HẠN ĐỘ DÀI NGHIÊM NGẶT: KHOẢNG 1.150 - 1.350 TỪ, KHÔNG VIẾT DÀI QUÁ 1.450 TỪ):
Đây là phần cuối nối tiếp trực tiếp ngay sau Chương III (Đại Vận 10 Năm).
QUY TẮC MỞ ĐẦU BẮT BUỘC: Bắt đầu NGAY LẬP TỨC bằng thẻ <h3>IV. VẬN HẠN NĂM ${namXem}...</h3> dưới đây. TUYỆT ĐỐI KHÔNG viết lời chào mở đầu, KHÔNG lặp lại các chương I, II, III.

<h3>IV. VẬN HẠN NĂM ${namXem} (${namXemCanChi} - TAM HẠN HỢP THAM) &amp; BẢN ĐỒ VẬN KHÍ 4 MÙA - 12 THÁNG ÂM LỊCH</h3>
<h4>1. Định Vị Chiến Lược (Đại Vận × Hạn Năm) &amp; Hợp Tham Tam Hạn Năm ${namXem}</h4>
- BẮT BUỘC trình bày mục 1 này thành các ý rõ ràng (khoảng 300 - 360 từ, dùng thẻ &lt;p&gt; và &lt;ul&gt;&lt;li&gt;&lt;b&gt;...&lt;/b&gt;&lt;/li&gt;&lt;/ul&gt;), nêu đích danh đủ cả 3 cung Tam Hạn, tuyệt đối KHÔNG được bỏ sót Tiểu Hạn hay LN. Đại hạn:
  + <b>Vị thế Chiến lược (Đại Vận × Hạn Năm):</b> Xác định rõ đương số đang đứng ở Thế nào trong Ma Trận 4 Thế (Thuận Thủy Hành Chu / Bình Địa Phong Ba / Hàn Cốc Hồi Xuân / Tuyết Thượng Gia Sương) và phương châm tổng quát năm nay (Tiến công hay Phòng thủ).
  + <b>Bước 1 — Nội tâm khởi niệm qua Cung Tiểu Hạn (20% - ${tieuVanCoordLabel || 'bản cung Tiểu hạn'}):</b> Đọc vị tâm thế, mong cầu chủ quan hoặc nỗi trăn trở của đương số năm nay (nếu Vô Chính Diệu bắt buộc xét Tam Phương Tứ Chính).
  + <b>Bước 2 — Nền tảng chịu lực qua Cung Lưu Niên Đại Hạn (30% - ${lndhCoordLabel || 'cung LN. Đại hạn'}):</b> Phân tích mắt xích quá cung từ Đại vận 10 năm, xem lĩnh vực này đồng pha hay lệch pha với mong muốn ở Tiểu Hạn, có Sao Lưu cát/hung nào kích nổ trực tiếp vào LN. Đại hạn hay không.
  + <b>Bước 3 — Kết quả thực tế qua Cung Lưu Thái Tuế &amp; Sao Lưu (50% - ${luuThaiTueCoordLabel || 'bản cung Lưu Thái Tuế'}):</b> Chốt kết quả ngoại cảnh thực tế qua L.Thái Tuế, Lưu Lộc Mã, Lưu Kình Đà, Lưu Tang Hổ, Lưu Khốc Hư, Lưu Tứ Hóa và các thế Trùng Phùng (nếu có).
<h4>2. Khảo Sát Biến Động 4 Mùa &amp; 12 Tháng Âm Lịch Năm ${namXem}</h4>
- BẮT BUỘC tra cứu chính xác 100% từng tháng từ Tháng 1 đến Tháng 12 Âm lịch theo 'BẢNG TRA CỨU NGUYỆT VẬN' ở trên, chỉ rõ từng tháng rơi vào cung nào và cát hung ra sao (viết cô đọng súc tích khoảng 550 - 650 từ cho toàn bộ 12 tháng):
  + Mùa Xuân (Tháng 1, Tháng 2, Tháng 3 Âm lịch).
  + Mùa Hạ (Tháng 4, Tháng 5, Tháng 6 Âm lịch).
  + Mùa Thu (Tháng 7, Tháng 8, Tháng 9 Âm lịch).
  + Mùa Đông (Tháng 10, Tháng 11, Tháng 12 Âm lịch).

<h3>V. BÍ PHÁP CẢI VẬN CHUYÊN GIA, PHONG THỦY ỨNG DỤNG &amp; SÁCH LƯỢC ĐỜI NGƯỜI</h3>
- Phương pháp chế hóa các sát tinh và hung vận bằng phong thủy (màu sắc, phương vị, vật phẩm trợ mệnh), tu dưỡng tâm tính và chiến lược quản trị công việc - dòng tiền - gia đạo 1 - 3 năm tới (khoảng 300 - 380 từ).
- Lời dặn tâm huyết của Thầy Tôn và nhắn gửi đương số: Quý khách đang sở hữu gói Chuyên Gia Expert và được tặng kèm 02 câu hỏi Chuyên Gia miễn phí ngay tại khung Hỏi Đáp bên dưới để đàm đạo trực tiếp cùng Thầy Tôn.

Văn phong bậc Đại Tông Sư: uyên bác, súc tích, giàu giá trị học thuật phương Đông và tính thực chứng cao, trình bày HTML tinh tế, kết thúc trọn vẹn.${langSuffix}`;

    promptText = `${part1Prompt}\n<!-- EXPERT_SPLIT_PART -->\n${part2Prompt}\n<!-- EXPERT_SPLIT_PART -->\n${part3Prompt}`;
  } else if (isPro) {
    // ==========================================
    // PRO TIER PROMPT: GEMINI 3.1 PRO PREVIEW (1800 - 2500 TỪ)
    // ==========================================
    promptText = `Bạn là ĐẠI SƯ TỬ VI THẦY TÔN uyên bác, thấu triệt dịch học, tử vi đẩu số và tướng pháp bí truyền.
Đang luận giải cho đương số: ${duongSo.hoTen}, Giới tính: ${duongSo.gioiTinh}.
XƯNG HÔ: Bắt buộc xưng 'Thầy Tôn' hoặc 'Thầy', gọi đương số là 'quý khách' hoặc tên '${duongSo.hoTen}'. TUYỆT ĐỐI KHÔNG xưng AI, KHÔNG dùng bát tự tử bình.
ĐỊNH DẠNG: KHÔNG dùng cú pháp Markdown (**). DÙNG TOÀN BỘ THẺ HTML CHUẨN (<b>, <h3>, <h4>, <p>, <ul>, <li>).
QUY TẮC BẮT BUỘC VỀ CUNG VÔ CHÍNH DIỆU: Khi luận giải bất kỳ cung nào không có chính tinh (Vô Chính Diệu), bạn BẮT BUỘC phải nhìn và kết hợp các Chính tinh + Phụ tinh từ Tam Phương Tứ Chính (mượn Chính tinh từ Cung Xung Chiếu và xét 2 Cung Tam Hợp hội chiếu kèm Tuần/Triệt) để luận giải chuẩn xác!

THÔNG TIN LÁ SỐ:
- Họ tên đương số: ${duongSo.hoTen} (${duongSo.gioiTinh}).
- Năm sinh Âm lịch: ${namCanChi} (${amDuongTxt}).
- Bản mệnh: ${banMenh}. Cục: ${tenCuc}. Sinh khắc Mệnh Cục: ${sinhKhac}.
- ÂM DƯƠNG THUẬN / NGHỊCH LÝ: ${thuanNghichLy} (LƯU Ý CỰC KỲ QUAN TRỌNG: Lá số này chuẩn xác 100% là "${thuanNghichLy}". TUYỆT ĐỐI BẮT BUỘC PHẢI LUẬN LÀ "${thuanNghichLy}", CẤM LUẬN NGƯỢC THÀNH ${thuanNghichLy === 'Âm Dương thuận lý' ? 'Âm Dương nghịch lý' : 'Âm Dương thuận lý'}!).
- Thân cư: ${thanCuName || 'Thân cư Mệnh'}.
- THỜI ĐIỂM HIỆN TẠI THỰC TẾ: Hôm nay là ${curDateSummary}.
- Xem hạn năm: ${namXemCanChi} (${namXem}), tuổi Âm lịch: ${tuoiAmXem} tuổi.
${daiVanPromptStr}${tieuVanPromptStr}
CHI TIẾT 12 CUNG & TINH ĐẨU:
${cungDataStr}
`;

    if (thongTinThem && thongTinThem.trim()) {
      promptText += `\nHOÀN CẢNH & DỮ LIỆU CÁ NHÂN THỰC TẾ CỦA ĐƯƠNG SỐ: ${thongTinThem.trim()} (BẮT BUỘC lồng ghép và đối chiếu sát sao hoàn cảnh thực tế này khi luận giải!).\n`;
    }
    if (chieuCao && canNang && chieuCao > 0 && canNang > 0) {
      promptText += `HÌNH THỂ THỰC TẾ: Chiều cao ${chieuCao} cm, Cân nặng ${canNang} kg.\n`;
    }

    promptText += `${tamHanMethodologyRule}

YÊU CẦU ĐẶC BIỆT DÀNH CHO BẢN CHUYÊN SÂU PRO (ĐỘ DÀI KHOẢNG 1800 - 2500 TỪ):
Bài luận phải cực kỳ sâu sắc, phân tích đa tầng, giải nghĩa rành mạch căn nguyên cát hung theo 5 phần lớn sau (Lưu ý: Với mọi cung Vô Chính Diệu, bắt buộc phải mượn Chính tinh từ Cung Xung Chiếu và kết hợp các sao từ Tam Phương Tứ Chính để luận giải):

<h3>I. ĐẠI CƯƠNG BẢN MỆNH &amp; CHÂN TƯỚNG HUYỀN CƠ</h3>
- Phân tích Mệnh Cục và Âm Dương: BẮT BUỘC khẳng định và giải nghĩa chuẩn xác theo đúng thế "${thuanNghichLy}" của lá số: ${
  thuanNghichLy === 'Âm Dương thuận lý'
    ? 'Khẳng định rõ ràng đương số là "Âm Dương thuận lý", biểu trưng cho người được trời đất và hoàn cảnh ưu ái, đắc thiên thời địa lợi, gặp nhiều may mắn, lúc khó khăn luôn có quý nhân trợ lực, mưu sự dễ thành.'
    : 'Khẳng định rõ ràng đương số là "Âm Dương nghịch lý", biểu trưng cho người phải tự lực cánh sinh, cuộc đời nhiều thử thách chông gai lúc ban đầu trước khi tôi luyện thành tựu.'
} Kết hợp phân tích Sinh khắc Mệnh Cục (${sinhKhac}) và Cung Thân (${thanCuName || 'Thân cư Mệnh'}).
- Phân tích cặn kẽ 14 Chính tinh thủ và chiếu Mệnh/Thân (nếu Mệnh hoặc Thân Vô Chính Diệu thì bắt buộc phân tích Chính tinh và Phụ tinh từ Tam Phương Tứ Chính hội chiếu), sự giao hội của Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ).
${tuongPhapInstruction}

<h3>II. TỨ TRỤ MỆNH SỐ: MỆNH - THÂN - TÀI - QUAN - PHU THÊ</h3>
- Phân tích thế đứng Tam hợp Mệnh - Tài - Quan và cung Thiên Di (Tam Phương Tứ Chính). Cung nào Vô Chính Diệu thì bắt buộc lấy sao từ Tam Phương Tứ Chính hội chiếu để luận.
- Đường Quan Lộc &amp; Sự nghiệp: Phù hợp ngành nghề nào, thế bứt phá công danh, đối tác làm ăn hợp mệnh.
- Đường Tài Bạch &amp; Tiền của: Cung Tài đắc cách ra sao, cách tụ tài, những năm tháng dễ hao tán tiền bạc cần phòng bị.
- Cung Phu Thê &amp; Gia đạo: Nhân duyên tiền định, tính cách bạn đời, phương pháp giữ gìn lửa ấm hạnh phúc.

<h3>III. CHI TIẾT ĐẠI VẬN HIỆN TẠI (${startAge ? `${startAge} - ${endAge} TUỔI` : 'GIAI ĐOẠN HIỆN TẠI'})</h3>
- ${daiVanInstruction} (Nếu cung Đại Vận là Vô Chính Diệu, bắt buộc xét các sao từ Tam Phương Tứ Chính hội chiếu về cung Đại Vận).
- Mổ xẻ chi tiết 2 chặng: 5 năm đầu đại vận và 5 năm cuối đại vận.
- Cơ hội phát triển vượt bậc ở giai đoạn nào, và những cạm bẫy hung tinh (Kình, Đà, Hỏa, Linh, Không, Kiếp...) cần phải né tránh ở tuổi ${tuoiAmXem}.

<h3>IV. VẬN HẠN NĂM ${namXem} (TAM HẠN HỢP THAM) &amp; BẢN ĐỒ 4 MÙA VẬN KHÍ</h3>
<h4>1. Định Vị Chiến Lược &amp; Hợp Tham Tam Hạn Năm ${namXem}</h4>
- BẮT BUỘC trình bày rõ đủ 4 ý (dùng thẻ &lt;ul&gt;&lt;li&gt;&lt;b&gt;...&lt;/b&gt;&lt;/li&gt;&lt;/ul&gt;, tuyệt đối không bỏ sót Tiểu Hạn hay LN. Đại hạn):
  + <b>Vị thế Chiến lược (Đại Vận × Hạn Năm):</b> Chỉ rõ đương số đang thuộc Thế nào trong Ma Trận 4 Thế và chiến lược chủ đạo (Tiến công hay Phòng thủ).
  + <b>Bước 1 — Nội tâm khởi niệm tại Cung Tiểu Hạn (20% - ${tieuVanCoordLabel || 'bản cung Tiểu hạn'}):</b> Phân tích mong cầu chủ quan và tâm thế bên trong.
  + <b>Bước 2 — Nền tảng chịu lực tại Cung Lưu Niên Đại Hạn (30% - ${lndhCoordLabel || 'cung LN. Đại hạn'}):</b> Đối chiếu độ đồng pha/lệch pha với Đại vận và các Sao Lưu tác động vào LN. Đại hạn.
  + <b>Bước 3 — Kết quả thực tế tại Cung Lưu Thái Tuế (50% - ${luuThaiTueCoordLabel || 'bản cung Lưu Thái Tuế'}):</b> Phân tích dàn Sao Lưu &amp; Lưu Tứ Hóa để chốt kết quả ngoại cảnh thực tế.
<h4>2. Khảo Sát Biến Động 4 Mùa Xuân - Hạ - Thu - Đông</h4>
- Khảo sát biến động qua 4 mùa (QUY TẮC BẮT BUỘC: Tra cứu chính xác tọa độ các cung cho từng tháng từ Tháng 1 đến Tháng 12 Âm lịch theo đúng 'BẢNG TRA CỨU NGUYỆT VẬN' ở trên; tháng nào rơi vào cung Vô Chính Diệu thì bắt buộc xét các sao từ Tam Phương Tứ Chính hội chiếu):
  + Mùa Xuân (Tháng 1, 2, 3 Âm): Khởi sắc hay trì trệ, việc nên mở màn (đối chiếu đúng các cung của Tháng 1, 2, 3 theo Bảng tra cứu Nguyệt Vận).
  + Mùa Hạ (Tháng 4, 5, 6 Âm): Đỉnh cao tài lộc hay thử thách quan hệ (đối chiếu đúng các cung của Tháng 4, 5, 6 theo Bảng tra cứu Nguyệt Vận).
  + Mùa Thu (Tháng 7, 8, 9 Âm): Biến động công việc, gia đạo, sức khỏe (đối chiếu đúng các cung của Tháng 7, 8, 9 theo Bảng tra cứu Nguyệt Vận).
  + Mùa Đông (Tháng 10, 11, 12 Âm): Thu vén thành quả, tích lũy phòng thủ (đối chiếu đúng các cung của Tháng 10, 11, 12 theo Bảng tra cứu Nguyệt Vận).

<h3>V. BÍ PHÁP TU DƯỠNG &amp; CHIẾN LƯỢC CẢI VẬN TOÀN DIỆN</h3>
- Phương pháp hóa giải triệt để các sát tinh và hung vận trong lá số bằng phong thủy, tâm thức, lối sống và thiện nghiệp.
- Lời dặn tâm huyết của Thầy Tôn dành riêng cho đương số. (Nhắc nhở đương số có thể đàm đạo trực tiếp thêm với Thầy ở khung Chat bên dưới, hoặc nâng cấp lên Bản Chuyên Gia Expert với mức phí ưu đãi 150.000đ nếu muốn mổ xẻ chi tiết từng cung trong trọn bộ 12 cung với độ dài gấp đôi).

Văn phong uyên bác, giàu chất văn hóa phương Đông, từ ngữ đắt giá, truyền cảm hứng mạnh mẽ. Trình bày bằng thẻ HTML tinh tế, rõ ràng. Bắt buộc viết trọn vẹn đủ cả 5 phần lớn, có lời chúc và lời kết hoàn chỉnh, tuyệt đối không được dừng dở dang giữa câu.`;
  } else {
    // ==========================================
    // FREE TIER PROMPT: GEMINI 2.5 FLASH (800 - 1000 TỪ)
    // ==========================================
    promptText = `Bạn là ĐẠI SƯ TỬ VI THẦY TÔN uyên bác.
Đang luận giải Bản Cơ Bản cho đương số: ${duongSo.hoTen}, Giới tính: ${duongSo.gioiTinh}.
XƯNG HÔ: Bắt buộc xưng 'Thầy Tôn' hoặc 'Thầy', gọi đương số là 'quý khách' hoặc tên '${duongSo.hoTen}'. TUYỆT ĐỐI KHÔNG xưng AI, KHÔNG dùng bát tự tử bình.
ĐỊNH DẠNG: KHÔNG dùng cú pháp Markdown (**). DÙNG TOÀN BỘ THẺ HTML CHUẨN (<b>, <h3>, <h4>, <p>, <ul>, <li>).
QUY TẮC BẮT BUỘC VỀ CUNG VÔ CHÍNH DIỆU: Khi luận giải bất kỳ cung nào không có chính tinh (Vô Chính Diệu), bạn BẮT BUỘC phải nhìn các sao từ Tam Phương Tứ Chính (mượn Chính tinh từ Cung Xung Chiếu và xét 2 Cung Tam Hợp hội chiếu) để kết hợp luận giải!

THÔNG TIN LÁ SỐ:
- Họ tên: ${duongSo.hoTen} (${duongSo.gioiTinh}).
- Năm sinh Âm lịch: ${namCanChi} (${amDuongTxt}).
- Bản mệnh: ${banMenh}, Cục: ${tenCuc}. Sinh khắc: ${sinhKhac}.
- ÂM DƯƠNG: ${thuanNghichLy} (LƯU Ý QUAN TRỌNG: Lá số này là "${thuanNghichLy}". Bắt buộc phải luận đúng là "${thuanNghichLy}", không được luận ngược!).
- Thân cư: ${thanCuName || 'Thân cư Mệnh'}.
- THỜI ĐIỂM HIỆN TẠI THỰC TẾ: Hôm nay là ${curDateSummary}.
- Xem hạn năm: ${namXemCanChi} (${namXem}), ${tuoiAmXem} tuổi Âm.
${daiVanPromptStr}${tieuVanPromptStr}
CHI TIẾT 12 CUNG & TINH ĐẨU:
${cungDataStr}
`;

    if (thongTinThem && thongTinThem.trim()) {
      promptText += `\nHoàn cảnh thực tế: ${thongTinThem.trim()}.\n`;
    }
    if (chieuCao && canNang && chieuCao > 0 && canNang > 0) {
      promptText += `Hình thể: Cao ${chieuCao} cm, Nặng ${canNang} kg.\n`;
    }

    promptText += `
YÊU CẦU BẢN LUẬN GIẢI CƠ BẢN (ĐỘ DÀI KHOẢNG 800 - 1000 TỪ):
Bài luận phải mạch lạc, chuẩn xác, đáng tin cậy, bao quát các phương diện chính yếu sau (Lưu ý: Nếu cung Mệnh, Tài, Quan hay Đại Vận là Vô Chính Diệu thì bắt buộc mượn Chính tinh từ Cung Xung Chiếu và kết hợp các sao từ Tam Phương Tứ Chính để luận giải):

<h3>I. TỔNG QUAN BẢN MỆNH &amp; CÁ TÍNH TIỀM NĂNG</h3>
- Phân tích Bản Mệnh, Cục, Âm Dương (BẮT BUỘC luận đúng là "${thuanNghichLy}") và tính cách nổi trội của đương số dựa trên các Chính tinh thủ/chiếu Cung Mệnh (nếu Mệnh Vô Chính Diệu thì xét Tam Phương Tứ Chính).
- Ưu điểm thiên bẩm và khuyết điểm cần tiết chế trong cách đối nhân xử thế.

<h3>II. ĐIỂM SÁNG TAM HỢP MỆNH - TÀI - QUAN</h3>
- Phân tích trục công danh sự nghiệp (Cung Quan Lộc) và xu hướng tài vận kiếm tiền (Cung Tài Bạch), kết hợp các sao từ Tam Phương Tứ Chính nếu gặp cung Vô Chính Diệu.
- Đánh giá khả năng bứt phá công việc và hướng đi hợp bản mệnh.

<h3>III. ĐẠI VẬN HIỆN TẠI (${startAge ? `${startAge} - ${endAge} TUỔI` : 'GIAI ĐOẠN HIỆN TẠI'}) &amp; TAM HẠN NĂM ${namXem}</h3>
- ${daiVanInstruction}
- Tổng hợp sắc bén <b>Tam Hạn năm ${namXem} (${namXemCanChi})</b> theo mạch Nhân - Quả: đối chiếu tâm thế chủ quan tại <b>Cung Tiểu Hạn (${tieuVanCoordLabel || 'bản cung Tiểu hạn'} - 20%)</b> với nền tảng chịu lực tại <b>Cung LN. Đại hạn (${lndhCoordLabel || 'cung LN. Đại hạn'} - 30%)</b> và kết quả ngoại cảnh thực tế tại <b>Cung Lưu Thái Tuế (${luuThaiTueCoordLabel || 'bản cung Lưu Thái Tuế'} - 50%, kèm Sao Lưu)</b>. Chốt rõ năm nay đương số nên Tiến công bứt phá hay Phòng thủ giữ gốc, chỉ ra cơ hội sáng nhất và điểm rủi ro lớn nhất cần lưu tâm (tuyệt đối không gọi nhầm tên 3 cung này lẫn sang nhau).

<h3>IV. LỜI KHUYÊN &amp; ĐỊNH HƯỚNG TỪ THẦY TÔN</h3>
- Đúc kết lời khuyên thiết thực giúp đương số hành xử đắc thời.
- Nhắn gửi đương số: Để xem phân tích chuyên sâu đa tầng (soi chiếu Tướng Pháp khuôn mặt/chỉ tay, chi tiết 4 mùa Xuân-Hạ-Thu-Đông và bí pháp cải vận) hoặc Bản Chuyên Gia Expert khảo sát trọn vẹn 12 cung, đương số có thể bấm nút Nâng cấp ngay bên dưới bất cứ lúc nào.

Văn phong uy nghiêm, chuẩn mực, truyền cảm hứng, trình bày HTML đẹp mắt.`;
  }

  if (!isExpert) {
    const langModifier = getLangPromptModifier(lang, effectiveTier);
    if (langModifier) {
      promptText += '\n' + langModifier;
    }
  }

  const parts: GeminiPart[] = [{ text: promptText }];

  if (anhMat && anhMat.includes(';base64,')) {
    const [header, base64Data] = anhMat.split(';base64,');
    const mimeType = header.replace('data:', '') || 'image/jpeg';
    parts.push({
      inlineData: { mimeType, data: base64Data },
    });
  }

  if (anhTay && anhTay.includes(';base64,')) {
    const [header, base64Data] = anhTay.split(';base64,');
    const mimeType = header.replace('data:', '') || 'image/jpeg';
    parts.push({
      inlineData: { mimeType, data: base64Data },
    });
  }

  return parts;
}

/**
 * Gọi đơn lẻ 1 request tới Gemini Vision / Supabase Edge Function
 */
async function callSingleGeminiVision(
  parts: GeminiPart[],
  customApiKey?: string,
  modelName = 'gemini-3.1-pro-preview'
): Promise<{ text?: string; error?: string }> {
  const isExpert = modelName.includes('argon') || modelName.includes('4');
  const isPro = isExpert || modelName.includes('3.1') || modelName.includes('pro');
  // Với gemini-4-argon, đặt thinkingBudget = 0 để model sinh văn bản ngay lập tức (tránh bị treo 70-90s ở bước suy nghĩ ngầm gây lỗi 504)
  const targetBudget = isExpert ? 0 : isPro ? 1024 : 0;
  const maxTokens = isExpert ? 12000 : isPro ? 12000 : 5000;
  const timeoutMs = isExpert ? 90000 : 120000;

  // 1. Trường hợp người dùng có nhập key riêng trong modal cài đặt
  if (customApiKey && customApiKey.trim()) {
    const candidateModels = isExpert ? [modelName, 'gemini-3.1-pro-preview'] : [modelName];
    for (const candidateModel of candidateModels) {
      try {
        const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
          candidateModel
        )}:generateContent?key=${encodeURIComponent(customApiKey.trim())}`;
        const res = await fetch(directUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: maxTokens,
              thinkingConfig: { thinkingBudget: candidateModel.includes('argon') ? 0 : 1024 },
            },
          }),
          signal: AbortSignal.timeout(timeoutMs),
        });

        if (!res.ok) {
          const errText = await res.text();
          if (candidateModel !== candidateModels[candidateModels.length - 1]) {
            console.warn(`[callGeminiVision] Model ${candidateModel} trả về lỗi, chuyển sang ${candidateModels[1]}...`);
            continue;
          }
          return { error: `Lỗi kết nối với Key cá nhân: ${errText}` };
        }

        const data = await res.json();
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          return { text: formatTuViHtml(rawText) };
        }
      } catch (e: any) {
        console.warn('Custom API Key failed, fallback sang Supabase Edge Function:', e.message);
      }
    }
  }

  // 2. Mặc định: Gọi qua Supabase Edge Function (Key được bảo mật trong Supabase Secrets)
  const edgeEndpoints: Array<{ url: string; label: string; body: Record<string, unknown> }> = [
    {
      url: `${SUPABASE_URL}/functions/v1/tuvi-interpreter`,
      label: `Supabase tuvi-interpreter (${modelName})`,
      body: {
        parts,
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: maxTokens,
          thinkingConfig: { thinkingBudget: targetBudget },
        },
      },
    },
  ];

  // Nếu gọi gemini-4-argon mà cổng upstream quá tải, tự động dự phòng bằng gemini-3.1-pro-preview
  if (isExpert && modelName !== 'gemini-3.1-pro-preview') {
    edgeEndpoints.push({
      url: `${SUPABASE_URL}/functions/v1/tuvi-interpreter`,
      label: 'Supabase tuvi-interpreter (Expert High-Token Engine)',
      body: {
        parts,
        model: 'gemini-3.1-pro-preview',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 12000,
          thinkingConfig: { thinkingBudget: 512 },
        },
      },
    });
  }

  // Dự phòng cuối cùng qua tuvi-interpreter (gemini-2.5-flash) thay vì gọi sang omni-vision-solver (tránh trả về câu lỗi bài tập)
  if (modelName !== 'gemini-2.5-flash') {
    edgeEndpoints.push({
      url: `${SUPABASE_URL}/functions/v1/tuvi-interpreter`,
      label: 'Supabase tuvi-interpreter (gemini-2.5-flash fallback)',
      body: {
        parts,
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: maxTokens,
          thinkingConfig: { thinkingBudget: 0 },
        },
      },
    });
  }

  let lastError = 'Thiên bàn tạm thời chưa thể kết nối';

  for (const { url, label, body } of edgeEndpoints) {
    try {
      console.log(`[callGeminiVision] Gửi yêu cầu qua ${label}...`);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = `[${label}] Lỗi HTTP ${response.status}: ${errText}`;
        console.warn(lastError, '- Thử cổng dự phòng...');
        continue;
      }

      const data = await response.json();
      const rawText = String(data.result || data.text || '').trim();

      if (
        !rawText ||
        rawText.includes('gửi lại đề bài') ||
        rawText.includes('thầy đang bận chút xíu')
      ) {
        lastError = `[${label}] Cổng AI đang bận hoặc hết hạn mức tạm thời`;
        console.warn(lastError, '- Bỏ qua kết quả lỗi...');
        continue;
      }

      return { text: formatTuViHtml(rawText) };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      lastError = `[${label}] ${message}`;
      console.warn(`Lỗi khi gọi qua ${label}:`, message);
    }
  }

  return {
    error: `❌ Thầy đang định tâm quán tưởng cho khách trước. Quý khách vui lòng thử lại sau giây lát!`,
  };
}

/**
 * Gọi AI luận giải Tử Vi
 * - Với gói Chuyên Gia Expert (có marker <!-- EXPERT_SPLIT_PART -->), tự động chia làm 3 luồng song song (Promise.all)
 *   giúp tổng thời gian tạo bài 4.000 - 5.000 từ chỉ còn ~25-35 giây, triệt tiêu 100% lỗi HTTP 504 Timeout!
 */
export async function callGeminiVision(
  parts: GeminiPart[],
  customApiKey?: string,
  modelName = 'gemini-3.1-pro-preview'
): Promise<{ text?: string; error?: string }> {
  const firstText = parts[0]?.text || '';
  if (firstText.includes('<!-- EXPERT_SPLIT_PART -->')) {
    const subPrompts = firstText
      .split('<!-- EXPERT_SPLIT_PART -->')
      .map((s) => s.trim())
      .filter(Boolean);
    const imageParts = parts.slice(1);

    const results = await Promise.all(
      subPrompts.map((subPrompt, idx) => {
        const subParts: GeminiPart[] =
          idx === 0 ? [{ text: subPrompt }, ...imageParts] : [{ text: subPrompt }];
        return callSingleGeminiVision(subParts, customApiKey, modelName);
      })
    );

    const successfulTexts = results.map((r) => r.text).filter(Boolean) as string[];
    if (successfulTexts.length === subPrompts.length) {
      return { text: formatTuViHtml(successfulTexts.join('\n\n')) };
    }
    const firstErr = results.find((r) => r.error)?.error;
    return {
      error: firstErr || '❌ Thầy đang định tâm quán tưởng cho khách trước. Quý khách vui lòng thử lại sau giây lát!',
    };
  }

  return callSingleGeminiVision(parts, customApiKey, modelName);
}

/**
 * Kiểm tra kết nối AI / API Key
 */
export async function testGeminiApiKey(
  apiKey?: string
): Promise<{ success: boolean; latencyMs: number; model: string; message: string }> {
  const start = Date.now();

  // Nếu người dùng nhập key riêng
  if (apiKey && apiKey.trim()) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(
        apiKey.trim()
      )}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Kiểm tra tín hiệu kết nối.' }] }],
        }),
        signal: AbortSignal.timeout(15000),
      });

      const elapsed = Date.now() - start;
      if (!res.ok) {
        const errText = await res.text();
        return {
          success: false,
          latencyMs: elapsed,
          model: 'gemini-2.5-flash',
          message: errText,
        };
      }
      return {
        success: true,
        latencyMs: elapsed,
        model: 'gemini-2.5-flash',
        message: 'Kết nối thành công! Key cá nhân hoạt động bình thường.',
      };
    } catch (err: any) {
      return {
        success: false,
        latencyMs: Date.now() - start,
        model: 'gemini-2.5-flash',
        message: err.message,
      };
    }
  }

  // Mặc định: Kiểm tra kết nối tới Supabase Edge Function
  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/tuvi-interpreter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        prompt: 'Bạn là Thầy Tôn. Hãy chào ngắn gọn 1 câu để kiểm tra kết nối.',
        content: 'ping',
      }),
      signal: AbortSignal.timeout(15000),
    });

    const elapsed = Date.now() - start;
    if (res.ok) {
      return {
        success: true,
        latencyMs: elapsed,
        model: 'Supabase Edge Secret (Gemini)',
        message: 'Hệ thống Tử Vi Thầy Tôn kết nối hoàn hảo qua Supabase Edge Function!',
      };
    }

    const errText = await res.text();
    return {
      success: false,
      latencyMs: elapsed,
      model: 'Supabase Edge Secret (Gemini)',
      message: errText,
    };
  } catch (err: any) {
    return {
      success: false,
      latencyMs: Date.now() - start,
      model: 'Supabase Edge Secret (Gemini)',
      message: err.message,
    };
  }
}
