'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { setGa4UserId } from '@/lib/googleAnalytics';
import { getBrowserMetaAttribution } from '@/lib/metaPixel';
import { supabase } from '@/lib/supabase';

/**
 * 1. Ghi nhận mã giới thiệu CTV (`?ref=...`) và Meta Attribution (`fbclid`/`_fbc`/`_fbp`/UTM) trên MỌI trang.
 * 2. Đồng bộ bền vững Meta Attribution (`fbc`/`fbp`/UTM) vào `user_metadata.tuvi_meta_attr` của user Tử Vi
 *    để KHÔNG bị mất dấu khi khách bấm Email Drip chuyển sang trình duyệt khác (Safari/Chrome) rồi mới thanh toán!
 * 3. Gửi sự kiện Meta Pixel PageView cho điều hướng mềm (Next.js App Router SPA), bỏ qua trang /admin.
 * 4. Đồng bộ user_id sang GA4 (setGa4UserId) khi người dùng đăng nhập.
 */
export default function RouteTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isFirstMount = useRef(true);
  const syncedAttrSigRef = useRef<string>('');

  // Capture ?ref=, ?aff=, ?fbclid=, and UTM params globally across all pages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      // Trigger attribution capture & localStorage/cookie sync on every route change
      getBrowserMetaAttribution();

      const params = new URLSearchParams(window.location.search);
      const rawRef = params.get('ref') || params.get('aff');
      if (rawRef) {
        const cleanRef = rawRef.trim().toLowerCase();
        if (/^[a-z0-9_-]{2,20}$/.test(cleanRef)) {
          localStorage.setItem('tuvi_affiliate_ref', cleanRef);
          localStorage.setItem('tuvi_affiliate_time', String(Date.now()));
          const sessionKey = `tuvi_ref_tracked_${cleanRef}`;
          if (!sessionStorage.getItem(sessionKey)) {
            sessionStorage.setItem(sessionKey, '1');
            fetch('/api/affiliate/track-click', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ref: cleanRef }),
            }).catch(() => {});
          }
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [pathname]);

  // Persist fbc/fbp/utm onto authenticated TuVi user's metadata for cross-browser CAPI attribution recovery
  useEffect(() => {
    if (typeof window === 'undefined' || !user?.id) return;
    if (pathname?.startsWith('/admin')) return;
    // Bảo vệ cách ly Multi-tenant: tuyệt đối không ghi đè metadata của học viên TonyEnglish
    if (user.user_metadata?.app === 'tonyenglish') return;

    const timer = window.setTimeout(() => {
      try {
        const attr = getBrowserMetaAttribution();
        if (!attr.fbc && !attr.fbp && !attr.utmSource) return;

        const existing = (user.user_metadata?.tuvi_meta_attr || {}) as Record<string, string | number | undefined>;
        const nextFbc = attr.fbc || (typeof existing.fbc === 'string' ? existing.fbc : undefined);
        const nextFbp = attr.fbp || (typeof existing.fbp === 'string' ? existing.fbp : undefined);
        const nextUtmSource =
          attr.utmSource || (typeof existing.utmSource === 'string' ? existing.utmSource : undefined);
        const nextUtmCampaign =
          attr.utmCampaign || (typeof existing.utmCampaign === 'string' ? existing.utmCampaign : undefined);
        const nextUtmContent =
          attr.utmContent || (typeof existing.utmContent === 'string' ? existing.utmContent : undefined);

        const sig = `${user.id}|${nextFbc || ''}|${nextFbp || ''}|${nextUtmSource || ''}|${nextUtmCampaign || ''}`;
        const existingSig = `${user.id}|${existing.fbc || ''}|${existing.fbp || ''}|${existing.utmSource || ''}|${existing.utmCampaign || ''}`;
        if (sig === existingSig || syncedAttrSigRef.current === sig) return;

        syncedAttrSigRef.current = sig;
        supabase.auth
          .updateUser({
            data: {
              tuvi_meta_attr: {
                fbc: nextFbc,
                fbp: nextFbp,
                utmSource: nextUtmSource,
                utmCampaign: nextUtmCampaign,
                utmContent: nextUtmContent,
                updatedAt: Date.now(),
              },
            },
          })
          .catch(() => {});
      } catch {
        // ignore
      }
    }, 1500);

    return () => window.clearTimeout(timer);
  }, [user, pathname]);

  // Sync authenticated user_id to GA4
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname?.startsWith('/admin')) return;
    setGa4UserId(user?.id || null);
  }, [user?.id, pathname]);

  // Meta Pixel SPA PageView (skip initial mount handled by <head>, and skip /admin)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (typeof window === 'undefined') return;
    if (pathname?.startsWith('/admin')) return;
    const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'PageView');
    }
  }, [pathname]);

  return null;
}
