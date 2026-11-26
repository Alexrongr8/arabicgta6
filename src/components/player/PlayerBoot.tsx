"use client";
import { useEffect, useState } from "react";
import { touchVisit, XP_EVENT, LEVELS } from "@/lib/player";
import type { Locale } from "@/lib/types";

type Toast = { id: number; amount: number; label: string; levelUp: number };

const LABEL: Record<string, { ar: string; en: string }> = {
  visit: { ar: "زيارة اليوم", en: "Today's visit" },
  read: { ar: "قراءة موضوع", en: "Article read" },
  quiz: { ar: "تحدي اليوم", en: "Daily challenge" },
  arcade: { ar: "الماراثون", en: "Marathon" },
  short: { ar: "شورت", en: "Short" },
  share: { ar: "مشاركة", en: "Share" },
  missions: { ar: "خلصت مهام اليوم! 🎉", en: "Daily missions done! 🎉" },
};

/** Counts the visit once per page load and shows small "+XP" toasts when the visitor earns points. */
export function PlayerBoot({ locale }: { locale: Locale }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const ar = locale === "ar";
  useEffect(() => {
    let n = 0;
    const onXp = (e: Event) => {
      const d = (e as CustomEvent<{ amount: number; label: string; levelUp: number }>).detail;
      const id = ++n;
      setToasts((list) => [...list.slice(-2), { id, ...d }]);
      window.setTimeout(() => setToasts((list) => list.filter((t) => t.id !== id)), d.levelUp ? 5200 : 2800);
    };
    window.addEventListener(XP_EVENT, onXp);
    touchVisit();
    return () => window.removeEventListener(XP_EVENT, onXp);
  }, []);
  if (!toasts.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex flex-col items-center gap-2 px-4 md:bottom-8" role="status" aria-live="polite">
      {toasts.map((t) => {
        const streak = t.label.startsWith("streak:") ? Number(t.label.slice(7)) : 0;
        const text = streak ? (ar ? `🔥 ${streak} أيام ورا بعض` : `🔥 ${streak}-day streak`) : (LABEL[t.label]?.[locale] ?? "");
        return (
          <div key={t.id} style={t.levelUp ? { animationDuration: "5.2s" } : undefined} className="xp-pop flex flex-wrap items-center justify-center gap-2 rounded-full bg-[#241338] px-4 py-2 text-[13px] font-extrabold text-white shadow-xl ring-1 ring-white/15">
            <span className="rounded-full bg-[#ffd166] px-2 py-0.5 text-[12px] text-[#241338]" dir="ltr">+{t.amount} XP</span>
            <span>{text}</span>
            {t.levelUp > 0 && <span className="text-[#ffd166]">{"★".repeat(t.levelUp)} {ar ? `ترقيت: ${LEVELS[t.levelUp].ar}` : `Level up: ${LEVELS[t.levelUp].en}`}</span>}
          </div>
        );
      })}
    </div>
  );
}
