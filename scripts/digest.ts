/**
 * Weekly digest email via Resend. Run by GitHub Actions every Friday, or:
 *   npm run digest -- --dry        (renders and prints, sends nothing)
 *   npm run digest -- --to=a@b.c   (sends only to one address, for testing)
 */
import "./lib/env";
import { Resend } from "resend";
import { need } from "./lib/env";
import { db } from "./lib/db";
import { CATEGORY_MAP } from "../src/lib/categories";
import type { CategorySlug } from "../src/lib/types";

const DRY = process.argv.includes("--dry");
const ONLY = process.argv.find((a) => a.startsWith("--to="))?.slice(5);
const SITE = (process.env.SITE_URL || "https://arabicgta6.com").replace(/\/$/, "");

type Row = { slug: string; category: CategorySlug; title_ar: string; title_en: string; summary_ar: string; status: string; published_at: string };

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function render(items: Row[], unsubscribeUrl: string) {
  const groups = new Map<CategorySlug, Row[]>();
  for (const i of items) groups.set(i.category, [...(groups.get(i.category) ?? []), i]);
  const sections = [...groups.entries()]
    .map(([cat, rows]) => {
      const c = CATEGORY_MAP[cat];
      return `<tr><td style="padding:18px 0 6px;font-size:16px;font-weight:800;color:${c.color}">${esc(c.ar)}</td></tr>
${rows
  .slice(0, 6)
  .map(
    (r) => `<tr><td style="padding:10px 14px;background:#1a0f2e;border-radius:14px;border:1px solid #2d2045">
<a href="${SITE}/item/${r.slug}" style="color:#fbf6ff;text-decoration:none;font-size:15px;font-weight:800;line-height:1.5">${esc(r.title_ar)}</a>
<div style="color:#b9a9cf;font-size:13px;line-height:1.7;margin-top:4px">${esc(r.summary_ar)}</div></td></tr><tr><td style="height:8px"></td></tr>`,
  )
  .join("")}`;
    })
    .join("");
  return `<!doctype html><html lang="ar" dir="rtl"><body style="margin:0;background:#0b0613;font-family:Tahoma,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0b0613"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px" dir="rtl">
<tr><td style="padding:22px;border-radius:20px;background:linear-gradient(120deg,#ff3d8b,#ff6a5b,#ffb13d);color:#fff">
<div style="font-size:13px;font-weight:700;opacity:.9">ARABIC GTA6 · النشرة الأسبوعية</div>
<div style="font-size:24px;font-weight:900;margin-top:6px">أهم أسرار وأخبار GTA 6 هذا الأسبوع</div>
<div style="font-size:13px;margin-top:6px">${items.length} موضوع جديد في الموسوعة</div></td></tr>
${sections}
<tr><td align="center" style="padding:22px 0"><a href="${SITE}" style="display:inline-block;background:#ff3d8b;color:#fff;text-decoration:none;font-weight:800;padding:12px 26px;border-radius:14px">افتح الموقع</a></td></tr>
<tr><td align="center" style="color:#8a7aa3;font-size:11px;line-height:1.8">موقع معجبين غير رسمي · Unofficial fan site<br><a href="${unsubscribeUrl}" style="color:#8a7aa3">إلغاء الاشتراك · Unsubscribe</a></td></tr>
</table></td></tr></table></body></html>`;
}

async function main() {
  const supabase = db();
  const since = new Date(Date.now() - 7 * 864e5).toISOString();
  const { data: items, error } = await supabase
    .from("items")
    .select("slug,category,title_ar,title_en,summary_ar,status,published_at")
    .gte("created_at", since)
    .order("published_at", { ascending: false })
    .limit(60);
  if (error) throw error;
  if (!items?.length) {
    console.log("Nothing new this week; no digest sent.");
    return;
  }

  let q = supabase.from("profiles").select("email,unsubscribe_token").eq("digest_opt_in", true).not("email", "is", null);
  if (ONLY) q = q.eq("email", ONLY);
  const { data: subs, error: subErr } = await q;
  if (subErr) throw subErr;
  console.log(`${items.length} items, ${subs?.length ?? 0} subscribers`);
  if (DRY) {
    console.log(render(items as Row[], `${SITE}/unsubscribe?token=TEST`).slice(0, 1500));
    return;
  }

  const resend = new Resend(need("RESEND_API_KEY"));
  const from = need("DIGEST_FROM"); // e.g. "Arabic GTA 6 <digest@arabicgta6.com>"
  const subject = `🌴 أسرار GTA 6 هذا الأسبوع — ${items.length} جديد`;
  const list = subs ?? [];
  let sent = 0;
  for (let k = 0; k < list.length; k += 100) {
    const batch = list.slice(k, k + 100).map((s) => {
      const unsub = `${SITE}/unsubscribe?token=${s.unsubscribe_token}`;
      return {
        from,
        to: [s.email as string],
        subject,
        html: render(items as Row[], unsub),
        headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      };
    });
    const { error: sendErr } = await resend.batch.send(batch);
    if (sendErr) throw new Error(JSON.stringify(sendErr));
    sent += batch.length;
  }
  await supabase.from("update_runs").insert({ kind: "digest", added: sent, note: `${items.length} items` });
  console.log(`Sent ${sent} emails.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
