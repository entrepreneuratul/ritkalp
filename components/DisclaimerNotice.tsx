// =====================================================================
// PERISHABLE ITEMS DISCLAIMER
// Fruits, sweets, flowers, milk, and curd spoil in transit, so they are
// never shipped with any order — this banner makes that clear wherever
// a customer is browsing kits or about to check out, so there's no
// surprise later. This policy is a shipping-logistics constraint, not
// a festival-specific one, so it's the same across Navratri, Diwali,
// and Holi — edit the item list below (and the message) in one place
// if the policy ever changes.
// =====================================================================

const EXCLUDED_ITEMS = ["फल (Fruits)", "मिठाई (Sweets)", "फूल (Flowers)", "दूध (Milk)", "दही (Curd)"];

export default function DisclaimerNotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-accent-300 bg-accent-50 px-4 py-3.5 text-left ${className}`}
    >
      <AlertIcon className="h-5 w-5 shrink-0 text-accent-700 mt-0.5" />
      <p className="text-sm text-primary-700 leading-relaxed">
        <strong className="text-primary-800">ध्यान दें:</strong> जल्दी खराब होने
        की वजह से {EXCLUDED_ITEMS.join(", ")} किसी भी ऑर्डर में शामिल नहीं किए
        जाते — बाकी सारी पूजा सामग्री आपको पूरी मिलेगी। कृपया इन्हें अपने
        नज़दीकी स्तर पर स्वयं व्यवस्था करें।
      </p>
    </div>
  );
}

function AlertIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v4m0 4h.01M10.29 3.86l-8.02 13.9A1.5 1.5 0 003.55 20h16.9a1.5 1.5 0 001.28-2.24l-8.02-13.9a1.5 1.5 0 00-2.6 0z"
      />
    </svg>
  );
}
