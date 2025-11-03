-- Create heartbeat table for keeping project active
CREATE TABLE public.heartbeat (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  message text DEFAULT 'auto-activity'
);

-- Enable RLS
ALTER TABLE public.heartbeat ENABLE ROW LEVEL SECURITY;

-- Allow the service role to manage heartbeat records
CREATE POLICY "Service role can manage heartbeat"
ON public.heartbeat
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);