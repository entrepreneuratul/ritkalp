// =====================================================================
// BUSINESS CONFIG
// Edit this file to update your business's contact details. Every
// WhatsApp button on the site reads from `whatsappNumber` here, so you
// only ever need to change it in this one place.
// =====================================================================

export const businessConfig = {
  businessName: "Ritkalp",

  // WhatsApp number, WITH country code, digits only — no "+", no spaces,
  // no dashes. Example: "919260961388" for a +91 Indian number.
  whatsappNumber: "919260961388",

  // Shown as plain text in the footer / final CTA for people who'd
  // rather save the number manually than tap a button.
  whatsappDisplayNumber: "+91 92609 61388",

  // TODO: replace with your real Instagram handle URL, or remove the
  // Instagram link from the footer if you don't have one yet.
  instagramUrl: "https://instagram.com/",

  // Shown in the footer as plain text.
  address: "Rishikesh, Uttarakhand, India",

  // Core mission statement, used prominently in the Hero section.
  taglineHindi: "आप पूजा की तैयारी करिए, बाकी सारी व्यवस्था हम कर देंगे",
  taglineEnglish: "You focus on the devotion, we'll handle every item of the puja.",
};

/**
 * Builds a `wa.me` deep link that opens WhatsApp (the mobile app on
 * phones, WhatsApp Web on desktop) with `businessConfig.whatsappNumber`
 * and a pre-filled, URL-encoded message.
 */
export function buildWhatsAppUrl(message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${businessConfig.whatsappNumber}?text=${encodedMessage}`;
}

/**
 * Standard pre-filled message for a specific puja kit. Used by
 * <WhatsAppButton productName="..." /> so every "Order on WhatsApp"
 * button across the site sends a consistent, useful first message.
 * `collectionName` comes from the active festival's
 * `whatsappCollectionName` (e.g. "Navratri", "Diwali", "Holi").
 */
export function buildKitMessage(kitName: string, collectionName: string): string {
  return `Hi! I'm interested in the ${kitName} from your ${collectionName} collection. Please share more details.`;
}

/**
 * Generic pre-filled message used when there's no specific kit in
 * context (e.g. the hero/final-CTA "Chat on WhatsApp" buttons).
 */
export function buildGeneralMessage(collectionName: string): string {
  return `Hi! I'd like to know more about your ${collectionName} puja kits.`;
}
