'use client';

import React, { useRef, useState } from 'react';
import { LaSoData } from '@/types/tuvi';
import CungView from './CungView';
import { GIO_ARR } from '@/lib/tuvi/constants';
import { Download, RefreshCw, Printer } from 'lucide-react';

interface LaSoBanCoProps {
  laSo: LaSoData;
  onReset: () => void;
}

const GRID_STYLES: Record<number, { gridColumn: number; gridRow: number }> = {
  0: { gridColumn: 3, gridRow: 4 }, // Tý
  1: { gridColumn: 2, gridRow: 4 }, // Sửu
  2: { gridColumn: 1, gridRow: 4 }, // Dần
  3: { gridColumn: 1, gridRow: 3 }, // Mão
  4: { gridColumn: 1, gridRow: 2 }, // Thìn
  5: { gridColumn: 1, gridRow: 1 }, // Tỵ
  6: { gridColumn: 2, gridRow: 1 }, // Ngọ
  7: { gridColumn: 3, gridRow: 1 }, // Mùi
  8: { gridColumn: 4, gridRow: 1 }, // Thân
  9: { gridColumn: 4, gridRow: 2 }, // Dậu
  10: { gridColumn: 4, gridRow: 3 }, // Tuất
  11: { gridColumn: 4, gridRow: 4 }, // Hợi
};

const COORD_PERCENT: Record<number, [number, number]> = {
  0: [62.5, 87.5],
  1: [37.5, 87.5],
  2: [12.5, 87.5],
  3: [12.5, 62.5],
  4: [12.5, 37.5],
  5: [12.5, 12.5],
  6: [37.5, 12.5],
  7: [62.5, 12.5],
  8: [87.5, 12.5],
  9: [87.5, 37.5],
  10: [87.5, 62.5],
  11: [87.5, 87.5],
};

const TT_COORDS: Record<number, { l: string; t: string }> = {
  0: { l: '50%', t: '87.5%' },
  2: { l: '12.5%', t: '75%' },
  4: { l: '12.5%', t: '25%' },
  6: { l: '50%', t: '12.5%' },
  8: { l: '87.5%', t: '25%' },
  10: { l: '87.5%', t: '75%' },
};

export default function LaSoBanCo({ laSo, onReset }: LaSoBanCoProps) {
  const banCoRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const {
    duongSo,
    amLich,
    namCanChi,
    thangCanChi,
    ngayCanChi,
    gioCanChi,
    amDuongTxt,
    thuanNghichLy,
    banMenh,
    napAmMenh,
    tenCuc,
    sinhKhac,
    thanCuName,
    menhChu,
    thanChu,
    menhCungIdx,
    tuanGoc,
    trietGoc,
    namXem,
    namXemCanChi,
    tuoiAmXem,
    cungs,
  } = laSo;

  const gioMatch = GIO_ARR[duongSo.gioSinhVal]?.label.match(/\((.*?)\)/);
  const gioText = gioMatch ? gioMatch[1] : (GIO_ARR[duongSo.gioSinhVal]?.label || duongSo.gioSinhVal);

  // Tọa độ Tam hợp Mệnh - Tài - Quan
  const cM = COORD_PERCENT[menhCungIdx];
  const cTai = COORD_PERCENT[(menhCungIdx + 8) % 12];
  const cQuan = COORD_PERCENT[(menhCungIdx + 4) % 12];

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const htmlToImage = await import('html-to-image');
      if (banCoRef.current) {
        const dataUrl = await htmlToImage.toPng(banCoRef.current, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = `La_So_Tu_Vi_${duongSo.hoTen.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Lỗi xuất ảnh lá số:', err);
      alert('Không thể xuất ảnh lúc này. Bạn có thể dùng tính năng In trang (Print) để lưu thành PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-[1060px] mx-auto">
      {/* Thanh công cụ thao tác */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 print:hidden px-1">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-600 text-sm font-semibold transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Lập Lá Số Mới</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-600 text-sm font-medium transition"
          >
            <Printer className="w-4 h-4" />
            <span>In PDF</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-600/90 hover:bg-amber-600 text-white rounded-lg text-sm font-semibold shadow-md transition disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang tạo...' : 'Tải Ảnh Lá Số'}</span>
          </button>
        </div>
      </div>

      {/* Khung chứa lá số */}
      <div
        ref={banCoRef}
        className="bg-white p-2 sm:p-5 rounded-lg shadow-xl overflow-x-auto print:p-0 print:shadow-none"
      >
        <div className="min-w-[760px] relative bg-white">
          {/* SVG Overlay: Tam hợp Mệnh - Tài - Quan */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            style={{ clipPath: 'inset(25%)' }}
          >
            {/* Tam hợp: Mệnh - Tài - Quan (3 cạnh tam giác) */}
            <line
              x1={`${cM[0]}%`}
              y1={`${cM[1]}%`}
              x2={`${cTai[0]}%`}
              y2={`${cTai[1]}%`}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1.5"
            />
            <line
              x1={`${cTai[0]}%`}
              y1={`${cTai[1]}%`}
              x2={`${cQuan[0]}%`}
              y2={`${cQuan[1]}%`}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1.5"
            />
            <line
              x1={`${cQuan[0]}%`}
              y1={`${cQuan[1]}%`}
              x2={`${cM[0]}%`}
              y2={`${cM[1]}%`}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1.5"
            />
          </svg>

          {/* Huy hiệu TUẦN và TRIỆT */}
          {tuanGoc === trietGoc ? (
            <div
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] shadow-sm select-none text-center leading-tight pointer-events-none"
              style={{ left: TT_COORDS[tuanGoc]?.l, top: TT_COORDS[tuanGoc]?.t }}
            >
              Triệt
              <br />
              Tuần
            </div>
          ) : (
            <>
              {TT_COORDS[tuanGoc] && (
                <div
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] shadow-sm select-none text-center leading-tight pointer-events-none"
                  style={{ left: TT_COORDS[tuanGoc]?.l, top: TT_COORDS[tuanGoc]?.t }}
                >
                  Tuần
                </div>
              )}
              {TT_COORDS[trietGoc] && (
                <div
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded-[2px] shadow-sm select-none text-center leading-tight pointer-events-none"
                  style={{ left: TT_COORDS[trietGoc]?.l, top: TT_COORDS[trietGoc]?.t }}
                >
                  Triệt
                </div>
              )}
            </>
          )}

          {/* Grid 4x4 */}
          <div className="grid grid-cols-4 grid-rows-4 bg-black gap-[1px] border border-black relative z-0">
            {/* 12 Cung */}
            {cungs.map((cung) => {
              const pos = GRID_STYLES[cung.cungId];
              return (
                <CungView
                  key={cung.cungId}
                  cung={cung}
                  className="min-h-[195px] sm:min-h-[220px]"
                  style={{
                    gridColumn: pos.gridColumn,
                    gridRow: pos.gridRow,
                  }}
                />
              );
            })}

            {/* Thiên Bàn (Trung tâm 2x2) */}
            <div
              className="bg-white flex relative z-0 p-3 sm:p-5 select-none font-sans text-black"
              style={{
                gridColumn: '2 / 4',
                gridRow: '2 / 4',
              }}
            >
              {/* Cột thông tin đương số (Bên trái Thiên Bàn) */}
              <div className="w-full max-w-[340px] sm:max-w-[370px] text-xs sm:text-[13px] leading-relaxed text-black">
                {/* Họ tên */}
                <div className="flex items-baseline mb-2">
                  <span className="w-20 text-black">Họ tên:</span>
                  <span className="text-[#003399] font-bold text-sm sm:text-base tracking-wide">
                    {duongSo.hoTen}
                  </span>
                </div>

                {/* Bảng Năm - Tháng - Ngày - Giờ */}
                <div className="space-y-0.5">
                  {/* Năm */}
                  <div className="flex items-baseline">
                    <span className="w-20 text-black">Năm:</span>
                    <span className="w-14 font-medium">{duongSo.namDuong}</span>
                    <span className="w-10"></span>
                    <span className="text-[#003399] font-bold">{namCanChi}</span>
                  </div>

                  {/* Tháng */}
                  <div className="flex items-baseline">
                    <span className="w-20 text-black">Tháng:</span>
                    <span className="w-14 font-medium">{duongSo.thangDuong}</span>
                    <span className="w-10 text-black">
                      {amLich.thangAmGoc}
                      {amLich.isLeap ? ' (N)' : ''}
                    </span>
                    <span className="text-[#003399] font-bold">{thangCanChi}</span>
                  </div>

                  {/* Ngày */}
                  <div className="flex items-baseline">
                    <span className="w-20 text-black">Ngày:</span>
                    <span className="w-14 font-medium">{duongSo.ngayDuong}</span>
                    <span className="w-10 text-black">{amLich.ngayAm}</span>
                    <span className="text-[#003399] font-bold">{ngayCanChi}</span>
                  </div>

                  {/* Giờ */}
                  <div className="flex items-baseline">
                    <span className="w-20 text-black">Giờ:</span>
                    <span className="w-24 font-medium truncate pr-1">{gioText}</span>
                    <span className="text-[#003399] font-bold">{gioCanChi}</span>
                  </div>
                </div>

                {/* Năm xem & Tuổi */}
                <div className="mt-3 space-y-0.5">
                  <div className="flex items-baseline">
                    <span className="w-20 text-black">Năm xem:</span>
                    <span className="w-24 font-medium">{namXem}</span>
                    <span className="text-[#003399] font-bold">{namXemCanChi}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-20"></span>
                    <span className="w-24"></span>
                    <span className="text-[#003399] font-bold">{tuoiAmXem} tuổi</span>
                  </div>
                </div>

                {/* Âm Dương */}
                <div className="mt-3 space-y-0.5">
                  <div className="flex items-baseline">
                    <span className="w-20 text-black">Âm Dương:</span>
                    <span className="text-[#003399] font-bold">{amDuongTxt}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-20"></span>
                    <span className="text-[#003399] font-bold">{thuanNghichLy}</span>
                  </div>
                </div>

                {/* Mệnh & Cục */}
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-baseline">
                    <span className="w-20 text-black">Mệnh:</span>
                    <span className="text-[#003399] font-bold">{napAmMenh || banMenh}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-20 text-black">Cục:</span>
                    <span className="text-[#003399] font-bold">{tenCuc}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-20"></span>
                    <span className="text-[#003399] font-bold">{sinhKhac}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-20"></span>
                    <span className="text-[#003399] font-bold">{thanCuName}</span>
                  </div>
                </div>

                {/* Mệnh chủ & Thân chủ */}
                <div className="mt-3 space-y-0.5">
                  <div className="flex items-baseline">
                    <span className="w-20 text-black">Mệnh chủ:</span>
                    <span className="text-[#003399] font-bold">{menhChu}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-20 text-black">Thân chủ:</span>
                    <span className="text-[#003399] font-bold">{thanChu}</span>
                  </div>
                </div>
              </div>

              {/* Không gian bên phải mở rộng (Tam hợp đi qua đây, không có QR/chữ đỏ quảng cáo) */}
              <div className="flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
