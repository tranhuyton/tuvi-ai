import nodemailer from 'nodemailer';
import { inferBankCode } from '@/types/affiliate';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  headers?: Record<string, string>;
}

export interface PaymentEmailDetails {
  customerName: string;
  customerEmail: string;
  orderCode: string;
  amount: number;
  paymentType: 'reading_vip' | 'chat_free' | 'chat_vip' | string;
  paidAt?: string;
}

export interface WithdrawalEmailDetails {
  affiliateName: string;
  affiliateCode: string;
  phone?: string;
  email?: string;
  amount: number;
  bankName: string;
  bankCode?: string;
  bankAccountNumber: string;
  bankAccountName: string;
  remainingBalance?: number;
  requestedAt?: string;
}

/**
 * Hàm gửi email chung (Hỗ trợ Resend API, Gmail App Password, Custom SMTP và Fallback mô phỏng)
 */
export async function sendEmail(options: SendEmailOptions): Promise<{
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}> {
  const { to, subject, html } = options;
  const rawList = Array.isArray(to)
    ? to.flatMap((item) => String(item).split(/[,;]/))
    : String(to).split(/[,;]/);
  const validToList = rawList
    .map((e) => e.trim())
    .filter((e) => e && e.includes('@'));

  if (validToList.length === 0) {
    console.warn('[EMAIL] Không có địa chỉ email hợp lệ để gửi:', to);
    return { success: false, error: 'Không có địa chỉ email hợp lệ' };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const gmailUser = process.env.GMAIL_USER || process.env.EMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASS || process.env.GMAIL_PASS || process.env.EMAIL_PASS;
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const defaultSender = 'Tử Vi Thầy Tôn <thayton@tuvithayton.vn>';
  const smtpFrom = options.from || process.env.SMTP_FROM || defaultSender;
  const replyToEmail =
    options.replyTo || process.env.REPLY_TO_EMAIL || gmailUser || 'tranhuyton@gmail.com';

  // 1. Thử gửi qua Resend API nếu có cấu hình (Tên miền riêng đã xác thực DKIM/SPF)
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: smtpFrom.includes('@') ? smtpFrom : defaultSender,
          to: validToList,
          reply_to: replyToEmail,
          subject,
          html,
          ...(options.headers ? { headers: options.headers } : {}),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log('[EMAIL RESEND] Gửi email thành công:', data.id);
        return { success: true, messageId: data.id };
      }
      console.warn('[EMAIL RESEND] Lỗi gửi email Resend:', data);
    } catch (err: any) {
      console.warn('[EMAIL RESEND] Ngoại lệ khi gọi Resend:', err?.message || err);
    }
  }

  // 2. Thử gửi qua Gmail (Nodemailer service: 'gmail') nếu có GMAIL_USER & GMAIL_APP_PASS
  if (gmailUser && gmailPass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      });

      const gmailSender = `"Tử Vi Thầy Tôn" <${gmailUser}>`;

      const info = await transporter.sendMail({
        from: gmailSender,
        replyTo: replyToEmail,
        to: validToList.join(','),
        subject,
        html,
        headers: options.headers,
      });

      console.log('[EMAIL GMAIL] Gửi email thành công qua Gmail:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('[EMAIL GMAIL] Lỗi gửi qua Gmail:', err?.message || err);
    }
  }

  // 3. Thử gửi qua SMTP Nodemailer thông thường (nếu có cấu hình SMTP_HOST)
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to: validToList.join(','),
        subject,
        html,
      });

      console.log('[EMAIL SMTP] Gửi email thành công qua SMTP:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('[EMAIL SMTP] Lỗi gửi email qua SMTP:', err?.message || err);
    }
  }

  // 4. Fallback mô phỏng nếu chưa cấu hình SMTP/Resend
  console.log(`[EMAIL SIMULATED] Tiêu đề: "${subject}" | Gửi tới: ${validToList.join(', ')}`);
  return {
    success: true,
    simulated: true,
    messageId: `sim_${Date.now()}`,
  };
}

/**
 * Gửi email xác nhận thanh toán thành công & hướng dẫn truy cập dịch vụ cho khách hàng
 */
export async function sendPaymentSuccessEmail(details: PaymentEmailDetails): Promise<{
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}> {
  const { customerName, customerEmail, orderCode, amount, paymentType, paidAt } = details;

  if (!customerEmail || !customerEmail.includes('@')) {
    console.warn('[EMAIL] Không có email hợp lệ của khách hàng:', customerEmail);
    return { success: false, error: 'Email không hợp lệ' };
  }

  let serviceTitle = 'Luận Giải Tử Vi Chuyên Sâu (Bản Pro)';
  let serviceDesc =
    'Bản luận giải đại pháp chuyên sâu đa tầng của Thầy Tôn (14 chính tinh, Diện tướng, Thủ tướng, Đại vận 10 năm và 4 mùa) đã được kích hoạt thành công trên lá số của quý khách.';

  if (paymentType === 'course_tuvi') {
    serviceTitle = 'Khóa Học Tử Vi Đẩu Số Thực Chiến Cùng Thầy Tôn (Trọn Bộ Podcast & Giáo Trình)';
    serviceDesc =
      'Quý khách đã mở khóa thành công trọn bộ 24 bài giảng Podcast & Giáo trình Tử Vi Đẩu Số tương tác trên Web của Thầy Tôn (14 Chính tinh, Lục Cát, Lục Sát, Tứ Hóa, 4 Cách Cục lớn & Luận giải vận hạn). Quý khách có thể truy cập trực tiếp tại https://www.tuvithayton.vn/khoa-hoc bằng tài khoản hoặc nhập Mã giao dịch này để học mọi lúc mọi nơi.';
  } else if (paymentType === 'reading_expert') {
    serviceTitle = 'Luận Giải Tử Vi Bản Chuyên Gia Expert';
    serviceDesc =
      'Bản luận giải Chuyên Gia Expert cao cấp nhất (khảo sát chi tiết toàn diện 12 Cung, độ dài gấp 2 lần Bản Pro, kèm 02 câu hỏi Chuyên Gia miễn phí) đã được kích hoạt thành công trên lá số của quý khách.';
  } else if (paymentType === 'upgrade_expert') {
    serviceTitle = 'Nâng Cấp Bản Chuyên Gia Expert (Từ Bản Pro -> Expert)';
    serviceDesc =
      'Lá số của quý khách đã được nâng cấp thành công từ Bản Pro lên Bản Chuyên Gia Expert (luận giải kỹ trọn bộ 12 Cung gấp 2 lần và tặng thêm 02 câu hỏi Chuyên Gia cùng Thầy Tôn).';
  } else if (paymentType === 'chat_expert') {
    serviceTitle = '02 Câu Hỏi Thỉnh Giáo Chuyên Gia Cùng Thầy Tôn (Bản Expert)';
    serviceDesc =
      'Quý khách đã được cộng thêm 02 lượt đàm đạo cấp độ Chuyên Gia Expert trực tiếp cùng Thầy Tôn.';
  } else if (paymentType === 'chat_vip') {
    serviceTitle = '02 Câu Hỏi Thỉnh Giáo Chuyên Sâu Cùng Thầy Tôn (Bản Pro)';
    serviceDesc =
      'Quý khách đã được cộng thêm 02 lượt hỏi đáp chuyên sâu trực tiếp cùng Thầy Tôn trên hệ thống Tử Vi.';
  } else if (paymentType === 'chat_free') {
    serviceTitle = '02 Câu Hỏi Thỉnh Giáo Thầy Tôn (Bản Cơ Bản)';
    serviceDesc =
      'Quý khách đã được kích hoạt 02 lượt đàm đạo trực tiếp cùng Thầy Tôn về công danh, sự nghiệp, tình duyên, gia đạo.';
  }

  const formattedAmount = amount.toLocaleString('vi-VN') + ' đ';
  const timeStr = paidAt
    ? new Date(paidAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    : new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tử Vi Thầy Tôn - Xác Nhận Kích Hoạt</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    .header { background: linear-gradient(135deg, #1e1b4b 0%, #451a03 100%); padding: 30px 24px; text-align: center; border-bottom: 1px solid rgba(245, 158, 11, 0.2); }
    .logo-badge { display: inline-block; background: #f59e0b; color: #0f172a; font-weight: bold; font-size: 14px; padding: 6px 14px; border-radius: 9999px; margin-bottom: 12px; letter-spacing: 1px; }
    .title { font-size: 22px; font-weight: bold; color: #fbbf24; margin: 0; font-family: 'Times New Roman', Georgia, serif; }
    .content { padding: 28px 24px; }
    .greeting { font-size: 16px; margin-bottom: 16px; color: #f3f4f6; }
    .status-box { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center; }
    .status-title { color: #34d399; font-weight: bold; font-size: 16px; margin: 0 0 6px 0; }
    .status-desc { color: #a7f3d0; font-size: 13px; margin: 0; }
    .order-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; background: rgba(15, 23, 42, 0.6); border-radius: 10px; overflow: hidden; border: 1px solid #1f2937; }
    .order-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid #1f2937; }
    .order-table td.label { color: #94a3b8; width: 40%; }
    .order-table td.value { color: #f8fafc; font-weight: 600; }
    .cta-btn { display: block; width: fit-content; margin: 20px auto; padding: 14px 28px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0b0f19; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 10px; text-align: center; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); }
    .support-box { border-top: 1px solid #1f2937; padding-top: 20px; font-size: 12px; color: #94a3b8; line-height: 1.6; text-align: center; }
    .support-box a { color: #fbbf24; text-decoration: none; font-weight: 600; }
    .footer { background: #0a0e17; padding: 18px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">✦ TỬ VI ĐẨU SỐ • THẦY TÔN ✦</div>
      <h1 class="title">XÁC NHẬN KÍCH HOẠT DỊCH VỤ</h1>
    </div>

    <div class="content">
      <p class="greeting">Kính gửi quý khách <strong>${customerName}</strong>,</p>

      <div class="status-box">
        <div class="status-title">✔ Giao dịch thanh toán thành công</div>
        <div class="status-desc">Hệ thống đã tự động mở khóa quyền lợi tương ứng cho lá số của quý khách.</div>
      </div>

      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 20px;">
        ${serviceDesc}
      </p>

      <table class="order-table">
        <tr>
          <td class="label">Mã giao dịch:</td>
          <td class="value" style="color: #fbbf24; font-family: monospace; font-size: 14px;">${orderCode}</td>
        </tr>
        <tr>
          <td class="label">Dịch vụ kích hoạt:</td>
          <td class="value">${serviceTitle}</td>
        </tr>
        <tr>
          <td class="label">Số tiền đã thanh toán:</td>
          <td class="value" style="color: #34d399;">${formattedAmount}</td>
        </tr>
        <tr>
          <td class="label">Thời gian hoàn tất:</td>
          <td class="value">${timeStr}</td>
        </tr>
        <tr>
          <td class="label">Tài khoản nhận:</td>
          <td class="value">VPBank • 3386386 (TRAN THI DIEP)</td>
        </tr>
      </table>

      <a href="https://tuvithayton.vn" class="cta-btn">
        Trải Nghiệm Dịch Vụ Ngay ➜
      </a>

      <div class="support-box">
        Nếu quý khách cần hỗ trợ thêm, đặt lịch xem diện kiến trực tiếp hoặc đàm đạo chuyên sâu cùng Thầy Tôn:<br/>
        Hotline / Zalo: <a href="tel:0935058688">0935.058.688</a> |
        <a href="https://zalo.me/0935058688" target="_blank">Nhắn Zalo Thầy Tôn</a>
      </div>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Tử Vi Thầy Tôn. Trân trọng cảm ơn sự tín nhiệm của quý khách!
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: customerEmail,
    subject: `[Tử Vi Thầy Tôn] Kích hoạt thành công dịch vụ - Mã ${orderCode}`,
    html: htmlContent,
  });
}

/**
 * Gửi email thông báo rút tiền hoa hồng cho Thầy Tôn (và bản xác nhận cho CTV nếu có email)
 */
export async function sendWithdrawalNotificationEmail(details: WithdrawalEmailDetails): Promise<{
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}> {
  const {
    affiliateName,
    affiliateCode,
    phone,
    email,
    amount,
    bankName,
    bankCode = 'MB',
    bankAccountNumber,
    bankAccountName,
    remainingBalance = 0,
    requestedAt,
  } = details;

  const primaryAdminEmail =
    process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'tranhuyton@gmail.com';
  const adminEmail = Array.from(
    new Set([primaryAdminEmail, 'diep.anh.12135@gmail.com'].map((e) => e.trim()).filter(Boolean))
  );
  const formattedAmount = amount.toLocaleString('vi-VN') + ' đ';
  const remainingFormatted = remainingBalance.toLocaleString('vi-VN') + ' đ';
  const timeStr = requestedAt
    ? new Date(requestedAt).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })
    : new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  const transferNote = `HOA HONG ${affiliateCode.toUpperCase()}`;
  const cleanBankCode = bankCode || inferBankCode(bankName);
  const cleanAccNum = bankAccountNumber.trim();
  const cleanAccName = bankAccountName.trim().toUpperCase();

  const vietQrUrl = `https://img.vietqr.io/image/${cleanBankCode}-${cleanAccNum}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(
    transferNote
  )}&accountName=${encodeURIComponent(cleanAccName)}`;

  // Tạo link xác nhận 1-Click ngay trong Email (phòng trường hợp chuyển từ ngân hàng không gắn SePay)
  const reqId = String(Date.now());
  const secret =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'tuvi_thay_ton_payout_secret';
  const crypto = await import('crypto');
  const sig = crypto
    .createHmac('sha256', secret)
    .update(`${affiliateCode.toLowerCase()}:${amount}:${reqId}`)
    .digest('hex')
    .slice(0, 20);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tuvithayton.vn';
  const oneClickConfirmUrl = `${baseUrl}/api/affiliate/confirm-payout?code=${encodeURIComponent(
    affiliateCode
  )}&amount=${amount}&reqId=${reqId}&sig=${sig}`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yêu Cầu Rút Tiền Hoa Hồng - Tử Vi Thầy Tôn</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 16px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.6); }
    .header { background: linear-gradient(135deg, #1e1b4b 0%, #451a03 100%); padding: 30px 24px; text-align: center; border-bottom: 1px solid rgba(245, 158, 11, 0.3); }
    .logo-badge { display: inline-block; background: #f59e0b; color: #0f172a; font-weight: bold; font-size: 13px; padding: 6px 16px; border-radius: 9999px; margin-bottom: 12px; letter-spacing: 1px; }
    .title { font-size: 21px; font-weight: bold; color: #fbbf24; margin: 0; font-family: 'Times New Roman', Georgia, serif; }
    .content { padding: 28px 24px; }
    .alert-box { background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: center; }
    .alert-title { color: #fbbf24; font-weight: bold; font-size: 16px; margin: 0 0 6px 0; }
    .alert-desc { color: #fde68a; font-size: 13px; margin: 0; }
    .amount-highlight { background: rgba(16, 185, 129, 0.15); border: 1px dashed rgba(16, 185, 129, 0.5); border-radius: 12px; padding: 18px; margin-bottom: 24px; text-align: center; }
    .amount-label { font-size: 12px; color: #a7f3d0; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: 600; }
    .amount-val { font-size: 30px; font-weight: bold; color: #34d399; margin: 0; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; background: rgba(15, 23, 42, 0.7); border-radius: 12px; overflow: hidden; border: 1px solid #1f2937; }
    .info-table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid #1f2937; }
    .info-table td.label { color: #94a3b8; width: 38%; }
    .info-table td.value { color: #f8fafc; font-weight: 600; }
    .qr-card { background: #0f172a; border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 14px; padding: 22px; text-align: center; margin: 24px 0; }
    .qr-title { color: #fbbf24; font-size: 13px; font-weight: bold; margin-bottom: 14px; letter-spacing: 0.5px; }
    .qr-img { display: block; margin: 0 auto; border-radius: 10px; background: #ffffff; padding: 10px; box-shadow: 0 6px 20px rgba(0,0,0,0.6); max-width: 230px; width: 100%; height: auto; }
    .qr-sub { color: #94a3b8; font-size: 12px; margin-top: 12px; margin-bottom: 0; line-height: 1.5; }
    .confirm-btn { display: block; width: fit-content; margin: 20px auto 12px auto; padding: 14px 28px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.35); }
    .cta-btn { display: block; width: fit-content; margin: 12px auto 16px auto; padding: 10px 24px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); color: #fbbf24 !important; text-decoration: none; font-weight: bold; font-size: 13px; border-radius: 10px; text-align: center; }
    .footer { background: #0a0e17; padding: 18px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-badge">✦ TỬ VI ĐẨU SỐ • THẦY TÔN ✦</div>
      <h1 class="title">YÊU CẦU RÚT TIỀN HOA HỒNG</h1>
    </div>

    <div class="content">
      <div class="alert-box">
        <div class="alert-title">💸 Có yêu cầu rút hoa hồng mới từ CTV</div>
        <div class="alert-desc">Thầy có thể mở App ngân hàng quét trực tiếp mã VietQR bên dưới để chuyển tiền trong 3 giây.</div>
      </div>

      <div class="amount-highlight">
        <div class="amount-label">Số Tiền CTV Yêu Cầu Rút</div>
        <div class="amount-val">${formattedAmount}</div>
      </div>

      <table class="info-table">
        <tr>
          <td class="label">Cộng tác viên:</td>
          <td class="value">${affiliateName}</td>
        </tr>
        <tr>
          <td class="label">Mã CTV:</td>
          <td class="value" style="color: #fbbf24; font-family: monospace; font-size: 14px;">${affiliateCode}</td>
        </tr>
        ${phone ? `<tr><td class="label">Số điện thoại:</td><td class="value"><a href="tel:${phone}" style="color: #60a5fa; text-decoration: none;">${phone}</a></td></tr>` : ''}
        ${email ? `<tr><td class="label">Email CTV:</td><td class="value">${email}</td></tr>` : ''}
        <tr>
          <td class="label">Số dư khả dụng hiện tại:</td>
          <td class="value" style="color: #a7f3d0;">${remainingFormatted}</td>
        </tr>
        <tr>
          <td class="label">Thời gian yêu cầu:</td>
          <td class="value">${timeStr}</td>
        </tr>
        <tr>
          <td class="label">Ngân hàng thụ hưởng:</td>
          <td class="value">${bankName}</td>
        </tr>
        <tr>
          <td class="label">Số tài khoản nhận:</td>
          <td class="value" style="color: #fbbf24; font-family: monospace; font-size: 15px;">${cleanAccNum}</td>
        </tr>
        <tr>
          <td class="label">Tên chủ tài khoản:</td>
          <td class="value" style="text-transform: uppercase;">${cleanAccName}</td>
        </tr>
      </table>

      <!-- KHỐI MÃ VIETQR ĐỘNG -->
      <div class="qr-card">
        <div class="qr-title">⚡ QUÉT MÃ VIETQR CHUYỂN KHOẢN TRONG 3 GIÂY</div>
        <img src="${vietQrUrl}" alt="Mã VietQR Chuyển Tiền Cho CTV" class="qr-img" />
        <p class="qr-sub">
          Mã QR đã chứa sẵn: <strong>${cleanAccNum}</strong> (${cleanBankCode}) • <strong>${formattedAmount}</strong><br/>
          Nội dung: <code style="color: #fbbf24; font-weight: bold;">${transferNote}</code>
        </p>
      </div>

      <a href="${oneClickConfirmUrl}" class="confirm-btn">
        ✅ Xác Nhận Đã Chuyển Khoản (Trừ Số Dư CTV Ngay)
      </a>

      <a href="${baseUrl}/admin" class="cta-btn">
        Mở Trang Quản Trị Admin ➜
      </a>

      <p style="text-align: center; font-size: 12px; color: #94a3b8; margin: 0; line-height: 1.5;">
        • <b>Tự động 100%:</b> Nếu Thầy quét QR bằng tài khoản ngân hàng đã kết nối SePay (có bật báo biến động tiền ra), hệ thống sẽ tự động bắt nội dung <code>${transferNote}</code> và trừ số dư CTV ngay khi tiền đi.<br/>
        • <b>Hoặc 1-Click:</b> Nếu Thầy quét QR từ tài khoản ngân hàng cá nhân khác, chỉ cần bấm nút <b>"Xác Nhận Đã Chuyển Khoản"</b> màu xanh ngay trên email này là xong!
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Tử Vi Thầy Tôn • Bát Bộ Thần Sát &amp; Tướng Pháp Bí Truyền
    </div>
  </div>
</body>
</html>
  `;

  // Gửi email cho Admin (Thầy Tôn + Chị Điệp quản lý TK SePay)
  const adminResults = await Promise.all(
    adminEmail.map((recipient) =>
      sendEmail({
        to: recipient,
        subject: `💸 [Tử Vi Thầy Tôn] Yêu cầu rút tiền hoa hồng: ${affiliateName} (${formattedAmount})`,
        html: htmlContent,
      })
    )
  );
  const adminResult = adminResults.find((r) => r.success) || adminResults[0];

  // Nếu CTV có email, gửi thêm 1 email xác nhận cho CTV
  if (email && email.includes('@')) {
    const ctvHtml = `
<div style="background-color: #0b0f19; padding: 25px 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #111827; border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 16px; overflow: hidden;">
    <div style="background: linear-gradient(135deg, #1e1b4b 0%, #451a03 100%); padding: 24px; text-align: center;">
      <h2 style="color: #fbbf24; margin: 0; font-size: 18px;">✦ TỬ VI THẦY TÔN • CỔNG CỘNG TÁC VIÊN ✦</h2>
    </div>
    <div style="padding: 24px; color: #cbd5e1; line-height: 1.6; font-size: 14px;">
      <p>Xin chào <strong>${affiliateName}</strong>,</p>
      <p>Hệ thống đã tiếp nhận yêu cầu rút tiền hoa hồng của bạn với số tiền: <b style="color: #34d399; font-size: 16px;">${formattedAmount}</b>.</p>
      <div style="background: #0f172a; padding: 14px; border-radius: 8px; margin: 16px 0;">
        • Tài khoản nhận: <b>${bankName}</b> - <b>${cleanAccNum}</b> (${cleanAccName})<br/>
        • Thời gian gửi: <b>${timeStr}</b>
      </div>
      <p>Thầy Tôn sẽ kiểm tra và chuyển khoản trực tiếp qua VietQR đến tài khoản của bạn trong thời gian sớm nhất.</p>
      <p>Trân trọng cảm ơn bạn đã đồng hành lan tỏa Tử Vi Thầy Tôn!</p>
    </div>
  </div>
</div>
    `;

    try {
      await sendEmail({
        to: email,
        subject: `[Tử Vi Thầy Tôn] Đã tiếp nhận yêu cầu rút tiền hoa hồng (${formattedAmount})`,
        html: ctvHtml,
      });
    } catch {
      // ignore
    }
  }

  return adminResult;
}


export interface DripFunnelEmailDetails {
  stage: 'reminder_1h' | 'voucher_20_24h' | 'voucher_30_72h' | 'voucher_30_6m';
  recipientEmail: string;
  customerName: string;
  chartId?: string | null;
  chartSummary?: {
    hoTen?: string;
    namDuong?: number;
    gioiTinh?: string;
    namCanChi?: string;
    banMenh?: string;
    chinhTinhMenh?: string;
    namXem?: number;
  } | null;
  voucherCode?: string | null;
  ctaBaseUrl: string;
  ctaProUrl: string;
  ctaExpertUrl: string;
  unsubscribeUrl: string;
}

/**
 * Gửi chuỗi 4 email chăm sóc tự động & ưu đãi đếm ngược cá nhân hóa theo Lá Số
 */
export async function sendDripFunnelEmail(details: DripFunnelEmailDetails): Promise<{
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}> {
  const {
    stage,
    recipientEmail,
    customerName,
    chartSummary,
    voucherCode,
    ctaBaseUrl,
    ctaProUrl,
    ctaExpertUrl,
    unsubscribeUrl,
  } = details;

  const displayName = (chartSummary?.hoTen || customerName || 'Quý khách').trim();
  const namXem = chartSummary?.namXem || new Date().getFullYear();
  const hasChart = Boolean(chartSummary?.namDuong);
  const canChiLabel = chartSummary?.namCanChi
    ? `${chartSummary.namCanChi} (${chartSummary.namDuong})`
    : chartSummary?.namDuong
    ? `sinh năm ${chartSummary.namDuong}`
    : '';
  const menhDetail = [
    chartSummary?.banMenh ? `Bản mệnh <strong>${chartSummary.banMenh}</strong>` : '',
    chartSummary?.chinhTinhMenh
      ? `Cung Mệnh tọa thủ <strong>${chartSummary.chinhTinhMenh}</strong>`
      : '',
  ]
    .filter(Boolean)
    .join(' • ');

  let subject = '';
  let badgeText = '';
  let headerTitle = '';
  let introHtml = '';
  let highlightBoxHtml = '';
  let pricingBlockHtml = '';

  if (stage === 'reminder_1h') {
    subject = hasChart
      ? `Lá số ${canChiLabel} của ${displayName} còn những ẩn số quan trọng trong năm ${namXem}...`
      : `${displayName} ơi, Sổ Tay Số Mệnh của quý khách đã sẵn sàng khai mở lá số năm ${namXem}`;
    badgeText = '✦ LƯU GIỮ LÁ SỐ • TỬ VI THẦY TÔN ✦';
    headerTitle = 'ẨN SỐ CUNG MỆNH & ĐẠI VẬN CHƯA KHAI MỞ';
    introHtml = hasChart
      ? `
        <p style="font-size: 15px; color: #e2e8f0; line-height: 1.7; margin-bottom: 16px;">
          Lá số <strong>${canChiLabel}</strong> của <strong>${displayName}</strong> ${menhDetail ? `(${menhDetail})` : ''} đã được hệ thống an sao và lưu giữ an toàn trong Sổ Tay Số Mệnh.
        </p>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 18px;">
          Bản bình giải miễn phí mới chỉ phác họa tổng quan bề nổi. Những nút thắt quyết định nhất về <strong>cơ hội bứt phá Tài Bạch, biến động Quan Lộc, Gia Đạo, đối chiếu Diện Tướng - Chỉ Tay</strong> và <strong>thời điểm cát hung từng tháng năm ${namXem}</strong> hiện vẫn đang chờ quý khách khai mở trọn vẹn.
        </p>
      `
      : `
        <p style="font-size: 15px; color: #e2e8f0; line-height: 1.7; margin-bottom: 16px;">
          Cảm ơn <strong>${displayName}</strong> đã khởi tạo tài khoản tại <strong>Tử Vi Thầy Tôn</strong>. Quý khách có thể lập lá số miễn phí ngay hoặc mở khóa bài luận giải chuyên sâu để nắm bắt thời vận năm ${namXem}.
        </p>
      `;

    highlightBoxHtml = `
      <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 12px; padding: 18px; margin-bottom: 22px;">
        <div style="color: #fbbf24; font-weight: bold; font-size: 15px; margin-bottom: 8px;">🔍 Vì sao hàng nghìn đương số chọn mở khóa Luận Giải Chuyên Sâu?</div>
        <ul style="margin: 0; padding-left: 18px; color: #e2e8f0; font-size: 13.5px; line-height: 1.75;">
          <li><strong>Bản Chuyên Sâu Pro (119.000đ):</strong> Dài gấp 2,5 lần bản miễn phí (~2.500 từ), kết hợp soi Diện Tướng &amp; Chỉ Tay, Đại vận 10 năm, Vận khí 4 mùa + <strong>Tặng 02 câu hỏi VIP cùng Thầy Tôn</strong>.</li>
          <li><strong>Bản Chuyên Gia Expert (269.000đ):</strong> Tuyệt học mệnh lý đỉnh cao (~4.500 - 5.000 từ), mổ xẻ cặn kẽ <strong>trọn bộ 12 Cung + Cung Thân</strong>, bản đồ Lưu Nguyệt 12 tháng Âm lịch + <strong>Tặng 02 câu hỏi Chuyên Gia</strong>.</li>
        </ul>
      </div>
    `;

    pricingBlockHtml = `
      <div style="text-align: center; margin: 24px 0;">
        <a href="${ctaExpertUrl}" style="display: block; max-width: 420px; margin: 0 auto 12px auto; padding: 14px 22px; background: linear-gradient(135deg, #9333ea 0%, #d97706 100%); color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 12px; box-shadow: 0 4px 14px rgba(147, 51, 234, 0.35);">
          💎 Mở Khóa Bản Chuyên Gia 12 Cung (269.000đ) ➜
        </a>
        <a href="${ctaProUrl}" style="display: block; max-width: 420px; margin: 0 auto 12px auto; padding: 13px 22px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0b0f19 !important; text-decoration: none; font-weight: bold; font-size: 14.5px; border-radius: 12px;">
          👑 Mở Khóa Bản Chuyên Sâu Pro (119.000đ) ➜
        </a>
        <a href="${ctaBaseUrl}" style="display: inline-block; margin-top: 4px; color: #fbbf24; font-size: 13px; text-decoration: underline;">
          Hoặc xem lại lá số đã lưu trong Sổ Tay của quý khách
        </a>
      </div>
    `;
  } else if (stage === 'voucher_20_24h') {
    subject = `🎁 Dành riêng cho ${displayName}: Tặng mã giảm 20% mở khóa Luận Giải (Tự hủy sau 12 giờ)`;
    badgeText = '✦ ĐẶC QUYỀN HỮU DUYÊN • GIẢM 20% ✦';
    headerTitle = 'ƯU ĐÃI 20% DÀNH RIÊNG CHO LÁ SỐ CỦA BẠN';
    introHtml = `
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.7; margin-bottom: 14px;">
        Kính chào <strong>${displayName}</strong>, hôm qua quý khách đã lưu ${hasChart ? `lá số <strong>${canChiLabel}</strong>` : 'tài khoản'} tại Tử Vi Thầy Tôn nhưng chưa kịp khai mở bài luận giải chuyên sâu.
      </p>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 18px;">
        Gửi lời tri ân hữu duyên, hệ thống dành tặng riêng cho tài khoản của quý khách mã ưu đãi <strong>GIẢM 20%</strong> phí mở khóa Luận Giải. Đồng hồ hiệu lực <strong>12 tiếng</strong> sẽ bắt đầu đếm ngược ngay khi quý khách bấm mở liên kết bên dưới:
      </p>
    `;

    highlightBoxHtml = `
      <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(124, 45, 18, 0.28) 100%); border: 1.5px dashed #fbbf24; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 22px;">
        <div style="font-size: 12px; color: #fde68a; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Mã Ưu Đãi Cá Nhân (Chỉ Dùng 01 Lần)</div>
        <div style="font-size: 26px; font-weight: 800; color: #fbbf24; font-family: monospace; letter-spacing: 2px; margin: 8px 0;">${voucherCode}</div>
        <div style="font-size: 13px; color: #fca5a5; font-weight: 600;">⏳ Tự động hết hạn sau 12 giờ kể từ lúc mở thư</div>
      </div>
    `;

    pricingBlockHtml = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; background: #0f172a; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
        <tr>
          <td style="padding: 14px 16px; border-bottom: 1px solid #1e293b;">
            <div style="color: #fbbf24; font-weight: bold; font-size: 14.5px;">👑 Bản Chuyên Sâu VIP Pro (+02 câu hỏi VIP)</div>
            <div style="color: #94a3b8; font-size: 12px; margin-top: 3px;">Luận giải sâu gấp 2,5 lần, Diện tướng, Chỉ tay &amp; Đại vận</div>
          </td>
          <td style="padding: 14px 16px; border-bottom: 1px solid #1e293b; text-align: right; white-space: nowrap;">
            <div style="color: #64748b; text-decoration: line-through; font-size: 12px;">119.000đ</div>
            <div style="color: #34d399; font-weight: 800; font-size: 18px;">95.000đ</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px 16px;">
            <div style="color: #e879f9; font-weight: bold; font-size: 14.5px;">💎 Bản Chuyên Gia Expert (+02 câu hỏi Expert)</div>
            <div style="color: #94a3b8; font-size: 12px; margin-top: 3px;">Trọn bộ 12 Cung + Cung Thân (~5.000 từ) &amp; Lưu Nguyệt 12 tháng</div>
          </td>
          <td style="padding: 14px 16px; text-align: right; white-space: nowrap;">
            <div style="color: #64748b; text-decoration: line-through; font-size: 12px;">269.000đ</div>
            <div style="color: #34d399; font-weight: 800; font-size: 18px;">215.000đ</div>
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin: 22px 0;">
        <a href="${ctaExpertUrl}" style="display: block; max-width: 430px; margin: 0 auto 12px auto; padding: 14px 20px; background: linear-gradient(135deg, #9333ea 0%, #d97706 100%); color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 12px;">
          💎 Nhận Bản Expert Chỉ 215.000đ (Tiết kiệm 54K) ➜
        </a>
        <a href="${ctaProUrl}" style="display: block; max-width: 430px; margin: 0 auto; padding: 13px 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0b0f19 !important; text-decoration: none; font-weight: bold; font-size: 14.5px; border-radius: 12px;">
          👑 Nhận Bản VIP Pro Chỉ 95.000đ (Tiết kiệm 24K) ➜
        </a>
      </div>
    `;
  } else if (stage === 'voucher_30_72h') {
    subject = `⚡ Ưu đãi lớn nhất (-30% trong 6 giờ): Mở khóa trọn bộ Lá Số của ${displayName}`;
    badgeText = '✦ ĐẶC QUYỀN TỐI ĐA • GIẢM SÂU 30% ✦';
    headerTitle = 'MÓN QUÀ HỖ TRỢ CUỐI TUẦN ĐẦU: GIẢM 30%';
    introHtml = `
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.7; margin-bottom: 14px;">
        Kính gửi <strong>${displayName}</strong>, đã 3 ngày kể từ khi quý khách an sao ${hasChart ? `lá số <strong>${canChiLabel}</strong>` : ''} tại Tử Vi Thầy Tôn.
      </p>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 18px;">
        Để giúp quý khách dễ dàng trải nghiệm trọn vẹn chiều sâu mệnh lý của Thầy Tôn mà không phải băn khoăn về chi phí, hệ thống xin gửi tặng mức ưu đãi sâu nhất từ trước tới nay: <strong>GIẢM 30% (chỉ có hiệu lực đúng 6 tiếng kể từ lúc quý khách bấm mở thư này)</strong>. Sau lần này hệ thống sẽ ngừng làm phiền quý khách:
      </p>
    `;

    highlightBoxHtml = `
      <div style="background: linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(147, 51, 234, 0.25) 100%); border: 1.5px dashed #f87171; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 22px;">
        <div style="font-size: 12px; color: #fecaca; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Đặc Quyền Giảm 30% • Dùng 01 Lần Duy Nhất</div>
        <div style="font-size: 26px; font-weight: 800; color: #fbbf24; font-family: monospace; letter-spacing: 2px; margin: 8px 0;">${voucherCode}</div>
        <div style="font-size: 13px; color: #fca5a5; font-weight: 700;">🔥 Tự hủy sau đúng 06 giờ kể từ lúc bấm vào nút bên dưới!</div>
      </div>
    `;

    pricingBlockHtml = `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px; background: #0f172a; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
        <tr>
          <td style="padding: 14px 16px; border-bottom: 1px solid #1e293b;">
            <div style="color: #fbbf24; font-weight: bold; font-size: 14.5px;">👑 Bản Chuyên Sâu VIP Pro (+02 câu hỏi VIP)</div>
            <div style="color: #94a3b8; font-size: 12px; margin-top: 3px;">Chỉ bằng một ly cà phê để thấu tỏ vận hạn cả năm</div>
          </td>
          <td style="padding: 14px 16px; border-bottom: 1px solid #1e293b; text-align: right; white-space: nowrap;">
            <div style="color: #64748b; text-decoration: line-through; font-size: 12px;">119.000đ</div>
            <div style="color: #34d399; font-weight: 800; font-size: 19px;">83.000đ</div>
          </td>
        </tr>
        <tr>
          <td style="padding: 14px 16px;">
            <div style="color: #e879f9; font-weight: bold; font-size: 14.5px;">💎 Bản Chuyên Gia Expert 12 Cung (+02 câu hỏi Expert)</div>
            <div style="color: #94a3b8; font-size: 12px; margin-top: 3px;">Gói cao cấp nhất (~5.000 từ), tiết kiệm ngay 81.000đ!</div>
          </td>
          <td style="padding: 14px 16px; text-align: right; white-space: nowrap;">
            <div style="color: #64748b; text-decoration: line-through; font-size: 12px;">269.000đ</div>
            <div style="color: #34d399; font-weight: 800; font-size: 19px;">188.000đ</div>
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin: 22px 0;">
        <a href="${ctaExpertUrl}" style="display: block; max-width: 430px; margin: 0 auto 12px auto; padding: 14px 20px; background: linear-gradient(135deg, #dc2626 0%, #9333ea 50%, #d97706 100%); color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 12px;">
          💎 Mở Khóa Bản Expert Chỉ 188.000đ (-30%) ➜
        </a>
        <a href="${ctaProUrl}" style="display: block; max-width: 430px; margin: 0 auto; padding: 13px 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0b0f19 !important; text-decoration: none; font-weight: bold; font-size: 14.5px; border-radius: 12px;">
          👑 Mở Khóa Bản VIP Pro Chỉ 83.000đ (-30%) ➜
        </a>
      </div>
    `;
  } else {
    // voucher_30_6m (6 tháng hội ngộ lần cuối)
    subject = `🌟 Nửa năm hội ngộ: Gửi tặng lại ${displayName} ưu đãi 30% lần cuối (Hiệu lực 6 giờ)`;
    badgeText = '✦ HỘI NGỘ SAU 6 THÁNG • LẦN CUỐI CÙNG ✦';
    headerTitle = 'NHÌN LẠI NỬA NĂM QUA & ĐỊNH HƯỚNG CHẶNG TỚI';
    introHtml = `
      <p style="font-size: 15px; color: #e2e8f0; line-height: 1.7; margin-bottom: 14px;">
        Kính chào <strong>${displayName}</strong>, thấm thoắt đã nửa năm trôi qua kể từ ngày quý khách lưu ${hasChart ? `lá số <strong>${canChiLabel}</strong>` : 'tài khoản'} tại Tử Vi Thầy Tôn.
      </p>
      <p style="font-size: 14px; color: #cbd5e1; line-height: 1.7; margin-bottom: 18px;">
        Nửa năm qua công việc, tài chính và gia đạo của quý khách chuyển biến ra sao? Nhân dịp bước sang nửa chặng đường mới, hệ thống xin gửi tặng lại quý khách <strong>lần cuối cùng</strong> mã đặc quyền <strong>GIẢM 30% (hiệu lực trong 6 giờ kể từ lúc mở thư)</strong> để soi chiếu cặn kẽ 12 Cung và Lưu Nguyệt sắp tới:
      </p>
    `;

    highlightBoxHtml = `
      <div style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(147, 51, 234, 0.25) 100%); border: 1.5px dashed #fbbf24; border-radius: 14px; padding: 20px; text-align: center; margin-bottom: 22px;">
        <div style="font-size: 12px; color: #fde68a; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Quà Tặng Hội Ngộ Lần Cuối • Giảm 30%</div>
        <div style="font-size: 26px; font-weight: 800; color: #fbbf24; font-family: monospace; letter-spacing: 2px; margin: 8px 0;">${voucherCode}</div>
        <div style="font-size: 13px; color: #fca5a5; font-weight: 700;">⏳ Hiệu lực 06 giờ kể từ lúc mở liên kết (Ưu đãi cuối cùng)</div>
      </div>
    `;

    pricingBlockHtml = `
      <div style="text-align: center; margin: 22px 0;">
        <a href="${ctaExpertUrl}" style="display: block; max-width: 430px; margin: 0 auto 12px auto; padding: 14px 20px; background: linear-gradient(135deg, #9333ea 0%, #d97706 100%); color: #ffffff !important; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 12px;">
          💎 Mở Khóa Bản Expert 12 Cung Chỉ 188.000đ (Gốc 269K) ➜
        </a>
        <a href="${ctaProUrl}" style="display: block; max-width: 430px; margin: 0 auto; padding: 13px 20px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0b0f19 !important; text-decoration: none; font-weight: bold; font-size: 14.5px; border-radius: 12px;">
          👑 Mở Khóa Bản VIP Pro Chỉ 83.000đ (Gốc 119K) ➜
        </a>
      </div>
    `;
  }

  const html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; color: #e2e8f0; margin: 0; padding: 16px;">
  <div style="max-width: 600px; margin: 0 auto; background: #111827; border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.55);">
    <div style="background: linear-gradient(135deg, #1e1b4b 0%, #451a03 100%); padding: 28px 22px; text-align: center; border-bottom: 1px solid rgba(245, 158, 11, 0.25);">
      <div style="display: inline-block; background: #f59e0b; color: #0f172a; font-weight: bold; font-size: 12px; padding: 5px 14px; border-radius: 9999px; margin-bottom: 10px; letter-spacing: 0.8px;">
        ${badgeText}
      </div>
      <h1 style="font-size: 20px; font-weight: bold; color: #fbbf24; margin: 0; font-family: Georgia, 'Times New Roman', serif; line-height: 1.4;">
        ${headerTitle}
      </h1>
    </div>

    <div style="padding: 26px 22px;">
      ${introHtml}
      ${highlightBoxHtml}
      ${pricingBlockHtml}

      <div style="border-top: 1px solid #1f2937; padding-top: 18px; margin-top: 20px; font-size: 12.5px; color: #94a3b8; line-height: 1.6; text-align: center;">
        Cần hỗ trợ trực tiếp hoặc đặt lịch xem riêng 1-1 cùng Thầy Tôn:<br/>
        Hotline / Zalo: <a href="tel:0935058688" style="color: #fbbf24; text-decoration: none; font-weight: bold;">0935.058.688</a> •
        <a href="https://zalo.me/0935058688" target="_blank" style="color: #60a5fa; text-decoration: none; font-weight: bold;">Nhắn Zalo Thầy Tôn</a>
      </div>
    </div>

    <div style="background: #0a0e17; padding: 16px 20px; text-align: center; font-size: 11px; color: #64748b; border-top: 1px solid #1e293b; line-height: 1.6;">
      © ${new Date().getFullYear()} Tử Vi Thầy Tôn (<a href="https://www.tuvithayton.vn" style="color: #94a3b8;">tuvithayton.vn</a>) • Phòng Tư Vấn R5 Royal City, 72A Nguyễn Trãi, Hà Nội.<br/>
      Email này được gửi tự động vì quý khách đã đăng ký tài khoản tại hệ thống.
      <a href="${unsubscribeUrl}" style="color: #94a3b8; text-decoration: underline; margin-left: 4px;">Hủy nhận email nhắc nhở</a>
    </div>
  </div>
</body>
</html>
  `;

  return sendEmail({
    to: recipientEmail,
    subject,
    html,
    headers: unsubscribeUrl ? { 'List-Unsubscribe': `<${unsubscribeUrl}>` } : undefined,
  });
}
