import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { CATEGORY_MAP, STATUS_META } from "../../src/lib/categories";
import type { CategorySlug, Status } from "../../src/lib/types";
import { isSpoiler } from "../../src/lib/spoiler";
import { digestEnabled } from "../../src/lib/digest-config";

export type DigestRow = { slug: string; category: CategorySlug; title_ar: string; summary_ar: string; status: Status; tags?: string[] | null; published_at: string };
type Recipient = { id: string; email: string; unsubscribe_token: string };
type Message = { from: string; to: string[]; subject: string; html: string; text: string; headers: Record<string, string> };
type SendResult = { data: { id: string } | null; error: { name?: string } | null };
export type DigestDependencies = {
  db: () => SupabaseClient;
  seed: () => DigestRow[];
  send: (key: string, message: Message, idempotencyKey: string) => Promise<SendResult>;
  now?: () => Date;
  log?: (message: string) => void;
  wait?: (ms: number) => Promise<void>;
};
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const WINDOW_MS = 12 * 60 * 60_000;
export const esc = (value: string) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Stable Friday at16:00 UTC edition; retries cannot escape the provider's24h idempotency lifetime. */
export function editionAt(now: Date): Date {
  const edition = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 16));
  edition.setUTCDate(edition.getUTCDate() - ((edition.getUTCDay() - 5 + 7) % 7));
  if (edition > now) edition.setUTCDate(edition.getUTCDate() - 7);
  return edition;
}
export function assertSendWindow(now: Date, edition: Date) {
  const age = now.getTime() - edition.getTime();
  if (!Number.isFinite(age) || age < 0 || age >= WINDOW_MS) throw new Error("Digest send window closed; do not force a late resend. Review and use the next weekly edition.");
}
export function recipientKey(edition: Date, email: string) {
  return `digest/${edition.toISOString().slice(0, 10)}/${createHash("sha256").update(email.trim().toLowerCase()).digest("hex")}`;
}
export function selectDigestItems(rows: DigestRow[]): DigestRow[] {
  const counts = new Map<string, number>();
  return rows.filter((row) => {
    if (!row || !Object.hasOwn(CATEGORY_MAP, row.category) || !Object.hasOwn(STATUS_META, row.status)
      || typeof row.slug !== "string" || !/^[a-z0-9][a-z0-9-]{0,119}$/.test(row.slug)
      || typeof row.title_ar !== "string" || typeof row.summary_ar !== "string"
      || (row.tags != null && (!Array.isArray(row.tags) || row.tags.some((tag) => typeof tag !== "string")))
      || isSpoiler(row)) return false;
    const n = counts.get(row.category) ?? 0;
    if (n >= 6) return false;
    counts.set(row.category, n + 1);
    return true;
  }).slice(0, 30).map((row) => ({ ...row, title_ar: row.title_ar.slice(0, 240), summary_ar: row.summary_ar.slice(0, 800) }));
}
export function renderDigest(items: DigestRow[], site: string, unsubscribe: string) {
  const cards = items.map((row) => `<tr><td style="padding:14px;background:#1a0f2e;border:1px solid #2d2045;border-radius:12px"><div style="color:#c8b8dd;font-size:12px">${esc(CATEGORY_MAP[row.category].ar)} · ${esc(STATUS_META[row.status].ar)}</div><a href="${esc(site)}/item/${encodeURIComponent(row.slug)}" style="color:#fbf6ff;font-size:16px;font-weight:bold;text-decoration:none">${esc(row.title_ar)}</a><p style="color:#c8b8dd;line-height:1.7;font-size:14px">${esc(row.summary_ar)}</p></td></tr><tr><td style="height:10px"></td></tr>`).join("");
  return `<!doctype html><html lang="ar" dir="rtl"><body style="margin:0;background:#0b0613;color:#fbf6ff;font-family:Tahoma,Arial,sans-serif"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px"><table role="presentation" width="100%" style="max-width:560px" dir="rtl"><tr><td><h1 style="font-size:24px">نشرة Arabic GTA6</h1><p>${items.length} موضوع من أخبار وأدلة GTA 6 هذا الأسبوع</p></td></tr>${cards}<tr><td style="padding:20px;text-align:center"><a href="${esc(site)}" style="color:#ff8ab8">افتح الموقع</a><p style="color:#c8b8dd;font-size:12px">موقع معجبين غير رسمي · Unofficial fan site</p><a href="${esc(unsubscribe)}" style="color:#c8b8dd">إلغاء الاشتراك · Unsubscribe</a></td></tr></table></td></tr></table></body></html>`;
}
function capFrom(raw: string | undefined) {
  if (!raw?.trim()) return 100;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 500) throw new Error("DIGEST_MAX_RECIPIENTS must be an integer from1 to500.");
  return n;
}
export async function loadRecipients(client: SupabaseClient, cap: number, only?: string): Promise<Recipient[]> {
  const recipients: Recipient[] = [];
  const seenEmails = new Set<string>();
  let cursor = "", scanned = 0;
  while (true) {
    const pageSize = Math.min(100, cap + 1 - scanned);
    let query = client.from("profiles").select("id,email,unsubscribe_token").eq("digest_opt_in", true).not("email", "is", null).order("id", { ascending: true }).limit(pageSize);
    if (cursor) query = query.gt("id", cursor);
    if (only) query = query.eq("email", only);
    const { data, error } = await query.abortSignal(AbortSignal.timeout(5000));
    if (error) throw new Error("Subscriber list unavailable; no emails have been sent.");
    const page = (data ?? []) as Recipient[];
    scanned += page.length;
    if (scanned > cap) throw new Error("Subscriber cap exceeded; review the list and configured cap before sending. No emails have been sent.");
    for (const row of page) {
      const email = typeof row.email === "string" ? row.email.trim().toLowerCase() : "";
      if (!UUID.test(row.id) || row.id <= cursor || !UUID.test(row.unsubscribe_token) || !EMAIL.test(email) || email.length > 254) throw new Error("Invalid subscriber record; review required before sending.");
      cursor = row.id;
      if (!seenEmails.has(email)) {
        seenEmails.add(email);
        recipients.push({ ...row, email });
      }
    }
    if (page.length < pageSize) break;
  }
  return recipients;
}

export async function runDigest(args: string[], env: Record<string, string | undefined>, deps: DigestDependencies) {
  const log = deps.log ?? console.log;
  const now = deps.now ?? (() => new Date());
  const send = args.includes("--send");
  if (args.some((a) => a !== "--send" && a !== "--dry" && !a.startsWith("--to=")) || (send && args.includes("--dry"))) throw new Error("Use --dry or --send, with optional --to=registered-address.");
  const only = args.find((a) => a.startsWith("--to="))?.slice(5).trim().toLowerCase();
  if (only !== undefined && (!EMAIL.test(only) || only.length > 254)) throw new Error("Invalid test recipient address.");
  const url = new URL(env.SITE_URL || "https://arabicgta6.com");
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.pathname !== "/" || url.search || url.hash) throw new Error("SITE_URL must be an HTTPS site origin.");
  const site = url.origin;
  if (!send) {
    const items = selectDigestItems([...deps.seed()].sort((a, b) => b.published_at.localeCompare(a.published_at)));
    log("DRY preview from local seed only; no subscriber lookup, provider request or database write.");
    log(renderDigest(items, site, `${site}/account`));
    return { mode: "dry", items: items.length, recipients: 0, sent: 0 };
  }
  if (!digestEnabled(env)) throw new Error("Digest sending is disabled. Both readiness flags must be explicitly true after review and verified delivery.");
  const apiKey = env.RESEND_API_KEY?.trim(), from = env.DIGEST_FROM?.trim();
  if (!apiKey || !from || /[\r\n]/.test(from) || !(env.SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL) || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Digest configuration is incomplete; no reads or sends performed.");
  const sender = from.match(/<([^<>]+)>$/)?.[1] ?? from;
  if (!EMAIL.test(sender)) throw new Error("DIGEST_FROM must contain a valid sender address.");
  const cap = capFrom(env.DIGEST_MAX_RECIPIENTS);
  const edition = editionAt(now());
  assertSendWindow(now(), edition);
  const client = deps.db();
  const { data, error } = await client.from("items").select("slug,category,title_ar,summary_ar,status,tags,published_at")
    .gte("created_at", new Date(edition.getTime() - 7 * 864e5).toISOString()).lt("created_at", edition.toISOString())
    .lte("published_at", edition.toISOString()).order("published_at", { ascending: false }).order("slug", { ascending: true })
    .limit(200).abortSignal(AbortSignal.timeout(5000));
  if (error) throw new Error("Digest content unavailable; no emails have been sent.");
  const items = selectDigestItems((data ?? []) as DigestRow[]);
  if (!items.length) { log("No eligible non-spoiler articles for this edition."); return { mode: "send", items: 0, recipients: 0, sent: 0 }; }
  const recipients = await loadRecipients(client, cap, only); // complete bounded preflight before the first send
  if (only && !recipients.length) throw new Error("Test address must be an existing opted-in subscriber.");
  let sent = 0;
  for (const recipient of recipients) {
    assertSendWindow(now(), edition);
    const unsubscribe = `${site}/unsubscribe?token=${encodeURIComponent(recipient.unsubscribe_token)}`;
    let result: SendResult;
    try {
    result = await deps.send(apiKey, {
      from, to: [recipient.email], subject: `نشرة GTA 6 — ${edition.toISOString().slice(0, 10)} · ${items.length} موضوع`,
      html: renderDigest(items, site, unsubscribe),
      text: items.map((row) => `${STATUS_META[row.status].ar}: ${row.title_ar}\n${row.summary_ar}\n${site}/item/${row.slug}`).join("\n\n") + `\n\nإلغاء الاشتراك: ${unsubscribe}`,
      headers: { "List-Unsubscribe": `<${unsubscribe}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
    }, recipientKey(edition, recipient.email));
    } catch {
      throw new Error(`Digest transport failed after ${sent} accepted messages. Review before retrying the same edition; keep its idempotency keys.`);
    }
    if (result.error || !result.data?.id) throw new Error(`Digest send stopped after ${sent} accepted messages. Retry only inside the same edition window; do not change idempotency keys.`);
    sent++;
    if (sent < recipients.length) await (deps.wait ?? ((ms) => new Promise((resolve) => setTimeout(resolve, ms))))(600);
  }
  const { error: logError } = await client.from("update_runs").insert({ kind: "digest", added: sent, note: `edition=${edition.toISOString()}; items=${items.length}` });
  if (logError) throw new Error("Messages were accepted but the run log failed. Do not force a resend; review the same edition.");
  log(`Digest accepted: ${sent} messages, ${items.length} items. Provider acceptance is not proof of inbox delivery.`);
  return { mode: "send", items: items.length, recipients: recipients.length, sent };
}
