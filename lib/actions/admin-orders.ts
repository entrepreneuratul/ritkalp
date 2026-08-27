"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewOrderAlert } from "@/lib/email";
import { OrderStatus } from "@prisma/client";
import { cancelInventoryfyOrder, InventoryfyError } from "@/lib/inventoryfy";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Not authorized");
}

/**
 * Releases this order's stock in Inventoryfy — the same call the
 * stale-order cron makes (app/api/cron/release-stale-orders/route.ts)
 * — before the local row is cancelled or removed, so Inventoryfy and
 * Ritkalp never drift: an order cancelled/deleted here without this
 * would leave its stock locked up in Inventoryfy forever, since
 * Inventoryfy has no other way to learn Ritkalp gave up on it.
 *
 * A no-op if there's nothing to release: no inventoryfyOrderId at all
 * (nothing was ever decremented — e.g. a fully custom combo with no
 * synced SKUs), or Inventoryfy already refuses to cancel it (a 400 —
 * it's DELIVERED there, or something else already cancelled it, most
 * likely the stale-order cron racing this same action). Any other
 * failure (network, Inventoryfy down, ...) is left to throw and abort
 * the caller, so a local status change can never silently get ahead of
 * what Inventoryfy actually knows.
 */
async function releaseInventoryfyStock(order: { inventoryfyOrderId: string | null }) {
  if (!order.inventoryfyOrderId) return;
  try {
    await cancelInventoryfyOrder(order.inventoryfyOrderId);
  } catch (err) {
    const alreadySettled = err instanceof InventoryfyError && err.status === 400;
    if (!alreadySettled) throw err;
  }
}

/**
 * Staff manually moves a WhatsApp-sourced order to CONFIRMED once the
 * customer has actually paid (over WhatsApp — this app has no way to
 * know that automatically, unlike the Razorpay path). That's the
 * trigger point for the "new order" email alert on this path — see
 * lib/orders.ts's confirmOrderPaid for the equivalent on the payment
 * path, which fires immediately since a captured payment IS the proof.
 *
 * Moving an order TO cancelled from here is the manual counterpart to
 * the stale-order cron's automatic release — see releaseInventoryfyStock
 * above — so an order cancelled by staff restores stock in Inventoryfy
 * exactly the same way an abandoned-checkout auto-release does.
 */
export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const orderId = String(formData.get("orderId"));
  const status = String(formData.get("status")) as OrderStatus;

  const before = await prisma.order.findUnique({ where: { id: orderId } });
  if (!before) throw new Error("Order not found");

  if (status === OrderStatus.CANCELLED && before.status !== OrderStatus.CANCELLED) {
    await releaseInventoryfyStock(before);
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: { items: true },
  });

  if (
    status === OrderStatus.CONFIRMED &&
    before?.status !== OrderStatus.CONFIRMED &&
    order.source === "WHATSAPP"
  ) {
    sendNewOrderAlert(order).catch((err) => console.error("sendNewOrderAlert failed:", err));
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

/**
 * Hard-deletes the local Order row. Releases Inventoryfy stock first
 * (unless it's already CANCELLED/DELIVERED there) — otherwise deleting
 * an order that was never cancelled would erase Ritkalp's only record
 * of it while leaving Inventoryfy still thinking that stock is
 * committed to a sale, with nothing left locally to ever release it.
 */
export async function deleteOrderAction(formData: FormData) {
  await requireAdmin();
  const orderId = String(formData.get("orderId"));

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) redirect("/admin/orders");

  if (order.status !== OrderStatus.CANCELLED && order.status !== OrderStatus.DELIVERED) {
    await releaseInventoryfyStock(order);
  }

  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}
