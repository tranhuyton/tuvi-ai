-- =====================================================================
-- Migration: Bổ sung trường Số điện thoại (phone) vào public.tuvi_profiles
-- và đồng bộ vào trigger handle_new_user() + get_admin_dashboard_data()
-- =====================================================================

-- 1. Thêm cột phone (không bắt buộc) vào bảng tuvi_profiles
ALTER TABLE public.tuvi_profiles
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Đồng bộ số điện thoại từ auth.users.raw_user_meta_data (nếu đã có)
UPDATE public.tuvi_profiles p
SET phone = au.raw_user_meta_data->>'phone'
FROM auth.users au
WHERE p.id = au.id
  AND (p.phone IS NULL OR p.phone = '')
  AND (au.raw_user_meta_data->>'phone') IS NOT NULL;

-- 3. Cập nhật Trigger handle_new_user() để lưu kèm phone khi đăng ký mới
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Cập nhật get_admin_dashboard_data() trả về thêm trường phone
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_data()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result JSONB;
    v_users JSONB;
    v_charts JSONB;
    v_messages JSONB;
    v_total_users INT;
    v_total_charts INT;
    v_total_pro INT;
    v_total_free INT;
    v_total_messages INT;
BEGIN
    -- 1. Lấy danh sách tài khoản người dùng kèm số điện thoại & số lượng lá số
    SELECT jsonb_agg(u)
    INTO v_users
    FROM (
        SELECT 
            p.id,
            p.email,
            p.full_name,
            COALESCE(NULLIF(p.phone, ''), au.raw_user_meta_data->>'phone', '') AS phone,
            p.created_at,
            COUNT(DISTINCT c.id) AS charts_count,
            COUNT(DISTINCT m.id) AS messages_count
        FROM public.tuvi_profiles p
        LEFT JOIN auth.users au ON au.id = p.id
        LEFT JOIN public.tuvi_charts c ON c.user_id = p.id
        LEFT JOIN public.tuvi_chat_messages m ON m.user_id = p.id
        GROUP BY p.id, p.email, p.full_name, p.phone, au.raw_user_meta_data, p.created_at
        ORDER BY p.created_at DESC
    ) u;

    -- 2. Lấy danh sách tất cả các lá số trên hệ thống
    SELECT jsonb_agg(ch)
    INTO v_charts
    FROM (
        SELECT 
            c.id,
            c.user_id,
            c.title,
            c.duong_so_data,
            c.laso_data,
            c.created_at,
            c.updated_at,
            p.full_name AS user_name,
            p.email AS user_email,
            (c.reading_html IS NOT NULL AND length(c.reading_html) > 50) AS has_reading,
            COUNT(m.id) AS message_count
        FROM public.tuvi_charts c
        LEFT JOIN public.tuvi_profiles p ON p.id = c.user_id
        LEFT JOIN public.tuvi_chat_messages m ON m.chart_id = c.id
        GROUP BY c.id, c.user_id, c.title, c.duong_so_data, c.laso_data, c.created_at, c.updated_at, p.full_name, p.email, c.reading_html
        ORDER BY c.created_at DESC
    ) ch;

    -- 3. Lấy danh sách chi tiết các tin nhắn hỏi đáp gần nhất
    SELECT jsonb_agg(msg)
    INTO v_messages
    FROM (
        SELECT 
            m.id,
            m.chart_id,
            m.user_id,
            m.question,
            m.answer,
            m.created_at,
            p.full_name AS user_name,
            p.email AS user_email,
            c.title AS chart_title
        FROM public.tuvi_chat_messages m
        LEFT JOIN public.tuvi_profiles p ON p.id = m.user_id
        LEFT JOIN public.tuvi_charts c ON c.id = m.chart_id
        ORDER BY m.created_at DESC
        LIMIT 200
    ) msg;

    -- 4. Tính toán các chỉ số thống kê tổng hợp (KPI)
    SELECT COUNT(*) INTO v_total_users FROM public.tuvi_profiles;
    SELECT COUNT(*) INTO v_total_charts FROM public.tuvi_charts;
    SELECT COUNT(*) INTO v_total_messages FROM public.tuvi_chat_messages;
    
    SELECT COUNT(*) INTO v_total_pro 
    FROM public.tuvi_charts 
    WHERE (
        duong_so_data->>'tier' = 'pro' OR laso_data->>'tier' = 'pro' OR
        duong_so_data->>'tier' = 'expert' OR laso_data->>'tier' = 'expert'
    );
    
    v_total_free := v_total_charts - v_total_pro;

    result := jsonb_build_object(
        'users', COALESCE(v_users, '[]'::jsonb),
        'charts', COALESCE(v_charts, '[]'::jsonb),
        'messages', COALESCE(v_messages, '[]'::jsonb),
        'stats', jsonb_build_object(
            'total_users', COALESCE(v_total_users, 0),
            'total_charts', COALESCE(v_total_charts, 0),
            'total_pro', COALESCE(v_total_pro, 0),
            'total_free', COALESCE(v_total_free, 0),
            'total_messages', COALESCE(v_total_messages, 0),
            'estimated_revenue', (COALESCE(v_total_pro, 0) * 119000)
        )
    );

    RETURN result;
END;
$$;
