import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOrderFromCart } from "@/lib/orders";
import { getRazorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { CreateOrderSchema } from "@/lib/validation/order";

/**
 * Step 1 of the Razorpay flow: create our own Order (server-verified
 * total — see lib/orders.ts), then a matching Razorpay order for that
 * exact amount, and link the two. The client (components/CartDrawer.tsx)
 * uses the returned razorpayOrderId to open Razorpay Checkout; payment
 * confirmation happens in app/api/payment/verify/route.ts +
 * app/api/webhooks/razorpay/route.ts, never trusted from this step.
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
      source: "ONLINE_PAYMENT",
      customerId,
    });

    const razorpay = getRazorpay();
    const razorpayOrder = await razorpay.orders.create({
      // Razorpay wants the amount in paise.
      amount: order.total * 100,
      currency: "INR",
      receipt: order.id,
      notes: { orderId: order.id },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { razorpayOrderId: razorpayOrder.id },
    });

    return NextResponse.json({
      orderId: order.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (err) {
    console.error("POST /api/payment/create-order failed:", err);
    const message = err instanceof Error ? err.message : "Could not start payment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
