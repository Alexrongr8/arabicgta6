# Pending database changes

These files are deliberately outside the automatic migrations directory. They have passed isolated PostgreSQL tests, but have **not** been applied to the hosted project.

Read [the rollout plan](../../docs/operations/community-rollout.md). Run its read-only preflight against the intended project first. Apply phase A, verify it there, deploy the application RPC cutover, and only then apply phase B. Applying phase B before the application cutover breaks community writes. Do not apply this directory wholesale.

No private credentials or production data are included.
