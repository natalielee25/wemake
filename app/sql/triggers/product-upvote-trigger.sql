CREATE OR REPLACE FUNCTION public.handle_product_upvote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.products
  SET stats = jsonb_set(
    COALESCE(stats, '{}'::jsonb),
    '{upvotes}',
    to_jsonb(COALESCE((stats->>'upvotes')::int, 0) + 1),
    true
  )
  WHERE product_id = NEW.product_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS product_upvote_trigger ON public.product_upvotes;
CREATE TRIGGER product_upvote_trigger
AFTER INSERT ON public.product_upvotes
FOR EACH ROW EXECUTE FUNCTION public.handle_product_upvote();

CREATE OR REPLACE FUNCTION public.handle_product_unvote()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.products
  SET stats = jsonb_set(
    COALESCE(stats, '{}'::jsonb),
    '{upvotes}',
    to_jsonb(GREATEST(COALESCE((stats->>'upvotes')::int, 0) - 1, 0)),
    true
  )
  WHERE product_id = OLD.product_id;
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS product_unvote_trigger ON public.product_upvotes;
CREATE TRIGGER product_unvote_trigger
AFTER DELETE ON public.product_upvotes
FOR EACH ROW EXECUTE FUNCTION public.handle_product_unvote();
