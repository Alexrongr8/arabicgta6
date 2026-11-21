-- Phase B: apply ONLY after the app's write actions use the tested RPCs from phase A.
-- Phase A already protects old direct writes. This step reduces the exposed write surface.
BEGIN;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.submissions, public.comments, public.votes FROM PUBLIC, anon, authenticated;
-- Also remove explicit legacy column grants, if any existed outside this repository.
DO $columns$
DECLARE col record;
BEGIN
  FOR col IN SELECT c.relname, a.attname FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    JOIN pg_catalog.pg_attribute a ON a.attrelid = c.oid
    WHERE n.nspname = 'public' AND c.relname IN ('submissions','comments','votes')
      AND a.attnum > 0 AND NOT a.attisdropped
  LOOP
    EXECUTE pg_catalog.format('REVOKE INSERT (%I), UPDATE (%I), REFERENCES (%I) ON public.%I FROM PUBLIC, anon, authenticated',
      col.attname, col.attname, col.attname, col.relname);
  END LOOP;
END
$columns$;
DROP POLICY IF EXISTS "insert own submissions" ON public.submissions;
DROP POLICY IF EXISTS "delete own submissions" ON public.submissions;
DROP POLICY IF EXISTS "insert own comments" ON public.comments;
DROP POLICY IF EXISTS "delete own comments" ON public.comments;
DROP POLICY IF EXISTS "upsert own votes" ON public.votes;
DROP POLICY IF EXISTS "update own votes" ON public.votes;
DROP POLICY IF EXISTS "delete own votes" ON public.votes;
COMMIT;
