import { createHash, randomBytes } from "node:crypto";
import { closeSync, fsyncSync, lstatSync, mkdirSync, openSync, writeFileSync } from "node:fs";
import { join, parse, resolve, sep } from "node:path";

export class EditorialBackupError extends Error {}
export type PublicEditorialConfig = { origin: string; key: string; keyKind: "anon-jwt" | "publishable" };
type Row = Record<string, unknown> & { id: string; slug: string };
export type EditorialSnapshot = {
  rows: Row[]; startedAt: string; completedAt: string; origin: string; keyKind: PublicEditorialConfig["keyKind"];
  requests: number; bytesRead: number; canonicalRowsSha256: string;
};
const LIMITS = { rows: 5000, pageRows: 500, pageBytes: 8 * 1024 * 1024, totalBytes: 50 * 1024 * 1024, requests: 40, runMs: 110000, pageMs: 8000 };
const fail = (message: string): never => { throw new EditorialBackupError(message); };
export function publicEditorialConfig(env: Record<string, string | undefined>): PublicEditorialConfig {
  const raw = env.NEXT_PUBLIC_SUPABASE_URL ?? env.SUPABASE_URL;
  const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!raw || !key || key.length > 5000) return fail("Public Supabase URL/key is missing or invalid. No service-role key is accepted.");
  let url: URL;
  try { url = new URL(raw); } catch { return fail("Public Supabase URL is invalid."); }
  if (url.protocol !== "https:" || !url.hostname.endsWith(".supabase.co") || url.username || url.password || url.port || url.pathname !== "/" || url.search || url.hash) return fail("Use the project's HTTPS supabase.co origin, without a path or credentials.");
  if (/^sb_publishable_[A-Za-z0-9_-]{10,}$/.test(key)) return { origin: url.origin, key, keyKind: "publishable" };
  try {
    const parts = key.split(".");
    if (parts.length === 3 && JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")).role === "anon") return { origin: url.origin, key, keyKind: "anon-jwt" };
  } catch { /* Never include the supplied key in an error. */ }
  return fail("Only a public publishable key or legacy anon key is accepted; secret/service/user keys are rejected.");
}
function canonical(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([k, v]) => [k, canonical(v)]));
  return value;
}
export function editorialRowsSha256(rows: Row[]): string {
  return createHash("sha256").update(JSON.stringify(canonical([...rows].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0)))).digest("hex");
}
/** Fixed public.items GET only; no session, service client, other table or media fetch. */
export async function readPublicEditorial(config: PublicEditorialConfig, deps: { fetch?: typeof fetch; now?: () => number; pageTimeoutMs?: number } = {}): Promise<EditorialSnapshot> {
  // Validate again so this exported helper cannot accidentally receive a service key from another caller.
  config = publicEditorialConfig({ NEXT_PUBLIC_SUPABASE_URL: config.origin, NEXT_PUBLIC_SUPABASE_ANON_KEY: config.key });
  const request = deps.fetch ?? fetch, now = deps.now ?? Date.now;
  const started = now(); let requests = 0, bytesRead = 0;
  async function page(offset: number) {
    const remaining = LIMITS.runMs - (now() - started);
    if (++requests > LIMITS.requests || remaining <= 0) return fail("Public export request/time limit reached; no complete backup accepted.");
    const url = new URL("/rest/v1/items", config.origin);
    url.search = new URLSearchParams({ select: "*", order: "id.asc", limit: String(LIMITS.pageRows), offset: String(offset) }).toString();
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined, reader: ReadableStreamDefaultReader<Uint8Array> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => { controller.abort(); void reader?.cancel().catch(() => {}); reject(new EditorialBackupError("Public editorial read exceeded its deadline.")); }, Math.max(1, Math.min(remaining, LIMITS.pageMs, deps.pageTimeoutMs ?? LIMITS.pageMs)));
    });
    try {
      return await Promise.race([(async () => {
        const headers: Record<string, string> = { apikey: config.key, Prefer: "count=exact", Accept: "application/json" };
        if (config.keyKind === "anon-jwt") headers.Authorization = `Bearer ${config.key}`;
        const res = await request(url, { method: "GET", redirect: "manual", headers, signal: controller.signal });
        if (!res.ok) { void res.body?.cancel().catch(() => {}); return fail(`Public editorial read failed (HTTP ${res.status}).`); }
        const range = res.headers.get("content-range")?.match(/^(?:(\d+)-(\d+)|\*)\/(\d+)$/);
        const total = range ? Number(range[3]) : NaN;
        if (!range || !Number.isSafeInteger(total) || total < 0 || total > LIMITS.rows) { void res.body?.cancel().catch(() => {}); return fail("Public editorial exact count is missing or exceeds the reviewed row limit."); }
        if (!res.body || Number(res.headers.get("content-length") ?? 0) > LIMITS.pageBytes) { void res.body?.cancel().catch(() => {}); return fail("Public editorial response is missing or exceeds its byte limit."); }
        reader = res.body.getReader(); const chunks: Uint8Array[] = []; let pageBytes = 0;
        while (true) {
          const { done, value } = await reader.read(); if (done) break;
          pageBytes += value.byteLength; bytesRead += value.byteLength;
          if (pageBytes > LIMITS.pageBytes || bytesRead > LIMITS.totalBytes) return fail("Public editorial byte limit reached.");
          chunks.push(value);
        }
        const rows: unknown = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        if (!Array.isArray(rows) || rows.length > LIMITS.pageRows || rows.some((r) => !r || Array.isArray(r) || typeof r !== "object" || typeof r.id !== "string" || typeof r.slug !== "string" || !r.id || !r.slug)) return fail("Public editorial rows have an unexpected shape.");
        if (rows.length && (Number(range[1]) !== offset || Number(range[2]) - Number(range[1]) + 1 !== rows.length)) return fail("Public editorial range metadata does not match its rows.");
        return { rows: rows as Row[], total };
      })(), timeout]);
    } catch (error) {
      if (error instanceof EditorialBackupError) throw error;
      // Fetch/JSON/provider errors may contain URLs, headers or body text. Do not echo them.
      return fail("Public editorial transport or response failed; no complete backup accepted.");
    } finally {
      clearTimeout(timer); controller.abort(); void reader?.cancel().catch(() => {});
    }
  }
  async function pass() {
    const rows: Row[] = []; let total: number | undefined;
    while (true) {
      const result = await page(rows.length);
      if (total === undefined) total = result.total;
      else if (total !== result.total) return fail("Public editorial count changed while reading; retry later.");
      rows.push(...result.rows);
      if (rows.length === total) break;
      if (!result.rows.length || rows.length > total) return fail("Public editorial read is incomplete; no backup accepted.");
    }
    if (new Set(rows.map((r) => r.id)).size !== rows.length || new Set(rows.map((r) => r.slug)).size !== rows.length) return fail("Duplicate editorial identities found while paging; retry later.");
    return rows;
  }
  const first = await pass(), second = await pass();
  const digest = editorialRowsSha256(second);
  if (first.length !== second.length || editorialRowsSha256(first) !== digest) return fail("Public editorial content changed between reads; retry later.");
  return { rows: second, origin: config.origin, keyKind: config.keyKind, startedAt: new Date(started).toISOString(), completedAt: new Date(now()).toISOString(), requests, bytesRead, canonicalRowsSha256: digest };
}
/** Explicit private destination. Reject traversal, symlinks, shared directories and cwd/root targets. */
export function prepareEditorialOutput(raw: string, cwd = process.cwd()): string {
  if (!raw || /[\x00-\x1f\x7f]/.test(raw) || raw.split(/[\\/]/).includes("..")) return fail("Choose an explicit backup directory without parent traversal.");
  const target = resolve(cwd, raw);
  if (target === resolve(cwd) || target === parse(target).root) return fail("Choose a dedicated private backup directory, not the project/filesystem root.");
  try {
    let current = parse(target).root;
    const pieces = target.slice(current.length).split(sep).filter(Boolean);
    for (let i = 0; i < pieces.length; i++) {
      current = join(current, pieces[i]);
      let info;
      try { info = lstatSync(current); }
      catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT" || i !== pieces.length - 1) throw error;
        mkdirSync(current, { mode: 0o700 }); info = lstatSync(current);
      }
      if (info.isSymbolicLink() || !info.isDirectory()) return fail("Backup path must contain only real directories, never symlinks.");
      if (i === pieces.length - 1 && ((info.mode & 0o777) !== 0o700 || (process.getuid && info.uid !== process.getuid()))) return fail("Backup directory must belong to the current user with permissions0700.");
    }
    return target;
  } catch (error) {
    if (error instanceof EditorialBackupError) throw error;
    return fail("Could not prepare the private backup directory. Check its parent and permissions.");
  }
}
function privateFile(path: string, bytes: string | Buffer) {
  const fd = openSync(path, "wx", 0o600); // unique name, no overwrite or symlink following
  try { writeFileSync(fd, bytes); fsyncSync(fd); } finally { closeSync(fd); }
}
export function writeEditorialBackup(rawOutput: string, snapshot: EditorialSnapshot) {
  if (snapshot.rows.length > LIMITS.rows || editorialRowsSha256(snapshot.rows) !== snapshot.canonicalRowsSha256) return fail("Editorial snapshot changed before writing; no backup accepted.");
  const output = prepareEditorialOutput(rawOutput);
  const filename = `public-items-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomBytes(4).toString("hex")}.json`;
  const jsonPath = join(output, filename), manifestPath = jsonPath + ".manifest.json";
  const bytes = Buffer.from(JSON.stringify(snapshot.rows));
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  const manifest = { version: 1, table: "public.items", access: "public key; no user session or service role", origin: snapshot.origin,
    keyKind: snapshot.keyKind, startedAt: snapshot.startedAt, completedAt: snapshot.completedAt, rows: snapshot.rows.length,
    columns: [...new Set(snapshot.rows.flatMap((r) => Object.keys(r)))].sort(), requests: snapshot.requests, bytesRead: snapshot.bytesRead,
    file: filename, bytes: bytes.length, sha256, canonicalRowsSha256: snapshot.canonicalRowsSha256,
    exactCounts: true, twoPassesEqual: true, consistency: "Two equal REST passes; not a transactionally isolated hosted database snapshot.",
    excluded: ["accounts/profiles", "community/comments/votes", "analytics/radar state", "hosted schema/RLS/functions/OAuth", "remote media/storage object bytes"] };
  try {
    privateFile(jsonPath, bytes); privateFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  } catch { return fail("Backup files could not be completed. Do not trust a data file without its matching manifest/checksum."); }
  return { jsonPath, manifestPath, rows: snapshot.rows.length, sha256 };
}
/** Safe for CLI output; never expose raw network/provider/credential errors. */
export function editorialErrorMessage(error: unknown): string {
  return error instanceof EditorialBackupError ? error.message : "Public editorial backup failed. No complete backup was accepted.";
}
