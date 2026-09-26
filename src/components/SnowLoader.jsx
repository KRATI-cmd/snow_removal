import { LogoMark } from "./Logo";

export function PlowBar({ className = "w-56" }) {
  return (
    <div className={`relative h-2.5 overflow-hidden rounded-full bg-white/90 shadow-[0_0_14px_rgba(255,255,255,0.35)] ${className}`}>
      <div className="plow-cleared absolute inset-y-0 left-0 bg-navy-light" />
      <div className="plow-blade absolute inset-y-0 w-2 -translate-x-full rounded-sm bg-signal shadow-[0_0_10px_rgba(249,115,22,0.9)]" />
    </div>
  );
}

export default function SnowLoader({ label = "Clearing the way…", compact = false, tone = "dark", children }) {
  const text = tone === "dark" ? "text-slate-200" : "text-navy";
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center gap-4 text-center">
      <LogoMark className={`${compact ? "h-11 w-11" : "h-16 w-16"} snow-spin-soft drop-shadow-[0_6px_20px_rgba(56,189,248,0.35)]`} />
      <PlowBar className={compact ? "w-40" : "w-56"} />
      <p className={`font-display text-sm font-bold uppercase tracking-[0.25em] ${text}`}>{label}</p>
      {children}
    </div>
  );
}
