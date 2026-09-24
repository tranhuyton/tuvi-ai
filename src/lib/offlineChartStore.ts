import fs from 'fs';
import path from 'path';
import { DuLieuDuongSo, LaSoData } from '@/types/tuvi';
import { supabase } from './supabase';

export type OfflineChartTag = 'offline' | 'sample' | 'vip_offline';

export interface OfflineChartItem {
  id: string;
  hoTen: string;
  tag: OfflineChartTag;
  notes?: string; // Ghi chú riêng của Thầy Tôn (ví dụ: ngày giờ hẹn, lưu ý...)
  duongSoData: DuLieuDuongSo;
  lasoData?: LaSoData;
  readingHtml?: string;
  createdAt: string;
  updatedAt: string;
  chatHistory?: { q: string; a: string }[];
}

// Global cache trong Node runtime
declare global {
  var __tuviOfflineChartsCache: Map<string, OfflineChartItem> | undefined;
}

const chartsMap: Map<string, OfflineChartItem> =
  globalThis.__tuviOfflineChartsCache || new Map<string, OfflineChartItem>();
globalThis.__tuviOfflineChartsCache = chartsMap;

// Chuyển đổi dữ liệu từ Supabase row sang OfflineChartItem
function rowToOfflineChartItem(row: any): OfflineChartItem {
  return {
    id: row.id,
    hoTen: row.ho_ten || (row.duong_so_data?.hoTen || 'Khách Offline'),
    tag: (row.tag as OfflineChartTag) || 'offline',
    notes: row.notes || undefined,
    duongSoData: row.duong_so_data,
    lasoData: row.laso_data || undefined,
    readingHtml: row.reading_html || undefined,
    chatHistory: Array.isArray(row.chat_history) ? row.chat_history : undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || row.created_at || new Date().toISOString(),
  };
}

// Đường dẫn file lưu trữ an toàn: ưu tiên /tmp trên Vercel / serverless để tránh lỗi read-only filesystem
function getDataFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'offline_charts.json');
  }
  const localDir = path.join(process.cwd(), '.data');
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, 'offline_charts.json');
  } catch {
    return path.join('/tmp', 'offline_charts.json');
  }
}

function loadFromFile() {
  try {
    const dataFile = getDataFilePath();
    if (fs.existsSync(dataFile)) {
      const content = fs.readFileSync(dataFile, 'utf-8');
      const list: OfflineChartItem[] = JSON.parse(content);
      chartsMap.clear();
      if (Array.isArray(list)) {
        for (const item of list) {
          if (item.tag !== 'sample' && !item.id.startsWith('preset-')) {
            chartsMap.set(item.id, item);
          }
        }
      }
    }
  } catch (err) {
    console.warn('[OFFLINE CHARTS] Ngoại lệ loadFromFile (vẫn duy trì bộ nhớ):', err);
  }
}

function saveToFile() {
  try {
    const dataFile = getDataFilePath();
    const dir = path.dirname(dataFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const list = Array.from(chartsMap.values());
    fs.writeFileSync(dataFile, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[OFFLINE CHARTS] Không thể ghi file:', err);
  }
}

// Khởi chạy khi module nạp
loadFromFile();

/**
 * Lấy danh sách toàn bộ lá số trong kho khách offline (Ưu tiên Supabase, fallback sang cache)
 */
export async function getAllOfflineCharts(): Promise<OfflineChartItem[]> {
  try {
    const { data, error } = await supabase
      .from('tuvi_offline_charts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      chartsMap.clear();
      for (const row of data) {
        if (row.tag !== 'sample' && !row.id.startsWith('preset-')) {
          const item = rowToOfflineChartItem(row);
          chartsMap.set(item.id, item);
        }
      }
      saveToFile();
      const list = Array.from(chartsMap.values());
      list.sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
      );
      return list;
    }
  } catch (err) {
    console.warn('[OFFLINE CHARTS] Lỗi kết nối Supabase, dùng cache dự phòng:', err);
  }

  // Fallback sang in-memory / local file nếu Supabase gặp sự cố
  if (chartsMap.size === 0) {
    loadFromFile();
  }
  const list = Array.from(chartsMap.values()).filter(
    (c) => c.tag !== 'sample' && !c.id.startsWith('preset-')
  );
  list.sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()
  );
  return list;
}

/**
 * Lưu hoặc cập nhật lá số khách offline (đồng bộ Supabase + cache)
 */
export async function saveOfflineChart(
  item: Partial<OfflineChartItem> & { hoTen: string; duongSoData: DuLieuDuongSo }
): Promise<OfflineChartItem> {
  if (chartsMap.size === 0) {
    loadFromFile();
  }

  const now = new Date().toISOString();
  const id = item.id || `offline-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const existing = chartsMap.get(id);

  const fullItem: OfflineChartItem = {
    id,
    hoTen: item.hoTen.trim(),
    tag: item.tag || (existing?.tag || 'offline'),
    notes: item.notes !== undefined ? item.notes : existing?.notes,
    duongSoData: item.duongSoData,
    lasoData: item.lasoData || existing?.lasoData,
    readingHtml: item.readingHtml !== undefined ? item.readingHtml : existing?.readingHtml,
    chatHistory: item.chatHistory !== undefined ? item.chatHistory : existing?.chatHistory,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  };

  chartsMap.set(id, fullItem);
  saveToFile();

  // Đồng bộ vĩnh viễn lên Supabase
  try {
    const { error } = await supabase.from('tuvi_offline_charts').upsert({
      id: fullItem.id,
      ho_ten: fullItem.hoTen,
      tag: fullItem.tag,
      notes: fullItem.notes || null,
      duong_so_data: fullItem.duongSoData,
      laso_data: fullItem.lasoData || null,
      reading_html: fullItem.readingHtml || null,
      chat_history: fullItem.chatHistory || [],
      created_at: fullItem.createdAt,
      updated_at: fullItem.updatedAt,
    });
    if (error) {
      console.warn('[OFFLINE CHARTS] Lỗi upsert Supabase:', error.message);
    }
  } catch (err) {
    console.warn('[OFFLINE CHARTS] Ngoại lệ khi lưu Supabase:', err);
  }

  return fullItem;
}

/**
 * Lưu hàng loạt lá số (batch sync)
 */
export async function saveMultipleOfflineCharts(
  items: (Partial<OfflineChartItem> & { hoTen: string; duongSoData: DuLieuDuongSo })[]
): Promise<OfflineChartItem[]> {
  const savedList: OfflineChartItem[] = [];
  for (const it of items) {
    if (it.hoTen && it.duongSoData) {
      const s = await saveOfflineChart(it);
      savedList.push(s);
    }
  }
  return savedList;
}

/**
 * Xóa một lá số khỏi kho (xóa Supabase + cache)
 */
export async function deleteOfflineChart(id: string): Promise<boolean> {
  if (chartsMap.size === 0) {
    loadFromFile();
  }

  const deleted = chartsMap.delete(id);
  saveToFile();

  try {
    const { error } = await supabase.from('tuvi_offline_charts').delete().eq('id', id);
    if (error) {
      console.warn('[OFFLINE CHARTS] Lỗi xóa Supabase:', error.message);
    }
  } catch (err) {
    console.warn('[OFFLINE CHARTS] Ngoại lệ khi xóa Supabase:', err);
  }

  return deleted;
}
