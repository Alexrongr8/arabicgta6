export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} dir="ltr">
      <svg viewBox="0 0 40 40" className="size-8" aria-hidden>
        <defs>
          <linearGradient id="lg-sun" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffd166" />
            <stop offset=".5" stopColor="#ff9a3d" />
            <stop offset="1" stopColor="#ff3d8b" />
          </linearGradient>
        </defs>
        <rect width="40" height="40" rx="11" fill="#1a0d2e" />
        <circle cx="20" cy="22" r="11" fill="url(#lg-sun)" />
        <rect x="6" y="23" width="28" height="2" fill="#1a0d2e" />
        <rect x="6" y="27" width="28" height="2.5" fill="#1a0d2e" />
        <rect x="6" y="31.5" width="28" height="3" fill="#1a0d2e" />
        <path d="M27 9c-3 1-5 4-5.5 8M27 9c-1 3 0 6 2 8M27 9c3 0 5 2 6 4M27 9c-3-1-6 0-8 2" stroke="#19d3c5" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
      <span className="font-display relative text-[18px] leading-none tracking-wide">
        <span className="text-fg">ARABIC</span>{" "}
        <span className="relative text-sunset">
          GTA6
          {/* Saudi flag tucked under "A6" — doesn't shift the wordmark */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/flag-sa.svg" alt="" title="Made in Saudi Arabia" className="absolute top-full right-0 -mt-[1px] h-[11px] w-auto rounded-[2px] shadow-sm" />
        </span>
      </span>
    </span>
  );
}
