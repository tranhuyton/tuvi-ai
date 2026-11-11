'use client';

import React, { useState, ChangeEvent } from 'react';
import { DuLieuDuongSo, GioiTinh, ServiceTier } from '@/types/tuvi';
import { GIO_ARR, CAN_ARR, CHI_ARR } from '@/lib/tuvi/constants';
import { solar2Lunar, isValidSolarDate } from '@/lib/tuvi/lunar';
import { Sparkles, Upload, User, Calendar, Clock, Image as ImageIcon, X, ShieldCheck, Crown, Gem, PhoneCall, BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { ClientVoucherInfo } from '@/components/VoucherCountdownBanner';

interface TuViFormProps {
  onSubmit: (data: DuLieuDuongSo, tier: ServiceTier) => void;
  isLoading: boolean;
  onOpenSavedCharts?: () => void;
  onRequireAuth?: (action: () => void, notice: string) => void;
  initialData?: DuLieuDuongSo | null;
  onCancelEdit?: () => void;
  activeVoucher?: ClientVoucherInfo | null;
  variant?: 'default' | 'van-han';
  defaultTier?: ServiceTier;
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

export default function TuViForm({
  onSubmit,
  isLoading,
  onOpenSavedCharts,
  onRequireAuth,
  initialData,
  onCancelEdit,
  activeVoucher,
  variant = 'default',
  defaultTier,
}: TuViFormProps) {
  const { user } = useAuth();
  const { t, tHour, tCanChi } = useLanguage();
  const currentYear = new Date().getFullYear();
  const isVanHanLanding = variant === 'van-han';
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
  const [selectedTier, setSelectedTier] = useState<ServiceTier>(
    initialData?.tier || defaultTier || 'free'
  );

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

  const lunarPreview = React.useMemo(() => {
    const d = Number(ngayDuong);
    const m = Number(thangDuong);
    const y = Number(namDuong);
    if (!d || !m || !y || y < 1800 || y > 2200 || m < 1 || m > 12) {
      return { valid: false, error: 'Vui lòng nhập ngày, tháng, năm hợp lệ (1900 - 2100).' };
    }
    if (!isValidSolarDate(d, m, y)) {
      const maxDay = new Date(y, m, 0).getDate();
      return {
        valid: false,
        error: `Ngày ${d}/${m}/${y} Dương lịch không tồn tại (Tháng ${m}/${y} chỉ có ${maxDay} ngày).`,
      };
    }
    let nd = d;
    let td = m;
    let ny = y;
    const isLateTy = gioSinhVal === '0_23';
    if (isLateTy) {
      const dim = new Date(ny, td, 0).getDate();
      if (nd < dim) nd++;
      else {
        nd = 1;
        td++;
        if (td > 12) {
          td = 1;
          ny++;
        }
      }
    }
    const [ngayAm, thangAm, namAm, isLeap] = solar2Lunar(nd, td, ny, 7.0);
    const canIdx = (namAm + 6) % 10;
    const chiIdx = (namAm + 8) % 12;
    const namCanChi = `${CAN_ARR[canIdx]} ${CHI_ARR[chiIdx]}`;
    return {
      valid: true,
      ngayAm,
      thangAm,
      namAm,
      isLeap,
      namCanChi,
      isLateTy,
    };
  }, [ngayDuong, thangDuong, namDuong, gioSinhVal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hoTen.trim()) {
      alert('Vui lòng nhập họ và tên đương số!');
      return;
    }
    if (!lunarPreview.valid) {
      alert(lunarPreview.error || 'Ngày tháng năm sinh Dương lịch không hợp lệ!');
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
      className="w-full max-w-[920px] mx-auto relative overflow-hidden imperial-card backdrop-blur-2xl border border-amber-500/40 rounded-3xl p-5 sm:p-8 md:p-9 text-slate-100 scroll-mt-6 before:pointer-events-none before:absolute before:inset-x-12 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-amber-300/80 before:to-transparent"
    >
      {/* Hào quang tinh vân trang trí */}
      <div className="pointer-events-none absolute -top-28 -right-28 w-80 h-80 rounded-full bg-amber-500/12 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-28 w-80 h-80 rounded-full bg-purple-600/12 blur-3xl" />

      {/* 4 Hoa Văn Góc Cổ Truyền (Ornamental Corner Filigrees) */}
      <svg className="pointer-events-none absolute top-3 left-3 w-6 h-6 text-amber-400/45" viewBox="0 0 24 24" fill="none">
        <path d="M2 10V2H10M5 7V5H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className="pointer-events-none absolute top-3 right-3 w-6 h-6 text-amber-400/45" viewBox="0 0 24 24" fill="none">
        <path d="M22 10V2H14M19 7V5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 text-amber-400/45" viewBox="0 0 24 24" fill="none">
        <path d="M2 14V22H10M5 17V19H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 text-amber-400/45" viewBox="0 0 24 24" fill="none">
        <path d="M22 14V22H14M19 17V19H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* HERO HEADER & TINH BÀN BÁT QUÁI XOAY */}
      <div className="relative z-10 mb-6 pb-5 border-b border-amber-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-600/20 border border-amber-400/45 text-[11px] sm:text-xs font-extrabold text-amber-200 uppercase tracking-wider shadow-sm shadow-amber-500/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  {isVanHanLanding
                    ? 'Bước 1: Nhập Ngày Giờ Sinh & Năm Muốn Giải Mã'
                    : t('form.heroBadge', 'Tử Vi Cổ Truyền 108 Sao & Nhân Tướng Học Thực Chứng')}
                </span>
              </span>

              {onOpenSavedCharts ? (
                <button
                  type="button"
                  onClick={onOpenSavedCharts}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 hover:text-amber-100 border border-amber-400/45 text-xs font-bold transition cursor-pointer shadow-sm"
                  title="Xem danh sách các lá số đã lưu"
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('nav.savedCharts', 'Sổ Tay Số Mệnh')}</span>
                </button>
              ) : null}
            </div>

            {isVanHanLanding ? (
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-gold-gradient font-serif leading-snug drop-shadow-sm">
                {t('form.title', 'Nhập Thông Tin Đương Số Để Giải Mã 3 Tầng Vận Hạn')}
              </h2>
            ) : (
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide text-gold-gradient font-serif leading-snug drop-shadow-sm">
                {t('form.title', 'Lập Lá Số Tử Vi Miễn Phí và Bình Giải Trọn Đời Cùng Thầy Tôn')}
              </h1>
            )}

            <p className="text-xs sm:text-sm text-slate-200/95 mt-2 leading-relaxed max-w-2xl">
              {t(
                'form.desc',
                isVanHanLanding
                  ? 'Hệ thống tự động an 108+ chính phụ tinh theo giờ sinh, xác định chính xác tọa độ Tiểu Hạn • LN.Đại Hạn • Lưu Thái Tuế và mở khóa bài luận giải chuyên sâu.'
                  : 'Lập lá số bàn cờ 108 tinh đẩu chuẩn xác theo giờ sinh • Tặng ngay bài bình giải Khởi Nguyên miễn phí • Kết hợp độc quyền Diện Tướng Khuôn Mặt & Thủ Tướng Chỉ Tay từ Thầy Tôn'
              )}
            </p>
          </div>

          {/* Biểu tượng Tinh Bàn Bát Quái Xoay (Hiển thị nổi bật bên phải trên màn hình >= md) */}
          <div className="hidden md:flex items-center justify-center shrink-0 relative w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl" />
            <svg viewBox="0 0 100 100" className="w-24 h-24 text-amber-400/85 animate-celestial-spin">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="50" cy="50" r="39" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.7" />
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="50"
                  y1="4"
                  x2="50"
                  y2="11"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  transform={`rotate(${deg} 50 50)`}
                />
              ))}
              <polygon
                points="50,14 68,21 79,32 86,50 79,68 68,79 50,86 32,79 21,68 14,50 21,32 32,21"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.55"
              />
            </svg>
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-24 h-24 text-amber-300 animate-celestial-spin-reverse">
              <circle cx="50" cy="50" r="24" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" opacity="0.75" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 text-slate-950 flex items-center justify-center font-serif font-black text-lg shadow-lg shadow-amber-500/40 ring-2 ring-amber-200/70">
                ☯
              </div>
            </div>
          </div>
        </div>

        {/* Thanh Chỉ Số Tín Nhiệm (4 Trust Badges) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3.5 border-t border-slate-800/80 text-[11px] sm:text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-xl px-2.5 py-2 text-amber-200">
            <span className="text-amber-400 text-xs shrink-0">★</span>
            <span className="truncate">4.9/5 (15.420+ Lá Số)</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-2.5 py-2 text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              {t('form.trustFree', isVanHanLanding ? 'Đủ 3 Cung Vận Hạn' : 'An Sao & Luận Giải 0đ')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/25 rounded-xl px-2.5 py-2 text-purple-200">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">{t('form.trustFacePalm', 'Xem Mặt & Chỉ Tay')}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/25 rounded-xl px-2.5 py-2 text-blue-300">
            <BookOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="truncate">{t('form.trustPdf', 'Lưu Sổ & Tải PDF')}</span>
          </div>
        </div>
      </div>

      {initialData && (
        <div className="relative z-10 mb-5 p-3.5 bg-amber-500/15 border border-amber-500/45 rounded-2xl flex items-center justify-between gap-2 animate-in fade-in">
          <div className="text-xs sm:text-sm text-amber-200 font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {t('form.editingBanner', 'Đang chỉnh sửa lá số của')} <strong>{initialData.hoTen}</strong>
            </span>
          </div>
          {onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-xs text-slate-300 hover:text-white underline cursor-pointer shrink-0 font-semibold"
            >
              {t('form.cancelEdit', 'Hủy sửa')}
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
        {/* HÀNG 1: HỌ TÊN ĐƯƠNG SỐ & GIỚI TÍNH (NÚT CHUYỂN ÂM DƯƠNG) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7">
            <label className="block text-xs uppercase tracking-wider text-amber-200/90 font-bold mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('form.fullName', 'Họ tên đương số')}</span>
              <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={hoTen}
              onChange={(e) => setHoTen(e.target.value)}
              placeholder={t('form.fullNamePlaceholder', 'Ví dụ: Trần Huy Tôn...')}
              className="w-full px-4 py-3 bg-slate-950/75 border border-slate-700/80 hover:border-amber-500/40 rounded-xl text-slate-100 text-base sm:text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition shadow-inner"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs uppercase tracking-wider text-amber-200/90 font-bold mb-1.5">
              {t('form.gender', 'Giới tính')}
            </label>
            <div className="grid grid-cols-2 gap-2.5 p-1 rounded-xl bg-slate-950/80 border border-slate-700/80">
              <button
                type="button"
                onClick={() => setGioiTinh('Nam')}
                className={`py-2.5 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  gioiTinh === 'Nam'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/70'
                }`}
              >
                <span className="text-base leading-none">☯</span>
                <span>{t('form.male', 'Nam')}</span>
              </button>
              <button
                type="button"
                onClick={() => setGioiTinh('Nữ')}
                className={`py-2.5 px-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                  gioiTinh === 'Nữ'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/70'
                }`}
              >
                <span className="text-base leading-none">❀</span>
                <span>{t('form.female', 'Nữ')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* HÀNG 2: NGÀY THÁNG NĂM SINH (DƯƠNG LỊCH) & GIỜ SINH */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          <div className="md:col-span-7">
            <label className="block text-xs uppercase tracking-wider text-amber-200/90 font-bold mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('form.calendar', 'Ngày tháng năm sinh (Dương lịch)')}</span>
              <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  max={31}
                  value={ngayDuong}
                  onChange={(e) => setNgayDuong(Number(e.target.value))}
                  placeholder={t('form.day', 'Ngày')}
                  className="w-full px-3 pt-2.5 pb-5 bg-slate-950/75 border border-slate-700/80 hover:border-amber-500/40 rounded-xl text-slate-100 text-base sm:text-sm font-bold text-center focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition shadow-inner"
                />
                <span className="pointer-events-none absolute bottom-1.5 inset-x-0 text-[10px] text-slate-400 font-semibold text-center uppercase tracking-wider">
                  {t('form.day', 'Ngày')}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1}
                  max={12}
                  value={thangDuong}
                  onChange={(e) => setThangDuong(Number(e.target.value))}
                  placeholder={t('form.month', 'Tháng')}
                  className="w-full px-3 pt-2.5 pb-5 bg-slate-950/75 border border-slate-700/80 hover:border-amber-500/40 rounded-xl text-slate-100 text-base sm:text-sm font-bold text-center focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition shadow-inner"
                />
                <span className="pointer-events-none absolute bottom-1.5 inset-x-0 text-[10px] text-slate-400 font-semibold text-center uppercase tracking-wider">
                  {t('form.month', 'Tháng')}
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={1900}
                  max={2100}
                  value={namDuong}
                  onChange={(e) => setNamDuong(Number(e.target.value))}
                  placeholder={t('form.year', 'Năm')}
                  className="w-full px-3 pt-2.5 pb-5 bg-slate-950/75 border border-slate-700/80 hover:border-amber-500/40 rounded-xl text-slate-100 text-base sm:text-sm font-bold text-center focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition shadow-inner"
                />
                <span className="pointer-events-none absolute bottom-1.5 inset-x-0 text-[10px] text-slate-400 font-semibold text-center uppercase tracking-wider">
                  {t('form.year', 'Năm')}
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs uppercase tracking-wider text-amber-200/90 font-bold mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('form.birthHour', 'Giờ sinh (Chi)')}</span>
            </label>
            <select
              value={gioSinhVal}
              onChange={(e) => setGioSinhVal(e.target.value)}
              className="w-full px-3.5 py-3.5 bg-slate-950/75 border border-slate-700/80 hover:border-amber-500/40 rounded-xl text-slate-100 text-base sm:text-sm font-medium focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition cursor-pointer shadow-inner"
            >
              {Object.entries(GIO_ARR).map(([key, val]) => (
                <option key={key} value={key}>
                  {tHour(key, val.label)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Thanh Quy Đổi Lịch Âm & Can Chi Tự Động */}
        {lunarPreview.valid ? (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-amber-200 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-slate-900/80 border border-amber-500/35 rounded-xl px-3.5 py-2.5 font-medium shadow-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/25 text-amber-300 text-xs">
                🌙
              </span>
              <span>
                {t('form.lunar', 'Âm lịch')}:{' '}
                <strong className="text-amber-300 font-bold">
                  {lunarPreview.ngayAm}/{lunarPreview.thangAm}
                  {lunarPreview.isLeap ? t('form.leapMonth', ' (Nhuận)') : ''}/{lunarPreview.namAm}
                </strong>{' '}
                • {t('form.lunarYearPrefix', 'Năm')}{' '}
                <strong className="text-amber-300 font-bold">{tCanChi(lunarPreview.namCanChi!)}</strong>
                {lunarPreview.isLateTy ? (
                  <span className="text-amber-300/90">
                    {' '}
                    {t('form.lateRatHint', '(Tính sang ngày hôm sau do Giờ Tý Dạ 23h-24h)')}
                  </span>
                ) : (
                  ''
                )}
              </span>
            </div>
            <span className="text-[10.5px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              ✓ Chuẩn Lịch Vạn Niên
            </span>
          </div>
        ) : (
          <p className="text-xs text-red-300 bg-red-500/15 border border-red-500/35 rounded-xl px-3.5 py-2.5 font-medium">
            ⚠️ {lunarPreview.error}
          </p>
        )}

        {/* HÀNG 3: NĂM XEM HẠN (DƯƠNG LỊCH) */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-950/60 border border-amber-500/25">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                <label className="text-xs uppercase tracking-wider text-amber-200 font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('form.viewYear', 'Năm xem hạn (Dương lịch)')}</span>
                </label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { y: 2025, cc: 'Ất Tỵ' },
                    { y: 2026, cc: 'Bính Ngọ' },
                    { y: 2027, cc: 'Đinh Mùi' },
                  ].map((item) => (
                    <button
                      key={item.y}
                      type="button"
                      onClick={() => setNamXem(item.y)}
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border transition cursor-pointer ${
                        namXem === item.y
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 shadow-sm shadow-amber-500/20'
                          : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-amber-400/50 hover:text-amber-200'
                      }`}
                    >
                      {item.y} ({tCanChi(item.cc)})
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-[11.5px] text-slate-400">
                {t(
                  'form.viewYearDesc',
                  'Hệ thống sẽ an hệ sao lưu, đại vận, tiểu vận và bình giải 12 tháng nguyệt vận chuẩn xác theo năm này.'
                )}
              </p>
            </div>
            <div className="sm:w-36 shrink-0">
              <input
                type="number"
                min={1900}
                max={2100}
                value={namXem}
                onChange={(e) => setNamXem(Number(e.target.value))}
                placeholder={`VD: ${currentYear}`}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-amber-500/50 rounded-xl text-amber-300 font-extrabold text-center text-base sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition"
              />
            </div>
          </div>
        </div>

        {/* KHỐI THỰC CHỨNG & TƯỚNG PHÁP (DIỆN TƯỚNG & THỦ TƯỚNG AI) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-amber-950/20 border border-amber-500/25 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs sm:text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('form.physiqueTitle', 'Dữ liệu Thực Chứng & Tướng Pháp (Tùy chọn)')}</span>
            </div>
            <span className="text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-200">
              AI Diện Tướng &amp; Chỉ Tay
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Cột trái: Hoàn cảnh + Chiều cao & Cân nặng */}
            <div className="md:col-span-6 space-y-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                  {t('form.moreInfo', 'Hoàn cảnh, Nghề nghiệp hiện tại...')}
                </label>
                <textarea
                  rows={3}
                  value={thongTinThem}
                  onChange={(e) => setThongTinThem(e.target.value)}
                  placeholder={t(
                    'form.moreInfoPlaceholder',
                    'Ví dụ: Đang làm kỹ sư IT, đã kết hôn, muốn hỏi sâu về đường làm ăn kinh doanh...'
                  )}
                  className="w-full px-3.5 py-2.5 bg-slate-950/75 border border-slate-700/80 rounded-xl text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-400 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                    {t('form.height', 'Chiều cao (cm)')}
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={250}
                    value={chieuCao ?? ''}
                    onChange={(e) => setChieuCao(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder={t('form.heightPlaceholder', 'VD: 170')}
                    className="w-full px-3 py-2 bg-slate-950/75 border border-slate-700/80 rounded-xl text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                    {t('form.weight', 'Cân nặng (kg)')}
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={200}
                    value={canNang ?? ''}
                    onChange={(e) => setCanNang(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder={t('form.weightPlaceholder', 'VD: 65')}
                    className="w-full px-3 py-2 bg-slate-950/75 border border-slate-700/80 rounded-xl text-slate-100 text-base sm:text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>
              </div>
            </div>

            {/* Cột phải: Upload Ảnh Diện Tướng & Chỉ Tay với khung ngắm Biometric */}
            <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Ảnh mặt */}
              <div className="flex flex-col">
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                  {t('form.uploadFace', 'Ảnh khuôn mặt (Diện tướng)')}
                </label>
                {isConvertingMat ? (
                  <div className="flex-1 rounded-xl border border-amber-500/40 min-h-[124px] bg-slate-950/80 flex flex-col items-center justify-center p-2 text-center">
                    <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-1.5" />
                    <span className="text-xs text-amber-300">
                      {t('form.readingHeic', 'Đang đọc ảnh iPhone (HEIC)...')}
                    </span>
                  </div>
                ) : anhMatBase64 ? (
                  <div className="relative flex-1 rounded-xl overflow-hidden border border-amber-500/50 min-h-[124px] bg-slate-950 flex items-center justify-center shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={anhMatBase64}
                      alt="Diện tướng"
                      className="max-h-32 max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setAnhMatBase64(undefined)}
                      className="absolute top-1.5 right-1.5 bg-red-600/85 hover:bg-red-600 text-white rounded-full p-1 transition shadow"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="relative flex-1 flex flex-col items-center justify-center min-h-[124px] p-3 text-center border border-dashed border-amber-500/35 hover:border-amber-400 rounded-xl cursor-pointer bg-slate-950/60 hover:bg-slate-950/90 transition group overflow-hidden">
                    <span className="pointer-events-none absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400/60" />
                    <span className="pointer-events-none absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400/60" />
                    <span className="pointer-events-none absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400/60" />
                    <span className="pointer-events-none absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400/60" />
                    <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-xs text-slate-200 group-hover:text-amber-200 font-semibold">
                      {t('form.selectFacePhoto', 'Chọn ảnh mặt rõ nét')}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">JPG, PNG, HEIC (iPhone)</span>
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
              <div className="flex flex-col">
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                  {t('form.uploadPalm', 'Ảnh bàn tay (Thủ tướng)')}{' '}
                  <span className="text-amber-400 font-bold normal-case tracking-normal">
                    {t('form.palmHint', '(Nam trái, Nữ phải)')}
                  </span>
                </label>
                {isConvertingTay ? (
                  <div className="flex-1 rounded-xl border border-amber-500/40 min-h-[124px] bg-slate-950/80 flex flex-col items-center justify-center p-2 text-center">
                    <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-1.5" />
                    <span className="text-xs text-amber-300">
                      {t('form.readingHeic', 'Đang đọc ảnh iPhone (HEIC)...')}
                    </span>
                  </div>
                ) : anhTayBase64 ? (
                  <div className="relative flex-1 rounded-xl overflow-hidden border border-amber-500/50 min-h-[124px] bg-slate-950 flex items-center justify-center shadow-inner">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={anhTayBase64}
                      alt="Chỉ tay"
                      className="max-h-32 max-w-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setAnhTayBase64(undefined)}
                      className="absolute top-1.5 right-1.5 bg-red-600/85 hover:bg-red-600 text-white rounded-full p-1 transition shadow"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="relative flex-1 flex flex-col items-center justify-center min-h-[124px] p-3 text-center border border-dashed border-amber-500/35 hover:border-amber-400 rounded-xl cursor-pointer bg-slate-950/60 hover:bg-slate-950/90 transition group overflow-hidden">
                    <span className="pointer-events-none absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-amber-400/60" />
                    <span className="pointer-events-none absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-amber-400/60" />
                    <span className="pointer-events-none absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-amber-400/60" />
                    <span className="pointer-events-none absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-amber-400/60" />
                    <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-1.5 group-hover:scale-110 transition">
                      <Upload className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-xs text-slate-200 group-hover:text-amber-200 font-semibold">
                      {t('form.selectPalmPhoto', 'Chọn ảnh lòng bàn tay')}{' '}
                      <strong className="text-amber-400 font-bold">
                        ({gioiTinh === 'Nam' ? t('form.leftHand', 'Tay Trái') : t('form.rightHand', 'Tay Phải')})
                      </strong>
                    </span>
                    <span className="text-[10px] text-amber-400/90 font-semibold mt-0.5">
                      {t('form.palmSubHint', 'Nam tay trái • Nữ tay phải')}
                    </span>
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

        {/* LỰA CHỌN GÓI BÌNH GIẢI (3 THẺ HOÀNG GIA CÂN ĐỐI TRÊN PC) */}
        <div className="pt-4 border-t border-amber-500/20">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <label className="text-sm sm:text-base uppercase tracking-wider text-gold-gradient font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t('form.packageTitle', 'Chọn Gói Bình Giải')}</span>
              <span className="text-red-400">*</span>
            </label>
            <span className="text-xs sm:text-[11px] font-medium text-slate-400">
              {t('form.packageRequired', 'Bắt buộc chọn trước khi lập lá số')}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 1. Gói Cơ Bản (Miễn Phí) */}
            <div
              onClick={() => setSelectedTier('free')}
              className={`relative p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                selectedTier === 'free'
                  ? 'bg-gradient-to-b from-emerald-950/55 via-slate-900 to-slate-950 border-emerald-400 ring-2 ring-emerald-400/90 shadow-xl shadow-emerald-500/15 -translate-y-0.5'
                  : 'bg-slate-950/65 border-slate-800 hover:border-emerald-500/40 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow tracking-wider">
                {t('form.freeBadge', '🎁 Trải Nghiệm Miễn Phí')}
              </div>
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5 pt-1">
                  <span className="font-bold text-base text-slate-100 font-serif leading-snug">
                    {t('form.freeTitle', '📜 Bản Khởi Nguyên (Miễn Phí)')}
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                    {t('form.freePrice', '0 VNĐ')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t(
                    'form.freeDesc',
                    'Tặng miễn phí lá số 108 sao & bài bình giải Khởi Nguyên (~1.000 từ): Giải mã cốt cách Bản Mệnh, Tam Hợp Mệnh - Tài - Quan, Đại Vận 10 năm & Tiểu Vận năm xem.'
                  )}
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 text-xs text-emerald-300 font-semibold flex items-center justify-between">
                <span>{t('form.freeQnA', '✓ An sao & Bình giải 0đ • Hỏi thêm: 49k/2 câu')}</span>
              </div>
            </div>

            {/* 2. Gói Chuyên Sâu (Bản Pro) */}
            <div
              onClick={() => setSelectedTier('pro')}
              className={`relative p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                selectedTier === 'pro'
                  ? 'bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border-amber-400 ring-2 ring-amber-400 shadow-xl shadow-amber-500/25 -translate-y-0.5'
                  : 'bg-slate-950/65 border-amber-500/30 hover:border-amber-400/60 opacity-90 hover:opacity-100'
              }`}
            >
              <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow tracking-wider">
                {t('form.proBadge', '🔥 Khuyên Dùng • Phổ Biến Nhất')}
              </div>
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5 pt-1">
                  <span className="font-bold text-base text-amber-300 flex items-center gap-1.5 font-serif leading-snug">
                    <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{t('form.proTitle', 'Bản Chuyên Sâu VIP Pro')}</span>
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                    {activeVoucher ? (
                      <>
                        <s className="opacity-65 mr-1 font-normal">119.000</s>
                        <span>{activeVoucher.prices.reading_vip.toLocaleString('vi-VN')}đ</span>
                      </>
                    ) : (
                      t('form.proPrice', '119.000 VNĐ')
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {isVanHanLanding
                    ? 'Luận chuyên sâu (~2.500 từ): Giải mã trọn vẹn 3 cung Tiểu Hạn • LN.Đại Hạn • Lưu Thái Tuế, Tứ Trụ (Mệnh - Tài - Quan - Phu Thê), vận khí 4 Mùa kết hợp soi Ảnh Khuôn Mặt & Chỉ Tay thực tế.'
                    : t(
                        'form.proDesc',
                        'Đại Pháp Bí Truyền Chuyên Sâu (~2.500 từ, chi tiết gấp 2,5 lần). Mổ xẻ Tứ Trụ (Mệnh - Thân - Tài - Quan - Phu Thê), kết hợp soi Ảnh Khuôn Mặt & Chỉ Tay thực tế, Đại Vận 10 năm & Vận khí 4 Mùa.'
                      )}
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 text-xs text-amber-300 font-semibold flex items-center justify-between">
                <span>{t('form.proQnA', '🎁 Tặng kèm 02 câu hỏi VIP (Mua thêm: 99k/2 câu)')}</span>
              </div>
            </div>

            {/* 3. Gói Chuyên Gia (Bản Expert) */}
            <div
              onClick={() => setSelectedTier('expert')}
              className={`relative p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                selectedTier === 'expert'
                  ? 'bg-gradient-to-br from-purple-950/75 via-indigo-950/60 to-slate-950 border-purple-400 ring-2 ring-purple-400 shadow-xl shadow-purple-500/30 -translate-y-0.5'
                  : 'bg-slate-950/75 border-purple-500/35 hover:border-purple-400/65 opacity-90 hover:opacity-100'
              }`}
            >
              <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow tracking-wider">
                {t('form.expertBadge', '💎 Đỉnh Cao Mệnh Lý • Luận Trọn Bộ 12 Cung')}
              </div>
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5 pt-1">
                  <span className="font-bold text-base text-purple-200 flex items-center gap-1.5 font-serif leading-snug">
                    <Gem className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>{t('form.expertTitle', 'Bản Chuyên Gia Đại Tông Sư (Expert)')}</span>
                  </span>
                  <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/45 shrink-0">
                    {activeVoucher && initialData?.tier !== 'pro' ? (
                      <>
                        <s className="opacity-65 mr-1 font-normal">269.000</s>
                        <span>{activeVoucher.prices.reading_expert.toLocaleString('vi-VN')}đ</span>
                      </>
                    ) : (
                      t('form.expertPrice', '269.000 VNĐ')
                    )}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {t(
                    'form.expertDesc',
                    'Tuyệt Học Mệnh Lý Toàn Diện Nhất (~4.500 - 5.000 từ, dài gấp đôi Bản Pro). Luận giải chuyên sâu KHÔNG BỎ SÓT bất kỳ cung nào trong đủ 12 Cung + Cung Thân, đối chiếu Diện tướng/Chỉ tay chuyên gia, Đại Vận 10 năm & Bản đồ Lưu Nguyệt chi tiết từng tháng (Tháng 1 - 12 Âm lịch).'
                  )}
                </p>
              </div>
              <div className="mt-3.5 pt-2.5 border-t border-purple-900/50 text-xs text-purple-200 font-semibold space-y-1">
                <div>{t('form.expertQnA', '🎁 Tặng kèm 02 câu hỏi Chuyên Gia miễn phí (Thêm: 129k/2 câu)')}</div>
                <div className="text-[11px] text-amber-300 font-medium">
                  {t('form.expertUpgradeHint', '*Khách đang dùng Bản Pro nâng cấp chỉ 150.000đ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nút Submit Ánh Kim */}
        <button
          type="submit"
          disabled={isLoading}
          className={`btn-shimmer w-full mt-6 py-4 px-6 font-extrabold rounded-2xl tracking-wider uppercase text-base sm:text-lg shadow-xl transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2.5 cursor-pointer ${
            selectedTier === 'expert'
              ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white shadow-purple-950/60 ring-1 ring-purple-300/40'
              : selectedTier === 'pro'
              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 shadow-amber-950/50 ring-1 ring-amber-200/60'
              : 'bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white shadow-red-950/50 ring-1 ring-amber-400/40'
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
              <span>{t('form.btnUpdateChart', 'Cập Nhật & An Lại Lá Số (Năm {year})', { year: namXem })}</span>
            </>
          ) : selectedTier === 'expert' ? (
            <>
              <Gem className="w-5 h-5" />
              <span>
                {initialData?.tier === 'pro'
                  ? t('form.btnUpgradeProToExpert', 'Thanh Toán & Nâng Cấp Bản Expert (150K)')
                  : activeVoucher
                  ? `Thanh Toán & Luận Giải Bản Expert (${Math.round(activeVoucher.prices.reading_expert / 1000)}K • -${activeVoucher.discountPercent}%)`
                  : t('form.btnSubmitExpert', 'Thanh Toán & Luận Giải Bản Expert (269K)')}
              </span>
            </>
          ) : selectedTier === 'pro' ? (
            <>
              <Crown className="w-5 h-5" />
              <span>
                {activeVoucher
                  ? `Thanh Toán & Luận Giải Bản Pro (${Math.round(activeVoucher.prices.reading_vip / 1000)}K • -${activeVoucher.discountPercent}%)`
                  : t('form.btnSubmitPro', 'Thanh Toán & Luận Giải Bản Pro (119K)')}
              </span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>{t('form.btnSubmitFree', 'An Sao & Nhận Bình Giải Miễn Phí Ngay')}</span>
            </>
          )}
        </button>

        {/* Đặt lịch xem trực tiếp Online & Offline */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-sm sm:text-xs text-slate-400">
          <span className="text-slate-300 font-medium">
            {t('form.bookingTitle', 'Tư vấn CSKH hoặc Đặt lịch xem Online & Offline:')}
          </span>
          <div className="flex items-center gap-2.5 font-medium">
            <a
              href="tel:0935058688"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:text-amber-200 transition"
              title="Gọi điện đặt lịch xem Online & Offline"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <strong className="font-bold">0935.058.688</strong>
            </a>
            <a
              href="https://zalo.me/0935058688"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 hover:text-blue-200 transition"
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
