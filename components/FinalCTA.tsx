import FadeIn from "./FadeIn";
import WhatsAppButton from "./WhatsAppButton";
import { businessConfig } from "@/config/business";
import type { FestivalConfig } from "@/lib/festivals/types";

export default function FinalCTA({ festival }: { festival: FestivalConfig }) {
  return (
    <section id="contact" className="relative bg-primary py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 mandala-texture opacity-20" />
      <span
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent-500/10 blur-2xl"
      />
      <span
        aria-hidden="true"
        className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-surface/5 blur-2xl"
      />
      <FadeIn className="relative mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-heavy text-xs sm:text-sm tracking-widest text-accent-300 uppercase mb-4">
          Ready when you are
        </p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-surface text-balance">
          {festival.finalCta.heading}
        </h2>
        <p className="mt-4 text-surface/80 text-base sm:text-lg">{festival.finalCta.line}</p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#kit-builder"
            className="press-feedback inline-flex items-center justify-center rounded-full bg-surface text-primary-800 px-7 py-3.5 font-heavy tracking-wide shadow-lg hover:-translate-y-1 transition-all duration-300 ease-[var(--ease-spring)] w-full sm:w-auto"
          >
            Build Your Kit
          </a>
          <WhatsAppButton
            size="lg"
            variant="primary"
            collectionName={festival.whatsappCollectionName}
            className="font-heavy tracking-wide w-full sm:w-auto"
          >
            {festival.hero.ctaWhatsappLabel}
          </WhatsAppButton>
        </div>

        <p className="mt-6 text-sm text-surface/60">
          Prefer to save the number?{" "}
          <span className="text-accent-300 font-semibold">
            {businessConfig.whatsappDisplayNumber}
          </span>
        </p>
      </FadeIn>
    </section>
  );
}
