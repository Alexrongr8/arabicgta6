import type { Locale } from "@/lib/types";

export const SOURCE_UNKNOWN_TAG = "source-unknown";
export const sourceUnknown = (tags?: string[] | null) => Array.isArray(tags) && tags.includes(SOURCE_UNKNOWN_TAG);

/** Honest marker for automatically published items whose source could not be verified. */
export function SourceUnknownBadge({ locale, size = "sm" }: { locale: Locale; size?: "sm" | "md" }) {
  return (
    <span className={`inline-flex items-center rounded-full border border-amber-500/50 bg-amber-400/15 font-bold text-amber-700 dark:text-amber-300 ${size === "md" ? "px-2.5 py-1 text-[12px]" : "px-2 py-0.5 text-[11px]"}`}
      title={locale === "ar" ? "ما قدرنا نتحقق من مصدر هذا الخبر" : "We could not verify this item's source"}>
      {locale === "ar" ? "مصدر غير معروف" : "Unknown source"}
    </span>
  );
}
