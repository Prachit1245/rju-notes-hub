CREATE TABLE public.note_delete_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES public.managers(id) ON DELETE CASCADE,
  requested_by_email TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.managers(id) ON DELETE SET NULL,
  reviewed_by_email TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.note_delete_requests TO service_role;

ALTER TABLE public.note_delete_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role only" ON public.note_delete_requests FOR ALL USING (false) WITH CHECK (false);

CREATE INDEX idx_note_delete_requests_status ON public.note_delete_requests(status);
CREATE INDEX idx_note_delete_requests_note ON public.note_delete_requests(note_id);