-- Clear existing sample subjects and add proper RJU subjects
DELETE FROM public.subjects;

-- BCA Program Subjects (Semester-wise)
INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Computer Fundamentals & Applications' as name,
  'CSC101' as code,
  1 as semester,
  3 as credits,
  'Introduction to computer systems and applications' as description
FROM public.programs p 
WHERE p.code = 'BCA'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Mathematics I' as name,
  'MTH101' as code,
  1 as semester,
  3 as credits,
  'Mathematical foundations for computing' as description
FROM public.programs p 
WHERE p.code = 'BCA'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'C Programming' as name,
  'CSC102' as code,
  2 as semester,
  3 as credits,
  'Programming in C language' as description
FROM public.programs p 
WHERE p.code = 'BCA'
LIMIT 1;

-- BSC CSIT Program Subjects
INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Introduction to Information Technology' as name,
  'CSC109' as code,
  1 as semester,
  3 as credits,
  'Fundamentals of IT and computing' as description
FROM public.programs p 
WHERE p.code = 'BSC CSIT'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Programming in C' as name,
  'CSC110' as code,
  1 as semester,
  3 as credits,
  'C programming fundamentals' as description
FROM public.programs p 
WHERE p.code = 'BSC CSIT'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Digital Logic' as name,
  'CSC111' as code,
  1 as semester,
  3 as credits,
  'Digital circuits and logic design' as description
FROM public.programs p 
WHERE p.code = 'BSC CSIT'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Object Oriented Programming' as name,
  'CSC202' as code,
  2 as semester,
  3 as credits,
  'OOP concepts and implementation' as description
FROM public.programs p 
WHERE p.code = 'BSC CSIT'
LIMIT 1;

-- BIT Program Subjects
INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Programming Fundamentals' as name,
  'CSC150' as code,
  1 as semester,
  3 as credits,
  'Basic programming concepts' as description
FROM public.programs p 
WHERE p.code = 'BIT'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Web Technology' as name,
  'CSC251' as code,
  2 as semester,
  3 as credits,
  'HTML, CSS, JavaScript and web development' as description
FROM public.programs p 
WHERE p.code = 'BIT'
LIMIT 1;

-- Civil Engineering Subjects
INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Engineering Drawing I' as name,
  'CE101' as code,
  1 as semester,
  3 as credits,
  'Technical drawing and drafting' as description
FROM public.programs p 
WHERE p.code = 'BECE'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Engineering Mathematics I' as name,
  'MTH101' as code,
  1 as semester,
  3 as credits,
  'Calculus and differential equations' as description
FROM public.programs p 
WHERE p.code = 'BECE'
LIMIT 1;

-- Management Subjects (BBA/MBA style)
INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Principles of Management' as name,
  'MGT101' as code,
  1 as semester,
  3 as credits,
  'Basic management concepts' as description
FROM public.programs p 
WHERE p.code IN ('BDBM', 'MBA')
LIMIT 2;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Business Communication' as name,
  'ENG110' as code,
  1 as semester,
  3 as credits,
  'Professional communication skills' as description
FROM public.programs p 
WHERE p.code IN ('BDBM', 'MBA')
LIMIT 2;

-- Add common subjects for all programs
INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'English I' as name,
  'ENG101' as code,
  1 as semester,
  3 as credits,
  'English language and communication' as description
FROM public.programs p;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Nepali' as name,
  'NEP101' as code,
  1 as semester,
  2 as credits,
  'Nepali language and literature' as description
FROM public.programs p;