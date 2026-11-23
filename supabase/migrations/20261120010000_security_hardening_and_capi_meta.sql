-- =====================================================================
-- Migration: Siết chặt bảo mật Database (RLS, Triggers, Multi-Tenant,
-- Atomic RPCs cho Affiliate/Chat/RateLimit) & CAPI Metadata
-- Ngày cập nhật: 2026-11-23
-- =====================================================================

-- 1. Bổ sung cột quản trị & chống replay voucher trên `public.tuvi_orders`
ALTER TABLE public.tuvi_orders
  ADD COLUMN IF NOT EXISTS capi_meta JSONB,
  ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS commission_recorded_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS commission_reversed_at TIMESTAMPTZ;

-- Mỗi mã voucher cá nhân chỉ được gắn tối đa 1 đơn đang PENDING hoặc đã PAID (chống multi-order replay)
CREATE UNIQUE INDEX IF NOT EXISTS ux_tuvi_orders_active_voucher
  ON public.tuvi_orders (voucher_code)
  WHERE voucher_code IS NOT NULL AND status IN ('PENDING', 'PAID');

CREATE INDEX IF NOT EXISTS idx_tuvi_orders_affiliate_code
  ON public.tuvi_orders (affiliate_code)
  WHERE affiliate_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_tuvi_orders_status_created
  ON public.tuvi_orders (status, created_at DESC);

-- 2. Thu hồi quyền gọi công khai các hàm RPC nhạy cảm (chống dump DB & quét email bằng anon key)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'get_admin_dashboard_data'
  ) THEN
    REVOKE ALL ON FUNCTION public.get_admin_dashboard_data() FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_data() TO service_role;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'check_tuvi_user_exists'
  ) THEN
    REVOKE ALL ON FUNCTION public.check_tuvi_user_exists(TEXT) FROM PUBLIC, anon, authenticated;
    GRANT EXECUTE ON FUNCTION public.check_tuvi_user_exists(TEXT) TO service_role;
  END IF;
END $$;

-- 3. Bật RLS & khóa quyền anon/authenticated trên các bảng nội bộ (server truy cập qua service_role)
ALTER TABLE public.tuvi_orders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.tuvi_orders FROM anon, authenticated;
GRANT ALL ON TABLE public.tuvi_orders TO service_role;
GRANT SELECT ON TABLE public.tuvi_orders TO authenticated;

DROP POLICY IF EXISTS "tuvi_orders_select_own" ON public.tuvi_orders;
CREATE POLICY "tuvi_orders_select_own" ON public.tuvi_orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- tuvi_affiliates: chỉ service_role truy cập trực tiếp (xóa toàn bộ các policy mở rộng cũ)
ALTER TABLE public.tuvi_affiliates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all access for tuvi_affiliates" ON public.tuvi_affiliates;
DROP POLICY IF EXISTS "tuvi_affiliates_public_all" ON public.tuvi_affiliates;
DROP POLICY IF EXISTS "Allow public all affiliates" ON public.tuvi_affiliates;
REVOKE ALL ON TABLE public.tuvi_affiliates FROM anon, authenticated;
GRANT ALL ON TABLE public.tuvi_affiliates TO service_role;

-- tuvi_testers: chỉ service_role truy cập trực tiếp
ALTER TABLE public.tuvi_testers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tuvi_testers_public_read" ON public.tuvi_testers;
DROP POLICY IF EXISTS "tuvi_testers_all_service" ON public.tuvi_testers;
REVOKE ALL ON TABLE public.tuvi_testers FROM anon, authenticated;
GRANT ALL ON TABLE public.tuvi_testers TO service_role;

-- tuvi_offline_charts: chỉ service_role truy cập trực tiếp
ALTER TABLE public.tuvi_offline_charts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tuvi_offline_charts_policy" ON public.tuvi_offline_charts;
REVOKE ALL ON TABLE public.tuvi_offline_charts FROM anon, authenticated;
GRANT ALL ON TABLE public.tuvi_offline_charts TO service_role;

-- tuvi_vouchers & tuvi_email_logs: khóa tuyệt đối về service_role
DO $$
BEGIN
  IF to_regclass('public.tuvi_vouchers') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.tuvi_vouchers ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON TABLE public.tuvi_vouchers FROM anon, authenticated';
    EXECUTE 'GRANT ALL ON TABLE public.tuvi_vouchers TO service_role';
  END IF;
  IF to_regclass('public.tuvi_email_logs') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.tuvi_email_logs ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON TABLE public.tuvi_email_logs FROM anon, authenticated';
    EXECUTE 'GRANT ALL ON TABLE public.tuvi_email_logs TO service_role';
  END IF;
END $$;

-- tuvi_chat_messages: CẤM user tự INSERT/UPDATE/DELETE qua PostgREST (chống reset quota & chèn Stored XSS)
ALTER TABLE public.tuvi_chat_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tuvi_chat_messages_insert" ON public.tuvi_chat_messages;
DROP POLICY IF EXISTS "tuvi_chat_messages_delete" ON public.tuvi_chat_messages;
DROP POLICY IF EXISTS "tuvi_chat_messages_update" ON public.tuvi_chat_messages;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.tuvi_chat_messages FROM anon, authenticated;
GRANT SELECT ON TABLE public.tuvi_chat_messages TO authenticated;
GRANT ALL ON TABLE public.tuvi_chat_messages TO service_role;

-- 4. Trigger BEFORE INSERT OR UPDATE:
--    (a) Cách ly Multi-Tenant tuyệt đối: Cấm chèn user đã thuộc public.profiles (TonyEnglish) vào tuvi_profiles
--    (b) Chống tự nâng quyền trên tuvi_profiles và chống tự nâng gói/quota trên tuvi_charts
CREATE OR REPLACE FUNCTION public.prevent_tuvi_profile_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Cách ly tuyệt đối Multi-Tenant giữa TonyEnglish (public.profiles) và Tử Vi (public.tuvi_profiles)
  IF TG_OP = 'INSERT' THEN
    IF EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = NEW.id) THEN
      RAISE EXCEPTION 'Multi-tenant isolation violation: TonyEnglish account cannot be inserted into tuvi_profiles';
    END IF;
  END IF;

  -- Chỉ service_role (hoặc postgres superuser) mới được đặt/đổi role, max_charts, max_questions_per_chart
  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role'
     AND current_user NOT IN ('postgres', 'supabase_admin') THEN
    IF TG_OP = 'INSERT' THEN
      NEW.role := 'user';
      NEW.max_charts := 3;
      NEW.max_questions_per_chart := 5;
    ELSE
      NEW.role := OLD.role;
      NEW.max_charts := OLD.max_charts;
      NEW.max_questions_per_chart := OLD.max_questions_per_chart;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_tuvi_profile_escalation ON public.tuvi_profiles;
CREATE TRIGGER trg_prevent_tuvi_profile_escalation
  BEFORE INSERT OR UPDATE ON public.tuvi_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_tuvi_profile_escalation();

CREATE OR REPLACE FUNCTION public.prevent_tuvi_chart_tier_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_tier TEXT;
  new_tier TEXT;
  old_laso_tier TEXT;
  new_laso_tier TEXT;
BEGIN
  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role'
     AND current_user NOT IN ('postgres', 'supabase_admin') THEN
    IF TG_OP = 'INSERT' THEN
      -- Client tạo mới lá số luôn bắt buộc tier = 'free' và không được tự chèn quota / needsReadingUpgrade
      NEW.duong_so_data := jsonb_set(COALESCE(NEW.duong_so_data, '{}'::jsonb), '{tier}', '"free"'::jsonb, true);
      NEW.laso_data := jsonb_set(
        (COALESCE(NEW.laso_data, '{}'::jsonb) - 'quota' - 'needsReadingUpgrade'),
        '{tier}',
        '"free"'::jsonb,
        true
      );
    ELSE
      old_tier := COALESCE(OLD.duong_so_data->>'tier', 'free');
      new_tier := COALESCE(NEW.duong_so_data->>'tier', 'free');
      IF new_tier IS DISTINCT FROM old_tier THEN
        NEW.duong_so_data := jsonb_set(COALESCE(NEW.duong_so_data, '{}'::jsonb), '{tier}', to_jsonb(old_tier), true);
      END IF;

      old_laso_tier := COALESCE(OLD.laso_data->>'tier', 'free');
      new_laso_tier := COALESCE(NEW.laso_data->>'tier', 'free');
      IF new_laso_tier IS DISTINCT FROM old_laso_tier THEN
        NEW.laso_data := jsonb_set(COALESCE(NEW.laso_data, '{}'::jsonb), '{tier}', to_jsonb(old_laso_tier), true);
      END IF;

      -- Không cho client tự ghi đè quota hay needsReadingUpgrade trên laso_data
      IF (NEW.laso_data->'quota') IS DISTINCT FROM (OLD.laso_data->'quota') THEN
        IF OLD.laso_data ? 'quota' THEN
          NEW.laso_data := jsonb_set(COALESCE(NEW.laso_data, '{}'::jsonb), '{quota}', OLD.laso_data->'quota', true);
        ELSE
          NEW.laso_data := COALESCE(NEW.laso_data, '{}'::jsonb) - 'quota';
        END IF;
      END IF;

      IF (NEW.laso_data->'needsReadingUpgrade') IS DISTINCT FROM (OLD.laso_data->'needsReadingUpgrade') THEN
        IF OLD.laso_data ? 'needsReadingUpgrade' THEN
          NEW.laso_data := jsonb_set(
            COALESCE(NEW.laso_data, '{}'::jsonb),
            '{needsReadingUpgrade}',
            OLD.laso_data->'needsReadingUpgrade',
            true
          );
        ELSE
          NEW.laso_data := COALESCE(NEW.laso_data, '{}'::jsonb) - 'needsReadingUpgrade';
        END IF;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_tuvi_chart_escalation ON public.tuvi_charts;
CREATE TRIGGER trg_prevent_tuvi_chart_escalation
  BEFORE INSERT OR UPDATE ON public.tuvi_charts
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_tuvi_chart_tier_escalation();

-- 5. Bổ sung SET search_path = public cho hàm SECURITY DEFINER handle_new_user() (bảo toàn 100% logic TonyEnglish + Tử Vi)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Nếu đăng ký từ app Tử Vi Thầy Tôn
  IF (NEW.raw_user_meta_data->>'app' = 'tuvi') THEN
    INSERT INTO public.tuvi_profiles (id, email, full_name, phone, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      NEW.raw_user_meta_data->>'phone',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        phone = COALESCE(EXCLUDED.phone, public.tuvi_profiles.phone),
        updated_at = NOW();
    RETURN NEW;
  END IF;

  -- Mặc định: Dành riêng cho học viên TonyEnglish
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'student'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- 6. Siết chặt cách ly Multi-Tenant cho RPC `check_tuvi_user_exists` (chỉ service_role gọi được)
CREATE OR REPLACE FUNCTION public.check_tuvi_user_exists(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_clean TEXT := lower(trim(COALESCE(p_email, '')));
BEGIN
  IF v_clean = '' THEN
    RETURN FALSE;
  END IF;

  IF EXISTS (SELECT 1 FROM public.tuvi_profiles WHERE lower(email) = v_clean) THEN
    RETURN TRUE;
  END IF;

  RETURN EXISTS (
    SELECT 1
    FROM auth.users u
    WHERE lower(u.email) = v_clean
      AND NOT EXISTS (SELECT 1 FROM public.profiles pr WHERE pr.id = u.id)
      AND COALESCE(u.raw_user_meta_data->>'app', '') <> 'tonyenglish'
      AND COALESCE(u.raw_user_meta_data->>'role', '') NOT IN ('student', 'teacher')
      AND (u.raw_user_meta_data->>'account_type') IS NULL
      AND (
        u.raw_user_meta_data->>'app' = 'tuvi'
        OR EXISTS (SELECT 1 FROM public.tuvi_charts tc WHERE tc.user_id = u.id)
      )
  );
END;
$$;
REVOKE ALL ON FUNCTION public.check_tuvi_user_exists(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_tuvi_user_exists(TEXT) TO service_role;

-- 7. Bảng giao dịch chi trả hoa hồng CTV (`tuvi_affiliate_payouts`) chống rút đúp & trừ đúp đa kênh
CREATE TABLE IF NOT EXISTS public.tuvi_affiliate_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id TEXT NOT NULL,
  affiliate_code TEXT NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'CANCELLED')),
  req_id TEXT UNIQUE,
  bank_tx_id TEXT UNIQUE,
  bank_snapshot JSONB,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_tuvi_affiliate_payouts_aff
  ON public.tuvi_affiliate_payouts (affiliate_id, status, created_at DESC);

ALTER TABLE public.tuvi_affiliate_payouts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.tuvi_affiliate_payouts FROM anon, authenticated;
GRANT ALL ON TABLE public.tuvi_affiliate_payouts TO service_role;

-- 8. Các RPC nguyên tử cho CTV (SELECT ... FOR UPDATE)
CREATE OR REPLACE FUNCTION public.tuvi_increment_affiliate_click(p_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.tuvi_affiliates
  SET total_clicks = COALESCE(total_clicks, 0) + 1
  WHERE lower(code) = lower(trim(p_code))
    AND status = 'ACTIVE';
END;
$$;
REVOKE ALL ON FUNCTION public.tuvi_increment_affiliate_click(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.tuvi_increment_affiliate_click(TEXT) TO service_role;

CREATE OR REPLACE FUNCTION public.tuvi_credit_affiliate_commission(
  p_code TEXT,
  p_order_amount NUMERIC,
  p_commission NUMERIC
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated INT := 0;
BEGIN
  IF p_commission <= 0 OR p_order_amount <= 0 THEN
    RETURN FALSE;
  END IF;

  UPDATE public.tuvi_affiliates
  SET total_orders = COALESCE(total_orders, 0) + 1,
      total_revenue = COALESCE(total_revenue, 0) + p_order_amount,
      total_commission = COALESCE(total_commission, 0) + p_commission
  WHERE lower(code) = lower(trim(p_code))
    AND status = 'ACTIVE';

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;
REVOKE ALL ON FUNCTION public.tuvi_credit_affiliate_commission(TEXT, NUMERIC, NUMERIC) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.tuvi_credit_affiliate_commission(TEXT, NUMERIC, NUMERIC) TO service_role;

CREATE OR REPLACE FUNCTION public.tuvi_reverse_affiliate_commission(
  p_code TEXT,
  p_order_amount NUMERIC,
  p_commission NUMERIC
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated INT := 0;
BEGIN
  UPDATE public.tuvi_affiliates
  SET total_orders = GREATEST(0, COALESCE(total_orders, 0) - 1),
      total_revenue = GREATEST(0, COALESCE(total_revenue, 0) - GREATEST(0, p_order_amount)),
      total_commission = GREATEST(0, COALESCE(total_commission, 0) - GREATEST(0, p_commission))
  WHERE lower(code) = lower(trim(p_code));

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;
REVOKE ALL ON FUNCTION public.tuvi_reverse_affiliate_commission(TEXT, NUMERIC, NUMERIC) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.tuvi_reverse_affiliate_commission(TEXT, NUMERIC, NUMERIC) TO service_role;

CREATE OR REPLACE FUNCTION public.tuvi_request_affiliate_withdrawal(
  p_affiliate_id TEXT,
  p_amount NUMERIC,
  p_req_id TEXT,
  p_bank_snapshot JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_aff RECORD;
  v_available NUMERIC;
  v_payout_id UUID;
BEGIN
  IF p_amount IS NULL OR p_amount < 50000 OR p_amount <> floor(p_amount) THEN
    RETURN jsonb_build_object('ok', FALSE, 'error', 'Số tiền rút tối thiểu 50.000đ và phải là số nguyên.');
  END IF;

  SELECT * INTO v_aff
  FROM public.tuvi_affiliates
  WHERE id = p_affiliate_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', FALSE, 'error', 'Không tìm thấy tài khoản CTV.');
  END IF;

  IF v_aff.status IS DISTINCT FROM 'ACTIVE' THEN
    RETURN jsonb_build_object('ok', FALSE, 'error', 'Tài khoản CTV đang tạm ngưng.');
  END IF;

  IF COALESCE(trim(v_aff.bank_account_number), '') = '' THEN
    RETURN jsonb_build_object('ok', FALSE, 'error', 'Vui lòng cập nhật thông tin tài khoản ngân hàng trước khi rút.');
  END IF;

  v_available := COALESCE(v_aff.total_commission, 0) - COALESCE(v_aff.paid_commission, 0) - COALESCE(v_aff.pending_withdrawal, 0);
  IF p_amount > v_available THEN
    RETURN jsonb_build_object('ok', FALSE, 'error', 'Số tiền yêu cầu vượt quá số dư khả dụng (' || v_available || 'đ).');
  END IF;

  INSERT INTO public.tuvi_affiliate_payouts (
    affiliate_id, affiliate_code, amount, status, req_id, bank_snapshot
  ) VALUES (
    v_aff.id, v_aff.code, p_amount, 'PENDING', p_req_id, p_bank_snapshot
  )
  RETURNING id INTO v_payout_id;

  UPDATE public.tuvi_affiliates
  SET pending_withdrawal = COALESCE(pending_withdrawal, 0) + p_amount,
      last_withdrawal_request_at = NOW()
  WHERE id = v_aff.id;

  RETURN jsonb_build_object(
    'ok', TRUE,
    'payout_id', v_payout_id,
    'pending_withdrawal', COALESCE(v_aff.pending_withdrawal, 0) + p_amount,
    'remaining_available', v_available - p_amount
  );
END;
$$;
REVOKE ALL ON FUNCTION public.tuvi_request_affiliate_withdrawal(TEXT, NUMERIC, TEXT, JSONB) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.tuvi_request_affiliate_withdrawal(TEXT, NUMERIC, TEXT, JSONB) TO service_role;

CREATE OR REPLACE FUNCTION public.tuvi_settle_affiliate_payout(
  p_affiliate_id TEXT,
  p_amount NUMERIC,
  p_req_id TEXT DEFAULT NULL,
  p_bank_tx_id TEXT DEFAULT NULL,
  p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_aff RECORD;
  v_payout RECORD;
  v_remaining NUMERIC;
  v_note_line TEXT;
BEGIN
  IF p_amount IS NULL OR p_amount <= 0 OR p_amount <> floor(p_amount) THEN
    RETURN jsonb_build_object('ok', FALSE, 'error', 'Số tiền chi trả phải là số nguyên dương.');
  END IF;

  SELECT * INTO v_aff
  FROM public.tuvi_affiliates
  WHERE id = p_affiliate_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', FALSE, 'error', 'Không tìm thấy CTV.');
  END IF;

  -- Chống trùng theo bank_tx_id (SePay webhook bắn lại)
  IF p_bank_tx_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.tuvi_affiliate_payouts WHERE bank_tx_id = p_bank_tx_id
  ) THEN
    RETURN jsonb_build_object('ok', TRUE, 'already_processed', TRUE);
  END IF;

  -- Chống trùng theo req_id (bấm nút Email xác nhận nhiều lần hoặc webhook đã quyết toán lệnh đó rồi)
  IF p_req_id IS NOT NULL THEN
    SELECT * INTO v_payout
    FROM public.tuvi_affiliate_payouts
    WHERE req_id = p_req_id
    FOR UPDATE;

    IF FOUND THEN
      IF v_payout.status = 'PAID' THEN
        RETURN jsonb_build_object('ok', TRUE, 'already_processed', TRUE);
      END IF;
      UPDATE public.tuvi_affiliate_payouts
      SET status = 'PAID',
          paid_at = NOW(),
          bank_tx_id = COALESCE(p_bank_tx_id, bank_tx_id),
          note = COALESCE(p_note, note)
      WHERE id = v_payout.id;
    END IF;
  END IF;

  -- Nếu đến từ Webhook / Admin không có req_id -> thử khớp 1 lệnh PENDING cùng số tiền để khóa luôn nút Email!
  IF p_req_id IS NULL THEN
    SELECT * INTO v_payout
    FROM public.tuvi_affiliate_payouts
    WHERE affiliate_id = v_aff.id
      AND status = 'PENDING'
      AND amount = p_amount
    ORDER BY created_at ASC
    LIMIT 1
    FOR UPDATE;

    IF FOUND THEN
      UPDATE public.tuvi_affiliate_payouts
      SET status = 'PAID',
          paid_at = NOW(),
          bank_tx_id = COALESCE(p_bank_tx_id, bank_tx_id),
          note = COALESCE(p_note, note)
      WHERE id = v_payout.id;
    ELSE
      INSERT INTO public.tuvi_affiliate_payouts (
        affiliate_id, affiliate_code, amount, status, bank_tx_id, note, paid_at
      ) VALUES (
        v_aff.id, v_aff.code, p_amount, 'PAID', p_bank_tx_id, p_note, NOW()
      );
    END IF;
  ELSIF v_payout.id IS NULL THEN
    -- Fallback cho lệnh rút cũ tạo trước khi có bảng payouts
    INSERT INTO public.tuvi_affiliate_payouts (
      affiliate_id, affiliate_code, amount, status, req_id, bank_tx_id, note, paid_at
    ) VALUES (
      v_aff.id, v_aff.code, p_amount, 'PAID', p_req_id, p_bank_tx_id, p_note, NOW()
    );
  END IF;

  v_remaining := COALESCE(v_aff.total_commission, 0) - COALESCE(v_aff.paid_commission, 0);
  IF p_amount > v_remaining THEN
    RAISE EXCEPTION 'Số tiền quyết toán (%đ) vượt quá số dư chưa chi trả (%đ)', p_amount, v_remaining;
  END IF;

  v_note_line := '[' || to_char(NOW() AT TIME ZONE 'Asia/Ho_Chi_Minh', 'DD/MM/YYYY HH24:MI') || '] Đã trả ' || p_amount || 'đ' ||
    CASE WHEN COALESCE(p_note, '') <> '' THEN ' - ' || p_note ELSE '' END;

  UPDATE public.tuvi_affiliates
  SET paid_commission = COALESCE(paid_commission, 0) + p_amount,
      pending_withdrawal = GREATEST(0, COALESCE(pending_withdrawal, 0) - p_amount),
      notes = CASE WHEN COALESCE(notes, '') = '' THEN v_note_line ELSE notes || E'\n' || v_note_line END
  WHERE id = v_aff.id;

  RETURN jsonb_build_object(
    'ok', TRUE,
    'already_processed', FALSE,
    'paid_commission', COALESCE(v_aff.paid_commission, 0) + p_amount,
    'pending_withdrawal', GREATEST(0, COALESCE(v_aff.pending_withdrawal, 0) - p_amount)
  );
END;
$$;
REVOKE ALL ON FUNCTION public.tuvi_settle_affiliate_payout(TEXT, NUMERIC, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.tuvi_settle_affiliate_payout(TEXT, NUMERIC, TEXT, TEXT, TEXT) TO service_role;

-- 9. Bảng & RPC Rate Limit phân tán trên PostgreSQL (đồng bộ giữa mọi Vercel serverless containers)
CREATE TABLE IF NOT EXISTS public.tuvi_rate_limits (
  key TEXT PRIMARY KEY,
  count INT NOT NULL DEFAULT 1,
  reset_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.tuvi_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.tuvi_rate_limits FROM anon, authenticated;
GRANT ALL ON TABLE public.tuvi_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.tuvi_check_rate_limit(
  p_key TEXT,
  p_limit INT,
  p_window_ms INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now TIMESTAMPTZ := NOW();
  v_reset TIMESTAMPTZ := v_now + (p_window_ms || ' milliseconds')::INTERVAL;
  v_count INT;
  v_current_reset TIMESTAMPTZ;
BEGIN
  -- Dọn định kỳ các bản ghi hết hạn (nhẹ, xác suất ~5%)
  IF random() < 0.05 THEN
    DELETE FROM public.tuvi_rate_limits WHERE reset_at < v_now;
  END IF;

  INSERT INTO public.tuvi_rate_limits (key, count, reset_at)
  VALUES (p_key, 1, v_reset)
  ON CONFLICT (key) DO UPDATE
  SET count = CASE
        WHEN public.tuvi_rate_limits.reset_at <= v_now THEN 1
        ELSE public.tuvi_rate_limits.count + 1
      END,
      reset_at = CASE
        WHEN public.tuvi_rate_limits.reset_at <= v_now THEN v_reset
        ELSE public.tuvi_rate_limits.reset_at
      END
  RETURNING count, reset_at INTO v_count, v_current_reset;

  RETURN jsonb_build_object(
    'allowed', v_count <= p_limit,
    'remaining', GREATEST(0, p_limit - v_count),
    'reset_at', v_current_reset
  );
END;
$$;
REVOKE ALL ON FUNCTION public.tuvi_check_rate_limit(TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.tuvi_check_rate_limit(TEXT, INT, INT) TO service_role;

-- 10. RPC đặt chỗ lượt Chat nguyên tử (chống TOCTOU race condition & đếm riêng từng hạng mức expert/vip/basic)
CREATE OR REPLACE FUNCTION public.tuvi_reserve_chat_slot(
  p_chart_id UUID,
  p_user_id UUID,
  p_question TEXT,
  p_mode TEXT,
  p_mode_limit INT,
  p_total_limit INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_used INT := 0;
  v_mode_used INT := 0;
  v_msg_id UUID;
BEGIN
  -- Khóa advisory theo chart_id trong phạm vi transaction để triệt tiêu 100% concurrent race
  PERFORM pg_advisory_xact_lock(hashtext('tuvi_chat:' || p_chart_id::TEXT));

  SELECT COUNT(*) INTO v_total_used
  FROM public.tuvi_chat_messages
  WHERE chart_id = p_chart_id;

  SELECT COUNT(*) INTO v_mode_used
  FROM public.tuvi_chat_messages
  WHERE chart_id = p_chart_id
    AND COALESCE(message_type, 'basic') = p_mode;

  IF v_mode_used >= p_mode_limit OR v_total_used >= p_total_limit THEN
    RETURN jsonb_build_object(
      'ok', FALSE,
      'mode_used', v_mode_used,
      'total_used', v_total_used
    );
  END IF;

  INSERT INTO public.tuvi_chat_messages (chart_id, user_id, question, answer, message_type)
  VALUES (p_chart_id, p_user_id, p_question, '__PENDING__', p_mode)
  RETURNING id INTO v_msg_id;

  RETURN jsonb_build_object(
    'ok', TRUE,
    'message_id', v_msg_id,
    'mode_used', v_mode_used + 1,
    'total_used', v_total_used + 1
  );
END;
$$;
REVOKE ALL ON FUNCTION public.tuvi_reserve_chat_slot(UUID, UUID, TEXT, TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.tuvi_reserve_chat_slot(UUID, UUID, TEXT, TEXT, INT, INT) TO service_role;
