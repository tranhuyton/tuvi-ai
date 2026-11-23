'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Camera,
  Upload,
  Image as ImageIcon,
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import type { DuLieuDuongSo, ServiceTier } from '@/types/tuvi';
import { processBiometricImageFile } from '@/lib/imageUpload';

interface BiometricSupplementPanelProps {
  duongSo: DuLieuDuongSo;
  tier: ServiceTier;
  isLoadingReading: boolean;
  onSaveAndRegenerate: (updates: {
    anhMat?: string;
    anhTay?: string;
    thongTinThem?: string;
    chieuCao?: number;
    canNang?: number;
  }) => Promise<void>;
}

export default function BiometricSupplementPanel({
  duongSo,
  tier,
  isLoadingReading,
  onSaveAndRegenerate,
}: BiometricSupplementPanelProps) {
  const hasExistingMat = Boolean(duongSo.anhMat?.startsWith('data:'));
  const hasExistingTay = Boolean(duongSo.anhTay?.startsWith('data:'));
  const hasBothPhotos = hasExistingMat && hasExistingTay;

  const [isOpen, setIsOpen] = useState(false);
  const [anhMat, setAnhMat] = useState<string | undefined>(duongSo.anhMat);
  const [anhTay, setAnhTay] = useState<string | undefined>(duongSo.anhTay);
  const [thongTinThem, setThongTinThem] = useState<string>(duongSo.thongTinThem || '');
  const [chieuCao, setChieuCao] = useState<string>(duongSo.chieuCao ? String(duongSo.chieuCao) : '');
  const [canNang, setCanNang] = useState<string>(duongSo.canNang ? String(duongSo.canNang) : '');
  const [isConvertingMat, setIsConvertingMat] = useState(false);
  const [isConvertingTay, setIsConvertingTay] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setAnhMat(duongSo.anhMat);
    setAnhTay(duongSo.anhTay);
    setThongTinThem(duongSo.thongTinThem || '');
    setChieuCao(duongSo.chieuCao ? String(duongSo.chieuCao) : '');
    setCanNang(duongSo.canNang ? String(duongSo.canNang) : '');
  }, [duongSo.hoTen, duongSo.anhMat, duongSo.anhTay, duongSo.thongTinThem, duongSo.chieuCao, duongSo.canNang]);

  if (tier === 'free') return null;

  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    setter: (val: string | undefined) => void,
    setLoading: (val: boolean) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    setLoading(true);
    try {
      const compressed = await processBiometricImageFile(file);
      setter(compressed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể đọc ảnh này.';
      setErrorMsg(`${msg} Mẹo: Quý khách có thể chụp màn hình bức ảnh rồi tải lên lại.`);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting || isLoadingReading) return;
    if (!anhMat && !anhTay && !thongTinThem.trim() && !chieuCao && !canNang) {
      setErrorMsg('Quý khách vui lòng tải ít nhất 1 ảnh khuôn mặt / bàn tay hoặc bổ sung hoàn cảnh trước khi luận giải lại.');
      return;
    }
    setErrorMsg(null);
    setIsSubmitting(true);
    try {
      const parsedHeight = chieuCao ? Number(chieuCao) : undefined;
      const parsedWeight = canNang ? Number(canNang) : undefined;
      await onSaveAndRegenerate({
        anhMat,
        anhTay,
        thongTinThem: thongTinThem.trim() || undefined,
        chieuCao: parsedHeight && Number.isFinite(parsedHeight) && parsedHeight > 0 ? parsedHeight : undefined,
        canNang: parsedWeight && Number.isFinite(parsedWeight) && parsedWeight > 0 ? parsedWeight : undefined,
      });
      setIsOpen(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Không thể cập nhật dữ liệu lúc này.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const tierLabel = tier === 'expert' ? 'Bản Chuyên Gia Expert' : 'Bản Chuyên Sâu Pro';
  const palmSideLabel = duongSo.gioiTinh === 'Nam' ? 'Tay Trái' : 'Tay Phải';

  return (
    <div className="w-full max-w-[1060px] mx-auto">
      <div
        className={`rounded-2xl border transition-all overflow-hidden shadow-lg ${
          hasBothPhotos
            ? 'bg-slate-900/80 border-emerald-500/30'
            : 'bg-gradient-to-br from-slate-900/95 via-amber-950/25 to-slate-900/95 border-amber-500/45 shadow-amber-500/10'
        }`}
      >
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                hasBothPhotos
                  ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300'
                  : 'bg-amber-500/20 border-amber-400/50 text-amber-300'
              }`}
            >
              {hasBothPhotos ? <CheckCircle2 className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              {hasBothPhotos ? (
                <>
                  <p className="text-sm font-bold text-emerald-300">
                    Đã đính kèm đầy đủ ảnh Diện Tướng &amp; Chỉ Tay
                  </p>
                  <p className="text-xs text-slate-400">
                    Quý khách vẫn có thể đổi ảnh rõ nét hơn hoặc cập nhật hoàn cảnh để Thầy Tôn soi chiếu lại miễn phí.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300">
                      🎁 Quyền lợi {tierLabel} • Miễn phí
                    </span>
                    {(hasExistingMat || hasExistingTay) && (
                      <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-300">
                        {hasExistingMat ? '✓ Đã có ảnh mặt' : '✓ Đã có ảnh chỉ tay'}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-amber-100 mt-1">
                    Bổ sung Ảnh Khuôn Mặt &amp; Lòng Bàn Tay để Thầy Tôn soi Tướng Pháp
                  </h3>
                  <p className="text-xs text-slate-300/90 mt-0.5">
                    Lá số của quý khách đã mở khóa đặc quyền xem Diện Tướng + Chỉ Tay — tải ảnh lên và bấm luận giải lại hoàn toàn miễn phí!
                  </p>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            disabled={isLoadingReading}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 disabled:opacity-50 ${
              hasBothPhotos
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 shadow-md shadow-amber-500/25'
            }`}
          >
            <span>
              {isOpen
                ? 'Thu gọn'
                : hasBothPhotos
                ? 'Cập nhật ảnh / hoàn cảnh'
                : '📸 Tải ảnh mặt & chỉ tay'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {isOpen && (
          <div className="px-4 pb-5 pt-4 sm:px-5 border-t border-amber-500/20 bg-slate-950/60 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Cột trái: Ảnh khuôn mặt & Bàn tay */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Ảnh khuôn mặt */}
                <div className="flex flex-col">
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                    Ảnh khuôn mặt (Diện tướng)
                  </label>
                  {isConvertingMat ? (
                    <div className="flex-1 rounded-xl border border-amber-500/40 min-h-[140px] bg-slate-950 flex flex-col items-center justify-center p-2 text-center">
                      <RefreshCw className="w-5 h-5 text-amber-400 animate-spin mb-1.5" />
                      <span className="text-xs text-amber-300">Đang xử lý ảnh...</span>
                    </div>
                  ) : anhMat ? (
                    <div className="relative flex-1 rounded-xl overflow-hidden border border-amber-500/50 min-h-[140px] bg-slate-950 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={anhMat} alt="Ảnh khuôn mặt" className="max-h-36 max-w-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setAnhMat(undefined)}
                        className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-full p-1 transition shadow cursor-pointer"
                        title="Xóa ảnh mặt"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex flex-col items-center justify-center min-h-[140px] p-3 text-center border border-dashed border-amber-500/40 hover:border-amber-400 rounded-xl cursor-pointer bg-slate-900/70 hover:bg-slate-900 transition group">
                      <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/35 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                        <ImageIcon className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-xs text-slate-200 font-semibold">Chọn ảnh mặt rõ nét</span>
                      <span className="text-[10.5px] text-slate-400 mt-0.5">JPG, PNG, HEIC (iPhone)</span>
                      <input
                        type="file"
                        accept="image/*,.heic,.heif,image/heic,image/heif"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setAnhMat, setIsConvertingMat)}
                      />
                    </label>
                  )}
                </div>

                {/* Ảnh lòng bàn tay */}
                <div className="flex flex-col">
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                    Ảnh lòng bàn tay{' '}
                    <span className="text-amber-400 normal-case font-bold">({palmSideLabel})</span>
                  </label>
                  {isConvertingTay ? (
                    <div className="flex-1 rounded-xl border border-amber-500/40 min-h-[140px] bg-slate-950 flex flex-col items-center justify-center p-2 text-center">
                      <RefreshCw className="w-5 h-5 text-amber-400 animate-spin mb-1.5" />
                      <span className="text-xs text-amber-300">Đang xử lý ảnh...</span>
                    </div>
                  ) : anhTay ? (
                    <div className="relative flex-1 rounded-xl overflow-hidden border border-amber-500/50 min-h-[140px] bg-slate-950 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={anhTay} alt="Ảnh chỉ tay" className="max-h-36 max-w-full object-contain" />
                      <button
                        type="button"
                        onClick={() => setAnhTay(undefined)}
                        className="absolute top-1.5 right-1.5 bg-red-600/90 hover:bg-red-600 text-white rounded-full p-1 transition shadow cursor-pointer"
                        title="Xóa ảnh chỉ tay"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex flex-col items-center justify-center min-h-[140px] p-3 text-center border border-dashed border-amber-500/40 hover:border-amber-400 rounded-xl cursor-pointer bg-slate-900/70 hover:bg-slate-900 transition group">
                      <div className="w-9 h-9 rounded-full bg-amber-500/15 border border-amber-500/35 flex items-center justify-center mb-1.5 group-hover:scale-105 transition">
                        <Upload className="w-4 h-4 text-amber-400" />
                      </div>
                      <span className="text-xs text-slate-200 font-semibold">
                        Chọn ảnh bàn tay <strong className="text-amber-400">{palmSideLabel}</strong>
                      </span>
                      <span className="text-[10.5px] text-amber-400/90 mt-0.5">Nam tay trái • Nữ tay phải</span>
                      <input
                        type="file"
                        accept="image/*,.heic,.heif,image/heic,image/heif"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, setAnhTay, setIsConvertingTay)}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Cột phải: Hoàn cảnh & Hình thể */}
              <div className="md:col-span-5 space-y-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-slate-300 font-semibold mb-1.5">
                    Bổ sung hoàn cảnh / điều muốn hỏi (tùy chọn)
                  </label>
                  <textarea
                    rows={3}
                    value={thongTinThem}
                    onChange={(e) => setThongTinThem(e.target.value)}
                    placeholder="VD: Đang làm kinh doanh / sống ở nước ngoài, muốn xem kỹ về công việc và nhà cửa..."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      Chiều cao (cm)
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={230}
                      value={chieuCao}
                      onChange={(e) => setChieuCao(e.target.value)}
                      placeholder="VD: 162"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      Cân nặng (kg)
                    </label>
                    <input
                      type="number"
                      min={30}
                      max={180}
                      value={canNang}
                      onChange={(e) => setCanNang(e.target.value)}
                      placeholder="VD: 54"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-300/90">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Ảnh chỉ dùng riêng để Thầy Tôn soi chiếu Tướng pháp cho lá số của quý khách, tuyệt đối bảo mật.</span>
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || isLoadingReading || isConvertingMat || isConvertingTay}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition cursor-pointer shrink-0 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang lưu &amp; luận giải lại...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Lưu ảnh &amp; Luận giải lại (Miễn phí)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
