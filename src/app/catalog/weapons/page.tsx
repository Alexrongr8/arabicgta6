import type { Metadata } from "next";
import { WEAPONS, WEAPON_SOURCE } from "../../../../data/catalog-weapons";
import { getLocale } from "@/lib/session";
import { Catalog } from "@/components/Catalog";
import { catalogImage } from "@/lib/catalog-images";

export async function generateMetadata(): Promise<Metadata> {
  const ar = (await getLocale()) === "ar";
  return {
    title: ar ? "كل أسلحة GTA 6 بالمواصفات" : "Every GTA 6 weapon with stats",
    description: ar ? `${WEAPONS.length} سلاح في GTA 6 مع القوة والدقة والتحكم والمدى، والسعر ومكان الشراء.` : `${WEAPONS.length} GTA 6 weapons with damage, accuracy, handling, range, price and where to buy.`,
  };
}

export default async function WeaponsCatalog() {
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
      <header className="mb-5 rounded-3xl p-5 text-white shadow-lg" style={{ background: "linear-gradient(135deg,#ff8a1f,#f0287a)" }}>
        <h1 className="text-[28px] leading-tight">{ar ? "كل أسلحة GTA 6 🔫" : "Every GTA 6 weapon 🔫"}</h1>
        <p className="mt-2 text-[14px] text-white/90">
          {ar
            ? `${WEAPONS.length} سلاح بالمواصفات من شاشة الأسلحة داخل اللعبة نفسها (من 10): القوة، الدقة، التحكم، والمدى — مع السعر ومحل الشراء.`
            : `${WEAPONS.length} weapons with the game's own stat bars (out of 10): damage, accuracy, handling and range — plus price and shop.`}
        </p>
      </header>
      <Catalog rows={rows} classes={classes} statLabels={ar ? ["القوة", "الدقة", "التحكم", "المدى"] : ["Damage", "Accuracy", "Handling", "Range"]} ar={ar} />
      <p className="mt-6 text-[12px] text-dim">
        {ar ? "مصدر الأرقام: شاشة الأسلحة داخل اللعبة، مجمّعة في " : "Stats from the in-game weapon screen, compiled by "}
        <a href={WEAPON_SOURCE.url} target="_blank" rel="noopener noreferrer nofollow" className="text-teal underline">
          MeowDB
        </a>
        {ar ? ". Rockstar ما تنشر أرقام رسمية خارج اللعبة." : ". Rockstar doesn't publish stats outside the game."}
      </p>
    </main>
  );
}
