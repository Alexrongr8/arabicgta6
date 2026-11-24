-- Leonida Hub database schema. Paste the whole file into Supabase → SQL Editor → Run.
-- Safe to re-run.

create extension if not exists pg_trgm;

-- ───────────────────────── items ─────────────────────────
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null check (category in ('news','secrets','glitches','money','weapons','places','strange','funny','choices','streamers','characters','vehicles','tips')),
  status text not null default 'rumor' check (status in ('official','confirmed','leak','rumor')),
  title_en text not null,
  title_ar text not null,
  summary_en text not null default '',
  summary_ar text not null default '',
  body_en text not null default '',
  body_ar text not null default '',
  aliases text[] not null default '{}',
  tags text[] not null default '{}',
  facts jsonb not null default '[]',
  location jsonb,
  region text,
  related text[] not null default '{}',
  sources jsonb not null default '[]',
  featured boolean not null default false,
  image text,
  search_text text not null default '',
  origin text not null default 'seed', -- seed | auto
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists items_category_published_idx on public.items (category, published_at desc);
create index if not exists items_published_idx on public.items (published_at desc);
create index if not exists items_search_trgm_idx on public.items using gin (search_text gin_trgm_ops);

alter table public.items enable row level security;

drop policy if exists "members read items" on public.items;
drop policy if exists "everyone reads items" on public.items;
-- The site is open to everyone (sign-in is only for the weekly digest).
create policy "everyone reads items" on public.items
  for select to anon, authenticated using (true);
-- No insert/update/delete policies: only the service role (update scripts) writes.

-- Guests: the latest 10 news items, nothing else.
create or replace function public.guest_news()
returns setof public.items
language sql stable security definer set search_path = public as $$
  select * from public.items where category = 'news' order by published_at desc limit 10;
$$;

create or replace function public.guest_news_item(p_slug text)
returns setof public.items
language sql stable security definer set search_path = public as $$
  select * from public.guest_news() g where g.slug = p_slug;
$$;

-- Title-only teaser so guests see a sign-in gate (not a 404) for members-only pages.
create or replace function public.item_teaser(p_slug text)
returns table (title_en text, title_ar text, category text)
language sql stable security definer set search_path = public as $$
  select title_en, title_ar, category from public.items where slug = p_slug;
$$;

create or replace function public.category_counts()
returns table (category text, n bigint)
language sql stable security definer set search_path = public as $$
  select category, count(*) from public.items group by category;
$$;

-- Search (members only: runs with the caller's rights, so RLS applies).
-- q must already be normalised by the app (see src/lib/normalize.ts).
create or replace function public.search_items(q text, max_results int default 40)
returns setof public.items
language sql stable security invoker set search_path = public as $$
  with terms as (select unnest(string_to_array(q, ' ')) t)
  select i.* from public.items i
  where not exists (select 1 from terms where i.search_text not like '%' || t || '%')
  order by
    (position(q in i.search_text) between 1 and 120) desc,
    similarity(i.search_text, q) desc,
    i.published_at desc
  limit max_results;
$$;

-- Tip-of-the-visit popup (titles + summaries of tips only), for everyone.
create or replace function public.tip_cards()
returns table (slug text, title_en text, title_ar text, summary_en text, summary_ar text)
language sql stable security definer set search_path = public as $$
  select slug, title_en, title_ar, summary_en, summary_ar from public.items where category = 'tips' order by published_at desc limit 200;
$$;
grant execute on function public.tip_cards() to anon, authenticated;

grant execute on function public.guest_news() to anon, authenticated;
grant execute on function public.guest_news_item(text) to anon, authenticated;
grant execute on function public.item_teaser(text) to anon, authenticated;
grant execute on function public.category_counts() to anon, authenticated;
grant execute on function public.search_items(text, int) to anon, authenticated;

-- ───────────────────────── profiles ─────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  digest_opt_in boolean not null default true,
  unsubscribe_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "read own profile" on public.profiles;
create policy "read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "update own profile" on public.profiles;
create policy "update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- One-click unsubscribe from the email link (no sign-in needed).
create or replace function public.unsubscribe_digest(p_token uuid)
returns boolean language plpgsql security definer set search_path = public as $$
declare n int;
begin
  update public.profiles set digest_opt_in = false where unsubscribe_token = p_token;
  get diagnostics n = row_count;
  return n > 0;
end;
$$;
grant execute on function public.unsubscribe_digest(uuid) to anon, authenticated;

-- ───────────────────────── update log ─────────────────────────
create table if not exists public.update_runs (
  id bigint generated always as identity primary key,
  kind text not null, -- update | digest | seed
  ran_at timestamptz not null default now(),
  added int not null default 0,
  note text
);
alter table public.update_runs enable row level security;

alter table public.items add column if not exists image text;
alter table public.items add column if not exists spots jsonb not null default '[]';
alter table public.items add column if not exists videos text[] not null default '{}';

-- category list grew over time: refresh the check constraint
alter table public.items drop constraint if exists items_category_check;
alter table public.items add constraint items_category_check check (category in ('news','secrets','glitches','money','weapons','places','strange','funny','choices','streamers','characters','vehicles','tips'));

-- ───────────────────────── owner analytics ─────────────────────────
-- Sign-in details on profiles (written by the server with the service role on each sign-in).
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists last_sign_in_at timestamptz;
alter table public.profiles add column if not exists sign_in_count int not null default 0;
alter table public.profiles add column if not exists country text;
alter table public.profiles add column if not exists region text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists device text;

-- Page views (anonymous + signed-in). Only the service role can read/write.
create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  path text not null,
  user_id uuid references auth.users (id) on delete set null,
  country text,
  city text,
  referrer text,
  device text,
  created_at timestamptz not null default now()
);
create index if not exists page_views_created_idx on public.page_views (created_at desc);
alter table public.page_views enable row level security;

-- Richer visitor analytics (anonymous visitors included)
alter table public.page_views add column if not exists visitor_id text;
alter table public.page_views add column if not exists region text;
alter table public.page_views add column if not exists os text;
alter table public.page_views add column if not exists browser text;
alter table public.page_views add column if not exists device_type text;
alter table public.page_views add column if not exists source text;
alter table public.page_views add column if not exists utm_campaign text;
alter table public.page_views add column if not exists lang text;
create index if not exists page_views_visitor_idx on public.page_views (visitor_id, created_at desc);

-- ───────────────────────── community ─────────────────────────
-- Player submissions (discoveries, glitches, funny moments), comments and votes.
-- Reading is public; writing needs Google sign-in; the owner can hide anything from /admin.
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  author_avatar text,
  category text not null default 'secrets',
  title text not null check (char_length(title) between 5 and 140),
  body text not null check (char_length(body) between 20 and 4000),
  place text,
  video_url text,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists submissions_created_idx on public.submissions (created_at desc);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  target text not null, -- 'item:<slug>' or 'sub:<uuid>'
  user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  author_avatar text,
  body text not null check (char_length(body) between 2 and 1500),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists comments_target_idx on public.comments (target, created_at);

create table if not exists public.votes (
  target text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  value smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (target, user_id)
);

alter table public.submissions enable row level security;
alter table public.comments enable row level security;
alter table public.votes enable row level security;

drop policy if exists "read visible submissions" on public.submissions;
create policy "read visible submissions" on public.submissions for select to anon, authenticated using (not hidden);
drop policy if exists "insert own submissions" on public.submissions;
create policy "insert own submissions" on public.submissions for insert to authenticated with check (auth.uid() = user_id and not hidden);
drop policy if exists "delete own submissions" on public.submissions;
create policy "delete own submissions" on public.submissions for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "read visible comments" on public.comments;
create policy "read visible comments" on public.comments for select to anon, authenticated using (not hidden);
drop policy if exists "insert own comments" on public.comments;
create policy "insert own comments" on public.comments for insert to authenticated with check (auth.uid() = user_id and not hidden);
drop policy if exists "delete own comments" on public.comments;
create policy "delete own comments" on public.comments for delete to authenticated using (auth.uid() = user_id);

drop policy if exists "read votes" on public.votes;
create policy "read votes" on public.votes for select to anon, authenticated using (true);
drop policy if exists "upsert own votes" on public.votes;
create policy "upsert own votes" on public.votes for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "update own votes" on public.votes;
create policy "update own votes" on public.votes for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "delete own votes" on public.votes;
create policy "delete own votes" on public.votes for delete to authenticated using (auth.uid() = user_id);

create or replace function public.vote_totals(p_targets text[])
returns table (target text, up bigint, down bigint)
language sql stable security definer set search_path = public as $$
  select target, count(*) filter (where value = 1), count(*) filter (where value = -1)
  from public.votes where target = any(p_targets) group by target;
$$;
grant execute on function public.vote_totals(text[]) to anon, authenticated;

-- ───────────────────────── GTA 6 Shorts (applied 2026-11-22) ─────────────────────────
-- Filled hourly by scripts/shorts.ts with the service role; public read of visible rows only.
create table if not exists public.shorts (
  video_id text primary key check (video_id ~ '^[A-Za-z0-9_-]{11}$'),
  title text not null check (char_length(title) between 1 and 300),
  channel text check (char_length(channel) <= 120),
  source text not null default 'search' check (source in ('search','hashtag','channel')),
  added_at timestamptz not null default now(),
  hidden boolean not null default false
);
create index if not exists shorts_added_idx on public.shorts (added_at desc) where not hidden;
alter table public.shorts enable row level security;
revoke all on public.shorts from anon, authenticated;
grant select on public.shorts to anon, authenticated;
drop policy if exists "public shorts" on public.shorts;
create policy "public shorts" on public.shorts for select to anon, authenticated using (not hidden);

-- ───────────────────────── Hourly radar trigger (applied 2026-11-24) ─────────────────────────
-- GitHub's own cron is best-effort (fired 5 of 48 hours on 22-24 Nov). pg_cron dispatches the
-- workflow instead. The owner stored a fine-grained token (Actions read/write, arabicgta6 only)
-- in Supabase Vault as github_dispatch_token; it never appears in this repository.
create extension if not exists pg_cron;
create extension if not exists pg_net;
create or replace function public.dispatch_radar() returns bigint
language plpgsql security definer set search_path = '' as $fn$
declare tok text; rid bigint;
begin
  select decrypted_secret into tok from vault.decrypted_secrets where name = 'github_dispatch_token' limit 1;
  if tok is null then raise exception 'github_dispatch_token missing from Vault'; end if;
  select net.http_post(
    url := 'https://api.github.com/repos/Alexrongr8/arabicgta6/actions/workflows/update.yml/dispatches',
    body := '{"ref":"main"}'::jsonb,
    headers := jsonb_build_object('Authorization', 'Bearer ' || tok, 'Accept', 'application/vnd.github+json',
      'X-GitHub-Api-Version', '2022-11-28', 'User-Agent', 'arabicgta6-cron', 'Content-Type', 'application/json')
  ) into rid;
  return rid;
end $fn$;
revoke all on function public.dispatch_radar() from public, anon, authenticated;
-- 04-23 UTC = 07:00-02:00 Riyadh. Check deliveries: select status_code from net._http_response order by id desc;
select cron.schedule('radar-hourly', '5 4-23 * * *', 'select public.dispatch_radar()');
