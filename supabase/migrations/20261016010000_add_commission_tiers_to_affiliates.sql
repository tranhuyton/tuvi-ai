-- Bổ sung chế độ tính hoa hồng theo từng gói (commission_mode & commission_tiers) cho bảng tuvi_affiliates
ALTER TABLE public.tuvi_affiliates
ADD COLUMN IF NOT EXISTS commission_mode TEXT DEFAULT 'percent',
ADD COLUMN IF NOT EXISTS commission_tiers JSONB DEFAULT NULL;
