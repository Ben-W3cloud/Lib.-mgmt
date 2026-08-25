"use client";

import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

// Thin top progress bar that flashes on each client-side route change.
// Keyed on pathname so it remounts and replays the sweep. Pure CSS — runs off
// the main thread and stays smooth under load.
export function RouteProgress() {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return null;

  return <div key={pathname} className="route-progress" aria-hidden="true" />;
}
