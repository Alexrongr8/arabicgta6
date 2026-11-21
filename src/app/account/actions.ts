"use server";
import { revalidatePath } from "next/cache";
import { createClient, supabaseConfigured } from "@/lib/supabase/server";

export async function setDigest(optIn: boolean) {
  if (!supabaseConfigured()) return;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return;
  await supabase.from("profiles").update({ digest_opt_in: optIn }).eq("id", data.user.id);
  revalidatePath("/account");
}
