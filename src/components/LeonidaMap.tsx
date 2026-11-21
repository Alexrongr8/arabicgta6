"use client";
import "leaflet/dist/leaflet.css";
import { Bidi } from "@/components/Bidi";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import L from "leaflet";
import { ImageOverlay, MapContainer, Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { ArrowLeft, ArrowRight, ChevronDown, Layers, LocateFixed, X } from "lucide-react";
import { CATEGORIES, CATEGORY_MAP } from "@/lib/categories";
import type { CategorySlug, ItemCard, Locale } from "@/lib/types";
import { CategoryIcon } from "./CategoryIcon";
import { StatusBadge } from "./StatusBadge";

// Rockstar's official Leonida map poster, in image pixels.
const W = 2805;
const H = 3840;
const toLatLng = (p: { x: number; y: number }): L.LatLngExpression => [H - p.y, p.x];
const BOUNDS: L.LatLngBoundsExpression = [
  [0, 0],
  [H, W],
];

const iconCache = new Map<string, L.DivIcon>();
function dotIcon(cat: CategorySlug, active: boolean) {
  const key = `dot-${cat}-${active}`;
  if (!iconCache.has(key)) {
    const c = CATEGORY_MAP[cat];
    const size = active ? 18 : 13;
    iconCache.set(
      key,
      L.divIcon({
        className: "",
        html: `<div style="width:${size}px;height:${size}px;border-radius:999px;background:${c.color};border:2px solid #fff;box-shadow:0 0 10px ${c.color}"></div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      }),
    );
  }
  return iconCache.get(key)!;
}

function ZoomWatcher({ onZoom }: { onZoom: (z: number) => void }) {
  const map = useMapEvents({ zoomend: () => onZoom(map.getZoom()) });
  useEffect(() => onZoom(map.getZoom()), [map, onZoom]);
  return null;
}

function pinIcon(cat: CategorySlug, active: boolean) {
  const c = CATEGORY_MAP[cat];
  const html = renderToStaticMarkup(
    <div className={`pin ${active ? "active" : ""}`} style={{ background: c.color }}>
      <span>
        <CategoryIcon category={cat} size={16} color="#fff" strokeWidth={2.4} />
      </span>
    </div>,
  );
  return L.divIcon({ html, className: "", iconSize: [34, 34], iconAnchor: [17, 34] });
}

function FlyTo({ target }: { target: ItemCard | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target?.location) return;
    const t = setTimeout(() => {
      const z = Math.max(map.getZoom(), -0.5);
      // shift the target up so the bottom sheet doesn't cover it
      const pt = map.project(toLatLng(target.location!), z).add([0, map.getSize().y * 0.18]);
      map.flyTo(map.unproject(pt, z), z, { duration: 0.6 });
    }, 350);
    return () => clearTimeout(t);
  }, [target, map]);
  return null;
}

function FitOnLoad() {
  const map = useMap();
  useEffect(() => {
    const fit = () => {
      map.invalidateSize();
      map.setMinZoom(-4);
      const z = map.getBoundsZoom(BOUNDS, false);
      map.setMinZoom(z - 0.5);
      // portrait phones: frame the southern peninsula (where most pins are) a bit tighter
      // fill the screen height on phones (map is portrait), the user can pan sideways
      const size = map.getSize();
      const fillH = Math.log2(size.y / H);
      map.setView([H * 0.52, W * 0.55], Math.max(z, Math.min(fillH, z + 1)), { animate: false });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [map]);
  return null;
}

type Pin = ItemCard & { key: string; spotLabel?: { en: string; ar: string; n: number } };

function toPins(items: ItemCard[]): Pin[] {
  const pins: Pin[] = [];
  for (const i of items) {
    if (i.location) pins.push({ ...i, key: i.slug });
    (i.spots ?? []).forEach((sp, n) =>
      pins.push({ ...i, key: `${i.slug}#${n}`, location: { x: sp.x, y: sp.y }, spotLabel: { en: sp.label_en, ar: sp.label_ar, n: n + 1 } }),
    );
  }
  return pins;
}

export default function LeonidaMap({ items: cards, locale, focus, spot, labels }: { items: ItemCard[]; locale: Locale; focus?: string; spot?: number; labels: { note: string; open: string; all: string; back: string; legend: string } }) {
  const items = useMemo(() => toPins(cards), [cards]);
  const [active, setActive] = useState<Set<CategorySlug>>(new Set());
  const [selected, setSelected] = useState<Pin | null>(
    () => items.find((i) => i.key === (spot !== undefined ? `${focus}#${spot}` : focus)) ?? items.find((i) => i.slug === focus) ?? null,
  );
  const [legendOpen, setLegendOpen] = useState(false);
  const [zoom, setZoom] = useState(-3);
  const mapRef = useRef<L.Map | null>(null);

  const cats = useMemo(() => CATEGORIES.filter((c) => items.some((i) => i.category === c.slug)), [items]);
  const visible = items.filter((i) => active.size === 0 || active.has(i.category));
  const Back = locale === "ar" ? ArrowRight : ArrowLeft;

  const toggle = (c: CategorySlug) =>
    setActive((prev) => {
      const n = new Set(prev);
      if (n.has(c)) n.delete(c);
      else n.add(c);
      return n;
    });

  return (
    <div className="relative h-[calc(100dvh-64px)] w-full overflow-hidden">
      {/* Leaflet must run in an LTR box, otherwise overlays are mispositioned in RTL pages */}
      <div dir="ltr" className="absolute inset-0">
      <MapContainer
        ref={mapRef}
        crs={L.CRS.Simple}
        bounds={BOUNDS}
        maxBounds={[
          [-400, -400],
          [H + 400, W + 400],
        ]}
        minZoom={-4}
        maxZoom={1}
        zoomSnap={0.25}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <FitOnLoad />
        <ZoomWatcher onZoom={setZoom} />
        <FlyTo target={selected} />
        <ImageOverlay url="/map/leonida-official-small.webp" bounds={BOUNDS} />
        <ImageOverlay url="/map/leonida-official.webp" bounds={BOUNDS} />
        {visible.map((i) => (
          <Marker
            key={i.key}
            position={toLatLng(i.location!)}
            icon={zoom >= -1.25 || selected?.key === i.key ? pinIcon(i.category, selected?.key === i.key) : dotIcon(i.category, false)}
            eventHandlers={{ click: () => setSelected(i) }}
            zIndexOffset={selected?.key === i.key ? 1000 : 0}
          />
        ))}
      </MapContainer>
      </div>

      {/* top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] p-3">
        <div className="pointer-events-auto flex items-center gap-2">
          <Link href="/" className="glass grid size-10 shrink-0 place-items-center rounded-full border border-line" aria-label={labels.back}>
            <Back className="size-5" />
          </Link>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActive(new Set())}
              className={`glass h-10 shrink-0 rounded-full border px-4 text-[13px] font-bold ${active.size === 0 ? "border-pink text-fg" : "border-line text-muted"}`}
            >
              {labels.all} · {items.length}
            </button>
            {cats.map((c) => {
              const on = active.has(c.slug);
              return (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => toggle(c.slug)}
                  className={`h-10 shrink-0 rounded-full border px-3.5 text-[13px] font-bold ${on ? "border-transparent text-white" : "glass border-line text-muted"}`}
                  style={on ? { background: c.color } : undefined}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <CategoryIcon category={c.slug} className="size-4" style={on ? undefined : { color: c.color }} />
                    {locale === "ar" ? c.ar : c.en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* right controls */}
      <div className={`absolute end-3 bottom-8 z-[500] flex-col gap-2 ${selected ? "hidden" : "flex"}`}>
        <button type="button" onClick={() => mapRef.current?.zoomIn()} className="glass grid size-10 place-items-center rounded-full border border-line text-xl font-bold">+</button>
        <button type="button" onClick={() => mapRef.current?.zoomOut()} className="glass grid size-10 place-items-center rounded-full border border-line text-xl font-bold">−</button>
        <button type="button" onClick={() => mapRef.current?.fitBounds(BOUNDS)} className="glass grid size-10 place-items-center rounded-full border border-line" aria-label="reset">
          <LocateFixed className="size-5" />
        </button>
        <button type="button" onClick={() => setLegendOpen((v) => !v)} className="glass grid size-10 place-items-center rounded-full border border-line" aria-label={labels.legend}>
          <Layers className="size-5" />
        </button>
      </div>

      {legendOpen && (
        <div className="glass absolute end-16 bottom-8 z-[500] w-52 rounded-2xl border border-line p-3 text-[12.5px]">
          <p className="mb-2 font-extrabold">{labels.legend}</p>
          {cats.map((c) => (
            <p key={c.slug} className="flex items-center gap-2 py-0.5">
              <span className="size-3 rounded-full" style={{ background: c.color }} /> {locale === "ar" ? c.ar : c.en} ({items.filter((i) => i.category === c.slug).length})
            </p>
          ))}
          <p className="mt-2 leading-relaxed text-dim">{labels.note}</p>
        </div>
      )}

      {/* bottom sheet */}
      <div className={`absolute inset-x-0 bottom-0 z-[600] transition-transform duration-300 ${selected ? "translate-y-0" : "translate-y-full"}`}>
        {selected && (
          <div className="glass pb-safe mx-auto max-w-lg rounded-t-3xl border border-b-0 border-line px-5 pt-2">
            <button type="button" onClick={() => setSelected(null)} className="mx-auto mb-2 flex h-6 w-full items-center justify-center" aria-label="close">
              <ChevronDown className="size-5 text-dim" />
            </button>
            <div className="flex items-start gap-3">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl" style={{ background: `${CATEGORY_MAP[selected.category].color}2a`, color: CATEGORY_MAP[selected.category].color }}>
                <CategoryIcon category={selected.category} className="size-6" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="font-bold" style={{ color: CATEGORY_MAP[selected.category].color }}>
                    {locale === "ar" ? CATEGORY_MAP[selected.category].ar : CATEGORY_MAP[selected.category].en}
                  </span>
                  <StatusBadge status={selected.status} locale={locale} />
                  {selected.region && <span className="text-dim">{selected.region}</span>}
                </div>
                <h3 className="text-[17px] leading-snug font-extrabold"><Bidi text={locale === "ar" ? selected.title_ar : selected.title_en} /></h3>
                {selected.spotLabel && (
                  <p className="mt-1.5 rounded-xl bg-chip px-2.5 py-1.5 text-[13px] leading-relaxed font-bold text-pink">
                    📍 {selected.spotLabel.n}. <Bidi text={locale === "ar" ? selected.spotLabel.ar : selected.spotLabel.en} />
                  </p>
                )}
                <p className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-muted"><Bidi text={locale === "ar" ? selected.summary_ar : selected.summary_en} /></p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="grid size-8 shrink-0 place-items-center rounded-full bg-chip2" aria-label="close">
                <X className="size-4" />
              </button>
            </div>
            <Link href={`/item/${selected.slug}`} className="bg-sunset mt-4 mb-3 flex h-12 items-center justify-center rounded-2xl font-extrabold text-white shadow-lg shadow-pink/30">
              {labels.open}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
