import React from 'react';
import type { Metadata } from 'next';
import { FUNNEL_PAGES_INDEX } from '@/lib/funnelPagesIndex';
import { SEO_ARTICLES_INDEX } from '@/lib/seoArticlesIndex';
import BaiVietIndexClient from '@/components/BaiVietIndexClient';

export const metadata: Metadata = {
  title: {
    absolute: 'Cẩm Nang Tử Vi Đẩu Số & Phong Thủy Theo Lá Số | Thầy Tôn',
  },
  description:
    'Hệ thống 38 chuyên đề trọng điểm về Tử Vi Đẩu Số, 12 Cung Vị, Phong Thủy theo lá số, Diện Tướng và Chỉ Tay được biên soạn và thẩm định bởi Thầy Tôn (Trần Huy Tôn).',
  alternates: {
    canonical: 'https://www.tuvithayton.vn/bai-viet',
  },
  openGraph: {
    title: 'Cẩm Nang Tử Vi Đẩu Số & Phong Thủy Theo Lá Số | Thầy Tôn',
    description:
      'Khám phá hệ thống 38 chuyên đề Tử Vi Đẩu Số & Phong Thủy của Thầy Tôn: cách xem lá số tử vi, 12 cung, 14 chính tinh, Tứ Hóa, Lục Sát Tinh, Đại vận, tử vi 2027 và phong thủy.',
    url: 'https://www.tuvithayton.vn/bai-viet',
    siteName: 'Tử Vi & Phong Thủy Thầy Tôn',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/thay-ton.png',
        width: 800,
        height: 800,
        alt: 'Cẩm Nang Tử Vi Đẩu Số & Phong Thủy — Thầy Tôn',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cẩm Nang Tử Vi Đẩu Số & Phong Thủy Theo Lá Số | Thầy Tôn',
    description:
      'Khám phá hệ thống chuyên đề Tử Vi Đẩu Số & Phong Thủy theo lá số do Thầy Tôn biên soạn và thẩm định.',
    images: ['/thay-ton.png'],
  },
};

export default function BaiVietIndexPage() {
  const collectionItems = [
    ...FUNNEL_PAGES_INDEX.filter((p) => p.slug !== '').map((p) => ({
      url: `https://www.tuvithayton.vn${p.url}`,
      name: p.h1,
    })),
    ...SEO_ARTICLES_INDEX.map((a) => ({
      url: `https://www.tuvithayton.vn/bai-viet/${a.slug}`,
      name: a.title,
    })),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Hệ Thống ${FUNNEL_PAGES_INDEX.length} Chuyên Đề Tử Vi Đẩu Số & Phong Thủy — Thầy Tôn`,
    url: 'https://www.tuvithayton.vn/bai-viet',
    description:
      `Thư viện ${FUNNEL_PAGES_INDEX.length} trang chuyên khảo Tử Vi Đẩu Số và Phong Thủy theo lá số do Thầy Tôn biên soạn và thẩm định.`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: collectionItems.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: item.url,
        name: item.name,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#070B19] text-slate-100 py-8 sm:py-12 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BaiVietIndexClient />
    </main>
  );
}
