import type { Metadata, Viewport } from "next";
import { Anton, Cairo } from "next/font/google";
import "./globals.css";
import { getLocale, getViewer } from "@/lib/session";
import { t } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/Nav";
import { Tracker } from "@/components/Tracker";
import { TipOfVisit } from "@/components/TipOfVisit";
import { getTipCards } from "@/lib/data";
import { Analytics } from "@vercel/analytics/next";

const cairo = Cairo({ variable: "--font-cairo", subsets: ["arabic", "latin"], weight: ["400", "600", "700", "900"] });
const anton = Anton({ variable: "--font-anton", subsets: ["latin"], weight: "400" });

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: { default: `${t(locale, "siteName")} — ${locale === "ar" ? "أسرار وأخبار وخريطة" : "secrets, news & map"}`, template: `%s · ${t(locale, "siteName")}` },
    description: t(locale, "tagline"),
    applicationName: "Arabic GTA 6",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://arabicgta6.com"),
    openGraph: { title: "Arabic GTA 6", description: t(locale, "tagline"), type: "website" },
  };
}

export const viewport: Viewport = {
  themeColor: "#0b0613",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [locale, viewer, tips] = await Promise.all([getLocale(), getViewer(), getTipCards()]);
  const labels = { home: t(locale, "home"), explore: t(locale, "explore"), map: t(locale, "map"), search: t(locale, "search"), account: t(locale, "account") };
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`${cairo.variable} ${anton.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <Header locale={locale} viewer={viewer} labels={labels} />
        {viewer.demo && (
          <div className="bg-sun/10 border-b border-sun/20 px-4 py-1.5 text-center text-[11px] text-sun">{t(locale, "demoMode")}</div>
        )}
        <div className="flex-1 pb-24 md:pb-10">{children}</div>
        <footer className="hidden border-t border-line px-4 py-6 text-center text-xs text-dim md:block">
          {t(locale, "disclaimer")} · {t(locale, "autoUpdate")}
        </footer>
        <BottomNav labels={labels} />
        <Tracker />
        <TipOfVisit tips={tips} locale={locale} />
        <Analytics />
      </body>
    </html>
  );
}
