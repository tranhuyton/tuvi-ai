import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Sparkles,
  Compass,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Clock,
  ShieldCheck,
  HelpCircle,
  BookOpen,
  Crown,
  Gem,
} from 'lucide-react';
import { SEO_ARTICLES, getArticleBySlug, FUNNEL_STAGE_META } from '@/lib/seoArticles';
import GuideMenuDropdown from '@/components/GuideMenuDropdown';
import { ArticleHeroIllustration } from '@/components/MetaphysicalIllustration';

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

  const stageMeta = FUNNEL_STAGE_META[article.funnelStage];
  const relatedArticles = article.relatedSlugs
    .map((s) => getArticleBySlug(s))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

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

      <div className="max-w-[920px] mx-auto space-y-8">
        {/* Thanh Breadcrumb & CTA Nhanh */}
        <nav
          aria-label="Breadcrumb"
          className="relative z-40 flex items-center justify-between gap-3 flex-wrap bg-slate-900/80 border border-amber-500/25 rounded-2xl px-4 py-3 text-xs sm:text-sm"
        >
          <div className="flex items-center gap-2 text-slate-300 flex-wrap">
            <Link href="/" className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1">
              <Compass className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            <span className="text-slate-600">/</span>
            <Link href="/bai-viet" className="hover:text-amber-300 transition">
              Cẩm Nang Tử Vi
            </Link>
            <span className="text-slate-600 hidden sm:inline">/</span>
            <span className="text-slate-400 hidden sm:inline truncate max-w-[260px]">
              {article.shortTitle}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <GuideMenuDropdown />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>An Sao & Bình Giải 0đ</span>
            </Link>
          </div>
        </nav>

        {/* Nội dung chính của bài viết */}
        <article className="rounded-3xl bg-slate-900/90 border border-amber-500/30 p-6 sm:p-10 space-y-8 shadow-2xl">
          {/* Header Bài viết */}
          <header className="space-y-4 border-b border-slate-800 pb-6">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{article.category}</span>
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  {article.readTime}
                </span>
                <span>•</span>
                <span>Cập nhật: {article.updatedAt}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-amber-400 leading-tight">
              {article.title}
            </h1>

            {/* Thông tin tác giả E-E-A-T (Cực kỳ quan trọng cho Google & AI GEO) */}
            <div className="flex items-center justify-between gap-4 flex-wrap pt-2 text-xs sm:text-sm text-slate-300 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 font-serif font-bold text-base shrink-0">
                  Tôn
                </div>
                <div>
                  <div className="font-bold text-white">
                    Biên soạn & Kiểm duyệt: <span className="text-amber-300">Thầy Tôn (Trần Huy Tôn)</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Cựu HS Chuyên Toán ĐH Tổng Hợp • Cử nhân &amp; Thạc sỹ Tài chính - Kế toán ĐH Lancaster (Top 5 UK) • 18+ năm Tử Vi Thực Chứng
                  </div>
                </div>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
                ✔ Đã kiểm chứng học thuật ({stageMeta.code})
              </span>
            </div>
          </header>

          {/* KHỐI GEO ANSWER-FIRST (Tóm tắt trực diện cho AI Search: ChatGPT, Gemini, Perplexity & Người đọc bận rộn) */}
          <section
            aria-label="Tóm tắt cốt lõi từ chuyên gia"
            className="rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-950/90 to-emerald-500/10 border border-amber-500/40 p-5 sm:p-6 space-y-3"
          >
            <div className="inline-flex items-center gap-2 text-amber-300 font-serif font-bold text-sm sm:text-base">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
              <span>Tóm Tắt Cốt Lõi Từ Chuyên Gia (Trích Dẫn Nhanh):</span>
            </div>

            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
              {article.geoSummary}
            </p>

            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Điểm nhấn quan trọng cần nhớ:
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-200">
                {article.keyTakeaways.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Ảnh Minh Họa & Sơ Đồ Chuyên Đề */}
          <ArticleHeroIllustration
            code={article.slug}
            title={article.shortTitle}
          />

          {/* Khối Nội dung chi tiết từng phần */}
          <div className="space-y-8">
            {article.sections.map((sec, idx) => (
              <React.Fragment key={sec.id}>
                <section id={sec.id} className="space-y-3.5">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-300 leading-snug">
                    {sec.heading}
                  </h2>
                  <div
                    className="prose prose-invert max-w-none text-sm sm:text-base text-slate-200 leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_strong]:text-amber-200"
                    dangerouslySetInnerHTML={{ __html: sec.contentHtml }}
                  />
                </section>

                {/* Cầu nối Phễu Chuyển Đổi Giữa Bài (Mid-Article Funnel Bridge) sau phần 1 */}
                {idx === 0 && (
                  <div className="my-6 rounded-2xl bg-slate-950/90 border border-emerald-500/35 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                        ⚡ Công Cụ Thực Chứng Ngay Trên Lá Số Của Bạn
                      </div>
                      <div className="text-sm sm:text-base font-bold text-white">
                        {article.primaryCtaText}
                      </div>
                      <div className="text-xs text-slate-400">{article.primaryCtaSubtext}</div>
                    </div>
                    <Link
                      href="/"
                      className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Lập Lá Số Miễn Phí (0đ)</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Khối Câu Hỏi Thường Gặp (FAQ Schema) của riêng bài viết */}
          {article.faqs.length > 0 && (
            <section className="pt-6 border-t border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-lg sm:text-xl">
                <HelpCircle className="w-5 h-5" />
                <h2>Câu Hỏi Thường Gặp Về Chủ Đề Này</h2>
              </div>
              <div className="space-y-3">
                {article.faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950/75 border border-slate-800 space-y-1.5"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-amber-300">
                      {faq.question}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Khối Chốt Phễu Cuối Bài (Bottom Conversion Funnel Block) */}
          <section className="rounded-2xl bg-gradient-to-br from-amber-500/20 via-slate-950 to-purple-900/25 border border-amber-500/40 p-6 sm:p-8 space-y-5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bắt Đầu Hành Trình Thấu Hiểu Bản Mệnh</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Đừng Chỉ Đọc Lý Thuyết — Hãy Soi Chiếu Trực Tiếp Trên Lá Số Của Chính Bạn!
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Nhập Ngày tháng năm sinh & Giờ sinh tại trang chủ <strong className="text-amber-300">Tử Vi Thầy Tôn</strong> để nhận ngay <strong className="text-emerald-300">Bản Bình Giải Khởi Nguyên Miễn Phí (0đ)</strong>, hoặc trải nghiệm <strong className="text-amber-300">Bản VIP Pro (119k)</strong> & <strong className="text-purple-300">Bản Chuyên Gia 12 Cung (269k)</strong> kết hợp Xem Mặt & Chỉ Tay.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left text-xs">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30">
                <div className="font-bold text-emerald-300 mb-0.5">📜 Khởi Nguyên (0đ)</div>
                <div className="text-slate-300">An sao 110+ sao & Bình giải ~1.000 từ miễn phí 100%.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30">
                <div className="font-bold text-amber-300 mb-0.5 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" /> VIP Pro (119.000đ)
                </div>
                <div className="text-slate-300">Luận sâu ~2.500 từ + Xem Mặt & Chỉ Tay + Tặng 2 câu VIP.</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-purple-500/30">
                <div className="font-bold text-purple-300 mb-0.5 flex items-center gap-1">
                  <Gem className="w-3.5 h-3.5" /> Expert 12 Cung (269.000đ)
                </div>
                <div className="text-slate-300">Trọn bộ 12 cung & 12 tháng Lưu Nguyệt + Tặng 2 câu Expert.</div>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition"
              >
                <Sparkles className="w-4 h-4" />
                <span>{article.primaryCtaText}</span>
              </Link>
              <a
                href="https://zalo.me/0935058688"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-bold text-sm transition"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Đặt Lịch Xem 1-1: 0935.058.688</span>
              </a>
            </div>
          </section>
        </article>

        {/* Liên kết nội bộ sang các bài tiếp theo trong Phễu (Topic Cluster Navigation) */}
        {relatedArticles.length > 0 && (
          <section className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-400">
                Bài Viết Tiếp Theo Trong Lộ Trình Giải Mã Vận Mệnh
              </h2>
              <Link
                href="/bai-viet"
                className="text-xs sm:text-sm text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
              >
                <span>Xem tất cả 10 chuyên khảo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/bai-viet/${rel.slug}`}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 transition flex flex-col justify-between space-y-2 group"
                >
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-amber-400">{rel.category}</span>
                    <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition leading-snug">
                      {rel.shortTitle}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 group-hover:text-amber-300 inline-flex items-center gap-1 pt-1">
                    Đọc tiếp <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="text-center">
          <Link
            href="/bai-viet"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại danh mục Cẩm Nang Tử Vi & Tướng Pháp</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
