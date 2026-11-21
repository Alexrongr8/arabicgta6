import IMAGES from "../../data/catalog-images.json";

export type CatalogImage = { url: string; credit: string; page: string };
const MAP = IMAGES as Record<string, CatalogImage>;

export function catalogImage(kind: "weapon" | "vehicle" | "animal", name: string): CatalogImage | null {
  return MAP[`${kind}:${name}`] ?? null;
}
