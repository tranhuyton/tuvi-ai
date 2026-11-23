export interface CourseModule {
  id: number;
  badge: string;
  title: string;
  description: string;
}

export const COURSE_INFO = {
  title: 'Khóa Học Tử Vi Đẩu Số Thực Chiến Cùng Thầy Tôn',
  subtitle:
    'Làm Chủ 14 Chính Tinh, Phụ Tinh, Cách Cục & Quy Trình Luận Giải Vận Hạn Qua Podcast Và Giáo Trình Tương Tác',
  price: 699000,
  originalPrice: 1490000,
  totalLessons: 24,
  totalHours: '8+ giờ Podcast & 24 Chuyên khảo',
} as const;

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 1,
    badge: 'HỌC PHẦN 1 • NỀN TẢNG & TƯ DUY CỐT LÕI',
    title: 'Nền Tảng Âm Dương, Ngũ Hành, Cục & Tư Duy Đọc Lá Số Chuẩn Logic',
    description:
      'Hiểu đúng bộ khung vận hành của lá số Tử Vi: quy tắc Âm Dương thuận nghịch, tương quan Mệnh - Cục, Tam Hợp - Xung Chiếu và cách phân biệt gốc Tiên Thiên với vận Hậu Thiên.',
  },
  {
    id: 2,
    badge: 'HỌC PHẦN 2 • 14 CHÍNH TINH CHUYÊN SÂU',
    title: 'Giải Mã Chi Tiết 14 Chính Tinh: Tính Chất, Tâm Lý, Hình Tướng & Đắc Hãm',
    description:
      'Đi sâu vào từng ngôi sao trong vòng Tử Vi và vòng Thiên Phủ: bản chất ngũ hành, điểm mạnh - điểm khuyết, dấu hiệu nhận diện ngoài đời và phản ứng khi gặp Cát/Sát tinh.',
  },
  {
    id: 3,
    badge: 'HỌC PHẦN 3 • PHỤ TINH, TỨ HÓA & VÒNG SAO',
    title: 'Hệ Thống Lục Cát, Lục Sát, Tứ Hóa, Thái Tuế, Lộc Tồn & Tuần Triệt',
    description:
      'Nắm vững các bộ sao quyết định thành bại thực tế của lá số: Tứ Hóa kích hoạt biến cố, Lục Sát phát dã như lôi, Lục Cát trợ lực và cơ chế đảo chiều của Tuần - Triệt.',
  },
  {
    id: 4,
    badge: 'HỌC PHẦN 4 • CÁCH CỤC LỚN & LUẬN VẬN HẠN',
    title: '4 Cách Cục Lớn & Quy Trình 5 Bước Chấm Hạn Năm - Tháng Thực Chiến',
    description:
      'Tổng hợp toàn bộ kiến thức vào thực hành: nhận diện 4 thế đứng lớn (Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Cự Nhật) và quy trình đọc Đại vận, Tiểu vận.',
  },
];
