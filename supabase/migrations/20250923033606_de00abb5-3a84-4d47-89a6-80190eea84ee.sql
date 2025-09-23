-- Enable real-time updates for notices table
ALTER TABLE public.notices REPLICA IDENTITY FULL;

-- Add notices table to supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notices;

-- Enable pg_cron extension for scheduled jobs
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a cron job to fetch RJU notices every 30 minutes
SELECT cron.schedule(
  'fetch-rju-notices-job',
  '0,30 * * * *', -- Every 30 minutes
  $$
  SELECT
    net.http_post(
        url:='https://azotpigzunsiireeabgg.functions.supabase.co/functions/v1/fetch-rju-notices',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6b3RwaWd6dW5zaWlyZWVhYmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1Mjg4NzAsImV4cCI6MjA3NDEwNDg3MH0.ew9_64K2EOBrOHlMwvNPoIz0WUJBmiJhHvVe6QR15ns"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);