import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BuilderItemForm from "@/components/admin/BuilderItemForm";

export default async function EditBuilderItemPage({ params }: { params: { id: string } }) {
  const item = await prisma.builderExtraItem.findUnique({
    where: { id: params.id },
    include: { category: true },
  });
  if (!item) notFound();

  return (
    <div className="max-w-lg">
      <Link
        href={`/admin/catalog?festival=${item.category.festivalSlug}&tab=extras`}
        className="text-sm text-slate-500 hover:underline"
      >
        ← Catalog
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mt-2 mb-6">Edit Builder Item</h1>
      <BuilderItemForm
        item={{
          id: item.id,
          categoryId: item.categoryId,
          categoryLabel: item.category.label,
          festivalSlug: item.category.festivalSlug,
          name: item.name,
          icon: item.icon,
          price: item.price,
          stock: item.stock,
          inventoryfySku: item.inventoryfySku,
        }}
      />
    </div>
  );
}
