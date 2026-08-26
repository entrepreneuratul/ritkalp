"use client";

// =====================================================================
// KIT BUILDER — the centerpiece, Pizzalio's build-a-pizza equivalent.
//
// Step 1: pick a base (reuses festival.kits.items — real kits/prices,
// nothing invented). Step 2: tap-to-add individually priced extras
// (festival.builder.categories) onto a live thali. A sticky order
// summary keeps a running total. "Review & Order" hands the whole
// selection to the EXISTING cart (via CartItem.custom — see
// context/CartContext.tsx), which reopens the already-working
// CartDrawer -> checkout form -> WhatsApp flow. No new checkout UI.
// =====================================================================

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import PujaItemIcon from "./PujaItemIcon";
import FadeIn from "./FadeIn";
import type { BuilderExtraItem, FestivalConfig, KitItem } from "@/lib/festivals/types";

const BLANK_BASE_ID = "__blank__";

/** Dispatched by a Ready-Made KitCard's "Load into Builder" button —
 *  decouples KitsGrid (server component) from KitBuilder's client state
 *  without prop-drilling or a new context, same spirit as a plain DOM
 *  event bridging two independent client islands on the same page. */
export const LOAD_BASE_EVENT = "ritkalp:load-base";

// Fixed thali slot positions (percent from center) + rotation — hand-
// authored, not randomized per render, so a given item always lands in
// the same spot (stable across re-renders / server-client hydration),
// same philosophy as the fixed SPARKLES/BURST_PARTICLES arrays elsewhere
// in this codebase.
const THALI_SLOTS: { top: string; left: string; rotate: number }[] = [
  { top: "18%", left: "50%", rotate: -6 },
  { top: "28%", left: "74%", rotate: 10 },
  { top: "50%", left: "82%", rotate: -4 },
  { top: "72%", left: "72%", rotate: 8 },
  { top: "82%", left: "48%", rotate: -9 },
  { top: "72%", left: "26%", rotate: 5 },
  { top: "50%", left: "16%", rotate: -11 },
  { top: "28%", left: "24%", rotate: 7 },
  { top: "42%", left: "50%", rotate: 3 },
  { top: "58%", left: "58%", rotate: -7 },
  { top: "60%", left: "40%", rotate: 9 },
  { top: "38%", left: "62%", rotate: -3 },
  { top: "36%", left: "38%", rotate: 6 },
  { top: "64%", left: "50%", rotate: -5 },
];

function slotFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return THALI_SLOTS[hash % THALI_SLOTS.length];
}

export default function KitBuilder({ festival }: { festival: FestivalConfig }) {
  const { builder, kits } = festival;
  const { addToCart } = useCart();

  const [baseId, setBaseId] = useState<string>(kits.items[0]?.id ?? BLANK_BASE_ID);
  const [activeCategory, setActiveCategory] = useState(builder.categories[0]?.id ?? "");
  const [extraIds, setExtraIds] = useState<Set<string>>(new Set());
  const [justAdded, setJustAdded] = useState(false);

  const baseKit: KitItem | undefined = kits.items.find((k) => k.id === baseId);
  const allExtras: BuilderExtraItem[] = useMemo(
    () => builder.categories.flatMap((c) => c.items),
    [builder.categories]
  );
  const selectedExtras = allExtras.filter((item) => extraIds.has(item.id));
  const basePrice = baseKit?.startingPrice ?? 0;
  const extrasTotal = selectedExtras.reduce((sum, item) => sum + item.price, 0);
  const total = basePrice + extrasTotal;
  const hasSelection = Boolean(baseKit) || selectedExtras.length > 0;

  function toggleExtra(id: string) {
    setExtraIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 400);
  }

  useEffect(() => {
    function onLoadBase(e: Event) {
      const detail = (e as CustomEvent<{ festivalSlug: string; kitId: string }>).detail;
      if (!detail || detail.festivalSlug !== festival.slug) return;
      setBaseId(detail.kitId);
      setExtraIds(new Set());
      document.getElementById("kit-builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    window.addEventListener(LOAD_BASE_EVENT, onLoadBase);
    return () => window.removeEventListener(LOAD_BASE_EVENT, onLoadBase);
  }, [festival.slug]);

  function handleReview() {
    if (!hasSelection) return;
    const itemList = [
      ...(baseKit ? baseKit.items : []),
      ...selectedExtras.map((e) => `${e.name} (+₹${e.price})`),
    ];
    const name = baseKit
      ? selectedExtras.length > 0
        ? `${baseKit.name} + ${selectedExtras.length} extra${selectedExtras.length > 1 ? "s" : ""}`
        : baseKit.name
      : `${builder.blankBaseLabel} — ${selectedExtras.length} items`;
    const kitId = `builder-${baseId}-${Array.from(extraIds).sort().join("-") || "none"}`;

    addToCart(festival.slug, kitId, 1, {
      name,
      image: baseKit?.image ?? "/images/logo.jpg",
      items: itemList,
      unitPrice: total,
      baseKitId: baseKit ? baseId : undefined,
      extraIds: Array.from(extraIds),
    });
  }

  return (
    <section id="kit-builder" className="relative py-20 sm:py-28 bg-surface-soft overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-2xl mx-auto mb-4">
          <p className="text-sm font-heavy tracking-widest text-accent-600 uppercase mb-3">
            {builder.eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary-800">
            {builder.heading}
          </h2>
          <p className="mt-4 text-primary-600/80">{builder.intro}</p>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr_0.85fr] gap-8 items-start mt-12">
          {/* ---- STEP 1: base ---- */}
          <FadeIn className="lg:order-1">
            <StepLabel n={1} label="अपना बेस चुनें" />
            <div className="mt-4 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setBaseId(BLANK_BASE_ID)}
                className={`press-feedback flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                  baseId === BLANK_BASE_ID
                    ? "border-accent-400 bg-accent-50 ring-2 ring-accent-300"
                    : "border-accent-200 bg-surface hover:border-accent-300"
                }`}
              >
                <span className="text-sm font-semibold text-primary-800">{builder.blankBaseLabel}</span>
                <span className="text-xs text-primary-500">₹0</span>
              </button>
              {kits.items.map((kit) => (
                <button
                  key={kit.id}
                  type="button"
                  onClick={() => setBaseId(kit.id)}
                  className={`press-feedback flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                    baseId === kit.id
                      ? "border-accent-400 bg-accent-50 ring-2 ring-accent-300"
                      : "border-accent-200 bg-surface hover:border-accent-300"
                  }`}
                >
                  <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-primary-50 ring-1 ring-accent-200/60">
                    <Image src={kit.image} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-primary-800">
                      {kit.name}
                    </span>
                    <span className="block text-xs text-primary-500">
                      ₹{kit.startingPrice.toLocaleString("en-IN")}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </FadeIn>

          {/* ---- CENTER: thali + extras picker ---- */}
          <FadeIn delay={80} className="lg:order-2">
            {/* Thali visual */}
            <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent-100 to-accent-200 shadow-inner" />
              <div className="absolute inset-3 rounded-full ring-4 ring-surface/80" />
              <div className="absolute inset-8 rounded-full bg-surface/70 flex items-center justify-center text-center px-6">
                {!baseKit && selectedExtras.length === 0 ? (
                  <p className="text-xs text-primary-500">नीचे से आइटम टैप करके थाली सजाएं</p>
                ) : (
                  <p className="text-xs font-semibold text-primary-700">
                    {baseKit ? baseKit.name : builder.blankBaseLabel}
                  </p>
                )}
              </div>
              {selectedExtras.map((item) => {
                const slot = slotFor(item.id);
                return (
                  <div
                    key={item.id}
                    className="animate-pop-in absolute h-10 w-10 sm:h-11 sm:w-11 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary text-surface shadow-md shadow-primary-900/30 flex items-center justify-center p-2"
                    style={
                      {
                        top: slot.top,
                        left: slot.left,
                        "--pop-rotate": `${slot.rotate}deg`,
                      } as CSSProperties
                    }
                  >
                    <PujaItemIcon icon={item.icon} className="h-full w-full" />
                  </div>
                );
              })}
            </div>

            <p className="mt-3 text-center text-xs text-primary-500">
              {selectedExtras.length} / {allExtras.length} आइटम जोड़े गए
            </p>

            {/* Step 2 — category tabs + item chips */}
            <div className="mt-8">
              <StepLabel n={2} label="जो चाहिए, टैप करें" />
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {builder.categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`press-feedback rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                      activeCategory === cat.id
                        ? "bg-primary text-surface"
                        : "bg-surface text-primary-600 ring-1 ring-accent-200 hover:ring-accent-300"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {builder.categories
                  .find((c) => c.id === activeCategory)
                  ?.items.map((item) => {
                    const selected = extraIds.has(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleExtra(item.id)}
                        className={`press-feedback flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                          selected
                            ? "border-accent-400 bg-accent-50 ring-2 ring-accent-300"
                            : "border-accent-200 bg-surface hover:border-accent-300"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full p-1.5 ${
                            selected ? "bg-primary text-surface" : "bg-primary-50 text-primary-600"
                          }`}
                        >
                          <PujaItemIcon icon={item.icon} className="h-full w-full" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-primary-800">
                            {item.name}
                          </span>
                          <span className="block text-[11px] text-primary-500">+₹{item.price}</span>
                        </span>
                        <span
                          className={`text-lg leading-none ${selected ? "text-accent-600" : "text-primary-300"}`}
                          aria-hidden="true"
                        >
                          {selected ? "✓" : "+"}
                        </span>
                      </button>
                    );
                  })}
              </div>
            </div>
          </FadeIn>

          {/* ---- Order summary (sticky) ---- */}
          <FadeIn delay={140} className="lg:order-3 lg:sticky lg:top-24">
            <div className="rounded-2xl bg-surface border border-accent-200/70 shadow-lg shadow-primary-900/5 p-5 sm:p-6">
              <h3 className="font-heavy text-sm tracking-wide text-primary-800 uppercase mb-4">
                आपका ऑर्डर
              </h3>

              {!hasSelection ? (
                <p className="text-sm text-primary-500">बेस चुनें या कोई आइटम जोड़ें।</p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {baseKit && (
                    <li className="flex items-center justify-between gap-2">
                      <span className="text-primary-700">{baseKit.name}</span>
                      <span className="font-semibold text-primary-800">
                        ₹{basePrice.toLocaleString("en-IN")}
                      </span>
                    </li>
                  )}
                  {selectedExtras.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleExtra(item.id)}
                        className="text-left text-primary-600 hover:text-accent-700 underline decoration-dotted underline-offset-2"
                      >
                        {item.name}
                      </button>
                      <span className="font-semibold text-primary-800">+₹{item.price}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 pt-4 border-t border-accent-200/70 flex items-center justify-between">
                <span className="text-sm font-semibold text-primary-700">TOTAL</span>
                <span
                  key={total}
                  className="animate-pop-in font-heavy text-2xl text-primary-800"
                >
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <button
                type="button"
                onClick={handleReview}
                disabled={!hasSelection}
                className="press-feedback mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-accent text-onaccent py-3 font-heavy tracking-wide shadow-md shadow-accent-900/20 hover:bg-accent-400 hover:-translate-y-0.5 transition-all duration-300 ease-[var(--ease-spring)] disabled:opacity-40 disabled:hover:translate-y-0"
              >
                Review Your Kit
              </button>
              {justAdded && (
                <p className="mt-2 text-center text-[11px] text-accent-700 animate-pop-in">
                  थाली में जोड़ दिया ✓
                </p>
              )}
              {builder.draft && (
                <p className="mt-3 text-[11px] text-primary-400 italic">
                  * कीमतें अनुमानित हैं — अंतिम कीमत WhatsApp पर कन्फर्म होगी।
                </p>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function StepLabel({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-surface font-heavy text-xs">
        {n}
      </span>
      <span className="font-heavy text-xs tracking-wide text-primary-700 uppercase">{label}</span>
    </div>
  );
}
