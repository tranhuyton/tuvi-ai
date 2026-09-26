'use client';

import React from 'react';
import { CungLaSo } from '@/types/tuvi';
import { CHINH_TINH_COLORS, STAR_NGU_HANH_COLOR } from '@/lib/tuvi/constants';
import { useLanguage } from '@/context/LanguageContext';

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
  const { tCung, language } = useLanguage();
  const displayName = tCung(cung.cungName);
  const thanLabel = language === 'zh' ? '身' : language === 'ko' ? '신' : language === 'en' ? 'BODY' : 'THÂN';

  return (
    <div
      className={`bg-white flex flex-col relative overflow-hidden px-1 py-0.5 select-none text-black font-sans ${className}`}
      style={style}
    >
      {/* 1. Header Cung: Can Chi - Tên Cung - Đại Vận */}
      <div
        className="flex justify-between items-baseline pb-0.5 px-1 text-xs gap-1"
        style={{ paddingTop: '11px' }}
      >
        {/* Can Chi viết tắt (VD: Q. Tị, G. Ngọ, Ấ. Mùi...) */}
        <span className="font-bold text-[#003399] text-[10.5px] sm:text-[11px] whitespace-nowrap shrink-0">
          {cung.canChi}
        </span>

        {/* Tên Cung (VD: MỆNH, PHỤ MẪU, PHÚC ĐỨC THÂN...) */}
        <span
          className="font-bold uppercase tracking-wide text-center text-[#003399] text-[10.5px] sm:text-[11.5px] flex items-center justify-center whitespace-nowrap min-w-0"
          title={displayName !== cung.cungName ? `${cung.cungName} (${displayName})` : cung.cungName}
        >
          <span>{displayName}</span>
          {cung.isThan && (
            <span className="text-red-600 font-bold ml-1 text-[10.5px] sm:text-[11.5px]">
              {thanLabel}
            </span>
          )}
        </span>

        {/* Đại Vận */}
        <span className="font-bold text-black text-[10.5px] sm:text-[11px] text-right whitespace-nowrap shrink-0">
          {cung.daiVan}
        </span>
      </div>

      {/* 2. Chính Tinh (Nằm chính giữa trên) */}
      <div className="text-center font-bold text-xs sm:text-[13px] leading-tight my-0.5 min-h-[34px] flex flex-col justify-center gap-0.5">
        {cung.chinhTinh.length > 0 &&
          cung.chinhTinh.map((ct, idx) => {
            const starColor = CHINH_TINH_COLORS[ct.ten] || STAR_NGU_HANH_COLOR[ct.ten] || ct.color || '#000000';
            return (
              <div key={idx} style={{ color: starColor }} className="whitespace-nowrap">
                <span>{ct.ten}</span>
                {ct.dacHam && (
                  <span className="text-[10px] sm:text-[11px] font-sans font-normal ml-0.5">
                    ({ct.dacHam})
                  </span>
                )}
              </div>
            );
          })}
      </div>

      {/* 3. Phụ Tinh (Cột Tốt bên trái, Cột Xấu bên phải) */}
      <div className="flex justify-between text-[10px] sm:text-[11px] leading-tight flex-grow px-0.5 my-0.5 gap-0.5">
        {/* Cột Trái: Sao tốt / Cát tinh */}
        <div className="w-[50%] text-left space-y-0.5 pr-0.5 min-w-0">
          {cung.phuTinhTot.map((sao, idx) => {
            const isLuuStar = sao.isLuu || sao.ten.startsWith('L.') || sao.ten.startsWith('LN.');
            const isBold = !isLuuStar && (BOLD_STARS.has(sao.ten) || sao.ten.startsWith('Hóa'));
            const starColor = STAR_NGU_HANH_COLOR[sao.ten] || sao.color || '#000000';
            return (
              <div
                key={idx}
                className="flex items-baseline whitespace-nowrap tracking-tight"
                style={{ color: starColor }}
                title={`${sao.ten}${sao.dacHam ? ` (${sao.dacHam})` : ''}`}
              >
                <span className={isBold ? 'font-bold' : 'font-medium'}>
                  {sao.ten}
                </span>
                {sao.dacHam && (
                  <span className="text-[8.5px] sm:text-[9.5px] ml-0.5 opacity-90 font-normal">
                    ({sao.dacHam})
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Cột Phải: Sát tinh / Bại tinh */}
        <div className="w-[50%] text-left space-y-0.5 pl-0.5 min-w-0">
          {cung.phuTinhXau.map((sao, idx) => {
            const isLuuStar = sao.isLuu || sao.ten.startsWith('L.') || sao.ten.startsWith('LN.');
            const isBold = !isLuuStar && (BOLD_STARS.has(sao.ten) || sao.ten === 'Hóa Kỵ' || sao.ten === 'Hóa Kị');
            const starColor = STAR_NGU_HANH_COLOR[sao.ten] || sao.color || '#cc0000';
            return (
              <div
                key={idx}
                className="flex items-baseline whitespace-nowrap tracking-tight"
                style={{ color: starColor }}
                title={`${sao.ten}${sao.dacHam ? ` (${sao.dacHam})` : ''}`}
              >
                <span className={isBold ? 'font-bold' : 'font-medium'}>
                  {sao.ten}
                </span>
                {sao.dacHam && (
                  <span className="text-[8.5px] sm:text-[9.5px] ml-0.5 opacity-90 font-normal">
                    ({sao.dacHam})
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Footer: Tiểu Vận - Vòng Trường Sinh - Nguyệt Vận */}
      <div
        className="flex justify-between items-baseline text-[8.5px] sm:text-[9px] border-t border-slate-300 mt-auto text-black px-1 gap-1"
        style={{ paddingTop: '4px', paddingBottom: '10px' }}
      >
        <span className="whitespace-nowrap text-left text-slate-800 shrink-0">
          {cung.tieuVan.startsWith('năm') ? cung.tieuVan : `năm ${cung.tieuVan}`}
        </span>
        <span className="font-bold text-black whitespace-nowrap px-0.5 text-center shrink-0">
          {cung.truongSinh}
        </span>
        <span className="whitespace-nowrap text-right text-slate-800 shrink-0">
          {cung.nguyetVan.startsWith('tháng') ? cung.nguyetVan : `tháng ${cung.nguyetVan}`}
        </span>
      </div>
    </div>
  );
}

