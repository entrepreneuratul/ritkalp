import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cancelInventoryfyOrder } from "@/lib/inventoryfy";
import { OrderSource, OrderStatus, PaymentStatus } from "@prisma/client";

/**
 * Releases stock for abandoned/failed Razorpay checkouts. Scope is
 * deliberately narrow: only ONLINE_PAYMENT orders that are still UNPAID
 * past a cutoff — a WhatsApp order staying UNPAID is completely normal
 * (the business collects payment separately, COD/UPI, outside the app;
 * see lib/orders.ts's comments) and must never be touched here.
 *
 * Why this exists: createOrderFromCart() calls Inventoryfy — and real
 * stock actually gets decremented — before payment is confirmed, for
 * both checkout flows (see app/api/payment/create-order/route.ts's own
 * comments on why). That's fine for WhatsApp (an order there already
 * represents real customer intent), but for Razorpay a customer can
 * abandon checkout or have a payment fail, and without this job that
 * stock would stay locked up in Inventoryfy forever with nothing to
 * ever release it.
 *
 * Meant to run on a schedule (see vercel.json) — GET so Vercel Cron can
 * call it directly. Protected by CRON_SECRET: Vercel automatically
 * sends `Authorization: Bearer $CRON_SECRET` on cron invocations when
 * that env var is set; this route just verifies it matches. Also
 * callable by hand for local testing (see README's "Inventory model").
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    console.warn("CRON_SECRET not set — release-stale-orders is running unauthenticated");
  }

  const staleMinutes = Number(process.env.STALE_ORDER_MINUTES ?? 30);
  const cutoff = new Date(Date.now() - staleMinutes * 60 * 1000);

  const staleOrders = await prisma.order.findMany({
    where: {
      source: OrderSource.ONLINE_PAYMENT,
      paymentStatus: PaymentStatus.UNPAID,
      status: { notIn: [OrderStatus.CANCELLED, OrderStatus.DELIVERED] },
      inventoryfyOrderId: { not: null },
      createdAt: { lt: cutoff },
    },
  });

  const results: { orderId: string; ok: boolean; error?: string }[] = [];
  for (const order of staleOrders) {
    try {
      await cancelInventoryfyOrder(order.inventoryfyOrderId!);
      await prisma.order.update({ where: { id: order.id }, data: { status: OrderStatus.CANCELLED } });
      results.push({ orderId: order.id, ok: true });
    } catch (err) {
      // One order failing to release (Inventoryfy briefly unreachable,
      // already cancelled some other way, ...) shouldn't stop the rest
      // from being checked — the next scheduled run will retry it.
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Failed to release order ${order.id}:`, message);
      results.push({ orderId: order.id, ok: false, error: message });
    }
  }

  return NextResponse.json({
    checked: staleOrders.length,
    released: results.filter((r) => r.ok).length,
    failed: results.filter((r) => !r.ok).length,
    results,
  });
}
