/** One explicit paid search creates a private review record only. Never writes catalog-images.json. */
import "./lib/env";
import { readFileSync } from "node:fs";
import { db } from "./lib/db";
import { askJsonWithEvidence, preflight, usageTotals } from "./lib/ai";
import { writeRecord } from "./lib/radar-store";
import { imageCandidates } from "./lib/image-review";
import { safeGet } from "../src/lib/safe-fetch";
import { WEAPONS } from "../data/catalog-weapons";
import { VEHICLES } from "../data/catalog-vehicles";

async function main() {
  const count = process.argv.find((a) => a.startsWith("--count="))?.slice(8) ?? "1";
  if (!process.argv.includes("--review") || count !== "1") throw new Error("Use --review [--count=1] [--key=vehicle:NAME]. One paid search; review-only. --dry still calls AI.");
  const images = JSON.parse(readFileSync("data/catalog-images.json", "utf8")) as Record<string, unknown>;
  const key = process.argv.find((a) => a.startsWith("--key="))?.slice(6);
  const selected = [...WEAPONS.map((v) => ({ key: `weapon:${v[0]}`, name: v[0], kind: "weapon" })), ...VEHICLES.map((v) => ({ key: `vehicle:${v[0]}`, name: v[0], kind: "vehicle" }))].find((t) => !images[t.key] && (!key || t.key === key));
  if (!selected) { console.log("No matching missing image; no request made."); return; }
  preflight();
  const r = await askJsonWithEvidence<{ pages: string[] }>({ name: "catalog_image_review", schema: { type: "object", additionalProperties: false, required: ["pages"], properties: { pages: { type: "array", maxItems: 3, items: { type: "string" } } } },
    prompt: `Research exact GTA VI ${selected.kind} ${JSON.stringify(selected.name)}. Return up to3 actually retrieved source pages which may show that exact entity in GTA VI. Prefer official Rockstar images; never claim GTA V/Online/reference footage is GTA VI. Empty is valid. These are unverified human-review candidates, not images to publish.`,
  });
  const candidates = await imageCandidates(r.data.pages, r.retrievedUrls, (url) => safeGet(url, { timeoutMs: 5000, maxBytes: 750000 }));
  if (!process.argv.includes("--dry")) await writeRecord(db(), "radar_review", { kind: "catalog-image", key: selected.key, reasons: ["manual-visual-and-game-provenance-review-required"], candidates, responseId: r.responseId, usage: usageTotals() });
  console.log(`Held ${candidates.length} candidate pages for ${selected.key}; catalog mapping unchanged.`);
}
main().catch((e) => { console.error(e instanceof Error ? e.message : "Catalog image review failed"); process.exitCode = 1; });
