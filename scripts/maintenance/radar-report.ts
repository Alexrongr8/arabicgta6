/** Read-only radar health report: what each topic found, what was rejected and why, spend so far. No personal data. */
import "../lib/env";
import { db } from "../lib/db";

async function main() {
  const database = db();
  const since = new Date(Date.now() - 48 * 3600e3).toISOString();
  const { data, error } = await database.from("update_runs").select("kind,added,note,ran_at").in("kind", ["update", "update_partial", "radar_spend", "radar_review"]).gte("ran_at", since).order("id", { ascending: false }).limit(1000);
  if (error) throw error;
  const beams: Record<string, { slots: number; leads: number; added: number; reasons: Record<string, number> }> = {};
  let usd = 0, reviews = 0; const held: string[] = [];
  for (const row of data ?? []) {
    let note: Record<string, unknown> = {};
    try { note = JSON.parse(row.note ?? "{}"); } catch { continue; }
    if (row.kind === "radar_spend") { usd += Number(note.usd) || 0; continue; }
    if (row.kind === "radar_review") { reviews++; if (held.length < 15) held.push(`${(note.reasons as string[] | undefined)?.join(",")} :: ${(note.lead as { headline?: string } | undefined)?.headline ?? ""}`.slice(0, 220)); continue; }
    const beam = String(note.beam ?? "?");
    const b = (beams[beam] ??= { slots: 0, leads: 0, added: 0, reasons: {} });
    b.slots++; b.leads += Number(note.leads) || 0; b.added += Number(note.accepted) || 0;
    for (const r of (Array.isArray(note.rejected) ? note.rejected : []) as string[]) b.reasons[r] = (b.reasons[r] ?? 0) + 1;
    if (note.error) b.reasons[String(note.error)] = (b.reasons[String(note.error)] ?? 0) + 1;
  }
  console.log(`Last 48h: est. $${usd.toFixed(2)}, held for review: ${reviews}`);
  for (const [beam, b] of Object.entries(beams).sort((a, c) => c[1].added - a[1].added)) console.log(`${beam.padEnd(22)} slots=${b.slots} leads=${b.leads} published=${b.added} ${JSON.stringify(b.reasons)}`);
  console.log("Held examples:"); for (const h of held) console.log(`  - ${h}`);
  const state = await database.from("update_runs").select("note").eq("kind", "radar_state").order("id", { ascending: false }).limit(1).maybeSingle();
  try { const s = JSON.parse(state.data?.note ?? "{}"); console.log(`State: nextBeam=${s.nextBeam} pending=${s.pending ? s.pending.lead?.headline : "none"} queue=${(s.queue ?? []).length}`); } catch { /* no state yet */ }
  const items = await database.from("items").select("status,origin,image,published_at").eq("origin", "auto").limit(2000);
  const rows = items.data ?? []; const by: Record<string, number> = {};
  for (const r of rows) by[r.status] = (by[r.status] ?? 0) + 1;
  console.log(`Automatic articles: ${rows.length} ${JSON.stringify(by)} withOwnImage=${rows.filter((r) => r.image).length} last24h=${rows.filter((r) => Date.parse(r.published_at) > Date.now() - 864e5).length}`);
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exitCode = 1; });
