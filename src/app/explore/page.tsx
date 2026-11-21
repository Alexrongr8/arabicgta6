import Link from "next/link";
import type { Metadata } from "next";
import { getCounts } from "@/lib/data";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/session";
import { CategoryGrid } from "@/components/CategoryGrid";

export async function generateMetadata(): Promise<Metadata> {
  return { title: t(await getLocale(), "categories") };
}

export default async function Explore() {
  const locale = await getLocale();
  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      <h1 className="mb-1 text-2xl font-extrabold">{t(locale, "categories")}</h1>
      <p className="mb-5 text-sm text-muted">{t(locale, "tagline")}</p>
      <Link href="/trophies" className="card-hover mb-4 flex items-center gap-3 rounded-3xl p-4 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#2a1240,#7c3aed 60%,#f0287a)" }}>
        <span className="text-3xl">🏆</span>
        <span className="font-head text-[19px]">{locale === "ar" ? "كل كؤوس GTA 6 (بلايستيشن وإكس بوكس)" : "All GTA 6 trophies (PS5 & Xbox)"}</span>
      </Link>
      <div className="mb-4 grid grid-cols-2 gap-3">
        <Link href="/catalog/weapons" className="card-hover rounded-3xl p-4 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#ff8a1f,#f0287a)" }}>
          <span className="text-2xl">🔫</span>
          <span className="font-head mt-1 block text-[17px] leading-tight">{locale === "ar" ? "كل الأسلحة بالمواصفات" : "All weapons + stats"}</span>
        </Link>
        <Link href="/catalog/vehicles" className="card-hover rounded-3xl p-4 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#0f9f97,#2a1240)" }}>
          <span className="text-2xl">🏎️</span>
          <span className="font-head mt-1 block text-[17px] leading-tight">{locale === "ar" ? "كل المركبات بالمواصفات" : "All vehicles + stats"}</span>
        </Link>
      </div>
      <Link href="/community" className="card-hover mb-4 flex items-center gap-3 rounded-3xl p-4 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#0f9f97,#7c3aed)" }}>
        <span className="text-3xl">🕵️</span>
        <span className="font-head text-[19px]">{locale === "ar" ? "اكتشافات اللاعبين — شارك اكتشافك باسمك" : "Player discoveries — share yours"}</span>
      </Link>
      <CategoryGrid locale={locale} counts={await getCounts()} />
    </main>
  );
}
