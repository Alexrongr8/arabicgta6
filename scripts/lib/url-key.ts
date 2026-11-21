/**
 * Identity key for a source URL, used for de-duplication (docs/RADAR-POLICY.md §5.1).
 * Keeps what identifies the content (YouTube video id, tweet id, Reddit post id, other query
 * parameters) and drops only tracking noise, fragments, "www." and trailing slashes.
 */
// Conservative: only parameters that are tracking everywhere. Ambiguous keys (s, t, ref, context…)
// are kept for generic sites because they can identify content (?s=search, ?t=topic).
const TRACKING = /^(utm_[a-z_]+|fbclid|gclid|dclid|msclkid|igshid|mc_cid|mc_eid|_hsenc|_hsmi)$/i;

export function urlKey(raw: string): string {
  let u: URL;
  try {
    u = new URL(raw.trim());
  } catch {
    return raw.trim().toLowerCase();
  }
  const host = u.hostname.toLowerCase().replace(/^(www|m|mobile)\./, "");
  const path = u.pathname.replace(/\/+$/, "");

  // YouTube: every form of the same video → youtube:<id>
  if (host === "youtu.be") return `youtube:${path.slice(1).split("/")[0]}`;
  if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "music.youtube.com") {
    const v = u.searchParams.get("v");
    if (v) return `youtube:${v}`;
    const m = path.match(/^\/(?:shorts|embed|live|v)\/([\w-]{6,})/);
    if (m) return `youtube:${m[1]}`;
  }
  // X / Twitter status → x:<id>
  if (host === "x.com" || host === "twitter.com") {
    const m = path.match(/\/status(?:es)?\/(\d+)/);
    if (m) return `x:${m[1]}`;
  }
  // Reddit post → reddit:<id>
  if (host === "reddit.com" || host.endsWith(".reddit.com") || host === "redd.it") {
    const m = path.match(/\/comments\/([a-z0-9]+)/i) ?? (host === "redd.it" ? path.match(/^\/([a-z0-9]+)/i) : null);
    if (m) return `reddit:${m[1].toLowerCase()}`;
  }

  const params = [...u.searchParams.entries()].filter(([k]) => !TRACKING.test(k)).sort(([a], [b]) => a.localeCompare(b));
  const query = params.length ? `?${new URLSearchParams(params).toString()}` : "";
  return `${host}${path}${query}`;
}
