-- Quick SQL queries to check if migration 0009_bitter_lake has been applied
-- Run these in your database client (psql, Supabase SQL Editor, etc.)

-- 1. Check if the migration table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = '__drizzle_migrations'
) AS migration_table_exists;

-- 2. List all applied migrations
SELECT * FROM __drizzle_migrations 
ORDER BY created_at DESC;

-- 3. Check if specific columns exist (from migration 0009_bitter_lake)
-- Check for posts.upvotes column
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'posts' 
  AND column_name = 'upvotes'
) AS posts_upvotes_exists;

-- Check for reviews.profile_id column
SELECT EXISTS (
  SELECT FROM information_schema.columns 
  WHERE table_schema = 'public' 
  AND table_name = 'reviews' 
  AND column_name = 'profile_id'
) AS reviews_profile_id_exists;

-- 4. Check if the foreign key constraint exists
SELECT EXISTS (
  SELECT FROM information_schema.table_constraints 
  WHERE table_schema = 'public' 
  AND table_name = 'reviews' 
  AND constraint_name = 'reviews_profile_id_profiles_profile_id_fk'
) AS foreign_key_exists;

-- 5. Combined check - all in one query
SELECT 
  (SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'posts' 
    AND column_name = 'upvotes'
  )) AS posts_upvotes_exists,
  (SELECT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND column_name = 'profile_id'
  )) AS reviews_profile_id_exists,
  (SELECT EXISTS (
    SELECT FROM information_schema.table_constraints 
    WHERE table_schema = 'public' 
    AND table_name = 'reviews' 
    AND constraint_name = 'reviews_profile_id_profiles_profile_id_fk'
  )) AS foreign_key_exists;
