import type { Metadata } from "next";
import { VEHICLES, VEHICLE_SOURCES } from "../../../../data/catalog-vehicles";
import { getLocale } from "@/lib/session";
import { Catalog } from "@/components/Catalog";
import { catalogImage } from "@/lib/catalog-images";

export async function generateMetadata(): Promise<Metadata> {
  const ar = (await getLocale()) === "ar";
  return {
    title: ar ? "كل مركبات GTA 6 بالمواصفات" : "Every GTA 6 vehicle with stats",
    description: ar ? "سيارات ودبابات وقوارب وطيارات GTA 6 مع السرعة والتسارع والتحكم." : "GTA 6 cars, bikes, boats, aircraft and military vehicles with speed, acceleration and handling.",
  };
}

export default async function VehiclesCatalog() {
  const ar = (await getLocale()) === "ar";
  const classes = [
    { id: "super", label: ar ? "سوبر كار" : "Super", emoji: "🏎️" },
    { id: "car", label: ar ? "سيارات" : "Cars", emoji: "🚗" },
    { id: "suv", label: ar ? "SUV وفانات" : "SUVs & vans", emoji: "🚙" },
    { id: "truck", label: ar ? "بيك أب وشاحنات" : "Trucks", emoji: "🛻" },
    { id: "motorcycle", label: ar ? "دبابات" : "Motorcycles", emoji: "🏍️" },
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
        <h1 className="text-[28px] leading-tight">{ar ? "كل مركبات GTA 6 🏎️" : "Every GTA 6 vehicle 🏎️"}</h1>
        <p className="mt-2 text-[14px] text-white/90">
          {ar
            ? `${VEHICLES.length} مركبة: سيارات، دبابات، قوارب، طيارات، هليكوبترات وعسكرية. ${withStats} منها بأرقام قائمة التعديل داخل اللعبة (من 10)، والباقي بنضيف أرقامها أول ما تنشر.`
            : `${VEHICLES.length} vehicles: cars, bikes, boats, planes, helicopters and military. ${withStats} have the in-game tuning stats (out of 10); the rest get stats as they're published.`}
        </p>
      </header>
      <Catalog
        rows={rows}
        classes={classes}
        statLabels={ar ? ["السرعة", "التسارع", "تحكم الإسفلت", "تحكم الوعر", "المتانة"] : ["Speed", "Acceleration", "Road handling", "Off-road", "Strength"]}
        ar={ar}
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
