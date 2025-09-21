-- Storage setup for listing images
-- This migration creates the storage bucket and sets up policies for image uploads

-- Create the storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listing-images', 'listing-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS is already enabled on storage.objects by default in Supabase
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view images (public bucket)
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'listing-images');

-- Policy: Authenticated users can upload images to their own folder
CREATE POLICY "Users can upload own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'listing-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update their own images
CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'listing-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'listing-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own images
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'listing-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create a function to clean up orphaned images
-- This function will be used to delete images that are no longer referenced in listings
CREATE OR REPLACE FUNCTION cleanup_orphaned_images()
RETURNS void AS $$
DECLARE
  image_path text;
BEGIN
  -- Find images in storage that are not referenced in any listing
  FOR image_path IN 
    SELECT objects.name
    FROM storage.objects
    WHERE bucket_id = 'listing-images'
    AND NOT EXISTS (
      SELECT 1 
      FROM listings 
      WHERE images @> ARRAY[('https://' || current_setting('app.settings.supabase_url') || '/storage/v1/object/public/listing-images/' || objects.name)]
    )
    AND created_at < NOW() - INTERVAL '24 hours' -- Only clean up images older than 24 hours
  LOOP
    -- Delete the orphaned image
    DELETE FROM storage.objects 
    WHERE bucket_id = 'listing-images' AND name = image_path;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to extract image paths from URLs for cleanup
CREATE OR REPLACE FUNCTION extract_image_paths_from_listings()
RETURNS TABLE(image_path text) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT 
    regexp_replace(
      unnest(l.images), 
      '^https://[^/]+/storage/v1/object/public/listing-images/', 
      ''
    ) as image_path
  FROM listings l
  WHERE l.images IS NOT NULL AND array_length(l.images, 1) > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the cleanup function to authenticated users
GRANT EXECUTE ON FUNCTION cleanup_orphaned_images() TO authenticated;
GRANT EXECUTE ON FUNCTION extract_image_paths_from_listings() TO authenticated;

-- Comment the functions
COMMENT ON FUNCTION cleanup_orphaned_images() IS 'Removes orphaned images from storage that are not referenced in any listing';
COMMENT ON FUNCTION extract_image_paths_from_listings() IS 'Extracts image storage paths from listing image URLs for reference checking';

-- Note: Storage object indexes are managed by Supabase automatically
-- We can only create indexes on our own tables

-- Add helpful index for listings images array operations
CREATE INDEX IF NOT EXISTS idx_listings_images_gin 
  ON listings USING gin(images) 
  WHERE images IS NOT NULL;
