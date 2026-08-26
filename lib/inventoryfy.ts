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
    // unreachable.
    signal: AbortSignal.timeout(8000),
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
