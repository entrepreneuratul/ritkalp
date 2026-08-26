import { notFound } from "next/navigation";
import { getFestival, isValidFestivalSlug, festivals } from "@/lib/festivals/registry";
import { buildThemeCssVars } from "@/lib/theme";
import { auth } from "@/lib/auth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";

export function generateStaticParams() {
  return festivals.map((f) => ({ festival: f.slug }));
}

export default async function FestivalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { festival: string };
}) {
  if (!isValidFestivalSlug(params.festival)) notFound();
  const festival = getFestival(params.festival)!;
  const session = await auth();

  return (
    // This wrapper carries the active festival's theme as CSS custom
    // properties (see lib/theme.ts) — every `bg-primary-*`, `text-accent-*`,
    // `bg-surface*` class inside it resolves through these variables, so
    // switching festivals (app/[festival] is one shared layout — see
    // components/FestivalSwitcher.tsx) re-colors and re-renders
    // everything inside instantly, with no full page reload.
    <div
      data-festival={festival.slug}
      style={buildThemeCssVars(festival.theme)}
      className="bg-surface text-primary-900 min-h-screen flex flex-col"
    >
      <Header festival={festival} session={session} />
      <main className="flex-1">{children}</main>
      <Footer festival={festival} />
      <CartDrawer />
    </div>
  );
}
