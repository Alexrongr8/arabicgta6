import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminClient, adminConfigured, isOwner } from "@/lib/admin";
import { getLocale, getViewer } from "@/lib/session";
import { CATEGORY_MAP } from "@/lib/categories";
import { StatusBadge } from "@/components/StatusBadge";
import { loadPendingReviews, publishable, type Review } from "@/lib/radar-review";
import type { Status } from "@/lib/types";
import { ReviewButtons } from "./ReviewButtons";

export const metadata: Metadata = { title: "Radar review", robots: { index: false } };

/** Plain-language explanation of why the radar held a draft instead of publishing it. */
function reasonText(code: string, ar: boolean): string {
  const c = code.toLowerCase();
  const pick = (a: string, e: string) => (ar ? a : e);
  if (c.includes("unsupported-number")) return pick("فيه أرقام ما لقينا لها دليل في المصدر", "Numbers without source support");
  if (c.includes("missing-retrieved-support")) return pick("بعض المعلومات ما لها اقتباس من المصدر", "Some claims lack a quoted source");
  if (c.includes("bilingual")) return pick("النص العربي أو الإنجليزي يحتاج مراجعة", "Arabic/English text needs a check");
  if (c.includes("gameplay") || c.includes("creator")) return pick("مصدره فيديو/صانع محتوى — شوف المقطع بنفسك", "Video/creator source — watch it yourself");
  if (c.includes("duplicate")) return pick("ممكن يكون مكرر مع مقال موجود", "May duplicate an existing article");
  if (c.includes("spoiler")) return pick("فيه حرق للقصة", "Contains story spoilers");
  if (c.includes("status")) return pick("حالة الخبر (رسمي/إشاعة) تحتاج تأكيد", "Status label needs checking");
  if (c.includes("editor-attempt-cap") || c.includes("editor-failed")) return pick("ما قدر يكتب مسودة كاملة", "Could not produce a full draft");
  if (c.includes("topic-only")) return pick("اقتراح موضوع فقط (بدون مقال)", "Topic suggestion only");
  if (c.includes("catalog")) return pick("تحديث لعنصر موجود في الكتالوج", "Update to an existing catalog entry");
  if (c.includes("search-incomplete")) return pick("البحث ما اكتمل", "Search incomplete");
  return code;
}

function Card({ r, ar }: { r: Review; ar: boolean }) {
  const i = r.item;
  const cat = i ? CATEGORY_MAP[i.category as keyof typeof CATEGORY_MAP] : undefined;
  const canPublish = publishable(r);
  const title = i ? (ar ? i.title_ar : i.title_en) : r.lead?.headline ?? "—";
  return (
    <article className="card p-4">
      <div className="mb-2 flex flex-wrap items-center gap-2 text-[12px]">
        {cat && <span className="rounded-full bg-chip px-2 py-0.5 font-bold">{ar ? cat.ar : cat.en}</span>}
        {i && ["official", "confirmed", "leak", "rumor"].includes(i.status) && <StatusBadge status={i.status as Status} locale={ar ? "ar" : "en"} />}
        {r.spoilers && <span className="rounded-full bg-[#ef4444]/15 px-2 py-0.5 font-bold text-error">{ar ? "حرق" : "Spoilers"}</span>}
        <span className="ms-auto text-dim">{new Date(r.ranAt).toLocaleString(ar ? "ar-SA-u-nu-latn" : "en-GB", { dateStyle: "medium", timeStyle: "short" })}</span>
      </div>
      <h2 className="text-[18px] leading-snug" dir="auto">{title}</h2>
      {i && <p className="mt-1 text-[14px] text-muted" dir="auto">{ar ? i.summary_ar : i.summary_en}</p>}
      {!i && r.lead && <p className="mt-1 text-[14px] text-muted" dir="auto">{r.lead.gist}</p>}

      {r.reasons.length > 0 && (
        <div className="mt-3 rounded-xl border border-amber-400/40 bg-amber-400/10 p-3 text-[12.5px]">
          <p className="mb-1 font-extrabold">{ar ? "ليش ما انتشر تلقائياً:" : "Why it was held:"}</p>
          <ul className="list-disc ps-5">{[...new Set(r.reasons.map((x) => reasonText(x, ar)))].map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      )}

      {i && (
        <details className="mt-3">
          <summary className="cursor-pointer text-[13px] font-bold text-pink">{ar ? "اقرأ المقال كامل" : "Read the full draft"}</summary>
          <div className="mt-2 whitespace-pre-line text-[14px] leading-7" dir="auto">{ar ? i.body_ar : i.body_en}</div>
        </details>
      )}

      {(i?.sources.length || r.lead) && (
        <div className="mt-3 text-[12.5px]">
          <p className="font-bold">{ar ? "المصادر:" : "Sources:"}</p>
          <ul className="mt-1 space-y-1">
            {(i?.sources.length ? i.sources : r.lead ? [{ title: r.lead.headline, url: r.lead.url }] : []).map((s) => (
              <li key={s.url} className="truncate"><a className="text-pink underline" href={s.url} target="_blank" rel="noopener noreferrer nofollow" dir="ltr">{s.title || s.url}</a></li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 border-t border-line pt-3">
        <ReviewButtons id={r.id} canPublish={canPublish} ar={ar} />
        {!canPublish && <p className="mt-2 text-[12px] text-dim">{ar ? "هذا اقتراح بدون مقال كامل — تقدر ترفضه، أو تاخذ الفكرة وتكتب عنها." : "This is a suggestion without a complete article."}</p>}
      </div>
    </article>
  );
}

export default async function RadarReview() {
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  if (!isOwner(viewer.email) || !adminConfigured()) notFound();
  const ar = locale === "ar";
  let reviews: Review[];
  try {
    reviews = await loadPendingReviews(adminClient());
  } catch {
    return <main className="mx-auto max-w-3xl px-4 pt-6"><div role="alert" className="card p-5">{ar ? "تعذر تحميل المسودات. حدّث الصفحة بعد شوي." : "Could not load proposals. Refresh shortly."}</div></main>;
  }
  return (
    <main className="mx-auto max-w-3xl px-4 pt-6 pb-10">
      <a href="/admin" className="text-[13px] text-pink">{ar ? "← لوحة التحكم" : "← Dashboard"}</a>
      <h1 className="mt-2 text-2xl">{ar ? "مسودات الرادار 📡" : "Radar drafts 📡"}</h1>
      <p className="mb-5 mt-1 text-[13px] text-muted">
        {ar
          ? "الرادار يدور على أخبار GTA 6 كل 3 ساعات. اللي فيه أي شك ما ينشره، يحطه هنا. افتح المصدر، تأكد، وبعدها انشر أو ارفض."
          : "The radar checks for GTA 6 news every 3 hours. Anything uncertain is held here. Check the source, then publish or dismiss."}
      </p>
      {reviews.length === 0
        ? <p className="card p-5 text-center text-muted">{ar ? "ما فيه مسودات تنتظرك 👌" : "Nothing waiting for review 👌"}</p>
        : <div className="grid gap-4">{reviews.map((r) => <Card key={r.id} r={r} ar={ar} />)}</div>}
    </main>
  );
}
