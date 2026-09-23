'use client';

import React, { useRef, useState, useEffect } from 'react';
import { LaSoData } from '@/types/tuvi';
import CungView from './CungView';
import { GIO_ARR } from '@/lib/tuvi/constants';
import { Download, RefreshCw, ZoomIn, ZoomOut, BookOpen } from 'lucide-react';

interface LaSoBanCoProps {
  laSo: LaSoData;
  onReset: () => void;
  onOpenSavedCharts?: () => void;
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

// Tọa độ 12 cung tiếp xúc với viền Thiên Bàn trung tâm (tính theo % của Thiên Bàn: 0% -> 100%)
const THIEN_BAN_POINTS: Record<number, [number, number]> = {
  0: [75, 100],  // Tý (viền dưới, bên phải)
  1: [25, 100],  // Sửu (viền dưới, bên trái)
  2: [0, 100],   // Dần (góc dưới trái)
  3: [0, 75],    // Mão (viền trái, bên dưới)
  4: [0, 25],    // Thìn (viền trái, bên trên)
  5: [0, 0],     // Tỵ (góc trên trái)
  6: [25, 0],    // Ngọ (viền trên, bên trái)
  7: [75, 0],    // Mùi (viền trên, bên phải)
  8: [100, 0],   // Thân (góc trên phải)
  9: [100, 25],  // Dậu (viền phải, bên trên)
  10: [100, 75], // Tuất (viền phải, bên dưới)
  11: [100, 100] // Hợi (góc dưới phải)
};

const TT_COORDS: Record<number, { l: string; t: string }> = {
  0: { l: '50%', t: '87.5%' },
  2: { l: '12.5%', t: '75%' },
  4: { l: '12.5%', t: '25%' },
  6: { l: '50%', t: '12.5%' },
  8: { l: '87.5%', t: '25%' },
  10: { l: '87.5%', t: '75%' },
};

export default function LaSoBanCo({ laSo, onReset, onOpenSavedCharts }: LaSoBanCoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardInnerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);
  const [boardHeight, setBoardHeight] = useState(880);
  const [isFitMode, setIsFitMode] = useState(true);

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

  // Tự động đo và co giãn lá số vừa khít chiều ngang màn hình điện thoại
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current && boardInnerRef.current) {
        const cWidth = containerRef.current.clientWidth;
        const bHeight = boardInnerRef.current.offsetHeight;
        if (bHeight > 0) {
          setBoardHeight(bHeight);
        }
        const targetWidth = 760;
        if (cWidth < targetWidth && isFitMode) {
          setScale(cWidth / targetWidth);
        } else {
          setScale(1);
        }
      }
    };

    updateSize();
    const timer = setTimeout(updateSize, 120);
    window.addEventListener('resize', updateSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateSize);
    };
  }, [isFitMode, cungs]);

  const gioObj = GIO_ARR[duongSo.gioSinhVal];
  const gioMatch = gioObj?.label.match(/\((.*?)\)/);
  const gioText = gioMatch ? gioMatch[1] : (gioObj?.label || duongSo.gioSinhVal);

  const safeMenhIdx =
    typeof menhCungIdx === 'number' && !isNaN(menhCungIdx) && menhCungIdx in THIEN_BAN_POINTS
      ? menhCungIdx
      : (cungs.find((c) => c.cungName.includes('Mệnh'))?.cungId ?? 2);

  // 1 điểm duy nhất xuất phát từ Cung Mệnh
  const pM = THIEN_BAN_POINTS[safeMenhIdx] || [0, 100];
  // 3 điểm đích tương ứng: Tài Bạch, Quan Lộc, và Thiên Di (Chính chiếu)
  const taiCung = cungs.find((c) => c.cungName.includes('Tài'));
  const quanCung = cungs.find((c) => c.cungName.includes('Quan'));
  const diCung = cungs.find((c) => c.cungName.includes('Di'));

  const pTai = taiCung ? (THIEN_BAN_POINTS[taiCung.cungId] || [0, 25]) : (THIEN_BAN_POINTS[(safeMenhIdx + 8) % 12] || [0, 25]);
  const pQuan = quanCung ? (THIEN_BAN_POINTS[quanCung.cungId] || [100, 0]) : (THIEN_BAN_POINTS[(safeMenhIdx + 4) % 12] || [100, 0]);
  const pDi = diCung ? (THIEN_BAN_POINTS[diCung.cungId] || [25, 0]) : (THIEN_BAN_POINTS[(safeMenhIdx + 6) % 12] || [25, 0]);

  const handleDownload = async () => {
    try {
      setIsExporting(true);
      const htmlToImage = await import('html-to-image');
      if (boardInnerRef.current) {
        const node = boardInnerRef.current;
        const fullHeight = node.scrollHeight || node.offsetHeight || boardHeight;

        // Chụp toàn bộ 100% lá số với độ phân giải cao sắc nét (2x)
        const dataUrl = await htmlToImage.toPng(node, {
          quality: 0.98,
          pixelRatio: 2,
          width: 760,
          height: fullHeight,
          style: {
            transform: 'none',
            width: '760px',
            margin: '0',
            backgroundColor: '#ffffff',
          },
        });

        const fileName = `La_So_Tu_Vi_${duongSo.hoTen.replace(/\s+/g, '_')}.png`;

        // Trên điện thoại: Ưu tiên mở Share Sheet để người dùng bấm "Lưu hình ảnh" vào Thư viện ảnh
        if (typeof navigator !== 'undefined' && navigator.share) {
          try {
            const res = await fetch(dataUrl);
            const blob = await res.blob();
            const file = new File([blob], fileName, { type: 'image/png' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
              await navigator.share({
                files: [file],
                title: `Lá Số Tử Vi - ${duongSo.hoTen}`,
                text: `Lá số Tử Vi của ${duongSo.hoTen} - Tử Vi Thầy Tôn`,
              });
              return;
            }
          } catch (shareErr: any) {
            // Nếu người dùng chỉ bấm Hủy (AbortError) thì kết thúc bình thường
            if (shareErr.name === 'AbortError') return;
          }
        }

        // Tải file trực tiếp nếu là Desktop hoặc trình duyệt không hỗ trợ Share Sheet
        const link = document.createElement('a');
        link.download = fileName;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Lỗi xuất ảnh lá số:', err);
      alert('Không thể xuất ảnh lúc này. Xin quý khách vui lòng thử lại sau.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-[760px] mx-auto">
      {/* Thanh công cụ thao tác */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3 print:hidden px-1">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 sm:py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-600 text-sm font-semibold transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>Lập Lá Số Mới</span>
          </button>

          {onOpenSavedCharts && (
            <button
              type="button"
              onClick={onOpenSavedCharts}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 sm:py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-amber-200 rounded-xl border border-amber-500/40 text-sm font-bold transition cursor-pointer shadow-sm"
              title="Xem danh sách các lá số đã lưu"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Sổ Tay Số Mệnh</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Nút bật/tắt phóng to trên mobile nếu chiều rộng màn hình nhỏ */}
          {scale < 1 || !isFitMode ? (
            <button
              type="button"
              onClick={() => setIsFitMode(!isFitMode)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 sm:py-2 bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-600 text-sm font-medium transition cursor-pointer"
              title={isFitMode ? 'Phóng to 100%' : 'Co vừa màn hình'}
            >
              {isFitMode ? (
                <>
                  <ZoomIn className="w-4 h-4 text-blue-400" />
                  <span>Phóng To</span>
                </>
              ) : (
                <>
                  <ZoomOut className="w-4 h-4 text-emerald-400" />
                  <span>Vừa Màn Hình</span>
                </>
              )}
            </button>
          ) : null}

          {/* Nút Tải ảnh lá số */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 sm:py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Đang xuất ảnh...' : 'Tải Ảnh Lá Số'}</span>
          </button>
        </div>
      </div>

      {/* Khung chứa lá số - Tự động co giãn theo chiều rộng màn hình mobile & căn giữa chuẩn xác */}
      <div
        ref={containerRef}
        className="w-full max-w-[760px] mx-auto relative bg-white rounded-xl shadow-xl overflow-hidden print:p-0 print:shadow-none"
        style={{
          height: scale < 1 && isFitMode ? `${boardHeight * scale}px` : 'auto',
          overflowX: scale < 1 && isFitMode ? 'hidden' : 'auto',
        }}
      >
        <div
          ref={boardInnerRef}
          className="w-[760px] mx-auto relative bg-white p-2 sm:p-4 select-none"
          style={{
            transform: scale < 1 && isFitMode ? `scale(${scale})` : 'none',
            transformOrigin: 'top left',
          }}
        >
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
              className="bg-white flex relative z-0 p-3 sm:p-5 select-none font-sans text-black overflow-hidden"
              style={{
                gridColumn: '2 / 4',
                gridRow: '2 / 4',
              }}
            >
              {/* SVG 3 đường kẻ xuất phát từ 1 điểm Cung Mệnh sang Tài Bạch, Quan Lộc và Thiên Di (Màu nhạt mờ ẩn dưới chữ: z-0) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                {/* 1. Kéo từ 1 điểm Cung Mệnh sang Cung Tài Bạch */}
                <line
                  x1={`${pM[0]}%`}
                  y1={`${pM[1]}%`}
                  x2={`${pTai[0]}%`}
                  y2={`${pTai[1]}%`}
                  stroke="rgba(0, 0, 0, 0.2)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                {/* 2. Kéo từ 1 điểm Cung Mệnh sang Cung Quan Lộc */}
                <line
                  x1={`${pM[0]}%`}
                  y1={`${pM[1]}%`}
                  x2={`${pQuan[0]}%`}
                  y2={`${pQuan[1]}%`}
                  stroke="rgba(0, 0, 0, 0.2)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                {/* 3. Kéo từ 1 điểm Cung Mệnh sang Cung Thiên Di (Đối cung / Chính chiếu) */}
                <line
                  x1={`${pM[0]}%`}
                  y1={`${pM[1]}%`}
                  x2={`${pDi[0]}%`}
                  y2={`${pDi[1]}%`}
                  stroke="rgba(0, 0, 0, 0.2)"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Cột thông tin đương số (Nằm đè lên trên đường kẻ: relative z-10) */}
              <div className="relative z-10 w-full max-w-[340px] sm:max-w-[370px] text-xs sm:text-[13px] leading-relaxed text-black">
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
