import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Lora } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import RouteTracker from '@/components/RouteTracker';

const beVietnam = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-be-vietnam',
  display: 'swap',
});

const lora = Lora({
  weight: ['400', '600', '700'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-lora',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tuvithayton.vn'),
  title: {
    default: 'Lập Lá Số Tử Vi Miễn Phí - Bình Giải Trọn Đời | Thầy Tôn',
    template: '%s | Thầy Tôn',
  },
  description:
    'Lập lá số tử vi miễn phí, nhận bình giải ~1.000 từ về Mệnh, Tài, Quan, Đại vận. Nâng cấp bản chuyên sâu chỉ trả phần chênh lệch, từ 119.000đ.',
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
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://www.tuvithayton.vn',
    siteName: 'Tử Vi & Phong Thủy Thầy Tôn (tuvithayton.vn)',
    title: 'Tử Vi & Phong Thủy Thầy Tôn — An Sao Bình Giải Tử Vi Miễn Phí | Tư Vấn Phong Thủy Thực Chứng',
    description:
      'Trải nghiệm miễn phí hệ thống An sao Tử Vi 108 tinh đẩu chuẩn cổ truyền & Bình giải Mệnh lý thực chứng từ Thầy Tôn (Trần Huy Tôn). Tư vấn Phong Thủy Dương Trạch nhà ở, biệt thự, chung cư, văn phòng, xem ngày giờ tốt kết hợp Diện Tướng & Chỉ Tay.',
    images: [
      {
        url: 'https://www.tuvithayton.vn/thay-ton.png',
        width: 800,
        height: 800,
        alt: 'Thầy Tôn (Trần Huy Tôn) — Tử Vi & Phong Thủy Thực Chứng',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tử Vi & Phong Thủy Thầy Tôn — An Sao & Bình Giải Tử Vi Miễn Phí',
    description:
      'An sao 108 tinh đẩu & Bình giải Tử Vi miễn phí kết hợp Phong Thủy Thực Chứng, Diện Tướng & Chỉ Tay từ Thầy Tôn (Trần Huy Tôn).',
    images: ['https://www.tuvithayton.vn/thay-ton.png'],
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
      alternateName: ['Thầy Tôn', 'Master Ton', 'Tony Tran'],
      jobTitle:
        'Chuyên Gia Tử Vi Đẩu Số & Phong Thủy Thực Chứng | Giảng Viên IELTS, Giao Tiếp & Các Môn Học Thuật Quốc Tế IGCSE (Toán, Khoa Học, Kinh Tế, Kinh Doanh, Địa Lý)',
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
        'Luyện thi IELTS & Tiếng Anh Giao tiếp (15+ năm kinh nghiệm)',
        'Giảng dạy chương trình Quốc tế Cambridge IGCSE: Toán (Mathematics), Khoa học (Sciences), Kinh tế (Economics), Kinh doanh (Business Studies), Địa lý (Geography)',
      ],
      sameAs: ['https://tonyenglish.vn/', 'https://zalo.me/0935058688'],
      url: 'https://www.tuvithayton.vn/#gioi-thieu-thay-ton',
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
        {/* Google Tag Manager (GTM-M5V95KJ4 / GA4 G-K09KG9PV1Y) — chỉ tải trên production, bỏ qua localhost / vercel preview / /admin */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
window.dataLayer = window.dataLayer || [];
window.gtag = function(){window.dataLayer.push(arguments);};
var h = window.location.hostname;
var p = window.location.pathname || '';
var isProd = h !== 'localhost' && h !== '127.0.0.1' && !h.endsWith('.vercel.app') && !p.startsWith('/admin');
if (!isProd) return;
window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
var s = document.createElement('script');
s.async = true;
s.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-M5V95KJ4';
document.head.appendChild(s);
})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('tuvi_theme')||'cosmic';document.documentElement.setAttribute('data-theme',t);if(t==='custom'){var c=localStorage.getItem('tuvi_custom_color');if(c){document.documentElement.style.setProperty('--bg-color',c);}}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(seoGeoJsonLd) }}
        />
        {/* Meta Pixel Code (ID: 2104187747130873) — chỉ tải trên production, bỏ qua localhost / vercel preview / /admin */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
try{var p=new URLSearchParams(window.location.search),clid=p.get('fbclid');if(clid){var now=Date.now();localStorage.setItem('tuvi_fbclid',clid);localStorage.setItem('tuvi_fbc','fb.1.'+now+'.'+clid);localStorage.setItem('tuvi_fbc_ts',String(now));}}catch(e){}
var h = window.location.hostname;
var path = window.location.pathname || '';
var isProd = h !== 'localhost' && h !== '127.0.0.1' && !h.endsWith('.vercel.app') && !path.startsWith('/admin');
if (!isProd) return;
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2104187747130873');
fbq('track', 'PageView');
})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M5V95KJ4"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=2104187747130873&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <RouteTracker />
              {children}
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
