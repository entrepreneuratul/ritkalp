import FadeIn from "./FadeIn";
import KitCard from "./KitCard";
import DisclaimerNotice from "./DisclaimerNotice";
import type { FestivalConfig } from "@/lib/festivals/types";

export default function KitsGrid({ festival }: { festival: FestivalConfig }) {
  const { eyebrow, heading, intro, items } = festival.kits;

  return (
    <section id="shop-kits" className="relative py-20 sm:py-28 mandala-texture">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-sm font-heavy tracking-widest text-accent-600 uppercase mb-3">
            {eyebrow}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-primary-800">
            {heading}
          </h2>
          <p className="mt-4 text-primary-600/80">{intro}</p>
          <p className="mt-2 text-sm text-primary-500">
            एक टैप में इन्हें{" "}
            <a href="#kit-builder" className="underline underline-offset-2 hover:text-accent-700">
              Kit Builder
            </a>{" "}
            में लोड करके अपने हिसाब से बदल भी सकते हैं।
          </p>
        </FadeIn>

        <FadeIn delay={60} className="max-w-3xl mx-auto mb-10">
          <DisclaimerNotice />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {items.map((kit, index) => (
            <FadeIn
              key={kit.id}
              delay={index * 80}
              className={kit.featured ? "sm:col-span-2 lg:col-span-2" : ""}
            >
              <KitCard kit={kit} festivalSlug={festival.slug} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
