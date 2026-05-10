/**
 * =============================================================================
 * Profile Page â€” Membership dashboard and registration flow
 * =============================================================================
 */

"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMyProfile, useRegisterCustomer } from "@/hooks/useUser";
import { useContractConfig } from "@/hooks/useAdmin";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Award,
  BookOpen,
  CreditCard,
  Mail,
  RotateCcw,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
} from "lucide-react";
import { formatDate, formatPointsBalance, truncateAddress } from "@/lib/utils";

export default function ProfilePage() {
  const { isConnected, address } = useAccount();
  const { profile, isLoading, isRegistered, refetch } = useMyProfile();
  const { config } = useContractConfig();
  const { register, isPending, isSuccess } = useRegisterCustomer();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [metadataURI, setMetadataURI] = useState("");

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => refetch(), 2000);
    return () => clearTimeout(timer);
  }, [isSuccess, refetch]);

  if (!isConnected) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <Card className="w-full border-white/10 bg-white/[0.04]">
          <CardContent className="flex flex-col items-center py-16 text-center">
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <Wallet className="h-12 w-12 text-cyan-200" />
            </div>
            <h2 className="font-serif text-3xl font-bold text-[#edf0ff]">
              Connect Your Wallet
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[#8e9ab8]">
              Connect your wallet to view or create your membership profile.
            </p>
            <div className="mt-8">
              <ConnectButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-12 w-72" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="Join the Library"
          subtitle="Create your on-chain membership profile before borrowing from the archive."
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardContent className="p-6">
              <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">
                Membership protocol
              </p>
              <h2 className="mt-3 font-serif text-3xl font-bold text-[#edf0ff]">
                Register once. Borrow forever.
              </h2>
              <p className="mt-4 text-sm leading-7 text-[#8e9ab8]">
                Registration creates the customer record that the contract uses
                for loan limits, points, and loan history. Keep the fields
                minimal if you just want to test the flow.
              </p>

              <div className="mt-6 grid gap-3">
                {[
                  "Wallet ownership becomes your archive identity.",
                  "Borrow limits and points are tracked on-chain.",
                  "Registration updates stay visible in the profile view.",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#edf0ff]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader>
              <h2 className="font-serif text-2xl font-semibold text-[#edf0ff]">
                Membership Form
              </h2>
              <p className="mt-1 text-sm text-[#8e9ab8]">
                Fill in the profile data you want stored with the wallet.
              </p>
            </CardHeader>
            <CardContent>
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
                  hint="Optional for notifications"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Member Code"
                    placeholder="MBR-001"
                    value={memberCode}
                    onChange={(e) => setMemberCode(e.target.value)}
                    disabled={isPending}
                    hint="Optional identifier"
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
                  <User className="h-4 w-4" />
                  {isPending ? "Registering..." : "Register as Member"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="My Profile"
        subtitle="Your membership record, borrowing history, and earned points live here."
      />

      <Card className="border-white/10 bg-white/[0.04]">
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-5">
              <div className="flex h-20 w-20 items-center justify-center border border-white/10 bg-[linear-gradient(135deg,rgba(200,204,255,0.95),rgba(34,211,238,0.55))] font-serif text-3xl font-bold text-[#08101d] shadow-[0_18px_45px_rgba(200,204,255,0.2)]">
                {profile!.fullName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-serif text-3xl font-bold text-[#edf0ff]">
                    {profile!.fullName}
                  </h2>
                  <Badge variant="success" dot>
                    Active Member
                  </Badge>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#8e9ab8]">
                  {profile!.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-cyan-200" />
                      {profile!.email}
                    </span>
                  )}
                  {profile!.memberCode && (
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="h-3.5 w-3.5 text-cyan-200" />
                      {profile!.memberCode}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Wallet className="h-3.5 w-3.5 text-cyan-200" />
                    {truncateAddress(address ?? "")}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#7080a4]">
                  <span>Joined {formatDate(profile!.joinedAt)}</span>
                  <span>Updated {formatDate(profile!.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-[#8e9ab8]">
              <p className="uppercase tracking-[0.3em] text-cyan-200/70">
                Wallet
              </p>
              <p className="mt-2 font-mono text-sm text-[#edf0ff]">
                {truncateAddress(address ?? "")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <StatCard
          label="Points Balance"
          value={formatPointsBalance(profile!.pointsBalance)}
          icon={Award}
          accent="bg-cyan-300/10 text-cyan-200"
        />
        <StatCard
          label="Active Loans"
          value={`${profile!.activeLoansCount} / ${config?.maxActiveLoansPerCustomer ?? "-"}`}
          icon={BookOpen}
          accent="bg-violet-300/10 text-violet-200"
        />
        <StatCard
          label="Total Borrowed"
          value={Number(profile!.lifetimeBorrows)}
          icon={TrendingUp}
          accent="bg-emerald-400/10 text-emerald-300"
        />
        <StatCard
          label="Total Returned"
          value={Number(profile!.lifetimeReturns)}
          icon={RotateCcw}
          accent="bg-white/10 text-[#cdd5f5]"
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-300" />
              <h3 className="font-serif text-xl font-semibold text-[#edf0ff]">
                Points Earned
              </h3>
            </div>
            <p className="mt-4 font-serif text-4xl font-bold text-emerald-300">
              +{Number(profile!.totalPointsEarned).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-[#8e9ab8]">
              From borrowing and on-time returns
            </p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.04]">
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-rose-200" />
              <h3 className="font-serif text-xl font-semibold text-[#edf0ff]">
                Points Penalized
              </h3>
            </div>
            <p className="mt-4 font-serif text-4xl font-bold text-rose-200">
              -{Number(profile!.totalPointsPenalized).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-[#8e9ab8]">
              From late returns
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
