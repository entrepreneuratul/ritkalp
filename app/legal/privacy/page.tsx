import LegalPageShell from "@/components/legal/LegalPageShell";
import { businessConfig } from "@/config/business";

export const metadata = { title: "Privacy Policy | Ritkalp" };

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" lastUpdated="24 August 2026">
      <p>
        This Privacy Policy explains what information {businessConfig.businessName}{" "}
        collects when you use this website or place an order, and how it&apos;s
        used. This describes exactly what the site actually does — nothing
        more is collected behind the scenes.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>
          <strong>When you place an order (guest or logged in):</strong> your
          name, phone number, delivery address, and — only if you choose to
          give it, for an order confirmation email — your email address.
        </li>
        <li>
          <strong>If you create an account:</strong> your name, email, and a
          securely hashed password (we never store your actual password —
          only a one-way cryptographic hash of it).
        </li>
        <li>
          <strong>Payment information:</strong> handled entirely by
          Razorpay. We never receive or store your card number, UPI ID, or
          banking details — only the final payment status and a payment
          reference ID.
        </li>
        <li>
          <strong>Cart contents:</strong> stored only in your own browser
          (localStorage), on your device — not sent anywhere until you
          actually place an order.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To prepare, confirm, and deliver your order.</li>
        <li>To contact you about your order (via WhatsApp, phone, or email).</li>
        <li>To send an order confirmation email, if you provided one.</li>
        <li>
          To let you view your own past orders, if you created an account.
        </li>
      </ul>
      <p>
        We do not use your information for advertising, and we do not sell
        or rent your personal information to anyone.
      </p>

      <h2>3. Who We Share It With</h2>
      <ul>
        <li>
          <strong>Razorpay</strong> — to process your payment, if you pay
          online.
        </li>
        <li>
          <strong>Resend</strong> — our email service, only to send you an
          order confirmation (if you gave an email) or to notify our team
          of a new order.
        </li>
        <li>
          <strong>Delivery/courier partners</strong> — your name, phone
          number, and address, only as needed to deliver your order.
        </li>
      </ul>
      <p>
        If you order via WhatsApp, that conversation happens on WhatsApp
        (Meta)&apos;s platform, governed by WhatsApp&apos;s own privacy policy.
      </p>

      <h2>4. Cookies &amp; Local Storage</h2>
      <p>
        We use one small, essential cookie to keep you signed in if you
        have an account (it identifies your session only — it doesn&apos;t
        track you across other websites). Your cart is kept in your
        browser&apos;s local storage, not a cookie. We don&apos;t use any
        advertising or analytics tracking cookies.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We keep order records for as long as reasonably needed for
        accounting, delivery, and handling any post-order questions. If
        you&apos;d like your account or order data deleted, contact us (see
        below) and we&apos;ll action it unless we&apos;re legally required to keep
        certain records (e.g. for tax purposes).
      </p>

      <h2>6. Your Rights</h2>
      <p>
        You can ask us at any time to see what information we hold about
        you, correct it, or delete it. Reach out on WhatsApp at{" "}
        {businessConfig.whatsappDisplayNumber} and we&apos;ll help.
      </p>

      <h2>7. Children&apos;s Privacy</h2>
      <p>This website is intended for adults placing orders on their own behalf; we don&apos;t knowingly collect data from children.</p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy occasionally; the &quot;Last
        updated&quot; date above always reflects the latest version.
      </p>
    </LegalPageShell>
  );
}
