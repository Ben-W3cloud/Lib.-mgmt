/**
 * =============================================================================
 * LoanCard â€” Archive-style loan entry with book cover and status
 * =============================================================================
 */

"use client";

import { EnrichedLoan } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { BookCover } from "@/components/books/BookCover";
import { formatDate, getDueStatus, formatPoints, cn } from "@/lib/utils";
import { useReturnBook } from "@/hooks/useBorrow";
import { Calendar, Clock, Award, RotateCcw, BookOpen } from "lucide-react";

interface LoanCardProps {
  loan: EnrichedLoan;
  showReturnButton?: boolean;
}

export function LoanCard({ loan, showReturnButton = true }: LoanCardProps) {
  const { returnBook, isPending } = useReturnBook();
  const dueStatus = getDueStatus(loan.dueAt);
  const coverSeed = loan.book?.id ?? loan.bookId;

  const getStatusBadge = () => {
    if (!loan.returned) {
      return (
        <Badge
          variant={dueStatus.urgency === "danger" ? "danger" : dueStatus.urgency === "warning" ? "warning" : "success"}
          dot
        >
          {dueStatus.label}
        </Badge>
      );
    }

    const wasLate = loan.returnedAt > loan.dueAt;
    return (
      <Badge variant={wasLate ? "danger" : "success"} dot>
        {wasLate ? "Returned Late" : "Returned On-Time"}
      </Badge>
    );
  };

  return (
    <Card
      className={cn(
        "overflow-hidden border-white/10 bg-[#0f1729]",
        !loan.returned ? "shadow-[0_24px_80px_rgba(0,0,0,0.25)]" : "opacity-90"
      )}
    >
      <CardContent className="p-4 md:p-5">
        <div className="grid gap-4 md:grid-cols-[110px_1fr]">
          <BookCover
            title={loan.book?.title ?? `Book ${loan.bookId.toString()}`}
            author={loan.book?.author}
            isbn={loan.book?.isbn}
            seed={coverSeed}
            size="sm"
            className="max-w-[110px]"
          />

          <div className="flex min-w-0 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate font-serif text-xl font-semibold text-[#edf0ff]">
                  {loan.book?.title ?? `Book #${loan.bookId.toString()}`}
                </h3>
                {loan.book && (
                  <p className="text-sm text-[#8e9ab8]">by {loan.book.author}</p>
                )}
              </div>
              {getStatusBadge()}
            </div>

            <div className="mt-4 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-[#8e9ab8]">
                <Calendar className="h-4 w-4 shrink-0 text-cyan-200" />
                <span>Borrowed {formatDate(loan.borrowedAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#8e9ab8]">
                <Clock className="h-4 w-4 shrink-0 text-cyan-200" />
                <span>Due {formatDate(loan.dueAt)}</span>
              </div>
            </div>

            {loan.returned ? (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <div className="flex items-center gap-2 text-sm text-[#8e9ab8]">
                  <RotateCcw className="h-4 w-4 text-cyan-200" />
                  <span>Returned {formatDate(loan.returnedAt)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-cyan-200" />
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      loan.pointsDelta >= 0n ? "text-emerald-300" : "text-rose-200"
                    )}
                  >
                    {formatPoints(loan.pointsDelta)} pts
                  </span>
                </div>
              </div>
            ) : (
              showReturnButton && (
                <div className="mt-4 border-t border-white/10 pt-4">
                  <Button
                    variant={dueStatus.isOverdue ? "danger" : "primary"}
                    size="sm"
                    onClick={() => returnBook(loan.id)}
                    isLoading={isPending}
                    className="w-full"
                  >
                    <BookOpen className="h-4 w-4" />
                    Return Book
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
