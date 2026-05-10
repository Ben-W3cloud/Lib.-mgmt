/**
 * =============================================================================
 * Skeleton — Loading placeholder with shimmer animation
 * =============================================================================
 */

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-white/5 via-white/10 to-white/5",
        "bg-[length:400%_100%] rounded-lg",
        className
      )}
    />
  );
}

/** Skeleton card matching the BookCard layout */
export function BookCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
      {/* Book spine accent */}
      <div className="flex gap-4">
        <Skeleton className="w-2 h-28 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/** Skeleton card for loan entries */
export function LoanCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
}

/** Skeleton for stat cards */
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}
