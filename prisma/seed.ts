// =====================================================================
// SEED — one-time migration of the existing hardcoded catalog
// (lib/festivals/*.ts: kits.items, the auto-built day-kits, and
// builder.categories) into the database, so nothing you already
// reviewed (real Navratri content, draft Diwali/Holi content) has to be
// retyped. Safe to re-run — upserts by a stable key, never duplicates.
//
// Run with: npm run db:seed
// =====================================================================

import { PrismaClient, KitKind } from "@prisma/client";
import { festivals } from "../lib/festivals/registry";
import { buildDayKits } from "../lib/festivals/catalog";
import { syncKitLineItems } from "../lib/kitItems";

const prisma = new PrismaClient();

async function main() {
  for (const festival of festivals) {
    console.log(`\n— ${festival.nameEnglish} (${festival.slug}) —`);

    // ---- Curated "Shop Kits" ----
    for (const [index, kit] of festival.kits.items.entries()) {
      const id = `${festival.slug}__curated__${kit.id}`;
      await prisma.kit.upsert({
        where: { id },
        update: {
          name: kit.name,
          description: kit.description,
          image: kit.image,
          price: kit.startingPrice,
          featured: kit.featured ?? false,
          badge: kit.badge ?? null,
          draft: kit.draft ?? false,
          sortOrder: index,
        },
        create: {
          id,
          festivalSlug: festival.slug,
          kind: KitKind.CURATED,
          name: kit.name,
          description: kit.description,
          image: kit.image,
          price: kit.startingPrice,
          featured: kit.featured ?? false,
          badge: kit.badge ?? null,
          draft: kit.draft ?? false,
          sortOrder: index,
        },
      });
      await syncKitLineItems(prisma, { festivalSlug: festival.slug, kitId: id, itemNames: kit.items });
    }
    console.log(`  ${festival.kits.items.length} curated kits`);

    // ---- Auto-built day-kits (lib/festivals/catalog.ts) ----
    const dayKits = buildDayKits(festival);
    for (const [index, kit] of dayKits.entries()) {
      const dayNumber = festival.dayGuide.days[index]?.dayNumber ?? index + 1;
      const id = `${festival.slug}__day__${kit.id}`;
      await prisma.kit.upsert({
        where: { id },
        update: {
          name: kit.name,
          description: kit.description,
          image: kit.image,
          price: kit.startingPrice,
          dayNumber,
          sortOrder: index,
        },
        create: {
          id,
          festivalSlug: festival.slug,
          kind: KitKind.DAY,
          dayNumber,
          name: kit.name,
          description: kit.description,
          image: kit.image,
          price: kit.startingPrice,
          sortOrder: index,
        },
      });
      await syncKitLineItems(prisma, { festivalSlug: festival.slug, kitId: id, itemNames: kit.items });
    }
    console.log(`  ${dayKits.length} day-kits`);

    // ---- Kit Builder extras ----
    let extraCount = 0;
    for (const [catIndex, category] of festival.builder.categories.entries()) {
      const dbCategory = await prisma.builderExtraCategory.upsert({
        where: { festivalSlug_categoryKey: { festivalSlug: festival.slug, categoryKey: category.id } },
        update: { label: category.label, sortOrder: catIndex },
        create: {
          festivalSlug: festival.slug,
          categoryKey: category.id,
          label: category.label,
          sortOrder: catIndex,
        },
      });

      for (const [itemIndex, item] of category.items.entries()) {
        await prisma.builderExtraItem.upsert({
          where: { categoryId_itemKey: { categoryId: dbCategory.id, itemKey: item.id } },
          update: { name: item.name, icon: item.icon, price: item.price, sortOrder: itemIndex },
          create: {
            categoryId: dbCategory.id,
            itemKey: item.id,
            name: item.name,
            icon: item.icon,
            price: item.price,
            sortOrder: itemIndex,
          },
        });
        extraCount++;
      }
    }
    console.log(`  ${extraCount} builder extras across ${festival.builder.categories.length} categories`);
  }

  console.log("\nSeed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
