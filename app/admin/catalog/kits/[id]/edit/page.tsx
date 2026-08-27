import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteKitAction } from "@/lib/actions/admin-catalog";
import KitForm from "@/components/admin/KitForm";

export default async function EditKitPage({ params }: { params: { id: string } }) {
  const kit = await prisma.kit.findUnique({
    where: { id: params.id },
    include: { lineItems: { orderBy: { sortOrder: "asc" }, include: { item: true } } },
  });
  if (!kit) notFound();

  const selectedItemIds = kit.lineItems.map((li) => li.item.id);

  const syncedItems = await prisma.item.findMany({
    where: { festivalSlug: kit.festivalSlug, inventoryfySku: { not: null } },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });
  // Union with whatever this kit already includes, even if (unexpectedly)
  // not yet synced — otherwise an already-selected item with no
  // inventoryfySku would have no checkbox to render, and saving would
  // silently drop it from the kit.
  const syncedIds = new Set(syncedItems.map((i) => i.id));
  const unsyncedButIncluded = kit.lineItems
    .filter((li) => !syncedIds.has(li.item.id))
    .map((li) => ({ id: li.item.id, name: `${li.item.name} (not yet synced)` }));
  const availableItems = [...syncedItems, ...unsyncedButIncluded];

  return (
    <div className="max-w-2xl">
      <Link href={`/admin/catalog?festival=${kit.festivalSlug}`} className="text-sm text-slate-500 hover:underline">
        ← Catalog
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mt-2 mb-6">Edit Kit</h1>
      <KitForm kit={{ ...kit, selectedItemIds }} availableItems={availableItems} />

      <form action={deleteKitAction} className="mt-4">
        <input type="hidden" name="id" value={kit.id} />
        <input type="hidden" name="festivalSlug" value={kit.festivalSlug} />
        <button type="submit" className="text-xs text-red-500 hover:underline">
          Delete this kit
        </button>
      </form>
    </div>
  );
}
