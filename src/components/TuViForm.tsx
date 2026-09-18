'use client';

import React, { useState, ChangeEvent } from 'react';
import { DuLieuDuongSo, GioiTinh } from '@/types/tuvi';
import { GIO_ARR } from '@/lib/tuvi/constants';
import { Sparkles, Upload, User, Calendar, Clock, Image as ImageIcon, X, Key } from 'lucide-react';

interface TuViFormProps {
  onSubmit: (data: DuLieuDuongSo) => void;
  isLoading: boolean;
  onOpenApiKeyModal?: () => void;
  hasCustomKey?: boolean;
}

function compressImage(file: File, maxWidth = 1280, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
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
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function TuViForm({ onSubmit, isLoading, onOpenApiKeyModal, hasCustomKey }: TuViFormProps) {
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

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    setter: (val: string | undefined) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Kích thước ảnh không được vượt quá 15MB');
      return;
    }

    try {
      const compressed = await compressImage(file);
      setter(compressed);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hoTen.trim()) {
      alert('Vui lòng nhập họ và tên đương số!');
      return;
    }

    onSubmit({
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
    });
  };

  return (
    <div className="w-full max-w-xl mx-auto backdrop-blur-xl bg-slate-900/80 border border-amber-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 text-slate-100">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 shadow-[0_0_15px_rgba(212,175,55,0.25)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-amber-400 font-serif">
              Tử Vi Thầy Tôn
            </h1>
            <p className="text-xs text-slate-400">
              Lập Lá Số &amp; Bình Giải Đa Phương Thức
            </p>
          </div>
        </div>

        {onOpenApiKeyModal && (
          <button
            type="button"
            onClick={onOpenApiKeyModal}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
              hasCustomKey
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 hover:bg-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-300'
            }`}
            title="Cài đặt và kiểm tra Gemini API Key"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{hasCustomKey ? 'Key riêng' : 'Cài đặt API'}</span>
          </button>
        )}
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
                {anhMatBase64 ? (
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
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setAnhMatBase64)}
                    />
                  </label>
                )}
              </div>

              {/* Ảnh bàn tay */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-slate-300 font-medium mb-1">
                  Ảnh bàn tay (Thủ tướng)
                </label>
                {anhTayBase64 ? (
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
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setAnhTayBase64)}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Nút Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-3.5 px-6 bg-gradient-to-r from-red-700 via-red-600 to-amber-600 hover:from-red-600 hover:to-amber-500 text-white font-bold rounded-xl tracking-wider uppercase text-sm sm:text-base shadow-lg shadow-red-950/50 hover:shadow-red-700/30 transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Thầy Đang Quán Tưởng...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Lập Lá Số &amp; Xem Tướng</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
