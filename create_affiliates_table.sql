-- BẢNG QUẢN LÝ CỘNG TÁC VIÊN / AFFILIATE CHO WEBSITE TỬ VI THẦY TÔN
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

-- TẠO CHỈ MỤC TÌM KIẾM
CREATE INDEX IF NOT EXISTS idx_tuvi_affiliates_code ON public.tuvi_affiliates(code);
CREATE INDEX IF NOT EXISTS idx_tuvi_affiliates_phone ON public.tuvi_affiliates(phone);

-- BỔ SUNG CỘT AFFILIATE VÀO BẢNG TUVI_ORDERS NẾU BẢNG ĐÃ TỒN TẠI
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

-- BẬT ROW LEVEL SECURITY VÀ CHO PHÉP ĐỌC / GHI HỢP LỆ
ALTER TABLE public.tuvi_affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read affiliates" ON public.tuvi_affiliates
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert/update affiliates" ON public.tuvi_affiliates
  FOR ALL USING (true);
