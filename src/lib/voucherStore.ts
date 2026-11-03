import crypto from 'crypto';
import { adminSupabase } from './supabaseAdmin';

export type DripStage =
  | 'reminder_1h'
  | 'voucher_20_24h'
  | 'voucher_30_72h'
  | 'voucher_30_6m';

export interface ActiveVoucherInfo {
  code: string;
  discountPercent: 20 | 30;
  durationHours: number;
  expiresAt: string;
  remainingSeconds: number;
  stage: string;
  userId?: string | null;
  email?: string | null;
  chartId?: string | null;
  prices: {
    reading_vip: number;
    reading_expert: number;
  };
  originalPrices: {
    reading_vip: number;
    reading_expert: number;
  };
}

export const ORIGINAL_READING_PRICES = {
  reading_vip: 119000,
  reading_expert: 269000,
} as const;

/**
 * Tính giá ưu đãi làm tròn hàng nghìn đẹp cho VietQR
 * Chỉ áp dụng cho 2 gói mở khóa Luận Giải: reading_vip (119k) & reading_expert (269k)
 * - Giảm 20%: Pro 119k -> 95k | Expert 269k -> 215k
 * - Giảm 30%: Pro 119k -> 83k | Expert 269k -> 188k
 */
export function getDiscountedReadingPrice(
  paymentType: string,
  discountPercent: number
): { finalPrice: number; originalPrice: number; discountAmount: number } | null {
  if (paymentType !== 'reading_vip' && paymentType !== 'reading_expert') {
    return null;
  }

  const originalPrice: number = ORIGINAL_READING_PRICES[paymentType];
  let finalPrice: number = originalPrice;

  if (discountPercent === 20) {
    finalPrice = paymentType === 'reading_vip' ? 95000 : 215000;
  } else if (discountPercent === 30) {
    finalPrice = paymentType === 'reading_vip' ? 83000 : 188000;
  } else {
    finalPrice = Math.round((originalPrice * (100 - discountPercent)) / 100 / 1000) * 1000;
  }

  return {
    finalPrice,
    originalPrice,
    discountAmount: Math.max(0, originalPrice - finalPrice),
  };
}

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function generateRandomSuffix(length = 6): string {
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return out;
}

/**
 * Kiểm tra xem khách hàng đã có bất kỳ đơn hàng PAID nào chưa (Chốt chặn Stop-on-Purchase)
 */
export async function hasUserPurchasedAnything(
  userId?: string | null,
  email?: string | null
): Promise<boolean> {
  try {
    if (userId) {
      const { data: byUser } = await adminSupabase
        .from('tuvi_orders')
        .select('id')
        .eq('user_id', userId)
        .eq('status', 'PAID')
        .limit(1);
      if (byUser && byUser.length > 0) return true;

      // Kiểm tra thêm nếu khách có lá số đã lên cấp pro/expert (ví dụ kích hoạt thủ công)
      const { data: proCharts } = await adminSupabase
        .from('tuvi_charts')
        .select('id, duong_so_data, laso_data')
        .eq('user_id', userId);

      const hasPaidChart = (proCharts || []).some(
        (c: any) =>
          c.duong_so_data?.tier === 'pro' ||
          c.duong_so_data?.tier === 'expert' ||
          c.laso_data?.tier === 'pro' ||
          c.laso_data?.tier === 'expert'
      );
      if (hasPaidChart) return true;
    }

    if (email && email.includes('@')) {
      const cleanEmail = email.trim().toLowerCase();
      const { data: byEmail } = await adminSupabase
        .from('tuvi_orders')
        .select('id')
        .ilike('email', cleanEmail)
        .eq('status', 'PAID')
        .limit(1);
      if (byEmail && byEmail.length > 0) return true;
    }
  } catch (err) {
    console.warn('[VOUCHER STORE] Lỗi kiểm tra lịch sử mua hàng:', err);
  }
  return false;
}

/**
 * Khởi tạo mã giảm giá định danh cá nhân (dùng 1 lần, kích hoạt đếm ngược khi bấm mở link)
 */
export async function createPersonalVoucher(params: {
  userId: string;
  email: string;
  chartId?: string | null;
  stage: 'voucher_20_24h' | 'voucher_30_72h' | 'voucher_30_6m';
  discountPercent: 20 | 30;
  durationHours: number;
  hardCeilingHours?: number;
}): Promise<{ code: string; hardExpiresAt: string } | null> {
  const {
    userId,
    email,
    chartId,
    stage,
    discountPercent,
    durationHours,
    hardCeilingHours = 48,
  } = params;

  try {
    // Hủy các voucher cũ chưa dùng của user này trước khi cấp voucher bậc mới
    await adminSupabase
      .from('tuvi_vouchers')
      .update({ status: 'CANCELLED' })
      .eq('user_id', userId)
      .eq('status', 'ACTIVE');

    const prefix = `TV${discountPercent}`;
    let code = `${prefix}-${generateRandomSuffix(6)}`;

    for (let attempt = 0; attempt < 5; attempt++) {
      const { data: existing } = await adminSupabase
        .from('tuvi_vouchers')
        .select('id')
        .eq('code', code)
        .maybeSingle();
      if (!existing) break;
      code = `${prefix}-${generateRandomSuffix(6)}`;
    }

    const hardExpiresAt = new Date(
      Date.now() + hardCeilingHours * 3600 * 1000
    ).toISOString();

    const { error } = await adminSupabase.from('tuvi_vouchers').insert({
      code,
      user_id: userId,
      email: email.trim().toLowerCase(),
      chart_id: chartId || null,
      stage,
      discount_percent: discountPercent,
      duration_hours: durationHours,
      status: 'ACTIVE',
      hard_expires_at: hardExpiresAt,
    });

    if (error) {
      console.error('[VOUCHER STORE] Không thể tạo voucher:', error);
      return null;
    }

    return { code, hardExpiresAt };
  } catch (err) {
    console.error('[VOUCHER STORE] Ngoại lệ khi tạo voucher:', err);
    return null;
  }
}

/**
 * Kích hoạt đồng hồ đếm ngược (ở lần click đầu tiên) và kiểm tra tính hợp lệ của Voucher
 */
export async function activateAndValidateVoucher(
  rawCode: string,
  options?: { activateTimer?: boolean }
): Promise<{
  valid: boolean;
  reason?: string;
  voucher?: ActiveVoucherInfo;
}> {
  const cleanCode = (rawCode || '').trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, reason: 'EMPTY_CODE' };
  }

  const activateTimer = options?.activateTimer !== false;

  try {
    const { data: row, error } = await adminSupabase
      .from('tuvi_vouchers')
      .select('*')
      .eq('code', cleanCode)
      .maybeSingle();

    if (error || !row) {
      return { valid: false, reason: 'NOT_FOUND' };
    }

    if (row.status !== 'ACTIVE') {
      return { valid: false, reason: row.status };
    }

    // Chốt chặn Stop-on-Purchase: Nếu khách đã mua gói bất kỳ rồi thì tự động vô hiệu hóa mã
    const alreadyBought = await hasUserPurchasedAnything(row.user_id, row.email);
    if (alreadyBought) {
      await adminSupabase
        .from('tuvi_vouchers')
        .update({ status: 'CANCELLED' })
        .eq('id', row.id);
      return { valid: false, reason: 'ALREADY_PURCHASED' };
    }

    const nowMs = Date.now();
    const hardExpiresMs = new Date(row.hard_expires_at).getTime();

    if (nowMs >= hardExpiresMs) {
      await adminSupabase
        .from('tuvi_vouchers')
        .update({ status: 'EXPIRED' })
        .eq('id', row.id);
      return { valid: false, reason: 'EXPIRED' };
    }

    let expiresAtIso: string | null = row.expires_at;

    // Lần đầu tiên khách bấm mở link từ Email -> Bắt đầu đếm ngược (12h hoặc 6h)
    if (!expiresAtIso) {
      if (activateTimer) {
        const clickedAtIso = new Date(nowMs).toISOString();
        const targetEndMs = Math.min(
          hardExpiresMs,
          nowMs + Number(row.duration_hours || 6) * 3600 * 1000
        );
        expiresAtIso = new Date(targetEndMs).toISOString();

        await adminSupabase
          .from('tuvi_vouchers')
          .update({
            first_clicked_at: clickedAtIso,
            expires_at: expiresAtIso,
          })
          .eq('id', row.id);
      } else {
        // Nếu chỉ kiểm tra khi tạo đơn mà chưa từng click qua banner, lấy theo durationHours từ hiện tại
        const targetEndMs = Math.min(
          hardExpiresMs,
          nowMs + Number(row.duration_hours || 6) * 3600 * 1000
        );
        expiresAtIso = new Date(targetEndMs).toISOString();
      }
    }

    const expiresMs = new Date(expiresAtIso).getTime();
    if (nowMs >= expiresMs) {
      await adminSupabase
        .from('tuvi_vouchers')
        .update({ status: 'EXPIRED' })
        .eq('id', row.id);
      return { valid: false, reason: 'EXPIRED' };
    }

    const discountPercent = Number(row.discount_percent) as 20 | 30;
    const vipPricing = getDiscountedReadingPrice('reading_vip', discountPercent)!;
    const expertPricing = getDiscountedReadingPrice('reading_expert', discountPercent)!;

    return {
      valid: true,
      voucher: {
        code: row.code,
        discountPercent,
        durationHours: Number(row.duration_hours),
        expiresAt: expiresAtIso,
        remainingSeconds: Math.max(1, Math.floor((expiresMs - nowMs) / 1000)),
        stage: row.stage,
        userId: row.user_id,
        email: row.email,
        chartId: row.chart_id,
        prices: {
          reading_vip: vipPricing.finalPrice,
          reading_expert: expertPricing.finalPrice,
        },
        originalPrices: {
          reading_vip: ORIGINAL_READING_PRICES.reading_vip,
          reading_expert: ORIGINAL_READING_PRICES.reading_expert,
        },
      },
    };
  } catch (err) {
    console.error('[VOUCHER STORE] Lỗi xác thực voucher:', err);
    return { valid: false, reason: 'SERVER_ERROR' };
  }
}

/**
 * Tự động tìm voucher đang đếm ngược của user đã đăng nhập (khi khách quay lại web trực tiếp)
 */
export async function findActiveClickedVoucherForUser(
  userId: string
): Promise<ActiveVoucherInfo | null> {
  if (!userId) return null;
  try {
    const { data: rows } = await adminSupabase
      .from('tuvi_vouchers')
      .select('code')
      .eq('user_id', userId)
      .eq('status', 'ACTIVE')
      .not('expires_at', 'is', null)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (!rows || rows.length === 0) return null;
    const check = await activateAndValidateVoucher(rows[0].code, { activateTimer: false });
    return check.valid && check.voucher ? check.voucher : null;
  } catch {
    return null;
  }
}

/**
 * Đánh dấu voucher đã sử dụng và hủy toàn bộ các voucher còn lại của khách sau khi thanh toán thành công
 */
export async function markVoucherUsedAndCancelAllForUser(params: {
  voucherCode?: string | null;
  orderCode: string;
  userId?: string | null;
  email?: string | null;
}): Promise<void> {
  const { voucherCode, orderCode, userId, email } = params;
  const nowIso = new Date().toISOString();

  try {
    if (voucherCode) {
      await adminSupabase
        .from('tuvi_vouchers')
        .update({
          status: 'USED',
          used_at: nowIso,
          used_order_code: orderCode,
        })
        .eq('code', voucherCode.trim().toUpperCase());
    }

    if (userId) {
      await adminSupabase
        .from('tuvi_vouchers')
        .update({ status: 'CANCELLED' })
        .eq('user_id', userId)
        .eq('status', 'ACTIVE');
    }

    if (email && email.includes('@')) {
      await adminSupabase
        .from('tuvi_vouchers')
        .update({ status: 'CANCELLED' })
        .ilike('email', email.trim().toLowerCase())
        .eq('status', 'ACTIVE');
    }
  } catch (err) {
    console.warn('[VOUCHER STORE] Lỗi cập nhật trạng thái voucher sau thanh toán:', err);
  }
}
