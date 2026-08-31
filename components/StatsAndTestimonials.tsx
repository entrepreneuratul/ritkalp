import FadeIn from "./FadeIn";
import CountUp from "./CountUp";
import type { FestivalConfig } from "@/lib/festivals/types";

export default function StatsAndTestimonials({ festival }: { festival: FestivalConfig }) {
  const { eyebrow, heading, stats, testimonials } = festival.trust;

  return (
    <section id="why-trust-us" className="relative scroll-mt-20 py-20 sm:py-28 bg-surface-soft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-heavy tracking-widest text-accent-600 uppercase mb-3">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary-800">
            {heading}
          </h2>
        </FadeIn>

        {/* Stats strip */}
        <FadeIn className="mb-14">
          <div className="grid grid-cols-3 divide-x divide-accent-200 rounded-2xl border-2 border-primary-900 bg-surface py-8 shadow-[6px_6px_0_0_rgb(var(--color-primary-900))]">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center px-2">
                <p className="font-heavy text-3xl sm:text-5xl text-primary-800 tabular-nums">
                  <CountUp value={stat.value} />
                </p>
                <p className="mt-1.5 text-xs sm:text-sm font-semibold text-primary-600/80 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Testimonials — only rendered once a festival config actually
            has real customer quotes (see lib/festivals/*.ts). No
            placeholder/fabricated reviews ship here. */}
        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <FadeIn key={t.name} delay={index * 100}>
                <blockquote className="hover-glow h-full rounded-2xl bg-surface border border-accent-200/70 p-6 flex flex-col hover:-translate-y-1">
                  <QuoteIcon className="h-6 w-6 text-accent-400 mb-3" />
                  <p className="text-sm text-primary-700/90 leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-4 text-xs font-semibold text-primary-600">
                    {t.name} · {t.location}
                  </footer>
                </blockquote>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function QuoteIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
    </svg>
  );
}
