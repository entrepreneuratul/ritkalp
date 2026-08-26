import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BuilderItemForm from "@/components/admin/BuilderItemForm";

export default async function NewBuilderItemPage({
  searchParams,
}: {
  searchParams: { festival?: string; category?: string };
}) {
  if (!searchParams.category) notFound();
  const category = await prisma.builderExtraCategory.findUnique({
    where: { id: searchParams.category },
  });
  if (!category) notFound();

  return (
    <div className="max-w-lg">
      <Link
        href={`/admin/catalog?festival=${category.festivalSlug}&tab=extras`}
        className="text-sm text-slate-500 hover:underline"
      >
        ← Catalog
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mt-2 mb-6">New Builder Item</h1>
      <BuilderItemForm
        item={{
          categoryId: category.id,
          categoryLabel: category.label,
          festivalSlug: category.festivalSlug,
        }}
      />
    </div>
  );
}
