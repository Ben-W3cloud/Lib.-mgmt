/**
 * =============================================================================
 * Admin Dashboard — Overview statistics and quick actions
 * =============================================================================
 *
 * Displays:
 * - Total books, active vs inactive count
 * - Current config values (borrow/point rules)
 * - Quick links to management sections
 */

"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Card, CardContent } from "@/components/ui/Card";
import { useBooks } from "@/hooks/useBooks";
import { useContractConfig } from "@/hooks/useAdmin";
import { useIsOwner } from "@/hooks/useUser";
import { StatCardSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import {
  Library,
  BookCheck,
  BookX,
  Clock,
  Award,
  Users,
  Settings,
  ArrowRight,
  Shield,
} from "lucide-react";
import { truncateAddress, secondsToDays } from "@/lib/utils";

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <DashboardContent />
    </AdminGuard>
  );
}

function DashboardContent() {
  const { books, isLoading: booksLoading, count: totalBooks } = useBooks();
  const { config, isLoading: configLoading } = useContractConfig();
  const { ownerAddress } = useIsOwner();

  const activeBooks = books.filter((b) => b.active).length;
  const inactiveBooks = books.filter((b) => !b.active).length;
  const totalCopies = books.reduce((sum, b) => sum + Number(b.totalCopies), 0);
  const availableCopies = books.reduce((sum, b) => sum + Number(b.availableCopies), 0);

  const isLoading = booksLoading || configLoading;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Library management control center"
      />

      {/* Owner badge */}
      <div className="flex items-center gap-2 mb-8 p-3 rounded-xl bg-gold-accent/5 border border-gold-accent/15 w-fit">
        <Shield className="w-4 h-4 text-gold-accent" />
        <span className="text-sm text-slate">Contract Owner: </span>
        <span className="text-sm font-mono text-dark-walnut">
          {truncateAddress(ownerAddress ?? "")}
        </span>
      </div>

      {/* Stats grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {/* Library stats */}
          <h3 className="text-sm font-medium text-slate uppercase tracking-wider mb-3">
            Library Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Books" value={totalBooks} icon={Library} accent="bg-leather-brown/10 text-leather-brown" />
            <StatCard label="Active Books" value={activeBooks} icon={BookCheck} accent="bg-forest-green/10 text-forest-green" />
            <StatCard label="Disabled Books" value={inactiveBooks} icon={BookX} accent="bg-dusty-rose/10 text-dusty-rose" />
            <StatCard label="Available Copies" value={`${availableCopies}/${totalCopies}`} icon={Library} accent="bg-gold-accent/15 text-gold-accent" />
          </div>

          {/* Config stats */}
          {config && (
            <>
              <h3 className="text-sm font-medium text-slate uppercase tracking-wider mb-3">
                Current Rules
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Max Borrow" value={`${secondsToDays(config.maxBorrowDuration)} days`} icon={Clock} accent="bg-leather-brown/10 text-leather-brown" />
                <StatCard label="Max Active Loans" value={config.maxActiveLoansPerCustomer} icon={Library} accent="bg-forest-green/10 text-forest-green" />
                <StatCard label="Borrow Reward" value={`+${config.borrowRewardPoints} pts`} icon={Award} accent="bg-gold-accent/15 text-gold-accent" />
                <StatCard label="Late Penalty/Day" value={`-${config.latePenaltyPerDay} pts`} icon={Award} accent="bg-dusty-rose/10 text-dusty-rose" />
              </div>
            </>
          )}
        </>
      )}

      {/* Quick actions */}
      <h3 className="text-sm font-medium text-slate uppercase tracking-wider mb-3">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: "/admin/books", label: "Manage Books", desc: "Add, update, and toggle books", icon: Library, color: "text-leather-brown" },
          { href: "/admin/users", label: "Manage Users", desc: "Register and update customers", icon: Users, color: "text-forest-green" },
          { href: "/admin/rules", label: "System Rules", desc: "Configure borrow and point rules", icon: Settings, color: "text-gold-accent" },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card hover className="h-full">
              <CardContent className="pt-5 flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-leather-brown/5">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-serif font-semibold text-dark-walnut mb-1 flex items-center gap-2">
                    {item.label}
                    <ArrowRight className="w-4 h-4 text-leather-brown/30" />
                  </h3>
                  <p className="text-sm text-slate">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
