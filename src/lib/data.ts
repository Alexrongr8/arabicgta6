import "server-only";
import { cache } from "react";
import type { CategorySlug, Item, ItemCard } from "./types";
import { createClient, supabaseConfigured } from "./supabase/server";
import { normalize, searchText } from "./normalize";
import { SEED } from "./seed";
import { adminClient, adminConfigured } from "./admin";

/**
 * Data access layer. With Supabase configured, reads go through RLS:
 * guests can only reach the latest 10 news items via security-definer RPCs,
 * signed-in users can read everything. Without Supabase, seed data is used.
 */

export const GUEST_NEWS_LIMIT = 10;
const CARD_COLS =
  "slug,category,status,title_en,title_ar,summary_en,summary_ar,published_at,region,location,featured,image";

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
export async function getFeatured(): Promise<ItemCard[]> {
  if (!supabaseConfigured()) {
    const flagged = SEED.filter((i) => i.featured).sort(byDate);
    return flagged.slice(0, 10).map(toCard);
  }
  const supabase = await createClient();
  let popular: string[] = [];
  if (adminConfigured()) {
    const since = new Date(Date.now() - 3 * 864e5).toISOString();
    const { data: views } = await adminClient().from("page_views").select("path").like("path", "/item/%").gte("created_at", since).limit(20000);
    const counts = new Map<string, number>();
    for (const v of views ?? []) {
      const slug = String(v.path).slice(6).split(/[?#]/)[0];
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
    popular = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([slug]) => slug);
  }
  const [{ data: pop }, { data: flagged }, { data: fresh }] = await Promise.all([
    popular.length ? supabase.from("items").select(CARD_COLS).in("slug", popular) : Promise.resolve({ data: [] }),
    supabase.from("items").select(CARD_COLS).eq("featured", true).order("published_at", { ascending: false }).limit(6),
    supabase.from("items").select(CARD_COLS).order("published_at", { ascending: false }).limit(4),
  ]);
  const ordered = [...((pop ?? []) as ItemCard[]).sort((a, b) => popular.indexOf(a.slug) - popular.indexOf(b.slug)), ...((fresh ?? []) as ItemCard[]), ...((flagged ?? []) as ItemCard[])];
  const seen = new Set<string>();
  return ordered.filter((i) => !seen.has(i.slug) && seen.add(i.slug)).slice(0, 10);
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
  if (!supabaseConfigured()) return SEED.filter((i) => slugs.includes(i.slug)).map(toCard);
  const supabase = await createClient();
  const { data } = await supabase.from("items").select(CARD_COLS).in("slug", slugs);
  return (data ?? []) as ItemCard[];
}

export async function getMapItems(): Promise<ItemCard[]> {
  if (!supabaseConfigured()) return SEED.filter((i) => i.location || i.spots?.length).map(toCard);
  const supabase = await createClient();
  const { data } = await supabase.from("items").select(`${CARD_COLS},spots`).or("location.not.is.null,spots.neq.[]").limit(3000);
  return (data ?? []) as ItemCard[];
}

export async function search(q: string, limit = 40): Promise<ItemCard[]> {
  const nq = normalize(q);
  if (!nq) return [];
  if (!supabaseConfigured()) return localSearch(SEED, nq, limit).map(toCard);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("search_items", { q: nq, max_results: limit });
  if (error) throw error;
  return (data ?? []) as ItemCard[];
}

function localSearch(items: Item[], nq: string, limit: number): Item[] {
  const terms = nq.split(" ").filter(Boolean);
  const scored: { i: Item; s: number }[] = [];
  for (const i of items) {
    const hay = searchText(i);
    if (!terms.every((t) => hay.includes(t))) continue;
    const titles = normalize(`${i.title_en} ${i.title_ar} ${i.aliases.join(" ")}`);
    let s = 1;
    if (titles.includes(nq)) s += 10;
    if (normalize(i.title_en) === nq || normalize(i.title_ar) === nq) s += 20;
    if (titles.startsWith(nq)) s += 5;
    scored.push({ i, s });
  }
  return scored.sort((a, b) => b.s - a.s || byDate(a.i, b.i)).slice(0, limit).map((x) => x.i);
}

export type TipCard = Pick<Item, "slug" | "title_en" | "title_ar" | "summary_en" | "summary_ar">;

export const getTipCards = cache(async (): Promise<TipCard[]> => {
  if (!supabaseConfigured()) {
    return SEED.filter((i) => i.category === "tips").map(({ slug, title_en, title_ar, summary_en, summary_ar }) => ({ slug, title_en, title_ar, summary_en, summary_ar }));
  }
  const supabase = await createClient();
  const { data } = await supabase.rpc("tip_cards");
  return (data ?? []) as TipCard[];
});
