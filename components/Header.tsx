"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Session } from "next-auth";
import { businessConfig } from "@/config/business";
import type { FestivalConfig } from "@/lib/festivals/types";
import CartIcon from "./CartIcon";
import FestivalSwitcher from "./FestivalSwitcher";

export default function Header({
  festival,
  session,
}: {
  festival: FestivalConfig;
  /** Optional customer session — accounts are opt-in, checkout never
   *  requires one (see components/CartDrawer.tsx). null/undefined just
   *  shows a "Login" link instead of "My Orders". */
  session?: Session | null;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const base = `/${festival.slug}`;

  // A soft shadow that eases in once the page has scrolled past the
  // hero — makes the sticky header feel like it's floating above the
  // content rather than just sitting flat on it.
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hrefs are prefixed with the active festival's base path so they
  // resolve correctly from any page (e.g. /diwali/about) — clicking
  // "/diwali/#shop-kits" while already on "/diwali" is an in-page
  // scroll, same as a bare "#shop-kits" would be.
  const navLinks = [
    { label: "About Us", href: `${base}/about` },
    { label: "Kit Builder", href: `${base}/#kit-builder` },
    { label: "Ready-Made Kits", href: `${base}/#shop-kits` },
    { label: festival.dayGuide.navLabel, href: `${base}/#${festival.dayGuide.sectionId}` },
    { label: "Why Us", href: `${base}/#why-trust-us` },
    { label: "Contact", href: `${base}/#contact` },
    session?.user?.role === "customer"
      ? { label: "My Orders", href: "/account/orders" }
      : { label: "Login", href: "/account/login" },
  ];

  const handleLinkClick = () => setIsOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 bg-surface/90 backdrop-blur-md border-b transition-shadow duration-500 ${
        isScrolled ? "border-accent-200/60 shadow-lg shadow-primary-900/5" : "border-accent-200/0"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3">
          <a href={base} className="group flex items-center gap-2.5 shrink-0">
            {/* Logo — /public/images/logo.jpg. Replace this file to update the logo. */}
            <span className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl overflow-hidden ring-1 ring-accent-300/80 shadow-sm shrink-0 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <Image
                src="/images/logo.jpg"
                alt={`${businessConfig.businessName} logo`}
                fill
                sizes="44px"
                className="object-cover"
                priority
              />
            </span>
            <span className="font-display text-xl sm:text-2xl font-semibold text-primary tracking-wide">
              {businessConfig.businessName}
            </span>
          </a>

          {/* Desktop nav — one consistent voice with the rest of the site:
              font-heavy, uppercase, tracked-out, same as every eyebrow/
              marquee/step label elsewhere (see PromiseGrid, MarqueeTicker,
              KitBuilder). Previously this was the only place still using
              the old quiet font-medium sentence-case treatment. */}
          <div className="hidden xl:flex items-center gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative font-heavy text-xs tracking-wide uppercase text-primary-700 hover:text-accent-600 transition-colors py-1 whitespace-nowrap"
              >
                {link.label}
                <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-full origin-left scale-x-0 bg-accent-500 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            ))}
            <FestivalSwitcher currentSlug={festival.slug} />
            <a
              href={`${base}/#kit-builder`}
              className="press-feedback rounded-full bg-primary text-surface px-5 py-2.5 text-sm font-heavy tracking-wide shadow-md shadow-primary-900/10 hover:shadow-lg hover:shadow-primary-900/20 hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap"
            >
              Build Your Kit
            </a>
            <CartIcon />
          </div>

          {/* Compact nav (below xl — phones AND the tablet/laptop range
              where 6 links + switcher + CTA + cart would overflow):
              switcher + cart + hamburger menu button. */}
          <div className="flex items-center gap-1 xl:hidden">
            <FestivalSwitcher currentSlug={festival.slug} />
            <CartIcon />
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="press-feedback p-2 text-primary"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              <span
                className={`inline-flex transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
              >
                {isOpen ? <CloseIcon /> : <MenuIcon />}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {isOpen && (
          <div className="xl:hidden pb-4 flex flex-col gap-1 animate-[festival-fade_0.3s_var(--ease-smooth)_both]">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                style={{ animationDelay: `${i * 40}ms` }}
                className="animate-[festival-fade_0.35s_var(--ease-smooth)_both] rounded-lg px-3 py-3 font-heavy text-xs tracking-wide uppercase text-primary-700 hover:bg-accent-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={`${base}/#kit-builder`}
              onClick={handleLinkClick}
              className="press-feedback mt-2 rounded-full bg-primary text-surface px-5 py-2.5 text-sm font-heavy tracking-wide text-center hover:bg-primary-600 transition-colors"
            >
              Build Your Kit
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
