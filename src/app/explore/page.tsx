import type { Metadata } from "next";
import { getCounts } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLocale, getViewer } from "@/lib/session";
import { CategoryGrid } from "@/components/CategoryGrid";
import { SignInGate } from "@/components/SignInGate";

export async function generateMetadata(): Promise<Metadata> {
  return { title: t(await getLocale(), "categories") };
}

export default async function Explore() {
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      <h1 className="mb-1 text-2xl font-black">{t(locale, "categories")}</h1>
      <p className="mb-5 text-sm text-muted">{t(locale, "tagline")}</p>
      {viewer.member ? <CategoryGrid locale={locale} counts={await getCounts()} /> : <SignInGate locale={locale} next="/explore" />}
    </main>
  );
}
