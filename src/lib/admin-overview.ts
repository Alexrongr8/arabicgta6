import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { publicRead, publicReadSignal, PublicReadError } from "./public-read";

export type AdminProfile = {
  id: string; email: string | null; full_name: string | null; avatar_url: string | null;
  country: string | null; region: string | null; city: string | null; device: string | null;
  sign_in_count: number; last_sign_in_at: string | null; created_at: string; digest_opt_in: boolean;
};
export type AdminView = {
  id: number; path: string; country: string | null; region: string | null; city: string | null;
  device: string | null; device_type: string | null; os: string | null; browser: string | null;
  source: string | null; utm_campaign: string | null; referrer: string | null; user_id: string | null;
  visitor_id: string | null; lang: string | null; created_at: string;
};
type AdminRun = { id: number; kind: string; ran_at: string; added: number; note: string | null };
type Page<T> = { rows: T[]; total: number | null };
type Bounded<T> = { rows: T[]; total: number; truncated: boolean };
const PROFILE_COLUMNS = "id,email,full_name,avatar_url,country,region,city,device,sign_in_count,last_sign_in_at,created_at,digest_opt_in";
const VIEW_COLUMNS = "id,path,country,region,city,device,device_type,os,browser,source,utm_campaign,referrer,user_id,visitor_id,lang,created_at";

/** Count-aware pagination handles API row caps below the requested page size too. */
export async function boundedAdminRows<T>(operation: string, cap: number,
  fetchPage: (offset: number, size: number, first: boolean, signal: AbortSignal) => Promise<Page<T>>,
  signal: AbortSignal): Promise<Bounded<T>> {
  const rows: T[] = []; let total = 0;
  for (let page = 0; page < 40; page++) {
    if (signal.aborted) throw new PublicReadError(operation);
    const size = Math.min(500, cap - rows.length);
    const result = await fetchPage(rows.length, size, page === 0, signal);
    if (page === 0) {
      if (!Number.isSafeInteger(result.total) || result.total === null || result.total < 0) throw new PublicReadError(operation);
      total = result.total;
    }
    if (!Array.isArray(result.rows) || result.rows.length > size) throw new PublicReadError(operation);
    rows.push(...result.rows);
    if (rows.length > total) throw new PublicReadError(operation);
    if (rows.length >= Math.min(cap, total)) return { rows, total, truncated: total > cap };
    if (!result.rows.length) throw new PublicReadError(operation); // never present a vanished/incomplete page as complete
  }
  throw new PublicReadError(operation); // bounds requests even under an unexpectedly tiny server row cap
}

/** Caller must authorize the owner before creating/passing this service client. Never exports data. */
export async function loadAdminOverview(db: SupabaseClient, now = new Date()) {
  const signal = publicReadSignal(8000); // one deadline across every table/page, not8s per page
  const at = now.toISOString(), since = new Date(now.getTime() - 30 * 864e5).toISOString();
  const profiles = boundedAdminRows<AdminProfile>("admin.profiles", 5000, async (offset, size, first, shared) => {
    const result = await publicRead<Page<AdminProfile>>("admin.profiles", async (s) => {
      const { data, count, error } = await db.from("profiles").select(PROFILE_COLUMNS, first ? { count: "exact" } : {})
        .lt("created_at", at).order("id", { ascending: true }).range(offset, offset + size - 1).abortSignal(s);
      return { data: { rows: (data ?? []) as AdminProfile[], total: count }, error };
    }, shared);
    if (!result) throw new PublicReadError("admin.profiles");
    return result;
  }, signal);
  const views = boundedAdminRows<AdminView>("admin.views", 10000, async (offset, size, first, shared) => {
    const result = await publicRead<Page<AdminView>>("admin.views", async (s) => {
      const { data, count, error } = await db.from("page_views").select(VIEW_COLUMNS, first ? { count: "exact" } : {})
        .gte("created_at", since).lt("created_at", at).order("created_at", { ascending: false }).order("id", { ascending: false })
        .range(offset, offset + size - 1).abortSignal(s);
      return { data: { rows: (data ?? []) as AdminView[], total: count }, error };
    }, shared);
    if (!result) throw new PublicReadError("admin.views");
    return result;
  }, signal);
  const runs = publicRead<AdminRun[]>("admin.runs", db.from("update_runs").select("id,kind,ran_at,added,note").order("ran_at", { ascending: false }).order("id", { ascending: false }).limit(8), signal);
  const [profileResult, viewResult, runResult] = await Promise.all([profiles, views, runs]);
  profileResult.rows.sort((a, b) => (b.last_sign_in_at ?? "").localeCompare(a.last_sign_in_at ?? ""));
  return { profiles: profileResult, views: viewResult, runs: runResult ?? [] };
}
