import type { Metadata } from "next";
import Link from "next/link";
import { ANIMALS, ANIMAL_SOURCES, type AGroup } from "../../../../data/catalog-animals";
import { getLocale } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const ar = (await getLocale()) === "ar";
  return { title: ar ? "حيوانات GTA 6 — الكتالوج" : "GTA 6 animals catalog", description: ar ? "حيوانات Leonida: وين تلقاها، وش تصطاد، ووش الخطير منها." : "Leonida's wildlife: where to find it, what you can hunt and what's dangerous." };
}

const GROUPS: { id: AGroup; ar: string; en: string; emoji: string }[] = [
  { id: "reptile", ar: "زواحف", en: "Reptiles", emoji: "🐊" },
  { id: "mammal", ar: "ثدييات", en: "Mammals", emoji: "🦌" },
  { id: "bird", ar: "طيور", en: "Birds", emoji: "🦩" },
  { id: "sea", ar: "كائنات بحرية", en: "Sea life", emoji: "🦈" },
  { id: "fish", ar: "أسماك", en: "Fish", emoji: "🐟" },
  { id: "pet", ar: "قطط وكلاب", en: "Cats & dogs", emoji: "🐕" },
  { id: "cryptid", ar: "مخلوقات غامضة", en: "Cryptids", emoji: "👣" },
];

export default async function AnimalsCatalog() {
  const ar = (await getLocale()) === "ar";
  return (
    <main className="mx-auto max-w-5xl px-4 pt-5">
      <header className="mb-5 rounded-3xl p-5 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#16a34a,#0f766e)" }}>
        <h1 className="text-[28px] leading-tight">{ar ? "حيوانات GTA 6 🐊" : "GTA 6 animals 🐊"}</h1>
        <p className="mt-2 text-[14px] text-white/90">
          {ar
            ? "دفتر الحيوانات في اللعبة فيه 255 خانة في 8 أقسام (الصيد 61، صيد السمك 35، الطيور 60…). هنا أبرز الحيوانات اللي انكشفت: وين تلقاها، وش تقدر تصطاد، ووش اللي لازم تبعد عنه."
            : "The in-game wildlife tracker has 255 entries across 8 tabs (Hunting 61, Fishing 35, Birds 60…). Here are the animals revealed so far: where to find them, what you can hunt and what to avoid."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-extrabold">
          <span className="rounded-full bg-white/20 px-3 py-1">🎯 {ar ? "يصطاد" : "Huntable"}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">🎣 {ar ? "صيد سمك" : "Fishable"}</span>
          <span className="rounded-full bg-white/20 px-3 py-1">⚠️ {ar ? "خطير" : "Dangerous"}</span>
        </div>
      </header>
      {GROUPS.map((g) => {
        const list = ANIMALS.filter((a) => a.group === g.id);
        if (!list.length) return null;
        return (
          <section key={g.id} className="mb-6">
            <h2 className="mb-3 text-[20px]">
              {g.emoji} {ar ? g.ar : g.en} <span className="text-[14px] text-dim">({list.length})</span>
            </h2>
            <ul className="grid gap-2.5 md:grid-cols-2">
              {list.map((a) => (
                <li key={a.en} className="card p-3.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-extrabold">{ar ? a.ar : a.en}</span>
                    {ar && <span className="text-[12px] text-dim" dir="ltr">{a.en}</span>}
                    {a.hunt && <span className="rounded-full bg-chip2 px-2 py-0.5 text-[11px] font-bold">🎯 {ar ? "يصطاد" : "Hunt"}</span>}
                    {a.fish && <span className="rounded-full bg-chip2 px-2 py-0.5 text-[11px] font-bold">🎣 {ar ? "صيد" : "Fish"}</span>}
                  </div>
                  {(a.whereAr || a.whereEn) && <p className="mt-1 text-[13px] text-muted">📍 {ar ? a.whereAr : a.whereEn}</p>}
                  {(a.dangerAr || a.dangerEn) && <p className="mt-1 text-[12.5px] font-bold text-[#dc2626]">⚠️ {ar ? a.dangerAr : a.dangerEn}</p>}
                  {a.link && (
                    <Link href={`/item/${a.link}`} className="mt-1 inline-block text-[12.5px] font-bold text-pink">
                      {ar ? "الدليل المرتبط ←" : "Related guide →"}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <p className="text-[12px] leading-relaxed text-dim">
        {ar ? "ملاحظة: المصادر مختلفة في العدد (255 خانة مقابل 170+ نوع)، والدب الأسود لسه مو مؤكد. المصادر: " : "Note: sources disagree on totals (255 entries vs 170+ species) and the black bear isn't confirmed. Sources: "}
        {ANIMAL_SOURCES.map((s, i) => (
          <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="text-teal underline">
            {s.title.split(" — ")[0]}
            {i < ANIMAL_SOURCES.length - 1 ? "، " : ""}
          </a>
        ))}
      </p>
    </main>
  );
}
