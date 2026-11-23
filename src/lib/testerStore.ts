import crypto from 'crypto';
import { adminSupabase as supabase } from './supabaseAdmin';
import { TesterAccount } from '@/types/tester';

function rowToTesterAccount(row: Record<string, unknown>): TesterAccount {
  return {
    id: String(row.id || ''),
    userId: typeof row.user_id === 'string' && row.user_id ? row.user_id : undefined,
    email: String(row.email || '').toLowerCase().trim(),
    fullName: String(row.full_name || 'Tester'),
    // Không trả lộ mật khẩu plaintext cũ ra giao diện Admin
    passwordPlain: '',
    maxCharts: Number(row.max_charts ?? 3),
    maxQuestionsPerChart: Number(row.max_questions_per_chart ?? 5),
    isActive: row.is_active !== false,
    notes: typeof row.notes === 'string' && row.notes ? row.notes : undefined,
    createdAt: String(row.created_at || new Date().toISOString()),
    updatedAt: String(row.updated_at || row.created_at || new Date().toISOString()),
  };
}

/**
 * Tìm userId hiện có trong auth.users theo email (không phân biệt hoa thường),
 * đồng thời kiểm tra chặt cách ly Multi-Tenant: từ chối nếu user thuộc bảng public.profiles (TonyEnglish).
 */
async function findExistingTuViAuthUserByEmail(
  cleanEmail: string
): Promise<{ userId?: string; isTonyEnglishConflict?: boolean }> {
  const { data: tuviProf } = await supabase
    .from('tuvi_profiles')
    .select('id')
    .eq('email', cleanEmail)
    .maybeSingle();

  if (tuviProf?.id) {
    return { userId: String(tuviProf.id) };
  }

  // Kiểm tra trong bảng public.profiles (TonyEnglish) để tuyệt đối không làm ô nhiễm chéo!
  const { data: tonyProf } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', cleanEmail)
    .maybeSingle();

  if (tonyProf?.id) {
    return { isTonyEnglishConflict: true };
  }

  return {};
}

/**
 * Lấy danh sách toàn bộ Tester trực tiếp từ Supabase kèm thống kê chính xác theo từng testerUserId
 * (KHÔNG kéo toàn bộ tuvi_charts/tuvi_chat_messages bị cắt ở 1.000 dòng!)
 */
export async function getAllTesters(): Promise<TesterAccount[]> {
  const { data, error } = await supabase
    .from('tuvi_testers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Lỗi truy vấn danh sách Tester: ${error.message}`);
  }

  const list = ((data as Array<Record<string, unknown>>) || []).map(rowToTesterAccount);
  const testerUserIds = list.map((t) => t.userId).filter((uid): uid is string => Boolean(uid));

  if (testerUserIds.length > 0) {
    try {
      const [{ data: charts }, { data: messages }] = await Promise.all([
        supabase.from('tuvi_charts').select('id, user_id').in('user_id', testerUserIds),
        supabase.from('tuvi_chat_messages').select('id, user_id').in('user_id', testerUserIds),
      ]);

      const chartCounts = new Map<string, number>();
      for (const c of charts || []) {
        if (c.user_id) chartCounts.set(c.user_id, (chartCounts.get(c.user_id) || 0) + 1);
      }
      const msgCounts = new Map<string, number>();
      for (const m of messages || []) {
        if (m.user_id) msgCounts.set(m.user_id, (msgCounts.get(m.user_id) || 0) + 1);
      }

      for (const t of list) {
        t.chartsUsed = t.userId ? chartCounts.get(t.userId) || 0 : 0;
        t.questionsUsed = t.userId ? msgCounts.get(t.userId) || 0 : 0;
      }
    } catch {
      // ignore stats errors
    }
  }

  return list;
}

/**
 * Tìm kiếm Tester trực tiếp trên Supabase (luôn nhất quán giữa mọi serverless container sau khi thu hồi quyền!)
 */
export async function getTesterByEmail(email: string): Promise<TesterAccount | null> {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail) return null;

  const { data, error } = await supabase
    .from('tuvi_testers')
    .select('*')
    .eq('email', cleanEmail)
    .maybeSingle();

  if (error || !data) return null;
  return rowToTesterAccount(data as Record<string, unknown>);
}

/**
 * Tạo mới tài khoản Tester bằng Admin Auth API (gắn options.data.app = 'tuvi',
 * cách ly tuyệt đối khỏi học viên TonyEnglish, không lưu mật khẩu plaintext vào DB).
 */
export async function createTester(params: {
  email: string;
  password: string;
  fullName: string;
  maxCharts: number;
  maxQuestionsPerChart: number;
  notes?: string;
}): Promise<{ success: boolean; tester?: TesterAccount; error?: string }> {
  const cleanEmail = params.email.toLowerCase().trim();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Địa chỉ email không hợp lệ.' };
  }
  if (!params.password || params.password.length < 8) {
    return { success: false, error: 'Mật khẩu cần tối thiểu 8 ký tự.' };
  }

  // Kiểm tra cách ly Multi-Tenant trước khi tạo tài khoản
  const existingCheck = await findExistingTuViAuthUserByEmail(cleanEmail);
  if (existingCheck.isTonyEnglishConflict) {
    return {
      success: false,
      error:
        'Email này thuộc tài khoản học viên TonyEnglish. Theo quy tắc cách ly hệ thống, vui lòng dùng một email khác cho Tester Tử Vi.',
    };
  }

  let userId: string | undefined = existingCheck.userId;

  if (!userId) {
    const { data: createdAuth, error: createErr } = await supabase.auth.admin.createUser({
      email: cleanEmail,
      password: params.password,
      email_confirm: true,
      user_metadata: {
        full_name: params.fullName.trim() || 'Tester',
        app: 'tuvi',
        role: 'tester',
        max_charts: Number(params.maxCharts) || 3,
        max_questions_per_chart: Number(params.maxQuestionsPerChart) || 5,
      },
    });

    if (createErr) {
      if (!/already been registered|already exists/i.test(createErr.message || '')) {
        return { success: false, error: `Lỗi tạo tài khoản Auth: ${createErr.message}` };
      }
      // Thử tìm lại userId đã tồn tại trong tuvi_profiles
      const recheck = await findExistingTuViAuthUserByEmail(cleanEmail);
      if (recheck.isTonyEnglishConflict) {
        return {
          success: false,
          error: 'Email này đã thuộc hệ thống TonyEnglish, không thể gắn làm Tester Tử Vi.',
        };
      }
      userId = recheck.userId;
    } else if (createdAuth?.user?.id) {
      userId = createdAuth.user.id;
    }
  } else {
    // Đồng bộ mật khẩu cho tài khoản Tử Vi đã có nếu Admin cấp mới
    await supabase.auth.admin.updateUserById(userId, {
      password: params.password,
      user_metadata: {
        full_name: params.fullName.trim() || 'Tester',
        app: 'tuvi',
        role: 'tester',
      },
    });
  }

  const now = new Date().toISOString();
  const maxCharts = Math.max(1, Number(params.maxCharts) || 3);
  const maxQuestionsPerChart = Math.max(1, Number(params.maxQuestionsPerChart) || 5);
  const fullName = params.fullName.trim() || 'Tester';

  const { data: inserted, error: dbError } = await supabase
    .from('tuvi_testers')
    .upsert(
      {
        user_id: userId || null,
        email: cleanEmail,
        full_name: fullName,
        // Không lưu plaintext password vào DB (chỉ trả 1 lần về UI lúc vừa tạo!)
        password_plain: '',
        max_charts: maxCharts,
        max_questions_per_chart: maxQuestionsPerChart,
        is_active: true,
        notes: params.notes?.trim() || null,
        updated_at: now,
      },
      { onConflict: 'email' }
    )
    .select('*')
    .single();

  if (dbError || !inserted) {
    return {
      success: false,
      error: `Không thể lưu Tester vào Supabase: ${dbError?.message || 'Unknown error'}`,
    };
  }

  if (userId) {
    await supabase.from('tuvi_profiles').upsert({
      id: userId,
      email: cleanEmail,
      full_name: fullName,
      role: 'tester',
      max_charts: maxCharts,
      max_questions_per_chart: maxQuestionsPerChart,
      updated_at: now,
    });
  }

  const tester = rowToTesterAccount(inserted as Record<string, unknown>);
  // Trả password 1 lần duy nhất cho Admin sao chép ngay lúc vừa tạo
  tester.passwordPlain = params.password;
  return { success: true, tester };
}

/**
 * Cập nhật cấu hình hạn mức / trạng thái / mật khẩu Tester trực tiếp trên Supabase
 */
export async function updateTester(
  id: string,
  params: Partial<TesterAccount>
): Promise<{ success: boolean; tester?: TesterAccount; error?: string }> {
  const { data: existingRow, error: findErr } = await supabase
    .from('tuvi_testers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (findErr || !existingRow) {
    return { success: false, error: 'Không tìm thấy tài khoản tester để cập nhật.' };
  }

  const existing = rowToTesterAccount(existingRow as Record<string, unknown>);
  const now = new Date().toISOString();

  const nextFullName = params.fullName !== undefined ? params.fullName.trim() : existing.fullName;
  const nextMaxCharts = params.maxCharts !== undefined ? Number(params.maxCharts) : existing.maxCharts;
  const nextMaxQ =
    params.maxQuestionsPerChart !== undefined
      ? Number(params.maxQuestionsPerChart)
      : existing.maxQuestionsPerChart;
  const nextNotes = params.notes !== undefined ? params.notes : existing.notes;
  const nextActive = params.isActive !== undefined ? params.isActive : existing.isActive;

  // Nếu Admin đặt mật khẩu mới -> đồng bộ thật vào Supabase Auth (không chỉ ghi text DB!)
  if (params.passwordPlain && params.passwordPlain.trim().length >= 6 && existing.userId) {
    const { error: pwErr } = await supabase.auth.admin.updateUserById(existing.userId, {
      password: params.passwordPlain.trim(),
    });
    if (pwErr) {
      return { success: false, error: `Lỗi cập nhật mật khẩu Auth: ${pwErr.message}` };
    }
  }

  const { data: updated, error: updErr } = await supabase
    .from('tuvi_testers')
    .update({
      full_name: nextFullName,
      password_plain: '',
      max_charts: nextMaxCharts,
      max_questions_per_chart: nextMaxQ,
      is_active: nextActive,
      notes: nextNotes || null,
      updated_at: now,
    })
    .eq('id', existing.id)
    .select('*')
    .single();

  if (updErr || !updated) {
    return { success: false, error: updErr?.message || 'Lỗi cập nhật tester' };
  }

  if (existing.userId) {
    await supabase
      .from('tuvi_profiles')
      .update({
        full_name: nextFullName,
        role: nextActive ? 'tester' : 'user',
        max_charts: nextMaxCharts,
        max_questions_per_chart: nextMaxQ,
        updated_at: now,
      })
      .eq('id', existing.userId);
  }

  return { success: true, tester: rowToTesterAccount(updated as Record<string, unknown>) };
}

/**
 * Xóa tài khoản Tester trực tiếp trên Supabase (hoạt động tin cậy trên mọi cold serverless instance)
 */
export async function deleteTester(id: string): Promise<{ success: boolean; error?: string }> {
  const { data: existingRow } = await supabase
    .from('tuvi_testers')
    .select('id, user_id')
    .eq('id', id)
    .maybeSingle();

  if (!existingRow) {
    return { success: false, error: 'Không tìm thấy tài khoản để xóa.' };
  }

  const { error: delErr } = await supabase.from('tuvi_testers').delete().eq('id', id);
  if (delErr) {
    return { success: false, error: delErr.message };
  }

  if (existingRow.user_id) {
    await supabase
      .from('tuvi_profiles')
      .update({ role: 'user', updated_at: new Date().toISOString() })
      .eq('id', existingRow.user_id);
  }

  return { success: true };
}

/**
 * Bật / tắt trạng thái kích hoạt Tester
 */
export async function toggleTesterActive(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  const res = await updateTester(id, { isActive });
  return { success: res.success, error: res.error };
}

export function generateSecureTesterPassword(): string {
  return crypto.randomBytes(9).toString('base64url');
}
