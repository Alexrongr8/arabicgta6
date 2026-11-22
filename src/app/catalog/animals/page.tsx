import { publicMetadata } from "@/lib/public-metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { ANIMALS, ANIMAL_SOURCES, type AGroup } from "../../../../data/catalog-animals";
import { getLocale } from "@/lib/session";
import { catalogImage } from "@/lib/catalog-images";
import { normalize } from "@/lib/normalize";
import { StatusBadge } from "@/components/StatusBadge";

export async function generateMetadata(): Promise<Metadata> {
  const ar = (await getLocale()) === "ar";
  return publicMetadata("/catalog/animals", ar ? "ar" : "en", { title: ar ? "حيوانات GTA 6 — الكتالوج" : "GTA 6 animals catalog", description: ar ? "حيوانات Leonida: وين تلقاها، وش تصطاد، ووش الخطير منها." : "Leonida's wildlife: where to find it, what you can hunt and what's dangerous." });
}

const GROUPS: { id: AGroup; ar: string; en: string; emoji: string }[] = [
  { id: "reptile", ar: "زواحف وبرمائيات", en: "Reptiles & amphibians", emoji: "🐊" },
  { id: "mammal", ar: "ثدييات", en: "Mammals", emoji: "🦌" },
  { id: "bird", ar: "طيور", en: "Birds", emoji: "🦩" },
  { id: "sea", ar: "كائنات بحرية", en: "Sea life", emoji: "🦈" },
  { id: "fish", ar: "أسماك", en: "Fish", emoji: "🐟" },
  { id: "farm", ar: "حيوانات المزارع", en: "Farm animals", emoji: "🐄" },
  { id: "pet", ar: "قطط وكلاب", en: "Cats & dogs", emoji: "🐕" },
  { id: "cryptid", ar: "مخلوقات غامضة", en: "Cryptids", emoji: "👣" },
];

export default async function AnimalsCatalog({ searchParams }: PageProps<"/catalog/animals">) {
  const ar = (await getLocale()) === "ar";
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q.slice(0, 80).trim() : "";
  const nq = normalize(q);
  const matches = (a: (typeof ANIMALS)[number]) => !nq || normalize(`${a.en} ${a.ar}`).includes(nq);
  const total = ANIMALS.filter(matches).length;
  return (
    <main className="mx-auto max-w-5xl px-4 pt-5">
      <header className="mb-5 rounded-3xl p-5 text-white shadow-lg" style={{ background: "linear-gradient(#0006,#0006), linear-gradient(135deg,#16a34a,#0f766e)" }}>
        <h1 className="text-[28px] leading-tight">{ar ? "حيوانات GTA 6 🐊" : "GTA 6 animals 🐊"}</h1>
        <p className="mt-2 text-[14px] text-white/90">
          {ar
            ? `استكشف ${ANIMALS.length} مدخلاً عن حيوانات Leonida، مع المواقع المذكورة في المصادر وملاحظات التحقق. الصور مرجعية من الواقع، وصور التماثيل موضّحة باسمها.`
            : `Explore ${ANIMALS.length} wildlife entries, with reported locations and verification notes. Photos are real-world references; statue references are labeled.`}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-extrabold">
          <span className="rounded-full bg-white/20 px-3 py-1">🎯 {ar ? "يصطاد" : "Huntable"}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">🎣 {ar ? "صيد سمك" : "Fishable"}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">⚠️ {ar ? "خطير" : "Dangerous"}</span>
        </div>
      </header>
      {q && (
        <div className="card mb-5 flex flex-wrap items-center gap-3 p-4 text-[14px]" role="status">
          <span className="flex-1">
            {ar ? `نتائج "${q}": ${total}` : `Results for "${q}": ${total}`}
          </span>
          <Link href="/catalog/animals" className="rounded-xl bg-pink px-3 py-1.5 text-[13px] font-extrabold text-black">
            {ar ? "اعرض كل الحيوانات" : "Show all animals"}
          </Link>
        </div>
      )}
      {GROUPS.map((g) => {
        const list = ANIMALS.filter((a) => a.group === g.id && matches(a));
        if (!list.length) return null;
        return (
          <section key={g.id} className="mb-6">
            <h2 className="mb-3 text-[20px]">
              {g.emoji} {ar ? g.ar : g.en} <span className="text-[14px] text-dim">({list.length})</span>
            </h2>
            <ul className="grid gap-2.5 md:grid-cols-2">
              {list.map((a) => {
                const img = catalogImage("animal", a.en);
                return (
                <li key={a.en} className="card overflow-hidden p-0">
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-chip">
                    <span className="absolute inset-0 grid place-items-center text-6xl opacity-60">{g.emoji}</span>
                    {img && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.url} alt={a.en} loading="lazy" referrerPolicy="no-referrer" className="absolute inset-0 size-full object-cover" />
                    )}
                    {img && <a href={img.page} target="_blank" rel="noopener noreferrer nofollow" aria-label={ar ? `مصدر صورة ${a.ar}` : `Image source for ${a.en}`} className="absolute bottom-1.5 end-1.5 rounded-full bg-black/70 px-2 py-1 text-[11px] text-white underline decoration-white/40 underline-offset-2" dir="ltr">📷 {img.credit} ({a.group === "cryptid" ? (ar ? "صورة مرجعية لتمثال" : "reference statue photo") : (ar ? "صورة مرجعية من الواقع" : "real-world reference photo")})</a>}
                  </div>
                  <div className="p-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-extrabold">{ar ? a.ar : a.en}</span>
                    {ar && <span className="text-[12px] text-dim" dir="ltr">{a.en}</span>}
                    {a.unconfirmed && <StatusBadge status="rumor" locale={ar ? "ar" : "en"} />}
                    {a.hunt && <span className="rounded-full bg-chip2 px-2 py-0.5 text-[11px] font-bold">🎯 {ar ? "يصطاد" : "Hunt"}</span>}
                    {a.fish && <span className="rounded-full bg-chip2 px-2 py-0.5 text-[11px] font-bold">🎣 {ar ? "صيد" : "Fish"}</span>}
                  </div>
                  {(a.whereAr || a.whereEn) && <p className="mt-1 text-[13px] text-muted">📍 {ar ? a.whereAr : a.whereEn}</p>}
                  {(a.dangerAr || a.dangerEn) && <p className="mt-1 text-[12.5px] font-bold text-error">⚠️ {ar ? a.dangerAr : a.dangerEn}</p>}
                  {a.link && (
                    <Link href={`/item/${a.link}`} className="mt-1 inline-block text-[12.5px] font-bold text-accent">
                      {ar ? "الدليل المرتبط ←" : "Related guide →"}
                    </Link>
                  )}
                  </div>
                </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <p className="text-[12px] leading-relaxed text-dim">
        {ar ? "ملاحظة: المصادر مختلفة في العدد (255 خانة مقابل 170+ نوع)، والدب الأسود لسه مو مؤكد. المصادر: " : "Note: sources disagree on totals (255 entries vs 170+ species) and the black bear isn't confirmed. Sources: "}
        {ANIMAL_SOURCES.map((s, i) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-success underline">
            {s.title.split(" — ")[0]}
            {i < ANIMAL_SOURCES.length - 1 ? "، " : ""}
          </a>
        ))}
      </p>
    </main>
  );
}
