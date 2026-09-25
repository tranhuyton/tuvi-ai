export const CAN_ARR = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];

export const CAN_ABBR: Record<string, string> = {
  'Giáp': 'G.',
  'Ất': 'Ấ.',
  'Bính': 'B.',
  'Đinh': 'Đ.',
  'Mậu': 'M.',
  'Kỷ': 'K.',
  'Canh': 'C.',
  'Tân': 'T.',
  'Nhâm': 'N.',
  'Quý': 'Q.',
};

export const CHI_ARR = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export const HANH_ARR: Record<number, string> = {
  1: 'Kim',
  2: 'Thủy',
  3: 'Hỏa',
  4: 'Thổ',
  5: 'Mộc',
};

export const GIO_ARR: Record<string, { label: string; hourIndex: number; isLateTy?: boolean }> = {
  '0_0': { label: 'Tý (00h-01h)', hourIndex: 0 },
  '1': { label: 'Sửu (01h-03h)', hourIndex: 1 },
  '2': { label: 'Dần (03h-05h)', hourIndex: 2 },
  '3': { label: 'Mão (05h-07h)', hourIndex: 3 },
  '4': { label: 'Thìn (07h-09h)', hourIndex: 4 },
  '5': { label: 'Tỵ (09h-11h)', hourIndex: 5 },
  '6': { label: 'Ngọ (11h-13h)', hourIndex: 6 },
  '7': { label: 'Mùi (13h-15h)', hourIndex: 7 },
  '8': { label: 'Thân (15h-17h)', hourIndex: 8 },
  '9': { label: 'Dậu (17h-19h)', hourIndex: 9 },
  '10': { label: 'Tuất (19h-21h)', hourIndex: 10 },
  '11': { label: 'Hợi (21h-23h)', hourIndex: 11 },
  '0_23': { label: 'Tý Dạ (23h-24h)', hourIndex: 0, isLateTy: true },
};

export const CUNG_NAMES = [
  'Mệnh',
  'Huynh Đệ',
  'Phu Thê',
  'Tử Tức',
  'Tài Bạch',
  'Tật Ách',
  'Thiên Di',
  'Nô Bộc',
  'Quan Lộc',
  'Điền Trạch',
  'Phúc Đức',
  'Phụ Mẫu',
];

export const MENH_CHU: Record<number, string> = {
  0: 'Tham Lang',
  1: 'Cự Môn',
  2: 'Lộc Tồn',
  3: 'Văn Khúc',
  4: 'Liêm Trinh',
  5: 'Vũ Khúc',
  6: 'Phá Quân',
  7: 'Vũ Khúc',
  8: 'Liêm Trinh',
  9: 'Văn Khúc',
  10: 'Lộc Tồn',
  11: 'Cự Môn',
};

export const THAN_CHU: Record<number, string> = {
  0: 'Linh Tinh',
  1: 'Thiên Tướng',
  2: 'Thiên Lương',
  3: 'Thiên Đồng',
  4: 'Văn Xương',
  5: 'Thiên Cơ',
  6: 'Hỏa Tinh',
  7: 'Thiên Tướng',
  8: 'Thiên Lương',
  9: 'Thiên Đồng',
  10: 'Văn Xương',
  11: 'Thiên Cơ',
};

export const DAC_HAM: Record<string, string[]> = {
  'TỬ VI': ['B', 'Đ', 'M', 'B', 'V', 'M', 'M', 'Đ', 'V', 'B', 'V', 'B'],
  'THIÊN CƠ': ['Đ', 'Đ', 'V', 'M', 'M', 'B', 'Đ', 'Đ', 'B', 'M', 'M', 'B'],
  'THÁI DƯƠNG': ['H', 'Đ', 'V', 'V', 'V', 'M', 'M', 'Đ', 'H', 'H', 'H', 'H'],
  'VŨ KHÚC': ['V', 'M', 'V', 'B', 'M', 'H', 'V', 'M', 'V', 'B', 'M', 'H'],
  'THIÊN ĐỒNG': ['V', 'H', 'B', 'Đ', 'H', 'Đ', 'H', 'H', 'M', 'H', 'H', 'Đ'],
  'LIÊM TRINH': ['B', 'Đ', 'V', 'H', 'M', 'H', 'B', 'Đ', 'V', 'H', 'M', 'H'],
  'THIÊN PHỦ': ['M', 'M', 'V', 'B', 'M', 'V', 'M', 'M', 'V', 'B', 'M', 'V'],
  'THÁI ÂM': ['V', 'M', 'B', 'H', 'H', 'H', 'H', 'B', 'Đ', 'V', 'M', 'M'],
  'THAM LANG': ['V', 'M', 'Đ', 'H', 'V', 'H', 'V', 'M', 'Đ', 'H', 'V', 'H'],
  'CỰ MÔN': ['V', 'H', 'M', 'M', 'H', 'B', 'V', 'H', 'Đ', 'M', 'H', 'V'],
  'THIÊN TƯỚNG': ['V', 'M', 'Đ', 'H', 'V', 'B', 'V', 'M', 'Đ', 'H', 'V', 'B'],
  'THIÊN LƯƠNG': ['V', 'V', 'V', 'M', 'M', 'H', 'M', 'V', 'B', 'H', 'M', 'H'],
  'THẤT SÁT': ['M', 'Đ', 'M', 'H', 'V', 'B', 'M', 'Đ', 'M', 'H', 'V', 'V'],
  'PHÁ QUÂN': ['M', 'V', 'H', 'H', 'M', 'H', 'M', 'V', 'H', 'H', 'M', 'H'],
};

export const CHINH_TINH_COLORS: Record<string, string> = {
  'TỬ VI': '#c28b00',      // Thổ - Vàng hổ phách
  'THIÊN PHỦ': '#c28b00',  // Thổ - Vàng hổ phách
  'THIÊN LƯƠNG': '#c28b00',// Thổ - Vàng hổ phách
  'THẤT SÁT': '#555555',   // Kim - Màu xám chuẩn LySo
  'THÁI DƯƠNG': '#cc0000', // Hỏa - Đỏ tươi
  'LIÊM TRINH': '#cc0000', // Hỏa - Đỏ tươi
  'THIÊN CƠ': '#008000',   // Mộc - Xanh lục
  'THAM LANG': '#008000',  // Mộc - Xanh lục
  'VŨ KHÚC': '#555555',    // Kim - Màu xám chuẩn LySo
  'THIÊN ĐỒNG': '#000000', // Thủy - Đen tuyền
  'THÁI ÂM': '#000000',    // Thủy - Đen tuyền
  'CỰ MÔN': '#000000',     // Thủy - Đen tuyền
  'THIÊN TƯỚNG': '#000000',// Thủy - Đen tuyền
  'PHÁ QUÂN': '#000000',   // Thủy - Đen tuyền
};

export const BAD_STARS = [
  'Thái Tuế', 'Tang Môn', 'Bạch Hổ', 'Quan Phù', 'Quan Phủ', 'Tử Phù', 'Tuế Phá', 'Điếu Khách', 'Trực Phù',
  'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp', 'Thiên Không',
  'Hóa Kỵ', 'Thiên Hình', 'Thiên Diêu', 'Thiên Khốc', 'Thiên Hư', 'Kiếp Sát',
  'Cô Thần', 'Quả Tú', 'Thiên La', 'Địa Võng', 'Thiên Thương', 'Thiên Sứ',
  'Đại Hao', 'Tiểu Hao', 'Bệnh Phù', 'Phục Binh', 'Phi Liêm', 'Tướng Quân',
  'Đẩu Quân', 'Lưu Hà', 'Phá Toái',
  'L.Thái Tuế', 'L.Tang Môn', 'L.Bạch Hổ', 'L.Kình Dương', 'L.Đà La',
  'L.Thiên Khốc', 'L.Thiên Hư', 'L.Hóa Kỵ', 'L.Hóa Kị', 'L.Đẩu Quân'
];

export const VAN_TINH_MAP: Record<number, number> = {
  0: 5, // Giáp tại Tỵ
  1: 6, // Ất tại Ngọ
  2: 8, // Bính tại Thân
  3: 9, // Đinh tại Dậu
  4: 8, // Mậu tại Thân
  5: 9, // Kỷ tại Dậu
  6: 11,// Canh tại Hợi
  7: 0, // Tân tại Tý
  8: 2, // Nhâm tại Dần
  9: 3, // Quý tại Mão
};

export const HOA_LOC_MAP: Record<number, string> = {
  0: 'LIÊM TRINH', 1: 'THIÊN CƠ', 2: 'THIÊN ĐỒNG', 3: 'THÁI ÂM', 4: 'THAM LANG',
  5: 'VŨ KHÚC', 6: 'THÁI DƯƠNG', 7: 'CỰ MÔN', 8: 'THIÊN LƯƠNG', 9: 'PHÁ QUÂN'
};

export const HOA_QUYEN_MAP: Record<number, string> = {
  0: 'PHÁ QUÂN', 1: 'THIÊN LƯƠNG', 2: 'THIÊN CƠ', 3: 'THIÊN ĐỒNG', 4: 'THÁI ÂM',
  5: 'THAM LANG', 6: 'VŨ KHÚC', 7: 'THÁI DƯƠNG', 8: 'TỬ VI', 9: 'CỰ MÔN'
};

export const HOA_KHOA_MAP: Record<number, string> = {
  0: 'VŨ KHÚC', 1: 'TỬ VI', 2: 'Văn Xương', 3: 'THIÊN CƠ', 4: 'Hữu Bật',
  5: 'THIÊN LƯƠNG', 6: 'Tả Phù', 7: 'Văn Khúc', 8: 'THIÊN PHỦ', 9: 'THÁI ÂM'
};

export const HOA_KY_MAP: Record<number, string> = {
  0: 'THÁI DƯƠNG', 1: 'THÁI ÂM', 2: 'LIÊM TRINH', 3: 'CỰ MÔN', 4: 'THIÊN CƠ',
  5: 'Văn Khúc', 6: 'THIÊN ĐỒNG', 7: 'Văn Xương', 8: 'VŨ KHÚC', 9: 'THAM LANG'
};

export const NAP_AM_MAP: Record<string, string> = {
  'Giáp Tý': 'Hải Trung Kim', 'Ất Sửu': 'Hải Trung Kim',
  'Bính Dần': 'Lư Trung Hỏa', 'Đinh Mão': 'Lư Trung Hỏa',
  'Mậu Thìn': 'Đại Lâm Mộc', 'Kỷ Tỵ': 'Đại Lâm Mộc',
  'Canh Ngọ': 'Lộ Bàng Thổ', 'Tân Mùi': 'Lộ Bàng Thổ',
  'Nhâm Thân': 'Kiếm Phong Kim', 'Quý Dậu': 'Kiếm Phong Kim',
  'Giáp Tuất': 'Sơn Đầu Hỏa', 'Ất Hợi': 'Sơn Đầu Hỏa',
  'Bính Tý': 'Giản Hạ Thủy', 'Đinh Sửu': 'Giản Hạ Thủy',
  'Mậu Dần': 'Thành Đầu Thổ', 'Kỷ Mão': 'Thành Đầu Thổ',
  'Canh Thìn': 'Bạch Lạp Kim', 'Tân Tỵ': 'Bạch Lạp Kim',
  'Nhâm Ngọ': 'Dương Liễu Mộc', 'Quý Mùi': 'Dương Liễu Mộc',
  'Giáp Thân': 'Tuyền Trung Thủy', 'Ất Dậu': 'Tuyền Trung Thủy',
  'Bính Tuất': 'Ốc Thượng Thổ', 'Đinh Hợi': 'Ốc Thượng Thổ',
  'Mậu Tý': 'Tích Lịch Hỏa', 'Kỷ Sửu': 'Tích Lịch Hỏa',
  'Canh Dần': 'Tùng Bách Mộc', 'Tân Mão': 'Tùng Bách Mộc',
  'Nhâm Thìn': 'Trường Lưu Thủy', 'Quý Tỵ': 'Trường Lưu Thủy',
  'Giáp Ngọ': 'Sa Trung Kim', 'Ất Mùi': 'Sa Trung Kim',
  'Bính Thân': 'Sơn Hạ Hỏa', 'Đinh Dậu': 'Sơn Hạ Hỏa',
  'Mậu Tuất': 'Bình Địa Mộc', 'Kỷ Hợi': 'Bình Địa Mộc',
  'Canh Tý': 'Bích Thượng Thổ', 'Tân Sửu': 'Bích Thượng Thổ',
  'Nhâm Dần': 'Kim Bạch Kim', 'Quý Mão': 'Kim Bạch Kim',
  'Giáp Thìn': 'Phúc Đăng Hỏa', 'Ất Tỵ': 'Phúc Đăng Hỏa',
  'Bính Ngọ': 'Thiên Hà Thủy', 'Đinh Mùi': 'Thiên Hà Thủy',
  'Mậu Thân': 'Đại Trạch Thổ', 'Kỷ Dậu': 'Đại Trạch Thổ',
  'Canh Tuất': 'Thoa Xuyến Kim', 'Tân Hợi': 'Thoa Xuyến Kim',
  'Nhâm Tý': 'Tang Đố Mộc', 'Quý Sửu': 'Tang Đố Mộc',
  'Giáp Dần': 'Đại Khê Thủy', 'Ất Mão': 'Đại Khê Thủy',
  'Bính Thìn': 'Sa Trung Thổ', 'Đinh Tỵ': 'Sa Trung Thổ',
  'Mậu Ngọ': 'Thiên Thượng Hỏa', 'Kỷ Mùi': 'Thiên Thượng Hỏa',
  'Canh Thân': 'Thạch Lựu Mộc', 'Tân Dậu': 'Thạch Lựu Mộc',
  'Nhâm Tuất': 'Đại Hải Thủy', 'Quý Hợi': 'Đại Hải Thủy',
};

export const PHU_TINH_DAC_HAM: Record<string, Record<number, string>> = {
  'Kình Dương': { 1: 'Đ', 4: 'Đ', 7: 'Đ', 10: 'Đ', 0: 'H', 2: 'H', 3: 'H', 5: 'H', 6: 'H', 8: 'H', 9: 'H', 11: 'H' },
  'Đà La': { 1: 'Đ', 4: 'Đ', 7: 'Đ', 10: 'Đ', 0: 'H', 2: 'H', 3: 'H', 5: 'H', 6: 'H', 8: 'H', 9: 'H', 11: 'H' },
  'Hỏa Tinh': { 2: 'Đ', 3: 'Đ', 4: 'Đ', 5: 'Đ', 6: 'Đ', 0: 'H', 1: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
  'Linh Tinh': { 2: 'Đ', 3: 'Đ', 4: 'Đ', 5: 'Đ', 6: 'Đ', 0: 'H', 1: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
  'Địa Không': { 2: 'Đ', 5: 'Đ', 8: 'Đ', 11: 'Đ', 0: 'H', 1: 'H', 3: 'H', 4: 'H', 6: 'H', 7: 'H', 9: 'H', 10: 'H' },
  'Địa Kiếp': { 2: 'Đ', 5: 'Đ', 8: 'Đ', 11: 'Đ', 0: 'H', 1: 'H', 3: 'H', 4: 'H', 6: 'H', 7: 'H', 9: 'H', 10: 'H' },
  'Thiên Hình': { 2: 'Đ', 3: 'Đ', 4: 'Đ', 9: 'Đ', 0: 'H', 1: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 10: 'H', 11: 'H' },
  'Thiên Diêu': { 3: 'Đ', 9: 'Đ', 0: 'H', 1: 'H', 2: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 8: 'H', 10: 'H', 11: 'H' },
  'Tang Môn': { 2: 'Đ', 3: 'Đ', 8: 'Đ', 9: 'Đ', 0: 'H', 1: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 10: 'H', 11: 'H' },
  'Bạch Hổ': { 2: 'Đ', 3: 'Đ', 8: 'Đ', 9: 'Đ', 0: 'H', 1: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 10: 'H', 11: 'H' },
  'Thiên Khốc': { 0: 'Đ', 6: 'Đ', 3: 'Đ', 9: 'Đ', 1: 'H', 2: 'H', 4: 'H', 5: 'H', 7: 'H', 8: 'H', 10: 'H', 11: 'H' },
  'Thiên Hư': { 0: 'Đ', 6: 'Đ', 3: 'Đ', 9: 'Đ', 1: 'H', 2: 'H', 4: 'H', 5: 'H', 7: 'H', 8: 'H', 10: 'H', 11: 'H' },
  'Đại Hao': { 2: 'Đ', 3: 'Đ', 8: 'Đ', 9: 'Đ', 0: 'H', 1: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 10: 'H', 11: 'H' },
  'Tiểu Hao': { 2: 'Đ', 3: 'Đ', 8: 'Đ', 9: 'Đ', 0: 'H', 1: 'H', 4: 'H', 5: 'H', 6: 'H', 7: 'H', 10: 'H', 11: 'H' },
  'Văn Xương': { 1: 'Đ', 4: 'Đ', 7: 'Đ', 10: 'Đ', 5: 'Đ', 11: 'Đ', 9: 'M', 0: 'M', 3: 'H', 6: 'H' },
  'Văn Khúc': { 1: 'Đ', 4: 'Đ', 7: 'Đ', 10: 'Đ', 5: 'Đ', 11: 'Đ', 9: 'M', 0: 'M', 3: 'H', 6: 'H' },
  'Thiên Mã': { 5: 'Đ', 8: 'Đ', 2: 'H', 11: 'H' },
  'Lộc Tồn': { 2: 'M', 3: 'M', 5: 'M', 6: 'M', 8: 'M', 9: 'M', 11: 'M', 0: 'M', 1: 'Đ', 4: 'Đ', 7: 'Đ', 10: 'Đ' },
};

export const THIEN_TRU_MAP: Record<number, number> = {
  0: 5, // Giáp tại Tỵ
  1: 6, // Ất tại Ngọ
  2: 0, // Bính tại Tý
  3: 5, // Đinh tại Tỵ
  4: 6, // Mậu tại Ngọ
  5: 8, // Kỷ tại Thân
  6: 2, // Canh tại Dần
  7: 3, // Tân tại Mão
  8: 9, // Nhâm tại Dậu
  9: 10, // Quý tại Tuất
};

export const LUU_HA_MAP: Record<number, number> = {
  0: 9,  // Giáp tại Dậu
  1: 10, // Ất tại Tuất
  2: 7,  // Bính tại Mùi
  3: 4,  // Đinh tại Thìn
  4: 5,  // Mậu tại Tỵ
  5: 6,  // Kỷ tại Ngọ
  6: 8,  // Canh tại Thân
  7: 3,  // Tân tại Mão
  8: 11, // Nhâm tại Hợi
  9: 2,  // Quý tại Dần
};

export const PHA_TOAI_MAP: Record<number, number> = {
  0: 5, 6: 5, 3: 5, 9: 5,     // Tý Ngọ Mão Dậu tại Tỵ
  2: 9, 8: 9, 5: 9, 11: 9,    // Dần Thân Tỵ Hợi tại Dậu
  4: 1, 10: 1, 1: 1, 7: 1,    // Thìn Tuất Sửu Mùi tại Sửu
};

export const STAR_NGU_HANH_COLOR: Record<string, string> = {
  // 1. KIM - Xám (#555555) chuẩn LySo.vn
  'THẤT SÁT': '#555555',
  'VŨ KHÚC': '#555555',
  'Kình Dương': '#555555',
  'Đà La': '#555555',
  'Bạch Hổ': '#555555',
  'Văn Xương': '#555555',
  'Đường Phù': '#555555',
  'Thai Phụ': '#555555',
  'Thiên La': '#555555',
  'Địa Võng': '#555555',
  'Hoa Cái': '#555555',
  'Tấu Thư': '#555555',
  'L.Kình Dương': '#555555',
  'L.Đà La': '#555555',
  'L.Bạch Hổ': '#555555',
  'LN.Văn Tinh': '#555555',

  // 2. THỦY - Đen tuyền (#000000)
  'THIÊN ĐỒNG': '#000000',
  'THÁI ÂM': '#000000',
  'CỰ MÔN': '#000000',
  'THIÊN TƯỚNG': '#000000',
  'PHÁ QUÂN': '#000000',
  'Hóa Kỵ': '#000000',
  'Hữu Bật': '#000000',
  'Văn Khúc': '#000000',
  'Thiên Diêu': '#000000',
  'Thiên Hư': '#000000',
  'Lưu Hà': '#000000',
  'Long Đức': '#000000',
  'Thiếu Âm': '#000000',
  'Bác Sĩ': '#000000',
  'Bác Sỹ': '#000000',
  'Tam Thai': '#000000',
  'Thiên Y': '#000000',
  'L.Hóa Kỵ': '#000000',
  'L.Hóa Kị': '#000000',
  'L.Thiên Khốc': '#000000',
  'L.Thiên Hư': '#000000',

  // 3. HỎA - Đỏ tươi (#cc0000)
  'THÁI DƯƠNG': '#cc0000',
  'LIÊM TRINH': '#cc0000',
  'Hỏa Tinh': '#cc0000',
  'Linh Tinh': '#cc0000',
  'Địa Không': '#cc0000',
  'Địa Kiếp': '#cc0000',
  'Thiên Không': '#cc0000',
  'Thiên Khốc': '#cc0000',
  'Thiên Hình': '#cc0000',
  'Thiên Mã': '#cc0000',
  'Thiên Khôi': '#cc0000',
  'Thiên Việt': '#cc0000',
  'Hồng Loan': '#cc0000',
  'Thiên Hỷ': '#cc0000',
  'Thiếu Dương': '#cc0000',
  'Thái Tuế': '#cc0000',
  'Tuế Phá': '#cc0000',
  'Điếu Khách': '#cc0000',
  'Tiểu Hao': '#cc0000',
  'Đại Hao': '#cc0000',
  'Phục Binh': '#cc0000',
  'Quan Phù': '#cc0000',
  'Quan Phủ': '#cc0000',
  'Tử Phù': '#cc0000',
  'Trực Phù': '#cc0000',
  'Phi Liêm': '#cc0000',
  'Đẩu Quân': '#cc0000',
  'Kiếp Sát': '#cc0000',
  'Phá Toái': '#cc0000',
  'Lực Sĩ': '#cc0000',
  'Hỷ Thần': '#cc0000',
  'Thiên Đức': '#cc0000',
  'Nguyệt Đức': '#cc0000',
  'Thiên Giải': '#cc0000',
  'Địa Giải': '#cc0000',
  'L.Thiên Mã': '#cc0000',
  'L.Thái Tuế': '#cc0000',
  'L.Đẩu Quân': '#cc0000',

  // 4. MỘC - Xanh Lá (#008000)
  'THIÊN CƠ': '#008000',
  'THAM LANG': '#008000',
  'Hóa Lộc': '#008000',
  'Hóa Quyền': '#008000',
  'Hóa Khoa': '#008000',
  'Long Trì': '#008000',
  'Phượng Các': '#008000',
  'Giải Thần': '#008000',
  'Đào Hoa': '#008000',
  'Thanh Long': '#008000',
  'Tướng Quân': '#008000',
  'Tang Môn': '#008000',
  'Bát Tọa': '#008000',
  'Ân Quang': '#008000',
  'L.Tang Môn': '#008000',
  'L.Hóa Lộc': '#008000',
  'L.Hóa Quyền': '#008000',
  'L.Hóa Khoa': '#008000',

  // 5. THỔ - Vàng Hổ Phách (#c28b00)
  'TỬ VI': '#c28b00',
  'THIÊN PHỦ': '#c28b00',
  'THIÊN LƯƠNG': '#c28b00',
  'Lộc Tồn': '#c28b00',
  'Tả Phù': '#c28b00',
  'Tả Phụ': '#c28b00',
  'Thiên Quý': '#c28b00',
  'Thiên Phúc': '#c28b00',
  'Thiên Quan': '#c28b00',
  'Thiên Tài': '#c28b00',
  'Thiên Thọ': '#c28b00',
  'Phong Cáo': '#c28b00',
  'Thiên Thương': '#c28b00',
  'Thiên Sứ': '#c28b00',
  'Bệnh Phù': '#c28b00',
  'Cô Thần': '#c28b00',
  'Quả Tú': '#c28b00',
  'Thiên Trù': '#c28b00',
  'Phúc Đức': '#c28b00',
  'Quốc Ấn': '#c28b00',
  'L.Lộc Tồn': '#c28b00',
};
