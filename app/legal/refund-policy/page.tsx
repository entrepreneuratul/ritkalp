import LegalPageShell from "@/components/legal/LegalPageShell";
import { businessConfig } from "@/config/business";

export const metadata = { title: "Refund & Cancellation Policy | Ritkalp" };

export default function RefundPolicyPage() {
  return (
    <LegalPageShell title="Refund & Cancellation Policy" lastUpdated="27 August 2026">
      <h2>1. Order Cancellation</h2>
      <p>
        Cancellation is allowed any time before your kit has been packed
        for dispatch, since every kit is assembled fresh per order:
      </p>
      <ul>
        <li>
          To cancel, message us on WhatsApp at {businessConfig.whatsappDisplayNumber}{" "}
          as soon as possible after ordering.
        </li>
        <li>
          If your kit hasn&apos;t been packed yet, we&apos;ll cancel it and refund
          any online payment in full.
        </li>
        <li>
          Once a kit has been packed or dispatched, it can no longer be
          cancelled — see Returns below for what to do if something
          arrives wrong.
        </li>
      </ul>

      <h2>2. Returns &amp; Replacements</h2>
      <p>
        Because puja kits contain consumable and religious items prepared
        specifically for your order, we don&apos;t accept general
        change-of-mind returns. We will replace or refund an item if:
      </p>
      <ul>
        <li>it arrived damaged,</li>
        <li>you received the wrong item, or</li>
        <li>an item listed in your kit was missing.</li>
      </ul>
      <p>
        Please message us on WhatsApp within 48 hours of delivery with a
        photo of the item/kit and your order details. We&apos;ll arrange a
        replacement or refund at our discretion, whichever is quicker for
        you.
      </p>
      <p className="legal-note">
        जल्दी खराब होने की वजह से फल (Fruits), मिठाई (Sweets), फूल (Flowers),
        दूध (Milk), और दही (Curd) किसी भी ऑर्डर में शामिल नहीं किए जाते — इसलिए
        इनसे जुड़ी कोई शिकायत लागू नहीं होती। बाकी सभी सामग्री की गारंटी है।
      </p>

      <h2>3. Refunds</h2>
      <ul>
        <li>
          <strong>Payment failed but money was deducted:</strong> Razorpay
          automatically reverses this — it typically reflects in your
          account within 5–7 business days, depending on your bank.
        </li>
        <li>
          <strong>Approved cancellation/replacement refund:</strong> we
          initiate it via Razorpay within 2 business days of approving your
          request; it then follows the same 5–7 business day bank
          timeline.
        </li>
        <li>
          Refunds for online payments are credited back to the original
          payment method only. WhatsApp orders paid for outside Razorpay
          are refunded the same way they were paid.
        </li>
      </ul>

      <h2>4. Shipping &amp; Delivery Address Changes</h2>
      <p>
        We deliver pan-India. Estimated delivery timelines are shared with
        you via WhatsApp once your order is confirmed, and can vary by
        location and festival-season courier demand. If you need to change
        your delivery address, message us right away — we can only update
        it before the order has been dispatched.
      </p>

      <h2>5. Contact</h2>
      <p>
        For any cancellation, return, or refund request, message us on
        WhatsApp at {businessConfig.whatsappDisplayNumber}. We aim to
        respond within 48 hours.
      </p>
    </LegalPageShell>
  );
}
