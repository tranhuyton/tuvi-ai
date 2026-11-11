'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, AlertCircle, Crown, Gem, FileDown, RefreshCw, Compass, X } from 'lucide-react';
import { ServiceTier, DuLieuDuongSo, LaSoData } from '@/types/tuvi';
import { useLanguage } from '@/context/LanguageContext';
import { exportReadingToPdf } from '@/lib/pdfExport';
import { cleanReadingHtml } from '@/lib/tuvi/cleanReadingHtml';
import { isInAppBrowser, getInAppBrowserName } from '@/lib/inAppBrowser';
import { ClientVoucherInfo } from '@/components/VoucherCountdownBanner';
import { computeTamHanAnalysis } from '@/lib/tuvi/anSao';

interface LuanGiaiAIProps {
  readingHtml?: string;
  isLoading: boolean;
  error?: string;
  tier?: ServiceTier;
  onUpgrade?: () => void;
  onUpgradeToExpert?: () => void;
  isUpgrading?: boolean;
  duongSo?: DuLieuDuongSo;
  laSo?: LaSoData;
  activeVoucher?: ClientVoucherInfo | null;
}

export default function LuanGiaiAI({
  readingHtml,
  isLoading,
  error,
  tier = 'free',
  onUpgrade,
  onUpgradeToExpert,
  isUpgrading,
  duongSo,
  laSo,
  activeVoucher,
}: LuanGiaiAIProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfProgressText, setPdfProgressText] = useState('');
  const [showInAppModal, setShowInAppModal] = useState(false);
  const [inAppName, setInAppName] = useState('');

  const safeReadingHtml = cleanReadingHtml(readingHtml);

  const handleCopy = () => {
    if (!safeReadingHtml) return;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = safeReadingHtml;
    navigator.clipboard.writeText(tempDiv.innerText || tempDiv.textContent || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const executeExportPdf = async () => {
    if (!safeReadingHtml || isExportingPdf) return;
    setIsExportingPdf(true);
    setPdfProgressText('Đang tạo PDF...');
    try {
      await exportReadingToPdf({
        duongSo,
        laSo,
        readingHtml: safeReadingHtml,
        tier,
        onProgress: (msg) => setPdfProgressText(msg),
      });
    } catch (err) {
      console.error('Lỗi khi xuất PDF:', err);
    } finally {
      setIsExportingPdf(false);
      setPdfProgressText('');
    }
  };

  const handleExportPdf = () => {
    if (isInAppBrowser()) {
      setInAppName(getInAppBrowserName());
      setShowInAppModal(true);
      return;
    }
    executeExportPdf();
  };

  const isPro = tier === 'pro';
  const isExpert = tier === 'expert';
  const hasFreeVoucher = tier === 'free' && Boolean(activeVoucher);
  const vipVoucherK = activeVoucher ? Math.round(activeVoucher.prices.reading_vip / 1000) : 119;
  const expVoucherK = activeVoucher ? Math.round(activeVoucher.prices.reading_expert / 1000) : 269;
  const tamHanSummary = React.useMemo(() => {
    if (!laSo) return null;
    try {
      return computeTamHanAnalysis(laSo);
    } catch {
      return null;
    }
  }, [laSo]);
  const ownerDisplayName = (duongSo?.hoTen || laSo?.duongSo?.hoTen || '').trim();
  const viewYearLabel = laSo?.namXem
    ? `${laSo.namXem}${laSo.namXemCanChi ? ` (${laSo.namXemCanChi})` : ''}`
    : '';

  if (!safeReadingHtml && !isLoading && !error && !onUpgrade && !onUpgradeToExpert) {
    return null;
  }

  return (
    <div className="w-full max-w-[1060px] mx-auto mt-10">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs font-extrabold uppercase tracking-widest mb-2.5 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Ấn Phẩm Luận Mệnh Tử Vi &amp; Nhân Tướng Học</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-wider text-gold-gradient flex items-center justify-center gap-2.5 font-serif drop-shadow-sm">
          {isExpert ? (
            <>
              <Gem className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400 shrink-0" />
              <span>{t('reading.expertTitle', 'Bình Giải Chuyên Gia Từ Thầy Tôn (Bản Expert)')}</span>
            </>
          ) : isPro ? (
            <>
              <Crown className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400 shrink-0" />
              <span>{t('reading.proTitle', 'Bình Giải Chuyên Sâu Từ Thầy Tôn (Bản Pro)')}</span>
            </>
          ) : (
            <>
              <span>🔮</span>
              <span>{t('reading.freeTitle', 'Bình Giải Tử Vi Thầy Tôn (Bản Cơ Bản)')}</span>
            </>
          )}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2.5 flex-wrap">
          <span
            className={`text-xs sm:text-sm px-3.5 py-1 rounded-full font-bold border shadow-sm ${
              isExpert
                ? 'bg-purple-500/20 text-purple-200 border-purple-400/50'
                : isPro
                ? 'bg-amber-500/20 text-amber-200 border-amber-400/50'
                : 'bg-emerald-500/20 text-emerald-200 border-emerald-400/50'
            }`}
          >
            {isExpert
              ? t('reading.expertBadge', '💎 Bản Chuyên Gia Expert • Đỉnh Cao Mệnh Lý')
              : isPro
              ? t('reading.proBadge', '👑 Bản Chuyên Sâu Bí Truyền')
              : t('reading.freeBadge', '📜 Bản Luận Giải Khởi Nguyên')}
          </span>
          <p className="text-sm sm:text-base text-slate-300">
            {isExpert
              ? t('reading.expertSubtitle', 'Luận giải trọn vẹn 12 Cung + Cung Thân (dài gấp 2 lần Bản Pro), Tướng Pháp & 12 Tháng Lưu Nguyệt')
              : isPro
              ? t('reading.proSubtitle', 'Toàn diện Tử Vi Cổ Truyền, Tứ Hóa, Tướng Pháp & Hóa Giải 4 Mùa')
              : t('reading.freeSubtitle', 'Tổng quan Mệnh Cục, Tam Hợp Mệnh-Tài-Quan, Đại Vận & Tiểu Vận')}
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="imperial-card border border-amber-500/40 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-2xl backdrop-blur-xl">
          <div className="relative w-20 h-20 mb-5 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-400 animate-spin" />
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-serif font-black text-lg shadow-lg shadow-amber-500/40">
              ☯
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-gold-gradient tracking-wider uppercase font-serif">
            {isUpgrading
              ? isExpert
                ? t('reading.loadingUpgradingExpert', 'Thầy Đang Nâng Cấp Luận Giải Chuyên Gia Expert...')
                : t('reading.loadingUpgrading', 'Thầy Đang Nâng Cấp Luận Giải Pro...')
              : t('reading.loadingNormal', 'Thầy Đang Quán Tưởng...')}
          </h3>
          <p className="text-sm sm:text-base text-slate-300 mt-2.5 max-w-lg leading-relaxed">
            {isExpert
              ? t(
                  'reading.loadingExpertDesc',
                  'Thầy Tôn đang định tâm quán tưởng thâm sâu toàn diện từng cung trong 12 Cung + Cung Thân, độ dài gấp 2 lần Bản Pro (~3.600 - 5.000 từ). Quý khách vui lòng tịnh tâm đợi khoảng 45 - 90 giây!'
                )
              : isPro || isUpgrading
              ? t(
                  'reading.loadingProDesc',
                  'Thầy Tôn đang định tâm quán tưởng thâm sâu, soi rọi 14 Chính tinh, đối chiếu Tướng pháp và luận giải vận khí 4 mùa. Quý khách vui lòng tịnh tâm đợi trong giây lát!'
                )
              : t(
                  'reading.loadingFreeDesc',
                  'Thầy Tôn đang định tâm chắt lọc huyền cơ lá số tử vi và bản mệnh. Quý khách vui lòng kiên nhẫn đợi trong giây lát!'
                )}
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="bg-red-950/70 border border-red-500/40 rounded-xl p-5 text-red-200 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-300 text-base">{t('reading.errorTitle', 'Thông báo từ Thầy Tôn:')}</h4>
            <p className="text-base sm:text-sm mt-1 whitespace-pre-wrap leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {!safeReadingHtml && !isLoading && !error && (onUpgrade || onUpgradeToExpert) && (
        <div className="imperial-card border border-purple-500/45 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500/20 to-amber-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Gem className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient font-serif">
              {t('reading.unlockCardTitle', 'Khai Mở Luận Giải Chuyên Sâu & Chuyên Gia Expert')}
            </h3>
            <p className="text-sm sm:text-base text-slate-300 mt-1.5 max-w-2xl mx-auto leading-relaxed">
              {t(
                'reading.unlockCardDesc',
                'Lá số đã được an sao hoàn tất. Quý khách vui lòng chọn gói bình giải bên dưới để mở mã QR thanh toán và kích hoạt bài luận giải từ Thầy Tôn (tự động mở khóa ngay sau khi chuyển khoản):'
              )}
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
            {onUpgradeToExpert && (
              <button
                type="button"
                onClick={onUpgradeToExpert}
                disabled={isUpgrading}
                className="btn-shimmer w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-purple-500/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gem className="w-5 h-5" />
                <span>
                  {isPro
                    ? t('reading.upgradeProToExpertBtn', '💎 Nâng Cấp Bản Expert (150.000đ - Tặng 2 câu hỏi)')
                    : hasFreeVoucher && activeVoucher
                    ? `💎 Thanh Toán Bản Expert: ${activeVoucher.prices.reading_expert.toLocaleString('vi-VN')}đ (-${activeVoucher.discountPercent}%)`
                    : t('reading.upgradeExpertBtnFull', '💎 Thanh Toán Bản Chuyên Gia Expert (269.000đ)')}
                </span>
              </button>
            )}
            {!isPro && !isExpert && onUpgrade && (
              <button
                type="button"
                onClick={onUpgrade}
                disabled={isUpgrading}
                className="btn-shimmer w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-xl text-sm sm:text-base shadow-lg shadow-amber-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown className="w-5 h-5" />
                <span>
                  {hasFreeVoucher && activeVoucher
                    ? `👑 Thanh Toán Bản Pro: ${activeVoucher.prices.reading_vip.toLocaleString('vi-VN')}đ (-${activeVoucher.discountPercent}%)`
                    : t('reading.upgradeBtnFull', '👑 Thanh Toán Bản Chuyên Sâu Pro (119.000đ)')}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {safeReadingHtml && !isLoading && (
        <div className="relative royal-scroll-paper text-slate-800 rounded-3xl p-5 sm:p-10 print:shadow-none print:p-4">
          {/* 4 Hoa Văn Góc Sớ Hoàng Gia */}
          <svg className="pointer-events-none absolute top-3 left-3 w-6 h-6 text-amber-700/40 print:hidden" viewBox="0 0 24 24" fill="none">
            <path d="M2 10V2H10M5 7V5H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <svg className="pointer-events-none absolute top-3 right-3 w-6 h-6 text-amber-700/40 print:hidden" viewBox="0 0 24 24" fill="none">
            <path d="M22 10V2H14M19 7V5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <svg className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 text-amber-700/40 print:hidden" viewBox="0 0 24 24" fill="none">
            <path d="M2 14V22H10M5 17V19H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <svg className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 text-amber-700/40 print:hidden" viewBox="0 0 24 24" fill="none">
            <path d="M22 14V22H14M19 17V19H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>

          <div className="flex flex-wrap items-center justify-between gap-2 mb-5 print:hidden border-b border-amber-700/20 pb-3.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-xs sm:text-sm px-3 py-1 rounded-lg font-bold shadow-xs ${
                  isExpert
                    ? 'bg-purple-100 text-purple-900 border border-purple-300'
                    : isPro
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-amber-50/90 text-amber-950 border border-amber-300/80'
                }`}
              >
                {isExpert
                  ? t('form.expertTitle', '💎 Bản Chuyên Gia Expert')
                  : isPro
                  ? t('form.proTitle', '👑 Bản Chuyên Sâu Pro')
                  : t('form.freeTitle', '📜 Bản Miễn Phí')}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-red-900/10 border border-red-800/25 text-red-900 text-[11px] font-serif font-bold tracking-wider uppercase">
                印 Ấn Tín Thầy Tôn
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {tier === 'free' && onUpgrade && (
                <button
                  type="button"
                  onClick={onUpgrade}
                  disabled={isUpgrading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg text-sm sm:text-xs font-bold shadow-md shadow-amber-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                  title="Nâng cấp xem luận giải chuyên sâu chi tiết gấp 2 lần"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  <span>
                    {hasFreeVoucher && activeVoucher
                      ? `⚡ Bản Pro ${vipVoucherK}K (-${activeVoucher.discountPercent}%)`
                      : t('reading.topUpgradeBtn', '⚡ Nâng Cấp Bản Pro (119K)')}
                  </span>
                </button>
              )}

              {tier === 'free' && onUpgradeToExpert && (
                <button
                  type="button"
                  onClick={onUpgradeToExpert}
                  disabled={isUpgrading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white rounded-lg text-sm sm:text-xs font-bold shadow-md shadow-purple-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                  title="Nâng cấp lên Bản Chuyên Gia Expert (Luận giải đầy đủ 12 Cung)"
                >
                  <Gem className="w-4 h-4" />
                  <span>
                    {hasFreeVoucher && activeVoucher
                      ? `💎 Bản Expert ${expVoucherK}K (-${activeVoucher.discountPercent}%)`
                      : t('reading.topUpgradeExpertFromFreeBtn', '💎 Bản Expert (269K)')}
                  </span>
                </button>
              )}

              {tier === 'pro' && onUpgradeToExpert && (
                <button
                  type="button"
                  onClick={onUpgradeToExpert}
                  disabled={isUpgrading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white rounded-lg text-sm sm:text-xs font-bold shadow-md shadow-purple-500/20 transition transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer"
                  title="Ưu đãi nâng cấp từ Bản Pro lên Bản Chuyên Gia Expert chỉ 150.000đ"
                >
                  <Gem className="w-4 h-4" />
                  <span>{t('reading.topUpgradeExpertFromProBtn', '💎 Nâng Cấp Bản Expert (150K)')}</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-red-800 to-red-700 hover:from-red-700 hover:to-red-600 text-white rounded-lg text-sm sm:text-xs font-semibold shadow-sm transition cursor-pointer disabled:opacity-50"
                title="Tải trực tiếp file PDF về điện thoại hoặc máy tính"
              >
                {isExportingPdf ? (
                  <RefreshCw className="w-4 h-4 text-amber-300 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4 text-amber-300" />
                )}
                <span>{isExportingPdf ? (pdfProgressText || t('reading.exportingPdf', 'Đang tạo PDF...')) : t('reading.exportPdf', 'Xuất File PDF')}</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm sm:text-xs font-semibold transition"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>{t('reading.copied', 'Đã sao chép')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>{t('reading.copyBtn', 'Sao chép lời bình')}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div
            className="prose max-w-none text-justify text-base sm:text-lg leading-relaxed sm:leading-loose space-y-4 font-sans"
            dangerouslySetInnerHTML={{ __html: safeReadingHtml }}
          />

          {tier === 'free' && (onUpgrade || onUpgradeToExpert) && (
            <div className="mt-8 bg-gradient-to-br from-amber-50 via-orange-50/70 to-purple-50/60 p-5 sm:p-6 rounded-2xl border-2 border-amber-300/90 shadow-md space-y-4 print:hidden">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-600/15 border border-amber-500/40 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
                  <Compass className="w-3.5 h-3.5 text-amber-700" />
                  <span>Bản Miễn Phí Mới Chỉ Mở 25% Chiều Sâu Lá Số</span>
                </div>
                <h4 className="font-extrabold text-amber-950 text-base sm:text-xl font-serif leading-snug">
                  {ownerDisplayName && viewYearLabel
                    ? `Giải Mã Trọn Vẹn 3 Tầng Vận Hạn Năm ${viewYearLabel} Của ${ownerDisplayName}`
                    : t('reading.upgradePromptTitle', 'Bạn muốn tìm hiểu sâu sắc hơn về lá số này?')}
                </h4>

                {tamHanSummary &&
                  (tamHanSummary.tieuVanCoordLabel ||
                    tamHanSummary.lndhCoordLabel ||
                    tamHanSummary.luuThaiTueCoordLabel) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      {tamHanSummary.tieuVanCoordLabel && (
                        <div className="rounded-xl bg-white/90 border border-amber-200 px-3 py-2 text-xs">
                          <div className="font-bold text-amber-800 uppercase tracking-wide text-[11px]">
                            1. Cung Tiểu Hạn (Nội Tâm)
                          </div>
                          <div className="font-semibold text-slate-900 mt-0.5">
                            {tamHanSummary.tieuVanCoordLabel}
                          </div>
                        </div>
                      )}
                      {tamHanSummary.lndhCoordLabel && (
                        <div className="rounded-xl bg-white/90 border border-cyan-200 px-3 py-2 text-xs">
                          <div className="font-bold text-cyan-800 uppercase tracking-wide text-[11px]">
                            2. Cung LN.Đại Hạn (Điểm Rơi)
                          </div>
                          <div className="font-semibold text-slate-900 mt-0.5">
                            {tamHanSummary.lndhCoordLabel}
                          </div>
                        </div>
                      )}
                      {tamHanSummary.luuThaiTueCoordLabel && (
                        <div className="rounded-xl bg-white/90 border border-purple-200 px-3 py-2 text-xs">
                          <div className="font-bold text-purple-800 uppercase tracking-wide text-[11px]">
                            3. Lưu Thái Tuế (Kết Quả)
                          </div>
                          <div className="font-semibold text-slate-900 mt-0.5">
                            {tamHanSummary.luuThaiTueCoordLabel}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                <p className="text-sm text-slate-700 leading-relaxed pt-1">
                  Mở khóa ngay để Thầy Tôn luận giải chi tiết sự tương tác của <strong>3 cung vận hạn trên</strong>, vận khí <strong>4 Mùa / 12 Tháng Âm lịch</strong>, mổ xẻ <strong>Tài Bạch – Quan Lộc – Phu Thê – Điền Trạch</strong>, đối chiếu Khuôn Mặt &amp; Chỉ Tay + <strong>🎁 Tặng kèm 02 câu hỏi riêng cùng Thầy Tôn</strong>!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 pt-1">
                {onUpgrade && (
                  <button
                    type="button"
                    onClick={onUpgrade}
                    className="flex-1 sm:flex-initial px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold rounded-xl text-sm shadow-md transition whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Crown className="w-4 h-4" />
                    <span>
                      {hasFreeVoucher && activeVoucher
                        ? `⚡ Mở Bản VIP Pro: ${activeVoucher.prices.reading_vip.toLocaleString('vi-VN')}đ (-${activeVoucher.discountPercent}%)`
                        : '⚡ Mở Bản VIP Pro — 119.000đ (+02 Câu Hỏi)'}
                    </span>
                  </button>
                )}
                {onUpgradeToExpert && (
                  <button
                    type="button"
                    onClick={onUpgradeToExpert}
                    className="flex-1 sm:flex-initial px-5 py-3 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-extrabold rounded-xl text-sm shadow-md transition whitespace-nowrap cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Gem className="w-4 h-4" />
                    <span>
                      {hasFreeVoucher && activeVoucher
                        ? `💎 Mở Bản Expert 12 Cung: ${activeVoucher.prices.reading_expert.toLocaleString('vi-VN')}đ (-${activeVoucher.discountPercent}%)`
                        : '💎 Mở Bản Expert 12 Cung — 269.000đ (+12 Tháng)'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {tier === 'pro' && onUpgradeToExpert && (
            <div className="mt-8 pt-6 border-t border-purple-200 bg-gradient-to-r from-purple-50 via-fuchsia-50/70 to-amber-50 p-4 sm:p-5 rounded-xl border border-purple-300 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div>
                <h4 className="font-bold text-purple-900 text-base sm:text-lg font-serif flex items-center gap-1.5">
                  <Gem className="w-5 h-5 text-purple-600" />
                  {t('reading.upgradeExpertPromptTitle', 'Đặc Quyền Nâng Cấp Lên Bản Chuyên Gia Expert')}
                </h4>
                <p className="text-sm sm:text-sm text-slate-700 mt-1 max-w-xl leading-relaxed">
                  {t(
                    'reading.upgradeExpertPromptDesc',
                    'Quý khách đang dùng Bản Chuyên Sâu Pro nên được hưởng ưu đãi nâng cấp lên Bản Chuyên Gia Expert chỉ với 150.000đ (giá gốc 269.000đ). Luận giải kỹ lưỡng toàn diện từng cung trong 12 Cung + Cung Thân, độ dài tăng gấp 2 lần Bản Pro (~3.600 - 5.000 từ) và tặng thêm 02 câu hỏi Chuyên Gia miễn phí!'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={onUpgradeToExpert}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold rounded-xl text-sm sm:text-base shadow-md transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <Gem className="w-4 h-4" />
                <span>{t('reading.upgradeProToExpertBtn', 'Nâng Cấp Bản Expert (150.000đ)')}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal hướng dẫn khi tải PDF trên trình duyệt in-app (Zalo, Facebook, TikTok...) */}
      {showInAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-base font-serif">
                <Compass className="w-5 h-5" />
                <span>Hướng dẫn tải PDF trên {inAppName || 'Zalo'}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowInAppModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Quý khách đang mở web qua trình duyệt nhúng của <strong>{inAppName || 'Zalo'}</strong>. Để bảo mật, trình duyệt nhúng chặn việc lưu file PDF trực tiếp về máy (hoặc báo lỗi <i>&quot;Không tìm thấy ứng dụng&quot;</i>).
            </p>

            <div className="bg-slate-800/80 rounded-xl p-3.5 space-y-2.5 text-xs sm:text-sm border border-slate-700">
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  Bấm vào biểu tượng <strong>dấu 3 chấm (•••)</strong> ở góc trên cùng bên phải màn hình.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  Chọn <strong>&ldquo;Mở bằng trình duyệt&rdquo;</strong> (Safari trên iPhone, Chrome trên Android).
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  Bấm lại <strong>&ldquo;Xuất file PDF&rdquo;</strong> để tải và lưu file mượt mà vào máy.
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInAppModal(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Tôi đã hiểu
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowInAppModal(false);
                  executeExportPdf();
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline text-center py-1 transition cursor-pointer"
              >
                Vẫn thử tải trực tiếp tại đây
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
