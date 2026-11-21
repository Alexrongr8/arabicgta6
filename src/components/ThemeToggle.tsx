"use client";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ initial, label }: { initial: "light" | "dark"; label: string }) {
  const [theme, setTheme] = useState(initial);
  const next = theme === "light" ? "dark" : "light";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => {
        document.documentElement.dataset.theme = next;
        document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "dark" ? "#0d0717" : "#fff5ec");
        setTheme(next);
      }}
      className="grid size-9 place-items-center rounded-full border border-line bg-chip text-fg"
    >
      {theme === "light" ? <Moon className="size-[18px]" /> : <Sun className="size-[18px] text-sun" />}
    </button>
  );
}
