const rand = (seed) => {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
};

const r = rand(42);
const FLAKES = Array.from({ length: 90 }, () => ({
  x: r() * 1600,
  y: r() * 900,
  size: 1.5 + r() * 3.5,
  o: 0.5 + r() * 0.5,
}));
const SALT = Array.from({ length: 160 }, () => {
  const t = r();
  const y = 400 + t * 490;
  const half = 240 + t * 520;
  return { x: 800 + (r() * 2 - 1) * half * 0.9, y, size: 1 + t * 2.2 };
});

const DRIVEWAY = "560,390 1040,390 1560,900 40,900";

function House() {
  return (
    <g>
      <rect x="480" y="150" width="640" height="240" fill="#334155" />
      <polygon points="440,165 800,40 1160,165" fill="#1e293b" />
      <path d="M440 165 L800 40 L1160 165 L1140 172 L800 58 L460 172 Z" fill="#f8fafc" />
      <rect x="610" y="230" width="380" height="160" fill="#475569" />
      {[262, 294, 326, 358].map((y) => (
        <line key={y} x1="610" x2="990" y1={y} y2={y} stroke="#334155" strokeWidth="3" />
      ))}
      <rect x="515" y="230" width="60" height="60" rx="4" fill="#fde68a" opacity="0.85" />
      <rect x="1025" y="230" width="60" height="60" rx="4" fill="#fde68a" opacity="0.85" />
    </g>
  );
}

function Before() {
  return (
    <>
      <defs>
        <linearGradient id="b-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#64748b" />
          <stop offset="1" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="b-snow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#b-sky)" />
      <House />
      <rect y="385" width="1600" height="515" fill="url(#b-snow)" />
      <polygon points={DRIVEWAY} fill="#f8fafc" />
      <path d="M40 900 Q360 700 540 620 T900 520 T1300 700 L1560 900 Z" fill="#e2e8f0" opacity="0.7" />
      <path d="M120 900 Q440 760 700 700 T1140 720 L1480 900 Z" fill="#ffffff" />
      <path d="M660 395 Q540 560 430 900" stroke="#cbd5e1" strokeWidth="26" fill="none" opacity="0.6" />
      <path d="M940 395 Q1060 560 1170 900" stroke="#cbd5e1" strokeWidth="26" fill="none" opacity="0.6" />
      <ellipse cx="760" cy="600" rx="150" ry="34" fill="#bae6fd" opacity="0.65" />
      <ellipse cx="1030" cy="800" rx="190" ry="40" fill="#bae6fd" opacity="0.55" />
      <ellipse cx="520" cy="770" rx="120" ry="28" fill="#bae6fd" opacity="0.5" />
      <path d="M660 590 q60 -12 140 0" stroke="#fff" strokeWidth="4" fill="none" opacity="0.9" />
      <path d="M950 790 q80 -14 170 0" stroke="#fff" strokeWidth="4" fill="none" opacity="0.9" />
      {FLAKES.map((f, i) => (
        <circle key={i} cx={f.x} cy={f.y} r={f.size} fill="#fff" opacity={f.o} />
      ))}
    </>
  );
}

function After() {
  return (
    <>
      <defs>
        <linearGradient id="a-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="a-asphalt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#475569" />
          <stop offset="1" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="a-lawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e2e8f0" />
          <stop offset="1" stopColor="#f8fafc" />
        </linearGradient>
      </defs>
      <rect width="1600" height="900" fill="url(#a-sky)" />
      <House />
      <rect y="385" width="1600" height="515" fill="url(#a-lawn)" />
      <polygon points={DRIVEWAY} fill="url(#a-asphalt)" />
      <polygon points="780,390 820,390 900,900 700,900" fill="#fff" opacity="0.05" />
      {SALT.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.size} fill="#f1f5f9" opacity="0.55" />
      ))}
      <path d="M500 390 L565 390 L60 900 L-80 900 Q-20 800 160 680 Q360 540 500 390 Z" fill="#ffffff" />
      <path d="M565 390 L60 900 L92 900 L580 392 Z" fill="#cbd5e1" />
      <path d="M1100 390 L1035 390 L1540 900 L1680 900 Q1620 800 1440 680 Q1240 540 1100 390 Z" fill="#ffffff" />
      <path d="M1035 390 L1540 900 L1508 900 L1020 392 Z" fill="#cbd5e1" />
    </>
  );
}

export default function DrivewayScene({ variant }) {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      {variant === "before" ? <Before /> : <After />}
    </svg>
  );
}
