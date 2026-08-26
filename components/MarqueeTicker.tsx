// =====================================================================
// MARQUEE TICKER
// The infinite-scrolling strip of stat badges under Pizzalio's hero
// ("72 HOUR DOUGH · 480°C OVEN · ..."). Built from real per-festival
// data (day count, trust stats) — nothing invented. Renders the item
// list twice back-to-back and scrolls exactly -50%, so the loop is
// seamless (see the `marquee` keyframe in tailwind.config.ts).
// =====================================================================

export default function MarqueeTicker({ items }: { items: string[] }) {
  return (
    <div
      className="relative overflow-hidden border-y border-primary-900/10 bg-primary-900 py-3 sm:py-4"
      role="presentation"
    >
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
            {items.map((item, i) => (
              <li
                key={`${copy}-${i}`}
                className="flex shrink-0 items-center gap-3 px-4 sm:px-6 font-heavy text-[11px] sm:text-sm tracking-wide text-surface/90 uppercase whitespace-nowrap"
              >
                {item}
                <span className="text-accent-400">✦</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
