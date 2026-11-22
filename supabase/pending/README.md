# Pending database changes

These files are deliberately outside the automatic migrations directory. They have passed isolated PostgreSQL tests, but have **not** been applied to the hosted project.

Read [the rollout plan](../../docs/operations/community-rollout.md). Run its read-only preflight against the intended project first. Apply phase A, verify it there, deploy the application RPC cutover, and only then apply phase B. Applying phase B before the application cutover breaks community writes. Do not apply this directory wholesale.

The separate `20261122_03_digest_future_opt_in.sql` changes only the default for future profile newsletter preferences. Existing preferences remain unchanged and need recipient/consent review before delivery is enabled. It is independent of the community phase B cutover; see [SETUP.md](../../SETUP.md).

No private credentials or production data are included.
