import nodemailer from 'nodemailer';
import { inferBankCode } from '@/types/affiliate';

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
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
  const toList = Array.isArray(to) ? to : [to];
  const validToList = toList.filter((e) => e && e.includes('@'));

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
  const defaultSender = 'Tử Vi Thầy Tôn <noreply@tuvithayton.vn>';
  const smtpFrom = options.from || process.env.SMTP_FROM || defaultSender;

  // 1. Thử gửi qua Resend API nếu có cấu hình
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: smtpFrom.includes('@') ? smtpFrom : 'Tử Vi Thầy Tôn <onboarding@resend.dev>',
          to: validToList,
          subject,
          html,
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

      const info = await transporter.sendMail({
        from: smtpFrom.includes('@') ? smtpFrom : `"Tử Vi Thầy Tôn" <${gmailUser}>`,
        to: validToList.join(','),
        subject,
        html,
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

  let serviceTitle = 'Luận Giải Tử Vi Chuyên Sâu (Bản VIP)';
  let serviceDesc =
    'Bản luận giải đại pháp chuyên sâu đa tầng của Thầy Tôn (14 chính tinh, Diện tướng, Thủ tướng, Đại vận 10 năm và 4 mùa) đã được kích hoạt thành công trên lá số của quý khách.';

  if (paymentType === 'chat_vip') {
    serviceTitle = '02 Câu Hỏi Thỉnh Giáo Chuyên Sâu Cùng Thầy Tôn (Bản VIP)';
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

  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || 'tranhuyton@gmail.com';
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
    .cta-btn { display: block; width: fit-content; margin: 24px auto 16px auto; padding: 14px 32px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #0b0f19 !important; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(245, 158, 11, 0.35); }
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

      <a href="https://tuvithayton.vn/admin" class="cta-btn">
        Mở Trang Quản Trị Admin Duyệt Rút ➜
      </a>

      <p style="text-align: center; font-size: 12px; color: #94a3b8; margin: 0;">
        Sau khi chuyển khoản thành công, Thầy bấm nút <strong>"Xác nhận đã chuyển"</strong> trong Admin để hệ thống trừ số dư ví CTV.
      </p>
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} Tử Vi Thầy Tôn • Bát Bộ Thần Sát &amp; Tướng Pháp Bí Truyền
    </div>
  </div>
</body>
</html>
  `;

  // Gửi email cho Admin
  const adminResult = await sendEmail({
    to: adminEmail,
    subject: `💸 [Tử Vi Thầy Tôn] Yêu cầu rút tiền hoa hồng: ${affiliateName} (${formattedAmount})`,
    html: htmlContent,
  });

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
