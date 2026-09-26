import { Check, Star, CloudSnow, ShieldCheck, Building2 } from "lucide-react";
import { Eyebrow, Reveal, Snowfall } from "./snow";

const TIERS = [
  {
    name: "Per-Storm Pass",
    icon: CloudSnow,
    price: "Pay-per-visit",
    tagline: "Clearing triggered after 5cm accumulation",
    features: ["Billed only when it snows", "5cm accumulation trigger", "Driveway & walkway clearing", "Standard response window"],
  },
  {
    name: "Seasonal Protection Pass",
    icon: ShieldCheck,
    price: "Fixed Monthly Fee",
    tagline: "Unlimited blizzard clearings, all season long",
    features: ["Unlimited blizzard clearings", "Priority route status", "2-hour guaranteed response", "Eco-salt spreading included", "Fixed, predictable pricing"],
    highlight: true,
  },
  {
    name: "Commercial Fleet VIP",
    icon: Building2,
    price: "Custom Contract",
    tagline: "24/7 continuous clearing for commercial sites",
    features: ["24/7 continuous clearing", "Dedicated plow & loader fleet", "Liability insurance reporting", "Account manager & SLA"],
  },
];

function SnowCap() {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true" className="pointer-events-none absolute -top-3 left-0 h-7 w-full">
      <path
        fill="#ffffff"
        d="M0 22 C20 6 50 4 80 12 C110 2 150 0 180 10 C210 2 250 0 280 11 C310 3 350 2 380 12 C392 14 398 18 400 22 L400 30 C380 34 370 26 350 32 C330 38 320 28 300 34 C280 40 262 30 240 35 C220 40 200 30 180 34 C160 40 140 30 120 36 C100 40 80 30 60 34 C40 38 20 30 0 32 Z"
      />
    </svg>
  );
}

export default function TierComparison() {
  return (
    <section id="plans" className="scroll-mt-28 bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Seasonal Plans</Eyebrow>
          <h2 className="mt-3 text-4xl font-extrabold uppercase leading-none text-navy sm:text-6xl">
            Pick your winter coverage
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 items-stretch gap-8 lg:grid-cols-3 lg:gap-6">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            const hi = tier.highlight;
            return (
              <Reveal
                key={tier.name}
                delay={i * 120}
                className={`relative flex flex-col rounded-3xl p-7 sm:p-8 ${
                  hi
                    ? "bg-navy text-white shadow-2xl shadow-navy/40 ring-2 ring-signal lg:-translate-y-4"
                    : "bg-white text-navy shadow-lg shadow-slate-200/70 ring-1 ring-slate-200"
                }`}
              >
                {hi && (
                  <>
                    <SnowCap />
                    <div className="absolute inset-0 overflow-hidden rounded-3xl">
                      <Snowfall count={26} seed={99} />
                    </div>
                    <span className="absolute -top-4 right-6 z-10 flex items-center gap-1 rounded-full bg-signal px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
                      <Star className="h-3 w-3 fill-white" />
                      Popular
                    </span>
                  </>
                )}
                <div className="relative flex flex-1 flex-col">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${hi ? "bg-signal text-white" : "bg-frost text-ice"}`}>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 text-3xl font-bold uppercase leading-none">{tier.name}</h3>
                  <p className={`mt-2 text-sm ${hi ? "text-slate-300" : "text-slate-500"}`}>{tier.tagline}</p>
                  <p className={`mt-5 border-y py-4 font-display text-3xl font-extrabold uppercase ${hi ? "border-white/10 text-ice-light" : "border-slate-100 text-navy"}`}>
                    {tier.price}
                  </p>
                  <ul className="mt-5 flex-1 space-y-3 text-sm">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className={`mt-0.5 h-4 w-4 shrink-0 ${hi ? "text-ice-light" : "text-ice"}`} strokeWidth={3} />
                        <span className={hi ? "text-slate-200" : "text-slate-600"}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#estimator"
                    className={`mt-8 block rounded-xl px-5 py-3.5 text-center text-sm font-bold uppercase tracking-wide transition ${
                      hi ? "btn-beacon bg-signal text-white hover:bg-signal-light" : "bg-navy text-white hover:bg-navy-light"
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
