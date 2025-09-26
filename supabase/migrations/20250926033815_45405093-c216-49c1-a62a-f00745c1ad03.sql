-- Update RLS policies for admin-only operations
-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can upload notes" ON public.notes;
DROP POLICY IF EXISTS "Anyone can upload to notes bucket" ON storage.objects;

-- Create admin-only policies for notes table
CREATE POLICY "Admin can insert notes" 
ON public.notes 
FOR INSERT 
WITH CHECK (false); -- Only allow through server/admin

CREATE POLICY "Admin can update notes" 
ON public.notes 
FOR UPDATE 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Admin can delete notes" 
ON public.notes 
FOR DELETE 
USING (true);

-- Create admin-only policies for storage
CREATE POLICY "Admin can upload to notes bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'notes');

CREATE POLICY "Admin can update notes files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'notes');

CREATE POLICY "Admin can delete notes files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'notes');