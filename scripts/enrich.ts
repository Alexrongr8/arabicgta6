/**
 * Deepens short articles: researches each topic on the web and rewrites the body
 * (Arabic + English) into a detailed, multi-paragraph article. Titles stay as they are.
 * Runs a few items per hourly update; can also be run on its own:
 *   npm run enrich               (10 items)
 *   npm run enrich -- --count=40
 *   npm run enrich -- --dry
 */
import "./lib/env";
import { db } from "./lib/db";
import { askJson, itemSchema, MAP_HINT, STYLE_GUIDE, youtubeThumb, type AiItem } from "./lib/ai";
import { findImage } from "./lib/og";
import { searchText } from "../src/lib/normalize";

const DEEP_MIN_CHARS = 1100; // Arabic body shorter than this counts as "shallow"

type Row = {
  slug: string;
  category: string;
  status: string;
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  body_en: string;
  body_ar: string;
  aliases: string[];
  tags: string[];
  facts: AiItem["facts"];
  sources: AiItem["sources"];
  region: string | null;
  location: { x: number; y: number } | null;
  image: string | null;
  featured: boolean;
  published_at: string;
};

export async function enrichBatch(count: number, dry = false): Promise<number> {
  if (count <= 0) return 0;
  const supabase = db();
  const { data, error } = await supabase
    .from("items")
    .select("slug,category,status,title_en,title_ar,summary_en,summary_ar,body_en,body_ar,aliases,tags,facts,sources,region,location,image,featured,published_at")
    .limit(5000);
  if (error) throw error;
  const rows = ((data ?? []) as Row[])
    .filter((r) => (r.body_ar ?? "").length < DEEP_MIN_CHARS && !(r.tags ?? []).includes("enriched"))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.published_at.localeCompare(a.published_at))
    .slice(0, count);

  let done = 0;
  for (const r of rows) {
    const prompt = `You are the editor of an Arabic-first GTA 6 (Grand Theft Auto VI, released 19 Nov 2026) fan encyclopedia. This article is too short — readers want depth. Research the topic on the web and rewrite it as a complete, detailed article.

KEEP the titles exactly as they are:
title_en: ${r.title_en}
title_ar: ${r.title_ar}
category: ${r.category} (keep)
status: ${r.status} (keep unless sources clearly prove otherwise)

Current summary (EN): ${r.summary_en}
Current body (EN):
${r.body_en}

Current sources:
${r.sources.map((s) => `- ${s.title}: ${s.url}`).join("\n")}

Return the full article. Add the new sources you used to "sources" (keep the useful existing ones). facts: 3-8 infobox pairs. aliases: English + Arabic search terms. related: [] (leave empty). ${MAP_HINT}
${STYLE_GUIDE}`;
    try {
      const it = await askJson<AiItem>({ prompt, schema: itemSchema as unknown as Record<string, unknown>, name: "gta6_enrich" });
      if (!it.body_ar || it.body_ar.length < r.body_ar.length) continue;
      const sources = [...r.sources, ...it.sources]
        .filter((s, i, arr) => /^https?:\/\//.test(s.url) && arr.findIndex((x) => x.url === s.url) === i)
        .slice(0, 8);
      let image = r.image;
      if (!image) {
        for (const s of sources) {
          image = youtubeThumb(s.url) ?? (await findImage(s.url));
          if (image) break;
        }
      }
      const update = {
        summary_en: it.summary_en?.trim() || r.summary_en,
        summary_ar: it.summary_ar?.trim() || r.summary_ar,
        body_en: it.body_en.trim(),
        body_ar: it.body_ar.trim(),
        facts: it.facts?.length >= r.facts.length ? it.facts.slice(0, 10) : r.facts,
        aliases: [...new Set([...r.aliases, ...(it.aliases ?? [])])].slice(0, 20),
        tags: [...new Set([...(r.tags ?? []), "enriched"])],
        sources,
        image,
        updated_at: new Date().toISOString(),
      };
      const search_text = searchText({ ...r, ...update });
      console.log(` ~ deepened ${r.slug}: ${r.body_ar.length} → ${update.body_ar.length} chars`);
      if (!dry) {
        const { error: upErr } = await supabase.from("items").update({ ...update, search_text }).eq("slug", r.slug);
        if (upErr) throw upErr;
      }
      done++;
    } catch (e) {
      console.warn("enrich failed for", r.slug, (e as Error).message);
    }
  }
  return done;
}

if (process.argv[1]?.match(/enrich\.ts$/)) {
  const count = Number(process.argv.find((a) => a.startsWith("--count="))?.slice(8) ?? 10);
  enrichBatch(count, process.argv.includes("--dry"))
    .then((n) => console.log(`Enriched ${n} items.`))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}
