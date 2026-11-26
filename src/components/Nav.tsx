"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clapperboard, Compass, Gamepad2, Home, Map, Search, UserRound } from "lucide-react";

type Labels = { home: string; explore: string; map: string; shorts: string; search: string; account: string; play: string; me: string };

const LINKS = [
  { href: "/", key: "home", Icon: Home },
  { href: "/shorts", key: "shorts", Icon: Clapperboard },
  { href: "/play", key: "play", Icon: Gamepad2 },
  { href: "/explore", key: "explore", Icon: Compass },
  { href: "/map", key: "map", Icon: Map },
  { href: "/search", key: "search", Icon: Search },
] as const;
/** Phones: search lives in the hero and the explore page, so the sixth slot is the visitor's own page. */
const BOTTOM = [...LINKS.slice(0, 5), { href: "/me", key: "me", Icon: UserRound }] as const;

function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  if (href === "/me") return path.startsWith("/me") || path.startsWith("/account");
  if (href === "/explore") return path.startsWith("/explore") || path.startsWith("/c/") || path.startsWith("/item/");
  return path.startsWith(href);
}

export function BottomNav({ labels }: { labels: Labels }) {
  const path = usePathname();
  if (path.startsWith("/map") || path.startsWith("/shorts")) return null; // full-screen pages with their own back button
  return (
    <nav className="glass pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-6">
        {BOTTOM.map(({ href, key, Icon }) => {
          const active = isActive(path, href);
          return (
            <li key={href}>
              <Link href={href} className="flex flex-col items-center gap-1 pt-2.5 pb-1.5 text-[11px] font-bold" aria-current={active ? "page" : undefined}>
                <span className={`grid h-7 w-11 place-items-center rounded-full transition ${active ? "bg-sunset text-[#241338] shadow-md shadow-pink/40" : "text-dim"}`}>
                  <Icon className="size-[19px]" />
                </span>
                <span className={active ? "text-fg" : "text-dim"}>{labels[key]}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function TopLinks({ labels }: { labels: Labels }) {
  const path = usePathname();
  return (
    <ul className="hidden items-center gap-1 md:flex">
      {LINKS.map(({ href, key, Icon }) => {
        const active = isActive(path, href);
        return (
          <li key={href}>
            <Link
              href={href}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-bold transition lg:gap-2 lg:px-4 ${active ? "bg-chip2 text-fg" : "text-muted hover:text-fg"}`}
            >
              <Icon className="size-4" /> {labels[key]}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
