import Link from "next/link";
import { pick } from "@/lib/i18n";
import { isSpoiler } from "@/lib/spoiler";
import type { ItemCard, Locale } from "@/lib/types";

/** Arabic counted noun: 1 دقيقة، 2 دقيقتين، 3-10 دقائق، 11+ دقيقة. */
function arCount(n: number, one: string, two: string, few: string): string {
  if (n === 1) return one;
  if (n === 2) return two;
  return n <= 10 ? `${n} ${few}` : `${n} ${one}`;
}

function ago(iso: string, ar: boolean): string {
  const min = Math.max(1, Math.round((Date.now() - Date.parse(iso)) / 60_000));
  if (min < 60) return ar ? `قبل ${arCount(min, "دقيقة", "دقيقتين", "دقائق")}` : `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return ar ? `قبل ${arCount(h, "ساعة", "ساعتين", "ساعات")}` : `${h}h ago`;
  const d = Math.round(h / 24);
  return ar ? `قبل ${arCount(d, "يوم", "يومين", "أيام")}` : `${d}d ago`;
}

/** "Breaking" strip with the newest headlines, scrolling like a TV news ticker (pure CSS, no JS). */
export function NewsTicker({ items, locale }: { items: ItemCard[]; locale: Locale }) {
  const ar = locale === "ar";
  const list = items.filter((i) => !isSpoiler(i)).slice(0, 12);
  if (!list.length) return null;
  const row = (copy: number) =>
    list.map((i) => (
      <Link key={`${copy}-${i.slug}`} href={`/item/${i.slug}`} tabIndex={copy ? -1 : undefined} aria-hidden={copy ? true : undefined}
        className="inline-flex shrink-0 items-center gap-2 px-4 text-[13px] font-bold text-fg hover:text-accent">
        <span className="size-1.5 shrink-0 rounded-full bg-[#ff3d8b]" aria-hidden />
        <span dir="auto">{pick(i, "title", locale)}</span>
      </Link>
    ));
  return (
    <section aria-label={ar ? "آخر الأخبار" : "Latest headlines"} className="mx-auto mt-3 max-w-6xl px-4">
      <div className="flex items-stretch overflow-hidden rounded-2xl border border-line bg-card shadow-sm">
        <div className="z-10 flex shrink-0 flex-col justify-center bg-gradient-to-l from-[#ff3d8b] to-[#ff7a3d] px-3 py-1.5 text-white">
          <span className="flex items-center gap-1.5 text-[13px] font-extrabold">
            <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-white" /></span>
            {ar ? "عاجل" : "Live"}
          </span>
          <span className="text-[10px] opacity-90">{ago(list[0].published_at, ar)}</span>
        </div>
        <div className="ticker-mask relative min-w-0 flex-1 overflow-hidden py-2.5">
          <div className="ticker-track flex w-max" style={{ animationDuration: `${Math.max(40, list.length * 7)}s` }}>
            <div className="flex">{row(0)}</div>
            <div className="flex">{row(1)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
