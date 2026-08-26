// =====================================================================
// RAZORPAY — server-only SDK client. Reads keys lazily (inside the
// getter, not at module load) so the rest of the app keeps working
// before RAZORPAY_KEY_ID/SECRET are set — only the payment routes that
// actually need them will error, with a clear message, instead of the
// whole app failing to build/boot.
// =====================================================================

import Razorpay from "razorpay";

let client: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error(
      "Razorpay isn't configured yet — set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET " +
        "(Razorpay Dashboard → Settings → API Keys; test-mode keys work without KYC)."
    );
  }
  if (!client) {
    client = new Razorpay({ key_id: keyId, key_secret: keySecret });
  }
  return client;
}
