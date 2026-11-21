"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, Trophy as TrophyIcon } from "lucide-react";
import type { Grade, Trophy } from "../../data/trophies";
import type { Locale } from "@/lib/types";
import { Bidi } from "./Bidi";

const GRADE: Record<Grade, { ar: string; en: string; color: string; bg: string }> = {
  platinum: { ar: "بلاتينيوم", en: "Platinum", color: "#6aa9d8", bg: "linear-gradient(135deg,#dfe9f3,#9fb8cf)" },
  gold: { ar: "ذهبي", en: "Gold", color: "#c9971c", bg: "linear-gradient(135deg,#ffe08a,#d4a017)" },
  silver: { ar: "فضي", en: "Silver", color: "#8f98a3", bg: "linear-gradient(135deg,#f1f3f5,#b5bcc4)" },
  bronze: { ar: "برونزي", en: "Bronze", color: "#b06a3b", bg: "linear-gradient(135deg,#f3c7a2,#b06a3b)" },
};

type Filter = "all" | "visible" | "hidden" | Grade;

export function TrophyList({ trophies, locale }: { trophies: Trophy[]; locale: Locale }) {
  const ar = locale === "ar";
  const [filter, setFilter] = useState<Filter>("all");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const shown = trophies.filter((t) =>
    filter === "all" ? true : filter === "hidden" ? t.hidden : filter === "visible" ? !t.hidden : t.grade === filter,
  );
  const chips: { id: Filter; ar: string; en: string }[] = [
    { id: "all", ar: `الكل · ${trophies.length}`, en: `All · ${trophies.length}` },
    { id: "visible", ar: "الظاهرة", en: "Visible" },
    { id: "hidden", ar: "المخفية", en: "Hidden" },
    { id: "gold", ar: "ذهبي", en: "Gold" },
    { id: "silver", ar: "فضي", en: "Silver" },
    { id: "bronze", ar: "برونزي", en: "Bronze" },
  ];
  return (
    <div>
      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-bold ${filter === c.id ? "border-transparent bg-pink text-white" : "border-line bg-chip text-muted"}`}
          >
            {ar ? c.ar : c.en}
          </button>
        ))}
      </div>
      <ol className="grid gap-2.5 md:grid-cols-2">
        {shown.map((t) => {
          const g = GRADE[t.grade];
          const blur = t.story && !revealed.has(t.name);
          return (
            <li key={t.name} className="card flex gap-3 p-3.5">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl shadow-inner" style={{ background: g.bg }}>
                <TrophyIcon className="size-6 text-white drop-shadow" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="font-display text-[15px] tracking-wide" dir="ltr">
                    {blur ? "• • • • • •" : t.name}
                  </span>
                  <span className="rounded-full px-2 py-0.5 text-[10.5px] font-extrabold text-white" style={{ background: g.color }}>
                    {ar ? g.ar : g.en}
                  </span>
                  {t.hidden && <span className="rounded-full bg-chip2 px-2 py-0.5 text-[10.5px] font-bold text-muted">{ar ? "مخفي" : "Hidden"}</span>}
                  {t.missable && <span className="rounded-full bg-[#ef4444] px-2 py-0.5 text-[10.5px] font-extrabold text-white">{ar ? "يفوت!" : "Missable!"}</span>}
                </div>
                {blur ? (
                  <button
                    type="button"
                    onClick={() => setRevealed((r) => new Set(r).add(t.name))}
                    className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-chip px-2.5 py-1.5 text-[12.5px] font-bold text-muted"
                  >
                    <Eye className="size-4" /> {ar ? "كأس قصة — اضغط عشان تشوفه (حرق)" : "Story trophy — tap to reveal (spoiler)"}
                  </button>
                ) : (
                  <p className="text-[13.5px] leading-relaxed text-fg">
                    <Bidi text={ar ? t.ar : t.en} />
                  </p>
                )}
                {t.note && (
                  <p className="mt-1.5 rounded-xl bg-[#ef4444]/10 px-2.5 py-1.5 text-[12.5px] leading-relaxed text-[#dc2626]">
                    <Bidi text={ar ? t.note.ar : t.note.en} />
                  </p>
                )}
                {t.link && !blur && (
                  <Link href={`/item/${t.link}`} className="mt-1 inline-block text-[12.5px] font-bold text-pink">
                    {ar ? "الدليل المرتبط ←" : "Related guide →"}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
