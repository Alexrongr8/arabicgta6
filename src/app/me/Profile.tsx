"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, Gamepad2, Settings, Shuffle } from "lucide-react";
import { badgesOf, dayNumber, LEVELS, levelOf, missionsOf, streakOf, usePlayer } from "@/lib/player";
import type { ItemCard as Card, Locale } from "@/lib/types";
import { CATEGORY_MAP } from "@/lib/categories";
import { pick } from "@/lib/i18n";

const WEEKDAYS_AR = ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];
const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function useCards(slugs: string[]) {
  const key = slugs.join(",");
  const [loaded, setLoaded] = useState<{ key: string; cards: Card[] } | null>(null);
  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    fetch(`/api/cards?slugs=${encodeURIComponent(key)}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : { results: [] }))
      .then((j: { results?: Card[] }) => setLoaded({ key, cards: j.results ?? [] }))
      .catch(() => { if (!controller.signal.aborted) setLoaded({ key, cards: [] }); });
    return () => controller.abort();
  }, [key]);
  if (!key) return [];
  return loaded?.key === key ? loaded.cards : null;
}

function MiniList({ cards, locale, empty }: { cards: Card[] | null; locale: Locale; empty: string }) {
  if (cards === null) return <p className="p-4 text-[13px] text-muted">…</p>;
  if (!cards.length) return <p className="p-4 text-[13px] text-muted">{empty}</p>;
  return (
    <ul className="divide-y divide-line">
      {cards.map((c) => {
        const cat = CATEGORY_MAP[c.category];
        return (
          <li key={c.slug}>
            <Link href={`/item/${c.slug}`} className="flex items-center gap-3 px-4 py-3 hover:bg-chip">
              <span className="size-2 shrink-0 rounded-full" style={{ background: cat?.color }} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-bold" dir="auto">{pick(c, "title", locale)}</span>
                <span className="text-[11.5px] text-muted">{locale === "ar" ? cat?.ar : cat?.en}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function Profile({ locale, signedIn, name }: { locale: Locale; signedIn: boolean; name: string | null }) {
  const ar = locale === "ar";
  const p = usePlayer();
  const saved = useCards(p?.saved.slice(0, 30) ?? []);
  const recent = useCards(p ? Object.entries(p.read).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([slug]) => slug) : []);
  const lvl = levelOf(p?.xp ?? 0);
  const streak = p ? streakOf(p.days) : 0;
  const today = dayNumber();
  const badges = p ? badgesOf(p) : [];
  const earned = badges.filter((b) => b.done).length;
  const missions = p ? missionsOf(p) : null;
  const week = Array.from({ length: 7 }, (_, i) => today - 6 + i);
  const readCount = p ? Object.keys(p.read).length : 0;
  const topCats = p ? Object.entries(p.cats).sort((a, b) => b[1] - a[1]).slice(0, 4) : [];

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2a1240] via-[#5b21b6] to-[#f0287a] p-5 text-white shadow-lg md:p-7">
        <p className="text-[13px] font-bold text-white/80">{name ? (ar ? `هلا ${name} 👋` : `Hey ${name} 👋`) : (ar ? "هلا بك 👋" : "Welcome 👋")}</p>
        <h1 className="mt-1 text-[32px] leading-tight md:text-4xl">{ar ? lvl.ar : lvl.en}</h1>
        <p className="mt-1 text-[24px] tracking-[.2em] text-[#ffd166]" aria-label={ar ? `${lvl.stars} نجوم من 5` : `${lvl.stars} of 5 stars`}>
          {"★".repeat(lvl.stars)}<span className="text-white/25">{"★".repeat(LEVELS.length - 1 - lvl.stars)}</span>
        </p>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/20">
          <div className="h-full rounded-full bg-[#ffd166] transition-[width] duration-700" style={{ width: `${Math.max(3, lvl.progress * 100)}%` }} />
        </div>
        <p className="mt-1.5 text-[13px] text-white/90">
          <b className="tabular-nums">{p?.xp ?? 0}</b> XP
          {lvl.next && <span> · {ar ? `باقي ${lvl.toNext} وتوصل «${lvl.next.ar}»` : `${lvl.toNext} to “${lvl.next.en}”`}</span>}
        </p>
        <dl className="mt-4 grid grid-cols-4 gap-2 text-center">
          {[
            { v: streak, k: ar ? "سلسلة الأيام 🔥" : "Day streak 🔥" },
            { v: p?.best ?? 0, k: ar ? "أطول سلسلة" : "Best streak" },
            { v: readCount, k: ar ? "مواضيع قريتها" : "Articles read" },
            { v: `${earned}/${badges.length || 13}`, k: ar ? "أوسمة" : "Badges" },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl bg-black/25 px-1 py-2.5">
              <dd className="font-display text-[24px] leading-none tracking-wide tabular-nums" dir="ltr">{s.v}</dd>
              <dt className="mt-1 text-[10.5px] font-bold text-white/80">{s.k}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section className="card p-4">
        <h2 className="mb-3 text-[19px]">{ar ? "أسبوعك" : "Your week"}</h2>
        <ol className="grid grid-cols-7 gap-1.5 text-center">
          {week.map((d) => {
            const on = Boolean(p?.days.includes(d));
            const weekday = new Date(d * 864e5).getUTCDay();
            return (
              <li key={d} className={`rounded-2xl py-2 ${d === today ? "ring-2 ring-[var(--pink)]" : ""} ${on ? "bg-gradient-to-b from-[#ff7a3d] to-[#f0287a] text-white" : "bg-chip text-muted"}`}>
                <span className="block text-[18px] leading-none">{on ? "🔥" : "·"}</span>
                <span className="mt-1 block text-[10.5px] font-bold">{ar ? WEEKDAYS_AR[weekday] : WEEKDAYS_EN[weekday]}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-[12.5px] text-muted">{ar ? "ادخل كل يوم وتكبر سلسلتك، وكل يوم زيادة يعطيك XP أكثر." : "Come back every day to grow your streak. Each extra day gives more XP."}</p>
        {missions && (
          <ul className="mt-3 grid gap-2 sm:grid-cols-3">
            {missions.list.map((m) => (
              <li key={m.id}>
                <Link href={m.href} className={`flex items-center justify-between gap-2 rounded-2xl border px-3 py-2.5 text-[13px] font-bold ${m.done >= m.goal ? "border-transparent bg-[#16a34a]/15" : "border-line bg-chip"}`}>
                  <span>{ar ? m.ar : m.en}</span><span className="tabular-nums text-muted" dir="ltr">{m.done >= m.goal ? "✓" : `${m.done}/${m.goal}`}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Link href="/play" className="card-hover flex items-center gap-3 rounded-3xl bg-gradient-to-br from-[#7c3aed] to-[#2a1240] p-4 text-white shadow-md">
          <Gamepad2 className="size-8 shrink-0" />
          <span><span className="font-head block text-[18px] leading-tight">{ar ? "تحدي اليوم" : "Daily challenge"}</span><span className="text-[11.5px] text-white/80">{p?.quiz[String(today)] !== undefined ? (ar ? `نتيجتك ${p.quiz[String(today)]}/5 ✓` : `You scored ${p.quiz[String(today)]}/5 ✓`) : (ar ? "5 أسئلة تنتظرك" : "5 questions waiting")}</span></span>
        </Link>
        <a href="/random" className="card-hover flex items-center gap-3 rounded-3xl bg-gradient-to-br from-[#ff8a1f] to-[#f0287a] p-4 text-[#241338] shadow-md">
          <Shuffle className="size-8 shrink-0" />
          <span><span className="font-head block text-[18px] leading-tight">{ar ? "فاجئني" : "Surprise me"}</span><span className="text-[11.5px] font-bold opacity-80">{ar ? "سر أو موقف عشوائي" : "A random secret or moment"}</span></span>
        </a>
      </section>

      <section className="card p-4">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="text-[19px]">{ar ? "الأوسمة" : "Badges"}</h2>
          <span className="text-[12.5px] font-bold text-muted tabular-nums">{earned}/{badges.length}</span>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {badges.map((b) => (
            <li key={b.id} className={`rounded-2xl border p-3 ${b.done ? "border-transparent bg-[#ffd166]/25" : "border-line bg-chip"}`}>
              <div className="flex items-center gap-2">
                <span className={`text-[26px] leading-none ${b.done ? "" : "opacity-40 grayscale"}`} aria-hidden>{b.icon}</span>
                <span className="min-w-0">
                  <span className="block text-[13.5px] font-extrabold leading-tight">{ar ? b.ar : b.en}</span>
                  <span className="block text-[11px] leading-snug text-muted">{ar ? b.hintAr : b.hintEn}</span>
                </span>
              </div>
              {!b.done && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-chip2"><span className="bg-sunset block h-full rounded-full" style={{ width: `${(b.progress / b.goal) * 100}%` }} /></span>
                  <span className="text-[10.5px] tabular-nums text-muted" dir="ltr">{b.progress}/{b.goal}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section className="card overflow-hidden">
        <h2 className="flex items-center gap-2 border-b border-line px-4 py-3 text-[19px]"><Bookmark className="size-5 text-[#f5a300]" /> {ar ? "المحفوظات" : "Saved"}</h2>
        <MiniList cards={saved} locale={locale} empty={ar ? "ما حفظت شي للحين. اضغط «احفظ» داخل أي موضوع ويطلع لك هنا." : "Nothing saved yet. Tap “Save” inside any article and it shows up here."} />
      </section>

      <section className="card overflow-hidden">
        <h2 className="border-b border-line px-4 py-3 text-[19px]">{ar ? "آخر ما قريت" : "Recently read"}</h2>
        <MiniList cards={recent} locale={locale} empty={ar ? "ابدأ بأول موضوع وتاخذ أول وسام." : "Read your first article to earn your first badge."} />
        {topCats.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-t border-line px-4 py-3">
            {topCats.map(([c, n]) => {
              const cat = CATEGORY_MAP[c as keyof typeof CATEGORY_MAP];
              return cat ? <Link key={c} href={`/c/${c}`} className="rounded-full px-2.5 py-1 text-[12px] font-bold text-black" style={{ background: cat.color }}>{ar ? cat.ar : cat.en} · {n}</Link> : null;
            })}
          </div>
        )}
      </section>

      <section className="card flex items-center justify-between gap-3 p-4">
        <span className="text-[12.5px] leading-relaxed text-muted">{ar ? "تقدمك محفوظ على هذا الجهاز فقط." : "Your progress is saved on this device only."}</span>
        <Link href="/account" className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-line bg-chip px-3.5 text-[13px] font-extrabold">
          <Settings className="size-4" /> {signedIn ? (ar ? "الحساب والإعدادات" : "Account & settings") : (ar ? "تسجيل الدخول والإعدادات" : "Sign in & settings")}
        </Link>
      </section>
    </div>
  );
}
