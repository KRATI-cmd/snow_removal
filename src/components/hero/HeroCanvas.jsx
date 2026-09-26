import { useEffect, useRef, useState } from "react";
import { markReady } from "../../preloader";

export default function HeroCanvas({ onStatus }) {
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    let scene;
    let io;
    let inView = true;
    let cancelled = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const sync = () => scene?.setActive(inView && !document.hidden);
    const settle = (status) => {
      onStatus?.(status);
      markReady("hero");
    };

    Promise.all([
      import("../../three/plowScene.js"),
      document.fonts?.load("800 92px 'Barlow Condensed'").catch(() => {}),
    ])
      .then(([{ createPlowScene }]) => {
        if (cancelled) return;
        scene = createPlowScene(canvas, { reducedMotion: reduced });
        setReady(true);
        settle("ready");
        io = new IntersectionObserver(([entry]) => {
          inView = entry.isIntersecting;
          sync();
        });
        io.observe(canvas);
        sync();
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn("3D hero unavailable, keeping the static winter backdrop:", err);
        settle("failed");
      });

    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelled = true;
      io?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      scene?.dispose();
    };
  }, [onStatus]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
