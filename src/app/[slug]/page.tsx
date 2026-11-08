import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FUNNEL_PAGES, getFunnelPageBySlug, type FunnelPageData } from '@/lib/funnelPages';
import FunnelSlugClient from '@/components/FunnelSlugClient';

export function generateStaticParams() {
  return FUNNEL_PAGES.filter((p) => p.slug !== '').map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getFunnelPageBySlug(slug);

  if (!page) {
    return {
      title: 'Trang không tồn tại | Tử Vi & Phong Thủy Thầy Tôn',
    };
  }

  const canonicalUrl = `https://www.tuvithayton.vn${page.url}`;

  return {
    title: {
      absolute: page.metaTitle,
    },
    description: page.metaDescription,
    authors: [{ name: 'Thầy Tôn - Chuyên gia Tử Vi Đẩu Số và Phong Thủy', url: 'https://www.tuvithayton.vn/thay-ton' }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: canonicalUrl,
      siteName: 'Tử Vi & Phong Thủy Thầy Tôn',
      locale: 'vi_VN',
      type: 'article',
      publishedTime: '2026-10-24T00:00:00.000Z',
      modifiedTime: '2026-10-24T00:00:00.000Z',
      authors: ['Thầy Tôn'],
      images: [
        {
          url: '/thay-ton.png',
          width: 800,
          height: 800,
          alt: page.h1,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: page.metaTitle,
      description: page.metaDescription,
      images: ['/thay-ton.png'],
    },
  };
}

function buildPageJsonLd(page: FunnelPageData) {
  const canonicalUrl = `https://www.tuvithayton.vn${page.url}`;
  const authorEntity = {
    '@type': 'Person',
    name: 'Thầy Tôn',
    alternateName: 'Trần Huy Tôn',
    jobTitle: 'Chuyên gia Tử Vi Đẩu Số và Phong Thủy',
    url: 'https://www.tuvithayton.vn/thay-ton',
    image: 'https://www.tuvithayton.vn/thay-ton.png',
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Lancaster University (United Kingdom)',
      },
      {
        '@type': 'EducationalOrganization',
        name: 'Khối Chuyên Toán - Tin, Đại học Tổng hợp Hà Nội',
      },
    ],
  };

  const publisherEntity = {
    '@type': 'Organization',
    name: 'Tử Vi & Phong Thủy Thầy Tôn',
    url: 'https://www.tuvithayton.vn',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.tuvithayton.vn/thay-ton.png',
    },
  };

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trang chủ',
          item: 'https://www.tuvithayton.vn/',
        },
        ...(page.groupNum === 2 && page.code !== 'C1'
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Phong Thủy',
                item: 'https://www.tuvithayton.vn/phong-thuy',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: page.h1,
                item: canonicalUrl,
              },
            ]
          : page.groupNum === 3 && page.code !== 'B1'
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Cách Xem Lá Số Tử Vi',
                item: 'https://www.tuvithayton.vn/cach-xem-la-so-tu-vi',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: page.h1,
                item: canonicalUrl,
              },
            ]
          : [
              {
                '@type': 'ListItem',
                position: 2,
                name: page.h1,
                item: canonicalUrl,
              },
            ]),
      ],
    },
    {
      '@type': 'Article',
      headline: page.h1,
      description: page.metaDescription,
      datePublished: '2026-10-24',
      dateModified: '2026-10-24',
      mainEntityOfPage: canonicalUrl,
      author: authorEntity,
      reviewedBy: authorEntity,
      publisher: publisherEntity,
      image: 'https://www.tuvithayton.vn/thay-ton.png',
    },
  ];

  if (page.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answerText,
        },
      })),
    });
  }

  if (page.code === 'P1' || page.code === 'P2' || page.code === 'P3') {
    const price = page.code === 'P1' ? '119000' : page.code === 'P2' ? '269000' : '49000';
    graph.push({
      '@type': 'Product',
      name: page.h1,
      description: page.metaDescription,
      brand: {
        '@type': 'Brand',
        name: 'Tử Vi & Phong Thủy Thầy Tôn',
      },
      offers: {
        '@type': 'Offer',
        url: canonicalUrl,
        priceCurrency: 'VND',
        price,
        availability: 'https://schema.org/InStock',
      },
    });
  } else if (['DV1', 'DV2', 'C1', 'S1', 'S2', 'S3', 'S4'].includes(page.code)) {
    graph.push({
      '@type': 'Service',
      name: page.h1,
      description: page.metaDescription,
      url: canonicalUrl,
      provider: {
        '@type': 'ProfessionalService',
        name: 'Tử Vi & Phong Thủy Thầy Tôn',
        telephone: '+84935058688',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Khu đô thị Royal City, 72A Nguyễn Trãi',
          addressLocality: 'Thanh Xuân',
          addressRegion: 'Hà Nội',
          addressCountry: 'VN',
        },
      },
      areaServed: ['Hà Nội', 'Việt Nam'],
    });
  } else if (page.code === 'TR') {
    graph.push({
      '@type': 'ProfilePage',
      mainEntity: authorEntity,
    });
  } else if (page.code === 'LH') {
    graph.push({
      '@type': 'ContactPage',
      name: page.h1,
      description: page.metaDescription,
      url: canonicalUrl,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export default async function FunnelSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getFunnelPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const jsonLd = buildPageJsonLd(page);

  return (
    <main className="min-h-screen bg-[#070a14] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient background glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-900/15 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-amber-900/15 blur-[130px] pointer-events-none" />

      <FunnelSlugClient page={page} />
    </main>
  );
}
