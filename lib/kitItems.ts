// =====================================================================
// KIT LINE ITEMS — shared sync logic between prisma/seed.ts and the
// admin "save kit" action (lib/actions/admin-catalog.ts). A kit's
// included-items list is entered as one name per line (same UX as
// before — see components/admin/KitForm.tsx's `items` textarea); this
// turns that plain list into real rows: one `Item` per distinct name
// *within that festival* (reused automatically if the exact same name
// already exists on another kit — e.g. "कपूर" on five different kits
// is one Item row, five KitLineItem links), and replaces the kit's
// current KitLineItem set with a fresh one matching the given order.
// =====================================================================

import type { PrismaClient } from "@prisma/client";

export async function syncKitLineItems(
  prisma: PrismaClient,
  { festivalSlug, kitId, itemNames }: { festivalSlug: string; kitId: string; itemNames: string[] }
) {
  const items = await Promise.all(
    itemNames.map((name) =>
      prisma.item.upsert({
        where: { festivalSlug_name: { festivalSlug, name } },
        update: {},
        create: { festivalSlug, name },
      })
    )
  );

  await prisma.$transaction([
    prisma.kitLineItem.deleteMany({ where: { kitId } }),
    prisma.kitLineItem.createMany({
      data: items.map((item, index) => ({
        kitId,
        itemId: item.id,
        sortOrder: index,
      })),
    }),
  ]);
}

/**
 * The admin-facing equivalent of syncKitLineItems above, deliberately
 * NOT the same function — this one never creates an Item, only links a
 * kit to items that already exist (and are already Inventoryfy-synced,
 * in practice, since every Item now must be — see README's "Inventory
 * model"). syncKitLineItems stays as-is for prisma/seed.ts's one-time
 * initial content load, which legitimately runs *before* any
 * Inventoryfy linkage exists; this one is what
 * lib/actions/admin-catalog.ts's saveKitAction uses, where inventing a
 * new item name on the fly would silently create an unsynced,
 * un-mirrored item — exactly what's not allowed anymore.
 */
export async function setKitLineItems(
  prisma: PrismaClient,
  { kitId, itemIds }: { kitId: string; itemIds: string[] }
) {
  await prisma.$transaction([
    prisma.kitLineItem.deleteMany({ where: { kitId } }),
    prisma.kitLineItem.createMany({
      data: itemIds.map((itemId, index) => ({
        kitId,
        itemId,
        sortOrder: index,
      })),
    }),
  ]);
}
