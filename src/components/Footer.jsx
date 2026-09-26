import { useState } from "react";
import { Phone, Send, MapPin, ShieldCheck, Check, Siren } from "lucide-react";
import Logo from "./Logo";
import { Icicles, Snowfall } from "./snow";

const PROVINCES = [
  { code: "ON", name: "Ontario" },
  { code: "AB", name: "Alberta" },
  { code: "BC", name: "British Columbia" },
  { code: "MB", name: "Manitoba" },
];

const LINKS = [
  { href: "#estimator", label: "Instant Quote" },
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#plans", label: "Seasonal Plans" },
  { href: "#reviews", label: "Reviews" },
];

const field =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-slate-400 focus:border-ice-light focus:bg-white/10 focus:outline-none";

export default function Footer() {
  const [sent, setSent] = useState(false);

  return (
    <footer id="contact" className="relative overflow-hidden bg-navy-deep pt-20 text-white sm:pt-28">
      <Icicles className="text-white" />
      <Snowfall count={18} seed={123} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-signal">
              <Siren className="h-4 w-4" />
              24/7 Emergency Dispatch
            </p>
            <h2 className="mt-3 text-5xl font-extrabold uppercase leading-[0.9] sm:text-7xl">
              Winter&apos;s coming.
              <span className="text-frost-gradient block">We&apos;re ready.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm text-slate-300 sm:text-base">
              Storm hit hard? Reach dispatch directly or send an emergency request and a crew lead will call you back.
            </p>
            <a
              href="tel:18007669226"
              className="btn-beacon mt-7 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-signal px-7 py-4 font-display text-2xl font-extrabold uppercase tracking-wide text-white transition hover:bg-signal-light sm:w-auto"
            >
              <Phone className="h-6 w-6" />
              +1 800-SNOW-CAN
            </a>
          </div>

          <div className="frost rounded-3xl p-6 sm:p-8">
            <h3 className="text-2xl font-bold uppercase">Emergency Request</h3>
            {!sent ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="mt-5 space-y-3"
              >
                <input required type="text" autoComplete="name" placeholder="Full name" className={field} />
                <input required type="tel" autoComplete="tel" placeholder="Phone number" className={field} />
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your emergency (e.g., blocked commercial lot, icy walkway)"
                  className={`${field} resize-none`}
                />
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-ice px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-ice-light hover:text-navy"
                >
                  <Send className="h-4 w-4" />
                  Send Emergency Request
                </button>
              </form>
            ) : (
              <div className="mt-5 flex items-start gap-2 rounded-xl bg-ice/20 px-4 py-4 text-sm font-semibold text-ice-light">
                <Check className="mt-0.5 h-4 w-4 shrink-0" />
                Request received — dispatch will contact you shortly.
              </div>
            )}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-slate-400">
              Guaranteed 2-hour storm response, licensed &amp; insured crews, and eco-friendly ice control for
              residential and commercial properties.
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300 ring-1 ring-white/10">
              <ShieldCheck className="h-4 w-4 text-ice-light" />
              Licensed Contractor · $5M Liability Insured
            </p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wide">
              <MapPin className="h-4 w-4 text-ice-light" /> Operating Provinces
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2">
              {PROVINCES.map((p) => (
                <li key={p.code} className="rounded-lg bg-white/5 px-3 py-2 ring-1 ring-white/10">
                  <span className="font-display text-lg font-extrabold text-white">{p.code}</span>
                  <span className="block text-[11px] text-slate-400">{p.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold uppercase tracking-wide">Explore</h3>
            <ul className="mt-4 space-y-2.5">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-slate-400 transition hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} Snow Removal Canada. All rights reserved.</span>
          <span>Serving ON · AB · BC · MB</span>
        </div>
      </div>
    </footer>
  );
}
