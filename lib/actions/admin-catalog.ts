"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { KitKind } from "@prisma/client";
import { setKitLineItems } from "@/lib/kitItems";
import { fetchInventoryfyCatalog } from "@/lib/inventoryfy";
import { getFestival } from "@/lib/festivals/registry";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Not authorized");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---- Kits (curated + day) --------------------------------------------
// Full admin CRUD, by design — a Kit is the presentational/commercial
// wrapper (name, description, image, badge, featured, which day) and
// stays entirely Ritkalp's own to manage. Its *included items*, below,
// are the one part of this action that's constrained: only existing,
// already-Inventoryfy-linked Items can be picked, never invented here
// — see lib/kitItems.ts's setKitLineItems for why this is a different
// function from the one prisma/seed.ts uses.

export async function saveKitAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const festivalSlug = String(formData.get("festivalSlug"));
  const kind = String(formData.get("kind")) as KitKind;
  const dayNumberRaw = String(formData.get("dayNumber") ?? "");
  const name = String(formData.get("name"));
  const description = String(formData.get("description"));
  const image = String(formData.get("image"));
  const itemIds = formData.getAll("itemIds").map(String);
  const featured = formData.get("featured") === "on";
  const draft = formData.get("draft") === "on";
  const badge = String(formData.get("badge") ?? "").trim();

  // Price/stock are mirrored from Inventoryfy once a kit is linked
  // (inventoryfySku set) — KitForm only renders a price input at all
  // for a brand-new, not-yet-synced kit (Kit.price has no DB default,
  // so a genuinely new kit still needs a starting value; run
  // `npm run sync:inventoryfy` afterwards to create its real Inventoryfy
  // bundle product and start mirroring for real).
  const priceRaw = formData.get("price");
  const price = priceRaw !== null ? Number(priceRaw) : undefined;

  const data = {
    festivalSlug,
    kind,
    dayNumber: kind === KitKind.DAY && dayNumberRaw ? Number(dayNumberRaw) : null,
    name,
    description,
    image,
    featured,
    draft,
    badge: badge || null,
  };

  const kitId = id || `${festivalSlug}__${kind === KitKind.DAY ? "day" : "curated"}__${slugify(name)}`;
  if (id) {
    await prisma.kit.update({ where: { id }, data: price !== undefined ? { ...data, price } : data });
  } else {
    await prisma.kit.create({ data: { id: kitId, price: price ?? 0, ...data } });
  }
  await setKitLineItems(prisma, { kitId, itemIds });

  revalidatePath("/admin/catalog");
  revalidatePath(`/[festival]`, "page");
  redirect(`/admin/catalog?festival=${festivalSlug}`);
}

export async function deleteKitAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const festivalSlug = String(formData.get("festivalSlug"));
  await prisma.kit.delete({ where: { id } });
  revalidatePath("/admin/catalog");
  redirect(`/admin/catalog?festival=${festivalSlug}`);
}

// ---- Kit Builder extra categories --------------------------------------
// Categories are a pure Ritkalp-side organizing concept (a label the
// Kit Builder groups extras under) — they don't correspond to anything
// in Inventoryfy, so unlike the items inside them, creating one here is
// fine.

export async function saveBuilderCategoryAction(formData: FormData) {
  await requireAdmin();
  const festivalSlug = String(formData.get("festivalSlug"));
  const label = String(formData.get("label")).trim();
  if (!label) return;

  await prisma.builderExtraCategory.create({
    data: { festivalSlug, categoryKey: slugify(label), label, sortOrder: 99 },
  });
  revalidatePath("/admin/catalog");
  redirect(`/admin/catalog?festival=${festivalSlug}&tab=extras`);
}

// ---- Items & Builder Extras: intentionally NO create/edit/delete here -
// Every Item and BuilderExtraItem must be a 1:1 mirror of a real
// Inventoryfy product (see README's "Inventory model") — Ritkalp no
// longer creates, edits, or deletes either one by hand. What exists and
// what it costs/how much is in stock all come from Inventoryfy;
// presentation (which Kit an item appears in) is still fully editable
// via saveKitAction above. The one exception is fetchNewItemsAction
// below — it still only ever *creates from what Inventoryfy already
// says exists*, never invents a name/price/stock locally, so it doesn't
// weaken the "Inventoryfy is the source of truth" rule.

/**
 * The reverse half of scripts/sync-inventoryfy.ts, which only ever
 * pushes local rows *out*: this pulls newly-added Inventoryfy products
 * *in*. Owner-triggered only (a button on the Items tab) — deliberately
 * not automatic/scheduled, so a bulk warehouse re-stock or catalog
 * cleanup in Inventoryfy never silently reshapes Ritkalp's catalog
 * mid-session.
 *
 * Scope: creates new `Item` rows only (kit components — the thing the
 * owner actually asked to close the gap on). A `BuilderExtraItem` also
 * needs a category and an icon assigned, both Ritkalp-only concepts
 * Inventoryfy has no data for and that this app no longer has any admin
 * UI to set after the fact — so a genuinely new Kit Builder extra still
 * needs a one-off decision outside this button for now (see the
 * README's "Inventory model").
 *
 * Matching: a product qualifies as "new" when its SKU isn't already
 * used by any local Item/BuilderExtraItem/Kit (inventoryfySku is
 * @unique per model, so any collision means it's already mirrored
 * somewhere), it isn't a bundle (a bundle product is always one of
 * Ritkalp's own Kits — never something to import as a plain component),
 * and its Inventoryfy category name matches this festival's
 * `nameEnglish` (the same category sync-inventoryfy.ts creates one of
 * per festival) — so running this on the Navratri tab can't pull in a
 * Diwali-only product.
 */
export async function fetchNewItemsAction(formData: FormData) {
  await requireAdmin();
  const festivalSlug = String(formData.get("festivalSlug"));
  const festival = getFestival(festivalSlug);
  if (!festival) throw new Error(`Unknown festival: ${festivalSlug}`);

  const [catalog, existingItems, existingExtras, existingKits] = await Promise.all([
    fetchInventoryfyCatalog(),
    prisma.item.findMany({ where: { inventoryfySku: { not: null } }, select: { inventoryfySku: true } }),
    prisma.builderExtraItem.findMany({ where: { inventoryfySku: { not: null } }, select: { inventoryfySku: true } }),
    prisma.kit.findMany({ where: { inventoryfySku: { not: null } }, select: { inventoryfySku: true } }),
  ]);
  const knownSkus = new Set(
    [...existingItems, ...existingExtras, ...existingKits].map((row) => row.inventoryfySku as string),
  );

  const newProducts = catalog.filter(
    (p) => !p.isBundle && p.category === festival.nameEnglish && !knownSkus.has(p.sku),
  );

  if (newProducts.length > 0) {
    await prisma.item.createMany({
      data: newProducts.map((p) => ({
        festivalSlug,
        name: p.name,
        price: p.price,
        stock: p.availableStock,
        inventoryfySku: p.sku,
      })),
    });
  }

  revalidatePath("/admin/catalog");
  redirect(`/admin/catalog?festival=${festivalSlug}&tab=items&fetched=${newProducts.length}`);
}
