import type { Metadata } from "next";
import type { Locale } from "./types";
import { t } from "./i18n";

/** Use the page's base URL, never query filters, focus markers or campaign parameters. */
export function publicMetadata(path: string, locale: Locale, copy: { title: string; description?: string }): Metadata {
  const description = copy.description ?? t(locale, "tagline");
  // A nested openGraph object replaces inherited fields, including the layout's image.
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: "Arabic GTA 6" };
  return {
    title: copy.title,
    description,
    alternates: { canonical: path },
    openGraph: { title: copy.title, description, type: "website", url: path, siteName: "Arabic GTA 6", locale: locale === "ar" ? "ar_SA" : "en_US", images: [image] },
    twitter: { card: "summary_large_image", title: copy.title, description, images: [image.url] },
  };
}
