-- Leonida Hub database schema. Paste the whole file into Supabase → SQL Editor → Run.
-- Safe to re-run.

create extension if not exists pg_trgm;

-- ───────────────────────── items ─────────────────────────
create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null check (category in ('news','secrets','glitches','money','weapons','places','strange','characters','vehicles','tips')),
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
create policy "members read items" on public.items
  for select to authenticated using (true);
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
revoke execute on function public.search_items(text, int) from anon, public;
grant execute on function public.search_items(text, int) to authenticated;

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
