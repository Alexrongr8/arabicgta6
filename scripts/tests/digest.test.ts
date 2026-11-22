/** Offline only: all transport/database dependencies are in-memory fakes. */
import assert from "node:assert/strict";
import test from "node:test";
import type { SupabaseClient } from "@supabase/supabase-js";
import { digestEnabled } from "../../src/lib/digest-config";
import { assertSendWindow, editionAt, loadRecipients, recipientKey, renderDigest, runDigest, selectDigestItems, type DigestDependencies, type DigestRow } from "../lib/digest";

const row: DigestRow = { slug: "test-tip", category: "tips", title_ar: "عنوان", summary_ar: "ملخص", status: "confirmed", tags: [], published_at: "2026-11-20T15:00:00Z" };
const env = { DIGEST_ENABLED: "true", DIGEST_DELIVERY_VERIFIED: "true", RESEND_API_KEY: "TEST-NOT-A-KEY", DIGEST_FROM: "Tests <test@example.com>", SUPABASE_URL: "https://db.example.com", SUPABASE_SERVICE_ROLE_KEY: "TEST-NOT-A-KEY", SITE_URL: "https://arabicgta6.com" };
const edition = new Date("2026-11-20T16:00:00Z");
const uuid = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const person = (n: number, email = `user${n}@example.com`) => ({ id: uuid(n), email, unsubscribe_token: uuid(1000 + n) });
function mockDB(people = [person(1)]) {
  let writes = 0;
  const client = { from(table: string) {
    let cap = 100, cursor = "";
    const query = {
      select() { return this; }, eq() { return this; }, not() { return this; }, order() { return this; },
      gte() { return this; }, lt() { return this; }, lte() { return this; },
      gt(_column: string, value: string) { cursor = value; return this; },
      limit(value: number) { cap = value; return this; }, abortSignal() { return this; },
      insert() { writes++; return Promise.resolve({ error: null }); },
      then(resolve: (value: unknown) => void) {
        resolve({ data: table === "items" ? [row] : people.filter((p) => p.id > cursor).slice(0, cap), error: null });
      },
    };
    return query;
  } } as unknown as SupabaseClient;
  return { client, get writes() { return writes; } };
}
function dependencies(client?: SupabaseClient): DigestDependencies {
  return {
    db: () => { if (!client) throw new Error("Unexpected database access"); return client; },
    seed: () => [row], send: async () => { throw new Error("Unexpected email transport"); },
    now: () => new Date("2026-11-20T17:00:00Z"), log: () => {}, wait: async () => {},
  };
}

test("newsletter needs both exact readiness flags; preview never contacts services", async () => {
  assert.equal(digestEnabled({}), false);
  assert.equal(digestEnabled({ DIGEST_ENABLED: "true" }), false);
  assert.equal(digestEnabled({ DIGEST_ENABLED: "TRUE", DIGEST_DELIVERY_VERIFIED: "true" }), false);
  assert.equal(digestEnabled(env), true);
  for (const args of [[], ["--dry"]]) assert.equal((await runDigest(args, {}, dependencies())).mode, "dry");
});
test("disabled or incomplete configuration refuses a send before any database access", async () => {
  for (const configuration of [{}, { ...env, DIGEST_DELIVERY_VERIFIED: "false" }, { ...env, RESEND_API_KEY: "" }]) {
    await assert.rejects(runDigest(["--send"], configuration, dependencies()), /disabled|incomplete/);
  }
});
test("edition/time-window/key boundaries protect retries beyond provider retention", () => {
  assert.equal(editionAt(new Date("2026-11-20T15:59:59.999Z")).toISOString(), "2026-11-13T16:00:00.000Z");
  assert.equal(editionAt(edition).toISOString(), edition.toISOString());
  assert.doesNotThrow(() => assertSendWindow(edition, edition));
  assert.doesNotThrow(() => assertSendWindow(new Date("2026-11-21T03:59:59.999Z"), edition));
  assert.throws(() => assertSendWindow(new Date("2026-11-21T04:00:00Z"), edition));
  assert.throws(() => assertSendWindow(new Date("2026-11-20T15:59:59Z"), edition));
  assert.equal(recipientKey(edition, " USER@example.com "), recipientKey(edition, "user@example.com"));
  assert.notEqual(recipientKey(edition, "user@example.com"), recipientKey(edition, "other@example.com"));
});
test("digest excludes spoilers and keeps status labels and escaped text", () => {
  const rows = selectDigestItems([{ ...row, status: "rumor", title_ar: "<script>" }, { ...row, tags: ["StorySpoiler"] }, { ...row, category: "choices" }]);
  assert.equal(rows.length, 1);
  const html = renderDigest(rows, "https://example.com", "https://example.com/unsubscribe");
  assert(html.includes("غير مؤكد"));
  assert(html.includes("&lt;script&gt;"));
  assert(!html.includes("<script>"));
});
test("subscriber pagination passes the first100 and deduplicates normalized email", async () => {
  const db = mockDB(Array.from({ length: 101 }, (_, i) => person(i + 1)));
  assert.equal((await loadRecipients(db.client, 200)).length, 101);
  const duplicates = mockDB([person(1, "USER@example.com"), person(2, "user@example.com")]);
  assert.equal((await loadRecipients(duplicates.client, 100)).length, 1);
  assert.equal(db.writes, 0);
});
test("recipient cap is preflighted before the first email", async () => {
  const db = mockDB(Array.from({ length: 101 }, (_, i) => person(i + 1)));
  await assert.rejects(runDigest(["--send"], env, dependencies(db.client)), /cap exceeded/);
  assert.equal(db.writes, 0);
});
test("provider conflict stops the edition without changing keys or logging success", async () => {
  const db = mockDB([person(1), person(2)]);
  const deps = dependencies(db.client);
  let sends = 0;
  deps.send = async () => { sends++; return { data: null, error: { name: "invalid_idempotent_request" } }; };
  await assert.rejects(runDigest(["--send"], env, deps), /send stopped/);
  assert.equal(sends, 1);
  assert.equal(db.writes, 0);
});
test("deadline is rechecked before every recipient", async () => {
  const db = mockDB([person(1), person(2)]);
  const deps = dependencies(db.client);
  let times = 0, sends = 0;
  deps.now = () => new Date(++times <= 3 ? "2026-11-20T17:00:00Z" : "2026-11-21T04:00:00Z");
  deps.send = async () => { sends++; return { data: { id: "fake" }, error: null }; };
  await assert.rejects(runDigest(["--send"], env, deps), /window closed/);
  assert.equal(sends, 1);
  assert.equal(db.writes, 0);
});
