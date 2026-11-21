/**
 * Finds a GTA VI picture for weapons and vehicles that still have none:
 * asks OpenAI (web search) for a page specifically about that item in GTA 6, then takes the page's preview image.
 * Writes data/catalog-images.json (committed back to the repo by the hourly workflow).
 *   npx tsx scripts/catalog-images-ai.ts --count=15
 */
import "./lib/env";
import { readFileSync, writeFileSync } from "node:fs";
import { askJson } from "./lib/ai";
import { findImage } from "./lib/og";
import { WEAPONS } from "../data/catalog-weapons";
import { VEHICLES } from "../data/catalog-vehicles";

const OUT = "data/catalog-images.json";
const COUNT = Number(process.argv.find((a) => a.startsWith("--count="))?.slice(8) ?? 15);

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["pages"],
  properties: { pages: { type: "array", items: { type: "string" } } },
} as const;

async function main() {
  const out = JSON.parse(readFileSync(OUT, "utf8")) as Record<string, { url: string; credit: string; page: string }>;
  const todo = [
    ...WEAPONS.map((w) => ({ key: `weapon:${w[0]}`, name: w[0], kind: "weapon" })),
    ...VEHICLES.map((v) => ({ key: `vehicle:${v[0]}`, name: v[0], kind: "vehicle" })),
  ].filter((t) => !out[t.key]);
  let found = 0;
  for (const t of todo.slice(0, COUNT)) {
    try {
      const r = await askJson<{ pages: string[] }>({
        prompt: `Find up to 3 web pages that are specifically about the ${t.kind} "${t.name}" in Grand Theft Auto VI (GTA 6, released November 2026) and show a picture of it from GTA 6 (not GTA V or GTA Online). Prefer GTABase, MeowDB, GTA Wiki, IGN, GameSpot, Sportskeeda or similar. Return only the page URLs.`,
        schema: schema as unknown as Record<string, unknown>,
        name: "image_pages",
      });
      for (const page of r.pages ?? []) {
        if (!/^https:\/\//.test(page)) continue;
        const img = await findImage(page);
        if (!img || /gta-?5|gtav[^i]|gta-online|gtao/i.test(img)) continue;
        out[t.key] = { url: img, credit: new URL(page).hostname.replace(/^www\./, ""), page };
        found++;
        console.log(" +", t.key, img.slice(0, 80));
        break;
      }
    } catch (e) {
      console.warn("failed", t.key, (e as Error).message);
    }
  }
  writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  console.log(`catalog images: +${found} (remaining ${todo.length - found})`);
}
main();
