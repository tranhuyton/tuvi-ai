import sanitizeHtml from 'sanitize-html';

/**
 * Chuẩn hóa, làm sạch và chống XSS triệt để cho HTML luận giải & hội thoại AI
 * Sử dụng parser HTML thực (sanitize-html / htmlparser2) — miễn nhiễm với các kỹ thuật bypass regex
 * như `<img/src=x/onerror=...>`, thẻ lồng ghép `<im<x>g...>`, hay giao thức `javascript:` / `//evil.com`.
 */

const ALLOWED_TAGS = [
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'p',
  'b',
  'strong',
  'i',
  'em',
  'u',
  'ul',
  'ol',
  'li',
  'br',
  'hr',
  'blockquote',
  'span',
  'div',
  'table',
  'thead',
  'tbody',
  'tr',
  'th',
  'td',
  'a',
];

const DANGEROUS_CLASS_TOKEN_RE =
  /^(?:[a-z0-9-]+:)*(?:fixed|absolute|sticky|inset(?:-[a-z0-9\[\]\.]+)?|top-|bottom-|left-|right-|z-|w-screen|h-screen|min-h-screen|pointer-events-|backdrop-|opacity-0)/i;

export function escapeHtml(raw: unknown): string {
  return String(raw ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeSafeUrl(raw?: string | null, fallback = '#'): string {
  const val = String(raw || '').trim();
  if (!val) return fallback;
  // Chặn tuyệt đối protocol-relative URL (//evil.com), javascript:, vbscript:, data:
  if (/^(?:https?:\/\/|mailto:|tel:|\/(?!\/))/i.test(val)) {
    return val;
  }
  return fallback;
}

function filterSafeClassList(rawClass?: string): string | undefined {
  if (!rawClass) return undefined;
  const tokens = rawClass
    .split(/\s+/)
    .map((t) => t.replace(/[^a-zA-Z0-9_\-:\/\[\]\.#%]/g, '').trim())
    .filter((t) => t.length > 0 && !DANGEROUS_CLASS_TOKEN_RE.test(t));
  return tokens.length > 0 ? tokens.join(' ') : undefined;
}

export function sanitizeHtmlAllowlist(input?: string | null): string {
  if (!input) return '';
  const text = String(input);

  return sanitizeHtml(text, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'class'],
      '*': ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    nonTextTags: [
      'script',
      'style',
      'textarea',
      'title',
      'noscript',
      'iframe',
      'object',
      'embed',
      'svg',
      'math',
      'form',
      'option',
      'select',
      'button',
      'head',
    ],
    transformTags: {
      a: (tagName, attribs) => {
        const safeHref = sanitizeSafeUrl(attribs.href, '');
        const safeClass = filterSafeClassList(attribs.class);
        const nextAttribs: Record<string, string> = {};
        if (safeHref) {
          nextAttribs.href = safeHref;
          if (/^https?:\/\//i.test(safeHref)) {
            nextAttribs.target = '_blank';
            nextAttribs.rel = 'noopener noreferrer';
          }
        }
        if (safeClass) nextAttribs.class = safeClass;
        return { tagName, attribs: nextAttribs };
      },
      '*': (tagName, attribs) => {
        const safeClass = filterSafeClassList(attribs.class);
        const nextAttribs: Record<string, string> = {};
        if (safeClass) nextAttribs.class = safeClass;
        return { tagName, attribs: nextAttribs };
      },
    },
  });
}

export function sanitizeVietnameseFileName(raw?: string | null, fallback = 'Duong_So'): string {
  const cleaned = (raw || '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned || fallback;
}

export function cleanReadingHtml(rawHtml?: string | null): string {
  if (!rawHtml) return '';
  let text = rawHtml.trim();

  // Bỏ khung markdown ```html ... ``` nếu có
  text = text.replace(/^```(?:html|xml|markdown)?\s*/i, '');
  text = text.replace(/\s*```$/i, '');

  // Xóa thẻ <!DOCTYPE>, <head>, <style>, <script>, <meta>, <title>, <html>, <body>
  text = text.replace(/<!DOCTYPE[^>]*>/gi, '');
  text = text.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<meta[^>]*>/gi, '');
  text = text.replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '');
  text = text.replace(/<\/?(html|body)[^>]*>/gi, '');

  // Xóa các đoạn CSS trần nếu AI lỡ xuất ra dưới dạng text không bọc thẻ <style>
  text = text.replace(
    /^\s*(?:body|html|h1|h2|h3|h4|p|ul|li|\.[\w-]+)\s*\{[\s\S]*?\}\s*/gim,
    ''
  );

  // Chuyển đổi Markdown heading / bold sang HTML chuẩn (nếu AI trả về sót)
  text = text.replace(/^###\s*(.*?)$/gm, '<h3>$1</h3>');
  text = text.replace(/^##\s*(.*?)$/gm, '<h3>$1</h3>');
  text = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
  // Chỉ chuyển italic khi có khoảng trắng/đầu dòng để tránh làm hỏng công thức có dấu *
  text = text.replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s.,;:!?)]|$)/g, '$1<i>$2</i>');

  // Lọc allowlist bằng HTML parser thực (sanitize-html) chống XSS triệt để
  text = sanitizeHtmlAllowlist(text);

  return text.trim();
}
