ALTER TABLE public.tuvi_affiliates
ADD COLUMN IF NOT EXISTS bank_code TEXT,
ADD COLUMN IF NOT EXISTS pending_withdrawal NUMERIC DEFAULT 0;
