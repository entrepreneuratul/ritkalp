import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Receives Inventoryfy's `inventory.updated` webhook — the near-real-time
 * push that keeps Item/BuilderExtraItem/Kit's mirrored price+stock in
 * sync with Inventoryfy, the master (see README's "Inventory model").
 * Fires on a price change too, not just stock — Inventoryfy is
 * canonical on both.
 *
 * Verified against the RAW request body, same pattern as
 * app/api/webhooks/razorpay/route.ts, using INVENTORYFY_WEBHOOK_SECRET
 * (written to .env by scripts/sync-inventoryfy.ts).
 */
export async function POST(req: Request) {
  const secret = process.env.INVENTORYFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("INVENTORYFY_WEBHOOK_SECRET not set — rejecting webhook");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-inventoryfy-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody) as {
    eventType: string;
    sku: string;
    availableStock: number;
    price: number;
  };
  if (payload.eventType !== "inventory.updated") {
    // Not a type this receiver handles yet — acknowledge so Inventoryfy
    // doesn't keep retrying, no error either way.
    return NextResponse.json({ received: true });
  }

  const { sku } = payload;
  // Ritkalp prices are whole rupees (see prisma/schema.prisma's `price
  // Int` comment) — Inventoryfy tracks cents, so round on the way in.
  const price = Math.round(payload.price);
  const stock = payload.availableStock;

  // sku belongs to exactly one of these three mirrored tables — try
  // each in turn rather than maintaining a separate type-lookup index.
  const item = await prisma.item.updateMany({ where: { inventoryfySku: sku }, data: { price, stock } });
  if (item.count > 0) return NextResponse.json({ received: true });

  const extra = await prisma.builderExtraItem.updateMany({ where: { inventoryfySku: sku }, data: { price, stock } });
  if (extra.count > 0) return NextResponse.json({ received: true });

  const kit = await prisma.kit.updateMany({ where: { inventoryfySku: sku }, data: { price, stock } });
  if (kit.count > 0) return NextResponse.json({ received: true });

  // An unknown SKU isn't worth rejecting the delivery over — just means
  // this storefront doesn't (yet) have a local row for it.
  console.warn(`Inventory webhook for unknown SKU: ${sku}`);
  return NextResponse.json({ received: true });
}
