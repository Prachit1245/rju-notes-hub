-- 1) Drop vacuous public INSERT policies (with_check false) — they are no-ops scoped to wrong role
DROP POLICY IF EXISTS "Admin can insert faculties" ON public.faculties;
DROP POLICY IF EXISTS "Admin can insert programs" ON public.programs;
DROP POLICY IF EXISTS "Admin can insert notices" ON public.notices;

-- 2) Storage: drop both INSERT policies on the notes bucket. Admin uploads go through
--    the admin-api edge function which uses the service_role key (bypasses RLS).
DROP POLICY IF EXISTS "Admin can upload to notes bucket" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload notes files" ON storage.objects;

-- 3) Lock down trigger helper function from being called by clients
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 4) Realtime: scope channel subscriptions to the notices-changes topic only.
--    Notices are already public-readable via RLS, so this just re-affirms the same
--    public scope at the realtime layer instead of leaving the channel wide open.
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public notices realtime read" ON realtime.messages;
CREATE POLICY "Public notices realtime read"
ON realtime.messages
FOR SELECT
TO anon, authenticated
USING (topic = 'notices-changes' AND extension = 'postgres_changes');