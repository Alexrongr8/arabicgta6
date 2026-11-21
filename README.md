# arabicgta6.com

Arabic-first GTA 6 encyclopedia: news, secrets, glitches, money methods, rare weapons, places, characters, vehicles, tips, an interactive Leonida map and Wikipedia-style search.

- Next.js 16 (App Router) + Tailwind v4, deployed on Vercel
- Supabase: Postgres + Google sign-in. Guests see the latest 10 news items; everything else requires sign-in (RLS-enforced)
- `scripts/update.ts`: OpenAI web search → classify, summarise, translate → publish (GitHub Actions, every 6h)
- `scripts/digest.ts`: weekly email via Resend (GitHub Actions, Fridays)
- `data/seed/`: the initial bilingual encyclopedia (`npm run seed` uploads it)
- `/admin`: owner-only dashboard (members, locations, visits), gated by `OWNER_EMAILS`

Without Supabase env vars the app runs in preview mode from the seed data. Setup guide (Arabic): [SETUP.md](SETUP.md).
