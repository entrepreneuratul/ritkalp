// =====================================================================
// ORDER MESSAGE BUILDER
// Turns the cart contents + delivery details into the WhatsApp message
// sent when a customer taps "Pay Now" in the cart. There is still no
// payment processing anywhere on this site — this only formats text
// for a wa.me link; the order is confirmed and paid for over WhatsApp,
// exactly like every other "Order Now" button on the site. Cart lines
// can span multiple festivals (if a customer switched collections
// mid-shop), so each line is resolved against ITS OWN festival.
// =====================================================================

import { getFestival } from "@/lib/festivals/registry";
import { findPurchasableItem } from "@/lib/festivals/catalog";
import type { CartItem } from "@/context/CartContext";

export interface CustomerDetails {
  name: string;
  phone: string;
  /** Optional — only used to email an order confirmation/receipt (see
   *  lib/email.ts); never required, guest checkout works without it. */
  email?: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export function buildOrderSummaryMessage(
  items: CartItem[],
  customer: CustomerDetails
): string {
  const lines: string[] = [];
  lines.push("🙏 नमस्ते! मैं यह ऑर्डर करना चाहता/चाहती हूं:");
  lines.push("");

  let total = 0;
  items.forEach((item, index) => {
    const festival = getFestival(item.festivalSlug);
    const catalogKit = festival ? findPurchasableItem(festival, item.kitId) : undefined;
    // A Kit Builder line carries its own name/price snapshot (see
    // CustomCartSnapshot) instead of a catalog lookup — see CartContext.tsx.
    const name = item.custom?.name ?? catalogKit?.name;
    const unitPrice = item.custom?.unitPrice ?? catalogKit?.startingPrice;
    if (!festival || name === undefined || unitPrice === undefined) return;
    const lineTotal = unitPrice * item.quantity;
    total += lineTotal;
    lines.push(
      `${index + 1}. [${festival.nameEnglish}] ${name} × ${item.quantity} — ₹${lineTotal.toLocaleString("en-IN")}`
    );
    if (item.custom) {
      lines.push(`   शामिल: ${item.custom.items.join(", ")}`);
    }
  });

  lines.push("");
  lines.push(`अनुमानित कुल: ₹${total.toLocaleString("en-IN")}`);
  lines.push("(अंतिम कीमत व डिलीवरी चार्ज WhatsApp पर कन्फर्म होंगे)");
  lines.push("");
  lines.push("डिलीवरी का पता:");
  lines.push(customer.name);
  lines.push(customer.addressLine);
  lines.push(`${customer.city}, ${customer.state} - ${customer.pincode}`);
  lines.push(`मोबाइल: ${customer.phone}`);

  return lines.join("\n");
}
