'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { LaSoData, CungLaSo } from '@/types/tuvi';
import CungView from './CungView';
import { GIO_ARR, CHINH_TINH_COLORS, STAR_NGU_HANH_COLOR } from '@/lib/tuvi/constants';
import { computeTamHanAnalysis } from '@/lib/tuvi/anSao';
import { sanitizeVietnameseFileName } from '@/lib/tuvi/cleanReadingHtml';
import { Download, RefreshCw, ZoomIn, ZoomOut, BookOpen, Pencil, X, Compass, Eye } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface LaSoBanCoProps {
  laSo: LaSoData;
  onReset: () => void;
  onEdit?: () => void;
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
  0: { l: '50%', t: '75%' },     // Tý - Sửu (đường ranh giới dọc giữa Sửu col 2 và Tý col 3 tại đỉnh row 4)
  2: { l: '12.5%', t: '75%' },   // Dần - Mão (đường ranh giới ngang giữa Mão row 3 và Dần row 4)
  4: { l: '12.5%', t: '25%' },   // Thìn - Tỵ (đường ranh giới ngang giữa Tỵ row 1 và Thìn row 2)
  6: { l: '50%', t: '25%' },     // Ngọ - Mùi (đường ranh giới dọc giữa Ngọ col 2 và Mùi col 3 tại đáy row 1)
  8: { l: '87.5%', t: '25%' },   // Thân - Dậu (đường ranh giới ngang giữa Thân row 1 và Dậu row 2)
  10: { l: '87.5%', t: '75%' },  // Tuất - Hợi (đường ranh giới ngang giữa Tuất row 3 và Hợi row 4)
};

export default function LaSoBanCo({ laSo, onReset, onEdit, onOpenSavedCharts }: LaSoBanCoProps) {
  const {
    t,
    tCung,
    tCanChi,
    tNapAm,
    tTenCuc,
    tSinhKhac,
    tThanCu,
    tAmDuong,
    tThuanNghich,
    tStar,
    language,
  } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const boardInnerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [scale, setScale] = useState(1);
  const [boardHeight, setBoardHeight] = useState(880);
  const [isFitMode, setIsFitMode] = useState(true);
  const [inspectedCungId, setInspectedCungId] = useState<number | null>(null);

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

  const tamHan = computeTamHanAnalysis(laSo);
  const lndhCungId = tamHan.cungLuuNienDaiHan?.cungId;

  // Bản đồ 12 cung đã gắn sao LN.Đại Hạn (dùng chung cho Grid và Palace Inspector)
  const renderedCungs = useMemo(() => {
    return cungs.map((cung) => {
      const hasLndhStar = cung.phuTinhTot.some(
        (s) => s.ten === 'LN.Đại Hạn' || s.ten === 'LN. Đại hạn'
      );
      if (lndhCungId === cung.cungId && !hasLndhStar) {
        return {
          ...cung,
          phuTinhTot: [
            ...cung.phuTinhTot,
            {
              ten: 'LN.Đại Hạn',
              loai: 'tot' as const,
              color: '#555555',
              isLuu: true,
            },
          ],
        };
      }
      return cung;
    });
  }, [cungs, lndhCungId]);

  const inspectedCung: CungLaSo | null = useMemo(() => {
    if (inspectedCungId === null) return null;
    return renderedCungs.find((c) => c.cungId === inspectedCungId) || null;
  }, [inspectedCungId, renderedCungs]);

  const relatedPalaces = useMemo(() => {
    if (!inspectedCung) return [];
    const id = inspectedCung.cungId;
    const relations = [
      { label: 'Đối Cung (Xung Chiếu)', targetId: (id + 6) % 12 },
      { label: 'Tam Hợp 1', targetId: (id + 4) % 12 },
      { label: 'Tam Hợp 2', targetId: (id + 8) % 12 },
    ];
    return relations
      .map((rel) => {
        const found = renderedCungs.find((c) => c.cungId === rel.targetId);
        return found ? { ...rel, cung: found } : null;
      })
      .filter((x): x is { label: string; targetId: number; cung: CungLaSo } => Boolean(x));
  }, [inspectedCung, renderedCungs]);

  useEffect(() => {
    if (inspectedCungId === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInspectedCungId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inspectedCungId]);

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
        if (typeof document !== 'undefined' && document.fonts?.ready) {
          try {
            await document.fonts.ready;
          } catch {}
        }
        const fullHeight = node.scrollHeight || node.offsetHeight || boardHeight;

        // Chụp toàn bộ 100% lá số với độ phân giải cao sắc nét (2x), ẩn các nút thao tác (VD: [Đổi năm])
        const dataUrl = await htmlToImage.toPng(node, {
          quality: 0.98,
          pixelRatio: 2,
          width: 760,
          height: fullHeight,
          backgroundColor: '#ffffff',
          filter: (el) => !(el instanceof HTMLElement && el.dataset?.exportIgnore === 'true'),
          style: {
            transform: 'none',
            width: '760px',
            margin: '0',
            backgroundColor: '#ffffff',
          },
        });

        const fileName = `La_So_Tu_Vi_${sanitizeVietnameseFileName(duongSo.hoTen)}.png`;

        // Chuyển dataUrl sang Blob đồng bộ (không qua fetch) để giữ nguyên User Gesture trên iOS Safari
        const parts = dataUrl.split(',');
        const byteString = atob(parts[1] || '');
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: 'image/png' });

        // Chỉ mở Share Sheet trên điện thoại (để người dùng bấm "Lưu hình ảnh" vào Photos)
        const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
        if (isMobile && typeof navigator !== 'undefined' && navigator.share) {
          try {
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
            if (shareErr?.name === 'AbortError') return;
          }
        }

        // Tải file trực tiếp với Blob URL giữ sống 2 phút (tránh lỗi WebKitBlobResource 1 trên iOS)
        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = blobUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
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
      <div className="flex flex-wrap items-center justify-between gap-2.5 mb-3.5 p-2.5 sm:p-3 rounded-2xl imperial-card border border-amber-500/35 backdrop-blur-xl print:hidden">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700 hover:border-amber-500/40 text-xs sm:text-sm font-semibold transition cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 text-amber-400" />
            <span>{t('chart.newChartBtn', 'Lập Lá Số Mới')}</span>
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-200 hover:text-amber-100 rounded-xl border border-amber-400/50 text-xs sm:text-sm font-bold transition cursor-pointer shadow-sm"
              title="Sửa thông tin hoặc đổi năm xem để an lại lá số & bình giải nguyệt vận"
            >
              <Pencil className="w-4 h-4 text-amber-400" />
              <span>{t('chart.editChartBtn', 'Sửa Lá Số / Đổi Năm Xem')}</span>
            </button>
          )}

          {onOpenSavedCharts && (
            <button
              type="button"
              onClick={onOpenSavedCharts}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 rounded-xl border border-amber-500/35 text-xs sm:text-sm font-bold transition cursor-pointer shadow-sm"
              title="Xem danh sách các lá số đã lưu"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{t('nav.savedCharts', 'Sổ Tay Số Mệnh')}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Nút bật/tắt phóng to trên mobile nếu chiều rộng màn hình nhỏ */}
          {scale < 1 || !isFitMode ? (
            <button
              type="button"
              onClick={() => setIsFitMode(!isFitMode)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white rounded-xl border border-slate-700 text-xs sm:text-sm font-medium transition cursor-pointer"
              title={isFitMode ? 'Phóng to 100%' : 'Co vừa màn hình'}
            >
              {isFitMode ? (
                <>
                  <ZoomIn className="w-4 h-4 text-blue-400" />
                  <span>{t('chart.originalSize', 'Phóng To')}</span>
                </>
              ) : (
                <>
                  <ZoomOut className="w-4 h-4 text-emerald-400" />
                  <span>{t('chart.fitScreen', 'Vừa Màn Hình')}</span>
                </>
              )}
            </button>
          ) : null}

          {/* Nút Tải ảnh lá số */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting}
            className="btn-shimmer inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm shadow-md shadow-amber-500/20 transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? t('chart.exportingImg', 'Đang xuất ảnh...') : t('chart.downloadBtn', 'Tải Ảnh Lá Số')}</span>
          </button>
        </div>
      </div>

      {/* Mẹo chạm phóng to từng cung trên màn hình điện thoại */}
      <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-200/95 text-xs flex items-center justify-center gap-1.5 text-center print:hidden">
        <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>Chạm vào bất kỳ cung nào trên lá số để phóng to rõ nét &amp; xem Tam Phương Tứ Chính</span>
      </div>

      {/* Khung chứa lá số - Tự động co giãn theo chiều rộng màn hình mobile & căn giữa chuẩn xác */}
      <div
        ref={containerRef}
        className="w-full max-w-[760px] mx-auto relative bg-white rounded-2xl ring-2 ring-amber-500/45 shadow-2xl shadow-amber-950/50 overflow-hidden print:p-0 print:shadow-none print:ring-0"
        style={{
          height: scale < 1 && isFitMode ? `${boardHeight * scale}px` : 'auto',
          overflowX: scale < 1 && isFitMode ? 'hidden' : 'auto',
        }}
      >
        <div
          id="tuvi-board-export-node"
          ref={boardInnerRef}
          className="w-[760px] mx-auto relative bg-white p-1 sm:p-2 select-none"
          style={{
            transform: scale < 1 && isFitMode ? `scale(${scale})` : 'none',
            transformOrigin: 'top left',
          }}
        >
          {/* Grid 4x4 chuẩn xác với 4 cột và 4 hàng đồng đều 25% (1fr) theo chuẩn LySo */}
          <div
            className="grid grid-cols-4 grid-rows-4 bg-black gap-[1px] border border-black relative z-0"
          >
            {/* 12 Cung */}
            {renderedCungs.map((renderedCung) => {
              const pos = GRID_STYLES[renderedCung.cungId];
              return (
                <CungView
                  key={renderedCung.cungId}
                  cung={renderedCung}
                  onSelect={(c) => setInspectedCungId(c.cungId)}
                  isHighlighted={inspectedCungId === renderedCung.cungId}
                  className="min-h-[200px] sm:min-h-[225px]"
                  style={{
                    gridColumn: pos.gridColumn,
                    gridRow: pos.gridRow,
                  }}
                />
              );
            })}

            {/* Thiên Bàn (Trung tâm 2x2) */}
            <div
              className="bg-white relative z-0 select-none font-sans text-black overflow-hidden"
              style={{
                gridColumn: '2 / 4',
                gridRow: '2 / 4',
                paddingTop: '28px',
                paddingBottom: '16px',
                paddingLeft: '16px',
                paddingRight: '16px',
              }}
            >
              {/* SVG 3 đường kẻ xuất phát từ 1 điểm Cung Mệnh sang Tài Bạch, Quan Lộc và Thiên Di (Màu nhạt mờ ẩn dưới chữ: z-0) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full pointer-events-none z-0">
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

              {/* Cột thông tin đương số (Nằm đè lên trên đường kẻ: relative z-10)
                  LƯU Ý: Dùng kích thước cột cố định (shrink-0 whitespace-nowrap) và flex-1 whitespace-nowrap cho mọi giá trị
                  để khi html-to-image sao chép getComputedStyle vào SVG foreignObject không bị bóp width gây xuống dòng đè chữ! */}
              <div className="relative z-10 w-full text-[12px] leading-[1.45] text-black">
                {/* Họ tên */}
                <div className="flex items-baseline mb-2">
                  <span className="w-[74px] shrink-0 whitespace-nowrap text-black">{t('chart.fullName', 'Họ tên:')}</span>
                  <span className="flex-1 min-w-0 text-[#003399] font-bold text-[15px] tracking-wide">
                    {duongSo.hoTen}
                  </span>
                </div>

                {/* Bảng Năm - Tháng - Ngày - Giờ */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline text-[10px] text-gray-500 font-semibold border-b border-gray-200/80 pb-0.5 mb-0.5">
                    <span className="w-[74px] shrink-0"></span>
                    <span className="w-[54px] shrink-0 whitespace-nowrap">{t('chart.solarShort', 'Dương')}</span>
                    <span className="w-[46px] shrink-0 whitespace-nowrap">{t('chart.lunarShort', 'Âm')}</span>
                    <span className="flex-1 min-w-0 whitespace-nowrap">{t('chart.canChiHeader', 'Can Chi')}</span>
                  </div>

                  {/* Năm */}
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0 whitespace-nowrap text-black">{t('chart.year', 'Năm:')}</span>
                    <span className="w-[54px] shrink-0 whitespace-nowrap font-medium">{duongSo.namDuong}</span>
                    <span className="w-[46px] shrink-0 whitespace-nowrap text-black">{amLich.namAm}</span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tCanChi(namCanChi)}</span>
                  </div>

                  {/* Tháng */}
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0 whitespace-nowrap text-black">{t('chart.month', 'Tháng:')}</span>
                    <span className="w-[54px] shrink-0 whitespace-nowrap font-medium">{duongSo.thangDuong}</span>
                    <span className="w-[46px] shrink-0 whitespace-nowrap text-black">
                      {amLich.thangAmGoc}
                      {amLich.isLeap ? ` ${t('chart.leapShort', '(N)')}` : ''}
                    </span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tCanChi(thangCanChi)}</span>
                  </div>

                  {/* Ngày */}
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0 whitespace-nowrap text-black">{t('chart.day', 'Ngày:')}</span>
                    <span className="w-[54px] shrink-0 whitespace-nowrap font-medium">{duongSo.ngayDuong}</span>
                    <span className="w-[46px] shrink-0 whitespace-nowrap text-black">{amLich.ngayAm}</span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tCanChi(ngayCanChi)}</span>
                  </div>

                  {/* Giờ */}
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0 whitespace-nowrap text-black">{t('chart.hour', 'Giờ:')}</span>
                    <span className="w-[100px] shrink-0 whitespace-nowrap font-medium truncate pr-1">{gioText}</span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tCanChi(gioCanChi)}</span>
                  </div>
                </div>

                {/* Năm xem & Tuổi */}
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-baseline justify-between gap-1">
                    <div className="flex items-baseline flex-1 min-w-0">
                      <span className="w-[74px] shrink-0 whitespace-nowrap text-black">{t('chart.viewYear', 'Năm xem:')}</span>
                      <span className="w-[100px] shrink-0 whitespace-nowrap font-medium">{namXem}</span>
                      <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tCanChi(namXemCanChi)}</span>
                    </div>
                    {onEdit && (
                      <button
                        type="button"
                        data-export-ignore="true"
                        onClick={onEdit}
                        className="print:hidden shrink-0 whitespace-nowrap text-[10px] text-amber-700 hover:text-amber-900 font-bold underline cursor-pointer ml-1"
                        title={t('chart.editChartBtn', 'Đổi năm xem để an lại lá số và bình giải nguyệt vận')}
                      >
                        {t('chart.changeYearBtn', '[Đổi năm]')}
                      </button>
                    )}
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0"></span>
                    <span className="w-[100px] shrink-0"></span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">
                      {tuoiAmXem} {t('chart.ageUnit', 'tuổi')}
                    </span>
                  </div>
                </div>

                {/* Âm Dương */}
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0 whitespace-nowrap text-black">{t('chart.yinYang', 'Âm Dương:')}</span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tAmDuong(amDuongTxt)}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0"></span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tThuanNghich(thuanNghichLy)}</span>
                  </div>
                </div>

                {/* Mệnh & Cục */}
                <div className="mt-1.5 space-y-0.5">
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0 whitespace-nowrap text-black">{t('chart.menh', 'Mệnh:')}</span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tNapAm(napAmMenh || banMenh)}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0 whitespace-nowrap text-black">{t('chart.cuc', 'Cục:')}</span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tTenCuc(tenCuc)}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0"></span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tSinhKhac(sinhKhac)}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0"></span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tThanCu(thanCuName)}</span>
                  </div>
                </div>

                {/* Mệnh chủ & Thân chủ */}
                <div className="mt-2 space-y-0.5">
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0 whitespace-nowrap text-black">{t('chart.menhChu', 'Mệnh chủ:')}</span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tStar(menhChu)}</span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="w-[74px] shrink-0 whitespace-nowrap text-black">{t('chart.thanChu', 'Thân chủ:')}</span>
                    <span className="flex-1 min-w-0 whitespace-nowrap text-[#003399] font-bold">{tStar(thanChu)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Huy hiệu TUẦN và TRIỆT đặt chuẩn xác trên các đường ranh giới của Grid */}
            {tuanGoc === trietGoc ? (
              <div
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] select-none gap-1 pointer-events-none tracking-wider"
                style={{ left: TT_COORDS[tuanGoc]?.l, top: TT_COORDS[tuanGoc]?.t }}
              >
                <span>{t('chart.triet', 'Triệt')}</span>
                <span className="opacity-40">/</span>
                <span>{t('chart.tuan', 'Tuần')}</span>
              </div>
            ) : (
              <>
                {TT_COORDS[tuanGoc] && (
                  <div
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[10px] sm:text-[10.5px] font-bold px-2 py-0.5 rounded-[2px] select-none text-center leading-none pointer-events-none tracking-wider"
                    style={{ left: TT_COORDS[tuanGoc]?.l, top: TT_COORDS[tuanGoc]?.t }}
                  >
                    {t('chart.tuan', 'Tuần')}
                  </div>
                )}
                {TT_COORDS[trietGoc] && (
                  <div
                    className="absolute z-20 -translate-x-1/2 -translate-y-1/2 bg-black text-white text-[10px] sm:text-[10.5px] font-bold px-2 py-0.5 rounded-[2px] select-none text-center leading-none pointer-events-none tracking-wider"
                    style={{ left: TT_COORDS[trietGoc]?.l, top: TT_COORDS[trietGoc]?.t }}
                  >
                    {t('chart.triet', 'Triệt')}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal Phóng To Chi Tiết Từng Cung (Mobile-Friendly Palace Inspector) */}
      {inspectedCung && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm print:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={`Chi tiết cung ${inspectedCung.cungName}`}
          onClick={() => setInspectedCungId(null)}
        >
          <div
            className="w-full max-w-lg bg-white text-slate-900 rounded-2xl border-2 border-amber-500/70 shadow-2xl overflow-hidden max-h-[88vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Cung */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    {tCanChi(inspectedCung.canChi)}
                  </span>
                  <h3 className="font-serif font-extrabold text-lg sm:text-xl uppercase tracking-wide text-amber-300">
                    {tCung(inspectedCung.cungName)}
                    {inspectedCung.isThan && (
                      <span className="ml-1.5 px-1.5 py-0.5 text-xs rounded bg-red-600 text-white align-middle">
                        THÂN
                      </span>
                    )}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap">
                  <span>Đại vận: <strong className="text-white">{inspectedCung.daiVan}</strong></span>
                  <span>•</span>
                  <span>Tiểu vận: <strong className="text-white">{inspectedCung.tieuVan}</strong></span>
                  <span>•</span>
                  <span>Trường sinh: <strong className="text-amber-300">{inspectedCung.truongSinh}</strong></span>
                  <span>•</span>
                  <span>{inspectedCung.nguyetVan}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectedCungId(null)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/80 transition cursor-pointer shrink-0"
                aria-label="Đóng chi tiết cung"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nội dung Sao */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {/* Chính Tinh */}
              <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3.5 text-center">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1.5">
                  Chính Tinh Tọa Thủ
                </div>
                {inspectedCung.chinhTinh.length > 0 ? (
                  <div className="flex items-center justify-center gap-3 flex-wrap">
                    {inspectedCung.chinhTinh.map((ct, idx) => {
                      const starColor = CHINH_TINH_COLORS[ct.ten] || STAR_NGU_HANH_COLOR[ct.ten] || ct.color || '#000000';
                      return (
                        <span
                          key={idx}
                          style={{ color: starColor }}
                          className="text-base sm:text-lg font-extrabold"
                        >
                          {language === 'vi' ? ct.ten : tStar(ct.ten)}
                          {ct.dacHam ? <span className="text-sm font-semibold ml-1">({ct.dacHam})</span> : null}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-slate-600 italic">
                    Vô Chính Diệu — Xét chính tinh xung chiếu từ Đối Cung &amp; Tam Hợp bên dưới
                  </div>
                )}
              </div>

              {/* Phụ Tinh 2 Cột Rõ Nét */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-emerald-800 border-b border-slate-200 pb-1.5 mb-2">
                    Cát Tinh &amp; Sao Tốt ({inspectedCung.phuTinhTot.length})
                  </div>
                  <div className="space-y-1.5 text-sm">
                    {inspectedCung.phuTinhTot.map((sao, idx) => {
                      const starColor = STAR_NGU_HANH_COLOR[sao.ten] || sao.color || '#111827';
                      return (
                        <div key={idx} style={{ color: starColor }} className="font-semibold leading-snug">
                          {sao.ten}
                          {sao.dacHam ? <span className="text-xs font-normal ml-1 opacity-85">({sao.dacHam})</span> : null}
                        </div>
                      );
                    })}
                    {inspectedCung.phuTinhTot.length === 0 && (
                      <div className="text-xs text-slate-400 italic">Không có</div>
                    )}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
                  <div className="text-xs font-extrabold uppercase tracking-wide text-red-800 border-b border-slate-200 pb-1.5 mb-2">
                    Sát Tinh &amp; Bại Tinh ({inspectedCung.phuTinhXau.length})
                  </div>
                  <div className="space-y-1.5 text-sm">
                    {inspectedCung.phuTinhXau.map((sao, idx) => {
                      const starColor = STAR_NGU_HANH_COLOR[sao.ten] || sao.color || '#b91c1c';
                      return (
                        <div key={idx} style={{ color: starColor }} className="font-semibold leading-snug">
                          {sao.ten}
                          {sao.dacHam ? <span className="text-xs font-normal ml-1 opacity-85">({sao.dacHam})</span> : null}
                        </div>
                      );
                    })}
                    {inspectedCung.phuTinhXau.length === 0 && (
                      <div className="text-xs text-slate-400 italic">Không có</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Chuyển nhanh Tam Phương Tứ Chính */}
              {relatedPalaces.length > 0 && (
                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5 uppercase tracking-wide">
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>Soi Nhanh Tam Phương Tứ Chính Hội Chiếu:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {relatedPalaces.map((rel) => (
                      <button
                        key={rel.targetId}
                        type="button"
                        onClick={() => setInspectedCungId(rel.targetId)}
                        className="text-left px-3 py-2 rounded-xl bg-slate-100 hover:bg-amber-100 border border-slate-200 hover:border-amber-400 transition cursor-pointer"
                      >
                        <div className="text-[10px] font-bold uppercase text-amber-700">{rel.label}</div>
                        <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                          {tCung(rel.cung.cungName)} ({rel.cung.chi})
                        </div>
                        <div className="text-[11px] text-slate-600 truncate">
                          {rel.cung.chinhTinh.length > 0
                            ? rel.cung.chinhTinh.map((s) => s.ten).join(', ')
                            : 'Vô Chính Diệu'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
