/**
 * Auto-update: searches the web for new GTA 6 information with OpenAI (web search tool),
 * then summarises, classifies, translates (Arabic + English) and publishes new entries.
 * Run by GitHub Actions every 6 hours (see .github/workflows/update.yml), or locally:
 *   npm run update            (publishes)
 *   npm run update -- --dry   (prints, publishes nothing)
 */
import "./lib/env";
import OpenAI from "openai";
import { need } from "./lib/env";
import { db } from "./lib/db";
import { normalize, searchText, slugify } from "../src/lib/normalize";
import { CATEGORIES } from "../src/lib/categories";

const DRY = process.argv.includes("--dry");
const MODEL = process.env.OPENAI_MODEL || "gpt-5.5";
const MAX_NEW = Number(process.env.UPDATE_MAX_ITEMS || 12);

const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

const itemSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "category", "status", "title_en", "title_ar", "summary_en", "summary_ar", "body_en", "body_ar",
    "aliases", "tags", "facts", "region", "location", "related", "sources", "event_date",
  ],
  properties: {
    category: { type: "string", enum: CATEGORY_SLUGS },
    status: { type: "string", enum: ["official", "confirmed", "leak", "rumor"] },
    title_en: { type: "string" },
    title_ar: { type: "string" },
    summary_en: { type: "string" },
    summary_ar: { type: "string" },
    body_en: { type: "string" },
    body_ar: { type: "string" },
    aliases: { type: "array", items: { type: "string" } },
    tags: { type: "array", items: { type: "string" } },
    facts: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["k_en", "k_ar", "v_en", "v_ar"],
        properties: { k_en: { type: "string" }, k_ar: { type: "string" }, v_en: { type: "string" }, v_ar: { type: "string" } },
      },
    },
    region: { type: ["string", "null"], enum: ["Vice City", "Leonida Keys", "Grassrivers", "Port Gellhorn", "Ambrosia", "Mount Kalaga", "Leonida", null] },
    location: {
      type: ["object", "null"],
      additionalProperties: false,
      required: ["x", "y"],
      properties: { x: { type: "number" }, y: { type: "number" } },
    },
    related: { type: "array", items: { type: "string" } },
    sources: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "url"],
        properties: { title: { type: "string" }, url: { type: "string" } },
      },
    },
    event_date: { type: ["string", "null"], description: "ISO date of the news/event if known" },
  },
} as const;

const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["items"],
  properties: { items: { type: "array", items: itemSchema } },
} as const;

type NewItem = {
  category: string;
  status: "official" | "confirmed" | "leak" | "rumor";
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  body_en: string;
  body_ar: string;
  aliases: string[];
  tags: string[];
  facts: { k_en: string; k_ar: string; v_en: string; v_ar: string }[];
  region: string | null;
  location: { x: number; y: number } | null;
  related: string[];
  sources: { title: string; url: string }[];
  event_date: string | null;
};

const REGION_HINT = `Map coordinates are pixels on Rockstar's official Leonida map poster (2805 wide x 3840 tall, y grows downward). Reference points: Vice City (1880,1995), Downtown (1968,2053), Little Cuba (1853,2047), Vice Beach (2390,1880), Ocean Beach (2418,2006), Belville (1845,1520), Tequesta (1890,2285), VCIA airport (1590,2190), Hamlet (1575,2632), Grassrivers (1265,2545), Pelican Valley (1462,2812), Port Gellhorn (855,1370), Capri (805,2025), Ambrosia (1560,1368), Lake Leonida (1697,1205), Mount Kalaga National Park (1395,870), Millport (1848,883), Key Lento (1595,3197), Southwind (918,3282), Riquezas Keys (612,3187). Only give a location when the place is clearly known; otherwise null.`;

function buildPrompt(existing: { slug: string; title_en: string }[], since: string) {
  return `You are the editor of an Arabic-first GTA 6 (Grand Theft Auto VI) fan encyclopedia. GTA VI launched on 19 November 2026 on PS5 and Xbox Series X|S.

Search the web for NEW information about GTA 6 published since ${since}: news (patches, sales, announcements, PC/Online), secrets & easter eggs, glitches, money methods, rare/unique weapon locations, places & landmarks, strange things, characters, vehicles, and gameplay tips (always give PlayStation AND Xbox buttons for controller tips).

Rules:
- Return at most ${MAX_NEW} items, only things NOT already covered by the existing entries listed below (skip duplicates or near-duplicates, even if worded differently).
- Prefer reputable sources (Rockstar Newswire, Take-Two, IGN, GameSpot, Kotaku, Eurogamer, VGC, Push Square, PC Gamer, GamesRadar, Polygon) and well-sourced community finds. Every item needs at least one real source URL you actually found.
- status: "official" = from Rockstar/Take-Two; "confirmed" = verified in the released game by multiple players/outlets; "leak" = from leaks/dataminers; "rumor" = unverified/single source. Be strict and honest.
- Write Arabic in clear Modern Standard Arabic with a friendly Gulf-gamer tone. Keep in-game proper names (places, weapons, vehicles, characters, missions) in English Latin script inside the Arabic text.
- summary: 1-2 sentences. body: 2-5 short paragraphs; use lines starting with "- " for lists. No markdown headings, no links in the body.
- aliases: alternative names/spellings in English AND Arabic that people might search for.
- facts: short key/value pairs for an infobox (e.g. price, location, how to unlock, buttons).
- related: slugs from the existing list that are closely related (or []).
- ${REGION_HINT}
- If nothing new and credible exists, return {"items": []}.

Existing entries (slug — title):
${existing.map((e) => `${e.slug} — ${e.title_en}`).join("\n")}`;
}

function similar(a: string, b: string) {
  const ta = new Set(normalize(a).split(" ").filter((w) => w.length > 2));
  const tb = new Set(normalize(b).split(" ").filter((w) => w.length > 2));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const w of ta) if (tb.has(w)) inter++;
  return inter / Math.min(ta.size, tb.size);
}

async function main() {
  const openai = new OpenAI({ apiKey: need("OPENAI_API_KEY") });
  const supabase = db();

  const { data: existing, error } = await supabase
    .from("items")
    .select("slug,title_en,sources,published_at")
    .order("published_at", { ascending: false })
    .limit(1500);
  if (error) throw error;
  const known = existing ?? [];
  const knownUrls = new Set(known.flatMap((k) => ((k.sources as { url: string }[]) ?? []).map((s) => s.url.replace(/\/$/, ""))));
  const knownSlugs = new Set(known.map((k) => k.slug));

  const { data: lastRun } = await supabase.from("update_runs").select("ran_at").eq("kind", "update").order("ran_at", { ascending: false }).limit(1).maybeSingle();
  const since = new Date(new Date(lastRun?.ran_at ?? Date.now() - 2 * 864e5).getTime() - 12 * 3600e3).toISOString().slice(0, 16) + "Z";

  console.log(`Model ${MODEL}; ${known.length} existing items; searching since ${since}`);
  const res = await openai.responses.create({
    model: MODEL,
    tools: [{ type: "web_search" }],
    input: buildPrompt(known.map((k) => ({ slug: k.slug, title_en: k.title_en })), since),
    text: { format: { type: "json_schema", name: "gta6_items", schema: responseSchema as unknown as Record<string, unknown>, strict: true } },
  });

  const parsed = JSON.parse(res.output_text || '{"items":[]}') as { items: NewItem[] };
  const accepted: Record<string, unknown>[] = [];
  for (const it of parsed.items ?? []) {
    const urls = it.sources.map((s) => s.url.replace(/\/$/, "")).filter((u) => /^https?:\/\//.test(u));
    if (!urls.length) continue;
    if (urls.every((u) => knownUrls.has(u)) && it.category !== "news") continue;
    if (known.some((k) => similar(k.title_en, it.title_en) >= 0.8)) continue;
    if (accepted.some((a) => similar(String(a.title_en), it.title_en) >= 0.8)) continue;

    let slug = slugify(it.title_en) || `item-${Date.now()}`;
    while (knownSlugs.has(slug)) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    knownSlugs.add(slug);

    const loc = it.location && it.location.x >= 0 && it.location.x <= 2805 && it.location.y >= 0 && it.location.y <= 3840 ? it.location : null;
    const published = it.category === "news" && it.event_date && !Number.isNaN(Date.parse(it.event_date)) && Date.parse(it.event_date) <= Date.now() ? new Date(it.event_date).toISOString() : new Date().toISOString();
    const row = {
      slug,
      category: it.category,
      status: it.status,
      title_en: it.title_en.trim(),
      title_ar: it.title_ar.trim(),
      summary_en: it.summary_en.trim(),
      summary_ar: it.summary_ar.trim(),
      body_en: it.body_en.trim(),
      body_ar: it.body_ar.trim(),
      aliases: it.aliases.slice(0, 15),
      tags: it.tags.slice(0, 10),
      facts: it.facts.slice(0, 10),
      location: loc,
      region: it.region,
      related: it.related.filter((r) => knownSlugs.has(r)).slice(0, 8),
      sources: it.sources.filter((s) => /^https?:\/\//.test(s.url)).slice(0, 6),
      published_at: published,
      origin: "auto",
    };
    accepted.push({ ...row, search_text: searchText(row) });
  }

  console.log(`Model returned ${parsed.items?.length ?? 0}, accepted ${accepted.length}`);
  for (const a of accepted) console.log(` + [${a.category}/${a.status}] ${a.title_en}`);
  if (DRY) return;

  if (accepted.length) {
    const { error: insErr } = await supabase.from("items").insert(accepted);
    if (insErr) throw insErr;
  }
  await supabase.from("update_runs").insert({ kind: "update", added: accepted.length, note: `${MODEL}: ${accepted.map((a) => a.slug).join(", ").slice(0, 900)}` });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
