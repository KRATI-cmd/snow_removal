import { useCallback, useRef, useState } from "react";
import { ArrowRight, ChevronsLeftRight } from "lucide-react";
import DrivewayScene from "./DrivewayScene";
import { Eyebrow, Reveal, Snowfall } from "./snow";

const clamp = (n) => Math.min(100, Math.max(0, n));

export default function BeforeAfterSlider() {
  const [percent, setPercent] = useState(50);
  const containerRef = useRef(null);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPercent(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = (e) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    updateFromClientX(e.clientX);
  };
  const onPointerMove = (e) => {
    if (dragging.current) updateFromClientX(e.clientX);
  };
  const stopDragging = () => {
    dragging.current = false;
  };
  const onKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPercent((p) => clamp(p - step));
    else if (e.key === "ArrowRight") setPercent((p) => clamp(p + step));
    else return;
    e.preventDefault();
  };

  return (
    <section className="bg-white pb-16 pt-6 sm:pb-24 sm:pt-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>See The Difference</Eyebrow>
          <h2 className="mt-3 text-4xl font-extrabold uppercase leading-none text-navy sm:text-6xl">
            Drag to Reveal the Transformation
          </h2>
        </Reveal>

        <div
          ref={containerRef}
          role="slider"
          tabIndex={0}
          aria-label="Before and after comparison"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopDragging}
          onPointerCancel={stopDragging}
          onKeyDown={onKeyDown}
          className="relative mt-10 aspect-4/3 w-full cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl shadow-2xl shadow-slate-300/50 focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-ice sm:aspect-16/9"
        >
          <div className="absolute inset-0">
            <DrivewayScene variant="before" />
            <Snowfall count={45} seed={5} />
          </div>

          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 0 0 ${percent}%)` }}
          >
            <DrivewayScene variant="after" />
          </div>

          <div className="pointer-events-none absolute left-3 top-3 max-w-[75%] rounded-lg bg-navy/85 px-3 py-2 text-[11px] font-bold text-white shadow-lg backdrop-blur-sm sm:left-6 sm:top-6 sm:max-w-[45%] sm:px-4 sm:text-sm">
            BEFORE: Dangerous 30cm Ice &amp; Snow Drift
          </div>
          <div className="pointer-events-none absolute bottom-3 right-3 max-w-[75%] rounded-lg bg-ice px-3 py-2 text-[11px] font-bold text-white shadow-lg sm:bottom-auto sm:right-6 sm:top-6 sm:max-w-[45%] sm:px-4 sm:text-sm">
            AFTER: Cleared &amp; Eco-Salted in 45 Minutes
          </div>

          <div
            className="pointer-events-none absolute top-0 z-10 h-full w-1 -translate-x-1/2 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.1)]"
            style={{ left: `${percent}%` }}
          >
            <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-navy shadow-xl ring-4 ring-signal/60">
              <ChevronsLeftRight className="h-5 w-5" />
            </div>
            <span className="absolute left-1/2 top-[calc(50%+30px)] -translate-x-1/2 whitespace-nowrap rounded-full bg-navy/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              Drag
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 sm:text-base">
            Don&apos;t get stuck in your driveway this winter.
          </p>
          <a
            href="#plans"
            className="btn-beacon mt-3 inline-flex items-center gap-1.5 rounded-xl bg-signal px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-signal-light sm:text-base"
          >
            Book Your Seasonal Coverage Today
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
