
-- Managers table: stores admin/manager accounts with hashed passwords
CREATE TABLE public.managers (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL UNIQUE,
  name text NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'manager' CHECK (role IN ('admin', 'manager')),
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES public.managers(id),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;

-- Only service_role can access managers
CREATE POLICY "Service role full access on managers"
  ON public.managers FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Audit log table: tracks all admin actions
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manager_id uuid REFERENCES public.managers(id),
  manager_email text NOT NULL,
  action text NOT NULL,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only service_role can write audit logs
CREATE POLICY "Service role full access on audit_logs"
  ON public.audit_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Seed the default admin account (password: RjuPrachit12@)
-- Using pgcrypto for bcrypt hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO public.managers (email, name, password_hash, role)
VALUES (
  'rjuadmin@notes.edu.np',
  'RJU Admin',
  crypt('RjuPrachit12@', gen_salt('bf')),
  'admin'
);

-- Create timestamp trigger for managers
CREATE TRIGGER update_managers_updated_at
  BEFORE UPDATE ON public.managers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
