import Link from "next/link";
import type { Locale } from "@/lib/types";

const TILES = [
  { href: "/catalog/weapons", emoji: "🔫", ar: "كل الأسلحة", en: "All weapons", subAr: "121 سلاح بالقوة والدقة والمدى", subEn: "121 guns with damage, accuracy, range", bg: "linear-gradient(135deg,#ff8a1f,#f0287a)" },
  { href: "/catalog/vehicles", emoji: "🏎️", ar: "كل المركبات", en: "All vehicles", subAr: "سيارات، دبابات، قوارب، طيارات", subEn: "Cars, bikes, boats, aircraft", bg: "linear-gradient(135deg,#0f9f97,#2a1240)" },
  { href: "/catalog/animals", emoji: "🐊", ar: "كل الحيوانات", en: "All animals", subAr: "وين تلقاها ووش الخطير", subEn: "Where to find them, what's dangerous", bg: "linear-gradient(135deg,#16a34a,#0f766e)" },
  { href: "/trophies", emoji: "🏆", ar: "كل الكؤوس", en: "All trophies", subAr: "55 كأس بلايستيشن وإكس بوكس", subEn: "55 PS5 & Xbox trophies", bg: "linear-gradient(135deg,#2a1240,#7c3aed)" },
];

export function CatalogTiles({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {TILES.map((t) => (
        <Link key={t.href} href={t.href} className="card-hover flex min-h-[120px] flex-col justify-between rounded-3xl p-4 text-white shadow-lg" style={{ background: t.bg }}>
          <span className="text-3xl">{t.emoji}</span>
          <span>
            <span className="font-head block text-[18px] leading-tight">{ar ? t.ar : t.en}</span>
            <span className="mt-0.5 block text-[11.5px] leading-snug text-white/85">{ar ? t.subAr : t.subEn}</span>
          </span>
        </Link>
      ))}
    </div>
  );
}
