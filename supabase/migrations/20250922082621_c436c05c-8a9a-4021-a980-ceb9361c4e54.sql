-- Create faculties table
CREATE TABLE public.faculties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create programs table
CREATE TABLE public.programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  faculty_id UUID NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  level TEXT NOT NULL CHECK (level IN ('Undergraduate', 'Graduate')),
  total_semesters INTEGER NOT NULL DEFAULT 8,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  semester INTEGER NOT NULL CHECK (semester >= 1 AND semester <= 12),
  credits INTEGER DEFAULT 3,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(program_id, code)
);

-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT NOT NULL,
  uploader_name TEXT,
  uploader_email TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  rating_sum INTEGER NOT NULL DEFAULT 0,
  rating_count INTEGER NOT NULL DEFAULT 0,
  tags TEXT[],
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notices table
CREATE TABLE public.notices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('exam', 'result', 'admission', 'general', 'event')),
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create storage bucket for notes files
INSERT INTO storage.buckets (id, name, public) VALUES ('notes', 'notes', true);

-- Enable Row Level Security
ALTER TABLE public.faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (no login required)
CREATE POLICY "Anyone can view faculties" ON public.faculties FOR SELECT USING (true);
CREATE POLICY "Anyone can view programs" ON public.programs FOR SELECT USING (true);
CREATE POLICY "Anyone can view subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Anyone can view notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Anyone can view notices" ON public.notices FOR SELECT USING (true);

-- Create policies for admin uploads (will be handled via admin authentication)
CREATE POLICY "Admin can insert faculties" ON public.faculties FOR INSERT WITH CHECK (false); -- Will be updated for admin
CREATE POLICY "Admin can insert programs" ON public.programs FOR INSERT WITH CHECK (false); -- Will be updated for admin
CREATE POLICY "Admin can insert subjects" ON public.subjects FOR INSERT WITH CHECK (false); -- Will be updated for admin
CREATE POLICY "Admin can insert notes" ON public.notes FOR INSERT WITH CHECK (false); -- Will be updated for admin
CREATE POLICY "Admin can insert notices" ON public.notices FOR INSERT WITH CHECK (false); -- Will be updated for admin

-- Create storage policies for notes files
CREATE POLICY "Anyone can view notes files" ON storage.objects FOR SELECT USING (bucket_id = 'notes');
CREATE POLICY "Admin can upload notes files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'notes' AND false); -- Will be updated for admin

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_faculties_updated_at BEFORE UPDATE ON public.faculties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON public.subjects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON public.notes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_notices_updated_at BEFORE UPDATE ON public.notices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert RJU faculties data
INSERT INTO public.faculties (name, code, description) VALUES 
('Faculty of Science, Technology and Engineering', 'FoSTE', 'Faculty focusing on science, technology and engineering programs'),
('Faculty of Humanities & Law', 'FHSS', 'Faculty of humanities, social sciences and law programs'),
('Faculty of Health Sciences', 'FHS', 'Faculty dedicated to health and medical sciences'),
('Faculty of Management', 'FOM', 'Faculty offering business and management programs');

-- Insert RJU programs data
INSERT INTO public.programs (faculty_id, name, code, level, total_semesters, description) VALUES 
((SELECT id FROM public.faculties WHERE code = 'FoSTE'), 'Bachelor of Science in Agriculture', 'BSc.Ag', 'Undergraduate', 8, 'Four-year undergraduate program in agriculture'),
((SELECT id FROM public.faculties WHERE code = 'FoSTE'), 'Bachelor in Information Technology', 'BIT', 'Undergraduate', 8, 'Four-year undergraduate program in information technology'),
((SELECT id FROM public.faculties WHERE code = 'FoSTE'), 'Bachelor in Engineering (Civil Engineering)', 'BECE', 'Undergraduate', 8, 'Four-year undergraduate program in civil engineering'),
((SELECT id FROM public.faculties WHERE code = 'FoSTE'), 'Bachelor of Science Computer Science and Information Technology', 'BSC CSIT', 'Undergraduate', 8, 'Four-year undergraduate program in computer science and IT'),
((SELECT id FROM public.faculties WHERE code = 'FHSS'), 'Master of Philosophy in Eastern Philosophy', 'M.Phil', 'Graduate', 4, 'Two-year graduate program in eastern philosophy'),
((SELECT id FROM public.faculties WHERE code = 'FHSS'), 'Bachelor of Journalism and Mass Communication', 'BJMC', 'Undergraduate', 8, 'Four-year undergraduate program in journalism and mass communication'),
((SELECT id FROM public.faculties WHERE code = 'FHSS'), 'Bachelor of Arts and Bachelor of Legislative Law', 'BALLB', 'Undergraduate', 10, 'Five-year integrated undergraduate law program'),
((SELECT id FROM public.faculties WHERE code = 'FHSS'), 'Bachelor in Computer Application', 'BCA', 'Undergraduate', 6, 'Three-year undergraduate program in computer applications'),
((SELECT id FROM public.faculties WHERE code = 'FHS'), 'Bachelor of Public Health', 'BPH', 'Undergraduate', 8, 'Four-year undergraduate program in public health'),
((SELECT id FROM public.faculties WHERE code = 'FHS'), 'Bachelor of Science Medical Laboratory Technology', 'BMLT', 'Undergraduate', 8, 'Four-year undergraduate program in medical laboratory technology'),
((SELECT id FROM public.faculties WHERE code = 'FOM'), 'Master of Business Administration', 'MBA', 'Graduate', 4, 'Two-year graduate program in business administration'),
((SELECT id FROM public.faculties WHERE code = 'FOM'), 'Bachelor of Digital Business Management', 'BDBM', 'Undergraduate', 8, 'Four-year undergraduate program in digital business management');