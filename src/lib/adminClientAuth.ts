import { supabase } from '@/lib/supabase';

/**
 * Lấy Authorization Bearer Header từ phiên Supabase Auth hiện tại (dùng cho Admin & User API calls)
 */
export async function getBearerAuthHeaders(
  extra: Record<string, string> = {}
): Promise<Record<string, string>> {
  const headers: Record<string, string> = { ...extra };
  try {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return headers;
}

export async function getAdminAuthHeaders(
  extra: Record<string, string> = {}
): Promise<Record<string, string>> {
  const headers = await getBearerAuthHeaders(extra);
  if (typeof window !== 'undefined') {
    const envPin = sessionStorage.getItem('tuvi_admin_env_pin');
    if (envPin) {
      headers['x-admin-pin'] = envPin;
    }
  }
  return headers;
}
