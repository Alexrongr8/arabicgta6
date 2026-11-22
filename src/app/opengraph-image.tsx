import { OG_SIZE, renderSiteOg } from "@/lib/og-image";

export const alt = "عربي GTA 6 — كل أسرار GTA 6 بالعربي";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OG() {
  return renderSiteOg();
}
