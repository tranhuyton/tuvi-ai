'use client';

import React from 'react';
import { CungLaSo } from '@/types/tuvi';

interface CungViewProps {
  cung: CungLaSo;
  className?: string;
  style?: React.CSSProperties;
}

const BOLD_STARS = new Set([
  'Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ',
  'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh',
  'Địa Không', 'Địa Kiếp', 'Thiên Không',
  'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt',
  'Tả Phù', 'Hữu Bật', 'Lộc Tồn',
]);

export default function CungView({ cung, className = '', style }: CungViewProps) {
  return (
    <div
      className={`bg-white flex flex-col relative overflow-hidden p-1 sm:p-1.5 select-none text-black font-sans ${className}`}
      style={style}
    >
      {/* 1. Header Cung: Can Chi - Tên Cung - Đại Vận */}
      <div className="flex justify-between items-baseline pt-0.5 pb-1 px-0.5 text-xs">
        {/* Can Chi viết tắt (VD: Q. Tị, G. Ngọ, Ấ. Mùi...) */}
        <span className="font-bold text-[#003399] text-[11px] sm:text-xs">
          {cung.canChi}
        </span>

        {/* Tên Cung (VD: MỆNH, PHỤ MẪU, PHÚC ĐỨC THÂN...) */}
        <span className="font-bold uppercase tracking-wider text-center text-[#003399] text-[11px] sm:text-xs flex items-center justify-center">
          <span>{cung.cungName}</span>
          {cung.isThan && (
            <span className="text-red-600 font-bold ml-1 text-[11px] sm:text-xs">THÂN</span>
          )}
        </span>

        {/* Đại Vận */}
        <span className="font-bold text-black text-[11px] sm:text-xs text-right">
          {cung.daiVan}
        </span>
      </div>

      {/* 2. Chính Tinh (Nằm chính giữa trên) */}
      <div className="text-center font-bold text-xs sm:text-[13px] leading-tight my-0.5 min-h-[34px] flex flex-col justify-center gap-0.5">
        {cung.chinhTinh.length > 0 &&
          cung.chinhTinh.map((ct, idx) => (
            <div key={idx} style={{ color: ct.color || '#000000' }}>
              <span>{ct.ten}</span>
              {ct.dacHam && (
                <span className="text-[10px] sm:text-[11px] font-sans font-normal ml-0.5">
                  ({ct.dacHam})
                </span>
              )}
            </div>
          ))}
      </div>

      {/* 3. Phụ Tinh (Cột Tốt bên trái, Cột Xấu bên phải) */}
      <div className="flex justify-between text-[10px] sm:text-[11px] leading-tight flex-grow px-0.5 my-1">
        {/* Cột Trái: Sao tốt / Cát tinh */}
        <div className="w-[50%] text-left space-y-0.5 pr-0.5">
          {cung.phuTinhTot.map((sao, idx) => {
            const isBold = BOLD_STARS.has(sao.ten) || sao.ten.startsWith('Hóa');
            return (
              <div
                key={idx}
                className="truncate"
                style={{ color: sao.color || '#000000' }}
                title={sao.ten}
              >
                <span className={isBold ? 'font-bold' : ''}>
                  {sao.ten}
                </span>
                {sao.dacHam && (
                  <span className="text-[9.5px] ml-0.5 opacity-90 font-normal">
                    ({sao.dacHam})
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Cột Phải: Sát tinh / Bại tinh */}
        <div className="w-[50%] text-left space-y-0.5 pl-1">
          {cung.phuTinhXau.map((sao, idx) => {
            const isBold = BOLD_STARS.has(sao.ten) || sao.ten === 'Hóa Kỵ';
            return (
              <div
                key={idx}
                className="truncate"
                style={{ color: sao.color || '#cc0000' }}
                title={sao.ten}
              >
                <span className={isBold ? 'font-bold' : ''}>
                  {sao.ten}
                </span>
                {sao.dacHam && (
                  <span className="text-[9.5px] ml-0.5 opacity-90 font-normal">
                    ({sao.dacHam})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Footer: Tiểu Vận - Vòng Trường Sinh - Nguyệt Vận */}
      <div className="flex justify-between items-baseline text-[9.5px] sm:text-[10.5px] pt-1 border-t border-slate-300 mt-auto text-black px-0.5">
        <span className="w-[32%] truncate text-left">
          {cung.tieuVan.startsWith('năm') ? cung.tieuVan : `năm ${cung.tieuVan}`}
        </span>
        <span className="w-[36%] text-center font-bold text-black truncate">
          {cung.truongSinh}
        </span>
        <span className="w-[32%] text-right truncate">
          {cung.nguyetVan.startsWith('tháng') ? cung.nguyetVan : `tháng ${cung.nguyetVan}`}
        </span>
      </div>
    </div>
  );
}

