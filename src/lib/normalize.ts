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
    .replace(/['’`".,:;!?()\[\]{}\-_/\\|]+/g, " ")
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
