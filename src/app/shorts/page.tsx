import type { Metadata } from "next";
import { getShorts } from "@/lib/data";
import { getLocale } from "@/lib/session";
import { ShortsFeed } from "./ShortsFeed";

export async function generateMetadata(): Promise<Metadata> {
  const ar = (await getLocale()) === "ar";
  return {
    title: ar ? "شورتس GTA 6 — أقوى المقاطع القصيرة" : "GTA 6 Shorts — the best short clips",
    description: ar ? "أحدث مقاطع شورتس GTA 6 من يوتيوب في مكان واحد، تتحدّث تلقائياً كل ساعة." : "The latest GTA 6 YouTube Shorts in one place, refreshed every hour.",
    alternates: { canonical: "/shorts" },
  };
}

export default async function ShortsPage({ searchParams }: PageProps<"/shorts">) {
  const [locale, params, shorts] = await Promise.all([getLocale(), searchParams, getShorts(100)]);
  const ar = locale === "ar";
  const v = typeof params.v === "string" && /^[A-Za-z0-9_-]{11}$/.test(params.v) ? params.v : null;
  if (!shorts.length) {
    return <main className="mx-auto max-w-lg px-4 pt-10 text-center text-muted">{ar ? "المقاطع جاية قريب 🎬" : "Shorts are coming soon 🎬"}</main>;
  }
  return <main><h1 className="sr-only">{ar ? "شورتس GTA 6" : "GTA 6 Shorts"}</h1><ShortsFeed shorts={shorts} start={v} ar={ar} /></main>;
}
