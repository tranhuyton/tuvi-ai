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
import { FUNNEL_PAGES } from '@/lib/funnelPages';
import GuideMenuDropdown from '@/components/GuideMenuDropdown';
import { ArticleCardThumbnail } from '@/components/MetaphysicalIllustration';

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
    type: 'website',
  },
};

const STAGES_ORDER: FunnelStage[] = ['TOFU', 'MOFU', 'USP_GEO', 'BOFU'];

const FUNNEL_GROUPS = [
  {
    groupNum: 1,
    badge: 'LUẬN MỆNH & THAM VẤN • ẤN PHẨM CHUYÊN SÂU',
    title: 'Hệ Thống Luận Giải Lá Số, Hỏi Đáp AI & Xem Trực Tiếp 1-1',
    desc: 'Tìm hiểu chi tiết các mức luận giải (Khởi Nguyên 0đ, Chuyên Sâu Pro 119.000đ, Chuyên Gia Expert 269.000đ — nâng cấp chỉ trả phần chênh lệch 150.000đ), Hỏi đáp AI Thầy Tôn và Đặt lịch xem trực tiếp 1-1 tại Royal City, Hà Nội.',
    color: 'amber',
  },
  {
    groupNum: 2,
    badge: 'PHONG THỦY & TRẠCH NHẬT • ĐỊA LỢI CẢI VẬN',
    title: 'Tư Vấn Phong Thủy Nhà Ở, Văn Phòng, Cải Vận & Xem Ngày Tốt',
    desc: 'Kết hợp Thiên thời (Lá số Tử Vi) và Địa lợi (Phong Thủy Dương Trạch): bố trí nhà ở, chung cư, văn phòng, cửa hàng, chọn ngày động thổ - nhập trạch - khai trương và xem tuổi làm nhà năm 2027.',
    color: 'emerald',
  },
  {
    groupNum: 3,
    badge: 'TINH ĐẨU & VẬN HẠN • HUYỀN CƠ ĐẨU SỐ',
    title: 'Cẩm Nang Đọc Lá Số Tử Vi: 12 Cung, 14 Chính Tinh, Tứ Hóa & Vận Hạn 2027',
    desc: 'Hướng dẫn bài bản cho người mới: cách đọc 12 cung, bảng 14 chính tinh đắc/hãm địa, bảng Tứ Hóa 10 Thiên Can, Mệnh vô chính diệu, cách tìm lại giờ sinh và tử vi năm 2027 Đinh Mùi.',
    color: 'indigo',
  },
];

export default function BaiVietIndexPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Hệ Thống ${FUNNEL_PAGES.length} Chuyên Đề Tử Vi Đẩu Số & Phong Thủy — Thầy Tôn`,
    url: 'https://www.tuvithayton.vn/bai-viet',
    description:
      `Thư viện ${FUNNEL_PAGES.length} trang chuyên khảo Tử Vi Đẩu Số và Phong Thủy theo lá số do Thầy Tôn biên soạn và thẩm định.`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: FUNNEL_PAGES.map((p, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.tuvithayton.vn${p.url}`,
        name: p.h1,
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
        <div className="relative z-40 flex items-center justify-between gap-4 flex-wrap bg-slate-900/80 border border-amber-500/25 rounded-2xl px-4 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-serif font-bold text-base sm:text-lg transition"
          >
            <Compass className="w-5 h-5" />
            <span>TỬ VI &amp; PHONG THỦY THẦY TÔN</span>
          </Link>

          <div className="flex items-center gap-2.5 flex-wrap">
            <GuideMenuDropdown />
            <Link
              href="/#lap-la-so"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Lập Lá Số Miễn Phí (0đ)</span>
            </Link>
            <a
              href="https://zalo.me/0935058688"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
              <span>Đặt Lịch 1-1: 0935 058 688</span>
            </a>
          </div>
        </div>

        {/* Hero Header */}
        <header className="relative overflow-hidden rounded-3xl bg-slate-900/90 border border-amber-500/35 p-6 sm:p-10 text-center space-y-4 shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs sm:text-sm font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Hệ Sinh Thái {FUNNEL_PAGES.length} Chuyên Đề • Tử Vi Đẩu Số &amp; Phong Thủy</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif text-amber-400 tracking-wide leading-tight">
            CẨM NANG TỬ VI ĐẨU SỐ &amp; PHONG THỦY THEO LÁ SỐ CÙNG THẦY TÔN
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Biên soạn và thẩm định chuyên môn bởi <strong className="text-amber-300">Thầy Tôn</strong> — Chuyên gia Tử Vi Đẩu Số và Phong Thủy với hơn 18 năm nghiên cứu, Cựu HS Chuyên Toán - Tin ĐH Tổng hợp Hà Nội, Cử nhân &amp; Thạc sỹ Tài chính &amp; Kế toán ĐH Lancaster (UK) và hơn 15 năm giảng dạy IELTS, Giao tiếp &amp; Cambridge IGCSE.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/#lap-la-so"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/20 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>Lập Lá Số &amp; Nhận Bình Giải Miễn Phí (0đ)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* 20 Chuyên Đề Trọng Tâm Theo 3 Nhánh Phễu */}
        <div className="space-y-10">
          {FUNNEL_GROUPS.map((grp) => {
            const pages = FUNNEL_PAGES.filter((p) => p.groupNum === grp.groupNum);
            const borderCls =
              grp.color === 'amber'
                ? 'border-amber-500/35'
                : grp.color === 'emerald'
                ? 'border-emerald-500/35'
                : 'border-indigo-500/35';
            const badgeCls =
              grp.color === 'amber'
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/35'
                : grp.color === 'emerald'
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/35'
                : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/35';

            return (
              <section
                key={grp.groupNum}
                className={`rounded-3xl bg-slate-900/75 border ${borderCls} p-6 sm:p-8 space-y-6 shadow-xl`}
              >
                <div className="space-y-2 border-b border-slate-800 pb-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeCls}`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{grp.badge}</span>
                    </span>
                    <span className="text-xs text-slate-400">
                      {pages.length} trang chuyên đề
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
                    {grp.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {grp.desc}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {pages.map((p) => (
                    <article
                      key={p.code}
                      className="rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 p-5 flex flex-col justify-between space-y-4 transition group"
                    >
                      <div className="space-y-2.5">
                        <Link href={p.url} className="block">
                          <ArticleCardThumbnail
                            code={p.code}
                            title={p.h1}
                            groupNum={p.groupNum}
                          />
                        </Link>
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                          <span className="font-semibold text-amber-400">
                            {p.groupNum === 1
                              ? 'Ấn Phẩm & Tham Vấn Mệnh Lý'
                              : p.groupNum === 2
                              ? 'Phong Thủy & Trạch Nhật'
                              : 'Tinh Hoa Tử Vi Đẩu Số'}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400">
                            {p.url}
                          </span>
                        </div>

                        <h3 className="text-base sm:text-lg font-bold font-serif text-slate-100 group-hover:text-amber-300 transition leading-snug">
                          <Link href={p.url}>{p.h1}</Link>
                        </h3>

                        <p className="text-xs sm:text-sm text-slate-300 line-clamp-3 leading-relaxed">
                          {p.quickSummaryText}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between border-t border-slate-800/80">
                        <Link
                          href={p.url}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-400 hover:text-amber-300 transition"
                        >
                          <span>Xem chi tiết chuyên đề</span>
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

        {/* Chuyên khảo mở rộng (Các bài viết chuyên sâu bổ trợ) */}
        <div className="space-y-10 pt-6 border-t border-slate-800">
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-300 text-center">
            CHUYÊN KHẢO MỞ RỘNG &amp; ĐỐI CHIẾU THỰC CHỨNG
          </h2>
          {STAGES_ORDER.map((stageKey) => {
            const stageMeta = FUNNEL_STAGE_META[stageKey];
            const stageArticles = SEO_ARTICLES.filter((a) => a.funnelStage === stageKey);

            return (
              <section
                key={stageKey}
                className="rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 space-y-6"
              >
                <div className="space-y-1 border-b border-slate-800 pb-3">
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-white">
                    {stageMeta.name}
                  </h3>
                  <p className="text-xs text-slate-400">{stageMeta.goal}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {stageArticles.map((article) => (
                    <article
                      key={article.slug}
                      className="rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-amber-500/50 p-5 flex flex-col justify-between space-y-3 transition group"
                    >
                      <div className="space-y-2">
                        <Link href={`/bai-viet/${article.slug}`} className="block">
                          <ArticleCardThumbnail
                            code={article.slug}
                            title={article.shortTitle}
                          />
                        </Link>
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                          <span className="font-semibold text-amber-400">{article.category}</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {article.readTime}
                          </span>
                        </div>
                        <h4 className="text-base font-bold font-serif text-slate-100 group-hover:text-amber-300 transition leading-snug">
                          <Link href={`/bai-viet/${article.slug}`}>{article.title}</Link>
                        </h4>
                        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                          {article.geoSummary}
                        </p>
                      </div>
                      <div className="pt-2">
                        <Link
                          href={`/bai-viet/${article.slug}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300"
                        >
                          <span>Đọc thêm</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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
            Bước Tiếp Theo Với Lá Số Của Bạn: Chọn Đúng Mức Luận Giải
          </h2>
          <p className="text-sm sm:text-base text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Bắt đầu bằng <strong className="text-emerald-300">Bản Khởi Nguyên Miễn Phí (0đ)</strong> để nắm tổng quan; khi đứng trước quyết định trong năm, mở khóa <strong className="text-amber-300">Bản Chuyên Sâu Pro (119.000đ)</strong> hoặc <strong className="text-purple-300">Bản Chuyên Gia Expert (269.000đ)</strong> — nâng cấp chỉ trả phần chênh lệch (150.000đ).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-left text-xs sm:text-sm">
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-emerald-500/30 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-emerald-300">Bản Khởi Nguyên (0đ):</strong> An hơn 110 sao &amp; bình giải ~1.000 từ.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-amber-500/30 flex items-start gap-2">
              <Crown className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span><strong className="text-amber-300">Bản Pro (119.000đ):</strong> ~2.500 từ, 4 mùa + Tặng 2 câu hỏi Chuyên Sâu.</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-purple-500/30 flex items-start gap-2">
              <Gem className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span><strong className="text-purple-300">Bản Expert (269.000đ):</strong> ~4.500-6.000 từ, 12 cung &amp; 12 tháng âm lịch.</span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/#lap-la-so"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 transition"
            >
              <Sparkles className="w-5 h-5" />
              <span>Lập Lá Số Miễn Phí</span>
            </Link>
            <a
              href="https://zalo.me/0935058688"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 font-bold text-sm sm:text-base transition"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Đặt Lịch Xem 1-1 Với Thầy Tôn (Zalo 0935 058 688)</span>
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
