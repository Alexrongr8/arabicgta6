/**
 * Finds images for catalog entries:
 *  - animals: real photos from Wikipedia (Wikimedia Commons, free licences)
 *  - weapons & vehicles: GTA VI pages on the GTA Wiki (Fandom) only — pages not tagged as GTA VI are skipped,
 *    so we never show a GTA V picture by mistake.
 * Writes data/catalog-images.json  { "<kind>:<name>": { url, credit, page } }
 *   npx tsx scripts/fetch-catalog-images.ts
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { WEAPONS } from "../data/catalog-weapons";
import { VEHICLES } from "../data/catalog-vehicles";
import { ANIMALS } from "../data/catalog-animals";

type Img = { url: string; credit: string; page: string };
const OUT = "data/catalog-images.json";
const out: Record<string, Img> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : {};
const UA = { "user-agent": "ArabicGTA6/1.0 (fan encyclopedia; images credited)" };
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function json(url: string) {
  const r = await fetch(url, { headers: UA });
  if (!r.ok) return null;
  return r.json();
}

const WIKI_TITLES: Record<string, string> = {
  "American Alligator": "American alligator",
  "Albino American Alligator": "American alligator",
  "Juvenile American Alligator": "American alligator",
  "American Crocodile": "American crocodile",
  "Green Iguana": "Green iguana",
  "Sea Turtle": "Sea turtle",
  Snakes: "Eastern diamondback rattlesnake",
  "Cane Toad": "Cane toad",
  Dolphins: "Common bottlenose dolphin",
  "Sharks (incl. hammerhead)": "Great hammerhead",
  Whales: "Humpback whale",
  "Manta Rays": "Manta ray",
  Jellyfish: "Moon jellyfish",
  Manatee: "West Indian manatee",
  Lionfish: "Red lionfish",
  Eel: "Green moray",
  "Reef fish": "Queen angelfish",
  "Atlantic Spanish Mackerel": "Atlantic Spanish mackerel",
  "Stoplight Parrotfish": "Stoplight parrotfish",
  Flamingo: "American flamingo",
  "Great Egret": "Great egret",
  "Great Blue Heron": "Great blue heron",
  "Roseate Spoonbill": "Roseate spoonbill",
  "Caspian Tern": "Caspian tern",
  "Black Vulture": "Black vulture",
  "Mottled Duck": "Mottled duck",
  Seagull: "Laughing gull",
  Pelican: "Brown pelican",
  Pigeon: "Rock dove",
  Peacock: "Indian peafowl",
  "Cougar / Florida Panther": "Florida panther",
  "White-tailed Deer": "White-tailed deer",
  "Northern Raccoon": "Raccoon",
  "Eastern Cottontail Rabbit": "Eastern cottontail",
  Bobcat: "Bobcat",
  "Wild Boar / Feral Hog": "Wild boar",
  "Black Bear": "American black bear",
  Fox: "Gray fox",
  Beaver: "North American beaver",
  Otter: "North American river otter",
  Possum: "Virginia opossum",
  Skunk: "Striped skunk",
  Rat: "Brown rat",
  Cow: "Cattle",
  Sheep: "Sheep",
  Frog: "American bullfrog",
  "Land Turtle": "Gopher tortoise",
  Crayfish: "Crayfish",
  "Whooping Crane": "Whooping crane",
  Woodpecker: "Pileated woodpecker",
  "Australian Shepherd": "Australian Shepherd",
  Chihuahua: "Chihuahua (dog breed)",
  Doberman: "Dobermann",
  Rottweiler: "Rottweiler",
  Squirrel: "Eastern gray squirrel",
  "Skunk Ape": "Skunk ape",
  Armadillo: "Nine-banded armadillo",
  "Rhesus Macaque": "Rhesus macaque",
  "Bengal Cat": "Bengal cat",
  "Labrador Retriever": "Labrador Retriever",
  "American Foxhound": "American Foxhound",
  "American Pit Bull Terrier": "American Pit Bull Terrier",
  "Police K-9 (German Shepherd)": "German Shepherd",
};

async function animal(name: string) {
  const title = WIKI_TITLES[name];
  if (!title) return;
  await sleep(700);
  const j = await json(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title.replace(/ /g, "_"))}`);
  const url = j?.thumbnail?.source ?? j?.originalimage?.source;
  if (url) out[`animal:${name}`] = { url, credit: "Wikipedia / Wikimedia Commons", page: j?.content_urls?.desktop?.page ?? "" };
}

const strip = (n: string) =>
  n
    .replace(/\s*\((modded|incl\.[^)]*)\)/i, "")
    .replace(/^'\d\d\s+/, "")
    .replace(/'(\d\d)\s+/, "")
    .trim();

async function gtaWiki(kind: string, name: string) {
  const base = strip(name);
  const words = base.split(" ");
  const candidates = [...new Set([base, words.slice(1).join(" "), `${base} (GTA VI)`, `${words.slice(1).join(" ")} (GTA VI)`].filter((c) => c.length > 2))];
  for (const c of candidates) {
    const j = await json(
      `https://gta.fandom.com/api.php?action=query&titles=${encodeURIComponent(c)}&prop=pageimages|categories&cllimit=50&pithumbsize=600&redirects=1&format=json`,
    );
    await sleep(250);
    const pages = Object.values((j?.query?.pages ?? {}) as Record<string, { title: string; thumbnail?: { source: string }; categories?: { title: string }[]; missing?: string }>);
    for (const p of pages) {
      if (p.missing !== undefined || !p.thumbnail) continue;
      const cats = (p.categories ?? []).map((x) => x.title);
      const isVI = cats.some((t) => /GTA VI|Grand Theft Auto VI/i.test(t));
      const img = p.thumbnail.source;
      if (!isVI || /GTAV[^I]|GTAO|GTAOe|-GTAV\b|GTAIV|GTASA|GTAVC\b/i.test(img)) continue;
      out[`${kind}:${name}`] = { url: img, credit: "GTA Wiki (Fandom)", page: `https://gta.fandom.com/wiki/${encodeURIComponent(p.title.replace(/ /g, "_"))}` };
      return;
    }
  }
}

async function main() {
  for (const a of ANIMALS) if (!out[`animal:${a.en}`]) await animal(a.en);
  writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  if (process.argv.includes("--animals")) return console.log("animals done");
  for (const w of WEAPONS) if (!out[`weapon:${w[0]}`]) await gtaWiki("weapon", w[0]);
  for (const v of VEHICLES) if (!out[`vehicle:${v[0]}`]) await gtaWiki("vehicle", v[0]);
  writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  const count = (k: string) => Object.keys(out).filter((x) => x.startsWith(k)).length;
  console.log(`animals ${count("animal:")}/${ANIMALS.length}, weapons ${count("weapon:")}/${WEAPONS.length}, vehicles ${count("vehicle:")}/${VEHICLES.length}`);
}
main();
