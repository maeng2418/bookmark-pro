-- Add category_id column to bookmarks table and create foreign key relationship
-- This migration adds category_id as a foreign key to categories table

-- Add category_id column to bookmarks table (only if not exists)
ALTER TABLE public.bookmarks 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- Create index for better query performance (only if not exists)
CREATE INDEX IF NOT EXISTS idx_bookmarks_category_id ON public.bookmarks(category_id);

-- Update existing bookmarks to link with categories based on category name
-- This will only work if categories table already exists with matching names
UPDATE public.bookmarks 
SET category_id = (
  SELECT c.id 
  FROM public.categories c 
  WHERE c.name = public.bookmarks.category 
  AND c.user_id = public.bookmarks.user_id
  LIMIT 1
)
WHERE category_id IS NULL;