"use server";
import { revalidatePath } from "next/cache";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { adminClient, adminConfigured, isOwner } from "@/lib/admin";
import { CATEGORIES } from "@/lib/categories";

type Result = { ok: true } | { ok: false; error: "auth" | "invalid" | "limit" | "offline" };

async function me() {
  if (!supabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const u = data.user;
  const name = ((u.user_metadata?.full_name as string) ?? (u.user_metadata?.name as string) ?? u.email?.split("@")[0] ?? "Player").split(" ")[0];
  return { supabase, user: u, name, avatar: (u.user_metadata?.avatar_url as string) ?? null };
}

const LINK = /(https?:\/\/|www\.)/i;

export async function addComment(target: string, body: string, path: string): Promise<Result> {
  if (!supabaseConfigured()) return { ok: false, error: "offline" };
  const m = await me();
  if (!m) return { ok: false, error: "auth" };
  const text = body.trim();
  if (text.length < 2 || text.length > 1500 || !/^(item|sub):[\w-]+$/.test(target)) return { ok: false, error: "invalid" };
  if (LINK.test(text)) return { ok: false, error: "invalid" }; // no links in comments (spam)
  const since = new Date(Date.now() - 864e5).toISOString();
  const { count } = await m.supabase.from("comments").select("id", { count: "exact", head: true }).eq("user_id", m.user.id).gte("created_at", since);
  if ((count ?? 0) >= 40) return { ok: false, error: "limit" };
  const { error } = await m.supabase.from("comments").insert({ target, user_id: m.user.id, author_name: m.name, author_avatar: m.avatar, body: text });
  if (error) return { ok: false, error: "invalid" };
  revalidatePath(path);
  return { ok: true };
}

export async function vote(target: string, value: 1 | -1 | 0, path: string): Promise<Result> {
  if (!supabaseConfigured()) return { ok: false, error: "offline" };
  const m = await me();
  if (!m) return { ok: false, error: "auth" };
  if (!/^(item|sub):[\w-]+$/.test(target)) return { ok: false, error: "invalid" };
  if (value === 0) await m.supabase.from("votes").delete().eq("target", target).eq("user_id", m.user.id);
  else await m.supabase.from("votes").upsert({ target, user_id: m.user.id, value });
  revalidatePath(path);
  return { ok: true };
}

export async function submitDiscovery(form: FormData): Promise<Result> {
  if (!supabaseConfigured()) return { ok: false, error: "offline" };
  const m = await me();
  if (!m) return { ok: false, error: "auth" };
  const title = String(form.get("title") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const place = String(form.get("place") ?? "").trim().slice(0, 120) || null;
  const video = String(form.get("video") ?? "").trim();
  const category = String(form.get("category") ?? "secrets");
  if (title.length < 5 || title.length > 140 || body.length < 20 || body.length > 4000) return { ok: false, error: "invalid" };
  if (!CATEGORIES.some((c) => c.slug === category)) return { ok: false, error: "invalid" };
  const video_url = /^https:\/\/(www\.)?(youtube\.com|youtu\.be|tiktok\.com|instagram\.com|x\.com|twitter\.com|streamable\.com)\//.test(video) ? video.slice(0, 300) : null;
  const since = new Date(Date.now() - 864e5).toISOString();
  const { count } = await m.supabase.from("submissions").select("id", { count: "exact", head: true }).eq("user_id", m.user.id).gte("created_at", since);
  if ((count ?? 0) >= 5) return { ok: false, error: "limit" };
  const { error } = await m.supabase
    .from("submissions")
    .insert({ user_id: m.user.id, author_name: m.name, author_avatar: m.avatar, title, body, place, video_url, category });
  if (error) return { ok: false, error: "invalid" };
  revalidatePath("/community");
  return { ok: true };
}

/** Owner-only moderation (from /admin or inline). */
export async function hideContent(kind: "comment" | "submission", id: string): Promise<Result> {
  const m = await me();
  if (!m || !isOwner(m.user.email) || !adminConfigured()) return { ok: false, error: "auth" };
  await adminClient().from(kind === "comment" ? "comments" : "submissions").update({ hidden: true }).eq("id", id);
  revalidatePath("/community");
  revalidatePath("/admin");
  return { ok: true };
}

/** Form-action wrapper for the admin page. */
export async function hideContentForm(kind: "comment" | "submission", id: string): Promise<void> {
  await hideContent(kind, id);
}
