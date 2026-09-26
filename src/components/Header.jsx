import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import Logo from "./Logo";

const NAV = [
  { href: "#estimator", label: "Get a Quote" },
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#plans", label: "Plans" },
  { href: "#reviews", label: "Reviews" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`border-b transition-colors duration-300 ${
        scrolled || open
          ? "border-white/10 bg-navy-deep/95 shadow-lg shadow-black/20 backdrop-blur-md"
          : "border-transparent bg-navy-deep"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="#top" aria-label="Snow Removal Canada home" onClick={() => setOpen(false)}>
          <Logo />
        </a>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="tel:18007669226"
            className="btn-beacon flex items-center gap-1.5 rounded-full bg-signal px-3.5 py-2 text-xs font-bold text-white transition hover:bg-signal-light sm:px-4 sm:py-2.5 sm:text-sm"
          >
            <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">1-800-SNOW-CAN</span>
            <span className="sm:hidden">Call Now</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="rounded-lg p-2 text-white transition hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-white/10 px-4 pb-4 lg:hidden">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="block border-b border-white/5 py-3 font-display text-lg font-bold uppercase tracking-wide text-slate-200"
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
