-- Remove the old category column from bookmarks table
-- This migration completes the transition to using category_id foreign key

-- Remove the old category and category_color columns
ALTER TABLE public.bookmarks 
DROP COLUMN IF EXISTS category;

ALTER TABLE public.bookmarks 
DROP COLUMN IF EXISTS category_color;