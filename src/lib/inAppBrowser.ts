export function isInAppBrowser(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || '';
  return /Zalo|FBAN|FBAV|FB_IAB|FBIOS|Messenger|Instagram|TikTok|musical_ly|BytedanceWebview|ByteLocale|Barcelona|Line|MicroMessenger|;\s*wv\)/i.test(
    ua
  );
}

export function getInAppBrowserName(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return '';
  const ua = navigator.userAgent || navigator.vendor || '';
  if (/Zalo/i.test(ua)) return 'Zalo';
  if (/Messenger/i.test(ua)) return 'Messenger';
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return 'Facebook';
  if (/Instagram/i.test(ua)) return 'Instagram';
  if (/Barcelona/i.test(ua)) return 'Threads';
  if (/TikTok|musical_ly|BytedanceWebview|ByteLocale/i.test(ua)) return 'TikTok';
  if (/Line/i.test(ua)) return 'Line';
  if (/MicroMessenger/i.test(ua)) return 'WeChat';
  return 'trình duyệt trong ứng dụng';
}

export function isMobileDevice(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
}
