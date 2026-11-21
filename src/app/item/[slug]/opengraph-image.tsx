import { OG_SIZE, renderItemOg } from "@/lib/og-image";

export const alt = "Arabic GTA 6";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderItemOg(slug);
}
