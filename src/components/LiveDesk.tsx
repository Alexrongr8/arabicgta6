import Link from "next/link";
import { categoryThumb, thumbFor } from "@/lib/image";
import { CATEGORY_MAP } from "@/lib/categories";
import { pick } from "@/lib/i18n";
import { ago } from "@/lib/ago";
import { isSpoiler } from "@/lib/spoiler";
import type { ItemCard, Locale } from "@/lib/types";
import { Bidi } from "./Bidi";
import { Cover } from "./Cover";
import { StatusBadge } from "./StatusBadge";
import { CardMarks } from "./player/CardMarks";

/** Front page: the newest story large, the next ones as a tight list. This is the first thing a returning reader wants. */
export function LiveDesk({ items, locale }: { items: ItemCard[]; locale: Locale }) {
  const ar = locale === "ar";
  const list = items.filter((i) => !isSpoiler(i));
  const lead = list[0];
  if (!lead) return null;
  const rest = list.slice(1, 6);
  const cat = CATEGORY_MAP[lead.category];
  return (
    <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr]">
      <Link href={`/item/${lead.slug}`} className="card-hover group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-3xl p-4 text-white shadow-lg md:min-h-[380px] md:p-6"
        style={{ background: `linear-gradient(160deg, ${cat.color}, #2a1240)` }}>
        <Cover src={thumbFor(lead, 1280)} fallback={categoryThumb(lead.category, 1280)} className="absolute inset-0 size-full object-cover transition duration-500 group-hover:scale-[1.03]" eager />
        <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/5" />
        <span className="relative mb-2 flex flex-wrap items-center gap-2 text-[11.5px]">
          <span className="rounded-full bg-[#f0287a] px-2.5 py-0.5 font-extrabold text-black">{ar ? "آخر خبر" : "Latest"}</span>
          <span className="rounded-full px-2 py-0.5 font-extrabold text-black" style={{ background: cat.color }}>{ar ? cat.ar : cat.en}</span>
          <StatusBadge status={lead.status} locale={locale} />
          <span className="font-bold text-white/85">{ago(lead.published_at, locale)}</span>
          <CardMarks slug={lead.slug} at={lead.published_at} ar={ar} />
        </span>
        <span className="font-head relative text-[25px] leading-snug drop-shadow md:text-[34px]"><Bidi text={pick(lead, "title", locale)} /></span>
        <span className="relative mt-1.5 line-clamp-2 max-w-2xl text-[13.5px] leading-relaxed text-white/90 md:text-[15px]"><Bidi text={pick(lead, "summary", locale)} /></span>
      </Link>
      <ol className="card divide-y divide-line overflow-hidden">
        {rest.map((item) => {
          const c = CATEGORY_MAP[item.category];
          return (
            <li key={item.slug}>
              <Link href={`/item/${item.slug}`} className="group flex items-center gap-3 p-3 hover:bg-chip">
                <span className="relative size-[62px] shrink-0 overflow-hidden rounded-xl" style={{ background: `${c.color}22` }}>
                  <Cover src={thumbFor(item, 228)} fallback={categoryThumb(item.category, 228)} className="absolute inset-0 size-full object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="mb-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-dim">
                    <span className="font-extrabold" style={{ color: c.color }}>{ar ? c.ar : c.en}</span>
                    <span>{ago(item.published_at, locale)}</span>
                    <CardMarks slug={item.slug} at={item.published_at} ar={ar} />
                  </span>
                  <span className="line-clamp-2 block text-[14.5px] leading-snug font-bold text-fg group-hover:text-accent"><Bidi text={pick(item, "title", locale)} /></span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
