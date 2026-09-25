-- ==============================================================================
-- BẢNG QUẢN LÝ CỘNG TÁC VIÊN / AFFILIATE CHO WEBSITE TỬ VI THẦY TÔN
-- Chạy đoạn script này trong mục SQL Editor trên Dashboard Supabase của bạn
-- ==============================================================================

-- 1. TẠO BẢNG TUVI_AFFILIATES (Nếu chưa có)
CREATE TABLE IF NOT EXISTS public.tuvi_affiliates (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  bank_name TEXT,
  bank_account_number TEXT,
  bank_account_name TEXT,
  commission_rate NUMERIC DEFAULT 25,
  commission_fixed NUMERIC,
  status TEXT DEFAULT 'ACTIVE',
  total_clicks INTEGER DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  total_revenue NUMERIC DEFAULT 0,
  total_commission NUMERIC DEFAULT 0,
  paid_commission NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  notes TEXT
);

-- 2. TẠO CHỈ MỤC TỐC ĐỘ TÌM KIẾM
CREATE INDEX IF NOT EXISTS idx_tuvi_affiliates_code ON public.tuvi_affiliates(code);
CREATE INDEX IF NOT EXISTS idx_tuvi_affiliates_phone ON public.tuvi_affiliates(phone);

-- 3. BỔ SUNG CỘT AFFILIATE VÀO BẢNG TUVI_ORDERS (Nếu bảng đã tồn tại)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'tuvi_orders') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tuvi_orders' AND column_name = 'affiliate_code') THEN
      ALTER TABLE public.tuvi_orders ADD COLUMN affiliate_code TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tuvi_orders' AND column_name = 'commission_amount') THEN
      ALTER TABLE public.tuvi_orders ADD COLUMN commission_amount NUMERIC DEFAULT 0;
    END IF;
  END IF;
END $$;

-- 4. BẬT BẢO MẬT ROW LEVEL SECURITY (RLS) VÀ CẤP QUYỀN
ALTER TABLE public.tuvi_affiliates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all affiliates" ON public.tuvi_affiliates;
DROP POLICY IF EXISTS "Allow public read affiliates" ON public.tuvi_affiliates;
DROP POLICY IF EXISTS "Allow public insert/update affiliates" ON public.tuvi_affiliates;

CREATE POLICY "Allow public all affiliates" ON public.tuvi_affiliates
  FOR ALL
  USING (true)
  WITH CHECK (true);
