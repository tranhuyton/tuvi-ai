-- Tăng timeout_milliseconds cho pg_net lên 55 giây để đảm bảo gửi trọn lô 12 email qua Gmail SMTP không bị ngắt kết nối sớm
DO $$
DECLARE
    v_job_id BIGINT;
BEGIN
    SELECT jobid INTO v_job_id FROM cron.job WHERE jobname = 'tuvi-email-drip-10m';
    IF v_job_id IS NOT NULL THEN
        PERFORM cron.unschedule(v_job_id);
    END IF;

    PERFORM cron.schedule(
        'tuvi-email-drip-10m',
        '*/10 * * * *',
        $cron$
        SELECT net.http_post(
            url := 'https://www.tuvithayton.vn/api/cron/email-drip',
            headers := '{"Content-Type": "application/json", "x-cron-secret": "tuvi_drip_cron_2026_thayton"}'::jsonb,
            body := '{"source": "pg_cron"}'::jsonb,
            timeout_milliseconds := 55000
        );
        $cron$
    );
END $$;
