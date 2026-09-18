import { DuLieuDuongSo, LaSoData, CungLaSo, SaoInfo } from '@/types/tuvi';
import { solar2Lunar, jdFromDate } from './lunar';
import {
  CAN_ARR,
  CAN_ABBR,
  CHI_ARR,
  HANH_ARR,
  CUNG_NAMES,
  MENH_CHU,
  THAN_CHU,
  DAC_HAM,
  CHINH_TINH_COLORS,
  BAD_STARS,
  HOA_LOC_MAP,
  HOA_QUYEN_MAP,
  HOA_KHOA_MAP,
  HOA_KY_MAP,
  NAP_AM_MAP,
  PHU_TINH_DAC_HAM,
} from './constants';

function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

export function lapLaSoTuVi(data: DuLieuDuongSo, namXem = 2026): LaSoData {
  const isLateTy = data.gioSinhVal === '0_23';
  const gioSinh = isLateTy || data.gioSinhVal === '0_0' ? 0 : parseInt(data.gioSinhVal, 10);

  let nd = data.ngayDuong;
  let td = data.thangDuong;
  let n_d = data.namDuong;

  // Nếu là giờ Tý Dạ (23h - 24h), ngày dương được tính sang ngày hôm sau
  if (isLateTy) {
    const daysInMonth = new Date(n_d, td, 0).getDate();
    if (nd < daysInMonth) {
      nd++;
    } else {
      nd = 1;
      td++;
      if (td > 12) {
        td = 1;
        n_d++;
      }
    }
  }

  // Chuyển đổi Dương lịch -> Âm lịch
  const [ngayAmRaw, thangAmRaw, namAmRaw, isLeap] = solar2Lunar(nd, td, n_d, 7.0);
  const thangAmGoc = thangAmRaw;
  let thangAm = thangAmRaw;
  let namAm = namAmRaw;
  const ngayAm = ngayAmRaw;

  // Quy tắc tính tháng âm nhuận: Sau ngày 15 nhuận tính sang tháng kế tiếp
  if (isLeap && ngayAm > 15) {
    thangAm++;
    if (thangAm > 12) {
      thangAm = 1;
      namAm++;
    }
  }

  const canNamIdx = (namAm + 6) % 10;
  const chiNamIdx = (namAm + 8) % 12;
  const namCanChi = `${CAN_ARR[canNamIdx]} ${CHI_ARR[chiNamIdx]}`;

  const amDuongNam = canNamIdx % 2 === 0 ? 1 : -1;
  const isNam = data.gioiTinh === 'Nam' ? 1 : -1;
  const thuanNghich = amDuongNam * isNam;

  // Cung Mệnh & Thân
  const menh = mod12(2 + thangAm - 1 - gioSinh);
  const than = mod12(2 + thangAm - 1 + gioSinh);

  // Bản Mệnh Ngũ Hành Nạp Âm
  const vCanNam = Math.floor(canNamIdx / 2) + 1;
  const vChiNam = [0, 1, 6, 7].includes(chiNamIdx)
    ? 0
    : [2, 3, 8, 9].includes(chiNamIdx)
    ? 1
    : 2;
  let sNam = vCanNam + vChiNam;
  if (sNam > 5) sNam -= 5;
  const banMenh = HANH_ARR[sNam];
  const napAmMenh = NAP_AM_MAP[namCanChi] || `${banMenh} Mệnh`;

  // Can của 12 cung (Ngũ Hổ Độn bắt đầu từ Dần)
  const canThangDan = ((canNamIdx % 5) * 2 + 2) % 10;
  const canCungArr: number[] = [];
  for (let i = 0; i < 12; i++) {
    canCungArr[i] = (canThangDan + mod12(i - 2)) % 10;
  }

  // Can Chi Tháng sinh
  const chiThangIdx = (thangAmGoc + 1) % 12;
  const canThangIdx = (canThangDan + thangAmGoc - 1) % 10;
  const thangCanChi = `${CAN_ARR[canThangIdx]} ${CHI_ARR[chiThangIdx]}`;

  // Can Chi Ngày sinh
  const jd = jdFromDate(nd, td, n_d);
  const canNgayIdx = (jd + 9) % 10;
  const chiNgayIdx = (jd + 1) % 12;
  const ngayCanChi = `${CAN_ARR[canNgayIdx]} ${CHI_ARR[chiNgayIdx]}`;

  // Can Chi Giờ sinh (Ngũ Thử Độn)
  const canGioTy = ((canNgayIdx % 5) * 2) % 10;
  const canGioIdx = (canGioTy + gioSinh) % 10;
  const gioCanChi = `${CAN_ARR[canGioIdx]} ${CHI_ARR[gioSinh]}`;

  // Cục
  const canMenh = (canThangDan + mod12(menh - 2)) % 10;
  const vCanMenh = Math.floor(canMenh / 2) + 1;
  const vChiMenh = [0, 1, 6, 7].includes(menh)
    ? 0
    : [2, 3, 8, 9].includes(menh)
    ? 1
    : 2;
  let sumCuc = vCanMenh + vChiMenh;
  if (sumCuc > 5) sumCuc -= 5;
  const cucMap: Record<number, number> = { 1: 4, 2: 2, 3: 6, 4: 5, 5: 3 };
  const cuc = cucMap[sumCuc];
  const tenCucMap: Record<number, string> = {
    2: 'Thủy Nhị Cục',
    3: 'Mộc Tam Cục',
    4: 'Kim Tứ Cục',
    5: 'Thổ Ngũ Cục',
    6: 'Hỏa Lục Cục',
  };
  const tenCuc = tenCucMap[cuc];

  // Sinh khắc Mệnh Cục (Theo chuẩn Lý Số)
  const hanhMap: Record<string, number> = { Kim: 0, Thủy: 1, Mộc: 2, Hỏa: 3, Thổ: 4 };
  const mV = hanhMap[banMenh];
  const cV = hanhMap[tenCuc.split(' ')[0]];
  let sinhKhac = '';
  if (mV === cV) sinhKhac = 'Mệnh Cục tị hòa';
  else if ((cV + 1) % 5 === mV) sinhKhac = 'Cục sinh Mệnh';
  else if ((mV + 1) % 5 === cV) sinhKhac = 'Mệnh sinh Cục';
  else if ((cV + 2) % 5 === mV) sinhKhac = 'Cục khắc Mệnh';
  else sinhKhac = 'Mệnh khắc Cục';

  // Thân cư
  const thanPalaceId = mod12(12 + menh - than);
  const thanPalaceName = CUNG_NAMES[thanPalaceId];
  let thanCuName = `Thân cư ${thanPalaceName}`;
  if (thanPalaceName === 'Phúc Đức') thanCuName = 'Thân cư Phúc';
  else if (thanPalaceName === 'Quan Lộc') thanCuName = 'Thân cư Quan';
  else if (thanPalaceName === 'Tài Bạch') thanCuName = 'Thân cư Tài';
  else if (thanPalaceName === 'Thiên Di') thanCuName = 'Thân cư Di';
  else if (thanPalaceName === 'Phu Thê') thanCuName = data.gioiTinh === 'Nam' ? 'Thân cư Thê' : 'Thân cư Phu';

  const amDuongTxt = `${canNamIdx % 2 === 0 ? 'Dương' : 'Âm'} ${data.gioiTinh === 'Nam' ? 'Nam' : 'Nữ'}`;
  const thuanNghichLy = canNamIdx % 2 === menh % 2 ? 'Âm Dương thuận lý' : 'Âm Dương nghịch lý';

  const menhChu = MENH_CHU[menh];
  const thanChu = THAN_CHU[chiNamIdx];

  // Đại Vận
  const daiVanArr: number[] = [];
  for (let i = 0; i < 12; i++) {
    daiVanArr[i] = cuc + (thuanNghich === 1 ? mod12(i - menh) : mod12(menh - i)) * 10;
  }

  // Vận hạn năm xem
  const canNamXemIdx = (namXem + 6) % 10;
  const chiNamXemIdx = (namXem + 8) % 12;
  const namXemCanChi = `${CAN_ARR[canNamXemIdx]} ${CHI_ARR[chiNamXemIdx]}`;
  const tuoiAmXem = namXem - namAm + 1;

  let startTv = 0;
  if ([2, 6, 10].includes(chiNamIdx)) startTv = 4;
  else if ([8, 0, 4].includes(chiNamIdx)) startTv = 10;
  else if ([5, 9, 1].includes(chiNamIdx)) startTv = 7;
  else if ([11, 3, 7].includes(chiNamIdx)) startTv = 1;

  const dirTv = isNam === 1 ? 1 : -1;
  const tieuVanArr: string[] = [];
  for (let p = 0; p < 12; p++) {
    tieuVanArr[p] = `năm ${CHI_ARR[mod12(chiNamIdx + (p - startTv) * dirTv)]}`;
  }

  const tvNamXem = mod12(startTv + mod12(chiNamXemIdx - chiNamIdx) * dirTv);
  const endHouse = mod12(tvNamXem - (thangAmGoc - 1));
  const month1House = mod12(endHouse + gioSinh);
  const nguyetVanArr: string[] = [];
  for (let p = 0; p < 12; p++) {
    nguyetVanArr[p] = `tháng ${mod12(p - month1House) + 1}`;
  }

  // Khởi tạo 12 cung lưu trữ sao
  interface RawCung {
    c: string[];
    t: string[];
    x: string[];
    ts: string;
  }
  const s: RawCung[] = Array.from({ length: 12 }, () => ({ c: [], t: [], x: [], ts: '' }));

  const add = (p: number, n: string, type: 'c' | 't' | 'x') => {
    s[mod12(p)][type].push(n);
  };

  const addPt = (p: number, n: string) => {
    const isBad = BAD_STARS.includes(n);
    s[mod12(p)][isBad ? 'x' : 't'].push(n);
  };

  // An 14 Chính Tinh
  const q = Math.floor(ngayAm / cuc);
  const r = ngayAm % cuc;
  let tuvi = 0;
  if (r === 0) {
    tuvi = mod12(2 + q - 1);
  } else {
    const qNext = q + 1;
    const d = qNext * cuc - ngayAm;
    tuvi = d % 2 === 1 ? mod12(2 + qNext - 1 - d) : mod12(2 + qNext - 1 + d);
  }

  // Vòng Tử Vi
  add(tuvi, 'TỬ VI', 'c');
  add(tuvi - 1, 'THIÊN CƠ', 'c');
  add(tuvi - 3, 'THÁI DƯƠNG', 'c');
  add(tuvi - 4, 'VŨ KHÚC', 'c');
  add(tuvi - 5, 'THIÊN ĐỒNG', 'c');
  add(tuvi - 8, 'LIÊM TRINH', 'c');

  // Vòng Thiên Phủ
  const tp = mod12(4 - tuvi);
  add(tp, 'THIÊN PHỦ', 'c');
  add(tp + 1, 'THÁI ÂM', 'c');
  add(tp + 2, 'THAM LANG', 'c');
  add(tp + 3, 'CỰ MÔN', 'c');
  add(tp + 4, 'THIÊN TƯỚNG', 'c');
  add(tp + 5, 'THIÊN LƯƠNG', 'c');
  add(tp + 6, 'THẤT SÁT', 'c');
  add(tp + 10, 'PHÁ QUÂN', 'c');

  // Vòng Thái Tuế
  const vTt = [
    'Thái Tuế', 'Thiếu Dương', 'Tang Môn', 'Thiếu Âm', 'Quan Phù', 'Tử Phù',
    'Tuế Phá', 'Long Đức', 'Bạch Hổ', 'Phúc Đức', 'Điếu Khách', 'Trực Phù'
  ];
  for (let i = 0; i < 12; i++) {
    addPt(chiNamIdx + i, vTt[i]);
  }

  // Lộc Tồn, Kình Dương, Đà La & Vòng Bác Sĩ
  const locMap: Record<number, number> = {
    0: 2, 1: 3, 2: 5, 3: 6, 4: 5, 5: 6, 6: 8, 7: 9, 8: 11, 9: 0
  };
  const loc = locMap[canNamIdx];
  addPt(loc, 'Lộc Tồn');
  addPt(loc + 1, 'Kình Dương');
  addPt(loc - 1, 'Đà La');

  const vBs = [
    'Bác Sĩ', 'Lực Sĩ', 'Thanh Long', 'Tiểu Hao', 'Tướng Quân', 'Tấu Thư',
    'Phi Liêm', 'Hỷ Thần', 'Bệnh Phù', 'Đại Hao', 'Phục Binh', 'Quan Phủ'
  ];
  for (let i = 0; i < 12; i++) {
    addPt(loc + i * thuanNghich, vBs[i]);
  }

  // Vòng Trường Sinh
  const vTs = [
    'Trường Sinh', 'Mộc Dục', 'Quan Đới', 'Lâm Quan', 'Đế Vượng', 'Suy',
    'Bệnh', 'Tử', 'Mộ', 'Tuyệt', 'Thai', 'Dưỡng'
  ];
  const tsMap: Record<number, number> = { 2: 8, 3: 11, 4: 5, 5: 8, 6: 2 };
  const ts = tsMap[cuc];
  for (let i = 0; i < 12; i++) {
    s[mod12(ts + i * thuanNghich)]['ts'] = vTs[i];
  }

  // Không Kiếp
  addPt(11 - gioSinh, 'Địa Không');
  addPt(11 + gioSinh, 'Địa Kiếp');

  // Hỏa Linh
  const hoaStart = [2, 6, 10].includes(chiNamIdx) ? 1 : [8, 0, 4].includes(chiNamIdx) ? 2 : [5, 9, 1].includes(chiNamIdx) ? 3 : 9;
  const linhStart = [2, 6, 10].includes(chiNamIdx) ? 3 : 10;
  addPt(hoaStart + gioSinh * thuanNghich, 'Hỏa Tinh');
  addPt(linhStart - gioSinh * thuanNghich, 'Linh Tinh');

  // Tả Hữu, Xương Khúc, Khôi Việt
  addPt(4 + thangAm - 1, 'Tả Phù');
  addPt(10 - thangAm + 1, 'Hữu Bật');
  addPt(10 - gioSinh, 'Văn Xương');
  addPt(4 + gioSinh, 'Văn Khúc');

  const khoiMap: Record<number, number> = { 0: 1, 1: 0, 2: 11, 3: 11, 4: 1, 5: 0, 6: 1, 7: 6, 8: 3, 9: 3 };
  const vietMap: Record<number, number> = { 0: 7, 1: 8, 2: 9, 3: 9, 4: 7, 5: 8, 6: 7, 7: 2, 8: 5, 9: 5 };
  addPt(khoiMap[canNamIdx], 'Thiên Khôi');
  addPt(vietMap[canNamIdx], 'Thiên Việt');

  // Các sao theo Chi năm sinh
  addPt(4 + chiNamIdx, 'Long Trì');
  addPt(10 - chiNamIdx, 'Phượng Các');
  addPt(6 - chiNamIdx, 'Thiên Khốc');
  addPt(6 + chiNamIdx, 'Thiên Hư');

  const maMap: Record<number, number> = { 2: 8, 6: 8, 10: 8, 8: 2, 0: 2, 4: 2, 5: 11, 9: 11, 1: 11, 11: 5, 3: 5, 7: 5 };
  addPt(maMap[chiNamIdx], 'Thiên Mã');

  const hoaCaiMap: Record<number, number> = { 2: 10, 6: 10, 10: 10, 8: 4, 0: 4, 4: 4, 5: 1, 9: 1, 1: 1, 11: 7, 3: 7, 7: 7 };
  addPt(hoaCaiMap[chiNamIdx], 'Hoa Cái');

  const daoHoaMap: Record<number, number> = { 2: 3, 6: 3, 10: 3, 8: 9, 0: 9, 4: 9, 5: 6, 9: 6, 1: 6, 11: 0, 3: 0, 7: 0 };
  addPt(daoHoaMap[chiNamIdx], 'Đào Hoa');

  addPt(3 - chiNamIdx, 'Hồng Loan');
  addPt(3 - chiNamIdx + 6, 'Thiên Hỷ');

  const coThanMap: Record<number, number> = { 2: 5, 3: 5, 4: 5, 5: 8, 6: 8, 7: 8, 8: 11, 9: 11, 10: 11, 11: 2, 0: 2, 1: 2 };
  const quaTuMap: Record<number, number> = { 2: 1, 3: 1, 4: 1, 5: 4, 6: 4, 7: 4, 8: 7, 9: 7, 10: 7, 11: 10, 0: 10, 1: 10 };
  addPt(coThanMap[chiNamIdx], 'Cô Thần');
  addPt(quaTuMap[chiNamIdx], 'Quả Tú');

  // Các sao theo Tháng sinh
  addPt(9 + thangAm - 1, 'Thiên Hình');
  addPt(1 + thangAm - 1, 'Thiên Diêu');
  addPt(7 + thangAm - 1, 'Thiên Y');
  addPt(8 - thangAm + 1, 'Thiên Giải');
  addPt(7 - thangAm + 1, 'Địa Giải');
  addPt(10 - chiNamIdx, 'Giải Thần');

  // Các sao theo Giờ & Ngày
  addPt(4 + gioSinh + 2, 'Thai Phụ');
  addPt(4 + gioSinh - 2, 'Phong Cáo');
  addPt(10 - gioSinh + ngayAm - 2, 'Ân Quang');
  addPt(4 + gioSinh - ngayAm + 2, 'Thiên Quý');
  addPt(4 + thangAm - 1 + ngayAm - 1, 'Tam Thai');
  addPt(10 - thangAm + 1 - ngayAm + 1, 'Bát Tọa');

  // Các sao cố định & Mệnh Thân
  addPt(menh + chiNamIdx, 'Thiên Tài');
  addPt(than + chiNamIdx, 'Thiên Thọ');
  addPt(4, 'Thiên La');
  addPt(10, 'Địa Võng');
  addPt(menh + 5, 'Thiên Thương');
  addPt(menh + 7, 'Thiên Sứ');

  const kiepSatMap: Record<number, number> = { 2: 11, 6: 11, 10: 11, 8: 5, 0: 5, 4: 5, 5: 2, 9: 2, 1: 2, 11: 8, 3: 8, 7: 8 };
  addPt(kiepSatMap[chiNamIdx], 'Kiếp Sát');

  const quanMap: Record<number, number> = { 0: 7, 1: 4, 2: 5, 3: 2, 4: 3, 5: 9, 6: 11, 7: 9, 8: 10, 9: 6 };
  const phucMap: Record<number, number> = { 0: 9, 1: 8, 2: 0, 3: 11, 4: 3, 5: 2, 6: 6, 7: 5, 8: 6, 9: 5 };
  addPt(quanMap[canNamIdx], 'Thiên Quan');
  addPt(phucMap[canNamIdx], 'Thiên Phúc');

  addPt(mod12(chiNamIdx - thangAm + 1 + gioSinh), 'Đẩu Quân');

  // Tứ Hóa
  const hoaLocStar = HOA_LOC_MAP[canNamIdx];
  const hoaQuyenStar = HOA_QUYEN_MAP[canNamIdx];
  const hoaKhoaStar = HOA_KHOA_MAP[canNamIdx];
  const hoaKyStar = HOA_KY_MAP[canNamIdx];

  const addHoaStar = (baseStar: string, name: string, type: 't' | 'x') => {
    for (let i = 0; i < 12; i++) {
      for (const cat of ['c', 't', 'x'] as const) {
        for (const star of s[i][cat]) {
          if (star.includes(baseStar)) {
            s[i][type].push(name);
            return;
          }
        }
      }
    }
  };

  addHoaStar(hoaLocStar, 'Hóa Lộc', 't');
  addHoaStar(hoaQuyenStar, 'Hóa Quyền', 't');
  addHoaStar(hoaKhoaStar, 'Hóa Khoa', 't');
  addHoaStar(hoaKyStar, 'Hóa Kỵ', 'x');

  // Tuần & Triệt
  const trietMap: Record<number, number> = {
    0: 8, 5: 8, 1: 6, 6: 6, 2: 4, 7: 4, 3: 2, 8: 2, 4: 0, 9: 0
  };
  const triet = trietMap[canNamIdx];
  const tuan = mod12(chiNamIdx - canNamIdx + 10);

  const tG = Math.floor(tuan / 2) * 2;
  const trG = Math.floor(triet / 2) * 2;

  // Build CungLaSo objects
  const cungs: CungLaSo[] = [];
  for (let p = 0; p < 12; p++) {
    const cId = mod12(12 + menh - p);
    const cName = CUNG_NAMES[cId];
    const can = CAN_ARR[canCungArr[p]];
    const chi = CHI_ARR[p];
    const canChi = `${CAN_ABBR[can]} ${chi}`;

    const chinhTinhList: SaoInfo[] = s[p].c.map((ct) => {
      const dacHamVal = DAC_HAM[ct] ? DAC_HAM[ct][p] : undefined;
      return {
        ten: ct,
        dacHam: dacHamVal,
        loai: 'chinh',
        color: CHINH_TINH_COLORS[ct] || '#000000',
      };
    });

    const phuTinhTotList: SaoInfo[] = s[p].t.map((pt) => {
      let dacHamVal = PHU_TINH_DAC_HAM[pt]?.[p];
      if (pt === 'Hóa Lộc') dacHamVal = 'Đ';
      else if (pt === 'Hóa Quyền') dacHamVal = 'B';
      else if (pt === 'Hóa Khoa') dacHamVal = 'Đ';

      let color = '#000000';
      if (/Hóa Lộc|Hóa Quyền|Hóa Khoa/.test(pt) || pt.startsWith('L.Hóa')) {
        color = '#008000';
      } else if (/Khôi|Việt|Hồng|Hỷ|Mã/.test(pt)) {
        color = '#cc0000';
      } else if (/Lộc Tồn|Bác S|Quốc Ấn|Phúc|Quan|Thọ|Đức|Tả Phù|Thai|Tọa|Quang|Quý|Trù|Tài/.test(pt)) {
        color = '#c28b00';
      } else if (/Đào|Long Trì|Phượng|Giải|Y/.test(pt)) {
        color = '#008000';
      }

      return {
        ten: pt,
        dacHam: dacHamVal,
        loai: 'tot',
        color,
      };
    });

    const phuTinhXauList: SaoInfo[] = s[p].x.map((px) => {
      let dacHamVal = PHU_TINH_DAC_HAM[px]?.[p];
      if (px === 'Hóa Kỵ') dacHamVal = 'H';

      let color = '#cc0000';
      if (/Cô Thần|Quả Tú/.test(px)) {
        color = '#c28b00';
      }

      return {
        ten: px,
        dacHam: dacHamVal,
        loai: 'xau',
        color,
      };
    });

    cungs.push({
      cungId: p,
      cungName: cName,
      isThan: p === than,
      canChi,
      can,
      chi,
      daiVan: daiVanArr[p],
      tieuVan: tieuVanArr[p],
      nguyetVan: nguyetVanArr[p],
      truongSinh: s[p].ts,
      chinhTinh: chinhTinhList,
      phuTinhTot: phuTinhTotList,
      phuTinhXau: phuTinhXauList,
    });
  }

  return {
    duongSo: data,
    amLich: {
      ngayAm,
      thangAm,
      namAm,
      thangAmGoc,
      isLeap,
    },
    namCanChi,
    thangCanChi,
    ngayCanChi,
    gioCanChi,
    canNamIdx,
    chiNamIdx,
    amDuongTxt,
    thuanNghichLy,
    banMenh,
    napAmMenh,
    tenCuc,
    sinhKhac,
    thanCuName,
    menhChu,
    thanChu,
    menhCungIdx: menh,
    thanCungIdx: than,
    tuanGoc: tG,
    trietGoc: trG,
    namXem,
    namXemCanChi,
    tuoiAmXem,
    cungs,
  };
}

/**
 * Hàm xuất dữ liệu text 12 cung để gửi vào AI Prompt
 */
export function buildCungDataPrompt(laSo: LaSoData): string {
  let res = '';
  const { cungs, menhCungIdx, thanCungIdx, tuanGoc, trietGoc } = laSo;

  for (let i = 0; i < 12; i++) {
    const cung = cungs[i];
    const saoAll: string[] = [];

    cung.chinhTinh.forEach((s) => {
      saoAll.push(s.dacHam ? `${s.ten} (${s.dacHam})` : s.ten);
    });
    cung.phuTinhTot.forEach((s) => saoAll.push(s.ten));
    cung.phuTinhXau.forEach((s) => saoAll.push(s.ten));

    if (i === tuanGoc || i === (tuanGoc + 1) % 12) saoAll.push('Tuần Không');
    if (i === trietGoc || i === (trietGoc + 1) % 12) saoAll.push('Triệt Không');

    const saoStr = saoAll.length > 0 ? saoAll.join(', ') : 'Vô Chính Diệu';
    const cName = cung.cungName + (cung.isThan ? ' (Thân)' : '');

    res += `- Cung ${cung.chi} (${cName}), Đại vận ${cung.daiVan}: ${saoStr}.\n`;
  }
  return res;
}
