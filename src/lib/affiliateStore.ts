import crypto from 'crypto';
import { adminSupabase as supabase } from './supabaseAdmin';
import {
  AffiliateItem,
  AffiliateTierCommissions,
  CommissionMode,
  DEFAULT_TIER_COMMISSIONS,
  VIETNAMESE_BANKS,
  calculateAffiliateCommission,
  inferBankCode,
} from '@/types/affiliate';

export type { AffiliateItem };
export { inferBankCode, calculateAffiliateCommission };

const MAX_AFFILIATE_COMMISSION_RATIO = 0.5;
const VALID_BANK_CODES = new Set<string>(VIETNAMESE_BANKS.map((b) => b.code.toUpperCase()));
const BANK_ACC_NUM_RE = /^[A-Za-z0-9]{4,30}$/;

export function maskBankAccount(acc?: string | null): string | undefined {
  const clean = String(acc || '').trim();
  if (!clean) return undefined;
  if (clean.length <= 4) return clean;
  return `${'*'.repeat(Math.max(4, clean.length - 4))}${clean.slice(-4)}`;
}

function rowToAffiliateItem(row: Record<string, unknown>): AffiliateItem {
  const bName = typeof row.bank_name === 'string' && row.bank_name ? row.bank_name : undefined;
  const bCode = (typeof row.bank_code === 'string' && row.bank_code) || inferBankCode(bName);
  const fixedVal = row.commission_fixed ? Number(row.commission_fixed) : undefined;
  const tiersVal: AffiliateTierCommissions | undefined =
    row.commission_tiers && typeof row.commission_tiers === 'object'
      ? { ...DEFAULT_TIER_COMMISSIONS, ...(row.commission_tiers as Partial<AffiliateTierCommissions>) }
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
    id: String(row.id || ''),
    code: String(row.code || '').toLowerCase().trim(),
    name: String(row.name || 'Cộng Tác Viên'),
    phone: typeof row.phone === 'string' && row.phone ? row.phone : undefined,
    email: typeof row.email === 'string' && row.email ? row.email : undefined,
    bankName: bName,
    bankCode: bCode,
    bankAccountNumber:
      typeof row.bank_account_number === 'string' && row.bank_account_number
        ? row.bank_account_number
        : undefined,
    bankAccountName:
      typeof row.bank_account_name === 'string' && row.bank_account_name
        ? row.bank_account_name
        : undefined,
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
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || row.created_at || new Date().toISOString()),
    notes: typeof row.notes === 'string' && row.notes ? row.notes : undefined,
  };
}

export async function getAllAffiliates(): Promise<AffiliateItem[]> {
  const { data, error } = await supabase
    .from('tuvi_affiliates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Lỗi truy vấn danh sách CTV: ${error.message}`);
  }
  return ((data as Array<Record<string, unknown>>) || []).map(rowToAffiliateItem);
}

export async function getAffiliateByCode(code: string): Promise<AffiliateItem | null> {
  const cleanCode = code.trim().toLowerCase();
  if (!cleanCode) return null;

  const { data, error } = await supabase
    .from('tuvi_affiliates')
    .select('*')
    .eq('code', cleanCode)
    .maybeSingle();

  if (error || !data) return null;
  return rowToAffiliateItem(data as Record<string, unknown>);
}

export async function getAffiliateById(id: string): Promise<AffiliateItem | null> {
  const cleanId = id.trim();
  if (!cleanId) return null;
  const { data, error } = await supabase
    .from('tuvi_affiliates')
    .select('*')
    .eq('id', cleanId)
    .maybeSingle();
  if (error || !data) return null;
  return rowToAffiliateItem(data as Record<string, unknown>);
}

/**
 * Xác thực bảo mật CTV bằng Số điện thoại đăng ký (thông báo lỗi đồng nhất chống dò mã/SĐT)
 */
export async function verifyAffiliateByPhone(
  phoneInput: string,
  codeInput?: string
): Promise<{ affiliate?: AffiliateItem; error?: string }> {
  const phoneDigits = (phoneInput || '').replace(/\D/g, '').replace(/^84(?=\d{9}$)/, '0');
  if (phoneDigits.length < 9) {
    return {
      error: 'Vui lòng nhập Số điện thoại đã đăng ký của Cộng tác viên để tra cứu bảo mật.',
    };
  }

  const all = await getAllAffiliates();
  const cleanCode = (codeInput || '').trim().toLowerCase();
  const normalizeStored = (p?: string) =>
    (p || '').replace(/\D/g, '').replace(/^84(?=\d{9}$)/, '0');

  if (cleanCode) {
    const affByCode = all.find((a) => a.code.toLowerCase() === cleanCode);
    if (!affByCode || normalizeStored(affByCode.phone) !== phoneDigits) {
      return {
        error: 'Thông tin Mã CTV hoặc Số điện thoại không chính xác. Vui lòng kiểm tra lại.',
      };
    }
    return { affiliate: affByCode };
  }

  const affByPhone = all.find((a) => normalizeStored(a.phone) === phoneDigits);
  if (!affByPhone) {
    return { error: 'Thông tin Số điện thoại chưa được đăng ký tài khoản Cộng tác viên.' };
  }

  return { affiliate: affByPhone };
}

export async function createAffiliate(data: {
  code: string;
  name: string;
  phone?: string;
  email?: string;
  bankName?: string;
  bankCode?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  commissionMode?: CommissionMode;
  commissionRate?: number;
  commissionFixed?: number;
  commissionTiers?: AffiliateTierCommissions;
  notes?: string;
}): Promise<AffiliateItem> {
  const cleanCode = data.code
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '');

  if (!cleanCode) {
    throw new Error('Mã giới thiệu không hợp lệ (chỉ gồm chữ cái, số, dấu gạch dưới hoặc gạch ngang)');
  }

  const existing = await getAffiliateByCode(cleanCode);
  if (existing) {
    throw new Error(`Mã giới thiệu "${cleanCode}" đã tồn tại`);
  }

  const now = new Date().toISOString();
  const id = `aff_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const bCode = data.bankCode || inferBankCode(data.bankName);
  const mode: CommissionMode = data.commissionMode || 'tier';

  const row = {
    id,
    code: cleanCode,
    name: data.name.trim(),
    phone: data.phone?.trim() || null,
    email: data.email?.trim().toLowerCase() || null,
    bank_name: data.bankName?.trim() || null,
    bank_code: bCode || null,
    bank_account_number: data.bankAccountNumber?.trim() || null,
    bank_account_name: data.bankAccountName?.trim().toUpperCase() || null,
    commission_mode: mode,
    commission_rate: data.commissionRate ?? 25,
    commission_fixed: mode === 'fixed' && data.commissionFixed ? Number(data.commissionFixed) : null,
    commission_tiers:
      mode === 'tier'
        ? data.commissionTiers
          ? { ...DEFAULT_TIER_COMMISSIONS, ...data.commissionTiers }
          : { ...DEFAULT_TIER_COMMISSIONS }
        : null,
    status: 'ACTIVE',
    total_clicks: 0,
    total_orders: 0,
    total_revenue: 0,
    total_commission: 0,
    paid_commission: 0,
    pending_withdrawal: 0,
    created_at: now,
    updated_at: now,
    notes: data.notes?.trim() || null,
  };

  const { data: inserted, error } = await supabase
    .from('tuvi_affiliates')
    .insert(row)
    .select('*')
    .single();

  if (error || !inserted) {
    throw new Error(`Không thể tạo CTV trên Supabase: ${error?.message || 'Unknown error'}`);
  }

  return rowToAffiliateItem(inserted as Record<string, unknown>);
}

export async function updateAffiliate(
  id: string,
  data: Partial<AffiliateItem>
): Promise<AffiliateItem | null> {
  const existing = await getAffiliateById(id);
  if (!existing) return null;

  const nextMode = data.commissionMode ?? existing.commissionMode;
  const nextBankName = data.bankName !== undefined ? data.bankName?.trim() || null : existing.bankName || null;
  const nextBankCode =
    data.bankCode !== undefined
      ? data.bankCode || inferBankCode(nextBankName || undefined) || null
      : existing.bankCode || inferBankCode(nextBankName || undefined) || null;

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (data.name !== undefined) updatePayload.name = data.name.trim();
  if (data.phone !== undefined) updatePayload.phone = data.phone?.trim() || null;
  if (data.email !== undefined) updatePayload.email = data.email?.trim().toLowerCase() || null;
  if (data.bankName !== undefined) updatePayload.bank_name = nextBankName;
  if (data.bankCode !== undefined || data.bankName !== undefined) updatePayload.bank_code = nextBankCode;
  if (data.bankAccountNumber !== undefined)
    updatePayload.bank_account_number = data.bankAccountNumber?.trim() || null;
  if (data.bankAccountName !== undefined)
    updatePayload.bank_account_name = data.bankAccountName?.trim().toUpperCase() || null;
  if (data.status !== undefined) updatePayload.status = data.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
  if (data.notes !== undefined) updatePayload.notes = data.notes || null;

  if (data.commissionMode !== undefined) {
    updatePayload.commission_mode = nextMode;
    if (nextMode === 'percent') {
      updatePayload.commission_fixed = null;
      updatePayload.commission_tiers = null;
    } else if (nextMode === 'fixed') {
      updatePayload.commission_tiers = null;
    } else if (nextMode === 'tier') {
      updatePayload.commission_fixed = null;
    }
  }
  if (data.commissionRate !== undefined) updatePayload.commission_rate = Number(data.commissionRate);
  if (data.commissionFixed !== undefined) {
    updatePayload.commission_fixed =
      data.commissionFixed === null ? null : Number(data.commissionFixed);
  }
  if (data.commissionTiers !== undefined) {
    updatePayload.commission_tiers =
      data.commissionTiers === null
        ? null
        : { ...DEFAULT_TIER_COMMISSIONS, ...data.commissionTiers };
  }

  const { data: updated, error } = await supabase
    .from('tuvi_affiliates')
    .update(updatePayload)
    .eq('id', existing.id)
    .select('*')
    .single();

  if (error || !updated) {
    throw new Error(`Lỗi cập nhật CTV: ${error?.message || 'Unknown error'}`);
  }

  return rowToAffiliateItem(updated as Record<string, unknown>);
}

export async function deleteAffiliate(id: string): Promise<boolean> {
  const { error } = await supabase.from('tuvi_affiliates').delete().eq('id', id);
  if (error) {
    throw new Error(`Lỗi xóa CTV: ${error.message}`);
  }
  return true;
}

export async function recordAffiliateClick(code: string): Promise<void> {
  const cleanCode = code.trim().toLowerCase();
  if (!cleanCode) return;

  const { error: rpcErr } = await supabase.rpc('tuvi_increment_affiliate_click', {
    p_code: cleanCode,
  });

  if (rpcErr) {
    // Fallback nếu migration chưa được chạy
    const aff = await getAffiliateByCode(cleanCode);
    if (!aff || aff.status !== 'ACTIVE') return;
    await supabase
      .from('tuvi_affiliates')
      .update({
        total_clicks: (aff.totalClicks || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', aff.id);
  }
}

/**
 * Ghi nhận hoa hồng nguyên tử khi đơn hàng thanh toán thành công:
 * - Bắt buộc CTV đang ACTIVE
 * - Chặn self-referral theo email
 * - Trần hoa hồng tối đa <= 50% doanh thu thực thu
 */
export async function recordAffiliateCommission(
  code: string,
  orderAmount: number,
  orderCode: string,
  paymentType?: string,
  buyerEmail?: string
): Promise<number> {
  const aff = await getAffiliateByCode(code);
  if (!aff || aff.status !== 'ACTIVE' || orderAmount <= 0) return 0;

  if (
    buyerEmail &&
    aff.email &&
    buyerEmail.trim().toLowerCase() === aff.email.trim().toLowerCase()
  ) {
    console.warn(`[AFFILIATE STORE] Chặn self-referral cho CTV ${aff.code} (đơn ${orderCode})`);
    return 0;
  }

  const rawComm = calculateAffiliateCommission(aff, orderAmount, paymentType);
  const commission = Math.min(rawComm, Math.floor(orderAmount * MAX_AFFILIATE_COMMISSION_RATIO));
  if (commission <= 0) return 0;

  const { data: rpcOk, error: rpcErr } = await supabase.rpc('tuvi_credit_affiliate_commission', {
    p_code: aff.code,
    p_order_amount: orderAmount,
    p_commission: commission,
  });

  if (rpcErr) {
    const { error: updErr } = await supabase
      .from('tuvi_affiliates')
      .update({
        total_orders: (aff.totalOrders || 0) + 1,
        total_revenue: (aff.totalRevenue || 0) + orderAmount,
        total_commission: (aff.totalCommission || 0) + commission,
        updated_at: new Date().toISOString(),
      })
      .eq('id', aff.id)
      .eq('status', 'ACTIVE');
    if (updErr) {
      throw new Error(`Lỗi cộng hoa hồng CTV: ${updErr.message}`);
    }
  } else if (!rpcOk) {
    return 0;
  }

  if (orderCode) {
    await supabase
      .from('tuvi_orders')
      .update({ commission_amount: commission })
      .eq('order_code', orderCode.trim().toUpperCase());
  }

  return commission;
}

/**
 * Hoàn trừ hoa hồng CTV nguyên tử khi Admin hủy một đơn đã PAID
 */
export async function reverseAffiliateCommission(
  code: string,
  orderAmount: number,
  commissionAmount: number
): Promise<void> {
  const cleanCode = code.trim().toLowerCase();
  if (!cleanCode || commissionAmount <= 0) return;

  const { error: rpcErr } = await supabase.rpc('tuvi_reverse_affiliate_commission', {
    p_code: cleanCode,
    p_order_amount: orderAmount,
    p_commission: commissionAmount,
  });

  if (rpcErr) {
    const aff = await getAffiliateByCode(cleanCode);
    if (!aff) return;
    await supabase
      .from('tuvi_affiliates')
      .update({
        total_orders: Math.max(0, (aff.totalOrders || 0) - 1),
        total_revenue: Math.max(0, (aff.totalRevenue || 0) - orderAmount),
        total_commission: Math.max(0, (aff.totalCommission || 0) - commissionAmount),
        updated_at: new Date().toISOString(),
      })
      .eq('id', aff.id);
  }
}

/**
 * Quyết toán chi trả hoa hồng nguyên tử qua bảng `tuvi_affiliate_payouts` (chống trừ đúp giữa Webhook, Email & Admin UI)
 */
export async function settleAffiliatePayout(params: {
  affiliateId: string;
  amount: number;
  reqId?: string;
  bankTxId?: string;
  note?: string;
}): Promise<{
  ok: boolean;
  alreadyProcessed?: boolean;
  affiliate?: AffiliateItem | null;
  error?: string;
}> {
  const { affiliateId, amount, reqId, bankTxId, note } = params;
  if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) {
    return { ok: false, error: 'Số tiền chi trả phải là số nguyên dương.' };
  }

  const { data: rpcData, error: rpcErr } = await supabase.rpc('tuvi_settle_affiliate_payout', {
    p_affiliate_id: affiliateId,
    p_amount: amount,
    p_req_id: reqId || null,
    p_bank_tx_id: bankTxId || null,
    p_note: note || null,
  });

  if (!rpcErr && rpcData && typeof rpcData === 'object') {
    const resObj = rpcData as { ok?: boolean; already_processed?: boolean; error?: string };
    const refreshed = await getAffiliateById(affiliateId);
    return {
      ok: Boolean(resObj.ok),
      alreadyProcessed: Boolean(resObj.already_processed),
      affiliate: refreshed,
      error: resObj.error,
    };
  }

  // Fallback nếu migration RPC chưa chạy trên DB
  if (rpcErr && !/does not exist|function .* not found/i.test(rpcErr.message)) {
    return { ok: false, error: rpcErr.message };
  }

  const aff = await getAffiliateById(affiliateId);
  if (!aff) return { ok: false, error: 'Không tìm thấy CTV.' };

  const dedupeMarker = reqId ? `req#${reqId}` : bankTxId ? `tx#${bankTxId}` : null;
  if (dedupeMarker && aff.notes && aff.notes.includes(dedupeMarker)) {
    return { ok: true, alreadyProcessed: true, affiliate: aff };
  }

  const remaining = (aff.totalCommission || 0) - (aff.paidCommission || 0);
  if (amount > remaining) {
    return {
      ok: false,
      error: `Số tiền chi trả (${amount.toLocaleString('vi-VN')}đ) vượt quá số dư chưa chi trả (${remaining.toLocaleString('vi-VN')}đ).`,
    };
  }

  const timeStr = new Date().toLocaleDateString('vi-VN');
  const noteLine = `[${timeStr}] Đã thanh toán: ${amount.toLocaleString('vi-VN')}đ${
    note ? ` (${note})` : ''
  }${dedupeMarker ? ` [${dedupeMarker}]` : ''}`;

  const { data: updated, error: updErr } = await supabase
    .from('tuvi_affiliates')
    .update({
      paid_commission: (aff.paidCommission || 0) + amount,
      pending_withdrawal: Math.max(0, (aff.pendingWithdrawal || 0) - amount),
      notes: aff.notes ? `${aff.notes}\n${noteLine}` : noteLine,
      updated_at: new Date().toISOString(),
    })
    .eq('id', aff.id)
    .select('*')
    .single();

  if (updErr || !updated) {
    return { ok: false, error: updErr?.message || 'Lỗi cập nhật chi trả hoa hồng' };
  }

  return {
    ok: true,
    alreadyProcessed: false,
    affiliate: rowToAffiliateItem(updated as Record<string, unknown>),
  };
}

export async function payoutAffiliate(
  id: string,
  amount: number,
  note?: string
): Promise<AffiliateItem | null> {
  const res = await settleAffiliatePayout({
    affiliateId: id,
    amount: Math.round(amount),
    note,
  });
  if (!res.ok) {
    throw new Error(res.error || 'Không thể quyết toán hoa hồng');
  }
  return res.affiliate || null;
}

/**
 * CTV tự cập nhật tài khoản ngân hàng lần đầu (validate nghiêm ngặt mã ngân hàng & STK chống HTML injection)
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
  if (!bankData.phone || !bankData.phone.trim()) {
    throw new Error('Vui lòng cung cấp Số điện thoại đã đăng ký để xác thực tài khoản CTV.');
  }
  const verified = await verifyAffiliateByPhone(bankData.phone, codeOrPhone);
  if (verified.error || !verified.affiliate) {
    throw new Error(verified.error || 'Xác thực Số điện thoại không hợp lệ');
  }
  const aff = verified.affiliate;

  if (aff.bankAccountNumber && aff.bankAccountNumber.trim().length > 0) {
    throw new Error(
      'Tài khoản ngân hàng của bạn đã được khóa cố định để bảo vệ an toàn hoa hồng. Nếu cần đổi sang ngân hàng khác, vui lòng nhắn Zalo báo Admin (Thầy Tôn) hỗ trợ cập nhật.'
    );
  }

  const cleanAccNum = bankData.bankAccountNumber.trim().replace(/\s+/g, '');
  if (!BANK_ACC_NUM_RE.test(cleanAccNum)) {
    throw new Error('Số tài khoản ngân hàng chỉ được chứa chữ cái và số (4 đến 30 ký tự).');
  }

  const resolvedCode = (bankData.bankCode || inferBankCode(bankData.bankName) || '').trim().toUpperCase();
  if (!resolvedCode || !VALID_BANK_CODES.has(resolvedCode)) {
    throw new Error('Mã ngân hàng không nằm trong danh sách ngân hàng hỗ trợ VietQR.');
  }

  const cleanBankName = bankData.bankName.trim().slice(0, 120);
  const cleanAccName = bankData.bankAccountName.trim().toUpperCase().slice(0, 100);

  const { data: updated, error } = await supabase
    .from('tuvi_affiliates')
    .update({
      bank_name: cleanBankName,
      bank_code: resolvedCode,
      bank_account_number: cleanAccNum,
      bank_account_name: cleanAccName,
      updated_at: new Date().toISOString(),
    })
    .eq('id', aff.id)
    .is('bank_account_number', null)
    .select('*')
    .maybeSingle();

  if (error) {
    throw new Error(`Không thể lưu thông tin ngân hàng: ${error.message}`);
  }
  if (!updated) {
    // Dự phòng nếu cột hiện tại là chuỗi rỗng ''
    const { data: retryUpd, error: retryErr } = await supabase
      .from('tuvi_affiliates')
      .update({
        bank_name: cleanBankName,
        bank_code: resolvedCode,
        bank_account_number: cleanAccNum,
        bank_account_name: cleanAccName,
        updated_at: new Date().toISOString(),
      })
      .eq('id', aff.id)
      .eq('bank_account_number', '')
      .select('*')
      .maybeSingle();

    if (retryErr || !retryUpd) {
      throw new Error('Tài khoản ngân hàng đã được cấu hình trước đó.');
    }
    return rowToAffiliateItem(retryUpd as Record<string, unknown>);
  }

  return rowToAffiliateItem(updated as Record<string, unknown>);
}

/**
 * CTV gửi yêu cầu rút tiền nguyên tử (RPC SELECT ... FOR UPDATE chống double-withdrawal race condition!)
 */
export async function requestWithdrawal(
  codeOrPhone: string,
  amount: number,
  phone?: string
): Promise<{ success: boolean; message?: string; affiliate?: AffiliateItem; reqId?: string }> {
  if (!phone || !phone.trim()) {
    return {
      success: false,
      message: 'Vui lòng cung cấp Số điện thoại đã đăng ký để xác thực yêu cầu rút tiền.',
    };
  }
  if (!Number.isFinite(amount) || !Number.isInteger(amount) || amount < 50000) {
    return {
      success: false,
      message: 'Số tiền rút tối thiểu là 50.000đ và phải là số nguyên.',
    };
  }

  const verified = await verifyAffiliateByPhone(phone, codeOrPhone);
  if (verified.error || !verified.affiliate) {
    return { success: false, message: verified.error || 'Xác thực Số điện thoại không hợp lệ' };
  }
  const aff = verified.affiliate;

  if (aff.status !== 'ACTIVE') {
    return { success: false, message: 'Tài khoản CTV hiện đang tạm ngưng.' };
  }
  if (!aff.bankAccountNumber || !aff.bankName) {
    return { success: false, message: 'Vui lòng cập nhật thông tin tài khoản ngân hàng trước khi rút tiền.' };
  }

  const reqId = `WD_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const bankSnapshot = {
    bankCode: aff.bankCode || inferBankCode(aff.bankName) || '',
    bankName: aff.bankName,
    bankAccountNumber: aff.bankAccountNumber,
    bankAccountName: aff.bankAccountName || '',
  };

  const { data: rpcRes, error: rpcErr } = await supabase.rpc('tuvi_request_affiliate_withdrawal', {
    p_affiliate_id: aff.id,
    p_amount: amount,
    p_req_id: reqId,
    p_bank_snapshot: bankSnapshot,
  });

  if (!rpcErr && rpcRes && typeof rpcRes === 'object') {
    const obj = rpcRes as { ok?: boolean; error?: string };
    if (!obj.ok) {
      return { success: false, message: obj.error || 'Không thể gửi yêu cầu rút tiền.' };
    }
    const refreshed = await getAffiliateById(aff.id);
    return { success: true, affiliate: refreshed || aff, reqId };
  }

  // Fallback nếu migration chưa được chạy
  const available = Math.max(0, aff.totalCommission - aff.paidCommission - (aff.pendingWithdrawal || 0));
  if (amount > available) {
    return {
      success: false,
      message: `Số dư hoa hồng khả dụng (đã trừ khoản đang chờ duyệt) chỉ còn ${available.toLocaleString('vi-VN')}đ`,
    };
  }

  const { data: updated, error: updErr } = await supabase
    .from('tuvi_affiliates')
    .update({
      pending_withdrawal: (aff.pendingWithdrawal || 0) + amount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', aff.id)
    .eq('pending_withdrawal', aff.pendingWithdrawal || 0)
    .select('*')
    .maybeSingle();

  if (updErr || !updated) {
    return {
      success: false,
      message: 'Yêu cầu rút tiền khác đang được xử lý đồng thời, vui lòng tải lại số dư.',
    };
  }

  return {
    success: true,
    affiliate: rowToAffiliateItem(updated as Record<string, unknown>),
    reqId,
  };
}
