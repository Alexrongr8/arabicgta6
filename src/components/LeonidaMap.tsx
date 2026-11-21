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

const SIZE = 1000;
const toLatLng = (p: { x: number; y: number }): L.LatLngExpression => [SIZE - p.y, p.x];
const BOUNDS: L.LatLngBoundsExpression = [
  [0, 0],
  [SIZE, SIZE],
];

const REGIONS: { name: string; x: number; y: number }[] = [
  { name: "VICE CITY", x: 805, y: 548 },
  { name: "LEONIDA KEYS", x: 690, y: 955 },
  { name: "GRASSRIVERS", x: 690, y: 655 },
  { name: "PORT GELLHORN", x: 175, y: 280 },
  { name: "AMBROSIA", x: 630, y: 510 },
  { name: "MOUNT KALAGA", x: 470, y: 115 },
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
      const z = Math.max(map.getZoom(), 1);
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
      map.setMinZoom(z - 0.25);
      // portrait phones: frame the southern peninsula (where most pins are) a bit tighter
      const portrait = map.getSize().y > map.getSize().x * 1.2;
      if (portrait) map.setView([SIZE - 560, 690], z + 0.75);
      else map.fitBounds(BOUNDS);
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [map]);
  return null;
}

export default function LeonidaMap({ items, locale, focus, labels }: { items: ItemCard[]; locale: Locale; focus?: string; labels: { note: string; open: string; all: string; back: string; legend: string } }) {
  const [active, setActive] = useState<Set<CategorySlug>>(new Set());
  const [selected, setSelected] = useState<ItemCard | null>(() => items.find((i) => i.slug === focus) ?? null);
  const [legendOpen, setLegendOpen] = useState(false);
  const [zoom, setZoom] = useState(-1);
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
    <div className="relative h-[calc(100dvh-60px)] w-full overflow-hidden">
      {/* Leaflet must run in an LTR box, otherwise overlays are mispositioned in RTL pages */}
      <div dir="ltr" className="absolute inset-0">
      <MapContainer
        ref={mapRef}
        crs={L.CRS.Simple}
        bounds={BOUNDS}
        maxBounds={[
          [-150, -150],
          [SIZE + 150, SIZE + 150],
        ]}
        minZoom={-4}
        maxZoom={3}
        zoomSnap={0.25}
        zoomControl={false}
        attributionControl={false}
        className="h-full w-full"
      >
        <FitOnLoad />
        <ZoomWatcher onZoom={setZoom} />
        <FlyTo target={selected} />
        <ImageOverlay url="/map/leonida.svg" bounds={BOUNDS} />
        {REGIONS.map((r) => (
          <Marker key={r.name} position={toLatLng(r)} icon={L.divIcon({ className: "", html: "", iconSize: [0, 0] })} interactive={false}>
            <Tooltip permanent direction="center" className="region-label">
              {r.name}
            </Tooltip>
          </Marker>
        ))}
        {visible.map((i) => (
          <Marker
            key={i.slug}
            position={toLatLng(i.location!)}
            icon={zoom >= 0.25 || selected?.slug === i.slug ? pinIcon(i.category, selected?.slug === i.slug) : dotIcon(i.category, false)}
            eventHandlers={{ click: () => setSelected(i) }}
            zIndexOffset={selected?.slug === i.slug ? 1000 : 0}
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
      <div className="absolute end-3 bottom-8 z-[500] flex flex-col gap-2">
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
          <p className="mb-2 font-black">{labels.legend}</p>
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
                <h3 className="text-[17px] leading-snug font-black"><Bidi text={locale === "ar" ? selected.title_ar : selected.title_en} /></h3>
                <p className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-muted"><Bidi text={locale === "ar" ? selected.summary_ar : selected.summary_en} /></p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10" aria-label="close">
                <X className="size-4" />
              </button>
            </div>
            <Link href={`/item/${selected.slug}`} className="bg-sunset mt-4 mb-3 flex h-12 items-center justify-center rounded-2xl font-black text-white shadow-lg shadow-pink/30">
              {labels.open}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
