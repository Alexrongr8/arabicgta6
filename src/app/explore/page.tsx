import { publicMetadata } from "@/lib/public-metadata";
import Link from "next/link";
import { CatalogTiles } from "@/components/CatalogTiles";
import type { Metadata } from "next";
import { getCounts } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/session";
import { CategoryGrid } from "@/components/CategoryGrid";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return publicMetadata("/explore", locale, { title: t(locale, "categories") });
}

export default async function Explore() {
  const locale = await getLocale();
  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      <h1 className="mb-1 text-2xl font-extrabold">{t(locale, "categories")}</h1>
      <p className="mb-5 text-sm text-muted">{t(locale, "tagline")}</p>
      <div className="mb-4">
        <CatalogTiles locale={locale} />
      </div>
      <Link href="/community" className="card-hover mb-4 flex items-center gap-3 rounded-3xl p-4 text-white shadow-lg" style={{ background: "linear-gradient(#0006,#0006), linear-gradient(135deg,#0f9f97,#7c3aed)" }}>
        <span className="text-3xl">🕵️</span>
        <span className="font-head text-[19px]">{locale === "ar" ? "اكتشافات اللاعبين — شارك اكتشافك باسمك" : "Player discoveries — share yours"}</span>
      </Link>
      <CategoryGrid locale={locale} counts={await getCounts()} />
    </main>
  );
}
