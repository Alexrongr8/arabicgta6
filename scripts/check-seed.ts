import { SEED_ITEMS } from "../data/seed";
const slugs = new Set<string>();
let bad = 0;
for (const i of SEED_ITEMS) {
  if (slugs.has(i.slug)) { console.log("dup", i.slug); bad++; }
  slugs.add(i.slug);
}
for (const i of SEED_ITEMS) for (const r of i.related) if (!slugs.has(r)) { console.log("missing related", i.slug, "->", r); bad++; }
const counts: Record<string, number> = {};
for (const i of SEED_ITEMS) counts[i.category] = (counts[i.category] ?? 0) + 1;
console.log(SEED_ITEMS.length, counts, "problems:", bad);
process.exit(bad ? 1 : 0);
