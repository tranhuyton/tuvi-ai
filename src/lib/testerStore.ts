import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { TesterAccount } from '@/types/tester';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubkvzgwespfvrlpjuxkp.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVia3Z6Z3dlc3BmdnJscGp1eGtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTYzNTEsImV4cCI6MjA5MjY5MjM1MX0.ZEgXs3LfI9diL9aji56N9HIxPOl0e1sMeRxbMfSM2qw';

// Tạo Supabase Auth client độc lập (stateless, không lưu token vào cookie/localStorage)
const authClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Cache bộ nhớ trong Node runtime
declare global {
  var __tuviTestersCache: Map<string, TesterAccount> | undefined;
}

const testersMap: Map<string, TesterAccount> =
  globalThis.__tuviTestersCache || new Map<string, TesterAccount>();
globalThis.__tuviTestersCache = testersMap;

function getDataFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'testers.json');
  }
  const localDir = path.join(process.cwd(), '.data');
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, 'testers.json');
  } catch {
    return path.join('/tmp', 'testers.json');
  }
}

function loadFromFile() {
  try {
    const dataFile = getDataFilePath();
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      const list: TesterAccount[] = JSON.parse(content);
      if (Array.isArray(list)) {
        for (const item of list) {
          testersMap.set(item.email.toLowerCase().trim(), item);
        }
      }
    }
  } catch (err) {
    console.warn('[TESTER STORE] Lỗi nạp cache từ file:', err);
  }
}

function saveToFile() {
  try {
    const dataFile = getDataFilePath();
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const list = Array.from(testersMap.values());
    fs.writeFileSync(dataFile, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[TESTER STORE] Lỗi ghi cache ra file:', err);
  }
}

loadFromFile();

function rowToTesterAccount(row: any): TesterAccount {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    email: String(row.email || '').toLowerCase().trim(),
    fullName: row.full_name || 'Tester',
    passwordPlain: row.password_plain || '',
    maxCharts: Number(row.max_charts ?? 3),
    maxQuestionsPerChart: Number(row.max_questions_per_chart ?? 5),
    isActive: row.is_active !== false,
    notes: row.notes || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
  };
}

/**
 * Lấy danh sách toàn bộ Tester kèm thống kê số lá số & số câu hỏi đã dùng
 */
export async function getAllTesters(): Promise<TesterAccount[]> {
  loadFromFile();

  try {
    const { data, error } = await supabase
      .from('tuvi_testers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      testersMap.clear();
      for (const row of data) {
        const item = rowToTesterAccount(row);
        testersMap.set(item.email.toLowerCase().trim(), item);
      }
      saveToFile();
    }
  } catch (err) {
    // Supabase table chưa tạo, sử dụng cache fallback
  }

  const list = Array.from(testersMap.values());

  // Lấy thêm thống kê số lượng lá số và câu hỏi thực tế của từng tester
  try {
    const { data: charts } = await supabase
      .from('tuvi_charts')
      .select('id, user_id');

    const { data: messages } = await supabase
      .from('tuvi_chat_messages')
      .select('id, user_id');

    for (const t of list) {
      if (t.userId) {
        t.chartsUsed = charts?.filter((c) => c.user_id === t.userId).length || 0;
        t.questionsUsed = messages?.filter((m) => m.user_id === t.userId).length || 0;
      } else {
        t.chartsUsed = t.chartsUsed || 0;
        t.questionsUsed = t.questionsUsed || 0;
      }
    }
  } catch {
    // ignore
  }

  return list.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Tìm kiếm Tester theo Email
 */
export async function getTesterByEmail(email: string): Promise<TesterAccount | null> {
  const cleanEmail = email.toLowerCase().trim();
  if (!cleanEmail) return null;

  loadFromFile();

  // Kiểm tra cache trước
  if (testersMap.has(cleanEmail)) {
    const cached = testersMap.get(cleanEmail)!;
    return cached;
  }

  try {
    const { data, error } = await supabase
      .from('tuvi_testers')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!error && data) {
      const item = rowToTesterAccount(data);
      testersMap.set(cleanEmail, item);
      saveToFile();
      return item;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Tạo mới tài khoản Tester
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
  if (!params.password || params.password.length < 6) {
    return { success: false, error: 'Mật khẩu cần tối thiểu 6 ký tự.' };
  }

  // 1. Đăng ký tài khoản trong Supabase Auth bằng authClient stateless
  let userId: string | undefined = undefined;
  try {
    const { data: authData, error: authError } = await authClient.auth.signUp({
      email: cleanEmail,
      password: params.password,
      options: {
        data: {
          full_name: params.fullName.trim(),
          app: 'tuvi',
          role: 'tester',
          max_charts: params.maxCharts,
          max_questions_per_chart: params.maxQuestionsPerChart,
        },
      },
    });

    if (authData?.user) {
      userId = authData.user.id;
    } else if (authError && authError.message.includes('already registered')) {
      // Nếu email đã từng đăng ký trước đó, tìm userId từ tuvi_profiles
      try {
        const { data: profileData } = await supabase
          .from('tuvi_profiles')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle();
        if (profileData) {
          userId = profileData.id;
        }
      } catch {
        // ignore
      }
    } else if (authError) {
      return { success: false, error: `Lỗi tạo Auth: ${authError.message}` };
    }
  } catch (err: any) {
    console.warn('[TESTER STORE] Lỗi đăng ký auth:', err);
  }

  const now = new Date().toISOString();
  const newTester: TesterAccount = {
    id: `tester_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    email: cleanEmail,
    fullName: params.fullName.trim() || 'Tester',
    passwordPlain: params.password,
    maxCharts: Number(params.maxCharts) || 3,
    maxQuestionsPerChart: Number(params.maxQuestionsPerChart) || 5,
    isActive: true,
    notes: params.notes?.trim() || undefined,
    chartsUsed: 0,
    questionsUsed: 0,
    createdAt: now,
    updatedAt: now,
  };

  // 2. Lưu vào Supabase Database nếu có bảng
  try {
    const { data: inserted, error: dbError } = await supabase
      .from('tuvi_testers')
      .upsert({
        user_id: userId || null,
        email: cleanEmail,
        full_name: newTester.fullName,
        password_plain: newTester.passwordPlain,
        max_charts: newTester.maxCharts,
        max_questions_per_chart: newTester.maxQuestionsPerChart,
        is_active: true,
        notes: newTester.notes || null,
        updated_at: now,
      })
      .select('id')
      .maybeSingle();

    if (!dbError && inserted?.id) {
      newTester.id = inserted.id;
    }
  } catch (dbErr) {
    console.warn('[TESTER STORE] Không thể ghi vào Supabase, sử dụng file local:', dbErr);
  }

  // 3. Cập nhật tuvi_profiles với role tester
  if (userId) {
    try {
      await supabase.from('tuvi_profiles').upsert({
        id: userId,
        email: cleanEmail,
        full_name: newTester.fullName,
        role: 'tester',
        max_charts: newTester.maxCharts,
        max_questions_per_chart: newTester.maxQuestionsPerChart,
        updated_at: now,
      });
    } catch {
      // ignore
    }
  }

  // 4. Lưu cache và file
  testersMap.set(cleanEmail, newTester);
  saveToFile();

  return { success: true, tester: newTester };
}

/**
 * Cập nhật cấu hình hạn mức Tester
 */
export async function updateTester(
  id: string,
  params: Partial<TesterAccount>
): Promise<{ success: boolean; tester?: TesterAccount; error?: string }> {
  loadFromFile();

  let target: TesterAccount | undefined;
  for (const t of testersMap.values()) {
    if (t.id === id || (params.email && t.email === params.email.toLowerCase().trim())) {
      target = t;
      break;
    }
  }

  if (!target) {
    return { success: false, error: 'Không tìm thấy tài khoản tester để cập nhật.' };
  }

  const now = new Date().toISOString();
  if (params.fullName !== undefined) target.fullName = params.fullName.trim();
  if (params.maxCharts !== undefined) target.maxCharts = Number(params.maxCharts);
  if (params.maxQuestionsPerChart !== undefined) target.maxQuestionsPerChart = Number(params.maxQuestionsPerChart);
  if (params.passwordPlain !== undefined && params.passwordPlain) target.passwordPlain = params.passwordPlain;
  if (params.notes !== undefined) target.notes = params.notes;
  if (params.isActive !== undefined) target.isActive = params.isActive;
  target.updatedAt = now;

  // Cập nhật Supabase
  try {
    await supabase
      .from('tuvi_testers')
      .update({
        full_name: target.fullName,
        password_plain: target.passwordPlain,
        max_charts: target.maxCharts,
        max_questions_per_chart: target.maxQuestionsPerChart,
        is_active: target.isActive,
        notes: target.notes || null,
        updated_at: now,
      })
      .eq('email', target.email);

    if (target.userId) {
      await supabase
        .from('tuvi_profiles')
        .update({
          full_name: target.fullName,
          role: target.isActive ? 'tester' : 'user',
          max_charts: target.maxCharts,
          max_questions_per_chart: target.maxQuestionsPerChart,
          updated_at: now,
        })
        .eq('id', target.userId);
    }
  } catch {
    // ignore
  }

  testersMap.set(target.email, target);
  saveToFile();

  return { success: true, tester: target };
}

/**
 * Xóa tài khoản Tester
 */
export async function deleteTester(id: string): Promise<{ success: boolean; error?: string }> {
  loadFromFile();

  let targetEmail: string | null = null;
  let targetUserId: string | undefined = undefined;

  for (const [email, t] of testersMap.entries()) {
    if (t.id === id) {
      targetEmail = email;
      targetUserId = t.userId;
      testersMap.delete(email);
      break;
    }
  }

  if (targetEmail) {
    try {
      await supabase.from('tuvi_testers').delete().eq('email', targetEmail);
      if (targetUserId) {
        await supabase
          .from('tuvi_profiles')
          .update({ role: 'user' })
          .eq('id', targetUserId);
      }
    } catch {
      // ignore
    }
    saveToFile();
    return { success: true };
  }

  return { success: false, error: 'Không tìm thấy tài khoản để xóa.' };
}

/**
 * Bật / tắt trạng thái kích hoạt Tester
 */
export async function toggleTesterActive(id: string, isActive: boolean): Promise<{ success: boolean; error?: string }> {
  return updateTester(id, { isActive });
}
