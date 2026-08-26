import type { Metadata } from "next";
import { Noto_Serif_Devanagari, Poppins, Archivo_Black } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { businessConfig } from "@/config/business";

// Elegant, Devanagari-friendly serif for headings — renders both Hindi
// and English headings with the same premium, festive feel.
const displayFont = Noto_Serif_Devanagari({
  subsets: ["latin", "devanagari"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Clean, modern sans-serif for body copy.
const bodyFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

// Heavy condensed display for bold English UI chrome only — nav, stat
// numbers, marquee ticker, section eyebrows, the Kit Builder. The Hindi
// headings keep using `--font-display` (Noto Serif Devanagari) above;
// this is additive, never a replacement, so Hindi content keeps its
// premium serif feel while English chrome gets Pizzalio-style punch.
const heavyFont = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heavy",
  display: "swap",
});

// Fallback metadata (used only if a route doesn't set its own — every
// /[festival] route does, via generateMetadata in app/[festival]/page.tsx).
export const metadata: Metadata = {
  title: `${businessConfig.businessName} — Puja Kits for Every Festival`,
  description:
    "Navratri, Diwali, Holi and more — complete, handpicked puja kits delivered to your doorstep. Order in seconds on WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${heavyFont.variable} font-sans bg-surface text-primary-900 antialiased`}
      >
        {/* CartProvider lives above the [festival] route segment so cart
            state (and its localStorage) survives switching festivals —
            see context/CartContext.tsx. <CartDrawer/> itself is rendered
            per-festival, inside the themed wrapper, so its colors always
            match whichever festival is currently active. */}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
