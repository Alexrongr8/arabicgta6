import "server-only";
import { createClient, supabaseConfigured } from "./supabase/server";
import { publicRead, publicReadSignal, PublicReadError } from "./public-read";
import { SEED } from "./seed";

type SitemapItem = { slug: string; published_at: string };
const PAGE_SIZE = 500;
const MAX_ITEMS = 20_000;

/** Narrow keyset pages avoid the backend's default 1,000-row response ceiling. */
export async function getSitemapItems(): Promise<SitemapItem[]> {
  if (!supabaseConfigured()) return SEED.map(({ slug, published_at }) => ({ slug, published_at }));
  const supabase = await createClient();
  const signal = publicReadSignal(); // One shared 4s budget for the complete snapshot.
  const items: SitemapItem[] = [];
  const seen = new Set<string>();
  let cursor: string | undefined;
  for (let page = 0; page < 50; page++) {
    let query = supabase.from("items").select("slug,published_at").order("slug", { ascending: true }).limit(PAGE_SIZE);
    if (cursor) query = query.gt("slug", cursor);
    const rows = await publicRead<SitemapItem[]>("sitemap items", query, signal);
    if (!rows) throw new PublicReadError("sitemap items");
    if (!rows.length) return items;
    for (const row of rows) {
      if (!row || typeof row.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)
        || seen.has(row.slug) || typeof row.published_at !== "string" || !Number.isFinite(Date.parse(row.published_at))) {
        throw new PublicReadError("invalid sitemap page");
      }
      seen.add(row.slug);
      items.push({ slug: row.slug, published_at: row.published_at });
      cursor = row.slug;
    }
    if (items.length > MAX_ITEMS) throw new PublicReadError("sitemap capacity exceeded");
    // Continue to an empty page, even if a lower backend row cap returned fewer than500.
  }
  throw new PublicReadError("sitemap pagination incomplete");
}
