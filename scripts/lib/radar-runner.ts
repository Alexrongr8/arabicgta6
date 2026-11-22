import { createHash } from "node:crypto";
import { checkPublicHttpsUrl } from "../../src/lib/safe-fetch";
import { searchText, slugify } from "../../src/lib/normalize";
import { urlKey } from "./url-key";
import { BEAMS, chooseBeam, finishState, knownKeys, similar, sinceFor, existingEntity, verifyDraft, type State, type Known, type Lead, type Research, type Draft, type SourceReader, type BeamId } from "./radar-policy";

type Review = { key: string; kind: "article" | "topic" | "catalog-update"; reasons: string[]; lead: Lead; draft?: Draft; evidence?: unknown };
export type RadarDeps = {
  state: State; known: Known[]; catalogNames: string[]; now: Date; pinnedBeam?: BeamId;
  discover: (beam: typeof BEAMS[number], since: string, knownTitles: string[]) => Promise<Research<{ leads: Lead[] }>>;
  edit: (lead: Lead, beam: BeamId) => Promise<Research<Draft>>;
  readSource: SourceReader;
  save: (state: State) => Promise<void>; review: (record: Review) => Promise<void>;
  insert: (row: Record<string, unknown>) => Promise<boolean>;
  log: (record: Record<string, unknown>, complete: boolean, added: number) => Promise<void>;
  isFatal: (e: unknown) => boolean;
};
const leadSlug = (l: Lead) => `${slugify(l.headline).slice(0, 100) || "gta6-update"}-${createHash("sha256").update(urlKey(l.url)).digest("hex").slice(0, 10)}`;
/** One discovery plus at most one editor; retries consume one later scheduled run, never a loop. */
export async function runRadar(d: RadarDeps): Promise<{ added: number; requests: number; held: boolean }> {
  let state = structuredClone(d.state); const beam = chooseBeam(state, d.pinnedBeam);
  const now = d.now.toISOString(); let requests = 0; let leads = 0; const rejected: string[] = [];
  const keys = knownKeys(d.known);
  const finish = async (added: number, held: boolean, key?: string) => {
    state = finishState(state, beam.id, state.pending?.discoveredAt ?? now, key);
    await d.save(state); // authoritative per-beam checkpoint; no success log before durable state
    await d.log({ beam: beam.id, requests, leads, accepted: added, rejected, held, pending: false }, true, added);
    return { added, requests, held };
  };
  if (state.pending && (keys.has(urlKey(state.pending.lead.url)) || d.known.some((k) => k.slug === leadSlug(state.pending!.lead)))) return finish(0, false);
  if (!state.pending) {
    let r: Research<{ leads: Lead[] }>;
    try {
      requests++;
      r = await d.discover(beam, sinceFor(state, beam.id, d.now), d.known.map((k) => k.title_en));
      if (!r.completedSearches) throw new Error("No completed web-search output; discovery is not successful.");
    } catch (e) {
      if (d.isFatal(e)) throw e; // no state/log writes and no further paid work after fatal error
      await d.log({ beam: beam.id, requests, error: "discovery-failed", windowUnchanged: true }, false, 0);
      return { added: 0, requests, held: true };
    }
    leads = Array.isArray(r.data.leads) ? r.data.leads.length : 0;
    const retrieved = new Set(r.retrievedUrls.map(urlKey)); const fresh: Lead[] = [];
    for (const l of (Array.isArray(r.data.leads) ? r.data.leads : []).slice(0, 8)) {
      if (!l || typeof l.url !== "string" || typeof l.headline !== "string" || typeof l.gist !== "string" || l.headline.length > 240 || l.gist.length > 1200 || l.url.length > 2048 || !checkPublicHttpsUrl(l.url) || !retrieved.has(urlKey(l.url))) { rejected.push("1:unretrieved-lead"); continue; }
      const key = urlKey(l.url);
      if (l.confidence === "low" || keys.has(key) || state.reviewedKeys.includes(key) || d.known.some((k) => similar(k.title_en, l.headline) >= .75) || fresh.some((k) => similar(k.headline, l.headline) >= .7)) { rejected.push("duplicate-or-low-confidence"); continue; }
      fresh.push(l);
    }
    if (!fresh.length) return finish(0, false);
    const lead = fresh[0]; const key = urlKey(lead.url);
    if (beam.id === "arabic-coverage" || existingEntity(lead, d.catalogNames)) {
      await d.review({ key, kind: beam.id === "arabic-coverage" ? "topic" : "catalog-update", reasons: [beam.id === "arabic-coverage" ? "topic-only-beam" : "existing-catalog-entity"], lead });
      return finish(0, true, key);
    }
    state.pending = { lead, beam: beam.id, discoveredAt: now, retrievedUrls: [lead.url], responseId: r.responseId, attempts: 0 };
    await d.save(state); // selected lead survives a process failure before/during the editor call
  }
  const pending = state.pending!; const key = urlKey(pending.lead.url);
  if (pending.attempts >= 3) {
    await d.review({ key, kind: "article", reasons: ["editor-attempt-cap"], lead: pending.lead });
    return finish(0, true, key);
  }
  pending.attempts++;
  await d.save(state); // count the attempt before paying; never retry it within this run
  let researched: Research<Draft>;
  try { requests++; researched = await d.edit(pending.lead, pending.beam); }
  catch (e) {
    if (d.isFatal(e)) throw e;
    await d.log({ beam: beam.id, requests, error: "editor-failed", pending: true, attempts: pending.attempts, windowUnchanged: true }, false, 0);
    return { added: 0, requests, held: true };
  }
  const draft = researched.data;
  draft.item.sources = [{ title: pending.lead.headline, url: pending.lead.url }, ...(draft.item.sources ?? [])];
  const gated = await verifyDraft(draft, [...pending.retrievedUrls, ...researched.retrievedUrls], d.readSource);
  if (!researched.completedSearches) { gated.gates.push("1:editor-search-incomplete"); gated.decision = "review"; }
  if (pending.beam === "gameplay-discoveries" || pending.beam === "community-creators") {
    gated.gates.push("4:gameplay-or-creator-evidence-needs-human-review"); gated.decision = "review";
  }
  if (gated.item.sources.some((source) => { const sourceKey = urlKey(source.url); return sourceKey.startsWith("youtube:") && keys.has(sourceKey); }) || d.known.some((known) => similar(known.title_en, gated.item.title_en) >= .75)) {
    gated.gates.push("duplicate:published-title-or-video"); gated.decision = "review";
  }
  if (gated.decision === "review") {
    await d.review({ key, kind: "article", reasons: gated.gates, lead: pending.lead, draft: { ...draft, item: gated.item }, evidence: { sourceChecks: gated.sourceChecks, responseId: researched.responseId } });
    rejected.push(...gated.gates); return finish(0, true, key);
  }
  const item = gated.item;
  // Category fallback is deliberate: fetching an og:image is not a visual identity check.
  const row = { slug: leadSlug(pending.lead), category: item.category, status: item.status,
    title_en: item.title_en.trim(), title_ar: item.title_ar.trim(), summary_en: item.summary_en.trim(), summary_ar: item.summary_ar.trim(), body_en: item.body_en.trim(), body_ar: item.body_ar.trim(),
    aliases: item.aliases.slice(0, 15), tags: [...new Set([...item.tags.slice(0, 8), `via:${beam.id}`])], facts: item.facts.slice(0, 10), location: null, region: item.region,
    related: item.related.filter((s) => d.known.some((k) => k.slug === s)).slice(0, 8), sources: item.sources, image: null,
    published_at: item.event_date && Number.isFinite(Date.parse(item.event_date)) && Date.parse(item.event_date) <= d.now.getTime() ? new Date(item.event_date).toISOString() : now, origin: "auto" };
  const inserted = await d.insert({ ...row, search_text: searchText(row) });
  return finish(inserted ? 1 : 0, false);
}
