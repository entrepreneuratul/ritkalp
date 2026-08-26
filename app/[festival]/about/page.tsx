import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFestival, isValidFestivalSlug } from "@/lib/festivals/registry";
import WhatsAppButton from "@/components/WhatsAppButton";
import { businessConfig } from "@/config/business";

export function generateMetadata({ params }: { params: { festival: string } }): Metadata {
  const festival = getFestival(params.festival);
  if (!festival) return {};
  return {
    title: `${festival.about.heading} | ${businessConfig.businessName}`,
    description: festival.about.tagline,
  };
}

export default function AboutPage({ params }: { params: { festival: string } }) {
  if (!isValidFestivalSlug(params.festival)) notFound();
  const festival = getFestival(params.festival)!;
  const about = festival.about;

  return (
    <>
      {/* Header band */}
      <section className="relative bg-surface-soft py-16 sm:py-20 mandala-texture overflow-hidden">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold tracking-widest text-accent-600 uppercase mb-3">
            About Us
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold text-primary-800">
            {about.heading}
          </h1>
          <p className="mt-4 font-display text-xl sm:text-2xl text-primary-600">{about.tagline}</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {about.paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={
                i === 0
                  ? "font-display text-xl sm:text-2xl text-primary-800 text-center leading-relaxed mb-10"
                  : "text-base sm:text-lg text-primary-700/90 leading-relaxed mb-8"
              }
            >
              {paragraph}
            </p>
          ))}

          <div className="divider-motif w-24 mx-auto my-10" />

          {/* Quote callout */}
          <blockquote className="rounded-2xl bg-accent-50 border border-accent-200 px-6 sm:px-10 py-8 text-center mb-10">
            <p className="font-display text-xl sm:text-2xl text-primary-800 leading-relaxed">
              {about.calloutQuote.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {i === about.calloutQuote.length - 1 ? <strong>{line}</strong> : line}
                </span>
              ))}
            </p>
          </blockquote>

          <div className="divider-motif w-24 mx-auto my-10" />

          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-primary-800 text-center mb-6">
            {about.closingHeading}
          </h2>

          <p className="text-base sm:text-lg text-primary-700/90 leading-relaxed mb-10">
            {about.closingParagraph}
          </p>

          {/* Closing couplet */}
          <blockquote className="rounded-2xl bg-primary-900 px-6 sm:px-10 py-8 text-center mb-12">
            <p className="font-display text-xl sm:text-2xl text-surface leading-relaxed">
              {about.closingCouplet.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {i === about.closingCouplet.length - 1 ? (
                    <span className="text-accent-300">{line}</span>
                  ) : (
                    line
                  )}
                </span>
              ))}
            </p>
          </blockquote>

          <p className="font-display text-3xl sm:text-4xl font-semibold text-accent-600 text-center mb-14">
            {about.finalPhrase}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`/${festival.slug}/#shop-kits`}
              className="inline-flex items-center justify-center rounded-full bg-primary text-surface px-8 py-3.5 text-base font-semibold shadow-lg shadow-primary-900/20 hover:bg-primary-600 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto"
            >
              {festival.hero.ctaShopLabel}
            </a>
            <WhatsAppButton
              size="lg"
              variant="primary"
              collectionName={festival.whatsappCollectionName}
              className="w-full sm:w-auto"
            >
              {festival.hero.ctaWhatsappLabel}
            </WhatsAppButton>
          </div>
        </div>
      </section>
    </>
  );
}
