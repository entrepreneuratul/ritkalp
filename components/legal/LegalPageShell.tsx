import Link from "next/link";
import { businessConfig } from "@/config/business";

const PAGES = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/refund-policy", label: "Refund & Cancellation Policy" },
];

/**
 * Shared shell for the three legal pages (Terms, Privacy, Refund &
 * Cancellation) — Razorpay requires all three to be live on the site
 * before Live Mode activation. These sit outside app/[festival] on
 * purpose: they're business-wide, not per-festival, so there's no
 * active theme to inherit — plain brand colors instead (same approach
 * as app/account/*).
 */
export default function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#FDF8F0]">
      <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
        <Link href="/" className="font-display text-xl font-semibold text-[#7A1F2B]">
          Ritkalp
        </Link>

        <nav className="mt-6 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          {PAGES.map((p) => (
            <Link key={p.href} href={p.href} className="text-[#7A1F2B]/60 hover:text-[#7A1F2B] underline underline-offset-2">
              {p.label}
            </Link>
          ))}
        </nav>

        <h1 className="mt-6 font-display text-3xl font-semibold text-[#7A1F2B]">{title}</h1>
        <p className="mt-1 text-xs text-[#7A1F2B]/50">Last updated: {lastUpdated}</p>

        <div className="legal-content mt-8 text-sm leading-relaxed text-[#3A1E22]/90 space-y-5">
          {children}
        </div>

        <div className="mt-12 pt-6 border-t border-[#D4A017]/30 text-xs text-[#7A1F2B]/60">
          <p>
            {businessConfig.businessName} · {businessConfig.address}
          </p>
          <p className="mt-1">
            WhatsApp: {businessConfig.whatsappDisplayNumber} ·{" "}
            <a href={businessConfig.instagramUrl} className="underline underline-offset-2">
              Instagram
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
