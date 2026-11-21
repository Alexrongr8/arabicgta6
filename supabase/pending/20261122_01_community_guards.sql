-- Phase A: backwards-compatible database enforcement, plus RPCs for the next app release.
-- Apply as the trusted schema owner in one transaction. No external services or extensions needed.
BEGIN;

-- Current account action only changes this preference. Identity/analytics fields remain server-owned.
REVOKE UPDATE ON public.profiles FROM PUBLIC, anon, authenticated;
-- A table-level REVOKE does not remove an older explicit column grant.
DO $columns$
DECLARE col record;
BEGIN
  FOR col IN SELECT attname FROM pg_catalog.pg_attribute
    WHERE attrelid = 'public.profiles'::regclass AND attnum > 0 AND NOT attisdropped
  LOOP
    EXECUTE pg_catalog.format('REVOKE UPDATE (%I) ON public.profiles FROM PUBLIC, anon, authenticated', col.attname);
  END LOOP;
END
$columns$;
GRANT UPDATE (digest_opt_in) ON public.profiles TO authenticated;
DO $effective_grants$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_catalog.pg_attribute a
    WHERE a.attrelid = 'public.profiles'::regclass AND a.attnum > 0 AND NOT a.attisdropped
      AND a.attname <> 'digest_opt_in'
      AND (pg_catalog.has_column_privilege('authenticated', a.attrelid, a.attnum, 'UPDATE')
        OR pg_catalog.has_column_privilege('anon', a.attrelid, a.attnum, 'UPDATE'))) THEN
    RAISE EXCEPTION 'Unexpected inherited profile UPDATE privileges remain; review role memberships/grants before retrying.';
  END IF;
END
$effective_grants$;
-- Repair an existing recipient mismatch from the auth-owned identity; preserve opt-out preferences.
UPDATE public.profiles p SET email = u.email FROM auth.users u
  WHERE p.id = u.id AND p.email IS DISTINCT FROM u.email;
REVOKE TRUNCATE, REFERENCES, TRIGGER ON public.profiles, public.submissions, public.comments, public.votes FROM PUBLIC, anon, authenticated;

-- Backfill once, at first creation. No FK to content: deleting/hiding a post must not erase quota history.
-- A trusted account deletion still removes that user's history via the auth.users FK.
DO $migration$
DECLARE first_install boolean := pg_catalog.to_regclass('public.community_write_events') IS NULL;
BEGIN
  CREATE TABLE IF NOT EXISTS public.community_write_events (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    kind text NOT NULL CHECK (kind IN ('submission', 'comment')),
    object_id uuid NOT NULL,
    created_at timestamptz NOT NULL DEFAULT pg_catalog.clock_timestamp(),
    UNIQUE (kind, object_id)
  );
  IF first_install THEN
    INSERT INTO public.community_write_events(user_id, kind, object_id, created_at)
      SELECT user_id, 'submission', id, LEAST(created_at, pg_catalog.now())
      FROM public.submissions WHERE created_at >= pg_catalog.now() - interval '48 hours'
      ON CONFLICT (kind, object_id) DO NOTHING;
    INSERT INTO public.community_write_events(user_id, kind, object_id, created_at)
      SELECT user_id, 'comment', id, LEAST(created_at, pg_catalog.now())
      FROM public.comments WHERE created_at >= pg_catalog.now() - interval '48 hours'
      ON CONFLICT (kind, object_id) DO NOTHING;
  END IF;
END
$migration$;
CREATE INDEX IF NOT EXISTS community_write_events_user_window_idx
  ON public.community_write_events(user_id, kind, created_at DESC);
CREATE INDEX IF NOT EXISTS community_write_events_retention_idx
  ON public.community_write_events(created_at);
ALTER TABLE public.community_write_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.community_write_events FROM PUBLIC, anon, authenticated, service_role;
REVOKE ALL ON SEQUENCE public.community_write_events_id_seq FROM PUBLIC, anon, authenticated, service_role;
GRANT SELECT ON public.community_write_events TO service_role;

-- Internal helper. A member cannot use it as a public existence oracle.
CREATE OR REPLACE FUNCTION public.community_target_exists(p_target text)
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = '' AS $function$
BEGIN
  IF p_target IS NULL OR pg_catalog.char_length(p_target) > 256 THEN RETURN false; END IF;
  IF p_target ~ '^item:[A-Za-z0-9_-]+$' THEN
    RETURN EXISTS (SELECT 1 FROM public.items WHERE slug = pg_catalog.substr(p_target, 6));
  END IF;
  IF p_target ~ '^sub:[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$' THEN
    RETURN EXISTS (SELECT 1 FROM public.submissions
      WHERE id = pg_catalog.substr(p_target, 5)::uuid AND NOT hidden);
  END IF;
  RETURN false;
END
$function$;
REVOKE ALL ON FUNCTION public.community_target_exists(text) FROM PUBLIC, anon, authenticated;

-- This trigger protects BOTH legacy direct inserts and the new SECURITY DEFINER RPCs.
-- current_user inside a definer is the owner, so inspect the original SET ROLE setting instead.
CREATE OR REPLACE FUNCTION public.guard_community_insert()
RETURNS trigger LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE
  caller_name text := COALESCE(NULLIF(NULLIF(pg_catalog.current_setting('role', true), 'none'), ''), session_user::text);
  trusted boolean := false;
  actor uuid;
  display_name text;
  avatar text;
  kind_name text;
  allowance integer;
  moment timestamptz;
BEGIN
  SELECT r.rolsuper OR r.rolbypassrls OR r.oid = c.relowner INTO trusted
    FROM pg_catalog.pg_roles r CROSS JOIN pg_catalog.pg_class c
    WHERE r.rolname = caller_name AND c.oid = TG_RELID;
  IF COALESCE(trusted, false) THEN RETURN NEW; END IF;

  actor := auth.uid();
  IF actor IS NULL OR NEW.user_id IS DISTINCT FROM actor THEN
    RAISE EXCEPTION USING ERRCODE = '28000', MESSAGE = 'community_auth_required';
  END IF;
  IF NEW.hidden THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'community_invalid';
  END IF;
  SELECT
    COALESCE(
      CASE WHEN pg_catalog.jsonb_typeof(u.raw_user_meta_data->'full_name') = 'string'
        THEN NULLIF(pg_catalog.btrim(u.raw_user_meta_data->>'full_name'), '') END,
      CASE WHEN pg_catalog.jsonb_typeof(u.raw_user_meta_data->'name') = 'string'
        THEN NULLIF(pg_catalog.btrim(u.raw_user_meta_data->>'name'), '') END,
      NULLIF(pg_catalog.split_part(u.email, '@', 1), ''), 'Player'),
    CASE WHEN pg_catalog.jsonb_typeof(u.raw_user_meta_data->'avatar_url') = 'string'
      AND pg_catalog.char_length(u.raw_user_meta_data->>'avatar_url') <= 2048
      AND (u.raw_user_meta_data->>'avatar_url') ~ '^https://[^[:space:][:cntrl:]]+$'
      THEN u.raw_user_meta_data->>'avatar_url' END
    INTO display_name, avatar FROM auth.users u WHERE u.id = actor;
  IF NOT FOUND THEN
    RAISE EXCEPTION USING ERRCODE = '28000', MESSAGE = 'community_auth_required';
  END IF;

  NEW.body := pg_catalog.btrim(NEW.body);
  IF TG_TABLE_NAME = 'submissions' THEN
    kind_name := 'submission'; allowance := 5;
    NEW.title := pg_catalog.btrim(NEW.title);
    NEW.place := NULLIF(pg_catalog.btrim(NEW.place), '');
    NEW.video_url := NULLIF(pg_catalog.btrim(NEW.video_url), '');
    IF NEW.title IS NULL OR pg_catalog.char_length(NEW.title) NOT BETWEEN 5 AND 140
      OR NEW.title !~ '[^[:space:]]'
      OR NEW.body IS NULL OR pg_catalog.char_length(NEW.body) NOT BETWEEN 20 AND 4000
      OR NEW.body !~ '[^[:space:]]'
      OR NEW.category IS NULL OR NEW.category NOT IN
        ('news','secrets','money','weapons','places','characters','vehicles','glitches','strange','choices','streamers','funny','tips')
      OR pg_catalog.char_length(NEW.place) > 120
      OR (NEW.video_url IS NOT NULL AND (pg_catalog.char_length(NEW.video_url) > 300
        OR NEW.video_url !~* '^https://(www\.)?(youtube\.com|youtu\.be|tiktok\.com|instagram\.com|x\.com|twitter\.com|streamable\.com)/'
        OR NEW.video_url ~ '[[:space:][:cntrl:]]')) THEN
      RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'community_invalid';
    END IF;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    kind_name := 'comment'; allowance := 40;
    IF NEW.body IS NULL OR pg_catalog.char_length(NEW.body) NOT BETWEEN 2 AND 1500
      OR NEW.body !~ '[^[:space:]]'
      OR NEW.body ~* '(https?://|www\.)'
      OR NOT public.community_target_exists(NEW.target) THEN
      RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'community_invalid';
    END IF;
  ELSE
    RAISE EXCEPTION 'Unexpected community trigger target';
  END IF;

  -- Locks survive until transaction completion; each subsequent statement gets a fresh READ COMMITTED snapshot.
  PERFORM pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('community:' || actor::text || ':' || kind_name, 0));
  moment := pg_catalog.clock_timestamp();
  IF (SELECT pg_catalog.count(*) FROM public.community_write_events
      WHERE user_id = actor AND kind = kind_name AND created_at > moment - interval '24 hours') >= allowance THEN
    RAISE EXCEPTION USING ERRCODE = 'P0001', MESSAGE = 'community_limit';
  END IF;

  NEW.id := pg_catalog.gen_random_uuid();
  NEW.created_at := moment;
  NEW.author_name := COALESCE(NULLIF(pg_catalog.left(pg_catalog.split_part(pg_catalog.btrim(pg_catalog.regexp_replace(display_name, '[[:space:]]+', ' ', 'g')), ' ', 1), 80), ''), 'Player');
  NEW.author_avatar := avatar;
  INSERT INTO public.community_write_events(user_id, kind, object_id, created_at)
    VALUES(actor, kind_name, NEW.id, moment);
  RETURN NEW;
END
$function$;
REVOKE ALL ON FUNCTION public.guard_community_insert() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS guard_submissions_insert ON public.submissions;
CREATE TRIGGER guard_submissions_insert BEFORE INSERT ON public.submissions
  FOR EACH ROW EXECUTE FUNCTION public.guard_community_insert();
DROP TRIGGER IF EXISTS guard_comments_insert ON public.comments;
CREATE TRIGGER guard_comments_insert BEFORE INSERT ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.guard_community_insert();

CREATE OR REPLACE FUNCTION public.guard_community_vote()
RETURNS trigger LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE
  caller_name text := COALESCE(NULLIF(NULLIF(pg_catalog.current_setting('role', true), 'none'), ''), session_user::text);
  trusted boolean := false;
  actor uuid := auth.uid();
BEGIN
  SELECT r.rolsuper OR r.rolbypassrls OR r.oid = c.relowner INTO trusted
    FROM pg_catalog.pg_roles r CROSS JOIN pg_catalog.pg_class c
    WHERE r.rolname = caller_name AND c.oid = TG_RELID;
  IF COALESCE(trusted, false) THEN RETURN NEW; END IF;
  IF actor IS NULL OR NEW.user_id IS DISTINCT FROM actor
    OR NOT EXISTS (SELECT 1 FROM auth.users WHERE id = actor) THEN
    RAISE EXCEPTION USING ERRCODE = '28000', MESSAGE = 'community_auth_required';
  END IF;
  IF TG_OP = 'UPDATE' AND (NEW.user_id IS DISTINCT FROM OLD.user_id OR NEW.target IS DISTINCT FROM OLD.target) THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'community_invalid';
  END IF;
  IF NEW.value IS NULL OR NEW.value NOT IN (-1, 1) OR NOT public.community_target_exists(NEW.target) THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'community_invalid';
  END IF;
  IF TG_OP = 'INSERT' THEN NEW.created_at := pg_catalog.clock_timestamp();
  ELSE NEW.created_at := OLD.created_at; END IF;
  RETURN NEW;
END
$function$;
REVOKE ALL ON FUNCTION public.guard_community_vote() FROM PUBLIC, anon, authenticated;
DROP TRIGGER IF EXISTS guard_votes_write ON public.votes;
CREATE TRIGGER guard_votes_write BEFORE INSERT OR UPDATE ON public.votes
  FOR EACH ROW EXECUTE FUNCTION public.guard_community_vote();

CREATE OR REPLACE FUNCTION public.submit_discovery(
  p_title text, p_body text, p_category text, p_place text DEFAULT NULL, p_video_url text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE actor uuid := auth.uid(); result_id uuid;
BEGIN
  IF actor IS NULL OR NOT EXISTS (SELECT 1 FROM auth.users WHERE id = actor) THEN
    RAISE EXCEPTION USING ERRCODE = '28000', MESSAGE = 'community_auth_required';
  END IF;
  INSERT INTO public.submissions(user_id, author_name, title, body, category, place, video_url)
    VALUES(actor, 'Player', p_title, p_body, p_category, p_place, p_video_url)
    RETURNING id INTO result_id;
  RETURN result_id;
END
$function$;
REVOKE ALL ON FUNCTION public.submit_discovery(text,text,text,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_discovery(text,text,text,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.add_comment(p_target text, p_body text)
RETURNS uuid LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE actor uuid := auth.uid(); result_id uuid;
BEGIN
  IF actor IS NULL OR NOT EXISTS (SELECT 1 FROM auth.users WHERE id = actor) THEN
    RAISE EXCEPTION USING ERRCODE = '28000', MESSAGE = 'community_auth_required';
  END IF;
  INSERT INTO public.comments(target, user_id, author_name, body)
    VALUES(p_target, actor, 'Player', p_body) RETURNING id INTO result_id;
  RETURN result_id;
END
$function$;
REVOKE ALL ON FUNCTION public.add_comment(text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.add_comment(text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.set_vote(p_target text, p_value integer)
RETURNS void LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE actor uuid := auth.uid();
BEGIN
  IF actor IS NULL OR NOT EXISTS (SELECT 1 FROM auth.users WHERE id = actor) THEN
    RAISE EXCEPTION USING ERRCODE = '28000', MESSAGE = 'community_auth_required';
  END IF;
  IF p_target IS NULL OR pg_catalog.char_length(p_target) > 256
    OR p_target !~ '^(item|sub):[A-Za-z0-9_-]+$'
    OR p_value IS NULL OR p_value NOT IN (-1, 0, 1) THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'community_invalid';
  END IF;
  IF p_value = 0 THEN
    DELETE FROM public.votes WHERE target = p_target AND user_id = actor;
    RETURN;
  END IF;
  INSERT INTO public.votes(target,user_id,value) VALUES(p_target,actor,p_value)
    ON CONFLICT(target,user_id) DO UPDATE SET value = EXCLUDED.value;
END
$function$;
REVOKE ALL ON FUNCTION public.set_vote(text,integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_vote(text,integer) TO authenticated;

-- The UI needs totals and the caller's own vote, not other members' vote histories.
DROP POLICY IF EXISTS "read votes" ON public.votes;
DROP POLICY IF EXISTS "read own votes" ON public.votes;
CREATE POLICY "read own votes" ON public.votes FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.prune_community_write_events()
RETURNS bigint LANGUAGE plpgsql VOLATILE SECURITY DEFINER SET search_path = '' AS $function$
DECLARE removed bigint;
BEGIN
  DELETE FROM public.community_write_events WHERE created_at < pg_catalog.clock_timestamp() - interval '48 hours';
  GET DIAGNOSTICS removed = ROW_COUNT;
  RETURN removed;
END
$function$;
REVOKE ALL ON FUNCTION public.prune_community_write_events() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prune_community_write_events() TO service_role;
COMMENT ON FUNCTION public.prune_community_write_events() IS
  'Trusted periodic housekeeping only; removes events older than 48h, retaining the full 24h quota window.';
COMMIT;
