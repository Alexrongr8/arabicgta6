import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "./i18n";
import type { Locale } from "./types";
import { createClient, supabaseConfigured } from "./supabase/server";

export const getLocale = cache(async (): Promise<Locale> => {
  const c = (await cookies()).get(LOCALE_COOKIE)?.value;
  return c === "en" ? "en" : "ar";
});

export interface Viewer {
  /** Content access. The whole site is open to everyone, so this is always true. */
  member: boolean;
  /** true when signed in with Google (gets the weekly digest) */
  signedIn: boolean;
  /** true when running without Supabase (local preview with seed data) */
  demo: boolean;
  id?: string;
  email?: string;
  name?: string;
  avatar?: string;
}

export const getViewer = cache(async (): Promise<Viewer> => {
  if (!supabaseConfigured()) return { member: true, signedIn: false, demo: true };
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const u = data.user;
  if (!u) return { member: true, signedIn: false, demo: false };
  return {
    member: true,
    signedIn: true,
    demo: false,
    id: u.id,
    email: u.email ?? undefined,
    name: (u.user_metadata?.full_name as string) ?? (u.user_metadata?.name as string) ?? undefined,
    avatar: (u.user_metadata?.avatar_url as string) ?? undefined,
  };
});
