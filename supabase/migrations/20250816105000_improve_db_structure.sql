-- Improve database structure for better performance and data integrity

-- 1. Add unique constraint for category names per user
-- This prevents duplicate category names for the same user
ALTER TABLE public.categories 
ADD CONSTRAINT unique_category_per_user UNIQUE (user_id, name);

-- 2. Add full-text search index for bookmarks
-- This improves search performance across title, description, and URL
CREATE INDEX IF NOT EXISTS idx_bookmarks_search 
ON public.bookmarks USING gin(
  to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(description, '') || ' ' || 
    coalesce(url, '')
  )
);

-- 3. Add GIN index for tags array
-- This improves performance when searching by tags
CREATE INDEX IF NOT EXISTS idx_bookmarks_tags 
ON public.bookmarks USING gin(tags);

-- 4. Add index for category lookups
-- This improves JOIN performance between bookmarks and categories
CREATE INDEX IF NOT EXISTS idx_bookmarks_category_user 
ON public.bookmarks(category_id, user_id);

-- 5. Add index for user bookmarks ordered by creation date
-- This improves performance for the main bookmarks list
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_created 
ON public.bookmarks(user_id, created_at DESC);

-- 6. Create function to create default category for new users
CREATE OR REPLACE FUNCTION public.create_default_category_for_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a default "General" category for new users
  INSERT INTO public.categories (user_id, name, color)
  VALUES (NEW.user_id, 'General', '#6B7280')
  ON CONFLICT (user_id, name) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create trigger to automatically create default category
DROP TRIGGER IF EXISTS create_default_category_trigger ON public.profiles;
CREATE TRIGGER create_default_category_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_category_for_user();

-- 8. Add check constraint for color format (optional)
ALTER TABLE public.categories 
ADD CONSTRAINT check_color_format 
CHECK (color ~ '^#[0-9A-Fa-f]{6}$');

-- 9. Add constraint to ensure tags are not empty strings
-- This prevents empty string tags in the array
CREATE OR REPLACE FUNCTION public.validate_tags()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove empty strings and null values from tags
  NEW.tags := ARRAY(
    SELECT TRIM(tag) 
    FROM unnest(COALESCE(NEW.tags, ARRAY[]::text[])) AS tag 
    WHERE TRIM(tag) != '' AND tag IS NOT NULL
  );
  
  -- If no valid tags remain, set to empty array
  IF array_length(NEW.tags, 1) IS NULL THEN
    NEW.tags := ARRAY[]::text[];
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for tag validation
DROP TRIGGER IF EXISTS validate_tags_trigger ON public.bookmarks;
CREATE TRIGGER validate_tags_trigger
  BEFORE INSERT OR UPDATE ON public.bookmarks
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_tags();