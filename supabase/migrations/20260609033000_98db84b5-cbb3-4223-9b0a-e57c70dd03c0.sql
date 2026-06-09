
-- Remove anonymous write access to the notes storage bucket.
-- Public SELECT (download) remains so the site can keep serving files.
DROP POLICY IF EXISTS "Anyone can upload notes files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can update notes files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can delete notes files" ON storage.objects;

-- Only the edge function (service_role) may write/modify/delete bucket contents.
CREATE POLICY "Service role can manage notes files"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'notes')
WITH CHECK (bucket_id = 'notes');
