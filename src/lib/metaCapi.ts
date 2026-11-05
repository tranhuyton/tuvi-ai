import crypto from 'crypto';
import { META_PIXEL_ID } from './metaPixel';

const CAPI_META_PREFIX = 'capi:';

export interface OrderCapiMeta {
  fbp?: string;
  fbc?: string;
  gaCid?: string;
  ip?: string;
  ua?: string;
  url?: string;
}

function sha256(value: string): string {
  return crypto.createHash('sha256').update(value, 'utf8').digest('hex');
}

function normalizeEmailHash(email?: string | null): string | undefined {
  if (!email) return undefined;
  const clean = email.trim().toLowerCase();
  if (!clean || !clean.includes('@')) return undefined;
  return sha256(clean);
}

function normalizeVnPhoneHash(phone?: string | null): string | undefined {
  if (!phone) return undefined;
  let digits = phone.replace(/\D/g, '');
  if (!digits) return undefined;
  if (digits.startsWith('0084')) {
    digits = digits.slice(2);
  } else if (digits.startsWith('0') && digits.length >= 9 && digits.length <= 11) {
    digits = '84' + digits.slice(1);
  } else if (digits.length === 9 && /^[35789]/.test(digits)) {
    digits = '84' + digits;
  }
  if (digits.length < 9 || digits.length > 15) return undefined;
  return sha256(digits);
}

const GENERIC_NAMES = new Set([
  'đương số',
  'duong so',
  'học viên tử vi',
  'hoc vien tu vi',
  'khách hàng',
  'khach hang',
  'tony test',
  'test',
]);

function normalizeNameHashes(fullName?: string | null): { fn?: string; ln?: string } {
  if (!fullName) return {};
  const clean = fullName
    .trim()
    .toLowerCase()
    .replace(/[0-9!@#$%^&*()_+=\-[\]{};':"\\|,.<>/?~`]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean || GENERIC_NAMES.has(clean)) return {};

  const parts = clean.split(' ').filter(Boolean);
  if (parts.length === 1) {
    return { fn: sha256(parts[0]) };
  }
  // Họ tiếng Việt đứng đầu (ln), tên gọi đứng cuối (fn)
  return {
    ln: sha256(parts[0]),
    fn: sha256(parts[parts.length - 1]),
  };
}

function parseCookieHeader(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};
  const out: Record<string, string> = {};
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k && v) {
      try {
        out[k] = decodeURIComponent(v);
      } catch {
        out[k] = v;
      }
    }
  }
  return out;
}

/**
 * Thu thập ngữ cảnh trình duyệt từ HTTP Request + body client gửi lên lúc tạo đơn
 */
export function extractRequestCapiMeta(
  req: Request,
  clientInput?: {
    fbp?: string;
    fbc?: string;
    fbclid?: string;
    gaCid?: string;
    sourceUrl?: string;
  }
): OrderCapiMeta {
  const cookies = parseCookieHeader(req.headers.get('cookie'));
  const forwardedFor = req.headers.get('x-forwarded-for');
  const ip =
    (forwardedFor ? forwardedFor.split(',')[0].trim() : '') ||
    req.headers.get('x-real-ip')?.trim() ||
    undefined;
  const ua = req.headers.get('user-agent')?.trim() || undefined;

  const fbp = (clientInput?.fbp || cookies['_fbp'] || '').trim() || undefined;
  let fbc = (clientInput?.fbc || cookies['_fbc'] || '').trim() || undefined;
  if (!fbc && clientInput?.fbclid) {
    const cleanClid = clientInput.fbclid.trim();
    if (cleanClid) {
      fbc = `fb.1.${Date.now()}.${cleanClid}`;
    }
  }

  let gaCid = (clientInput?.gaCid || '').trim() || undefined;
  if (!gaCid && cookies['_ga']) {
    const parts = cookies['_ga'].split('.');
    gaCid =
      parts.length >= 4
        ? `${parts[parts.length - 2]}.${parts[parts.length - 1]}`
        : cookies['_ga'].trim() || undefined;
  }

  const url =
    (clientInput?.sourceUrl || req.headers.get('referer') || '').trim() || undefined;

  return { fbp, fbc, gaCid, ip, ua, url };
}

/**
 * Đóng gói thông tin CAPI tạm vào trường transaction_id (giới hạn cứng <= 245 ký tự cho cột varchar(255))
 */
export function encodeOrderCapiMeta(meta?: OrderCapiMeta | null): string | undefined {
  if (!meta) return undefined;
  const maxLen = 245;

  // Ưu tiên cao nhất cho điểm chất lượng khớp sự kiện Meta (EMQ) & GA4 MP: fbc > fbp > gaCid > ip > ua
  const candidates: OrderCapiMeta[] = [
    {
      fbc: meta.fbc?.slice(0, 110),
      fbp: meta.fbp?.slice(0, 45),
      gaCid: meta.gaCid?.slice(0, 32),
      ip: meta.ip?.slice(0, 42),
    },
    {
      fbc: meta.fbc?.slice(0, 130),
      fbp: meta.fbp?.slice(0, 50),
      ip: meta.ip?.slice(0, 45),
    },
    {
      fbp: meta.fbp?.slice(0, 50),
      gaCid: meta.gaCid?.slice(0, 32),
      ip: meta.ip?.slice(0, 45),
      ua: meta.ua?.slice(0, 65),
    },
    {
      fbp: meta.fbp?.slice(0, 50),
      gaCid: meta.gaCid?.slice(0, 32),
      ip: meta.ip?.slice(0, 45),
    },
  ];

  for (const cand of candidates) {
    const clean: OrderCapiMeta = {};
    if (cand.fbc) clean.fbc = cand.fbc;
    if (cand.fbp) clean.fbp = cand.fbp;
    if (cand.gaCid) clean.gaCid = cand.gaCid;
    if (cand.ip) clean.ip = cand.ip;
    if (cand.ua) clean.ua = cand.ua;
    if (Object.keys(clean).length === 0) continue;
    const encoded = `${CAPI_META_PREFIX}${JSON.stringify(clean)}`;
    if (encoded.length <= maxLen) {
      return encoded;
    }
  }
  return undefined;
}

export function decodeOrderCapiMeta(raw?: string | null): OrderCapiMeta | null {
  if (!raw || !raw.startsWith(CAPI_META_PREFIX)) return null;
  try {
    const parsed = JSON.parse(raw.slice(CAPI_META_PREFIX.length));
    if (parsed && typeof parsed === 'object') {
      return parsed as OrderCapiMeta;
    }
  } catch {
    // ignore malformed json
  }
  return null;
}

export interface SendMetaCapiEventInput {
  eventName: 'InitiateCheckout' | 'Purchase' | 'Lead' | 'CompleteRegistration';
  eventId: string;
  value?: number;
  currency?: string;
  paymentType?: string;
  orderCode?: string;
  email?: string | null;
  phone?: string | null;
  fullName?: string | null;
  userId?: string | null;
  meta?: OrderCapiMeta | null;
  timeoutMs?: number;
}

/**
 * Gửi sự kiện Server-Side trực tiếp lên Meta Conversions API (Graph API v21.0)
 * Tự động khử trùng lặp (Deduplication) với trình duyệt thông qua `event_id`
 */
export async function sendMetaCapiEvent(input: SendMetaCapiEventInput): Promise<boolean> {
  const accessToken = (process.env.META_CAPI_ACCESS_TOKEN || '').trim();
  if (!accessToken) {
    return false;
  }

  // Không bắn đơn test 0đ lên Meta để bảo vệ chất lượng tệp tối ưu AI
  if (input.eventName === 'Purchase' && (!input.value || input.value <= 0)) {
    return false;
  }

  try {
    const emHash = normalizeEmailHash(input.email);
    const phHash = normalizeVnPhoneHash(input.phone);
    const { fn, ln } = normalizeNameHashes(input.fullName);
    const externalKey = (input.userId || input.email || '').trim().toLowerCase();

    const userData: Record<string, any> = {
      country: [sha256('vn')],
    };

    if (emHash) userData.em = [emHash];
    if (phHash) userData.ph = [phHash];
    if (fn) userData.fn = [fn];
    if (ln) userData.ln = [ln];
    if (externalKey) userData.external_id = [sha256(externalKey)];

    if (input.meta?.ip) userData.client_ip_address = input.meta.ip;
    if (input.meta?.ua) userData.client_user_agent = input.meta.ua;
    if (input.meta?.fbp) userData.fbp = input.meta.fbp;
    if (input.meta?.fbc) userData.fbc = input.meta.fbc;

    const defaultSourceUrl =
      input.paymentType === 'course_tuvi'
        ? 'https://www.tuvithayton.vn/khoa-hoc'
        : 'https://www.tuvithayton.vn/';

    const customData: Record<string, any> = {
      currency: input.currency || 'VND',
    };
    if (typeof input.value === 'number' && input.value > 0) {
      customData.value = input.value;
    }
    if (input.paymentType) {
      customData.content_name = input.paymentType;
      customData.content_type = 'product';
    }
    if (input.orderCode || input.paymentType) {
      customData.content_ids = [input.orderCode || input.paymentType];
    }
    if (input.orderCode) {
      customData.order_id = input.orderCode;
    }

    const payload = {
      data: [
        {
          event_name: input.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: input.eventId,
          event_source_url: input.meta?.url || defaultSourceUrl,
          action_source: 'website',
          user_data: userData,
          custom_data: customData,
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/v21.0/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(
        accessToken
      )}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(input.timeoutMs || 4500),
      }
    );

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      console.warn(`[META CAPI] Lỗi gửi ${input.eventName} (${input.eventId}):`, json);
      return false;
    }

    console.log(
      `[META CAPI] Đã gửi ${input.eventName} (${input.eventId}) -> events_received=${
        json?.events_received ?? 0
      }`
    );
    return true;
  } catch (err) {
    console.warn(`[META CAPI] Exception gửi ${input.eventName} (${input.eventId}):`, err);
    return false;
  }
}
