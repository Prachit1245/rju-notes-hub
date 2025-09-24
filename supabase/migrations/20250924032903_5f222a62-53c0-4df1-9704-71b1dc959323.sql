-- Fix RLS policies for file uploads (handle existing policies)
-- First drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can upload notes" ON public.notes;
DROP POLICY IF EXISTS "Admin can insert notes" ON public.notes;

-- Create new policy for notes table to allow uploads
CREATE POLICY "Anyone can upload notes" 
ON public.notes 
FOR INSERT 
WITH CHECK (true);

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Anyone can upload to notes bucket" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view notes files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update notes files" ON storage.objects;

-- Create new storage policies for notes bucket
CREATE POLICY "Anyone can upload to notes bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'notes');

CREATE POLICY "Anyone can view notes files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'notes');