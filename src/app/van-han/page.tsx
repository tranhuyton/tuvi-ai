import React from 'react';
import type { Metadata } from 'next';
import TuViWorkspaceClient from '@/components/TuViWorkspaceClient';

export const metadata: Metadata = {
  title: {
    absolute: 'Giải Mã Vận Hạn 2026 – 2027 Chuẩn 3 Tầng (Tiểu Hạn • LN.Đại Hạn • Lưu Thái Tuế) | Thầy Tôn',
  },
  description:
    'Luận giải Vận Hạn năm 2026 – 2027 qua đồng thời 3 cung hạn (Tiểu Hạn, Lưu Niên Đại Hạn, Lưu Thái Tuế) kết hợp Nhân Tướng Học cùng Thầy Tôn (Thạc sĩ ĐH Lancaster Top 5 UK, 18+ năm thực chứng).',
  alternates: {
    canonical: 'https://www.tuvithayton.vn/van-han',
  },
  openGraph: {
    title: 'Giải Mã Vận Hạn 2026 – 2027 Chuẩn 3 Tầng | Tử Vi Thầy Tôn',
    description:
      'Tiểu Hạn • LN.Đại Hạn • Lưu Thái Tuế | Luận giải logic, thực chứng, không mê tín cùng Thầy Tôn. Quét mã VietQR mở khóa tự động 24/7.',
    url: 'https://www.tuvithayton.vn/van-han',
    siteName: 'Tử Vi & Phong Thủy Thầy Tôn',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/og-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Giải Mã Vận Hạn 2026 – 2027 Chuẩn 3 Tầng Cùng Thầy Tôn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Giải Mã Vận Hạn 2026 – 2027 Chuẩn 3 Tầng | Tử Vi Thầy Tôn',
    description:
      'Tiểu Hạn • LN.Đại Hạn • Lưu Thái Tuế | Luận giải logic, thực chứng, không mê tín cùng Thầy Tôn.',
    images: ['/og-banner.jpg'],
  },
};

export default function VanHanLandingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Giải Mã Vận Hạn 2026 – 2027 Chuẩn 3 Tầng (Tiểu Hạn • Lưu Niên Đại Hạn • Lưu Thái Tuế)',
    description:
      'Dịch vụ luận giải lá số Tử Vi chuyên sâu soi chiếu đồng thời 3 cung vận hạn năm kết hợp Diện tướng & Chỉ tay cùng Thầy Tôn.',
    url: 'https://www.tuvithayton.vn/van-han',
    provider: {
      '@type': 'Person',
      name: 'Thầy Tôn (Trần Huy Tôn)',
      jobTitle: 'Chuyên gia Tử Vi Đẩu Số và Phong Thủy',
      url: 'https://www.tuvithayton.vn/thay-ton',
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Bản Chuyên Sâu VIP Pro',
        price: '119000',
        priceCurrency: 'VND',
        availability: 'https://schema.org/InStock',
        url: 'https://www.tuvithayton.vn/van-han',
      },
      {
        '@type': 'Offer',
        name: 'Bản Chuyên Gia Đại Tông Sư Expert (12 Cung + Khấu trừ 269k khi xem 1-1)',
        price: '269000',
        priceCurrency: 'VND',
        availability: 'https://schema.org/InStock',
        url: 'https://www.tuvithayton.vn/van-han',
      },
      {
        '@type': 'Offer',
        name: 'Nâng Cấp Xem Trực Tiếp 1-1 Cùng Thầy Tôn (Trừ Gói Expert 269K)',
        price: '1730000',
        priceCurrency: 'VND',
        availability: 'https://schema.org/InStock',
        url: 'https://www.tuvithayton.vn/dat-lich-xem-tu-vi',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TuViWorkspaceClient landingMode="van-han" />
    </>
  );
}
