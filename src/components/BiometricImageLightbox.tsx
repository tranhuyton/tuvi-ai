'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCw,
  Download,
  Sparkles,
  Move,
} from 'lucide-react';

export interface BiometricImageLightboxProps {
  isOpen: boolean;
  initialType: 'mat' | 'tay';
  anhMat?: string;
  anhTay?: string;
  customerName?: string;
  onClose: () => void;
}

export default function BiometricImageLightbox({
  isOpen,
  initialType,
  anhMat,
  anhTay,
  customerName,
  onClose,
}: BiometricImageLightboxProps) {
  const [activeType, setActiveType] = useState<'mat' | 'tay'>(initialType);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [enhanceContrast, setEnhanceContrast] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setActiveType(initialType === 'mat' && !anhMat && anhTay ? 'tay' : initialType === 'tay' && !anhTay && anhMat ? 'mat' : initialType);
      setScale(1);
      setRotation(0);
      setEnhanceContrast(false);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, initialType, anhMat, anhTay]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '+' || e.key === '=') setScale((s) => Math.min(5, +(s + 0.25).toFixed(2)));
      if (e.key === '-') setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSafeDataImage = (src?: string): src is string =>
    typeof src === 'string' && /^data:image\/(jpeg|jpg|png|webp|gif);base64,/i.test(src.trim());

  const safeAnhMat = isSafeDataImage(anhMat) ? anhMat : undefined;
  const safeAnhTay = isSafeDataImage(anhTay) ? anhTay : undefined;
  const currentSrc = activeType === 'mat' ? safeAnhMat : safeAnhTay;
  if (!currentSrc) return null;

  const handleResetView = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleSwitchTab = (type: 'mat' | 'tay') => {
    setActiveType(type);
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.25 : -0.25;
    setScale((prev) => Math.min(5, Math.max(0.5, +(prev + delta).toFixed(2))));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentSrc;
    const safeName = (customerName || 'khach-hang').replace(/\s+/g, '-').toLowerCase();
    link.download = `${safeName}-${activeType === 'mat' ? 'dien-tuong' : 'thu-tuong'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-[120] bg-black/92 backdrop-blur-md flex flex-col select-none animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={`Soi chi tiết tướng pháp${customerName ? `: ${customerName}` : ''}`}
      onClick={onClose}
    >
      {/* Top Toolbar */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-slate-950/90 border-b border-amber-500/30 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-sm sm:text-base font-bold text-amber-300 font-serif flex items-center gap-2">
            <span>🔍 Soi Chi Tiết Tướng Pháp{customerName ? `: ${customerName}` : ''}</span>
          </div>

          {/* Switcher between Face & Palm */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {safeAnhMat && (
              <button
                type="button"
                onClick={() => handleSwitchTab('mat')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeType === 'mat'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>📸 Ảnh Diện Tướng</span>
              </button>
            )}
            {safeAnhTay && (
              <button
                type="button"
                onClick={() => handleSwitchTab('tay')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                  activeType === 'tay'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>✋ Ảnh Thủ Tướng</span>
              </button>
            )}
          </div>
        </div>

        {/* Zoom / Rotate / Contrast Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.5, +(s - 0.25).toFixed(2)))}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition cursor-pointer"
            title="Thu nhỏ (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="min-w-[54px] text-center text-xs font-bold text-amber-300 bg-slate-900 px-2 py-2 rounded-lg border border-slate-800">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(5, +(s + 0.25).toFixed(2)))}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition cursor-pointer"
            title="Phóng to (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-5 w-px bg-slate-800 mx-1" />

          <button
            type="button"
            onClick={() => setRotation((r) => r - 90)}
            className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="Xoay trái 90°"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Xoay trái</span>
          </button>
          <button
            type="button"
            onClick={() => setRotation((r) => r + 90)}
            className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="Xoay phải 90°"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Xoay phải</span>
          </button>

          <button
            type="button"
            onClick={() => setEnhanceContrast((v) => !v)}
            className={`px-2.5 py-2 rounded-lg border transition cursor-pointer flex items-center gap-1 text-xs font-semibold ${
              enhanceContrast
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
            title="Tăng độ tương phản để nhìn rõ đường chỉ tay & nốt ruồi"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{enhanceContrast ? 'Đang tăng nét' : 'Rõ nét chỉ tay'}</span>
          </button>

          <button
            type="button"
            onClick={handleResetView}
            className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition cursor-pointer flex items-center gap-1 text-xs"
            title="Đặt lại góc nhìn chuẩn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mặc định</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/30 transition cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="Tải ảnh này về máy"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tải ảnh</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng khung xem ảnh"
            className="ml-1 p-2 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition cursor-pointer"
            title="Đóng (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <div
        className={`flex-1 relative overflow-hidden flex items-center justify-center ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onClick={(e) => e.stopPropagation()}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentSrc}
          alt={activeType === 'mat' ? 'Ảnh diện tướng phóng đại' : 'Ảnh thủ tướng phóng đại'}
          draggable={false}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            filter: enhanceContrast ? 'contrast(1.38) brightness(1.06) saturate(1.12)' : 'none',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out, filter 0.2s ease',
          }}
          className="max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl pointer-events-none"
        />

        {/* Bottom Helper Hint */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-slate-950/85 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2 pointer-events-none shadow-lg">
          <Move className="w-3.5 h-3.5 text-amber-400" />
          <span>Lăn chuột để Zoom (50% – 500%) • Giữ chuột kéo để soi từng vùng • Bấm &quot;Xoay trái/phải&quot; nếu ảnh bị ngược</span>
        </div>
      </div>
    </div>
  );
}
