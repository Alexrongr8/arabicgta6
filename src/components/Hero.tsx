import Link from "next/link";
import { Map, Search } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

function Palm({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 120 220" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <path d="M62 218c2-50 6-100 2-150" stroke="#05020a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <g fill="#05020a">
        <path d="M64 66c-20-18-44-20-62-8 20-4 38 2 50 14z" />
        <path d="M64 66c-8-26-28-40-50-40 18 8 32 22 40 42z" />
        <path d="M64 66c6-26 26-42 50-42-18 8-32 22-38 44z" />
        <path d="M64 66c22-14 44-12 56 2-18-4-36 0-50 8z" />
        <path d="M64 66c-14 8-26 26-28 46 8-16 20-30 34-38z" />
        <path d="M64 66c14 8 24 26 24 46-6-16-16-30-28-38z" />
      </g>
    </svg>
  );
}

export function Hero({ locale, total, compact }: { locale: Locale; total: number; compact?: boolean }) {
  return (
    <section className={`relative overflow-hidden ${compact ? "pt-8 pb-6" : "pt-12 pb-10"}`}>
      {/* sun */}
      <div className={`pointer-events-none absolute start-1/2 -translate-x-1/2 rtl:translate-x-1/2 ${compact ? "top-2 size-56" : "top-4 size-72 md:size-96"} opacity-60`}>
        <div className="hero-sun relative size-full">
          <div className="sun-stripes absolute inset-0" />
        </div>
      </div>
      <Palm className="pointer-events-none absolute bottom-0 -start-6 h-56 opacity-90 md:h-72" />
      <Palm className="pointer-events-none absolute -end-4 bottom-0 h-44 opacity-90 md:h-64" flip />
      <div className="grid-floor pointer-events-none absolute inset-x-0 bottom-0 h-28" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-56 max-w-xl rounded-full bg-black/45 blur-3xl" />
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs font-bold text-sun backdrop-blur">
          <span className="size-2 animate-pulse rounded-full bg-teal" /> {t(locale, "autoUpdate")}
        </p>
        <h1 className={`font-black leading-[1.15] drop-shadow-[0_4px_24px_rgba(0,0,0,.8)] ${compact ? "text-3xl md:text-5xl" : "text-[40px] md:text-7xl"}`}>
          {locale === "ar" ? (
            <>
              أسرار <span className="font-display tracking-wide text-white [text-shadow:0_0_24px_rgba(255,61,139,.9),0_0_2px_#ff3d8b]" dir="ltr">GTA VI</span>
            </>
          ) : (
            <>
              <span className="font-display tracking-wide text-white [text-shadow:0_0_24px_rgba(255,61,139,.9),0_0_2px_#ff3d8b]">GTA VI</span> secrets
            </>
          )}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-fg/90 drop-shadow-[0_2px_10px_rgba(0,0,0,.9)] md:text-lg">{t(locale, "tagline")}</p>
        {!compact && (
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/map" className="bg-sunset inline-flex h-12 items-center gap-2 rounded-2xl px-6 font-black text-white shadow-lg shadow-pink/40 active:scale-95">
              <Map className="size-5" /> {t(locale, "heroCta")}
            </Link>
            <Link href="/search" className="inline-flex h-12 items-center gap-2 rounded-2xl border border-white/20 bg-black/50 px-6 font-bold backdrop-blur active:scale-95">
              <Search className="size-5" /> {t(locale, "heroCta2")}
            </Link>
          </div>
        )}
        <p className="mt-5 text-xs text-muted">
          <span className="font-display text-base text-fg">{total}+</span> {t(locale, "items")} {t(locale, "stats")}
        </p>
      </div>
    </section>
  );
}
