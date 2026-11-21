"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import type { Locale } from "@/lib/types";

export function LangToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const next = locale === "ar" ? "en" : "ar";
  return (
    <button
      type="button"
      onClick={() => {
        document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
        start(() => router.refresh());
      }}
      className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line px-2.5 text-sm font-bold min-[480px]:px-3 text-fg hover:border-pink/60 disabled:opacity-50"
      disabled={pending}
      aria-label={next === "en" ? "Switch to English" : "التحويل للعربية"}
    >
      <Languages className="hidden size-4 min-[480px]:block" />
      {next === "en" ? "EN" : "ع"}
    </button>
  );
}
