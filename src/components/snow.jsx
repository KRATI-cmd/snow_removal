import { useEffect, useMemo, useRef, useState } from "react";

const seeded = (seed) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

export function useInView({ threshold = 0.2, rootMargin = "0px 0px -40px 0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [threshold, rootMargin]);
  return [ref, inView];
}

export function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...rest }) {
  const [ref, shown] = useInView();
  return (
    <Tag
      ref={ref}
      style={{ "--reveal-delay": `${delay}ms` }}
      className={`reveal ${shown ? "is-visible" : ""} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

function snowTile(seed, size, dots, rMin, rMax) {
  const r = seeded(seed);
  let circles = "";
  for (let i = 0; i < dots; i++) {
    const cx = (r() * size).toFixed(1);
    const cy = (r() * size).toFixed(1);
    const rad = (rMin + r() * (rMax - rMin)).toFixed(2);
    const op = (0.3 + r() * 0.5).toFixed(2);
    circles += `<circle cx='${cx}' cy='${cy}' r='${rad}' fill-opacity='${op}'/>`;
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><g fill='white'>${circles}</g></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

// Two seamlessly tiled layers that each slide down by exactly one tile: cheap, fully composited snowfall.
export function Snowfall({ count = 36, seed = 7, className = "" }) {
  const layers = useMemo(
    () => [
      { tile: 260, image: snowTile(seed, 260, Math.round(count * 0.9), 0.7, 1.5), duration: 14, sway: 5 },
      { tile: 420, image: snowTile(seed + 1, 420, Math.round(count * 0.55), 1.4, 3), duration: 11, sway: 4 },
    ],
    [count, seed],
  );

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {layers.map((l, i) => (
        <div key={i} className="snow-sway" style={{ animationDuration: `${l.sway}s` }}>
          <div
            className="snow-layer"
            style={{
              backgroundImage: l.image,
              backgroundSize: `${l.tile}px ${l.tile}px`,
              animationDuration: `${l.duration}s`,
              "--tile": `${l.tile}px`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function SnowDrift({ className = "text-white" }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 block h-14 w-full sm:h-24 ${className}`}
    >
      <path
        fill="currentColor"
        opacity="0.2"
        d="M0 64 C110 34 230 88 370 60 C530 28 640 86 800 56 C950 28 1070 86 1230 58 C1330 42 1400 54 1440 48 L1440 120 L0 120 Z"
      />
      <path
        fill="currentColor"
        d="M0 92 C140 64 270 110 430 84 C590 58 700 106 870 82 C1030 60 1150 106 1310 84 C1380 74 1420 80 1440 78 L1440 120 L0 120 Z"
      />
    </svg>
  );
}

// Wavy snow ledge with narrow, irregularly spaced icicles hanging from it.
const ICICLE_PATH = (() => {
  const r = seeded(11);
  const edge = () => (12 + r() * 6).toFixed(1);
  let d = "M1440 0 H0 V14";
  for (let x = 0; x < 1440; ) {
    const gap = 14 + r() * 46;
    x += gap;
    d += ` Q${(x - gap / 2).toFixed(1)} ${(17 + r() * 5).toFixed(1)} ${x.toFixed(1)} ${edge()}`;
    const w = 6 + r() * 10;
    const len = 12 + r() ** 1.5 * 44;
    d += ` L${(x + w * (0.4 + r() * 0.2)).toFixed(1)} ${(14 + len).toFixed(1)} L${(x + w).toFixed(1)} ${edge()}`;
    x += w;
  }
  return `${d} L1440 14 Z`;
})();

export function Icicles({ className = "text-white" }) {
  return (
    <svg
      viewBox="0 0 1440 72"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 block h-8 w-full sm:h-12 ${className}`}
    >
      <path fill="currentColor" d={ICICLE_PATH} />
    </svg>
  );
}

export function Eyebrow({ children, tone = "ice" }) {
  const color = tone === "ice" ? "text-ice" : "text-ice-light";
  return (
    <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] ${color}`}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7" />
      </svg>
      {children}
    </span>
  );
}
