"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

// Thin top progress bar that flashes on each client-side route change.
// Keyed on pathname so it remounts and replays the sweep without effects.
export function RouteProgress() {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return null;

  return (
    <motion.div
      key={pathname}
      className="route-progress"
      initial={{ scaleX: 0, opacity: 1 }}
      animate={{ scaleX: 1, opacity: 0 }}
      transition={{
        scaleX: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
        opacity: { delay: 0.5, duration: 0.25 },
      }}
      aria-hidden="true"
    />
  );
}
