// Tự động tách từ courseData.ts: CHỈ chứa mục lục 24 bài + nội dung học thử miễn phí Bài 1 & 2.
// Nội dung đầy đủ và audio Bài 3-24 nằm độc quyền phía server (courseData.ts + Supabase Private Bucket 'course-audio').

export interface PodcastChapter {
  time: string;
  title: string;
  transcript: string;
  audioUrl?: string;
}

export interface StarFlashcard {
  nguHanh: string;
  hoaKhi: string;
  chuSu: string;
  dacHam: string;
  cauPhu: string;
  cotLoi: string;
}

export interface CourseLesson {
  id: string;
  number: number;
  moduleId: number;
  title: string;
  subtitle: string;
  isFreePreview: boolean;
  duration: string;
  audioUrl?: string;
  relatedStars: string[];
  flashcard: StarFlashcard;
  podcastChapters: PodcastChapter[];
  contentHtml: string;
}

export interface CourseModule {
  id: number;
  badge: string;
  title: string;
  description: string;
}

export const COURSE_INFO = {
  "title": "Khóa Học Tử Vi Đẩu Số Thực Chiến Cùng Thầy Tôn",
  "subtitle": "Làm Chủ 14 Chính Tinh, Phụ Tinh, Cách Cục & Quy Trình Luận Giải Vận Hạn Qua Podcast Và Giáo Trình Tương Tác",
  "price": 699000,
  "originalPrice": 1490000,
  "totalLessons": 24,
  "totalHours": "8+ giờ Podcast & 24 Chuyên khảo"
};

export const COURSE_MODULES: CourseModule[] = [
  {
    "id": 1,
    "badge": "HỌC PHẦN 1 • NỀN TẢNG & TƯ DUY CỐT LÕI",
    "title": "Nền Tảng Âm Dương, Ngũ Hành, Cục & Tư Duy Đọc Lá Số Chuẩn Logic",
    "description": "Hiểu đúng bộ khung vận hành của lá số Tử Vi: quy tắc Âm Dương thuận nghịch, tương quan Mệnh - Cục, Tam Hợp - Xung Chiếu và cách phân biệt gốc Tiên Thiên với vận Hậu Thiên."
  },
  {
    "id": 2,
    "badge": "HỌC PHẦN 2 • 14 CHÍNH TINH CHUYÊN SÂU",
    "title": "Giải Mã Chi Tiết 14 Chính Tinh: Tính Chất, Tâm Lý, Hình Tướng & Đắc Hãm",
    "description": "Đi sâu vào từng ngôi sao trong vòng Tử Vi và vòng Thiên Phủ: bản chất ngũ hành, điểm mạnh - điểm khuyết, dấu hiệu nhận diện ngoài đời và phản ứng khi gặp Cát/Sát tinh."
  },
  {
    "id": 3,
    "badge": "HỌC PHẦN 3 • PHỤ TINH, TỨ HÓA & VÒNG SAO",
    "title": "Hệ Thống Lục Cát, Lục Sát, Tứ Hóa, Thái Tuế, Lộc Tồn & Tuần Triệt",
    "description": "Nắm vững các bộ sao quyết định thành bại thực tế của lá số: Tứ Hóa kích hoạt biến cố, Lục Sát phát dã như lôi, Lục Cát trợ lực và cơ chế đảo chiều của Tuần - Triệt."
  },
  {
    "id": 4,
    "badge": "HỌC PHẦN 4 • CÁCH CỤC LỚN & LUẬN VẬN HẠN",
    "title": "4 Cách Cục Lớn & Quy Trình 5 Bước Chấm Hạn Năm - Tháng Thực Chiến",
    "description": "Tổng hợp toàn bộ kiến thức vào thực hành: nhận diện 4 thế đứng lớn (Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Cự Nhật) và quy trình đọc Đại vận, Tiểu vận."
  }
];

export const COURSE_LESSONS_META: CourseLesson[] = [
  {
    "id": "bai-1",
    "number": 1,
    "moduleId": 1,
    "title": "Tư Duy Đọc Lá Số Chuẩn Logic: Âm Dương, Ngũ Hành, Cục & Tam Hợp – Xung Chiếu",
    "subtitle": "Vì sao không bao giờ được nhìn một sao đơn lẻ để phán tốt xấu? Quy tắc đọc 3 phương 4 chính.",
    "isFreePreview": true,
    "duration": "19:30",
    "relatedStars": [
      "Tử Vi",
      "Thiên Phủ",
      "Thái Dương",
      "Thái Âm"
    ],
    "flashcard": {
      "nguHanh": "Kim • Mộc • Thủy • Hỏa • Thổ (Tương sinh & Tương khắc)",
      "hoaKhi": "Nền tảng Mệnh - Cục - Thân",
      "chuSu": "Khung xương sống định hình toàn bộ 12 cung trên lá số",
      "dacHam": "Xét Âm Dương thuận lý / nghịch lý và Cục sinh Mệnh hay Mệnh khắc Cục",
      "cauPhu": "Độc thủ bất thành cách — Một sao đơn lẻ không bao giờ làm nên cách cục lớn.",
      "cotLoi": "Luôn đọc cung bản vị (40%) kết hợp cung Xung chiếu (30%) và hai cung Tam hợp (30%)."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Sai lầm phổ biến nhất của người mới học Tử Vi",
        "transcript": "Chào mừng các bạn đến với Học Viện Tử Vi Đẩu Số Thực Chiến cùng Thầy Tôn. Ở bài mở đầu này, chúng ta giải quyết ngay sai lầm lớn nhất của 90% người mới xem lá số: đó là nhìn thấy một ngôi sao tên nghe rất đẹp như Tử Vi, Thiên Phủ liền mừng rỡ, hoặc vừa thấy Kình Dương, Địa Không, Hóa Kỵ đã vội hoang mang lo sợ. Trong Tử Vi Đẩu Số, một ngôi sao đứng một mình giống như một cầu thủ đứng giữa sân bóng trống, chưa thể tạo nên bàn thắng hay thất bại. Giá trị thực của sao phụ thuộc vào 3 yếu tố: vị trí đắc hãm tại 12 địa chi, tổ hợp các sao hội họp trong Tam hợp - Xung chiếu, và thời điểm Đại vận đi qua.",
        "audioUrl": "/audio/course/bai-1-chap-1.mp3"
      },
      {
        "time": "04:45",
        "title": "Tương quan giữa Bản Mệnh và Cục: Nội lực và Môi trường",
        "transcript": "Khi nhìn vào thiên bàn ở giữa lá số, hai dòng các bạn cần đọc đầu tiên là Bản Mệnh ngũ hành nạp âm và Cục. Hãy hình dung Bản Mệnh là chiếc xe của bạn, còn Cục là mặt đường và môi trường xã hội. Nếu Cục sinh Mệnh, ví dụ Thủy Nhị Cục sinh Mệnh Mộc, bạn đi ra đời dễ gặp thời thế thuận lợi, môi trường nâng đỡ. Nếu Mệnh sinh Cục, bạn là người dốc sức cống hiến cho tập thể và công việc. Nếu Mệnh khắc Cục, bạn luôn muốn làm chủ hoàn cảnh và tự mở lối đi riêng. Còn nếu Cục khắc Mệnh, giai đoạn đầu đời thường phải vượt qua thử thách từ hoàn cảnh để rèn bản lĩnh.",
        "audioUrl": "/audio/course/bai-1-chap-2.mp3"
      },
      {
        "time": "10:15",
        "title": "Công thức 40 - 30 - 30 khi đọc Tam Hợp và Xung Chiếu",
        "transcript": "Mỗi cung trên lá số luôn chịu sự chi phối trực tiếp của 3 cung khác tạo thành thế Tam Phương Tứ Chính. Lấy cung Mệnh làm gốc thì cung Mệnh chiếm khoảng 40% trọng số; cung Thiên Di xung chiếu đối diện chiếm 30% trọng số vì nó phản ánh môi trường bên ngoài tác động trực tiếp vào bạn; và hai cung Tài Bạch, Quan Lộc nằm trong tam hợp chiếm 30% còn lại. Do đó, dù cung Mệnh Vô Chính Diệu nhưng cung Thiên Di và Tam hợp sáng sủa, có Tuần Triệt trấn giữ đúng chỗ thì vẫn là lá số cực kỳ bản lĩnh.",
        "audioUrl": "/audio/course/bai-1-chap-3.mp3"
      },
      {
        "time": "15:20",
        "title": "Mệnh quản tiền vận, Thân quản hậu vận từ mốc 30 tuổi",
        "transcript": "Một nguyên tắc sống còn nữa là phải luôn xem cung Thân cư ở đâu. Trước 30 tuổi, con người hành xử theo bản năng của cung Mệnh. Sau 30 tuổi, suy nghĩ, ưu tiên và thành tựu của bạn dịch chuyển mạnh về cung an Thân. Thân cư Tài Bạch thì nửa đời sau lấy dòng tiền làm trọng tâm; Thân cư Quan Lộc thì lấy danh vị và sự nghiệp làm lẽ sống; Thân cư Phúc Đức hay Phu Thê thì hậu vận đặt nặng sự bình an tinh thần và gia đạo.",
        "audioUrl": "/audio/course/bai-1-chap-4.mp3"
      }
    ],
    "contentHtml": "\n      <h2>1. Ba Tầng Nền Tảng Bắt Buộc Phải Xem Trước Khi Đọc Từng Sao</h2>\n      <p>Trước khi đi vào tính chất của 14 chính tinh hay hơn 100 phụ tinh, người học Tử Vi bài bản cần lập trình thói quen nhìn <strong>tổng thể Thiên bàn và Tam phương Tứ chính</strong> theo đúng thứ tự 3 bước:</p>\n      <ul>\n        <li><strong>Bước 1 — Xét Âm Dương Thuận Lý hay Nghịch Lý:</strong> Người tuổi Dương (Giáp, Bính, Mậu, Canh, Nhâm) sinh vào cung Dương (Tý, Dần, Thìn, Ngọ, Thân, Tuất) hoặc người tuổi Âm sinh vào cung Âm gọi là <strong>Âm Dương thuận lý</strong> — cuộc đời thường đi theo lộ trình tuần tự, ít bước ngoặt gãy khúc. Ngược lại, <strong>Âm Dương nghịch lý</strong> thường phải tự lực cánh sinh, trải qua một vài lần đổi hướng lớn mới định hình được cơ nghiệp.</li>\n        <li><strong>Bước 2 — Xét Tương Quan Giữa Mệnh và Cục:</strong> Mệnh là năng lực nội tại của đương số; Cục (Thủy nhị cục, Mộc tam cục, Kim tứ cục, Thổ ngũ cục, Hỏa lục cục) là hoàn cảnh khách quan và số tuổi bắt đầu bước vào Đại vận đầu tiên.</li>\n        <li><strong>Bước 3 — Xét Trục Mệnh – Thân và Tam Hợp Mệnh – Tài – Quan:</strong> Mệnh là gốc rễ tính cách; Tài Bạch là phương thức tạo ra dòng tiền; Quan Lộc là cách thức vận hành công việc; Thiên Di là mặt trận đối ngoại.</li>\n      </ul>\n      <h2>2. Bảng Quy Chiếu Tương Quan Mệnh – Cục Trong Thực Chiến</h2>\n      <table>\n        <thead>\n          <tr>\n            <th>Tương quan Mệnh &amp; Cục</th>\n            <th>Bản chất vận hành</th>\n            <th>Chiến lược phát triển phù hợp</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td><strong>Cục sinh Mệnh</strong></td>\n            <td>Hoàn cảnh, thời thế và quý nhân dễ hỗ trợ bản thân</td>\n            <td>Tận dụng tốt đòn bẩy tập thể, mở rộng mạng lưới hợp tác sớm</td>\n          </tr>\n          <tr>\n            <td><strong>Mệnh Cục Tỷ Hòa</strong></td>\n            <td>Bản thân hòa nhập nhanh với môi trường xung quanh</td>\n            <td>Phát triển bền vững theo đúng chuyên môn cốt lõi</td>\n          </tr>\n          <tr>\n            <td><strong>Mệnh sinh Cục</strong></td>\n            <td>Bản thân chủ động cho đi, dốc tâm huyết cho công việc và xã hội</td>\n            <td>Làm nghề chuyên gia, giáo dục, dịch vụ, quản trị nhân sự rất đắc cách</td>\n          </tr>\n          <tr>\n            <td><strong>Mệnh khắc Cục</strong></td>\n            <td>Ý chí tự chủ cao, muốn tự kiến tạo quy tắc riêng</td>\n            <td>Hợp khởi nghiệp, cải tổ quy trình hoặc làm việc độc lập</td>\n          </tr>\n          <tr>\n            <td><strong>Cục khắc Mệnh</strong></td>\n            <td>Môi trường thử thách nhiều ở tiền vận, càng rèn càng cứng cáp</td>\n            <td>Lấy chuyên môn sâu và kỷ luật tài chính làm lá chắn vượt nghịch cảnh</td>\n          </tr>\n        </tbody>\n      </table>\n      <h2>3. Quy Tắc Thực Chiến Khi Luận Giải Của Thầy Tôn</h2>\n      <ul>\n        <li><strong>Không nhìn đơn tinh mà kết luận vội:</strong> Thấy Sát tinh (Kình, Đà, Không, Kiếp) phải xem ngay có Chính tinh Miếu Vượng hay Tuần, Triệt, Hóa Khoa chế giải hay không.</li>\n        <li><strong>Phân biệt rõ Mệnh và Thân:</strong> Trước 30 tuổi xem trọng cung Mệnh; từ sau 30 tuổi trở đi, cung an Thân mới là nơi quyết định thành tựu thực tế và ưu tiên sống của đương số.</li>\n        <li><strong>Lấy Phúc Đức làm gốc rễ:</strong> Cung Phúc Đức luôn chiếu thẳng vào cung Tài Bạch và nằm trong tam hợp của cung Phu Thê, Thiên Di — do đó giữ gìn chữ tín và bồi đắp phúc ấm gia tộc chính là chìa khóa bền vững nhất để kích hoạt tài vận.</li>\n      </ul>\n    "
  },
  {
    "id": "bai-2",
    "number": 2,
    "moduleId": 1,
    "title": "Sao Tử Vi (Bắc Đẩu Đế Tinh): Khi Nào Là Minh Quân, Khi Nào Là Cô Quân?",
    "subtitle": "Giải phẫu ngôi sao đứng đầu 14 chính tinh: uy quyền lãnh đạo, điều kiện cần có Tả Hữu và cách hóa giải thế Đế Ngộ Hung Đồ.",
    "isFreePreview": true,
    "duration": "21:15",
    "relatedStars": [
      "Tử Vi",
      "Tả Phù",
      "Hữu Bật",
      "Thiên Phủ",
      "Thiên Tướng"
    ],
    "flashcard": {
      "nguHanh": "Âm Thổ (Kỷ Thổ — Đất trung tâm màu mỡ, che chở và quy tụ muôn loài)",
      "hoaKhi": "Tôn Quý & Đế Tinh (Ngôi sao chủ về uy quyền, tổ chức và dẫn dắt)",
      "chuSu": "Chủ Quan Lộc, tước vị, năng lực điều hành và giải ách chế sát",
      "dacHam": "Miếu địa: Tỵ, Ngọ, Dần, Thân • Vượng địa: Thìn, Tuất • Đắc địa: Sửu, Mùi • Bình hòa: Hợi, Tý, Mão, Dậu",
      "cauPhu": "Tử Vi cư Ngọ vô Hình Kỵ, Giáp Đinh Kỷ mệnh chí công khanh.",
      "cotLoi": "Tử Vi bắt buộc phải có quần thần hội chiếu (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Khôi Việt) mới phát huy hết uy quyền lãnh đạo."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Bản chất Âm Thổ và khí chất Đế Tinh của sao Tử Vi",
        "transcript": "Sao Tử Vi là ngôi sao mở đầu cho vòng Bắc Đẩu, mang ngũ hành Âm Thổ, tức Kỷ Thổ trung tâm, hóa khí là Tôn Quý. Người có sao Tử Vi thủ Mệnh ở vị trí Miếu Vượng thường có phong thái đĩnh đạc, tự trọng cao, thích sắp xếp, tổ chức và không thích bị người khác áp đặt một cách vô lý. Tuy nhiên, hiểu đúng sao Tử Vi không phải là ai có Tử Vi cũng làm quan to hay làm tổng giám đốc. Tử Vi là hình tượng của một vị vua; mà một vị vua có thực quyền hay không hoàn toàn phụ thuộc vào việc xung quanh có bề tôi giỏi hay không.",
        "audioUrl": "/audio/course/bai-2-chap-1.mp3"
      },
      {
        "time": "06:10",
        "title": "Tử Vi cần Tả Phù, Hữu Bật như vua cần tể tướng",
        "transcript": "Điều kiện sống còn của sao Tử Vi là phải hội hợp được Lục Cát Tinh, đặc biệt là cặp Tả Phù - Hữu Bật, Văn Xương - Văn Khúc, Thiên Khôi - Thiên Việt hoặc Hóa Lộc, Hóa Quyền, Hóa Khoa. Khi Tử Vi có Tả Hữu phò tá gọi là Quân Thần Khánh Hội: người này đi tới đâu cũng có cộng sự đắc lực, biết dùng người và dễ nắm vị trí quản lý cấp cao. Ngược lại, nếu Tử Vi đứng trơ trọi không có một sao phụ tá nào mà lại gặp Tuần Triệt hoặc Cô Thần, Quả Tú thì gọi là Cô Quân — tức là ông vua cô độc, việc gì cũng phải tự ôm vào người, tâm tính dễ cao ngạo mà thực quyền lại mỏng.",
        "audioUrl": "/audio/course/bai-2-chap-2.mp3"
      },
      {
        "time": "12:40",
        "title": "Các thế đứng của Tử Vi trên 12 địa chi",
        "transcript": "Tại hai cung Tý và Ngọ, Tử Vi đứng độc thủ. Đặc biệt Tử Vi cư Ngọ là thế Cực Hướng Ly Minh — vua ngồi ngai vàng nhìn về phương Nam rực rỡ nhất, rất hợp với người tuổi Giáp, Đinh, Kỷ khi không bị Kình Dương, Hóa Kỵ phá cách. Tại Dần và Thân, Tử Vi đồng cung với Thiên Phủ tạo thành bộ Tử Phủ đồng cung cực kỳ vững chãi cả về quyền lẫn tài. Tại Thìn và Tuất, Tử Vi đi cùng Thiên Tướng; tại Sửu và Mùi đi cùng Phá Quân; tại Mão và Dậu đi cùng Tham Lang; còn tại Tỵ và Hợi đi cùng Thất Sát tạo thành cách Tử Sát uy quyền.",
        "audioUrl": "/audio/course/bai-2-chap-3.mp3"
      },
      {
        "time": "17:30",
        "title": "Khi Tử Vi gặp Không Kiếp, Kình Đà: Đế Ngộ Hung Đồ",
        "transcript": "Nếu Tử Vi không có Tả Hữu mà lại hội họp Địa Không, Địa Kiếp, Kình Dương, Đà La thì cổ nhân gọi là Đế Ngộ Hung Đồ — vua gặp đám loạn thần. Người mang cách này trong công việc dễ dùng tiểu xảo, quyết định nóng vội hoặc bị cấp dưới phản trắc. Tuy nhiên, nếu Tử Vi đồng cung Thất Sát tại Tỵ Hợi gặp thêm Hóa Quyền thì lại chế ngự được sát tinh để làm tướng cầm quân trên thương trường.",
        "audioUrl": "/audio/course/bai-2-chap-4.mp3"
      }
    ],
    "contentHtml": "\n      <h2>1. Đặc Tính Cốt Lõi Của Sao Tử Vi: Tâm Lý, Hình Tướng &amp; Sự Nghiệp</h2>\n      <p><strong>Sao Tử Vi</strong> đứng đầu chòm Bắc Đẩu, thuộc hành <strong>Âm Thổ (Kỷ Thổ)</strong>. Trong hệ thống 14 chính tinh, Tử Vi không bao giờ rơi vào vị trí Hãm địa hoàn toàn (thấp nhất là Bình hòa tại Tý, Hợi, Mão, Dậu), thể hiện sức che chở và khả năng tự cân bằng rất lớn:</p>\n      <ul>\n        <li><strong>Về tâm lý &amp; tính cách:</strong> Trọng danh dự, có tư duy hệ thống, thích nhìn bức tranh tổng thể, bao dung nhưng đôi khi cả nể, ưa nghe lời khen ngợi (nếu thiếu các sao sắc bén đi kèm).</li>\n        <li><strong>Về năng lực công việc:</strong> Xuất sắc trong vai trò hoạch định, điều phối nhân sự, quản lý dự án, điều hành doanh nghiệp hoặc làm việc trong các tổ chức lớn.</li>\n        <li><strong>Năng lực giải ách:</strong> Tử Vi có khả năng chế giải bớt tính hung hãn của Hỏa Tinh, Linh Tinh và biến Thất Sát thành quyền uy (<em>Hóa Sát vi Quyền</em>).</li>\n      </ul>\n      <h2>2. Bảng Phân Tích 6 Thế Đứng Của Sao Tử Vi Trên 12 Cung Địa Chi</h2>\n      <table>\n        <thead>\n          <tr>\n            <th>Vị trí Địa Chi</th>\n            <th>Tổ hợp Chính Tinh</th>\n            <th>Đặc điểm thực chiến nổi bật</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td><strong>Tý • Ngọ</strong></td>\n            <td>Tử Vi độc thủ</td>\n            <td>Tại Ngọ là <em>Cực Hướng Ly Minh</em> rất sáng; cần Tả Hữu, Khôi Việt để nắm vị trí đứng đầu. Tại Tý trầm tĩnh hơn, thực tế hơn.</td>\n          </tr>\n          <tr>\n            <td><strong>Dần • Thân</strong></td>\n            <td>Tử Vi – Thiên Phủ</td>\n            <td>Hai đế tinh Bắc – Nam Đẩu hội họp: tài vận và quan vận đều dày, hợp quản trị tài chính, ngân hàng, bất động sản lớn.</td>\n          </tr>\n          <tr>\n            <td><strong>Thìn • Tuất</strong></td>\n            <td>Tử Vi – Thiên Tướng</td>\n            <td>Đóng tại La Võng nên lúc trẻ phải nỗ lực bứt phá lớn; có tính quyết đoán, dám cải cách để lập danh.</td>\n          </tr>\n          <tr>\n            <td><strong>Tỵ • Hợi</strong></td>\n            <td>Tử Vi – Thất Sát</td>\n            <td><em>Tử Sát đồng lâm</em> — vừa có uy của vua vừa có kiếm của tướng; cực hợp làm chủ doanh nghiệp, điều hành sản xuất, thương mại.</td>\n          </tr>\n          <tr>\n            <td><strong>Sửu • Mùi</strong></td>\n            <td>Tử Vi – Phá Quân</td>\n            <td>Bản lĩnh khai phá mạnh, thường làm hai nghề song song hoặc trải qua một lần chuyển đổi sự nghiệp lớn rồi mới đại thành.</td>\n          </tr>\n          <tr>\n            <td><strong>Mão • Dậu</strong></td>\n            <td>Tử Vi – Tham Lang</td>\n            <td><em>Đào Hoa Phạm Chủ</em> nếu gặp thêm nhiều sao tình ái; nhưng nếu gặp Hỏa Linh hoặc Tuần Triệt lại rất giỏi kinh doanh, nghệ thuật, ngoại giao.</td>\n          </tr>\n        </tbody>\n      </table>\n      <h2>3. Luận Giải Sao Tử Vi Tại Các Cung Trọng Điểm &amp; Bí Quyết Ứng Dụng</h2>\n      <ul>\n        <li><strong>Tại Cung Tài Bạch &amp; Quan Lộc:</strong> Chủ về nguồn thu nhập từ vị trí quản lý, điều hành, thương hiệu uy tín hoặc làm việc trong các tập đoàn, cơ quan lớn. Cực kỳ phát đạt khi đi cùng Lộc Tồn, Hóa Lộc, Hóa Quyền, Tả Phù, Hữu Bật.</li>\n        <li><strong>Tại Cung Phu Thê:</strong> Người phối ngẫu thường có lòng tự trọng cao, có năng lực tổ chức hoặc xuất thân gia giáo; vợ chồng cần tôn trọng thể diện và lắng nghe nhau để giữ hòa khí.</li>\n        <li><strong>Tại Cung Điền Trạch:</strong> Thích ở nơi cao ráo, khang trang, an ninh tốt, gần trung tâm hành chính hoặc tòa nhà lớn; hậu vận tích lũy bất động sản vững chắc.</li>\n      </ul>\n    "
  },
  {
    "id": "bai-3",
    "number": 3,
    "moduleId": 1,
    "title": "Quy Tắc Phân Tầng Lá Số: Tiên Thiên (Mệnh – Thân) & Hậu Thiên (Đại Vận – Lưu Niên)",
    "subtitle": "Cách kết nối lá số gốc với dòng thời gian 10 năm và 1 năm để biết chính xác khi nào phát, khi nào phòng thủ.",
    "isFreePreview": false,
    "duration": "18:20",
    "relatedStars": [
      "Lộc Tồn",
      "Thiên Mã",
      "Hóa Lộc",
      "Hóa Kỵ"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Cách kết nối lá số gốc với dòng thời gian 10 năm và 1 năm để biết chính xác khi nào phát, khi nào phòng thủ.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Cách kết nối lá số gốc với dòng thời gian 10 năm và 1 năm để biết chính xác khi nào phát, khi nào phòng thủ."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Vì sao hai người có Mệnh đẹp như nhau nhưng cuộc đời khác biệt?",
        "transcript": ""
      },
      {
        "time": "06:00",
        "title": "Cách xét chiều đi của Đại vận: Dương Nam Âm Nữ thuận hành",
        "transcript": ""
      },
      {
        "time": "12:15",
        "title": "Sự giao thoa giữa Đại vận 10 năm và Lưu niên 1 năm",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-4",
    "number": 4,
    "moduleId": 2,
    "title": "Sao Thiên Cơ: Mưu Sĩ Tham Mưu, Trí Tuệ Biến Hóa & Động Tinh",
    "subtitle": "Ngôi sao của tư duy chiến lược, công nghệ, hoạch định kế hoạch và sự dịch chuyển linh hoạt.",
    "isFreePreview": false,
    "duration": "19:50",
    "relatedStars": [
      "Thiên Cơ",
      "Thiên Lương",
      "Thái Âm",
      "Cự Môn"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Ngôi sao của tư duy chiến lược, công nghệ, hoạch định kế hoạch và sự dịch chuyển linh hoạt.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Ngôi sao của tư duy chiến lược, công nghệ, hoạch định kế hoạch và sự dịch chuyển linh hoạt."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Bản chất Âm Mộc và Động Tinh của sao Thiên Cơ",
        "transcript": ""
      },
      {
        "time": "06:30",
        "title": "Thiên Cơ đi với Thái Âm, Cự Môn và Thiên Lương",
        "transcript": ""
      },
      {
        "time": "13:45",
        "title": "Điểm yếu cần khắc phục của người mệnh Thiên Cơ",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-5",
    "number": 5,
    "moduleId": 2,
    "title": "Sao Thái Dương: Quang Minh Quyền Quý, Danh Tiếng & Áp Lực Gánh Vác",
    "subtitle": "Sự khác biệt một trời một vực giữa Thái Dương sinh ban ngày (Dần – Ngọ) và Thái Dương sinh ban đêm (Thân – Sửu).",
    "isFreePreview": false,
    "duration": "20:40",
    "relatedStars": [
      "Thái Dương",
      "Thái Âm",
      "Cự Môn",
      "Thiên Lương"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Sự khác biệt một trời một vực giữa Thái Dương sinh ban ngày (Dần – Ngọ) và Thái Dương sinh ban đêm (Thân – Sửu).",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Sự khác biệt một trời một vực giữa Thái Dương sinh ban ngày (Dần – Ngọ) và Thái Dương sinh ban đêm (Thân – Sửu)."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Thái Dương: Ngôi sao của sự quang minh, hào sảng và danh vị",
        "transcript": ""
      },
      {
        "time": "07:20",
        "title": "Thái Dương ban ngày (Miếu Vượng) và Thái Dương ban đêm (Hãm địa)",
        "transcript": ""
      },
      {
        "time": "14:10",
        "title": "Ý nghĩa đặc biệt của Thái Dương đối với lá số Nữ mệnh",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-6",
    "number": 6,
    "moduleId": 2,
    "title": "Sao Vũ Khúc: Chính Tài Tinh, Thực Thi Tài Chính & Bản Lĩnh Cô Quả",
    "subtitle": "Ngôi sao của hành động thực tế, ngân hàng, thương mại và lý do người mệnh Vũ Khúc cần chú ý cung Phu Thê.",
    "isFreePreview": false,
    "duration": "20:10",
    "relatedStars": [
      "Vũ Khúc",
      "Thiên Phủ",
      "Thiên Tướng",
      "Tham Lang",
      "Thất Sát",
      "Phá Quân"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Ngôi sao của hành động thực tế, ngân hàng, thương mại và lý do người mệnh Vũ Khúc cần chú ý cung Phu Thê.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Ngôi sao của hành động thực tế, ngân hàng, thương mại và lý do người mệnh Vũ Khúc cần chú ý cung Phu Thê."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Vũ Khúc: Ngôi sao thực tế nhất trong 14 Chính Tinh",
        "transcript": ""
      },
      {
        "time": "07:15",
        "title": "Vũ Khúc đi với Tử Phủ Tướng và Vũ Khúc đi với Sát Phá Tham",
        "transcript": ""
      },
      {
        "time": "14:30",
        "title": "Vì sao cổ nhân gọi Vũ Khúc là Quả Tú tinh?",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-7",
    "number": 7,
    "moduleId": 2,
    "title": "Sao Thiên Đồng: Phúc Tinh Giải Ách, Cảm Xúc Nghệ Thuật & Sự Dịch Chuyển",
    "subtitle": "Vì sao Thiên Đồng là ngôi sao đệ nhất Phúc Đức nhưng lại cần trải qua thử thách mới thành tựu lớn?",
    "isFreePreview": false,
    "duration": "17:50",
    "relatedStars": [
      "Thiên Đồng",
      "Thái Âm",
      "Thiên Lương",
      "Cự Môn"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Vì sao Thiên Đồng là ngôi sao đệ nhất Phúc Đức nhưng lại cần trải qua thử thách mới thành tựu lớn?",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Vì sao Thiên Đồng là ngôi sao đệ nhất Phúc Đức nhưng lại cần trải qua thử thách mới thành tựu lớn?"
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Thiên Đồng: Ngôi sao trẻ mãi không già trong 14 Chính Tinh",
        "transcript": ""
      },
      {
        "time": "06:40",
        "title": "Nghịch lý thú vị: Thiên Đồng quá êm đềm lại khó bứt phá",
        "transcript": ""
      },
      {
        "time": "12:50",
        "title": "Thiên Đồng đi với Thái Âm, Thiên Lương và Cự Môn",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-8",
    "number": 8,
    "moduleId": 2,
    "title": "Sao Liêm Trinh: Đào Hoa Thứ Hai, Kỷ Luật Pháp Lý & Lửa Nội Tâm",
    "subtitle": "Ngôi sao vừa mang tính thanh liêm kỷ luật vừa mang sức hút Đào hoa mạnh mẽ khi đi cùng Tham Lang, Phá Quân.",
    "isFreePreview": false,
    "duration": "19:15",
    "relatedStars": [
      "Liêm Trinh",
      "Thiên Tướng",
      "Thất Sát",
      "Phá Quân",
      "Tham Lang"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Ngôi sao vừa mang tính thanh liêm kỷ luật vừa mang sức hút Đào hoa mạnh mẽ khi đi cùng Tham Lang, Phá Quân.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Ngôi sao vừa mang tính thanh liêm kỷ luật vừa mang sức hút Đào hoa mạnh mẽ khi đi cùng Tham Lang, Phá Quân."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Hai mặt đối lập thú vị bên trong sao Liêm Trinh",
        "transcript": ""
      },
      {
        "time": "07:00",
        "title": "Liêm Trinh độc thủ tại Dần Thân và Liêm Tướng tại Tý Ngọ",
        "transcript": ""
      },
      {
        "time": "13:30",
        "title": "Khi Liêm Trinh gặp Hóa Kỵ, Bạch Hổ tại Tỵ Hợi, Mão Dậu",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-9",
    "number": 9,
    "moduleId": 2,
    "title": "Sao Thiên Phủ: Kho Tàng Nam Đẩu, Năng Lực Quản Trị & Tích Lũy Tài Sản",
    "subtitle": "Vì sao Thiên Phủ cần Lộc Tồn để làm đầy kho và sợ nhất Địa Không, Địa Kiếp làm lộ khố, không khố?",
    "isFreePreview": false,
    "duration": "19:40",
    "relatedStars": [
      "Thiên Phủ",
      "Tử Vi",
      "Vũ Khúc",
      "Liêm Trinh",
      "Lộc Tồn"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Vì sao Thiên Phủ cần Lộc Tồn để làm đầy kho và sợ nhất Địa Không, Địa Kiếp làm lộ khố, không khố?",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Vì sao Thiên Phủ cần Lộc Tồn để làm đầy kho và sợ nhất Địa Không, Địa Kiếp làm lộ khố, không khố?"
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Thiên Phủ: Nam Đẩu Đế Tinh — Vững vàng, cẩn trọng và thực tế",
        "transcript": ""
      },
      {
        "time": "06:50",
        "title": "Thiên Phủ Đắc Lộc (Kho đầy) và Thiên Phủ Không Lộ (Kho rỗng)",
        "transcript": ""
      },
      {
        "time": "13:40",
        "title": "Luôn nhìn cung Tướng diện và cung Thất Sát khi xem Thiên Phủ",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-10",
    "number": 10,
    "moduleId": 2,
    "title": "Sao Thái Âm: Phú Tinh Điền Trạch, Dòng Tiền Bền Vững & Chiều Sâu Nội Tâm",
    "subtitle": "Mặt trăng của Tử Vi Đẩu Số: chủ về bất động sản, tài chính ngân hàng, thẩm mỹ và sự tinh tế.",
    "isFreePreview": false,
    "duration": "20:25",
    "relatedStars": [
      "Thái Âm",
      "Thái Dương",
      "Thiên Cơ",
      "Thiên Đồng"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Mặt trăng của Tử Vi Đẩu Số: chủ về bất động sản, tài chính ngân hàng, thẩm mỹ và sự tinh tế.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Mặt trăng của Tử Vi Đẩu Số: chủ về bất động sản, tài chính ngân hàng, thẩm mỹ và sự tinh tế."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Thái Âm: Phú Tinh chủ quản Điền Trạch và tài sản tích lũy",
        "transcript": ""
      },
      {
        "time": "07:10",
        "title": "Nguyệt Lãng Thiên Môn (Thái Âm cư Hợi) và Thủy Trừng Quế Ngạc (Cư Tý)",
        "transcript": ""
      },
      {
        "time": "14:00",
        "title": "Khi Thái Âm Hãm địa từ Dần đến Ngọ cần lưu ý gì?",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-11",
    "number": 11,
    "moduleId": 2,
    "title": "Sao Tham Lang: Chánh Đào Hoa, Khát Vọng Đa Ngành & Biến Hóa Ngoại Giao",
    "subtitle": "Ngôi sao của khát vọng lớn, tài năng giao tiếp bậc thầy và sự bùng nổ kỳ diệu khi gặp Hỏa Tinh, Linh Tinh.",
    "isFreePreview": false,
    "duration": "20:05",
    "relatedStars": [
      "Tham Lang",
      "Vũ Khúc",
      "Tử Vi",
      "Liêm Trinh",
      "Hỏa Tinh",
      "Linh Tinh"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Ngôi sao của khát vọng lớn, tài năng giao tiếp bậc thầy và sự bùng nổ kỳ diệu khi gặp Hỏa Tinh, Linh Tinh.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Ngôi sao của khát vọng lớn, tài năng giao tiếp bậc thầy và sự bùng nổ kỳ diệu khi gặp Hỏa Tinh, Linh Tinh."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Hiểu đúng về chữ Tham và chữ Đào Hoa của sao Tham Lang",
        "transcript": ""
      },
      {
        "time": "07:30",
        "title": "Vì sao Tham Lang sợ Không Kiếp nhưng lại cực thích Hỏa Tinh, Linh Tinh?",
        "transcript": ""
      },
      {
        "time": "14:15",
        "title": "Từ Chánh Đào Hoa lúc trẻ đến niềm đam mê Huyền học, Tâm linh tuổi trung niên",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-12",
    "number": 12,
    "moduleId": 2,
    "title": "Sao Cự Môn: Ám Tinh Ngôn Ngữ, Tư Duy Phản Biện & Hóa Giải Thị Phi",
    "subtitle": "Cách biến năng lượng Ám Tinh của Cự Môn thành vũ khí sắc bén trong luật pháp, giảng dạy, truyền thông và thương thuyết.",
    "isFreePreview": false,
    "duration": "18:55",
    "relatedStars": [
      "Cự Môn",
      "Thái Dương",
      "Thiên Cơ",
      "Thiên Đồng"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Cách biến năng lượng Ám Tinh của Cự Môn thành vũ khí sắc bén trong luật pháp, giảng dạy, truyền thông và thương thuyết.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Cách biến năng lượng Ám Tinh của Cự Môn thành vũ khí sắc bén trong luật pháp, giảng dạy, truyền thông và thương thuyết."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Tại sao gọi Cự Môn là Ám Tinh? Hiểu đúng để không sợ Cự Môn",
        "transcript": ""
      },
      {
        "time": "06:45",
        "title": "Cách cục Thạch Trung Ẩn Ngọc (Cự Môn tại Tý Ngọ)",
        "transcript": ""
      },
      {
        "time": "13:20",
        "title": "Cách dùng nghề nghiệp liên quan đến Khẩu Tài để hóa giải thị phi của Cự Môn",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-13",
    "number": 13,
    "moduleId": 2,
    "title": "Sao Thiên Tướng: Ấn Tinh Trọng Tín, Phò Tá Cấp Cao & Giáp Biên",
    "subtitle": "Vì sao xem Thiên Tướng bắt buộc phải xem hai cung kề bên là Tài Ấm Giáp Ấn hay Hình Kỵ Giáp Ấn?",
    "isFreePreview": false,
    "duration": "18:30",
    "relatedStars": [
      "Thiên Tướng",
      "Thiên Phủ",
      "Tử Vi",
      "Vũ Khúc",
      "Liêm Trinh"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Vì sao xem Thiên Tướng bắt buộc phải xem hai cung kề bên là Tài Ấm Giáp Ấn hay Hình Kỵ Giáp Ấn?",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Vì sao xem Thiên Tướng bắt buộc phải xem hai cung kề bên là Tài Ấm Giáp Ấn hay Hình Kỵ Giáp Ấn?"
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Thiên Tướng: Con dấu quyền lực và tinh thần hiệp nghĩa",
        "transcript": ""
      },
      {
        "time": "06:20",
        "title": "Bí quyết đọc Giáp Cung của Thiên Tướng: Tài Ấm Giáp Ấn và Hình Kỵ Giáp Ấn",
        "transcript": ""
      },
      {
        "time": "12:50",
        "title": "Tại sao Thiên Tướng rất kỵ gặp sao Triệt?",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-14",
    "number": 14,
    "moduleId": 2,
    "title": "Sao Thiên Lương: Ấm Tinh Che Chở, Học Thuật Y Giáo & Nguyên Tắc Đạo Đức",
    "subtitle": "Ngôi sao của người thầy, người bác sĩ, sự trường thọ và lý do Thiên Lương không ưa đứng ra đầu cơ tiền bạc.",
    "isFreePreview": false,
    "duration": "18:10",
    "relatedStars": [
      "Thiên Lương",
      "Thái Dương",
      "Thiên Cơ",
      "Thiên Đồng"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Ngôi sao của người thầy, người bác sĩ, sự trường thọ và lý do Thiên Lương không ưa đứng ra đầu cơ tiền bạc.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Ngôi sao của người thầy, người bác sĩ, sự trường thọ và lý do Thiên Lương không ưa đứng ra đầu cơ tiền bạc."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Thiên Lương: Hình tượng người Thầy giáo, Thầy thuốc và bậc Trưởng bối",
        "transcript": ""
      },
      {
        "time": "06:30",
        "title": "Năng lực Giải Ách của Thiên Lương: Gặp dữ hóa lành",
        "transcript": ""
      },
      {
        "time": "12:40",
        "title": "Vì sao Thiên Lương hợp làm Chuyên gia hơn là Đầu cơ lướt sóng?",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-15",
    "number": 15,
    "moduleId": 2,
    "title": "Sao Thất Sát: Tướng Tinh Khai Phá, Quyết Đoán Thương Trường & Biến Động Lớn",
    "subtitle": "Thanh gươm nguyên soái trên lá số: độc lập, can trường, dám đi vào thị trường khó để lập đại công.",
    "isFreePreview": false,
    "duration": "20:15",
    "relatedStars": [
      "Thất Sát",
      "Tử Vi",
      "Vũ Khúc",
      "Liêm Trinh",
      "Phá Quân",
      "Tham Lang"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Thanh gươm nguyên soái trên lá số: độc lập, can trường, dám đi vào thị trường khó để lập đại công.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Thanh gươm nguyên soái trên lá số: độc lập, can trường, dám đi vào thị trường khó để lập đại công."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Thất Sát: Vị tướng ngoài biên ải — Tiền trảm hậu tấu",
        "transcript": ""
      },
      {
        "time": "06:50",
        "title": "Thất Sát Triều Đẩu và Thất Sát Ngưỡng Đẩu (Dần, Thân, Tý, Ngọ)",
        "transcript": ""
      },
      {
        "time": "13:30",
        "title": "Tại sao cuộc đời người mệnh Thất Sát luôn có ít nhất một lần đại biến đổi?",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-16",
    "number": 16,
    "moduleId": 2,
    "title": "Sao Phá Quân: Tiên Phong Đập Cũ Xây Mới, Hao Tinh & Điểm Bùng Nổ",
    "subtitle": "Vì sao Phá Quân luôn đi trước thời đại, dám phá bỏ lối mòn cũ để kiến tạo cơ nghiệp mới?",
    "isFreePreview": false,
    "duration": "19:20",
    "relatedStars": [
      "Phá Quân",
      "Tử Vi",
      "Vũ Khúc",
      "Liêm Trinh",
      "Thất Sát",
      "Tham Lang"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Vì sao Phá Quân luôn đi trước thời đại, dám phá bỏ lối mòn cũ để kiến tạo cơ nghiệp mới?",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Vì sao Phá Quân luôn đi trước thời đại, dám phá bỏ lối mòn cũ để kiến tạo cơ nghiệp mới?"
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Phá Quân: Đội quân tiên phong mở đường trên lá số",
        "transcript": ""
      },
      {
        "time": "06:45",
        "title": "Anh Tinh Nhập Miếu: Phá Quân độc thủ tại Tý và Ngọ",
        "transcript": ""
      },
      {
        "time": "13:15",
        "title": "Tại sao Phá Quân rất cần Hóa Lộc và Lộc Tồn nhưng lại kỵ Văn Xương, Văn Khúc?",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-17",
    "number": 17,
    "moduleId": 3,
    "title": "Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ): Động Cơ Kích Hoạt Lá Số",
    "subtitle": "Cách thuộc lòng bảng Tứ Hóa 10 Thiên Can và giải mã chính xác Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ tại từng cung.",
    "isFreePreview": false,
    "duration": "22:10",
    "relatedStars": [
      "Hóa Lộc",
      "Hóa Quyền",
      "Hóa Khoa",
      "Hóa Kỵ",
      "Lộc Tồn"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Cách thuộc lòng bảng Tứ Hóa 10 Thiên Can và giải mã chính xác Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ tại từng cung.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Cách thuộc lòng bảng Tứ Hóa 10 Thiên Can và giải mã chính xác Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ tại từng cung."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Vì sao cao thủ Tử Vi luôn tìm 4 sao Tứ Hóa đầu tiên trên lá số?",
        "transcript": ""
      },
      {
        "time": "08:15",
        "title": "Khẩu quyết nhớ nhanh Bảng Tứ Hóa của 10 Thiên Can",
        "transcript": ""
      },
      {
        "time": "15:40",
        "title": "Bí mật về Hóa Kỵ: Khi nào Hóa Kỵ lại làm nên chuyên gia đại tài?",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-18",
    "number": 18,
    "moduleId": 3,
    "title": "Lục Sát Tinh (Kình Đà, Không Kiếp, Hỏa Linh): Khi Nào Phát Lớn, Khi Nào Cần Thận Trọng?",
    "subtitle": "Giải mã sức mạnh bùng nổ của 6 ngôi sao Sát tinh khi đắc địa và nguyên tắc quản trị rủi ro khi hãm địa.",
    "isFreePreview": false,
    "duration": "21:00",
    "relatedStars": [
      "Kình Dương",
      "Đà La",
      "Địa Không",
      "Địa Kiếp",
      "Hỏa Tinh",
      "Linh Tinh"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Giải mã sức mạnh bùng nổ của 6 ngôi sao Sát tinh khi đắc địa và nguyên tắc quản trị rủi ro khi hãm địa.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Giải mã sức mạnh bùng nổ của 6 ngôi sao Sát tinh khi đắc địa và nguyên tắc quản trị rủi ro khi hãm địa."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Phân biệt rõ 3 cặp Sát tinh: Kình Đà, Không Kiếp và Hỏa Linh",
        "transcript": ""
      },
      {
        "time": "07:40",
        "title": "Khi nào Lục Sát Tinh giúp con người làm giàu đột biến?",
        "transcript": ""
      },
      {
        "time": "14:50",
        "title": "Nguyên tắc giữ tiền cho người có Không Kiếp, Hỏa Linh tại Tài Bạch",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-19",
    "number": 19,
    "moduleId": 3,
    "title": "Lục Cát Tinh (Tả Hữu, Xương Khúc, Khôi Việt) & Bộ Đào Hoa – Hồng Loan – Thiên Hỷ",
    "subtitle": "Cách nhận diện quý nhân nâng đỡ, năng lực khoa bảng và nhân duyên tình cảm – khách hàng trên lá số.",
    "isFreePreview": false,
    "duration": "19:10",
    "relatedStars": [
      "Tả Phù",
      "Hữu Bật",
      "Văn Xương",
      "Văn Khúc",
      "Thiên Khôi",
      "Thiên Việt",
      "Đào Hoa",
      "Hồng Loan",
      "Thiên Hỷ"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Cách nhận diện quý nhân nâng đỡ, năng lực khoa bảng và nhân duyên tình cảm – khách hàng trên lá số.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Cách nhận diện quý nhân nâng đỡ, năng lực khoa bảng và nhân duyên tình cảm – khách hàng trên lá số."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Phân biệt chính xác vai trò của Tả Hữu, Xương Khúc và Khôi Việt",
        "transcript": ""
      },
      {
        "time": "07:10",
        "title": "Tam Minh: Đào Hoa, Hồng Loan và Thiên Hỷ trong tình duyên và kinh doanh",
        "transcript": ""
      },
      {
        "time": "13:30",
        "title": "Cách phối hợp Lục Cát và Đào Hồng khi chọn cộng sự và xây dựng sự nghiệp",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-20",
    "number": 20,
    "moduleId": 3,
    "title": "Vòng Thái Tuế, Vòng Lộc Tồn & Cơ Chế Đổi Chiều Của Tuần – Triệt",
    "subtitle": "Cách đọc 4 tam hợp vòng Thái Tuế, giữ lộc của Lộc Tồn và phân biệt rõ Tuần Không với Triệt Lộ.",
    "isFreePreview": false,
    "duration": "21:30",
    "relatedStars": [
      "Thái Tuế",
      "Bạch Hổ",
      "Quan Phù",
      "Tang Môn",
      "Tuế Phá",
      "Thiếu Dương",
      "Lộc Tồn",
      "Thiên Mã"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Cách đọc 4 tam hợp vòng Thái Tuế, giữ lộc của Lộc Tồn và phân biệt rõ Tuần Không với Triệt Lộ.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Cách đọc 4 tam hợp vòng Thái Tuế, giữ lộc của Lộc Tồn và phân biệt rõ Tuần Không với Triệt Lộ."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Bốn nhóm người trong Vòng Thái Tuế: Chính trực, Khéo léo, Nhẫn nhịn và Phản kháng",
        "transcript": ""
      },
      {
        "time": "08:20",
        "title": "Lộc Tồn và cách cục Lộc Mã Giao Trì",
        "transcript": ""
      },
      {
        "time": "15:10",
        "title": "Tuần và Triệt: Khi nào tháo gỡ bế tắc, khi nào cản trở?",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-21",
    "number": 21,
    "moduleId": 4,
    "title": "Cách Cục Lớn (Phần 1): Tử Phủ Vũ Tướng & Cơ Nguyệt Đồng Lương",
    "subtitle": "So sánh thế đứng Làm Chủ Quản Trị (Tử Phủ Vũ Tướng) và thế đứng Chuyên Gia Tham Mưu (Cơ Nguyệt Đồng Lương).",
    "isFreePreview": false,
    "duration": "20:30",
    "relatedStars": [
      "Tử Vi",
      "Thiên Phủ",
      "Vũ Khúc",
      "Thiên Tướng",
      "Thiên Cơ",
      "Thái Âm",
      "Thiên Đồng",
      "Thiên Lương"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "So sánh thế đứng Làm Chủ Quản Trị (Tử Phủ Vũ Tướng) và thế đứng Chuyên Gia Tham Mưu (Cơ Nguyệt Đồng Lương).",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "So sánh thế đứng Làm Chủ Quản Trị (Tử Phủ Vũ Tướng) và thế đứng Chuyên Gia Tham Mưu (Cơ Nguyệt Đồng Lương)."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Bức tranh tổng thể của nhóm Tĩnh Tinh: Tử Phủ Vũ Tướng và Cơ Nguyệt Đồng Lương",
        "transcript": ""
      },
      {
        "time": "07:20",
        "title": "Tử Phủ Vũ Tướng: Bộ tứ quyền lực của Quản trị và Tài chính",
        "transcript": ""
      },
      {
        "time": "14:10",
        "title": "Cơ Nguyệt Đồng Lương: Hiểu đúng câu phú Tác Lại Nhân trong thời đại mới",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-22",
    "number": 22,
    "moduleId": 4,
    "title": "Cách Cục Lớn (Phần 2): Sát Phá Tham & Cự Nhật",
    "subtitle": "Thế đứng Khai Phá Thương Trường của Sát Phá Tham và thế đứng Ngoại Giao – Ngôn Ngữ của Cự Nhật.",
    "isFreePreview": false,
    "duration": "20:15",
    "relatedStars": [
      "Thất Sát",
      "Phá Quân",
      "Tham Lang",
      "Cự Môn",
      "Thái Dương"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Thế đứng Khai Phá Thương Trường của Sát Phá Tham và thế đứng Ngoại Giao – Ngôn Ngữ của Cự Nhật.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Thế đứng Khai Phá Thương Trường của Sát Phá Tham và thế đứng Ngoại Giao – Ngôn Ngữ của Cự Nhật."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Sát Phá Tham: Trụ cột của giới khởi nghiệp và kinh doanh thực chiến",
        "transcript": ""
      },
      {
        "time": "07:15",
        "title": "Điểm khác biệt: Sát Phá Tham chịu được Sát tinh tốt hơn các bộ khác",
        "transcript": ""
      },
      {
        "time": "13:50",
        "title": "Cách cục Cự Nhật: Ánh mặt trời soi sáng tài năng ngôn ngữ",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-23",
    "number": 23,
    "moduleId": 4,
    "title": "Thực Chiến Luận 4 Cung Trọng Điểm: Tài Bạch, Quan Lộc, Điền Trạch & Phu Thê",
    "subtitle": "Cách phối hợp các cung để trả lời 4 câu hỏi lớn nhất của khách hàng: Tiền bạc, Sự nghiệp, Nhà đất và Hôn nhân.",
    "isFreePreview": false,
    "duration": "21:45",
    "relatedStars": [
      "Vũ Khúc",
      "Thái Âm",
      "Thiên Phủ",
      "Lộc Tồn",
      "Thái Dương",
      "Thiên Tướng",
      "Hồng Loan"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Cách phối hợp các cung để trả lời 4 câu hỏi lớn nhất của khách hàng: Tiền bạc, Sự nghiệp, Nhà đất và Hôn nhân.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Cách phối hợp các cung để trả lời 4 câu hỏi lớn nhất của khách hàng: Tiền bạc, Sự nghiệp, Nhà đất và Hôn nhân."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Cặp bài trùng Tài Bạch (Dòng tiền) và Điền Trạch (Két sắt tích sản)",
        "transcript": ""
      },
      {
        "time": "07:50",
        "title": "Trục Quan Lộc (Sự nghiệp) và Phu Thê (Hôn nhân) chiếu thẳng vào nhau",
        "transcript": ""
      },
      {
        "time": "14:30",
        "title": "Vai trò gốc rễ của cung Phúc Đức đối với cả Tài Bạch và Hôn Nhân",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  },
  {
    "id": "bai-24",
    "number": 24,
    "moduleId": 4,
    "title": "Quy Trình 5 Bước Chấm Hạn Năm (Lưu Niên) & 12 Tháng (Lưu Nguyệt) Chuẩn Thực Chứng",
    "subtitle": "Tổng kết toàn bộ khóa học thành quy trình 5 bước rõ ràng để tự xem vận hạn hàng năm và chọn thời điểm hành động.",
    "isFreePreview": false,
    "duration": "23:10",
    "relatedStars": [
      "Thái Tuế",
      "Lộc Tồn",
      "Thiên Mã",
      "Kình Dương",
      "Đà La",
      "Thiên Khốc",
      "Thiên Hư",
      "Hóa Lộc",
      "Hóa Kỵ"
    ],
    "flashcard": {
      "nguHanh": "Nội dung dành cho học viên đã mở khóa",
      "hoaKhi": "Mở khóa để xem khẩu quyết chi tiết",
      "chuSu": "Tổng kết toàn bộ khóa học thành quy trình 5 bước rõ ràng để tự xem vận hạn hàng năm và chọn thời điểm hành động.",
      "dacHam": "Mở khóa để xem bảng Miếu – Vượng – Đắc – Hãm đầy đủ",
      "cauPhu": "Mở khóa khóa học để xem trọn bộ khẩu quyết bí truyền của Thầy Tôn.",
      "cotLoi": "Tổng kết toàn bộ khóa học thành quy trình 5 bước rõ ràng để tự xem vận hạn hàng năm và chọn thời điểm hành động."
    },
    "podcastChapters": [
      {
        "time": "00:00",
        "title": "Tổng kết quy trình 5 bước đọc vận hạn thực chiến của Thầy Tôn",
        "transcript": ""
      },
      {
        "time": "06:30",
        "title": "Bước 1, Bước 2 và Bước 3: Định vị Đại vận, Cung Lưu Thái Tuế và Cung Tiểu vận",
        "transcript": ""
      },
      {
        "time": "13:45",
        "title": "Bước 4 và Bước 5: Kích hoạt bộ Sao Lưu và rà soát 12 tháng Lưu Nguyệt",
        "transcript": ""
      },
      {
        "time": "19:20",
        "title": "Lời nhắn nhủ của Thầy Tôn: Học Tử Vi để Làm Chủ Vận Mệnh",
        "transcript": ""
      }
    ],
    "contentHtml": ""
  }
];
