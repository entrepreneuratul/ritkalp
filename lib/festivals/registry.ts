// =====================================================================
// FESTIVAL REGISTRY
// The one place every festival is registered. To add a new festival:
// write one more file shaped like navratri.ts/diwali.ts/holi.ts, then
// add it to `festivals` below. No component or CSS needs to change.
// =====================================================================

import type { FestivalConfig } from "./types";
import { navratri } from "./navratri";
import { diwali } from "./diwali";
import { holi } from "./holi";

export const festivals: FestivalConfig[] = [navratri, diwali, holi];

export function getFestival(slug: string): FestivalConfig | undefined {
  return festivals.find((f) => f.slug === slug);
}

export function isValidFestivalSlug(slug: string): boolean {
  return festivals.some((f) => f.slug === slug);
}

/**
 * Picks a sensible default festival for "/" based on the current
 * month against each festival's `dateHint` range, falling back to
 * Navratri (the flagship collection) the rest of the year. Simple
 * month-range heuristic — no calendar library needed.
 */
export function getDefaultFestivalSlug(): string {
  const month = new Date().getMonth() + 1; // 1-12
  const inSeason = festivals.find(
    (f) => month >= f.dateHint.fromMonth && month <= f.dateHint.toMonth
  );
  return inSeason?.slug ?? "navratri";
}
