-- Fix RLS policy for subjects to allow inserts
DROP POLICY IF EXISTS "Admin can insert subjects" ON public.subjects;

CREATE POLICY "Allow service role inserts for subjects" 
ON public.subjects 
FOR INSERT 
WITH CHECK (true);