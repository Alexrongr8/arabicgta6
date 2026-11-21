"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Bidi } from "@/components/Bidi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lightbulb, X } from "lucide-react";
import type { Locale } from "@/lib/types";

type Tip = { slug: string; title_en: string; title_ar: string; summary_en: string; summary_ar: string };

const OFF_KEY = "tips-off";
const SEEN_KEY = "tips-seen";
const SESSION_KEY = "tip-shown";

function read(fn: () => string | null) {
  try {
    return fn();
  } catch {
    return null;
  }
}
function write(fn: () => void) {
  try {
    fn();
  } catch {}
}

/** Shows one new tip per visit (browser session). Users can switch it off. */
export function TipOfVisit({ tips, locale }: { tips: Tip[]; locale: Locale }) {
  const path = usePathname();
  const [tip, setTip] = useState<Tip | null>(null);
  const ar = locale === "ar";

  useEffect(() => {
    if (!tips.length || path.startsWith("/admin")) return;
    if (read(() => localStorage.getItem(OFF_KEY)) === "1") return;
    if (read(() => sessionStorage.getItem(SESSION_KEY))) return;
    const seen: string[] = JSON.parse(read(() => localStorage.getItem(SEEN_KEY)) ?? "[]");
    let pool = tips.filter((t) => !seen.includes(t.slug));
    if (!pool.length) {
      pool = tips;
      write(() => localStorage.setItem(SEEN_KEY, "[]"));
    }
    const pickTip = pool[Math.floor(Math.random() * pool.length)];
    const timer = setTimeout(() => {
      setTip(pickTip);
      write(() => sessionStorage.setItem(SESSION_KEY, "1"));
      write(() => localStorage.setItem(SEEN_KEY, JSON.stringify([...seen.filter((s) => s !== pickTip.slug), pickTip.slug].slice(-500))));
    }, 1200);
    return () => clearTimeout(timer);
    // only on first mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!tip) return null;
  const close = () => setTip(null);
  return (
    <div className="fixed inset-x-3 bottom-[88px] z-[700] md:inset-x-auto md:end-6 md:bottom-6 md:w-96" role="dialog" aria-live="polite">
      <div className="rise relative overflow-hidden rounded-3xl border border-teal/40 bg-card p-4 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-16 -end-10 size-40 rounded-full bg-teal/25 blur-3xl" />
        <div className="relative mb-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/15 px-2.5 py-1 text-[11px] font-extrabold text-teal">
            <Lightbulb className="size-3.5" /> {ar ? "نصيحة اليوم" : "Tip of the visit"}
          </span>
          <button type="button" onClick={close} className="grid size-8 place-items-center rounded-full bg-chip2" aria-label={ar ? "إغلاق" : "Close"}>
            <X className="size-4" />
          </button>
        </div>
        <p className="relative text-[15px] leading-snug font-extrabold"><Bidi text={ar ? tip.title_ar : tip.title_en} /></p>
        <p className="relative mt-1.5 text-[13px] leading-relaxed text-muted"><Bidi text={ar ? tip.summary_ar : tip.summary_en} /></p>
        <div className="relative mt-3 flex items-center gap-2">
          <Link href={`/item/${tip.slug}`} onClick={close} className="h-9 flex-1 rounded-xl bg-teal/90 text-center text-[13px] leading-9 font-extrabold text-[#06221f]">
            {ar ? "اقرأ أكثر" : "Read more"}
          </Link>
          <button
            type="button"
            onClick={() => {
              write(() => localStorage.setItem(OFF_KEY, "1"));
              close();
            }}
            className="h-9 rounded-xl border border-line px-3 text-[12px] font-bold text-muted"
          >
            {ar ? "لا تعرض النصائح" : "Turn off tips"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TipsToggle({ locale }: { locale: Locale }) {
  const [override, setOff] = useState<boolean | null>(null);
  const stored = useSyncExternalStore(
    () => () => {},
    () => read(() => localStorage.getItem(OFF_KEY)) === "1",
    () => false,
  );
  const off = override ?? stored;
  const ar = locale === "ar";
  return (
    <button
      type="button"
      onClick={() => {
        const next = !off;
        write(() => (next ? localStorage.setItem(OFF_KEY, "1") : localStorage.removeItem(OFF_KEY)));
        write(() => sessionStorage.removeItem(SESSION_KEY));
        setOff(next);
      }}
      className={`h-9 rounded-full px-4 text-sm font-extrabold ${off ? "border border-line text-muted" : "bg-teal/90 text-[#06221f]"}`}
    >
      {off ? (ar ? "متوقفة — شغّل" : "Off — turn on") : ar ? "شغّالة ✓" : "On ✓"}
    </button>
  );
}
