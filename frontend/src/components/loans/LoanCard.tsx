/**
 * =============================================================================
 * LoanCard — Displays a single loan with book info and status
 * =============================================================================
 *
 * Shows:
 * - Book title and author (enriched)
 * - Borrow date and due date
 * - Status badge (active, returned on-time, returned late)
 * - Due countdown / overdue indicator
 * - Return button for active loans
 * - Points delta for returned loans
 */

"use client";

import { EnrichedLoan } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, getDueStatus, formatPoints, cn } from "@/lib/utils";
import { useReturnBook } from "@/hooks/useBorrow";
import { Calendar, Clock, Award, RotateCcw } from "lucide-react";

interface LoanCardProps {
  loan: EnrichedLoan;
  showReturnButton?: boolean;
}

export function LoanCard({ loan, showReturnButton = true }: LoanCardProps) {
  const { returnBook, isPending } = useReturnBook();
  const dueStatus = getDueStatus(loan.dueAt);

  // Determine loan status for badge display
  const getStatusBadge = () => {
    if (!loan.returned) {
      // Active loan — show due status
      return (
        <Badge
          variant={dueStatus.urgency === "danger" ? "danger" : dueStatus.urgency === "warning" ? "warning" : "success"}
          dot
        >
          {dueStatus.label}
        </Badge>
      );
    }

    // Returned loan — show on-time or late
    const wasLate = loan.returnedAt > loan.dueAt;
    return (
      <Badge variant={wasLate ? "danger" : "success"} dot>
        {wasLate ? "Returned Late" : "Returned On-Time"}
      </Badge>
    );
  };

  return (
    <div
      className={cn(
        "bg-cream rounded-xl border p-5 transition-all duration-200",
        !loan.returned
          ? "border-leather-brown/15 hover:border-leather-brown/30 hover:shadow-md"
          : "border-leather-brown/8 opacity-90"
      )}
    >
      {/* Header: Book info + status */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="font-serif font-semibold text-dark-walnut truncate">
            {loan.book?.title ?? `Book #${loan.bookId.toString()}`}
          </h3>
          {loan.book && (
            <p className="text-sm text-slate">by {loan.book.author}</p>
          )}
        </div>
        {getStatusBadge()}
      </div>

      {/* Date details */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-slate">
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>Borrowed: {formatDate(loan.borrowedAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate">
          <Clock className="w-3.5 h-3.5 shrink-0" />
          <span>Due: {formatDate(loan.dueAt)}</span>
        </div>
      </div>

      {/* Returned info or return action */}
      {loan.returned ? (
        <div className="flex items-center justify-between pt-3 border-t border-leather-brown/8">
          <div className="flex items-center gap-2 text-sm text-slate">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Returned: {formatDate(loan.returnedAt)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            <span
              className={cn(
                "text-sm font-semibold",
                loan.pointsDelta >= 0n ? "text-forest-green" : "text-dusty-rose"
              )}
            >
              {formatPoints(loan.pointsDelta)} pts
            </span>
          </div>
        </div>
      ) : (
        showReturnButton && (
          <div className="pt-3 border-t border-leather-brown/8">
            <Button
              variant={dueStatus.isOverdue ? "danger" : "primary"}
              size="sm"
              onClick={() => returnBook(loan.id)}
              isLoading={isPending}
              className="w-full"
            >
              <RotateCcw className="w-4 h-4" />
              Return Book
            </Button>
          </div>
        )
      )}
    </div>
  );
}
