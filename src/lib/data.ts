import "server-only";
import { cache } from "react";
import type { CategorySlug, Item, ItemCard } from "./types";
import { createClient, supabaseConfigured } from "./supabase/server";
import { normalize, searchTerms, searchText } from "./normalize";
import { SEED } from "./seed";
import { adminClient, adminConfigured } from "./admin";
import { isSpoiler } from "./spoiler";
import { publicRead, publicReadSignal } from "./public-read";

/**
 * Public content is open to everyone. With Supabase configured, its RLS-backed
 * responses are authoritative; failures must not become empty results or seed content.
 * Seed data is used only in the unconfigured preview. Legacy guest RPC helpers remain
 * for compatibility; the current viewer grants public content access.
 */

export const GUEST_NEWS_LIMIT = 10;
const CARD_COLS =
  "slug,category,status,title_en,title_ar,summary_en,summary_ar,published_at,region,location,featured,image,tags";

function toCard(i: Item): ItemCard {
  return {
    slug: i.slug,
    category: i.category,
    status: i.status,
    title_en: i.title_en,
    title_ar: i.title_ar,
    summary_en: i.summary_en,
    summary_ar: i.summary_ar,
    published_at: i.published_at,
    region: i.region,
    location: i.location,
    featured: i.featured,
    image: i.image ?? null,
    spots: i.spots ?? [],
    tags: i.tags ?? [],
  };
}

const byDate = (a: { published_at: string }, b: { published_at: string }) =>
  b.published_at.localeCompare(a.published_at);

export const getGuestNews = cache(async (): Promise<ItemCard[]> => {
  if (!supabaseConfigured()) {
    return SEED.filter((i) => i.category === "news").sort(byDate).slice(0, GUEST_NEWS_LIMIT).map(toCard);
  }
  // Legacy public-news helper: keep successful results for 60s per server instance.
  if (guestCache && guestCache.at > Date.now() - 60_000) return guestCache.data;
  const supabase = await createClient();
  const data = await publicRead<ItemCard[]>("guest news", supabase.rpc("guest_news"));
  guestCache = { at: Date.now(), data: (data ?? []) as ItemCard[] };
  return guestCache.data;
});
let guestCache: { at: number; data: ItemCard[] } | null = null;

export async function getLatest(limit = 12, category?: CategorySlug): Promise<ItemCard[]> {
  if (!supabaseConfigured()) {
    return SEED.filter((i) => !category || i.category === category)
      .sort(byDate)
      .slice(0, limit)
      .map(toCard);
  }
  const supabase = await createClient();
  let q = supabase.from("items").select(CARD_COLS).order("published_at", { ascending: false }).limit(limit);
  if (category) q = q.eq("category", category);
  const data = await publicRead<ItemCard[]>("latest items", q);
  return (data ?? []) as ItemCard[];
}

export async function getCategory(category: CategorySlug): Promise<ItemCard[]> {
  return getLatest(500, category);
}

/**
 * "Don't miss" row: the most-read articles of the last 3 days (from our own page-view log),
 * topped up with editor-flagged and the newest items. Changes on its own as people read.
 */
/** Most-read article slugs in the last 3 days (distinct visitors), cached 10 min per server instance. */
let popularCache: { at: number; slugs: string[] } | null = null;
async function popularSlugs(): Promise<string[]> {
  if (popularCache && popularCache.at > Date.now() - 10 * 60_000) return popularCache.slugs;
  if (!adminConfigured()) return [];
  try {
    const since = new Date(Date.now() - 3 * 864e5).toISOString();
    const views = await publicRead<{ path: string; visitor_id: string | null }[]>("popular analytics", adminClient()
      .from("page_views")
      .select("path,visitor_id")
      .like("path", "/item/%")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1000), publicReadSignal(1500));
    const visitors = new Map<string, Set<string>>();
    for (const v of views ?? []) {
      const slug = String(v.path).slice(6).split(/[?#/]/)[0];
      if (!slug) continue;
      if (!visitors.has(slug)) visitors.set(slug, new Set());
      visitors.get(slug)!.add(String(v.visitor_id ?? "anon"));
    }
    const slugs = [...visitors.entries()].sort((a, b) => b[1].size - a[1].size).slice(0, 8).map(([slug]) => slug);
    popularCache = { at: Date.now(), slugs };
    return slugs;
  } catch {
    // Analytics only affects ordering. Live editorial/latest reads remain required.
    return [];
  }
}

/**
 * "Don't miss" row: most-read articles of the last 3 days, then the newest, then editor picks.
 * Story-spoiler articles are never promoted here.
 */
export async function getFeatured(): Promise<ItemCard[]> {
  if (!supabaseConfigured()) {
    return SEED.filter((i) => i.featured && !isSpoiler(i)).sort(byDate).slice(0, 10).map(toCard);
  }
  const supabase = await createClient();
  const signal = publicReadSignal();
  const popular = await popularSlugs();
  const [pop, flagged, fresh] = await Promise.all([
    popular.length
      ? publicRead<ItemCard[]>("popular items", supabase.from("items").select(CARD_COLS).in("slug", popular), signal).catch(() => [])
      : Promise.resolve([]),
    publicRead<ItemCard[]>("featured items", supabase.from("items").select(CARD_COLS).eq("featured", true).order("published_at", { ascending: false }).limit(8), signal),
    publicRead<ItemCard[]>("fresh items", supabase.from("items").select(CARD_COLS).order("published_at", { ascending: false }).limit(6), signal),
  ]);
  const ordered = [...((pop ?? []) as ItemCard[]).sort((a, b) => popular.indexOf(a.slug) - popular.indexOf(b.slug)), ...((fresh ?? []) as ItemCard[]), ...((flagged ?? []) as ItemCard[])];
  const seen = new Set<string>();
  return ordered.filter((i) => !isSpoiler(i) && !seen.has(i.slug) && seen.add(i.slug)).slice(0, 10);
}

export async function getCounts(): Promise<Record<string, number>> {
  if (!supabaseConfigured()) {
    const out: Record<string, number> = {};
    for (const i of SEED) out[i.category] = (out[i.category] ?? 0) + 1;
    return out;
  }
  const supabase = await createClient();
  const data = await publicRead<{ category: string; n: number }[]>("category counts", supabase.rpc("category_counts"));
  const out: Record<string, number> = {};
  for (const r of (data ?? []) as { category: string; n: number }[]) out[r.category] = Number(r.n);
  return out;
}

/** Full public item. The legacy guest RPC branch remains for older callers. */
export const getItem = cache(async (slug: string, member: boolean): Promise<Item | null> => {
  if (!supabaseConfigured()) return SEED.find((i) => i.slug === slug) ?? null;
  const supabase = await createClient();
  if (!member) {
    const data = await publicRead<Item | Item[]>("legacy guest item", supabase.rpc("guest_news_item", { p_slug: slug }));
    const row = Array.isArray(data) ? data[0] : data;
    return (row as Item) ?? null;
  }
  const data = await publicRead<Item>("item", (signal) => supabase.from("items").select("*").eq("slug", slug).abortSignal(signal).maybeSingle());
  return (data as Item) ?? null;
});

/** Legacy teaser lookup; a backend failure is never evidence that an item is absent. */
export async function itemExists(slug: string): Promise<{ title_en: string; title_ar: string; category: CategorySlug } | null> {
  if (!supabaseConfigured()) {
    const i = SEED.find((x) => x.slug === slug);
    return i ? { title_en: i.title_en, title_ar: i.title_ar, category: i.category } : null;
  }
  const supabase = await createClient();
  type Teaser = Pick<Item, "title_en" | "title_ar" | "category">;
  const data = await publicRead<Teaser | Teaser[]>("item teaser", supabase.rpc("item_teaser", { p_slug: slug }));
  const row = Array.isArray(data) ? data[0] : data;
  return row ?? null;
}

export async function getBySlugs(slugs: string[]): Promise<ItemCard[]> {
  if (!slugs.length) return [];
  const order = (a: { slug: string }, b: { slug: string }) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug);
  if (!supabaseConfigured()) return SEED.filter((i) => slugs.includes(i.slug)).map(toCard).sort(order);
  const supabase = await createClient();
  const data = await publicRead<ItemCard[]>("related items", supabase.from("items").select(CARD_COLS).in("slug", slugs));
  return ((data ?? []) as ItemCard[]).sort(order); // keep the curated order
}

export async function getMapItems(): Promise<ItemCard[]> {
  if (!supabaseConfigured()) return SEED.filter((i) => i.location || i.spots?.length).map(toCard);
  const supabase = await createClient();
  const data = await publicRead<ItemCard[]>("map items", supabase.from("items").select(`${CARD_COLS},spots`).or("location.not.is.null,spots.neq.[]").limit(3000));
  return (data ?? []) as ItemCard[];
}

/**
 * Natural Arabic/English search. Game-name words, question words and Arabic digits are normalised
 * away; every remaining term must match first (exact behaviour), and if that finds nothing the
 * results that match the most terms are returned instead.
 */
export async function search(q: string, limit = 40): Promise<ItemCard[]> {
  if (!normalize(q)) return [];
  const terms = searchTerms(q);
  if (!terms.length) return getLatest(Math.min(limit, 12)); // e.g. just "قراند" → newest articles
  if (!supabaseConfigured()) return localSearch(SEED, terms, limit).map(toCard);
  const supabase = await createClient();
  const signal = publicReadSignal();
  const data = await publicRead<Item[]>("search", supabase.rpc("search_items", { q: terms.join(" "), max_results: limit }), signal);
  // search_items returns whole rows (with bodies); send only card fields to the browser
  if ((data ?? []).length || terms.length === 1) return ((data ?? []) as Item[]).map(toCard);
  // Partial match, only on substantive words (3+ letters, so "s" or a lone model number can't
  // match half the site), and an article must contain at least half of them.
  const strong = partialTerms(terms);
  if (!strong.length) return [];
  const need = Math.ceil(strong.length / 2);
  const per = await Promise.all(strong.map((t) => publicRead<Item[]>("partial search", supabase.rpc("search_items", { q: t, max_results: limit }), signal)));
  const score = new Map<string, { card: ItemCard; n: number; best: number }>();
  per.forEach((rows, ti) =>
    ((rows ?? []) as Item[]).map(toCard).forEach((r, pos) => {
      const cur = score.get(r.slug) ?? { card: r, n: 0, best: 1e9 };
      cur.n += 1;
      cur.best = Math.min(cur.best, ti * 1000 + pos);
      score.set(r.slug, cur);
    }),
  );
  return [...score.values()].filter((x) => x.n >= need).sort((a, b) => b.n - a.n || a.best - b.best).slice(0, limit).map((x) => x.card);
}

const partialTerms = (terms: string[]) => terms.filter((t) => t.length >= 3).slice(0, 5);

function localSearch(items: Item[], terms: string[], limit: number): Item[] {
  const nq = terms.join(" ");
  const scored: { i: Item; s: number; n: number }[] = [];
  for (const i of items) {
    const hay = searchText(i);
    const n = terms.filter((t) => hay.includes(t)).length;
    if (!n) continue;
    const titles = normalize(`${i.title_en} ${i.title_ar} ${i.aliases.join(" ")}`);
    let s = n === terms.length ? 100 : 0;
    if (titles.includes(nq)) s += 10;
    if (normalize(i.title_en) === nq || normalize(i.title_ar) === nq) s += 20;
    if (titles.startsWith(nq)) s += 5;
    scored.push({ i, s, n });
  }
  const full = scored.filter((x) => x.n === terms.length);
  const strong = partialTerms(terms);
  const pool = full.length
    ? full
    : scored.filter((x) => {
        const hay = searchText(x.i);
        return strong.length > 0 && strong.filter((t) => hay.includes(t)).length >= Math.ceil(strong.length / 2);
      });
  return pool.sort((a, b) => b.n - a.n || b.s - a.s || byDate(a.i, b.i)).slice(0, limit).map((x) => x.i);
}

export type TipCard = Pick<Item, "slug" | "category" | "status" | "tags" | "title_en" | "title_ar" | "summary_en" | "summary_ar">;

export const getTipCards = cache(async (): Promise<TipCard[]> => {
  const visible = (i: TipCard) => i.category === "tips"
    && (i.tags == null || (Array.isArray(i.tags) && i.tags.every((tag) => typeof tag === "string")))
    && !isSpoiler(i);
  if (!supabaseConfigured()) {
    return SEED.filter(visible).sort(byDate).slice(0, 200)
      .map(({ slug, category, status, tags, title_en, title_ar, summary_en, summary_ar }) => ({ slug, category, status, tags, title_en, title_ar, summary_en, summary_ar }));
  }
  const supabase = await createClient();
  const data = await publicRead<TipCard[]>("tip cards", supabase.from("items")
    .select("slug,category,status,tags,title_en,title_ar,summary_en,summary_ar")
    .eq("category", "tips")
    .order("published_at", { ascending: false })
    .order("slug", { ascending: true })
    .limit(200));
  return ((data ?? []) as TipCard[]).filter(visible);
});

/** Pool for "Secret of the day": secrets, strange things, tips and funny moments. */
export async function getDailyPool(): Promise<ItemCard[]> {
  const cats: CategorySlug[] = ["secrets", "strange", "tips", "funny"];
  if (!supabaseConfigured()) return SEED.filter((i) => cats.includes(i.category) && !isSpoiler(i)).sort((a, b) => a.slug.localeCompare(b.slug)).map(toCard);
  const supabase = await createClient();
  const data = await publicRead<ItemCard[]>("daily pool", supabase.from("items").select(CARD_COLS).in("category", cats).order("slug").limit(1000));
  return ((data ?? []) as ItemCard[]).filter((i) => !isSpoiler(i));
}

export type Short = { video_id: string; title: string; channel: string | null };

/** Latest GTA 6 YouTube Shorts (filled by scripts/shorts.ts). Empty in the unconfigured preview. */
export async function getShorts(limit = 30): Promise<Short[]> {
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  const data = await publicRead<Short[]>("shorts", supabase.from("shorts").select("video_id,title,channel").order("added_at", { ascending: false }).limit(Math.min(Math.max(limit, 1), 100)));
  return (data ?? []).filter((s) => /^[A-Za-z0-9_-]{11}$/.test(s.video_id));
}
