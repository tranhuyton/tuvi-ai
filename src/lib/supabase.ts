import { createClient } from '@supabase/supabase-js';

/**
 * ============================================================================
 * ⚠️ CRITICAL MULTI-TENANT SUPABASE ARCHITECTURE WARNING FOR AI AGENTS ⚠️
 * ============================================================================
 * Dự án Tử Vi Thầy Tôn (`tuvi-ai` - `tuvithayton.vn`) dùng chung Supabase Project
 * (`ubkvzgwespfvrlpjuxkp.supabase.co`) và bảng `auth.users` với hệ thống
 * TonyEnglish (`tonyenglish-app` - `tonyenglish.vn`).
 *
 * QUY TẮC CÁCH LY BẮT BUỘC (KHÔNG ĐƯỢC VI PHẠM):
 * 1. `tuvi-ai` CHỈ dùng bảng `public.tuvi_profiles` (cùng `tuvi_charts`, `tuvi_orders`).
 *    Bảng `public.profiles` là của học viên TonyEnglish — TUYỆT ĐỐI KHÔNG GHI VÀO ĐÓ.
 * 2. Mọi lệnh `supabase.auth.signUp` bên `tuvi-ai` BẮT BUỘC truyền `options.data.app = 'tuvi'`.
 * 3. TUYỆT ĐỐI KHÔNG đồng bộ mù từ `supabase.auth.admin.listUsers()` sang `tuvi_profiles`.
 *    Bắt buộc dùng hàm `isTuViAuthUser()` bên dưới để lọc bỏ học viên TonyEnglish!
 * ============================================================================
 */
export const TUVI_APP_ID = 'tuvi' as const;

export function isTuViAuthUser(
  authUser: { id?: string; email?: string; user_metadata?: Record<string, any> } | null | undefined,
  tonyEnglishProfileIds?: ReadonlySet<string>
): boolean {
  if (!authUser?.id || !authUser?.email) return false;
  if (tonyEnglishProfileIds?.has(authUser.id)) return false;
  const meta = authUser.user_metadata || {};
  if (
    meta.app === 'tonyenglish' ||
    meta.role === 'student' ||
    meta.role === 'teacher' ||
    Boolean(meta.account_type)
  ) {
    return false;
  }
  return meta.app === TUVI_APP_ID;
}

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubkvzgwespfvrlpjuxkp.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia3Z6Z3dlc3BmdnJscGp1eGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTYzNTEsImV4cCI6MjA5MjY5MjM1MX0.ZEgXs3LfI9diL9aji56N9HIxPOl0e1sMeRxbMfSM2qw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
