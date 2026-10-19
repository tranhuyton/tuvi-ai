import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Compass,
  Crown,
  Gem,
  PhoneCall,
  CheckCircle2,
  Layers,
  Clock,
} from 'lucide-react';
import { SEO_ARTICLES, FUNNEL_STAGE_META, FunnelStage } from '@/lib/seoArticles';

export const metadata: Metadata = {
  title: 'Cẩm Nang Tử Vi Đẩu Số, Diện Tướng & Chỉ Tay Thực Chứng | Tử Vi Thầy Tôn',
  description:
    'Hệ thống bài viết chuyên sâu về Tử Vi Đẩu Số, Bát Bộ Thần Sát, Diện Tướng (khuôn mặt) và Thủ Tướng (chỉ tay) dưới góc nhìn khoa học thực chứng của Thầy Tôn (Trần Huy Tôn).',
  alternates: {
    canonical: 'https://tuvithayton.vn/bai-viet',
  },
  openGraph: {
    title: 'Cẩm Nang Tử Vi Đẩu Số, Diện Tướng & Chỉ Tay Thực Chứng | Tử Vi Thầy Tôn',
    description:
      'Khám phá kho tàng tri thức Tử Vi Đẩu Số, cách lập lá số miễn phí, xem vận hạn 2026, giải mã Mệnh - Tài - Quan - Phu Thê và phương pháp kết hợp Xem Mặt & Chỉ Tay.',
    url: 'https://tuvithayton.vn/bai-viet',
    type: 'website',
  },
};

const STAGES_ORDER: FunnelStage[] = ['TOFU', 'MOFU', 'USP_GEO', 'BOFU'];

export default function BaiVietIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Cẩm Nang Tử Vi Đẩu Số & Tướng Pháp Thực Chứng — Tử Vi Thầy Tôn',
    url: 'https://tuvithayton.vn/bai-viet',
    description:
      'Chuyên mục bài viết nghiên cứu Tử Vi Đẩu Số, Bát Bộ Thần Sát, Diện Tướng & Chỉ Tay thực chứng của Thầy Tôn (Trần Huy Tôn).',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: SEO_ARTICLES.map((art, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://tuvithayton.vn/bai-viet/${art.slug}`,
        name: art.title,
      })),
    },
  };

  return (
    <main className="min-h-screen bg-[#070B19] text-slate-100 py-8 sm:py-12 px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-[1080px] mx-auto space-y-10">
        {/* Thanh điều hướng quay lại Trang chủ An Sao */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-slate-900/80 border border-amber-500/25 rounded-2xl px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-serif font-bold text-base sm:text-lg transition"
          >
            <Compass className="w-5 h-5" />
            <span>TỬ VI THẦY TÔN</span>
          </Link>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>An Sao & Bình Giải Miễn Phí (0đ)</span>
            </Link>
            <a
              href="https://zalo.me/0935058688"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Đặt Lịch 1-1: 0935.058.688</span>
            </a>
          </div>
        </div>

        {/* Hero Header */}
        <header className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-amber-500/35 p-6 sm:p-10 text-center space-y-4 shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Thư Viện Học Thuật & Thực Chứng • Chuẩn SEO & AI GEO</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-amber-400 tracking-wide leading-tight">
            CẨM NANG TỬ VI ĐẨU SỐ, DIỆN TƯỚNG & CHỈ TAY THỰC CHỨNG
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Hệ thống chuyên khảo được biên soạn bởi <strong className="text-amber-300">Thầy Tôn (Trần Huy Tôn)</strong> — kết hợp Tư duy Toán học, Nhãn quan Kinh tế Tài chính Quốc tế (ĐH Lancaster - Top 5 UK) cùng hơn 18 năm nghiên cứu Tử Vi Đẩu Số, Bát Bộ Thần Sát và Tướng Pháp.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Lập Lá Số & Nhận Bình Giải Miễn Phí (0đ)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Hiển thị các bài viết được phân nhóm theo 4 Tầng Phễu Chiến Lược */}
        <div className="space-y-10">
          {STAGES_ORDER.map((stageKey) => {
            const stageMeta = FUNNEL_STAGE_META[stageKey];
            const stageArticles = SEO_ARTICLES.filter((a) => a.funnelStage === stageKey);

            const borderColor =
              stageMeta.color === 'emerald'
                ? 'border-emerald-500/35'
                : stageMeta.color === 'amber'
                ? 'border-amber-500/35'
                : stageMeta.color === 'purple'
                ? 'border-purple-500/35'
                : 'border-blue-500/35';

            const badgeColor =
              stageMeta.color === 'emerald'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                : stageMeta.color === 'amber'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/35'
                : stageMeta.color === 'purple'
                ? 'bg-purple-500/15 text-purple-200 border-purple-500/35'
                : 'bg-blue-500/15 text-blue-300 border-blue-500/35';

            return (
              <section
                key={stageKey}
                className={`rounded-3xl bg-slate-900/75 border ${borderColor} p-6 sm:p-8 space-y-6 shadow-xl`}
              >
                <div className="space-y-2 border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
                      <Layers className="w-3.5 h-3.5" />
                      <span>{stageMeta.shortLabel}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      {stageArticles.length} chuyên đề trọng tâm
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                    {stageMeta.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong className="text-amber-300">Vai trò trong luồng đọc:</strong> {stageMeta.goal}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {stageArticles.map((article) => (
                    <article
                      key={article.slug}
                      className="rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 p-5 flex flex-col justify-between space-y-4 transition group"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                          <span className="font-semibold text-amber-400">{article.category}</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold font-serif text-slate-100 group-hover:text-amber-300 transition leading-snug">
                          <Link href={`/bai-viet/${article.slug}`}>{article.title}</Link>
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                          {article.geoSummary}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                        <Link
                          href={`/bai-viet/${article.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition"
                        >
                          <span>Đọc chi tiết chuyên khảo</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Khối Chốt Chuyển Đổi Cuối Trang (Bottom Funnel CTA) */}
        <section className="rounded-3xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-purple-900/20 border border-amber-500/40 p-6 sm:p-10 text-center space-y-5 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-400">
            Trải Nghiệm Ngay Hệ Thống An Sao & Luận Giải Tử Vi Thực Chứng
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Kiểm chứng ngay độ chính xác trên chính lá số của bạn với <strong className="text-emerald-300">Bản Khởi Nguyên Miễn Phí (0đ)</strong>, hoặc mở khóa trọn bộ <strong className="text-amber-300">VIP Pro (119k)</strong> & <strong className="text-purple-300">Đại Tông Sư Expert 12 Cung (269k)</strong> kết hợp Xem Mặt & Chỉ Tay.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-emerald-300">Gói 0đ Miễn Phí:</strong> An sao 110+ sao & đọc bình giải ~1.000 từ.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 flex items-start gap-2">
              <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong className="text-amber-300">Gói VIP Pro (119k):</strong> Luận sâu + Xem Mặt/Chỉ tay + Tặng 2 câu VIP.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/30 flex items-start gap-2">
              <Gem className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong className="text-purple-300">Gói Expert (269k):</strong> Luận 12 cung & 12 tháng + Tặng 2 câu Expert.</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 transition"
            >
              <Sparkles className="w-5 h-5" />
              <span>Lập Lá Số & Bình Giải Miễn Phí Ngay</span>
            </Link>
            <a
              href="https://zalo.me/0935058688"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 font-bold text-sm sm:text-base transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Đặt Lịch Xem 1-1: 0935.058.688</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
