import "server-only";
import { createClient } from "@supabase/supabase-js";
import { serverFetch } from "./server-fetch";

/** Owner emails come from the OWNER_EMAILS env var (comma separated). Never hard-code them. */
export function isOwner(email?: string | null): boolean {
  if (!email) return false;
  const owners = (process.env.OWNER_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return owners.includes(email.toLowerCase());
}

export function adminConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/** Service-role client: bypasses RLS. Server only. */
export function adminClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    global: { fetch: serverFetch },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
