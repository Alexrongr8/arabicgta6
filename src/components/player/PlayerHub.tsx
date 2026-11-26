"use client";
import Link from "next/link";
import { Check } from "lucide-react";
import { LEVELS, levelOf, missionsOf, streakOf, usePlayer, XP } from "@/lib/player";
import type { Locale } from "@/lib/types";

/** Homepage strip: streak, level, what is new since the last visit and today's three missions. */
export function PlayerHub({ locale, stamps }: { locale: Locale; stamps: string[] }) {
  const p = usePlayer();
  const ar = locale === "ar";
  const lvl = levelOf(p?.xp ?? 0);
  const streak = p ? streakOf(p.days) : 0;
  const fresh = p && p.prev ? stamps.filter((s) => Date.parse(s) > p.prev).length : 0;
  const missions = p ? missionsOf(p) : null;
  const done = missions ? missions.list.filter((m) => m.done >= m.goal).length : 0;
  return (
    <section className="mx-auto mt-4 max-w-6xl px-4" aria-label={ar ? "تقدمك" : "Your progress"}>
      <div className="card grid gap-3 p-3.5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] md:gap-5 md:p-4">
        <div className="flex items-center gap-3">
          <Link href="/me" className="relative grid size-[58px] shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#ff7a3d] to-[#f0287a] text-white shadow-md" aria-label={ar ? "ملفي" : "My progress"}>
            <span className="text-[22px] leading-none" aria-hidden>🔥</span>
            <span className="absolute -bottom-1.5 rounded-full bg-[#241338] px-2 text-[12px] font-extrabold tabular-nums ring-2 ring-[var(--card)]">{streak}</span>
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-[15px] font-extrabold">{ar ? lvl.ar : lvl.en}</span>
              <span className="text-[13px] tracking-wider text-[#f5a300]" aria-label={ar ? `${lvl.stars} نجوم` : `${lvl.stars} stars`}>
                {"★".repeat(lvl.stars)}<span className="text-control/50">{"★".repeat(LEVELS.length - 1 - lvl.stars)}</span>
              </span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-chip2" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(lvl.progress * 100)}>
              <div className="bg-sunset h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.max(4, lvl.progress * 100)}%` }} />
            </div>
            <p className="mt-1 text-[11.5px] text-muted">
              {lvl.next
                ? (ar ? <>باقي <b className="text-fg tabular-nums">{lvl.toNext}</b> XP وتوصل «{lvl.next.ar}»</> : <><b className="text-fg tabular-nums">{lvl.toNext}</b> XP to “{lvl.next.en}”</>)
                : (ar ? "وصلت أعلى مستوى 👑" : "Top level reached 👑")}
              {streak > 1 && <span className="ms-2">{ar ? `· سلسلتك ${streak} أيام` : `· ${streak}-day streak`}</span>}
            </p>
          </div>
          {fresh > 0 && (
            <a href="#latest" className="shrink-0 rounded-2xl bg-[#f0287a] px-3 py-2 text-center text-black shadow-md">
              <span className="block text-[20px] font-extrabold leading-none tabular-nums">{fresh}</span>
              <span className="block text-[10.5px] font-extrabold">{ar ? "جديد لك" : "new for you"}</span>
            </a>
          )}
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between text-[12px]">
            <span className="font-extrabold">{ar ? "مهام اليوم" : "Today's missions"} <span className="text-muted tabular-nums">({done}/3)</span></span>
            <span className="text-muted">{missions?.paid ? (ar ? "تمت ✓ ارجع بكرة لمهام جديدة" : "Done ✓ new missions tomorrow") : (ar ? `خلّصها كلها = ‎+${XP.missions} XP` : `Finish all three = +${XP.missions} XP`)}</span>
          </div>
          <ul className="grid grid-cols-3 gap-2">
            {(missions?.list ?? [{ id: "read", done: 0, goal: 2, ar: "اقرأ موضوعين اليوم", en: "Read two articles today", href: "/c/news" }, { id: "quiz", done: 0, goal: 1, ar: "العب تحدي اليوم", en: "Play today's challenge", href: "/play" }, { id: "shorts", done: 0, goal: 3, ar: "شوف 3 شورتس", en: "Watch three Shorts", href: "/shorts" }]).map((m) => {
              const ok = m.done >= m.goal;
              return (
                <li key={m.id}>
                  <Link href={m.href} className={`flex h-full flex-col justify-between gap-1.5 rounded-2xl border p-2.5 text-[12px] font-bold leading-snug transition ${ok ? "border-transparent bg-[#16a34a]/15 text-fg" : "border-line bg-chip hover:bg-chip2"}`}>
                    <span>{ar ? m.ar : m.en}</span>
                    <span className="flex items-center gap-1.5">
                      {ok ? <span className="grid size-5 place-items-center rounded-full bg-[#16a34a] text-white"><Check className="size-3.5" strokeWidth={3} /></span>
                        : <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-chip2"><span className="bg-sunset block h-full rounded-full" style={{ width: `${(m.done / m.goal) * 100}%` }} /></span>}
                      <span className="tabular-nums text-muted" dir="ltr">{m.done}/{m.goal}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
