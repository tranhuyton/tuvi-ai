-- =====================================================================
-- Migration: Hệ thống Email Tự Động (Drip Funnel) & Voucher Đếm Ngược
-- Chuỗi 4 mốc: +1h (Nhắc nhở) -> +24h (-20%/12h) -> +72h (-30%/6h) -> +6m (-30%/6h)
-- =====================================================================

-- 1. Thêm cờ hủy đăng ký nhận email vào tuvi_profiles
ALTER TABLE public.tuvi_profiles
ADD COLUMN IF NOT EXISTS email_unsubscribed BOOLEAN DEFAULT FALSE;

-- 2. Thêm thông tin voucher vào bảng đơn hàng tuvi_orders
ALTER TABLE public.tuvi_orders
ADD COLUMN IF NOT EXISTS voucher_code TEXT,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_tuvi_orders_voucher_code ON public.tuvi_orders(voucher_code);

-- 3. Bảng lưu trữ mã giảm giá định danh cá nhân (dùng 1 lần, đếm ngược từ lúc mở)
CREATE TABLE IF NOT EXISTS public.tuvi_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    chart_id UUID REFERENCES public.tuvi_charts(id) ON DELETE SET NULL,
    stage TEXT NOT NULL, -- 'voucher_20_24h' | 'voucher_30_72h' | 'voucher_30_6m'
    discount_percent INTEGER NOT NULL CHECK (discount_percent IN (20, 30)),
    duration_hours INTEGER NOT NULL CHECK (duration_hours > 0),
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED'
    first_clicked_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ, -- Được gán ngay khoảnh khắc khách bấm mở link lần đầu
    hard_expires_at TIMESTAMPTZ NOT NULL, -- Trần hết hạn tối đa kể từ lúc gửi mail
    used_at TIMESTAMPTZ,
    used_order_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tuvi_vouchers_code ON public.tuvi_vouchers(code);
CREATE INDEX IF NOT EXISTS idx_tuvi_vouchers_user_id ON public.tuvi_vouchers(user_id);
CREATE INDEX IF NOT EXISTS idx_tuvi_vouchers_status ON public.tuvi_vouchers(status);

-- 4. Bảng lưu lịch sử gửi email tự động (Chống gửi trùng tuyệt đối bằng UNIQUE(user_id, stage))
CREATE TABLE IF NOT EXISTS public.tuvi_email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    stage TEXT NOT NULL, -- 'reminder_1h' | 'voucher_20_24h' | 'voucher_30_72h' | 'voucher_30_6m'
    voucher_code TEXT,
    chart_id UUID,
    status TEXT NOT NULL DEFAULT 'SENT', -- 'SENT' | 'FAILED' | 'SIMULATED'
    message_id TEXT,
    error_message TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_tuvi_email_logs_user_stage UNIQUE (user_id, stage)
);

CREATE INDEX IF NOT EXISTS idx_tuvi_email_logs_user_id ON public.tuvi_email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_tuvi_email_logs_stage ON public.tuvi_email_logs(stage);

-- 5. Phân quyền bảo mật: Chỉ service_role truy cập trực tiếp bảng voucher & email_logs
ALTER TABLE public.tuvi_vouchers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tuvi_email_logs ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.tuvi_vouchers TO service_role;
GRANT ALL ON TABLE public.tuvi_email_logs TO service_role;

-- Cho phép người dùng đang đăng nhập tự đọc voucher của chính mình (nếu cần)
DROP POLICY IF EXISTS "tuvi_vouchers_select_own" ON public.tuvi_vouchers;
CREATE POLICY "tuvi_vouchers_select_own" ON public.tuvi_vouchers
    FOR SELECT USING (auth.uid() = user_id);
GRANT SELECT ON TABLE public.tuvi_vouchers TO authenticated;

-- 6. Kích hoạt pg_cron + pg_net để gọi tự động /api/cron/email-drip mỗi 10 phút 24/7
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'tuvi-email-drip-10m') THEN
        PERFORM cron.unschedule('tuvi-email-drip-10m');
    END IF;

    PERFORM cron.schedule(
        'tuvi-email-drip-10m',
        '*/10 * * * *',
        $cron$
        SELECT net.http_post(
            url := 'https://www.tuvithayton.vn/api/cron/email-drip',
            headers := '{"Content-Type": "application/json", "x-cron-secret": "tuvi_drip_cron_2026_thayton"}'::jsonb,
            body := '{"source": "pg_cron"}'::jsonb
        );
        $cron$
    );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Không thể tạo pg_cron tự động (sẽ kiểm tra bổ sung): %', SQLERRM;
END $$;
