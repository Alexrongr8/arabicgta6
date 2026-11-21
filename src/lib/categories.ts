import type { CategorySlug, Status } from "./types";

export interface CategoryMeta {
  slug: CategorySlug;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
  /** lucide icon name, resolved in components/CategoryIcon */
  icon: string;
  color: string;
  /** Wiki-style entity (weapon, place, person, vehicle) vs. article */
  entity: boolean;
}

export const CATEGORIES: CategoryMeta[] = [
  { slug: "news", ar: "الأخبار", en: "News", descAr: "آخر أخبار اللعبة والتحديثات والإعلانات", descEn: "Latest announcements, updates and headlines", icon: "newspaper", color: "#ff4f8b", entity: false },
  { slug: "secrets", ar: "الأسرار", en: "Secrets", descAr: "أسرار وبيض عيد الفصح مخفية في ليونيدا", descEn: "Hidden easter eggs and secrets across Leonida", icon: "key-round", color: "#a855f7", entity: false },
  { slug: "money", ar: "طرق الفلوس", en: "Money methods", descAr: "أسرع وأضمن طرق جمع الفلوس", descEn: "Fastest and safest ways to make cash", icon: "banknote", color: "#22c55e", entity: false },
  { slug: "weapons", ar: "الأسلحة النادرة", en: "Rare weapons", descAr: "أماكن الأسلحة الفريدة والنادرة", descEn: "Where to find unique and rare weapons", icon: "crosshair", color: "#f97316", entity: true },
  { slug: "places", ar: "الخريطة والمعالم", en: "Map & landmarks", descAr: "مناطق ليونيدا ومعالمها", descEn: "Regions and landmarks of Leonida", icon: "map-pinned", color: "#06b6d4", entity: true },
  { slug: "characters", ar: "الشخصيات", en: "Characters", descAr: "أبطال القصة وكل الشخصيات", descEn: "The protagonists and the full cast", icon: "users", color: "#f43f5e", entity: true },
  { slug: "vehicles", ar: "المركبات", en: "Vehicles", descAr: "أسرع السيارات وأندرها وأماكنها", descEn: "Fastest and rarest rides and where to find them", icon: "car-front", color: "#eab308", entity: true },
  { slug: "glitches", ar: "القلتشات", en: "Glitches", descAr: "قلتشات ومشاكل مكتشفة وحلولها", descEn: "Known glitches, bugs and fixes", icon: "bug", color: "#ef4444", entity: false },
  { slug: "strange", ar: "أشياء غريبة", en: "Strange things", descAr: "ظواهر غريبة وألغاز في عالم اللعبة", descEn: "Weird sightings and mysteries", icon: "ghost", color: "#8b5cf6", entity: false },
  { slug: "tips", ar: "نصائح وأدلة", en: "Tips & guides", descAr: "نصائح للمبتدئين والمحترفين", descEn: "Tips for beginners and pros", icon: "lightbulb", color: "#14b8a6", entity: false },
];

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.slug, c])) as Record<
  CategorySlug,
  CategoryMeta
>;

export function isCategory(s: string): s is CategorySlug {
  return s in CATEGORY_MAP;
}

export const STATUS_META: Record<Status, { ar: string; en: string; color: string; hintAr: string; hintEn: string }> = {
  official: { ar: "رسمي", en: "Official", color: "#22c55e", hintAr: "صادر من Rockstar أو Take-Two", hintEn: "From Rockstar or Take-Two" },
  confirmed: { ar: "مؤكد باللعبة", en: "In-game", color: "#38bdf8", hintAr: "تحقق منه اللاعبون داخل اللعبة", hintEn: "Verified by players in the game" },
  leak: { ar: "تسريب", en: "Leak", color: "#f59e0b", hintAr: "من تسريبات غير رسمية", hintEn: "From unofficial leaks" },
  rumor: { ar: "غير مؤكد", en: "Unverified", color: "#f43f5e", hintAr: "إشاعة أو معلومة لم تتأكد بعد", hintEn: "Rumour or not yet verified" },
};
