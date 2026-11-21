/**
 * Uploads the seed encyclopedia (data/seed) into Supabase. Safe to re-run:
 * existing slugs are skipped (so articles deepened by the enricher are kept).
 *   npm run seed               (adds missing items)
 *   npm run seed -- --force    (overwrites existing items with the seed version)
 */
import "./lib/env";
import { SEED_ITEMS } from "../data/seed";
import { searchText } from "../src/lib/normalize";
import { db } from "./lib/db";

async function main() {
  const supabase = db();
  const rows = SEED_ITEMS.map((i) => ({ ...i, search_text: searchText(i), origin: "seed", updated_at: new Date().toISOString() }));
  for (let k = 0; k < rows.length; k += 100) {
    const { error } = await supabase
      .from("items")
      .upsert(rows.slice(k, k + 100), { onConflict: "slug", ignoreDuplicates: !process.argv.includes("--force") });
    if (error) throw error;
  }
  await supabase.from("update_runs").insert({ kind: "seed", added: rows.length, note: "seed upload" });
  console.log(`Seeded ${rows.length} items.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
