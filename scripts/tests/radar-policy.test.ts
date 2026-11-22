import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import { evidenceOf } from "../lib/ai-evidence";
import { BEAMS, config, emptyState, finishState, chooseBeam, sinceFor, verifyDraft, knownKeys, type Lead, type Draft, type State, type Research } from "../lib/radar-policy";
import { runRadar, type RadarDeps } from "../lib/radar-runner";
import { readKnown, readState, writeRecord } from "../lib/radar-store";
import { imageCandidates } from "../lib/image-review";

const URL = "https://www.rockstargames.com/newswire/article/test-update";
const QUOTE = "The update improves stability and fixes reported issues.";
const fields = ["title_ar", "title_en", "summary_ar", "summary_en", "body_ar", "body_en"];
const lead: Lead = { headline: "New stability update", gist: "An official stability update", url: URL, category: "news", confidence: "high", entity_name: null };
function draft(): Draft { return { item: { category: "news", status: "official", title_ar: "تحديث الاستقرار", title_en: "Stability update", summary_ar: "تحسينات للاستقرار", summary_en: "Improved stability", body_ar: "هذا وصف تجريبي لمصدر موثق حول تحسين استقرار اللعبة. ".repeat(16), body_en: "The update improves stability.", aliases: [], tags: [], facts: [], region: null, location: null, related: [], sources: [{ title: "Official update", url: URL }], event_date: null }, proof: { support: [{ url: URL, quote: QUOTE, fields }], story_spoilers: false, game_build: "unknown", in_scope: true } }; }
const response = (body = `<html><body>${QUOTE}</body></html>`, finalUrl = URL, status = 200, contentType = "text/html") => ({ status, contentType, body: Buffer.from(body), finalUrl });
function research<T>(data: T, urls = [URL]): Research<T> { return { data, retrievedUrls: urls, responseId: "offline-fixture", completedSearches: 1, usage: { requests: 1, inputTokens: 20, outputTokens: 20, searchCalls: 1 } }; }
function harness(state = emptyState()) {
  const saved: State[] = [], reviews: unknown[] = [], rows: Record<string, unknown>[] = [], logs: unknown[] = [], calls: string[] = [];
  const deps: RadarDeps = { state, known: [], catalogNames: [], now: new Date("2026-11-22T00:00:00Z"),
    discover: async () => { calls.push("discover"); return research({ leads: [structuredClone(lead)] }); },
    edit: async () => { calls.push("edit"); return research(draft()); },
    readSource: async () => { calls.push("source"); return response(); },
    save: async (s) => { saved.push(structuredClone(s)); }, review: async (r) => { reviews.push(r); },
    insert: async (r) => { rows.push(r); return true; }, log: async (r, complete, added) => { logs.push({ ...r, complete, added }); },
    isFatal: (e) => e instanceof Error && e.message === "fatal",
  };
  return { deps, saved, reviews, rows, logs, calls };
}

test("actual completed tool metadata only; model prose, annotations and failed searches are not retrieval", () => {
  const result = evidenceOf({ output: [{ type: "message", content: [{ type: "output_text", text: URL, annotations: [{ url: URL }] }] }, { type: "web_search_call", status: "failed", action: { sources: [{ type: "url", url: "https://bad.example/" }] } }, { type: "web_search_call", status: "completed", action: { type: "search", sources: [{ type: "url", url: URL }] } }] });
  assert.deepEqual(result, { retrievedUrls: [URL], searchCalls: 2, completedSearches: 1 });
});
test("completed opened pages retain retrieved identity", () => assert.deepEqual(evidenceOf({ output: [{ type: "web_search_call", status: "completed", action: { type: "open_page", url: URL } }] }).retrievedUrls, [URL]));
test("cost configuration rejects bulk/legacy beams and automatic enrichment", () => {
  for (const env of [{ UPDATE_MAX_ITEMS: "8" }, { ENRICH_PER_RUN: "1" }, { RADAR_BEAMS: "all" }, { RADAR_BEAMS: "web" }, { RADAR_BEAMS: "official,patches-bugs" }]) assert.throws(() => config(env));
  assert.equal(config({ UPDATE_MAX_ITEMS: "0" }).enabled, false); assert.equal(config({}).enabled, true); assert.equal(config({ RADAR_BEAMS: "rotate" }).pinnedBeam, undefined);
});
test("six-topic rotation uses separate windows instead of a global watermark", () => {
  let s = emptyState();
  for (const b of BEAMS) { assert.equal(chooseBeam(s).id, b.id); s = finishState(s, b.id, "2026-11-21T10:00:00Z"); }
  assert.equal(chooseBeam(s).id, "official"); assert.equal(sinceFor(s, "official", new Date()), "2026-11-21T04:00:00.000Z");
  assert.equal(Object.keys(s.windows).length, 6);
});
test("retrieved reachable official text with field support remains publication eligible", async () => assert.equal((await verifyDraft(draft(), [URL], async () => response())).decision, "publish"));
for (const [name, mutate, urls, source] of [
  ["invented citation", (d: Draft) => { d.item.sources[0].url = "https://www.rockstargames.com/invented"; }, [URL], async () => response()],
  ["source404", () => {}, [URL], async () => response("Missing", URL, 404)],
  ["login/challenge page lacks source excerpt", () => {}, [URL], async () => response("Please sign in to continue")],
  ["official URL redirects to untrusted host", () => {}, [URL], async () => response(undefined, "https://example.com/")],
  ["numeric claim absent in source", (d: Draft) => { d.item.summary_en += " at 120 FPS"; }, [URL], async () => response()],
  ["missing bilingual body", (d: Draft) => { d.item.body_en = ""; }, [URL], async () => response()],
  ["out of scope", (d: Draft) => { d.proof.in_scope = false; }, [URL], async () => response()],
  ["unsupported field", (d: Draft) => { d.proof.support[0].fields = ["title_en"]; }, [URL], async () => response()],
  ["map coordinates", (d: Draft) => { d.item.location = { x: 1, y: 1 }; }, [URL], async () => response()],
] as const) test(`${name} stays in review`, async () => { const d = draft(); mutate(d); assert.equal((await verifyDraft(d, [...urls], source)).decision, "review"); });
test("numeric claim present in retrieved source is permitted", async () => {
  const d = draft(); d.item.summary_en += " version 1.2"; d.proof.support[0].quote += " Version 1.2.";
  assert.equal((await verifyDraft(d, [URL], async () => response(QUOTE + " Version 1.2."))).decision, "publish");
});
test("story outcomes are tagged and held for neutral title review", async () => { const d = draft(); d.proof.story_spoilers = true; const g = await verifyDraft(d, [URL], async () => response()); assert.equal(g.decision, "review"); assert.ok(g.item.tags.includes("story-spoilers")); });
test("honest not-confirmed wording is preserved, not word-blacklisted into certainty", async () => { const d = draft(); d.item.status = "rumor"; d.item.title_ar = "غير مؤكد"; d.item.title_en = "Not confirmed"; const g = await verifyDraft(d, [URL], async () => response()); assert.equal(g.decision, "review"); assert.equal(g.item.title_en, "Not confirmed"); assert.equal(g.item.title_ar, "غير مؤكد"); });
test("nonofficial video/press claim awaits visual/independence review", async () => { const d = draft(); const url = "https://www.ign.com/articles/test"; d.item.sources = [{ title: "Press", url }]; d.proof.support[0].url = url; d.item.status = "confirmed"; assert.equal((await verifyDraft(d, [url], async () => response(undefined, url))).decision, "review"); });
test("source fetch count is bounded to six", async () => { const d = draft(); d.item.sources = Array.from({ length: 25 }, (_, n) => ({ title: "Source", url: `${URL}/${n}` })); let calls = 0; await verifyDraft(d, d.item.sources.map((s) => s.url), async () => { calls++; return response(); }); assert.equal(calls, 6); });
test("new official publication needs exactly two requests, uses category fallback and saves cursor", async () => { const h = harness(); const result = await runRadar(h.deps); assert.deepEqual(result, { added: 1, requests: 2, held: false }); assert.equal(h.rows[0].image, null); assert.equal(h.saved.at(-1)?.pending, null); assert.equal(h.saved.at(-1)?.nextBeam, 1); });
test("failure to persist selected lead prevents editor call", async () => { const h = harness(); h.deps.save = async () => { throw new Error("DB down"); }; await assert.rejects(runRadar(h.deps)); assert.deepEqual(h.calls, ["discover"]); assert.equal(h.rows.length, 0); });
test("failed discovery leaves windows unchanged and logs no success", async () => { const h = harness(); h.deps.discover = async () => { throw new Error("temporary"); }; await runRadar(h.deps); assert.equal(h.saved.length, 0); assert.deepEqual(h.logs, [{ beam: "official", requests: 1, error: "discovery-failed", windowUnchanged: true, complete: false, added: 0 }]); });
test("response without completed search is not a successful empty discovery", async () => { const h = harness(); h.deps.discover = async () => ({ ...research({ leads: [] }), completedSearches: 0 }); await runRadar(h.deps); assert.equal(h.saved.length, 0); });
test("editor failure persists lead and next scheduled run uses only one request", async () => {
  const first = harness(); first.deps.edit = async () => { throw new Error("temporary"); }; await runRadar(first.deps);
  const pending = first.saved.at(-1)!; assert.ok(pending.pending); assert.equal(pending.windows.official, undefined); assert.equal(first.rows.length, 0);
  const next = harness(pending); const result = await runRadar(next.deps); assert.equal(result.requests, 1); assert.equal(result.added, 1); assert.ok(!next.calls.includes("discover"));
});
test("fatal discovery stops without DB state/review/success writes", async () => { const h = harness(); h.deps.discover = async () => { throw new Error("fatal"); }; await assert.rejects(runRadar(h.deps), /fatal/); assert.equal(h.saved.length + h.reviews.length + h.rows.length + h.logs.length, 0); });
test("fatal editor stops after pre-call pending persistence without followup", async () => { const h = harness(); h.deps.edit = async () => { throw new Error("fatal"); }; await assert.rejects(runRadar(h.deps), /fatal/); assert.equal(h.saved.at(-1)?.pending?.attempts, 1); assert.equal(h.reviews.length + h.rows.length + h.logs.length, 0); });
test("third failed attempt becomes durable review on later run without paying again", async () => { const s = emptyState(); s.pending = { lead, beam: "official", discoveredAt: "2026-11-21T12:00:00Z", retrievedUrls: [URL], responseId: "prior", attempts: 3 }; const h = harness(s); assert.deepEqual(await runRadar(h.deps), { added: 0, requests: 0, held: true }); assert.equal(h.reviews.length, 1); assert.equal(h.saved.at(-1)?.pending, null); });
test("review-record failure preserves pending state and cannot publish", async () => { const h = harness(); h.deps.edit = async () => { const d = draft(); d.proof.in_scope = false; return research(d); }; h.deps.review = async () => { throw new Error("review DB failed"); }; await assert.rejects(runRadar(h.deps)); assert.ok(h.saved.at(-1)?.pending); assert.equal(h.rows.length, 0); assert.equal(h.logs.length, 0); });
test("held claims never auto-publish and are suppressed on later discoveries", async () => { const h = harness(); h.deps.edit = async () => { const d = draft(); d.item.summary_en += " 999 FPS"; return research(d); }; await runRadar(h.deps); assert.equal(h.rows.length, 0); assert.equal(h.reviews.length, 1); const retry = harness(h.saved.at(-1)); await runRadar(retry.deps); assert.ok(!retry.calls.includes("edit")); assert.equal(retry.rows.length, 0); });
test("Arabic research produces topic proposal without editor/publication", async () => { const h = harness(); h.deps.pinnedBeam = "arabic-coverage"; await runRadar(h.deps); assert.ok(!h.calls.includes("edit")); assert.equal(h.reviews.length, 1); assert.equal(h.rows.length, 0); });
test("existing catalog entity is a human catalog update, never duplicate article", async () => { const h = harness(); h.deps.catalogNames = ["Test Car"]; h.deps.discover = async () => research({ leads: [{ ...lead, entity_name: "Test Car" }] }); await runRadar(h.deps); assert.equal(h.reviews.length, 1); assert.ok(!h.calls.includes("edit")); });
test("same video identity dedupes raw embed ID and alternate watch URLs", () => { const keys = knownKeys([{ slug: "a", title_en: "a", sources: [{ url: "https://youtu.be/Abcdefghi12" }], videos: ["OtherVideo1"] }]); assert.ok(keys.has("youtube:Abcdefghi12")); assert.ok(keys.has("youtube:OtherVideo1")); });
test("insert followed by checkpoint failure is recovered without another paid/editor call", async () => {
  const h = harness(); h.deps.save = async (s) => { if (!s.pending) throw new Error("state failed after insert"); h.saved.push(structuredClone(s)); }; await assert.rejects(runRadar(h.deps)); assert.equal(h.rows.length, 1);
  const retry = harness(h.saved.at(-1)); retry.deps.known = [{ slug: h.rows[0].slug as string, title_en: "Newly published title", sources: [] }]; const result = await runRadar(retry.deps); assert.equal(result.requests, 0); assert.equal(retry.rows.length, 0);
});
test("image pages require actual retrieval and remain unverified candidates", async () => { let calls = 0; const result = await imageCandidates([URL, "https://invented.example/a"], [URL], async () => { calls++; return response('<meta property="og:image" content="https://images.example/actual.jpg">'); }); assert.equal(calls, 1); assert.equal(result[0].status, "needs-visual-and-game-verification"); assert.equal(result[0].image, "https://images.example/actual.jpg"); });
test("catalog candidate fetches bounded to three and private image literals are rejected", async () => { let calls = 0; const pages = Array.from({ length: 12 }, (_, n) => URL + n); const result = await imageCandidates(pages, pages, async () => { calls++; return response('<meta property="og:image" content="https://127.0.0.1/internal">'); }); assert.equal(calls, 3); assert.ok(result.every((r) => r.image === null)); });
test("published article/image mutation is absent from enrichment and catalog entrypoints", () => { for (const file of ["scripts/enrich.ts", "scripts/catalog-images-ai.ts"]) { const code = readFileSync(file, "utf8"); assert.doesNotMatch(code, /\.update\(|writeFileSync|writeFile\(/); assert.match(code, /radar_review/); } });
test("complete known-item pagination and overflow rejection use mocked database", async () => {
  const fake = (count: number) => ({ from: () => ({ select: () => ({ order: () => ({ range: async (start: number, end: number) => ({ error: null, data: Array.from({ length: Math.max(0, Math.min(end + 1, count) - start) }, (_, i) => ({ slug: String(start + i), title_en: "", sources: [], videos: [] })) }) }) }) }) });
  assert.equal((await readKnown(fake(1101) as never)).length, 1101); await assert.rejects(readKnown(fake(20001) as never), /exceeds/);
});
test("state corruption refuses silent reset and write errors are propagated", async () => {
  const fake = { from: () => ({ select: () => ({ eq: () => ({ order: () => ({ limit: () => ({ maybeSingle: async () => ({ data: { note: "{}" }, error: null }) }) }) }) }), insert: async () => ({ error: new Error("DB failed") }) }) };
  await assert.rejects(readState(fake as never), /Invalid/); await assert.rejects(writeRecord(fake as never, "radar_state", {}), /DB failed/);
});
test("SDK request uses actual sources, one tool call, no retries, hard two-request ceiling (no network)", async () => {
  const req = createRequire(import.meta.url); const ts = req("typescript") as typeof import("typescript");
  const src = ts.transpileModule(readFileSync("scripts/lib/ai.ts", "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const requests: Record<string, unknown>[] = []; const constructors: Record<string, unknown>[] = [];
  class FakeOpenAI { responses = { create: async (opts: Record<string, unknown>) => { requests.push(opts); return { id: "offline", status: "completed", output_text: "{}", output: [{ type: "web_search_call", status: "completed", action: { type: "search", sources: [{ type: "url", url: URL }] } }], usage: { input_tokens: 1, output_tokens: 2 } }; } }; constructor(opts: Record<string, unknown>) { constructors.push(opts); } }
  const exports = {} as { askJsonWithEvidence: (opts: Record<string, unknown>) => Promise<Research<unknown>>; usageTotals: () => { requests: number } }; const sandbox = { exports, process: { env: { OPENAI_MODEL: "offline-test-model", OPENAI_API_KEY: "local-fake-not-a-key" } }, console: { log: () => {} }, require: (id: string) => { if (id === "openai") return FakeOpenAI; if (id === "./env") return { need: () => "local-fake-not-a-key" }; if (id === "../../src/lib/categories") return { CATEGORIES: [] }; if (id === "./ai-evidence") return { evidenceOf }; throw new Error(`Unexpected module ${id}`); } };
  vm.runInNewContext(src, sandbox); const opts = { prompt: "offline", schema: {}, name: "test" };
  const a = await exports.askJsonWithEvidence(opts); await exports.askJsonWithEvidence(opts); await assert.rejects(exports.askJsonWithEvidence(opts), /ceiling/);
  assert.equal(requests.length, 2); assert.equal(constructors[0].maxRetries, 0); assert.equal(requests[0].max_tool_calls, 1); assert.equal(requests[0].tool_choice, "required"); assert.equal(JSON.stringify(requests[0].include), '["web_search_call.action.sources"]'); assert.equal(a.retrievedUrls[0], URL); assert.equal(exports.usageTotals().requests, 2);
});

test("official-looking gameplay discovery still requires human visual review", async () => { const h = harness(); h.deps.pinnedBeam = "gameplay-discoveries"; await runRadar(h.deps); assert.equal(h.rows.length, 0); assert.equal(h.reviews.length, 1); });
test("incomplete editor search cannot auto-publish despite earlier retrieved lead", async () => { const h = harness(); h.deps.edit = async () => ({ ...research(draft()), completedSearches: 0 }); await runRadar(h.deps); assert.equal(h.rows.length, 0); assert.equal(h.reviews.length, 1); });
test("editor changing a fresh lead into an existing article is held", async () => { const h = harness(); h.deps.known = [{ slug: "old", title_en: "Existing article topic", sources: [] }]; h.deps.edit = async () => { const d = draft(); d.item.title_en = "Existing article topic"; return research(d); }; await runRadar(h.deps); assert.equal(h.rows.length, 0); assert.equal(h.reviews.length, 1); });

for (const tag of ["story-spoilers", "ENDING-SPOILER"]) test(`existing ${tag} tag forces story review despite false model spoiler flag`, async () => { const d = draft(); d.item.tags = [tag]; d.proof.story_spoilers = false; const result = await verifyDraft(d, [URL], async () => response()); assert.equal(result.decision, "review"); assert.ok(result.gates.includes("5:spoiler-headline-review")); assert.ok(result.item.tags.includes("story-spoilers")); });
