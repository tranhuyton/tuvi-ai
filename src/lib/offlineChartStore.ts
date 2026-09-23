import fs from 'fs';
import path from 'path';
import { DuLieuDuongSo, LaSoData } from '@/types/tuvi';

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

const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'offline_charts.json');

const DEFAULT_PRESETS: OfflineChartItem[] = [
  {
    id: 'preset-thay-ton-1985',
    hoTen: 'Trần Huy Tôn',
    tag: 'sample',
    notes: 'Lá số mẫu Thầy Tôn (Ất Sửu 1985). Nghiên cứu dịch lý & chiến lược kinh doanh.',
    duongSoData: {
      hoTen: 'Trần Huy Tôn',
      gioiTinh: 'Nam',
      ngayDuong: 15,
      thangDuong: 8,
      namDuong: 1985,
      gioSinhVal: '4', // Thìn (07h-09h)
      thongTinThem: 'Nghiên cứu dịch học, kinh doanh tư vấn chiến lược.',
      chieuCao: 172,
      canNang: 68,
      tier: 'pro',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset-nam-kim-1995',
    hoTen: 'Nguyễn Văn An',
    tag: 'sample',
    notes: 'Mẫu Nam Mệnh Kim (Ất Hợi 1995). Quan tâm công danh khởi nghiệp công nghệ.',
    duongSoData: {
      hoTen: 'Nguyễn Văn An',
      gioiTinh: 'Nam',
      ngayDuong: 10,
      thangDuong: 4,
      namDuong: 1995,
      gioSinhVal: '2', // Dần (03h-05h)
      thongTinThem: 'Kỹ sư phần mềm, đang chuẩn bị khởi nghiệp công nghệ.',
      chieuCao: 170,
      canNang: 65,
      tier: 'free',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset-nu-thuy-1998',
    hoTen: 'Lê Thùy Dương',
    tag: 'sample',
    notes: 'Mẫu Nữ Mệnh Thủy (Mậu Dần 1998). Quan tâm tài lộc ngành tài chính & gia đạo.',
    duongSoData: {
      hoTen: 'Lê Thùy Dương',
      gioiTinh: 'Nữ',
      ngayDuong: 22,
      thangDuong: 11,
      namDuong: 1998,
      gioSinhVal: '6', // Ngọ (11h-13h)
      thongTinThem: 'Làm việc trong lĩnh vực tài chính ngân hàng, quan tâm gia đạo.',
      chieuCao: 160,
      canNang: 48,
      tier: 'pro',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function loadFromFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const list: OfflineChartItem[] = JSON.parse(content);
      chartsMap.clear();
      for (const item of list) {
        chartsMap.set(item.id, item);
      }
    } else {
      // Khởi tạo các mẫu ban đầu
      chartsMap.clear();
      for (const item of DEFAULT_PRESETS) {
        chartsMap.set(item.id, item);
      }
      saveToFile();
    }
  } catch (err) {
    console.warn('[OFFLINE CHARTS] Không thể đọc file offline_charts.json:', err);
  }
}

function saveToFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const list = Array.from(chartsMap.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[OFFLINE CHARTS] Không thể ghi file offline_charts.json:', err);
  }
}

// Khởi chạy khi module nạp
if (chartsMap.size === 0) {
  loadFromFile();
}

/**
 * Lấy danh sách toàn bộ lá số trong kho
 */
export async function getAllOfflineCharts(): Promise<OfflineChartItem[]> {
  if (chartsMap.size === 0) {
    loadFromFile();
  }
  const list = Array.from(chartsMap.values());
  list.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());
  return list;
}

/**
 * Lưu hoặc cập nhật lá số khách offline
 */
export async function saveOfflineChart(item: Partial<OfflineChartItem> & { hoTen: string; duongSoData: DuLieuDuongSo }): Promise<OfflineChartItem> {
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
  return fullItem;
}

/**
 * Xóa một lá số khỏi kho
 */
export async function deleteOfflineChart(id: string): Promise<boolean> {
  if (chartsMap.size === 0) {
    loadFromFile();
  }

  const deleted = chartsMap.delete(id);
  if (deleted) {
    saveToFile();
  }
  return deleted;
}
