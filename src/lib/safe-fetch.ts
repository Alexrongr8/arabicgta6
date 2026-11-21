import { request } from "node:https";
import { lookup as dnsLookup } from "node:dns";
import { BlockList, isIP, type LookupFunction } from "node:net";

/**
 * GET a public HTTPS resource with a hard destination boundary, for URLs we don't control
 * (article covers, source pages' og:image). Shared by the site and the radar scripts.
 *
 * - https only, port 443 only, no credentials in the URL
 * - the address the socket connects to is the one we validated (custom `lookup`, so there is no
 *   DNS-rebinding gap between the check and the connection); private, loopback, link-local,
 *   CGNAT, multicast and metadata ranges are refused
 * - redirects are followed manually (max 3) with the same checks on every hop
 * - one deadline covers the whole exchange; the body is capped while streaming
 */

const BLOCKED = new BlockList();
for (const [net, bits] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 3],
] as const)
  BLOCKED.addSubnet(net, bits, "ipv4");
// IPv6: conservative allow-list. Only global unicast 2000::/3, minus special-purpose blocks.
// Everything else (::/::1, ::a.b.c.d compat, NAT64 64:ff9b::, fec0/fc00/fe80, multicast, 5f00::…) is refused.
const GLOBAL6 = new BlockList();
GLOBAL6.addSubnet("2000::", 3, "ipv6");
const SPECIAL6 = new BlockList();
for (const [net, bits] of [
  ["2001::", 23], // IETF protocol assignments: Teredo 2001::/32, benchmarking 2001:2::/48, ORCHID 2001:10::/28, 2001:20::/28
  ["2001:db8::", 32], // documentation
  ["2002::", 16], // 6to4 (embeds arbitrary IPv4)
  ["3fff::", 20], // documentation
] as const)
  SPECIAL6.addSubnet(net, bits, "ipv6");

export function isPublicAddress(addr: string): boolean {
  const v = isIP(addr);
  if (!v) return false;
  if (v === 6) {
    // IPv4-mapped (::ffff:a.b.c.d / ::ffff:hhhh:hhhh): judge the embedded IPv4 address
    const m = addr.toLowerCase().match(/^::ffff:(?:(\d+\.\d+\.\d+\.\d+)|([0-9a-f]{1,4}):([0-9a-f]{1,4}))$/);
    if (m) {
      const v4 = m[1] ?? [parseInt(m[2], 16) >> 8, parseInt(m[2], 16) & 255, parseInt(m[3], 16) >> 8, parseInt(m[3], 16) & 255].join(".");
      return isPublicAddress(v4);
    }
  }
  if (v === 4) return !BLOCKED.check(addr, "ipv4");
  return GLOBAL6.check(addr, "ipv6") && !SPECIAL6.check(addr, "ipv6");
}

/** Pre-flight URL check (no network). */
export function checkPublicHttpsUrl(raw: string): URL | null {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" || u.username || u.password) return null;
  if (u.port && u.port !== "443") return null;
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (!host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) return null;
  if (isIP(host) && !isPublicAddress(host)) return null;
  return u;
}

const safeLookup: LookupFunction = (hostname, options, callback) => {
  dnsLookup(hostname, { ...options, all: true }, (err, addresses) => {
    if (err) return callback(err, "", 4);
    const list = (addresses as unknown as { address: string; family: number }[]).filter((a) => isPublicAddress(a.address));
    if (!list.length) return callback(Object.assign(new Error(`blocked non-public address for ${hostname}`), { code: "EBLOCKED" }), "", 4);
    if ((options as { all?: boolean }).all) return (callback as unknown as (e: null, a: typeof list) => void)(null, list);
    callback(null, list[0].address, list[0].family);
  });
};

export type SafeResult = { status: number; contentType: string; body: Buffer; finalUrl: string };

export async function safeGet(
  raw: string,
  opts: { timeoutMs?: number; maxBytes?: number; maxRedirects?: number; accept?: string; userAgent?: string } = {},
): Promise<SafeResult | null> {
  const timeoutMs = opts.timeoutMs ?? 4000;
  const maxBytes = opts.maxBytes ?? 8_000_000;
  const deadline = Date.now() + timeoutMs;
  let url = checkPublicHttpsUrl(raw);
  for (let hop = 0; url && hop <= (opts.maxRedirects ?? 3); hop++) {
    const left = deadline - Date.now();
    if (left <= 0) return null;
    const res = await once(url, left, maxBytes, opts);
    if (!res) return null;
    if (res.status >= 300 && res.status < 400 && res.location) {
      let next: string;
      try {
        next = new URL(res.location, url).toString();
      } catch {
        return null;
      }
      url = checkPublicHttpsUrl(next);
      continue;
    }
    return { status: res.status, contentType: res.contentType, body: res.body, finalUrl: url.toString() };
  }
  return null;
}

function once(
  url: URL,
  timeoutMs: number,
  maxBytes: number,
  opts: { accept?: string; userAgent?: string },
): Promise<{ status: number; contentType: string; location?: string; body: Buffer } | null> {
  return new Promise((resolve) => {
    let done = false;
    const finish = (v: { status: number; contentType: string; location?: string; body: Buffer } | null) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      resolve(v);
    };
    const req = request(
      url,
      {
        method: "GET",
        lookup: safeLookup,
        headers: { "user-agent": opts.userAgent ?? "ArabicGTA6/1.0 (+https://arabicgta6.com)", accept: opts.accept ?? "*/*" },
      },
      (res) => {
        res.on("error", () => finish(null)); // attach first: a reset mid-body must not crash the process
        const status = res.statusCode ?? 0;
        const contentType = String(res.headers["content-type"] ?? "");
        if (status >= 300 && status < 400) {
          const location = res.headers.location;
          res.destroy(); // never read a redirect body
          return finish({ status, contentType, location, body: Buffer.alloc(0) });
        }
        if (Number(res.headers["content-length"] ?? 0) > maxBytes) {
          res.destroy();
          return finish(null);
        }
        const chunks: Buffer[] = [];
        let total = 0;
        res.on("data", (c: Buffer) => {
          total += c.length;
          if (total > maxBytes) {
            res.destroy();
            return finish(null);
          }
          chunks.push(c);
        });
        res.on("end", () => finish({ status, contentType, body: Buffer.concat(chunks) }));
      },
    );
    const timer = setTimeout(() => {
      req.destroy();
      finish(null);
    }, timeoutMs);
    req.on("error", () => finish(null));
    req.end();
  });
}
