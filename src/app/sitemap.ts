import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/categories";
import { SEO_PAGES } from "../../data/seo-pages";
import { getLatest } from "@/lib/data";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arabicgta6.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getLatest(5000);
  const now = new Date();
  return [
    { url: SITE, lastModified: now, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE}/map`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/trophies`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/catalog/weapons`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/catalog/vehicles`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/catalog/animals`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/community`, changeFrequency: "hourly", priority: 0.7 },
    ...SEO_PAGES.map((p) => ({ url: `${SITE}/guides/${p.slug}`, changeFrequency: "daily" as const, priority: 0.9 })),
    ...CATEGORIES.map((c) => ({ url: `${SITE}/c/${c.slug}`, changeFrequency: "hourly" as const, priority: 0.8 })),
    ...items.map((i) => ({ url: `${SITE}/item/${i.slug}`, lastModified: new Date(i.published_at), changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}
