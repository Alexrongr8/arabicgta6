<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Two AI assistants work on this repo (Claude + ChatGPT) — read this first

The owner (Alexron) has both Claude and ChatGPT working on arabicgta6.com. To avoid overwriting each other:

## 1. Take the lock before editing any file
- Lock file: `.collab/LOCK` (git-ignored, local to this machine).
- Before changing files: run `cat .collab/LOCK`.
  - If it names the other assistant and its time is less than 45 minutes old → **do not edit**. Wait, or work only on things outside the repo (dashboards, research).
  - Otherwise write your own lock: `mkdir -p .collab && echo "chatgpt $(date -Iseconds) <what you are doing>" > .collab/LOCK` (or `claude ...`).
- When done: commit, push, then release with `rm .collab/LOCK`.
- Never leave uncommitted changes behind when you release the lock — the other assistant starts from a clean `git status`.

## 2. Before every push
- `git pull --rebase` first (the other assistant may have pushed).
- `npx tsc --noEmit && npx next build` must pass. Pushing to `main` deploys the live site (Vercel → https://arabicgta6.com).
- Small commits with clear messages. Never commit `.env*`, keys or tokens.
- Append one line to `.collab/LOG.md` (committed): date, who, what changed.

## 3. Owner decisions — do not change without the owner asking
- Logo (owner decision 22 Nov 2026, replaces the earlier "flag under A6"): the Saudi flag sits inline **before** the logo icon and "ARABIC GTA6" wordmark, never underneath or overlapping, 3:2 ratio (`public/img/flag-sa-3x2.svg`). On very narrow phones (<360px) the round icon hides so the header fits (see `src/components/Logo.tsx`, `Header.tsx`).
- Light theme is the default; dark mode via the toggle in the header.
- Footer: "Developed by PROTEC-SA" (protec-sa.com) + Saudi flag + "صُنع بحب في السعودية". No "unofficial fan site" disclaimer in the footer.
- The whole site is open to everyone; Google sign-in is only for the weekly email digest, comments, votes and submissions.
- Arabic first (Gulf, friendly tone); in-game names (places, weapons, cars, characters) stay in English.
- Every card and article must show an image (source image, or the category's official Rockstar fallback in `src/lib/image.ts`). Catalog items without a picture show "📷 تتوفر الصورة قريباً".
- Map = Rockstar's official Leonida poster (`public/map/leonida-official*.webp`); pins are pixel coordinates on it (`data/seed/locations.ts`).
- Status badges must stay honest: official / confirmed (in-game) / leak / rumor. Never present unverified info as confirmed.

## 4. Who usually does what (to minimise overlap)
- **Claude**: infrastructure and accounts (Vercel, Supabase, DNS/DreamHost, Google OAuth, Resend, GitHub Actions secrets), database schema (`supabase/schema.sql`), auth, analytics/admin, the radar scripts (`scripts/`), layout/components.
- **ChatGPT**: content — articles in `data/seed/*.ts`, catalog data and images (`data/catalog-*.ts`, `data/catalog-images.json`), copy/translation fixes.
- Anything else: take the lock and note it in `.collab/LOG.md`.
