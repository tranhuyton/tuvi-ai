export type Language = 'vi' | 'en' | 'zh' | 'ko';

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'vi', name: 'Tiếng Việt', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'zh', name: 'Chinese', nativeName: '中文 (简体)', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  vi: {
    // Header & Brand
    'brand.title': 'TỬ VI THẦY TÔN',
    'brand.subtitle': 'Bát Bộ Thần Sát & Tướng Pháp Bí Truyền',
    'nav.createChart': 'Lập Lá Số',
    'nav.savedCharts': 'Lá Số Đã Lưu',
    'nav.offlineNotebook': 'Sổ Tay Khách Offline',
    'nav.affiliate': 'Cộng Tác Viên',
    'nav.admin': 'Quản Trị',
    'nav.login': 'Đăng Nhập / Đăng Ký',
    'nav.changePassword': 'Đổi Mật Khẩu',
    'nav.logout': 'Đăng Xuất',
    'nav.vipBadge': 'Bản VIP',
    'nav.freeBadge': 'Bản Thường',
    'nav.about': 'Về Thầy Tôn',

    // Form
    'form.title': 'LẬP LÁ SỐ TỬ VI',
    'form.desc': 'An sao chính xác theo giờ sinh • Bình giải chuyên sâu đa phương thức',
    'form.fullName': 'Họ tên đương số',
    'form.fullNamePlaceholder': 'Ví dụ: Trần Huy Tôn...',
    'form.gender': 'Giới tính',
    'form.male': 'Nam',
    'form.female': 'Nữ',
    'form.calendar': 'Ngày tháng năm sinh (Dương lịch)',
    'form.solar': 'Dương Lịch',
    'form.lunar': 'Âm Lịch',
    'form.day': 'Ngày',
    'form.month': 'Tháng',
    'form.year': 'Năm',
    'form.birthHour': 'Giờ sinh (Chi)',
    'form.physiqueTitle': 'Dữ liệu Thực Chứng & Tướng Pháp (Tùy chọn)',
    'form.moreInfo': 'Hoàn cảnh, Nghề nghiệp hiện tại...',
    'form.moreInfoPlaceholder': 'Ví dụ: Đang làm kỹ sư IT, đã kết hôn, muốn hỏi sâu về đường làm ăn kinh doanh...',
    'form.height': 'Chiều cao (cm)',
    'form.heightPlaceholder': 'VD: 170',
    'form.weight': 'Cân nặng (kg)',
    'form.weightPlaceholder': 'VD: 65',
    'form.uploadFace': 'Ảnh khuôn mặt (Diện tướng)',
    'form.readingHeic': 'Đang đọc ảnh iPhone (HEIC)...',
    'form.selectFacePhoto': 'Chọn ảnh mặt rõ nét',
    'form.uploadPalm': 'Ảnh bàn tay (Thủ tướng)',
    'form.palmHint': '(Nam trái, Nữ phải)',
    'form.selectPalmPhoto': 'Chọn ảnh lòng bàn tay',
    'form.leftHand': 'Tay Trái',
    'form.rightHand': 'Tay Phải',
    'form.palmSubHint': 'Nam tay trái • Nữ tay phải',
    'form.packageTitle': 'Chọn Gói Bình Giải',
    'form.packageRequired': 'Bắt buộc chọn trước khi lập lá số',
    'form.freeTitle': '📜 Bản Miễn Phí',
    'form.freePrice': '0 VNĐ',
    'form.freeDesc': 'Pháp môn Khởi Nguyên Căn Bản. Luận giải chuẩn mực, súc tích (~800 - 1000 từ), bao quát Bản Mệnh, Tam Hợp Mệnh - Tài - Quan, Đại Vận & Tiểu Vận năm xem.',
    'form.freeQnA': 'Hỏi đáp trực tiếp: 49.000đ / 2 câu',
    'form.proTitle': 'Bản Chuyên Sâu Pro',
    'form.proPrice': '119.000 VNĐ',
    'form.proBadge': 'Khuyên Dùng',
    'form.proDesc': 'Đại Pháp Bí Truyền Chuyên Sâu. Luận giải chi tiết gấp 2 lần (~1800 - 2500 từ). Khảo sát sâu 14 Chính tinh, phối hợp Tướng Pháp (mặt/chỉ tay), Đại Vận 10 năm & Hóa Giải 4 Mùa.',
    'form.proQnA': 'Ưu đãi hỏi đáp VIP: Tặng 2 câu (Thêm: 99.000đ/2 câu)',
    'form.btnLoading': 'Thầy Đang Quán Tưởng...',
    'form.btnSubmitPro': 'Thanh Toán & Luận Giải Bản Pro',
    'form.btnSubmitFree': 'Lập Lá Số & Luận Giải Miễn Phí',
    'form.bookingTitle': 'Tư vấn CSKH hoặc Đặt lịch xem Online & Offline:',
    'form.zaloThay': 'Zalo Thầy',

    // Cung Names
    'cung.menh': 'Mệnh',
    'cung.phuMau': 'Phụ Mẫu',
    'cung.phucDuc': 'Phúc Đức',
    'cung.dienTrach': 'Điền Trạch',
    'cung.quanLoc': 'Quan Lộc',
    'cung.noBoc': 'Nô Bộc',
    'cung.thienDi': 'Thiên Di',
    'cung.tatAch': 'Tật Ách',
    'cung.taiBach': 'Tài Bạch',
    'cung.tuTuc': 'Tử Tức',
    'cung.phuThe': 'Phu Thê',
    'cung.huynhDe': 'Huynh Đệ',
    'cung.than': 'Thân',

    // Chart Center
    'chart.fullName': 'Họ tên:',
    'chart.year': 'Năm:',
    'chart.month': 'Tháng:',
    'chart.day': 'Ngày:',
    'chart.hour': 'Giờ:',
    'chart.viewYear': 'Năm xem:',
    'chart.yinYang': 'Âm Dương:',
    'chart.ageUnit': 'tuổi',
    'chart.solarBirth': 'Dương lịch',
    'chart.lunarBirth': 'Âm lịch',
    'chart.menh': 'Mệnh:',
    'chart.cuc': 'Cục:',
    'chart.sinhKhac': 'Sinh Khắc',
    'chart.menhChu': 'Mệnh chủ:',
    'chart.thanChu': 'Thân chủ:',
    'chart.thanCu': 'Thân Cư',
    'chart.tuoiAm': 'Tuổi Âm',
    'chart.tuan': 'Tuần',
    'chart.triet': 'Triệt',
    'chart.saveBtn': 'Lưu Lá Số',
    'chart.savedBtn': 'Đã Lưu',
    'chart.downloadBtn': 'Tải ảnh lá số',
    'chart.newChartBtn': 'Lập lá số mới',
    'chart.fitScreen': 'Vừa màn hình',
    'chart.originalSize': 'Cỡ gốc (Kéo ngang)',

    // Reading AI
    'reading.header': 'BÌNH GIẢI TỬ VI CHUYÊN SÂU TỪ THẦY TÔN',
    'reading.proTitle': 'Bình Giải Chuyên Sâu Từ Thầy Tôn (Bản Pro)',
    'reading.freeTitle': 'Bình Giải Tử Vi Thầy Tôn (Bản Cơ Bản)',
    'reading.proBadge': '👑 Bản Chuyên Sâu Bí Truyền',
    'reading.freeBadge': '📜 Bản Luận Giải Khởi Nguyên',
    'reading.proSubtitle': 'Toàn diện Tử Vi Cổ Truyền, Tứ Hóa, Tướng Pháp & Hóa Giải 4 Mùa',
    'reading.freeSubtitle': 'Tổng quan Mệnh Cục, Tam Hợp Mệnh-Tài-Quan, Đại Vận & Tiểu Vận',
    'reading.loadingUpgrading': 'Thầy Đang Nâng Cấp Luận Giải Pro...',
    'reading.loadingNormal': 'Thầy Đang Quán Tưởng...',
    'reading.loadingProDesc': 'Thầy Tôn đang định tâm quán tưởng thâm sâu, soi rọi 14 Chính tinh, đối chiếu Tướng pháp và luận giải vận khí 4 mùa. Quý khách vui lòng tịnh tâm đợi trong giây lát!',
    'reading.loadingFreeDesc': 'Thầy Tôn đang định tâm chắt lọc huyền cơ lá số tử vi và bản mệnh. Quý khách vui lòng kiên nhẫn đợi trong giây lát!',
    'reading.errorTitle': 'Thông báo từ Thầy Tôn:',
    'reading.copyBtn': 'Sao chép lời bình',
    'reading.copied': 'Đã sao chép',
    'reading.topUpgradeBtn': '⚡ Nâng Cấp Bản Pro',
    'reading.upgradePromptTitle': 'Bạn muốn tìm hiểu sâu sắc hơn về lá số này?',
    'reading.upgradePromptDesc': 'Bản Chuyên Sâu mở ra đại pháp bí truyền luận giải chi tiết gấp 2 lần, soi chiếu toàn diện Diện tướng/Chỉ tay, biến chuyển 4 mùa hạn vận và giải pháp hóa giải hung sát tinh.',
    'reading.upgradeBtn': 'Nâng Cấp Bản Pro (119.000đ)',

    // Chat AI
    'chat.headerTitle': 'Hỏi Đáp Luận Giải Cùng AI Thầy Tôn',
    'chat.headerDesc': 'Trí tuệ nhân tạo kế thừa tri thức & pháp số Tử Vi Đẩu Số bí truyền từ Thầy Tôn',
    'chat.vipClientBadge': 'Khách VIP Pro',
    'chat.freeClientBadge': 'Bản Cơ Bản',
    'chat.lockedBadge': 'Chưa mở khóa',
    'chat.exhaustedBadge': 'Đã dùng hết',
    'chat.proRemaining': 'Chuyên Sâu: Còn {count} câu',
    'chat.basicRemaining': 'Cơ Bản: Còn {count} câu',
    'chat.totalRemaining': 'Tổng: {count} lượt',
    'chat.introQuota': 'Quý khách đang có {count} lượt thỉnh giáo cùng AI Thầy Tôn.',
    'chat.introGuide': 'Hãy nhập câu hỏi chi tiết về công danh, sự nghiệp, tài lộc, tình duyên hoặc hạn vận để Thầy Tôn soi chiếu lá số.',
    'chat.userPrefix': 'Khách hỏi:',
    'chat.masterPrefix': 'AI Thầy Tôn:',
    'chat.badgeVip': 'Chuyên Sâu',
    'chat.badgeBasic': 'Cơ Bản',
    'chat.masterThinking': 'AI Thầy Tôn đang xem thiên cơ và biên lời giải đáp...',
    'chat.unpaidTitle': 'Thỉnh Giáo Luận Giải Cùng AI Thầy Tôn',
    'chat.unpaidDesc': 'Hệ thống AI soi chiếu lá số giúp giải khai khúc mắc cụ thể về công việc, tiền tài, nhân duyên hay vận hạn (gồm 02 câu hỏi).',
    'chat.unpaidBtn': '⚡ Quét Mã Thanh Toán ({price} / 2 câu hỏi)',
    'chat.paidSuccessTitle': 'Khai Mở Đàm Đạo Cùng Thầy Tôn!',
    'chat.paidSuccessDescPro': 'Hệ thống đã kích hoạt {count} câu hỏi Chuyên Sâu trực tiếp cùng AI Thầy Tôn theo gói quyền lợi của bạn.',
    'chat.paidSuccessDescFree': 'Hệ thống đã ghi nhận thanh toán. Quý khách có {count} câu hỏi Cơ Bản trực tiếp cùng AI Thầy Tôn.',
    'chat.paidSuccessDescBoth': 'Hệ thống đã kích hoạt tổng cộng {total} lượt đàm đạo: gồm {pro} lượt Chuyên Sâu và {basic} lượt Cơ Bản.',
    'chat.paidSuccessBtn': '✅ Bấm Vào Đây Để Mở Ô Hỏi ({count} câu còn lại)',
    'chat.modeLabel': 'Chế độ hỏi:',
    'chat.modeProBtn': 'Chuyên Sâu',
    'chat.modeBasicBtn': 'Cơ Bản',
    'chat.activeModePro': 'Đang chọn: Chuyên Sâu',
    'chat.activeModeBasic': 'Đang chọn: Cơ Bản',
    'chat.deductProHint': '(Trừ 1 câu VIP Pro)',
    'chat.buyMoreBasicBtn': '+ Mua 2 câu Cơ Bản (49k)',
    'chat.inputPlaceholderVip': 'Nhập câu hỏi chuyên sâu...',
    'chat.inputPlaceholderBasic': 'Nhập câu hỏi cơ bản...',
    'chat.sendBtn': 'Gửi Thầy',
    'chat.exhaustedTitle': 'Quý khách có muốn thỉnh giáo thêm câu hỏi không?',
    'chat.exhaustedDescPro': 'Quý khách đã sử dụng hết toàn bộ số lượt câu hỏi. Quý khách có thể gia hạn thêm câu hỏi chuyên sâu hoặc câu hỏi cơ bản.',
    'chat.exhaustedDescFree': 'Quý khách đã sử dụng hết toàn bộ số lượt câu hỏi. Quý khách có thể mua thêm câu hỏi cơ bản hoặc nâng cấp lên Bản Pro.',
    'chat.buyProMoreBtn': '⚡ Nạp Tiếp (99.000đ / 2 câu chuyên sâu)',
    'chat.buyBasicMoreBtn': '⚡ Mua 2 Câu Cơ Bản (49.000đ)',
    'chat.upgradeProChatBtn': '👑 Nâng Cấp Luận Giải Pro (119.000đ - Tặng 2 câu chuyên sâu)',

    // Booking Banner
    'booking.title': 'Đặt Lịch Luận Giải Cùng Thầy Tôn (Xem Online & Offline 1-1)',
    'booking.desc': 'Quý khách mong muốn được đàm đạo trực tiếp cùng Thầy Tôn (Xem Offline tại Hà Nội hoặc Luận giải Online 1-1 qua Video Call) để soi diện tướng, thủ tướng (chỉ tay), bấm quẻ Kỳ Môn Độn Giáp và đàm đạo chi tiết vận mệnh? Xin vui lòng liên hệ đặt lịch trước.',
    'booking.addressLabel': 'Địa chỉ xem Offline:',
    'booking.addressValue': 'R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    'booking.callBtn': 'Gọi Đặt Lịch: 0935.058.688',
    'booking.zaloBtn': 'Nhắn Zalo: 0935.058.688',

    // Floating Contact
    'floating.title': 'Tư vấn CSKH hoặc Đặt lịch Online & Offline',
    'floating.close': 'Đóng menu',
    'floating.callSub': 'Đặt lịch xem Online & Offline',
    'floating.zaloSub': 'Tư vấn CSKH qua Zalo',
    'floating.zaloBtn': 'Nhắn Zalo Thầy Tôn',
    'floating.mainBtn': 'Hỗ Trợ & Đặt Lịch',
    'floating.mainBtnAria': 'Tư vấn CSKH hoặc Đặt lịch xem Online & Offline',

    // Footer
    'footer.about': 'Về Thầy Tôn',
    'footer.testimonials': 'Đánh Giá & Cảm Nhận',
    'footer.contact': 'Liên hệ:',
    'footer.email': 'Email:',
    'footer.addressLabel': 'Địa chỉ:',
    'footer.addressValue': 'R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội',
    'footer.copyright': '© {year} Tử Vi Thầy Tôn. Kế thừa tinh hoa Dịch học & Cổ thuật ngàn năm — Soi sáng căn duyên, hanh thông bản mệnh.',
    'footer.admin': '[Quản trị]',
  },

  en: {
    // Header & Brand
    'brand.title': 'MASTER TON ASTROLOGY',
    'brand.subtitle': 'Secret Zi Wei Dou Shu & Physiognomy School',
    'nav.createChart': 'Generate Chart',
    'nav.savedCharts': 'Saved Charts',
    'nav.offlineNotebook': 'Offline Client Book',
    'nav.affiliate': 'Affiliates',
    'nav.admin': 'Admin',
    'nav.login': 'Log In / Register',
    'nav.changePassword': 'Change Password',
    'nav.logout': 'Log Out',
    'nav.vipBadge': 'VIP Pro',
    'nav.freeBadge': 'Standard',
    'nav.about': 'About Master Ton',

    // Form
    'form.title': 'ZI WEI NATAL CHART',
    'form.desc': 'Accurate Star Placement by Birth Time • Multi-modal Deep Analysis',
    'form.fullName': 'Full Name',
    'form.fullNamePlaceholder': 'e.g. Alexander Smith...',
    'form.gender': 'Gender',
    'form.male': 'Male',
    'form.female': 'Female',
    'form.calendar': 'Date of Birth (Solar Calendar)',
    'form.solar': 'Solar (Gregorian)',
    'form.lunar': 'Lunar Calendar',
    'form.day': 'Day',
    'form.month': 'Month',
    'form.year': 'Year',
    'form.birthHour': 'Birth Time (Double Hour)',
    'form.physiqueTitle': 'Empirical & Physiognomy Data (Optional)',
    'form.moreInfo': 'Current Situation, Profession...',
    'form.moreInfoPlaceholder': 'e.g. Software engineer, married, seeking insights into business ventures...',
    'form.height': 'Height (cm)',
    'form.heightPlaceholder': 'e.g. 170',
    'form.weight': 'Weight (kg)',
    'form.weightPlaceholder': 'e.g. 65',
    'form.uploadFace': 'Face Photo (Physiognomy)',
    'form.readingHeic': 'Processing iPhone photo (HEIC)...',
    'form.selectFacePhoto': 'Select clear face photo',
    'form.uploadPalm': 'Palm Photo (Palmistry)',
    'form.palmHint': '(Left for Men, Right for Women)',
    'form.selectPalmPhoto': 'Select palm photo',
    'form.leftHand': 'Left Hand',
    'form.rightHand': 'Right Hand',
    'form.palmSubHint': 'Men: Left Palm • Women: Right Palm',
    'form.packageTitle': 'Select Reading Package',
    'form.packageRequired': 'Selection required before chart generation',
    'form.freeTitle': '📜 Free Standard',
    'form.freePrice': '0 VND',
    'form.freeDesc': 'Classical Foundational Method. Concise and authoritative interpretation (~800 - 1000 words), covering Destiny, Career, Wealth, 10-Year and Annual Fortunes.',
    'form.freeQnA': 'Direct Q&A: 49,000 VND / 2 questions',
    'form.proTitle': 'VIP Pro Deep Analysis',
    'form.proPrice': '119,000 VND',
    'form.proBadge': 'Recommended',
    'form.proDesc': 'Esoteric Master Analysis. Twice the depth and detail (~1800 - 2500 words). Comprehensive study of 14 Major Stars, Face/Palm reading synthesis, 10-Year Luck & 4-Season Roadmap.',
    'form.proQnA': 'VIP Perk: 2 Free Questions included (Add: 99,000 VND / 2 Qs)',
    'form.btnLoading': 'Master is Contemplating...',
    'form.btnSubmitPro': 'Pay & Generate VIP Pro Reading',
    'form.btnSubmitFree': 'Generate Chart & Free Reading',
    'form.bookingTitle': 'Support & Direct Consultation Booking (Online/Offline):',
    'form.zaloThay': 'Master Contact',

    // Cung Names
    'cung.menh': 'Life (Destiny)',
    'cung.phuMau': 'Parents',
    'cung.phucDuc': 'Karma & Spirit',
    'cung.dienTrach': 'Property',
    'cung.quanLoc': 'Career',
    'cung.noBoc': 'Friends',
    'cung.thienDi': 'Travel',
    'cung.tatAch': 'Health',
    'cung.taiBach': 'Wealth',
    'cung.tuTuc': 'Children',
    'cung.phuThe': 'Spouse',
    'cung.huynhDe': 'Siblings',
    'cung.than': 'Body (Action)',

    // Chart Center
    'chart.fullName': 'Name:',
    'chart.year': 'Year:',
    'chart.month': 'Month:',
    'chart.day': 'Day:',
    'chart.hour': 'Hour:',
    'chart.viewYear': 'Reading Year:',
    'chart.yinYang': 'Yin-Yang:',
    'chart.ageUnit': 'yrs',
    'chart.solarBirth': 'Solar Birth',
    'chart.lunarBirth': 'Lunar Birth',
    'chart.menh': 'Life Element:',
    'chart.cuc': 'Bureau:',
    'chart.sinhKhac': 'Elemental Balance',
    'chart.menhChu': 'Life Master:',
    'chart.thanChu': 'Body Master:',
    'chart.thanCu': 'Body Palace at',
    'chart.tuoiAm': 'Lunar Age',
    'chart.tuan': 'Void',
    'chart.triet': 'Break',
    'chart.saveBtn': 'Save Chart',
    'chart.savedBtn': 'Saved',
    'chart.downloadBtn': 'Download Chart Image',
    'chart.newChartBtn': 'Create New Chart',
    'chart.fitScreen': 'Fit Screen',
    'chart.originalSize': 'Original Size',

    // Reading AI
    'reading.header': 'PROFUNDITY ZI WEI ANALYSIS BY MASTER TON',
    'reading.proTitle': 'Deep Zi Wei Analysis by Master Ton (VIP Pro)',
    'reading.freeTitle': 'Master Ton Zi Wei Analysis (Standard)',
    'reading.proBadge': '👑 Esoteric VIP Pro Edition',
    'reading.freeBadge': '📜 Foundational Standard Edition',
    'reading.proSubtitle': 'Full Classical Zi Wei, Four Transformations, Physiognomy & 4-Season Roadmap',
    'reading.freeSubtitle': 'Overview of Life Bureau, Destiny Triad, 10-Year Decan & Annual Luck',
    'reading.loadingUpgrading': 'Master is Upgrading to VIP Pro Reading...',
    'reading.loadingNormal': 'Master is Contemplating...',
    'reading.loadingProDesc': 'Master Ton is meditating deeply, analyzing the 14 Major Stars, cross-referencing Physiognomy, and discerning the 4-Season energetic flow. Please wait peacefully.',
    'reading.loadingFreeDesc': 'Master Ton is discerning the esoteric secrets of your natal chart. Please wait a moment.',
    'reading.errorTitle': 'Notice from Master Ton:',
    'reading.copyBtn': 'Copy Reading',
    'reading.copied': 'Copied!',
    'reading.topUpgradeBtn': '⚡ Upgrade to Pro',
    'reading.upgradePromptTitle': 'Wish to explore deeper mysteries in this chart?',
    'reading.upgradePromptDesc': 'The VIP Pro Edition unlocks esoteric master reading twice as long, deep Face & Palmistry synthesis, 4-Season breakdown, and personalized remedies for malefic stars.',
    'reading.upgradeBtn': 'Upgrade to VIP Pro (119,000 VND)',

    // Chat AI
    'chat.headerTitle': 'Q&A Consultation with AI Master Ton',
    'chat.headerDesc': 'Artificial intelligence inherited from Master Ton’s esoteric Zi Wei Dou Shu expertise',
    'chat.vipClientBadge': 'VIP Pro Client',
    'chat.freeClientBadge': 'Standard Client',
    'chat.lockedBadge': 'Locked',
    'chat.exhaustedBadge': 'Exhausted',
    'chat.proRemaining': 'VIP Pro: {count} left',
    'chat.basicRemaining': 'Standard: {count} left',
    'chat.totalRemaining': 'Total: {count} questions',
    'chat.introQuota': 'You currently have {count} queries available with AI Master Ton.',
    'chat.introGuide': 'Enter specific inquiries regarding career, investment, romance, or auspicious timing for the Master to illuminate your chart.',
    'chat.userPrefix': 'Seeker asked:',
    'chat.masterPrefix': 'AI Master Ton:',
    'chat.badgeVip': 'VIP Pro',
    'chat.badgeBasic': 'Standard',
    'chat.masterThinking': 'AI Master Ton is contemplating celestial signs and preparing counsel...',
    'chat.unpaidTitle': 'Consult AI Master Ton',
    'chat.unpaidDesc': 'The AI system analyzes your natal chart to resolve specific questions on career, wealth, marriage, or obstacles (2 questions included).',
    'chat.unpaidBtn': '⚡ Scan to Pay ({price} / 2 questions)',
    'chat.paidSuccessTitle': 'Dialogue with Master Ton Unlocked!',
    'chat.paidSuccessDescPro': 'Your account has been credited with {count} Deep VIP Pro queries directly with AI Master Ton.',
    'chat.paidSuccessDescFree': 'Payment recorded. You have {count} Standard questions available with AI Master Ton.',
    'chat.paidSuccessDescBoth': 'Activated {total} total queries: {pro} VIP Pro and {basic} Standard questions.',
    'chat.paidSuccessBtn': '✅ Click Here to Open Chat ({count} remaining)',
    'chat.modeLabel': 'Question Mode:',
    'chat.modeProBtn': 'VIP Pro',
    'chat.modeBasicBtn': 'Standard',
    'chat.activeModePro': 'Current: VIP Pro',
    'chat.activeModeBasic': 'Current: Standard',
    'chat.deductProHint': '(Uses 1 VIP Pro credit)',
    'chat.buyMoreBasicBtn': '+ Buy 2 Standard (49k)',
    'chat.inputPlaceholderVip': 'Enter your deep question...',
    'chat.inputPlaceholderBasic': 'Enter your standard question...',
    'chat.sendBtn': 'Send to Master',
    'chat.exhaustedTitle': 'Would you like to ask further questions?',
    'chat.exhaustedDescPro': 'You have used all question credits. You may acquire additional VIP Pro or Standard queries.',
    'chat.exhaustedDescFree': 'You have used all question credits. You can add more questions or upgrade to VIP Pro.',
    'chat.buyProMoreBtn': '⚡ Top Up (99,000 VND / 2 VIP Pro Qs)',
    'chat.buyBasicMoreBtn': '⚡ Buy 2 Standard Qs (49,000 VND)',
    'chat.upgradeProChatBtn': '👑 Upgrade to Pro (119,000 VND - 2 Pro Qs Free)',

    // Booking Banner
    'booking.title': 'Book a Consultation with Master Ton (Online & Offline 1-on-1)',
    'booking.desc': 'Would you like a direct consultation with Master Ton (In-person in Hanoi or 1-on-1 Online via Video Call) for physiognomy, palmistry, Qi Men Dun Jia divination, and in-depth destiny analysis? Please contact us in advance to schedule your session.',
    'booking.addressLabel': 'In-Person Consultation Venue:',
    'booking.addressValue': 'R2B 2219, Royal City, 72 Nguyen Trai, Thanh Xuan, Hanoi',
    'booking.callBtn': 'Call to Book: +84 93 505 8688',
    'booking.zaloBtn': 'Chat via Zalo / WhatsApp',

    // Floating Contact
    'floating.title': 'Client Support & Consultation Booking (Online/Offline)',
    'floating.close': 'Close menu',
    'floating.callSub': 'Book Online & In-Person Session',
    'floating.zaloSub': 'Support & Booking via Zalo',
    'floating.zaloBtn': 'Direct Chat with Master Ton',
    'floating.mainBtn': 'Support & Booking',
    'floating.mainBtnAria': 'Client support or book consultation with Master Ton',

    // Footer
    'footer.about': 'About Master Ton',
    'footer.testimonials': 'Testimonials & Reviews',
    'footer.contact': 'Contact:',
    'footer.email': 'Email:',
    'footer.addressLabel': 'Address:',
    'footer.addressValue': 'R2B 2219, Royal City, 72 Nguyen Trai, Thanh Xuan, Hanoi, Vietnam',
    'footer.copyright': '© {year} Master Ton Astrology. Inheriting millennium-old I-Ching wisdom — Illuminating life paths, unlocking prosperity.',
    'footer.admin': '[Admin Portal]',
  },

  zh: {
    // Header & Brand
    'brand.title': '顿师紫微斗数',
    'brand.subtitle': '八部神煞与相法秘传',
    'nav.createChart': '排盘算命',
    'nav.savedCharts': '保存命盘',
    'nav.offlineNotebook': '线下客户名录',
    'nav.affiliate': '合伙人中心',
    'nav.admin': '管理后台',
    'nav.login': '登录 / 注册',
    'nav.changePassword': '修改密码',
    'nav.logout': '退出登录',
    'nav.vipBadge': 'VIP尊享版',
    'nav.freeBadge': '普通版',
    'nav.about': '关于顿师',

    // Form
    'form.title': '紫微斗数排盘',
    'form.desc': '依生辰时辰精确安星 • 多维综合命理详批',
    'form.fullName': '命主姓名',
    'form.fullNamePlaceholder': '例如：李明轩...',
    'form.gender': '性别',
    'form.male': '男 (乾造)',
    'form.female': '女 (坤造)',
    'form.calendar': '出生年月日 (公历/阳历)',
    'form.solar': '公历 (阳历)',
    'form.lunar': '农历 (阴历)',
    'form.day': '日',
    'form.month': '月',
    'form.year': '年',
    'form.birthHour': '出生时辰 (地支)',
    'form.physiqueTitle': '实证与相法合参数据 (选填)',
    'form.moreInfo': '现状与当前职业...',
    'form.moreInfoPlaceholder': '例如：从事IT工程师，已婚，重点想看创业经商前景...',
    'form.height': '身高 (cm)',
    'form.heightPlaceholder': '例如：170',
    'form.weight': '体重 (kg)',
    'form.weightPlaceholder': '例如：65',
    'form.uploadFace': '面部照片 (面相考证)',
    'form.readingHeic': '正在读取苹果HEIC照片...',
    'form.selectFacePhoto': '选择清晰正面照',
    'form.uploadPalm': '手掌照片 (掌相考证)',
    'form.palmHint': '(男左女右)',
    'form.selectPalmPhoto': '选择清晰手掌照',
    'form.leftHand': '左手',
    'form.rightHand': '右手',
    'form.palmSubHint': '男看左手 • 女看右手',
    'form.packageTitle': '选择批命方案',
    'form.packageRequired': '排盘前必须选择方案',
    'form.freeTitle': '📜 基础免费版',
    'form.freePrice': '0 越南盾',
    'form.freeDesc': '基础经典推演。详尽精炼 (~800 - 1000字)，涵盖本命总论、命财官三方四正、十年大运及流年气运。',
    'form.freeQnA': '直接请教：49,000 VND / 2次',
    'form.proTitle': 'VIP大师精批版',
    'form.proPrice': '119,000 越南盾',
    'form.proBadge': '大师推荐',
    'form.proDesc': '大师级秘传精析。双倍深度详批 (~1800 - 2500字)。详析十四正曜，合参面相掌纹，细断十年大运与四季流月化解密法。',
    'form.proQnA': 'VIP专属特权：赠送2次深度请教 (加购：99,000 VND / 2次)',
    'form.btnLoading': '顿师入静定盘中...',
    'form.btnSubmitPro': '支付并开启VIP大师精批',
    'form.btnSubmitFree': '排盘并开启免费推演',
    'form.bookingTitle': '客服咨询或预约线上/线下看盘：',
    'form.zaloThay': '大师联系方式',

    // Cung Names
    'cung.menh': '命宫',
    'cung.phuMau': '父母宫',
    'cung.phucDuc': '福德宫',
    'cung.dienTrach': '田宅宫',
    'cung.quanLoc': '官禄宫',
    'cung.noBoc': '奴仆宫',
    'cung.thienDi': '迁移宫',
    'cung.tatAch': '疾厄宫',
    'cung.taiBach': '财帛宫',
    'cung.tuTuc': '子女宫',
    'cung.phuThe': '夫妻宫',
    'cung.huynhDe': '兄弟宫',
    'cung.than': '身宫',

    // Chart Center
    'chart.fullName': '姓名:',
    'chart.year': '年:',
    'chart.month': '月:',
    'chart.day': '日:',
    'chart.hour': '时:',
    'chart.viewYear': '所断年份:',
    'chart.yinYang': '阴阳:',
    'chart.ageUnit': '岁',
    'chart.solarBirth': '公历生辰',
    'chart.lunarBirth': '农历生辰',
    'chart.menh': '本命五行:',
    'chart.cuc': '五行局:',
    'chart.sinhKhac': '命局生克',
    'chart.menhChu': '命主:',
    'chart.thanChu': '身主:',
    'chart.thanCu': '身宫寄附',
    'chart.tuoiAm': '虚岁',
    'chart.tuan': '旬空',
    'chart.triet': '截空',
    'chart.saveBtn': '保存命盘',
    'chart.savedBtn': '已保存',
    'chart.downloadBtn': '下载命盘图片',
    'chart.newChartBtn': '排新命盘',
    'chart.fitScreen': '适应屏幕',
    'chart.originalSize': '原始尺寸',

    // Reading AI
    'reading.header': '顿师紫微斗数深度推演详批',
    'reading.proTitle': '顿师紫微深度精批 (VIP大师版)',
    'reading.freeTitle': '顿师紫微基础断盘 (普通版)',
    'reading.proBadge': '👑 VIP大师秘传版',
    'reading.freeBadge': '📜 经典基础断盘',
    'reading.proSubtitle': '全方位紫微正统、四化飞星、相法合参与四季流月化解',
    'reading.freeSubtitle': '本命五行局、命财官三方四正、十年大运及流年综述',
    'reading.loadingUpgrading': '顿师正在升级大师级精批...',
    'reading.loadingNormal': '顿师入静定盘中...',
    'reading.loadingProDesc': '顿师正在入静定盘，洞察十四正曜交汇，合参面相掌纹并推演四季流月吉凶。请静心稍候！',
    'reading.loadingFreeDesc': '顿师正在推演命盘玄机与本命吉凶。请稍加等候！',
    'reading.errorTitle': '顿师示下：',
    'reading.copyBtn': '复制批命全文',
    'reading.copied': '已复制',
    'reading.topUpgradeBtn': '⚡ 升级至VIP大师版',
    'reading.upgradePromptTitle': '欲进一步探究本命盘的深层奥秘？',
    'reading.upgradePromptDesc': 'VIP大师版开启双倍篇幅深度批命，全面合参面相掌相，细断四季流月吉凶与避凶化煞秘诀。',
    'reading.upgradeBtn': '升级至VIP大师版 (119,000 VND)',

    // Chat AI
    'chat.headerTitle': '与AI顿师当面问道请教',
    'chat.headerDesc': '承继顿师紫微斗数秘传易学与相法智慧的人工智能',
    'chat.vipClientBadge': 'VIP尊享缘主',
    'chat.freeClientBadge': '普通缘主',
    'chat.lockedBadge': '未解锁',
    'chat.exhaustedBadge': '已用尽',
    'chat.proRemaining': '深度精析：尚余 {count} 次',
    'chat.basicRemaining': '基础请教：尚余 {count} 次',
    'chat.totalRemaining': '总计：{count} 次',
    'chat.introQuota': '缘主当前拥有 {count} 次向AI顿师请教的机会。',
    'chat.introGuide': '请详细输入关于仕途升迁、投资财运、婚缘情感或流月运程的具体疑问。',
    'chat.userPrefix': '缘主请教：',
    'chat.masterPrefix': 'AI顿师开示：',
    'chat.badgeVip': '深度精析',
    'chat.badgeBasic': '基础请教',
    'chat.masterThinking': '顿师正在推演天机并撰写批复...',
    'chat.unpaidTitle': '向AI顿师问道请教',
    'chat.unpaidDesc': 'AI系统对照命盘，为您剖析事业、财富、婚缘或运势困惑（共包含2次提问）。',
    'chat.unpaidBtn': '⚡ 扫码开通 ({price} / 2次提问)',
    'chat.paidSuccessTitle': '已开启与顿师问道对话！',
    'chat.paidSuccessDescPro': '系统已根据您的权益，为您开通 {count} 次深度VIP请教机会。',
    'chat.paidSuccessDescFree': '支付已确认。您拥有 {count} 次基础请教机会。',
    'chat.paidSuccessDescBoth': '已开通共计 {total} 次请教：含 {pro} 次深度VIP与 {basic} 次基础提问。',
    'chat.paidSuccessBtn': '✅ 点击此处打开提问框 (尚余 {count} 次)',
    'chat.modeLabel': '提问模式：',
    'chat.modeProBtn': '深度精析',
    'chat.modeBasicBtn': '基础请教',
    'chat.activeModePro': '当前选择：深度精析',
    'chat.activeModeBasic': '当前选择：基础请教',
    'chat.deductProHint': '(扣除1次VIP额度)',
    'chat.buyMoreBasicBtn': '+ 充值2次基础 (49k)',
    'chat.inputPlaceholderVip': '输入深度请教问题...',
    'chat.inputPlaceholderBasic': '输入基础请教问题...',
    'chat.sendBtn': '呈递顿师',
    'chat.exhaustedTitle': '缘主是否需要继续请教？',
    'chat.exhaustedDescPro': '您的所有提问次数已用尽。您可以充值深度提问或基础提问。',
    'chat.exhaustedDescFree': '您的提问次数已用尽。您可以充值基础提问或升级至VIP大师版。',
    'chat.buyProMoreBtn': '⚡ 充值 (99,000 VND / 2次深度请教)',
    'chat.buyBasicMoreBtn': '⚡ 充值2次基础请教 (49,000 VND)',
    'chat.upgradeProChatBtn': '👑 升级VIP大师精批 (119,000 VND - 赠送2次深度请教)',

    // Booking Banner
    'booking.title': '预约顿师亲测大谈（线下见面对谈 & 线上1对1视频详批）',
    'booking.desc': '您若渴望由顿师亲自批命（河内线下大谈或线上1对1视频会诊），结合面相、手相、奇门遁甲起卦与全盘大运推演，请提前联络预约。',
    'booking.addressLabel': '线下亲测会所地址：',
    'booking.addressValue': '越南河内青春郡阮廌路72号皇家城 (Royal City) R2B栋 2219号',
    'booking.callBtn': '致电预约：+84 93 505 8688',
    'booking.zaloBtn': 'Zalo / 微信联络顿师',

    // Floating Contact
    'floating.title': '缘主客服咨询与线上/线下大谈预约',
    'floating.close': '关闭菜单',
    'floating.callSub': '预约线上/线下亲测',
    'floating.zaloSub': 'Zalo专属客服咨询',
    'floating.zaloBtn': '联络顿师团队',
    'floating.mainBtn': '客服与预约',
    'floating.mainBtnAria': '客服咨询与线上/线下大谈预约',

    // Footer
    'footer.about': '关于顿师',
    'footer.testimonials': '名家评价与感悟',
    'footer.contact': '咨询热线：',
    'footer.email': '电子邮箱：',
    'footer.addressLabel': '会所地址：',
    'footer.addressValue': '越南河内青春郡阮廌路72号皇家城 (Royal City) R2B栋 2219号',
    'footer.copyright': '© {year} 顿师紫微斗数。承继千载易学古法精粹 — 洞悉宿世宿命，开阖康泰坦途。',
    'footer.admin': '[管理后台]',
  },

  ko: {
    // Header & Brand
    'brand.title': '톤 대사 자미두수',
    'brand.subtitle': '팔부신살과 관상비전 심층추명',
    'nav.createChart': '명반 명조 작성',
    'nav.savedCharts': '저장된 명반',
    'nav.offlineNotebook': '오프라인 고객 장부',
    'nav.affiliate': '파트너 포털',
    'nav.admin': '관리자',
    'nav.login': '로그인 / 회원가입',
    'nav.changePassword': '비밀번호 변경',
    'nav.logout': '로그아웃',
    'nav.vipBadge': 'VIP 전용',
    'nav.freeBadge': '일반판',
    'nav.about': '톤 대사 소개',

    // Form
    'form.title': '자미두수 명반 산출',
    'form.desc': '생시 기준 정확한 별자리 배치 • 다차원 심층 명리 감명',
    'form.fullName': '의뢰인 성함',
    'form.fullNamePlaceholder': '예: 김철수...',
    'form.gender': '성별',
    'form.male': '남성 (건명)',
    'form.female': '여성 (곤명)',
    'form.calendar': '생년월일 (양력 기준)',
    'form.solar': '양력',
    'form.lunar': '음력',
    'form.day': '일',
    'form.month': '월',
    'form.year': '년',
    'form.birthHour': '출생시 (12간지)',
    'form.physiqueTitle': '실증 및 관상 대조 데이터 (선택)',
    'form.moreInfo': '현재 상황 및 직업...',
    'form.moreInfoPlaceholder': '예: IT 엔지니어, 기혼, 향후 사업 및 창업운 문의...',
    'form.height': '키 (cm)',
    'form.heightPlaceholder': '예: 170',
    'form.weight': '몸무게 (kg)',
    'form.weightPlaceholder': '예: 65',
    'form.uploadFace': '얼굴 사진 (관상 대조)',
    'form.readingHeic': 'iPhone HEIC 사진 처리 중...',
    'form.selectFacePhoto': '선명한 정면 사진 선택',
    'form.uploadPalm': '손바닥 사진 (수상 손금)',
    'form.palmHint': '(남좌여우)',
    'form.selectPalmPhoto': '손바닥 사진 선택',
    'form.leftHand': '왼손',
    'form.rightHand': '오른손',
    'form.palmSubHint': '남성 왼손 • 여성 오른손',
    'form.packageTitle': '감명 플랜 선택',
    'form.packageRequired': '명반 작성 전 필수 선택',
    'form.freeTitle': '📜 기본 무료판',
    'form.freePrice': '0 VND',
    'form.freeDesc': '정통 기초 감명. 명료하고 권위 있는 해석 (~800 - 1000자), 본명국, 삼방사정(명·재·관), 10년 대운 및 세운 총괄 분석.',
    'form.freeQnA': '직접 질문: 49,000 VND / 2회',
    'form.proTitle': 'VIP 마스터 심층 프로판',
    'form.proPrice': '119,000 VND',
    'form.proBadge': '추천 플랜',
    'form.proDesc': '비전 심층 대사 감명. 2배 분량의 심도 있는 해석 (~1800 - 2500자). 14주성 정밀 고찰, 관상 및 손금(수상) 합참, 10년 대운 및 사계절 월운 방책 제시.',
    'form.proQnA': 'VIP 혜택: 질문 2회 무료 제공 (추가: 99,000 VND / 2회)',
    'form.btnLoading': '대사께서 통찰 중이십니다...',
    'form.btnSubmitPro': '결제 및 VIP 프로 감명 시작',
    'form.btnSubmitFree': '명반 산출 및 무료 감명 시작',
    'form.bookingTitle': '고객 지원 및 온·오프라인 대면 상담 예약:',
    'form.zaloThay': '대사 상담톡',

    // Cung Names
    'cung.menh': '명궁',
    'cung.phuMau': '부모궁',
    'cung.phucDuc': '복덕궁',
    'cung.dienTrach': '전택궁',
    'cung.quanLoc': '관록궁',
    'cung.noBoc': '노복궁',
    'cung.thienDi': '천이궁',
    'cung.tatAch': '질액궁',
    'cung.taiBach': '재백궁',
    'cung.tuTuc': '자녀궁',
    'cung.phuThe': '부처궁',
    'cung.huynhDe': '형제궁',
    'cung.than': '신궁',

    // Chart Center
    'chart.fullName': '성명:',
    'chart.year': '년:',
    'chart.month': '월:',
    'chart.day': '일:',
    'chart.hour': '시:',
    'chart.viewYear': '간명년도:',
    'chart.yinYang': '음양:',
    'chart.ageUnit': '세',
    'chart.solarBirth': '양력 생년월일',
    'chart.lunarBirth': '음력 생년월일',
    'chart.menh': '본명 오행:',
    'chart.cuc': '오행국:',
    'chart.sinhKhac': '명국 생극',
    'chart.menhChu': '명주:',
    'chart.thanChu': '신주:',
    'chart.thanCu': '신궁 위치',
    'chart.tuoiAm': '한국식 나이(세)',
    'chart.tuan': '순공',
    'chart.triet': '절공',
    'chart.saveBtn': '명반 저장',
    'chart.savedBtn': '저장 완료',
    'chart.downloadBtn': '명반 이미지 다운로드',
    'chart.newChartBtn': '새 명반 작성',
    'chart.fitScreen': '화면 맞춤',
    'chart.originalSize': '원본 크기',

    // Reading AI
    'reading.header': '톤 대사의 자미두수 심층 감명록',
    'reading.proTitle': '톤 대사 자미두수 심층 감명 (VIP 프로판)',
    'reading.freeTitle': '톤 대사 자미두수 기초 감명 (일반판)',
    'reading.proBadge': '👑 VIP 비전 심층판',
    'reading.freeBadge': '📜 기초 정통 감명판',
    'reading.proSubtitle': '정통 자미두수, 사화비성, 관상·수상 대조 및 사계절 월운 개운법 총망라',
    'reading.freeSubtitle': '명국 오행, 명·재·관 삼방사정, 10년 대운 및 당해 세운 개관',
    'reading.loadingUpgrading': '톤 대사가 VIP 심층 감명으로 승급 중입니다...',
    'reading.loadingNormal': '대사께서 통찰 중이십니다...',
    'reading.loadingProDesc': '톤 대사가 정좌하여 14주성을 관통하고 관상 및 손금을 대조하며 사계절 운기를 세밀히 살피고 있습니다. 잠시만 평온히 기다려 주십시오.',
    'reading.loadingFreeDesc': '톤 대사가 명반의 천기를 통찰하고 있습니다. 잠시만 기다려 주십시오.',
    'reading.errorTitle': '톤 대사의 전언:',
    'reading.copyBtn': '감명서 복사',
    'reading.copied': '복사 완료',
    'reading.topUpgradeBtn': '⚡ VIP 프로로 승급',
    'reading.upgradePromptTitle': '이 명반의 더 깊은 천기를 밝히고 싶으십니까?',
    'reading.upgradePromptDesc': 'VIP 프로판은 2배 분량의 비전 해석, 얼굴 관상 및 손금 심층 대조, 사계절 월운 흐름 및 살성 개운법을 제공합니다.',
    'reading.upgradeBtn': 'VIP 프로 승급 (119,000 VND)',

    // Chat AI
    'chat.headerTitle': 'AI 톤 대사와의 1:1 문답 대담',
    'chat.headerDesc': '톤 대사의 비전 자미두수와 관상학적 지혜를 계승한 인공지능',
    'chat.vipClientBadge': 'VIP 프로 의뢰인',
    'chat.freeClientBadge': '일반 의뢰인',
    'chat.lockedBadge': '미잠금 해제',
    'chat.exhaustedBadge': '모두 소진',
    'chat.proRemaining': '심층 VIP: {count}회 남음',
    'chat.basicRemaining': '기본: {count}회 남음',
    'chat.totalRemaining': '총합: {count}회',
    'chat.introQuota': '의뢰인님께서는 현재 AI 톤 대사에게 {count}회의 질문 기회가 있습니다.',
    'chat.introGuide': '사업, 직장, 재물운, 연애/결혼 또는 월별 운세 등 구체적인 고민을 질문하십시오.',
    'chat.userPrefix': '의뢰인 질문:',
    'chat.masterPrefix': 'AI 톤 대사 답변:',
    'chat.badgeVip': '심층 질문',
    'chat.badgeBasic': '기본 질문',
    'chat.masterThinking': '대사께서 천기를 살피며 답변을 작성하고 계십니다...',
    'chat.unpaidTitle': 'AI 톤 대사에게 질문하기',
    'chat.unpaidDesc': 'AI 시스템이 명반을 분석하여 직업, 금전, 인연, 운세의 의문을 명쾌하게 풀어드립니다 (총 2회 질문).',
    'chat.unpaidBtn': '⚡ 결제 QR 스캔 ({price} / 2회 질문)',
    'chat.paidSuccessTitle': '톤 대사와의 대담이 개방되었습니다!',
    'chat.paidSuccessDescPro': '플랜 권익에 따라 AI 톤 대사와의 {count}회 심층 VIP 질문이 활성화되었습니다.',
    'chat.paidSuccessDescFree': '결제가 확인되었습니다. AI 톤 대사와의 {count}회 기본 질문이 부여되었습니다.',
    'chat.paidSuccessDescBoth': '총 {total}회의 질문이 활성화되었습니다: 심층 {pro}회 및 기본 {basic}회.',
    'chat.paidSuccessBtn': '✅ 여기를 클릭하여 질문창 열기 ({count}회 남음)',
    'chat.modeLabel': '질문 모드:',
    'chat.modeProBtn': '심층 VIP',
    'chat.modeBasicBtn': '기본',
    'chat.activeModePro': '현재 선택: 심층 VIP',
    'chat.activeModeBasic': '현재 선택: 기본',
    'chat.deductProHint': '(VIP 1회 차감)',
    'chat.buyMoreBasicBtn': '+ 기본 질문 2회 충전 (49k)',
    'chat.inputPlaceholderVip': '심층 질문을 입력하세요...',
    'chat.inputPlaceholderBasic': '기본 질문을 입력하세요...',
    'chat.sendBtn': '대사께 전송',
    'chat.exhaustedTitle': '추가로 더 질문하시겠습니까?',
    'chat.exhaustedDescPro': '부여된 모든 질문 횟수가 소진되었습니다. 심층 질문이나 기본 질문을 추가하실 수 있습니다.',
    'chat.exhaustedDescFree': '질문 횟수가 소진되었습니다. 기본 질문을 추가하거나 VIP 프로로 업그레이드하실 수 있습니다.',
    'chat.buyProMoreBtn': '⚡ 질문 충전 (99,000 VND / 심층 2회)',
    'chat.buyBasicMoreBtn': '⚡ 기본 질문 2회 구매 (49,000 VND)',
    'chat.upgradeProChatBtn': '👑 VIP 프로 승급 (119,000 VND - 심층 질문 2회 증정)',

    // Booking Banner
    'booking.title': '톤 대사 1:1 심층 상담 예약 (오프라인 대면 & 온라인 화상 대담)',
    'booking.desc': '톤 대사님과 1:1로 직접 마주하여(하노이 오프라인 대면 또는 온라인 화상 통화), 관상과 손금을 살피고 기문둔갑을 포국하여 인생의 운명을 심도 있게 조언받고자 하시는 분은 사전 예약해 주시기 바랍니다.',
    'booking.addressLabel': '오프라인 대면 상담소 주소:',
    'booking.addressValue': '베트남 하노이시 타잉쑤언구 응우옌짜이 72 로얄시티 R2B 2219호',
    'booking.callBtn': '예약 전화: +84 93 505 8688',
    'booking.zaloBtn': 'Zalo / 카카오 문의: 0935.058.688',

    // Floating Contact
    'floating.title': '고객 상담 지원 및 온라인/오프라인 대담 예약',
    'floating.close': '메뉴 닫기',
    'floating.callSub': '온라인 & 오프라인 상담 예약',
    'floating.zaloSub': '메신저 1:1 상담 안내',
    'floating.zaloBtn': '톤 대사 메신저 상담',
    'floating.mainBtn': '상담 & 예약',
    'floating.mainBtnAria': '고객 상담 지원 및 대담 예약',

    // Footer
    'footer.about': '톤 대사 소개',
    'footer.testimonials': '전문가 후기 & 평점',
    'footer.contact': '문의 전화:',
    'footer.email': '이메일:',
    'footer.addressLabel': '상담소 주소:',
    'footer.addressValue': '베트남 하노이 타잉쑤언구 응우옌짜이 72 로얄시티 R2B 2219호',
    'footer.copyright': '© {year} 톤 대사 자미두수. 천년 주역과 정통 비전의 계승 — 타고난 운명을 밝히고 형통한 삶을 열어갑니다.',
    'footer.admin': '[관리자 포털]',
  },
};

// Cung name mapping
export const CUNG_NAME_MAP: Record<string, Record<Language, string>> = {
  'Mệnh': { vi: 'Mệnh', en: 'Life (Destiny)', zh: '命宫', ko: '명궁' },
  'Phụ Mẫu': { vi: 'Phụ Mẫu', en: 'Parents', zh: '父母宫', ko: '부모궁' },
  'Phúc Đức': { vi: 'Phúc Đức', en: 'Karma & Spirit', zh: '福德宫', ko: '복덕궁' },
  'Điền Trạch': { vi: 'Điền Trạch', en: 'Property', zh: '田宅宫', ko: '전택궁' },
  'Quan Lộc': { vi: 'Quan Lộc', en: 'Career', zh: '官禄宫', ko: '관록궁' },
  'Nô Bộc': { vi: 'Nô Bộc', en: 'Friends', zh: '奴仆宫', ko: '노복궁' },
  'Thiên Di': { vi: 'Thiên Di', en: 'Travel', zh: '迁移宫', ko: '천이궁' },
  'Tật Ách': { vi: 'Tật Ách', en: 'Health', zh: '疾厄宫', ko: '질액궁' },
  'Tài Bạch': { vi: 'Tài Bạch', en: 'Wealth', zh: '财帛宫', ko: '재백궁' },
  'Tử Tức': { vi: 'Tử Tức', en: 'Children', zh: '子女宫', ko: '자녀궁' },
  'Phu Thê': { vi: 'Phu Thê', en: 'Spouse', zh: '夫妻宫', ko: '부처궁' },
  'Thê Thiếp': { vi: 'Thê Thiếp', en: 'Spouse', zh: '夫妻宫', ko: '부처궁' },
  'Phu Quân': { vi: 'Phu Quân', en: 'Spouse', zh: '夫妻宫', ko: '부처궁' },
  'Huynh Đệ': { vi: 'Huynh Đệ', en: 'Siblings', zh: '兄弟宫', ko: '형제궁' },
  'Thân': { vi: 'Thân', en: 'Body', zh: '身宫', ko: '신궁' },
};

// Helper function to get text with variable replacement
export function getTranslation(key: string, lang: Language = 'vi', fallback?: string, variables?: Record<string, string | number>): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.vi;
  let text = dict[key] || TRANSLATIONS.vi[key] || fallback || key;
  if (variables) {
    Object.entries(variables).forEach(([k, v]) => {
      text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
    });
  }
  return text;
}

// Helper to translate palace name
export function translateCungName(cungName: string, lang: Language = 'vi'): string {
  if (!cungName) return '';
  if (lang === 'vi') return cungName;
  const match = CUNG_NAME_MAP[cungName];
  if (match && match[lang]) return match[lang];

  const lower = cungName.toLowerCase().trim();
  if (lower.includes('thê') || lower.includes('phu')) {
    return CUNG_NAME_MAP['Phu Thê']?.[lang] || cungName;
  }
  if (lower.includes('mệnh') || lower.includes('menh')) {
    return CUNG_NAME_MAP['Mệnh']?.[lang] || cungName;
  }
  if (lower.includes('phụ mẫu') || lower.includes('phu mau')) {
    return CUNG_NAME_MAP['Phụ Mẫu']?.[lang] || cungName;
  }
  if (lower.includes('phúc') || lower.includes('phuc')) {
    return CUNG_NAME_MAP['Phúc Đức']?.[lang] || cungName;
  }
  if (lower.includes('điền') || lower.includes('dien')) {
    return CUNG_NAME_MAP['Điền Trạch']?.[lang] || cungName;
  }
  if (lower.includes('quan')) {
    return CUNG_NAME_MAP['Quan Lộc']?.[lang] || cungName;
  }
  if (lower.includes('nô') || lower.includes('no')) {
    return CUNG_NAME_MAP['Nô Bộc']?.[lang] || cungName;
  }
  if (lower.includes('di')) {
    return CUNG_NAME_MAP['Thiên Di']?.[lang] || cungName;
  }
  if (lower.includes('tật') || lower.includes('tat')) {
    return CUNG_NAME_MAP['Tật Ách']?.[lang] || cungName;
  }
  if (lower.includes('tài') || lower.includes('tai')) {
    return CUNG_NAME_MAP['Tài Bạch']?.[lang] || cungName;
  }
  if (lower.includes('tử') || lower.includes('tu')) {
    return CUNG_NAME_MAP['Tử Tức']?.[lang] || cungName;
  }
  if (lower.includes('huynh')) {
    return CUNG_NAME_MAP['Huynh Đệ']?.[lang] || cungName;
  }
  if (lower.includes('thân') || lower.includes('than')) {
    return CUNG_NAME_MAP['Thân']?.[lang] || cungName;
  }

  return cungName;
}

// Hour mapping
export const GIO_NAME_MAP: Record<string, Record<Language, string>> = {
  '0_0': { vi: 'Tý (00h-01h)', en: 'Rat (Zi: 00:00 - 01:00)', zh: '早子时 (00:00 - 01:00)', ko: '자시 (00:00 - 01:00)' },
  '1': { vi: 'Sửu (01h-03h)', en: 'Ox (Chou: 01:00 - 03:00)', zh: '丑时 (01:00 - 03:00)', ko: '축시 (01:00 - 03:00)' },
  '2': { vi: 'Dần (03h-05h)', en: 'Tiger (Yin: 03:00 - 05:00)', zh: '寅时 (03:00 - 05:00)', ko: '인시 (03:00 - 05:00)' },
  '3': { vi: 'Mão (05h-07h)', en: 'Rabbit (Mao: 05:00 - 07:00)', zh: '卯时 (05:00 - 07:00)', ko: '묘시 (05:00 - 07:00)' },
  '4': { vi: 'Thìn (07h-09h)', en: 'Dragon (Chen: 07:00 - 09:00)', zh: '辰时 (07:00 - 09:00)', ko: '진시 (07:00 - 09:00)' },
  '5': { vi: 'Tỵ (09h-11h)', en: 'Snake (Si: 09:00 - 11:00)', zh: '巳时 (09:00 - 11:00)', ko: '사시 (09:00 - 11:00)' },
  '6': { vi: 'Ngọ (11h-13h)', en: 'Horse (Wu: 11:00 - 13:00)', zh: '午时 (11:00 - 13:00)', ko: '오시 (11:00 - 13:00)' },
  '7': { vi: 'Mùi (13h-15h)', en: 'Goat (Wei: 13:00 - 15:00)', zh: '未时 (13:00 - 15:00)', ko: '미시 (13:00 - 15:00)' },
  '8': { vi: 'Thân (15h-17h)', en: 'Monkey (Shen: 15:00 - 17:00)', zh: '申时 (15:00 - 17:00)', ko: '신시 (15:00 - 17:00)' },
  '9': { vi: 'Dậu (17h-19h)', en: 'Rooster (You: 17:00 - 19:00)', zh: '酉时 (17:00 - 19:00)', ko: '유시 (17:00 - 19:00)' },
  '10': { vi: 'Tuất (19h-21h)', en: 'Dog (Xu: 19:00 - 21:00)', zh: '戌时 (19:00 - 21:00)', ko: '술시 (19:00 - 21:00)' },
  '11': { vi: 'Hợi (21h-23h)', en: 'Pig (Hai: 21:00 - 23:00)', zh: '亥时 (21:00 - 23:00)', ko: '해시 (21:00 - 23:00)' },
  '0_23': { vi: 'Tý Dạ (23h-24h)', en: 'Late Rat (23:00 - 24:00)', zh: '夜子时 (23:00 - 24:00)', ko: '야자시 (23:00 - 24:00)' },
};

export function translateHourLabel(key: string, lang: Language = 'vi', defaultLabel?: string): string {
  const match = GIO_NAME_MAP[key];
  if (match && match[lang]) return match[lang];
  return defaultLabel || key;
}

// Âm Dương
export const AM_DUONG_MAP: Record<string, Record<Language, string>> = {
  'Âm Nam': { vi: 'Âm Nam', en: 'Yin Male', zh: '阴男', ko: '음남(陰男)' },
  'Dương Nam': { vi: 'Dương Nam', en: 'Yang Male', zh: '阳男', ko: '양남(陽男)' },
  'Âm Nữ': { vi: 'Âm Nữ', en: 'Yin Female', zh: '阴女', ko: '음녀(陰女)' },
  'Dương Nữ': { vi: 'Dương Nữ', en: 'Yang Female', zh: '阳女', ko: '양녀(陽女)' },
};

export const THUAN_NGHICH_MAP: Record<string, Record<Language, string>> = {
  'Âm Dương thuận lý': { vi: 'Âm Dương thuận lý', en: 'Yin-Yang Harmony', zh: '阴阳顺理', ko: '음양 순리(順理)' },
  'Âm Dương nghịch lý': { vi: 'Âm Dương nghịch lý', en: 'Yin-Yang Conflict', zh: '阴阳逆理', ko: '음양 역리(逆理)' },
};

export const SINH_KHAC_MAP: Record<string, Record<Language, string>> = {
  'Cục sinh Mệnh': { vi: 'Cục sinh Mệnh', en: 'Bureau generates Life', zh: '局生命', ko: '국생명(局生命)' },
  'Mệnh sinh Cục': { vi: 'Mệnh sinh Cục', en: 'Life generates Bureau', zh: '命生局', ko: '명생국(命生局)' },
  'Mệnh Cục tị hòa': { vi: 'Mệnh Cục tị hòa', en: 'Life & Bureau in Harmony', zh: '命局比和', ko: '명국비화(命局比和)' },
  'Cục khắc Mệnh': { vi: 'Cục khắc Mệnh', en: 'Bureau overcomes Life', zh: '局克命', ko: '국극명(局剋命)' },
  'Mệnh khắc Cục': { vi: 'Mệnh khắc Cục', en: 'Life overcomes Bureau', zh: '命克局', ko: '명극국(命剋局)' },
};

export const TEN_CUC_MAP: Record<string, Record<Language, string>> = {
  'Thủy Nhị Cục': { vi: 'Thủy Nhị Cục', en: 'Water 2nd Bureau', zh: '水二局', ko: '수이국(水二局)' },
  'Mộc Tam Cục': { vi: 'Mộc Tam Cục', en: 'Wood 3rd Bureau', zh: '木三局', ko: '목삼국(木三局)' },
  'Kim Tứ Cục': { vi: 'Kim Tứ Cục', en: 'Metal 4th Bureau', zh: '金四局', ko: '금사국(金四局)' },
  'Thổ Ngũ Cục': { vi: 'Thổ Ngũ Cục', en: 'Earth 5th Bureau', zh: '土五局', ko: '토오국(土五局)' },
  'Hỏa Lục Cục': { vi: 'Hỏa Lục Cục', en: 'Fire 6th Bureau', zh: '火六局', ko: '화육국(火六局)' },
};

export const THAN_CU_MAP: Record<string, Record<Language, string>> = {
  'Thân cư Mệnh': { vi: 'Thân cư Mệnh', en: 'Body in Life', zh: '身居本命', ko: '신거명궁(身居命宮)' },
  'Thân cư Phúc': { vi: 'Thân cư Phúc', en: 'Body in Karma', zh: '身居福德', ko: '신거복덕(身居福德)' },
  'Thân cư Quan': { vi: 'Thân cư Quan', en: 'Body in Career', zh: '身居官禄', ko: '신거관록(身居官祿)' },
  'Thân cư Tài': { vi: 'Thân cư Tài', en: 'Body in Wealth', zh: '身居财帛', ko: '신거재백(身居財帛)' },
  'Thân cư Di': { vi: 'Thân cư Di', en: 'Body in Travel', zh: '身居迁移', ko: '신거천이(身居遷移)' },
  'Thân cư Thê': { vi: 'Thân cư Thê', en: 'Body in Spouse', zh: '身居夫妻', ko: '신거부처(身居夫妻)' },
  'Thân cư Phu': { vi: 'Thân cư Phu', en: 'Body in Spouse', zh: '身居夫妻', ko: '신거부처(身居夫妻)' },
};

export const STAR_NAME_MAP: Record<string, Record<Language, string>> = {
  'Tử Vi': { vi: 'Tử Vi', en: 'Zi Wei (Emperor)', zh: '紫微', ko: '자미(紫微)' },
  'Thiên Cơ': { vi: 'Thiên Cơ', en: 'Tian Ji (Strategist)', zh: '天机', ko: '천기(天機)' },
  'Thái Dương': { vi: 'Thái Dương', en: 'Tai Yang (Sun)', zh: '太阳', ko: '태양(太陽)' },
  'Vũ Khúc': { vi: 'Vũ Khúc', en: 'Wu Qu (Finance)', zh: '武曲', ko: '무곡(武曲)' },
  'Thiên Đồng': { vi: 'Thiên Đồng', en: 'Tian Tong (Fortunate)', zh: '天同', ko: '천동(天同)' },
  'Liêm Trinh': { vi: 'Liêm Trinh', en: 'Lian Zhen (Purity)', zh: '廉贞', ko: '염정(廉貞)' },
  'Thiên Phủ': { vi: 'Thiên Phủ', en: 'Tian Fu (Treasury)', zh: '天府', ko: '천부(天府)' },
  'Thái Âm': { vi: 'Thái Âm', en: 'Tai Yin (Moon)', zh: '太阴', ko: '태음(太陰)' },
  'Tham Lang': { vi: 'Tham Lang', en: 'Tan Lang (Desire)', zh: '贪狼', ko: '탐랑(貪狼)' },
  'Cự Môn': { vi: 'Cự Môn', en: 'Ju Men (Advocate)', zh: '巨门', ko: '거문(巨門)' },
  'Thiên Tướng': { vi: 'Thiên Tướng', en: 'Tian Xiang (Minister)', zh: '天相', ko: '천상(天相)' },
  'Thiên Lương': { vi: 'Thiên Lương', en: 'Tian Liang (Elder)', zh: '天梁', ko: '천량(天梁)' },
  'Thất Sát': { vi: 'Thất Sát', en: 'Qi Sha (Marshal)', zh: '七杀', ko: '칠살(七殺)' },
  'Phá Quân': { vi: 'Phá Quân', en: 'Po Jun (Pioneer)', zh: '破军', ko: '파군(破軍)' },
  'Văn Xương': { vi: 'Văn Xương', en: 'Wen Chang', zh: '文昌', ko: '문창(文昌)' },
  'Văn Khúc': { vi: 'Văn Khúc', en: 'Wen Qu', zh: '文曲', ko: '문곡(文曲)' },
  'Lộc Tồn': { vi: 'Lộc Tồn', en: 'Lu Cun', zh: '禄存', ko: '록존(祿存)' },
  'Hỏa Tinh': { vi: 'Hỏa Tinh', en: 'Huo Xing', zh: '火星', ko: '화성(火星)' },
  'Linh Tinh': { vi: 'Linh Tinh', en: 'Ling Xing', zh: '铃星', ko: '영성(鈴星)' },
};

export const NAP_AM_MAP: Record<string, Record<Language, string>> = {
  'Hải Trung Kim': { vi: 'Hải Trung Kim', en: 'Sea Metal', zh: '海中金', ko: '해중금(海中金)' },
  'Lư Trung Hỏa': { vi: 'Lư Trung Hỏa', en: 'Furnace Fire', zh: '炉中火', ko: '노중화(爐中火)' },
  'Đại Lâm Mộc': { vi: 'Đại Lâm Mộc', en: 'Forest Wood', zh: '大林木', ko: '대림목(大林木)' },
  'Lộ Bàng Thổ': { vi: 'Lộ Bàng Thổ', en: 'Roadside Earth', zh: '路旁土', ko: '노방토(路傍土)' },
  'Kiếm Phong Kim': { vi: 'Kiếm Phong Kim', en: 'Sword Metal', zh: '剑锋金', ko: '검봉금(劍鋒金)' },
  'Sơn Đầu Hỏa': { vi: 'Sơn Đầu Hỏa', en: 'Mountain Peak Fire', zh: '山头火', ko: '산두화(山頭火)' },
  'Giản Hạ Thủy': { vi: 'Giản Hạ Thủy', en: 'Stream Water', zh: '涧下水', ko: '간하수(澗下水)' },
  'Thành Đầu Thổ': { vi: 'Thành Đầu Thổ', en: 'City Wall Earth', zh: '城头土', ko: '성두토(城頭土)' },
  'Bạch Lạp Kim': { vi: 'Bạch Lạp Kim', en: 'White Wax Metal', zh: '白蜡金', ko: '백납금(白蠟金)' },
  'Dương Liễu Mộc': { vi: 'Dương Liễu Mộc', en: 'Willow Wood', zh: '杨柳木', ko: '양류목(楊柳木)' },
  'Tuyền Trung Thủy': { vi: 'Tuyền Trung Thủy', en: 'Spring Water', zh: '泉中水', ko: '천중수(泉中水)' },
  'Ốc Thượng Thổ': { vi: 'Ốc Thượng Thổ', en: 'Rooftop Earth', zh: '屋上土', ko: '옥상토(屋上土)' },
  'Tích Lịch Hỏa': { vi: 'Tích Lịch Hỏa', en: 'Thunderbolt Fire', zh: '霹雳火', ko: '적력화(霹靂火)' },
  'Tùng Bách Mộc': { vi: 'Tùng Bách Mộc', en: 'Pine Wood', zh: '松柏木', ko: '송백목(松柏木)' },
  'Trường Lưu Thủy': { vi: 'Trường Lưu Thủy', en: 'Long River Water', zh: '长流水', ko: '장류수(長流水)' },
  'Sa Trung Kim': { vi: 'Sa Trung Kim', en: 'Sand Metal', zh: '沙中金', ko: '사중금(沙中金)' },
  'Sơn Hạ Hỏa': { vi: 'Sơn Hạ Hỏa', en: 'Foot of Mountain Fire', zh: '山下火', ko: '산하화(山下火)' },
  'Bình Địa Mộc': { vi: 'Bình Địa Mộc', en: 'Flatland Wood', zh: '平地木', ko: '평지목(平地木)' },
  'Bích Thượng Thổ': { vi: 'Bích Thượng Thổ', en: 'Wall Earth', zh: '壁上土', ko: '벽상토(壁上土)' },
  'Kim Bạch Kim': { vi: 'Kim Bạch Kim', en: 'Gold Leaf Metal', zh: '金箔金', ko: '금박금(金箔金)' },
  'Phúc Đăng Hỏa': { vi: 'Phúc Đăng Hỏa', en: 'Covered Lamp Fire', zh: '覆灯火', ko: '복등화(覆燈火)' },
  'Thiên Hà Thủy': { vi: 'Thiên Hà Thủy', en: 'Heavenly River Water', zh: '天河水', ko: '천하수(天河水)' },
  'Đại Trạch Thổ': { vi: 'Đại Trạch Thổ', en: 'Great Marsh Earth', zh: '大驿土', ko: '대택토(大驛土)' },
  'Thoa Xuyến Kim': { vi: 'Thoa Xuyến Kim', en: 'Hairpin Metal', zh: '钗钏金', ko: '차천금(釵釧金)' },
  'Tang Đố Mộc': { vi: 'Tang Đố Mộc', en: 'Mulberry Wood', zh: '桑柘木', ko: '상자목(桑柘木)' },
  'Đại Khê Thủy': { vi: 'Đại Khê Thủy', en: 'Great Stream Water', zh: '大溪水', ko: '대계수(大溪水)' },
  'Sa Trung Thổ': { vi: 'Sa Trung Thổ', en: 'Sand Earth', zh: '沙中土', ko: '사중토(沙中土)' },
  'Thiên Thượng Hỏa': { vi: 'Thiên Thượng Hỏa', en: 'Heavenly Sun Fire', zh: '天上火', ko: '천상화(天上火)' },
  'Thạch Lựu Mộc': { vi: 'Thạch Lựu Mộc', en: 'Pomegranate Wood', zh: '石榴木', ko: '석류목(石榴木)' },
  'Đại Hải Thủy': { vi: 'Đại Hải Thủy', en: 'Ocean Water', zh: '大海水', ko: '대해수(大海水)' },
};

export const CAN_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Giáp': { vi: 'Giáp', en: 'Jia', zh: '甲', ko: '갑' },
  'Ất': { vi: 'Ất', en: 'Yi', zh: '乙', ko: '을' },
  'Bính': { vi: 'Bính', en: 'Bing', zh: '丙', ko: '병' },
  'Đinh': { vi: 'Đinh', en: 'Ding', zh: '丁', ko: '정' },
  'Mậu': { vi: 'Mậu', en: 'Wu', zh: '戊', ko: '무' },
  'Kỷ': { vi: 'Kỷ', en: 'Ji', zh: '己', ko: '기' },
  'Canh': { vi: 'Canh', en: 'Geng', zh: '庚', ko: '경' },
  'Tân': { vi: 'Tân', en: 'Xin', zh: '辛', ko: '신' },
  'Nhâm': { vi: 'Nhâm', en: 'Ren', zh: '壬', ko: '임' },
  'Quý': { vi: 'Quý', en: 'Gui', zh: '癸', ko: '계' },
};

export const CHI_TRANSLATIONS: Record<string, Record<Language, string>> = {
  'Tý': { vi: 'Tý', en: 'Zi', zh: '子', ko: '자' },
  'Sửu': { vi: 'Sửu', en: 'Chou', zh: '丑', ko: '축' },
  'Dần': { vi: 'Dần', en: 'Yin', zh: '寅', ko: '인' },
  'Mão': { vi: 'Mão', en: 'Mao', zh: '卯', ko: '묘' },
  'Thìn': { vi: 'Thìn', en: 'Chen', zh: '辰', ko: '진' },
  'Tỵ': { vi: 'Tỵ', en: 'Si', zh: '巳', ko: '사' },
  'Ngọ': { vi: 'Ngọ', en: 'Wu', zh: '午', ko: '오' },
  'Mùi': { vi: 'Mùi', en: 'Wei', zh: '未', ko: '미' },
  'Thân': { vi: 'Thân', en: 'Shen', zh: '申', ko: '신' },
  'Dậu': { vi: 'Dậu', en: 'You', zh: '酉', ko: '유' },
  'Tuất': { vi: 'Tuất', en: 'Xu', zh: '戌', ko: '술' },
  'Hợi': { vi: 'Hợi', en: 'Hai', zh: '亥', ko: '해' },
};

export function translateCanChi(canChi?: string, lang: Language = 'vi'): string {
  if (!canChi) return '';
  if (lang === 'vi') return canChi;
  const parts = canChi.trim().split(/\s+/);
  if (parts.length === 2) {
    const [can, chi] = parts;
    const canTrans = CAN_TRANSLATIONS[can]?.[lang];
    const chiTrans = CHI_TRANSLATIONS[chi]?.[lang];
    if (canTrans && chiTrans) {
      if (lang === 'zh') return `${canTrans}${chiTrans}`;
      if (lang === 'ko') return `${canTrans}${chiTrans}(${CAN_TRANSLATIONS[can]?.zh}${CHI_TRANSLATIONS[chi]?.zh})`;
      if (lang === 'en') return `${canTrans} ${chiTrans}`;
    }
  }
  return canChi;
}

export function translateNapAm(napAm?: string, lang: Language = 'vi'): string {
  if (!napAm) return '';
  if (lang === 'vi') return napAm;
  const match = NAP_AM_MAP[napAm];
  if (match && match[lang]) return match[lang];
  return napAm;
}

export function translateTenCuc(tenCuc?: string, lang: Language = 'vi'): string {
  if (!tenCuc) return '';
  if (lang === 'vi') return tenCuc;
  const match = TEN_CUC_MAP[tenCuc];
  if (match && match[lang]) return match[lang];
  return tenCuc;
}

export function translateSinhKhac(sinhKhac?: string, lang: Language = 'vi'): string {
  if (!sinhKhac) return '';
  if (lang === 'vi') return sinhKhac;
  const match = SINH_KHAC_MAP[sinhKhac];
  if (match && match[lang]) return match[lang];
  return sinhKhac;
}

export function translateThanCu(thanCu?: string, lang: Language = 'vi'): string {
  if (!thanCu) return '';
  if (lang === 'vi') return thanCu;
  const match = THAN_CU_MAP[thanCu];
  if (match && match[lang]) return match[lang];
  return thanCu;
}

export function translateAmDuong(amDuong?: string, lang: Language = 'vi'): string {
  if (!amDuong) return '';
  if (lang === 'vi') return amDuong;
  const match = AM_DUONG_MAP[amDuong];
  if (match && match[lang]) return match[lang];
  return amDuong;
}

export function translateThuanNghich(thuanNghich?: string, lang: Language = 'vi'): string {
  if (!thuanNghich) return '';
  if (lang === 'vi') return thuanNghich;
  const match = THUAN_NGHICH_MAP[thuanNghich];
  if (match && match[lang]) return match[lang];
  return thuanNghich;
}

export function translateStarName(starName?: string, lang: Language = 'vi'): string {
  if (!starName) return '';
  if (lang === 'vi') return starName;
  const match = STAR_NAME_MAP[starName];
  if (match && match[lang]) return match[lang];
  return starName;
}
