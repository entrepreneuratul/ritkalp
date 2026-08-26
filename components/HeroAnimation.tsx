import type { CSSProperties } from "react";

/**
 * A small, festival-specific animated centerpiece for the hero —
 * separate from the static background image (hero.svg). Pure CSS
 * animation (no JS/state needed), so this stays a server component.
 * Add a new `case` here when a new festival needs its own motif;
 * unrecognized slugs fall back to the diya (works for any generic
 * "puja kits" framing).
 */
export default function HeroAnimation({ festivalSlug }: { festivalSlug: string }) {
  switch (festivalSlug) {
    case "holi":
      return <ColorBurst />;
    case "navratri":
      return <Trishul />;
    case "diwali":
    default:
      return <Diya />;
  }
}

function Diya() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="mx-auto h-24 w-24 sm:h-28 sm:w-28"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="diyaGlow" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#FFD24B" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFD24B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="diyaFlame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#B4270C" />
          <stop offset="45%" stopColor="#F2711F" />
          <stop offset="80%" stopColor="#FFD24B" />
          <stop offset="100%" stopColor="#FFFDE7" />
        </linearGradient>
        <radialGradient id="diyaBowl" cx="35%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#F5C97A" />
          <stop offset="55%" stopColor="#C9862E" />
          <stop offset="100%" stopColor="#7A4B12" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="168" rx="52" ry="9" fill="#000" opacity="0.15" />
      <circle className="animate-glow-pulse" cx="100" cy="98" r="46" fill="url(#diyaGlow)" />
      <path
        d="M42,120 Q100,168 158,120 Q152,104 138,100 Q100,124 62,100 Q48,104 42,120 Z"
        fill="url(#diyaBowl)"
      />
      <ellipse cx="100" cy="104" rx="58" ry="14" fill="url(#diyaBowl)" />
      <ellipse cx="100" cy="101" rx="58" ry="13" fill="none" stroke="#FBE5B8" strokeWidth="1.5" opacity="0.6" />
      <g className="animate-flame">
        <path d="M100,96 C114,64 92,42 100,8 C108,42 86,64 100,96 Z" fill="url(#diyaFlame)" />
        <path d="M100,90 C108,68 96,54 100,32 C104,54 92,68 100,90 Z" fill="#FFFDE7" opacity="0.85" />
      </g>
      <line x1="100" y1="94" x2="100" y2="80" stroke="#4A2E0E" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function Trishul() {
  return (
    <svg
      viewBox="0 0 200 200"
      className="mx-auto h-24 w-24 sm:h-28 sm:w-28"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="trishulGlow" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#D4A017" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#D4A017" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="trishulMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBF4DE" />
          <stop offset="45%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#84610E" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="176" rx="30" ry="7" fill="#000" opacity="0.13" />
      <circle className="animate-divine-pulse" cx="100" cy="90" r="62" fill="url(#trishulGlow)" />
      <g className="animate-gentle-sway">
        {/* staff */}
        <rect x="96" y="72" width="8" height="104" rx="4" fill="url(#trishulMetal)" />
        {/* center prong */}
        <path d="M100,10 L108,72 L92,72 Z" fill="url(#trishulMetal)" />
        {/* left prong, curving outward */}
        <path d="M96,74 C60,64 48,30 58,4 C64,34 78,56 96,74 Z" fill="url(#trishulMetal)" />
        {/* right prong, curving outward */}
        <path d="M104,74 C140,64 152,30 142,4 C136,34 122,56 104,74 Z" fill="url(#trishulMetal)" />
        {/* crossbar accent */}
        <circle cx="100" cy="76" r="7" fill="#7A1F2B" />
        <circle cx="100" cy="76" r="7" fill="none" stroke="#D4A017" strokeWidth="1.5" opacity="0.8" />
      </g>
    </svg>
  );
}

// Fixed angle/distance/color/timing per particle — not random per
// render, so server and client markup match (no hydration mismatch)
// while still reading as an organic burst of thrown gulal.
const BURST_PARTICLES: { angle: number; dist: number; color: string; size: number; duration: string; delay: string }[] = [
  { angle: 0, dist: 66, color: "#F2B705", size: 9, duration: "2.3s", delay: "0s" },
  { angle: 30, dist: 58, color: "#D6316C", size: 7, duration: "2.7s", delay: "0.15s" },
  { angle: 60, dist: 70, color: "#4C9A4A", size: 8, duration: "2.5s", delay: "0.3s" },
  { angle: 90, dist: 60, color: "#3B82C4", size: 6, duration: "2.9s", delay: "0.45s" },
  { angle: 120, dist: 68, color: "#F2B705", size: 7, duration: "2.4s", delay: "0.6s" },
  { angle: 150, dist: 58, color: "#D6316C", size: 9, duration: "2.6s", delay: "0.75s" },
  { angle: 180, dist: 64, color: "#4C9A4A", size: 6, duration: "2.8s", delay: "0.2s" },
  { angle: 210, dist: 60, color: "#3B82C4", size: 8, duration: "2.3s", delay: "0.5s" },
  { angle: 240, dist: 70, color: "#D6316C", size: 7, duration: "2.5s", delay: "0.35s" },
  { angle: 270, dist: 58, color: "#F2B705", size: 6, duration: "2.7s", delay: "0.65s" },
  { angle: 300, dist: 66, color: "#4C9A4A", size: 9, duration: "2.4s", delay: "0.1s" },
  { angle: 330, dist: 62, color: "#3B82C4", size: 7, duration: "2.6s", delay: "0.55s" },
];

function ColorBurst() {
  return (
    <div className="relative mx-auto h-24 w-24 sm:h-28 sm:w-28" aria-hidden="true">
      {/* Warm center glow the colors appear to burst from */}
      <div className="absolute inset-0 rounded-full bg-accent-400/25 blur-md animate-glow-pulse" />
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500" />
      {BURST_PARTICLES.map((p, i) => (
        <span
          key={i}
          className="animate-color-burst absolute left-1/2 top-1/2 rounded-full"
          style={
            {
              width: p.size,
              height: p.size,
              marginLeft: -p.size / 2,
              marginTop: -p.size / 2,
              backgroundColor: p.color,
              "--angle": `${p.angle}deg`,
              "--dist": `${p.dist}px`,
              "--burst-duration": p.duration,
              "--burst-delay": p.delay,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
