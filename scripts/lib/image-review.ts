import { checkPublicHttpsUrl } from "../../src/lib/safe-fetch";
import { urlKey } from "./url-key";
import type { SourceReader } from "./radar-policy";
/** A page preview is a candidate, never verified visual identity or game provenance. */
export async function imageCandidates(pages: string[], retrieved: string[], read: SourceReader) {
  const found = new Set(retrieved.map(urlKey));
  const result: { page: string; finalUrl: string; image: string | null; status: "needs-visual-and-game-verification" }[] = [];
  for (const page of [...new Set(pages)].slice(0, 3)) {
    if (!checkPublicHttpsUrl(page) || !found.has(urlKey(page))) continue;
    const response = await read(page);
    if (!response || response.status !== 200 || !/html/i.test(response.contentType)) continue;
    const html = response.body.toString("utf8");
    let image: string | null = null;
    for (const tag of html.match(/<meta\s[^>]*>/gi) ?? []) {
      if (!/\b(?:property|name)\s*=\s*["']og:image["']/i.test(tag)) continue;
      const value = tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1]?.replace(/&amp;/g, "&");
      if (value) { try { const candidate = new URL(value, response.finalUrl).href; if (checkPublicHttpsUrl(candidate)) image = candidate; } catch {} }
      break;
    }
    result.push({ page, finalUrl: response.finalUrl, image, status: "needs-visual-and-game-verification" });
  }
  return result;
}
