import { Home, Truck, ThermometerSnowflake, Check, ArrowRight } from "lucide-react";
import { Eyebrow, Reveal, Snowfall, SnowDrift } from "./snow";

const SERVICES = [
  {
    icon: Home,
    title: "Residential Driveway Clearing",
    tag: "Homes",
    items: ["Snow blowing, end to end", "Walkway hand-shovelling", "Porch & step clearing"],
  },
  {
    icon: Truck,
    title: "Commercial Lot Plowing",
    tag: "Plazas & lots",
    items: ["Heavy-duty plow truck fleet", "Loader clearing & snow removal", "Continuous salting"],
  },
  {
    icon: ThermometerSnowflake,
    title: "Emergency Ice Control & Salting",
    tag: "Ice & freeze-thaw",
    items: ["Preventative eco-friendly de-icing", "Stops freeze-thaw slips", "Rapid storm call-outs"],
  },
];

export default function ServiceGrid() {
  return (
    <section id="services" className="scroll-mt-28 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Eyebrow>Core Offerings</Eyebrow>
            <h2 className="mt-3 text-4xl font-extrabold uppercase leading-none text-navy sm:text-6xl">
              Full-spectrum winter <span className="text-ice">property care</span>
            </h2>
          </div>
          <a href="#estimator" className="group flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-ice">
            Price my property <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 md:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, tag, items }, i) => (
            <Reveal
              key={title}
              delay={i * 120}
              className="group overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/70 ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-ice/15"
            >
              <div className="relative h-40 overflow-hidden bg-gradient-to-b from-navy-deep to-[#1b3558]">
                <Snowfall count={22} seed={40 + i * 9} />
                <span className="absolute left-5 top-5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-ice-light">
                  {tag}
                </span>
                <div className="absolute inset-x-0 top-9 flex justify-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-signal text-white shadow-xl shadow-signal/40 transition duration-300 group-hover:-rotate-6 group-hover:scale-110">
                    <Icon className="h-8 w-8" />
                  </span>
                </div>
                <SnowDrift className="text-white" />
              </div>
              <div className="p-6 pt-3">
                <h3 className="text-2xl font-bold uppercase leading-tight text-navy">{title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-frost text-ice">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
