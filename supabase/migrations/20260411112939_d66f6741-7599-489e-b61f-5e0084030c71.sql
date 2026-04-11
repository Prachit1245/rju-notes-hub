
-- Function to verify a manager's password using bcrypt
CREATE OR REPLACE FUNCTION public.verify_manager_password(p_email text, p_password text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, extensions
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.managers
    WHERE email = p_email
      AND is_active = true
      AND password_hash = extensions.crypt(p_password, password_hash)
  );
$$;

-- Function to create a new manager with hashed password
CREATE OR REPLACE FUNCTION public.create_manager(
  p_email text,
  p_name text,
  p_password text,
  p_role text DEFAULT 'manager',
  p_created_by uuid DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_manager jsonb;
BEGIN
  INSERT INTO public.managers (email, name, password_hash, role, created_by)
  VALUES (p_email, p_name, extensions.crypt(p_password, extensions.gen_salt('bf')), p_role, p_created_by)
  RETURNING jsonb_build_object('id', id, 'email', email, 'name', name, 'role', role)
  INTO v_manager;
  
  RETURN v_manager;
END;
$$;
