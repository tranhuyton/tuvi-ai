-- Migration: Bảng lưu trữ hồ sơ lá số khách offline (Sổ Tay Khách Offline Của Thầy Tôn)
-- Đồng bộ vĩnh viễn trên Supabase cho máy tính, điện thoại, máy tính bảng

CREATE TABLE IF NOT EXISTS public.tuvi_offline_charts (
    id TEXT PRIMARY KEY,
    ho_ten TEXT NOT NULL,
    tag VARCHAR(50) DEFAULT 'offline',
    notes TEXT,
    duong_so_data JSONB NOT NULL,
    laso_data JSONB,
    reading_html TEXT,
    chat_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chỉ mục tối ưu tốc độ tra cứu
CREATE INDEX IF NOT EXISTS idx_tuvi_offline_charts_tag ON public.tuvi_offline_charts (tag);
CREATE INDEX IF NOT EXISTS idx_tuvi_offline_charts_updated_at ON public.tuvi_offline_charts (updated_at DESC);

-- Bật RLS và cấp quyền cho anon (truy cập qua API route bảo vệ bằng mã PIN Admin)
ALTER TABLE public.tuvi_offline_charts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tuvi_offline_charts_policy" ON public.tuvi_offline_charts;
CREATE POLICY "tuvi_offline_charts_policy" ON public.tuvi_offline_charts
    FOR ALL
    USING (true)
    WITH CHECK (true);
