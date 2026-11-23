import crypto from 'crypto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubkvzgwespfvrlpjuxkp.supabase.co';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!serviceRoleKey && process.env.NODE_ENV === 'production') {
  console.error(
    '[SECURITY CRITICAL] Thiếu biến môi trường SUPABASE_SERVICE_ROLE_KEY trên production!'
  );
}

/**
 * ⚠️ CẢNH BÁO CHO AI AGENT:
 * `adminSupabase` kết nối tới Supabase Project dùng chung giữa `tuvi-ai` và `tonyenglish-app`.
 * - Hồ sơ khách hàng Tử Vi nằm ở `public.tuvi_profiles`.
 * - Hồ sơ học viên TonyEnglish nằm ở `public.profiles`.
 * - Khi gọi `adminSupabase.auth.admin.listUsers()`, BẮT BUỘC phải dùng `isTuViAuthUser()`
 *   (từ `@/lib/supabase`) và loại trừ `public.profiles` để không bao giờ trộn lẫn học viên TonyEnglish!
 */
export const adminSupabase: SupabaseClient = createClient(
  supabaseUrl,
  serviceRoleKey || 'missing-supabase-service-role-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

type TokenPurpose = 'email' | 'payout' | 'order_status';

/**
 * Sinh khóa HMAC tách miền độc lập theo mục đích (domain separation),
 * đảm bảo chữ ký email không bao giờ dùng chéo cho payout hay order_status.
 */
function getDerivedHmacKey(purpose: TokenPurpose): Buffer {
  let rawSecret = '';
  if (purpose === 'payout') {
    rawSecret = (process.env.PAYOUT_HMAC_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  } else if (purpose === 'order_status') {
    rawSecret = (process.env.EMAIL_HMAC_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  } else {
    rawSecret = (process.env.EMAIL_HMAC_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  }

  if (!rawSecret) {
    throw new Error(`Thiếu secret ký HMAC cho mục đích ${purpose}`);
  }

  return crypto.createHash('sha256').update(`tuvi-hmac-domain-v2:${purpose}:${rawSecret}`).digest();
}

function getLegacyEmailSecret(): string {
  return (
    process.env.EMAIL_HMAC_SECRET ||
    process.env.CRON_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    ''
  ).trim();
}

function timingSafeHexEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  try {
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

/**
 * Ký token HMAC có hạn sử dụng (format: `<expUnix>.<sigHex>`) cho link mở lá số / hủy nhận mail / kiểm tra trạng thái đơn
 */
export function signExpiringToken(
  purpose: TokenPurpose,
  payload: string,
  ttlSeconds: number
): string {
  const exp = Math.floor(Date.now() / 1000) + Math.max(60, Math.floor(ttlSeconds));
  const sig = crypto
    .createHmac('sha256', getDerivedHmacKey(purpose))
    .update(`${payload}|exp=${exp}`)
    .digest('hex')
    .slice(0, 28);
  return `${exp}.${sig}`;
}

export function verifyExpiringToken(
  purpose: TokenPurpose,
  payload: string,
  token?: string | null
): boolean {
  if (!token) return false;
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return false;
  const expStr = token.slice(0, dotIdx);
  const sig = token.slice(dotIdx + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) {
    return false;
  }
  try {
    const expected = crypto
      .createHmac('sha256', getDerivedHmacKey(purpose))
      .update(`${payload}|exp=${exp}`)
      .digest('hex')
      .slice(0, 28);
    return timingSafeHexEqual(sig, expected);
  } catch {
    return false;
  }
}

/**
 * Ký chữ ký HMAC có TTL mặc định 14 ngày cho các link Email Drip / Unsubscribe mới
 */
export function signEmailToken(payload: string, ttlSeconds = 14 * 24 * 3600): string {
  return signExpiringToken('email', payload, ttlSeconds);
}

/**
 * Xác thực token Email (ưu tiên chuẩn mới có TTL; chỉ chấp nhận định dạng cũ 24 hex cho link unsubscribe còn hiệu lực)
 */
export function verifyEmailToken(
  payload: string,
  signature?: string | null,
  options?: { allowLegacy?: boolean }
): boolean {
  if (!signature) return false;
  if (signature.includes('.')) {
    return verifyExpiringToken('email', payload, signature);
  }
  if (options?.allowLegacy === false) {
    return false;
  }
  // Tương thích ngược tạm thời cho các email đã gửi trước thời điểm nâng cấp
  const legacySecret = getLegacyEmailSecret();
  if (!legacySecret) return false;
  try {
    const expected = crypto
      .createHmac('sha256', legacySecret)
      .update(payload)
      .digest('hex')
      .slice(0, 24);
    return timingSafeHexEqual(signature, expected);
  } catch {
    return false;
  }
}
