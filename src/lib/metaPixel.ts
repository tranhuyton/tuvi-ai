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

export function trackLeadChart(hoTen: string, tier: string) {
  trackMetaEvent('Lead', {
    content_name: 'Lap La So Tu Vi',
    content_category: tier,
    status: 'completed',
  });
}

export function trackInitiateCheckout(paymentType: string, price: number, orderCode?: string) {
  trackMetaEvent('InitiateCheckout', {
    content_name: paymentType,
    content_ids: [orderCode || paymentType],
    content_type: 'product',
    value: price,
    currency: 'VND',
    num_items: 1,
  });
}

export function trackPurchase(paymentType: string, price: number, orderCode?: string) {
  if (typeof window !== 'undefined' && orderCode) {
    const trackedKey = `fbq_purchased_${orderCode}`;
    if (sessionStorage.getItem(trackedKey)) return;
    sessionStorage.setItem(trackedKey, '1');
  }
  trackMetaEvent(
    'Purchase',
    {
      content_name: paymentType,
      content_ids: [orderCode || paymentType],
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
}
