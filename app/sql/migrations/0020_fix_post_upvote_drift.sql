CREATE OR REPLACE FUNCTION public.handle_post_unvote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    UPDATE public.posts
    SET upvotes = GREATEST(upvotes - 1, 0)
    WHERE post_id = OLD.post_id;
    RETURN OLD;
END;
$$;

UPDATE public.posts p
SET upvotes = COALESCE(u.upvote_count, 0)
FROM (
    SELECT post_id, COUNT(*)::bigint AS upvote_count
    FROM public.post_upvotes
    GROUP BY post_id
) u
WHERE p.post_id = u.post_id;

UPDATE public.posts
SET upvotes = 0
WHERE post_id NOT IN (SELECT DISTINCT post_id FROM public.post_upvotes)
  AND upvotes <> 0;
