import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORY_MAP, isCategory } from "@/lib/categories";
import { getCategory, getGuestNews } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLocale, getViewer } from "@/lib/session";
import { CategoryChips } from "@/components/CategoryGrid";
import { CategoryIcon } from "@/components/CategoryIcon";
import { ItemCard } from "@/components/ItemCard";
import { SignInGate } from "@/components/SignInGate";
import { StatusFilter } from "@/components/StatusFilter";
import type { Status } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/c/[category]">): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  const locale = await getLocale();
  const c = CATEGORY_MAP[category];
  return { title: locale === "ar" ? c.ar : c.en, description: locale === "ar" ? c.descAr : c.descEn };
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/c/[category]">) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? (sp.status as Status) : undefined;
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  const c = CATEGORY_MAP[category];

  const guestNews = !viewer.member && category === "news";
  const items = viewer.member ? await getCategory(category) : guestNews ? await getGuestNews() : [];
  const shown = status ? items.filter((i) => i.status === status) : items;

  return (
    <main className="mx-auto max-w-6xl px-4 pt-5">
      <CategoryChips locale={locale} active={category} />
      <header className="relative mt-5 mb-5 overflow-hidden rounded-3xl p-5" style={{ background: `linear-gradient(135deg, ${c.color}40, var(--card))` }}>
        <CategoryIcon category={category} className="absolute -end-3 -bottom-4 size-28 opacity-20" style={{ color: c.color }} />
        <h1 className="relative text-2xl font-extrabold md:text-3xl">{locale === "ar" ? c.ar : c.en}</h1>
        <p className="relative mt-1 text-sm text-muted">{locale === "ar" ? c.descAr : c.descEn}</p>
        {viewer.member && (
          <p className="relative mt-2 font-display text-lg" style={{ color: c.color }}>
            {items.length} <span className="font-sans text-xs text-muted">{t(locale, "items")}</span>
          </p>
        )}
      </header>

      {viewer.member || guestNews ? (
        <>
          {guestNews && <p className="mb-3 rounded-xl border border-sun/25 bg-sun/5 px-3 py-2 text-xs text-sun">{t(locale, "guestNewsNote")}</p>}
          {viewer.member && <StatusFilter locale={locale} active={status} />}
          <div className="grid gap-3 md:grid-cols-2">
            {shown.map((i, n) => (
              <ItemCard key={i.slug} item={i} locale={locale} showCategory={false} index={n} />
            ))}
          </div>
          {guestNews && (
            <div className="mt-8">
              <SignInGate locale={locale} next={`/c/${category}`} />
            </div>
          )}
        </>
      ) : (
        <SignInGate locale={locale} next={`/c/${category}`} title={locale === "ar" ? c.ar : c.en} />
      )}
    </main>
  );
}
