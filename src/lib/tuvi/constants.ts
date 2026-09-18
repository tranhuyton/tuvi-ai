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
  'THÁI DƯƠNG': ['H', 'Đ', 'V', 'V', 'V', 'M', 'M', 'Đ', 'B', 'H', 'H', 'H'],
  'VŨ KHÚC': ['V', 'M', 'V', 'B', 'M', 'H', 'V', 'M', 'V', 'B', 'M', 'H'],
  'THIÊN ĐỒNG': ['V', 'H', 'B', 'Đ', 'H', 'Đ', 'H', 'H', 'M', 'H', 'H', 'Đ'],
  'LIÊM TRINH': ['B', 'Đ', 'V', 'H', 'M', 'H', 'B', 'Đ', 'V', 'H', 'M', 'H'],
  'THIÊN PHỦ': ['M', 'M', 'V', 'B', 'M', 'V', 'M', 'M', 'V', 'B', 'M', 'V'],
  'THÁI ÂM': ['V', 'M', 'B', 'H', 'H', 'H', 'H', 'B', 'Đ', 'V', 'M', 'M'],
  'THAM LANG': ['V', 'M', 'Đ', 'H', 'V', 'H', 'V', 'M', 'Đ', 'H', 'V', 'H'],
  'CỰ MÔN': ['V', 'H', 'M', 'M', 'H', 'B', 'V', 'H', 'Đ', 'M', 'H', 'V'],
  'THIÊN TƯỚNG': ['V', 'M', 'Đ', 'H', 'V', 'B', 'V', 'M', 'Đ', 'H', 'V', 'B'],
  'THIÊN LƯƠNG': ['V', 'V', 'V', 'M', 'M', 'H', 'M', 'V', 'B', 'H', 'B', 'H'],
  'THẤT SÁT': ['M', 'Đ', 'M', 'H', 'V', 'B', 'M', 'Đ', 'M', 'H', 'V', 'B'],
  'PHÁ QUÂN': ['M', 'V', 'H', 'H', 'M', 'H', 'M', 'V', 'H', 'H', 'M', 'H'],
};

export const CHINH_TINH_COLORS: Record<string, string> = {
  'TỬ VI': '#c28b00',      // Thổ - Vàng hổ phách
  'THIÊN PHỦ': '#c28b00',  // Thổ - Vàng hổ phách
  'THIÊN LƯƠNG': '#c28b00',// Thổ - Vàng hổ phách
  'THẤT SÁT': '#c28b00',   // Kim/Thổ - Vàng hổ phách
  'THÁI DƯƠNG': '#cc0000', // Hỏa - Đỏ tươi
  'LIÊM TRINH': '#cc0000', // Hỏa - Đỏ tươi
  'THIÊN CƠ': '#008000',   // Mộc - Xanh lục
  'THAM LANG': '#008000',  // Mộc - Xanh lục
  'VŨ KHÚC': '#555555',    // Kim - Xám kim
  'THIÊN ĐỒNG': '#000000', // Thủy - Đen tuyền
  'THÁI ÂM': '#000000',    // Thủy - Đen tuyền
  'CỰ MÔN': '#000000',     // Thủy - Đen tuyền
  'THIÊN TƯỚNG': '#000000',// Thủy - Đen tuyền
  'PHÁ QUÂN': '#000000',   // Thủy - Đen tuyền
};

export const BAD_STARS = [
  'Tang Môn', 'Tuế Phá', 'Đại Hao', 'Tiểu Hao', 'Bệnh Phù', 'Quan Phủ', 'Phục Binh', 'Tử Phù',
  'Thiếu Âm', 'Thiếu Dương', 'Quan Phù', 'Điếu Khách', 'Trực Phù', 'Kiếp Sát', 'Địa Võng',
  'Thiên La', 'Thiên Thương', 'Thiên Sứ', 'Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh',
  'Địa Không', 'Địa Kiếp', 'Cô Thần', 'Quả Tú', 'Thiên Khốc', 'Thiên Hư', 'Thiên Hình', 'Thiên Diêu',
  'Đẩu Quân', 'Lưu Hà', 'Phi Liêm', 'Phá Toái', 'Thiên Không'
];

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
  'Kình Dương': { 1: 'Đ', 4: 'Đ', 7: 'Đ', 10: 'Đ' },
  'Đà La': { 1: 'Đ', 4: 'Đ', 7: 'Đ', 10: 'Đ' },
  'Hỏa Tinh': { 2: 'Đ', 3: 'Đ', 4: 'Đ', 5: 'Đ', 6: 'Đ', 0: 'H', 1: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
  'Linh Tinh': { 2: 'Đ', 3: 'Đ', 4: 'Đ', 5: 'Đ', 6: 'Đ', 0: 'H', 1: 'H', 7: 'H', 8: 'H', 9: 'H', 10: 'H', 11: 'H' },
  'Địa Không': { 2: 'Đ', 5: 'Đ', 8: 'Đ', 11: 'Đ', 0: 'H', 1: 'H', 3: 'H', 4: 'H', 6: 'H', 7: 'H', 9: 'H', 10: 'H' },
  'Địa Kiếp': { 2: 'Đ', 5: 'Đ', 8: 'Đ', 11: 'Đ', 0: 'H', 1: 'H', 3: 'H', 4: 'H', 6: 'H', 7: 'H', 9: 'H', 10: 'H' },
  'Thiên Hình': { 2: 'Đ', 3: 'Đ', 4: 'Đ', 9: 'Đ' },
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
  'Lộc Tồn': { 2: 'B', 3: 'B', 5: 'B', 6: 'B', 8: 'B', 9: 'B', 11: 'B', 0: 'B' },
};
