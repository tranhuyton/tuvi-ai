-- =====================================================================
-- Migration: Tạo bảng dữ liệu cho Tử Vi Thầy Tôn AI
-- Các bảng đều có tiền tố tuvi_ để không ảnh hưởng đến TonyEnglish
-- =====================================================================

-- 1. Bảng hồ sơ khách hàng (mở rộng từ auth.users)
CREATE TABLE IF NOT EXISTS public.tuvi_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng lưu trữ danh sách lá số của người dùng
CREATE TABLE IF NOT EXISTS public.tuvi_charts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duong_so_data JSONB NOT NULL,
    laso_data JSONB NOT NULL,
    reading_html TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng lưu trữ lịch sử đàm đạo / hỏi đáp với Thầy Tôn theo từng lá số
CREATE TABLE IF NOT EXISTS public.tuvi_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chart_id UUID NOT NULL REFERENCES public.tuvi_charts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tạo chỉ mục (Index) tăng tốc độ truy vấn
CREATE INDEX IF NOT EXISTS idx_tuvi_charts_user_id ON public.tuvi_charts(user_id);
CREATE INDEX IF NOT EXISTS idx_tuvi_chat_messages_chart_id ON public.tuvi_chat_messages(chart_id);
CREATE INDEX IF NOT EXISTS idx_tuvi_chat_messages_user_id ON public.tuvi_chat_messages(user_id);

-- =====================================================================
-- THIẾT LẬP BẢO MẬT ROW LEVEL SECURITY (RLS)
-- Mỗi người dùng CHỈ CÓ THỂ xem, thêm, sửa, xóa dữ liệu của chính mình
-- =====================================================================

-- Bật RLS
ALTER TABLE public.tuvi_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tuvi_charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tuvi_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policies cho tuvi_profiles
DROP POLICY IF EXISTS "tuvi_profiles_select" ON public.tuvi_profiles;
CREATE POLICY "tuvi_profiles_select" ON public.tuvi_profiles
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "tuvi_profiles_insert" ON public.tuvi_profiles;
CREATE POLICY "tuvi_profiles_insert" ON public.tuvi_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "tuvi_profiles_update" ON public.tuvi_profiles;
CREATE POLICY "tuvi_profiles_update" ON public.tuvi_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policies cho tuvi_charts
DROP POLICY IF EXISTS "tuvi_charts_select" ON public.tuvi_charts;
CREATE POLICY "tuvi_charts_select" ON public.tuvi_charts
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tuvi_charts_insert" ON public.tuvi_charts;
CREATE POLICY "tuvi_charts_insert" ON public.tuvi_charts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tuvi_charts_update" ON public.tuvi_charts;
CREATE POLICY "tuvi_charts_update" ON public.tuvi_charts
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tuvi_charts_delete" ON public.tuvi_charts;
CREATE POLICY "tuvi_charts_delete" ON public.tuvi_charts
    FOR DELETE USING (auth.uid() = user_id);

-- Policies cho tuvi_chat_messages
DROP POLICY IF EXISTS "tuvi_chat_messages_select" ON public.tuvi_chat_messages;
CREATE POLICY "tuvi_chat_messages_select" ON public.tuvi_chat_messages
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tuvi_chat_messages_insert" ON public.tuvi_chat_messages;
CREATE POLICY "tuvi_chat_messages_insert" ON public.tuvi_chat_messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tuvi_chat_messages_delete" ON public.tuvi_chat_messages;
CREATE POLICY "tuvi_chat_messages_delete" ON public.tuvi_chat_messages
    FOR DELETE USING (auth.uid() = user_id);
