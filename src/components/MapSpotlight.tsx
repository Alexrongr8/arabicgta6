import Link from "next/link";
import { ArrowLeft, ArrowRight, Map as MapIcon, MapPin } from "lucide-react";
import { arCount } from "@/lib/ago";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import { pick } from "@/lib/i18n";
import { isSpoiler } from "@/lib/spoiler";
import type { CategorySlug, ItemCard, Locale } from "@/lib/types";
import { Bidi } from "./Bidi";
import { CategoryIcon } from "./CategoryIcon";

// Rockstar's official Leonida map poster, in image pixels (same numbers as the full map).
const W = 2805;
const H = 3840;
/** The preview frame is centred on this share of the poster's height (Vice City and the south, where most pins are). */
const FOCUS_Y = 0.54;

type Pin = { key: string; href: string; x: number; y: number; category: CategorySlug; title: string; label: string };

function toPins(items: ItemCard[], locale: Locale): Pin[] {
  const pins: Pin[] = [];
  for (const i of items) {
    if (isSpoiler(i)) continue; // a pin label must never give a story moment away
    const title = pick(i, "title", locale);
    const focus = `/map?focus=${encodeURIComponent(i.slug)}`;
    if (i.location) pins.push({ key: i.slug, href: focus, x: i.location.x, y: i.location.y, category: i.category, title, label: title });
    (i.spots ?? []).forEach((s, n) =>
      pins.push({ key: `${i.slug}#${n}`, href: `${focus}&spot=${n}`, x: s.x, y: s.y, category: i.category, title, label: `${title} — ${locale === "ar" ? s.label_ar : s.label_en}` }),
    );
  }
  return pins.filter((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= W && p.y >= 0 && p.y <= H);
}

/**
 * Finds first, plain place names last: secrets, weapons, cars and money take turns so the preview shows
 * every colour, and the region pins (whose names are already printed on the poster) fill what is left.
 */
function mixed(pins: Pin[]): Pin[] {
  const groups = new Map<CategorySlug, Pin[]>();
  for (const p of pins) if (p.category !== "places") groups.set(p.category, [...(groups.get(p.category) ?? []), p]);
  const lists = [...groups.values()];
  const out: Pin[] = [];
  for (let n = 0; lists.some((l) => n < l.length); n++) for (const l of lists) if (n < l.length) out.push(l[n]);
  return [...out, ...pins.filter((p) => p.category === "places")];
}

/** The Arabic noun form that goes with a number shown beside it: 1 دبوس، 2 دبوسين، 3-10 دبابيس، 11+ دبوس. */
const unit = (n: number, one: string, two: string, few: string) => (n === 2 ? two : n >= 3 && n <= 10 ? few : one);

const far = (a: Pin, b: Pin, min: number) => Math.hypot(a.x - b.x, a.y - b.y) >= min;

/** Drops pins that would sit on top of each other in the small preview. */
function thin(pins: Pin[], gap: number, max: number): Pin[] {
  const kept: Pin[] = [];
  for (const p of pins) {
    if (kept.length >= max) break;
    if (kept.every((k) => far(k, p, gap))) kept.push(p);
  }
  return kept;
}

/**
 * Three labelled pins from different articles. They stay in the middle of the frame (clear of the counter at the
 * top and the button at the bottom, on the phone crop too) and far enough apart that the labels do not collide.
 */
function callouts(pins: Pin[]): Pin[] {
  const inFrame = pins.filter((p) => p.y / H > 0.37 && p.y / H < 0.67 && p.x / W > 0.24 && p.x / W < 0.8);
  const picked: Pin[] = [];
  for (const p of inFrame) {
    if (picked.length >= 3) break;
    if (picked.every((k) => k.title !== p.title && Math.abs(k.y - p.y) >= 300)) picked.push(p);
  }
  return picked;
}

/** Homepage section for the interactive map: a preview with real pins, what is on it, and quick ways in. */
export function MapSpotlight({ items, locale }: { items: ItemCard[]; locale: Locale }) {
  const ar = locale === "ar";
  const Arrow = ar ? ArrowLeft : ArrowRight;
  const all = toPins(items, locale);
  const shown = thin(mixed(all), 84, 44);
  const labelled = callouts(shown);
  const labelKeys = new Set(labelled.map((p) => p.key));
  const counts = new Map<CategorySlug, number>();
  for (const p of all) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  const cats = CATEGORIES.filter((c) => counts.has(c.slug)).sort((a, b) => counts.get(b.slug)! - counts.get(a.slug)!).slice(0, 6);
  const areas = new Set(items.map((i) => i.region).filter(Boolean)).size;
  const stats = ([
    [all.length, ar ? unit(all.length, "دبوس", "دبوسين", "دبابيس") : "pins"],
    [counts.size, ar ? unit(counts.size, "قسم", "قسمين", "أقسام") : "categories"],
    [areas, ar ? unit(areas, "منطقة", "منطقتين", "مناطق") : "areas"],
  ] as const).filter(([n]) => n > 0);
  // Guides that put several exact spots on the map (every safe, every wreck) are the best ways in.
  const trails = items.filter((i) => !isSpoiler(i) && (i.spots?.length ?? 0) >= 2).sort((a, b) => b.spots!.length - a.spots!.length).slice(0, 3);

  return (
    <section id="map" className="mx-auto mt-8 max-w-6xl scroll-mt-20 px-4" aria-labelledby="map-title">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#06283a] via-[#0b3b52] to-[#2a1240] text-white shadow-xl ring-1 ring-white/10">
        <div className="pointer-events-none absolute -end-16 -top-20 size-64 rounded-full bg-[#22d3ee]/20 blur-3xl" aria-hidden />
        <div className="pointer-events-none absolute -start-20 bottom-0 size-64 rounded-full bg-[#f0287a]/20 blur-3xl" aria-hidden />
        <div className="relative grid gap-4 p-4 md:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-5">
          <header className="lg:col-start-2 lg:row-start-1 lg:pt-2">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3 py-1 text-[11.5px] font-extrabold text-[#a5f3fc] ring-1 ring-white/15">
              <MapIcon className="size-3.5" /> {ar ? "الخريطة الرسمية من Rockstar" : "Rockstar's official map"}
            </p>
            <h2 id="map-title" className="mt-3 text-[28px] leading-tight md:text-[38px]">
              {ar ? <>خريطة <span className="text-[#67e8f9]">Leonida</span> التفاعلية</> : <>The interactive <span className="text-[#67e8f9]">Leonida</span> map</>}
            </h2>
            <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-white/80 md:text-[15px]">
              {ar
                ? "كل خزنة، سيارة نادرة، سلاح مخفي وسر على خريطة وحدة. اضغط أي دبوس وشوف وش فيه بالضبط."
                : "Every safe, rare car, hidden weapon and secret on one map. Tap any pin to see exactly what is there."}
            </p>
          </header>

          <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl bg-[#0aa5c9] shadow-2xl ring-2 ring-white/25 lg:aspect-[10/9]">
              {/* The poster keeps its own proportions so every pin sits on its real place. It is drawn a little wider
                  than the frame to crop the poster's printed border; the frame shows the middle band. */}
              <div className="absolute left-[-6%] top-1/2 aspect-[2805/3840] w-[112%]" style={{ transform: `translateY(-${FOCUS_Y * 100}%)` }} dir="ltr">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/map/leonida-official-small.webp" alt={ar ? "خريطة Leonida الرسمية" : "The official Leonida map"} width={1403} height={1920} loading="lazy" decoding="async" className="size-full select-none" draggable={false} />
                {shown.map((p, n) => {
                  const color = CATEGORY_MAP[p.category].color;
                  const named = labelKeys.has(p.key);
                  return (
                    <Link key={p.key} href={p.href} title={p.label} aria-label={p.label}
                      className={`group absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center ${named ? "z-20" : "z-10"}`}
                      style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}>
                      <span className={`map-dot block rounded-full border-2 border-white transition group-hover:scale-150 ${named ? "size-4" : "size-3"}`} style={{ background: color, color, animationDelay: `${(n % 7) * 0.35}s` }} />
                      {/* A long mixed Arabic and English title cuts badly in a small label, so it falls back to the category name. */}
                      {named && (
                        <span className={`pointer-events-none absolute top-1/2 flex max-w-[168px] -translate-y-1/2 items-center gap-1 rounded-full bg-[#0b1220]/90 py-1 ps-1.5 pe-2.5 text-[11px] font-extrabold text-white shadow-lg ring-1 ring-white/25 ${p.x / W > 0.5 ? "right-[28px]" : "left-[28px]"}`} dir={ar ? "rtl" : "ltr"}>
                          <MapPin className="size-3.5 shrink-0" style={{ color }} />
                          <span className="truncate">{p.title.length <= 24 ? <Bidi text={p.title} /> : ar ? CATEGORY_MAP[p.category].ar : CATEGORY_MAP[p.category].en}</span>
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
              <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_50px_rgba(6,40,58,.5)]" aria-hidden />
              {all.length > 0 && (
                <p className="pointer-events-none absolute start-3 top-3 z-30 rounded-full bg-[#0b1220]/85 px-3 py-1.5 text-[12px] font-extrabold text-white shadow-lg ring-1 ring-white/25 md:hidden">
                  📍 {stats.map(([n, label]) => `${n} ${label}`).join(" · ")}
                </p>
              )}
              <Link href="/map" className="absolute end-3 bottom-3 z-30 inline-flex h-10 items-center gap-1.5 rounded-full bg-[#0b1220]/85 px-3.5 text-[12.5px] font-extrabold text-white shadow-lg ring-1 ring-white/25 backdrop-blur transition hover:bg-[#0b1220] active:scale-95">
                <span className="live-dot size-2 rounded-full bg-[#22c55e]" aria-hidden /> {ar ? "كبّر وتجوّل بالخريطة" : "Zoom and explore"}
              </Link>
            </div>
          </div>

          <div className="min-w-0 lg:col-start-2 lg:row-start-2">
            {all.length > 0 && (
              <dl className="mb-4 hidden max-w-md grid-cols-3 gap-2 text-center md:grid">
                {stats.map(([n, label]) => (
                  <div key={label} className="rounded-2xl bg-white/10 px-2 py-2.5 ring-1 ring-white/10">
                    <dd className="font-display text-[26px] leading-none tracking-wide text-[#ffd166] tabular-nums" dir="ltr">{n}</dd>
                    <dt className="mt-1 text-[11.5px] font-bold text-white/75">{label}</dt>
                  </div>
                ))}
              </dl>
            )}

            {cats.length > 0 && (
              <>
                <p className="text-[12px] font-extrabold text-white/70">{ar ? "وش تبي تشوف على الخريطة؟" : "What do you want to see on the map?"}</p>
                <ul className="no-scrollbar -mx-4 mt-2 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
                  {cats.map((c) => (
                    <li key={c.slug} className="shrink-0">
                      <Link href={`/map?cat=${c.slug}`} className="inline-flex h-10 items-center gap-1.5 rounded-full bg-white/10 px-3 text-[13px] font-bold whitespace-nowrap ring-1 ring-white/15 transition hover:bg-white/20 active:scale-95">
                        <CategoryIcon category={c.slug} className="size-4" style={{ color: c.color }} />
                        {ar ? c.ar : c.en}
                        <span className="rounded-full bg-black/35 px-1.5 text-[11px] tabular-nums text-white/85" dir="ltr">{counts.get(c.slug)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <Link href="/map" className="bg-sunset mt-4 inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl px-6 text-[16px] font-extrabold text-[#241338] shadow-lg shadow-black/30 transition active:scale-[.98] sm:w-auto md:mt-5">
              <MapIcon className="size-5" /> {ar ? "افتح الخريطة الكاملة" : "Open the full map"} <Arrow className="size-4" />
            </Link>
          </div>
        </div>

        {trails.length > 0 && (
          <div className="relative border-t border-white/10 bg-black/20 py-3.5">
            <p className="mb-2 px-4 text-[12px] font-extrabold text-white/70 md:px-6">{ar ? "جولات جاهزة على الخريطة 📍" : "Ready-made trails on the map 📍"}</p>
            <ul className="no-scrollbar flex gap-2 overflow-x-auto px-4 md:grid md:grid-cols-3 md:overflow-visible md:px-6">
              {trails.map((i) => {
                const c = CATEGORY_MAP[i.category];
                return (
                  <li key={i.slug} className="w-[82%] min-w-0 shrink-0 md:w-auto">
                    <Link href={`/map?focus=${encodeURIComponent(i.slug)}`} className="flex items-center gap-2.5 rounded-2xl bg-white/8 p-2.5 ring-1 ring-white/10 transition hover:bg-white/15 active:scale-[.99]">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl" style={{ background: `${c.color}33`, color: c.color }}>
                        <CategoryIcon category={i.category} className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-extrabold"><Bidi text={pick(i, "title", locale)} /></span>
                        <span className="block text-[11.5px] text-white/65">{ar ? `${arCount(i.spots!.length, "موقع", "موقعين", "مواقع")} على الخريطة` : `${i.spots!.length} spots on the map`}</span>
                      </span>
                      <Arrow className="size-4 shrink-0 text-white/60" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
