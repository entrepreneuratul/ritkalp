// =====================================================================
// ORGANIC BLOBS
// The big, soft, overlapping color shapes behind Pizzalio's hero —
// purely decorative, absolutely positioned, colored from the active
// festival's theme CSS vars (see lib/theme.ts) so it re-skins with
// zero props needed per festival. `aria-hidden` — never carries content.
// =====================================================================

export default function OrganicBlobs({
  className = "",
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "section";
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {variant === "hero" ? (
        // All shapes cluster on the right two-thirds (around/behind the
        // hero photo) — kept clear of the left column's headline text
        // at every breakpoint, matching Pizzalio's own hero (its dots
        // sit near its big blob, never over the headline).
        <>
          <span className="absolute -right-[10%] top-[-15%] h-[70vw] max-h-[620px] w-[70vw] max-w-[620px] rounded-full bg-accent-200/60 blur-[2px]" />
          <span className="absolute -right-[4%] top-[8%] h-[26vw] max-h-[220px] w-[26vw] max-w-[220px] rounded-full bg-primary-200/50" />
          <span className="absolute right-[38%] top-[6%] h-6 w-6 rounded-full ring-4 ring-accent-400/70 hidden lg:block" />
          <span className="absolute right-[6%] bottom-[6%] h-10 w-10 rounded-full bg-primary-900/80 hidden lg:block" />
        </>
      ) : (
        <>
          <span className="absolute -left-[8%] top-[10%] h-[40vw] max-h-[360px] w-[40vw] max-w-[360px] rounded-full bg-accent-200/40 blur-[2px]" />
          <span className="absolute right-[4%] bottom-[6%] h-[24vw] max-h-[200px] w-[24vw] max-w-[200px] rounded-full bg-primary-200/40" />
        </>
      )}
    </div>
  );
}
