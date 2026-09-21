import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

export interface OrderItem {
  id: string;
  orderCode: string; // e.g. "TV84920"
  paymentType: 'reading_vip' | 'chat_free' | 'chat_vip' | string;
  amount: number;
  hoTen: string;
  email?: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  createdAt: string;
  paidAt?: string;
  transactionId?: string;
  chartId?: string;
  userId?: string;
}

// Global cache trong runtime Node
declare global {
  var __tuviOrdersCache: Map<string, OrderItem> | undefined;
}

const ordersMap: Map<string, OrderItem> =
  globalThis.__tuviOrdersCache || new Map<string, OrderItem>();
globalThis.__tuviOrdersCache = ordersMap;

// Đường dẫn file lưu trữ local fallback
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'orders.json');

// Khởi tạo đọc từ file nếu bộ nhớ đang rỗng
function loadOrdersFromFile() {
  try {
    if (ordersMap.size === 0 && fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const list: OrderItem[] = JSON.parse(content);
      for (const item of list) {
        ordersMap.set(item.orderCode.toUpperCase(), item);
      }
    }
  } catch (err) {
    console.warn('[ORDER STORE] Không thể đọc file cache orders:', err);
  }
}

// Lưu ra file local
function saveOrdersToFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const list = Array.from(ordersMap.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[ORDER STORE] Không thể ghi file cache orders:', err);
  }
}

loadOrdersFromFile();

/**
 * Sinh mã đơn hàng dạng "TV" + 5 số (Ví dụ: TV58291)
 * Giúp người dùng chuyển khoản dễ dàng, không bị cắt ngắn bởi ngân hàng
 */
export function generateOrderCode(): string {
  loadOrdersFromFile();
  let code = '';
  let exists = true;
  let attempts = 0;

  while (exists && attempts < 100) {
    attempts++;
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    code = `TV${randomNum}`;
    if (!ordersMap.has(code)) {
      exists = false;
    }
  }

  return code;
}

/**
 * Tạo đơn hàng mới
 */
export async function createOrder(data: {
  paymentType: string;
  amount: number;
  hoTen: string;
  email?: string;
  chartId?: string;
  userId?: string;
  customCode?: string;
}): Promise<OrderItem> {
  loadOrdersFromFile();

  const orderCode = (data.customCode || generateOrderCode()).toUpperCase();
  const id = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const newOrder: OrderItem = {
    id,
    orderCode,
    paymentType: data.paymentType,
    amount: data.amount,
    hoTen: data.hoTen || 'Đương số',
    email: data.email?.trim() || undefined,
    status: 'PENDING',
    createdAt: now,
    chartId: data.chartId,
    userId: data.userId,
  };

  // Lưu vào cache Map & local file
  ordersMap.set(orderCode, newOrder);
  saveOrdersToFile();

  // Thử đồng bộ với bảng Supabase tuvi_orders nếu tồn tại
  try {
    await supabase.from('tuvi_orders').insert({
      id: newOrder.id,
      order_code: newOrder.orderCode,
      payment_type: newOrder.paymentType,
      amount: newOrder.amount,
      ho_ten: newOrder.hoTen,
      email: newOrder.email || null,
      status: 'PENDING',
      created_at: newOrder.createdAt,
      chart_id: newOrder.chartId || null,
      user_id: newOrder.userId || null,
    });
  } catch (err) {
    // Bỏ qua nếu bảng tuvi_orders chưa được tạo trong Supabase
  }

  return newOrder;
}

/**
 * Tìm đơn hàng theo mã đơn
 */
export async function getOrderByCode(code: string): Promise<OrderItem | null> {
  const cleanCode = code.trim().toUpperCase();

  // 1. Luôn truy vấn Supabase trước (nguồn dữ liệu chính xác trên Serverless đa container)
  try {
    const { data } = await supabase
      .from('tuvi_orders')
      .select('*')
      .eq('order_code', cleanCode)
      .maybeSingle();

    if (data) {
      const order: OrderItem = {
        id: data.id,
        orderCode: data.order_code,
        paymentType: data.payment_type,
        amount: Number(data.amount),
        hoTen: data.ho_ten,
        email: data.email,
        status: data.status,
        createdAt: data.created_at,
        paidAt: data.paid_at,
        transactionId: data.transaction_id,
        chartId: data.chart_id,
        userId: data.user_id,
      };
      ordersMap.set(cleanCode, order);
      saveOrdersToFile();
      return order;
    }
  } catch (err) {
    // Lỗi mạng hoặc Supabase tạm thời, dùng cache fallback
  }

  // 2. Fallback sang cache in-memory / file local nếu Supabase không có
  loadOrdersFromFile();
  if (ordersMap.has(cleanCode)) {
    return ordersMap.get(cleanCode)!;
  }

  return null;
}

/**
 * Cập nhật email cho đơn hàng (khi khách nhập email trên modal)
 */
export async function updateOrderEmail(code: string, email: string): Promise<OrderItem | null> {
  const order = await getOrderByCode(code);
  if (!order) return null;

  order.email = email.trim();
  ordersMap.set(order.orderCode, order);
  saveOrdersToFile();

  try {
    await supabase
      .from('tuvi_orders')
      .update({ email: order.email })
      .eq('order_code', order.orderCode);
  } catch (err) {
    // ignore
  }

  return order;
}

/**
 * Cập nhật đơn hàng thành ĐÃ THANH TOÁN (PAID)
 */
export async function markOrderPaid(
  code: string,
  transactionId?: string
): Promise<OrderItem | null> {
  const order = await getOrderByCode(code);
  if (!order) return null;

  order.status = 'PAID';
  order.paidAt = new Date().toISOString();
  if (transactionId) order.transactionId = transactionId;

  ordersMap.set(order.orderCode, order);
  saveOrdersToFile();

  try {
    await supabase
      .from('tuvi_orders')
      .update({
        status: 'PAID',
        paid_at: order.paidAt,
        transaction_id: transactionId || null,
      })
      .eq('order_code', order.orderCode);
  } catch (err) {
    // ignore
  }

  return order;
}

/**
 * Lấy danh sách toàn bộ đơn hàng (Dùng cho Admin)
 */
export async function getAllOrders(limit: number = 50): Promise<OrderItem[]> {
  loadOrdersFromFile();

  // Thử lấy từ Supabase
  try {
    const { data } = await supabase
      .from('tuvi_orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (data && data.length > 0) {
      ordersMap.clear();
      for (const row of data) {
        const item: OrderItem = {
          id: row.id,
          orderCode: row.order_code,
          paymentType: row.payment_type,
          amount: Number(row.amount),
          hoTen: row.ho_ten,
          email: row.email,
          status: row.status,
          createdAt: row.created_at,
          paidAt: row.paid_at,
          transactionId: row.transaction_id,
          chartId: row.chart_id,
          userId: row.user_id,
        };
        ordersMap.set(item.orderCode, item);
      }
      saveOrdersToFile();
    }
  } catch (err) {
    // Supabase table might not exist
  }

  const list = Array.from(ordersMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return list.slice(0, limit);
}
