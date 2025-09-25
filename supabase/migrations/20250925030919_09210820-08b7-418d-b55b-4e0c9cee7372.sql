-- Add is_public column to notes table for admin control
ALTER TABLE public.notes 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN NOT NULL DEFAULT true;