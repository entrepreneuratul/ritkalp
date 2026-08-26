"use client";

import { useCart } from "@/context/CartContext";

export default function CartIcon() {
  const { totalItems, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="press-feedback group relative p-2 text-primary hover:text-accent-600 transition-colors"
      aria-label={`कार्ट खोलें${totalItems > 0 ? ` — ${totalItems} items` : ""}`}
    >
      <BagIcon className="h-6 w-6 transition-transform duration-300 ease-[var(--ease-spring)] group-hover:-rotate-6 group-hover:scale-110" />
      {totalItems > 0 && (
        <span
          key={totalItems}
          className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-onaccent ring-2 ring-surface"
          style={{ animation: "badge-pop 0.4s var(--ease-spring) both" }}
        >
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}

function BagIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 7h12l-1 13a1 1 0 01-1 1H8a1 1 0 01-1-1L6 7zM9 7a3 3 0 016 0"
      />
    </svg>
  );
}
