-- =====================================================================
-- Migration: Trả lại 2 tài khoản học viên Đỗ Ken & Trần Công Quốc Khải về TonyEnglish
-- 1. Khôi phục đầy đủ dữ liệu vào bảng public.profiles (TonyEnglish)
-- 2. Xóa khỏi bảng public.tuvi_profiles (Tử Vi)
-- 3. Xóa tag metadata app = 'tuvi' trong auth.users
-- =====================================================================

-- 1. Khôi phục vào bảng profiles của TonyEnglish
INSERT INTO public.profiles (id, email, full_name, phone, role, status, created_at)
VALUES 
(
    '73aff8c3-904e-4879-8889-4c4f9968a345',
    'ken290911@gmail.com',
    'Đỗ Ken',
    '0914644405',
    'student',
    'active',
    '2026-09-21T03:43:58.866137+00:00'
),
(
    'c3c774fb-893f-4cae-b418-f575bcd80958',
    'congquockhai.tran@gmail.com',
    'Trần Công Quốc Khải',
    '0868806169',
    'student',
    'active',
    '2026-09-19T09:43:24.406154+00:00'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    status = EXCLUDED.status;

-- 2. Xóa khỏi bảng tuvi_profiles
DELETE FROM public.tuvi_profiles
WHERE email IN ('ken290911@gmail.com', 'congquockhai.tran@gmail.com');

-- 3. Gỡ tag 'app' khỏi metadata auth.users
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data - 'app'
WHERE email IN ('ken290911@gmail.com', 'congquockhai.tran@gmail.com');
