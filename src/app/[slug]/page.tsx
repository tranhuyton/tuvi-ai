import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Sparkles,
  Compass,
  PhoneCall,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  HelpCircle,
  BookOpen,
  Crown,
  CheckCircle2,
  MapPin,
  GraduationCap,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { FUNNEL_PAGES, getFunnelPageBySlug, type FunnelPageData } from '@/lib/funnelPages';
import { ABOUT_DATA } from '@/lib/i18n/aboutData';
import GuideMenuDropdown from '@/components/GuideMenuDropdown';

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
          streetAddress: 'R2B 2219, Royal City, 72 Nguyễn Trãi',
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

function getMetaphysicalBadge(code: string): string {
  switch (code) {
    case 'P1':
    case 'P2':
    case 'P3':
      return 'Ấn Phẩm Luận Giải Mệnh Lý';
    case 'DV1':
    case 'DV2':
      return 'Tham Vấn Mệnh Lý & Định Hướng 1-1';
    case 'TR':
      return 'Chân Dung Chuyên Gia Mệnh Lý';
    case 'LH':
      return 'Liên Hệ & Đặt Lịch Tham Vấn';
    case 'C1':
      return 'Tổng Quan Phong Thủy & Cải Vận';
    case 'S1':
    case 'S2':
    case 'S3':
    case 'S4':
      return 'Phong Thủy Dương Trạch & Trạch Nhật';
    case 'B6':
    case 'B8':
    case 'B24':
    case 'B25':
      return 'Chuyên Khảo Phong Thủy & Mệnh Lý';
    case 'B1':
      return 'Cẩm Nang Nhập Môn Tử Vi Đẩu Số';
    default:
      return 'Chuyên Khảo Tinh Đẩu & Vận Hạn';
  }
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

  const group1Pages = FUNNEL_PAGES.filter((p) => p.groupNum === 1 && p.code !== page.code);
  const group2Pages = FUNNEL_PAGES.filter((p) => p.groupNum === 2 && p.code !== page.code);
  const group3Pages = FUNNEL_PAGES.filter((p) => p.groupNum === 3 && p.code !== page.code);

  const isExternalPrimary = page.primaryCta.href.startsWith('http') || page.primaryCta.href.startsWith('tel:');
  const isExternalSecondary = page.secondaryCta.href.startsWith('http') || page.secondaryCta.href.startsWith('tel:');

  return (
    <main className="min-h-screen bg-[#070a14] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Ambient background glow */}
      <div className="fixed top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-900/15 blur-[130px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-amber-900/15 blur-[130px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Top Navigation Bar */}
        <nav
          aria-label="Điều hướng chính"
          className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800/80"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-400">
            <Link
              href="/"
              className="hover:text-amber-300 transition-colors flex items-center gap-1 font-medium text-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              Trang chủ Lập Lá Số
            </Link>
            <span>/</span>
            {page.groupNum === 2 && page.code !== 'C1' && (
              <>
                <Link href="/phong-thuy" className="hover:text-amber-300 transition-colors">
                  Phong Thủy
                </Link>
                <span>/</span>
              </>
            )}
            {page.groupNum === 3 && page.code !== 'B1' && (
              <>
                <Link href="/cach-xem-la-so-tu-vi" className="hover:text-amber-300 transition-colors">
                  Kiến Thức Tử Vi
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-amber-300 font-medium line-clamp-1 max-w-[220px] sm:max-w-[360px]">
              {page.h1}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <GuideMenuDropdown />
            <Link
              href="/#lap-la-so"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 hover:from-amber-400 hover:to-yellow-500 transition-all shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Lập Lá Số Miễn Phí
            </Link>
          </div>
        </nav>

        {/* Main Article Container */}
        <article className="bg-slate-900/65 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          {/* Role & Branch Badge */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border text-amber-300 bg-amber-950/60 border-amber-500/40">
              <Crown className="w-3.5 h-3.5" />
              {getMetaphysicalBadge(page.code)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-2.5 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Chuẩn Tử Vi Đẩu Số &amp; Phong Thủy Thực Chiến
            </span>
          </div>

          {/* H1 Title */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
            {page.h1}
          </h1>

          {/* Author & Expert Verification Line (Right below H1 per Section A.2) */}
          <div className="flex flex-wrap items-center gap-3.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/90 mb-8 text-xs sm:text-sm text-slate-300">
            <img
              src="/avatar-thay-ton.jpg"
              alt="Thầy Tôn - Chuyên gia Tử Vi Đẩu Số và Phong Thủy"
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/60 shadow-md shrink-0"
            />
            <div className="flex-1 min-w-[200px]">
              <p className="font-semibold text-amber-300">{page.authorLine}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Cựu HS Chuyên Toán - Tin ĐH Tổng hợp Hà Nội • Cử nhân Tài chính &amp; Kế toán ĐH Lancaster (UK) • Hơn 15 năm giảng dạy IELTS &amp; Cambridge IGCSE
              </p>
            </div>
            {page.code !== 'TR' ? (
              <Link
                href="/thay-ton"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 shrink-0"
              >
                Xem hồ sơ Thầy Tôn →
              </Link>
            ) : (
              <Link
                href="/#lap-la-so"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4 shrink-0"
              >
                ← Quay về Lập Lá Số
              </Link>
            )}
          </div>

          {/* Tóm tắt nhanh (H2) — GEO Answer-First Highlight Block */}
          <section
            aria-label="Tóm tắt nhanh"
            className="mb-8 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900/90 to-indigo-950/30 border border-amber-500/40 p-5 sm:p-6 shadow-lg"
          >
            <h2 className="text-base sm:text-lg font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 mb-2.5">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              Tóm tắt nhanh
            </h2>
            <p
              className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium"
              dangerouslySetInnerHTML={{ __html: page.quickSummaryHtml }}
            />
          </section>

          {/* Khối Visual Hồ Sơ Chuyên Gia Dành Riêng Cho Trang /thay-ton (Mã TR) */}
          {page.code === 'TR' && (
            <section className="mb-10 space-y-6 rounded-3xl bg-slate-950/75 border border-amber-500/35 p-5 sm:p-8 shadow-xl">
              {/* Chân dung & Giới thiệu Chuyên Gia */}
              <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-slate-800/80">
                <img
                  src="/avatar-thay-ton.jpg"
                  alt="Thầy Tôn (Trần Huy Tôn) - Chuyên Gia Tử Vi Đẩu Số và Phong Thủy"
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-amber-400/80 shadow-xl shadow-amber-950/50 shrink-0"
                />
                <div className="text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{ABOUT_DATA.vi.badge}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-400 mb-2">
                    {ABOUT_DATA.vi.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {ABOUT_DATA.vi.bio}
                  </p>
                </div>
              </div>

              {/* 4 Thẻ Số Liệu Nổi Bật */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {ABOUT_DATA.vi.stats.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/25 text-center"
                  >
                    <div className="text-2xl sm:text-3xl font-black text-amber-400 font-serif">
                      {s.val}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* 3 Cột Trụ Nền Tảng Học Thuật & Thực Chứng */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-amber-300 font-serif">
                    {ABOUT_DATA.vi.pillar1.title}
                  </h3>
                  <ul className="text-xs sm:text-sm text-slate-200 space-y-2 leading-relaxed">
                    {ABOUT_DATA.vi.pillar1.points.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-blue-300 font-serif">
                    {ABOUT_DATA.vi.pillar2.title}
                  </h3>
                  <ul className="text-xs sm:text-sm text-slate-200 space-y-2 leading-relaxed">
                    {ABOUT_DATA.vi.pillar2.points.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span>
                          {typeof p === 'string' ? (
                            p
                          ) : (
                            <>
                              {p.text}
                              <a
                                href={p.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:underline inline-flex items-center gap-0.5 font-semibold"
                              >
                                {p.linkText} <ExternalLink className="w-3.5 h-3.5 inline" />
                              </a>
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-purple-300 font-serif">
                    {ABOUT_DATA.vi.pillar3.title}
                  </h3>
                  <ul className="text-xs sm:text-sm text-slate-200 space-y-2 leading-relaxed">
                    {ABOUT_DATA.vi.pillar3.points.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Thanh điều hướng quay lại Lập Lá Số / Mua Gói ngay sau khi đọc tổng quan hồ sơ */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800/80">
                <span className="text-xs sm:text-sm text-amber-200 font-medium">
                  Đã tìm hiểu rõ nền tảng của Thầy Tôn? Bắt đầu với lá số của bạn ngay:
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                  <Link
                    href="/#lap-la-so"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Quay Về Lập Lá Số &amp; Mở Khóa Bản Luận Giải</span>
                  </Link>
                  <a
                    href="https://tonyenglish.vn/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs sm:text-sm font-semibold transition"
                  >
                    <span>TonyEnglish.vn</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </section>
          )}

          {/* Introductory Context Paragraph */}
          {page.introHtml && (
            <p
              className="text-slate-200 leading-relaxed text-base sm:text-lg mb-6 pb-4 border-b border-slate-800/80"
              dangerouslySetInnerHTML={{ __html: page.introHtml }}
            />
          )}

          {/* Main Body Content (H2, H3, Lists, Tables, Internal Links) */}
          <div
            className="prose prose-invert max-w-none text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
          />

          {/* Câu hỏi thường gặp (H2) */}
          {page.faqs.length > 0 && (
            <section className="mt-12 pt-8 border-t border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-amber-300 mb-6 flex items-center gap-2.5">
                <HelpCircle className="w-6 h-6 text-amber-400 shrink-0" />
                Câu hỏi thường gặp
              </h2>
              <div className="space-y-4">
                {page.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-950/70 border border-slate-800/90 p-5 hover:border-amber-500/30 transition-colors"
                  >
                    <h3 className="text-base sm:text-lg font-bold text-amber-200 mb-2 flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{faq.question}</span>
                    </h3>
                    <p
                      className="text-sm sm:text-base text-slate-300 leading-relaxed pl-7"
                      dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Closing Section + Primary & Secondary CTA Buttons */}
          <section className="mt-10 pt-6 border-t border-slate-800/80">
            {page.closingHtml && (
              <div
                className="mb-6"
                dangerouslySetInnerHTML={{ __html: page.closingHtml }}
              />
            )}

            <div className="mt-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/40 p-6 sm:p-8 shadow-xl">
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3.5">
                {isExternalPrimary ? (
                  <a
                    href={page.primaryCta.href}
                    target={page.primaryCta.href.startsWith('http') ? '_blank' : undefined}
                    rel={page.primaryCta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{page.primaryCta.label}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                ) : (
                  <Link
                    href={page.primaryCta.href}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{page.primaryCta.label}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                )}

                {isExternalSecondary ? (
                  <a
                    href={page.secondaryCta.href}
                    target={page.secondaryCta.href.startsWith('http') ? '_blank' : undefined}
                    rel={page.secondaryCta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-semibold text-sm sm:text-base border border-amber-500/30 transition-all"
                  >
                    <PhoneCall className="w-4 h-4 shrink-0" />
                    <span>{page.secondaryCta.label}</span>
                  </a>
                ) : (
                  <Link
                    href={page.secondaryCta.href}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-amber-300 font-semibold text-sm sm:text-base border border-amber-500/30 transition-all"
                  >
                    <Compass className="w-4 h-4 shrink-0" />
                    <span>{page.secondaryCta.label}</span>
                  </Link>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Văn phòng: R2B 2219, Royal City, 72 Nguyễn Trãi, Thanh Xuân, Hà Nội
                </span>
                <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium">
                  <PhoneCall className="w-3.5 h-3.5" />
                  Hotline / Zalo đặt lịch: 0935 058 688
                </span>
              </div>
            </div>
          </section>
        </article>

        {/* Funnel Cluster Navigation (3 Branches) */}
        <section
          aria-label="Hệ thống chuyên đề Tử Vi & Phong Thủy Thầy Tôn"
          className="mt-10 bg-slate-900/50 border border-slate-800 rounded-3xl p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-amber-400" />
              Hệ Thống Chuyên Đề Tử Vi &amp; Phong Thủy Thầy Tôn
            </h2>
            <Link
              href="/"
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-4"
            >
              Về Trang Chủ Lập Lá Số Miễn Phí →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Nhánh 1 */}
            <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 pb-2 border-b border-slate-800">
                Luận Mệnh &amp; Tham Vấn • Ấn Phẩm Chuyên Sâu
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link href="/" className="text-slate-300 hover:text-amber-300 transition-colors block py-0.5">
                    • Lập Lá Số Tử Vi Miễn Phí (Trang chủ)
                  </Link>
                </li>
                {group1Pages
                  .filter((p) => p.code !== 'H')
                  .map((p) => (
                    <li key={p.code}>
                      <Link
                        href={p.url}
                        className="text-slate-300 hover:text-amber-300 transition-colors block py-0.5"
                      >
                        • {p.h1}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Nhánh 2 */}
            <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-3 pb-2 border-b border-slate-800">
                Phong Thủy &amp; Trạch Nhật • Địa Lợi Cải Vận
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                {group2Pages.map((p) => (
                  <li key={p.code}>
                    <Link
                      href={p.url}
                      className="text-slate-300 hover:text-emerald-300 transition-colors block py-0.5"
                    >
                      • {p.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nhánh 3 */}
            <div className="bg-slate-950/60 border border-slate-800/90 rounded-2xl p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3 pb-2 border-b border-slate-800">
                Tinh Đẩu &amp; Vận Hạn • Huyền Cơ Đẩu Số
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm">
                {group3Pages.map((p) => (
                  <li key={p.code}>
                    <Link
                      href={p.url}
                      className="text-slate-300 hover:text-indigo-300 transition-colors block py-0.5"
                    >
                      • {p.h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
