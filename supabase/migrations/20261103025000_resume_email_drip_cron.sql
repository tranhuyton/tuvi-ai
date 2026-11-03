-- Kích hoạt lại lịch gửi email tự động sau khi đã cấu hình thành công tên miền riêng Resend (thayton@tuvithayton.vn)
DO $$
DECLARE
    v_job_id BIGINT;
BEGIN
    SELECT jobid INTO v_job_id FROM cron.job WHERE jobname = 'tuvi-email-drip-10m';
    IF v_job_id IS NOT NULL THEN
        PERFORM cron.alter_job(v_job_id, active := true);
    END IF;
END $$;
