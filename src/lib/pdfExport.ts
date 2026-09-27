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
 * Kiểm tra xem một phần tử có phải là tiêu đề hoặc đầu mục hay không
 * (Bao gồm thẻ H1-H6, và các đoạn P in đậm bắt đầu bằng số thứ tự như "2. Bản đồ 4 mùa...", "IV. ...")
 */
function isHeadingElement(el: HTMLElement): boolean {
  const tag = el.tagName.toUpperCase();
  if (/^H[1-6]$/.test(tag)) return true;

  const text = (el.textContent || '').trim();
  if (text.length > 0 && text.length < 90) {
    if (/^([0-9]+[\.\)]|[IVXLCDM]+[\.\)]|[A-Z][\.\)]|❖|✦)/i.test(text)) {
      return true;
    }
    const firstChild = el.firstElementChild;
    if (
      firstChild &&
      ['B', 'STRONG'].includes(firstChild.tagName) &&
      text === (firstChild.textContent || '').trim()
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Phân tích và bẻ nhỏ HTML bài luận giải thành các khối (blocks) chi tiết:
 * 1. Mở phẳng các container lồng nhau (DIV, SECTION, ARTICLE)
 * 2. Mở phẳng UL / OL: Từng thẻ LI trở thành một đoạn văn độc lập có bullet • (tránh tình trạng 4 mùa bị gom vào 1 thẻ UL khổng lồ)
 * 3. Tách các đoạn văn có chứa thẻ <br> thành các thẻ <p> độc lập
 * 4. Tách các đoạn văn dài (> 180 ký tự) thành các câu nhỏ 1-2 câu để trang lấp đầy tự nhiên, không bao giờ bị khoảng trống lớn
 */
function parseHtmlToBlocks(html: string): HTMLElement[] {
  const container = document.createElement('div');
  container.innerHTML = html;

  const rawList: HTMLElement[] = [];

  function walk(node: HTMLElement) {
    const tag = node.tagName.toUpperCase();

    // 1. Mở phẳng các thẻ container
    if (['DIV', 'SECTION', 'ARTICLE', 'MAIN'].includes(tag)) {
      const hasBlockChildren = Array.from(node.children).some((c) =>
        /^H[1-6]$/i.test(c.tagName) ||
        ['P', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'TABLE', 'DIV', 'SECTION'].includes(c.tagName)
      );
      if (hasBlockChildren) {
        Array.from(node.children).forEach((c) => walk(c as HTMLElement));
        return;
      }
    }

    // 2. Mở phẳng danh sách UL / OL: Tách từng LI ra để có thể ngắt trang giữa các mục
    if (tag === 'UL' || tag === 'OL') {
      const liElements = Array.from(node.children).filter((c) => c.tagName === 'LI') as HTMLElement[];
      if (liElements.length > 0) {
        liElements.forEach((li) => walk(li));
        return;
      }
    }

    // 3. Xử lý thẻ LI: Biến thành thẻ P có bullet • rõ ràng
    if (tag === 'LI') {
      const p = document.createElement('p');
      p.innerHTML = `<span style="font-weight: 900; margin-right: 6px;">•</span>${node.innerHTML.trim()}`;
      walk(p);
      return;
    }

    // 4. Nếu là thẻ P có chứa ngắt dòng <br> (thường gặp khi liệt kê các mùa hoặc gạch đầu dòng)
    if (tag === 'P' && /<br\s*\/?>/i.test(node.innerHTML)) {
      const parts = node.innerHTML.split(/<br\s*\/?>/i);
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed) {
          const newP = document.createElement('p');
          newP.innerHTML = trimmed;
          walk(newP);
        }
      }
      return;
    }

    // 5. Nếu là đoạn văn dài (> 180 ký tự) có nhiều câu, bẻ thành các câu nhỏ để phân trang lấp đầy từng trang
    if (tag === 'P' && (node.textContent || '').length > 180 && !isHeadingElement(node)) {
      const sentences = node.innerHTML.split(/(?<=[.?!:])\s+/);
      if (sentences.length > 1) {
        let currentChunk = '';
        for (const s of sentences) {
          if ((currentChunk + ' ' + s).length > 150 && currentChunk) {
            const pChunk = document.createElement('p');
            pChunk.innerHTML = currentChunk.trim();
            rawList.push(pChunk);
            currentChunk = s;
          } else {
            currentChunk = currentChunk ? currentChunk + ' ' + s : s;
          }
        }
        if (currentChunk.trim()) {
          const pChunk = document.createElement('p');
          pChunk.innerHTML = currentChunk.trim();
          rawList.push(pChunk);
        }
        return;
      }
    }

    rawList.push(node);
  }

  Array.from(container.children).forEach((c) => walk(c as HTMLElement));

  if (rawList.length === 0 && container.innerHTML.trim()) {
    const p = document.createElement('p');
    p.innerHTML = container.innerHTML;
    rawList.push(p);
  }

  return rawList;
}

/**
 * Định dạng thống nhất cho tất cả các khối nội dung:
 * - Chữ đen tuyền 100% (#000000), nét đậm rõ ràng, tương phản tối đa
 * - Font chữ to (21px), dễ đọc trên điện thoại mà không cần zoom
 */
function applyPdfBlockStyles(item: HTMLElement) {
  const tag = item.tagName.toUpperCase();
  item.style.color = '#000000';
  item.style.boxSizing = 'border-box';

  const isHeading = isHeadingElement(item);

  if (/^H[1-4]$/.test(tag) || (isHeading && tag === 'P')) {
    item.style.fontFamily = "'Times New Roman', Times, Georgia, serif";
    item.style.fontWeight = '900';
    item.style.color = '#000000';
    if (tag === 'H1') {
      item.style.fontSize = '26px';
      item.style.margin = '16px 0 8px 0';
      item.style.borderLeft = '5px solid #000000';
      item.style.paddingLeft = '10px';
    } else if (tag === 'H2') {
      item.style.fontSize = '24px';
      item.style.margin = '14px 0 6px 0';
      item.style.borderBottom = '2px solid #000000';
      item.style.paddingBottom = '4px';
    } else if (tag === 'H3') {
      item.style.fontSize = '22px';
      item.style.margin = '12px 0 6px 0';
    } else {
      item.style.fontSize = '21.5px';
      item.style.margin = '10px 0 6px 0';
    }
  } else if (tag === 'P') {
    item.style.fontSize = '21px';
    item.style.lineHeight = '1.65';
    item.style.fontWeight = '500';
    item.style.margin = '0 0 8px 0';
    item.style.textAlign = 'justify';
    item.style.color = '#000000';
  } else if (tag === 'BLOCKQUOTE') {
    item.style.fontSize = '20px';
    item.style.lineHeight = '1.65';
    item.style.fontWeight = '500';
    item.style.color = '#000000';
    item.style.background = '#f8fafc';
    item.style.borderLeft = '4px solid #000000';
    item.style.padding = '8px 14px';
    item.style.margin = '10px 0';
    item.style.borderRadius = '4px';
    item.style.fontStyle = 'italic';
  } else {
    item.style.fontSize = '21px';
    item.style.lineHeight = '1.65';
    item.style.color = '#000000';
    item.style.margin = '0 0 8px 0';
  }

  // Toàn bộ phần tử con cũng mang màu đen tuyền tuyệt đối
  const allChildren = item.querySelectorAll('*');
  allChildren.forEach((child) => {
    const el = child as HTMLElement;
    el.style.color = '#000000';
    if (el.tagName === 'B' || el.tagName === 'STRONG') {
      el.style.fontWeight = '900';
    }
  });
}

/**
 * Tự động kết xuất và tải trực tiếp file PDF chuyên nghiệp về máy (Mobile & PC).
 * - Sử dụng html-to-image (PNG Retina 2x) + jsPDF chia trang chuẩn A4.
 * - Chữ đen tuyền 100% (#000000), font chữ to sắc nét, đọc cực rõ trên điện thoại.
 * - Bảo đảm Footer không bao giờ bị mất ở bất kỳ trang nào.
 * - Bẻ nhỏ khối nội dung linh hoạt, không để trang giấy bị trống lỗ chỗ.
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
      width: 260,
      margin: 1,
      color: {
        dark: '#000000',
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
    // 4. Phân tích nội dung readingHtml thành các khối (blocks) chi tiết
    const rawBlocks = parseHtmlToBlocks(readingHtml);

    // Container đo đạc kích thước thực tế
    const measureBox = document.createElement('div');
    measureBox.style.width = '738px'; // Chiều rộng nội dung (794px - 28px * 2)
    measureBox.style.boxSizing = 'border-box';
    measureBox.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    measureBox.style.fontSize = '21px';
    measureBox.style.lineHeight = '1.65';
    host.appendChild(measureBox);

    // Đo chiều cao từng khối với style thực tế (BAO GỒM CẢ MARGIN ĐỂ KHÔNG BAO GIỜ BỊ THIẾU)
    const blockHeights: number[] = [];
    const blockClones: HTMLElement[] = [];

    for (const b of rawBlocks) {
      const clone = b.cloneNode(true) as HTMLElement;
      applyPdfBlockStyles(clone);
      measureBox.appendChild(clone);

      const h = clone.offsetHeight || 34;
      const mTop = parseFloat(clone.style.marginTop) || 0;
      const mBottom = parseFloat(clone.style.marginBottom) || 8;
      const totalHeight = h + mTop + mBottom;

      blockHeights.push(totalHeight);
      blockClones.push(clone);
      measureBox.removeChild(clone);
    }
    host.removeChild(measureBox);

    // 5. Thuật toán chia trang A4 (794px x 1123px) an toàn tuyệt đối
    // Trang 1: Overhead Header + Profile ~450px + Padding 44px + Footer 30px = 524px => Budget nội dung: 490px (Dư an toàn > 100px)
    // Các trang sau: Overhead RunningHeader ~35px + Padding 44px + Footer 30px = 109px => Budget nội dung: 890px (Dư an toàn > 120px)
    const PAGE_HEIGHT_PAGE1 = 490;
    const PAGE_HEIGHT_NORMAL = 890;
    const FOOTER_REQUIRED_HEIGHT = 280;

    const pageBlockGroups: HTMLElement[][] = [];
    let currentGroup: HTMLElement[] = [];
    let currentRemaining = PAGE_HEIGHT_PAGE1;

    for (let i = 0; i < blockClones.length; i++) {
      const clone = blockClones[i];
      const h = blockHeights[i];
      const isHeading = isHeadingElement(clone);

      // Nếu không đủ chỗ hoặc là tiêu đề nhưng không gian còn lại quá hẹp (< 110px)
      if (h > currentRemaining || (isHeading && currentRemaining < 110)) {
        if (currentGroup.length > 0) {
          // CHỐNG TIÊU ĐỀ LẺ LOI: Nếu khối cuối cùng của trang là tiêu đề, chuyển ngay sang trang mới cùng nội dung
          const lastItem = currentGroup[currentGroup.length - 1];
          if (isHeadingElement(lastItem)) {
            currentGroup.pop();
            pageBlockGroups.push(currentGroup);
            currentGroup = [lastItem, clone];
            currentRemaining = PAGE_HEIGHT_NORMAL - blockHeights[i - 1] - h;
            continue;
          } else {
            pageBlockGroups.push(currentGroup);
            currentGroup = [];
            currentRemaining = PAGE_HEIGHT_NORMAL;
          }
        }
      }

      currentGroup.push(clone);
      currentRemaining -= h;
    }

    if (currentGroup.length > 0) {
      pageBlockGroups.push(currentGroup);
    }

    // Kiểm tra trang cuối có đủ chỗ cho chân trang thương hiệu không
    const needExtraPageForFooter = currentRemaining < FOOTER_REQUIRED_HEIGHT;
    const totalPages = pageBlockGroups.length + (needExtraPageForFooter ? 1 : 0);

    // 6. Xây dựng các trang A4 hoàn chỉnh trong DOM
    const pageElements: HTMLElement[] = [];

    // --- HTML Header trang 1 (Đen tuyền, trang trọng, chữ to) ---
    const headerHtml = `
      <div style="
        text-align: center;
        border-top: 3px double #000000;
        border-bottom: 2px solid #000000;
        padding: 12px 0 10px 0;
        margin-bottom: 12px;
      ">
        <div style="font-size: 24px; color: #000000; line-height: 1; margin-bottom: 2px;">☯</div>
        <h1 style="
          font-family: 'Times New Roman', Times, Georgia, serif;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: 1.5px;
          color: #000000;
          text-transform: uppercase;
          margin: 0 0 3px 0;
        ">Tử Vi Đẩu Số Thầy Tôn</h1>
        <div style="
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #000000;
          font-weight: 800;
          margin-bottom: 3px;
        ">Tinh Hoa Dịch Học Truyền Thống • Minh Triết Đương Đại</div>
        <div style="
          font-style: italic;
          font-size: 13px;
          color: #000000;
          font-weight: 600;
          margin-bottom: 8px;
        ">"Khai Mở Bản Mệnh • Đắc Lộc Bình An • Kiến Tạo Tương Lai"</div>
        
        <div style="
          display: inline-block;
          background: #ffffff;
          border: 2px solid #000000;
          border-radius: 6px;
          padding: 6px 20px;
        ">
          <div style="
            font-family: 'Times New Roman', Times, Georgia, serif;
            font-size: 18px;
            font-weight: 900;
            color: #000000;
            text-transform: uppercase;
          ">
            ${isPro ? 'Bản Bình Giải Tử Vi Đẩu Số Chuyên Sâu' : 'Bản Bình Giải Tử Vi Đẩu Số Khởi Nguyên'}
          </div>
          <div style="font-size: 12.5px; font-weight: 800; color: #000000; margin-top: 2px;">
            ${isPro ? '👑 Bản Chuyên Sâu Bí Truyền • Dành Riêng Cho Thân Chủ' : '📜 Bản Luận Giải Khởi Nguyên Cơ Bản'}
          </div>
        </div>
      </div>
    `;

    // --- HTML Khung Hồ Sơ Bản Mệnh (Đen tuyền, rõ nét) ---
    const profileHtml = `
      <div style="
        background: #ffffff;
        border: 2px solid #000000;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 12px;
      ">
        <div style="
          font-family: 'Times New Roman', Times, Georgia, serif;
          font-size: 16px;
          font-weight: 900;
          color: #000000;
          text-transform: uppercase;
          border-bottom: 1.5px solid #000000;
          padding-bottom: 5px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
        ">
          <span>📜 Thông Tin Thân Chủ & Bản Mệnh</span>
          <span style="font-size: 13px; font-weight: 800; color: #000000;">
            ${orderCode ? `Mã đơn: ${orderCode}` : 'Hồ sơ: Bản Mệnh Tử Vi'}
          </span>
        </div>

        <div style="
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 20px;
          font-size: 15px;
          line-height: 1.5;
          color: #000000;
        ">
          <div><span style="color: #000000; font-weight: 700;">Họ và tên:</span> <span style="color: #000000; font-weight: 900; font-size: 17px;">${hoTen.toUpperCase()}</span></div>
          <div><span style="color: #000000; font-weight: 700;">Giới tính:</span> <span style="font-weight: 700; color: #000000;">${gioiTinh} (${amDuongTxt || (gioiTinh === 'Nam' ? 'Dương Nam' : 'Âm Nữ')})</span></div>
          <div><span style="color: #000000; font-weight: 700;">Dương lịch:</span> <span style="font-weight: 700; color: #000000;">${ngayDuongStr}</span></div>
          <div><span style="color: #000000; font-weight: 700;">Giờ sinh:</span> <span style="font-weight: 700; color: #000000;">${gioSinhLabel}</span></div>
          <div><span style="color: #000000; font-weight: 700;">Âm lịch:</span> <span style="font-weight: 700; color: #000000;">${ngayAmStr}</span></div>
          <div><span style="color: #000000; font-weight: 700;">Bát tự:</span> <span style="font-weight: 700; color: #000000;">${batTuStr || 'Đã quy nạp'}</span></div>
          <div><span style="color: #000000; font-weight: 700;">Bản mệnh:</span> <span style="font-weight: 700; color: #000000;">${banMenh}</span></div>
          <div><span style="color: #000000; font-weight: 700;">Cục số:</span> <span style="font-weight: 700; color: #000000;">${tenCuc || 'Thuận Cục'}${sinhKhac ? ` (${sinhKhac})` : ''}</span></div>
          <div><span style="color: #000000; font-weight: 700;">Cung an Thân:</span> <span style="font-weight: 700; color: #000000;">${thanCu}</span></div>
          <div><span style="color: #000000; font-weight: 700;">Mệnh/Thân chủ:</span> <span style="font-weight: 700; color: #000000;">${[menhChu, thanChu].filter(Boolean).join(' • ') || 'Đã an sao'}</span></div>
          <div><span style="color: #000000; font-weight: 700;">Năm xem:</span> <span style="font-weight: 700; color: #000000;">${namXem} (${namXemCanChi})${tuoiAmXem ? ` • ${tuoiAmXem}` : ''}</span></div>
          <div><span style="color: #000000; font-weight: 700;">Hạng:</span> <span style="color: #000000; font-weight: 900;">${isPro ? '👑 VIP Pro Chuyên Sâu' : '📜 Khởi Nguyên Cơ Bản'}</span></div>
        </div>
      </div>

      <div style="text-align: center; margin: 8px 0 10px 0; color: #000000; letter-spacing: 4px; font-size: 13px; font-weight: 900;">
        ❖ ✦ ❖
      </div>
    `;

    // --- HTML Chân Trang Thương Hiệu Thầy Tôn (Đen tuyền, rõ nét) ---
    const brandFooterHtml = `
      <div style="
        margin-top: 14px;
        background: #ffffff;
        border: 2px solid #000000;
        border-radius: 8px;
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      ">
        <div style="flex: 1 1 360px;">
          <div style="
            font-family: 'Times New Roman', Times, Georgia, serif;
            font-size: 18px;
            font-weight: 900;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          ">
            ☯ Tử Vi Phong Thủy Thầy Tôn
          </div>
          <div style="font-size: 14px; color: #000000; font-weight: 600; display: flex; flex-direction: column; gap: 3px;">
            <div><strong style="color: #000000; font-weight: 800;">Địa chỉ:</strong> R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội</div>
            <div><strong style="color: #000000; font-weight: 800;">Hotline/Zalo:</strong> <span style="font-weight: 900; color: #000000;">0935 058 688</span></div>
            <div><strong style="color: #000000; font-weight: 800;">Website:</strong> <span style="font-weight: 900; color: #000000;">https://tuvithayton.vn</span></div>
            <div><strong style="color: #000000; font-weight: 800;">Email:</strong> tranhuyton@gmail.com • thayton@tuvithayton.vn</div>
          </div>
          <div style="font-style: italic; font-size: 12.5px; color: #000000; font-weight: 600; margin-top: 6px; line-height: 1.4;">
            "Mệnh do trời định, Vận do nhân tạo. Thấu triệt bản mệnh là nấc thang đầu tiên để tu tâm tích phúc, xu cát tị hung, kiến tạo cuộc đời an khang thịnh vượng."
          </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; flex-shrink: 0;">
          ${
            qrCodeDataUrl
              ? `<img src="${qrCodeDataUrl}" alt="QR tuvithayton.vn" style="width: 95px; height: 95px; border: 2px solid #000000; border-radius: 6px; background: #ffffff; padding: 2px;" />`
              : ''
          }
          <div style="font-size: 11px; font-weight: 700; color: #000000; max-width: 125px; margin-top: 3px; line-height: 1.25;">
            Quét mã mở lá số tại tuvithayton.vn
          </div>
        </div>
      </div>

      <div style="
        text-align: center;
        font-size: 11.5px;
        font-weight: 700;
        color: #000000;
        margin-top: 8px;
        border-top: 1.5px solid #000000;
        padding-top: 5px;
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
      pageEl.style.padding = '24px 28px 20px 28px';
      pageEl.style.boxSizing = 'border-box';
      pageEl.style.backgroundColor = '#ffffff';
      pageEl.style.color = '#000000';
      pageEl.style.position = 'relative';
      pageEl.style.display = 'flex';
      pageEl.style.flexDirection = 'column';
      pageEl.style.justifyContent = 'space-between';
      pageEl.style.overflow = 'hidden';
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
        runningHeader.style.borderBottom = '2px solid #000000';
        runningHeader.style.paddingBottom = '5px';
        runningHeader.style.marginBottom = '12px';
        runningHeader.style.fontSize = '13px';
        runningHeader.style.color = '#000000';
        runningHeader.style.fontWeight = '800';
        runningHeader.style.textTransform = 'uppercase';
        runningHeader.innerHTML = `
          <span>Tử Vi Đẩu Số Thầy Tôn • Bản Luận Giải Bản Mệnh</span>
          <span>Thân chủ: ${hoTen}</span>
        `;
        topContainer.appendChild(runningHeader);
      }

      // Content Container
      const contentContainer = document.createElement('div');
      contentContainer.style.fontSize = '21px';
      contentContainer.style.lineHeight = '1.65';
      contentContainer.style.textAlign = 'justify';
      contentContainer.style.color = '#000000';

      for (const block of group) {
        const item = block.cloneNode(true) as HTMLElement;
        applyPdfBlockStyles(item);
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

      // Bottom Running Page Number (LUÔN CỐ ĐỊNH, KHÔNG BAO GIỜ BỊ ĐẨY MẤT)
      const bottomBar = document.createElement('div');
      bottomBar.style.display = 'flex';
      bottomBar.style.justifyContent = 'space-between';
      bottomBar.style.alignItems = 'center';
      bottomBar.style.height = '24px';
      bottomBar.style.flexShrink = '0';
      bottomBar.style.fontSize = '12px';
      bottomBar.style.fontWeight = '700';
      bottomBar.style.color = '#000000';
      bottomBar.style.borderTop = '1.5px solid #000000';
      bottomBar.style.paddingTop = '5px';
      bottomBar.style.marginTop = '6px';
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
      extraPage.style.padding = '24px 28px 20px 28px';
      extraPage.style.boxSizing = 'border-box';
      extraPage.style.backgroundColor = '#ffffff';
      extraPage.style.color = '#000000';
      extraPage.style.position = 'relative';
      extraPage.style.display = 'flex';
      extraPage.style.flexDirection = 'column';
      extraPage.style.justifyContent = 'space-between';
      extraPage.style.overflow = 'hidden';
      extraPage.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

      const topPart = document.createElement('div');
      topPart.style.flex = '1';
      topPart.innerHTML = `
        <div style="
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #000000;
          padding-bottom: 5px;
          margin-bottom: 20px;
          font-size: 13px;
          color: #000000;
          font-weight: 800;
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
      bottomBar.style.alignItems = 'center';
      bottomBar.style.height = '24px';
      bottomBar.style.flexShrink = '0';
      bottomBar.style.fontSize = '12px';
      bottomBar.style.fontWeight = '700';
      bottomBar.style.color = '#000000';
      bottomBar.style.borderTop = '1.5px solid #000000';
      bottomBar.style.paddingTop = '5px';
      bottomBar.style.marginTop = '6px';
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

    // 7. Kết xuất từng trang thành ảnh PNG sắc nét (Retina 2x, không nhiễu JPEG) và ghép vào PDF
    const pdfDoc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    for (let i = 0; i < pageElements.length; i++) {
      onProgress?.(`Đang tạo trang ${i + 1}/${totalPages}...`);

      const pNode = pageElements[i];
      const imgDataUrl = await htmlToImage.toPng(pNode, {
        pixelRatio: 2.0, // Độ nét cực cao chuẩn Retina, triệt tiêu mờ nhạt
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

      pdfDoc.addImage(imgDataUrl, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
    }

    onProgress?.('Đang hoàn tất và lưu file PDF...');

    // 8. Tạo Blob và tải file
    const pdfBlob: Blob = pdfDoc.output('blob');
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    // Chỉ mở Share Sheet trên thiết bị di động (iOS / Android) nếu trình duyệt hỗ trợ
    const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent || '');
    if (isMobile && typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `Lá số Tử Vi Thầy Tôn - ${hoTen}`,
          text: `Bản bình giải Tử Vi Đẩu Số dành cho ${hoTen} từ Tử Vi Phong Thủy Thầy Tôn (tuvithayton.vn)`,
        });
        return;
      } catch (shareErr: unknown) {
        if ((shareErr as { name?: string })?.name === 'AbortError') {
          return;
        }
      }
    }

    // Tự động tải về máy trực tiếp
    const downloadUrl = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);
  } finally {
    if (document.body.contains(host)) {
      document.body.removeChild(host);
    }
  }
}
