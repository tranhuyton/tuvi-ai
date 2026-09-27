import QRCode from 'qrcode';
import { DuLieuDuongSo, LaSoData, ServiceTier } from '@/types/tuvi';
import { GIO_ARR } from '@/lib/tuvi/constants';

export interface ExportPdfOptions {
  duongSo?: DuLieuDuongSo | null;
  laSo?: LaSoData | null;
  readingHtml: string;
  tier?: ServiceTier;
  chartTitle?: string;
  orderCode?: string;
}

/**
 * Tự động tạo và tải trực tiếp file PDF về điện thoại hoặc máy tính cho khách hàng.
 * - Trên điện thoại (iOS / Android): Tự động kích hoạt lưu file PDF hoặc mở Share Sheet (Lưu vào Tệp / Zalo).
 * - Trên máy tính (PC): Tự động tải file .pdf về thư mục Downloads.
 */
export async function exportReadingToPdf({
  duongSo,
  laSo,
  readingHtml,
  tier = 'free',
  chartTitle,
  orderCode,
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

  const cleanNameForFile = hoTen
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, '')
    .trim()
    .replace(/\s+/g, '_') || 'Duong_So';

  const fileName = `Tu_Vi_Thay_Ton_${cleanNameForFile}.pdf`;

  // 3. Xây dựng cấu trúc HTML tài liệu A4 hoàn chỉnh
  const documentHtml = `
    <div style="
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.8;
      font-size: 15px;
      background-color: #ffffff;
      padding: 24px 30px;
      box-sizing: border-box;
      width: 794px;
    ">
      <!-- Header Thương Hiệu Hoàng Gia -->
      <div style="
        text-align: center;
        border-top: 3px double #8b1515;
        border-bottom: 2px solid #b45309;
        padding: 16px 0;
        margin-bottom: 20px;
      ">
        <div style="font-size: 26px; color: #8b1515; line-height: 1; margin-bottom: 4px;">☯</div>
        <h1 style="
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #8b1515;
          text-transform: uppercase;
          margin: 0 0 4px 0;
        ">Tử Vi Đẩu Số Thầy Tôn</h1>
        <div style="
          font-size: 11.5px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #b45309;
          font-weight: 700;
          margin-bottom: 6px;
        ">Tinh Hoa Dịch Học Truyền Thống • Minh Triết Đương Đại</div>
        <div style="
          font-style: italic;
          font-size: 12.5px;
          color: #64748b;
          margin-bottom: 12px;
        ">"Khai Mở Bản Mệnh • Đắc Lộc Bình An • Kiến Tạo Tương Lai"</div>
        
        <div style="
          display: inline-block;
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 8px;
          padding: 8px 22px;
          margin-top: 4px;
        ">
          <div style="
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 17px;
            font-weight: 800;
            color: #78350f;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          ">
            ${isPro ? 'Bản Bình Giải Tử Vi Đẩu Số Chuyên Sâu' : 'Bản Bình Giải Tử Vi Đẩu Số Khởi Nguyên'}
          </div>
          <div style="
            font-size: 11.5px;
            font-weight: 700;
            color: #b45309;
            margin-top: 3px;
          ">
            ${isPro ? '👑 Bản Chuyên Sâu Bí Truyền • Dành Riêng Cho Thân Chủ' : '📜 Bản Luận Giải Khởi Nguyên Cơ Bản'}
          </div>
        </div>

        <div style="font-size: 12px; color: #64748b; margin-top: 10px;">
          Ngày xuất bản: ${exportDate} &nbsp;|&nbsp; Tra cứu: tuvithayton.vn &nbsp;|&nbsp; Hotline: 0935 058 688
        </div>
      </div>

      <!-- Khung Thông Tin Thân Chủ & Bản Mệnh -->
      <div style="
        background: #fafaf9;
        border: 1.5px solid #d4af37;
        border-radius: 8px;
        padding: 16px 20px;
        margin-bottom: 22px;
        page-break-inside: avoid;
        break-inside: avoid;
      ">
        <div style="
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 14.5px;
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
        ">
          <span>📜 Thông Tin Thân Chủ & Bản Mệnh</span>
          <span style="font-size: 12px; font-weight: 500; color: #78350f;">
            ${orderCode ? `Mã đơn: ${orderCode}` : 'Hồ sơ: Bản Mệnh Tử Vi'}
          </span>
        </div>

        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 24px;
          font-size: 13.5px;
        ">
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Họ và tên:</span>
            <span style="color: #8b1515; font-weight: 800; font-size: 15px;">${hoTen.toUpperCase()}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Giới tính:</span>
            <span style="color: #0f172a; font-weight: 600;">${gioiTinh} (${amDuongTxt || (gioiTinh === 'Nam' ? 'Dương Nam' : 'Âm Nữ')})</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Dương lịch:</span>
            <span style="color: #0f172a; font-weight: 600;">${ngayDuongStr}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Giờ sinh:</span>
            <span style="color: #0f172a; font-weight: 600;">${gioSinhLabel}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Âm lịch:</span>
            <span style="color: #0f172a; font-weight: 600;">${ngayAmStr}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Bát tự can chi:</span>
            <span style="color: #0f172a; font-weight: 600;">${batTuStr || 'Đã quy nạp'}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Bản mệnh:</span>
            <span style="color: #0f172a; font-weight: 600;">${banMenh}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Cục số & Vận:</span>
            <span style="color: #0f172a; font-weight: 600;">${tenCuc || 'Thuận Cục'}${sinhKhac ? ` (${sinhKhac})` : ''}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Cung an Thân:</span>
            <span style="color: #0f172a; font-weight: 600;">${thanCu}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Mệnh/Thân chủ:</span>
            <span style="color: #0f172a; font-weight: 600;">${[menhChu, thanChu].filter(Boolean).join(' • ') || 'Đã an sao'}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Năm xem hạn:</span>
            <span style="color: #0f172a; font-weight: 600;">${namXem} (${namXemCanChi})${tuoiAmXem ? ` • ${tuoiAmXem}` : ''}</span>
          </div>
          <div style="display: flex; gap: 6px;">
            <span style="color: #64748b; min-width: 105px;">Hạng luận giải:</span>
            <span style="color: #b45309; font-weight: 700;">${isPro ? '👑 VIP Pro Chuyên Sâu' : '📜 Khởi Nguyên Cơ Bản'}</span>
          </div>
        </div>
      </div>

      <!-- Dấu Phân Cách Cổ Điển -->
      <div style="text-align: center; margin: 18px 0 22px 0; color: #8b1515; letter-spacing: 4px; font-size: 13px;">
        ❖ ✦ ❖
      </div>

      <!-- Nội Dung Bài Luận Giải Chi Tiết -->
      <div class="reading-pdf-body" style="
        font-size: 15px;
        line-height: 1.8;
        color: #1e293b;
        text-align: justify;
      ">
        ${readingHtml}
      </div>

      <!-- Chân Trang Nhận Diện Thương Hiệu Tử Vi Thầy Tôn -->
      <div style="
        margin-top: 32px;
        background: #fffdf5;
        border: 1.5px solid #d4af37;
        border-radius: 8px;
        padding: 20px 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        page-break-inside: avoid;
        break-inside: avoid;
      ">
        <div style="flex: 1 1 360px;">
          <div style="
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 15.5px;
            font-weight: 800;
            color: #8b1515;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
          ">
            <span>☯</span>
            <span>Tử Vi Phong Thủy Thầy Tôn</span>
          </div>
          <div style="font-size: 13px; color: #334155; display: flex; flex-direction: column; gap: 5px;">
            <div>
              <strong style="color: #0f172a;">Địa chỉ:</strong>
              <span>R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội</span>
            </div>
            <div>
              <strong style="color: #0f172a;">Hotline/Zalo:</strong>
              <span style="font-weight: 700; color: #8b1515;">0935 058 688</span>
            </div>
            <div>
              <strong style="color: #0f172a;">Website:</strong>
              <span style="font-weight: 700; color: #8b1515;">https://tuvithayton.vn</span>
            </div>
            <div>
              <strong style="color: #0f172a;">Email:</strong>
              <span>tranhuyton@gmail.com &nbsp;•&nbsp; thayton@tuvithayton.vn</span>
            </div>
          </div>
          <div style="font-style: italic; font-size: 12px; color: #78350f; margin-top: 8px; line-height: 1.5;">
            "Mệnh do trời định, Vận do nhân tạo. Thấu triệt bản mệnh là nấc thang đầu tiên để tu tâm tích phúc, xu cát tị hung, kiến tạo cuộc đời an khang thịnh vượng."
          </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; flex-shrink: 0;">
          ${
            qrCodeDataUrl
              ? `<img src="${qrCodeDataUrl}" alt="QR tuvithayton.vn" style="width: 100px; height: 100px; border: 2px solid #e2e8f0; border-radius: 8px; background: #ffffff; padding: 3px;" />`
              : ''
          }
          <div style="font-size: 10.5px; color: #64748b; max-width: 130px; margin-top: 5px; line-height: 1.3;">
            Quét mã QR để mở lá số & tra cứu tại tuvithayton.vn
          </div>
        </div>
      </div>

      <div style="
        text-align: center;
        font-size: 11px;
        color: #94a3b8;
        margin-top: 18px;
        border-top: 1px solid #f1f5f9;
        padding-top: 10px;
        letter-spacing: 0.3px;
        page-break-inside: avoid;
        break-inside: avoid;
      ">
        © ${new Date().getFullYear()} TỬ VI THẦY TÔN (TUVITHAYTON.VN) • BẢN QUYỀN LUẬN GIẢI ĐƯỢC BẢO HỘ • KÍNH CHÚC QUÝ THÂN CHỦ VẠN SỰ HANH THÔNG
      </div>
    </div>
  `;

  // 4. Tạo container ẩn trong DOM để render chính xác mọi thuộc tính
  const container = document.createElement('div');
  container.id = 'tuvi-pdf-export-container';
  container.style.position = 'fixed';
  container.style.left = '0';
  container.style.top = '0';
  container.style.width = '794px'; // Chuẩn A4 tại 96 DPI
  container.style.zIndex = '-99999';
  container.style.opacity = '1';
  container.style.pointerEvents = 'none';
  container.style.backgroundColor = '#ffffff';
  container.innerHTML = documentHtml;

  // Thêm style cho nội dung bài luận giải bên trong container
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
    #tuvi-pdf-export-container h1,
    #tuvi-pdf-export-container h2,
    #tuvi-pdf-export-container h3,
    #tuvi-pdf-export-container h4 {
      font-family: 'Playfair Display', Georgia, serif;
      color: #8b1515;
      margin-top: 20px;
      margin-bottom: 10px;
      page-break-after: avoid;
      break-after: avoid;
    }
    #tuvi-pdf-export-container h1 { font-size: 20px; border-left: 4px solid #8b1515; padding-left: 10px; }
    #tuvi-pdf-export-container h2 { font-size: 18px; border-bottom: 1.5px solid #fed7aa; padding-bottom: 4px; }
    #tuvi-pdf-export-container h3 { font-size: 16.5px; color: #9a3412; }
    #tuvi-pdf-export-container h4 { font-size: 15px; color: #b45309; }
    #tuvi-pdf-export-container p { margin-bottom: 12px; }
    #tuvi-pdf-export-container strong, #tuvi-pdf-export-container b { color: #0f172a; font-weight: 700; }
    #tuvi-pdf-export-container ul, #tuvi-pdf-export-container ol { margin-left: 20px; margin-bottom: 12px; }
    #tuvi-pdf-export-container li { margin-bottom: 6px; }
    #tuvi-pdf-export-container blockquote {
      background: #fffdf5;
      border-left: 3.5px solid #b45309;
      padding: 12px 16px;
      margin: 14px 0;
      font-style: italic;
      color: #451a03;
      border-radius: 4px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
  `;
  container.appendChild(styleEl);
  document.body.appendChild(container);

  try {
    // Đợi 250ms để DOM và hình ảnh QR render ổn định
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Dynamic import html2pdf.js
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default || html2pdfModule;

    const opt = {
      margin: [10, 10, 12, 10], // Lề mm [trên, trái, dưới, phải]
      filename: fileName,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2, // Độ nét x2
        useCORS: true,
        logging: false,
        width: 794,
        windowWidth: 794,
        scrollY: 0,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        avoid: ['h1', 'h2', 'h3', 'h4', 'blockquote'],
      },
    };

    // Tạo PDF dạng Blob
    const worker = (html2pdf as any)().from(container).set(opt);
    const pdfBlob: Blob = await worker.output('blob');

    // Tạo file từ Blob
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    // Trên điện thoại (iOS Safari, Android): Ưu tiên Web Share API để mở trực tiếp menu "Lưu vào Tệp" / "Gửi Zalo"
    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: fileName,
          text: 'Bản Bình Giải Tử Vi Thầy Tôn (tuvithayton.vn)',
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return; // Người dùng ấn Hủy trên Share Sheet
        console.warn('Share API không khả dụng, chuyển sang tải file trực tiếp:', err);
      }
    }

    // Tự động tải file PDF trực tiếp về máy (PC hoặc khi không dùng Share Sheet)
    const blobUrl = URL.createObjectURL(pdfBlob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = fileName;
    downloadAnchor.style.display = 'none';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();

    setTimeout(() => {
      if (downloadAnchor.parentNode) {
        downloadAnchor.parentNode.removeChild(downloadAnchor);
      }
      URL.revokeObjectURL(blobUrl);
    }, 4000);
  } catch (pdfErr) {
    console.error('Lỗi tạo PDF tự động, chuyển sang phương thức dự phòng:', pdfErr);
    // Dự phòng: Mở cửa sổ in ấn nếu trình duyệt không hỗ trợ thư viện canvas
    window.print();
  } finally {
    // Dọn dẹp DOM container
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
