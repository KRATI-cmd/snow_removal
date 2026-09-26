import { Snowflake } from "lucide-react";

const CITIES = ["Toronto", "Richmond Hill", "Vaughan", "Markham", "Mississauga", "Calgary", "Edmonton", "Vancouver", "Winnipeg"];

export default function CityMarquee() {
  const row = (hidden) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {CITIES.map((c) => (
        <li key={c} className="flex items-center gap-6 px-3 font-display text-2xl font-extrabold uppercase tracking-wide text-navy sm:text-3xl">
          {c}
          <Snowflake className="h-5 w-5 text-white" strokeWidth={2.5} />
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-label="Service areas" className="overflow-hidden bg-signal py-4">
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
