-- Fix Security Advisor: security_definer_view
-- Ensure these views run as SECURITY INVOKER so caller RLS is enforced.

ALTER VIEW public.community_post_detail SET (security_invoker = true);
ALTER VIEW public.product_overview_view SET (security_invoker = true);
ALTER VIEW public.gpt_ideas_view SET (security_invoker = true);
ALTER VIEW public.messages_view SET (security_invoker = true);
