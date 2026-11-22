"use server";
import { revalidatePath } from "next/cache";
import { adminClient, adminConfigured, isOwner } from "@/lib/admin";
import { getViewer } from "@/lib/session";
import { itemRow, loadReview, publishable } from "@/lib/radar-review";

export type ReviewResult = { ok: true; slug?: string } | { ok: false; error: "auth" | "gone" | "invalid" | "duplicate" | "unavailable" };

async function guard(): Promise<ReturnType<typeof adminClient> | null> {
  const viewer = await getViewer();
  if (!isOwner(viewer.email) || !adminConfigured()) return null;
  return adminClient();
}

async function decide(db: ReturnType<typeof adminClient>, reviewId: number, action: "publish" | "dismiss", slug?: string) {
  const { error } = await db.from("update_runs").insert({ kind: "radar_decision", added: action === "publish" ? 1 : 0, note: JSON.stringify({ action, slug: slug ?? null, at: new Date().toISOString(), reviewId }) });
  if (error) throw error;
}

export async function publishReview(reviewId: number): Promise<ReviewResult> {
  if (!Number.isSafeInteger(reviewId) || reviewId <= 0) return { ok: false, error: "invalid" };
  try {
    const db = await guard();
    if (!db) return { ok: false, error: "auth" };
    const review = await loadReview(db, reviewId);
    if (!review) return { ok: false, error: "gone" };
    if (!publishable(review)) return { ok: false, error: "invalid" };
    const row = itemRow(review);
    const { error } = await db.from("items").insert(row);
    if (error) return { ok: false, error: error.code === "23505" ? "duplicate" : "unavailable" };
    await decide(db, reviewId, "publish", row.slug);
    revalidatePath("/admin/review");
    revalidatePath("/");
    revalidatePath(`/c/${row.category}`);
    return { ok: true, slug: row.slug };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export async function dismissReview(reviewId: number): Promise<ReviewResult> {
  if (!Number.isSafeInteger(reviewId) || reviewId <= 0) return { ok: false, error: "invalid" };
  try {
    const db = await guard();
    if (!db) return { ok: false, error: "auth" };
    const review = await loadReview(db, reviewId);
    if (!review) return { ok: false, error: "gone" };
    await decide(db, reviewId, "dismiss");
    revalidatePath("/admin/review");
    return { ok: true };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}
