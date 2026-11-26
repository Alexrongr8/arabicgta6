/**
 * Read-only check of how well the radar's own page reader reaches common news sites from the runner.
 * Prints status, size and time per site with the radar's limits and with wider limits. Writes nothing.
 */
import { safeGet } from "../../src/lib/safe-fetch";

const SITES = [
  "https://www.rockstargames.com/newswire", "https://www.pcgamer.com/", "https://www.techradar.com/gaming", "https://www.ign.com/games/grand-theft-auto-vi",
  "https://www.gamespot.com/", "https://www.eurogamer.net/", "https://www.videogameschronicle.com/", "https://kotaku.com/", "https://www.polygon.com/",
  "https://www.reddit.com/r/GTA6/", "https://old.reddit.com/r/GTA6/", "https://www.gamesradar.com/", "https://www.dexerto.com/gta/", "https://insider-gaming.com/",
  "https://www.theverge.com/games", "https://gamerant.com/", "https://www.thegamer.com/", "https://www.saudigamer.com/", "https://www.arageek.com/", "https://x.com/RockstarGames",
];

async function probe(url: string, timeoutMs: number, maxBytes: number) {
  const t = Date.now();
  const r = await safeGet(url, { timeoutMs, maxBytes, accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8" });
  return `${r ? r.status : "none"} ${r ? Math.round(r.body.length / 1024) + "KB" : "-"} ${Date.now() - t}ms`;
}

async function main() {
  for (const url of SITES) {
    const narrow = await probe(url, 5000, 750_000);
    const wide = await probe(url, 9000, 3_000_000);
    console.log(`SITE ${new URL(url).hostname.padEnd(28)} radar-limits: ${narrow.padEnd(22)} wide: ${wide}`);
  }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1; });
