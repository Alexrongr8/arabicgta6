import { publicMetadata } from "@/lib/public-metadata";
import type { Metadata } from "next";
import { getMapItems } from "@/lib/data";
import { isCategory } from "@/lib/categories";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/session";
import { MapShell } from "@/components/MapShell";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return publicMetadata("/map", locale, { title: t(locale, "map") });
}

export default async function MapPage({ searchParams }: PageProps<"/map">) {
  const locale = await getLocale();
  const sp = await searchParams;
  const items = await getMapItems();
  return (
    <main>
      <MapShell
        items={items}
        locale={locale}
        focus={typeof sp.focus === "string" ? sp.focus : undefined}
        spot={typeof sp.spot === "string" && /^\d+$/.test(sp.spot) ? Number(sp.spot) : undefined}
        cat={typeof sp.cat === "string" && isCategory(sp.cat) ? sp.cat : undefined}
        labels={{ note: t(locale, "mapNote"), open: t(locale, "open"), all: t(locale, "all"), back: t(locale, "back"), legend: t(locale, "legend") }}
      />
    </main>
  );
}
