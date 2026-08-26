"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Animates a stat like "500+" or "4.8★" counting up from 0 the moment
 * it scrolls into view — parses the leading number (integer or
 * decimal) out of `value` and keeps whatever prefix/suffix surrounds
 * it (₹, +, ★, etc.) untouched. Falls back to just rendering the
 * plain string if it doesn't start with a number.
 */
export default function CountUp({ value, durationMs = 1400 }: { value: string; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(() => zeroed(value));

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const [, prefix, numStr, suffix] = match;
    const target = parseFloat(numStr);
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const start = performance.now();
        function tick(now: number) {
          const elapsed = now - start;
          const progress = Math.min(1, elapsed / durationMs);
          // ease-out-expo — starts fast, settles gently, matches the
          // site's --ease-smooth feel without needing the CSS var here.
          const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = target * eased;
          setDisplay(`${prefix}${current.toFixed(decimals)}${suffix}`);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return <span ref={ref}>{display}</span>;
}

function zeroed(value: string): string {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return value;
  const [, prefix, numStr, suffix] = match;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return `${prefix}${(0).toFixed(decimals)}${suffix}`;
}
