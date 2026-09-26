-- =====================================================================
-- Migration: Tạo bảng quản lý tài khoản Tester cho Tử Vi Thầy Tôn
-- Hỗ trợ phân quyền số lượng lá số và số câu hỏi tối đa cho từng lá số
-- =====================================================================

-- 1. Bảng lưu trữ cấu hình tài khoản tester
CREATE TABLE IF NOT EXISTS public.tuvi_testers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    password_plain TEXT,
    max_charts INTEGER NOT NULL DEFAULT 3,
    max_questions_per_chart INTEGER NOT NULL DEFAULT 5,
    is_active BOOLEAN NOT NULL DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bổ sung các cột mở rộng vào bảng tuvi_profiles (nếu chưa có)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tuvi_profiles' AND column_name = 'role') THEN
        ALTER TABLE public.tuvi_profiles ADD COLUMN role TEXT DEFAULT 'user';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tuvi_profiles' AND column_name = 'max_charts') THEN
        ALTER TABLE public.tuvi_profiles ADD COLUMN max_charts INTEGER DEFAULT 3;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tuvi_profiles' AND column_name = 'max_questions_per_chart') THEN
        ALTER TABLE public.tuvi_profiles ADD COLUMN max_questions_per_chart INTEGER DEFAULT 5;
    END IF;
END $$;

-- 3. Tạo Index tìm kiếm nhanh theo email và user_id
CREATE INDEX IF NOT EXISTS idx_tuvi_testers_email ON public.tuvi_testers(lower(email));
CREATE INDEX IF NOT EXISTS idx_tuvi_testers_user_id ON public.tuvi_testers(user_id);

-- 4. Kích hoạt Row Level Security (RLS)
ALTER TABLE public.tuvi_testers ENABLE ROW LEVEL SECURITY;

-- Policy cho phép đọc tester của chính mình hoặc anon qua API
DROP POLICY IF EXISTS "tuvi_testers_public_read" ON public.tuvi_testers;
CREATE POLICY "tuvi_testers_public_read" ON public.tuvi_testers
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "tuvi_testers_all_service" ON public.tuvi_testers;
CREATE POLICY "tuvi_testers_all_service" ON public.tuvi_testers
    FOR ALL USING (true) WITH CHECK (true);
