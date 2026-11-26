"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Flame, Share2, X, Zap } from "lucide-react";
import type { Question } from "@/lib/quiz";
import type { Locale } from "@/lib/types";
import { recordArcade, recordQuiz, recordShare, usePlayer, XP } from "@/lib/player";

type Mode = "daily" | "arcade";
const LIVES = 3;

function untilMidnight(now: number) {
  const ms = 864e5 - ((now + 3 * 3600e3) % 864e5);
  const h = Math.floor(ms / 3600e3), m = Math.floor((ms % 3600e3) / 60e3), s = Math.floor((ms % 60e3) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

export function Quiz({ daily, arcade, day, locale }: { daily: Question[]; arcade: Question[]; day: number; locale: Locale }) {
  const ar = locale === "ar";
  const player = usePlayer();
  const played = player?.quiz[String(day)];
  const [mode, setMode] = useState<Mode>("daily");
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [marks, setMarks] = useState<boolean[]>([]);
  const [finished, setFinished] = useState(false);
  const [lives, setLives] = useState(LIVES);
  const [gained, setGained] = useState(0);
  const [copied, setCopied] = useState(false);
  const [clock, setClock] = useState("");
  const questions = mode === "daily" ? daily : arcade;
  const q = questions[index];
  const score = marks.filter(Boolean).length;
  const alreadyPlayed = mode === "daily" && played !== undefined && marks.length === 0 && !finished;

  useEffect(() => {
    const tick = () => setClock(untilMidnight(Date.now()));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  function start(next: Mode) {
    setMode(next); setIndex(0); setPicked(null); setMarks([]); setFinished(false); setLives(LIVES); setGained(0); setCopied(false);
  }

  function choose(option: number) {
    if (picked !== null || finished) return;
    setPicked(option);
    const right = option === q.answer;
    const nextMarks = [...marks, right];
    setMarks(nextMarks);
    const nextLives = mode === "arcade" && !right ? lives - 1 : lives;
    setLives(nextLives);
    const last = index === questions.length - 1 || (mode === "arcade" && nextLives === 0);
    window.setTimeout(() => {
      if (last) {
        const total = nextMarks.filter(Boolean).length;
        if (mode === "daily") setGained(recordQuiz(total, questions.length));
        else recordArcade(total);
        setFinished(true);
      } else { setIndex(index + 1); setPicked(null); }
    }, right ? 1100 : 2100);
  }

  const squares = useMemo(() => marks.map((m) => (m ? "🟩" : "🟥")).join(""), [marks]);
  const shareText = mode === "daily"
    ? (ar ? `تحدي GTA 6 اليوم: ${score}/${questions.length}\n${squares}\nتقدر تغلبني؟` : `Today's GTA 6 challenge: ${score}/${questions.length}\n${squares}\nCan you beat me?`)
    : (ar ? `ماراثون GTA 6: جاوبت ${score} صح 🔥\nتقدر تكسر رقمي؟` : `GTA 6 marathon: ${score} correct 🔥\nCan you beat it?`);
  async function share() {
    const url = `${window.location.origin}/play`;
    try {
      if (navigator.share) { await navigator.share({ text: shareText, url }); recordShare(); return; }
      await navigator.clipboard.writeText(`${shareText}\n${url}`); setCopied(true); recordShare();
    } catch { /* cancelled */ }
  }

  const tabs = (
    <div className="mb-3 grid grid-cols-2 gap-2 rounded-2xl bg-chip p-1">
      {([["daily", ar ? "تحدي اليوم" : "Daily challenge", Zap], ["arcade", ar ? "الماراثون" : "Marathon", Flame]] as const).map(([id, label, Icon]) => (
        <button key={id} type="button" onClick={() => start(id)} aria-pressed={mode === id}
          className={`flex h-11 items-center justify-center gap-2 rounded-xl text-[14px] font-extrabold transition ${mode === id ? "bg-sunset text-[#241338] shadow" : "text-muted"}`}>
          <Icon className="size-4" /> {label}
        </button>
      ))}
    </div>
  );

  const header = (
    <header className="mb-3 text-center">
      <h1 className="text-[26px] leading-tight md:text-4xl">{ar ? "كم تعرف عن GTA 6؟ 🎮" : "How well do you know GTA 6? 🎮"}</h1>
      <p className="mt-1 text-[13.5px] text-muted">
        {mode === "daily"
          ? (ar ? "5 أسئلة جديدة كل يوم، نفسها لكل اللاعبين." : "5 new questions every day, the same for every player.")
          : (ar ? `أسئلة بلا توقف. عندك ${LIVES} محاولات غلط، كم توصل؟` : `Non-stop questions. You get ${LIVES} mistakes. How far can you go?`)}
      </p>
    </header>
  );

  if (alreadyPlayed || finished) {
    const total = mode === "daily" ? questions.length : undefined;
    const shown = alreadyPlayed ? played! : score;
    const best = player?.arcade ?? 0;
    return (
      <div>
        {header}{tabs}
        <div className="card overflow-hidden text-center">
          <div className="bg-gradient-to-br from-[#2a1240] to-[#7c3aed] px-5 py-7 text-white">
            <p className="text-[13px] font-bold text-white/80">{mode === "daily" ? (alreadyPlayed ? (ar ? "لعبت تحدي اليوم ✓" : "You played today ✓") : (ar ? "نتيجتك اليوم" : "Your score today")) : (ar ? "نتيجة الماراثون" : "Marathon result")}</p>
            <p className="font-display mt-1 text-[64px] leading-none tracking-wide" dir="ltr">{shown}{total ? <span className="text-[30px] text-white/60">/{total}</span> : null}</p>
            {squares && <p className="mt-2 text-[22px] tracking-widest" dir="ltr" aria-hidden>{squares}</p>}
            <p className="mt-2 text-[14px] font-bold">
              {mode === "daily"
                ? (shown === 5 ? (ar ? "علامة كاملة! أسطورة 👑" : "Perfect! Legend 👑") : shown >= 3 ? (ar ? "كفو، قريب من العلامة الكاملة 🔥" : "Nice, close to perfect 🔥") : (ar ? "بكرة تعوّضها 💪" : "You'll get it tomorrow 💪"))
                : (score >= best && score > 0 ? (ar ? "رقم قياسي جديد لك! 🏆" : "New personal best! 🏆") : (ar ? `أفضل رقم لك: ${best}` : `Your best: ${best}`))}
            </p>
            {gained > 0 && <p className="mt-2 inline-block rounded-full bg-[#ffd166] px-3 py-1 text-[13px] font-extrabold text-[#241338]" dir="ltr">+{gained} XP</p>}
          </div>
          <div className="space-y-3 p-5">
            {mode === "daily" && (
              <p className="text-[13px] text-muted">{ar ? "التحدي الجاي بعد" : "Next challenge in"} <b className="font-display text-[17px] tracking-wider text-fg tabular-nums" dir="ltr">{clock}</b></p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              {(finished || mode === "arcade") && (
                <button type="button" onClick={share} className="bg-sunset inline-flex h-12 items-center gap-2 rounded-2xl px-5 font-extrabold text-[#241338] shadow-md">
                  <Share2 className="size-5" /> {copied ? (ar ? "انسخت ✓" : "Copied ✓") : (ar ? "تحدّى ربعك" : "Challenge friends")}
                </button>
              )}
              <button type="button" onClick={() => start("arcade")} className="inline-flex h-12 items-center gap-2 rounded-2xl border border-line bg-card px-5 font-extrabold">
                <Flame className="size-5 text-[#f0287a]" /> {mode === "arcade" ? (ar ? "جولة ثانية" : "Play again") : (ar ? "كمّل بالماراثون" : "Keep going: marathon")}
              </button>
            </div>
            <p className="pt-1 text-[12.5px] text-muted">
              {ar ? "تبي تقوّي معلوماتك؟ " : "Want to study? "}
              <Link href="/catalog/vehicles" className="font-bold text-accent">{ar ? "المركبات" : "Vehicles"}</Link> · <Link href="/catalog/weapons" className="font-bold text-accent">{ar ? "الأسلحة" : "Weapons"}</Link> · <Link href="/catalog/animals" className="font-bold text-accent">{ar ? "الحيوانات" : "Animals"}</Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!q) return <div>{header}{tabs}<p className="card p-6 text-center text-muted">{ar ? "الأسئلة مو جاهزة الحين، جرّب بعد شوي." : "Questions are not ready right now, try again shortly."}</p></div>;

  return (
    <div>
      {header}{tabs}
      <div className="mb-3 flex items-center justify-between text-[13px] font-extrabold">
        {mode === "daily" ? (
          <span className="flex gap-1.5" aria-label={`${index + 1}/${questions.length}`}>
            {questions.map((_, i) => <span key={i} className={`h-2 w-8 rounded-full ${i < marks.length ? (marks[i] ? "bg-[#16a34a]" : "bg-[#ef4444]") : i === index ? "bg-sunset" : "bg-chip2"}`} />)}
          </span>
        ) : (
          <span className="flex items-center gap-1.5"><Flame className="size-4 text-[#f0287a]" /><span className="tabular-nums">{score}</span></span>
        )}
        {mode === "daily"
          ? <span className="text-muted">{ar ? `سؤال ${index + 1} من ${questions.length}` : `Question ${index + 1} of ${questions.length}`}</span>
          : <span aria-label={ar ? `${lives} محاولات باقية` : `${lives} lives left`} dir="ltr">{"❤️".repeat(lives)}<span className="opacity-25">{"❤️".repeat(LIVES - lives)}</span></span>}
      </div>
      <div className="card overflow-hidden" key={`${mode}-${index}`}>
        {q.image && <Picture url={q.image.url} credit={q.image.credit} ar={ar} />}
        <div className="p-4 md:p-5">
          <h2 className="text-[19px] leading-snug sm:text-[21px]">{ar ? q.ar : q.en}</h2>
          {q.subject && <p className="font-display mt-1 text-[22px] tracking-wide text-accent" dir="ltr">{q.subject}</p>}
          <div className="mt-3 grid grid-cols-2 gap-2 sm:gap-2.5">
            {q.options.map((o, i) => {
              const state = picked === null ? "idle" : i === q.answer ? "right" : i === picked ? "wrong" : "dim";
              return (
                <button key={i} type="button" onClick={() => choose(i)} disabled={picked !== null}
                  className={`flex min-h-[56px] items-center justify-between gap-1.5 rounded-2xl border-2 px-3 py-2 text-start text-[14px] font-bold leading-snug transition active:scale-[.98] sm:px-4 sm:text-[15px] ${
                    state === "right" ? "border-[#16a34a] bg-[#16a34a]/15" : state === "wrong" ? "border-[#ef4444] bg-[#ef4444]/15" : state === "dim" ? "border-line opacity-50" : "border-line bg-chip hover:border-[var(--pink)] hover:bg-chip2"}`}>
                  <span dir="auto">{ar ? o.ar : o.en}</span>
                  {state === "right" && <Check className="size-5 shrink-0 text-[#16a34a]" strokeWidth={3} />}
                  {state === "wrong" && <X className="size-5 shrink-0 text-[#ef4444]" strokeWidth={3} />}
                </button>
              );
            })}
          </div>
          <p className="mt-3 min-h-[22px] text-[13px] text-muted" role="status" dir="auto">
            {picked !== null && (picked === q.answer ? (ar ? "صح عليك! ✅ " : "Correct! ✅ ") : (ar ? "غلط 😬 " : "Wrong 😬 "))}
            {picked !== null && (ar ? q.factAr : q.factEn)}
          </p>
        </div>
      </div>
      {mode === "daily" && <p className="mt-3 text-center text-[12px] text-muted">{ar ? `كل إجابة صح = ‎+${XP.quizCorrect} XP · العلامة الكاملة = ‎+${XP.quizPerfect} زيادة` : `Each correct answer = +${XP.quizCorrect} XP · a perfect score = +${XP.quizPerfect} more`}</p>}
    </div>
  );
}

/** The question picture. Catalog pictures live on other sites, so a failed load says so instead of leaving a broken frame. */
function Picture({ url, credit, ar }: { url: string; credit: string; ar: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative bg-[#111]">
      {failed ? (
        <p className="grid aspect-[16/9] w-full place-items-center px-6 text-center text-[13px] font-bold text-white/75">
          {ar ? "الصورة ما حمّلت 📷 جرّب تخمّن، أو حدّث الصفحة" : "The picture did not load 📷 take a guess, or refresh the page"}
        </p>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" referrerPolicy="no-referrer" onError={() => setFailed(true)} className="mx-auto aspect-[16/9] w-full object-contain" />
      )}
      <span className="absolute bottom-1.5 end-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-white/80" dir="ltr">📷 {credit}</span>
    </div>
  );
}
