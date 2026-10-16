import fs from 'fs';
import path from 'path';
import { supabase } from './supabase';

import {
  AffiliateItem,
  AffiliateTierCommissions,
  CommissionMode,
  DEFAULT_TIER_COMMISSIONS,
  calculateAffiliateCommission,
  inferBankCode,
} from '@/types/affiliate';
export type { AffiliateItem };
export { inferBankCode, calculateAffiliateCommission };

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
  const bName = row.bank_name || undefined;
  const bCode = row.bank_code || inferBankCode(bName);
  const fixedVal = row.commission_fixed ? Number(row.commission_fixed) : undefined;
  const tiersVal: AffiliateTierCommissions | undefined =
    row.commission_tiers && typeof row.commission_tiers === 'object'
      ? { ...DEFAULT_TIER_COMMISSIONS, ...row.commission_tiers }
      : undefined;

  const mode: CommissionMode =
    row.commission_mode === 'tier' || row.commission_mode === 'fixed' || row.commission_mode === 'percent'
      ? row.commission_mode
      : tiersVal
      ? 'tier'
      : fixedVal && fixedVal > 0
      ? 'fixed'
      : 'percent';

  return {
    id: row.id,
    code: String(row.code || '').toLowerCase().trim(),
    name: row.name || 'Cộng Tác Viên',
    phone: row.phone || undefined,
    email: row.email || undefined,
    bankName: bName,
    bankCode: bCode,
    bankAccountNumber: row.bank_account_number || undefined,
    bankAccountName: row.bank_account_name || undefined,
    commissionMode: mode,
    commissionRate: Number(row.commission_rate ?? 25),
    commissionFixed: fixedVal,
    commissionTiers: tiersVal,
    status: row.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE',
    totalClicks: Number(row.total_clicks || 0),
    totalOrders: Number(row.total_orders || 0),
    totalRevenue: Number(row.total_revenue || 0),
    totalCommission: Number(row.total_commission || 0),
    paidCommission: Number(row.paid_commission || 0),
    pendingWithdrawal: Number(row.pending_withdrawal || 0),
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
 * Tìm CTV theo Mã hoặc Số điện thoại
 */
export async function getAffiliateByPhoneOrCode(identifier: string): Promise<AffiliateItem | null> {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return null;

  const all = await getAllAffiliates();
  const digits = clean.replace(/\D/g, '');
  const found = all.find(
    (a) =>
      a.code.toLowerCase() === clean ||
      (digits.length >= 9 && a.phone && a.phone.replace(/\D/g, '') === digits)
  );
  return found || null;
}

/**
 * Xác thực bảo mật CTV bằng Số điện thoại đăng ký (kèm Mã CTV tùy chọn)
 * Không cho phép tra cứu chỉ bằng Mã CTV công khai trên link ref
 */
export async function verifyAffiliateByPhone(
  phoneInput: string,
  codeInput?: string
): Promise<{ affiliate?: AffiliateItem; error?: string }> {
  const phoneDigits = (phoneInput || '').replace(/\D/g, '');
  if (phoneDigits.length < 9) {
    return {
      error: 'Vui lòng nhập Số điện thoại đã đăng ký của Cộng tác viên để tra cứu bảo mật.',
    };
  }

  const all = await getAllAffiliates();
  const cleanCode = (codeInput || '').trim().toLowerCase();

  if (cleanCode) {
    const affByCode = all.find((a) => a.code.toLowerCase() === cleanCode);
    if (!affByCode) {
      return { error: `Không tìm thấy Mã CTV "${cleanCode}" trong hệ thống.` };
    }
    const storedDigits = (affByCode.phone || '').replace(/\D/g, '');
    if (!storedDigits) {
      return {
        error:
          'Mã CTV này chưa được gắn Số điện thoại bảo mật. Vui lòng nhắn Admin (Thầy Tôn) cập nhật SĐT của bạn.',
      };
    }
    if (storedDigits !== phoneDigits) {
      return { error: 'Số điện thoại không khớp với Mã CTV này. Vui lòng kiểm tra lại.' };
    }
    return { affiliate: affByCode };
  }

  const affByPhone = all.find((a) => a.phone && a.phone.replace(/\D/g, '') === phoneDigits);
  if (!affByPhone) {
    return { error: 'Không tìm thấy Cộng tác viên nào đăng ký với Số điện thoại này.' };
  }

  return { affiliate: affByPhone };
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
  commissionMode?: CommissionMode;
  commissionRate?: number;
  commissionFixed?: number;
  commissionTiers?: AffiliateTierCommissions;
  notes?: string;
}): Promise<AffiliateItem> {
  const cleanCode = data.code.trim().toLowerCase();
  const id = `aff_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  const mode: CommissionMode =
    data.commissionMode ||
    (data.commissionTiers ? 'tier' : data.commissionFixed && data.commissionFixed > 0 ? 'fixed' : 'percent');

  const newAff: AffiliateItem = {
    id,
    code: cleanCode,
    name: data.name.trim(),
    phone: data.phone?.trim() || undefined,
    email: data.email?.trim() || undefined,
    bankName: data.bankName?.trim() || undefined,
    bankCode: inferBankCode(data.bankName?.trim()),
    bankAccountNumber: data.bankAccountNumber?.trim() || undefined,
    bankAccountName: data.bankAccountName?.trim() || undefined,
    commissionMode: mode,
    commissionRate: data.commissionRate !== undefined ? Number(data.commissionRate) : 25,
    commissionFixed: data.commissionFixed !== undefined ? Number(data.commissionFixed) : undefined,
    commissionTiers:
      mode === 'tier'
        ? { ...DEFAULT_TIER_COMMISSIONS, ...(data.commissionTiers || {}) }
        : data.commissionTiers,
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
      bank_code: newAff.bankCode || null,
      bank_account_number: newAff.bankAccountNumber || null,
      bank_account_name: newAff.bankAccountName || null,
      commission_mode: newAff.commissionMode || 'percent',
      commission_rate: newAff.commissionRate,
      commission_fixed: newAff.commissionFixed || null,
      commission_tiers: newAff.commissionTiers || null,
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
    bankCode: data.bankCode || inferBankCode(data.bankName ?? aff.bankName),
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
        bank_code: updated.bankCode || null,
        bank_account_number: updated.bankAccountNumber || null,
        bank_account_name: updated.bankAccountName || null,
        commission_mode: updated.commissionMode || 'percent',
        commission_rate: updated.commissionRate,
        commission_fixed: updated.commissionFixed || null,
        commission_tiers: updated.commissionTiers || null,
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
  orderCode: string,
  paymentType?: string
): Promise<number> {
  const aff = await getAffiliateByCode(code);
  if (!aff) return 0;

  // Tính tiền hoa hồng theo cấu hình của CTV (% / Đồng giá / Theo từng gói)
  const commission = calculateAffiliateCommission(aff, orderAmount, paymentType);

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

    if (orderCode) {
      await supabase
        .from('tuvi_orders')
        .update({ commission_amount: commission })
        .eq('order_code', orderCode.trim().toUpperCase());
    }
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
  aff.pendingWithdrawal = Math.max(0, (aff.pendingWithdrawal || 0) - amount);

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
        pending_withdrawal: aff.pendingWithdrawal,
        notes: aff.notes || null,
        updated_at: aff.updatedAt,
      })
      .eq('id', aff.id);
  } catch (err) {
    console.warn('[AFFILIATE STORE] Lỗi payout Supabase:', err);
  }

  return aff;
}

/**
 * CTV tự cập nhật tài khoản ngân hàng từ trang /ctv (Chỉ cho phép khai báo lần đầu khi chưa có STK)
 */
export async function updateAffiliateBank(
  codeOrPhone: string,
  bankData: {
    bankCode?: string;
    bankName: string;
    bankAccountNumber: string;
    bankAccountName: string;
    phone?: string;
  }
): Promise<AffiliateItem | null> {
  let aff: AffiliateItem | null = null;
  if (bankData.phone) {
    const verified = await verifyAffiliateByPhone(bankData.phone, codeOrPhone);
    if (verified.error || !verified.affiliate) {
      throw new Error(verified.error || 'Xác thực Số điện thoại không hợp lệ');
    }
    aff = verified.affiliate;
  } else {
    aff = await getAffiliateByPhoneOrCode(codeOrPhone);
  }
  if (!aff) return null;

  // PHƯƠNG ÁN 2: Khóa cứng STK sau khi đã có (chỉ Admin mới sửa được trong /admin)
  if (aff.bankAccountNumber && aff.bankAccountNumber.trim().length > 0) {
    throw new Error(
      'Tài khoản ngân hàng của bạn đã được khóa cố định để bảo vệ an toàn hoa hồng. Nếu cần đổi sang ngân hàng khác, vui lòng nhắn Zalo báo Admin (Thầy Tôn) hỗ trợ cập nhật.'
    );
  }

  const bCode = bankData.bankCode || inferBankCode(bankData.bankName);

  aff.bankName = bankData.bankName.trim();
  aff.bankCode = bCode;
  aff.bankAccountNumber = bankData.bankAccountNumber.trim();
  aff.bankAccountName = bankData.bankAccountName.trim().toUpperCase();
  aff.updatedAt = new Date().toISOString();

  affiliatesMap.set(aff.code, aff);
  saveToFile();

  try {
    await supabase
      .from('tuvi_affiliates')
      .update({
        bank_name: aff.bankName,
        bank_code: aff.bankCode || null,
        bank_account_number: aff.bankAccountNumber,
        bank_account_name: aff.bankAccountName,
        updated_at: aff.updatedAt,
      })
      .eq('id', aff.id);
  } catch (err) {
    console.warn('[AFFILIATE STORE] Lỗi update bank Supabase:', err);
  }

  return aff;
}

/**
 * CTV gửi yêu cầu rút tiền từ trang /ctv
 */
export async function requestWithdrawal(
  codeOrPhone: string,
  amount: number,
  phone?: string
): Promise<{ success: boolean; message?: string; affiliate?: AffiliateItem }> {
  let aff: AffiliateItem | null = null;
  if (phone) {
    const verified = await verifyAffiliateByPhone(phone, codeOrPhone);
    if (verified.error || !verified.affiliate) {
      return { success: false, message: verified.error || 'Xác thực Số điện thoại không hợp lệ' };
    }
    aff = verified.affiliate;
  } else {
    aff = await getAffiliateByPhoneOrCode(codeOrPhone);
  }

  if (!aff) {
    return { success: false, message: 'Không tìm thấy thông tin CTV' };
  }

  if (!aff.bankAccountNumber || !aff.bankName) {
    return { success: false, message: 'Vui lòng cập nhật thông tin tài khoản ngân hàng trước khi rút tiền' };
  }

  const remaining = aff.totalCommission - aff.paidCommission;
  if (amount > remaining) {
    return { success: false, message: `Số dư hoa hồng khả dụng chỉ còn ${remaining.toLocaleString('vi-VN')}đ` };
  }

  if (amount <= 0) {
    return { success: false, message: 'Số tiền rút phải lớn hơn 0đ' };
  }

  aff.pendingWithdrawal = (aff.pendingWithdrawal || 0) + amount;
  aff.updatedAt = new Date().toISOString();
  affiliatesMap.set(aff.code, aff);
  saveToFile();

  try {
    await supabase
      .from('tuvi_affiliates')
      .update({
        pending_withdrawal: aff.pendingWithdrawal,
        updated_at: aff.updatedAt,
      })
      .eq('id', aff.id);
  } catch (err) {
    console.warn('[AFFILIATE STORE] Lỗi request withdrawal Supabase:', err);
  }

  return { success: true, affiliate: aff };
}


