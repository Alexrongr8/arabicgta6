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
