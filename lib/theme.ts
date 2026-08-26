// =====================================================================
// THEME ENGINE
// Converts a festival's ThemeTokens (friendly hex colors, one file per
// festival — see lib/festivals/*.ts) into the CSS custom properties
// Tailwind's color config reads via the
// `rgb(var(--color-x) / <alpha-value>)` pattern (see tailwind.config.ts).
//
// Applied once, as an inline style, on the themed wrapper <div> in
// app/[festival]/layout.tsx. Every `bg-primary-600`, `text-accent-700`,
// `bg-surface` class anywhere in the app then resolves through these
// variables — switching festivals re-colors the whole site with zero
// component-level theme logic, and it's computed server-side so there's
// no flash of the wrong colors.
// =====================================================================

import type { CSSProperties } from "react";
import type { ColorScale, ThemeTokens } from "./festivals/types";

/** "#7A1F2B" -> "122 31 43" (space-separated, what rgb(var(..) / a) needs). */
function hexToRgbTriplet(hex: string): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r} ${g} ${b}`;
}

// ---- Auto contrast pick for text sitting ON TOP of the accent color ----
// A few buttons/badges (WhatsAppButton, KitCard, CartDrawer, DayGuide's
// active day chip, CartIcon's badge) render as solid `bg-accent` with
// text on top. Which text color reads clearly depends on how light or
// dark that particular festival's accent is (Navratri's gold is light
// -> wants dark text; Diwali's purple is dark -> wants light text) —
// rather than hardcoding one choice, we compute WCAG relative luminance
// and pick whichever of the theme's dark (primary-900) or light
// (surface) color gives the higher contrast ratio against the accent.
// See tailwind.config.ts's `onaccent` color / the `text-onaccent` class.
function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function pickOnAccentColor(theme: ThemeTokens): string {
  const accentLum = relativeLuminance(theme.accent.DEFAULT);
  const darkLum = relativeLuminance(theme.primary[900]);
  const lightLum = relativeLuminance(theme.surface.DEFAULT);
  const darkWins = contrastRatio(accentLum, darkLum) >= contrastRatio(accentLum, lightLum);
  return darkWins ? theme.primary[900] : theme.surface.DEFAULT;
}

function scaleToVars(prefix: string, scale: ColorScale): Record<string, string> {
  const vars: Record<string, string> = {
    [`--color-${prefix}`]: hexToRgbTriplet(scale.DEFAULT),
  };
  (Object.keys(scale) as (keyof ColorScale)[]).forEach((key) => {
    if (key === "DEFAULT") return;
    vars[`--color-${prefix}-${key}`] = hexToRgbTriplet(scale[key]);
  });
  return vars;
}

export function buildThemeCssVars(theme: ThemeTokens): CSSProperties {
  const vars: Record<string, string> = {
    ...scaleToVars("primary", theme.primary),
    ...scaleToVars("accent", theme.accent),
    "--color-surface": hexToRgbTriplet(theme.surface.DEFAULT),
    "--color-surface-soft": hexToRgbTriplet(theme.surface.soft),
    "--color-surface-deep": hexToRgbTriplet(theme.surface.deep),
    "--color-onaccent": hexToRgbTriplet(pickOnAccentColor(theme)),
  };
  // CSS custom properties aren't in React's CSSProperties type — cast.
  return vars as CSSProperties;
}
