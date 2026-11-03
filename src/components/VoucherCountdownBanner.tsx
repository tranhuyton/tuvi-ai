'use client';

import React, { useEffect, useState } from 'react';
import { Crown, Gem, Clock, Sparkles } from 'lucide-react';

export interface ClientVoucherInfo {
  code: string;
  discountPercent: 20 | 30;
  durationHours: number;
  expiresAt: string;
  userId?: string | null;
  email?: string | null;
  chartId?: string | null;
  prices: {
    reading_vip: number;
    reading_expert: number;
  };
  originalPrices: {
    reading_vip: number;
    reading_expert: number;
  };
}

interface VoucherCountdownBannerProps {
  voucher: ClientVoucherInfo;
  hasChart: boolean;
  onSelectPro: () => void;
  onSelectExpert: () => void;
  onExpire: () => void;
}

function formatRemaining(ms: number): string {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function VoucherCountdownBanner({
  voucher,
  hasChart,
  onSelectPro,
  onSelectExpert,
  onExpire,
}: VoucherCountdownBannerProps) {
  const [remainingMs, setRemainingMs] = useState<number>(() =>
    Math.max(0, new Date(voucher.expiresAt).getTime() - Date.now())
  );

  useEffect(() => {
    const update = () => {
      const diff = new Date(voucher.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemainingMs(0);
        onExpire();
      } else {
        setRemainingMs(diff);
      }
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [voucher.expiresAt, onExpire]);

  if (remainingMs <= 0) return null;

  const vipK = Math.round(voucher.prices.reading_vip / 1000);
  const expK = Math.round(voucher.prices.reading_expert / 1000);

  return (
    <div className="w-full mb-5 rounded-2xl border border-amber-400/60 bg-gradient-to-r from-red-950/90 via-purple-950/90 to-amber-950/90 p-3.5 sm:p-4 shadow-xl shadow-red-950/40 print:hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-extrabold text-xs tracking-wide shrink-0 shadow">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ƯU ĐÃI RIÊNG -{voucher.discountPercent}%</span>
          </div>

          <div className="text-xs sm:text-sm text-slate-100 leading-snug">
            Mã <span className="font-mono font-bold text-amber-300">{voucher.code}</span> đã được tự động áp dụng cho 2 gói mở khóa Luận Giải!
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-600/30 border border-red-400/50 text-red-200 font-mono font-bold text-xs sm:text-sm shrink-0">
            <Clock className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Tự hủy sau:</span>
            <span className="text-amber-300 text-sm sm:text-base tracking-wider">
              {formatRemaining(remainingMs)}
            </span>
          </div>
        </div>

        {hasChart && (
          <div className="flex items-center justify-center gap-2 flex-wrap shrink-0 w-full lg:w-auto">
            <button
              type="button"
              onClick={onSelectPro}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow transition cursor-pointer"
            >
              <Crown className="w-4 h-4 shrink-0" />
              <span>
                Bản Pro:{' '}
                <s className="opacity-65 font-normal">119K</s>{' '}
                <strong>{vipK}K</strong>
              </span>
            </button>

            <button
              type="button"
              onClick={onSelectExpert}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-xs sm:text-sm shadow transition cursor-pointer"
            >
              <Gem className="w-4 h-4 shrink-0" />
              <span>
                Bản Expert 12 Cung:{' '}
                <s className="opacity-75 font-normal">269K</s>{' '}
                <strong>{expK}K</strong>
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
