"use client";
import Link from "next/link";
import { levelOf, streakOf, usePlayer } from "@/lib/player";
import type { Locale } from "@/lib/types";

/** Header chip: current streak and wanted-star level, linking to the visitor's own page. */
export function PlayerChip({ locale }: { locale: Locale }) {
  const p = usePlayer();
  const ar = locale === "ar";
  const streak = p ? streakOf(p.days) : 0;
  const stars = p ? levelOf(p.xp).stars : 0;
  return (
    <Link href="/me" aria-label={ar ? `ملفي: ${streak} أيام متتالية، ${stars} نجوم` : `My progress: ${streak}-day streak, ${stars} stars`}
      className="inline-flex h-9 shrink-0 items-center gap-1 rounded-full border border-line bg-chip px-2.5 text-[12.5px] font-extrabold" dir="ltr">
      <span aria-hidden>🔥</span><span className="tabular-nums">{streak}</span>
      <span className="mx-0.5 h-3.5 w-px bg-line max-[369px]:hidden" aria-hidden />
      <span className="text-[#f5a300] max-[369px]:hidden" aria-hidden>★</span><span className="tabular-nums max-[369px]:hidden">{stars}</span>
    </Link>
  );
}
