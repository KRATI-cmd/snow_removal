import { CloudSnow, Truck, Sparkles, RefreshCw } from "lucide-react";
import { Eyebrow, Icicles, Reveal, Snowfall, SnowDrift, useInView } from "./snow";

const STEPS = [
  { icon: CloudSnow, title: "Storm Detected", body: "Dispatch watches snowfall around the clock. At 5cm, your property joins the active route." },
  { icon: Truck, title: "Plow Dispatched", body: "GPS-tracked trucks roll out with a guaranteed 2-hour storm response." },
  { icon: Sparkles, title: "Cleared & Eco-Salted", body: "Driveways, walkways and entrances cleared to bare pavement, then treated." },
  { icon: RefreshCw, title: "Continuous Clearing", body: "Big storm? Crews keep circling back until the snow stops falling." },
];

function RouteTruck({ className }) {
  return (
    <span className={`absolute z-10 flex h-10 w-10 items-center justify-center rounded-full bg-signal text-white shadow-lg shadow-signal/50 ring-4 ring-navy ${className}`}>
      <Truck className="h-5 w-5" />
    </span>
  );
}

export default function HowItWorks() {
  const [routeRef, run] = useInView({ threshold: 0.3 });

  return (
    <section id="how-it-works" className="relative scroll-mt-28 overflow-hidden bg-navy pb-28 pt-24 text-white sm:pb-36 sm:pt-32">
      <Icicles className="text-white" />
      <Snowfall count={20} seed={77} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="max-w-2xl">
          <Eyebrow tone="light">How It Works</Eyebrow>
          <h2 className="mt-3 text-4xl font-extrabold uppercase leading-none sm:text-6xl">
            From first flake to <span className="text-frost-gradient">bare pavement</span>
          </h2>
        </Reveal>

        <div ref={routeRef} className={`relative mt-14 ${run ? "route-run" : ""}`}>
          {/* Desktop horizontal route */}
          <div className="absolute left-[12.5%] right-[12.5%] top-5 hidden h-1 lg:block">
            <div className="absolute inset-0 rounded-full border-t-2 border-dashed border-white/20" />
            <div className="route-fill-x absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-ice to-ice-light shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
            <RouteTruck className="route-truck-x -top-[18px] -translate-x-1/2" />
          </div>
          {/* Mobile vertical route */}
          <div className="absolute bottom-10 left-5 top-5 w-1 lg:hidden">
            <div className="absolute inset-0 border-l-2 border-dashed border-white/20" />
            <div className="route-fill-y absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-ice to-ice-light shadow-[0_0_12px_rgba(56,189,248,0.7)]" />
            <RouteTruck className="route-truck-y -left-[18px] -translate-y-1/2" />
          </div>

          <ol className="grid gap-10 lg:grid-cols-4 lg:gap-6">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <Reveal as="li" key={title} delay={i * 120} className="relative pl-16 lg:pl-0 lg:text-center">
                <span className="absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full bg-navy-light ring-2 ring-ice/60 lg:relative lg:mx-auto">
                  <Icon className="h-5 w-5 text-ice-light" />
                </span>
                <p className="font-display text-sm font-bold tracking-[0.3em] text-signal lg:mt-6">
                  0{i + 1}
                </p>
                <h3 className="mt-1 text-2xl font-bold uppercase">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400 lg:mx-auto lg:max-w-60">{body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>

      <SnowDrift className="text-white" />
    </section>
  );
}
