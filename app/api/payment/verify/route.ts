import { NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { confirmOrderPaid } from "@/lib/orders";
import { sendOrderConfirmation, sendNewOrderAlert } from "@/lib/email";

const VerifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

/**
 * Called by the browser right after Razorpay Checkout's success handler
 * (components/CartDrawer.tsx) — verifies the payment signature and
 * marks the order paid immediately, for a fast "order confirmed" UI.
 * This is a convenience path, NOT the source of truth: the webhook
 * (app/api/webhooks/razorpay/route.ts) does the exact same check
 * server-to-server and is what actually must be trusted, since a closed
 * tab or failed fetch here would otherwise leave an order stuck unpaid.
 */
export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = VerifySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data;

  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 500 });
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
  }

  const { order, alreadyPaid } = await confirmOrderPaid({
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  if (!alreadyPaid) {
    // Best-effort — a failed email must never make a successful payment
    // look like it failed to the customer.
    sendOrderConfirmation(order).catch((err) => console.error("sendOrderConfirmation failed:", err));
    sendNewOrderAlert(order).catch((err) => console.error("sendNewOrderAlert failed:", err));
  }

  return NextResponse.json({ orderId: order.id, status: order.status });
}
