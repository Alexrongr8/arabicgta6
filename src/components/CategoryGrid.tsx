import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import type { Locale } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";

export function CategoryGrid({ locale, counts }: { locale: Locale; counts: Record<string, number> }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {CATEGORIES.map((c, i) => (
        <Link
          key={c.slug}
          href={`/c/${c.slug}`}
          className="card card-hover rise relative overflow-hidden p-4"
          style={{ animationDelay: `${i * 30}ms` }}
        >
          <div className="pointer-events-none absolute -end-6 -top-6 size-24 rounded-full blur-2xl" style={{ background: `${c.color}40` }} />
          <span className="relative mb-3 grid size-11 place-items-center rounded-2xl" style={{ background: `${c.color}26`, color: c.color }}>
            <CategoryIcon category={c.slug} className="size-5" />
          </span>
          <span className="relative block text-[15px] font-extrabold">{locale === "ar" ? c.ar : c.en}</span>
          <span className="relative mt-0.5 line-clamp-2 block text-[12px] leading-relaxed text-muted">{locale === "ar" ? c.descAr : c.descEn}</span>
          <span className="relative mt-2 block font-display text-lg text-fg">
            {counts[c.slug] ?? 0}
          </span>
        </Link>
      ))}
    </div>
  );
}

export function CategoryChips({ locale, active }: { locale: Locale; active?: string }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
      {CATEGORIES.map((c) => {
        const on = c.slug === active;
        return (
          <Link
            key={c.slug}
            href={`/c/${c.slug}`}
            aria-current={on ? "page" : undefined}
            className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-[13px] font-bold transition ${
              on ? "border-transparent text-black" : "border-line bg-chip text-muted"
            }`}
            style={on ? { background: c.color } : undefined}
          >
            <CategoryIcon category={c.slug} className="size-4" style={on ? undefined : { color: c.color }} />
            {locale === "ar" ? c.ar : c.en}
          </Link>
        );
      })}
    </div>
  );
}
