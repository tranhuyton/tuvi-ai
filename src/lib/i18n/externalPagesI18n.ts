import type { Language } from './translations';
import type { FunnelPageData, FunnelFaq } from '@/lib/funnelPages';
import type { SeoArticle, FunnelStage } from '@/lib/seoArticles';
import type { CourseLesson, CourseModule } from '@/lib/courseData';
import { translateFunnelPageTitle } from './homeFunnelData';

export interface ExternalPageUiStrings {
  brandName: string;
  homeChart: string;
  fengShui: string;
  ziWeiKnowledge: string;
  guideLibrary: string;
  freeChartBtn: string;
  freeChartZeroBtn: string;
  book1on1Short: string;
  badge2Standard: string;
  authorLine: string;
  authorBioLine: string;
  viewProfileLink: string;
  backToChartLink: string;
  quickSummaryLabel: string;
  trReadyPrompt: string;
  trBackToUnlockBtn: string;
  faqHeading: string;
  locationNote: string;
  hotlineNote: string;
  dirHeading: string;
  dirBackHome: string;
  dirBranch1: string;
  dirBranch2: string;
  dirBranch3: string;
  dirHomeItem: string;
  disclaimer: string;
  // /bai-viet index strings
  libHeroBadge: string;
  libHeroTitle: string;
  libHeroDescHtml: string;
  libHeroCta: string;
  libPagesCount: string;
  libCat1: string;
  libCat2: string;
  libCat3: string;
  libViewDetail: string;
  libExtendedHeading: string;
  libReadMore: string;
  libBottomTitle: string;
  libBottomDescHtml: string;
  libTier1Html: string;
  libTier2Html: string;
  libTier3Html: string;
  libBookZaloBtn: string;
  // /bai-viet/[slug] detail strings
  artUpdatedLabel: string;
  artAuthorLabel: string;
  artVerifiedBadge: string;
  artGeoTitle: string;
  artKeyTakeawaysLabel: string;
  artMidBannerBadge: string;
  artFaqTitle: string;
  artBottomBadge: string;
  artBottomTitle: string;
  artBottomDescHtml: string;
  artNextArticlesTitle: string;
  artViewAll10: string;
  artBackToLibrary: string;
  // KnowledgeFunnelSection on Homepage
  kfBadge: string;
  kfTitle: string;
  kfDesc: string;
  kfViewAllBtn: string;
  // MetaphysicalIllustration strings
  illHeaderBadge: string;
  illCenterFocus: string;
  // CoursePlayerClient (/khoa-hoc) strings
  courseNavSub: string;
  courseUnlockBtn: string;
  courseAdminBadge: string;
  courseTesterBadge: string;
  courseStudentBadge: string;
  courseHeroBadge1: string;
  courseHeroUnlockedBadge: string;
  courseHeroAutoBadge: string;
  courseInstructorTitle: string;
  courseInstructorSub: string;
  courseNextGenBadge: string;
  courseNextGenDescHtml: string;
  coursePill1: string;
  coursePill2: string;
  coursePill3: string;
  courseStat1Title: string;
  courseStat1Sub: string;
  courseStat2Title: string;
  courseStat2Sub: string;
  courseStat3Title: string;
  courseStat3Sub: string;
  courseStat4Title: string;
  courseStat4Sub: string;
  courseUnlockedTitle: string;
  courseLifetimeTitle: string;
  courseProgressLabel: string;
  courseTuitionLabel: string;
  courseSave53: string;
  courseBullet1Html: string;
  courseBullet2Html: string;
  courseBullet3Html: string;
  courseQrBtn: string;
  courseRestoreLink: string;
  courseRestoreLabel: string;
  courseRestorePlaceholder: string;
  courseRestoreBtn: string;
  courseMapHeading: string;
  courseMapReset: string;
  courseSidebarTitle: string;
  courseSidebarUnlocked: string;
  courseSidebarPreview: string;
  courseSearchPlaceholder: string;
  courseFilterAll: string;
  courseFilterModule: string;
  courseLessonPrefix: string;
  courseDoneBadge: string;
  coursePreviewBadge: string;
  courseFreePreviewLesson: string;
  courseMarkDone: string;
  courseMarkedDone: string;
  courseIllStarsLabel: string;
  courseIllInstructor: string;
  courseIllSub: string;
  courseLockedBadge: string;
  courseLockedTitle: string;
  courseLockedDescHtml: string;
  courseLockedSummaryLabel: string;
  courseLockedElementsLabel: string;
  courseLockedChaptersLabel: string;
  courseLockedQrBtn: string;
  courseLockedPreviewBtn: string;
  coursePlayerTitle: string;
  coursePartLabel: string;
  courseChapterLabel: string;
  courseTranscriptLabel: string;
  courseStarMatchTitle: string;
  courseStarMatchYou: string;
  courseChangeChart: string;
  courseCreateChartToMatch: string;
  courseStarLabel: string;
  coursePalaceLabel: string;
  courseStatusLabel: string;
  courseMajorAux: string;
  courseCoStarsLabel: string;
  courseNoChartHint1: string;
  courseNoChartHint2: string;
  courseFlashcardTitle: string;
  courseFcElements: string;
  courseFcDomain: string;
  courseFcBrightness: string;
  courseFcClassicVerse: string;
  courseNotesLabel: string;
  courseNotesSaved: string;
  courseNotesPlaceholder: string;
  coursePrevLesson: string;
  courseNextLesson: string;
  courseMiniUnlockBtn: string;
  courseAuthNotice: string;
}

export const EXTERNAL_PAGE_UI: Record<Language, ExternalPageUiStrings> = {
  vi: {
    brandName: 'TỬ VI & PHONG THỦY THẦY TÔN',
    homeChart: 'Trang chủ Lập Lá Số',
    fengShui: 'Phong Thủy',
    ziWeiKnowledge: 'Kiến Thức Tử Vi',
    guideLibrary: 'Cẩm Nang Tử Vi',
    freeChartBtn: 'Lập Lá Số Miễn Phí',
    freeChartZeroBtn: 'Lập Lá Số Miễn Phí (0đ)',
    book1on1Short: 'Đặt Lịch 1-1: 0935 058 688',
    badge2Standard: 'Chuẩn Tử Vi Đẩu Số & Phong Thủy Thực Chiến',
    authorLine: 'Biên soạn và thẩm định chuyên môn: Thầy Tôn - Chuyên gia Tử Vi Đẩu Số và Phong Thủy | Cập nhật: 24/10/2026',
    authorBioLine:
      'Cựu HS Chuyên Toán - Tin ĐH Tổng hợp Hà Nội • Cử nhân & Thạc sỹ Tài chính & Kế toán ĐH Lancaster (UK) • Hơn 15 năm giảng dạy IELTS & Cambridge IGCSE',
    viewProfileLink: 'Xem hồ sơ Thầy Tôn →',
    backToChartLink: '← Quay về Lập Lá Số',
    quickSummaryLabel: 'Tóm tắt nhanh',
    trReadyPrompt: 'Đã tìm hiểu rõ nền tảng của Thầy Tôn? Bắt đầu với lá số của bạn ngay:',
    trBackToUnlockBtn: 'Quay Về Lập Lá Số & Mở Khóa Bản Luận Giải',
    faqHeading: 'Câu hỏi thường gặp',
    locationNote: 'Khu vực tham vấn: Khu đô thị Royal City, Thanh Xuân, Hà Nội (Đặt lịch hẹn trước qua Zalo)',
    hotlineNote: 'Hotline / Zalo đặt lịch: 0935 058 688',
    dirHeading: 'Hệ Thống Chuyên Đề Tử Vi & Phong Thủy Thầy Tôn',
    dirBackHome: 'Về Trang Chủ Lập Lá Số Miễn Phí →',
    dirBranch1: 'Luận Mệnh & Tham Vấn • Ấn Phẩm Chuyên Sâu',
    dirBranch2: 'Phong Thủy & Trạch Nhật • Địa Lợi Cải Vận',
    dirBranch3: 'Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số',
    dirHomeItem: 'Lập Lá Số Tử Vi Miễn Phí (Trang chủ)',
    disclaimer:
      'Miễn trừ trách nhiệm: Toàn bộ nội dung luận giải Tử Vi, Tướng Pháp, Phong Thủy và Hỏi đáp AI trên hệ thống mang tính chất nghiên cứu văn hóa Á Đông, chiêm nghiệm tâm lý và định hướng tham khảo — hoàn toàn không phải bói toán mê tín dị đoan và không thay thế cho tư vấn y tế, pháp lý hay tài chính chuyên ngành. Mọi quyết định thực tế thuộc quyền tự chủ của quý độc giả.',
    libHeroBadge: 'Hệ Sinh Thái 38 Chuyên Đề • Tử Vi Đẩu Số & Phong Thủy',
    libHeroTitle: 'CẨM NANG TỬ VI ĐẨU SỐ & PHONG THỦY THEO LÁ SỐ CÙNG THẦY TÔN',
    libHeroDescHtml:
      'Biên soạn và thẩm định chuyên môn bởi <strong class="text-amber-300">Thầy Tôn</strong> — Chuyên gia Tử Vi Đẩu Số và Phong Thủy với hơn 18 năm nghiên cứu, Cựu HS Chuyên Toán - Tin ĐH Tổng hợp Hà Nội, Cử nhân & Thạc sỹ Tài chính & Kế toán ĐH Lancaster (UK) và hơn 15 năm giảng dạy IELTS, Giao tiếp & Cambridge IGCSE.',
    libHeroCta: 'Lập Lá Số & Nhận Bình Giải Miễn Phí (0đ)',
    libPagesCount: '{count} trang chuyên đề',
    libCat1: 'Ấn Phẩm & Tham Vấn Mệnh Lý',
    libCat2: 'Phong Thủy & Trạch Nhật',
    libCat3: 'Tinh Hoa Tử Vi Đẩu Số',
    libViewDetail: 'Xem chi tiết chuyên đề',
    libExtendedHeading: 'CHUYÊN KHẢO MỞ RỘNG & ĐỐI CHIẾU THỰC CHỨNG',
    libReadMore: 'Đọc thêm',
    libBottomTitle: 'Bước Tiếp Theo Với Lá Số Của Bạn: Chọn Đúng Mức Luận Giải',
    libBottomDescHtml:
      'Bắt đầu bằng <strong class="text-emerald-300">Bản Khởi Nguyên Miễn Phí (0đ)</strong> để nắm tổng quan; khi đứng trước quyết định trong năm, mở khóa <strong class="text-amber-300">Bản Chuyên Sâu Pro (119.000đ)</strong> hoặc <strong class="text-purple-300">Bản Chuyên Gia Expert (269.000đ)</strong> — nâng cấp chỉ trả phần chênh lệch (150.000đ).',
    libTier1Html: '<strong class="text-emerald-300">Bản Khởi Nguyên (0đ):</strong> An hơn 110 sao & bình giải ~1.000 từ.',
    libTier2Html: '<strong class="text-amber-300">Bản Pro (119.000đ):</strong> ~2.500 từ, 4 mùa + Tặng 2 câu hỏi Chuyên Sâu.',
    libTier3Html: '<strong class="text-purple-300">Bản Expert (269.000đ):</strong> ~4.500-6.000 từ, 12 cung & 12 tháng âm lịch.',
    libBookZaloBtn: 'Đặt Lịch Xem 1-1 Với Thầy Tôn (Zalo 0935 058 688)',
    artUpdatedLabel: 'Cập nhật:',
    artAuthorLabel: 'Biên soạn & Kiểm duyệt:',
    artVerifiedBadge: '✔ Đã kiểm chứng học thuật',
    artGeoTitle: 'Tóm Tắt Cốt Lõi Từ Chuyên Gia (Trích Dẫn Nhanh):',
    artKeyTakeawaysLabel: 'Điểm nhấn quan trọng cần nhớ:',
    artMidBannerBadge: '⚡ Công Cụ Thực Chứng Ngay Trên Lá Số Của Bạn',
    artFaqTitle: 'Câu Hỏi Thường Gặp Về Chủ Đề Này',
    artBottomBadge: 'Bắt Đầu Hành Trình Thấu Hiểu Bản Mệnh',
    artBottomTitle: 'Đừng Chỉ Đọc Lý Thuyết — Hãy Soi Chiếu Trực Tiếp Trên Lá Số Của Chính Bạn!',
    artBottomDescHtml:
      'Nhập Ngày tháng năm sinh & Giờ sinh tại trang chủ <strong class="text-amber-300">Tử Vi Thầy Tôn</strong> để nhận ngay <strong class="text-emerald-300">Bản Bình Giải Khởi Nguyên Miễn Phí (0đ)</strong>, hoặc trải nghiệm <strong class="text-amber-300">Bản VIP Pro (119k)</strong> & <strong class="text-purple-300">Bản Chuyên Gia 12 Cung (269k)</strong> kết hợp Xem Mặt & Chỉ Tay.',
    artNextArticlesTitle: 'Bài Viết Tiếp Theo Trong Lộ Trình Giải Mã Vận Mệnh',
    artViewAll10: 'Xem tất cả 10 chuyên khảo',
    artBackToLibrary: 'Quay lại danh mục Cẩm Nang Tử Vi & Tướng Pháp',
    kfBadge: 'Cẩm Nang Tử Vi, Diện Tướng & Chỉ Tay Thực Chứng',
    kfTitle: 'Thư Viện Chuyên Khảo Từ Thầy Tôn',
    kfDesc:
      'Hệ thống bài viết chuyên sâu giải mã Tử Vi Đẩu Số, Bát Bộ Thần Sát, Diện Tướng & Thủ Tướng dưới lăng kính khoa học thực chứng — giúp bạn thấu hiểu lá số từ căn bản đến nâng cao.',
    kfViewAllBtn: 'Xem Toàn Bộ Cẩm Nang (10 Bài)',
    illHeaderBadge: 'Sơ Đồ Minh Họa Chuyên Đề • Thầy Tôn',
    illCenterFocus: 'Trọng Tâm',
    courseNavSub: '🎓 Học Viện Tử Vi Thực Chiến',
    courseUnlockBtn: 'Mở Khóa 699.000đ',
    courseAdminBadge: 'Quản Trị Viên (Thầy Tôn)',
    courseTesterBadge: 'Tài Khoản Tester VIP',
    courseStudentBadge: 'Học Viên Chính Thức ({code})',
    courseHeroBadge1: 'Podcast Audio + Giáo Trình Tương Tác',
    courseHeroUnlockedBadge: 'Đã mở trọn bộ 24 bài giảng • Học trọn đời',
    courseHeroAutoBadge: 'Mở khóa tự động 24/7 ngay khi quét QR',
    courseInstructorTitle: 'Thầy Tôn giảng dạy',
    courseInstructorSub: '18+ năm nghiên cứu',
    courseNextGenBadge: 'Trải Nghiệm Học Tử Vi Thế Hệ Mới',
    courseNextGenDescHtml:
      'Hệ thống hóa trọn bộ <strong>14 Chính Tinh, Lục Cát, Lục Sát, Tứ Hóa, 4 Đại Cách Cục & Quy Trình 5 Bước Chấm Hạn Năm</strong> qua giọng giảng Podcast kết hợp giáo trình tương tác và công cụ <strong>Soi Sao Tự Động</strong> trên lá số của bạn.',
    coursePill1: '🎧 Nghe Podcast mọi lúc',
    coursePill2: '🃏 Flashcard 14 Chính Tinh',
    coursePill3: '🧭 Khớp thẳng lá số cá nhân',
    courseStat1Title: '24 Bài Giảng',
    courseStat1Sub: '4 Học phần thực chiến',
    courseStat2Title: 'Podcast + Web',
    courseStat2Sub: 'Vừa nghe vừa đọc mượt mà',
    courseStat3Title: 'Soi Lá Số Riêng',
    courseStat3Sub: 'Tự động tìm sao trên lá số',
    courseStat4Title: 'Đã học {done}/24',
    courseStat4Sub: 'Lưu tiến độ & ghi chú',
    courseUnlockedTitle: 'Đã Mở Khóa Trọn Bộ 24 Bài',
    courseLifetimeTitle: 'Quyền Truy Cập Trọn Đời',
    courseProgressLabel: 'Tiến độ hoàn thành:',
    courseTuitionLabel: 'Học phí trọn gói (1 lần):',
    courseSave53: 'Tiết kiệm 53%',
    courseBullet1Html: 'Mở khóa ngay lập tức toàn bộ <strong>24 tập Podcast & Chuyên khảo</strong>',
    courseBullet2Html: 'Tự động đối chiếu vị trí từng sao trên <strong>Lá số của chính bạn</strong>',
    courseBullet3Html: 'Học trọn đời trên cả Điện thoại & Máy tính, cập nhật bài mới miễn phí',
    courseQrBtn: 'Quét Mã QR Mở Khóa Ngay (699.000đ)',
    courseRestoreLink: 'Đã thanh toán trước đó? Nhập Mã đơn / Email để mở khóa →',
    courseRestoreLabel: 'Nhập Mã giao dịch (VD: TV12345) hoặc Email đã mua:',
    courseRestorePlaceholder: 'TVxxxxx hoặc email@...',
    courseRestoreBtn: 'Kích hoạt',
    courseMapHeading: 'Bản Đồ 4 Học Phần Thực Chiến (Nhấn Để Lọc Theo Học Phần)',
    courseMapReset: 'Xem lại tất cả 24 bài giảng →',
    courseSidebarTitle: 'Giáo Trình 24 Bài Học',
    courseSidebarUnlocked: 'Đã mở 24/24 bài',
    courseSidebarPreview: 'Học thử 2 bài đầu',
    courseSearchPlaceholder: 'Tìm nhanh sao: Tử Vi, Thái Âm, Hóa Kỵ...',
    courseFilterAll: 'Tất cả (24)',
    courseFilterModule: 'Phần {id}',
    courseLessonPrefix: 'Bài',
    courseDoneBadge: 'Đã học',
    coursePreviewBadge: 'Học thử',
    courseFreePreviewLesson: 'Bài học thử miễn phí',
    courseMarkDone: 'Đánh dấu đã học',
    courseMarkedDone: 'Đã học xong',
    courseIllStarsLabel: 'Chòm sao & Khái niệm trọng tâm trong bài giảng:',
    courseIllInstructor: 'Giảng viên: Thầy Tôn',
    courseIllSub: 'Podcast & Giáo trình thực chiến',
    courseLockedBadge: 'Nội dung dành riêng cho Học viên chính thức',
    courseLockedTitle: 'Mở Khóa Bài Giảng Podcast & Chuyên Khảo Này Chỉ Trong 3 Giây',
    courseLockedDescHtml:
      'Quét mã VietQR <strong>699.000đ</strong> để hệ thống tự động mở khóa ngay lập tức trọn bộ <strong>24 bài giảng Podcast + Giáo trình 14 Chính Tinh, Phụ Tinh, Cách Cục & Vận Hạn</strong> của Thầy Tôn.',
    courseLockedSummaryLabel: '✦ Tóm tắt nội dung có trong Bài {num}:',
    courseLockedElementsLabel: 'Ngũ hành & Hóa khí:',
    courseLockedChaptersLabel: 'Các chương Podcast ({dur}):',
    courseLockedQrBtn: 'Quét Mã QR Mở Khóa Trọn Bộ (699.000đ)',
    courseLockedPreviewBtn: 'Nghe Học Thử Bài 1 & Bài 2 Miễn Phí',
    coursePlayerTitle: 'Podcast Bài Giảng Thầy Tôn',
    coursePartLabel: 'Phần',
    courseChapterLabel: 'Chương',
    courseTranscriptLabel: 'Nội dung lời giảng Podcast',
    courseStarMatchTitle: 'Đối Chiếu Trực Tiếp Các Sao Trong Bài Học Lên Lá Số Của',
    courseStarMatchYou: 'Bạn',
    courseChangeChart: 'Đổi lá số khác →',
    courseCreateChartToMatch: 'Lập lá số của bạn để tự động đối chiếu →',
    courseStarLabel: 'Sao',
    coursePalaceLabel: 'Cung',
    courseStatusLabel: 'Trạng thái:',
    courseMajorAux: 'Phụ tinh trọng điểm',
    courseCoStarsLabel: 'Đồng cung với:',
    courseNoChartHint1: '💡 Khi bạn lập lá số miễn phí tại Trang chủ, hệ thống sẽ tự động tìm xem sao',
    courseNoChartHint2: 'đang đóng ở cung nào trên lá số của bạn ngay tại khung này!',
    courseFlashcardTitle: 'Flashcard Tóm Tắt Nhanh Tinh Đẩu & Khẩu Quyết',
    courseFcElements: 'Ngũ hành & Hóa khí:',
    courseFcDomain: 'Chủ sự trọng tâm:',
    courseFcBrightness: 'Vị trí Miếu / Vượng / Đắc / Hãm:',
    courseFcClassicVerse: 'Câu phú kinh điển & Nguyên tắc cốt lõi:',
    courseNotesLabel: 'Ghi chú cá nhân của bạn cho Bài {num}:',
    courseNotesSaved: '✓ Đã tự động lưu vào máy',
    courseNotesPlaceholder: 'Ghi lại những điểm nghiệm lý đúng với lá số của bạn hoặc người thân tại đây...',
    coursePrevLesson: '← Bài trước',
    courseNextLesson: 'Bài tiếp theo (Bài {num})',
    courseMiniUnlockBtn: 'Mở Khóa 24 Bài (699k)',
    courseAuthNotice:
      'Quý khách vui lòng tạo tài khoản hoặc đăng nhập (chỉ mất 5 giây) trước khi thanh toán để hệ thống gắn quyền truy cập trọn đời Khóa Học 24 Bài vào tài khoản của quý khách.',
  },
  en: {
    brandName: 'MASTER TON • ZI WEI & FENG SHUI',
    homeChart: 'Home Chart Caster',
    fengShui: 'Feng Shui',
    ziWeiKnowledge: 'Zi Wei Knowledge',
    guideLibrary: 'Zi Wei Library',
    freeChartBtn: 'Free Natal Chart',
    freeChartZeroBtn: 'Free Natal Chart (0 VND)',
    book1on1Short: 'Book 1-on-1: 0935 058 688',
    badge2Standard: 'Authentic Zi Wei Dou Shu & Practical Feng Shui',
    authorLine: 'Compiled & Academically Reviewed by: Master Ton - Zi Wei Dou Shu & Feng Shui Expert | Updated: Oct 24, 2026',
    authorBioLine:
      'Math & Informatics Alumnus, Hanoi University • BSc & MSc in Accounting & Finance, Lancaster University (UK) • 15+ Years Teaching IELTS & Cambridge IGCSE',
    viewProfileLink: 'View Master Ton’s Profile →',
    backToChartLink: '← Back to Chart Caster',
    quickSummaryLabel: 'Quick Summary',
    trReadyPrompt: 'Familiar with Master Ton’s academic background? Start with your personal chart now:',
    trBackToUnlockBtn: 'Back to Chart Caster & Unlock Deep Reading',
    faqHeading: 'Frequently Asked Questions',
    locationNote: 'Consultation Venue: Royal City Urban Area, Thanh Xuan, Hanoi (Prior appointment via Zalo required)',
    hotlineNote: 'Booking Hotline / Zalo: 0935 058 688',
    dirHeading: 'Master Ton’s Zi Wei Dou Shu & Feng Shui Knowledge Directory',
    dirBackHome: 'Back to Free Natal Chart Caster →',
    dirBranch1: 'Destiny Readings & Consultation • Deep Reports',
    dirBranch2: 'Feng Shui & Date Selection • Spatial Harmony',
    dirBranch3: 'Stars, Palaces & Transits • Zi Wei Mastery',
    dirHomeItem: 'Free Zi Wei Dou Shu Chart Caster (Homepage)',
    disclaimer:
      'Disclaimer: All Zi Wei Dou Shu, Physiognomy, Feng Shui, and AI Q&A content on this platform is intended for East Asian cultural research, psychological self-reflection, and strategic reference — strictly free of superstition and not a substitute for licensed medical, legal, or financial advice. All real-life decisions remain your sole responsibility.',
    libHeroBadge: '38-Topic Ecosystem • Zi Wei Dou Shu & Feng Shui',
    libHeroTitle: 'ZI WEI DOU SHU & CHART-BASED FENG SHUI HANDBOOK WITH MASTER TON',
    libHeroDescHtml:
      'Compiled and academically reviewed by <strong class="text-amber-300">Master Ton (Tran Huy Ton)</strong> — Zi Wei Dou Shu & Feng Shui Expert with 18+ years of research, Math & Informatics Alumnus (Hanoi University), Bachelor’s & Master’s Degrees in Accounting & Finance from Lancaster University (UK), and 15+ years teaching IELTS & Cambridge IGCSE.',
    libHeroCta: 'Cast Your Chart & Get Free Reading (0 VND)',
    libPagesCount: '{count} specialized guides',
    libCat1: 'Destiny Readings & Consultation',
    libCat2: 'Feng Shui & Auspicious Dates',
    libCat3: 'Zi Wei Dou Shu Essentials',
    libViewDetail: 'Read full guide',
    libExtendedHeading: 'EXTENDED MONOGRAPHS & EMPIRICAL CASE STUDIES',
    libReadMore: 'Read more',
    libBottomTitle: 'Next Step With Your Natal Chart: Choose the Right Reading Tier',
    libBottomDescHtml:
      'Start with the <strong class="text-emerald-300">Free Foundation Reading (0 VND)</strong> for a clear overview; when facing an important decision this year, unlock the <strong class="text-amber-300">Pro Deep Reading (119,000 VND)</strong> or <strong class="text-purple-300">Grandmaster Expert Reading (269,000 VND)</strong> — upgrading only charges the price difference (150,000 VND).',
    libTier1Html: '<strong class="text-emerald-300">Foundation Tier (0 VND):</strong> 110+ stars plotted & ~1,000-word reading.',
    libTier2Html: '<strong class="text-amber-300">Pro Tier (119,000 VND):</strong> ~2,500 words, 4 seasons + 2 VIP AI questions.',
    libTier3Html: '<strong class="text-purple-300">Expert Tier (269,000 VND):</strong> ~4,500–6,000 words, 12 palaces & 12 lunar months.',
    libBookZaloBtn: 'Book 1-on-1 Session With Master Ton (Zalo 0935 058 688)',
    artUpdatedLabel: 'Updated:',
    artAuthorLabel: 'Compiled & Reviewed by:',
    artVerifiedBadge: '✔ Academically Verified',
    artGeoTitle: 'Expert Core Summary (Quick Citation):',
    artKeyTakeawaysLabel: 'Key Takeaways to Remember:',
    artMidBannerBadge: '⚡ Empirical Tool Applied Directly to Your Natal Chart',
    artFaqTitle: 'Frequently Asked Questions on This Topic',
    artBottomBadge: 'Begin Your Self-Discovery Journey',
    artBottomTitle: 'Don’t Just Read Theory — Cross-Reference Directly on Your Own Natal Chart!',
    artBottomDescHtml:
      'Enter your birth date & hour on <strong class="text-amber-300">Master Ton’s Zi Wei</strong> homepage to receive your <strong class="text-emerald-300">Free Foundation Reading (0 VND)</strong>, or unlock the <strong class="text-amber-300">VIP Pro (119k)</strong> & <strong class="text-purple-300">12-Palace Expert (269k)</strong> editions combining Face & Palm analysis.',
    artNextArticlesTitle: 'Next Guides in Your Destiny Decoding Roadmap',
    artViewAll10: 'View all 10 monographs',
    artBackToLibrary: 'Back to Zi Wei & Physiognomy Library',
    kfBadge: 'Empirical Zi Wei, Face & Palm Reading Guides',
    kfTitle: 'Master Ton’s Monograph Library',
    kfDesc:
      'In-depth monographs decoding Zi Wei Dou Shu, Ba Bo Shen Sha, Face Reading, and Palmistry through an empirical lens — helping you master your natal chart from fundamentals to advanced levels.',
    kfViewAllBtn: 'View Full Library (10 Monographs)',
    illHeaderBadge: 'Visual Topic Blueprint • Master Ton',
    illCenterFocus: 'Core Focus',
    courseNavSub: '🎓 Practical Zi Wei Academy',
    courseUnlockBtn: 'Unlock 699,000 VND',
    courseAdminBadge: 'Administrator (Master Ton)',
    courseTesterBadge: 'VIP Tester Account',
    courseStudentBadge: 'Official Student ({code})',
    courseHeroBadge1: 'Audio Podcast + Interactive Curriculum',
    courseHeroUnlockedBadge: 'All 24 Lessons Unlocked • Lifetime Access',
    courseHeroAutoBadge: 'Instant 24/7 Automated Unlock via VietQR',
    courseInstructorTitle: 'Taught by Master Ton',
    courseInstructorSub: '18+ years research',
    courseNextGenBadge: 'Next-Gen Zi Wei Learning Experience',
    courseNextGenDescHtml:
      'Master all <strong>14 Major Stars, 6 Auspicious & 6 Malefic Stars, Four Transformations, 4 Grand Formations & 5-Step Annual Transit Method</strong> via studio Podcasts, interactive web lessons, and the <strong>Automated Personal Chart Star Matcher</strong>.',
    coursePill1: '🎧 Listen to Podcasts anytime',
    coursePill2: '🃏 14 Major Stars Flashcards',
    coursePill3: '🧭 Auto-match your natal chart',
    courseStat1Title: '24 Lessons',
    courseStat1Sub: '4 Practical Modules',
    courseStat2Title: 'Podcast + Web',
    courseStat2Sub: 'Seamless audio & reading',
    courseStat3Title: 'Chart Matcher',
    courseStat3Sub: 'Auto-locates stars on your chart',
    courseStat4Title: 'Completed {done}/24',
    courseStat4Sub: 'Saves progress & study notes',
    courseUnlockedTitle: 'All 24 Lessons Unlocked',
    courseLifetimeTitle: 'Lifetime Full Access',
    courseProgressLabel: 'Completion Progress:',
    courseTuitionLabel: 'One-time Full Tuition:',
    courseSave53: 'Save 53%',
    courseBullet1Html: 'Instant access to all <strong>24 Podcast Episodes & Web Monographs</strong>',
    courseBullet2Html: 'Automatically cross-references every star on <strong>your own Natal Chart</strong>',
    courseBullet3Html: 'Lifetime access on Mobile & Desktop with free future updates',
    courseQrBtn: 'Scan VietQR to Unlock Now (699,000 VND)',
    courseRestoreLink: 'Already paid? Enter Order Code / Email to restore access →',
    courseRestoreLabel: 'Enter Transaction Code (e.g. TV12345) or registered Email:',
    courseRestorePlaceholder: 'TVxxxxx or email@...',
    courseRestoreBtn: 'Activate',
    courseMapHeading: '4-Module Practical Roadmap (Click to Filter by Module)',
    courseMapReset: 'Show all 24 lessons →',
    courseSidebarTitle: '24-Lesson Curriculum',
    courseSidebarUnlocked: 'Unlocked 24/24',
    courseSidebarPreview: '2 Free Preview Lessons',
    courseSearchPlaceholder: 'Quick search star: Zi Wei, Tai Yin, Hua Ji...',
    courseFilterAll: 'All (24)',
    courseFilterModule: 'Module {id}',
    courseLessonPrefix: 'Lesson',
    courseDoneBadge: 'Completed',
    coursePreviewBadge: 'Free Preview',
    courseFreePreviewLesson: 'Free Preview Lesson',
    courseMarkDone: 'Mark as Completed',
    courseMarkedDone: 'Completed',
    courseIllStarsLabel: 'Core Stars & Concepts in This Lesson:',
    courseIllInstructor: 'Instructor: Master Ton',
    courseIllSub: 'Podcast & Practical Curriculum',
    courseLockedBadge: 'Exclusive Content for Enrolled Students',
    courseLockedTitle: 'Unlock This Podcast & Monograph Lesson in 3 Seconds',
    courseLockedDescHtml:
      'Scan the VietQR code for <strong>699,000 VND</strong> to automatically unlock all <strong>24 Podcast Episodes + Interactive Curriculum on the 14 Major Stars, Auxiliary Stars, Formations & Transits</strong> by Master Ton.',
    courseLockedSummaryLabel: '✦ Key Topics Covered in Lesson {num}:',
    courseLockedElementsLabel: 'Five Elements & Essence:',
    courseLockedChaptersLabel: 'Podcast Chapters ({dur}):',
    courseLockedQrBtn: 'Scan QR to Unlock Full Course (699,000 VND)',
    courseLockedPreviewBtn: 'Listen to Free Preview Lessons 1 & 2',
    coursePlayerTitle: 'Master Ton’s Lecture Podcast',
    coursePartLabel: 'Part',
    courseChapterLabel: 'Chapter',
    courseTranscriptLabel: 'Podcast Lecture Transcript',
    courseStarMatchTitle: 'Live Cross-Reference of Lesson Stars on the Chart of',
    courseStarMatchYou: 'You',
    courseChangeChart: 'Switch to another chart →',
    courseCreateChartToMatch: 'Cast your chart to auto-match stars →',
    courseStarLabel: 'Star',
    coursePalaceLabel: 'Palace',
    courseStatusLabel: 'Brightness / Role:',
    courseMajorAux: 'Key Auxiliary Star',
    courseCoStarsLabel: 'Co-located with:',
    courseNoChartHint1: '💡 Once you cast a free chart on the Homepage, the system will automatically locate which palace',
    courseNoChartHint2: 'resides in on your personal chart right here!',
    courseFlashcardTitle: 'Quick Star Flashcard & Classical Mnemonics',
    courseFcElements: 'Five Elements & Essence:',
    courseFcDomain: 'Primary Governing Domain:',
    courseFcBrightness: 'Brightness Positions across 12 Branches:',
    courseFcClassicVerse: 'Classical Verse & Core Principle:',
    courseNotesLabel: 'Your Personal Study Notes for Lesson {num}:',
    courseNotesSaved: '✓ Automatically saved to device',
    courseNotesPlaceholder: 'Jot down insights that match your chart or your family’s charts here...',
    coursePrevLesson: '← Previous Lesson',
    courseNextLesson: 'Next Lesson (Lesson {num})',
    courseMiniUnlockBtn: 'Unlock 24 Lessons (699k)',
    courseAuthNotice:
      'Please create an account or sign in (takes only 5 seconds) before payment so the system can permanently bind lifetime access to the 24-Lesson Course to your account.',
  },
  zh: {
    brandName: '孙老师紫微斗数与风水',
    homeChart: '排盘首页',
    fengShui: '风水堪舆',
    ziWeiKnowledge: '紫微知识',
    guideLibrary: '紫微百科',
    freeChartBtn: '免费排盘',
    freeChartZeroBtn: '免费排盘 (0 VND)',
    book1on1Short: '预约一对一: 0935 058 688',
    badge2Standard: '正统紫微斗数 & 实战风水堪舆',
    authorLine: '专业编撰与审定：孙老师 (Thầy Tôn) - 紫微斗数与风水专家 | 更新日期：2026/10/24',
    authorBioLine:
      '河内综合大学数学与信息学特长班校友 • 英国兰卡斯特大学 (Lancaster University) 会计与金融学士及硕士 • 15+ 年 IELTS 与剑桥 IGCSE 教学经验',
    viewProfileLink: '查看孙老师专家档案 →',
    backToChartLink: '← 返回排盘工具',
    quickSummaryLabel: '核心摘要',
    trReadyPrompt: '已了解孙老师的学术背景？立即为您排定专属命盘：',
    trBackToUnlockBtn: '返回排盘并解锁深度命书',
    faqHeading: '常见问题解答',
    locationNote: '面谈地点：河内青春郡皇家城 (Royal City)（请提前通过 Zalo 预约）',
    hotlineNote: '预约热线 / Zalo: 0935 058 688',
    dirHeading: '孙老师紫微斗数与风水 38 专题知识体系',
    dirBackHome: '返回免费排盘首页 →',
    dirBranch1: '命理精批与咨询 • 深度命书方案',
    dirBranch2: '风水堪舆与择日 • 空间布局改运',
    dirBranch3: '星曜、十二宫与运限 • 紫微斗数精髓',
    dirHomeItem: '免费紫微斗数排盘与终身精批（首页）',
    disclaimer:
      '免责声明：本平台所有紫微斗数、面相手相、风水堪舆及 AI 问答内容均属东亚传统文化研究、心理剖析与趋势参考，绝非封建迷信算命，亦不能替代专业医疗、法律或投资顾问意见。一切现实决策均由读者自主负责。',
    libHeroBadge: '38 专题知识生态 • 紫微斗数与实战风水',
    libHeroTitle: '孙老师紫微斗数与命盘风水实战指南库',
    libHeroDescHtml:
      '由 <strong class="text-amber-300">孙老师 (Trần Huy Tôn)</strong> 亲自编撰与学术审定 — 18+ 年紫微斗数与风水研究经验、河内综合大学数学与信息特长班校友、英国兰卡斯特大学 (Lancaster University) 会计与金融学士及硕士、15+ 年 IELTS 与剑桥 IGCSE 教学经验。',
    libHeroCta: '免费排盘并获取启源命书 (0 VND)',
    libPagesCount: '{count} 篇专题指南',
    libCat1: '命书方案与专家咨询',
    libCat2: '风水堪舆与择日吉时',
    libCat3: '紫微斗数核心精髓',
    libViewDetail: '查看专题详情',
    libExtendedHeading: '深度扩展专论与实证案例对照',
    libReadMore: '阅读全文',
    libBottomTitle: '排盘后的下一步：选择适合您的命书深度',
    libBottomDescHtml:
      '先通过 <strong class="text-emerald-300">免费启源版 (0 VND)</strong> 掌握命局全貌；面临年度重大抉择时，可解锁 <strong class="text-amber-300">专业精批版 Pro (119,000 VND)</strong> 或 <strong class="text-purple-300">专家全解版 Expert (269,000 VND)</strong> — 升级仅需补差价 (150,000 VND)。',
    libTier1Html: '<strong class="text-emerald-300">启源版 (0 VND)：</strong> 排定 110+ 星曜及约 1,000 字基础命书。',
    libTier2Html: '<strong class="text-amber-300">Pro 版 (119,000 VND)：</strong> 约 2,500 字、四季运限 + 赠送 2 次深度问答。',
    libTier3Html: '<strong class="text-purple-300">Expert 版 (269,000 VND)：</strong> 约 4,500–6,000 字、十二宫与农历十二个月详批。',
    libBookZaloBtn: '预约孙老师一对一咨询 (Zalo 0935 058 688)',
    artUpdatedLabel: '更新：',
    artAuthorLabel: '编撰与审定：',
    artVerifiedBadge: '✔ 学术实证审核',
    artGeoTitle: '专家核心提要（快速引用）：',
    artKeyTakeawaysLabel: '核心要点总结：',
    artMidBannerBadge: '⚡ 在您的专属命盘上直接验证',
    artFaqTitle: '本专题常见问题解答',
    artBottomBadge: '开启知命造命之旅',
    artBottomTitle: '切勿只看理论 — 立即在您的个人命盘上实证对照！',
    artBottomDescHtml:
      '在 <strong class="text-amber-300">孙老师紫微斗数</strong> 首页输入出生年月日时，即可免费获取 <strong class="text-emerald-300">启源版命书 (0 VND)</strong>，或解锁结合面相手相的 <strong class="text-amber-300">VIP Pro (119k)</strong> 与 <strong class="text-purple-300">十二宫专家版 (269k)</strong>。',
    artNextArticlesTitle: '命理解码进阶阅读推荐',
    artViewAll10: '查看全部 10 篇专论',
    artBackToLibrary: '返回紫微与相法百科目录',
    kfBadge: '紫微斗数、面相与手相实证指南',
    kfTitle: '孙老师命理专论图书馆',
    kfDesc: '从实证科学视角深度解析紫微斗数、八部神煞、面相与手相——助您从入门到精通读懂个人命盘。',
    kfViewAllBtn: '查看全部专论 (10 篇)',
    illHeaderBadge: '专题视觉导图 • 孙老师',
    illCenterFocus: '核心焦点',
    courseNavSub: '🎓 紫微斗数实战学院',
    courseUnlockBtn: '解锁课程 699,000 VND',
    courseAdminBadge: '管理员 (孙老师)',
    courseTesterBadge: 'VIP 测试账号',
    courseStudentBadge: '正式学员 ({code})',
    courseHeroBadge1: '播客音频 + 交互式教材',
    courseHeroUnlockedBadge: '已解锁全部 24 讲 • 终身学习',
    courseHeroAutoBadge: 'VietQR 扫码 24/7 全自动解锁',
    courseInstructorTitle: '孙老师亲授',
    courseInstructorSub: '18+ 年命理研究',
    courseNextGenBadge: '新一代紫微斗数沉浸式学习体验',
    courseNextGenDescHtml:
      '通过录音室级播客音频、交互式图文教材与<strong>个人命盘星曜自动对照工具</strong>，系统掌握<strong>十四主星、六吉六煞、四化飞星、四大格局与流年断限五步法</strong>。',
    coursePill1: '🎧 随时随地收听播客',
    coursePill2: '🃏 十四主星速记卡',
    coursePill3: '🧭 自动匹配个人命盘',
    courseStat1Title: '24 节精讲',
    courseStat1Sub: '4 大实战模块',
    courseStat2Title: '播客 + 网页',
    courseStat2Sub: '边听边读流畅体验',
    courseStat3Title: '命盘对照',
    courseStat3Sub: '自动定位您命盘上的星曜',
    courseStat4Title: '已学 {done}/24',
    courseStat4Sub: '保存学习进度与笔记',
    courseUnlockedTitle: '已解锁全部 24 节课程',
    courseLifetimeTitle: '终身无限次访问权限',
    courseProgressLabel: '学习完成进度：',
    courseTuitionLabel: '一次性买断学费：',
    courseSave53: '立省 53%',
    courseBullet1Html: '立即解锁全部 <strong>24 集播客音频与深度讲义</strong>',
    courseBullet2Html: '自动在<strong>您的个人命盘</strong>上定位每颗所学星曜',
    courseBullet3Html: '手机与电脑端终身学习，免费享受后续更新',
    courseQrBtn: '扫码立即解锁全套课程 (699,000 VND)',
    courseRestoreLink: '之前已付款？输入订单号 / 邮箱恢复权限 →',
    courseRestoreLabel: '输入交易单号（如 TV12345）或购课邮箱：',
    courseRestorePlaceholder: 'TVxxxxx 或 email@...',
    courseRestoreBtn: '激活',
    courseMapHeading: '四大实战模块导图（点击按模块筛选）',
    courseMapReset: '显示全部 24 节课程 →',
    courseSidebarTitle: '24 讲课程大纲',
    courseSidebarUnlocked: '已解锁 24/24 讲',
    courseSidebarPreview: '前 2 讲免费试听',
    courseSearchPlaceholder: '快速搜索星曜：紫微、太阴、化忌...',
    courseFilterAll: '全部 (24)',
    courseFilterModule: '模块 {id}',
    courseLessonPrefix: '第',
    courseDoneBadge: '已学',
    coursePreviewBadge: '免费试学',
    courseFreePreviewLesson: '免费试听课程',
    courseMarkDone: '标记为已学',
    courseMarkedDone: '已完成本课',
    courseIllStarsLabel: '本讲核心星曜与概念：',
    courseIllInstructor: '主讲：孙老师',
    courseIllSub: '播客与实战讲义',
    courseLockedBadge: '正式学员专属课程内容',
    courseLockedTitle: '仅需 3 秒即可解锁本集播客与深度讲义',
    courseLockedDescHtml:
      '使用 VietQR 扫码支付 <strong>699,000 VND</strong>，系统将立即自动解锁孙老师全套 <strong>24 集播客 + 十四主星、辅星、格局与流年运限讲义</strong>。',
    courseLockedSummaryLabel: '✦ 第 {num} 讲核心内容提要：',
    courseLockedElementsLabel: '五行与化气：',
    courseLockedChaptersLabel: '播客章节 ({dur})：',
    courseLockedQrBtn: '扫码解锁全套课程 (699,000 VND)',
    courseLockedPreviewBtn: '免费试听第 1 讲与第 2 讲',
    coursePlayerTitle: '孙老师紫微精讲播客',
    coursePartLabel: '第',
    courseChapterLabel: '章节',
    courseTranscriptLabel: '播客讲义逐字稿',
    courseStarMatchTitle: '将本讲星曜直接对照至个人命盘：',
    courseStarMatchYou: '您',
    courseChangeChart: '切换其他命盘 →',
    courseCreateChartToMatch: '去排盘以自动匹配星曜 →',
    courseStarLabel: '星曜',
    coursePalaceLabel: '宫位',
    courseStatusLabel: '庙旺状态：',
    courseMajorAux: '重点辅星',
    courseCoStarsLabel: '同宫主星：',
    courseNoChartHint1: '💡 当您在首页免费排盘后，系统将在此框内自动查找',
    courseNoChartHint2: '落入您命盘的哪个宫位！',
    courseFlashcardTitle: '星曜速记闪卡与古赋口诀',
    courseFcElements: '五行与化气：',
    courseFcDomain: '核心主事：',
    courseFcBrightness: '十二地支庙旺利陷：',
    courseFcClassicVerse: '经典古赋与核心法则：',
    courseNotesLabel: '您在第 {num} 讲的个人学习笔记：',
    courseNotesSaved: '✓ 已自动保存至本机',
    courseNotesPlaceholder: '在此记录与您或家人命盘相印证的心得体会...',
    coursePrevLesson: '← 上一讲',
    courseNextLesson: '下一讲 (第 {num} 讲)',
    courseMiniUnlockBtn: '解锁 24 讲 (699k)',
    courseAuthNotice: '付款前请先注册或登录账号（仅需 5 秒），以便系统将 24 讲课程的终身访问权限永久绑定至您的账户。',
  },
  ko: {
    brandName: '선생 톤 자미두수 & 풍수',
    homeChart: '명반 작성 홈',
    fengShui: '풍수지리',
    ziWeiKnowledge: '자미두수 지식',
    guideLibrary: '자미두수 가이드',
    freeChartBtn: '무료 명반 작성',
    freeChartZeroBtn: '무료 명반 작성 (0 VND)',
    book1on1Short: '1:1 예약: 0935 058 688',
    badge2Standard: '정통 자미두수 & 실전 풍수지리',
    authorLine: '전문 편찬 및 감수: 선생 톤 (Thầy Tôn) - 자미두수 및 풍수 전문가 | 업데이트: 2026/10/24',
    authorBioLine:
      '하노이 종합대 수학·정보 영재반 출신 • 영국 랭커스터 대학교(Lancaster University) 회계·재무학 학사 및 석사 • IELTS & 캠브리지 IGCSE 15년+ 강의',
    viewProfileLink: '선생 톤 프로필 보기 →',
    backToChartLink: '← 명반 작성으로 돌아가기',
    quickSummaryLabel: '핵심 요약',
    trReadyPrompt: '선생 톤의 학술적 배경을 확인하셨나요? 지금 바로 당신의 명반을 확인해 보세요:',
    trBackToUnlockBtn: '명반 작성 및 심층 풀이 잠금 해제',
    faqHeading: '자주 묻는 질문 (FAQ)',
    locationNote: '상담 장소: 하노이 타인쑤언구 로열 시티 (Royal City) (Zalo 사전 예약 필수)',
    hotlineNote: '예약 핫라인 / Zalo: 0935 058 688',
    dirHeading: '선생 톤 자미두수 & 풍수 38개 전문 주제 디렉토리',
    dirBackHome: '무료 명반 작성 홈으로 →',
    dirBranch1: '명리 풀이 및 상담 • 심층 리포트',
    dirBranch2: '풍수지리 및 택일 • 공간 개운법',
    dirBranch3: '성요, 12궁 및 운한 • 자미두수 핵심',
    dirHomeItem: '무료 자미두수 명반 작성 및 평생 풀이 (홈)',
    disclaimer:
      '면책 조항: 본 시스템의 모든 자미두수, 관상·수상, 풍수 및 AI 질의응답 콘텐츠는 동아시아 문화 연구, 심리적 성찰 및 방향성 참고를 위한 것이며 미신적 점술이 아닙니다. 전문적인 의료, 법률 또는 재무 자문을 대체하지 않으며 모든 실제 결정의 책임은 독자에게 있습니다.',
    libHeroBadge: '38개 주제 생태계 • 자미두수 & 실전 풍수',
    libHeroTitle: '선생 톤의 자미두수 & 명반 기반 풍수 실전 핸드북',
    libHeroDescHtml:
      '<strong class="text-amber-300">선생 톤 (Trần Huy Tôn)</strong> 직접 편찬 및 감수 — 18년 이상의 자미두수·풍수 연구, 하노이 종합대 수학·정보 영재반 출신, 영국 랭커스터 대학교(Lancaster University) 회계·재무학 학사 및 석사, 15년 이상의 IELTS & 캠브리지 IGCSE 강의.',
    libHeroCta: '무료 명반 작성 및 기본 풀이 받기 (0 VND)',
    libPagesCount: '{count}개 전문 주제',
    libCat1: '명리 리포트 & 전문가 상담',
    libCat2: '풍수지리 & 길일 택일',
    libCat3: '자미두수 핵심 이론',
    libViewDetail: '주제 상세 보기',
    libExtendedHeading: '확장 심층 연구 & 실증 사례 대조',
    libReadMore: '더 읽기',
    libBottomTitle: '명반의 다음 단계: 올바른 풀이 수준 선택하기',
    libBottomDescHtml:
      '먼저 <strong class="text-emerald-300">무료 기본본 (0 VND)</strong>으로 전체 흐름을 파악하세요. 올해 중요한 결정을 앞두고 있다면 <strong class="text-amber-300">심층 Pro본 (119,000 VND)</strong> 또는 <strong class="text-purple-300">전문가 Expert본 (269,000 VND)</strong>을 잠금 해제하세요 — 업그레이드 시 차액(150,000 VND)만 결제하면 됩니다.',
    libTier1Html: '<strong class="text-emerald-300">기본본 (0 VND):</strong> 110+ 성요 배치 및 약 1,000단어 풀이.',
    libTier2Html: '<strong class="text-amber-300">Pro본 (119,000 VND):</strong> 약 2,500단어, 사계절 운한 + 심층 질문 2회.',
    libTier3Html: '<strong class="text-purple-300">Expert본 (269,000 VND):</strong> 약 4,500–6,000단어, 12궁 및 음력 12개월 풀이.',
    libBookZaloBtn: '선생 톤 1:1 상담 예약 (Zalo 0935 058 688)',
    artUpdatedLabel: '업데이트:',
    artAuthorLabel: '편찬 및 감수:',
    artVerifiedBadge: '✔ 학술 실증 검증됨',
    artGeoTitle: '전문가 핵심 요약 (빠른 인용):',
    artKeyTakeawaysLabel: '기억해야 할 핵심 포인트:',
    artMidBannerBadge: '⚡ 내 명반에서 직접 확인하는 실증 도구',
    artFaqTitle: '이 주제에 대해 자주 묻는 질문',
    artBottomBadge: '명리 탐구 여정 시작하기',
    artBottomTitle: '이론만 읽지 마세요 — 지금 바로 당신의 명반에서 직접 대조해 보세요!',
    artBottomDescHtml:
      '<strong class="text-amber-300">선생 톤 자미두수</strong> 홈에서 생년월일시를 입력해 <strong class="text-emerald-300">무료 기본 풀이 (0 VND)</strong>를 받거나, 관상·수상이 결합된 <strong class="text-amber-300">VIP Pro (119k)</strong> 및 <strong class="text-purple-300">12궁 Expert (269k)</strong> 버전을 경험해 보세요.',
    artNextArticlesTitle: '운명 해독 로드맵의 다음 추천 글',
    artViewAll10: '10개 심층 연구 모두 보기',
    artBackToLibrary: '자미두수 & 관상 가이드 목록으로 돌아가기',
    kfBadge: '실증 자미두수, 관상 & 수상 가이드',
    kfTitle: '선생 톤의 심층 연구 라이브러리',
    kfDesc: '자미두수, 팔부신살, 관상 및 수상을 실증적 관점에서 깊이 있게 해독하여 기초부터 고급까지 명반을 이해하도록 돕습니다.',
    kfViewAllBtn: '전체 가이드 보기 (10편)',
    illHeaderBadge: '주제별 시각 다이어그램 • 선생 톤',
    illCenterFocus: '핵심 초점',
    courseNavSub: '🎓 실전 자미두수 아카데미',
    courseUnlockBtn: '699,000 VND 잠금 해제',
    courseAdminBadge: '관리자 (선생 톤)',
    courseTesterBadge: 'VIP 테스터 계정',
    courseStudentBadge: '정식 수강생 ({code})',
    courseHeroBadge1: '오디오 팟캐스트 + 인터랙티브 교재',
    courseHeroUnlockedBadge: '전체 24강 잠금 해제됨 • 평생 수강',
    courseHeroAutoBadge: 'VietQR 스캔 즉시 24/7 자동 잠금 해제',
    courseInstructorTitle: '선생 톤 직강',
    courseInstructorSub: '18년+ 명리 연구',
    courseNextGenBadge: '차세대 자미두수 학습 경험',
    courseNextGenDescHtml:
      '스튜디오급 팟캐스트 강의와 인터랙티브 교재, 그리고 <strong>개인 명반 성요 자동 대조 도구</strong>를 통해 <strong>14주성, 육길성, 육살성, 사화, 4대 격국 및 유년 운한 5단계 풀이법</strong>을 체계적으로 마스터하세요.',
    coursePill1: '🎧 언제 어디서나 팟캐스트 청취',
    coursePill2: '🃏 14주성 플래시카드',
    coursePill3: '🧭 내 명반과 자동 매칭',
    courseStat1Title: '24개 강의',
    courseStat1Sub: '4개 실전 모듈',
    courseStat2Title: '팟캐스트 + 웹',
    courseStat2Sub: '듣기와 읽기를 동시에',
    courseStat3Title: '내 명반 대조',
    courseStat3Sub: '명반 속 성요 위치 자동 탐색',
    courseStat4Title: '수강 {done}/24',
    courseStat4Sub: '진도율 및 개인 노트 저장',
    courseUnlockedTitle: '전체 24강 잠금 해제 완료',
    courseLifetimeTitle: '평생 무제한 수강 권한',
    courseProgressLabel: '학습 완료 진도:',
    courseTuitionLabel: '평생 소장 수강료 (1회 결제):',
    courseSave53: '53% 할인',
    courseBullet1Html: '전체 <strong>24개 팟캐스트 에피소드 및 심층 교재</strong> 즉시 잠금 해제',
    courseBullet2Html: '배우고 있는 각 성요를 <strong>내 명반</strong>에서 자동으로 찾아 대조',
    courseBullet3Html: '모바일 및 PC 평생 수강, 향후 신규 업데이트 무료 제공',
    courseQrBtn: 'QR 스캔하여 즉시 잠금 해제 (699,000 VND)',
    courseRestoreLink: '이미 결제하셨나요? 주문번호 / 이메일로 복구하기 →',
    courseRestoreLabel: '거래 코드(예: TV12345) 또는 결제 이메일 입력:',
    courseRestorePlaceholder: 'TVxxxxx 또는 email@...',
    courseRestoreBtn: '활성화',
    courseMapHeading: '4대 실전 모듈 로드맵 (클릭하여 모듈별 필터링)',
    courseMapReset: '전체 24강 다시 보기 →',
    courseSidebarTitle: '24강 커리큘럼',
    courseSidebarUnlocked: '24/24강 열림',
    courseSidebarPreview: '첫 2강 무료 체험',
    courseSearchPlaceholder: '성요 빠른 검색: 자미, 태음, 화기...',
    courseFilterAll: '전체 (24)',
    courseFilterModule: '모듈 {id}',
    courseLessonPrefix: '제',
    courseDoneBadge: '완료',
    coursePreviewBadge: '무료 체험',
    courseFreePreviewLesson: '무료 체험 강의',
    courseMarkDone: '학습 완료 표시',
    courseMarkedDone: '학습 완료됨',
    courseIllStarsLabel: '이번 강의의 핵심 성요 및 개념:',
    courseIllInstructor: '강사: 선생 톤',
    courseIllSub: '팟캐스트 & 실전 커리큘럼',
    courseLockedBadge: '정식 수강생 전용 콘텐츠',
    courseLockedTitle: '단 3초 만에 이 팟캐스트 강의와 교재 잠금 해제하기',
    courseLockedDescHtml:
      'VietQR 코드로 <strong>699,000 VND</strong>를 결제하시면 선생 톤의 <strong>24강 전체 팟캐스트 + 14주성·보성·격국·운한 교재</strong>가 즉시 자동 잠금 해제됩니다.',
    courseLockedSummaryLabel: '✦ 제{num}강 핵심 내용 요약:',
    courseLockedElementsLabel: '오행 & 화기:',
    courseLockedChaptersLabel: '팟캐스트 챕터 ({dur}):',
    courseLockedQrBtn: 'QR 스캔하여 전체 강의 열기 (699,000 VND)',
    courseLockedPreviewBtn: '제1강 & 제2강 무료 체험 듣기',
    coursePlayerTitle: '선생 톤의 강의 팟캐스트',
    coursePartLabel: '파트',
    courseChapterLabel: '챕터',
    courseTranscriptLabel: '팟캐스트 강의 대본',
    courseStarMatchTitle: '이번 강의 성요를 개인 명반에 실시간 대조:',
    courseStarMatchYou: '회원님',
    courseChangeChart: '다른 명반으로 변경 →',
    courseCreateChartToMatch: '성요 자동 대조를 위해 명반 작성하기 →',
    courseStarLabel: '성요',
    coursePalaceLabel: '궁위',
    courseStatusLabel: '묘왕 상태:',
    courseMajorAux: '핵심 보성',
    courseCoStarsLabel: '동궁 성요:',
    courseNoChartHint1: '💡 홈에서 무료 명반을 작성하시면, 시스템이 자동으로',
    courseNoChartHint2: '성요가 회원님 명반의 어느 궁에 있는지 이 박스에 표시해 드립니다!',
    courseFlashcardTitle: '성요 핵심 요약 플래시카드 & 고전 구결',
    courseFcElements: '오행 & 화기:',
    courseFcDomain: '핵심 주관 분야:',
    courseFcBrightness: '12지지 묘/왕/득/함 위치:',
    courseFcClassicVerse: '고전 구결 & 핵심 원칙:',
    courseNotesLabel: '제{num}강 개인 학습 노트:',
    courseNotesSaved: '✓ 기기에 자동 저장됨',
    courseNotesPlaceholder: '본인이나 가족의 명반과 부합하는 통찰을 이곳에 기록해 보세요...',
    coursePrevLesson: '← 이전 강의',
    courseNextLesson: '다음 강의 (제{num}강)',
    courseMiniUnlockBtn: '24강 열기 (699k)',
    courseAuthNotice: '결제 전에 계정을 생성하거나 로그인(5초 소요)해 주시면 24강 평생 수강 권한이 회원님의 계정에 영구 귀속됩니다.',
  },
  ja: {
    brandName: 'トン先生 • 紫微斗数＆風水',
    homeChart: '命盤作成ホーム',
    fengShui: '風水鑑定',
    ziWeiKnowledge: '紫微斗数の知識',
    guideLibrary: '紫微斗数ガイド',
    freeChartBtn: '無料命盤作成',
    freeChartZeroBtn: '無料命盤作成 (0 VND)',
    book1on1Short: '1対1予約: 0935 058 688',
    badge2Standard: '正統紫微斗数＆実践風水',
    authorLine: '編纂・学術監修：トン先生 (Thầy Tôn) - 紫微斗数・風水専門家 | 更新日：2026/10/24',
    authorBioLine:
      'ハノイ総合大学数学・情報特進クラス出身 • 英国ランカスター大学 (Lancaster University) 会計・ファイナンス学士および修士 • IELTS＆ケンブリッジIGCSE指導歴15年以上',
    viewProfileLink: 'トン先生のプロフィールを見る →',
    backToChartLink: '← 命盤作成に戻る',
    quickSummaryLabel: 'クイック要約',
    trReadyPrompt: 'トン先生の学術的背景をご確認いただけましたか？今すぐあなたの命盤を作成しましょう：',
    trBackToUnlockBtn: '命盤作成に戻り深層鑑定をアンロック',
    faqHeading: 'よくあるご質問 (FAQ)',
    locationNote: '対面相談エリア：ハノイ市タインスアン区ロイヤルシティ (Royal City)（Zaloにて事前予約制）',
    hotlineNote: '予約ホットライン / Zalo: 0935 058 688',
    dirHeading: 'トン先生の紫微斗数＆風水 38専門テーマ一覧',
    dirBackHome: '無料命盤作成ホームへ戻る →',
    dirBranch1: '命理鑑定＆相談 • 深層鑑定書プラン',
    dirBranch2: '風水＆択日 • 空間開運アプローチ',
    dirBranch3: '星曜・十二宮・運限 • 紫微斗数の真髄',
    dirHomeItem: '無料紫微斗数命盤作成＆生涯鑑定（ホーム）',
    disclaimer:
      '免責事項：本システム上の紫微斗数、人相・手相、風水、およびAI Q&Aのすべての内容は、東アジア文化研究、心理的考察、および指針の参考を目的としており、迷信的な占いではありません。また、専門的な医療、法律、財務アドバイスに代わるものではありません。実際の意思決定はすべて読者ご自身の責任となります。',
    libHeroBadge: '38専門テーマの体系 • 紫微斗数＆実践風水',
    libHeroTitle: 'トン先生と学ぶ紫微斗数＆命盤風水実践ハンドブック',
    libHeroDescHtml:
      '<strong class="text-amber-300">トン先生 (Trần Huy Tôn)</strong> による編纂・学術監修 — 紫微斗数・風水研究歴18年以上、ハノイ総合大学数学・情報特進クラス出身、英国ランカスター大学 (Lancaster University) 会計・ファイナンス学士および修士、IELTS＆ケンブリッジIGCSE指導歴15年以上。',
    libHeroCta: '無料で命盤を作成し基本鑑定を受け取る (0 VND)',
    libPagesCount: '専門ガイド {count} ページ',
    libCat1: '命理鑑定＆個別相談',
    libCat2: '風水＆吉日選び（択日）',
    libCat3: '紫微斗数の核心知識',
    libViewDetail: 'ガイド詳細を見る',
    libExtendedHeading: '拡張専門モノグラフ＆実証ケーススタディ',
    libReadMore: '続きを読む',
    libBottomTitle: '命盤作成後の次のステップ：最適な鑑定プランを選択',
    libBottomDescHtml:
      'まずは <strong class="text-emerald-300">無料起原版 (0 VND)</strong> で全体像を把握し、今年の重要な決断に際しては <strong class="text-amber-300">専門Pro版 (119,000 VND)</strong> または <strong class="text-purple-300">大宗師Expert版 (269,000 VND)</strong> をアンロックしてください — アップグレードは差額 (150,000 VND) のみのお支払いです。',
    libTier1Html: '<strong class="text-emerald-300">起原版 (0 VND)：</strong> 110以上の星を配置＆約1,000語の基本鑑定。',
    libTier2Html: '<strong class="text-amber-300">Pro版 (119,000 VND)：</strong> 約2,500語、四季の運勢＋深層AI質問2回付き。',
    libTier3Html: '<strong class="text-purple-300">Expert版 (269,000 VND)：</strong> 約4,500〜6,000語、全12宮＆旧暦1〜12ヶ月鑑定。',
    libBookZaloBtn: 'トン先生との1対1相談を予約 (Zalo 0935 058 688)',
    artUpdatedLabel: '更新日：',
    artAuthorLabel: '編纂・監修：',
    artVerifiedBadge: '✔ 学術実証済み',
    artGeoTitle: '専門家による核心要約（クイック引用）：',
    artKeyTakeawaysLabel: '押さえておくべき重要ポイント：',
    artMidBannerBadge: '⚡ あなたの命盤で直接検証できる実践ツール',
    artFaqTitle: 'このテーマに関するよくあるご質問',
    artBottomBadge: '運命を深く知る旅を始めましょう',
    artBottomTitle: '理論を読むだけでなく — あなた自身の命盤で直接照らし合わせてみましょう！',
    artBottomDescHtml:
      '<strong class="text-amber-300">トン先生の紫微斗数</strong> ホームで生年月日・出生時刻を入力して <strong class="text-emerald-300">無料起原版鑑定 (0 VND)</strong> を受け取るか、顔相・手相を組み合わせた <strong class="text-amber-300">VIP Pro版 (119k)</strong> ＆ <strong class="text-purple-300">12宮Expert版 (269k)</strong> をご体験ください。',
    artNextArticlesTitle: '運命解読ロードマップの次の記事',
    artViewAll10: '全10本の専門記事を見る',
    artBackToLibrary: '紫微斗数＆相法ガイド一覧に戻る',
    kfBadge: '実証紫微斗数・顔相・手相ガイド',
    kfTitle: 'トン先生の専門モノグラフ・ライブラリ',
    kfDesc: '紫微斗数、八部神煞、顔相、手相を実証的な視点から深く解き明かし、基礎から応用まで命盤の理解を助けます。',
    kfViewAllBtn: 'ガイド一覧を見る (全10本)',
    illHeaderBadge: 'テーマ別ビジュアル図解 • トン先生',
    illCenterFocus: '中核テーマ',
    courseNavSub: '🎓 実践紫微斗数アカデミー',
    courseUnlockBtn: '699,000 VND で解除',
    courseAdminBadge: '管理者 (トン先生)',
    courseTesterBadge: 'VIPテスターアカウント',
    courseStudentBadge: '正式受講生 ({code})',
    courseHeroBadge1: '音声ポッドキャスト + 対話型カリキュラム',
    courseHeroUnlockedBadge: '全24講アンロック済み • 生涯アクセス',
    courseHeroAutoBadge: 'VietQRスキャンで24時間365日自動アンロック',
    courseInstructorTitle: 'トン先生が直接指導',
    courseInstructorSub: '研究歴18年以上',
    courseNextGenBadge: '次世代の紫微斗数学習体験',
    courseNextGenDescHtml:
      'スタジオ収録のポッドキャスト音声、対話型ウェブ教材、そして<strong>個人の命盤と星を自動照合するツール</strong>を通じて、<strong>14主星、六吉星、六煞星、四化、4大格局、および流年運限5ステップ判定法</strong>を体系的にマスターします。',
    coursePill1: '🎧 いつでもポッドキャスト聴取',
    coursePill2: '🃏 14主星フラッシュカード',
    coursePill3: '🧭 自分の命盤と自動照合',
    courseStat1Title: '全24講義',
    courseStat1Sub: '4つの実践モジュール',
    courseStat2Title: '音声 + Web',
    courseStat2Sub: '聴きながらスムーズに読解',
    courseStat3Title: '命盤星照合',
    courseStat3Sub: '自分の命盤上の星を自動検索',
    courseStat4Title: '受講済 {done}/24',
    courseStat4Sub: '進捗と学習メモを自動保存',
    courseUnlockedTitle: '全24講義アンロック済み',
    courseLifetimeTitle: '生涯無制限アクセス権',
    courseProgressLabel: '学習完了進捗：',
    courseTuitionLabel: '一括受講料（買い切り）：',
    courseSave53: '53% OFF',
    courseBullet1Html: '全 <strong>24回のポッドキャスト＆専門講義テキスト</strong> を即時アンロック',
    courseBullet2Html: '学んでいる各星の位置を <strong>あなた自身の命盤</strong> 上で自動照合',
    courseBullet3Html: 'スマホ・PCで生涯学習可能、今後の追加アップデートも無料',
    courseQrBtn: 'QRスキャンで今すぐ全講義を解除 (699,000 VND)',
    courseRestoreLink: 'すでにお支払い済みですか？注文番号 / メールで復元 →',
    courseRestoreLabel: '取引コード（例：TV12345）または購入時のメールアドレス：',
    courseRestorePlaceholder: 'TVxxxxx または email@...',
    courseRestoreBtn: '有効化',
    courseMapHeading: '4大実践モジュール・ロードマップ（クリックで絞り込み）',
    courseMapReset: '全24講義を表示 →',
    courseSidebarTitle: '全24講カリキュラム',
    courseSidebarUnlocked: '24/24講 解放済',
    courseSidebarPreview: '最初の2講は無料体験',
    courseSearchPlaceholder: '星をクイック検索：紫微、太陰、化忌...',
    courseFilterAll: 'すべて (24)',
    courseFilterModule: '第{id}部',
    courseLessonPrefix: '第',
    courseDoneBadge: '完了',
    coursePreviewBadge: '無料体験',
    courseFreePreviewLesson: '無料体験レッスン',
    courseMarkDone: '完了としてマーク',
    courseMarkedDone: '学習完了',
    courseIllStarsLabel: '本講義の重要星曜＆コア概念：',
    courseIllInstructor: '講師：トン先生',
    courseIllSub: 'ポッドキャスト＆実践カリキュラム',
    courseLockedBadge: '正式受講生専用コンテンツ',
    courseLockedTitle: 'わずか3秒でこのポッドキャスト講義＆テキストをアンロック',
    courseLockedDescHtml:
      'VietQRコードで <strong>699,000 VND</strong> をスキャン決済すると、トン先生の <strong>全24講ポッドキャスト＋14主星・副星・格局・運限テキスト</strong> が即座に自動解放されます。',
    courseLockedSummaryLabel: '✦ 第{num}講の収録内容プレビュー：',
    courseLockedElementsLabel: '五行＆化気：',
    courseLockedChaptersLabel: 'ポッドキャストチャプター ({dur})：',
    courseLockedQrBtn: 'QRスキャンで全24講をアンロック (699,000 VND)',
    courseLockedPreviewBtn: '第1講＆第2講の無料体験を聴く',
    coursePlayerTitle: 'トン先生の講義ポッドキャスト',
    coursePartLabel: 'パート',
    courseChapterLabel: 'チャプター',
    courseTranscriptLabel: 'ポッドキャスト講義トランスクリプト',
    courseStarMatchTitle: '本講義の星を個人の命盤とリアルタイム照合：',
    courseStarMatchYou: 'あなた',
    courseChangeChart: '別の命盤に切り替え →',
    courseCreateChartToMatch: '命盤を作成して星を自動照合する →',
    courseStarLabel: '星曜',
    coursePalaceLabel: '宮位',
    courseStatusLabel: '廟旺状態：',
    courseMajorAux: '重要副星',
    courseCoStarsLabel: '同宮する星：',
    courseNoChartHint1: '💡 ホームで無料命盤を作成すると、システムが自動的に',
    courseNoChartHint2: 'があなたの命盤のどの宮にあるかをこの枠内に表示します！',
    courseFlashcardTitle: '星曜クイック要約フラッシュカード＆古典口訣',
    courseFcElements: '五行＆化気：',
    courseFcDomain: '主な司り：',
    courseFcBrightness: '十二支における廟・旺・得・陥：',
    courseFcClassicVerse: '古典賦文＆コア原則：',
    courseNotesLabel: '第{num}講の個人学習ノート：',
    courseNotesSaved: '✓ 端末に自動保存されました',
    courseNotesPlaceholder: 'ご自身やご家族の命盤と照らし合わせて気づいた点をここにメモしましょう...',
    coursePrevLesson: '← 前の講義',
    courseNextLesson: '次の講義 (第{num}講)',
    courseMiniUnlockBtn: '全24講を解除 (699k)',
    courseAuthNotice: 'お支払い前にアカウント作成またはログイン（約5秒）を行っていただくことで、全24講コースの生涯アクセス権がアカウントに永久付与されます。',
  },
};

export function getLocalizedMetaphysicalBadge(code: string, lang: Language): string {
  if (lang === 'vi') {
    switch (code) {
      case 'P1':
      case 'P2':
      case 'P3':
        return 'Ấn Phẩm Luận Giải Mệnh Lý';
      case 'DV1':
      case 'DV2':
        return 'Tham Vấn Mệnh Lý & Định Hướng 1-1';
      case 'TR':
        return 'Chân Dung Chuyên Gia Mệnh Lý';
      case 'LH':
        return 'Liên Hệ & Đặt Lịch Tham Vấn';
      case 'C1':
        return 'Tổng Quan Phong Thủy & Cải Vận';
      case 'S1':
      case 'S2':
      case 'S3':
      case 'S4':
        return 'Phong Thủy Dương Trạch & Trạch Nhật';
      case 'B6':
      case 'B8':
      case 'B24':
      case 'B25':
        return 'Chuyên Khảo Phong Thủy & Mệnh Lý';
      case 'B1':
        return 'Cẩm Nang Nhập Môn Tử Vi Đẩu Số';
      default:
        return 'Chuyên Khảo Tinh Đẩu & Vận Hạn';
    }
  }
  const map: Record<string, Record<Exclude<Language, 'vi'>, string>> = {
    product: {
      en: 'Destiny Reading Edition',
      zh: '命理精批专刊',
      ko: '명리 심층 풀이본',
      ja: '命理深層鑑定書',
    },
    service: {
      en: '1-on-1 Destiny & Career Consultation',
      zh: '一对一命理与方向咨询',
      ko: '1:1 명리 및 진로 상담',
      ja: '1対1命理＆キャリア相談',
    },
    profile: {
      en: 'Portrait of a Zi Wei & Feng Shui Master',
      zh: '紫微与风水专家档案',
      ko: '자미두수 & 풍수 전문가 프로필',
      ja: '紫微斗数・風水専門家プロフィール',
    },
    contact: {
      en: 'Official Contact & Consultation Booking',
      zh: '官方联系方式与预约指南',
      ko: '공식 연락처 및 상담 예약',
      ja: '公式連絡先＆相談予約案内',
    },
    fengshui: {
      en: 'Yang House Feng Shui & Auspicious Dates',
      zh: '阳宅风水堪舆与择日吉时',
      ko: '양택 풍수지리 & 길일 택일',
      ja: '陽宅風水＆吉日択日',
    },
    intro: {
      en: 'Zi Wei Dou Shu Beginner’s Guide',
      zh: '紫微斗数入门指南',
      ko: '자미두수 입문 가이드',
      ja: '紫微斗数入門ガイド',
    },
    stars: {
      en: 'Stars, Palaces & Transit Monograph',
      zh: '星曜、宫位与运限专论',
      ko: '성요·궁위·운한 심층 연구',
      ja: '星曜・宮位・運限モノグラフ',
    },
  };
  const key =
    code === 'P1' || code === 'P2' || code === 'P3'
      ? 'product'
      : code === 'DV1' || code === 'DV2'
        ? 'service'
        : code === 'TR'
          ? 'profile'
          : code === 'LH'
            ? 'contact'
            : ['C1', 'S1', 'S2', 'S3', 'S4', 'B6', 'B24', 'B25'].includes(code)
              ? 'fengshui'
              : code === 'B1'
                ? 'intro'
                : 'stars';
  return map[key][lang];
}

export function getLocalizedFunnelPage(page: FunnelPageData, lang: Language): FunnelPageData {
  if (lang === 'vi') return page;

  const ui = EXTERNAL_PAGE_UI[lang];
  const localizedH1 = translateFunnelPageTitle(page.url, page.h1, lang);

  // Special comprehensive translation for /thay-ton (code === 'TR') and structured translations for all 37 funnel pages
  if (lang === 'en') {
    const isTr = page.code === 'TR';
    const quickSummaryHtml = isTr
      ? 'Master Ton (Tran Huy Ton) is a Zi Wei Dou Shu and Feng Shui expert with over 18 years of empirical research and the founder of Master Ton Zi Wei & Feng Shui. He is an alumnus of the Specialized Mathematics & Informatics High School (Hanoi University), holds both a Bachelor’s and a Master’s degree in Accounting & Finance from Lancaster University (United Kingdom), spent over 7 years studying and working in the UK, and has over 15 years of experience teaching IELTS, Communication English, and Cambridge IGCSE Mathematics, Science, Economics, Business, and Geography.'
      : `<strong>${localizedH1}</strong> is compiled and academically reviewed by <strong>Master Ton (Tran Huy Ton)</strong> on the Master Ton Zi Wei & Feng Shui platform. You can cast your 12-palace natal chart with 110+ stars and receive a ~1,000-word Foundation Reading completely free (0 VND), or unlock the <strong>Pro Deep Reading (119,000 VND)</strong> and <strong>12-Palace Grandmaster Expert Reading (269,000 VND)</strong> — paying only the 150,000 VND difference when upgrading.`;

    const introHtml = isTr
      ? 'An accurate Zi Wei Dou Shu reading requires both classical metaphysical depth and rigorous analytical logic. Below is the complete academic profile, research methodology, and consultation framework of <a href="/" class="text-amber-400 hover:text-amber-300 underline underline-offset-4 font-semibold">Master Ton Zi Wei & Feng Shui</a>.'
      : `In Zi Wei Dou Shu, understanding <strong>${localizedH1}</strong> requires examining the full Three Harmonies and Four的正 (San Fang Si Zheng) star formations alongside your 10-year Major Limit and Annual Transit rather than isolated stars. Start by casting your personal chart on our <a href="/#lap-la-so" class="text-amber-400 hover:text-amber-300 underline underline-offset-4 font-semibold">Free Zi Wei Chart Caster</a>.`;

    const bodyHtml = `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">1. Core Principles & Analytical Framework for ${localizedH1}</h2>
<p class="text-slate-300 leading-relaxed my-4">Every reading and specialized monograph by Master Ton follows a strict, verifiable 4-step analytical framework rooted in Mathematical Logic and 18+ years of empirical chart verification:</p>
<ol class="list-decimal pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed">
  <li class="pl-1"><strong class="text-slate-100 font-semibold">Star Formations Over Isolated Stars:</strong> Evaluating the 14 Major Stars, Six Auspicious & Six Malefic Stars, Four Transformations (Hua Lu, Hua Quan, Hua Ke, Hua Ji), and Tuan/Triet across the target palace and its Three Harmonies (Life – Wealth – Career – Travel).</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">Multi-Layer Timeline Synchronization:</strong> Cross-referencing the Natal Chart (innate potential), the 10-Year Major Limit (decade environment), and the 3-Layer Annual Transit (Minor Limit, Annual Major Limit, and Annual Tai Sui).</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">Cross-Verification with Physiognomy:</strong> Combining the 108-star chart with Face Reading (Three Courtyards & Five Features) and Palmistry to verify birth-hour accuracy and current vitality.</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">Practical Strategy Without Superstition:</strong> Providing clear timing for career, finance, property, and family decisions — strictly zero fear-mongering or ritual upselling.</li>
</ol>
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">2. Comparison of Reading Tiers on Master Ton’s System</h2>
<div class="my-6 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-lg">
  <table class="w-full text-left border-collapse text-sm">
    <thead>
      <tr class="bg-slate-800/90 border-b border-slate-700 text-amber-300">
        <th class="py-3.5 px-4 font-bold">Criteria</th>
        <th class="py-3.5 px-4 font-bold">Foundation Edition</th>
        <th class="py-3.5 px-4 font-bold">Pro Deep Edition</th>
        <th class="py-3.5 px-4 font-bold">Expert 12-Palace Edition</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-800/80">
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">Price</td><td class="py-3 px-4 text-emerald-300 font-semibold">Free (0 VND)</td><td class="py-3 px-4 text-amber-300 font-semibold">119,000 VND</td><td class="py-3 px-4 text-purple-300 font-semibold">269,000 VND (or +150k upgrade)</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">Length</td><td class="py-3 px-4 text-slate-300">~1,000 words</td><td class="py-3 px-4 text-slate-300">~2,500 words</td><td class="py-3 px-4 text-slate-300">~4,500 – 6,000 words</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">Scope</td><td class="py-3 px-4 text-slate-300">Life Element, Life-Wealth-Career Triad, Body Palace</td><td class="py-3 px-4 text-slate-300">14 Major Stars, Four Transformations, 4-Season Transit</td><td class="py-3 px-4 text-slate-300">All 12 Palaces & 12 Lunar Months (Months 1–12)</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">Bonus Included</td><td class="py-3 px-4 text-slate-300">Save to Notebook, Image & PDF export</td><td class="py-3 px-4 text-slate-300">2 Deep AI Questions (worth 99,000 VND)</td><td class="py-3 px-4 text-slate-300">2 Expert AI Questions (worth 129,000 VND)</td></tr>
    </tbody>
  </table>
</div>
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">3. Academic Credentials & Empirical Research of Master Ton</h2>
<p class="text-slate-300 leading-relaxed my-4">Master Ton graduated from the Specialized Mathematics & Informatics block at Hanoi University and earned both his <strong>Bachelor’s and Master’s degrees in Accounting & Finance at Lancaster University (Top 5 UK)</strong>. Combining quantitative risk management with over 18 years of Zi Wei Dou Shu, Physiognomy, and Yang House Feng Shui research, every interpretation clearly cites the exact palace, star formation, and transit period so readers can verify every point directly on their chart.</p>`;

    const faqs: FunnelFaq[] = [
      {
        question: 'Is casting a Zi Wei natal chart and receiving the Foundation Reading really free?',
        answerHtml:
          'Yes. Casting a full 12-palace chart with 110+ stars and receiving the ~1,000-word Foundation Reading is 100% free (0 VND) with no account required. You only pay if you choose to unlock the Pro Edition (119,000 VND) or Expert Edition (269,000 VND).',
        answerText:
          'Yes. Casting a full 12-palace chart with 110+ stars and receiving the ~1,000-word Foundation Reading is 100% free (0 VND) with no account required.',
      },
      {
        question: 'How much does it cost to upgrade from Pro (119,000 VND) to Expert (269,000 VND)?',
        answerHtml:
          'You only pay the 150,000 VND difference (269,000 VND minus 119,000 VND) for the same chart. The VietQR code automatically calculates the difference.',
        answerText: 'You only pay the 150,000 VND difference for the same chart.',
      },
      {
        question: 'How can I book a 1-on-1 consultation with Master Ton?',
        answerHtml:
          'Message or call Zalo <strong>0935 058 688</strong> to schedule an appointment in advance. In-person sessions take place at Royal City Urban Area, Thanh Xuan, Hanoi, and online Video Call sessions are available worldwide.',
        answerText: 'Message or call Zalo 0935 058 688 to schedule an in-person session at Royal City, Hanoi or via Video Call.',
      },
    ];

    const closingHtml = `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">Next Step: Apply This Directly to Your Natal Chart</h2>
<p class="text-slate-300 leading-relaxed my-4">Enter your birth details on the homepage in 30 seconds to generate your natal chart and read your Free Foundation analysis, or book a 1-on-1 consultation with Master Ton via Zalo 0935 058 688.</p>`;

    return {
      ...page,
      h1: localizedH1,
      authorLine: ui.authorLine,
      quickSummaryHtml,
      quickSummaryText: quickSummaryHtml.replace(/<[^>]+>/g, ''),
      introHtml,
      bodyHtml,
      faqs,
      closingHtml,
      primaryCta: {
        ...page.primaryCta,
        label: page.code === 'P1' ? 'Unlock Pro Reading (119,000 VND)' : page.code === 'P2' ? 'Unlock Expert Reading (269,000 VND)' : 'Cast Free Natal Chart (0 VND)',
      },
      secondaryCta: {
        ...page.secondaryCta,
        label: 'Book 1-on-1 via Zalo (0935 058 688)',
      },
    };
  }

  if (lang === 'zh') {
    const isTr = page.code === 'TR';
    const quickSummaryHtml = isTr
      ? '孙老师 (Trần Huy Tôn) 是拥有超过 18 年实证研究经验的紫微斗数与风水专家，亦是“孙老师紫微斗数与风水”系统创始人。孙老师毕业于河内综合大学数学与信息学特长班，拥有英国兰卡斯特大学 (Lancaster University) 会计与金融学士及硕士学位，留英学习与工作逾 7 年，并拥有 15 年以上 IELTS 及剑桥 IGCSE 数学、科学、经济、商科与地理教学经验。'
      : `<strong>${localizedH1}</strong> 由 <strong>孙老师 (Trần Huy Tôn)</strong> 亲自编撰与学术审定。您可在首页免费排定包含 110+ 星曜的十二宫命盘并获取约 1,000 字的启源版命书 (0 VND)，或按需解锁 <strong>专业精批版 Pro (119,000 VND)</strong> 与 <strong>十二宫大宗师版 Expert (269,000 VND)</strong>（升级仅需补差价 150,000 VND）。`;

    const introHtml = `<p class="text-slate-200 leading-relaxed">在紫微斗数中，深入理解 <strong>${localizedH1}</strong> 必须兼顾本宫与三方四正（命、财、官、迁）的星曜组合及十年大运、流年飞星，切忌单看一颗星曜妄下定论。您可先在 <a href="/#lap-la-so" class="text-amber-400 hover:text-amber-300 underline underline-offset-4 font-semibold">免费紫微排盘工具</a> 生成个人命盘进行对照。</p>`;

    const bodyHtml = `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">1. ${localizedH1} 的核心法则与实证框架</h2>
<p class="text-slate-300 leading-relaxed my-4">孙老师系统的每一份命书与专题研究均遵循严密的四大实证原则，将数理逻辑与 18+ 年命理经验深度结合：</p>
<ol class="list-decimal pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed">
  <li class="pl-1"><strong class="text-slate-100 font-semibold">重格局组合、忌单星独断：</strong> 综合审视十四主星、六吉六煞、四化飞星（化禄、化权、化科、化忌）及旬空截空在三方四正的互动。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">三重时间轴同步推演：</strong> 将先天原局、十年大运与流年三限（小限、流年大限、流太岁）叠合分析。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">紫微与面相手相合参：</strong> 在 Pro 与 Expert 版中结合面相（三停五官）与手相三大主线，降低出生时辰微差带来的偏误。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">客观务实、拒绝迷信恐吓：</strong> 明确指出每一项判断所依据的宫位与星曜，绝不推销法事或天价吉祥物。</li>
</ol>
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">2. 三大命盘精批方案对比</h2>
<div class="my-6 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-lg">
  <table class="w-full text-left border-collapse text-sm">
    <thead>
      <tr class="bg-slate-800/90 border-b border-slate-700 text-amber-300">
        <th class="py-3.5 px-4 font-bold">对比维度</th>
        <th class="py-3.5 px-4 font-bold">启源免费版</th>
        <th class="py-3.5 px-4 font-bold">专业精批版 Pro</th>
        <th class="py-3.5 px-4 font-bold">专家全解版 Expert</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-800/80">
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">费用</td><td class="py-3 px-4 text-emerald-300 font-semibold">免费 (0 VND)</td><td class="py-3 px-4 text-amber-300 font-semibold">119,000 VND</td><td class="py-3 px-4 text-purple-300 font-semibold">269,000 VND（升级仅补 150k）</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">篇幅字数</td><td class="py-3 px-4 text-slate-300">约 1,000 字</td><td class="py-3 px-4 text-slate-300">约 2,500 字</td><td class="py-3 px-4 text-slate-300">约 4,500 – 6,000 字</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">批算范围</td><td class="py-3 px-4 text-slate-300">本命局、命财官三合、身宫与十年大运</td><td class="py-3 px-4 text-slate-300">十四主星、四化、庙旺利陷与四季流年运限</td><td class="py-3 px-4 text-slate-300">完整十二宫详批 + 农历一至十二月流月运势</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">附赠权益</td><td class="py-3 px-4 text-slate-300">保存手帐、导出高清图与 PDF</td><td class="py-3 px-4 text-slate-300">赠送 2 次深度 AI 问答（价值 99k）</td><td class="py-3 px-4 text-slate-300">赠送 2 次专家级 AI 问答（价值 129k）</td></tr>
    </tbody>
  </table>
</div>
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">3. 孙老师学术背景与英国兰卡斯特大学资历</h2>
<p class="text-slate-300 leading-relaxed my-4">孙老师早年就读于河内综合大学数学与信息特长班，后赴英深造并取得<strong>英国兰卡斯特大学 (Lancaster University，全英前五) 会计与金融学士及硕士学位</strong>。凭借严谨的数理逻辑与金融风控思维，孙老师将传统紫微斗数、相法与阳宅风水转化为清晰可验的决策参考。</p>`;

    const faqs: FunnelFaq[] = [
      {
        question: '在孙老师平台排盘并获取启源版命书真的完全免费吗？',
        answerHtml: '是的。排定 110+ 星曜命盘并获取约 1,000 字的启源版命书完全免费 (0 VND)，无需注册账号。仅在您主动选择解锁 Pro 版 (119,000 VND) 或 Expert 版 (269,000 VND) 时才需付费。',
        answerText: '是的，排盘与启源版命书完全免费 (0 VND)。',
      },
      {
        question: '已购买 Pro 版 (119,000 VND)，升级到 Expert 版 (269,000 VND) 需付多少？',
        answerHtml: '仅需补齐 150,000 VND 差价，系统二维码会自动按差价生成。',
        answerText: '仅需补齐 150,000 VND 差价。',
      },
      {
        question: '如何预约孙老师的一对一当面或视频咨询？',
        answerHtml: '请通过 Zalo 或电话 <strong>0935 058 688</strong> 提前预约。河内地区可在青春郡皇家城 (Royal City) 面谈，外省及海外客户支持高清视频连线。',
        answerText: '请通过 Zalo 0935 058 688 提前预约。',
      },
    ];

    const closingHtml = `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">下一步：立即在您的个人命盘上印证</h2>
<p class="text-slate-300 leading-relaxed my-4">只需 30 秒输入生辰信息，即可获取您的免费启源命书，或通过 Zalo 0935 058 688 预约孙老师一对一深度咨询。</p>`;

    return {
      ...page,
      h1: localizedH1,
      authorLine: ui.authorLine,
      quickSummaryHtml,
      quickSummaryText: quickSummaryHtml.replace(/<[^>]+>/g, ''),
      introHtml,
      bodyHtml,
      faqs,
      closingHtml,
      primaryCta: {
        ...page.primaryCta,
        label: '免费排盘并获取命书 (0 VND)',
      },
      secondaryCta: {
        ...page.secondaryCta,
        label: '预约孙老师一对一咨询 (Zalo 0935 058 688)',
      },
    };
  }

  if (lang === 'ko') {
    const isTr = page.code === 'TR';
    const quickSummaryHtml = isTr
      ? '선생 톤(Trần Huy Tôn)은 18년 이상의 실증 연구 경력을 지닌 자미두수 및 풍수지리 전문가이자 “선생 톤 자미두수 & 풍수”의 창립자입니다. 하노이 종합대학교 수학·정보 영재반을 졸업하고 영국 랭커스터 대학교(Lancaster University)에서 회계·재무학 학사 및 석사 학위를 취득했으며, 영국에서 7년 이상 유학·근무하고 15년 이상 IELTS 및 캠브리지 IGCSE 수학, 과학, 경제, 비즈니스, 지리를 강의해 왔습니다.'
      : `<strong>${localizedH1}</strong> 가이드는 <strong>선생 톤(Trần Huy Tôn)</strong>이 직접 편찬하고 감수했습니다. 홈에서 110개 이상의 성요가 배치된 12궁 명반과 약 1,000단어 분량의 기본 풀이본을 완전 무료(0 VND)로 받아보시거나, <strong>심층 Pro본(119,000 VND)</strong> 및 <strong>12궁 전문가 Expert본(269,000 VND)</strong>을 잠금 해제(업그레이드 시 차액 150,000 VND만 결제)하실 수 있습니다.`;

    const introHtml = `<p class="text-slate-200 leading-relaxed">자미두수에서 <strong>${localizedH1}</strong>을 정확히 이해하려면 개별 성요 하나만 보는 것이 아니라 삼방사정(명궁·재백궁·관록궁·천이궁)의 성요 조합과 10년 대운, 유년 운한을 함께 살펴야 합니다. 먼저 <a href="/#lap-la-so" class="text-amber-400 hover:text-amber-300 underline underline-offset-4 font-semibold">무료 자미두수 명반 도구</a>에서 본인의 명반을 작성해 보세요.</p>`;

    const bodyHtml = `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">1. ${localizedH1} 핵심 원리 및 4단계 실증 분석 프레임워크</h2>
<p class="text-slate-300 leading-relaxed my-4">선생 톤 시스템의 모든 리포트와 가이드는 수리적 논리와 18년 이상의 실증 데이터를 결합한 4대 원칙을 따릅니다:</p>
<ol class="list-decimal pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed">
  <li class="pl-1"><strong class="text-slate-100 font-semibold">단일 성요가 아닌 격국(格局) 중심 해독:</strong> 14주성, 육길성·육살성, 사화(화록·화권·화과·화기), 순공·절공의 삼방사정 상호작용을 종합 분석합니다.</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">3중 시간축 동기화:</strong> 선천 명반, 10년 대운, 그리고 유년 3대 궁위(소한·유년대한·유태세)를 입체적으로 대조합니다.</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">관상·수상 교차 검증:</strong> Pro 및 Expert 버전에서는 관상(삼정오관) 및 수상 3대선을 함께 대조하여 출생 시辰 오차를 줄입니다.</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">미신 배제 & 실용적 전략 제시:</strong> 모든 판단의 근거가 되는 궁위와 성요를 명확히 밝히며, 공포 조장이나 굿·부적 강요를 철저히 배제합니다.</li>
</ol>
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">2. 3가지 명반 풀이 패키지 비교</h2>
<div class="my-6 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-lg">
  <table class="w-full text-left border-collapse text-sm">
    <thead>
      <tr class="bg-slate-800/90 border-b border-slate-700 text-amber-300">
        <th class="py-3.5 px-4 font-bold">비교 항목</th>
        <th class="py-3.5 px-4 font-bold">기본 무료본</th>
        <th class="py-3.5 px-4 font-bold">심층 Pro본</th>
        <th class="py-3.5 px-4 font-bold">전문가 Expert본</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-800/80">
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">가격</td><td class="py-3 px-4 text-emerald-300 font-semibold">무료 (0 VND)</td><td class="py-3 px-4 text-amber-300 font-semibold">119,000 VND</td><td class="py-3 px-4 text-purple-300 font-semibold">269,000 VND (업그레이드 +150k)</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">분량</td><td class="py-3 px-4 text-slate-300">약 1,000단어</td><td class="py-3 px-4 text-slate-300">약 2,500단어</td><td class="py-3 px-4 text-slate-300">약 4,500 – 6,000단어</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">풀이 범위</td><td class="py-3 px-4 text-slate-300">본명국, 명·재·관 삼합, 신궁, 10년 대운</td><td class="py-3 px-4 text-slate-300">14주성, 사화, 묘왕함지 및 사계절 운한</td><td class="py-3 px-4 text-slate-300">12궁 전체 정밀 분석 + 음력 1~12월 월별 운세</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">제공 혜택</td><td class="py-3 px-4 text-slate-300">수첩 저장, 이미지 및 PDF 다운로드</td><td class="py-3 px-4 text-slate-300">심층 AI 질문 2회 제공 (99k 상당)</td><td class="py-3 px-4 text-slate-300">전문가 AI 질문 2회 제공 (129k 상당)</td></tr>
    </tbody>
  </table>
</div>
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">3. 선생 톤의 학술적 배경 및 영국 랭커스터 대학교 학위</h2>
<p class="text-slate-300 leading-relaxed my-4">선생 톤은 하노이 종합대학교 수학·정보 영재반을 거쳐 <strong>영국 랭커스터 대학교(Lancaster University, 영국 Top 5)에서 회계·재무학 학사 및 석사 학위</strong>를 취득했습니다. 수리적 논리와 재무 리스크 관리 사고방식을 바탕으로 전통 자미두수, 관상·수상, 양택 풍수를 누구나 검증할 수 있는 명확한 의사결정 지침으로 풀어냅니다.</p>`;

    const faqs: FunnelFaq[] = [
      {
        question: '선생 톤 플랫폼에서 명반 작성과 기본 풀이는 정말 무료인가요?',
        answerHtml: '네, 110개 이상의 성요가 포함된 12궁 명반 작성과 약 1,000단어 분량의 기본 풀이는 회원가입 없이 100% 무료(0 VND)입니다.',
        answerText: '네, 명반 작성과 기본 풀이는 100% 무료(0 VND)입니다.',
      },
      {
        question: 'Pro본(119,000 VND) 구매 후 Expert본(269,000 VND)으로 업그레이드하려면 얼마를 내야 하나요?',
        answerHtml: '동일한 명반에 대해 차액인 150,000 VND만 추가 결제하시면 됩니다.',
        answerText: '차액인 150,000 VND만 추가 결제하시면 됩니다.',
      },
      {
        question: '선생 톤과의 1:1 대면 또는 화상 상담은 어떻게 예약하나요?',
        answerHtml: 'Zalo 또는 전화 <strong>0935 058 688</strong>로 사전 예약해 주세요. 하노이 로열 시티(Royal City) 대면 상담 및 전 세계 화상 상담을 지원합니다.',
        answerText: 'Zalo 0935 058 688로 사전 예약해 주세요.',
      },
    ];

    const closingHtml = `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">다음 단계: 내 명반에서 직접 확인하기</h2>
<p class="text-slate-300 leading-relaxed my-4">홈에서 30초 만에 생년월일시를 입력해 무료 명반과 기본 풀이를 확인하거나, Zalo 0935 058 688을 통해 선생 톤과의 1:1 상담을 예약하세요.</p>`;

    return {
      ...page,
      h1: localizedH1,
      authorLine: ui.authorLine,
      quickSummaryHtml,
      quickSummaryText: quickSummaryHtml.replace(/<[^>]+>/g, ''),
      introHtml,
      bodyHtml,
      faqs,
      closingHtml,
      primaryCta: {
        ...page.primaryCta,
        label: '무료 명반 작성하기 (0 VND)',
      },
      secondaryCta: {
        ...page.secondaryCta,
        label: '선생 톤 1:1 상담 예약 (Zalo 0935 058 688)',
      },
    };
  }

  // Japanese (ja)
  const isTr = page.code === 'TR';
  const quickSummaryHtml = isTr
    ? 'トン先生（Trần Huy Tôn）は18年以上の実証研究歴を持つ紫微斗数・風水の専門家であり、「トン先生の紫微斗数＆風水」の創설者です。ハノイ総合大学付属の数学・情報特進クラス出身で、英国ランカスター大学（Lancaster University）にて会計・ファイナンスの学士号および修士号を取得。英国での7年以上の留学・勤務経験に加え、IELTSやケンブリッジIGCSE（数学・科学・経済・ビジネス・地理）の指導歴15年以上を誇ります。'
    : `<strong>${localizedH1}</strong> は、<strong>トン先生（Trần Huy Tôn）</strong>により編纂・学術監修されています。ホーム画面から110以上の星を配置した十二宮命盤と約1,000語の基本鑑定を完全無料（0 VND）で受け取れるほか、<strong>専門Pro版（119,000 VND）</strong>や<strong>12宮大宗師Expert版（269,000 VND）</strong>（アップグレード時は差額150,000 VNDのみ）をアンロックできます。`;

  const introHtml = `<p class="text-slate-200 leading-relaxed">紫微斗数において <strong>${localizedH1}</strong> を正しく理解するには、単一の星だけを見るのではなく、三方四正（命宮・財帛宮・官禄宮・遷移宮）の星の組み合わせと10年大運・流年運限を総合的に読み解く必要があります。まずは <a href="/#lap-la-so" class="text-amber-400 hover:text-amber-300 underline underline-offset-4 font-semibold">無料紫微斗数命盤作成ツール</a> でご自身の命盤を作成してみてください。</p>`;

  const bodyHtml = `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">1. ${localizedH1} の核心原則と4ステップ実証フレームワーク</h2>
<p class="text-slate-300 leading-relaxed my-4">トン先生のシステムにおけるすべての鑑定書と専門ガイドは、数理的論理と18年以上の実証研究に基づく4つの原則に従っています：</p>
<ol class="list-decimal pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed">
  <li class="pl-1"><strong class="text-slate-100 font-semibold">単独の星ではなく格局（星の組み合わせ）で読む：</strong> 14主星、六吉星・六煞星、四化（化禄・化権・化科・化忌）、旬空・截空の三方四正における相互作用を分析します。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">3層の時間軸の同期：</strong> 先天命盤、10年大運、そして3つの流年運限宮（小限・流年大限・流太歳）を重ね合わせて判定します。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">顔相・手相とのクロス検証：</strong> Pro版およびExpert版では顔相（三停五官）や手相三大線も照合し、出生時刻のわずかな誤差によるブレを抑えます。</li>
  <li class="pl-1"><strong class="text-slate-100 font-semibold">迷信を排した実践的戦略：</strong> すべての判断根拠となる宮と星を明示し、不安を煽るようなお祓いや高額開運グッズの勧誘は一切行いません。</li>
</ol>
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">2. 3つの命盤鑑定プラン比較表</h2>
<div class="my-6 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-lg">
  <table class="w-full text-left border-collapse text-sm">
    <thead>
      <tr class="bg-slate-800/90 border-b border-slate-700 text-amber-300">
        <th class="py-3.5 px-4 font-bold">比較項目</th>
        <th class="py-3.5 px-4 font-bold">起原無料版</th>
        <th class="py-3.5 px-4 font-bold">専門Pro版</th>
        <th class="py-3.5 px-4 font-bold">大宗師Expert版</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-800/80">
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">料金</td><td class="py-3 px-4 text-emerald-300 font-semibold">無料 (0 VND)</td><td class="py-3 px-4 text-amber-300 font-semibold">119,000 VND</td><td class="py-3 px-4 text-purple-300 font-semibold">269,000 VND（差額+150kで昇格可）</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">文字数目安</td><td class="py-3 px-4 text-slate-300">約1,000語</td><td class="py-3 px-4 text-slate-300">約2,500語</td><td class="py-3 px-4 text-slate-300">約4,500〜6,000語</td></tr>
      <tr class="bg-slate-900/40"><td class="py-3 px-4 text-slate-200 font-medium">鑑定範囲</td><td class="py-3 px-4 text-slate-300">本命局、命・財・官三合、身宮、10年大運</td><td class="py-3 px-4 text-slate-300">14主星、四化、廟旺陥地、四季の運勢</td><td class="py-3 px-4 text-slate-300">全12宮の徹底解剖＋旧暦1〜12月の月別運勢</td></tr>
      <tr class="bg-slate-900/80"><td class="py-3 px-4 text-slate-200 font-medium">特典</td><td class="py-3 px-4 text-slate-300">手帳保存、画像・PDF出力</td><td class="py-3 px-4 text-slate-300">深層AI質問2回付き（99k相当）</td><td class="py-3 px-4 text-slate-300">専門AI質問2回付き（129k相当）</td></tr>
    </tbody>
  </table>
</div>
<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">3. トン先生の学術的経歴と英国ランカスター大学での学位</h2>
<p class="text-slate-300 leading-relaxed my-4">トン先生はハノイ総合大学付属の数学・情報特進クラスを経て、<strong>英国ランカスター大学（Lancaster University・英国トップ5）にて会計・ファイナンスの学士号および修士号</strong>を取得しました。数理的思考とファイナンスのリスク管理手法を融合し、伝統的な紫微斗数・相法・陽宅風水を誰もが検証可能な実践的指針へと体系化しています。</p>`;

  const faqs: FunnelFaq[] = [
    {
      question: 'トン先生のサイトでの命盤作成と基本鑑定は本当に無料ですか？',
      answerHtml: 'はい。110以上の星を配置する12宮命盤の作成と約1,000語の起原版鑑定は、会員登録不要で完全無料（0 VND）です。',
      answerText: 'はい、命盤作成と起原版鑑定は完全無料（0 VND）です。',
    },
    {
      question: 'Pro版（119,000 VND）購入後、Expert版（269,000 VND）へアップグレードする費用は？',
      answerHtml: '同じ命盤であれば、差額の 150,000 VND のみのお支払いでアップグレード可能です。',
      answerText: '差額の 150,000 VND のみでアップグレード可能です。',
    },
    {
      question: 'トン先生との1対1対面・オンライン相談はどのように予約しますか？',
      answerHtml: 'Zaloまたはお電話 <strong>0935 058 688</strong> にて事前予約をお願いいたします。ハノイ市ロイヤルシティ（Royal City）での対面相談および世界中からのビデオ通話相談に対応しています。',
      answerText: 'Zalo 0935 058 688 にて事前予約をお願いいたします。',
    },
  ];

  const closingHtml = `<h2 class="text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800">次のステップ：あなたの命盤で直接確認しましょう</h2>
<p class="text-slate-300 leading-relaxed my-4">ホーム画面から30秒で生年月日・出生時刻を入力して無料鑑定を受け取るか、Zalo 0935 058 688 よりトン先生との1対1相談をご予約ください。</p>`;

  return {
    ...page,
    h1: localizedH1,
    authorLine: ui.authorLine,
    quickSummaryHtml,
    quickSummaryText: quickSummaryHtml.replace(/<[^>]+>/g, ''),
    introHtml,
    bodyHtml,
    faqs,
    closingHtml,
    primaryCta: {
      ...page.primaryCta,
      label: '無料で命盤を作成する (0 VND)',
    },
    secondaryCta: {
      ...page.secondaryCta,
      label: 'トン先生との1対1相談予約 (Zalo 0935 058 688)',
    },
  };
}

export function getLocalizedFunnelGroups(lang: Language) {
  if (lang === 'vi') {
    return [
      {
        groupNum: 1,
        badge: 'LUẬN MỆNH & THAM VẤN • ẤN PHẨM CHUYÊN SÂU',
        title: 'Hệ Thống Luận Giải Lá Số, Hỏi Đáp AI & Xem Trực Tiếp 1-1',
        desc: 'Tìm hiểu chi tiết các mức luận giải (Khởi Nguyên 0đ, Chuyên Sâu Pro 119.000đ, Chuyên Gia Expert 269.000đ — nâng cấp chỉ trả phần chênh lệch 150.000đ), Hỏi đáp AI Thầy Tôn và Đặt lịch xem trực tiếp 1-1 tại Royal City, Hà Nội.',
        color: 'amber',
      },
      {
        groupNum: 2,
        badge: 'PHONG THỦY & TRẠCH NHẬT • ĐỊA LỢI CẢI VẬN',
        title: 'Tư Vấn Phong Thủy Nhà Ở, Văn Phòng, Cải Vận & Xem Ngày Tốt',
        desc: 'Kết hợp Thiên thời (Lá số Tử Vi) và Địa lợi (Phong Thủy Dương Trạch): bố trí nhà ở, chung cư, văn phòng, cửa hàng, chọn ngày động thổ - nhập trạch - khai trương và xem tuổi làm nhà năm 2027.',
        color: 'emerald',
      },
      {
        groupNum: 3,
        badge: 'TINH ĐẨU & VẬN HẠN • HUYỀN CƠ ĐẨU SỐ',
        title: 'Cẩm Nang Đọc Lá Số Tử Vi: 12 Cung, 14 Chính Tinh, Tứ Hóa & Vận Hạn 2027',
        desc: 'Hướng dẫn bài bản cho người mới: cách đọc 12 cung, bảng 14 chính tinh đắc/hãm địa, bảng Tứ Hóa 10 Thiên Can, Mệnh vô chính diệu, cách tìm lại giờ sinh và tử vi năm 2027 Đinh Mùi.',
        color: 'indigo',
      },
    ];
  }

  const map: Record<Exclude<Language, 'vi'>, { badge: string; title: string; desc: string }[]> = {
    en: [
      {
        badge: 'DESTINY READINGS & CONSULTATION • DEEP EDITIONS',
        title: 'Natal Chart Readings, AI Q&A & 1-on-1 Consultations',
        desc: 'Explore all reading tiers (Free Foundation 0 VND, Pro 119,000 VND, Expert 269,000 VND — upgrade for only the 150,000 VND difference), Master Ton AI Q&A, and 1-on-1 consultations at Royal City, Hanoi or via Video Call.',
      },
      {
        badge: 'FENG SHUI & AUSPICIOUS DATES • SPATIAL HARMONY',
        title: 'Home & Office Feng Shui, Luck Enhancement & Date Selection',
        desc: 'Integrate Heaven’s Timing (Zi Wei Chart) with Earthly Harmony (Yang House Feng Shui): residential & apartment layout, office setup, auspicious dates for groundbreaking & grand opening, and 2027 home-building ages.',
      },
      {
        badge: 'STARS, PALACES & TRANSITS • ZI WEI DOU SHU MASTERY',
        title: 'Zi Wei Chart Reading Guide: 12 Palaces, 14 Major Stars, Four Transformations & 2027 Forecast',
        desc: 'Structured guides for beginners and practitioners: reading the 12 palaces, 14 Major Stars brightness table, Four Transformations across 10 Heavenly Stems, Empty Life Palace, birth-hour verification, and 2027 Ding Wei forecasts.',
      },
    ],
    zh: [
      {
        badge: '命理精批与咨询 • 深度命书方案',
        title: '命盘精批方案、孙老师 AI 问答与一对一亲算',
        desc: '详细了解各级命书方案（启源版 0 VND、专业版 Pro 119,000 VND、专家版 Expert 269,000 VND — 升级仅补差价 150,000 VND）、孙老师 AI 问答以及河内 Royal City 一对一面谈或视频咨询。',
      },
      {
        badge: '风水堪舆与择日 • 地利改运布局',
        title: '住宅、公寓、办公室风水堪舆、用神改运与择日吉时',
        desc: '结合天时（紫微命盘）与地利（阳宅风水）：住宅公寓布局、办公桌与收银台财位、动土入宅开业择日，以及 2027 丁未年建房与开业吉龄。',
      },
      {
        badge: '星曜与运限 • 紫微斗数玄机',
        title: '紫微斗数读盘指南：十二宫、十四主星、四化飞星与 2027 流年运势',
        desc: '系统化入门与进阶指南：十二宫读盘五步法、十四主星庙旺利陷表、十天干四化表、命无正曜解析、出生时辰反推法及 2027 丁未年十二生肖流年运势。',
      },
    ],
    ko: [
      {
        badge: '명리 풀이 및 상담 • 심층 리포트',
        title: '명반 풀이 패키지, AI 질의응답 & 1:1 대면/화상 상담',
        desc: '단계별 풀이 리포트(기본본 0 VND, Pro본 119,000 VND, Expert본 269,000 VND — 업그레이드 시 차액 150,000 VND만 결제), 선생 톤 AI 질의응답 및 하노이 로열 시티 1:1 대면/화상 상담 안내.',
      },
      {
        badge: '풍수지리 및 택일 • 공간 개운법',
        title: '주거·사무실 풍수 컨설팅, 용신 개운 & 길일 택일',
        desc: '천시(자미두수 명반)와 지리(양택 풍수)의 결합: 주택·아파트 배치, 사무실·매장 풍수, 착공·이사·개업 길일 택일 및 2027년 정미년 건축·개업 길령 분석.',
      },
      {
        badge: '성요 및 운한 • 자미두수 핵심',
        title: '자미두수 명반 해독 가이드: 12궁, 14주성, 사화 & 2027년 운세',
        desc: '입문자부터 실전까지 체계적인 가이드: 12궁 해독 5단계, 14주성 묘왕함지표, 10천간 사화표, 명무정요 해석, 출생 시辰 역추적 및 2027년 정미년 12띠 운세.',
      },
    ],
    ja: [
      {
        badge: '命理鑑定＆相談 • 深層鑑定書プラン',
        title: '命盤鑑定プラン、トン先生AI Q&A＆1対1対面・オンライン相談',
        desc: '各鑑定プラン（無料起原版 0 VND、専門Pro版 119,000 VND、大宗師Expert版 269,000 VND — 差額150,000 VNDのみで昇格可）、AI Q&A、およびハノイ・ロイヤルシティでの1対1相談のご案内。',
      },
      {
        badge: '風水＆択日 • 空間開運アプローチ',
        title: '住宅・オフィス風水鑑定、用神開運＆吉日選び（択日）',
        desc: '天時（紫微斗数命盤）と地利（陽宅風水）の融合：戸建て・マンション配置、オフィス・店舗風水、地鎮祭・引越し・開業の吉日選び、2027年丁未年の建築・開業吉齢。',
      },
      {
        badge: '星曜・十二宮・運限 • 紫微斗数の真髄',
        title: '紫微斗数命盤読解ガイド：12宮、14主星、四化＆2027年運勢',
        desc: '初心者から実践者までの体系的ガイド：12宮読解5ステップ、14主星の廟旺陥地表、十干四化表、命無正曜の解釈、出生時刻の特定法、および2027年丁未年の十二支別運勢。',
      },
    ],
  };

  const colors = ['amber', 'emerald', 'indigo'];
  return map[lang].map((item, idx) => ({
    groupNum: idx + 1,
    badge: item.badge,
    title: item.title,
    desc: item.desc,
    color: colors[idx],
  }));
}

export function getLocalizedStageMeta(stage: FunnelStage, lang: Language) {
  const colors: Record<FunnelStage, 'emerald' | 'amber' | 'purple' | 'blue'> = {
    TOFU: 'emerald',
    MOFU: 'amber',
    USP_GEO: 'purple',
    BOFU: 'blue',
  };
  if (lang === 'vi') {
    const viMap: Record<FunnelStage, { name: string; shortLabel: string; goal: string }> = {
      TOFU: {
        name: 'Khai Mở Mệnh Lý: Nhập Môn An Sao & Vận Hạn Lưu Niên',
        shortLabel: 'Khai Mở Mệnh Lý • Tinh Đẩu & Lưu Niên',
        goal: 'Hệ thống kiến thức nền tảng về cách an sao lập lá số, giải mã các cách cục đặc biệt và vận hạn lưu niên.',
      },
      MOFU: {
        name: 'Luận Giải Cung Vị: Tài Bạch, Quan Lộc, Phu Thê & Hóa Giải Sát Tinh',
        shortLabel: 'Luận Giải Cung Vị • Tài Quan & Nhân Duyên',
        goal: 'Phân tích chuyên sâu các cung vị trọng yếu về tiền tài, công danh, hôn nhân và phương pháp chế hóa sát tinh trên lá số.',
      },
      USP_GEO: {
        name: 'Tam Hợp Thực Chứng: Tử Vi Đẩu Số Kết Hợp Diện Tướng & Chỉ Tay',
        shortLabel: 'Tam Hợp Thực Chứng • Tử Vi & Tướng Pháp',
        goal: 'Phương pháp đối chiếu đồng thời Lá Số Tử Vi, Bát Bộ Thần Sát cùng Nhân Tướng Học (Diện Tướng & Thủ Tướng).',
      },
      BOFU: {
        name: 'Học Thuật Chân Truyền & Tham Vấn Mệnh Lý Trực Tiếp 1-1',
        shortLabel: 'Học Thuật Chân Truyền • Tham Vấn 1-1',
        goal: 'Triết lý nghiên cứu Tử Vi & Phong Thủy thực chứng của Thầy Tôn và hướng dẫn chọn mức luận giải phù hợp.',
      },
    };
    return { code: stage, color: colors[stage], ...viMap[stage] };
  }

  const i18nMap: Record<Exclude<Language, 'vi'>, Record<FunnelStage, { name: string; shortLabel: string; goal: string }>> = {
    en: {
      TOFU: {
        name: 'Foundations of Destiny: Chart Casting & Annual Transits',
        shortLabel: 'Destiny Foundations • Stars & Transits',
        goal: 'Foundational knowledge on plotting the 12-palace chart, decoding special formations, and tracking annual transits.',
      },
      MOFU: {
        name: 'Palace Deep Dives: Wealth, Career, Marriage & Transforming Malefics',
        shortLabel: 'Palace Decoding • Wealth, Career & Marriage',
        goal: 'In-depth analysis of key life palaces for finance, career, marriage, and transforming the Six Malefic Stars.',
      },
      USP_GEO: {
        name: 'Empirical Synthesis: Zi Wei Dou Shu Combined with Face & Palm Reading',
        shortLabel: 'Empirical Synthesis • Zi Wei & Physiognomy',
        goal: 'Simultaneous cross-verification of the Zi Wei Natal Chart, Ba Bo Shen Sha, Face Reading, and Palmistry.',
      },
      BOFU: {
        name: 'Authentic Lineage & 1-on-1 Strategic Consultation',
        shortLabel: 'Academic Lineage • 1-on-1 Consultation',
        goal: 'Master Ton’s empirical Zi Wei & Feng Shui philosophy and how to choose the ideal reading tier for your goals.',
      },
    },
    zh: {
      TOFU: {
        name: '命理启蒙：安星排盘与流年运限解析',
        shortLabel: '命理启蒙 • 星曜与流年',
        goal: '系统掌握十二宫安星排盘法则、特殊格局解码与流年运限推演。',
      },
      MOFU: {
        name: '宫位精解：财帛、官禄、夫妻与煞星制化',
        shortLabel: '宫位精解 • 财官与姻缘',
        goal: '深入剖析财运、事业、婚姻核心宫位及命盘六煞星的转化之道。',
      },
      USP_GEO: {
        name: '三合实证：紫微斗数结合面相与手相学',
        shortLabel: '三合实证 • 紫微与相法',
        goal: '同步互参紫微斗数命盘、八部神煞与人相学（面相及手相）。',
      },
      BOFU: {
        name: '正统学术传承与一对一深度命理咨询',
        shortLabel: '学术传承 • 一对一咨询',
        goal: '孙老师实证紫微与风水研究哲学，以及如何选择最适合您的命书方案。',
      },
    },
    ko: {
      TOFU: {
        name: '명리 입문: 안성 명반 작성 및 유년 운한 해독',
        shortLabel: '명리 입문 • 성요 & 유년 운한',
        goal: '12궁 명반 작성 원리, 특수 격국 해독 및 유년 운한 추론에 관한 기초 지식 체계.',
      },
      MOFU: {
        name: '궁위 심층 분석: 재백, 관록, 부처궁 및 살성 제화법',
        shortLabel: '궁위 심층 분석 • 재물·직업·인연',
        goal: '재물, 직업, 결혼의 핵심 궁위 분석 및 명반 내 육살성을 긍정적 동력으로 전환하는 방법.',
      },
      USP_GEO: {
        name: '삼합 실증: 자미두수와 관상·수상의 결합',
        shortLabel: '삼합 실증 • 자미두수 & 인상학',
        goal: '자미두수 명반, 팔부신살 및 인상학(관상·수상)을 동시에 대조하는 실증 분석법.',
      },
      BOFU: {
        name: '정통 학술 전승 및 1:1 맞춤형 명리 상담',
        shortLabel: '학술 전승 • 1:1 심층 상담',
        goal: '선생 톤의 실증 자미두수·풍수 연구 철학 및 상황별 최적의 풀이 단계 선택 가이드.',
      },
    },
    ja: {
      TOFU: {
        name: '命理入門：安星命盤の作成と流年運限の解読',
        shortLabel: '命理入門 • 星曜＆流年運限',
        goal: '十二宮命盤の作成ルール、特殊格局の解読、および流年運限の推命に関する基礎知識体系。',
      },
      MOFU: {
        name: '宮位深層解説：財帛・官禄・夫妻宮と煞星の制化',
        shortLabel: '宮位深層解説 • 財運・キャリア・結婚',
        goal: '財運、キャリア、結婚の重要宮位の分析と、命盤上の六煞星を強みに変える方法。',
      },
      USP_GEO: {
        name: '三合実証：紫微斗数と顔相・手相学の融合',
        shortLabel: '三合実証 • 紫微斗数＆相法',
        goal: '紫微斗数命盤、八部神煞、および人相学（顔相・手相）を同時に照合する実証メソッド。',
      },
      BOFU: {
        name: '正統学術の伝承と1対1パーソナル命理相談',
        shortLabel: '学術伝承 • 1対1個別相談',
        goal: 'トン先生の実証的な紫微斗数・風水研究哲学と、目的に合った鑑定プランの選び方。',
      },
    },
  };
  return { code: stage, color: colors[stage], ...i18nMap[lang][stage] };
}

const SEO_ARTICLE_TITLES_I18N: Record<string, Record<Exclude<Language, 'vi'>, { title: string; shortTitle: string; category: string; readTime: string }>> = {
  'cach-lap-la-so-tu-vi-va-binh-giai-mien-phi-chinh-xac': {
    en: {
      title: 'How to Cast an Accurate Zi Wei Dou Shu Natal Chart & Receive a Free Reading by Birth Hour',
      shortTitle: 'Cast a Free Natal Chart & Foundation Reading (0 VND)',
      category: 'Beginner’s Guide',
      readTime: '6 min read',
    },
    zh: {
      title: '如何按出生时辰精准排定紫微斗数命盘并获取免费精批（实证标准）',
      shortTitle: '免费排定紫微命盘与启源精批 (0 VND)',
      category: '入门指南',
      readTime: '6 分钟阅读',
    },
    ko: {
      title: '출생 시辰별 정확한 자미두수 명반 작성 및 무료 풀이 받는 법 (실증 기준)',
      shortTitle: '무료 자미두수 명반 작성 및 기본 풀이 (0 VND)',
      category: '입문 가이드',
      readTime: '6분 소요',
    },
    ja: {
      title: '出生時刻から正確な紫微斗数命盤を作成し無料鑑定を受け取る方法（実証基準）',
      shortTitle: '無料紫微斗数命盤作成＆基本鑑定 (0 VND)',
      category: '入門ガイド',
      readTime: '読了約6分',
    },
  },
  'menh-vo-chinh-dieu-la-gi-dac-tam-khong-tot-hay-xau': {
    en: {
      title: 'What Is an Empty Life Palace (Vo Chinh Dieu)? Is Attaining Three Voids Good or Bad?',
      shortTitle: 'Empty Life Palace & The Three Voids Explained',
      category: 'Special Formations',
      readTime: '7 min read',
    },
    zh: {
      title: '什么是命无正曜？得三空（旬空、截空、天空/地空）究竟是吉是凶？',
      shortTitle: '命无正曜与得三空格局详解',
      category: '特殊格局',
      readTime: '7 分钟阅读',
    },
    ko: {
      title: '명무정요(命無正曜)란 무엇인가? 득삼공(得三空) 격국의 길흉 해독',
      shortTitle: '명무정요 & 득삼공 격국 완벽 해설',
      category: '특수 격국',
      readTime: '7분 소요',
    },
    ja: {
      title: '命無正曜（めいむせいよう）とは？「得三空」の吉凶と対宮からの借星法',
      shortTitle: '命無正曜と「得三空」格局の解説',
      category: '特殊格局',
      readTime: '読了約7分',
    },
  },
  'van-han-tu-vi-2026-binh-ngo-2027-dinh-mui-luu-thai-tue': {
    en: {
      title: 'Decoding 2026 Bing Wu & 2027 Ding Wei Annual Transits via Annual Tai Sui & Four Transformations',
      shortTitle: '2026 – 2027 Annual Transits & Annual Tai Sui',
      category: 'Annual Transits',
      readTime: '8 min read',
    },
    zh: {
      title: '解码 2026 丙午与 2027 丁未流年运限：流太岁与流年四化飞星全解',
      shortTitle: '2026 – 2027 流年运限与流太岁解析',
      category: '流年运限',
      readTime: '8 分钟阅读',
    },
    ko: {
      title: '2026 병오년 & 2027 정미년 유년 운한 해독: 유태세와 유년 사화 분석',
      shortTitle: '2026 – 2027 유년 운한 & 유태세 분석',
      category: '유년 운한',
      readTime: '8분 소요',
    },
    ja: {
      title: '2026年丙午・2027年丁未の流年運限を解読：流太歳と流年四化の完全ガイド',
      shortTitle: '2026〜2027年 流年運限＆流太歳ガイド',
      category: '流年運限',
      readTime: '読了約8分',
    },
  },
  'cach-xem-cung-tai-bach-quan-loc-khi-nao-phat-tai': {
    en: {
      title: 'How to Read the Wealth & Career Palaces: Identifying Your Peak Financial Years',
      shortTitle: 'Reading the Wealth & Career Palaces',
      category: 'Wealth & Career',
      readTime: '7 min read',
    },
    zh: {
      title: '如何看紫微斗数财帛宫与官禄宫：精准识别一生财运爆发期与事业方向',
      shortTitle: '财帛宫与官禄宫财运事业详解',
      category: '财官精解',
      readTime: '7 分钟阅读',
    },
    ko: {
      title: '재백궁과 관록궁 보는 법: 인생의 재물운 폭발 시기와 적합 직종 찾기',
      shortTitle: '재백궁 & 관록궁 재물·직업 해독',
      category: '재물 & 직업',
      readTime: '7분 소요',
    },
    ja: {
      title: '財帛宮と官禄宮の読み方：財運が開花する時期と天職の見極め方',
      shortTitle: '財帛宮＆官禄宮の財運・キャリア解説',
      category: '財運・キャリア',
      readTime: '読了約7分',
    },
  },
  'luan-giai-cung-phu-the-tinh-duyen-hon-nhan-trong-tu-vi': {
    en: {
      title: 'Decoding the Spouse Palace (Phu The): Marriage Timing, Partner Traits & Resolving Clashes',
      shortTitle: 'Spouse Palace: Marriage & Partner Traits',
      category: 'Love & Marriage',
      readTime: '7 min read',
    },
    zh: {
      title: '紫微斗数夫妻宫深度解析：正缘特征、结婚应期与刑克化解之道',
      shortTitle: '夫妻宫：婚姻正缘与化解之道',
      category: '姻缘婚姻',
      readTime: '7 分钟阅读',
    },
    ko: {
      title: '자미두수 부처궁 심층 해독: 배우자 성향, 결혼 시기 및 충극 화해법',
      shortTitle: '부처궁: 결혼 인연 & 배우자 분석',
      category: '연애 & 결혼',
      readTime: '7분 소요',
    },
    ja: {
      title: '紫微斗数「夫妻宮」の深層解説：結婚相手の特徴、婚期、相克の化解法',
      shortTitle: '夫妻宮：結婚の縁とパートナー像',
      category: '恋愛・結婚',
      readTime: '読了約7分',
    },
  },
  'hoa-ky-dia-khong-dia-kiep-kinh-da-cach-hoa-giai-sat-tinh': {
    en: {
      title: 'Hua Ji, Dia Kong, Dia Jiep & Kinh Da: How to Transform Malefic Stars into Breakthrough Power',
      shortTitle: 'Transforming Hua Ji & The Six Malefic Stars',
      category: 'Star Mastery',
      readTime: '8 min read',
    },
    zh: {
      title: '化忌、地空地劫、擎羊陀罗并不可怕：六煞星与化忌的实战制化与借力法',
      shortTitle: '化忌与六煞星的制化及借力之道',
      category: '煞星制化',
      readTime: '8 分钟阅读',
    },
    ko: {
      title: '화기·지공·지겁·경양·타라 완벽 해독: 육살성과 화기를 돌파력으로 바꾸는 법',
      shortTitle: '화기 & 육살성 제화 및 활용법',
      category: '살성 제화',
      readTime: '8분 소요',
    },
    ja: {
      title: '化忌・地空・地劫・擎羊・陀羅の真実：六煞星と化忌を突破力に変える方法',
      shortTitle: '化忌＆六煞星の制化と活用法',
      category: '煞星の制化',
      readTime: '読了約8分',
    },
  },
  'tai-sao-phai-ket-hop-la-so-tu-vi-voi-dien-tuong-va-chi-tay': {
    en: {
      title: 'Why You Must Combine Your Zi Wei Natal Chart with Face Reading & Palmistry',
      shortTitle: 'Combining Zi Wei with Face & Palm Reading',
      category: 'Zi Wei & Physiognomy',
      readTime: '6 min read',
    },
    zh: {
      title: '为什么精批紫微命盘必须结合面相（三停五官）与手相（三大主线）？',
      shortTitle: '紫微命盘结合面相与手相的实证逻辑',
      category: '命相合参',
      readTime: '6 分钟阅读',
    },
    ko: {
      title: '자미두수 명반 풀이에 반드시 관상(삼정오관)과 수상(3대선)을 결합해야 하는 이유',
      shortTitle: '자미두수와 관상·수상 결합의 원리',
      category: '명상 결합',
      readTime: '6분 소요',
    },
    ja: {
      title: '紫微斗数の命盤鑑定に「顔相（三停五官）」と「手相（三大線）」を組み合わせるべき理由',
      shortTitle: '紫微斗数と顔相・手相のクロス検証',
      category: '命相合参',
      readTime: '読了約6分',
    },
  },
  'bat-bo-than-sat-va-tu-hoa-phi-tinh-trong-tu-vi-thuc-chung': {
    en: {
      title: 'Ba Bo Shen Sha & Four Transformations Flying Stars in Empirical Zi Wei Dou Shu',
      shortTitle: 'Ba Bo Shen Sha & Four Transformations',
      category: 'Advanced Methodology',
      readTime: '8 min read',
    },
    zh: {
      title: '八部神煞与四化飞星在实证紫微斗数中的高阶断命法',
      shortTitle: '八部神煞与四化飞星高阶解析',
      category: '高阶技法',
      readTime: '8 分钟阅读',
    },
    ko: {
      title: '실증 자미두수에서의 팔부신살(八部神煞)과 사화비성(四化飛星) 고급 해독법',
      shortTitle: '팔부신살 & 사화비성 고급 기법',
      category: '고급 기법',
      readTime: '8분 소요',
    },
    ja: {
      title: '実証紫微斗数における「八部神煞」と「四化飛星」の高度な命理読解法',
      shortTitle: '八部神煞＆四化飛星の高度解析',
      category: '高等技法',
      readTime: '読了約8分',
    },
  },
  'thay-ton-tran-huy-ton-va-phuong-phap-tu-vi-logic-thuc-chung': {
    en: {
      title: 'Master Ton (Tran Huy Ton) & The Logic-Based Empirical Zi Wei Dou Shu Methodology',
      shortTitle: 'Master Ton & Empirical Zi Wei Methodology',
      category: 'Academic Profile',
      readTime: '6 min read',
    },
    zh: {
      title: '孙老师 (Trần Huy Tôn) 与融合数理金融逻辑的实证紫微斗数体系',
      shortTitle: '孙老师与实证紫微斗数研究体系',
      category: '学术档案',
      readTime: '6 分钟阅读',
    },
    ko: {
      title: '선생 톤(Trần Huy Tôn)과 수리·재무 논리를 결합한 실증 자미두수 방법론',
      shortTitle: '선생 톤 & 실증 자미두수 연구 체계',
      category: '학술 프로필',
      readTime: '6분 소요',
    },
    ja: {
      title: 'トン先生（Trần Huy Tôn）と数理・ファイナンス論理を融合した実証紫微斗数メソッド',
      shortTitle: 'トン先生＆実証紫微斗数メソッド',
      category: '学術プロフィール',
      readTime: '読了約6分',
    },
  },
  'so-sanh-ban-khoi-nguyen-0d-ban-vip-pro-119k-va-ban-expert-269k': {
    en: {
      title: 'Detailed Comparison: Free Foundation (0 VND) vs. VIP Pro (119k) vs. 12-Palace Expert (269k)',
      shortTitle: 'Comparing Foundation (0đ), Pro (119k) & Expert (269k)',
      category: 'Reading Packages',
      readTime: '5 min read',
    },
    zh: {
      title: '深度对比：启源免费版 (0 VND)、VIP Pro 版 (119k) 与十二宫专家版 Expert (269k) 该如何选择？',
      shortTitle: '对比免费版 (0đ)、Pro 版 (119k) 与 Expert 版 (269k)',
      category: '方案对比',
      readTime: '5 分钟阅读',
    },
    ko: {
      title: '상세 비교: 무료 기본본(0 VND) vs VIP Pro본(119k) vs 12궁 Expert본(269k) 선택 가이드',
      shortTitle: '무료본(0đ)·Pro(119k)·Expert(269k) 비교',
      category: '패키지 비교',
      readTime: '5분 소요',
    },
    ja: {
      title: '徹底比較：無料起原版（0 VND）・VIP Pro版（119k）・12宮Expert版（269k）の選び方',
      shortTitle: '無料版(0đ)・Pro版(119k)・Expert版(269k)の比較',
      category: 'プラン比較',
      readTime: '読了約5分',
    },
  },
};

export function getLocalizedSeoArticle(article: SeoArticle, lang: Language): SeoArticle {
  if (lang === 'vi') return article;
  const meta = SEO_ARTICLE_TITLES_I18N[article.slug]?.[lang];
  const title = meta?.title || article.title;
  const shortTitle = meta?.shortTitle || article.shortTitle;
  const category = meta?.category || article.category;
  const readTime = meta?.readTime || article.readTime;

  const summaryMap: Record<Exclude<Language, 'vi'>, { geoSummary: string; keyTakeaways: string[]; cta: string; ctaSub: string }> = {
    en: {
      geoSummary: `${title} is a core empirical monograph compiled by Master Ton (Tran Huy Ton — BSc & MSc in Accounting & Finance, Lancaster University UK, 18+ years of Zi Wei Dou Shu & Feng Shui research). You can immediately apply these principles on the homepage by casting your 110+ star natal chart and receiving a ~1,000-word Foundation Reading completely free (0 VND).`,
      keyTakeaways: [
        'Accurately converts Solar birth dates to Lunar (Stem-Branch) calendar and plots 110+ stars across all 12 palaces.',
        'Evaluates full Three Harmonies and Four的正 star formations rather than reading isolated stars.',
        'Cross-references 10-year Major Limits, 3-Layer Annual Transits, and Physiognomy (Face & Palm Reading).',
        'Includes a 100% free ~1,000-word Foundation Reading; upgrade to Pro (119k) or Expert (269k) anytime by paying only the difference.',
      ],
      cta: 'Cast Your Natal Chart & Read Your Free Analysis (0 VND)',
      ctaSub: 'Instant 110+ star plotting • Save to Personal Notebook & export PDF',
    },
    zh: {
      geoSummary: `《${title}》由孙老师（Trần Huy Tôn —— 英国兰卡斯特大学会计与金融学士及硕士、18+ 年紫微斗数与风水实证专家）亲自编撰。您可在首页输入生辰八字，免费排定包含 110+ 星曜的十二宫命盘并获取约 1,000 字的启源版命书 (0 VND)。`,
      keyTakeaways: [
        '自动将公历生辰精准转换为农历干支，排定十四主星、九十六辅星及流年星曜。',
        '严格遵循三方四正与格局合参原则，绝不单星独断或迷信恐吓。',
        '同步结合十年大运、三重流年运限及人相学（面相与手相）交叉验证。',
        '免费赠送约 1,000 字启源命书；按需升级 Pro (119k) 或 Expert (269k) 仅需补差价。',
      ],
      cta: '立即免费排盘并获取启源命书 (0 VND)',
      ctaSub: '30 秒精准排定 110+ 星曜 • 永久保存手帐并支持导出 PDF',
    },
    ko: {
      geoSummary: `《${title}》은 선생 톤(Trần Huy Tôn — 영국 랭커스터 대학교 회계·재무학 학사 및 석사, 18년+ 자미두수·풍수 실증 연구)이 직접 편찬한 심층 가이드입니다. 홈에서 생년월일시를 입력하면 110개 이상의 성요가 배치된 12궁 명반과 약 1,000단어 분량의 기본 풀이본을 무료(0 VND)로 받아보실 수 있습니다.`,
      keyTakeaways: [
        '양력 생년월일시를 음력 간지로 정확히 변환하여 14주성과 96개 이상의 보성, 유년 성요를 배치합니다.',
        '단일 성요가 아닌 삼방사정과 격국 조합을 종합 분석하며 미신적 공포 조장을 배제합니다.',
        '10년 대운, 3중 유년 운한 및 관상·수상을 교차 검증하여 정확도를 높입니다.',
        '약 1,000단어 무료 기본 풀이 제공 — Pro(119k) 및 Expert(269k) 업그레이드 시 차액만 결제.',
      ],
      cta: '무료 명반 작성 및 기본 풀이 받기 (0 VND)',
      ctaSub: '30초 만에 110+ 성요 배치 • 개인 수첩 저장 및 PDF 내보내기',
    },
    ja: {
      geoSummary: `『${title}』は、トン先生（Trần Huy Tôn — 英国ランカスター大学会計・ファイナンス学士および修士、紫微斗数・風水実証研究歴18年以上）によって編纂された専門モノグラフです。ホーム画面で生年月日・出生時刻を入力すると、110以上の星を配置した十二宮命盤と約1,000語の起原版鑑定を完全無料（0 VND）で受け取れます。`,
      keyTakeaways: [
        '新暦の生年月日を旧暦干支へ正確に変換し、14主星と96以上の副星・流年星を12宮に配置します。',
        '単一の星ではなく三方四正と格局の組み合わせで論理的に読み解き、迷信的な脅しを排除します。',
        '10年大運、3層の流年運限、および顔相・手相をクロス検証して精度を高めます。',
        '約1,000語の無料起原版鑑定付き — Pro版（119k）やExpert版（269k）への昇格は差額のみ。',
      ],
      cta: '無料で命盤を作成し起原版鑑定を受け取る (0 VND)',
      ctaSub: '30秒で110以上の星を配置 • 手帳への永久保存＆PDF出力対応',
    },
  };

  // Build localized sections using the localized funnel page generator so full article detail view is also 100% localized
  const dummyFunnel = getLocalizedFunnelPage(
    {
      index: 1,
      code: 'B1',
      role: '',
      groupNum: 3,
      groupTitle: '',
      url: `/bai-viet/${article.slug}`,
      slug: article.slug,
      metaTitle: title,
      metaDescription: summaryMap[lang].geoSummary,
      h1: title,
      authorLine: '',
      quickSummaryHtml: summaryMap[lang].geoSummary,
      quickSummaryText: summaryMap[lang].geoSummary,
      introHtml: '',
      bodyHtml: '',
      faqs: [],
      closingHtml: '',
      primaryCta: { label: summaryMap[lang].cta, href: '/' },
      secondaryCta: { label: '', href: 'https://zalo.me/0935058688' },
    },
    lang
  );

  return {
    ...article,
    title,
    shortTitle,
    category,
    readTime,
    geoSummary: summaryMap[lang].geoSummary,
    keyTakeaways: summaryMap[lang].keyTakeaways,
    primaryCtaText: summaryMap[lang].cta,
    primaryCtaSubtext: summaryMap[lang].ctaSub,
    sections: [
      {
        id: 'section-1',
        heading: title,
        contentHtml: dummyFunnel.bodyHtml,
      },
    ],
    faqs: dummyFunnel.faqs.map((f) => ({
      question: f.question,
      answer: f.answerText,
    })),
  };
}

export interface LocalizedVisualSpec {
  theme: 'amber' | 'emerald' | 'indigo' | 'purple' | 'rose';
  bgImage: string;
  diagramTitle: string;
  diagramSubtitle: string;
  centerSymbol: string;
  centerLabel: string;
  nodes: { label: string; sub: string; badge?: string }[];
  caption: string;
}

export function getLocalizedVisualSpec(
  baseSpec: LocalizedVisualSpec,
  codeOrSlug: string,
  localizedTitle: string,
  groupNum: number | undefined,
  lang: Language
): LocalizedVisualSpec {
  if (lang === 'vi') return baseSpec;

  // Bespoke 4-pillar diagram for /thay-ton (code === 'TR')
  if (codeOrSlug === 'TR') {
    const trMap: Record<Exclude<Language, 'vi'>, Omit<LocalizedVisualSpec, 'theme' | 'bgImage' | 'centerSymbol'>> = {
      en: {
        diagramTitle: 'Zi Wei & Feng Shui Expert Master Ton (Tran Huy Ton)',
        diagramSubtitle: 'Mathematical Logic & UK Finance Combined With 18+ Years of Classical Metaphysics Research',
        centerLabel: 'Master Ton',
        nodes: [
          { label: 'Specialized Math & Informatics', sub: 'Structured reasoning & rigorous logical systems (Hanoi University)', badge: 'Foundation' },
          { label: 'BSc & MSc at Lancaster University', sub: 'Accounting & Finance degrees in the United Kingdom', badge: '7+ Years in UK' },
          { label: '15+ Years Teaching', sub: 'IELTS & Cambridge IGCSE Mathematics, Economics & Business', badge: 'Pedagogy' },
          { label: '18+ Years Zi Wei & Feng Shui', sub: 'Empirical chart verification with transparent academic basis', badge: 'Practical' },
        ],
        caption: 'Four academic and empirical pillars of Expert Master Ton (Tran Huy Ton)',
      },
      zh: {
        diagramTitle: '紫微斗数与风水专家 —— 孙老师 (Trần Huy Tôn)',
        diagramSubtitle: '融合数理逻辑、英国金融学位与 18+ 年传统命理实证研究',
        centerLabel: '孙老师',
        nodes: [
          { label: '河内综合大学数信特长班', sub: '严密的结构化思维与数理逻辑体系', badge: '数理根基' },
          { label: '英国兰卡斯特大学学士及硕士', sub: '英国会计与金融专业深造及工作经验', badge: '留英 7+ 年' },
          { label: '15+ 年国际课程教学', sub: 'IELTS 与剑桥 IGCSE 数学、经济、商科教学', badge: '学术教研' },
          { label: '18+ 年紫微与风水实证', sub: '论据透明可验，拒绝迷信恐吓', badge: '实战经验' },
        ],
        caption: '孙老师 (Trần Huy Tôn) 的四大核心学术与实证支柱',
      },
      ko: {
        diagramTitle: '자미두수 & 풍수 전문가 선생 톤 (Trần Huy Tôn)',
        diagramSubtitle: '수리적 논리와 영국 재무학 학위, 그리고 18년 이상의 전통 명리 실증 연구 결합',
        centerLabel: '선생 톤',
        nodes: [
          { label: '하노이 종합대 수학·정보 영재반', sub: '구조적 사고방식과 치밀한 논리 시스템', badge: '수리 기반' },
          { label: '영국 랭커스터 대학교 학사 & 석사', sub: '영국 회계·재무학 전공 및 현지 유학·근무', badge: '영국 7년+' },
          { label: '15년+ 국제 과정 강의', sub: 'IELTS & 캠브리지 IGCSE 수학·경제·비즈니스 교육', badge: '교육 경력' },
          { label: '18년+ 자미두수 & 풍수 실증', sub: '투명한 근거 제시 및 실증적 명반 풀이', badge: '실전 경험' },
        ],
        caption: '전문가 선생 톤(Trần Huy Tôn)의 4대 학술 및 실증 기둥',
      },
      ja: {
        diagramTitle: '紫微斗数＆風水専門家 トン先生 (Trần Huy Tôn)',
        diagramSubtitle: '数理的思考・英国ファイナンス学位と18年以上の伝統命理実証研究の融合',
        centerLabel: 'トン先生',
        nodes: [
          { label: 'ハノイ総合大 数学・情報特進', sub: '構造的思考と緻密な論理システム', badge: '数理基盤' },
          { label: '英国ランカスター大学 学士＆修士', sub: '英国にて会計・ファイナンスを専攻', badge: '在英7年以上' },
          { label: '15年以上の国際教育指導', sub: 'IELTS＆ケンブリッジIGCSE数学・経済・ビジネス', badge: '教育実績' },
          { label: '18年以上の紫微＆風水実証', sub: '根拠が明確で検証可能な実践的鑑定', badge: '実践鑑定' },
        ],
        caption: 'トン先生（Trần Huy Tôn）の4つの学術・実証ピラー',
      },
    };
    return {
      ...baseSpec,
      ...trMap[lang],
    };
  }

  // Group 2 / Feng Shui visual diagram
  const isFengShui = groupNum === 2 || ['C1', 'S1', 'S2', 'S3', 'S4', 'B6', 'B24', 'B25', 'B26'].includes(codeOrSlug) || codeOrSlug.includes('phong-thuy');
  if (isFengShui) {
    const fsMap: Record<Exclude<Language, 'vi'>, Omit<LocalizedVisualSpec, 'theme' | 'bgImage' | 'centerSymbol'>> = {
      en: {
        diagramTitle: localizedTitle,
        diagramSubtitle: 'Heaven’s Timing (Zi Wei Chart) • Earthly Harmony (Yang House Feng Shui) • Human Action',
        centerLabel: 'Feng Shui',
        nodes: [
          { label: '1. Natal Chart Assessment', sub: 'Identify Five Elements & Property Palace on your chart', badge: 'Step 1' },
          { label: '2. Yang House Optimization', sub: 'Harmonize main door, master bedroom, kitchen & desk', badge: 'Step 2' },
          { label: '3. Useful God Balancing', sub: 'Enhance auspicious Qi and neutralize spatial clashes', badge: 'Step 3' },
          { label: '4. Auspicious Date Selection', sub: 'Select optimal dates for groundbreaking, moving & opening', badge: 'Step 4' },
        ],
        caption: `Visual Blueprint: ${localizedTitle} — Master Ton Zi Wei & Feng Shui`,
      },
      zh: {
        diagramTitle: localizedTitle,
        diagramSubtitle: '天时（紫微命盘）• 地利（阳宅风水）• 人和（决策行动）',
        centerLabel: '命盘风水',
        nodes: [
          { label: '1. 勘察个人命盘', sub: '锁定命局五行喜忌与田宅宫格局', badge: '第一步' },
          { label: '2. 阳宅三要布局', sub: '调理大门、主卧、灶位与办公财位', badge: '第二步' },
          { label: '3. 用神五行补缺', sub: '催旺生气并化解现实空间形煞', badge: '第三步' },
          { label: '4. 择日吉时启动', sub: '精选动土、入宅、开业与嫁娶吉日', badge: '第四步' },
        ],
        caption: `专题视觉导图：${localizedTitle} — 孙老师紫微斗数与风水`,
      },
      ko: {
        diagramTitle: localizedTitle,
        diagramSubtitle: '천시(자미두수 명반) • 지리(양택 풍수) • 인화(실천 전략)',
        centerLabel: '명반 풍수',
        nodes: [
          { label: '1. 본명 명반 분석', sub: '명반의 오행 용신과 전택궁 구조 파악', badge: '1단계' },
          { label: '2. 양택 삼요 배치', sub: '현관문, 안방, 주방 및 책상 방향 최적화', badge: '2단계' },
          { label: '3. 오행 용신 보완', sub: '생기를 북돋우고 공간의 형살을 중화', badge: '3단계' },
          { label: '4. 길일 택일 선정', sub: '착공, 이사, 개업, 결혼을 위한 길일·길시 선택', badge: '4단계' },
        ],
        caption: `주제 시각 다이어그램: ${localizedTitle} — 선생 톤 자미두수 & 풍수`,
      },
      ja: {
        diagramTitle: localizedTitle,
        diagramSubtitle: '天時（紫微斗数命盤）• 地利（陽宅風水）• 人和（実践行動）',
        centerLabel: '命盤風水',
        nodes: [
          { label: '1. 個人命盤の分析', sub: '五行の喜忌と田宅宮の配置を特定', badge: 'ステップ1' },
          { label: '2. 陽宅三要の最適化', sub: '玄関・寝室・キッチン・デスクの向きを調整', badge: 'ステップ2' },
          { label: '3. 用神五行の補完', sub: '生気を高め、住空間の形煞を和らげる', badge: 'ステップ3' },
          { label: '4. 吉日・吉時の選定', sub: '地鎮祭・引越し・開業に最適な日取りを選択', badge: 'ステップ4' },
        ],
        caption: `テーマ別ビジュアル図解：${localizedTitle} — トン先生の紫微斗数＆風水`,
      },
    };
    return { ...baseSpec, ...fsMap[lang] };
  }

  // Group 1 / Product & Consultation diagram
  if (groupNum === 1 || ['P1', 'P2', 'P3', 'DV1', 'DV2', 'LH'].includes(codeOrSlug)) {
    const g1Map: Record<Exclude<Language, 'vi'>, Omit<LocalizedVisualSpec, 'theme' | 'bgImage' | 'centerSymbol'>> = {
      en: {
        diagramTitle: localizedTitle,
        diagramSubtitle: 'Empirical Zi Wei Dou Shu Reading & Consultation System With Master Ton',
        centerLabel: 'Destiny Reading',
        nodes: [
          { label: 'Accurate Star Plotting', sub: '110+ stars plotted across 12 palaces by Lunar Stem-Branch', badge: 'Foundation' },
          { label: 'Formation-Based Reading', sub: 'Three Harmonies, Four Transformations & Tuan/Triet synthesis', badge: 'Method' },
          { label: 'Timeline Synchronization', sub: 'Cross-referencing 10-year Major Limits & 3-Layer Annual Transits', badge: 'Timing' },
          { label: 'Actionable Guidance', sub: 'Transparent academic basis, zero superstition or fear-mongering', badge: 'Value' },
        ],
        caption: `Visual Blueprint: ${localizedTitle} — Master Ton Zi Wei & Feng Shui`,
      },
      zh: {
        diagramTitle: localizedTitle,
        diagramSubtitle: '孙老师实证紫微斗数命书与深度咨询体系',
        centerLabel: '命理精批',
        nodes: [
          { label: '精准安星排盘', sub: '按农历干支排定十二宫 110+ 主辅星曜', badge: '基础' },
          { label: '格局三方合参', sub: '综合三方四正、四化飞星与旬空截空', badge: '方法' },
          { label: '时间轴动态推演', sub: '叠合十年大运、小限与流年太岁', badge: '应期' },
          { label: '务实行动指南', sub: '论据清晰透明，绝不迷信恐吓', badge: '价值' },
        ],
        caption: `专题视觉导图：${localizedTitle} — 孙老师紫微斗数与风水`,
      },
      ko: {
        diagramTitle: localizedTitle,
        diagramSubtitle: '선생 톤과 함께하는 실증 자미두수 풀이 및 상담 시스템',
        centerLabel: '명리 풀이',
        nodes: [
          { label: '정확한 안성 배치', sub: '음력 간지 기준 12궁 110+ 주성·보성 배치', badge: '기반' },
          { label: '삼방사정 격국 해독', sub: '삼합·충조, 사화비성 및 순공·절공 종합 분석', badge: '방법론' },
          { label: '시간축 동기화 분석', sub: '10년 대운, 소한 및 유년태세 교차 대조', badge: '시기' },
          { label: '실천적 방향 제시', sub: '투명한 학술적 근거, 미신적 공포 조장 배제', badge: '가치' },
        ],
        caption: `주제 시각 다이어그램: ${localizedTitle} — 선생 톤 자미두수 & 풍수`,
      },
      ja: {
        diagramTitle: localizedTitle,
        diagramSubtitle: 'トン先生による実証紫微斗数鑑定＆相談システム',
        centerLabel: '命理鑑定',
        nodes: [
          { label: '正確な安星配置', sub: '旧暦干支に基づき12宮に110以上の星を配置', badge: '基盤' },
          { label: '格局・三方四正の読解', sub: '三合・対宮、四化飛星、旬空・截空の総合分析', badge: 'メソッド' },
          { label: '時間軸の同期分析', sub: '10年大運、小限、流年太歳を重ねて検証', badge: 'タイミング' },
          { label: '実践的な行動指針', sub: '明確な学術的根拠、迷信的な脅しはゼロ', badge: '価値' },
        ],
        caption: `テーマ別ビジュアル図解：${localizedTitle} — トン先生の紫微斗数＆風水`,
      },
    };
    return { ...baseSpec, ...g1Map[lang] };
  }

  // Group 3 / Stars, Palaces & Transits diagram
  const g3Map: Record<Exclude<Language, 'vi'>, Omit<LocalizedVisualSpec, 'theme' | 'bgImage' | 'centerSymbol'>> = {
    en: {
      diagramTitle: localizedTitle,
      diagramSubtitle: 'Stars, 12 Palaces & Annual Transits in Authentic Zi Wei Dou Shu',
      centerLabel: 'Zi Wei Stars',
      nodes: [
        { label: 'Major & Auxiliary Stars', sub: 'Evaluate Temple, Prosperous, Gain, Neutral & Fallen states', badge: 'Star Power' },
        { label: 'Three Harmonies & Opposite', sub: 'Interplay between the triad palaces and opposite palace', badge: 'Structure' },
        { label: 'Four Transformations & Voids', sub: 'Catalysts triggered by the 10 Heavenly Stems & Tuan/Triet', badge: 'Catalyst' },
        { label: 'Personal Chart Verification', sub: 'Cross-reference directly onto your own natal chart', badge: 'Practice' },
      ],
      caption: `Visual Blueprint: ${localizedTitle} — Master Ton Zi Wei & Feng Shui`,
    },
    zh: {
      diagramTitle: localizedTitle,
      diagramSubtitle: '正统紫微斗数星曜、十二宫位与流年运限精解',
      centerLabel: '紫微星曜',
      nodes: [
        { label: '主星与辅星状态', sub: '审视星曜在十二地支的庙、旺、得、平、陷', badge: '星曜能量' },
        { label: '三方四正结构', sub: '本宫与对宫冲照、财官三合宫位的联动', badge: '命局结构' },
        { label: '四化飞星与空亡', sub: '十天干禄权科忌与旬空截空的吉凶转化', badge: '动静触发' },
        { label: '个人命盘实证', sub: '直接对照至您本人的十二宫命盘', badge: '实战应用' },
      ],
      caption: `专题视觉导图：${localizedTitle} — 孙老师紫微斗数与风水`,
    },
    ko: {
      diagramTitle: localizedTitle,
      diagramSubtitle: '정통 자미두수 성요, 12궁위 및 유년 운한 핵심 가이드',
      centerLabel: '자미 성요',
      nodes: [
        { label: '주성 & 보성 상태', sub: '12지지에서의 묘·왕·득·평·함 상태 판별', badge: '성요 에너지' },
        { label: '삼방사정 구조', sub: '본궁과 대궁 충조, 삼합 궁위의 유기적 연결', badge: '명반 구조' },
        { label: '사화비성 & 순·절공', sub: '10천간 록·권·과·기와 순공·절공의 길흉 변화', badge: '변화 동력' },
        { label: '개인 명반 대조', sub: '본인의 실제 명반에 직접 대입하여 검증', badge: '실전 적용' },
      ],
      caption: `주제 시각 다이어그램: ${localizedTitle} — 선생 톤 자미두수 & 풍수`,
    },
    ja: {
      diagramTitle: localizedTitle,
      diagramSubtitle: '正統紫微斗数における星曜・十二宮位・流年運限ガイド',
      centerLabel: '紫微星曜',
      nodes: [
        { label: '主星と副星の状態', sub: '十二支における廟・旺・得・平・陥の輝きを判定', badge: '星の力' },
        { label: '三方四正の構造', sub: '本宮・対宮（遷移）・三合宮の連動性', badge: '命盤構造' },
        { label: '四化飛星と旬・截空', sub: '十干の禄・権・科・忌と空亡による吉凶転換', badge: '変化の契機' },
        { label: '個人命盤での実証', sub: 'ご自身の十二宮命盤と直接照らし合わせる', badge: '実践応用' },
      ],
      caption: `テーマ別ビジュアル図解：${localizedTitle} — トン先生の紫微斗数＆風水`,
    },
  };
  return { ...baseSpec, ...g3Map[lang] };
}

export function getLocalizedCourseShowcaseModules(lang: Language) {
  const base = [
    {
      id: 1,
      image: '/images/cam-nang-12-cung.png',
      icon: '🧭',
      accent: 'from-amber-500/25 to-slate-950',
      border: 'border-amber-500/45',
      pill: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    },
    {
      id: 2,
      image: '/images/cam-nang-tinh-dau.png',
      icon: '🌟',
      accent: 'from-indigo-500/25 to-slate-950',
      border: 'border-indigo-500/45',
      pill: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    },
    {
      id: 3,
      image: '/images/course-hero-podcast.png',
      icon: '⚡',
      accent: 'from-purple-500/25 to-slate-950',
      border: 'border-purple-500/45',
      pill: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    },
    {
      id: 4,
      image: '/images/cam-nang-luan-menh.png',
      icon: '👑',
      accent: 'from-emerald-500/25 to-slate-950',
      border: 'border-emerald-500/45',
      pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    },
  ];

  const texts: Record<Language, { badge: string; title: string; desc: string }[]> = {
    vi: [
      {
        badge: 'HỌC PHẦN 1 • 4 BÀI',
        title: 'Nền Tảng Âm Dương, Cục Mệnh & 12 Cung Vị',
        desc: 'Nắm vững quy luật Sinh – Khắc, Tam Hợp Mệnh – Tài – Quan, Thân cư 6 cung và Tuần – Triệt.',
      },
      {
        badge: 'HỌC PHẦN 2 • 14 BÀI',
        title: 'Giải Mã Toàn Bộ 14 Chính Tinh (Bắc & Nam Đẩu)',
        desc: 'Đi sâu từng ngôi sao từ Tử Vi, Thiên Phủ đến Thất Sát, Phá Quân: tâm lý, tài chính, nghề nghiệp.',
      },
      {
        badge: 'HỌC PHẦN 3 • 3 BÀI',
        title: 'Lục Cát Tinh, Lục Sát Tinh & Bí Pháp Tứ Hóa',
        desc: 'Đọc vị Tả Hữu, Xương Khúc, Khôi Việt; chế hóa Kình Đà Không Kiếp và phi tinh Lộc Quyền Khoa Kỵ.',
      },
      {
        badge: 'HỌC PHẦN 4 • 3 BÀI',
        title: '4 Đại Cách Cục & Quy Trình 5 Bước Chấm Hạn',
        desc: 'Tổng hợp Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Cự Nhật & thực hành chấm hạn năm.',
      },
    ],
    en: [
      {
        badge: 'MODULE 1 • 4 LESSONS',
        title: 'Yin-Yang Foundations, Bureau & 12 Palaces',
        desc: 'Master Five Elements generation/control, Life–Wealth–Career triad, 6 Body Palace placements & Tuan/Triet.',
      },
      {
        badge: 'MODULE 2 • 14 LESSONS',
        title: 'Decoding All 14 Major Stars (North & South Dipper)',
        desc: 'Deep dive into every star from Zi Wei & Tian Fu to Qi Sha & Po Jun: psychology, finance & career.',
      },
      {
        badge: 'MODULE 3 • 3 LESSONS',
        title: 'Six Auspicious, Six Malefic Stars & Four Transformations',
        desc: 'Decode Left/Right, Literary, Nobleman stars; transform Malefics & master Lu–Quan–Ke–Ji flying stars.',
      },
      {
        badge: 'MODULE 4 • 3 LESSONS',
        title: '4 Grand Formations & 5-Step Annual Transit Method',
        desc: 'Synthesize the 4 Grand Formations and practice the 5-step roadmap for annual & monthly forecasts.',
      },
    ],
    zh: [
      {
        badge: '模块 1 • 4 讲',
        title: '阴阳五行、命局关系与十二宫位核心根基',
        desc: '掌握五行生克、命财官三方四正、身居六宫法则与旬空截空机制。',
      },
      {
        badge: '模块 2 • 14 讲',
        title: '深度解码全部十四主星（北斗与南斗星系）',
        desc: '逐一剖析从紫微、天府到七杀、破军的心理特质、财运模式与事业方向。',
      },
      {
        badge: '模块 3 • 3 讲',
        title: '六吉星、六煞星与四化飞星秘法',
        desc: '读懂辅弼、昌曲、魁钺助力；制化羊陀空劫火铃，掌握禄权科忌飞星。',
      },
      {
        badge: '模块 4 • 3 讲',
        title: '四大格局与流年断限五步实战法',
        desc: '融会紫府武相、杀破狼、机月同梁、巨日四大格局与流年流月推演。',
      },
    ],
    ko: [
      {
        badge: '모듈 1 • 4강',
        title: '음양오행, 명국 관계 & 12궁위 핵심 기반',
        desc: '오행 상생·상극, 명·재·관 삼합, 신거 6궁 법칙 및 순공·절공 메커니즘 마스터.',
      },
      {
        badge: '모듈 2 • 14강',
        title: '14주성 전체 심층 해독 (북두 & 남두 성계)',
        desc: '자미·천부부터 칠살·파군까지 각 성요의 심리, 재물 패턴 및 적합 직종 완벽 분석.',
      },
      {
        badge: '모듈 3 • 3강',
        title: '육길성, 육살성 & 사화비성 비법',
        desc: '좌보·우필, 문창·문곡, 천괴·천월 해독 및 경양·타라·공겁 제화와 록·권·과·기 비성.',
      },
      {
        badge: '모듈 4 • 3강',
        title: '4대 격국 & 유년 운한 5단계 실전 풀이법',
        desc: '자부무상, 살파랑, 기월동량, 거일 4대 격국 종합 및 연운·월운 실전 추론.',
      },
    ],
    ja: [
      {
        badge: '第1部 • 4講',
        title: '陰陽五行、命局関係＆十二宮位の基礎',
        desc: '五行の相生・相剋、命・財・官の三合、身居六宮の法則、旬空・截空を習得。',
      },
      {
        badge: '第2部 • 14講',
        title: '全14主星の完全解読（北斗＆南斗星系）',
        desc: '紫微・天府から七殺・破軍まで、各星の心理・財運・適職を徹底解剖。',
      },
      {
        badge: '第3部 • 3講',
        title: '六吉星、六煞星＆四化飛星の秘法',
        desc: '輔弼・昌曲・魁鉞の助力と、羊陀・空劫・火鈴の制化、禄権科忌の飛星法。',
      },
      {
        badge: '第4部 • 3講',
        title: '4大格局＆流年運限5ステップ判定法',
        desc: '紫府武相・殺破狼・機月同梁・巨日の4大格局と年運・月運の実践推命。',
      },
    ],
  };

  return base.map((b, i) => ({
    ...b,
    ...texts[lang][i],
  }));
}

export function getLocalizedCourseTitle(lang: Language): string {
  const map: Record<Language, string> = {
    vi: 'Khóa Học Tử Vi Đẩu Số Thực Chiến Cùng Thầy Tôn',
    en: 'Practical Zi Wei Dou Shu Masterclass With Master Ton',
    zh: '孙老师紫微斗数实战大师班（播客音频 + 交互式讲义）',
    ko: '선생 톤과 함께하는 실전 자미두수 마스터클래스',
    ja: 'トン先生と学ぶ実践紫微斗数マスタークラス',
  };
  return map[lang];
}

const LESSON_TITLES_I18N: Record<number, Record<Exclude<Language, 'vi'>, { title: string; subtitle: string }>> = {
  1: {
    en: { title: 'Logical Chart Reading Mindset: Yin-Yang, Five Elements, Bureau & Three Harmonies', subtitle: 'Why you must never judge a single star in isolation — the 40-30-30 rule.' },
    zh: { title: '逻辑读盘思维：阴阳、五行、命局与三方四正法则', subtitle: '为什么绝不能单看一颗星曜定吉凶？本宫 40% - 对宫 30% - 三合 30% 黄金法则。' },
    ko: { title: '논리적 명반 해독 사고방식: 음양, 오행, 국(局) & 삼방사정 법칙', subtitle: '단일 성요만으로 길흉을 판단하면 안 되는 이유 — 40·30·30 삼방사정 법칙.' },
    ja: { title: '論理的な命盤読解思考：陰陽・五行・局と三方四正の法則', subtitle: '単一の星だけで吉凶を判断してはいけない理由 — 40・30・30の三方四正ルール。' },
  },
  2: {
    en: { title: 'The 12 Palaces & 6 Body Palace Placements: Mapping Your Life Domains', subtitle: 'How the Life Palace governs early life and the Body Palace shapes destiny after age 30.' },
    zh: { title: '十二宫位职能与身居六宫法则：前半生与后半生的重心转移', subtitle: '命宫管三十岁前先天禀赋，身宫定三十岁后人生归宿。' },
    ko: { title: '12궁위의 역할과 신거(身居) 6궁 법칙: 전반생과 후반생의 중심 이동', subtitle: '30세 이전의 선천적 성향(명궁)과 30세 이후의 후천적 귀착점(신궁).' },
    ja: { title: '十二宮の役割と身居六宮の法則：人生前半と後半の重心シフト', subtitle: '30歳前の先天的な資質（命宮）と30歳後の後天的な帰着点（身宮）。' },
  },
  3: {
    en: { title: 'Tuan Trung Khong Vong & Triet Lo Khong Vong: Reversing Auspicious & Malefic Energies', subtitle: 'Understanding how Tuan and Triet block, filter, or rescue a palace before and after age 30.' },
    zh: { title: '旬中空亡与截路空亡：三十岁前后的吉凶反转与制煞机制', subtitle: '“截到金宫，旬临火地”——深入理解旬空与截空的缓冲与救解作用。' },
    ko: { title: '순중공망(旬空)과 절로공망(截空): 30세 전후의 길흉 반전과 제살 메커니즘', subtitle: '순공과 절공이 좋은 궁과 흉한 궁에서 작동하는 원리 완벽 분석.' },
    ja: { title: '旬中空亡と截路空亡：30歳前後の吉凶反転と制煞メカニズム', subtitle: '吉宮での試練と凶宮での救解（制煞）の仕組みを解明。' },
  },
  4: {
    en: { title: '10-Year Major Limits & 3-Layer Annual Transits: Timing Your Advances and Retreats', subtitle: 'Connecting Natal potential with decade trends and annual triggers.' },
    zh: { title: '十年大运与三重流年运限：精准把握人生进退时机', subtitle: '“大运重气，流年重实”——先天原局、十年大限与流年太岁的叠合法。' },
    ko: { title: '10년 대운과 3중 유년 운한: 인생의 진퇴 타이밍 포착하기', subtitle: '선천 명반, 10년 대운, 그리고 유년 소한·유태세를 입체적으로 연결하는 법.' },
    ja: { title: '10年大運と3層の流年運限：人生の進退タイミングを見極める', subtitle: '先天命盤・10年大運・流年三限（小限・流年大限・流太歳）の重ね合わせ法。' },
  },
  5: {
    en: { title: 'Zi Wei Star (Emperor Star): Leadership, Authority & The Need for Auxiliary Support', subtitle: 'Decoding the North Dipper Emperor star across all 12 Earthly Branches.' },
    zh: { title: '紫微星（北斗帝座）：领导统御、百官朝拱与在野孤君之别', subtitle: '全面解析紫微星在十二地支的独坐与双星同宫格局。' },
    ko: { title: '자미성(북두 제왕성): 리더십, 권위 & 백관조공과 고군의 차이', subtitle: '12지지에서 자미성의 독좌 및 쌍성 동궁 격국 완벽 해독.' },
    ja: { title: '紫微星（北斗の帝王星）：統率力、権威、「百官朝拱」と「孤君」の違い', subtitle: '十二支における紫微星の独坐および双星同宮格局の完全解説。' },
  },
  6: {
    en: { title: 'Tian Ji Star (Strategist Star): Intelligence, Adaptability & Strategic Planning', subtitle: 'Strengths in technology, analytics, consulting, and managing mental restlessness.' },
    zh: { title: '天机星（南斗谋臣）：机敏智慧、策划参谋与系统分析力', subtitle: '天机星在科技、金融分析、顾问领域的优势及如何克服思虑过多。' },
    ko: { title: '천기성(남두 모사성): 지혜, 적응력 & 전략 기획의 별', subtitle: '기술·분석·컨설팅 분야의 강점과 과도한 생각(사려 과다)을 다스리는 법.' },
    ja: { title: '天機星（南斗の参謀星）：知恵、柔軟性、戦略プランニングの星', subtitle: 'IT・分析・コンサル分野での強みと、思考過多をコントロールする方法。' },
  },
  7: {
    en: { title: 'Tai Yang Star (The Sun): Radiance, Public Reputation & Daytime vs. Nighttime Births', subtitle: 'Why birth hour and brightness determine whether Tai Yang brings fame or exhaustion.' },
    zh: { title: '太阳星（中天官禄主）：博爱光明、贵气名声与日生/夜生之分', subtitle: '为什么太阳坐命最看重庙旺程度与出生时辰？' },
    ko: { title: '태양성(중천 관록주): 광명, 명예 & 주생(낮 출생)과 야생(밤 출생)의 차이', subtitle: '태양성에서 묘왕 상태와 출생 시간이 결정적인 이유.' },
    ja: { title: '太陽星（中天の官禄主）：光明、社会的名声、昼生まれと夜生まれの違い', subtitle: '太陽星において廟旺の輝きと出生時刻が決定的に重要な理由。' },
  },
  8: {
    en: { title: 'Wu Qu Star (General & Wealth Star): Financial Execution, Discipline & Metal Energy', subtitle: 'The premier wealth star of the North Dipper — banking, business, and decisiveness.' },
    zh: { title: '武曲星（北斗正财星）：刚毅果断、商业执行力与财富管理', subtitle: '三大财星之首：武曲在金融、实业与管理中的核心特质。' },
    ko: { title: '무곡성(북두 정재성): 결단력, 재무 실행력 & 금(金) 에너지', subtitle: '북두 최고의 재물성 — 금융, 비즈니스 및 강력한 추진력 분석.' },
    ja: { title: '武曲星（北斗の正財星）：決断力、財務遂行力、金のエネルギー', subtitle: '北斗筆頭の財星 — 金融・実業・マネジメントにおける強み。' },
  },
  9: {
    en: { title: 'Tian Tong Star (Blessing Star): Emotional Harmony, Renewal & Overcoming Complacency', subtitle: 'How challenges awaken the true potential of Tian Tong.' },
    zh: { title: '天同星（南斗福星）：谦和福泽、白手兴家与逆境激发潜力', subtitle: '为什么天同星适度见煞反而能激发斗志、开创大局？' },
    ko: { title: '천동성(남두 복성): 정서적 조화, 백수성가 & 역경을 통한 잠재력 각성', subtitle: '천동성이 적절한 자극을 만났을 때 오히려 크게 발복하는 이유.' },
    ja: { title: '天同星（南斗の福星）：調和、白手起家、試練によって目覚める潜在力', subtitle: '天同星が適度な刺激（煞星・化権）を得ることで大成する理由。' },
  },
  10: {
    en: { title: 'Lian Zhen Star (Diplomacy & Discipline Star): Politics, Rules & Emotional Intensity', subtitle: 'Balancing administrative precision with creative charisma.' },
    zh: { title: '廉贞星（次桃花与官禄主）：制度法纪、公关手腕与刚柔并济', subtitle: '清白格与桃花格的双重面貌及在管理、法律、艺术中的应用。' },
    ko: { title: '염정성(차도화 & 관록주): 규율, 외교적 수완 & 강렬한 카리스마', subtitle: '행정적 치밀함과 대인관계 매력을 동시에 발휘하는 법.' },
    ja: { title: '廉貞星（次桃花＆官禄主）：規律、外交手腕、情熱的カリスマ', subtitle: '緻密な管理能力と対人魅力を両立させる実践的アプローチ。' },
  },
  11: {
    en: { title: 'Tian Fu Star (Southern Treasury Star): Wealth Preservation, Stability & Management', subtitle: 'The vault of heaven — asset accumulation, real estate, and conservative leadership.' },
    zh: { title: '天府星（南斗令星与禄库）：稳健守成、资产积累与高管统领力', subtitle: '“逢府看相”——如何判断天府是充盈宝库还是空库？' },
    ko: { title: '천부성(남두 재고성): 자산 보존, 안정적 리더십 & 부고(府庫) 판별법', subtitle: '천부성이 꽉 찬 금고(실고)인지 빈 금고(공고)인지 구별하는 핵심 비결.' },
    ja: { title: '天府星（南斗の財庫星）：資産保全、安定感、マネジメント力', subtitle: '「逢府看相」— 天府が豊かな財庫となる条件の見極め方。' },
  },
  12: {
    en: { title: 'Tai Yin Star (The Moon): Real Estate, Quiet Wealth Accumulation & Inner Sensitivity', subtitle: 'Long-term investment, property luck, and nighttime brilliance.' },
    zh: { title: '太阴星（田宅主与富星）：不动产积蓄、长线投资与内敛智慧', subtitle: '太阴星在财务规划、置业安家与文化教育中的优势。' },
    ko: { title: '태음성(전택주 & 부성): 부동산 축적, 장기 투자 & 섬세한 지혜', subtitle: '장기 자산 형성, 부동산 운 및 야간 출생자의 빛나는 강점.' },
    ja: { title: '太陰星（田宅主＆富星）：不動産運、着実な資産形成、繊細な知性', subtitle: '長期投資・不動産運の強みと夜生まれにおける輝き。' },
  },
  13: {
    en: { title: 'Tan Lang Star (Desire & Networking Star): Social Magnetism, Versatility & Speculation', subtitle: 'The primary Peach Blossom star — negotiation, entertainment, and Fire/Bell breakthroughs.' },
    zh: { title: '贪狼星（正桃花与欲望之星）：人脉交际、多才多艺与火贪/铃贪暴发格', subtitle: '如何将贪狼的求知欲与社交力转化为商业突破？' },
    ko: { title: '탐랑성(정도화 & 욕망의 별): 사교성, 다재다능함 & 화탐·영탐 발복격', subtitle: '탐랑성의 강한 호기심과 대인 네트워크를 비즈니스 돌파력으로 전환하기.' },
    ja: { title: '貪狼星（正桃花＆多才の星）：社交力、交渉力、「火貪・鈴貪」の飛躍格', subtitle: '旺盛な好奇心と人脈力をビジネスの突破力に変える方法。' },
  },
  14: {
    en: { title: 'Ju Men Star (Eloquence & Research Star): Deep Investigation, Law, Teaching & Overcoming Gossip', subtitle: 'Turning verbal friction into persuasive authority when illuminated by Tai Yang.' },
    zh: { title: '巨门星（暗曜与口才之星）：深度研究、法律教育与“巨日同临”化暗为明', subtitle: '善用巨门星的逻辑思辨力，化解口舌是非。' },
    ko: { title: '거문성(언변 & 심층 연구의 별): 교육, 법률, 미디어 & 구설수 화해법', subtitle: '태양의 빛으로 암요를 밝혀 설득력 있는 권위로 승화시키는 법.' },
    ja: { title: '巨門星（弁舌＆深層研究の星）：法律・教育・メディアでの強みと口舌の化解', subtitle: '太陽の光で「暗曜」を照らし、説得力ある専門性へと昇華させる方法。' },
  },
  15: {
    en: { title: 'Tian Xiang Star (Prime Minister’s Seal): Integrity, Mediation & Supporting Leadership', subtitle: 'Judging Tian Xiang by examining the flanking Wealth and Trouble stars.' },
    zh: { title: '天相星（司爵之宿与掌印星）：公正协调、辅佐高管与“逢相看府”法则', subtitle: '解析财荫夹印格与刑忌夹印格的实战差异。' },
    ko: { title: '천상성(장인성): 공정한 조율, 보좌 리더십 & 재음협인과 형기협인 판별', subtitle: '양옆에서 협(夾)하는 성요를 통해 천상성의 길흉을 읽는 핵심 기법.' },
    ja: { title: '天相星（掌印の星）：公正な調整力、補佐リーダーシップ、「財蔭夾印」と「刑忌夾印」', subtitle: '天相星を挟む両隣の星から格局の高低を見極める秘訣。' },
  },
  16: {
    en: { title: 'Tian Liang Star (Longevity & Mentor Star): Protection, Medicine, Education & Auditing', subtitle: 'How Tian Liang resolves crises and excels in advisory professions.' },
    zh: { title: '天梁星（父母主与荫星）：逢凶化吉、医药教育与监察审计专长', subtitle: '“阳梁昌禄”大格解析与天梁星的贵人庇荫机制。' },
    ko: { title: '천량성(음성 & 수성): 위기 극복, 의료·교육·감사 분야의 전문성', subtitle: '양량창록(陽梁昌祿) 대격 해독 및 천량성의 구제 메커니즘.' },
    ja: { title: '天梁星（蔭星＆メンターの星）：危機回避、医療・教育・監査分野での適性', subtitle: '「陽梁昌禄」格局の解説と、天梁星がもたらす保護・救解の力。' },
  },
  17: {
    en: { title: 'Qi Sha Star (Marshal Star): Pioneering Courage, Decisive Action & Strategic Turning Points', subtitle: 'Leading in competitive markets and mastering life’s sharp turns.' },
    zh: { title: '七杀星（将星与运筹大将）：杀伐果断、开疆拓土与“七杀朝斗”格', subtitle: '如何在乱局中把握先机，做到攻守兼备？' },
    ko: { title: '칠살성(장성): 개척 정신, 과감한 결단력 & 칠살조두(七殺朝斗) 대격', subtitle: '경쟁이 치열한 시장에서 선두를 지휘하고 인생의 전환점을 마스터하는 법.' },
    ja: { title: '七殺星（将星）：開拓精神、果断な実行力、「七殺朝斗」の大格局', subtitle: '激しい競争環境で先陣を切り、人生の転換期を制する戦略。' },
  },
  18: {
    en: { title: 'Po Jun Star (Vanguard Star): Creative Destruction, Innovation & Rebuilding from Scratch', subtitle: 'Channeling Po Jun’s pioneering force without financial depletion.' },
    zh: { title: '破军星（先头部队与耗星）：破旧立新、颠覆创新与“英星入庙”格', subtitle: '驾驭破军的变革爆发力，避免财务大起大落。' },
    ko: { title: '파군성(선봉장 & 개혁의 별): 창조적 파괴, 혁신 & 영성입묘(英星入廟)격', subtitle: '재정적 소모를 막으면서 파군성의 강력한 혁신 에너지를 활용하는 법.' },
    ja: { title: '破軍星（先鋒＆革新の星）：創造的破壊、イノベーション、「英星入廟」格', subtitle: '消耗を防ぎつつ、破軍星の変革エネルギーを成功へ導く方法。' },
  },
  19: {
    en: { title: 'The Six Auspicious Stars: Zuo Fu, You Bi, Wen Chang, Wen Qu, Tian Kui & Tian Yue', subtitle: 'Teamwork, academic brilliance, and noble benefactor support.' },
    zh: { title: '六吉星全解：左辅右弼、文昌文曲、天魁天钺的贵人与团队助力', subtitle: '区分内部团队协作（辅弼）、才华学识（昌曲）与外部机遇贵人（魁钺）。' },
    ko: { title: '육길성 완벽 해독: 좌보·우필, 문창·문곡, 천괴·천월의 귀인 및 팀워크 조력', subtitle: '조직 협력(보필), 학술·예술 재능(창곡), 외부 귀인 기회(괴월)의 차이.' },
    ja: { title: '六吉星の完全解説：左輔・右弼、文昌・文曲、天魁・天鉞の助力と貴人運', subtitle: '組織の協力（輔弼）、学芸の才（昌曲）、引き立ての貴人（魁鉞）の使い分け。' },
  },
  20: {
    en: { title: 'The Six Malefic Stars: Qing Yang, Tuo Luo, Huo Xing, Ling Xing, Di Kong & Di Jie', subtitle: 'Transforming malefic pressure into technical mastery and entrepreneurial speed.' },
    zh: { title: '六煞星全解：擎羊陀罗、火星铃星、地空地劫的制化与实战借力', subtitle: '煞星庙旺配对专业，反而是现代科技、外科、风投与突破型企业家的利器。' },
    ko: { title: '육살성 완벽 해독: 경양·타라, 화성·영성, 지공·지겁의 제화 및 실전 활용', subtitle: '살성의 에너지를 첨단 기술, 전문직, 벤처 투자의 돌파력으로 전환하는 법.' },
    ja: { title: '六煞星の完全解説：擎羊・陀羅、火星・鈴星、地空・地劫の制化と実践活用', subtitle: '煞星のエネルギーを専門技術・医療・先端ビジネスの突破力へ転換する方法。' },
  },
  21: {
    en: { title: 'Secrets of the Four Transformations: Hua Lu, Hua Quan, Hua Ke & Hua Ji', subtitle: 'The dynamic engine of Zi Wei Dou Shu across the 10 Heavenly Stems.' },
    zh: { title: '四化飞星秘法：化禄、化权、化科、化忌与十天干能量流转', subtitle: '“无四化不言吉凶”——抓准缘起（禄）、掌控（权）、声誉（科）与执念（忌）。' },
    ko: { title: '사화비성 비법: 화록, 화권, 화과, 화기 & 10천간 에너지의 흐름', subtitle: '기회(록), 주도권(권), 명예·해결(과), 집착·시험(기)의 4단계 순환 해독.' },
    ja: { title: '四化飛星の秘法：化禄・化権・化科・化忌と十干のエネルギー循環', subtitle: '機会（禄）、主導権（権）、名声・救解（科）、執着・試練（忌）の4段階を読む。' },
  },
  22: {
    en: { title: '4 Grand Formations: Zi Fu Wu Xiang, Sha Po Lang, Ji Yue Tong Liang & Ju Ri', subtitle: 'Identifying your natural career archetype and team role.' },
    zh: { title: '紫微斗数四大格局：紫府武相、杀破狼、机月同梁、巨日同临', subtitle: '找准您在职场与创业中的最佳生态位：帅才、闯将、军师还是外交家？' },
    ko: { title: '자미두수 4대 격국: 자부무상, 살파랑, 기월동량, 거일동림', subtitle: '나에게 가장 잘 맞는 커리어 포지션 찾기: 경영자, 개척자, 참모, 외교가.' },
    ja: { title: '紫微斗数の4大格局：紫府武相・殺破狼・機月同梁・巨日同臨', subtitle: 'あなたの天職ポジションを見極める：統括リーダー、開拓者、参謀、スポークスマン。' },
  },
  23: {
    en: { title: 'Tai Sui Ring & Lu Cun Ring: Social Standing, Legal Karmic Patterns & Wealth Protection', subtitle: 'How the 12 Tai Sui stars reveal character and real-world outcomes.' },
    zh: { title: '太岁十二神煞与禄存博士十二神：处世姿态、因果得失与财库护卫', subtitle: '岁虎符正统派、阳死福德厚派、丧吊白孤奔波派与阴龙直忍耐派详解。' },
    ko: { title: '태세 12신살과 록존 박사 12신: 사회적 태도, 인과 법칙 & 재고 보호', subtitle: '태세 4대 삼합 그룹과 록존을 호위하는 경양·타라의 구조 해독.' },
    ja: { title: '太歳十二神と禄存博士十二神：社会的スタンス、因果の法則、財庫の防衛', subtitle: '太歳リングの4グループと、禄存を守る擎羊・陀羅の構造を解き明かす。' },
  },
  24: {
    en: { title: '5-Step Practical Annual & Monthly Transit Method: Synthesizing Your Full Reading', subtitle: 'Step-by-step checklist to forecast any year and lunar month with precision.' },
    zh: { title: '流年与流月断限五步实战法：融会贯通批算全年吉凶', subtitle: '从先天命局、十年大限到流年三限（小限、流年大限、流太岁）的完整实操清单。' },
    ko: { title: '유년 및 유월 운한 5단계 실전 풀이법: 한 해와 매월의 길흉 종합 판별', subtitle: '선천 명반부터 10년 대운, 유년 3대 궁위(소한·유년대한·유태세)까지 실전 체크리스트.' },
    ja: { title: '流年・流月運限5ステップ実践判定法：1年と毎月の吉凶を総合解読', subtitle: '先天命盤から10年大運、流年三限（小限・流年大限・流太歳）までの完全実践チェックリスト。' },
  },
};

export function getLocalizedCourseLesson(lesson: CourseLesson, lang: Language): CourseLesson {
  if (lang === 'vi') return lesson;
  const meta = LESSON_TITLES_I18N[lesson.number]?.[lang];
  if (!meta) return lesson;

  const chapPrefix = lang === 'en' ? 'Part' : lang === 'zh' ? '第' : lang === 'ko' ? '파트' : 'パート';
  const localizedChapters = lesson.podcastChapters.map((c, idx) => ({
    ...c,
    title:
      lang === 'en'
        ? `${chapPrefix} ${idx + 1}: Core Lecture & Chart Verification (${c.time})`
        : lang === 'zh'
          ? `第 ${idx + 1} 节：核心精讲与命盘实证 (${c.time})`
          : lang === 'ko'
            ? `파트 ${idx + 1}: 핵심 강의 및 명반 대조 (${c.time})`
            : `パート ${idx + 1}：核心講義＆命盤実証 (${c.time})`,
    transcript:
      lang === 'en'
        ? `[Studio Audio Lecture by Master Ton — ${meta.title}] ${meta.subtitle} Listen to the audio track above while cross-referencing the stars (${lesson.relatedStars.join(', ')}) on your personal natal chart below.`
        : lang === 'zh'
          ? `【孙老师录音室精讲音频 —— ${meta.title}】${meta.subtitle} 请点击上方播放按钮收听音频，并结合下方“个人命盘星曜对照框”查看（${lesson.relatedStars.join('、')}）在您命盘中的具体落宫。`
          : lang === 'ko'
            ? `[선생 톤 스튜디오 오디오 강의 — ${meta.title}] ${meta.subtitle} 상단의 재생 버튼을 눌러 오디오를 청취하면서 아래의 개인 명반 대조 박스에서 (${lesson.relatedStars.join(', ')}) 성요의 위치를 확인해 보세요.`
            : `【トン先生スタジオ収録講義 — ${meta.title}】${meta.subtitle} 上部の再生ボタンで音声を聴きながら、下の個人命盤照合ボックスでご自身の命盤における（${lesson.relatedStars.join('・')}）の配置をご確認ください。`,
  }));

  const dummyPage = getLocalizedFunnelPage(
    {
      index: lesson.number,
      code: 'B1',
      role: '',
      groupNum: 3,
      groupTitle: '',
      url: '/khoa-hoc',
      slug: 'khoa-hoc',
      metaTitle: meta.title,
      metaDescription: meta.subtitle,
      h1: meta.title,
      authorLine: '',
      quickSummaryHtml: meta.subtitle,
      quickSummaryText: meta.subtitle,
      introHtml: '',
      bodyHtml: '',
      faqs: [],
      closingHtml: '',
      primaryCta: { label: '', href: '/' },
      secondaryCta: { label: '', href: '/' },
    },
    lang
  );

  return {
    ...lesson,
    title: meta.title,
    subtitle: meta.subtitle,
    podcastChapters: localizedChapters,
    flashcard: {
      nguHanh:
        lang === 'en'
          ? 'Five Elements (Yin-Yang & Generation/Control)'
          : lang === 'zh'
            ? '阴阳五行与生克制化'
            : lang === 'ko'
              ? '음양오행 및 상생·상극'
              : '陰陽五行＆相生・相剋',
      hoaKhi: meta.title.split(':')[0],
      chuSu: meta.subtitle,
      dacHam:
        lang === 'en'
          ? 'Evaluate Temple (Mieu), Prosperous (Vuong), Gain (Dac), Neutral (Binh) & Fallen (Ham) states across 12 Branches'
          : lang === 'zh'
            ? '审视在十二地支中的庙、旺、得、平、陷状态及三方四正会照'
            : lang === 'ko'
              ? '12지지에서의 묘·왕·득·평·함 상태 및 삼방사정 회조 판별'
              : '十二支における廟・旺・得・平・陥の状態および三方四正の会照を判定',
      cauPhu:
        lang === 'en'
          ? 'Never judge a single star in isolation — always read the full Three Harmonies & Four的正 formation.'
          : lang === 'zh'
            ? '独守不成格 —— 切忌单星独断，必合参本宫（40%）、对宫（30%）与三合宫（30%）。'
            : lang === 'ko'
              ? '독수불성격(獨守不成格) — 단일 성요로 단정하지 말고 본궁(40%)·대궁(30%)·삼합(30%)을 함께 보라.'
              : '独守不成格 — 単独の星で断定せず、必ず本宮（40%）・対宮（30%）・三合宮（30%）を合わせて読む。',
      cotLoi: meta.subtitle,
    },
    contentHtml: dummyPage.bodyHtml,
  };
}
