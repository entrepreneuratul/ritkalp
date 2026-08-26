import FadeIn from "./FadeIn";
import type { FestivalConfig, PromiseIcon } from "@/lib/festivals/types";

const icons: Record<PromiseIcon, (props: { className?: string }) => JSX.Element> = {
  box: BoxIcon,
  leaf: LeafIcon,
  chat: ChatBubbleIcon,
  door: DoorIcon,
};

/**
 * Presented as Pizzalio's numbered "THREE STEPS, ONE PIZZA" section —
 * reuses `festival.promise.cards` exactly as authored (no new content),
 * just given a bold step-by-step treatment instead of a plain 4-up grid.
 */
export default function PromiseGrid({ festival }: { festival: FestivalConfig }) {
  const { eyebrow, heading, cards } = festival.promise;

  return (
    <section className="relative bg-surface py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-heavy tracking-widest text-accent-600 uppercase mb-3">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary-800">
            {heading}
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-5">
          {cards.map((item, index) => {
            const Icon = icons[item.icon];
            return (
              <FadeIn key={item.title} delay={index * 100} className="relative">
                <div className="group hover-glow h-full rounded-2xl bg-surface-soft border border-accent-200/70 p-6 sm:p-7 hover:-translate-y-1.5 hover:border-accent-300 transition-transform duration-300">
                  <span className="font-heavy text-4xl text-accent-300 leading-none select-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="mt-4 mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-surface transition-transform duration-300 ease-[var(--ease-spring)] group-hover:scale-110 group-hover:-rotate-6">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-primary-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-primary-600/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {index < cards.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden lg:block absolute top-1/2 -right-3 h-px w-6 bg-accent-300"
                  />
                )}
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BoxIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5m0-13v13m9-13v8l-9 5" />
    </svg>
  );
}
function LeafIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 20A7 7 0 019 6c2-2 4-3 8-3 0 4-1 6-3 8a7 7 0 01-3 9zM9 6l6 12" />
    </svg>
  );
}
function ChatBubbleIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}
function DoorIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 21V5a2 2 0 012-2h6.5L19 7.5V21M5 21h14M5 21H3m16 0h2M9 3v18m6-10.5h.01" />
    </svg>
  );
}
