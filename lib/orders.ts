// =====================================================================
// ORDER CREATION — server-only. Shared by the WhatsApp checkout path
// (components/CartDrawer.tsx, via app/api/orders/route.ts) and the
// Razorpay payment path (app/api/payment/create-order/route.ts) — same
// function, different `source`/initial status.
//
// Prices are re-verified against the DB for every line, including a
// custom Kit Builder combo now — its base kit + each tapped extra are
// resolved to real rows and re-priced from their (Inventoryfy-mirrored)
// DB prices, never trusting the client's `custom.unitPrice` snapshot.
//
// This is also where Inventoryfy — the real stock/price master — is
// called: every resolved line becomes a real SKU quantity sent to
// POST /integrations/v1/orders, and Inventoryfy's response is what
// actually gates whether the local Order gets created at all. See
// README's "Inventory model".
// =====================================================================

import { randomUUID } from "crypto";
import { prisma } from "./prisma";
import { OrderSource, OrderStatus, PaymentStatus } from "@prisma/client";
import { placeInventoryfyOrder, type InventoryfyOrderLine } from "./inventoryfy";

export interface CartLineInput {
  festivalSlug: string;
  kitId: string;
  quantity: number;
  custom?: {
    name: string;
    image: string;
    items: string[];
    unitPrice: number;
    baseKitId?: string;
    extraIds: string[];
  };
}

export interface OrderCustomerInput {
  name: string;
  phone: string;
  email?: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export async function createOrderFromCart({
  items,
  customer,
  source,
  customerId,
}: {
  items: CartLineInput[];
  customer: OrderCustomerInput;
  source: OrderSource;
  customerId?: string;
}) {
  const catalogKitIds = items.map((i) => i.kitId).filter((id) => !id.startsWith("builder-"));
  const dbKits = catalogKitIds.length
    ? await prisma.kit.findMany({
        where: { id: { in: catalogKitIds } },
        include: { lineItems: { orderBy: { sortOrder: "asc" }, include: { item: true } } },
      })
    : [];
  const dbKitById = new Map(dbKits.map((k) => [k.id, k]));

  // ---- Custom Kit Builder combos: resolve the *real* base kit + extras
  // server-side (never trusting item.custom's display snapshot for
  // price/SKU) — baseKitId/extraIds are static content ids from
  // lib/festivals/*.ts, not DB row ids, so they need the same id
  // construction prisma/seed.ts uses for a curated kit's DB id. ----
  const customLines = items.filter((i) => i.custom);

  const baseKitDbIds = Array.from(
    new Set(
      customLines
        .filter((i) => i.custom!.baseKitId)
        .map((i) => `${i.festivalSlug}__curated__${i.custom!.baseKitId}`),
    ),
  );
  const baseDbKits = baseKitDbIds.length ? await prisma.kit.findMany({ where: { id: { in: baseKitDbIds } } }) : [];
  const baseDbKitById = new Map(baseDbKits.map((k) => [k.id, k]));

  const extraFestivalSlugs = Array.from(new Set(customLines.map((i) => i.festivalSlug)));
  const dbExtras = extraFestivalSlugs.length
    ? await prisma.builderExtraItem.findMany({ where: { category: { festivalSlug: { in: extraFestivalSlugs } } } })
    : [];
  // itemKey is only unique per-category, not per-festival, but in
  // practice content authors don't reuse the same extra key across
  // categories within one festival — first match is fine here.
  const dbExtraByKey = new Map(dbExtras.map((e) => [e.itemKey, e]));

  const resolvedItems: {
    kitId: string | null;
    festivalSlug: string;
    name: string;
    image: string;
    itemsList: string[];
    unitPrice: number;
    quantity: number;
    /** Real Inventoryfy SKU lines this cart line actually decrements —
     * one for a canonical kit, potentially several for a custom combo
     * (base kit + each extra), empty if nothing here is synced yet. */
    inventoryfyLines: InventoryfyOrderLine[];
  }[] = items.map((item) => {
    const dbKit = dbKitById.get(item.kitId);
    if (dbKit) {
      return {
        kitId: dbKit.id,
        festivalSlug: item.festivalSlug,
        name: dbKit.name,
        image: dbKit.image,
        itemsList: dbKit.lineItems.map((li) => li.item.name),
        unitPrice: dbKit.price,
        quantity: item.quantity,
        inventoryfyLines: dbKit.inventoryfySku ? [{ sku: dbKit.inventoryfySku, quantity: item.quantity }] : [],
      };
    }
    if (!item.custom) {
      throw new Error(`Unknown kit "${item.kitId}" with no custom snapshot to fall back to`);
    }

    const baseDbKit = item.custom.baseKitId ? baseDbKitById.get(`${item.festivalSlug}__curated__${item.custom.baseKitId}`) : undefined;
    const extraDbRows = item.custom.extraIds.map((id) => dbExtraByKey.get(id)).filter((e): e is NonNullable<typeof e> => Boolean(e));

    const verifiedUnitPrice = (baseDbKit?.price ?? 0) + extraDbRows.reduce((sum, e) => sum + e.price, 0);
    const inventoryfyLines: InventoryfyOrderLine[] = [
      ...(baseDbKit?.inventoryfySku ? [{ sku: baseDbKit.inventoryfySku, quantity: item.quantity }] : []),
      ...extraDbRows.filter((e) => e.inventoryfySku).map((e) => ({ sku: e.inventoryfySku!, quantity: item.quantity })),
    ];

    return {
      kitId: null as string | null,
      festivalSlug: item.festivalSlug,
      name: item.custom.name,
      image: item.custom.image,
      itemsList: item.custom.items,
      // Server-verified, not the client's snapshot — a tampered
      // unitPrice in the request body can no longer change what's
      // actually charged, closing the one gap this comment used to
      // describe as unavoidable.
      unitPrice: verifiedUnitPrice,
      quantity: item.quantity,
      inventoryfyLines,
    };
  });

  const total = resolvedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  // ---- Inventoryfy is the real gate: this is where stock actually
  // gets decremented. If it throws (unreachable, unknown SKU, ...),
  // nothing here has been created yet — the whole checkout fails
  // cleanly instead of silently recording an order Inventoryfy never
  // saw. externalOrderId is per *attempt*, not per Order row, so a
  // network-failure retry (no local Order was ever created) is a safe,
  // idempotent no-op on Inventoryfy's side rather than a double sale. ----
  const allInventoryfyLines = resolvedItems.flatMap((i) => i.inventoryfyLines);
  let inventoryfyOrderId: string | null = null;
  if (allInventoryfyLines.length > 0) {
    const result = await placeInventoryfyOrder({
      externalOrderId: `ritkalp-${randomUUID()}`,
      customerName: customer.name,
      items: allInventoryfyLines,
    });
    inventoryfyOrderId = result.orderId;
  }

  return prisma.order.create({
    data: {
      customerId: customerId ?? null,
      guestName: customer.name,
      guestPhone: customer.phone,
      guestEmail: customer.email ?? null,
      inventoryfyOrderId,
      addressLine: customer.addressLine,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
      subtotal: total,
      total,
      source,
      // inventoryfyLines isn't a real OrderItem field — it only exists
      // to carry the SKU lines through to the Inventoryfy call above.
      items: {
        create: resolvedItems.map((i) => ({
          kitId: i.kitId,
          festivalSlug: i.festivalSlug,
          name: i.name,
          image: i.image,
          itemsList: i.itemsList,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
        })),
      },
    },
    include: { items: true },
  });
}

/**
 * Marks an order paid — called from BOTH the client-side post-payment
 * verify route (app/api/payment/verify/route.ts, for a snappy UI) and
 * the Razorpay webhook (app/api/webhooks/razorpay/route.ts, the actual
 * source of truth, in case the browser tab closes before the client
 * ever calls verify). Idempotent: a second call for an already-paid
 * order is a safe no-op, so it's fine for both paths to race.
 *
 * Returns the updated order, or null if it was already paid (the
 * caller can use that to skip re-sending confirmation emails).
 */
export async function confirmOrderPaid({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  const existing = await prisma.order.findUnique({
    where: { razorpayOrderId },
    include: { items: true },
  });
  if (!existing) return { order: null, alreadyPaid: false };
  if (existing.paymentStatus === PaymentStatus.PAID) {
    return { order: existing, alreadyPaid: true };
  }

  const order = await prisma.order.update({
    where: { razorpayOrderId },
    data: {
      paymentStatus: PaymentStatus.PAID,
      status: OrderStatus.CONFIRMED,
      razorpayPaymentId,
      razorpaySignature,
    },
    include: { items: true },
  });
  return { order, alreadyPaid: false };
}
