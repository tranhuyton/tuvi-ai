/**
 * Cấu hình tài khoản ngân hàng nhận thanh toán trung tâm cho toàn bộ hệ thống Tử Vi Thầy Tôn.
 * Mọi API tạo đơn, PaymentModal và Email xác nhận đều phải dùng chung nguồn này.
 */
export const PAYMENT_BANK_CONFIG = {
  bankCode: 'VPB',
  bankName: 'VPBank (Ngân hàng Việt Nam Thịnh Vượng)',
  accountNumber: 'AGBSPVUONG2026',
  accountName: 'TRAN THI DIEP',
} as const;
