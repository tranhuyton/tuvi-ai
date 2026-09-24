'use client';

import React, { useState, useEffect } from 'react';
import { DuLieuDuongSo, LaSoData, ChatMessage, ServiceTier } from '@/types/tuvi';
import { lapLaSoTuVi, buildCungDataPrompt } from '@/lib/tuvi/anSao';
import LaSoBanCo from '@/components/LaSoBanCo';
import LuanGiaiAI from '@/components/LuanGiaiAI';
import ChatThayTon from '@/components/ChatThayTon';
import {
  Sparkles,
  Crown,
  Play,
  RefreshCw,
  Code2,
  Clock,
  FileText,
  User,
  Zap,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Image as ImageIcon,
  X,
  Save,
  Trash2,
  UserPlus,
  BookOpen,
  Search,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Bookmark,
  Cloud,
} from 'lucide-react';
import { GIO_ARR } from '@/lib/tuvi/constants';
import { OfflineChartItem, OfflineChartTag } from '@/lib/offlineChartStore';

function isHeicFile(file: File): boolean {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return (
    name.endsWith('.heic') ||
    name.endsWith('.heif') ||
    type === 'image/heic' ||
    type === 'image/heif' ||
    type === 'image/heic-sequence' ||
    type === 'image/heif-sequence'
  );
}

function compressImage(blob: Blob, maxWidth = 800, quality = 0.65): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      let width = img.width;
      let height = img.height;
      if (width > maxWidth || height > maxWidth) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxWidth) / height);
          height = maxWidth;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context không khả dụng'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl);
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Không thể tải hình ảnh để nén'));
    };
    img.src = objectUrl;
  });
}

const EMPTY_FORM: DuLieuDuongSo = {
  hoTen: '',
  gioiTinh: 'Nam',
  ngayDuong: 1,
  thangDuong: 1,
  namDuong: 1990,
  gioSinhVal: '4', // Thìn
  thongTinThem: '',
  chieuCao: undefined,
  canNang: undefined,
  anhMat: undefined,
  anhTay: undefined,
  tier: 'pro',
};

export default function AdminTestStudio() {
  const [formData, setFormData] = useState<DuLieuDuongSo>(EMPTY_FORM);
  const [testTier, setTestTier] = useState<ServiceTier>('pro');
  const [testModel, setTestModel] = useState<string>('gemini-3.1-pro-preview');

  // Sổ tay khách offline
  const [offlineCharts, setOfflineCharts] = useState<OfflineChartItem[]>([]);
  const [isLoadingOffline, setIsLoadingOffline] = useState(false);
  const [activeChartId, setActiveChartId] = useState<string | null>(null);
  const [offlineSearch, setOfflineSearch] = useState('');
  const [clientNotes, setClientNotes] = useState('');
  const [chartTag, setChartTag] = useState<OfflineChartTag>('offline');
  const [isSavingChart, setIsSavingChart] = useState(false);
  const [autoSavedNotice, setAutoSavedNotice] = useState(false);

  // Upload ảnh
  const [isConvertingMat, setIsConvertingMat] = useState(false);
  const [isConvertingTay, setIsConvertingTay] = useState(false);

  // Lá số và kết quả
  const [laSo, setLaSo] = useState<LaSoData | null>(null);
  const [readingHtml, setReadingHtml] = useState<string | undefined>(undefined);
  const [readingError, setReadingError] = useState<string | undefined>(undefined);
  const [isLoadingReading, setIsLoadingReading] = useState(false);
  const [generationTimeMs, setGenerationTimeMs] = useState<number | null>(null);
  const [wordCount, setWordCount] = useState<number | null>(null);

  // Chat hỏi đáp
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Debug prompt
  const [showPromptDebug, setShowPromptDebug] = useState(false);
  const [rawPromptText, setRawPromptText] = useState<string>('');

  // Tải danh sách lá số khách offline khi vào trang
  const fetchOfflineCharts = async () => {
    setIsLoadingOffline(true);
    try {
      const pin = localStorage.getItem('tuvi_admin_pin') || 'thayton2026';
      const res = await fetch(`/api/admin/offline-charts?pin=${encodeURIComponent(pin)}`, {
        headers: { 'x-admin-pin': pin },
      });
      if (res.ok) {
        const data = await res.json();
        // Lọc bỏ triệt để các mẫu sample cũ nếu có
        let list: OfflineChartItem[] = (data.charts || []).filter(
          (c: OfflineChartItem) => c.tag !== 'sample' && !c.id.startsWith('preset-')
        );

        // Đồng bộ 2 chiều giữa Supabase Cloud và localStorage trên thiết bị
        try {
          const localSaved = localStorage.getItem('tuvi_offline_charts_local');
          if (localSaved) {
            let localList: OfflineChartItem[] = JSON.parse(localSaved);
            if (Array.isArray(localList)) {
              // Dọn sạch các mẫu sample cũ nếu có
              localList = localList.filter((c) => c.tag !== 'sample' && !c.id.startsWith('preset-'));
              const serverIdSet = new Set(list.map((c) => c.id));
              const missingOnServer = localList.filter((c) => !serverIdSet.has(c.id));
              if (missingOnServer.length > 0) {
                // Tự động đẩy bù các hồ sơ từ máy tính lên Supabase qua batch POST
                try {
                  await fetch('/api/admin/offline-charts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
                    body: JSON.stringify(missingOnServer),
                  });
                } catch (batchErr) {
                  console.warn('Lỗi đẩy bù hồ sơ lên Supabase:', batchErr);
                }
                list = [...list, ...missingOnServer];
              }
            }
          }
          // Lưu danh sách đầy đủ mới nhất từ Cloud vào thiết bị hiện tại
          localStorage.setItem('tuvi_offline_charts_local', JSON.stringify(list));
        } catch (e) {
          // ignore localStorage error
        }

        setOfflineCharts(list);
        // Nếu form chưa có tên và có hồ sơ khách, nạp hồ sơ đầu tiên
        if (!formData.hoTen && list.length > 0) {
          loadChartItem(list[0]);
        }
      }
    } catch (err) {
      console.warn('Không thể tải kho lá số offline:', err);
      // Fallback từ localStorage nếu mạng lỗi
      try {
        const localSaved = localStorage.getItem('tuvi_offline_charts_local');
        if (localSaved) {
          const localList: OfflineChartItem[] = JSON.parse(localSaved);
          if (Array.isArray(localList)) {
            setOfflineCharts(localList.filter((c) => c.tag !== 'sample' && !c.id.startsWith('preset-')));
          }
        }
      } catch (e) {}
    } finally {
      setIsLoadingOffline(false);
    }
  };

  useEffect(() => {
    fetchOfflineCharts();
  }, []);

  // Xử lý nạp lá số từ kho vào Studio
  const loadChartItem = (item: OfflineChartItem) => {
    setActiveChartId(item.id);
    setFormData({
      ...item.duongSoData,
      tier: item.duongSoData.tier || 'pro',
    });
    setClientNotes(item.notes || '');
    setChartTag(item.tag || 'offline');
    setTestTier(item.duongSoData.tier || 'pro');

    if (item.readingHtml) {
      setReadingHtml(item.readingHtml);
      const textOnly = item.readingHtml.replace(/<[^>]*>/g, ' ');
      const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
      setWordCount(words);
    } else {
      setReadingHtml(undefined);
      setWordCount(null);
    }

    if (item.chatHistory && item.chatHistory.length > 0) {
      setChatHistory(item.chatHistory);
    } else {
      setChatHistory([]);
    }

    // Tự động tính toán lá số
    const cleanData: DuLieuDuongSo = {
      ...item.duongSoData,
      tier: item.duongSoData.tier || 'pro',
    };
    const calculated = lapLaSoTuVi(cleanData, 2026);
    calculated.tier = item.duongSoData.tier || 'pro';
    setLaSo(calculated);
  };

  // Tạo mới hồ sơ khách offline
  const handleNewCustomer = () => {
    setActiveChartId(null);
    setFormData({
      ...EMPTY_FORM,
      namDuong: 1990,
      ngayDuong: 15,
      thangDuong: 6,
    });
    setClientNotes('');
    setChartTag('offline');
    setLaSo(null);
    setReadingHtml(undefined);
    setReadingError(undefined);
    setChatHistory([]);
    setGenerationTimeMs(null);
    setWordCount(null);
  };

  // Lưu hoặc cập nhật lá số vào Sổ Tay Khách Offline
  const handleSaveToOfflineCharts = async () => {
    if (!formData.hoTen.trim()) {
      alert('Vui lòng nhập Họ tên đương số trước khi lưu vào sổ tay!');
      return;
    }

    setIsSavingChart(true);
    try {
      const pin = localStorage.getItem('tuvi_admin_pin') || 'thayton2026';
      const payload: Partial<OfflineChartItem> & { hoTen: string; duongSoData: DuLieuDuongSo } = {
        id: activeChartId || undefined,
        hoTen: formData.hoTen.trim(),
        tag: chartTag,
        notes: clientNotes.trim() || undefined,
        duongSoData: formData,
        lasoData: laSo || undefined,
        readingHtml: readingHtml || undefined,
        chatHistory: chatHistory.length > 0 ? chatHistory : undefined,
      };

      const res = await fetch('/api/admin/offline-charts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-pin': pin,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.chart) {
        setActiveChartId(data.chart.id);
        // Lưu ngay vào localStorage trên máy của Thầy Tôn
        try {
          const localSaved = localStorage.getItem('tuvi_offline_charts_local');
          const localList: OfflineChartItem[] = localSaved ? JSON.parse(localSaved) : [];
          const idx = localList.findIndex((c) => c.id === data.chart.id);
          if (idx >= 0) {
            localList[idx] = data.chart;
          } else {
            localList.unshift(data.chart);
          }
          localStorage.setItem('tuvi_offline_charts_local', JSON.stringify(localList));
        } catch (e) {}

        alert(`✅ Đã lưu thành công hồ sơ của "${data.chart.hoTen}" vào Sổ Tay Số Mệnh của Thầy Tôn!`);
        fetchOfflineCharts();
      } else {
        alert(`Lỗi lưu lá số: ${data.error || 'Không xác định'}`);
      }
    } catch (err: any) {
      alert(`Lỗi kết nối: ${err.message || err}`);
    } finally {
      setIsSavingChart(false);
    }
  };

  // Xóa lá số khỏi kho
  const handleDeleteChart = async (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa hồ sơ lá số của "${name}" khỏi sổ tay không?`);
    if (!confirmed) return;

    try {
      const pin = localStorage.getItem('tuvi_admin_pin') || 'thayton2026';
      const res = await fetch(`/api/admin/offline-charts?id=${encodeURIComponent(id)}&pin=${encodeURIComponent(pin)}`, {
        method: 'DELETE',
        headers: { 'x-admin-pin': pin },
      });
      if (res.ok) {
        // Đồng bộ xóa khỏi localStorage
        try {
          const localSaved = localStorage.getItem('tuvi_offline_charts_local');
          if (localSaved) {
            const localList: OfflineChartItem[] = JSON.parse(localSaved);
            const filtered = localList.filter((c) => c.id !== id);
            localStorage.setItem('tuvi_offline_charts_local', JSON.stringify(filtered));
          }
        } catch (e) {}

        if (activeChartId === id) {
          handleNewCustomer();
        }
        fetchOfflineCharts();
      } else {
        const data = await res.json();
        alert(`Lỗi: ${data.error || 'Không thể xóa'}`);
      }
    } catch (err: any) {
      alert(`Lỗi: ${err.message || err}`);
    }
  };

  // Xử lý upload ảnh (Hỗ trợ HEIC iPhone & nén)
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'anhMat' | 'anhTay',
    setConverting: (val: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setConverting(true);
    try {
      let targetBlob: Blob = file;
      let isHeicFormat = isHeicFile(file);

      if (!isHeicFormat) {
        try {
          const { isHeic } = await import('heic-to');
          isHeicFormat = await isHeic(file);
        } catch {
          isHeicFormat = false;
        }
      }

      if (isHeicFormat) {
        let decodedNatively = false;
        try {
          const testImg = new Image();
          const testUrl = URL.createObjectURL(file);
          await new Promise<void>((resolve, reject) => {
            testImg.onload = () => resolve();
            testImg.onerror = () => reject();
            testImg.src = testUrl;
          });
          URL.revokeObjectURL(testUrl);
          decodedNatively = true;
        } catch {
          decodedNatively = false;
        }

        if (!decodedNatively) {
          const { heicTo } = await import('heic-to');
          const converted = await heicTo({
            blob: file,
            type: 'image/jpeg',
            quality: 0.85,
          });
          targetBlob = converted;
        }
      }

      const compressed = await compressImage(targetBlob, 800, 0.65);
      setFormData((prev) => ({ ...prev, [field]: compressed }));
    } catch (err: unknown) {
      console.error('Lỗi xử lý ảnh:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      alert(`Không thể xử lý ảnh này (${errMsg}). Vui lòng thử lại hoặc chụp ảnh khác nhé!`);
    } finally {
      setConverting(false);
      e.target.value = '';
    }
  };

  // Hàm An sao & Luận giải
  const handleExecuteTest = async () => {
    if (!formData.hoTen.trim()) {
      alert('Vui lòng nhập Họ tên đương số trước khi an sao!');
      return;
    }

    setIsLoadingReading(true);
    setReadingHtml(undefined);
    setReadingError(undefined);
    setGenerationTimeMs(null);
    setWordCount(null);
    setChatHistory([]);

    const cleanData: DuLieuDuongSo = {
      ...formData,
      tier: testTier,
    };

    const calculated = lapLaSoTuVi(cleanData, 2026);
    calculated.tier = testTier;
    setLaSo(calculated);

    // Chuẩn bị raw prompt để debug
    const cungDataStr = buildCungDataPrompt(calculated);
    setRawPromptText(
      `[MODEL TEST]: ${testModel} | [TIER]: ${testTier}\n` +
      `Đương số: ${calculated.duongSo.hoTen} (${calculated.duongSo.gioiTinh} - ${calculated.namCanChi})\n` +
      `Mệnh: ${calculated.banMenh} | Cục: ${calculated.tenCuc}\n` +
      `Ảnh diện tướng: ${formData.anhMat ? 'Có kèm ảnh Base64' : 'Không có'}\n` +
      `Ảnh chỉ tay: ${formData.anhTay ? 'Có kèm ảnh Base64' : 'Không có'}\n` +
      `Chiều cao: ${formData.chieuCao || 'Chưa nhập'} cm | Cân nặng: ${formData.canNang || 'Chưa nhập'} kg\n` +
      `Hoàn cảnh/Ghi chú: ${formData.thongTinThem || 'Không có'}\n` +
      `12 CUNG DỮ LIỆU:\n${cungDataStr}`
    );

    // TỰ ĐỘNG LƯU VÀO SỔ TAY KHÁCH OFFLINE NGAY KHI AN SAO (Tránh quên bấm)
    const pin = localStorage.getItem('tuvi_admin_pin') || 'thayton2026';
    let savedChartId = activeChartId;
    try {
      const payload: Partial<OfflineChartItem> & { hoTen: string; duongSoData: DuLieuDuongSo } = {
        id: activeChartId || undefined,
        hoTen: cleanData.hoTen.trim(),
        tag: chartTag === 'vip_offline' ? 'vip_offline' : 'offline',
        notes: clientNotes.trim() || undefined,
        duongSoData: cleanData,
        lasoData: calculated,
      };

      const saveRes = await fetch('/api/admin/offline-charts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
        body: JSON.stringify(payload),
      });
      if (saveRes.ok) {
        const data = await saveRes.json();
        if (data.chart) {
          savedChartId = data.chart.id;
          setActiveChartId(data.chart.id);
          setAutoSavedNotice(true);
          setTimeout(() => setAutoSavedNotice(false), 3000);
          fetchOfflineCharts();
        }
      }
    } catch (e) {
      console.warn('Lỗi tự động lưu lá số offline:', e);
    }

    const startTime = Date.now();

    try {
      const res = await fetch('/api/tuvi/reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          laSo: calculated,
          tier: testTier,
          thongTinThem: cleanData.thongTinThem,
          chieuCao: cleanData.chieuCao,
          canNang: cleanData.canNang,
          anhMat: cleanData.anhMat,
          anhTay: cleanData.anhTay,
          model: testModel,
        }),
      });

      const elapsed = Date.now() - startTime;
      setGenerationTimeMs(elapsed);

      if (res.ok) {
        const json = await res.json();
        if (json.reading) {
          setReadingHtml(json.reading);
          const textOnly = json.reading.replace(/<[^>]*>/g, ' ');
          const words = textOnly.trim().split(/\s+/).filter(Boolean).length;
          setWordCount(words);

          // Tự động cập nhật bài bình giải AI vào Sổ tay khách offline
          try {
            const updatePayload = {
              id: savedChartId || activeChartId || undefined,
              hoTen: cleanData.hoTen.trim(),
              tag: chartTag === 'vip_offline' ? 'vip_offline' : 'offline',
              notes: clientNotes.trim() || undefined,
              duongSoData: cleanData,
              lasoData: calculated,
              readingHtml: json.reading,
            };
            await fetch('/api/admin/offline-charts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
              body: JSON.stringify(updatePayload),
            });
            fetchOfflineCharts();
          } catch (e) {
            console.warn('Lỗi tự động cập nhật bài bình giải vào Sổ tay:', e);
          }
        } else {
          setReadingError(json.error || 'Không nhận được bài luận giải.');
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        setReadingError(errJson.error || `HTTP ${res.status}`);
      }
    } catch (e: any) {
      setReadingError(e.message || 'Lỗi kết nối tới máy chủ');
    } finally {
      setIsLoadingReading(false);
    }
  };

  // Hỏi đáp trực tiếp không giới hạn lượt (Admin mode)
  const handleAdminSendMessage = async (userQuestion: string) => {
    if (!laSo) return;
    setIsLoadingChat(true);

    try {
      const res = await fetch('/api/tuvi/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuestion,
          laSo,
          thongTinThem: laSo.duongSo.thongTinThem,
          chieuCao: laSo.duongSo.chieuCao,
          canNang: laSo.duongSo.canNang,
          chatHistory,
          model: testModel,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const updatedChat = [
          ...chatHistory,
          { q: userQuestion, a: json.answer || 'Không nhận được câu trả lời.' },
        ];
        setChatHistory(updatedChat);

        // Tự động lưu lịch sử hỏi đáp vào Sổ tay
        if (activeChartId) {
          const pin = localStorage.getItem('tuvi_admin_pin') || 'thayton2026';
          fetch('/api/admin/offline-charts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
            body: JSON.stringify({
              id: activeChartId,
              hoTen: formData.hoTen.trim(),
              duongSoData: formData,
              chatHistory: updatedChat,
            }),
          }).catch(() => {});
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        setChatHistory((prev) => [
          ...prev,
          { q: userQuestion, a: errJson.error || 'Lỗi kết nối Thầy Tôn', isError: true },
        ]);
      }
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        { q: userQuestion, a: `Lỗi: ${err.message}`, isError: true },
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // Lọc danh sách kho lá số khách offline
  const filteredOfflineCharts = offlineCharts.filter((c) => {
    const term = offlineSearch.toLowerCase().trim();
    if (!term) return true;
    return (
      c.hoTen.toLowerCase().includes(term) ||
      (c.notes && c.notes.toLowerCase().includes(term)) ||
      (c.duongSoData?.thongTinThem && c.duongSoData.thongTinThem.toLowerCase().includes(term)) ||
      String(c.duongSoData?.namDuong || '').includes(term)
    );
  });

  // Phân trang danh sách khách offline (mỗi trang 6-9 lá tùy chọn)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Tự động chuyển về trang 1 khi người dùng gõ từ khóa tìm kiếm
  useEffect(() => {
    setCurrentPage(1);
  }, [offlineSearch]);

  const totalItems = filteredOfflineCharts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedCharts = filteredOfflineCharts.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* KHỐI 1: KHO LÁ SỐ KHÁCH OFFLINE & SỔ TAY SỐ MỆNH */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-amber-400 font-serif flex items-center gap-2 flex-wrap">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>Sổ Tay Khách Offline Của Thầy Tôn</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono border border-amber-500/40">
                {offlineCharts.length} khách
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 flex items-center gap-1 font-sans font-normal">
                <Cloud className="w-3 h-3 text-sky-400" /> Cloud Sync
              </span>
              {autoSavedNotice && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-fade-in flex items-center gap-1 font-sans font-normal">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đã tự động lưu
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Lưu trữ hồ sơ khách hẹn offline, ảnh tướng mạo &amp; AI phân tích chuyên sâu trước khi xem trực tiếp.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleNewCustomer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Khách Offline Mới</span>
            </button>

            <button
              type="button"
              onClick={fetchOfflineCharts}
              disabled={isLoadingOffline}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Làm mới & Đồng bộ đám mây (Supabase)"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingOffline ? 'animate-spin text-amber-400' : ''}`} />
              <span className="hidden sm:inline">Đồng bộ</span>
            </button>
          </div>
        </div>

        {/* Thanh tìm kiếm & Trạng thái tự động lưu */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={offlineSearch}
              onChange={(e) => setOfflineSearch(e.target.value)}
              placeholder="Tìm theo tên khách, năm sinh, ghi chú..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950/70 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="text-xs text-emerald-400/90 flex items-center gap-1.5 bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tự động lưu vào sổ tay khi chạy An sao &amp; Luận giải</span>
          </div>
        </div>

        {/* Danh sách thẻ lá số trong kho */}
        {filteredOfflineCharts.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs italic bg-slate-950/40 rounded-xl border border-slate-800">
            {offlineSearch ? 'Không tìm thấy hồ sơ phù hợp từ khóa.' : 'Chưa có hồ sơ khách nào trong sổ tay. Bấm "+ Khách Offline Mới" hoặc điền thông tin bên dưới để tạo lá số.'}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {paginatedCharts.map((item) => {
                const isSelected = activeChartId === item.id;
                const ds = item.duongSoData || ({} as any);

                return (
                  <div
                    key={item.id}
                    onClick={() => loadChartItem(item)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer relative group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/70 shadow-md shadow-amber-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs sm:text-sm text-slate-100 group-hover:text-amber-300 transition">
                            {item.hoTen}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                              item.tag === 'vip_offline'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {item.tag === 'vip_offline' ? '⭐ VIP Offline' : 'Khách Offline'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteChart(item.id, item.hoTen, e)}
                          className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/15 transition border border-transparent hover:border-red-500/30 shrink-0"
                          title="Xóa hồ sơ này khỏi sổ tay"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                        <span>{ds.gioiTinh}</span>
                        <span>•</span>
                        <span>
                          Sinh {ds.ngayDuong}/{ds.thangDuong}/{ds.namDuong} (
                          {GIO_ARR[ds.gioSinhVal]?.label || ds.gioSinhVal || '—'})
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2 italic bg-slate-900/50 px-2 py-0.5 rounded border border-slate-800/80">
                          📌 {item.notes}
                        </p>
                      )}
                    </div>

                    {/* Huy hiệu tính năng */}
                    <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800/60 flex-wrap">
                      {ds.anhMat && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                          <ImageIcon className="w-2.5 h-2.5" />
                          <span>Diện tướng</span>
                        </span>
                      )}
                      {ds.anhTay && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                          <ImageIcon className="w-2.5 h-2.5" />
                          <span>Chỉ tay</span>
                        </span>
                      )}
                      {item.readingHtml ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Đã có bài luận</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Chưa luận giải</span>
                      )}
                      <span className="text-[10px] text-amber-400 ml-auto font-medium">
                        {isSelected ? 'Đang mở ▾' : 'Bấm để mở'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Thanh điều hướng phân trang (Pagination) */}
            {totalItems > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
                {/* Thông tin số lượng & Chọn số lá / trang */}
                <div className="flex items-center gap-3 text-slate-400 flex-wrap">
                  <span>
                    Hiển thị <b className="text-slate-200">{(safeCurrentPage - 1) * itemsPerPage + 1} - {Math.min(safeCurrentPage * itemsPerPage, totalItems)}</b> trong <b className="text-amber-400">{totalItems}</b> lá số
                  </span>
                  <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
                    <span className="text-[11px] text-slate-500">Mỗi trang:</span>
                    {[6, 9, 12].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setItemsPerPage(num);
                          setCurrentPage(1);
                        }}
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold transition ${
                          itemsPerPage === num
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Các nút chuyển trang */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safeCurrentPage === 1}
                      className="px-2.5 py-1 rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 font-medium"
                      title="Trang trước"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Trước</span>
                    </button>

                    <div className="flex items-center gap-1 px-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                            safeCurrentPage === page
                              ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safeCurrentPage === totalPages}
                      className="px-2.5 py-1 rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 font-medium"
                      title="Trang sau"
                    >
                      <span className="hidden sm:inline">Sau</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* KHỐI 2: FORM NHẬP LIỆU, TẢI ẢNH VÀ AN SAO */}
      <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-800 flex-wrap">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-amber-400 font-serif flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Studio An Sao &amp; Kiểm Thử Luận Giải Đa Phương Thức</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Hỗ trợ tải ảnh Diện tướng, Chỉ tay và kết hợp cùng mô hình Gemini 3.1 Pro (Bypass thanh toán).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPromptDebug(!showPromptDebug)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{showPromptDebug ? 'Ẩn Raw Prompt' : 'Xem Raw Prompt'}</span>
            </button>
          </div>
        </div>

        {/* 1. Hàng thông tin cơ bản: Tên, Giới tính, Ngày sinh, Giờ sinh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">
              Họ tên đương số: <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.hoTen}
              onChange={(e) => setFormData({ ...formData, hoTen: e.target.value })}
              placeholder="VD: Trần Văn Bình"
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Giới tính:</label>
            <select
              value={formData.gioiTinh}
              onChange={(e) => setFormData({ ...formData, gioiTinh: e.target.value as any })}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Ngày / Tháng / Năm sinh (Dương lịch):</label>
            <div className="flex gap-1">
              <input
                type="number"
                value={formData.ngayDuong}
                onChange={(e) => setFormData({ ...formData, ngayDuong: Number(e.target.value) })}
                className="w-14 px-2 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-center text-slate-100"
                placeholder="Ngày"
              />
              <input
                type="number"
                value={formData.thangDuong}
                onChange={(e) => setFormData({ ...formData, thangDuong: Number(e.target.value) })}
                className="w-14 px-2 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-center text-slate-100"
                placeholder="Tháng"
              />
              <input
                type="number"
                value={formData.namDuong}
                onChange={(e) => setFormData({ ...formData, namDuong: Number(e.target.value) })}
                className="w-full px-2 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-center text-slate-100"
                placeholder="Năm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Giờ sinh:</label>
            <select
              value={formData.gioSinhVal}
              onChange={(e) => setFormData({ ...formData, gioSinhVal: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-amber-400 transition"
            >
              {Object.entries(GIO_ARR).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Upload Ảnh Diện Tướng & Chỉ Tay (Tính năng mới) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
          {/* Upload Ảnh Khuôn Mặt */}
          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
              <span>📸 Ảnh Khuôn Mặt (Diện Tướng)</span>
              <span className="text-[10px] text-slate-400 font-normal">Hỗ trợ JPG, PNG, HEIC (iPhone)</span>
            </label>

            {isConvertingMat ? (
              <div className="rounded-xl border border-amber-500/40 h-28 bg-slate-900/80 flex flex-col items-center justify-center p-2 text-center">
                <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-1" />
                <span className="text-xs text-amber-300">Đang nén ảnh iPhone...</span>
              </div>
            ) : formData.anhMat ? (
              <div className="relative rounded-xl overflow-hidden border border-amber-500/50 h-28 bg-slate-900 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.anhMat}
                  alt="Ảnh diện tướng"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, anhMat: undefined })}
                  className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition"
                  title="Xóa ảnh này"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-28 border border-dashed border-slate-700 hover:border-amber-400 rounded-xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition group">
                <ImageIcon className="w-6 h-6 text-slate-500 group-hover:text-amber-400 transition mb-1" />
                <span className="text-xs text-slate-300 group-hover:text-slate-100 font-medium">
                  Tải ảnh mặt đương số
                </span>
                <span className="text-[10px] text-slate-500">Chụp rõ ngũ quan, trán, cằm</span>
                <input
                  type="file"
                  accept="image/*,.heic,.heif,image/heic,image/heif"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'anhMat', setIsConvertingMat)}
                />
              </label>
            )}
          </div>

          {/* Upload Ảnh Chỉ Tay */}
          <div>
            <label className="block text-xs text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
              <span>✋ Ảnh Bàn Tay (Thủ Tướng)</span>
              <span className="text-[10px] text-amber-400 font-normal">Nam trái, Nữ phải</span>
            </label>

            {isConvertingTay ? (
              <div className="rounded-xl border border-amber-500/40 h-28 bg-slate-900/80 flex flex-col items-center justify-center p-2 text-center">
                <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-1" />
                <span className="text-xs text-amber-300">Đang nén ảnh iPhone...</span>
              </div>
            ) : formData.anhTay ? (
              <div className="relative rounded-xl overflow-hidden border border-amber-500/50 h-28 bg-slate-900 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.anhTay}
                  alt="Ảnh chỉ tay"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, anhTay: undefined })}
                  className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-full p-1 shadow-md transition"
                  title="Xóa ảnh này"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-28 border border-dashed border-slate-700 hover:border-amber-400 rounded-xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition group">
                <ImageIcon className="w-6 h-6 text-slate-500 group-hover:text-amber-400 transition mb-1" />
                <span className="text-xs text-slate-300 group-hover:text-slate-100 font-medium">
                  Tải ảnh lòng bàn tay
                </span>
                <span className="text-[10px] text-slate-500">Chụp rõ các đường chỉ chính</span>
                <input
                  type="file"
                  accept="image/*,.heic,.heif,image/heic,image/heif"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, 'anhTay', setIsConvertingTay)}
                />
              </label>
            )}
          </div>
        </div>

        {/* 3. Chiều cao, Cân nặng & Ghi chú của khách */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Chiều cao (cm):</label>
            <input
              type="number"
              value={formData.chieuCao || ''}
              onChange={(e) => setFormData({ ...formData, chieuCao: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="VD: 172"
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Cân nặng (kg):</label>
            <input
              type="number"
              value={formData.canNang || ''}
              onChange={(e) => setFormData({ ...formData, canNang: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="VD: 68"
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Phân loại hồ sơ:</label>
            <select
              value={chartTag}
              onChange={(e) => setChartTag(e.target.value as OfflineChartTag)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-slate-100"
            >
              <option value="offline">Khách Hẹn Offline</option>
              <option value="vip_offline">Khách VIP Offline</option>
            </select>
          </div>
        </div>

        {/* 4. Thông tin hoàn cảnh khách & Ghi chú riêng của Thầy Tôn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">
              Bối cảnh đương số / Câu hỏi quan tâm (Gửi AI phân tích):
            </label>
            <textarea
              rows={2}
              value={formData.thongTinThem || ''}
              onChange={(e) => setFormData({ ...formData, thongTinThem: e.target.value })}
              placeholder="VD: Đang kinh doanh bất động sản, muốn hỏi thời điểm bán đất & định hướng mở rộng cuối năm..."
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-700 rounded-lg text-xs text-slate-100 resize-none focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div>
            <label className="block text-xs text-amber-400 font-medium mb-1">
              📌 Ghi chú riêng của Thầy Tôn (Lưu sổ tay cá nhân):
            </label>
            <textarea
              rows={2}
              value={clientNotes}
              onChange={(e) => setClientNotes(e.target.value)}
              placeholder="VD: Khách hẹn 15h thứ 7 tại Highland Cafe, tính cách thẳng thắn, cần lưu ý sao Hóa Kỵ cung Phu thê..."
              className="w-full px-3 py-2 bg-slate-950/70 border border-amber-500/40 rounded-lg text-xs text-slate-100 resize-none focus:outline-none focus:border-amber-400 transition"
            />
          </div>
        </div>

        {/* 5. Tùy chọn Gói, Model & Nút Hành Động */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold text-slate-300">Gói kiểm thử:</span>
            <div className="flex rounded-lg overflow-hidden border border-slate-700 p-0.5 bg-slate-900">
              <button
                type="button"
                onClick={() => {
                  setTestTier('free');
                  setTestModel('gemini-2.5-flash');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  testTier === 'free'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📜 Bản Free (Flash)
              </button>
              <button
                type="button"
                onClick={() => {
                  setTestTier('pro');
                  setTestModel('gemini-3.1-pro-preview');
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  testTier === 'pro'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                👑 Bản Pro VIP (3.1 Pro)
              </button>
            </div>

            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
              <span className="text-xs text-slate-400">Model:</span>
              <select
                value={testModel}
                onChange={(e) => setTestModel(e.target.value)}
                className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-200"
              >
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Mạnh nhất)</option>
                <option value="gemini-2.5-flash">gemini-2.5-flash (Nhanh &amp; chuẩn)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Nút cập nhật sổ tay thủ công */}
            <button
              type="button"
              onClick={handleSaveToOfflineCharts}
              disabled={isSavingChart || !formData.hoTen}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 hover:text-amber-300 text-slate-300 font-semibold text-xs sm:text-sm rounded-xl border border-slate-700 transition disabled:opacity-50"
              title="Hệ thống tự động lưu khi an sao, bấm nút này nếu muốn cập nhật lại ghi chú hoặc hồ sơ"
            >
              <Save className={`w-4 h-4 text-amber-400 ${isSavingChart ? 'animate-spin' : ''}`} />
              <span>{isSavingChart ? 'Đang lưu...' : 'Lưu Thay Đổi'}</span>
            </button>

            {/* Nút Chạy An Sao & Luận Giải (Tự Động Lưu) */}
            <button
              type="button"
              onClick={handleExecuteTest}
              disabled={isLoadingReading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50"
              title="Tự động lưu vào sổ tay khách offline và gọi AI bình giải"
            >
              {isLoadingReading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang Phân Tích &amp; Tự Động Lưu...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>An Sao, Bình Giải &amp; Tự Động Lưu</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Khung Raw Prompt Debug */}
        {showPromptDebug && (
          <div className="mt-4 p-4 rounded-xl bg-black/80 border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto max-h-60 whitespace-pre-wrap">
            <div className="text-amber-400 font-bold mb-1">Dữ liệu Prompt gửi lên Gemini:</div>
            {rawPromptText || 'Chưa chạy an sao. Bấm "Chạy An Sao & Bình Giải Ngay" để xem prompt.'}
          </div>
        )}
      </div>

      {/* Thông tin Benchmark tốc độ & Độ dài bài luận */}
      {(generationTimeMs !== null || wordCount !== null) && (
        <div className="flex items-center gap-4 flex-wrap p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
          {generationTimeMs !== null && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Thời gian sinh bài luận: <strong className="text-emerald-300 font-bold">{(generationTimeMs / 1000).toFixed(2)} giây</strong></span>
            </div>
          )}
          {wordCount !== null && (
            <div className="flex items-center gap-1.5 pl-4 border-l border-slate-700">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Độ dài bài bình: <strong className="text-sky-300 font-bold">{wordCount.toLocaleString()} từ</strong></span>
            </div>
          )}
          <div className="flex items-center gap-1.5 pl-4 border-l border-slate-700">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Mô hình: <strong className="text-amber-300 font-bold">{testModel}</strong> ({testTier === 'pro' ? 'Bản Pro' : 'Bản Free'})</span>
          </div>
        </div>
      )}

      {/* Kết quả An Sao & Bàn Cờ Lá Số */}
      {laSo && (
        <div className="space-y-6">
          <LaSoBanCo laSo={laSo} onReset={() => setLaSo(null)} />

          {/* Thanh công cụ lưu nhanh khi đã có kết quả */}
          <div className="max-w-[760px] mx-auto flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-amber-500/40 text-xs flex-wrap gap-2">
            <div className="flex items-center gap-2 text-slate-200">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>
                Đang xem lá số: <strong className="text-amber-300">{formData.hoTen}</strong>
                {formData.anhMat && ' • Đã kèm ảnh diện tướng'}
                {formData.anhTay && ' • Đã kèm ảnh chỉ tay'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSaveToOfflineCharts}
              disabled={isSavingChart}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg transition"
            >
              <Save className="w-3.5 h-3.5 fill-slate-950" />
              <span>{activeChartId ? 'Cập Nhật Vào Sổ Tay' : 'Lưu Vào Sổ Tay Khách'}</span>
            </button>
          </div>

          {/* Bài bình giải AI */}
          <LuanGiaiAI
            readingHtml={readingHtml}
            isLoading={isLoadingReading}
            error={readingError}
            tier={testTier}
          />

          {/* Khung Hỏi Đáp Thầy Tôn (Admin mode: Unlimited questions) */}
          <div className="relative">
            <div className="mb-2 flex items-center justify-between text-xs text-amber-400/90 font-semibold px-1">
              <span>🛡️ Chế độ Admin: Hỏi đáp trực tiếp không giới hạn lượt (Bypass 100% thanh toán)</span>
              <span>Đã hỏi: {chatHistory.length} câu</span>
            </div>
            <ChatThayTon
              chatHistory={chatHistory}
              onSendMessage={handleAdminSendMessage}
              isLoading={isLoadingChat}
              tier={testTier}
              questionsAllowed={999}
              onUnlockQuestions={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}
