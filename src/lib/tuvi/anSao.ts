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
  GIO_ARR,
  THIEN_TRU_MAP,
  LUU_HA_MAP,
  PHA_TOAI_MAP,
  STAR_NGU_HANH_COLOR,
  VAN_TINH_MAP,
} from './constants';

function mod12(n: number): number {
  return ((n % 12) + 12) % 12;
}

export function isValidSolarDate(day: number, month: number, year: number): boolean {
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const dt = new Date(Date.UTC(year, month - 1, day));
  return dt.getUTCFullYear() === year && dt.getUTCMonth() === month - 1 && dt.getUTCDate() === day;
}

export function lapLaSoTuVi(data: DuLieuDuongSo, namXemInput?: number): LaSoData {
  const defaultLunarYear = getCurrentVietnamTimeInfo().namAm;
  const namXem = Number(namXemInput || data.namXem || defaultLunarYear);
  const safeDuongSo: DuLieuDuongSo = { ...data, namXem };

  const rawVal = String(data.gioSinhVal || '0_0').trim();
  const isLateTy = rawVal === '0_23' || rawVal.toLowerCase().includes('dạ');

  let gioSinh = 0;
  if (!isLateTy && rawVal !== '0_0') {
    const parsed = parseInt(rawVal, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 11) {
      gioSinh = parsed;
    } else {
      // Tìm theo GIO_ARR (ví dụ label có chứa "Thìn" hay "Dần")
      const entries = Object.entries(GIO_ARR) as [string, { label: string; hourIndex: number; isLateTy?: boolean }][];
      const foundEntry = entries.find(
        ([k, v]) =>
          k === rawVal ||
          v.label.toLowerCase().includes(rawVal.toLowerCase()) ||
          rawVal.toLowerCase().includes(v.label.split(' ')[0].toLowerCase())
      );
      if (foundEntry) {
        gioSinh = foundEntry[1].hourIndex;
      } else {
        const chiIdx = CHI_ARR.findIndex((c) => rawVal.toLowerCase().includes(c.toLowerCase()));
        gioSinh = chiIdx >= 0 ? chiIdx : 0;
      }
    }
  }

  let nd = Number(data.ngayDuong);
  let td = Number(data.thangDuong);
  let n_d = Number(data.namDuong);

  if (!isValidSolarDate(nd, td, n_d)) {
    throw new Error(`Ngày sinh Dương lịch không hợp lệ (${data.ngayDuong}/${data.thangDuong}/${data.namDuong}). Vui lòng kiểm tra lại ngày tháng năm sinh.`);
  }

  // Nếu là giờ Tý Dạ (23h - 24h), ngày dương được tính sang ngày hôm sau
  if (isLateTy) {
    const daysInMonth = new Date(Date.UTC(n_d, td, 0)).getUTCDate();
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
  const endHouse = mod12(tvNamXem - (thangAm - 1));
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

  // Thiên Không (đi cùng Thiếu Dương, đứng trước Thái Tuế 1 cung)
  addPt(chiNamIdx + 1, 'Thiên Không');

  // Thiên Đức & Nguyệt Đức (theo Chi năm sinh)
  addPt(9 + chiNamIdx, 'Thiên Đức');
  addPt(5 + chiNamIdx, 'Nguyệt Đức');

  // Lộc Tồn, Kình Dương, Đà La & Vòng Bác Sĩ
  const locMap: Record<number, number> = {
    0: 2, 1: 3, 2: 5, 3: 6, 4: 5, 5: 6, 6: 8, 7: 9, 8: 11, 9: 0
  };
  const loc = locMap[canNamIdx];
  addPt(loc, 'Lộc Tồn');
  addPt(loc + 1, 'Kình Dương');
  addPt(loc - 1, 'Đà La');

  // Quốc Ấn & Đường Phù (khởi từ Lộc Tồn)
  addPt(loc + 8, 'Quốc Ấn');
  addPt(loc + 5, 'Đường Phù');

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
  addPt(PHA_TOAI_MAP[chiNamIdx], 'Phá Toái');

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

  // Các sao theo Tháng sinh (Thiên Y đồng cung Thiên Diêu khởi từ Sửu thuận theo chuẩn Tân Biên)
  addPt(9 + thangAm - 1, 'Thiên Hình');
  addPt(1 + thangAm - 1, 'Thiên Diêu');
  addPt(1 + thangAm - 1, 'Thiên Y');
  addPt(8 + thangAm - 1, 'Thiên Giải');
  addPt(7 + thangAm - 1, 'Địa Giải');
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

  // Thiên Trù & Lưu Hà theo Can năm sinh
  addPt(THIEN_TRU_MAP[canNamIdx], 'Thiên Trù');
  addPt(LUU_HA_MAP[canNamIdx], 'Lưu Hà');

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
          if (star === baseStar) {
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

  // LN.Văn Tinh theo Can năm sinh (sao gốc hiển thị chuẩn LySo)
  addPt(VAN_TINH_MAP[canNamIdx], 'LN.Văn Tinh');

  // ========================================================
  // AN HỆ THỐNG SAO LƯU (LƯU NIÊN TINH ĐẨU THEO NĂM XEM namXem)
  // Chuẩn theo Lý Số Hội Quán: 14 Sao Lưu chủ chốt
  // ========================================================
  const saoLuuMap: Record<number, SaoInfo[]> = {};
  for (let i = 0; i < 12; i++) saoLuuMap[i] = [];

  const addSaoLuu = (cungIdx: number, ten: string, loai: 'tot' | 'xau') => {
    const p = mod12(cungIdx);
    const starColor = STAR_NGU_HANH_COLOR[ten] || (loai === 'tot' ? '#008000' : '#cc0000');
    const saoObj: SaoInfo = {
      ten,
      loai,
      color: starColor,
      isLuu: true,
    };
    saoLuuMap[p].push(saoObj);
    // Đưa vào s[p].t hoặc s[p].x để hiển thị chuẩn trong 2 cột bàn cờ
    s[p][loai === 'tot' ? 't' : 'x'].push(ten);
  };

  // 1. L.Thái Tuế (Hỏa - Đỏ)
  addSaoLuu(chiNamXemIdx, 'L.Thái Tuế', 'xau');

  // 2. L.Tang Môn (Mộc - Xanh lá)
  addSaoLuu(chiNamXemIdx + 2, 'L.Tang Môn', 'xau');

  // 3. L.Bạch Hổ (Kim - Xám)
  addSaoLuu(chiNamXemIdx + 8, 'L.Bạch Hổ', 'xau');

  // 4. L.Thiên Khốc & L.Thiên Hư (Thủy - Đen)
  addSaoLuu(6 - chiNamXemIdx, 'L.Thiên Khốc', 'xau');
  addSaoLuu(6 + chiNamXemIdx, 'L.Thiên Hư', 'xau');

  // 5. L.Lộc Tồn (Thổ - Vàng)
  const locLuu = locMap[canNamXemIdx];
  addSaoLuu(locLuu, 'L.Lộc Tồn', 'tot');

  // 6. L.Kình Dương & L.Đà La (Kim - Xám)
  addSaoLuu(locLuu + 1, 'L.Kình Dương', 'xau');
  addSaoLuu(locLuu - 1, 'L.Đà La', 'xau');

  // 7. L.Thiên Mã (Hỏa - Đỏ)
  const maLuu = maMap[chiNamXemIdx];
  addSaoLuu(maLuu, 'L.Thiên Mã', 'tot');

  // 8. L.Đẩu Quân (Hỏa - Đỏ) - đồng nhất dùng thangAm (tính cả quy tắc tháng nhuận > 15)
  const douQuanLuu = mod12(chiNamXemIdx - (thangAm - 1) + gioSinh);
  addSaoLuu(douQuanLuu, 'L.Đẩu Quân', 'xau');

  // 9. Lưu Tứ Hóa (L.Hóa Lộc, L.Hóa Quyền, L.Hóa Khoa, L.Hóa Kỵ) theo Can năm xem
  const hoaLocLuuStar = HOA_LOC_MAP[canNamXemIdx];
  const hoaQuyenLuuStar = HOA_QUYEN_MAP[canNamXemIdx];
  const hoaKhoaLuuStar = HOA_KHOA_MAP[canNamXemIdx];
  const hoaKyLuuStar = HOA_KY_MAP[canNamXemIdx];

  const addHoaLuuStar = (baseStar: string, name: string, loai: 'tot' | 'xau') => {
    for (let i = 0; i < 12; i++) {
      for (const cat of ['c', 't', 'x'] as const) {
        for (const star of s[i][cat]) {
          if (star === baseStar) {
            addSaoLuu(i, name, loai);
            return;
          }
        }
      }
    }
  };

  addHoaLuuStar(hoaLocLuuStar, 'L.Hóa Lộc', 'tot');
  addHoaLuuStar(hoaQuyenLuuStar, 'L.Hóa Quyền', 'tot');
  addHoaLuuStar(hoaKhoaLuuStar, 'L.Hóa Khoa', 'tot');
  addHoaLuuStar(hoaKyLuuStar, 'L.Hóa Kỵ', 'xau');

  // 10. An sao chỉ báo Lưu Niên Đại Hạn (LN.Đại Hạn) trực tiếp vào ô cung quá cung từ Đại Vận 10 năm
  let activeDaiVanIdx = -1;
  for (let i = 0; i < 12; i++) {
    if (daiVanArr[i] <= tuoiAmXem && tuoiAmXem < daiVanArr[i] + 10) {
      activeDaiVanIdx = i;
      break;
    }
  }
  const luuNienDaiHanIdx =
    activeDaiVanIdx >= 0
      ? computeLuuNienDaiHanIdx(
          activeDaiVanIdx,
          tuoiAmXem - daiVanArr[activeDaiVanIdx],
          thuanNghich
        )
      : undefined;
  if (luuNienDaiHanIdx !== undefined) {
    s[luuNienDaiHanIdx].t.push('LN.Đại Hạn');
  }

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
    let cName = CUNG_NAMES[cId];
    if (cName === 'Phu Thê') {
      cName = data.gioiTinh === 'Nữ' ? 'Phu Quân' : 'Thê Thiếp';
    }
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

      const color = STAR_NGU_HANH_COLOR[pt] || '#000000';

      return {
        ten: pt,
        dacHam: dacHamVal,
        loai: 'tot',
        color,
        isLuu: pt.startsWith('L.') || pt === 'LN.Đại Hạn',
      };
    });

    const phuTinhXauList: SaoInfo[] = s[p].x.map((px) => {
      let dacHamVal = PHU_TINH_DAC_HAM[px]?.[p];
      if (px === 'Hóa Kỵ' || px === 'Hóa Kị' || px === 'L.Hóa Kị' || px === 'L.Hóa Kỵ') {
        dacHamVal = [1, 7].includes(p) ? 'B' : 'H';
      }

      const color = STAR_NGU_HANH_COLOR[px] || '#cc0000';

      return {
        ten: px,
        dacHam: dacHamVal,
        loai: 'xau',
        color,
        isLuu: px.startsWith('L.') || px === 'LN.Đại Hạn',
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
      saoLuu: saoLuuMap[p],
    });
  }

  const luuNienDaiHanCung =
    luuNienDaiHanIdx !== undefined ? cungs[luuNienDaiHanIdx] : undefined;

  return {
    duongSo: safeDuongSo,
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
    luuNienDaiHanIdx,
    luuNienDaiHanChi: luuNienDaiHanCung?.chi,
    luuNienDaiHanCungName: luuNienDaiHanCung?.cungName,
    cungs,
  };
}

/**
 * Công thức chuẩn Tử Vi Đẩu Số tính cung Lưu Niên Đại Hạn (Quá cung từ Đại Vận 10 năm):
 * - Năm 1 (step = 0): Tại bản cung Đại Vận
 * - Năm 2 (step = 1): Nhảy sang cung Xung Chiếu của Đại Vận
 * - Năm 3 (step = 2): Từ cung Xung Chiếu lùi 1 cung ngược chiều thuận/nghịch của Đại Vận
 * - Năm 4 (step = 3): Quay trở lại cung Xung Chiếu
 * - Năm 5..9 (step = 4..8): Từ cung Xung Chiếu tiến lần lượt 1..5 cung xuôi chiều thuận/nghịch
 * - Năm 10 (step = 9): Tiến thêm 1 cung, về lại đúng bản cung Đại Vận (khép kín vòng 10 năm)
 */
export function computeLuuNienDaiHanIdx(
  dvIdx: number,
  step: number,
  thuanNghich: number
): number {
  const dir = thuanNghich >= 0 ? 1 : -1;
  if (step <= 0) return mod12(dvIdx);
  if (step === 1) return mod12(dvIdx + 6);
  if (step === 2) return mod12(dvIdx + 6 - dir);
  if (step === 3) return mod12(dvIdx + 6);
  return mod12(dvIdx + 6 + (step - 3) * dir);
}

/**
 * Xác định chiều đi Đại Vận (+1: Dương Nam / Âm Nữ thuận hành; -1: Âm Nam / Dương Nữ nghịch hành)
 * Tương thích ngược 100% với cả lá số mới và lá số đã lưu từ trước trong Supabase
 */
export function resolveThuanNghich(laSo: LaSoData): 1 | -1 {
  if (typeof laSo.canNamIdx === 'number' && laSo.duongSo?.gioiTinh) {
    const amDuongNam = laSo.canNamIdx % 2 === 0 ? 1 : -1;
    const isNam = laSo.duongSo.gioiTinh === 'Nam' ? 1 : -1;
    return amDuongNam * isNam >= 0 ? 1 : -1;
  }
  if (laSo.amDuongTxt) {
    const txt = laSo.amDuongTxt.toLowerCase();
    const isDuong = txt.includes('dương');
    const isNam = txt.includes('nam');
    return isDuong === isNam ? 1 : -1;
  }
  if (Array.isArray(laSo.cungs) && laSo.cungs.length === 12) {
    const minDvCung = laSo.cungs.reduce(
      (best, cur) => (cur.daiVan < best.daiVan ? cur : best),
      laSo.cungs[0]
    );
    const nextClockwise = laSo.cungs[(minDvCung.cungId + 1) % 12];
    if (nextClockwise && nextClockwise.daiVan === minDvCung.daiVan + 10) {
      return 1;
    }
    return -1;
  }
  return 1;
}

export interface TamHanAnalysis {
  thuanNghich: 1 | -1;
  cungDaiVan?: CungLaSo;
  startAge?: number;
  endAge?: number;
  namThuTrongDaiVan?: number;
  buocNhayMoTa?: string;
  cungLuuNienDaiHan?: CungLaSo;
  cungTieuVan?: CungLaSo;
  cungLuuThaiTue?: CungLaSo;
  daiVanCoordLabel: string;
  lndhCoordLabel: string;
  tieuVanCoordLabel: string;
  luuThaiTueCoordLabel: string;
  triggers: string[];
  luuCatTaiLndh: string[];
  luuCatChieuLndh: string[];
  luuHungTaiLndh: string[];
  luuHungChieuLndh: string[];
}

const CAT_LUU_TRONG_DIEM = new Set([
  'L.Lộc Tồn',
  'L.Thiên Mã',
  'L.Hóa Lộc',
  'L.Hóa Quyền',
  'L.Hóa Khoa',
]);

const HUNG_LUU_TRONG_DIEM = new Set([
  'L.Hóa Kị',
  'L.Hóa Kỵ',
  'L.Kình Dương',
  'L.Đà La',
  'L.Tang Môn',
  'L.Bạch Hổ',
  'L.Thiên Khốc',
  'L.Thiên Hư',
]);

/**
 * Phân tích tổng hợp tọa độ Đại Vận 10 năm + Tam Hạn năm xem (Lưu Thái Tuế - LN. Đại Hạn - Tiểu Hạn)
 * kèm phát hiện tự động các thế Trùng Phùng và Sao Lưu kích hoạt vào LN. Đại Hạn
 */
export function computeTamHanAnalysis(laSo: LaSoData): TamHanAnalysis {
  const { cungs = [], tuoiAmXem, namXemCanChi = '' } = laSo;
  const thuanNghich = resolveThuanNghich(laSo);

  const formatCoord = (c?: CungLaSo) =>
    c ? `Cung ${c.chi} (${c.cungName}${c.isThan ? ' - Thân Cư' : ''})` : '';

  const cungDaiVan = cungs.find(
    (c) => c.daiVan <= tuoiAmXem && tuoiAmXem < c.daiVan + 10
  );

  let startAge: number | undefined;
  let endAge: number | undefined;
  let namThuTrongDaiVan: number | undefined;
  let buocNhayMoTa: string | undefined;
  let cungLuuNienDaiHan: CungLaSo | undefined;

  if (cungDaiVan) {
    startAge = cungDaiVan.daiVan;
    endAge = startAge + 9;
    const step = tuoiAmXem - startAge; // 0..9
    namThuTrongDaiVan = step + 1;
    const lndhIdx =
      typeof laSo.luuNienDaiHanIdx === 'number' &&
      laSo.luuNienDaiHanIdx >= 0 &&
      laSo.luuNienDaiHanIdx < 12
        ? laSo.luuNienDaiHanIdx
        : computeLuuNienDaiHanIdx(cungDaiVan.cungId, step, thuanNghich);
    cungLuuNienDaiHan = cungs[lndhIdx];

    const chieuTxt = thuanNghich === 1 ? 'thuận' : 'nghịch';
    if (step === 0) {
      buocNhayMoTa = 'Năm thứ 1/10 của Đại vận (khởi tại bản cung Đại vận)';
    } else if (step === 1) {
      buocNhayMoTa = 'Năm thứ 2/10 của Đại vận (nhảy sang cung Xung chiếu Đại vận)';
    } else if (step === 2) {
      buocNhayMoTa = `Năm thứ 3/10 của Đại vận (từ cung Xung chiếu lùi 1 cung ngược chiều ${chieuTxt})`;
    } else if (step === 3) {
      buocNhayMoTa = 'Năm thứ 4/10 của Đại vận (quay trở lại cung Xung chiếu Đại vận)';
    } else if (step >= 4 && step <= 8) {
      buocNhayMoTa = `Năm thứ ${step + 1}/10 của Đại vận (từ Xung chiếu tiến ${step - 3} cung theo chiều ${chieuTxt})`;
    } else {
      buocNhayMoTa = 'Năm thứ 10/10 khép lại Đại vận (về lại bản cung Đại vận trước khi chuyển vận mới)';
    }
  }

  const chiNamXem = (namXemCanChi.split(' ')[1] || '').trim();
  const chiNamXemLower = chiNamXem.toLowerCase();
  const cungTieuVan = cungs.find((c) => {
    const tv = (c.tieuVan || '').trim().toLowerCase();
    return Boolean(chiNamXemLower) && (tv === `năm ${chiNamXemLower}` || tv === chiNamXemLower);
  });
  const cungLuuThaiTue = cungs.find((c) => Boolean(chiNamXem) && c.chi === chiNamXem);

  const daiVanCoordLabel = formatCoord(cungDaiVan);
  const lndhCoordLabel = formatCoord(cungLuuNienDaiHan);
  const tieuVanCoordLabel = formatCoord(cungTieuVan);
  const luuThaiTueCoordLabel = formatCoord(cungLuuThaiTue);

  const triggers: string[] = [];
  const lttIdx = cungLuuThaiTue?.cungId;
  const lndhIdx = cungLuuNienDaiHan?.cungId;
  const tvIdx = cungTieuVan?.cungId;
  const dvIdx = cungDaiVan?.cungId;

  if (
    lttIdx !== undefined &&
    lndhIdx !== undefined &&
    tvIdx !== undefined &&
    lttIdx === lndhIdx &&
    lndhIdx === tvIdx
  ) {
    triggers.push(
      `TAM HẠN TRÙNG PHÙNG ĐỒNG CUNG tại ${luuThaiTueCoordLabel}: Cả Lưu Thái Tuế (50%), LN. Đại hạn (30%) và Tiểu Hạn (20%) hội tụ cùng một cung! Đây là năm bản lề xoay chuyển cục diện cực mạnh của đương số — cát tinh hội thì bứt phá vượt bậc, sát kỵ hội thì biến động lớn cần phòng bị kỹ.`
    );
  } else {
    if (
      lttIdx !== undefined &&
      lndhIdx !== undefined &&
      tvIdx !== undefined &&
      lttIdx % 4 === lndhIdx % 4 &&
      lndhIdx % 4 === tvIdx % 4
    ) {
      triggers.push(
        `TAM HẠN HỘI TAM HỢP: Ba trụ hạn năm (Lưu Thái Tuế tại ${cungLuuThaiTue!.chi} - LN. Đại hạn tại ${cungLuuNienDaiHan!.chi} - Tiểu Hạn tại ${cungTieuVan!.chi}) cùng nằm trong một vòng Tam hợp, tạo sự cộng hưởng Thiên - Địa - Nhân xuyên suốt cả năm.`
      );
    }
    if (lndhIdx !== undefined && lttIdx !== undefined && lndhIdx === lttIdx) {
      triggers.push(
        `LN. ĐẠI HẠN TRÙNG LƯU THÁI TUẾ tại ${lndhCoordLabel}: Mạch trung hạn 10 năm giao cắt trực diện với sóng thời cuộc năm xem — năm bản lề dễ có bước ngoặt cấu trúc về công việc, cơ ngơi, nơi ở hoặc gia đạo (mức độ cát/hung nhân đôi).`
      );
    }
    if (tvIdx !== undefined && lttIdx !== undefined && tvIdx === lttIdx) {
      triggers.push(
        `TUẾ HẠN TRÙNG PHÙNG (Tiểu Hạn trùng Lưu Thái Tuế) tại ${luuThaiTueCoordLabel}: Tâm niệm chủ quan và biến chuyển ngoại cảnh chập làm một — quyết định đưa ra sẽ ứng nghiệm thành kết quả hoặc hệ quả thực tế rất nhanh, hầu như không có độ trễ.`
      );
    }
    if (lndhIdx !== undefined && tvIdx !== undefined && lndhIdx === tvIdx) {
      triggers.push(
        `LN. ĐẠI HẠN TRÙNG TIỂU HẠN tại ${lndhCoordLabel}: Mong cầu nội tâm của đương số năm nay hướng đúng vào lĩnh vực trọng tâm mà Đại vận 10 năm đang kích hoạt.`
      );
    }
  }

  if (lndhIdx !== undefined && dvIdx !== undefined) {
    if (lndhIdx === dvIdx) {
      triggers.push(
        `NĂM ĐẦU/CUỐI CHU KỲ ĐẠI VẬN (Năm thứ ${namThuTrongDaiVan}/10): LN. Đại hạn trùng ngay gốc Đại vận 10 năm (${daiVanCoordLabel}), đánh dấu cột mốc định hình hoặc chuyển giao vận trình thập kỷ.`
      );
    } else if (lndhIdx === (dvIdx + 6) % 12) {
      triggers.push(
        `LN. ĐẠI HẠN XUNG CHIẾU GỐC ĐẠI VẬN (Năm thứ ${namThuTrongDaiVan}/10): LN. Đại hạn tại ${lndhCoordLabel} chiếu thẳng về gốc Đại vận (${daiVanCoordLabel}), dễ tạo lực thúc đẩy dịch chuyển hoặc cọ xát với nền tảng hiện hữu.`
      );
    }
  }

  const luuCatTaiLndh: string[] = [];
  const luuCatChieuLndh: string[] = [];
  const luuHungTaiLndh: string[] = [];
  const luuHungChieuLndh: string[] = [];

  if (cungLuuNienDaiHan && lndhIdx !== undefined && cungs.length === 12) {
    (cungLuuNienDaiHan.saoLuu || []).forEach((sl) => {
      if (CAT_LUU_TRONG_DIEM.has(sl.ten)) luuCatTaiLndh.push(sl.ten);
      if (HUNG_LUU_TRONG_DIEM.has(sl.ten)) luuHungTaiLndh.push(sl.ten);
    });

    const relatedIndices = [(lndhIdx + 6) % 12, (lndhIdx + 4) % 12, (lndhIdx + 8) % 12];
    relatedIndices.forEach((rIdx) => {
      const rCung = cungs[rIdx];
      if (!rCung) return;
      (rCung.saoLuu || []).forEach((sl) => {
        if (CAT_LUU_TRONG_DIEM.has(sl.ten)) {
          luuCatChieuLndh.push(`${sl.ten} (hội chiếu từ ${rCung.chi})`);
        }
        if (HUNG_LUU_TRONG_DIEM.has(sl.ten)) {
          luuHungChieuLndh.push(`${sl.ten} (hội chiếu từ ${rCung.chi})`);
        }
      });
    });

    if (luuHungTaiLndh.length > 0 || luuHungChieuLndh.length > 0) {
      const hungList = [
        ...luuHungTaiLndh.map((s) => `${s} [tọa thủ bản cung]`),
        ...luuHungChieuLndh,
      ].join(', ');
      triggers.push(
        `SAO LƯU HUNG SÁT KÍCH NỔ VÀO LN. ĐẠI HẠN (${lndhCoordLabel}): Xuất hiện ${hungList} bắn vào mắt xích LN. Đại hạn -> Cần quản trị rủi ro chặt chẽ tại phương diện ${cungLuuNienDaiHan.cungName} để tránh làm tổn hao nền tảng của Đại vận 10 năm.`
      );
    }

    if (luuCatTaiLndh.length > 0 || luuCatChieuLndh.length > 0) {
      const catList = [
        ...luuCatTaiLndh.map((s) => `${s} [tọa thủ bản cung]`),
        ...luuCatChieuLndh,
      ].join(', ');
      triggers.push(
        `SAO LƯU CÁT LỘC HỘI TỤ TẠI LN. ĐẠI HẠN (${lndhCoordLabel}): Đón ${catList} chiếu/thủ vào mắt xích LN. Đại hạn -> Điểm sáng trợ lực mạnh mẽ để gặt hái thành quả thực tế tại phương diện ${cungLuuNienDaiHan.cungName}.`
      );
    }
  }

  return {
    thuanNghich,
    cungDaiVan,
    startAge,
    endAge,
    namThuTrongDaiVan,
    buocNhayMoTa,
    cungLuuNienDaiHan,
    cungTieuVan,
    cungLuuThaiTue,
    daiVanCoordLabel,
    lndhCoordLabel,
    tieuVanCoordLabel,
    luuThaiTueCoordLabel,
    triggers,
    luuCatTaiLndh,
    luuCatChieuLndh,
    luuHungTaiLndh,
    luuHungChieuLndh,
  };
}

/**
 * Lấy thông tin thời gian thực tế hiện tại theo múi giờ Việt Nam (UTC+7)
 * Gồm cả Dương lịch và Âm lịch chuẩn xác 100%
 */
export function getCurrentVietnamTimeInfo() {
  const vnDate = new Date(Date.now() + 7 * 3600000);
  const ngayDuong = vnDate.getUTCDate();
  const thangDuong = vnDate.getUTCMonth() + 1;
  const namDuong = vnDate.getUTCFullYear();
  const gioDuong = vnDate.getUTCHours();
  const [ngayAm, thangAm, namAm, isLeap] = solar2Lunar(ngayDuong, thangDuong, namDuong, 7.0);
  const canNamIdx = (namAm + 6) % 10;
  const chiNamIdx = (namAm + 8) % 12;
  const namAmCanChi = `${CAN_ARR[canNamIdx]} ${CHI_ARR[chiNamIdx]}`;
  return {
    ngayDuong,
    thangDuong,
    namDuong,
    gioDuong,
    ngayAm,
    thangAm,
    namAm,
    isLeap,
    namAmCanChi,
  };
}

export interface BuildCungPromptOptions {
  /** Có đính kèm Bảng tra cứu Nguyệt Vận 12 tháng Âm lịch năm xem hay không (mặc định: true) */
  includeNguyetVan?: boolean;
  /** Có đính kèm dữ liệu 6 tháng đầu năm kế tiếp hay không (mặc định: true) */
  includeNextYear?: boolean;
}

/**
 * Tạo chuỗi nhắc nhở thời gian thực tế hiện tại cho AI Prompt (cô đọng, giữ nguyên 100% ràng buộc)
 */
export function buildCurrentTimePrompt(laSo: LaSoData): string {
  const { ngayDuong, thangDuong, namDuong, ngayAm, thangAm, namAm, isLeap, namAmCanChi } =
    getCurrentVietnamTimeInfo();
  const { cungs, namXem, namXemCanChi } = laSo;
  const leapTxt = isLeap ? '(Nhuận)' : '';

  const cungThangHienTai = cungs.find((c) => {
    const nv = (c.nguyetVan || '').trim().toLowerCase();
    return nv === `tháng ${thangAm}` || nv === `${thangAm}`;
  });
  const cungHienTaiStr = cungThangHienTai
    ? `${cungThangHienTai.chi}(${cungThangHienTai.cungName}${cungThangHienTai.isThan ? '-Thân' : ''})`
    : '';

  let timePrompt = `=== THỜI GIAN HIỆN TẠI (VN) ===\nHôm nay: ${ngayDuong}/${thangDuong}/${namDuong} DL = ${ngayAm}/${thangAm}${leapTxt} ÂL năm ${namAmCanChi}(${namAm})${namXem === namAm && cungHienTaiStr ? `, Nguyệt vận hiện tại: ${cungHienTaiStr}` : ''}.\n`;

  if (!namXem || namXem === namAm) {
    const pastMonths = thangAm > 1 ? `T1–T${thangAm - 1}` : 'chưa có';
    const futureMonths = thangAm < 12 ? `T${thangAm + 1}–T12` : 'đã cuối năm';
    timePrompt += `Phân định năm ${namXemCanChi}(${namXem || namAm}): Đã qua=[${pastMonths} ÂL — CẤM đưa vào kế hoạch tương lai]; Đang sống=[★T${thangAm}${leapTxt} ÂL]; Sắp tới=[${futureMonths} ÂL & đầu năm ${(namXem || namAm) + 1}]. Cấm phỏng đoán sai tháng hiện tại.\n`;
  } else {
    timePrompt += `Đang xem riêng năm ${namXem}(${namXemCanChi}) (khác năm hiện tại ${namAm}).\n`;
  }

  return timePrompt;
}

/**
 * Hàm xuất dữ liệu text 12 cung cô đọng chuẩn xác (100% tinh đẩu, Đắc/Hãm, Tứ Hóa, Tam Hạn, Sao Lưu, Nguyệt Vận)
 */
export function buildCungDataPrompt(
  laSo: LaSoData,
  options: BuildCungPromptOptions = {}
): string {
  const { includeNguyetVan = true, includeNextYear = true } = options;
  const { ngayAm, thangAm, namAm } = getCurrentVietnamTimeInfo();
  let res = buildCurrentTimePrompt(laSo);
  const { cungs, tuanGoc, trietGoc, namXemCanChi, namXem } = laSo;

  const tamHan = computeTamHanAnalysis(laSo);
  const {
    cungDaiVan,
    startAge,
    endAge,
    buocNhayMoTa,
    cungLuuNienDaiHan,
    cungTieuVan,
    cungLuuThaiTue,
    daiVanCoordLabel,
    lndhCoordLabel,
    tieuVanCoordLabel,
    luuThaiTueCoordLabel,
    triggers,
  } = tamHan;

  if (cungLuuThaiTue || cungLuuNienDaiHan || cungTieuVan) {
    res += `\n=== ĐẠI VẬN & 3 CUNG HẠN NĂM ${namXem}(${namXemCanChi}) [CẤM NHẦM TỌA ĐỘ] ===\n`;
    if (cungDaiVan && startAge !== undefined && endAge !== undefined) {
      res += `- Đại Vận (${startAge}-${endAge}t): ${daiVanCoordLabel}\n`;
    } else if (typeof laSo.tuoiAmXem === 'number' && laSo.tuoiAmXem <= 0) {
      res += `- Đại Vận: Chưa khởi (năm xem trước năm sinh)\n`;
    } else if (
      cungs.length === 12 &&
      typeof laSo.tuoiAmXem === 'number' &&
      laSo.tuoiAmXem >= Math.max(...cungs.map((c) => c.daiVan)) + 10
    ) {
      res += `- Đại Vận: Quá vòng 120 năm\n`;
    } else {
      res += `- Đại Vận: Đồng Hạn\n`;
    }
    if (cungTieuVan) res += `- Tiểu Hạn (nội tâm): ${tieuVanCoordLabel}\n`;
    if (cungLuuNienDaiHan) {
      res += `- LN.Đại Hạn (điểm rơi ĐV): ${lndhCoordLabel}${buocNhayMoTa ? ` (${buocNhayMoTa})` : ''}\n`;
    }
    if (cungLuuThaiTue) res += `- Lưu Thái Tuế (ngoại cảnh): ${luuThaiTueCoordLabel}\n`;
    if (triggers.length > 0) {
      res += `* Điểm kích hoạt Tam Hạn: ${triggers.join(' | ')}\n`;
    }
  }

  const fmtStar = (s: { ten: string; dacHam?: string }) => (s.dacHam ? `${s.ten}(${s.dacHam})` : s.ten);

  res += `\n--- 12 CUNG BÀN CỜ (Cung VCD bắt buộc mượn Chính tinh Xung Chiếu + xét Tam Hợp & Tuần/Triệt) ---\n`;

  for (let i = 0; i < 12; i++) {
    const cung = cungs[i];
    const chinhStars = cung.chinhTinh.map(fmtStar);
    const phuTot = cung.phuTinhTot.filter((s) => !s.isLuu).map(fmtStar);
    const phuXau = cung.phuTinhXau.filter((s) => !s.isLuu).map(fmtStar);
    const saoLuuList = (cung.saoLuu || []).map((s) => s.ten);

    if (i === tuanGoc || i === (tuanGoc + 1) % 12) phuXau.push('Tuần Không');
    if (i === trietGoc || i === (trietGoc + 1) % 12) phuXau.push('Triệt Không');

    const isVoChinhDieu = chinhStars.length === 0;
    let chinhStr: string;
    if (!isVoChinhDieu) {
      chinhStr = chinhStars.join(', ');
    } else {
      const doiCung = cungs[(i + 6) % 12];
      const th1 = cungs[(i + 4) % 12];
      const th2 = cungs[(i + 8) % 12];
      const doiCt = doiCung.chinhTinh.map(fmtStar).join(', ') || 'VCD';
      chinhStr = `Vô Chính Diệu [Mượn Xung Chiếu ${doiCung.chi}(${doiCung.cungName}): ${doiCt} | Tam Hợp: ${th1.chi}(${th1.cungName}), ${th2.chi}(${th2.cungName})]`;
    }

    const cName = cung.cungName + (cung.isThan ? ' - THÂN' : '');
    const tvShort = (cung.tieuVan || '').replace(/^năm\s+/i, '').trim();
    const nvShort = (cung.nguyetVan || '').replace(/^tháng\s+/i, 'T').trim();
    const lndhTag = cungLuuNienDaiHan?.cungId === i ? `|★LN.ĐH` : '';

    res += `• ${cung.chi}(${cName}) [ĐV:${cung.daiVan}|TV:${tvShort}|NH:${nvShort}${lndhTag}]: Chính:[${chinhStr}]`;
    if (phuTot.length > 0) res += ` | Cát:[${phuTot.join(', ')}]`;
    if (phuXau.length > 0) res += ` | Hung:[${phuXau.join(', ')}]`;
    if (saoLuuList.length > 0) res += ` | Lưu ${namXem}:[${saoLuuList.join(', ')}]`;
    res += '\n';
  }

  // Tóm tắt 1 dòng Sao Lưu năm xem để AI đối chiếu nhanh
  const allLuuStarsList: string[] = [];
  cungs.forEach((c) => {
    if (c.saoLuu && c.saoLuu.length > 0) {
      allLuuStarsList.push(`${c.chi}(${c.cungName}): ${c.saoLuu.map((s) => s.ten).join(', ')}`);
    }
  });
  if (allLuuStarsList.length > 0) {
    res += `Tổng hợp Sao Lưu ${namXemCanChi}(${namXem}): ${allLuuStarsList.join(' ; ')}.\n`;
  }

  // Bảng tra cứu Nguyệt Vận (Lưu nguyệt) 12 tháng Âm lịch trong năm xem (1 dòng gọn/tháng)
  if (includeNguyetVan) {
    const namStr = namXemCanChi || (namXem ? `năm ${namXem}` : '');
    const isCurrentYear = !namXem || namXem === namAm;
    res += `\n--- BẢNG TRA CỨU NGUYỆT VẬN (LƯU NGUYỆT 12 THÁNG ÂM LỊCH ${namStr}) ---\n`;

    for (let m = 1; m <= 12; m++) {
      const mStr = `tháng ${m}`;
      const cungThang = cungs.find((c) => {
        const nv = (c.nguyetVan || '').trim().toLowerCase();
        return nv === mStr || nv === `${m}`;
      });

      if (cungThang) {
        const cName = cungThang.cungName + (cungThang.isThan ? '-Thân' : '');
        const doiCung = cungs[(cungThang.cungId + 6) % 12];
        const tamHop1 = cungs[(cungThang.cungId + 4) % 12];
        const tamHop2 = cungs[(cungThang.cungId + 8) % 12];

        const ctStr =
          cungThang.chinhTinh.length > 0
            ? cungThang.chinhTinh.map(fmtStar).join(', ')
            : `VCD(mượn ${doiCung.chi}:${doiCung.chinhTinh.map(fmtStar).join(', ') || 'VCD'})`;
        const saoLuuTaiCung = (cungThang.saoLuu || []).map((s) => s.ten).join(', ') || '—';

        const saoLuuChieu: string[] = [];
        [doiCung, tamHop1, tamHop2].forEach((related) => {
          (related.saoLuu || []).forEach((sl) => {
            saoLuuChieu.push(`${sl.ten}(${related.chi})`);
          });
        });
        const saoLuuChieuStr = saoLuuChieu.length > 0 ? saoLuuChieu.join(', ') : '—';

        const statusTag = isCurrentYear
          ? m < thangAm
            ? '[đã qua]'
            : m === thangAm
            ? `[★HIỆN TẠI ${ngayAm}/${thangAm}ÂL]`
            : '[sắp tới]'
          : '';

        res += `T${m}${statusTag}: ${cungThang.chi}(${cName}) | Chính:${ctStr} | Lưu thủ:${saoLuuTaiCung} | Lưu chiếu:${saoLuuChieuStr}\n`;
      }
    }
  }

  // Bổ sung Bảng tra cứu 6 tháng đầu năm kế tiếp (1 dòng gọn/tháng)
  if (includeNextYear && laSo.duongSo) {
    try {
      const nextYear = (namXem || namAm) + 1;
      const nextLaSo = lapLaSoTuVi({ ...laSo.duongSo }, nextYear);
      const nextTamHan = computeTamHanAnalysis(nextLaSo);
      res += `\n--- NỐI TIẾP 6 THÁNG ĐẦU NĂM ${nextYear}(${nextLaSo.namXemCanChi}, ${nextLaSo.tuoiAmXem}t) ---\n`;
      res += `Tam Hạn ${nextYear}: L.Thái Tuế=${nextTamHan.luuThaiTueCoordLabel || '—'} | LN.ĐH=${nextTamHan.lndhCoordLabel || '—'} | Tiểu Hạn=${nextTamHan.tieuVanCoordLabel || '—'}\n`;
      for (let m = 1; m <= 6; m++) {
        const mStr = `tháng ${m}`;
        const cungNext = nextLaSo.cungs.find((c) => {
          const nv = (c.nguyetVan || '').trim().toLowerCase();
          return nv === mStr || nv === `${m}`;
        });
        if (cungNext) {
          const cName = cungNext.cungName + (cungNext.isThan ? '-Thân' : '');
          const doiCung = nextLaSo.cungs[(cungNext.cungId + 6) % 12];
          const ctStr =
            cungNext.chinhTinh.length > 0
              ? cungNext.chinhTinh.map(fmtStar).join(', ')
              : `VCD(mượn ${doiCung.chi}:${doiCung.chinhTinh.map(fmtStar).join(', ') || 'VCD'})`;
          const saoLuuTaiCung = (cungNext.saoLuu || []).map((s) => s.ten).join(', ') || '—';
          res += `T${m}/${nextYear}: ${cungNext.chi}(${cName}) | Chính:${ctStr} | Lưu:${saoLuuTaiCung}\n`;
        }
      }
    } catch {
      // Bỏ qua nếu không tính được năm kế tiếp
    }
  }

  return res;
}

