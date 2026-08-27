import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { festivals } from "@/lib/festivals/registry";
import KitForm from "@/components/admin/KitForm";

export default async function NewKitPage({ searchParams }: { searchParams: { festival?: string } }) {
  const festivalSlug = searchParams.festival ?? festivals[0].slug;
  const availableItems = await prisma.item.findMany({
    where: { festivalSlug, inventoryfySku: { not: null } },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-2xl">
      <Link href={`/admin/catalog?festival=${festivalSlug}`} className="text-sm text-slate-500 hover:underline">
        ← Catalog
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mt-2 mb-6">New Kit</h1>
      <KitForm kit={{ festivalSlug, kind: "CURATED" }} availableItems={availableItems} />
    </div>
  );
}
