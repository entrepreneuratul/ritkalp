import Image from "next/image";
import FadeIn from "./FadeIn";
import type { FestivalConfig } from "@/lib/festivals/types";

/**
 * Home-page banner combining all the guide's day medallions into a
 * single wide illustration, linking down to the full day-by-day guide
 * section. Content comes entirely from `festival.dayGuide`, so this
 * one component serves Navratri's 9-day banner, Diwali's 5-day banner,
 * and Holi's 2-day banner alike.
 */
export default function FestivalBanner({ festival }: { festival: FestivalConfig }) {
  const { dayGuide } = festival;

  return (
    <section className="relative bg-surface py-14 sm:py-20 border-y border-accent-200/50">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-8">
          <p className="text-sm font-heavy tracking-widest text-accent-600 uppercase mb-2">
            {dayGuide.bannerEyebrow}
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-primary-800">
            {dayGuide.bannerHeading}
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <a
            href={`#${dayGuide.sectionId}`}
            className="block overflow-x-auto rounded-2xl shadow-lg shadow-primary-900/10 ring-1 ring-accent-200/60"
          >
            <Image
              src={dayGuide.bannerImage}
              alt={`${festival.nameEnglish}'s day-by-day guide — ${dayGuide.days
                .map((d) => d.nameEnglish)
                .join(", ")}`}
              width={1600}
              height={620}
              className="w-full min-w-[900px] sm:min-w-0 h-auto"
            />
          </a>
        </FadeIn>

        <p className="mt-5 text-center text-sm text-primary-600/70">
          हर दिन की कहानी और पूजा विधि जानने के लिए नीचे{" "}
          <a href={`#${dayGuide.sectionId}`} className="underline underline-offset-2 hover:text-accent-700">
            {dayGuide.bannerLinkText}
          </a>{" "}
          देखें।
        </p>
      </div>
    </section>
  );
}
