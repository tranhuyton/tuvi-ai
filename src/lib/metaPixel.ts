import {
  getBrowserGaClientId,
  getBrowserGaSessionId,
  trackGa4BeginCheckout,
  trackGa4Contact,
  trackGa4GenerateChart,
  trackGa4PlayCourseLesson,
  trackGa4Purchase,
  trackGa4SignUp,
  trackGa4ViewCourse,
} from './googleAnalytics';

export const META_PIXEL_ID = '2104187747130873';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export function trackMetaEvent(eventName: string, params?: Record<string, any>, eventId?: string) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  try {
    if (eventId) {
      window.fbq('track', eventName, params || {}, { eventID: eventId });
    } else {
      window.fbq('track', eventName, params || {});
    }
  } catch (err) {
    console.warn('[MetaPixel] trackMetaEvent error:', err);
  }
}

export function trackMetaCustomEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  try {
    window.fbq('trackCustom', eventName, params || {});
  } catch (err) {
    console.warn('[MetaPixel] trackMetaCustomEvent error:', err);
  }
}

function makeClientEventId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function sendClientCapiBeacon(payload: {
  eventName: 'CompleteRegistration' | 'Lead' | 'Contact';
  eventId: string;
  value?: number;
  currency?: string;
  contentName?: string;
  contentCategory?: string;
  email?: string;
  phone?: string;
  fullName?: string;
  userId?: string;
}) {
  if (typeof window === 'undefined') return;
  try {
    const attr = getBrowserMetaAttribution();
    const body = JSON.stringify({
      ...payload,
      fbp: attr.fbp,
      fbc: attr.fbc,
      fbclid: attr.fbclid,
      sourceUrl: attr.sourceUrl,
    });
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([body], { type: 'application/json' });
      navigator.sendBeacon('/api/meta/capi-event', blob);
      return;
    }
    fetch('/api/meta/capi-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore beacon errors
  }
}

export function trackCompleteRegistration(
  method: string = 'email',
  hasPhone: boolean = false,
  userInfo?: { email?: string; phone?: string; fullName?: string; userId?: string }
) {
  const regEventId = makeClientEventId('reg');
  const leadEventId = makeClientEventId('lead');

  trackMetaEvent(
    'CompleteRegistration',
    {
      content_name: 'Tao Tai Khoan Tu Vi Thay Ton',
      status: 'completed',
      registration_method: method,
      has_phone: hasPhone,
    },
    regEventId
  );
  // Khi thu được thông tin liên hệ (Email / SĐT) lúc đăng ký tài khoản thì mới tính là 1 Lead chuẩn CRM
  trackMetaEvent(
    'Lead',
    {
      content_name: 'Thu Thap Contact Tai Khoan',
      registration_method: method,
      has_phone: hasPhone,
    },
    leadEventId
  );
  trackMetaCustomEvent('TaoTaiKhoan', {
    registration_method: method,
    has_phone: hasPhone,
  });
  trackGa4SignUp(method, hasPhone);

  // Song song gửi Server-Side CAPI (khử trùng lặp qua eventID) để chống rơi event trên iOS/Facebook Browser
  sendClientCapiBeacon({
    eventName: 'CompleteRegistration',
    eventId: regEventId,
    contentName: 'Tao Tai Khoan Tu Vi Thay Ton',
    contentCategory: method,
    email: userInfo?.email,
    phone: userInfo?.phone,
    fullName: userInfo?.fullName,
    userId: userInfo?.userId,
  });
  sendClientCapiBeacon({
    eventName: 'Lead',
    eventId: leadEventId,
    contentName: 'Thu Thap Contact Tai Khoan',
    contentCategory: method,
    email: userInfo?.email,
    phone: userInfo?.phone,
    fullName: userInfo?.fullName,
    userId: userInfo?.userId,
  });
}

export function trackLeadChart(hoTen: string, tier: string, namDuong?: number, gioiTinh?: string) {
  // Theo chuẩn phễu E-commerce: Khách lập lá số & xem bản miễn phí = AddToWishlist (Đã rất quan tâm sản phẩm nhưng chưa chốt mua VIP/Expert)
  trackMetaEvent('AddToWishlist', {
    content_name: 'An Sao Lap La So Tu Vi',
    content_category: tier,
    birth_year: namDuong,
    gender: gioiTinh,
  });
  trackMetaCustomEvent('AnSaoLapLaSo', {
    tier,
    birth_year: namDuong,
    gender: gioiTinh,
  });
  trackGa4GenerateChart(tier, namDuong, gioiTinh);
}

function readBrowserCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  try {
    const match = document.cookie
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith(`${name}=`));
    if (!match) return undefined;
    return decodeURIComponent(match.slice(name.length + 1));
  } catch {
    return undefined;
  }
}

export function getBrowserMetaAttribution(): {
  fbp?: string;
  fbc?: string;
  fbclid?: string;
  utmSource?: string;
  utmCampaign?: string;
  utmContent?: string;
  gaCid?: string;
  gaSessionId?: string;
  sourceUrl?: string;
} {
  if (typeof window === 'undefined') return {};
  try {
    const cookieFbp = readBrowserCookie('_fbp');
    let storedFbp: string | undefined;
    const gaCid = getBrowserGaClientId();
    const gaSessionId = getBrowserGaSessionId();
    let fbclid: string | undefined;
    let storedFbc: string | undefined;
    let utmSource: string | undefined;
    let utmCampaign: string | undefined;
    let utmContent: string | undefined;
    try {
      const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
      if (cookieFbp) {
        localStorage.setItem('tuvi_fbp', cookieFbp);
      } else {
        storedFbp = localStorage.getItem('tuvi_fbp') || undefined;
      }
      const savedTs = Number(localStorage.getItem('tuvi_fbc_ts') || '0');
      const isFbcExpired = Boolean(savedTs && Date.now() - savedTs > NINETY_DAYS_MS);
      if (isFbcExpired) {
        localStorage.removeItem('tuvi_fbc');
        localStorage.removeItem('tuvi_fbclid');
        localStorage.removeItem('tuvi_fbc_ts');
      }
      const params = new URLSearchParams(window.location.search);
      const urlClid = params.get('fbclid');
      if (urlClid) {
        const now = Date.now();
        const generatedFbc = `fb.1.${now}.${urlClid}`;
        localStorage.setItem('tuvi_fbclid', urlClid);
        localStorage.setItem('tuvi_fbc', generatedFbc);
        localStorage.setItem('tuvi_fbc_ts', String(now));
        const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
        document.cookie = `_fbc=${encodeURIComponent(generatedFbc)}; path=/; max-age=${90 * 24 * 60 * 60}; SameSite=Lax${secureFlag}`;
        fbclid = urlClid;
        storedFbc = generatedFbc;
      } else {
        fbclid = !isFbcExpired ? localStorage.getItem('tuvi_fbclid') || undefined : undefined;
        storedFbc = !isFbcExpired ? localStorage.getItem('tuvi_fbc') || undefined : undefined;
      }
      const utmTs = Number(localStorage.getItem('tuvi_utm_ts') || '0');
      const isUtmExpired = Boolean(utmTs && Date.now() - utmTs > NINETY_DAYS_MS);
      if (!isUtmExpired) {
        utmSource = params.get('utm_source') || localStorage.getItem('tuvi_utm_source') || undefined;
        utmCampaign = params.get('utm_campaign') || localStorage.getItem('tuvi_utm_campaign') || undefined;
        utmContent = params.get('utm_content') || localStorage.getItem('tuvi_utm_content') || undefined;
      }
    } catch {
      // ignore
    }
    const fbp = cookieFbp || storedFbp;
    const fbc = readBrowserCookie('_fbc') || storedFbc;

    return {
      fbp,
      fbc,
      fbclid,
      utmSource,
      utmCampaign,
      utmContent,
      gaCid,
      gaSessionId,
      sourceUrl: window.location.href,
    };
  } catch {
    return {};
  }
}

export function trackInitiateCheckout(
  paymentType: string,
  price: number,
  orderCode?: string,
  voucherCode?: string
) {
  trackMetaEvent(
    'InitiateCheckout',
    {
      content_name: paymentType,
      content_ids: [paymentType || 'tuvi_service'],
      content_type: 'product',
      value: price,
      currency: 'VND',
      num_items: 1,
      ...(orderCode ? { order_id: orderCode } : {}),
    },
    orderCode ? `ic_${orderCode}` : undefined
  );
  trackGa4BeginCheckout(paymentType, price, orderCode, voucherCode);
}

export function trackPurchase(paymentType: string, price: number, orderCode?: string) {
  if (!price || price <= 0) return;
  trackGa4Purchase(paymentType, price, orderCode);
  if (typeof window !== 'undefined' && orderCode) {
    const trackedKey = `fbq_purchased_${orderCode}`;
    if (sessionStorage.getItem(trackedKey)) return;
    sessionStorage.setItem(trackedKey, '1');
  }
  trackMetaEvent(
    'Purchase',
    {
      content_name: paymentType,
      content_ids: [paymentType || 'tuvi_service'],
      content_type: 'product',
      value: price,
      currency: 'VND',
      order_id: orderCode,
    },
    orderCode
  );
}

export function trackContact(
  channel: 'phone' | 'zalo',
  location?: string,
  options?: { value?: number; email?: string; phone?: string; fullName?: string; userId?: string }
) {
  const contactEventId = makeClientEventId('cnt');
  const contentName =
    channel === 'zalo' ? 'Nhan Tin Zalo 0935058688' : 'Goi Dien Dat Lich 0935058688';
  const value = typeof options?.value === 'number' && options.value > 0 ? options.value : undefined;

  trackMetaEvent(
    'Contact',
    {
      content_name: contentName,
      content_category: location || 'website',
      contact_channel: channel,
      ...(value ? { value, currency: 'VND' } : {}),
    },
    contactEventId
  );
  trackGa4Contact(channel, location);

  sendClientCapiBeacon({
    eventName: 'Contact',
    eventId: contactEventId,
    value,
    currency: value ? 'VND' : undefined,
    contentName,
    contentCategory: location || 'website',
    email: options?.email,
    phone: options?.phone,
    fullName: options?.fullName,
    userId: options?.userId,
  });
}

export function trackViewCourse() {
  trackMetaEvent('ViewContent', {
    content_name: 'Khoa Hoc Tu Vi Dau So Thuc Chien Cung Thay Ton',
    content_ids: ['course_tuvi'],
    content_type: 'product',
    value: 699000,
    currency: 'VND',
  });
  trackGa4ViewCourse();
}

export function trackPlayCourseLesson(lessonId: string, isFreePreview: boolean) {
  trackMetaCustomEvent('NghePodcastKhoaHoc', {
    lesson_id: lessonId,
    is_free_preview: isFreePreview,
    value: 699000,
    currency: 'VND',
  });
  trackGa4PlayCourseLesson(lessonId, isFreePreview);
}
