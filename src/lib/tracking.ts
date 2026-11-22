import "server-only";
import type { User } from "@supabase/supabase-js";
import { adminClient, adminConfigured } from "./admin";
import { profilePresentation } from "./profile-presentation";

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
    country: h.get("x-vercel-ip-country")?.slice(0, 2) ?? null,
    region: dec(h.get("x-vercel-ip-country-region"))?.slice(0, 100) ?? null,
    city: dec(h.get("x-vercel-ip-city"))?.slice(0, 100) ?? null,
  };
}

export function uaInfo(h: Headers) {
  const ua = h.get("user-agent") ?? "";
  const os = /iPhone|iPad|iPod/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X|Macintosh/.test(ua) ? "macOS" : /CrOS/.test(ua) ? "ChromeOS" : /Linux/.test(ua) ? "Linux" : "Other";
  const browser = /Snapchat/i.test(ua)
    ? "Snapchat app"
    : /Instagram/i.test(ua)
      ? "Instagram app"
      : /TikTok|musical_ly|BytedanceWebview/i.test(ua)
        ? "TikTok app"
        : /FBAN|FBAV/i.test(ua)
          ? "Facebook app"
          : /Twitter/i.test(ua)
            ? "X app"
            : /SamsungBrowser/.test(ua)
              ? "Samsung Internet"
              : /Edg\//.test(ua)
                ? "Edge"
                : /OPR\/|Opera/.test(ua)
                  ? "Opera"
                  : /Firefox|FxiOS/.test(ua)
                    ? "Firefox"
                    : /CriOS|Chrome/.test(ua)
                      ? "Chrome"
                      : /Safari/.test(ua)
                        ? "Safari"
                        : "Other";
  const device_type = /iPad|Tablet/i.test(ua) ? "tablet" : /Mobi|iPhone|Android/i.test(ua) ? "mobile" : "desktop";
  return { os, browser, device_type, device: `${os} · ${device_type}` };
}

/** Where the visit came from: in-app browser, utm_source, or referrer host. */
export function sourceOf(browser: string, utm: string | null, referrer: string | null): string {
  if (utm) return utm.toLowerCase();
  if (browser.endsWith(" app")) return browser.replace(" app", "").toLowerCase();
  if (!referrer) return "direct";
  const r = referrer.toLowerCase();
  for (const [k, v] of [
    ["snapchat", "snapchat"],
    ["instagram", "instagram"],
    ["tiktok", "tiktok"],
    ["facebook", "facebook"],
    ["t.co", "x"],
    ["twitter", "x"],
    ["x.com", "x"],
    ["google", "google"],
    ["bing", "bing"],
    ["youtube", "youtube"],
    ["reddit", "reddit"],
    ["whatsapp", "whatsapp"],
    ["telegram", "telegram"],
  ] as const)
    if (r.includes(k)) return v;
  return r;
}

export function isBot(h: Headers): boolean {
  return /bot|crawl|spider|slurp|preview|facebookexternalhit|vercel|headless/i.test(h.get("user-agent") ?? "");
}

export async function recordSignIn(user: User, h: Headers) {
  if (!adminConfigured()) return;
  const db = adminClient();
  const geo = geoFrom(h);
  const presentation = profilePresentation(user.user_metadata);
  const deadline = AbortSignal.timeout(2000);
  const { data: existing, error } = await db.from("profiles").select("sign_in_count").eq("id", user.id).abortSignal(deadline).maybeSingle();
  if (error) return;
  await db.from("profiles").upsert({
    id: user.id,
    email: user.email,
    full_name: presentation.name ?? null,
    avatar_url: presentation.avatar ?? null,
    last_sign_in_at: new Date().toISOString(),
    sign_in_count: (existing?.sign_in_count ?? 0) + 1,
    country: geo.country,
    region: geo.region,
    city: geo.city,
    device: uaInfo(h).device,
  }).abortSignal(deadline);
}

export async function recordView(
  v: { path: string; userId: string | null; referrer: string | null; visitorId: string | null; utmSource: string | null; utmCampaign: string | null; lang: string | null },
  h: Headers,
) {
  if (!adminConfigured() || isBot(h)) return;
  const geo = geoFrom(h);
  const ua = uaInfo(h);
  await adminClient()
    .from("page_views")
    .insert({
      path: v.path.slice(0, 200),
      user_id: v.userId,
      visitor_id: v.visitorId,
      country: geo.country,
      region: geo.region,
      city: geo.city,
      referrer: v.referrer ? v.referrer.slice(0, 200) : null,
      device: ua.device,
      os: ua.os,
      browser: ua.browser,
      device_type: ua.device_type,
      source: sourceOf(ua.browser, v.utmSource, v.referrer),
      utm_campaign: v.utmCampaign,
      lang: v.lang,
    })
    .abortSignal(AbortSignal.timeout(2000));
}
