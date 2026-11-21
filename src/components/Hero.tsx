import Link from "next/link";
import { Map, Search } from "lucide-react";
import type { Locale } from "@/lib/types";

export function Hero({ locale, total, compact }: { locale: Locale; total: number; compact?: boolean }) {
  const ar = locale === "ar";
  return (
    <section className="mx-auto max-w-6xl px-3 pt-3 md:px-4 md:pt-5">
      <div className={`relative overflow-hidden rounded-[28px] ${compact ? "min-h-[260px]" : "min-h-[440px] md:min-h-[480px]"}`}>
        {/* Official Rockstar screenshot of Vice City */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/vice-city.webp" alt="" className="absolute inset-0 size-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b2e] via-[#1a0b2e]/55 to-[#ff3d8b]/10" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#1a0b2e]/40 rtl:bg-gradient-to-r" />

        <div className="relative flex h-full min-h-[inherit] flex-col justify-end p-5 text-white md:p-9">
          <span className="mb-3 inline-flex w-fit -rotate-2 items-center gap-2 rounded-full bg-[#ffd166] px-3 py-1 text-[12px] font-extrabold text-[#2a1240] shadow-md">
            <span className="size-2 animate-pulse rounded-full bg-[#f0287a]" />
            {ar ? "موسوعة GTA 6 بالعربي" : "The Arabic GTA 6 encyclopedia"}
          </span>
          <h1 className={`${compact ? "text-[30px] md:text-5xl" : "text-[40px] md:text-6xl"} leading-[1.15] drop-shadow-[0_3px_16px_rgba(0,0,0,.6)]`}>
            {ar ? (
              <>
                هلا والله بعشّاق <span className="font-display tracking-wide whitespace-nowrap text-[#ffb13d]" dir="ltr">GTA VI</span> 👋
              </>
            ) : (
              <>
                Hey <span className="font-display tracking-wide text-[#ffb13d]">GTA VI</span> fans 👋
              </>
            )}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-white/90 md:text-lg">
            {ar
              ? "كل اللي تحتاجه عن Leonida بمكان واحد: الأسرار، الفلوس، الأسلحة النادرة، القلتشات، والخريطة الرسمية — بالعربي ومن لاعبين لكم."
              : "Everything about Leonida in one place: secrets, money, rare weapons, glitches and the official map — by players, for players."}
          </p>
          {!compact && (
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Link href="/map" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-[#f0287a] px-5 font-extrabold text-black shadow-lg shadow-black/30 active:scale-95">
                <Map className="size-5" /> {ar ? "افتح الخريطة" : "Open the map"}
              </Link>
              <Link href="/search" className="inline-flex h-12 items-center gap-2 rounded-2xl bg-white px-5 font-extrabold text-[#2a1240] shadow-lg shadow-black/20 active:scale-95">
                <Search className="size-5" /> {ar ? "دوّر على أي شي" : "Search anything"}
              </Link>
            </div>
          )}
          <p className="mt-4 text-[12px] text-white/75">
            {ar ? (
              <>
                عندنا الحين <b className="text-white">{total}</b> موضوع، ويزيدون كل يوم 🔥
              </>
            ) : (
              <>
                <b className="text-white">{total}</b> entries and growing every day 🔥
              </>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
