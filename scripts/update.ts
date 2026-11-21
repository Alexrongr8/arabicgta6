/**
 * The radar: every hour it sweeps several "beams" for new GTA 6 information —
 * news sites (Google-style web search), Reddit, YouTube, Instagram/X/TikTok and
 * streamers & celebrities (e.g. IShowSpeed) — then an editor pass writes deep
 * bilingual (Arabic + English) articles for the new leads, with a cover image,
 * and publishes them. Afterwards it deepens a few older short articles.
 *
 * Run by GitHub Actions (see .github/workflows/update.yml), or locally:
 *   npm run update            (publishes)
 *   npm run update -- --dry   (prints, publishes nothing)
 */
import "./lib/env";
import { db } from "./lib/db";
import { urlKey } from "./lib/url-key";
import { askJson, isFatal, preflight, itemSchema, MAP_HINT, MODEL, RADAR_MODEL, STYLE_GUIDE, CATEGORY_GUIDE, youtubeThumb, type AiItem } from "./lib/ai";
import { findImage } from "./lib/og";
import { enrichBatch } from "./enrich";
import { normalize, searchText, slugify } from "../src/lib/normalize";

const DRY = process.argv.includes("--dry");
/** bounded integer env var (invalid / negative values fall back to the cheap default) */
const intEnv = (name: string, def: number, max: number) => {
  const raw = (process.env[name] ?? "").trim();
  if (raw === "") return def;
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? Math.min(n, max) : def;
};
const MAX_NEW = intEnv("UPDATE_MAX_ITEMS", 1, 8);
const ENRICH_PER_RUN = intEnv("ENRICH_PER_RUN", 0, 4);

type Beam = { id: string; label: string; domains?: string[]; focus: string };

const BEAMS: Beam[] = [
  {
    id: "web",
    label: "News & web (Google-style search)",
    focus:
      "official Rockstar Newswire / Take-Two announcements, patches and updates, sales, PC and GTA Online news, plus big guides on gaming sites (IGN, GameSpot, Kotaku, Eurogamer, VGC, Push Square, PC Gamer, GamesRadar, Polygon, Dexerto, Sportskeeda).",
  },
  {
    id: "reddit",
    label: "Reddit",
    domains: ["reddit.com"],
    focus: "posts in r/GTA6, r/GTA, r/GrandTheftAutoV_PC and similar: new secrets, easter eggs, glitches, money methods, weird or funny moments, choices and consequences that many players confirm in the comments.",
  },
  {
    id: "youtube",
    label: "YouTube",
    domains: ["youtube.com"],
    focus: "new videos (guides, secrets, glitches, money methods, rare weapons and cars, funny moments) from GTA creators — prefer videos with many views or from known GTA channels.",
  },
  {
    id: "social",
    label: "Instagram, X, TikTok & streamers",
    domains: ["instagram.com", "x.com", "twitter.com", "tiktok.com", "twitch.tv", "kick.com"],
    focus: "viral GTA 6 clips and posts, and what famous streamers and celebrities (e.g. IShowSpeed / Speed, Kai Cenat, xQc, MrBeast, famous Arab streamers) did or found while playing GTA 6.",
  },
  {
    id: "arab-streamers",
    label: "Arab streamers (Kick, YouTube, Twitch) and Arabic gaming news",
    focus: "what Arab streamers and YouTubers (Saudi, Gulf, Egyptian, etc. — e.g. Xzit, 3mr, sxb, drb7h, BanderitaX, AboFlah) did, found or reacted to in GTA 6, their viral clips and records, plus Arabic-language gaming news about GTA 6. Use category 'streamers' for creator highlights.",
  },
  {
    id: "creators-news",
    label: "News about streamers & celebrities",
    focus: "news articles about famous streamers, YouTubers, athletes or celebrities playing GTA 6 (e.g. IShowSpeed, Kai Cenat, xQc), viral moments, records and reactions.",
  },
];

const leadSchema = {
  type: "object",
  additionalProperties: false,
  required: ["leads"],
  properties: {
    leads: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["headline", "gist", "url", "category", "confidence"],
        properties: {
          headline: { type: "string" },
          gist: { type: "string" },
          url: { type: "string" },
          category: { type: "string" },
          confidence: { type: "string", enum: ["high", "medium", "low"] },
        },
      },
    },
  },
} as const;

type Lead = { headline: string; gist: string; url: string; category: string; confidence: string; beam: string };

function similar(a: string, b: string) {
  const ta = new Set(normalize(a).split(" ").filter((w) => w.length > 2));
  const tb = new Set(normalize(b).split(" ").filter((w) => w.length > 2));
  if (!ta.size || !tb.size) return 0;
  let inter = 0;
  for (const w of ta) if (tb.has(w)) inter++;
  return inter / Math.min(ta.size, tb.size);
}

// identity-preserving key: different YouTube videos stay different (docs/RADAR-POLICY.md §5.1)
const cleanUrl = urlKey;

async function sweep(beam: Beam, since: string, knownTitles: string[]): Promise<{ ok: boolean; leads: Lead[] }> {
  const prompt = `You are a radar scanning for NEW Grand Theft Auto VI (GTA 6) information published since ${since}. GTA VI launched on 19 November 2026 on PS5 and Xbox Series X|S.
Source to scan: ${beam.label}. Focus: ${beam.focus}

Return up to 8 leads that are genuinely new and interesting for players (skip anything already in the list below, even if worded differently). Each lead: a short headline, a 1-2 sentence gist with the key facts, the best URL you actually found, a category from this list, and your confidence that it's real.
Categories:
${CATEGORY_GUIDE}

Already published (titles):
${knownTitles.slice(0, 400).join("\n")}`;
  try {
    const r = await askJson<{ leads: Omit<Lead, "beam">[] }>({ model: RADAR_MODEL, prompt, schema: leadSchema as unknown as Record<string, unknown>, name: "radar_leads", domains: beam.domains });
    return { ok: true, leads: (r.leads ?? []).map((l) => ({ ...l, beam: beam.id })) };
  } catch (e) {
    if (isFatal(e)) throw e; // spend limit / quota / auth: stop everything
    console.warn(`beam ${beam.id} failed:`, (e as Error).message);
    return { ok: false, leads: [] };
  }
}

async function main() {
  preflight(); // free check: key + model configured, before any database or paid work
  const supabase = db();
  const { data: existing, error } = await supabase
    .from("items")
    .select("slug,title_en,sources,published_at")
    .order("published_at", { ascending: false })
    .limit(3000);
  if (error) throw error;
  const known = existing ?? [];
  const knownUrls = new Set(known.flatMap((k) => ((k.sources as { url: string }[]) ?? []).map((s) => cleanUrl(s.url))));
  const knownSlugs = new Set(known.map((k) => k.slug));

  const { data: lastRun } = await supabase.from("update_runs").select("ran_at").eq("kind", "update").order("ran_at", { ascending: false }).limit(1).maybeSingle();
  const since = new Date(new Date(lastRun?.ran_at ?? Date.now() - 2 * 864e5).getTime() - 6 * 3600e3).toISOString().slice(0, 16) + "Z";

  const beams = (process.env.RADAR_BEAMS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  // Unset = one cheap beam. Set RADAR_BEAMS=all (or a comma list) to widen deliberately.
  const active = beams.includes("all") ? BEAMS : BEAMS.filter((b) => (beams.length ? beams : ["web"]).includes(b.id));
  console.log(`Radar: ${active.map((b) => b.id).join(", ")} | model ${RADAR_MODEL}/${MODEL} | since ${since}`);

  // 1) Sweep the active beams one after another (a fatal error stops before the next paid call).
  const knownTitles = known.map((k) => k.title_en);
  const results: { ok: boolean; leads: Lead[] }[] = [];
  for (const b of active) results.push(await sweep(b, since, knownTitles));
  if (!results.some((r) => r.ok)) {
    // Don't log a successful run: that would advance the search watermark past news we never saw.
    throw new Error("All discovery beams failed — not recording a successful run.");
  }
  const leads = results.flatMap((r) => r.leads);

  // 2) Keep fresh, distinct, credible leads.
  const fresh: Lead[] = [];
  for (const l of leads) {
    if (!/^https?:\/\//.test(l.url) || l.confidence === "low") continue;
    if (knownUrls.has(cleanUrl(l.url))) continue;
    if (known.some((k) => similar(k.title_en, l.headline) >= 0.75)) continue;
    if (fresh.some((f) => similar(f.headline, l.headline) >= 0.7)) continue;
    fresh.push(l);
  }
  fresh.sort((a, b) => (a.confidence === "high" ? 0 : 1) - (b.confidence === "high" ? 0 : 1));
  const picked = fresh.slice(0, MAX_NEW);
  console.log(`Leads: ${leads.length} found, ${fresh.length} fresh, writing ${picked.length}`);
  for (const l of picked) console.log(`  [${l.beam}/${l.category}] ${l.headline} — ${l.url}`);

  // 3) Editor pass: one deep article per lead.
  const accepted: Record<string, unknown>[] = [];
  for (const lead of picked) {
    const prompt = `You are the editor of an Arabic-first GTA 6 fan encyclopedia. Research this lead on the web and write ONE complete article about it.

Lead: ${lead.headline}
Gist: ${lead.gist}
Found at: ${lead.url} (via ${lead.beam})

Rules:
- Verify with at least one more source when possible; include every source URL you used (the lead URL first).
- category from: ${CATEGORY_GUIDE.replace(/\n/g, " | ")}
- status: "official" = Rockstar/Take-Two; "confirmed" = verified in the released game by several players/outlets; "leak" = leaks/dataminers; "rumor" = unverified or single source. Be strict.
- summary: 1-2 sentences.
- aliases: other names/spellings people might search, in English AND Arabic.
- facts: 3-8 short key/value pairs for an infobox (location, price, how to unlock, buttons, date...).
- related: slugs from this list only when clearly related, else []: ${[...knownSlugs].slice(0, 600).join(", ")}
- ${MAP_HINT}
${STYLE_GUIDE}`;
    try {
      const it = await askJson<AiItem>({ prompt, schema: itemSchema as unknown as Record<string, unknown>, name: "gta6_item", maxOutputTokens: 6000 });
      if (!it.title_en || !it.body_ar || it.body_ar.length < 400) continue;
      if (accepted.some((a) => similar(String(a.title_en), it.title_en) >= 0.75)) continue;

      let slug = slugify(it.title_en) || `item-${Date.now()}`;
      while (knownSlugs.has(slug)) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
      knownSlugs.add(slug);

      const sources = [{ title: lead.headline, url: lead.url }, ...it.sources]
        .filter((s, i, arr) => /^https?:\/\//.test(s.url) && arr.findIndex((x) => cleanUrl(x.url) === cleanUrl(s.url)) === i)
        .slice(0, 6);
      let image: string | null = null;
      for (const s of sources) {
        image = youtubeThumb(s.url) ?? (await findImage(s.url));
        if (image) break;
      }
      const loc = it.location && it.location.x >= 0 && it.location.x <= 2805 && it.location.y >= 0 && it.location.y <= 3840 ? it.location : null;
      const published =
        it.category === "news" && it.event_date && !Number.isNaN(Date.parse(it.event_date)) && Date.parse(it.event_date) <= Date.now()
          ? new Date(it.event_date).toISOString()
          : new Date().toISOString();
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
        tags: [...it.tags.slice(0, 9), `via:${lead.beam}`],
        facts: it.facts.slice(0, 10),
        location: loc,
        region: it.region,
        related: it.related.filter((r) => knownSlugs.has(r)).slice(0, 8),
        sources,
        image,
        published_at: published,
        origin: "auto",
      };
      accepted.push({ ...row, search_text: searchText(row) });
      console.log(` + [${row.category}/${row.status}] ${row.title_en}${image ? " 🖼" : ""}`);
    } catch (e) {
      if (isFatal(e)) throw e;
      console.warn("editor failed for", lead.headline, (e as Error).message);
    }
  }

  if (!DRY && accepted.length) {
    const { error: insErr } = await supabase.from("items").insert(accepted);
    if (insErr) throw insErr;
  }

  // 4) Deepen a few older short articles each run, until every page is detailed.
  const enriched = await enrichBatch(ENRICH_PER_RUN, DRY);

  if (!DRY) {
    const { error: logErr } = await supabase.from("update_runs").insert({
      // Only a run where every beam succeeded advances the search window (kind "update");
      // partial runs are logged separately so the failed beam's window is searched again next time.
      kind: results.every((r) => r.ok) ? "update" : "update_partial",
      added: accepted.length,
      note: `beams=${active.map((b) => b.id).join("+")} leads=${leads.length} new=${accepted.map((a) => a.slug).join(", ").slice(0, 700)} enriched=${enriched}`,
    });
    if (logErr) throw logErr;
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
