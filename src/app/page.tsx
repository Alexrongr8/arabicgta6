import Link from "next/link";
import { Bidi } from "@/components/Bidi";
import { CATEGORY_MAP } from "@/lib/categories";
import { getCounts, getFeatured, getGuestNews, getLatest } from "@/lib/data";
import { pick, t } from "@/lib/i18n";
import { getLocale, getViewer } from "@/lib/session";
import { Hero } from "@/components/Hero";
import { ItemCard } from "@/components/ItemCard";
import { Section } from "@/components/Section";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SignInGate } from "@/components/SignInGate";
import { CategoryIcon } from "@/components/CategoryIcon";
import { StatusBadge } from "@/components/StatusBadge";

export default async function Home() {
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  const counts = await getCounts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  if (!viewer.member) {
    const news = await getGuestNews();
    return (
      <main>
        <Hero locale={locale} total={total} />
        <Section title={t(locale, "latestNews")} locale={locale}>
          <p className="mb-3 rounded-xl border border-sun/25 bg-sun/5 px-3 py-2 text-xs text-sun">{t(locale, "guestNewsNote")}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {news.map((n, i) => (
              <ItemCard key={n.slug} item={n} locale={locale} showCategory={false} index={i} />
            ))}
          </div>
        </Section>
        <div className="mt-10 px-4">
          <SignInGate locale={locale} />
        </div>
      </main>
    );
  }

  const [featured, latest, news] = await Promise.all([getFeatured(), getLatest(10), getLatest(6, "news")]);
  return (
    <main>
      <Hero locale={locale} total={total} />

      <Section title={t(locale, "featured")} locale={locale}>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
          {featured.map((f) => {
            const c = CATEGORY_MAP[f.category];
            return (
              <Link
                key={f.slug}
                href={`/item/${f.slug}`}
                className="card card-hover relative flex w-[78%] shrink-0 snap-start flex-col justify-end overflow-hidden p-4 sm:w-72"
                style={{ minHeight: 190, background: `linear-gradient(160deg, ${c.color}55, rgba(20,10,35,.9) 70%)` }}
              >
                <CategoryIcon category={f.category} className="absolute end-3 top-3 size-16 opacity-25" style={{ color: c.color }} />
                <span className="mb-2 flex items-center gap-2 text-[11px] font-bold" style={{ color: c.color }}>
                  {locale === "ar" ? c.ar : c.en} <StatusBadge status={f.status} locale={locale} />
                </span>
                <span className="text-[17px] leading-snug font-black"><Bidi text={pick(f, "title", locale)} /></span>
                <span className="mt-1 line-clamp-2 text-[12.5px] text-fg/75"><Bidi text={pick(f, "summary", locale)} /></span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section title={t(locale, "categories")} href="/explore" linkLabel={t(locale, "viewAll")} locale={locale}>
        <CategoryGrid locale={locale} counts={counts} />
      </Section>

      <div className="mx-auto grid max-w-6xl gap-x-6 md:grid-cols-2">
        <div>
          <Section title={t(locale, "latestNews")} href="/c/news" linkLabel={t(locale, "viewAll")} locale={locale}>
            <div className="grid gap-3">
              {news.map((n, i) => (
                <ItemCard key={n.slug} item={n} locale={locale} showCategory={false} index={i} />
              ))}
            </div>
          </Section>
        </div>
        <div>
          <Section title={t(locale, "latest")} locale={locale}>
            <div className="grid gap-3">
              {latest.filter((l) => l.category !== "news").slice(0, 6).map((n, i) => (
                <ItemCard key={n.slug} item={n} locale={locale} index={i} />
              ))}
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}
