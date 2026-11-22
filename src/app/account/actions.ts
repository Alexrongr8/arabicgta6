"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";
import { digestEnabled } from "@/lib/digest-config";

export async function setDigest(optIn: boolean) {
  if (typeof optIn !== "boolean") redirect("/account?digest=failed");
  if (optIn && !digestEnabled()) redirect("/account?digest=paused");
  if (!supabaseConfigured()) redirect("/account?digest=failed");
  let ok = false;
  let needsLogin = false;
  try {
    const supabase = await createClient();
    const { data, error: authError } = await supabase.auth.getUser();
    if (authError || !data.user) {
      needsLogin = true;
    } else {
    const { data: updated, error } = await supabase.from("profiles").update({ digest_opt_in: optIn }).eq("id", data.user.id)
      .select("id").abortSignal(AbortSignal.timeout(4000)).maybeSingle();
    ok = !error && Boolean(updated);
    }
  } catch { /* Keep the preference visibly unchanged on failure. */ }
  if (needsLogin) redirect("/login?next=%2Faccount");
  if (!ok) redirect("/account?digest=failed");
  revalidatePath("/account");
  redirect("/account");
}
