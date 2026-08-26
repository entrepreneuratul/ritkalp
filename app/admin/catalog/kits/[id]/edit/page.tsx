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

  const items = kit.lineItems.map((li) => li.item.name);

  return (
    <div className="max-w-2xl">
      <Link href={`/admin/catalog?festival=${kit.festivalSlug}`} className="text-sm text-slate-500 hover:underline">
        ← Catalog
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mt-2 mb-6">Edit Kit</h1>
      <KitForm kit={{ ...kit, items }} />

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
