"use client";

import { useCallback } from "react";

/**
 * Pointer-driven 3D tilt handlers. No refs needed — event.currentTarget carries
 * the element. rAF-batched; disabled for touch and reduced-motion.
 */
export function useTilt(max = 6) {
  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "touch") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
      });
    },
    [max]
  );

  const onPointerLeave = useCallback((event: React.PointerEvent<HTMLElement>) => {
    event.currentTarget.style.transform = "";
  }, []);

  return { onPointerMove, onPointerLeave };
}
