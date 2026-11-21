import "server-only";
import type { User } from "@supabase/supabase-js";
import { adminClient, adminConfigured } from "./admin";

export function geoFrom(h: Headers) {
  const dec = (v: string | null) => {
    if (!v) return null;
    try {
      return decodeURIComponent(v);
    } catch {
      return v;
    }
  };
  return {
    country: h.get("x-vercel-ip-country"),
    region: dec(h.get("x-vercel-ip-country-region")),
    city: dec(h.get("x-vercel-ip-city")),
  };
}

export function deviceFrom(h: Headers): string {
  const ua = h.get("user-agent") ?? "";
  const os = /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "macOS" : /Linux/.test(ua) ? "Linux" : "Other";
  const mobile = /Mobi|iPhone|Android/.test(ua) ? "mobile" : "desktop";
  return `${os} · ${mobile}`;
}

export function isBot(h: Headers): boolean {
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|vercel/i.test(h.get("user-agent") ?? "");
}

export async function recordSignIn(user: User, h: Headers) {
  if (!adminConfigured()) return;
  const db = adminClient();
  const geo = geoFrom(h);
  const { data: existing } = await db.from("profiles").select("sign_in_count").eq("id", user.id).maybeSingle();
  await db.from("profiles").upsert({
    id: user.id,
    email: user.email,
    full_name: (user.user_metadata?.full_name as string) ?? (user.user_metadata?.name as string) ?? null,
    avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
    last_sign_in_at: new Date().toISOString(),
    sign_in_count: (existing?.sign_in_count ?? 0) + 1,
    country: geo.country,
    region: geo.region,
    city: geo.city,
    device: deviceFrom(h),
  });
}

export async function recordView(path: string, userId: string | null, referrer: string | null, h: Headers) {
  if (!adminConfigured() || isBot(h)) return;
  const geo = geoFrom(h);
  await adminClient().from("page_views").insert({
    path: path.slice(0, 200),
    user_id: userId,
    country: geo.country,
    city: geo.city,
    referrer: referrer ? referrer.slice(0, 200) : null,
    device: deviceFrom(h),
  });
}
