import "server-only";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { publicRead, publicReadSignal } from "@/lib/public-read";

export type Comment = { id: string; author_name: string; author_avatar: string | null; body: string; created_at: string; user_id: string };
export type Submission = {
  id: string;
  author_name: string;
  author_avatar: string | null;
  category: string;
  title: string;
  body: string;
  place: string | null;
  video_url: string | null;
  created_at: string;
  user_id: string;
};
export type Votes = { up: number; down: number; mine: 1 | -1 | 0 };

export async function getComments(target: string): Promise<Comment[]> {
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  const data = await publicRead<Comment[]>("comments", supabase.from("comments").select("id,author_name,author_avatar,body,created_at,user_id").eq("target", target)
    .order("created_at", { ascending: false }).order("id", { ascending: false }).limit(300));
  return (data ?? []).reverse(); // Show the latest bounded window in chronological order.
}

export async function getVotes(targets: string[], userId?: string): Promise<Record<string, Votes>> {
  const out: Record<string, Votes> = Object.fromEntries(targets.map((t) => [t, { up: 0, down: 0, mine: 0 as const }]));
  if (!supabaseConfigured() || !targets.length) return out;
  const supabase = await createClient();
  const signal = publicReadSignal();
  const [totals, mine] = await Promise.all([
    publicRead<{ target: string; up: number; down: number }[]>("vote totals", supabase.rpc("vote_totals", { p_targets: targets }), signal),
    userId ? publicRead<{ target: string; value: 1 | -1 }[]>("own votes", supabase.from("votes").select("target,value").in("target", targets).eq("user_id", userId), signal) : Promise.resolve([]),
  ]);
  for (const r of (totals ?? []) as { target: string; up: number; down: number }[]) out[r.target] = { ...out[r.target], up: Number(r.up), down: Number(r.down) };
  for (const r of (mine ?? []) as { target: string; value: 1 | -1 }[]) out[r.target] = { ...out[r.target], mine: r.value };
  return out;
}

export async function getSubmissions(limit = 100): Promise<Submission[]> {
  if (!supabaseConfigured()) return [];
  const supabase = await createClient();
  const data = await publicRead<Submission[]>("submissions", supabase.from("submissions").select("id,author_name,author_avatar,category,title,body,place,video_url,created_at,user_id").order("created_at", { ascending: false }).limit(limit));
  return (data ?? []) as Submission[];
}
