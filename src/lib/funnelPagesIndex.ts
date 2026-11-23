// Lightweight metadata index + homepage entry derived from funnelPages.ts
// Keeps ~450 KB of other pages' bodyHtml out of client bundles.
import type { FunnelPageData } from './funnelPages';

export interface FunnelPageMeta {
  index: number;
  code: string;
  role: string;
  groupNum: number;
  groupTitle: string;
  url: string;
  slug: string;
  h1: string;
  quickSummaryText: string;
}

export const FUNNEL_PAGES_INDEX: FunnelPageMeta[] = [
  {
    "index": 1,
    "code": "H",
    "role": "Trang chủ",
    "groupNum": 1,
    "groupTitle": "Nhóm 1 - Trang chuyển đổi (dịch vụ, sản phẩm, thương hiệu)",
    "url": "/",
    "slug": "",
    "h1": "Lập Lá Số Tử Vi Miễn Phí và Bình Giải Trọn Đời Cùng Thầy Tôn",
    "quickSummaryText": "Tử Vi & Phong Thủy Thầy Tôn là công cụ lập lá số Tử Vi Đẩu Số miễn phí: nhập họ tên, ngày giờ sinh và năm muốn xem, hệ thống an hơn 110 sao trên 12 cung và trả về bài Bình Giải Khởi Nguyên khoảng 1.000 từ về Mệnh cục, Tam hợp Mệnh - Tài - Quan, Đại vận 10 năm và Tiểu vận. Bản chuyên sâu có giá từ 119.000đ; khi nâng cấp lên bản cao hơn, người dùng chỉ trả phần chênh lệch."
  },
  {
    "index": 2,
    "code": "P1",
    "role": "Trang sản phẩm",
    "groupNum": 1,
    "groupTitle": "Nhóm 1 - Trang chuyển đổi (dịch vụ, sản phẩm, thương hiệu)",
    "url": "/luan-giai-tu-vi-chuyen-sau",
    "slug": "luan-giai-tu-vi-chuyen-sau",
    "h1": "Luận Giải Lá Số Tử Vi Chi Tiết - Bản Chuyên Sâu Pro (119.000đ)",
    "quickSummaryText": "Bản Chuyên Sâu Pro là bản luận giải lá số Tử Vi Đẩu Số dài khoảng 2.500 từ của Thầy Tôn, giá 119.000đ, mở khóa ngay trên lá số đã lập. Bài luận đọc kỹ 14 chính tinh, Tứ Hóa, các bộ sao đắc địa, hãm địa và vận hạn theo 4 mùa của năm xem; tặng kèm 2 câu hỏi Chuyên Sâu cho AI Thầy Tôn trị giá 99.000đ. Khi cần lên Bản Chuyên Gia Expert, chỉ trả thêm 150.000đ."
  },
  {
    "index": 3,
    "code": "P2",
    "role": "Trang sản phẩm",
    "groupNum": 1,
    "groupTitle": "Nhóm 1 - Trang chuyển đổi (dịch vụ, sản phẩm, thương hiệu)",
    "url": "/luan-giai-tu-vi-chuyen-gia",
    "slug": "luan-giai-tu-vi-chuyen-gia",
    "h1": "Luận Giải Lá Số Tử Vi 12 Cung và Vận Hạn Từng Tháng - Bản Chuyên Gia Expert (269.000đ)",
    "quickSummaryText": "Bản Chuyên Gia Expert là bản luận giải lá số Tử Vi Đẩu Số đầy đủ nhất của Thầy Tôn, dài khoảng 4.500 - 6.000 từ, giá 269.000đ. Bài luận đọc trọn 12 cung và vận hạn từng tháng, từ tháng 1 tới tháng 12 âm lịch của năm xem; tặng kèm 2 câu hỏi Chuyên Gia cho AI Thầy Tôn trị giá 129.000đ. Người đã mua Bản Chuyên Sâu Pro chỉ trả thêm 150.000đ."
  },
  {
    "index": 4,
    "code": "P3",
    "role": "Trang sản phẩm",
    "groupNum": 1,
    "groupTitle": "Nhóm 1 - Trang chuyển đổi (dịch vụ, sản phẩm, thương hiệu)",
    "url": "/hoi-dap-tu-vi-ai",
    "slug": "hoi-dap-tu-vi-ai",
    "h1": "Hỏi Đáp Tử Vi Online Cùng AI Thầy Tôn",
    "quickSummaryText": "Hỏi đáp AI Thầy Tôn là trợ lý luận giải theo phương pháp Tử Vi Đẩu Số của Thầy Tôn, đọc trực tiếp lá số của người hỏi để trả lời câu hỏi cụ thể về công việc, tiền tài, nhân duyên hay vận hạn. Câu hỏi bán theo gói 2 câu với ba mức: Cơ Bản 49.000đ, Chuyên Sâu 99.000đ và Chuyên Gia 129.000đ. Khi lên gói cao hơn, người dùng chỉ trả phần chênh lệch."
  },
  {
    "index": 5,
    "code": "DV1",
    "role": "Trang dịch vụ",
    "groupNum": 1,
    "groupTitle": "Nhóm 1 - Trang chuyển đổi (dịch vụ, sản phẩm, thương hiệu)",
    "url": "/dat-lich-xem-tu-vi",
    "slug": "dat-lich-xem-tu-vi",
    "h1": "Xem Tử Vi và Phong Thủy Trực Tiếp 1-1 Cùng Thầy Tôn tại Hà Nội",
    "quickSummaryText": "Xem tử vi và phong thủy trực tiếp 1-1 là buổi gặp riêng với Thầy Tôn tại khu vực Khu đô thị Royal City, Thanh Xuân, Hà Nội (theo lịch hẹn trước), hoặc online qua Video Call. Trong buổi xem, Thầy thẩm định lại giờ sinh qua Diện tướng và Chỉ tay, luận lá số theo đúng việc người xem đang cần quyết định và tư vấn phong thủy khi cần. Đặt lịch trước qua Zalo 0935 058 688."
  },
  {
    "index": 6,
    "code": "TR",
    "role": "Trang hồ sơ chuyên gia",
    "groupNum": 1,
    "groupTitle": "Nhóm 1 - Trang chuyển đổi (dịch vụ, sản phẩm, thương hiệu)",
    "url": "/thay-ton",
    "slug": "thay-ton",
    "h1": "Thầy Tôn - Chuyên Gia Tử Vi Đẩu Số và Phong Thủy",
    "quickSummaryText": "Thầy Tôn là chuyên gia Tử Vi Đẩu Số và Phong Thủy với hơn 18 năm nghiên cứu, người sáng lập Tử Vi & Phong Thủy Thầy Tôn. Thầy là cựu học sinh khối Chuyên Toán - Tin, Đại học Tổng hợp Hà Nội; Cử nhân và Thạc sỹ Quản lý Tài chính và Kế toán tại Đại học Lancaster (Vương quốc Anh); có hơn 7 năm học tập, làm việc tại Anh và hơn 15 năm giảng dạy Tiếng Anh luyện thi IELTS, Giao tiếp và các môn Toán, Khoa học, Kinh tế, Kinh doanh, Địa lý chương trình Cambridge IGCSE."
  },
  {
    "index": 7,
    "code": "LH",
    "role": "Trang liên hệ",
    "groupNum": 1,
    "groupTitle": "Nhóm 1 - Trang chuyển đổi (dịch vụ, sản phẩm, thương hiệu)",
    "url": "/lien-he",
    "slug": "lien-he",
    "h1": "Liên Hệ và Đặt Lịch Xem Tử Vi Cùng Thầy Tôn",
    "quickSummaryText": "Tử Vi & Phong Thủy Thầy Tôn nhận liên hệ và đặt lịch qua điện thoại, Zalo 0935 058 688. Buổi gặp trực tiếp tại Hà Nội diễn ra ở khu vực Khu đô thị Royal City, Thanh Xuân (địa chỉ chi tiết gửi riêng qua Zalo khi xác nhận lịch); khách ở tỉnh khác hoặc nước ngoài có thể xem online qua Video Call. Mọi buổi xem cần đặt lịch trước."
  },
  {
    "index": 8,
    "code": "C1",
    "role": "Trang hub phong thủy",
    "groupNum": 2,
    "groupTitle": "Nhóm 2 - Phong thủy (hub C1, trang dịch vụ phong thủy và blog phong thủy)",
    "url": "/phong-thuy",
    "slug": "phong-thuy",
    "h1": "Tư Vấn Phong Thủy Nhà Ở, Văn Phòng và Cải Vận Theo Lá Số",
    "quickSummaryText": "Tư vấn phong thủy của Thầy Tôn gồm bốn nhóm việc: phong thủy nhà ở, chung cư; phong thủy văn phòng, cửa hàng; phong thủy cải vận theo lá số; xem ngày giờ tốt. Điểm khác biệt là mọi tư vấn đều bắt đầu từ lá số Tử Vi Đẩu Số của gia chủ: lá số cho biết hành dụng thần và thời điểm, phong thủy bố trí không gian cho hợp với lá số đó. Tư vấn tại Hà Nội hoặc online qua Video Call."
  },
  {
    "index": 9,
    "code": "S3",
    "role": "Trang dịch vụ",
    "groupNum": 2,
    "groupTitle": "Nhóm 2 - Phong thủy (hub C1, trang dịch vụ phong thủy và blog phong thủy)",
    "url": "/phong-thuy-cai-van",
    "slug": "phong-thuy-cai-van",
    "h1": "Phong Thủy Cải Vận Theo Lá Số Tử Vi: Hướng, Màu Sắc, Bố Trí Hợp Mệnh",
    "quickSummaryText": "Phong thủy cải vận theo lá số là cách chọn hướng, màu sắc, vật dụng và bố trí không gian dựa trên hành dụng thần trong lá số Tử Vi Đẩu Số của từng người, thay vì công thức chung theo năm sinh. Thầy Tôn đọc lá số để biết người xem cần bổ sung hành nào, giai đoạn nào vận yếu, rồi đề xuất điều chỉnh từ đơn giản tới phức tạp: đổi bố trí, đổi màu, sau cùng mới sửa không gian."
  },
  {
    "index": 10,
    "code": "S4",
    "role": "Trang dịch vụ",
    "groupNum": 2,
    "groupTitle": "Nhóm 2 - Phong thủy (hub C1, trang dịch vụ phong thủy và blog phong thủy)",
    "url": "/xem-ngay-tot",
    "slug": "xem-ngay-tot",
    "h1": "Xem Ngày Tốt Động Thổ, Nhập Trạch, Khai Trương, Cưới Hỏi Hợp Tuổi",
    "quickSummaryText": "Xem ngày tốt là chọn ngày, giờ thuận lợi để bắt đầu một việc lớn như động thổ, nhập trạch, khai trương, cưới hỏi. Thầy Tôn chọn ngày theo ba lớp: ngày tốt chung theo lịch (Hoàng đạo, trực, sao tốt), ngày không xung khắc với tuổi người đứng việc, và tháng thuận theo vận hạn trong lá số tử vi. Kết quả là một ngày và một khung giờ cụ thể, kèm phương án dự phòng."
  },
  {
    "index": 11,
    "code": "S1",
    "role": "Trang dịch vụ",
    "groupNum": 2,
    "groupTitle": "Nhóm 2 - Phong thủy (hub C1, trang dịch vụ phong thủy và blog phong thủy)",
    "url": "/phong-thuy-nha-o",
    "slug": "phong-thuy-nha-o",
    "h1": "Phong Thủy Nhà Ở, Chung Cư: Bố Trí Cửa, Bếp, Phòng Ngủ Hợp Mệnh Gia Chủ",
    "quickSummaryText": "Phong thủy nhà ở, chung cư của Thầy Tôn là tư vấn bố trí bốn vị trí quan trọng nhất trong nhà: cửa chính, bếp, phòng ngủ và bàn thờ, theo cung mệnh và hành dụng thần trong lá số của gia chủ. Tư vấn áp dụng cho nhà mua mới, nhà xây, cải tạo hoặc nhà đang ở; ưu tiên đổi cách bố trí, màu sắc trước khi phải sửa kết cấu. Tư vấn tại Hà Nội hoặc online qua Video Call."
  },
  {
    "index": 12,
    "code": "S2",
    "role": "Trang dịch vụ",
    "groupNum": 2,
    "groupTitle": "Nhóm 2 - Phong thủy (hub C1, trang dịch vụ phong thủy và blog phong thủy)",
    "url": "/phong-thuy-van-phong",
    "slug": "phong-thuy-van-phong",
    "h1": "Phong Thủy Văn Phòng, Cửa Hàng: Vị Trí Bàn Làm Việc, Quầy Thu Ngân, Hướng Cửa",
    "quickSummaryText": "Phong thủy văn phòng, cửa hàng của Thầy Tôn là tư vấn bố trí không gian kinh doanh theo lá số của chủ doanh nghiệp: hướng cửa chính, vị trí phòng lãnh đạo, bàn làm việc, quầy thu ngân và ngày khai trương. Tư vấn dựa trên cung mệnh, hành dụng thần cùng các cung Tài Bạch, Quan Lộc trong lá số; ưu tiên điều chỉnh bố trí và màu sắc trước khi sửa mặt bằng."
  },
  {
    "index": 13,
    "code": "B6",
    "role": "Blog",
    "groupNum": 2,
    "groupTitle": "Nhóm 2 - Phong thủy (hub C1, trang dịch vụ phong thủy và blog phong thủy)",
    "url": "/xem-tuoi-lam-nha-2027",
    "slug": "xem-tuoi-lam-nha-2027",
    "h1": "Xem Tuổi Làm Nhà Năm 2027: Tuổi Nào Phạm Kim Lâu, Hoang Ốc, Tam Tai?",
    "quickSummaryText": "Xem tuổi làm nhà năm 2027 Đinh Mùi là kiểm tra ba hạn của gia chủ: Kim Lâu, Hoang Ốc và Tam Tai. Tuổi mụ năm 2027 bằng 2028 trừ năm sinh âm lịch. Tuổi mụ chia 9 dư 1, 3, 6, 8 là phạm Kim Lâu; tuổi rơi vào cung Tam Địa Sát, Ngũ Thọ Tử, Lục Hoang Ốc là phạm Hoang Ốc; ba tuổi Hợi, Mão, Mùi gặp Tam Tai. Gia chủ phạm hạn vẫn làm nhà được bằng cách mượn tuổi."
  },
  {
    "index": 14,
    "code": "B8",
    "role": "Blog",
    "groupNum": 2,
    "groupTitle": "Nhóm 2 - Phong thủy (hub C1, trang dịch vụ phong thủy và blog phong thủy)",
    "url": "/tu-vi-va-phong-thuy",
    "slug": "tu-vi-va-phong-thuy",
    "h1": "Tử Vi và Phong Thủy Khác Nhau Thế Nào, Kết Hợp Ra Sao?",
    "quickSummaryText": "Tử vi và phong thủy là hai môn cổ học khác nhau về đối tượng. Tử Vi Đẩu Số đọc con người qua lá số lập từ giờ, ngày, tháng, năm sinh, cho biết thế mạnh, hành dụng thần và thời điểm thuận lợi. Phong thủy xét không gian sống và làm việc: hướng nhà, bố trí, màu sắc. Kết hợp đúng là dùng lá số để biết người cần gì và khi nào, rồi dùng phong thủy bố trí không gian cho hợp."
  },
  {
    "index": 15,
    "code": "B1",
    "role": "Blog trụ cột",
    "groupNum": 3,
    "groupTitle": "Nhóm 3 - Kiến thức tử vi (hub B1 và blog tử vi)",
    "url": "/cach-xem-la-so-tu-vi",
    "slug": "cach-xem-la-so-tu-vi",
    "h1": "Cách Xem Lá Số Tử Vi Cho Người Mới: 12 Cung, 14 Chính Tinh và Vận Hạn",
    "quickSummaryText": "Lá số Tử Vi Đẩu Số gồm 12 cung an trên địa bàn, mỗi cung chứa chính tinh, phụ tinh và Tứ Hóa, được lập từ giờ, ngày, tháng, năm sinh âm lịch và giới tính. Người mới nên đọc theo 5 bước: cung Mệnh và cung Thân; tam phương tứ chính; 14 chính tinh; Tứ Hóa; rồi vận hạn theo Đại vận 10 năm và Tiểu vận từng năm. Không nên kết luận từ một sao đơn lẻ."
  },
  {
    "index": 16,
    "code": "B2",
    "role": "Blog",
    "groupNum": 3,
    "groupTitle": "Nhóm 3 - Kiến thức tử vi (hub B1 và blog tử vi)",
    "url": "/tu-vi-2027",
    "slug": "tu-vi-2027",
    "h1": "Tử Vi Năm 2027 Đinh Mùi: Tuổi Nào Phạm Thái Tuế, Tam Tai, Kim Lâu?",
    "quickSummaryText": "Năm 2027 là năm Đinh Mùi, nạp âm Thiên Hà Thủy, bắt đầu từ Tết Nguyên đán ngày 6/2/2027 và kết thúc ngày 25/1/2028. Tuổi Mùi trực Thái Tuế, tuổi Sửu xung, tuổi Tuất hình và phá, tuổi Tý hại; ba tuổi Hợi, Mão, Mùi vào năm Tam Tai cuối. Tứ Hóa Can Đinh gồm Thái Âm Hóa Lộc, Thiên Đồng Hóa Quyền, Thiên Cơ Hóa Khoa, Cự Môn Hóa Kỵ."
  },
  {
    "index": 17,
    "code": "B4",
    "role": "Blog",
    "groupNum": 3,
    "groupTitle": "Nhóm 3 - Kiến thức tử vi (hub B1 và blog tử vi)",
    "url": "/tu-hoa-trong-tu-vi",
    "slug": "tu-hoa-trong-tu-vi",
    "h1": "Tứ Hóa Trong Tử Vi: Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ Là Gì?",
    "quickSummaryText": "Tứ Hóa là bốn sao biến hóa trong Tử Vi Đẩu Số: Hóa Lộc, Hóa Quyền, Hóa Khoa và Hóa Kỵ. Tứ Hóa không đứng riêng mà gắn vào bốn chính tinh hoặc phụ tinh tùy theo Thiên Can; mỗi Can trong 10 Can có một bộ Tứ Hóa riêng. Tứ Hóa gốc an theo Can năm sinh, Tứ Hóa lưu niên an theo Can năm xem. Hóa Lộc chỉ nơi có cơ hội, Hóa Kỵ chỉ nơi cần thận trọng."
  },
  {
    "index": 18,
    "code": "B3",
    "role": "Blog",
    "groupNum": 3,
    "groupTitle": "Nhóm 3 - Kiến thức tử vi (hub B1 và blog tử vi)",
    "url": "/14-chinh-tinh-tu-vi",
    "slug": "14-chinh-tinh-tu-vi",
    "h1": "14 Chính Tinh Trong Tử Vi: Ý Nghĩa và Vị Trí Đắc, Hãm",
    "quickSummaryText": "14 chính tinh là bộ sao chủ đạo của lá số Tử Vi Đẩu Số, quyết định \"chất\" của từng cung. Các sao chia thành hai chòm: chòm Tử Vi gồm 6 sao và chòm Thiên Phủ gồm 8 sao. Mỗi chính tinh có ngũ hành và nét nghĩa riêng, nhưng phát huy tốt hay bị hạn chế còn tùy vị trí: ở cung đắc địa sao phát huy mặt tích cực, ở cung hãm địa sao dễ bộc lộ mặt hạn chế."
  },
  {
    "index": 19,
    "code": "B7",
    "role": "Blog",
    "groupNum": 3,
    "groupTitle": "Nhóm 3 - Kiến thức tử vi (hub B1 và blog tử vi)",
    "url": "/khong-nho-gio-sinh",
    "slug": "khong-nho-gio-sinh",
    "h1": "Không Nhớ Giờ Sinh Có Lập Lá Số Tử Vi Được Không?",
    "quickSummaryText": "Không nhớ giờ sinh vẫn lập được lá số tử vi, nhưng kết quả có thể sai từ gốc vì giờ sinh quyết định vị trí cung Mệnh. Lá số Tử Vi Đẩu Số chia một ngày thành 12 canh giờ, mỗi canh dài 2 tiếng; lệch một canh là cung Mệnh dời sang vị trí khác. Cách xử lý là thu hẹp khoảng giờ, lập lá số các canh giờ khả dĩ rồi đối chiếu với tính cách và sự kiện đã qua."
  },
  {
    "index": 20,
    "code": "B5",
    "role": "Blog",
    "groupNum": 3,
    "groupTitle": "Nhóm 3 - Kiến thức tử vi (hub B1 và blog tử vi)",
    "url": "/menh-vo-chinh-dieu",
    "slug": "menh-vo-chinh-dieu",
    "h1": "Mệnh Vô Chính Diệu Là Gì? Tốt Hay Xấu?",
    "quickSummaryText": "Mệnh vô chính diệu là trường hợp cung Mệnh trên lá số Tử Vi Đẩu Số không có sao nào trong 14 chính tinh. Đây không phải lá số tốt hay xấu tuyệt đối. Khi đọc, cách phổ biến là mượn chính tinh ở cung đối diện (cung Thiên Di) để luận, đồng thời xem kỹ phụ tinh, Tứ Hóa, Tuần, Triệt trong cung Mệnh và tam phương tứ chính."
  },
  {
    "index": 21,
    "code": "B9",
    "role": "Chuyên khảo Cung Vị",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/cung-phu-the-trong-tu-vi",
    "slug": "cung-phu-the-trong-tu-vi",
    "h1": "Cung Phu Thê Trong Tử Vi: Cách Xem Tình Duyên, Hôn Nhân và Dấu Hiệu Bạn Đời",
    "quickSummaryText": "Cung Phu Thê trong Tử Vi Đẩu Số cho biết xu hướng tình duyên, thời điểm kết hôn sớm hay muộn, tính cách người bạn đời và cách hai vợ chồng tương tác sau khi lập gia đình. Khi đọc cung Phu Thê, cần xét đồng thời chính tinh trong cung, các sao Đào Hoa, Hồng Loan, Tuần, Triệt và tam phương tứ chính gồm Phúc Đức, Quan Lộc, Thiên Di thay vì chỉ nhìn một sao đơn lẻ."
  },
  {
    "index": 22,
    "code": "B10",
    "role": "Chuyên khảo Cung Vị",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/cung-tai-bach-trong-tu-vi",
    "slug": "cung-tai-bach-trong-tu-vi",
    "h1": "Cung Tài Bạch Trong Tử Vi: Luận Khả Năng Kiếm Tiền, Giữ Tiền và Vận Tài Lộc",
    "quickSummaryText": "Cung Tài Bạch trong Tử Vi Đẩu Số phản ánh cách một người tạo ra thu nhập, thói quen quản lý dòng tiền và mức độ thuận lợi về tài chính qua từng giai đoạn. Cung Tài Bạch luôn nằm trong tam hợp Mệnh - Tài - Quan và đối xung với cung Phúc Đức. Đọc đúng cung Tài Bạch cần kết hợp các tài tinh (Vũ Khúc, Thái Âm, Thiên Phủ, Lộc Tồn, Hóa Lộc) với cung Điền Trạch để biết khả năng tích lũy thực tế."
  },
  {
    "index": 23,
    "code": "B11",
    "role": "Chuyên khảo Cung Vị",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/cung-quan-loc-trong-tu-vi",
    "slug": "cung-quan-loc-trong-tu-vi",
    "h1": "Cung Quan Lộc Trong Tử Vi: Định Hướng Nghề Nghiệp, Làm Chủ Hay Làm Thuê?",
    "quickSummaryText": "Cung Quan Lộc trong Tử Vi Đẩu Số cho biết phong cách làm việc, nhóm ngành nghề phù hợp, khả năng thăng tiến và việc đương số hợp làm chủ độc lập hay phát triển trong tổ chức. Cung Quan Lộc hợp với cung Mệnh và cung Tài Bạch thành tam hợp Mệnh - Tài - Quan. Đọc cung Quan Lộc đúng phương pháp giúp chọn môi trường phát huy đúng sở trường và chọn đúng thời điểm chuyển việc, khởi nghiệp."
  },
  {
    "index": 24,
    "code": "B12",
    "role": "Chuyên khảo Cung Vị",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/cung-dien-trach-trong-tu-vi",
    "slug": "cung-dien-trach-trong-tu-vi",
    "h1": "Cung Điền Trạch Trong Tử Vi: Xem Lộc Đất Đai, Nhà Cửa và Thời Điểm Mua Nhà",
    "quickSummaryText": "Cung Điền Trạch trong Tử Vi Đẩu Số phản ánh khả năng tạo dựng và nắm giữ tài sản cố định như nhà cửa, đất đai, cơ sở kinh doanh, đồng thời cho biết môi trường sinh sống của gia chủ. Cung Điền Trạch được coi là kho chứa tài lộc của cả lá số. Đọc cung Điền Trạch kết hợp với Đại vận và Lưu niên giúp gia chủ biết giai đoạn nào thuận lợi để mua nhà, xây sửa hoặc đầu tư bất động sản."
  },
  {
    "index": 25,
    "code": "B13",
    "role": "Chuyên khảo Cung Vị",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/cung-tu-tuc-va-phuc-duc",
    "slug": "cung-tu-tuc-va-phuc-duc",
    "h1": "Cung Tử Tức và Cung Phúc Đức: Đường Con Cái, Âm Đức Dòng Họ và Cách Bồi Phúc",
    "quickSummaryText": "Trong Tử Vi Đẩu Số, cung Phúc Đức phản ánh nền tảng âm đức dòng họ, đời sống tinh thần và khả năng gặp dữ hóa lành của đương số; còn cung Tử Tức cho biết duyên con cái, hậu duệ và học trò, cộng sự kế cận. Hai cung này gắn kết chặt chẽ: Phúc Đức là gốc rễ từ thế hệ trước truyền xuống, Tử Tức là quả ngọt để lại cho thế hệ sau."
  },
  {
    "index": 26,
    "code": "B14",
    "role": "Chuyên khảo Cung Vị",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/cung-than-va-thien-di",
    "slug": "cung-than-va-thien-di",
    "h1": "Cung Thân và Cung Thiên Di: Ý Nghĩa Thân Cư Mệnh, Tài, Quan, Di, Thê, Phúc",
    "quickSummaryText": "Trong Tử Vi Đẩu Số, cung Mệnh cho biết tính cách và xuất phát điểm tiền vận, còn cung Thân cho biết trọng tâm cuộc sống và kết quả hậu vận từ khoảng sau 30 tuổi. Cung Thân không đứng ở ô riêng mà luôn gửi (cư) vào một trong 6 cung: Mệnh, Phu Thê, Tài Bạch, Thiên Di, Quan Lộc hoặc Phúc Đức. Riêng cung Thiên Di phản ánh môi trường bên ngoài, quý nhân và cơ hội đi xa, xuất ngoại."
  },
  {
    "index": 27,
    "code": "B15",
    "role": "Chuyên khảo Tinh Đẩu",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/tuan-triet-trong-tu-vi",
    "slug": "tuan-triet-trong-tu-vi",
    "h1": "Tuần, Triệt Trong Tử Vi Là Gì? Đóng Ở Mệnh, Tài, Quan, Phu Thê Tốt Hay Xấu?",
    "quickSummaryText": "Tuần (Tuần Trung Không Vong) và Triệt (Triệt Lộ Không Vong) không phải là hai ngôi sao mà là hai vùng khí án ngữ giữa hai cung liền kề trên lá số Tử Vi Đẩu Số. Triệt tác động mạnh ở tiền vận (trước khoảng 30 tuổi) theo hướng cản trở, cắt đứt rồi tháo gỡ dần; Tuần tác động nhẹ hơn nhưng kéo dài sang trung và hậu vận. Tuần, Triệt không xấu tuyệt đối: gặp sao tốt thì làm chậm lại, nhưng gặp sao hãm địa hoặc sát tinh lại giúp kìm hãm cái xấu."
  },
  {
    "index": 28,
    "code": "B20",
    "role": "Chuyên khảo Vận Hạn",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/cach-xem-dai-van-tieu-van",
    "slug": "cach-xem-dai-van-tieu-van",
    "h1": "Cách Xem Đại Vận 10 Năm, Tiểu Vận Lưu Niên và Lưu Nguyệt 12 Tháng Trong Tử Vi",
    "quickSummaryText": "Trong Tử Vi Đẩu Số, lá số gốc cho biết tiềm năng bẩm sinh, còn vận hạn cho biết tiềm năng đó phát huy vào giai đoạn nào. Hệ thống thời gian trên lá số gồm ba tầng lồng vào nhau: Đại vận kéo dài 10 năm, Tiểu vận và Lưu niên kéo dài 1 năm âm lịch, và Lưu nguyệt chia nhỏ tới từng tháng từ tháng 1 đến tháng 12. Một năm chỉ thật sự thuận lợi khi được cả Đại vận 10 năm nâng đỡ."
  },
  {
    "index": 29,
    "code": "B16",
    "role": "Chuyên khảo Tinh Đẩu",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/luc-sat-tinh-trong-tu-vi",
    "slug": "luc-sat-tinh-trong-tu-vi",
    "h1": "Lục Sát Tinh (Kình Đà, Không Kiếp, Hỏa Linh): Khi Nào Phát Lớn, Khi Nào Cần Thận Trọng?",
    "quickSummaryText": "Lục sát tinh trong Tử Vi Đẩu Số gồm 6 ngôi sao mang tính chất quyết liệt, đột biến: Kình Dương, Đà La, Địa Không, Địa Kiếp, Hỏa Tinh và Linh Tinh. Lục sát tinh không xấu tuyệt đối: khi đóng ở vị trí đắc địa và đi cùng chính tinh vững vàng (như Thất Sát, Phá Quân, Tham Lang, Vũ Khúc), sát tinh tạo ra sức bật mạnh mẽ, dám nghĩ dám làm; khi ở vị trí hãm địa, đương số cần quản trị rủi ro và tránh nóng vội."
  },
  {
    "index": 30,
    "code": "B17",
    "role": "Chuyên khảo Tinh Đẩu",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/dao-hoa-hong-loan-luc-cat-tinh",
    "slug": "dao-hoa-hong-loan-luc-cat-tinh",
    "h1": "Đào Hoa, Hồng Loan, Thiên Hỷ và Lục Cát Tinh Trong Tử Vi: Duyên Tình Cảm & Quý Nhân",
    "quickSummaryText": "Trong Tử Vi Đẩu Số, Lục cát tinh (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Thiên Khôi, Thiên Việt) là 6 sao trợ lực về học vấn, cộng sự và quý nhân nâng đỡ; còn bộ Tam Minh (Đào Hoa, Hồng Loan, Thiên Hỷ) chủ về nhân duyên, thiện cảm xã hội và tín hiệu hỷ sự. Khi hai nhóm sao này hội họp tại Mệnh, Tài, Quan hoặc Phu Thê, đương số dễ thành công nhờ uy tín, ngoại giao và sự ủng hộ của tập thể."
  },
  {
    "index": 31,
    "code": "B18",
    "role": "Chuyên khảo Cách Cục",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/cac-cach-cuc-trong-tu-vi",
    "slug": "cac-cach-cuc-trong-tu-vi",
    "h1": "4 Cách Cục Lớn Trong Tử Vi: Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Cự Nhật",
    "quickSummaryText": "Trong Tử Vi Đẩu Số, khi an 14 chính tinh vào 12 cung, tam hợp Mệnh - Tài - Quan luôn rơi vào một trong 4 tổ hợp (cách cục) chính tinh: Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương hoặc Cự Nhật. Bốn cách cục này đại diện cho bốn mẫu năng lực cốt lõi: nhà quản trị tổ chức, người tiên phong mở đường, nhà hoạch định chuyên môn và người truyền thông - đối ngoại."
  },
  {
    "index": 32,
    "code": "B19",
    "role": "Chuyên khảo Tinh Đẩu",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/vong-thai-tue-loc-ton",
    "slug": "vong-thai-tue-loc-ton",
    "h1": "Vòng Thái Tuế và Vòng Lộc Tồn Trong Tử Vi: Cách Đọc Tâm Tính và Thế Đứng Cuộc Đời",
    "quickSummaryText": "Trong Tử Vi Đẩu Số, Vòng Thái Tuế (12 sao an theo Địa Chi năm sinh) và Vòng Lộc Tồn (an theo Thiên Can năm sinh) là hai vòng sao nền tảng phản ánh thái độ sống, nguyên tắc đạo đức và thế đứng của đương số trong xã hội. Vòng Thái Tuế chia 12 cung thành 4 nhóm tam hợp: Thái Tuế - Quan Phù - Bạch Hổ, Tang Môn - Tuế Phá - Điếu Khách, Thiếu Dương - Phúc Đức - Thiên Không và Thiếu Âm - Long Đức - Trực Phù."
  },
  {
    "index": 33,
    "code": "B21",
    "role": "Chuyên khảo Vận Hạn",
    "groupNum": 3,
    "groupTitle": "Tinh Đẩu & Vận Hạn • Huyền Cơ Đẩu Số",
    "url": "/xem-han-ket-hon-sinh-con",
    "slug": "xem-han-ket-hon-sinh-con",
    "h1": "Cách Xem Hạn Kết Hôn và Hạn Sinh Con Trên Lá Số Tử Vi Chính Xác",
    "quickSummaryText": "Xem hạn kết hôn và hạn sinh con trong Tử Vi Đẩu Số là tìm những năm âm lịch mà Đại vận, Lưu niên và Tiểu vận kích hoạt các cung Phu Thê, Phúc Đức, Tử Tức cùng hệ thống sao hỷ sự (Đào Hoa, Hồng Loan, Thiên Hỷ, Hỷ Thần, Thanh Long, Hóa Lộc, Hóa Khoa). Xác định đúng năm có tín hiệu hỷ tín giúp người xem chủ động chuẩn bị tài chính, sức khỏe và chọn thời điểm thuận hòa cho gia đình."
  },
  {
    "index": 34,
    "code": "DV2",
    "role": "Trang dịch vụ",
    "groupNum": 1,
    "groupTitle": "Luận Mệnh & Tham Vấn • Ấn Phẩm Chuyên Sâu",
    "url": "/dinh-huong-hoc-tap-nghe-nghiep-cho-con",
    "slug": "dinh-huong-hoc-tap-nghe-nghiep-cho-con",
    "h1": "Xem Lá Số Tử Vi Định Hướng Học Tập, Chọn Ngành Nghề Cho Con Cùng Thầy Tôn",
    "quickSummaryText": "Xem lá số tử vi định hướng cho con là phương pháp đọc cấu trúc cung Mệnh, Quan Lộc, Tài Bạch, Thiên Di và Phúc Đức của trẻ để nhận diện sớm tư chất bẩm sinh, nhóm môn học thế mạnh và phương pháp giáo dục phù hợp. Điểm khác biệt tại Tử Vi & Phong Thủy Thầy Tôn là sự kết hợp giữa hơn 18 năm nghiên cứu Tử Vi Đẩu Số và hơn 15 năm trực tiếp giảng dạy IELTS cùng các môn Toán, Khoa học, Kinh tế, Kinh doanh chương trình Cambridge IGCSE."
  },
  {
    "index": 35,
    "code": "B22",
    "role": "Chuyên khảo Ứng Dụng",
    "groupNum": 1,
    "groupTitle": "Luận Mệnh & Tham Vấn • Ấn Phẩm Chuyên Sâu",
    "url": "/xem-tuoi-hop-vo-chong-lam-an",
    "slug": "xem-tuoi-hop-vo-chong-lam-an",
    "h1": "Xem Tuổi Vợ Chồng và Tuổi Hợp Làm Ăn Theo Lá Số Tử Vi (Không Chỉ Nhìn Con Giáp)",
    "quickSummaryText": "Xem tuổi vợ chồng hoặc tuổi hợp làm ăn theo phương pháp của Thầy Tôn không dừng ở việc so năm sinh (Tam hợp, Tứ hành xung hay mệnh Nạp âm), mà đối chiếu cấu trúc hai lá số Tử Vi Đẩu Số và hành dụng thần của hai người. Hai người có năm sinh xung khắc trên lý thuyết nhưng nếu cách cục chính tinh và hành dụng thần bù trừ cho nhau, vẫn có thể chung sống hạnh phúc hoặc hợp tác kinh doanh bền vững."
  },
  {
    "index": 36,
    "code": "B23",
    "role": "Phương pháp Thực Chứng",
    "groupNum": 1,
    "groupTitle": "Luận Mệnh & Tham Vấn • Ấn Phẩm Chuyên Sâu",
    "url": "/dien-tuong-chi-tay-tu-vi",
    "slug": "dien-tuong-chi-tay-tu-vi",
    "h1": "Kết Hợp Lá Số Tử Vi Với Diện Tướng và Chỉ Tay: Cách Thẩm Định Giờ Sinh & Vận Hạn",
    "quickSummaryText": "Kết hợp Lá số Tử Vi Đẩu Số với Diện tướng (tướng khuôn mặt) và Thủ tướng (đường chỉ tay) là phương pháp đối chiếu chéo ba nguồn dữ liệu trên cùng một đương số. Lá số tử vi phản ánh cấu trúc mệnh lý theo giờ sinh; Diện tướng và Chỉ tay phản ánh khí sắc, tâm tính và dấu ấn vận hạn hiện hữu trên cơ thể. Đối chiếu ba nguồn giúp thẩm định lại giờ sinh và tăng độ chính xác khi luận giải."
  },
  {
    "index": 37,
    "code": "B24",
    "role": "Chuyên khảo Phong Thủy",
    "groupNum": 2,
    "groupTitle": "Phong Thủy & Trạch Nhật • Địa Lợi Cải Vận",
    "url": "/hanh-dung-than-ngu-hanh",
    "slug": "hanh-dung-than-ngu-hanh",
    "h1": "Hành Dụng Thần Trong Tử Vi & Phong Thủy: Cách Xác Định Ngũ Hành Cần Bổ Khuyết",
    "quickSummaryText": "Hành dụng thần là hành trong Ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ) đóng vai trò điều hòa và cân bằng cho toàn bộ cấu trúc mệnh lý của một người. Khác với mệnh Nạp âm chỉ tính theo năm sinh, hành dụng thần xét đồng thời mùa sinh (tháng sinh âm lịch), ngũ hành của Cục, Bản mệnh và chính tinh thủ Mệnh. Xác định đúng hành dụng thần là gốc để chọn màu sắc, hướng làm việc và bố trí phong thủy cải vận."
  },
  {
    "index": 38,
    "code": "B25",
    "role": "Chuyên khảo Trạch Nhật",
    "groupNum": 2,
    "groupTitle": "Phong Thủy & Trạch Nhật • Địa Lợi Cải Vận",
    "url": "/xem-tuoi-khai-truong-2027",
    "slug": "xem-tuoi-khai-truong-2027",
    "h1": "Xem Tuổi Mở Hàng, Khai Trương và Hướng Xuất Hành Đầu Năm 2027 Đinh Mùi",
    "quickSummaryText": "Xem tuổi mở hàng, khai trương đầu năm 2027 Đinh Mùi (bắt đầu từ Tết Nguyên đán ngày 6/2/2027 dương lịch) là chọn người giao dịch đầu tiên và ngày giờ Hoàng đạo có Thiên Can, Địa Chi, Ngũ hành tương sinh với cả năm Đinh Mùi lẫn tuổi của chủ cơ sở kinh doanh. Các tuổi thuộc tam hợp Hợi - Mão - Mùi hoặc lục hợp Ngọ - Mùi, không xung khắc với tuổi gia chủ, là nhóm tuổi ưu tiên chọn mở hàng năm 2027."
  }
];

export const HOME_FUNNEL_PAGE: FunnelPageData = {
  "index": 1,
  "code": "H",
  "role": "Trang chủ",
  "groupNum": 1,
  "groupTitle": "Nhóm 1 - Trang chuyển đổi (dịch vụ, sản phẩm, thương hiệu)",
  "url": "/",
  "slug": "",
  "metaTitle": "Lập Lá Số Tử Vi Miễn Phí - Bình Giải Trọn Đời | Thầy Tôn",
  "metaDescription": "Lập lá số tử vi miễn phí, nhận bình giải ~1.000 từ về Mệnh, Tài, Quan, Đại vận. Nâng cấp bản chuyên sâu chỉ trả phần chênh lệch, từ 119.000đ.",
  "h1": "Lập Lá Số Tử Vi Miễn Phí và Bình Giải Trọn Đời Cùng Thầy Tôn",
  "authorLine": "Biên soạn và thẩm định chuyên môn: Thầy Tôn - Chuyên gia Tử Vi Đẩu Số và Phong Thủy | Cập nhật: 24/10/2026",
  "quickSummaryHtml": "Tử Vi &amp; Phong Thủy Thầy Tôn là công cụ lập lá số Tử Vi Đẩu Số miễn phí: nhập họ tên, ngày giờ sinh và năm muốn xem, hệ thống an hơn 110 sao trên 12 cung và trả về bài Bình Giải Khởi Nguyên khoảng 1.000 từ về Mệnh cục, Tam hợp Mệnh - Tài - Quan, Đại vận 10 năm và Tiểu vận. Bản chuyên sâu có giá từ 119.000đ; khi nâng cấp lên bản cao hơn, người dùng chỉ trả phần chênh lệch.",
  "quickSummaryText": "Tử Vi & Phong Thủy Thầy Tôn là công cụ lập lá số Tử Vi Đẩu Số miễn phí: nhập họ tên, ngày giờ sinh và năm muốn xem, hệ thống an hơn 110 sao trên 12 cung và trả về bài Bình Giải Khởi Nguyên khoảng 1.000 từ về Mệnh cục, Tam hợp Mệnh - Tài - Quan, Đại vận 10 năm và Tiểu vận. Bản chuyên sâu có giá từ 119.000đ; khi nâng cấp lên bản cao hơn, người dùng chỉ trả phần chênh lệch.",
  "introHtml": "Lá số Tử Vi là tấm bản đồ 12 cung được dựng từ giờ, ngày, tháng, năm sinh âm lịch, cho thấy thế mạnh bẩm sinh và nhịp thăng trầm theo từng giai đoạn. Một lá số chỉ có giá trị khi được an sao đúng và đọc theo cả tổ hợp sao, không đọc rời từng sao. Người mới có thể bắt đầu từ hướng dẫn <a href=\"/cach-xem-la-so-tu-vi\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">cách xem lá số tử vi</a>.",
  "bodyHtml": "<h2 class=\"text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800\">Lập lá số tử vi tại Thầy Tôn gồm những bước nào?</h2>\n<p class=\"text-slate-300 leading-relaxed my-4\">Lập lá số tử vi tại Tử Vi &amp; Phong Thủy Thầy Tôn gồm bốn bước và mất chưa tới một phút. Hệ thống quy đổi ngày giờ sinh sang Can Chi âm lịch, xác định Âm Dương, Bản Mệnh, Cục, rồi an hơn 110 sao vào 12 cung theo phép Tử Vi Đẩu Số. Bốn bước cụ thể:</p>\n<ol class=\"list-decimal pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed\">\n<li class=\"pl-1\"><strong class=\"text-slate-100 font-semibold\">Nhập thông tin sinh:</strong> họ tên, giới tính, ngày sinh (Dương lịch hoặc Âm lịch), giờ sinh và năm muốn xem hạn.</li>\n<li class=\"pl-1\"><strong class=\"text-slate-100 font-semibold\">Hệ thống an sao:</strong> quy đổi lịch, xác định Cục và Bản Mệnh, an 14 chính tinh cùng hơn 100 phụ tinh vào 12 cung.</li>\n<li class=\"pl-1\"><strong class=\"text-slate-100 font-semibold\">Nhận lá số và Bình Giải Khởi Nguyên:</strong> khoảng 1.000 từ về Mệnh cục, Tam hợp Mệnh - Tài - Quan, Đại vận 10 năm và Tiểu vận năm xem; lưu vào Sổ tay cá nhân hoặc tải ảnh, PDF.</li>\n<li class=\"pl-1\"><strong class=\"text-slate-100 font-semibold\">Đọc sâu hơn khi cần:</strong> nâng cấp lên Bản Chuyên Sâu Pro hoặc Bản Chuyên Gia Expert, mua câu hỏi cho AI Thầy Tôn, hoặc đặt lịch xem trực tiếp 1-1.</li>\n</ol>\n<p class=\"text-slate-300 leading-relaxed my-4\">Độ chính xác của lá số phụ thuộc trước hết vào giờ sinh: hai người sinh cùng ngày nhưng lệch một canh giờ (2 tiếng) sẽ có cung Mệnh ở vị trí khác nhau. Khi không chắc giờ sinh, nên lập thử hai lá số ở hai canh giờ liền kề và đối chiếu với các sự kiện lớn đã qua, hoặc nhờ thẩm định giờ sinh trong buổi <a href=\"/dat-lich-xem-tu-vi\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">xem tử vi trực tiếp cùng Thầy Tôn</a>.</p>\n<h2 class=\"text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800\">Bản Khởi Nguyên, Bản Chuyên Sâu Pro và Bản Chuyên Gia Expert khác nhau thế nào?</h2>\n<p class=\"text-slate-300 leading-relaxed my-4\">Ba bản luận giải của Thầy Tôn khác nhau ở độ sâu và phạm vi thời gian. Bản Khởi Nguyên (miễn phí, ~1.000 từ) cho bức tranh tổng quan; Bản Chuyên Sâu Pro (119.000đ, ~2.500 từ) đọc kỹ 14 chính tinh, Tứ Hóa và vận hạn theo 4 mùa; Bản Chuyên Gia Expert (269.000đ, ~4.500 - 6.000 từ) luận đủ 12 cung và từng tháng trong năm xem. Bảng so sánh theo năm tiêu chí:</p>\n<div class=\"my-6 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-lg\"><table class=\"w-full text-left border-collapse text-sm\"><thead><tr class=\"bg-slate-800/90 border-b border-slate-700 text-amber-300\"><th class=\"py-3.5 px-4 font-bold\">Tiêu chí</th><th class=\"py-3.5 px-4 font-bold\">Bản Khởi Nguyên</th><th class=\"py-3.5 px-4 font-bold\">Bản Chuyên Sâu Pro</th><th class=\"py-3.5 px-4 font-bold\">Bản Chuyên Gia Expert</th></tr></thead><tbody class=\"divide-y divide-slate-800/80\"><tr class=\"bg-slate-900/40 hover:bg-slate-800/50 transition-colors\"><td class=\"py-3 px-4 text-slate-200 font-medium\">Giá</td><td class=\"py-3 px-4 text-slate-300\">Miễn phí (0đ)</td><td class=\"py-3 px-4 text-slate-300\">119.000đ</td><td class=\"py-3 px-4 text-slate-300\">269.000đ</td></tr><tr class=\"bg-slate-900/80 hover:bg-slate-800/50 transition-colors\"><td class=\"py-3 px-4 text-slate-200 font-medium\">Độ dài bài luận</td><td class=\"py-3 px-4 text-slate-300\">~1.000 từ</td><td class=\"py-3 px-4 text-slate-300\">~2.500 từ</td><td class=\"py-3 px-4 text-slate-300\">~4.500 - 6.000 từ</td></tr><tr class=\"bg-slate-900/40 hover:bg-slate-800/50 transition-colors\"><td class=\"py-3 px-4 text-slate-200 font-medium\">Phạm vi luận giải</td><td class=\"py-3 px-4 text-slate-300\">Bản Mệnh, Cục, Tam hợp Mệnh - Tài - Quan, cung Thân</td><td class=\"py-3 px-4 text-slate-300\">14 chính tinh, Tứ Hóa, bộ sao đắc/hãm địa</td><td class=\"py-3 px-4 text-slate-300\">Toàn bộ 12 cung</td></tr><tr class=\"bg-slate-900/80 hover:bg-slate-800/50 transition-colors\"><td class=\"py-3 px-4 text-slate-200 font-medium\">Vận hạn</td><td class=\"py-3 px-4 text-slate-300\">Đại vận 10 năm, Tiểu vận năm xem</td><td class=\"py-3 px-4 text-slate-300\">Theo 4 mùa Xuân - Hạ - Thu - Đông</td><td class=\"py-3 px-4 text-slate-300\">Từng tháng, tháng 1 - 12 âm lịch</td></tr><tr class=\"bg-slate-900/40 hover:bg-slate-800/50 transition-colors\"><td class=\"py-3 px-4 text-slate-200 font-medium\">Tặng kèm</td><td class=\"py-3 px-4 text-slate-300\">Lưu Sổ tay, tải ảnh/PDF</td><td class=\"py-3 px-4 text-slate-300\">2 câu hỏi Chuyên Sâu (trị giá 99.000đ)</td><td class=\"py-3 px-4 text-slate-300\">2 câu hỏi Chuyên Gia (trị giá 129.000đ)</td></tr></tbody></table></div>\n<p class=\"text-slate-300 leading-relaxed my-4\">Không phải ai cũng cần bản trả phí. Nếu chỉ muốn biết tính cách, thế mạnh và xu hướng chung của mười năm tới, Bản Khởi Nguyên là đủ. Nên nâng cấp khi đang đứng trước một quyết định có thời hạn cụ thể; với nhu cầu đó, lựa chọn cân đối giữa chi phí và độ sâu là <a href=\"/luan-giai-tu-vi-chuyen-sau\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">Bản Chuyên Sâu Pro luận giải lá số tử vi chi tiết</a>.</p>\n<h2 class=\"text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800\">Nâng cấp lên bản luận giải cao hơn phải trả bao nhiêu?</h2>\n<p class=\"text-slate-300 leading-relaxed my-4\">Nâng cấp bản luận giải tại Tử Vi &amp; Phong Thủy Thầy Tôn chỉ tính phần chênh lệch giữa hai bản, không phải trả lại toàn bộ giá bản mới. Người đã mở khóa Bản Chuyên Sâu Pro (119.000đ) muốn lên Bản Chuyên Gia Expert (269.000đ) chỉ trả thêm 150.000đ cho cùng lá số đó. Bảng dưới đây liệt kê ba cách nâng cấp, sắp theo số tiền cần trả từ thấp tới cao:</p>\n<div class=\"my-6 overflow-x-auto rounded-2xl border border-slate-700/80 bg-slate-900/70 shadow-lg\"><table class=\"w-full text-left border-collapse text-sm\"><thead><tr class=\"bg-slate-800/90 border-b border-slate-700 text-amber-300\"><th class=\"py-3.5 px-4 font-bold\">Đang dùng</th><th class=\"py-3.5 px-4 font-bold\">Nâng cấp lên</th><th class=\"py-3.5 px-4 font-bold\">Cách tính</th><th class=\"py-3.5 px-4 font-bold\">Số tiền cần trả</th></tr></thead><tbody class=\"divide-y divide-slate-800/80\"><tr class=\"bg-slate-900/40 hover:bg-slate-800/50 transition-colors\"><td class=\"py-3 px-4 text-slate-200 font-medium\">Bản Khởi Nguyên (0đ)</td><td class=\"py-3 px-4 text-slate-300\">Bản Chuyên Sâu Pro</td><td class=\"py-3 px-4 text-slate-300\">119.000đ - 0đ</td><td class=\"py-3 px-4 text-slate-300\">119.000đ</td></tr><tr class=\"bg-slate-900/80 hover:bg-slate-800/50 transition-colors\"><td class=\"py-3 px-4 text-slate-200 font-medium\">Bản Chuyên Sâu Pro (119.000đ)</td><td class=\"py-3 px-4 text-slate-300\">Bản Chuyên Gia Expert</td><td class=\"py-3 px-4 text-slate-300\">269.000đ - 119.000đ</td><td class=\"py-3 px-4 text-slate-300\">150.000đ</td></tr><tr class=\"bg-slate-900/40 hover:bg-slate-800/50 transition-colors\"><td class=\"py-3 px-4 text-slate-200 font-medium\">Bản Khởi Nguyên (0đ)</td><td class=\"py-3 px-4 text-slate-300\">Bản Chuyên Gia Expert</td><td class=\"py-3 px-4 text-slate-300\">269.000đ - 0đ</td><td class=\"py-3 px-4 text-slate-300\">269.000đ</td></tr></tbody></table></div>\n<p class=\"text-slate-300 leading-relaxed my-4\">Vì chỉ trả phần chênh lệch, người phân vân có thể bắt đầu với Bản Chuyên Sâu Pro rồi nâng cấp sau mà không mất thêm chi phí so với mua thẳng bản cao nhất. Tổng chi phí của hai lần mua (119.000đ + 150.000đ) đúng bằng giá Bản Chuyên Gia Expert. Người cần kế hoạch hành động theo từng tháng âm lịch có thể xem trước nội dung của <a href=\"/luan-giai-tu-vi-chuyen-gia\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">luận giải lá số tử vi 12 cung và vận hạn từng tháng</a>.</p>\n<h2 class=\"text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800\">Hỏi đáp AI Thầy Tôn giải đáp được gì và giá bao nhiêu?</h2>\n<p class=\"text-slate-300 leading-relaxed my-4\">Hỏi đáp AI Thầy Tôn là trợ lý luận giải theo phương pháp Tử Vi Đẩu Số của Thầy Tôn, đọc trực tiếp lá số vừa lập để trả lời câu hỏi cụ thể về công việc, tiền tài, nhân duyên hay vận hạn. Câu hỏi bán theo gói 2 câu với ba mức: Cơ Bản 49.000đ cho câu hỏi về một cung hoặc xu hướng chung; Chuyên Sâu 99.000đ cho câu hỏi gắn với một quyết định và mốc thời gian; Chuyên Gia 129.000đ cho câu hỏi cần soi nhiều cung và vận hạn theo tháng.</p>\n<p class=\"text-slate-300 leading-relaxed my-4\">Người định mua từ 2 câu Chuyên Sâu trở lên nên cân nhắc mở khóa trọn bản luận giải, vì Bản Chuyên Sâu Pro (119.000đ) đã tặng kèm 2 câu hỏi Chuyên Sâu trị giá 99.000đ. Hướng dẫn đặt câu hỏi hiệu quả và ví dụ trả lời mẫu có tại trang <a href=\"/hoi-dap-tu-vi-ai\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">hỏi đáp tử vi cùng AI Thầy Tôn</a>.</p>\n<h2 class=\"text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800\">Thầy Tôn là ai?</h2>\n<p class=\"text-slate-300 leading-relaxed my-4\">Thầy Tôn là chuyên gia Tử Vi Đẩu Số và Phong Thủy với hơn 18 năm nghiên cứu, người sáng lập Tử Vi &amp; Phong Thủy Thầy Tôn. Thầy là cựu học sinh khối Chuyên Toán - Tin, Đại học Tổng hợp Hà Nội; tốt nghiệp Cử nhân và Thạc sỹ Quản lý Tài chính và Kế toán tại Đại học Lancaster (Vương quốc Anh), có hơn 7 năm học tập, làm việc tại Anh và hơn 15 năm giảng dạy Tiếng Anh luyện thi IELTS, Giao tiếp và các môn Toán, Khoa học, Kinh tế, Kinh doanh, Địa lý chương trình Cambridge IGCSE.</p>\n<p class=\"text-slate-300 leading-relaxed my-4\">Nền tảng Toán học và Tài chính quyết định cách Thầy Tôn đọc lá số: mỗi nhận định đều nêu rõ dựa trên cung nào, sao nào, vận nào, để người xem tự kiểm tra lại được. Thầy nhận xem trực tiếp tại khu vực Khu đô thị Royal City, Thanh Xuân, Hà Nội (theo lịch hẹn trước), hoặc online qua Video Call. Quá trình học tập và làm việc của Thầy có tại <a href=\"/thay-ton\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">hồ sơ chuyên gia tử vi Thầy Tôn</a>.</p>\n<h2 class=\"text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800\">Phương pháp luận giải của Thầy Tôn khác gì cách xem tử vi thông thường?</h2>\n<p class=\"text-slate-300 leading-relaxed my-4\">Phương pháp luận giải của Thầy Tôn đọc lá số theo tổ hợp sao và theo thời vận, không phán đoán từ một sao đơn lẻ, và không dùng lời hù dọa để bán lễ cúng hay vật phẩm. Bốn nguyên tắc áp dụng cho mọi bản luận giải:</p>\n<ol class=\"list-decimal pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed\">\n<li class=\"pl-1\"><strong class=\"text-slate-100 font-semibold\">Đọc theo cách cục, không đọc rời sao:</strong> xét chính tinh, phụ tinh, Tứ Hóa và Tuần, Triệt trong cùng cung và tam phương tứ chính.</li>\n<li class=\"pl-1\"><strong class=\"text-slate-100 font-semibold\">Đặt lá số vào dòng thời gian:</strong> đối chiếu Đại vận 10 năm, Tiểu vận và Lưu niên trước khi nhận định một năm tốt hay xấu.</li>\n<li class=\"pl-1\"><strong class=\"text-slate-100 font-semibold\">Đối chiếu nhiều nguồn:</strong> bản Pro và Expert kiểm tra thêm bằng Diện tướng, Chỉ tay và Bát Bộ Thần Sát, giảm sai lệch khi giờ sinh chưa chắc chắn.</li>\n<li class=\"pl-1\"><strong class=\"text-slate-100 font-semibold\">Nói rõ giới hạn:</strong> lá số cho biết xu hướng và thời điểm, không thay thế quyết định của người xem hay ý kiến của bác sĩ, luật sư, chuyên gia tài chính.</li>\n</ol>\n<h2 class=\"text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800\">Khi nào nên kết hợp lá số tử vi với tư vấn phong thủy?</h2>\n<p class=\"text-slate-300 leading-relaxed my-4\">Nên kết hợp lá số tử vi với tư vấn phong thủy khi chuẩn bị một việc lớn gắn với nhà cửa hoặc nơi làm việc: mua đất, xây sửa nhà, nhập trạch, mở văn phòng, khai trương cửa hàng. Lá số cho biết thời điểm (Thiên thời) và hành dụng thần của gia chủ; phong thủy bố trí không gian (Địa lợi) cho hợp với lá số đó. Thầy Tôn tư vấn bốn nhóm việc: phong thủy nhà ở, văn phòng và cửa hàng, cải vận theo lá số, xem ngày giờ tốt.</p>\n<p class=\"text-slate-300 leading-relaxed my-4\">Với việc chỉ cần bố trí lại một phòng hoặc chọn một ngày, buổi tư vấn online là đủ; khảo sát thực địa chỉ cần khi xây mới hoặc cải tạo lớn. Cách làm và quy trình của từng nhóm việc có tại trang <a href=\"/phong-thuy\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">tư vấn phong thủy cùng Thầy Tôn</a>.</p>\n<h2 class=\"text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800\">Thanh toán và mở khóa bản luận giải như thế nào?</h2>\n<p class=\"text-slate-300 leading-relaxed my-4\">Bản luận giải tại Tử Vi &amp; Phong Thủy Thầy Tôn được thanh toán bằng mã QR chuyển khoản ngân hàng và tự động mở khóa ngay khi hệ thống nhận tiền, không cần chờ duyệt thủ công. Khi nâng cấp, mã QR đã tính sẵn phần chênh lệch. Quy trình gồm ba bước:</p>\n<ol class=\"list-decimal pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed\">\n<li class=\"pl-1\"><strong class=\"text-slate-100 font-semibold\">Chọn gói</strong> ở khối mở khóa dưới lá số: Bản Chuyên Sâu Pro, Bản Chuyên Gia Expert hoặc gói câu hỏi cho AI Thầy Tôn.</li>\n<li class=\"pl-1\"><strong class=\"text-slate-100 font-semibold\">Quét mã QR</strong> bằng ứng dụng ngân hàng; giữ nguyên nội dung chuyển khoản do hệ thống tạo để được nhận diện tự động.</li>\n<li class=\"pl-1\"><strong class=\"text-slate-100 font-semibold\">Nhận bài luận</strong> ngay trên trang; nếu chưa thấy mở khóa, nhắn Zalo 0935 058 688 kèm ảnh chụp giao dịch.</li>\n</ol>",
  "faqs": [
    {
      "question": "Lập lá số tử vi tại Thầy Tôn có thật sự miễn phí không?",
      "answerHtml": "Có. Lập lá số tử vi và nhận Bình Giải Khởi Nguyên khoảng 1.000 từ tại Tử Vi &amp; Phong Thủy Thầy Tôn hoàn toàn miễn phí, không cần đăng ký tài khoản. Người dùng chỉ trả phí khi muốn mở khóa Bản Chuyên Sâu Pro (119.000đ), Bản Chuyên Gia Expert (269.000đ) hoặc mua câu hỏi cho AI Thầy Tôn.",
      "answerText": "Có. Lập lá số tử vi và nhận Bình Giải Khởi Nguyên khoảng 1.000 từ tại Tử Vi & Phong Thủy Thầy Tôn hoàn toàn miễn phí, không cần đăng ký tài khoản. Người dùng chỉ trả phí khi muốn mở khóa Bản Chuyên Sâu Pro (119.000đ), Bản Chuyên Gia Expert (269.000đ) hoặc mua câu hỏi cho AI Thầy Tôn."
    },
    {
      "question": "Đã mua Bản Chuyên Sâu Pro, lên Bản Chuyên Gia Expert phải trả bao nhiêu?",
      "answerHtml": "Chỉ trả thêm 150.000đ, đúng bằng phần chênh lệch giữa Bản Chuyên Gia Expert (269.000đ) và Bản Chuyên Sâu Pro (119.000đ). Nâng cấp áp dụng cho cùng một lá số đã mở khóa; bài luận Pro vẫn được giữ trong Sổ tay cá nhân bên cạnh bài luận Expert.",
      "answerText": "Chỉ trả thêm 150.000đ, đúng bằng phần chênh lệch giữa Bản Chuyên Gia Expert (269.000đ) và Bản Chuyên Sâu Pro (119.000đ). Nâng cấp áp dụng cho cùng một lá số đã mở khóa; bài luận Pro vẫn được giữ trong Sổ tay cá nhân bên cạnh bài luận Expert."
    },
    {
      "question": "Không nhớ chính xác giờ sinh thì có lập lá số được không?",
      "answerHtml": "Vẫn lập được, nhưng độ chính xác giảm vì mỗi canh giờ dài 2 tiếng sẽ cho một vị trí cung Mệnh khác. Nên lập thử lá số ở hai canh giờ gần nhất, đối chiếu với tính cách và các sự kiện lớn đã qua. Ở buổi xem 1-1, Thầy Tôn có thể thẩm định lại giờ sinh qua Diện tướng và Chỉ tay.",
      "answerText": "Vẫn lập được, nhưng độ chính xác giảm vì mỗi canh giờ dài 2 tiếng sẽ cho một vị trí cung Mệnh khác. Nên lập thử lá số ở hai canh giờ gần nhất, đối chiếu với tính cách và các sự kiện lớn đã qua. Ở buổi xem 1-1, Thầy Tôn có thể thẩm định lại giờ sinh qua Diện tướng và Chỉ tay."
    },
    {
      "question": "Nên chọn Bản Chuyên Sâu Pro hay Bản Chuyên Gia Expert?",
      "answerHtml": "Chọn Bản Chuyên Sâu Pro (119.000đ) khi cần hiểu kỹ 14 chính tinh, Tứ Hóa và vận hạn theo bốn mùa cho một quyết định trong năm. Chọn Bản Chuyên Gia Expert (269.000đ) khi cần luận đủ 12 cung và kế hoạch từng tháng âm lịch. Nếu chưa chắc, bắt đầu với bản Pro rồi nâng cấp sau, chỉ trả thêm 150.000đ.",
      "answerText": "Chọn Bản Chuyên Sâu Pro (119.000đ) khi cần hiểu kỹ 14 chính tinh, Tứ Hóa và vận hạn theo bốn mùa cho một quyết định trong năm. Chọn Bản Chuyên Gia Expert (269.000đ) khi cần luận đủ 12 cung và kế hoạch từng tháng âm lịch. Nếu chưa chắc, bắt đầu với bản Pro rồi nâng cấp sau, chỉ trả thêm 150.000đ."
    },
    {
      "question": "Làm thế nào để đặt lịch xem trực tiếp cùng Thầy Tôn?",
      "answerHtml": "Gọi hoặc nhắn Zalo 0935 058 688 để đặt lịch trước. Thầy Tôn nhận đàm đạo trực tiếp tại khu vực Khu đô thị Royal City, Thanh Xuân, Hà Nội (địa chỉ chi tiết gửi riêng qua Zalo sau khi xác nhận lịch), hoặc online qua Video Call cho khách ở tỉnh khác và ở nước ngoài.",
      "answerText": "Gọi hoặc nhắn Zalo 0935 058 688 để đặt lịch trước. Thầy Tôn nhận đàm đạo trực tiếp tại khu vực Khu đô thị Royal City, Thanh Xuân, Hà Nội (địa chỉ chi tiết gửi riêng qua Zalo sau khi xác nhận lịch), hoặc online qua Video Call cho khách ở tỉnh khác và ở nước ngoài."
    }
  ],
  "closingHtml": "<h2 class=\"text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800\">Chủ đề tử vi và phong thủy liên quan</h2>\n<p class=\"text-slate-300 leading-relaxed my-4\">Sau khi lập lá số, người xem thường tìm hiểu thêm bốn chủ đề dưới đây trên Tử Vi &amp; Phong Thủy Thầy Tôn:</p>\n<ul class=\"list-disc pl-6 my-4 space-y-2.5 text-slate-300 leading-relaxed\">\n<li class=\"pl-1\"><a href=\"/phong-thuy-cai-van\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">Phong thủy cải vận theo lá số</a> - chọn hướng, màu sắc và bố trí theo hành dụng thần.</li>\n<li class=\"pl-1\"><a href=\"/xem-ngay-tot\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">Xem ngày giờ tốt</a> - động thổ, nhập trạch, khai trương, cưới hỏi.</li>\n<li class=\"pl-1\"><a href=\"/phong-thuy-nha-o\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">Phong thủy nhà ở, chung cư</a> - bố trí cửa, bếp, phòng ngủ, bàn thờ hợp mệnh gia chủ.</li>\n<li class=\"pl-1\"><a href=\"/phong-thuy-van-phong\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">Phong thủy văn phòng, cửa hàng</a> - vị trí phòng lãnh đạo, quầy thu ngân, hướng cửa.</li>\n</ul>\n<h2 class=\"text-xl sm:text-2xl font-bold text-amber-300 mt-10 mb-4 pb-2 border-b border-slate-800\">Bước tiếp theo với lá số của bạn: chọn đúng mức luận giải</h2>\n<p class=\"text-slate-300 leading-relaxed my-4\">Lá số của bạn sẵn sàng sau 30 giây nhập thông tin. Bắt đầu bằng Bản Khởi Nguyên miễn phí để nắm tổng quan; khi đứng trước một quyết định cụ thể trong năm, mở khóa Bản Chuyên Sâu Pro và nâng cấp lên Expert khi cần, chỉ trả phần chênh lệch; khi cần bàn kỹ cả lá số lẫn không gian sống, làm việc, đặt lịch gặp riêng Thầy Tôn. Người muốn tìm hiểu trước vận năm tới có thể đọc bài <a href=\"/tu-vi-2027\" class=\"text-amber-400 hover:text-amber-300 underline decoration-amber-500/60 underline-offset-4 font-semibold transition-colors\">tử vi năm 2027 cho 12 con giáp</a>.</p>",
  "primaryCta": {
    "label": "Lập Lá Số Miễn Phí",
    "href": "/#lap-la-so"
  },
  "secondaryCta": {
    "label": "Đặt Lịch Xem 1-1 Với Thầy Tôn (Zalo 0935 058 688)",
    "href": "https://zalo.me/0935058688"
  }
};
