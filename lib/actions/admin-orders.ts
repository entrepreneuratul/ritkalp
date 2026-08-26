"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendNewOrderAlert } from "@/lib/email";
import { OrderStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("Not authorized");
}

/**
 * Staff manually moves a WhatsApp-sourced order to CONFIRMED once the
 * customer has actually paid (over WhatsApp — this app has no way to
 * know that automatically, unlike the Razorpay path). That's the
 * trigger point for the "new order" email alert on this path — see
 * lib/orders.ts's confirmOrderPaid for the equivalent on the payment
 * path, which fires immediately since a captured payment IS the proof.
 */
export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  const orderId = String(formData.get("orderId"));
  const status = String(formData.get("status")) as OrderStatus;

  const before = await prisma.order.findUnique({ where: { id: orderId } });
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

export async function deleteOrderAction(formData: FormData) {
  await requireAdmin();
  const orderId = String(formData.get("orderId"));
  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin/orders");
  redirect("/admin/orders");
}
