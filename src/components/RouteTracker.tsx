'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { setGa4UserId } from '@/lib/googleAnalytics';

/**
 * 1. Ghi nhận mã giới thiệu CTV (`?ref=...`) trên MỌI trang (kể cả /khoa-hoc, /van-han, /bai-viet, /[slug])
 *    với thời hạn lưu 30 ngày (tuvi_affiliate_ref + tuvi_affiliate_time) và gọi /api/affiliate/track-click 1 lần/session.
 * 2. Gửi sự kiện Meta Pixel PageView cho điều hướng mềm (Next.js App Router SPA), bỏ qua trang /admin.
 * 3. Đồng bộ user_id sang GA4 (setGa4UserId) khi người dùng đăng nhập.
 */
export default function RouteTracker() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isFirstMount = useRef(true);

  // Capture ?ref= globally across all pages
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const params = new URLSearchParams(window.location.search);
      const rawRef = params.get('ref');
      if (rawRef) {
        const cleanRef = rawRef.trim().toUpperCase();
        if (/^[A-Z0-9_-]{2,20}$/.test(cleanRef)) {
          localStorage.setItem('tuvi_affiliate_ref', cleanRef);
          localStorage.setItem('tuvi_affiliate_time', String(Date.now()));
          const sessionKey = `tuvi_ref_tracked_${cleanRef}`;
          if (!sessionStorage.getItem(sessionKey)) {
            sessionStorage.setItem(sessionKey, '1');
            fetch('/api/affiliate/track-click', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: cleanRef }),
            }).catch(() => {});
          }
        }
      }
    } catch {
      // ignore storage errors
    }
  }, [pathname]);

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
