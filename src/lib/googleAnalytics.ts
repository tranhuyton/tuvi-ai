export const GOOGLE_TAG_CONTAINER_ID = 'GTM-M5V95KJ4';
export const GA4_MEASUREMENT_ID = 'G-K09KG9PV1Y';

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export interface Ga4Item {
  item_id: string;
  item_name: string;
  item_category: string;
  price?: number;
  quantity?: number;
}

export function mapPaymentTypeToGa4Item(paymentType: string, price?: number): Ga4Item {
  switch (paymentType) {
    case 'reading_vip':
      return {
        item_id: 'reading_vip',
        item_name: 'Luận Giải Tử Vi Chuyên Sâu Pro',
        item_category: 'Luận Giải Lá Số',
        price,
        quantity: 1,
      };
    case 'reading_expert':
      return {
        item_id: 'reading_expert',
        item_name: 'Luận Giải Tử Vi Chuyên Gia Expert',
        item_category: 'Luận Giải Lá Số',
        price,
        quantity: 1,
      };
    case 'upgrade_expert':
      return {
        item_id: 'upgrade_expert',
        item_name: 'Nâng Cấp Bản Chuyên Gia Expert',
        item_category: 'Luận Giải Lá Số',
        price,
        quantity: 1,
      };
    case 'course_tuvi':
      return {
        item_id: 'course_tuvi',
        item_name: 'Khóa Học Tử Vi Đẩu Số Thực Chiến',
        item_category: 'Khóa Học Online',
        price: price ?? 699000,
        quantity: 1,
      };
    case 'chat_expert':
      return {
        item_id: 'chat_expert',
        item_name: 'Gói Hỏi Đáp Tử Vi Chuyên Gia',
        item_category: 'Hỏi Đáp Chuyên Sâu',
        price,
        quantity: 1,
      };
    case 'chat_vip':
      return {
        item_id: 'chat_vip',
        item_name: 'Gói Hỏi Đáp Tử Vi Pro',
        item_category: 'Hỏi Đáp Chuyên Sâu',
        price,
        quantity: 1,
      };
    case 'chat_free':
      return {
        item_id: 'chat_free',
        item_name: 'Gói Hỏi Đáp Tử Vi Cơ Bản',
        item_category: 'Hỏi Đáp Chuyên Sâu',
        price,
        quantity: 1,
      };
    default:
      return {
        item_id: paymentType || 'tuvi_service',
        item_name: paymentType || 'Dịch Vụ Tử Vi Thầy Tôn',
        item_category: 'Dịch Vụ Tử Vi',
        price,
        quantity: 1,
      };
  }
}

export function trackGa4Event(eventName: string, params?: Record<string, any>) {
  if (typeof window === 'undefined') return;
  try {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    } else if (Array.isArray(window.dataLayer)) {
      // Fallback đẩy vào hàng đợi chuẩn của gtag khi script đang tải bất đồng bộ
      window.dataLayer.push(['event', eventName, params || {}]);
    }
  } catch (err) {
    console.warn('[GA4] trackGa4Event error:', err);
  }
}

/**
 * Đọc client_id từ cookie `_ga` (ví dụ `GA1.1.123456789.1730000000` -> `123456789.1730000000`)
 * phục vụ đối khớp phiên khi bắn Server-Side Measurement Protocol từ VietQR Webhook
 */
export function getBrowserGaClientId(): string | undefined {
  if (typeof document === 'undefined') return undefined;
  try {
    const match = document.cookie
      .split(';')
      .map((c) => c.trim())
      .find((c) => c.startsWith('_ga='));
    if (!match) return undefined;
    const raw = decodeURIComponent(match.slice(4));
    const parts = raw.split('.');
    if (parts.length >= 4) {
      return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
    }
    return raw || undefined;
  } catch {
    return undefined;
  }
}

export function trackGa4SignUp(method: string = 'email', hasPhone: boolean = false) {
  trackGa4Event('sign_up', {
    method,
    has_phone: hasPhone,
  });
  trackGa4Event('generate_lead', {
    currency: 'VND',
    value: 0,
    lead_source: 'account_registration',
    method,
    has_phone: hasPhone,
  });
}

export function trackGa4GenerateChart(tier: string, namDuong?: number, gioiTinh?: string) {
  trackGa4Event('an_sao_la_so', {
    chart_tier: tier,
    birth_year: namDuong,
    gender: gioiTinh,
  });
  trackGa4Event('add_to_wishlist', {
    currency: 'VND',
    value: 119000,
    items: [
      {
        item_id: `chart_${tier || 'free'}`,
        item_name: 'An Sao & Bình Giải Lá Số Tử Vi',
        item_category: 'Lá Số Tử Vi',
        price: 0,
        quantity: 1,
      },
    ],
  });
}

export function trackGa4ViewCourse() {
  const item = mapPaymentTypeToGa4Item('course_tuvi', 699000);
  trackGa4Event('view_item', {
    currency: 'VND',
    value: 699000,
    items: [item],
  });
}

export function trackGa4PlayCourseLesson(lessonId: string, isFreePreview: boolean) {
  trackGa4Event('nghe_podcast_hoc_thu', {
    lesson_id: lessonId,
    is_free_preview: isFreePreview,
    currency: 'VND',
    value: 699000,
  });
}

export function trackGa4BeginCheckout(
  paymentType: string,
  price: number,
  orderCode?: string,
  voucherCode?: string
) {
  const item = mapPaymentTypeToGa4Item(paymentType, price);
  trackGa4Event('begin_checkout', {
    transaction_id: orderCode,
    currency: 'VND',
    value: price,
    ...(voucherCode ? { coupon: voucherCode } : {}),
    items: [item],
  });
}

export function trackGa4PaymentQrAction(
  action: 'copy_stk' | 'copy_content' | 'copy_amount' | 'copy_all' | 'download_qr',
  paymentType: string,
  price: number,
  orderCode?: string
) {
  trackGa4Event('payment_qr_action', {
    qr_action: action,
    payment_type: paymentType,
    transaction_id: orderCode,
    currency: 'VND',
    value: price,
  });
}

export function trackGa4Purchase(paymentType: string, price: number, orderCode?: string) {
  if (typeof window !== 'undefined' && orderCode) {
    const trackedKey = `ga4_purchased_${orderCode}`;
    if (sessionStorage.getItem(trackedKey)) return;
    sessionStorage.setItem(trackedKey, '1');
  }
  const item = mapPaymentTypeToGa4Item(paymentType, price);
  trackGa4Event('purchase', {
    transaction_id: orderCode || `tx_${Date.now()}`,
    currency: 'VND',
    value: price,
    items: [item],
  });
}

export function trackGa4Contact(channel: 'phone' | 'zalo', location?: string) {
  trackGa4Event('contact_zalo_phone', {
    contact_channel: channel,
    button_location: location || 'website',
  });
}
