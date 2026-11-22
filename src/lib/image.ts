/** Who to credit for a cover image. */
export function imageCredit(src: string): string {
  if (src.startsWith("/img/")) return "Rockstar Games";
  try {
    return new URL(src).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/** Official Rockstar Games media used when an article has no picture of its own, so every card has an image. */
const FALLBACK: Record<string, string> = {
  news: "/img/out-now.webp",
  secrets: "/img/rooftop.webp",
  money: "/img/jason-lucia.webp",
  weapons: "/img/revolvers.webp",
  places: "/img/vice-city.webp",
  characters: "/img/jason-lucia.webp",
  vehicles: "/img/cheetah.webp",
  glitches: "/img/lucia.webp",
  strange: "/img/vintage.webp",
  funny: "/img/rooftop.webp",
  choices: "/img/lucia.webp",
  streamers: "/img/out-now.webp",
  tips: "/img/ultimate.webp",
};

export function imageOf(i: { image?: string | null; category: string }): string {
  return i.image || FALLBACK[i.category] || "/img/vice-city.webp";
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
