/**
 * Thuật toán Thiên Văn J2000 tính Âm Lịch Việt Nam
 * Nguyên bản thuật toán của TS. Hồ Ngọc Đức
 */

export function jdFromDate(dd: number, mm: number, yy: number): number {
  const a = Math.floor((14 - mm) / 12);
  const y = yy + 4800 - a;
  const m = mm + 12 * a - 3;
  let jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
  if (jd < 2299161) {
    jd = dd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083;
  }
  return Math.floor(jd);
}

export function getSunLongitude(dayNumber: number, timeZone: number): number {
  const T = (dayNumber - 0.5 - timeZone / 24.0 - 2451545.0) / 36525.0;
  const T2 = T * T;
  const dr = Math.PI / 180.0;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T2;
  const L = 280.46646 + 36000.76983 * T + 0.0003032 * T2;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * dr) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * dr) +
    0.000289 * Math.sin(3 * M * dr);
  const sunLong = L + C;
  return sunLong - 360.0 * Math.floor(sunLong / 360.0);
}

export function getNewMoonDay(k: number, timeZone: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const dr = Math.PI / 180.0;
  const Jd1 =
    2451550.09766 +
    29.5305888531 * k +
    0.0001337 * T2 -
    0.00000015 * T3 +
    0.00000000073 * T2 * T;
  const M = 2.5534 + 29.10535669 * k - 0.0000218 * T2 - 0.00000011 * T3;
  const Mprime = 201.5643 + 385.81693528 * k + 0.0107438 * T2 + 0.000001239 * T3;
  const F = 160.7108 + 390.67050274 * k - 0.0016341 * T2 - 0.00000227 * T3;
  const Omega = 124.7746 - 1.5637558 * k + 0.0020691 * T2 + 0.00000215 * T3;
  const A1 = 299.77 + 0.107408 * k - 0.009173 * T2;
  const A2 = 251.88 + 0.016321 * k;
  const A3 = 251.83 + 26.651886 * k;
  const A4 = 349.42 + 36.412478 * k;
  const A5 = 84.66 + 18.206239 * k;
  const A6 = 141.74 + 53.303771 * k;
  const A7 = 207.14 + 2.453732 * k;
  const A8 = 154.84 + 73.064966 * k;
  const A9 = 34.52 + 27.261239 * k;
  const A10 = 207.19 + 0.121824 * k;
  const A11 = 291.34 + 1.844379 * k;
  const A12 = 161.72 + 24.198154 * k;
  const A13 = 239.56 + 25.513099 * k;
  const A14 = 331.55 + 3.592518 * k;
  const dJ =
    0.000325 * Math.sin(A1 * dr) +
    0.000165 * Math.sin(A2 * dr) +
    0.000164 * Math.sin(A3 * dr) +
    0.000126 * Math.sin(A4 * dr) +
    0.00011 * Math.sin(A5 * dr) +
    0.000062 * Math.sin(A6 * dr) +
    0.00006 * Math.sin(A7 * dr) +
    0.000056 * Math.sin(A8 * dr) +
    0.000047 * Math.sin(A9 * dr) +
    0.000042 * Math.sin(A10 * dr) +
    0.00004 * Math.sin(A11 * dr) +
    0.000037 * Math.sin(A12 * dr) +
    0.000035 * Math.sin(A13 * dr) +
    0.000023 * Math.sin(A14 * dr);
  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const dJd =
    -0.4072 * Math.sin(Mprime * dr) +
    0.17241 * E * Math.sin(M * dr) +
    0.01608 * Math.sin(2 * Mprime * dr) +
    0.01039 * Math.sin(2 * F * dr) +
    0.00739 * E * Math.sin((Mprime - M) * dr) -
    0.00514 * E * Math.sin((Mprime + M) * dr) +
    0.00208 * E * E * Math.sin(2 * M * dr) -
    0.00111 * Math.sin((Mprime - 2 * F) * dr) -
    0.00057 * Math.sin((Mprime + 2 * F) * dr) +
    0.00056 * E * Math.sin((2 * Mprime + M) * dr) -
    0.00042 * Math.sin(3 * Mprime * dr) +
    0.00042 * E * Math.sin((M + 2 * F) * dr) +
    0.00038 * E * Math.sin((M - 2 * F) * dr) -
    0.00024 * E * Math.sin((2 * Mprime - M) * dr) -
    0.00022 * Math.sin(Omega * dr) +
    0.00017 * Math.sin(2 * Mprime * dr) +
    0.00017 * E * Math.sin((2 * M - Mprime) * dr);
  return Math.floor(Jd1 + dJ + dJd + 0.5 + timeZone / 24.0);
}

export function getLunarMonth11(yy: number, timeZone: number): number {
  const off = yy - 2000;
  const k = Math.floor(off * 12.3685);
  let m = getNewMoonDay(k, timeZone);
  const sunLong = getSunLongitude(m, timeZone);
  if (sunLong >= 270) {
    m = getNewMoonDay(k - 1, timeZone);
  } else {
    const sunLongNext = getSunLongitude(getNewMoonDay(k + 1, timeZone), timeZone);
    if (sunLongNext < 270) {
      m = getNewMoonDay(k + 1, timeZone);
    }
  }
  return m;
}

export function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor((a11 - 2451550.09766) / 29.5305888531 + 0.5);
  let last = 0;
  let i = 1;
  let arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  do {
    last = arc;
    i++;
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
  } while (i < 14 && Math.floor(arc / 30.0) !== Math.floor(last / 30.0));
  return i - 1;
}

export function solar2Lunar(
  dd: number,
  mm: number,
  yy: number,
  timeZone = 7.0
): [number, number, number, boolean] {
  const dayNumber = jdFromDate(dd, mm, yy);
  const k = Math.floor((dayNumber - 2451550.09766) / 29.5305888531);
  let monthStart = getNewMoonDay(k + 1, timeZone);
  if (monthStart > dayNumber) {
    monthStart = getNewMoonDay(k, timeZone);
  }
  let a11 = getLunarMonth11(yy, timeZone);
  let b11 = a11;
  if (a11 > monthStart) {
    a11 = getLunarMonth11(yy - 1, timeZone);
  } else {
    b11 = getLunarMonth11(yy + 1, timeZone);
  }
  const day = dayNumber - monthStart + 1;
  const diff = Math.floor((monthStart - a11) / 29);
  let lunarYear = yy;
  let lunarMonth = diff + 11;
  let isLeap = false;
  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone);
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10;
      if (diff === leapMonthDiff) isLeap = true;
    }
  }
  if (lunarMonth > 12) {
    lunarMonth = lunarMonth - 12;
  }
  if (lunarMonth >= 11 && diff < 4) {
    lunarYear -= 1;
  }
  return [Math.floor(day), Math.floor(lunarMonth), Math.floor(lunarYear), isLeap];
}
