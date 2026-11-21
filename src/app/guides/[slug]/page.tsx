import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEO_PAGES } from "../../../../data/seo-pages";
import { getBySlugs, getCategory } from "@/lib/data";
import { getLocale } from "@/lib/session";
import { ItemCard } from "@/components/ItemCard";
import type { ItemCard as Card } from "@/lib/types";
import { jsonLd } from "@/lib/jsonld";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arabicgta6.com";

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = SEO_PAGES.find((x) => x.slug === slug);
  if (!p) return {};
  const ar = (await getLocale()) === "ar";
  return {
    title: ar ? p.titleAr : p.titleEn,
    description: ar ? p.introAr : p.introEn,
    keywords: p.keywordsAr,
    alternates: { canonical: `${SITE}/guides/${slug}` },
    openGraph: { title: ar ? p.titleAr : p.titleEn, description: ar ? p.introAr : p.introEn, type: "article", locale: ar ? "ar_SA" : "en_US" },
  };
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const p = SEO_PAGES.find((x) => x.slug === slug);
  if (!p) notFound();
  const locale = await getLocale();
  const ar = locale === "ar";
  const lists = await Promise.all([...(p.categories ?? []).map((c) => getCategory(c)), getBySlugs(p.slugs ?? [])]);
  const seen = new Set<string>();
  const items: Card[] = [...lists.at(-1)!, ...lists.slice(0, -1).flat()].filter((i) => !seen.has(i.slug) && seen.add(i.slug));
  const faqLd = p.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: locale,
        mainEntity: p.faq.map((f) => ({ "@type": "Question", name: ar ? f.qAr : f.qEn, acceptedAnswer: { "@type": "Answer", text: ar ? f.aAr : f.aEn } })),
      }
    : null;
  return (
    <main className="mx-auto max-w-5xl px-4 pt-6">
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(faqLd) }} />}
      <h1 className="text-[28px] leading-snug md:text-4xl">{ar ? p.titleAr : p.titleEn}</h1>
      <p className="mt-3 mb-5 text-[15px] leading-relaxed text-muted">{ar ? p.introAr : p.introEn}</p>
      {p.faq && (
        <div className="card mb-5 divide-y divide-line">
          {p.faq.map((f) => (
            <details key={f.qAr} className="group p-4">
              <summary className="cursor-pointer list-none font-extrabold">❓ {ar ? f.qAr : f.qEn}</summary>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{ar ? f.aAr : f.aEn}</p>
            </details>
          ))}
        </div>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((i, n) => (
          <ItemCard key={i.slug} item={i} locale={locale} index={n} />
        ))}
      </div>
    </main>
  );
}

export function generateStaticParams() {
  return SEO_PAGES.map((p) => ({ slug: p.slug }));
}
