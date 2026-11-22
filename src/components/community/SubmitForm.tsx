"use client";
import { useRef, useState, useTransition } from "react";
import { submitDiscovery } from "@/lib/community/actions";
import { communityFeedback } from "@/lib/community/feedback";

const CATS = [
  ["secrets", "سر / ايستر إيج", "Secret / easter egg"],
  ["glitches", "قلتش", "Glitch"],
  ["money", "طريقة فلوس", "Money method"],
  ["funny", "موقف طريف", "Funny moment"],
  ["strange", "شي غريب", "Something weird"],
  ["weapons", "سلاح نادر", "Rare weapon"],
  ["vehicles", "سيارة نادرة", "Rare vehicle"],
  ["tips", "نصيحة", "Tip"],
] as const;

export function SubmitForm({ ar }: { ar: boolean }) {
  const ref = useRef<HTMLFormElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const input = "w-full rounded-xl border border-control bg-card px-3 py-2.5 text-[16px] outline-none focus:border-pink";
  return (
    <form
      ref={ref}
      onSubmit={(event) => {
        event.preventDefault();
        if (pending) return;
        const fd = new FormData(event.currentTarget);
        start(async () => {
          setMsg(null);
          try {
            const r = await submitDiscovery(fd);
            if (r.ok) {
              ref.current?.reset();
              setMsg({ ok: true, text: ar ? "تم النشر! شكراً لك 🙌" : "Published! Thanks 🙌" });
            } else setMsg({ ok: false, text: communityFeedback(r.error, ar, "submission") });
          } catch {
            setMsg({ ok: false, text: communityFeedback("unavailable", ar, "submission") });
          }
        });
      }}
      className="card space-y-3 p-4"
      aria-busy={pending}
    >
      <p className="font-head text-[19px]">{ar ? "🕵️ لقيت شي؟ شاركه باسمك" : "🕵️ Found something? Share it"}</p>
      <label className="block space-y-1.5">
        <span className="block text-[13px] font-bold">{ar ? "التصنيف" : "Category"}</span>
        <select disabled={pending} name="category" className={input} defaultValue="secrets">
          {CATS.map(([v, a, e]) => (
            <option key={v} value={v}>
              {ar ? a : e}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1.5">
        <span className="block text-[13px] font-bold">{ar ? "العنوان" : "Title"}</span>
        <input disabled={pending} name="title" required minLength={5} maxLength={140} placeholder={ar ? "العنوان — مثلاً: لقيت سيارة نادرة في Ocean Beach" : "Title — e.g. Found a rare car in Ocean Beach"} className={input} />
      </label>
      <label className="block space-y-1.5">
        <span className="block text-[13px] font-bold">{ar ? "وصف الاكتشاف" : "Discovery details"}</span>
        <textarea disabled={pending} name="body" required minLength={20} maxLength={4000} rows={5} placeholder={ar ? "اشرح بالتفصيل: وش لقيت؟ كيف؟ وش الخطوات؟" : "Explain in detail: what, how, which steps?"} className={input} />
      </label>
      <label className="block space-y-1.5">
        <span className="block text-[13px] font-bold">{ar ? "المكان (اختياري)" : "Place (optional)"}</span>
        <input disabled={pending} name="place" maxLength={120} placeholder={ar ? "المكان في اللعبة (اختياري) — مثلاً: Key Lento" : "Place in the game (optional)"} className={input} />
      </label>
      <label className="block space-y-1.5">
        <span className="block text-[13px] font-bold">{ar ? "رابط الفيديو (اختياري)" : "Video URL (optional)"}</span>
        <input disabled={pending} name="video" type="url" maxLength={300} placeholder={ar ? "رابط فيديو يوتيوب/تيك توك/إنستغرام (اختياري)" : "YouTube/TikTok/Instagram link (optional)"} className={input} dir="ltr" />
      </label>
      <div className="flex items-center justify-between gap-2">
        <span role="status" aria-live="polite" aria-atomic="true" className={`text-[12.5px] ${msg?.ok ? "text-success" : "text-error"}`}>{msg?.text}</span>
        <button disabled={pending} className="h-11 rounded-xl bg-pink px-6 font-extrabold text-black disabled:opacity-50">
          {pending ? (ar ? "جاري النشر…" : "Publishing…") : ar ? "انشر" : "Publish"}
        </button>
      </div>
      <p className="text-[11.5px] text-dim">{ar ? "يظهر اسمك الأول من حساب Google. ممنوع الإساءة والسبام." : "Your Google first name is shown. No abuse or spam."}</p>
    </form>
  );
}
