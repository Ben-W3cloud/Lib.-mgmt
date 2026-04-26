/**
 * =============================================================================
 * UserManagement — Admin form for looking up and managing customers
 * =============================================================================
 *
 * Features:
 * 1. Look up any customer by wallet address → getCustomer(address)
 * 2. Register/update a customer → ownerUpsertCustomer(address, ...)
 * 3. View customer's active loans → getCustomerActiveLoanIds(address)
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
import { Search, UserPlus, BookOpen, Award, Calendar, Activity } from "lucide-react";

export function UserManagement() {
  return (
    <div className="space-y-8">
      <CustomerLookup />
      <RegisterCustomerForm />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Customer Lookup — Search by wallet address
// ---------------------------------------------------------------------------
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-leather-brown" />
          <h2 className="text-lg font-serif font-semibold text-dark-walnut">
            Look Up Customer
          </h2>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex gap-3 mb-5">
          <div className="flex-1">
            <Input
              placeholder="0x... wallet address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <Button type="submit" isLoading={isLoading}>
            <Search className="w-4 h-4" />
            Search
          </Button>
        </form>

        {/* Results */}
        {searchAddress && !isLoading && (
          isError || !profile ? (
            <div className="text-center py-6 text-sm text-slate">
              Customer not registered at this address.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-parchment/50 rounded-lg p-4 border border-leather-brown/10">
                <h3 className="font-serif font-semibold text-dark-walnut text-lg">
                  {profile.fullName}
                </h3>
                <p className="text-sm text-slate">{profile.email || "No email"}</p>
                <p className="text-xs text-slate/60 mt-1">
                  Member: {profile.memberCode || "—"} · Joined: {formatDate(profile.joinedAt)}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  label="Active Loans"
                  value={profile.activeLoansCount}
                  icon={BookOpen}
                  accent="bg-leather-brown/10 text-leather-brown"
                />
                <StatCard
                  label="Lifetime Borrows"
                  value={Number(profile.lifetimeBorrows)}
                  icon={Activity}
                  accent="bg-forest-green/10 text-forest-green"
                />
                <StatCard
                  label="Points Balance"
                  value={formatPointsBalance(profile.pointsBalance)}
                  icon={Award}
                  accent="bg-gold-accent/15 text-gold-accent"
                />
                <StatCard
                  label="Joined"
                  value={formatDate(profile.joinedAt)}
                  icon={Calendar}
                  accent="bg-slate/10 text-slate"
                />
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Register/Update Customer Form
// ---------------------------------------------------------------------------
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
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-forest-green" />
          <h2 className="text-lg font-serif font-semibold text-dark-walnut">
            Register / Update Customer
          </h2>
        </div>
        <p className="text-sm text-slate mt-1">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Button type="submit" isLoading={isPending} disabled={isSuccess}>
            <UserPlus className="w-4 h-4" />
            {isSuccess ? "Updated! ✓" : "Register / Update Customer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
