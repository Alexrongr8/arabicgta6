import type { MetadataRoute } from "next";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arabicgta6.com";

export default function robots(): MetadataRoute.Robots {
  // Account/admin/login/community remain crawlable so their noindex directives can be read.
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/auth/", "/random"] }], sitemap: `${SITE}/sitemap.xml` };
}
