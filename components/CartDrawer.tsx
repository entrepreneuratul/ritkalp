"use client";

import { useEffect, useState, type ChangeEvent, type InputHTMLAttributes } from "react";
import Image from "next/image";
import Script from "next/script";
import { useCart, type CartItem } from "@/context/CartContext";
import { getFestival } from "@/lib/festivals/registry";
import { findPurchasableItem } from "@/lib/festivals/catalog";
import DisclaimerNotice from "./DisclaimerNotice";
import { buildWhatsAppUrl } from "@/config/business";
import { buildOrderSummaryMessage, type CustomerDetails } from "@/lib/orderMessage";

// Minimal shape of the global `window.Razorpay` Checkout.js exposes —
// just enough to open the widget, not a full SDK type definition.
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; contact?: string; email?: string };
  theme?: { color?: string };
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  modal?: { ondismiss?: () => void };
}

// Delivery details are cached here so returning customers don't have to
// retype their address every time — this is plain localStorage on their
// own device, never sent anywhere until they themselves tap "Pay Now".
const CHECKOUT_STORAGE_KEY = "ritkalp_checkout_details_v1";

const EMPTY_CUSTOMER: CustomerDetails = {
  name: "",
  phone: "",
  addressLine: "",
  city: "",
  state: "",
  pincode: "",
};

type Step = "cart" | "checkout" | "success";
type SuccessKind = "paid" | "whatsapp";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalEstimate,
    clearCart,
  } = useCart();

  const [step, setStep] = useState<Step>("cart");
  const [successKind, setSuccessKind] = useState<SuccessKind>("whatsapp");
  const [customer, setCustomer] = useState<CustomerDetails>(EMPTY_CUSTOMER);
  const [isPaying, setIsPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Pre-fill delivery details from a previous order, if any.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (raw) setCustomer(JSON.parse(raw));
    } catch {
      // ignore — form just starts blank
    }
  }, []);

  // Lock background scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const isFormValid =
    customer.name.trim().length > 1 &&
    customer.phone.trim().replace(/\D/g, "").length >= 10 &&
    customer.addressLine.trim().length > 3 &&
    customer.city.trim().length > 1 &&
    customer.state.trim().length > 1 &&
    customer.pincode.trim().replace(/\D/g, "").length >= 6;

  async function handlePayNow() {
    if (!isFormValid) return;
    try {
      localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(customer));
    } catch {
      // ignore — order still goes through, just won't be pre-filled next time
    }

    // Record the order in the database too, best-effort — a failure
    // here (network hiccup, etc.) must never block the WhatsApp flow
    // the business actually depends on for confirming orders today.
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            festivalSlug: i.festivalSlug,
            kitId: i.kitId,
            quantity: i.quantity,
            custom: i.custom,
          })),
          customer: {
            name: customer.name,
            phone: customer.phone,
            email: customer.email || undefined,
            addressLine: customer.addressLine,
            city: customer.city,
            state: customer.state,
            pincode: customer.pincode,
          },
        }),
      });
    } catch (err) {
      console.error("Could not save order record:", err);
    }

    const message = buildOrderSummaryMessage(items, customer);
    const url = buildWhatsAppUrl(message);
    window.open(url, "_blank", "noopener,noreferrer");
    clearCart();
    setSuccessKind("whatsapp");
    setStep("success");
  }

  async function handlePayOnline() {
    if (!isFormValid || isPaying) return;
    setPayError(null);
    setIsPaying(true);
    try {
      try {
        localStorage.setItem(CHECKOUT_STORAGE_KEY, JSON.stringify(customer));
      } catch {
        // ignore — order still goes through, just won't be pre-filled next time
      }

      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            festivalSlug: i.festivalSlug,
            kitId: i.kitId,
            quantity: i.quantity,
            custom: i.custom,
          })),
          customer,
        }),
      });
      if (!res.ok) throw new Error("could not start payment");
      const data: { razorpayOrderId: string; amount: number; currency: string } = await res.json();

      if (!window.Razorpay) throw new Error("payment widget didn't load — check your connection");

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
        amount: data.amount,
        currency: data.currency,
        name: "Ritkalp",
        description: "Puja Kit Order",
        order_id: data.razorpayOrderId,
        prefill: { name: customer.name, contact: customer.phone, email: customer.email },
        theme: { color: "#7A1F2B" },
        handler: async (response) => {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            if (!verifyRes.ok) throw new Error("verification failed");
            clearCart();
            setSuccessKind("paid");
            setStep("success");
          } catch (err) {
            console.error(err);
            setPayError("भुगतान हो गया लेकिन कन्फर्म करने में दिक्कत आई — कृपया WhatsApp पर संपर्क करें।");
          } finally {
            setIsPaying(false);
          }
        },
        modal: { ondismiss: () => setIsPaying(false) },
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setPayError("भुगतान शुरू नहीं हो सका — कृपया फिर से कोशिश करें या WhatsApp से ऑर्डर करें।");
      setIsPaying(false);
    }
  }

  function handleClose() {
    closeCart();
    if (step === "success") {
      // Reset for next time, after the slide-out animation finishes.
      setTimeout(() => setStep("cart"), 300);
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        aria-hidden="true"
        className={`fixed inset-0 bg-primary-900/50 backdrop-blur-sm z-[60] transition-opacity duration-500 ease-[var(--ease-smooth)] ${
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="कार्ट"
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-surface z-[70] shadow-2xl flex flex-col transition-transform duration-500 ease-[var(--ease-smooth)] ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-accent-200 shrink-0">
          <h2 className="font-display text-xl font-semibold text-primary-800">
            {step === "cart" && "आपका कार्ट"}
            {step === "checkout" && "डिलीवरी की जानकारी"}
            {step === "success" && (successKind === "paid" ? "ऑर्डर कन्फर्म" : "ऑर्डर भेज दिया गया")}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="press-feedback p-1.5 text-primary-600 hover:text-primary-900 transition-colors"
            aria-label="कार्ट बंद करें"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === "cart" &&
            (items.length === 0 ? (
              <EmptyCart />
            ) : (
              <>
                <CartItemsList
                  items={items}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
                <DisclaimerNotice className="mt-6" />
              </>
            ))}
          {step === "checkout" && (
            <CheckoutForm customer={customer} setCustomer={setCustomer} />
          )}
          {step === "success" && <SuccessView kind={successKind} onContinue={handleClose} />}
        </div>

        {step === "cart" && items.length > 0 && (
          <div className="border-t border-accent-200 px-5 py-4 shrink-0">
            <div className="flex justify-between text-sm text-primary-700 mb-3">
              <span>अनुमानित कुल ({totalItems} items)</span>
              <span className="font-semibold">₹{totalEstimate.toLocaleString("en-IN")}</span>
            </div>
            <button
              type="button"
              onClick={() => setStep("checkout")}
              className="press-feedback w-full rounded-full bg-primary text-surface py-3 font-semibold hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-900/20 transition-all duration-300 ease-[var(--ease-spring)]"
            >
              Buy Now
            </button>
          </div>
        )}

        {step === "checkout" && (
          <div className="border-t border-accent-200 px-5 py-4 shrink-0 space-y-2">
            <div className="flex justify-between text-sm text-primary-700 mb-1">
              <span>अनुमानित कुल</span>
              <span className="font-semibold">₹{totalEstimate.toLocaleString("en-IN")}</span>
            </div>

            {payError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-xs text-red-700">{payError}</p>
            )}

            {/* Primary — real payment, instant confirmation. */}
            <button
              type="button"
              onClick={handlePayOnline}
              disabled={!isFormValid || isPaying}
              className="press-feedback w-full rounded-full bg-accent text-onaccent py-3 font-semibold hover:bg-accent-400 hover:shadow-lg hover:shadow-accent-900/20 transition-all duration-300 ease-[var(--ease-spring)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-accent disabled:hover:shadow-none"
            >
              {isPaying ? "प्रोसेस हो रहा है…" : "Pay Online"}
            </button>

            {/* Secondary — the original flow, kept exactly as-is for
                whoever would rather order over WhatsApp. */}
            <button
              type="button"
              onClick={handlePayNow}
              disabled={!isFormValid}
              className="press-feedback w-full rounded-full border border-accent-300 text-primary-700 py-2.5 text-sm font-semibold hover:bg-accent-50 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              या WhatsApp पर ऑर्डर करें
            </button>
            <p className="text-center text-[11px] text-primary-500">
              Pay Online से भुगतान तुरंत कन्फर्म होता है। WhatsApp वाला तरीका पहले जैसा ही है — बात करके भुगतान।
            </p>
            <button
              type="button"
              onClick={() => setStep("cart")}
              className="w-full text-xs text-primary-500 underline underline-offset-2 pt-1"
            >
              ← कार्ट पर वापस जाएं
            </button>
          </div>
        )}
      </div>

      {/* Razorpay Checkout.js — loaded once, lazily, only needed once a
          visitor reaches the checkout step. */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
    </>
  );
}

function CartItemsList({
  items,
  updateQuantity,
  removeFromCart,
}: {
  items: CartItem[];
  updateQuantity: (festivalSlug: string, kitId: string, quantity: number) => void;
  removeFromCart: (festivalSlug: string, kitId: string) => void;
}) {
  return (
    <ul className="space-y-5">
      {items.map((item) => {
        const festival = getFestival(item.festivalSlug);
        // A Kit Builder line carries its own name/image/price snapshot
        // (see CustomCartSnapshot) instead of being looked up from the
        // festival's catalog — everything below reads from whichever is
        // present, so both line kinds render identically.
        const catalogKit = festival ? findPurchasableItem(festival, item.kitId) : undefined;
        const line = item.custom ?? catalogKit;
        if (!line || !festival) return null;
        return (
          <li key={`${item.festivalSlug}-${item.kitId}`} className="flex gap-3">
            <div className="relative h-16 w-16 rounded-lg overflow-hidden shrink-0 bg-primary-50 ring-1 ring-accent-200/60">
              <Image src={line.image} alt={line.name} fill className="object-cover" sizes="64px" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-accent-600">
                {festival.nameEnglish}
              </p>
              <p className="text-sm font-semibold text-primary-800 truncate">{line.name}</p>
              <p className="text-xs text-primary-500">
                ₹{(item.custom ? item.custom.unitPrice : catalogKit!.startingPrice).toLocaleString("en-IN")} / kit
              </p>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center border border-accent-300 rounded-full">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.festivalSlug, item.kitId, item.quantity - 1)}
                    className="press-feedback w-7 h-7 flex items-center justify-center text-primary-700 hover:text-accent-700"
                    aria-label="मात्रा घटाएं"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-primary-800">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.festivalSlug, item.kitId, item.quantity + 1)}
                    className="press-feedback w-7 h-7 flex items-center justify-center text-primary-700 hover:text-accent-700"
                    aria-label="मात्रा बढ़ाएं"
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.festivalSlug, item.kitId)}
                  className="text-xs text-primary-400 hover:text-primary-700 underline underline-offset-2"
                >
                  हटाएं
                </button>
              </div>
            </div>
            <p className="text-sm font-semibold text-primary-800 shrink-0">
              ₹{((item.custom ? item.custom.unitPrice : catalogKit!.startingPrice) * item.quantity).toLocaleString("en-IN")}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16">
      <BagOutlineIcon className="h-16 w-16 text-accent-300 mb-4" />
      <p className="text-primary-600">आपका कार्ट खाली है</p>
      <p className="text-sm text-primary-500 mt-1">
        कोई भी kit चुनें और &quot;कार्ट में डालें&quot; पर टैप करें।
      </p>
    </div>
  );
}

function CheckoutForm({
  customer,
  setCustomer,
}: {
  customer: CustomerDetails;
  setCustomer: (c: CustomerDetails) => void;
}) {
  const update =
    (field: keyof CustomerDetails) => (e: ChangeEvent<HTMLInputElement>) =>
      setCustomer({ ...customer, [field]: e.target.value });

  return (
    <div className="space-y-4">
      <Field label="पूरा नाम *" value={customer.name} onChange={update("name")} placeholder="आपका नाम" />
      <Field
        label="मोबाइल नंबर *"
        value={customer.phone}
        onChange={update("phone")}
        placeholder="10-अंकों का मोबाइल नंबर"
        type="tel"
        inputMode="numeric"
      />
      <Field
        label="ईमेल (ऑर्डर रसीद के लिए, वैकल्पिक)"
        value={customer.email ?? ""}
        onChange={update("email")}
        placeholder="you@example.com"
        type="email"
      />
      <Field
        label="पता (मकान नं., गली/मोहल्ला) *"
        value={customer.addressLine}
        onChange={update("addressLine")}
        placeholder="मकान नं., गली/मोहल्ला"
      />
      <div className="grid grid-cols-2 gap-3">
        <Field label="शहर *" value={customer.city} onChange={update("city")} placeholder="शहर" />
        <Field label="राज्य *" value={customer.state} onChange={update("state")} placeholder="राज्य" />
      </div>
      <Field
        label="पिनकोड *"
        value={customer.pincode}
        onChange={update("pincode")}
        placeholder="पिनकोड"
        type="tel"
        inputMode="numeric"
      />
      <p className="text-xs text-primary-500/70 italic">
        यह जानकारी सिर्फ आपके इस डिवाइस पर सेव होती है, ताकि अगली बार दोबारा न भरनी पड़े।
      </p>
    </div>
  );
}

function Field({
  label,
  ...inputProps
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-primary-600 mb-1 block">{label}</span>
      <input
        {...inputProps}
        className="w-full rounded-lg border border-accent-300 px-3 py-2.5 text-sm text-primary-800 bg-surface focus:outline-none focus:ring-2 focus:ring-accent-400 placeholder:text-primary-300"
      />
    </label>
  );
}

function SuccessView({
  kind,
  onContinue,
}: {
  kind: "paid" | "whatsapp";
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center py-16 px-2">
      <div className="h-16 w-16 rounded-full bg-accent-100 flex items-center justify-center mb-4">
        <CheckIcon className="h-8 w-8 text-accent-700" />
      </div>
      {kind === "paid" ? (
        <>
          <p className="text-primary-800 font-semibold mb-1">भुगतान सफल — आपका ऑर्डर कन्फर्म हो गया है 🎉</p>
          <p className="text-sm text-primary-600">
            ऑर्डर की रसीद (अगर ईमेल दिया हो) भेज दी गई है। हमारी टीम जल्द ही डिलीवरी शुरू करेगी।
          </p>
        </>
      ) : (
        <>
          <p className="text-primary-800 font-semibold mb-1">आपका ऑर्डर WhatsApp पर भेज दिया गया है</p>
          <p className="text-sm text-primary-600">
            WhatsApp में मैसेज भेजना न भूलें — हमारी टीम जल्द ही ऑर्डर कन्फर्म करेगी।
          </p>
        </>
      )}
      <button
        type="button"
        onClick={onContinue}
        className="press-feedback mt-6 rounded-full bg-primary text-surface px-6 py-2.5 text-sm font-semibold hover:bg-primary-600 hover:-translate-y-0.5 transition-all duration-300 ease-[var(--ease-spring)]"
      >
        और खरीदारी करें
      </button>
    </div>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function BagOutlineIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 7h12l-1 13a1 1 0 01-1 1H8a1 1 0 01-1-1L6 7zM9 7a3 3 0 016 0"
      />
    </svg>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
