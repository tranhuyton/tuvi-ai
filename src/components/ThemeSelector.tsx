'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemeId } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Palette, Check, Pipette, X } from 'lucide-react';

export default function ThemeSelector({ className = '' }: { className?: string }) {
  const { theme, setTheme, customColor, setCustomColor, themes, currentThemeConfig } = useTheme();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài hoặc bấm Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const quickCustomSwatches = [
    { hex: '#0f172a', name: 'Navy Đêm' },
    { hex: '#022c22', name: 'Rừng Xanh' },
    { hex: '#4c0519', name: 'Rượu Vang' },
    { hex: '#1e1b4b', name: 'Thạch Anh' },
    { hex: '#18181b', name: 'Than Chì' },
  ];

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Nút Kích Hoạt Mở Menu Theme */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
          isOpen
            ? 'bg-slate-800 text-amber-300 border-amber-400/80 shadow-md shadow-amber-500/15'
            : 'bg-slate-950/70 hover:bg-slate-800/80 text-slate-300 hover:text-white border-slate-700/80 shadow-inner'
        }`}
        title={t('theme.btnTitle', 'Đổi màu nền giao diện')}
        aria-label="Chọn màu nền trang"
        aria-expanded={isOpen}
      >
        <Palette className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm transition-transform ring-1 ring-white/30"
          style={{ backgroundColor: currentThemeConfig.color }}
        />
        <span className="hidden xl:inline text-[11px] font-medium tracking-tight">
          {t('theme.btnLabel', 'Giao diện')}
        </span>
      </button>

      {/* Dropdown Bảng Chọn Màu Nền */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[295px] sm:w-[340px] p-3 rounded-2xl bg-slate-900/98 border border-amber-500/50 shadow-2xl backdrop-blur-xl z-50 text-slate-100 animate-fade-in divide-y divide-slate-800">
          {/* Header */}
          <div className="pb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400 text-sm">
                🎨
              </span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-amber-300 font-serif">
                  {t('theme.title', 'Chọn Màu Nền Giao Diện')}
                </h4>
                <p className="text-[10.5px] text-slate-400 leading-tight">
                  {t('theme.subtitle', 'Đổi sắc thái hợp bản mệnh & phong thủy')}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
              title="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Danh Sách Các Theme Định Sẵn */}
          <div className="py-2.5 space-y-1.5 max-h-[300px] overflow-y-auto pr-0.5">
            {themes.map((item) => {
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTheme(item.id);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-400/60 shadow-sm'
                      : 'hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Hộp Preview Màu */}
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 shadow-inner border border-white/20 relative"
                      style={{ backgroundColor: item.bgHex }}
                    >
                      <span className="relative z-10">{item.icon}</span>
                      <span
                        className="absolute inset-0 rounded-lg opacity-40"
                        style={{
                          background: `radial-gradient(circle, ${item.color} 0%, transparent 70%)`,
                        }}
                      />
                    </div>

                    {/* Tên & Mô tả */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs font-bold truncate ${
                            isSelected ? 'text-amber-300' : 'text-slate-200 group-hover:text-amber-200'
                          }`}
                        >
                          {t(item.nameKey, item.defaultName)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[200px] sm:max-w-[230px]">
                        {t(item.descKey, item.defaultDesc)}
                      </p>
                    </div>
                  </div>

                  {/* Icon Check khi được chọn */}
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/40">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Khu Vực Tùy Chỉnh Màu Tự Do */}
          <div className="pt-2.5 mt-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                <Pipette className="w-3 h-3 text-amber-400" />
                <span>{t('theme.customOption', 'Tự chọn màu riêng:')}</span>
              </span>
              <div className="flex items-center gap-1.5">
                <label
                  className="flex items-center gap-1 text-[10.5px] px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 cursor-pointer font-mono"
                  title="Nhấn để mở bảng mã màu chi tiết"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-white/40 shadow-sm shrink-0"
                    style={{ backgroundColor: customColor }}
                  />
                  <span>{customColor.toUpperCase()}</span>
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      if (theme !== 'custom') {
                        setTheme('custom');
                      }
                    }}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            {/* Các ô màu gợi ý nhanh */}
            <div className="flex items-center gap-1.5">
              {quickCustomSwatches.map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => {
                    setCustomColor(swatch.hex);
                    setTheme('custom');
                  }}
                  title={swatch.name}
                  className={`flex-1 h-6 rounded-lg transition-transform hover:scale-105 border cursor-pointer relative ${
                    theme === 'custom' && customColor.toLowerCase() === swatch.hex.toLowerCase()
                      ? 'border-amber-400 ring-2 ring-amber-400/40'
                      : 'border-slate-700 hover:border-slate-500'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
