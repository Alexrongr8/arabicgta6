export type Locale = "ar" | "en";

export type Status = "official" | "confirmed" | "leak" | "rumor";

export type CategorySlug =
  | "news"
  | "secrets"
  | "glitches"
  | "money"
  | "weapons"
  | "places"
  | "strange"
  | "characters"
  | "vehicles"
  | "tips";

export interface Fact {
  k_en: string;
  k_ar: string;
  v_en: string;
  v_ar: string;
}

export interface Source {
  title: string;
  url: string;
}

export interface Item {
  slug: string;
  category: CategorySlug;
  status: Status;
  title_en: string;
  title_ar: string;
  summary_en: string;
  summary_ar: string;
  body_en: string;
  body_ar: string;
  aliases: string[];
  tags: string[];
  facts: Fact[];
  /** Pixel position on the official Leonida map poster (2805 × 3840, y grows downwards). */
  location: { x: number; y: number } | null;
  region: string | null;
  related: string[];
  sources: Source[];
  published_at: string;
  featured?: boolean;
}

export type ItemCard = Pick<
  Item,
  | "slug"
  | "category"
  | "status"
  | "title_en"
  | "title_ar"
  | "summary_en"
  | "summary_ar"
  | "published_at"
  | "region"
  | "location"
  | "featured"
>;
