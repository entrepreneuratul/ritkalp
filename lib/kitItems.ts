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
