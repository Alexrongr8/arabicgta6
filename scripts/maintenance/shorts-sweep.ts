/**
 * Re-applies the Shorts filter to what is already published: removes videos whose title no longer passes
 * and videos blocked by hand in scripts/lib/shorts.ts. Dry run by default; --apply deletes.
 */
import "../lib/env";
import { db } from "../lib/db";
import { acceptShort } from "../lib/shorts";

const APPLY = process.argv.includes("--apply");

async function main() {
  const database = db();
  const { data, error } = await database.from("shorts").select("video_id,title").limit(5000);
  if (error) throw error;
  const bad = (data ?? []).filter((s) => !acceptShort(s.video_id, s.title));
  for (const s of bad) console.log(`SHORT removed: ${s.video_id} ${s.title}`);
  if (APPLY && bad.length) {
    const { error: e } = await database.from("shorts").delete().in("video_id", bad.map((s) => s.video_id));
    if (e) throw e;
  }
  console.log(JSON.stringify({ applied: APPLY, removed: bad.length, total: data?.length ?? 0 }));
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1; });
