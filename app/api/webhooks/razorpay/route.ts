import { NextResponse } from "next/server";
import crypto from "crypto";
import { confirmOrderPaid } from "@/lib/orders";
import { sendOrderConfirmation, sendNewOrderAlert } from "@/lib/email";

/**
 * The actual source of truth for "did this payment succeed" — Razorpay
 * calls this server-to-server (configure at Dashboard → Settings →
 * Webhooks → https://<your-domain>/api/webhooks/razorpay, event:
 * "payment.captured") regardless of whether the customer's browser ever
 * got back to app/api/payment/verify/route.ts. Must verify against the
 * RAW request body — reading it as text (not json()) first is what
 * makes that verification actually match what Razorpay signed.
 */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET not set — rejecting webhook");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  if (payload.event !== "payment.captured") {
    // Other events (payment.failed, refund.*, ...) aren't handled yet —
    // acknowledge so Razorpay doesn't keep retrying, no error either way.
    return NextResponse.json({ received: true });
  }

  const payment = payload.payload?.payment?.entity;
  const razorpayOrderId: string | undefined = payment?.order_id;
  const razorpayPaymentId: string | undefined = payment?.id;
  if (!razorpayOrderId || !razorpayPaymentId) {
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const { order, alreadyPaid } = await confirmOrderPaid({
    razorpayOrderId,
    razorpayPaymentId,
    // The webhook has no per-payment client signature to store — the
    // whole request body's HMAC (already verified above) is what
    // authenticates this event instead.
    razorpaySignature: signature,
  });

  if (order && !alreadyPaid) {
    sendOrderConfirmation(order).catch((err) => console.error("sendOrderConfirmation failed:", err));
    sendNewOrderAlert(order).catch((err) => console.error("sendNewOrderAlert failed:", err));
  }

  return NextResponse.json({ received: true });
}
