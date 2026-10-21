import type { Metadata } from 'next';
import { Be_Vietnam_Pro, Lora } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';

const beVietnam = Be_Vietnam_Pro({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const lora = Lora({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tuvithayton.vn'),
  title: {
    default: 'Tử Vi & Phong Thủy Thầy Tôn — An Sao Bình Giải Tử Vi Miễn Phí | Tư Vấn Phong Thủy, Diện Tướng & Chỉ Tay',
    template: '%s | Tử Vi & Phong Thủy Thầy Tôn (tuvithayton.vn)',
  },
  description:
    'Lập lá số Tử Vi 108 sao cổ truyền & nhận bài bình giải Khởi Nguyên MIỄN PHÍ 100% từ Thầy Tôn (Trần Huy Tôn — Cựu Chuyên gia Tài chính Quốc tế ĐH Lancaster UK, 18+ năm nghiên cứu Tử Vi Đẩu Số, Phong Thủy Thực Chứng & Tướng Pháp). Tư vấn Phong Thủy nhà ở, biệt thự, chung cư, văn phòng kinh doanh, xem ngày giờ tốt động thổ, nhập trạch, khai trương.',
  keywords: [
    'tử vi thầy tôn',
    'phong thủy thầy tôn',
    'tử vi và phong thủy thầy tôn',
    'trần huy tôn tử vi',
    'trần huy tôn phong thủy',
    'lập lá số tử vi miễn phí',
    'an sao tử vi miễn phí',
    'bình giải tử vi miễn phí',
    'luận giải tử vi chuyên sâu',
    'tư vấn phong thủy nhà ở',
    'tư vấn phong thủy biệt thự chung cư',
    'phong thủy văn phòng kinh doanh',
    'phong thủy cải vận',
    'xem ngày tốt động thổ nhập trạch khai trương',
    'xem chỉ tay diện tướng online',
    'tử vi đẩu số bát bộ thần sát',
    'huyền không phi tinh',
    'xem hạn tử vi 2026',
    'xem hạn tử vi 2027',
    'tuvithayton.vn',
  ],
  authors: [{ name: 'Thầy Tôn (Trần Huy Tôn)', url: 'https://www.tuvithayton.vn' }],
  creator: 'Thầy Tôn (Trần Huy Tôn)',
  publisher: 'Tử Vi & Phong Thủy Thầy Tôn',
  alternates: {
    canonical: 'https://www.tuvithayton.vn',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://www.tuvithayton.vn',
    siteName: 'Tử Vi & Phong Thủy Thầy Tôn (tuvithayton.vn)',
    title: 'Tử Vi & Phong Thủy Thầy Tôn — An Sao Bình Giải Tử Vi Miễn Phí | Tư Vấn Phong Thủy Thực Chứng',
    description:
      'Trải nghiệm miễn phí hệ thống An sao Tử Vi 108 tinh đẩu chuẩn cổ truyền & Bình giải Mệnh lý thực chứng từ Thầy Tôn (Trần Huy Tôn). Tư vấn Phong Thủy Dương Trạch nhà ở, biệt thự, chung cư, văn phòng, xem ngày giờ tốt kết hợp Diện Tướng & Chỉ Tay.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tử Vi & Phong Thủy Thầy Tôn — An Sao & Bình Giải Tử Vi Miễn Phí',
    description:
      'An sao 108 tinh đẩu & Bình giải Tử Vi miễn phí kết hợp Phong Thủy Thực Chứng, Diện Tướng & Chỉ Tay từ Thầy Tôn (Trần Huy Tôn).',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'J4uigOEDVixcFiqOB4X0eyMpQw8zKMhuBn1S7VkeNS0',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const seoGeoJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.tuvithayton.vn/#website',
      url: 'https://www.tuvithayton.vn',
      name: 'Tử Vi & Phong Thủy Thầy Tôn',
      alternateName: ['Tử Vi Thầy Tôn', 'Phong Thủy Thầy Tôn', 'Trần Huy Tôn Tử Vi & Phong Thủy', 'Master Ton Astrology & Feng Shui'],
      description:
        'Hệ thống An Sao & Bình Giải Tử Vi Miễn Phí 108 sao cổ truyền, kết hợp Tư vấn Phong Thủy Dương Trạch thực chứng, Diện Tướng khuôn mặt và Thủ Tướng chỉ tay từ Thầy Tôn (Trần Huy Tôn).',
      inLanguage: ['vi', 'en', 'zh', 'ko', 'ja'],
    },
    {
      '@type': 'Person',
      '@id': 'https://www.tuvithayton.vn/#thayton',
      name: 'Trần Huy Tôn',
      alternateName: ['Thầy Tôn', 'Master Ton'],
      jobTitle: 'Chuyên Gia Tử Vi Đẩu Số, Phong Thủy Thực Chứng, Nhân Tướng Học & Cố Vấn Chiến Lược Mệnh Lý',
      alumniOf: [
        {
          '@type': 'CollegeOrUniversity',
          name: 'Lancaster University (UK) — Top 5 Accounting & Finance',
        },
        {
          '@type': 'EducationalOrganization',
          name: 'Khối Chuyên Toán - Tin, Trường Đại học Tổng Hợp Hà Nội',
        },
      ],
      knowsAbout: [
        'Tử Vi Đẩu Số Bát Bộ Thần Sát',
        'Phong Thủy Dương Trạch (Huyền Không Phi Tinh, Bát Trạch Minh Cảnh, Loan Đầu)',
        'Phong Thủy Nhà Ở, Biệt Thự, Chung Cư, Văn Phòng & Cửa Hàng Kinh Doanh',
        'Trạch Nhật — Xem Ngày Giờ Động Thổ, Nhập Trạch, Khai Trương, Cưới Hỏi',
        'Nhân Tướng Học (Diện Tướng & Thủ Tướng Chỉ Tay)',
        'Kinh Dịch, Kỳ Môn Độn Giáp & Quản Trị Rủi Ro Chu Kỳ Kinh Tế',
      ],
      sameAs: ['https://tonyenglish.vn/', 'https://zalo.me/0935058688'],
      url: 'https://www.tuvithayton.vn/#gioi-thieu-thay-ton',
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://www.tuvithayton.vn/#service',
      name: 'Tử Vi & Phong Thủy Thầy Tôn — An Sao Tử Vi & Tư Vấn Phong Thủy Thực Chứng',
      url: 'https://www.tuvithayton.vn',
      telephone: '+84935058688',
      email: 'tranhuyton@gmail.com',
      priceRange: '0 VNĐ - 269.000 VNĐ',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân',
        addressLocality: 'Hà Nội',
        addressCountry: 'VN',
      },
      founder: { '@id': 'https://www.tuvithayton.vn/#thayton' },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        ratingCount: '15420',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Các Gói Dịch Vụ An Sao, Luận Giải Tử Vi & Tư Vấn Phong Thủy Thầy Tôn',
        itemListElement: [
          {
            '@type': 'Offer',
            name: 'Gói Khởi Nguyên — An Sao & Bình Giải Tử Vi Miễn Phí',
            description:
              'Lập lá số Tử Vi 108 sao chính xác theo giờ sinh và nhận bài bình giải Khởi Nguyên miễn phí (~1.000 từ) về Bản Mệnh, Tam Hợp Mệnh - Tài - Quan, Đại Vận & Tiểu Vận.',
            price: '0',
            priceCurrency: 'VND',
          },
          {
            '@type': 'Offer',
            name: 'Gói Chuyên Sâu VIP Pro (Kèm Xem Ảnh Mặt, Chỉ Tay & 02 Câu Hỏi VIP)',
            description:
              'Luận giải chuyên sâu (~2.500 từ) mổ xẻ Tứ Trụ Mệnh - Thân - Tài - Quan - Phu Thê, kết hợp soi Diện Tướng khuôn mặt, Thủ Tướng bàn tay, Đại Vận 10 năm, Vận khí 4 mùa và tặng kèm 02 câu hỏi VIP.',
            price: '119000',
            priceCurrency: 'VND',
          },
          {
            '@type': 'Offer',
            name: 'Gói Chuyên Gia Đại Tông Sư Expert (Luận Giải Trọn Bộ 12 Cung, 12 Tháng Lưu Nguyệt & Phong Thủy Cải Vận)',
            description:
              'Bản luận giải cao cấp nhất (~4.500 - 6.000 từ) phân tích riêng biệt toàn bộ 12 Cung + Cung Thân, đối chiếu Diện Tướng & Chỉ Tay chuyên gia, Phong Thủy Cải Vận theo Dụng thần, Đại Vận 10 năm, chi tiết 12 tháng Âm lịch và tặng 02 câu hỏi Chuyên Gia.',
            price: '269000',
            priceCurrency: 'VND',
          },
          {
            '@type': 'Offer',
            name: 'Tư Vấn Phong Thủy Thực Chứng & Xem Tử Vi Trực Tiếp 1-1 Cùng Thầy Tôn',
            description:
              'Đàm đạo 1-1 trực tiếp tại Royal City (Hà Nội), khảo sát Phong Thủy thực địa hoặc tư vấn qua Video Call: Khảo sát & bố cục Phong Thủy Nhà ở, Biệt thự, Chung cư, Văn phòng, Cửa hàng; Xem ngày giờ tốt Động thổ, Nhập trạch, Khai trương kết hợp Lá số Tử Vi gia chủ.',
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://www.tuvithayton.vn/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Lập lá số và bình giải tử vi tại Tử Vi & Phong Thủy Thầy Tôn có miễn phí không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Có! Quý khách được lập lá số Tử Vi 108 sao chuẩn cổ truyền và nhận ngay Bản Bình Giải Khởi Nguyên (~1.000 từ) hoàn toàn MIỄN PHÍ (0 VNĐ), bao quát cốt cách Bản Mệnh, Tam Hợp Mệnh - Tài - Quan, Đại Vận 10 năm hiện tại và Tiểu Vận năm xem.',
          },
        },
        {
          '@type': 'Question',
          name: 'Thầy Tôn (Trần Huy Tôn) là ai và phương pháp Tử Vi & Phong Thủy của Thầy có gì đặc biệt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Thầy Tôn (Trần Huy Tôn) là cựu học sinh chuyên Toán - Tin ĐH Tổng Hợp Hà Nội, tốt nghiệp ngành Tài chính - Kế toán tại Đại học Lancaster (Top 5 Vương Quốc Anh), có hơn 7 năm làm việc tại Anh Quốc và hơn 18 năm nghiên cứu Tử Vi Đẩu Số, Bát Bộ Thần Sát, Phong Thủy Dương Trạch, Diện Tướng & Chỉ Tay. Phương pháp của Thầy Tôn nổi tiếng nhờ tính khoa học, thực chứng, logic chặt chẽ và hoàn toàn không mê tín dị đoan.',
          },
        },
        {
          '@type': 'Question',
          name: 'Thầy Tôn tư vấn những hạng mục Phong Thủy nào? Có khảo sát thực địa và tư vấn từ xa không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Thầy Tôn trực tiếp tư vấn toàn diện các hạng mục Phong Thủy Dương Trạch: Nhà phố, Biệt thự, Căn hộ chung cư, Văn phòng công ty, Cửa hàng kinh doanh; Bố cục bàn thờ, bếp, phòng ngủ, bàn làm việc lãnh đạo; Kích hoạt Tài vị và Xem ngày giờ tốt (Động thổ, Nhập trạch, Khai trương, Cưới hỏi). Thầy nhận khảo sát thực địa trực tiếp tại Hà Nội & các tỉnh, đồng thời tư vấn từ xa qua Bản vẽ mặt bằng + Video thực tế + Toạ độ vệ tinh.',
          },
        },
        {
          '@type': 'Question',
          name: 'Sự khác biệt giữa Bản Miễn Phí, Bản Chuyên Sâu Pro và Bản Chuyên Gia Expert là gì?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Bản Miễn Phí (0đ) cung cấp lá số 108 sao và bình giải tổng quan (~1.000 từ). Bản Chuyên Sâu Pro (119.000đ) phân tích sâu gấp 2,5 lần (~2.500 từ), kết hợp trực tiếp Ảnh Khuôn Mặt & Chỉ Tay, luận giải 4 mùa và tặng 02 câu hỏi VIP. Bản Chuyên Gia Expert (269.000đ) là tuyệt phẩm ~4.500-6.000 từ, mổ xẻ riêng biệt từng cung trong trọn bộ 12 Cung + Cung Thân, luận giải chi tiết 12 tháng Âm lịch, Phong Thủy cải vận và tặng 02 câu hỏi Chuyên Gia.',
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${beVietnam.variable} ${lora.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tuvi_theme')||'cosmic';document.documentElement.setAttribute('data-theme',t);if(t==='custom'){var c=localStorage.getItem('tuvi_custom_color');if(c){document.documentElement.style.setProperty('--bg-color',c);}}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoGeoJsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
