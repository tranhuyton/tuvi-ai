import crypto from 'crypto';
import type { User } from '@supabase/supabase-js';
import { adminSupabase } from '@/lib/supabaseAdmin';
import { checkRateLimitDistributed, getClientIp } from '@/lib/rateLimit';

export const DEFAULT_ADMIN_EMAILS = [
  'tranhuyton@gmail.com',
  'tonhuytran@gmail.com',
  'diep.anh.12135@gmail.com',
  'diep.anh1205@gmail.com',
  'thayton@tuvithayton.vn',
] as const;

function getAdminEmailSet(): Set<string> {
  const envList = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return new Set([...DEFAULT_ADMIN_EMAILS, ...envList]);
}

export function isExactAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return getAdminEmailSet().has(email.trim().toLowerCase());
}

export function timingSafeStringEqual(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  try {
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization') || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) return null;
  const token = authHeader.slice(7).trim();
  return token || null;
}

/**
 * Xác thực Supabase JWT từ Authorization: Bearer <access_token>
 */
export async function getAuthenticatedUser(req: Request): Promise<User | null> {
  const token = extractBearerToken(req);
  if (!token) return null;
  try {
    const { data, error } = await adminSupabase.auth.getUser(token);
    if (error || !data?.user) return null;
    return data.user;
  } catch {
    return null;
  }
}

export interface AdminAuthResult {
  authorized: boolean;
  method?: 'jwt' | 'env_pin';
  user?: User;
}

/**
 * Xác thực quyền Admin chuẩn bảo mật cao:
 * 1. Ưu tiên JWT Supabase (Authorization: Bearer <access_token>) có email đã xác thực khớp ADMIN_EMAILS hoặc app_metadata.role === 'admin'
 * 2. Chỉ chấp nhận x-admin-pin khi biến môi trường process.env.ADMIN_PIN được cấu hình tường minh (có chống brute-force theo IP)
 */
export async function verifyAdminRequest(req: Request): Promise<AdminAuthResult> {
  const authUser = await getAuthenticatedUser(req);
  if (authUser) {
    const isAdminByRole = authUser.app_metadata?.role === 'admin';
    const isVerifiedEmail = Boolean(authUser.email_confirmed_at || authUser.confirmed_at);
    if (isAdminByRole || (isVerifiedEmail && isExactAdminEmail(authUser.email))) {
      return { authorized: true, method: 'jwt', user: authUser };
    }
  }

  const configuredPin = (process.env.ADMIN_PIN || '').trim();
  const providedPin = (req.headers.get('x-admin-pin') || '').trim();
  if (configuredPin && providedPin) {
    const ip = getClientIp(req);
    const rl = await checkRateLimitDistributed({
      key: `admin_pin_attempt:${ip}`,
      limit: 10,
      windowMs: 15 * 60_000,
    });
    if (rl.allowed && timingSafeStringEqual(providedPin, configuredPin)) {
      return { authorized: true, method: 'env_pin' };
    }
  }

  return { authorized: false };
}

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(value?: string | null): value is string {
  return Boolean(value && UUID_REGEX.test(value.trim()));
}
