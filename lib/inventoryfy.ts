// =====================================================================
// INVENTORYFY CLIENT — server-only.
//
// Inventoryfy is the stock/price master (see README's "Inventory
// model"). This is the one place Ritkalp calls out to it at checkout
// time — POST /integrations/v1/orders, authenticated with the API key
// scripts/sync-inventoryfy.ts wrote into .env. Inventoryfy decides
// whether stock exists and is the one that actually decrements it;
// createOrderFromCart() (lib/orders.ts) only creates a local Order row
// after this call succeeds.
// =====================================================================

const API_URL = process.env.INVENTORYFY_API_URL || "http://localhost:3001";
const API_KEY = process.env.INVENTORYFY_API_KEY;

export class InventoryfyError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "InventoryfyError";
  }
}

export interface InventoryfyOrderLine {
  sku: string;
  quantity: number;
}

export interface InventoryfyOrderResult {
  orderId: string;
  displayId: string;
  status: string;
  accepted: boolean;
}

export interface InventoryfyCatalogItem {
  sku: string;
  name: string;
  price: number;
  availableStock: number;
  isBundle: boolean;
  category: string | null;
}

async function call<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  if (!API_KEY) {
    throw new InventoryfyError(
      "INVENTORYFY_API_KEY is not set — run `npm run sync:inventoryfy` first.",
      500,
    );
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    // This is a synchronous checkout dependency, not a background sync —
    // don't hang a customer's checkout indefinitely if Inventoryfy is
    // unreachable. 25s, not something short like 8s, because Inventoryfy's
    // API runs on Render's free tier, which spins the service down after
    // ~15 minutes idle — the first request after a quiet spell pays a real
    // cold-start cost (well-documented as 30-50s+ in the worst case, but
    // normally well under this). A too-short timeout here was a real,
    // reproducible checkout failure ("Payment could not start") for
    // exactly that reason, not a one-off. Paired with `maxDuration` on
    // every route that calls into here (see app/api/payment/create-order
    // and app/api/orders) — Vercel kills a serverless function at its own
    // duration cap regardless of this signal, so both need to agree.
    signal: AbortSignal.timeout(25000),
  });

  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const message = (isJson && data && (data as { message?: string | string[] }).message) || res.statusText;
    throw new InventoryfyError(Array.isArray(message) ? message.join(", ") : String(message), res.status);
  }
  return data as T;
}

/**
 * Places a real order against Inventoryfy — the moment stock actually
 * gets decremented. externalOrderId must be unique per attempt (a retry
 * with the same id is a safe no-op on Inventoryfy's side, not a double
 * sale) — createOrderFromCart generates one per checkout attempt, not
 * per Ritkalp Order row, so a genuine retry after a network failure
 * (customer's local Order was never created) doesn't double-decrement.
 */
export async function placeInventoryfyOrder(params: {
  externalOrderId: string;
  customerName?: string;
  items: InventoryfyOrderLine[];
}): Promise<InventoryfyOrderResult> {
  return call<InventoryfyOrderResult>("/integrations/v1/orders", {
    method: "POST",
    body: params,
  });
}

/**
 * Cancels an order this storefront created — releasing the stock it
 * decremented, exactly as if the order were cancelled from inside
 * Inventoryfy itself (same restock rules: only a real PROCESSING/SHIPPED
 * order actually restores anything). `inventoryfyOrderId` is
 * Inventoryfy's own order id (the same one placeInventoryfyOrder
 * returned and Order.inventoryfyOrderId already stores locally — no
 * separate externalOrderId needs to be persisted just for this). Used
 * by the stale-order release job
 * (app/api/cron/release-stale-orders/route.ts) to un-stick stock for an
 * abandoned/failed Razorpay checkout — see README's "Inventory model".
 */
export async function cancelInventoryfyOrder(inventoryfyOrderId: string): Promise<InventoryfyOrderResult> {
  return call<InventoryfyOrderResult>("/integrations/v1/orders/cancel", {
    method: "POST",
    body: { orderId: inventoryfyOrderId },
  });
}

/**
 * The full list of products/variants Inventoryfy has for this business —
 * used by the admin "Fetch new items" action (lib/actions/admin-catalog.ts)
 * to find products that exist there but have no matching local row yet.
 * Owner-triggered (a button click), not called on any customer-facing
 * path, so the same 8s timeout as everything else in this file is fine.
 */
export async function fetchInventoryfyCatalog(): Promise<InventoryfyCatalogItem[]> {
  return call<InventoryfyCatalogItem[]>("/integrations/v1/catalog");
}
