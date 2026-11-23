import { adminSupabase } from '@/lib/supabaseAdmin';

interface RateBucket {
  timestamps: number[];
}

declare global {
  var __tuviRateLimitStore: Map<string, RateBucket> | undefined;
}

const buckets: Map<string, RateBucket> =
  globalThis.__tuviRateLimitStore || new Map<string, RateBucket>();
globalThis.__tuviRateLimitStore = buckets;

let lastPruneMs = 0;

function pruneOldBuckets(now: number) {
  if (now - lastPruneMs < 60_000) return;
  lastPruneMs = now;
  const maxIdleMs = 15 * 60_000;
  for (const [key, bucket] of buckets.entries()) {
    const latest = bucket.timestamps[bucket.timestamps.length - 1] || 0;
    if (now - latest > maxIdleMs) {
      buckets.delete(key);
    }
  }
}

/**
 * Trích xuất IP khách hàng tin cậy trên Vercel / Cloudflare / Reverse Proxy
 * (tránh tin vào phần tử đầu tiên của x-forwarded-for vốn client có thể giả mạo)
 */
export function getClientIp(req: Request): string {
  const vercelIp = req.headers.get('x-vercel-forwarded-for')?.split(',').pop()?.trim();
  if (vercelIp) return vercelIp;

  const cfIp = req.headers.get('cf-connecting-ip')?.trim();
  if (cfIp) return cfIp;

  const realIp = req.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;

  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const rightmost = parts[parts.length - 1];
    if (rightmost) return rightmost;
  }

  return 'unknown';
}

export function checkRateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): { allowed: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  pruneOldBuckets(now);

  const cutoff = now - options.windowMs;
  const bucket = buckets.get(options.key) || { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((ts) => ts > cutoff);

  if (bucket.timestamps.length >= options.limit) {
    const oldest = bucket.timestamps[0] || now;
    const retryAfterSec = Math.max(1, Math.ceil((oldest + options.windowMs - now) / 1000));
    buckets.set(options.key, bucket);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  bucket.timestamps.push(now);
  buckets.set(options.key, bucket);
  return {
    allowed: true,
    remaining: Math.max(0, options.limit - bucket.timestamps.length),
    retryAfterSec: 0,
  };
}

/**
 * Rate Limit phân tán qua PostgreSQL RPC (`tuvi_check_rate_limit`), đồng bộ giữa mọi container serverless Vercel.
 * Tự động dự phòng sang in-memory `checkRateLimit` nếu RPC chưa có hoặc mạng DB gián đoạn.
 */
export async function checkRateLimitDistributed(options: {
  key: string;
  limit: number;
  windowMs: number;
}): Promise<{ allowed: boolean; remaining: number; retryAfterSec: number }> {
  try {
    const { data, error } = await adminSupabase.rpc('tuvi_check_rate_limit', {
      p_key: options.key.slice(0, 180),
      p_limit: options.limit,
      p_window_ms: options.windowMs,
    });
    if (!error && data && typeof data === 'object') {
      const res = data as { allowed?: boolean; remaining?: number; reset_at?: string };
      const resetMs = res.reset_at ? new Date(res.reset_at).getTime() : Date.now() + options.windowMs;
      const retryAfterSec = res.allowed ? 0 : Math.max(1, Math.ceil((resetMs - Date.now()) / 1000));
      return {
        allowed: Boolean(res.allowed),
        remaining: Number(res.remaining ?? 0),
        retryAfterSec,
      };
    }
  } catch {
    // Fallback an toàn về bộ đếm RAM nếu RPC chưa được áp dụng
  }

  return checkRateLimit(options);
}
