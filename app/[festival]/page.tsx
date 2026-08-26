import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getFestival, isValidFestivalSlug } from "@/lib/festivals/registry";
import {
  getStorefrontKits,
  getStorefrontDayKits,
  getStorefrontBuilderCategories,
} from "@/lib/catalog-db";
import Hero from "@/components/Hero";
import MarqueeTicker from "@/components/MarqueeTicker";
import FestivalBanner from "@/components/FestivalBanner";
import PromiseGrid from "@/components/PromiseGrid";
import KitBuilder from "@/components/KitBuilder";
import KitsGrid from "@/components/KitsGrid";
import DayGuide from "@/components/DayGuide";
import StatsAndTestimonials from "@/components/StatsAndTestimonials";
import FinalCTA from "@/components/FinalCTA";

export function generateMetadata({ params }: { params: { festival: string } }): Metadata {
  const festival = getFestival(params.festival);
  if (!festival) return {};
  return { title: festival.seoTitle, description: festival.seoDescription };
}

export default async function FestivalHomePage({ params }: { params: { festival: string } }) {
  if (!isValidFestivalSlug(params.festival)) notFound();
  const staticFestival = getFestival(params.festival)!;

  // Curated kits, day-kits, and Kit Builder extras are DB-backed (admin
  // panel editable) — see lib/catalog-db.ts. Everything else (theme,
  // hero copy, the 9-day significance/vidhi/mantra narrative, About
  // page) stays in lib/festivals/*.ts, unchanged. Merging DB data into
  // a copy of the static config means every component below keeps
  // reading `festival.kits.items` / `festival.builder` exactly as
  // before — only the source of that data moved.
  const [curatedKits, dayKits, builderCategories] = await Promise.all([
    getStorefrontKits(staticFestival.slug),
    getStorefrontDayKits(staticFestival.slug),
    getStorefrontBuilderCategories(staticFestival.slug),
  ]);

  const festival = {
    ...staticFestival,
    kits: { ...staticFestival.kits, items: curatedKits },
    builder: { ...staticFestival.builder, categories: builderCategories },
  };

  // Real data only — day count, kit count, trust stats — nothing invented.
  const tickerItems = [
    `${festival.dayGuide.days.length > 1 ? `${festival.dayGuide.days.length} DAYS OF ${festival.nameEnglish.toUpperCase()}` : festival.nameEnglish.toUpperCase()}`,
    "HANDPICKED & PURE SAMAGRI",
    `${festival.kits.items.length} READY-MADE KITS`,
    "PAN-INDIA DELIVERY",
    "ORDER ON WHATSAPP",
    ...(festival.trust.stats[0] ? [`${festival.trust.stats[0].value} ${festival.trust.stats[0].label.toUpperCase()}`] : []),
  ];

  return (
    // key={festival.slug} guarantees this subtree remounts (and its
    // festival-fade-in animation replays) every time the festival
    // switcher navigates here, even in edge cases where Next would
    // otherwise be able to reuse the existing page instance.
    <div key={festival.slug} className="festival-fade-in">
      <Hero festival={festival} />
      <MarqueeTicker items={tickerItems} />
      <PromiseGrid festival={festival} />
      <KitBuilder festival={festival} />
      <FestivalBanner festival={festival} />
      <KitsGrid festival={festival} />
      <DayGuide festival={festival} dayKits={dayKits} />
      <StatsAndTestimonials festival={festival} />
      <FinalCTA festival={festival} />
    </div>
  );
}
