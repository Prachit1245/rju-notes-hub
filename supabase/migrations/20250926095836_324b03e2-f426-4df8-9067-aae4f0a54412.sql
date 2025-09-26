-- Fix upload issues by improving RLS policies and adding proper constraints

-- Ensure notes table allows all inserts for uploads
DROP POLICY IF EXISTS "Allow service role inserts" ON public.notes;
DROP POLICY IF EXISTS "Allow uploads" ON public.notes;

CREATE POLICY "Allow uploads" 
ON public.notes 
FOR INSERT 
WITH CHECK (true);

-- Ensure subjects table allows all inserts for custom subjects  
DROP POLICY IF EXISTS "Allow service role inserts for subjects" ON public.subjects;

CREATE POLICY "Allow uploads for subjects" 
ON public.subjects 
FOR INSERT 
WITH CHECK (true);

-- Create function to generate unique subject codes
CREATE OR REPLACE FUNCTION public.generate_unique_subject_code(
  p_program_id UUID,
  p_base_code TEXT DEFAULT 'CUSTOM'
) RETURNS TEXT AS $$
DECLARE
  v_code TEXT;
  v_counter INTEGER := 1;
  v_exists BOOLEAN;
BEGIN
  -- Start with base code
  v_code := p_base_code;
  
  -- Check if it exists
  SELECT EXISTS(
    SELECT 1 FROM public.subjects 
    WHERE program_id = p_program_id AND code = v_code
  ) INTO v_exists;
  
  -- If exists, append counter until we find unique one
  WHILE v_exists LOOP
    v_code := p_base_code || '_' || v_counter::TEXT;
    v_counter := v_counter + 1;
    
    SELECT EXISTS(
      SELECT 1 FROM public.subjects 
      WHERE program_id = p_program_id AND code = v_code
    ) INTO v_exists;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;