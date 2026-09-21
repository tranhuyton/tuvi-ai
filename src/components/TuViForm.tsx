'use client';

import React, { useState, ChangeEvent } from 'react';
import { DuLieuDuongSo, GioiTinh, ServiceTier } from '@/types/tuvi';
import { GIO_ARR } from '@/lib/tuvi/constants';
import { Sparkles, Upload, User, Calendar, Clock, Image as ImageIcon, X, ShieldCheck, Crown, PhoneCall } from 'lucide-react';
import PaymentModal from './PaymentModal';

interface TuViFormProps {
  onSubmit: (data: DuLieuDuongSo, tier: ServiceTier) => void;
  isLoading: boolean;
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

export default function TuViForm({ onSubmit, isLoading }: TuViFormProps) {
  const [hoTen, setHoTen] = useState('');
  const [gioiTinh, setGioiTinh] = useState<GioiTinh>('Nam');
  const [ngayDuong, setNgayDuong] = useState(15);
  const [thangDuong, setThangDuong] = useState(8);
  const [namDuong, setNamDuong] = useState(1995);
  const [gioSinhVal, setGioSinhVal] = useState('2'); // Dần (03h-05h)
  const [thongTinThem, setThongTinThem] = useState('');
  const [chieuCao, setChieuCao] = useState<number | undefined>(undefined);
  const [canNang, setCanNang] = useState<number | undefined>(undefined);

  const [anhMatBase64, setAnhMatBase64] = useState<string | undefined>(undefined);
  const [anhTayBase64, setAnhTayBase64] = useState<string | undefined>(undefined);
  const [isConvertingMat, setIsConvertingMat] = useState(false);
  const [isConvertingTay, setIsConvertingTay] = useState(false);

  // Lựa chọn gói dịch vụ
  const [selectedTier, setSelectedTier] = useState<ServiceTier>('free');
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<DuLieuDuongSo | null>(null);

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
      thongTinThem: thongTinThem.trim() || undefined,
      chieuCao: chieuCao ? Number(chieuCao) : undefined,
      canNang: canNang ? Number(canNang) : undefined,
      anhMat: anhMatBase64,
      anhTay: anhTayBase64,
      tier: selectedTier,
    };

    if (selectedTier === 'pro') {
      setPendingPayload(payload);
      setIsPaymentOpen(true);
    } else {
      onSubmit(payload, 'free');
    }
  };

  const handleConfirmProPayment = () => {
    if (pendingPayload) {
      onSubmit(pendingPayload, 'pro');
    } else {
      // Fallback
      const payload: DuLieuDuongSo = {
        hoTen: hoTen.trim() || 'Đương số',
        gioiTinh,
        ngayDuong: Number(ngayDuong),
        thangDuong: Number(thangDuong),
        namDuong: Number(namDuong),
        gioSinhVal,
        thongTinThem: thongTinThem.trim() || undefined,
        chieuCao: chieuCao ? Number(chieuCao) : undefined,
        canNang: canNang ? Number(canNang) : undefined,
        anhMat: anhMatBase64,
        anhTay: anhTayBase64,
        tier: 'pro',
      };
      onSubmit(payload, 'pro');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto backdrop-blur-xl bg-slate-900/80 border border-amber-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100">
      <div className="mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-amber-400 font-serif">
            LẬP LÁ SỐ TỬ VI
          </h2>
          <span className="text-xs sm:text-sm text-amber-400/80 font-serif italic tracking-wide">
            ✦ Khai mở thiên cơ
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          An sao chính xác theo giờ sinh • Bình giải chuyên sâu đa phương thức
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Họ tên */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
            <User className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
            Họ tên đương số <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            required
            value={hoTen}
            onChange={(e) => setHoTen(e.target.value)}
            placeholder="Ví dụ: Trần Huy Tôn..."
            className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition"
          />
        </div>

        {/* Giới tính & Giờ sinh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
              Giới tính
            </label>
            <select
              value={gioiTinh}
              onChange={(e) => setGioiTinh(e.target.value as GioiTinh)}
              className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition"
            >
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
              <Clock className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
              Giờ sinh (Chi)
            </label>
            <select
              value={gioSinhVal}
              onChange={(e) => setGioSinhVal(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition"
            >
              {Object.entries(GIO_ARR).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Ngày - Tháng - Năm sinh Dương Lịch */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
            <Calendar className="w-3.5 h-3.5 inline mr-1 text-amber-400" />
            Ngày tháng năm sinh (Dương lịch) <span className="text-red-400">*</span>
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
                placeholder="Ngày"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-sm text-center focus:outline-none focus:border-amber-400 transition"
              />
              <span className="block text-[11px] text-slate-400 text-center mt-1">Ngày</span>
            </div>
            <div>
              <input
                type="number"
                required
                min={1}
                max={12}
                value={thangDuong}
                onChange={(e) => setThangDuong(Number(e.target.value))}
                placeholder="Tháng"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-sm text-center focus:outline-none focus:border-amber-400 transition"
              />
              <span className="block text-[11px] text-slate-400 text-center mt-1">Tháng</span>
            </div>
            <div>
              <input
                type="number"
                required
                min={1900}
                max={2100}
                value={namDuong}
                onChange={(e) => setNamDuong(Number(e.target.value))}
                placeholder="Năm"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-sm text-center focus:outline-none focus:border-amber-400 transition"
              />
              <span className="block text-[11px] text-slate-400 text-center mt-1">Năm</span>
            </div>
          </div>
        </div>

        {/* Khối Thực Chứng & Tướng Pháp (Tùy chọn) */}
        <div className="pt-4 mt-4 border-t border-slate-700/60">
          <div className="flex items-center gap-1.5 mb-3 text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Dữ liệu Thực Chứng &amp; Tướng Pháp (Tùy chọn)
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                Hoàn cảnh, Nghề nghiệp hiện tại...
              </label>
              <textarea
                rows={2}
                value={thongTinThem}
                onChange={(e) => setThongTinThem(e.target.value)}
                placeholder="Ví dụ: Đang làm kỹ sư IT, đã kết hôn, muốn hỏi sâu về đường làm ăn kinh doanh..."
                className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                  Chiều cao (cm)
                </label>
                <input
                  type="number"
                  min={50}
                  max={250}
                  value={chieuCao ?? ''}
                  onChange={(e) => setChieuCao(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="VD: 170"
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                  Cân nặng (kg)
                </label>
                <input
                  type="number"
                  min={20}
                  max={200}
                  value={canNang ?? ''}
                  onChange={(e) => setCanNang(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="VD: 65"
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-700/80 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* Upload Ảnh Diện Tướng & Chỉ Tay */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {/* Ảnh mặt */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                  Ảnh khuôn mặt (Diện tướng)
                </label>
                {isConvertingMat ? (
                  <div className="rounded-lg border border-amber-500/40 h-24 bg-slate-950/80 flex flex-col items-center justify-center p-2 text-center">
                    <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-1.5" />
                    <span className="text-[11px] text-amber-300">Đang đọc ảnh iPhone (HEIC)...</span>
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
                    <span className="text-xs text-slate-400 group-hover:text-slate-200">
                      Chọn ảnh mặt rõ nét
                    </span>
                    <span className="text-[10px] text-slate-500">JPG, PNG, HEIC (iPhone)</span>
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
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                  Ảnh bàn tay (Thủ tướng)
                </label>
                {isConvertingTay ? (
                  <div className="rounded-lg border border-amber-500/40 h-24 bg-slate-950/80 flex flex-col items-center justify-center p-2 text-center">
                    <div className="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin mb-1.5" />
                    <span className="text-[11px] text-amber-300">Đang đọc ảnh iPhone (HEIC)...</span>
                  </div>
                ) : anhTayBase64 ? (
                  <div className="relative rounded-lg overflow-hidden border border-amber-500/40 h-24 bg-slate-950 flex items-center justify-center">
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
                  <label className="flex flex-col items-center justify-center h-24 border border-dashed border-slate-700 hover:border-amber-400/60 rounded-lg cursor-pointer bg-slate-950/40 hover:bg-slate-950/60 transition group">
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition mb-1" />
                    <span className="text-xs text-slate-400 group-hover:text-slate-200">
                      Chọn ảnh lòng bàn tay
                    </span>
                    <span className="text-[10px] text-slate-500">JPG, PNG, HEIC (iPhone)</span>
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
          <label className="block text-xs uppercase tracking-wider text-amber-400 font-bold mb-3 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Chọn Gói Bình Giải <span className="text-red-400">*</span>
            </span>
            <span className="text-[11px] font-normal text-slate-400">Bắt buộc chọn trước khi lập lá số</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Gói Cơ Bản (Miễn Phí) */}
            <div
              onClick={() => setSelectedTier('free')}
              className={`relative p-3.5 sm:p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                selectedTier === 'free'
                  ? 'bg-slate-800/95 border-amber-400 ring-2 ring-amber-400 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-100 flex items-center gap-1.5 font-serif">
                    <span>📜 Bản Miễn Phí</span>
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    0 VNĐ
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Pháp môn Khởi Nguyên Căn Bản. Luận giải chuẩn mực, súc tích (~800 - 1000 từ), bao quát Bản Mệnh, Tam Hợp Mệnh - Tài - Quan, Đại Vận &amp; Tiểu Vận năm xem.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Hỏi đáp trực tiếp:</span>
                <span className="font-medium text-slate-300">49.000đ / 2 câu</span>
              </div>
            </div>

            {/* Gói Chuyên Sâu (Bản Pro) */}
            <div
              onClick={() => setSelectedTier('pro')}
              className={`relative p-3.5 sm:p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                selectedTier === 'pro'
                  ? 'bg-gradient-to-b from-amber-950/40 to-slate-900 border-amber-400 ring-2 ring-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950/60 border-slate-800 hover:border-amber-500/40 opacity-80 hover:opacity-100'
              }`}
            >
              <div className="absolute -top-2.5 right-3 bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow tracking-wider">
                Khuyên Dùng
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-amber-300 flex items-center gap-1.5 font-serif">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <span>Bản Chuyên Sâu Pro</span>
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    119.000 VNĐ
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Đại Pháp Bí Truyền Chuyên Sâu. Luận giải chi tiết gấp 2 lần (~1800 - 2500 từ). Khảo sát sâu 14 Chính tinh, phối hợp Tướng Pháp (mặt/chỉ tay), Đại Vận 10 năm &amp; Hóa Giải 4 Mùa.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-amber-400 flex items-center justify-between">
                <span>Ưu đãi hỏi đáp VIP:</span>
                <span className="font-bold text-amber-300">Tặng 2 câu (Thêm: 99.000đ/2 câu)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full mt-6 py-3.5 px-6 font-bold rounded-xl tracking-wider uppercase text-sm sm:text-base shadow-lg transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${
            selectedTier === 'pro'
              ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-amber-950/50'
              : 'bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white shadow-red-950/50'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Thầy Đang Quán Tưởng...</span>
            </>
          ) : selectedTier === 'pro' ? (
            <>
              <Crown className="w-5 h-5" />
              <span>Thanh Toán &amp; Luận Giải Bản Pro</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Lập Lá Số &amp; Luận Giải Miễn Phí</span>
            </>
          )}
        </button>

        {/* Đặt lịch xem trực tiếp offline */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2 flex-wrap text-xs text-slate-400">
          <span className="text-slate-300 font-medium">
            Tư vấn CSKH hoặc Đặt lịch xem offline:
          </span>
          <div className="flex items-center gap-2 font-medium">
            <a
              href="tel:0935058688"
              className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 transition"
              title="Gọi điện đặt lịch xem offline"
            >
              <PhoneCall className="w-3.5 h-3.5" />
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
              <strong className="font-bold">Zalo Thầy</strong>
            </a>
          </div>
        </div>
      </form>

      {/* Modal thanh toán khi người dùng chọn Bản Pro */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onConfirm={handleConfirmProPayment}
        hoTen={hoTen.trim() || 'Đương số'}
        paymentType="reading_vip"
        price={119000}
      />
    </div>
  );
}
