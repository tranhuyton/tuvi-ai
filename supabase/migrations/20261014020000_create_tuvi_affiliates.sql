-- 1. Tạo bảng tuvi_affiliates lưu trữ Cộng Tác Viên (Affiliate)
CREATE TABLE IF NOT EXISTS public.tuvi_affiliates (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    bank_name TEXT,
    bank_code TEXT,
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
    pending_withdrawal NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tuvi_affiliates_code ON public.tuvi_affiliates (code);
CREATE INDEX IF NOT EXISTS idx_tuvi_affiliates_phone ON public.tuvi_affiliates (phone);

-- 2. Bổ sung cột affiliate_code và commission_amount vào bảng tuvi_orders (nếu chưa có)
ALTER TABLE public.tuvi_orders
ADD COLUMN IF NOT EXISTS affiliate_code TEXT,
ADD COLUMN IF NOT EXISTS commission_amount NUMERIC DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_tuvi_orders_affiliate_code ON public.tuvi_orders (affiliate_code);

-- 3. Cấp quyền truy cập cho API server
GRANT ALL ON TABLE public.tuvi_affiliates TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.tuvi_orders TO anon, authenticated, service_role;
