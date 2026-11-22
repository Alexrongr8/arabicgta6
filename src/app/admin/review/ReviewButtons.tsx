"use client";
import { useState, useTransition } from "react";
import { dismissReview, publishReview, type ReviewResult } from "./actions";

const MESSAGES: Record<Exclude<ReviewResult, { ok: true }>["error"], { ar: string; en: string }> = {
  auth: { ar: "لازم تكون داخل بحساب المالك.", en: "Owner sign-in required." },
  gone: { ar: "هذي المسودة انحسمت من قبل.", en: "This proposal was already decided." },
  invalid: { ar: "المسودة ناقصة وما تنفع للنشر.", en: "This proposal is incomplete and cannot be published." },
  duplicate: { ar: "فيه مقال بنفس الرابط منشور من قبل.", en: "An article with this slug already exists." },
  unavailable: { ar: "صار خطأ، جرّب مرة ثانية.", en: "Something failed, please try again." },
};

export function ReviewButtons({ id, canPublish, ar }: { id: number; canPublish: boolean; ar: boolean }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ text: string; ok: boolean; href?: string } | null>(null);
  const run = (fn: typeof publishReview, okText: string) => start(async () => {
    setMsg(null);
    const r = await fn(id);
    if (r.ok) setMsg({ text: okText, ok: true, href: r.slug ? `/item/${r.slug}` : undefined });
    else setMsg({ text: MESSAGES[r.error][ar ? "ar" : "en"], ok: false });
  });
  if (msg?.ok) {
    return <p role="status" className="text-[13px] font-bold text-success">{msg.text} {msg.href && <a className="text-pink underline" href={msg.href}>{ar ? "افتح المقال" : "Open"}</a>}</p>;
  }
  return (
    <div className="flex flex-wrap items-center gap-2">
      {canPublish && (
        <button type="button" disabled={pending} onClick={() => {
          if (window.confirm(ar ? "تنشر هذا المقال على الموقع؟ تأكدت من المصادر؟" : "Publish this article on the site? Sources checked?")) run(publishReview, ar ? "انتشر ✅" : "Published ✅");
        }} className="h-11 rounded-xl bg-[#16a34a] px-4 text-[13px] font-extrabold text-white disabled:opacity-50">
          {pending ? "…" : ar ? "انشر" : "Publish"}
        </button>
      )}
      <button type="button" disabled={pending} onClick={() => run(dismissReview, ar ? "انرفضت ولن تظهر هنا." : "Dismissed.")}
        className="h-11 rounded-xl border border-line px-4 text-[13px] font-bold disabled:opacity-50">
        {ar ? "ارفض" : "Dismiss"}
      </button>
      {msg && <p role="alert" className="w-full text-[12px] text-error">{msg.text}</p>}
    </div>
  );
}
