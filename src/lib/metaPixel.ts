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

export function trackCompleteRegistration(method: string = 'email', hasPhone: boolean = false) {
  trackMetaEvent('CompleteRegistration', {
    content_name: 'Tao Tai Khoan Tu Vi Thay Ton',
    status: 'completed',
    registration_method: method,
    has_phone: hasPhone,
  });
  // Khi thu được thông tin liên hệ (Email / SĐT) lúc đăng ký tài khoản thì mới tính là 1 Lead chuẩn CRM
  trackMetaEvent('Lead', {
    content_name: 'Thu Thap Contact Tai Khoan',
    registration_method: method,
    has_phone: hasPhone,
  });
  trackMetaCustomEvent('TaoTaiKhoan', {
    registration_method: method,
    has_phone: hasPhone,
  });
  trackGa4SignUp(method, hasPhone);
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
  gaCid?: string;
  gaSessionId?: string;
  sourceUrl?: string;
} {
  if (typeof window === 'undefined') return {};
  try {
    const fbp = readBrowserCookie('_fbp');
    const gaCid = getBrowserGaClientId();
    const gaSessionId = getBrowserGaSessionId();
    let fbclid: string | undefined;
    let storedFbc: string | undefined;
    try {
      const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
      const savedTs = Number(localStorage.getItem('tuvi_fbc_ts') || '0');
      const isFbcExpired = Boolean(savedTs && Date.now() - savedTs > NINETY_DAYS_MS);
      if (isFbcExpired) {
        localStorage.removeItem('tuvi_fbc');
        localStorage.removeItem('tuvi_fbclid');
        localStorage.removeItem('tuvi_fbc_ts');
      }
      const params = new URLSearchParams(window.location.search);
      fbclid = params.get('fbclid') || (!isFbcExpired ? localStorage.getItem('tuvi_fbclid') || undefined : undefined);
      storedFbc = !isFbcExpired ? localStorage.getItem('tuvi_fbc') || undefined : undefined;
    } catch {
      // ignore
    }
    const fbc = readBrowserCookie('_fbc') || storedFbc;

    return {
      fbp,
      fbc,
      fbclid,
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

export function trackContact(channel: 'phone' | 'zalo', location?: string) {
  trackMetaEvent('Contact', {
    content_name: channel === 'zalo' ? 'Nhan Tin Zalo 0935058688' : 'Goi Dien Dat Lich 0935058688',
    content_category: location || 'website',
    contact_channel: channel,
  });
  trackGa4Contact(channel, location);
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
