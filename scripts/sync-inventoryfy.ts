// =====================================================================
// SYNC-INVENTORYFY — one-time, idempotent, re-runnable catalog link.
//
// Creates a real Inventoryfy Product for every Item and BuilderExtraItem
// (plain products) and a bundle Product for every Kit (isBundle: true,
// BundleComponents matching that kit's KitLineItems), then writes the
// generated SKU (+ Inventoryfy's initial price/stock) back into the
// local row. Also ensures a Ritkalp IntegrationConnection exists in
// Inventoryfy, writing its API key + webhook secret straight into
// .env — after this, .env already having those values is exactly what
// makes a re-run skip connection setup (the key can't be retrieved
// again after creation, so .env is the only record of it).
//
// Idempotent per row: anything that already has `inventoryfySku` set is
// left alone — safe to re-run after adding new catalog entries later
// without re-creating everything or duplicating stock.
//
// Run with: npm run sync:inventoryfy
// =====================================================================

import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { festivals } from "../lib/festivals/registry";

const prisma = new PrismaClient();

const INVENTORYFY_API_URL = process.env.INVENTORYFY_API_URL || "http://localhost:3001";
const OWNER_EMAIL = process.env.INVENTORYFY_OWNER_EMAIL || "owner@inventoryfy.dev";
const OWNER_PASSWORD = process.env.INVENTORYFY_OWNER_PASSWORD || "password123";
const BUSINESS_NAME = process.env.INVENTORYFY_BUSINESS_NAME || "Ritkalp";
const RITKALP_PUBLIC_URL = process.env.RITKALP_PUBLIC_URL || "http://localhost:3000";
// Placeholder starting stock for every newly-created item — nobody has
// real inventory counts entered yet. Override with a real number once
// you know it, or just adjust it afterwards in Inventoryfy's own
// Warehouses screen; this only ever applies once, at first creation.
const INITIAL_STOCK = Number(process.env.SYNC_INITIAL_STOCK ?? 50);

const ENV_PATH = path.join(__dirname, "..", ".env");

async function api(token: string, urlPath: string, options: { method?: string; body?: unknown } = {}) {
  const res = await fetch(`${INVENTORYFY_API_URL}${urlPath}`, {
    method: options.method ?? "GET",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message = (isJson && data && data.message) || res.statusText;
    throw new Error(`${options.method ?? "GET"} ${urlPath} -> ${res.status}: ${Array.isArray(message) ? message.join(", ") : message}`);
  }
  return data;
}

async function login(): Promise<string> {
  const data = await api("", "/auth/login", {
    method: "POST",
    body: { email: OWNER_EMAIL, password: OWNER_PASSWORD, role: "OWNER" },
  });
  return data.accessToken as string;
}

/** Short, ASCII-safe SKU suffix derived from the row's own (already
 * unique) id — a hash, not a raw substring slice: Item/BuilderExtraItem
 * ids are random cuids (a substring would be fine), but Kit ids are
 * seeded as readable strings like "navratri__day__day-9-samagri"
 * (prisma/seed.ts sets them explicitly), where two different kits can
 * easily share the same trailing characters. Most item names are
 * Devanagari too, so slugifying the *name* would strip to nothing or
 * collide constantly — the readable name lives on the Inventoryfy
 * Product itself (Unicode-safe), not jammed into the SKU. */
function shortId(id: string): string {
  return createHash("sha1").update(id).digest("hex").slice(0, 8);
}

function updateEnvFile(values: Record<string, string>) {
  let content = "";
  try {
    content = readFileSync(ENV_PATH, "utf8");
  } catch {
    content = "";
  }
  for (const [key, value] of Object.entries(values)) {
    const line = `${key}="${value}"`;
    const re = new RegExp(`^${key}=.*$`, "m");
    content = re.test(content) ? content.replace(re, line) : `${content.trimEnd()}\n${line}\n`;
  }
  writeFileSync(ENV_PATH, content);
}

async function main() {
  console.log(`Logging into Inventoryfy at ${INVENTORYFY_API_URL} as ${OWNER_EMAIL}...`);
  const token = await login();

  const me = await api(token, "/auth/me");
  const business = (me.businesses as { id: string; name: string }[]).find((b) => b.name === BUSINESS_NAME);
  if (!business) {
    throw new Error(
      `No Inventoryfy business named "${BUSINESS_NAME}" owned by ${OWNER_EMAIL}. ` +
        `Seed it in Inventoryfy first (apps/api/prisma/seed.ts), or set INVENTORYFY_BUSINESS_NAME.`,
    );
  }
  console.log(`Business: ${business.name} (${business.id})`);

  const warehouses = await api(token, `/businesses/${business.id}/warehouses`);
  const warehouse = warehouses[0];
  if (!warehouse) throw new Error(`Business "${business.name}" has no warehouse yet — create one in Inventoryfy first.`);
  console.log(`Fulfillment warehouse: ${warehouse.name} (${warehouse.id})`);

  // ---- Ensure an IntegrationConnection exists (once — the API key/
  //      webhook secret can only ever be read at creation time, so
  //      .env already having a key is what makes this idempotent) ----
  if (!process.env.INVENTORYFY_API_KEY || !process.env.INVENTORYFY_WEBHOOK_SECRET) {
    console.log("\nNo INVENTORYFY_API_KEY in .env yet — creating a new connection...");
    const result = await api(token, `/businesses/${business.id}/integrations`, {
      method: "POST",
      body: {
        name: "Ritkalp Storefront",
        webhookUrl: `${RITKALP_PUBLIC_URL}/api/webhooks/inventory`,
        defaultWarehouseId: warehouse.id,
      },
    });
    updateEnvFile({
      INVENTORYFY_API_URL,
      INVENTORYFY_API_KEY: result.apiKey,
      INVENTORYFY_WEBHOOK_SECRET: result.webhookSecret,
    });
    console.log(`Created connection "${result.connection.name}" — API key + webhook secret written to .env`);
  } else {
    console.log("\nINVENTORYFY_API_KEY already set in .env — reusing existing connection.");
  }

  // ---- Categories: one per festival, so Inventoryfy's own Catalog
  //      page stays organized the same way the storefront is ----
  const existingCategories = await api(token, `/businesses/${business.id}/categories`);
  const categoryIdBySlug = new Map<string, string>();
  for (const festival of festivals) {
    const existing = existingCategories.find((c: { name: string }) => c.name === festival.nameEnglish);
    if (existing) {
      categoryIdBySlug.set(festival.slug, existing.id);
      continue;
    }
    const created = await api(token, `/businesses/${business.id}/categories`, {
      method: "POST",
      body: { name: festival.nameEnglish },
    });
    categoryIdBySlug.set(festival.slug, created.id);
  }

  let itemsCreated = 0;
  let extrasCreated = 0;
  let kitsCreated = 0;

  for (const festival of festivals) {
    console.log(`\n— ${festival.nameEnglish} (${festival.slug}) —`);
    const categoryId = categoryIdBySlug.get(festival.slug)!;
    const skuPrefix = festival.slug.slice(0, 3).toUpperCase();

    // ---- Pass 1: Items (kit components — plain products) ----
    const items = await prisma.item.findMany({ where: { festivalSlug: festival.slug, inventoryfySku: null } });
    for (const item of items) {
      const sku = `RTK-${skuPrefix}-I-${shortId(item.id)}`;
      // Created with stock: 0 deliberately — the warehouse-adjust call
      // right below is what actually establishes both the real
      // WarehouseStock row AND the denormalized ProductVariant.stock
      // total together, correctly, in one step. Creating with
      // stock: INITIAL_STOCK here and then also adjusting by
      // INITIAL_STOCK would double-count: adjustStock always increments
      // the denormalized total too, and POST /products's stock has no
      // warehouse behind it at all (it shows as "Unallocated" in
      // Inventoryfy's own model) — a real order against this warehouse
      // would find nothing to actually decrement and get backordered.
      const created = await api(token, `/businesses/${business.id}/products`, {
        method: "POST",
        body: { name: item.name, categoryId, sku, price: item.price ?? 0, stock: 0 },
      });
      await api(token, `/businesses/${business.id}/warehouses/${warehouse.id}/adjust`, {
        method: "POST",
        body: { variantId: created.variants[0].id, delta: INITIAL_STOCK },
      });
      await prisma.item.update({
        where: { id: item.id },
        data: { inventoryfySku: sku, price: item.price ?? 0, stock: INITIAL_STOCK },
      });
      itemsCreated++;
    }
    console.log(`  ${items.length} items synced`);

    // ---- Pass 2: Builder extras (plain products) ----
    const extras = await prisma.builderExtraItem.findMany({
      where: { category: { festivalSlug: festival.slug }, inventoryfySku: null },
    });
    for (const extra of extras) {
      const sku = `RTK-${skuPrefix}-X-${shortId(extra.id)}`;
      // See the matching comment in the Items loop above — created with
      // stock: 0 on purpose, the warehouse-adjust call is what actually
      // establishes real, allocated stock.
      const created = await api(token, `/businesses/${business.id}/products`, {
        method: "POST",
        body: { name: extra.name, categoryId, sku, price: extra.price, stock: 0 },
      });
      await api(token, `/businesses/${business.id}/warehouses/${warehouse.id}/adjust`, {
        method: "POST",
        body: { variantId: created.variants[0].id, delta: INITIAL_STOCK },
      });
      await prisma.builderExtraItem.update({
        where: { id: extra.id },
        data: { inventoryfySku: sku, stock: INITIAL_STOCK },
      });
      extrasCreated++;
    }
    console.log(`  ${extras.length} builder extras synced`);

    // ---- Pass 3: Kits (bundle products — needs every component Item
    //      already synced above, since BundleComponent references an
    //      Inventoryfy productId, not the Ritkalp Item id). Fetch the
    //      full product list once and index by SKU rather than a
    //      search call per line item — also correctly picks up items
    //      synced in an *earlier* run, not just this one. ----
    const allProducts = await api(token, `/businesses/${business.id}/products`);
    const productIdBySku = new Map<string, string>(allProducts.map((p: { sku: string; id: string }) => [p.sku, p.id]));

    const kits = await prisma.kit.findMany({
      where: { festivalSlug: festival.slug, inventoryfySku: null },
      include: { lineItems: { include: { item: true } } },
    });
    for (const kit of kits) {
      const sku = `RTK-${skuPrefix}-K-${shortId(kit.id)}`;
      const created = await api(token, `/businesses/${business.id}/products`, {
        method: "POST",
        body: { name: kit.name, categoryId, sku, price: kit.price, isBundle: true },
      });

      const componentEntries: { componentProductId: string; qty: number }[] = [];
      for (const lineItem of kit.lineItems) {
        const componentSku = lineItem.item.inventoryfySku;
        const componentProductId = componentSku ? productIdBySku.get(componentSku) : undefined;
        if (!componentProductId) {
          console.warn(`  ! skipping component "${lineItem.item.name}" for kit "${kit.name}" — not yet synced`);
          continue;
        }
        componentEntries.push({ componentProductId, qty: 1 });
      }

      if (componentEntries.length > 0) {
        await api(token, `/businesses/${business.id}/products/${created.id}/bundle-components`, {
          method: "PUT",
          body: { components: componentEntries },
        });
      }

      await prisma.kit.update({
        where: { id: kit.id },
        // Bundle stock is derived, computed fresh by Inventoryfy from
        // its components — not a number we invent here.
        data: { inventoryfySku: sku, price: kit.price },
      });
      kitsCreated++;
    }
    console.log(`  ${kits.length} kits synced (as bundles)`);
  }

  console.log(
    `\nDone. Created ${itemsCreated} items, ${extrasCreated} builder extras, ${kitsCreated} kits in Inventoryfy.`,
  );
  console.log("Re-run this script any time after adding new catalog entries — already-synced rows are skipped.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
