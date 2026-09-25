-- =====================================================================
-- Migration: Cập nhật hàm get_admin_dashboard_data() để Admin có thể xem
-- chi tiết lịch sử câu hỏi đáp của từng khách hàng và từng lá số
-- =====================================================================

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
    -- 1. Lấy danh sách tài khoản người dùng kèm số lượng lá số
    SELECT jsonb_agg(u)
    INTO v_users
    FROM (
        SELECT 
            p.id,
            p.email,
            p.full_name,
            p.created_at,
            COUNT(DISTINCT c.id) AS charts_count,
            COUNT(DISTINCT m.id) AS messages_count
        FROM public.tuvi_profiles p
        LEFT JOIN public.tuvi_charts c ON c.user_id = p.id
        LEFT JOIN public.tuvi_chat_messages m ON m.user_id = p.id
        GROUP BY p.id, p.email, p.full_name, p.created_at
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
    WHERE (duong_so_data->>'tier' = 'pro' OR laso_data->>'tier' = 'pro');
    
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
