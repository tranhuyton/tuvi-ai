<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ⚠️ CRITICAL ARCHITECTURE RULE: MULTI-TENANT SUPABASE ISOLATION (`tuvi-ai` vs `tonyenglish-app`)

Dự án **Tử Vi Thầy Tôn (`tuvi-ai` - `tuvithayton.vn`)** dùng chung Supabase Project (`ubkvzgwespfvrlpjuxkp.supabase.co`) và dùng chung bảng `auth.users` với hệ thống **TonyEnglish (`tonyenglish-app` - `tonyenglish.vn`)**.

Mọi AI Agent làm việc trên repo này **BẮT BUỘC TUYỆT ĐỐI** tuân thủ các quy tắc cách ly dữ liệu sau:

1. **Bảng Profile riêng biệt:**
   - `tuvi-ai` CHỈ sử dụng bảng `public.tuvi_profiles` (cùng `tuvi_Charts`, `tuvi_Orders`, `tuvi_vouchers`, `tuvi_email_logs`).
   - Bảng `public.profiles` thuộc về **TonyEnglish (`tonyenglish-app`)** — TUYỆT ĐỐI KHÔNG ghi dữ liệu của Tử Vi vào `public.profiles`, và KHÔNG đồng bộ học viên từ `public.profiles` sang `public.tuvi_profiles`.

2. **Định danh khi tạo tài khoản (`signUp`):**
   - Mọi lệnh `supabase.auth.signUp` trong `tuvi-ai` BẮT BUỘC phải truyền `options.data.app = 'tuvi'`.

3. **Cấm đồng bộ mù từ `auth.users` (`supabase.auth.admin.listUsers()`):**
   - Trong `auth.users` có chứa cả tài khoản học viên của TonyEnglish (`user_metadata.app === 'tonyenglish'` hoặc có mặt trong bảng `public.profiles`).
   - Bất kỳ API, Cronjob (`email-drip`), hay trang Admin (`admin/data`) nào đọc từ `auth.users` BẮT BUỘC phải sử dụng hàm `isTuViAuthUser(authUser, tonyEnglishProfileIds)` từ `src/lib/supabase.ts` để lọc bỏ 100% tài khoản TonyEnglish trước khi hiển thị, lưu vào `tuvi_profiles`, hoặc gửi Email Marketing.

