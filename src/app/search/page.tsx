import type { Metadata } from "next";
import { search } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/session";
import { SearchClient } from "@/components/SearchClient";
import { searchCatalog } from "@/lib/catalog-search";

export async function generateMetadata(): Promise<Metadata> {
  // Internal search results: crawlable but not indexed (curated /guides pages are the landing pages).
  return { title: t(await getLocale(), "search"), robots: { index: false, follow: true } };
}

const POPULAR = ["Vice City", "Lucia", "Jason", "UFO", "Infernus", "شوزن", "فلوس", "Port Gellhorn", "غش", "Skunk Ape"];

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const locale = await getLocale();
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const initial = q ? await search(q, 30) : [];
  return (
    <main className="mx-auto max-w-3xl px-4 pt-5">
      <SearchClient
        locale={locale}
        initialQuery={q}
        initialResults={initial}
        initialCatalog={q ? searchCatalog(q) : []}
        popular={POPULAR}
        labels={{
          placeholder: t(locale, "searchPlaceholder"),
          empty: t(locale, "searchEmpty"),
          hint: t(locale, "searchHint"),
          popular: t(locale, "popular"),
          results: t(locale, "results"),
        }}
      />
    </main>
  );
}
