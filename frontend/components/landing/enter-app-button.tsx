"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useRef, type PointerEvent, type ReactNode } from "react";
import { useAccount } from "wagmi";
import { springSnappy } from "@/components/landing/motion-primitives";

/**
 * Wallet-aware entry point. Connected wallet routes to /dashboard;
 * otherwise opens the RainbowKit connect modal and surfaces a toast.
 * Magnetic pointer pull via motion values (no re-renders).
 */
export function EnterAppButton({
  children,
  variant = "primary",
  onNeedsConnect,
  className = "",
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  onNeedsConnect?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springSnappy);
  const springY = useSpring(y, springSnappy);
  const tx = useTransform(springX, (v) => `${v}px`);
  const ty = useTransform(springY, (v) => `${v}px`);

  const handleMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (reduced || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      x.set(relX * 0.18);
      y.set(relY * 0.28);
    },
    [reduced, x, y]
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const handleClick = useCallback(() => {
    if (isConnected) {
      router.push("/dashboard");
      return;
    }
    onNeedsConnect?.();
    openConnectModal?.();
  }, [isConnected, onNeedsConnect, openConnectModal, router]);

  return (
    <motion.button
      ref={ref}
      type="button"
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onClick={handleClick}
      style={{ x: reduced ? 0 : tx, y: reduced ? 0 : ty }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      className={`${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`}
    >
      {children}
    </motion.button>
  );
}
