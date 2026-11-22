import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { chmodSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, basename } from "node:path";
import { publicEditorialConfig, readPublicEditorial, prepareEditorialOutput, writeEditorialBackup, editorialErrorMessage, EditorialBackupError } from "../lib/public-editorial-backup";

const jwt = (role: string) => `test.${Buffer.from(JSON.stringify({ role })).toString("base64url")}.offline_signature`;
const env = { NEXT_PUBLIC_SUPABASE_URL: "https://offline-project.supabase.co", NEXT_PUBLIC_SUPABASE_ANON_KEY: jwt("anon") };
const config = () => publicEditorialConfig(env);
const row = (id: number) => ({ id: String(id).padStart(6, "0"), slug: `article-${id}`, title_ar: "مقال تجريبي", body_en: "offline public editorial fixture", image: null });
function response(rows: unknown[], total: number, offset = 0) {
  return new Response(JSON.stringify(rows), { headers: { "content-type": "application/json", "content-range": `${rows.length ? `${offset}-${offset + rows.length - 1}` : "*"}/${total}` } });
}
function mock(total = 3, serverCap = 500) {
  const calls: { url: URL; init?: RequestInit }[] = [];
  const fetcher: typeof fetch = async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input)); calls.push({ url, init });
    const offset = Number(url.searchParams.get("offset"));
    return response(Array.from({ length: Math.max(0, Math.min(serverCap, total - offset)) }, (_, n) => row(offset + n)), total, offset);
  };
  return { fetcher, calls };
}
async function snapshot() { return readPublicEditorial(config(), { fetch: mock().fetcher }); }
function temporary(run: (root: string) => void) {
  const root = mkdtempSync(join(tmpdir(), "gtavi-backup-fixture-"));
  try { run(root); } finally { rmSync(root, { recursive: true, force: true }); }
}

test("two exact-count reads use only anonymous public.items GET with no redirects/cookies", async () => {
  const m = mock(); const s = await readPublicEditorial(config(), { fetch: m.fetcher });
  assert.equal(s.rows.length, 3); assert.equal(s.requests, 2);
  for (const c of m.calls) { assert.equal(c.url.pathname, "/rest/v1/items"); assert.equal(c.init?.method, "GET"); assert.equal(c.init?.redirect, "manual"); assert.equal(c.url.searchParams.get("select"), "*"); assert.equal(c.init?.body, undefined); assert.equal(new Headers(c.init?.headers).get("cookie"), null); assert.equal(new Headers(c.init?.headers).get("Authorization"), "Bearer " + env.NEXT_PUBLIC_SUPABASE_ANON_KEY); }
});
test("pagination respects lower server cap without silently truncating", async () => { const m = mock(1001, 100); const s = await readPublicEditorial(config(), { fetch: m.fetcher }); assert.equal(s.rows.length, 1001); assert.equal(s.requests, 22); });
test("empty public table produces a valid empty two-pass snapshot", async () => { const s = await readPublicEditorial(config(), { fetch: mock(0).fetcher }); assert.equal(s.rows.length, 0); assert.equal(s.requests, 2); });
test("service_role, authenticated, secret and malformed keys fail before network", async () => {
  for (const key of [jwt("service_role"), jwt("authenticated"), "sb_secret_do_not_use", "bad-key"]) {
    assert.throws(() => publicEditorialConfig({ ...env, NEXT_PUBLIC_SUPABASE_ANON_KEY: key }), EditorialBackupError);
    await assert.rejects(readPublicEditorial({ ...config(), key }, { fetch: async () => { throw new Error("must not call"); } }), EditorialBackupError);
  }
});
test("publishable key uses apikey without pretending to be a bearer JWT", async () => {
  const m = mock(); const c = publicEditorialConfig({ ...env, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_offline_public_fixture" });
  await readPublicEditorial(c, { fetch: m.fetcher }); assert.equal(new Headers(m.calls[0].init?.headers).get("authorization"), null); assert.equal(new Headers(m.calls[0].init?.headers).get("apikey"), c.key);
});
test("credential-bearing, local, redirected-looking and non-Supabase origins are rejected", () => {
  for (const url of ["http://offline.supabase.co", "https://user:secret@offline.supabase.co", "https://127.0.0.1", "https://offline.supabase.co.evil.test", "https://offline.supabase.co/path", "https://offline.supabase.co?key=x"]) assert.throws(() => publicEditorialConfig({ ...env, NEXT_PUBLIC_SUPABASE_URL: url }), EditorialBackupError);
});
test("count mismatch between pages cannot produce a backup", async () => {
  let calls = 0; await assert.rejects(readPublicEditorial(config(), { fetch: async () => ++calls === 1 ? response([row(0)], 3) : response([row(1)], 4, 1) }), /count changed/);
});
test("same count but changed article content between passes is rejected", async () => {
  let calls = 0; await assert.rejects(readPublicEditorial(config(), { fetch: async () => response([{ ...row(0), title_ar: ++calls === 1 ? "قبل" : "بعد" }], 1) }), /content changed/);
});
test("different complete counts between passes are rejected", async () => {
  let calls = 0; await assert.rejects(readPublicEditorial(config(), { fetch: async () => ++calls === 1 ? response([row(0)], 1) : response([row(0), row(1)], 2) }), /content changed/);
});
test("missing exact count or ignored offset fails closed", async () => {
  await assert.rejects(readPublicEditorial(config(), { fetch: async () => new Response("[]") }), /exact count/);
  await assert.rejects(readPublicEditorial(config(), { fetch: async () => response([row(0)], 2, 0) }), /range metadata/);
});
test("duplicate editorial identities are rejected", async () => { await assert.rejects(readPublicEditorial(config(), { fetch: async () => response([row(0), row(0)], 2) }), /Duplicate/); });
test("row limit and request limit are hard bounds", async () => {
  await assert.rejects(readPublicEditorial(config(), { fetch: mock(5001).fetcher }), /row limit/);
  const m = mock(21, 1); await assert.rejects(readPublicEditorial(config(), { fetch: m.fetcher }), /request\/time limit/); assert.equal(m.calls.length, 40);
});
test("overall deadline is shared across passes", async () => {
  let time = 0; await assert.rejects(readPublicEditorial(config(), { now: () => time, fetch: async () => { time = 110001; return response([row(0)], 1); } }), /request\/time limit/);
});
test("HTTP failure/transport errors never reveal provider body or credentials", async () => {
  const secret = "PRIVATE-DO-NOT-PRINT";
  for (const fetcher of [async () => new Response(secret, { status: 401 }), async () => { throw new Error("key=" + secret); }]) {
    try { await readPublicEditorial(config(), { fetch: fetcher }); assert.fail("must reject"); }
    catch (error) { assert.ok(!editorialErrorMessage(error).includes(secret)); }
  }
  assert.equal(editorialErrorMessage(new Error(secret)), "Public editorial backup failed. No complete backup was accepted.");
});
test("redirect responses are not followed", async () => { let calls = 0; await assert.rejects(readPublicEditorial(config(), { fetch: async () => { calls++; return new Response(null, { status: 302, headers: { location: "https://elsewhere.test" } }); } }), /HTTP 302/); assert.equal(calls, 1); });
test("timeout covers stalled headers even when mock ignores abort", async () => {
  let signal: AbortSignal | null = null; await assert.rejects(readPublicEditorial(config(), { pageTimeoutMs: 5, fetch: async (_u, init) => { signal = init!.signal!; return new Promise<Response>(() => {}); } }), /deadline/); assert.equal((signal as AbortSignal | null)?.aborted, true);
});
test("timeout covers stalled body and cancels reader", async () => {
  let cancelled = false;
  await assert.rejects(readPublicEditorial(config(), { pageTimeoutMs: 5, fetch: async () => new Response(new ReadableStream({ cancel() { cancelled = true; } }), { headers: { "content-range": "0-0/1" } }) }), /deadline/);
  assert.equal(cancelled, true);
});
test("streamed byte cap cancels an oversized body", async () => {
  let cancelled = false, chunks = 0;
  await assert.rejects(readPublicEditorial(config(), { fetch: async () => new Response(new ReadableStream({ pull(c) { chunks++; c.enqueue(new Uint8Array(4 * 1024 * 1024 + 1)); }, cancel() { cancelled = true; } }), { headers: { "content-range": "0-0/1" } }) }), /byte limit/);
  assert.equal(cancelled, true); assert.ok(chunks <= 4);
});
test("explicit output directory rejects traversal/root/cwd and symlink components", () => temporary((root) => {
  assert.throws(() => prepareEditorialOutput("../escape", root), EditorialBackupError);
  assert.throws(() => prepareEditorialOutput(".", root), EditorialBackupError);
  assert.throws(() => prepareEditorialOutput("/", root), EditorialBackupError);
  mkdirSync(join(root, "real"), { mode: 0o700 }); symlinkSync(join(root, "real"), join(root, "alias"));
  assert.throws(() => prepareEditorialOutput(join(root, "alias")), /symlinks/);
  assert.throws(() => prepareEditorialOutput(join(root, "alias", "nested")), /symlinks/);
}));
test("existing shared directory is refused, new output is0700", () => temporary((root) => {
  mkdirSync(join(root, "shared")); chmodSync(join(root, "shared"), 0o755);
  assert.throws(() => prepareEditorialOutput(join(root, "shared")), /permissions0700/);
  const output = prepareEditorialOutput(join(root, "private")); assert.equal(lstatSync(output).mode & 0o777, 0o700);
}));
test("data/manifest are0600, checksum matches, repeated backups do not overwrite", async () => {
  const s = await snapshot(); temporary((root) => {
    const out = join(root, "private"); const first = writeEditorialBackup(out, s), second = writeEditorialBackup(out, s);
    assert.notEqual(first.jsonPath, second.jsonPath); assert.equal(readdirSync(out).length, 4);
    const manifest = JSON.parse(readFileSync(first.manifestPath, "utf8"));
    assert.equal(manifest.file, basename(first.jsonPath)); assert.equal(manifest.rows, 3);
    assert.equal(manifest.sha256, createHash("sha256").update(readFileSync(first.jsonPath)).digest("hex"));
    assert.equal(lstatSync(first.jsonPath).mode & 0o777, 0o600); assert.equal(lstatSync(first.manifestPath).mode & 0o777, 0o600);
    assert.ok(!readFileSync(first.manifestPath, "utf8").includes(env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  });
});
test("modified snapshot cannot be written after a successful read", async () => {
  const s = await snapshot(); s.rows[0].body_en = "changed";
  temporary((root) => { assert.throws(() => writeEditorialBackup(join(root, "private"), s), /changed before writing/); assert.equal(readdirSync(root).length, 0); });
});

test("JSON key ordering differences are not mistaken for editorial churn", async () => { let calls = 0; const a = row(0); const b = Object.fromEntries(Object.entries(a).reverse()); const s = await readPublicEditorial(config(), { fetch: async () => response([++calls === 1 ? a : b], 1) }); assert.equal(s.rows.length, 1); });
