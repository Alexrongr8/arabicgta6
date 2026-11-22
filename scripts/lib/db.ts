import { createClient } from "@supabase/supabase-js";
import { need } from "./env";
import { serverFetch } from "../../src/lib/server-fetch";

export function db() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    console.error("Missing SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL");
    process.exit(1);
  }
  return createClient(url, need("SUPABASE_SERVICE_ROLE_KEY"), { global: { fetch: serverFetch }, auth: { persistSession: false, autoRefreshToken: false } });
}
