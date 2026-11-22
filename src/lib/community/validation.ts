/** Action arguments and stored external links are untrusted, even with typed callers. */
export const COMMUNITY_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function communityTarget(value: unknown) {
  if (typeof value !== "string" || value.length > 256) return null;
  const item = value.match(/^item:([A-Za-z0-9_-]+)$/);
  if (item) return { table: "items" as const, column: "slug" as const, id: item[1], path: `/item/${item[1]}` };
  if (value.startsWith("sub:") && COMMUNITY_ID.test(value.slice(4))) {
    const id = value.slice(4);
    return { table: "submissions" as const, column: "id" as const, id, path: `/community/${id}` };
  }
  return null;
}

export function communityVideo(value: unknown): string | null {
  if (typeof value !== "string" || !value || value.length > 300 || /[\s\u0000-\u001f\u007f]/.test(value)) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    return url.protocol === "https:" && !url.username && !url.password && !url.port && url.href.length <= 300
      && ["youtube.com", "youtu.be", "tiktok.com", "instagram.com", "x.com", "twitter.com", "streamable.com"].includes(host)
      ? url.href : null;
  } catch {
    return null;
  }
}
