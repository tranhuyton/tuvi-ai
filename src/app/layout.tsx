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
  metadataBase: new URL('https://tuvithayton.vn'),
  title: {
    default: 'Tử Vi Thầy Tôn — An Sao & Bình Giải Tử Vi Miễn Phí | Xem Tướng Mặt & Chỉ Tay Thực Chứng',
    template: '%s | Tử Vi Thầy Tôn (tuvithayton.vn)',
  },
  description:
    'Lập lá số Tử Vi 108 sao cổ truyền & nhận bài bình giải Khởi Nguyên MIỄN PHÍ 100% từ Thầy Tôn (Trần Huy Tôn — Cựu Chuyên gia Tài chính Quốc tế ĐH Lancaster UK, 18+ năm nghiên cứu Dịch học & Tử Vi). Kết hợp độc quyền Tử Vi Đẩu Số, Diện Tướng khuôn mặt & Thủ Tướng chỉ tay.',
  keywords: [
    'tử vi thầy tôn',
    'trần huy tôn tử vi',
    'lập lá số tử vi miễn phí',
    'an sao tử vi miễn phí',
    'bình giải tử vi miễn phí',
    'luận giải tử vi chuyên sâu',
    'xem tử vi chính xác nhất',
    'xem chỉ tay diện tướng online',
    'tử vi đẩu số bát bộ thần sát',
    'xem hạn tử vi 2026',
    'xem hạn tử vi 2027',
    'tuvithayton.vn',
  ],
  authors: [{ name: 'Thầy Tôn (Trần Huy Tôn)', url: 'https://tuvithayton.vn' }],
  creator: 'Thầy Tôn (Trần Huy Tôn)',
  publisher: 'Tử Vi Phong Thủy Thầy Tôn',
  alternates: {
    canonical: 'https://tuvithayton.vn',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://tuvithayton.vn',
    siteName: 'Tử Vi Thầy Tôn (tuvithayton.vn)',
    title: 'Tử Vi Thầy Tôn — An Sao & Bình Giải Tử Vi Miễn Phí | Xem Diện Tướng & Chỉ Tay',
    description:
      'Trải nghiệm miễn phí hệ thống An sao Tử Vi 108 tinh đẩu chuẩn cổ truyền & Bình giải Mệnh lý thực chứng từ Thầy Tôn (Trần Huy Tôn). Kết hợp phân tích Ảnh Khuôn Mặt, Chỉ Tay, Đại Vận 10 năm & Lưu Nguyệt 12 tháng.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tử Vi Thầy Tôn — An Sao & Bình Giải Tử Vi Miễn Phí',
    description:
      'An sao 108 tinh đẩu & Bình giải Tử Vi miễn phí kết hợp Diện Tướng, Chỉ Tay thực chứng từ Thầy Tôn (Trần Huy Tôn).',
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
      '@id': 'https://tuvithayton.vn/#website',
      url: 'https://tuvithayton.vn',
      name: 'Tử Vi Thầy Tôn',
      alternateName: ['Tử Vi Phong Thủy Thầy Tôn', 'Trần Huy Tôn Tử Vi', 'Master Ton Astrology'],
      description:
        'Hệ thống An Sao & Bình Giải Tử Vi Miễn Phí 108 sao cổ truyền, kết hợp Diện Tướng khuôn mặt và Thủ Tướng chỉ tay thực chứng từ Thầy Tôn (Trần Huy Tôn).',
      inLanguage: ['vi', 'en', 'zh', 'ko', 'ja'],
    },
    {
      '@type': 'Person',
      '@id': 'https://tuvithayton.vn/#thayton',
      name: 'Trần Huy Tôn',
      alternateName: ['Thầy Tôn', 'Master Ton'],
      jobTitle: 'Chuyên Gia Tử Vi Đẩu Số, Nhân Tướng Học & Cố Vấn Chiến Lược Mệnh Lý',
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
        'Nhân Tướng Học (Diện Tướng & Thủ Tướng Chỉ Tay)',
        'Kinh Dịch & Kỳ Môn Độn Giáp',
        'Phong Thủy Ứng Dụng & Quản Trị Rủi Ro Chu Kỳ Kinh Tế',
      ],
      sameAs: ['https://tonyenglish.vn/', 'https://zalo.me/0935058688'],
      url: 'https://tuvithayton.vn/#gioi-thieu-thay-ton',
    },
    {
      '@type': 'ProfessionalService',
      '@id': 'https://tuvithayton.vn/#service',
      name: 'Tử Vi Thầy Tôn — An Sao & Bình Giải Tử Vi Thực Chứng',
      url: 'https://tuvithayton.vn',
      telephone: '+84935058688',
      email: 'tranhuyton@gmail.com',
      priceRange: '0 VNĐ - 269.000 VNĐ',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân',
        addressLocality: 'Hà Nội',
        addressCountry: 'VN',
      },
      founder: { '@id': 'https://tuvithayton.vn/#thayton' },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        bestRating: '5',
        ratingCount: '15420',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Các Gói Dịch Vụ An Sao & Luận Giải Tử Vi Thầy Tôn',
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
            name: 'Gói Chuyên Gia Đại Tông Sư Expert (Luận Giải Trọn Bộ 12 Cung & 12 Tháng Lưu Nguyệt)',
            description:
              'Bản luận giải cao cấp nhất (~4.500 - 5.000 từ) phân tích riêng biệt toàn bộ 12 Cung + Cung Thân, đối chiếu Diện Tướng & Chỉ Tay chuyên gia, Đại Vận 10 năm, chi tiết 12 tháng Âm lịch và tặng 02 câu hỏi Chuyên Gia.',
            price: '269000',
            priceCurrency: 'VND',
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://tuvithayton.vn/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Lập lá số và bình giải tử vi tại Tử Vi Thầy Tôn có miễn phí không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Có! Quý khách được lập lá số Tử Vi 108 sao chuẩn cổ truyền và nhận ngay Bản Bình Giải Khởi Nguyên (~1.000 từ) hoàn toàn MIỄN PHÍ (0 VNĐ), bao quát cốt cách Bản Mệnh, Tam Hợp Mệnh - Tài - Quan, Đại Vận 10 năm hiện tại và Tiểu Vận năm xem.',
          },
        },
        {
          '@type': 'Question',
          name: 'Thầy Tôn (Trần Huy Tôn) là ai và phương pháp luận giải có gì đặc biệt?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Thầy Tôn (Trần Huy Tôn) là cựu học sinh chuyên Toán - Tin ĐH Tổng Hợp Hà Nội, tốt nghiệp ngành Tài chính - Kế toán tại Đại học Lancaster (Top 5 Vương Quốc Anh), có hơn 7 năm làm việc tại Anh Quốc và hơn 18 năm nghiên cứu Tử Vi Đẩu Số, Bát Bộ Thần Sát, Diện Tướng & Chỉ Tay. Phương pháp của Thầy Tôn nổi tiếng nhờ tính khoa học, thực chứng, logic chặt chẽ và hoàn toàn không mê tín dị đoan.',
          },
        },
        {
          '@type': 'Question',
          name: 'Sự khác biệt giữa Bản Miễn Phí, Bản Chuyên Sâu Pro và Bản Chuyên Gia Expert là gì?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Bản Miễn Phí (0đ) cung cấp lá số 108 sao và bình giải tổng quan (~1.000 từ). Bản Chuyên Sâu Pro (119.000đ) phân tích sâu gấp 2,5 lần (~2.500 từ), kết hợp trực tiếp Ảnh Khuôn Mặt & Chỉ Tay, luận giải 4 mùa và tặng 02 câu hỏi VIP. Bản Chuyên Gia Expert (269.000đ) là tuyệt phẩm ~4.500-5.000 từ, mổ xẻ riêng biệt từng cung trong trọn bộ 12 Cung + Cung Thân, luận giải chi tiết 12 tháng Âm lịch và tặng 02 câu hỏi Chuyên Gia.',
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
