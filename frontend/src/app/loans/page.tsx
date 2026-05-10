/**
 * =============================================================================
 * Loans Page â€” Active borrows and archive history
 * =============================================================================
 */

"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useMyActiveLoans, useMyLoanHistory } from "@/hooks/useLoans";
import { useMyProfile } from "@/hooks/useUser";
import { LoanCard } from "@/components/loans/LoanCard";
import { LoanCardSkeleton } from "@/components/ui/Skeleton";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { BookOpen, History, Wallet, FileText, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";

type Tab = "active" | "history";

export default function LoansPage() {
  const { isConnected } = useAccount();
  const { isRegistered } = useMyProfile();
  const [tab, setTab] = useState<Tab>("active");

  const { loans: activeLoans, isLoading: activeLoading } = useMyActiveLoans();
  const { loans: historyLoans, isLoading: historyLoading } = useMyLoanHistory();

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
              Connect to view your active loans and archive history.
            </p>
            <div className="mt-8">
              <ConnectButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={FileText}
          title="Not Registered"
          description="Register as a library member to borrow books and review your loan history."
          action={
            <Link href="/profile">
              <Button variant="gold">Register Now</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const isLoading = tab === "active" ? activeLoading : historyLoading;
  const loans = tab === "active" ? activeLoans : historyLoans;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="My Loans"
        subtitle="Track open borrows, completed returns, and points outcomes."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Active Loans"
          value={activeLoans.length}
          icon={BookOpen}
          accent="bg-cyan-300/10 text-cyan-200"
        />
        <StatCard
          label="Loan History"
          value={historyLoans.length}
          icon={History}
          accent="bg-violet-300/10 text-violet-200"
        />
        <StatCard
          label="Status"
          value="Archive synced"
          icon={Shield}
          accent="bg-emerald-400/10 text-emerald-300"
        />
      </div>

      <Card className="mt-6 border-white/10 bg-white/[0.04]">
        <CardContent className="p-3">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => setTab("active")}
              className={cn(
                "flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                tab === "active"
                  ? "bg-white/10 text-[#edf0ff]"
                  : "text-[#8e9ab8] hover:bg-white/5 hover:text-[#edf0ff]"
              )}
            >
              <span className="inline-flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Active
                {activeLoans.length > 0 && (
                  <Badge variant="gold" className="ml-1">
                    {activeLoans.length}
                  </Badge>
                )}
              </span>
            </button>
            <button
              onClick={() => setTab("history")}
              className={cn(
                "flex-1 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                tab === "history"
                  ? "bg-white/10 text-[#edf0ff]"
                  : "text-[#8e9ab8] hover:bg-white/5 hover:text-[#edf0ff]"
              )}
            >
              <span className="inline-flex items-center gap-2">
                <History className="h-4 w-4" />
                History
                {historyLoans.length > 0 && (
                  <Badge variant="neutral" className="ml-1">
                    {historyLoans.length}
                  </Badge>
                )}
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoanCardSkeleton key={i} />
            ))}
          </div>
        ) : loans.length === 0 ? (
          <EmptyState
            icon={tab === "active" ? BookOpen : History}
            title={tab === "active" ? "No Active Loans" : "No Loan History"}
            description={
              tab === "active"
                ? "You don't have any active borrows. Visit the catalog to borrow a book."
                : "Your returned loans will appear here after you complete a borrow cycle."
            }
            action={
              tab === "active" ? (
                <Link href="/books">
                  <Button variant="primary">
                    <BookOpen className="h-4 w-4" />
                    Browse Catalog
                  </Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => (
              <LoanCard
                key={loan.id.toString()}
                loan={loan}
                showReturnButton={tab === "active"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
