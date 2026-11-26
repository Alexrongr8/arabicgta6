import { publicMetadata } from "@/lib/public-metadata";
import Link from "next/link";
import { categoryThumb, thumbFor } from "@/lib/image";
import { Bidi } from "@/components/Bidi";
import { CATEGORY_MAP } from "@/lib/categories";
import { getCounts, getDailyPool, getFeatured, getLatest, getShorts, type Short } from "@/lib/data";
import { ShortsRail } from "@/components/ShortsRail";
import { NewsTicker } from "@/components/NewsTicker";
import { pickDaily, weeklyChallenge } from "@/lib/daily";
import { DailyCards } from "@/components/DailyCards";
import { CatalogTiles } from "@/components/CatalogTiles";
import { pick, t } from "@/lib/i18n";
import { getLocale, getViewer } from "@/lib/session";
import { Hero } from "@/components/Hero";
import { ItemCard } from "@/components/ItemCard";
import { Section } from "@/components/Section";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SignInGate } from "@/components/SignInGate";
import { Cover } from "@/components/Cover";
import { StatusBadge } from "@/components/StatusBadge";
import { LiveDesk } from "@/components/LiveDesk";
import { PlayerHub } from "@/components/player/PlayerHub";
import { ago } from "@/lib/ago";
import { isSpoiler } from "@/lib/spoiler";

export async function generateMetadata() {
  const locale = await getLocale();
  const title = `${t(locale, "siteName")} — ${locale === "ar" ? "أسرار وأخبار وخريطة" : "secrets, news & map"}`;
  return { ...publicMetadata("/", locale, { title }), title: { absolute: title } };
}

export default async function Home() {
  const [locale, viewer, counts, featured, latest, news, pool, shorts] = await Promise.all([
    getLocale(), getViewer(), getCounts(), getFeatured(), getLatest(40), getLatest(14, "news"), getDailyPool(),
    getShorts(20).catch(() => [] as Short[]), // the shorts strip must never take the homepage down
  ]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const secret = pickDaily(pool);
  const challenge = weeklyChallenge();
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const today = latest.filter((i) => now - Date.parse(i.published_at) < 864e5).length;
  // The front page shows the newest stories of every section; the news column below skips what is already there.
  const desk = latest.filter((i) => !isSpoiler(i)).slice(0, 6);
  const onDesk = new Set(desk.map((i) => i.slug));
  return (
    <main>
      <NewsTicker items={latest} locale={locale} />
      <Hero locale={locale} total={total} live={latest[0] ? { today, last: ago(latest[0].published_at, locale, now), fresh: now - Date.parse(latest[0].published_at) < 12 * 3600e3 } : undefined} />
      <ShortsRail shorts={shorts} locale={locale} />
      <PlayerHub locale={locale} stamps={latest.map((i) => i.published_at)} />

      <div id="latest" className="scroll-mt-20">
        <Section title={locale === "ar" ? "الحين في Leonida 🔴" : "Right now in Leonida 🔴"} href="/c/news" linkLabel={locale === "ar" ? "كل الأخبار" : "All news"} locale={locale}>
          <LiveDesk items={desk} locale={locale} />
        </Section>
      </div>

      <DailyCards secret={secret} challenge={challenge} locale={locale} />

      <Section title={t(locale, "featured")} locale={locale}>
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
          {featured.map((f, rank) => {
            const c = CATEGORY_MAP[f.category];
            return (
              <Link
                key={f.slug}
                href={`/item/${f.slug}`}
                className="card-hover relative flex w-[80%] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-3xl p-4 text-white shadow-lg sm:w-72"
                style={{ minHeight: 210, background: `linear-gradient(160deg, ${c.color}, #2a1240)` }}
              >
                <Cover src={thumbFor(f, 640)} fallback={categoryThumb(f.category, 640)} className="absolute inset-0 size-full object-cover" />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <span className="font-display absolute top-2 text-[54px] leading-none text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,.7)] ltr:left-3 rtl:right-3" dir="ltr" aria-hidden>{rank + 1}</span>
                <span className="relative mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full px-2 py-0.5 text-[11px] font-extrabold text-black" style={{ background: c.color }}>
                    {locale === "ar" ? c.ar : c.en}
                  </span>
                  <StatusBadge status={f.status} locale={locale} />
                </span>
                <span className="font-head relative text-[19px] leading-snug"><Bidi text={pick(f, "title", locale)} /></span>
                <span className="relative mt-1 line-clamp-2 text-[12.5px] text-white/85"><Bidi text={pick(f, "summary", locale)} /></span>
              </Link>
            );
          })}
        </div>
      </Section>

      <Section title={t(locale, "categories")} href="/explore" linkLabel={locale === "ar" ? "كل الأقسام" : "All categories"} locale={locale}>
        <CategoryGrid locale={locale} counts={counts} />
      </Section>


      <section className="mx-auto mt-3 max-w-6xl px-4">
        <Link href="/community" className="card-hover flex items-center gap-4 overflow-hidden rounded-3xl p-4 text-white shadow-lg" style={{ background: "linear-gradient(#0006,#0006), linear-gradient(135deg,#0f9f97,#7c3aed)" }}>
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/15 text-3xl">🕵️</span>
          <span className="flex-1">
            <span className="font-head block text-[20px] leading-tight">{locale === "ar" ? "اكتشافات اللاعبين" : "Player discoveries"}</span>
            <span className="mt-0.5 block text-[12.5px] text-white/85">{locale === "ar" ? "لقيت سر أو قلتش؟ انشره باسمك وخل اللاعبين يصوتون" : "Found a secret or glitch? Post it under your name"}</span>
          </span>
        </Link>
      </section>

      {!viewer.signedIn && (
        <div className="mx-auto mt-8 max-w-6xl px-4">
          <SignInGate locale={locale} />
        </div>
      )}

      <div className="mx-auto grid max-w-6xl gap-x-6 md:grid-cols-2">
        <div>
          <Section title={t(locale, "latestNews")} href="/c/news" linkLabel={locale === "ar" ? "كل الأخبار" : "All news"} locale={locale}>
            <div className="grid gap-3">
              {news.filter((n) => !onDesk.has(n.slug)).slice(0, 6).map((n, i) => (
                <ItemCard key={n.slug} item={n} locale={locale} showCategory={false} index={i} />
              ))}
            </div>
          </Section>
        </div>
        <div>
          <Section title={t(locale, "latest")} locale={locale}>
            <div className="grid gap-3">
              {latest.filter((l) => l.category !== "news" && !onDesk.has(l.slug)).slice(0, 6).map((n, i) => (
                <ItemCard key={n.slug} item={n} locale={locale} index={i} />
              ))}
            </div>
          </Section>
        </div>
      </div>

      <Section title={locale === "ar" ? "الكتالوج 📚" : "Catalogs 📚"} locale={locale}>
        <CatalogTiles locale={locale} />
      </Section>
    </main>
  );
}
