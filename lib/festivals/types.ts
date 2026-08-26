// =====================================================================
// FESTIVAL CONFIG — THE SHARED SHAPE EVERY FESTIVAL PLUGS INTO
//
// This is the single interface every page/section reads from. Add a
// new festival by writing one more file shaped like this (see
// navratri.ts, diwali.ts, holi.ts) and registering it in registry.ts —
// no component or CSS ever needs to change.
// =====================================================================

/** A 10-step Tailwind-style color scale, keyed exactly like Tailwind's
 *  default palettes (50 lightest → 900 darkest, DEFAULT = the "500-ish"
 *  workhorse shade used for solid buttons/surfaces). Values are hex. */
export interface ColorScale {
  DEFAULT: string;
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ThemeTokens {
  /** Primary brand color for this festival — headings, nav, solid buttons. */
  primary: ColorScale;
  /** Accent color — borders, icons, badges, secondary buttons. */
  accent: ColorScale;
  /** Warm base background family for the whole page. */
  surface: { DEFAULT: string; soft: string; deep: string };
}

export type TrustBadgeIcon = "sparkle" | "truck" | "chat";
export type PromiseIcon = "box" | "leaf" | "chat" | "door";

export interface TrustBadge {
  icon: TrustBadgeIcon;
  label: string;
}

export interface PromiseCard {
  title: string;
  description: string;
  icon: PromiseIcon;
}

export interface KitItem {
  /** Stable unique id, unique *within* this festival — used as the
   *  React key and the cart line item id. */
  id: string;
  name: string;
  description: string;
  image: string;
  items: string[];
  /** Indicative starting price in INR (whole rupees, no commas). */
  startingPrice: number;
  featured?: boolean;
  badge?: string;
  /** True for drafted/placeholder content the user should review and
   *  replace with real items/pricing — see TODO_REVIEW comments next
   *  to every drafted entry. KitCard renders a small "Draft" pill. */
  draft?: boolean;
}

export interface GuideDayExtra {
  title: string;
  note?: string;
  samagri?: string[];
  vidhiSteps?: string[];
  /** True for a genuinely optional add-on (e.g. Navratri's Day-9 Havan)
   *  that should NOT be auto-bundled into that day's purchasable kit. */
  optional?: boolean;
}

export interface GuideDay {
  dayNumber: number;
  dateLabel: string;
  /** Name of the deity/occasion, Devanagari. */
  nameHindi: string;
  /** Name transliterated / in English. */
  nameEnglish: string;
  /** Short epithet shown under the name. */
  epithet: string;
  /** 3-5 sentence explanation of the day's significance. */
  significance: string;
  samagri: string[];
  vidhiSteps: string[];
  /** Optional — not every occasion (e.g. Bhai Dooj) centers on a mantra. */
  mantra?: string;
  additionalSection?: GuideDayExtra;
  /** Path to the day's medallion illustration in /public. */
  image: string;
  /** Full YouTube URL, or omit/"" for a "video coming soon" placeholder. */
  youtubeUrl?: string;
  /** Per-day samagri-kit price (used to auto-build a purchasable "day
   *  kit" — see lib/festivals/catalog.ts:buildDayKits). */
  kitPrice?: number;
}

export interface DayGuideConfig {
  /** In-page anchor id, e.g. "puja-guide". */
  sectionId: string;
  /** Nav link + section label, e.g. "9 Days Guide" / "5 Days Guide". */
  navLabel: string;
  eyebrow: string;
  heading: string;
  intro: string;
  mainSamagriHeading: string;
  mainSamagriSubheading: string;
  mainSamagri: string[];
  dailyQuickVidhiHeading: string;
  dailyQuickVidhi: string[];
  samagriNote: string;
  days: GuideDay[];
  bannerImage: string;
  bannerEyebrow: string;
  bannerHeading: string;
  bannerLinkText: string;
}

export interface StatItem {
  value: string;
  label: string;
}

/** Icon keys rendered by components/PujaItemIcon.tsx — a small set of
 *  flat, geometric, theme-colored icons (no photos needed) used by the
 *  Kit Builder's tap-to-add extras and their category tabs. */
export type PujaItemIconKey =
  | "diya"
  | "flower"
  | "coconut"
  | "kalash"
  | "cloth"
  | "sweet"
  | "incense"
  | "fruit"
  | "chunri"
  | "bell"
  | "thali"
  | "havan";

/** Runtime list of the same keys, for admin UI dropdowns (see
 *  app/admin/catalog) — components/PujaItemIcon.tsx is the source of
 *  truth for what each one actually renders. */
export const PUJA_ICON_KEYS: PujaItemIconKey[] = [
  "diya",
  "flower",
  "coconut",
  "kalash",
  "cloth",
  "sweet",
  "incense",
  "fruit",
  "chunri",
  "bell",
  "thali",
  "havan",
];

/** One tappable "extra" in the Kit Builder — an individually-priced
 *  samagri item a customer can add on top of their chosen base kit.
 *  Sourced from each festival's own `mainSamagri`/day `samagri` lists,
 *  priced and categorized rather than invented from scratch. */
export interface BuilderExtraItem {
  /** Stable id, unique within this festival's builderExtras. */
  id: string;
  name: string;
  icon: PujaItemIconKey;
  /** Small indicative add-on price in INR. */
  price: number;
}

export interface BuilderExtraCategory {
  id: string;
  label: string;
  items: BuilderExtraItem[];
}

export interface BuilderConfig {
  eyebrow: string;
  heading: string;
  intro: string;
  /** Label for the "start from scratch" base option, e.g. "Custom Kit". */
  blankBaseLabel: string;
  categories: BuilderExtraCategory[];
  /** True for drafted/placeholder pricing the user should review — same
   *  convention as KitItem.draft. */
  draft?: boolean;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  location: string;
}

export interface AboutContent {
  heading: string;
  tagline: string;
  paragraphs: string[];
  calloutQuote: string[];
  closingHeading: string;
  closingParagraph: string;
  closingCouplet: string[];
  /** Short festive send-off, e.g. "जय माता दी", "शुभ दीपावली", "होली है!" */
  finalPhrase: string;
}

export interface FestivalConfig {
  /** URL slug — also the [festival] route param. */
  slug: string;
  nameHindi: string;
  nameEnglish: string;
  seoTitle: string;
  seoDescription: string;
  theme: ThemeTokens;

  hero: {
    headlineHindi: string;
    subheadlineHindi: string;
    lineEnglish: string;
    ctaShopLabel: string;
    ctaWhatsappLabel: string;
    heroImage: string;
    trustBadges: TrustBadge[];
    /** Optional intro video — omit for "coming soon" placeholder. */
    youtubeUrl?: string;
  };

  promise: {
    eyebrow: string;
    heading: string;
    cards: PromiseCard[];
  };

  kits: {
    eyebrow: string;
    heading: string;
    intro: string;
    items: KitItem[];
  };

  /** The interactive "build your own kit" section — pick a base kit
   *  (reuses `kits.items`), then tap-to-add individually priced extras
   *  from here onto a live thali, with a running total. */
  builder: BuilderConfig;

  dayGuide: DayGuideConfig;

  trust: {
    eyebrow: string;
    heading: string;
    stats: StatItem[];
    testimonials: TestimonialItem[];
  };

  finalCta: {
    heading: string;
    line: string;
  };

  footerTagline: string;

  /** Prefilled first line of the WhatsApp message for a generic kit
   *  enquiry, e.g. "...from your {X} collection." */
  whatsappCollectionName: string;

  about: AboutContent;

  /** Simple "is this festival's season near?" hint used only to pick
   *  a sensible default festival on "/" — month is 1-12. */
  dateHint: { fromMonth: number; toMonth: number };
}
