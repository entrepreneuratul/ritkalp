import LegalPageShell from "@/components/legal/LegalPageShell";
import { businessConfig } from "@/config/business";

export const metadata = { title: "Terms of Service | Ritkalp" };

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service" lastUpdated="27 August 2026">
      <p>
        These Terms of Service (&quot;Terms&quot;) govern your use of the{" "}
        {businessConfig.businessName} website and your purchase of puja kits
        and related products through it. By placing an order — whether by
        completing checkout on this website or by confirming an order over
        WhatsApp — you agree to these Terms.
      </p>

      <h2>1. About {businessConfig.businessName}</h2>
      <p>
        {businessConfig.businessName} is a puja-kit business based in{" "}
        {businessConfig.address}, selling handpicked, complete puja
        samagri kits for Navratri, Diwali, Holi, and other festivals,
        delivered pan-India.
      </p>
      <h2>2. Products &amp; Pricing</h2>
      <ul>
        <li>
          All prices are listed in Indian Rupees (₹) and are indicative —
          the final price is confirmed with you before or at checkout, and
          may vary slightly based on ingredient availability and market
          rates for fresh/seasonal items.
        </li>
        <li>
          Puja items are natural/handmade products (flowers, samagri,
          idols, etc.) — minor variation in appearance, size, or shade
          from any photo shown on the site is normal and not a defect.
        </li>
        <li>
          <strong>Perishable items — फल (Fruits), मिठाई (Sweets), फूल
          (Flowers), दूध (Milk), and दही (Curd) — are never included in
          any shipped order</strong>, as they spoil in transit. Please
          arrange these locally; every other item in your chosen kit is
          included in full.
        </li>
      </ul>

      <h2>3. Placing an Order</h2>
      <p>You can order in either of two ways:</p>
      <ul>
        <li>
          <strong>Online payment</strong> — add items to your cart, enter
          delivery details, and pay securely via Razorpay. Your order is
          confirmed automatically the moment payment succeeds.
        </li>
        <li>
          <strong>WhatsApp</strong> — send us your order over WhatsApp; we
          confirm availability, final price, and delivery timeline in
          conversation before you pay.
        </li>
      </ul>
      <p>No account is required to order — guest checkout is always available.</p>

      <h2>4. Payments</h2>
      <p>
        Online payments are processed by Razorpay, a licensed payment
        aggregator. We never see or store your card, UPI, or banking
        details — Razorpay handles that directly on their secure,
        PCI-DSS-compliant systems. WhatsApp orders are paid for by
        whatever method we agree on in that conversation.
      </p>

      <h2>5. Shipping &amp; Delivery</h2>
      <p>
        We deliver pan-India. Dispatch and delivery timelines are
        communicated to you after your order is confirmed (via WhatsApp),
        and can vary with your location, courier availability, and
        festival-season demand. See our{" "}
        <a href="/legal/refund-policy" className="underline underline-offset-2">
          Refund &amp; Cancellation Policy
        </a>{" "}
        for what happens if an item arrives damaged, wrong, or missing.
      </p>

      <h2>6. Accounts</h2>
      <p>
        Creating an account is optional and only used to show you your
        past order history. You&apos;re responsible for keeping your
        password confidential; let us know right away if you believe your
        account has been accessed without your permission.
      </p>

      <h2>7. Use of the Website</h2>
      <p>
        You agree to provide accurate delivery and contact details, and
        not to use this website for any unlawful purpose. All content on
        this site — text, images, logo, and design — belongs to{" "}
        {businessConfig.businessName} and may not be reproduced without
        permission.
      </p>

      <h2>8. Liability</h2>
      <p>
        Puja kits are sold for personal devotional and religious use.
        While we take care in sourcing and packing every kit, we are not
        liable for how items are subsequently used, nor for any indirect
        or consequential loss. Our total liability for any order is
        limited to the amount you paid for that order.
      </p>

      <h2>9. Grievance Officer</h2>
      <p>
        In accordance with applicable Indian consumer protection and
        e-commerce rules, any complaint or grievance regarding an order
        can be addressed to:
      </p>
      <p>
        <strong>Atul Srivastava</strong>
        <br />
        Email:{" "}
        <a href="mailto:atul.viet@gmail.com" className="underline underline-offset-2">
          atul.viet@gmail.com
        </a>
        <br />
        WhatsApp: {businessConfig.whatsappDisplayNumber}
      </p>
      <p>We aim to acknowledge every complaint within 48 hours.</p>

      <h2>10. Governing Law</h2>
      <p>
        These Terms are governed by the laws of India, with courts in
        Uttarakhand having exclusive jurisdiction.
      </p>

      <h2>11. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time; the &quot;Last
        updated&quot; date at the top of this page will always reflect the
        latest version. Continuing to use the site after a change means
        you accept the updated Terms.
      </p>
    </LegalPageShell>
  );
}
