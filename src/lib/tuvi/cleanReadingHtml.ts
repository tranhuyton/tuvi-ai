/**
 * Tiện ích làm sạch và chuẩn hóa mã HTML của bài luận giải Tử Vi
 * - Loại bỏ triệt để các thẻ <!DOCTYPE>, <html>, <head>, <style>, <script>, <body>
 *   để tránh làm rò rỉ CSS hoặc đè styling (ví dụ: margin: 20px, background-color) lên toàn trang web.
 * - Chuẩn hóa các định dạng heading, markdown nếu còn sót.
 */

export function cleanReadingHtml(rawHtml?: string | null): string {
  if (!rawHtml) return '';

  let cleaned = rawHtml;

  // 1. Loại bỏ các khối code markdown
  cleaned = cleaned.replace(/```html|```markdown|```/gi, '');

  // 2. Loại bỏ hoàn toàn các thẻ <style>...</style> và <script>...</script>
  cleaned = cleaned.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  cleaned = cleaned.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

  // 3. Loại bỏ thẻ <head>...</head>, <!DOCTYPE ...>, <title>...</title>, <meta ...>
  cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');
  cleaned = cleaned.replace(/<head\b[^>]*>[\s\S]*?<\/head>/gi, '');
  cleaned = cleaned.replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, '');
  cleaned = cleaned.replace(/<meta\b[^>]*>/gi, '');

  // 4. Loại bỏ thẻ mở và đóng <html>, <body>
  cleaned = cleaned.replace(/<\/?(html|body)\b[^>]*>/gi, '');

  // 5. Chuẩn hóa markdown headings nếu còn sót
  cleaned = cleaned.replace(
    /### (.*?)(\r\n|\n)/g,
    '<h4 class="font-bold text-amber-700 text-lg mt-4 mb-2">$1</h4>'
  );
  cleaned = cleaned.replace(
    /## (.*?)(\r\n|\n)/g,
    '<h3 class="font-bold text-red-700 text-xl mt-6 mb-3 border-b border-red-200 pb-1">$1</h3>'
  );
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '<b class="text-red-700 font-semibold">$1</b>');
  cleaned = cleaned.replace(/\*(.*?)\*/g, '<i class="italic text-slate-700">$1</i>');

  return cleaned.trim();
}
