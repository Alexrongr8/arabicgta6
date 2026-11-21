# Proposed application mapping and phased rollout

Prepared migration files; no application action has been replaced and no hosted SQL has been applied. SQL is idempotent and transaction-wrapped. Root/Claude own integration.

## Exact RPC contracts

| Existing action | RPC | Arguments | Successful return |
| --- | --- | --- | --- |
| submitDiscovery(form) | public.submit_discovery | p_title text, p_body text, p_category text, p_place text default null, p_video_url text default null | UUID string |
| addComment(target,body,path) | public.add_comment | p_target text, p_body text | UUID string |
| vote(target,value,path) | public.set_vote | p_target text, p_value integer (-1/0/+1) | void/null |

Use the existing authenticated Supabase server client; never use service role for a member's community write. The trigger reads the original database role rather than SECURITY DEFINER current_user, stamps author/time/id, verifies target and enforces atomic quotas for both direct legacy inserts and new RPC calls.

`setDigest` remains an own-row update of `digest_opt_in`; its existing SQL shape is compatible with the new column grant. Check its returned error. `hideContent` remains a separately authenticated/owner-authorized service-role update of hidden=true; check errors and refresh the affected detail page. No public account-deletion feature is introduced.

Representative calls:

```ts
await supabase.rpc("submit_discovery", {
  p_title: title,
  p_body: body,
  p_category: category,
  p_place: place || null,
  p_video_url: video_url || null,
});
await supabase.rpc("add_comment", { p_target: target, p_body: body });
await supabase.rpc("set_vote", { p_target: target, p_value: value });
```

Keep user-facing format/length validation for fast feedback, but remove count-then-insert quota enforcement and client-supplied author fields from the RPC path. Read auth.getUser() in every action; the helper no longer needs to cast/split user_metadata.full_name. Validate runtime input types before trimming. Derive revalidation paths from validated targets rather than accepting an arbitrary cache path from the caller.

Error mapping for the existing Result shape:

- Missing authenticated user, SQLSTATE28000 → `auth`.
- SQLSTATE P0001 with exact message `community_limit` → `limit`.
- SQLSTATE22023 (`community_invalid`), or ordinary integrity/check errors in class23 → `invalid`.
- Missing RPC (42883), permission/configuration error42501 for a validated member, network/transport or other database error → `offline`; log a bounded code/message server-side, show no false success. Do not return raw SQL details to the visitor.
- For post/comment success require a nonempty returned UUID; vote's successful void/null is expected.

## Safe rollout order

1. Review `docs/operations/community-preflight.sql` output from the intended project. It emits aggregate counts and grants/object metadata only. No production access has been obtained by this reviewer. A service-role HTTP key alone is not a SQL migration channel.
2. Apply `supabase/pending/20261122_01_community_guards.sql` as the trusted schema owner. This immediately guards legacy direct inserts/vote upserts without changing their call shape. It also restricts profile UPDATE to the preference, repairs email mismatches from auth-owned email (preserving opt-outs), creates the immutable event ledger and adds RPCs.
3. Verify the functions/grants exist in that actual project. Deploy the RPC action mapping, preferably as a narrow explicit cutover. **Do not deploy RPC-only actions while PhaseA exists only in the repository.** Keep legacy actions until the actual database step is confirmed. Do not silently fall back from a quota/validation failure to an unrestricted write.
4. Once the RPC app is live and checked, apply `supabase/pending/20261122_02_community_rpc_only.sql` to revoke direct writes and old write policies. PhaseB before that app deployment would break the old write actions. Repeat PhaseA/PhaseB is safe; PhaseA does not restore previously revoked direct grants.
5. Schedule trusted `prune_community_write_events()` periodically using an already authorized operational channel. It retains48hours, while quota counts the preceding24hours. No new cron or hosted job has been activated. Until scheduled, old ledger events remain stored but stop counting automatically after24hours.

## Existing data and recovery

- PhaseA backfills recent existing submissions/comments once, including hidden rows; future timestamps are counted at migration time. It does not delete, rewrite or unhide existing content. Aggregate preflight flags legacy rows needing moderation/review; new-row guarantees are enforced independently.
- The ledger references the auth user, not the content row. Content deletion/hiding cannot reset the allowance; trusted auth-user deletion retains the existing lifecycle by cascading its quota history too.
- Profile grants remove both broad table UPDATE and old explicit column grants. Unexpected effective inherited UPDATE privileges cause a clear transaction failure rather than pretending to harden the profile. Resolve that explicit grant/membership issue before retrying.
- An RPC app rollback after PhaseB must first restore only the required legacy table privileges/policies while retaining PhaseA's guards. Reapplying an old unrestricted schema alone is not an acceptable security rollback.
- The vote read policy changes to own rows; public totals still come from existing vote_totals. Current UI only requests aggregate totals plus own vote, so this preserves its behavior and stops exposing individual vote histories.

## Isolated evidence and limitations

`results/hardening-v3.json`:151 checks passed, including five8-connection barrier races with eight distinct backend IDs each, exact quotas, old direct-write compatibility, RPC-only cutover, hidden/deleted/retention behavior, malformed/large metadata, legacy column grants, existing-row upgrade and repeat apply, preference/vote/admin operations and negative-role controls. `hardening/acceptance.py` reproduces the matrix using only `/tmp/gtavi-db-test`.

Tests use real PostgreSQL16.15, synthetic auth/JWT stubs, and documented Supabase-like default grants. They do not verify the actual hosted version/schema/grants, OAuth/JWT verifier, PostgREST schema cache/transport, browser error UI, or deployment sequencing. No real emails/accounts, paid model calls, or production writes occurred.
