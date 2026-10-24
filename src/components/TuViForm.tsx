'use client';

import React, { useState, ChangeEvent } from 'react';
import { DuLieuDuongSo, GioiTinh, ServiceTier } from '@/types/tuvi';
import { GIO_ARR } from '@/lib/tuvi/constants';
import { Sparkles, Upload, User, Calendar, Clock, Image as ImageIcon, X, ShieldCheck, Crown, Gem, PhoneCall, BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface TuViFormProps {
  onSubmit: (data: DuLieuDuongSo, tier: ServiceTier) => void;
  isLoading: boolean;
  onOpenSavedCharts?: () => void;
  onRequireAuth?: (action: () => void, notice: string) => void;
  initialData?: DuLieuDuongSo | null;
  onCancelEdit?: () => void;
}

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
      // Xuất ra JPEG định dạng nén nhẹ, siêu tối ưu cho AI
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}

export default function TuViForm({ onSubmit, isLoading, onOpenSavedCharts, onRequireAuth, initialData, onCancelEdit }: TuViFormProps) {
  const { user } = useAuth();
  const { t, tHour } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [hoTen, setHoTen] = useState(initialData?.hoTen || '');
  const [gioiTinh, setGioiTinh] = useState<GioiTinh>(initialData?.gioiTinh || 'Nam');
  const [ngayDuong, setNgayDuong] = useState(initialData?.ngayDuong ?? 15);
  const [thangDuong, setThangDuong] = useState(initialData?.thangDuong ?? 8);
  const [namDuong, setNamDuong] = useState(initialData?.namDuong ?? 1995);
  const [gioSinhVal, setGioSinhVal] = useState(initialData?.gioSinhVal || '2'); // Dần (03h-05h)
  const [namXem, setNamXem] = useState<number>(initialData?.namXem || currentYear);
  const [thongTinThem, setThongTinThem] = useState(initialData?.thongTinThem || '');
  const [chieuCao, setChieuCao] = useState<number | undefined>(initialData?.chieuCao);
  const [canNang, setCanNang] = useState<number | undefined>(initialData?.canNang);

  const [anhMatBase64, setAnhMatBase64] = useState<string | undefined>(initialData?.anhMat);
  const [anhTayBase64, setAnhTayBase64] = useState<string | undefined>(initialData?.anhTay);
  const [isConvertingMat, setIsConvertingMat] = useState(false);
  const [isConvertingTay, setIsConvertingTay] = useState(false);

  // Lựa chọn gói dịch vụ
  const [selectedTier, setSelectedTier] = useState<ServiceTier>(initialData?.tier || 'free');

  React.useEffect(() => {
    if (initialData) {
      setHoTen(initialData.hoTen || '');
      setGioiTinh(initialData.gioiTinh || 'Nam');
      setNgayDuong(initialData.ngayDuong ?? 15);
      setThangDuong(initialData.thangDuong ?? 8);
      setNamDuong(initialData.namDuong ?? 1995);
      setGioSinhVal(initialData.gioSinhVal || '2');
      setNamXem(initialData.namXem || currentYear);
      setThongTinThem(initialData.thongTinThem || '');
      setChieuCao(initialData.chieuCao);
      setCanNang(initialData.canNang);
      setAnhMatBase64(initialData.anhMat);
      setAnhTayBase64(initialData.anhTay);
      if (initialData.tier) setSelectedTier(initialData.tier);
    }
  }, [initialData, currentYear]);

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    setter: (val: string | undefined) => void,
    setConverting: (val: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setConverting(true);
    try {
      let targetBlob: Blob = file;

      // Bước 1: Kiểm tra định dạng HEIC/HEIF (từ iPhone/iPad)
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
        // Bước 2: Thử xem trình duyệt có hỗ trợ giải mã trực tiếp không (Safari trên iOS/macOS hỗ trợ native hardware)
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

        // Bước 3: Nếu trình duyệt không giải mã native được (như Chrome trên Windows/Android), dùng thư viện heic-to hiện đại (libheif 1.22+)
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

      // Tự động nén ảnh về kích thước tối ưu cho AI (max 800px, quality 0.65, ~60KB-80KB)
      const compressed = await compressImage(targetBlob, 800, 0.65);
      setter(compressed);
    } catch (err: unknown) {
      console.error('Lỗi xử lý ảnh:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      alert(
        `Không thể xử lý ảnh này (${errMsg}).\n\nMẹo: Bạn có thể chụp màn hình bức ảnh (screenshot) hoặc chụp trực tiếp bằng camera rồi tải lên lại nhé!`
      );
    } finally {
      setConverting(false);
      e.target.value = '';
    }
  };

  const onSubmitRef = React.useRef(onSubmit);
  onSubmitRef.current = onSubmit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hoTen.trim()) {
      alert('Vui lòng nhập họ và tên đương số!');
      return;
    }

    const payload: DuLieuDuongSo = {
      hoTen: hoTen.trim(),
      gioiTinh,
      ngayDuong: Number(ngayDuong),
      thangDuong: Number(thangDuong),
      namDuong: Number(namDuong),
      gioSinhVal,
      namXem: Number(namXem) || currentYear,
      thongTinThem: thongTinThem.trim() || undefined,
      chieuCao: chieuCao ? Number(chieuCao) : undefined,
      canNang: canNang ? Number(canNang) : undefined,
      anhMat: anhMatBase64,
      anhTay: anhTayBase64,
      tier: selectedTier,
    };

    if (!user && onRequireAuth) {
      const notice =
        selectedTier === 'expert'
          ? 'Quý khách vui lòng đăng nhập hoặc tạo tài khoản (chỉ 5 giây) để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán Bản Chuyên Gia Expert (269.000đ).'
          : selectedTier === 'pro'
          ? 'Quý khách vui lòng đăng nhập hoặc tạo tài khoản (chỉ 5 giây) để hệ thống lưu giữ lá số vào sổ tay và mở mã QR thanh toán Bản Chuyên Sâu Pro.'
          : 'Quý khách vui lòng đăng nhập hoặc tạo tài khoản (chỉ 5 giây) để hệ thống lập lá số và tự động lưu trữ vào Sổ Tay Số Mệnh của quý khách.';
      onRequireAuth(() => {
        onSubmitRef.current(payload, selectedTier);
      }, notice);
      return;
    }

    onSubmit(payload, selectedTier);
  };

  return (
    <div
      id="lap-la-so"
      className="w-full max-w-xl mx-auto backdrop-blur-xl bg-slate-900/85 border border-amber-500/35 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100 scroll-mt-6"
    >
      <div className="mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/35 text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{t('form.heroBadge', 'Tử Vi Cổ Truyền 108 Sao & Nhân Tướng Học Thực Chứng')}</span>
          </span>
          {onOpenSavedCharts ? (
            <button
              type="button"
              onClick={onOpenSavedCharts}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold transition cursor-pointer shadow-sm"
              title="Xem danh sách các lá số đã lưu"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('nav.savedCharts', 'Sổ Tay Số Mệnh')}</span>
            </button>
          ) : null}
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-amber-400 font-serif leading-snug">
          Lập Lá Số Tử Vi Miễn Phí và Bình Giải Trọn Đời Cùng Thầy Tôn
        </h1>
        <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed">
          {t(
            'form.desc',
            'Lập lá số bàn cờ 108 tinh đẩu chuẩn xác theo giờ sinh • Tặng ngay bài bình giải Khởi Nguyên miễn phí • Kết hợp độc quyền Diện Tướng Khuôn Mặt & Thủ Tướng Chỉ Tay từ Thầy Tôn'
          )}
        </p>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-3 pt-2.5 border-t border-slate-800/70 text-[11px] sm:text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-2 py-1.5 text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{t('form.trustFree', 'An Sao & Luận Giải 0đ')}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 rounded-lg px-2 py-1.5 text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{t('form.trustFacePalm', 'Xem Mặt & Chỉ Tay')}</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-500/10 border border-blue-500/25 rounded-lg px-2 py-1.5 text-blue-300">
            <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{t('form.trustPdf', 'Lưu Sổ & Tải PDF')}</span>
          </div>
        </div>
      </div>

      {initialData && (
        <div className="mb-4 p-3.5 bg-amber-500/15 border border-amber-500/40 rounded-xl flex items-center justify-between gap-2 animate-in fade-in">
          <div className="text-xs sm:text-sm text-amber-200 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Đang chỉnh sửa lá số của <strong>{initialData.hoTen}</strong> (Bạn có thể đổi năm xem để an lại lá số &amp; xem nguyệt vận mới)
            </span>
          </div>
          {onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-xs text-slate-400 hover:text-white underline cursor-pointer shrink-0 font-medium"
            >
              Hủy sửa
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4">
        {/* Họ tên */}
        <div>
          <label className="block text-sm sm:text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
            <User className="w-4 h-4 sm:w-3.5 sm:h-3.5 inline mr-1 text-amber-400" />
            {t('form.fullName', 'Họ tên đương số')} <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            placeholder={t('form.fullNamePlaceholder', 'Ví dụ: Trần Huy Tôn...')}
            className="w-full px-3.5 py-3 sm:py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
          />
        </div>

        {/* Giới tính & Giờ sinh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-sm sm:text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
              {t('form.gender', 'Giới tính')}
            </label>
            <select
              value={gioiTinh}
              onChange={(e) => setGioiTinh(e.target.value as GioiTinh)}
              className="w-full px-3.5 py-3 sm:py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-400 transition"
            >
              <option value="Nam">{t('form.male', 'Nam')}</option>
              <option value="Nữ">{t('form.female', 'Nữ')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm sm:text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
              <Clock className="w-4 h-4 sm:w-3.5 sm:h-3.5 inline mr-1 text-amber-400" />
              {t('form.birthHour', 'Giờ sinh (Chi)')}
            </label>
            <select
              value={gioSinhVal}
              onChange={(e) => setGioSinhVal(e.target.value)}
              className="w-full px-3.5 py-3 sm:py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-400 transition"
            >
              {Object.entries(GIO_ARR).map(([key, val]) => (
                <option key={key} value={key}>
                  {tHour(key, val.label)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ngày - Tháng - Năm sinh Dương Lịch */}
        <div>
          <label className="block text-sm sm:text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
            <Calendar className="w-4 h-4 sm:w-3.5 sm:h-3.5 inline mr-1 text-amber-400" />
            {t('form.calendar', 'Ngày tháng năm sinh (Dương lịch)')} <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div>
              <input
                type="number"
                required
                min={1}
                max={31}
                value={ngayDuong}
                onChange={(e) => setNgayDuong(Number(e.target.value))}
                placeholder={t('form.day', 'Ngày')}
                className="w-full px-3 py-3 sm:py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-base sm:text-sm text-center focus:outline-none focus:border-amber-400 transition"
              />
              <span className="block text-xs sm:text-[11px] text-slate-300 font-medium text-center mt-1">
                {t('form.day', 'Ngày')}
              </span>
            </div>
            <div>
              <input
                type="number"
                required
                min={1}
                max={12}
                value={thangDuong}
                onChange={(e) => setThangDuong(Number(e.target.value))}
                placeholder={t('form.month', 'Tháng')}
                className="w-full px-3 py-3 sm:py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-base sm:text-sm text-center focus:outline-none focus:border-amber-400 transition"
              />
              <span className="block text-xs sm:text-[11px] text-slate-300 font-medium text-center mt-1">
                {t('form.month', 'Tháng')}
              </span>
            </div>
            <div>
              <input
                type="number"
                required
                min={1900}
                max={2100}
                value={namDuong}
                onChange={(e) => setNamDuong(Number(e.target.value))}
                placeholder={t('form.year', 'Năm')}
                className="w-full px-3 py-3 sm:py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-base sm:text-sm text-center focus:outline-none focus:border-amber-400 transition"
              />
              <span className="block text-xs sm:text-[11px] text-slate-300 font-medium text-center mt-1">
                {t('form.year', 'Năm')}
              </span>
            </div>
          </div>
        </div>

        {/* Năm xem hạn (Mặc định: Năm hiện tại) */}
        <div>
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
            <label className="block text-sm sm:text-xs uppercase tracking-wider text-slate-300 font-semibold">
              <Calendar className="w-4 h-4 sm:w-3.5 sm:h-3.5 inline mr-1 text-amber-400" />
              {t('form.viewYear', 'Năm xem hạn (Dương lịch)')}
            </label>
            <span className="text-xs text-amber-400/90 font-medium">
              {t('form.viewYearDefault', `Mặc định năm ${currentYear}`)}
            </span>
          </div>
          <input
            type="number"
            min={1900}
            max={2100}
            value={namXem}
            onChange={(e) => setNamXem(Number(e.target.value))}
            placeholder={`VD: ${currentYear}`}
            className="w-full px-3.5 py-3 sm:py-2.5 bg-slate-950/60 border border-amber-500/50 rounded-lg text-amber-200 font-bold text-base sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
          />
          <p className="text-xs text-slate-400 mt-1">
            {t(
              'form.viewYearDesc',
              'Hệ thống sẽ an hệ sao lưu, đại vận, tiểu vận và bình giải 12 tháng nguyệt vận chuẩn xác theo năm này.'
            )}
          </p>
        </div>

        {/* Khối Thực Chứng & Tướng Pháp (Tùy chọn) */}
        <div className="pt-4 mt-4 border-t border-slate-700/60">
          <div className="flex items-center gap-1.5 mb-3 text-amber-400 font-semibold text-sm sm:text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            {t('form.physiqueTitle', 'Dữ liệu Thực Chứng & Tướng Pháp (Tùy chọn)')}
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-sm sm:text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                {t('form.moreInfo', 'Hoàn cảnh, Nghề nghiệp hiện tại...')}
              </label>
              <textarea
                rows={2}
                value={thongTinThem}
                onChange={(e) => setThongTinThem(e.target.value)}
                placeholder={t(
                  'form.moreInfoPlaceholder',
                  'Ví dụ: Đang làm kỹ sư IT, đã kết hôn, muốn hỏi sâu về đường làm ăn kinh doanh...'
                )}
                className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-400 transition resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm sm:text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                  {t('form.height', 'Chiều cao (cm)')}
                </label>
                <input
                  type="number"
                  min={50}
                  max={250}
                  value={chieuCao ?? ''}
                  onChange={(e) => setChieuCao(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder={t('form.heightPlaceholder', 'VD: 170')}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-400 transition"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                  {t('form.weight', 'Cân nặng (kg)')}
                </label>
                <input
                  type="number"
                  min={20}
                  max={200}
                  value={canNang ?? ''}
                  onChange={(e) => setCanNang(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder={t('form.weightPlaceholder', 'VD: 65')}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* Upload Ảnh Diện Tướng & Chỉ Tay */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Ảnh mặt */}
              <div>
                <label className="block text-sm sm:text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                  {t('form.uploadFace', 'Ảnh khuôn mặt (Diện tướng)')}
                </label>
                {isConvertingMat ? (
                  <div className="rounded-lg border border-amber-500/40 h-24 bg-slate-950/80 flex flex-col items-center justify-center p-2 text-center">
                    <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-1.5" />
                    <span className="text-xs text-amber-300">
                      {t('form.readingHeic', 'Đang đọc ảnh iPhone (HEIC)...')}
                    </span>
                  </div>
                ) : anhMatBase64 ? (
                  <div className="relative rounded-lg overflow-hidden border border-amber-500/40 h-24 bg-slate-950 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={anhMatBase64}
                      alt="Diện tướng"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setAnhMatBase64(undefined)}
                      className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-24 border border-dashed border-slate-700 hover:border-amber-400/60 rounded-lg cursor-pointer bg-slate-950/40 hover:bg-slate-950/60 transition group">
                    <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition mb-1" />
                    <span className="text-sm sm:text-xs text-slate-300 group-hover:text-slate-100 font-medium">
                      {t('form.selectFacePhoto', 'Chọn ảnh mặt rõ nét')}
                    </span>
                    <span className="text-xs sm:text-[10px] text-slate-400">JPG, PNG, HEIC (iPhone)</span>
                    <input
                      type="file"
                      accept="image/*,.heic,.heif,image/heic,image/heif"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setAnhMatBase64, setIsConvertingMat)}
                    />
                  </label>
                )}
              </div>

              {/* Ảnh bàn tay */}
              <div>
                <label className="block text-sm sm:text-xs uppercase tracking-wider text-slate-300 font-medium mb-1.5">
                  {t('form.uploadPalm', 'Ảnh bàn tay (Thủ tướng)')}{' '}
                  <span className="text-amber-400 font-semibold normal-case tracking-normal">
                    {t('form.palmHint', '(Nam trái, Nữ phải)')}
                  </span>
                </label>
                {isConvertingTay ? (
                  <div className="rounded-lg border border-amber-500/40 min-h-24 bg-slate-950/80 flex flex-col items-center justify-center p-2 text-center">
                    <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-1.5" />
                    <span className="text-xs text-amber-300">
                      {t('form.readingHeic', 'Đang đọc ảnh iPhone (HEIC)...')}
                    </span>
                  </div>
                ) : anhTayBase64 ? (
                  <div className="relative rounded-lg overflow-hidden border border-amber-500/40 min-h-24 bg-slate-950 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={anhTayBase64}
                      alt="Chỉ tay"
                      className="max-h-full max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setAnhTayBase64(undefined)}
                      className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full p-1 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center min-h-24 py-2 px-1 text-center border border-dashed border-slate-700 hover:border-amber-400/60 rounded-lg cursor-pointer bg-slate-950/40 hover:bg-slate-950/60 transition group">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition mb-1" />
                    <span className="text-sm sm:text-xs text-slate-300 group-hover:text-slate-100 font-medium">
                      {t('form.selectPalmPhoto', 'Chọn ảnh lòng bàn tay')}{' '}
                      <strong className="text-amber-400 font-bold">
                        ({gioiTinh === 'Nam' ? t('form.leftHand', 'Tay Trái') : t('form.rightHand', 'Tay Phải')})
                      </strong>
                    </span>
                    <span className="text-xs sm:text-[10px] text-amber-400 font-semibold">
                      {t('form.palmSubHint', 'Nam tay trái • Nữ tay phải')}
                    </span>
                    <span className="text-xs sm:text-[10px] text-slate-400">JPG, PNG, HEIC (iPhone)</span>
                    <input
                      type="file"
                      accept="image/*,.heic,.heif,image/heic,image/heif"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setAnhTayBase64, setIsConvertingTay)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* LỰA CHỌN GÓI BÌNH GIẢI */}
        <div className="pt-5 mt-5 border-t border-slate-700/80">
          <label className="block text-sm sm:text-base uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {t('form.packageTitle', 'Chọn Gói Bình Giải')} <span className="text-red-400">*</span>
            </span>
            <span className="text-xs sm:text-[11px] font-normal text-slate-400">
              {t('form.packageRequired', 'Bắt buộc chọn trước khi lập lá số')}
            </span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Gói Cơ Bản (Miễn Phí) */}
            <div
              onClick={() => setSelectedTier('free')}
              className={`relative p-4 sm:p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                selectedTier === 'free'
                  ? 'bg-slate-800/95 border-emerald-400 ring-2 ring-emerald-400 shadow-md shadow-emerald-500/15'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs sm:text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow tracking-wider">
                {t('form.freeBadge', '🎁 Trải Nghiệm Miễn Phí')}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base text-slate-100 flex items-center gap-1.5 font-serif">
                    <span>{t('form.freeTitle', '📜 Bản Khởi Nguyên (Miễn Phí)')}</span>
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {t('form.freePrice', '0 VNĐ')}
                  </span>
                </div>
                <p className="text-sm sm:text-xs text-slate-300 leading-relaxed">
                  {t(
                    'form.freeDesc',
                    'Tặng miễn phí lá số 108 sao & bài bình giải Khởi Nguyên (~1.000 từ): Giải mã cốt cách Bản Mệnh, Tam Hợp Mệnh - Tài - Quan, Đại Vận 10 năm & Tiểu Vận năm xem.'
                  )}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-xs text-emerald-300/90 font-medium flex items-center justify-between">
                <span>{t('form.freeQnA', '✓ An sao & Bình giải 0đ • Hỏi thêm: 49k/2 câu')}</span>
              </div>
            </div>

            {/* Gói Chuyên Sâu (Bản Pro) */}
            <div
              onClick={() => setSelectedTier('pro')}
              className={`relative p-4 sm:p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                selectedTier === 'pro'
                  ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-400 ring-2 ring-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/40 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-red-600 to-amber-600 text-white text-xs sm:text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow tracking-wider">
                {t('form.proBadge', '🔥 Khuyên Dùng • Phổ Biến Nhất')}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-base text-amber-300 flex items-center gap-1.5 font-serif">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>{t('form.proTitle', 'Bản Chuyên Sâu VIP Pro')}</span>
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {t('form.proPrice', '119.000 VNĐ')}
                  </span>
                </div>
                <p className="text-sm sm:text-xs text-slate-200 leading-relaxed">
                  {t(
                    'form.proDesc',
                    'Đại Pháp Bí Truyền Chuyên Sâu (~2.500 từ, chi tiết gấp 2,5 lần). Mổ xẻ Tứ Trụ (Mệnh - Thân - Tài - Quan - Phu Thê), kết hợp soi Ảnh Khuôn Mặt & Chỉ Tay thực tế, Đại Vận 10 năm & Vận khí 4 Mùa.'
                  )}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-xs text-amber-400 font-medium flex items-center justify-between">
                <span>{t('form.proQnA', '🎁 Tặng kèm 02 câu hỏi VIP (Mua thêm: 99k/2 câu)')}</span>
              </div>
            </div>

            {/* Gói Chuyên Gia (Bản Expert - Gemini 4 Argon) */}
            <div
              onClick={() => setSelectedTier('expert')}
              className={`sm:col-span-2 relative p-4 sm:p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                selectedTier === 'expert'
                  ? 'bg-gradient-to-br from-purple-950/60 via-indigo-950/50 to-slate-900 border-purple-400 ring-2 ring-purple-400 shadow-lg shadow-purple-500/25'
                  : 'bg-slate-950/70 border-purple-500/30 hover:border-purple-400/60 opacity-90 hover:opacity-100'
              }`}
            >
              <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 text-white text-xs sm:text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow tracking-wider">
                {t('form.expertBadge', '💎 Đỉnh Cao Mệnh Lý • Luận Trọn Bộ 12 Cung')}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                  <span className="font-bold text-base text-purple-300 flex items-center gap-1.5 font-serif">
                    <Gem className="w-4 h-4 text-purple-400" />
                    <span>{t('form.expertTitle', 'Bản Chuyên Gia Đại Tông Sư (Expert)')}</span>
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/40">
                    {t('form.expertPrice', '269.000 VNĐ')}
                  </span>
                </div>
                <p className="text-sm sm:text-xs text-slate-200 leading-relaxed">
                  {t(
                    'form.expertDesc',
                    'Tuyệt Học Mệnh Lý Toàn Diện Nhất (~4.500 - 5.000 từ, dài gấp đôi Bản Pro). Luận giải chuyên sâu KHÔNG BỎ SÓT bất kỳ cung nào trong đủ 12 Cung + Cung Thân, đối chiếu Diện tướng/Chỉ tay chuyên gia, Đại Vận 10 năm & Bản đồ Lưu Nguyệt chi tiết từng tháng (Tháng 1 - 12 Âm lịch).'
                  )}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-purple-900/50 text-xs text-purple-300 font-medium flex items-center justify-between flex-wrap gap-1">
                <span>{t('form.expertQnA', '🎁 Tặng kèm 02 câu hỏi Chuyên Gia miễn phí (Thêm: 129k/2 câu)')}</span>
                <span className="text-[11px] text-amber-300/90 font-medium">
                  {t('form.expertUpgradeHint', '*Khách đang dùng Bản Pro nâng cấp chỉ 150.000đ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-6 py-4 sm:py-3.5 px-6 font-bold rounded-xl tracking-wider uppercase text-base sm:text-lg shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer ${
            selectedTier === 'expert'
              ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white shadow-purple-950/60'
              : selectedTier === 'pro'
              ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-amber-950/50'
              : 'bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white shadow-red-950/50'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>{t('form.btnLoading', 'Thầy Đang Quán Tưởng...')}</span>
            </>
          ) : initialData && selectedTier === (initialData.tier || 'free') ? (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Cập Nhật &amp; An Lại Lá Số (Năm {namXem})</span>
            </>
          ) : selectedTier === 'expert' ? (
            <>
              <Gem className="w-5 h-5" />
              <span>
                {initialData?.tier === 'pro'
                  ? t('form.btnUpgradeProToExpert', 'Thanh Toán & Nâng Cấp Bản Expert (150K)')
                  : t('form.btnSubmitExpert', 'Thanh Toán & Luận Giải Bản Expert (269K)')}
              </span>
            </>
          ) : selectedTier === 'pro' ? (
            <>
              <Crown className="w-5 h-5" />
              <span>{t('form.btnSubmitPro', 'Thanh Toán & Luận Giải Bản Pro (119K)')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>{t('form.btnSubmitFree', 'An Sao & Nhận Bình Giải Miễn Phí Ngay')}</span>
            </>
          )}
        </button>

        {/* Đặt lịch xem trực tiếp Online & Offline */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-sm sm:text-xs text-slate-400">
          <span className="text-slate-300 font-medium">
            {t('form.bookingTitle', 'Tư vấn CSKH hoặc Đặt lịch xem Online & Offline:')}
          </span>
          <div className="flex items-center gap-2 font-medium">
            <a
              href="tel:0935058688"
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition"
              title="Gọi điện đặt lịch xem Online & Offline"
            >
              <PhoneCall className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <strong className="font-bold">0935.058.688</strong>
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://zalo.me/0935058688"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
              title="Nhắn tin Zalo với Thầy Tôn"
            >
              <strong className="font-bold">{t('form.zaloThay', 'Zalo Thầy')}</strong>
            </a>
          </div>
        </div>
      </form>
    </div>
  );
}
