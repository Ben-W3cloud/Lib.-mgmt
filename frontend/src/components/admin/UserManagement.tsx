/**
 * =============================================================================
 * UserManagement â€” Admin tools for customer lookup and onboarding
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StatCard } from "@/components/ui/StatCard";
import { useCustomerProfile } from "@/hooks/useUser";
import { useOwnerUpsertCustomer } from "@/hooks/useAdmin";
import { formatDate, formatPointsBalance } from "@/lib/utils";
import { Search, UserPlus, BookOpen, Award, Calendar, Activity, Shield } from "lucide-react";

export function UserManagement() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CustomerLookup />
      <RegisterCustomerForm />
    </div>
  );
}

function CustomerLookup() {
  const [address, setAddress] = useState("");
  const [searchAddress, setSearchAddress] = useState<`0x${string}` | undefined>();

  const { profile, isLoading, isError } = useCustomerProfile(searchAddress);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.startsWith("0x") && address.length === 42) {
      setSearchAddress(address as `0x${string}`);
    }
  };

  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-cyan-200" />
          <h2 className="text-lg font-serif font-semibold text-[#edf0ff]">
            Look Up Customer
          </h2>
        </div>
        <p className="mt-1 text-sm text-[#8e9ab8]">
          Search any wallet to inspect registration and borrow activity.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1">
            <Input
              placeholder="0x... wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <Button type="submit" isLoading={isLoading}>
            <Search className="h-4 w-4" />
            Search
          </Button>
        </form>

        {searchAddress && !isLoading && (
          <div className="mt-5">
            {isError || !profile ? (
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-[#8e9ab8]">
                Customer not registered at this address.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-[#0f1729] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-serif text-2xl font-semibold text-[#edf0ff]">
                        {profile.fullName}
                      </h3>
                      <p className="mt-1 text-sm text-[#8e9ab8]">
                        {profile.email || "No email"}
                      </p>
                      <p className="mt-2 text-xs text-[#7080a4]">
                        Member: {profile.memberCode || "—"} · Joined: {formatDate(profile.joinedAt)}
                      </p>
                    </div>
                    <Badge variant="success" dot>
                      Registered
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <StatCard
                    label="Active Loans"
                    value={profile.activeLoansCount}
                    icon={BookOpen}
                    accent="bg-cyan-300/10 text-cyan-200"
                  />
                  <StatCard
                    label="Lifetime Borrows"
                    value={Number(profile.lifetimeBorrows)}
                    icon={Activity}
                    accent="bg-emerald-400/10 text-emerald-300"
                  />
                  <StatCard
                    label="Points Balance"
                    value={formatPointsBalance(profile.pointsBalance)}
                    icon={Award}
                    accent="bg-violet-300/10 text-violet-200"
                  />
                  <StatCard
                    label="Joined"
                    value={formatDate(profile.joinedAt)}
                    icon={Calendar}
                    accent="bg-white/10 text-[#cdd5f5]"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RegisterCustomerForm() {
  const [customerAddr, setCustomerAddr] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [memberCode, setMemberCode] = useState("");
  const [metadataURI, setMetadataURI] = useState("");
  const { upsertCustomer, isPending, isSuccess } = useOwnerUpsertCustomer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerAddr.startsWith("0x") || customerAddr.length !== 42) return;
    if (!fullName.trim()) return;
    upsertCustomer(
      customerAddr as `0x${string}`,
      fullName,
      email,
      memberCode,
      metadataURI
    );
  };

  return (
    <Card className="border-white/10 bg-white/[0.04]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-cyan-200" />
          <h2 className="text-lg font-serif font-semibold text-[#edf0ff]">
            Register / Update Customer
          </h2>
        </div>
        <p className="mt-1 text-sm text-[#8e9ab8]">
          Onboard a new customer or update an existing profile.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Customer Wallet Address"
            placeholder="0x..."
            value={customerAddr}
            onChange={(e) => setCustomerAddr(e.target.value)}
            required
            disabled={isPending}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isPending}
            />
            <Input
              label="Email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="Member Code"
              placeholder="MBR-001"
              value={memberCode}
              onChange={(e) => setMemberCode(e.target.value)}
              disabled={isPending}
            />
            <Input
              label="Metadata URI"
              placeholder="ipfs://..."
              value={metadataURI}
              onChange={(e) => setMetadataURI(e.target.value)}
              disabled={isPending}
              hint="Optional IPFS or URL for profile metadata"
            />
          </div>
          <Button type="submit" isLoading={isPending} disabled={isSuccess} className="w-full">
            <Shield className="h-4 w-4" />
            {isSuccess ? "Updated!" : "Register / Update Customer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
