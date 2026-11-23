import crypto from 'crypto';
import { adminSupabase as supabase } from './supabaseAdmin';
import type { OrderCapiMeta } from './metaCapi';

export interface OrderItem {
  id: string;
  orderCode: string; // e.g. "TV849201"
  paymentType:
    | 'reading_vip'
    | 'reading_expert'
    | 'upgrade_expert'
    | 'upgrade_offline_1on1'
    | 'offline_1on1'
    | 'chat_free'
    | 'chat_vip'
    | 'chat_expert'
    | 'course_tuvi'
    | string;
  amount: number;
  hoTen: string;
  email?: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  createdAt: string;
  paidAt?: string;
  expiresAt?: string;
  transactionId?: string;
  capiMeta?: OrderCapiMeta;
  chartId?: string;
  userId?: string;
  affiliateCode?: string;
  commissionAmount?: number;
  commissionRecordedAt?: string;
  commissionReversedAt?: string;
  voucherCode?: string;
  discountAmount?: number;
}

function mapRowToOrder(data: Record<string, unknown>): OrderItem {
  return {
    id: String(data.id || ''),
    orderCode: String(data.order_code || '').toUpperCase(),
    paymentType: String(data.payment_type || 'reading_vip'),
    amount: Number(data.amount || 0),
    hoTen: String(data.ho_ten || 'Đương số'),
    email: typeof data.email === 'string' && data.email ? data.email : undefined,
    status: (data.status as OrderItem['status']) || 'PENDING',
    createdAt: String(data.created_at || ''),
    paidAt: typeof data.paid_at === 'string' ? data.paid_at : undefined,
    expiresAt: typeof data.expires_at === 'string' ? data.expires_at : undefined,
    transactionId: typeof data.transaction_id === 'string' ? data.transaction_id : undefined,
    capiMeta:
      data.capi_meta && typeof data.capi_meta === 'object'
        ? (data.capi_meta as OrderCapiMeta)
        : undefined,
    chartId: typeof data.chart_id === 'string' ? data.chart_id : undefined,
    userId: typeof data.user_id === 'string' ? data.user_id : undefined,
    affiliateCode: typeof data.affiliate_code === 'string' && data.affiliate_code ? data.affiliate_code : undefined,
    commissionAmount: Number(data.commission_amount || 0),
    commissionRecordedAt:
      typeof data.commission_recorded_at === 'string' ? data.commission_recorded_at : undefined,
    commissionReversedAt:
      typeof data.commission_reversed_at === 'string' ? data.commission_reversed_at : undefined,
    voucherCode: typeof data.voucher_code === 'string' && data.voucher_code ? data.voucher_code : undefined,
    discountAmount: Number(data.discount_amount || 0),
  };
}

/**
 * Sinh mã đơn hàng dạng "TV" + 6 số bằng CSPRNG (Ví dụ: TV582914)
 */
export function generateOrderCode(): string {
  const randomNum = crypto.randomInt(100000, 1000000);
  return `TV${randomNum}`;
}

/**
 * Tạo đơn hàng mới trực tiếp trên Supabase (có xử lý retry khi trùng mã order_code 23505,
 * tuyệt đối không đánh rơi affiliate_code / voucher_code / discount_amount khi fallback cột mới).
 */
export async function createOrder(data: {
  paymentType: string;
  amount: number;
  hoTen: string;
  email?: string;
  chartId?: string;
  userId?: string;
  customCode?: string;
  affiliateCode?: string;
  commissionAmount?: number;
  voucherCode?: string;
  discountAmount?: number;
  expiresAt?: string;
  initialTransactionMeta?: string;
  capiMeta?: OrderCapiMeta;
}): Promise<OrderItem> {
  const now = new Date().toISOString();
  const maxAttempts = data.customCode ? 1 : 6;
  let lastErrorMsg = 'Không thể khởi tạo đơn hàng';

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const orderCode = (data.customCode || generateOrderCode()).toUpperCase();
    const id = `ord_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;

    const baseRow: Record<string, unknown> = {
      id,
      order_code: orderCode,
      payment_type: String(data.paymentType || 'reading_vip').slice(0, 50),
      amount: data.amount,
      ho_ten: String(data.hoTen || 'Khách thành viên').slice(0, 180),
      email: data.email ? String(data.email).trim().toLowerCase().slice(0, 180) : null,
      status: 'PENDING',
      created_at: now,
      transaction_id: data.initialTransactionMeta ? String(data.initialTransactionMeta).slice(0, 240) : null,
      chart_id: data.chartId || null,
      user_id: data.userId || null,
      affiliate_code: data.affiliateCode ? String(data.affiliateCode).trim().toLowerCase().slice(0, 100) : null,
      commission_amount: data.commissionAmount || 0,
      voucher_code: data.voucherCode ? String(data.voucherCode).trim().toUpperCase().slice(0, 60) : null,
      discount_amount: data.discountAmount || 0,
    };

    const fullRow: Record<string, unknown> = {
      ...baseRow,
      ...(data.capiMeta ? { capi_meta: data.capiMeta } : {}),
      ...(data.expiresAt ? { expires_at: data.expiresAt } : {}),
    };

    let res = await supabase.from('tuvi_orders').insert(fullRow).select('*').maybeSingle();

    // Chỉ bỏ cột mới (`capi_meta` / `expires_at`) nếu DB chưa chạy migration, KHÔNG BAO GIỜ bỏ voucher/affiliate!
    if (res.error && /capi_meta|expires_at|column .* does not exist/i.test(res.error.message || '')) {
      res = await supabase.from('tuvi_orders').insert(baseRow).select('*').maybeSingle();
    }

    if (!res.error && res.data) {
      return mapRowToOrder(res.data as Record<string, unknown>);
    }

    const pgCode = (res.error as { code?: string } | null)?.code || '';
    const errMsg = res.error?.message || 'Database insert error';
    lastErrorMsg = errMsg;

    // Nếu trùng order_code (23505) và không phải customCode -> tự sinh mã mới thử lại
    if (pgCode === '23505' && /order_code/i.test(errMsg) && !data.customCode) {
      continue;
    }

    throw new Error(`Không thể lưu đơn hàng vào cơ sở dữ liệu: ${errMsg}`);
  }

  throw new Error(`Không thể sinh mã đơn hàng duy nhất: ${lastErrorMsg}`);
}

/**
 * Tìm đơn hàng theo mã đơn trực tiếp từ Supabase (không dùng file cache cục bộ)
 */
export async function getOrderByCode(code: string): Promise<OrderItem | null> {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) return null;

  const { data, error } = await supabase
    .from('tuvi_orders')
    .select('*')
    .eq('order_code', cleanCode)
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToOrder(data as Record<string, unknown>);
}

/**
 * Cập nhật email cho đơn hàng PENDING
 */
export async function updateOrderEmail(code: string, email: string): Promise<OrderItem | null> {
  const cleanCode = code.trim().toUpperCase();
  const cleanEmail = email.trim().toLowerCase();
  const { data, error } = await supabase
    .from('tuvi_orders')
    .update({ email: cleanEmail })
    .eq('order_code', cleanCode)
    .eq('status', 'PENDING')
    .select('*')
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToOrder(data as Record<string, unknown>);
}

/**
 * Chuyển trạng thái đơn hàng từ PENDING -> PAID hoàn toàn NGUYÊN TỬ trên PostgreSQL.
 * - KHÔNG BAO GIỜ fallback non-atomic (chống 100% hồi sinh đơn CANCELLED và chống cộng đôi khi webhook bắn song song).
 */
export async function markOrderPaidAtomic(
  code: string,
  transactionId?: string
): Promise<{ order: OrderItem | null; transitioned: boolean }> {
  const cleanCode = code.trim().toUpperCase();
  const paidAt = new Date().toISOString();
  const cleanTxId = transactionId ? String(transactionId).slice(0, 240) : null;

  const { data, error } = await supabase
    .from('tuvi_orders')
    .update({
      status: 'PAID',
      paid_at: paidAt,
      ...(cleanTxId ? { transaction_id: cleanTxId } : {}),
    })
    .eq('order_code', cleanCode)
    .eq('status', 'PENDING')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('[ORDER STORE] Lỗi markOrderPaidAtomic:', error.message);
    throw new Error(`Không thể xác nhận thanh toán đơn ${cleanCode}: ${error.message}`);
  }

  if (data) {
    return { order: mapRowToOrder(data as Record<string, unknown>), transitioned: true };
  }

  // Không khớp dòng PENDING nào (đơn đã PAID trước đó hoặc đã CANCELLED) -> KHÔNG chuyển trạng thái!
  const existing = await getOrderByCode(cleanCode);
  return { order: existing, transitioned: false };
}

/**
 * Cập nhật trạng thái đơn hàng an toàn (dùng cho Admin):
 * - Cấm chuyển trực tiếp sang PAID (phải dùng /api/payment/simulate để chạy đủ fulfillment)
 * - Cấm khôi phục đơn đã từng PAID từ CANCELLED về PENDING (chống cộng đúp hoa hồng / quota)
 */
export async function updateOrderStatusSafe(
  code: string,
  nextStatus: 'PENDING' | 'CANCELLED'
): Promise<{ order: OrderItem | null; previousStatus?: OrderItem['status']; error?: string }> {
  const existing = await getOrderByCode(code);
  if (!existing) return { order: null, error: 'Không tìm thấy đơn hàng' };

  if (existing.status === 'CANCELLED' && nextStatus === 'PENDING' && existing.paidAt) {
    return {
      order: existing,
      error: 'Không được chuyển lại về PENDING với đơn hàng đã từng thanh toán trước đó.',
    };
  }

  const { data, error } = await supabase
    .from('tuvi_orders')
    .update({ status: nextStatus })
    .eq('order_code', existing.orderCode)
    .select('*')
    .maybeSingle();

  if (error || !data) {
    return { order: null, error: error?.message || 'Không thể cập nhật trạng thái đơn hàng' };
  }

  return {
    order: mapRowToOrder(data as Record<string, unknown>),
    previousStatus: existing.status,
  };
}

/**
 * Cập nhật chartId cho đơn hàng
 */
export async function linkOrderToChart(
  code: string,
  chartId: string
): Promise<OrderItem | null> {
  const cleanCode = code.trim().toUpperCase();
  const { data, error } = await supabase
    .from('tuvi_orders')
    .update({ chart_id: chartId })
    .eq('order_code', cleanCode)
    .select('*')
    .maybeSingle();

  if (error || !data) return null;
  return mapRowToOrder(data as Record<string, unknown>);
}

/**
 * Lấy danh sách đơn hàng theo đúng mã CTV (không quét toàn bảng!)
 */
export async function getOrdersByAffiliateCode(
  affiliateCode: string,
  limit = 100
): Promise<OrderItem[]> {
  const cleanCode = affiliateCode.trim().toLowerCase();
  if (!cleanCode) return [];

  const { data, error } = await supabase
    .from('tuvi_orders')
    .select('*')
    .eq('affiliate_code', cleanCode)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as Array<Record<string, unknown>>).map(mapRowToOrder);
}

/**
 * Lấy danh sách toàn bộ đơn hàng có phân trang thực (vượt trần 1.000 / 5.000 dòng của PostgREST)
 */
export async function getAllOrders(limit?: number): Promise<OrderItem[]> {
  const pageSize = 1000;
  const maxRows = limit && limit > 0 ? limit : 20000;
  const all: OrderItem[] = [];

  for (let offset = 0; offset < maxRows; offset += pageSize) {
    const to = Math.min(offset + pageSize - 1, maxRows - 1);
    const { data, error } = await supabase
      .from('tuvi_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, to);

    if (error) {
      console.error('[ORDER STORE] Lỗi truy vấn getAllOrders:', error.message);
      break;
    }
    if (!data || data.length === 0) break;

    for (const row of data as Array<Record<string, unknown>>) {
      all.push(mapRowToOrder(row));
    }
    if (data.length < pageSize) break;
  }

  return all;
}
