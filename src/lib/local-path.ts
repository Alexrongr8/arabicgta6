/** Only accept an on-site return path; never turn sign-in into an external redirect. */
export function localPath(value: unknown, fallback = "/"): string {
  if (typeof value !== "string" || value.length > 2048 || !value.startsWith("/")
    || value.startsWith("//") || /[\\\u0000-\u0020\u007f]/.test(value)) return fallback;
  try {
    const url = new URL(value, "https://local.invalid");
    return url.origin === "https://local.invalid" && !url.pathname.startsWith("//")
      ? `${url.pathname}${url.search}${url.hash}` : fallback;
  } catch {
    return fallback;
  }
}
