export function LogoMark({ className = "h-10 w-10" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e3a5f" />
          <stop offset="1" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill="url(#logo-bg)" />
      <g fill="none" stroke="#fff" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round">
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 32 26)`}>
            <line x1="32" y1="26" x2="32" y2="10" />
            <polyline points="26.5,12.5 32,18 37.5,12.5" />
          </g>
        ))}
      </g>
      <path d="M9 47 Q32 60 55 47 L55 53 Q32 66 9 53 Z" fill="#f97316" />
    </svg>
  );
}

export default function Logo({ tone = "light" }) {
  const text = tone === "light" ? "text-white" : "text-navy";
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark className="h-10 w-10 shrink-0 drop-shadow-[0_4px_12px_rgba(56,189,248,0.25)]" />
      <span className={`font-display leading-none ${text}`}>
        <span className="block text-lg font-extrabold uppercase tracking-wide sm:text-xl">
          Snow Removal
        </span>
        <span className="block text-[11px] font-bold uppercase tracking-[0.32em] text-ice-light">
          Canada
        </span>
      </span>
    </span>
  );
}
