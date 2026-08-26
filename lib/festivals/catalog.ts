// =====================================================================
// CATALOG — resolves purchasable items for a given festival
//
// The cart (context/CartContext.tsx, components/CartDrawer.tsx,
// lib/orderMessage.ts) stores only a { festivalSlug, kitId, quantity }
// per line item. This file is the single place that resolves a
// (festival, id) pair to full kit details, across BOTH catalogs — the
// curated Shop Kits and the day-wise samagri kits (auto-built from
// dayGuide.days) — so the cart works the same way for either.
// =====================================================================

import type { FestivalConfig, KitItem } from "./types";

const DEFAULT_DAY_KIT_PRICE = 349;

/**
 * Auto-builds one purchasable "day kit" per day in a festival's guide,
 * from that day's `samagri` list (plus any non-optional
 * `additionalSection.samagri`, deduped) — mirrors the original
 * Navratri site's data/daySamagriKits.ts logic, generalized to any
 * number of days.
 */
export function buildDayKits(festival: FestivalConfig): KitItem[] {
  return festival.dayGuide.days.map((day) => {
    const extraItems = day.additionalSection?.optional
      ? []
      : day.additionalSection?.samagri ?? [];
    const items = Array.from(new Set([...day.samagri, ...extraItems]));

    return {
      id: `day-${day.dayNumber}-samagri`,
      name: `Day ${day.dayNumber} — ${day.nameHindi} पूजा सामग्री`,
      description: `${day.nameEnglish} (${day.nameHindi}) की पूजा के लिए ज़रूरी सामग्री।`,
      image: day.image,
      items,
      startingPrice: day.kitPrice ?? DEFAULT_DAY_KIT_PRICE,
    };
  });
}

export function getAllPurchasableItems(festival: FestivalConfig): KitItem[] {
  return [...festival.kits.items, ...buildDayKits(festival)];
}

export function findPurchasableItem(
  festival: FestivalConfig,
  kitId: string
): KitItem | undefined {
  return getAllPurchasableItems(festival).find((item) => item.id === kitId);
}
