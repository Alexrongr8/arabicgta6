"use client";
import { useMemo, useState } from "react";
import { normalize } from "@/lib/normalize";

export interface CatalogRow {
  name: string;
  cls: string;
  note: string | null;
  stats: number[] | null;
  badge?: string | null;
  sub?: string | null;
  image?: { url: string; credit: string; page?: string } | null;
  emoji?: string;
}

/** Filterable, sortable catalog with stat bars (all stats out of 10). */
export function Catalog({
  rows,
  classes,
  statLabels,
  ar,
  initialQuery = "",
}: {
  rows: CatalogRow[];
  classes: { id: string; label: string; emoji: string }[];
  statLabels: string[];
  ar: boolean;
  initialQuery?: string;
}) {
  const [cls, setCls] = useState<string>("all");
  const [sort, setSort] = useState<number>(-1);
  const [q, setQ] = useState(initialQuery);
  const nq = normalize(q);
  const matches = (x: CatalogRow) => !nq || normalize(x.name).includes(nq);
  const shown = useMemo(() => {
    let r = rows.filter((x) => (cls === "all" || x.cls === cls) && matches(x));
    if (sort >= 0) r = [...r].sort((a, b) => (b.stats?.[sort] ?? -1) - (a.stats?.[sort] ?? -1));
    return r;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, cls, sort, nq]);
  // counts follow the current search, so the chips never promise rows that aren't shown
  const count = (id: string) => rows.filter((x) => (id === "all" || x.cls === id) && matches(x)).length;
  return (
    <div>
      <div className="no-scrollbar -mx-4 mb-3 flex gap-2 overflow-x-auto px-4">
        {[{ id: "all", label: ar ? "الكل" : "All", emoji: "✨" }, ...classes].filter((c) => count(c.id) > 0).map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCls(c.id)}
            aria-pressed={cls === c.id}
            className={`h-9 shrink-0 rounded-full border px-3.5 text-[13px] font-bold ${cls === c.id ? "border-transparent bg-pink text-black" : "border-line bg-chip text-muted"}`}
          >
            {c.emoji} {c.label} · {count(c.id)}
          </button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={ar ? "ابحث بالاسم…" : "Search by name…"}
          aria-label={ar ? "ابحث في الكتالوج بالاسم" : "Search the catalog by name"}
          type="search"
          className="h-10 min-w-0 flex-1 rounded-xl border border-control bg-card px-3 text-[15px] outline-none focus:border-pink"
          dir="ltr"
        />
        <select value={sort} onChange={(e) => setSort(Number(e.target.value))} aria-label={ar ? "ترتيب النتائج" : "Sort results"} className="h-10 rounded-xl border border-control bg-card px-2 text-[14px]">
          <option value={-1}>{ar ? "ترتيب: افتراضي" : "Sort: default"}</option>
          {statLabels.map((l, i) => (
            <option key={l} value={i}>
              {ar ? `الأعلى في: ${l}` : `Highest ${l}`}
            </option>
          ))}
        </select>
      </div>
      <p className="mb-3 text-[13px] text-muted" role="status" aria-live="polite">
        {ar ? `${shown.length} نتيجة` : `${shown.length} results`}
      </p>
      {shown.length === 0 && (
        <div className="card mb-4 p-5 text-center">
          <p className="mb-3 text-[14px] text-muted">{ar ? "ما لقينا شي بهالاسم في هذا القسم." : "Nothing matches that name here."}</p>
          <button type="button" onClick={() => { setQ(""); setCls("all"); }} className="rounded-xl bg-pink px-4 py-2 text-sm font-extrabold text-black">
            {ar ? "اعرض الكل" : "Show everything"}
          </button>
        </div>
      )}
      <ol className="grid gap-2.5 md:grid-cols-2">
        {shown.map((r) => (
          <li key={r.name} className="card overflow-hidden p-0">
            <div className="noimg relative aspect-[16/9] w-full overflow-hidden" style={{ background: "linear-gradient(135deg,var(--chip-2),var(--chip))" }}>
              {!r.image && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="flex flex-col items-center gap-1.5">
                    <span className="text-5xl opacity-50">{r.emoji ?? "✨"}</span>
                    <span className="rounded-full bg-card px-3 py-1 text-[12px] font-extrabold text-muted shadow-sm">📷 {ar ? "تتوفر الصورة قريباً" : "Image coming soon"}</span>
                  </span>
                </span>
              )}
              {r.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={r.image.url} alt={r.name} loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 size-full object-cover" onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.remove();
                    e.currentTarget.parentElement?.setAttribute("data-noimg", ar ? "📷 تتوفر الصورة قريباً" : "📷 Image coming soon");
                  }} />
              )}
              {r.image && (r.image.page ? (
                <a href={r.image.page} target="_blank" rel="noopener noreferrer nofollow" aria-label={ar ? `مصدر صورة ${r.name}` : `Image source for ${r.name}`} className="absolute bottom-1.5 end-1.5 rounded-full bg-black/70 px-2 py-1 text-[11px] text-white underline decoration-white/40 underline-offset-2" dir="ltr">📷 {r.image.credit}</a>
              ) : (
                <span className="absolute bottom-1.5 end-1.5 rounded-full bg-black/70 px-2 py-1 text-[11px] text-white" dir="ltr">📷 {r.image.credit}</span>
              ))}
            </div>
            <div className="p-3.5">
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              <span className="font-display text-[16px] tracking-wide" dir="ltr">
                {r.name}
              </span>
              {r.badge && <span className="rounded-full bg-[#ffd166] px-2 py-0.5 text-[10.5px] font-extrabold text-[#2a1240]">{r.badge}</span>}
            </div>
            {r.note && (
              <p className="mb-2 text-[12.5px] text-muted" dir="auto">
                📍 {r.note}
              </p>
            )}
            {r.stats ? (
              <div className="space-y-1.5">
                {r.stats.map((v, i) => (
                  <div key={i} className="grid grid-cols-[86px_1fr_32px] items-center gap-2 text-[12px]">
                    <span className="text-dim">{statLabels[i]}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-chip2">
                      <span className="block h-full rounded-full" style={{ width: `${v * 10}%`, background: "linear-gradient(90deg,#ff8a1f,#f0287a)" }} />
                    </span>
                    <span className="text-end font-bold" dir="ltr">
                      {v.toFixed(1)}
                    </span>
                  </div>
                ))}
                {r.sub && <p className="text-[11px] text-dim">{r.sub}</p>}
              </div>
            ) : (
              <p className="text-[12px] text-dim">{ar ? "الإحصائيات لسه ما انشرت — بنضيفها أول ما تتوفر." : "Stats not published yet — added as soon as they are."}</p>
            )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
