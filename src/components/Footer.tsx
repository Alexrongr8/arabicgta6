"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { SEO_PAGES } from "../../data/seo-pages";

export function Footer({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const path = usePathname();
  if (path.startsWith("/map")) return null;
  return (
    <footer className="mt-12 px-4 pb-28 md:pb-10">
      <nav className="mx-auto mb-6 flex max-w-6xl flex-wrap justify-center gap-x-4 gap-y-2 border-t border-line pt-6 text-[12.5px] text-muted">
        {SEO_PAGES.map((p) => (
          <Link key={p.slug} href={`/guides/${p.slug}`} className="hover:text-pink">
            {(ar ? p.titleAr : p.titleEn).split(/[—؟?]/)[0].trim()}
          </Link>
        ))}
        <Link href="/trophies" className="hover:text-pink">{ar ? "كؤوس GTA 6" : "GTA 6 trophies"}</Link>
      </nav>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 text-center">
        <a
          href="https://protec-sa.com/"
          target="_blank"
          rel="noopener"
          className="group inline-flex items-center gap-3 rounded-2xl border border-line bg-card px-4 py-2.5 shadow-sm transition hover:border-pink/50"
        >
          <span className="text-[12px] text-dim">{ar ? "تطوير" : "Developed by"}</span>
          <span className="font-display text-[17px] tracking-wider text-fg group-hover:text-pink" dir="ltr">
            PROTEC<span className="text-pink">-SA</span>
          </span>
          <span className="text-dim" aria-hidden>
            ↗
          </span>
        </a>
        <div className="flex items-center gap-2 text-[12.5px] text-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/flag-sa.svg" alt={ar ? "علم المملكة العربية السعودية" : "Flag of Saudi Arabia"} className="h-5 w-auto rounded-[3px] shadow-sm" />
          <span>{ar ? "صُنع بحب في السعودية" : "Proudly made in Saudi Arabia"}</span>
        </div>
      </div>
    </footer>
  );
}
