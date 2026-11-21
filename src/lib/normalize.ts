/** Normalise text for search in both Arabic and English. Shared by app and scripts. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // latin accents
    .replace(/[ً-ٰٟـ]/g, "") // arabic diacritics + tatweel
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)) // Arabic-Indic digits
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0)) // Persian digits
    .replace(/['’`".,:;!?()\[\]{}\-_/\\|،؛؟«»…]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function searchText(i: {
  title_en: string;
  title_ar: string;
  aliases?: string[];
  tags?: string[];
  summary_en?: string;
  summary_ar?: string;
  region?: string | null;
}): string {
  return normalize(
    [i.title_en, i.title_ar, ...(i.aliases ?? []), ...(i.tags ?? []), i.region ?? "", i.summary_en ?? "", i.summary_ar ?? ""].join(
      " | ",
    ),
  );
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Words that only name the game (the whole site is about GTA VI), so they never narrow a search. */
const GAME_WORDS = new Set(["gta", "gtavi", "gta6", "gtav", "قراند", "جراند", "غراند", "grand", "theft", "auto", "جي", "تي", "اي"]);
const GAME_NUMS = new Set(["6", "vi", "سته", "ست", "السادسه"]);
/** Question / filler words in natural Arabic and English queries. */
const STOP_WORDS = new Set([
  "كيف", "وش", "ايش", "شلون", "وين", "متي", "هل", "ما", "ماهي", "ماهو", "هو", "هي", "في", "من", "علي", "عن", "الي", "مع", "او",
  "اجيب", "احصل", "اسوي", "اعمل", "ابي", "ابغي", "ابغا", "طريقه", "طرق", "لعبه", "اللعبه", "داخل",
  "how", "to", "the", "in", "a", "an", "of", "what", "is", "get", "do", "i", "can", "where", "game",
]);
/** A few everyday synonyms mapped to the words our articles use. */
const SYNONYMS: Record<string, string> = { مصاري: "فلوس", كاش: "فلوس", بيزات: "فلوس", money: "فلوس", كودات: "شفرات", اكواد: "شفرات", cheats: "شفرات", fps: "فريم", فريمات: "فريم" };

/** Turn a natural query into the meaningful search terms (normalised). */
export function searchTerms(q: string): string[] {
  const tokens = normalize(q).split(" ").filter(Boolean);
  const out: string[] = [];
  let prevGame = false;
  for (const t of tokens) {
    if (GAME_WORDS.has(t)) {
      prevGame = true;
      continue;
    }
    if (prevGame && GAME_NUMS.has(t)) {
      prevGame = false;
      continue;
    }
    prevGame = false;
    if (STOP_WORDS.has(t)) continue;
    out.push(SYNONYMS[t] ?? t);
  }
  return [...new Set(out)];
}
