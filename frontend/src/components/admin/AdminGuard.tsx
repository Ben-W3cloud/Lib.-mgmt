/**
 * =============================================================================
 * AdminGuard — Route protection for admin pages
 * =============================================================================
 *
 * Checks if the connected wallet is the contract owner.
 * If not, displays an access denied message.
 * If not connected, prompts wallet connection.
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

  // Not connected — prompt wallet connection
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="p-5 rounded-2xl bg-leather-brown/5 mb-6">
          <Wallet className="w-12 h-12 text-leather-brown/40" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-dark-walnut mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-slate mb-6 max-w-sm">
          Connect your admin wallet to access the library management dashboard.
        </p>
        <ConnectButton />
      </div>
    );
  }

  // Loading ownership check
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-leather-brown/20 border-t-leather-brown" />
      </div>
    );
  }

  // Not owner — access denied
  if (!isOwner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="p-5 rounded-2xl bg-dusty-rose/10 mb-6">
          <Shield className="w-12 h-12 text-dusty-rose/50" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-dark-walnut mb-2">
          Access Denied
        </h2>
        <p className="text-slate max-w-sm">
          This area is restricted to the contract owner. Connect with the admin wallet to access the management dashboard.
        </p>
      </div>
    );
  }

  // Owner — render admin content
  return <>{children}</>;
}
