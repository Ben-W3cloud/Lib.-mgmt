/**
 * =============================================================================
 * Loans Page — View active loans and loan history
 * =============================================================================
 *
 * Two sections:
 * 1. Active Loans — currently borrowed books with return buttons
 * 2. Loan History — all past loans with points delta
 *
 * Uses enriched loans (Loan + Book data) for display.
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
import { cn } from "@/lib/utils";
import { BookOpen, History, Wallet, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

type Tab = "active" | "history";

export default function LoansPage() {
  const { isConnected } = useAccount();
  const { isRegistered } = useMyProfile();
  const [tab, setTab] = useState<Tab>("active");

  const { loans: activeLoans, isLoading: activeLoading } = useMyActiveLoans();
  const { loans: historyLoans, isLoading: historyLoading } = useMyLoanHistory();

  // Not connected
  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="p-5 rounded-2xl bg-leather-brown/5 mb-6 inline-block">
          <Wallet className="w-12 h-12 text-leather-brown/40" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-dark-walnut mb-2">
          Connect Your Wallet
        </h2>
        <p className="text-slate mb-6">Connect to view your loans.</p>
        <ConnectButton />
      </div>
    );
  }

  // Not registered
  if (!isRegistered) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <EmptyState
          icon={FileText}
          title="Not Registered"
          description="Register as a library member to borrow books and view loans."
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="My Loans"
        subtitle="Track your active borrows and reading history"
      />

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-leather-brown/5 rounded-xl mb-8 max-w-sm">
        <button
          onClick={() => setTab("active")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
            tab === "active"
              ? "bg-cream shadow-sm text-dark-walnut border border-leather-brown/10"
              : "text-slate hover:text-dark-walnut"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Active
          {activeLoans.length > 0 && (
            <Badge variant="gold" className="ml-1">{activeLoans.length}</Badge>
          )}
        </button>
        <button
          onClick={() => setTab("history")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
            tab === "history"
              ? "bg-cream shadow-sm text-dark-walnut border border-leather-brown/10"
              : "text-slate hover:text-dark-walnut"
          )}
        >
          <History className="w-4 h-4" />
          History
          {historyLoans.length > 0 && (
            <Badge variant="neutral" className="ml-1">{historyLoans.length}</Badge>
          )}
        </button>
      </div>

      {/* Loan list */}
      {isLoading ? (
        <div className="space-y-3">
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
              ? "You don't have any active borrows. Visit the catalog to borrow a book!"
              : "Your loan history will appear here after you borrow and return books."
          }
          action={
            tab === "active" ? (
              <Link href="/books">
                <Button variant="primary">
                  <BookOpen className="w-4 h-4" />
                  Browse Catalog
                </Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="space-y-3">
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
  );
}
