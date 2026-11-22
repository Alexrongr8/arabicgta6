"use server";
import { revalidatePath } from "next/cache";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { adminClient, adminConfigured, isOwner } from "@/lib/admin";
import { CATEGORIES } from "@/lib/categories";
import { profilePresentation } from "@/lib/profile-presentation";
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
  if (error.code === "22023" || error.code === "22P02" || error.code?.startsWith("23")) throw new ActionFailure("invalid");
  console.error("community write failed", String(error.code ?? "").slice(0, 10), String(error.message ?? "").slice(0, 120));
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
    // Database (add_comment RPC + trigger) stamps author, verifies the target and enforces the quota atomically.
    const { data, error } = await m.supabase.rpc("add_comment", { p_target: target, p_body: text });
    checked(error);
    if (typeof data !== "string" || !data) throw new ActionFailure("unavailable");
    refreshTarget(parsed);
  });
}

export async function vote(target: string, value: 1 | -1 | 0, path: string): Promise<Result> {
  return perform(async () => {
    const parsed = targetFor(target, path);
    if (value !== -1 && value !== 0 && value !== 1) throw new ActionFailure("invalid");
    const m = await me();
    const { error } = await m.supabase.rpc("set_vote", { p_target: target, p_value: value });
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
    const { data, error } = await m.supabase.rpc("submit_discovery", { p_title: title, p_body: body, p_category: category, p_place: place, p_video_url: video_url ?? null });
    checked(error);
    if (typeof data !== "string" || !data) throw new ActionFailure("unavailable");
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
