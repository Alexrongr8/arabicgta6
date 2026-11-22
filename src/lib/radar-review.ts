import "server-only";
import { createHash } from "node:crypto";
import { CATEGORIES } from "./categories";
import { searchText, slugify } from "./normalize";
import type { adminClient } from "./admin";

/**
 * Owner review of radar proposals. The radar stores proposals as private `update_runs`
 * rows (kind=radar_review). The owner's decision is appended as kind=radar_decision, so
 * the original proposal is never edited and a decision is never taken automatically.
 */
type Db = ReturnType<typeof adminClient>;

export type ReviewLead = { headline: string; gist: string; url: string; category: string; confidence: string };
export type ReviewItem = {
  category: string; status: string; title_en: string; title_ar: string; summary_en: string; summary_ar: string;
  body_en: string; body_ar: string; aliases: string[]; tags: string[]; facts: { k_en: string; k_ar: string; v_en: string; v_ar: string }[];
  region: string | null; related: string[]; sources: { title: string; url: string }[]; event_date: string | null;
};
export type Review = {
  id: number; ranAt: string; kind: string; reasons: string[]; lead: ReviewLead | null;
  item: ReviewItem | null; spoilers: boolean;
};

const STATUSES = ["official", "confirmed", "leak", "rumor"];
const str = (v: unknown) => (typeof v === "string" ? v : "");
const strs = (v: unknown, n: number) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, n) : []);

function parseItem(v: unknown): ReviewItem | null {
  const o = v as Record<string, unknown> | null;
  if (!o || typeof o !== "object") return null;
  const item: ReviewItem = {
    category: str(o.category), status: str(o.status),
    title_en: str(o.title_en).trim(), title_ar: str(o.title_ar).trim(), summary_en: str(o.summary_en).trim(), summary_ar: str(o.summary_ar).trim(),
    body_en: str(o.body_en).trim(), body_ar: str(o.body_ar).trim(), aliases: strs(o.aliases, 15), tags: strs(o.tags, 8),
    facts: Array.isArray(o.facts) ? (o.facts as ReviewItem["facts"]).filter((f) => f && typeof f.k_en === "string" && typeof f.v_en === "string").slice(0, 10) : [],
    region: typeof o.region === "string" ? o.region : null, related: strs(o.related, 8),
    sources: Array.isArray(o.sources) ? (o.sources as ReviewItem["sources"]).filter((s) => s && typeof s.url === "string" && /^https:\/\//.test(s.url)).slice(0, 12) : [],
    event_date: typeof o.event_date === "string" ? o.event_date : null,
  };
  return item;
}

function parse(row: { id: number; ran_at: string; note: string | null }): Review | null {
  try {
    const n = JSON.parse(row.note ?? "") as Record<string, unknown>;
    const lead = n.lead as ReviewLead | undefined;
    const draft = n.draft as { item?: unknown; proof?: { story_spoilers?: boolean } } | undefined;
    return {
      id: row.id, ranAt: row.ran_at, kind: str(n.kind) || "article", reasons: strs(n.reasons, 20),
      lead: lead && typeof lead.headline === "string" && typeof lead.url === "string" ? lead : null,
      item: parseItem(draft?.item), spoilers: Boolean(draft?.proof?.story_spoilers),
    };
  } catch {
    return null;
  }
}

/** Pending proposals = radar_review rows without a later owner decision. */
export async function loadPendingReviews(db: Db): Promise<Review[]> {
  const [reviews, decisions] = await Promise.all([
    db.from("update_runs").select("id,ran_at,note").eq("kind", "radar_review").order("id", { ascending: false }).limit(60),
    db.from("update_runs").select("note").eq("kind", "radar_decision").order("id", { ascending: false }).limit(500),
  ]);
  if (reviews.error) throw reviews.error;
  if (decisions.error) throw decisions.error;
  const decided = new Set<number>();
  for (const d of decisions.data ?? []) {
    try { const id = (JSON.parse(d.note ?? "") as { reviewId?: unknown }).reviewId; if (typeof id === "number") decided.add(id); } catch { /* ignore */ }
  }
  return (reviews.data ?? []).filter((r) => !decided.has(r.id)).map(parse).filter((r): r is Review => r !== null);
}

export async function loadReview(db: Db, id: number): Promise<Review | null> {
  const { data, error } = await db.from("update_runs").select("id,ran_at,note,kind").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data || data.kind !== "radar_review") return null;
  const pending = await loadPendingReviews(db);
  if (!pending.some((r) => r.id === id)) return null;
  return parse(data);
}

/** A proposal can be published only when it is a complete bilingual article in a known category. */
export function publishable(r: Review): boolean {
  const i = r.item;
  return Boolean(i && r.lead && CATEGORIES.some((c) => c.slug === i.category) && STATUSES.includes(i.status)
    && i.title_ar && i.title_en && i.summary_ar && i.summary_en && i.body_ar && i.body_en);
}

export function itemRow(r: Review) {
  const i = r.item!;
  const lead = r.lead!;
  const slug = `${slugify(lead.headline).slice(0, 100) || "gta6-update"}-${createHash("sha256").update(lead.url).digest("hex").slice(0, 10)}`;
  const event = i.event_date && Number.isFinite(Date.parse(i.event_date)) && Date.parse(i.event_date) <= Date.now() ? new Date(i.event_date).toISOString() : new Date().toISOString();
  const row = {
    slug, category: i.category, status: i.status, title_en: i.title_en, title_ar: i.title_ar, summary_en: i.summary_en, summary_ar: i.summary_ar,
    body_en: i.body_en, body_ar: i.body_ar, aliases: i.aliases, tags: [...new Set([...i.tags, "via:radar-review"])], facts: i.facts,
    location: null, region: i.region, related: [] as string[], sources: i.sources, image: null, published_at: event, origin: "auto",
  };
  return { ...row, search_text: searchText(row) };
}
