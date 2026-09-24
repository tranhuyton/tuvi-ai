-- =====================================================================
-- Migration: Tách riêng bảng tài khoản Tử Vi (tuvi_profiles) khỏi TonyEnglish (profiles)
-- 1. Sao chép 9 tài khoản Tử Vi sang bảng public.tuvi_profiles
-- 2. Đánh dấu metadata app = 'tuvi' trong auth.users
-- 3. Xóa 9 tài khoản Tử Vi khỏi public.profiles (trả lại bảng học viên sạch cho TonyEnglish)
-- 4. Nâng cấp trigger handle_new_user() để tự động phân luồng tài khoản theo app
-- =====================================================================

-- 1. Đồng bộ toàn bộ 9 tài khoản Tử Vi sang public.tuvi_profiles
INSERT INTO public.tuvi_profiles (id, email, full_name, created_at, updated_at)
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.created_at,
    NOW()
FROM public.profiles p
WHERE p.email IN (
    'tyhonbonbon@gmail.com',
    'tyhonbobon@gmail.com',
    'hts.chunguyen@gmail.com',
    'huyen020279@gmail.com',
    'xuanttl@gmail.com',
    'hoaihvc@gmail.com',
    'ken290911@gmail.com',
    'congquockhai.tran@gmail.com',
    'tonhuytran@gmail.com'
)
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

-- 2. Đánh dấu metadata app = 'tuvi' trong auth.users
UPDATE auth.users
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"app": "tuvi"}'::jsonb
WHERE email IN (
    'tyhonbonbon@gmail.com',
    'tyhonbobon@gmail.com',
    'hts.chunguyen@gmail.com',
    'huyen020279@gmail.com',
    'xuanttl@gmail.com',
    'hoaihvc@gmail.com',
    'ken290911@gmail.com',
    'congquockhai.tran@gmail.com',
    'tonhuytran@gmail.com'
);

-- 3. Xóa 9 tài khoản Tử Vi khỏi bảng học viên của TonyEnglish (public.profiles)
DELETE FROM public.profiles
WHERE email IN (
    'tyhonbonbon@gmail.com',
    'tyhonbobon@gmail.com',
    'hts.chunguyen@gmail.com',
    'huyen020279@gmail.com',
    'xuanttl@gmail.com',
    'hoaihvc@gmail.com',
    'ken290911@gmail.com',
    'congquockhai.tran@gmail.com',
    'tonhuytran@gmail.com'
);

-- 4. Nâng cấp Trigger handle_new_user() trên auth.users để phân biệt rõ ràng:
-- - Đăng ký từ Tử Vi (app = 'tuvi') => CHỈ ghi vào public.tuvi_profiles
-- - Đăng ký từ TonyEnglish => Ghi vào public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Nếu đăng ký từ app Tử Vi Thầy Tôn
  IF (NEW.raw_user_meta_data->>'app' = 'tuvi') THEN
    INSERT INTO public.tuvi_profiles (id, email, full_name, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Đảm bảo trigger on_auth_user_created gắn với handle_new_user()
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();
