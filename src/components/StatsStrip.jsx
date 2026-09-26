import { useEffect, useState } from "react";
import { Clock, Siren, ShieldCheck, Star } from "lucide-react";
import { useInView } from "./snow";

const STATS = [
  { icon: Clock, value: 2, suffix: " HR", label: "Guaranteed storm response" },
  { icon: Siren, value: 24, suffix: "/7", label: "Emergency dispatch" },
  { icon: ShieldCheck, prefix: "$", value: 5, suffix: "M", label: "Liability insurance" },
  { icon: Star, value: 4.9, decimals: 1, suffix: "★", label: "Google rating" },
];

function CountUp({ value, decimals = 0, run }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(value);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1400);
      setN(value * (1 - (1 - p) ** 3));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, value]);
  return n.toFixed(decimals);
}

export default function StatsStrip() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <section id="stats" className="bg-white pb-6 pt-4 sm:pb-10">
      <div ref={ref} className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 px-0 sm:mx-6 lg:mx-auto lg:grid-cols-4">
        {STATS.map(({ icon: Icon, prefix = "", value, decimals, suffix, label }) => (
          <div key={label} className="flex flex-col items-center bg-white px-3 py-6 text-center sm:py-8">
            <Icon className="h-5 w-5 text-ice" />
            <p className="mt-2 font-display text-4xl font-extrabold text-navy sm:text-5xl">
              {prefix}
              <CountUp value={value} decimals={decimals} run={inView} />
              <span className={suffix === "★" ? "text-signal" : ""}>{suffix}</span>
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
