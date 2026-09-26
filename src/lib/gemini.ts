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

function formatTuViHtml(rawText: string): string {
  let cleaned = rawText.replace(/```html|```markdown|```/gi, '');
  cleaned = cleaned.replace(
    /### (.*?)(\r\n|\n)/g,
    '<h4 class="font-bold text-amber-700 text-lg mt-4 mb-2">$1</h4>'
  );
  cleaned = cleaned.replace(
    /## (.*?)(\r\n|\n)/g,
    '<h3 class="font-bold text-red-700 text-xl mt-6 mb-3 border-b border-red-200 pb-1">$1</h3>'
  );
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '<b class="text-red-700 font-semibold">$1</b>');
  cleaned = cleaned.replace(/\*(.*?)\*/g, '<i class="italic text-slate-700">$1</i>');
  return cleaned.trim();
}

/**
 * Tạo parts hoàn chỉnh cho bài bình giải Tử Vi Thầy Tôn
 */
export type SupportedLanguage = 'vi' | 'en' | 'zh' | 'ko';

export function getLangPromptModifier(lang: SupportedLanguage, isPro: boolean): string {
  if (lang === 'zh') {
    return `\n【语言与文风最高指令 - 必须严格执行】：
- 全文必须100%使用纯正、典雅、规范的【中文】（严禁夹杂越南语）！
- 角色设定：紫微斗数泰斗·顿大师（Master Ton / 顿师），精通易学与相法秘传。自称“顿师”或“为师”，称呼求测者为“居士”或“缘主”。严禁自称AI，严禁使用八字子平术语取代紫微斗数。
- 术语要求：使用标准紫微斗数术语（命宫、身宫、官禄宫、财帛宫、迁移宫、夫妻宫等；十四正曜：紫微、天府、太阳、太阴、武曲、天同、廉贞、天机、贪狼、巨门、天相、天梁、七杀、破军；四化：化禄、化权、化科、化忌）。
- 各主要章节标题必须使用中文规范：
  ${
    isPro
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
- 용어 표준: 명궁, 신궁, 관록궁, 재백궁, 천이궁, 부처궁 등 12궁; 14주성(자미, 천부, 태양, 태음, 무곡, 천동, 염정, 천기, 탐랑, 거문, 천상, 천량, 칠살, 파군); 사화(화록, 화권, 화과, 화기) 등 정통 자미두수 한글 용어를 사용하십시오.
- 대단원 제목은 반드시 아래와 같이 한국어로 구성하십시오:
  ${
    isPro
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
  * 12 Palaces: Life Palace (Destiny), Career, Wealth, Spouse, Travel, Karma, Property, Health, etc.
  * Major Stars: Zi Wei (Emperor), Tian Fu (Treasury), Sun, Moon, Wu Qu (Minister/Finance), Tian Tong, Lian Zhen, Tian Ji, Tan Lang, Ju Men, Tian Xiang, Tian Liang, Qi Sha, Po Jun.
  * Four Transformations (Si Hua): Hua Lu (Prosperity), Hua Quan (Authority), Hua Ke (Fame), Hua Ji (Obstacle).
- Section Titles MUST use English standards:
  ${
    isPro
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
  tier?: 'free' | 'pro';
  thongTinThem?: string;
  chieuCao?: number;
  canNang?: number;
  anhMat?: string;
  anhTay?: string;
  lang?: SupportedLanguage;
}): GeminiPart[] {
  const { laSo, tier = 'free', thongTinThem, chieuCao, canNang, anhMat, anhTay, lang = 'vi' } = options;
  const isPro = tier === 'pro' || laSo.tier === 'pro';
  const { duongSo, namCanChi, banMenh, tenCuc, sinhKhac, namXemCanChi, namXem, tuoiAmXem, cungs } = laSo;
  const { buildCungDataPrompt } = require('./tuvi/anSao');
  const cungDataStr = buildCungDataPrompt(laSo);

  // 1. Tính toán chính xác 100% Cung Đại Vận hiện tại theo Tuổi Âm
  const cungDaiVanHienTai = cungs.find(
    (c) => c.daiVan <= tuoiAmXem && tuoiAmXem < c.daiVan + 10
  );

  let daiVanPromptStr = '';
  let daiVanInstruction = '3. Phân tích Đại Vận đang chạy.';
  let startAge = 0;
  let endAge = 0;
  if (cungDaiVanHienTai) {
    startAge = cungDaiVanHienTai.daiVan;
    endAge = startAge + 9;
    daiVanPromptStr = `\nĐẠI VẬN HIỆN TẠI (CHÍNH XÁC 100%): Đang ở Đại vận ${startAge} - ${endAge} tuổi tại Cung ${cungDaiVanHienTai.chi} (${cungDaiVanHienTai.cungName}).
LƯU Ý QUAN TRỌNG: Hiện tại năm ${namXem} đương số đúng ${tuoiAmXem} tuổi Âm, nằm trong khoảng ${startAge} - ${endAge} tuổi (Ví dụ: 42 tuổi nằm trong khoảng 35 - 44 tuổi tại Cung ${cungDaiVanHienTai.chi}). TUYỆT ĐỐI KHÔNG LUẬN NHẦM sang đại vận khác như 45-54 tuổi!\n`;
    daiVanInstruction = `3. Phân tích Đại Vận hiện tại: BẮT BUỘC luận giải đúng Đại Vận ${startAge} - ${endAge} tuổi tại Cung ${cungDaiVanHienTai.chi} (${cungDaiVanHienTai.cungName}). Phân tích kỹ đương số đang ở tuổi ${tuoiAmXem} thì cơ hội, vận hạn và biến chuyển trong đại vận ${startAge}-${endAge} này ra sao.`;
  }

  // 2. Tìm Cung Lưu Niên / Tiểu Vận năm xem
  const chiNamXem = (namXemCanChi.split(' ')[1] || '').trim();
  const cungLuuNien = cungs.find((c) => c.chi === chiNamXem);
  let tieuVanPromptStr = '';
  if (cungLuuNien) {
    tieuVanPromptStr = `\nTIỂU VẬN / LƯU NIÊN NĂM ${namXem} (${namXemCanChi}): Đóng tại Cung ${cungLuuNien.chi} (${cungLuuNien.cungName}).\n`;
  }

  let promptText = '';

  if (isPro) {
    // ==========================================
    // PRO TIER PROMPT: GEMINI 3.1 PRO PREVIEW (1800 - 2500 TỪ)
    // ==========================================
    promptText = `Bạn là ĐẠI SƯ TỬ VI THẦY TÔN uyên bác, thấu triệt dịch học, tử vi đẩu số và tướng pháp bí truyền.
Đang luận giải cho đương số: ${duongSo.hoTen}, Giới tính: ${duongSo.gioiTinh}.
XƯNG HÔ: Bắt buộc xưng 'Thầy Tôn' hoặc 'Thầy', gọi đương số là 'quý khách' hoặc tên '${duongSo.hoTen}'. TUYỆT ĐỐI KHÔNG xưng AI, KHÔNG dùng bát tự tử bình.
ĐỊNH DẠNG: KHÔNG dùng cú pháp Markdown (**). DÙNG TOÀN BỘ THẺ HTML CHUẨN (<b>, <h3>, <h4>, <p>, <ul>, <li>).

THÔNG TIN LÁ SỐ:
- Năm sinh Âm lịch: ${namCanChi}. Mệnh: ${banMenh}. Cục: ${tenCuc}. Sinh khắc Mệnh Cục: ${sinhKhac}.
- Xem hạn năm: ${namXemCanChi} (${namXem}), tuổi Âm lịch: ${tuoiAmXem} tuổi.
${daiVanPromptStr}${tieuVanPromptStr}
CHI TIẾT 12 CUNG & TINH ĐẨU:
${cungDataStr}
`;

    if (thongTinThem && thongTinThem.trim()) {
      promptText += `\nHOÀN CẢNH & NGUYỆN VỌNG THỰC TẾ: ${thongTinThem.trim()}.\n`;
    }
    if (chieuCao && canNang && chieuCao > 0 && canNang > 0) {
      promptText += `HÌNH THỂ THỰC TẾ: Chiều cao ${chieuCao} cm, Cân nặng ${canNang} kg.\n`;
    }

    promptText += `
YÊU CẦU ĐẶC BIỆT DÀNH CHO BẢN CHUYÊN SÂU PRO (ĐỘ DÀI KHOẢNG 1800 - 2500 TỪ):
Bài luận phải cực kỳ sâu sắc, phân tích đa tầng, giải nghĩa rành mạch căn nguyên cát hung theo 5 phần lớn sau:

<h3>I. ĐẠI CƯƠNG BẢN MỆNH &amp; CHÂN TƯỚNG HUYỀN CƠ</h3>
- Luận giải sâu sắc về Âm Dương thuận/nghịch lý, Mệnh Cục tương sinh tương khắc và ý nghĩa với số phận đời người.
- Phân tích cặn kẽ 14 Chính tinh thủ và chiếu Mệnh/Thân, sự giao hội của Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ).
- NẾU CÓ ẢNH DIỆN TƯỚNG (mặt) hoặc THỦ TƯỚNG (chỉ tay) gửi kèm: Hãy đối chiếu trực tiếp các nét tướng mạo (ấn đường, chuẩn đầu, cung điền trạch, các gò chỉ tay, đường sinh đạo, trí đạo, tâm đạo theo quy tắc Nam tay trái, Nữ tay phải) với các sao thủ Mệnh để xác tín độ chính xác giờ sinh và thế mạnh thiên bẩm.

<h3>II. TỨ TRỤ MỆNH SỐ: MỆNH - THÂN - TÀI - QUAN - PHU THÊ</h3>
- Phân tích thế đứng Tam hợp Mệnh - Tài - Quan và cung Thiên Di (Tam Phương Tứ Chính).
- Đường Quan Lộc &amp; Sự nghiệp: Phù hợp ngành nghề nào, thế bứt phá công danh, đối tác làm ăn hợp mệnh.
- Đường Tài Bạch &amp; Tiền của: Cung Tài đắc cách ra sao, cách tụ tài, những năm tháng dễ hao tán tiền bạc cần phòng bị.
- Cung Phu Thê &amp; Gia đạo: Nhân duyên tiền định, tính cách bạn đời, phương pháp giữ gìn lửa ấm hạnh phúc.

<h3>III. CHI TIẾT ĐẠI VẬN HIỆN TẠI (${startAge} - ${endAge} TUỔI)</h3>
- ${daiVanInstruction}
- Mổ xẻ chi tiết 2 chặng: 5 năm đầu đại vận và 5 năm cuối đại vận.
- Cơ hội phát triển vượt bậc ở giai đoạn nào, và những cạm bẫy hung tinh (Kình, Đà, Hỏa, Linh, Không, Kiếp...) cần phải né tránh ở tuổi ${tuoiAmXem}.

<h3>IV. TIỂU VẬN NĂM ${namXem} &amp; BẢN ĐỒ 4 MÙA VẬN KHÍ</h3>
- Tọa độ cung Lưu Niên năm ${namXem} (${namXemCanChi}) và tác động của các Lưu Tinh (Lưu Thái Tuế, Lưu Lộc Tồn, Lưu Kình Đà...).
- Khảo sát biến động qua 4 mùa (QUY TẮC BẮT BUỘC: Tra cứu chính xác tọa độ các cung cho từng tháng từ Tháng 1 đến Tháng 12 Âm lịch theo đúng 'BẢNG TRA CỨU NGUYỆT VẬN' ở trên, tuyệt đối không đoán mò hay nhầm cung vị):
  + Mùa Xuân (Tháng 1, 2, 3 Âm): Khởi sắc hay trì trệ, việc nên mở màn (đối chiếu đúng các cung của Tháng 1, 2, 3 theo Bảng tra cứu Nguyệt Vận).
  + Mùa Hạ (Tháng 4, 5, 6 Âm): Đỉnh cao tài lộc hay thử thách quan hệ (đối chiếu đúng các cung của Tháng 4, 5, 6 theo Bảng tra cứu Nguyệt Vận).
  + Mùa Thu (Tháng 7, 8, 9 Âm): Biến động công việc, gia đạo, sức khỏe (đối chiếu đúng các cung của Tháng 7, 8, 9 theo Bảng tra cứu Nguyệt Vận).
  + Mùa Đông (Tháng 10, 11, 12 Âm): Thu vén thành quả, tích lũy phòng thủ (đối chiếu đúng các cung của Tháng 10, 11, 12 theo Bảng tra cứu Nguyệt Vận).

<h3>V. BÍ PHÁP TU DƯỠNG &amp; CHIẾN LƯỢC CẢI VẬN TOÀN DIỆN</h3>
- Phương pháp hóa giải triệt để các sát tinh và hung vận trong lá số bằng phong thủy, tâm thức, lối sống và thiện nghiệp.
- Lời dặn tâm huyết của Thầy Tôn dành riêng cho đương số. (Nhắc nhở đương số có thể đàm đạo trực tiếp thêm với Thầy ở khung Chat bên dưới).

Văn phong uyên bác, giàu chất văn hóa phương Đông, từ ngữ đắt giá, truyền cảm hứng mạnh mẽ. Trình bày bằng thẻ HTML tinh tế, rõ ràng. Bắt buộc viết trọn vẹn đủ cả 5 phần lớn, có lời chúc và lời kết hoàn chỉnh, tuyệt đối không được dừng dở dang giữa câu.`;
  } else {
    // ==========================================
    // FREE TIER PROMPT: GEMINI 2.5 FLASH (800 - 1000 TỪ)
    // ==========================================
    promptText = `Bạn là ĐẠI SƯ TỬ VI THẦY TÔN uyên bác.
Đang luận giải Bản Cơ Bản cho đương số: ${duongSo.hoTen}, Giới tính: ${duongSo.gioiTinh}.
XƯNG HÔ: Bắt buộc xưng 'Thầy Tôn' hoặc 'Thầy', gọi đương số là 'quý khách' hoặc tên '${duongSo.hoTen}'. TUYỆT ĐỐI KHÔNG xưng AI, KHÔNG dùng bát tự tử bình.
ĐỊNH DẠNG: KHÔNG dùng cú pháp Markdown (**). DÙNG TOÀN BỘ THẺ HTML CHUẨN (<b>, <h3>, <h4>, <p>, <ul>, <li>).

THÔNG TIN LÁ SỐ:
- Năm sinh Âm lịch: ${namCanChi}. Mệnh: ${banMenh}, Cục: ${tenCuc}. Sinh khắc: ${sinhKhac}.
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
Bài luận phải mạch lạc, chuẩn xác, đáng tin cậy, bao quát các phương diện chính yếu sau:

<h3>I. TỔNG QUAN BẢN MỆNH &amp; CÁ TÍNH TIỀM NĂNG</h3>
- Phân tích Bản Mệnh, Cục, Âm Dương thuận nghịch và tính cách nổi trội của đương số dựa trên các Chính tinh thủ Cung Mệnh.
- Ưu điểm thiên bẩm và khuyết điểm cần tiết chế trong cách đối nhân xử thế.

<h3>II. ĐIỂM SÁNG TAM HỢP MỆNH - TÀI - QUAN</h3>
- Phân tích trục công danh sự nghiệp (Cung Quan Lộc) và xu hướng tài vận kiếm tiền (Cung Tài Bạch).
- Đánh giá khả năng bứt phá công việc và hướng đi hợp bản mệnh.

<h3>III. ĐẠI VẬN HIỆN TẠI (${startAge} - ${endAge} TUỔI) &amp; TIỂU VẬN NĂM ${namXem}</h3>
- ${daiVanInstruction}
- Điểm sáng và thử thách lớn nhất trong năm ${namXem} (${namXemCanChi}) mà đương số ${tuoiAmXem} tuổi cần lưu tâm.

<h3>IV. LỜI KHUYÊN &amp; ĐỊNH HƯỚNG TỪ THẦY TÔN</h3>
- Đúc kết lời khuyên thiết thực giúp đương số hành xử đắc thời.
- Nhắn gửi đương số: Để xem phân tích chuyên sâu đa tầng gấp đôi (soi chiếu Tướng Pháp khuôn mặt/chỉ tay, chi tiết 4 mùa Xuân-Hạ-Thu-Đông và bí pháp cải vận), đương số có thể bấm nút Nâng cấp lên Bản Pro bất cứ lúc nào.

Văn phong uy nghiêm, chuẩn mực, truyền cảm hứng, trình bày HTML đẹp mắt.`;
  }

  const langModifier = getLangPromptModifier(lang, isPro);
  if (langModifier) {
    promptText += '\n' + langModifier;
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
 * Gọi AI luận giải Tử Vi
 * Ưu tiên gọi qua Supabase Edge Function (dùng key bí mật trong Supabase Secret)
 * Nếu người dùng có tự nhập key cá nhân thì gọi trực tiếp với key đó.
 */
export async function callGeminiVision(
  parts: GeminiPart[],
  customApiKey?: string,
  modelName = 'gemini-3.1-pro-preview'
): Promise<{ text?: string; error?: string }> {
  const isPro = modelName.includes('3.1') || modelName.includes('pro');
  const targetBudget = isPro ? 1024 : 0;

  // 1. Trường hợp người dùng có nhập key riêng trong modal cài đặt
  if (customApiKey && customApiKey.trim()) {
    try {
      const directUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        modelName
      )}:generateContent?key=${encodeURIComponent(customApiKey.trim())}`;
      const res = await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: isPro ? 12000 : 5000,
            thinkingConfig: { thinkingBudget: targetBudget },
          },
        }),
        signal: AbortSignal.timeout(120000),
      });

      if (!res.ok) {
        const errText = await res.text();
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

  // 2. Mặc định: Gọi qua Supabase Edge Function (Key được bảo mật trong Supabase Secrets)
  const edgeEndpoints = [
    {
      url: `${SUPABASE_URL}/functions/v1/tuvi-interpreter`,
      label: 'Supabase tuvi-interpreter',
      body: {
        parts,
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: isPro ? 12000 : 5000,
          thinkingConfig: { thinkingBudget: targetBudget },
        },
      },
    },
    {
      url: `${SUPABASE_URL}/functions/v1/omni-vision-solver`,
      label: 'Supabase omni-vision-solver (dự phòng)',
      body: {
        prompt: parts.find((p) => p.text)?.text || '',
        content: 'Luận giải chi tiết lá số theo dữ liệu được cung cấp.',
      },
    },
  ];

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
        signal: AbortSignal.timeout(120000),
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = `[${label}] Lỗi HTTP ${response.status}: ${errText}`;
        console.warn(lastError, '- Thử cổng dự phòng...');
        continue;
      }

      const data = await response.json();
      const rawText = data.result || data.text;

      if (!rawText) {
        lastError = `[${label}] Chưa nhận được lời bình giải`;
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
