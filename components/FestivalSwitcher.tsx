"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { festivals } from "@/lib/festivals/registry";

/**
 * The "which puja?" switcher. Selecting a festival soft-navigates to
 * its route (/navratri, /diwali, /holi, ...) — since app/[festival]
 * is a shared layout, this does NOT remount the page shell (Header,
 * cart) or reload the document, it just swaps every section's content
 * and re-colors the theme instantly. Preserves the current sub-path
 * (e.g. staying on /about) when switching.
 */
export default function FestivalSwitcher({ currentSlug }: { currentSlug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const current = festivals.find((f) => f.slug === currentSlug) ?? festivals[0];

  function goTo(slug: string) {
    setIsOpen(false);
    const segments = pathname.split("/");
    segments[1] = slug; // segments[0] is "" (leading slash)
    router.push(segments.join("/") || `/${slug}`);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="press-feedback flex items-center gap-1.5 rounded-full border border-accent-300 bg-surface px-3.5 py-1.5 font-heavy text-[11px] lg:text-xs tracking-wide uppercase text-primary-700 hover:border-accent-400 hover:shadow-md hover:shadow-accent-900/5 transition-all duration-300"
      >
        {current.nameEnglish}
        <ChevronIcon
          className={`h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-spring)] ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          {/* Click-outside catcher */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <ul
            role="listbox"
            className="absolute right-0 z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-xl border border-accent-200 bg-surface shadow-xl shadow-black/10 animate-[festival-fade_0.2s_var(--ease-spring)_both]"
          >
            {festivals.map((f) => (
              <li key={f.slug}>
                <button
                  type="button"
                  role="option"
                  aria-selected={f.slug === currentSlug}
                  onClick={() => goTo(f.slug)}
                  className={`flex w-full items-center justify-between px-4 py-2.5 text-sm text-left transition-colors duration-200 ${
                    f.slug === currentSlug
                      ? "bg-primary-50 text-primary-800 font-semibold"
                      : "text-primary-700 hover:bg-accent-50"
                  }`}
                >
                  <span>
                    {f.nameEnglish} <span className="text-primary-400">· {f.nameHindi}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}
