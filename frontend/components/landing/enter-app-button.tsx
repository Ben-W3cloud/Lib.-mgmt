"use client";

import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { useCallback, type ReactNode } from "react";
import { useAccount } from "wagmi";

/**
 * Wallet-aware entry point. Connected wallet routes to /dashboard;
 * otherwise opens the RainbowKit connect modal and surfaces a status line.
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

  const handleClick = useCallback(() => {
    if (isConnected) {
      router.push("/dashboard");
      return;
    }
    onNeedsConnect?.();
    openConnectModal?.();
  }, [isConnected, onNeedsConnect, openConnectModal, router]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`}
    >
      {children}
    </button>
  );
}
