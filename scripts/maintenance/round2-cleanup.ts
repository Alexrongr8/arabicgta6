/**
 * One-off editorial clean-up of the radar's first week (26 Nov 2026, owner asked for a second round).
 * Default is a dry run that only prints what would change; pass --apply to write.
 * Every changed or removed row is first copied to update_runs (kind=cleanup_backup), so it can be restored.
 *
 *  - removes repeats of the same story and filler that is not news about the game
 *  - strips production notes from the text (excerpt/proof/policy sentences, pasted button hints, raw links)
 *  - corrects the status badge of stories that came from the publisher or established press
 *  - gives every automatic article the source page's own picture instead of the shared fallback
 *  - removes Shorts whose titles are not suitable for the site
 */
import "../lib/env";
import { db } from "../lib/db";
import { cleanItem, tier } from "../lib/radar-policy";
import { findImage } from "../lib/og";
import { youtubeThumb, type AiItem } from "../lib/ai";
import { acceptTitle } from "../lib/shorts";
import { searchText } from "../../src/lib/normalize";

const APPLY = process.argv.includes("--apply");
const id = (slug: string) => slug.slice(-10);

/** Repeats and filler, by the 10-character id at the end of the slug. */
const REMOVE: Record<string, string> = {
  "4b5ebb4138": "contest that had already closed",
  "19958d28ed": "a magazine announcing its own issue",
  "4c9509aee5": "a magazine announcing its own issue",
  "b287f52dfc": "a website announcing its own livestream",
  "9f1a4877ec": "an outlet announcing its own review video",
  "3110f57498": "a statistics page about one stream",
  "ce8b9dfb31": "a bounty that had already closed",
  "a303570990": "thin rewrite of an aggregator headline",
  "df6e49f8d4": "written from a page title only, no guide content",
  "91e32388f1": "a fan site announcing its own database update",
  "88766696bf": "repeat of update 01.002.002",
  "8308aec999": "repeat of update 01.002.002",
  "b6feb1e367": "repeat of the leaked Xbox executable story",
  "125e50e2ae": "repeat of the red barn money loop",
};
/** Clearer Arabic headlines for stories that stay. */
const TITLE_AR: Record<string, string> = {
  "699e62dd29": "إشاعة تحديث 25 نوفمبر طلعت كذبة: روكستار ما أعلنت شي",
  "27a85f115b": "بيان مزيف يزعم إطلاق GTA VI Online في مارس 2027",
  "5ca85e69a8": "المودرز: ملف Xbox المسرّب يخلي GTA VI «تكاد تشتغل» على PC",
  "c1f63994c5": "مشروع Zettrox غير الرسمي يشغّل مقدمة GTA VI على PC",
  "e05d19fc57": "قلتش الحظيرة الحمراء: فلوس تتكرر كل خمس دقايق",
};
const CATEGORY: Record<string, string> = { "2a676f46de": "news", "ba0947d17a": "news" };
/** Stories that were published as "unverified" only because of the old figure check. */
const MAY_BE_OFFICIAL = new Set(["75b2f4db5b", "3e966cea15", "bd0e3a95bb", "ca28aef12e", "404d62fbce"]);
const MAY_BE_CONFIRMED = new Set(["4e59d02c86", "d813de8903", "63949d4460", "17d95f9885", "1503e184d2", "ba0947d17a", "f457507e51"]);

type Row = AiItem & { slug: string; image: string | null; origin: string; search_text?: string };

async function main() {
  const database = db();
  const backup = async (slug: string, action: string, before: unknown) => {
    if (!APPLY) return;
    const { error } = await database.from("update_runs").insert({ kind: "cleanup_backup", added: 0, note: JSON.stringify({ slug, action, before }).slice(0, 63_000) });
    if (error) throw error;
  };
  const { data, error } = await database.from("items").select("*").eq("origin", "auto").limit(1000);
  if (error) throw error;
  const rows = (data ?? []) as Row[];
  const summary = { auto: rows.length, removed: 0, cleaned: 0, status: 0, images: 0, titles: 0, category: 0, shortsRemoved: 0 };

  for (const row of rows) {
    const key = id(row.slug);
    if (REMOVE[key]) {
      console.log(`REMOVE ${row.slug} — ${REMOVE[key]}`);
      await backup(row.slug, "delete", row);
      if (APPLY) { const { error: e } = await database.from("items").delete().eq("slug", row.slug).eq("origin", "auto"); if (e) throw e; }
      summary.removed++;
      continue;
    }
    const before = { title_ar: row.title_ar, title_en: row.title_en, summary_ar: row.summary_ar, summary_en: row.summary_en, body_ar: row.body_ar, body_en: row.body_en, facts: row.facts, status: row.status, category: row.category, image: row.image };
    const item = structuredClone(row);
    const patch: Record<string, unknown> = {};
    const notes = cleanItem(item);
    for (const k of ["title_ar", "title_en", "summary_ar", "summary_en", "body_ar", "body_en"] as const) if (item[k] !== row[k] && item[k].trim().length > 20) patch[k] = item[k];
    if (JSON.stringify(item.facts) !== JSON.stringify(row.facts)) patch.facts = item.facts;
    if (Object.keys(patch).length) summary.cleaned++;
    if (TITLE_AR[key] && TITLE_AR[key] !== row.title_ar) { patch.title_ar = TITLE_AR[key]; summary.titles++; }
    if (CATEGORY[key] && CATEGORY[key] !== row.category) { patch.category = CATEGORY[key]; summary.category++; }

    const unknown = (row.tags ?? []).includes("source-unknown");
    const tiers = (row.sources ?? []).map((s) => tier(s.url));
    if (!unknown && row.status === "rumor") {
      const next = MAY_BE_OFFICIAL.has(key) && tiers.includes("A") ? "official" : (MAY_BE_OFFICIAL.has(key) || MAY_BE_CONFIRMED.has(key)) && (tiers.includes("A") || tiers.includes("C")) ? "confirmed" : null;
      if (next) { patch.status = next; summary.status++; }
    }
    if (!row.image) {
      for (const s of (row.sources ?? []).slice(0, 3)) {
        const image = youtubeThumb(s.url) ?? await findImage(s.url).catch(() => null);
        if (image) { patch.image = image; summary.images++; break; }
      }
    }
    if (!Object.keys(patch).length) continue;
    console.log(`UPDATE ${key} ${Object.keys(patch).join(",")}${notes.length ? ` [${notes.join(" ")}]` : ""}${patch.status ? ` status ${row.status}->${patch.status}` : ""}${patch.title_ar ? ` title="${patch.title_ar}"` : ""}${patch.image ? ` image=${String(patch.image).slice(0, 80)}` : ""}`);
    await backup(row.slug, "update", Object.fromEntries(Object.keys(patch).map((k) => [k, before[k as keyof typeof before]])));
    if (APPLY) {
      const merged = { ...row, ...patch };
      const { error: e } = await database.from("items").update({ ...patch, search_text: searchText(merged as never) }).eq("slug", row.slug);
      if (e) throw e;
    }
  }

  const shorts = await database.from("shorts").select("video_id,title").limit(5000);
  if (shorts.error) throw shorts.error;
  const bad = (shorts.data ?? []).filter((s) => !acceptTitle(s.title));
  for (const s of bad) console.log(`SHORT removed: ${s.title}`);
  if (APPLY && bad.length) { const { error: e } = await database.from("shorts").delete().in("video_id", bad.map((s) => s.video_id)); if (e) throw e; }
  summary.shortsRemoved = bad.length;
  console.log(JSON.stringify({ applied: APPLY, ...summary, shortsTotal: shorts.data?.length ?? 0 }));
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1; });
