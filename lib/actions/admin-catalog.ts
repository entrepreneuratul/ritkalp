"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { KitKind } from "@prisma/client";
import { syncKitLineItems } from "@/lib/kitItems";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Not authorized");
}

function parseItemsList(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---- Kits (curated + day) --------------------------------------------

export async function saveKitAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const festivalSlug = String(formData.get("festivalSlug"));
  const kind = String(formData.get("kind")) as KitKind;
  const dayNumberRaw = String(formData.get("dayNumber") ?? "");
  const name = String(formData.get("name"));
  const description = String(formData.get("description"));
  const image = String(formData.get("image"));
  const itemNames = parseItemsList(String(formData.get("items") ?? ""));
  const featured = formData.get("featured") === "on";
  const draft = formData.get("draft") === "on";
  const badge = String(formData.get("badge") ?? "").trim();

  // Price/stock are mirrored from Inventoryfy once a kit is linked
  // (inventoryfySku set) — KitForm only renders a price input at all
  // for a brand-new, not-yet-synced kit (Kit.price has no DB default,
  // so a genuinely new kit still needs a starting value; run
  // `npm run sync:inventoryfy` afterwards to create its real Inventoryfy
  // product and start mirroring for real).
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
  // Each line is upserted into the shared Item table for this festival
  // and re-linked in the given order — see lib/kitItems.ts.
  await syncKitLineItems(prisma, { festivalSlug, kitId, itemNames });

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

// ---- Kit Builder extras -----------------------------------------------

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

export async function saveBuilderItemAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const categoryId = String(formData.get("categoryId"));
  const festivalSlug = String(formData.get("festivalSlug"));
  const name = String(formData.get("name")).trim();
  const icon = String(formData.get("icon"));
  // Same story as saveKitAction: price is mirrored from Inventoryfy
  // once linked — the form only submits one for a brand-new extra.
  const priceRaw = formData.get("price");
  const price = priceRaw !== null ? Number(priceRaw) : undefined;

  if (id) {
    await prisma.builderExtraItem.update({
      where: { id },
      data: price !== undefined ? { name, icon, price } : { name, icon },
    });
  } else {
    await prisma.builderExtraItem.create({
      data: { categoryId, itemKey: slugify(name), name, icon, price: price ?? 0, sortOrder: 99 },
    });
  }

  revalidatePath("/admin/catalog");
  redirect(`/admin/catalog?festival=${festivalSlug}&tab=extras`);
}

export async function deleteBuilderItemAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const festivalSlug = String(formData.get("festivalSlug"));
  await prisma.builderExtraItem.delete({ where: { id } });
  revalidatePath("/admin/catalog");
  redirect(`/admin/catalog?festival=${festivalSlug}&tab=extras`);
}

// ---- Master item list (Item / KitLineItem — see lib/kitItems.ts) -----
// Editing a kit's "items" textarea (saveKitAction, above) is still the
// normal way to add/remove what's IN a kit. This is for the separate
// case of adjusting a shared Item's own price/stock everywhere it's
// used at once, without retyping its kit's item list.

export async function updateItemAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const festivalSlug = String(formData.get("festivalSlug"));
  const priceRaw = String(formData.get("price") ?? "").trim();

  // Only reachable pre-sync anyway (the admin UI hides this form once
  // an item has an inventoryfySku — see app/admin/catalog/page.tsx) —
  // price becomes Inventoryfy-mirrored after that.
  await prisma.item.update({
    where: { id },
    data: { price: priceRaw ? Number(priceRaw) : null },
  });

  revalidatePath("/admin/catalog");
  redirect(`/admin/catalog?festival=${festivalSlug}&tab=items`);
}

/** Creates a standalone Item, not yet attached to any kit — for
 *  pre-stocking a shared item (with its own price) before it's added to
 *  a kit's "Included items" box, or just to record something separately.
 *  Upserts on (festivalSlug, name) so re-adding an existing name just
 *  updates its price/stock instead of erroring. */
export async function createItemAction(formData: FormData) {
  await requireAdmin();
  const festivalSlug = String(formData.get("festivalSlug"));
  const name = String(formData.get("name") ?? "").trim();
  const priceRaw = String(formData.get("price") ?? "").trim();
  if (!name) return;

  await prisma.item.upsert({
    where: { festivalSlug_name: { festivalSlug, name } },
    update: { price: priceRaw ? Number(priceRaw) : null },
    create: { festivalSlug, name, price: priceRaw ? Number(priceRaw) : null },
  });

  revalidatePath("/admin/catalog");
  redirect(`/admin/catalog?festival=${festivalSlug}&tab=items`);
}

/** Only succeeds for an item that isn't used in any kit (the KitLineItem
 *  foreign key is RESTRICT — deleting one still in use would otherwise
 *  fail with a raw DB error, so we check first and no-op with a message
 *  instead of letting that surface to the admin as a crash). */
export async function deleteItemAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const festivalSlug = String(formData.get("festivalSlug"));

  const usageCount = await prisma.kitLineItem.count({ where: { itemId: id } });
  if (usageCount > 0) {
    redirect(
      `/admin/catalog?festival=${festivalSlug}&tab=items&error=${encodeURIComponent(
        `Can't delete — still used in ${usageCount} kit(s). Remove it from those kits' item lists first.`
      )}`
    );
  }

  await prisma.item.delete({ where: { id } });
  revalidatePath("/admin/catalog");
  redirect(`/admin/catalog?festival=${festivalSlug}&tab=items`);
}
