-- Create visitor_stats table for tracking total visitors
CREATE TABLE public.visitor_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_visits INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_stats ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read visitor stats
CREATE POLICY "Anyone can view visitor stats" 
ON public.visitor_stats 
FOR SELECT 
USING (true);

-- Allow updates from authenticated/anon for counting
CREATE POLICY "Anyone can update visitor count" 
ON public.visitor_stats 
FOR UPDATE 
USING (true);

-- Insert initial row
INSERT INTO public.visitor_stats (total_visits, unique_visitors) VALUES (1247, 892);

-- Create function to increment visitor count
CREATE OR REPLACE FUNCTION public.increment_visitor_count()
RETURNS void AS $$
BEGIN
  UPDATE public.visitor_stats 
  SET total_visits = total_visits + 1, 
      last_updated = now()
  WHERE id = (SELECT id FROM public.visitor_stats LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;