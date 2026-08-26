import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOrderFromCart } from "@/lib/orders";
import { CreateOrderSchema } from "@/lib/validation/order";

/**
 * Creates an Order row from the cart — called by the existing WhatsApp
 * checkout flow (components/CartDrawer.tsx) so every order is recorded
 * even without a payment gateway attached. See
 * app/api/payment/create-order/route.ts for the Razorpay equivalent.
 * No auth required — guest checkout is the default; a signed-in
 * customer's id is attached automatically when a session exists.
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = CreateOrderSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid order payload", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const session = await auth();
  const customerId = session?.user?.role === "customer" ? session.user.id : undefined;

  try {
    const order = await createOrderFromCart({
      ...parsed.data,
      source: "WHATSAPP",
      customerId,
    });
    return NextResponse.json({ orderId: order.id, total: order.total });
  } catch (err) {
    console.error("POST /api/orders failed:", err);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}
