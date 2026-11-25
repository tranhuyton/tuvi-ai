-- Migration: Khóa danh tính lá số trả phí (Pro / Expert) chống lạm dụng 1 lần thanh toán xem nhiều người
-- Khi lá số đã ở gói 'pro' hoặc 'expert' (hoặc đã có đơn PAID):
--   1. Client (authenticated) KHÔNG được phép đổi hoTen, gioiTinh, ngayDuong, thangDuong, namDuong, namXem, title.
--   2. Client KHÔNG được tự sửa hoặc reset laso_data.paidEditCount (chỉ service_role trong /api/tuvi/reading được ghi).
--   3. Nếu đã có bài luận trả phí (reading_html >= 300 ký tự), client KHÔNG được tự xóa/ghi đè reading_html.
--   4. Sau khi đã dùng hết 01 lượt chỉnh sửa miễn phí (paidEditCount >= 1), khóa luôn gioSinhVal và laso_data từ phía client.

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
  is_paid_chart BOOLEAN;
  has_existing_reading BOOLEAN;
  old_paid_edit_count INT;
  locked_key TEXT;
  locked_keys TEXT[] := ARRAY['hoTen', 'gioiTinh', 'ngayDuong', 'thangDuong', 'namDuong', 'namXem'];
BEGIN
  IF current_setting('request.jwt.claim.role', true) IS DISTINCT FROM 'service_role'
     AND current_user NOT IN ('postgres', 'supabase_admin') THEN
    IF TG_OP = 'INSERT' THEN
      -- Client tạo mới lá số luôn bắt buộc tier = 'free' và không được tự chèn quota / needsReadingUpgrade / paidEditCount
      NEW.duong_so_data := jsonb_set(COALESCE(NEW.duong_so_data, '{}'::jsonb), '{tier}', '"free"'::jsonb, true);
      NEW.laso_data := jsonb_set(
        (COALESCE(NEW.laso_data, '{}'::jsonb) - 'quota' - 'needsReadingUpgrade' - 'paidEditCount'),
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

      -- Không cho client tự ghi đè quota, needsReadingUpgrade, hay paidEditCount trên laso_data
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

      IF (NEW.laso_data->'paidEditCount') IS DISTINCT FROM (OLD.laso_data->'paidEditCount') THEN
        IF OLD.laso_data ? 'paidEditCount' THEN
          NEW.laso_data := jsonb_set(
            COALESCE(NEW.laso_data, '{}'::jsonb),
            '{paidEditCount}',
            OLD.laso_data->'paidEditCount',
            true
          );
        ELSE
          NEW.laso_data := COALESCE(NEW.laso_data, '{}'::jsonb) - 'paidEditCount';
        END IF;
      END IF;

      -- CHỐNG LẠM DỤNG TRÊN LÁ SỐ TRẢ PHÍ (Pro / Expert)
      is_paid_chart := (old_tier IN ('pro', 'expert')) OR (old_laso_tier IN ('pro', 'expert'));
      has_existing_reading := length(trim(COALESCE(OLD.reading_html, ''))) >= 300;
      old_paid_edit_count := COALESCE((OLD.laso_data->>'paidEditCount')::int, 0);

      IF is_paid_chart THEN
        -- 1. Khóa cứng Title & danh tính đương số (Họ tên, Giới tính, Ngày/Tháng/Năm sinh, Năm xem hạn)
        NEW.title := OLD.title;
        FOREACH locked_key IN ARRAY locked_keys LOOP
          IF OLD.duong_so_data ? locked_key THEN
            NEW.duong_so_data := jsonb_set(
              COALESCE(NEW.duong_so_data, '{}'::jsonb),
              ARRAY[locked_key],
              OLD.duong_so_data->locked_key,
              true
            );
          END IF;
        END LOOP;

        -- 2. Nếu đã có bài luận trả phí, cấm client tự xóa hoặc ghi đè reading_html (chỉ server service_role mới được cập nhật)
        IF has_existing_reading THEN
          NEW.reading_html := OLD.reading_html;
        END IF;

        -- 3. Nếu đã dùng hết 01 lượt chỉnh sửa miễn phí, khóa luôn giờ sinh và dữ liệu an sao trên client
        IF has_existing_reading AND old_paid_edit_count >= 1 THEN
          IF OLD.duong_so_data ? 'gioSinhVal' THEN
            NEW.duong_so_data := jsonb_set(
              COALESCE(NEW.duong_so_data, '{}'::jsonb),
              '{gioSinhVal}',
              OLD.duong_so_data->'gioSinhVal',
              true
            );
          END IF;
          NEW.laso_data := OLD.laso_data;
        END IF;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
