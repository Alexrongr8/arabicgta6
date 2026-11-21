import type { Metadata } from "next";
import { WEAPONS, WEAPON_SOURCE } from "../../../../data/catalog-weapons";
import { getLocale } from "@/lib/session";
import { Catalog } from "@/components/Catalog";

const WITH_STATS = WEAPONS.filter((w) => w[3]).length;
const WITH_PRICE = WEAPONS.filter((w) => w[2] && /\$/.test(w[2])).length;
import { catalogImage } from "@/lib/catalog-images";

export async function generateMetadata(): Promise<Metadata> {
  const ar = (await getLocale()) === "ar";
  return {
    title: ar ? "كتالوج أسلحة GTA 6" : "GTA 6 weapons catalog",
    description: ar
      ? `${WEAPONS.length} سلاح في GTA 6، منها ${WITH_STATS} بأرقام القوة والدقة والتحكم والمدى من داخل اللعبة و${WITH_PRICE} بسعر ومكان شراء معروف.`
      : `${WEAPONS.length} GTA 6 weapons; ${WITH_STATS} with in-game damage/accuracy/handling/range and ${WITH_PRICE} with a known price and shop.`,
  };
}

export default async function WeaponsCatalog({ searchParams }: PageProps<"/catalog/weapons">) {
  const sp = await searchParams;
  const initialQuery = typeof sp.q === "string" ? sp.q.slice(0, 80) : "";
  const ar = (await getLocale()) === "ar";
  const classes = [
    { id: "pistol", label: ar ? "مسدسات" : "Pistols", emoji: "🔫" },
    { id: "revolver", label: ar ? "ريفولفر" : "Revolvers", emoji: "🤠" },
    { id: "smg", label: ar ? "رشاشات خفيفة" : "SMGs", emoji: "💨" },
    { id: "shotgun", label: ar ? "شوزن" : "Shotguns", emoji: "💥" },
    { id: "rifle", label: ar ? "رشاشات وقناصات" : "Rifles & snipers", emoji: "🎯" },
    { id: "mg", label: ar ? "رشاشات ثقيلة" : "Machine guns", emoji: "⚙️" },
    { id: "launcher", label: ar ? "قواذف" : "Launchers", emoji: "🚀" },
    { id: "melee", label: ar ? "أسلحة بيضاء" : "Melee", emoji: "🔪" },
    { id: "explosive", label: ar ? "متفجرات" : "Explosives", emoji: "🧨" },
  ];
  const rows = WEAPONS.map(([name, cls, price, stats, unique, mods]) => ({
    name,
    cls,
    note: price,
    stats,
    badge: unique ? (ar ? "فريد" : "Unique") : null,
    sub: mods ? (ar ? "الأرقام مع الإضافات المركّبة" : "Stats shown with mods fitted") : null,
    image: catalogImage("weapon", name),
    emoji: classes.find((c) => c.id === cls)?.emoji,
  }));
  return (
    <main className="mx-auto max-w-5xl px-4 pt-5">
      <header className="mb-5 rounded-3xl p-5 text-white shadow-lg" style={{ background: "linear-gradient(#0006,#0006), linear-gradient(135deg,#ff8a1f,#f0287a)" }}>
        <h1 className="text-[28px] leading-tight">{ar ? "كتالوج أسلحة GTA 6 🔫" : "GTA 6 weapon catalog 🔫"}</h1>
        <p className="mt-2 text-[14px] text-white/90">
          {ar
            ? `${WEAPONS.length} سلاح. ${WITH_STATS} منها بأرقام شاشة الأسلحة داخل اللعبة (من 10): القوة، الدقة، التحكم والمدى، و${WITH_PRICE} بسعر ومحل شراء معروف. الباقي نكمّله أول ما يتأكد.`
            : `${WEAPONS.length} weapons. ${WITH_STATS} have the in-game stat bars (out of 10) and ${WITH_PRICE} a known price and shop; the rest are filled in once verified.`}
        </p>
      </header>
      <Catalog rows={rows} classes={classes} statLabels={ar ? ["القوة", "الدقة", "التحكم", "المدى"] : ["Damage", "Accuracy", "Handling", "Range"]} ar={ar} initialQuery={initialQuery} />
      <p className="mt-6 text-[12px] text-dim">
        {ar ? "مصدر الأرقام: شاشة الأسلحة داخل اللعبة، مجمّعة في " : "Stats from the in-game weapon screen, compiled by "}
        <a href={WEAPON_SOURCE.url} target="_blank" rel="noopener noreferrer nofollow" className="text-success underline">
          MeowDB
        </a>
        {ar ? ". Rockstar ما تنشر أرقام رسمية خارج اللعبة." : ". Rockstar doesn't publish stats outside the game."}
      </p>
    </main>
  );
}
