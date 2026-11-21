import { notFound } from "next/navigation";
import Link from "next/link";
import { getLocale, getViewer } from "@/lib/session";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { getVotes, type Submission } from "@/lib/community/data";
import { formatDate } from "@/lib/i18n";
import { VoteBar } from "@/components/community/VoteBar";
import { Comments } from "@/components/community/Comments";
import { Bidi } from "@/components/Bidi";

export default async function SubmissionPage({ params }: PageProps<"/community/[id]">) {
  const { id } = await params;
  if (!supabaseConfigured() || !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  const ar = locale === "ar";
  const supabase = await createClient();
  const { data } = await supabase.from("submissions").select("*").eq("id", id).maybeSingle();
  const s = data as Submission | null;
  if (!s) notFound();
  const votes = (await getVotes([`sub:${s.id}`], viewer.id))[`sub:${s.id}`];
  return (
    <main className="mx-auto max-w-3xl px-4 pt-5">
      <Link href="/community" className="text-[13px] text-dim">← {ar ? "اكتشافات اللاعبين" : "Player discoveries"}</Link>
      <article className="card mt-3 p-5">
        <p className="mb-2 text-[12px] text-dim">
          <span className="rounded-full bg-chip2 px-2 py-0.5 font-bold">{ar ? "من اللاعبين — غير متحقق" : "From players — unverified"}</span> ·{" "}
          {ar ? "بواسطة" : "by"} <b className="text-fg">{s.author_name}</b> · {formatDate(s.created_at, locale)}
        </p>
        <h1 className="text-[26px] leading-snug"><Bidi text={s.title} /></h1>
        {s.place && <p className="mt-1 text-[13px] font-bold text-accent">📍 <Bidi text={s.place} /></p>}
        <p className="mt-3 text-[15.5px] leading-loose whitespace-pre-line"><Bidi text={s.body} /></p>
        {s.video_url && (
          <a href={s.video_url} target="_blank" rel="noopener noreferrer nofollow" className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#ff0033] px-4 py-2 text-sm font-extrabold text-black">
            ▶ {ar ? "شوف الفيديو" : "Watch the video"}
          </a>
        )}
        <div className="mt-5 border-t border-line pt-4">
          <VoteBar target={`sub:${s.id}`} votes={votes} path={`/community/${s.id}`} ar={ar} />
        </div>
      </article>
      <Comments target={`sub:${s.id}`} path={`/community/${s.id}`} locale={locale} signedIn={viewer.signedIn} />
    </main>
  );
}
