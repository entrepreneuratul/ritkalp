import Image from "next/image";
import WhatsAppButton from "./WhatsAppButton";
import YouTubeEmbed from "./YouTubeEmbed";
import HeroAnimation from "./HeroAnimation";
import OrganicBlobs from "./OrganicBlobs";
import { businessConfig } from "@/config/business";
import type { FestivalConfig, TrustBadgeIcon } from "@/lib/festivals/types";

const badgeIcons: Record<TrustBadgeIcon, (props: { className?: string }) => JSX.Element> = {
  sparkle: SparkleIcon,
  truck: TruckIcon,
  chat: ChatIcon,
};

export default function Hero({ festival }: { festival: FestivalConfig }) {
  const hero = festival.hero;
  const dayCount = festival.dayGuide.days.length;

  return (
    <section id="top" className="relative overflow-hidden bg-surface">
      <OrganicBlobs variant="hero" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-16 sm:pt-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-8 items-center">
          {/* ---- Left: the pitch ---- */}
          <div className="text-center lg:text-left">
            <p className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full bg-surface/80 backdrop-blur px-4 py-1.5 mb-6 text-[11px] sm:text-xs font-heavy tracking-wide text-primary-700 ring-1 ring-accent-300/60 uppercase">
              {hero.trustBadges.slice(0, 1).map((badge) => {
                const Icon = badgeIcons[badge.icon];
                return (
                  <span key={badge.label} className="inline-flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5 text-accent-600" /> {badge.label}
                  </span>
                );
              })}
              <span className="text-accent-400">•</span>
              <span>{festival.nameEnglish} · {dayCount > 1 ? `${dayCount} Days` : "Ready to Ship"}</span>
            </p>

            <p className="font-heavy text-accent-600 text-sm sm:text-base tracking-wide uppercase mb-3">
              Build Your Own {festival.nameEnglish} Kit
            </p>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-primary-800 leading-[1.08] text-balance">
              {hero.headlineHindi}
            </h1>

            <p className="mt-5 font-display text-xl sm:text-2xl text-primary-700 text-balance">
              {hero.subheadlineHindi}
            </p>
            <p className="mt-2 text-base sm:text-lg text-primary-600/80 text-balance max-w-xl mx-auto lg:mx-0">
              {hero.lineEnglish}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="#kit-builder"
                className="press-feedback inline-flex items-center justify-center gap-2 rounded-full bg-primary text-surface px-8 py-4 text-lg font-heavy tracking-wide shadow-lg shadow-primary-900/20 hover:bg-primary-600 hover:-translate-y-1 transition-all duration-300 ease-[var(--ease-spring)] w-full sm:w-auto"
              >
                Build Your Kit
              </a>
              <WhatsAppButton
                size="lg"
                variant="primary"
                collectionName={festival.whatsappCollectionName}
                className="w-full sm:w-auto font-heavy tracking-wide"
              >
                {hero.ctaWhatsappLabel}
              </WhatsAppButton>
            </div>

            {/* Stat pills — Pizzalio's "21 TOPPINGS / 90s / 4km" strip,
                built from this festival's own real numbers. */}
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 sm:gap-10">
              <Stat value={String(dayCount)} label={dayCount > 1 ? "Days of Puja" : "Kit, Ready"} />
              <Stat value={String(festival.kits.items.length)} label="Kits to Choose" />
              <Stat value={festival.trust.stats[0]?.value ?? "500+"} label={festival.trust.stats[0]?.label ?? "Delivered"} />
            </div>
          </div>

          {/* ---- Right: the visual ---- */}
          <div className="relative">
            {/* Real product photo (public/images/ritkalp_premium_box_mockup.jpg),
                shared across every festival — used here instead of
                hero.heroImage, which is still a placeholder SVG with
                baked-in "replace with real photography" instructional
                text (fine as a faint full-bleed backdrop in the old
                layout, but this card is too prominent to hide it). */}
            <div className="relative mx-auto max-w-md aspect-square rounded-[2.5rem] overflow-hidden ring-1 ring-accent-200/60 shadow-2xl shadow-primary-900/15 bg-primary-50">
              <Image
                src="/images/ritkalp_premium_box_mockup.jpg"
                alt={`${businessConfig.businessName} premium puja kit box`}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
                <HeroAnimation festivalSlug={festival.slug} />
              </div>
            </div>
            {/* Floating badge — reads like Pizzalio's "OPEN 12:00 — 23:00" corner tag */}
            <div className="absolute -top-3 -left-3 sm:top-4 sm:-left-6 rounded-2xl bg-surface px-4 py-3 shadow-lg shadow-primary-900/10 ring-1 ring-accent-200/70 rotate-[-4deg]">
              <p className="font-heavy text-2xl text-primary-800 leading-none">{dayCount}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-primary-500">
                {dayCount > 1 ? "Day Journey" : "Occasion"}
              </p>
            </div>
          </div>
        </div>

        {/* Intro video — autoplays muted the moment the page loads, if set */}
        {hero.youtubeUrl && (
          <div className="mt-14 max-w-2xl mx-auto">
            <YouTubeEmbed
              url={hero.youtubeUrl}
              title={`Ritkalp — ${festival.nameEnglish} Intro`}
              autoplay
              className="ring-2 ring-accent-300/70 shadow-xl shadow-primary-900/15"
            />
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center lg:text-left">
      <p className="font-heavy text-3xl sm:text-4xl text-primary-800 leading-none">{value}</p>
      <p className="mt-1 text-[11px] sm:text-xs font-semibold uppercase tracking-wide text-primary-500">
        {label}
      </p>
    </div>
  );
}

function SparkleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" />
    </svg>
  );
}
function TruckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v9H3zM14 10h4l3 3v3h-7zM6.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  );
}
function ChatIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}
