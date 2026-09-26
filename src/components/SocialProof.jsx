import { Star, Quote, MapPin } from "lucide-react";
import { Eyebrow, Reveal } from "./snow";

const REVIEWS = [
  {
    name: "Marcus D.",
    city: "Richmond Hill, ON",
    text: "We got 35cm overnight during that January blizzard and their crew still had our driveway clear before 7am. GPS tracking let us watch the truck the whole way.",
  },
  {
    name: "Priya K.",
    city: "Toronto, ON",
    text: "Switched our office plaza to the Commercial Fleet VIP plan last season. Zero liability incidents, zero missed storms. Worth every dollar.",
  },
  {
    name: "Colton R.",
    city: "Calgary, AB",
    text: "The Seasonal Protection Pass paid for itself in the first month. Continuous clearing during that chinook freeze-thaw mess kept our walkway ice-free.",
  },
];

function Stars({ size = "h-4 w-4" }) {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`${size} fill-signal text-signal`} />
      ))}
    </div>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path fill="#4285F4" d="M22.6 12.2c0-.7-.1-1.4-.2-2.1H12v4h6c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.1-2 3.2-4.9 3.2-8.1z" />
      <path fill="#34A853" d="M12 23c3 0 5.6-1 7.4-2.7l-3.7-2.8c-1 .7-2.3 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2v2.9C3.8 20.6 7.6 23 12 23z" />
      <path fill="#FBBC05" d="M5.8 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.4.4-2.1V7H2C1.4 8.5 1 10.2 1 12s.4 3.5 1 5l3.8-2.9z" />
      <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.6 2.1 15 1 12 1 7.6 1 3.8 3.4 2 7l3.8 2.9c.9-2.6 3.3-4.5 6.2-4.5z" />
    </svg>
  );
}

export default function SocialProof() {
  return (
    <section id="reviews" className="scroll-mt-28 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="flex flex-col items-center text-center">
          <Eyebrow>Reviews</Eyebrow>
          <h2 className="mt-3 max-w-3xl text-4xl font-extrabold uppercase leading-none text-navy sm:text-6xl">
            Trusted through Canada&apos;s toughest winters
          </h2>
          <div className="mt-6 flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-xl shadow-slate-200 ring-1 ring-slate-200">
            <GoogleG />
            <span className="font-display text-3xl font-extrabold text-navy">4.9</span>
            <Stars />
            <span className="text-xs font-semibold text-slate-500">Google Reviews</span>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {REVIEWS.map((r, i) => (
            <Reveal
              key={r.name}
              delay={i * 120}
              className="relative flex flex-col rounded-3xl bg-slate-50 p-7 ring-1 ring-slate-200 transition hover:-translate-y-1 hover:bg-white hover:shadow-xl hover:shadow-slate-200"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-frost" fill="currentColor" />
              <Stars />
              <p className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-700">&ldquo;{r.text}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy font-display text-lg font-bold text-white">
                  {r.name[0]}
                </span>
                <div>
                  <p className="text-sm font-bold text-navy">{r.name}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3 w-3" />
                    {r.city}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
