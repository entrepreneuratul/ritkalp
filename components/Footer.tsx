import Image from "next/image";
import { businessConfig } from "@/config/business";
import type { FestivalConfig } from "@/lib/festivals/types";

export default function Footer({ festival }: { festival: FestivalConfig }) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-surface/70 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">
          <div className="flex flex-col items-center sm:items-start gap-3">
            {/* Logo — /public/images/logo.jpg. Replace this file to update the logo. */}
            <span className="relative h-16 w-16 rounded-2xl overflow-hidden ring-1 ring-accent-300/40 shadow-sm shrink-0">
              <Image
                src="/images/logo.jpg"
                alt={`${businessConfig.businessName} logo`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </span>
            <div className="text-center sm:text-left">
              <p className="font-heavy text-xl tracking-wide text-surface">
                {businessConfig.businessName.toUpperCase()}
              </p>
              <p className="mt-2 text-sm max-w-xs">{festival.footerTagline}</p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-2 text-sm">
            <a
              href={`https://wa.me/${businessConfig.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-300 transition-colors"
            >
              WhatsApp: {businessConfig.whatsappDisplayNumber}
            </a>
            <a
              href={businessConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-300 transition-colors"
            >
              Instagram
            </a>
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="h-4 w-4 shrink-0" />
              {businessConfig.address}
            </span>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-surface/10 flex flex-col items-center gap-3 text-center text-xs text-surface/50">
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            <a href="/legal/terms" className="hover:text-surface/80 underline underline-offset-2">
              Terms of Service
            </a>
            <a href="/legal/privacy" className="hover:text-surface/80 underline underline-offset-2">
              Privacy Policy
            </a>
            <a href="/legal/refund-policy" className="hover:text-surface/80 underline underline-offset-2">
              Refund &amp; Cancellation Policy
            </a>
          </nav>
          <p>
            © {year} {businessConfig.businessName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function MapPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7-6.1-7-11a7 7 0 0114 0c0 4.9-7 11-7 11z"
      />
      <circle cx="12" cy="10" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
