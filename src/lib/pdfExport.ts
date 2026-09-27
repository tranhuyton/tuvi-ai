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
  chartImageDataUrl?: string;
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
 * - Trang 1: Chứa toàn bộ HÌNH ẢNH LÁ SỐ TỬ VI TOÀN ĐỒ (12 cung + thiên bàn) sắc nét để đối chiếu.
 * - Trang 2+: Toàn bộ bài bình giải luận giải chuyên sâu to rõ, chữ đen tuyền, không bao giờ mất footer.
 */
export async function exportReadingToPdf({
  duongSo,
  laSo,
  readingHtml,
  tier = 'free',
  chartTitle,
  orderCode,
  chartImageDataUrl,
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

  // 3. Chụp hình Lá Số Tử Vi (từ DOM hoặc lấy từ tham số truyền vào)
  onProgress?.('Đang kết xuất hình ảnh lá số tử vi...');
  let chartImage = chartImageDataUrl || '';
  if (!chartImage) {
    const boardNode = document.getElementById('tuvi-board-export-node');
    if (boardNode) {
      try {
        const fullHeight = boardNode.scrollHeight || boardNode.offsetHeight || 880;
        chartImage = await htmlToImage.toPng(boardNode, {
          quality: 0.98,
          pixelRatio: 2.0,
          width: 760,
          height: fullHeight,
          backgroundColor: '#ffffff',
          style: {
            transform: 'none',
            width: '760px',
            margin: '0',
            backgroundColor: '#ffffff',
          },
        });
      } catch (err) {
        console.warn('Không thể chụp hình lá số từ DOM:', err);
      }
    }
  }

  // 4. Tạo host container ẩn trong DOM để đo đạc và tạo các trang
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
    // 5. Phân tích nội dung readingHtml thành các khối (blocks) chi tiết
    const rawBlocks = parseHtmlToBlocks(readingHtml);

    const measureBox = document.createElement('div');
    measureBox.style.width = '738px';
    measureBox.style.boxSizing = 'border-box';
    measureBox.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    measureBox.style.fontSize = '21px';
    measureBox.style.lineHeight = '1.65';
    host.appendChild(measureBox);

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

    // 6. Phân trang nội dung luận giải
    // Nếu có Trang 1 dành riêng cho Hình Lá Số => Các trang luận giải đều dùng chuẩn an toàn 890px
    const PAGE_HEIGHT_NORMAL = 890;
    const PAGE_HEIGHT_PAGE1_NO_CHART = 490;
    const FOOTER_REQUIRED_HEIGHT = 280;

    const pageBlockGroups: HTMLElement[][] = [];
    let currentGroup: HTMLElement[] = [];
    let currentRemaining = chartImage ? PAGE_HEIGHT_NORMAL : PAGE_HEIGHT_PAGE1_NO_CHART;

    for (let i = 0; i < blockClones.length; i++) {
      const clone = blockClones[i];
      const h = blockHeights[i];
      const isHeading = isHeadingElement(clone);

      if (h > currentRemaining || (isHeading && currentRemaining < 110)) {
        if (currentGroup.length > 0) {
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

    const needExtraPageForFooter = currentRemaining < FOOTER_REQUIRED_HEIGHT;
    // Tổng số trang = (1 trang lá số nếu có) + (các trang luận giải) + (1 trang chân trang nếu cần)
    const totalPages = (chartImage ? 1 : 0) + pageBlockGroups.length + (needExtraPageForFooter ? 1 : 0);

    const pageElements: HTMLElement[] = [];

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

    // =========================================================================
    // 7. XÂY DỰNG TRANG 1: TRANG BÌA & HÌNH ẢNH LÁ SỐ TOÀN ĐỒ (Nếu có hình lá số)
    // =========================================================================
    if (chartImage) {
      const page1 = document.createElement('div');
      page1.style.width = '794px';
      page1.style.height = '1123px';
      page1.style.minHeight = '1123px';
      page1.style.maxHeight = '1123px';
      page1.style.padding = '18px 28px 16px 28px';
      page1.style.boxSizing = 'border-box';
      page1.style.backgroundColor = '#ffffff';
      page1.style.color = '#000000';
      page1.style.position = 'relative';
      page1.style.display = 'flex';
      page1.style.flexDirection = 'column';
      page1.style.justifyContent = 'space-between';
      page1.style.overflow = 'hidden';
      page1.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

      const topPart1 = document.createElement('div');
      topPart1.style.flex = '1';
      topPart1.style.display = 'flex';
      topPart1.style.flexDirection = 'column';

      topPart1.innerHTML = `
        <!-- Tiêu đề thương hiệu Thầy Tôn -->
        <div style="
          text-align: center;
          border-top: 3px double #000000;
          border-bottom: 2px solid #000000;
          padding: 8px 0;
          margin-bottom: 8px;
        ">
          <div style="font-size: 20px; color: #000000; line-height: 1; margin-bottom: 2px;">☯</div>
          <h1 style="
            font-family: 'Times New Roman', Times, Georgia, serif;
            font-size: 24px;
            font-weight: 900;
            letter-spacing: 1px;
            color: #000000;
            text-transform: uppercase;
            margin: 0 0 2px 0;
          ">Tử Vi Đẩu Số Thầy Tôn</h1>
          <div style="
            font-size: 11.5px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #000000;
            font-weight: 800;
            margin-bottom: 2px;
          ">Tinh Hoa Dịch Học Truyền Thống • Minh Triết Đương Đại</div>
          <div style="
            font-style: italic;
            font-size: 11.5px;
            color: #000000;
            font-weight: 600;
          ">"Khai Mở Bản Mệnh • Đắc Lộc Bình An • Kiến Tạo Tương Lai"</div>
        </div>

        <!-- Khung tóm tắt thông tin thân chủ -->
        <div style="
          background: #ffffff;
          border: 1.5px solid #000000;
          border-radius: 6px;
          padding: 7px 12px;
          margin-bottom: 8px;
          color: #000000;
        ">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #000000; padding-bottom: 3px; margin-bottom: 5px;">
            <div>
              <span style="font-weight: 800; font-size: 13px;">HỌ TÊN:</span> <span style="font-weight: 900; font-size: 15px; color: #000000;">${hoTen.toUpperCase()}</span>
              <span style="margin: 0 6px; font-weight: 700;">•</span>
              <span style="font-weight: 700; font-size: 13px;">GIỚI TÍNH:</span> <span style="font-weight: 800; font-size: 13px;">${gioiTinh} (${amDuongTxt || (gioiTinh === 'Nam' ? 'Dương Nam' : 'Âm Nữ')})</span>
              <span style="margin: 0 6px; font-weight: 700;">•</span>
              <span style="font-weight: 700; font-size: 13px;">HẠNG:</span> <span style="font-weight: 900; font-size: 13px;">${isPro ? '👑 VIP PRO CHUYÊN SÂU' : '📜 KHỞI NGUYÊN CƠ BẢN'}</span>
            </div>
            <div style="font-size: 12px; font-weight: 800;">
              ${orderCode ? `Mã: ${orderCode}` : 'Hồ Sơ: Bản Mệnh Tử Vi'}
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 3px 12px; font-size: 12.5px; line-height: 1.4;">
            <div><strong style="color: #000000;">Dương lịch:</strong> ${ngayDuongStr} (${gioSinhLabel})</div>
            <div><strong style="color: #000000;">Âm lịch:</strong> ${ngayAmStr}</div>
            <div><strong style="color: #000000;">Bát tự:</strong> ${batTuStr || 'Đã quy nạp'}</div>
            <div><strong style="color: #000000;">Bản mệnh:</strong> ${banMenh}</div>
            <div><strong style="color: #000000;">Cục số:</strong> ${tenCuc || 'Thuận Cục'}${sinhKhac ? ` (${sinhKhac})` : ''}</div>
            <div><strong style="color: #000000;">Cung an Thân:</strong> ${thanCu}</div>
            <div><strong style="color: #000000;">Mệnh chủ:</strong> ${menhChu || 'Đã an'}</div>
            <div><strong style="color: #000000;">Thân chủ:</strong> ${thanChu || 'Đã an'}</div>
            <div><strong style="color: #000000;">Năm xem:</strong> ${namXem} (${namXemCanChi})${tuoiAmXem ? ` • ${tuoiAmXem}` : ''}</div>
          </div>
        </div>

        <!-- Tiêu đề lá số toàn đồ -->
        <div style="
          text-align: center;
          font-family: 'Times New Roman', Times, Georgia, serif;
          font-size: 14px;
          font-weight: 900;
          color: #000000;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 6px;
        ">
          ❖ LÁ SỐ TỬ VI ĐẨU SỐ TOÀN ĐỒ (12 CUNG & THIÊN BÀN) ❖
        </div>

        <!-- HÌNH ẢNH BÀN CỜ LÁ SỐ TOÀN DIỆN -->
        <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
        ">
          <img
            src="${chartImage}"
            alt="Lá Số Tử Vi ${hoTen}"
            style="
              width: 100%;
              max-height: 850px;
              object-fit: contain;
              border: 2px solid #000000;
              border-radius: 6px;
              display: block;
              background: #ffffff;
            "
          />
        </div>
      `;
      page1.appendChild(topPart1);

      // Thanh chân trang Trang 1
      const bottomBar1 = document.createElement('div');
      bottomBar1.style.display = 'flex';
      bottomBar1.style.justifyContent = 'space-between';
      bottomBar1.style.alignItems = 'center';
      bottomBar1.style.height = '24px';
      bottomBar1.style.flexShrink = '0';
      bottomBar1.style.fontSize = '12px';
      bottomBar1.style.fontWeight = '700';
      bottomBar1.style.color = '#000000';
      bottomBar1.style.borderTop = '1.5px solid #000000';
      bottomBar1.style.paddingTop = '5px';
      bottomBar1.style.marginTop = '6px';
      bottomBar1.innerHTML = `
        <span>tuvithayton.vn • Hotline: 0935 058 688</span>
        <span>Trang 1 / ${totalPages}</span>
      `;
      page1.appendChild(bottomBar1);

      host.appendChild(page1);
      pageElements.push(page1);
    }

    // =========================================================================
    // 8. XÂY DỰNG CÁC TRANG BÌNH GIẢI LUẬN GIẢI NỘI DUNG (Từ Trang 2 trở đi)
    // =========================================================================
    const startingContentPageNum = chartImage ? 2 : 1;

    for (let pIdx = 0; pIdx < pageBlockGroups.length; pIdx++) {
      const pageNum = startingContentPageNum + pIdx;
      const isFirstContentPage = pIdx === 0;
      const isLastContentPage = pIdx === pageBlockGroups.length - 1;
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

      const topContainer = document.createElement('div');
      topContainer.style.flex = '1';
      topContainer.style.display = 'flex';
      topContainer.style.flexDirection = 'column';

      // Header chạy ở đầu mỗi trang luận giải
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
        <span>Tử Vi Đẩu Số Thầy Tôn • Bản Luận Giải Chi Tiết</span>
        <span>Thân chủ: ${hoTen}</span>
      `;
      topContainer.appendChild(runningHeader);

      // Nếu là trang đầu tiên của phần luận giải, thêm banner tiêu đề bản luận giải
      if (isFirstContentPage) {
        const introBanner = document.createElement('div');
        introBanner.style.textAlign = 'center';
        introBanner.style.border = '2px solid #000000';
        introBanner.style.borderRadius = '6px';
        introBanner.style.padding = '8px 16px';
        introBanner.style.marginBottom = '14px';
        introBanner.style.background = '#ffffff';
        introBanner.innerHTML = `
          <div style="font-family: 'Times New Roman', Times, Georgia, serif; font-size: 19px; font-weight: 900; color: #000000; text-transform: uppercase;">
            ${isPro ? 'BẢN BÌNH GIẢI TỬ VI ĐẨU SỐ CHUYÊN SÂU' : 'BẢN BÌNH GIẢI TỬ VI ĐẨU SỐ KHỞI NGUYÊN'}
          </div>
          <div style="font-size: 12.5px; font-weight: 800; color: #000000; margin-top: 2px;">
            ${isPro ? '👑 Bản Chuyên Sâu Bí Truyền • Soi Chiếu Tinh Đẩu & Tướng Pháp' : '📜 Bản Luận Giải Khởi Nguyên Cơ Bản'}
          </div>
        `;
        topContainer.appendChild(introBanner);
      }

      // Content Container chứa các khối đoạn văn
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

      // Bottom Running Page Number (Cố định, không bao giờ bị mất)
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

    // =========================================================================
    // 9. NẾU CẦN TRANG RIÊNG CHO CHÂN TRANG THƯƠNG HIỆU & MÃ QR
    // =========================================================================
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

    // Đợi 250ms để tất cả hình ảnh lá số, QR và DOM render ổn định
    await new Promise((resolve) => setTimeout(resolve, 250));

    // 10. Kết xuất từng trang thành ảnh PNG sắc nét (Retina 2x, không nhiễu) và ghép vào PDF
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

    // 11. Tạo Blob và tải file
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
