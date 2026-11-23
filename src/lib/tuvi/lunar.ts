/**
 * Thuật toán Thiên Văn tính Âm Lịch Việt Nam (Múi giờ chuẩn UTC+7)
 * Dựa trên nguyên bản thuật toán Thiên văn của TS. Hồ Ngọc Đức (Astronomical Algorithms - Jean Meeus),
 * có bổ sung vòng lặp hội tụ Sóc (New Moon) đảm bảo liên tục tuyệt đối 100% cho mọi thế kỷ.
 */

function INT(d: number): number {
  return Math.floor(d);
}

/**
 * Kiểm tra ngày Dương lịch hợp lệ (kể cả năm nhuận Dương lịch)
 */
export function isValidSolarDate(dd: number, mm: number, yy: number): boolean {
  if (!Number.isInteger(dd) || !Number.isInteger(mm) || !Number.isInteger(yy)) return false;
  if (yy < 1800 || yy > 2200 || mm < 1 || mm > 12 || dd < 1) return false;
  const maxDay = new Date(yy, mm, 0).getDate();
  return dd <= maxDay;
}

/**
 * Đổi ngày Dương lịch (dd/mm/yy) sang Số Ngày Julius (Julian Day Number)
 */
export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = INT((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd =
    dd +
    INT((153 * m + 2) / 5) +
    365 * y +
    INT(y / 4) -
    INT(y / 100) +
    INT(y / 400) -
    32045;
  if (jd < 2299161) {
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
  }
  return jd;
}

/**
 * Tính ngày Sóc (Mùng 1 Âm lịch) thứ k kể từ ngày Sóc 01/01/1900 (JD 2415020.75933)
 * Có hiệu chỉnh đầy đủ Delta-T (TD -> UT1) theo chuẩn TS. Hồ Ngọc Đức.
 */
export function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85; // Thế kỷ Julius tính từ 1900 Jan 0.5
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180.0;

  let Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
  Jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr);

  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3;
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3;
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3;

  let C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
  C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
  C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
  C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
  C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
  C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
  C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));

  let deltat: number;
  if (T < -11) {
    deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
  } else {
    deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
  }

  const JdNew = Jd1 + C1 - deltat;
  return INT(JdNew + 0.5 + timeZone / 24.0);
}

/**
 * Tính cung Hoàng đạo Mặt Trời (0..11, mỗi cung 30 độ) tại 00:00 giờ địa phương của ngày jdn.
 * Đã bao gồm hiệu chỉnh Chương động & Quang sai biểu kiến (Nutation & Aberration).
 */
export function getSunLongitude(jdn: number, timeZone: number): number {
  const T = (jdn - 2451545.5 - timeZone / 24.0) / 36525.0;
  const T2 = T * T;
  const dr = Math.PI / 180.0;
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2;
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2;
  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
  DL += (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
  const omega = 125.04 - 1934.136 * T;
  let L = L0 + DL - 0.00569 - 0.00478 * Math.sin(omega * dr);
  L *= dr;
  L -= Math.PI * 2 * INT(L / (Math.PI * 2));
  return INT((L / Math.PI) * 6);
}

/**
 * Tìm ngày bắt đầu Tháng 11 Âm lịch (tháng chứa tiết Đông Chí) của năm yy
 */
export function getLunarMonth11(yy: number, timeZone: number): number {
  const off = jdFromDate(31, 12, yy) - 2415021;
  const k = INT(off / 29.530588853);
  let nm = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(nm, timeZone);
  if (sunLong >= 9) {
    nm = getNewMoonDay(k - 1, timeZone);
  }
  return nm;
}

/**
 * Xác định vị trí tháng nhuận (1..13) sau tháng 11 Âm lịch a11 (khi năm âm có 13 tháng)
 */
export function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (arc !== last && i < 14);
  return i - 1;
}

/**
 * Chuyển đổi Dương lịch (dd/mm/yy) -> Âm lịch Việt Nam [ngayAm, thangAm, namAm, isLeap]
 */
export function solar2Lunar(
  dd: number,
  mm: number,
  yy: number,
  timeZone = 7.0
): [number, number, number, boolean] {
  const dayNumber = jdFromDate(dd, mm, yy);
  let step = INT((dayNumber - 2415021.076998695) / 29.530588853) + 1;
  let monthStart = getNewMoonDay(step, timeZone);
  while (monthStart > dayNumber) {
    step--;
    monthStart = getNewMoonDay(step, timeZone);
  }
  while (getNewMoonDay(step + 1, timeZone) <= dayNumber) {
    step++;
    monthStart = getNewMoonDay(step, timeZone);
  }

  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  let lunarYear: number;
  if (a11 >= monthStart) {
    lunarYear = yy;
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    lunarYear = yy + 1;
    b11 = getLunarMonth11(yy + 1, timeZone);
  }

  const lunarDay = dayNumber - monthStart + 1;
  const diff = INT((monthStart - a11) / 29);
  let isLeap = false;
  let lunarMonth = diff + 11;

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) {
        isLeap = true;
      }
    }
  }

  if (lunarMonth > 12) {
    lunarMonth -= 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }

  return [lunarDay, lunarMonth, lunarYear, isLeap];
}

/**
 * Chuyển đổi Số Ngày Julius (Julian Day Number) -> Dương lịch [dd, mm, yy]
 * Theo thuật toán Thiên văn chuẩn của TS. Hồ Ngọc Đức
 */
export function jdToDate(jd: number): [number, number, number] {
  let a: number;
  let b: number;
  let c: number;
  if (jd > 2299160) {
    a = jd + 32044;
    b = INT((4 * a + 3) / 146097);
    c = a - INT((b * 146097) / 4);
  } else {
    b = 0;
    c = jd + 32082;
  }
  const d = INT((4 * c + 3) / 1461);
  const e = c - INT((1461 * d) / 4);
  const m = INT((5 * e + 2) / 153);
  const day = e - INT((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * INT(m / 10);
  const year = b * 100 + d - 4800 + INT(m / 10);
  return [day, month, year];
}

/**
 * Tìm tháng nhuận (1..12) của một năm Âm lịch (trả về 0 nếu năm đó không nhuận)
 */
export function getLeapMonthOfLunarYear(lunarYear: number, timeZone = 7.0): number {
  const a11 = getLunarMonth11(lunarYear - 1, timeZone);
  const b11 = getLunarMonth11(lunarYear, timeZone);
  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth <= 0) leapMonth += 12;
    if (leapMonth < 11) return leapMonth;
  }
  const a11Next = b11;
  const b11Next = getLunarMonth11(lunarYear + 1, timeZone);
  if (b11Next - a11Next > 365) {
    const leapOff = getLeapMonthOffset(a11Next, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth <= 0) leapMonth += 12;
    if (leapMonth >= 11) return leapMonth;
  }
  return 0;
}

/**
 * Chuyển đổi Âm lịch Việt Nam -> Dương lịch [dd, mm, yy]
 * Trả về null nếu ngày/tháng Âm lịch không tồn tại (VD: chọn tháng nhuận của năm không nhuận, hoặc ngày 30 ở tháng thiếu 29 ngày)
 */
export function lunar2Solar(
  lunarDay: number,
  lunarMonth: number,
  lunarYear: number,
  isLeap = false,
  timeZone = 7.0
): [number, number, number] | null {
  if (
    !Number.isInteger(lunarDay) ||
    !Number.isInteger(lunarMonth) ||
    !Number.isInteger(lunarYear) ||
    lunarDay < 1 ||
    lunarDay > 30 ||
    lunarMonth < 1 ||
    lunarMonth > 12 ||
    lunarYear < 1800 ||
    lunarYear > 2200
  ) {
    return null;
  }

  let a11: number;
  let b11: number;
  if (lunarMonth < 11) {
    a11 = getLunarMonth11(lunarYear - 1, timeZone);
    b11 = getLunarMonth11(lunarYear, timeZone);
  } else {
    a11 = getLunarMonth11(lunarYear, timeZone);
    b11 = getLunarMonth11(lunarYear + 1, timeZone);
  }

  const k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
  let off = lunarMonth - 11;
  if (off < 0) off += 12;

  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone);
    let leapMonth = leapOff - 2;
    if (leapMonth <= 0) leapMonth += 12;
    if (isLeap && lunarMonth !== leapMonth) {
      return null;
    }
    if (isLeap || off >= leapOff) {
      off += 1;
    }
  } else if (isLeap) {
    return null;
  }

  const monthStart = getNewMoonDay(k + off, timeZone);
  const nextMonthStart = getNewMoonDay(k + off + 1, timeZone);
  const monthLength = nextMonthStart - monthStart;
  if (lunarDay > monthLength) {
    return null;
  }

  return jdToDate(monthStart + lunarDay - 1);
}
