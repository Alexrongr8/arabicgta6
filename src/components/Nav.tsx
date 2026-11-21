"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Map, Search, UserRound } from "lucide-react";

type Labels = { home: string; explore: string; map: string; search: string; account: string };

const LINKS = [
  { href: "/", key: "home", Icon: Home },
  { href: "/explore", key: "explore", Icon: Compass },
  { href: "/map", key: "map", Icon: Map },
  { href: "/search", key: "search", Icon: Search },
  { href: "/account", key: "account", Icon: UserRound },
] as const;

function isActive(path: string, href: string) {
  if (href === "/") return path === "/";
  if (href === "/explore") return path.startsWith("/explore") || path.startsWith("/c/") || path.startsWith("/item/");
  return path.startsWith(href);
}

export function BottomNav({ labels }: { labels: Labels }) {
  const path = usePathname();
  if (path.startsWith("/map")) return null; // map is full-screen and has its own back button
  return (
    <nav className="glass pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line md:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {LINKS.map(({ href, key, Icon }) => {
          const active = isActive(path, href);
          return (
            <li key={href}>
              <Link href={href} className="flex flex-col items-center gap-1 pt-2.5 pb-1.5 text-[11px] font-bold" aria-current={active ? "page" : undefined}>
                <span className={`grid h-7 w-12 place-items-center rounded-full transition ${active ? "bg-sunset text-white shadow-md shadow-pink/40" : "text-dim"}`}>
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
      {LINKS.slice(0, 4).map(({ href, key, Icon }) => {
        const active = isActive(path, href);
        return (
          <li key={href}>
            <Link
              href={href}
              className={`inline-flex h-9 items-center gap-2 rounded-full px-4 text-sm font-bold transition ${active ? "bg-chip2 text-fg" : "text-muted hover:text-fg"}`}
            >
              <Icon className="size-4" /> {labels[key]}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
