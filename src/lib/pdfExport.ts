import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import * as htmlToImage from 'html-to-image';
import { DuLieuDuongSo, LaSoData, ServiceTier } from '@/types/tuvi';
import { GIO_ARR } from '@/lib/tuvi/constants';

export interface ExportPdfOptions {
  duongSo?: DuLieuDuongSo | null;
  laSo?: LaSoData | null;
  readingHtml: string;
  tier?: ServiceTier;
  chartTitle?: string;
  orderCode?: string;
  onProgress?: (msg: string) => void;
}

/**
 * Tự động kết xuất và tải trực tiếp file PDF chuyên nghiệp về máy (cả Mobile và PC).
 * - Sử dụng html-to-image + jsPDF chia trang chuẩn A4 từng trang một.
 * - Tuyệt đối không bị trang trắng (không phụ thuộc vào html2canvas).
 * - Tự động tải file về máy và hỗ trợ Share Sheet trên iPhone/Android.
 */
export async function exportReadingToPdf({
  duongSo,
  laSo,
  readingHtml,
  tier = 'free',
  chartTitle,
  orderCode,
  onProgress,
}: ExportPdfOptions): Promise<void> {
  if (typeof window === 'undefined') return;

  const isPro = tier === 'pro' || duongSo?.tier === 'pro' || laSo?.tier === 'pro';

  onProgress?.('Đang chuẩn bị dữ liệu hồ sơ...');

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

  // 3. Tạo host container ẩn trong DOM để trình duyệt tính toán kích thước thực tế
  const host = document.createElement('div');
  host.id = 'tuvi-pdf-render-host';
  host.style.position = 'fixed';
  host.style.left = '0';
  host.style.top = '0';
  host.style.width = '794px';
  host.style.zIndex = '999999';
  host.style.opacity = '0';
  host.style.pointerEvents = 'none';
  host.style.backgroundColor = '#ffffff';
  document.body.appendChild(host);

  try {
    // 4. Phân tích nội dung readingHtml thành các khối (blocks)
    const parser = document.createElement('div');
    parser.innerHTML = readingHtml;
    let rawBlocks = Array.from(parser.children) as HTMLElement[];

    // Nếu readingHtml không có thẻ bọc ngoài, tạo mảng thẻ <p>
    if (rawBlocks.length === 0) {
      const p = document.createElement('p');
      p.innerHTML = readingHtml;
      rawBlocks = [p];
    }

    // Container đo đạc kích thước
    const measureBox = document.createElement('div');
    measureBox.style.width = '710px';
    measureBox.style.boxSizing = 'border-box';
    measureBox.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    measureBox.style.fontSize = '16.5px';
    measureBox.style.lineHeight = '1.8';
    host.appendChild(measureBox);

    // Đo chiều cao từng khối
    const blockHeights: number[] = [];
    const blockClones: HTMLElement[] = [];

    for (const b of rawBlocks) {
      const clone = b.cloneNode(true) as HTMLElement;
      clone.style.margin = '0 0 10px 0';
      clone.style.fontSize = '16.5px';
      clone.style.lineHeight = '1.8';
      clone.style.boxSizing = 'border-box';
      measureBox.appendChild(clone);
      const h = clone.offsetHeight || 34;
      blockHeights.push(h + 10);
      blockClones.push(clone);
      measureBox.removeChild(clone);
    }
    host.removeChild(measureBox);

    // 5. Thuật toán chia trang A4 (794px x 1123px)
    // Chiều cao có thể dùng: Page 1 ~510px, các trang sau ~930px
    const PAGE_HEIGHT_PAGE1 = 510;
    const PAGE_HEIGHT_NORMAL = 930;
    const FOOTER_REQUIRED_HEIGHT = 280;

    const pageBlockGroups: HTMLElement[][] = [];
    let currentGroup: HTMLElement[] = [];
    let currentRemaining = PAGE_HEIGHT_PAGE1;

    for (let i = 0; i < blockClones.length; i++) {
      const clone = blockClones[i];
      const h = blockHeights[i];
      const isHeading = /^H[1-4]$/i.test(clone.tagName);

      if (h > currentRemaining || (isHeading && currentRemaining < 100)) {
        if (currentGroup.length > 0) {
          pageBlockGroups.push(currentGroup);
          currentGroup = [];
          currentRemaining = PAGE_HEIGHT_NORMAL;
        }
      }

      currentGroup.push(clone);
      currentRemaining -= h;
    }

    if (currentGroup.length > 0) {
      pageBlockGroups.push(currentGroup);
    }

    // Kiểm tra trang cuối có đủ chỗ cho chân trang không
    const needExtraPageForFooter = currentRemaining < FOOTER_REQUIRED_HEIGHT;
    const totalPages = pageBlockGroups.length + (needExtraPageForFooter ? 1 : 0);

    // 6. Xây dựng các trang A4 hoàn chỉnh trong DOM
    const pageElements: HTMLElement[] = [];

    // --- HTML Header trang 1 ---
    const headerHtml = `
      <div style="
        text-align: center;
        border-top: 3px double #8b1515;
        border-bottom: 2px solid #b45309;
        padding: 14px 0 12px 0;
        margin-bottom: 16px;
      ">
        <div style="font-size: 26px; color: #8b1515; line-height: 1; margin-bottom: 4px;">☯</div>
        <h1 style="
          font-family: 'Times New Roman', Times, Georgia, serif;
          font-size: 26px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: #8b1515;
          text-transform: uppercase;
          margin: 0 0 4px 0;
        ">Tử Vi Đẩu Số Thầy Tôn</h1>
        <div style="
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #b45309;
          font-weight: 700;
          margin-bottom: 4px;
        ">Tinh Hoa Dịch Học Truyền Thống • Minh Triết Đương Đại</div>
        <div style="
          font-style: italic;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 10px;
        ">"Khai Mở Bản Mệnh • Đắc Lộc Bình An • Kiến Tạo Tương Lai"</div>
        
        <div style="
          display: inline-block;
          background: #fffbeb;
          border: 1px solid #fcd34d;
          border-radius: 6px;
          padding: 8px 22px;
        ">
          <div style="
            font-family: 'Times New Roman', Times, Georgia, serif;
            font-size: 17.5px;
            font-weight: 800;
            color: #78350f;
            text-transform: uppercase;
          ">
            ${isPro ? 'Bản Bình Giải Tử Vi Đẩu Số Chuyên Sâu' : 'Bản Bình Giải Tử Vi Đẩu Số Khởi Nguyên'}
          </div>
          <div style="font-size: 12px; font-weight: 700; color: #b45309; margin-top: 3px;">
            ${isPro ? '👑 Bản Chuyên Sâu Bí Truyền • Dành Riêng Cho Thân Chủ' : '📜 Bản Luận Giải Khởi Nguyên Cơ Bản'}
          </div>
        </div>
      </div>
    `;

    // --- HTML Khung Hồ Sơ Bản Mệnh ---
    const profileHtml = `
      <div style="
        background: #fafaf9;
        border: 1.5px solid #d4af37;
        border-radius: 8px;
        padding: 14px 18px;
        margin-bottom: 16px;
      ">
        <div style="
          font-family: 'Times New Roman', Times, Georgia, serif;
          font-size: 15px;
          font-weight: 700;
          color: #8b1515;
          text-transform: uppercase;
          border-bottom: 1px dashed #d6d3d1;
          padding-bottom: 5px;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
        ">
          <span>📜 Thông Tin Thân Chủ & Bản Mệnh</span>
          <span style="font-size: 12.5px; font-weight: 600; color: #78350f;">
            ${orderCode ? `Mã đơn: ${orderCode}` : 'Hồ sơ: Bản Mệnh Tử Vi'}
          </span>
        </div>

        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 20px;
          font-size: 14px;
          line-height: 1.6;
        ">
          <div><span style="color: #64748b;">Họ và tên:</span> <span style="color: #8b1515; font-weight: 800; font-size: 15.5px;">${hoTen.toUpperCase()}</span></div>
          <div><span style="color: #64748b;">Giới tính:</span> <span style="font-weight: 600;">${gioiTinh} (${amDuongTxt || (gioiTinh === 'Nam' ? 'Dương Nam' : 'Âm Nữ')})</span></div>
          <div><span style="color: #64748b;">Dương lịch:</span> <span style="font-weight: 600;">${ngayDuongStr}</span></div>
          <div><span style="color: #64748b;">Giờ sinh:</span> <span style="font-weight: 600;">${gioSinhLabel}</span></div>
          <div><span style="color: #64748b;">Âm lịch:</span> <span style="font-weight: 600;">${ngayAmStr}</span></div>
          <div><span style="color: #64748b;">Bát tự:</span> <span style="font-weight: 600;">${batTuStr || 'Đã quy nạp'}</span></div>
          <div><span style="color: #64748b;">Bản mệnh:</span> <span style="font-weight: 600;">${banMenh}</span></div>
          <div><span style="color: #64748b;">Cục số:</span> <span style="font-weight: 600;">${tenCuc || 'Thuận Cục'}${sinhKhac ? ` (${sinhKhac})` : ''}</span></div>
          <div><span style="color: #64748b;">Cung an Thân:</span> <span style="font-weight: 600;">${thanCu}</span></div>
          <div><span style="color: #64748b;">Mệnh/Thân chủ:</span> <span style="font-weight: 600;">${[menhChu, thanChu].filter(Boolean).join(' • ') || 'Đã an sao'}</span></div>
          <div><span style="color: #64748b;">Năm xem:</span> <span style="font-weight: 600;">${namXem} (${namXemCanChi})${tuoiAmXem ? ` • ${tuoiAmXem}` : ''}</span></div>
          <div><span style="color: #64748b;">Hạng:</span> <span style="color: #b45309; font-weight: 700;">${isPro ? '👑 VIP Pro Chuyên Sâu' : '📜 Khởi Nguyên Cơ Bản'}</span></div>
        </div>
      </div>

      <div style="text-align: center; margin: 12px 0 16px 0; color: #8b1515; letter-spacing: 4px; font-size: 13px;">
        ❖ ✦ ❖
      </div>
    `;

    // --- HTML Chân Trang Thương Hiệu Thầy Tôn ---
    const brandFooterHtml = `
      <div style="
        margin-top: 16px;
        background: #fffdf5;
        border: 1.5px solid #d4af37;
        border-radius: 8px;
        padding: 16px 18px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      ">
        <div style="flex: 1 1 360px;">
          <div style="
            font-family: 'Times New Roman', Times, Georgia, serif;
            font-size: 16px;
            font-weight: 800;
            color: #8b1515;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
          ">
            ☯ Tử Vi Phong Thủy Thầy Tôn
          </div>
          <div style="font-size: 13.5px; color: #334155; display: flex; flex-direction: column; gap: 4px;">
            <div><strong style="color: #0f172a;">Địa chỉ:</strong> R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội</div>
            <div><strong style="color: #0f172a;">Hotline/Zalo:</strong> <span style="font-weight: 700; color: #8b1515;">0935 058 688</span></div>
            <div><strong style="color: #0f172a;">Website:</strong> <span style="font-weight: 700; color: #8b1515;">https://tuvithayton.vn</span></div>
            <div><strong style="color: #0f172a;">Email:</strong> tranhuyton@gmail.com • thayton@tuvithayton.vn</div>
          </div>
          <div style="font-style: italic; font-size: 12.5px; color: #78350f; margin-top: 6px; line-height: 1.45;">
            "Mệnh do trời định, Vận do nhân tạo. Thấu triệt bản mệnh là nấc thang đầu tiên để tu tâm tích phúc, xu cát tị hung, kiến tạo cuộc đời an khang thịnh vượng."
          </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; flex-shrink: 0;">
          ${
            qrCodeDataUrl
              ? `<img src="${qrCodeDataUrl}" alt="QR tuvithayton.vn" style="width: 95px; height: 95px; border: 2px solid #e2e8f0; border-radius: 6px; background: #ffffff; padding: 2px;" />`
              : ''
          }
          <div style="font-size: 10.5px; color: #64748b; max-width: 125px; margin-top: 4px; line-height: 1.25;">
            Quét mã mở lá số tại tuvithayton.vn
          </div>
        </div>
      </div>

      <div style="
        text-align: center;
        font-size: 11px;
        color: #94a3b8;
        margin-top: 10px;
        border-top: 1px solid #f1f5f9;
        padding-top: 6px;
      ">
        © ${new Date().getFullYear()} TỬ VI THẦY TÔN (TUVITHAYTON.VN) • BẢN QUYỀN LUẬN GIẢI ĐƯỢC BẢO HỘ • KÍNH CHÚC QUÝ THÂN CHỦ VẠN SỰ HANH THÔNG
      </div>
    `;

    // Tạo từng trang DOM hoàn chỉnh
    for (let pIdx = 0; pIdx < pageBlockGroups.length; pIdx++) {
      const pageNum = pIdx + 1;
      const isPage1 = pageNum === 1;
      const isLastContentPage = pageNum === pageBlockGroups.length;
      const group = pageBlockGroups[pIdx];

      const pageEl = document.createElement('div');
      pageEl.style.width = '794px';
      pageEl.style.height = '1123px';
      pageEl.style.minHeight = '1123px';
      pageEl.style.maxHeight = '1123px';
      pageEl.style.padding = '32px 42px';
      pageEl.style.boxSizing = 'border-box';
      pageEl.style.backgroundColor = '#ffffff';
      pageEl.style.color = '#1e293b';
      pageEl.style.position = 'relative';
      pageEl.style.display = 'flex';
      pageEl.style.flexDirection = 'column';
      pageEl.style.justifyContent = 'space-between';
      pageEl.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

      // Top Container
      const topContainer = document.createElement('div');
      topContainer.style.flex = '1';
      topContainer.style.display = 'flex';
      topContainer.style.flexDirection = 'column';

      if (isPage1) {
        topContainer.innerHTML = headerHtml + profileHtml;
      } else {
        // Tiêu đề chạy ở đầu trang 2 trở đi
        const runningHeader = document.createElement('div');
        runningHeader.style.display = 'flex';
        runningHeader.style.justifyContent = 'space-between';
        runningHeader.style.alignItems = 'center';
        runningHeader.style.borderBottom = '1px solid #fed7aa';
        runningHeader.style.paddingBottom = '6px';
        runningHeader.style.marginBottom = '14px';
        runningHeader.style.fontSize = '12px';
        runningHeader.style.color = '#78350f';
        runningHeader.style.fontWeight = '600';
        runningHeader.style.textTransform = 'uppercase';
        runningHeader.innerHTML = `
          <span>Tử Vi Đẩu Số Thầy Tôn • Bản Luận Giải Bản Mệnh</span>
          <span>Thân chủ: ${hoTen}</span>
        `;
        topContainer.appendChild(runningHeader);
      }

      // Content Container
      const contentContainer = document.createElement('div');
      contentContainer.style.fontSize = '16.5px';
      contentContainer.style.lineHeight = '1.8';
      contentContainer.style.textAlign = 'justify';
      contentContainer.style.color = '#1e293b';

      for (const block of group) {
        const item = block.cloneNode(true) as HTMLElement;
        // Áp dụng định dạng phong thủy trang trọng với cỡ chữ to rõ
        if (/^H[1-4]$/i.test(item.tagName)) {
          item.style.fontFamily = "'Times New Roman', Times, Georgia, serif";
          item.style.color = '#8b1515';
          item.style.margin = '16px 0 8px 0';
          if (item.tagName === 'H1') {
            item.style.fontSize = '21px';
            item.style.borderLeft = '4px solid #8b1515';
            item.style.paddingLeft = '10px';
          } else if (item.tagName === 'H2') {
            item.style.fontSize = '19px';
            item.style.borderBottom = '1.5px solid #fed7aa';
            item.style.paddingBottom = '4px';
          } else if (item.tagName === 'H3') {
            item.style.fontSize = '17.5px';
            item.style.color = '#9a3412';
          } else {
            item.style.fontSize = '16.5px';
            item.style.color = '#b45309';
          }
        } else if (item.tagName === 'P') {
          item.style.margin = '0 0 10px 0';
          item.style.fontSize = '16.5px';
          item.style.lineHeight = '1.8';
        } else if (item.tagName === 'BLOCKQUOTE') {
          item.style.background = '#fffdf5';
          item.style.borderLeft = '3.5px solid #b45309';
          item.style.padding = '10px 14px';
          item.style.margin = '12px 0';
          item.style.fontStyle = 'italic';
          item.style.color = '#451a03';
          item.style.borderRadius = '4px';
          item.style.fontSize = '15.5px';
        } else if (item.tagName === 'UL' || item.tagName === 'OL') {
          item.style.fontSize = '16.5px';
          item.style.lineHeight = '1.8';
        }
        contentContainer.appendChild(item);
      }
      topContainer.appendChild(contentContainer);

      // Nếu là trang nội dung cuối và đủ chỗ thì thêm Brand Footer vào luôn
      if (isLastContentPage && !needExtraPageForFooter) {
        const footerDiv = document.createElement('div');
        footerDiv.innerHTML = brandFooterHtml;
        topContainer.appendChild(footerDiv);
      }

      pageEl.appendChild(topContainer);

      // Bottom Running Page Number
      const bottomBar = document.createElement('div');
      bottomBar.style.display = 'flex';
      bottomBar.style.justifyContent = 'space-between';
      bottomBar.style.fontSize = '10.5px';
      bottomBar.style.color = '#94a3b8';
      bottomBar.style.borderTop = '1px solid #f1f5f9';
      bottomBar.style.paddingTop = '6px';
      bottomBar.style.marginTop = '8px';
      bottomBar.innerHTML = `
        <span>tuvithayton.vn • Hotline: 0935 058 688</span>
        <span>Trang ${pageNum} / ${totalPages}</span>
      `;
      pageEl.appendChild(bottomBar);

      host.appendChild(pageEl);
      pageElements.push(pageEl);
    }

    // Nếu cần trang riêng cho Brand Footer
    if (needExtraPageForFooter) {
      const extraPage = document.createElement('div');
      extraPage.style.width = '794px';
      extraPage.style.height = '1123px';
      extraPage.style.padding = '36px 42px';
      extraPage.style.boxSizing = 'border-box';
      extraPage.style.backgroundColor = '#ffffff';
      extraPage.style.color = '#1e293b';
      extraPage.style.position = 'relative';
      extraPage.style.display = 'flex';
      extraPage.style.flexDirection = 'column';
      extraPage.style.justifyContent = 'space-between';
      extraPage.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

      const topPart = document.createElement('div');
      topPart.style.flex = '1';
      topPart.innerHTML = `
        <div style="
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #fed7aa;
          padding-bottom: 6px;
          margin-bottom: 24px;
          font-size: 11px;
          color: #78350f;
          font-weight: 600;
          text-transform: uppercase;
        ">
          <span>Tử Vi Đẩu Số Thầy Tôn • Tổng Kết & Liên Hệ Tư Vấn</span>
          <span>Thân chủ: ${hoTen}</span>
        </div>
        ${brandFooterHtml}
      `;
      extraPage.appendChild(topPart);

      const bottomBar = document.createElement('div');
      bottomBar.style.display = 'flex';
      bottomBar.style.justifyContent = 'space-between';
      bottomBar.style.fontSize = '10.5px';
      bottomBar.style.color = '#94a3b8';
      bottomBar.style.borderTop = '1px solid #f1f5f9';
      bottomBar.style.paddingTop = '6px';
      bottomBar.innerHTML = `
        <span>tuvithayton.vn • Hotline: 0935 058 688</span>
        <span>Trang ${totalPages} / ${totalPages}</span>
      `;
      extraPage.appendChild(bottomBar);

      host.appendChild(extraPage);
      pageElements.push(extraPage);
    }

    // Đợi 250ms để tất cả hình ảnh QR và DOM render ổn định
    await new Promise((resolve) => setTimeout(resolve, 250));

    // 7. Kết xuất từng trang thành ảnh chất lượng cao và ghép vào PDF
    const pdfDoc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    for (let i = 0; i < pageElements.length; i++) {
      onProgress?.(`Đang tạo trang ${i + 1}/${totalPages}...`);

      const pNode = pageElements[i];
      const imgDataUrl = await htmlToImage.toJpeg(pNode, {
        quality: 0.93,
        pixelRatio: 1.5, // Độ nét cao chuẩn Retina
        backgroundColor: '#ffffff',
        style: {
          opacity: '1',
          visibility: 'visible',
          display: 'flex',
        },
      });

      if (i > 0) {
        pdfDoc.addPage('a4', 'portrait');
      }

      pdfDoc.addImage(imgDataUrl, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    onProgress?.('Đang hoàn tất và lưu file PDF...');

    // 8. Tạo Blob và tải file
    const pdfBlob: Blob = pdfDoc.output('blob');
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    // Trên điện thoại hỗ trợ Web Share API (Safari iOS, Android): Mở menu chia sẻ
    if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: fileName,
          text: 'Bản Bình Giải Tử Vi Thầy Tôn (tuvithayton.vn)',
        });
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('Share API không khả dụng, chuyển sang tải file:', err);
      }
    }

    // Tự động tải file PDF trực tiếp về máy (PC, Chrome iOS, v.v.)
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
  } catch (err) {
    console.error('Lỗi khi kết xuất file PDF:', err);
    alert('Không thể tạo file PDF tự động. Quý khách vui lòng thử lại hoặc sử dụng máy tính.');
  } finally {
    // Dọn dẹp DOM container
    if (host.parentNode) {
      host.parentNode.removeChild(host);
    }
  }
}
