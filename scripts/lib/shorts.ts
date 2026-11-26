/** Pure helpers for the GTA 6 Shorts collector (no network here, so they are testable offline). */

/** YouTube channels whose Shorts are checked every run. Only GTA 6 titled videos are kept. */
export const SHORTS_CHANNELS = [
  "UC6VcWc1rAoWdBCM0JxrRQ3A", // Rockstar Games
  "UCw81FIQlzaVxgiQKiqTuCBQ", // Bilal Fadili
  "UCxEGVXh6fi-XYo58NZrbIHQ", // BanderitaX
  "UCFlp8ti7kvEMbiqAE8Zazag", // RimaOsta
  "UC6gTOqPVfx6g6Cmi8Ah80pA", // 3mr
  "UCUwf9tuytTCVP6SzMaGwDVA", // Xzit
  "UC5hnxbraFmMPxv63U4hCwTQ", // SXB
  "UCqq5n-Oe-r1EEHI3yvhVJcA", // AboFlah
  "UCRu9mro2nPafhMxVy2CRfXA", // AboFlah (2)
];

/** Public YouTube pages that list GTA 6 Shorts (no API key needed). */
export const SHORTS_PAGES = [
  { url: "https://www.youtube.com/results?search_query=gta+6+shorts", source: "search" },
  { url: "https://www.youtube.com/results?search_query=gta+6", source: "search" },
  { url: "https://www.youtube.com/results?search_query=%D9%82%D8%B1%D8%A7%D9%86%D8%AF+6", source: "search" },
  { url: "https://www.youtube.com/results?search_query=gta+6+secrets", source: "search" },
] as const;

export const shortsFeed = (channelId: string) => `https://www.youtube.com/feeds/videos.xml?playlist_id=UUSH${channelId.slice(2)}`;

const ID = /^[A-Za-z0-9_-]{11}$/;
export const isVideoId = (id: string) => ID.test(id);

/** Video IDs in the order they appear. Search pages: only /shorts/ links. Feeds: every entry. */
export function extractIds(html: string, shortsOnly = false): string[] {
  const out: string[] = [];
  const re = shortsOnly ? /\/shorts\/([A-Za-z0-9_-]{11})/g : /(?:\/shorts\/|<yt:videoId>)([A-Za-z0-9_-]{11})/g;
  for (const m of html.matchAll(re)) if (!out.includes(m[1])) out.push(m[1]);
  return out;
}

const GTA6 = /\b(gta\s*(6|vi)|gta6|gtavi|grand theft auto\s*(6|vi))\b|قراند\s*6|قراند6|جي\s*تي\s*اي\s*6|leonida|ليونيدا/i;
/** A title needs real words, not just hashtags. */
const words = (t: string) => t.replace(/#[^\s#]+/g, " ").replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(" ").filter((w) => w.length > 1).length;
const BLOCK = /🔴|🔞|\blive\b|مباشر|mod\s*menu|download|free\s*(money|robux|vbucks)|apk|hack|cheat\s*engine|giveaway|leak(ed)?\s*(build|download)|\b18\+|nsfw|porn|\bsex|\bnude|naked|onlyfans|strip\s*club|stripper|happy\s*ending|hot\s*scene|shower\s*scene|bath\s*scene|\bdate\s+\w+\s+in\b|مشهد\s*(حمام|ساخن)|حمام\s*لوسيا|إباحي|عاري|indian\s*version/i;

/** Keep only Shorts clearly about GTA 6 and drop spam/cheat bait. */
export function acceptTitle(title: string): boolean {
  const t = title.normalize("NFKC");
  const latinOrArabic = (t.match(/[A-Za-z\u0600-\u06FF]/g) ?? []).length >= t.replace(/\s/g, "").length * 0.5;
  return t.length > 0 && t.length <= 300 && GTA6.test(t) && !BLOCK.test(t) && words(t) >= 3 && latinOrArabic;
}
