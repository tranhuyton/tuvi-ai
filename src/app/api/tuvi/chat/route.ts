import { NextRequest, NextResponse } from 'next/server';
import { LaSoData, ChatMessage } from '@/types/tuvi';
import {
  buildCungDataPrompt,
  getCurrentVietnamTimeInfo,
  computeTamHanAnalysis,
  lapLaSoTuVi,
} from '@/lib/tuvi/anSao';
import { callGeminiVision } from '@/lib/gemini';
import { adminSupabase } from '@/lib/supabaseAdmin';
import { getAuthenticatedUser, isValidUuid, verifyAdminRequest } from '@/lib/adminAuth';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';

export const maxDuration = 180;

export async function POST(req: NextRequest) {
  let reservedMessageId: string | null = null;

  try {
    const ip = getClientIp(req);
    const adminAuth = await verifyAdminRequest(req);
    const isAdmin = adminAuth.authorized;

    if (!isAdmin) {
      const rl = await checkRateLimitDistributed({
        key: `tuvi_chat:${ip}`,
        limit: 20,
        windowMs: 5 * 60_000,
      });
      if (!rl.allowed) {
        return NextResponse.json(
          { error: 'Quý khách đang gửi quá nhiều câu hỏi liên tiếp. Vui lòng thử lại sau ít phút.' },
          { status: 429 }
        );
      }
    }

    const body = await req.json();
    const {
      userQuestion,
      laSo,
      thongTinThem,
      chieuCao,
      canNang,
      readingHtml,
      chatHistory,
      apiKey,
      mode,
      questionType,
      model,
      lang,
      language,
      chartId,
    } = body as {
      userQuestion: string;
      laSo?: LaSoData;
      thongTinThem?: string;
      chieuCao?: number;
      canNang?: number;
      readingHtml?: string;
      chatHistory?: ChatMessage[];
      apiKey?: string;
      mode?: 'basic' | 'vip' | 'expert';
      questionType?: 'basic' | 'vip' | 'expert';
      model?: string;
      lang?: 'vi' | 'en' | 'zh' | 'ko' | 'ja';
      language?: 'vi' | 'en' | 'zh' | 'ko' | 'ja';
      chartId?: string;
    };

    const targetLang = lang || language || 'vi';
    const activeMode: 'basic' | 'vip' | 'expert' =
      mode === 'expert' || questionType === 'expert'
        ? 'expert'
        : mode === 'vip' || questionType === 'vip'
        ? 'vip'
        : mode === 'basic' || questionType === 'basic'
        ? 'basic'
        : laSo?.tier === 'expert'
        ? 'expert'
        : 'vip';

    const cleanQuestion = typeof userQuestion === 'string' ? userQuestion.trim() : '';
    if (!cleanQuestion) {
      return NextResponse.json({ error: 'Câu hỏi không được để trống' }, { status: 400 });
    }
    if (cleanQuestion.length > 2500) {
      return NextResponse.json({ error: 'Câu hỏi quá dài (tối đa 2.500 ký tự)' }, { status: 400 });
    }

    const authUser = adminAuth.user || (await getAuthenticatedUser(req));
    const verifiedUserId = authUser?.id || undefined;
    const safeChartId = isValidUuid(chartId) ? chartId.trim() : undefined;

    let effectiveLaSo: LaSoData | undefined = laSo;
    let effectiveReadingHtml: string | undefined = isAdmin ? readingHtml : undefined;
    let effectiveHistory: ChatMessage[] = isAdmin && Array.isArray(chatHistory) ? chatHistory.slice(-12) : [];
    let effectiveThongTinThem: string | undefined =
      typeof thongTinThem === 'string' ? thongTinThem.trim().slice(0, 1500) : undefined;
    let effectiveChieuCao: number | undefined = chieuCao;
    let effectiveCanNang: number | undefined = canNang;

    // =========================================================================
    // KIỂM TRA QUOTA CỨNG TỪ PHÍA MÁY CHỦ + ĐẶT CHỖ NGUYÊN TỬ TRƯỚC KHI GỌI AI
    // =========================================================================
    let totalAllowed = 0;
    let allowedExpert = 0;
    let allowedPro = 0;
    let allowedBasic = 0;
    let usedAtomicReservation = false;

    if (isAdmin) {
      totalAllowed = 999999;
      allowedExpert = 999999;
      allowedPro = 999999;
      allowedBasic = 999999;
    } else {
      if (!safeChartId || !verifiedUserId) {
        return NextResponse.json(
          { error: 'Quý khách vui lòng đăng nhập và lưu lá số để sử dụng quyền lợi hỏi đáp cùng Thầy Tôn.' },
          { status: 403 }
        );
      }

      // 1. Tải toàn bộ dữ liệu chuẩn từ DB & xác minh quyền sở hữu tuyệt đối
      const { data: dbChart } = await adminSupabase
        .from('tuvi_charts')
        .select('user_id, duong_so_data, laso_data, reading_html')
        .eq('id', safeChartId)
        .maybeSingle();

      if (!dbChart) {
        return NextResponse.json({ error: 'Không tìm thấy lá số hợp lệ' }, { status: 404 });
      }

      if (!dbChart.user_id || dbChart.user_id !== verifiedUserId) {
        return NextResponse.json(
          { error: 'Quý khách vui lòng đăng nhập đúng tài khoản sở hữu lá số để hỏi đáp.' },
          { status: 403 }
        );
      }

      // Nạp dữ liệu chuẩn từ DB (bỏ qua body.laSo / body.readingHtml / body.chatHistory giả mạo từ client)
      const dbLaSo = dbChart.laso_data as unknown as LaSoData | null;
      const dbDuongSo = dbChart.duong_so_data as unknown as LaSoData['duongSo'] | null;
      if (dbLaSo && Array.isArray(dbLaSo.cungs) && dbLaSo.cungs.length === 12) {
        effectiveLaSo = { ...dbLaSo, duongSo: dbDuongSo || dbLaSo.duongSo };
      } else if (dbDuongSo && dbDuongSo.ngayDuong && dbDuongSo.thangDuong && dbDuongSo.namDuong) {
        effectiveLaSo = lapLaSoTuVi(dbDuongSo);
      }
      effectiveReadingHtml = typeof dbChart.reading_html === 'string' ? dbChart.reading_html : undefined;
      if (dbDuongSo?.thongTinThem && !effectiveThongTinThem) {
        effectiveThongTinThem = String(dbDuongSo.thongTinThem).slice(0, 1500);
      }
      if (!effectiveChieuCao && dbDuongSo?.chieuCao) effectiveChieuCao = Number(dbDuongSo.chieuCao);
      if (!effectiveCanNang && dbDuongSo?.canNang) effectiveCanNang = Number(dbDuongSo.canNang);

      // Tải tối đa 12 lượt hỏi đáp gần nhất trực tiếp từ Supabase DB
      const { data: recentDbMsgs } = await adminSupabase
        .from('tuvi_chat_messages')
        .select('question, answer, message_type')
        .eq('chart_id', safeChartId)
        .neq('answer', '__PENDING__')
        .order('created_at', { ascending: false })
        .limit(12);

      effectiveHistory = (recentDbMsgs || [])
        .reverse()
        .map((m) => ({
          q: String(m.question || '').slice(0, 1000),
          a: String(m.answer || '').slice(0, 2000),
          type: (m.message_type as 'basic' | 'vip' | 'expert') || 'basic',
        }));

      // 2. Kiểm tra quyền lợi Tester (giới hạn tối đa gói Pro/VIP, không cấp miễn phí Expert)
      let testerProQuota = 0;
      const cleanAuthEmail = (authUser?.email || '').trim().toLowerCase();
      const { data: testerByUid } = await adminSupabase
        .from('tuvi_testers')
        .select('max_questions_per_chart, is_active')
        .eq('user_id', verifiedUserId)
        .maybeSingle();

      let testerRow = testerByUid;
      if (!testerRow && cleanAuthEmail) {
        const { data: testerByEmail } = await adminSupabase
          .from('tuvi_testers')
          .select('max_questions_per_chart, is_active')
          .eq('email', cleanAuthEmail)
          .maybeSingle();
        testerRow = testerByEmail;
      }

      if (testerRow && testerRow.is_active !== false) {
        testerProQuota = Number(testerRow.max_questions_per_chart || 20);
      }

      // 3. Tính hạn mức từ đơn hàng PAID của đúng lá số + tài khoản này
      const chartTier = dbChart.duong_so_data?.tier || dbChart.laso_data?.tier || 'free';
      let paidExpertOrders = 0;
      let paidUpgradeExpertOrders = 0;
      let paidChatExpertOrders = 0;
      let paidProOrders = 0;
      let paidChatVipOrders = 0;
      let paidChatBasicOrders = 0;

      const [chartOrdersRes, unlinkedUserOrdersRes] = await Promise.all([
        adminSupabase
          .from('tuvi_orders')
          .select('id, payment_type, status, chart_id, ho_ten')
          .eq('chart_id', safeChartId)
          .eq('status', 'PAID'),
        adminSupabase
          .from('tuvi_orders')
          .select('id, payment_type, status, chart_id, ho_ten')
          .eq('user_id', verifiedUserId)
          .is('chart_id', null)
          .eq('status', 'PAID'),
      ]);

      const targetHoTen = (dbChart.duong_so_data?.hoTen || '').trim().toLowerCase();
      const matchedUnlinked = (unlinkedUserOrdersRes.data || []).filter(
        (o) => Boolean(targetHoTen) && (o.ho_ten || '').trim().toLowerCase() === targetHoTen
      );

      // Gắn chart_id nguyên tử phía server cho các đơn chưa liên kết để không tái sử dụng cho lá số khác
      for (const uo of matchedUnlinked) {
        await adminSupabase
          .from('tuvi_orders')
          .update({ chart_id: safeChartId })
          .eq('id', uo.id)
          .is('chart_id', null);
      }

      const matchedOrders = [...(chartOrdersRes.data || []), ...matchedUnlinked];
      matchedOrders.forEach((o) => {
        if (o.payment_type === 'reading_expert') paidExpertOrders++;
        else if (o.payment_type === 'upgrade_expert') paidUpgradeExpertOrders++;
        else if (o.payment_type === 'chat_expert') paidChatExpertOrders++;
        else if (o.payment_type === 'reading_vip') paidProOrders++;
        else if (o.payment_type === 'chat_vip') paidChatVipOrders++;
        else if (o.payment_type === 'chat_free') paidChatBasicOrders++;
      });

      const orderExpertAllowed =
        (paidExpertOrders > 0 ? 2 : 0) +
        (paidUpgradeExpertOrders > 0 ? 2 : 0) +
        paidChatExpertOrders * 2;
      const orderProAllowed = (paidProOrders > 0 ? 2 : 0) + paidChatVipOrders * 2;
      const orderBasicAllowed = paidChatBasicOrders * 2;

      const quotaExpert = Number(dbChart.laso_data?.quota?.expertAllowed || 0);
      const quotaPro = Number(dbChart.laso_data?.quota?.proAllowed || 0);
      const quotaBasic = Number(dbChart.laso_data?.quota?.basicAllowed || 0);

      const baseExpert =
        chartTier === 'expert' || paidExpertOrders > 0 || paidUpgradeExpertOrders > 0 ? 2 : 0;
      const basePro = chartTier === 'pro' || paidProOrders > 0 ? 2 : 0;

      allowedExpert = Math.max(baseExpert, orderExpertAllowed, quotaExpert);
      allowedPro = Math.max(basePro, orderProAllowed, quotaPro, testerProQuota);
      allowedBasic = Math.max(orderBasicAllowed, quotaBasic);
      totalAllowed = allowedExpert + allowedPro + allowedBasic;

      if (totalAllowed === 0) {
        return NextResponse.json(
          {
            error:
              'Lá số này chưa đăng ký gói câu hỏi đàm đạo cùng Thầy Tôn. Quý khách vui lòng đăng ký gói hỏi đáp để tiếp tục.',
          },
          { status: 403 }
        );
      }

      if (activeMode === 'expert' && allowedExpert <= 0) {
        return NextResponse.json(
          { error: 'Lá số này chưa mở khóa lượt hỏi Chuyên Gia Expert.' },
          { status: 403 }
        );
      }
      if (activeMode === 'vip' && allowedPro <= 0 && allowedExpert <= 0) {
        return NextResponse.json(
          { error: 'Lá số này chưa mở khóa lượt hỏi Chuyên Sâu VIP Pro.' },
          { status: 403 }
        );
      }

      // Tính hạn mức riêng cho hạng mức đang yêu cầu (chống dùng gói 49k Cơ bản để hỏi Expert!)
      const modeLimit =
        activeMode === 'expert'
          ? allowedExpert
          : activeMode === 'vip'
          ? allowedPro + allowedExpert
          : totalAllowed;

      // 4. Đặt chỗ slot nguyên tử bằng PostgreSQL RPC (chống 100% TOCTOU race condition)
      const { data: reserveData, error: reserveErr } = await adminSupabase.rpc(
        'tuvi_reserve_chat_slot',
        {
          p_chart_id: safeChartId,
          p_user_id: verifiedUserId,
          p_question: cleanQuestion,
          p_mode: activeMode,
          p_mode_limit: modeLimit,
          p_total_limit: totalAllowed,
        }
      );

      if (!reserveErr && reserveData && typeof reserveData === 'object') {
        const resObj = reserveData as {
          ok?: boolean;
          message_id?: string;
          mode_used?: number;
          total_used?: number;
        };
        if (!resObj.ok) {
          return NextResponse.json(
            {
              error: `Lá số này đã sử dụng hết lượt câu hỏi phù hợp (${resObj.total_used ?? 0}/${totalAllowed}). Quý khách vui lòng nạp thêm câu hỏi để tiếp tục đàm đạo cùng Thầy Tôn.`,
            },
            { status: 403 }
          );
        }
        reservedMessageId = resObj.message_id || null;
        usedAtomicReservation = Boolean(reservedMessageId);
      } else {
        // Fallback nếu migration RPC chưa được push lên DB
        const { data: existingMsgs } = await adminSupabase
          .from('tuvi_chat_messages')
          .select('message_type')
          .eq('chart_id', safeChartId);
        const totalUsed = (existingMsgs || []).length;
        const modeUsed = (existingMsgs || []).filter(
          (m) => (m.message_type || 'basic') === activeMode
        ).length;
        if (totalUsed >= totalAllowed || modeUsed >= modeLimit) {
          return NextResponse.json(
            {
              error: `Lá số này đã sử dụng hết lượt câu hỏi phù hợp (${totalUsed}/${totalAllowed}). Quý khách vui lòng nạp thêm câu hỏi để tiếp tục đàm đạo cùng Thầy Tôn.`,
            },
            { status: 403 }
          );
        }
      }
    }

    if (!effectiveLaSo) {
      return NextResponse.json({ error: 'Thiếu thông tin lá số' }, { status: 400 });
    }

    const {
      banMenh,
      namXemCanChi,
      tuoiAmXem,
      amDuongTxt,
      thuanNghichLy,
      thanCuName,
      namCanChi,
      tenCuc,
      sinhKhac,
    } = effectiveLaSo;
    const cungDataStr = buildCungDataPrompt(effectiveLaSo);

    const tamHan = computeTamHanAnalysis(effectiveLaSo);
    let daiVanInfo = '';
    if (tamHan.cungDaiVan && tamHan.startAge !== undefined && tamHan.endAge !== undefined) {
      daiVanInfo = `Đại vận hiện tại: ${tamHan.startAge} - ${tamHan.endAge} tuổi tại ${tamHan.daiVanCoordLabel} (${tamHan.buocNhayMoTa || `${tuoiAmXem} tuổi Âm`}, cấm nhầm đại vận). `;
    } else {
      daiVanInfo = `Đang ở giai đoạn Đồng Hạn (${tuoiAmXem} tuổi Âm). `;
    }

    const tieuVanInfo = `Ba cung hạn năm ${effectiveLaSo.namXem || ''} (${namXemCanChi}): Cung Tiểu Hạn (tâm tư, mong muốn bên trong) tại ${tamHan.tieuVanCoordLabel || '—'}; Cung Lưu Niên Đại Hạn (điểm rơi của Đại vận 10 năm vào năm nay) tại ${tamHan.lndhCoordLabel || '—'}; Cung Lưu Thái Tuế (hoàn cảnh thực tế bên ngoài) tại ${tamHan.luuThaiTueCoordLabel || '—'} — phân biệt rành mạch 3 cung này, diễn đạt giản dị dễ hiểu, không ghi các con số phần trăm hay nhãn Bước 1/2/3! `;

    let contextChat = '';
    if (effectiveThongTinThem) {
      contextChat += `Hoàn cảnh: ${effectiveThongTinThem}. `;
    }
    if (effectiveChieuCao && effectiveCanNang && effectiveChieuCao > 0 && effectiveCanNang > 0) {
      contextChat += `Hình thể: ${effectiveChieuCao} cm, ${effectiveCanNang} kg. `;
    }

    const stripHtmlCompact = (raw?: string | null, maxLen?: number): string => {
      const cleaned = String(raw || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\s+/g, ' ')
        .trim();
      if (maxLen && cleaned.length > maxLen) {
        return cleaned.slice(0, maxLen).trimEnd() + '…';
      }
      return cleaned;
    };

    // Chặn phình lịch sử lũy tiến O(N^2):
    // - Lược bỏ toàn bộ thẻ HTML thừa trong các lượt hỏi đáp cũ
    // - Chỉ giữ chi tiết 4 lượt gần nhất (tối đa 600 ký tự câu hỏi + 1.200 ký tự trả lời/lượt)
    // - Các lượt cũ hơn (tối đa 6 lượt trước đó) chỉ giữ tóm tắt siêu gọn 1 dòng để giữ mạch ngữ cảnh
    let historyText = '';
    if (effectiveHistory.length > 0) {
      const RECENT_FULL_TURNS = 4;
      const MAX_OLDER_SUMMARY_TURNS = 6;
      const totalTurns = effectiveHistory.length;
      const recentStartIdx = Math.max(0, totalTurns - RECENT_FULL_TURNS);
      const olderStartIdx = Math.max(0, recentStartIdx - MAX_OLDER_SUMMARY_TURNS);

      historyText = 'LỊCH SỬ ĐÀM ĐẠO TRƯỚC ĐÓ:\n';
      if (olderStartIdx < recentStartIdx) {
        historyText += '(Tóm tắt các lượt hỏi cũ hơn):\n';
        for (let idx = olderStartIdx; idx < recentStartIdx; idx++) {
          const c = effectiveHistory[idx];
          const qShort = stripHtmlCompact(c.q, 160);
          const aShort = stripHtmlCompact(c.a, 220);
          historyText += `- Lượt ${idx + 1}: Hỏi "${qShort}" => Đáp: ${aShort}\n`;
        }
      }
      for (let idx = recentStartIdx; idx < totalTurns; idx++) {
        const c = effectiveHistory[idx];
        const tag = c.type === 'expert' ? '[Chuyên Gia Expert]' : c.type === 'vip' ? '[VIP Pro]' : '[Cơ Bản]';
        const qClean = stripHtmlCompact(c.q, 650);
        const aClean = stripHtmlCompact(c.a, 1200);
        historyText += `Lượt ${idx + 1} ${tag}:\n- Khách: ${qClean}\n- Thầy Tôn: ${aClean}\n`;
      }
      historyText += '\n';
    }

    let readingContext = '';
    if (effectiveReadingHtml && effectiveReadingHtml.trim()) {
      const maxReadingCtxChars = activeMode === 'expert' ? 4200 : 3200;
      const cleanReading = stripHtmlCompact(effectiveReadingHtml, maxReadingCtxChars);
      readingContext = `\nBÀI BÌNH GIẢI ĐÃ LUẬN TRƯỚC ĐÓ (kèm nhận định Diện tướng/Chỉ tay nếu có):\n"${cleanReading}"\n(Hãy kế thừa nhất quán những điểm đã luận ở trên khi khách hỏi liên quan).\n`;
    }

    const requirementText =
      activeMode === 'expert'
        ? `YÊU CẦU LUẬN GIẢI CHUYÊN GIA EXPERT: Trả lời uyên bác bậc Đại Tông Sư, cực kỳ sâu sắc, toàn diện 600-900 chữ. Phân tích thấu triệt mối tương quan giữa toàn bộ các cung liên quan trong 12 cung, 14 Chính tinh, bộ Phụ tinh cát/hung, Tứ Hóa (Lộc - Quyền - Khoa - Kỵ), Tuần/Triệt, Đại Vận 10 năm hiện tại, Tiểu Vận và Lưu Nguyệt 12 tháng. Chỉ rõ căn nguyên, thời điểm ứng kỳ và đưa ra sách lược hành động thực chiến cụ thể nhất để đón cát tránh hung. Xưng là Thầy Tôn. Định dạng bằng HTML chuẩn (<p>, <b>, <ul>, <li>). KHÔNG dùng markdown **.`
        : activeMode === 'vip'
        ? `YÊU CẦU LUẬN GIẢI CHUYÊN SÂU VIP PRO: Trả lời uyên bác, thấu đáo 400-600 chữ. Phân tích cặn kẽ tương quan 14 Chính tinh, các phụ tinh đắc hãm, Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ), Tuần/Triệt ảnh hưởng, Đại Vận 10 năm hiện tại và lưu niên năm nay. Đưa ra sách lược cụ thể, chỉ dẫn hóa giải điều hung đón điều cát. Xưng là Thầy Tôn. Định dạng bằng HTML chuẩn (<p>, <b>, <ul>, <li>). KHÔNG dùng markdown **.`
        : `YÊU CẦU LUẬN GIẢI CƠ BẢN: Trả lời 250-350 chữ cô đọng, dễ hiểu, ân cần, giải đáp thẳng thắn và chính xác vào trọng tâm câu hỏi của khách (về công danh, tài lộc, tình cảm hoặc gia đạo) dựa trên cung vị liên quan. Xưng là Thầy Tôn. Định dạng bằng HTML chuẩn (<p>, <b>). KHÔNG dùng markdown **.`;

    let langInstruction = '';
    if (targetLang === 'ja') {
      langInstruction = '\n\n【言語最高指令】：回答は100%美しく格調高い【日本語（丁寧語・敬語）】で記述してください！自称は「トン先生」または「当方」、相談者への呼称は「ご相談者様」としてください。正統派紫微斗数の専門用語を使用し、標準HTMLタグ（<p>, <b>, <ul>, <li>）を用いてください。Markdown太字（**）は使用禁止です。';
    } else if (targetLang === 'zh') {
      langInstruction = '\n\n【语言最高指令】：全文必须100%使用中文（规范中文）作答！自称“顿师”或“为师”，称呼求测者为“居士”或“缘主”。使用标准紫微斗数术语。使用标准HTML标签（<p>, <b>, <ul>, <li>），严禁使用Markdown粗体（**）。';
    } else if (targetLang === 'ko') {
      langInstruction = '\n\n【언어 필수 지침】：답변은 100% 품격 있는 한국어(존댓말)로 작성하십시오! 자칭은 \'톤 대사\' 혹은 \'이 사람\', 호칭은 \'귀하\' 혹은 \'의뢰인 님\'이라 칭하십시오. 자미두수 정통 한글 용어를 사용하십시오. 표준 HTML 태그(<p>, <b>, <ul>, <li>)를 사용하고 마크다운 **은 쓰지 마십시오.';
    } else if (targetLang === 'en') {
      langInstruction = '\n\n【LANGUAGE DIRECTIVE】：Answer 100% in refined and eloquent English! Refer to yourself as "Master Ton" and address the seeker respectfully. Use standard Western Zi Wei Dou Shu astrology terminology and valid HTML tags (<p>, <b>, <ul>, <li>). Do NOT use markdown **.';
    }

    const modeLabel =
      activeMode === 'expert'
        ? 'Gói Chuyên Gia Expert'
        : activeMode === 'vip'
        ? 'Gói Chuyên Sâu VIP Pro'
        : 'Gói Cơ Bản';

    const {
      ngayDuong: curDayD,
      thangDuong: curMonthD,
      namDuong: curYearD,
      ngayAm: curDayA,
      thangAm: curMonthA,
      namAm: curYearA,
      isLeap: curIsLeap,
      namAmCanChi: curNamCanChi,
    } = getCurrentVietnamTimeInfo();
    const curDateSummary = `Ngày ${curDayD}/${curMonthD}/${curYearD} Dương lịch — tức Ngày ${curDayA} Tháng ${curMonthA}${curIsLeap ? ' (Nhuận)' : ''} Âm lịch năm ${curNamCanChi} (${curYearA})`;

    // Xử lý chuẩn tháng Giêng (curMonthA === 1) và năm xem khác năm hiện tại
    const targetNamXem = effectiveLaSo.namXem || curYearA;
    const pastMonthsNotice =
      targetNamXem === curYearA && curMonthA > 1
        ? `Các tháng từ Tháng 1 đến Tháng ${curMonthA - 1} Âm lịch năm ${curYearA} ĐÃ TRÔI QUA TRONG QUÁ KHỨ! TUYỆT ĐỐI CẤM khuyên khách lập kế hoạch tương lai vào các tháng đã qua (Tháng 1 đến Tháng ${curMonthA - 1} Âm lịch năm ${curYearA}).`
        : targetNamXem === curYearA
        ? `Hiện đang ở đầu năm mới (Tháng 1 Âm lịch năm ${curYearA}), toàn bộ 12 tháng năm ${curYearA} đều đang ở phía trước.`
        : `Đương số đang xem hạn năm ${targetNamXem} (khác năm hiện tại ${curYearA}), hãy phân tích trọn vẹn 12 tháng của năm ${targetNamXem}.`;

    const chatPrompt = `${readingContext}${historyText}Khách hỏi câu mới (${modeLabel}): '${cleanQuestion}'
THỜI ĐIỂM HIỆN TẠI THỰC TẾ (GIỜ VIỆT NAM): Hôm nay là ${curDateSummary}. Hiện đang ở **Tháng ${curMonthA} Âm lịch** năm ${curNamCanChi} (${curYearA}).
Đương số: ${effectiveLaSo.duongSo?.hoTen || 'Quý khách'} (${effectiveLaSo.duongSo?.gioiTinh || 'Nam'}, sinh năm ${namCanChi || ''} - ${amDuongTxt || ''}).
Mệnh: ${banMenh || ''}, Cục: ${tenCuc || ''}, Sinh khắc: ${sinhKhac || ''}.
Âm Dương: ${thuanNghichLy || ''} (Bắt buộc khẳng định đúng thế "${thuanNghichLy}", tuyệt đối không nói ngược).
Thân cư: ${thanCuName || 'Thân cư Mệnh'}.
Năm xem hạn: ${namXemCanChi} (${targetNamXem}), ${tuoiAmXem} tuổi Âm. ${daiVanInfo}${tieuVanInfo}${contextChat}
12 CUNG & NGUYỆT VẬN:
${cungDataStr}

QUY TẮC BẮT BUỘC VỀ THỜI GIAN THỰC TẾ, CUNG VÔ CHÍNH DIỆU & NGUYỆT VẬN (LƯU NGUYỆT / THÁNG ÂM LỊCH):
- QUY TẮC SỐ 1 (THỜI GIAN THỰC TẾ HIỆN TẠI): Hôm nay là **${curDateSummary}**. ${pastMonthsNotice} Bạn TUYỆT ĐỐI CẤM viết câu phỏng đoán mù mờ như "Hiện tại nếu đang ở Tháng 3 Âm lịch..."! Phải khẳng định chuẩn xác hiện tại đang ở **Tháng ${curMonthA} Âm lịch** năm ${curYearA}. Mọi sự việc khách hỏi "hôm nay", "vừa mới", "hiện tại" phải được giải mã trực tiếp bằng Nguyệt vận **Tháng ${curMonthA} Âm lịch**.
- QUY TẮC SỐ 2 (CUNG VÔ CHÍNH DIỆU): Khi luận giải bất kỳ cung nào không có chính tinh (Vô Chính Diệu), bạn BẮT BUỘC phải nhìn và kết hợp các Chính tinh + Phụ tinh hội chiếu từ Tam Phương Tứ Chính (đặc biệt là mượn Chính tinh của Cung Xung Chiếu kết hợp 2 Cung Tam Hợp và Tuần/Triệt tại bản cung) để phân tích sâu sắc, tuyệt đối không chỉ nhìn mỗi bản cung.
- QUY TẮC SỐ 3 (TRA CỨU NGUYỆT VẬN CHUẨN 100%): Khi nhắc đến bất kỳ tháng Âm lịch nào, bạn BẮT BUỘC phải tra cứu chính xác theo 'BẢNG TRA CỨU NGUYỆT VẬN' ở trên để biết tháng đó rơi vào cung nào, có các chính tinh, phụ tinh và đặc biệt là các SAO LƯU nào thủ hoặc chiếu. Tuyệt đối KHÔNG được tự suy đoán hay nói nhầm sang cung khác.
- QUY TẮC SỐ 4 (PHỄU TAM HẠN & MA TRẬN 4 THẾ ĐẠI VẬN x HẠN NĂM): Khi khách hỏi về vận hạn năm hoặc quyết định hành động, BẮT BUỘC tuân thủ nguyên lý Cấp nhỏ phục tùng cấp lớn (Gốc -> Đại Vận 10 năm -> Hạn Năm) và tổng hợp nhân - quả theo Tam Hạn: đọc tâm thế khởi niệm ở Tiểu Hạn (tại ${tamHan.tieuVanCoordLabel || 'bản cung'}) -> đối chiếu sức chịu đựng & độ đồng pha ở Đại Vận + LN. Đại hạn (tại ${tamHan.lndhCoordLabel || 'bản cung'}) -> chốt kết quả ngoại cảnh thực tế ở Lưu Thái Tuế + Sao Lưu/Lưu Tứ Hóa (tại ${tamHan.luuThaiTueCoordLabel || 'bản cung'}). Văn phong bậc Thầy Mệnh lý Thực chứng: điềm đạm, sắc bén, thấu tình đạt lý, không mê tín hù dọa.
${requirementText}${langInstruction}`;

    const modelToUse =
      isAdmin && model
        ? model
        : activeMode === 'expert'
        ? 'gemini-4-carbon'
        : activeMode === 'vip'
        ? 'gemini-3.1-pro-preview'
        : 'gemini-2.5-flash';
    const result = await callGeminiVision([{ text: chatPrompt }], isAdmin ? apiKey : undefined, modelToUse);

    if (result.error || !result.text) {
      if (reservedMessageId) {
        await adminSupabase
          .from('tuvi_chat_messages')
          .delete()
          .eq('id', reservedMessageId)
          .eq('answer', '__PENDING__');
        reservedMessageId = null;
      }
      return NextResponse.json({ error: result.error || 'AI tạm thời không phản hồi' }, { status: 500 });
    }

    if (safeChartId && !isAdmin) {
      try {
        if (usedAtomicReservation && reservedMessageId) {
          await adminSupabase
            .from('tuvi_chat_messages')
            .update({ answer: result.text })
            .eq('id', reservedMessageId);
          reservedMessageId = null;
        } else {
          await adminSupabase.from('tuvi_chat_messages').insert({
            chart_id: safeChartId,
            user_id: verifiedUserId || null,
            question: cleanQuestion,
            answer: result.text,
            message_type: activeMode,
          });
        }
      } catch (saveErr) {
        console.warn('Lỗi khi tự động lưu tin nhắn từ máy chủ:', saveErr);
      }
    }

    return NextResponse.json({
      answer: result.text,
      mode: activeMode,
      savedToDb: Boolean(safeChartId && !isAdmin),
      modelUsed: result.modelUsed,
    });
  } catch (error: unknown) {
    if (reservedMessageId) {
      try {
        await adminSupabase
          .from('tuvi_chat_messages')
          .delete()
          .eq('id', reservedMessageId)
          .eq('answer', '__PENDING__');
      } catch {
        // ignore rollback error
      }
    }
    const msg = error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ';
    return NextResponse.json({ error: `Lỗi: ${msg}` }, { status: 500 });
  }
}
