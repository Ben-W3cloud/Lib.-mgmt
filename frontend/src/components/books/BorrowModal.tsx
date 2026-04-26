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

import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Book } from "@/types";
import { useBorrowBook } from "@/hooks/useBorrow";
import { useContractConfig } from "@/hooks/useAdmin";
import { secondsToDays, daysToSeconds, formatDuration } from "@/lib/utils";
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

  // Close modal on success
  if (isSuccess) {
    setTimeout(() => onClose(), 1500);
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Borrow Book">
      <div className="space-y-6">
        {/* Book info summary */}
        <div className="bg-leather-brown/5 rounded-xl p-4 border border-leather-brown/10">
          <h3 className="font-serif text-lg font-semibold text-dark-walnut">
            {book.title}
          </h3>
          <p className="text-sm text-slate">by {book.author}</p>
        </div>

        {/* Duration slider */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-dark-walnut">
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
              className="w-full h-2 bg-leather-brown/10 rounded-full appearance-none cursor-pointer
                         [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
                         [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full
                         [&::-webkit-slider-thumb]:bg-leather-brown [&::-webkit-slider-thumb]:shadow-md
                         [&::-webkit-slider-thumb]:cursor-pointer"
            />
            <div className="flex justify-between text-xs text-slate">
              <span>1 day</span>
              <span className="font-semibold text-leather-brown text-sm">
                {days} day{days !== 1 ? "s" : ""}
              </span>
              <span>{maxDays} days</span>
            </div>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-parchment rounded-lg p-3 border border-leather-brown/10">
            <div className="flex items-center gap-1.5 text-xs text-slate mb-1">
              <Calendar className="w-3.5 h-3.5" />
              Return by
            </div>
            <p className="text-sm font-medium text-dark-walnut">{returnDate}</p>
          </div>
          <div className="bg-parchment rounded-lg p-3 border border-leather-brown/10">
            <div className="flex items-center gap-1.5 text-xs text-slate mb-1">
              <Award className="w-3.5 h-3.5" />
              Reward
            </div>
            <p className="text-sm font-medium text-forest-green">
              +{config?.borrowRewardPoints ?? 10} points
            </p>
          </div>
        </div>

        {/* Late return warning */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-gold-accent/5 border border-gold-accent/15">
          <AlertTriangle className="w-4 h-4 text-gold-accent mt-0.5 shrink-0" />
          <p className="text-xs text-slate">
            Late returns incur a penalty of{" "}
            <span className="font-semibold text-dusty-rose">
              {config?.latePenaltyPerDay ?? 2} points per day
            </span>
            . On-time returns earn{" "}
            <span className="font-semibold text-forest-green">
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
