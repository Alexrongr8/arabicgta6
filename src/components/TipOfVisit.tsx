"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Bidi } from "@/components/Bidi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lightbulb, X } from "lucide-react";
import type { Locale, Status } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

type Tip = { slug: string; status: Status; title: string; summary: string };

const OFF_KEY = "tips-off";
const SEEN_KEY = "tips-seen";
const SESSION_KEY = "tip-shown";
const CHANGE_EVENT = "tips-preference-change";
let windowPreference: boolean | null = null; // honor the toggle even when persistence is blocked

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
function tipsOff() {
  return windowPreference ?? (read(() => localStorage.getItem(OFF_KEY)) === "1");
}
function subscribeTips(notify: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === OFF_KEY || event.key === null) {
      windowPreference = null;
      notify();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, notify);
  };
}
function setTipsOff(value: boolean) {
  windowPreference = value;
  write(() => (value ? localStorage.setItem(OFF_KEY, "1") : localStorage.removeItem(OFF_KEY)));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}
function seenTips(): string[] {
  try {
    const value: unknown = JSON.parse(read(() => localStorage.getItem(SEEN_KEY)) ?? "[]");
    return Array.isArray(value) ? value.filter((s): s is string => typeof s === "string").slice(-500) : [];
  } catch {
    return [];
  }
}
function isTip(value: unknown): value is Tip {
  if (!value || typeof value !== "object") return false;
  const tip = value as Partial<Tip>;
  return typeof tip.slug === "string" && /^[a-z0-9][a-z0-9-]{0,119}$/.test(tip.slug)
    && typeof tip.title === "string" && typeof tip.summary === "string"
    && ["official", "confirmed", "leak", "rumor"].includes(tip.status ?? "");
}

/** Shows one unseen tip per visit, fetched only after checking the visitor's preferences. */
export function TipOfVisit({ locale }: { locale: Locale }) {
  const path = usePathname();
  const [tip, setTip] = useState<(Tip & { locale: Locale }) | null>(null);
  const shown = useRef(false); // still enforce one per mount if storage is unavailable
  const off = useSyncExternalStore(subscribeTips, tipsOff, () => false);
  const ar = locale === "ar";

  useEffect(() => {
    if (off || path.startsWith("/admin") || shown.current) return;
    if (read(() => sessionStorage.getItem(SESSION_KEY)) === "1") return;
    const controller = new AbortController();
    const allowed = () => !controller.signal.aborted && !shown.current && !tipsOff()
      && read(() => sessionStorage.getItem(SESSION_KEY)) !== "1";
    const timer = setTimeout(async () => {
      if (!allowed()) return;
      const timeout = setTimeout(() => controller.abort(), 5000);
      try {
        const response = await fetch(`/api/tips?locale=${locale}&v=2`, { signal: controller.signal });
        if (!response.ok) return;
        const data: { tips?: unknown } = await response.json();
        const tips = Array.isArray(data.tips) ? data.tips.slice(0, 200).filter(isTip) : [];
        if (!tips.length || !allowed()) return;
        let seen = seenTips();
        let pool = tips.filter((t) => !seen.includes(t.slug));
        if (!pool.length) {
          pool = tips;
          seen = [];
        }
        const pickTip = pool[Math.floor(Math.random() * pool.length)];
        shown.current = true;
        setTip({ ...pickTip, locale });
        write(() => sessionStorage.setItem(SESSION_KEY, "1"));
        write(() => localStorage.setItem(SEEN_KEY, JSON.stringify([...seen.filter((s) => s !== pickTip.slug), pickTip.slug].slice(-500))));
      } catch {
        // An optional tip must never interrupt the page; retry on a later navigation.
      } finally {
        clearTimeout(timeout);
      }
    }, 1200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [locale, path, off]);

  if (!tip || off || tip.locale !== locale || path.startsWith("/admin")) return null;
  const close = () => setTip(null);
  return (
    <div className="fixed inset-x-3 bottom-[88px] z-[700] md:inset-x-auto md:end-6 md:bottom-6 md:w-96" role="dialog" aria-label={ar ? "نصيحة اليوم" : "Tip of the visit"} aria-live="polite">
      <div className="rise relative overflow-hidden rounded-3xl border border-teal/40 bg-card p-4 shadow-2xl shadow-black/60 backdrop-blur-xl">
        <div className="pointer-events-none absolute -top-16 -end-10 size-40 rounded-full bg-teal/25 blur-3xl" />
        <div className="relative mb-2 flex items-center justify-between">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal/15 px-2.5 py-1 text-[11px] font-extrabold text-success">
            <Lightbulb className="size-3.5" /> {ar ? "نصيحة اليوم" : "Tip of the visit"}
          </span>
          <StatusBadge status={tip.status} locale={locale} />
          </div>
          <button type="button" onClick={close} className="grid size-8 place-items-center rounded-full bg-chip2" aria-label={ar ? "إغلاق" : "Close"}>
            <X className="size-4" />
          </button>
        </div>
        <p className="relative text-[15px] leading-snug font-extrabold"><Bidi text={tip.title} /></p>
        <p className="relative mt-1.5 text-[13px] leading-relaxed text-muted"><Bidi text={tip.summary} /></p>
        <div className="relative mt-3 flex items-center gap-2">
          <Link href={`/item/${tip.slug}`} onClick={close} className="h-9 flex-1 rounded-xl bg-teal/90 text-center text-[13px] leading-9 font-extrabold text-[#06221f]">
            {ar ? "اقرأ أكثر" : "Read more"}
          </Link>
          <button
            type="button"
            onClick={() => {
              setTipsOff(true);
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
  const off = useSyncExternalStore(
    subscribeTips,
    tipsOff,
    () => false,
  );
  const ar = locale === "ar";
  return (
    <button
      type="button"
      onClick={() => {
        const next = !off;
        write(() => sessionStorage.removeItem(SESSION_KEY));
        setTipsOff(next);
      }}
      className={`h-9 rounded-full px-4 text-sm font-extrabold ${off ? "border border-line text-muted" : "bg-teal/90 text-[#06221f]"}`}
    >
      {off ? (ar ? "متوقفة — شغّل" : "Off — turn on") : ar ? "شغّالة ✓" : "On ✓"}
    </button>
  );
}
