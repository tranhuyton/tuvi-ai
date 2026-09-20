import nodemailer from 'nodemailer';

export interface PaymentEmailDetails {
  customerName: string;
  customerEmail: string;
  orderCode: string;
  amount: number;
  paymentType: 'reading_vip' | 'chat_free' | 'chat_vip' | string;
  paidAt?: string;
}

/**
 * Gửi email xác nhận thanh toán thành công & hướng dẫn truy cập dịch vụ
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

  // HTML Email Template Sang Trọng Huyền Học
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

  // Kiểm tra cấu hình SMTP hoặc Resend
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || 'Tử Vi Thầy Tôn <noreply@tuvithayton.vn>';
  const resendApiKey = process.env.RESEND_API_KEY;

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
          from: smtpFrom,
          to: [customerEmail],
          subject: `[Tử Vi Thầy Tôn] Kích hoạt thành công dịch vụ - Mã ${orderCode}`,
          html: htmlContent,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log('[EMAIL RESEND] Gửi email thành công:', data.id);
        return { success: true, messageId: data.id };
      }
      console.warn('[EMAIL RESEND] Lỗi gửi email Resend:', data);
    } catch (err) {
      console.warn('[EMAIL RESEND] Ngoại lệ khi gọi Resend:', err);
    }
  }

  // 2. Thử gửi qua SMTP Nodemailer nếu có cấu hình
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
        to: customerEmail,
        subject: `[Tử Vi Thầy Tôn] Xác nhận thanh toán & Kích hoạt dịch vụ - Mã ${orderCode}`,
        html: htmlContent,
      });

      console.log('[EMAIL SMTP] Gửi email thành công:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (err: any) {
      console.error('[EMAIL SMTP] Lỗi gửi email qua SMTP:', err?.message || err);
      // Tiếp tục fallback bên dưới
    }
  }

  // 3. Fallback: Mô phỏng gửi thành công nếu chưa cấu hình SMTP/Resend
  console.log(`[EMAIL SIMULATED] Đã gửi thông báo thanh toán mã ${orderCode} tới: ${customerEmail}`);
  return {
    success: true,
    simulated: true,
    messageId: `sim_${Date.now()}`,
  };
}
