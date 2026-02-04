-- Sync posts.upvotes with actual count from post_upvotes table
-- This fixes the -1 issue caused by migration 0009 not syncing existing data
UPDATE posts 
SET upvotes = COALESCE(
    (SELECT COUNT(*) FROM post_upvotes WHERE post_upvotes.post_id = posts.post_id), 
    0
);--> statement-breakpoint

-- Add a CHECK constraint to prevent negative upvotes in the future
ALTER TABLE posts ADD CONSTRAINT posts_upvotes_non_negative CHECK (upvotes >= 0);
