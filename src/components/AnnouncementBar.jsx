import { useState } from "react";
import { Zap } from "lucide-react";

const STATUS = {
  standby: {
    label: "Crew On Standby",
    detail: "Priority Clearing Active",
    dot: "bg-signal",
  },
  storm: {
    label: "All Crews Deployed",
    detail: "2-Hour Response",
    dot: "bg-red-500",
  },
};

export default function AnnouncementBar() {
  const [mode, setMode] = useState("standby");
  const status = STATUS[mode];
  const storm = mode === "storm";

  return (
    <div className="bg-navy text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-3 py-2 text-[11px] font-medium tracking-wide sm:px-4 sm:text-xs">
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={`absolute inline-flex h-full w-full animate-pulse-dot rounded-full ${status.dot}`}
          />
        </span>
        <p className="min-w-0 text-center" aria-live="polite">
          <Zap className="mr-1 inline h-3 w-3 fill-signal text-signal" />
          GTA &amp; SURROUNDING AREAS FLEET STATUS:{" "}
          <span className={storm ? "text-signal-light" : ""}>{status.label}</span>{" "}
          <span className="text-ice-light">|</span> {status.detail}
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={storm}
          aria-label="Toggle storm dispatch status"
          onClick={() => setMode(storm ? "standby" : "storm")}
          className={`relative ml-1 h-4 w-7 shrink-0 rounded-full transition ${storm ? "bg-signal" : "bg-white/20"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full bg-white transition-transform ${storm ? "translate-x-3" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
