import QRCode from 'qrcode';
import { DuLieuDuongSo, LaSoData, ServiceTier } from '@/types/tuvi';
import { GIO_ARR } from '@/lib/tuvi/constants';

export interface ExportPdfOptions {
  duongSo?: DuLieuDuongSo | null;
  laSo?: LaSoData | null;
  readingHtml: string;
  tier?: ServiceTier;
  chartTitle?: string;
}

/**
 * Xuất bản luận giải Tử Vi Thầy Tôn sang định dạng PDF / In ấn chuyên nghiệp.
 * Mở cửa sổ in ấn với thiết kế hoàng gia truyền thống, đầy đủ nhận diện thương hiệu,
 * mã QR website tuvithayton.vn, hotline 0935 058 688 và thông tin địa chỉ.
 */
export async function exportReadingToPdf({
  duongSo,
  laSo,
  readingHtml,
  tier = 'free',
  chartTitle,
}: ExportPdfOptions): Promise<void> {
  if (typeof window === 'undefined') return;

  const isPro = tier === 'pro' || duongSo?.tier === 'pro' || laSo?.tier === 'pro';

  // 1. Tạo mã QR chất lượng cao dẫn về website tuvithayton.vn
  let qrCodeDataUrl = '';
  try {
    qrCodeDataUrl = await QRCode.toDataURL('https://tuvithayton.vn', {
      width: 220,
      margin: 1,
      color: {
        dark: '#1e293b',
        light: '#ffffff',
      },
    });
  } catch (err) {
    console.error('Không thể tạo mã QR cho PDF:', err);
  }

  // 2. Chuẩn bị dữ liệu thân chủ
  const hoTen = duongSo?.hoTen || laSo?.duongSo?.hoTen || chartTitle || 'Đương Số';
  const gioiTinh = duongSo?.gioiTinh || laSo?.duongSo?.gioiTinh || 'Nam';
  const ngayDuong = duongSo?.ngayDuong ?? laSo?.duongSo?.ngayDuong;
  const thangDuong = duongSo?.thangDuong ?? laSo?.duongSo?.thangDuong;
  const namDuong = duongSo?.namDuong ?? laSo?.duongSo?.namDuong;
  const gioSinhKey = duongSo?.gioSinhVal || laSo?.duongSo?.gioSinhVal || '';
  const gioSinhLabel = GIO_ARR[gioSinhKey]?.label || gioSinhKey || 'Chưa xác định';

  const ngayDuongStr =
    ngayDuong && thangDuong && namDuong
      ? `${String(ngayDuong).padStart(2, '0')}/${String(thangDuong).padStart(2, '0')}/${namDuong}`
      : 'Chưa rõ';

  const amLich = laSo?.amLich;
  const ngayAmStr = amLich
    ? `Ngày ${String(amLich.ngayAm).padStart(2, '0')} tháng ${String(amLich.thangAm).padStart(2, '0')}${
        amLich.isLeap ? ' (Nhuận)' : ''
      } năm ${laSo?.namCanChi || ''}`
    : 'Chưa rõ';

  const batTuStr = [
    laSo?.namCanChi ? `Năm ${laSo.namCanChi}` : '',
    laSo?.thangCanChi ? `Tháng ${laSo.thangCanChi}` : '',
    laSo?.ngayCanChi ? `Ngày ${laSo.ngayCanChi}` : '',
    laSo?.gioCanChi ? `Giờ ${laSo.gioCanChi}` : '',
  ]
    .filter(Boolean)
    .join(' • ');

  const banMenh = laSo?.napAmMenh || laSo?.banMenh || 'Chưa rõ';
  const amDuongTxt = laSo?.amDuongTxt || '';
  const tenCuc = laSo?.tenCuc || '';
  const sinhKhac = laSo?.sinhKhac || '';
  const rawThanCu = laSo?.thanCuName || '';
  const thanCu = rawThanCu
    ? rawThanCu.startsWith('Thân cư')
      ? rawThanCu
      : `Thân cư ${rawThanCu}`
    : 'Mệnh Thân đồng cung';
  const menhChu = laSo?.menhChu ? `Mệnh chủ: ${laSo.menhChu}` : '';
  const thanChu = laSo?.thanChu ? `Thân chủ: ${laSo.thanChu}` : '';
  const namXem = laSo?.namXem || new Date().getFullYear();
  const namXemCanChi = laSo?.namXemCanChi || '';
  const tuoiAmXem = laSo?.tuoiAmXem ? `${laSo.tuoiAmXem} tuổi (tuổi mụ)` : '';

  const exportDate = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  // 3. Mở cửa sổ in ấn
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Trình duyệt đang chặn cửa sổ bật lên. Vui lòng cho phép mở popup để xuất file PDF.');
    return;
  }

  const documentTitle = `Tử Vi Thầy Tôn - Bản Bình Giải ${isPro ? 'Chuyên Sâu Pro' : 'Cơ Bản'} - ${hoTen}`;

  // 4. Xây dựng toàn bộ HTML chuyên nghiệp
  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&display=swap" rel="stylesheet">
  <style>
    /* Reset & Base Setup */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #0f172a;
      color: #1e293b;
      line-height: 1.7;
      font-size: 14px;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    /* Screen View Container */
    .screen-container {
      max-width: 900px;
      margin: 24px auto 48px auto;
      padding: 0 16px;
    }

    /* Floating / Sticky Action Bar on Screen */
    .action-bar {
      position: sticky;
      top: 16px;
      z-index: 100;
      background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
      backdrop-filter: blur(12px);
      border: 1px solid rgba(217, 119, 6, 0.4);
      border-radius: 16px;
      padding: 14px 20px;
      margin-bottom: 24px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
      color: #f8fafc;
    }

    .action-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .action-title {
      font-size: 15px;
      font-weight: 700;
      color: #fbbf24;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .action-tip {
      font-size: 12px;
      color: #cbd5e1;
    }

    .action-buttons {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-print {
      background: linear-gradient(135deg, #d97706, #b45309);
      color: #ffffff;
      border: none;
      padding: 9px 18px;
      border-radius: 10px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.4);
      transition: all 0.2s ease;
    }

    .btn-print:hover {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      transform: translateY(-1px);
    }

    .btn-close {
      background: #334155;
      color: #e2e8f0;
      border: 1px solid #475569;
      padding: 9px 15px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-close:hover {
      background: #475569;
      color: #ffffff;
    }

    /* Paper Document */
    .paper-sheet {
      background-color: #ffffff;
      color: #1e293b;
      border-radius: 12px;
      box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
      padding: 40px 46px;
      position: relative;
      border: 1px solid #e2e8f0;
    }

    /* Ornate Outer Border */
    .ornate-border {
      border: 2px solid #8b1515;
      outline: 1px solid #b45309;
      outline-offset: -5px;
      border-radius: 6px;
      padding: 30px 32px;
      position: relative;
    }

    /* Corner Emblems */
    .corner-tl, .corner-tr, .corner-bl, .corner-br {
      position: absolute;
      width: 14px;
      height: 14px;
      border-color: #8b1515;
      border-style: solid;
      pointer-events: none;
    }
    .corner-tl { top: 2px; left: 2px; border-width: 3px 0 0 3px; }
    .corner-tr { top: 2px; right: 2px; border-width: 3px 3px 0 0; }
    .corner-bl { bottom: 2px; left: 2px; border-width: 0 0 3px 3px; }
    .corner-br { bottom: 2px; right: 2px; border-width: 0 3px 3px 0; }

    /* Header Brand */
    .brand-header {
      text-align: center;
      border-bottom: 2px solid #f1f5f9;
      padding-bottom: 20px;
      margin-bottom: 22px;
      position: relative;
    }

    .brand-emblem {
      font-size: 26px;
      color: #8b1515;
      line-height: 1;
      margin-bottom: 4px;
    }

    .brand-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #8b1515;
      text-transform: uppercase;
      margin-bottom: 3px;
    }

    .brand-tagline {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #b45309;
      font-weight: 700;
      margin-bottom: 6px;
    }

    .brand-slogan {
      font-style: italic;
      font-size: 12.5px;
      color: #64748b;
      margin-bottom: 14px;
    }

    .doc-title-box {
      display: inline-block;
      background: linear-gradient(135deg, #fffbeb, #fef3c7);
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 8px 22px;
      margin-top: 4px;
    }

    .doc-main-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 17px;
      font-weight: 800;
      color: #78350f;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .doc-tier-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      color: #b45309;
      margin-top: 3px;
      letter-spacing: 0.5px;
    }

    .doc-meta-info {
      font-size: 11.5px;
      color: #64748b;
      margin-top: 10px;
    }

    /* Destiny Profile Box (Thông tin Đương Số) */
    .profile-card {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 24px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .profile-header {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 14px;
      font-weight: 700;
      color: #8b1515;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 1px dashed #d6d3d1;
      padding-bottom: 6px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px 20px;
      font-size: 13px;
    }

    @media (max-width: 640px) {
      .profile-grid {
        grid-template-columns: 1fr;
      }
    }

    .profile-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .profile-label {
      color: #64748b;
      font-weight: 500;
      min-width: 105px;
      flex-shrink: 0;
    }

    .profile-val {
      color: #0f172a;
      font-weight: 600;
    }

    .profile-val.name-highlight {
      color: #8b1515;
      font-size: 14.5px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }

    .profile-val.tier-highlight {
      color: #b45309;
    }

    /* Traditional Divider */
    .ornate-divider {
      text-align: center;
      margin: 20px 0 24px 0;
      position: relative;
    }
    .ornate-divider::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent, #b45309, transparent);
      z-index: 1;
    }
    .ornate-divider span {
      position: relative;
      z-index: 2;
      background: #ffffff;
      padding: 0 14px;
      color: #8b1515;
      font-size: 14px;
      letter-spacing: 4px;
    }

    /* Reading Content Typography */
    .reading-content {
      font-size: 14px;
      line-height: 1.8;
      color: #1e293b;
      text-align: justify;
    }

    .reading-content h1,
    .reading-content h2,
    .reading-content h3,
    .reading-content h4 {
      font-family: 'Playfair Display', 'Merriweather', Georgia, serif;
      color: #8b1515;
      font-weight: 700;
      margin-top: 22px;
      margin-bottom: 10px;
      break-after: avoid;
      page-break-after: avoid;
    }

    .reading-content h1 {
      font-size: 18px;
      border-left: 3px solid #8b1515;
      padding-left: 10px;
    }

    .reading-content h2 {
      font-size: 16.5px;
      border-bottom: 1px solid #fed7aa;
      padding-bottom: 4px;
    }

    .reading-content h3 {
      font-size: 15px;
      color: #9a3412;
    }

    .reading-content h4 {
      font-size: 14px;
      color: #b45309;
    }

    .reading-content p {
      margin-bottom: 12px;
      orphans: 3;
      widows: 3;
    }

    .reading-content strong,
    .reading-content b {
      color: #0f172a;
      font-weight: 700;
    }

    .reading-content em,
    .reading-content i {
      color: #334155;
    }

    .reading-content ul,
    .reading-content ol {
      margin-left: 20px;
      margin-bottom: 12px;
    }

    .reading-content li {
      margin-bottom: 6px;
    }

    .reading-content blockquote {
      background: #fffdf5;
      border-left: 3px solid #b45309;
      padding: 12px 16px;
      margin: 14px 0;
      font-style: italic;
      color: #451a03;
      border-radius: 4px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    /* Branded Footer Box */
    .brand-footer-card {
      margin-top: 36px;
      background: #fffbeb;
      border: 1.5px solid #fcd34d;
      border-radius: 8px;
      padding: 20px 22px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .footer-left {
      flex: 1 1 360px;
    }

    .footer-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 14.5px;
      font-weight: 800;
      color: #8b1515;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .footer-list {
      list-style: none;
      font-size: 12.5px;
      color: #334155;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .footer-list li {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    .footer-list strong {
      color: #0f172a;
      min-width: 75px;
      flex-shrink: 0;
    }

    .footer-link {
      color: #8b1515;
      text-decoration: none;
      font-weight: 700;
    }

    .footer-note {
      font-style: italic;
      font-size: 11.5px;
      color: #78350f;
      margin-top: 8px;
      line-height: 1.5;
    }

    .footer-right {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      flex-shrink: 0;
    }

    .footer-qr-img {
      width: 100px;
      height: 100px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      background: #ffffff;
      padding: 3px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
    }

    .footer-qr-label {
      font-size: 10.5px;
      color: #64748b;
      max-width: 130px;
      margin-top: 5px;
      line-height: 1.3;
      font-weight: 500;
    }

    /* Print Watermark / Legal */
    .legal-strip {
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      margin-top: 20px;
      border-top: 1px solid #f1f5f9;
      padding-top: 12px;
      letter-spacing: 0.3px;
    }

    /* PRINT SPECIFIC STYLES */
    @media print {
      @page {
        size: A4 portrait;
        margin: 12mm 14mm 14mm 14mm;
      }

      body {
        background-color: #ffffff !important;
        color: #1e293b !important;
        font-size: 13.5px;
      }

      .screen-container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      .action-bar {
        display: none !important;
      }

      .paper-sheet {
        box-shadow: none !important;
        border: none !important;
        padding: 0 !important;
        border-radius: 0 !important;
      }

      .ornate-border {
        border-width: 1.5px !important;
        outline-width: 1px !important;
        padding: 20px 22px !important;
      }

      .brand-header {
        padding-bottom: 14px !important;
        margin-bottom: 16px !important;
      }

      .brand-name {
        font-size: 21px !important;
      }

      .brand-footer-card {
        margin-top: 24px !important;
        padding: 14px 16px !important;
      }

      .reading-content h1,
      .reading-content h2,
      .reading-content h3 {
        break-after: avoid !important;
        page-break-after: avoid !important;
      }
    }
  </style>
</head>
<body>

  <div class="screen-container">
    <!-- Floating / Sticky Action Bar (Hidden in Print) -->
    <div class="action-bar">
      <div class="action-info">
        <div class="action-title">
          <span>👑</span>
          <span>Bản Bình Giải Tử Vi Thầy Tôn (Xuất File PDF)</span>
        </div>
        <div class="action-tip">
          💡 Chọn <strong>"Lưu dưới dạng PDF" (Save as PDF)</strong> tại mục Máy in để tải file PDF về máy tính hoặc điện thoại.
        </div>
      </div>
      <div class="action-buttons">
        <button class="btn-print" onclick="window.print()">
          🖨️ In / Tải File PDF
        </button>
        <button class="btn-close" onclick="window.close()">
          ✖ Đóng
        </button>
      </div>
    </div>

    <!-- Paper Sheet -->
    <div class="paper-sheet">
      <div class="ornate-border">
        <!-- Corner Ornaments -->
        <div class="corner-tl"></div>
        <div class="corner-tr"></div>
        <div class="corner-bl"></div>
        <div class="corner-br"></div>

        <!-- Brand Header -->
        <header class="brand-header">
          <div class="brand-emblem">☯</div>
          <h1 class="brand-name">Tử Vi Đẩu Số Thầy Tôn</h1>
          <div class="brand-tagline">Tinh Hoa Dịch Học Truyền Thống • Minh Triết Đương Đại</div>
          <div class="brand-slogan">"Khai Mở Bản Mệnh • Đắc Lộc Bình An • Kiến Tạo Tương Lai"</div>
          
          <div class="doc-title-box">
            <div class="doc-main-title">
              ${isPro ? 'Bản Bình Giải Tử Vi Đẩu Số Chuyên Sâu' : 'Bản Bình Giải Tử Vi Đẩu Số Khởi Nguyên'}
            </div>
            <div class="doc-tier-badge">
              ${isPro ? '👑 Bản Chuyên Sâu Bí Truyền • Dành Riêng Cho Thân Chủ' : '📜 Bản Luận Giải Khởi Nguyên Cơ Bản'}
            </div>
          </div>

          <div class="doc-meta-info">
            Ngày xuất bản: ${exportDate} &nbsp;|&nbsp; Hệ Thống Tra Cứu: tuvithayton.vn &nbsp;|&nbsp; Hotline: 0935 058 688
          </div>
        </header>

        <!-- Customer Destiny Profile -->
        <section class="profile-card">
          <div class="profile-header">
            <span>📜 Thông Tin Thân Chủ & Bản Mệnh</span>
            <span style="font-size: 11.5px; font-weight: 500; color: #78350f;">Hồ sơ: Bản Mệnh Tử Vi</span>
          </div>

          <div class="profile-grid">
            <div class="profile-row">
              <span class="profile-label">Họ và tên:</span>
              <span class="profile-val name-highlight">${hoTen.toUpperCase()}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Giới tính:</span>
              <span class="profile-val">${gioiTinh} (${amDuongTxt || (gioiTinh === 'Nam' ? 'Dương Nam' : 'Âm Nữ')})</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Dương lịch:</span>
              <span class="profile-val">${ngayDuongStr}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Giờ sinh:</span>
              <span class="profile-val">${gioSinhLabel}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Âm lịch:</span>
              <span class="profile-val">${ngayAmStr}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Bát tự can chi:</span>
              <span class="profile-val">${batTuStr || 'Đã quy nạp'}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Bản mệnh:</span>
              <span class="profile-val">${banMenh}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Cục số & Vận:</span>
              <span class="profile-val">${tenCuc || 'Thuận Cục'}${sinhKhac ? ` (${sinhKhac})` : ''}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Cung an Thân:</span>
              <span class="profile-val">${thanCu || 'Mệnh Thân đồng cung'}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Mệnh/Thân chủ:</span>
              <span class="profile-val">${[menhChu, thanChu].filter(Boolean).join(' • ') || 'Đã an sao'}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Năm xem hạn:</span>
              <span class="profile-val">${namXem} (${namXemCanChi})${tuoiAmXem ? ` • ${tuoiAmXem}` : ''}</span>
            </div>
            <div class="profile-row">
              <span class="profile-label">Hạng luận giải:</span>
              <span class="profile-val tier-highlight">${isPro ? '👑 VIP Pro Chuyên Sâu' : '📜 Khởi Nguyên Cơ Bản'}</span>
            </div>
          </div>
        </section>

        <!-- Ornate Divider -->
        <div class="ornate-divider">
          <span>❖ ✦ ❖</span>
        </div>

        <!-- Reading Content -->
        <main class="reading-content">
          ${readingHtml}
        </main>

        <!-- Brand Footer -->
        <footer class="brand-footer-card">
          <div class="footer-left">
            <div class="footer-title">
              <span>☯</span>
              <span>Tử Vi Phong Thủy Thầy Tôn</span>
            </div>
            <ul class="footer-list">
              <li>
                <strong>Địa chỉ:</strong>
                <span>R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội</span>
              </li>
              <li>
                <strong>Hotline/Zalo:</strong>
                <span style="font-weight: 700; color: #8b1515;">0935 058 688</span>
              </li>
              <li>
                <strong>Website:</strong>
                <a href="https://tuvithayton.vn" target="_blank" class="footer-link">https://tuvithayton.vn</a>
              </li>
              <li>
                <strong>Email:</strong>
                <span>tranhuyton@gmail.com &nbsp;•&nbsp; thayton@tuvithayton.vn</span>
              </li>
            </ul>
            <div class="footer-note">
              "Mệnh do trời định, Vận do nhân tạo. Thấu triệt bản mệnh là nấc thang đầu tiên để tu tâm tích phúc, xu cát tị hung, kiến tạo cuộc đời an khang thịnh vượng."
            </div>
          </div>

          <div class="footer-right">
            ${
              qrCodeDataUrl
                ? `<img src="${qrCodeDataUrl}" alt="QR tuvithayton.vn" class="footer-qr-img" />`
                : ''
            }
            <div class="footer-qr-label">
              Quét mã QR để mở lá số & tra cứu trực tuyến trên tuvithayton.vn
            </div>
          </div>
        </footer>

        <!-- Legal Disclaimer -->
        <div class="legal-strip">
          © ${new Date().getFullYear()} TỬ VI THẦY TÔN (TUVITHAYTON.VN) • BẢN QUYỀN LUẬN GIẢI ĐƯỢC BẢO HỘ • KÍNH CHÚC QUÝ THÂN CHỦ VẠN SỰ HANH THÔNG
        </div>
      </div>
    </div>
  </div>

  <script>
    // Tự động mở hộp thoại in sau khi tải trang và hình ảnh
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
