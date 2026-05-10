-- Add image and source link columns
ALTER TABLE public.notices
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS source_url text;

-- Enable required extensions for scheduled http calls
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any existing schedule with the same name
DO $$
BEGIN
  PERFORM cron.unschedule('fetch-rju-notices-daily-8pm-npt');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- Nepal Time = UTC+5:45 -> 8:00 PM NPT = 14:15 UTC
SELECT cron.schedule(
  'fetch-rju-notices-daily-8pm-npt',
  '15 14 * * *',
  $$
  SELECT net.http_post(
    url := 'https://azotpigzunsiireeabgg.supabase.co/functions/v1/fetch-rju-notices',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6b3RwaWd6dW5zaWlyZWVhYmdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1Mjg4NzAsImV4cCI6MjA3NDEwNDg3MH0.ew9_64K2EOBrOHlMwvNPoIz0WUJBmiJhHvVe6QR15ns"}'::jsonb,
    body := jsonb_build_object('trigger','cron','time', now())
  ) AS request_id;
  $$
);