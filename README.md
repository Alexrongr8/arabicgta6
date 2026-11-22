# arabicgta6.com

Arabic-first, bilingual GTA 6 encyclopedia, deployed at https://arabicgta6.com.

- Next.js16 App Router + Tailwind4 on Vercel; the domain is registered through DreamHost.
- Supabase provides PostgreSQL and Google sign-in. Public articles, search, maps and catalogs are open to everyone; sign-in is for community participation and saved preferences.
- `data/seed/` supplies the unconfigured local preview. A configured backend is authoritative: errors are reported, never replaced with stale seed content.
- `/admin` is restricted to authenticated owners listed in the server-only `OWNER_EMAILS` setting.
- The research workflow is scheduled every3hours but stays **OFF** unless `CONTENT_AUTOMATION_ENABLED=true`. It rotates one topic, allows at most one new article and two paid API requests per run, and holds uncertain evidence for review. See [RADAR-POLICY.md](docs/RADAR-POLICY.md).
- The Friday email digest stays **OFF** unless both `DIGEST_ENABLED=true` and `DIGEST_DELIVERY_VERIFIED=true`; sending also requires valid delivery configuration and the permitted edition window.

Start locally with `npm ci` and `npm run dev`. Use `npm run typecheck` to generate Next route types before checking TypeScript. The quality workflow runs offline behavior tests, seed validation, lint, typecheck and a production build; it does not call paid AI or send emails.

Read [SETUP.md](SETUP.md) for environment boundaries and activation requirements. Review [pending SQL](supabase/pending/README.md) before any database rollout. Never commit credentials or paste them into chat. `npm run seed` writes to the configured database; it is not a harmless preview command.
