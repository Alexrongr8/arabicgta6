/** Collects new GTA 6 YouTube Shorts. Free: public feeds/pages + oEmbed, no API key, no paid AI. */
import "./lib/env";
import { db } from "./lib/db";
import { SHORTS_CHANNELS, SHORTS_PAGES, shortsFeed, extractIds, acceptShort, BLOCKED_IDS } from "./lib/shorts";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36";
const MAX_NEW = Number(process.env.SHORTS_MAX_NEW ?? 25);

async function text(url: string): Promise<string> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.8,ar;q=0.6" }, signal: AbortSignal.timeout(10_000) });
    return r.ok ? (await r.text()).slice(0, 3_000_000) : "";
  } catch { return ""; }
}

/** oEmbed confirms the video exists, is public and embeddable, and gives its real title. */
async function oembed(id: string): Promise<{ title: string; channel: string } | null> {
  try {
    const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/shorts/${id}&format=json`, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const j = (await r.json()) as { title?: unknown; author_name?: unknown };
    return typeof j.title === "string" ? { title: j.title.slice(0, 300), channel: typeof j.author_name === "string" ? j.author_name.slice(0, 120) : "" } : null;
  } catch { return null; }
}

/** YouTube serves /shorts/ID only for real Shorts; normal videos redirect to /watch. */
async function isShort(id: string): Promise<boolean> {
  try {
    const r = await fetch(`https://www.youtube.com/shorts/${id}`, { method: "HEAD", redirect: "manual", headers: { "User-Agent": UA }, signal: AbortSignal.timeout(8000) });
    return r.status === 200;
  } catch { return false; }
}

async function main() {
  const database = db();
  const candidates = new Map<string, "channel" | "search">();
  for (const ch of SHORTS_CHANNELS) for (const id of extractIds(await text(shortsFeed(ch))).slice(0, 15)) if (!candidates.has(id)) candidates.set(id, "channel");
  for (const p of SHORTS_PAGES) for (const id of extractIds(await text(p.url), true).slice(0, 40)) if (!candidates.has(id)) candidates.set(id, p.source);
  if (!candidates.size) { console.log("No candidates found (YouTube pages unavailable?)."); return; }

  const ids = [...candidates.keys()];
  const { data: existing, error } = await database.from("shorts").select("video_id").in("video_id", ids);
  if (error) throw error;
  const known = new Set((existing ?? []).map((r) => r.video_id));
  const rows = [];
  for (const id of ids) {
    if (known.has(id) || BLOCKED_IDS.has(id) || rows.length >= MAX_NEW) continue;
    const info = await oembed(id);
    if (!info || !acceptShort(id, info.title) || !(await isShort(id))) continue;
    rows.push({ video_id: id, title: info.title, channel: info.channel || null, source: candidates.get(id)!, added_at: new Date(Date.now() - rows.length * 1000).toISOString() });
  }
  if (rows.length) {
    // Earlier-listed shorts get a later timestamp, so they show first.
    const { error: e } = await database.from("shorts").upsert(rows, { onConflict: "video_id", ignoreDuplicates: true });
    if (e) throw e;
  }
  console.log(JSON.stringify({ candidates: candidates.size, added: rows.length }));
}
main().catch((e) => { console.error(e instanceof Error ? e.message : "Shorts collection failed"); process.exitCode = 1; });
