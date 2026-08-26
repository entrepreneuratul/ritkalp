import { saveBuilderItemAction } from "@/lib/actions/admin-catalog";
import { PUJA_ICON_KEYS } from "@/lib/festivals/types";

export interface BuilderItemFormValues {
  id?: string;
  categoryId: string;
  categoryLabel: string;
  festivalSlug: string;
  name?: string;
  icon?: string;
  price?: number;
  stock?: number;
  /** Once set, price/stock are mirrored from Inventoryfy (see README's
   *  "Inventory model") — this form only takes an initial price for a
   *  brand-new, not-yet-synced extra. */
  inventoryfySku?: string | null;
}

export default function BuilderItemForm({ item }: { item: BuilderItemFormValues }) {
  return (
    <form action={saveBuilderItemAction} className="space-y-4 bg-white rounded-2xl border border-slate-200 p-6">
      {item.id && <input type="hidden" name="id" value={item.id} />}
      <input type="hidden" name="categoryId" value={item.categoryId} />
      <input type="hidden" name="festivalSlug" value={item.festivalSlug} />

      <p className="text-sm text-slate-500">
        Category: <span className="font-semibold text-slate-700">{item.categoryLabel}</span>
      </p>

      <label className="block">
        <span className="text-xs font-semibold text-slate-600 mb-1 block">Name</span>
        <input
          name="name"
          required
          defaultValue={item.name}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold text-slate-600 mb-1 block">Icon</span>
          <select
            name="icon"
            defaultValue={item.icon ?? PUJA_ICON_KEYS[0]}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {PUJA_ICON_KEYS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </label>
        {item.inventoryfySku ? (
          <div className="block">
            <span className="text-xs font-semibold text-slate-600 mb-1 block">Price &amp; stock</span>
            <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              ₹{item.price} · {item.stock ?? 0} in stock — <span className="italic">managed in Inventoryfy</span>
            </div>
          </div>
        ) : (
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 mb-1 block">
              Initial price (₹) — used once, until synced
            </span>
            <input
              type="number"
              name="price"
              required
              min={0}
              defaultValue={item.price}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        )}
      </div>

      <button
        type="submit"
        className="rounded-lg bg-slate-800 text-white px-5 py-2.5 text-sm font-semibold hover:bg-slate-900"
      >
        Save
      </button>
    </form>
  );
}
