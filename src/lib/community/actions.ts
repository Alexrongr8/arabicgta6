"use server";
import { revalidatePath } from "next/cache";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { adminClient, adminConfigured, isOwner } from "@/lib/admin";
import { CATEGORIES } from "@/lib/categories";
import { profilePresentation } from "@/lib/profile-presentation";
import { publicRead } from "@/lib/public-read";
import { COMMUNITY_ID, communityTarget, communityVideo } from "./validation";

type Failure = "auth" | "invalid" | "limit" | "offline" | "unavailable";
type Result = { ok: true } | { ok: false; error: Failure };
class ActionFailure extends Error {
  constructor(readonly code: Failure) { super(code); }
}

async function perform(run: () => Promise<void>): Promise<Result> {
  try {
    if (!supabaseConfigured()) throw new ActionFailure("offline");
    await run();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof ActionFailure ? error.code : "unavailable" };
  }
}

function checked(error: { code?: string; message?: string } | null) {
  if (!error) return;
  if (error.code === "P0001" && error.message === "community_limit") throw new ActionFailure("limit");
  if (error.code === "28000") throw new ActionFailure("auth");
  if (["22023", "22P02", "23503", "23514"].includes(error.code ?? "")) throw new ActionFailure("invalid");
  throw new ActionFailure("unavailable");
}

async function me() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw new ActionFailure(error.name === "AuthSessionMissingError" || error.status === 401 || error.status === 403 ? "auth" : "unavailable");
  }
  if (!data.user) throw new ActionFailure("auth");
  const profile = profilePresentation(data.user.user_metadata);
  return { supabase, user: data.user, name: profile.name?.split(/\s+/)[0] || "Player", avatar: profile.avatar ?? null };
}

function targetFor(target: unknown, path: unknown) {
  const parsed = communityTarget(target);
  if (!parsed || (path !== parsed.path && !(parsed.table === "submissions" && path === "/community"))) {
    throw new ActionFailure("invalid");
  }
  return parsed;
}

async function requireTarget(supabase: Awaited<ReturnType<typeof createClient>>, target: NonNullable<ReturnType<typeof communityTarget>>) {
  const row = await publicRead("community target", (signal) => supabase.from(target.table).select(target.column)
    .eq(target.column, target.id).abortSignal(signal).maybeSingle());
  if (!row) throw new ActionFailure("invalid");
}

async function checkAllowance(m: Awaited<ReturnType<typeof me>>, table: "comments" | "submissions", limit: number) {
  const since = new Date(Date.now() - 864e5).toISOString();
  const { count, error } = await m.supabase.from(table).select("id", { count: "exact", head: true }).eq("user_id", m.user.id).gte("created_at", since);
  checked(error);
  if (count === null || !Number.isInteger(count) || count < 0) throw new ActionFailure("unavailable");
  if (count >= limit) throw new ActionFailure("limit");
}

function refreshTarget(target: NonNullable<ReturnType<typeof communityTarget>>) {
  revalidatePath(target.path);
  if (target.table === "submissions") revalidatePath("/community");
}

const LINK = /(https?:\/\/|www\.)/i;

export async function addComment(target: string, body: string, path: string): Promise<Result> {
  return perform(async () => {
    const parsed = targetFor(target, path);
    if (typeof body !== "string") throw new ActionFailure("invalid");
    const text = body.trim();
    if (text.length < 2 || text.length > 1500 || LINK.test(text)) throw new ActionFailure("invalid");
    const m = await me();
    await requireTarget(m.supabase, parsed);
    await checkAllowance(m, "comments", 40);
    const { error } = await m.supabase.from("comments").insert({ target, user_id: m.user.id, author_name: m.name, author_avatar: m.avatar, body: text });
    checked(error);
    refreshTarget(parsed);
  });
}

export async function vote(target: string, value: 1 | -1 | 0, path: string): Promise<Result> {
  return perform(async () => {
    const parsed = targetFor(target, path);
    if (value !== -1 && value !== 0 && value !== 1) throw new ActionFailure("invalid");
    const m = await me();
    await requireTarget(m.supabase, parsed);
    const { error } = value === 0
      ? await m.supabase.from("votes").delete().eq("target", target).eq("user_id", m.user.id)
      : await m.supabase.from("votes").upsert({ target, user_id: m.user.id, value });
    checked(error);
    refreshTarget(parsed);
  });
}

export async function submitDiscovery(form: FormData): Promise<Result> {
  return perform(async () => {
    if (!(form instanceof FormData)) throw new ActionFailure("invalid");
    const field = (name: string) => {
      const value = form.get(name);
      if (value === null) return "";
      if (typeof value !== "string") throw new ActionFailure("invalid");
      return value.trim();
    };
    const title = field("title"), body = field("body"), place = field("place") || null;
    const video = field("video"), category = field("category") || "secrets";
    if (title.length < 5 || title.length > 140 || body.length < 20 || body.length > 4000 || (place?.length ?? 0) > 120) throw new ActionFailure("invalid");
    if (!CATEGORIES.some((c) => c.slug === category)) throw new ActionFailure("invalid");
    const video_url = communityVideo(video);
    if (video && !video_url) throw new ActionFailure("invalid");
    const m = await me();
    await checkAllowance(m, "submissions", 5);
    const { error } = await m.supabase.from("submissions")
      .insert({ user_id: m.user.id, author_name: m.name, author_avatar: m.avatar, title, body, place, video_url, category });
    checked(error);
    revalidatePath("/community");
  });
}

/** Owner-only moderation; service-role writes still require a fresh authenticated owner. */
export async function hideContent(kind: "comment" | "submission", id: string): Promise<Result> {
  return perform(async () => {
    if ((kind !== "comment" && kind !== "submission") || typeof id !== "string" || !COMMUNITY_ID.test(id)) throw new ActionFailure("invalid");
    const m = await me();
    if (!isOwner(m.user.email)) throw new ActionFailure("auth");
    if (!adminConfigured()) throw new ActionFailure("unavailable");
    const { data, error } = await adminClient().from(kind === "comment" ? "comments" : "submissions")
      .update({ hidden: true }).eq("id", id).select(kind === "comment" ? "id,target" : "id").maybeSingle();
    checked(error);
    if (!data) throw new ActionFailure("invalid");
    const target = kind === "comment" && "target" in data ? communityTarget(data.target) : communityTarget(`sub:${id}`);
    if (target) refreshTarget(target);
    revalidatePath("/community");
    revalidatePath("/admin");
  });
}
