/**
 * =============================================================================
 * Profile Page — User registration and profile view
 * =============================================================================
 *
 * Two states:
 * 1. Not registered → shows registration form (registerCustomer)
 * 2. Registered → shows profile stats, points, and membership info
 */

"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMyProfile, useRegisterCustomer } from "@/hooks/useUser";
import { useContractConfig } from "@/hooks/useAdmin";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  User,
  Mail,
  CreditCard,
  Link as LinkIcon,
  Award,
  BookOpen,
  RotateCcw,
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { formatDate, formatPointsBalance, truncateAddress } from "@/lib/utils";

export default function ProfilePage() {
  const { isConnected, address } = useAccount();
  const { profile, isLoading, isRegistered, refetch } = useMyProfile();
  const { config } = useContractConfig();

  // Redirect state after successful registration
  const { register, isPending, isSuccess } = useRegisterCustomer();

  // Form state for registration
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [metadataURI, setMetadataURI] = useState("");

  // Refetch profile after successful registration
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => refetch(), 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, refetch]);

  // Not connected — prompt wallet connection
  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-5 rounded-2xl bg-leather-brown/5 mb-6 inline-block">
          <Wallet className="w-12 h-12 text-leather-brown/40" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-dark-walnut mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-slate mb-6">
          Connect your wallet to view or create your library profile.
        </p>
        <ConnectButton />
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  // Not registered — show registration form
  if (!isRegistered) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader
          title="Join the Library"
          subtitle="Register your profile to start borrowing books"
        />

        <Card>
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                register(fullName, email, memberCode, metadataURI);
              }}
              className="space-y-5"
            >
              <Input
                label="Full Name"
                placeholder="Your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={isPending}
              />
              <Input
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                hint="Optional — for notifications"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Member Code"
                  placeholder="MBR-001"
                  value={memberCode}
                  onChange={(e) => setMemberCode(e.target.value)}
                  disabled={isPending}
                  hint="Optional unique identifier"
                />
                <Input
                  label="Metadata URI"
                  placeholder="ipfs://..."
                  value={metadataURI}
                  onChange={(e) => setMetadataURI(e.target.value)}
                  disabled={isPending}
                  hint="Optional profile metadata"
                />
              </div>
              <Button type="submit" size="lg" isLoading={isPending} className="w-full">
                <User className="w-4 h-4" />
                {isPending ? "Registering..." : "Register as Member"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Registered — show profile
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader title="My Profile" subtitle="Your library membership details" />

      {/* Profile header card */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start gap-5">
            {/* Avatar placeholder */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-leather-brown to-dark-walnut flex items-center justify-center text-gold-accent font-serif text-2xl font-bold shadow-md">
              {profile!.fullName.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-serif font-bold text-dark-walnut">
                  {profile!.fullName}
                </h2>
                <Badge variant="success" dot>Active Member</Badge>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate mt-2">
                {profile!.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    {profile!.email}
                  </span>
                )}
                {profile!.memberCode && (
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    {profile!.memberCode}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5" />
                  {truncateAddress(address ?? "")}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate/60 mt-2">
                <span>Joined {formatDate(profile!.joinedAt)}</span>
                <span>Updated {formatDate(profile!.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Points Balance"
          value={formatPointsBalance(profile!.pointsBalance)}
          icon={Award}
          accent="bg-gold-accent/15 text-gold-accent"
        />
        <StatCard
          label="Active Loans"
          value={`${profile!.activeLoansCount} / ${config?.maxActiveLoansPerCustomer ?? "—"}`}
          icon={BookOpen}
          accent="bg-leather-brown/10 text-leather-brown"
        />
        <StatCard
          label="Total Borrowed"
          value={Number(profile!.lifetimeBorrows)}
          icon={TrendingUp}
          accent="bg-forest-green/10 text-forest-green"
        />
        <StatCard
          label="Total Returned"
          value={Number(profile!.lifetimeReturns)}
          icon={RotateCcw}
          accent="bg-slate/10 text-slate"
        />
      </div>

      {/* Points breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-forest-green" />
              <h3 className="font-serif font-semibold text-dark-walnut">Points Earned</h3>
            </div>
            <p className="text-3xl font-serif font-bold text-forest-green">
              +{Number(profile!.totalPointsEarned).toLocaleString()}
            </p>
            <p className="text-xs text-slate mt-1">From borrowing and on-time returns</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-dusty-rose" />
              <h3 className="font-serif font-semibold text-dark-walnut">Points Penalized</h3>
            </div>
            <p className="text-3xl font-serif font-bold text-dusty-rose">
              -{Number(profile!.totalPointsPenalized).toLocaleString()}
            </p>
            <p className="text-xs text-slate mt-1">From late returns</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
