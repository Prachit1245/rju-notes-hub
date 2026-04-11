
-- Drop overly permissive INSERT/UPDATE/DELETE policies on notes
DROP POLICY IF EXISTS "Allow uploads" ON public.notes;
DROP POLICY IF EXISTS "Admin can update notes" ON public.notes;
DROP POLICY IF EXISTS "Admin can delete notes" ON public.notes;

-- Re-create them restricted to service_role only
CREATE POLICY "Service role can insert notes"
  ON public.notes FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can update notes"
  ON public.notes FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete notes"
  ON public.notes FOR DELETE
  TO service_role
  USING (true);

-- Drop overly permissive INSERT policy on subjects
DROP POLICY IF EXISTS "Allow uploads for subjects" ON public.subjects;

-- Re-create restricted to service_role only
CREATE POLICY "Service role can insert subjects"
  ON public.subjects FOR INSERT
  TO service_role
  WITH CHECK (true);
