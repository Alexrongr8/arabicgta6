import type { Metadata } from "next";
import { VEHICLES, VEHICLE_SOURCES } from "../../../../data/catalog-vehicles";
import { getLocale } from "@/lib/session";
import { Catalog } from "@/components/Catalog";
import { catalogImage } from "@/lib/catalog-images";

export async function generateMetadata(): Promise<Metadata> {
  const ar = (await getLocale()) === "ar";
  return {
    title: ar ? "كتالوج مركبات GTA 6" : "GTA 6 vehicles catalog",
    description: ar ? `${VEHICLES.length} مركبة في GTA 6: سيارات ودبابات وقوارب وطيارات، و${VEHICLES.filter((v) => v[3]).length} منها بأرقام السرعة والتسارع من داخل اللعبة.` : `${VEHICLES.length} GTA 6 vehicles — cars, bikes, boats and aircraft; ${VEHICLES.filter((v) => v[3]).length} with in-game speed/acceleration stats so far.`,
  };
}

export default async function VehiclesCatalog({ searchParams }: PageProps<"/catalog/vehicles">) {
  const sp = await searchParams;
  const initialQuery = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const ar = (await getLocale()) === "ar";
  const classes = [
    { id: "super", label: ar ? "سوبر كار" : "Super", emoji: "🏎️" },
    { id: "car", label: ar ? "سيارات" : "Cars", emoji: "🚗" },
    { id: "suv", label: ar ? "SUV وفانات" : "SUVs & vans", emoji: "🚙" },
    { id: "truck", label: ar ? "بيك أب وشاحنات" : "Trucks", emoji: "🛻" },
    { id: "motorcycle", label: ar ? "دبابات" : "Motorcycles", emoji: "🏍️" },
    { id: "bicycle", label: ar ? "دراجات هوائية" : "Bicycles", emoji: "🚲" },
    { id: "boat", label: ar ? "قوارب" : "Boats", emoji: "🚤" },
    { id: "plane", label: ar ? "طيارات" : "Planes", emoji: "✈️" },
    { id: "helicopter", label: ar ? "هليكوبتر" : "Helicopters", emoji: "🚁" },
    { id: "military", label: ar ? "عسكرية" : "Military", emoji: "🪖" },
    { id: "service", label: ar ? "خدمات وشرطة" : "Service & police", emoji: "🚓" },
    { id: "special", label: ar ? "خاصة" : "Special", emoji: "🛞" },
  ];
  const rows = VEHICLES.map(([name, cls, note, stats]) => ({ name, cls, note, stats, badge: null, sub: null, image: catalogImage("vehicle", name), emoji: classes.find((c) => c.id === cls)?.emoji }));
  const withStats = VEHICLES.filter((v) => v[3]).length;
  return (
    <main className="mx-auto max-w-5xl px-4 pt-5">
      <header className="mb-5 rounded-3xl p-5 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#0f9f97,#2a1240)" }}>
        <h1 className="text-[28px] leading-tight">{ar ? "كتالوج مركبات GTA 6 🏎️" : "GTA 6 vehicle catalog 🏎️"}</h1>
        <p className="mt-2 text-[14px] text-white/90">
          {ar
            ? `قائمة متنامية تضم ${VEHICLES.length} مركبة: سيارات، دبابات، دراجات هوائية، قوارب، طيارات ومركبات عسكرية. ${withStats} منها بأرقام قائمة التعديل داخل اللعبة (من 10)، والباقي بنضيف أرقامها أول ما تنشر.`
            : `A growing list of ${VEHICLES.length} vehicles: cars, motorcycles, bicycles, boats, aircraft and military vehicles. ${withStats} have the in-game tuning stats (out of 10); the rest get stats as they're published.`}
        </p>
      </header>
      <Catalog
        rows={rows}
        classes={classes}
        statLabels={ar ? ["السرعة", "التسارع", "تحكم الإسفلت", "تحكم الوعر", "المتانة"] : ["Speed", "Acceleration", "Road handling", "Off-road", "Strength"]}
        ar={ar}
        initialQuery={initialQuery}
      />
      <p className="mt-6 text-[12px] text-dim">
        {ar ? "المصادر: قائمة التعديل داخل اللعبة، مجمّعة في " : "Sources: the in-game tuning menu, compiled by "}
        {VEHICLE_SOURCES.map((s, i) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-teal underline">
            {s.title.split(" — ")[0]}
            {i < VEHICLE_SOURCES.length - 1 ? "، " : ""}
          </a>
        ))}
        {ar ? ". Rockstar ما تنشر سرعات رسمية." : ". Rockstar doesn't publish official top speeds."}
      </p>
    </main>
  );
}
