-- PENDING: review and apply separately. Never auto-run from a site deployment.
-- Future profiles must explicitly opt in through Account; existing preferences are preserved.
BEGIN;
ALTER TABLE public.profiles ALTER COLUMN digest_opt_in SET DEFAULT false;
COMMIT;
