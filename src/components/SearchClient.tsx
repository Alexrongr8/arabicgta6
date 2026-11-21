"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { ItemCard as Card, Locale } from "@/lib/types";
import Link from "next/link";
import { ItemCard } from "./ItemCard";
import type { CatalogHit } from "@/lib/catalog-search";

type Labels = { placeholder: string; empty: string; hint: string; popular: string; results: string };

export function SearchClient({ locale, initialQuery, initialResults, initialCatalog = [], popular, labels }: { locale: Locale; initialQuery: string; initialResults: Card[]; initialCatalog?: CatalogHit[]; popular: string[]; labels: Labels }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const [results, setResults] = useState<Card[]>(initialResults);
  const [catalog, setCatalog] = useState<CatalogHit[]>(initialCatalog);
  const [failed, setFailed] = useState(false);
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
        if (!r.ok) throw new Error(String(r.status));
        const j = await r.json();
        if (id !== reqId.current) return; // a newer query is in flight: drop this stale answer
        setResults(j.results ?? []);
        setCatalog(j.catalog ?? []);
        setFailed(false);
        router.replace(`/search?q=${encodeURIComponent(term)}`, { scroll: false });
      } catch {
        if (id === reqId.current) setFailed(true);
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    }, 220);
    return () => clearTimeout(h);
  }, [q, router]);

  /** Every change of the query goes through here; clearing cancels any request still in flight. */
  const change = (v: string) => {
    setQ(v);
    setCat(null);
    setFailed(false);
    if (v.trim()) {
      setLoading(true);
    } else {
      reqId.current++; // invalidate pending answers
      setLoading(false);
      router.replace("/search", { scroll: false });
    }
  };

  const cats = q.trim() ? CATEGORIES.filter((c) => results.some((r) => r.category === c.slug)) : [];
  const shown = !q.trim() ? [] : cat ? results.filter((r) => r.category === cat) : results;

  return (
    <div>
      <div className="sticky top-[68px] z-30 -mx-4 bg-bg/95 px-4 pt-1 pb-3 backdrop-blur">
        <label className="flex h-14 items-center gap-3 rounded-2xl border border-control bg-chip px-4 shadow-[0_0_0_4px_rgba(255,61,139,.08)] focus-within:border-pink">
          {loading ? <Loader2 className="size-5 animate-spin text-pink" /> : <Search className="size-5 text-pink" />}
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => change(e.target.value)}
            placeholder={labels.placeholder}
            aria-label={locale === "ar" ? "ابحث في الموقع" : "Search the site"}
            enterKeyHint="search"
            type="search"
            className="h-full min-w-0 flex-1 bg-transparent text-[16px] font-bold outline-none placeholder:font-normal placeholder:text-dim"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                change("");
                inputRef.current?.focus();
              }}
              className="grid size-8 place-items-center rounded-full bg-chip2"
              aria-label={locale === "ar" ? "امسح البحث" : "Clear search"}
            >
              <X className="size-4" />
            </button>
          )}
        </label>
        {cats.length > 1 && (
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            <Chip on={!cat} onClick={() => setCat(null)}>
              {locale === "ar" ? "الكل" : "All"} · {results.length + catalog.length}
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
              <button key={p} type="button" onClick={() => change(p)} className="rounded-full border border-line bg-chip px-3.5 py-2 text-sm font-bold hover:border-pink/50">
                {p}
              </button>
            ))}
          </div>
        </div>
      ) : failed && !loading ? (
        <p className="mt-10 text-center text-sm text-muted" role="alert">{locale === "ar" ? "صار خطأ في البحث، جرّب مرة ثانية." : "Search failed, please try again."}</p>
      ) : shown.length === 0 && (cat || catalog.length === 0) && !loading ? (
        <p className="mt-10 text-center text-sm text-muted" role="status">{labels.empty}</p>
      ) : (
        <div className="mt-2 grid gap-3">
          {!loading && (
            <p className="text-[12.5px] text-dim" role="status" aria-live="polite">
              {locale === "ar" ? `${shown.length + (cat ? 0 : catalog.length)} نتيجة` : `${shown.length + (cat ? 0 : catalog.length)} results`}
            </p>
          )}
          {!cat && catalog.length > 0 && (
            <div className="card p-3">
              <p className="mb-2 text-[12.5px] font-bold text-dim">{locale === "ar" ? "في الكتالوج" : "In the catalogs"}</p>
              <div className="flex flex-wrap gap-2">
                {catalog.map((c) => (
                  <Link key={c.kind + c.name} href={c.href} className="rounded-full border border-line bg-chip px-3 py-1.5 text-[13px] font-bold hover:border-pink/50">
                    {c.kind === "weapon" ? "🔫" : c.kind === "vehicle" ? "🏎️" : "🐾"} <span dir="auto">{locale === "ar" && c.nameAr ? c.nameAr : c.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
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
      aria-pressed={on}
      className={`h-8 shrink-0 rounded-full border px-3 text-xs font-bold ${on ? "border-transparent text-black" : "border-line text-muted"}`}
      style={on ? { background: color ?? "var(--pink)" } : undefined}
    >
      {children}
    </button>
  );
}
