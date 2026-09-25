export interface AffiliateItem {
  id: string;
  code: string; // Mã ref (ví dụ: diep93, nam88, thayton...), viết thường không dấu
  name: string; // Tên CTV
  phone?: string;
  email?: string;
  bankName?: string;
  bankCode?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  commissionRate: number; // % hoa hồng (mặc định 25 - 30%)
  commissionFixed?: number; // Hoặc số tiền cố định VND/đơn
  status: 'ACTIVE' | 'INACTIVE';
  totalClicks: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  paidCommission: number;
  remainingCommission?: number;
  pendingWithdrawal?: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export const VIETNAMESE_BANKS = [
  { code: 'MB', name: 'MBBank (Quân Đội)' },
  { code: 'VCB', name: 'Vietcombank (Ngoại Thương)' },
  { code: 'VPB', name: 'VPBank (Việt Nam Thịnh Vượng)' },
  { code: 'TCB', name: 'Techcombank (Kỹ Thương)' },
  { code: 'ACB', name: 'ACB (Á Châu)' },
  { code: 'BIDV', name: 'BIDV (Đầu Tư & Phát Triển)' },
  { code: 'ICB', name: 'VietinBank (Công Thương)' },
  { code: 'VBA', name: 'Agribank (Nông Nghiệp)' },
  { code: 'TPB', name: 'TPBank (Tiên Phong)' },
  { code: 'STB', name: 'Sacombank (Sài Gòn Thương Tín)' },
  { code: 'VIB', name: 'VIB (Quốc Tế)' },
  { code: 'HDB', name: 'HDBank (Phát Triển TP.HCM)' },
  { code: 'OCB', name: 'OCB (Phương Đông)' },
  { code: 'SHB', name: 'SHB (Sài Gòn - Hà Nội)' },
  { code: 'MSB', name: 'MSB (Hàng Hải)' },
  { code: 'LPB', name: 'LPBank (Lộc Phát)' },
  { code: 'SEAB', name: 'SeABank (Đông Nam Á)' },
  { code: 'NAB', name: 'Nam A Bank' },
];

export function inferBankCode(bankName?: string): string {
  if (!bankName) return 'MB';
  const upper = bankName.toUpperCase();
  if (upper.includes('VIETCOMBANK') || upper.includes('VCB')) return 'VCB';
  if (upper.includes('MBBANK') || upper.includes('MB') || upper.includes('QUÂN ĐỘI')) return 'MB';
  if (upper.includes('VPBANK') || upper.includes('VPB') || upper.includes('THỊNH VƯỢNG')) return 'VPB';
  if (upper.includes('TECHCOMBANK') || upper.includes('TCB') || upper.includes('KỸ THƯƠNG')) return 'TCB';
  if (upper.includes('ACB') || upper.includes('Á CHÂU')) return 'ACB';
  if (upper.includes('BIDV')) return 'BIDV';
  if (upper.includes('VIETINBANK') || upper.includes('ICB') || upper.includes('CÔNG THƯƠNG')) return 'ICB';
  if (upper.includes('AGRIBANK') || upper.includes('VBA') || upper.includes('NÔNG NGHIỆP')) return 'VBA';
  if (upper.includes('TPBANK') || upper.includes('TPB') || upper.includes('TIÊN PHONG')) return 'TPB';
  if (upper.includes('SACOMBANK') || upper.includes('STB')) return 'STB';
  if (upper.includes('VIB')) return 'VIB';
  if (upper.includes('HDBANK') || upper.includes('HDB')) return 'HDB';
  if (upper.includes('OCB')) return 'OCB';
  if (upper.includes('SHB')) return 'SHB';
  if (upper.includes('MSB')) return 'MSB';
  if (upper.includes('LPBANK') || upper.includes('LIENVIET')) return 'LPB';
  if (upper.includes('SEABANK') || upper.includes('SEAB')) return 'SEAB';
  if (upper.includes('NAM A') || upper.includes('NAB')) return 'NAB';
  return 'MB';
}
