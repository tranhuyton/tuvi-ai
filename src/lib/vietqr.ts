import QRCode from 'qrcode';

/**
 * Bản đồ mã BIN của các ngân hàng phổ biến tại Việt Nam theo chuẩn NAPAS
 */
export const BANK_BIN_MAP: Record<string, string> = {
  VPB: '970432',
  VPBANK: '970432',
  VCB: '970436',
  VIETCOMBANK: '970436',
  TCB: '970407',
  TECHCOMBANK: '970407',
  MB: '970422',
  MBBANK: '970422',
  BIDV: '970418',
  CTG: '970415',
  VIETINBANK: '970415',
  ACB: '970416',
  TPB: '970423',
  TPBANK: '970423',
  STB: '970403',
  SACOMBANK: '970403',
  VIB: '970441',
  SHB: '970443',
  LPB: '970449',
  LPBANK: '970449',
  MSB: '970426',
  OCB: '970448',
  HDB: '970437',
  HDBANK: '970437',
  SEAB: '970440',
  SEABANK: '970440',
};

/**
 * Format trường dữ liệu theo chuẩn EMVCo: ID (2 ký tự) + Độ dài (2 ký tự) + Giá trị
 */
function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/**
 * Tính mã kiểm tra CRC16-CCITT (chuẩn VietQR: đa thức 0x1021, khởi tạo 0xFFFF)
 */
export function crc16(data: string): string {
  let crc = 0xffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export interface VietQrOptions {
  bankBinOrCode: string; // "970432" hoặc "VPB"
  accountNumber: string; // e.g. "AGBSPVUONG2026"
  amount?: number; // e.g. 119000
  memo?: string; // e.g. "TV83867"
  accountName?: string; // e.g. "TRAN THI DIEP"
}

/**
 * Tạo chuỗi dữ liệu EMVCo chuẩn VietQR NAPAS
 */
export function buildVietQrString(options: VietQrOptions): string {
  const { bankBinOrCode, accountNumber, amount, memo } = options;

  const cleanBin =
    BANK_BIN_MAP[bankBinOrCode.toUpperCase()] || bankBinOrCode.replace(/\D/g, '');

  const f00 = formatField('00', '01'); // Payload Format Indicator
  const f01 = formatField('01', amount && amount > 0 ? '12' : '11'); // Dynamic (12) hoặc Static (11)

  // Tag 38: Consumer Account Information (NAPAS)
  const sub38_00 = formatField('00', 'A000000727'); // GUID NAPAS
  const sub38_01_00 = formatField('00', cleanBin); // Bank BIN
  const sub38_01_01 = formatField('01', accountNumber.trim().toUpperCase()); // Số tài khoản
  const sub38_01 = formatField('01', sub38_01_00 + sub38_01_01);
  const sub38_02 = formatField('02', 'QRIBFTTA'); // Dịch vụ chuyển nhanh Napas 247 tới TK
  const f38 = formatField('38', sub38_00 + sub38_01 + sub38_02);

  const f53 = formatField('53', '704'); // Tiền tệ: VND (704)
  const f54 =
    amount && amount > 0 ? formatField('54', Math.round(amount).toString()) : '';
  const f58 = formatField('58', 'VN'); // Quốc gia: Việt Nam

  // Tag 62: Thông tin bổ sung (Nội dung chuyển khoản / Mã đơn hàng)
  let f62 = '';
  if (memo && memo.trim()) {
    const cleanMemo = memo.trim();
    const sub62_08 = formatField('08', cleanMemo);
    f62 = formatField('62', sub62_08);
  }

  // Ghép chuỗi và tính CRC16
  const raw = `${f00}${f01}${f38}${f53}${f54}${f58}${f62}6304`;
  const checksum = crc16(raw);
  return `${raw}${checksum}`;
}

/**
 * Tạo mã QR dạng Data URL (base64 image/png) trực tiếp trong RAM (0ms latency, không phụ thuộc mạng ngoài)
 */
export async function generateVietQrDataUrl(
  options: VietQrOptions,
  qrOptions?: { width?: number; margin?: number }
): Promise<string> {
  const qrString = buildVietQrString(options);
  return QRCode.toDataURL(qrString, {
    width: qrOptions?.width || 360,
    margin: qrOptions?.margin ?? 1,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
  });
}
