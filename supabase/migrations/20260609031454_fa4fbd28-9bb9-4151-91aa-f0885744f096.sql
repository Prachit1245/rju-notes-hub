
-- Allow uploads/updates/deletes to the public 'notes' bucket from the app
-- (admin-only access is enforced at the admin-api edge function layer for metadata).

CREATE POLICY "Anyone can upload notes files"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'notes');

CREATE POLICY "Anyone can update notes files"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'notes')
WITH CHECK (bucket_id = 'notes');

CREATE POLICY "Anyone can delete notes files"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'notes');
