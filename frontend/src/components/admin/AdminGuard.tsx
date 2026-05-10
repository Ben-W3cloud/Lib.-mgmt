/**
 * =============================================================================
 * AdminGuard â€” Route protection for admin pages
 * =============================================================================
 */

"use client";

import { useAccount } from "wagmi";
import { useIsOwner } from "@/hooks/useUser";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Shield, Wallet } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isConnected } = useAccount();
  const { isOwner, isLoading } = useIsOwner();

  if (!isConnected) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 text-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-16">
          <div className="mx-auto mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
            <Wallet className="h-12 w-12 text-cyan-200" />
          </div>
          <h2 className="mb-2 text-3xl font-serif font-bold text-[#edf0ff]">
            Connect Your Wallet
          </h2>
          <p className="mx-auto mb-6 max-w-sm text-[#8e9ab8]">
            Connect your admin wallet to access the library management dashboard.
          </p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-cyan-300" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 text-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/[0.04] px-6 py-16">
          <div className="mx-auto mb-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-5">
            <Shield className="h-12 w-12 text-rose-200" />
          </div>
          <h2 className="mb-2 text-3xl font-serif font-bold text-[#edf0ff]">
            Access Denied
          </h2>
          <p className="mx-auto max-w-sm text-[#8e9ab8]">
            This area is restricted to the contract owner. Connect with the admin wallet to access the management dashboard.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
