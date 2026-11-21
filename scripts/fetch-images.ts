/**
 * Finds a preview image (og:image / twitter:image) for seed items from their sources
 * and writes data/seed/images.json. Items with an official Rockstar image keep it.
 *   npx tsx scripts/fetch-images.ts
 */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { SEED_ITEMS } from "../data/seed";
import { findImage } from "./lib/og";

async function main() {
  const out: Record<string, string> = existsSync("data/seed/images.json") ? JSON.parse(readFileSync("data/seed/images.json", "utf8")) : {};
  const cache = new Map<string, string | null>();
  for (const item of SEED_ITEMS) {
    if (item.image || out[item.slug]) continue;
    for (const s of item.sources) {
      if (!cache.has(s.url)) cache.set(s.url, await findImage(s.url));
      const img = cache.get(s.url);
      if (img) {
        out[item.slug] = img;
        console.log("✓", item.slug, img.slice(0, 90));
        break;
      }
    }
    if (!out[item.slug]) console.log("·", item.slug);
  }
  writeFileSync("data/seed/images.json", JSON.stringify(out, null, 2) + "\n");
  console.log(Object.keys(out).length, "images");
}
main();
