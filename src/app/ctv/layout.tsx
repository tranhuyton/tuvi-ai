import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cổng Cộng Tác Viên (CTV) & Đối Tác Lan Tỏa',
  description:
    'Chương trình Cộng Tác Viên Tử Vi & Phong Thủy Thầy Tôn — nhận hoa hồng minh bạch, theo dõi đơn hàng theo thời gian thực và rút tiền VietQR nhanh chóng.',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: 'https://www.tuvithayton.vn/ctv',
  },
  openGraph: {
    title: 'Cổng Cộng Tác Viên (CTV) — Tử Vi & Phong Thủy Thầy Tôn',
    description:
      'Đồng hành lan tỏa tri thức Tử Vi Đẩu Số thực chứng cùng Thầy Tôn, theo dõi hoa hồng minh bạch 24/7.',
    url: 'https://www.tuvithayton.vn/ctv',
    siteName: 'Tử Vi & Phong Thủy Thầy Tôn',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Cổng Cộng Tác Viên Tử Vi & Phong Thủy Thầy Tôn',
      },
    ],
  },
};

export default function CtvLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
