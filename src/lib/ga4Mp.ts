import { GA4_MEASUREMENT_ID, mapPaymentTypeToGa4Item } from './googleAnalytics';

export interface SendGa4ServerPurchaseInput {
  orderCode: string;
  paymentType: string;
  amount: number;
  gaClientId?: string | null;
  userId?: string | null;
  timeoutMs?: number;
}

/**
 * Gửi sự kiện `purchase` Server-Side qua Google Analytics 4 Measurement Protocol.
 * GA4 tự động khử trùng lặp (deduplicate) với trình duyệt dựa trên `transaction_id` (`orderCode`).
 * Tự kích hoạt ngay khi biến môi trường `GA4_API_SECRET` có mặt trên máy chủ.
 */
export async function sendGa4ServerPurchase(input: SendGa4ServerPurchaseInput): Promise<boolean> {
  const apiSecret = (process.env.GA4_API_SECRET || '').trim();
  if (!apiSecret) {
    return false;
  }

  const clientId =
    (input.gaClientId || '').trim() || `webhook.${input.orderCode || Date.now()}`;
  const item = mapPaymentTypeToGa4Item(input.paymentType, input.amount);

  const payload: Record<string, any> = {
    client_id: clientId,
    ...(input.userId ? { user_id: input.userId } : {}),
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: input.orderCode,
          value: input.amount,
          currency: 'VND',
          engagement_time_msec: 100,
          items: [item],
        },
      },
    ],
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs ?? 2500);

  try {
    const endpoint = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(
      GA4_MEASUREMENT_ID
    )}&api_secret=${encodeURIComponent(apiSecret)}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    if (res.ok || res.status === 204) {
      console.log(`[GA4 MP] Đã ghi nhận Server-Side purchase cho đơn ${input.orderCode}`);
      return true;
    }
    console.warn(`[GA4 MP] Phản hồi HTTP ${res.status} cho đơn ${input.orderCode}`);
    return false;
  } catch (err) {
    console.warn(`[GA4 MP] Không thể gửi Server-Side purchase cho đơn ${input.orderCode}:`, err);
    return false;
  } finally {
    clearTimeout(timer);
  }
}
