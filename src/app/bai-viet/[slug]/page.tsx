import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEO_ARTICLES, getArticleBySlug } from '@/lib/seoArticles';
import BaiVietDetailClient from '@/components/BaiVietDetailClient';

export function generateStaticParams() {
  return SEO_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Bài viết không tồn tại | Tử Vi Thầy Tôn',
    };
  }

  const url = `https://tuvithayton.vn/bai-viet/${article.slug}`;

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    authors: [{ name: 'Thầy Tôn (Trần Huy Tôn)', url: 'https://tuvithayton.vn' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url,
      siteName: 'Tử Vi Thầy Tôn',
      locale: 'vi_VN',
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: ['Thầy Tôn (Trần Huy Tôn)'],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

export default async function BaiVietDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articleUrl = `https://tuvithayton.vn/bai-viet/${article.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Tử Vi Thầy Tôn (An Sao Miễn Phí)',
            item: 'https://tuvithayton.vn',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Cẩm Nang Tử Vi & Tướng Pháp',
            item: 'https://tuvithayton.vn/bai-viet',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.shortTitle,
            item: articleUrl,
          },
        ],
      },
      {
        '@type': 'Article',
        '@id': `${articleUrl}#article`,
        headline: article.title,
        description: article.metaDescription,
        abstract: article.geoSummary,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        inLanguage: 'vi-VN',
        mainEntityOfPage: articleUrl,
        keywords: article.keywords.join(', '),
        author: {
          '@type': 'Person',
          '@id': 'https://tuvithayton.vn/#thay-ton',
          name: 'Thầy Tôn (Trần Huy Tôn)',
          jobTitle: 'Chuyên gia Tử Vi Đẩu Số, Bát Bộ Thần Sát & Tướng Pháp Thực Chứng',
          alumniOf: [
            {
              '@type': 'CollegeOrUniversity',
              name: 'Lancaster University (Top 5 UK - Accounting & Finance)',
            },
            {
              '@type': 'EducationalOrganization',
              name: 'Khối Chuyên Toán - Tin, Trường Đại học Tổng Hợp Hà Nội',
            },
          ],
          url: 'https://tuvithayton.vn/#gioi-thieu-thay-ton',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Tử Vi Thầy Tôn',
          url: 'https://tuvithayton.vn',
        },
      },
      ...(article.faqs.length > 0
        ? [
            {
              '@type': 'FAQPage',
              '@id': `${articleUrl}#faq`,
              mainEntity: article.faqs.map((f) => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: f.answer,
                },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <main className="min-h-screen bg-[#070B19] text-slate-100 py-8 sm:py-12 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BaiVietDetailClient article={article} />
    </main>
  );
}
