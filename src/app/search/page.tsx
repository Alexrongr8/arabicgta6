import type { Metadata } from "next";
import { search } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLocale, getViewer } from "@/lib/session";
import { SearchClient } from "@/components/SearchClient";
import { SignInGate } from "@/components/SignInGate";

export async function generateMetadata(): Promise<Metadata> {
  return { title: t(await getLocale(), "search") };
}

const POPULAR = ["Vice City", "Lucia", "Jason", "UFO", "Infernus", "شوزن", "فلوس", "Port Gellhorn", "غش", "Skunk Ape"];

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  if (!viewer.member) {
    return (
      <main className="mx-auto max-w-3xl px-4 pt-8">
        <SignInGate locale={locale} next="/search" title={t(locale, "search")} />
      </main>
    );
  }
  const initial = q ? await search(q, 30) : [];
  return (
    <main className="mx-auto max-w-3xl px-4 pt-5">
      <SearchClient
        locale={locale}
        initialQuery={q}
        initialResults={initial}
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
