import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

export interface AffiliateItem {
  id: string;
  code: string; // Mã ref (ví dụ: diep93, nam88, thayton...), viết thường không dấu
  name: string; // Tên CTV
  phone?: string;
  email?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  commissionRate: number; // % hoa hồng (mặc định 25 - 30%)
  commissionFixed?: number; // Hoặc số tiền cố định VND/đơn
  status: 'ACTIVE' | 'INACTIVE';
  totalClicks: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommission: number;
  paidCommission: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

// Global cache trong runtime Node
declare global {
  var __tuviAffiliatesCache: Map<string, AffiliateItem> | undefined;
}

const affiliatesMap: Map<string, AffiliateItem> =
  globalThis.__tuviAffiliatesCache || new Map<string, AffiliateItem>();
globalThis.__tuviAffiliatesCache = affiliatesMap;

function getDataFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'affiliates.json');
  }
  const localDir = path.join(process.cwd(), '.data');
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, 'affiliates.json');
  } catch {
    return path.join('/tmp', 'affiliates.json');
  }
}

function loadFromFile() {
  try {
    const dataFile = getDataFilePath();
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      const list: AffiliateItem[] = JSON.parse(content);
      if (Array.isArray(list)) {
        for (const item of list) {
          affiliatesMap.set(item.code.toLowerCase(), item);
        }
      }
    }
  } catch (err) {
    console.warn('[AFFILIATE STORE] Lỗi nạp cache từ file:', err);
  }
}

function saveToFile() {
  try {
    const dataFile = getDataFilePath();
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const list = Array.from(affiliatesMap.values());
    fs.writeFileSync(dataFile, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[AFFILIATE STORE] Lỗi ghi cache ra file:', err);
  }
}

loadFromFile();

function rowToAffiliateItem(row: any): AffiliateItem {
  return {
    id: row.id,
    code: String(row.code || '').toLowerCase().trim(),
    name: row.name || 'Cộng Tác Viên',
    phone: row.phone || undefined,
    email: row.email || undefined,
    bankName: row.bank_name || undefined,
    bankAccountNumber: row.bank_account_number || undefined,
    bankAccountName: row.bank_account_name || undefined,
    commissionRate: Number(row.commission_rate ?? 25),
    commissionFixed: row.commission_fixed ? Number(row.commission_fixed) : undefined,
    status: row.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    totalClicks: Number(row.total_clicks || 0),
    totalOrders: Number(row.total_orders || 0),
    totalRevenue: Number(row.total_revenue || 0),
    totalCommission: Number(row.total_commission || 0),
    paidCommission: Number(row.paid_commission || 0),
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
    notes: row.notes || undefined,
  };
}

/**
 * Lấy danh sách toàn bộ Cộng Tác Viên
 */
export async function getAllAffiliates(): Promise<AffiliateItem[]> {
  loadFromFile();

  try {
    const { data, error } = await supabase
      .from('tuvi_affiliates')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      affiliatesMap.clear();
      for (const row of data) {
        const item = rowToAffiliateItem(row);
        affiliatesMap.set(item.code.toLowerCase(), item);
      }
      saveToFile();
    }
  } catch (err) {
    // Supabase table chưa tạo hoặc lỗi mạng, dùng cache fallback
  }

  return Array.from(affiliatesMap.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Tìm CTV theo mã Ref
 */
export async function getAffiliateByCode(code: string): Promise<AffiliateItem | null> {
  const cleanCode = code.trim().toLowerCase();
  if (!cleanCode) return null;

  try {
    const { data } = await supabase
      .from('tuvi_affiliates')
      .select('*')
      .eq('code', cleanCode)
      .maybeSingle();

    if (data) {
      const item = rowToAffiliateItem(data);
      affiliatesMap.set(cleanCode, item);
      saveToFile();
      return item;
    }
  } catch {
    // fallback
  }

  loadFromFile();
  return affiliatesMap.get(cleanCode) || null;
}

/**
 * Tìm CTV theo Mã hoặc Số điện thoại (dành cho trang tra cứu cá nhân /ctv)
 */
export async function getAffiliateByPhoneOrCode(identifier: string): Promise<AffiliateItem | null> {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return null;

  const all = await getAllAffiliates();
  const found = all.find(
    (a) => a.code.toLowerCase() === clean || (a.phone && a.phone.replace(/\D/g, '') === clean.replace(/\D/g, ''))
  );
  return found || null;
}

/**
 * Tạo mới CTV
 */
export async function createAffiliate(data: {
  code: string;
  name: string;
  phone?: string;
  email?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  commissionRate?: number;
  commissionFixed?: number;
  notes?: string;
}): Promise<AffiliateItem> {
  const cleanCode = data.code.trim().toLowerCase();
  const id = `aff_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const newAff: AffiliateItem = {
    id,
    code: cleanCode,
    name: data.name.trim(),
    phone: data.phone?.trim() || undefined,
    email: data.email?.trim() || undefined,
    bankName: data.bankName?.trim() || undefined,
    bankAccountNumber: data.bankAccountNumber?.trim() || undefined,
    bankAccountName: data.bankAccountName?.trim() || undefined,
    commissionRate: data.commissionRate !== undefined ? Number(data.commissionRate) : 25,
    commissionFixed: data.commissionFixed !== undefined ? Number(data.commissionFixed) : undefined,
    status: 'ACTIVE',
    totalClicks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCommission: 0,
    paidCommission: 0,
    createdAt: now,
    updatedAt: now,
    notes: data.notes?.trim() || undefined,
  };

  affiliatesMap.set(cleanCode, newAff);
  saveToFile();

  try {
    await supabase.from('tuvi_affiliates').insert({
      id: newAff.id,
      code: newAff.code,
      name: newAff.name,
      phone: newAff.phone || null,
      email: newAff.email || null,
      bank_name: newAff.bankName || null,
      bank_account_number: newAff.bankAccountNumber || null,
      bank_account_name: newAff.bankAccountName || null,
      commission_rate: newAff.commissionRate,
      commission_fixed: newAff.commissionFixed || null,
      status: newAff.status,
      total_clicks: 0,
      total_orders: 0,
      total_revenue: 0,
      total_commission: 0,
      paid_commission: 0,
      created_at: newAff.createdAt,
      updated_at: newAff.updatedAt,
      notes: newAff.notes || null,
    });
  } catch (err) {
    console.warn('[AFFILIATE STORE] Lỗi insert Supabase:', err);
  }

  return newAff;
}

/**
 * Cập nhật thông tin CTV
 */
export async function updateAffiliate(
  id: string,
  data: Partial<AffiliateItem>
): Promise<AffiliateItem | null> {
  const all = await getAllAffiliates();
  const aff = all.find((a) => a.id === id);
  if (!aff) return null;

  const now = new Date().toISOString();
  const updated: AffiliateItem = {
    ...aff,
    ...data,
    code: data.code ? data.code.trim().toLowerCase() : aff.code,
    updatedAt: now,
  };

  affiliatesMap.set(updated.code, updated);
  saveToFile();

  try {
    await supabase
      .from('tuvi_affiliates')
      .update({
        code: updated.code,
        name: updated.name,
        phone: updated.phone || null,
        email: updated.email || null,
        bank_name: updated.bankName || null,
        bank_account_number: updated.bankAccountNumber || null,
        bank_account_name: updated.bankAccountName || null,
        commission_rate: updated.commissionRate,
        commission_fixed: updated.commissionFixed || null,
        status: updated.status,
        total_clicks: updated.totalClicks,
        total_orders: updated.totalOrders,
        total_revenue: updated.totalRevenue,
        total_commission: updated.totalCommission,
        paid_commission: updated.paidCommission,
        updated_at: updated.updatedAt,
        notes: updated.notes || null,
      })
      .eq('id', id);
  } catch (err) {
    console.warn('[AFFILIATE STORE] Lỗi update Supabase:', err);
  }

  return updated;
}

/**
 * Xóa CTV
 */
export async function deleteAffiliate(id: string): Promise<boolean> {
  const all = await getAllAffiliates();
  const aff = all.find((a) => a.id === id);
  if (!aff) return false;

  affiliatesMap.delete(aff.code);
  saveToFile();

  try {
    await supabase.from('tuvi_affiliates').delete().eq('id', id);
  } catch (err) {
    console.warn('[AFFILIATE STORE] Lỗi delete Supabase:', err);
  }

  return true;
}

/**
 * Ghi nhận lượt click link giới thiệu
 */
export async function recordAffiliateClick(code: string): Promise<void> {
  const aff = await getAffiliateByCode(code);
  if (!aff || aff.status !== 'ACTIVE') return;

  aff.totalClicks = (aff.totalClicks || 0) + 1;
  aff.updatedAt = new Date().toISOString();
  affiliatesMap.set(aff.code, aff);
  saveToFile();

  try {
    await supabase
      .from('tuvi_affiliates')
      .update({
        total_clicks: aff.totalClicks,
        updated_at: aff.updatedAt,
      })
      .eq('id', aff.id);
  } catch {
    // ignore
  }
}

/**
 * Ghi nhận hoa hồng khi có đơn thanh toán thành công
 */
export async function recordAffiliateCommission(
  code: string,
  orderAmount: number,
  orderCode: string
): Promise<number> {
  const aff = await getAffiliateByCode(code);
  if (!aff) return 0;

  // Tính tiền hoa hồng
  let commission = 0;
  if (aff.commissionFixed && aff.commissionFixed > 0) {
    commission = aff.commissionFixed;
  } else {
    const rate = aff.commissionRate || 25;
    commission = Math.round((orderAmount * rate) / 100);
  }

  aff.totalOrders = (aff.totalOrders || 0) + 1;
  aff.totalRevenue = (aff.totalRevenue || 0) + orderAmount;
  aff.totalCommission = (aff.totalCommission || 0) + commission;
  aff.updatedAt = new Date().toISOString();

  affiliatesMap.set(aff.code, aff);
  saveToFile();

  try {
    await supabase
      .from('tuvi_affiliates')
      .update({
        total_orders: aff.totalOrders,
        total_revenue: aff.totalRevenue,
        total_commission: aff.totalCommission,
        updated_at: aff.updatedAt,
      })
      .eq('id', aff.id);
  } catch (err) {
    console.warn('[AFFILIATE STORE] Lỗi ghi nhận hoa hồng Supabase:', err);
  }

  return commission;
}

/**
 * Thanh toán hoa hồng cho CTV (Đối soát & Đánh dấu đã chi trả)
 */
export async function payoutAffiliate(
  id: string,
  amount: number,
  note?: string
): Promise<AffiliateItem | null> {
  const all = await getAllAffiliates();
  const aff = all.find((a) => a.id === id);
  if (!aff) return null;

  aff.paidCommission = (aff.paidCommission || 0) + amount;
  if (note) {
    const timeStr = new Date().toLocaleDateString('vi-VN');
    aff.notes = (aff.notes ? `${aff.notes}\n` : '') + `[${timeStr}] Đã thanh toán: ${amount.toLocaleString('vi-VN')}đ (${note})`;
  }
  aff.updatedAt = new Date().toISOString();

  affiliatesMap.set(aff.code, aff);
  saveToFile();

  try {
    await supabase
      .from('tuvi_affiliates')
      .update({
        paid_commission: aff.paidCommission,
        notes: aff.notes || null,
        updated_at: aff.updatedAt,
      })
      .eq('id', aff.id);
  } catch (err) {
    console.warn('[AFFILIATE STORE] Lỗi payout Supabase:', err);
  }

  return aff;
}
