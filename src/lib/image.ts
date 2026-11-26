/** Who to credit for a cover image. */
export function imageCredit(src: string): string {
  if (src.startsWith("/img/")) return "Rockstar Games";
  try {
    return new URL(src).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * Official Rockstar Games media used when an article has no picture of its own, so every card has an image.
 * The first picture of each category is its neutral one (spoiler cards, failed loads). The others add variety,
 * so a run of stories without their own picture does not repeat one image down the page.
 */
const FALLBACK: Record<string, string[]> = {
  news: ["vice-city", "out-now", "ultimate", "cheetah"],
  secrets: ["lucia", "vice-city", "vintage"],
  money: ["jason-lucia", "ultimate", "cheetah"],
  weapons: ["revolvers", "lucia", "out-now"],
  places: ["vice-city", "cheetah", "ultimate"],
  characters: ["jason-lucia", "out-now", "vintage", "lucia"],
  vehicles: ["cheetah", "ultimate"],
  glitches: ["lucia", "vice-city", "revolvers"],
  strange: ["vintage", "vice-city", "lucia"],
  funny: ["jason-lucia", "ultimate", "vintage"],
  choices: ["lucia", "rooftop"],
  streamers: ["cheetah", "out-now", "vice-city"],
  tips: ["ultimate", "rooftop", "vice-city"],
};

/** Stable small hash, so one article always gets the same fallback picture. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
}

export function imageOf(i: { image?: string | null; category: string; slug?: string }): string {
  if (i.image) return i.image;
  const pool = FALLBACK[i.category] ?? FALLBACK.news;
  return `/img/${pool[i.slug ? hash(i.slug) % pool.length : 0]}.webp`;
}

export const THUMB_WIDTHS = [228, 640, 1280] as const;
export type ThumbWidth = (typeof THUMB_WIDTHS)[number];

/** Prebuilt variants of shared official images (public/img/thumb/<name>-<width>.webp). */
function localThumb(src: string, width: ThumbWidth): string {
  const m = src.match(/^\/img\/([a-z0-9-]+)\.webp$/);
  return m ? `/img/thumb/${m[1]}-${width}.webp` : src;
}

/**
 * Small, cached version of an article's cover for cards: 228 = square card thumbnail,
 * 640 = 16:9 featured card;1280 = article hero. Local official images use prebuilt variants; remote covers go
 * through /t/<slug> (resized once, then CDN-cached).
 */
export function thumbFor(i: { slug: string; image?: string | null; category: string }, width: ThumbWidth): string {
  const src = imageOf(i);
  return src.startsWith("/") ? localThumb(src, width) : `/t/${encodeURIComponent(i.slug)}?w=${width}`;
}

/** Small version of the category's neutral official image (used for spoiler cards). */
export function categoryThumb(category: string, width: ThumbWidth): string {
  return localThumb(imageOf({ category }), width);
}
