-- Drop the old category check constraint
ALTER TABLE notices DROP CONSTRAINT IF EXISTS notices_category_check;

-- Add new category check constraint with all needed categories
ALTER TABLE notices ADD CONSTRAINT notices_category_check 
CHECK (category = ANY (ARRAY['exam', 'result', 'admission', 'admissions', 'general', 'event', 'examinations', 'vacancy']::text[]));