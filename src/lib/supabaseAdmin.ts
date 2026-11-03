import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubkvzgwespfvrlpjuxkp.supabase.co';

const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia3Z6Z3dlc3BmdnJscGp1eGtwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzExNjM1MSwiZXhwIjoyMDkyNjkyMzUxfQ.Ubmws-Yg0pJKaCaXy7aO8rbt6bw4O3PGgM6GzPR0PLk';

export const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const SIGNING_SECRET =
  process.env.CRON_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'tuvi_drip_cron_2026_thayton';

/**
 * Ký chữ ký HMAC ngắn gọn để xác thực link mở lá số / hủy nhận mail từ Email
 * (Giúp khách bấm từ Gmail mở bằng Safari/Chrome vẫn xem ngay được lá số của mình mà không cần đăng nhập lại)
 */
export function signEmailToken(payload: string): string {
  return crypto
    .createHmac('sha256', SIGNING_SECRET)
    .update(payload)
    .digest('hex')
    .slice(0, 24);
}

export function verifyEmailToken(payload: string, signature?: string | null): boolean {
  if (!signature) return false;
  const expected = signEmailToken(payload);
  if (signature.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}
