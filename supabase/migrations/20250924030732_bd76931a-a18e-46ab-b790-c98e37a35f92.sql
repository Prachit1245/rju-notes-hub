-- Add sample subjects for programs to enable note uploads
-- First, let's get the program IDs and add subjects for each program

-- Sample subjects for Computer Science programs
INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Programming Fundamentals' as name,
  'CS101' as code,
  1 as semester,
  3 as credits,
  'Introduction to programming concepts and basic coding skills' as description
FROM public.programs p 
WHERE p.code ILIKE '%CS%' OR p.code ILIKE '%IT%' OR p.code ILIKE '%BIT%'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Data Structures and Algorithms' as name,
  'CS201' as code,
  2 as semester,
  3 as credits,
  'Fundamental data structures and algorithmic problem solving' as description
FROM public.programs p 
WHERE p.code ILIKE '%CS%' OR p.code ILIKE '%IT%' OR p.code ILIKE '%BIT%'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Database Management Systems' as name,
  'CS301' as code,
  3 as semester,
  3 as credits,
  'Database design, SQL, and database administration' as description
FROM public.programs p 
WHERE p.code ILIKE '%CS%' OR p.code ILIKE '%IT%' OR p.code ILIKE '%BIT%'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Web Development' as name,
  'CS302' as code,
  3 as semester,
  3 as credits,
  'HTML, CSS, JavaScript and modern web frameworks' as description
FROM public.programs p 
WHERE p.code ILIKE '%CS%' OR p.code ILIKE '%IT%' OR p.code ILIKE '%BIT%'
LIMIT 1;

-- Sample subjects for Management programs
INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Principles of Management' as name,
  'MGT101' as code,
  1 as semester,
  3 as credits,
  'Basic management principles and organizational behavior' as description
FROM public.programs p 
WHERE p.code ILIKE '%BBA%' OR p.code ILIKE '%MBA%' OR p.code ILIKE '%MBS%'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Financial Accounting' as name,
  'ACC101' as code,
  1 as semester,
  3 as credits,
  'Introduction to accounting principles and financial statements' as description
FROM public.programs p 
WHERE p.code ILIKE '%BBA%' OR p.code ILIKE '%MBA%' OR p.code ILIKE '%MBS%'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Marketing Management' as name,
  'MKT201' as code,
  2 as semester,
  3 as credits,
  'Marketing strategies, consumer behavior, and market research' as description
FROM public.programs p 
WHERE p.code ILIKE '%BBA%' OR p.code ILIKE '%MBA%' OR p.code ILIKE '%MBS%'
LIMIT 1;

-- Sample subjects for Engineering programs  
INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Engineering Mathematics I' as name,
  'MATH101' as code,
  1 as semester,
  3 as credits,
  'Calculus, differential equations, and linear algebra' as description
FROM public.programs p 
WHERE p.code ILIKE '%BE%' OR p.code ILIKE '%ENG%'
LIMIT 1;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Physics for Engineers' as name,
  'PHY101' as code,
  1 as semester,
  3 as credits,
  'Applied physics concepts for engineering applications' as description
FROM public.programs p 
WHERE p.code ILIKE '%BE%' OR p.code ILIKE '%ENG%'
LIMIT 1;

-- Add subjects for all programs to ensure everyone has something to upload to
INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'English Communication' as name,
  'ENG101' as code,
  1 as semester,
  3 as credits,
  'English language skills, writing, and communication' as description
FROM public.programs p;

INSERT INTO public.subjects (program_id, name, code, semester, credits, description)
SELECT 
  p.id as program_id,
  'Nepal Studies' as name,
  'NEP101' as code,
  1 as semester,
  2 as credits,
  'History, culture, and society of Nepal' as description
FROM public.programs p;