"use client";

// =====================================================================
// CART CONTEXT
// Simple client-side cart — no backend, no database. Cart contents are
// persisted to the browser's localStorage (key below) so they survive
// a page refresh (and a festival switch — this provider is mounted
// once in app/layout.tsx, above the per-festival route segment, so it
// never remounts as you move between /navratri, /diwali, /holi).
//
// Every line item is keyed by BOTH `festivalSlug` and `kitId` — each
// festival independently has ids like "day-1-samagri", so the pair is
// what's actually unique. There is still no payment gateway:
// "checkout" ends with a WhatsApp message, exactly like every other
// order flow on this site — see components/CartDrawer.tsx.
// =====================================================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getFestival } from "@/lib/festivals/registry";
import { findPurchasableItem } from "@/lib/festivals/catalog";

/** A self-contained snapshot of a Kit Builder selection — carries its own
 *  name/image/items/price instead of being looked up from a festival's
 *  catalog, so a custom-built kit can be a cart line without needing to
 *  exist anywhere in lib/festivals/*.ts. See components/KitBuilder.tsx. */
export interface CustomCartSnapshot {
  name: string;
  image: string;
  items: string[];
  unitPrice: number;
  /** The real underlying selection, alongside the display snapshot
   *  above — server-side (lib/orders.ts) uses these to resolve real
   *  Inventoryfy SKUs and re-verify the price, rather than trusting
   *  `items`/`unitPrice` for anything commercial.
   *
   *  baseKitId is the DB `Kit.id` directly (set from
   *  festival.kits.items[].id in KitBuilder.tsx, which is DB-backed —
   *  see lib/catalog-db.ts) — NOT a bare static content id. Don't
   *  re-derive/re-prefix it server-side; a previous version of this
   *  code did and silently dropped the base kit's price/stock off every
   *  Kit-Builder-with-extras order (found via UAT — see lib/orders.ts).
   *
   *  extraIds, unlike baseKitId, genuinely are bare static content ids
   *  — BuilderExtraItem.itemKey from lib/festivals/*.ts — matched
   *  server-side by that key, not a DB id. */
  baseKitId?: string;
  extraIds: string[];
}

export interface CartItem {
  festivalSlug: string;
  kitId: string;
  quantity: number;
  /** Present only for a Kit Builder line — see CustomCartSnapshot. When
   *  absent, kitId is looked up in that festival's catalog as before. */
  custom?: CustomCartSnapshot;
}

interface CartContextValue {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (
    festivalSlug: string,
    kitId: string,
    quantity: number,
    custom?: CustomCartSnapshot
  ) => void;
  removeFromCart: (festivalSlug: string, kitId: string) => void;
  updateQuantity: (festivalSlug: string, kitId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalEstimate: number;
}

const CART_STORAGE_KEY = "ritkalp_cart_v2";

const CartContext = createContext<CartContextValue | undefined>(undefined);

function isSameLine(item: CartItem, festivalSlug: string, kitId: string) {
  return item.festivalSlug === festivalSlug && item.kitId === kitId;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Guards against overwriting localStorage with an empty cart before
  // the initial load-from-storage effect has run.
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage unavailable (private browsing etc.) — cart just
      // won't persist, no need to surface an error.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore — see note above
    }
  }, [items, isHydrated]);

  const addToCart = (
    festivalSlug: string,
    kitId: string,
    quantity: number,
    custom?: CustomCartSnapshot
  ) => {
    setItems((prev) => {
      const existing = prev.find((i) => isSameLine(i, festivalSlug, kitId));
      if (existing) {
        return prev.map((i) =>
          isSameLine(i, festivalSlug, kitId)
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { festivalSlug, kitId, quantity, custom }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (festivalSlug: string, kitId: string) => {
    setItems((prev) => prev.filter((i) => !isSameLine(i, festivalSlug, kitId)));
  };

  const updateQuantity = (festivalSlug: string, kitId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(festivalSlug, kitId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (isSameLine(i, festivalSlug, kitId) ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalEstimate = items.reduce((sum, i) => {
    if (i.custom) return sum + i.custom.unitPrice * i.quantity;
    const festival = getFestival(i.festivalSlug);
    const kit = festival ? findPurchasableItem(festival, i.kitId) : undefined;
    return sum + (kit ? kit.startingPrice * i.quantity : 0);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalEstimate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a <CartProvider>");
  return ctx;
}
