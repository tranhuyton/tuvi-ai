import React from 'react';
import {
  Sparkles,
  Compass,
  Crown,
  Headphones,
  Layers,
  ShieldCheck,
  Star,
  BookOpen,
  Flame,
  Droplets,
  Mountain,
  Wind,
  Orbit,
  Radio,
} from 'lucide-react';

export interface ArticleVisualSpec {
  theme: 'amber' | 'emerald' | 'indigo' | 'purple' | 'rose';
  bgImage: string;
  diagramTitle: string;
  diagramSubtitle: string;
  centerSymbol: string;
  centerLabel: string;
  nodes: { label: string; sub: string; badge?: string }[];
  caption: string;
}

const ARTICLE_VISUAL_MAP: Record<string, ArticleVisualSpec> = {
  P1: {
    theme: 'amber',
    bgImage: '/images/cam-nang-luan-menh.png',
    diagramTitle: 'Cấu Trúc Bản Luận Giải Chuyên Sâu Pro (~2.500 Từ)',
    diagramSubtitle: 'Tam Hợp Mệnh • Tài • Quan + 14 Chính Tinh + Vận Hạn 4 Mùa',
    centerSymbol: '📜',
    centerLabel: 'Bản Pro 119k',
    nodes: [
      { label: 'Mệnh - Tài - Quan', sub: 'Trục cốt lõi sự nghiệp & tiền bạc', badge: 'Trọng tâm' },
      { label: '14 Chính Tinh & Tứ Hóa', sub: 'Đắc/hãm địa & Lộc Quyền Khoa Kỵ', badge: 'Chi tiết' },
      { label: 'Vận Hạn 4 Mùa', sub: 'Xuân • Hạ • Thu • Đông trong năm', badge: 'Thời vận' },
      { label: 'Tặng 2 Câu Hỏi AI', sub: 'Trị giá 99.000đ hỏi đáp trực tiếp', badge: 'Quà tặng' },
    ],
    caption: 'Minh họa cấu trúc Bản Luận Giải Chuyên Sâu Pro (119.000đ) — Tử Vi & Phong Thủy Thầy Tôn',
  },
  P2: {
    theme: 'amber',
    bgImage: '/images/cam-nang-luan-menh.png',
    diagramTitle: 'Toàn Cảnh Bản Chuyên Gia Expert (~4.500 – 6.000 Từ)',
    diagramSubtitle: 'Luận Trọn Vẹn 12 Cung Vị & Chi Tiết 12 Tháng Âm Lịch',
    centerSymbol: '👑',
    centerLabel: 'Expert 269k',
    nodes: [
      { label: 'Toàn Bộ 12 Cung', sub: 'Mệnh, Thân, Phụ, Phúc, Điền, Quan, Nô...', badge: '12/12 Cung' },
      { label: 'Lịch Hạn 12 Tháng', sub: 'Tháng 1 đến Tháng 12 Âm lịch', badge: 'Từng tháng' },
      { label: 'Tam Phương Tứ Chính', sub: 'Phối chiếu Tứ Hóa & Tuần Triệt', badge: 'Chuyên gia' },
      { label: 'Chỉ Trả Chênh Lệch', sub: 'Từ Pro lên Expert chỉ +150.000đ', badge: 'Ưu đãi' },
    ],
    caption: 'Minh họa phạm vi luận giải 12 cung & 12 tháng của Bản Chuyên Gia Expert (269.000đ)',
  },
  P3: {
    theme: 'amber',
    bgImage: '/images/cam-nang-luan-menh.png',
    diagramTitle: 'Hệ Thống Hỏi Đáp Tử Vi Cùng AI Thầy Tôn',
    diagramSubtitle: 'Đối Chiếu Trực Tiếp Lá Số Đương Số • Giải Đáp Theo Từng Quyết Định',
    centerSymbol: '🤖',
    centerLabel: 'AI Thầy Tôn',
    nodes: [
      { label: 'Gói Cơ Bản (49k)', sub: '2 câu hỏi về 1 cung hoặc xu hướng chung', badge: '49.000đ' },
      { label: 'Gói Chuyên Sâu (99k)', sub: '2 câu gắn với quyết định & mốc thời gian', badge: '99.000đ' },
      { label: 'Gói Chuyên Gia (129k)', sub: '2 câu phối chiếu nhiều cung & tháng âm', badge: '129.000đ' },
      { label: 'Đọc Thẳng Lá Số', sub: 'Không trả lời chung chung kiểu văn mẫu', badge: 'Thực chiến' },
    ],
    caption: 'Minh họa cơ chế đọc lá số và phản hồi theo cấp độ của Trợ lý AI Thầy Tôn',
  },
  DV1: {
    theme: 'amber',
    bgImage: '/images/cam-nang-luan-menh.png',
    diagramTitle: 'Tham Vấn Tử Vi Trực Tiếp 1-1 Cùng Thầy Tôn',
    diagramSubtitle: 'Tại Royal City (Hà Nội) Hoặc Video Call • Định Giờ Sinh & Giải Quyết Việc Lớn',
    centerSymbol: '🧭',
    centerLabel: 'Tham Vấn 1-1',
    nodes: [
      { label: 'Thẩm Định Giờ Sinh', sub: 'Đối chiếu biến cố quá khứ & diện tướng', badge: 'Bước 1' },
      { label: 'Luận Đại Vận & Lưu Niên', sub: 'Nhận diện khúc cua sự nghiệp & tài chính', badge: 'Bước 2' },
      { label: 'Soi Diện Tướng & Chỉ Tay', sub: 'Kiểm chứng phúc khí & hậu vận thực tế', badge: 'Bước 3' },
      { label: 'Lộ Trình Hành Động', sub: 'Giải pháp cụ thể, không hù dọa cúng lễ', badge: 'Bước 4' },
    ],
    caption: 'Quy trình 4 bước tham vấn Tử Vi & Tướng Pháp trực tiếp 1-1 cùng Thầy Tôn',
  },
  DV2: {
    theme: 'amber',
    bgImage: '/images/cam-nang-luan-menh.png',
    diagramTitle: 'Định Hướng Học Tập, Chọn Ngành & Nghề Nghiệp Cho Con',
    diagramSubtitle: 'Kết Hợp Tử Vi Đẩu Số & 15+ Năm Kinh Nghiệm Giảng Dạy Quốc Tế Cambridge IGCSE / IELTS',
    centerSymbol: '🎓',
    centerLabel: 'Định Hướng Con',
    nodes: [
      { label: 'Tư Duy & Năng Khiếu', sub: 'Bắc Đẩu / Nam Đẩu & bộ Văn Tinh tại Mệnh', badge: 'Năng lực' },
      { label: 'Chọn Khối & Chọn Ngành', sub: 'Tài chính, Kỹ thuật, Y dược, Nghệ thuật...', badge: 'Ngành học' },
      { label: 'Cung Thiên Di & Du Học', sub: 'Đánh giá cát lợi khi xuất ngoại du học', badge: 'Du học' },
      { label: 'Đại Vận 15 – 25 Tuổi', sub: 'Điểm rơi thi cử & bước ngoặt lập thân', badge: 'Thời điểm' },
    ],
    caption: 'Mô hình đọc lá số định hướng học tập & nghề nghiệp cho con cùng Thầy Tôn',
  },
  TR: {
    theme: 'amber',
    bgImage: '/images/cam-nang-luan-menh.png',
    diagramTitle: 'Chuyên Gia Tử Vi & Phong Thủy Thầy Tôn (Trần Huy Tôn)',
    diagramSubtitle: 'Tư Duy Toán Học & Tài Chính UK Kết Hợp Hơn 18 Năm Nghiên Cứu Mệnh Lý Cổ Truyền',
    centerSymbol: '☯️',
    centerLabel: 'Thầy Tôn',
    nodes: [
      { label: 'Chuyên Toán - Tin ĐHTH', sub: 'Tư duy cấu trúc & hệ thống logic chặt chẽ', badge: 'Nền tảng' },
      { label: 'Cử Nhân & Thạc Sỹ ĐH Lancaster', sub: 'Chuyên ngành Tài chính & Kế toán tại Anh Quốc', badge: '7+ năm tại UK' },
      { label: '15+ Năm Giảng Dạy', sub: 'IELTS & Toán, Kinh tế Cambridge IGCSE', badge: 'Sư phạm' },
      { label: '18+ Năm Tử Vi & Phong Thủy', sub: 'Luận giải thực chứng, minh bạch cơ sở', badge: 'Thực chiến' },
    ],
    caption: 'Bốn trụ cột học thuật & thực chứng của Chuyên gia Thầy Tôn (Trần Huy Tôn)',
  },
  LH: {
    theme: 'amber',
    bgImage: '/images/cam-nang-luan-menh.png',
    diagramTitle: 'Kênh Liên Hệ Chính Thức & Đặt Lịch Tham Vấn',
    diagramSubtitle: 'R2B 2219 Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội • Zalo / Hotline 0935 058 688',
    centerSymbol: '📍',
    centerLabel: 'Royal City HN',
    nodes: [
      { label: 'Hotline / Zalo', sub: '0935 058 688 (Hỗ trợ đặt lịch & mở khóa)', badge: 'Trực tiếp' },
      { label: 'Văn Phòng Tham Vấn', sub: 'R2B 2219, Royal City, 72 Nguyễn Trãi, HN', badge: 'Tại Hà Nội' },
      { label: 'Tư Vấn Online 1-1', sub: 'Video Call cho khách hàng toàn quốc & quốc tế', badge: 'Từ xa' },
      { label: 'Mở Khóa Tự Động 24/7', sub: 'Quét mã VietQR nhận bài luận ngay lập tức', badge: 'Tự động' },
    ],
    caption: 'Thông tin liên hệ & quy trình đặt lịch chính thức tại Tử Vi & Phong Thủy Thầy Tôn',
  },
  C1: {
    theme: 'emerald',
    bgImage: '/images/cam-nang-phong-thuy.png',
    diagramTitle: 'Hệ Thống Tư Vấn Phong Thủy Theo Lá Số Tử Vi',
    diagramSubtitle: 'Thiên Thời (Lá Số Đương Số) • Địa Lợi (Dương Trạch) • Nhân Hòa (Cách Sống)',
    centerSymbol: '🧭',
    centerLabel: 'Thiên - Địa - Nhân',
    nodes: [
      { label: 'Phong Thủy Nhà Ở', sub: 'Cửa chính, phòng ngủ, bếp, bàn thờ hợp mệnh', badge: 'Dương trạch' },
      { label: 'Văn Phòng & Cửa Hàng', sub: 'Bàn giám đốc, quầy thu ngân, kích tài lộc', badge: 'Kinh doanh' },
      { label: 'Cải Vận Theo Dụng Thần', sub: 'Bổ khuyết Ngũ hành thiếu hụt trên lá số', badge: 'Dụng thần' },
      { label: 'Trạch Nhật Xem Ngày', sub: 'Động thổ, nhập trạch, khai trương, cưới hỏi', badge: 'Chọn ngày' },
    ],
    caption: 'Sơ đồ phối hợp Lá Số Tử Vi và Phong Thủy Dương Trạch của Thầy Tôn',
  },
  S1: {
    theme: 'emerald',
    bgImage: '/images/cam-nang-phong-thuy.png',
    diagramTitle: 'Phong Thủy Nhà Ở & Chung Cư Theo Cung Điền Trạch',
    diagramSubtitle: 'Dương Trạch Tam Yếu: Môn (Cửa Chính) • Chủ (Phòng Ngủ) • Táo (Bếp Nấu)',
    centerSymbol: '🏠',
    centerLabel: 'Dương Trạch',
    nodes: [
      { label: 'Môn (Cửa Chính & Ban Công)', sub: 'Đón nạp khí & xác định hướng cát lành', badge: 'Nạp khí' },
      { label: 'Chủ (Phòng Ngủ Gia Chủ)', sub: 'Tọa cát hướng cát, dưỡng thần & sức khỏe', badge: 'An thần' },
      { label: 'Táo (Bếp & Khu Nước)', sub: 'Tọa hung hướng cát, giữ lửa tài lộc gia đạo', badge: 'Tài khố' },
      { label: 'Đối Chiếu Cung Điền Trạch', sub: 'Chọn thời điểm mua nhà, sửa nhà hợp đại vận', badge: 'Lá số' },
    ],
    caption: 'Sơ đồ Dương Trạch Tam Yếu (Môn - Chủ - Táo) kết hợp cung Điền Trạch trên lá số',
  },
  S2: {
    theme: 'emerald',
    bgImage: '/images/cam-nang-phong-thuy.png',
    diagramTitle: 'Phong Thủy Văn Phòng, Cửa Hàng & Công Ty',
    diagramSubtitle: 'Tối Ưu Dòng Khí Minh Đường • Vị Trí Lãnh Đạo • Kích Hoạt Cung Tài Bạch',
    centerSymbol: '🏢',
    centerLabel: 'Kinh Doanh',
    nodes: [
      { label: 'Bàn Làm Việc Lãnh Đạo', sub: 'Tựa sơn vững chãi, tầm nhìn bao quát minh đường', badge: 'Quyền uy' },
      { label: 'Quầy Thu Ngân & Két Sắt', sub: 'Đặt tại tụ khí điểm, tránh xung sát trực tiếp', badge: 'Tụ tài' },
      { label: 'Lối Đón Khách (Minh Đường)', sub: 'Thông thoáng, dẫn sinh khí vào khu giao dịch', badge: 'Sinh khí' },
      { label: 'Hợp Mệnh Chủ Doanh Nghiệp', sub: 'Màu sắc & hướng hợp cung Quan Lộc, Tài Bạch', badge: 'Bản mệnh' },
    ],
    caption: 'Minh họa bố cục phong thủy văn phòng & cửa hàng theo lá số người đứng đầu',
  },
  S3: {
    theme: 'emerald',
    bgImage: '/images/cam-nang-phong-thuy.png',
    diagramTitle: 'Phong Thủy Cải Vận & Kích Hoạt Tài Lộc Theo Lá Số',
    diagramSubtitle: 'Nhận Diện Gốc Rễ Vận Hạn • Điều Chỉnh Không Gian • Cân Bằng Ngũ Hành',
    centerSymbol: '🌿',
    centerLabel: 'Cải Vận',
    nodes: [
      { label: 'Đọc Đúng Nút Thắt Lá Số', sub: 'Xác định cung bị Tuần/Triệt hoặc Hóa Kỵ, Sát tinh', badge: 'Chẩn mệnh' },
      { label: 'Chọn Hành Dụng Thần', sub: 'Tìm hành tiết chế hung sát & sinh trợ chính tinh', badge: 'Dụng thần' },
      { label: 'Điều Chỉnh Dương Trạch', sub: 'Ánh sáng, vị trí ngồi, hướng ngủ & cây xanh', badge: 'Không gian' },
      { label: 'Không Cúng Bái Hù Dọa', sub: 'Thay đổi thói quen, quản trị rủi ro theo vận', badge: 'Thực tế' },
    ],
    caption: 'Quy trình 4 bước cải vận thực chứng dựa trên Lá số Tử Vi & Phong thủy không gian sống',
  },
  S4: {
    theme: 'emerald',
    bgImage: '/images/cam-nang-phong-thuy.png',
    diagramTitle: 'Nghệ Thuật Trạch Nhật — Xem Ngày Tốt Theo Tuổi & Lá Số',
    diagramSubtitle: 'Tránh Xung Tuổi Gia Chủ • Chọn Ngày Hoàng Đạo • Định Giờ Cát Khởi Sự',
    centerSymbol: '📅',
    centerLabel: 'Trạch Nhật',
    nodes: [
      { label: 'Loại Ngày Xung Kỵ', sub: 'Tránh Tam Nương, Nguyệt Kỵ, Sát Chủ & xung tuổi', badge: 'Bước 1' },
      { label: 'Chọn Trực & Sao Tốt', sub: 'Trực Thành, Trực Khai, Thiên Đức, Nguyệt Đức', badge: 'Bước 2' },
      { label: 'Phối Ngũ Hành Bản Mệnh', sub: 'Can Chi ngày sinh trợ hoặc tỷ hòa tuổi gia chủ', badge: 'Bước 3' },
      { label: 'Định Giờ Hoàng Đạo', sub: 'Chọn canh giờ đẹp để động thổ, mở hàng, rước dâu', badge: 'Bước 4' },
    ],
    caption: 'Sơ đồ 4 tầng lọc ngày giờ tốt (Trạch Nhật) cho động thổ, nhập trạch, khai trương, cưới hỏi',
  },
  B1: {
    theme: 'indigo',
    bgImage: '/images/cam-nang-tinh-dau.png',
    diagramTitle: 'Quy Trình 5 Bước Đọc Lá Số Tử Vi Cho Người Mới',
    diagramSubtitle: 'Thiên Bàn • Mệnh Thân • Tam Hợp Mệnh Tài Quan • 12 Cung • Đại Vận & Lưu Niên',
    centerSymbol: '🌌',
    centerLabel: '5 Bước Đọc',
    nodes: [
      { label: '1. Thiên Bàn & Cục Mệnh', sub: 'Âm Dương thuận/nghịch lý, Mệnh - Cục sinh khắc', badge: 'Gốc rễ' },
      { label: '2. Cung Mệnh & Cung Thân', sub: 'Tính cách bẩm sinh (tiền vận) & xu hướng hậu vận', badge: 'Trụ cột' },
      { label: '3. Tam Hợp Mệnh - Tài - Quan', sub: 'Tam phương tứ chính định hình sự nghiệp & tiền bạc', badge: 'Khung sườn' },
      { label: '4. Đại Vận 10 Năm & Lưu Niên', sub: 'Đặt lá số vào dòng thời gian để biết lúc tiến/lùi', badge: 'Thời vận' },
    ],
    caption: 'Bản đồ tư duy 5 bước đọc lá số Tử Vi Đẩu Số chuẩn mực cho người mới bắt đầu',
  },
  B2: {
    theme: 'indigo',
    bgImage: '/images/cam-nang-tinh-dau.png',
    diagramTitle: 'Hệ Thống 14 Chính Tinh: Bắc Đẩu Tinh & Nam Đẩu Tinh',
    diagramSubtitle: 'Miếu • Vượng • Đắc • Bình • Hãm Địa Trên 12 Cung Địa Chi',
    centerSymbol: '⭐',
    centerLabel: '14 Chính Tinh',
    nodes: [
      { label: 'Chòm Bắc Đẩu (6 Sao)', sub: 'Tử Vi, Tham Lang, Cự Môn, Lộc Tồn, Văn Khúc, Liêm Trinh, Vũ Khúc, Phá Quân', badge: 'Mạnh mẽ' },
      { label: 'Chòm Nam Đẩu (8 Sao)', sub: 'Thiên Phủ, Thiên Cơ, Thiên Tướng, Thiên Lương, Thiên Đồng, Thất Sát', badge: 'Bền bỉ' },
      { label: 'Nhóm Tĩnh (Tử Phủ, Cơ Nguyệt)', sub: 'Thiên về quản trị, tài chính, mưu lược, ổn định', badge: 'Văn cách' },
      { label: 'Nhóm Động (Sát Phá Liêm Tham)', sub: 'Thiên về khai phá, kinh doanh, đột phá, võ cách', badge: 'Võ cách' },
    ],
    caption: 'Phân nhóm 14 Chính Tinh theo chòm Bắc Đẩu – Nam Đẩu và động thái Tĩnh – Động',
  },
  B3: {
    theme: 'indigo',
    bgImage: '/images/cam-nang-tinh-dau.png',
    diagramTitle: 'Tứ Hóa Trong Tử Vi: Hóa Lộc • Hóa Quyền • Hóa Khoa • Hóa Kỵ',
    diagramSubtitle: 'Động Lực Biến Hóa Theo 10 Thiên Can: Giáp • Ất • Bính • Đinh • Mậu • Kỷ • Canh • Tân • Nhâm • Quý',
    centerSymbol: '🔄',
    centerLabel: 'Tứ Hóa Tinh',
    nodes: [
      { label: 'Hóa Lộc (Mùa Xuân • Mộc/Thổ)', sub: 'Khởi phát tài lộc, nhân duyên, cơ hội thuận lợi', badge: 'Tài lộc' },
      { label: 'Hóa Quyền (Mùa Hạ • Hỏa/Mộc)', sub: 'Quyền tự quyết, bản lĩnh lãnh đạo, sức bật mạnh', badge: 'Quyền lực' },
      { label: 'Hóa Khoa (Mùa Thu • Thủy/Mộc)', sub: 'Học vấn, uy tín, bằng cấp & quý nhân cứu giải', badge: 'Giải thần' },
      { label: 'Hóa Kỵ (Mùa Đông • Thủy)', sub: 'Áp lực, thị phi,执 niệm nhưng cũng là điểm sâu sắc', badge: 'Thử thách' },
    ],
    caption: 'Sơ đồ chu trình 4 trạng thái năng lượng của Tứ Hóa (Lộc - Quyền - Khoa - Kỵ)',
  },
  B4: {
    theme: 'indigo',
    bgImage: '/images/cam-nang-tinh-dau.png',
    diagramTitle: 'Mệnh Vô Chính Diệu — Cách Mượn Sao Xung Chiếu & Đắc Tam Không',
    diagramSubtitle: 'Không Có Chính Tinh Tọa Thủ • Linh Hoạt Ứng Biến Theo Cung Xung Chiếu & Tam Hợp',
    centerSymbol: '🌕',
    centerLabel: 'Vô Chính Diệu',
    nodes: [
      { label: 'Mượn Sao Cung Thiên Di', sub: 'Hấp thụ ~70% năng lượng chính tinh cung đối diện', badge: 'Xung chiếu' },
      { label: 'Xét Tam Hợp Hội Chiếu', sub: 'Tìm bộ sao dẫn dắt từ cung Tài Bạch & Quan Lộc', badge: 'Tam phương' },
      { label: 'Đắc Nhị Không / Tam Không', sub: 'Tuần, Triệt, Địa Không, Thiên Không giúp phát dã như lôi', badge: 'Thượng cách' },
      { label: 'Cần Nhật Nguyệt Sáng Chiếu', sub: 'Thái Dương, Thái Âm miếu vượng chiếu về cực quý', badge: 'Cát hóa' },
    ],
    caption: 'Nguyên tắc đọc cung Mệnh Vô Chính Diệu: Mượn sao xung chiếu, xét Tam hợp & Tam Không',
  },
  B5: {
    theme: 'purple',
    bgImage: '/images/cam-nang-12-cung.png',
    diagramTitle: 'Khớp Nối Đại Vận 10 Năm, Tiểu Vận & Lưu Niên Thái Tuế',
    diagramSubtitle: 'Nguyên Tắc "Đại Vận Trọng Khí • Lưu Niên Trọng Thực" Khi Chấm Hạn Năm',
    centerSymbol: '⏳',
    centerLabel: 'Đại - Tiểu Vận',
    nodes: [
      { label: 'Gốc Mệnh (Tiên Thiên)', sub: 'Năng lực & giới hạn nền tảng của cả cuộc đời', badge: 'Tầng 1' },
      { label: 'Đại Vận 10 Năm (Bối Cảnh)', sub: 'Khí vận chủ đạo của từng thập kỷ thuận hay nghịch', badge: 'Tầng 2' },
      { label: 'Lưu Niên & Tiểu Vận (1 Năm)', sub: 'Sự kiện kích hoạt thực tế trong năm đang xem', badge: 'Tầng 3' },
      { label: 'Lưu Niên Tứ Hóa & Lưu Tinh', sub: 'Điểm nổ tài lộc, thăng tiến hoặc biến động trong năm', badge: 'Kích hoạt' },
    ],
    caption: 'Mô hình 3 tầng thời gian (Tiên thiên - Đại vận 10 năm - Lưu niên 1 năm) trong Tử Vi Đẩu Số',
  },
  B6: {
    theme: 'emerald',
    bgImage: '/images/cam-nang-phong-thuy.png',
    diagramTitle: 'Cơ Chế Phối Hợp Tử Vi Đẩu Số (Thiên Thời) & Phong Thủy (Địa Lợi)',
    diagramSubtitle: 'Lá Số Cho Biết Khi Nào Nên Làm • Phong Thủy Cho Biết Bố Trí Không Gian Ra Sao',
    centerSymbol: '☯️',
    centerLabel: 'Tử Vi + Phong Thủy',
    nodes: [
      { label: 'Lá Số Tử Vi = Thiên Thời', sub: 'Đọc chu kỳ vận hạn, biết năm nào nên tiến hay thủ', badge: 'Thời điểm' },
      { label: 'Phong Thủy = Địa Lợi', sub: 'Tối ưu trường khí nơi ở và nơi làm việc thực tế', badge: 'Không gian' },
      { label: 'Cung Điền Trạch & Bản Mệnh', sub: 'Cầu nối trực tiếp giữa lá số và ngôi nhà đang ở', badge: 'Giao điểm' },
      { label: 'Nhân Hòa = Hành Động', sub: 'Quyết định đúng đắn và nỗ lực của chính đương số', badge: 'Quyết định' },
    ],
    caption: 'Sơ đồ phối hợp Thiên Thời (Lá số Tử Vi) – Địa Lợi (Phong Thủy) – Nhân Hòa',
  },
  B7: {
    theme: 'indigo',
    bgImage: '/images/cam-nang-tinh-dau.png',
    diagramTitle: 'Phương Pháp Tìm Lại & Kiểm Chứng Giờ Sinh Khi Không Nhớ Rõ',
    diagramSubtitle: 'Đối Chiếu Canh Giờ Liền Kề • Hình Tướng • Tính Cách • Biến Cố Quá Khứ',
    centerSymbol: '🕰️',
    centerLabel: 'Định Giờ Sinh',
    nodes: [
      { label: 'Khoanh Vùng Canh Giờ', sub: 'Lập 2–3 lá số ở các khung 2 tiếng liền kề nhau', badge: 'Bước 1' },
      { label: 'Đối Chiếu Diện Tướng', sub: 'Khuôn mặt, vóc dáng, thần thái ứng với Chính tinh', badge: 'Bước 2' },
      { label: 'Kiểm Tra Sự Kiện Quá Khứ', sub: 'Năm cưới hỏi, mua nhà, nhảy việc, hạn sức khỏe', badge: 'Bước 3' },
      { label: 'Xét Cung Phụ Mẫu & Huynh Đệ', sub: 'Đối chiếu thông tin cha mẹ và anh chị em ruột', badge: 'Bước 4' },
    ],
    caption: 'Quy trình 4 bước định giờ sinh (Khảo giờ sinh) khi đương số chỉ nhớ mang máng buổi sinh',
  },
  B8: {
    theme: 'amber',
    bgImage: '/images/cam-nang-luan-menh.png',
    diagramTitle: 'Tam Hợp Kiểm Chứng: Diện Tướng • Chỉ Tay • Lá Số Tử Vi',
    diagramSubtitle: 'Tướng Tùy Tâm Sinh • Mệnh Do Tinh Định • Đối Chiếu Đa Chiều Tăng Độ Chính Xác',
    centerSymbol: '✋',
    centerLabel: 'Tướng & Mệnh',
    nodes: [
      { label: 'Tam Đình & Ngũ Quan', sub: 'Thượng - Trung - Hạ đình phản ánh tiền, trung, hậu vận', badge: 'Diện tướng' },
      { label: '3 Đường Chỉ Tay Chính', sub: 'Sinh Đạo (sức khỏe), Trí Đạo (tư duy), Tâm Đạo (tình cảm)', badge: 'Chỉ tay' },
      { label: 'Gò Bàn Tay & Sắc Khí', sub: 'Thần sắc hiện tại cho biết khí vận đang vượng hay suy', badge: 'Khí sắc' },
      { label: 'Khớp Với 12 Cung Lá Số', sub: 'Kiểm chứng cung Mệnh, Thân, Tật Ách, Phúc Đức', badge: 'Đối chiếu' },
    ],
    caption: 'Sơ đồ phối hợp Nhân tướng học (Diện tướng & Chỉ tay) với Lá số Tử Vi 108 sao',
  },
  B9: {
    theme: 'purple',
    bgImage: '/images/cam-nang-12-cung.png',
    diagramTitle: 'Luận Giải Cung Phu Thê — Hôn Nhân, Duyên Phận & Mẫu Người Phối Ngẫu',
    diagramSubtitle: 'Phối Chiếu Cung Phu Thê • Phúc Đức • Quan Lộc • Thiên Di',
    centerSymbol: '💍',
    centerLabel: 'Cung Phu Thê',
    nodes: [
      { label: 'Chính Tinh Tại Phu Thê', sub: 'Phản ánh tính cách, ngoại hình & nghề nghiệp bạn đời', badge: 'Bạn đời' },
      { label: 'Cung Phúc Đức (Tam Hợp)', sub: 'Nền tảng âm đức & sự bền vững của đời sống hôn nhân', badge: 'Gốc duyên' },
      { label: 'Đào Hoa, Hồng Loan, Cô Quả', sub: 'Duyên sớm hay muộn, độ gắn kết hay khoảng cách', badge: 'Tình duyên' },
      { label: 'Cách Hóa Giải Xung Khắc', sub: 'Kết hôn muộn hoặc chọn người hợp cung, nhường nhịn', badge: 'Hóa giải' },
    ],
    caption: 'Sơ đồ tam phương tứ chính khi luận giải cung Phu Thê (Phu Thê - Phúc Đức - Thiên Di - Quan Lộc)',
  },
  B10: {
    theme: 'purple',
    bgImage: '/images/cam-nang-12-cung.png',
    diagramTitle: 'Tử Vi Năm 2027 Đinh Mùi (Thiên Hà Thủy) Cho 12 Con Giáp',
    diagramSubtitle: 'Lưu Niên Thái Tuế Tại Mùi • Tứ Hóa Can Đinh: Âm (Lộc) • Đồng (Quyền) • Cơ (Khoa) • Cự (Kỵ)',
    centerSymbol: '🐐',
    centerLabel: 'Đinh Mùi 2027',
    nodes: [
      { label: 'Thái Âm Hóa Lộc', sub: 'Thuận lợi tài chính, tích lũy, bất động sản & đầu tư bền', badge: 'Hóa Lộc' },
      { label: 'Thiên Đồng Hóa Quyền', sub: 'Chủ động đổi mới, mở rộng dịch vụ & phúc lợi', badge: 'Hóa Quyền' },
      { label: 'Thiên Cơ Hóa Khoa', sub: 'Trí tuệ, công nghệ, hoạch định chiến lược sáng suốt', badge: 'Hóa Khoa' },
      { label: 'Cự Môn Hóa Kỵ', sub: 'Cẩn trọng lời nói, hợp đồng pháp lý & tranh chấp', badge: 'Hóa Kỵ' },
    ],
    caption: 'Bản đồ năng lượng Tứ Hóa Can Đinh năm 2027 Đinh Mùi (Thái Âm Lộc - Thiên Đồng Quyền - Thiên Cơ Khoa - Cự Môn Kỵ)',
  },
  B11: {
    theme: 'purple',
    bgImage: '/images/cam-nang-12-cung.png',
    diagramTitle: 'Luận Giải Cung Tài Bạch — Cách Kiếm Tiền, Giữ Tiền & Nguồn Thu',
    diagramSubtitle: 'Phối Chiếu Tam Hợp Mệnh • Tài Bạch • Quan Lộc & Cung Điền Trạch (Kho Tiền)',
    centerSymbol: '💰',
    centerLabel: 'Cung Tài Bạch',
    nodes: [
      { label: 'Nhóm Tài Tinh Chính', sub: 'Vũ Khúc, Thái Âm, Thiên Phủ, Lộc Tồn, Hóa Lộc', badge: 'Tài tinh' },
      { label: 'Cung Tài Bạch (Dòng Tiền)', sub: 'Cách tạo ra thu nhập & thái độ chi tiêu hàng ngày', badge: 'Dòng tiền' },
      { label: 'Cung Điền Trạch (Kho Chứa)', sub: 'Năng lực giữ tiền, tích sản và bất động sản cuối cùng', badge: 'Tích sản' },
      { label: 'Quản Trị Hao Tán (Không Kiếp)', sub: 'Chuyển tiền mặt thành tài sản dài hạn khi gặp Hao, Kiếp', badge: 'Giữ tiền' },
    ],
    caption: 'Sơ đồ phân biệt Dòng Tiền (Cung Tài Bạch) và Kho Tích Sản (Cung Điền Trạch)',
  },
  B12: {
    theme: 'purple',
    bgImage: '/images/cam-nang-12-cung.png',
    diagramTitle: 'Luận Giải Cung Quan Lộc — Định Hướng Nghề Nghiệp & Con Đường Thăng Tiến',
    diagramSubtitle: 'Lựa Chọn Làm Chủ, Quản Lý Hay Chuyên Gia Theo Cách Cục Tại Quan Lộc',
    centerSymbol: '💼',
    centerLabel: 'Cung Quan Lộc',
    nodes: [
      { label: 'Tử Phủ Vũ Tướng', sub: 'Quản lý cấp cao, tài chính, ngân hàng, tổ chức lớn', badge: 'Quản trị' },
      { label: 'Sát Phá Liêm Tham', sub: 'Kinh doanh độc lập, sản xuất, kỹ thuật, khai phá thị trường', badge: 'Khai phá' },
      { label: 'Cơ Nguyệt Đồng Lương', sub: 'Tham mưu, giáo dục, y dược, hành chính, nghiên cứu', badge: 'Chuyên môn' },
      { label: 'Cự Nhật / Lương Nhật', sub: 'Ngoại giao, luật pháp, truyền thông, thương mại quốc tế', badge: 'Ngôn từ' },
    ],
    caption: 'Bản đồ định hướng nghề nghiệp theo 4 nhóm cách cục chính tại cung Quan Lộc',
  },
  B13: {
    theme: 'purple',
    bgImage: '/images/cam-nang-12-cung.png',
    diagramTitle: 'Luận Giải Cung Điền Trạch — Đất Đai, Nhà Cửa & Vận Mua Bất Động Sản',
    diagramSubtitle: 'Điền Trạch Vừa Là Tổ Ấm Gia Đình, Vừa Là Kho Tích Trữ Tài Sản Lớn Nhất',
    centerSymbol: '🏡',
    centerLabel: 'Cung Điền Trạch',
    nodes: [
      { label: 'Sao Tốt Tại Điền Trạch', sub: 'Thiên Phủ, Thái Âm, Vũ Khúc, Lộc Tồn chủ nhiều điền sản', badge: 'Vượng điền' },
      { label: 'Tín Hiệu Năm Mua Nhà', sub: 'Lưu Lộc Tồn, Hóa Lộc, Hồng Loan, Thiên Hỷ hội Điền', badge: 'Thời điểm' },
      { label: 'Phong Thủy Ngôi Nhà', sub: 'Phản ánh địa thế, ánh sáng và hàng xóm xung quanh', badge: 'Môi trường' },
      { label: 'Lưu Ý Pháp Lý Đất Đai', sub: 'Khi Điền Trạch có Hóa Kỵ, Hình, Riêu cần kỹ giấy tờ', badge: 'An toàn' },
    ],
    caption: 'Sơ đồ đọc cung Điền Trạch: Năng lực tích lũy bất động sản & thời điểm mua nhà đất',
  },
  B14: {
    theme: 'indigo',
    bgImage: '/images/cam-nang-tinh-dau.png',
    diagramTitle: 'Lục Sát Tinh: Kình Dương • Đà La • Địa Không • Địa Kiếp • Hỏa Tinh • Linh Tinh',
    diagramSubtitle: 'Hung Hiểm Khi Hãm Địa Nhưng Là Động Lực Bứt Phá Khi Đắc Địa & Đúng Nghề',
    centerSymbol: '⚡',
    centerLabel: 'Lục Sát Tinh',
    nodes: [
      { label: 'Kình Dương – Đà La (Kim)', sub: 'Cạnh tranh sắc bén (Kình) & kiên trì ngầm (Đà)', badge: 'Bắc Đẩu' },
      { label: 'Hỏa Tinh – Linh Tinh (Hỏa)', sub: 'Bùng nổ tốc chiến (Hỏa) & phản xạ nhạy bén (Linh)', badge: 'Nam Đẩu' },
      { label: 'Địa Không – Địa Kiếp (Hỏa)', sub: 'Tư duy phá cách, sáng tạo đột phá hoặc biến động lớn', badge: 'Trung Thiên' },
      { label: 'Chuyển Hóa Thành Công Cụ', sub: 'Hợp kỹ thuật, phẫu thuật, công nghệ, đầu tư mạo hiểm', badge: 'Ứng dụng' },
    ],
    caption: 'Phân loại 3 cặp Lục Sát Tinh và cách chuyển hóa năng lượng sát phạt thành năng lực chuyên môn',
  },
  B15: {
    theme: 'indigo',
    bgImage: '/images/cam-nang-tinh-dau.png',
    diagramTitle: 'Tuần Trung Không Vong & Triệt Lộ Không Vong Trong Tử Vi',
    diagramSubtitle: '"Triệt Đáo Kim Cung, Tuần Lâm Hỏa Địa" • Quy Luật 30 Tuổi Trước & Sau',
    centerSymbol: '🛡️',
    centerLabel: 'Tuần & Triệt',
    nodes: [
      { label: 'Triệt Lộ Không Vong', sub: 'Mạnh từ 1–30 tuổi, chém đứt/đảo chiều cát hung rõ rệt', badge: 'Tiền vận' },
      { label: 'Tuần Trung Không Vong', sub: 'Ảnh hưởng bền bỉ từ sau 30 tuổi, bao bọc & kìm giữ', badge: 'Hậu vận' },
      { label: 'Đóng Tại Cung Tốt', sub: 'Làm chậm thành tựu, phải trải qua thử thách mới bền', badge: 'Thử thách' },
      { label: 'Đóng Tại Cung Xấu / Sát Tinh', sub: 'Chế ngự hung sát, biến nguy thành an (Tuần/Triệt chế sát)', badge: 'Cứu giải' },
    ],
    caption: 'So sánh cơ chế tác động của Tuần và Triệt theo mốc 30 tuổi và tính chất Cát/Hung của cung',
  },
  B16: {
    theme: 'indigo',
    bgImage: '/images/cam-nang-tinh-dau.png',
    diagramTitle: 'Lục Cát Tinh & Bộ Sao Đào Hoa – Hồng Loan – Thiên Hỷ',
    diagramSubtitle: 'Tả Phù • Hữu Bật • Văn Xương • Văn Khúc • Thiên Khôi • Thiên Việt',
    centerSymbol: '🌸',
    centerLabel: 'Lục Cát & Đào Hồng',
    nodes: [
      { label: 'Tả Phù – Hữu Bật', sub: 'Đội ngũ trợ lực, đồng nghiệp & khả năng phối hợp', badge: 'Trợ tinh' },
      { label: 'Văn Xương – Văn Khúc', sub: 'Học thuật, văn chương, nghệ thuật & tư duy tinh tế', badge: 'Văn tinh' },
      { label: 'Thiên Khôi – Thiên Việt', sub: 'Quý nhân nâng đỡ, cơ hội đỗ đạt & người dẫn đường', badge: 'Quý nhân' },
      { label: 'Đào Hoa – Hồng Loan', sub: 'Sức hút cá nhân, nhân duyên, thẩm mỹ & công chúng', badge: 'Nhân duyên' },
    ],
    caption: 'Hệ thống 3 cặp Lục Cát Tinh và bộ sao nhân duyên Đào Hoa – Hồng Loan – Thiên Hỷ',
  },
  B17: {
    theme: 'indigo',
    bgImage: '/images/cam-nang-tinh-dau.png',
    diagramTitle: 'Tứ Đại Cách Cục Trong Tử Vi Đẩu Số',
    diagramSubtitle: 'Tử Phủ Vũ Tướng • Sát Phá Liêm Tham • Cơ Nguyệt Đồng Lương • Cự Nhật',
    centerSymbol: '🏛️',
    centerLabel: '4 Đại Cách Cục',
    nodes: [
      { label: 'Tử Phủ Vũ Tướng', sub: 'Quân thần khánh hội: Lãnh đạo, quản trị & tài chính lớn', badge: 'Đế vương' },
      { label: 'Sát Phá Liêm Tham', sub: 'Trúc la tam hạn: Khai phá, kinh doanh & xoay chuyển thời cuộc', badge: 'Chiến tướng' },
      { label: 'Cơ Nguyệt Đồng Lương', sub: 'Tác lại nhân: Tham mưu, giáo dục, y học & hệ thống chuẩn', badge: 'Quân sư' },
      { label: 'Cự Môn – Thái Dương', sub: 'Cự Nhật đồng lâm: Ngoại giao, luật pháp & truyền thông', badge: 'Sứ giả' },
    ],
    caption: 'Bản đồ đối sánh 4 Đại Cách Cục quyết định thiên hướng sự nghiệp trong Tử Vi Đẩu Số',
  },
  B18: {
    theme: 'indigo',
    bgImage: '/images/cam-nang-tinh-dau.png',
    diagramTitle: 'Vòng Thái Tuế (12 Sao) & Vòng Lộc Tồn – Bác Sỹ (12 Sao)',
    diagramSubtitle: 'Thái Độ Ứng Xử Xã Hội • Chính Danh Pháp Lý • Dòng Chảy Tài Lộc Tự Nhiên',
    centerSymbol: '☸️',
    centerLabel: 'Thái Tuế & Lộc Tồn',
    nodes: [
      { label: 'Tuế – Hổ – Phù (Chính Danh)', sub: 'Thẳng thắn, trọng lý lẽ, có năng lực tổ chức & pháp lý', badge: 'Tam hợp Tuế' },
      { label: 'Tang – Tuế – Điếu (Biến Động)', sub: 'Đa sầu, lo xa, phải tự lực cánh sinh vượt nghịch cảnh', badge: 'Tam hợp Tang' },
      { label: 'Dương – Tử – Phúc (Đức Độ)', sub: 'Minh bạch, nhân hậu, được hưởng âm phúc & quý nhân', badge: 'Tam hợp Phúc' },
      { label: 'Vòng Lộc Tồn (Tích Lũy)', sub: 'Lộc Tồn luôn đi giữa Kình Dương – Đà La bảo vệ kho lộc', badge: 'Thiên lộc' },
    ],
    caption: 'Sơ đồ 4 tam hợp trong Vòng Thái Tuế và cấu trúc bảo vệ tài sản của Vòng Lộc Tồn',
  },
  B19: {
    theme: 'purple',
    bgImage: '/images/cam-nang-12-cung.png',
    diagramTitle: 'Luận Giải Cung Tử Tức & Cung Phúc Đức',
    diagramSubtitle: 'Mạch Nguồn Âm Đức Dòng Họ (Phúc Đức) & Duyên Con Cái, Hậu Duệ (Tử Tức)',
    centerSymbol: '🌱',
    centerLabel: 'Phúc Đức & Tử Tức',
    nodes: [
      { label: 'Cung Phúc Đức (Gốc Rễ)', sub: 'Chi phối độ bền của Tài Bạch, Phu Thê và sức mạnh tinh thần', badge: 'Âm phúc' },
      { label: 'Cung Tử Tức (Hoa Trái)', sub: 'Duyên con cái, phương pháp nuôi dạy & sự gắn kết thế hệ', badge: 'Hậu duệ' },
      { label: 'Tương Quan Nhân Quả', sub: 'Tích đức hành thiện ở hiện tại bồi đắp trực tiếp cho Tử Tức', badge: 'Bồi phúc' },
      { label: 'Soi Hạn Sinh Con', sub: 'Kết hợp Lưu Hồng Hỷ, Lưu Lộc Tồn tại Tử Tức & Phu Thê', badge: 'Tin vui' },
    ],
    caption: 'Mối liên hệ mật thiết giữa Gốc Phúc Đức dòng họ và Hoa trái Cung Tử Tức',
  },
  B21: {
    theme: 'purple',
    bgImage: '/images/cam-nang-12-cung.png',
    diagramTitle: 'Luận Giải Cung Thân (Thân Cư 6 Cung) & Cung Thiên Di',
    diagramSubtitle: 'Xu Hướng Hậu Vận Sau Tuổi 35 • Năng Lực Thích Nghi Môi Trường Bên Ngoài & Xuất Ngoại',
    centerSymbol: '✈️',
    centerLabel: 'Thân & Thiên Di',
    nodes: [
      { label: 'Thân Cư Mệnh / Phúc / Quan', sub: 'Tự chủ lý tưởng, trọng tinh thần hoặc gắn trọn với sự nghiệp', badge: 'Nội lực' },
      { label: 'Thân Cư Tài / Phu Thê / Di', sub: 'Trọng thực tế tài chính, gia đình hoặc lập nghiệp phương xa', badge: 'Ngoại cảnh' },
      { label: 'Cung Thiên Di (Mặt Tiền)', sub: 'Cơ hội xã hội, quý nhân ngoài đời & vận đi xa, xuất ngoại', badge: 'Thiên Di' },
      { label: 'Trục Mệnh – Thiên Di', sub: 'Sự cân bằng giữa nội tâm bên trong và biểu hiện ra xã hội', badge: 'Đối cung' },
    ],
    caption: 'Bản đồ 6 vị trí Thân cư và trục đối chiếu Mệnh – Thiên Di trong Tử Vi Đẩu Số',
  },
  B22: {
    theme: 'purple',
    bgImage: '/images/cam-nang-12-cung.png',
    diagramTitle: 'Cách Xem Hạn Kết Hôn & Hạn Sinh Con Trên Lá Số Tử Vi',
    diagramSubtitle: 'Nhận Diện Điểm Rơi Hỷ Tín Qua Đại Vận • Tiểu Vận • Lưu Niên Đào Hồng Hỷ',
    centerSymbol: '🎊',
    centerLabel: 'Hạn Hỷ Tín',
    nodes: [
      { label: 'Tín Hiệu Hạn Kết Hôn', sub: 'Lưu Thái Tuế, Hồng Loan, Đào Hoa, Thiên Hỷ hội Mệnh/Phu Thê', badge: 'Cưới hỏi' },
      { label: 'Tín Hiệu Hạn Sinh Con', sub: 'Lưu Lộc Tồn, Hóa Khoa, Thiên Hỷ, Thai, Đế Vượng hội Tử Tức', badge: 'Sinh con' },
      { label: 'Xét Đại Vận Đang Đi', sub: 'Đại vận chạm trục Phu Thê - Phúc Đức hoặc Tử Tức - Điền Trạch', badge: 'Đại vận' },
      { label: 'Chọn Năm & Tháng Đẹp', sub: 'Tránh năm xung trực diện hoặc chủ động chuẩn bị sức khỏe', badge: 'Chủ động' },
    ],
    caption: 'Sơ đồ nhận diện tổ hợp sao báo tin vui cưới hỏi & sinh con theo từng năm',
  },
  B23: {
    theme: 'purple',
    bgImage: '/images/cam-nang-12-cung.png',
    diagramTitle: 'Xem Tuổi Hợp Vợ Chồng & Hợp Tác Làm Ăn Theo Lá Số Tử Vi',
    diagramSubtitle: 'Vượt Qua Phép Xem Can Chi Bề Nổi • Đối Chiếu Cấu Trúc Sao 2 Lá Số Bù Trừ Nhau',
    centerSymbol: '🤝',
    centerLabel: 'Hợp Lá Số',
    nodes: [
      { label: 'Bù Trừ Tính Cách Chính Tinh', sub: 'Người cương (Sát Phá) phối người nhu (Cơ Nguyệt/Tử Phủ)', badge: 'Tương hỗ' },
      { label: 'Đối Chiếu Cung Phu Thê / Nô Bộc', sub: 'Xem mẫu người trên lá số A có ứng với mệnh lá số B không', badge: 'Đúng người' },
      { label: 'Độ Lệch Pha Đại Vận', sub: 'Khi người này vào vận trũng thì người kia đang ở vận vượng', badge: 'Đỡ vận' },
      { label: 'Phân Vai Khi Làm Ăn Chung', sub: 'Người mạnh Quan Lộc điều hành, người mạnh Tài Bạch giữ vốn', badge: 'Phân quyền' },
    ],
    caption: 'Phương pháp đối chiếu 2 lá số Tử Vi trong hôn nhân và hợp tác kinh doanh',
  },
  B24: {
    theme: 'emerald',
    bgImage: '/images/cam-nang-phong-thuy.png',
    diagramTitle: 'Xem Tuổi Làm Nhà Năm 2027 Đinh Mùi & Tuổi Đẹp Động Thổ',
    diagramSubtitle: 'Kiểm Tra Tam Tai • Kim Lâu • Hoang Ốc & Đối Chiếu Cung Điền Trạch Trên Lá Số',
    centerSymbol: '🏗️',
    centerLabel: 'Làm Nhà 2027',
    nodes: [
      { label: 'Hạn Tam Tai Năm Mùi', sub: 'Tuổi Tỵ - Ngọ - Mùi phạm Tam Tai năm 2027 Đinh Mùi', badge: 'Tam Tai' },
      { label: 'Hạn Kim Lâu & Hoang Ốc', sub: 'Tính theo tuổi mụ gia chủ để chọn năm khởi công thuận lợi', badge: 'Tuổi mụ' },
      { label: 'Thủ Pháp Mượn Tuổi', sub: 'Giải pháp an toàn khi cần xây sửa nhà đúng tiến độ thực tế', badge: 'Mượn tuổi' },
      { label: 'Soi Cung Điền Trạch 2027', sub: 'Kiểm tra dòng tiền và vận bất động sản trên lá số gia chủ', badge: 'Điền Trạch' },
    ],
    caption: 'Quy trình 4 bước thẩm định tuổi làm nhà, động thổ và nhập trạch năm 2027 Đinh Mùi',
  },
  B25: {
    theme: 'emerald',
    bgImage: '/images/cam-nang-phong-thuy.png',
    diagramTitle: 'Xem Tuổi Mở Hàng Đầu Năm & Khai Trương Năm 2027 Đinh Mùi',
    diagramSubtitle: 'Chọn Người Hợp Thiên Can Đinh (Nhâm/Quý) • Tam Hợp Hợi Mão Mùi • Lục Hợp Ngọ',
    centerSymbol: '🏮',
    centerLabel: 'Khai Trương 2027',
    nodes: [
      { label: 'Tam Hợp & Lục Hợp 2027', sub: 'Ưu tiên tuổi Hợi, Mão (Tam hợp) và tuổi Ngọ (Lục hợp với Mùi)', badge: 'Địa Chi' },
      { label: 'Thiên Can Quý Lộc Đinh', sub: 'Can Nhâm (Đinh Nhâm hợp Mộc), Can Giáp, Can Ất sinh trợ', badge: 'Thiên Can' },
      { label: 'Tránh Tuổi Xung Thái Tuế', sub: 'Tránh tuổi Sửu (Sửu Mùi tương xung) mở hàng đầu năm', badge: 'Tránh xung' },
      { label: 'Xét Vận Khí Người Mở Hàng', sub: 'Chọn người vía thoáng, gia đạo êm ấm, làm ăn đang thuận', badge: 'Vía tốt' },
    ],
    caption: 'Nguyên tắc chọn tuổi xông đất, mở hàng & khai trương hồng phát năm 2027 Đinh Mùi',
  },
  B26: {
    theme: 'emerald',
    bgImage: '/images/cam-nang-phong-thuy.png',
    diagramTitle: 'Hành Dụng Thần & Ngũ Hành Bổ Khuyết Trên Lá Số Tử Vi',
    diagramSubtitle: 'Vượt Qua Cách Xem Nạp Âm Đơn Giản • Xác Định Hành Cân Bằng Toàn Cục Lá Số',
    centerSymbol: '🔥',
    centerLabel: 'Ngũ Hành Dụng Thần',
    nodes: [
      { label: 'Xét Ngũ Hành Chính Tinh', sub: 'Tổng hợp hành của sao tọa Mệnh, Thân, Tài, Quan', badge: 'Bước 1' },
      { label: 'Xét Mùa Sinh (Nguyệt Lệnh)', sub: 'Sinh mùa Hạ vượng Hỏa cần Thủy; mùa Đông hàn cần Hỏa', badge: 'Bước 2' },
      { label: 'Chọn Hành Dụng Thần', sub: 'Hành giúp tiết chế Sát tinh và sinh trợ cho Chính tinh', badge: 'Bước 3' },
      { label: 'Ứng Dụng Thực Tiễn', sub: 'Chọn màu sắc, hướng làm việc, ngành nghề & đối tác', badge: 'Bước 4' },
    ],
    caption: 'Sơ đồ 4 bước xác định Hành Dụng Thần chuẩn xác theo Lá số Tử Vi & Mùa sinh',
  },
};

function getFallbackArticleSpec(codeOrSlug: string, title: string, groupNum?: number): ArticleVisualSpec {
  if (ARTICLE_VISUAL_MAP[codeOrSlug]) {
    return ARTICLE_VISUAL_MAP[codeOrSlug];
  }
  if (groupNum === 2 || codeOrSlug.includes('phong-thuy') || codeOrSlug.includes('ngay-tot')) {
    return {
      theme: 'emerald',
      bgImage: '/images/cam-nang-phong-thuy.png',
      diagramTitle: title,
      diagramSubtitle: 'Thiên Thời (Lá Số Tử Vi) • Địa Lợi (Phong Thủy Dương Trạch) • Nhân Hòa',
      centerSymbol: '🧭',
      centerLabel: 'Phong Thủy',
      nodes: [
        { label: 'Khảo Sát Bản Mệnh', sub: 'Xác định Ngũ hành & cung Điền Trạch trên lá số', badge: 'Bước 1' },
        { label: 'Tối Ưu Dương Trạch', sub: 'Cân bằng hướng cửa, phòng ngủ, bếp & bàn làm việc', badge: 'Bước 2' },
        { label: 'Bổ Khuyết Dụng Thần', sub: 'Tăng cường sinh khí và hóa giải hình sát thực tế', badge: 'Bước 3' },
        { label: 'Chọn Thời Điểm Cát Lợi', sub: 'Trạch nhật động thổ, nhập trạch, khai trương hợp tuổi', badge: 'Bước 4' },
      ],
      caption: `Hình minh họa chuyên đề: ${title} — Tử Vi & Phong Thủy Thầy Tôn`,
    };
  }
  if (groupNum === 1) {
    return {
      theme: 'amber',
      bgImage: '/images/cam-nang-luan-menh.png',
      diagramTitle: title,
      diagramSubtitle: 'Hệ Thống Luận Giải Mệnh Lý & Tham Vấn Thực Chứng Cùng Thầy Tôn',
      centerSymbol: '👑',
      centerLabel: 'Luận Mệnh',
      nodes: [
        { label: 'An Sao Chuẩn Xác', sub: 'Hệ thống 108+ sao trên 12 cung theo Can Chi âm lịch', badge: 'Nền tảng' },
        { label: 'Đọc Theo Tổ Hợp Cách Cục', sub: 'Phối chiếu Tam phương tứ chính, Tứ Hóa & Tuần Triệt', badge: 'Phương pháp' },
        { label: 'Đặt Vào Dòng Thời Gian', sub: 'Đối chiếu Đại vận 10 năm, Tiểu vận và Lưu niên', badge: 'Thời vận' },
        { label: 'Định Hướng Thực Tiễn', sub: 'Rõ ràng cơ sở học thuật, không hù dọa mê tín', badge: 'Giá trị' },
      ],
      caption: `Hình minh họa chuyên đề: ${title} — Tử Vi & Phong Thủy Thầy Tôn`,
    };
  }
  return {
    theme: 'indigo',
    bgImage: '/images/cam-nang-tinh-dau.png',
    diagramTitle: title,
    diagramSubtitle: 'Cẩm Nang Tinh Đẩu, 12 Cung Vị & Vận Hạn Chuẩn Tử Vi Đẩu Số',
    centerSymbol: '⭐',
    centerLabel: 'Tinh Đẩu',
    nodes: [
      { label: 'Chính Tinh & Phụ Tinh', sub: 'Xét trạng thái Miếu, Vượng, Đắc, Bình, Hãm địa', badge: 'Tinh đẩu' },
      { label: 'Tam Phương Tứ Chính', sub: 'Mối liên kết tam hợp và cung xung chiếu trên lá số', badge: 'Cấu trúc' },
      { label: 'Tứ Hóa & Tuần Triệt', sub: 'Động lực kích hoạt cát hung theo từng Thiên Can', badge: 'Biến hóa' },
      { label: 'Ứng Dụng Thực Chiến', sub: 'Đối chiếu trực tiếp lên lá số cá nhân của đương số', badge: 'Thực hành' },
    ],
    caption: `Hình minh họa chuyên đề: ${title} — Tử Vi & Phong Thủy Thầy Tôn`,
  };
}

const THEME_STYLES = {
  amber: {
    border: 'border-amber-500/40',
    glow: 'from-amber-500/20 via-slate-900/90 to-yellow-900/20',
    badgeBg: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
    accentText: 'text-amber-300',
    nodeBorder: 'border-amber-500/30 hover:border-amber-400/60',
    centerRing: 'border-amber-400/60 bg-amber-950/80 text-amber-300 shadow-amber-500/25',
  },
  emerald: {
    border: 'border-emerald-500/40',
    glow: 'from-emerald-500/20 via-slate-900/90 to-teal-900/20',
    badgeBg: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
    accentText: 'text-emerald-300',
    nodeBorder: 'border-emerald-500/30 hover:border-emerald-400/60',
    centerRing: 'border-emerald-400/60 bg-emerald-950/80 text-emerald-300 shadow-emerald-500/25',
  },
  indigo: {
    border: 'border-indigo-500/40',
    glow: 'from-indigo-500/20 via-slate-900/90 to-blue-900/20',
    badgeBg: 'bg-indigo-500/15 border-indigo-400/40 text-indigo-300',
    accentText: 'text-indigo-300',
    nodeBorder: 'border-indigo-500/30 hover:border-indigo-400/60',
    centerRing: 'border-indigo-400/60 bg-indigo-950/80 text-indigo-300 shadow-indigo-500/25',
  },
  purple: {
    border: 'border-purple-500/40',
    glow: 'from-purple-500/20 via-slate-900/90 to-fuchsia-900/20',
    badgeBg: 'bg-purple-500/15 border-purple-400/40 text-purple-300',
    accentText: 'text-purple-300',
    nodeBorder: 'border-purple-500/30 hover:border-purple-400/60',
    centerRing: 'border-purple-400/60 bg-purple-950/80 text-purple-300 shadow-purple-500/25',
  },
  rose: {
    border: 'border-rose-500/40',
    glow: 'from-rose-500/20 via-slate-900/90 to-amber-900/20',
    badgeBg: 'bg-rose-500/15 border-rose-400/40 text-rose-300',
    accentText: 'text-rose-300',
    nodeBorder: 'border-rose-500/30 hover:border-rose-400/60',
    centerRing: 'border-rose-400/60 bg-rose-950/80 text-rose-300 shadow-rose-500/25',
  },
};

/**
 * Ảnh minh họa & Sơ đồ Infographic chuyên đề cho toàn bộ các bài viết Cẩm Nang (/bai-viet & /[slug])
 */
export function ArticleHeroIllustration({
  code,
  title,
  groupNum,
}: {
  code: string;
  title: string;
  groupNum?: number;
}) {
  const spec = getFallbackArticleSpec(code, title, groupNum);
  const style = THEME_STYLES[spec.theme];

  return (
    <figure
      className={`my-7 rounded-3xl overflow-hidden border ${style.border} bg-slate-950 shadow-2xl relative`}
    >
      {/* Khung ảnh nền Nghệ thuật + Sơ đồ Tinh Đẩu trực quan */}
      <div className="relative overflow-hidden p-5 sm:p-7">
        {/* Ảnh nền minh họa chủ đề */}
        <img
          src={spec.bgImage}
          alt={spec.caption}
          className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105 pointer-events-none select-none"
          loading="eager"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${style.glow} backdrop-blur-[2px] pointer-events-none`}
        />

        {/* Họa tiết vòng tròn La Kinh / Thiên Bàn SVG chìm */}
        <svg
          className="absolute right-[-60px] top-[-60px] w-72 h-72 opacity-15 pointer-events-none text-amber-300"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="68" stroke="currentColor" strokeWidth="1" />
          <circle cx="100" cy="100" r="42" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
          <polygon
            points="100,15 173,142 27,142"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
          />
          <polygon
            points="100,185 173,58 27,58"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
          />
        </svg>

        <div className="relative z-10 space-y-5">
          {/* Header của Đồ họa minh họa */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3.5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-950/80 border border-amber-400/40 text-amber-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Sơ Đồ Minh Họa Chuyên Đề • Thầy Tôn</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold font-serif text-white leading-snug">
                {spec.diagramTitle}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">{spec.diagramSubtitle}</p>
            </div>

            {/* Huy hiệu trung tâm */}
            <div
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-2xl border-2 ${style.centerRing} shadow-lg shrink-0`}
            >
              <span className="text-2xl leading-none">{spec.centerSymbol}</span>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-300 font-semibold">
                  Trọng Tâm
                </div>
                <div className="text-xs sm:text-sm font-extrabold">{spec.centerLabel}</div>
              </div>
            </div>
          </div>

          {/* 4 Nút Kiến Thức Minh Họa Trực Quan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {spec.nodes.map((node, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl bg-slate-950/85 border ${style.nodeBorder} backdrop-blur-md transition flex flex-col justify-between gap-2 shadow-md`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {node.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badgeBg}`}
                      >
                        {node.badge}
                      </span>
                    )}
                  </div>
                  <div className={`text-xs sm:text-sm font-bold ${style.accentText} leading-snug`}>
                    {node.label}
                  </div>
                </div>
                <p className="text-[11.5px] text-slate-300 leading-relaxed">{node.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chú thích ảnh chuẩn SEO */}
      <figcaption className="px-4 py-2.5 bg-slate-950/95 border-t border-slate-800/80 text-[11.5px] text-slate-400 flex items-center justify-between gap-2 flex-wrap">
        <span>📌 {spec.caption}</span>
        <span className="text-amber-400/90 font-semibold">tuvithayton.vn</span>
      </figcaption>
    </figure>
  );
}

/**
 * Thumbnail minh họa cho từng thẻ bài viết trên trang thư viện /bai-viet
 */
export function ArticleCardThumbnail({
  code,
  title,
  groupNum,
}: {
  code: string;
  title: string;
  groupNum?: number;
}) {
  const spec = getFallbackArticleSpec(code, title, groupNum);
  const style = THEME_STYLES[spec.theme];

  return (
    <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border border-slate-800/90 bg-slate-950 group-hover:border-amber-500/40 transition">
      <img
        src={spec.bgImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-transparent" />

      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border backdrop-blur-md ${style.badgeBg}`}
        >
          {spec.centerLabel}
        </span>
        <span className="w-7 h-7 rounded-lg bg-slate-950/85 border border-amber-400/40 flex items-center justify-center text-sm shadow">
          {spec.centerSymbol}
        </span>
      </div>

      <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center gap-1.5 overflow-hidden">
        {spec.nodes.slice(0, 2).map((n, idx) => (
          <span
            key={idx}
            className="text-[10px] text-slate-200 bg-slate-900/85 border border-slate-700/80 px-2 py-0.5 rounded-md truncate"
          >
            • {n.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Minh họa nổi bật riêng cho Hero & 4 Học phần của trang Khóa Học (/khoa-hoc)
 */
export function CourseVisualShowcase({
  selectedModule,
  onSelectModule,
}: {
  selectedModule: number;
  onSelectModule: (modId: number) => void;
}) {
  const modules = [
    {
      id: 1,
      badge: 'HỌC PHẦN 1 • 4 BÀI',
      title: 'Nền Tảng Âm Dương, Cục Mệnh & 12 Cung Vị',
      desc: 'Nắm vững quy luật Sinh – Khắc, Tam Hợp Mệnh – Tài – Quan, Thân cư 6 cung và Tuần – Triệt.',
      image: '/images/cam-nang-12-cung.png',
      icon: '🧭',
      accent: 'from-amber-500/25 to-slate-950',
      border: 'border-amber-500/45',
      pill: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    },
    {
      id: 2,
      badge: 'HỌC PHẦN 2 • 14 BÀI',
      title: 'Giải Mã Toàn Bộ 14 Chính Tinh (Bắc & Nam Đẩu)',
      desc: 'Đi sâu từng ngôi sao từ Tử Vi, Thiên Phủ đến Thất Sát, Phá Quân: tâm lý, tài chính, nghề nghiệp.',
      image: '/images/cam-nang-tinh-dau.png',
      icon: '🌟',
      accent: 'from-indigo-500/25 to-slate-950',
      border: 'border-indigo-500/45',
      pill: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    },
    {
      id: 3,
      badge: 'HỌC PHẦN 3 • 3 BÀI',
      title: 'Lục Cát Tinh, Lục Sát Tinh & Bí Pháp Tứ Hóa',
      desc: 'Đọc vị Tả Hữu, Xương Khúc, Khôi Việt; chế hóa Kình Đà Không Kiếp và phi tinh Lộc Quyền Khoa Kỵ.',
      image: '/images/course-hero-podcast.png',
      icon: '⚡',
      accent: 'from-purple-500/25 to-slate-950',
      border: 'border-purple-500/45',
      pill: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    },
    {
      id: 4,
      badge: 'HỌC PHẦN 4 • 3 BÀI',
      title: '4 Đại Cách Cục & Quy Trình 5 Bước Chấm Hạn',
      desc: 'Tổng hợp Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Cự Nhật & thực hành chấm hạn năm.',
      image: '/images/cam-nang-luan-menh.png',
      icon: '👑',
      accent: 'from-emerald-500/25 to-slate-950',
      border: 'border-emerald-500/45',
      pill: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    },
  ];

  return (
    <section aria-label="Bản đồ 4 học phần có minh họa" className="space-y-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-amber-500/15 border border-amber-500/35 text-amber-300">
            <Orbit className="w-4 h-4" />
          </span>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-amber-300 font-serif uppercase tracking-wider">
              Bản Đồ 4 Học Phần Thực Chiến (Nhấn Để Lọc Theo Học Phần)
            </h2>
          </div>
        </div>
        {selectedModule !== 0 && (
          <button
            type="button"
            onClick={() => onSelectModule(0)}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline cursor-pointer"
          >
            Xem lại tất cả 24 bài giảng →
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {modules.map((m) => {
          const isActive = selectedModule === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectModule(isActive ? 0 : m.id)}
              className={`group relative rounded-2xl overflow-hidden text-left border transition-all cursor-pointer flex flex-col justify-between min-h-[176px] p-4 ${
                isActive
                  ? 'border-amber-400 ring-2 ring-amber-400/50 shadow-xl shadow-amber-500/15 scale-[1.01]'
                  : `${m.border} hover:border-amber-400/70 shadow-lg`
              }`}
            >
              {/* Ảnh minh họa nền của từng học phần */}
              <img
                src={m.image}
                alt={m.title}
                className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-105 transition-transform duration-500 pointer-events-none"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/30`}
              />

              <div className="relative z-10 flex items-center justify-between gap-2 w-full">
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md ${m.pill}`}
                >
                  {m.badge}
                </span>
                <span className="w-8 h-8 rounded-xl bg-slate-950/85 border border-white/15 flex items-center justify-center text-base shadow-md">
                  {m.icon}
                </span>
              </div>

              <div className="relative z-10 mt-6 space-y-1">
                <h3 className="text-sm font-bold text-white group-hover:text-amber-200 transition leading-snug">
                  {m.title}
                </h3>
                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                  {m.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Banner minh họa Tinh Đẩu & Sóng Âm Podcast riêng cho từng bài học trong Học Viện (/khoa-hoc)
 */
export function CourseLessonIllustration({
  lessonOrder,
  moduleId,
  moduleTitle,
  title,
  relatedStars,
  durationLabel,
  isPlaying,
}: {
  lessonOrder: number;
  moduleId: number;
  moduleTitle: string;
  title: string;
  relatedStars: string[];
  durationLabel: string;
  isPlaying: boolean;
}) {
  const bgByModule: Record<number, string> = {
    1: '/images/cam-nang-12-cung.png',
    2: '/images/cam-nang-tinh-dau.png',
    3: '/images/course-hero-podcast.png',
    4: '/images/cam-nang-luan-menh.png',
  };
  const bgImage = bgByModule[moduleId] || '/images/course-hero-podcast.png';

  return (
    <div className="relative rounded-2xl overflow-hidden border border-amber-500/35 bg-slate-950 mb-5 shadow-xl">
      <img
        src={bgImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-indigo-950/65" />

      {/* Bản đồ Chòm Sao SVG trang trí bên phải */}
      <svg
        className="absolute right-2 top-1/2 -translate-y-1/2 w-48 h-36 opacity-35 pointer-events-none hidden sm:block"
        viewBox="0 0 220 140"
        fill="none"
      >
        <path
          d="M25 95 L70 45 L125 65 L170 28 L195 80"
          stroke="#fbbf24"
          strokeWidth="1.5"
          strokeDasharray="3 3"
        />
        <circle cx="25" cy="95" r="5" fill="#fbbf24" />
        <circle cx="70" cy="45" r="6" fill="#38bdf8" />
        <circle cx="125" cy="65" r="5" fill="#fbbf24" />
        <circle cx="170" cy="28" r="7" fill="#f59e0b" />
        <circle cx="195" cy="80" r="4.5" fill="#a855f7" />
      </svg>

      <div className="relative z-10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* Biểu tượng Đĩa Tinh Đẩu / Podcast */}
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 border-amber-400/60 bg-slate-900/90 flex flex-col items-center justify-center shrink-0 shadow-lg shadow-amber-500/20 ${
              isPlaying ? 'ring-2 ring-amber-400 animate-pulse' : ''
            }`}
          >
            <span className="text-[10px] font-bold uppercase text-amber-300/90">Bài</span>
            <span className="text-lg sm:text-xl font-black font-serif text-amber-400 leading-none">
              {lessonOrder < 10 ? `0${lessonOrder}` : lessonOrder}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold">
                <Radio className="w-3 h-3 text-amber-400" />
                <span>{moduleTitle}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-300 text-[11px] font-medium">
                <Headphones className="w-3 h-3 text-amber-400" />
                <span>Podcast {durationLabel}</span>
              </span>
            </div>

            <div className="text-xs sm:text-sm font-semibold text-slate-200">
              Chòm sao &amp; Khái niệm trọng tâm trong bài giảng:
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {relatedStars.map((star) => (
                <span
                  key={star}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-indigo-950/90 border border-indigo-400/40 text-indigo-200 text-xs font-bold shadow-sm"
                >
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>{star}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Chân dung Giảng viên Thầy Tôn */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 self-start sm:self-center shrink-0">
          <img
            src="/avatar-thay-ton.jpg"
            alt="Giảng viên Thầy Tôn"
            className="w-9 h-9 rounded-full object-cover border border-amber-400/70"
          />
          <div className="text-xs">
            <div className="font-bold text-amber-300">Giảng viên: Thầy Tôn</div>
            <div className="text-[10.5px] text-slate-400">Podcast &amp; Giáo trình thực chiến</div>
          </div>
        </div>
      </div>
    </div>
  );
}
