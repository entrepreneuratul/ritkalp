"use client";

// =====================================================================
// HASH SCROLL FIX
// Replaces the removed `html { scroll-behavior: smooth }` (see the note
// in app/globals.css for why) — handles both cases that rule used to:
//
// 1. A fresh/full page load that already has a #hash in the URL (a
//    shared link, or clicking a header nav <a href="#kit-builder"> —
//    these are plain anchor tags, not next/link, so every click is a
//    real navigation). A short delay lets images/fonts/hero layout
//    settle first so the target's position is correct before scrolling.
// 2. A same-document hash change once already on the page (back/forward,
//    or a link to a different #id) — the 'hashchange' event covers this
//    without needing a full reload.
//
// Mounted once in app/layout.tsx so it's active on every route.
// =====================================================================

import { useEffect } from "react";

function scrollToCurrentHash() {
  const hash = window.location.hash;
  if (!hash) return;
  let target: Element | null;
  try {
    target = document.querySelector(hash);
  } catch {
    return; // an invalid/unparsable selector — just no-op
  }
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function HashScrollFix() {
  useEffect(() => {
    // Fires once early (typical case — hero/layout has settled by
    // 120ms) and once more after every image/resource has finished
    // loading (the `load` event) — a page with a lot of below-the-fold
    // content (many kit cards, embeds) can still be growing/reflowing
    // past the first attempt, which would otherwise leave the scroll
    // short or, worse, aimed at a position a since-shifted element used
    // to occupy. Re-running scrollIntoView once more after full load
    // corrects for that; it's a no-op if the first attempt already
    // landed correctly.
    const timer = window.setTimeout(scrollToCurrentHash, 120);
    window.addEventListener("load", scrollToCurrentHash);
    window.addEventListener("hashchange", scrollToCurrentHash);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", scrollToCurrentHash);
      window.removeEventListener("hashchange", scrollToCurrentHash);
    };
  }, []);

  return null;
}
