-- Fix 1: Remove uploader_email PII column from publicly readable notes table
ALTER TABLE public.notes DROP COLUMN IF EXISTS uploader_email;

-- Fix 2: Remove permissive public storage policies that allowed any anonymous user
-- to delete or overwrite files in the notes bucket. Service role (via admin-api edge
-- function) retains full access, so legitimate admin operations continue to work.
DROP POLICY IF EXISTS "Admin can delete notes files" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update notes files" ON storage.objects;

-- Fix 3: Remove permissive UPDATE policy on visitor_stats. The increment_visitor_count()
-- function is SECURITY DEFINER and bypasses RLS, so the public UPDATE policy is unnecessary
-- and would otherwise allow anyone to overwrite visitor counts to arbitrary values.
DROP POLICY IF EXISTS "Anyone can update visitor count" ON public.visitor_stats;