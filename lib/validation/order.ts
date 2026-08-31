import { z } from "zod";

// Shared by app/api/orders/route.ts (WhatsApp flow) and
// app/api/payment/create-order/route.ts (Razorpay flow) — both accept
// the same cart + customer shape, only `source` differs.

export const CartLineSchema = z.object({
  festivalSlug: z.string().min(1),
  kitId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
  custom: z
    .object({
      name: z.string().min(1),
      image: z.string().min(1),
      items: z.array(z.string()),
      // Display-only — never trusted for the actual charge. See
      // baseKitId/extraIds below, which lib/orders.ts re-resolves and
      // re-prices server-side, same as it already does for a canonical
      // kit's price.
      unitPrice: z.number().int().min(0),
      /** The DB `Kit.id` of the base kit this combo started from, if
       *  any — used server-side to resolve the real Kit row (and its
       *  Inventoryfy SKU/price). Already a DB row id, not a bare static
       *  content id — see the longer note on CustomCartSnapshot in
       *  context/CartContext.tsx for why that distinction matters. */
      baseKitId: z.string().optional(),
      /** Static content ids (BuilderExtraItem.itemKey from
       *  lib/festivals/*.ts) of every tapped-on extra — unlike
       *  baseKitId, these are genuinely bare keys, matched server-side
       *  by itemKey, not a DB id. */
      extraIds: z.array(z.string()),
    })
    .optional(),
});

export const OrderCustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email().optional(),
  addressLine: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(4),
});

export const CreateOrderSchema = z.object({
  items: z.array(CartLineSchema).min(1),
  customer: OrderCustomerSchema,
});
