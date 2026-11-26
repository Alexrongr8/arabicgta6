/**
 * Quiz questions built only from the site's own catalogs (weapons, vehicles, animals): names, classes,
 * prices, stat bars and pictures that are already published on the catalog pages. Nothing is invented.
 * The daily set is the same for everyone and changes at midnight Riyadh time.
 */
import { WEAPONS } from "../../data/catalog-weapons";
import { VEHICLES } from "../../data/catalog-vehicles";
import { ANIMALS } from "../../data/catalog-animals";
import { catalogImage } from "./catalog-images";

export type Question = {
  id: string;
  kind: "image" | "text";
  /** question text */
  ar: string;
  en: string;
  /** subject shown in Latin script under the question (a weapon or vehicle name) */
  subject?: string;
  image?: { url: string; credit: string };
  options: { ar: string; en: string }[];
  answer: number;
  /** one line shown after answering */
  factAr?: string;
  factEn?: string;
};

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Rand = () => number;
const pickOne = <T,>(r: Rand, list: T[]): T => list[Math.floor(r() * list.length)];
function sample<T>(r: Rand, list: T[], n: number): T[] {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy.slice(0, n);
}
const same = (s: string) => ({ ar: s, en: s });

const W_CLASS: Record<string, { ar: string; en: string }> = {
  pistol: { ar: "مسدس", en: "Pistol" }, revolver: { ar: "ريفولفر", en: "Revolver" }, smg: { ar: "رشاش خفيف", en: "SMG" }, shotgun: { ar: "شوزن", en: "Shotgun" },
  rifle: { ar: "رشاش أو قناصة", en: "Rifle or sniper" }, mg: { ar: "رشاش ثقيل", en: "Machine gun" }, launcher: { ar: "قاذف", en: "Launcher" }, melee: { ar: "سلاح أبيض", en: "Melee" }, explosive: { ar: "متفجرات", en: "Explosive" },
};
const V_CLASS: Record<string, { ar: string; en: string }> = {
  super: { ar: "سوبر كار", en: "Super car" }, car: { ar: "سيارة", en: "Car" }, suv: { ar: "SUV أو فان", en: "SUV or van" }, truck: { ar: "بيك أب أو شاحنة", en: "Truck" }, motorcycle: { ar: "دباب", en: "Motorcycle" },
  bicycle: { ar: "دراجة هوائية", en: "Bicycle" }, boat: { ar: "قارب", en: "Boat" }, plane: { ar: "طيارة", en: "Plane" }, helicopter: { ar: "هليكوبتر", en: "Helicopter" }, military: { ar: "عسكرية", en: "Military" }, service: { ar: "خدمات أو شرطة", en: "Service or police" }, special: { ar: "خاصة", en: "Special" },
};

const weapons = WEAPONS.map(([name, cls, price, stats]) => ({ name, cls, price, stats, image: catalogImage("weapon", name) }));
const vehicles = VEHICLES.map(([name, cls, , stats]) => ({ name, cls, stats, image: catalogImage("vehicle", name) }));
const animals = ANIMALS.map((a) => ({ ...a, image: catalogImage("animal", a.en) }));
const dollars = (price: string | null) => price?.match(/^\$[\d,]+/)?.[0] ?? null;

type Maker = (r: Rand) => Question | null;

const makers: Maker[] = [
  // Which vehicle is this? (picture)
  (r) => {
    const pool = vehicles.filter((v) => v.image);
    const target = pickOne(r, pool);
    const others = sample(r, pool.filter((v) => v.name !== target.name && v.cls === target.cls), 3);
    const fill = others.length < 3 ? sample(r, pool.filter((v) => v.name !== target.name && !others.includes(v)), 3 - others.length) : [];
    const options = sample(r, [target, ...others, ...fill], 4);
    return { id: `vi:${target.name}`, kind: "image", ar: "وش اسم هذي المركبة؟", en: "Which vehicle is this?", image: { url: target.image!.url, credit: target.image!.credit }, options: options.map((o) => same(o.name)), answer: options.indexOf(target),
      factAr: `${target.name} — ${V_CLASS[target.cls]?.ar ?? ""}`, factEn: `${target.name} — ${V_CLASS[target.cls]?.en ?? ""}` };
  },
  // Which weapon is this? (picture)
  (r) => {
    const pool = weapons.filter((w) => w.image);
    const target = pickOne(r, pool);
    const others = sample(r, pool.filter((w) => w.name !== target.name && w.cls === target.cls), 3);
    const fill = others.length < 3 ? sample(r, pool.filter((w) => w.name !== target.name && !others.includes(w)), 3 - others.length) : [];
    const options = sample(r, [target, ...others, ...fill], 4);
    return { id: `wi:${target.name}`, kind: "image", ar: "وش اسم هذا السلاح؟", en: "Which weapon is this?", image: { url: target.image!.url, credit: target.image!.credit }, options: options.map((o) => same(o.name)), answer: options.indexOf(target),
      factAr: `${target.name} — ${W_CLASS[target.cls]?.ar ?? ""}${dollars(target.price) ? ` · ${dollars(target.price)}` : ""}`, factEn: `${target.name} — ${W_CLASS[target.cls]?.en ?? ""}${dollars(target.price) ? ` · ${dollars(target.price)}` : ""}` };
  },
  // Which animal of Leonida is this? (picture)
  (r) => {
    const pool = animals.filter((a) => a.image);
    const target = pickOne(r, pool);
    const others = sample(r, pool.filter((a) => a.en !== target.en && a.group === target.group), 3);
    const fill = others.length < 3 ? sample(r, pool.filter((a) => a.en !== target.en && !others.includes(a)), 3 - others.length) : [];
    const options = sample(r, [target, ...others, ...fill], 4);
    return { id: `ai:${target.en}`, kind: "image", ar: "أي حيوان من حيوانات Leonida هذا؟", en: "Which Leonida animal is this?", image: { url: target.image!.url, credit: target.image!.credit }, options: options.map((o) => ({ ar: o.ar, en: o.en })), answer: options.indexOf(target),
      factAr: [target.ar, target.whereAr].filter(Boolean).join(" — "), factEn: [target.en, target.whereEn].filter(Boolean).join(" — ") };
  },
  // Highest stat among four vehicles
  (r) => {
    const stat = pickOne(r, [{ i: 0, ar: "الأعلى في السرعة", en: "the highest top speed" }, { i: 1, ar: "الأقوى في التسارع", en: "the best acceleration" }, { i: 3, ar: "الأفضل في البر (Off-road)", en: "the best off-road handling" }]);
    const pool = vehicles.filter((v) => v.stats);
    const four = sample(r, pool, 4);
    const values = four.map((v) => v.stats![stat.i]);
    const max = Math.max(...values);
    if (four.length < 4 || values.filter((v) => v === max).length !== 1) return null;
    const answer = values.indexOf(max);
    return { id: `vs:${stat.i}:${four.map((v) => v.name).join("|")}`, kind: "text", ar: `أي مركبة ${stat.ar} حسب أرقام اللعبة؟`, en: `Which vehicle has ${stat.en} in the game's own stats?`, options: four.map((v) => same(v.name)), answer,
      factAr: `${four[answer].name}: ${max} من 10`, factEn: `${four[answer].name}: ${max} out of 10` };
  },
  // Highest stat among four weapons
  (r) => {
    const stat = pickOne(r, [{ i: 0, ar: "الأقوى ضرراً (Damage)", en: "the highest damage" }, { i: 1, ar: "الأدق (Accuracy)", en: "the best accuracy" }, { i: 3, ar: "الأبعد مدى (Range)", en: "the longest range" }]);
    const cls = pickOne(r, ["pistol", "smg", "shotgun", "rifle"]);
    const pool = weapons.filter((w) => w.stats && w.cls === cls);
    const four = sample(r, pool, 4);
    const values = four.map((w) => w.stats![stat.i]);
    const max = Math.max(...values);
    if (four.length < 4 || values.filter((v) => v === max).length !== 1) return null;
    const answer = values.indexOf(max);
    return { id: `ws:${stat.i}:${four.map((w) => w.name).join("|")}`, kind: "text", ar: `أي سلاح ${stat.ar} بين هذي؟`, en: `Which of these weapons has ${stat.en}?`, options: four.map((w) => same(w.name)), answer,
      factAr: `${four[answer].name}: ${max} من 10`, factEn: `${four[answer].name}: ${max} out of 10` };
  },
  // What type of weapon is X?
  (r) => {
    const target = pickOne(r, weapons.filter((w) => W_CLASS[w.cls]));
    const options = sample(r, [target.cls, ...sample(r, Object.keys(W_CLASS).filter((c) => c !== target.cls), 3)], 4);
    return { id: `wc:${target.name}`, kind: "text", ar: "وش نوع هذا السلاح؟", en: "What type of weapon is this?", subject: target.name, options: options.map((c) => W_CLASS[c] ?? same(c)), answer: options.indexOf(target.cls) };
  },
  // How much does weapon X cost?
  (r) => {
    const pool = weapons.filter((w) => dollars(w.price));
    const target = pickOne(r, pool);
    const price = dollars(target.price)!;
    const others = sample(r, [...new Set(pool.map((w) => dollars(w.price)!).filter((p) => p !== price))], 3);
    if (others.length < 3) return null;
    const options = sample(r, [price, ...others], 4).sort((a, b) => Number(a.replace(/[$,]/g, "")) - Number(b.replace(/[$,]/g, "")));
    return { id: `wp:${target.name}`, kind: "text", ar: "كم سعره في المحل؟", en: "How much does it cost in the shop?", subject: target.name, options: options.map(same), answer: options.indexOf(price),
      factAr: `${target.name}: ${target.price}`, factEn: `${target.name}: ${target.price}` };
  },
  // Where does animal X live?
  (r) => {
    const pool = animals.filter((a) => a.whereAr && a.whereEn);
    const target = pickOne(r, pool);
    const others = sample(r, [...new Map(pool.filter((a) => a.whereEn !== target.whereEn).map((a) => [a.whereEn, a])).values()], 3);
    if (others.length < 3) return null;
    const options = sample(r, [target, ...others], 4);
    return { id: `aw:${target.en}`, kind: "text", ar: `وين تلقى «${target.ar}» في Leonida؟`, en: `Where do you find the ${target.en} in Leonida?`, options: options.map((o) => ({ ar: o.whereAr ?? "", en: o.whereEn ?? "" })), answer: options.indexOf(target) };
  },
];

/** Picture rounds are the most fun, so the order of a daily set favours them. */
const DAILY_ORDER = [0, 3, 1, 6, 2];

function build(r: Rand, order: number[]): Question[] {
  const out: Question[] = []; const seen = new Set<string>();
  for (const index of order) {
    for (let attempt = 0; attempt < 12; attempt++) {
      const q = makers[index](r);
      if (!q || q.answer < 0 || q.options.length !== 4 || seen.has(q.id) || new Set(q.options.map((o) => o.en)).size !== 4) continue;
      seen.add(q.id); out.push(q); break;
    }
  }
  return out;
}

export function dailyQuiz(day: number): Question[] {
  return build(rng(day * 2654435761), DAILY_ORDER);
}

/** A long shuffled run for the marathon mode. */
export function arcadeQuiz(seed: number, count = 40): Question[] {
  const r = rng(seed);
  return build(r, Array.from({ length: count }, () => pickOne(r, [0, 0, 1, 1, 2, 3, 4, 5, 6, 7])));
}
