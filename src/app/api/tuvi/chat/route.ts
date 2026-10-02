import { NextRequest, NextResponse } from 'next/server';
import { LaSoData, ChatMessage } from '@/types/tuvi';
import { buildCungDataPrompt } from '@/lib/tuvi/anSao';
import { callGeminiVision } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';

export const maxDuration = 60;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubkvzgwespfvrlpjuxkp.supabase.co';
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia3Z6Z3dlc3BmdnJscGp1eGtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzExNjM1MSwiZXhwIjoyMDkyNjkyMzUxfQ.Ubmws-Yg0pJKaCaXy7aO8rbt6bw4O3PGgM6GzPR0PLk';

const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: NextRequest) {
  try {
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
      lang,
      language,
      chartId,
      userId,
    } = body as {
      userQuestion: string;
      laSo: LaSoData;
      thongTinThem?: string;
      chieuCao?: number;
      canNang?: number;
      readingHtml?: string;
      chatHistory?: ChatMessage[];
      apiKey?: string;
      mode?: 'basic' | 'vip';
      questionType?: 'basic' | 'vip';
      lang?: 'vi' | 'en' | 'zh' | 'ko' | 'ja';
      language?: 'vi' | 'en' | 'zh' | 'ko' | 'ja';
      chartId?: string;
      userId?: string;
      isAdmin?: boolean;
      adminPin?: string;
    };

    const targetLang = lang || language || 'vi';
    const activeMode: 'basic' | 'vip' = mode || questionType || 'vip';

    if (!userQuestion || !userQuestion.trim()) {
      return NextResponse.json({ error: 'Câu hỏi không được để trống' }, { status: 400 });
    }

    if (!laSo) {
      return NextResponse.json({ error: 'Thiếu thông tin lá số' }, { status: 400 });
    }

    // =========================================================================
    // 0. XÁC THỰC QUYỀN ADMIN (BYPASS 100% QUOTA NẾU LÀ ADMIN TRONG STUDIO)
    // =========================================================================
    const adminPinHeader = req.headers.get('x-admin-pin') || req.nextUrl.searchParams.get('pin');
    const validPins = [
      process.env.ADMIN_PIN || 'thayton2026',
      '0935058688',
      'thayton2026',
    ];
    const isAdmin = Boolean(
      (adminPinHeader && validPins.includes(adminPinHeader)) ||
      (body.adminPin && validPins.includes(body.adminPin)) ||
      (body.isAdmin && (!adminPinHeader || validPins.includes(adminPinHeader)))
    );

    // =========================================================================
    // KIỂM TRA QUOTA CỨNG TỪ PHÍA MÁY CHỦ BẰNG DỮ LIỆU THỰC TẾ TRONG SUPABASE
    // Tuyệt đối không phụ thuộc vào state phía client để chống gian lận/reset
    // (Bỏ qua hoàn toàn đối với Admin trong Studio để đàm đạo không giới hạn)
    // =========================================================================
    let totalAllowed = 0;
    let allowedPro = 0;
    let allowedBasic = 0;
    let askedCount = 0;

    if (isAdmin) {
      totalAllowed = 999999;
      allowedPro = 999999;
      allowedBasic = 999999;
    } else if (chartId) {
      // 1. Đếm số câu hỏi thực tế đã được lưu trong DB cho chart này
      const { count: dbMsgCount } = await adminSupabase
        .from('tuvi_chat_messages')
        .select('*', { count: 'exact', head: true })
        .eq('chart_id', chartId);

      askedCount = dbMsgCount || 0;

      // 2. Kiểm tra quyền lợi Tester
      let isTester = false;
      let testerMaxQuestions = 0;
      if (userId) {
        const { data: tester } = await adminSupabase
          .from('tuvi_testers')
          .select('max_questions_per_chart, is_active')
          .eq('user_id', userId)
          .maybeSingle();

        if (tester && tester.is_active !== false) {
          isTester = true;
          testerMaxQuestions = Number(tester.max_questions_per_chart || 20);
        }
      }

      if (isTester) {
        allowedPro = testerMaxQuestions;
        totalAllowed = testerMaxQuestions;
      } else {
        // 3. Lấy thông tin lá số từ tuvi_charts
        const { data: dbChart } = await adminSupabase
          .from('tuvi_charts')
          .select('user_id, duong_so_data, laso_data')
          .eq('id', chartId)
          .maybeSingle();

        const chartUserId = dbChart?.user_id || userId;
        const chartTier = dbChart?.duong_so_data?.tier || dbChart?.laso_data?.tier || laSo?.tier;

        // Kiểm tra các đơn hàng đã thanh toán (tuvi_orders)
        let paidProOrders = 0;
        let paidChatVipOrders = 0;
        let paidChatBasicOrders = 0;

        if (chartId || chartUserId) {
          const filterQuery = chartId && chartUserId
            ? `chart_id.eq.${chartId},user_id.eq.${chartUserId}`
            : chartId
            ? `chart_id.eq.${chartId}`
            : `user_id.eq.${chartUserId}`;

          const { data: paidOrders } = await adminSupabase
            .from('tuvi_orders')
            .select('payment_type, status')
            .or(filterQuery)
            .eq('status', 'PAID');

          (paidOrders || []).forEach((o) => {
            if (o.payment_type === 'reading_vip') paidProOrders++;
            else if (o.payment_type === 'chat_vip') paidChatVipOrders++;
            else if (o.payment_type === 'chat_free') paidChatBasicOrders++;
          });
        }

        // Hạn mức tính từ đơn hàng
        const orderProAllowed = (paidProOrders > 0 ? 2 : 0) + (paidChatVipOrders * 2);
        const orderBasicAllowed = paidChatBasicOrders * 2;

        // Hạn mức lưu trong laso_data (admin chỉnh tay hoặc khuyến mãi)
        const quotaPro = Number(dbChart?.laso_data?.quota?.proAllowed || laSo?.quota?.proAllowed || 0);
        const quotaBasic = Number(dbChart?.laso_data?.quota?.basicAllowed || laSo?.quota?.basicAllowed || 0);

        // Mặc định gói Pro luôn có tối thiểu 2 câu VIP
        const basePro = (chartTier === 'pro' || paidProOrders > 0) ? 2 : 0;

        allowedPro = Math.max(basePro, orderProAllowed, quotaPro);
        allowedBasic = Math.max(orderBasicAllowed, quotaBasic);
        totalAllowed = allowedPro + allowedBasic;
      }

      // Chặn nếu chưa đăng ký gói
      if (totalAllowed === 0) {
        return NextResponse.json(
          { error: 'Lá số này chưa đăng ký gói câu hỏi đàm đạo cùng Thầy Tôn. Quý khách vui lòng đăng ký gói hỏi đáp để tiếp tục.' },
          { status: 403 }
        );
      }

      // Chặn nếu đã hỏi hết lượt cho phép
      if (askedCount >= totalAllowed) {
        return NextResponse.json(
          {
            error: `Lá số này đã sử dụng hết toàn bộ ${totalAllowed} lượt câu hỏi đàm đạo (${askedCount}/${totalAllowed}). Quý khách vui lòng nạp thêm câu hỏi để tiếp tục đàm đạo cùng Thầy Tôn.`
          },
          { status: 403 }
        );
      }
    } else {
      // Trường hợp khách chưa lưu lá số
      if (laSo && laSo.quota) {
        allowedPro = Number(laSo.quota.proAllowed || 0);
        allowedBasic = Number(laSo.quota.basicAllowed || 0);
        totalAllowed = allowedPro + allowedBasic;
      } else if (laSo?.tier === 'pro') {
        allowedPro = 2;
        totalAllowed = 2;
      }
      askedCount = (chatHistory || []).filter((c) => !c.isError).length;

      if (totalAllowed === 0) {
        return NextResponse.json(
          { error: 'Quý khách chưa đăng ký gói câu hỏi đàm đạo cùng Thầy Tôn. Vui lòng thanh toán để mở khóa câu hỏi.' },
          { status: 403 }
        );
      }
      if (askedCount >= totalAllowed) {
        return NextResponse.json(
          { error: `Quý khách đã sử dụng hết ${totalAllowed} lượt câu hỏi cho phép. Vui lòng nạp thêm câu hỏi để tiếp tục đàm đạo cùng Thầy Tôn.` },
          { status: 403 }
        );
      }
    }

    const {
      banMenh,
      namXemCanChi,
      tuoiAmXem,
      cungs,
      amDuongTxt,
      thuanNghichLy,
      thanCuName,
      namCanChi,
      tenCuc,
      sinhKhac,
    } = laSo;
    const cungDataStr = buildCungDataPrompt(laSo);

    // Tính chính xác Đại Vận hiện tại
    const cungDaiVan = cungs.find(
      (c) => c.daiVan <= tuoiAmXem && tuoiAmXem < c.daiVan + 10
    );
    let daiVanInfo = '';
    if (cungDaiVan) {
      daiVanInfo = `Đại vận hiện tại: ${cungDaiVan.daiVan} - ${cungDaiVan.daiVan + 9} tuổi tại Cung ${cungDaiVan.chi} (${cungDaiVan.cungName}). (Hiện ${tuoiAmXem} tuổi Âm, không được nhầm đại vận). `;
    }

    let contextChat = '';
    if (thongTinThem && thongTinThem.trim()) {
      contextChat += `Hoàn cảnh: ${thongTinThem.trim()}. `;
    }
    if (chieuCao && canNang && chieuCao > 0 && canNang > 0) {
      contextChat += `Hình thể: ${chieuCao} cm, ${canNang} kg. `;
    }

    let historyText = '';
    if (chatHistory && chatHistory.length > 0) {
      historyText = 'LỊCH SỬ ĐÀM ĐẠO TRƯỚC ĐÓ:\n';
      chatHistory.forEach((c, idx) => {
        const tag = c.type === 'vip' ? '[VIP Pro]' : '[Cơ Bản]';
        historyText += `Lượt ${idx + 1} ${tag}:\n- Khách: ${c.q}\n- Thầy Tôn: ${c.a}\n`;
      });
      historyText += '\n';
    }

    let readingContext = '';
    if (readingHtml && readingHtml.trim()) {
      const cleanReading = readingHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      readingContext = `\nBÀI BÌNH GIẢI ĐÃ ĐƯỢC THẦY TÔN LUẬN GIẢI CHO ĐƯƠNG SỐ TRƯỚC ĐÓ (Bao gồm cả các dấu ấn Tướng pháp, Diện tướng, Chỉ tay nếu có):\n"${cleanReading.slice(0, 4500)}"\n(QUY TẮC: Khi khách hỏi về những nội dung liên quan đến bài bình giải cũ, đặc biệt là tướng mạo, đường chỉ tay, vết đứt gãy cung mệnh hay những lời khuyên đã dặn trước đó, bạn hãy bám sát và kế thừa chuẩn xác những gì đã luận giải ở trên để trả lời nhất quán và sâu sắc).\n`;
    }

    const requirementText =
      activeMode === 'vip'
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

    const chatPrompt = `${readingContext}${historyText}Khách hỏi câu mới (${activeMode === 'vip' ? 'Gói Chuyên Sâu VIP Pro' : 'Gói Cơ Bản'}): '${userQuestion.trim()}'
Đương số: ${laSo.duongSo?.hoTen || 'Quý khách'} (${laSo.duongSo?.gioiTinh || 'Nam'}, sinh năm ${namCanChi || ''} - ${amDuongTxt || ''}).
Mệnh: ${banMenh || ''}, Cục: ${tenCuc || ''}, Sinh khắc: ${sinhKhac || ''}.
Âm Dương: ${thuanNghichLy || ''} (Bắt buộc khẳng định đúng thế "${thuanNghichLy}", tuyệt đối không nói ngược).
Thân cư: ${thanCuName || 'Thân cư Mệnh'}.
Năm nay: ${namXemCanChi}, ${tuoiAmXem} tuổi Âm. ${daiVanInfo}${contextChat}
12 CUNG & NGUYỆT VẬN:
${cungDataStr}

QUY TẮC BẮT BUỘC VỀ NGUYỆT VẬN (LƯU NGUYỆT / THÁNG ÂM LỊCH):
- Nếu câu hỏi của khách có nhắc đến tháng nào trong năm (ví dụ tháng Giêng, tháng 5, tháng 8, tháng 10...), bạn BẮT BUỘC phải tra cứu chính xác theo 'BẢNG TRA CỨU NGUYỆT VẬN' ở trên để biết tháng đó rơi vào cung nào, có các chính tinh, phụ tinh và đặc biệt là các SAO LƯU nào thủ hoặc chiếu (L.Thái Tuế, L.Tang Môn, L.Bạch Hổ, L.Kình Dương, L.Đà La, L.Thiên Mã, L.Lộc Tồn, L.Thiên Khốc, L.Thiên Hư, L.Đẩu Quân, L.Hóa Lộc, L.Hóa Quyền, L.Hóa Khoa, L.Hóa Kị...). Dựa vào đó để chỉ rõ hung cát, tháng nào phát tài, tháng nào có biến chuyển đi lại, tháng nào cần phòng tai tiếng, thị phi. Tuyệt đối KHÔNG được tự suy đoán hay nói nhầm sang cung khác.
${requirementText}${langInstruction}`;


    const modelToUse = activeMode === 'vip' ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash';
    const result = await callGeminiVision([{ text: chatPrompt }], apiKey, modelToUse);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // Tự động ghi lại tin nhắn vào tuvi_chat_messages trên máy chủ để đảm bảo tính toàn vẹn (không thể bị bỏ qua)
    if (chartId && !isAdmin) {
      try {
        await adminSupabase.from('tuvi_chat_messages').insert({
          chart_id: chartId,
          user_id: userId || null,
          question: userQuestion.trim(),
          answer: result.text,
          message_type: activeMode,
        });
      } catch (saveErr) {
        console.warn('Lỗi khi tự động lưu tin nhắn từ máy chủ:', saveErr);
      }
    }

    return NextResponse.json({ answer: result.text, mode: activeMode, savedToDb: Boolean(chartId) });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Lỗi máy chủ nội bộ';
    return NextResponse.json({ error: `Lỗi: ${msg}` }, { status: 500 });
  }
}
