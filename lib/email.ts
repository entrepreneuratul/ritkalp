// =====================================================================
// EMAIL — Resend. Two emails: an order-confirmation to the customer
// (only sent if they gave an email — the checkout form's email field is
// optional, see components/CartDrawer.tsx) and a new-order alert to the
// business owner (BUSINESS_NOTIFY_EMAIL). Fired from:
//   - app/api/payment/verify/route.ts + app/api/webhooks/razorpay/route.ts
//     (online payments — as soon as payment is confirmed)
//   - app/(admin)/admin/orders/[id]/actions.ts (WhatsApp orders — once
//     staff manually marks one CONFIRMED, since "placed" isn't yet a
//     real sale the way a captured payment is)
//
// No RESEND_API_KEY set → every call here just logs instead of sending,
// so the rest of the app (and local dev) keeps working before that's
// configured. See .env.example.
// =====================================================================

import { Resend } from "resend";
import type { Order, OrderItem } from "@prisma/client";

type OrderWithItems = Order & { items: OrderItem[] };

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

function formatRupees(paise: number): string {
  return `₹${paise.toLocaleString("en-IN")}`;
}

function itemsHtml(items: OrderItem[]): string {
  return items
    .map(
      (i) =>
        `<tr><td style="padding:4px 8px;">${i.name} × ${i.quantity}</td><td style="padding:4px 8px;text-align:right;">${formatRupees(i.unitPrice * i.quantity)}</td></tr>`
    )
    .join("");
}

export async function sendOrderConfirmation(order: OrderWithItems) {
  if (!order.guestEmail) return; // no email on this order — nothing to send

  const resend = getResend();
  const from = process.env.EMAIL_FROM ?? "Ritkalp <orders@ritkalp.example>";
  const subject = `Ritkalp — आपका ऑर्डर कन्फर्म हो गया (#${order.id.slice(-8)})`;
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2>आपका ऑर्डर कन्फर्म हो गया 🙏</h2>
      <p>नमस्ते ${order.guestName}, आपका भुगतान सफलतापूर्वक प्राप्त हो गया है।</p>
      <table style="width:100%;border-collapse:collapse;">${itemsHtml(order.items)}</table>
      <p style="text-align:right;font-weight:bold;">कुल: ${formatRupees(order.total)}</p>
      <p>डिलीवरी का पता:<br/>${order.addressLine}, ${order.city}, ${order.state} - ${order.pincode}</p>
      <p style="color:#888;font-size:12px;">Order ID: ${order.id}</p>
    </div>`;

  if (!resend) {
    console.log(`[email] (RESEND_API_KEY not set) would send order confirmation to ${order.guestEmail}:\n${subject}`);
    return;
  }
  await resend.emails.send({ from, to: order.guestEmail, subject, html });
}

export async function sendNewOrderAlert(order: OrderWithItems) {
  const notifyEmail = process.env.BUSINESS_NOTIFY_EMAIL;
  if (!notifyEmail) return;

  const resend = getResend();
  const from = process.env.EMAIL_FROM ?? "Ritkalp <orders@ritkalp.example>";
  const subject = `New order — ${formatRupees(order.total)} — ${order.guestName}`;
  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
      <h2>New order (${order.source})</h2>
      <p><strong>${order.guestName}</strong> · ${order.guestPhone}${order.guestEmail ? ` · ${order.guestEmail}` : ""}</p>
      <table style="width:100%;border-collapse:collapse;">${itemsHtml(order.items)}</table>
      <p style="text-align:right;font-weight:bold;">Total: ${formatRupees(order.total)}</p>
      <p>Deliver to:<br/>${order.addressLine}, ${order.city}, ${order.state} - ${order.pincode}</p>
      <p style="color:#888;font-size:12px;">Order ID: ${order.id} · Status: ${order.status} · Payment: ${order.paymentStatus}</p>
    </div>`;

  if (!resend) {
    console.log(`[email] (RESEND_API_KEY not set) would send new-order alert to ${notifyEmail}:\n${subject}`);
    return;
  }
  await resend.emails.send({ from, to: notifyEmail, subject, html });
}
