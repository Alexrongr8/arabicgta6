import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { adminClient, adminConfigured, isOwner } from "@/lib/admin";
import { formatDate } from "@/lib/i18n";
import { getLocale, getViewer } from "@/lib/session";

export const metadata: Metadata = { title: "Owner dashboard", robots: { index: false } };

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  device: string | null;
  sign_in_count: number;
  last_sign_in_at: string | null;
  created_at: string;
  digest_opt_in: boolean;
};

const flag = (cc?: string | null) =>
  cc && cc.length === 2 ? String.fromCodePoint(...[...cc.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0))) : "🌐";

function daysAgo(n: number) {
  return new Date(Date.now() - n * 864e5).toISOString();
}

function countBy<T>(rows: T[], key: (r: T) => string | null | undefined) {
  const m = new Map<string, number>();
  for (const r of rows) {
    const k = key(r) || "—";
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export default async function Admin() {
  const [locale, viewer] = await Promise.all([getLocale(), getViewer()]);
  if (!isOwner(viewer.email) || !adminConfigured()) notFound();
  const ar = locale === "ar";
  const db = adminClient();
  const since7 = daysAgo(7);
  const since1 = daysAgo(1);

  const [{ data: profiles }, { data: views }, { count: views24 }, { data: runs }] = await Promise.all([
    db.from("profiles").select("*").order("last_sign_in_at", { ascending: false, nullsFirst: false }).limit(500),
    db.from("page_views").select("path,country,city,device,referrer,user_id,created_at").gte("created_at", since7).order("created_at", { ascending: false }).limit(5000),
    db.from("page_views").select("id", { count: "exact", head: true }).gte("created_at", since1),
    db.from("update_runs").select("*").order("ran_at", { ascending: false }).limit(8),
  ]);
  const users = (profiles ?? []) as Profile[];
  const pv = views ?? [];
  const newUsers7 = users.filter((u) => u.created_at >= since7).length;

  const stats = [
    { k: ar ? "الأعضاء" : "Members", v: users.length },
    { k: ar ? "أعضاء جدد (7 أيام)" : "New members (7d)", v: newUsers7 },
    { k: ar ? "مشاهدات (24 ساعة)" : "Views (24h)", v: views24 ?? 0 },
    { k: ar ? "مشاهدات (7 أيام)" : "Views (7d)", v: pv.length },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pt-6">
      <h1 className="mb-1 text-2xl font-extrabold">{ar ? "لوحة المالك" : "Owner dashboard"}</h1>
      <p className="mb-5 text-xs text-dim">{ar ? "مرئية لك فقط. الموقع الجغرافي تقريبي من عنوان IP." : "Visible only to you. Location is approximate (from IP)."}</p>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="card p-4">
            <p className="text-xs text-dim">{s.k}</p>
            <p className="font-display text-3xl text-sunset">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <TopList title={ar ? "أكثر الدول (7 أيام)" : "Top countries (7d)"} rows={countBy(pv, (r) => r.country).slice(0, 8).map(([k, n]) => [`${flag(k)} ${k}`, n])} />
        <TopList title={ar ? "أكثر الصفحات" : "Top pages"} rows={countBy(pv, (r) => r.path).slice(0, 8)} />
        <TopList title={ar ? "مصادر الزيارات" : "Referrers"} rows={countBy(pv.filter((r) => r.referrer), (r) => r.referrer).slice(0, 8)} />
      </div>

      <h2 className="mb-3 text-lg font-extrabold">{ar ? "الأعضاء المسجلين" : "Signed-in members"}</h2>
      <div className="space-y-2 md:hidden">
        {users.map((u) => (
          <div key={u.id} className="card flex items-center gap-3 p-3">
            {u.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={u.avatar_url} alt="" referrerPolicy="no-referrer" className="size-10 rounded-xl" />
            ) : (
              <span className="grid size-10 place-items-center rounded-xl bg-chip2">{(u.full_name ?? u.email ?? "?")[0]}</span>
            )}
            <div className="min-w-0 flex-1 text-[13px]">
              <p className="truncate font-bold">{u.full_name ?? "—"}</p>
              <p className="truncate text-muted" dir="ltr">{u.email}</p>
              <p className="text-dim">
                {flag(u.country)} {[u.city, u.region, u.country].filter(Boolean).join("، ") || "—"} · {u.sign_in_count}× · {u.last_sign_in_at ? formatDate(u.last_sign_in_at, locale) : "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="card hidden overflow-x-auto md:block">
        <table className="w-full text-[13px]">
          <thead className="text-start text-xs text-dim">
            <tr className="border-b border-line">
              {(ar ? ["الاسم", "الإيميل", "الموقع", "الجهاز", "مرات الدخول", "آخر دخول", "أول دخول", "النشرة"] : ["Name", "Email", "Location", "Device", "Sign-ins", "Last sign-in", "Joined", "Digest"]).map((h) => (
                <th key={h} className="px-3 py-2 text-start font-bold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line/60">
                <td className="px-3 py-2 font-bold">{u.full_name ?? "—"}</td>
                <td className="px-3 py-2" dir="ltr">{u.email}</td>
                <td className="px-3 py-2">{flag(u.country)} {[u.city, u.region, u.country].filter(Boolean).join(", ") || "—"}</td>
                <td className="px-3 py-2 text-muted">{u.device ?? "—"}</td>
                <td className="px-3 py-2">{u.sign_in_count}</td>
                <td className="px-3 py-2">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString(ar ? "ar-SA-u-nu-latn-ca-gregory" : "en-GB") : "—"}</td>
                <td className="px-3 py-2">{formatDate(u.created_at, locale)}</td>
                <td className="px-3 py-2">{u.digest_opt_in ? "✓" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-8 mb-3 text-lg font-extrabold">{ar ? "آخر الزيارات" : "Recent visits"}</h2>
      <div className="card divide-y divide-line">
        {pv.slice(0, 40).map((v, i) => {
          const u = v.user_id ? users.find((x) => x.id === v.user_id) : null;
          return (
            <div key={i} className="flex flex-wrap items-center gap-x-3 gap-y-0.5 px-3 py-2 text-[12.5px]">
              <span>{flag(v.country)} {v.city ?? v.country ?? "—"}</span>
              <span className="font-bold" dir="ltr">{v.path}</span>
              <span className="text-muted">{u ? u.full_name ?? u.email : ar ? "زائر" : "guest"}</span>
              <span className="text-dim">{v.device}</span>
              <span className="ms-auto text-dim">{new Date(v.created_at).toLocaleString(ar ? "ar-SA-u-nu-latn-ca-gregory" : "en-GB")}</span>
            </div>
          );
        })}
      </div>

      <h2 className="mt-8 mb-3 text-lg font-extrabold">{ar ? "التحديثات التلقائية" : "Auto-updates"}</h2>
      <div className="card divide-y divide-line">
        {(runs ?? []).map((r) => (
          <div key={r.id} className="flex gap-3 px-3 py-2 text-[12.5px]">
            <span className="font-bold">{r.kind}</span>
            <span>+{r.added}</span>
            <span className="truncate text-muted">{r.note}</span>
            <span className="ms-auto text-dim">{new Date(r.ran_at).toLocaleString("en-GB")}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

function TopList({ title, rows }: { title: string; rows: [string, number][] }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="card p-4">
      <p className="mb-3 text-sm font-extrabold">{title}</p>
      <ul className="space-y-2">
        {rows.map(([k, n]) => (
          <li key={k} className="text-[12.5px]">
            <div className="mb-1 flex justify-between gap-2">
              <span className="truncate" dir="auto">{k}</span>
              <span className="font-bold">{n}</span>
            </div>
            <div className="h-1.5 rounded-full bg-chip">
              <div className="bg-sunset h-full rounded-full" style={{ width: `${(n / max) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
