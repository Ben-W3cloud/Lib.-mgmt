/**
 * =============================================================================
 * BorrowModal — Modal dialog for borrowing a book
 * =============================================================================
 *
 * Allows the user to:
 * 1. Select a borrow duration (1-14 days, or whatever maxBorrowDuration is)
 * 2. See the estimated return date
 * 3. See reward points they'll earn
 * 4. Confirm the borrow transaction
 *
 * All constraints come from the contract:
 * - requestedDuration must be > 0 and <= maxBorrowDuration
 * - User must be registered
 * - User must not exceed maxActiveLoansPerCustomer
 * - Book must be active and have available copies
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Book } from "@/types";
import { useBorrowBook } from "@/hooks/useBorrow";
import { useContractConfig } from "@/hooks/useAdmin";
import { secondsToDays, daysToSeconds } from "@/lib/utils";
import { Calendar, Clock, Award, AlertTriangle } from "lucide-react";

interface BorrowModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export function BorrowModal({ book, isOpen, onClose }: BorrowModalProps) {
  const { config } = useContractConfig();
  const { borrow, isPending, isSuccess } = useBorrowBook();

  // Max days from config (default 14 if not loaded yet)
  const maxDays = config ? secondsToDays(config.maxBorrowDuration) : 14;
  const [days, setDays] = useState(7); // Default to 7 days

  // Calculate the estimated return date
  const returnDate = useMemo(() => {
    const now = new Date();
    now.setDate(now.getDate() + days);
    return now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [days]);

  // Handle borrow submission
  const handleBorrow = () => {
    const durationSeconds = daysToSeconds(days);
    borrow(book.id, durationSeconds);
  };

  useEffect(() => {
    if (!isSuccess) return;
    const timer = setTimeout(() => onClose(), 1500);
    return () => clearTimeout(timer);
  }, [isSuccess, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Borrow Book">
      <div className="space-y-6 text-[#edf0ff]">
        {/* Book info summary */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="font-serif text-lg font-semibold text-[#edf0ff]">
            {book.title}
          </h3>
          <p className="text-sm text-[#8e9ab8]">by {book.author}</p>
        </div>

        {/* Duration slider */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-[#edf0ff]">
            <Clock className="w-4 h-4" />
            Borrow Duration
          </label>

          <div className="space-y-2">
            <input
              type="range"
              min={1}
              max={maxDays}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-white/10
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
                         [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-cyan-300 [&::-webkit-slider-thumb]:shadow-md
                         [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[#8e9ab8]">
              <span>1 day</span>
              <span className="text-sm font-semibold text-cyan-200">
                {days} day{days !== 1 ? "s" : ""}
              </span>
              <span>{maxDays} days</span>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-[#8e9ab8]">
              <Calendar className="w-3.5 h-3.5" />
              Return by
            </div>
            <p className="text-sm font-medium text-[#edf0ff]">{returnDate}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="mb-1 flex items-center gap-1.5 text-xs text-[#8e9ab8]">
              <Award className="w-3.5 h-3.5" />
              Reward
            </div>
            <p className="text-sm font-medium text-emerald-300">
              +{config?.borrowRewardPoints ?? 10} points
            </p>
          </div>
        </div>

        {/* Late return warning */}
        <div className="flex items-start gap-2 rounded-xl border border-cyan-300/15 bg-cyan-300/5 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />
          <p className="text-xs text-[#8e9ab8]">
            Late returns incur a penalty of{" "}
            <span className="font-semibold text-rose-200">
              {config?.latePenaltyPerDay ?? 2} points per day
            </span>
            . On-time returns earn{" "}
            <span className="font-semibold text-emerald-300">
              +{config?.onTimeReturnRewardPoints ?? 15} bonus points
            </span>
            .
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleBorrow}
            isLoading={isPending}
            disabled={isSuccess}
            className="flex-1"
          >
            {isSuccess ? "Borrowed! ✓" : "Confirm Borrow"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
