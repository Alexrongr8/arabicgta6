import { Lock, Check } from "lucide-react";
import { t } from "@/lib/i18n";
import type { Locale } from "@/lib/types";
import { GoogleButton } from "./GoogleButton";
import { supabaseConfigured } from "@/lib/supabase/server";
import { digestEnabled } from "@/lib/digest-config";

export function SignInGate({ locale, next = "/", title }: { locale: Locale; next?: string; title?: string }) {
  const digest = digestEnabled();
  return (
    <div className="card relative mx-auto max-w-md overflow-hidden p-6 text-center">
      <div className="absolute inset-x-0 -top-24 mx-auto size-48 rounded-full bg-pink/30 blur-3xl" />
      <div className="relative">
        <span className="bg-sunset mx-auto mb-4 grid size-14 place-items-center rounded-2xl shadow-lg shadow-pink/30">
          <Lock className="size-6 text-white" />
        </span>
        {title && <p className="mb-1 text-sm text-dim">{title}</p>}
        <h2 className="mb-2 text-xl font-extrabold">{t(locale, digest ? "gateTitle" : "gatePausedTitle")}</h2>
        <p className="mb-5 text-sm leading-relaxed text-muted">{t(locale, digest ? "gateBody" : "gatePausedBody")}</p>
        <ul className="mb-6 space-y-2 text-start text-sm">
          {t(locale, digest ? "gatePerks" : "gatePausedPerks").map((p) => (
            <li key={p} className="flex items-center gap-2">
              <Check className="size-4 shrink-0 text-teal" /> {p}
            </li>
          ))}
        </ul>
        <GoogleButton label={t(locale, "signInGoogle")} next={next} enabled={supabaseConfigured()} disabledLabel={t(locale, "authNotReady")} errorLabel={t(locale, "loginError")} />
      </div>
    </div>
  );
}
