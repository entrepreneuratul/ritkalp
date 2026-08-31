"use client";

import { useState } from "react";
import Image from "next/image";
import YouTubeEmbed from "./YouTubeEmbed";
import FadeIn from "./FadeIn";
import DisclaimerNotice from "./DisclaimerNotice";
import { useCart } from "@/context/CartContext";
import type { DayGuideConfig, FestivalConfig, GuideDay, KitItem } from "@/lib/festivals/types";

export default function DayGuide({
  festival,
  dayKits,
}: {
  festival: FestivalConfig;
  /** DB-backed day-kits (see lib/catalog-db.ts), in the same order as
   *  dayGuide.days — admin-editable pricing/items, not the static
   *  lib/festivals/catalog.ts:buildDayKits fallback. */
  dayKits: KitItem[];
}) {
  const { dayGuide } = festival;
  const [activeDay, setActiveDay] = useState(dayGuide.days[0]?.dayNumber ?? 1);
  const day = dayGuide.days.find((d) => d.dayNumber === activeDay) ?? dayGuide.days[0];

  return (
    <section id={dayGuide.sectionId} className="relative scroll-mt-20 bg-primary-900 py-20 sm:py-28 overflow-hidden">
      {/* Subtle mandala texture on the deep background */}
      <div className="absolute inset-0 mandala-texture opacity-40" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-sm font-heavy tracking-widest text-accent-400 uppercase mb-3">
            {dayGuide.eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-surface">
            {dayGuide.heading}
          </h2>
          <p className="mt-4 text-surface/70">{dayGuide.intro}</p>
        </FadeIn>

        <FadeIn delay={80} className="mb-10">
          <MainSamagriPanel dayGuide={dayGuide} />
        </FadeIn>

        {/* Day selector — a 3-column grid on mobile, wrapping into a
            single centered row on larger screens. Works for any number
            of days (9 for Navratri, 5 for Diwali, 2 for Holi) with no
            per-count breakpoint classes needed. */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-2.5 mb-10">
          {dayGuide.days.map((d) => (
            <button
              key={d.dayNumber}
              type="button"
              onClick={() => setActiveDay(d.dayNumber)}
              className={`press-feedback flex flex-col items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-center transition-all duration-300 ease-[var(--ease-spring)] sm:w-28 ${
                d.dayNumber === activeDay
                  ? "bg-accent text-onaccent shadow-md shadow-accent-900/30 -translate-y-0.5 scale-[1.03]"
                  : "bg-surface/5 text-surface/70 hover:bg-surface/10 hover:-translate-y-0.5"
              }`}
            >
              <span className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full overflow-hidden ring-1 ring-accent-200/60 shrink-0 transition-transform duration-300 ease-[var(--ease-spring)]">
                <Image src={d.image} alt="" fill sizes="36px" className="object-cover" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide opacity-80">
                Day {d.dayNumber}
              </span>
              <span className="text-sm font-display font-semibold truncate max-w-full">
                {d.nameEnglish}
              </span>
            </button>
          ))}
        </div>

        {/* key={day.dayNumber} remounts the panel on every day switch, so
            its internal quantity stepper always resets back to 1. */}
        {day && (
          <DayDetailPanel
            key={day.dayNumber}
            day={day}
            festivalSlug={festival.slug}
            // dayKits is DB-fetched in the same order as dayGuide.days
            // (see lib/catalog-db.ts / prisma/seed.ts), so the two
            // arrays line up by index — cheaper and more robust than
            // parsing a `day-N-samagri`-style id back out of a string.
            dayKit={dayKits[dayGuide.days.findIndex((d) => d.dayNumber === day.dayNumber)]}
          />
        )}
      </div>
    </section>
  );
}

function DayDetailPanel({
  day,
  festivalSlug,
  dayKit,
}: {
  day: GuideDay;
  festivalSlug: string;
  dayKit: KitItem | undefined;
}) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  return (
    <div className="animate-fade-in-up rounded-3xl bg-surface p-6 sm:p-10 shadow-2xl shadow-black/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        <div>
          <div className="flex items-center gap-4">
            <span className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden ring-2 ring-accent-300 shadow-md shrink-0">
              <Image
                src={day.image}
                alt={`${day.nameEnglish} symbol`}
                fill
                sizes="96px"
                className="object-cover"
              />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-widest text-accent-600 uppercase mb-1">
                {day.dateLabel}
              </p>
              <h3 className="font-display text-3xl sm:text-4xl font-semibold text-primary-800">
                {day.nameHindi}
              </h3>
            </div>
          </div>
          <p className="mt-4 text-lg text-primary-600 font-medium">
            {day.nameEnglish} — {day.epithet}
          </p>

          {/* Quantity stepper + Add to Cart — same pattern as Shop Kits */}
          {dayKit && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-accent-300 rounded-full">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="press-feedback w-8 h-8 flex items-center justify-center text-primary-700 hover:text-accent-700"
                  aria-label="मात्रा घटाएं"
                >
                  −
                </button>
                <span className="w-7 text-center text-sm font-semibold text-primary-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="press-feedback w-8 h-8 flex items-center justify-center text-primary-700 hover:text-accent-700"
                  aria-label="मात्रा बढ़ाएं"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() =>
                  addToCart(festivalSlug, dayKit.id, quantity, {
                    name: dayKit.name,
                    image: dayKit.image,
                    items: dayKit.items,
                    unitPrice: dayKit.startingPrice,
                    // Not a Kit Builder combo — dayKit.id already
                    // resolves to a real DB Kit row, this snapshot is
                    // only a defensive fallback for the unlikely case
                    // it doesn't.
                    extraIds: [],
                  })
                }
                className="press-feedback inline-flex items-center gap-2 rounded-full bg-accent text-onaccent px-5 py-2.5 font-semibold shadow-md shadow-accent-900/20 hover:bg-accent-400 hover:-translate-y-0.5 transition-all duration-300 ease-[var(--ease-spring)]"
              >
                <CartPlusIcon className="h-4 w-4" />
                कार्ट में डालें
              </button>
              <span className="text-xs text-primary-500">
                ₹{dayKit.startingPrice.toLocaleString("en-IN")} से शुरू
              </span>
            </div>
          )}

          <p className="mt-5 text-sm sm:text-base text-primary-700/90 leading-relaxed">
            {day.significance}
          </p>
        </div>

        <YouTubeEmbed
          url={day.youtubeUrl ?? ""}
          title={`${day.nameEnglish} — Day ${day.dayNumber} Guide`}
        />
      </div>

      {/* समग्री + विधि + मंत्र */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl bg-surface-soft border border-accent-200 p-5">
          <p className="text-xs font-semibold tracking-wide text-accent-700 uppercase mb-3">
            विशेष सामग्री
          </p>
          <ul className="space-y-1.5">
            {day.samagri.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-primary-700">
                <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl bg-accent-50 border border-accent-200 p-5">
          <p className="text-xs font-semibold tracking-wide text-accent-700 uppercase mb-3">
            पूजा विधि
          </p>
          <ol className="space-y-2">
            {day.vidhiSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-primary-700/90 leading-relaxed">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-200 text-[11px] font-bold text-primary-800">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* मंत्र — optional (not every day centers on one, e.g. Bhai Dooj) */}
      {day.mantra && (
        <div className="mt-6 rounded-xl bg-primary-900 px-5 py-4 text-center">
          <p className="text-[11px] font-semibold tracking-widest text-accent-400 uppercase mb-1.5">
            मंत्र
          </p>
          <p className="font-display text-lg sm:text-xl text-accent-200">{day.mantra}</p>
        </div>
      )}

      {/* Day-specific extra box — e.g. Ghatasthapana/Kanya Pujan/Havan
          (Navratri), Lakshmi-Ganesh special samagri (Diwali) */}
      {day.additionalSection && (
        <div className="mt-6 rounded-xl border-2 border-dashed border-accent-300 p-5">
          <p className="font-display text-lg font-semibold text-primary-800 mb-1">
            {day.additionalSection.title}
          </p>
          {day.additionalSection.note && (
            <p className="text-xs text-primary-600/80 leading-relaxed mb-3">
              {day.additionalSection.note}
            </p>
          )}
          {day.additionalSection.samagri && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {day.additionalSection.samagri.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-primary-700">
                  <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * The festival's one-time shopping list, shown once above the day
 * selector, plus the quick daily puja flow. Collapsed by default
 * since it's long.
 */
function MainSamagriPanel({ dayGuide }: { dayGuide: DayGuideConfig }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const INITIAL_COUNT = 9;
  const visibleItems = isExpanded
    ? dayGuide.mainSamagri
    : dayGuide.mainSamagri.slice(0, INITIAL_COUNT);
  const remaining = dayGuide.mainSamagri.length - INITIAL_COUNT;

  return (
    <div className="rounded-2xl bg-surface/95 p-6 sm:p-8 shadow-lg shadow-black/10">
      <p className="font-display text-xl font-semibold text-primary-800 mb-1">
        {dayGuide.mainSamagriHeading}
      </p>
      <p className="text-sm text-primary-600/80 mb-4">{dayGuide.mainSamagriSubheading}</p>

      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5 mb-2">
        {visibleItems.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-primary-700">
            <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          className="text-xs font-semibold text-primary-600 hover:text-accent-700 underline underline-offset-2"
        >
          {isExpanded ? "छोटी सूची देखें" : `+ ${remaining} और आइटम देखें`}
        </button>
      )}

      <div className="mt-5 pt-5 border-t border-accent-200/70">
        <p className="text-xs font-semibold tracking-wide text-accent-700 uppercase mb-2">
          {dayGuide.dailyQuickVidhiHeading}
        </p>
        <p className="text-sm text-primary-700/80 leading-relaxed">
          {dayGuide.dailyQuickVidhi.join(" → ")}
        </p>
      </div>

      <p className="mt-4 text-xs text-primary-500/70 italic">{dayGuide.samagriNote}</p>

      <DisclaimerNotice className="mt-5" />
    </div>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CartPlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 7h12l-1 13a1 1 0 01-1 1H8a1 1 0 01-1-1L6 7zM9 7a3 3 0 016 0M10 12h4M12 10v4"
      />
    </svg>
  );
}
