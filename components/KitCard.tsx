"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { LOAD_BASE_EVENT } from "./KitBuilder";
import type { KitItem } from "@/lib/festivals/types";

const INITIAL_VISIBLE_ITEMS = 4;
const MAX_TILT_DEG = 5;

export default function KitCard({
  kit,
  festivalSlug,
}: {
  kit: KitItem;
  festivalSlug: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const hasMoreItems = kit.items.length > INITIAL_VISIBLE_ITEMS;
  const visibleItems = isExpanded ? kit.items : kit.items.slice(0, INITIAL_VISIBLE_ITEMS);

  // Subtle cursor-following 3D tilt — the classic "premium product
  // card" touch. Small angle (MAX_TILT_DEG) so it reads as depth, not
  // a gimmick, and resets smoothly on mouse leave.
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    setTilt({
      x: (py - 0.5) * -2 * MAX_TILT_DEG,
      y: (px - 0.5) * 2 * MAX_TILT_DEG,
    });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  function handleLoadIntoBuilder() {
    window.dispatchEvent(
      new CustomEvent(LOAD_BASE_EVENT, { detail: { festivalSlug, kitId: kit.id } })
    );
  }

  return (
    <div style={{ perspective: "1200px" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
            tilt.x || tilt.y ? "translateY(-4px)" : ""
          }`,
          transformStyle: "preserve-3d",
          transition: tilt.x || tilt.y ? "transform 0.1s var(--ease-smooth)" : "transform 0.5s var(--ease-spring)",
        }}
        className={`hover-glow group flex h-full flex-col overflow-hidden rounded-2xl border bg-surface ${
          kit.featured
            ? "border-accent-400 ring-2 ring-accent-300 shadow-lg shadow-accent-900/10"
            : "border-accent-200/70"
        }`}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-primary-50">
          <Image
            src={kit.image}
            alt={kit.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {kit.badge && (
            <span className="absolute top-3 left-3 rounded-full bg-accent text-onaccent text-xs font-bold px-3 py-1 shadow">
              {kit.badge}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display text-xl font-semibold text-primary-800">
            {kit.name}
          </h3>
          <p className="mt-1.5 text-sm text-primary-600/80 leading-relaxed">
            {kit.description}
          </p>

          <div className="mt-4">
            <p className="text-xs font-semibold tracking-wide text-accent-700 uppercase mb-2">
              What&apos;s included
            </p>
            <ul className="space-y-1.5">
              {visibleItems.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-primary-700">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {hasMoreItems && (
              <button
                type="button"
                onClick={() => setIsExpanded((prev) => !prev)}
                className="mt-2 text-xs font-semibold text-primary-600 hover:text-accent-700 underline underline-offset-2"
              >
                {isExpanded
                  ? "Show less"
                  : `+ ${kit.items.length - INITIAL_VISIBLE_ITEMS} more items`}
              </button>
            )}
          </div>

          <div className="mt-6 pt-5 border-t border-accent-200/60">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-primary-500">Starting at</p>
                <p className="font-display text-2xl font-semibold text-primary-800">
                  ₹{kit.startingPrice.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Quantity stepper — "jitna item chahiye" */}
              <div className="flex items-center border border-accent-300 rounded-full">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="press-feedback w-8 h-8 flex items-center justify-center text-primary-700 hover:text-accent-700"
                  aria-label="मात्रा घटाएं"
                >
                  −
                </button>
                <span className="w-7 text-center text-sm font-semibold text-primary-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="press-feedback w-8 h-8 flex items-center justify-center text-primary-700 hover:text-accent-700"
                  aria-label="मात्रा बढ़ाएं"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={handleLoadIntoBuilder}
                className="press-feedback flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border-2 border-primary text-primary py-2.5 font-heavy text-xs tracking-wide uppercase hover:bg-primary-50 transition-colors duration-200"
              >
                Load into Builder
              </button>
              <button
                type="button"
                onClick={() =>
                  addToCart(festivalSlug, kit.id, quantity, {
                    name: kit.name,
                    image: kit.image,
                    items: kit.items,
                    unitPrice: kit.startingPrice,
                    // Not a Kit Builder combo — kit.id already resolves
                    // to a real DB Kit row, this snapshot is only a
                    // defensive fallback for the unlikely case it doesn't.
                    extraIds: [],
                  })
                }
                aria-label="कार्ट में डालें"
                title="कार्ट में डालें"
                className="press-feedback shrink-0 inline-flex items-center justify-center rounded-full bg-accent text-onaccent w-11 h-11 shadow-md shadow-accent-900/20 hover:bg-accent-400 hover:-translate-y-0.5 transition-all duration-200"
              >
                <CartPlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CartPlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 7h12l-1 13a1 1 0 01-1 1H8a1 1 0 01-1-1L6 7zM9 7a3 3 0 016 0M10 12h4M12 10v4"
      />
    </svg>
  );
}
