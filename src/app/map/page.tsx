import type { Metadata } from "next";
import { getMapItems } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLocale, getViewer } from "@/lib/session";
import { MapShell } from "@/components/MapShell";
import { SignInGate } from "@/components/SignInGate";

export async function generateMetadata(): Promise<Metadata> {
  return { title: t(await getLocale(), "map") };
}

export default async function MapPage({ searchParams }: PageProps<"/map">) {
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  if (!viewer.member) {
    return (
      <main className="relative min-h-[calc(100dvh-64px)] overflow-hidden px-4 pt-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/map/leonida-official-small.webp" alt="" className="pointer-events-none absolute inset-0 size-full object-cover opacity-40 blur-[2px]" />
        <div className="relative">
          <SignInGate locale={locale} next="/map" title={t(locale, "map")} />
        </div>
      </main>
    );
  }
  const sp = await searchParams;
  const items = await getMapItems();
  return (
    <main>
      <MapShell
        items={items}
        locale={locale}
        focus={typeof sp.focus === "string" ? sp.focus : undefined}
        labels={{ note: t(locale, "mapNote"), open: t(locale, "open"), all: t(locale, "all"), back: t(locale, "back"), legend: t(locale, "legend") }}
      />
    </main>
  );
}
