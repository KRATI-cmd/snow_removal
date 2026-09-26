import { useMemo, useState } from "react";
import { Home, Building2, Warehouse, Check, Lock, Loader2, MapPin, Snowflake, Sparkles, Infinity as InfinityIcon, Truck } from "lucide-react";
import { Eyebrow, Reveal, Snowfall } from "./snow";

const PROPERTY_TYPES = [
  { id: "single", label: "Single Driveway", hint: "1–2 cars", icon: Home, base: [349, 449] },
  { id: "double", label: "Double Driveway", hint: "3–4 cars", icon: Building2, base: [449, 599] },
  { id: "commercial", label: "Commercial Parking Lot", hint: "Plazas & lots", icon: Warehouse, base: [1499, 2999] },
];

const SERVICE_TIERS = [
  { id: "standard", label: "Standard Plowing", hint: "Clearing after every qualifying snowfall", icon: Truck, multiplier: 1 },
  { id: "premium", label: "Premium + Eco-Salt Spreading", hint: "Clearing plus pet-safe de-icing", icon: Sparkles, multiplier: 1.25 },
  { id: "unlimited", label: "Unlimited Storm Season Pass", hint: "Priority route, unlimited visits", icon: InfinityIcon, multiplier: 1.6 },
];

const round10 = (n) => Math.round(n / 10) * 10;

function StepHeading({ n, done, active, children }) {
  return (
    <h3 className="mb-3 flex items-center gap-3 font-display text-lg font-bold uppercase tracking-wide text-navy">
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-xs font-bold transition ${
          done ? "bg-ice text-white" : active ? "bg-signal text-white" : "bg-slate-200 text-slate-500"
        }`}
      >
        {done ? <Check className="h-3.5 w-3.5" /> : n}
      </span>
      {children}
    </h3>
  );
}

export default function Estimator() {
  const [propertyType, setPropertyType] = useState(null);
  const [serviceTier, setServiceTier] = useState(null);
  const [postalCode, setPostalCode] = useState("");
  const [contact, setContact] = useState("");
  const [locked, setLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const step = !propertyType ? 1 : !serviceTier ? 2 : 3;
  const property = PROPERTY_TYPES.find((p) => p.id === propertyType);
  const tier = SERVICE_TIERS.find((t) => t.id === serviceTier);

  const priceRange = useMemo(() => {
    if (!property || !tier) return null;
    return { low: round10(property.base[0] * tier.multiplier), high: round10(property.base[1] * tier.multiplier) };
  }, [property, tier]);

  const handleLockIn = (e) => {
    e.preventDefault();
    if (!contact.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setLocked(true);
    }, 900);
  };

  const optionClass = (selected) =>
    `group relative flex items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
      selected ? "border-ice bg-frost/60 shadow-md shadow-ice/10" : "border-slate-200 bg-white hover:border-ice/50 hover:bg-slate-50"
    }`;

  return (
    <section id="estimator" className="scroll-mt-28 bg-slate-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Instant Estimate · 60 seconds</Eyebrow>
          <h2 className="mt-3 text-4xl font-extrabold uppercase leading-none text-navy sm:text-6xl">
            Instant Seasonal Route Estimator
          </h2>
          <p className="mt-4 text-sm text-slate-600 sm:text-base">
            Three quick steps to your locked-in winter rate. No site visit, no obligation.
          </p>
        </Reveal>

        <Reveal className="mt-10 grid overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-300/50 ring-1 ring-slate-200 lg:mt-14 lg:grid-cols-[1.35fr_1fr]">
          <div className="p-5 sm:p-8">
            <StepHeading n={1} done={step > 1} active={step === 1}>
              Property Type
            </StepHeading>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {PROPERTY_TYPES.map(({ id, label, hint, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={propertyType === id}
                  onClick={() => {
                    setPropertyType(id);
                    setLocked(false);
                  }}
                  className={`${optionClass(propertyType === id)} sm:flex-col sm:items-start sm:gap-2`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${propertyType === id ? "bg-ice text-white" : "bg-slate-100 text-slate-500 group-hover:text-ice"}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-navy">{label}</span>
                    <span className="block text-xs text-slate-500">{hint}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <StepHeading n={2} done={step > 2} active={step === 2}>
                Service Tier
              </StepHeading>
              <div className="grid gap-3">
                {SERVICE_TIERS.map(({ id, label, hint, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={serviceTier === id}
                    disabled={!propertyType}
                    onClick={() => {
                      setServiceTier(id);
                      setLocked(false);
                    }}
                    className={optionClass(serviceTier === id)}
                  >
                    <Icon className={`h-5 w-5 shrink-0 ${serviceTier === id ? "text-ice" : "text-slate-400"}`} />
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-navy">{label}</span>
                      <span className="block text-xs text-slate-500">{hint}</span>
                    </span>
                    {serviceTier === id && <Check className="h-4 w-4 shrink-0 text-ice" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <StepHeading n={3} done={step === 3 && postalCode.trim().length >= 3} active={step === 3}>
                Postal Code
              </StepHeading>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={postalCode}
                  disabled={!serviceTier}
                  onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                  placeholder="e.g., L4B 3M6"
                  maxLength={7}
                  autoComplete="postal-code"
                  className="w-full rounded-xl border-2 border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm font-semibold uppercase tracking-wider text-navy placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:border-ice focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          {/* Quote panel */}
          <div className="relative flex flex-col overflow-hidden bg-navy p-6 text-white sm:p-8">
            <Snowfall count={28} seed={21} />
            <div className="relative">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ice-light">
                <Snowflake className="h-3.5 w-3.5" />
                Your Winter Quote
              </p>

              <dl className="mt-5 space-y-2.5 text-sm">
                {[
                  ["Property", property?.label],
                  ["Service", tier?.label],
                  ["Route area", postalCode || null],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-start justify-between gap-4 border-b border-white/10 pb-2.5">
                    <dt className="text-slate-400">{k}</dt>
                    <dd className={`text-right font-semibold ${v ? "text-white" : "text-slate-600"}`}>{v ?? "—"}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="relative mt-6 flex-1">
              {priceRange ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ice-light">
                    Estimated Seasonal Rate {postalCode ? `· ${postalCode}` : ""}
                  </p>
                  <p className="mt-1 font-display text-5xl font-extrabold leading-none sm:text-6xl">
                    ${priceRange.low.toLocaleString()} – ${priceRange.high.toLocaleString()}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">per season · no obligation</p>

                  {!locked ? (
                    <form onSubmit={handleLockIn} className="mt-6 space-y-2.5">
                      <input
                        type="text"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Email or phone number"
                        className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-sm text-white placeholder:text-slate-400 focus:border-ice-light focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-beacon flex w-full items-center justify-center gap-2 rounded-xl bg-signal px-5 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-signal-light disabled:opacity-70"
                      >
                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
                        Lock In Seasonal Rate
                      </button>
                    </form>
                  ) : (
                    <div className="mt-6 flex items-start gap-2 rounded-xl bg-ice/20 px-4 py-3.5 text-sm font-semibold text-ice-light">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      Rate locked! Our dispatch team will confirm your quote shortly.
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full flex-col justify-center rounded-2xl border border-dashed border-white/15 p-6 text-center">
                  <p className="font-display text-4xl font-extrabold text-slate-600">$— – $—</p>
                  <p className="mt-2 text-sm text-slate-400">
                    {step === 1 ? "Pick your property type to start." : "Now choose a service tier."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
