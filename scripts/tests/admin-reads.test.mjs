import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

function harness(handler = async () => ({ data: [], count: 0, error: null })) {
  const cache = new Map(), calls = [], deadlines = [], clientOptions = [];
  const deadlineAPI = { timeout(milliseconds) { const c = new AbortController(); deadlines.push({ milliseconds, controller: c }); return c.signal; }, any: AbortSignal.any.bind(AbortSignal) };
  class Query {
    constructor(table) { this.table = table; this.steps = []; }
    select(...args) { this.steps.push(["select", ...args]); return this; }
    order(...args) { this.steps.push(["order", ...args]); return this; }
    range(...args) { this.steps.push(["range", ...args]); return this; }
    limit(...args) { this.steps.push(["limit", ...args]); return this; }
    gte(...args) { this.steps.push(["gte", ...args]); return this; }
    lt(...args) { this.steps.push(["lt", ...args]); return this; }
    abortSignal(signal) { const call = { table: this.table, steps: this.steps, signal }; calls.push(call); return handler(call); }
  }
  const db = { from: (table) => new Query(table) };
  function load(file) {
    if (cache.has(file)) return cache.get(file);
    const code = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const exports = {};
    const require = (id) => {
      if (id === "server-only") return {};
      if (id === "@supabase/supabase-js") return { createClient: (...args) => { clientOptions.push(args); return db; } };
      if (id === "./env") return { need: () => "offline-placeholder-not-a-key" };
      if (id.startsWith(".")) return load(path.normalize(path.join(path.dirname(file), id + ".ts")));
      throw new Error("Unexpected import " + id);
    };
    vm.runInNewContext("(function(require,exports){" + code + "\n})", { console, Error, Promise, Date, AbortSignal: deadlineAPI, Request, Response, URL, fetch: async (input, init) => { calls.push({ input, init }); return new Response("{}", { headers: { "content-type": "application/json" } }); }, process: { env: { SUPABASE_URL: "https://offline.example.test" }, exit: () => { throw new Error("unexpected exit"); } } })(require, exports);
    cache.set(file, exports); return exports;
  }
  return { load, calls, deadlines, db, clientOptions };
}
const rowsFor = (total, serverCap = 1000) => async (call) => {
  const range = call.steps.find((s) => s[0] === "range");
  if (!range) return { data: [], error: null };
  const offset = range[1], count = Math.max(0, Math.min(total - offset, range[2] - offset + 1, serverCap));
  return { data: Array.from({ length: count }, (_, i) => ({ id: String(offset + i), last_sign_in_at: null })), count: call.steps.find((s) => s[0] === "select")?.[2]?.count === "exact" ? total : null, error: null };
};

test("admin pages beyond1000 rows with one shared deadline and explicit fields", async () => {
  const h = harness(rowsFor(1301));
  const result = await h.load("src/lib/admin-overview.ts").loadAdminOverview(h.db, new Date("2026-11-22T00:00:00Z"));
  assert.equal(result.profiles.rows.length, 1301); assert.equal(result.views.rows.length, 1301);
  assert.equal(result.profiles.truncated, false); assert.equal(h.deadlines.length, 1); assert.equal(h.deadlines[0].milliseconds, 8000);
  assert.equal(new Set(h.calls.map((c) => c.signal)).size, 1);
  assert.ok(h.calls.every((c) => c.steps.find((s) => s[0] === "select")[1] !== "*"));
  assert.ok(h.calls.filter((c) => c.table !== "update_runs").every((c) => c.steps.some((s) => s[0] === "lt" && s[1] === "created_at")));
});
test("server row cap below requested page size does not falsely complete read", async () => {
  const h = harness(rowsFor(650, 100));
  const result = await h.load("src/lib/admin-overview.ts").loadAdminOverview(h.db);
  assert.equal(result.views.rows.length, 650); assert.equal(h.calls.filter((c) => c.table === "page_views").length, 7);
});
test("hard bounds report loaded sample versus true row count", async () => {
  const h = harness(rowsFor(15001));
  const result = await h.load("src/lib/admin-overview.ts").loadAdminOverview(h.db);
  assert.equal(result.views.rows.length, 10000); assert.equal(result.views.total, 15001); assert.equal(result.views.truncated, true);
  assert.equal(result.profiles.rows.length, 5000); assert.equal(result.profiles.truncated, true);
});
test("empty tables remain legitimate zero data", async () => {
  const h = harness(rowsFor(0)); const result = await h.load("src/lib/admin-overview.ts").loadAdminOverview(h.db);
  assert.equal(result.profiles.rows.length, 0); assert.equal(result.views.total, 0); assert.equal(result.views.truncated, false);
});
test("database failure cannot masquerade as zero traffic", async () => {
  const h = harness(async (c) => c.table === "page_views" ? { data: null, count: null, error: { code: "denied" } } : rowsFor(0)(c));
  await assert.rejects(h.load("src/lib/admin-overview.ts").loadAdminOverview(h.db), /temporarily unavailable/);
});
test("missing row count refuses misleading complete status", async () => {
  const h = harness(async () => ({ data: [], count: null, error: null }));
  await assert.rejects(h.load("src/lib/admin-overview.ts").loadAdminOverview(h.db), /temporarily unavailable/);
});
test("a disappearing later page fails instead of hiding missing rows", async () => {
  const h = harness(async (c) => c.steps.some((s) => s[0] === "range" && s[1] > 0) ? { data: [], count: null, error: null } : rowsFor(1200)(c));
  await assert.rejects(h.load("src/lib/admin-overview.ts").loadAdminOverview(h.db), /temporarily unavailable/);
});
test("tiny unexpected row cap cannot cause unbounded requests", async () => {
  const h = harness(rowsFor(1000, 1));
  await assert.rejects(h.load("src/lib/admin-overview.ts").loadAdminOverview(h.db), /temporarily unavailable/);
  assert.ok(h.calls.filter((c) => c.table === "page_views").length <= 40);
});
test("shared deadline bounds a transport ignoring its abort signal", async () => {
  const h = harness(() => new Promise(() => {}));
  const pending = h.load("src/lib/admin-overview.ts").loadAdminOverview(h.db);
  const rejected = assert.rejects(pending, /temporarily unavailable/); h.deadlines[0].controller.abort(); await rejected;
  assert.ok(h.calls.every((c) => c.signal.aborted));
});
test("script client uses existing bounded fetch and disables refresh", () => {
  const h = harness(); h.load("scripts/lib/db.ts").db();
  assert.equal(h.clientOptions.length, 1); const options = h.clientOptions[0][2];
  assert.equal(options.global.fetch, h.load("src/lib/server-fetch.ts").serverFetch);
  assert.equal(options.auth.persistSession, false); assert.equal(options.auth.autoRefreshToken, false);
});
test("shared fetch preserves caller cancellation and its5s timeout", async () => {
  const h = harness(); const controller = new AbortController();
  await h.load("src/lib/server-fetch.ts").serverFetch("https://offline.example.test", { signal: controller.signal });
  assert.equal(h.deadlines[0].milliseconds, 5000); controller.abort(); assert.equal(h.calls[0].init.signal.aborted, true);
});
