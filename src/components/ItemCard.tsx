import Link from "next/link";
import { imageOf } from "@/lib/image";
import { Bidi } from "@/components/Bidi";
import { CATEGORY_MAP } from "@/lib/categories";
import { formatDate, pick } from "@/lib/i18n";
import type { ItemCard as Card, Locale } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";
import { StatusBadge } from "./StatusBadge";
import { Cover } from "./Cover";

export function ItemCard({ item, locale, showCategory = true, index = 0 }: { item: Card; locale: Locale; showCategory?: boolean; index?: number }) {
  const cat = CATEGORY_MAP[item.category];
  return (
    <Link
      href={`/item/${item.slug}`}
      className="card card-hover rise group relative flex gap-3 overflow-hidden p-3.5"
      style={{ animationDelay: `${Math.min(index, 10) * 35}ms` }}
    >
      <span
        className="relative grid size-[76px] shrink-0 place-items-center overflow-hidden rounded-2xl"
        style={{ background: `${cat.color}22`, color: cat.color, boxShadow: `inset 0 0 0 1px ${cat.color}44` }}
      >
        <CategoryIcon category={item.category} className="size-6" />
        <Cover src={imageOf(item)} className="absolute inset-0 size-full object-cover" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-dim">
          {showCategory && (
            <span className="font-bold" style={{ color: cat.color }}>
              {locale === "ar" ? cat.ar : cat.en}
            </span>
          )}
          <StatusBadge status={item.status} locale={locale} />
          <span>{formatDate(item.published_at, locale)}</span>
        </span>
        <span className="block text-[15px] leading-snug font-bold text-fg group-hover:text-pink"><Bidi text={pick(item, "title", locale)} /></span>
        <span className="mt-1 line-clamp-2 block text-[13px] leading-relaxed text-muted"><Bidi text={pick(item, "summary", locale)} /></span>
      </span>
    </Link>
  );
}
