/**
 * =============================================================================
 * Admin Dashboard â€” Command center for the archive
 * =============================================================================
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Admin Dashboard"
        subtitle="A command center for books, members, and protocol rules."
      />

      <Card className="border-white/10 bg-white/[0.04]">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">
              Contract owner
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-[#edf0ff]">
              {truncateAddress(ownerAddress ?? "")}
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#8e9ab8]">
            <Shield className="h-4 w-4 text-cyan-200" />
            Owner-controlled archive
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <StatCard
              label="Total Books"
              value={totalBooks}
              icon={Library}
              accent="bg-cyan-300/10 text-cyan-200"
            />
            <StatCard
              label="Active Books"
              value={activeBooks}
              icon={BookCheck}
              accent="bg-emerald-400/10 text-emerald-300"
            />
            <StatCard
              label="Disabled Books"
              value={inactiveBooks}
              icon={BookX}
              accent="bg-rose-500/10 text-rose-200"
            />
            <StatCard
              label="Available Copies"
              value={`${availableCopies}/${totalCopies}`}
              icon={Library}
              accent="bg-violet-300/10 text-violet-200"
            />
          </div>

          {config && (
            <>
              <div className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">
                <Clock className="h-4 w-4" />
                Current Rules
              </div>
              <div className="mt-3 grid gap-4 md:grid-cols-4">
                <StatCard
                  label="Max Borrow"
                  value={`${secondsToDays(config.maxBorrowDuration)} days`}
                  icon={Clock}
                  accent="bg-cyan-300/10 text-cyan-200"
                />
                <StatCard
                  label="Max Active Loans"
                  value={config.maxActiveLoansPerCustomer}
                  icon={Users}
                  accent="bg-emerald-400/10 text-emerald-300"
                />
                <StatCard
                  label="Borrow Reward"
                  value={`+${config.borrowRewardPoints} pts`}
                  icon={Award}
                  accent="bg-violet-300/10 text-violet-200"
                />
                <StatCard
                  label="Late Penalty/Day"
                  value={`-${config.latePenaltyPerDay} pts`}
                  icon={Award}
                  accent="bg-rose-500/10 text-rose-200"
                />
              </div>
            </>
          )}
        </>
      )}

      <div className="mt-8 flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">
        <Settings className="h-4 w-4" />
        Quick Actions
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        {[
          { href: "/admin/books", label: "Manage Books", desc: "Add, update, and toggle books", icon: Library },
          { href: "/admin/users", label: "Manage Users", desc: "Register and update customers", icon: Users },
          { href: "/admin/rules", label: "System Rules", desc: "Configure borrow and point rules", icon: Settings },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card hover className="h-full border-white/10 bg-white/[0.04]">
              <CardContent className="flex items-start gap-4 p-5">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-200">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-1 flex items-center gap-2 font-serif text-xl font-semibold text-[#edf0ff]">
                    {item.label}
                    <ArrowRight className="h-4 w-4 text-cyan-200/40" />
                  </h3>
                  <p className="text-sm text-[#8e9ab8]">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
