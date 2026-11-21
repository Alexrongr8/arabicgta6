import type { Metadata } from "next";
import { Bidi } from "@/components/Bidi";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";
import { CATEGORY_MAP } from "@/lib/categories";
import { getBySlugs, getItem, itemExists } from "@/lib/data";
import { formatDate, pick, t } from "@/lib/i18n";
import { getLocale, getViewer } from "@/lib/session";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ItemCard } from "@/components/ItemCard";
import { Prose } from "@/components/Prose";
import { SignInGate } from "@/components/SignInGate";
import { StatusBadge } from "@/components/StatusBadge";
import { ShareButton } from "@/components/ShareButton";
import { Cover, imageCredit } from "@/components/Cover";

export async function generateMetadata({ params }: PageProps<"/item/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const teaser = await itemExists(slug);
  if (!teaser) return {};
  return { title: locale === "ar" ? teaser.title_ar : teaser.title_en };
}

export default async function ItemPage({ params }: PageProps<"/item/[slug]">) {
  const { slug } = await params;
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  const item = await getItem(slug, viewer.member);

  if (!item) {
    const teaser = await itemExists(slug);
    if (!teaser) notFound();
    const c = CATEGORY_MAP[teaser.category];
    return (
      <main className="mx-auto max-w-3xl px-4 pt-8">
        <p className="mb-2 text-center text-xs font-bold" style={{ color: c.color }}>
          {locale === "ar" ? c.ar : c.en}
        </p>
        <h1 className="mb-6 text-center text-2xl font-extrabold"><Bidi text={locale === "ar" ? teaser.title_ar : teaser.title_en} /></h1>
        <SignInGate locale={locale} next={`/item/${slug}`} />
      </main>
    );
  }

  const c = CATEGORY_MAP[item.category];
  const related = viewer.member ? await getBySlugs(item.related) : [];
  const body = pick(item, "body", locale);

  return (
    <main className="mx-auto max-w-5xl px-4 pt-5">
      <nav className="mb-4 flex items-center gap-2 text-xs text-dim">
        <Link href="/explore" className="hover:text-fg">{t(locale, "explore")}</Link>
        <span>/</span>
        <Link href={`/c/${item.category}`} className="font-bold" style={{ color: c.color }}>
          {locale === "ar" ? c.ar : c.en}
        </Link>
      </nav>

      <article className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {item.image && (
            <figure className="relative mb-4 overflow-hidden rounded-3xl border border-line bg-chip">
              <Cover src={item.image} eager className="aspect-[16/9] w-full object-cover" alt={pick(item, "title", locale)} />
              <figcaption className="absolute bottom-2 end-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-white/85" dir="ltr">
                📷 {imageCredit(item.image)}
              </figcaption>
            </figure>
          )}
          <header className="relative mb-5 overflow-hidden rounded-3xl border border-line p-5 shadow-sm md:p-7" style={{ background: `linear-gradient(150deg, ${c.color}30, var(--card) 70%)` }}>
            <CategoryIcon category={item.category} className="absolute -end-4 -top-4 size-32 opacity-15" style={{ color: c.color }} />
            <div className="relative mb-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={item.status} locale={locale} size="md" />
              <span className="text-xs text-muted">
                {t(locale, "updated")} {formatDate(item.published_at, locale)}
              </span>
            </div>
            <h1 className="relative text-[28px] leading-snug md:text-4xl"><Bidi text={pick(item, "title", locale)} /></h1>
            {locale === "ar" && item.title_en && !item.title_ar.includes(item.title_en) && (
              <p className="relative mt-1 font-display text-sm tracking-wide text-dim" dir="ltr">{item.title_en}</p>
            )}
            <p className="relative mt-3 text-[15px] leading-relaxed text-fg"><Bidi text={pick(item, "summary", locale)} /></p>
            <div className="relative mt-4 flex flex-wrap gap-2">
              {item.location && (
                <Link href={`/map?focus=${item.slug}`} className="bg-sunset inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-extrabold text-white shadow-md shadow-pink/30">
                  <MapPin className="size-4" /> {t(locale, "showOnMap")}
                </Link>
              )}
              <ShareButton title={pick(item, "title", locale)} label={locale === "ar" ? "مشاركة" : "Share"} />
            </div>
          </header>

          {/* Infobox on mobile comes before the body, like a wiki */}
          <Infobox item={item} locale={locale} className="mb-5 lg:hidden" />

          <div className="card p-5 md:p-7">
            <Prose text={body} />
          </div>

          {item.sources.length > 0 && (
            <section className="mt-5">
              <h2 className="mb-2 text-sm font-extrabold text-muted">{t(locale, "sources")}</h2>
              <ul className="space-y-1.5">
                {item.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="inline-flex items-center gap-1.5 text-[13px] text-teal hover:underline" dir="ltr">
                      <ExternalLink className="size-3.5 shrink-0" /> {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="hidden lg:block">
          <Infobox item={item} locale={locale} className="sticky top-20" />
        </aside>
      </article>

      {related.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-extrabold">{t(locale, "related")}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {related.map((r, i) => (
              <ItemCard key={r.slug} item={r} locale={locale} index={i} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function Infobox({ item, locale, className = "" }: { item: Awaited<ReturnType<typeof getItem>> & object; locale: "ar" | "en"; className?: string }) {
  const c = CATEGORY_MAP[item.category];
  const rows: { k: string; v: string }[] = [
    { k: t(locale, "category"), v: locale === "ar" ? c.ar : c.en },
    ...(item.region ? [{ k: t(locale, "region"), v: item.region }] : []),
    ...item.facts.map((f) => ({ k: locale === "ar" ? f.k_ar : f.k_en, v: locale === "ar" ? f.v_ar : f.v_en })),
  ];
  return (
    <div className={`card overflow-hidden ${className}`}>
      <div className="flex items-center gap-2 px-4 py-3 text-sm font-extrabold" style={{ background: `${c.color}30` }}>
        <CategoryIcon category={item.category} className="size-4" style={{ color: c.color }} />
        {t(locale, "quickFacts")}
      </div>
      <dl className="divide-y divide-line">
        {rows.map((r) => (
          <div key={r.k} className="grid grid-cols-[42%_1fr] gap-3 px-4 py-2.5 text-[13px]">
            <dt className="text-dim">{r.k}</dt>
            <dd className="font-bold"><Bidi text={r.v} /></dd>
          </div>
        ))}
      </dl>
      {item.aliases.length > 0 && (
        <div className="flex flex-wrap gap-1.5 border-t border-line px-4 py-3">
          {item.aliases.slice(0, 8).map((a) => (
            <Link key={a} href={`/search?q=${encodeURIComponent(a)}`} className="rounded-full bg-chip px-2 py-0.5 text-[11px] text-muted hover:text-fg">
              {a}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
