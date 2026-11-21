import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale } from "@/lib/types";

export function Section({ title, href, linkLabel, locale, children }: { title: string; href?: string; linkLabel?: string; locale: Locale; children: React.ReactNode }) {
  const Chevron = locale === "ar" ? ChevronLeft : ChevronRight;
  return (
    <section className="mx-auto mt-8 max-w-6xl px-4">
      <div className="mb-3 flex items-end justify-between">
        <h2 className="flex items-center gap-2 text-lg font-black md:text-xl">
          <span className="bg-sunset h-5 w-1.5 rounded-full" />
          {title}
        </h2>
        {href && (
          <Link href={href} className="inline-flex items-center gap-0.5 text-sm font-bold text-pink">
            {linkLabel} <Chevron className="size-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
