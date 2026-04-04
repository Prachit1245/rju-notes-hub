
-- Remove old cron job
SELECT cron.unschedule('fetch-rju-notices-job');

-- Create new cron job: daily at 14:15 UTC (8 PM Nepal time, UTC+5:45)
SELECT cron.schedule(
  'fetch-rju-notices-daily',
  '15 14 * * *',
  $$
  SELECT
    net.http_post(
        url:='https://azotpigzunsiireeabgg.supabase.co/functions/v1/fetch-rju-notices',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6b3RwaWd6dW5zaWlyZWVhYmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1Mjg4NzAsImV4cCI6MjA3NDEwNDg3MH0.ew9_64K2EOBrOHlMwvNPoIz0WUJBmiJhHvVe6QR15ns"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);
