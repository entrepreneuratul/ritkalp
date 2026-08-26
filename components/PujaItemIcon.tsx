// =====================================================================
// PUJA ITEM ICONS
// A small set of flat, geometric icons for the Kit Builder's tap-to-add
// extras and category tabs — same spirit as Pizzalio's flat topping
// dots (a plain colored shape reads faster than a photo at chip size).
// Every icon is `currentColor`-only, so it automatically re-colors with
// whichever festival theme is active (see lib/theme.ts) — no per-item
// image assets needed, and no raster generation required.
// =====================================================================

import type { PujaItemIconKey } from "@/lib/festivals/types";

export default function PujaItemIcon({
  icon,
  className = "",
}: {
  icon: PujaItemIconKey;
  className?: string;
}) {
  const Icon = icons[icon] ?? icons.flower;
  return <Icon className={className} />;
}

type IconFn = (props: { className?: string }) => JSX.Element;

const icons: Record<PujaItemIconKey, IconFn> = {
  diya: DiyaIcon,
  flower: FlowerIcon,
  coconut: CoconutIcon,
  kalash: KalashIcon,
  cloth: ClothIcon,
  sweet: SweetIcon,
  incense: IncenseIcon,
  fruit: FruitIcon,
  chunri: ChunriIcon,
  bell: BellIcon,
  thali: ThaliIcon,
  havan: HavanIcon,
};

function DiyaIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path
        d="M4 20c0 5 5.5 8 12 8s12-3 12-8"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <ellipse cx="16" cy="19.5" rx="12" ry="4" fill="currentColor" opacity={0.22} />
      <path
        d="M16 18c-8 0-13-2-13-4.5S8 9 16 9s13 2 13 4.5-5 4.5-13 4.5z"
        fill="currentColor"
      />
      <path
        d="M16 9c-1.3-2.4-1.1-4.6.3-6.4C17.7 4.4 17.9 6.6 16.6 9"
        fill="currentColor"
        opacity={0.85}
      />
    </svg>
  );
}

function FlowerIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="16"
          cy="9.5"
          rx="4.4"
          ry="6.4"
          fill="currentColor"
          opacity={0.85}
          transform={`rotate(${deg} 16 16)`}
        />
      ))}
      <circle cx="16" cy="16" r="3.6" fill="currentColor" />
    </svg>
  );
}

function CoconutIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="18" r="10" fill="currentColor" />
      <path
        d="M11 9c1.5-3 3.4-5 5-5s3.5 2 5 5"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <path
        d="M16 12v12M11 18h10M12.5 14.5h7M12.5 21.5h7"
        stroke="var(--puja-icon-inner, white)"
        strokeOpacity={0.55}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </svg>
  );
}

function KalashIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M9 12h14l1.5 3H7.5L9 12z" fill="currentColor" />
      <path
        d="M9.5 15c-1 3.5-1 7.7 0 10.5 1.2 1.5 4 2.5 6.5 2.5s5.3-1 6.5-2.5c1-2.8 1-7-0-10.5H9.5z"
        fill="currentColor"
        opacity={0.9}
      />
      <rect x="13" y="7" width="6" height="4" rx="1.5" fill="currentColor" />
      <path
        d="M16 3v4"
        stroke="currentColor"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <circle cx="16" cy="2.4" r="1.6" fill="currentColor" />
    </svg>
  );
}

function ClothIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path
        d="M5 8c3 2 19 2 22 0l-2 19c-6 2.5-12 2.5-18 0L5 8z"
        fill="currentColor"
      />
      <path
        d="M11 12.5c3 1 7 1 10 0M10.5 17c3.5 1.2 8 1.2 11.5 0M11 21.5c3 1 7 1 10 0"
        stroke="var(--puja-icon-inner, white)"
        strokeOpacity={0.45}
        strokeWidth={1.3}
        strokeLinecap="round"
      />
    </svg>
  );
}

function SweetIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <rect x="6" y="13" width="20" height="11" rx="2.5" fill="currentColor" />
      <path
        d="M9 13c0-4 3-7 7-7s7 3 7 7"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <circle cx="12" cy="18.5" r="1.2" fill="var(--puja-icon-inner, white)" opacity={0.6} />
      <circle cx="16" cy="19.5" r="1.2" fill="var(--puja-icon-inner, white)" opacity={0.6} />
      <circle cx="20" cy="18.5" r="1.2" fill="var(--puja-icon-inner, white)" opacity={0.6} />
    </svg>
  );
}

function IncenseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M11 26V13" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M21 26V13" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
      <ellipse cx="16" cy="27" rx="10" ry="2" fill="currentColor" opacity={0.25} />
      <path
        d="M11 13c-2-2.5-1-5 .5-7M21 13c2-2.5 1-5-.5-7"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={0.8}
      />
      <circle cx="11" cy="12" r="1.6" fill="currentColor" />
      <circle cx="21" cy="12" r="1.6" fill="currentColor" />
    </svg>
  );
}

function FruitIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="12" cy="19" r="7" fill="currentColor" />
      <circle cx="21" cy="19" r="7" fill="currentColor" opacity={0.85} />
      <path
        d="M15 9c1-2 2.5-3 4.5-3"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M13.5 8.5c1.5-1 2-3 1.7-4.5"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={0.7}
      />
    </svg>
  );
}

function ChunriIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path
        d="M16 3c6 4 11 4 11 4-1 10-5 18-11 22-6-4-10-12-11-22 0 0 5 0 11-4z"
        fill="currentColor"
      />
      {[9, 14, 19, 24].map((y) => (
        <circle key={y} cx="11" cy={y} r="1" fill="var(--puja-icon-inner, white)" opacity={0.5} />
      ))}
      {[9, 14, 19, 24].map((y) => (
        <circle key={`r${y}`} cx="21" cy={y} r="1" fill="var(--puja-icon-inner, white)" opacity={0.5} />
      ))}
    </svg>
  );
}

function BellIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path
        d="M16 5c-4 2-6 6-6 11v3l-2 4h16l-2-4v-3c0-5-2-9-6-11z"
        fill="currentColor"
      />
      <circle cx="16" cy="27" r="2.4" fill="currentColor" />
      <path d="M16 5V2" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
    </svg>
  );
}

function ThaliIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <circle cx="16" cy="16" r="13" fill="currentColor" opacity={0.2} />
      <circle cx="16" cy="16" r="9" fill="currentColor" />
      <circle cx="16" cy="16" r="3" fill="var(--puja-icon-inner, white)" opacity={0.6} />
    </svg>
  );
}

function HavanIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className}>
      <path d="M8 26l4-14h8l4 14H8z" fill="currentColor" />
      <path
        d="M14 12c-1.5-2.5-.8-4.6.6-6.4 1.2 1.8 1.8 3.7.2 6.4M17.5 12c1-2.2 0.6-4-0.6-5.6 1.6 1 2.6 2.6 2 5.6"
        fill="currentColor"
        opacity={0.85}
      />
    </svg>
  );
}
