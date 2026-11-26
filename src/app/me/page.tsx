import type { Metadata } from "next";
import { getLocale, getViewer } from "@/lib/session";
import { Profile } from "./Profile";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: locale === "ar" ? "ملفي" : "My progress", robots: { index: false, follow: true } };
}

export default async function MePage() {
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  return (
    <main className="mx-auto max-w-3xl px-4 pt-5">
      <Profile locale={locale} signedIn={viewer.signedIn} name={viewer.name ?? null} />
    </main>
  );
}
