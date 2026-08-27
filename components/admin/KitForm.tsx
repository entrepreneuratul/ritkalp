import { saveKitAction } from "@/lib/actions/admin-catalog";

export interface KitFormValues {
  id?: string;
  festivalSlug: string;
  kind: "CURATED" | "DAY";
  dayNumber?: number | null;
  name?: string;
  description?: string;
  image?: string;
  /** Ids of the items currently included, when editing an existing kit. */
  selectedItemIds?: string[];
  price?: number;
  stock?: number;
  featured?: boolean;
  badge?: string | null;
  draft?: boolean;
  /** Once set, price/stock are mirrored from Inventoryfy (see README's
   *  "Inventory model") — this form only takes an initial price for a
   *  brand-new, not-yet-synced kit. */
  inventoryfySku?: string | null;
}

export default function KitForm({
  kit,
  availableItems,
}: {
  kit: KitFormValues;
  /** Every Item for this festival that's already synced with
   *  Inventoryfy — the *only* items a kit can be built from. There's no
   *  free-text option here on purpose: typing a new name used to
   *  silently create an unsynced local Item, which isn't allowed
   *  anymore — see README's "Inventory model". */
  availableItems: { id: string; name: string }[];
}) {
  const selected = new Set(kit.selectedItemIds ?? []);

  return (
    <form action={saveKitAction} className="space-y-4 bg-white rounded-2xl border border-slate-200 p-6">
      {kit.id && <input type="hidden" name="id" value={kit.id} />}
      <input type="hidden" name="festivalSlug" value={kit.festivalSlug} />

      <div className="grid grid-cols-2 gap-4">
        <label className="block">
          <span className="text-xs font-semibold text-slate-600 mb-1 block">Kind</span>
          <select
            name="kind"
            defaultValue={kit.kind}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="CURATED">Curated (Shop Kits)</option>
            <option value="DAY">Day-wise (9 Days Guide)</option>
          </select>
        </label>
        <label className="block">
          <span className="text-xs font-semibold text-slate-600 mb-1 block">Day number (only for Day-wise)</span>
          <input
            type="number"
            name="dayNumber"
            defaultValue={kit.dayNumber ?? ""}
            min={1}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-semibold text-slate-600 mb-1 block">Name</span>
        <input
          name="name"
          required
          defaultValue={kit.name}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold text-slate-600 mb-1 block">Description</span>
        <textarea
          name="description"
          required
          defaultValue={kit.description}
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="text-xs font-semibold text-slate-600 mb-1 block">
          Image path (e.g. /images/kits/xyz.svg)
        </span>
        <input
          name="image"
          required
          defaultValue={kit.image}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </label>

      <div className="block">
        <span className="text-xs font-semibold text-slate-600 mb-1 block">
          Included items — only items already synced with Inventoryfy can be picked
        </span>
        {availableItems.length === 0 ? (
          <p className="text-sm text-slate-400 italic rounded-lg border border-dashed border-slate-300 px-3 py-4 text-center">
            No synced items yet for this festival — run{" "}
            <code className="not-italic">npm run sync:inventoryfy</code> after adding some in Inventoryfy.
          </p>
        ) : (
          <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-300 p-3 space-y-1.5">
            {availableItems.map((item) => (
              <label key={item.id} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="itemIds" value={item.id} defaultChecked={selected.has(item.id)} />
                {item.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {kit.inventoryfySku ? (
          <div className="block">
            <span className="text-xs font-semibold text-slate-600 mb-1 block">Price &amp; stock</span>
            <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
              ₹{kit.price} · {kit.stock ?? 0} in stock — <span className="italic">managed in Inventoryfy</span>
            </div>
          </div>
        ) : (
          <label className="block">
            <span className="text-xs font-semibold text-slate-600 mb-1 block">
              Initial price (₹, whole rupees) — used once, until synced
            </span>
            <input
              type="number"
              name="price"
              required
              min={0}
              defaultValue={kit.price}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
        )}
        <label className="block">
          <span className="text-xs font-semibold text-slate-600 mb-1 block">
            Badge (optional, e.g. &quot;Most Popular&quot;)
          </span>
          <input
            name="badge"
            defaultValue={kit.badge ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="featured" defaultChecked={kit.featured} /> Featured
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="draft" defaultChecked={kit.draft} /> Draft (needs review)
        </label>
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
