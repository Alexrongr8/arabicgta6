-- READ ONLY. Run in the intended project's SQL editor before deciding on a migration.
-- Outputs object/privilege metadata and aggregate counts only: no emails, names, IDs or post bodies.
-- Do not add credentials, service keys or user content to the output.
BEGIN TRANSACTION READ ONLY;

SELECT c.relname AS table_name, c.relrowsecurity AS rls_enabled,
  c.relforcerowsecurity AS owner_also_subject_to_rls
FROM pg_catalog.pg_class c JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname IN
 ('items','profiles','submissions','comments','votes','page_views','update_runs','community_write_events')
ORDER BY c.relname;

SELECT r.rolname AS role_name, r.rolsuper AS superuser, r.rolbypassrls AS bypass_rls,
  (SELECT count(*) FROM pg_catalog.pg_auth_members m WHERE m.member=r.oid) AS inherited_role_memberships
FROM pg_catalog.pg_roles r WHERE r.rolname IN ('anon','authenticated','service_role') ORDER BY r.rolname;

SELECT table_name, grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_schema='public' AND table_name IN ('profiles','submissions','comments','votes','community_write_events')
  AND grantee IN ('PUBLIC','anon','authenticated','service_role')
ORDER BY table_name,grantee,privilege_type;

SELECT table_name,column_name,grantee,privilege_type
FROM information_schema.column_privileges
WHERE table_schema='public' AND table_name IN ('profiles','submissions','comments','votes')
  AND grantee IN ('PUBLIC','anon','authenticated') AND privilege_type IN ('INSERT','UPDATE')
ORDER BY table_name,column_name,grantee,privilege_type;

SELECT c.relname AS table_name,p.polcmd AS command,count(*) AS policy_count,
  count(*) FILTER (WHERE 0::oid=ANY(p.polroles)) AS policies_for_public
FROM pg_catalog.pg_policy p JOIN pg_catalog.pg_class c ON c.oid=p.polrelid
 JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
WHERE n.nspname='public' AND c.relname IN ('profiles','submissions','comments','votes','community_write_events')
GROUP BY c.relname,p.polcmd ORDER BY c.relname,p.polcmd;

SELECT p.proname AS function_name,pg_catalog.pg_get_function_identity_arguments(p.oid) AS signature,
 p.prosecdef AS security_definer,
 pg_catalog.has_function_privilege('anon',p.oid,'EXECUTE') AS anon_execute,
 pg_catalog.has_function_privilege('authenticated',p.oid,'EXECUTE') AS member_execute,
 pg_catalog.has_function_privilege('service_role',p.oid,'EXECUTE') AS service_execute
FROM pg_catalog.pg_proc p JOIN pg_catalog.pg_namespace n ON n.oid=p.pronamespace
WHERE n.nspname='public' AND p.proname IN
 ('submit_discovery','add_comment','set_vote','community_target_exists','guard_community_insert','guard_community_vote','prune_community_write_events','vote_totals','unsubscribe_digest')
ORDER BY p.proname,signature;

DO $counts$
DECLARE tab text; n bigint; counts jsonb := '{}'::jsonb;
BEGIN
  FOREACH tab IN ARRAY ARRAY['items','profiles','submissions','comments','votes','page_views','update_runs','community_write_events'] LOOP
    IF pg_catalog.to_regclass('public.'||tab) IS NULL THEN
      counts := counts || pg_catalog.jsonb_build_object(tab||'_table_missing',1);
    ELSE
      BEGIN
        EXECUTE pg_catalog.format('SELECT count(*) FROM public.%I',tab) INTO n;
        counts := counts || pg_catalog.jsonb_build_object(tab||'_rows',n);
      EXCEPTION WHEN insufficient_privilege THEN
        counts := counts || pg_catalog.jsonb_build_object(tab||'_count_unavailable',1);
      END;
    END IF;
  END LOOP;
  IF pg_catalog.to_regclass('public.profiles') IS NOT NULL AND pg_catalog.to_regclass('auth.users') IS NOT NULL THEN
    BEGIN
      SELECT count(*) INTO n FROM public.profiles p JOIN auth.users u ON u.id=p.id WHERE p.email IS DISTINCT FROM u.email;
      counts := counts || pg_catalog.jsonb_build_object('profile_email_differs_from_auth_count',n);
    EXCEPTION WHEN insufficient_privilege THEN
      counts := counts || pg_catalog.jsonb_build_object('profile_identity_comparison_unavailable',1);
    END;
  END IF;
  IF pg_catalog.to_regclass('public.submissions') IS NOT NULL THEN
    SELECT count(*) INTO n FROM public.submissions WHERE created_at>pg_catalog.now();
    counts := counts || pg_catalog.jsonb_build_object('future_submission_timestamp_count',n);
    SELECT count(*) INTO n FROM public.submissions WHERE
      author_name IS NULL OR pg_catalog.char_length(author_name)>80 OR pg_catalog.char_length(author_avatar)>2048
      OR pg_catalog.char_length(place)>120 OR pg_catalog.char_length(video_url)>300
      OR category NOT IN ('news','secrets','money','weapons','places','characters','vehicles','glitches','strange','choices','streamers','funny','tips')
      OR (video_url IS NOT NULL AND video_url !~* '^https://(www\.)?(youtube\.com|youtu\.be|tiktok\.com|instagram\.com|x\.com|twitter\.com|streamable\.com)/');
    counts := counts || pg_catalog.jsonb_build_object('legacy_submission_validation_review_count',n);
  END IF;
  IF pg_catalog.to_regclass('public.comments') IS NOT NULL THEN
    SELECT count(*) INTO n FROM public.comments WHERE created_at>pg_catalog.now();
    counts := counts || pg_catalog.jsonb_build_object('future_comment_timestamp_count',n);
    SELECT count(*) INTO n FROM public.comments WHERE body ~* '(https?://|www\.)'
      OR author_name IS NULL OR pg_catalog.char_length(author_name)>80 OR pg_catalog.char_length(author_avatar)>2048
      OR pg_catalog.char_length(target)>256;
    counts := counts || pg_catalog.jsonb_build_object('legacy_comment_validation_review_count',n);
  END IF;
  RAISE NOTICE 'GTAVI aggregate preflight: %',counts;
END
$counts$;
COMMIT;
