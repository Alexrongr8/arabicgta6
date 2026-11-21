"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { ItemCard as Card, Locale } from "@/lib/types";
import { ItemCard } from "./ItemCard";

type Labels = { placeholder: string; empty: string; hint: string; popular: string; results: string };

export function SearchClient({ locale, initialQuery, initialResults, popular, labels }: { locale: Locale; initialQuery: string; initialResults: Card[]; popular: string[]; labels: Labels }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [results, setResults] = useState<Card[]>(initialResults);
  const [loading, setLoading] = useState(false);
  const [cat, setCat] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const reqId = useRef(0);

  useEffect(() => {
    if (!initialQuery) inputRef.current?.focus();
  }, [initialQuery]);

  useEffect(() => {
    const term = q.trim();
    if (!term) return;
    const id = ++reqId.current;
    const h = setTimeout(async () => {
      try {
        const r = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const j = await r.json();
        if (id === reqId.current) setResults(j.results ?? []);
      } finally {
        if (id === reqId.current) setLoading(false);
      }
      router.replace(`/search?q=${encodeURIComponent(term)}`, { scroll: false });
    }, 220);
    return () => clearTimeout(h);
  }, [q, router]);

  const cats = q.trim() ? CATEGORIES.filter((c) => results.some((r) => r.category === c.slug)) : [];
  const shown = !q.trim() ? [] : cat ? results.filter((r) => r.category === cat) : results;

  return (
    <div>
      <div className="sticky top-[64px] z-30 -mx-4 bg-bg/90 px-4 pt-1 pb-3 backdrop-blur">
        <label className="flex h-14 items-center gap-3 rounded-2xl border border-pink/40 bg-white/[.06] px-4 shadow-[0_0_0_4px_rgba(255,61,139,.08)] focus-within:border-pink">
          {loading ? <Loader2 className="size-5 animate-spin text-pink" /> : <Search className="size-5 text-pink" />}
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setCat(null);
              setLoading(Boolean(e.target.value.trim()));
            }}
            placeholder={labels.placeholder}
            enterKeyHint="search"
            type="search"
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] font-bold outline-none placeholder:font-normal placeholder:text-dim"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} className="grid size-8 place-items-center rounded-full bg-white/10" aria-label="clear">
              <X className="size-4" />
            </button>
          )}
        </label>
        {cats.length > 1 && (
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            <Chip on={!cat} onClick={() => setCat(null)}>
              {locale === "ar" ? "الكل" : "All"} · {results.length}
            </Chip>
            {cats.map((c) => (
              <Chip key={c.slug} on={cat === c.slug} color={c.color} onClick={() => setCat(c.slug)}>
                {locale === "ar" ? c.ar : c.en} · {results.filter((r) => r.category === c.slug).length}
              </Chip>
            ))}
          </div>
        )}
      </div>

      {!q.trim() ? (
        <div className="mt-4">
          <p className="mb-4 text-sm text-muted">{labels.hint}</p>
          <p className="mb-2 text-xs font-bold text-dim">{labels.popular}</p>
          <div className="flex flex-wrap gap-2">
            {popular.map((p) => (
              <button key={p} type="button" onClick={() => {
                  setQ(p);
                  setLoading(true);
                }} className="rounded-full border border-line bg-white/[.03] px-3.5 py-2 text-sm font-bold hover:border-pink/50">
                {p}
              </button>
            ))}
          </div>
        </div>
      ) : shown.length === 0 && !loading ? (
        <p className="mt-10 text-center text-sm text-muted">{labels.empty}</p>
      ) : (
        <div className="mt-2 grid gap-3">
          {shown.map((r, i) => (
            <ItemCard key={r.slug} item={r} locale={locale} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ on, color, onClick, children }: { on: boolean; color?: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 shrink-0 rounded-full border px-3 text-xs font-bold ${on ? "border-transparent text-white" : "border-line text-muted"}`}
      style={on ? { background: color ?? "var(--pink)" } : undefined}
    >
      {children}
    </button>
  );
}
