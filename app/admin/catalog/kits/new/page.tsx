import Link from "next/link";
import { festivals } from "@/lib/festivals/registry";
import KitForm from "@/components/admin/KitForm";

export default function NewKitPage({ searchParams }: { searchParams: { festival?: string } }) {
  const festivalSlug = searchParams.festival ?? festivals[0].slug;

  return (
    <div className="max-w-2xl">
      <Link href={`/admin/catalog?festival=${festivalSlug}`} className="text-sm text-slate-500 hover:underline">
        ← Catalog
      </Link>
      <h1 className="text-2xl font-bold text-slate-800 mt-2 mb-6">New Kit</h1>
      <KitForm kit={{ festivalSlug, kind: "CURATED" }} />
    </div>
  );
}
