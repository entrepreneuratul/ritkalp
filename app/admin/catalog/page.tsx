import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { festivals } from "@/lib/festivals/registry";
import {
  saveBuilderCategoryAction,
  deleteBuilderItemAction,
  updateItemAction,
  createItemAction,
  deleteItemAction,
} from "@/lib/actions/admin-catalog";
import { PUJA_ICON_KEYS } from "@/lib/festivals/types";

type Tab = "kits" | "extras" | "items";

export default async function AdminCatalogPage({
  searchParams,
}: {
  searchParams: { festival?: string; tab?: string; error?: string };
}) {
  const festivalSlug = searchParams.festival ?? festivals[0].slug;
  const tab: Tab =
    searchParams.tab === "extras" ? "extras" : searchParams.tab === "items" ? "items" : "kits";

  const [kits, categories, items] = await Promise.all([
    prisma.kit.findMany({ where: { festivalSlug }, orderBy: [{ kind: "asc" }, { sortOrder: "asc" }] }),
    prisma.builderExtraCategory.findMany({
      where: { festivalSlug },
      orderBy: { sortOrder: "asc" },
      include: { items: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.item.findMany({
      where: { festivalSlug },
      orderBy: { name: "asc" },
      include: { _count: { select: { kitLineItems: true } } },
    }),
  ]);

  const curatedKits = kits.filter((k) => k.kind === "CURATED");
  const dayKits = kits.filter((k) => k.kind === "DAY");

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Catalog</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {festivals.map((f) => (
          <a
            key={f.slug}
            href={`/admin/catalog?festival=${f.slug}&tab=${tab}`}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              festivalSlug === f.slug
                ? "bg-slate-800 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.nameEnglish}
          </a>
        ))}
      </div>

      <div className="flex gap-4 border-b border-slate-200 mb-6">
        <a
          href={`/admin/catalog?festival=${festivalSlug}&tab=kits`}
          className={`pb-2 text-sm font-semibold border-b-2 ${
            tab === "kits" ? "border-slate-800 text-slate-800" : "border-transparent text-slate-400"
          }`}
        >
          Kits
        </a>
        <a
          href={`/admin/catalog?festival=${festivalSlug}&tab=extras`}
          className={`pb-2 text-sm font-semibold border-b-2 ${
            tab === "extras" ? "border-slate-800 text-slate-800" : "border-transparent text-slate-400"
          }`}
        >
          Kit Builder Extras
        </a>
        <a
          href={`/admin/catalog?festival=${festivalSlug}&tab=items`}
          className={`pb-2 text-sm font-semibold border-b-2 ${
            tab === "items" ? "border-slate-800 text-slate-800" : "border-transparent text-slate-400"
          }`}
        >
          Items ({items.length})
        </a>
      </div>

      {tab === "kits" ? (
        <div className="space-y-8">
          <p className="text-xs text-slate-500 -mt-2">
            Each kit&apos;s items are edited via its own &quot;Included items&quot; box
            below (one per line) — see the{" "}
            <a href={`/admin/catalog?festival=${festivalSlug}&tab=items`} className="underline">
              Items tab
            </a>{" "}
            to adjust a shared item&apos;s price/stock everywhere it&apos;s used at once.
          </p>
          <KitTable
            title="Curated Kits (Ready-Made Kits section)"
            kits={curatedKits}
            festivalSlug={festivalSlug}
          />
          <KitTable
            title="Day-wise Kits (9 Days Guide add-to-cart)"
            kits={dayKits}
            festivalSlug={festivalSlug}
          />
          <Link
            href={`/admin/catalog/kits/new?festival=${festivalSlug}`}
            className="inline-block rounded-lg bg-slate-800 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-900"
          >
            + New Kit
          </Link>
        </div>
      ) : tab === "extras" ? (
        <div className="space-y-6">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-800 mb-3">{cat.label}</h3>
              <table className="w-full text-sm mb-3">
                <thead className="text-xs text-slate-500 uppercase">
                  <tr>
                    <th className="text-left py-1.5">Name</th>
                    <th className="text-left py-1.5">Icon</th>
                    <th className="text-left py-1.5">Price</th>
                    <th className="text-left py-1.5">Stock</th>
                    <th className="text-left py-1.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cat.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-slate-500">{item.icon}</td>
                      <td className="py-2">₹{item.price}</td>
                      <td className="py-2">{item.stock > 0 ? `${item.stock} in stock` : "Out of stock"}</td>
                      <td className="py-2 text-right space-x-3">
                        <Link
                          href={`/admin/catalog/extras/${item.id}/edit?festival=${festivalSlug}`}
                          className="text-slate-600 hover:underline"
                        >
                          Edit
                        </Link>
                        <form action={deleteBuilderItemAction} className="inline">
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="festivalSlug" value={festivalSlug} />
                          <button type="submit" className="text-red-500 hover:underline">
                            Delete
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link
                href={`/admin/catalog/extras/new?festival=${festivalSlug}&category=${cat.id}`}
                className="text-xs font-semibold text-slate-600 hover:underline"
              >
                + Add item to {cat.label}
              </Link>
            </div>
          ))}

          <form
            action={saveBuilderCategoryAction}
            className="bg-white rounded-2xl border border-dashed border-slate-300 p-5 flex items-end gap-3"
          >
            <input type="hidden" name="festivalSlug" value={festivalSlug} />
            <label className="flex-1">
              <span className="text-xs font-semibold text-slate-600 mb-1 block">New category name</span>
              <input
                name="label"
                required
                placeholder="e.g. सजावट"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-slate-800 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-900"
            >
              + Add Category
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-4">
          {searchParams.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{searchParams.error}</p>
          )}

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3">Name</th>
                  <th className="text-left px-4 py-3">Used in</th>
                  <th className="text-left px-4 py-3">Price (optional)</th>
                  <th className="text-left px-4 py-3">Stock</th>
                  <th className="text-left px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2.5">{item.name}</td>
                    <td className="px-4 py-2.5 text-slate-500">
                      {item._count.kitLineItems} kit{item._count.kitLineItems === 1 ? "" : "s"}
                    </td>
                    <td className="px-4 py-2.5" colSpan={2}>
                      {item.inventoryfySku ? (
                        <span className="text-xs text-slate-500">
                          ₹{item.price ?? "—"} · {item.stock} in stock —{" "}
                          <span className="italic">managed in Inventoryfy</span>
                        </span>
                      ) : (
                        <form action={updateItemAction} className="flex items-center gap-4">
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="festivalSlug" value={festivalSlug} />
                          <input
                            type="number"
                            name="price"
                            min={0}
                            defaultValue={item.price ?? ""}
                            placeholder="—"
                            className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                          />
                          <span className="text-xs text-slate-400">initial price — until synced</span>
                          <button
                            type="submit"
                            className="rounded-lg bg-slate-800 text-white px-3 py-1 text-xs font-semibold hover:bg-slate-900"
                          >
                            Save
                          </button>
                        </form>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {item._count.kitLineItems === 0 && (
                        <form action={deleteItemAction} className="inline">
                          <input type="hidden" name="id" value={item.id} />
                          <input type="hidden" name="festivalSlug" value={festivalSlug} />
                          <button type="submit" className="text-red-500 hover:underline text-xs">
                            Delete
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      No items yet — add one below, or via a kit&apos;s &quot;Included items&quot; box.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <form
            action={createItemAction}
            className="bg-white rounded-2xl border border-dashed border-slate-300 p-5 flex items-end gap-3"
          >
            <input type="hidden" name="festivalSlug" value={festivalSlug} />
            <label className="flex-1">
              <span className="text-xs font-semibold text-slate-600 mb-1 block">New item name</span>
              <input
                name="name"
                required
                placeholder="e.g. गंगाजल"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="w-32">
              <span className="text-xs font-semibold text-slate-600 mb-1 block">Price (optional)</span>
              <input
                name="price"
                type="number"
                min={0}
                placeholder="—"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-slate-800 text-white px-4 py-2 text-sm font-semibold hover:bg-slate-900"
            >
              + Add Item
            </button>
          </form>
          <p className="text-xs text-slate-500">
            This creates the item on its own, not yet inside any kit — add it to a kit from that
            kit&apos;s &quot;Included items&quot; box (Kits tab) whenever you&apos;re ready.
          </p>
        </div>
      )}

      {/* Referenced so the icon list stays in one place — see lib/festivals/types.ts */}
      <p className="mt-6 text-xs text-slate-400">
        Valid icons: {PUJA_ICON_KEYS.join(", ")}
      </p>
    </div>
  );
}

function KitTable({
  title,
  kits,
  festivalSlug,
}: {
  title: string;
  kits: {
    id: string;
    name: string;
    price: number;
    stock: number;
    featured: boolean;
    draft: boolean;
    dayNumber: number | null;
  }[];
  festivalSlug: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5">
      <h3 className="font-semibold text-slate-800 mb-3">{title}</h3>
      <table className="w-full text-sm">
        <thead className="text-xs text-slate-500 uppercase">
          <tr>
            <th className="text-left py-1.5">Name</th>
            <th className="text-left py-1.5">Price</th>
            <th className="text-left py-1.5">Flags</th>
            <th className="text-left py-1.5"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {kits.map((kit) => (
            <tr key={kit.id}>
              <td className="py-2">
                {kit.dayNumber != null && (
                  <span className="text-xs text-slate-400 mr-1">Day {kit.dayNumber} ·</span>
                )}
                {kit.name}
              </td>
              <td className="py-2">₹{kit.price.toLocaleString("en-IN")}</td>
              <td className="py-2 text-xs text-slate-500 space-x-1">
                {kit.featured && <span>Featured</span>}
                {kit.draft && <span className="text-amber-600">Draft</span>}
                {kit.stock <= 0 && <span className="text-red-500">Out of stock</span>}
              </td>
              <td className="py-2 text-right">
                <Link
                  href={`/admin/catalog/kits/${kit.id}/edit?festival=${festivalSlug}`}
                  className="text-slate-600 hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
          {kits.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-center text-slate-400">
                None yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
