import { supabase } from './supabase';
import { DuLieuDuongSo, LaSoData, ChatMessage } from '@/types/tuvi';

export interface SavedChart {
  id: string;
  user_id: string;
  title: string;
  duong_so_data: DuLieuDuongSo;
  laso_data: LaSoData;
  reading_html?: string | null;
  has_reading?: boolean;
  paid_tier?: 'pro' | 'expert';
  created_at: string;
  updated_at: string;
  message_count?: number;
}

export interface SavedChatMessage {
  id: string;
  chart_id: string;
  user_id: string;
  question: string;
  answer: string;
  created_at: string;
}

/**
 * Lấy danh sách tất cả lá số của người dùng hiện tại
 */
export async function getUserCharts(): Promise<{ charts: SavedChart[]; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { charts: [] };

    // Không kéo reading_html (15–30KB/lá số) trong danh sách để tải siêu nhanh
    const { data, error } = await supabase
      .from('tuvi_charts')
      .select('id, user_id, title, duong_so_data, laso_data, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const rows = (data || []) as SavedChart[];
    if (rows.length === 0) return { charts: [] };

    const chartIds = rows.map((c) => c.id);

    // 3 truy vấn gọn song song thay cho N+1 HEAD queries và tải full reading_html
    const [msgRes, readingIdsRes, paidOrdersRes] = await Promise.all([
      supabase.from('tuvi_chat_messages').select('chart_id').in('chart_id', chartIds),
      supabase.from('tuvi_charts').select('id').in('id', chartIds).not('reading_html', 'is', null),
      supabase
        .from('tuvi_orders')
        .select('chart_id, payment_type')
        .in('chart_id', chartIds)
        .eq('status', 'PAID'),
    ]);

    const msgCounts = new Map<string, number>();
    for (const m of (msgRes.data || []) as { chart_id: string }[]) {
      msgCounts.set(m.chart_id, (msgCounts.get(m.chart_id) || 0) + 1);
    }

    const hasReadingSet = new Set<string>(
      ((readingIdsRes.data || []) as { id: string }[]).map((r) => r.id)
    );

    const paidTierMap = new Map<string, 'pro' | 'expert'>();
    for (const o of (paidOrdersRes.data || []) as { chart_id: string | null; payment_type: string }[]) {
      if (!o.chart_id) continue;
      if (o.payment_type === 'reading_expert' || o.payment_type === 'upgrade_expert') {
        paidTierMap.set(o.chart_id, 'expert');
      } else if (o.payment_type === 'reading_vip' && paidTierMap.get(o.chart_id) !== 'expert') {
        paidTierMap.set(o.chart_id, 'pro');
      }
    }

    const chartsWithMeta: SavedChart[] = rows.map((chart) => ({
      ...chart,
      has_reading: hasReadingSet.has(chart.id),
      paid_tier: paidTierMap.get(chart.id),
      message_count: msgCounts.get(chart.id) || 0,
    }));

    return { charts: chartsWithMeta };
  } catch (err: any) {
    console.error('Lỗi getUserCharts:', err.message);
    return { charts: [], error: err.message };
  }
}

/**
 * Lấy chi tiết lá số và toàn bộ tin nhắn hỏi đáp
 */
export async function getChartDetails(chartId: string): Promise<{
  chart?: SavedChart;
  chatMessages: ChatMessage[];
  error?: string;
}> {
  try {
    const { data: chart, error: chartErr } = await supabase
      .from('tuvi_charts')
      .select('*')
      .eq('id', chartId)
      .single();

    if (chartErr) throw chartErr;

    const { data: messages, error: msgErr } = await supabase
      .from('tuvi_chat_messages')
      .select('question, answer, message_type')
      .eq('chart_id', chartId)
      .order('created_at', { ascending: true });

    if (msgErr) throw msgErr;

    const chatMessages: ChatMessage[] = (messages || []).map((m: any) => ({
      q: m.question,
      a: m.answer,
      type:
        (m.message_type as 'basic' | 'vip' | 'expert') ||
        (m.answer?.includes('Chuyên Gia') || m.answer?.includes('Expert')
          ? 'expert'
          : m.answer?.includes('Chuyên Sâu') || m.answer?.includes('VIP Pro')
          ? 'vip'
          : 'basic'),
    }));

    return { chart, chatMessages };
  } catch (err: any) {
    console.error('Lỗi getChartDetails:', err.message);
    return { chatMessages: [], error: err.message };
  }
}

/**
 * Lưu mới hoặc cập nhật lá số
 */
export async function saveOrUpdateChart(params: {
  id?: string;
  title: string;
  duongSoData: DuLieuDuongSo;
  lasoData: LaSoData;
  readingHtml?: string;
}): Promise<{ chartId?: string; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Bạn cần đăng nhập để lưu lá số' };

    if (params.id) {
      // Cập nhật lá số đã có — CHỈ cập nhật reading_html khi được truyền rõ ràng (tránh xóa nhầm bài đã trả phí)
      const updatePayload: Record<string, unknown> = {
        title: params.title,
        duong_so_data: params.duongSoData,
        laso_data: params.lasoData,
        updated_at: new Date().toISOString(),
      };
      if (params.readingHtml !== undefined) {
        updatePayload.reading_html = params.readingHtml || null;
      }

      const { error } = await supabase
        .from('tuvi_charts')
        .update(updatePayload)
        .eq('id', params.id);

      if (error) throw error;
      return { chartId: params.id };
    } else {
      // Tạo mới lá số
      const { data, error } = await supabase
        .from('tuvi_charts')
        .insert({
          user_id: user.id,
          title: params.title,
          duong_so_data: params.duongSoData,
          laso_data: params.lasoData,
          reading_html: params.readingHtml || null,
        })
        .select('id')
        .single();

      if (error) throw error;
      return { chartId: data.id };
    }
  } catch (err: any) {
    console.error('Lỗi saveOrUpdateChart:', err.message);
    return { error: err.message };
  }
}

/**
 * Cập nhật bài bình giải AI cho lá số
 */
export async function updateChartReading(
  chartId: string,
  readingHtml: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('tuvi_charts')
      .update({
        reading_html: readingHtml,
        updated_at: new Date().toISOString(),
      })
      .eq('id', chartId);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Lưu câu hỏi & câu trả lời trò chuyện với Thầy Tôn
 */
export async function saveChatMessage(
  chartId: string,
  question: string,
  answer: string,
  type?: 'basic' | 'vip' | 'expert'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Chưa đăng nhập' };

    const { error } = await supabase.from('tuvi_chat_messages').insert({
      chart_id: chartId,
      user_id: user.id,
      question,
      answer,
      message_type: type || 'vip',
    });

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('Lỗi saveChatMessage:', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Xóa một lá số
 */
export async function deleteChart(chartId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('tuvi_charts').delete().eq('id', chartId);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
