// =====================================================================
// DB-BACKED CATALOG — server-only. Reads the Kit/BuilderExtra* tables
// (see prisma/schema.prisma, seeded from the original lib/festivals/*.ts
// content by prisma/seed.ts) and reshapes them into the exact same
// KitItem[]/BuilderConfig shapes components already expect
// (lib/festivals/types.ts) — so KitsGrid, KitCard, KitBuilder, DayGuide
// need ~zero changes; only the page-level data source moved from a
// static import to a DB query. Out-of-stock items are simply excluded
// from what the storefront sees; the admin catalog view (lib/admin/
// catalog.ts) queries the same tables unfiltered.
// =====================================================================

import { unstable_noStore as noStore } from "next/cache";
import { prisma } from "./prisma";
import type { BuilderConfig, KitItem, PujaItemIconKey } from "./festivals/types";

// Kit's included-items list now lives in the Item/KitLineItem tables
// (see prisma/schema.prisma) instead of a flat text column — this
// include shape is what toKitItem() below expects.
const KIT_WITH_ITEMS = {
  lineItems: {
    orderBy: { sortOrder: "asc" as const },
    include: { item: true },
  },
};

export async function getStorefrontKits(festivalSlug: string): Promise<KitItem[]> {
  noStore();
  const rows = await prisma.kit.findMany({
    where: { festivalSlug, kind: "CURATED", stock: { gt: 0 } },
    orderBy: { sortOrder: "asc" },
    include: KIT_WITH_ITEMS,
  });
  return rows.map(toKitItem);
}

export async function getStorefrontDayKits(festivalSlug: string): Promise<KitItem[]> {
  noStore();
  const rows = await prisma.kit.findMany({
    where: { festivalSlug, kind: "DAY", stock: { gt: 0 } },
    orderBy: { sortOrder: "asc" },
    include: KIT_WITH_ITEMS,
  });
  return rows.map(toKitItem);
}

export async function getStorefrontBuilderCategories(
  festivalSlug: string
): Promise<BuilderConfig["categories"]> {
  noStore();
  const categories = await prisma.builderExtraCategory.findMany({
    where: { festivalSlug },
    orderBy: { sortOrder: "asc" },
    include: { items: { where: { stock: { gt: 0 } }, orderBy: { sortOrder: "asc" } } },
  });

  return categories
    .filter((c) => c.items.length > 0)
    .map((c) => ({
      id: c.categoryKey,
      label: c.label,
      items: c.items.map((item) => ({
        id: item.itemKey,
        name: item.name,
        icon: item.icon as PujaItemIconKey,
        price: item.price,
      })),
    }));
}

function toKitItem(row: {
  id: string;
  name: string;
  description: string;
  image: string;
  lineItems: { item: { name: string } }[];
  price: number;
  featured: boolean;
  badge: string | null;
  draft: boolean;
}): KitItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image,
    items: row.lineItems.map((li) => li.item.name),
    startingPrice: row.price,
    featured: row.featured,
    badge: row.badge ?? undefined,
    draft: row.draft,
  };
}
