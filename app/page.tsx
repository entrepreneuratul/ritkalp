import { redirect } from "next/navigation";
import { getDefaultFestivalSlug } from "@/lib/festivals/registry";

// "/" always redirects into a specific festival's route — see
// lib/festivals/registry.ts:getDefaultFestivalSlug() for the simple
// month-range heuristic that picks which one.
export default function RootPage() {
  redirect(`/${getDefaultFestivalSlug()}`);
}
