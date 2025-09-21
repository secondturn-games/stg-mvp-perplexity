-- Fix user profiles for existing auth users
-- This migration ensures all auth users have corresponding profiles in the users table

-- First, let's recreate the trigger function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user profile, handling potential conflicts
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name', 
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(
      EXCLUDED.name,
      COALESCE(
        NEW.raw_user_meta_data->>'full_name', 
        NEW.raw_user_meta_data->>'name', 
        split_part(NEW.email, '@', 1)
      )
    ),
    updated_at = NOW();
    
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't prevent user creation
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create missing user profiles for existing auth users
-- This will fix the foreign key constraint issue for existing users
INSERT INTO public.users (id, email, name, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'full_name',
    au.raw_user_meta_data->>'name',
    split_part(au.email, '@', 1)
  ) as name,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
  AND au.email IS NOT NULL;

-- Create a function to manually sync a specific user (useful for debugging)
CREATE OR REPLACE FUNCTION public.sync_user_profile(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  auth_user RECORD;
  result BOOLEAN := FALSE;
BEGIN
  -- Get the auth user
  SELECT * INTO auth_user FROM auth.users WHERE id = user_id;
  
  IF NOT FOUND THEN
    RAISE NOTICE 'Auth user not found: %', user_id;
    RETURN FALSE;
  END IF;
  
  -- Insert or update the user profile
  INSERT INTO public.users (id, email, name, created_at, updated_at)
  VALUES (
    auth_user.id,
    auth_user.email,
    COALESCE(
      auth_user.raw_user_meta_data->>'full_name',
      auth_user.raw_user_meta_data->>'name',
      split_part(auth_user.email, '@', 1)
    ),
    auth_user.created_at,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    updated_at = NOW();
    
  result := TRUE;
  RAISE NOTICE 'User profile synced successfully: %', user_id;
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Failed to sync user profile for %: %', user_id, SQLERRM;
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the sync function to authenticated users
GRANT EXECUTE ON FUNCTION public.sync_user_profile(UUID) TO authenticated;

-- Add some helpful comments
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user profiles when new auth users are created';
COMMENT ON FUNCTION public.sync_user_profile(UUID) IS 'Manually sync a user profile from auth.users to public.users';

-- Create a view to check for orphaned auth users (users without profiles)
CREATE OR REPLACE VIEW public.orphaned_auth_users AS
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.raw_user_meta_data
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- Grant access to the view
GRANT SELECT ON public.orphaned_auth_users TO authenticated;

COMMENT ON VIEW public.orphaned_auth_users IS 'Shows auth users that do not have corresponding profiles in public.users table';

-- Log completion
DO $$
DECLARE
  orphaned_count INTEGER;
  total_auth_users INTEGER;
BEGIN
  SELECT COUNT(*) INTO orphaned_count FROM public.orphaned_auth_users;
  SELECT COUNT(*) INTO total_auth_users FROM auth.users;
  
  RAISE NOTICE 'User profile sync complete. Total auth users: %, Remaining orphaned: %', total_auth_users, orphaned_count;
END $$;

