-- =====================================================================
-- Migration: Tạo hàm kiểm tra sự tồn tại của tài khoản khách hàng Tử Vi
-- Cho phép khách kiểm tra email trước khi gửi link đổi mật khẩu
-- Chạy với quyền SECURITY DEFINER để bypass RLS một cách an toàn
-- =====================================================================

CREATE OR REPLACE FUNCTION public.check_tuvi_user_exists(p_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_exists boolean := false;
  v_clean_email text;
BEGIN
  v_clean_email := LOWER(TRIM(COALESCE(p_email, '')));
  
  IF v_clean_email = '' THEN
    RETURN false;
  END IF;

  -- 1. Kiểm tra trong danh sách khách hàng Tử Vi (public.tuvi_profiles)
  SELECT EXISTS (
    SELECT 1 FROM public.tuvi_profiles 
    WHERE LOWER(TRIM(email)) = v_clean_email
  ) INTO v_exists;

  IF v_exists THEN
    RETURN true;
  END IF;

  -- 2. Kiểm tra trong auth.users (nếu tài khoản là Tử Vi hoặc Admin)
  SELECT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE LOWER(TRIM(email)) = v_clean_email
      AND (
        raw_user_meta_data->>'app' = 'tuvi'
        OR (raw_user_meta_data->>'role' IS NULL AND raw_user_meta_data->>'app' IS NULL)
        OR raw_user_meta_data->>'role' = 'admin'
      )
  ) INTO v_exists;

  RETURN v_exists;
END;
$$;

-- Cấp quyền gọi hàm cho cả khách chưa đăng nhập (anon) và đã đăng nhập (authenticated)
GRANT EXECUTE ON FUNCTION public.check_tuvi_user_exists(text) TO anon, authenticated;
