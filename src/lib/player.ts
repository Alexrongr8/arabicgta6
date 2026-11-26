/**
 * The visitor's own progress: daily streak, XP and level, read and saved articles, quiz scores, daily
 * missions and badges. Everything lives in this browser's localStorage (no account, no server), so it
 * works for every visitor and never leaves the device.
 */
import { useSyncExternalStore } from "react";

export type Player = {
  v: 1;
  xp: number;
  /** first visit, ms */
  first: number;
  /** last activity, ms */
  last: number;
  /** when the previous visit ended, ms: anything published after it is "new" */
  prev: number;
  /** Riyadh day numbers with a visit */
  days: number[];
  best: number;
  /** slug → time read */
  read: Record<string, number>;
  /** category → articles read */
  cats: Record<string, number>;
  saved: string[];
  /** day → daily quiz score (0-5) */
  quiz: Record<string, number>;
  /** best arcade run */
  arcade: number;
  /** day → shorts watched that day */
  sh: Record<string, number>;
  /** day → shares that earned XP */
  shr: Record<string, number>;
  /** days whose three missions were all completed (bonus paid) */
  mis: number[];
};

const KEY = "ag6.player.v1";
const EVENT = "ag6:player";
export const XP_EVENT = "ag6:xp";
const VISIT_GAP = 30 * 60_000;

/** Days since epoch in Riyadh time (UTC+3), the same clock as the daily secret and quiz. */
export const dayNumber = (now = Date.now()) => Math.floor((now + 3 * 3600e3) / 864e5);

export const XP = { visit: 10, streakStep: 2, read: 5, quizCorrect: 4, quizPerfect: 10, short: 1, share: 3, missions: 15, arcadeStep: 1 } as const;

/** Levels are wanted stars: 0 to 5. */
export const LEVELS = [
  { xp: 0, ar: "سائح في Vice City", en: "Vice City tourist" },
  { xp: 60, ar: "مبتدئ الشوارع", en: "Street rookie" },
  { xp: 180, ar: "صاحب خبرة", en: "Hustler" },
  { xp: 400, ar: "ذيب Leonida", en: "Leonida wolf" },
  { xp: 800, ar: "زعيم الحارة", en: "Neighbourhood boss" },
  { xp: 1500, ar: "أسطورة Leonida", en: "Leonida legend" },
] as const;

export function levelOf(xp: number) {
  let stars = 0;
  for (let i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) stars = i;
  const next = LEVELS[stars + 1] ?? null;
  const base = LEVELS[stars].xp;
  return { stars, ...LEVELS[stars], next, progress: next ? Math.min(1, (xp - base) / (next.xp - base)) : 1, toNext: next ? next.xp - xp : 0 };
}

/** Consecutive days ending today (or yesterday, when today has no visit yet). */
export function streakOf(days: number[], today = dayNumber()): number {
  const set = new Set(days);
  let d = set.has(today) ? today : today - 1;
  let n = 0;
  while (set.has(d)) { n++; d--; }
  return n;
}

const fresh = (now: number): Player => ({ v: 1, xp: 0, first: now, last: 0, prev: 0, days: [], best: 0, read: {}, cats: {}, saved: [], quiz: {}, arcade: 0, sh: {}, shr: {}, mis: [] });

function parse(raw: string | null): Player | null {
  if (!raw) return null;
  try {
    const p = JSON.parse(raw) as Partial<Player>;
    if (!p || p.v !== 1 || typeof p.xp !== "number" || !Array.isArray(p.days)) return null;
    const base = fresh(Date.now());
    const obj = <T,>(v: unknown, d: T): T => (v && typeof v === "object" && !Array.isArray(v) ? (v as T) : d);
    return {
      ...base, ...p,
      xp: Math.max(0, Math.floor(p.xp)),
      days: p.days.filter((d) => Number.isInteger(d)).slice(-120),
      read: obj(p.read, {}), cats: obj(p.cats, {}), quiz: obj(p.quiz, {}), sh: obj(p.sh, {}), shr: obj(p.shr, {}),
      saved: Array.isArray(p.saved) ? p.saved.filter((s) => typeof s === "string").slice(0, 200) : [],
      mis: Array.isArray(p.mis) ? p.mis.filter((d) => Number.isInteger(d)).slice(-60) : [],
    };
  } catch {
    return null;
  }
}

let cache: Player | null = null;
let cacheRaw: string | null | undefined;

function load(): Player {
  let raw: string | null = null;
  try { raw = window.localStorage.getItem(KEY); } catch { /* private mode: progress lasts for this page only */ }
  if (cache && raw === cacheRaw) return cache;
  cacheRaw = raw;
  cache = parse(raw) ?? cache ?? fresh(Date.now());
  return cache;
}

function prune(p: Player): Player {
  const readEntries = Object.entries(p.read);
  if (readEntries.length > 500) p.read = Object.fromEntries(readEntries.sort((a, b) => b[1] - a[1]).slice(0, 400));
  const today = dayNumber();
  const recent = (o: Record<string, number>, keep: number) => Object.fromEntries(Object.entries(o).filter(([d]) => Number(d) > today - keep));
  p.quiz = recent(p.quiz, 90); p.sh = recent(p.sh, 14); p.shr = recent(p.shr, 14);
  p.days = [...new Set(p.days)].sort((a, b) => a - b).slice(-120);
  return p;
}

function commit(next: Player, gained = 0, label = "") {
  const before = cache ? levelOf(cache.xp).stars : 0;
  cache = prune(next);
  try { cacheRaw = JSON.stringify(cache); window.localStorage.setItem(KEY, cacheRaw); } catch { cacheRaw = undefined; }
  window.dispatchEvent(new Event(EVENT));
  if (gained > 0) {
    const after = levelOf(cache.xp);
    window.dispatchEvent(new CustomEvent(XP_EVENT, { detail: { amount: gained, label, levelUp: after.stars > before ? after.stars : 0 } }));
  }
}

const today = () => String(dayNumber());

/** Daily missions, derived from what the visitor did today. */
export function missionsOf(p: Player, day = dayNumber()) {
  const start = day * 864e5 - 3 * 3600e3;
  const readToday = Object.values(p.read).filter((t) => t >= start).length;
  const list = [
    { id: "read", done: Math.min(readToday, 2), goal: 2, ar: "اقرأ موضوعين اليوم", en: "Read two articles today", href: "/c/news" },
    { id: "quiz", done: p.quiz[String(day)] === undefined ? 0 : 1, goal: 1, ar: "العب تحدي اليوم", en: "Play today's challenge", href: "/play" },
    { id: "shorts", done: Math.min(p.sh[String(day)] ?? 0, 3), goal: 3, ar: "شوف 3 شورتس", en: "Watch three Shorts", href: "/shorts" },
  ];
  return { list, complete: list.every((m) => m.done >= m.goal), paid: p.mis.includes(day) };
}

function settleMissions(p: Player): number {
  const day = dayNumber();
  const m = missionsOf(p, day);
  if (!m.complete || m.paid) return 0;
  p.mis = [...p.mis, day];
  p.xp += XP.missions;
  return XP.missions;
}

/** Called once per page load: counts the day, keeps the streak and remembers when the last visit ended. */
export function touchVisit() {
  const p = structuredClone(load());
  const now = Date.now();
  const day = dayNumber(now);
  let gained = 0; let label = "";
  if (!p.last || now - p.last > VISIT_GAP) p.prev = p.last;
  p.last = now;
  if (!p.days.includes(day)) {
    p.days.push(day);
    const streak = streakOf(p.days, day);
    p.best = Math.max(p.best, streak);
    gained = XP.visit + Math.min(streak - 1, 7) * XP.streakStep;
    p.xp += gained;
    label = streak > 1 ? `streak:${streak}` : "visit";
  }
  commit(p, gained, label);
}

export function markRead(slug: string, category: string) {
  const p = structuredClone(load());
  if (p.read[slug]) return;
  p.read[slug] = Date.now();
  p.cats[category] = (p.cats[category] ?? 0) + 1;
  p.xp += XP.read;
  const bonus = settleMissions(p);
  commit(p, XP.read + bonus, bonus ? "missions" : "read");
}

export function toggleSaved(slug: string): boolean {
  const p = structuredClone(load());
  const has = p.saved.includes(slug);
  p.saved = has ? p.saved.filter((s) => s !== slug) : [slug, ...p.saved].slice(0, 200);
  commit(p);
  return !has;
}

/** Daily quiz result. Only the first play of the day counts. */
export function recordQuiz(score: number, total: number): number {
  const p = structuredClone(load());
  const key = today();
  if (p.quiz[key] !== undefined) return 0;
  p.quiz[key] = score;
  let gained = score * XP.quizCorrect + (score === total ? XP.quizPerfect : 0);
  p.xp += gained;
  gained += settleMissions(p);
  commit(p, gained, "quiz");
  return gained;
}

export function recordArcade(run: number) {
  const p = structuredClone(load());
  const gained = Math.min(run, 30) * XP.arcadeStep;
  p.arcade = Math.max(p.arcade, run);
  p.xp += gained;
  commit(p, gained, "arcade");
}

export function recordShort() {
  const p = structuredClone(load());
  const key = today();
  const n = (p.sh[key] ?? 0) + 1;
  p.sh[key] = n;
  let gained = 0;
  if (n <= 10) { gained = XP.short; p.xp += gained; }
  gained += settleMissions(p);
  commit(p, gained, "short");
}

export function recordShare() {
  const p = structuredClone(load());
  const key = today();
  const n = (p.shr[key] ?? 0) + 1;
  p.shr[key] = n;
  if (n > 3) { commit(p); return; }
  p.xp += XP.share;
  commit(p, XP.share, "share");
}

export type Badge = { id: string; icon: string; ar: string; en: string; hintAr: string; hintEn: string; done: boolean; progress: number; goal: number };

export function badgesOf(p: Player): Badge[] {
  const readCount = Object.keys(p.read).length;
  const cats = Object.keys(p.cats).length;
  const quizDays = Object.keys(p.quiz).length;
  const perfect = Object.values(p.quiz).some((s) => s >= 5) ? 1 : 0;
  const b = (id: string, icon: string, ar: string, en: string, hintAr: string, hintEn: string, progress: number, goal: number): Badge => ({ id, icon, ar, en, hintAr, hintEn, progress: Math.min(progress, goal), goal, done: progress >= goal });
  return [
    b("first", "👋", "أول خطوة", "First step", "اقرأ أول موضوع", "Read your first article", readCount, 1),
    b("reader10", "📖", "قارئ نهم", "Keen reader", "اقرأ 10 مواضيع", "Read 10 articles", readCount, 10),
    b("reader50", "📚", "موسوعة تمشي", "Walking encyclopedia", "اقرأ 50 موضوع", "Read 50 articles", readCount, 50),
    b("streak3", "🔥", "ثلاثة أيام نار", "Three-day fire", "زرنا 3 أيام ورا بعض", "Visit 3 days in a row", p.best, 3),
    b("streak7", "⚡", "أسبوع كامل", "Full week", "زرنا 7 أيام ورا بعض", "Visit 7 days in a row", p.best, 7),
    b("streak30", "👑", "مدمن Leonida", "Leonida regular", "زرنا 30 يوم ورا بعض", "Visit 30 days in a row", p.best, 30),
    b("explorer", "🧭", "مستكشف", "Explorer", "اقرأ من 6 أقسام مختلفة", "Read from 6 different sections", cats, 6),
    b("secrets", "🗝️", "صياد الأسرار", "Secret hunter", "اقرأ 5 أسرار", "Read 5 secrets", p.cats.secrets ?? 0, 5),
    b("money", "💰", "تاجر شاطر", "Money maker", "اقرأ 3 طرق فلوس", "Read 3 money methods", p.cats.money ?? 0, 3),
    b("quizace", "🎯", "العلامة الكاملة", "Perfect score", "جب 5 من 5 في تحدي اليوم", "Score 5 out of 5 in the daily challenge", perfect, 1),
    b("quiz5", "🕹️", "لاعب يومي", "Daily player", "العب تحدي اليوم 5 أيام", "Play the daily challenge on 5 days", quizDays, 5),
    b("arcade10", "🚀", "سلسلة 10", "Run of 10", "جاوب 10 صح ورا بعض في الماراثون", "Answer 10 in a row in the marathon", p.arcade, 10),
    b("saver", "🔖", "جامع", "Collector", "احفظ 5 مواضيع", "Save 5 articles", p.saved.length, 5),
  ];
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVENT, cb); window.removeEventListener("storage", cb); };
}

/** Current progress, or null on the server and during hydration (so server and client markup match). */
export function usePlayer(): Player | null {
  return useSyncExternalStore(subscribe, load, () => null);
}
