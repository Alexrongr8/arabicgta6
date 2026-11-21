import "server-only";
import { cache } from "react";
import type { CategorySlug, Item, ItemCard } from "./types";
import { createClient, supabaseConfigured } from "./supabase/server";
import { normalize, searchTerms, searchText } from "./normalize";
import { SEED } from "./seed";
import { adminClient, adminConfigured } from "./admin";
import { isSpoiler } from "./spoiler";

/**
 * Data access layer. With Supabase configured, reads go through RLS:
 * guests can only reach the latest 10 news items via security-definer RPCs,
 * signed-in users can read everything. Without Supabase, seed data is used.
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
  // Guests are the bulk of ad-campaign traffic: keep the public news list in memory for 60s per server instance.
  if (guestCache && guestCache.at > Date.now() - 60_000) return guestCache.data;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("guest_news");
  if (error) throw error;
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
  const { data, error } = await q;
  if (error) throw error;
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
  const since = new Date(Date.now() - 3 * 864e5).toISOString();
  const { data: views } = await adminClient()
    .from("page_views")
    .select("path,visitor_id")
    .like("path", "/item/%")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(1000);
  const visitors = new Map<string, Set<string>>();
  for (const v of views ?? []) {
    const slug = String(v.path).slice(6).split(/[?#/]/)[0];
    if (!slug) continue;
    // one vote per visitor: repeated beacons from the same id can't inflate a slug
    if (!visitors.has(slug)) visitors.set(slug, new Set());
    visitors.get(slug)!.add(String(v.visitor_id ?? "anon"));
  }
  const slugs = [...visitors.entries()].sort((a, b) => b[1].size - a[1].size).slice(0, 8).map(([slug]) => slug);
  popularCache = { at: Date.now(), slugs };
  return slugs;
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
  const popular = await popularSlugs();
  const [{ data: pop }, { data: flagged }, { data: fresh }] = await Promise.all([
    popular.length ? supabase.from("items").select(CARD_COLS).in("slug", popular) : Promise.resolve({ data: [] }),
    supabase.from("items").select(CARD_COLS).eq("featured", true).order("published_at", { ascending: false }).limit(8),
    supabase.from("items").select(CARD_COLS).order("published_at", { ascending: false }).limit(6),
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
  const { data } = await supabase.rpc("category_counts");
  const out: Record<string, number> = {};
  for (const r of (data ?? []) as { category: string; n: number }[]) out[r.category] = Number(r.n);
  return out;
}

/** Full item. Members get any item; guests only one of the latest 10 news items. */
export async function getItem(slug: string, member: boolean): Promise<Item | null> {
  if (!supabaseConfigured()) return SEED.find((i) => i.slug === slug) ?? null;
  const supabase = await createClient();
  if (!member) {
    const { data } = await supabase.rpc("guest_news_item", { p_slug: slug });
    const row = Array.isArray(data) ? data[0] : data;
    return (row as Item) ?? null;
  }
  const { data } = await supabase.from("items").select("*").eq("slug", slug).maybeSingle();
  return (data as Item) ?? null;
}

/** Whether an item exists at all (used to show the sign-in gate instead of a 404 for guests). */
export async function itemExists(slug: string): Promise<{ title_en: string; title_ar: string; category: CategorySlug } | null> {
  if (!supabaseConfigured()) {
    const i = SEED.find((x) => x.slug === slug);
    return i ? { title_en: i.title_en, title_ar: i.title_ar, category: i.category } : null;
  }
  const supabase = await createClient();
  const { data } = await supabase.rpc("item_teaser", { p_slug: slug });
  const row = Array.isArray(data) ? data[0] : data;
  return row ?? null;
}

export async function getBySlugs(slugs: string[]): Promise<ItemCard[]> {
  if (!slugs.length) return [];
  const order = (a: { slug: string }, b: { slug: string }) => slugs.indexOf(a.slug) - slugs.indexOf(b.slug);
  if (!supabaseConfigured()) return SEED.filter((i) => slugs.includes(i.slug)).map(toCard).sort(order);
  const supabase = await createClient();
  const { data } = await supabase.from("items").select(CARD_COLS).in("slug", slugs);
  return ((data ?? []) as ItemCard[]).sort(order); // keep the curated order
}

export async function getMapItems(): Promise<ItemCard[]> {
  if (!supabaseConfigured()) return SEED.filter((i) => i.location || i.spots?.length).map(toCard);
  const supabase = await createClient();
  const { data } = await supabase.from("items").select(`${CARD_COLS},spots`).or("location.not.is.null,spots.neq.[]").limit(3000);
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
  const { data, error } = await supabase.rpc("search_items", { q: terms.join(" "), max_results: limit });
  if (error) throw error;
  // search_items returns whole rows (with bodies); send only card fields to the browser
  if ((data ?? []).length || terms.length === 1) return ((data ?? []) as Item[]).map(toCard);
  // Partial match, only on substantive words (3+ letters, so "s" or a lone model number can't
  // match half the site), and an article must contain at least half of them.
  const strong = partialTerms(terms);
  if (!strong.length) return [];
  const need = Math.ceil(strong.length / 2);
  const per = await Promise.all(strong.map((t) => supabase.rpc("search_items", { q: t, max_results: limit })));
  const score = new Map<string, { card: ItemCard; n: number; best: number }>();
  per.forEach(({ data: rows }, ti) =>
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
  const { data, error } = await supabase.from("items")
    .select("slug,category,status,tags,title_en,title_ar,summary_en,summary_ar")
    .eq("category", "tips")
    .order("published_at", { ascending: false })
    .order("slug", { ascending: true })
    .limit(200)
    .abortSignal(AbortSignal.timeout(4000));
  if (error) throw error;
  return ((data ?? []) as TipCard[]).filter(visible);
});

/** Pool for "Secret of the day": secrets, strange things, tips and funny moments. */
export async function getDailyPool(): Promise<ItemCard[]> {
  const cats: CategorySlug[] = ["secrets", "strange", "tips", "funny"];
  if (!supabaseConfigured()) return SEED.filter((i) => cats.includes(i.category) && !isSpoiler(i)).sort((a, b) => a.slug.localeCompare(b.slug)).map(toCard);
  const supabase = await createClient();
  const { data } = await supabase.from("items").select(CARD_COLS).in("category", cats).order("slug").limit(1000);
  return ((data ?? []) as ItemCard[]).filter((i) => !isSpoiler(i));
}
