export interface PodcastChapter {
  time: string;
  title: string;
  transcript: string;
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
  title: 'Khóa Học Tử Vi Đẩu Số Thực Chiến Cùng Thầy Tôn',
  subtitle: 'Làm Chủ 14 Chính Tinh, Phụ Tinh, Cách Cục & Quy Trình Luận Giải Vận Hạn Qua Podcast Và Giáo Trình Tương Tác',
  price: 699000,
  originalPrice: 1490000,
  totalLessons: 24,
  totalHours: '8+ giờ Podcast & 24 Chuyên khảo',
};

export const COURSE_MODULES: CourseModule[] = [
  {
    id: 1,
    badge: 'HỌC PHẦN 1 • NỀN TẢNG & TƯ DUY CỐT LÕI',
    title: 'Nền Tảng Âm Dương, Ngũ Hành, Cục & Tư Duy Đọc Lá Số Chuẩn Logic',
    description: 'Hiểu đúng bộ khung vận hành của lá số Tử Vi: quy tắc Âm Dương thuận nghịch, tương quan Mệnh - Cục, Tam Hợp - Xung Chiếu và cách phân biệt gốc Tiên Thiên với vận Hậu Thiên.',
  },
  {
    id: 2,
    badge: 'HỌC PHẦN 2 • 14 CHÍNH TINH CHUYÊN SÂU',
    title: 'Giải Mã Chi Tiết 14 Chính Tinh: Tính Chất, Tâm Lý, Hình Tướng & Đắc Hãm',
    description: 'Đi sâu vào từng ngôi sao trong vòng Tử Vi và vòng Thiên Phủ: bản chất ngũ hành, điểm mạnh - điểm khuyết, dấu hiệu nhận diện ngoài đời và phản ứng khi gặp Cát/Sát tinh.',
  },
  {
    id: 3,
    badge: 'HỌC PHẦN 3 • PHỤ TINH, TỨ HÓA & VÒNG SAO',
    title: 'Hệ Thống Lục Cát, Lục Sát, Tứ Hóa, Thái Tuế, Lộc Tồn & Tuần Triệt',
    description: 'Nắm vững các bộ sao quyết định成敗 (thành bại) thực tế của lá số: Tứ Hóa kích hoạt biến cố, Lục Sát phát dã như lôi, Lục Cát trợ lực và cơ chế đảo chiều của Tuần - Triệt.',
  },
  {
    id: 4,
    badge: 'HỌC PHẦN 4 • CÁCH CỤC LỚN & LUẬN VẬN HẠN',
    title: '4 Cách Cục Lớn & Quy Trình 5 Bước Chấm Hạn Năm - Tháng Thực Chiến',
    description: 'Tổng hợp toàn bộ kiến thức vào thực hành: nhận diện 4 thế đứng lớn (Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương, Cự Nhật) và quy trình đọc Đại vận, Tiểu vận.',
  },
];

export const COURSE_LESSONS: CourseLesson[] = [
  {
    id: 'bai-1',
    number: 1,
    moduleId: 1,
    title: 'Tư Duy Đọc Lá Số Chuẩn Logic: Âm Dương, Ngũ Hành, Cục & Tam Hợp – Xung Chiếu',
    subtitle: 'Vì sao không bao giờ được nhìn một sao đơn lẻ để phán tốt xấu? Quy tắc đọc 3 phương 4 chính.',
    isFreePreview: true,
    duration: '19:30',
    relatedStars: ['Tử Vi', 'Thiên Phủ', 'Thái Dương', 'Thái Âm'],
    flashcard: {
      nguHanh: 'Kim • Mộc • Thủy • Hỏa • Thổ (Tương sinh & Tương khắc)',
      hoaKhi: 'Nền tảng Mệnh - Cục - Thân',
      chuSu: 'Khung xương sống định hình toàn bộ 12 cung trên lá số',
      dacHam: 'Xét Âm Dương thuận lý / nghịch lý và Cục sinh Mệnh hay Mệnh khắc Cục',
      cauPhu: 'Độc thủ bất thành cách — Một sao đơn lẻ không bao giờ làm nên cách cục lớn.',
      cotLoi: 'Luôn đọc cung bản vị (40%) kết hợp cung Xung chiếu (30%) và hai cung Tam hợp (30%).',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Sai lầm phổ biến nhất của người mới học Tử Vi',
        transcript: 'Chào mừng các bạn đến với Học Viện Tử Vi Đẩu Số Thực Chiến cùng Thầy Tôn. Ở bài mở đầu này, chúng ta giải quyết ngay sai lầm lớn nhất của 90% người mới xem lá số: đó là nhìn thấy một ngôi sao tên nghe rất đẹp như Tử Vi, Thiên Phủ liền mừng rỡ, hoặc vừa thấy Kình Dương, Địa Không, Hóa Kỵ đã vội hoang mang lo sợ. Trong Tử Vi Đẩu Số, một ngôi sao đứng một mình giống như một cầu thủ đứng giữa sân bóng trống, chưa thể tạo nên bàn thắng hay thất bại. Giá trị thực của sao phụ thuộc vào 3 yếu tố: vị trí đắc hãm tại 12 địa chi, tổ hợp các sao hội họp trong Tam hợp - Xung chiếu, và thời điểm Đại vận đi qua.',
      },
      {
        time: '04:45',
        title: 'Tương quan giữa Bản Mệnh và Cục: Nội lực và Môi trường',
        transcript: 'Khi nhìn vào thiên bàn ở giữa lá số, hai dòng các bạn cần đọc đầu tiên là Bản Mệnh ngũ hành nạp âm và Cục. Hãy hình dung Bản Mệnh là chiếc xe của bạn, còn Cục là mặt đường và môi trường xã hội. Nếu Cục sinh Mệnh, ví dụ Thủy Nhị Cục sinh Mệnh Mộc, bạn đi ra đời dễ gặp thời thế thuận lợi, môi trường nâng đỡ. Nếu Mệnh sinh Cục, bạn là người dốc sức cống hiến cho tập thể và công việc. Nếu Mệnh khắc Cục, bạn luôn muốn làm chủ hoàn cảnh và tự mở lối đi riêng. Còn nếu Cục khắc Mệnh, giai đoạn đầu đời thường phải vượt qua thử thách từ hoàn cảnh để rèn bản lĩnh.',
      },
      {
        time: '10:15',
        title: 'Công thức 40 - 30 - 30 khi đọc Tam Hợp và Xung Chiếu',
        transcript: 'Mỗi cung trên lá số luôn chịu sự chi phối trực tiếp của 3 cung khác tạo thành thế Tam Phương Tứ Chính. Lấy cung Mệnh làm gốc thì cung Mệnh chiếm khoảng 40% trọng số; cung Thiên Di xung chiếu đối diện chiếm 30% trọng số vì nó phản ánh môi trường bên ngoài tác động trực tiếp vào bạn; và hai cung Tài Bạch, Quan Lộc nằm trong tam hợp chiếm 30% còn lại. Do đó, dù cung Mệnh Vô Chính Diệu nhưng cung Thiên Di và Tam hợp sáng sủa, có Tuần Triệt trấn giữ đúng chỗ thì vẫn là lá số cực kỳ bản lĩnh.',
      },
      {
        time: '15:20',
        title: 'Mệnh quản tiền vận, Thân quản hậu vận từ mốc 30 tuổi',
        transcript: 'Một nguyên tắc sống còn nữa là phải luôn xem cung Thân cư ở đâu. Trước 30 tuổi, con người hành xử theo bản năng của cung Mệnh. Sau 30 tuổi, suy nghĩ, ưu tiên và thành tựu của bạn dịch chuyển mạnh về cung an Thân. Thân cư Tài Bạch thì nửa đời sau lấy dòng tiền làm trọng tâm; Thân cư Quan Lộc thì lấy danh vị và sự nghiệp làm lẽ sống; Thân cư Phúc Đức hay Phu Thê thì hậu vận đặt nặng sự bình an tinh thần và gia đạo.',
      },
    ],
    contentHtml: `
      <h2>1. Ba Tầng Nền Tảng Bắt Buộc Phải Xem Trước Khi Đọc Từng Sao</h2>
      <p>Trước khi đi vào tính chất của 14 chính tinh hay hơn 100 phụ tinh, người học Tử Vi bài bản cần lập trình thói quen nhìn <strong>tổng thể Thiên bàn và Tam phương Tứ chính</strong> theo đúng thứ tự 3 bước:</p>
      <ul>
        <li><strong>Bước 1 — Xét Âm Dương Thuận Lý hay Nghịch Lý:</strong> Người tuổi Dương (Giáp, Bính, Mậu, Canh, Nhâm) sinh vào cung Dương (Tý, Dần, Thìn, Ngọ, Thân, Tuất) hoặc người tuổi Âm sinh vào cung Âm gọi là <strong>Âm Dương thuận lý</strong> — cuộc đời thường đi theo lộ trình tuần tự, ít bước ngoặt gãy khúc. Ngược lại, <strong>Âm Dương nghịch lý</strong> thường phải tự lực cánh sinh, trải qua một vài lần đổi hướng lớn mới định hình được cơ nghiệp.</li>
        <li><strong>Bước 2 — Xét Tương Quan Giữa Mệnh và Cục:</strong> Mệnh là năng lực nội tại của đương số; Cục (Thủy nhị cục, Mộc tam cục, Kim tứ cục, Thổ ngũ cục, Hỏa lục cục) là hoàn cảnh khách quan và số tuổi bắt đầu bước vào Đại vận đầu tiên.</li>
        <li><strong>Bước 3 — Xét Trục Mệnh – Thân và Tam Hợp Mệnh – Tài – Quan:</strong> Mệnh là gốc rễ tính cách; Tài Bạch là phương thức tạo ra dòng tiền; Quan Lộc là cách thức vận hành công việc; Thiên Di là mặt trận đối ngoại.</li>
      </ul>
      <h2>2. Bảng Quy Chiếu Tương Quan Mệnh – Cục Trong Thực Chiến</h2>
      <table>
        <thead>
          <tr>
            <th>Tương quan Mệnh &amp; Cục</th>
            <th>Bản chất vận hành</th>
            <th>Chiến lược phát triển phù hợp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Cục sinh Mệnh</strong></td>
            <td>Hoàn cảnh, thời thế và quý nhân dễ hỗ trợ bản thân</td>
            <td>Tận dụng tốt đòn bẩy tập thể, mở rộng mạng lưới hợp tác sớm</td>
          </tr>
          <tr>
            <td><strong>Mệnh Cục Tỷ Hòa</strong></td>
            <td>Bản thân hòa nhập nhanh với môi trường xung quanh</td>
            <td>Phát triển bền vững theo đúng chuyên môn cốt lõi</td>
          </tr>
          <tr>
            <td><strong>Mệnh sinh Cục</strong></td>
            <td>Bản thân chủ động cho đi, dốc tâm huyết cho công việc và xã hội</td>
            <td>Làm nghề chuyên gia, giáo dục, dịch vụ, quản trị nhân sự rất đắc cách</td>
          </tr>
          <tr>
            <td><strong>Mệnh khắc Cục</strong></td>
            <td>Ý chí tự chủ cao, muốn tự kiến tạo quy tắc riêng</td>
            <td>Hợp khởi nghiệp, cải tổ quy trình hoặc làm việc độc lập</td>
          </tr>
          <tr>
            <td><strong>Cục khắc Mệnh</strong></td>
            <td>Môi trường thử thách nhiều ở tiền vận, càng rèn càng cứng cáp</td>
            <td>Lấy chuyên môn sâu và kỷ luật tài chính làm lá chắn vượt nghịch cảnh</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-2',
    number: 2,
    moduleId: 1,
    title: 'Sao Tử Vi (Bắc Đẩu Đế Tinh): Khi Nào Là Minh Quân, Khi Nào Là Cô Quân?',
    subtitle: 'Giải phẫu ngôi sao đứng đầu 14 chính tinh: uy quyền lãnh đạo, điều kiện cần có Tả Hữu và cách hóa giải thế Đế Ngộ Hung Đồ.',
    isFreePreview: true,
    duration: '21:15',
    relatedStars: ['Tử Vi', 'Tả Phù', 'Hữu Bật', 'Thiên Phủ', 'Thiên Tướng'],
    flashcard: {
      nguHanh: 'Dương Thổ (Kỷ Thổ — Đất cao nguyên mẫu mực)',
      hoaKhi: 'Tôn Quý & Đế Tinh (Ngôi sao chủ về uy quyền, tổ chức và dẫn dắt)',
      chuSu: 'Chủ Quan Lộc, tước vị, năng lực điều hành và giải ách chế sát',
      dacHam: 'Miếu địa: Tỵ, Ngọ, Dần, Thân • Vượng địa: Thìn, Tuất • Đắc địa: Sửu, Mùi • Bình hòa: Hợi, Tý, Mão, Dậu',
      cauPhu: 'Tử Vi cư Ngọ vô Hình Kỵ, Giáp Đinh Kỷ mệnh chí công khanh.',
      cotLoi: 'Tử Vi bắt buộc phải có quần thần hội chiếu (Tả Phù, Hữu Bật, Văn Xương, Văn Khúc, Khôi Việt) mới phát huy hết uy quyền lãnh đạo.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Bản chất Dương Thổ và khí chất Đế Tinh của sao Tử Vi',
        transcript: 'Sao Tử Vi là ngôi sao mở đầu cho vòng Bắc Đẩu, mang ngũ hành Dương Thổ, hóa khí là Tôn Quý. Người có sao Tử Vi thủ Mệnh ở vị trí Miếu Vượng thường có phong thái đĩnh đạc, tự trọng cao, thích sắp xếp, tổ chức và không thích bị người khác áp đặt một cách vô lý. Tuy nhiên, hiểu đúng sao Tử Vi không phải là ai có Tử Vi cũng làm quan to hay làm tổng giám đốc. Tử Vi là hình tượng của một vị vua; mà một vị vua có thực quyền hay không hoàn toàn phụ thuộc vào việc xung quanh có bề tôi giỏi hay không.',
      },
      {
        time: '06:10',
        title: 'Tử Vi cần Tả Phù, Hữu Bật như vua cần tể tướng',
        transcript: 'Điều kiện sống còn của sao Tử Vi là phải hội hợp được Lục Cát Tinh, đặc biệt là cặp Tả Phù - Hữu Bật, Văn Xương - Văn Khúc, Thiên Khôi - Thiên Việt hoặc Hóa Lộc, Hóa Quyền, Hóa Khoa. Khi Tử Vi có Tả Hữu phò tá gọi là Quân Thần Khánh Hội: người này đi tới đâu cũng có cộng sự đắc lực, biết dùng người và dễ nắm vị trí quản lý cấp cao. Ngược lại, nếu Tử Vi đứng trơ trọi không có một sao phụ tá nào mà lại gặp Tuần Triệt hoặc Cô Thần, Quả Tú thì gọi là Cô Quân — tức là ông vua cô độc, việc gì cũng phải tự ôm vào người, tâm tính dễ cao ngạo mà thực quyền lại mỏng.',
      },
      {
        time: '12:40',
        title: 'Các thế đứng của Tử Vi trên 12 địa chi',
        transcript: 'Tại hai cung Tý và Ngọ, Tử Vi đứng độc thủ. Đặc biệt Tử Vi cư Ngọ là thế Cực Hướng Ly Minh — vua ngồi ngai vàng nhìn về phương Nam rực rỡ nhất, rất hợp với người tuổi Giáp, Đinh, Kỷ khi không bị Kình Dương, Hóa Kỵ phá cách. Tại Dần và Thân, Tử Vi đồng cung với Thiên Phủ tạo thành bộ Tử Phủ đồng cung cực kỳ vững chãi cả về quyền lẫn tài. Tại Thìn và Tuất, Tử Vi đi cùng Thiên Tướng; tại Sửu và Mùi đi cùng Phá Quân; tại Mão và Dậu đi cùng Tham Lang; còn tại Tỵ và Hợi đi cùng Thất Sát tạo thành cách Tử Sát uy quyền.',
      },
      {
        time: '17:30',
        title: 'Khi Tử Vi gặp Không Kiếp, Kình Đà: Đế Ngộ Hung Đồ',
        transcript: 'Nếu Tử Vi không có Tả Hữu mà lại hội họp Địa Không, Địa Kiếp, Kình Dương, Đà La thì cổ nhân gọi là Đế Ngộ Hung Đồ — vua gặp đám loạn thần. Người mang cách này trong công việc dễ dùng tiểu xảo, quyết định nóng vội hoặc bị cấp dưới phản trắc. Tuy nhiên, nếu Tử Vi đồng cung Thất Sát tại Tỵ Hợi gặp thêm Hóa Quyền thì lại chế ngự được sát tinh để làm tướng cầm quân trên thương trường.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Tính Cốt Lõi Của Sao Tử Vi: Tâm Lý, Hình Tướng &amp; Sự Nghiệp</h2>
      <p><strong>Sao Tử Vi</strong> đứng đầu chòm Bắc Đẩu, thuộc hành <strong>Dương Thổ</strong>. Trong hệ thống 14 chính tinh, Tử Vi không bao giờ rơi vào vị trí Hãm địa hoàn toàn (thấp nhất là Bình hòa tại Tý, Hợi, Mão, Dậu), thể hiện sức che chở và khả năng tự cân bằng rất lớn:</p>
      <ul>
        <li><strong>Về tâm lý &amp; tính cách:</strong> Trọng danh dự, có tư duy hệ thống, thích nhìn bức tranh tổng thể, bao dung nhưng đôi khi cả nể, ưa nghe lời khen ngợi (nếu thiếu các sao sắc bén đi kèm).</li>
        <li><strong>Về năng lực công việc:</strong> Xuất sắc trong vai trò hoạch định, điều phối nhân sự, quản lý dự án, điều hành doanh nghiệp hoặc làm việc trong các tổ chức lớn.</li>
        <li><strong>Năng lực giải ách:</strong> Tử Vi có khả năng chế giải bớt tính hung hãn của Hỏa Tinh, Linh Tinh và biến Thất Sát thành quyền uy (<em>Hóa Sát vi Quyền</em>).</li>
      </ul>
      <h2>2. Bảng Phân Tích 6 Thế Đứng Của Sao Tử Vi Trên 12 Cung Địa Chi</h2>
      <table>
        <thead>
          <tr>
            <th>Vị trí Địa Chi</th>
            <th>Tổ hợp Chính Tinh</th>
            <th>Đặc điểm thực chiến nổi bật</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tý • Ngọ</strong></td>
            <td>Tử Vi độc thủ</td>
            <td>Tại Ngọ là <em>Cực Hướng Ly Minh</em> rất sáng; cần Tả Hữu, Khôi Việt để nắm vị trí đứng đầu. Tại Tý trầm tĩnh hơn, thực tế hơn.</td>
          </tr>
          <tr>
            <td><strong>Dần • Thân</strong></td>
            <td>Tử Vi – Thiên Phủ</td>
            <td>Hai đế tinh Bắc – Nam Đẩu hội họp: tài vận và quan vận đều dày, hợp quản trị tài chính, ngân hàng, bất động sản lớn.</td>
          </tr>
          <tr>
            <td><strong>Thìn • Tuất</strong></td>
            <td>Tử Vi – Thiên Tướng</td>
            <td>Đóng tại La Võng nên lúc trẻ phải nỗ lực bứt phá lớn; có tính quyết đoán, dám cải cách để lập danh.</td>
          </tr>
          <tr>
            <td><strong>Tỵ • Hợi</strong></td>
            <td>Tử Vi – Thất Sát</td>
            <td><em>Tử Sát đồng lâm</em> — vừa có uy của vua vừa có kiếm của tướng; cực hợp làm chủ doanh nghiệp, điều hành sản xuất, thương mại.</td>
          </tr>
          <tr>
            <td><strong>Sửu • Mùi</strong></td>
            <td>Tử Vi – Phá Quân</td>
            <td>Bản lĩnh khai phá mạnh, thường làm hai nghề song song hoặc trải qua một lần chuyển đổi sự nghiệp lớn rồi mới đại thành.</td>
          </tr>
          <tr>
            <td><strong>Mão • Dậu</strong></td>
            <td>Tử Vi – Tham Lang</td>
            <td><em>Đào Hoa Phạm Chủ</em> nếu gặp thêm nhiều sao tình ái; nhưng nếu gặp Hỏa Linh hoặc Tuần Triệt lại rất giỏi kinh doanh, nghệ thuật, ngoại giao.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-3',
    number: 3,
    moduleId: 1,
    title: 'Quy Tắc Phân Tầng Lá Số: Tiên Thiên (Mệnh – Thân) & Hậu Thiên (Đại Vận – Lưu Niên)',
    subtitle: 'Cách kết nối lá số gốc với dòng thời gian 10 năm và 1 năm để biết chính xác khi nào phát, khi nào phòng thủ.',
    isFreePreview: false,
    duration: '18:20',
    relatedStars: ['Lộc Tồn', 'Thiên Mã', 'Hóa Lộc', 'Hóa Kỵ'],
    flashcard: {
      nguHanh: 'Sự dịch chuyển Ngũ hành của từng cung Đại vận qua 12 địa chi',
      hoaKhi: 'Tiên Thiên vi thể • Hậu Thiên vi dụng',
      chuSu: 'Định thời điểm khởi sự, đầu tư, chuyển việc, kết hôn, mua nhà',
      dacHam: 'Mệnh tốt không bằng Thân tốt, Thân tốt không bằng Đại vận sáng',
      cauPhu: 'Mệnh hảo bất như Thân hảo, Thân hảo bất như Vận hảo.',
      cotLoi: 'Lá số gốc cho biết trần tiềm năng; Đại vận 10 năm quyết định giai đoạn mở khóa tiềm năng đó; Tiểu vận 1 năm chỉ điểm thời khắc xảy ra sự kiện.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Vì sao hai người có Mệnh đẹp như nhau nhưng cuộc đời khác biệt?',
        transcript: 'Trong thực tế tư vấn hơn 18 năm qua, Thầy gặp rất nhiều lá số có cung Mệnh cực đẹp nhưng phải đến ngoài 40 tuổi mới phất lên, trong khi có người cung Mệnh bình thường nhưng từ 25 đến 45 tuổi lại liên tiếp đi vào các cung Đại vận đắc địa nên thành đạt rất sớm. Bí mật nằm ở quy luật Tiên Thiên và Hậu Thiên. Tiên Thiên là 12 cung cố định khi bạn cất tiếng khóc chào đời; còn Hậu Thiên là chiều mũi tên Đại vận 10 năm đi thuận hay đi nghịch qua các cung.',
      },
      {
        time: '06:00',
        title: 'Cách xét chiều đi của Đại vận: Dương Nam Âm Nữ thuận hành',
        transcript: 'Dương Nam và Âm Nữ thì Đại vận 10 năm đi thuận chiều kim đồng hồ từ cung Mệnh sang cung Phụ Mẫu, Phúc Đức, Điền Trạch, Quan Lộc... Ngược lại, Âm Nam và Dương Nữ thì Đại vận đi nghịch chiều kim đồng hồ từ cung Mệnh sang Huynh Đệ, Phu Thê, Tử Tức, Tài Bạch... Chính chiều đi này quyết định việc ở tuổi 30-40 bạn đang bước vào vùng đất của những ngôi sao nào.',
      },
      {
        time: '12:15',
        title: 'Sự giao thoa giữa Đại vận 10 năm và Lưu niên 1 năm',
        transcript: 'Nếu Đại vận 10 năm đang rất đẹp, ví dụ hội Lộc Mã Giao Trì hoặc Tả Hữu Khoa Quyền Lộc, mà năm Lưu niên gặp hạn nhỏ thì chỉ như cơn mưa rào thoáng qua trên đại lộ, khó làm sụp đổ đại cục. Ngược lại, nếu Đại vận 10 năm đang rơi vào thế Không Kiếp Kình Đà Hóa Kỵ trùng trùng, thì dù một năm Lưu niên có sao Lộc chiếu vào cũng không được tất tay vay nợ mở rộng quá đà.',
      },
    ],
    contentHtml: `
      <h2>1. Ba Lớp Thời Gian Trên Một Lá Số Tử Vi</h2>
      <p>Để luận giải chuẩn xác biến cố thực tế, tuyệt đối không bao giờ đọc lá số như một bức ảnh tĩnh mà phải xếp chồng <strong>3 lớp bản đồ thời gian</strong>:</p>
      <ul>
        <li><strong>Lớp 1 — Gốc Tiên Thiên (Mệnh, Thân &amp; 12 Cung cố định):</strong> Cho biết khí chất, năng lực cốt lõi và ngưỡng trần tối đa của đương số.</li>
        <li><strong>Lớp 2 — Đại Vận 10 Năm:</strong> Cho biết bối cảnh chủ đạo của cả thập kỷ. Khi Đại vận đi vào cung nào, cung đó trở thành <em>Mệnh Đại Vận</em>, kéo theo <em>Tài Bạch Đại Vận</em> và <em>Quan Lộc Đại Vận</em> tương ứng.</li>
        <li><strong>Lớp 3 — Tiểu Vận &amp; Lưu Niên (1 Năm) + Lưu Nguyệt (12 Tháng):</strong> Bộ sao Lưu (Lưu Thái Tuế, Lưu Lộc Tồn, Lưu Thiên Mã, Lưu Kình Đà, Lưu Khốc Hư) kích hoạt đúng năm và tháng xảy ra sự kiện.</li>
      </ul>
      <h2>2. Bảng Ma Trận Quyết Định Hành Động Giữa Đại Vận &amp; Lưu Niên</h2>
      <table>
        <thead>
          <tr>
            <th>Trạng thái Đại Vận (10 Năm)</th>
            <th>Trạng thái Lưu Niên (1 Năm)</th>
            <th>Chiến lược hành động thực chiến</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Đại Vận Đắc Cách (Cát)</strong></td>
            <td><strong>Lưu Niên Thuận Lợi (Cát)</strong></td>
            <td>Thời điểm vàng để bứt phá: mở rộng kinh doanh, mua tài sản, thăng tiến mạnh.</td>
          </tr>
          <tr>
            <td><strong>Đại Vận Đắc Cách (Cát)</strong></td>
            <td><strong>Lưu Niên Có Sát Kỵ (Hung)</strong></td>
            <td>Va vấp ngắn hạn trong xu thế đi lên: giữ nhịp độ ổn định, kiểm soát chi phí trong năm đó.</td>
          </tr>
          <tr>
            <td><strong>Đại Vận Nhiều Sát Kỵ (Hung)</strong></td>
            <td><strong>Lưu Niên Có Tài Lộc (Cát)</strong></td>
            <td>Thu lợi nhuận ngắn hạn và cất vào tài sản an toàn; không dùng đòn bẩy nợ vay dài hạn.</td>
          </tr>
          <tr>
            <td><strong>Đại Vận Nhiều Sát Kỵ (Hung)</strong></td>
            <td><strong>Lưu Niên Xung Khắc (Hung)</strong></td>
            <td>Ưu tiên bảo toàn vốn, chăm sóc sức khỏe, tập trung nâng cấp tri thức và chuyên môn.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-4',
    number: 4,
    moduleId: 2,
    title: 'Sao Thiên Cơ: Mưu Sĩ Tham Mưu, Trí Tuệ Biến Hóa & Động Tinh',
    subtitle: 'Ngôi sao của tư duy chiến lược, công nghệ, hoạch định kế hoạch và sự dịch chuyển linh hoạt.',
    isFreePreview: false,
    duration: '19:50',
    relatedStars: ['Thiên Cơ', 'Thiên Lương', 'Thái Âm', 'Cự Môn'],
    flashcard: {
      nguHanh: 'Âm Mộc (Ất Mộc — Cây cỏ mềm dẻo, linh hoạt, thích nghi cực nhanh)',
      hoaKhi: 'Thiện Tinh & Động Tinh (Chủ về trí tuệ, mưu lược, máy móc, biến dịch)',
      chuSu: 'Chủ Huynh Đệ & Tham mưu chiến lược, kỹ thuật, phân tích dữ liệu',
      dacHam: 'Miếu địa: Thìn, Tuất, Mão, Dậu • Vượng địa: Tỵ, Thân • Đắc địa: Tý, Ngọ, Sửu, Mùi • Hãm địa: Dần, Hợi',
      cauPhu: 'Cơ Lương gia hội, thiện đàm binh — Thiên Cơ gặp Thiên Lương là bậc quân sư mưu lược lỗi lạc.',
      cotLoi: 'Thiên Cơ cực mạnh về lập kế hoạch, phân tích và tham mưu nhưng nếu gặp Sát Kỵ dễ suy nghĩ quá nhiều dẫn đến mất ngủ, lo âu.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Bản chất Âm Mộc và Động Tinh của sao Thiên Cơ',
        transcript: 'Nếu sao Tử Vi là vị vua ngồi trên ngai vàng thì sao Thiên Cơ luôn đứng ngay cạnh để làm quân sư tham mưu. Thiên Cơ thuộc hành Âm Mộc, hóa khí là Thiện Tinh nhưng đồng thời cũng là Động Tinh — ngôi sao của sự vận động trí óc không ngừng nghỉ. Người có Thiên Cơ thủ Mệnh thường có đôi mắt linh hoạt, đầu óc nhạy bén với con số, quy trình, công nghệ, phần mềm và chiến lược.',
      },
      {
        time: '06:30',
        title: 'Thiên Cơ đi với Thái Âm, Cự Môn và Thiên Lương',
        transcript: 'Thiên Cơ chỉ kết hợp với 3 ngôi sao khác tạo thành 3 tổ hợp kinh điển: Cơ Nguyệt (Thiên Cơ - Thái Âm tại Dần Thân) thiên về tài chính, bất động sản và thẩm mỹ; Cơ Cự (Thiên Cơ - Cự Môn tại Mão Dậu) cực kỳ sắc bén về ngôn ngữ, luật pháp, thương mại quốc tế; và Cơ Lương (Thiên Cơ - Thiên Lương tại Thìn Tuất) là mẫu hình chuẩn mực của nhà nghiên cứu, giảng dạy, y dược và cố vấn cấp cao.',
      },
      {
        time: '13:45',
        title: 'Điểm yếu cần khắc phục của người mệnh Thiên Cơ',
        transcript: 'Vì đầu óc tính toán quá nhanh và nhìn ra quá nhiều phương án, người mệnh Thiên Cơ nếu thiếu Hóa Quyền hoặc Lộc Tồn giữ chân thì dễ rơi vào trạng thái đứng núi này trông núi nọ, làm nhiều dự án cùng lúc nhưng thiếu sự kiên trì đi tới đích cuối cùng. Đặc biệt khi Thiên Cơ gặp Hóa Kỵ, Đà La, Hỏa Linh thì hệ thần kinh rất dễ căng thẳng, khó ngủ sâu.',
      },
    ],
    contentHtml: `
      <h2>1. Tính Chất Đặc Trưng Của Sao Thiên Cơ</h2>
      <p><strong>Thiên Cơ</strong> là sao thứ hai trong chòm Bắc Đẩu, thuộc hành <strong>Âm Mộc</strong>. Đây là ngôi sao đại diện cho trí tuệ linh hoạt, khả năng phân tích logic, kỹ thuật cơ khí – công nghệ thông tin và hoạch định chiến lược:</p>
      <ul>
        <li><strong>Ưu điểm vượt trội:</strong> Nhạy bén với xu hướng mới, học nhanh hiểu rộng, giỏi lập kế hoạch, khéo léo trong ứng xử và giải quyết tình huống phát sinh.</li>
        <li><strong>Điểm cần lưu ý:</strong> Là <em>Động tinh</em> nên tâm trí hiếm khi chịu đứng yên; nếu không rèn tính kỷ luật tập trung vào một mục tiêu dài hạn thì dễ phân tán nguồn lực.</li>
        <li><strong>Biểu hiện về sức khỏe:</strong> Hành Mộc chủ về gan mật, gân cơ và hệ thần kinh trung ương; khi Thiên Cơ gặp Hóa Kỵ cần chú ý giấc ngủ và xương khớp tứ chi.</li>
      </ul>
      <h2>2. Bảng Tổ Hợp Sao Thiên Cơ &amp; Định Hướng Nghề Nghiệp</h2>
      <table>
        <thead>
          <tr>
            <th>Cách cục Thiên Cơ</th>
            <th>Vị trí Địa Chi</th>
            <th>Ngành nghề phát huy tối đa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Thiên Cơ độc thủ</strong></td>
            <td>Tý • Ngọ • Tỵ • Hợi • Sửu • Mùi</td>
            <td>Tại Tý Ngọ rất sáng sủa: hợp IT, phân tích dữ liệu, quản lý vận hành, thiết kế hệ thống.</td>
          </tr>
          <tr>
            <td><strong>Thiên Cơ – Thái Âm</strong></td>
            <td>Dần • Thân</td>
            <td>Tài chính – Kế toán, Đầu tư, Thiết kế nội thất, Du lịch, Dịch vụ chăm sóc khách hàng.</td>
          </tr>
          <tr>
            <td><strong>Thiên Cơ – Cự Môn</strong></td>
            <td>Mão • Dậu</td>
            <td><em>Cự Cơ Mão Dậu</em>: Thương mại điện tử, Luật, Ngoại giao, Truyền thông, Xuất nhập khẩu.</td>
          </tr>
          <tr>
            <td><strong>Thiên Cơ – Thiên Lương</strong></td>
            <td>Thìn • Tuất</td>
            <td><em>Cơ Lương Thìn Tuất</em>: Giáo dục, Nghiên cứu khoa học, Y dược, Cố vấn chiến lược.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-5',
    number: 5,
    moduleId: 2,
    title: 'Sao Thái Dương: Quang Minh Quyền Quý, Danh Tiếng & Áp Lực Gánh Vác',
    subtitle: 'Sự khác biệt một trời một vực giữa Thái Dương sinh ban ngày (Dần – Ngọ) và Thái Dương sinh ban đêm (Thân – Sửu).',
    isFreePreview: false,
    duration: '20:40',
    relatedStars: ['Thái Dương', 'Thái Âm', 'Cự Môn', 'Thiên Lương'],
    flashcard: {
      nguHanh: 'Dương Hỏa (Bính Hỏa — Ánh sáng mặt trời chiếu rọi vạn vật)',
      hoaKhi: 'Quý Tinh & Quyền Tinh (Chủ về danh tiếng, công danh, sự quang minh chính đại)',
      chuSu: 'Chủ cung Quan Lộc; đại diện cho người Cha, người Chồng và nam giới trong lá số',
      dacHam: 'Miếu/Vượng: Dần, Mão, Thìn, Tỵ, Ngọ • Đắc địa: Mùi, Thân • Hãm địa: Dậu, Tuất, Hợi, Tý, Sửu',
      cauPhu: 'Nhật xuất Lôi Môn (Thái Dương cư Mão) — Mặt trời mọc lúc bình minh, phú quý vinh hoa.',
      cotLoi: 'Thái Dương chủ Quý trước rồi mới tới Phú; người mệnh Thái Dương luôn phải cho đi ánh sáng và gánh vác trách nhiệm cho tập thể.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Thái Dương: Ngôi sao của sự quang minh, hào sảng và danh vị',
        transcript: 'Thái Dương là mặt trời trên bầu trời Tử Vi, thuộc hành Dương Hỏa, hóa khí là Quý Tinh. Bản chất của mặt trời là tỏa sáng và cho đi mà không đòi hỏi nhận lại. Bởi vậy, người có Thái Dương thủ Mệnh ở vị trí Miếu Vượng từ cung Dần đến cung Ngọ thường có tính cách vô cùng thẳng thắn, rộng lượng, ghét sự mập mờ tiểu xảo và có uy tín rất lớn trong cộng đồng.',
      },
      {
        time: '07:20',
        title: 'Thái Dương ban ngày (Miếu Vượng) và Thái Dương ban đêm (Hãm địa)',
        transcript: 'Không ngôi sao nào phụ thuộc vào vị trí Địa Chi và giờ sinh mạnh như Thái Dương. Từ cung Dần qua Mão, Thìn, Tỵ đến Ngọ là mặt trời ban ngày: đặc biệt tại Mão gọi là Nhật Xuất Lôi Môn, tại Ngọ gọi là Nhật Lệ Trung Thiên. Ngược lại, từ cung Dậu qua Tuất, Hợi, Tý, Sửu là mặt trời đã lặn xuống núi: người mệnh Thái Dương hãm địa vẫn rất thông minh và nhiệt tình, nhưng làm ơn dễ mắc oán, hay phải vất vả lo toan ngầm và cần Hóa Lộc, Hóa Khoa hoặc Tuần Triệt để làm sáng lại.',
      },
      {
        time: '14:10',
        title: 'Ý nghĩa đặc biệt của Thái Dương đối với lá số Nữ mệnh',
        transcript: 'Trên lá số của người phụ nữ, sao Thái Dương vừa là năng lực sự nghiệp vừa đại diện trực tiếp cho người cha và người chồng. Nữ mệnh có Thái Dương Miếu Vượng thường lấy được người chồng có danh vị, nhưng bản thân chị em cũng rất giỏi giang, mang tính cách nam tính quyết đoán nên trong gia đình cần học cách mềm mỏng để giữ hòa khí.',
      },
    ],
    contentHtml: `
      <h2>1. Bản Chất Của Sao Thái Dương: Danh Trước Lợi Sau</h2>
      <p><strong>Thái Dương</strong> thuộc hành <strong>Dương Hỏa</strong>, là trung thiên chính tinh chủ quản cung <strong>Quan Lộc</strong>. Khác với Vũ Khúc hay Thái Âm thiên về tích lũy tiền bạc trực tiếp, Thái Dương đi theo con đường <strong>xây dựng uy tín, thương hiệu, học vị và vị thế xã hội trước</strong>, từ đó tài lộc tự khắc chảy về:</p>
      <ul>
        <li><strong>Khi Thái Dương Miếu / Vượng (Dần, Mão, Thìn, Tỵ, Ngọ):</strong> Tư duy minh bạch, tầm nhìn xa, có khả năng diễn thuyết, truyền cảm hứng và dẫn dắt đội ngũ lớn.</li>
        <li><strong>Khi Thái Dương Hãm địa (Dậu, Tuất, Hợi, Tý, Sửu):</strong> Nội tâm nhiều trăn trở, làm việc tốn nhiều tâm sức hơn người khác; rất hợp làm chuyên gia hậu trường, nghiên cứu chuyên sâu hoặc làm việc với đối tác nước ngoài (nơi lệch múi giờ).</li>
      </ul>
      <h2>2. Bảng Các Cách Cục Kinh Điển Của Sao Thái Dương</h2>
      <table>
        <thead>
          <tr>
            <th>Tên Cách Cục</th>
            <th>Vị trí &amp; Tổ hợp</th>
            <th>Ý nghĩa luận giải thực tế</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Nhật Xuất Lôi Môn / Dương Lương Xương Lộc</strong></td>
            <td>Thái Dương – Thiên Lương tại Mão hội Văn Xương, Lộc Tồn</td>
            <td>Đỗ đạt khoa bảng cực cao, nổi danh trong giới học thuật, giáo dục, y khoa, quản lý nhà nước.</td>
          </tr>
          <tr>
            <td><strong>Nhật Lệ Trung Thiên</strong></td>
            <td>Thái Dương độc thủ tại Ngọ</td>
            <td>Mặt trời giữa trưa rực rỡ, quyền uy lớn; hợp tuổi Bính, Đinh, Mậu nhưng tránh gặp Kình Đà Không Kiếp.</td>
          </tr>
          <tr>
            <td><strong>Cự Nhật Đồng Lâm</strong></td>
            <td>Thái Dương – Cự Môn tại Dần / Thân</td>
            <td>Ánh mặt trời xua tan bóng tối của Cự Môn: cực giỏi ngoại ngữ, thương mại quốc tế, truyền thông, luật.</td>
          </tr>
          <tr>
            <td><strong>Nhật Nguyệt Đồng Minh / Tịnh Minh</strong></td>
            <td>Thái Dương tại Thìn/Tỵ chiếu Thái Âm tại Tuất/Hợi (hoặc Sửu Mùi)</td>
            <td>Ánh sáng cả ngày lẫn đêm tương trợ: công danh và tiền tài song hành bền vững.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-6',
    number: 6,
    moduleId: 2,
    title: 'Sao Vũ Khúc: Chính Tài Tinh, Thực Thi Tài Chính & Bản Lĩnh Cô Quả',
    subtitle: 'Ngôi sao của hành động thực tế, ngân hàng, thương mại và lý do người mệnh Vũ Khúc cần chú ý cung Phu Thê.',
    isFreePreview: false,
    duration: '20:10',
    relatedStars: ['Vũ Khúc', 'Thiên Phủ', 'Thiên Tướng', 'Tham Lang', 'Thất Sát', 'Phá Quân'],
    flashcard: {
      nguHanh: 'Âm Kim (Tân Kim — Kim loại quý đã qua rèn đúc thành tiền tệ, trang sức)',
      hoaKhi: 'Tài Tinh (Chính Tài Tinh số 1 quản lý cung Tài Bạch)',
      chuSu: 'Chủ về tiền tệ, ngân hàng, kế toán, kinh doanh thực chiến và khả năng thực thi',
      dacHam: 'Miếu địa: Thìn, Tuất, Sửu, Mùi • Vượng địa: Dần, Thân, Tý, Ngọ • Đắc địa: Mão, Dậu • Bình/Hãm: Tỵ, Hợi',
      cauPhu: 'Vũ Khúc miếu vượng, uy danh lừng lẫy; Vũ Tham đồng hành, bất quý tắc phú.',
      cotLoi: 'Vũ Khúc cực giỏi kiếm tiền và quyết đoán công việc nhưng mang tính Kim cương nghị nên dễ khô khan trong chuyện tình cảm.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Vũ Khúc: Ngôi sao thực tế nhất trong 14 Chính Tinh',
        transcript: 'Nếu Thiên Cơ thích lập kế hoạch, Thái Dương thích danh tiếng thì Vũ Khúc là ngôi sao của hành động thực tế và hiệu quả tài chính. Thuộc hành Âm Kim, Vũ Khúc là Chính Tài Tinh chủ quản cung Tài Bạch. Người có Vũ Khúc thủ Mệnh nói ít làm nhiều, cực kỳ dứt khoát, rõ ràng về tiền bạc và ghét sự vòng vo lý thuyết suông.',
      },
      {
        time: '07:15',
        title: 'Vũ Khúc đi với Tử Phủ Tướng và Vũ Khúc đi với Sát Phá Tham',
        transcript: 'Điểm thú vị của Vũ Khúc là nó đứng giao thoa giữa hai nhóm lớn: khi đi với Thiên Phủ tại Tý Ngọ hoặc Thiên Tướng tại Dần Thân, Vũ Khúc mang dáng dấp của nhà quản lý tài chính, giám đốc ngân hàng, kiểm toán viên chuẩn mực. Nhưng khi đi với Tham Lang tại Sửu Mùi, Thất Sát tại Mão Dậu hay Phá Quân tại Tỵ Hợi, Vũ Khúc lại biến thành nhà kinh doanh mạo hiểm, đầu tư công nghiệp, kỹ thuật và thương mại sắc bén.',
      },
      {
        time: '14:30',
        title: 'Vì sao cổ nhân gọi Vũ Khúc là Quả Tú tinh?',
        transcript: 'Vì hành Kim của Vũ Khúc quá sắc lạnh và lý trí, người mệnh Vũ Khúc thường đặt công việc và trách nhiệm kinh tế lên trên sự lãng mạn. Nếu đi thêm Cô Thần, Quả Tú, Vũ Khúc Hóa Kỵ thì đời sống hôn nhân dễ có khoảng cách tâm lý. Giải pháp thực tế là nên kết hôn muộn một chút, chọn bạn đời có tính cách ấm áp hoặc cùng chung chí hướng kinh doanh.',
      },
    ],
    contentHtml: `
      <h2>1. Bản Chất Của Sao Vũ Khúc: Quyết Đoán &amp; Thực Thi Tài Chính</h2>
      <p><strong>Vũ Khúc</strong> là sao thứ sáu thuộc chòm Bắc Đẩu, mang hành <strong>Âm Kim</strong>. Đây là ngôi sao đại diện cho năng lực tạo ra dòng tiền bằng hành động thực tế, quản trị chi phí và kỷ luật thương trường:</p>
      <ul>
        <li><strong>Khi Vũ Khúc hội Hóa Lộc, Lộc Tồn, Hóa Quyền:</strong> Dòng tiền dồi dào, có biệt tài nhìn ra cơ hội kinh doanh sinh lời ngay trong thực tế.</li>
        <li><strong>Khi Vũ Khúc đồng cung Tham Lang (Sửu, Mùi):</strong> Cách cục <em>Vũ Tham bất phát thiếu niên nhân</em> — trước 30 tuổi cần tích lũy kinh nghiệm, từ sau 30 tuổi (đặc biệt khi gặp Hỏa Tinh, Linh Tinh) bùng nổ tài lộc rất lớn.</li>
        <li><strong>Khi Vũ Khúc gặp Hóa Kỵ, Kiếp Sát, Kình Dương:</strong> Tuyệt đối tránh bảo lãnh vay nợ hộ người khác hoặc tranh chấp hợp đồng bằng cảm tính.</li>
      </ul>
      <h2>2. Bảng Phân Tích 6 Thế Đứng Của Sao Vũ Khúc</h2>
      <table>
        <thead>
          <tr>
            <th>Vị trí Địa Chi</th>
            <th>Tổ hợp Chính Tinh</th>
            <th>Luận giải trọng tâm</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Thìn • Tuất</strong></td>
            <td>Vũ Khúc độc thủ</td>
            <td>Đóng tại Tứ Mộ (Thổ sinh Kim): tài khí cực vượng, càng về trung niên càng tích lũy nhiều tài sản lớn.</td>
          </tr>
          <tr>
            <td><strong>Tý • Ngọ</strong></td>
            <td>Vũ Khúc – Thiên Phủ</td>
            <td><em>Vũ Phủ đồng cung</em>: Vừa giỏi kiếm tiền (Vũ Khúc) vừa giỏi giữ tiền (Thiên Phủ), bậc thầy quản trị tài chính.</td>
          </tr>
          <tr>
            <td><strong>Dần • Thân</strong></td>
            <td>Vũ Khúc – Thiên Tướng</td>
            <td>Uy tín thương trường cao, giỏi điều hành doanh nghiệp dịch vụ, luật, tài chính.</td>
          </tr>
          <tr>
            <td><strong>Sửu • Mùi</strong></td>
            <td>Vũ Khúc – Tham Lang</td>
            <td>Phát mạnh từ sau tuổi 30; hợp kinh doanh thương mại, sản xuất, bất động sản.</td>
          </tr>
          <tr>
            <td><strong>Mão • Dậu</strong></td>
            <td>Vũ Khúc – Thất Sát</td>
            <td>Tác phong thần tốc, dám đánh lớn; cần Lộc Tồn hoặc Hóa Khoa để kiềm chế rủi ro.</td>
          </tr>
          <tr>
            <td><strong>Tỵ • Hợi</strong></td>
            <td>Vũ Khúc – Phá Quân</td>
            <td>Tiền vào tay phải ra tay trái để tái đầu tư liên tục; hợp đi xa lập nghiệp hoặc làm kỹ thuật, xuất nhập khẩu.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-7',
    number: 7,
    moduleId: 2,
    title: 'Sao Thiên Đồng: Phúc Tinh Giải Ách, Cảm Xúc Nghệ Thuật & Sự Dịch Chuyển',
    subtitle: 'Vì sao Thiên Đồng là ngôi sao đệ nhất Phúc Đức nhưng lại cần trải qua thử thách mới thành tựu lớn?',
    isFreePreview: false,
    duration: '17:50',
    relatedStars: ['Thiên Đồng', 'Thái Âm', 'Thiên Lương', 'Cự Môn'],
    flashcard: {
      nguHanh: 'Dương Thủy (Nhâm Thủy — Dòng nước mát lành, linh hoạt, bao dung)',
      hoaKhi: 'Phúc Tinh (Ngôi sao chủ quản cung Phúc Đức, giải trừ tai ách)',
      chuSu: 'Chủ về phúc thọ, nghệ thuật, ẩm thực, ngoại giao mềm mỏng và sự đổi mới',
      dacHam: 'Miếu địa: Dần, Thân • Vượng địa: Tý, Mão • Đắc địa: Tỵ, Hợi • Hãm địa: Thìn, Tuất, Sửu, Mùi, Ngọ, Dậu',
      cauPhu: 'Thiên Đồng Tý Ngọ đồng Thái Âm — Thủy trừng quế ngạc, thanh danh và tài lộc tinh tế.',
      cotLoi: 'Thiên Đồng ưa cuộc sống an nhàn nên đôi khi cần một chút Sát tinh (Kình Đà, Hỏa Linh) kích thích để không bị an phận.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Thiên Đồng: Ngôi sao trẻ mãi không già trong 14 Chính Tinh',
        transcript: 'Thiên Đồng thuộc hành Dương Thủy, hóa khí là Phúc Tinh chủ quản cung Phúc Đức. Người có Thiên Đồng thủ Mệnh thường có khuôn mặt bầu bĩnh, phúc hậu, tính tình ôn hòa, giàu lòng trắc ẩn, yêu thích âm nhạc, văn chương, ẩm thực và du lịch. Dù ở tuổi 50 hay 60, người mệnh Thiên Đồng vẫn giữ được nét hồn nhiên và khả năng thích nghi với cái mới.',
      },
      {
        time: '06:40',
        title: 'Nghịch lý thú vị: Thiên Đồng quá êm đềm lại khó bứt phá',
        transcript: 'Vì bản chất của Thiên Đồng là hưởng phúc và né tránh xung đột, nếu lá số chỉ toàn sao êm dịu thì đương số dễ hài lòng với mức sống vừa đủ, thiếu động lực dấn thân. Do đó, cổ nhân rất quý cách Thiên Đồng gặp Kình Dương tại Ngọ (Mã Đầu Đới Kiếm) hoặc có Hóa Quyền, Lộc Tồn thúc đẩy — chính áp lực từ thực tế sẽ biến sự thông minh của Thiên Đồng thành sự nghiệp lớn.',
      },
      {
        time: '12:50',
        title: 'Thiên Đồng đi với Thái Âm, Thiên Lương và Cự Môn',
        transcript: 'Tại Tý Ngọ, Thiên Đồng đi với Thái Âm (Đồng Âm tại Tý là Thủy Trừng Quế Ngạc cực đẹp). Tại Dần Thân, Thiên Đồng đi với Thiên Lương tạo thành bộ Đồng Lương tối miếu — phúc thọ song toàn, cực hợp làm giáo dục, y tế, tư vấn. Còn tại Sửu Mùi, Thiên Đồng đi với Cự Môn thì nội tâm sâu sắc nhưng hay có nỗi buồn kín đáo.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Tính Của Sao Thiên Đồng: Phúc Khí, Nghệ Thuật &amp; Dịch Chuyển</h2>
      <p><strong>Thiên Đồng</strong> là ngôi sao chủ về phúc ấm và sự khởi đầu mới (<em>Bạch thủ thành gia</em> — tự tay gây dựng từ con số không hoặc chuyển đổi ngành nghề linh hoạt):</p>
      <ul>
        <li><strong>Về tâm tính:</strong> Hòa nhã, dễ gần, giỏi lắng nghe, không thích tranh đoạt gay gắt; có gu thẩm mỹ, nghệ thuật và ẩm thực rất tinh tế.</li>
        <li><strong>Về công danh:</strong> Phát huy tốt nhất trong các lĩnh vực dịch vụ cao cấp, giáo dục, truyền thông, văn hóa nghệ thuật, du lịch, nhà hàng – khách sạn, tâm lý học và công tác xã hội.</li>
      </ul>
      <h2>2. Bảng Các Tổ Hợp Sao Thiên Đồng Trọng Điểm</h2>
      <table>
        <thead>
          <tr>
            <th>Tổ hợp Sao</th>
            <th>Vị trí Địa Chi</th>
            <th>Đặc điểm thực chiến</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Thiên Đồng – Thái Âm</strong></td>
            <td>Tý • Ngọ</td>
            <td>Tại Tý (<em>Thủy Trừng Quế Ngạc</em>) cả hai sao đều sáng: tài hoa, giàu có, nhân duyên tốt. Tại Ngọ nếu tuổi Bính, Mậu gặp Kình Dương là <em>Mã Đầu Đới Kiếm</em> phát võ nghiệp/thương trường.</td>
          </tr>
          <tr>
            <td><strong>Thiên Đồng – Thiên Lương</strong></td>
            <td>Dần • Thân</td>
            <td><em>Đồng Lương Dần Thân</em>: Phúc tinh + Ấm tinh hội tụ, đời ít sóng gió hiểm nghèo, hợp làm thầy giáo, thầy thuốc, cố vấn.</td>
          </tr>
          <tr>
            <td><strong>Thiên Đồng – Cự Môn</strong></td>
            <td>Sửu • Mùi</td>
            <td>Giỏi chuyên môn sâu, nghiên cứu, nghệ thuật hoặc ngôn ngữ nhưng cần Hóa Lộc, Hóa Khoa để giải tỏa tâm lý đa sầu đa cảm.</td>
          </tr>
          <tr>
            <td><strong>Thiên Đồng độc thủ</strong></td>
            <td>Mão • Dậu • Thìn • Tuất • Tỵ • Hợi</td>
            <td>Tại Mão Tỵ Hợi thông minh, nhiều tài lẻ, thường đi xa hoặc thay đổi môi trường sống mà thành đạt.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-8',
    number: 8,
    moduleId: 2,
    title: 'Sao Liêm Trinh: Đào Hoa Thứ Hai, Kỷ Luật Pháp Lý & Lửa Nội Tâm',
    subtitle: 'Ngôi sao vừa mang tính thanh liêm kỷ luật vừa mang sức hút Đào hoa mạnh mẽ khi đi cùng Tham Lang, Phá Quân.',
    isFreePreview: false,
    duration: '19:15',
    relatedStars: ['Liêm Trinh', 'Thiên Tướng', 'Thất Sát', 'Phá Quân', 'Tham Lang'],
    flashcard: {
      nguHanh: 'Âm Hỏa (Đinh Hỏa — Ngọn lửa âm ỉ bên trong lớp vỏ cứng rắn)',
      hoaKhi: 'Tù Tinh & Thứ Đào Hoa (Vừa chủ về kỷ luật, pháp luật vừa chủ về sức hút cảm xúc)',
      chuSu: 'Chủ cung Quan Lộc, hành chính, kiểm soát nội bộ, công nghệ và nghệ thuật biểu diễn',
      dacHam: 'Miếu địa: Thìn, Tuất • Vượng địa: Tý, Ngọ, Dần, Thân • Đắc địa: Sửu, Mùi • Hãm địa: Tỵ, Hợi, Mão, Dậu',
      cauPhu: 'Liêm Trinh thanh bạch năng tương thủ — Liêm Trinh đắc địa giữ mình thanh liêm, quyền quý.',
      cotLoi: 'Liêm Trinh cực kỳ nhạy cảm với Cát tinh và Sát tinh: gặp Lộc Tồn, Thiên Tướng thì công minh đĩnh đạc; gặp Hình Kỵ Không Kiếp tại Hãm địa cần tuyệt đối tuân thủ pháp luật.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Hai mặt đối lập thú vị bên trong sao Liêm Trinh',
        transcript: 'Trong 14 Chính tinh, Liêm Trinh là ngôi sao có cá tính đặc biệt nhất. Nó mang hành Âm Hỏa nhưng trong tàng chứa cả khí Kim và Mộc. Cổ nhân vừa gọi Liêm Trinh là Thanh Bạch tinh (ngôi sao của sự liêm chính, kỷ luật, nguyên tắc), vừa gọi nó là Thứ Đào Hoa (ngôi sao đào hoa thứ hai sau Tham Lang). Tại sao lại như vậy? Vì người mệnh Liêm Trinh ngoài mặt rất nghiêm túc, thẳng thắn nhưng nội tâm bên trong lại cực kỳ giàu cảm xúc và có sức hút riêng biệt.',
      },
      {
        time: '07:00',
        title: 'Liêm Trinh độc thủ tại Dần Thân và Liêm Tướng tại Tý Ngọ',
        transcript: 'Khi Liêm Trinh độc thủ tại Dần Thân hoặc đồng cung Thiên Tướng tại Tý Ngọ, Thủy của Thiên Tướng chế hóa bớt tính nóng của Hỏa Liêm Trinh tạo thành cách Hình Ấn tương phùng. Đây là những nhà quản trị xuất sắc, làm việc có nguyên tắc, hợp với pháp chế, kiểm toán, quân đội, công an hoặc quản lý vận hành.',
      },
      {
        time: '13:30',
        title: 'Khi Liêm Trinh gặp Hóa Kỵ, Bạch Hổ tại Tỵ Hợi, Mão Dậu',
        transcript: 'Vì hóa khí của Liêm Trinh có chữ Tù (sự ràng buộc, quy tắc pháp lý), khi Liêm Trinh đóng ở Tỵ Hợi đi cùng Tham Lang hoặc ở Mão Dậu đi cùng Phá Quân mà lại gặp Hóa Kỵ, Thiên Hình, Bạch Hổ thì trong đời làm ăn phải hết sức minh bạch giấy tờ, thuế vụ, hợp đồng và chú ý an toàn giao thông.',
      },
    ],
    contentHtml: `
      <h2>1. Tính Chất Cốt Lõi Của Sao Liêm Trinh</h2>
      <p><strong>Liêm Trinh</strong> là sao thứ năm thuộc chòm Bắc Đẩu, mang hành <strong>Âm Hỏa</strong>. Đây là ngôi sao của sự sắc sảo, nguyên tắc rõ ràng, trực giác nhạy bén và lòng tự tôn rất cao:</p>
      <ul>
        <li><strong>Khi đi cùng Văn Xương, Văn Khúc, Lộc Tồn, Thiên Phủ, Thiên Tướng:</strong> Liêm khiết, giỏi tổ chức, có khiếu thẩm mỹ cao và giữ chữ tín tuyệt đối.</li>
        <li><strong>Khi đi cùng linh kiện điện tử, phần mềm (Hỏa điện):</strong> Trong thời đại hiện nay, Liêm Trinh còn đại diện cho điện tử, viễn thông, phần mềm, kiểm thử hệ thống và thiết kế đồ họa.</li>
      </ul>
      <h2>2. Bảng Phân Tích 6 Thế Đứng Của Sao Liêm Trinh</h2>
      <table>
        <thead>
          <tr>
            <th>Vị trí Địa Chi</th>
            <th>Tổ hợp Chính Tinh</th>
            <th>Luận giải thực chiến</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Dần • Thân</strong></td>
            <td>Liêm Trinh độc thủ</td>
            <td><em>Liêm Trinh Thanh Bạch</em>: Chuyên môn vững, thẳng thắn, có uy quyền quản lý.</td>
          </tr>
          <tr>
            <td><strong>Thìn • Tuất</strong></td>
            <td>Liêm Trinh – Thiên Phủ</td>
            <td>Kho tài chính kết hợp nguyên tắc kỷ luật: rất hợp ngân hàng, đầu tư dài hạn, quản trị doanh nghiệp.</td>
          </tr>
          <tr>
            <td><strong>Tý • Ngọ</strong></td>
            <td>Liêm Trinh – Thiên Tướng</td>
            <td>Thủy – Hỏa ký tế: vừa có nguyên tắc vừa biết mềm mỏng ngoại giao, dễ giữ chức vụ cao.</td>
          </tr>
          <tr>
            <td><strong>Sửu • Mùi</strong></td>
            <td>Liêm Trinh – Thất Sát</td>
            <td><em>Hùng Tú Triều Nguyên</em> (đặc biệt tại Mùi): cực kỳ nghị lực, làm giàu từ chuyên môn kỹ thuật hoặc thương mại.</td>
          </tr>
          <tr>
            <td><strong>Mão • Dậu</strong></td>
            <td>Liêm Trinh – Phá Quân</td>
            <td>Tính đột phá mạnh, dám làm những việc người khác ngại khó; cần rèn sự điềm tĩnh.</td>
          </tr>
          <tr>
            <td><strong>Tỵ • Hợi</strong></td>
            <td>Liêm Trinh – Tham Lang</td>
            <td>Sức hút ngoại giao rất lớn, giỏi đàm phán và xoay xở nhưng cần giữ kỷ luật pháp lý và tình cảm.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-9',
    number: 9,
    moduleId: 2,
    title: 'Sao Thiên Phủ: Kho Tàng Nam Đẩu, Năng Lực Quản Trị & Tích Lũy Tài Sản',
    subtitle: 'Vì sao Thiên Phủ cần Lộc Tồn để làm đầy kho và sợ nhất Địa Không, Địa Kiếp làm lộ khố, không khố?',
    isFreePreview: false,
    duration: '19:40',
    relatedStars: ['Thiên Phủ', 'Tử Vi', 'Vũ Khúc', 'Liêm Trinh', 'Lộc Tồn'],
    flashcard: {
      nguHanh: 'Âm Thổ (Mậu/Kỷ Thổ — Kho tàng tích trữ tài sản và đất đai)',
      hoaKhi: 'Lệnh Tinh & Tài Khố (Chủ kho tiền bạc, điền sản và quyền điều hành)',
      chuSu: 'Chủ Tài Bạch & Điền Trạch; đứng đầu chòm Nam Đẩu Tinh',
      dacHam: 'Luôn Miếu / Vượng / Đắc địa tại tất cả 12 cung Địa Chi (Không bao giờ Hãm địa)',
      cauPhu: 'Thiên Phủ Tuất cung vô Sát tấu, Giáp Kỷ nhân thiên vạn toàn danh.',
      cotLoi: 'Thiên Phủ là cái kho: kho có đầy vàng bạc hay không phụ thuộc vào việc có gặp Lộc Tồn, Hóa Lộc hay không.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Thiên Phủ: Nam Đẩu Đế Tinh — Vững vàng, cẩn trọng và thực tế',
        transcript: 'Nếu sao Tử Vi là Bắc Đẩu Đế Tinh chuyên về mở mang quyền lực thì sao Thiên Phủ là Nam Đẩu Đế Tinh chuyên về giữ gìn cơ nghiệp, quản lý kho tàng và tích lũy tài sản. Thiên Phủ thuộc hành Thổ, đứng ở bất kỳ cung nào trong 12 địa chi cũng đều từ Đắc địa đến Miếu Vượng. Người mệnh Thiên Phủ có phong thái điềm đạm, ăn chắc mặc bền, không bao giờ thích mạo hiểm tất tay.',
      },
      {
        time: '06:50',
        title: 'Thiên Phủ Đắc Lộc (Kho đầy) vs. Thiên Phủ Không Lộ (Kho rỗng)',
        transcript: 'Bản chất của Thiên Phủ là cái kho chứa tiền (Tài khố). Một cái kho chỉ thực sự giá trị khi bên trong có hàng hóa và vàng bạc — tức là Thiên Phủ phải hội hợp được Lộc Tồn hoặc Hóa Lộc, thêm Tả Phù, Hữu Bật canh giữ. Ngược lại, nếu Thiên Phủ không có Lộc mà lại gặp Địa Không, Địa Kiếp, Đại Tiểu Hao, Tuần Triệt đóng ngay tại đó thì cổ nhân gọi là Không Khố hoặc Lộ Khố — bên ngoài nhìn rất bề thế nhưng dòng tiền thực tế bên trong lại hao hụt.',
      },
      {
        time: '13:40',
        title: 'Luôn nhìn cung Tướng diện và cung Thất Sát khi xem Thiên Phủ',
        transcript: 'Trong kỹ thuật an sao, Thiên Phủ và Thiên Tướng luôn luôn nằm trong tam hợp của nhau gọi là Phủ Tướng Triều Viên; đồng thời cung xung chiếu của Thiên Phủ lúc nào cũng có sao Thất Sát. Do đó, xem Thiên Phủ phải xem đồng thời cả Thiên Tướng có bị Triệt hay Hình Kỵ làm hỏng ấn tín hay không.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Tính Cốt Lõi Của Sao Thiên Phủ: Quản Trị &amp; Giữ Lộc</h2>
      <p><strong>Thiên Phủ</strong> đứng đầu chòm Nam Đẩu, mang hành <strong>Thổ</strong>. Đây là ngôi sao của sự ổn định, quản trị rủi ro xuất sắc và khả năng tích lũy bất động sản, tài sản dài hạn:</p>
      <ul>
        <li><strong>Khi Thiên Phủ gặp Lộc Tồn / Hóa Lộc + Tả Hữu:</strong> Kho tài chính sung túc, càng lớn tuổi càng nhiều nhà đất và tài sản tích lũy.</li>
        <li><strong>Khi Thiên Phủ gặp Địa Không, Địa Kiếp, Tuần, Triệt:</strong> Tránh đầu tư dàn trải hoặc đứng tên vay hộ; cần kiểm soát chặt dòng tiền mặt.</li>
      </ul>
      <h2>2. Bảng Đối Chiếu Các Thế Đứng Của Sao Thiên Phủ</h2>
      <table>
        <thead>
          <tr>
            <th>Vị trí Địa Chi</th>
            <th>Tổ hợp Chính Tinh</th>
            <th>Ý nghĩa luận giải thực chiến</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Dần • Thân</strong></td>
            <td>Tử Vi – Thiên Phủ</td>
            <td>Vua và Kho đi cùng nhau: quyền lực đi đôi với thực lực tài chính, rất hợp làm lãnh đạo các định chế lớn.</td>
          </tr>
          <tr>
            <td><strong>Tý • Ngọ</strong></td>
            <td>Vũ Khúc – Thiên Phủ</td>
            <td>Chính Tài Tinh + Tài Khố: kiếm tiền giỏi và giữ tiền cực kỳ chặt chẽ.</td>
          </tr>
          <tr>
            <td><strong>Thìn • Tuất</strong></td>
            <td>Liêm Trinh – Thiên Phủ</td>
            <td>Quản trị tài sản theo quy trình kỷ luật, bền bỉ, hậu vận rất vững.</td>
          </tr>
          <tr>
            <td><strong>Sửu • Mùi • Mão • Dậu • Tỵ • Hợi</strong></td>
            <td>Thiên Phủ độc thủ</td>
            <td>Luôn đối diện với Thất Sát (hoặc Tử Sát, Vũ Sát, Liêm Sát): bên trong điềm tĩnh nhưng ra ngoài thương trường rất bản lĩnh.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-10',
    number: 10,
    moduleId: 2,
    title: 'Sao Thái Âm: Phú Tinh Điền Trạch, Dòng Tiền Bền Vững & Chiều Sâu Nội Tâm',
    subtitle: 'Mặt trăng của Tử Vi Đẩu Số: chủ về bất động sản, tài chính ngân hàng, thẩm mỹ và sự tinh tế.',
    isFreePreview: false,
    duration: '20:25',
    relatedStars: ['Thái Âm', 'Thái Dương', 'Thiên Cơ', 'Thiên Đồng'],
    flashcard: {
      nguHanh: 'Âm Thủy (Quý Thủy — Ánh trăng dịu mát và nguồn nước ngầm nuôi dưỡng)',
      hoaKhi: 'Phú Tinh (Ngôi sao chủ về sự giàu có thực chất và tích lũy Điền Trạch)',
      chuSu: 'Chủ cung Điền Trạch & Tài Bạch; đại diện cho người Mẹ, người Vợ và nữ giới',
      dacHam: 'Miếu/Vượng: Dậu, Tuất, Hợi, Tý • Đắc địa: Sửu, Mùi, Thân • Hãm địa: Dần, Mão, Thìn, Tỵ, Ngọ',
      cauPhu: 'Nguyệt lãng Thiên Môn (Thái Âm cư Hợi) — Trăng sáng giữa cổng trời, đại phú đại quý.',
      cotLoi: 'Nếu Thái Dương chủ Quý (danh vị) thì Thái Âm chủ Phú (tiền bạc, nhà đất); Thái Âm sáng nhất khi đóng từ cung Dậu đến cung Tý.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Thái Âm: Phú Tinh chủ quản Điền Trạch và tài sản tích lũy',
        transcript: 'Nếu Thái Dương là mặt trời rực rỡ chủ về danh vị thì Thái Âm là mặt trăng dịu dàng chủ về Phú — tức là tiền tài và bất động sản thực chất. Người có sao Thái Âm thủ Mệnh ở vị trí Miếu Vượng từ cung Dậu qua Tuất, Hợi đến Tý thường có khí chất thanh lịch, tinh tế, thấu hiểu tâm lý người khác và có duyên đặc biệt với đất đai, nhà cửa, tài chính.',
      },
      {
        time: '07:10',
        title: 'Nguyệt Lãng Thiên Môn (Thái Âm cư Hợi) và Thủy Trừng Quế Ngạc (Cư Tý)',
        transcript: 'Đẹp nhất của sao Thái Âm là khi đóng tại cung Hợi vào ban đêm, gọi là Nguyệt Lãng Thiên Môn — trăng rằm tỏa sáng giữa bầu trời đêm trong vắt, đặc biệt người tuổi Ất, Bính, Đinh, Mậu cực kỳ giàu có. Tại cung Tuất và cung Dậu, Thái Âm cũng rất sáng, đối chiếu với Thái Dương tại Thìn và Mão tạo nên cách Nhật Nguyệt tịnh minh.',
      },
      {
        time: '14:00',
        title: 'Khi Thái Âm Hãm địa từ Dần đến Ngọ cần lưu ý gì?',
        transcript: 'Khi Thái Âm đóng ở các cung ban ngày từ Dần đến Ngọ thì ánh trăng bị ánh mặt trời lấn át. Người mệnh Thái Âm hãm địa thường nặng lòng về tình cảm, hay lo nghĩ cho người thân, nếu đầu tư bất động sản hoặc cho vay tiền cần tránh nghe theo cảm xúc mà phải kiểm tra kỹ pháp lý.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Tính Của Sao Thái Âm: Giàu Ngầm, Tinh Tế &amp; Có Duyên Điền Sản</h2>
      <p><strong>Thái Âm</strong> thuộc hành <strong>Âm Thủy</strong>, hóa khí là <strong>Phú Tinh</strong>, chủ quản trực tiếp cung <strong>Điền Trạch</strong>. Khác với Vũ Khúc kiếm tiền bằng sự quyết liệt thương trường, Thái Âm tích lũy tài sản một cách êm thấm, bền bỉ qua dòng tiền cho thuê, đầu tư tài chính, bất động sản và chuyên môn tinh hoa:</p>
      <ul>
        <li><strong>Khi Thái Âm Hóa Lộc, Hóa Quyền, Hóa Khoa:</strong> Rất vượng về nhà đất, tài chính, nghệ thuật, mỹ phẩm, thời trang, giáo dục, ngân hàng.</li>
        <li><strong>Khi Thái Âm gặp Hóa Kỵ, Đà La, Linh Hỏa:</strong> Dễ thiệt thòi về tình cảm hoặc hao tiền vì người thân trong gia đình; cần tách bạch tình cảm và tài chính.</li>
      </ul>
      <h2>2. Bảng So Sánh Thái Âm Ban Đêm (Miếu Vượng) &amp; Ban Ngày (Hãm Địa)</h2>
      <table>
        <thead>
          <tr>
            <th>Phân nhóm vị trí</th>
            <th>Các cung Địa Chi</th>
            <th>Đặc điểm thực chiến &amp; Hướng phát triển</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Thái Âm Ban Đêm (Miếu / Vượng)</strong></td>
            <td>Dậu • Tuất • Hợi • Tý</td>
            <td>Trăng sáng đúng thời: tâm tính điềm đạm, hậu vận giàu sang, sở hữu nhiều bất động sản có giá trị.</td>
          </tr>
          <tr>
            <td><strong>Thái Âm Giao Thời (Đắc địa)</strong></td>
            <td>Sửu • Mùi • Thân</td>
            <td>Tại Sửu Mùi đồng cung Thái Dương (<em>Nhật Nguyệt đồng lâm</em>); tại Thân đồng cung Thiên Cơ: giỏi tính toán tài chính, đa năng.</td>
          </tr>
          <tr>
            <td><strong>Thái Âm Ban Ngày (Hãm địa)</strong></td>
            <td>Dần • Mão • Thìn • Tỵ • Ngọ</td>
            <td>Cần Tuần, Triệt hoặc Hóa Khoa, Hóa Lộc cứu giải; hợp làm chuyên môn trí óc, nghệ thuật, ngoại ngữ và nên lập nghiệp xa quê.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-11',
    number: 11,
    moduleId: 2,
    title: 'Sao Tham Lang: Chánh Đào Hoa, Khát Vọng Đa Ngành & Biến Hóa Ngoại Giao',
    subtitle: 'Ngôi sao của khát vọng lớn, tài năng giao tiếp bậc thầy và sự bùng nổ kỳ diệu khi gặp Hỏa Tinh, Linh Tinh.',
    isFreePreview: false,
    duration: '20:05',
    relatedStars: ['Tham Lang', 'Vũ Khúc', 'Tử Vi', 'Liêm Trinh', 'Hỏa Tinh', 'Linh Tinh'],
    flashcard: {
      nguHanh: 'Thủy đới Mộc (Gốc癸 Thủy nhưng hóa khí hướng ra Giáp Mộc)',
      hoaKhi: 'Chánh Đào Hoa & Dục Vọng Tinh (Khát vọng vươn lên, giao tế và tâm linh)',
      chuSu: 'Chủ về ngoại giao, thương mại, giải trí, nghệ thuật, ẩm thực và huyền học',
      dacHam: 'Miếu địa: Sửu, Mùi • Vượng địa: Thìn, Tuất • Đắc địa: Dần, Thân • Hãm địa: Tý, Ngọ, Mão, Dậu, Tỵ, Hợi',
      cauPhu: 'Tham Hỏa tương phùng, danh chấn chư bang — Tham Lang gặp Hỏa/Linh phát phú quý vang dội.',
      cotLoi: 'Tham Lang rất ưa đóng tại 4 cung Mộ (Thìn, Tuất, Sửu, Mùi) và cực kỳ thích gặp Hỏa Tinh, Linh Tinh để tạo thành cách Hỏa Tham / Linh Tham.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Hiểu đúng về chữ Tham và chữ Đào Hoa của sao Tham Lang',
        transcript: 'Nhiều người nghe tên sao Tham Lang liền nghĩ ngay đến sự tham lam hay đào hoa trăng gió. Thực chất trong Tử Vi Đẩu Số, chữ Tham ở đây là khát vọng sống, khát vọng chinh phục những đỉnh cao mới và sự ham học hỏi đa lĩnh vực. Người mệnh Tham Lang cực kỳ thông minh trong giao tiếp xã hội, bước vào bất kỳ đám đông nào cũng biết cách làm chủ bầu không khí.',
      },
      {
        time: '07:30',
        title: 'Vì sao Tham Lang sợ Không Kiếp nhưng lại cực thích Hỏa Tinh, Linh Tinh?',
        transcript: 'Trong Lục Sát tinh, hầu hết các chính tinh đều ngại Hỏa Tinh và Linh Tinh, duy chỉ có sao Tham Lang là ngoại lệ. Khi Tham Lang ở vị trí Miếu Vượng (đặc biệt tại Thìn, Tuất, Sửu, Mùi) gặp Hỏa Tinh hoặc Linh Tinh mà không bị Không Kiếp, Hóa Kỵ phá đám thì tạo thành đại cách cục Tham Hỏa Tương Phùng và Tham Linh Tịnh Thủ — chủ về nắm bắt thời cơ làm giàu cực nhanh trên thương trường.',
      },
      {
        time: '14:15',
        title: 'Từ Chánh Đào Hoa lúc trẻ đến niềm đam mê Huyền học, Tâm linh tuổi trung niên',
        transcript: 'Một đặc điểm rất hay của sao Tham Lang là khi còn trẻ thì đam mê giao lưu, kinh doanh, nghệ thuật; nhưng càng về trung niên và hậu vận (đặc biệt khi đi cùng Hoa Cái, Không Vong) lại rất có căn duyên và trực giác sâu sắc với triết học, tôn giáo, Tử Vi, Phong Thủy.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Tính Của Sao Tham Lang: Ngoại Giao, Thương Mại &amp; Đa Tài</h2>
      <p><strong>Tham Lang</strong> đứng đầu bộ <em>Sát – Phá – Tham</em> về khả năng ngoại giao, đàm phán và thích ứng linh hoạt với thị trường:</p>
      <ul>
        <li><strong>Điểm mạnh:</strong> Giao tiếp cuốn hút, nhạy bén với tâm lý đám đông, giỏi tổ chức sự kiện, kinh doanh dịch vụ, thương mại, giải trí, truyền thông, ẩm thực, làm đẹp.</li>
        <li><strong>Cách cục đắc lực nhất:</strong> <strong>Tham Lang cư Tứ Mộ (Thìn, Tuất, Sửu, Mùi)</strong> hội <strong>Hỏa Tinh / Linh Tinh / Hóa Lộc / Hóa Quyền</strong> — phát tài lộc lớn và giữ được cơ đồ vững chắc.</li>
        <li><strong>Điểm cần tiết chế:</strong> Khi Tham Lang cư Tý, Hợi (<em>Phiếm Thủy Đào Hoa</em>) gặp thêm Đào Hồng, Riêu Đà thì cần giữ kỷ luật trong chuyện tình cảm và tránh đầu cơ cảm tính.</li>
      </ul>
      <h2>2. Bảng Các Tổ Hợp Đặc Biệt Của Sao Tham Lang</h2>
      <table>
        <thead>
          <tr>
            <th>Tổ hợp Sao</th>
            <th>Điều kiện thành cách</th>
            <th>Ý nghĩa thực chiến</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Hỏa Tham / Linh Tham</strong></td>
            <td>Tham Lang (Miếu/Vượng) hội Hỏa Tinh hoặc Linh Tinh</td>
            <td>Nắm bắt cơ hội thị trường cực nhạy, bùng nổ tài chính mạnh mẽ (<em>Phát dã như lôi</em>).</td>
          </tr>
          <tr>
            <td><strong>Vũ Tham Đồng Hành</strong></td>
            <td>Vũ Khúc – Tham Lang đồng cung tại Sửu / Mùi</td>
            <td>Trước 30 tuổi rèn giũa vất vả, sau 30 tuổi phát đạt lớn cả về quyền lẫn tiền.</td>
          </tr>
          <tr>
            <td><strong>Tham Vũ Tứ Mộ</strong></td>
            <td>Tham Lang độc thủ tại Thìn / Tuất đối chiếu Vũ Khúc</td>
            <td>Bản lĩnh kinh doanh thực tế, càng về trung vận càng giàu có.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-12',
    number: 12,
    moduleId: 2,
    title: 'Sao Cự Môn: Ám Tinh Ngôn Ngữ, Tư Duy Phản Biện & Hóa Giải Thị Phi',
    subtitle: 'Cách biến năng lượng Ám Tinh của Cự Môn thành vũ khí sắc bén trong luật pháp, giảng dạy, truyền thông và thương thuyết.',
    isFreePreview: false,
    duration: '18:55',
    relatedStars: ['Cự Môn', 'Thái Dương', 'Thiên Cơ', 'Thiên Đồng'],
    flashcard: {
      nguHanh: 'Âm Thủy (Quý Thủy — Dòng nước sâu thẳm và khả năng đào sâu bản chất sự việc)',
      hoaKhi: 'Ám Tinh (Chủ về ngôn từ, lập luận sắc bén, nghi ngờ phản biện và thị phi nếu hãm địa)',
      chuSu: 'Chủ về khẩu tài, luật sư, giảng viên, nhà báo, marketing, đàm phán thương mại',
      dacHam: 'Miếu/Vượng: Mão, Dậu, Tý, Ngọ, Dần, Thân • Hãm địa: Thìn, Tuất, Sửu, Mùi, Tỵ, Hợi',
      cauPhu: 'Thạch Trung Ẩn Ngọc (Cự Môn cư Tý Ngọ hội Khoa Quyền Lộc) — Ngọc quý ẩn trong đá, càng mài càng sáng.',
      cotLoi: 'Cự Môn cực cần ánh sáng của Thái Dương hoặc bộ Hóa Lộc, Hóa Quyền, Hóa Khoa để biến lời nói thành tiền tài và danh vọng.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Tại sao gọi Cự Môn là Ám Tinh? Hiểu đúng để không sợ Cự Môn',
        transcript: 'Nhiều sách cũ dịch chữ Ám Tinh của Cự Môn là ngôi sao mờ ám, thị phi khiến người có Cự Môn thủ Mệnh rất lo lắng. Nhưng hiểu theo ngôn ngữ hiện đại và thực chứng, chữ Ám của Cự Môn là khả năng nhìn thấu những góc khuất mà người khác không nhìn thấy, tức là tư duy phản biện (Critical Thinking) và năng lực ngôn ngữ sắc bén. Người mệnh Cự Môn không bao giờ tin một điều gì nếu chưa tự mình kiểm chứng lý lẽ.',
      },
      {
        time: '06:45',
        title: 'Cách cục Thạch Trung Ẩn Ngọc (Cự Môn tại Tý Ngọ)',
        transcript: 'Khi Cự Môn đóng độc thủ tại hai cung Tý và Ngọ, hội hợp với Hóa Lộc, Hóa Quyền, Hóa Khoa hoặc Lộc Tồn thì tạo thành đại cách cục Thạch Trung Ẩn Ngọc — viên ngọc quý nằm ẩn bên trong tảng đá. Người mang cách này không thích phô trương hào nhoáng bề ngoài, nhưng khi cất tiếng nói trong phòng họp hay trên bục giảng thì ai cũng phải nể phục vì lập luận quá chặt chẽ.',
      },
      {
        time: '13:20',
        title: 'Cách dùng nghề nghiệp liên quan đến Khẩu Tài để hóa giải thị phi của Cự Môn',
        transcript: 'Nguyên lý hóa giải thông minh nhất của Tử Vi là Thuận Theo Tượng Sao: vì Cự Môn chủ về cái miệng và ngôn từ, nếu bạn chủ động dùng lời nói để kiếm tiền mỗi ngày — như làm giáo viên, luật sư, tư vấn viên, MC, sáng tạo nội dung, bán hàng, ngoại giao — thì năng lượng của Cự Môn sẽ chuyển hóa hoàn toàn thành tài lộc thay vì biến thành tranh cãi vụn vặt trong đời sống.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Tính Cốt Lõi Của Sao Cự Môn: Khẩu Tài &amp; Tư Duy Phản Biện</h2>
      <p><strong>Cự Môn</strong> là sao thứ tư thuộc chòm Bắc Đẩu, mang hành <strong>Âm Thủy</strong>. Đây là ngôi sao đại diện cho năng lực ngôn ngữ, phân tích chuyên sâu và khả năng thuyết phục bằng lý lẽ:</p>
      <ul>
        <li><strong>Khi Cự Môn đắc địa + Hóa Lộc / Hóa Quyền / Hóa Khoa:</strong> Lời nói có trọng lượng ngàn cân, cực kỳ thành công trong nghề giảng dạy, luật sư, ngoại giao, thương mại, truyền thông.</li>
        <li><strong>Khi Cự Môn hãm địa + Hóa Kỵ, Đà La, Hỏa Linh:</strong> Dễ vướng hiểu lầm lời ăn tiếng nói hoặc tranh chấp giấy tờ; cần rèn nguyên tắc <em>"uốn lưỡi bảy lần trước khi nói"</em> và luôn làm việc bằng văn bản rõ ràng.</li>
      </ul>
      <h2>2. Bảng Các Cách Cục Đẹp Nhất Của Sao Cự Môn</h2>
      <table>
        <thead>
          <tr>
            <th>Tên Cách Cục</th>
            <th>Vị trí Địa Chi</th>
            <th>Đặc trưng nổi bật</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Thạch Trung Ẩn Ngọc</strong></td>
            <td>Cự Môn độc thủ tại Tý • Ngọ (hội Khoa Quyền Lộc)</td>
            <td>Tài năng thực chất ẩn bên trong sự khiêm nhường; càng lên vị trí cao càng phát huy trí tuệ lớn.</td>
          </tr>
          <tr>
            <td><strong>Cự Cơ Mão Dậu</strong></td>
            <td>Cự Môn – Thiên Cơ đồng cung tại Mão • Dậu</td>
            <td>Tư duy chiến lược (Thiên Cơ) + Khẩu tài đàm phán (Cự Môn): hợp thương mại lớn, xuất nhập khẩu, công nghệ.</td>
          </tr>
          <tr>
            <td><strong>Cự Nhật Đồng Lâm</strong></td>
            <td>Cự Môn – Thái Dương đồng cung tại Dần • Thân</td>
            <td>Ánh mặt trời hóa giải hoàn toàn tính Ám của Cự Môn; rất có duyên với ngoại ngữ và môi trường quốc tế.</td>
          </tr>
        </tbody>
      </table>
    `,
  },

  {
    id: 'bai-13',
    number: 13,
    moduleId: 2,
    title: 'Sao Thiên Tướng: Ấn Tinh Trọng Tín, Phò Tá Cấp Cao & Giáp Biên',
    subtitle: 'Vì sao xem Thiên Tướng bắt buộc phải xem hai cung kề bên là Tài Ấm Giáp Ấn hay Hình Kỵ Giáp Ấn?',
    isFreePreview: false,
    duration: '18:30',
    relatedStars: ['Thiên Tướng', 'Thiên Phủ', 'Tử Vi', 'Vũ Khúc', 'Liêm Trinh'],
    flashcard: {
      nguHanh: 'Dương Thủy (Nhâm Thủy — Dòng nước lớn hào hiệp, trọng danh dự và công lý)',
      hoaKhi: 'Ấn Tinh (Con dấu quyền lực của nhà vua, chủ về uy tín và chức vị)',
      chuSu: 'Chủ cung Quan Lộc; đại diện cho năng lực quản trị hành chính, nhân sự, pháp chế',
      dacHam: 'Miếu/Vượng: Dần, Thân, Tý, Ngọ, Thìn, Tuất, Sửu, Mùi • Đắc địa: Tỵ, Hợi • Hãm địa: Mão, Dậu',
      cauPhu: 'Tài Ấm giáp Ấn vi kỳ cách — Cự Môn Hóa Lộc và Thiên Lương kẹp hai bên Thiên Tướng là thượng cách.',
      cotLoi: 'Thiên Tướng rất sợ gặp Triệt Lộ (Ấn bị sứt mẻ) và rất nhạy cảm với các sao kẹp hai bên (Giáp cung).',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Thiên Tướng: Con dấu quyền lực và tinh thần hiệp nghĩa',
        transcript: 'Sao Thiên Tướng thuộc hành Dương Thủy, hóa khí là Ấn Tinh — tức là chiếc ấn ngọc của nhà vua. Người có Thiên Tướng thủ Mệnh ở vị trí Miếu Vượng thường có ngoại hình đĩnh đạc, ăn mặc chỉnh tề, coi trọng lời hứa, thấy chuyện bất bình chẳng tha và là người cộng sự đáng tin cậy bậc nhất.',
      },
      {
        time: '06:20',
        title: 'Bí quyết đọc Giáp Cung của Thiên Tướng: Tài Ấm Giáp Ấn vs. Hình Kỵ Giáp Ấn',
        transcript: 'Theo quy tắc an sao cố định, hai cung kề hai bên Thiên Tướng luôn luôn có một bên là Cự Môn và một bên là Thiên Lương. Nếu Cự Môn Hóa Lộc thì gọi là Tài Ấm Giáp Ấn — vừa có tiền tài vừa có phúc ấm che chở hai bên chiếc ấn, cực kỳ phú quý. Ngược lại, nếu Cự Môn Hóa Kỵ hoặc đi cùng Kình Dương, Thiên Hình kẹp hai bên thì gọi là Hình Kỵ Giáp Ấn — dễ chịu áp lực lớn từ cấp trên hoặc quy định pháp lý.',
      },
      {
        time: '12:50',
        title: 'Tại sao Thiên Tướng rất kỵ gặp sao Triệt?',
        transcript: 'Có câu phú kinh điển: Thiên Tướng tối hỷ Tả Hữu Xương Khúc, tối kỵ Triệt Lộ Không Vong. Chiếc ấn mà bị Triệt đóng vào giống như con dấu bị mẻ góc: nếu đóng ở Mệnh hoặc Quan Lộc thì buổi đầu lập nghiệp dễ phải thay đổi công việc hoặc có danh mà chậm có thực quyền cho tới sau tuổi 32 khi lực của Triệt giảm dần.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Tính Cốt Lõi Của Sao Thiên Tướng: Chữ Tín &amp; Phong Thái Lãnh Đạo</h2>
      <p><strong>Thiên Tướng</strong> thuộc chòm Nam Đẩu, mang hành <strong>Dương Thủy</strong>. Đây là ngôi sao của sự chuẩn mực, công tâm, trọng danh dự và có khả năng điều hòa mâu thuẫn trong tổ chức:</p>
      <ul>
        <li><strong>Khi Thiên Tướng đắc cách (Tài Ấm Giáp Ấn / Phủ Tướng Triều Viên):</strong> Giữ vị trí trọng yếu trong cơ quan, tập đoàn, ngân hàng, ngoại giao, quản trị nhân sự.</li>
        <li><strong>Khi Thiên Tướng gặp Triệt hoặc Hình Kỵ Giáp Ấn:</strong> Cần tuyệt đối cẩn trọng khi ký kết văn bản, ủy quyền con dấu và không đứng ra nhận trách nhiệm pháp lý thay người khác.</li>
      </ul>
      <h2>2. Bảng Phân Tích Các Thế Đứng Của Sao Thiên Tướng</h2>
      <table>
        <thead>
          <tr>
            <th>Vị trí Địa Chi</th>
            <th>Tổ hợp Sao</th>
            <th>Luận giải thực chiến</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Dần • Thân • Sửu • Mùi • Tỵ • Hợi</strong></td>
            <td>Thiên Tướng độc thủ</td>
            <td>Tại Dần Thân Sửu Mùi rất đắc lực; tại Tỵ Hợi linh hoạt, giỏi chuyên môn đối ngoại.</td>
          </tr>
          <tr>
            <td><strong>Tý • Ngọ</strong></td>
            <td>Liêm Trinh – Thiên Tướng</td>
            <td>Thủy chế Hỏa: nguyên tắc nhưng mềm dẻo, cực hợp pháp chế, quản lý nhà nước, tài chính.</td>
          </tr>
          <tr>
            <td><strong>Dần • Thân</strong></td>
            <td>Vũ Khúc – Thiên Tướng</td>
            <td>Tài tinh + Ấn tinh: vừa nắm quyền điều hành vừa nắm dòng tiền thương mại.</td>
          </tr>
          <tr>
            <td><strong>Thìn • Tuất</strong></td>
            <td>Tử Vi – Thiên Tướng</td>
            <td>Đế tinh cầm Ấn: có hoài bão lớn, quyết đoán cải tổ để xây dựng sự nghiệp riêng.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-14',
    number: 14,
    moduleId: 2,
    title: 'Sao Thiên Lương: Ấm Tinh Che Chở, Học Thuật Y Giáo & Nguyên Tắc Đạo Đức',
    subtitle: 'Ngôi sao của người thầy, người bác sĩ, sự trường thọ và lý do Thiên Lương không ưa đứng ra đầu cơ tiền bạc.',
    isFreePreview: false,
    duration: '18:10',
    relatedStars: ['Thiên Lương', 'Thái Dương', 'Thiên Cơ', 'Thiên Đồng'],
    flashcard: {
      nguHanh: 'Ấm Thổ đới Mộc (Sách cổ ghi Mộc/Thổ — Tượng cây cổ thụ che bóng mát và nền đất phúc ấm)',
      hoaKhi: 'Ấm Tinh & Thọ Tinh (Chủ về sự che chở, giải trừ tai ương, phúc thọ và sư phạm)',
      chuSu: 'Chủ cung Phụ Mẫu & Phúc Đức; đại diện cho y học, giáo dục, thanh tra, cố vấn',
      dacHam: 'Miếu/Vượng: Ngọ, Thìn, Tuất, Dần, Thân, Tý, Mão • Đắc địa: Sửu, Mùi • Hãm địa: Tỵ, Hợi, Dậu',
      cauPhu: 'Thiên Lương nguyệt hối, bất kiến đại tai — Có Thiên Lương miếu vượng thì gặp nguy hóa an.',
      cotLoi: 'Thiên Lương là ngôi sao thanh cao của học thuật và phúc ấm nên rất thích Hóa Khoa, Văn Xương nhưng lại kỵ Hóa Lộc đi kèm Sát tinh khi đầu cơ tiền bạc.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Thiên Lương: Hình tượng người Thầy giáo, Thầy thuốc và bậc Trưởng bối',
        transcript: 'Sao Thiên Lương hóa khí là Ấm Tinh — nghĩa là bóng râm che chở cho người khác và phúc ấm của tổ tiên để lại. Người có sao Thiên Lương thủ Mệnh ở vị trí Miếu Vượng thường có tác phong điềm đạm, chín chắn trước tuổi, thích giảng giải, khuyên nhủ, coi trọng đạo đức và có năng khiếu bẩm sinh trong ngành giáo dục, y dược, nghiên cứu khoa học, kiểm toán hoặc thanh tra.',
      },
      {
        time: '06:30',
        title: 'Năng lực Giải Ách của Thiên Lương: Gặp dữ hóa lành',
        transcript: 'Điểm quý giá nhất của sao Thiên Lương là khả năng giải tai ách. Người mệnh Thiên Lương hoặc cung Tật Ách, Phúc Đức có Thiên Lương sáng sủa thì trong đời nhiều lần gặp chuyện nguy hiểm hay bệnh tật đều bất ngờ gặp được thầy giỏi thuốc hay cứu giúp kịp thời.',
      },
      {
        time: '12:40',
        title: 'Vì sao Thiên Lương hợp làm Chuyên gia hơn là Đầu cơ lướt sóng?',
        transcript: 'Bản chất của Thiên Lương là Thanh Quý (trong sạch và danh giá). Khi người mệnh Thiên Lương tập trung vào chuyên môn, giảng dạy, y tế, tư vấn thì tiền bạc tự tìm đến rất bền. Nhưng nếu Thiên Lương lại cố lao vào đầu cơ tài chính lướt sóng ngắn hạn (đặc biệt khi gặp Lộc Tồn, Hóa Lộc kèm Không Kiếp) thì lại rất dễ bị tiểu nhân đố kỵ hoặc hao tài.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Tính Của Sao Thiên Lương: Thanh Cao, Phúc Thọ &amp; Học Thuật</h2>
      <p><strong>Thiên Lương</strong> thuộc chòm Nam Đẩu, hóa khí là <strong>Ấm Tinh</strong> và <strong>Thọ Tinh</strong>. Đây là ngôi sao mẫu mực nhất về đạo đức nghề nghiệp, chiều sâu học thuật và sự che chở của âm đức dòng họ:</p>
      <ul>
        <li><strong>Ngành nghề đắc cách nhất:</strong> Giảng viên, giáo viên, bác sĩ, dược sĩ, thẩm phán, kiểm toán, thanh tra, nghiên cứu học thuật, tư vấn mệnh lý – tâm lý.</li>
        <li><strong>Khi Thiên Lương cư Tỵ, Hợi, Dậu (Hãm địa):</strong> Tính cách phóng khoáng, thích tự do xê dịch, thường đổi chỗ ở hoặc đổi nghề vài lần thời trẻ rồi mới định hình chuyên môn.</li>
      </ul>
      <h2>2. Bảng Các Cách Cục Nổi Bật Của Sao Thiên Lương</h2>
      <table>
        <thead>
          <tr>
            <th>Cách cục Thiên Lương</th>
            <th>Vị trí Địa Chi</th>
            <th>Ý nghĩa luận giải thực chiến</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Thọ Tinh Nhập Miếu</strong></td>
            <td>Thiên Lương độc thủ tại Ngọ (hoặc Tý)</td>
            <td>Uy danh thanh cao, giữ chức vụ quản lý, giám sát cấp cao và trường thọ.</td>
          </tr>
          <tr>
            <td><strong>Dương Lương Xương Lộc</strong></td>
            <td>Thái Dương – Thiên Lương tại Mão hội Văn Xương, Lộc Tồn</td>
            <td>Cách cục đỗ đạt thi cử và học thuật lừng lẫy nhất trong Tử Vi Đẩu Số.</td>
          </tr>
          <tr>
            <td><strong>Cơ Lương Thiện Đàm Binh</strong></td>
            <td>Thiên Cơ – Thiên Lương tại Thìn • Tuất</td>
            <td>Trí tuệ chiến lược sắc bén, bậc thầy hoạch định kế hoạch và cố vấn.</td>
          </tr>
          <tr>
            <td><strong>Đồng Lương Tối Miếu</strong></td>
            <td>Thiên Đồng – Thiên Lương tại Dần • Thân</td>
            <td>Phúc ấm dày, cuộc đời bình an, hợp ngành y dược, giáo dục và dịch vụ nhân văn.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-15',
    number: 15,
    moduleId: 2,
    title: 'Sao Thất Sát: Tướng Tinh Khai Phá, Quyết Đoán Thương Trường & Biến Động Lớn',
    subtitle: 'Thanh gươm nguyên soái trên lá số: độc lập, can trường, dám đi vào thị trường khó để lập đại công.',
    isFreePreview: false,
    duration: '20:15',
    relatedStars: ['Thất Sát', 'Tử Vi', 'Vũ Khúc', 'Liêm Trinh', 'Phá Quân', 'Tham Lang'],
    flashcard: {
      nguHanh: 'Dương Kim đới Hỏa (Canh Kim — Thanh kiếm sắc bén đã tôi qua lửa)',
      hoaKhi: 'Quyền Tinh & Tướng Tinh (Vị nguyên soái cầm quân ngoài biên ải)',
      chuSu: 'Chủ về uy quyền thực chiến, quân sự, công nghiệp, phẫu thuật và kinh doanh đột phá',
      dacHam: 'Miếu/Vượng: Dần, Thân, Tý, Ngọ, Sửu, Mùi • Đắc địa: Mão, Dậu, Tỵ, Hợi • Bình/Hãm: Thìn, Tuất',
      cauPhu: 'Thất Sát triều đẩu, tước lộc vinh xương — Thất Sát cư Dần Thân Tý Ngọ uy danh hiển hách.',
      cotLoi: 'Người mệnh Thất Sát cực kỳ độc lập, quyết đoán nhanh, càng gặp nghịch cảnh càng lì đòn nhưng cần rèn sự mềm mỏng để giữ cộng sự.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Thất Sát: Vị tướng ngoài biên ải — Tiền trảm hậu tấu',
        transcript: 'Trong bộ Sát - Phá - Tham, Thất Sát là vị nguyên soái cầm quân ngoài mặt trận. Mang hành Kim đới Hỏa, người có sao Thất Sát thủ Mệnh có ánh mắt sắc, hành động cực kỳ dứt khoát, đã quyết việc gì là làm ngay chứ không chần chừ. Họ là những người sinh ra để giải quyết khủng hoảng và mở đường ở những thị trường cạnh tranh khốc liệt nhất.',
      },
      {
        time: '06:50',
        title: 'Thất Sát Triều Đẩu và Thất Sát Ngưỡng Đẩu (Dần, Thân, Tý, Ngọ)',
        transcript: 'Khi Thất Sát đóng độc thủ tại Dần, Thân, Tý, Ngọ nhìn thẳng về cung đối diện có Tử Vi - Thiên Phủ hoặc Vũ Khúc - Thiên Phủ thì gọi là Thất Sát Triều Đẩu và Ngưỡng Đẩu. Đây là hình ảnh vị tướng tài ba được nhà vua giao trọn binh quyền, nếu hội thêm Lộc Tồn, Hóa Lộc, Hóa Quyền, Tả Hữu thì lập nên cơ nghiệp thương trường rất lớn.',
      },
      {
        time: '13:30',
        title: 'Tại sao cuộc đời người mệnh Thất Sát luôn có ít nhất một lần đại biến đổi?',
        transcript: 'Vì Thất Sát luôn nằm trong tam hợp với Phá Quân và Tham Lang, cuộc đời của người mệnh Thất Sát không bao giờ là một đường thẳng phẳng lặng. Thường ở giai đoạn ngoài 30 tuổi, họ sẽ trải qua một bước ngoặt lớn để lột xác từ người làm chuyên môn sang người làm chủ cuộc chơi.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Tính Cốt Lõi Của Sao Thất Sát: Uy Quyền, Độc Lập &amp; Thực Chiến</h2>
      <p><strong>Thất Sát</strong> thuộc chòm Nam Đẩu, mang hành <strong>Kim đới Hỏa</strong>. Đây là ngôi sao của tốc độ thực thi, bản lĩnh tự lập từ rất sớm và khả năng chịu áp lực cao:</p>
      <ul>
        <li><strong>Khi Thất Sát hội Tử Vi, Lộc Tồn, Khoa Quyền Lộc, Tả Hữu:</strong> <em>Hóa Sát vi Quyền</em> — trở thành nhà lãnh đạo doanh nghiệp, giám đốc sản xuất, bác sĩ ngoại khoa, kỹ sư trưởng xuất sắc.</li>
        <li><strong>Khi Thất Sát gặp Kình Đà, Không Kiếp, Bạch Hổ, Thiên Hình tại Hãm địa:</strong> Tránh nóng nảy quyết định tất tay, chú ý an toàn lao động, giao thông và giữ gìn sức khỏe phổi, xương khớp.</li>
      </ul>
      <h2>2. Bảng Phân Tích Các Thế Đứng Của Sao Thất Sát</h2>
      <table>
        <thead>
          <tr>
            <th>Cách cục Thất Sát</th>
            <th>Vị trí Địa Chi</th>
            <th>Luận giải trọng tâm</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Thất Sát Triều Đẩu / Ngưỡng Đẩu</strong></td>
            <td>Dần • Thân • Tý • Ngọ (độc thủ)</td>
            <td>Thế đứng đẹp nhất của Thất Sát: có tầm nhìn chiến lược và uy quyền điều hành thực tế.</td>
          </tr>
          <tr>
            <td><strong>Hùng Tú Triều Nguyên</strong></td>
            <td>Liêm Trinh – Thất Sát tại Sửu • Mùi</td>
            <td>Chuyên môn sắc bén kết hợp bản lĩnh kiên cường, tích lũy tài sản lớn từ trung niên.</td>
          </tr>
          <tr>
            <td><strong>Tử Sát Đồng Lâm</strong></td>
            <td>Tử Vi – Thất Sát tại Tỵ • Hợi</td>
            <td>Đế tinh chế Sát tinh thành quyền bính: cực hợp làm chủ doanh nghiệp độc lập.</td>
          </tr>
          <tr>
            <td><strong>Vũ Sát Đồng Cung</strong></td>
            <td>Vũ Khúc – Thất Sát tại Mão • Dậu</td>
            <td>Nhạy bén tài chính thương mại, cần thêm Lộc Tồn / Hóa Khoa để giữ nhịp ổn định.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-16',
    number: 16,
    moduleId: 2,
    title: 'Sao Phá Quân: Tiên Phong Đập Cũ Xây Mới, Hao Tinh & Điểm Bùng Nổ',
    subtitle: 'Vì sao Phá Quân luôn đi trước thời đại, dám phá bỏ lối mòn cũ để kiến tạo cơ nghiệp mới?',
    isFreePreview: false,
    duration: '19:20',
    relatedStars: ['Phá Quân', 'Tử Vi', 'Vũ Khúc', 'Liêm Trinh', 'Thất Sát', 'Tham Lang'],
    flashcard: {
      nguHanh: 'Âm Thủy (Quý Thủy — Sóng ngầm cuộn trào phá vỡ đê điều cũ kỹ)',
      hoaKhi: 'Hao Tinh (Chủ về sự tiêu hao cái cũ để đổi mới và đột phá)',
      chuSu: 'Chủ cung Phu Thê & Tử Tức; đại diện cho lực lượng tiên phong, R&D, tái cấu trúc',
      dacHam: 'Miếu/Vượng: Tý, Ngọ, Thìn, Tuất • Đắc địa: Sửu, Mùi • Hãm địa: Dần, Thân, Mão, Dậu, Tỵ, Hợi',
      cauPhu: 'Phá Quân Tý Ngọ, Anh Tinh Nhập Miếu — Phá Quân cư Tý Ngọ hội Lộc Quyền uy danh hiển đạt.',
      cotLoi: 'Phá Quân là Tiên Phá Hậu Thành (phá cái cũ trước rồi mới xây cái mới thành công sau); rất cần Hóa Lộc hoặc Lộc Tồn để bù đắp tính Hao.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Phá Quân: Đội quân tiên phong mở đường trên lá số',
        transcript: 'Nếu Thất Sát là vị tướng chỉ huy toàn cục thì Phá Quân là đội quân tiên phong đi đầu đập tan chướng ngại vật. Thuộc hành Âm Thủy, hóa khí là Hao Tinh, bản chất của Phá Quân là không bao giờ chịu ngồi yên trong một khuôn khổ cũ kỹ. Người mệnh Phá Quân cực kỳ sáng tạo, dám nghĩ dám làm những điều chưa ai từng thử.',
      },
      {
        time: '06:45',
        title: 'Anh Tinh Nhập Miếu: Phá Quân độc thủ tại Tý và Ngọ',
        transcript: 'Đẹp nhất của sao Phá Quân là khi đóng độc thủ tại hai cung Tý và Ngọ, cổ nhân gọi là Anh Tinh Nhập Miếu. Đặc biệt người tuổi Giáp, Quý sinh ra có Phá Quân cư Tý Ngọ hội Hóa Lộc, Hóa Quyền, Lộc Tồn thì tài năng cải cách và kinh doanh đạt tới đỉnh cao.',
      },
      {
        time: '13:15',
        title: 'Tại sao Phá Quân rất cần Hóa Lộc và Lộc Tồn nhưng lại kỵ Văn Xương, Văn Khúc?',
        transcript: 'Vì Phá Quân là Hao Tinh (tiêu hao năng lượng và tiền vốn lớn để đầu tư cái mới), nếu có Lộc Tồn hoặc Hóa Lộc đi kèm thì gọi là Có Nguồn Bù Hao — phá cái cũ đi là xây ngay được cơ ngơi mới to đẹp hơn. Còn với Văn Xương, Văn Khúc vốn là sao văn nghệ thư sinh, khi đi với võ tinh hung mãnh như Phá Quân lại dễ lệch nhịp, trừ phi làm trong ngành sáng tạo nghệ thuật hiện đại.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Tính Của Sao Phá Quân: Tiên Phá Hậu Thành</h2>
      <p><strong>Phá Quân</strong> thuộc chòm Bắc Đẩu, mang hành <strong>Âm Thủy</strong>. Trong bộ <em>Sát – Phá – Tham</em>, Phá Quân là mũi nhọn đột phá mạnh nhất:</p>
      <ul>
        <li><strong>Quy luật vận hành:</strong> Mọi thành công của Phá Quân đều đi qua công thức <strong>Tiên Phá Hậu Thành</strong> — phải dám thay đổi môi trường cũ, tái cấu trúc mô hình cũ thì mới bùng nổ.</li>
        <li><strong>Điều kiện đắc cách:</strong> Phá Quân gặp <strong>Hóa Lộc, Hóa Quyền, Lộc Tồn, Tả Phù, Hữu Bật</strong> giúp biến sự táo bạo thành thành quả tài chính thực chất.</li>
      </ul>
      <h2>2. Bảng Phân Tích Các Thế Đứng Của Sao Phá Quân</h2>
      <table>
        <thead>
          <tr>
            <th>Vị trí Địa Chi</th>
            <th>Tổ hợp Sao</th>
            <th>Luận giải thực chiến</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tý • Ngọ</strong></td>
            <td>Phá Quân độc thủ (<em>Anh Tinh Nhập Miếu</em>)</td>
            <td>Thông minh lỗi lạc, quyết đoán cải cách, lập đại nghiệp khi hội Khoa Quyền Lộc.</td>
          </tr>
          <tr>
            <td><strong>Thìn • Tuất</strong></td>
            <td>Phá Quân độc thủ tại La Võng</td>
            <td>Nghị lực phi thường vượt qua rào cản thời trẻ để làm chủ chuyên môn hoặc doanh nghiệp.</td>
          </tr>
          <tr>
            <td><strong>Sửu • Mùi</strong></td>
            <td>Tử Vi – Phá Quân</td>
            <td>Vừa có tầm nhìn lãnh đạo (Tử Vi) vừa có sức đột phá (Phá Quân), hợp kinh doanh đa ngành.</td>
          </tr>
          <tr>
            <td><strong>Dần • Thân • Tỵ • Hợi • Mão • Dậu</strong></td>
            <td>Phá Quân độc thủ / Vũ Phá / Liêm Phá</td>
            <td>Hợp làm kỹ thuật công nghệ cao, xuất nhập khẩu, vận tải, lập nghiệp phương xa.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-17',
    number: 17,
    moduleId: 3,
    title: 'Tứ Hóa (Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ): Động Cơ Kích Hoạt Lá Số',
    subtitle: 'Cách thuộc lòng bảng Tứ Hóa 10 Thiên Can và giải mã chính xác Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ tại từng cung.',
    isFreePreview: false,
    duration: '22:10',
    relatedStars: ['Hóa Lộc', 'Hóa Quyền', 'Hóa Khoa', 'Hóa Kỵ', 'Lộc Tồn'],
    flashcard: {
      nguHanh: 'Hóa Lộc (Mộc/Thổ) • Hóa Quyền (Mộc/Hỏa) • Hóa Khoa (Thủy/Mộc) • Hóa Kỵ (Thủy)',
      hoaKhi: 'Tứ Thời Biến Hóa — Xuân (Lộc) • Hạ (Quyền) • Thu (Khoa) • Đông (Kỵ)',
      chuSu: 'Kích hoạt tài lộc (Lộc), quyền bính (Quyền), danh tiếng & giải ách (Khoa), áp lực &执착 (Kỵ)',
      dacHam: 'Tam Hóa liên châu (Khoa – Quyền – Lộc hội chiếu Mệnh Tài Quan) là thượng cách phú quý',
      cauPhu: 'Khoa Quyền Lộc hội, phú quý song toàn; Hóa Kỵ cư Tứ Mộ, phản vi giai luận.',
      cotLoi: 'Chính tinh là chiếc xe, Tứ Hóa là xăng và động cơ: nhìn cung có Hóa Lộc và Hóa Kỵ là biết ngay nơi khởi phát tài lộc và nơi tập trung nợ nghiệp của đời người.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Vì sao cao thủ Tử Vi luôn tìm 4 sao Tứ Hóa đầu tiên trên lá số?',
        transcript: 'Nếu 14 Chính tinh là phần xác của ngôi nhà thì 4 sao Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ chính là dòng điện chạy bên trong ngôi nhà đó. Hóa Lộc chỉ nơi tiền bạc, cơ hội và nhân duyên chảy về dễ nhất; Hóa Quyền chỉ nơi bạn muốn kiểm soát và khẳng định thực lực; Hóa Khoa chỉ nơi bạn có kiến thức, bằng cấp và quý nhân cứu giải; còn Hóa Kỵ chỉ nơi bạn trăn trở nhiều nhất, mắc nợ tâm lý nhiều nhất trong cuộc đời.',
      },
      {
        time: '08:15',
        title: 'Khẩu quyết nhớ nhanh Bảng Tứ Hóa của 10 Thiên Can',
        transcript: 'Mỗi Thiên Can năm sinh từ Giáp đến Quý sẽ làm cho 4 chính tinh hoặc phụ tinh biến hóa: Tuổi Giáp là Liêm - Phá - Vũ - Dương; Tuổi Ất là Cơ - Lương - Tử - Nguyệt; Tuổi Bính là Đồng - Cơ - Xương - Liêm; Tuổi Đinh là Nguyệt - Đồng - Cơ - Cự; Tuổi Mậu là Tham - Nguyệt - Bật - Cơ; Tuổi Kỷ là Vũ - Tham - Lương - Khúc; Tuổi Canh là Nhật - Vũ - Âm - Đồng; Tuổi Tân là Cự - Nhật - Khúc - Xương; Tuổi Nhâm là Lương - Tử - Phủ - Vũ; và Tuổi Quý là Phá - Cự - Âm - Tham.',
      },
      {
        time: '15:40',
        title: 'Bí mật về Hóa Kỵ: Khi nào Hóa Kỵ lại làm nên chuyên gia đại tài?',
        transcript: 'Đừng bao giờ thấy Hóa Kỵ mà vội kết luận xấu hết! Hóa Kỵ thuộc hành Thủy, mang tính thu liễm,执착 (tập trung cao độ vào một điểm). Khi Hóa Kỵ đóng ở 4 cung Thìn, Tuất, Sửu, Mùi hoặc đi cùng Hóa Khoa, người đó có khả năng đào sâu nghiên cứu một lĩnh vực chuyên môn cực khó như lập trình, y khoa, kế toán kiểm toán để trở thành chuyên gia không ai thay thế được.',
      },
    ],
    contentHtml: `
      <h2>1. Ý Nghĩa Chuyên Sâu Của Bộ Tứ Hóa Trên 12 Cung</h2>
      <ul>
        <li><strong>Hóa Lộc (Nhân duyên &amp; Dòng tiền):</strong> Đóng ở Mệnh/Tài/Quan/Điền thì kiếm tiền thuận lợi, buôn may bán đắt; đóng ở Phu Thê/Phúc Đức thì được nhờ bạn đời và dòng họ.</li>
        <li><strong>Hóa Quyền (Thực quyền &amp; Bản lĩnh):</strong> Tạo ra sức bật thăng tiến, năng lực quản lý, tự chủ chuyên môn.</li>
        <li><strong>Hóa Khoa (Học thuật, Danh tiếng &amp; Đệ nhất Giải thần):</strong> Hóa giải tai ách, mang lại uy tín thương hiệu, thi cử đỗ đạt.</li>
        <li><strong>Hóa Kỵ (Áp lực, Thị phi &amp; Sự tập trung chuyên sâu):</strong> Đóng ở cung nào là cung đó tốn nhiều tâm sức nhất; cần dùng sự minh bạch và Hóa Khoa để hóa giải.</li>
      </ul>
      <h2>2. Bảng Tra Cứu Tứ Hóa Theo 10 Thiên Can Chuẩn Xác</h2>
      <table>
        <thead>
          <tr>
            <th>Thiên Can</th>
            <th>Hóa Lộc</th>
            <th>Hóa Quyền</th>
            <th>Hóa Khoa</th>
            <th>Hóa Kỵ</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><strong>Giáp</strong></td><td>Liêm Trinh</td><td>Phá Quân</td><td>Vũ Khúc</td><td>Thái Dương</td></tr>
          <tr><td><strong>Ất</strong></td><td>Thiên Cơ</td><td>Thiên Lương</td><td>Tử Vi</td><td>Thái Âm</td></tr>
          <tr><td><strong>Bính</strong></td><td>Thiên Đồng</td><td>Thiên Cơ</td><td>Văn Xương</td><td>Liêm Trinh</td></tr>
          <tr><td><strong>Đinh</strong></td><td>Thái Âm</td><td>Thiên Đồng</td><td>Thiên Cơ</td><td>Cự Môn</td></tr>
          <tr><td><strong>Mậu</strong></td><td>Tham Lang</td><td>Thái Âm</td><td>Hữu Bật</td><td>Thiên Cơ</td></tr>
          <tr><td><strong>Kỷ</strong></td><td>Vũ Khúc</td><td>Tham Lang</td><td>Thiên Lương</td><td>Văn Khúc</td></tr>
          <tr><td><strong>Canh</strong></td><td>Thái Dương</td><td>Vũ Khúc</td><td>Thái Âm (Thiên Đồng)</td><td>Thiên Đồng (Thái Âm)</td></tr>
          <tr><td><strong>Tân</strong></td><td>Cự Môn</td><td>Thái Dương</td><td>Văn Khúc</td><td>Văn Xương</td></tr>
          <tr><td><strong>Nhâm</strong></td><td>Thiên Lương</td><td>Tử Vi</td><td>Tả Phù (Thiên Phủ)</td><td>Vũ Khúc</td></tr>
          <tr><td><strong>Quý</strong></td><td>Phá Quân</td><td>Cự Môn</td><td>Thái Âm</td><td>Tham Lang</td></tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-18',
    number: 18,
    moduleId: 3,
    title: 'Lục Sát Tinh (Kình Đà, Không Kiếp, Hỏa Linh): Khi Nào Phát Lớn, Khi Nào Cần Thận Trọng?',
    subtitle: 'Giải mã sức mạnh bùng nổ của 6 ngôi sao Sát tinh khi đắc địa và nguyên tắc quản trị rủi ro khi hãm địa.',
    isFreePreview: false,
    duration: '21:00',
    relatedStars: ['Kình Dương', 'Đà La', 'Địa Không', 'Địa Kiếp', 'Hỏa Tinh', 'Linh Tinh'],
    flashcard: {
      nguHanh: 'Kình Đà (Kim) • Không Kiếp (Hỏa) • Hỏa Linh (Hỏa)',
      hoaKhi: 'Lục Sát Tinh — Phá cách khi Hãm địa, Phát dã như lôi khi Đắc địa đúng tổ hợp',
      chuSu: 'Chủ về đột phá công nghệ, kỹ thuật, quân sự, thương trường mạo hiểm và biến cố nhanh',
      dacHam: 'Kình Đà đắc địa tại Thìn Tuất Sửu Mùi • Không Kiếp đắc địa tại Dần Thân Tỵ Hợi • Hỏa Linh đắc địa tại Dần Ngọ Tuất Thân Tý Thìn',
      cauPhu: 'Thất Sát, Phá Quân, Tham Lang hội Lộc Mã Không Kiếp đắc địa: Phát dã như lôi.',
      cotLoi: 'Sát tinh giống như dòng điện cao thế: có cách điện và biến áp (Chính tinh miếu vượng, Khoa Quyền Lộc, Tuần Triệt) thì chạy cả nhà máy lớn.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Phân biệt rõ 3 cặp Sát tinh: Kình Đà, Không Kiếp và Hỏa Linh',
        transcript: 'Lục Sát Tinh chia làm 3 cặp với cơ chế tác động hoàn toàn khác nhau: Kình Dương - Đà La luôn kẹp hai bên Lộc Tồn (Kình Dương đánh trực diện công khai, Đà La dây dưa ngầm bên trong); Địa Không - Địa Kiếp an theo giờ sinh chủ về sự đột ngột không báo trước và tư duy phá vỡ giới hạn; còn Hỏa Tinh - Linh Tinh chủ về tốc độ phản ứng nhanh như chớp và sức nóng cảm xúc.',
      },
      {
        time: '07:40',
        title: 'Khi nào Lục Sát Tinh giúp con người làm giàu đột biến?',
        transcript: 'Trong thực tế thương trường hiện đại, những doanh nhân tự thân đi lên từ hai bàn tay trắng trong lĩnh vực công nghệ, sản xuất, xây dựng, đầu tư thường có Sát tinh đắc địa trong tam hợp Mệnh Tài Quan. Ví dụ Kình Dương cư Ngọ, Sửu, Mùi, Thìn, Tuất; Không Kiếp cư Tỵ Hợi Dần Thân đi cùng Sát Phá Tham đắc địa; hoặc Hỏa Tinh, Linh Tinh đi cùng Tham Lang.',
      },
      {
        time: '14:50',
        title: 'Nguyên tắc giữ tiền cho người có Không Kiếp, Hỏa Linh tại Tài Bạch',
        transcript: 'Đặc tính của Không Kiếp và Hỏa Linh đắc địa là Phát dã như lôi nhưng nếu chủ quan thì cũng rất dễ Tàn dã như phong. Do đó, ngay khi trúng lớn một thương vụ, nguyên tắc bắt buộc là phải rút ít nhất 50-60% lợi nhuận chuyển ngay sang bất động sản hữu hình (cung Điền Trạch) hoặc tài sản an toàn.',
      },
    ],
    contentHtml: `
      <h2>1. Cơ Chế Hoạt Động Của 3 Cặp Sát Tinh</h2>
      <ul>
        <li><strong>Cặp Kình Dương – Đà La (Hành Kim):</strong> Luôn đi kèm Lộc Tồn (<em>Kình Đà hiệp Lộc</em>). Đắc địa tại <strong>Thìn, Tuất, Sửu, Mùi</strong> giúp đương số kiên cường, quyết đoán, giỏi kỹ thuật, phẫu thuật, cơ khí, kinh doanh thực chiến.</li>
        <li><strong>Cặp Địa Không – Địa Kiếp (Hành Hỏa):</strong> Đắc địa tại <strong>Dần, Thân, Tỵ, Hợi</strong>. Mang lại tư duy sáng tạo ngược đám đông, dám làm dự án lớn nhưng cần kỷ luật quản trị vốn nghiêm ngặt.</li>
        <li><strong>Cặp Hỏa Tinh – Linh Tinh (Hành Hỏa):</strong> Đắc địa khi đi cùng <strong>Tham Lang, Tử Vi, Thiên Phủ, Vũ Khúc</strong> tạo nên sức bật tài chính nhanh nhạy.</li>
      </ul>
      <h2>2. Bảng Đối Chiếu Đắc Địa &amp; Hãm Địa Của Lục Sát Tinh</h2>
      <table>
        <thead>
          <tr>
            <th>Cặp Sát Tinh</th>
            <th>Vị trí Đắc địa</th>
            <th>Cách chuyển hóa năng lượng Sát Tinh thành Thành Tựu</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Kình Dương • Đà La</strong></td>
            <td>Thìn • Tuất • Sửu • Mùi</td>
            <td>Làm nghề đòi hỏi tính kỷ luật, kỹ thuật chính xác, luật pháp, quân sự, tài chính.</td>
          </tr>
          <tr>
            <td><strong>Địa Không • Địa Kiếp</strong></td>
            <td>Dần • Thân • Tỵ • Hợi</td>
            <td>Đầu tư theo từng giai đoạn có điểm chốt lời rõ ràng; ngay khi thắng lớn phải chuyển vào Điền sản.</td>
          </tr>
          <tr>
            <td><strong>Hỏa Tinh • Linh Tinh</strong></td>
            <td>Dần • Ngọ • Tuất • Thân • Tý • Thìn</td>
            <td>Phát huy trong ngành công nghệ, năng lượng, truyền thông, thương mại tốc độ cao.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-19',
    number: 19,
    moduleId: 3,
    title: 'Lục Cát Tinh (Tả Hữu, Xương Khúc, Khôi Việt) & Bộ Đào Hoa – Hồng Loan – Thiên Hỷ',
    subtitle: 'Cách nhận diện quý nhân nâng đỡ, năng lực khoa bảng và nhân duyên tình cảm – khách hàng trên lá số.',
    isFreePreview: false,
    duration: '19:10',
    relatedStars: ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt', 'Đào Hoa', 'Hồng Loan', 'Thiên Hỷ'],
    flashcard: {
      nguHanh: 'Tả Hữu (Thổ/Thủy) • Xương Khúc (Kim/Thủy) • Khôi Việt (Hỏa) • Đào Hồng Hỷ (Mộc/Thủy)',
      hoaKhi: 'Lục Cát Tinh (Trợ lực, Khoa bảng, Quý nhân) & Tam Minh (Nhân duyên, Thẩm mỹ)',
      chuSu: 'Quyết định quy mô cộng sự, bằng cấp học thuật, cơ hội thăng tiến và sức hút cá nhân',
      dacHam: 'Hội đủ Lục Cát quanh Tử Phủ Vũ Tướng hoặc Cơ Nguyệt Đồng Lương là đại quý cách',
      cauPhu: 'Tả Hữu đồng cung, phi phàm chi cách; Đào Hồng nhập Mệnh, duyên dáng đa tài.',
      cotLoi: 'Tả Hữu là cộng sự đồng cấp; Khôi Việt là quý nhân cấp trên nâng đỡ; Xương Khúc là trí tuệ văn bằng; Đào Hồng Hỷ là sức hút nhân duyên và thương hiệu.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Phân biệt chính xác vai trò của Tả Hữu, Xương Khúc và Khôi Việt',
        transcript: 'Trong Lục Cát Tinh, mỗi cặp sao đóng một vai trò rất riêng: Tả Phù - Hữu Bật là số lượng cộng sự, nhân viên và khả năng làm việc nhóm (không có Tả Hữu thì làm chủ rất cô đơn); Văn Xương - Văn Khúc là trí tuệ học thuật, bằng cấp, khả năng viết lách và nghệ thuật; còn Thiên Khôi - Thiên Việt là Quý Nhân cấp trên trực tiếp nâng đỡ và trao cơ hội cho bạn.',
      },
      {
        time: '07:10',
        title: 'Tam Minh: Đào Hoa, Hồng Loan và Thiên Hỷ trong tình duyên và kinh doanh',
        transcript: 'Bộ ba Đào Hoa - Hồng Loan - Thiên Hỷ gọi là Tam Minh. Ngoài ý nghĩa về tình yêu đôi lứa và tín hiệu kết hôn, trong xã hội hiện đại bộ Đào Hồng Hỷ tại Mệnh, Tài, Quan, Thiên Di còn là ngôi sao của Nhân Duyên Khách Hàng (Personal Branding). Người có Đào Hồng Hỷ đắc cách làm kinh doanh dịch vụ, nghệ thuật, giảng dạy, truyền thông cực kỳ thu hút khách hàng.',
      },
    ],
    contentHtml: `
      <h2>1. Hệ Thống Lục Cát Tinh: 3 Cặp Đôi Nâng Tầm Lá Số</h2>
      <ul>
        <li><strong>Tả Phù – Hữu Bật:</strong> Chủ về đội ngũ cộng sự, khả năng tổ chức và hậu thuẫn từ tập thể.</li>
        <li><strong>Văn Xương – Văn Khúc:</strong> Chủ về học vấn, bằng cấp, tư duy ngôn ngữ, văn chương, nghệ thuật.</li>
        <li><strong>Thiên Khôi – Thiên Việt (Tọa Quý Hướng Quý):</strong> Chủ về cơ hội may mắn, quý nhân là lãnh đạo hoặc bậc tiền bối dẫn dắt.</li>
      </ul>
      <h2>2. Bảng Phân Biệt Đào Hoa • Hồng Loan • Thiên Hỷ</h2>
      <table>
        <thead>
          <tr>
            <th>Ngôi Sao</th>
            <th>Ngũ Hành</th>
            <th>Ý nghĩa Tình cảm &amp; Sự nghiệp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Đào Hoa</strong></td>
            <td>Mộc</td>
            <td>Sức hút ngoại hình, tài hoa nghệ thuật, duyên đám đông và khách hàng trẻ.</td>
          </tr>
          <tr>
            <td><strong>Hồng Loan</strong></td>
            <td>Thủy</td>
            <td>Nhân duyên chính thống, tình cảm sâu sắc, tín hiệu cưới hỏi và lập gia thất.</td>
          </tr>
          <tr>
            <td><strong>Thiên Hỷ</strong></td>
            <td>Thủy</td>
            <td>Niềm vui hỷ sự, thêm con thêm cháu, hóa giải u buồn và mang lại may mắn bất ngờ.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-20',
    number: 20,
    moduleId: 3,
    title: 'Vòng Thái Tuế, Vòng Lộc Tồn & Cơ Chế Đổi Chiều Của Tuần – Triệt',
    subtitle: 'Cách đọc 4 tam hợp vòng Thái Tuế, giữ lộc của Lộc Tồn và phân biệt rõ Tuần Không với Triệt Lộ.',
    isFreePreview: false,
    duration: '21:30',
    relatedStars: ['Thái Tuế', 'Bạch Hổ', 'Quan Phù', 'Tang Môn', 'Tuế Phá', 'Thiếu Dương', 'Lộc Tồn', 'Thiên Mã'],
    flashcard: {
      nguHanh: 'Vòng Thái Tuế (12 sao theo Địa Chi năm) • Vòng Lộc Tồn (12 sao theo Thiên Can năm)',
      hoaKhi: 'Thái Tuế chủ Lý Lẽ & Tư Cách • Lộc Tồn chủ Tài Lộc & Thiên Lộc • Tuần Triệt chủ Đảo Chiều',
      chuSu: 'Định hình tâm tính đạo đức, cách ứng xử xã hội và sự bền vững của tài sản',
      dacHam: 'Lộc Mã Giao Trì (Lộc Tồn đồng cung/xung chiếu Thiên Mã) là thượng cách làm giàu thương mại',
      cauPhu: 'Triệt đáo Kim cung, Tuần lâm Hỏa địa — Triệt mạnh tiền vận (trước 30), Tuần ảnh hưởng bền bỉ hậu vận.',
      cotLoi: 'Nhìn cung Mệnh nằm ở tam hợp nào của Vòng Thái Tuế là đọc ngay được thái độ sống của người đó trước xã hội.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Bốn nhóm người trong Vòng Thái Tuế: Chính trực, Khéo léo, Nhẫn nhịn và Phản kháng',
        transcript: 'Vòng Thái Tuế chia 12 cung thành 4 tam hợp rõ rệt: Nhóm 1 là Thái Tuế - Quan Phù - Bạch Hổ (chính trực, lý lẽ đanh thép, dám chịu trách nhiệm); Nhóm 2 là Thiếu Dương - Tử Phù - Phúc Đức (thông minh sắc sảo, biết mình biết ta, có Thiên Không đi kèm nên cần biết điểm dừng); Nhóm 3 là Tang Môn - Tuế Phá - Điếu Khách (nội tâm phản biện mạnh, dám đi ngược số đông); và Nhóm 4 là Thiếu Âm - Long Đức - Trực Phù (ôn hòa, nhẫn nhịn, lấy nhu thắng cương, hậu vận rất bền).',
      },
      {
        time: '08:20',
        title: 'Lộc Tồn và cách cục Lộc Mã Giao Trì',
        transcript: 'Nếu Hóa Lộc là dòng tiền linh hoạt thì Lộc Tồn là Thiên Lộc — tài sản tích lũy bền vững, đi kèm Bác Sĩ và luôn có Kình Dương, Đà La đứng hai bên bảo vệ. Khi Lộc Tồn đi cùng Thiên Mã (Lộc Mã Giao Trì), tiền bạc sinh sôi mạnh mẽ qua sự vận động, thương mại, xuất nhập khẩu và mở rộng thị trường.',
      },
      {
        time: '15:10',
        title: 'Tuần và Triệt: Khi nào tháo gỡ bế tắc, khi nào cản trở?',
        transcript: 'Triệt thuộc Kim nên chém rất mạnh từ lúc nhỏ đến khoảng 30-32 tuổi rồi giảm dần; còn Tuần thuộc Hỏa/Thủy nhẹ hơn nhưng kéo dài suốt đời. Nếu đóng vào cung có Chính tinh Miếu Vượng thì gây vất vả buổi đầu; nhưng nếu đóng vào cung Vô Chính Diệu hoặc cung có Chính tinh Hãm địa, Không Kiếp, Hóa Kỵ thì Tuần Triệt lại là tấm khiên bảo vệ tuyệt vời (Triệt đáo hoàn toàn).',
      },
    ],
    contentHtml: `
      <h2>1. Bốn Tam Hợp Của Vòng Thái Tuế &amp; Tâm Lý Hành Vi</h2>
      <table>
        <thead>
          <tr>
            <th>Tam Hợp Vòng Thái Tuế</th>
            <th>Bộ Sao Đi Kèm</th>
            <th>Đặc điểm tính cách &amp; Thế đứng xã hội</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Thái Tuế – Quan Phù – Bạch Hổ</strong></td>
            <td>Tứ Linh (Long, Phượng, Hổ, Cái)</td>
            <td>Chính trực, trọng lý lẽ, nghị lực cao, hợp làm lãnh đạo, luật pháp, quản lý.</td>
          </tr>
          <tr>
            <td><strong>Thiếu Dương – Tử Phù – Phúc Đức</strong></td>
            <td>Đào Hoa • Thiên Không • Kiếp Sát</td>
            <td>Cực kỳ thông minh, nhạy bén thời cuộc; cần biết chốt lời và giữ chữ tín.</td>
          </tr>
          <tr>
            <td><strong>Tang Môn – Tuế Phá – Điếu Khách</strong></td>
            <td>Thiên Mã • Khốc Hư</td>
            <td>Năng động, dám đấu tranh đổi mới, hợp lập nghiệp xa quê hương.</td>
          </tr>
          <tr>
            <td><strong>Thiếu Âm – Long Đức – Trực Phù</strong></td>
            <td>Hồng Loan • Thiên Hỷ</td>
            <td>Khiêm nhường, nhân hậu, biết nhường nhịn để giữ đại cục, phúc hậu bền lâu.</td>
          </tr>
        </tbody>
      </table>
      <h2>2. Quy Tắc Đọc Tuần Trung Không Vong &amp; Triệt Lộ Không Vong</h2>
      <ul>
        <li><strong>Đóng tại cung Chính tinh Miếu Vượng:</strong> Làm chậm tốc độ phát triển ở tiền vận (phải tự lực vất vả trước tuổi 30), sau 32 tuổi khi Triệt tháo dần sẽ bứt phá mạnh.</li>
        <li><strong>Đóng tại cung Vô Chính Diệu hoặc Chính tinh Hãm địa / Sát tinh:</strong> Biến hung thành cát, giúp đương số giữ vững bản lĩnh và hóa giải tai ương.</li>
      </ul>
    `,
  },
  {
    id: 'bai-21',
    number: 21,
    moduleId: 4,
    title: 'Cách Cục Lớn (Phần 1): Tử Phủ Vũ Tướng & Cơ Nguyệt Đồng Lương',
    subtitle: 'So sánh thế đứng Làm Chủ Quản Trị (Tử Phủ Vũ Tướng) và thế đứng Chuyên Gia Tham Mưu (Cơ Nguyệt Đồng Lương).',
    isFreePreview: false,
    duration: '20:30',
    relatedStars: ['Tử Vi', 'Thiên Phủ', 'Vũ Khúc', 'Thiên Tướng', 'Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'],
    flashcard: {
      nguHanh: 'Tổ hợp Tĩnh Tinh: Quản trị hệ thống, Tài chính, Học thuật & Chuyên môn sâu',
      hoaKhi: 'Tử Phủ Vũ Tướng (Quản trị & Tài chính) • Cơ Nguyệt Đồng Lương (Tham mưu & Chuyên gia)',
      chuSu: 'Định hình lộ trình sự nghiệp bền vững, quản lý tổ chức và tích lũy tài sản an toàn',
      dacHam: 'Cần hội Tả Hữu, Xương Khúc, Khôi Việt, Khoa Quyền Lộc và tránh Lục Sát tinh phá cách',
      cauPhu: 'Tử Phủ Vũ Tướng triều viên, thực lộc vạn chung; Cơ Nguyệt Đồng Lương tác lại nhân.',
      cotLoi: 'Hai cách cục này ưa sự bài bản, kỷ luật, nâng đỡ của tổ chức và rất sợ Không Kiếp làm đảo lộn quy trình.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Bức tranh tổng thể của nhóm Tĩnh Tinh: Tử Phủ Vũ Tướng và Cơ Nguyệt Đồng Lương',
        transcript: 'Khi phân loại 14 Chính tinh theo cách cục lớn, Tử Phủ Vũ Tướng và Cơ Nguyệt Đồng Lương thuộc nhóm Tĩnh — tức là phát triển dựa trên trật tự, hệ thống, học thức và quy trình chuẩn mực. Người mang hai cách cục này không thích kiểu đánh cược may rủi một mất một còn mà xây dựng cơ đồ từng tầng vững chắc.',
      },
      {
        time: '07:20',
        title: 'Tử Phủ Vũ Tướng: Bộ tứ quyền lực của Quản trị và Tài chính',
        transcript: 'Trong tam hợp Tử Phủ Vũ Tướng: Tử Vi là tầm nhìn lãnh đạo, Thiên Phủ là kho giữ tiền, Vũ Khúc là hành động tạo ra tiền, và Thiên Tướng là con dấu pháp lý. Khi bộ này hội thêm Tả Hữu, Khoa Quyền Lộc, Lộc Tồn thì đương số cực kỳ hợp làm chủ doanh nghiệp có hệ thống bài bản, giám đốc tài chính, ngân hàng, bất động sản.',
      },
      {
        time: '14:10',
        title: 'Cơ Nguyệt Đồng Lương: Hiểu đúng câu phú Tác Lại Nhân trong thời đại mới',
        transcript: 'Sách xưa viết Cơ Nguyệt Đồng Lương tác lại nhân — nghĩa là làm quan văn, tham mưu trong triều đình. Trong kinh tế hiện đại, đây là những chuyên gia hàng đầu về công nghệ (Thiên Cơ), tài chính kế toán - bất động sản (Thái Âm), dịch vụ - nhân sự (Thiên Đồng) và giáo dục - y khoa - cố vấn (Thiên Lương). Họ có thể mở trường học, phòng khám, công ty tư vấn rất thịnh vượng.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Điểm Thực Chiến Của Cách Cục Tử Phủ Vũ Tướng</h2>
      <ul>
        <li><strong>Cấu trúc bộ sao:</strong> Sự kết hợp giữa <strong>Tử Vi, Thiên Phủ, Vũ Khúc, Thiên Tướng</strong> (đôi khi có thêm Liêm Trinh thành <em>Tử Phủ Vũ Tướng Liêm</em>).</li>
        <li><strong>Điều kiện phát huy đỉnh cao:</strong> Hội <strong>Tả Phù – Hữu Bật, Thiên Khôi – Thiên Việt, Lộc Tồn, Khoa – Quyền – Lộc</strong>.</li>
        <li><strong>Chiến lược sự nghiệp:</strong> Xây dựng doanh nghiệp có quy trình quản trị rõ ràng, làm lãnh đạo tại các tập đoàn lớn, định chế tài chính, ngân hàng, đầu tư dài hạn.</li>
      </ul>
      <h2>2. Đặc Điểm Thực Chiến Của Cách Cục Cơ Nguyệt Đồng Lương</h2>
      <ul>
        <li><strong>Cấu trúc bộ sao:</strong> Sự kết hợp giữa <strong>Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương</strong> trong tam hợp Mệnh – Tài – Quan.</li>
        <li><strong>Điều kiện phát huy đỉnh cao:</strong> Hội <strong>Văn Xương – Văn Khúc, Hóa Khoa, Hóa Lộc, Hóa Quyền, Đào Hồng Hỷ</strong>.</li>
        <li><strong>Chiến lược sự nghiệp:</strong> Phát triển từ năng lực chuyên gia (Giáo dục, Y dược, IT, Tài chính – Kế toán, Nghiên cứu, Tư vấn) rồi mở rộng thành thương hiệu uy tín và tích lũy bất động sản.</li>
      </ul>
    `,
  },
  {
    id: 'bai-22',
    number: 22,
    moduleId: 4,
    title: 'Cách Cục Lớn (Phần 2): Sát Phá Tham & Cự Nhật',
    subtitle: 'Thế đứng Khai Phá Thương Trường của Sát Phá Tham và thế đứng Ngoại Giao – Ngôn Ngữ của Cự Nhật.',
    isFreePreview: false,
    duration: '20:15',
    relatedStars: ['Thất Sát', 'Phá Quân', 'Tham Lang', 'Cự Môn', 'Thái Dương'],
    flashcard: {
      nguHanh: 'Tổ hợp Động Tinh: Khai phá thị trường mới, Khởi nghiệp, Ngoại giao & Thương mại quốc tế',
      hoaKhi: 'Sát Phá Tham (Hành động & Đột phá) • Cự Nhật (Ngôn ngữ, Truyền thông & Quốc tế)',
      chuSu: 'Chủ về tự thân lập nghiệp, kinh doanh thương mại, sản xuất, luật pháp, truyền thông',
      dacHam: 'Sát Phá Tham cực ưa Lộc Mã, Khoa Quyền Lộc và Hỏa Linh đắc địa; Cự Nhật ưa Thái Dương sáng sủa (Dần, Mão, Thìn, Tỵ, Ngọ)',
      cauPhu: 'Sát Phá Tham câu tác lương đống chi tài; Cự Nhật đồng cung, quan phong tam đại.',
      cotLoi: 'Sát Phá Tham phát triển mạnh nhất trong môi trường cạnh tranh và đổi mới; Cự Nhật phát triển mạnh nhất bằng trí tuệ ngôn từ và thương hiệu.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Sát Phá Tham: Trụ cột của giới khởi nghiệp và kinh doanh thực chiến',
        transcript: 'Luôn luôn đi cùng nhau trong một tam hợp cố định, Thất Sát (tướng cầm quân), Phá Quân (tiên phong phá cũ xây mới) và Tham Lang (ngoại giao nắm bắt cơ hội) tạo thành bộ động cơ mạnh mẽ nhất trên lá số Tử Vi. Người mệnh Sát Phá Tham không chịu được công việc bàn giấy lặp đi lặp lại mỗi ngày; họ sinh ra để ra ngoài thương trường, tự làm chủ hoặc dẫn dắt các dự án mới.',
      },
      {
        time: '07:15',
        title: 'Điểm khác biệt: Sát Phá Tham chịu được Sát tinh tốt hơn các bộ khác',
        transcript: 'Nếu Tử Phủ Vũ Tướng hay Cơ Nguyệt Đồng Lương rất ngại gặp Kình Đà, Hỏa Linh thì bộ Sát Phá Tham khi đắc địa lại có thể thu phục Hỏa Tinh, Linh Tinh, Kình Dương đắc địa để tạo thành sức bật kinh tế cực lớn, miễn là có thêm Hóa Lộc, Hóa Quyền hoặc Lộc Tồn giữ gốc tài chính.',
      },
      {
        time: '13:50',
        title: 'Cách cục Cự Nhật: Ánh mặt trời soi sáng tài năng ngôn ngữ',
        transcript: 'Tổ hợp Cự Môn - Thái Dương (đồng cung tại Dần Thân hoặc xung chiếu nhau) là cách cục đỉnh cao của truyền thông, ngoại ngữ, luật pháp, giảng dạy quốc tế và xuất nhập khẩu. Đặc biệt Cự Nhật tại Dần có mặt trời đang lên xóa sạch tính Ám của Cự Môn, giúp đương số nổi danh bằng trí tuệ và tiếng nói có uy tín.',
      },
    ],
    contentHtml: `
      <h2>1. Đặc Điểm Thực Chiến Của Cách Cục Sát Phá Tham</h2>
      <ul>
        <li><strong>Cấu trúc bộ sao:</strong> <strong>Thất Sát – Phá Quân – Tham Lang</strong> luôn nằm trong tam hợp của nhau (đôi khi đi cùng Tử Vi, Vũ Khúc, Liêm Trinh tạo thành <em>Tử Vũ Liêm Sát Phá Tham</em>).</li>
        <li><strong>Lộ trình phát triển:</strong> Tiền vận va chạm thực tế nhiều để tích lũy bản lĩnh; từ sau 30 tuổi (khi bước vào Đại vận thuận lợi) bứt phá rất nhanh về quy mô kinh doanh.</li>
      </ul>
      <h2>2. Bảng So Sánh Tổng Quan 4 Cách Cục Lớn Trong Tử Vi</h2>
      <table>
        <thead>
          <tr>
            <th>Cách Cục Lớn</th>
            <th>Điểm mạnh cốt lõi</th>
            <th>Bộ sao trợ lực cần thiết nhất</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Tử Phủ Vũ Tướng</strong></td>
            <td>Quản trị tổ chức, điều hành tài chính, giữ kho tài sản</td>
            <td>Tả Hữu • Khôi Việt • Lộc Tồn • Khoa Quyền Lộc</td>
          </tr>
          <tr>
            <td><strong>Sát Phá Tham</strong></td>
            <td>Khởi nghiệp, mở thị trường mới, xoay chuyển tình thế</td>
            <td>Hóa Lộc • Hóa Quyền • Lộc Mã • Hỏa Linh (đắc địa)</td>
          </tr>
          <tr>
            <td><strong>Cơ Nguyệt Đồng Lương</strong></td>
            <td>Tham mưu chiến lược, học thuật, y giáo, đầu tư điền sản</td>
            <td>Xương Khúc • Hóa Khoa • Hóa Lộc • Khôi Việt</td>
          </tr>
          <tr>
            <td><strong>Cự Nhật</strong></td>
            <td>Ngôn ngữ, luật pháp, truyền thông, thương mại quốc tế</td>
            <td>Thái Dương Miếu/Vượng • Hóa Lộc • Hóa Quyền • Hóa Khoa</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-23',
    number: 23,
    moduleId: 4,
    title: 'Thực Chiến Luận 4 Cung Trọng Điểm: Tài Bạch, Quan Lộc, Điền Trạch & Phu Thê',
    subtitle: 'Cách phối hợp các cung để trả lời 4 câu hỏi lớn nhất của khách hàng: Tiền bạc, Sự nghiệp, Nhà đất và Hôn nhân.',
    isFreePreview: false,
    duration: '21:45',
    relatedStars: ['Vũ Khúc', 'Thái Âm', 'Thiên Phủ', 'Lộc Tồn', 'Thái Dương', 'Thiên Tướng', 'Hồng Loan'],
    flashcard: {
      nguHanh: 'Sự liên thông giữa Tam hợp Mệnh – Tài – Quan và trục Phúc – Phối – Di – Điền – Tử',
      hoaKhi: 'Tài Bạch (Dòng tiền) • Điền Trạch (Kho tích sản) • Quan Lộc (Sự nghiệp) • Phu Thê (Bạn đời)',
      chuSu: 'Giải quyết trực tiếp bài toán làm giàu, giữ tiền, chọn nghề và hạnh phúc gia đình',
      dacHam: 'Tài Bạch vượng cần Điền Trạch vững để giữ lộc; Quan Lộc sáng cần Phu Thê yên ấm',
      cauPhu: 'Tài Bạch vi dưỡng mệnh chi nguyên; Điền Trạch vi tàng phong tụ khí chi sở.',
      cotLoi: 'Kiếm được bao nhiêu tiền nhìn cung Tài Bạch; cuối đời giữ lại được bao nhiêu tài sản phải nhìn cung Điền Trạch và Phúc Đức.',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Cặp bài trùng Tài Bạch (Dòng tiền) và Điền Trạch (Két sắt tích sản)',
        transcript: 'Khi xem về kinh tế cho một lá số, nếu chỉ nhìn cung Tài Bạch mà bỏ quên cung Điền Trạch là thiếu một nửa bức tranh. Cung Tài Bạch cho biết bạn kiếm tiền nhanh hay chậm, bằng nghề gì; nhưng cung Điền Trạch mới là cái két sắt giữ lại thành quả cuối cùng. Có người cung Tài Bạch có Vũ Phá kiếm tiền rất mạnh nhưng giữ tiền mặt hay hao, song cung Điền Trạch lại có Thái Âm Lộc Tồn cực đẹp — chỉ cần cứ có tiền là mua đất mua nhà thì giàu bền vững.',
      },
      {
        time: '07:50',
        title: 'Trục Quan Lộc (Sự nghiệp) và Phu Thê (Hôn nhân) chiếu thẳng vào nhau',
        transcript: 'Trên lá số Tử Vi, cung Quan Lộc và cung Phu Thê luôn luôn nằm đối diện xung chiếu nhau 180 độ. Điều này chứa đựng triết lý cực kỳ sâu sắc: sự nghiệp và gia đình luôn tác động qua lại trực tiếp. Khi cung Phu Thê yên ấm, người bạn đời chính là hậu phương lớn nhất cho cung Quan Lộc thăng hoa.',
      },
      {
        time: '14:30',
        title: 'Vai trò gốc rễ của cung Phúc Đức đối với cả Tài Bạch và Hôn Nhân',
        transcript: 'Cung Phúc Đức luôn nằm ở vị trí xung chiếu trực tiếp với cung Tài Bạch và nằm trong tam hợp với cung Phu Thê, Thiên Di. Bởi vậy, người biết bồi đắp phúc đức, sống hiếu thuận và giữ chữ tín trong kinh doanh chính là đang kích hoạt trực tiếp nguồn năng lượng tốt nhất chiếu thẳng sang cung Tài Bạch của mình.',
      },
    ],
    contentHtml: `
      <h2>1. Công Thức Phối Hợp Các Cung Khi Luận Giải Thực Chiến</h2>
      <ul>
        <li><strong>Bài toán Kinh tế &amp; Đầu tư:</strong> Đọc <strong>Cung Tài Bạch</strong> (cách kiếm tiền) + <strong>Cung Điền Trạch</strong> (khả năng tích sản, bất động sản) + <strong>Cung Phúc Đức</strong> (độ bền của lộc).</li>
        <li><strong>Bài toán Sự nghiệp &amp; Làm chủ:</strong> Đọc <strong>Cung Quan Lộc</strong> (ngành nghề) + <strong>Cung Mệnh</strong> (năng lực cốt lõi) + <strong>Cung Nô Bộc</strong> (đội ngũ nhân sự, khách hàng) + <strong>Cung Thiên Di</strong> (thị trường bên ngoài).</li>
        <li><strong>Bài toán Tình duyên &amp; Gia đạo:</strong> Đọc <strong>Cung Phu Thê</strong> (tính cách bạn đời) + <strong>Cung Phúc Đức</strong> (duyên nợ gia tộc) + <strong>Cung Tử Tức</strong> (con cái gắn kết).</li>
      </ul>
      <h2>2. Bảng Dấu Hiệu Thực Chiến Trên 4 Cung Trọng Điểm</h2>
      <table>
        <thead>
          <tr>
            <th>Cung Vị</th>
            <th>Bộ Sao Đại Cát</th>
            <th>Lưu ý quản trị khi có Sát / Hao / Kỵ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Cung Tài Bạch</strong></td>
            <td>Vũ Khúc, Thái Âm, Thiên Phủ, Lộc Tồn, Hóa Lộc</td>
            <td>Có Không Kiếp / Đại Hao: Không giữ nhiều tiền mặt nhàn rỗi, ưu tiên chuyển sang tài sản hữu hình.</td>
          </tr>
          <tr>
            <td><strong>Cung Điền Trạch</strong></td>
            <td>Thiên Phủ, Thái Âm, Vũ Khúc, Tử Vi, Hồng Loan</td>
            <td>Có Hình / Kỵ: Kiểm tra kỹ quy hoạch, sổ đỏ và pháp lý trước khi đặt cọc.</td>
          </tr>
          <tr>
            <td><strong>Cung Quan Lộc</strong></td>
            <td>Tử Vi, Thái Dương, Thiên Tướng, Khoa Quyền Lộc</td>
            <td>Có Tuần / Triệt: Nên rèn chuyên môn vững trước tuổi 30 hoặc làm nghề kỹ thuật, tư vấn.</td>
          </tr>
          <tr>
            <td><strong>Cung Phu Thê</strong></td>
            <td>Thiên Phủ, Thiên Đồng, Thái Âm, Tả Hữu, Ân Quang</td>
            <td>Có Vũ Khúc / Thất Sát / Cô Quả: Nên kết hôn muộn và tôn trọng không gian độc lập của nhau.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
  {
    id: 'bai-24',
    number: 24,
    moduleId: 4,
    title: 'Quy Trình 5 Bước Chấm Hạn Năm (Lưu Niên) & 12 Tháng (Lưu Nguyệt) Chuẩn Thực Chứng',
    subtitle: 'Tổng kết toàn bộ khóa học thành quy trình 5 bước rõ ràng để tự xem vận hạn hàng năm và chọn thời điểm hành động.',
    isFreePreview: false,
    duration: '23:10',
    relatedStars: ['Thái Tuế', 'Lộc Tồn', 'Thiên Mã', 'Kình Dương', 'Đà La', 'Thiên Khốc', 'Thiên Hư', 'Hóa Lộc', 'Hóa Kỵ'],
    flashcard: {
      nguHanh: 'Sự vận hành đồng bộ của Đại vận 10 năm • Lưu niên Tiểu vận • Lưu Thái Tuế • Lưu Nguyệt',
      hoaKhi: 'Quy trình 5 bước chuẩn hóa của Thầy Tôn giúp đọc hạn năm và 12 tháng không bao giờ rối',
      chuSu: 'Lập kế hoạch tài chính, sự nghiệp, đầu tư, cưới hỏi, sinh con, mua nhà cho từng năm',
      dacHam: 'Giao điểm giữa Đại vận và Lưu niên là nơi phát sinh sự kiện thực tế rõ rệt nhất',
      cauPhu: 'Tri mệnh bất ưu, tri thời bất hoặc — Biết mệnh thì không lo, biết thời thì không lầm.',
      cotLoi: 'Luôn đi từ Gốc (Mệnh Thân) -> Rễ (Đại vận 10 năm) -> Thân cây (Lưu niên Thái Tuế & Tiểu vận) -> Cành lá (12 tháng Lưu nguyệt).',
    },
    podcastChapters: [
      {
        time: '00:00',
        title: 'Tổng kết quy trình 5 bước đọc vận hạn thực chiến của Thầy Tôn',
        transcript: 'Trong bài học cuối cùng của khóa học này, Thầy đúc kết toàn bộ kiến thức về 14 Chính tinh, Phụ tinh và Cách cục thành Quy trình 5 bước thực chiến để mỗi khi bước sang một năm mới, các bạn có thể tự đọc vận hạn cho mình và người thân một cách mạch lạc, khoa học, không bị rối trước hàng trăm ngôi sao.',
      },
      {
        time: '06:30',
        title: 'Bước 1, Bước 2 và Bước 3: Định vị Đại vận, Cung Lưu Thái Tuế và Cung Tiểu vận',
        transcript: 'Bước 1 là kiểm tra xem ở tuổi hiện tại bạn đang nằm trong Đại vận 10 năm nào, cung Đại vận đó tốt hay xấu. Bước 2 là tìm cung có Địa Chi trùng với năm xem (ví dụ năm 2027 Đinh Mùi thì nhìn vào cung Mùi trên lá số) — đó chính là cung Lưu Thái Tuế quản bối cảnh khách quan của năm. Bước 3 là tìm cung Tiểu vận theo tuổi để xem tâm thế chủ quan của bạn trong năm đó.',
      },
      {
        time: '13:45',
        title: 'Bước 4 và Bước 5: Kích hoạt bộ Sao Lưu và rà soát 12 tháng Lưu Nguyệt',
        transcript: 'Bước 4 là xét bộ Sao Lưu của năm đó (Lưu Lộc Tồn, Lưu Thiên Mã, Lưu Kình Đà, Lưu Khốc Hư) và Tứ Hóa của Thiên Can năm (như năm Đinh Mùi 2027 là Nguyệt - Đồng - Cơ - Cự) xem chúng rơi vào cung nào của gốc và của Đại vận. Cuối cùng, Bước 5 là dóng xuống 12 tháng âm lịch Lưu Nguyệt để biết tháng nào vượng tài lộc nên tiến công, tháng nào hội Sát Kỵ nên phòng thủ.',
      },
      {
        time: '19:20',
        title: 'Lời nhắn nhủ của Thầy Tôn: Học Tử Vi để Làm Chủ Vận Mệnh',
        transcript: 'Tử Vi Đẩu Số không phải là định mệnh đóng khung bắt chúng ta ngồi im chịu trận, mà là tấm bản đồ dự báo thời tiết cuộc đời. Khi biết trước năm nào nắng ấm thuận buồm xuôi gió, ta căng buồm ra khơi; khi biết trước tháng nào có giông bão, ta gia cố con thuyền, giữ chặt dòng tiền và bồi đắp tri thức, phúc đức. Chúc các bạn ứng dụng thật tốt kho tàng tri thức này vào cuộc sống!',
      },
    ],
    contentHtml: `
      <h2>1. Quy Trình 5 Bước Chấm Hạn Năm Chuẩn Thực Chiến Của Thầy Tôn</h2>
      <ul>
        <li><strong>Bước 1 — Xác định Bối cảnh Đại Vận 10 năm:</strong> Kiểm tra cung Đại vận hiện tại thuộc cách cục gì (<em>Tử Phủ Vũ Tướng, Sát Phá Tham, Cơ Nguyệt Đồng Lương hay Cự Nhật</em>), đắc địa hay hãm địa.</li>
        <li><strong>Bước 2 — Đọc Cung Lưu Niên Thái Tuế (Theo Địa Chi năm xem):</strong> Năm Tý xem cung Tý, năm Ngọ xem cung Ngọ, năm Mùi xem cung Mùi... Cung này cùng Tam phương Tứ chính của nó cho biết <strong>sự kiện thực tế bên ngoài</strong> diễn ra trong năm.</li>
        <li><strong>Bước 3 — Đọc Cung Tiểu Vận (Theo tuổi âm lịch):</strong> Cho biết <strong>tâm lý, suy nghĩ và quyết định chủ quan</strong> của đương số trong năm đó.</li>
        <li><strong>Bước 4 — Xét Sự Kích Hoạt Của Bộ Sao Lưu &amp; Lưu Tứ Hóa:</strong> Khi <em>Lưu Lộc Tồn, Lưu Thiên Mã, Lưu Hóa Lộc</em> trùng phùng với Lộc Mã gốc tại Tài/Quan/Điền là năm bùng nổ tài lộc; khi <em>Lưu Kình Đà, Lưu Hóa Kỵ</em> xung chiếu cung nào thì cần quản trị rủi ro ở lĩnh vực đó.</li>
        <li><strong>Bước 5 — Phân Bổ Kế Hoạch Theo 4 Mùa &amp; 12 Tháng Âm Lịch (Lưu Nguyệt):</strong> Chọn đúng tháng có Cát tinh hội tụ để ký kết, khai trương, đầu tư; và lùi bước phòng thủ ở những tháng có Sát Kỵ trùng phùng.</li>
      </ul>
      <h2>2. Bảng Tóm Tắt Tín Hiệu Sự Kiện Trong Năm Lưu Niên</h2>
      <table>
        <thead>
          <tr>
            <th>Lĩnh vực cần xem</th>
            <th>Cung cần kiểm tra trong năm</th>
            <th>Tổ hợp sao báo hiệu sự kiện rõ nhất</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Thăng tiến &amp; Đổi việc</strong></td>
            <td>Lưu Thái Tuế • Quan Lộc gốc &amp; Đại vận</td>
            <td>Hóa Quyền, Hóa Khoa, Thiên Khôi, Thiên Việt, Thiên Mã hội chiếu.</td>
          </tr>
          <tr>
            <td><strong>Bùng nổ Tài chính</strong></td>
            <td>Lưu Thái Tuế • Tài Bạch gốc &amp; Đại vận</td>
            <td>Lộc Tồn, Hóa Lộc, Vũ Khúc, Thái Âm, Thiên Phủ, Hỏa Tham / Linh Tham.</td>
          </tr>
          <tr>
            <td><strong>Mua Nhà, Mua Đất</strong></td>
            <td>Lưu Thái Tuế • Điền Trạch • Tài Bạch</td>
            <td>Thái Âm, Thiên Phủ, Lộc Tồn, Hồng Loan, Thiên Hỷ (hoặc Vũ Phá xuất tiền mua đất).</td>
          </tr>
          <tr>
            <td><strong>Kết Hôn &amp; Sinh Con</strong></td>
            <td>Lưu Thái Tuế • Phu Thê • Tử Tức</td>
            <td>Hồng Loan, Đào Hoa, Thiên Hỷ, Thanh Long, Hóa Lộc, Thiên Đồng, Thái Âm.</td>
          </tr>
        </tbody>
      </table>
    `,
  },
];
