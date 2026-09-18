import { supabase } from './supabase';
import { DuLieuDuongSo, LaSoData, ChatMessage } from '@/types/tuvi';

export interface SavedChart {
  id: string;
  user_id: string;
  title: string;
  duong_so_data: DuLieuDuongSo;
  laso_data: LaSoData;
  reading_html?: string | null;
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

    const { data, error } = await supabase
      .from('tuvi_charts')
      .select('id, user_id, title, duong_so_data, laso_data, reading_html, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Lấy số lượng tin nhắn cho từng lá số
    const chartsWithCount: SavedChart[] = await Promise.all(
      (data || []).map(async (chart) => {
        const { count } = await supabase
          .from('tuvi_chat_messages')
          .select('*', { count: 'exact', head: true })
          .eq('chart_id', chart.id);
        return {
          ...chart,
          message_count: count || 0,
        };
      })
    );

    return { charts: chartsWithCount };
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
      .select('question, answer')
      .eq('chart_id', chartId)
      .order('created_at', { ascending: true });

    if (msgErr) throw msgErr;

    const chatMessages: ChatMessage[] = (messages || []).map((m) => ({
      q: m.question,
      a: m.answer,
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
      // Cập nhật lá số đã có
      const { error } = await supabase
        .from('tuvi_charts')
        .update({
          title: params.title,
          duong_so_data: params.duongSoData,
          laso_data: params.lasoData,
          reading_html: params.readingHtml || null,
          updated_at: new Date().toISOString(),
        })
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
  answer: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Chưa đăng nhập' };

    const { error } = await supabase.from('tuvi_chat_messages').insert({
      chart_id: chartId,
      user_id: user.id,
      question,
      answer,
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
