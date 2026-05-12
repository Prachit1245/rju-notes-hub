-- Revoke EXECUTE on sensitive SECURITY DEFINER functions from anon/authenticated
-- They should only be invoked via service_role inside the admin-api edge function
REVOKE EXECUTE ON FUNCTION public.create_manager(text, text, text, text, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.verify_manager_password(text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_unique_subject_code(uuid, text) FROM PUBLIC, anon, authenticated;
-- increment_visitor_count is intentionally callable by anon (used by the visitor counter on every page load)