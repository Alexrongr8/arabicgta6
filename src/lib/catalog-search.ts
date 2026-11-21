import { WEAPONS } from "../../data/catalog-weapons";
import { VEHICLES } from "../../data/catalog-vehicles";
import { ANIMALS } from "../../data/catalog-animals";
import { normalize, searchTerms } from "./normalize";

export type CatalogHit = { kind: "weapon" | "vehicle" | "animal"; name: string; nameAr?: string; href: string };

const VEHICLE_CLASS_ALIASES: Record<string, string> = {
  super: "سوبر سياره سيارات رياضيه خارقه", car: "سيارات سياره", suv: "سياره سيارات دفع رباعي فان",
  truck: "شاحنه شاحنات بيك اب", motorcycle: "دباب دبابات دراجه ناريه",
  bicycle: "دراجه دراجات هوائيه bicycle pedal bike", boat: "قارب قوارب زورق",
  plane: "طياره طائره طائرات", helicopter: "هليكوبتر مروحيه", military: "عسكريه", service: "شرطه خدمات", special: "خاصه",
};

const ENTRIES: { kind: CatalogHit["kind"]; name: string; nameAr?: string; hay: string }[] = [
  ...WEAPONS.map(([name, cls]) => ({ kind: "weapon" as const, name, hay: normalize(`${name} ${cls} سلاح`) })),
  ...VEHICLES.map(([name, cls]) => ({ kind: "vehicle" as const, name, hay: normalize(`${name} ${cls} ${VEHICLE_CLASS_ALIASES[cls] ?? ""} مركبه مركبات`) })),
  ...ANIMALS.map((a) => ({ kind: "animal" as const, name: a.en, nameAr: a.ar, hay: normalize(`${a.en} ${a.ar} حيوان`) })),
];

const PATH = { weapon: "weapons", vehicle: "vehicles", animal: "animals" } as const;

/** Catalog entities whose name contains every meaningful query term (max `limit`). */
export function searchCatalog(q: string, limit = 8): CatalogHit[] {
  // keep short tokens such as a single-digit variant ("Mk 2"), but need at least one real word
  const terms = searchTerms(q);
  if (!terms.some((t) => t.length > 1)) return [];
  return ENTRIES.filter((e) => terms.every((t) => e.hay.includes(t)))
    .slice(0, limit)
    .map((e) => ({ kind: e.kind, name: e.name, nameAr: e.nameAr, href: `/catalog/${PATH[e.kind]}?q=${encodeURIComponent(e.name)}` }));
}
