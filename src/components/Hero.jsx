import { useState } from "react";
import { Phone, ShieldCheck, Satellite, Leaf, ArrowRight, ChevronDown } from "lucide-react";
import HeroCanvas from "./hero/HeroCanvas";
import SnowLoader from "./SnowLoader";
import { Snowfall, SnowDrift } from "./snow";

const badges = [
  { icon: ShieldCheck, label: "Licensed & $5M Insured" },
  { icon: Satellite, label: "24/7 GPS Fleet Tracking" },
  { icon: Leaf, label: "Zero-Liability Salt Management" },
];

export default function Hero() {
  const [scene, setScene] = useState("loading");

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[880px] flex-col overflow-hidden bg-navy-deep text-white sm:min-h-[820px] lg:min-h-[max(760px,calc(100svh-6.5rem))]"
    >
      {/* Static winter backdrop: visible while the 3D scene loads, and kept if it can't load. */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at 50% 115%, #e2eaf4 0%, #9db3cf 20%, transparent 46%), radial-gradient(ellipse at 50% -10%, #173158 0%, transparent 60%), #0a1628",
        }}
      />
      <Snowfall count={60} seed={3} className="-z-10" />
      <HeroCanvas onStatus={setScene} />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[62%] bg-gradient-to-b from-navy-deep via-navy-deep/80 to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-4 pt-9 text-center sm:px-6 sm:pt-12 lg:pt-12">
        <span className="frost inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-200">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-signal" />
          24/7 Storm Response<span className="hidden sm:inline"> · ON · AB · BC · MB</span>
        </span>

        <h1 className="mt-5 font-extrabold uppercase leading-[0.9] tracking-tight drop-shadow-[0_4px_24px_rgba(10,22,40,0.6)]">
          <span className="block text-[1.75rem] text-slate-100 sm:text-4xl lg:text-[2.6rem]">
            Reliable Commercial &amp; Residential
          </span>
          <span className="text-frost-gradient mt-1 block text-[3.1rem] sm:text-7xl lg:whitespace-nowrap lg:text-[4.6rem] xl:text-[5.2rem]">
            Snow Plowing <span className="whitespace-nowrap">Across Canada</span>
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-200 sm:text-lg">
          Zero-stress winter property care. Guaranteed 2-hour storm response times, continuous driveway
          clearing, and eco-friendly salt management.
        </p>

        <div className="mt-7 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <a
            href="#estimator"
            className="btn-beacon group flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-signal px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-signal-light sm:text-base"
          >
            Get Instant Seasonal Quote
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
          <a
            href="tel:18007669226"
            className="frost flex items-center justify-center gap-2 whitespace-nowrap rounded-xl px-7 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white/15 sm:text-base"
          >
            <Phone className="h-4 w-4 text-signal" />
            24/7 Emergency Dispatch
          </a>
        </div>

        <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2.5">
          {badges.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-2 text-xs font-semibold text-slate-200 sm:text-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ice/25">
                <Icon className="h-3.5 w-3.5 text-ice-light" />
              </span>
              {label}
            </li>
          ))}
        </ul>
      </div>

      {scene === "loading" && (
        <div className="absolute inset-x-0 bottom-28 z-10 flex justify-center">
          <SnowLoader compact label="Warming up the plow…" />
        </div>
      )}

      <a
        href="#stats"
        aria-label="Scroll down"
        className="animate-cue absolute bottom-16 left-1/2 z-10 hidden -translate-x-1/2 text-white/80 lg:block"
      >
        <ChevronDown className="h-6 w-6" />
      </a>

      <SnowDrift className="z-10 text-white" />
    </section>
  );
}
