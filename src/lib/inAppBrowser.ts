export function isInAppBrowser(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || '';
  return /Zalo|FBAN|FBAV|Instagram|TikTok|Line|MicroMessenger/i.test(ua);
}

export function getInAppBrowserName(): string {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return '';
  const ua = navigator.userAgent || navigator.vendor || '';
  if (/Zalo/i.test(ua)) return 'Zalo';
  if (/FBAN|FBAV/i.test(ua)) return 'Facebook';
  if (/Instagram/i.test(ua)) return 'Instagram';
  if (/TikTok|musical_ly/i.test(ua)) return 'TikTok';
  if (/Line/i.test(ua)) return 'Line';
  return 'mạng xã hội';
}
