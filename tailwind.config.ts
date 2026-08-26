import type { Config } from "tailwindcss";

/**
 * Builds a Tailwind color scale that reads from CSS custom properties
 * instead of fixed hex values, using the `rgb(var(--x) / <alpha-value>)`
 * pattern — this is what lets `bg-primary-600`, `text-accent-700/70`
 * etc. keep working with Tailwind's opacity modifiers while their
 * actual color comes from whichever festival's CSS vars are currently
 * in scope (see lib/theme.ts + app/[festival]/layout.tsx).
 */
function cssVarScale(name: string) {
  const scale: Record<string, string> = {
    DEFAULT: `rgb(var(--color-${name}) / <alpha-value>)`,
  };
  [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach((shade) => {
    scale[shade] = `rgb(var(--color-${name}-${shade}) / <alpha-value>)`;
  });
  return scale;
}

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- Semantic, theme-swappable brand palette ------------------
        // Every festival provides its own hex values for these same
        // three color families (see lib/festivals/*.ts ThemeTokens) —
        // components only ever reference primary/accent/surface, never
        // a hardcoded color, so switching festivals re-colors the
        // entire site with zero component-level changes.
        primary: cssVarScale("primary"), // headings, nav, solid buttons
        accent: cssVarScale("accent"), // borders, icons, badges
        surface: {
          DEFAULT: "rgb(var(--color-surface) / <alpha-value>)",
          soft: "rgb(var(--color-surface-soft) / <alpha-value>)",
          deep: "rgb(var(--color-surface-deep) / <alpha-value>)",
        },
        // Text color for content sitting on a solid `bg-accent` surface
        // (buttons, badges). Auto-picked per festival in lib/theme.ts
        // (whichever of the theme's dark/light color has better
        // contrast against that festival's accent) — so a bright accent
        // (Navratri's gold) gets dark text and a deep accent (Diwali's
        // purple) gets light text, automatically, for any festival.
        onaccent: "rgb(var(--color-onaccent) / <alpha-value>)",
      },
      fontFamily: {
        // Elegant, Devanagari-friendly display font for headings.
        display: ["var(--font-display)", "Georgia", "serif"],
        // Clean modern sans-serif for body copy.
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        // Heavy condensed display for bold English UI chrome (nav, stat
        // numbers, marquee, Kit Builder) — see app/layout.tsx. Hindi
        // headings keep using `font-display` above, untouched.
        heavy: ["var(--font-heavy)", "Impact", "sans-serif"],
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.75" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.4) rotate(var(--pop-rotate, 0deg))" },
          "60%": { opacity: "1", transform: "scale(1.12) rotate(var(--pop-rotate, 0deg))" },
          "100%": { opacity: "1", transform: "scale(1) rotate(var(--pop-rotate, 0deg))" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.8s ease-out forwards",
        flicker: "flicker 2.5s ease-in-out infinite",
        marquee: "marquee 22s linear infinite",
        "pop-in": "pop-in 0.5s var(--ease-spring, cubic-bezier(0.34,1.56,0.64,1)) both",
      },
    },
  },
  plugins: [],
};
export default config;
